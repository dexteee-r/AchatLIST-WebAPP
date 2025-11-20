# 🛒 Liste d'Achats - PWA

> Application web personnelle de gestion de liste d'achats avec priorités, filtres avancés, et récupération automatique d'images. Fonctionne 100% hors-ligne.

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-7.2.2-646cff.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-success.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)

---

## 📸 Aperçu

Une application moderne pour gérer vos achats futurs avec :
- ✅ **Priorités visuelles** (Haute/Moyenne/Basse)
- ✅ **Images produits automatiques** via Microlink API
- ✅ **Filtrage et tri avancés**
- ✅ **100% offline** - Aucune donnée envoyée en ligne
- ✅ **PWA installable** sur PC et mobile
- ✅ **Export CSV et JSON**

---

## 🚀 Fonctionnalités

### 🎯 Gestion des Articles

- **Champs complets** : Titre, URL, Prix, Priorité, Catégorie, Date cible, Notes
- **Attributs personnalisés** : Ajouter des champs clé-valeur personnalisés
- **Images produits** : Récupération automatique depuis les URLs
- **États** : Marquer comme "Acheté" ou "À acheter"
- **Actions** : Éditer, Supprimer, Copier le lien

### 🔍 Filtrage et Tri

- **Recherche textuelle** : Chercher dans titre, catégorie, notes, URL, attributs
- **Filtres** :
  - Par priorité (Haute/Moyenne/Basse/Toutes)
  - Par état (Tous/À acheter/Achetés)
  - Par catégorie (générées dynamiquement)
- **Tri** :
  - Par priorité, prix, date cible, date d'ajout, ou titre
  - Ordre ascendant ou descendant

### 💰 Gestion Budgétaire

- **Budget total** : Somme de tous les articles
- **Budget restant** : Somme des articles non achetés
- Affichage en EUR avec 2 décimales

### 💾 Import / Export

- **Export CSV** : Tous les champs avec date dans le nom (`liste_achats_YYYY-MM-DD.csv`)
- **Export JSON** : Sauvegarde complète
- **Import JSON** : Restauration avec validation des données

### 📱 Progressive Web App

- **Installable** : Sur desktop (Chrome, Edge) et mobile (iOS, Android)
- **Offline-first** : Fonctionne sans connexion internet
- **Auto-update** : Service Worker avec mise à jour automatique
- **Icônes** : 192x192 et 512x512 pour tous les écrans

### 🎨 Interface

- **Design épuré** : CSS pur avec variables pour theming
- **Responsive** : Fonctionne sur tous les écrans
- **Badges colorés** : Identification visuelle rapide des priorités
- **Grid layout** : Organisation claire et moderne

---

## 📦 Installation

### Prérequis

- **Node.js** : Version 18+ ([télécharger](https://nodejs.org/))
- **npm** : Version 9+ (inclus avec Node.js)

### 1. Cloner le Projet

```bash
git clone https://github.com/dexteee-r/AchatLIST-WebAPP.git
cd Perso-WEB_APP-LISTE_ACHAT
```

### 2. Installer les Dépendances

```bash
npm install
```

### 3. Lancer en Développement

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:5173**

### 4. Build de Production

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

### 5. Prévisualiser le Build

```bash
npm run preview
```

---

## 📁 Structure du Projet

```
Perso-WEB_APP-LISTE_ACHAT/
├── public/                       # Assets statiques
│   ├── pwa-192.png              # Icône PWA 192x192
│   ├── pwa-512.png              # Icône PWA 512x512
│   └── vite.svg
│
├── src/
│   ├── components/              # Composants React
│   │   ├── ItemForm.jsx        # Formulaire d'ajout/édition (169 lignes)
│   │   ├── ItemCard.jsx        # Carte d'article (94 lignes)
│   │   ├── ItemList.jsx        # Liste d'articles (28 lignes)
│   │   ├── FilterBar.jsx       # Filtres et tri (89 lignes)
│   │   ├── BudgetSummary.jsx   # Résumé budgétaire (8 lignes)
│   │   ├── AchatForm.jsx       # Re-export legacy
│   │   └── AchatList.jsx       # Re-export legacy
│   │
│   ├── utils/                   # Utilitaires
│   │   ├── constants.js        # Constantes (PRIORITIES, STORAGE_KEY)
│   │   ├── helpers.js          # Fonctions utilitaires
│   │   └── storages.js         # Gestion JSON
│   │
│   ├── App.jsx                  # Composant racine (163 lignes)
│   ├── main.jsx                 # Point d'entrée + PWA
│   └── styles.css               # Styles globaux
│
├── docs/                        # 📚 Documentation complète
│   ├── ARCHITECTURE.md         # Architecture technique
│   ├── CHANGELOG.md            # Historique des modifications
│   ├── GUIDE_DEVELOPPEMENT.md  # Guide développeur
│   ├── COMPOSANTS.md           # Documentation des composants
│   └── ROADMAP.md              # Feuille de route
│
├── index.html                   # HTML racine
├── vite.config.js              # Configuration Vite + PWA
├── package.json                # Dépendances
├── eslint.config.js            # Configuration ESLint
└── README.md                   # Ce fichier
```

---

## 🛠️ Technologies Utilisées

| Technologie | Version | Usage |
|------------|---------|-------|
| **React** | 19.1.1 | Framework UI |
| **Vite** | 7.2.2 | Build tool ultra-rapide |
| **vite-plugin-pwa** | 1.1.0 | Support PWA |
| **Workbox** | 7.3.0 | Service Worker |
| **ESLint** | 9.33.0 | Linter |
| **Microlink API** | - | Récupération images Open Graph |

---

## 📖 Documentation

### Documentation Complète

Toute la documentation est disponible dans le dossier [`docs/`](docs/) :

| Document | Description |
|----------|-------------|
| [**ARCHITECTURE.md**](docs/ARCHITECTURE.md) | Architecture technique détaillée, flux de données, modèles |
| [**GUIDE_DEVELOPPEMENT.md**](docs/GUIDE_DEVELOPPEMENT.md) | Guide pour développeurs, ajout de features, debugging |
| [**COMPOSANTS.md**](docs/COMPOSANTS.md) | Documentation complète de chaque composant |
| [**CHANGELOG.md**](docs/CHANGELOG.md) | Historique des modifications |
| [**ROADMAP.md**](docs/ROADMAP.md) | Fonctionnalités futures prévues |

### Guides Rapides

#### Ajouter un Nouvel Article

1. Remplir le champ **Titre** (requis)
2. Coller l'**URL du produit** (optionnel) - L'image sera récupérée automatiquement
3. Ajouter le **prix** en EUR
4. Choisir la **priorité** (Haute/Moyenne/Basse)
5. Cliquer sur **Ajouter**

#### Filtrer la Liste

1. Utiliser la **barre de recherche** pour chercher par mots-clés
2. Sélectionner un **filtre de priorité**
3. Choisir l'**état** (Tous/À acheter/Achetés)
4. Sélectionner une **catégorie**
5. Choisir un **tri** (Priorité, Prix, Date, Titre)

#### Exporter vos Données

- **CSV** : Cliquer sur "Exporter CSV" dans le header
- **JSON** : Cliquer sur "Sauvegarder la liste (load a JSON)"

Les fichiers seront téléchargés avec la date : `liste_achats_2025-11-20.csv`

#### Importer des Données

1. Cliquer sur **Import JSON** dans le header
2. Sélectionner votre fichier `.json`
3. Les données seront validées et chargées

---

## 🎨 Personnalisation

### Changer les Couleurs

Modifier les variables CSS dans `src/styles.css` :

```css
:root {
  --primary: #3b82f6;      /* Couleur primaire */
  --border: #e5e7eb;       /* Couleur des bordures */
  --muted: #6b7280;        /* Texte secondaire */
  --background: #f9fafb;   /* Fond de page */
}
```

### Ajouter une Priorité

1. Modifier `src/utils/constants.js` :

```javascript
export const PRIORITIES = [
  { id: 'critical', label: 'Critique', weight: 4, cls: 'badge purple' },
  { id: 'high', label: 'Haute', weight: 3, cls: 'badge red' },
  // ... autres priorités
];
```

2. Ajouter le style dans `src/styles.css` :

```css
.badge.purple {
  background: #ede9fe;
  color: #6d28d9;
  border-color: #ddd6fe;
}
```

### Changer le Nom de l'App

Modifier dans :
- `package.json` : `"name"`
- `index.html` : `<title>`
- `vite.config.js` : `manifest.name`
- `src/App.jsx` : `<div className="title">`

---

## 🚀 Déploiement

### Option 1 : Vercel (Recommandé)

```bash
npm install -g vercel
npm run build
vercel --prod
```

### Option 2 : Netlify

1. Connecter votre repo GitHub à Netlify
2. **Build command** : `npm run build`
3. **Publish directory** : `dist`

### Option 3 : Serveur Proxmox (Intranet)

Voir [note_a_moi_meme.md](note_a_moi_meme.md) pour le guide complet.

**Résumé :**

```bash
# Sur votre VM Linux
npm run build

# Copier dans nginx
sudo cp -r dist/* /var/www/html/
sudo systemctl restart nginx
```

Accès via l'IP locale : `http://192.168.x.x`

---

## 🔐 Sécurité et Confidentialité

### Aucune Donnée Envoyée en Ligne

- ✅ Toutes les données sont stockées **localement** dans votre navigateur (localStorage)
- ✅ **Aucun serveur** ne reçoit vos informations
- ✅ **Pas de tracking**, pas d'analytics
- ✅ **Pas de compte** requis

### API Externe

L'application utilise **Microlink API** (https://api.microlink.io) pour récupérer les images Open Graph des produits. Seule l'URL du produit est envoyée à cette API.

### Backup Recommandé

Vos données sont dans localStorage. Pour éviter toute perte :

1. **Exporter régulièrement** en JSON
2. Sauvegarder le fichier sur un cloud (Google Drive, Dropbox)
3. Ou utiliser la synchronisation (feature future)

---

## 🐛 Problèmes Connus et Solutions

### Les Images ne se Chargent Pas

**Causes possibles :**
- L'API Microlink est lente ou down
- Le site cible n'a pas d'image Open Graph
- Problème de connexion internet

**Solution :**
- Cliquer sur le bouton 🔍 pour forcer la recherche
- Attendre quelques secondes
- Vérifier que l'URL est correcte

### Mes Données ont Disparu

**Causes possibles :**
- localStorage effacé par le navigateur
- Navigation privée utilisée

**Solution :**
- Importer votre dernier backup JSON
- Éviter le mode navigation privée
- Exporter régulièrement

### L'App ne s'Installe Pas (PWA)

**Causes possibles :**
- Navigateur non compatible
- Pas en HTTPS (sauf localhost)

**Solution :**
- Utiliser Chrome, Edge, ou Safari (iOS)
- S'assurer que le site est en HTTPS en production

---

## 📈 Performances

### Optimisations Actuelles

- ✅ **useMemo** pour calculs coûteux (filtrage, tri, budgets)
- ✅ **localStorage** pour persistance rapide
- ✅ **Service Worker** pour cache offline
- ✅ **Vite** pour build ultra-rapide

### Optimisations Futures

- React.memo sur ItemCard
- Virtualisation pour listes longues (react-window)
- Lazy loading des images
- Code splitting

---

## 🗺️ Roadmap

Consultez [ROADMAP.md](docs/ROADMAP.md) pour la liste complète des fonctionnalités prévues.

### Prochaines Versions

**v1.2.0** (fin novembre 2025)
- Notifications modernes (react-toastify)
- Cache d'images
- Export JSON avec date

**v1.3.0** (décembre 2025)
- Système de tags multiples
- Tutoriel interactif
- Scraping amélioré

**v2.0.0** (Q1 2026)
- Listes multiples
- Extension navigateur
- Mode "Plus envie"

---

## 🤝 Contribution

Ce projet est actuellement personnel et privé. Si vous souhaitez contribuer :

1. Forker le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'feat: Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Conventions de Commit

Utiliser [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Changements CSS/visuels
- `refactor:` Refactorisation
- `test:` Tests
- `chore:` Maintenance

---

## 📝 Changelog

Voir [CHANGELOG.md](docs/CHANGELOG.md) pour l'historique détaillé des versions.

### Version Actuelle : 1.1.0 (20/11/2025)

**Refactorisation majeure :**
- Extraction de 5 composants depuis App.jsx
- Création du dossier `utils/` avec helpers
- Réduction de App.jsx de 430 à 163 lignes
- Documentation complète dans `docs/`

---

## 📄 Licence

Ce projet est un **projet personnel privé**. Tous droits réservés.

Pour toute question sur l'utilisation, contactez l'auteur.

---

## 👤 Auteur

**momoe**

- GitHub : [@dexteee-r](https://github.com/dexteee-r)
- Projet : [AchatLIST-WebAPP](https://github.com/dexteee-r/AchatLIST-WebAPP)

---

## 🙏 Remerciements

- **Microlink API** pour la récupération d'images
- **Vite** pour le build ultra-rapide
- **React Team** pour React 19
- **Workbox** pour le Service Worker
- **Claude (Anthropic)** pour l'assistance à la refactorisation v1.1.0

---

## 📚 Ressources Utiles

### Documentation Officielle

- [React 19 Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [PWA Guide](https://web.dev/progressive-web-apps/)

### Tutoriels

- [React Hooks](https://react.dev/reference/react)
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### Outils de Développement

- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) (audit PWA)
- [Can I Use](https://caniuse.com/) (compatibilité)

---

## 🆘 Support

### Besoin d'Aide ?

1. Consultez la [documentation complète](docs/)
2. Cherchez dans les [issues GitHub](https://github.com/dexteee-r/AchatLIST-WebAPP/issues)
3. Créez une nouvelle issue si nécessaire

### Questions Fréquentes

Voir [GUIDE_DEVELOPPEMENT.md - FAQ](docs/GUIDE_DEVELOPPEMENT.md#faq)

---

**Fait avec ❤️ et beaucoup de ☕**

*Dernière mise à jour : 20 novembre 2025*
*Version : 1.1.0*
