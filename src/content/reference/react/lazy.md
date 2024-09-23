---
title: lazy
---

<Intro>

`lazy` vous permet de différer le chargement du code d'un composant jusqu'à son premier affichage effectif.

```js
const SomeComponent = lazy(load)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `lazy(load)` {/*lazy*/}

Appelez `lazy` en-dehors de vos composants pour déclarer un composant React chargé à la demande :

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `load` : une fonction qui renvoie une [promesse](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou un *thenable* (un objet doté d'une méthode `then` compatible). React n'appellera pas `load` tant que vous ne tenterez pas d'afficher le composant renvoyé. Après que React a appelé `load` pour la première fois, il patientera pour que la promesse s'établisse, puis affichera la propriété `,.default` de la valeur accomplie comme composant React. Tant la promesse renvoyée que sa valeur accomplie seront mises en cache, et React ne rappellera pas `load`. Si la promesse rejette, React lèvera (`throw`) la raison du rejet (généralement une `Error`) pour que le périmètre d'erreur le plus proche la gère.

#### Valeur renvoyée {/*returns*/}

`lazy` renvoie un composant React que vous pouvez afficher dans votre arborescence. Pendant que le code du composant chargé à la demande se charge, toute tentative de l'afficher *suspend*. Utilisez [`<Suspense>`](/reference/react/Suspense) pour afficher un indicateur de chargement pendant ce temps-là.

---

### La fonction `load` {/*load*/}

#### Paramètres {/*load-parameters*/}

`load` ne prend aucun paramètre.

#### Valeur renvoyée {/*load-returns*/}

Vous aurez besoin de renvoyer une [promesse](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou un *thenable* (un objet doté d'une méthode `then` compatible). La valeur accomplie doit finalement posséder une propriété `.default` qui se comporte comme un composant React valide, tel une qu'une fonction, un composant [`memo`](/reference/react/memo), ou un composant [`forwardRef`](/reference/react/forwardRef).

---

## Utilisation {/*usage*/}

### Charger des composants à la demande avec Suspense {/*suspense-for-code-splitting*/}

En général, vous importez vos composants avec la déclaration statique [`import`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) :

```js
import MarkdownPreview from './MarkdownPreview.js';
```

Pour différer le chargement du code de ce composant jusqu'à ce qu'il affiche pour la première fois, remplacez cette importation avec :

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

Ce code s'appuie sur [l'importation dynamique `import()`,](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import), ce qui peut nécessiter une prise en charge de votre *bundler* ou framework. Pour utiliser cette approche, le composant chargé à la demande que vous importez doit être exporté sous le nom `default` (ce qui est notamment le cas de l'export par défaut).

Maintenant que le code de votre composant se charge à la demande, vous aurez besoin de spécifier ce qui devrait être affiché pendant son chargement. Vous pouvez le faire en enrobant le composant chargé à la demande ou l'un de ses parents dans un périmètre [`<Suspense>`](/reference/react/Suspense) :

```js {1,4}
<Suspense fallback={<Loading />}>
  <h2>Aperçu</h2>
  <MarkdownPreview />
</Suspense>
```

Dans cet exemple, le code de `MarkdownPreview` ne sera pas chargé jusqu'à ce que vous essayiez de l'afficher. Si `MarkdownPreview` n'est pas encore chargé, `Loading` sera affiché à sa place. Essayez de cocher la case :

<Sandpack>

```js src/App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Salut **tout le monde** !');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Afficher l’aperçu
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

// Ajouter un délai fixe pour voir l’état de chargement
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js src/Loading.js
export default function Loading() {
  return <p><i>Chargement...</i></p>;
}
```

```js src/MarkdownPreview.js
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

Cette démo se charge avec un retard artificiel. La prochaine fois que vous décochez et cochez la case, `Preview` sera mis en cache, il n'y aura donc pas d'état de chargement. Pour voir à nouveau l'état de chargement, cliquez sur  « Réinitialiser » dans le bac à sable.

[En savoir plus sur la gestion des états de chargement avec Suspense](/reference/react/Suspense).

---

## Dépannage {/*troubleshooting*/}

### L'état de mon composant `lazy` est réinitialisé de façon inattendue {/*my-lazy-components-state-gets-reset-unexpectedly*/}

Ne déclarez pas les composants `lazy` *à l'intérieur* d'autres composants :

```js {4-5}
import { lazy } from 'react';

function Editor() {
  // 🔴 Erroné : ça entraînera la réinitialisation de tous les états lors des réaffichages
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

Déclarez-les toujours plutôt au début de votre module :

```js {3-4}
import { lazy } from 'react';

// ✅ Correct : déclarez les composants lazy en-dehors de vos composants
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```
