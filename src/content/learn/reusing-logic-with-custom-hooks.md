---
title: 'Réutiliser de la logique grâce aux Hooks personnalisés'
---

<Intro>

React fournit plusieurs Hooks tels que `useState`, `useContext` et `useEffect`. Parfois, vous aimeriez qu’il y ait un Hook pour un besoin plus précis : par exemple pour récupérer des données, savoir si un utilisateur est en ligne ou encore se connecter à un salon de discussion. Vous ne trouverez peut-être pas ces Hooks dans React, mais vous pouvez créer vos propres Hooks pour les besoins de votre application.

</Intro>

<YouWillLearn>

- Ce que sont les Hooks personnalisés et comment écrire les vôtres
- Comment réutiliser de la logique entre composants
- Comment nommer et structurer vos Hooks personnalisés
- Quand et pourquoi extraire des Hooks personnalisés

</YouWillLearn>

## Hooks personnalisés : partager de la logique entre composants {/*custom-hooks-sharing-logic-between-components*/}

Imaginez que vous développiez une appli qui repose massivement sur le réseau (comme c’est le cas de la plupart des applis). Vous souhaitez avertir l’utilisateur si sa connexion réseau est brutalement interrompue pendant qu’il utilisait son appli. Comment vous y prendriez-vous ? Il semble que vous ayez besoin de deux choses dans votre composant :

1. Un élément d’état qui détermine si le réseau est en ligne ou non.
2. Un effet qui s’abonne aux événements globaux [`online`](https://developer.mozilla.org/fr/docs/Web/API/Window/online_event) et [`offline`](https://developer.mozilla.org/fr/docs/Web/API/Window/offline_event), et met à jour cet état.

Ça permettra à votre composant de rester [synchronisé](/learn/synchronizing-with-effects) avec l’état du réseau. Vous pouvez commencer par quelque chose comme ceci :

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ En ligne' : '❌ Déconnecté'}</h1>;
}
```

</Sandpack>

Essayez d’activer et de désactiver votre réseau et voyez comme cette `StatusBar` se met à jour en fonction de vos actions.

Imaginez maintenant que vous souhaitiez utiliser la *même* logique dans un composant différent. Vous voulez créer un bouton Enregistrer qui sera désactivé et affichera « Reconnexion… » au lieu de « Enregistrer » lorsque le réseau est désactivé.

Pour commencer, vous pouvez copier-coller l’état `isOnline` et l’effet dans le `SaveButton` :

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progression enregistrée');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Enregistrer la progression' : 'Reconnexion...'}
    </button>
  );
}
```

</Sandpack>

Vérifiez que le bouton changera d’apparence si vous débranchez le réseau.

Ces deux composants fonctionnent bien, mais la duplication de la logique entre eux est regrettable. Il semble que même s’ils ont un *aspect visuel* différent, ils réutilisent la même logique.

### Extraire votre Hook personnalisé d’un composant {/*extracting-your-own-custom-hook-from-a-component*/}

Imaginez un instant que, comme pour [`useState`](/reference/react/useState) et [`useEffect`](/reference/react/useEffect), il existe un Hook prédéfini `useOnlineStatus`. Ces deux composants pourraient alors être simplifiés et vous pourriez supprimer la duplication entre eux :

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ En ligne' : '❌ Déconnecté'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progression enregistrée');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Enregistrer la progression' : 'Reconnexion...'}
    </button>
  );
}
```

Même si un tel Hook intégré n’existe pas, vous pouvez l’écrire vous-même. Déclarez une fonction appelée `useOnlineStatus` et déplacez-y tout le code dupliqué des composants que vous avez écrits plus tôt :

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

À la fin de la fonction, retournez `isOnline`. Ça permet à votre composant de lire cette valeur :

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ En ligne' : '❌ Déconnecté'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progression enregistrée');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Enregistrer la progression' : 'Reconnection...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Vérifiez que l’activation et la désactivation du réseau mettent à jour les deux composants.

Désormais, vos composants n’ont plus de logique dupliquée. **Plus important encore, le code qu’ils contiennent décrit *ce qu’ils veulent faire* (utiliser le statut de connexion) plutôt que *la manière de le faire* (en s’abonnant aux événements du navigateur).**

Quand vous extrayez la logique dans des Hooks personnalisés, vous pouvez masquer les détails de la façon dont vous traitez avec des systèmes extérieurs ou avec une API du navigateur. Le code de vos composants exprime votre intention, pas l’implémentation.

### Les noms des Hooks commencent toujours par `use` {/*hook-names-always-start-with-use*/}

Les applications React sont construites à partir de composants. Les composants sont construits à partir des Hooks, qu’ils soient pré-fournis ou personnalisés. Vous utiliserez probablement souvent des Hooks personnalisés créés par d’autres, mais vous pourrez occasionnellement en écrire un vous-même !

Vous devez respecter les conventions de nommage suivantes :

1. **Les noms des composants React doivent commencer par une majuscule,** comme `StatusBar` et `SaveButton`. Les composants React doivent également renvoyer quelque chose que React sait afficher, comme un bout de JSX.
2. **Les noms des Hooks doivent commencer par `use` suivi d’une majuscule,** comme [`useState`](/reference/react/useState) (fourni) ou `useOnlineStatus` (personnalisé, comme plus haut dans cette page). Les Hooks peuvent renvoyer des valeurs quelconques.

Cette convention garantit que vous pouvez toujours examiner le code d’un composant et repérer où son état, ses effets et d’autres fonctionnalités de React peuvent « se cacher ». Par exemple, si vous voyez un appel à la fonction `getColor()` dans votre composant, vous pouvez être sûr·e qu’il ne contient pas d’état React car son nom ne commence pas par `use`. En revanche, un appel de fonction comme `useOnlineStatus()` contiendra très probablement des appels à d’autres Hooks.

<Note>

Si votre linter est [configuré pour React,](/learn/editor-setup#linting) il appliquera cette convention de nommage. Remontez jusqu’au bac à sable et renommez `useOnlineStatus` en `getOnlineStatus`. Remarquez que le linter ne vous permettra plus appeler `useState` ou `useEffect` à l’intérieur. Seuls les Hooks et les composants peuvent appeler d’autres Hooks !

</Note>

<DeepDive>

#### Toutes les fonctions appelées pendant le rendu doivent-elles commencer par le préfixe `use` ? {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

Non. Les fonctions qui n’*appellent* pas des Hooks n’ont pas besoin d’*être* des Hooks.

Si votre fonction n’appelle aucun Hook, évitez d’utiliser le préfixe `use`. À la place, écrivez une fonction normale *sans* le préfixe `use`. Par exemple, `useSorted` ci-dessous n’appelle pas de Hook, appelez-la plutôt `getSorted` :

```js
// 🔴 À éviter : un Hook qui n’utilise pas d’autres Hooks
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Correct : une fonction normale qui n’utilise pas de Hook
function getSorted(items) {
  return items.slice().sort();
}
```

Ça garantit que votre code peut appeler cette fonction n’importe où, y compris dans des conditions :

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ On peut appeler getSorted() conditionnellement parce qu’il ne s’agit pas d’un Hook
    displayedItems = getSorted(items);
  }
  // ...
}
```

Vous devez utiliser le préfixe `use` pour une fonction (et ainsi, en faire un Hook) si elle utilise elle-même un Hook dans son code :

```js
// ✅ Correct : un Hook qui utilise un autre Hook
function useAuth() {
  return useContext(Auth);
}
```

Techniquement, cette règle n’est pas vérifiée par React. En principe, vous pouvez créer un Hook qui n’appelle pas d’autres Hooks. C’est souvent déroutant et limitant, aussi est-il préférable d’éviter cette approche. Cependant, il peut y avoir de rares cas où c’est utile. Par exemple, votre fonction n’appelle pas encore de Hook, mais vous prévoyez d’y ajouter des appels à des Hooks à l’avenir. Il est alors logique d’utiliser le préfixe `use` :


```js {3-4}
// ✅ Correct : un Hook qui utilisera probablement des Hooks par la suite.
function useAuth() {
  // TODO : remplacer cette ligne quand l’authentification sera implémentée :
  // return useContext(Auth);
  return TEST_USER;
}
```

Les composants ne pourront pas l’appeler de manière conditionnelle. Ça deviendra important quand vous ajouterez des appels à des Hooks à l’intérieur. Si vous ne prévoyez pas d’appeler des Hooks dans votre fonction (ni maintenant ni plus tard), alors n’en faites pas un Hook.

</DeepDive>

### Les Hooks personnalisés vous permettent de partager la logique d’état, mais pas l’état lui-même {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

Dans l’exemple précédent, lorsque vous avez activé et désactivé le réseau, les deux composants se sont mis à jour ensemble. Cependant, ne croyez pas qu’une seule variable d’état `isOnline` est partagée entre eux. Regardez ce code :

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Ça fonctionne de la même façon qu’avant la suppression de la duplication :

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

Il s’agit de deux variables d’état et effets totalement indépendants ! Il se trouve qu’ils ont la même valeur au même moment parce que vous les avez synchronisés avec la même donnée extérieure (le fait que le réseau est actif ou non).

Pour mieux illustrer ça, nous allons avoir besoin d’un exemple différent. Examinez ce composant `Form` :

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        Prénom :
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Nom :
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Bonjour, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Il y a de la logique répétée pour chaque champ du formulaire :

1. Il y a un élément d’état (`firstName` et `lastName`).
1. Il y a un gestionnaire de changement (`handleFirstNameChange` et `handleLastNameChange`).
1. Il y a un bout de JSX qui spécifie les attributs `value` et `onChange` pour ce champ.

Vous pouvez extraire la logique dupliquée dans ce Hook personnalisé `useFormInput` :

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        Prénom :
        <input {...firstNameProps} />
      </label>
      <label>
        Nom :
        <input {...lastNameProps} />
      </label>
      <p><b>Bonjour, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js src/useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Notez qu’il ne déclare qu’*une* seule variable d’état appelée `value`.

Pourtant, le composant `Form` appelle `useFormInput` *deux fois :*

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

C’est pourquoi ça revient à déclarer deux variables d’état distinctes !

**Les Hooks personnalisés vous permettent de partager *la logique d’état* et non *l’état lui-même.* Chaque appel à un Hook est complètement indépendant de tous les autres appels au même Hook.** C’est pourquoi les deux bacs à sable ci-dessus sont totalement équivalents. Si vous le souhaitez, revenez en arrière et comparez-les. Le comportement avant et après l’extraction d’un Hook personnalisé est identique.

Lorsque vous avez besoin de partager l’état lui-même entre plusieurs composants, [faites-le plutôt remonter puis transmettez-le](/learn/sharing-state-between-components).

## Transmettre des valeurs réactives entre les Hooks {/*passing-reactive-values-between-hooks*/}

Le code contenu dans vos Hooks personnalisés sera réexécuté à chaque nouveau rendu de votre composant. C’est pourquoi, comme les composants, les Hooks personnalisés [doivent être purs](/learn/keeping-components-pure). Considérez le code des Hooks personnalisés comme une partie du corps de votre composant !

Comme les Hooks personnalisés sont mis à jour au sein du rendu de votre composant, ils reçoivent toujours les props et l’état les plus récents. Pour comprendre ce que ça signifie, prenez cet exemple de salon de discussion. Changez l’URL du serveur ou le salon de discussion :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Sélectionnez le salon de discussion :{' '}
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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('Nouveau message : ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        URL du serveur :
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Bievenue dans le salon {roomId} !</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Une véritable implémentation se connecterait au serveur.
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl doit être une chaîne de caractères. Reçu : ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId doit être une chaîne de caractères. Reçu : ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » depuis ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Déconnexion du salon « ' + roomId + ' » depuis ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Il n’est pas possible d’ajouter un gestionnaire deux fois.');
      }
      if (event !== 'message') {
        throw Error('Seul l’événement "message" est accepté.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Quand vous changez `serverUrl` ou `roomId`, l’effet [« réagit » à vos changements](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) et se re-synchronise. Vous pouvez voir dans les messages de la console que le chat se reconnecte à chaque fois que vous changez les dépendances de votre effet.

Maintenant, déplacez le code de l’effet dans un Hook personnalisé :

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('Nouveau message : ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Ça permet à votre composant `ChatRoom` d’appeler le Hook personnalisé sans se préoccuper de la façon dont il fonctionne en interne.

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        URL du serveur :
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Bienvenue dans le salon {roomId} !</h1>
    </>
  );
}
```

C’est plus simple ainsi ! (Mais ça fait toujours la même chose.)

Remarquez que la logique *réagit toujours* aux changement des props et de l’état. Essayez de modifier l’URL du serveur ou le salon choisi :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        URL du serveur :
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Bienvenue dans le salon {roomId} !</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('Nouveau message : ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl doit être une chaîne de caractères. Reçu : ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected doit être une chaîne de caractères. Reçu : ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connexion au salon "' + roomId + '" depuis ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('mdr');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Déconnexion du salon "' + roomId + '" depuis ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Il n’est pas possible d’ajouter un gestionnaire deux fois.');
      }
      if (event !== 'message') {
        throw Error('Seul l’événement "message" est accepté.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Voyez comme vous récupérez la valeur retournée par un Hook :

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

puis la transmettez à un autre Hook :

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Chaque fois que votre composant `ChatRoom` refait un rendu, il passe les dernières valeurs de `roomId` et `serverUrl` à votre Hook. Ça explique pourquoi votre effet se reconnecte au salon à chaque fois que leurs valeurs sont différentes après un nouveau rendu. (Si vous avez déjà travaillé avec des logiciels de traitement d’audio ou de vidéo, ce type d’enchaînement de Hooks peut vous rappeler l’enchaînement d’effets visuels ou sonores. C’est comme si le résultat en sortie de `useState` était « branché » en entrée de `useChatRoom`.)

### Transmettre des gestionnaires d’événements à des Hooks personnalisés {/*passing-event-handlers-to-custom-hooks*/}

<Wip>

Cette section décrit une **API expérimentale qui n’a pas encore été livrée** dans une version stable de React.

</Wip>

Lorsque vous commencerez à utiliser `useChatRoom` dans davantage de composants, vous souhaiterez peut-être que ces derniers puissent personnaliser son comportement. Par exemple, pour l’instant la logique de traitement quand un message arrive est codée en dur à l’intérieur du Hook :

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('Nouveau message : ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Disons que vous voulez ramener cette logique dans votre composant :

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('Nouveau message : ' + msg);
    }
  });
  // ...
```

Pour que ça fonctionne, modifiez votre Hook personnalisé afin qu’il prenne `onReceiveMessage` comme l’une de ses options :

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ Toutes les dépendances sont déclarées.
}
```

Ça fonctionnera, mais il y a une autre amélioration que vous pouvez apporter quand votre Hook personnalisé accepte des gestionnaires d’événements.

Ajouter une dépendance envers `onReceiveMessage` n’est pas idéal car elle entraînera une reconnexion au salon à chaque réaffichage du composant. [Enrobez ce gestionnaire d’état dans un Événement d’Effet pour le retirer des dépendances](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props) :

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Toutes les dépendances sont déclarées.
}
```

À présent, le salon ne se reconnectera plus à chaque réaffichage du composant `ChatRoom`. Voici une démonstration complète du passage d’un gestionnaire d’événement à un Hook personnalisé avec laquelle vous pouvez jouer :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('Nouveau message: ' + msg);
    }
  });

  return (
    <>
      <label>
        URL du serveur :
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Bienvenue dans le salon {roomId} !</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Une implémentation réelle se connecterait vraiment au serveur.
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl doit être une chaîne de caractères. Reçu : ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId doit être une chaîne de caractères. Reçu : ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connexion au salon "' + roomId + '" depuis ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Déconnexion du salon "' + roomId + '" depuis ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Il n’est pas possible d’ajouter un gestionnaire deux fois.');
      }
      if (event !== 'message') {
        throw Error('Seul l’événement "message" est accepté.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Remarquez que vous n’avez plus besoin de savoir *comment* `useChatRoom` fonctionne pour pouvoir l’utiliser. Vous pourriez l’ajouter à n’importe quel autre composant, lui passer n’importe quelles autres options, il fonctionnerait de la même manière. C’est là toute la puissance des Hooks personnalisés.

## Quand utiliser des Hooks personnalisés ? {/*when-to-use-custom-hooks*/}

Il n’est pas nécessaire d’extraire un Hook personnalisé pour chaque petit bout de code dupliqué. Certaines duplications sont acceptables. Par exemple, extraire un Hook `useFormInput` pour enrober un seul appel de `useState` comme précédemment est probablement inutile.

Cependant, à chaque fois que vous écrivez un Effet, demandez-vous s’il ne serait pas plus clair de l’enrober également dans un Hook personnalisé. [Vous ne devriez pas avoir si souvent besoin d’Effets](/learn/you-might-not-need-an-effect), alors si vous en écrivez un, ça signifie que vous devez « sortir » de React pour vous synchroniser avec un système extérieur ou pour faire une chose pour laquelle React n’a pas d’API intégrée. L’enrober dans un Hook personnalisé permet de communiquer précisément votre intention et la manière dont les flux de données circulent à travers lui.

Prenons l’exemple d’un composant `ShippingForm` qui affiche deux listes déroulantes : l’une présente la liste des villes, l’autre affiche la liste des quartiers de la ville choisie. Vous pourriez démarrer avec un code ressemblant à ceci :

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // Cet effet récupère les villes d’un pays.
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // Cet effet récupère les quartiers de la ville choisie.
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

Bien que ce code soit assez répétitif, [il est légitime de garder ces effets séparés les uns des autres](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things). Ils synchronisent deux choses différentes, vous ne devez donc pas les fusionner en un seul Effet. Vous pouvez plutôt simplifier le composant `ShippingForm` ci-dessus en sortant la logique commune entre eux dans votre propre Hook `useData` :

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

Vous pouvez maintenant remplacer les deux Effets du composant `ShippingForm` par des appels à `useData` :

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

Extraire un Hook personnalisé rend le flux des données explicite. Vous renseignez l’`url`, et vous obtenez les `data` en retour. En « masquant » votre Effet dans `useData`, vous empêchez également qu’une autre personne travaillant sur le composant `ShippingForm` y ajoute [des dépendances inutiles](/learn/removing-effect-dependencies). Avec le temps, la plupart des Effets de votre appli se trouveront dans des Hooks personnalisés.

<DeepDive>

#### Réservez vos Hooks personnalisés à des cas d’usage concrets de haut niveau {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

Commencez par choisir le nom de votre Hook personnalisé. Si vous avez du mal à choisir un nom clair, ça peut signifier que votre effet est trop lié au reste de la logique de votre composant, et qu’il n’est pas encore prêt à être extrait.

Dans l’idéal, le nom de votre Hook personnalisé doit être suffisamment clair pour qu’une personne qui n’écrit pas souvent du code puisse deviner ce que fait votre Hook, ce qu’il prend en arguments et ce qu’il renvoie :

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

Lorsque vous vous synchronisez avec un système extérieur, le nom de votre Hook personnalisé peut être plus technique et utiliser un jargon spécifique à ce système. C’est une bonne chose tant que ça reste clair pour une personne qui a l’habitude de ce système :

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**Les Hooks personnalisés doivent être concentrés sur des cas d’usage concrets de haut niveau.** Évitez de recourir à des Hooks personnalisés de « cycle de vie » qui agissent comme des alternatives et des enrobages de confort pour l’API `useEffect` elle-même :

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

Par exemple, ce Hook `useMount` essaie de s’assurer que du code ne s’exécute qu’au « montage » :

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 À éviter : utiliser des Hooks personnalisés de « cycle de vie ».
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 À éviter : créer des Hooks personnalisés de « cycle de vie ».
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 Le Hook React useEffect a une dépendance manquante : 'fn'
}
```

**Les Hooks personnalisés de « cycle de vie » comme `useMount` ne s’intègrent pas bien dans le paradigme de React.** Par exemple, ce code contient une erreur (il ne « réagit » pas aux changements de `roomId` ou `serverUrl`), mais le *linter* ne vous avertira pas à ce sujet car il ne vérifie que les appels directs à `useEffect`. Il ne connaît rien de votre Hook.

Si vous écrivez un effet, commencez par utiliser directement l’API de React :

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Correct : deux effets bruts séparés par leur finalité.

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

Ensuite, vous pouvez (mais ce n’est pas obligatoire) extraire des Hooks personnalisés pour différents cas d’usage de haut niveau :

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Excellent : des Hooks personnalisés nommés selon leur fonction.
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**Un bon Hook personnalisé rend le code appelé plus déclaratif en limitant ce qu’il fait.** Par exemple, `useChatRoom(options)` ne peut que se connecter à un salon de discussion, tandis que `useImpressionLog(eventName, extraData)` ne peut que contribuer aux journaux analytiques. Si l’API de votre Hook personnalisé ne limite pas les cas d’usage en étant trop abstraite, elle risque d’introduire à long terme plus de problèmes qu’elle n’en résoudra.

</DeepDive>

### Les Hooks personnalisés vous aident à migrer vers de meilleures approches {/*custom-hooks-help-you-migrate-to-better-patterns*/}

Les Effets sont une [« échappatoire »](/learn/escape-hatches) : vous les utilisez quand vous avez besoin de « sortir » de React et quand il n’y a pas de meilleure solution intégrée pour votre cas d’usage. Avec le temps, le but de l’équipe de React est de réduire au maximum le nombre d’Effets dans votre appli en fournissant des solutions plus dédiées à des problèmes plus spécifiques. Enrober vos Effets dans des Hooks personnalisés facilite la mise à jour de votre code lorsque ces solutions deviendront disponibles.

Revenons à cet exemple :

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Connecté' : '❌ Déconnecté'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progression enregistrée');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Enregistrer la progression' : 'Reconnexion...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Dans l’exemple ci-dessus, `useOnlineStatus` est implémenté avec le duo [`useState`](/reference/react/useState) et [`useEffect`](/reference/react/useEffect). Cependant, ce n’est pas la meilleure solution possible. Elle ne tient pas compte d’un certain nombre de cas limites. Par exemple, elle suppose que lorsque le composant est monté, `isOnline` est déjà à `true`, mais ça peut être faux si le réseau est d’entrée de jeu hors-ligne. Vous pouvez utiliser l’API du navigateur [`navigator.onLine`](https://developer.mozilla.org/fr/docs/Web/API/Navigator/onLine) pour vérifier ça, mais l’utiliser directement ne marchera pas sur le serveur pour générer le HTML initial. En bref, ce code peut être amélioré.

Heureusement, React 18 inclut une API dédiée appelée [`useSyncExternalStore`](/reference/react/useSyncExternalStore) qui se charge de tous ces problèmes pour vous. Voici votre Hook personnalisé `useOnlineStatus` réécrit pour en tirer avantage :

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Connecté' : '❌ Déconnecté'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progression enregistrée');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Enregistrer la progression' : 'Reconnexion...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // Comment récupérer la valeur sur le client.
    () => true // Comment récupérer la valeur sur le serveur.
  );
}

```

</Sandpack>

Remarquez que vous **n’avez pas eu besoin de modifier les composants** pour faire cette migration :

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

C’est une raison pour laquelle il est souvent utile d’enrober des effets dans des Hooks personnalisés :

1. Vous rendez le flux de données vers et depuis vos effets très explicite.
2. Vous permettez à vos composants de se concentrer sur l’intention plutôt que sur l’implémentation exacte de vos effets.
3. Lorsque React ajoute de nouvelles fonctionnalités, vous pouvez retirer ces effets sans changer le code d’aucun de vos composants.

À la manière d’un [Design System](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), vous pourriez trouver utile de commencer à extraire les idiomes communs des composants de votre appli dans des Hooks personnalisés. Ainsi, le code de vos composants restera centré sur l’intention et vous éviterez la plupart du temps d’utiliser des effets bruts. De nombreux Hooks personnalisés de qualité sont maintenus par la communauté React.

<DeepDive>

#### React fournira-t-il une solution intégrée pour le chargement de données ? {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

Nous travaillons encore sur les détails, mais nous pensons qu’à l’avenir, vous pourrez charger des données comme ceci :

```js {1,4,6}
import { use } from 'react'; // Pas encore disponible !

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

Si vous utilisez des Hooks personnalisés comme le `useData` vu plus haut dans votre appli, la migration vers l’approche finalement recommandée nécessitera moins de changements que si vous écrivez manuellement des effets bruts dans chaque composant. Cependant, l’ancienne approche continuera de bien fonctionner, donc si vous vous sentez à l’aise en écrivant des effets bruts, vous pouvez continuer ainsi.

</DeepDive>

### Il y a plus d’une façon de faire {/*there-is-more-than-one-way-to-do-it*/}

Supposons que vous souhaitiez implémenter une animation de fondu enchaîné *en partant de zéro* avec l’API [`requestAnimationFrame`](https://developer.mozilla.org/fr/docs/Web/API/window/requestAnimationFrame) du navigateur. Vous pouvez commencer par un Effet qui initialise une boucle d’animation. À chaque étape de l’animation, vous pourriez changer l’opacité du nœud du DOM que vous aurez [conservé dans une ref](/learn/manipulating-the-dom-with-refs) jusqu’à ce qu’elle atteigne `1`. Votre code pourrait commencer ainsi :

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // Nous avons encore des étapes à dessiner.
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Bienvenue
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Supprimer' : 'Afficher'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Pour rendre le composant plus lisible, vous pourriez extraire la logique dans un Hook personnalisé `useFadeIn` :

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Bienvenue
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Supprimer' : 'Afficher'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // Nous avons encore des étapes à dessiner.
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Vous pouvez conserver le code de `useFadeIn` tel quel, mais vous pouvez le remanier plus avant. Par exemple, vous pourriez extraire la logique de mise en place de la boucle d’animation de `useFadeIn` dans un Hook personnalisé `useAnimationLoop` :

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Bienvenue
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Supprimer' : 'Afficher'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Cependant, vous n’avez pas *besoin* de faire ça. Comme pour les fonctions ordinaires, c’est finalement à vous de définir les frontières entre les différentes parties de votre code. Vous pouvez également adopter une approche tout à fait différente. Au lieu de conserver votre logique dans un effet, vous pouvez déplacer la plupart de la logique impérative dans une [classe](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes) JavaScript :

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Bienvenue
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Supprimer' : 'Afficher'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // Nous avons encore des étapes à dessiner.
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Les Effets permettent à React de se connecter à des systèmes extérieurs. Plus la coordination entre les Effets est nécessaire (par exemple pour enchaîner des animations multiples), plus il devient pertinent de sortir *complètement* cette logique des Effets et des Hooks, comme dans le bac à sable ci-dessus. Le code extrait *devient* alors le « système extérieur ». Ça permet à vos Effets de rester simples car ils n’auront qu’à envoyer des messages au système que vous avez sorti de React.

Les exemples ci-dessus supposent que la logique de fondu enchaîné soit écrite en JavaScript. Cependant, cette animation particulière est à la fois plus simple et beaucoup plus efficace lorsqu’elle est implémentée comme une simple [animation CSS](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Animations/Using_CSS_animations) :

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
      Bienvenue
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Supprimer' : 'Afficher'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css src/styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css src/welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

Parfois, vous n’avez même pas besoin d’un Hook !

<Recap>

- Les Hooks personnalisés vous permettent de partager la logique entre les composants.
- Le nom des Hooks personnalisés doit commencer par `use` suivi d’une majuscule.
- Les Hooks personnalisés ne partagent que la logique d’état et non l’état lui-même.
- Vous pouvez passer des valeurs réactives d’un Hook à un autre, et elles restent à jour.
- Tous les Hooks sont réexécutés à chaque rendu de votre composant.
- Le code de vos Hooks personnalisés doit être pur, comme le code de votre composant.
- Enrobez les gestionnaires d’événements reçus par les Hooks personnalisés dans des Événéments d’Effet.
- Ne créez pas des Hooks personnalisés comme `useMount`. Veillez à ce que leur objectif soit spécifique.
- C’est à vous de décider comment et où définir les frontières de votre code.

</Recap>

<Challenges>

#### Extraire un Hook `useCounter` {/*extract-a-usecounter-hook*/}

Ce composant utilise une variable d’état et un effet pour afficher un nombre qui s’incrémente à chaque seconde. Extrayez cette logique dans un Hook personnalisé appelé `useCounter`. Votre but est de faire que l’implémentation du composant `Counter` ressemble exactement à ça :

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Secondes écoulées : {count}</h1>;
}
```

Vous devrez écrire votre Hook personnalisé dans `useCounter.js` et l’importer dans le fichier `App.js`.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Secondes écoulées : {count}</h1>;
}
```

```js src/useCounter.js
// Écrivez votre Hook personnalisé dans ce fichier !
```

</Sandpack>

<Solution>

Votre code doit ressembler à ceci :

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Secondes écoulées : {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

Remarquez que `App.js` n’a plus besoin d’importer `useState` ni `useEffect` désormais.

</Solution>

#### Rendez le délai du compteur configurable {/*make-the-counter-delay-configurable*/}

Dans cet exemple, il y a une variable d’état `delay` qui est contrôlée par un curseur, mais sa valeur n’est pas utilisée. Passez la valeur de `delay` à votre Hook personnalisé, et changez le Hook `useCounter` pour utiliser le `delay` passé plutôt que les `1000` ms codées en dur.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Durée d’un tick : {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks : {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

Passez le `delay` à votre Hook avec `useCounter(delay)`. À l’intérieur de votre Hook, utilisez ensuite `delay` à la place de la valeur `1000` codée en dur. Vous devrez ajouter `delay` aux dépendances de votre effet. Ça garantira qu’un changement de `delay` réinitialisera l’intervalle.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Durée d’un tick : {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### Extrayez `useInterval` de `useCounter` {/*extract-useinterval-out-of-usecounter*/}

Pour le moment, votre Hook `useCounter` fait deux choses. Il définit un intervalle et incrémente une variable d’état à chaque tick de l’intervalle. Séparez la logique qui définit l’intervalle dans un Hook distinct appelé `useInterval`. Il devra prendre deux paramètres : la fonction de rappel `onTick` et le `delay`. Après ce changement, votre implémentation de `useCounter` devrait ressembler à ceci :

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

Écrivez `useInterval` dans le fichier `useInterval.js` et importez-le dans le fichier `useCounter.js`.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Secondes écoulées : {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js src/useInterval.js
// Écrivez votre Hook ici !
```

</Sandpack>

<Solution>

La logique à l’intérieur de `useInterval` doit initialiser et effacer l’intervalle. Elle ne doit rien faire de plus.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Secondes écoulées : {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

Notez que cette solution pose un petit problème que vous résoudrez au prochain défi.

</Solution>

#### Corrigez la réinitialisation indue de l’intervalle {/*fix-a-resetting-interval*/}

Dans cet exemple, il y a *deux* intervalles séparés.

Le composant `App` appelle `useCounter`, qui appelle `useInterval` pour mettre à jour le compteur à chaque seconde. Mais le composant `App` appelle *aussi* `useInterval` pour mettre à jour aléatoirement la couleur de l’arrière-plan de la page toutes les deux secondes.

Curieusement, la fonction de rappel qui met à jour l’arrière-plan la page n’est jamais exécutée. Ajoutez quelques messages en console dans `useInterval` :

```js {2,5}
  useEffect(() => {
    console.log('✅ Définition d’un intervalle avec un délai de ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Effacement d’un intervalle avec un délai de ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

Les messages correspondent-ils à vos attentes ? Si certains Effets semblent se resynchroniser inutilement, pouvez-vous deviner quelle dépendance est à l’origine de ce comportement ? Existe-t-il un moyen de [supprimer cette dépendance](/learn/removing-effect-dependencies) de votre Effet ?

Une fois le problème résolu, l’arrière-plan de la page devrait se mettre à jour toutes les deux secondes.

<Hint>

Il semble que votre Hook `useInterval` accepte un écouteur d’événements comme paramètre. Pouvez-vous imaginer un moyen d’enrober cet écouteur d’événements afin qu’il ne soit pas une dépendance de votre effet ?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Secondes écoulées : {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

À l’intérieur de `useInterval`, enrobez la fonction de rappel du tick dans un Événement d’Effet, comme vous l’avez fait [plus tôt dans cette page](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks).

Ça vous permettra d’omettre `onTick` des dépendances de votre effet. L’effet ne se resynchronisera pas à chaque réaffichage du composant de sorte que l’intervalle de changement de la couleur de l’arrière-plan ne sera pas réinitalisé toutes les secondes avant d’avoir la possibilité de se déclencher.

Avec ce changement, les deux intervalles fonctionnent comme attendu et n’interfèrent pas l’un avec l’autre :

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### Implémentez un mouvement échelonné {/*implement-a-staggering-movement*/}

Dans cet exemple, le Hook `usePointerPosition()` suit la position du curseur. Essayez de déplacer votre curseur ou votre doigt dans la zone de prévisualisation et voyez le point rouge suivre votre mouvement. Sa position est enregistrée dans la variable `pos1`.

En réalité, il y a cinq (!) points rouges différents qui sont dessinés. Vous ne les voyez pas pour le moment car ils apparaissent tous à la même position. C’est ça que vous devez corriger. Vous devez implémenter au lieu de ça un mouvement « échelonné » : chaque point doit « suivre » la trajectoire du point précédent. Par exemple, si vous déplacez rapidement votre curseur, le premier point doit le suivre immédiatement, le deuxième point doit suivre le premier point avec un léger décalage, le troisième point doit suivre le deuxième point, et ainsi de suite.

Vous devez implémenter le Hook personnalisé `useDelayedValue`. Son implémentation actuelle retourne la `value` qui lui a été donnée. Au lieu de ça, vous souhaitez retourner la valeur qu’elle avait `delay` millisecondes plus tôt. Vous aurez peut-être besoin d’un état et d’un Effet pour y arriver.

Une fois que vous aurez implémenté `useDelayedValue`, vous devriez voir les points se déplacer les uns après les autres.

<Hint>

Vous aurez besoin de stocker `delayedValue` comme variable d’état à l’intérieur de votre Hook. Quand la `value` change, vous devrez exécuter un Effet. Cet Effet devra mettre à jour `delayedValue` après le `delay`. Recourir à `setTimeout` pourrait s’avérer utile.

Est-ce que cet effet a besoin de nettoyage ? Pourquoi (ou pourquoi non) ?

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO : implémentez ce Hook.
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

Voici une version fonctionnelle. Vous conservez `delayedValue` comme variable d’état. Quand `value` change, votre effet planifie un compte à rebours pour mettre à jour `delayedValue`. C’est pourquoi `delayedValue` est toujours « en retard » par rapport à `value`.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```css
body { min-height: 300px; }
```

</Sandpack>

Notez que cet effet n’a *pas besoin* de nettoyage. Si vous appelez `clearTimeout` dans la fonction de nettoyage, alors à chaque changement de `value`, ça réinitialisera le compte à rebours déjà programmé. Pour obtenir un mouvement continu, il faut que tous les comptes à rebours arrivent à leur terme et déclenchent leur mise à jour associée.

</Solution>

</Challenges>
