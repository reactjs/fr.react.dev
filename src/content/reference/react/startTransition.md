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

La fonction `startTransition` vous permet de marquer une mise à jour d'état comme étant une Transition.

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

* `scope` : une fonction qui met à jour l'état en appelant au moins une [fonction `set`](/reference/react/useState#setstate).  React appelle immédiatement `scope` sans argument et marque toutes les mises à jour d'état demandées durant l'exécution synchrone de `scope` comme des Transitions.  Elles seront [non bloquantes](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) et [n'afficheront pas d'indicateurs de chargement indésirables](/reference/react/useTransition#preventing-unwanted-loading-indicators).

#### Valeur renvoyée {/*returns*/}

`startTransition` ne renvoie rien.

#### Limitations {/*caveats*/}

* `startTransition` ne fournit pas de moyen de surveiller la progression de la Transition.  Pour afficher un indicateur pendant que la Transition a lieu, utilisez plutôt [`useTransition`](/reference/react/useTransition).

* Vous pouvez enrober une mise à jour dans une Transition uniquement si vous avez accès à la fonction `set` de l'état en question.  Si vous souhaitez démarrer une Transition en réaction à une prop ou à la valeur renvoyée par un Hook personnalisé, utilisez plutôt [`useDeferredValue`](/reference/react/useDeferredValue).

* La fonction que vous passez à `startTransition` doit être synchrone.  React exécute cette fonction immédiatement, et marque toutes les mises à jour demandées lors de son exécution comme des Transitions.  Si vous essayez de faire des mises à jour d'état plus tard (par exemple avec un timer), elles ne seront pas marquées comme des Transitions.

* Une mise à jour d'état marquée comme une Transition pourra être interrompue par d'autres mises à jour d'état.  Par exemple, si vous mettez à jour un composant de graphe au sein d'une Transition, mais commencez alors une saisie dans un champ texte tandis que le graphe est en train de refaire son rendu, React redémarrera le rendu du composant graphe après avoir traité la mise à jour d'état du champ.

* Les mises à jour en Transition ne peuvent pas être utilisées pour contrôler des champs textuels.

* Si plusieurs Transitions sont en cours, React les regroupe pour le moment.  Cette limitation sera sans doute levée dans une future version.

---

## Utilisation {/*usage*/}

### Marquer une mise à jour d'état comme étant une Transition non bloquante {/*marking-a-state-update-as-a-non-blocking-transition*/}

Vous pouvez indiquer qu'une mise à jour d'état doit être traitée comme une *Transition* en l'enrobant dans un appel à `startTransition` :

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

Les Transitions vous permettent de conserver des mises à jour d'interface utilisateur réactives même sur des appareils lents.

Avec une Transition, votre UI reste réactive pendant le rendu. Par exemple, si l'utilisateur clique sur un onglet mais ensuite change d'avis et va sur un autre onglet, il peut le faire sans devoir d'abord attendre que le premier onglet ait fini son rendu.

<Note>

`startTransition` est très similaire à [`useTransition`](/reference/react/useTransition), à ceci près qu'elle ne fournit pas le drapeau `isPending` pour surveiller la progression de la Transition.  Vous pouvez appeler `startTransition` quand `useTransition` est indisponible. En particulier, `startTransition` fonctionne hors des composants, comme par exemple dans une bibliothèque de gestion de données.

[Apprenez-en davantage sur les Transitions et consultez des exemples sur la page de `useTransition`](/reference/react/useTransition).

</Note>
