---
title: Échappatoires
---

<Intro>

Certains de vos composants pourraient avoir besoin de se synchroniser avec des systèmes extérieurs à React, voire de les contrôler.  Par exemple, vous pourriez avoir besoin de rendre un champ actif au moyen d’une API du navigateur, de démarrer ou mettre en pause un lecteur vidéo implémenté sans React, ou de vous connecter à un serveur distant pour en écouter les messages.  Dans ce chapitre, vous apprendrez quelles échappatoires React vous propose pour « sortir de React » et vous connecter à des systèmes extérieurs.  La majorité de votre logique applicative et de vos flux de données ne devraient pas avoir besoin de ces fonctionnalités.

</Intro>

<YouWillLearn isChapter={true}>

* [Comment « se souvenir » d’informations sans causer de nouveaux rendus](/learn/referencing-values-with-refs)
* [Comment accéder aux éléments DOM gérés par React](/learn/manipulating-the-dom-with-refs)
* [Comment synchroniser vos composants avec des systèmes extérieurs](/learn/synchronizing-with-effects)
* [Comment retirer les Effets superflus de vos composants](/learn/you-might-not-need-an-effect)
* [En quoi le cycle de vie d’un Effet diffère de celui d’un composant](/learn/lifecycle-of-reactive-effects)
* [Comment éviter que certaines valeurs redéclenchent un Effet](/learn/separating-events-from-effects)
* [Comment réduire le nombre d’exécutions de votre Effet](/learn/removing-effect-dependencies)
* [Comment partager de la logique entre composants](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## Référencer des valeurs avec les refs {/*referencing-values-with-refs*/}

Lorsque vous souhaitez que votre composant « se souvienne » de quelque chose, mais que vous voulez éviter que l’évolution de ces données [déclenche de nouveaux rendus](/learn/render-and-commit), vous pouvez utiliser une *ref* :

```js
const ref = useRef(0);
```

Comme l’état, les refs sont préservées par React d’un rendu à l’autre.  Cependant, modifier un état déclenche un nouveau rendu du composant, alors que ce n’est pas le cas lorsqu’on modifie une ref ! Vous pouvez accéder à la valeur actuelle d’une ref au travers de sa propriété `ref.current`.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('Vous avez cliqué ' + ref.current + ' fois !');
  }

  return (
    <button onClick={handleClick}>
      Cliquez ici
    </button>
  );
}
```

</Sandpack>

Une ref est comme une poche secrète de votre composant que React ne peut pas surveiller.  Par exemple, vous pouvez utiliser les refs pour stocker [des ID de timers](https://developer.mozilla.org/fr/docs/Web/API/setTimeout#return_value), des [éléments du DOM](https://developer.mozilla.org/fr/docs/Web/API/Element), et d’autres objets qui n’impactent pas le résultat du rendu de votre composant.

<LearnMore path="/learn/referencing-values-with-refs">

Lisez **[Référencer des valeurs avec les refs](/learn/referencing-values-with-refs)** pour en apprendre davantage sur le recours aux refs pour retenir des informations.

</LearnMore>

## Manipuler le DOM avec des refs {/*manipulating-the-dom-with-refs*/}

React met automatiquement le DOM à jour pour correspondre au résultat de votre rendu, de sorte que vos composants ont rarement besoin de le manipuler directement.  Ceci dit, il arrive parfois que vous ayez besoin d’accéder à des éléments du DOM gérés par React ; par exemple pour donner le focus à un élément, défiler jusqu’à celui-ci, ou mesurer ses dimensions ou sa position.  Il n’y a pas de solution intégrée à React pour de tels besoins, aussi devrez-vous utiliser une ref vers le nœud DOM en question.  Dans l’exemple ci-après, cliquer sur le bouton donnera le focus au champ grâce à une ref :

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Donner le focus au champ
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

Lisez **[Manipuler le DOM avec des refs](/learn/manipulating-the-dom-with-refs)** pour découvrir comment accéder aux éléments du DOM qui sont gérés par React.

</LearnMore>

## Synchroniser grâce aux Effets {/*synchronizing-with-effects*/}

Certains composants ont besoin de se synchroniser avec des systèmes extérieurs.  Par exemple, vous pourriez vouloir contrôler un composant non React sur la base d’un état React, mettre en place une connexion à un serveur, ou envoyer des événements analytiques lorsqu’un composant apparaît à l’écran.  Contrairement aux gestionnaires d’événements, qui vous permettent de réagir à des événements spécifiques, les *Effets* vous permettent d’exécuter du code à la suite du rendu.  Utilisez-les pour synchroniser votre composant avec un système extérieur à React.

Appuyez quelques fois sur Lecture / Pause et voyez comme le lecteur vidéo natif reste synchronisé avec la valeur de la prop `isPlaying` :

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Lecture'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

De nombreux Effets ont également besoin de « nettoyer derrière eux ».  Par exemple, si un Effet met en place une connexion à un serveur de discussion, il devrait renvoyer une *fonction de nettoyage* indiquant à React comment déconnecter le composant du serveur :

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Bienvenue dans la discussion !</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // Une véritable implémentation se connecterait en vrai
  return {
    connect() {
      console.log('✅ Connexion...');
    },
    disconnect() {
      console.log('❌ Déconnecté.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

En développement, React exécutera et nettoiera votre Effet immédiatement une fois supplémentaire.  C’est pourquoi vous voyez deux fois `"✅ Connexion..."` dans la console. Ça garantit que vous n’oublierez pas d’implémenter la fonction de nettoyage.

<LearnMore path="/learn/synchronizing-with-effects">

Lisez **[Synchroniser grâce aux Effets](/learn/synchronizing-with-effects)** pour apprendre à synchroniser vos composants avec des systèmes extérieurs.

</LearnMore>

## Vous n’avez pas forcément besoin d’un Effet {/*you-might-not-need-an-effect*/}

Les Effets sont une façon d’échapper au paradigme de React. Ils vous permettent de « sortir » de React et de synchroniser vos composants avec un système extérieur quelconque. S’il n’y a pas de système extérieur dans l’histoire (par exemple, vous voulez juste mettre à jour l’état d’un composant lorsque ses props ou son état changent), vous ne devriez pas avoir besoin d’un Effet. Retirer des Effets superflus rendra votre code plus simple à comprendre, plus performant, et moins sujet aux erreurs.

Il y a deux scénarios principaux pour lesquels vous n’avez pas besoin d’Effets :

- **Vous n’avez pas besoin d’Effets pour transformer des données utilisées par le rendu.**
- **Vous n’avez pas besoin d’Effets pour gérer les événements utilisateurs.**

Par exemple, vous n’avez pas besoin d’un Effet pour ajuster un état sur la base d’un autre état :

```js {expectedErrors: {'react-compiler': [8]}} {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Clara');
  const [lastName, setLastName] = useState('Luciani');

  // 🔴 Évitez : état redondant et Effet superflu
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Calculez plutôt le maximum de choses au moment du rendu :

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Clara');
  const [lastName, setLastName] = useState('Luciani');
  // ✅ Correct : valeur calculée lors du rendu
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

<<<<<<< HEAD
En revanche, vous *avez besoin* d’Effets pour vous synchroniser à des systèmes extérieurs.
=======
However, you *do* need Effects to synchronize with external systems.
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698

<LearnMore path="/learn/you-might-not-need-an-effect">

Lisez **[Vous n’avez pas forcément besoin d’un Effet](/learn/you-might-not-need-an-effect)** pour apprendre comment retirer les Effets superflus ou inadaptés.

</LearnMore>

## Cycle de vie des Effets réactifs {/*lifecycle-of-reactive-effects*/}

Les Effets ont un cycle de vie différent de celui des composants.  Les composants peuvent être montés, mis à jour ou démontés.  Un Effet ne peut faire que deux choses : commencer la synchronisation avec quelque chose, et plus tard cesser la synchronisation.  Ce cycle peut survenir de nombreuses fois si votre Effet dépend de props ou d’éléments d’état qui changent avec le temps.

L’Effet ci-après dépend de la valeur de la prop `roomId`.  Les props sont des *valeurs réactives*, ce qui signifie qu’elles peuvent changer d’un rendu à l’autre.  Voyez comme l’Effet *se resynchronise* (et se reconnecte au serveur) si `roomId` change :

<Sandpack>

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

  return <h1>Bienvenue dans le salon {roomId} !</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choisissez le salon de discussion{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">général</option>
          <option value="travel">voyage</option>
          <option value="music">musique</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

React fournit une règle de *linter* pour vérifier que vous fournissez des dépendances appropriées à vos Effets.  Si vous oubliez de préciser `roomId` dans la liste des dépendances de l’exemple ci-avant, le *linter* repèrera le problème automatiquement.

<LearnMore path="/learn/lifecycle-of-reactive-effects">

Lisez **[Cycle de vie des Effets réactifs](/learn/lifecycle-of-reactive-effects)** pour découvrir en quoi le cycle de vie d’un Effet est différent de celui d’un composant.

</LearnMore>

## Séparer les événements des Effets {/*separating-events-from-effects*/}

<<<<<<< HEAD
<Wip>

Cette section décrit une **API expérimentale : elle n’a donc pas encore été livrée** dans une version stable de React.

</Wip>

Les gestionnaires d’événements ne sont ré-exécutés que lorsque vous répétez l’interaction qui les concerne.  Contrairement aux gestionnaires d’événements, les Effets se resynchronisent si au moins une des valeurs qu’ils lisent (telles que des props ou variables d’état) diffère depuis le rendu précédent.  Vous aurez parfois besoin d’une comportement hybride : un Effet qui s’exécute à nouveau en réaction à certains changements de valeurs, mais pas tous.
=======
Event handlers only re-run when you perform the same interaction again. Unlike event handlers, Effects re-synchronize if any of the values they read, like props or state, are different than during last render. Sometimes, you want a mix of both behaviors: an Effect that re-runs in response to some values but not others.
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698

Tout le code au sein d’un Effet est *réactif*. Il sera exécuté à nouveau si une des valeurs réactives qu’il lit a changé lors du dernier rendu.  Par exemple, l’Effet que voici se reconnecte au serveur de discussion si `roomId` ou `theme` changent :

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connecté !', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Bienvenue dans le salon {roomId} !</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">général</option>
          <option value="travel">voyage</option>
          <option value="music">musique</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Utiliser le thème sombre
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Il n’est pas possible d’ajouter un gestionnaire deux fois.');
      }
      if (event !== 'connected') {
        throw Error('Seul l’événement "connected" est accepté.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Ce n’est pas idéal.  Vous voulez vous reconnecter au serveur de discussion seulement si `roomId` a changé.  Basculer le `theme` ne devrait pas entraîner une reconnexion au serveur !  Déplacez le code qui lit `theme` hors de votre Effet et dans un *Événement d’Effet* *(Effect Event, NdT)* :

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connecté !', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Bienvenue dans le salon {roomId} !</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">général</option>
          <option value="travel">voyage</option>
          <option value="music">musique</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Utiliser le thème sombre
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Il n’est pas possible d’ajouter un gestionnaire deux fois.');
      }
      if (event !== 'connected') {
        throw Error('Seul l’événement "connected" est accepté.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Le code au sein des Événements d’Effets n’est pas réactif, de sorte que modifier `theme` n’entraînera pas la ré-exécution de votre Effet de connexion.

<LearnMore path="/learn/separating-events-from-effects">

Lisez **[Séparer les événements des Effets](/learn/separating-events-from-effects)** pour apprendre comment éviter que les changements de certaines valeurs ne redéclenchent vos Effets.

</LearnMore>

## Alléger les dépendances des Effets {/*removing-effect-dependencies*/}

Lorsque vous écrivez un Effet, le *linter* vérifiera que vous avez bien inclus, dans les dépendances de l’Effet, chaque valeur réactive (telle que des props ou variables d’état) que l’Effet lit.  Ça garantit que votre Effet reste synchronisé avec les props et variables d’état les plus récentes de votre composant.  Les dépendances superflues peuvent toutefois entraîner des exécutions trop fréquentes de votre Effet, voire créer une boucle de rendus infinie.  La façon de les alléger dépend du cas de figure.

Par exemple, l’Effet que voici dépend de l’objet `options`, qui est recréé chaque fois que la saisie est modifiée :

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Bienvenue dans le salon{roomId} !</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Vous ne souhaitez pas que votre composant se reconnecte chaque fois que vous commencez à saisir un message dans ce salon.  Pour corriger le problème, déplacez la création de l’objet `options` au sein de l’Effet, de façon à ce qu’il ne dépende plus que de la chaîne de caractères `roomId` :

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Bienvenue dans le salon {roomId} !</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Notez que vous n’avez pas commencé par retirer la dépendance à `options` de la liste des dépendances. Ce serait incorrect.  Vous avez plutôt modifié le code environnant de façon à ce que cette dépendance devienne *inutile*.  Voyez la liste de dépendances comme une liste de toutes les valeurs réactives utilisées par le code de l’Effet. Vous ne choisissez pas ce que vous y listez. La liste décrit le code. Pour changer la liste des dépendances, changez le code de l’Effet.

<LearnMore path="/learn/removing-effect-dependencies">

Lisez **[Alléger les dépendances des Effets](/learn/removing-effect-dependencies)** pour apprendre à réduire le nombre d’exécutions de vos Effets.

</LearnMore>

## Réutiliser de la logique grâce aux Hooks personnalisés {/*reusing-logic-with-custom-hooks*/}

React fournit des Hooks prédéfinis tels que `useState`, `useContext`, et `useEffect`. Vous souhaiterez parfois qu’un Hook existe pour un besoin plus ciblé : par exemple pour charger des données, surveiller l’état de connectivité du réseau, ou vous connecter à un salon de discussion. Pour de tels cas de figure, vous pouvez créer vos propres Hooks selon les besoins de votre application.

Dans l’exemple ci-après, le Hook personnalisé `usePointerPosition` piste la position du curseur, tandis que le Hook personnalisé `useDelayedValue` renvoie une valeur qui est « en retard » sur celle que vous lui passez, à raison d’un délai précis en millisecondes.  Déplacez le curseur dans la zone de prévisualisation du bac à sable pour voir une file de points suivre son mouvement :

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

Vous pouvez créer vos propres Hooks, les composer ensemble, passer des données de l’un à l’autre, et les réutiliser dans plusieurs composants.  Au fil de la croissance de votre appli, vous écrirez de moins en moins d’Effets directs car vous pourrez capitaliser sur vos Hooks personnalisés déjà écrits.  La communauté React maintient énormément d’excellents Hooks personnalisés.

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

Lisez **[Réutiliser de la logique grâce aux Hooks personnalisés](/learn/reusing-logic-with-custom-hooks)** pour découvrir comment partager de la logique applicative entre vos composants.

</LearnMore>

## Et maintenant ? {/*whats-next*/}

Allez voir [Référencer des valeurs avec les refs](/learn/referencing-values-with-refs) pour commencer à lire ce chapitre page par page !
