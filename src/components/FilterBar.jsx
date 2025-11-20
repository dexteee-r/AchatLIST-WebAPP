import React from 'react';

const PRIORITIES = [
  { id: 'high', label: 'Haute', weight: 3, cls: 'badge red' },
  { id: 'medium', label: 'Moyenne', weight: 2, cls: 'badge amber' },
  { id: 'low', label: 'Basse', weight: 1, cls: 'badge green' },
];

export default function FilterBar({ filters, setFilters, sort, setSort, categories }) {
  return (
    <section className="panel" style={{ marginTop: 16 }}>
      <div className="toolbar-row">
        <div className="field" style={{ flex: 1 }}>
          <div className="label">Recherche</div>
          <input
            className="input"
            placeholder="Titre, catégorie, notes…"
            value={filters.q}
            onChange={e => setFilters({ ...filters, q: e.target.value })}
          />
        </div>
        <div className="field">
          <div className="label">Priorité</div>
          <select
            className="select"
            value={filters.priority}
            onChange={e => setFilters({ ...filters, priority: e.target.value })}
          >
            <option value="all">Toutes</option>
            {PRIORITIES.map(p => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <div className="label">État</div>
          <select
            className="select"
            value={filters.showPurchased}
            onChange={e => setFilters({ ...filters, showPurchased: e.target.value })}
          >
            <option value="all">Tous</option>
            <option value="unpurchased">À acheter</option>
            <option value="purchased">Achetés</option>
          </select>
        </div>
        <div className="field">
          <div className="label">Catégorie</div>
          <select
            className="select"
            value={filters.category}
            onChange={e => setFilters({ ...filters, category: e.target.value })}
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'all' ? 'Toutes' : c}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <div className="label">Trier par</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <select
              className="select"
              value={sort.by}
              onChange={e => setSort({ ...sort, by: e.target.value })}
            >
              <option value="priority">Priorité</option>
              <option value="price">Prix</option>
              <option value="date">Date cible</option>
              <option value="createdAt">Date d'ajout</option>
              <option value="title">Titre</option>
            </select>
            <select
              className="select"
              value={sort.dir}
              onChange={e => setSort({ ...sort, dir: e.target.value })}
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
