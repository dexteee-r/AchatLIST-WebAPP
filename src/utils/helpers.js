import { toast } from 'react-toastify';
import { PRIORITIES } from './constants';

export const pmeta = (id) => PRIORITIES.find(p => p.id === id) || PRIORITIES[1];

export const validUrl = (u) => {
  if (!u) return true;
  try {
    new URL(u);
    return true;
  } catch {
    return false;
  }
};

export async function fetchProductImage(url) {
  if (!url) return '';
  try {
    const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    return data?.data?.image?.url || '';
  } catch {
    return '';
  }
}

export function exportCSV(items) {
  const rows = [
    ["title", "url", "price", "priority", "category", "targetDate", "notes", "purchased", "attributes", "imageUrl"],
    ...items.map(i => [
      i.title, i.url, i.price, i.priority, i.category, i.targetDate,
      (i.notes || '').replaceAll('\n', ' '), i.purchased ? '1' : '0',
      JSON.stringify(i.attributes || []), i.imageUrl || ''
    ])
  ];
  const csv = rows.map(r => r.map(x => `"${(x ?? '').toString().replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `liste_achats_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('Export CSV réussi !');
}

export function importJSON(ev, setItems) {
  const f = ev.target.files?.[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const p = JSON.parse(r.result);
      if (!Array.isArray(p)) throw new Error('Format invalide');
      const n = p.map(i => ({
        id: i.id || crypto.randomUUID(),
        title: i.title || '',
        url: i.url || '',
        price: i.price ?? '',
        priority: PRIORITIES.some(p => p.id === i.priority) ? i.priority : 'medium',
        category: i.category || '',
        targetDate: i.targetDate || '',
        notes: i.notes || '',
        attributes: Array.isArray(i.attributes) ? i.attributes : [],
        purchased: !!i.purchased,
        createdAt: i.createdAt || Date.now(),
        imageUrl: i.imageUrl || ''
      }));
      setItems(n);
      toast.success(`${n.length} article(s) importé(s) !`);
    } catch (e) {
      toast.error('Import échoué: ' + e.message);
    } finally {
      ev.target.value = '';
    }
  };
  r.readAsText(f);
}
