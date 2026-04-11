
export default function BudgetSummary({ totalBudget, totalRestant, filteredItems }) {
  const filtered_to_buy = filteredItems
    .filter(i => !i.purchased && !i.dismissed)
    .reduce((sum, i) => sum + (parseFloat(i.price) || 0), 0);

  return (
    <section id="tour-budget" className="panel" style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
      <span>💰 <strong>Total :</strong> {totalBudget.toFixed(2)} €</span>
      <span>🛍️ <strong>Reste à acheter :</strong> {totalRestant.toFixed(2)} €</span>
      {filtered_to_buy !== totalRestant && (
        <span>🔍 <strong>Filtré (à acheter) :</strong> {filtered_to_buy.toFixed(2)} €</span>
      )}
    </section>
  );
}
