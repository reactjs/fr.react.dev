---
id: faq-state
title: État local de composant
permalink: docs/faq-state.html
layout: docs
category: FAQ
---

### Que fait `setState` ? {#what-does-setstate-do}

`setState()` planifie la mise à jour de l'objet `state` du composant. Quand l'état local change, le composant répond en se rafraîchissant.

### Quelle est la différence entre `state` et `props` ? {#what-is-the-difference-between-state-and-props}

[`props`](/docs/components-and-props.html) (diminutif de « propriétés ») et [`state`](/docs/state-and-lifecycle.html) sont tous les deux des objets JavaScript bruts. Même s'ils contiennent tous les deux des informations qui influencent le résultat produit, ils présentent une différence majeure : `props` est passé *au* composant (à la manière des arguments d'une fonction) tandis que `state` est géré *dans* le composant (comme le sont les variables déclarées à l'intérieur d'une fonction).

Voici quelques ressources utiles pour mieux comprendre selon quels critères choisir entre `props` et `state` :
* [Props vs State](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
* [ReactJS: Props vs. State](https://lucybain.com/blog/2016/react-state-vs-pros/)

### Pourquoi `setState` me renvoie-t-elle une valeur incorrecte ? {#why-is-setstate-giving-me-the-wrong-value}

En React, `this.props` et `this.state` représentent l'un comme l'autre les valeurs du rendu, c’est-à-dire ce qui est actuellement affiché.

Les appels à `setState` sont asynchrones : ne comptez pas sur `this.state` pour refléter la nouvelle valeur immédiatement après avoir appelé `setState`. Passez une fonction de mise à jour à la place d'un objet si vous devez calculer des valeurs en fonction de l'état actuel (voir ci-dessous pour plus de détails).

Voici un exemple de code qui ne se comporte *pas* comme attendu :

```jsx
incrementCount() {
  // Attention : ça ne va *pas* fonctionner comme prévu.
  this.setState({count: this.state.count + 1});
}

handleSomething() {
  // Disons que `this.state.count` commence à 0.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();
  // Lorsque React rafraîchira le composant, `this.state.count` sera à 1,
  // pourtant, on s'attendait à 3.

  // C'est parce que la fonction `incrementCount()` ci-dessus lit `this.state.count`,
  // mais React ne met pas à jour `this.state.count` tant que le composant n'est pas rafraîchi.
  // Du coup `incrementCount()` lit `this.state.count` qui est égal à 0 à chaque fois,
  // et le définit à 1.

  // Le correctif est décrit ci-dessous !
}
```

Voir ci-dessous pour savoir comment résoudre ce problème.

### Comment mettre à jour l'état avec des valeurs qui dépendent de l'état actuel ? {#how-do-i-update-state-with-values-that-depend-on-the-current-state}

Passez une fonction au lieu d'un objet à `setState` pour vous assurer que l'appel utilise toujours la version la plus récente de l'état (voir ci-dessous).

### Quelle est la différence entre passer un objet ou une fonction à `setState` ? {#what-is-the-difference-between-passing-an-object-or-a-function-in-setstate}

Passer une fonction de mise à jour vous permet d'accéder à la valeur à jour de l'état actuel au sein de cette fonction. Comme les appels `setState` sont groupés par lots, ça vous permet d'enchaîner les mises à jour et de vous assurer qu'elles sont effectuées les unes après les autres au lieu d'entrer en conflit :

```jsx
incrementCount() {
  this.setState((state) => {
    // Important : lisez `state` au lieu de `this.state` lors de la mise à jour.
    return {count: state.count + 1}
  });
}

handleSomething() {
  // Disons que `this.state.count` commence à 0.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();

  // Si vous lisiez `this.state.count` maintenant, il serait toujours à 0.
  // Mais quand React rafraîchira le composant, il vaudra bien 3.
}
```

[En apprendre davantage sur setState](/docs/react-component.html#setstate)

### Quand `setState` est-elle asynchrone ? {#when-is-setstate-asynchronous}

Actuellement, `setState` est asynchrone à l'intérieur des gestionnaires d'événements.

Ça permet de garantir, par exemple, que si `Parent` et `Child` appellent tous les deux `setState` lors d'un clic, `Child` ne sera pas rafraîchi deux fois. Au lieu de ça, React « apure » les mises à jour de l'état à la fin de l'événement du navigateur. Ça permet une amélioration significative des performances pour les applications de grande ampleur.

Il s'agit d'un détail d'implémentation donc évitez de vous appuyer dessus. Dans de futures versions, React groupera par défaut les mises à jour dans davantage encore de cas de figure.

### Pourquoi React ne met-il pas à jour `this.state` de façon synchrone ? {#why-doesnt-react-update-thisstate-synchronously}

Comme expliqué dans la section précédente, React « attend » volontairement que tous les composants aient fini d'appeler `setState()` dans leurs gestionnaires d'événements avant de commencer à mettre à jour les rendus. Ça améliore les performances en évitant des rafraîchissements inutiles.

Cependant, vous vous demandez peut-être toujours pourquoi React ne met pas juste à jour `this.state` immédiatement sans rafraîchir.

Il y a deux raisons principales :

* Ça briserait la cohérence entre `props` et `state`, entraînant des problèmes très difficiles à déboguer.
* Ça rendrait certaines nouvelles fonctionnalités sur lesquelles nous travaillons impossibles à implémenter.

Ce [commentaire GitHub](https://github.com/facebook/react/issues/11527#issuecomment-360199710) entre dans le détail d’exemples spécifiques.

### Devrais-je utiliser une bibliothèque de gestion d'état, comme par exemple Redux ou Mobx ? {#should-i-use-a-state-management-library-like-redux-or-mobx}

[Peut-être.](https://redux.js.org/faq/general#when-should-i-use-redux)

Bien connaître React avant d'ajouter des bibliothèques supplémentaires reste une bonne idée. Vous pouvez créer des applications plutôt complexes en utilisant uniquement React.
