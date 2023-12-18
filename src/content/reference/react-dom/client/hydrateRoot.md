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

  * `onRecoverableError` **optionnel** : fonction de rappel appelée lorsque React retombe automatiquement sur ses pieds suite à une erreur.
  * `identifierPrefix` **optionnel** : un préfixe textuel utilisé pour les ID générés par [`useId`](/reference/react/useId). Pratique pour éviter les conflits entre les ID au sein de racines multiples sur une même page. Doit être le même préfixe que celui utilisé côté serveur.

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
