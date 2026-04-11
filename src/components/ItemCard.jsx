import { pmeta } from '../utils/helpers';

export default function ItemCard({ item, onToggle, onEdit, onDelete, onDismiss }) {
  const priority_meta = pmeta(item.priority);

  return (
    <li className={`card ${item.purchased ? 'opacity-70' : ''} ${item.dismissed ? 'opacity-50' : ''}`}>
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
          <span className={priority_meta.cls}>{priority_meta.label}</span>
          {(item.tags || []).map(tag => <span key={tag} className="badge">{tag}</span>)}
          {item.price && <span className="badge">{Number.parseFloat(item.price).toFixed(2)} €</span>}
          {item.targetDate && (
            <span className="badge">
              Avant le {new Date(item.targetDate + "T00:00:00").toLocaleDateString()}
            </span>
          )}
          {item.purchased && <span className="badge green">Acheté</span>}
          {item.dismissed && <span className="badge" style={{ background: '#f3f4f6', color: '#6b7280' }}>Plus envie</span>}
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
        <button
          className="btn"
          style={item.dismissed
            ? { borderColor: '#bbf7d0', color: '#15803d', background: '#f0fdf4' }
            : { borderColor: '#e5e7eb', color: '#6b7280', background: '#f9fafb' }
          }
          onClick={() => onDismiss(item.id)}
        >
          {item.dismissed ? 'Remettre' : 'Plus envie'}
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
