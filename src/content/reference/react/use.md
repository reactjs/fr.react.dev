---
title: use
canary: true
---

<Canary>

L'API `use` n'est actuellement disponible que sur les canaux de livraison Canary et Expérimental de React. Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`use` est une API React qui vous permet de lire la valeur d'une ressource telle qu'une [promesse](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou un [contexte](/learn/passing-data-deeply-with-context).

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `use(resource)` {/*use*/}

Appelez `use` dans votre composant pour lire la valeur d'une ressource telle qu'une [promesse](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou un [contexte](/learn/passing-data-deeply-with-context).

```jsx
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
```

Contrairement aux Hooks React, `use` peut être appelée au sein de boucles ou d'instructions conditionnelles telles que `if`. En revanche, comme pour les Hooks React, toute fonction appelant `use` doit être un composant ou un Hook.

Lorsqu'elle est appelée avec une promesse, l'API `use` s'intègre avec [`Suspense`](/reference/react/Suspense) et les [périmètres d'erreurs](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Le composant appelant *suspend* tant que la promesse passée à `use` est en attente. Si le composant qui appelle `use` est enrobé dans un périmètre Suspense, l'UI de secours est affichée. Une fois la promesse accomplie, cette UI est remplacée par le rendu des composants en utilisant les données renvoyées par le Hook `use`. Si la promesse renvoyée par `use` est rejetée, l'UI de secours du périmètre d'erreur le plus proche est affichée.

[Voir d'autres exemples plus bas](#usage).

#### Paramètres {/*parameters*/}

* `resource` : c'est la source de données depuis laquelle vous voulez lire une valeur. Une ressource peut être une [promesse](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou un [contexte](/learn/passing-data-deeply-with-context).

#### Valeur renvoyée {/*returns*/}

L'API `use` renvoie la valeur lue depuis la ressource, telle que la valeur accomplie d'une [promesse](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou la valeur actuelle d'un [contexte](/learn/passing-data-deeply-with-context).

#### Limitations {/*caveats*/}

* L'API `use` doit être appelée à l'intérieur d'un composant ou d'un Hook.
* Lorsque vous récupérez des données dans un [Composant Serveur](/reference/rsc/use-server), privilégiez `async` et `await` plutôt que `use`. `async` et `await` reprennent le rendu à partir du point où `await` avait été invoqué, alors que `use` refait un rendu du composant une fois la donnée obtenue.
* Privilégiez la création de promesses dans les [Composants Serveur](/reference/rsc/use-server) et leur passage aux [Composants Client](/reference/rsc/use-client), plutôt que de créer des promesses dans les Composants Client. Les promesses créées dans les Composants Client sont recréées à chaque rendu. Les promesses transmises d'un Composant Serveur à un Component Client ne changent pas d'un rendu à l'autre. [Consultez cet exemple](#streaming-data-from-server-to-client).

---

## Utilisation {/*usage*/}

### Lire un contexte avec `use` {/*reading-context-with-use*/}

Quand un [contexte](/learn/passing-data-deeply-with-context) est passé à `use`, ce dernier fonctionne de la même façon que [`useContext`](/reference/react/useContext). Alors que `useContext` doit être appelé à la racine de votre composant, `use` peut être appelé à l'intérieur de conditions telles que `if` ou de boucles telles que `for`. `use` est préférable à `useContext` parce qu'il est plus flexible.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ...
```

`use` renvoie la <CodeStep step={2}>valeur de contexte</CodeStep> pour le <CodeStep step={1}>contexte</CodeStep> que vous avez transmis. Pour déterminer la valeur du contexte, React remonte l'arbre des composants pour trouver le **fournisseur de contexte parent le plus proche** pour ce contexte.

Pour transmettre un contexte à un `Button`, enrobez ce bouton ou l'un de ses parents dans le fournisseur de contexte adéquat.

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... rendu des boutons ici ...
}
```

Peu importe le nombre de couches de composants qu'il y a entre le fournisseur et le `Button`. Quand un `Button` appelle `use(ThemeContext)`, il recevra la valeur `"dark"`, *quelle que soit* sa position au sein du `Form`.

Contrairement à [`useContext`](/reference/react/useContext), <CodeStep step={2}>`use`</CodeStep> peut être appelé dans les blocs conditionnels et les boucles, comme par exemple un <CodeStep step={1}>`if`</CodeStep>.

```js [[1, 2, "if"], [2, 3, "use"]]
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

<CodeStep step={2}>`use`</CodeStep> est appelé à l'intérieur d'une instruction <CodeStep step={1}>`if`</CodeStep>, ce qui vous permet de ne lire des valeurs de contextes que sous certaines conditions.

<Pitfall>

Tout comme `useContext`, `use(context)` cherche toujours le fournisseur de contexte le plus proche **au-dessus** du composant qui l'appelle. Il remonte et **ignore** les fournisseurs de contexte situés dans le composant depuis lequel vous appelez `use(context)`.

</Pitfall>

<Sandpack>

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Bienvenue">
      <Button show={true}>Inscription</Button>
      <Button show={false}>Connexion</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```

</Sandpack>

### Diffuser en continu des données du serveur au client {/*streaming-data-from-server-to-client*/}

Les données peuvent être transmises en continu du serveur au client en passant une promesse comme prop depuis un <CodeStep step={1}>Composant Serveur</CodeStep> vers un <CodeStep step={2}>Composant Client</CodeStep>.

```js [[1, 4, "App"], [2, 2, "Message"], [3, 7, "Suspense"], [4, 8, "messagePromise", 30], [4, 5, "messagePromise"]]
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>En attente d’un message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

Le <CodeStep step={2}>Composant Client</CodeStep> prend ensuite <CodeStep step={4}>la promesse qu'il a reçue comme prop</CodeStep> et la transmet à l'API <CodeStep step={5}>`use`</CodeStep>. Ça permet au <CodeStep step={2}>Composant Client</CodeStep> de lire la valeur de <CodeStep step={4}>la promesse</CodeStep> initialement créée par le Composant Serveur.

```js [[2, 6, "Message"], [4, 6, "messagePromise"], [4, 7, "messagePromise"], [5, 7, "use"]]
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Voici le message : {messageContent}</p>;
}
```

Puisque <CodeStep step={2}>`Message`</CodeStep> est enrobé dans un <CodeStep step={3}>[`Suspense`](/reference/react/Suspense)</CodeStep>, l'UI de secours sera affichée en attendant l'accomplissement de la promesse. Lorsqu'elle s'accomplit, la valeur sera lue par l'API <CodeStep step={5}>`use`</CodeStep> et le composant <CodeStep step={2}>`Message`</CodeStep> remplacera l'UI de secours de Suspense.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Voici le message : {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛ Téléchargement du message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 1000, "⚛️"));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Télécharger le message</button>;
  }
}
```

```js src/index.js hidden
// TODO : remplacer l’import d’une version Canary
// de React par une version stable, dès qu’elle
// intégrera l’API `use`
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO : mettre à jour cet exemple pour utiliser
// le Composant Serveur Codesandbox de l’environnement
// de démo lorsqu’il sera créé.
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```
</Sandpack>

<Note>

Lorsque vous transmettez une promesse d'un Composant Serveur à un Composant Client, sa valeur accomplie doit être sérialisable pour pouvoir être communiquée entre le serveur et le client. Les types de données comme les fonctions ne sont pas sérialisables et ne peuvent donc pas être utilisés comme valeur accomplie d'une telle promesse.

</Note>


<DeepDive>

#### Dois-je accomplir une promesse dans un Composant Serveur ou Client ? {/*resolve-promise-in-server-or-client-component*/}

Une promesse peut être passée d'un Composant Serveur à un Composant Client, puis accomplie dans le Composant Client avec l'API `use`. Vous pouvez également accomplir la promesse dans un Composant Serveur avec `await`, puis transmettre les données requises au Composant Client en tant que prop.

```js
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />
}
```

Toutefois, l'utilisation d'`await` dans un [Composant Serveur](/reference/react/components#server-components) bloquera son rendu jusqu'à ce que l'instruction `await` ait terminé. Le passage d'une promesse d'un Composant Serveur à un Composant Client permet à la promesse de ne pas bloquer le rendu du Composant Serveur.

</DeepDive>

### Traiter les promesses rejetées {/*dealing-with-rejected-promises*/}

Dans certains cas, une promesse passée à `use` peut être rejetée. Vous pouvez gérer les promesses rejetées en utilisant l'une ou l'autre de ces méthodes :

1. [afficher une erreur aux utilisateurs avec un périmètre d'erreur](#displaying-an-error-to-users-with-error-boundary)
2. [fournir une valeur alternative avec `Promise.catch`](#providing-an-alternative-value-with-promise-catch)

<Pitfall>

`use` ne peut pas être appelé à l'intérieur d'un bloc try-catch. En remplacement de ces blocs, [enrobez votre composant dans un périmètre d'erreur](#displaying-an-error-to-users-with-error-boundary), ou [fournissez une valeur alternative à utiliser avec la méthode `.catch` des promesses](#providing-an-alternative-value-with-promise-catch).

</Pitfall>

#### Afficher une erreur aux utilisateurs avec un périmètre d'erreur {/*displaying-an-error-to-users-with-error-boundary*/}

Si vous souhaitez afficher une erreur à vos utilisateurs quand une promesse a été rejetée, vous pouvez utiliser un [périmètre d'erreur](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Pour l'utiliser, enrobez le composant d'où vous appelez l'API `use` dans le périmètre d'erreur. Si la promesse transmise à `use` est rejetée, alors l'UI de secours de ce périmètre d'erreur sera affichée.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️ Ça sent le pâté…</p>}>
      <Suspense fallback={<p>⌛ Téléchargement du message...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Voici le message : {content}</p>;
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => setTimeout(reject, 1000));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Télécharger le message</button>;
  }
}
```

```js src/index.js hidden
// TODO : remplacer l’import d’une version Canary
// de React par une version stable, dès qu’elle
// intégrera l’API `use`
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO : mettre à jour cet exemple pour utiliser
// le Composant Serveur Codesandbox de l’environnement
// de démo lorsqu’il sera créé.
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

#### Fournir une valeur alternative avec `Promise.catch` {/*providing-an-alternative-value-with-promise-catch*/}

Si vous voulez fournir une valeur alternative quand la promesse passée à `use` est rejetée, vous pouvez utiliser la méthode <CodeStep step={1}>[`catch`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)</CodeStep> des promesses.

```js [[1, 6, "catch"],[2, 7, "return"]]
import { Message } from './message.js';

export default function App() {
  const messagePromise = new Promise((resolve, reject) => {
    reject();
  }).catch(() => {
    return "Aucun nouveau message.";
  });

  return (
    <Suspense fallback={<p>En attente de message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

Pour utiliser la méthode <CodeStep step={1}>`catch`</CodeStep> de la promesse, appelez <CodeStep step={1}>`catch`</CodeStep> sur l'objet `Promise`. <CodeStep step={1}>`catch`</CodeStep> n'accepte qu'un seul paramètre : une fonction qui prend une erreur comme argument. La <CodeStep step={2}>valeur de retour</CodeStep> de la fonction passée à <CodeStep step={1}>`catch`</CodeStep> sera utilisée comme valeur accomplie de la promesse.

---

## Dépannage {/*troubleshooting*/}

### *"Suspense Exception: This is not a real error!"* {/*suspense-exception-error*/}

*(« Exception Suspense : ce n'est pas une véritable erreur ! », NdT)*

Vous appelez probablement `use` soit en-dehors d'un composant React ou d'une fonction de Hook, soit dans un bloc try-catch. Pour corriger ce dernier cas, enrobez votre composant dans un périmètre d'erreur ou appelez la fonction `catch` de la promesse pour attraper l'erreur et résoudre la promesse avec une valeur différente. [Consultez ces exemples](#dealing-with-rejected-promises).

Si vous appelez `use` en-dehors d'un composant React ou d'une fonction de Hook, déplacez l'appel à `use` dans un composant React ou une fonction de Hook.

```jsx
function MessageComponent({messagePromise}) {
  function download() {
    // ❌ la fonction appelant `use` n'est ni un composant ni un Hook
    const message = use(messagePromise);
    // ...
```

Appelez plutôt `use` hors de toute fermeture lexicale au sein du composant, lorsque la fonction qui appelle `use` est un composant ou un Hook.

```jsx
function MessageComponent({messagePromise}) {
  // ✅ `use` est appelé depuis un composant
  const message = use(messagePromise);
  // ...
```
