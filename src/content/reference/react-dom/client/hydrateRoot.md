---
title: hydrateRoot
---

<Intro>

`hydrateRoot` vous permet d'afficher des composants React dans un nœud DOM du navigateur dont le HTML a été préalablement généré par [`react-dom/server`.](/reference/react-dom/server)

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

Appelez `hydrateRoot` pour « attacher » React à du HTML existant préalablement généré par React dans un environnement serveur.

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

React s'attachera au HTML existant à l'intérieur de `domNode`, et prendra la main sur la gestion du DOM à l'intérieur.  Une appli entièrement construite avec React n'aura généralement qu'un seul appel à `hydrateRoot`, pour le composant racine.

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `domNode` : un [élément DOM](https://developer.mozilla.org/fr/docs/Web/API/Element) généré comme élément racine côté serveur.

* `reactNode` : un *nœud React* utilisé pour afficher le HTML existant. Ce sera généralement un bout de JSX du genre `<App />`, généré *via* une méthode [`react-dom/server`](/reference/react-dom/server) telle que `renderToPipeableStream(<App />)`.

* `options` **optionnelles** : un objet avec des options pour la racine React.

  * <CanaryBadge title="Cette fonctionnalité n’est disponible que sur le canal de version Canary" /> `onCaughtError` **optionelle** : fonction de rappel appelée lorsque React capture une erreur au sein d'un Périmètre d'Erreur.  Appelée avec l'`error` capturée par le Périmètre d'Erreur, et un objet `errorInfo` contenant la `componentStack`.
  * <CanaryBadge title="Cette fonctionnalité n’est disponible que sur le canal de version Canary" /> `onUncaughtError` **optionnelle** : fonction de rappel appelée lorsqu'une erreur est levée sans être capturée par un Périmètre d'Erreur. Appelée avec l’`error` levée par React et un objet `errorInfo` contenant la `componentStack`.
  * `onRecoverableError` **optionnel** : fonction de rappel appelée lorsque React retombe automatiquement sur ses pieds suite à une erreur.  Appelée avec l’`error` levée par React et un objet `errorInfo` contenant la `componentStack`. Certaines de ces erreurs peuvent exposer leur cause originelle dans `error.cause`.
  * `identifierPrefix` **optionnel** : un préfixe textuel utilisé pour les ID générés par [`useId`](/reference/react/useId). Pratique pour éviter les conflits entre les ID au sein de racines multiples sur une même page.

#### Valeur renvoyée {/*returns*/}

`hydrateRoot` renvoie un objet avec deux méthodes : [`render`](#root-render) et [`unmount`](#root-unmount).

#### Limitations {/*caveats*/}

* `hydrateRoot()` s'attend à ce que le contenu affiché soit identique au contenu généré côté serveur.  Vous devriez considérer tout écart comme un bug et le corriger.
* En mode développement, React vous avertira de tout écart de correspondance durant l'hydratation.  Vous n'avez aucune garantie que les différences d'attributs seront résolues.  C'est important pour des raisons de performances parce que dans la plupart des applis, les écarts sont rares, aussi valider tout le balisage serait d'une lourdeur prohibitive.
* Vous n'aurez probablement qu'un seul appel à `hydrateRoot` dans votre appli. Si vous utilisez un framework, il le fait peut-être pour vous.
* Si votre appli est entièrement côté client, sans HTML déjà généré par le serveur, appeler `hydrateRoot()` n'est pas autorisé. Utilisez plutôt [`createRoot()`](/reference/react-dom/client/createRoot).

---

### `root.render(reactNode)` {/*root-render*/}

Appelez `root.render` pour mettre à jour un composant React au sein d'une racine React hydratée associée à un élément DOM du navigateur.

```js
root.render(<App />);
```

React mettra à jour `<App />` dans le `root` hydraté.

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*root-render-parameters*/}

* `reactNode` : un *nœud React* que vous souhaitez mettre à jour. Ce sera généralement un bout de JSX du genre `<App />`, mais vous pouvez aussi passer un élément React créé avec [`createElement()`](/reference/react/createElement), une chaîne de caractères, un nombre, `null` ou `undefined`.

#### Valeur renvoyée {/*root-render-returns*/}

`root.render` renvoie `undefined`.

#### Limitations {/*root-render-caveats*/}

* Si vous appelez `root.render` avant que la racine n'ait terminé son hydratation, React effacera tout le HTML produit par le serveur et basculera la racine entière vers un rendu côté client.

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


#### Returns {/*root-unmount-returns*/}

`root.unmount` renvoie `undefined`.

#### Limitations {/*root-unmount-caveats*/}

* Appeler `root.unmount` démontera tous les composants dans cette racine et « détachera » React du nœud DOM racine.

* Une fois que vous avez appelé `root.unmount`, vous ne pouvez plus rappeler `root.render` sur cette même racine.  Tenter d'appeler `root.render` sur une racine démontée lèvera une erreur *"Cannot update an unmounted root"* *(« Impossible de mettre à jour une racine démontée », NdT)*.

---

## Utilisation {/*usage*/}

### Hydrater du HTML généré côté serveur {/*hydrating-server-rendered-html*/}

Si le HTML de votre appli est généré par [`react-dom/server`](/reference/react-dom/client/createRoot), vous devez *l'hydrater* côté client.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

Ça hydratera le HTML issu du serveur au sein du <CodeStep step={1}>nœud DOM du navigateur</CodeStep> en utilisant le <CodeStep step={2}>composant React</CodeStep> de votre appli. En général, vous ne le ferez qu'une fois au démarrage. Si vous utilisez un framework, il le fait peut-être pour vous sous le capot.

Pour hydrater votre appli, React « attachera » la logique de vos composants au HTML initial généré par le serveur. L'hydratation transforme cet instantané initial du HTML, issu du serveur, en une appli pleinement interactive s'exécutant dans le navigateur.

<Sandpack>

```html public/index.html
<!--
  Le contenu HTML au sein du <div id="root">...</div>
  est généré à partir de App par react-dom/server.
-->
<div id="root"><h1>Salut tout le monde !</h1><button>Vous avez cliqué <!-- -->0<!-- --> fois</button></div>
```

```js src/index.js active
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
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

Vous ne devriez pas avoir besoin de rappeler `hydrateRoot` ou de l'appeler ailleurs. À partir de ce moment, React prendra la main sur le DOM de votre application. Pour mettre à jour l'interface utilisateur (UI), vos composants [mettront plutôt à jour l'état](/reference/react/useState).

<Pitfall>

L'arbre React que vous passez à `hydrateRoot` doit produire **le même résultat** que celui issu du HTML généré côté serveur.

C'est important pour l'expérience utilisateur. L'utilisateur passera un peu de temps à regarder le HTML produit par le serveur avant que votre code JavaScript n'ait fini de charger. Le rendu côté serveur donne l'impression que l'appli se charge plus vite, en produisant un instantané du HTML.  Afficher soudainement un contenu différent casse cette perception.  C'est pourquoi le rendu côté serveur doit correspondre au résultat du rendu initial côté client.

Les causes les plus fréquentes d'erreurs d'hydratation sont notamment :

* Des espacements supplémentaires (tels que des sauts de lignes) autour du HTML généré par React au sein du nœud racine.
* L'utilisation de tests du style `typeof window !== 'undefined'` dans votre code de rendu.
* Le recours à des API strictement navigateur, comme par exemple [`window.matchMedia`](https://developer.mozilla.org/fr/docs/Web/API/Window/matchMedia), dans votre code de rendu.
* L'affichage de données différentes coté serveur et côté client.

React peut se remettre de certaines erreurs d'hydratation, mais **vous devez les corriger comme si c'étaient des bugs**.  Dans le meilleur des cas, elles ralentiront simplement l'hydratation ; mais elles pourraient aussi entraîner l'association de gestionnaires d'événements aux mauvais éléments.

</Pitfall>

---

### Hydrater un document entier {/*hydrating-an-entire-document*/}

Les applis entièrement construites avec React peuvent produire le document entier *via* leur JSX, y compris la balise [`<html>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/html) :

```js {3,13}
function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>Mon appli</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

Pour hydrater le document entier, passez la variable globale [`document`](https://developer.mozilla.org/fr/docs/Web/API/Window/document) comme premier argument dans votre appel à `hydrateRoot` :

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### Réduire au silence les erreurs d'hydratation incontournables {/*suppressing-unavoidable-hydration-mismatch-errors*/}

Si pour un élément spécifique, un attribut ou le contenu textuel s'avère inévitablement différent entre le serveur et le client (un horodatage, par exemple), vous pouvez choisir de réduire au silence l'avertissement d'écart d'hydratation.

Pour éviter les avertissements d'hydratation sur un élément spécifique, ajoutez-lui la prop `suppressHydrationWarning={true}` :

<Sandpack>

```html public/index.html
<!--
  Le contenu HTML au sein du <div id="root">...</div>
  est généré à partir de App par react-dom/server.
-->
<div id="root"><h1>Date actuelle : <!-- -->01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Date actuelle : {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

Ça ne fonctionne qu'à un niveau de profondeur, et c'est vraiment une échappatoire. N'en abusez pas.  React ne rattrapera le coup que pour les contenus textuels, il risque donc de rester quelques incohérences jusqu'au prochain rendu.

---

### Différencier les contenus côté client et côté serveur {/*handling-different-client-and-server-content*/}

Si vous différenciez volontairement l'affichage entre le côté serveur et le côté client, vous pouvez faire un rendu en deux temps. Les composants qui affichent un contenu différent côté client peuvent lire une [variable d'état](/reference/react/useState) telle que `isClient`, que vous pouvez mettre à `true` dans un [Effet](/reference/react/useEffect) :

<Sandpack>

```html public/index.html
<!--
  Le contenu HTML au sein du <div id="root">...</div>
  est généré à partir de App par react-dom/server.
-->
<div id="root"><h1>Côté serveur</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Côté client' : 'Côté serveur'}
    </h1>
  );
}
```

</Sandpack>

De cette façon, la passe initiale de rendu afficher le même contenu que côté serveur, évitant toute incohérence ; mais une passe supplémentaire surviendra de façon synchrone juste après l'hydratation.

<Pitfall>

Cette approche ralentit l'hydratation parce que vos composants doivent effectuer deux rendus.  Pensez à l'expérience utilisateur sur des connexions lentes. Le code JavaScript risque de n'être chargé que bien après le rendu HTML initial, de sorte qu'afficher une UI différente juste après l'hydratation peut perturber l'utilisateur.

</Pitfall>

---

### Mettre à jour un composant racine hydraté {/*updating-a-hydrated-root-component*/}

Après que la racine a terminé l'hydratation, vous pouvez appeler [`root.render`](#root-render) pour mettre à jour le composant React racine. **Contrairement à [`createRoot`](/reference/react-dom/client/createRoot), vous n'avez pas besoin de faire ça car le contenu initial était déjà présent dans le HTML.**

Si vous appelez `root.render` après l'hydratation, et que la structure de l'arbre de composants correspond à celle déjà en place, React [préservera l'état](/learn/preserving-and-resetting-state). Voyez comme vous pouvez taper quelque chose dans le champ, ce qui montre bien que les mises à jour issues d'appels répétés à `render` ne sont pas destructrices :

<Sandpack>

```html public/index.html
<!--
  Le contenu HTML au sein du <div id="root">...</div>
  est généré à partir de App par react-dom/server.
-->
<div id="root"><h1>Salut tout le monde ! <!-- -->0</h1><input placeholder="Tapez quelque chose ici"/></div>
```

```js src/index.js active
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

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

Il est toutefois rare d'appeler [`root.render`](#root-render) sur une racine hydratée.  En général, vos composants [mettront plutôt à jour l'état](/reference/react/useState).

### Afficher un dialogue lors d'erreurs non capturées {/*show-a-dialog-for-uncaught-errors*/}

<Canary>

`onUncaughtError` n'est disponible que dans la dernière version React Canary.

</Canary>

Par défaut, React affichera dans la console toute erreur non capturée.  Pour implémenter votre propre signalement, vous pouvez fournir l'option `onUncaughtError` :

```js [[1, 7, "onUncaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
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
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {reportUncaughtError} from "./reportError";
import "./styles.css";
import {renderToString} from 'react-dom/server';

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onUncaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportUncaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
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


```js [[1, 7, "onCaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
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
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {reportCaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
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

```js [[1, 7, "onRecoverableError"], [2, 7, "error", 1], [3, 11, "error.cause", 1], [4, 7, "errorInfo"], [5, 12, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onRecoverableError: (error, errorInfo) => {
      console.error(
        'Erreur récupérable',
        error,
        error.cause,
        errorInfo.componentStack
      );
    }
  }
);
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
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {reportRecoverableError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onRecoverableError: (error, errorInfo) => {
    reportRecoverableError({
      error,
      cause: error.cause,
      componentStack: errorInfo.componentStack
    });
  }
});
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

## Dépannage {/*troubleshooting*/}

### J'ai une erreur : *"You passed a second argument to root.render"* {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

Une erreur courante consiste à passer les options de `hydrateRoot` à `root.render(...)` :

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

_(« Avertissement : vous avez passé un second argument à root.render(...) alors qu'elle n'accepte qu'un argument. », NdT)_

Pour corriger ça, passez ces options à `hydrateRoot(...)`, pas à `root.render(...)` :

```js {2,5}
// 🚩 Incorrect : root.render ne prend qu’un argument.
root.render(App, {onUncaughtError});

// ✅ Correct : passez les options à hydrateRoot.
const root = hydrateRoot(container, <App />, {onUncaughtError});
```
