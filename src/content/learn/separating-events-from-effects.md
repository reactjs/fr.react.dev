---
title: 'Séparer les événements des Effets'
---

<Intro>

Les gestionnaires d’événements ne se réexécutent que lorsque vous réalisez à nouveau la même interaction. Contrairement aux gestionnaires d’événements, les Effets se resynchronisent si une valeur qu’ils lisent, comme une prop ou une variable d’état, a changé depuis le précédent rendu. Parfois, vous souhaitez avoir un comportement hybride : un Effet qui s’exécute à nouveau en réaction à certaines valeurs, mais pas à d’autres. Cette page va vous apprendre à le faire.

</Intro>

<YouWillLearn>

- Comment choisir entre un gestionnaire d’événement et un Effet
- Pourquoi les Effets sont réactifs alors que les gestionnaires d’événements ne le sont pas
- Que faire quand vous voulez qu’une partie du code de votre Effet ne soit pas réactive
- Ce que sont les Événements d’Effets, et comment les extraire de vos Effets
- Comment lire les dernières props et variables d'état à jour depuis vos Effets en utilisant des Événements d’Effets

</YouWillLearn>

## Choisir entre les gestionnaires d’événements et les Effets {/*choosing-between-event-handlers-and-effects*/}

Tout d’abord, récapitulons la différence entre les gestionnaires d’événements et les Effets.

Imaginons que vous implémentiez un composant de salon de discussion. Vos besoins sont les suivants :

1. Votre composant doit se connecter automatiquement au salon de discussion sélectionné.
1. Quand vous cliquez sur le bouton « Envoyer », il doit envoyer un message dans la discussion.

Supposons que vous ayez déjà implémenté le code nécessaire pour ça, mais que vous ne sachiez pas trop où le mettre. Devriez-vous utiliser des gestionnaires d’événements ou des Effets ? À chaque fois que vous devez répondre à cette question, réfléchissez [*à la raison* pour laquelle le code doit être exécuté](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events).

### Les gestionnaires d’événements réagissent à des interactions spécifiques {/*event-handlers-run-in-response-to-specific-interactions*/}

Du point de vue de l’utilisateur, l’envoi d’un message doit se faire *parce qu*’il a cliqué sur le bouton « Envoyer ». L’utilisateur sera plutôt mécontent si vous envoyez son message à un autre moment ou pour une autre raison. C’est pourquoi l’envoi d’un message doit être un gestionnaire d’événement. Les gestionnaires d’événements vous permettent de gérer des interactions spécifiques :

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Envoyer</button>
    </>
  );
}
```

Avec un gestionnaire d’événement, vous pouvez être sûr·e que `sendMessage(message)` ne sera exécuté *que* si l’utilisateur presse le bouton.

### Les Effets s’exécutent à chaque fois qu’une synchronisation est nécessaire {/*effects-run-whenever-synchronization-is-needed*/}

Rappelez-vous que vous devez également veiller à ce que le composant reste connecté au salon de discussion. Où va ce code ?

La *raison* pour laquelle ce code s'exécute n’est pas liée à une interaction particulière. Peu importe pourquoi ou comment l’utilisateur a rejoint le salon de discussion. Maintenant qu’il le voit et peut interagir avec lui, le composant doit rester connecté au serveur sélectionné. Même si ce composant est l’écran initial de votre appli et que l’utilisateur n’a encore rien fait, vous devrez *tout de même* vous connecter. C’est pourquoi ce traitement a sa place dans un Effet :

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Avec ce code, vous garantissez qu’il y a toujours une connexion active avec le serveur sélectionné, *indépendamment* des interactions de l’utilisateur. Que l’utilisateur ait ouvert votre appli, sélectionné un autre salon ou navigué vers un autre écran avant d’en revenir, votre Effet garantit que le composant *reste synchronisé* avec le salon actuellement sélectionné, et [se reconnectera chaque fois que nécessaire](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once).

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Bievenue dans le salon {roomId} !</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Envoyer</button>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choisissez le salon de discussion :{' '}
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
        {show ? 'Fermer la discussion' : 'Ouvrir la discussion'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function sendMessage(message) {
  console.log('🔵 Vous avez envoyé : ' + message);
}

export function createConnection(serverUrl, roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » depuis ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » depuis ' + serverUrl);
    }
  };
}
```

```css
input, select { margin-right: 20px; }
```

</Sandpack>

## Valeurs réactives et logique réactive {/*reactive-values-and-reactive-logic*/}

Intuitivement, vous pourriez penser que les gestionnaires d’événements sont toujours déclenchés « manuellement », par exemple en cliquant sur un bouton. Les Effets, quant à eux, sont « automatiques » : ils sont exécutés et réexécutés aussi souvent que nécessaire pour rester synchronisés.

Il y a une façon plus précise de voir les choses.

Les props, l’état et les variables déclarés au sein de votre composant sont appelés <CodeStep step={2}>valeurs réactives</CodeStep>. Dans cet exemple, `serverUrl` n’est pas une valeur réactive, contrairement à `roomId` et `message`. Ces deux-là participent au flux de données du rendu :

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

Les valeurs réactives comme celles-ci peuvent changer à la suite d’un nouveau rendu. Par exemple, l’utilisateur peut éditer le `message` ou choisir un `roomId` différent depuis une liste déroulante. Les gestionnaires d’événements et les Effets réagissent différemment à ces changements :

- **La logique au sein des gestionnaires d’événements *n’est pas réactive*.** Elle ne s’exécutera pas à nouveau à moins que l’utilisateur ne répète l'interaction (par exemple un clic).  Les gestionnaires d'événements peuvent lire les valeurs réactives sans « réagir » à leurs modifications.
- **La logique au sein des Effets est *réactive*.** Si votre Effet lit une valeur réactive, [vous devez la spécifier en tant que dépendance](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values). Par la suite, si un nouveau rendu entraîne un changement de cette valeur, React réexécutera la logique de votre Effet avec la nouvelle valeur.

Reprenons l’exemple précédent pour illustrer cette différence.

### La logique à l’intérieur des gestionnaires d’événements n’est pas réactive {/*logic-inside-event-handlers-is-not-reactive*/}

Regardez cette ligne de code. Cette logique doit-elle être réactive ou non ?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

Du point de vue de l’utilisateur, **un changement de `message` ne signifie _pas_ qu’il souhaite envoyer un message**. Ça signifie seulement que l’utilisateur est en train de taper. En d’autres termes, la logique qui envoie un message ne doit pas être réactive. Elle ne doit pas s’exécuter à nouveau simplement parce que la <CodeStep step={2}>valeur réactive</CodeStep> a changé. C’est pourquoi elle a sa place dans le gestionnaire d’événement :

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

Les gestionnaires d’événements ne sont pas réactifs, de sorte que `sendMessage(message)` ne sera exécuté que lorsque l’utilisateur cliquera sur le bouton Envoyer.

### La logique à l’intérieur des Effets est réactive {/*logic-inside-effects-is-reactive*/}

Maintenant, revenons à ces lignes :

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

Du point de vue de l’utilisateur, **un changement de `roomId` *signifie bien* qu’il veut se connecter à un salon différent**. En d’autres termes, la logique de connexion à un salon doit être réactive. Vous *voulez* que ces lignes de code « suivent » la <CodeStep step={2}>valeur réactive</CodeStep>, et s’exécutent à nouveau si la valeur change. C’est pourquoi elle a sa place dans un Effet :

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Les Effets sont réactifs, donc `createConnection(serverUrl, roomId)` et `connection.connect()` s’exécuteront pour chaque changement de valeur de `roomId`. Votre Effet garde la connexion au chat synchronisée avec le salon actuellement sélectionné.

## Extraire la logique non réactive des Effets {/*extracting-non-reactive-logic-out-of-effects*/}

Les choses deviennent tout de suite plus compliquées lorsque vous souhaitez mélanger une logique réactive avec une logique non réactive.

Par exemple, imaginez que vous souhaitiez afficher une notification quand l’utilisateur se connecte au salon. Vous lisez le thème courant (sombre ou clair) depuis les props de façon à pouvoir afficher la notification en utilisant la bonne couleur :

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connecté·e !', theme);
    });
    connection.connect();
    // ...
```

Cependant, `theme` est une valeur réactive (elle peut changer à la suite d’un nouveau rendu), et [chaque valeur réactive lue par un Effet doit être déclarée dans ses dépendances](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency). Vous devez maintenant spécifier `theme` comme une dépendance de votre Effet :

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connecté·e !', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ Toutes les dépendances sont déclarées
  // ...
```

Jouez avec cet exemple et voyez si vous identifiez un problème d’expérience utilisateur :

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
      showNotification('Connecté·e !', theme);
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
        Choisissez le salon de discussion :{' '}
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

Quand `roomId` change, le salon se reconnecte comme prévu. Mais vu que `theme` est également une dépendance, le salon se reconnecte *aussi* à chaque fois que vous basculez entre le thème sombre et le thème clair. Ce n’est pas top !

En d’autres termes, vous ne voulez *pas* que cette ligne soit réactive, en dépit du fait qu'elle se trouve dans un Effet (qui, lui, est réactif) :

```js
      // ...
      showNotification('Connecté·e !', theme);
      // ...
```

Vous devez trouver une façon de séparer cette logique non réactive de l’Effet réactif qui l’entoure.

### Déclarer un Événement d’Effet {/*declaring-an-effect-event*/}

<Wip>

Cette section décrit une **API expérimentale : elle n’a donc pas encore été livrée** dans une version stable de React.

</Wip>

Utilisez un Hook spécial appelé [`useEffectEvent`](/reference/react/experimental_useEffectEvent) pour extraire cette logique non réactive de votre Effet :

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connecté·e !', theme);
  });
  // ...
```

Ici, `onConnected` est ce qu'on appelle un *Événement d’Effet.* Il fait partie de la logique de votre Effet, mais il se comporte davantage comme un gestionnaire d’événement. La logique à l’intérieur n’est pas réactive, et « voit » toujours la dernière valeur à jour de vos props et états.

Vous pouvez désormais appeler l’Événement d’Effet `onConnected` depuis votre Effet :

```js {2-4,9,13}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connecté·e !', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Toutes les dépendances sont déclarées
  // ...
```

Ça résout le problème. Remarquez que vous avez dû *retirer* `onConnected` de la liste des dépendances de votre Effet. **Les Événements d’Effets ne sont pas réactifs et ne doivent pas figurer dans vos dépendances.**

Vérifiez que le nouveau comportement fonctionne comme attendu :

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connecté·e !', theme);
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

Vous pouvez considérer les Événements d’Effets comme étant très similaires aux gestionnaires d’événements. La différence majeure tient à ce que les gestionnaires d’événements réagissent aux interactions de l’utilisateur, alors que les Événements d’Effets sont déclenchés depuis vos Effets. Les Événements d’Effets vous permettent de « briser la chaîne » entre la réactivité des Effets et le code qui ne doit pas être réactif.

### Lire les dernières props et états à jour avec des Événements d’Effets {/*reading-latest-props-and-state-with-effect-events*/}

<Wip>

Cette section décrit une **API expérimentale : elle n’a donc pas encore été livrée** dans une version stable de React.

</Wip>

Les Événements d’Effets vous permettent de corriger de nombreuses situations où vous seriez tenté·e de réduire le *linter* de dépendances au silence.

Par exemple, disons que vous avez un Effet qui enregistre les visites de la page :

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

Plus tard, vous ajoutez plusieurs routes à votre site. Votre composant `Page` reçoit désormais une prop `url` avec le chemin courant. Vous voulez utiliser `url` dans votre appel à `logVisit`, mais le *linter* de dépendances n’est pas content :

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 Le Hook React useEffect a une dépendance manquante : 'url'.
  // ...
}
```

Réfléchissez à ce que vous voulez que le code fasse. Vous *souhaitez* enregistrer une visite différente pour des URL différentes, puisque chaque URL représente une page différente. En d’autres termes, cet appel à `logVisit` *doit* être réactif par rapport à `url`. C’est pourquoi, dans ce cas, il est logique de suivre la recommandation du *linter* et d’ajouter `url` comme dépendance :

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ Toutes les dépendances sont déclarées
  // ...
}
```

Supposons maintenant que vous vouliez inclure le nombre d’articles du panier d’achat à chaque visite :

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 Le Hook React useEffect a une dépendance manquante : 'numberOfItems'
  // ...
}
```

Vous avez utilisé `numberOfItems` dans votre Effet, du coup le *linter* vous demande de l’ajouter comme dépendance. Cependant, vous ne voulez *pas* que l’appel à `logVisit` soit réactif par rapport à `numberOfItems`. Si l’utilisateur place quelque chose dans le panier d’achat et que `numberOfItems` change, ça *ne signifie pas* que l’utilisateur a visité la page à nouveau. En d’autres termes, *visiter la page* est, en quelque sorte, un « événement ». Il se produit à un moment précis.

Séparez le code en deux parties :

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Toutes les dépendances sont déclarées
  // ...
}
```

Ici, `onVisit` est un Événement d’Effet. Le code à l’intérieur n’est pas réactif. C'est pourquoi vous pouvez utiliser `numberOfItems` (ou n’importe quelle valeur réactive !) sans craindre que le code environnant ne soit réexécuté après un changement.

En revanche, l’Effet lui-même reste réactif. Le code de l’Effet utilise la prop `url`, donc l’Effet sera réexécuté après chaque changement de `url` que causerait un nouveau rendu. L'Effet appellera à son tour l’Événement d’Effet `onVisit`.

Par conséquent, vous appellerez `logVisit` pour chaque changement d’`url` et lirez toujours la dernière valeur de `numberOfItems`. Cependant, si `numberOfItems` change à son tour, ça ne réexécutera aucun code.

<Note>

Vous vous demandez peut-être si vous pouvez appeler `onVisit()` sans paramètres, pour ensuite lire l’`url` à l’intérieur :

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

Ça fonctionnerait, mais il est préférable de passer cette `url` explicitement à l’Événement d’Effet. **En passant `url` comme paramètre à votre Événement d’Effet, vous dites que la visite d’une page avec une `url` différente constitue un « événement » d’un point de vue de l’utilisateur.** Le `visitedUrl` fait *partie* de l’« événement » qui s’est produit :

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Puisque votre Événement d’Effet « demande » explicitement le `visitedUrl`, vous ne pouvez plus supprimer accidentellement `url` des dépendances de votre Effet. Si vous supprimiez la dépendance `url` (ce qui ferait que des visites de plusieurs pages distinctes seraient comptées comme une seule visite), le *linter* vous en avertirait. Vous voulez que `onVisit` soit réactif par rapport à `url`, donc plutôt que lire `url` à l’intérieur (où il ne serait pas réactif), vous le transmettez *depuis* votre Effet.

C’est particulièrement critique si votre Effet contient de la logique asynchrone :

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // On retarde l’enregistrement des visites
  }, [url]);
```

Ici, `url` à l’intérieur de `onVisit` correspond à la *dernière* `url` (qui pourrait avoir déjà changé), alors que `visitedUrl` correspond à l’`url` qui a originellement déclenché l’exécution de l’Effet (et donc l’appel à la fonction `onVisit`).

</Note>

<DeepDive>

#### Est-il acceptable de plutôt mettre le *linter* de dépendances en sourdine ? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

Dans les bases de code existantes, vous risquer de tomber sur des désactivations de cette règle du *linter*, comme ci-dessous :

```js {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Évitez de mettre le *linter* en sourdine comme ça :
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

Dès que `useEffectEvent` sera devenu une partie stable de React, nous recommanderons de **ne jamais réduire le *linter* au silence**.

Désactiver localement cette règle du *linter* présente un inconvénient majeur : vous empêchez désormais React de vous avertir quand votre Effet doit « réagir » à une nouvelle dépendance réactive que vous avez introduite dans votre code. Dans l’exemple précédent, vous avez ajouté `url` aux dépendances *parce que* React vous l’a rappelé. Vous n’aurez plus de tels rappels pour vos prochaines modifications de cet Effet si vous désactivez le *linter*. Ça entraîne des bugs.

Voici un exemple d’un bug déroutant causé par un *linter* en sourdine. Dans cet exemple la fonction `handleMove` est supposée lire la valeur actuelle de la variable d’état `canMove` afin de décider si le point doit suivre le curseur. Cependant, `canMove` est toujours à `true` à l’intérieur de `handleMove`.

Voyez-vous pourquoi ?

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        Le point peut se déplacer
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>


Le problème avec ce code vient de la mise en sourdine du *linter* de dépendances. Si vous lui redonnez la parole, vous constaterez que cet Effet doit dépendre de la fonction `handleMove`. C’est logique : `handleMove` est déclarée au sein du composant, ce qui en fait une valeur réactive. Toute valeur réactive doit être spécifiée en tant que dépendance, sans quoi elle pourrait devenir obsolète par la suite !

L’auteur du code d’origine a « menti » à React en disant que l’Effet ne dépend (`[]`) d’aucune valeur réactive. C'est pourquoi React n’a pas resynchronisé l’Effet après que `canMove` a changé (et `handleMove` avec elle). React n’ayant pas resynchronisé l’Effet, la fonction `handleMove` attachée en tant qu’écouteur d'événement est celle créée au moment du rendu initial. À l'époque `canMove` valait `true`, c’est pourquoi la fonction `handleMove` du rendu initial verra toujours cette valeur-ci.

**Si vous écoutez toujours le *linter*, vous n'aurez jamais de problèmes de valeurs obsolètes.**

Avec `useEffectEvent`, il est inutile de « mentir » au *linter* et le code fonctionne comme prévu :

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
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        Le point peut se déplacer
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Ça ne signifie pas que `useEffectEvent` soit *toujours* la solution adaptée. Dans le bac à sable ci-dessus, vous ne vouliez pas que le code de l’Effet soit réactif par rapport à `canMove`. C’est pourquoi il était logique d’extraire un Événement d’Effet.

Lisez [Alléger les dépendances des Effets](/learn/removing-effect-dependencies) pour explorer d’autres alternatives correctes à la mise en sourdine du *linter*.

</DeepDive>

### Limitations des Événements d'Effets {/*limitations-of-effect-events*/}

<Wip>

Cette section décrit une **API expérimentale : elle n'a donc pas encore été livrée** dans une version stable de React.

</Wip>

Les Événements d’Effets sont très limités dans leur utilisation :

* **Ne les appelez qu’à l’intérieur des Effets.**
* **Ne les transmettez jamais à d’autres composants ou Hooks.**

Par exemple, ne déclarez pas et ne transmettez pas un Événement d’Effet ainsi :

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 À éviter : transmettre des Événements d’Effets

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // Il est nécessaire de déclarer "callback" dans les dépendances
}
```

Au lieu de ça, déclarez toujours les Événements d’Effets juste à côté des Effets qui les utilisent :

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ Correct : appelé uniquement à l’intérieur d’un Effet
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // Il est inutile de spécifier "onTick" (un Événement d’Effet) comme dépendance
}
```

Les Événements d’Effets sont des « parties » non réactives du code de votre Effet. Ils devraient être à côté des Effets qui les utilisent.

<Recap>

- Les gestionnaires d’événements réagissent à des interactions spécifiques.
- Les Effets sont exécutés à chaque fois qu’une synchronisation est nécessaire.
- La logique au sein des gestionnaires d’événements n’est pas réactive.
- La logique contenue dans les Effets est réactive.
- Vous pouvez déplacer de la logique non réactive des Effets vers des Événements d’Effets.
- N'appelez des Événements d’Effets qu’à l’intérieur des Effets.
- Ne transmettez pas les Événements d’Effets à d’autres composants ou Hooks.

</Recap>

<Challenges>

#### Garantir une variable à jour {/*fix-a-variable-that-doesnt-update*/}

Ce composant `Timer` maintient une variable d’état `count` qui s’incrémente à chaque seconde. Son pas d'incrément est stocké dans la variable d’état `increment`. Vous pouvez contrôler la variable `increment` avec les boutons plus et moins.

Cependant, peu importe combien de fois vous cliquez sur le bouton plus, le compteur est toujours incrémenté d’une unité à chaque seconde. Qu’est-ce qui ne va pas dans ce code ? Pourquoi `increment` vaut-il toujours `1` à l’intérieur du code de l’Effet ? Trouvez l’erreur et corrigez-la.

<Hint>

Pour corriger ce code, il suffit de suivre les règles.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Compteur : {count}
        <button onClick={() => setCount(0)}>Réinitialiser</button>
      </h1>
      <hr />
      <p>
        Chaque seconde, incrémenter de :
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Comme d’habitude, quand vous cherchez des bugs dans des Effets, commencez par chercher si le *linter* a été mis en sourdine quelque part.

Si vous enlevez le commentaire avec la directive de mise en sourdine, React vous dira que le code de cet Effet dépend de `increment`, mais vous avez « menti » à React en affirmant que cet Effet ne dépendait d’aucune valeur réactive (`[]`). Ajoutez `increment` dans le tableau des dépendances :

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Compteur : {count}
        <button onClick={() => setCount(0)}>Réinitialiser</button>
      </h1>
      <hr />
      <p>
        Chaque seconde, incrémenter de :
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

À présent, quand `increment` changera, React resynchronisera votre Effet, ce qui redémarrera l’intervalle.

</Solution>

#### Débloquer un compteur {/*fix-a-freezing-counter*/}

Ce composant `Timer` maintient une variable d’état `count` qui s’incrémente à chaque seconde. Son pas d'incrément est stocké dans la variable d’état `increment`. Vous pouvez contrôler la variable `increment` avec les boutons plus et moins. Par exemple, essayez de cliquez neuf fois sur le bouton plus et constatez que `count` augmente désormais de dix unités plutôt que d’une seule.

Il y a un petit problème avec cette interface utilisateur. Vous remarquerez peut-être que si vous appuyez sur les boutons plus fréquemment qu’une fois par seconde, le minuteur lui-même semble se mettre en pause. Il ne reprend qu’une seconde après votre dernier clic sur l’un des boutons. Cherchez la cause de ce problème et corrigez-le afin que le minuteur avance à *chaque* seconde sans interruption.

<Hint>

Il semble que l’Effet qui met en place le minuteur « réagisse » à la valeur `increment`. La ligne qui utilise la valeur actuelle de `increment` afin d’appeler `setCount` a-t-elle vraiment besoin d'être réactive ?

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
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Compteur : {count}
        <button onClick={() => setCount(0)}>Réinitialiser</button>
      </h1>
      <hr />
      <p>
        Chaque seconde, incrémenter de :
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Le problème est que le code à l’intérieur de l’Effet utilise la variable d’état `increment`. Puisque c’est une dépendance de votre Effet, chaque changement de `increment` entraîne la resynchronisation de l’Effet, ce qui a pour conséquence d’effacer le timer. Si vous l’effacez avant même qu’il n’ait eu le temps de se déclencher, alors vous aurez l’impression que votre minuteur est figé.

Pour résoudre ce problème, extrayez un Événement d’Effet `onTick` de votre Effet :

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
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Compteur : {count}
        <button onClick={() => setCount(0)}>Réinitialiser</button>
      </h1>
      <hr />
      <p>
        Chaque seconde, incrémenter de :
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

Puisque `onTick` est un Événement d’Effet, le code qu’il contient n’est pas réactif. Le changement de `increment` ne déclenche aucun Effet.

</Solution>

#### Rendre le délai réglable {/*fix-a-non-adjustable-delay*/}

Dans cet exemple, vous pouvez personnaliser le délai de l’intervalle. Il est stocké dans une variable d’état `delay` qui est mise à jour avec deux boutons. Cependant, même si vous appuyez sur le bouton « +100 ms » jusqu’à ce que le délai soit de 1000 millisecondes (une seconde, donc), vous remarquerez que le minuteur s’incrémente toujours très rapidement (toutes les 100 ms). C’est comme si vos changements de `delay` étaient ignorés. Trouvez et corrigez le bug.

<Hint>

Le code à l’intérieur des Événements d’Effets n’est pas réactif. Existe-t-il des cas où vous _souhaiteriez_ que l’appel à `setInterval` soit réexécuté ?

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
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Compteur : {count}
        <button onClick={() => setCount(0)}>Réinitialiser</button>
      </h1>
      <hr />
      <p>
        Incrémenter de :
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Délai d’incrémentation :
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Le problème avec l’exemple ci-dessus, c'est qu’il a extrait un Événement d’Effet appelé `onMount` sans tenir compte de ce que le code devrait réellement faire. Il n'y a qu'une raison valable d'extraire des Événements d’Effets : quand vous souhaitez rendre une partie de votre code non réactive. Cependant, l’appel à `setInterval` *doit* être réactif par rapport à la variable d’état `delay`. Si le `delay` change, vous devez recréer l’intervalle. Pour corriger ce code, remettez tout le code réactif à l’intérieur de l’Effet :

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
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Compteur : {count}
        <button onClick={() => setCount(0)}>Réinitialiser</button>
      </h1>
      <hr />
      <p>
        Incrémenter de :
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Délai d’incrémentation :
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

En général, méfiez-vous de fonctions comme `onMount` qui se focalisent sur le *timing* plutôt que sur l’*objectif* d’un bout de code. Ça peut sembler « plus descriptif » à première vue, mais ça dissimule votre intention. En règle générale, les Événements d’Effets doivent correspondre à quelque chose qui se produit du point de vue de l’*utilisateur*.

Par exemple `onMessage`, `onTick`, `onVisit` ou `onConnected` sont de bons noms d’Événements d’Effets. Le code qu’ils contiennent n’a probablement pas besoin d’être réactif. En revanche, `onMount`, `onUpdate`, `onUnmount` ou `onAfterRender` sont si génériques qu’il est facile d’y mettre accidentellement du code qui *devrait* être réactif. C’est pourquoi vous devriez nommer vos Événements d’Effets en fonction de *ce qui s’est passé selon l’utilisateur*, et non en fonction du moment où le code s’est exécuté.

</Solution>

#### Corriger un retard de notification {/*fix-a-delayed-notification*/}

Lorsque vous rejoignez un salon de discussion, ce composant affiche une notification. Cependant, il n’affiche pas la notification immédiatement. Au lieu de ça, la notification est retardée artificiellement de deux secondes afin que l’utilisateur ait l'opportunité d'examiner l’interface utilisateur.

Ça fonctionne presque, mais il y a un bug. Essayez de changer la liste déroulante de « général » à « voyage » puis à « musique » très rapidement. Si vous le faites suffisamment vite, vous verrez deux notifications (ça, ça va !) mais elles indiqueront *toutes les deux* « Bienvenue dans le salon musique ».

Faites en sorte que lorsque vous passez rapidement de « général » à « voyage » puis à « musique », vous obtenez deux notifications, la première indiquant « Bienvenue dans le salon voyage » et la seconde « Bienvenue dans le salon musique » (pour un défi supplémentaire, en considérant que vous avez *déjà* affiché les bons salons dans les notifications, changez le code pour que seule la dernière notification soit affichée).

<Hint>

Votre Effet sait à quel salon il est connecté. Y a-t-il des informations que vous souhaiteriez qu'il transmette à votre Événement d’Effet ?

</Hint>

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Bievenue dans le salon ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
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

<Solution>

À l’intérieur de votre Événement d’Effet, `roomId` est la valeur *au moment où l’Événement d’Effet a été appelé.*

Votre Événement d’Effet est appelé avec un délai de deux secondes. Si vous passez rapidement du salon sur le voyage à celui sur la musique, lorsque la notification du salon sur le voyage s’affiche, `roomId` vaut déjà `"music"`. C’est pour ça que les deux notifications affichent « Bienvenue dans le salon musique ».

Pour résoudre ce problème, au lieu de lire la *dernière* valeur de `roomId` dans l’Événement d’Effet, faites-en un paramètre de votre Événement d’Effet, comme `connectedRoomId` ci-dessous. Transmettez ensuite `roomId` depuis votre Effet en appelant `onConnected(roomId)` :

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Bienvenue dans le salon ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
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

L’Effet pour lequel `roomId` vaut `"travel"` (qui est donc connecté au salon `"travel"`) affichera la notification pour `"travel"`. L’Effet pour lequel `roomId` est défini à `"music"` (qui est donc connecté au salon `"music"`) affichera la notification pour `"music"`. Autrement dit, `connectedRoomId` provient de votre Effet (qui est réactif), alors que `theme` utilise toujours la dernière valeur.

Pour résoudre le défi supplémentaire, enregistrez l’ID du timer de notification, puis effacez-le dans la fonction de nettoyage de votre Effet :

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Bienvenue dans le salon ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
  }, [roomId]);

  return <h1>Bienvenue dans le salon {roomId} !</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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

Ça permet de s’assurer que les notifications déjà planifiées (mais pas encore affichées) sont annulées à chaque fois que vous changez de salon.

</Solution>

</Challenges>
