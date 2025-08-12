# 🛒 Liste d’achats – MVP

Application web personnelle permettant de créer et gérer une liste d’achats avec **trois niveaux de priorité**, des liens vers les produits et des attributs personnalisés.  
Fonctionne **offline** et peut être installée comme application **PWA**.

## 🚀 Fonctionnalités

- **Gestion complète des achats**
  - Titre, lien, prix, priorité (Haute/Moyenne/Basse)
  - Catégorie, date cible, notes
  - Attributs personnalisés (clé/valeur)
- **Filtrage & Tri**
  - Recherche par mot-clé
  - Filtre par priorité, état (acheté/non), catégorie
  - Tri par priorité, prix, date, titre…
- **Persistance locale**
  - Sauvegarde automatique en `localStorage` (offline-first)
- **Import / Export**
  - Export en CSV
  - Import depuis JSON
- **Mode PWA**
  - Installable sur PC/mobile
  - Fonctionne hors connexion
  - Auto-mise à jour

## 📦 Installation & Lancement

### 1. Cloner le repo
```bash
git clone https://github.com/dexteee-r/AchatLIST-WebAPP.git
cd <TON-REPO>
