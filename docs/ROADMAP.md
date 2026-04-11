# Roadmap - Liste d'Achats

Cette roadmap détaille les fonctionnalités futures prévues pour l'application, organisées par priorité et difficulté.

## 📋 Légende

- 🟢 **Facile** : 1-2 heures
- 🟡 **Moyen** : 3-8 heures
- 🔴 **Difficile** : 1-3 jours
- 🟣 **Très difficile** : 1+ semaines

**Priorités :**
- 🔥 **P0** : Critique
- ⚡ **P1** : Haute priorité
- 📌 **P2** : Priorité moyenne
- 💡 **P3** : Nice to have

---

## 🎯 Version 1.2.0 - Améliorations Immédiates

### 🔥 P0 - Gestion d'Erreurs Moderne
**Difficulté :** 🟢 Facile
**Temps estimé :** 2 heures

**Problème actuel :**
- Utilisation d'`alert()` (pas user-friendly)
- Pas de feedback visuel pour les actions
- Pas d'états de chargement

**Solution :**
1. Installer react-toastify
   ```bash
   npm install react-toastify
   ```

2. Intégrer dans App.jsx
   ```jsx
   import { ToastContainer, toast } from 'react-toastify';
   import 'react-toastify/dist/ReactToastify.css';

   // Remplacer les alert() par :
   toast.success('Article ajouté !');
   toast.error('Le titre est requis');
   toast.info('Image récupérée avec succès');
   ```

3. Ajouter des spinners de chargement
   - Lors du fetch d'images
   - Lors de l'import JSON

**Fichiers à modifier :**
- `src/App.jsx` - Remplacer alerts
- `src/components/ItemForm.jsx` - Loading states pour fetch image
- `src/utils/helpers.js` - Toast dans importJSON

**Feature réalisée**

- [x] oui *(react-toastify importé et intégré dans App.jsx — toasts sur ajout, édition, suppression, validation et erreurs. Spinners de chargement : à faire)*
- [ ] non pas encore

---

### ⚡ P1 - Export JSON avec Date dans le Nom
**Difficulté :** 🟢 Facile
**Temps estimé :** 30 minutes

**Problème actuel :**
- Nom de fichier fixe : `achats.json`
- Écrase les exports précédents

**Solution :**

Modifier `src/utils/storages.js` :

```javascript
export function savePurchasesToJSON(purchases) {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const json = JSON.stringify(purchases, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `liste_achats_${date}.json`; // ⬅️ Date dynamique
  a.click();
  URL.revokeObjectURL(url);
}
```

**Résultat :**
- `liste_achats_2025-11-20.json`
- `liste_achats_2025-11-21.json`
- etc.

**Feature réalisé**


- [x] oui (le 20/11/25)
- [ ] non
---

### ⚡ P1 - Améliorer la Récupération d'Images
**Difficulté :** 🟡 Moyen
**Temps estimé :** 4 heures

**Problème actuel :**
- Dépendance à Microlink API seule
- Pas de fallback
- Pas de cache
- Parfois images manquantes

**Solution Phase 1 - Cache localStorage :**

Créer `src/utils/imageCache.js` :

```javascript
const CACHE_KEY = 'imageCache_v1';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 jours

export function getCachedImage(url) {
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  const cached = cache[url];

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.imageUrl;
  }
  return null;
}

export function setCachedImage(url, imageUrl) {
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  cache[url] = { imageUrl, timestamp: Date.now() };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}
```

Modifier `src/utils/helpers.js` :

```javascript
import { getCachedImage, setCachedImage } from './imageCache';

export async function fetchProductImage(url) {
  if (!url) return '';

  // Vérifier le cache d'abord
  const cached = getCachedImage(url);
  if (cached) return cached;

  try {
    const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    const imageUrl = data?.data?.image?.url || '';

    if (imageUrl) {
      setCachedImage(url, imageUrl);
    }

    return imageUrl;
  } catch {
    return '';
  }
}
```

**Solution Phase 2 - API Fallback :**

Essayer plusieurs APIs si Microlink échoue :
1. Microlink
2. OpenGraph.io
3. LinkPreview
4. Extraction manuelle via fetch + DOMParser

**Feature réalisé**

- [ ] oui 
- [x] non pas encore

---

## 💰 Version 1.4.0 - Différenciateurs concurrentiels (SaaS)

> Ces features sont absentes des concurrents directs (Moonsift, Sortd, WishDeck).
> Voir `competitive_analysis.md` pour le contexte.

### ⚡ P1 - Mode "Budget du mois"
**Difficulté :** 🟢 Facile
**Temps estimé :** 2-3 heures

**Objectif :**
Définir un plafond budgétaire mensuel et visualiser ce qu'on peut s'offrir maintenant.

**Solution :**
1. Ajouter un champ "Budget disponible ce mois" en haut de l'app (persisté en localStorage)
2. Calculer : budget disponible - articles prioritaires non achetés
3. Afficher visuellement : vert (ok), orange (serré), rouge (dépassé)
4. Optionnel : suggestion des articles qu'on peut acheter dans l'enveloppe restante

**Valeur ajoutée :** Aucun concurrent ne combine wishlist + budget personnel de cette façon.

**Feature réalisée**
- [ ] oui
- [x] non pas encore

---

### ⚡ P1 - Alertes prix (suivi de prix)
**Difficulté :** 🔴 Difficile
**Temps estimé :** 3-5 jours

**Objectif :**
Surveiller le prix d'un article et notifier l'utilisateur quand il baisse.

**Contrainte :**
Nécessite un **backend** (scraping périodique côté serveur) — pas faisable en pur frontend.

**Architecture :**
1. Backend (Node.js / Bun) : cron job toutes les X heures qui scrape le prix des articles avec URL
2. Comparer au prix sauvegardé dans la DB
3. Si baisse détectée → notification push (PWA) ou email
4. Frontend : badge "prix en baisse" sur l'article + historique des prix

**Stack suggérée :**
- Backend : Bun + Hono (léger)
- DB : Supabase (PostgreSQL)
- Scraping : Playwright headless ou Microlink Pro
- Notifications : Web Push API

**Valeur ajoutée :** Feature premium payante — les gens payent pour ça (ex: Honey, Keepa).

**Feature réalisée**
- [ ] oui
- [x] non pas encore

---

## 🎨 Version 1.3.0 - Fonctionnalités Avancées

### 📌 P2 - Système de Tags Multiples
**Difficulté :** 🟡 Moyen
**Temps estimé :** 6 heures

**Problème actuel :**
- Une seule catégorie par article
- Pas de tags multiples

**Solution :**

1. **Modifier le modèle de données**

`src/utils/constants.js` :
```javascript
export const emptyItem = () => ({
  // ... autres champs
  tags: [], // ⬅️ NOUVEAU : Array de strings
  category: '', // Garder pour rétro-compatibilité
});
```

2. **Nouveau composant TagInput**

`src/components/TagInput.jsx` :
```jsx
import { useState } from 'react';

export default function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      onChange([...tags, input.trim()]);
      setInput('');
    }
  };

  const removeTag = (tag) => {
    onChange(tags.filter(t => t !== tag));
  };

  return (
    <div>
      <div className="chips">
        {tags.map(tag => (
          <span key={tag} className="badge">
            {tag}
            <button onClick={() => removeTag(tag)}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="input"
          placeholder="Ajouter un tag..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
        />
        <button type="button" className="btn" onClick={addTag}>
          + Tag
        </button>
      </div>
    </div>
  );
}
```

3. **Intégrer dans ItemForm**

4. **Ajouter filtre par tags dans FilterBar**

5. **Afficher tags dans ItemCard**

**Feature réalisée** *(partiellement — modèle de données prêt, UI à compléter)*

- [x] Modèle de données `tags[]` ✅ *(migration automatique `category` → `tags[]` déjà dans App.jsx au chargement)*
- [x] Filtrage par tag ✅ *(filtre `filters.tag` déjà opérationnel dans App.jsx)*
- [ ] Composant `TagInput.jsx` — à créer
- [ ] Intégration de `TagInput` dans `ItemForm`
- [ ] Affichage des tags dans `ItemCard`

---

### 📌 P2 - Web Scraping Amélioré
**Difficulté :** 🔴 Difficile
**Temps estimé :** 2 jours

**Objectif :**
Extraire automatiquement plus d'infos du lien :
- Titre du produit
- Prix
- Image
- Description
- Évaluations

**Solution :**

Créer `src/utils/scraper.js` :

```javascript
export async function scrapeProductInfo(url) {
  try {
    const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}&meta=true`);
    const data = await res.json();

    return {
      title: data?.data?.title || '',
      price: extractPrice(data?.data?.description || ''),
      imageUrl: data?.data?.image?.url || '',
      description: data?.data?.description || '',
    };
  } catch {
    return null;
  }
}

function extractPrice(text) {
  // Regex pour trouver prix : 123.45€, $99.99, etc.
  const match = text.match(/(\d+[.,]\d{2})\s*[€$£]/);
  return match ? match[1].replace(',', '.') : '';
}
```

**Intégrer :**
- Bouton "Remplissage automatique" à côté du champ URL
- Pré-remplit titre, prix, image en un clic

**Challenge :**
- Sites avec anti-scraping (Cloudflare, Captcha)
- Besoin d'un backend pour contourner CORS
- Considérer scraping server-side


**Feature réalisé**

- [ ] oui 
- [x] non pas encore
---

### 💡 P3 - Tutoriel pour Nouveaux Utilisateurs
**Difficulté :** 🟡 Moyen
**Temps estimé :** 5 heures

**Objectif :**
Guide interactif au premier lancement

**Solution :**

1. Installer une lib de tours guidés :
   ```bash
   npm install react-joyride
   ```

2. Créer le tutoriel :

```jsx
import Joyride from 'react-joyride';
import { useState, useEffect } from 'react';

const steps = [
  {
    target: '.ItemForm',
    content: 'Commence par ajouter ton premier article ici !',
  },
  {
    target: 'input[placeholder*="Titre"]',
    content: 'Donne un titre à ton article',
  },
  {
    target: 'input[placeholder*="https"]',
    content: 'Colle le lien du produit pour récupérer automatiquement l\'image',
  },
  // ... autres étapes
];

export default function Tutorial() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setRun(true);
    }
  }, []);

  const handleJoyrideCallback = (data) => {
    if (data.status === 'finished' || data.status === 'skipped') {
      localStorage.setItem('hasSeenTutorial', 'true');
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
    />
  );
}
```

3. Ajouter dans App.jsx

**Feature réalisé**

- [ ] oui 
- [x] non pas encore

---

## 🚀 Version 2.0.0 - Fonctionnalités Majeures

### 🔥 P0 - Listes Multiples
**Difficulté :** 🔴 Difficile
**Temps estimé :** 3 jours

**Objectif :**
- Créer plusieurs listes : Tech, Vêtements, Soldes 2025, etc.
- Switcher entre les listes
- Export/Import par liste

**Architecture :**

Changer le modèle de données :

```javascript
// Avant (v1.x)
localStorage: { purchaseList_v1: [items] }

// Après (v2.0)
localStorage: {
  lists_v2: [
    {
      id: 'list-1',
      name: 'Tech',
      emoji: '💻',
      createdAt: timestamp,
      items: [items]
    },
    {
      id: 'list-2',
      name: 'Vêtements',
      emoji: '👕',
      createdAt: timestamp,
      items: [items]
    }
  ],
  activeListId: 'list-1'
}
```

**Nouveaux composants :**
- `ListSelector.jsx` - Dropdown/Tabs pour choisir la liste
- `ListManager.jsx` - Modal pour créer/éditer/supprimer des listes

**Migration :**
Créer un script pour migrer v1 → v2 :

```javascript
function migrateV1toV2() {
  const oldData = localStorage.getItem('purchaseList_plaincss_v1');
  if (oldData) {
    const items = JSON.parse(oldData);
    const newData = {
      lists: [
        {
          id: 'default',
          name: 'Ma liste',
          emoji: '🛒',
          createdAt: Date.now(),
          items: items
        }
      ],
      activeListId: 'default'
    };
    localStorage.setItem('lists_v2', JSON.stringify(newData));
  }
}
```
**Feature réalisé**

- [ ] oui 
- [x] non pas encore

---

### ⚡ P1 - Extension Navigateur
**Difficulté :** 🟣 Très difficile
**Temps estimé :** 2 semaines

**Objectif :**
Sauvegarder un article en 1 clic depuis n'importe quel site

**Technologies :**
- Manifest V3 pour Chrome/Edge/Brave
- WebExtensions pour Firefox
- Communication via `chrome.runtime.sendMessage`

**Architecture :**

```
extension/
├── manifest.json          # Config de l'extension
├── popup.html            # Popup de l'extension
├── popup.js              # Logic du popup
├── background.js         # Service worker
├── content-script.js     # Script injecté dans les pages
└── icons/                # Icônes 16x16, 48x48, 128x128
```

**Fonctionnement :**

1. User clique sur l'extension
2. Content script récupère :
   - Page title → titre article
   - Page URL → lien
   - Meta og:image → image
   - Meta description → notes
3. Popup pré-remplit un mini-formulaire
4. User clique "Sauvegarder"
5. Extension envoie les données à l'app via :
   - **Option A :** localStorage partagé (si même domaine)
   - **Option B :** API locale (nécessite backend)
   - **Option C :** Export JSON auto

**Manifest V3 (manifest.json) :**

```json
{
  "manifest_version": 3,
  "name": "Liste d'Achats - Quick Save",
  "version": "1.0",
  "description": "Sauvegarde rapide d'articles dans ta liste",
  "permissions": ["activeTab", "storage"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icons/icon48.png"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content-script.js"]
    }
  ]
}
```

**Challenge :**
- Maintenir 2 projets (app + extension)
- Communication app ↔ extension
- Permissions navigateurs

**Feature réalisé**

- [ ] oui 
- [x] non pas encore

---

### 📌 P2 - Mode "Plus Envie"
**Difficulté :** 🟢 Facile
**Temps estimé :** 2 heures

**Objectif :**
Marquer un article comme "plus envie" sans le supprimer

**Solution :**

1. Ajouter champ `wantLevel` :

```javascript
export const emptyItem = () => ({
  // ... autres champs
  wantLevel: 'want', // 'want' | 'notSure' | 'noWant'
});
```

2. Ajouter bouton dans ItemCard :

```jsx
<button onClick={() => onUpdateWant(item.id, 'noWant')}>
  😕 Plus envie
</button>
```

3. Filtrer dans FilterBar :

```jsx
<select value={filters.wantLevel}>
  <option value="all">Tous</option>
  <option value="want">Envie</option>
  <option value="notSure">Indécis</option>
  <option value="noWant">Plus envie</option>
</select>
```

4. Style différent pour "Plus envie" :
   - Opacité réduite
   - Badge gris


**Feature réalisée** *(partiellement — variante `dismissed` déjà implémentée)*

- [x] Champ `dismissed` ✅ *(déjà dans App.jsx — toggle `dismiss()`, filtre `showPurchased === 'dismissed'` opérationnel)*
- [ ] Champ `wantLevel` complet (`want` / `notSure` / `noWant`) — à implémenter si on veut 3 niveaux distincts
- [ ] Bouton et badge dédiés dans `ItemCard` pour le statut "Plus envie" / "Indécis"
---

## 🔮 Version 3.0.0 - Avancé

### 🔴 Synchronisation Multi-Appareils
**Difficulté :** 🟣 Très difficile
**Temps estimé :** 1 mois

**Problème actuel :**
- Données uniquement en localStorage
- Pas de sync entre téléphone et PC

**Solutions possibles :**

#### Option A - Cloud Gratuit (Firebase)
- Firebase Firestore (DB temps réel)
- Firebase Auth (authentification)
- Sync automatique

**Avantages :**
- Gratuit jusqu'à 1GB / 10K lectures par jour
- Temps réel
- Offline-first natif

**Inconvénients :**
- Dépendance à Google
- Besoin de compte utilisateur

#### Option B - Backend Custom
- API Node.js + Express
- Base de données (PostgreSQL / MongoDB)
- Hébergé sur Proxmox

**Avantages :**
- Contrôle total
- Pas de dépendance externe
- Déjà du hardware (Proxmox)

**Inconvénients :**
- Développement complet d'un backend
- Maintenance
- Sécurité à gérer

#### Option C - P2P (PeerJS / WebRTC)
- Sync directe entre appareils
- Pas de serveur

**Avantages :**
- Gratuit
- Privé
- Pas de serveur

**Inconvénients :**
- Complexe
- Les 2 appareils doivent être allumés

**Feature réalisé**

- [ ] oui 
- [x] non pas encore

---

### 🔴 Notifications et Rappels
**Difficulté :** 🟡 Moyen
**Temps estimé :** 1 semaine

**Objectif :**
- Notification si date cible approche
- Rappel pour article important
- Alerte baisse de prix (web scraping)

**Solution :**

1. **Notifications Push PWA**

Service Worker :
```javascript
self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/pwa-192.png',
    badge: '/badge.png',
  });
});
```

2. **Vérification quotidienne**

```javascript
function checkUpcomingDates() {
  const today = new Date();
  const in3Days = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

  items.forEach(item => {
    if (item.targetDate && !item.purchased) {
      const target = new Date(item.targetDate);
      if (target <= in3Days && target >= today) {
        sendNotification(`Rappel : ${item.title} à acheter avant le ${item.targetDate}`);
      }
    }
  });
}
```
**Feature réalisé**

- [ ] oui 
- [x] non pas encore
---

### 🔴 Comparateur de Prix
**Difficulté :** 🟣 Très difficile
**Temps estimé :** 2+ semaines

**Objectif :**
Trouver le meilleur prix pour un article sur plusieurs sites

**APIs à utiliser :**
- Amazon Product API
- Google Shopping API
- APIs des e-commerces (Fnac, Cdiscount, etc.)

**Challenge :**
- APIs souvent payantes ou limitées
- Anti-scraping
- Données pas toujours fiables

**Feature réalisé**

- [ ] oui 
- [x] non pas encore

---

## 📊 Priorisation Recommandée

### Phase 1 - Quick Wins (1 semaine)
1. ✅ Gestion d'erreurs moderne (react-toastify)
2. ✅ Export JSON avec date
3. ✅ Cache images localStorage

### Phase 2 - Features (2-3 semaines)
4. ✅ Système de tags multiples
5. ✅ Tutoriel interactif
6. ✅ Mode "Plus envie"

### Phase 3 - Advanced (1-2 mois)
7. ✅ Listes multiples
8. ✅ Web scraping amélioré
9. ✅ Extension navigateur

### Phase 4 - Pro (3+ mois)
10. ✅ Synchronisation cloud
11. ✅ Notifications push
12. ✅ Comparateur de prix

---

## 🛠️ Améliorations Techniques

### Migration vers TypeScript
**Priorité :** ⚡ P1
**Difficulté :** 🟡 Moyen
**Bénéfices :**
- Sécurité des types
- Auto-complétion meilleure
- Moins de bugs

### Tests Automatisés
**Priorité :** 📌 P2
**Difficulté :** 🟡 Moyen
**Stack :**
- Vitest (tests unitaires)
- React Testing Library
- Playwright (E2E)

### Accessibilité (A11y)
**Priorité :** 📌 P2
**Difficulté :** 🟢 Facile
**À faire :**
- ARIA labels
- Navigation clavier
- Contraste couleurs
- Screen reader support

### Performance
**Priorité :** 💡 P3
**Difficulté :** 🟢 Facile
**Optimisations :**
- React.memo sur ItemCard
- Virtualisation (react-window) pour listes longues
- Lazy loading images
- Code splitting

---

## 📅 Timeline Estimée

| Version | Fonctionnalités Clés | Timeline |
|---------|----------------------|----------|
| **1.2.0** | Toasts, Export date, Cache images | 1 semaine |
| **1.3.0** | Tags, Scraping, Tutoriel | 3 semaines |
| **2.0.0** | Listes multiples, Extension | 2 mois |
| **3.0.0** | Sync cloud, Notifications | 3+ mois |

---

## 💭 Idées en Vrac

- **Partage de liste** : Générer un lien pour partager une liste
- **Mode sombre** : Theme switcher
- **Statistiques** : Graphiques dépenses, catégories préférées
- **Import depuis Amazon** : Parser liste de souhaits Amazon
- **Wishlist publique** : Pour anniversaire/Noël
- **Alertes soldes** : Notification quand article en promo
- **Historique des prix** : Graphique évolution du prix
- **Notes vocales** : Enregistrer des notes audio
- **Scanner code-barres** : Recherche produit par code-barre
- **Gamification** : Points, badges pour objectifs atteints

---

**Dernière mise à jour :** 20 novembre 2025
**Version actuelle :** 1.1.0
**Prochaine version prévue :** 1.2.0 (fin novembre 2025)
**Auteur :** momoe

---

## 🤝 Contribution

Pour proposer une nouvelle feature :
1. Ajouter une issue dans ce fichier
2. Décrire l'objectif et la solution envisagée
3. Estimer la difficulté et le temps
4. Prioriser (P0, P1, P2, P3)
