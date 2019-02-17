---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

L’objet `ReactDOMServer` vous permet d’afficher des composants sous forme de balises statiques. En règle générale, on l’utilise avec un serveur Node :

```js
// Modules ES
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Aperçu {#overview}

Les méthodes suivantes peuvent être utilisées à la fois dans des environnements navigateurs et serveurs :

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

Les méthodes additionnelles suivantes dépendent du package (`stream`) **disponible uniquement pour serveurs**, elles ne fonctionneront pas dans un navigateur.

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Référence {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Crée le rendu d’un élément React sous sa forme HTML initiale. React va se charger de retourner une chaîne de charactères HTML. Vous pouvez utiliser cette méthode pour générer du HTML coté serveur et renvoyer le balisage en guise de réponse à la requête initiale, pour accélérer le chargement des pages et permettre aux moteurs de recherche d’analyser vos pages pour les référencer.

Si vous appelez [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) sur un nœud dont le balisage a déjà été généré par le serveur, React le conservera et n’y attachera que des gestionnaires d’événements, ce qui vous permettra d’avoir une expérience de premier chargement des plus performantes.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similaire à [`renderToString`](#rendertostring), si ce n’est qu’elle ne crée pas d’attributs supplémentaires utilisés par React en interne, à l’image de `data-reactroot`. Ça peut être pratique si vous souhaitez utiliser React comme simple générateur de pages statiques, supprimer les attributs supplémentaires vous économisant quelques octets.

Il n’est pas recommandé d’utiliser cette méthode si vous envisagez d’utiliser React coté client pour rendre le balisage interactif. À la place, utilisez [`renderToString`](#rendertostring) coté serveur, et [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) coté client.

* * *

### `renderToNodeStream()` {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Crée le rendu d’un élément React sous sa forme HTML initiale. Retourne un [Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) qui génère une chaîne de caractères HTML. La sortie HTML de ce flux est précisément égale à ce que [`ReactDOMServer.renderToString`](#rendertostring) renverrait.  Vous pouvez utiliser cette méthode pour générer du HTML coté serveur et renvoyer le balisage en guise se réponse à la requête initiale, pour accélérer le chargement des pages et permettre aux moteurs de recherche d’analyser vos pages pour les référencer.

Si vous appelez [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) sur un nœud dont le balisage a déjà été généré par le serveur, React le conservera et n’y attachera que des gestionnaires d’événements, ce qui vous permettra d’avoir une expérience de premier chargement des plus performantes.

> Note :
>
> Pour serveur uniquement. Cette API n’est pas disponible pour navigateur.
>
> Le flux renvoyé par cette méthode renverra un flux d’octets encodés en utf-8. Si vous avez besoin d’un flux dans un autre encodage, jetez un coup d’œil au projet [iconv-lite](https://www.npmjs.com/package/iconv-lite), qui fournit des flux de transformation pour le transcodage de texte.

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

Similaire à [`renderToNodeStream`](#rendertonodestream), si ce n’est qu’elle ne crée pas d’attributs supplémentaires utilisés par React en interne, à l’image de `data-reactroot`. Ça peut être pratique si vous souhaitez utiliser React comme simple générateur de pages statiques, supprimer les attributs supplémentaires vous économisant quelques octets.

La sortie HTML de ce flux est précisément égale à ce que  [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup) renverrait.

Il n’est pas recommandé d’utiliser cette méthode si vous envisagez d’utiliser React coté client pour rendre le balisage interactif. À la place, utilisez [`renderToNodeStream`](#rendertonodestream) coté serveur, et [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) coté client.

> Note :
>
> Pour serveur uniquement. Cette API n’est pas disponible pour navigateur.
>
> Le flux renvoyé par cette méthode renverra un flux d’octets encodés en utf-8. Si vous avez besoin d’un flux dans un autre encodage, jetez un coup d’œil au projet [iconv-lite](https://www.npmjs.com/package/iconv-lite), qui fournit des flux de transformation pour le transcodage de texte.
