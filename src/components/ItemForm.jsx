import { useState } from 'react';
import { toast } from 'react-toastify';

const PRIORITIES = [
  { id: 'high', label: 'Haute', weight: 3, cls: 'badge red' },
  { id: 'medium', label: 'Moyenne', weight: 2, cls: 'badge amber' },
  { id: 'low', label: 'Basse', weight: 1, cls: 'badge green' },
];

async function fetchProductImage(url) {
  if (!url) return '';
  try {
    const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    return data?.data?.image?.url || '';
  } catch {
    return '';
  }
}

export default function ItemForm({ draft, setDraft, onSubmit, editingId, onCancel }) {
  const [loadingImage, setLoadingImage] = useState(false);
  const addAttr = () => setDraft(d => ({ ...d, attributes: [...(d.attributes || []), { key: '', value: '' }] }));

  const updAttr = (idx, field, val) => setDraft(d => {
    const a = [...(d.attributes || [])];
    a[idx] = { ...a[idx], [field]: val };
    return { ...d, attributes: a };
  });

  const rmAttr = (idx) => setDraft(d => ({ ...d, attributes: d.attributes.filter((_, i) => i !== idx) }));

  const onUrlBlur = async () => {
    if (draft.url && !draft.imageUrl) {
      setLoadingImage(true);
      const img = await fetchProductImage(draft.url);
      if (img) {
        setDraft(d => ({ ...d, imageUrl: img }));
        toast.success('Image récupérée !');
      }
      setLoadingImage(false);
    }
  };

  const handleFetchImage = async () => {
    if (!draft.url) {
      toast.warning("Ajoute d'abord un lien produit.");
      return;
    }
    setLoadingImage(true);
    const img = await fetchProductImage(draft.url);
    setLoadingImage(false);

    if (img) {
      setDraft(d => ({ ...d, imageUrl: img }));
      toast.success('Image récupérée !');
    } else {
      toast.error("Aucune image trouvée pour ce lien.");
    }
  };

  return (
    <section className="panel">
      <form onSubmit={onSubmit} className="grid">
        <div className="grid-12">
          <div style={{ gridColumn: 'span 5' }} className="field">
            <div className="label">Titre *</div>
            <input
              className="input"
              placeholder="Ex: Écran 27'' 1440p"
              value={draft.title}
              onChange={e => setDraft({ ...draft, title: e.target.value })}
            />
          </div>
          <div style={{ gridColumn: 'span 7' }} className="field">
            <div className="label">Lien (URL)</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                className="input"
                placeholder="https://…"
                style={{ flex: 1 }}
                value={draft.url}
                onChange={e => setDraft({ ...draft, url: e.target.value })}
                onBlur={onUrlBlur}
              />
              <button
                type="button"
                className="btn"
                style={{ whiteSpace: 'nowrap' }}
                onClick={handleFetchImage}
                disabled={loadingImage}
              >
                {loadingImage ? '⏳' : '🔍'}
              </button>
            </div>
            <div className="small" style={{ marginTop: 6 }}>
              L'image du produit sera récupérée automatiquement ou via le bouton.
            </div>
          </div>
        </div>

        <div className="grid-12">
          <div style={{ gridColumn: 'span 2' }} className="field">
            <div className="label">Prix (EUR)</div>
            <input
              className="input"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={draft.price}
              onChange={e => setDraft({ ...draft, price: e.target.value })}
            />
          </div>
          <div style={{ gridColumn: 'span 3' }} className="field">
            <div className="label">Priorité</div>
            <select
              className="select"
              value={draft.priority}
              onChange={e => setDraft({ ...draft, priority: e.target.value })}
            >
              {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: 'span 3' }} className="field">
            <div className="label">Catégorie</div>
            <input
              className="input"
              placeholder="Ex: PC, Maison…"
              value={draft.category}
              onChange={e => setDraft({ ...draft, category: e.target.value })}
            />
          </div>
          <div style={{ gridColumn: 'span 4' }} className="field">
            <div className="label">Date cible</div>
            <input
              className="input"
              type="date"
              value={draft.targetDate}
              onChange={e => setDraft({ ...draft, targetDate: e.target.value })}
            />
          </div>
        </div>

        <div className="field">
          <div className="label">Notes</div>
          <textarea
            className="textarea"
            placeholder="Critères, comparatifs, code promo, etc."
            value={draft.notes}
            onChange={e => setDraft({ ...draft, notes: e.target.value })}
          />
        </div>

        <div className="field">
          <div className="label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Attributs personnalisés</span>
            <button type="button" className="btn" onClick={addAttr}>+ Ajouter</button>
          </div>

          <div className="grid" style={{ gap: 8 }}>
            {(draft.attributes || []).map((a, idx) => (
              <div key={idx} className="grid-12" style={{ gap: 8 }}>
                <input
                  className="input"
                  style={{ gridColumn: 'span 5' }}
                  placeholder="Clé (ex: Couleur)"
                  value={a.key}
                  onChange={e => updAttr(idx, 'key', e.target.value)}
                />
                <input
                  className="input"
                  style={{ gridColumn: 'span 6' }}
                  placeholder="Valeur (ex: Noir mat)"
                  value={a.value}
                  onChange={e => updAttr(idx, 'value', e.target.value)}
                />
                <button
                  type="button"
                  className="btn"
                  style={{ gridColumn: 'span 1' }}
                  onClick={() => rmAttr(idx)}
                >
                  Suppr
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn primary" type="submit">
            {editingId ? 'Enregistrer' : 'Ajouter'}
          </button>
          <button type="button" className="btn" onClick={onCancel}>
            Réinitialiser
          </button>
        </div>
      </form>
    </section>
  );
}
