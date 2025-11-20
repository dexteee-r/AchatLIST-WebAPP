import React from 'react';
import ItemCard from './ItemCard';

export default function ItemList({ items, onToggle, onEdit, onDelete }) {
  if (items.length === 0) {
    return (
      <section style={{ marginTop: 16 }}>
        <div className="panel" style={{ textAlign: 'center', color: 'var(--muted)', padding: '28px' }}>
          Aucun élément. Ajoute ton premier achat au-dessus 👆
        </div>
      </section>
    );
  }

  return (
    <section style={{ marginTop: 16 }}>
      <ul className="list">
        {items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  );
}
