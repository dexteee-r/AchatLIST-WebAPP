# Guide de build — AchatLIST WebApp

## Prérequis

- **Node.js** >= 18 ([nodejs.org](https://nodejs.org))
- **npm** >= 9 (inclus avec Node.js)

Vérifier :
```bash
node -v
npm -v
```

---

## Installation

```bash
cd AchatLIST-WebAPP
npm install
```

---

## Commandes

| Commande | Description |
|---|---|
| `npm run dev` | Démarre le serveur de développement (http://localhost:5173) |
| `npm run build` | Génère le build de production dans `dist/` |
| `npm run preview` | Prévisualise le build de production en local |
| `npm test` | Lance les tests unitaires (Vitest) |
| `npm run test:watch` | Tests en mode watch (relance à chaque modification) |
| `npm run lint` | Analyse statique du code (ESLint) |

---

## Build de production

```bash
npm run build
```

Le build génère dans `dist/` :
```
dist/
├── index.html
├── registerSW.js
├── manifest.webmanifest
├── sw.js                    ← Service Worker PWA
├── workbox-*.js             ← Cache Workbox
└── assets/
    ├── index-*.js           ← Bundle JS (~241 kB / 76 kB gzip)
    └── index-*.css          ← Styles (~17 kB / 4 kB gzip)
```

Pour vérifier le build en local avant déploiement :
```bash
npm run build && npm run preview
```

---

## Tests

```bash
npm test
```

Résultat attendu : **5 tests passants** dans `src/utils/helpers.test.js`

```
Test Files  1 passed (1)
Tests       5 passed (5)
```

---

## Déploiement

### Netlify (recommandé)

1. Connecter le repo GitHub sur [netlify.com](https://netlify.com)
2. Paramètres de build :
   - **Build command :** `npm run build`
   - **Publish directory :** `dist`
3. Déployer

### Vercel

1. Connecter le repo GitHub sur [vercel.com](https://vercel.com)
2. Framework : **Vite** (détecté automatiquement)
3. Déployer

### Manuel (n'importe quel hébergeur statique)

```bash
npm run build
# Uploader le contenu du dossier dist/ sur ton hébergeur
```

> Le dossier `dist/` contient une app statique complète — aucun serveur Node.js requis.

---

## Notes importantes

- **Données utilisateur** : stockées en `localStorage` sous la clé `purchaseList_plaincss_v1`. Aucune donnée n'est envoyée en ligne.
- **PWA** : l'app fonctionne hors ligne après la première visite (Service Worker Workbox).
- **Migration données** : les anciens items avec `category` sont automatiquement convertis en `tags` au chargement.
- **Variables d'environnement** : aucune requise. L'app est 100% frontend.
