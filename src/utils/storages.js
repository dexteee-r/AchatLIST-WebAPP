// src/utils/storage.js



// Fonction pour sauvegarder les achats au format JSON
export function savePurchasesToJSON(items) {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `liste_achats_${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}



// export default function importPurchasesJSON(file, setItems) { ... }
