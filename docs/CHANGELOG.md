# Changelog - Liste d'Achats

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Non publié]

### À venir
- Système de notifications avec react-toastify
- Migration vers TypeScript
- Tests unitaires et d'intégration
- Système de tags multiples
- Extension navigateur pour sauvegarder rapidement des articles
- Tutoriel pour nouveaux utilisateurs
- Nom de fichier avec date pour export JSON

---

## [1.1.0] - 2025-11-20

### 🎨 Refactorisation Majeure

#### Ajouté
- **Nouveau dossier `src/components/`** avec 5 composants modulaires
  - `ItemForm.jsx` - Formulaire d'ajout/édition d'articles
  - `ItemCard.jsx` - Carte d'affichage d'un article
  - `ItemList.jsx` - Liste complète des articles
  - `FilterBar.jsx` - Barre de filtres et de tri
  - `BudgetSummary.jsx` - Résumé budgétaire

- **Nouveau dossier `src/utils/`** avec utilitaires partagés
  - `constants.js` - Constantes globales (PRIORITIES, STORAGE_KEY, emptyItem)
  - `helpers.js` - Fonctions utilitaires (pmeta, validUrl, exportCSV, importJSON, fetchProductImage)

- **Nouveau dossier `docs/`** avec documentation complète
  - `ARCHITECTURE.md` - Architecture technique détaillée
  - `CHANGELOG.md` - Ce fichier
  - `GUIDE_DEVELOPPEMENT.md` - Guide pour développeurs
  - `COMPOSANTS.md` - Documentation des composants
  - `ROADMAP.md` - Feuille de route des fonctionnalités

#### Modifié
- **App.jsx** - Réduit de 430 à 163 lignes (62% de réduction)
  - Extraction de toute la logique UI vers les composants
  - Garde uniquement la gestion d'état et la logique métier
  - Import des utilitaires depuis les nouveaux modules

- **AchatForm.jsx** et **AchatList.jsx** - Convertis en re-exports
  - Maintien de la compatibilité avec les anciens imports
  - Redirection vers ItemForm et ItemList

#### Supprimé
- `src/App.css` - Fichier CSS inutilisé (styles par défaut Vite)
- `src/index.css` - Fichier CSS inutilisé (styles par défaut Vite)

#### Technique
- Amélioration de la séparation des responsabilités
- Code plus maintenable et testable
- Architecture modulaire facilitant l'ajout de nouvelles fonctionnalités
- Réduction de la duplication de code

---

## [1.0.0] - 2025-11-19

### 🎉 Version Initiale MVP

#### Ajouté
- **Gestion complète des articles d'achat**
  - Ajout, édition, suppression d'articles
  - Champs : titre, URL, prix, priorité, catégorie, date cible, notes
  - Système d'attributs personnalisés clé-valeur
  - Marquage acheté/non acheté

- **Système de priorités**
  - 3 niveaux : Haute (rouge), Moyenne (ambre), Basse (vert)
  - Badges visuels colorés
  - Tri par poids de priorité

- **Récupération automatique d'images produits**
  - Intégration API Microlink pour Open Graph
  - Fetch automatique au blur du champ URL
  - Bouton manuel de recherche d'image 🔍
  - Affichage des images 120x120px

- **Filtrage et recherche avancés**
  - Recherche textuelle (titre, catégorie, notes, URL, attributs)
  - Filtre par priorité (Haute/Moyenne/Basse/Toutes)
  - Filtre par état d'achat (Tous/À acheter/Achetés)
  - Filtre par catégorie dynamique
  - Liste des catégories générée automatiquement

- **Système de tri**
  - Tri par : Priorité, Prix, Date cible, Date d'ajout, Titre
  - Ordre : Ascendant ou Descendant
  - Tri réactif avec useMemo

- **Gestion budgétaire**
  - Calcul du budget total (tous articles)
  - Calcul du budget restant (articles non achetés)
  - Affichage en EUR avec 2 décimales

- **Import/Export de données**
  - Export CSV avec tous les champs + imageUrl
  - Export JSON via bouton dédié (utilise storages.js)
  - Import JSON avec validation et normalisation

- **PWA (Progressive Web App)**
  - Service Worker avec stratégie de cache
  - Installable sur desktop et mobile
  - Icônes PWA 192x192 et 512x512
  - Fonctionne 100% hors-ligne
  - Thème standalone
  - Auto-update du service worker

- **Persistance des données**
  - Sauvegarde automatique dans localStorage
  - Clé : `purchaseList_plaincss_v1`
  - Synchronisation en temps réel
  - Aucune donnée envoyée en ligne

- **Interface utilisateur**
  - Design épuré avec CSS pur
  - Variables CSS pour le theming
  - Layout responsive avec CSS Grid
  - Transitions et animations subtiles
  - Footer informatif sur la confidentialité

#### Technique
- **Stack:** React 19.1.1 + Vite 7.2.2
- **Build:** Vite avec Fast Refresh
- **PWA:** vite-plugin-pwa 1.1.0 + Workbox 7.3.0
- **Linting:** ESLint 9.33.0
- **Style:** CSS pur avec variables
- **API:** Microlink pour images Open Graph

---

## Légende des Sections

- **Ajouté** : Nouvelles fonctionnalités
- **Modifié** : Changements aux fonctionnalités existantes
- **Déprécié** : Fonctionnalités qui seront retirées
- **Supprimé** : Fonctionnalités retirées
- **Corrigé** : Corrections de bugs
- **Sécurité** : Corrections de vulnérabilités

---

## Notes de Versions

### Numérotation Sémantique

- **MAJEUR** (X.0.0) : Changements incompatibles avec les versions précédentes
- **MINEUR** (0.X.0) : Ajout de fonctionnalités rétro-compatibles
- **PATCH** (0.0.X) : Corrections de bugs rétro-compatibles

### Branches Git

- `main` : Version stable en production
- `develop` : Version de développement
- `feature/*` : Nouvelles fonctionnalités
- `bugfix/*` : Corrections de bugs
- `hotfix/*` : Corrections urgentes en production

---

## Historique des Commits Importants

### Refactorisation Novembre 2025
```
c185db0 - [UPDATE] remise à neuf du code avec ajout de la feature "Exporter et Importer la liste d'achat en json"
f7ed390 - ajout d'image pour les articles
4a5d6b8 - maj du readme
74791ec - MAJ du README
20dd4d6 - config PWA
```

---

## Auteurs

- **Développeur Principal** : momoe
- **Assistant IA** : Claude (Anthropic) pour la refactorisation v1.1.0

---

## Licence

Ce projet est un projet personnel privé. Tous droits réservés.
