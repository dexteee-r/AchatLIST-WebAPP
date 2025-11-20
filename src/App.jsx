import { useEffect, useMemo, useState } from 'react';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import FilterBar from './components/FilterBar';
import BudgetSummary from './components/BudgetSummary';
import { savePurchasesToJSON } from './utils/storages';
import { emptyItem, STORAGE_KEY } from './utils/constants';
import { pmeta, validUrl, exportCSV, importJSON } from './utils/helpers';

export default function App() {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [draft, setDraft] = useState(emptyItem);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ q: '', priority: 'all', showPurchased: 'all', category: 'all' });
  const [sort, setSort] = useState({ by: 'priority', dir: 'desc' });

  // Persistance
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Catégories distinctes
  const categories = useMemo(() => {
    const s = new Set();
    items.forEach(i => i.category && s.add(i.category));
    return ['all', ...Array.from(s)];
  }, [items]);

  // Liste filtrée/triée
  const filteredItems = useMemo(() => {
    let out = [...items];
    const q = filters.q.trim().toLowerCase();
    if (q) {
      out = out.filter(i =>
        [i.title, i.category, i.notes, i.url, ...(i.attributes || []).map(a => `${a.key}:${a.value}`)]
          .filter(Boolean)
          .some(t => t.toLowerCase().includes(q))
      );
    }
    if (filters.priority !== 'all') out = out.filter(i => i.priority === filters.priority);
    if (filters.showPurchased !== 'all') {
      const should = filters.showPurchased === 'purchased';
      out = out.filter(i => i.purchased === should);
    }
    if (filters.category !== 'all') out = out.filter(i => i.category === filters.category);

    out.sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1;
      switch (sort.by) {
        case 'priority': return (pmeta(a.priority).weight - pmeta(b.priority).weight) * dir;
        case 'price': return ((parseFloat(a.price) || 0) - (parseFloat(b.price) || 0)) * dir;
        case 'date': return ((a.targetDate ? +new Date(a.targetDate) : 0) - (b.targetDate ? +new Date(b.targetDate) : 0)) * dir;
        case 'createdAt': return ((a.createdAt || 0) - (b.createdAt || 0)) * dir;
        case 'title': return a.title.localeCompare(b.title) * (sort.dir === 'asc' ? 1 : -1);
        default: return 0;
      }
    });
    return out;
  }, [items, filters, sort]);

  // Budget total et restant
  const totalBudget = useMemo(
    () => items.reduce((sum, i) => sum + (parseFloat(i.price) || 0), 0),
    [items]
  );
  const totalRestant = useMemo(
    () => items.filter(i => !i.purchased).reduce((sum, i) => sum + (parseFloat(i.price) || 0), 0),
    [items]
  );

  // Actions formulaire
  function upsert(e) {
    e.preventDefault();
    if (!draft.title.trim()) return alert('Le titre est requis.');
    if (!validUrl(draft.url)) return alert('Lien invalide.');

    setItems(prev => {
      if (editingId) return prev.map(it => it.id === editingId ? { ...it, ...draft } : it);
      return [{ ...draft }, ...prev];
    });
    setDraft(emptyItem());
    setEditingId(null);
  }

  function edit(it) {
    setDraft({ ...it, price: it.price?.toString?.() ?? it.price });
    setEditingId(it.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function del(id) {
    if (!confirm('Supprimer cet article ?')) return;
    setItems(prev => prev.filter(i => i.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setDraft(emptyItem());
    }
  }

  const toggle = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, purchased: !i.purchased } : i));

  const handleCancel = () => {
    setDraft(emptyItem());
    setEditingId(null);
  };

  return (
    <div>
      <header className="header">
        <div className="header-inner container">
          <div className="title">🛒 Liste d'achats – MVP</div>
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
        <ItemForm
          draft={draft}
          setDraft={setDraft}
          onSubmit={upsert}
          editingId={editingId}
          onCancel={handleCancel}
        />

        <button type="button" className="btn" onClick={() => savePurchasesToJSON(items)}>
          Sauvegarder la liste (load a JSON)
        </button>

        <BudgetSummary totalBudget={totalBudget} totalRestant={totalRestant} />

        <FilterBar
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          setSort={setSort}
          categories={categories}
        />

        <ItemList
          items={filteredItems}
          onToggle={toggle}
          onEdit={edit}
          onDelete={del}
        />

        <div className="footer">LocalStorage • Aucune donnée n'est envoyée en ligne • v1.0</div>
      </main>
    </div>
  );
}
