export const PRIORITIES = [
  { id: 'high', label: 'Haute', weight: 3, cls: 'badge red' },
  { id: 'medium', label: 'Moyenne', weight: 2, cls: 'badge amber' },
  { id: 'low', label: 'Basse', weight: 1, cls: 'badge green' },
];

export const STORAGE_KEY = 'purchaseList_plaincss_v1';

export const emptyItem = () => ({
  id: crypto.randomUUID(),
  title: '',
  url: '',
  price: '',
  priority: 'high',
  category: '',
  targetDate: '',
  notes: '',
  attributes: [],
  purchased: false,
  createdAt: Date.now(),
  imageUrl: '',
});
