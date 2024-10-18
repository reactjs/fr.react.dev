---
title: 'Synchroniser grâce aux Effets'
---

<Intro>

Certains composants ont besoin de se synchroniser avec des systèmes tiers. Par exemple, vous pourriez vouloir contrôler un composant non-React sur la base d’un état React, mettre en place une connexion à un serveur, ou envoyer des données analytiques lorsqu’un composant apparaît à l’écran. Les *Effets* vous permettent d’exécuter du code après le rendu, de façon à synchroniser votre composant avec un système extérieur à React.

</Intro>

<YouWillLearn>

- Ce que sont les Effets
- En quoi les Effets diffèrent des événements
- Comment déclarer un Effet dans votre composant
- Comment éviter de ré-exécuter inutilement un Effet
- Pourquoi les Effets sont exécutés deux fois en développement, et comment les corriger

</YouWillLearn>

## Qu’est-ce qu’un Effet, et en quoi ça diffère d’un événement ? {/*what-are-effects-and-how-are-they-different-from-events*/}

Avant d’étudier les Effets, vous devez être à l’aise avec deux types de code dans les composants React :

- **Le code de rendu** (présenté dans [Décrire l’UI](/learn/describing-the-ui)) vit au niveau racine de votre composant.  C’est là que vous récupérez les props et l’état, les transformez et renvoyez du JSX décrivant ce que vous voulez voir à l’écran. [Le code de rendu doit être pur](/learn/keeping-components-pure).  Comme une formule mathématique, il doit se contenter de *calculer* le résultat, un point c’est tout.

- **Les gestionnaires d’événements** (présentés dans [Ajouter de l’interactivité](/learn/adding-interactivity)) sont des fonctions locales à vos composants qui *font* des choses, plutôt que juste calculer des résultats. Un gestionnaire d’événement pourrait mettre à jour un champ de saisie, envoyer une requête HTTP POST pour acheter un produit, ou emmener l’utilisateur vers un nouvel écran. Les gestionnaires d’événements déclenchent des [« effets de bord »](https://fr.wikipedia.org/wiki/Effet_de_bord_(informatique)) (ils modifient l’état du programme) en réponse à une action utilisateur spécifique (par exemple un clic sur un bouton ou une saisie clavier).

Mais parfois, ça ne suffit pas.  Imaginez un composant `ChatRoom` qui doit se connecter à un serveur de discussion dès qu’il devient visible à l’écran.  La connexion au serveur ne constitue pas un calcul pur (c’est un effet de bord), elle ne doit donc pas survenir pendant le rendu.  Et pourtant, il n’existe pas d’événement particulier (tel qu’un clic) pour signifier que `ChatRoom` devient visible.

**Les *Effets* vous permettent de spécifier des effets de bord causés par le rendu lui-même, plutôt que par un événement particulier.**  Envoyer un message dans la discussion est un *événement*, parce que c’est directement lié au fait que l’utilisateur a cliqué sur un bouton précis.  En revanche, mettre en place la connexion au serveur est un *Effet* parce que ça doit se produire quelle que soit l’interaction qui a entraîné l’affichage du composant. Les Effets sont exécutés à la fin de la phase de [commit](/learn/render-and-commit), après que l’écran a été mis à jour.  C’est le bon moment pour synchroniser les composants React avec des systèmes extérieurs (comme par exemple le réseau ou une bibliothèque tierce).

<Note>

Dans cette page, le terme « Effet » avec une initiale majuscule fait référence à la définition ci-dessus, spécifique à React : un effet de bord déclenché par le rendu.  Pour parler du concept plus général de programmation, nous utilisons le terme « effet de bord ».

</Note>

## Vous n’avez pas forcément besoin d’un Effet {/*you-might-not-need-an-effect*/}

**Ne vous précipitez pas pour ajouter des Effets à vos composants.**  Gardez à l’esprit que les Effets sont généralement utilisés pour « sortir » de votre code React et vous synchroniser avec un système *extérieur*.  Ça inclut les API du navigateur, des *widgets* tiers, le réseau, etc.  Si votre Effet se contente d’ajuster des variables d’état sur la base d’autres éléments d’état, [vous n’avez pas forcément besoin d’un Effet](/learn/you-might-not-need-an-effect).

## Comment écrire un Effect {/*how-to-write-an-effect*/}

Pour écrire un Effet, suivez ces trois étapes :

1. **Déclarez un Effet.** Par défaut, votre Effet s’exécutera après chaque [commit](/learn/render-and-commit).
2. **Spécifiez les dépendances de l’Effet.** La plupart des Effets ne devraient se ré-exécuter *que si besoin* plutôt qu’après chaque rendu. Par exemple, une animation de fondu entrant ne devrait se déclencher que pour l’apparition initiale.  La connexion et la déconnexion à un forum de discussion ne devraient survenir que quand le composant apparaît, disparaît, ou change de canal.  Vous apprendrez à contrôler cet aspect en spécifiant des *dépendances*.
3. **Ajoutez du code de nettoyage si besoin.**  Certains Effets ont besoin de décrire comment les arrêter, les annuler, ou nettoyer après eux de façon générale. Par exemple, une connexion implique une déconnexion, un abonnement suppose un désabonnement, et un chargement réseau aura besoin de pouvoir être annulé ou ignoré. Vous apprendrez comment décrire ça en renvoyant une *fonction de nettoyage*.

### Étape 1 : déclarez un Effet {/*step-1-declare-an-effect*/}

Pour déclarer un Effet dans votre composant, importez le [Hook `useEffect`](/reference/react/useEffect) depuis React :

```js
import { useEffect } from 'react';
```

Ensuite, appelez-le au niveau racine de votre composant et placez le code adéquat dans votre Effet :

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // Du code ici qui s’exécutera après *chaque* rendu
  });
  return <div />;
}
```

Chaque fois que le composant calculera son rendu, React mettra l’affichage à jour *et ensuite* exécutera le code au sein du `useEffect`. En d’autres termes, **`useEffect` « retarde » l’exécution de ce bout de code jusqu’à ce que le résultat du rendu se reflète à l’écran.**

Voyons comment vous pouvez utiliser un Effet pour vous synchroniser avec un système extérieur.  Prenons un composant React `<VideoPlayer>`.  Ce serait chouette de pouvoir contrôler son état de lecture (en cours ou en pause) en lui passant une prop `isPlaying` :

```js
<VideoPlayer isPlaying={isPlaying} />
```

Votre composant personnalisé `VideoPlayer` utilise la balise native [`<video>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/video) du navigateur :

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: se servir de isPlaying
  return <video src={src} />;
}
```

Toutefois, la balise `<video>` du navigateur n’a pas d’attribut `isPlaying`.  Le seul moyen d’en contrôler la lecture consiste à appeler manuellement les méthodes [`play()`](https://developer.mozilla.org/fr/docs/Web/API/HTMLMediaElement/play) et [`pause()`](https://developer.mozilla.org/fr/docs/Web/API/HTMLMediaElement/pause) de l’élément du DOM. **Vous devez vous synchroniser avec la valeur de la prop `isPlaying`, qui vous indique si la vidéo *devrait* être en cours de lecture, en appelant `play()` et `pause()` aux moments adéquats.**

Nous allons d’abord avoir [besoin d’une ref](/learn/manipulating-the-dom-with-refs) vers le nœud `<video>` du DOM.

Vous pourriez être tenté·e d’appeler directement `play()` ou `pause()` au sein du rendu, mais ce serait une erreur :

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    // Ces appels sont interdits pendant le rendu.
    ref.current.play();
  } else {
    // En plus, ça plante.
    ref.current.pause();
  }

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

Ce code est incorrect parce qu’il essaie de manipuler le DOM pendant le rendu. Dans React, [le rendu doit être un calcul pur](/learn/keeping-components-pure) de JSX et ne devrait pas contenir d’effets de bord tels qu’une manipulation du DOM.

Qui plus est, quand `VideoPlayer` est appelé pour la première fois, son DOM n’existe pas encore ! Il n’y a pas encore de nœud DOM sur lequel appeler `play()` ou `pause()`, parce que React ne saura quel DOM créer qu’une fois que vous aurez renvoyé le JSX.

La solution consiste à **enrober l’effet de bord avec un `useEffect` pour le sortir du calcul de rendu :**

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

En enrobant la mise à jour du DOM avec un Effet, vous laissez React mettre à jour l’écran d’abord. Ensuite votre Effet s’exécute.

Quand votre composant `VideoPlayer` fait son rendu (que ce soit la première fois ou non), plusieurs choses se passent. Pour commencer, React va mettre l’écran à jour, garantissant ainsi une balise `<video>` dans le DOM avec les bons attributs. Ensuite, React va exécuter votre Effet. Pour finir, votre Effet va appeler `play()` ou `pause()` selon la valeur de `isPlaying`.

Appuyez sur Lecture / Pause plusieurs fois pour vérifier que le lecteur vidéo reste bien synchronisé avec la valeur de `isPlaying` :

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
  });

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

Dans cet exemple, le « système extérieur » que vous avez synchronisé avec l’état React, c’est l’API média du navigateur.  Vous pouvez utiliser une approche similaire pour enrober du code historique non-React (tel que des plugins jQuery) pour en faire des composants React déclaratifs.

Remarquez qu’en pratique le pilotage d’un lecteur vidéo est nettement plus complexe.  L’appel à `play()` pourrait échouer, l’utilisateur pourrait lancer ou stopper la lecture au moyen de contrôles natifs du navigateur, etc.  Cet exemple est très simplifié et incomplet.

<Pitfall>

Par défaut, les Effets s’exécutent après *chaque* rendu.  C’est pourquoi le code suivant **produirait une boucle infinie :**

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

Les Effets s’exécutent *en conséquence* d’un rendu.  Modifier l’état *déclenche* un rendu.  Le modifier au sein d’un Effet, c’est un peu comme brancher une multiprise sur elle-même. L’Effet s’exécute, modifie l’état, ce qui entraîne un nouveau rendu, ce qui déclenche une nouvelle exécution de l’Effet, qui modifie à nouveau l’état, entraînant un nouveau rendu, et ainsi de suite.

Les Effets ne devraient normalement synchroniser vos composants qu’avec des systèmes *extérieurs*.  S’il n’y a pas de système extérieur et que vous voulez seulement ajuster un bout d’état sur base d’un autre, [vous n’avez pas forcément besoin d’un Effet](/learn/you-might-not-need-an-effect).

</Pitfall>

### Étape 2 : spécifiez les dépendances de l’Effet {/*step-2-specify-the-effect-dependencies*/}

Par défaut, les Effets s’exécutent après *chaque* rendu. Souvent pourtant, **ce n’est pas ce que vous voulez** :

- Parfois, c’est lent. La synchronisation avec un système extérieur n’est pas toujours instantanée, aussi vous pourriez vouloir l’éviter si elle est superflue.  Par exemple, vous ne souhaitez pas vous reconnecter au serveur de discussion à chaque frappe clavier.
- Parfois, c’est incorrect. Par exemple, vous ne voulez pas déclencher une animation de fondu entrant à chaque frappe clavier. L’animation ne devrait se dérouler qu’une seule fois, après que le composant apparaît.

Pour mettre ce problème en évidence, revoici l’exemple précédent avec quelques appels à `console.log` en plus, et un champ de saisie textuelle qui met à jour l’état du parent.  Voyez comme la saisie entraîne la ré-exécution de l’Effet :

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Appel à video.play()');
      ref.current.play();
    } else {
      console.log('Appel à video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Vous pouvez dire à React de **sauter les ré-exécutions superflues de l’Effet** en fournissant un tableau de *dépendances* comme second argument lors de l’appel à `useEffect`.  Commencez par ajouter un tableau vide `[]` dans l’exemple précédent, à la ligne 14 :

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

Vous devriez voir une erreur qui dit `React Hook useEffect has a missing dependency: 'isPlaying'` :

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Appel à video.play()');
      ref.current.play();
    } else {
      console.log('Appel à video.pause()');
      ref.current.pause();
    }
  }, []); // Là, on va avoir un problème

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Le souci vient du fait que le code au sein de notre Effet *dépend* de la prop `isPlaying` pour décider quoi faire, mais cette dépendance n’est pas explicitement déclarée.  Pour corriger le problème, ajoutez `isPlaying` dans le tableau des dépendances :

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // On l’utilise ici...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...donc on doit la déclarer ici !
```

À présent que toutes les dépendances sont déclarées, il n’y a plus d’erreur. En spécifiant `[isPlaying]` comme tableau de dépendances, nous disons à React qu’il devrait éviter de ré-exécuter votre Effet si `isPlaying` n’a pas changé depuis le rendu précédent.  Grâce à cet ajustement, la saisie dans le champ n’entraîne plus la ré-exécution de l’Effet, mais activer Lecture / Pause si :

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Appel à video.play()');
      ref.current.play();
    } else {
      console.log('Appel à video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Le tableau de dépendances peut contenir plusieurs dépendances.  React ne sautera la ré-exécution de l’Effet que si *toutes* les dépendances que vous avez spécifiées sont exactement identiques à leurs valeurs du rendu précédent.  React compare les valeurs des dépendances en utilisant le comparateur [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Consultez la [référence de `useEffect`](/reference/react/useEffect#reference) pour davantage de détails.

**Remarquez que vous ne pouvez pas « choisir » vos dépendances.**  Vous aurez une erreur de *linting* si les dépendances que vous spécifiez ne correspondent pas à celles que React attend, sur base de l’analyse du code au sein de votre Effet.  Ça aide à repérer pas mal de bugs dans votre code.  Si vous voulez empêcher la ré-exécution d’un bout de code, [*modifiez le code de l’Effet lui-même* pour ne pas « nécessiter» cette dépendance](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize).

<Pitfall>

Le comportement n’est pas le même entre une absence du tableau de dépendances, et un tableau de dépendances *vide* `[]` :

```js {3,7,11}
useEffect(() => {
  // S’exécute après chaque rendu
});

useEffect(() => {
  // S’exécute uniquement au montage (apparition du composant)
}, []);

useEffect(() => {
  // S’exécute au montage *mais aussi* si a ou b changent depuis le rendu précédent
}, [a, b]);
```

Nous verrons de plus près ce que « montage » signifie lors de la prochaine étape.

</Pitfall>

<DeepDive>

#### Pourquoi n’a-t-on pas ajouté la ref au tableau de dépendances ? {/*why-was-the-ref-omitted-from-the-dependency-array*/}

Cet Effet utilise `isPlaying` *mais aussi* `ref`, pourtant nous avons seulement déclaré `isPlaying` comme dépendance :

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

C’est parce que l’objet `ref` a une *identité stable* : React garantit que [vous aurez toujours le même objet](/reference/react/useRef#returns) comme résultat du même appel `useRef` d’un rendu à l’autre. Il ne changera jamais, et donc n’entraînera jamais par lui-même la ré-exécution de l’Effet. Du coup, l’inclure ou pas ne changera rien.  Vous pouvez effectivement l’inclure :

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

Les [fonctions `set`](/reference/react/useState#setstate) renvoyées par `useState` ont aussi une identité stable, et peuvent donc elles aussi être omises des dépendances.  Si le *linter* vous permet d’omettre une dépendance sans déclencher d’erreurs, c’est que cette omission est fiable.

L’omission de dépendances à identité stable ne marche cependant que si le *linter* peut « voir » que celle-ci est stable.  Par exemple, si `ref` était passée depuis le composant parent, il vous faudrait l’ajouter au tableau de dépendances.  Ceci dit, ce serait une bonne chose parce que vous ne pouvez pas savoir si le composant parent vous passera toujours la même ref, ou basculera entre plusieurs refs selon une condition interne.  Du coup votre Effet *dépendrait bien* de la ref qui vous est passée.

</DeepDive>

### Étape 3 : ajoutez du code de nettoyage si besoin {/*step-3-add-cleanup-if-needed*/}

Prenons un autre exemple. Vous écrivez un composant  `ChatRoom` qui a besoin de se connecter à un serveur de discussion lorsqu’il apparaît. Vous disposez d’une API `createConnection()` qui renvoie un objet avec des méthodes `connect()` et `disconnect()`.  Comment garder votre composant connecté pendant qu’il est affiché à l’utilisateur ?

Commencez par écrire le code de l’Effet :

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

Ce serait toutefois beaucoup trop lent de vous (re)connecter après chaque rendu ; vous spécifiez donc un tableau de dépendances :

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**Le code dans l’Effet n’utilise ni props ni état, donc votre tableau de dépendances est vide `[]`.  Vous indiquez ici à React qu’il ne faut exécuter le code que lors du « montage » du composant, c’est-à-dire lorsque celui-ci apparaît à l’écran pour la première fois.**

Essayons d’exécuter ce code :

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
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

Cet Effet n’est exécuté qu’au montage, vous vous attendez donc sans doute à ce que `"✅ Connexion..."` ne soit logué qu’une fois en console. **Et pourtant, en vérifiant la console, vous voyez deux occurrences de `"✅ Connexion..."`. Qu’est-ce qui se passe ?**

Imaginez que le composant `ChatRoom` fasse partie d’une appli plus grande avec de nombreux écrans distincts. L’utilisateur démarre dans la page `ChatRoom`.  Le composant est monté puis appelle `connection.connect()`.  Supposez maintenant que l’utilisateur navigue vers un autre écran--par exemple, la page des Paramètres. Le composant `ChatRoom` est démonté.  Au final, l’utilisateur navigue en arrière et le composant `ChatRoom` est monté à nouveau.  Ça mettrait en place une deuxième connexion--sauf que la première n’a jamais été nettoyée !  Au fil de la navigation de l’utilisateur au sein de l’appli, les connexions s’accumuleraient.

Des bugs de ce genre sont difficiles à repérer sans avoir recours à des tests manuels étendus.  Pour vous aider à les repérer plus vite, en mode développement React remonte chaque composant une fois immédiatement après leur montage initial.

En voyant deux fois le message `"✅ Connexion..."`, ça vous aide à remarquer le vrai problème : votre code ne ferme pas la connexion au démontage du composant.

Pour corriger ça, renvoyez une *fonction de nettoyage* depuis votre Effet :

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React appellera cette fonction de nettoyage avant chaque ré-exécution de votre Effet, ainsi qu’une dernière fois lorsque le composant est démonté (lorqu’il est retiré).  Voyons ce qui se passe à présent que nous avons implémenté la fonction de nettoyage  :

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

Vous voyez maintenant trois logs dans la console en mode développement :

1. `"✅ Connexion..."`
2. `"❌ Déconnecté."`
3. `"✅ Connexion..."`

**C’est le comportement correct en développement.** En remontant votre composant, React vérifie que le quitter puis revenir ne crée pas de problèmes.  Se déconnecter puis se reconnecter est exactement ce qu’on souhaite !  Lorsque vous implémentez votre nettoyage correctement, il ne devrait y avoir aucune différence visible entre l’exécution unique de l’Effet et une séquence exécution-nettoyage-exécution.  Bien sûr, il y a une déconnexion / reconnexion supplémentaire parce que React titille votre code à la recherche de bugs pendant le développement.  Mais c’est normal--n’essayez pas d’éliminer ça !

**En production, vous ne verriez `"✅ Connexion..."` qu’une fois.**  Le remontage des composants ne survient qu’en mode développement, pour vous aider à repérer les Effets qui nécessitent un nettoyage.  Vous pouvez désactiver le [Mode Strict](/reference/react/StrictMode) pour éviter ce comportement de développement, mais nous vous recommandons de le laisser actif.  Ça vous aidera à repérer de nombreux problèmes comme celui ci-avant.

## Comment gérer le double déclenchement de l’Effet en développement ? {/*how-to-handle-the-effect-firing-twice-in-development*/}

React remonte volontairement vos composants en développement pour trouver des bugs comme dans l’exemple précédent. **La bonne question n’est pas « comment exécuter un Effet une seule fois », mais « comment corriger mon Effet pour qu’il marche au remontage ».**

En général, la réponse consiste à implémenter une fonction de nettoyage. La fonction de nettoyage devrait arrêter ou défaire ce que l’Effet avait commencé. La règle générale veut que l’utilisateur ne puisse pas faire la distinction entre un Effet exécuté une seule fois (comme en production) et une séquence *mise en place → nettoyage → mise en place* (comme en développement).

La plupart des Effets que vous aurez à écrire correspondront à un des scénarios courants ci-après.

<Pitfall>

#### N'utilisez pas des refs pour empêcher le déclenchement d'un Effet {/*dont-use-refs-to-prevent-effects-from-firing*/}

Une mauvaise pratique fréquente afin d'empêcher le double-déclenchement d'un Effet en développement consiste à utiliser une `ref` pour empêcher son exécution multiple.  Vous pourriez par exemple « corriger » le bug ci-dessus avec un `useRef` :

```js {1,3-4}
  const connectionRef = useRef(null);
  useEffect(() => {
    // 🚩 Ça ne corrigera pas le bug !!!
    if (!connectionRef.current) {
      connectionRef.current = createConnection();
      connectionRef.current.connect();
    }
  }, []);
```

Ainsi, vous ne voyez `"✅ Connexion..."` qu'une fois en développement, mais ça n'a pas corrigé le bug pour autant.

Lorsque l'utilisateur navigue ailleurs, la connexion ne sera toujours pas fermée, et lorsqu'il reviendra, une nouvelle connexion sera créée. Au fil de la navigation, les connexions continueront à s'empiler, tout comme avant votre « correctif ».

Pour corriger le bug, il ne suffit pas de faire que l'Effet ne s'exécute qu'une fois. L'Effet doit pouvoir fonctionner après un remontage, ce qui signifie que la connexion doit être nettoyée comme dans la solution vue plus haut.

Parcourez les exemples ci-dessous pour découvrir comment gérer les cas les plus courants.

</Pitfall>

### Contrôler des widgets non-React {/*controlling-non-react-widgets*/}

Vous aurez parfois besoin d'ajouter des widgets d’UI qui ne sont pas écrits en React. Par exemple, imaginons que vous souhaitiez ajouter un composant carte à votre page.  Il dispose d’une méthode `setZoomLevel()` et vous aimeriez synchroniser son niveau de zoom avec une variable d’état `zoomLevel` dans votre code React. L’Effet pour y parvenir ressemblerait à ceci :

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

Remarquez qu’ici on n’a pas besoin de nettoyage. En développement, React appellera cet Effet deux fois, mais ça n’est pas un problème parce qu’appeler `setZoomLevel()` deux fois avec la même valeur ne fera rien.  Ce sera peut-être un poil plus lent, mais ce n’est pas important puisque ce remontage n’aura pas lieu en production.

Certaines API ne vous permettront peut-être pas de les appeler deux fois d’affilée. Par exemple, la méthode [`showModal`](https://developer.mozilla.org/fr/docs/Web/API/HTMLDialogElement/showModal) de l’élément natif [`<dialog>`](https://developer.mozilla.org/fr/docs/Web/API/HTMLDialogElement) lèvera une exception si vous l’appelez deux fois. Implémentez alors une fonction de nettoyage pour refermer la boîte de dialogue :

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

En développement, votre Effet appellera `showModal()`, puis immédiatement `close()`, et encore une fois `showModal()`. Le comportement visible pour l’utilisateur sera exactement le même que si vous aviez juste appelé `showModal()` une fois, comme en production.

### S’abonner à des événements {/*subscribing-to-events*/}

Si votre Effet s’abonne à quelque chose, sa fonction de nettoyage doit l’en désabonner :

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

En développement, votre Effet appellera `addEventListener()`, puis immédiatement `removeEventListener()`, et encore une fois `addEventListener()` avec le même gestionnaire. Il n’y aura donc qu'un abonnement actif à la fois.  Le comportement visible pour l’utilisateur sera exactement le même que si vous aviez juste appelé `addEventListener()` une fois, comme en production.

### Déclencher des animations {/*triggering-animations*/}

Si votre Effet réalise une animation d’entrée, la fonction de nettoyage devrait s’assurer de revenir aux valeurs initiales de l’animation :

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Déclencher l’animation
  return () => {
    node.style.opacity = 0; // Revenir à la valeur initiale
  };
}, []);
```

En développement, l’opacité sera mise à `1`, puis à `0`, puis encore à `1`. Le comportement visible pour l’utilisateur sera exactement le même que si vous aviez juste défini l’opacité à `1` directement, comme ce serait le cas en production.  Si vous utilisez une bibliothèque tierce qui prend en charge le *tweening*, votre fonction de nettoyage devra aussi en réinitialiser la chronologie.

### Charger des données {/*fetching-data*/}

Si votre Effet charge quelque chose (par exemple *via* la réseau), la fonction de nettoyage devrait soit [abandonner le chargement](https://developer.mozilla.org/fr/docs/Web/API/AbortController) soit ignorer son résultat :

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

On ne peut pas « défaire » une requête réseau qui a déjà abouti, mais la fonction de nettoyage devrait s’assurer que le chargement qui *n’est plus pertinent* ne risque pas d’impacter l’application. Si le `userId` passe de `'Alice'` à `'Bob'`, le nettoyage s’assure que la réponse pour `'Alice'` est ignorée même si elle arrive avant celle pour `'Bob'`.

**En développement, vous verrez deux chargements dans l’onglet Réseau.**  Ce n’est pas un problème.  Avec l’approche ci-avant, le premier Effet sera immédiatement nettoyé de sorte que sa propre variable locale `ignore` sera mise à `true`.  Ainsi, même si une requête supplémentaire a lieu, cela n’affectera pas l’état grâce au test `if (!ignore)`.

**En production, il n’y aura qu’une requête.**  Si la seconde requête en développement vous dérange, la meilleure approche consiste à utiliser une solution technique qui dédoublonne les requêtes et met leurs réponses dans un cache indépendant des composants :

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

Non seulement ça améliorera l’expérience de développement (DX), mais l’application semblera aussi plus rapide.  Par exemple, quand une personne naviguera en arrière, elle n’aura plus à attendre le chargement de données parce que le cache sera exploité.  Vous pouvez soit construire un tel cache vous-même, soit utiliser une des nombreuses alternatives au chargement manuel de données.

<DeepDive>

#### Que préférer au chargement de données dans les Effets ? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Écrire nos appels `fetch` dans les Effets constitue [une façon populaire de charger des données](https://www.robinwieruch.de/react-hooks-fetch-data/), en particulier pour des applications entièrement côté client.  Il s’agit toutefois d’une approche de bas niveau qui comporte plusieurs inconvénients significatifs :

- **Les Effets ne fonctionnent pas côté serveur.**  Ça implique que le HTML rendu côté serveur avec React proposera un état initial sans données chargées. Le poste client devra télécharger tout le JavaScript et afficher l’appli pour découvrir seulement alors qu’il lui faut aussi charger des données. Ce n’est pas très efficace.
- **Charger depuis les Effets entraîne souvent des « cascades réseau ».** On affiche le composant parent, il charge ses données, affiche ses composants enfants, qui commencent seulement alors à charger leurs propres données.  Si le réseau n’est pas ultra-rapide, cette séquence est nettement plus lente que le chargement parallèle de toutes les données concernées.
- **Charger depuis les Effets implique généralement l’absence de pré-chargement ou de cache des données.**  Par exemple, si le composant est démonté puis remonté, il lui faudrait charger à nouveau les données dont il a besoin.
- **L’ergonomie n’est pas top.**  Écrire ce genre d’appels `fetch` manuels nécessite pas mal de code générique, surtout lorsqu’on veut éviter des bugs tels que les [*race conditions*](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect).

Cette liste d’inconvénients n’est d’ailleurs pas spécifique à React.  Elle s’applique au chargement de données lors du montage quelle que soit la bibliothèque.  Comme pour le routage, bien orchestrer son chargement de données est un exercice délicat, c’est pourquoi nous vous recommandons plutôt les approches suivantes :

- **Si vous utilisez un [framework](/learn/start-a-new-react-project#production-grade-react-frameworks), utilisez son mécanisme intégré de chargement de données.** Les frameworks React modernes ont intégré le chargement de données de façon efficace afin d’éviter ce type d’ornières.
- **Dans le cas contraire, envisagez l’utilisation ou la construction d’un cache côté client.**  Les solutions open-source les plus populaires incluent  [React Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/), et [React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview). Vous pouvez aussi construire votre propre solution, auquel cas vous utiliseriez sans doute les Effets sous le capot, mais ajouteriez la logique nécessaire au dédoublonnement de requêtes, à la mise en cache des réponses, et à l’optimisation des cascades réseau (en préchargeant les données ou en consolidant vers le haut les besoins de données des routes).

Vous pouvez continuer à charger les données directement dans les Effets si aucune de ces approches ne vous convient.

</DeepDive>

### Envoyer des données analytiques {/*sending-analytics*/}

Prenez le code ci-après, qui envoie un événement analytique lors d’une visite de la page :

```js
useEffect(() => {
  logVisit(url); // Envoie une requête POST
}, [url]);
```

En développement, `logVisit` sera appelée deux fois pour chaque URL, ce qui incite à un correctif. **Nous vous recommandons de laisser ce code tel quel.**  Comme pour les exemples précédents, il n’y a pas de différence *visible* de comportement entre son exécution une ou deux fois.  D’un point de vue pratique, `logVisit` ne devrait même rien faire en développement, parce que vous ne souhaitez pas polluer vos métriques de production avec les machines de développement.  Votre composant est remonté chaque fois que vous sauvez son fichier, il notifierait donc des visites en trop en développement de toutes façons.

**En production, il n’y aura pas de doublon de visite.**

Pour déboguer les événements analytiques que vous envoyez, vous pouvez déployer votre appli sur un environnement de recette (qui s’exécute en mode production), ou temporairement désactiver le [Mode Strict](/reference/react/StrictMode) et ses vérifications de montage en mode développement.  Vous pourriez aussi envoyer vos événements analytiques au sein de gestionnaires d’événements de changement de route plutôt que depuis les Effets.  Pour obtenir des analyses plus granulaires encore, les [observateurs d’intersection](https://developer.mozilla.org/fr/docs/Web/API/Intersection_Observer_API) peuvent vous aider à surveiller quels composants sont dans la zone visible de la page, et mesurer combien de temps ils y restent.

### Pas un Effet : initialiser l’application {/*not-an-effect-initializing-the-application*/}

Certains traitements ne devraient s’exécuter que lorsque l’application démarre.  Sortez-les de vos composants :

```js {2-3}
if (typeof window !== 'undefined') { // Vérifie qu’on est dans un navigateur
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Ça garantit que ces traitements ne sont exécutés qu’une fois, après que le navigateur a chargé la page.

### Pas un Effet : acheter un produit {/*not-an-effect-buying-a-product*/}

Parfois, même une fonction de nettoyage ne suffit pas à masquer les conséquences visibles de la double exécution d’un Effet.  Par exemple, peut-être votre Effet envoie-t-il une requête POST qui achète un produit :

```js {2-3}
useEffect(() => {
  // 🔴 Erroné : cet Effet s’exécute 2 fois en développement, on a donc un problème.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

Vous ne voulez sans doute pas acheter le produit deux fois.  C’est justement pour ça que ce type de traitement n’a pas sa place dans un Effet.  Et si l’utilisateur navigue ailleurs puis revient ? Votre Effet s’exécuterait encore.  On ne veut pas déclencher un achat quand l’utilisateur *visite* la page ; on veut acheter quand l’utilisateur *clique* sur le bouton Acheter.

Ce n’est pas le rendu qui déclenche l’achat, c’est une interaction spécifique.  On ne devrait donc l’exécuter que lorsque l’utilisateur active le bouton. **Supprimez l’Effet et déplacez la requête à `/api/buy` dans le gestionnaire d’événement du bouton Acheter :**

```js {2-3}
  function handleClick() {
    // ✅ L’achat est un événement, car il est causé par une interaction spécifique.
    fetch('/api/buy', { method: 'POST' });
  }
```

**Ça illustre bien le fait que si le remontage casse la logique de votre application, il s’agit probablement d’un bug dans votre code.**  Du point de vue d’un utilisateur, visiter la page ne devrait en rien différer de la visiter, puis cliquer un lien, puis y revenir.  React vérifie que vos composants obéissent à ce principe en les remontant une fois lors du développement.

## Tous ensemble cette fois {/*putting-it-all-together*/}

Le bac à sable ci-après devrait vous aider à affiner votre intuition du fonctionnement des Effets en pratique.

Cet exemple utilise [`setTimeout`](https://developer.mozilla.org/fr/docs/Web/API/setTimeout) pour planifier un message en console avec le texte saisi, qui surviendra 3 secondes après l’exécution de l’Effet.  La fonction de nettoyage annule le *timer* mis en place.  Commencez par activer « Monter le composant ».

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Planification du message "' + text + '"');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Annulation du message "' + text + '"');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        Que dire :{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Démonter' : 'Monter'} le composant
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

Vous verrez d’abord trois lignes : `Planification du message "a"`, `Annulation du message "a"`, et à nouveau `Planification du message "a"`.  Trois secondes plus tard, une ligne apparaîtra qui dira `a`.  Comme vous l’avez appris plus tôt, la paire supplémentaire d’annulation / planification vient de ce que React remonte le composant une fois en développement pour vérifier que vous avez implémenté le nettoyage correctement.

À présent, modifiez la saisie pour qu’elle indique `abc`.  Si vous le faites suffisamment vite, vous verrez `Planification du message "ab"` immédiatement suivi de `Annulation du message "ab"` et `Planification du message "abc"`. **React nettoie toujours l’Effet du rendu précédent avant de déclencher l’Effet du rendu suivant.**  C’est pourquoi même si vous tapez vite, il y aura au plus un *timer* actif à la fois.  Modifiez la saisie deux ou trois fois en gardant un œil sur la console pour bien sentir la façon dont les Effets sont nettoyés.

Tapez à présent quelque chose dans la saisie et cliquez immédiatement sur « Démonter le composant ».  Remarquez que l’Effet du dernier rendu est nettoyé par le démontage.  Ici, le dernier *timer* mis en place est annulé avant même d’avoir pu se déclencher.

Pour finir, modifiez le composant ci-avant en commentant sa fonction de nettoyage, de sorte que les *timers* ne seront pas annulés.  Essayez de taper rapidement `abcde` dans le champ.  Que vous attendez-vous à voir arriver au bout de trois secondes ? Le `console.log(text)` planifié va-t-il afficher la *dernière* valeur de `text` et produire cinq lignes `abcde` ?  Essayez pour tester votre intuition !

Au bout de trois secondes, vous devriez voir une séquence de messages (`a`, `ab`, `abc`, `abcd`, et `abcde`) plutôt que cinq messages `abcde`.  **Chaque Effet « capture » la valeur `text` du rendu qui l’a déclenché.**  Peu importe que l’état `text` ait changé ensuite : un Effet issu d’un rendu où `text = 'ab'` verra toujours `'ab'`.  En d’autres termes, les Effets de chaque rendu sont isolés les uns des autres.  Si vous vous demandez comment ça fonctionne, nous vous invitons à vous renseigner sur les [fermetures lexicales](https://developer.mozilla.org/fr/docs/Web/JavaScript/Closures) *(closures, NdT)*.

<DeepDive>

#### Chaque rendu à ses propres Effets {/*each-render-has-its-own-effects*/}

Vous pouvez considérer que `useEffect` « attache » un morceau de comportement au résultat du rendu.  Prenez cet Effet :

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Bienvenue dans {roomId} !</h1>;
}
```

Voyons ce qui se passe exactement lorsque l’utilisateur se promène dans l’appli.

#### Rendu initial {/*initial-render*/}

L’utilisateur visite `<ChatRoom roomId="general" />`. [Substituons mentalement](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) la référence à `roomId` par sa valeur, `'general'` :

```js
  // JSX pour le premier rendu (roomId = "general")
  return <h1>Bienvenue dans general !</h1>;
```

**L’Effet fait *aussi* partie du résultat du rendu.** L’Effet du premier rendu devient :

```js
  // Effet du premier rendu (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dépendances du premier rendu (roomId = "general")
  ['general']
```

React exécute l’Effet, qui nous connecte au salon de discussion `'general'`.

#### Rendu suivant avec les mêmes dépendances {/*re-render-with-same-dependencies*/}

Supposons que `<ChatRoom roomId="general" />` fasse un nouveau rendu. Le résultat JSX est exactement le même :

```js
  // JSX pour le deuxième rendu (roomId = "general")
  return <h1>Bienvenue dans general !</h1>;
```

React voit que rien n’a changé dans le résultat, et ne touche donc pas au DOM.

L’Effet du deuxième rendu ressemble à ceci :

```js
  // Effet du deuxième rendu (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dépendances du deuxième rendu (roomId = "general")
  ['general']
```

React compare le `['general']` du deuxième rendu au `['general']` du premier. **Puisque les dépendances sont identiques, React *ignore* l’Effet du deuxième rendu.**  Il n’est jamais appelé.

#### Rendu suivant avec des dépendances différentes {/*re-render-with-different-dependencies*/}

L’utilisateur visite alors `<ChatRoom roomId="travel" />`. Cette fois, le JSX renvoyé est différent :

```js
  // JSX pour le troisième rendu (roomId = "travel")
  return <h1>Bienvenue dans travel !</h1>;
```

React met à jour le DOM pour remplacer `"Bienvenue dans general"` par `"Bienvenue dans travel"`.

L’Effet du troisième rendu ressemble à ceci :

```js
  // Effet du troisième rendu (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dépendances du troisième rendu (roomId = "travel")
  ['travel']
```

React compare le `['travel']` du troisième rendu au `['general']` du deuxième. Une dépendance est différente : `Object.is('travel', 'general')` vaut `false`. L’Effet ne peut pas être sauté.

**Avant de pouvoir appliquer l’Effet du troisième rendu, React doit nettoyer le dernier Effet qui *a été exécuté*.**  Celui du deuxième rendu a été sauté, donc React doit nettoyer l’Effet du premier rendu.  Si vous remontez pour voir le premier rendu, vous verrez que sa fonction de nettoyage appelle `disconnect()` sur la connexion créée avec `createConnection('general')`. Ça déconnecte l’appli du salon de discussion `'general'`.

Après ça, React exécute l’Effet du troisième rendu.  Il nous connecte au salon de discussion `'travel'`.

#### Démontage {/*unmount*/}

Au bout du compte, notre utilisateur s’en va, et le composant `ChatRoom` est démonté.  React exécute la fonction de nettoyage du dernier Effet exécuté : celui du troisième rendu.  Sa fonction de nettoyage referme la connexion `createConnection('travel')`. L’appli se déconnecte donc du salon `'travel'`.

#### Comportements spécifiques au développement {/*development-only-behaviors*/}

Quand le [Mode Strict](/reference/react/StrictMode) est actif, React remonte chaque composant une fois après leur montage initial (leur état et le DOM sont préservés). Ça [vous aide à repérer les Effets qui ont besoin d’être nettoyés](#step-3-add-cleanup-if-needed) et permet la détection en amont de problèmes tels que les *race conditions*. React effectue aussi ce remontage lorsque vous sauvegardez vos fichiers en développement.  Dans les deux cas, ces comportements sont limités au développement.

</DeepDive>

<Recap>

- Contrairement aux événements, les Effets sont déclenchés par le rendu lui-même plutôt que par une interaction spécifique.
- Les Effets vous permettent de synchroniser un composant avec un système extérieur (API tierce, appel réseau, etc.)
- Par défaut, les Effets sont exécutés après chaque rendu (y compris le premier).
- React sautera un Effet si toutes ses dépendances ont des valeurs identiques à celles du rendu précédent.
- Vous ne pouvez pas « choisir » vos dépendances.  Elles sont déterminées par le code au sein de l’Effet.
- Un tableau de dépendances vide (`[]`) correspond à une exécution seulement lors du « montage » du composant, c’est-à-dire son apparition à l’écran.
- En Mode Strict, React monte les composants deux fois (seulement en développement !) pour éprouver la qualité d’implémentation des Effets.
- Si votre Effet casse en raison du remontage, vous devez implémenter sa fonction de nettoyage.
- React appellera votre fonction de nettoyage avant l’exécution suivante de l’Effet, ainsi qu’au démontage.

</Recap>

<Challenges>

#### Focus au montage {/*focus-a-field-on-mount*/}

Dans l’exemple ci-après, la formulaire exploite un composant `<MyInput />`.

Utilisez la méthode [`focus()`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/focus) du champ pour faire en sorte que `MyInput` obtienne automatiquement le focus lorsqu’il apparaît à l’écran.  Une implémentation commentée existe déjà, mais elle ne marche pas tout à fait.  Comprenez pourquoi, et corrigez-la.  (Si vous connaissez l’attribut `autoFocus`, faites comme s’il n’existait pas : nous en réimplémentons la fonctionnalité à partir de zéro.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: Ça ne marche pas tout à fait, corrigez ça.
  // ref.current.focus()

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Masquer' : 'Afficher'} le formulaire</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Saisissez votre nom :{' '}
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Le mettre en majuscules
          </label>
          <p>Bonjour <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

Pour vérifier que votre solution fonctionne, cliquez « Afficher le formulaire » et vérifiez que le champ de saisie reçoit le focus (il a un halo et le curseur y est actif).  Cliquez sur « Masquer le formulaire » puis à nouveau « Afficher le formulaire ». Vérifiez que le champ a de nouveau le focus.

`MyInput` ne devrait recevoir le focus *qu’au montage* plutôt qu’après chaque rendu.  Pour le vérifier, cliquez sur « Afficher le formulaire » puis jouez avec la case à cocher « Le mettre en majuscules ». Ça ne devrait *pas* redonner le focus au champ textuel à chaque bascule.

<Solution>

Il serait incorrect d’appeler `ref.current.focus()` depuis le rendu, car il s’agit d’un *effet de bord*. Les effets de bord devraient figurer soit dans des gestionnaires d’événements, soit au sein d’appels à `useEffect`.  Dans notre cas, l’effet de bord est *causé* par l’apparition du composant plutôt que par une interaction spécifique, il est donc logique de le placer au sein d’un Effet.

Pour corriger le problème, enrobez l’appel à `ref.current.focus()` dans une déclaration d’Effet.  Ensuite, assurez-vous que cet Effet n’est exécuté qu’au montage (plutôt qu’après chaque rendu) en prenant soin de lui passer un tableau de dépendances vide `[]`.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Masquer' : 'Afficher'} le formulaire</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Saisissez votre nom :{' '}
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Le mettre en majuscules
          </label>
          <p>Bonjour <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

</Solution>

#### Focus conditionnel {/*focus-a-field-conditionally*/}

Ce formulaire exploite deux composants `<MyInput />`.

Appuyez sur « Afficher le formulaire » et remarquez que le deuxième champ reçoit automatiquement le focus. C’est parce que les deux composants `<MyInput />` essaient de donner le focus à leur champ.  Quand on appelle `focus()` sur deux champs d’affilée, le dernier « gagne » toujours.

Disons que vous souhaitez donner le focus au premier champ. Le premier composant `MyInput` reçoit désormais une prop `shouldFocus` à `true`.  Modifiez le code de façon à ce que `focus()` ne soit appelée que si la prop `shouldFocus` reçue par `MyInput` est `true`.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: appeler focus() seulement si shouldFocus
  // est true.
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Clara');
  const [lastName, setLastName] = useState('Luciani');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Masquer' : 'Afficher'} le formulaire</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Saisissez votre prénom :{' '}
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Saisissez votre nom :{' '}
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Bonjour <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

Pour vérifier votre solution, cliquez sur « Afficher le formulaire » puis « Masquer le formulaire » plusieurs fois.  Quand le formulaire apparaît, seul le *premier* champ devrait recevoir le focus.  C’est parce que son composant parent fait son rendu avec `shouldFocus={true}` alors que le second a `shouldFocus={false}`.  Vérifiez également que les deux champs marchent toujours et que vous pouvez taper dans chacun d’eux.

<Hint>

Vous ne pouvez pas déclarer un Effet de façon conditionnelle, mais le code de votre Effet peut inclure des conditions.

</Hint>

<Solution>

Placez la logique de condition dans l’Effet.  Vous aurez besoin de spécifier `shouldFocus` comme dépendance, parce que vous vous en servez au sein de l’Effet. (Ça signifie que si la prop `shouldFocus` d’un champ passe de `false` à `true`, il recevra le focus après le montage.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Clara');
  const [lastName, setLastName] = useState('Luciani');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Masquer' : 'Afficher'} le formulaire</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Saisissez votre prénom :{' '}
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Saisissez votre nom :{' '}
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Bonjour <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
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

</Solution>

#### Corriger un double intervalle {/*fix-an-interval-that-fires-twice*/}

Ce composant `Counter` affiche un compteur qui devrait s’incrémenter à chaque seconde.  Au montage, il appelle [`setInterval`](https://developer.mozilla.org/fr/docs/Web/API/setInterval). Ça exécute `onTick` à chaque seconde. La fonction `onTick` incrémente le compteur.

Toutefois, au lieu de s’incrémenter une fois par seconde, le compteur s’incrémente deux fois.  Pourquoi ça ? Trouvez la cause du bug et corrigez-le.

<Hint>

Gardez à l’esprit que `setInterval` renvoie un ID de *timer* interne, que vous pouvez plus tard passer à [`clearInterval`](https://developer.mozilla.org/fr/docs/Web/API/clearInterval) pour arrêter l’intervalle.

</Hint>

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Masquer' : 'Afficher'} le compteur</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
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

<Solution>

Quand le [Mode Strict](/reference/react/StrictMode) est actif (ce qui est le cas dans les bacs à sable de ce site), React remonte chaque composant une fois en développement.  Par conséquent, l’intervalle est mis en place deux fois, c’est pourquoi à chaque seconde le compteur est incrémenté deux fois.

Cependant, ce comportement de React n’est pas la *cause* du bug : le bug existe déjà dans votre code.  Le comportement de React le rend simplement plus facile à remarquer.  La véritable cause, c’est que l’Effet démarre un processus sans fournir une façon de le nettoyer.

Pour corriger ce code, sauvegardez l’ID de *timer* renvoyé par `setInterval` et implémentez une fonction de nettoyage qui le passera à [`clearInterval`](https://developer.mozilla.org/fr/docs/Web/API/clearInterval) :

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Masquer' : 'Afficher'} le compteur</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
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

En développement, React remontera quand même votre composant une fois pour vérifier que vous avez implémenté les nettoyages nécessaires.  Il y aura donc un appel à `setInterval`, immédiatement suivi d’un appel à `clearInterval` et encore à `setInterval`.  En production, il n’y aura qu’un appel à `setInterval`.  Le comportement visible dans les deux cas est le même : le compteur est incrémenté une fois par seconde.

</Solution>

#### Corriger un chargement depuis un Effet {/*fix-fetching-inside-an-effect*/}

Ce composant affiche la biographie de la personne sélectionnée.  Il charge cette biographie en appelant une fonction asynchrone `fetchBio(person)` au montage, et chaque fois que `person` change. Cette fonction asynchrone renvoie une [promesse](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) qui à terme aboutit à une chaîne de caractères.  Lorsque le chargement est terminé, il appelle `setBio` pour afficher le texte sous la liste déroulante.

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Marie">Marie</option>
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

Il y a un bug dans ce code.  Commencez par choisir « Alice ». Puis choisissez « Bob » et tout de suite après choisissez « Marie ».  Si vous le faites assez vite, vous remarquerez le bug : Marie est choisie, puis le paragraphe en-dessous dit « Voici la bio de Bob. »

Que se passe-t-il ? Corrigez le bug au sein de l’Effet.

<Hint>

Si un Effet charge quelque chose de façon asynchrone, il a généralement besoin d’un nettoyage.

</Hint>

<Solution>

Pour déclencher le bug, les interactions suivantes doivent survenir dans cet ordre :

- Sélectionner `'Bob'` déclenche `fetchBio('Bob')`
- Sélectionner `'Marie'` déclenche `fetchBio('Marie')`
- **Le chargement de `'Marie'` se termine *avant* le chargement de `'Bob'`**
- L’Effet issu du rendu `'Marie'` affiche `setBio('Voici la bio de Marie')`
- Le chargement de `'Bob'` se termine
- L’Effet issu du rendu `'Bob'` appelle `setBio('Voici la bio de Bob')`

Et voilà pourquoi vous voyez la bio de Bob même si Marie est sélectionnée.  Les bugs de ce type sont appelés des [*race conditions*](https://fr.wikipedia.org/wiki/Situation_de_comp%C3%A9tition) parce que deux opérations asynchrones « font la course » entre elles, et qu’elles sont susceptibles d’aboutir dans un ordre inattendu.

Pour corriger cette *race condition*, ajoutez une fonction de nettoyage.

<Sandpack>

```js src/App.js
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
        <option value="Marie">Marie</option>
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

Chaque Effet a sa propre variable `ignore`.  Au départ, la variable `ignore` est à `false`. Mais si un Effet est nettoyé (par exemple en sélectionnant une autre personne), sa variable `ignore` passe à `true`.  Du coup, peu importe désormais dans quel ordre les requêtes aboutissent.  Seule la personne associée au dernier Effet aura `ignore` à `false`, ce qui permettra l’appel à `setBio(result)`.  Les Effets passés auront été nettoyés, invalidant leur condition `if (!ignore)`, ce qui les empêchera d’appeler `setBio` :

- Sélectionner `'Bob'` déclenche `fetchBio('Bob')`
- Sélectionner `'Marie'` déclenche `fetchBio('Marie')` **et nettoie l’Effet précédent (celui de Bob)**
- Le chargement de `'Marie'` Marie se termine *avant* le chargement de `'Bob'`
- L’Effet issue du rendu `'Marie'` appelle `setBio('Voici la bio de Marie')`
- Le chargement de `'Bob'` se termine
- L’Effet issu du rendu `'Bob'` **ne fait rien parce que son drapeau `ignore` est à `true`**

En plus d’ignorer le résultat d’un appel API périmé, vous pouvez aussi utiliser [`AbortController`](https://developer.mozilla.org/fr/docs/Web/API/AbortController) pour annuler les requêtes devenues superflues.  Toutefois, cette seule approche ne suffit pas à vous protéger contre les *race conditions*.  D'autres étapes asynchrones pourraient être ajoutées après la fin du chargement, de sorte que recourir à un drapeau `ignore` constitue la façon la plus fiable de corriger ce type de soucis.

</Solution>

</Challenges>
