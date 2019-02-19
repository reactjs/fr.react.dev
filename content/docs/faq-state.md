---
id: faq-state
title: État du composant
permalink: docs/faq-state.html
layout: docs
category: FAQ
---

### Que fait `setState` ? {#what-does-setstate-do}

`setState()` programmes la mise à jour de l'objet `state` du composant. Quand l'état change, le composant répond en refaisant le rendu du composant.

### Quelle différence entre `state` et `props` ? {#what-is-the-difference-between-state-and-props}

[`props`](/docs/components-and-props.html) (diminutif de "propriétés") et [`state`](/docs/state-and-lifecycle.html) sont tous les deux de purs objets JavaScript. Alors qu'ils contiennent tous deux des informations qui influencent le résultat du rendu, ils possèdent une différence majeure : `props` est passé *au* composant (à la manière des paramètres d'une fonction) quand `state` est géré *dans* le composant (comme le sont les variables déclarées à l'intérieur d'une fonction).

Ci-dessous quelques ressources utiles pour en apprendre plus sur quand utiliser `props` au lieu de `state`:
* [Props vs State](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
* [ReactJS : Props vs. State](http://lucybain.com/blog/2016/react-state-vs-pros/)

### Pourquoi `setState` me retourne une mauvaise valeur ? {#why-is-setstate-giving-me-the-wrong-value}

Dans React, In React, `this.props` et `this.state` représente l'un et l'autre les valeurs rendues, i.e. ce qui se trouve actuellement à l'écran.

Les appels à `setState` sont asynchrones - ne comptez pas sur `this.state` pour refléter la nouvelle valeur immédiatement après avoir appelé `setState`. Passez une fonction de mise à jour à la place d'un objet si vous devez calculer des valeurs en fonction de l'état actuel (voir ci-dessous pour plus de détails).

Exemple de code qui ne se comporte *pas* comme attendu :

```jsx
incrementCount() {
  // Note : cela ne va *pas* fonctionner comme prévu.
  this.setState({count: this.state.count + 1});
}

handleSomething() {
  // Disons que `this.state.count` commence à 0.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();
  // Losrque React refait le rendu du composant, `this.state.count` est à 1, pourtant, on espère avoir 3.

  // C'est parce la fonction `incrementCount()` ci-dessus lit `this.state.count`,
  // mais React ne met pas à jour`this.state.count` tant que le composant n'a pas refait le rendu.
  // Donc `incrementCount()` finit par lire `this.state.count` à 0 à chaque fois et le définit à 1.

  // La correctif est décrite ci-dessous !
}
```

Voir ci-dessous pour savoir comment résoudre ce problème.

### Comment mettre à jour l'état avec des valeurs qui dépendent de l'état actuel ? {#how-do-i-update-state-with-values-that-depend-on-the-current-state}

Passez une fonction au lieu d'un objet à `setState` pour vous assurer que l'appel utilise toujours la version la plus récente de l'état (voir ci-dessous).

### Qu'elle est la différence entre passer un objet ou une fonction dans `setState` ? {#what-is-the-difference-between-passing-an-object-or-a-function-in-setstate}

Passer une fonction de mise à jour vous permet d'accéder à la valeur de l'état actuel à l'intérieur de la fonction de mise à jour. Comme les appels `setState` sont groupés en lot, cela vous permet d'enchaîner les mises à jour et de vous assurer qu'elles se réalisent les unes par-dessus les autres au lieu d'entrer en conflit :

```jsx
incrementCount() {
  this.setState((state) => {
    // Important: lire `state` au lieu de `this.state` lors de la mise à jour.
    return {count: state.count + 1}
  });
}

handleSomething() {
  // Disons que `this.state.count` commence à 0.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();

  // Si vous lisez `this.state.count` maintenant, cela serait toujours 0.
  // Mais lorsque React refera le rendu du composant, cela sera 3.
}
```

[En apprendre plus sur setState](/docs/react-component.html#setstate)

### Quand `setState` est-il asynchrone ? {#when-is-setstate-asynchronous}

Actuellement, `setState` est asynchrone à l'intérieur des gestionnaires d'événements.

Cela assure, par exemple, que si le `Parent` et l'`Enfant` appellent tous les deux `setState` pendant un événement clic, l'`Enfant` ne refait pas le rendu deux fois. Au lieu de ça, React "efface" les mises à jour de l'état à la fin de l'événement du navigateur. Le résultat se traduit par une amélioration significative des performances pour les grandes applications.

Il s'agit d'un détail de l'implémentation donc évitez de vous appuyer dessus. Dans des versions futures, React groupera les mises à jour par défaut dans de plus en plus de cas de figure.

### Pourquoi React ne met-il pas à jour `this.state` de manière synchrone ? {#why-doesnt-react-update-thisstate-synchronously}

Comme expliqué dans la section précédente, React "attend" intentionnellement jusqu'à ce que tous les composants appellent `setState()` dans leurs gestionnaires d'événements avant de commencer à effectuer un nouveau rendu. Cela améliore la performance en évitant des rendus inutiles.

Cependant, vous vous demandez peut-être toujours pourquoi React ne met pas juste à jour `this.state` immédiatement sans faire de nouveau rendu.

Il y a deux raisons principales :

* Cela briserait la cohérence entre `props` et `state`, entraînant des problèmes très difficiles à déboguer.
* Cela rendrait certaines nouvelles fonctionnalités sur lesquelles nous travaillons impossibles à mettre en pratique.

Ce [commentaire GitHub](https://github.com/facebook/react/issues/11527#issuecomment-360199710) plonge profondément dans les exemples spécifiques.

### Devrais-je utiliser une bibliothèque de gestion d'état comme Redux ou Mobx ? {#should-i-use-a-state-management-library-like-redux-or-mobx}

[Peut-être.](https://redux.js.org/faq/general#when-should-i-use-redux)

C'est une bonne idée de bien connaître React avant d'ajouter des bibliothèques supplémentaires. Vous pouvez créer des applications assez complexes en utilisant uniquement React.