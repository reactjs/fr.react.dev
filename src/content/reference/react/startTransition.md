---
title: startTransition
---

<Intro>

`startTransition` vous permet de mettre à jour l'état sans bloquer l'UI.

```js
startTransition(scope)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `startTransition(scope)` {/*starttransitionscope*/}

<<<<<<< HEAD
La fonction `startTransition` vous permet de marquer une mise à jour d'état comme étant une transition.
=======
The `startTransition` function lets you mark a state update as a Transition.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

<<<<<<< HEAD
* `scope` : une fonction qui met à jour l'état en appelant au moins une [fonction `set`](/reference/react/useState#setstate).  React appelle immédiatement `scope` sans argument et marque toutes les mises à jour d'état demandées durant l'exécution synchrone de `scope` comme des transitions.  Elles seront [non bloquantes](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) et [n'afficheront pas d'indicateurs de chargement indésirables](/reference/react/useTransition#preventing-unwanted-loading-indicators).
=======
* `scope`: A function that updates some state by calling one or more [`set` functions.](/reference/react/useState#setstate) React immediately calls `scope` with no arguments and marks all state updates scheduled synchronously during the `scope` function call as Transitions. They will be [non-blocking](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](/reference/react/useTransition#preventing-unwanted-loading-indicators)
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

#### Valeur renvoyée {/*returns*/}

`startTransition` ne renvoie rien.

#### Limitations {/*caveats*/}

<<<<<<< HEAD
* `startTransition` ne fournit pas de moyen de surveiller la progression de la transition.  Pour afficher un indicateur pendant que la transition a lieu, utilisez plutôt [`useTransition`](/reference/react/useTransition).

* Vous pouvez enrober une mise à jour dans une transition uniquement si vous avez accès à la fonction `set` de l'état en question.  Si vous souhaitez démarrer une transition en réaction à une prop ou à la valeur renvoyée par un Hook personnalisé, utilisez plutôt [`useDeferredValue`](/reference/react/useDeferredValue).

* La fonction que vous passez à `startTransition` doit être synchrone.  React exécute cette fonction immédiatement, et marque toutes les mises à jour demandées lors de son exécution comme des transitions.  Si vous essayez de faire des mises à jour d'état plus tard (par exemple avec un timer), elles ne seront pas marquées comme des transitions.

* Une mise à jour d'état marquée comme une transition pourra être interrompue par d'autres mises à jour d'état.  Par exemple, si vous mettez à jour un composant de graphe au sein d'une transition, mais commencez alors une saisie dans un champ texte tandis que le graphe est en train de refaire son rendu, React redémarrera le rendu du composant graphe après avoir traité la mise à jour d'état du champ.
=======
* `startTransition` does not provide a way to track whether a Transition is pending. To show a pending indicator while the Transition is ongoing, you need [`useTransition`](/reference/react/useTransition) instead.

* You can wrap an update into a Transition only if you have access to the `set` function of that state. If you want to start a Transition in response to some prop or a custom Hook return value, try [`useDeferredValue`](/reference/react/useDeferredValue) instead.

* The function you pass to `startTransition` must be synchronous. React immediately executes this function, marking all state updates that happen while it executes as Transitions. If you try to perform more state updates later (for example, in a timeout), they won't be marked as Transitions.

* A state update marked as a Transition will be interrupted by other state updates. For example, if you update a chart component inside a Transition, but then start typing into an input while the chart is in the middle of a re-render, React will restart the rendering work on the chart component after handling the input state update.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

* Les mises à jour en transition ne peuvent pas être utilisées pour contrôler des champs textuels.

<<<<<<< HEAD
* Si plusieurs transitions sont en cours, React les regroupe pour le moment.  Cette limitation sera sans doute levée dans une future version.
=======
* If there are multiple ongoing Transitions, React currently batches them together. This is a limitation that will likely be removed in a future release.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

---

## Utilisation {/*usage*/}

<<<<<<< HEAD
### Marquer une mise à jour d'état comme étant une transition non bloquante {/*marking-a-state-update-as-a-non-blocking-transition*/}

Vous pouvez indiquer qu'une mise à jour d'état doit être traitée comme une *transition* en l'enrobant dans un appel à `startTransition` :
=======
### Marking a state update as a non-blocking Transition {/*marking-a-state-update-as-a-non-blocking-transition*/}

You can mark a state update as a *Transition* by wrapping it in a `startTransition` call:
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Les transitions vous permettent de conserver des mises à jour d'interface utilisateur réactives même sur des appareils lents.

<<<<<<< HEAD
Avec une transition, votre UI reste réactive pendant le rendu. Par exemple, si l'utilisateur clique sur un onglet mais ensuite change d'avis et va sur un autre onglet, il peut le faire sans devoir d'abord attendre que le premier onglet ait fini son rendu.

<Note>

`startTransition` est très similaire à [`useTransition`](/reference/react/useTransition), à ceci près qu'elle ne fournit pas le drapeau `isPending` pour surveiller la progression de la transition.  Vous pouvez appeler `startTransition` quand `useTransition` est indisponible. En particulier, `startTransition` fonctionne hors des composants, comme par exemple dans une bibliothèque de gestion de données.

[Apprenez-en davantage sur les transitions et consultez des exemples sur la page de `useTransition`](/reference/react/useTransition).
=======
With a Transition, your UI stays responsive in the middle of a re-render. For example, if the user clicks a tab but then change their mind and click another tab, they can do that without waiting for the first re-render to finish.

<Note>

`startTransition` is very similar to [`useTransition`](/reference/react/useTransition), except that it does not provide the `isPending` flag to track whether a Transition is ongoing. You can call `startTransition` when `useTransition` is not available. For example, `startTransition` works outside components, such as from a data library.

[Learn about Transitions and see examples on the `useTransition` page.](/reference/react/useTransition)
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

</Note>
