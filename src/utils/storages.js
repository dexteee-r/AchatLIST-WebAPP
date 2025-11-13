// src/utils/storage.js



// Fonction pour sauvegarder les achats au format JSON
export function savePurchasesToJSON(items) {
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "achats.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}



// export default function importPurchasesJSON(file, setItems) { ... }
