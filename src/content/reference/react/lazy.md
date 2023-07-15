---
title: lazy
---

<Intro>

`lazy` vous permet de différer le chargement du composant jusqu'à son affichage pour la première fois.

```js
const SomeComponent = lazy(load)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `lazy(load)` {/*lazy*/}

Appelez `lazy` en dehors de vos composants pour déclarer un composant React lazy-loaded:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

[Voir les exemples ci-dessous.](#usage)

#### Paramètres {/*parameters*/}

* `load`: Une fonction qui renvoie une [Promesse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou d'autres *thenable* (un objet de promesse résolue avec la méthode `then`). React n'appelera pas `load` avant la première fois que vous tentez d'afficher le composant renvoyé. Après que React ait appelé `load` pour la première fois, il patientera pour qu'il soit résolu, et ensuite affichera la valeur résolue comme un composant React. La promesse renvoyée et la promesse résolue seront toutes deux mises en cache, et React n'appelera pas `load` plus d'une fois. Si la promesse est rejetée, React `levera` la raison du rejet pour la limite d'erreur la plus proche à gérer.

#### Renvois {/*returns*/}

`lazy` renvoi un composant React que vous pouvez faire le rendu dans votre arborescence. Pendant que le code du composant lazy est en cours de chargement, la tentative de l'afficher sera *suspendue*. Utilisez [`<Suspense>`](/reference/react/Suspense) pour afficher un indicateur de chargement pendant le chargement.

---

### La fonction `load` {/*load*/}

#### Paramètres {/*load-parameters*/}

`load` ne reçoit pas de paramètres.

#### Renvois {/*load-returns*/}

Vous aurez besoin de renvoyer une [Promesse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou d'autres *thenable* (un objet de promesse résolue avec la méthode `then`). il doit finalement se comporter comme un composant React valide, tel une qu'une fonction, [`memo`](/reference/react/memo), ou un composant [`forwardRef`](/reference/react/forwardRef).

---

## Mode d’utilisation {/*usage*/}

### Composants Lazy-loading avec Suspense {/*suspense-for-code-splitting*/}

En général, vous importez vos composants avec la déclaration statique [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) :

```js
import MarkdownPreview from './MarkdownPreview.js';
```

Pour différer le chargement du code de ce composant jusqu'à ce qu'il affiche pour la première fois, remplacez cette importation avec :

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

Ce code s'appuie sur [l'importation dynamique `import()`,](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) ce qui peut nécessiter l'aide de votre bundler ou framework.

Maintenant que le code de votre composant se charge à la demande, vous aurez besoin de spécifier ce qui devra afficher pendant son chargement. Vous pouvez faire cela en enrobant le composant lazy ou l'un de ses parents dans une limitte [`<Suspense>`](/reference/react/Suspense) :

```js {1,4}
<Suspense fallback={<Loading />}>
  <h2>Aperçu</h2>
  <MarkdownPreview />
 </Suspense>
```

Dans cet exemple, le code de `MarkdownPreview` ne sera pas chargé jusqu'à ce que vous essayez de l'afficher. Si `MarkdownPreview` n'est pas encore chargé, `Loading` sera affiché à sa place. Essayez de cocher la case :

<Sandpack>

```js App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Bonjour, **monde**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Afficher l'aperçu
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Aperçu</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// Ajouter un délai fixe pour voir l'état de chargement
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js Loading.js
export default function Loading() {
  return <p><i>Chargement...</i></p>;
}
```

```js MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

Cette démo se charge avec un retard artificiel. La prochaine fois que vous décochez et cochez la case, `Preview` sera mis en cache, il n'y aura donc pas d'état de chargement. Pour voir à nouveau l'état de chargement, Cliquez sur  "Réinitialiser" dans le bac à sable.

[En savoir plus sur la gestion des états de chargement avec Suspense](/reference/react/Suspense).

---

## Résolution des problèmes {/*troubleshooting*/}

### L'état de mon composant `lazy` se réinitialise de façon inattendue {/*my-lazy-components-state-gets-reset-unexpectedly*/}

Ne déclarez pas les composants `lazy` *à l'interieur* d'autres composants

```js {4-5}
import { lazy } from 'react';

function Editor() {
  // 🔴 Mauvais: Cela entraînera la réinitialisation de tous les états lors des réaffichages
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

Au lieu de cela, déclarez-les toujours au début de votre module :

```js {3-4}
import { lazy } from 'react';

// ✅ Parfait: Déclarez les composants lazy en déhors de vos composants
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```
