# Cloudflare Worker — CORS Proxy

Ce worker agit comme proxy CORS : il fetch une page produit côté serveur (avec un User-Agent réaliste) et renvoie le HTML brut à l'app, contournant les restrictions CORS des navigateurs.

## Déploiement (5 étapes)

### Option A — Wrangler CLI (recommandée)

**1. Installer Wrangler**
```bash
npm install -g wrangler
```

**2. S'authentifier**
```bash
wrangler login
```

**3. Se placer dans ce dossier**
```bash
cd cloudflare-worker
```

**4. Déployer**
```bash
wrangler deploy worker.js --name achat-list-scraper --compatibility-date 2024-09-01
```

**5. Copier l'URL affichée** (format `https://achat-list-scraper.<votre-sous-domaine>.workers.dev`)  
et la coller dans `src/utils/scraper.js` à la ligne :
```js
const WORKER_URL = 'https://achat-list-scraper.<votre-sous-domaine>.workers.dev';
```

---

### Option B — Dashboard Cloudflare

1. Aller sur [workers.cloudflare.com](https://workers.cloudflare.com) → **Create a Worker**
2. Remplacer le contenu par défaut par celui de `worker.js`
3. Cliquer **Deploy**
4. Copier l'URL du worker et la coller dans `src/utils/scraper.js`

---

## Notes

- **Plan gratuit Cloudflare Workers** : 100 000 requêtes/jour — largement suffisant pour un usage personnel.
- **Timeout** : le worker abandonne les fetches après 10 secondes.
- **Anti-scraping** : certains sites (Amazon, Cdiscount) peuvent retourner une page Cloudflare ou un contenu minimal. L'app utilise Microlink en fallback dans ce cas.
- L'app fonctionne **sans ce worker** : tant que `WORKER_URL` reste sur la valeur placeholder, seul Microlink est utilisé.
