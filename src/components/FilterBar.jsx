import { PRIORITIES } from '../utils/constants';

export default function FilterBar({ filters, setFilters, sort, setSort, categories, filteredCount, totalCount, onReset }) {
  const has_active_filters = filters.q || filters.priority !== 'all' || filters.showPurchased !== 'all'
    || filters.tag !== 'all' || filters.priceMin !== '' || filters.priceMax !== ''
    || sort.by !== 'priority' || sort.dir !== 'desc';

  return (
    <section id="tour-filters" className="panel" style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span className="small" style={{ color: 'var(--muted)' }}>
          {filteredCount} / {totalCount} article{totalCount > 1 ? 's' : ''}
        </span>
        {has_active_filters && (
          <button className="btn ghost" onClick={onReset} style={{ fontSize: 13, padding: '4px 10px' }}>
            Réinitialiser les filtres
          </button>
        )}
      </div>
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
            <option value="dismissed">Plus envie</option>
          </select>
        </div>
        <div className="field">
          <div className="label">Tag</div>
          <select
            className="select"
            value={filters.tag}
            onChange={e => setFilters({ ...filters, tag: e.target.value })}
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'all' ? 'Tous' : c}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <div className="label">Prix min / max</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="input"
              type="number"
              min="0"
              step="0.01"
              placeholder="Min €"
              value={filters.priceMin}
              onChange={e => setFilters({ ...filters, priceMin: e.target.value })}
              style={{ width: 80 }}
            />
            <input
              className="input"
              type="number"
              min="0"
              step="0.01"
              placeholder="Max €"
              value={filters.priceMax}
              onChange={e => setFilters({ ...filters, priceMax: e.target.value })}
              style={{ width: 80 }}
            />
          </div>
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
