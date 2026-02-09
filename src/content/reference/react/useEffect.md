---
title: useEffect
---

<Intro>

`useEffect` est un Hook React qui vous permet de [synchroniser un composant React avec un système extérieur](/learn/synchronizing-with-effects).

```js
useEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useEffect(setup, dependencies?)` {/*useeffect*/}

Appelez `useEffect` à la racine de votre composant pour déclarer un Effet :

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

<<<<<<< HEAD
* `setup` : la fonction contenant la logique de votre Effet.  Votre fonction de mise en place peut par ailleurs renvoyer une fonction de *nettoyage*.  Quand votre composant sera ajouté au DOM, React exécutera votre fonction de mise en place.  Après chaque nouveau rendu dont les dépendances ont changé, React commencera par exécuter votre fonction de nettoyage (si vous en avez fourni une) avec les anciennes valeurs, puis exécutera votre fonction de mise en place avec les nouvelles valeurs.  Une fois votre composant retiré du DOM, React exécutera votre fonction de nettoyage une dernière fois.
=======
* `setup`: The function with your Effect's logic. Your setup function may also optionally return a *cleanup* function. When your [component commits](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom), React will run your setup function. After every commit with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values. After your component is removed from the DOM, React will run your cleanup function.
 
* **optional** `dependencies`: The list of all reactive values referenced inside of the `setup` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is [configured for React](/learn/editor-setup#linting), it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. If you omit this argument, your Effect will re-run after every commit of the component. [See the difference between passing an array of dependencies, an empty array, and no dependencies at all.](#examples-dependencies)
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

* `dependencies` **optionnelles** : la liste des valeurs réactives référencées par le code de `setup`.  Les valeurs réactives comprennent les props, les variables d'état et toutes les variables et fonctions déclarées localement dans le corps de votre composant.  Si votre *linter* est [configuré pour React](/learn/editor-setup#linting), il vérifiera que chaque valeur réactive concernée est bien spécifiée comme dépendance.  La liste des dépendances doit avoir un nombre constant d'éléments et utiliser un littéral défini à la volée, du genre `[dep1, dep2, dep3]`. React comparera chaque dépendance à sa valeur précédente au moyen de la comparaison [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is).  Si vous omettez cet argument, votre Effet sera re-exécuté après chaque rendu du composant. [Découvrez la différence entre passer un tableau de dépendances, un tableau vide ou aucun tableau](#examples-dependencies).

#### Valeur renvoyée {/*returns*/}

`useEffect` renvoie `undefined`.

#### Limitations {/*caveats*/}

* `useEffect` est un Hook, vous pouvez donc uniquement l’appeler **à la racine de votre composant** ou de vos propres Hooks. Vous ne pouvez pas l’appeler à l’intérieur de boucles ou de conditions. Si nécessaire, extrayez un nouveau composant et déplacez l'Effet dans celui-ci.

* Si vous **ne cherchez pas à synchroniser avec un système extérieur**, c'est que [vous n'avez probablement pas besoin d'un Effet](/learn/you-might-not-need-an-effect).

* Quand le Mode Strict est activé, React **appellera une fois de plus votre cycle mise en place + nettoyage, uniquement en développement**, avant la première mise en place réelle.  C'est une mise à l'épreuve pour vérifier que votre logique de nettoyage reflète bien votre logique de mise en place, et décommissionne ou défait toute la mise en place effectuée.  Si ça entraîne des problèmes, [écrivez une fonction de nettoyage](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development).

* Si certaines de vos dépendances sont des objets ou fonctions définies au sein de votre composant, il existe un risque qu'elles **entraînent des exécutions superflues de votre Effet**.  Pour corriger ça, retirez les dépendances superflues sur des [objets](#removing-unnecessary-object-dependencies) et [fonctions](#removing-unnecessary-function-dependencies).  Vous pouvez aussi [extraire les mises à jour d'état](#updating-state-based-on-previous-state-from-an-effect) et la [logique non réactive](#reading-the-latest-props-and-state-from-an-effect) hors de votre Effet.

* Si votre Effet est déclenché par une interaction (telle qu'un clic), **React est susceptible d'exécuter votre Effet avant que le navigateur rafraîchisse l'affichage à l'écran**. Ça garantit que le résultat de l'Effet peut être traité par le système d'événements. Le comportement final est généralement celui souhaité. Cependant, si vous souhaitez différer le travail pour prioriser le rafraîchissement, par exemple s'il contient un appel à `alert()`, vous pouvez utiliser `setTimeout`. Consultez [reactwg/react-18/128](https://github.com/reactwg/react-18/discussions/128) pour en apprendre davantage.

* Même si votre Effet est déclenché par une interaction (telle qu'un clic), **le navigateur est susceptible de rafraîchir l'affichage avant d'avoir traité les mises à jour d'état au sein de votre Effet**.  Le comportement final est généralement celui souhaité.  Cependant, si vous devez empêcher le navigateur de rafraîchir l'affichage tout de suite, remplacez `useEffect` par [`useLayoutEffect`](/reference/react/useLayoutEffect).

* Les Effets **ne sont exécutés que côté client**.  Ils sont ignorés lors du rendu côté serveur.

---

## Utilisation {/*usage*/}

### Se connecter à un système extérieur {/*connecting-to-an-external-system*/}

Certains composants ont besoin de rester connectés au réseau, ou à des API du navigateur, ou à des bibliothèques tierces, tout le temps qu'ils sont à l'écran. Ces systèmes ne sont pas gérés par React, on les qualifie donc de systèmes *extérieurs*.

Afin de [connecter votre composant à un système extérieur](/learn/synchronizing-with-effects), appelez `useEffect` au niveau racine de votre fonction composant :

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

Vous devez passer deux arguments à `useEffect` :

1. Une *fonction de mise en place* avec du <CodeStep step={1}>code de mise en place</CodeStep> qui vous connecte au système.
   - Elle devrait renvoyer une *fonction de nettoyage* avec du <CodeStep step={2}>code de nettoyage</CodeStep> qui vous déconnecte du système.
2. Une <CodeStep step={3}>liste de dépendances</CodeStep> comprenant chaque valeur issue de votre composant que ces fonctions utilisent.

**React appellera vos fonctions de mise en place et de nettoyage chaque fois que nécessaire, ce qui peut survenir plusieurs fois :**

<<<<<<< HEAD
1. Votre <CodeStep step={1}>code de mise en place</CodeStep> est exécuté quand votre composant est ajouté à la page *(montage)*.
2. Après chaque nouveau rendu de votre composant, si les <CodeStep step={3}>dépendances</CodeStep> ont changé :
   - D'abord, votre <CodeStep step={2}>code de nettoyage</CodeStep> est exécuté avec les anciennes props et valeurs d'états.
   - Ensuite, votre <CodeStep step={1}>code de mise en place</CodeStep> est exécuté avec les nouvelles props et valeurs d'états.
3. Votre <CodeStep step={2}>code de nettoyage</CodeStep> est exécuté une dernière fois lorsque votre composant est retiré de l'arborescence de la page *(démontage)*.
=======
1. Your <CodeStep step={1}>setup code</CodeStep> runs when your component is added to the page *(mounts)*.
2. After every commit of your component where the <CodeStep step={3}>dependencies</CodeStep> have changed:
   - First, your <CodeStep step={2}>cleanup code</CodeStep> runs with the old props and state.
   - Then, your <CodeStep step={1}>setup code</CodeStep> runs with the new props and state.
3. Your <CodeStep step={2}>cleanup code</CodeStep> runs one final time after your component is removed from the page *(unmounts).*
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

**Illustrons cette séquence pour l'exemple précédent.**

<<<<<<< HEAD
Lorsque le composant `ChatRoom` ci-dessus sera ajouté à la page, il se connectera au salon de discussion en utilisant les valeurs initiales de `serverUrl` et `roomId`.  Si l'une ou l'autre de ces deux valeurs change suite à un nouveau rendu (peut-être l'utilisateur a-t-il choisi un autre salon dans la liste déroulante), votre Effet *se déconnectera du salon précédent, puis se connectera au nouveau salon*. Lorsque le composant `ChatRoom` sera retiré de la page, votre Effet se déconnectera une dernière fois.
=======
When the `ChatRoom` component above gets added to the page, it will connect to the chat room with the initial `serverUrl` and `roomId`. If either `serverUrl` or `roomId` change as a result of a commit (say, if the user picks a different chat room in a dropdown), your Effect will *disconnect from the previous room, and connect to the next one.* When the `ChatRoom` component is removed from the page, your Effect will disconnect one last time.
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

**Pour [vous aider à repérer des bugs](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed), en développement React exécutera un premier cycle de <CodeStep step={1}>mise en place</CodeStep> et de <CodeStep step={2}>nettoyage</CodeStep>, avant d'exécuter la <CodeStep step={1}>mise en place</CodeStep> nominale.**  C'est une mise à l'épreuve pour vérifier que la logique de votre Effet est implémentée correctement. Si ça entraîne des problèmes, c'est que votre code de nettoyage est manquant ou incomplet. La fonction de nettoyage devrait arrêter ou défaire ce que la fonction de mise en place a initié. La règle à suivre est simple : l'utilisateur ne devrait pas pouvoir faire la différence entre une exécution unique de la mise en place (comme en production) et une séquence *mise en place* → *nettoyage* → *mise en place* (comme en développement). [Explorez les solutions courantes](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development).

**Essayez [d'écrire chaque Effet comme un processus autonome](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) et de [réfléchir à un seul cycle de mise en place / nettoyage à la fois](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective).**  Le fait que votre composant soit en train d'être monté, de se mettre à jour ou d'être démonté ne devrait avoir aucune importance.  Lorsque votre logique de nettoyage reflète correctement celle de mise en place, votre Effet n'a aucun problème avec des exécutions multiples de ses codes de mise en place et de nettoyage.

<Note>

Un Effet vous permet de [garder votre composant synchronisé](/learn/synchronizing-with-effects) avec un système extérieur (tel qu'un service de discussion). Dans ce contexte, *système extérieur* désigne n'importe quel bout de code qui n'est pas géré par React, par exemple :

* Un timer géré par <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep> et <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/fr/docs/Web/API/clearInterval)</CodeStep>.
* Un abonnement sur événement grâce à <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/fr/docs/Web/API/EventTarget/addEventListener)</CodeStep> et <CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/fr/docs/Web/API/EventTarget/removeEventListener)</CodeStep>.
* Une bibliothèque d'animations tierce avec une API du genre <CodeStep step={1}>`animation.start()`</CodeStep> et <CodeStep step={2}>`animation.reset()`</CodeStep>.

**Si vous ne vous connectez pas à un système extérieur, [vous n'avez sans doute pas besoin d'un Effet](/learn/you-might-not-need-an-effect).**

</Note>

<Recipes titleText="Exemples de connexion à un système extérieur" titleId="examples-connecting">

#### Se connecter à un serveur de discussion {/*connecting-to-a-chat-server*/}

Dans cet exemple, le composant `ChatRoom` utilise un Effet pour rester connecté à un système extérieur défini dans `chat.js`.  Appuyez sur « Ouvrir le salon » pour que le composant `ChatRoom` apparaisse.  Ce bac à sable est en mode développement, il y aura donc un cycle supplémentaire de connexion-déconnexion, comme [expliqué ici](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed).  Essayez de changer `roomId` et `serverUrl` en utilisant la liste déroulante et le champ de saisie, et voyez comme l'Effet se reconnecte au salon.  Appuyez sur « Fermer le salon » pour vous déconnecter une dernière fois.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
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
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choisissez le salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">Général</option>
          <option value="travel">Voyage</option>
          <option value="music">Musique</option>
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

<Solution />

#### Écouter un événement global du navigateur {/*listening-to-a-global-browser-event*/}

Dans cet exemple, le système extérieur est le DOM navigateur lui-même.  En temps normal, vous définiriez des gestionnaires d'événements en JSX, mais vous ne pouvez pas écouter des événements de l'objet global [`window`](https://developer.mozilla.org/fr/docs/Web/API/Window) de cette façon.  Un Effet vous permet de vous connecter à l'objet `window` et d'écouter ses événements.  En vous abonnant à l'événement `pointermove`, vous pouvez surveiller la position du curseur (ou du doigt) et mettre à jour le point rouge pour bouger avec lui.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
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
  );
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Déclencher une animation {/*triggering-an-animation*/}

Dans cet exemple, le système extérieur est la bibliothèque d'animation dans `animation.js`.  Elle fournit une classe JavaScript appelée `FadeInAnimation` qui prend un nœud DOM comme argument et expose des méthodes `start()` et `stop()` pour contrôler l'animation.  Ce composant [utilise une ref](/learn/manipulating-the-dom-with-refs) pour accéder au nœud DOM sous-jacent.  L'Effet lit le nœud DOM depuis la ref et démarre automatiquement l'animation pour ce nœud lorsque le composant apparaît.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Bienvenue
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Retirer' : 'Afficher'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Sauter à la fin
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Commencer l'animation
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // Il nous reste des étapes à afficher
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
```

</Sandpack>

<Solution />

#### Contrôler une boîte de dialogue modale {/*controlling-a-modal-dialog*/}

Dans cet exemple, le système extérieur est le DOM navigateur. Le composant `ModalDialog` utilise un élément [`<dialog>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/dialog). Il utilise un Effet pour synchroniser la prop `isOpen` avec les appels aux méthodes [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) et [`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close).

<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Ouvrir le dialogue
      </button>
      <ModalDialog isOpen={show}>
        Salut !
        <br />
        <button onClick={() => {
          setShow(false);
        }}>Fermer</button>
      </ModalDialog>
    </>
  );
}
```

```js src/ModalDialog.js active
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Surveiller la visibilité d'un élément {/*tracking-element-visibility*/}

Dans cet exemple, le système extérieur est encore le DOM navigateur. Le composant `App` affiche une longue liste, puis un composant `Box`, et enfin une autre longue liste.  Faites défiler la liste vers le bas.  Voyez comment, lorsque le composant `Box` devient entièrement visible à l'écran, la couleur de fond passe au noir.  Pour implémenter ça, le composant `Box` utilise un Effet pour gérer un [`IntersectionObserver`](https://developer.mozilla.org/fr/docs/Web/API/Intersection_Observer_API). Cette API navigateur vous notifie lorsque l'élément DOM est visible dans la zone de rendu de la fenêtre.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Élément #{i} (continuez à défiler)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Enrober vos Effets dans des Hooks personnalisés {/*wrapping-effects-in-custom-hooks*/}

Les Effets sont une [« échappatoire »](/learn/escape-hatches) : vous vous en servez pour « sortir de React », et lorsqu'il n'y a pas de meilleure solution disponible pour votre cas de figure.  Si vous vous retrouvez à souvent écrire manuellement des Effets, c'est généralement le signe que vous devriez en extraire certains sous forme de [Hooks personnalisés](/learn/reusing-logic-with-custom-hooks) pour les comportements courants dont vous équipez vos composants.

Par exemple, ce Hook personnalisé `useChatRoom` « masque » toute la logique de votre Effet derrière une API plus déclarative.

```js {1,11}
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Vous pouvez dès lors l'utiliser dans n'importe quel composant, comme ceci :

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

L'écosystème React propose de nombreux excellents Hooks personnalisés pour tous les besoins.

[Apprenez à enrober vos Effets dans des Hooks personnalisés](/learn/reusing-logic-with-custom-hooks).

<Recipes titleText="Exemples d’enrobage d’Effets sous forme de Hooks personnalisés">

#### Hook `useChatRoom` personnalisé {/*custom-usechatroom-hook*/}

Cet exemple est identique à un des [exemples précédents](#examples-connecting), mais sa logique est extraite dans un Hook personnalisé.

<Sandpack>

```js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

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
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choisissez le salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">Général</option>
          <option value="travel">Voyage</option>
          <option value="music">Musique</option>
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

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
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

<Solution />

#### Hook `useWindowListener` personnalisé {/*custom-usewindowlistener-hook*/}

Cet exemple est identique à un des [exemples précédents](#examples-connecting), mais sa logique est extraite dans un Hook personnalisé.

<Sandpack>

```js
import { useState } from 'react';
import { useWindowListener } from './useWindowListener.js';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListener('pointermove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
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
  );
}
```

```js src/useWindowListener.js
import { useState, useEffect } from 'react';

export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Hook `useIntersectionObserver` personnalisé {/*custom-useintersectionobserver-hook*/}

Cet exemple est identique à un des [exemples précédents](#examples-connecting), mais sa logique est extraite dans un Hook personnalisé.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Élément #{i} (continuez à défiler)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver.js';

export default function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
   if (isIntersecting) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

```js src/useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isIntersecting;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Contrôler un widget non géré par React {/*controlling-a-non-react-widget*/}

Il peut arriver que vous souhaitiez garder un système extérieur synchronisé avec la valeur d'une prop ou d'un état de votre composant.

Imaginons par exemple que vous ayez un widget tiers de cartographie, ou un composant de lecture vidéo écrit sans React ; vous pouvez utiliser un Effet pour en appeler les méthodes afin que son état soit raccord avec l'état local de votre composant React.  L'Effet ci-dessous crée une instance de la classe `MapWidget` définie dans `map-widget.js`.  Lorsque vous modifiez la prop `zoomLevel` du composant `Map`, l'Effet appelle la méthode `setZoom()` sur l'instance pour la garder synchronisée !

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
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

```js src/App.js
import { useState } from 'react';
import Map from './Map.js';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <>
      Niveau de zoom : {zoomLevel}x
      <button onClick={() => setZoomLevel(zoomLevel + 1)}>+</button>
      <button onClick={() => setZoomLevel(zoomLevel - 1)}>−</button>
      <hr />
      <Map zoomLevel={zoomLevel} />
    </>
  );
}
```

```js src/Map.js active
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export class MapWidget {
  constructor(domNode) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      touchZoom: false,
      zoomSnap: 0.1
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.map.setView([0, 0], 0);
  }
  setZoom(level) {
    this.map.setZoom(level);
  }
}
```

```css
button { margin: 5px; }
```

</Sandpack>

Dans cet exemple, nous n'avons pas besoin d'une fonction de nettoyage parce que la classe `MapWidget` ne gère que le nœud DOM qui lui a été passé.  Après que le composant React `Map` aura été retiré de l'arborescence, tant le nœud DOM que l'instance de `MapWidget` seront automatiquement nettoyés par le *garbage collector* du moteur JavaScript du navigateur.

---

### Charger des données avec les Effets {/*fetching-data-with-effects*/}

<<<<<<< HEAD
Vous pouvez utiliser un Effet pour charger des données pour votre composant.  Remarquez que [si vous utilisez un framework](/learn/start-a-new-react-project#production-grade-react-frameworks), il sera nettement préférable d'utiliser les mécanismes de chargement de données de votre framework plutôt que le faire manuellement dans des Effets, notamment pour des questions de performances.
=======
You can use an Effect to fetch data for your component. Note that [if you use a framework,](/learn/creating-a-react-app#full-stack-frameworks) using your framework's data fetching mechanism will be a lot more efficient than writing Effects manually.
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

Si vous souhaitez charger des données manuellement depuis votre Effet, votre code ressemblera à ceci :

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

Remarquez la variable `ignore`, qui est initialisée à `false` mais mise à `true` lors du nettoyage.  Ça garantit que [votre code ne souffrira pas de *“race conditions”*](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) : les réponses réseau pourraient arriver dans un ordre différent de celui de vos envois de requêtes.

<Sandpack>

{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [9]}} src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Clara">Clara</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Chargement...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Voici la bio de ' + person + '.');
    }, delay);
  })
}
```

</Sandpack>

Vous pouvez aussi le réécrire en utilisant la syntaxe [`async` / `await`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/async_function), mais il vous faudra quand même une fonction de nettoyage :

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Clara">Clara</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Chargement...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Voici la bio de ' + person + '.');
    }, delay);
  })
}
```

</Sandpack>

Implémenter le chargement de données directement dans les Effets devient vite répétitif et complexifie l'ajout ultérieur d'optimisations telles que la mise en cache ou le rendu côté serveur. [Il est plus facile d'utiliser un Hook personnalisé — qu'il soit de vous ou maintenu par la communauté](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks).

<DeepDive>

#### Que préférer au chargement de données dans les Effets ? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Écrire nos appels `fetch` dans les Effets constitue [une façon populaire de charger des données](https://www.robinwieruch.de/react-hooks-fetch-data/), en particulier pour des applications entièrement côté client.  Il s’agit toutefois d’une approche de bas niveau qui comporte plusieurs inconvénients significatifs :

- **Les Effets ne fonctionnent pas côté serveur.**  Ça implique que le HTML rendu côté serveur avec React proposera un état initial sans données chargées. Le poste client devra télécharger tout le JavaScript et afficher l’appli pour découvrir seulement alors qu’il lui faut aussi charger des données. Ce n’est pas très efficace.
- **Charger depuis les Effets entraîne souvent des « cascades réseau ».** On affiche le composant parent, il charge ses données, affiche ses composants enfants, qui commencent seulement alors à charger leurs propres données.  Si le réseau n’est pas ultra-rapide, cette séquence est nettement plus lente que le chargement parallèle de toutes les données concernées.
- **Charger depuis les Effets implique généralement l’absence de pré-chargement ou de cache des données.**  Par exemple, si le composant est démonté puis remonté, il lui faudrait charger à nouveau les données dont il a besoin.
- **L’ergonomie n’est pas top.**  Écrire ce genre d’appels `fetch` manuels nécessite pas mal de code générique, surtout lorsqu’on veut éviter des bugs tels que les [*race conditions*](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect).

Cette liste d’inconvénients n’est d’ailleurs pas spécifique à React.  Elle s’applique au chargement de données lors du montage quelle que soit la bibliothèque.  Comme pour le routage, bien orchestrer son chargement de données est un exercice délicat, c’est pourquoi nous vous recommandons plutôt les approches suivantes :

<<<<<<< HEAD
- **Si vous utilisez un [framework](/learn/start-a-new-react-project#production-grade-react-frameworks), utilisez son mécanisme intégré de chargement de données.** Les frameworks React modernes ont intégré le chargement de données de façon efficace afin d’éviter ce type d’ornières.
- **Dans le cas contraire, envisagez l’utilisation ou la construction d’un cache côté client.**  Les solutions open-source les plus populaires incluent  [React Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/), et [React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview). Vous pouvez aussi construire votre propre solution, auquel cas vous utiliseriez sans doute les Effets sous le capot, mais ajouteriez la logique nécessaire au dédoublonnement de requêtes, à la mise en cache des réponses, et à l’optimisation des cascades réseau (en préchargeant les données ou en consolidant vers le haut les besoins de données des routes).
=======
- **If you use a [framework](/learn/creating-a-react-app#full-stack-frameworks), use its built-in data fetching mechanism.** Modern React frameworks have integrated data fetching mechanisms that are efficient and don't suffer from the above pitfalls.
- **Otherwise, consider using or building a client-side cache.** Popular open source solutions include [TanStack Query](https://tanstack.com/query/latest/), [useSWR](https://swr.vercel.app/), and [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) You can build your own solution too, in which case you would use Effects under the hood but also add logic for deduplicating requests, caching responses, and avoiding network waterfalls (by preloading data or hoisting data requirements to routes).
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

Vous pouvez continuer à charger les données directement dans les Effets si aucune de ces approches ne vous convient.

</DeepDive>

---

### Spécifier les dépendances réactives {/*specifying-reactive-dependencies*/}

**Remarquez bien que vous ne pouvez pas « choisir » les dépendances de votre Effet.** Chaque <CodeStep step={2}>valeur réactive</CodeStep> utilisée par le code de votre Effet doit être déclarée dans votre liste de dépendances, laquelle découle donc du code environnant :

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // C’est une valeur réactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // Ça aussi

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Cet Effet lit ces valeurs réactives
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ Vous devez donc les lister comme dépendances de votre Effet
  // ...
}
```

Si `serverUrl` ou `roomId` change, votre Effet se reconnectera à la discussion en utilisant leurs valeurs à jour.

**[Les valeurs réactives](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) comprennent les props et toutes les variables et fonctions déclarées directement au sein de votre composant.** Dans la mesure où `roomId` et `serverUrl`sont des valeurs réactives, vous ne pouvez pas les retirer de la liste des dépendances. Si vous tentiez de les retirer et que [votre *linter* est correctement configuré pour React](/learn/editor-setup#linting), il vous l'interdirait :

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has missing dependencies: 'roomId' and 'serverUrl'
  // ...
}
```

**Pour retirer une dépendance, [« prouvez » au *linter* qu'elle n'a *pas besoin* d'être une dépendance](/learn/removing-effect-dependencies#removing-unnecessary-dependencies).**  Par exemple, vous pouvez déplacer `serverUrl` hors de votre composant pour lui prouver qu'elle n'est pas réactive et ne changera pas d'un rendu à l'autre :

```js {1,8}
const serverUrl = 'https://localhost:1234'; // Ce n’est plus une valeur réactive

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Toutes les dépendances sont déclarées
  // ...
}
```

À présent que `serverUrl` n'est plus une valeur réactive (et ne peut plus changer d'un rendu à l'autre), elle n'a plus besoin d'être déclarée comme dépendance. **Si le code de votre Effet n'utilise aucune valeur réactive, sa liste de dépendances devrait être vide (`[]`) :**

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // Ce n’est plus une valeur réactive
const roomId = 'music'; // Ce n’est plus une valeur réactive

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Toutes les dépendances sont déclarées
  // ...
}
```

[Un Effet avec des dépendances vides](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) n'est pas re-exécuté lorsque les valeurs des props ou de l'état de votre composant changent.

<Pitfall>

Si vous avez une base de code existante, vous trouverez peut-être des Effets qui réduisent le *linter* au silence comme ceci :

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Évitez de réduire ainsi le *linter* au silence :
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Lorsque les dépendances ne correspondent pas au code, il y a un risque élevé de bugs.**  En réduisant le *linter* au silence, vous « mentez » à React quant aux valeurs dont dépend votre Effet. [Au lieu de ça, prouvez qu"elles sont superflues](/learn/removing-effect-dependencies#removing-unnecessary-dependencies).

</Pitfall>

<Recipes titleText="Exemples de définitions de dépendances réactives" titleId="examples-dependencies">

#### Passer un tableau de dépendances {/*passing-a-dependency-array*/}

<<<<<<< HEAD
Si vous spécifiez des dépendances, votre Effet est exécuté **après le rendu initial *et* après les nouveaux rendus qui modifient ces dépendances**.
=======
If you specify the dependencies, your Effect runs **after the initial commit _and_ after commits with changed dependencies.**
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // Re-exécuté si a ou b ont changé
```

Dans l'exemple ci-dessous, `serverUrl` et `roomId` sont des [valeurs réactives](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values), qui doivent donc toutes les deux être listées comme dépendances.  Du coup, sélectionner un autre salon dans la liste déroulante ou modifier l'URL du serveur dans le champ de saisie entraînera une reconnexion de la discussion.  En revanche, puisque `message` n'est pas utilisé par l'Effet (et n'est donc pas une dépendance), modifier le message n'entraîne pas de reconnexion.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

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
      <label>
        Votre message :{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choisissez le salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">Général</option>
          <option value="travel">Voyage</option>
          <option value="music">Musique</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Fermer le salon' : 'Ouvrir le salon'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
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
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Passer un tableau de dépendances vide {/*passing-an-empty-dependency-array*/}

<<<<<<< HEAD
Si votre Effet n'utilise effectivement aucune valeur réactive, il ne s'exécutera **qu'après le rendu initial**.
=======
If your Effect truly doesn't use any reactive values, it will only run **after the initial commit.**
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

```js {3}
useEffect(() => {
  // ...
}, []); // Exécuté une seule fois (deux en développement)
```

**Même avec des dépendances vides, la mise en place et le nettoyage seront [exécutés une fois de plus en développement](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) pour vous aider à repérer d'éventuels bugs.**

Dans cet exemple, `serverUrl` et `roomId` sont tous les deux codés en dur.  Puisqu'ils sont déclarés hors du composant, ils ne constituent pas des valeurs réactives, et ne sont donc pas des dépendances. La liste de dépendances est vide, de sorte que l'Effet n'est pas re-exécuté lors des rendus ultérieurs.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <>
      <h1>Bienvenue dans le salon {roomId} !</h1>
      <label>
        Votre message :{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
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

</Sandpack>

<Solution />


#### Ne pas passer de dépendances du tout {/*passing-no-dependency-array-at-all*/}

<<<<<<< HEAD
Si vous ne passez aucun tableau de dépendances, votre Effet sera exécuté **après chaque rendu (rendu initial comme rendus ultérieurs)** de votre composant.
=======
If you pass no dependency array at all, your Effect runs **after every single commit** of your component.
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

```js {3}
useEffect(() => {
  // ...
}); // Exécuté à chaque fois
```

Dans cet exemple, l'Effet est re-exécuté quand vous changez `serverUrl` ou `roomId`, ce qui est logique.  Cependant, il est *aussi* re-exécuté lorsque vous modifiez `message`, ce qui n'est sans doute pas souhaitable.  C'est pourquoi il vous faut spécifier un tableau de dépendances.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }); // Aucun tableau de dépendances

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
      <label>
        Votre message :{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choisissez le salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">Général</option>
          <option value="travel">Voyage</option>
          <option value="music">Musique</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Fermer le salon' : 'Ouvrir le salon'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
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
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Mettre à jour l'état sur base d'un état précédent, au sein d'un Effet {/*updating-state-based-on-previous-state-from-an-effect*/}

Lorsque vous souhaitez mettre à jour l'état sur base d'un état précédent depuis un Effet, vous risquez de rencontrer un problème :

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // Vous souhaitez incrémenter le compteur à chaque seconde...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... mais préciser `count` comme dépendance réinitialise l'intervalle à chaque fois.
  // ...
}
```

Dans la mesure où `count` est une valeur réactive, elle doit figurer dans la liste des dépendances. Pourtant, ça force l'Effet à se nettoyer et se remettre en place chaque fois que `count` change.  C'est loin d'être idéal.

Pour corriger ça, [passez une fonction de mise à jour d'état `c => c + 1`](/reference/react/useState#updating-state-based-on-the-previous-state) à `setCount` :

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ Passe une fonction de mise à jour
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ count n’est plus une dépendance

  return <h1>{count}</h1>;
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Maintenant que vous passez `c => c + 1` au lieu de `count + 1`, [votre Effet n'a plus besoin de dépendre de `count`](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state).  En conséquence, il n'aura plus besoin de nettoyer et remettre en place l'intervalle chaque fois que `count` change.

---


### Supprimer des dépendances objets superflues {/*removing-unnecessary-object-dependencies*/}

<<<<<<< HEAD
Si votre Effet dépend d'un objet ou d'une fonction créée lors du rendu, il s'exécutera sans doute trop souvent. Par exemple, cet Effet se reconnecte à chaque rendu parce que l'objet `options` [est en réalité un objet différent à chaque rendu](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally) :
=======
If your Effect depends on an object or a function created during rendering, it might run too often. For example, this Effect re-connects after every commit because the `options` object is [different for every render:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 Cet objet est (re)créé à chaque rendu
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // L’Effet l’utilise
    connection.connect();
    return () => connection.disconnect();
<<<<<<< HEAD
  }, [options]); // 🚩 Les dépendances sont donc différentes à chaque rendu
=======
  }, [options]); // 🚩 As a result, these dependencies are always different on a commit
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75
  // ...
```

Évitez d'utiliser un objet créé lors du rendu comme dépendance.  Préférez créer cet objet au sein de l'Effet :

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
        Choisissez le salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">Général</option>
          <option value="travel">Voyage</option>
          <option value="music">Musique</option>
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

Maintenant que vous créez l'objet `options` au sein de l'Effet, l'Effet lui-même ne dépend plus que de la chaîne de caractères `roomId`.

Grâce à ce correctif, modifier la saisie ne reconnecte pas la discussion.  Contrairement à un objet créé de frais à chaque fois, un texte comme `roomId` ne change pas tant qu'on n'en modifie pas la valeur. [Apprenez-en davantage sur l'allègement des dépendances](/learn/removing-effect-dependencies).

---

### Supprimer des dépendances fonctions superflues {/*removing-unnecessary-function-dependencies*/}

Si votre Effet dépend d'un objet ou d'une fonction créée lors du rendu, il s'exécutera sans doute trop souvent. Par exemple, cet Effet se reconnecte à chaque rendu parce que la fonction `createOptions` [est une fonction différente à chaque rendu](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally) :

<<<<<<< HEAD
=======
If your Effect depends on an object or a function created during rendering, it might run too often. For example, this Effect re-connects after every commit because the `createOptions` function is [different for every render:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 Cette fonction est (re)créée à chaque rendu
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // L’Effet l’utilise
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
<<<<<<< HEAD
  }, [createOptions]); // 🚩 Les dépendances sont donc différentes à chaque rendu
  // ...
```

En soi, créer une fonction à chaque rendu n'est pas un problème. Vous n'avez pas besoin d'optimiser ça. Mais si vous l'utilisez comme dépendance d'un Effet, elle forcera votre Effet à être ré-exécuté à chaque rendu.
=======
  }, [createOptions]); // 🚩 As a result, these dependencies are always different on a commit
  // ...
```

By itself, creating a function from scratch on every re-render is not a problem. You don't need to optimize that. However, if you use it as a dependency of your Effect, it will cause your Effect to re-run after every commit.
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

Évitez d'utiliser une fonction créée lors du rendu comme dépendance.  Déclarez-la plutôt au sein de l'Effet :

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
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
        Choisissez le salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">Général</option>
          <option value="travel">Voyage</option>
          <option value="music">Musique</option>
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

Maintenant que vous déclarez la fonction `createOptions` au sein de l'Effet, l'Effet lui-même ne dépend plus que de la chaîne de caractères `roomId`.

Grâce à ce correctif, modifier la saisie ne reconnecte pas la discussion.  Contrairement à une fonction créée de frais à chaque fois, un texte comme `roomId` ne change pas tant qu'on n'en modifie pas la valeur. [Apprenez-en davantage sur l'allègement des dépendances](/learn/removing-effect-dependencies).

---

### Lire les dernières props et états à jour depuis un Effet {/*reading-the-latest-props-and-state-from-an-effect*/}

<<<<<<< HEAD
<Wip>

Cette section décrit une **API expérimentale : elle n’a donc pas encore été livrée** dans une version stable de React.

</Wip>

Par défaut, lorsque vous lisez une valeur réactive depuis un Effet, vous devez l'ajouter comme dépendance. Ça garantit que votre Effet « réagit » à chaque modification de cette valeur.  Pour la plupart des dépendances, c'est bien le comportement que vous souhaitez.
=======
By default, when you read a reactive value from an Effect, you have to add it as a dependency. This ensures that your Effect "reacts" to every change of that value. For most dependencies, that's the behavior you want.
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

**Toutefois, il peut arriver que vous souhaitiez lire les *dernières* valeurs à jour de props ou d'états depuis un Effet, sans pour autant y « réagir ».**  Imaginons par exemple que vous souhaitiez afficher en console le nombre d'éléments dans le panier d'achats à chaque visite de la page :

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ Toutes les dépendances sont déclarées
  // ...
}
```

<<<<<<< HEAD
**Et si vous vouliez afficher une visite de page après chaque modification de `url`, mais *pas* lorsque seul `shoppingCart` change ?**  Vous ne pouvez pas exclure `shoppingCart` de vos dépendances sans enfreindre les [règles de la réactivité](#specifying-reactive-dependencies).  En revanche, vous pouvez exprimer que vous *ne souhaitez pas* qu'un bout de votre code « réagisse » aux changements, même s'il est appelé depuis un Effet. [Déclarez un *Événement d'Effet*](/learn/separating-events-from-effects#declaring-an-effect-event) avec le Hook [`useEffectEvent`](/reference/react/experimental_useEffectEvent), et déplacez le code qui consulte `shoppingCart` à l'intérieur :
=======
**What if you want to log a new page visit after every `url` change, but *not* if only the `shoppingCart` changes?** You can't exclude `shoppingCart` from dependencies without breaking the [reactivity rules.](#specifying-reactive-dependencies) However, you can express that you *don't want* a piece of code to "react" to changes even though it is called from inside an Effect. [Declare an *Effect Event*](/learn/separating-events-from-effects#declaring-an-effect-event) with the [`useEffectEvent`](/reference/react/useEffectEvent) Hook, and move the code reading `shoppingCart` inside of it:
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Toutes les dépendances sont déclarées
  // ...
}
```

**Les Événements d'Effets ne sont pas réactifs et doivent toujours être omis des dépendances de votre Effet.**  C'est ce qui vous permet d'y mettre du code non réactif (qui peut donc lire la dernière valeur en date de props ou d'états).  En lisant `shoppingCart` au sein de `onVisit`, vous garantissez que `shoppingCart` ne redéclenchera pas votre Effet.

[Découvrez en quoi les Événements d'Effets vous permettent de séparer les codes réactif et non réactif](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events).


---

### Afficher un contenu différent côté serveur et côté client {/*displaying-different-content-on-the-server-and-the-client*/}

<<<<<<< HEAD
Si votre appli utilise du rendu côté serveur (que ce soit [en direct](/reference/react-dom/server) ou *via* un [framework](/learn/start-a-new-react-project#production-grade-react-frameworks)), votre composant fera son rendu dans deux environnements différents. Côté serveur, son rendu produira le HTML initial. Côté client, React exécutera à nouveau le code de rendu pour pouvoir inscrire les gestionnaires d'événements à ce HTML. C'est pourquoi, afin que [l'hydratation](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) puisse fonctionner, votre résultat de rendu initial doit être identique côté client et côté serveur.
=======
If your app uses server rendering (either [directly](/reference/react-dom/server) or via a [framework](/learn/creating-a-react-app#full-stack-frameworks)), your component will render in two different environments. On the server, it will render to produce the initial HTML. On the client, React will run the rendering code again so that it can attach your event handlers to that HTML. This is why, for [hydration](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) to work, your initial render output must be identical on the client and the server.
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75

Dans de rares cas, vous pourriez avoir besoin de produire des contenus distincts côté client. Disons par exemple que votre appli lit certaines données depuis [`localStorage`](https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage), il ne peut clairement pas faire ça côté serveur.  Voici comment vous implémenteriez ça :


{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [5]}}
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... renvoi du JSX pour le client seulement ...
  }  else {
    // ... renvoi du JSX initial ...
  }
}
```

Pendant que l'appli charge, l'utilisateur voit le résultat du rendu initial. Puis, lorsqu'elle sera chargée et hydratée, votre Effet sera exécuté et définira `didMount` à `true`, ce qui déclenchera un nouveau rendu. On basculera alors sur le résultat de rendu pour le client seulement. Les Effets ne sont pas exécutés côté serveur, c'est pourquoi `didMount` resterait à `false` lors du rendu initial.

N'abusez pas de cette astuce.  Gardez à l'esprit que les utilisateurs avec des connexions lentes verront le contenu initial pendant un bon bout de temps — jusqu'à plusieurs secondes — et qu'il faudrait donc éviter d'appliquer au final des changements trop drastiques dans l'apparence de votre composant.  Le plus souvent, vous pourrez éviter de recourir à cette approche en utilisant des affichages conditionnels *via* CSS.

---

## Dépannage {/*troubleshooting*/}

### Mon Effet est exécuté deux fois au montage du composant {/*my-effect-runs-twice-when-the-component-mounts*/}

Lorsque le Mode Strict est activé, en développement, React exécutera une première fois la mise en place et le nettoyage, avant la mise en place effective.

C'est une mise à l'épreuve pour vérifier que la logique de votre Effet est implémentée correctement. Si ça entraîne des problèmes, c'est que votre code de nettoyage est manquant ou incomplet. La fonction de nettoyage devrait arrêter ou défaire ce que la fonction de mise en place a initié. La règle à suivre est simple : l'utilisateur ne devrait pas pouvoir faire la différence entre une exécution unique de la mise en place (comme en production) et une séquence *mise en place* → *nettoyage* → *mise en place* (comme en développement).

Découvrez [en quoi ça vous aide à repérer des bugs](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) et [comment corriger votre code](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development).

---

### Mon Effet est exécuté après chaque rendu {/*my-effect-runs-after-every-re-render*/}

Commencez par vérifier que vous n'avez pas oublié de spécifier le tableau des dépendances :

```js {3}
useEffect(() => {
  // ...
<<<<<<< HEAD
}); // 🚩 Aucun tableau de dépendance : exécuté après chaque rendu !
=======
}); // 🚩 No dependency array: re-runs after every commit!
>>>>>>> bd87c394dc1daf0e54759126f847fcfa927e5a75
```

Si vous avez spécifié un tableau de dépendances et que votre Effet persiste à s'exécuter en boucle, c'est parce qu'une de vos dépendances est différente à chaque rendu.

Vous pouvez déboguer ce problème en affichant vos dépendances en console :

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

Vous pouvez alors cliquer bouton droit, dans la console, sur les tableaux issus de différents rendus et sélectionner « Stocker objet en tant que variable globale » pour chacun d'entre eux.  En supposant que vous avez stocké le premier en tant que `temp1` et le second en tant que `temp2`, vous pouvez alors utiliser la console du navigateur pour vérifier si chaque dépendance des tableaux est identique :

```js
Object.is(temp1[0], temp2[0]); // La première dépendance est-elle inchangée ?
Object.is(temp1[1], temp2[1]); // La deuxième dépendance est-elle inchangée ?
Object.is(temp1[2], temp2[2]); // ... et ainsi de suite pour chaque dépendance ...
```

Lorsque vous aurez repéré la dépendance qui diffère d'un rendu à l'autre, vous pouvez généralement corriger ça de l'une des manières suivantes :

- [Mettre à jour l'état sur base d'un état précédent, au sein d'un Effet](#updating-state-based-on-previous-state-from-an-effect)
- [Supprimer des dépendances objets superflues](#removing-unnecessary-object-dependencies)
- [Supprimer des dépendances fonctions superflues](#removing-unnecessary-function-dependencies)
- [Lire les dernières props et états à jour depuis un Effet](#reading-the-latest-props-and-state-from-an-effect)

En tout dernier recours (si aucune de ces approches n'a résolu le souci), enrobez la création de la dépendance avec [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook) (ou [`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often) pour les fonctions).

---

### Mon Effet n'arrête pas de se re-exécuter {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

Si votre Effet s'exécute en boucle infinie, deux choses devraient se passer :

- Votre Effet met à jour un état.
- Cet état entraîne un nouveau rendu, qui modifie les dépendances de votre Effet.

Avant de vous attaquer à la résolution de ce problème, demandez-vous si votre Effet se connecte à un système extérieur (tel que le DOM, le réseau, un widget tiers, etc.). Pourquoi votre Effet a-t-il besoin de modifier l'état ? Se synchronise-t-il avec un système extérieur ? Ou essayez-vous de gérer le flux de données de votre application avec ça ?

S'il n'y a pas de système extérieur, envisagez de [retirer carrément l'Effet](/learn/you-might-not-need-an-effect) pour simplifier votre logique.

Si vous vous synchronisez effectivement avec un système extérieur, réfléchissez aux conditions dans lesquelles votre Effet devrait mettre à jour l'état. Quelque chose a-t-il changé qui impacte le résultat visuel de votre composant ? Si vous devez surveiller certaines données inutilisées par le rendu, une [ref](/reference/react/useRef#referencing-a-value-with-a-ref) (qui ne redéclenche pas de rendu) serait peut-être plus appropriée.  Vérifiez que votre Effet ne met pas à jour l'état (entraînant un nouveau rendu) plus que nécessaire.

Pour finir, si votre Effet met à jour l'état au bon moment, mais qu'il y a tout de même une boucle, c'est sans doute parce que la mise à jour de l'état entraîne la modification d'une des dépendances de l'Effet. [Voyez comment déboguer les modifications de dépendances](#my-effect-runs-after-every-re-render).

---

### Ma logique de nettoyage est exécutée alors que mon composant n'a pas été démonté {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

La fonction de nettoyage n'est pas exécutée seulement lors du démontage, mais avant chaque nouveau rendu dont les dépendances ont changé.  Qui plus est, en développement, React [exécute la mise en place et le nettoyage une fois de plus juste après le montage du composant](#my-effect-runs-twice-when-the-component-mounts).

Si vous avez du code de nettoyage qui ne correspond à aucun code de mise en place, c'est généralement mauvaise signe :

```js {2-5}
useEffect(() => {
  // 🔴 À éviter : code de nettoyage sans mise en place correspondante
  return () => {
    doSomething();
  };
}, []);
```

Votre code de nettoyage devrait refléter celui de mise en place, qu'il devrait arrêter ou défaire :

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[Apprenez en quoi le cycle de vie des Effets diffère de celui des composants](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect).

---

### Mon Effet fait un truc visuel, et l'affichage vacille avant son exécution {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

Si votre Effet doit empêcher le navigateur de [rafraîchir immédiatement l'affichage à l'écran](/learn/render-and-commit#epilogue-browser-paint), remplacez `useEffect` par [`useLayoutEffect`](/reference/react/useLayoutEffect). Remarquez que **ça ne devrait concerner qu'une toute petite minorité de cas**.  Vous n'aurez besoin de ça que lorsqu'il est crucial que votre Effet soit exécuté avant le rafraîchissement par le navigateur ; par exemple, pour mesurer et positionner une infobulle avant que l'utilisateur ne la voie.
