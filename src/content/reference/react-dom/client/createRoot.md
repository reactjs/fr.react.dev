---
title: createRoot
---

<Intro>

`createRoot` vous permet de créer une racine de rendu pour afficher vos composants React dans un nœud DOM du navigateur.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

Appelez `createRoot` pour créer une racine de rendu React afin d'afficher du contenu dans un élément DOM du navigateur.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React créera une racine de rendu associée au `domNode`, puis prendra la main sur la gestion de son DOM.  Une fois la racine créée, vous devrez appeler [`root.render`](#root-render) pour afficher un composant React à l'intérieur :

```js
root.render(<App />);
```

Une appli entièrement construite en React n'aura généralement qu'un appel à `createRoot` pour son composant racine.  Une page qui « saupoudre » du React dans certaines de ses parties peut avoir autant de racines distinctes que nécessaire.

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `domNode` : un [élément DOM](https://developer.mozilla.org/fr/docs/Web/API/Element). React créera une racine de rendu pour cet élément DOM et vous permettra d'appeler des méthodes sur cette racine, telles que `render` pour afficher le contenu produit par React.

* `options` **optionnelles** : un objet avec des options pour la racine React.
  * <CanaryBadge title="Cette fonctionnalité n’est disponible que sur le canal de version Canary" /> `onCaughtError` **optionelle** : fonction de rappel appelée lorsque React capture une erreur au sein d'un Périmètre d'Erreur.  Appelée avec l'`error` capturée par le Périmètre d'Erreur, et un objet `errorInfo` contenant la `componentStack`.
  * <CanaryBadge title="Cette fonctionnalité n’est disponible que sur le canal de version Canary" /> `onUncaughtError` **optionnelle** : fonction de rappel appelée lorsqu'une erreur est levée sans être capturée par un Périmètre d'Erreur. Appelée avec l’`error` levée par React et un objet `errorInfo` contenant la `componentStack`.
  * `onRecoverableError` **optionnelle** : fonction de rappel appelée lorsque React retombe automatiquement sur ses pieds suite à une erreur.  Appelée avec l’`error` levée par React et un objet `errorInfo` contenant la `componentStack`. Certaines de ces erreurs peuvent exposer leur cause originelle dans `error.cause`.
  * `identifierPrefix` **optionnel** : un préfixe textuel utilisé pour les ID générés par [`useId`](/reference/react/useId). Pratique pour éviter les conflits entre les ID au sein de racines multiples sur une même page.

#### Valeur renvoyée {/*returns*/}

`createRoot` renvoie un objet avec deux méthodes : [`render`](#root-render) et [`unmount`](#root-unmount).

#### Limitations {/*caveats*/}

* Si votre appli bénéficie d'un premier rendu côté serveur, vous ne pourrez pas utiliser `createRoot()` : utilisez plutôt [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot).
* Vous n'aurez probablement qu'un seul appel à `createRoot` dans votre appli. Si vous utilisez un framework, il le fait peut-être pour vous.
* Lorsque vous souhaitez afficher un bout de JSX dans une autre partie du DOM, une partie qui n'est pas un enfant de votre composant (par exemple pour une boîte de dialogue modale ou une infobulle), utilisez [`createPortal`](/reference/react-dom/createPortal) plutôt que `createRoot`.

---

### `root.render(reactNode)` {/*root-render*/}

Appelez `root.render` pour afficher un bout de [JSX](/learn/writing-markup-with-jsx) (un « nœud React ») dans le nœud DOM du navigateur associé à la racine React.

```js
root.render(<App />);
```

React affichera `<App />` dans le `root`, et prendra la main sur la gestion du DOM à l'intérieur.

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*root-render-parameters*/}

* `reactNode` : un *nœud React* que vous souhaitez afficher. Ce sera généralement un bout de JSX du genre `<App />`, mais vous pouvez aussi passer un élément React créé avec [`createElement()`](/reference/react/createElement), une chaîne de caractères, un nombre, `null` ou `undefined`.

#### Valeur renvoyée {/*root-render-returns*/}

`root.render` renvoie `undefined`.

#### Limitations {/*root-render-caveats*/}

* La première fois que vous appellez `root.render`, React videra tout le HTML existant au sein de la racine avant de faire le rendu du composant React à l'intérieur

* Si le nœud DOM de votre racine contient du HTML généré par React côté serveur ou lors du *build*, utilisez plutôt [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot), qui se contentera d'attacher les gestionnaires d'événements au HTML existant.

* Si vous appelez `render` sur la même racine plusieurs fois, React mettra à jour le DOM si nécessaire pour refléter le dernier JSX que vous lui avez passé.  React décidera quelles parties du DOM réutiliser et lesquelles nécessitent une création à froid en [« examinant la correspondance »](/learn/preserving-and-resetting-state) entre l'arbre React et celui du précédent rendu.  Appeler `render` à nouveau sur la même racine est similaire à un appel de [fonction `set`](/reference/react/useState#setstate) sur le composant racine : React évite les mises à jour DOM superflues.

---

### `root.unmount()` {/*root-unmount*/}

Appelez `root.unmount` pour détruire l'arborescence de rendu au sein d'une racine React.

```js
root.unmount();
```

Une appli entièrement construite avec React n'appellera généralement pas `root.unmount`.

C'est principalement utile si le nœud DOM de votre racine React (ou un de ses ancêtres) est susceptible d'être retiré du DOM par du code tiers.  Imaginez par exemple une gestion d'onglet basée sur jQuery qui retire les onglets inactifs du DOM. Si un onglet est retiré, tout ce qu'il contient (y compris d'éventuelles racines React) sera également retiré du DOM. Dans un tel cas, vous devez dire à React de « cesser » de gérer le contenu de la racine retirée en appelant `root.unmount`.  Si vous ne le faisiez pas, les composants au sein de la racine retirée ne pourraient pas être nettoyés et libérer leurs ressources globales, telles que des abonnements.

Un appel à `root.unmount` démontera tous les composants dans cette racine et « détachera » React du nœud DOM racine, y compris pour la gestion événementielle et les états de l'arbre.

#### Paramètres {/*root-unmount-parameters*/}

`root.unmount` ne prend aucun paramètre.

#### Valeur renvoyée {/*root-unmount-returns*/}

`root.unmount` renvoie `undefined`.

#### Limitations {/*root-unmount-caveats*/}

* Appeler `root.unmount` démontera tous les composants dans cette racine et « détachera » React du nœud DOM racine.

* Une fois que vous avez appelé `root.unmount`, vous ne pouvez plus rappeler `root.render` sur cette même racine.  Tenter d'appeler `root.render` sur une racine démontée lèvera une erreur *"Cannot update an unmounted root"* *(« Impossible de mettre à jour une racine démontée », NdT)*. En revanche, vous pouvez créer une nouvelle racine pour le même nœud DOM une fois la racine précédente pour ce nœud démontée.

---

## Utilisation {/*usage*/}

### Afficher une appli entièrement construite avec React {/*rendering-an-app-fully-built-with-react*/}

Si votre appli est entièrement construite avec React, créez une racine unique pour l'appli complète.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

En général, vous n'aurez besoin de ce code qu'une fois, au démarrage. Il va :

1. Trouver le <CodeStep step={1}>nœud DOM du navigateur</CodeStep> défini dans votre HTML.
2. Afficher le <CodeStep step={2}>composant React</CodeStep> de votre appli à l'intérieur.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>Mon appli</title></head>
  <body>
    <!-- Voici le nœud DOM -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Salut tout le monde !</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Vous avez cliqué {count} fois
    </button>
  );
}
```

</Sandpack>

**Si votre appli est entièrement construite avec React, vous ne devriez pas avoir besoin de créer davantage de racines, ni de rappeler [`root.render`](#root-render).**

À partir de là, React gèrera le DOM de votre appli entière. Pour ajouter d'autres composants, [imbriquez-les dans le composant `App`](/learn/importing-and-exporting-components). Si vous avez besoin de mettre à jour l'interface utilisateur (UI), chaque composant peut le faire en [utilisant l'état](/reference/react/useState). Si vous souhaitez afficher du contenu complémentaire (comme une boîte de dialogue modale ou une infobulle) hors du nœud DOM, [affichez-le dans un portail](/reference/react-dom/createPortal).

<Note>

Lorsque votre HTML est vide, l'utilisateur voit une page vierge jusqu'à ce que le code JavaScript soit chargé et exécuté :

```html
<div id="root"></div>
```

Ça peut sembler très lent ! Pour remédier à ça, vous pouvez générer le HTML initial de vos composants [côté serveur ou lors du *build*](/reference/react-dom/server). Ainsi vos visiteurs pourront lire le texte, regarder les images, et cliquer sur les liens en attendant que votre code JavaScript soit chargé. Nous vous conseillons [d'utiliser un framework](/learn/start-a-new-react-project#production-grade-react-frameworks) qui propose ce genre d'optimisations d'entrée de jeu.  En fonction de son approche, il pourra s'agir de rendu côté serveur *(SSR pour server-side rendering, NdT)* ou de génération de site statique *(SSG pour static-site generation, NdT)*.

</Note>

<Pitfall>

**Les applis utilisant le rendu côté serveur ou la génération de site statique doivent appeler [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) plutôt que `createRoot`.** React *hydratera* (réutilisera) alors les nœuds DOM de votre HTML plutôt que de les détruire pour les recréer ensuite.

</Pitfall>

---

### Afficher une page partiellement construite avec React {/*rendering-a-page-partially-built-with-react*/}

Si votre page [n'est pas entièrement construite avec React](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), vous pouvez appeler `createRoot` plusieurs fois, pour créer une racine de rendu pour chaque bloc d'UI géré par React.  Vous pouvez alors afficher les contenus de votre choix dans chaque racine en appelant[`root.render`](#root-render).

Dans l'exemple ci-dessous, deux composants React distincts sont affichés dans deux nœuds DOM définis dans le fichier `index.html` :

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>Mon appli</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>Ce paragraphe n'est pas affiché par React (ouvrez index.html pour vous en assurer).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode);
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode);
commentRoot.render(<Comments />);
```

```js src/Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Accueil</NavLink>
      <NavLink href="/about">À propos</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Commentaires</h2>
      <Comment text="Salut !" author="Marie" />
      <Comment text="Comment ça va ?" author="Maxime" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

Vous pourriez aussi créer un nouveau nœud DOM avec [`document.createElement()`](https://developer.mozilla.org/fr/docs/Web/API/Document/createElement) et l'ajouter manuellement au document.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode);
root.render(<Comment />);
document.body.appendChild(domNode); // Vous pouvez l’ajouter où bon vous semble
```

Pour retirer l'arbre React d'un nœud DOM et en nettoyer les ressources, appelez [`root.unmount`](#root-unmount).

```js
root.unmount();
```

C'est surtout utile pour les composants React figurant au sein d'une appli écrite avec un autre framework.

---

### Mettre à jour un composant racine {/*updating-a-root-component*/}

Vous pouvez appeler `render` plus d'une fois sur la même racine. Tant que la structure de l'arbre de composants correspond à celle déjà en place, React [préservera l'état](/learn/preserving-and-resetting-state). Voyez comme vous pouvez taper quelque chose dans le champ, ce qui montre bien que les mises à jour issues d'appels répétés à `render` ne sont pas destructrices :

<Sandpack>

```js src/index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>Salut tout le monde ! {counter}</h1>
      <input placeholder="Tapez quelque chose ici" />
    </>
  );
}
```

</Sandpack>

Il est toutefois rare d'appeler `render` plusieurs fois.  En général, vos composants [mettront plutôt à jour l'état](/reference/react/useState).

### Afficher un dialogue lors d'erreurs non capturées {/*show-a-dialog-for-uncaught-errors*/}

<Canary>

`onUncaughtError` n'est disponible que dans la dernière version React Canary.

</Canary>

Par défaut, React affichera dans la console toute erreur non capturée.  Pour implémenter votre propre signalement, vous pouvez fournir l'option `onUncaughtError` :

```js [[1, 6, "onUncaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onUncaughtError: (error, errorInfo) => {
      console.error(
        'Erreur non capturée',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

L'option <CodeStep step={1}>onUncaughtError</CodeStep> est une fonction avec deux arguments :

1. L'<CodeStep step={2}>error</CodeStep> qui a été levée.
2. Un objet <CodeStep step={3}>errorInfo</CodeStep> qui contient la <CodeStep step={4}>componentStack</CodeStep> de l'erreur.

Vous pouvez utiliser l'option `onUncaughtError` pour afficher des dialogues d'erreur :

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>Mon appli</title>
</head>
<body>
<!--
  Dialogue d'erreur en HTML pur puisqu'une erreur
  dans l'appli React pourrait la faire crasher.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">Erreur survenue ici :</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Pile d’appels :</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Causée par :</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Fermer
  </button>
  <h3 id="error-not-dismissible">Cette erreur ne peut être ignorée.</h3>
</div>
<!-- Et le nœud DOM -->
<div id="root"></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");

  // Définir le titre
  errorTitle.innerText = title;

  // Afficher le message et le corps de l’erreur
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Display component stack
  errorComponentStack.innerText = componentStack;

  // Afficher la pile d’appels
  // Puisque nous avons déjà affiché le message, on le retire ainsi que la première
  // ligne `Error:`.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];

  // Affiche la cause, si disponible
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Affiche le bouton Fermer, si ignorable
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }

  // Affiche le dialogue
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Erreur capturée", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Erreur non capturée", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Erreur récupérable", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportUncaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportUncaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [throwError, setThrowError] = useState(false);
  
  if (throwError) {
    foo.bar = 'baz';
  }
  
  return (
    <div>
      <span>Cette erreur affiche le dialogue d’erreur :</span>
      <button onClick={() => setThrowError(true)}>
        Lever une erreur
      </button>
    </div>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```

</Sandpack>

### Afficher les erreurs de Périmètres d'Erreurs {/*displaying-error-boundary-errors*/}

<Canary>

`onCaughtError` n'est disponible que dans la dernière version React Canary.

</Canary>

Par défaut, React affichera dans la console (au moyen de `console.error`) toute erreur capturée par un Périmètre d'Erreurs.  Pour remplacer ce comportement, vous pouvez fournir l'option `onCaughtError` afin de traiter vous-mêmes les erreurs capturées par un [Périmètre d'Erreurs](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) :

```js [[1, 6, "onCaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onCaughtError: (error, errorInfo) => {
      console.error(
        'Erreur capturée',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

L'option <CodeStep step={1}>onCaughtError</CodeStep> est une fonction avec deux arguments :

1. L'<CodeStep step={2}>error</CodeStep> qui a été capturée par le Périmètre.
2. Un objet <CodeStep step={3}>errorInfo</CodeStep> qui contient la <CodeStep step={4}>componentStack</CodeStep> de l'erreur.

Vous pouvez utiliser l'option `onCaughtError` pour afficher des dialogues d'erreur ou retirer les erreurs connues de la journalisation :

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>Mon appli</title>
</head>
<body>
<!--
  Dialogue d'erreur en HTML pur puisqu'une erreur
  dans l'appli React pourrait la faire crasher.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">Erreur survenue ici :</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Pile d’appels :</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Causée par :</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Fermer
  </button>
  <h3 id="error-not-dismissible">Cette erreur ne peut être ignorée.</h3>
</div>
<!-- Et le nœud DOM -->
<div id="root"></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");

  // Définir le titre
  errorTitle.innerText = title;

  // Afficher le message et le corps de l’erreur
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Display component stack
  errorComponentStack.innerText = componentStack;

  // Afficher la pile d’appels
  // Puisque nous avons déjà affiché le message, on le retire ainsi que la première
  // ligne `Error:`.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];

  // Affiche la cause, si disponible
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Affiche le bouton Fermer, si ignorable
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }

  // Affiche le dialogue
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Erreur capturée", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Erreur non capturée", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Erreur récupérable", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportCaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportCaughtError({
        error, 
        componentStack: errorInfo.componentStack,
      });
    }
  }
});
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

export default function App() {
  const [error, setError] = useState(null);
  
  function handleUnknown() {
    setError("unknown");
  }

  function handleKnown() {
    setError("known");
  }
  
  return (
    <>
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          setError(null);
        }}
      >
        {error != null && <Throw error={error} />}
        <span>Cette erreur n’affichera aucun dialogue :</span>
        <button onClick={handleKnown}>
          Lever une erreur connue
        </button>
        <span>Cette erreur affichera le dialogue d’erreur :</span>
        <button onClick={handleUnknown}>
          Lever une erreur inconnue
        </button>
      </ErrorBoundary>
      
    </>
  );
}

function fallbackRender({ resetErrorBoundary }) {
  return (
    <div role="alert">
      <h3>Périmètre d’Erreurs</h3>
      <p>Ça sent le pâté…</p>
      <button onClick={resetErrorBoundary}>Réinitialiser</button>
    </div>
  );
}

function Throw({error}) {
  if (error === "known") {
    throw new Error('Known error')
  } else {
    foo.bar = 'baz';
  }
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

### Afficher un dialogue lors d'erreurs récupérables {/*displaying-a-dialog-for-recoverable-errors*/}

React est susceptible de refaire le rendu d'un composant afin de tenter de retomber sur ses pieds lorsqu'un rendu lève une erreur. S'il réussit, React affichera en console une erreur récupérable, pour notifier le développeur.  Pour remplacer ce comportement, vous pouvez fournir l'option `onRecoverableError` :

```js [[1, 6, "onRecoverableError"], [2, 6, "error", 1], [3, 10, "error.cause"], [4, 6, "errorInfo"], [5, 11, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onRecoverableError: (error, errorInfo) => {
      console.error(
        'Erreur récupérable',
        error,
        error.cause,
        errorInfo.componentStack,
      );
    }
  }
);
root.render(<App />);
```

L'option <CodeStep step={1}>onRecoverableError</CodeStep> est une fonction avec deux arguments :

1. L'<CodeStep step={2}>error</CodeStep> qui a été capturée par le Périmètre.
2. Un objet <CodeStep step={3}>errorInfo</CodeStep> qui contient la <CodeStep step={4}>componentStack</CodeStep> de l'erreur.

Vous pouvez utiliser l'option `onRecoverableError` pour afficher des dialogues d'erreur ou retirer les erreurs connues de la journalisation :

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>Mon appli</title>
</head>
<body>
<!--
  Dialogue d'erreur en HTML pur puisqu'une erreur
  dans l'appli React pourrait la faire crasher.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">Erreur survenue ici :</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Pile d’appels :</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Causée par :</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Fermer
  </button>
  <h3 id="error-not-dismissible">Cette erreur ne peut être ignorée.</h3>
</div>
<!-- Et le nœud DOM -->
<div id="root"></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");

  // Définir le titre
  errorTitle.innerText = title;

  // Afficher le message et le corps de l’erreur
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Display component stack
  errorComponentStack.innerText = componentStack;

  // Afficher la pile d’appels
  // Puisque nous avons déjà affiché le message, on le retire ainsi que la première
  // ligne `Error:`.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];

  // Affiche la cause, si disponible
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Affiche le bouton Fermer, si ignorable
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }

  // Affiche le dialogue
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Erreur capturée", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Erreur non capturée", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Erreur récupérable", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportRecoverableError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onRecoverableError: (error, errorInfo) => {
    reportRecoverableError({
      error,
      cause: error.cause,
      componentStack: errorInfo.componentStack,
    });
  }
});
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

// 🚩 Bug : ne faites jamais ça.  Ça va forcer une erreur.
let errorThrown = false;
export default function App() {
  return (
    <>
      <ErrorBoundary
        fallbackRender={fallbackRender}
      >
        {!errorThrown && <Throw />}
        <p>Ce composant a levé une erreur, mais un second rendu a rattrapé le coup.</p>
        <p>Puisqu’il s’est rétabli, on ne voit pas de Périmètre d’Erreurs ; mais <code>onRecoverableError</code> permet d’afficher un dialogue pour nous le signaler.</p>
      </ErrorBoundary>
    </>
  );
}

function fallbackRender() {
  return (
    <div role="alert">
      <h3>Périmètre d’Erreurs</h3>
      <p>Ça sent le pâté…</p>
    </div>
  );
}

function Throw({error}) {
  // Simule le changement d’une valeur externe pendant un rendu concurrent.
  errorThrown = true;
  foo.bar = 'baz';
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>


---

## Dépannage {/*troubleshooting*/}

### J'ai créé une racine mais rien ne s'affiche {/*ive-created-a-root-but-nothing-is-displayed*/}

Assurez-vous de ne pas oublier *d'afficher* effectivement votre appli (avec `render`) au sein de la racine :

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Tant que vous ne le faites pas, rien ne sera affiché.

---


### J'ai une erreur : *"You passed a second argument to root.render"* {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

Une erreur courante consiste à passer les options de `createRoot` à `root.render(...)` :

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

_(« Avertissement : vous avez passé un second argument à root.render(...) alors qu'elle n'accepte qu'un argument. », NdT)_

Pour corriger ça, passez ces options à `createRoot(...)`, pas à `root.render(...)` :

```js {2,5}
// 🚩 Incorrect : root.render ne prend qu’un argument.
root.render(App, {onUncaughtError});

// ✅ Correct : passez les options à createRoot.
const root = createRoot(container, {onUncaughtError}); 
root.render(<App />);
```

---

### J'ai une erreur : *"Target container is not a DOM element"* {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

*(« Le conteneur cible n'est pas un élément DOM », NdT)*

Cette erreur signifique que ce que vous avez passé à `createRoot` n'est pas un élément DOM.

Si vous ne comprenez pas bien ce qui se passe, essayer d'afficher des informations dans la console :

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

Si par exemple `domNode` est `null`, ça signifie que [`getElementById`](https://developer.mozilla.org/fr/docs/Web/API/Document/getElementById) a renvoyé `null`. Ça arrive lorsqu'aucun nœud du document n'a l'ID spécifié au moment de l'appel. Il peut y avoir plusieurs raisons à ça :

1. L'ID que vous utilisez n'est pas tout à fait celui utilisé dans le HTML.  Vérifiez les fautes de frappe !
2. La balise `<script>` de votre *bundle*, si elle est synchrone (cas par défaut), ne peut pas « voir » les nœuds DOM qui apparaissent *après* elle dans le HTML.

Il est aussi fréquent d'obtenir cette erreur en écrivant par mégarde `createRoot(<App />)` plutôt que `createRoot(domNode)`.

---

### J'ai une erreur : *"Functions are not valid as a React child."* {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

*(« Les fonctions ne constituent pas des enfants React valides », NdT)*

Cette erreur signifie que ce que vous avez passé à `root.render` n'est pas un composant React.

Ça peut arriver si vous appelez `root.render` en lui passant `Component` plutôt que `<Component />` :

```js {2,5}
// 🚩 Erroné : App est une function, pas un composant.
root.render(App);

// ✅ Correct : <App /> est un composant.
root.render(<App />);
```

Ou si vous passez une fonction à `root.render`, plutôt que le résultat de l'appel à cette fonction :

```js {2,5}
// 🚩 Erroné : createApp est une fonction, pas un composant.
root.render(createApp);

// ✅ Correct : appeler createApp renvoie un composant.
root.render(createApp());
```

---

### Mon HTML produit côté serveur est recréé de zéro {/*my-server-rendered-html-gets-re-created-from-scratch*/}

Si votre appli utilise le rendu côté serveur et inclut le HTML initial généré par React, vous remarquerez peut-être qu'en créant une racine pour appeler `root.render`, ça supprime tout ce HTML et re-crée les nœuds DOM de zéro.  Ça peut être plus lent, mais surtout risque de réinitialiser le focus et la position de défilement tout en perdant les saisies de l'utilisateur.

Les applis qui font un rendu côté serveur doivent utiliser [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) plutôt que `createRoot` :

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

Remarquez que l'API est différente. En particulier, il n'y aura généralement pas d'appel ultérieur à `root.render`.
