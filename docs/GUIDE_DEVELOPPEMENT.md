# Guide de Développement - Liste d'Achats

Ce guide vous aidera à reprendre le développement de l'application, que ce soit pour ajouter des fonctionnalités, corriger des bugs, ou simplement comprendre comment tout fonctionne.

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Commandes Utiles](#commandes-utiles)
4. [Structure du Code](#structure-du-code)
5. [Ajouter une Fonctionnalité](#ajouter-une-fonctionnalité)
6. [Modifier un Composant](#modifier-un-composant)
7. [Debugging](#debugging)
8. [Bonnes Pratiques](#bonnes-pratiques)
9. [FAQ](#faq)

---

## 🔧 Prérequis

### Logiciels Nécessaires

- **Node.js** : Version 18+ recommandée
  - Vérifier : `node --version`
  - Télécharger : https://nodejs.org/

- **npm** : Version 9+ (inclus avec Node.js)
  - Vérifier : `npm --version`

- **Git** : Pour le versioning
  - Vérifier : `git --version`
  - Télécharger : https://git-scm.com/

### Éditeur de Code Recommandé

- **VSCode** avec extensions :
  - ESLint
  - Prettier
  - ES7+ React/Redux/React-Native snippets
  - Auto Rename Tag
  - Path Intellisense

---

## 🚀 Installation

### 1. Cloner ou Naviguer vers le Projet

```bash
cd c:\Users\momoe\Desktop\Perso-WEB_APP-LISTE_ACHAT
```

### 2. Installer les Dépendances

```bash
npm install
```

Cela installe :
- React 19.1.1
- Vite 7.2.2
- ESLint
- Plugins PWA
- Workbox

### 3. Lancer le Serveur de Développement

```bash
npm run dev
```

L'application sera accessible sur : http://localhost:5173

---

## ⚡ Commandes Utiles

### Développement

```bash
# Démarrer le serveur de dev avec hot reload
npm run dev

# Build de production
npm run build

# Prévisualiser le build de production
npm run preview

# Linter le code
npm run lint

# Nettoyer node_modules et réinstaller
rm -rf node_modules package-lock.json && npm install
```

### Git

```bash
# Voir l'état du dépôt
git status

# Voir les modifications
git diff

# Voir l'historique
git log --oneline -10

# Créer une branche
git checkout -b feature/ma-nouvelle-feature

# Commit
git add .
git commit -m "feat: description de la feature"

# Revenir à main
git checkout main
```

### localStorage

```bash
# Dans la console du navigateur (F12)

# Voir toutes les données
JSON.parse(localStorage.getItem('purchaseList_plaincss_v1'))

# Effacer les données
localStorage.removeItem('purchaseList_plaincss_v1')

# Tout effacer
localStorage.clear()
```

---

## 📁 Structure du Code

### Où Trouver Quoi ?

| Besoin | Fichier |
|--------|---------|
| Ajouter un nouveau composant | `src/components/` |
| Modifier les constantes | `src/utils/constants.js` |
| Ajouter une fonction utilitaire | `src/utils/helpers.js` |
| Modifier les styles | `src/styles.css` |
| Changer la logique métier | `src/App.jsx` |
| Config de build | `vite.config.js` |
| Config PWA | `vite.config.js` (section pwa) |
| Modifier le HTML racine | `index.html` |

### Arbre des Composants

```
App.jsx (163 lignes)
│
├── ItemForm.jsx (169 lignes)
│   ├── Gère le formulaire d'ajout/édition
│   └── Contient la logique de fetch d'images
│
├── BudgetSummary.jsx (8 lignes)
│   └── Affiche budget total et restant
│
├── FilterBar.jsx (89 lignes)
│   ├── Barre de recherche
│   ├── Filtres (priorité, état, catégorie)
│   └── Options de tri
│
└── ItemList.jsx (28 lignes)
    ├── Gère l'affichage vide
    └── Map sur ItemCard.jsx (94 lignes)
        ├── Affiche un article
        ├── Image du produit
        ├── Badges (priorité, catégorie, prix, date)
        └── Actions (toggle, éditer, supprimer, copier)
```

---

## ✨ Ajouter une Fonctionnalité

### Exemple : Ajouter un Champ "Quantité"

#### 1. Modifier le Modèle de Données

**Fichier:** `src/utils/constants.js`

```javascript
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
  quantity: 1, // ⬅️ NOUVEAU
});
```

#### 2. Ajouter le Champ au Formulaire

**Fichier:** `src/components/ItemForm.jsx`

Ajouter dans la section du formulaire (vers ligne 80) :

```jsx
<div style={{ gridColumn: 'span 2' }} className="field">
  <div className="label">Quantité</div>
  <input
    className="input"
    type="number"
    min="1"
    placeholder="1"
    value={draft.quantity}
    onChange={e => setDraft({ ...draft, quantity: e.target.value })}
  />
</div>
```

#### 3. Afficher dans la Carte

**Fichier:** `src/components/ItemCard.jsx`

Ajouter un badge dans la section des chips (vers ligne 41) :

```jsx
{item.quantity && item.quantity > 1 && (
  <span className="badge">Qté: {item.quantity}</span>
)}
```

#### 4. Inclure dans l'Export

**Fichier:** `src/utils/helpers.js`

Modifier la fonction `exportCSV` :

```javascript
const rows = [
  ["title", "url", "price", "priority", "category", "targetDate", "notes", "purchased", "attributes", "imageUrl", "quantity"], // ⬅️ Ajouter "quantity"
  ...items.map(i => [
    i.title, i.url, i.price, i.priority, i.category, i.targetDate,
    (i.notes || '').replaceAll('\n', ' '), i.purchased ? '1' : '0',
    JSON.stringify(i.attributes || []), i.imageUrl || '', i.quantity || 1 // ⬅️ Ajouter i.quantity
  ])
];
```

#### 5. Gérer dans l'Import

**Fichier:** `src/utils/helpers.js`

Modifier la fonction `importJSON` :

```javascript
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
  imageUrl: i.imageUrl || '',
  quantity: i.quantity || 1 // ⬅️ NOUVEAU
}));
```

#### 6. Tester

```bash
npm run dev
```

1. Ouvrir http://localhost:5173
2. Ajouter un article avec une quantité
3. Vérifier que le badge s'affiche
4. Éditer l'article pour modifier la quantité
5. Exporter en CSV et vérifier la colonne
6. Vérifier le localStorage (F12 → Console → `localStorage.getItem('purchaseList_plaincss_v1')`)

---

## 🔧 Modifier un Composant

### Exemple : Changer la Couleur des Badges de Priorité

**Fichier:** `src/styles.css`

Chercher les classes :

```css
.badge.red {
  background: #fee2e2;
  color: #b91c1c;
  border-color: #fecaca;
}

.badge.amber {
  background: #fef3c7;
  color: #92400e;
  border-color: #fde68a;
}

.badge.green {
  background: #d1fae5;
  color: #065f46;
  border-color: #a7f3d0;
}
```

Modifier les couleurs comme souhaité. Les changements apparaîtront immédiatement grâce au HMR (Hot Module Replacement).

---

## 🐛 Debugging

### Problème : L'App ne Démarre Pas

**Erreur commune :** `Cannot find module '...'`

**Solution :**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Problème : Les Données ne se Sauvent Pas

**Vérifier localStorage :**

1. Ouvrir F12 → Application → Local Storage
2. Chercher la clé `purchaseList_plaincss_v1`
3. Si absente ou vide, vérifier la console pour des erreurs

**Vérifier le useEffect :**

`src/App.jsx` ligne 25 :

```javascript
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}, [items]);
```

### Problème : Les Images ne se Chargent Pas

**Raisons possibles :**

1. L'API Microlink est down ou lente
2. Le site cible n'a pas d'Open Graph image
3. Problème CORS (résolu via Microlink normalement)

**Tester manuellement :**

```javascript
// Console navigateur
fetch('https://api.microlink.io?url=https://amazon.fr/dp/B08N5WRWNW')
  .then(r => r.json())
  .then(d => console.log(d.data.image.url))
```

### Problème : ESLint Signale des Erreurs

**Désactiver temporairement :**

Ajouter en début de fichier :
```javascript
/* eslint-disable */
```

**Corriger automatiquement :**
```bash
npm run lint -- --fix
```

### React DevTools

**Installation :**
- Chrome : https://chrome.google.com/webstore (chercher "React Developer Tools")
- Firefox : https://addons.mozilla.org/firefox/ (chercher "React DevTools")

**Utilisation :**
1. F12 → Onglet "Components"
2. Inspecter l'arbre des composants
3. Voir les props et l'état en temps réel
4. Modifier l'état pour tester

---

## ✅ Bonnes Pratiques

### 1. Toujours Tester Localement Avant de Commit

```bash
npm run dev     # Tester en dev
npm run build   # Vérifier que le build passe
npm run preview # Tester le build
```

### 2. Commits Atomiques et Descriptifs

**Format recommandé :**
```
type(scope): description courte

Description plus longue si nécessaire
```

**Types :**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `refactor`: Refactorisation sans changement fonctionnel
- `style`: Changements CSS/visuels
- `docs`: Documentation
- `chore`: Maintenance (deps, config)

**Exemples :**
```bash
git commit -m "feat(ItemForm): add quantity field"
git commit -m "fix(ItemCard): image not displaying correctly"
git commit -m "docs(README): update installation steps"
```

### 3. Composants Purs et Réutilisables

- Un composant = une responsabilité
- Props en lecture seule
- Callbacks pour les actions
- Pas de logique métier dans les composants UI

**Bon :**
```jsx
function ItemCard({ item, onDelete }) {
  return (
    <div>
      <h3>{item.title}</h3>
      <button onClick={() => onDelete(item.id)}>Supprimer</button>
    </div>
  );
}
```

**Mauvais :**
```jsx
function ItemCard({ item, items, setItems }) {
  const handleDelete = () => {
    setItems(items.filter(i => i.id !== item.id)); // ❌ Logique métier dans l'UI
  };
  return <button onClick={handleDelete}>Supprimer</button>;
}
```

### 4. useMemo pour les Calculs Coûteux

Utiliser `useMemo` quand :
- Calcul lourd (tri, filtrage sur grandes listes)
- Dépendances stables
- Éviter re-calculs inutiles

**Exemple :**
```javascript
const filteredItems = useMemo(() => {
  return items.filter(i => i.category === selectedCategory);
}, [items, selectedCategory]);
```

### 5. Gérer les Erreurs Gracieusement

**À FAIRE :**
- Ajouter react-toastify pour les notifications
- Gérer les états de chargement
- Messages d'erreur clairs

**Actuellement (à améliorer) :**
```javascript
if (!draft.title.trim()) return alert('Le titre est requis.'); // ❌ Pas user-friendly
```

**Idéal :**
```javascript
if (!draft.title.trim()) {
  toast.error('Le titre est requis.'); // ✅ Toast notification
  return;
}
```

### 6. Ne Pas Commit les node_modules

**Toujours dans .gitignore :**
```
node_modules/
dist/
.env
*.log
```

### 7. Documenter les Fonctions Complexes

```javascript
/**
 * Récupère l'image Open Graph d'une URL via l'API Microlink
 * @param {string} url - URL du produit
 * @returns {Promise<string>} URL de l'image ou chaîne vide
 */
async function fetchProductImage(url) {
  if (!url) return '';
  try {
    const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    return data?.data?.image?.url || '';
  } catch {
    return '';
  }
}
```

---

## ❓ FAQ

### Q : Comment ajouter une nouvelle priorité ?

**R :** Modifier `src/utils/constants.js` :

```javascript
export const PRIORITIES = [
  { id: 'critical', label: 'Critique', weight: 4, cls: 'badge purple' }, // NOUVEAU
  { id: 'high', label: 'Haute', weight: 3, cls: 'badge red' },
  { id: 'medium', label: 'Moyenne', weight: 2, cls: 'badge amber' },
  { id: 'low', label: 'Basse', weight: 1, cls: 'badge green' },
];
```

Puis ajouter le style dans `src/styles.css` :

```css
.badge.purple {
  background: #ede9fe;
  color: #6d28d9;
  border-color: #ddd6fe;
}
```

### Q : Comment changer le nom de l'app ?

**R :** Modifier dans 3 endroits :

1. **package.json** : `"name": "nouveau-nom"`
2. **index.html** : `<title>Nouveau Nom</title>`
3. **vite.config.js** : Section `manifest.name` et `manifest.short_name`
4. **src/App.jsx** : `<div className="title">🛒 Nouveau Nom</div>`

### Q : Comment déployer l'app ?

**R :** Plusieurs options :

**1. Vercel (Recommandé) :**
```bash
npm install -g vercel
npm run build
vercel --prod
```

**2. Netlify :**
- Connecter le repo GitHub
- Build command: `npm run build`
- Publish directory: `dist`

**3. GitHub Pages :**
```bash
npm run build
# Copier le contenu de dist/ vers la branche gh-pages
```

**4. Serveur Proxmox (mentionné dans vos notes) :**
```bash
npm run build
# Copier dist/ vers /var/www/html/ sur le serveur
```

### Q : L'app fonctionne-t-elle sur mobile ?

**R :** Oui ! C'est une PWA :
1. Ouvrir l'app dans un navigateur mobile
2. Ajouter à l'écran d'accueil
3. L'app s'ouvrira en mode standalone (comme une app native)

### Q : Comment ajouter une nouvelle page ?

**R :** Il faudrait intégrer React Router :

```bash
npm install react-router-dom
```

Puis dans `App.jsx` :

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Q : Comment migrer vers TypeScript ?

**R :**

1. Installer TypeScript :
```bash
npm install -D typescript @types/react @types/react-dom
```

2. Renommer `.jsx` en `.tsx`

3. Créer `tsconfig.json` :
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

4. Ajouter les types progressivement

---

## 📚 Ressources Utiles

### Documentation Officielle

- **React 19** : https://react.dev
- **Vite** : https://vitejs.dev
- **PWA** : https://vite-pwa-org.netlify.app/

### Tutoriels

- **React Hooks** : https://react.dev/reference/react
- **CSS Grid** : https://css-tricks.com/snippets/css/complete-guide-grid/
- **localStorage** : https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

### Outils

- **Can I Use** (compatibilité navigateurs) : https://caniuse.com/
- **Devtools Tips** : https://devtoolstips.org/
- **React DevTools** : https://react.dev/learn/react-developer-tools

---

## 🆘 Besoin d'Aide ?

### Où Chercher ?

1. **Console navigateur** (F12) → Erreurs JavaScript
2. **Terminal** → Erreurs de build
3. **React DevTools** → Inspecter les composants
4. **localStorage** → Vérifier les données

### Problèmes Courants

| Symptôme | Cause Probable | Solution |
|----------|----------------|----------|
| Page blanche | Erreur JS | Voir console (F12) |
| Données perdues | localStorage effacé | Réimporter le JSON de backup |
| Build échoue | Dépendances manquantes | `npm install` |
| HMR ne marche pas | Cache Vite | Redémarrer `npm run dev` |
| Images ne chargent pas | API Microlink down | Attendre ou utiliser fetch manuel |

---

**Dernière mise à jour :** 20 novembre 2025
**Version de l'app :** 1.1.0
**Auteur :** momoe
