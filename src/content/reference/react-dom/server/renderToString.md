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

### Migrer de `renderToString` vers une méthode de *streaming* côté serveur {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString` renvoie immédiatement un texte, elle ne prend donc en charge ni le *streaming* ni la suspension pour chargement de données.

Autant que possible nous conseillons d'utiliser plutôt une de ces alternatives plus capables :

* Si vous utilisez Node.js, utilisez [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream).
* Si vous utilisez Deno ou un moteur léger moderne doté des [Web Streams](https://developer.mozilla.org/fr/docs/Web/API/Streams_API), utilisez [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream).

Vous pouvez continuer avec `renderToString` si votre environnement serveur ne prend pas en charge les flux.

---

### Retirer `renderToString` du code côté client {/*removing-rendertostring-from-the-client-code*/}

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

Si un composant suspend (il est par exemple défini *via* [`lazy`](/reference/react/lazy) ou charge des données), `renderToString` n'attendra pas l'aboutissement du traitement. `renderToString` cherchera plutôt le périmètre [`<Suspense>`](/reference/react/Suspense) parent le plus proche et affichera le HTML de sa prop `fallback`. Le contenu n'apparaîtra pas jusqu'à ce que le code client soit chargé.

Pour résoudre ça, utilisez une de nos [solutions recommandées de *streaming*](#migrating-from-rendertostring-to-a-streaming-method-on-the-server).  Elles peuvent *streamer* le contenu par morceaux au fil de l'aboutissement des traitements côté serveur, afin que l'utilisateur puisse bénéficier d'un chargement progressif de la page avant même que le code client ne soit chargé.
