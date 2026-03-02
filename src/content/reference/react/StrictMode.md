---
title: <StrictMode>
---


<Intro>

`<StrictMode>` vous permet de détecter des bugs courants dans vos composants pendant la phase de développement.


```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `<StrictMode>` {/*strictmode*/}

Utilisez `StrictMode` pour activer des comportements de développement et des avertissements supplémentaires pour l'arbre des composants que vous placez à l'intérieur :

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[Voir d'autres exemples plus bas](#usage).

Les comportements suivants sont activés en développement par le Mode Strict :

<<<<<<< HEAD
- Vos composants feront [un rendu supplémentaire](#fixing-bugs-found-by-double-rendering-in-development) afin de trouver les bugs causés par des rendus impurs.
- Vos composants [exécuteront les Effets une fois supplémentaire](#fixing-bugs-found-by-re-running-effects-in-development) afin de détecter les bugs causés par l'absence de nettoyage d'Effet.
- Vos composants [seront contrôlés pour l'utilisation d'API dépréciées](#fixing-deprecation-warnings-enabled-by-strict-mode).
=======
- Your components will [re-render an extra time](#fixing-bugs-found-by-double-rendering-in-development) to find bugs caused by impure rendering.
- Your components will [re-run Effects an extra time](#fixing-bugs-found-by-re-running-effects-in-development) to find bugs caused by missing Effect cleanup.
- Your components will [re-run refs callbacks an extra time](#fixing-bugs-found-by-re-running-ref-callbacks-in-development) to find bugs caused by missing ref cleanup.
- Your components will [be checked for usage of deprecated APIs.](#fixing-deprecation-warnings-enabled-by-strict-mode)
>>>>>>> 427f24d694674be458f0fe7cb97ab1c8fe736586

#### Props {/*props*/}

`StrictMode` ne prend aucune prop.

#### Limitations {/*caveats*/}

* Il n'est pas possible de désactiver le Mode Strict au sein d'un arbre enrobé dans un `<StrictMode>`. Ça vous garantit que tous les composants à l'intérieur de `<StrictMode>` sont vérifiés. Si deux équipes travaillant sur un produit ne sont pas d'accord sur l'utilité de ces vérifications, elles doivent trouver un consensus ou déplacer le `<StrictMode>` plus bas dans l'arbre.

---

## Utilisation {/*usage*/}

### Activer le Mode Strict pour toute l'appli {/*enabling-strict-mode-for-entire-app*/}

Le Mode Strict active des vérifications supplémentaires uniquement en mode de développement pour tout l'arbre des composants à l'intérieur du composant `<StrictMode>`. Ces vérifications vous aident à trouver des bugs courants dans vos composants dès le début de la phase de développement.


Pour activer le Mode Strict pour toute votre appli, enrobez votre composant racine avec `<StrictMode>` lorsque vous en faites le rendu :

```js {6,8}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Nous recommandons d'enrober toute votre appli dans le Mode Strict, en particulier pour les nouvelles applis. Si vous utilisez un framework qui appelle [`createRoot`](/reference/react-dom/client/createRoot) à votre place, consultez sa documentation pour savoir comment activer le Mode Strict.

Bien que les vérifications en Mode Strict **ne s'exécutent que durant le développement**, elles vous aident à trouver des bugs qui existent déjà dans votre code et qui peuvent être difficiles à reproduire de façon fiable en production. Le Mode Strict vous permet de corriger les bugs avant que vos utilisateurs ne les signalent.

<Note>

Le Mode Strict active les vérifications suivantes en mode de développement :

<<<<<<< HEAD
- Vos composants feront [un rendu supplémentaire](#fixing-bugs-found-by-double-rendering-in-development) afin de trouver les bugs causés par des rendus impurs.
- Vos composants [exécuteront les Effets une fois supplémentaire](#fixing-bugs-found-by-re-running-effects-in-development) afin de détecter les bugs causés par l'absence de nettoyage d'Effet.
- Vos composants [seront contrôlés pour l'utilisation d'API dépréciées](#fixing-deprecation-warnings-enabled-by-strict-mode).
=======
- Your components will [re-render an extra time](#fixing-bugs-found-by-double-rendering-in-development) to find bugs caused by impure rendering.
- Your components will [re-run Effects an extra time](#fixing-bugs-found-by-re-running-effects-in-development) to find bugs caused by missing Effect cleanup.
- Your components will [re-run ref callbacks an extra time](#fixing-bugs-found-by-re-running-ref-callbacks-in-development) to find bugs caused by missing ref cleanup.
- Your components will [be checked for usage of deprecated APIs.](#fixing-deprecation-warnings-enabled-by-strict-mode)
>>>>>>> 427f24d694674be458f0fe7cb97ab1c8fe736586

**Ces vérifications ne sont effectuées qu'en phase de développement et n'ont aucun impact sur votre *build* de production.**

</Note>

---

### Activer le Mode Strict sur une partie de l'appli {/*enabling-strict-mode-for-a-part-of-the-app*/}

Vous pouvez également activer le Mode Strict sur n'importe quelle partie de votre application :

```js {7,12}
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

Dans cet exemple, les vérifications du Mode Strict ne s'exécuteront pas sur les composants `Header` et `Footer`. Cependant, elles s'exécuteront sur `Sidebar` et `Content`, ainsi que sur tous les composants qu'ils contiennent, peu importe la profondeur à laquelle ils se trouvent.

<Note>

When `StrictMode` is enabled for a part of the app, React will only enable behaviors that are possible in production. For example, if `<StrictMode>` is not enabled at the root of the app, it will not [re-run Effects an extra time](#fixing-bugs-found-by-re-running-effects-in-development) on initial mount, since this would cause child effects to double fire without the parent effects, which cannot happen in production.

</Note>

---

### Corriger les bugs trouvés par le double rendu en développement {/*fixing-bugs-found-by-double-rendering-in-development*/}

[React part du principe que chaque composant que vous écrivez est une fonction pure](/learn/keeping-components-pure). Ça signifie que vos composants React doivent toujours renvoyer le même JSX pour les mêmes entrées (props, état et contexte).

Les composants qui ne respectent pas cette règle peuvent se comporter de façon imprévisible et occasionner des bugs. Pour vous aider à trouver du code accidentellement impur, le Mode Strict appelle certaines de vos fonctions (seulement celles qui doivent être pures) **deux fois en développement**. Ça inclut :

- Le corps de votre fonction composant (seulement la logique du niveau racine, ce qui exclut le code contenu dans les gestionnaires d'événements).
- Les fonctions que vous passez à [`useState`](/reference/react/useState), aux [fonctions `set`](/reference/react/useState#setstate), à [`useMemo`](/reference/react/useMemo) ou à [`useReducer`](/reference/react/useReducer).
- Certaines méthodes des composants à bases de classes comme [`constructor`](/reference/react/Component#constructor), [`render`](/reference/react/Component#render), [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) ([voir la liste complète](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)).

Si une fonction est pure, l'exécuter deux fois ne change pas son comportement, car une telle fonction produit le même résultat à chaque fois. Cependant, si une fonction est impure (elle modifie par exemple la donnée qu'elle reçoit), l'exécuter deux fois devrait se remarquer (c'est ce qui la rend impure !). Ça vous aide à détecter et corriger les bugs plus rapidement.

**Voici un exemple qui illustre comment le double rendu en Mode Strict vous aide à détecter des bugs plus tôt.**

Ce composant `StoryTray` prend un tableau de `stories` et ajoute à la fin un élément « Créer une histoire » :

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  { id: 0, label: "L’histoire d’Ankit" },
  { id: 1, label: "L’histoire de Clara" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Créer une histoire' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Il y a une erreur dans le code ci-dessus. Il est cependant facile de passer à côté, dans la mesure où l'affichage initial semble correct.

<<<<<<< HEAD
Cette erreur devient bien plus facile à remarquer lorsque le composant `StoryTray` fait son rendu plusieurs fois. Par exemple, faisons un nouveau rendu de `StoryTray` avec une couleur de fond différente à chaque fois que vous le survolez :
=======
This mistake will become more noticeable if the `StoryTray` component re-renders multiple times. For example, let's make the `StoryTray` re-render with a different background color whenever you hover over it:
>>>>>>> 427f24d694674be458f0fe7cb97ab1c8fe736586

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  { id: 0, label: "L’histoire d’Ankit" },
  { id: 1, label: "L’histoire de Clara" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Créer une histoire' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Remarquez qu'à chaque fois que vous survolez le composant `StoryTray`, ça ajoute « Créer une histoire » à la liste. Le code ne visait qu'à l'ajouter une seule fois à la fin. Cependant, `StoryTray` modifie directement le tableau `stories` des props. Chaque fois que `StoryTray` fait son rendu, il ajoute « Créer une histoire » à la fin de ce tableau. En d'autres termes, `StoryTray` n'est pas une fonction pure — l'exécuter plusieurs fois produit des résultats différents.

Pour corriger ce problème, vous pouvez faire une copie du tableau et modifier cette copie plutôt que l'original :

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Copier le tableau
  // ✅ Correct : ajouter dans un nouveau tableau
  items.push({ id: 'create', label: 'Créer une histoire' });
```

Ça rendrait [la fonction `StoryTray` pure](/learn/keeping-components-pure). À chaque appel, elle ne modifierait que la copie du tableau et n'affecterait aucun objet ou variable externe. Ça résout le bug, mais vous avez dû faire en sorte que le composant fasse plus souvent son rendu pour mettre en évidence le souci dans son comportement.

**Dans cet exemple, le bug ne sautait pas aux yeux. Enrobons maintenant le code original (avec son bug) dans un composant `<StrictMode>` :**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  { id: 0, label: "L’histoire d’Ankit" },
  { id: 1, label: "L’histoire de Clara" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Créer une histoire' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**Le Mode Strict appelle *toujours* votre fonction de rendu deux fois, afin que vous puissiez voir le problème immédiatement** (« Créer une histoire » apparaît deux fois). Ça vous permet de détecter ce genre d'erreur plus tôt dans le processus de développement. Lorsque vous corrigez votre composant pour qu'il fasse des rendus corrects en Mode Strict, vous corrigez *également* de nombreux bugs potentiels en production, telle que la fonctionnalité de survol précédente :

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  { id: 0, label: "L’histoire d’Ankit" },
  { id: 1, label: "L’histoire de Clara" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // Copier le tableau
  items.push({ id: 'create', label: 'Créer une histoire' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Sans le Mode Strict, il était facile de passer à côté du bug jusqu'à ce que vous ajoutiez d'autres rendus. Le Mode Strict fait apparaître le même bug immédiatement. Ce mode vous aide à trouver les bugs avant que vous ne les poussiez à votre équipe et à vos utilisateurs.

[Apprenez-en davantage sur la façon de garder les composants purs](/learn/keeping-components-pure).

<Note>

Si vous avez installé [les outils de développement React](/learn/react-developer-tools), tous les appels à `console.log` lors du second appel apparaîtront légèrement estompés. Ces outils proposent également un paramètre (désactivé par défaut) pour les masquer complètement.

</Note>

---

### Corriger les bugs trouvés en réexécutant les Effets en développement {/*fixing-bugs-found-by-re-running-effects-in-development*/}

Le Mode Strict est également utile pour trouver des bugs dans les [Effets](/learn/synchronizing-with-effects).

Chaque Effet a du code d'initialisation et peut avoir du code de nettoyage. Normalement, React appelle le code d'initialisation quand le composant *est monté* (quand il est ajouté à l'écran), et appelle le code de nettoyage quand le composant est *démonté* (il est enlevé de l'écran). React appelle ensuite le nettoyage et l'initialisation à nouveau si l'une des dépendances de l'Effet a changé depuis le dernier rendu.

Quand le Mode Strict est activé, React exécutera **un cycle d'initialisation + nettoyage supplémentaire en développement pour chaque Effet**.  Ça peut surprendre, mais ça aide à détecter des bugs subtils qu'il est difficile de repérer manuellement.

**Voici un exemple qui illustre comment la réexécution de l'Effet en Mode Strict vous aide à trouver des bugs plus rapidement.**

Prenez cet exemple qui connecte un composant à un salon de discussion :

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Bienvenue sur le salon {roomId} !</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
      connections++;
      console.log('Connexions actives : ' + connections);
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
      connections--;
      console.log('Connexions actives : ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Il y a un problème avec ce code, mais ça ne saute pas aux yeux.

Pour rendre le problème plus évident, ajoutons une fonctionnalité. Dans l'exemple ci-dessous, `roomId` n'est pas codé en dur. L'utilisateur peut en effet choisir dans une liste déroulante le `roomId` auquel il souhaite se connecter. Appuyez sur « Ouvrir le salon » puis sélectionnez un à un les différents salons de discussion. Surveillez le nombre de connexions actives dans la console :

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  <h1>Bienvenue sur le salon {roomId} !</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choisissez le salon :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">général</option>
          <option value="travel">voyage</option>
          <option value="music">musique</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Fermer le salon' : 'Ouvrir le salon'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
      connections++;
      console.log('Connexions actives : ' + connections);
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
      connections--;
      console.log('Connexions actives : ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Vous remarquerez que le nombre de connexions ouvertes ne cesse de grandir. Dans une véritable appli, ça causerait des problèmes de performances et de réseau. Le problème vient [de l'absence de fonction de nettoyage dans votre Effet](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) :

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

Maintenant que votre Effet « fait le nettoyage » et supprime les connexions obsolètes, la fuite est réparée. Remarquez cependant que le problème n'est devenu visible qu'une fois de nouvelles fonctionnalités ajoutées (la liste déroulante).

**Dans l'exemple original, le bug ne sautait pas aux yeux. Enrobez maintenant le code original (et buggué) dans un composant `<StrictMode>` :**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  <h1>Bienvenue sur le salon {roomId} !</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
      connections++;
      console.log('Connexions actives : ' + connections);
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
      connections--;
      console.log('Connexions actives : ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**Avec le Mode Strict, vous voyez immédiatement qu'il y a un problème** (le nombre de connexions actives monte à 2). Ce mode exécute le cycle initialisation - nettoyage une fois de plus pour chaque Effet. Cet Effet n'a pas de logique de nettoyage, il crée donc une connexion supplémentaire sans jamais la détruire. C'est un indice qu'il vous manque une fonction de nettoyage.

Le Mode Strict vous permet de détecter de telles erreurs tôt dans le process. Lorsque vous corrigez votre Effet en ajoutant une fonction de nettoyage dans le Mode Strict, vous corrigez *également* de nombreux bugs potentiels en production, telle que la liste déroulante vue précédemment :

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  <h1>Bienvenue sur le salon {roomId} !</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choisissez le salon :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">général</option>
          <option value="travel">voyage</option>
          <option value="music">musique</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Ouvrir le salon' : 'Fermer le salon'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
      connections++;
      console.log('Connexions actives : ' + connections);
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
      connections--;
      console.log('Connexions actives : ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Remarquez que le nombre de connexions actives dans la console cesse de grandir maintenant.

Sans le Mode Strict, il était facile de passer à côté du fait que l'Effet nécessitait une fonction de nettoyage. En exécutant *initialisation → nettoyage → initialisation* plutôt que *initialisation* de votre Effet en développement, le Mode Strict a rendu l'absence de fonction de nettoyage plus visible.

[Apprenez-en davantage sur l'implémentation de fonction de nettoyage des Effets](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development).

---
### Fixing bugs found by re-running ref callbacks in development {/*fixing-bugs-found-by-re-running-ref-callbacks-in-development*/}

<<<<<<< HEAD
### Corriger les alertes de dépréciation activées par le Mode Strict {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}
=======
Strict Mode can also help find bugs in [callbacks refs.](/learn/manipulating-the-dom-with-refs)

Every callback `ref` has some setup code and may have some cleanup code. Normally, React calls setup when the element is *created* (is added to the DOM) and calls cleanup when the element is *removed* (is removed from the DOM).

When Strict Mode is on, React will also run **one extra setup+cleanup cycle in development for every callback `ref`.** This may feel surprising, but it helps reveal subtle bugs that are hard to catch manually.

Consider this example, which allows you to select an animal and then scroll to one of them. Notice when you switch from "Cats" to "Dogs", the console logs show that the number of animals in the list keeps growing, and the "Scroll to" buttons stop working:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ❌ Not using StrictMode.
root.render(<App />);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  // 🚩 No cleanup, this is a bug!
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>


**This is a production bug!** Since the ref callback doesn't remove animals from the list in the cleanup, the list of animals keeps growing. This is a memory leak that can cause performance problems in a real app, and breaks the behavior of the app.

The issue is the ref callback doesn't cleanup after itself:

```js {6-8}
<li
  ref={node => {
    const list = itemsRef.current;
    const item = {animal, node};
    list.push(item);
    return () => {
      // 🚩 No cleanup, this is a bug!
    }
  }}
</li>
```

Now let's wrap the original (buggy) code in `<StrictMode>`:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  // 🚩 No cleanup, this is a bug!
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

**With Strict Mode, you immediately see that there is a problem**. Strict Mode runs an extra setup+cleanup cycle for every callback ref. This callback ref has no cleanup logic, so it adds refs but doesn't remove them. This is a hint that you're missing a cleanup function.

Strict Mode lets you eagerly find mistakes in callback refs. When you fix your callback by adding a cleanup function in Strict Mode, you *also* fix many possible future production bugs like the "Scroll to" bug from before:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Adding cat to the map. Total cats: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ Too many cats in the list!');
                }
                return () => {
                  list.splice(list.indexOf(item), 1);
                  console.log(`❌ Removing cat from the map. Total cats: ${itemsRef.current.length}`);
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

Now on inital mount in StrictMode, the ref callbacks are all setup, cleaned up, and setup again:

```
...
✅ Adding animal to the map. Total animals: 10
...
❌ Removing animal from the map. Total animals: 0
...
✅ Adding animal to the map. Total animals: 10
```

**This is expected.** Strict Mode confirms that the ref callbacks are cleaned up correctly, so the size never grows above the expected amount. After the fix, there are no memory leaks, and all the features work as expected.

Without Strict Mode, it was easy to miss the bug until you clicked around to app to notice broken features. Strict Mode made the bugs appear right away, before you push them to production.

---
### Fixing deprecation warnings enabled by Strict Mode {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}
>>>>>>> 427f24d694674be458f0fe7cb97ab1c8fe736586

React alerte si certains composants quelque part à l'intérieur de l'arbre de `<StrictMode>` utilisent l'une de ces API dépréciées :

<<<<<<< HEAD
* [`findDOMNode`](/reference/react-dom/findDOMNode). [Voir les alternatives](/reference/react-dom/findDOMNode#alternatives).
* Les méthodes de cycle de vie `UNSAFE_` des composants à base de classes, telles que [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [Voir les alternatives](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles).
* Les anciens contextes ([`childContextTypes`](/reference/react/Component#static-childcontexttypes), [`contextTypes`](/reference/react/Component#static-contexttypes) et [`getChildContext`](/reference/react/Component#getchildcontext)). [Voir les alternatives](/reference/react/createContext).
* Les anciennes refs textuelles ([`this.refs`](/reference/react/Component#refs)). [Voir les alternatives](https://legacy.reactjs.org/docs/strict-mode.html#warning-about-legacy-string-ref-api-usage).
=======
* `UNSAFE_` class lifecycle methods like [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [See alternatives.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles)
>>>>>>> 427f24d694674be458f0fe7cb97ab1c8fe736586

Ces API sont avant tout utilisées dans les anciens [composants à base de classes](/reference/react/Component) et n'apparaissent que rarement dans les applis modernes.
