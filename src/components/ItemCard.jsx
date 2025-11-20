import React from 'react';

const PRIORITIES = [
  { id: 'high', label: 'Haute', weight: 3, cls: 'badge red' },
  { id: 'medium', label: 'Moyenne', weight: 2, cls: 'badge amber' },
  { id: 'low', label: 'Basse', weight: 1, cls: 'badge green' },
];

const pmeta = (id) => PRIORITIES.find(p => p.id === id) || PRIORITIES[1];

export default function ItemCard({ item, onToggle, onEdit, onDelete }) {
  return (
    <li className={`card ${item.purchased ? 'opacity-70' : ''}`}>
      {/* Image produit (si trouvée) */}
      {item.imageUrl && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={item.imageUrl}
            alt={item.title}
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
          <span className={pmeta(item.priority).cls}>{pmeta(item.priority).label}</span>
          {item.category && <span className="badge">{item.category}</span>}
          {item.price && <span className="badge">{Number.parseFloat(item.price).toFixed(2)} €</span>}
          {item.targetDate && (
            <span className="badge">
              Avant le {new Date(item.targetDate + "T00:00:00").toLocaleDateString()}
            </span>
          )}
          {item.purchased && <span className="badge green">Acheté</span>}
        </div>
        <h3 style={{ marginTop: 8, marginBottom: 4 }}>
          {item.url ? (
            <a className="url" href={item.url} target="_blank" rel="noreferrer">
              {item.title}
            </a>
          ) : (
            item.title
          )}
        </h3>
        {item.notes && (
          <p className="small" style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>
            {item.notes}
          </p>
        )}
        {Array.isArray(item.attributes) && item.attributes.length > 0 && (
          <div className="chips" style={{ marginTop: 8 }}>
            {item.attributes.map((a, i) => (
              <span key={i} className="badge">
                {a.key}: <strong>{a.value}</strong>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="actions">
        <button className="btn" onClick={() => onToggle(item.id)}>
          {item.purchased ? 'Restaurer' : 'Marquer acheté'}
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          {item.url && (
            <button
              className="btn"
              onClick={() => navigator.clipboard.writeText(item.url)}
            >
              Copier lien
            </button>
          )}
          <button className="btn" onClick={() => onEdit(item)}>
            Éditer
          </button>
          <button
            className="btn"
            style={{ borderColor: '#fecaca', color: '#b91c1c', background: '#fff5f5' }}
            onClick={() => onDelete(item.id)}
          >
            Suppr
          </button>
        </div>
      </div>
    </li>
  );
}
