import React from 'react';

export default function BudgetSummary({ totalBudget, totalRestant }) {
  return (
    <section className="panel" style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
      <span>💰 <strong>Total :</strong> {totalBudget.toFixed(2)} €</span>
      <span>🛍️ <strong>Reste à acheter :</strong> {totalRestant.toFixed(2)} €</span>
    </section>
  );
}
