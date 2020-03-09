---
id: hooks-custom
title: Construire vos propres Hooks
permalink: docs/hooks-custom.html
next: hooks-reference.html
prev: hooks-rules.html
---

Les *Hooks* sont une nouveauté de React 16.8. Ils permettent de bénéficier d’un état local et d'autres fonctionnalités de React sans avoir à écrire de classes.

Construire vos propres Hooks vous permet d'extraire la logique d'un composant sous forme de fonctions réutilisables.

Lorsque nous apprenions à utiliser [le Hook d’effet](/docs/hooks-effect.html#example-using-hooks-1), nous avons vu ce composant d'une application de chat qui affiche un message selon qu’un ami est en ligne ou hors-ligne.

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

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

Disons maintenant que notre application de chat possède aussi une liste de contacts et que nous souhaitons afficher en vert les noms des utilisateurs qui sont en ligne. Nous pourrions copier et coller une logique similaire à celle ci-dessus dans notre composant `FriendListItem` mais ça ne serait pas idéal :

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendListItem(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

Nous aimerions plutôt partager cette logique entre `FriendStatus` et `FriendListItem`.

Traditionnellement en React, nous avions deux manières répandues de partager une logique d'état entre des composants : les [props de rendu](/docs/render-props.html) et les [composants d'ordre supérieur](/docs/higher-order-components.html). Nous allons voir comment les Hooks règlent la majeure partie de ces problèmes sans vous obliger à ajouter des composants dans l'arbre.

## Extraire un Hook personnalisé {#extracting-a-custom-hook}

Lorsque nous souhaitons partager de la logique entre deux fonctions JavaScript, nous l'extrayons dans une troisième fonction. Les composants et les Hooks sont des fonctions, ça fonctionne donc aussi pour eux !

**Un Hook personnalisé est une fonction JavaScript dont le nom commence par "`use`" et qui peut appeler d'autres Hooks.** Par exemple, `useFriendStatus` ci-dessous est notre premier Hook personnalisé :

```js{3}
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

Il n'y a rien de nouveau à l'intérieur ; la logique provient des composants vus plus haut. Comme lorsque vous êtes dans un composant, assurez-vous d'appeler les autres Hooks de façon inconditionnelle et au niveau racine de votre Hook personnalisé.

Contrairement à un composant React, un Hook personnalisé n'a pas besoin d'avoir une signature particulière. Nous pouvons décider s'il a besoin d'accepter des arguments et ce qu'il doit éventuellement renvoyer. En d'autres termes, c'est une simple fonction. Son nom doit toujours commencer par `use` pour qu'au premier coup d'œil vous sachiez que les [règles des Hooks](/docs/hooks-rules.html) lui sont applicables.

L'objectif de notre Hook `useFriendStatus` est de nous abonner au statut d'un ami. C'est pourquoi il prend `friendID` comme argument et nous renvoie si notre ami est en ligne :

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  return isOnline;
}
```

Voyons maintenant comment nous pouvons utiliser notre Hook personnalisé.

## Utiliser un Hook personnalisé {#using-a-custom-hook}

À la base, notre but était de supprimer la logique dupliquée entre les composants `FriendStatus` et `FriendListItem`. Les deux veulent savoir si un ami est en ligne.

Maintenant que nous avons extrait cette logique dans un hook `useFriendStatus`, nous pouvons *simplement l'utiliser :*

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

**Ce code est-il équivalent aux exemples de départ ?** Oui, il fonctionne exactement de la même manière. Si vous regardez de plus près, vous remarquerez que nous n'avons en rien changé le comportement. Tout ce que nous avons fait, c’est déplacer du code commun à deux fonctions dans une fonction séparée. **Les Hooks personnalisés sont une convention qui découle naturellement du principe des Hooks, plutôt qu'une véritable fonctionnalité de React.**

**Dois-je nommer mes Hooks personnalisés en commençant par "`use`" ?** Oui, s'il vous plaît. Cette convention est très importante. Sans elle, nous ne pourrions pas vérifier automatiquement les violations des [règles des Hooks](/docs/hooks-rules.html) car nous ne pourrions être sûrs qu’une fonction contient des appels à des Hooks.

**Est-ce que deux composants utilisant le même Hook partagent le même état ?** Non. Les Hooks personnalisés sont un mécanisme de réutilisation de *logique à état* (comme la mise en place d'un abonnement et la mémorisation de sa valeur courante), mais chaque fois qu'on utilise un Hook personnalisé, tous les états et effets qu’il utilise sont totalement isolés.

**Comment l'état d'un Hook personnalisé est-il isolé ?** Chaque *appel* à un Hook se voit attribuer un état isolé. Comme nous appelons `useFriendStatus` directement, du point de vue de React notre composant appelle simplement `useState` et `useEffect`. Et comme nous l'avons [appris](/docs/hooks-state.html#tip-using-multiple-state-variables) [précédemment](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns), nous pouvons appeler `useState` et `useEffect` plusieurs fois dans un composant et ils seront complètement indépendants.

### Astuce: passer de l'information entre les Hooks {#tip-pass-information-between-hooks}

Comme les Hooks sont des fonctions, nous pouvons passer de l'information entre eux.

Pour illustrer ça, nous allons utiliser un autre composant de notre hypothétique exemple de chat. Voici un sélecteur de destinataire de message qui affiche si l'ami sélectionné est en ligne :

```js{8-9,13}
const friendList = [
  { id: 1, name: 'Phoebe' },
  { id: 2, name: 'Rachel' },
  { id: 3, name: 'Ross' },
];

function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);

  return (
    <>
      <Circle color={isRecipientOnline ? 'green' : 'red'} />
      <select
        value={recipientID}
        onChange={e => setRecipientID(Number(e.target.value))}
      >
        {friendList.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}
```

Nous gardons l'ID de l'ami sélectionné dans la variable d'état `recipientID`, et nous la mettons à jour si l'utilisateur sélectionne un ami différent dans le `<select>` de la liste.

Puisque l'appel au Hook `useState` nous renvoie la dernière valeur de la variable d'état `recipientID`, nous pouvons la passer en argument à notre Hook personnalisé `useFriendStatus` :

```js
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
```

Nous pouvons ainsi savoir si l'ami *actuellement sélectionné* est en ligne. Si nous sélectionnons un autre ami et mettons à jour la variable d'état `recipientID`, notre Hook `useFriendStatus` va se désabonner de l'ami précédemment sélectionné et s'abonner au statut de son remplaçant.

## `useYourImagination()` {#useyourimagination}

Les Hooks personnalisés offrent une souplesse de partage de logique qui n'était pas possible avec les composants React auparavant. Vous pouvez écrire des Hooks personnalisés qui couvrent un large éventail de cas d'usage tels que la gestion de formulaires, les animations, les abonnements déclaratifs, les horloges et probablement de nombreux autres auxquels nous n'avons pas pensé. Qui plus est, vous pouvez construire des Hooks qui sont aussi simples à utiliser que les fonctionnalités fournies par React.

Essayez de résister à la tentation de faire des extractions prématurées de Hooks. À présent que les fonctions composants peuvent en faire plus, il est probable que les fonctions composants de votre base de code grossissent, en moyenne. C'est normal : ne vous sentez pas *obligé·e* d’en extraire des Hooks. Ceci dit, nous vous encourageons tout de même à commencer à repérer des cas où un Hook personnalisé pourrait masquer une logique complexe derrière une interface simple, ou aider à démêler un composant dont le code est incompréhensible.

Par exemple, peut-être avez-vous un composant complexe qui contient beaucoup d'états locaux gérés de manière *ad hoc*. `useState` ne facilite pas la centralisation de la logique de mise à jour, du coup vous préféreriez peut-être la réécrire sous forme de réducteur [Redux](https://redux.js.org/) :

```js
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        text: action.text,
        completed: false
      }];
    // ... autres actions ...
    default:
      return state;
  }
}
```

Les réducteurs sont très pratiques à tester en isolation, et permettent d'exprimer lisiblement des logiques de mise à jour complexes. Vous pouvez toujours les découper en réducteurs plus petits si besoin. Cependant, vous pourriez aussi apprécier la gestion d'état local de React, ou ne pas vouloir installer une autre bibliothèque.

Et si nous pouvions écrire un Hook `useReducer` qui nous permettrait de gérer l'état *local*  de notre composant à l'aide d’un réducteur ? Une version simplifiée pourrait ressembler à ceci :

```js
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

Nous pourrions maintenant l'utiliser dans notre composant, et laisser le réducteur piloter sa gestion d'état :

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

Le besoin de gérer un état local avec un réducteur dans un composant complexe est si fréquent que nous avons  intégré le Hook `useReducer` directement dans React. Vous le trouverez avec d'autres Hooks prédéfinis dans la [référence de l'API des Hooks](/docs/hooks-reference.html).
