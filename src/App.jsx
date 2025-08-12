import React, { useEffect, useMemo, useState } from 'react'

// --- Priorités (affichage badges) ---
const PRIORITIES = [
  { id: 'high', label: 'Haute', weight: 3, cls: 'badge red' },
  { id: 'medium', label: 'Moyenne', weight: 2, cls: 'badge amber' },
  { id: 'low', label: 'Basse', weight: 1, cls: 'badge green' },
]

// --- Modèle d'élément ---
const emptyItem = () => ({
  id: crypto.randomUUID(),
  title: '',
  url: '',
  price: '',
  priority: 'medium',
  category: '',
  targetDate: '',
  notes: '',
  attributes: [],
  purchased: false,
  createdAt: Date.now(),
  imageUrl: '', // <- nouvelle propriété pour l’image
})

const STORAGE_KEY = 'purchaseList_plaincss_v1'

// --- Utilitaires ---
const pmeta = (id) => PRIORITIES.find(p => p.id === id) || PRIORITIES[1]
const validUrl = (u) => { if (!u) return true; try { new URL(u); return true } catch { return false } }

// Récupère l'image Open Graph via Microlink (évite les soucis CORS)
async function fetchProductImage(url) {
  if (!url) return ''
  try {
    const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`)
    const data = await res.json()
    return data?.data?.image?.url || ''
  } catch {
    return ''
  }
}

// --- Composant principal ---
export default function App() {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [draft, setDraft] = useState(emptyItem)
  const [editingId, setEditingId] = useState(null)
  const [filters, setFilters] = useState({ q: '', priority: 'all', showPurchased: 'all', category: 'all' })
  const [sort, setSort] = useState({ by: 'priority', dir: 'desc' })

  // Persistance
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // Catégories distinctes
  const categories = useMemo(() => {
    const s = new Set()
    items.forEach(i => i.category && s.add(i.category))
    return ['all', ...Array.from(s)]
  }, [items])

  // Liste filtrée/triée
  const filtered = useMemo(() => {
    let out = [...items]
    const q = filters.q.trim().toLowerCase()
    if (q) {
      out = out.filter(i =>
        [i.title, i.category, i.notes, i.url, ...(i.attributes || []).map(a => `${a.key}:${a.value}`)]
          .filter(Boolean)
          .some(t => t.toLowerCase().includes(q))
      )
    }
    if (filters.priority !== 'all') out = out.filter(i => i.priority === filters.priority)
    if (filters.showPurchased !== 'all') {
      const should = filters.showPurchased === 'purchased'
      out = out.filter(i => i.purchased === should)
    }
    if (filters.category !== 'all') out = out.filter(i => i.category === filters.category)

    out.sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1
      switch (sort.by) {
        case 'priority': return (pmeta(a.priority).weight - pmeta(b.priority).weight) * dir
        case 'price': return ((parseFloat(a.price) || 0) - (parseFloat(b.price) || 0)) * dir
        case 'date': return ((a.targetDate ? +new Date(a.targetDate) : 0) - (b.targetDate ? +new Date(b.targetDate) : 0)) * dir
        case 'createdAt': return ((a.createdAt || 0) - (b.createdAt || 0)) * dir
        case 'title': return a.title.localeCompare(b.title) * (sort.dir === 'asc' ? 1 : -1)
        default: return 0
      }
    })
    return out
  }, [items, filters, sort])

  // --- Budget total et restant ---
  const totalBudget = useMemo(
    () => items.reduce((sum, i) => sum + (parseFloat(i.price) || 0), 0),
    [items]
  )
  const totalRestant = useMemo(
    () => items.filter(i => !i.purchased).reduce((sum, i) => sum + (parseFloat(i.price) || 0), 0),
    [items]
  )

  // Actions formulaire
  function upsert(e) {
    e.preventDefault()
    if (!draft.title.trim()) return alert('Le titre est requis.')
    if (!validUrl(draft.url)) return alert('Lien invalide.')

    setItems(prev => {
      if (editingId) return prev.map(it => it.id === editingId ? { ...it, ...draft } : it)
      return [{ ...draft }, ...prev]
    })
    setDraft(emptyItem())
    setEditingId(null)
  }
  function edit(it) {
    setDraft({ ...it, price: it.price?.toString?.() ?? it.price })
    setEditingId(it.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function del(id) {
    if (!confirm('Supprimer cet article ?')) return
    setItems(prev => prev.filter(i => i.id !== id))
    if (editingId === id) { setEditingId(null); setDraft(emptyItem()) }
  }
  const toggle = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, purchased: !i.purchased } : i))
  const addAttr = () => setDraft(d => ({ ...d, attributes: [...(d.attributes || []), { key: '', value: '' }] }))
  const updAttr = (idx, field, val) => setDraft(d => {
    const a = [...(d.attributes || [])]
    a[idx] = { ...a[idx], [field]: val }
    return { ...d, attributes: a }
  })
  const rmAttr = (idx) => setDraft(d => ({ ...d, attributes: d.attributes.filter((_, i) => i !== idx) }))

  // Export / Import (avec imageUrl)
  function exportCSV(items) {
    const rows = [
      ["title", "url", "price", "priority", "category", "targetDate", "notes", "purchased", "attributes", "imageUrl"],
      ...items.map(i => [
        i.title, i.url, i.price, i.priority, i.category, i.targetDate,
        (i.notes || '').replaceAll('\n', ' '), i.purchased ? '1' : '0',
        JSON.stringify(i.attributes || []), i.imageUrl || ''
      ])
    ]
    const csv = rows.map(r => r.map(x => `"${(x ?? '').toString().replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `liste_achats_${new Date().toISOString().slice(0, 10)}.csv`; a.click()
    URL.revokeObjectURL(url)
  }
  function importJSON(ev, setItems) {
    const f = ev.target.files?.[0]; if (!f) return
    const r = new FileReader()
    r.onload = () => {
      try {
        const p = JSON.parse(r.result)
        if (!Array.isArray(p)) throw new Error('Format invalide')
        const n = p.map(i => ({
          id: i.id || crypto.randomUUID(),
          title: i.title || '',
          url: i.url || '',
          price: i.price ?? '',
          priority: PRIORITIES.some(p => p.id === i.priority) ? i.priority : 'medium',
          category: i.category || '',
          targetDate: i.targetDate || '',
          notes: i.notes || '',
          attributes: Array.isArray(i.attributes) ? i.attributes : [],
          purchased: !!i.purchased,
          createdAt: i.createdAt || Date.now(),
          imageUrl: i.imageUrl || '' // <- on préserve l’image si présente
        }))
        setItems(n)
      } catch (e) { alert('Import échoué: ' + e.message) }
      finally { ev.target.value = '' }
    }
    r.readAsText(f)
  }

  // Rechercher l'image quand on sort du champ URL (sans bloquer l'UX)
  async function onUrlBlur() {
    if (draft.url && !draft.imageUrl) {
      const img = await fetchProductImage(draft.url)
      if (img) setDraft(d => ({ ...d, imageUrl: img }))
    }
  }

  return (
    <div>
      <header className="header">
        <div className="header-inner container">
          <div className="title">🛒 Liste d’achats – MVP</div>
          <div className="toolbar">
            <button className="btn ghost" onClick={() => exportCSV(items)}>Exporter CSV</button>
            <label className="btn ghost" style={{ cursor: 'pointer' }}>
              Import JSON
              <input type="file" accept="application/json" onChange={(e) => importJSON(e, setItems)} style={{ display: 'none' }} />
            </label>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Formulaire */}
        <section className="panel">
          <form onSubmit={upsert} className="grid">
            <div className="grid-12">
              <div style={{ gridColumn: 'span 5' }} className="field">
                <div className="label">Titre *</div>
                <input className="input" placeholder="Ex: Écran 27'' 1440p" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
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
                      onClick={async () => {
                        if (!draft.url) return alert("Ajoute d'abord un lien produit.");
                        const img = await fetchProductImage(draft.url);
                        if (img) setDraft(d => ({ ...d, imageUrl: img }));
                        else alert("Aucune image trouvée pour ce lien.");
                      }}
                    >
                      🔍
                    </button>
                  </div>
                  <div className="small" style={{ marginTop: 6 }}>
                    L’image du produit sera récupérée automatiquement ou via le bouton.
                  </div>
                </div>
            </div>

            <div className="grid-12">
              <div style={{ gridColumn: 'span 2' }} className="field">
                <div className="label">Prix (EUR)</div>
                <input className="input" type="number" step="0.01" placeholder="0.00" value={draft.price} onChange={e => setDraft({ ...draft, price: e.target.value })} />
              </div>
              <div style={{ gridColumn: 'span 3' }} className="field">
                <div className="label">Priorité</div>
                <select className="select" value={draft.priority} onChange={e => setDraft({ ...draft, priority: e.target.value })}>
                  {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: 'span 3' }} className="field">
                <div className="label">Catégorie</div>
                <input className="input" placeholder="Ex: PC, Maison…" value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })} />
              </div>
              <div style={{ gridColumn: 'span 4' }} className="field">
                <div className="label">Date cible</div>
                <input className="input" type="date" value={draft.targetDate} onChange={e => setDraft({ ...draft, targetDate: e.target.value })} />
              </div>
            </div>

            <div className="field">
              <div className="label">Notes</div>
              <textarea className="textarea" placeholder="Critères, comparatifs, code promo, etc." value={draft.notes} onChange={e => setDraft({ ...draft, notes: e.target.value })} />
            </div>

            <div className="field">
              <div className="label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Attributs personnalisés</span>
                <button type="button" className="btn" onClick={addAttr}>+ Ajouter</button>
              </div>
              <div className="grid" style={{ gap: 8 }}>
                {(draft.attributes || []).map((a, idx) => (
                  <div key={idx} className="grid-12" style={{ gap: 8 }}>
                    <input className="input" style={{ gridColumn: 'span 5' }} placeholder="Clé (ex: Couleur)" value={a.key} onChange={e => updAttr(idx, 'key', e.target.value)} />
                    <input className="input" style={{ gridColumn: 'span 6' }} placeholder="Valeur (ex: Noir mat)" value={a.value} onChange={e => updAttr(idx, 'value', e.target.value)} />
                    <button type="button" className="btn" style={{ gridColumn: 'span 1' }} onClick={() => rmAttr(idx)}>Suppr</button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn primary" type="submit">{editingId ? 'Enregistrer' : 'Ajouter'}</button>
              <button type="button" className="btn" onClick={() => { setDraft(emptyItem()); setEditingId(null) }}>Réinitialiser</button>
            </div>
          </form>
        </section>

        {/* Résumé Budget */}
        <section className="panel" style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
          <span>💰 <strong>Total :</strong> {totalBudget.toFixed(2)} €</span>
          <span>🛍️ <strong>Reste à acheter :</strong> {totalRestant.toFixed(2)} €</span>
        </section>

        {/* Filtres */}
        <section className="panel" style={{ marginTop: 16 }}>
          <div className="toolbar-row">
            <div className="field" style={{ flex: 1 }}>
              <div className="label">Recherche</div>
              <input className="input" placeholder="Titre, catégorie, notes…" value={filters.q} onChange={e => setFilters({ ...filters, q: e.target.value })} />
            </div>
            <div className="field">
              <div className="label">Priorité</div>
              <select className="select" value={filters.priority} onChange={e => setFilters({ ...filters, priority: e.target.value })}>
                <option value="all">Toutes</option>
                {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
            <div className="field">
              <div className="label">État</div>
              <select className="select" value={filters.showPurchased} onChange={e => setFilters({ ...filters, showPurchased: e.target.value })}>
                <option value="all">Tous</option>
                <option value="unpurchased">À acheter</option>
                <option value="purchased">Achetés</option>
              </select>
            </div>
            <div className="field">
              <div className="label">Catégorie</div>
              <select className="select" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
                {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'Toutes' : c}</option>)}
              </select>
            </div>
            <div className="field">
              <div className="label">Trier par</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <select className="select" value={sort.by} onChange={e => setSort({ ...sort, by: e.target.value })}>
                  <option value="priority">Priorité</option>
                  <option value="price">Prix</option>
                  <option value="date">Date cible</option>
                  <option value="createdAt">Date d'ajout</option>
                  <option value="title">Titre</option>
                </select>
                <select className="select" value={sort.dir} onChange={e => setSort({ ...sort, dir: e.target.value })}>
                  <option value="asc">Asc</option>
                  <option value="desc">Desc</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Liste */}
        <section style={{ marginTop: 16 }}>
          {filtered.length === 0 ? (
            <div className="panel" style={{ textAlign: 'center', color: 'var(--muted)', padding: '28px' }}>
              Aucun élément. Ajoute ton premier achat au-dessus 👆
            </div>
          ) : (
            <ul className="list">
              {filtered.map(it => (
                <li key={it.id} className={`card ${it.purchased ? 'opacity-70' : ''}`}>
                  {/* Image produit (si trouvée) */}
                  {it.imageUrl && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={it.imageUrl}
                        alt={it.title}
                        style={{
                          width: 120,
                          height: 120,
                          objectFit: 'contain',
                          borderRadius: 8,
                          border: '1px solid var(--border)',
                          background: '#fff'
                        }}
                      />
                    </div>
                  )}

                  {/* Contenu texte */}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="chips">
                      <span className={pmeta(it.priority).cls}>{pmeta(it.priority).label}</span>
                      {it.category && <span className="badge">{it.category}</span>}
                      {it.price && <span className="badge">{Number.parseFloat(it.price).toFixed(2)} €</span>}
                      {it.targetDate && <span className="badge">Avant le {new Date(it.targetDate + "T00:00:00").toLocaleDateString()}</span>}
                      {it.purchased && <span className="badge green">Acheté</span>}
                    </div>
                    <h3 style={{ marginTop: 8, marginBottom: 4 }}>
                      {it.url ? <a className="url" href={it.url} target="_blank" rel="noreferrer">{it.title}</a> : it.title}
                    </h3>
                    {it.notes && <p className="small" style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{it.notes}</p>}
                    {Array.isArray(it.attributes) && it.attributes.length > 0 && (
                      <div className="chips" style={{ marginTop: 8 }}>
                        {it.attributes.map((a, i) => <span key={i} className="badge">{a.key}: <strong>{a.value}</strong></span>)}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="actions">
                    <button className="btn" onClick={() => toggle(it.id)}>{it.purchased ? 'Restaurer' : 'Marquer acheté'}</button>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {it.url && <button className="btn" onClick={() => navigator.clipboard.writeText(it.url)}>Copier lien</button>}
                      <button className="btn" onClick={() => edit(it)}>Éditer</button>
                      <button className="btn" style={{ borderColor: '#fecaca', color: '#b91c1c', background: '#fff5f5' }} onClick={() => del(it.id)}>Suppr</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="footer">LocalStorage • Aucune donnée n’est envoyée en ligne • v1.0</div>
      </main>
    </div>
  )
}
