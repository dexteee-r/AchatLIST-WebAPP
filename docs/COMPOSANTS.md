# Documentation des Composants

Ce document décrit en détail chaque composant de l'application, ses props, son comportement, et comment l'utiliser.

## 📋 Table des Matières

1. [App.jsx](#appjsx) - Composant racine
2. [ItemForm.jsx](#itemformjsx) - Formulaire d'ajout/édition
3. [ItemCard.jsx](#itemcardjsx) - Carte d'article
4. [ItemList.jsx](#itemlistjsx) - Liste d'articles
5. [FilterBar.jsx](#filterbarjsx) - Barre de filtres
6. [BudgetSummary.jsx](#budgetsummaryjsx) - Résumé budgétaire

---

## App.jsx

**Chemin :** `src/App.jsx`
**Lignes :** 163
**Type :** Composant racine / Container

### Description

Composant principal de l'application qui gère tout l'état global et la logique métier. C'est le seul composant "intelligent" qui contient la logique d'affaires. Tous les autres composants sont des composants de présentation.

### État Géré

```javascript
const [items, setItems] = useState([])           // Liste de tous les articles
const [draft, setDraft] = useState(emptyItem)    // Article en cours d'édition/création
const [editingId, setEditingId] = useState(null) // ID de l'article en édition (null = création)
const [filters, setFilters] = useState({...})    // État des filtres
const [sort, setSort] = useState({...})          // État du tri
```

### Valeurs Calculées (useMemo)

```javascript
const categories = useMemo(...)     // Liste des catégories distinctes
const filteredItems = useMemo(...)  // Articles filtrés et triés
const totalBudget = useMemo(...)    // Budget total (tous articles)
const totalRestant = useMemo(...)   // Budget restant (non achetés)
```

### Fonctions Principales

#### `upsert(e)`
- **Paramètres :** `e: Event` - Event du formulaire
- **Description :** Ajoute un nouvel article ou met à jour un existant
- **Validation :**
  - Titre requis
  - URL valide (si fournie)
- **Comportement :**
  - Si `editingId` existe → mise à jour
  - Sinon → ajout en début de liste
  - Réinitialise le formulaire après succès

#### `edit(item)`
- **Paramètres :** `item: Item` - Article à éditer
- **Description :** Charge un article dans le formulaire pour édition
- **Comportement :**
  - Remplit `draft` avec les données de l'article
  - Définit `editingId`
  - Scroll en haut de page

#### `del(id)`
- **Paramètres :** `id: string` - UUID de l'article
- **Description :** Supprime un article après confirmation
- **Comportement :**
  - Demande confirmation
  - Filtre l'article de la liste
  - Réinitialise le formulaire si l'article supprimé était en édition

#### `toggle(id)`
- **Paramètres :** `id: string` - UUID de l'article
- **Description :** Bascule l'état acheté/non acheté d'un article
- **Comportement :** Inverse la propriété `purchased`

### Effets (useEffect)

```javascript
// Persistance automatique dans localStorage
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}, [items]);
```

### Rendu

```jsx
<div>
  <header>
    {/* Barre de titre + Import/Export */}
  </header>

  <main className="container">
    <ItemForm />              {/* Formulaire */}
    <button />                {/* Sauvegarde JSON */}
    <BudgetSummary />         {/* Budget */}
    <FilterBar />             {/* Filtres et tri */}
    <ItemList />              {/* Liste des articles */}
    <footer />                {/* Info confidentialité */}
  </main>
</div>
```

### Exemple d'Utilisation

```jsx
// Point d'entrée dans main.jsx
import App from './App';
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

---

## ItemForm.jsx

**Chemin :** `src/components/ItemForm.jsx`
**Lignes :** 169
**Type :** Composant contrôlé

### Description

Formulaire complexe pour ajouter ou éditer un article. Gère tous les champs de saisie, la validation, et la récupération automatique d'images.

### Props

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `draft` | `Item` | ✅ | Objet contenant les valeurs du formulaire |
| `setDraft` | `Function` | ✅ | Fonction pour mettre à jour draft |
| `onSubmit` | `Function` | ✅ | Callback appelé à la soumission (reçoit event) |
| `editingId` | `string \| null` | ✅ | ID de l'article en édition (null = création) |
| `onCancel` | `Function` | ✅ | Callback pour réinitialiser le formulaire |

### Fonctions Internes

#### `addAttr()`
- **Description :** Ajoute un nouvel attribut personnalisé vide
- **Comportement :** Ajoute `{key: '', value: ''}` à `draft.attributes`

#### `updAttr(idx, field, val)`
- **Paramètres :**
  - `idx: number` - Index de l'attribut
  - `field: 'key' | 'value'` - Champ à modifier
  - `val: string` - Nouvelle valeur
- **Description :** Met à jour un attribut existant

#### `rmAttr(idx)`
- **Paramètres :** `idx: number` - Index de l'attribut à supprimer
- **Description :** Supprime un attribut de la liste

#### `onUrlBlur()`
- **Description :** Récupère automatiquement l'image quand l'utilisateur quitte le champ URL
- **Comportement :**
  - Vérifie que URL est remplie
  - Vérifie que imageUrl est vide (évite refetch)
  - Appelle `fetchProductImage()`
  - Met à jour draft.imageUrl si succès

#### `handleFetchImage()`
- **Description :** Recherche manuelle d'image via le bouton 🔍
- **Comportement :**
  - Vérifie que URL est remplie (sinon alerte)
  - Appelle `fetchProductImage()`
  - Alerte si aucune image trouvée

### Champs du Formulaire

| Champ | Type | Requis | Placeholder | Notes |
|-------|------|--------|-------------|-------|
| **Titre** | text | ✅ | "Ex: Écran 27'' 1440p" | Champ principal |
| **URL** | text | ❌ | "https://…" | Validé au submit, trigger fetch image onBlur |
| **Prix** | number | ❌ | "0.00" | step="0.01", en EUR |
| **Priorité** | select | ✅ | - | Haute/Moyenne/Basse, défaut: high |
| **Catégorie** | text | ❌ | "Ex: PC, Maison…" | Utilisé pour filtres |
| **Date cible** | date | ❌ | - | Format ISO YYYY-MM-DD |
| **Notes** | textarea | ❌ | "Critères, comparatifs…" | Multiligne, pré-wrap |
| **Attributs** | dynamic | ❌ | - | Liste dynamique clé-valeur |

### Layout

Utilise CSS Grid avec `grid-12` pour layout responsive :

```jsx
<div className="grid-12">
  <div style={{ gridColumn: 'span 5' }}>   {/* Titre : 5 cols */}
  <div style={{ gridColumn: 'span 7' }}>   {/* URL : 7 cols */}
</div>

<div className="grid-12">
  <div style={{ gridColumn: 'span 2' }}>   {/* Prix : 2 cols */}
  <div style={{ gridColumn: 'span 3' }}>   {/* Priorité : 3 cols */}
  <div style={{ gridColumn: 'span 3' }}>   {/* Catégorie : 3 cols */}
  <div style={{ gridColumn: 'span 4' }}>   {/* Date : 4 cols */}
</div>
```

### Exemple d'Utilisation

```jsx
<ItemForm
  draft={draft}
  setDraft={setDraft}
  onSubmit={handleSubmit}
  editingId={editingId}
  onCancel={() => {
    setDraft(emptyItem());
    setEditingId(null);
  }}
/>
```

### États du Formulaire

**Mode Création :** `editingId === null`
- Bouton : "Ajouter"
- Soumission : Ajoute au début de la liste

**Mode Édition :** `editingId !== null`
- Bouton : "Enregistrer"
- Soumission : Remplace l'article existant

---

## ItemCard.jsx

**Chemin :** `src/components/ItemCard.jsx`
**Lignes :** 94
**Type :** Composant de présentation

### Description

Carte d'affichage d'un article individuel. Affiche toutes les informations d'un article avec des badges visuels et des actions.

### Props

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `item` | `Item` | ✅ | Objet article à afficher |
| `onToggle` | `Function` | ✅ | Callback pour marquer acheté/non acheté (reçoit id) |
| `onEdit` | `Function` | ✅ | Callback pour éditer (reçoit item complet) |
| `onDelete` | `Function` | ✅ | Callback pour supprimer (reçoit id) |

### Structure Visuelle

```
┌────────────────────────────────────────────────┐
│ [Image]  [Badges: priorité, catégorie, prix]  │
│          [Titre (lien si URL)]                 │
│          [Notes en pré-wrap]                   │
│          [Attributs: clé: valeur]              │
│                                                │
│          [Marquer acheté] [Copier] [Éditer]   │
│          [Supprimer]                           │
└────────────────────────────────────────────────┘
```

### Affichage Conditionnel

#### Image Produit
```jsx
{item.imageUrl && (
  <img src={item.imageUrl} alt={item.title} ... />
)}
```
- Taille : 120x120px
- object-fit: contain
- Border radius: 8px
- Background: blanc

#### Badges

| Condition | Badge | Style |
|-----------|-------|-------|
| Toujours | Priorité | red/amber/green selon priority |
| Si `item.category` | Catégorie | badge gris |
| Si `item.price` | Prix | "XX.XX €" |
| Si `item.targetDate` | Date | "Avant le DD/MM/YYYY" |
| Si `item.purchased` | "Acheté" | badge green |

#### Titre
```jsx
{item.url ? (
  <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
) : (
  item.title
)}
```

#### Notes
```jsx
{item.notes && (
  <p style={{ whiteSpace: 'pre-wrap' }}>{item.notes}</p>
)}
```

#### Attributs
```jsx
{Array.isArray(item.attributes) && item.attributes.length > 0 && (
  <div className="chips">
    {item.attributes.map((a, i) => (
      <span key={i} className="badge">{a.key}: <strong>{a.value}</strong></span>
    ))}
  </div>
)}
```

### Actions

| Bouton | Condition | Action |
|--------|-----------|--------|
| "Marquer acheté" / "Restaurer" | Toujours | `onToggle(item.id)` |
| "Copier lien" | Si `item.url` | Copie URL dans presse-papiers |
| "Éditer" | Toujours | `onEdit(item)` |
| "Suppr" | Toujours | `onDelete(item.id)` |

### Styles Dynamiques

#### Opacité
```jsx
<li className={`card ${item.purchased ? 'opacity-70' : ''}`}>
```

#### Bouton Supprimer
```jsx
<button
  style={{
    borderColor: '#fecaca',
    color: '#b91c1c',
    background: '#fff5f5'
  }}
>
  Suppr
</button>
```

### Exemple d'Utilisation

```jsx
<ItemCard
  item={{
    id: '123',
    title: 'MacBook Pro',
    url: 'https://apple.com/...',
    price: '2499',
    priority: 'high',
    category: 'Tech',
    targetDate: '2025-12-25',
    notes: 'Promo Black Friday',
    attributes: [{ key: 'RAM', value: '32GB' }],
    purchased: false,
    imageUrl: 'https://...'
  }}
  onToggle={(id) => console.log('Toggle', id)}
  onEdit={(item) => console.log('Edit', item)}
  onDelete={(id) => console.log('Delete', id)}
/>
```

---

## ItemList.jsx

**Chemin :** `src/components/ItemList.jsx`
**Lignes :** 28
**Type :** Composant de présentation

### Description

Container pour la liste d'articles. Gère l'affichage de la liste ou d'un message vide.

### Props

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `items` | `Array<Item>` | ✅ | Liste des articles à afficher (déjà filtrés/triés) |
| `onToggle` | `Function` | ✅ | Callback passé à chaque ItemCard |
| `onEdit` | `Function` | ✅ | Callback passé à chaque ItemCard |
| `onDelete` | `Function` | ✅ | Callback passé à chaque ItemCard |

### Comportement

#### Liste Vide

```jsx
if (items.length === 0) {
  return (
    <div className="panel" style={{ textAlign: 'center', padding: '28px' }}>
      Aucun élément. Ajoute ton premier achat au-dessus 👆
    </div>
  );
}
```

#### Liste Avec Éléments

```jsx
<ul className="list">
  {items.map(item => (
    <ItemCard key={item.id} item={item} ... />
  ))}
</ul>
```

### Exemple d'Utilisation

```jsx
<ItemList
  items={filteredItems}
  onToggle={toggle}
  onEdit={edit}
  onDelete={del}
/>
```

### Notes

- Attend des items **déjà filtrés et triés** depuis App
- Utilise `item.id` comme key React (UUID unique)
- Délègue toute la logique de rendu à ItemCard

---

## FilterBar.jsx

**Chemin :** `src/components/FilterBar.jsx`
**Lignes :** 89
**Type :** Composant contrôlé

### Description

Barre complète de filtrage et tri avec 5 contrôles : recherche, priorité, état, catégorie, et tri.

### Props

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `filters` | `Object` | ✅ | État actuel des filtres |
| `setFilters` | `Function` | ✅ | Fonction pour mettre à jour filters |
| `sort` | `Object` | ✅ | État actuel du tri |
| `setSort` | `Function` | ✅ | Fonction pour mettre à jour sort |
| `categories` | `Array<string>` | ✅ | Liste des catégories disponibles (inclut 'all') |

### Structure de `filters`

```javascript
{
  q: string,                          // Recherche textuelle
  priority: 'all' | 'high' | 'medium' | 'low',
  showPurchased: 'all' | 'unpurchased' | 'purchased',
  category: string                    // 'all' ou nom de catégorie
}
```

### Structure de `sort`

```javascript
{
  by: 'priority' | 'price' | 'date' | 'createdAt' | 'title',
  dir: 'asc' | 'desc'
}
```

### Contrôles

#### 1. Recherche Textuelle
```jsx
<input
  placeholder="Titre, catégorie, notes…"
  value={filters.q}
  onChange={e => setFilters({ ...filters, q: e.target.value })}
/>
```
- Recherche dans : titre, catégorie, notes, URL, attributs
- Insensible à la casse

#### 2. Filtre Priorité
```jsx
<select value={filters.priority}>
  <option value="all">Toutes</option>
  <option value="high">Haute</option>
  <option value="medium">Moyenne</option>
  <option value="low">Basse</option>
</select>
```

#### 3. Filtre État
```jsx
<select value={filters.showPurchased}>
  <option value="all">Tous</option>
  <option value="unpurchased">À acheter</option>
  <option value="purchased">Achetés</option>
</select>
```

#### 4. Filtre Catégorie
```jsx
<select value={filters.category}>
  {categories.map(c => (
    <option key={c} value={c}>
      {c === 'all' ? 'Toutes' : c}
    </option>
  ))}
</select>
```
- Catégories générées dynamiquement depuis les items

#### 5. Tri
```jsx
<select value={sort.by}>
  <option value="priority">Priorité</option>
  <option value="price">Prix</option>
  <option value="date">Date cible</option>
  <option value="createdAt">Date d'ajout</option>
  <option value="title">Titre</option>
</select>

<select value={sort.dir}>
  <option value="asc">Asc</option>
  <option value="desc">Desc</option>
</select>
```

### Layout

Utilise `.toolbar-row` avec Flexbox :
- Recherche : `flex: 1` (prend tout l'espace restant)
- Autres contrôles : largeur automatique

### Exemple d'Utilisation

```jsx
<FilterBar
  filters={{
    q: '',
    priority: 'all',
    showPurchased: 'all',
    category: 'all'
  }}
  setFilters={setFilters}
  sort={{ by: 'priority', dir: 'desc' }}
  setSort={setSort}
  categories={['all', 'Tech', 'Maison', 'Loisirs']}
/>
```

---

## BudgetSummary.jsx

**Chemin :** `src/components/BudgetSummary.jsx`
**Lignes :** 8
**Type :** Composant de présentation

### Description

Affichage simple du budget total et du budget restant. Composant purement visuel sans logique.

### Props

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `totalBudget` | `number` | ✅ | Somme de tous les prix (achetés + non achetés) |
| `totalRestant` | `number` | ✅ | Somme des prix des articles non achetés |

### Rendu

```jsx
<section className="panel" style={{ display: 'flex', justifyContent: 'space-between' }}>
  <span>💰 <strong>Total :</strong> {totalBudget.toFixed(2)} €</span>
  <span>🛍️ <strong>Reste à acheter :</strong> {totalRestant.toFixed(2)} €</span>
</section>
```

### Exemple d'Utilisation

```jsx
<BudgetSummary
  totalBudget={1549.99}
  totalRestant={899.50}
/>
```

**Rendu :**
```
💰 Total : 1549.99 €        🛍️ Reste à acheter : 899.50 €
```

### Notes

- Format : Toujours 2 décimales via `.toFixed(2)`
- Layout : Flex avec `space-between` pour espacer les 2 valeurs
- Responsive : Sur mobile, peut passer à 2 lignes selon la largeur

---

## Composants Legacy

### AchatForm.jsx et AchatList.jsx

**Chemin :** `src/components/`
**Type :** Re-exports

Ces fichiers sont des re-exports pour maintenir la compatibilité avec d'anciens imports :

```javascript
// AchatForm.jsx
export { default } from './ItemForm';

// AchatList.jsx
export { default } from './ItemList';
```

**Utilisation :**
- Ne pas les utiliser dans nouveau code
- Peuvent être supprimés si aucun import externe ne les référence

---

## Guide de Style des Composants

### Conventions de Nommage

- **Composants :** PascalCase (ItemForm, ItemCard)
- **Props :** camelCase (onSubmit, editingId)
- **Fichiers :** PascalCase pour composants (.jsx)

### Structure de Fichier

```javascript
import React from 'react';

// 1. Constantes locales
const PRIORITIES = [...];

// 2. Fonctions utilitaires
function helper() { ... }

// 3. Composant principal
export default function ComponentName({ props }) {
  // État local
  const [state, setState] = useState();

  // Fonctions internes
  function handleSomething() { ... }

  // Rendu
  return ( ... );
}
```

### Props Drilling

Pour éviter le props drilling excessif, considérer :
- **Context API** pour état partagé profondément
- **Composition** plutôt qu'héritage
- **Custom Hooks** pour logique réutilisable

### Performance

- Utiliser `React.memo` si un composant re-render trop souvent
- Utiliser `useCallback` pour les callbacks passés en props
- Utiliser `useMemo` pour calculs coûteux

**Exemple :**
```jsx
const ItemCard = React.memo(({ item, onEdit, onDelete }) => {
  // Ne re-render que si item, onEdit, ou onDelete changent
  return ( ... );
});
```

---

## Tests Recommandés

### ItemForm

```javascript
// À tester
- Validation du titre requis
- Validation d'URL invalide
- Ajout/suppression d'attributs
- Fetch d'image automatique onBlur
- Fetch d'image manuel
- Soumission en mode création
- Soumission en mode édition
```

### ItemCard

```javascript
// À tester
- Affichage conditionnel de l'image
- Affichage des badges selon les props
- Lien cliquable si URL présente
- Bouton toggle change le texte selon purchased
- Bouton copier utilise navigator.clipboard
- Callbacks appelés avec les bons paramètres
```

### ItemList

```javascript
// À tester
- Affichage du message vide si items.length === 0
- Rendu de N ItemCard si items.length > 0
- Key unique sur chaque ItemCard
```

### FilterBar

```javascript
// À tester
- Changement de chaque filtre appelle setFilters
- Changement de tri appelle setSort
- Liste des catégories affiche correctement
- "Toutes" transformé en "all" en valeur
```

---

**Dernière mise à jour :** 20 novembre 2025
**Version :** 1.1.0
**Auteur :** momoe
