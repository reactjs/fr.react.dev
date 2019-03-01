---
id: hooks-overview
title: Aperçu des Hooks
permalink: docs/hooks-overview.html
next: hooks-state.html
prev: hooks-intro.html
---

Les *Hooks* sont une nouveauté de React 16.8. Ils permettent d'utiliser l'état et d'autres fonctionnalités de React sans écrire de classes.

Les Hooks sont [rétro-compatibles](/docs/hooks-intro.html#no-breaking-changes). Cette page fournit une présentation des Hooks pour les utilisateurs expérimentés de react. C'est un panorama rapide. Si vous êtes confus, cherchez un panneau jaune comme celui ci :

>Explication détaillée
>
>Lisez la page [Motivation](/docs/hooks-intro.html#motivation) pour apprendre pourquoi nous avons ajouté les Hooks à React.

**↑↑↑ Chaque section se termine par un panneau jaune comme ceui ci.** Ils pointent vers une documentation détaillée.

## 📌 Hook  d'état {#-state-hook}

Cet exemple affiche un compteur. Quand vous cliquez sur le bouton, la valeur augmente :

```js{1,4,5}
import React, { useState } from 'react';

function Example() {
  // Déclaration d'une nouvelle variable d'état, que l'on appellera « count »
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Vous avez cliqué {count} fois</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

Ici, `useState` est un *Hook* (nous verrons ce que ça veut dire dans quelques instant). Il est invoqué à l'intérieur d'un composant fonctionnel afin d'y ajouter un état local. React va préserver cet état durant les différents affichage. `useState` retourne une pair: la valeur de l'état *actuel* et une fonction qui vous permet de le mettre à jour. Vous pouvez appeler cette fonction depuis un gestionaire d'événement où depuis ailleur. C'est similaire à `this.setState` dans une classe, à l'exeption qu'il ne merge ensemble pas l'ancien et le nouvel état. (Nous allons vous montrer un exemple permettant de comparer `useState` et `this.state` dans [Utiliser le Hook d'état](/docs/hooks-state.html).)

Le seul argument de `useState` est l'état initial. Dans l'exemple précédent, c'est `0` puisque notre compteur débute de zéro. Il faut noter que contrairement à `this.state`, l'état n'est pas nécessairement un objet -- même s'il peut l'être si vous le voulez. L'argument de l'état initial est utilisé seulement pendant le premier affichage.

#### Déclarer des variables à plusieurs états {#declaring-multiple-state-variables}

Vous pouvez utiliser le Hook d'état plus d'une fois dans un seul composant :

```js
function ExampleWithManyStates() {
  // Déclaration de multiples variables d'état !
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banane');
  const [todos, setTodos] = useState([{ text: 'Apprendre les Hooks' }]);
  // ...
}
```

La syntaxe de la [déstructuration positionnelle](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Opérateurs/Affecter_par_décomposition#Décomposition_d'un_tableau) nous permet de donner différents noms pour les variables d'état qui ont été déclarées en appelant `useState`. Ces noms ne font pas parti de l'API `useState`. A la place, React assume que si vous appelé `useState` plusieurs fois, vous le faites avec le même ordre pour chaque affichage. Nous reviendrons un peu plus tard sur ce fonctionnement et pourquoi c'est utile.

#### Mais qu'est ce qu'un Hook ? {#but-what-is-a-hook}

Les Hooks sont des fonctions qui permettent une ingérence dans l'état de React et dans les fonctionnalités de cycle de vie depuis des fonctions du composant. Les Hooks ne fonctionnement pas depuis l'intérieur d'une classe -- ils vous permettent d'utiliser React sans classes. (Nous [ne recommandons pas](/docs/hooks-intro.html#gradual-adoption-strategy) la réécriture de vos composants existants du jour au lendemain, mais vous pouvez, si vous le souhaitez, commencer à utiliser les Hooks dans les nouveaux composants.)

React fournit quelques Hooks pré-construit comme `useState`. Vous pouvez aussi créer vos propres Hooks pour réutiliser le comportement à état entre différents composants. Dans un premier temps, nous allons aborder les Hooks pré-construits.

>Explication détaillée
>
>Vous pouvez en apprendre plus sur le Hook d'état sur la page dédiée : [Utiliser le Hook d'état](/docs/hooks-state.html).

## ⚡️ Hook Effect {#️-effect-hook}

Vous avez surement déjà réalisé une récupération de données, des souscriptions ou des modifications manuelles sur le DOM depuis un composant React. Nous appelons ces opérations effets de bord (ou effets pour faire court) parce qu'elles peuvent affecter d'autres composants et ne peuvent pas se produire pendant l'affichage.

Le Hook d'effet, `useEffect`, ajoute la possibilité d'effectuer des effets de bord depuis une fonction d'un composant. Il a le même but que `componentDidMount`, `componentDidUpdate`, et `componentWillUnmount` dans les classes React, mais unifié dans une seule API. (Nous allons présenter des exemples comparant `useEffect` à ces méthodes dans [Utiliser le Hook d'Effet ](/docs/hooks-effect.html).)

Par exemple, ce composant change le titre du document après une mise à jour du DOM par React :

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Equivalent à componentDidMount et componentDidUpdate :
  useEffect(() => {
    // Mettre à jour le titre du document en utilisant l'API du navigateur
    document.title = `Vous avez cliqué ${count} fois`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Cliquez moi
      </button>
    </div>
  );
}
```

Lors vous appelez `useEffect`, vous dites à React de lancer votre fonction d'« effet » après les changements sur le DOM. Les effets sont déclarés dans le composant et ont donc accès aux props et à l'état. Par défaut, React exécute les effets après chaque rendu -- *incluant* le premier affichage. (Nous aborderons pls en détails la comparaison aux cycles de vie des classes dans [Utiliser le Hook d'effet](/docs/hooks-effect.html).)

Les effets peuvent aussi préciser comment les « nettoyer » en retournant une fonction. Par exemple, ce composant utilise un effet pour souscrire au status de connexion d'un ami, et nettoie en annulant la souscription :

```js{10-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);

    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Chargement...';
  }
  return isOnline ? 'En ligne' : 'Hors ligne';
}
```

Dans cet exemple, React va se désinscrire de notre `ChatAPI` quand le composant se démonte, mais aussi juste avant de relancer un effet suite à un nouvel affichage. (Si vous voulez, il y a une façon de [dire à React de passer la re-souscription](/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects) si la `props.friend.id` passée à `ChatAPI` n'a pas changée.)

Tout comme `useState`, vous pouvez utiliser plus d'un seul effet dans un composant :

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `Vous avez cliqué ${count} fois`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  // ...
```

Les Hooks vous permettent d'organiser les effets de bord dans un composant dont différentes fonctionnalités sont reliées (tel que ajouter et supprimer une souscription), plutot que de forcer une séparation basée sur les méthodes du cycle de vie.

>Explication détaillée
>
>Vous pouvez en apprendre plus sur `useEffect` sur la page dédiée : [Utiliser le Hook Effect](/docs/hooks-effect.html).

## ✌️ Règles des Hooks {#️-rules-of-hooks}

Les Hooks sont des fonctions JavaScript, mais ils imposent deux règles additionnelles :

* Appelez les Hooks seulement **au premier niveau**. N'appelez pas les Hooks dans des boucles, conditions ou fonctions imbriquées.
* Appelez les Hooks seulement **depuis les fonctions des composants Reacts**. N'appelez pas les Hooks depuis des fonctions normales JavaScript. (Il n'y a qu'un seul autre endroit d'où appeler des Hooks -- votre propre Hook personnalisé. Nous allons les aborder dans un moment.)

Nous fournissons un [linter plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) pour appliquer ces règles automatiquement. Nous comprenons que ces règles peuvent sembler limitantes ou peu claires au premier abord, mais elles sont essentielles pour que les Hooks fonctionnent correctement.

>Explication détaillée
>
>Vous pouvez en apprendre plus sur ces règles sur la page dédiée : [Règle des Hooks](/docs/hooks-rules.html).

## 💡 Construire ses propres Hooks {#-building-your-own-hooks}

Parfois, on veut réutiliser la même logique à état entre les composants. Traditionnellement, il existe deux solutions pour ce problème : [composant d'ordre supérieur](/docs/higher-order-components.html) et [props de rendu](/docs/render-props.html). Les Hooks personnalisés vous permettent de traiter ce problèmes, sans ajouter de plus de composants dans l'arborescence.

Un peu plus tôt sur cette page, nous avons introduit un composant`FriendStatus` qui appelle les Hooks `useState` et `useEffect` pour souscrire à l'état du status  subscribe to a friend's online status. Let's say we also want to reuse this subscription logic in another component.

Tout d'abord, nous allons extraire la logic dans un Hook personnalisé appelé `useFriendStatus` :

```js{3}
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

Il prend `friendID` comme argument, et retourne l'état de notre ami.

Maintenant nous pouvons l'utiliser dans les deux composants :


```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Chargement...';
  }
  return isOnline ? 'En ligne' : 'Hors ligne';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'vert' : 'noir' }}>
      {props.friend.name}
    </li>
  );
}
```

L'état des ces composants est complètement indépendent. Les Hooks sont une solution pour réutiliser une *logique d'état*, et pas l'état lui-même. En fait, chaque *appel* à un Hook a un état complètement isolé -- vous pouvez même utiliser deux fois le même Hook personnalisé dans un seul composant.

Les Hooks personnalisés sont plus une convention qu'une fonctionnalité. Si le nom d'une fonction commence par `use` et appelle un autre Hook, nous appelons ça un Hook personnalisé. La convention de nommage `useSomething` permet à notre linter de trouver des bugs dans un code utilisant les Hooks.

Vous pouvez écrire des Hooks personnalisé qui gèrent un ensemble de cas d'utilisation tels que la gestion des formulaires, les animations, la souscription déclaraive, les timers et probablement d'autres auquels nous n'avons pas pensé. Nous sommes ravi de voir les cas d'utilisation des Hooks qui vont être trouvé par la communauté React.

>Explication détaillée
>
>Vous pouvez en apprendre plus sur les Hooks personnalisés sur une page dédiée : [Construire ses propres Hooks](/docs/hooks-custom.html).

## 🔌 Autres Hooks {#-other-hooks}

Il y a quelques type de Hooks beaucoup moins utilisé que vous pourriez trouver utiles. Par exemple, [`useContext`](/docs/hooks-reference.html#usecontext) vous permet de souscrire au context de React sans introduire d'imbrication :

```js{2,3}
function Example() {
  const locale = useContext(LocaleContext);
  const theme = useContext(ThemeContext);
  // ...
}
```

Le [`useReducer`](/docs/hooks-reference.html#usereducer) vous permet de gérer l'état local de composants complexes avec un réducteur :

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer);
  // ...
```

>Explication détaillée
>
>Vous pouvez en apprendre plus sur l'ensemble des Hooks sur une page dédiée : [référence de l'API des Hooks](/docs/hooks-reference.html).

## Prochaines étapes {#next-steps}

Phew, ce fut rapide! Si jamais quelque chose n'est pas clair ou que vous voullez en savoir plus, vous pouvez continuer à lire les prochaines pages, en débutant avec la documentation du [Hook d'état](/docs/hooks-state.html).

Vous pouvez aussi regarder la page de [référence de l'API des Hooks](/docs/hooks-reference.html) et de [FAQ des Hooks](/docs/hooks-faq.html).

Pour finir, ne manquez pas de lire la [page d'introduction](/docs/hooks-intro.html) qui explique *pourquoi* nous avons ajouté les Hooks et comment nous allons commencer à les utiliser en parallèle avec les classes -- sans réécrire notre application.
