---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

L’objet `ReactDOMServer` vous permet de produire sous forme de texte statique le balisage nécessaire à l’affichage  de composants. En règle générale, on l’utilise avec un serveur Node :

```js
<<<<<<< HEAD
// Modules ES
import ReactDOMServer from 'react-dom/server';
=======
// ES modules
import * as ReactDOMServer from 'react-dom/server';
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## Aperçu {#overview}

<<<<<<< HEAD
Les méthodes suivantes peuvent être utilisées aussi bien dans des environnements navigateurs que serveurs :
=======
These methods are only available in the **environments with [Node.js Streams](https://nodejs.dev/learn/nodejs-streams):**

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

These methods are only available in the **environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)** (this includes browsers, Deno, and some modern edge runtimes):

- [`renderToReadableStream()`](#rendertoreadablestream)

The following methods can be used in the environments that don't support streams:
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

<<<<<<< HEAD
Les méthodes suivantes dépendent d’un module (`stream`) **disponible uniquement côté serveur**, elles ne fonctionneront donc pas dans un navigateur.

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## Référence de l'API {#reference}
=======
## Reference {#reference}
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

<<<<<<< HEAD
Produit le HTML initial d’un élément React, sous forme d’une chaîne de caractères. Vous pouvez utiliser cette méthode pour générer du HTML côté serveur et le renvoyer en réponse à la requête initiale, afin d’accélérer le chargement des pages et de permettre aux moteurs de recherche d’analyser vos pages dans une optique de référencement naturel *(SEO, NdT)*.

Si vous appelez [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) sur un nœud dont le balisage a déjà été généré par le serveur, React le conservera et se contentera d’y attacher les gestionnaires d’événements, ce qui vous permettra d’avoir une expérience de chargement initial des plus performantes.
=======
Render a React element to its initial HTML. Returns a stream with a `pipe(res)` method to pipe the output and `abort()` to abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" via inline `<script>` tags later. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let didError = false;
const stream = renderToPipeableStream(
  <App />,
  {
    onShellReady() {
      // The content above all Suspense boundaries is ready.
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onShellError(error) {
      // Something errored before we could complete the shell so we emit an alternative shell.
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    },
    onAllReady() {
      // If you don't want streaming, use this instead of onShellReady.
      // This will fire after the entire page content is ready.
      // You can use this for crawlers or static generation.

      // res.statusCode = didError ? 500 : 200;
      // res.setHeader('Content-type', 'text/html');
      // stream.pipe(res);
    },
    onError(err) {
      didError = true;
      console.error(err);
    },
  }
);
```

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L36-L46).

> Note:
>
> This is a Node.js-specific API. Environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), like Deno and modern edge runtimes, should use [`renderToReadableStream`](#rendertoreadablestream) instead.
>
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
ReactDOMServer.renderToReadableStream(element, options);
```

<<<<<<< HEAD
Similaire à [`renderToString`](#rendertostring), si ce n’est qu’elle ne crée pas d’attributs supplémentaires utilisés par React en interne, tels que `data-reactroot`. Ça peut être pratique si vous souhaitez utiliser React comme simple générateur de pages statiques, car supprimer les attributs supplémentaires économise quelques octets.

N’utilisez pas cette méthode si vous envisagez d’utiliser React côté client pour rendre le contenu interactif. Préférez [`renderToString`](#rendertostring) côté serveur, et [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) côté client.
=======
Streams a React element to its initial HTML. Returns a Promise that resolves to a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let controller = new AbortController();
let didError = false;
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
      onError(error) {
        didError = true;
        console.error(error);
      }
    }
  );
  
  // This is to wait for all Suspense boundaries to be ready. You can uncomment
  // this line if you want to buffer the entire HTML instead of streaming it.
  // You can use this for crawlers or static generation:

  // await stream.allReady;

  return new Response(stream, {
    status: didError ? 500 : 200,
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

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerBrowser.js#L27-L35).

> Note:
>
> This API depends on [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). For Node.js, use [`renderToPipeableStream`](#rendertopipeablestream) instead.
>
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

* * *

### `renderToNodeStream()`  (Deprecated) {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

<<<<<<< HEAD
Produit le HTML initial d’un élément React. Renvoie un [flux en lecture](https://nodejs.org/api/stream.html#stream_readable_streams) (`Readable`) qui génère une chaîne de caractères HTML. La sortie HTML de ce flux est identique à ce que [`ReactDOMServer.renderToString`](#rendertostring) renverrait.  Vous pouvez utiliser cette méthode pour générer du HTML côté serveur et le renvoyer en réponse à la requête initiale, afin d’accélérer le chargement des pages et de permettre aux moteurs de recherche d’analyser vos pages dans une optique de référencement naturel.

Si vous appelez [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) sur un nœud dont le balisage a déjà été généré par le serveur, React le conservera et se contentera d’y attacher les gestionnaires d’événements, ce qui vous permettra d’avoir une expérience de chargement initial des plus performantes.
=======
Render a React element to its initial HTML. Returns a [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) that outputs an HTML string. The HTML output by this stream is exactly equal to what [`ReactDOMServer.renderToString`](#rendertostring) would return. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

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
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

>Remarque
>
Côté serveur uniquement. Cette API n’est pas disponible côté navigateur.
>
<<<<<<< HEAD
> Le flux renvoyé par cette méthode est encodé en UTF-8. Si vous avez besoin d’un autre encodage, jetez un œil au projet [iconv-lite](https://www.npmjs.com/package/iconv-lite), qui fournit des flux de transformation pour le transcodage de texte.
=======
> The stream returned from this method will return a byte stream encoded in utf-8. If you need a stream in another encoding, take a look at a project like [iconv-lite](https://www.npmjs.com/package/iconv-lite), which provides transform streams for transcoding text.

* * *

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Render a React element to its initial HTML. React will return an HTML string. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note
>
> This API has limited Suspense support and does not support streaming.
>
> On the server, it is recommended to use either [`renderToPipeableStream`](#rendertopipeablestream) (for Node.js) or [`renderToReadableStream`](#rendertoreadablestream) (for Web Streams) instead.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similar to [`renderToString`](#rendertostring), except this doesn't create extra DOM attributes that React uses internally, such as `data-reactroot`. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save some bytes.

If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c
