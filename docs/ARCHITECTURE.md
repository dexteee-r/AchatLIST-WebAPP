# Architecture de l'Application Liste d'Achats

## 📐 Vue d'ensemble

Cette application est une **Progressive Web App (PWA)** de gestion de liste d'achats construite avec React 19 et Vite 7. Elle fonctionne 100% hors-ligne grâce au localStorage et aux service workers.

## 🏗️ Structure du Projet

```
c:\Users\momoe\Desktop\Perso-WEB_APP-LISTE_ACHAT\
├── public/                          # Assets statiques
│   ├── pwa-192.png                 # Icône PWA 192x192
│   ├── pwa-512.png                 # Icône PWA 512x512
│   └── vite.svg                    # Logo Vite
│
├── src/
│   ├── components/                 # Composants React
│   │   ├── ItemForm.jsx           # Formulaire d'ajout/édition
│   │   ├── ItemCard.jsx           # Carte d'affichage d'un article
│   │   ├── ItemList.jsx           # Liste des articles
│   │   ├── FilterBar.jsx          # Barre de filtres et tri
│   │   ├── BudgetSummary.jsx      # Résumé budgétaire
│   │   ├── AchatForm.jsx          # Re-export ItemForm (legacy)
│   │   └── AchatList.jsx          # Re-export ItemList (legacy)
│   │
│   ├── utils/                      # Utilitaires
│   │   ├── constants.js           # Constantes (PRIORITIES, STORAGE_KEY)
│   │   ├── helpers.js             # Fonctions utilitaires
│   │   └── storages.js            # Gestion du stockage JSON
│   │
│   ├── assets/                     # Assets React
│   │   └── react.svg              # Logo React
│   │
│   ├── App.jsx                     # Composant racine (163 lignes)
│   ├── main.jsx                    # Point d'entrée + PWA
│   └── styles.css                  # Styles globaux
│
├── dist/                            # Build de production
├── docs/                            # 📚 Documentation
│   ├── ARCHITECTURE.md             # Ce fichier
│   ├── CHANGELOG.md                # Historique des modifications
│   ├── GUIDE_DEVELOPPEMENT.md      # Guide développeur
│   ├── COMPOSANTS.md               # Doc des composants
│   └── ROADMAP.md                  # Roadmap des features
│
├── index.html                       # HTML racine
├── vite.config.js                   # Config Vite + PWA
├── package.json                     # Dépendances
├── eslint.config.js                 # Config ESLint
├── note_a_moi_meme.md              # Notes personnelles
└── README.md                        # Documentation principale
```

## 🧩 Architecture des Composants

### Hiérarchie

```
App (État global + Logique métier)
├── Header (Import/Export)
├── ItemForm (Formulaire)
├── BudgetSummary (Budget)
├── FilterBar (Filtres + Tri)
└── ItemList
    └── ItemCard (x N articles)
```

### Flux de Données

```
┌─────────────────────────────────────────────────┐
│              App.jsx (État global)              │
│  - items: Array<Item>                           │
│  - draft: Item (formulaire)                     │
│  - editingId: string | null                     │
│  - filters: FilterState                         │
│  - sort: SortState                              │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   Props (lecture)      Callbacks (modification)
        │                     │
        └──────────┬──────────┘
                   │
        ┌──────────┴──────────────────┐
        │                             │
        ▼                             ▼
  Composants enfants          localStorage
  (ItemForm, ItemList...)     (persistance)
```

## 📦 Modèle de Données

### Structure d'un Item

```javascript
{
  id: string,              // UUID généré par crypto.randomUUID()
  title: string,           // Titre (requis)
  url: string,             // Lien vers le produit (optionnel)
  price: string | number,  // Prix en EUR (optionnel)
  priority: 'high' | 'medium' | 'low',  // Priorité (défaut: high)
  category: string,        // Catégorie (optionnel)
  targetDate: string,      // Date cible ISO (optionnel)
  notes: string,           // Notes libres (optionnel)
  attributes: Array<{      // Attributs personnalisés
    key: string,
    value: string
  }>,
  purchased: boolean,      // Acheté ou non (défaut: false)
  createdAt: number,       // Timestamp de création
  imageUrl: string         // URL de l'image du produit (optionnel)
}
```

### Priorités

```javascript
const PRIORITIES = [
  { id: 'high', label: 'Haute', weight: 3, cls: 'badge red' },
  { id: 'medium', label: 'Moyenne', weight: 2, cls: 'badge amber' },
  { id: 'low', label: 'Basse', weight: 1, cls: 'badge green' }
];
```

## 🔄 Flux Applicatifs

### 1. Ajout d'un Article

```
Utilisateur remplit le formulaire
         ↓
ItemForm.onSubmit → App.upsert()
         ↓
Validation (titre requis, URL valide)
         ↓
setItems([newItem, ...prev])
         ↓
useEffect déclenche la sauvegarde localStorage
         ↓
Réinitialisation du formulaire
```

### 2. Édition d'un Article

```
Clic sur "Éditer" → ItemCard.onEdit
         ↓
App.edit(item) → setDraft(item) + setEditingId(item.id)
         ↓
Scroll en haut du formulaire
         ↓
Utilisateur modifie les champs
         ↓
ItemForm.onSubmit → App.upsert()
         ↓
items.map(it => it.id === editingId ? {...it, ...draft} : it)
         ↓
localStorage mis à jour
```

### 3. Récupération d'Image Produit

```
Utilisateur saisit une URL
         ↓
onBlur ou clic sur 🔍
         ↓
fetchProductImage(url) via Microlink API
         ↓
Extraction de data.data.image.url
         ↓
setDraft({...draft, imageUrl: img})
```

### 4. Filtrage et Tri

```
Utilisateur change les filtres/tri
         ↓
FilterBar met à jour filters/sort via setFilters/setSort
         ↓
useMemo recalcule filteredItems
         ↓
- Filtrage par recherche (q)
         ↓
- Filtrage par priorité
         ↓
- Filtrage par état (acheté/à acheter)
         ↓
- Filtrage par catégorie
         ↓
- Tri selon sort.by et sort.dir
         ↓
ItemList reçoit filteredItems et re-render
```

## 💾 Persistance des Données

### localStorage

**Clé:** `purchaseList_plaincss_v1`

**Contenu:** JSON stringifié de l'array `items`

**Synchronisation:** Automatique via `useEffect` sur `items`

```javascript
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}, [items]);
```

### Import/Export

- **Export CSV:** Génère un fichier `liste_achats_YYYY-MM-DD.csv`
- **Export JSON:** Utilise `savePurchasesToJSON()` → `achats.json`
- **Import JSON:** Valide et normalise les données avant import

## 🌐 API Externe

### Microlink API

**Endpoint:** `https://api.microlink.io?url={productUrl}`

**Utilisation:** Récupération des images Open Graph des produits

**Gestion d'erreurs:** Silencieuse (retourne '' en cas d'échec)

**Limitations connues:**
- Dépendance à un service tiers
- Pas de rate limiting côté client
- Pas de cache des images

## 🎨 Styling

### Approche

- **CSS pur** avec variables CSS pour le theming
- **Pas de CSS-in-JS** ni de framework CSS
- **Grid CSS** pour les layouts responsive
- **Classes utilitaires** (badge, btn, panel, etc.)

### Variables CSS Principales

```css
--primary: Couleur principale
--border: Couleur des bordures
--muted: Couleur texte secondaire
--background: Couleur de fond
```

## 🔐 Sécurité

### Points de Vigilance

1. **XSS:** React échappe automatiquement les valeurs
2. **localStorage:** Accessible par JavaScript → pas de données sensibles
3. **API externe:** Pas de clé API nécessaire
4. **Input validation:** URL validée avant sauvegarde

### Améliorations Futures

- Chiffrement des données localStorage
- Rate limiting sur l'API Microlink
- Content Security Policy (CSP)
- Validation plus stricte des inputs

## 📱 Progressive Web App

### Service Worker

**Fichier:** Généré automatiquement par `vite-plugin-pwa`

**Stratégie:** Precache + Runtime caching

**Mise à jour:** Auto-update avec prompt utilisateur

### Manifest

```json
{
  "name": "Liste d'Achats",
  "short_name": "Achats",
  "theme_color": "#ffffff",
  "icons": [
    { "src": "/pwa-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/pwa-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "display": "standalone"
}
```

## 🧪 Testing (À implémenter)

### Stack Recommandée

- **Framework:** Vitest
- **React Testing:** @testing-library/react
- **E2E:** Playwright ou Cypress

### Tests Prioritaires

1. ItemForm → validation, soumission
2. ItemCard → toggle purchased, édition, suppression
3. FilterBar → filtrage, tri
4. App → CRUD complet, persistance localStorage

## 🚀 Performance

### Optimisations Actuelles

- **useMemo:** Pour filteredItems, categories, budgets
- **Composants purs:** Évite les re-renders inutiles
- **localStorage:** Opérations synchrones rapides

### Optimisations Futures

- **React.memo:** Sur ItemCard pour éviter re-renders
- **Virtualisation:** Pour listes très longues (react-window)
- **Lazy loading:** Des images produits
- **Code splitting:** Par route si multi-pages

## 🔧 Configuration

### Vite (vite.config.js)

```javascript
- Plugin React avec Fast Refresh
- Plugin PWA avec Workbox
- Build optimisé pour production
```

### ESLint (eslint.config.js)

```javascript
- Preset React recommandé
- Rules adaptées pour React 19
```

## 📚 Dépendances Principales

| Package | Version | Usage |
|---------|---------|-------|
| react | 19.1.1 | Framework UI |
| react-dom | 19.1.1 | Rendu DOM |
| vite | 7.2.2 | Build tool |
| vite-plugin-pwa | 1.1.0 | PWA support |
| workbox-window | 7.3.0 | Service Worker |

## 🔄 Cycle de Vie de l'App

1. **Chargement initial**
   - Lecture du localStorage
   - Initialisation de l'état
   - Enregistrement du Service Worker

2. **Runtime**
   - Interaction utilisateur
   - Mise à jour de l'état
   - Synchronisation localStorage

3. **Offline**
   - Service Worker sert les assets en cache
   - localStorage accessible
   - App totalement fonctionnelle

## 📝 Conventions de Code

- **Nommage:** camelCase pour variables/fonctions, PascalCase pour composants
- **Fichiers:** PascalCase pour composants (.jsx), camelCase pour utils (.js)
- **Imports:** Ordre: React → composants → utils → styles
- **État:** Hooks React (useState, useMemo, useEffect)
- **Props:** Destructuration dans la signature de fonction

## 🐛 Debugging

### localStorage

```javascript
// Console navigateur
localStorage.getItem('purchaseList_plaincss_v1')
```

### React DevTools

Extension recommandée pour inspecter l'état et les props

### Vite

HMR (Hot Module Replacement) pour développement rapide
