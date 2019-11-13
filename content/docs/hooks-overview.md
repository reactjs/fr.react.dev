---
id: hooks-overview
title: Aperçu des Hooks
permalink: docs/hooks-overview.html
next: hooks-state.html
prev: hooks-intro.html
---

Les *Hooks* sont une nouveauté de React 16.8. Ils permettent de bénéficier d’un état local et d'autres fonctionnalités de React sans avoir à écrire de classes.

Les Hooks sont [rétro-compatibles](/docs/hooks-intro.html#no-breaking-changes). Cette page fournit un survol des Hooks pour les utilisateurs expérimentés de React. C'est un tour d’horizon rapide. Si vous trouvez le contenu déroutant, cherchez un panneau jaune comme celui-ci :

>Explication détaillée
>
>Lisez les [raisons](/docs/hooks-intro.html#motivation) qui nous ont fait ajouter les Hooks à React.

**↑↑↑ Chaque section se termine par un panneau jaune comme celui ci.** Ils pointent vers une documentation détaillée.

## 📌 Hook d’état {#state-hook}

Cet exemple affiche un compteur. Quand vous cliquez sur le bouton, la valeur augmente :

```js{1,4,5}
import React, { useState } from 'react';

function Example() {
  // Déclaration d'une nouvelle variable d'état, que l'on appellera “count”
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Vous avez cliqué {count} fois</p>
      <button onClick={() => setCount(count + 1)}>
        Cliquez ici
      </button>
    </div>
  );
}
```

Dans le code ci-dessus, `useState` est un *Hook* (nous verrons ce que ça veut dire dans un instant). Nous l'appelons au sein d’une fonction composant pour y ajouter un état local. React va préserver cet état d’un affichage à l’autre. `useState` retourne une paire : la valeur de l'état *actuel* et une fonction qui vous permet de la mettre à jour. Vous pouvez appeler cette fonction depuis un gestionnaire d'événements, par exemple. Elle est similaire à `this.setState` dans une classe, à ceci près qu’elle ne fusionne pas l'ancien état et le nouveau. (Nous verrons un exemple de comparaison entre `useState` et `this.state` dans [Utiliser le Hook d'état](/docs/hooks-state.html).)

Le seul argument de `useState` est l'état initial. Dans l'exemple précédent, c'est `0` puisque notre compteur démarre à zéro. Remarquez que contrairement à `this.state`, ici l'état n'est pas nécessairement un objet, même si ça reste possible. L'argument d'état initial n’est utilisé que pour le premier affichage.

#### Déclarer plusieurs variables d’état {#declaring-multiple-state-variables}

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

La syntaxe de la [déstructuration positionnelle](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Opérateurs/Affecter_par_décomposition#Décomposition_d'un_tableau) nous permet de donner des noms distincts aux variables d'état que nous déclarons en appelant `useState`. Ces noms ne font pas partie de l'API `useState`. Au lieu de ça, React suppose que si vous appelez `useState` plusieurs fois, vous le faites dans le même ordre à chaque affichage. Nous reviendrons plus tard sur ce qui fait que ça fonctionne et les situations où c'est utile.

#### Mais qu'est ce qu'un Hook ? {#but-what-is-a-hook}

Les Hooks sont des fonctions qui permettent de « se brancher » sur la gestion d’état local et de cycle de vie de React depuis des fonctions composants. Les Hooks ne fonctionnent pas dans des classes : ils vous permettent d'utiliser React sans classes. (Nous [ne recommandons pas](/docs/hooks-intro.html#gradual-adoption-strategy) de ré-écrire vos composants existants du jour au lendemain, mais vous pouvez si vous le souhaitez commencer à utiliser les Hooks dans vos nouveaux composants.)

React fournit quelques Hooks prédéfinis comme `useState`. Vous pouvez aussi créer vos propres Hooks pour réutiliser un comportement à état dans différents composants. Dans un premier temps, nous allons aborder les Hooks prédéfinis.

>Explication détaillée
>
>Vous pouvez en apprendre davantage sur le Hook d'état sur la page dédiée : [Utiliser le Hook d'état](/docs/hooks-state.html).

## ⚡️ Hook d’effet {#effect-hook}

Vous avez surement déjà réalisé un chargement de données distantes, des abonnements ou des modifications manuelles sur le DOM depuis un composant React. Nous appelons ces opérations « effets de bord » (ou effets pour faire court) parce qu'elles peuvent affecter d'autres composants et ne peuvent être réalisées pendant l'affichage.

Le Hook d'effet, `useEffect`, permet aux fonctions composants de gérer des effets de bord. Il joue le même rôle que `componentDidMount`, `componentDidUpdate`, et `componentWillUnmount` dans les classes React, mais au travers d’une API unique. (Nous verrons des exemples comparant `useEffect` à ces méthodes dans [Utiliser le Hook d'effet ](/docs/hooks-effect.html).)

Par exemple, ce composant change le titre du document après que React a mis à jour le DOM :

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Équivalent à componentDidMount plus componentDidUpdate :
  useEffect(() => {
    // Mettre à jour le titre du document en utilisant l'API du navigateur
    document.title = `Vous avez cliqué ${count} fois`;
  });

  return (
    <div>
      <p>Vous avez cliqué {count} fois</p>
      <button onClick={() => setCount(count + 1)}>
        Cliquez ici
      </button>
    </div>
  );
}
```

Lorsque vous appelez `useEffect`, vous dites à React de lancer votre fonction d'« effet » après qu’il a mis à jour le DOM. Les effets étant déclarés au sein du composant, ils ont accès à ses props et son état. Par défaut, React exécute les effets après chaque affichage, *y compris* le premier. (Nous aborderons plus en détails la comparaison avec le cycle de vie des classes dans [Utiliser le Hook d'effet](/docs/hooks-effect.html).)

Les effets peuvent aussi préciser comment les « nettoyer » en renvoyant une fonction. Par exemple, ce composant utilise un effet pour s’abonner au statut de connexion d'un ami, et se nettoie en résiliant l’abonnement :

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
  return isOnline ? 'En ligne' : 'Hors-ligne';
}
```

Dans cet exemple, React nous désabonnerait de notre `ChatAPI` quand le composant est démonté, mais aussi juste avant de relancer l’effet suite à un nouvel affichage. (Le cas échéant, vous pouvez [dire à React de sauter le ré-abonnement](/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects) si la `props.friend.id` passée à `ChatAPI` n'a pas changé.)

Tout comme avec `useState`, vous pouvez utiliser plus d'un seul effet dans un composant :

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

Les Hooks vous permettent d'organiser les effets de bord dans un composant en rassemblant leurs parties (telles que l’abonnement et le désabonnement), plutôt que de vous forcer à les répartir dans les méthodes de cycle de vie.

>Explication détaillée
>
>Vous pouvez en apprendre davantage sur `useEffect` sur la page dédiée : [Utiliser le Hook d’effet](/docs/hooks-effect.html).

## ✌️ Règles des Hooks {#rules-of-hooks}

Les Hooks sont des fonctions JavaScript, mais ils imposent deux règles supplémentaires :

* Appelez les Hooks uniquement **au niveau racine**. N'appelez pas de Hooks à l'intérieur de boucles, de code conditionnel ou de fonctions imbriquées.
* Appelez les Hooks uniquement **depuis des fonctions composants React**. N'appelez pas les Hooks depuis des fonctions JavaScript classiques. (Il n'y a qu'un seul autre endroit où vous pouvez appeler des Hooks : vos propres Hook personnalisés. Nous en reparlerons dans un moment.)

Nous fournissons un [plugin ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks) qui assure le respect de ces deux règles. Nous comprenons que ces règles peuvent sembler limitantes ou déroutantes au premier abord, mais elles sont essentielles pour que les Hooks fonctionnent correctement.

>Explication détaillée
>
>Vous pouvez en apprendre davantage sur ces règles sur la page dédiée : [Règles des Hooks](/docs/hooks-rules.html).

## 💡 Construire vos propres Hooks {#building-your-own-hooks}

Parfois, on veut réutiliser la même logique à état dans plusieurs composants. Traditionnellement, on avait deux solutions répandues à ce besoin : les [composants d'ordre supérieur](/docs/higher-order-components.html) et les [props de rendu](/docs/render-props.html). Les Hooks personnalisés vous permettent de faire la même chose, mais sans ajouter de composants à votre arbre.

Un peu plus tôt sur cette page, nous avons présenté un composant `FriendStatus` qui appelle les Hooks `useState` et `useEffect` pour s‘abonner à l'état de connection d'un ami. Disons que l'on veut réutiliser cette logique d’abonnement dans un autre composant.

Tout d'abord, nous allons extraire cette logique dans un Hook personnalisé appelé `useFriendStatus` :

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

Il prend `friendID` comme argument, et renvoie l'état de connexion de notre ami.

Nous pouvons désormais l'utiliser dans les deux composants :


```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Chargement...';
  }
  return isOnline ? 'En ligne' : 'Hors-ligne';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

Les états locaux de ces composants sont complètement indépendants. Les Hooks permettent de réutiliser la *logique à état*, et non l'état lui-même. En fait, chaque *appel* à un Hook a un état complètement isolé ; vous pouvez même utiliser deux fois le même Hook personnalisé dans un même composant.

Les Hooks personnalisés sont plus une convention qu'une fonctionnalité. Si le nom d'une fonction commence par `use` et qu'elle appelle un autre Hook, nous dirons que c’est un Hook personnalisé. La convention de nommage `useSomething` permet à notre plugin ESLint de détecter les bugs dans un code utilisant les Hooks.

Vous pouvez écrire des Hooks personnalisés pour gérer un large éventail de cas d'usage tels que la gestion des formulaires, les animations, les abonnements déclaratifs, les horloges et probablement de nombreux autres auxquels nous n'avons pas pensé. Nous avons hâte de voir quels Hooks personnalisés la communauté React va inventer.

>Explication détaillée
>
>Vous pouvez en apprendre davantage sur les Hooks personnalisés sur une page dédiée : [Construire vos propres Hooks](/docs/hooks-custom.html).

## 🔌 Autres Hooks {#other-hooks}

Il y a quelques Hooks prédéfinis plus rarement utilisés qui pourraient vous intéresser. Par exemple, [`useContext`](/docs/hooks-reference.html#usecontext) vous permet d’utiliser les Contextes de React sans imbrication superflue :

```js{2,3}
function Example() {
  const locale = useContext(LocaleContext);
  const theme = useContext(ThemeContext);
  // ...
}
```

Et [`useReducer`](/docs/hooks-reference.html#usereducer) vous permet de gérer l'état local de composants complexes avec un réducteur :

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer);
  // ...
```

>Explication détaillée
>
>Vous pouvez en apprendre davantage sur les Hooks prédéfinis sur une page dédiée : [Référence de l'API des Hooks](/docs/hooks-reference.html).

## Prochaines étapes {#next-steps}

Eh bien, c’était rapide ! Si quelque chose n’était pas clair ou que vous souhaitez en savoir plus, vous pouvez consulter les prochaines pages, en débutant avec la documentation du [Hook d'état](/docs/hooks-state.html).

Vous pouvez aussi consulter la [référence de l'API des Hooks](/docs/hooks-reference.html) et la [FAQ des Hooks](/docs/hooks-faq.html).

Pour finir, pensez à lire [l’introduction aux Hooks](/docs/hooks-intro.html), qui explique *pourquoi* nous avons ajouté les Hooks et comment nous allons commencer à les utiliser en parallèle des classes—sans ré-écrire nos applis.
