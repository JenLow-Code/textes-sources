# Textes & Sources — V3

Site statique de lecture et de documentation comparée : Bible Louis Segond 1910, Coran arabe + traductions françaises, dossiers de critique textuelle et bibliothèque de sources.

## Lancer localement

Le projet doit être servi en HTTP afin que `data/research.json` et les API distantes fonctionnent correctement :

```bash
python -m http.server 8080
```

Puis ouvrir `http://localhost:8080`.

## Déploiement

Aucun build n'est nécessaire. Déployer la racine du dossier telle quelle.

### Cloudflare Pages

- Framework preset : None
- Build command : vide
- Build output directory : `/`
- Les règles `_headers` sont prises en charge par Cloudflare Pages.

### Vercel / autre hébergeur statique

Le site fonctionne comme un site statique classique. Les routes sont basées sur le hash (`#reader`, `#compare`, etc.), donc aucune règle de réécriture n'est nécessaire.

## Sources de données

- Bible : Midvash API (`https://api.midvash.com/v1`) — Louis Segond 1910.
- Coran : Al Quran Cloud (`https://api.alquran.cloud/v1`) — arabe Uthmani + traductions.
- Recherche : `data/research.json` — liens vers institutions, fac-similés et outils.

## Principes éditoriaux

Le site sépare explicitement :

1. donnée textuelle directement attestée ;
2. conclusion fortement étayée ;
3. interprétation plausible ;
4. hypothèse spéculative.

Une lecture confessionnelle doit être identifiée comme telle et ne doit jamais être présentée comme une lecture manuscrite.

## Données et droits

- Louis Segond 1910 est signalée comme domaine public par eBible et par la source Midvash.
- Al Quran Cloud demande de conserver l'attribution des traductions ; le lecteur affiche le nom/identifiant de la traduction reçue de l'API.
- Le code du site n'embarque pas de traduction coranique complète dans le dépôt.

## Fichiers principaux

- `index.html` — interface
- `styles.css` — design responsive
- `app.js` — lecteur, comparateur, notes, dossiers
- `data/research.json` — dossiers et registre de sources
- `sw.js` — cache du shell statique
- `_headers` — en-têtes de sécurité pour Cloudflare Pages
- `manifest.webmanifest` — PWA
