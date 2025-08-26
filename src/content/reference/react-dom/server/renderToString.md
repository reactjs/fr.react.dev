---
title: renderToString
---

<Pitfall>

`renderToString` ne prend en charge ni le *streaming* ni l'attente du chargement de données. [Découvrez les alternatives](#alternatives).

</Pitfall>

<Intro>

`renderToString` fait le rendu d'un arbre React sous forme de texte HTML.

```js
const html = renderToString(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `renderToString(reactNode, options?)` {/*rendertostring*/}

Côté serveur, appelez `renderToString` pour produire le HTML de votre appli.

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

Côté client, appelez [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) pour rendre interactif ce HTML généré côté serveur.

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `reactNode` : un nœud React dont vous souhaitez produire le HTML. Ça pourrait par exemple être un élément JSX tel que `<App />`.
* `options` **optionnelles** : un objet avec des options pour le rendu côté serveur.
  * `identifierPrefix` **optionnel** : un préfixe textuel utilisé pour les ID générés par [`useId`](/reference/react/useId). Pratique pour éviter les conflits entre les ID au sein de racines multiples sur une même page.

#### Valeur renvoyée {/*returns*/}

Une chaîne de caractères contenant le HTML.

#### Limitations {/*caveats*/}

* `renderToString` n'a qu'une prise en charge limitée de Suspense. Si votre composant suspend, `renderToString` renverra immédiatement le HTML de son JSX de secours.

* `renderToString` fonctionne côté navigateur, mais nous [déconseillons](#removing-rendertostring-from-the-client-code) de l'utiliser côté client.

---

## Utilisation {/*usage*/}

### Produire le HTML d'un arbre React sous forme d'une chaîne de caractères {/*rendering-a-react-tree-as-html-to-a-string*/}

Appelez `renderToString` pour produire le texte HTML de votre appli, que vous pourrez alors renvoyer dans votre réponse serveur :

```js {5-6}
import { renderToString } from 'react-dom/server';

// La syntaxe du gestionnaire de route dépend de votre
// framework côté serveur
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

Ça produira le HTML initial, non interactif, de vos composants React. Côté client, vous aurez besoin d'appeler [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) pour *hydrater* ce HTML généré côté serveur et le rendre interactif.


<Pitfall>

`renderToString` ne prend en charge ni le *streaming* ni l'attente du chargement de données. [Découvrez les alternatives](#alternatives).

</Pitfall>

---

## Alternatives {/*alternatives*/}

<<<<<<< HEAD
### Migrer de `renderToString` vers une méthode de *streaming* côté serveur {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString` renvoie immédiatement un texte, elle ne prend donc en charge ni le *streaming* ni la suspension pour chargement de données.
=======
### Migrating from `renderToString` to a streaming render on the server {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString` returns a string immediately, so it does not support streaming content as it loads.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

Autant que possible nous conseillons d'utiliser plutôt une de ces alternatives plus capables :

* Si vous utilisez Node.js, utilisez [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).
* Si vous utilisez Deno ou un moteur léger moderne doté des [Web Streams](https://developer.mozilla.org/fr/docs/Web/API/Streams_API), utilisez [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream).

Vous pouvez continuer avec `renderToString` si votre environnement serveur ne prend pas en charge les flux.

---

<<<<<<< HEAD
### Retirer `renderToString` du code côté client {/*removing-rendertostring-from-the-client-code*/}
=======
### Migrating from `renderToString` to a static prerender on the server {/*migrating-from-rendertostring-to-a-static-prerender-on-the-server*/}

`renderToString` returns a string immediately, so it does not support waiting for data to load for static HTML generation.

We recommend using these fully-featured alternatives:

* If you use Node.js, use [`prerenderToNodeStream`.](/reference/react-dom/static/prerenderToNodeStream)
* If you use Deno or a modern edge runtime with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), use [`prerender`.](/reference/react-dom/static/prerender)

You can continue using `renderToString` if your static site generation environment does not support streams.

---

### Removing `renderToString` from the client code {/*removing-rendertostring-from-the-client-code*/}
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

Il arrive que `renderToString` soit utilisée côté client pour convertir un composant en HTML.

```js {1-2}
// 🚩 Inutile : utilisation de renderToString côté client
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // Par exemple "<svg>...</svg>"
```

L'import de `react-dom/server` **côté client** augmente pour rien la taille de votre *bundle*, nous vous le déconseillons donc.  Si vous avez besoin d'obtenir côté client le HTML d'un composant, utilisez [`createRoot`](/reference/react-dom/client/createRoot) puis lisez le HTML directement depuis le DOM :

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML); // Par exemple "<svg>...</svg>"
```

L'appel à [`flushSync`](/reference/react-dom/flushSync) est nécessaire pour que le DOM soit bien mis à jour avant de lire la propriété [`innerHTML`](https://developer.mozilla.org/fr/docs/Web/API/Element/innerHTML).

---

## Dépannage {/*troubleshooting*/}

### Quand un composant suspend, le HTML reflète la version de secours {/*when-a-component-suspends-the-html-always-contains-a-fallback*/}

`renderToString` ne prend pas pleinement en charge Suspense.

<<<<<<< HEAD
Si un composant suspend (il est par exemple défini *via* [`lazy`](/reference/react/lazy) ou charge des données), `renderToString` n'attendra pas l'aboutissement du traitement. `renderToString` cherchera plutôt le périmètre [`<Suspense>`](/reference/react/Suspense) parent le plus proche et affichera le HTML de sa prop `fallback`. Le contenu n'apparaîtra pas jusqu'à ce que le code client soit chargé.
=======
If some component suspends (for example, because it's defined with [`lazy`](/reference/react/lazy) or fetches data), `renderToString` will not wait for its content to resolve. Instead, `renderToString` will find the closest [`<Suspense>`](/reference/react/Suspense) boundary above it and render its `fallback` prop in the HTML. The content will not appear until the client code loads.

To solve this, use one of the [recommended streaming solutions.](#alternatives) For server side rendering, they can stream content in chunks as it resolves on the server so that the user sees the page being progressively filled in before the client code loads. For static site generation, they can wait for all the content to resolve before generating the static HTML.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

Pour résoudre ça, utilisez une de nos [solutions recommandées de *streaming*](#migrating-from-rendertostring-to-a-streaming-method-on-the-server).  Elles peuvent *streamer* le contenu par morceaux au fil de l'aboutissement des traitements côté serveur, afin que l'utilisateur puisse bénéficier d'un chargement progressif de la page avant même que le code client ne soit chargé.
