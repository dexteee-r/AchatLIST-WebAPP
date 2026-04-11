import { useState } from 'react';
import { toast } from 'react-toastify';
import { PRIORITIES } from '../utils/constants';
import { scrapeProductInfo } from '../utils/scraper';
import TagInput from './TagInput';

export default function ItemForm({ draft, setDraft, onSubmit, editingId, onCancel }) {
  const [isScraping, setIsScraping] = useState(false);

  const addAttr = () => setDraft(d => ({ ...d, attributes: [...(d.attributes || []), { key: '', value: '' }] }));

  const updAttr = (idx, field, val) => setDraft(d => {
    const a = [...(d.attributes || [])];
    a[idx] = { ...a[idx], [field]: val };
    return { ...d, attributes: a };
  });

  const rmAttr = (idx) => setDraft(d => ({ ...d, attributes: d.attributes.filter((_, i) => i !== idx) }));

  // On URL blur: auto-fill only empty fields (non-destructive)
  const onUrlBlur = async () => {
    if (!draft.url) return;
    // Skip if all auto-fillable fields are already set
    if (draft.title && draft.imageUrl && draft.notes) return;

    setIsScraping(true);
    const info = await scrapeProductInfo(draft.url);
    setIsScraping(false);

    if (!info.title && !info.imageUrl && !info.description) return;

    // Snapshot current draft values to determine what actually gets filled
    const filled = [
      !draft.title && info.title && 'titre',
      !draft.imageUrl && info.imageUrl && 'image',
      !draft.notes && info.description && 'description',
      !draft.price && info.price && 'prix',
    ].filter(Boolean);

    setDraft(d => ({
      ...d,
      title: d.title || info.title,
      imageUrl: d.imageUrl || info.imageUrl,
      notes: d.notes || info.description,
      price: d.price || info.price,
    }));

    if (filled.length > 0) {
      toast.success(`Auto-rempli : ${filled.join(', ')}`);
    }
  };

  // 🔍 button: force re-fetch, overwrite all fields with non-empty results
  const handleFetchImage = async () => {
    if (!draft.url) {
      toast.warning("Ajoute d'abord un lien produit.");
      return;
    }

    // Warn before overwriting existing content
    const existing = [
      draft.title && 'titre',
      draft.notes && 'notes',
      draft.price && 'prix',
    ].filter(Boolean);
    if (existing.length > 0 && !window.confirm(
      `Le re-fetch va écraser : ${existing.join(', ')}. Continuer ?`
    )) return;

    setIsScraping(true);
    const info = await scrapeProductInfo(draft.url, { force: true });
    setIsScraping(false);

    if (!info.title && !info.imageUrl && !info.description && !info.price) {
      toast.error("Aucune information trouvée pour ce lien.");
      return;
    }

    setDraft(d => ({
      ...d,
      ...(info.title && { title: info.title }),
      ...(info.imageUrl && { imageUrl: info.imageUrl }),
      ...(info.description && { notes: info.description }),
      ...(info.price && { price: info.price }),
    }));

    const updated = [
      info.title && 'titre',
      info.imageUrl && 'image',
      info.description && 'description',
      info.price && 'prix',
    ].filter(Boolean);
    toast.success(`Récupéré : ${updated.join(', ')}`);
  };

  return (
    <section id="tour-form" className="panel">
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
                id="tour-url"
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
                disabled={isScraping}
              >
                {isScraping ? '⏳' : '🔍'}
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
            <div className="label">Tags</div>
            <TagInput
              tags={draft.tags || []}
              onChange={tags => setDraft(d => ({ ...d, tags }))}
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
