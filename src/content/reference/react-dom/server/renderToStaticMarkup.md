---
title: renderToStaticMarkup
---

<Intro>

`renderToStaticMarkup` produit le HTML non interactif d'un arbre React.

```js
const html = renderToStaticMarkup(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `renderToStaticMarkup(reactNode, options?)` {/*rendertostaticmarkup*/}

Côté serveur, appelez `renderToStaticMarkup` pour produire le HTML de votre appli.

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

Elle renverra le HTML non interactif de vos composants React.

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `reactNode` : un nœud React dont vous voulez obtenir le HTML. Ça pourrait par exemple être un nœud JSX tel que `<Page />`.
* `options` **optionnelles** : un objet avec des options pour le rendu côté serveur.
  * `identifierPrefix` **optionnel** : un préfixe textuel utilisé pour les ID générés par [`useId`](/reference/react/useId). Pratique pour éviter les conflits entre les ID au sein de racines multiples sur une même page.

#### Valeur renvoyée {/*returns*/}

Une chaîne de caractères HTML.

#### Limitations {/*caveats*/}

* Le résultat de `renderToStaticMarkup` ne peut pas être hydraté.

* `renderToStaticMarkup` ne prend que partiellement en charge Suspense. Si un composant suspend, `renderToStaticMarkup` utilisera immédiatement le HTML de son contenu de secours.

* `renderToStaticMarkup` fonctionne dans un navigateur, mais il est déconseillé de l'utiliser dans du code client. Si vous devez obtenir le HTML d'un composant dans un navigateur, [récupérez le HTML de son rendu dans un nœud DOM](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code).

---

## Utilisation {/*usage*/}

### Produire le HTML non interactif d'un arbre React {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

Appelez `renderToStaticMarkup` pour produire le HTML de votre appli, que vous pourrez alors renvoyer dans votre réponse serveur :

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// La syntaxe du gestionnaire de routes dépend de votre framework côté serveur
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

Ça produira le HTML initial, non interactif, de vos composants React.

<Pitfall>

Cette méthode produit **du HTML non interactif qui ne pourra pas être hydraté**.  C'est pratique si vous souhaitez utiliser React comme un simple générateur de pages statiques, ou si vous affichez des contenus totalement statiques tels que des e-mails.

Les applis interactives devraient plutôt utiliser [`renderToString`](/reference/react-dom/server/renderToString) côté serveur, couplé à [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) côté client.

</Pitfall>
