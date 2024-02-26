---
title: renderToNodeStream
---

<Deprecated>

Cette API sera retirée d'une future version majeure de React. Utilisez plutôt [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).

</Deprecated>

<Intro>

`renderToNodeStream` fait le rendu d'un arbre React dans un [flux Node.js en lecture](https://nodejs.org/api/stream.html#readable-streams).

```js
const stream = renderToNodeStream(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `renderToNodeStream(reactNode, options?)` {/*rendertonodestream*/}

Côté serveur, appelez `renderToNodeStream` pour obtenir un [flux Node.js en lecture](https://nodejs.org/api/stream.html#readable-streams) que vous pouvez connecter *(pipe, NdT)* vers la réponse.

```js
import { renderToNodeStream } from 'react-dom/server';

const stream = renderToNodeStream(<App />);
stream.pipe(response);
```

Côté client, appelez [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) pour rendre interactif ce HTML généré côté serveur.

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `reactNode` : un nœud React dont vous souhaitez produire le HTML. Ça pourrait par exemple être un élément JSX tel que `<App />`.

* `options` **optionnelles** : un objet avec des options pour le rendu côté serveur.
  * `identifierPrefix` **optionnel** : un préfixe textuel utilisé pour les ID générés par [`useId`](/reference/react/useId). Pratique pour éviter les conflits entre les ID au sein de racines multiples sur une même page. Doit être le même préfixe que celui passé à[`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters).

#### Valeur renvoyée {/*returns*/}

Un [flux Node.js en lecture](https://nodejs.org/api/stream.html#readable-streams) qui produit le texte HTML.

#### Limitations {/*caveats*/}

* Cette méthode attendra que toutes les [périmètres Suspense](/reference/react/Suspense) aboutissent avant de commencer à produire le moindre rendu.

* À partir de React 18, cette méthode utilise un tampon pour l'ensemble de sa production, de sorte qu'elle n'a aucun des avantages du *streaming*.  C'est pourquoi nous vous conseillons plutôt de migrer vers [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).

* Le flux renvoyé est encodé en UTF-8. Si vous avez besoin d'un flux avec un autre encodage, regardez les projets tels qu'[iconv-lite](https://www.npmjs.com/package/iconv-lite), qui fournissent des flux de transformation pour le transcodage de textes.

---

## Utilisation {/*usage*/}

### Produire le HTML d'un arbre React sous forme d'un flux Node.js en lecture {/*rendering-a-react-tree-as-html-to-a-nodejs-readable-stream*/}

Appelez `renderToNodeStream` pour obtenir un [flux Node.js en lecture](https://nodejs.org/api/stream.html#readable-streams) que vous pouvez connecter *(pipe, NdT)* vers la réponse :

```js {5-6}
import { renderToNodeStream } from 'react-dom/server';

// La syntaxe du gestionnaire de route dépend de votre
// framework côté serveur
app.use('/', (request, response) => {
  const stream = renderToNodeStream(<App />);
  stream.pipe(response);
});
```

Le flux produira le HTML initial, non interactif, de vos composants React. Côté client, vous aurez besoin d'appeler [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) pour *hydrater* ce HTML généré côté serveur et le rendre interactif.
