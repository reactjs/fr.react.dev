---
id: hooks-custom
title: Construire vos propres Hooks
permalink: docs/hooks-custom.html
next: hooks-reference.html
prev: hooks-rules.html
---

*Hooks* are a new addition in React 16.8. They let you use state and other React features without writing a class.

Construire vos propres Hooks vous permet d'extraire la logique d'un composant sous forme de fonctions réutilisables.

Lorsque nous apprenions à utiliser [les effets](/docs/hooks-effect.html#example-using-hooks-1), nous avons vu ce composant d'une application de chat qui affiche un message lorsqu'un ami est en ligne ou hors-ligne.

```js{4-15}
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

Disons maintenant que notre application de chat posséde aussi une liste de contact et que nous souhaitons afficher les noms des utilisateurs en ligne en vert. Nous pouvons copier et coller une logique smilaire à celle ci-dessus dans notre composant `FriendListItem` mais ça ne serait pas idéal :

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendListItem(props) {
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

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

Nous aimerions plutôt partager cette logique entre `FriendStatus` et `FriendListItem`.

Traditionnellement en React, nous avions deux manières populaires de partager une logique d'état entre des composants : les [render props](/docs/render-props.html) et les [composants d'ordre supérieur](/docs/higher-order-components.html). Nous allons voir comment les Hooks règlent la majeure partie de ces problèmes sans vous obliger à ajouter plus de composants dans l'arbre.

## Extraire un Hook personnalisé {#extracting-a-custom-hook}

Lorsque nous souhaitons partager de la logique entre deux fonctions JavaScript, nous la séparons dans une troisième fonction. Les composants et les Hooks sont des fonctions, ça fonctionne donc aussi pour elles !

**Un Hook personnalisé est une fonction JavaScript dont le nom commence par "`use`" et qui peut appeler d'autres Hooks.** Par exemple, `useFriendStatus` ci-dessous est notre premier Hook personnalisé :

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

Il n'y a rien de nouveau à l'intérieur -- la logique provient des composants au dessus. De la même manière que dans un composant, assurez-vous d'appeler les autres Hooks sans conditions au niveau racine de votre Hook personnalisé.

Contrairement à un composant React, un Hook personnalisé n'a pas besoin d'une signature particulière. Nous pouvons décider s'il a besoin d'accepter des arguments et ce qu'il doit renvoyer. En d'autres termes, c'est une simple fonction. Son nom doit toujours commencer par `use` pour qu'au premier coup d'oeil vous sachiez que les [règles des Hooks](/docs/hooks-rules.html) s'appliquent.

L'objectif de notre Hook `useFriendStatus` est de nous inscrire au statut d'un ami. C'est pourquoi il accepte `friendID` en argument et il nous renvoie si notre ami est en ligne :

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  return isOnline;
}
```

Voyons voir comment nous pouvons utiliser notre Hook personnalisé.

## Utiliser un Hook personnalisé {#using-a-custom-hook}

Au commencement, notre but était de supprimer la logique dupliquée entre les composants `FriendStatus` et `FriendListItem`. Les deux veulent savoir si un ami est en ligne.

Maintenant que nous avons extrait cette logique dans un hook `useFriendStatus`, nous pouvons *simplement l'utiliser :*

```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Chargement...';
  }
  return isOnline ? 'Hors-ligne' : 'En ligne';
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

**Ce code est-il équivalent aux exemples originaux ?** Oui, il fonctionne exactement de la même manière. Si vous regardez de plus près, vous remarquerez que nous n'avons réalisé aucun changement de comportement. Tout ce que nous avons fait est de déplacer du code commun à deux fonction dans une fonction séparée. **Les Hooks personnalisés sont une convention qui découle naturellement du principe des Hooks, plus qu'une fonctionnalité React.**

**Dois-je nommer mes Hooks personnalisés en commençant par "`use`" ?** Oui, s'il vous plaît. Cette convention est très importante. Sans elle, nous ne serions pas capable de vérifier automatiquement les violations des [règles des Hooks](/docs/hooks-rules.html) car nous ne pourrions dire si une fonction contient des appels aux Hooks.

**Est-ce que deux composants utilisant le même Hook partagent le même état?** Non. Les Hooks personnalisés sont un mécanisme de réutilisation de *logique d'état* (comme la mise en place d'une souscription et la mémorisation d'une valeur courante), mais chaque fois que l'on utilise un Hook personnalisé, tout état ou effet à l'intérieur est complétement isolé.

**Comment l'état d'un Hook personnalisé est-il isolé?** Chaque *appel* à un Hook se voit attribuer un état isolé. Parce que nous appelons `useFriendStatus` directement, d'un point de vue React, notre composant appelle simplement `useState` et `useEffect`. Et comme nous l'avons [appris](/docs/hooks-state.html#tip-using-multiple-state-variables) [précédemment](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns), nous pouvons appeler `useState` et `useEffect` plusieurs fois dans un composant et ils seront complétement indépendant.

### Astuce: Passer de l'Information Entre les Hooks {#tip-pass-information-between-hooks}

Comme les Hooks sont des fonctions, nous pouvons passer de l'information entre elles.

Pour illustrer cela, nous allons utiliser un autre composant de notre hypothétique exemple de chat. Ceci est une liste de destinataire qui affiche si l'ami sélectionné est en ligne :

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

Nous gardons l'ID de l'ami choisi dans la variable d'état `recipientID`, et nous la mettons à jour si l'utilisateur choisi un ami différent dans le `<select>` de la liste.

Parce que l'appel au Hook `useState` nous renvoie la dernière valeur de la variable d'état `recipientID`, nous pouvons la passer en argument à notre Hook personnalisés `useFriendStatus` :

```js
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
```

Cela nous permet de savoir si l'ami *actuellement sélectionné* est en ligne. Si nous choisissons un ami différent et mettons à jour la variable d'état `recipientID`, notre Hook `useFriendStatus` va se désinscrire de l'ami précédemment sélectionné et s'inscrire au statut du nouveau sélectionné.

## `useYourImagination()` {#useyourimagination}

Les Hooks personnalisés vous offre la souplesse de partager de la logique, ce qui n'était pas possible avant avec les composants React. Vous pouvez écrire des Hooks personnalisés qui couvrent un large panel de cas d'utilisation comme la gestion des formulaires, des animations, des inscriptions déclaratives, des minuteurs et bien plus. De plus, vous pouvez construire des Hooks qui sont aussi simple à utiliser que des fonctionnalités intégrées à React.

Essayez de résister d'abstraire trop tôt. Maintenant que nos fonctions composants peuvent faire plus, il est probable que la moyenne de fonction composant dans votre base de code grossisse. C'est normal -- ne vous sentez pas *obligé* de les séparer en Hooks. Mais nous vous encourageons à commencer à chercher des cas où un Hook personnalisé pourrait cacher une logique complexe derrière une simple interface, ou aider à démêler un composant compliqué.

Par exemple, peut-être que vous avez un composant complexe qui contient beaucoup d'état local géré de manière ad-hoc. `useState` ne permet pas de simplifier la centralisation de la logique de mise à jour. Dans ce cas vous pourriez préférer l'écriture d'un reducer [Redux](https://redux.js.org/) :

```js
function todosReducer(state, action) {
  switch (action.type) {
    case 'ajouter':
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

Les reducers sont très pratiques pour tester en isolation et sont adaptés à l'expression de logique de mise à jour complexe. Plus tard, si besoin vous pouvez les séparer dans des reducers plus petit. Cependant, vous pourriez aussi bénéficier de l'utilisation de l'état local de React, ou vous pourriez ne pas vouloir installer une autre bibliothèque.

Et si nous pouvions écrire un Hook `useReducer` qui nous permettrait de gérer l'état *local*  de notre composant avec un reducer ? Une version simplifiée pourrait ressembler à ceci :

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

Nous pouvons maintenant l'utiliser dans un composant et laisser le reducer commander sa gestion d'état :

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'ajouter', text });
  }

  // ...
}
```

Le besion de gérer un état local avec un reducer dans un composant complexe est assez commun, nous avons donc intégré le Hook `useReducer` directement dans React. Vous le trouverez ainsi que d'autres Hooks dans la [référence de l'API des Hooks](/docs/hooks-reference.html).
