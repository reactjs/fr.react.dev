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

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToReadableStream()`](#rendertoreadablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Référence de l'API {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Produit le HTML initial d’un élément React, sous forme d’une chaîne de caractères. Vous pouvez utiliser cette méthode pour générer du HTML côté serveur et le renvoyer en réponse à la requête initiale, afin d’accélérer le chargement des pages et de permettre aux moteurs de recherche d’analyser vos pages dans une optique de référencement naturel *(SEO, NdT)*.

<<<<<<< HEAD
Si vous appelez [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) sur un nœud dont le balisage a déjà été généré par le serveur, React le conservera et se contentera d’y attacher les gestionnaires d’événements, ce qui vous permettra d’avoir une expérience de chargement initial des plus performantes.
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similaire à [`renderToString`](#rendertostring), si ce n’est qu’elle ne crée pas d’attributs supplémentaires utilisés par React en interne, tels que `data-reactroot`. Ça peut être pratique si vous souhaitez utiliser React comme simple générateur de pages statiques, car supprimer les attributs supplémentaires économise quelques octets.

<<<<<<< HEAD
N’utilisez pas cette méthode si vous envisagez d’utiliser React côté client pour rendre le contenu interactif. Préférez [`renderToString`](#rendertostring) côté serveur, et [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) côté client.
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

Render a React element to its initial HTML. Returns a [Control object](https://github.com/facebook/react/blob/3f8990898309c61c817fbf663f5221d9a00d0eaa/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L49-L54) that allows you to pipe the output or abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" later through javascript execution. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note:
>
> This is a Node.js specific API and modern server environments should use renderToReadableStream instead.
>

```
const {pipe, abort} = renderToPipeableStream(
  <App />,
  {
    onAllReady() {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      pipe(res);
    },
    onShellError(x) {
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    }
  }
);
```

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
    ReactDOMServer.renderToReadableStream(element, options);
```

Streams a React element to its initial HTML. Returns a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```
let controller = new AbortController();
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
    }
  );
  
  // This is to wait for all suspense boundaries to be ready. You can uncomment
  // this line if you don't want to stream to the client
  // await stream.allReady;

  return new Response(stream, {
    headers: {'Content-Type': 'text/html'},
  });
} catch (error) {
  return new Response(
    '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>',
    {
      status: 500,
      headers: {'Content-Type': 'text/html'},
    }
  );
}
```
* * *

### `renderToNodeStream()` {#rendertonodestream} (Deprecated)

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Produit le HTML initial d’un élément React. Renvoie un [flux en lecture](https://nodejs.org/api/stream.html#stream_readable_streams) (`Readable`) qui génère une chaîne de caractères HTML. La sortie HTML de ce flux est identique à ce que [`ReactDOMServer.renderToString`](#rendertostring) renverrait.  Vous pouvez utiliser cette méthode pour générer du HTML côté serveur et le renvoyer en réponse à la requête initiale, afin d’accélérer le chargement des pages et de permettre aux moteurs de recherche d’analyser vos pages dans une optique de référencement naturel.

<<<<<<< HEAD
Si vous appelez [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) sur un nœud dont le balisage a déjà été généré par le serveur, React le conservera et se contentera d’y attacher les gestionnaires d’événements, ce qui vous permettra d’avoir une expérience de chargement initial des plus performantes.
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

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

<<<<<<< HEAD
N’utilisez pas cette méthode si vous envisagez d’utiliser React côté client pour rendre le contenu interactif. Préférez [`renderToNodeStream`](#rendertonodestream) côté serveur, et [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) côté client.
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToNodeStream`](#rendertonodestream) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

>Remarque
>
Côté serveur uniquement. Cette API n’est pas disponible côté navigateur.
>
> Le flux renvoyé par cette méthode est encodé en UTF-8. Si vous avez besoin d’un autre encodage, jetez un œil au projet [iconv-lite](https://www.npmjs.com/package/iconv-lite), qui fournit des flux de transformation pour le transcodage de texte.
