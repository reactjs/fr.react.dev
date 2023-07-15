---
title: API React DOM côté serveur
---

<Intro>

Les API `react-dom/server` vous permettent de produire le HTML de vos composants React côté serveur. Ces API ne sont utilisées que côté serveur, à la racine de votre appli, pour générer le HTML initial. Un [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) pourrait les appeler pour vous.  La plupart de vos composants n'auront pas besoin de les importer, encore moins de les utiliser.

</Intro>

---

## API côté serveur pour les flux Node.js {/*server-apis-for-nodejs-streams*/}

Ces méthodes sont uniquement disponibles pour les environnements dotés de [flux Node.js](https://nodejs.org/api/stream.html) :

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) fait le rendu d'un arbre React dans un [flux Node.js](https://nodejs.org/api/stream.html) consommable par une *pipeline*.
* [`renderToStaticNodeStream`](/reference/react-dom/server/renderToStaticNodeStream) fait le rendu d'un arbre React non interactif dans un [flux Node.js en lecture](https://nodejs.org/api/stream.html#readable-streams).

---

## API côté serveur pour les flux web {/*server-apis-for-web-streams*/}

Ces méthodes sont uniquement disponibles pour les environnements dotés de [flux web](https://developer.mozilla.org/docs/Web/API/Streams_API), ce qui inclut les navigateurs, Deno, et quelques moteurs JavaScript très récents :

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) fait le rendu d'un arbre React dans un [flux web en lecture](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).

---

## API côté serveur pour les environnements sans flux {/*server-apis-for-non-streaming-environments*/}

Ces méthodes peuvent être utilisés dans les environnements qui ne prennent pas les flux en charge :

* [`renderToString`](/reference/react-dom/server/renderToString) produit le HTML d'un arbre React sous forme d'une chaîne de caractères.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) produit le HTML non interactif d'un arbre React sous forme d'une chaîne de caractères.

Leurs fonctionnalités sont limitées par rapport aux API à base de flux.

---

## API côté serveur dépréciées {/*deprecated-server-apis*/}

<Deprecated>

Ces API seront retirées d'une future version majeure de React.

</Deprecated>

* [`renderToNodeStream`](/reference/react-dom/server/renderToNodeStream) fait le rendu d'un arbre React dans un [flux Node.js en lecture](https://nodejs.org/api/stream.html#readable-streams) (dépréciée).
