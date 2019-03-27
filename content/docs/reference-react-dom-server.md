---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

L’objet `ReactDOMServer` vous permet de produire sous forme de texte statique le balisage nécessaire à l’affichage  de composants. En règle générale, on l’utilise avec un serveur Node :

```js
// Modules ES
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Aperçu {#overview}

Les méthodes suivantes peuvent être utilisées aussi bien dans des environnements navigateurs que serveurs :

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

Les méthodes suivantes dépendent d’un module (`stream`) **disponible uniquement côté serveur**, elles ne fonctionneront donc pas dans un navigateur.

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Référence de l'API {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Produit le HTML initial d’un élément React, sous forme d’une chaîne de caractères. Vous pouvez utiliser cette méthode pour générer du HTML côté serveur et le renvoyer en réponse à la requête initiale, afin d’accélérer le chargement des pages et de permettre aux moteurs de recherche d’analyser vos pages dans une optique de référencement naturel *(SEO, NdT)*.

Si vous appelez [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) sur un nœud dont le balisage a déjà été généré par le serveur, React le conservera et se contentera d’y attacher les gestionnaires d’événements, ce qui vous permettra d’avoir une expérience de chargement initial des plus performantes.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similaire à [`renderToString`](#rendertostring), si ce n’est qu’elle ne crée pas d’attributs supplémentaires utilisés par React en interne, tels que `data-reactroot`. Ça peut être pratique si vous souhaitez utiliser React comme simple générateur de pages statiques, car supprimer les attributs supplémentaires économise quelques octets.

N’utilisez pas cette méthode si vous envisagez d’utiliser React côté client pour rendre le contenu interactif. Préférez [`renderToString`](#rendertostring) côté serveur, et [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) côté client.

* * *

### `renderToNodeStream()` {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Produit le HTML initial d’un élément React. Renvoie un [flux en lecture](https://nodejs.org/api/stream.html#stream_readable_streams) (`Readable`) qui génère une chaîne de caractères HTML. La sortie HTML de ce flux est identique à ce que [`ReactDOMServer.renderToString`](#rendertostring) renverrait.  Vous pouvez utiliser cette méthode pour générer du HTML côté serveur et le renvoyer en réponse à la requête initiale, afin d’accélérer le chargement des pages et de permettre aux moteurs de recherche d’analyser vos pages dans une optique de référencement naturel.

Si vous appelez [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) sur un nœud dont le balisage a déjà été généré par le serveur, React le conservera et se contentera d’y attacher les gestionnaires d’événements, ce qui vous permettra d’avoir une expérience de chargement initial des plus performantes.

>Remarque
>
> Côté serveur uniquement. Cette API n’est pas disponible côté navigateur.
>
> Le flux renvoyé par cette méthode est encodé en UTF-8. Si vous avez besoin d’un autre encodage, jetez un œil au projet [iconv-lite](https://www.npmjs.com/package/iconv-lite), qui fournit des flux de transformation pour le transcodage de texte.

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

Similaire à [`renderToNodeStream`](#rendertonodestream), si ce n’est qu’elle ne crée pas d’attributs supplémentaires utilisés par React en interne, tels que `data-reactroot`. Ça peut être pratique si vous souhaitez utiliser React comme simple générateur de pages statiques, car supprimer les attributs supplémentaires économise quelques octets.

La sortie HTML de ce flux est identique à ce que [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup) renverrait.

N’utilisez pas cette méthode si vous envisagez d’utiliser React côté client pour rendre le contenu interactif. Préférez [`renderToNodeStream`](#rendertonodestream) côté serveur, et [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) côté client.

>Remarque
>
Côté serveur uniquement. Cette API n’est pas disponible côté navigateur.
>
> Le flux renvoyé par cette méthode est encodé en UTF-8. Si vous avez besoin d’un autre encodage, jetez un œil au projet [iconv-lite](https://www.npmjs.com/package/iconv-lite), qui fournit des flux de transformation pour le transcodage de texte.
