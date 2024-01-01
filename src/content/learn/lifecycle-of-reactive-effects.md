---
title: 'Cycle de vie des Effets réactifs'
---

<Intro>

Les Effets ont un cycle de vie différent de celui des composants. Les composants peuvent être montés, mis à jour ou démontés. Un Effet ne peut faire que deux choses : commencer à se synchroniser avec quelque chose et arrêter de le faire. Ce cycle peut se produire plusieurs fois si votre Effet dépend de props ou d'états qui changent avec le temps. React fournit une règle de *linter* pour vérifier que vous avez correctement spécifié les dépendances de votre Effet. Ça permet à votre Effet de rester synchronisé avec les derniers props et états.

</Intro>

<YouWillLearn>

- En quoi le cycle de vie d'un Effet diffère de celui d'un composant
- Comment penser à chaque Effet de manière isolée
- Quand et pourquoi votre Effet doit être resynchronisé
- Comment sont déterminées les dépendances de votre Effet
- Ce que signifie pour une valeur d'être réactive
- Ce que signifie un tableau de dépendances vide
- Comment React vérifie que vos dépendances sont correctes avec un *linter*
- Que faire lorsque vous n'êtes pas d'accord avec le *linter*


</YouWillLearn>

## Le cycle de vie d'un Effet {/*the-lifecycle-of-an-effect*/}

Chaque composant React suit le même cycle de vie :

- Un composant _est monté_ lorsqu'il est ajouté à l'écran.
- Un composant _se met à jour_ quand il reçoit de nouvelles props ou variables d'état, généralement à la suite d'une interaction.
- Un composant _est démonté_ quand il est retiré de l'écran.

**C'est une bonne façon de réfléchir aux composants, mais _pas_ aux Effets**. Voyez plutôt chaque Effet indépendamment du cycle de vie de vos composants. Un Effet décrit la façon de [synchroniser un système extérieur](/learn/synchronizing-with-effects) avec les props et états actuels. Au fur et à mesure que votre code change, la synchronisation sera plus ou moins fréquente.

Pour illustrer ce point, regardez cet Effet qui se connecte à un salon de discussion :

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

Le corps de votre Effet définit comment **démarrer la synchronisation** :

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

La fonction de nettoyage renvoyée par votre Effet indique comment **stopper la synchronisation** :

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Intuitivement, vous pourriez penser que React **lancerait la synchronisation** au montage de votre composant et **arrêterait la synchronisation** au démontage de votre composant. Cependant, l'histoire ne s'arrête pas là ! Parfois, il peut être nécessaire de **démarrer et d'arrêter la synchronisation plusieurs fois** alors que le composant reste monté.

Voyons _pourquoi_ c'est nécessaire, _quand_ ça se produit et _comment_ vous pouvez contrôler ce comportement.

<Note>

Certains Effets ne renvoient aucune fonction de nettoyage. [Le plus souvent](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development), vous voudrez en renvoyer une — mais dans le cas contraire, React se comportera comme si vous renvoyiez une fonction de nettoyage vide.

</Note>

### Pourquoi la synchronisation peut se produire plusieurs fois {/*why-synchronization-may-need-to-happen-more-than-once*/}

Imaginez que ce composant `ChatRoom` reçoive une prop `roomId` que l'utilisateur choisit depuis une liste déroulante. Supposons que ce dernier choisisse initialement le salon `"general"` pour le `roomId`. Votre appli affiche le salon de discussion `"general"` :

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Bienvenue dans le salon {roomId} !</h1>;
}
```

Après l'affichage de l'interface utilisateur, React exécute votre Effet pour **démarrer la synchronisation**. Il se connecte au salon `"general"` :

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connexion au salon "general"
    connection.connect();
    return () => {
      connection.disconnect(); // Déconnexion du salon "general"
    };
  }, [roomId]);
  // ...
```

Jusqu'ici, tout va bien.

Plus tard, l'utilisateur change de salon depuis la liste déroulante (par exemple `"travel"`). React met d'abord à jour l'interface utilisateur :

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Bienvenue dans le salon {roomId} !</h1>;
}
```

Réfléchissez à ce qui doit se passer ensuite. L'utilisateur voit que le salon `"travel"` est sélectionné dans l'interface. Cependant, l'Effet exécuté précédemment est toujours connecté au salon `"general"`. **La prop `roomId` a changé et ce qu'a fait votre Effet à l'époque (se connecter au salon `"general"`) ne correspond plus à ce que l'interface affiche**.

À ce stade, vous attendez deux choses de React :

1. Arrêter la synchronisation avec l'ancien `roomId` (se déconnecter du salon `"general"`).
2. Démarrer la synchronisation avec le nouveau `roomId` (se connecter au salon `"travel"`).

**Heureusement, vous avez déjà appris à React comment faire ces deux choses-là** ! Le corps de votre Effet spécifie comment démarrer la synchronisation et votre fonction de nettoyage comment l'arrêter. Tout ce que React a désormais à faire, c'est les appeler dans le bon ordre et avec les bons props et états. Voyons comment ça se passe précisément.

### Comment React resynchronise votre Effet {/*how-react-re-synchronizes-your-effect*/}

Souvenez-vous que votre composant `ChatRoom` a reçu une nouvelle valeur pour sa prop `roomId`. C'était auparavant `"general"` et c'est désormais `"travel"`. React a besoin de resynchroniser votre Effet pour se reconnecter à un salon différent.

Pour **arrêter la synchronisation**, React doit appeler la fonction de nettoyage que votre Effet a renvoyé après sa connexion au salon `"general"`. Comme `roomId` valait `"general"`, la fonction de nettoyage se déconnecte du salon `"general"` :

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connexion au salon "general"
    connection.connect();
    return () => {
      connection.disconnect(); // Déconnexion du salon "general"
    };
    // ...
```

Ensuite, React va exécuter l'Effet que vous avez fourni pendant le rendu. Cette fois, `roomId` vaut `"travel"`, donc il va **démarrer sa synchronisation** au salon `"travel"` (jusqu'à ce que cette fonction de nettoyage soit appelée à son tour) :

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connexion au salon "travel"
    connection.connect();
    // ...
```

Grâce à ça, vous êtes désormais connecté·e au même salon que celui choisi dans l'interface par l'utilisateur. La catastrophe est évitée !

Chaque fois que votre composant refera son rendu avec un `roomId` différent, votre Effet se resynchronisera. Disons par exemple que l'utilisateur change le `roomId` de `"travel"` à `"music"`. React **arrêtera une nouvelle fois de synchroniser** votre Effet en appelant la fonction de nettoyage (qui se déconnectera du salon `"travel"`). Puis, il **recommencera à se synchroniser** en exécutant le code avec la nouvelle prop `roomId` (qui se connectera au salon `"music"`).

Enfin, lorsque votre utilisateur changera d'écran, `ChatRoom` sera démonté. Il deviendra alors inutile de rester connecté. React **cessera de synchroniser** votre Effet une dernière fois et vous déconnectera du salon `"music"`.

### Penser du point de vue de l'Effet {/*thinking-from-the-effects-perspective*/}

Récapitulons tout ce qui s'est passé du point de vue du composant `ChatRoom` :

1. `ChatRoom` a été monté avec `roomId` valant `"general"`.
1. `ChatRoom` s'est mis à jour avec `roomId` valant `"travel"`.
1. `ChatRoom` s'est mis à jour avec `roomId` valant `"music"`.
1. `ChatRoom` a été démonté.

À chacune de ces étapes du cycle de vie du composant, votre Effet a fait différentes choses :

1. Votre Effet s'est connecté au salon `"general"`.
1. Votre Effet s'est déconnecté du salon `"general"` et s'est connecté au salon `"travel"`.
1. Votre Effet s'est déconnecté du salon `"travel"` et s'est connecté au salon `"music"`.
1. Votre Effet s'est déconnecté du salon `"music"`.

Maintenant, voyons ce qu'il s'est passé du point de vue de l'Effet lui-même :

```js
  useEffect(() => {
    // Votre Effet s'est connecté au salon spécifié par roomId...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...jusqu'à sa déconnexion
      connection.disconnect();
    };
  }, [roomId]);
```

La structure de ce code peut vous inciter à voir que ce qui s'est passé comme une séquence de périodes de temps qui ne se chevauchent pas :

1. Votre Effet s'est connecté au salon `"general"` (jusqu'à sa déconnexion).
1. Votre Effet s'est connecté au salon `"travel"` (jusqu'à sa déconnexion).
1. Votre Effet s'est connecté au salon `"music"` (jusqu'à sa déconnexion).

Précédemment, vous pensiez du point de vue du composant. Avec cette perspective, il était tentant de considérer les Effets comme des « fonctions de rappel » ou des « événements de cycle de vie » qui se déclenchent à un moment précis, par exemple « après un rendu » ou « avant le démontage ». Cette façon de penser se complique très vite, il est donc préférable de l'éviter.

**Concentrez-vous plutôt sur un seul cycle démarrage / arrêt à la fois. Le fait qu'un composant soit en cours de montage, en train de se mettre à jour ou en cours de démontage ne devrait pas avoir d'importance. Tout ce que vous avez à faire, c'est de décrire comment démarrer et arrêter la synchronisation. Si vous faites ça correctement, votre Effet pourra aisément être démarré puis arrêté autant de fois que nécessaire.**

Ça vous rappelera peut-être que vous ne vous souciez pas de savoir si un composant est en cours de montage ou en train de se mettre à jour lorsque vous écrivez la logique de rendu qui crée le JSX. Vous décrivez ce qui doit être à l'écran et React [se charge du reste](/learn/reacting-to-input-with-state).

### Comment React vérifie que votre Effet peut se resynchroniser {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

Voici un exemple interactif. Cliquez sur « Ouvrir le salon » pour monter le composant `ChatRoom` :

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
        {show ? 'Fermer le salon' : 'Ouvrir le salon'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
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

Remarquez ces trois messages lorsque le composant est monté pour la première fois :

1. `✅ Connexion au salon « general » sur https://localhost:1234...` *(seulement en développement)*
2. `❌ Déconnexion du salon « general » sur https://localhost:1234.` *(seulement en développement)*
3. `✅ Connexion au salon « general » sur https://localhost:1234...`

Les deux premiers messages n'apparaissent qu'en phase de développement. Dans ce contexte, React monte toujours les composants deux fois.

**En phase de développement, React vérifie que votre Effet peut se resynchroniser en le forçant à le faire immédiatement**. Comparez ça à ouvrir une porte puis à la fermer à nouveau pour s'assurer que la serrure fonctionne bien. React démarre puis arrête votre Effet une fois de plus en phase de développement pour vérifier que [vous avez correctement implémenté son nettoyage](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development).

La raison principale pour laquelle un Effet se resynchronisera, c'est que certaines données qu'il utilise auront changé. Dans le bac à sable précédent, sélectionnez un autre salon de discussion. Voyez comme votre Effet se resynchronise quand `roomId` change.

Cependant, il existe des cas plus inhabituels où la resynchronisation est nécessaire. Par exemple, modifiez le `serverUrl` dans le bac à sable ci-dessus alors que le salon est ouvert. Constatez que l'Effet se resynchronise en même temps que vous éditez le code. À l'avenir, React pourrait ajouter d'autres fonctionnalités reposant sur la synchronisation.

### Comment React sait qu'il doit resynchroniser l'Effet {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

Vous vous demandez peut-être comment React a su que votre Effet devait se resynchroniser après la modification de `roomId`. C'est parce que *vous avez indiqué à React* que son code dépendait de `roomId` en l'incluant dans la [liste des dépendances](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies) :

```js {1,3,8}
function ChatRoom({ roomId }) { // La prop roomId peut changer au cours du temps
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Cet Effet lit roomId
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // Donc vous dites à React que cet Effet « dépend » de roomId
  // ...
```

Voici comment ça fonctionne :

1. Vous saviez que `roomId` est une prop, ce qui veut dire qu'elle peut changer avec le temps.
2. Vous saviez que votre Effet lit `roomId` (de sorte que sa logique dépend d'une valeur susceptible de changer avec le temps).
3. C'est pourquoi vous l'avez spécifié dans les dépendances de votre Effet (afin qu'il se resynchronise quand `roomId` change).

Chaque fois que votre composant refera son rendu, React regardera le tableau des dépendances que vous avez fourni. Si l'une des valeurs de ce tableau est différente de celle passée lors du précédent rendu, React resynchronisera votre Effet.

Par exemple, si vous avez passé `["general"]` lors du rendu initial, puis qu'au rendu suivant vous avez passé `["travel"]`, React comparera `"general"` et `"travel"`. Ce sont des valeurs différentes (comparées avec [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), donc React resynchronisera votre Effet. En revanche, si votre composant effectue un nouveau rendu mais que `roomId` n'a pas changé, alors votre Effet restera connecté au même salon.

### Chaque Effet représente un processus de synchronisation distinct {/*each-effect-represents-a-separate-synchronization-process*/}

Résistez à l'envie d'ajouter de la logique sans rapport avec votre Effet uniquement parce qu'elle doit être exécutée en même temps qu'un Effet déjà écrit. Disons par exemple que vous voulez envoyer des événements analytiques lorsqu'un utilisateur visite un salon. Vous avez déjà un Effet qui dépend de `roomId`, vous pourriez être tenté·e d'y ajouter l'appel analytique :

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Imaginez que par la suite vous ajoutiez une autre dépendance à cet Effet qui a besoin de rétablir la connexion. Si cet Effet se resynchronise, il appellera aussi `logVisit(roomId)` pour le même salon, ce que vous ne souhaitez pas. L'enregistrement de la visite **est un processus distinct** de celui de la connexion. Implémentez-les dans deux Effets distincts :

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**Chaque Effet de votre code doit représenter un processus de synchronisation distinct et indépendant.**

Dans le code ci-dessus, supprimer un Effet ne casserait pas la logique de l'autre Effet. C'est un bon indicateur qu'ils synchronisent des choses différentes, il était donc logique de les séparer. En revanche, si vous divisez un bout de logique cohérente entre plusieurs Effets, le code peut sembler « plus propre », mais il sera [plus difficile à maintenir](/learn/you-might-not-need-an-effect#chains-of-computations). C'est pourquoi vous devez vous demander si les processus sont identiques ou distincts, et non pas si le code semble plus propre.

## Les Effets « réagissent » aux valeurs réactives {/*effects-react-to-reactive-values*/}

Votre Effet lit deux variables (`serverUrl` et `roomId`), mais vous n'avez spécifié que `roomId` au sein du tableau des dépendances :

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

Pourquoi `serverUrl` ne constitue-t-elle pas dépendance ?

C'est parce que `serverUrl` ne change jamais à la suite d'un nouveau rendu. Elle reste la même, quel que soit le nombre de fois où le composant est rendu (et quelles que soient les raisons de ces rendus). Puisque `serverUrl` ne change jamais, ça n'aurait aucun sens de la spécifier en tant que dépendance. Après tout, les dépendances n'ont d'importance que si elles changent avec le temps !

En revanche, `roomId` peut être différent lors d'un nouveau rendu. **Les props, états et autres valeurs déclarées au sein d'un composant sont _réactifs_ parce qu'ils sont calculés pendant un rendu et participent au flux de données de React.**

Si `serverUrl` était une variable d'état, elle aurait été réactive. Les valeurs réactives doivent être incluses dans les dépendances :

```js {2,5,10}
function ChatRoom({ roomId }) { // Les props changent au cours du temps
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // L'état peut changer au cours du temps

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Votre Effet lit des props et états
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Vous indiquez donc à React que cet Effet « dépend » de ces props et états
  // ...
}
```

En ajoutant `serverUrl` comme dépendance, vous vous assurez que l'Effet se resynchronise après la modification de l'URL.

Dans ce bac à sable, essayez de changer le salon de discussion sélectionné, ou modifiez l'URL du serveur :

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        URL du serveur :{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Bienvenue dans le salon {roomId} !</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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

À chaque fois que vous modifiez une valeur réactive comme `roomId` ou `serverUrl`, l'Effet se reconnecte au serveur de discussion.

### Ce que siginifie un Effet avec un tableau de dépendances vide {/*what-an-effect-with-empty-dependencies-means*/}

Que se passe-t-il si vous déplacez `serverUrl` et `roomId` à l'extérieur du composant ?

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ Toutes les dépendances sont déclarées
  // ...
}
```

À présent, le code de votre Effet n'utilise *aucune* valeur réactive, donc ses dépendances sont vides (`[]`).

Du point de vue du composant, le tableau de dépendances vide `[]` signifie que cet Effet se connecte au salon de discussion seulement au montage du composant, puis se déconnecte uniquement au démontage du (gardez à l'esprit que React voudra toujours [resynchroniser une fois de plus](#how-react-verifies-that-your-effect-can-re-synchronize) en phase de développement pour valider votre gestion du nettoyage).


<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Bienvenue dans le salon {roomId} !</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Fermer le salon' : 'Ouvrir le salon'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
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

Cependant, si vous [pensez du point de vue de l'Effet](#thinking-from-the-effects-perspective), vous n'avez pas besoin de vous préoccuper du montage et du démontage. Ce qui importe, c'est que vous avez spécifié comment votre Effet démarre et arrête la synchronisation. Pour l'instant, il n'a aucune dépendance réactive. Toutefois, si vous souhaitez que l'utilisateur puisse changer `roomId` ou `serverUrl` plus tard (et donc qu'ils deviennent réactifs), le code de votre Effet ne changera pas. Il suffira de les ajouter en tant que dépendances.

### Toutes les variables déclarées dans le corps du composant sont réactives {/*all-variables-declared-in-the-component-body-are-reactive*/}

Les props et états ne sont pas les seules valeurs réactives. Les valeurs que vous calculez à partir d'elles sont aussi réactives. Si vos props ou états changent, votre composant fera un nouveau rendu et les valeurs ainsi calculées changeront également. C'est pourquoi toutes les variables locales au composant qui sont utilisées par l'Effet doivent apparaître dans la liste de ses dépendances.

Imaginez que l'utilisateur puisse choisir le serveur de discussion dans une liste déroulante, mais qu'il puisse aussi configurer un serveur par défaut dans les paramètres. Supposez que vous ayez déjà mis l'état des paramètres dans un [contexte](/learn/scaling-up-with-reducer-and-context) et que vous y lisiez ces `settings`. Vous calculez maintenant `serverUrl` en fonction du serveur sélectionné depuis les props et du serveur par défaut :

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId est réactive
  const settings = useContext(SettingsContext); // settings est réactive
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl est réactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Votre Effect lit roomId et serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Donc il doit se resynchroniser lorsque l'une d'elles change
  // ...
}
```

Dans cet exemple, `serverUrl` n'est ni une prop ni une variable d'état. Il s'agit d'une variable ordinaire que vous calculez durant le rendu. Comme elle est calculée au moment du rendu, elle peut changer d'un rendu à l'autre. C'est pourquoi elle est réactive.

**Toutes les variables au sein du composant (y compris les props, les variables d'état et les autres variables dans le corps de votre composant) sont réactives. Toute valeur réactive pouvant changer d'un rendu à l'autre, vous devez l'inclure dans les dépendances de votre Effet.**

En d'autres termes, les Effets « réagissent » à toutes les variables du corps du composant.

<DeepDive>

#### Les valeurs globales ou modifiables peuvent-elles être des dépendances ? {/*can-global-or-mutable-values-be-dependencies*/}

Les valeurs modifiables (y compris les variables globales) ne sont pas réactives.

**Une valeur modifiable telle que [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) ne peut pas être une dépendance.** Elle est modifiable : elle peut donc changer n'importe quand en dehors du flux de données des rendus de React. La modifier ne déclencherait pas un nouveau rendu de votre composant. Par conséquent, même si vous l'ajoutiez à vos dépendances, React *ne saurait pas* qu'il faut resynchroniser l'Effet quand elle change. Ça enfreint également les règles de React car lire des données modifiables pendant le rendu (ce qui est le cas lorsque vous calculez les dépendances) détruit la [pureté du rendu](/learn/keeping-components-pure). Vous devriez plutôt exploiter les valeurs extérieures modifiables en utilisant [`useSyncExternalStore`](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store).

**Une valeur modifiable telle que [`ref.current`](/reference/react/useRef#reference) ou les choses que vous lisez à partir d'elle ne peuvent pas non plus être des dépendances.** L'objet ref renvoyé par `useRef` lui-même peut être une dépendance, mais sa propriété `current` est intentionnellement modifiable. Ça vous permet de [surveiller quelque chose sans pour autant déclencher un nouveau rendu](/learn/referencing-values-with-refs). Mais puisque sa modification n'entraîne pas de nouveau rendu, ce n'est pas une valeur réactive, et React ne saura pas qu'il faut réexécuter votre Effet quand elle change.

Comme vous l'apprendrez plus loin sur cette page, le *linter* détectera automatiquement ces problèmes.

</DeepDive>

### React vérifie que vous spécifiez chaque valeur réactive comme dépendance {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

Si votre *linter* est [configuré pour React](/learn/editor-setup#linting), il contrôlera que chaque valeur réactive utilisée par le code de votre Effet est déclarée parmi ses dépendances. Par exemple, voici une erreur du *linter* parce que `roomId` et `serverUrl` sont réactives :

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId est réactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl est réactive

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Là, on a un problème !

  return (
    <>
      <label>
        URL du serveur :{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Bienvenue dans le salon {roomId} !</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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

Ça peut ressembler à une erreur React, mais en réalité React signale un bug dans votre code. `roomId` et `serverUrl` peuvent toutes deux changer au cours du temps, mais vous oubliez de resynchroniser votre Effet lorsqu'elles changent. Vous continuerez à utiliser les valeurs initiales de `roomId` et `serverUrl`, même si l'utilisateur choisit des valeurs différentes dans l'interface.

Pour corriger le bug, appliquez la suggestion du *linter* en spécifiant `roomId` et `serverUrl` comme dépendances de votre Effet :

```js {9}
function ChatRoom({ roomId }) { // roomId est réactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl est réactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ Toutes les dépendances sont déclarées
  // ...
}
```

Essayez de corriger ça dans le bac à sable précédent. Vérifiez que l'erreur du *linter* est partie et que le salon se reconnecte quand c'est nécessaire.

<Note>

Dans certains cas, React *sait* qu'une valeur ne change jamais, même si elle est déclarée dans le composant. Par exemple, la [fonction `set`](/reference/react/useState#setstate) renvoyée par `useState` et l'objet ref renvoyé par [`useRef`](/reference/react/useRef) sont *stables* — ils est garanti qu'ils ne changeront pas d'un rendu à l'autre. Les valeurs stables ne sont pas réactives, vous pouvez donc les omettre de la liste. Les inclure reste autorisé : elles ne changeront pas, ça n'a donc aucune importance.

</Note>

### Que faire quand vous ne voulez pas resynchroniser {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

Dans l'exemple précédent, vous avez corrigé l'erreur du *linter* en ajoutant `roomId` et `serverUrl` dans le tableau des dépendances.

**Cependant, vous pourriez plutôt « prouver » au *linter* que ces valeurs ne sont pas réactives**, c'est-à-dire qu'elle *ne peuvent pas* changer à la suite d'un nouveau rendu. Par exemple, si `serverUrl` et `roomId` ne dépendent pas du rendu et ont toujours les mêmes valeurs, vous pouvez les extraire du composant. Ainsi, elles n'ont plus besoin d'être des dépendances :

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl n'est pas réactive
const roomId = 'general'; // roomId n'est pas réactive

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ Toutes les dépendances sont déclarées
  // ...
}
```

Vous pouvez aussi les déplacer *à l'intérieur de l'Effet*. Elles ne sont pas calculées durant le rendu et ne sont donc pas réactives :

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl n'est pas réactive
    const roomId = 'general'; // roomId n'est pas réactive
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ Toutes les dépendances sont déclarées
  // ...
}
```

**Les Effets sont des bouts de code réactifs.** Ils se resynchronisent quand les valeurs que vous lisez à l'intérieur changent. Contrairement aux gestionnaires d'événements qui ne s'exécutent qu'une fois par interaction, les Effets s'exécutent chaque fois qu'une synchronisation est nécessaire.

**Vous ne pouvez pas « choisir » vos dépendances.** Vos dépendances doivent inclure chaque [valeur réactive](#all-variables-declared-in-the-component-body-are-reactive) que vous lisez dans l'Effet. C'est imposé par le *linter*. Ça peut parfois aboutir à des problèmes comme des boucles infinies et des resynchronisations trop fréquentes de votre Effet. Ne corrigez pas ces erreurs en supprimant le *linter* ! Voici ce que vous devriez plutôt essayer :

* **Vérifiez que votre Effet représente un processus de sychronisation indépendant.** Si votre Effet ne synchronise rien du tout, [il est peut-être inutile](/learn/you-might-not-need-an-effect). S'il synchronise au contraire plusieurs choses indépendantes, [découpez-le](#each-effect-represents-a-separate-synchronization-process).

* **Si vous voulez lire les dernières valeurs des props ou de l'état sans « réagir » et resynchroniser l'Effet**, vous pouvez découper votre Effet en une partie réactive (que vous garderez dans l'Effet) et une partie non réactive (que vous extrairez dans ce que l'on appelle un _Événement d'Effet_). [À propos de la séparation des événements et des Effets](/learn/separating-events-from-effects).

* **Évitez de vous appuyer sur des objets ou des fonctions comme dépendances.** Si vous créez des objets et des fonctions durant le rendu, puis que vous les lisez dans un Effet, ils seront différents à chaque rendu. Ça obligera votre Effet à se resynchroniser à chaque fois. [À propos de la suppression des dépendances inutiles dans les Effets](/learn/removing-effect-dependencies).

<Pitfall>

Le *linter* est votre ami, mais ses pouvoirs sont limités. Le *linter* sait seulement quand les dépendances sont *erronées*. Il ne connaît pas *la meilleure* solution pour résoudre chaque situation. Si le *linter* suggère une dépendance mais que son ajout entraîne une boucle, ça ne signifie pas pour autant qu'il faille l'ignorer. Vous devez modifier le code à l'intérieur (ou à l'extérieur) de l'Effet de façon à ce que cette valeur ne soit plus réactive et n'ait plus *besoin* d'être une dépendance.

Si vous avez une base de code existante, vous pouvez avoir ce genre de suppressions du *linter* sur certains Effets :

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Évitez de supprimer le linter comme ça :
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

Dans les [pages](/learn/separating-events-from-effects) [suivantes](/learn/removing-effect-dependencies), vous apprendrez comment corriger ce code sans enfreindre les règles. Ça en vaut toujours la peine !

</Pitfall>

<Recap>

- Les composants peuvent être montés, se mettre à jour et être démontés.
- Chaque Effet a un cycle de vie distinct du composant qui le contient.
- Chaque Effet décrit un processus de synchronisation distinct qui peut *démarrer* et *s'arrêter*.
- Quand vous écrivez et relisez des Effets, pensez du point de vue de chaque Effet individuellement (comment démarrer et arrêter sa synchronisation), plutôt que du point de vue du composant (comment il est monté, se met à jour ou est démonté).
- Les valeurs déclarées à l'intérieur du corps du composant sont « réactives ».
- Les valeurs réactives doivent resynchroniser l'Effet car elles peuvent changer au cours du temps.
- Le *linter* vérifie que toutes les valeurs réactives utilisées à l'intérieur de l'Effet sont spécifiées dans son tableau de dépendances.
- Toutes les erreurs signalées par le *linter* sont légitimes. Il y a toujours une façon de corriger le code sans enfreindre les règles.

</Recap>

<Challenges>

#### Éviter la reconnexion à la frappe {/*fix-reconnecting-on-every-keystroke*/}

Dans cet exemple, le composant `ChatRoom` se connecte au salon de discussion au montage, se déconnecte au démontage et se reconnecte lorsque vous changez de salon. Ce comportement est correct, aussi vous devez le conserver.

Cependant, il y a un souci. Lorsque vous tapez dans la boîte de message du bas, le composant `ChatRoom` se reconnecte *aussi* au salon (vous pouvez le constater en vidant la console puis en tapant dans le champ de saisie). Corrigez ce problème pour que ça ne se reproduise plus.

<Hint>

Vous pourriez avoir besoin d'ajouter un tableau de dépendances pour cet Effet. Quelles dépendances devraient y figurer ?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>Bienvenue dans le salon {roomId} !</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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

<Solution>

Cet Effet n'avait pas du tout de tableau de dépendances, il se resynchronisait donc après chaque rendu. Commencez par ajouter ce tableau. Ensuite, assurez-vous que chaque valeur réactive utilisée par l'Effet est spécifiée dedans. Par exemple, `roomId` est réactive (puisque c'est une prop), donc elle doit être incluse dans le tableau. Ça permet de s'assurer que la reconnexion se fait quand l'utilisateur change de salon. En revanche, `serverUrl` est définie à l'extérieur du composant. C'est pourquoi elle n'a pas besoin d'être dans le tableau.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Bienvenue dans le salon {roomId} !</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
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

</Solution>

#### Activer et désactiver la synchronisation {/*switch-synchronization-on-and-off*/}

Dans cet exemple, un Effet s'abonne à l'événement [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) de `window` pour déplacer un point rose à l'écran. Survolez la zone de prévisualisation (ou touchez l'écran si vous utilisez un appareil mobile) et observez comment le point rose suit votre mouvement.

Il y a également une case à cocher. Le fait de la cocher change la valeur de la variable d'état `canMove`, mais celle-ci n'est utilisée nulle part. Votre tâche consiste à modifier le code pour que le point arrête son mouvement quand `canMove` est à `false` (la case n'est pas cochée). Lorsque vous recochez la case (et donc que `canMove` vaut `true`), le point doit suivre à nouveau le mouvement. En d'autres termes, la capacité du point à pouvoir se déplacer ou non doit rester synchronisée avec le fait que la case est cochée ou non.

<Hint>

Vous ne pouvez pas déclarer un Effet de manière conditionnelle. Cependant, le code à l'intérieur de votre Effet peut utiliser des conditions !

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
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

<Solution>

Une solution consiste à enrober l'appel à `setPosition` dans une condition `if (canMove) { ... }` :

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

Vous pouvez aussi bien enrober la logique d'*abonnement à l'événement* dans une condition `if (canMove) { ... }` :

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

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

Dans les deux cas, `canMove` est une variable réactive que vous lisez dans votre Effet. C'est pourquoi elle doit être dans la liste des dépendances de l'Effet. Ça garantit que l'Effet se resynchronise après chaque modification de sa valeur.

</Solution>

#### Corriger un bug de valeur obsolète {/*investigate-a-stale-value-bug*/}

Dans cet exemple, le point rose doit se déplacer quand la case est cochée et doit s'arrêter si elle ne l'est pas. Cette logique a déjà été implémentée : le gestionnaire d'événement `handleMove` vérifie la variable d'état `canMove`.

Cependant, pour une raison obscure, la variable d'état `canMove` dans `handleMove` semble être « obsolète » : elle vaut toujours `true`, même après avoir cliqué sur la case à cocher. Comment est-ce possible ? Trouvez l'erreur dans le code et corrigez-la.

<Hint>

Si vous constatez qu'une règle du *linter* est ignorée, réactivez-la ! C'est là que se trouvent généralement les erreurs.

</Hint>

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

<Solution>

Le problème du code original venait de la mise en sourdine du *linter*. Si vous le réactivez, vous verrez que cet Effet dépend de la fonction `handleMove`. C'est logique : `handleMove` est déclarée dans le corps du composant, ce qui en fait une valeur réactive. Chaque valeur réactive doit être spécifiée comme une dépendance sans quoi elle risque de devenir obsolète au fil du temps !

L'auteur du code original a « menti » à React en disant que l'Effet ne dépendait (`[]`) d'aucune valeur réactive. C'est pour ça que React n'a pas resynchronisé l'Effet quand `canMove` a changé (et `handleMove` avec). React n'ayant pas resynchronisé l'Effet, la fonction `handleMove` attachée en tant qu'écouteur est la fonction `handleMove` créée au rendu initial. À ce moment-là, `canMove` valait `true`, c'est pourquoi la fonction `handleMove` du rendu initial verra toujours cette valeur.

**Si vous n'ignorez jamais le *linter*, vous ne rencontrerez pas de problèmes avec des valeurs obsolètes.** Il existe différentes façons de résoudre ce bug, mais vous devez toujours commencer par réactiver le *linter*. Ensuite, changez le code pour corriger l'erreur du *linter*.

Vous pouvez définir les dépendances de l'Effet à `[handleMove]`, mais comme il s'agira d'une nouvelle fonction pour chaque rendu, vous pourriez tout aussi bien supprimer complétement le tableau de dépendances. Ainsi, l'Effet *se resynchronisera* après chaque nouveau rendu :

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
  });

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

Cette solution fonctionne, mais n'est pas idéale. Si vous ajoutez `console.log('Réabonnement')` dans l'Effet, vous noterez qu'il réabonne après chaque nouveau rendu. Le réabonnement est rapide, mais il serait quand même préférable de ne pas le faire aussi souvent.

Un meilleur correctif consisterait à déplacer la fonction `handleMove` *à l'intérieur* de l'Effet. Ainsi, `handleMove` ne serait plus une valeur réactive et votre Effet ne dépendrait plus d'une fonction. Il devra dépendre à la place de `canMove`, que votre code lit désormais à l'intérieur de l'Effet. Ça correspond au comportement que vous vouliez, puisque votre Effet reste synchronisé avec la valeur de `canMove` :

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

Ajoutez `console.log('Réabonnement')` à l'intérieur de l'Effet et constatez qu'il ne resouscrit désormais que lorsque vous cliquez sur la case à cocher (lorsque `canMove` change) ou éditez le code. C'est une meilleure approche que la précédente, qui consistait à se réabonner à tous les coups.

Vous découvrirez une approche plus générale de ce type de problème dans [Séparer les événements des Effets](/learn/separating-events-from-effects).

</Solution>

#### Réparer un sélecteur de connexion {/*fix-a-connection-switch*/}

Dans cet exemple, le service de discussion dans `chat.js` expose deux API différentes : `createEncryptedConnection` et `createUnencryptedConnection`. Le composant racine `App` laisse l'utilisateur choisir d'utiliser le chiffrement ou non, et transmet ensuite l'API correspondante au composant enfant `ChatRoom` *via* la prop `createConnection`.

Notez qu'initialement, la console indique que la connexion n'est pas chiffrée. Essayez d'activer la case à cocher : rien ne se passe. Cependant, si vous changez de salon après ça, le salon se reconnecte *et* active le chiffrement (ce que vous voyez dans les messages de la console). C'est un bug. Corrigez-le pour que le fait d'activer la case à cocher entraîne *aussi* la reconnexion au salon.

<Hint>

Une mise en sourdine du *linter* est toujours suspecte. Serait-ce un bug ?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Activer le chiffrement
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Bienvenue dans le salon {roomId} !</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ 🔐 Connexion au salon « ' + roomId + ' »... (chiffrée)');
    },
    disconnect() {
      console.log('❌ 🔐 Déconnexion du salon « ' + roomId + ' »... (chiffrée)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' »... (non chiffrée)');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' »... (non chiffrée)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Si vous réactivez le *linter*, il vous indiquera une erreur. Le problème est que `createConnection` est une prop, c'est donc une valeur réactive. Elle peut changer au cours du temps (et ce sera en effet le cas : quand l'utilisateur clique sur la case à cocher, le composant parent passe une valeur différente de la prop `createConnection`) ! C'est pour ça qu'elle doit être une dépendance. Il faut donc l'inclure dans la liste pour corriger le bug :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Activer le chiffrement
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Bienvenue dans le salon {roomId} !</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ 🔐 Connexion au salon « ' + roomId + ' »... (chiffrée)');
    },
    disconnect() {
      console.log('❌ 🔐 Déconnexion du salon « ' + roomId + ' »... (chiffrée)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' »... (non chiffrée)');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' »... (non chiffrée)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Il est vrai que `createConnection` est une dépendance. Toutefois, ce code est un peu fragile car quelqu'un pourrait changer le composant `App` pour transmettre une fonction définie à la volée comme valeur pour cette prop. Dans ce cas, sa valeur serait différente à chaque fois que le composant `App` fait son rendu, donc l'Effet pourrait se resynchroniser trop souvent. Pour éviter ça, vous pouvez plutôt transmettre `isEncrypted` :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Activer le chiffrement
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Bienvenue dans le salon {roomId} !</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ 🔐 Connexion au salon « ' + roomId + ' »... (chiffrée)');
    },
    disconnect() {
      console.log('❌ 🔐 Déconnexion du salon « ' + roomId + ' »... (chiffrée)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' »... (non chiffrée)');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' »... (non chiffrée)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Dans cette version, le composant `App` transmet une prop booléenne plutôt qu'une fonction. Au sein de l'Effet, vous choisissez quelle fonction utiliser. Puisque `createEncryptedConnection` et `createUnencryptedConnection` sont toutes les deux définies en dehors du composant, elles ne sont pas réactives et n'ont pas besoin d'être des dépendances. Vous en saurez plus à ce sujet dans [Alléger les dépendances des Effets](/learn/removing-effect-dependencies).

</Solution>

#### Remplir une série de listes déroulantes {/*populate-a-chain-of-select-boxes*/}

Dans cet exemple, il y a deux listes déroulantes. La première permet à l'utilisateur de choisir une planète. La seconde lui permet de sélectionner un endroit *sur cette planète*. Cette dernière ne fonctionne pas encore. Votre tâche consiste à afficher les lieux pour la planète choisie.

Regardez comment fonctionne la première liste déroulante. Elle remplit l'état `planetList` avec le résultat de l'appel à l'API `"/planets"`. L'identifiant de la planète sélectionnée est conservé dans la variable d'état `planetId`. Vous devez trouver où ajouter du code pour que la variable d'état `placeList` soit remplie avec le résultat de l'appel à l'API `"/planets/" + planetId + "/places"`.

Si vous implémentez ça correctement, choisir une planète doit remplir la liste des lieux. Changer de planète doit modifier cette liste.

<Hint>

Si vous avez deux processus de synchronisation différents, vous devez écrire deux Effets distincts.

</Hint>

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log("Récupération d’une liste de planètes.");
        setPlanetList(result);
        setPlanetId(result[0].id); // Sélection de la première planète
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        Choisissez une planète :{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Choisissez un lieu :{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>Vous allez à : {placeId || '???'} sur {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Terre'
      }, {
        id: 'venus',
        name: 'Vénus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Espagne'
        }, {
          id: 'vietnam',
          name: 'Viêt Nam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Il y a deux processus de synchronisation distincts :

- La première liste déroulante est synchronisée avec la liste des planètes.
- La seconde est synchronisée avec la liste des lieux pour la `planetId` choisie.

C'est pourquoi il est logique de les décrire comme deux Effets distincts. Voici un exemple de ce que vous pouvez faire :

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log("Récupération d’une liste de planètes.");
        setPlanetList(result);
        setPlanetId(result[0].id); // Sélection de la première planète
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // Rien n’est choisi dans la première liste
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Récupération de la liste des lieux sur « ' + planetId + ' ».');
        setPlaceList(result);
        setPlaceId(result[0].id); // Sélection du premier lieu
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        Choisissez une planète :{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Choisissez un lieu :{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>Vous allez à : {placeId || '???'} sur {planetId || '???'} </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Terre'
      }, {
        id: 'venus',
        name: 'Vénus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Espagne'
        }, {
          id: 'vietnam',
          name: 'Viêt Nam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Ce code est un tantinet répétitif. Cependant, ce n'est pas une raison pour tout mettre dans un seul Effet ! Si vous faisiez ça, vous devriez combiner les dépendances des deux Effets dans une seule liste, et le changement de la planète entraînerait la récupération de toutes les planètes. Les Effets ne servent pas à réutiliser du code.

Pour limiter la répétition, vous pouvez plutôt extraire une partie de la logique dans un Hook personnalisé `useSelectOptions` comme ceci :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        Choisissez une planète :{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Choisissez un lieu :{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>Vous allez à : {placeId || '...'} sur {planetId || '...'} </p>
    </>
  );
}
```

```js src/useSelectOptions.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Terre'
      }, {
        id: 'venus',
        name: 'Vénus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Espagne'
        }, {
          id: 'vietnam',
          name: 'Viêt Nam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Regardez l'onglet `useSelectOptions.js` dans le bac à sable pour voir son fonctionnement. Dans l'idéal, la plupart des Effets de votre application devraient au final être remplacés par des Hooks personnalisés, qu'ils soient écrits par vous ou par la communauté. Les Hooks personnalisés cachent la logique de synchronisation, de sorte que le composant appelant ne sait rien de l'Effet. Au fur et à mesure que vous travaillerez sur votre appli, vous développerez une palette de Hooks parmi lesquels choisir, et finalement vous n'aurez plus que rarement besoin d'écrire des Effets dans vos composants.

</Solution>

</Challenges>
