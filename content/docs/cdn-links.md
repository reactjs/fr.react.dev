---
id: cdn-links
title: Liens CDN
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

React et ReactDOM sont tous deux accessibles depuis un CDN.

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
```

Les versions ci-dessus ne doivent être utilisées qu'à des fins de développement et ne sont pas adaptées à l'utilisation en production. Les versions minifiées et optimisées pour la production sont disponibles ici :

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
```

Pour charger une version spécifique de `react` et `react-dom`, il suffit de remplacer le `16` par la version souhaitée.

### Pourquoi utiliser l'attribut `crossorigin` ? {#why-the-crossorigin-attribute}

Si vous chargez React depuis un CDN, nous vous recommandons de conserver l'attribut [`crossorigin`](https://developer.mozilla.org/fr/docs/Web/HTML/Reglages_des_attributs_CORS) :

```html
<script crossorigin src="..."></script>
```

Nous vous conseillons également de vérifier que le CDN que vous utilisez définit bien l'en-tête HTTP `Access-Control-Allow-Origin: *` :

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

Cela améliore l’[expérience de gestion des erreurs](/blog/2017/07/26/error-handling-in-react-16.html) avec React 16 et des versions ultérieures.
