---
id: error-boundaries
title: Périmètres d'erreurs
permalink: docs/error-boundaries.html
---

Auparavant, les erreurs JavaScript au sein des composants avaient l'habitude de corrompre l'état interne de React, et de causer des [erreurs](https://github.com/facebook/react/issues/4026) [assez](https://github.com/facebook/react/issues/6895) [incompréhensibles](https://github.com/facebook/react/issues/8579) lors des rendus suivants. Ces erreurs étaient toujours causées par une erreur antérieure dans le code applicatif et comme React ne proposait alors aucun moyen de les gérer correctement dans les composants, il n'avait pas la possibilité de se rétablir.

## L'arrivée des périmètres d'erreurs {#introducing-error-boundaries}

Une erreur JavaScript au sein d’une partie de l'interface utilisateur (UI) ne devrait pas casser l'ensemble de l'application. Pour résoudre ce problème, React 16 a introduit un nouveau concept appelé « Périmètres d’erreurs » *(Error Boundaries, NdT)*.

Les périmètres d'erreurs sont des composants React qui **interceptent les erreurs JavaScript n'importe où au sein de leur arbre de composants enfants, enregistrent ces erreurs, et affichent une UI de repli** à la place de l'arbre de composants qui a planté. Les périmètres d'erreurs interceptent les erreurs survenant au rendu, dans les méthodes de cycle de vie, ainsi que dans les constructeurs de tous les éléments de leur arborescence.

> Remarque
>
> Les périmètres d'erreurs n'interceptent **pas** les erreurs qui surviennent dans :
>
> * Les gestionnaires d'événements ([en savoir plus](#how-about-event-handlers)).
> * Le code asynchrone (par exemple les fonctions de rappel de `setTimeout` ou `requestAnimationFrame`).
> * Le rendu côté serveur.
> * Les erreurs levées dans le composant du périmètre d'erreur lui-même (plutôt qu'au sein de ses enfants).

Une classe de composant devient un périmètre d'erreur si elle définit au moins une des méthodes de cycle de vie [`static getDerivedStateFromError()`](/docs/react-component.html#static-getderivedstatefromerror) ou [`componentDidCatch()`](/docs/react-component.html#componentdidcatch). Utilisez `static getDerivedStateFromError()` pour afficher une UI de repli lorsqu'une erreur est levée. Utilisez `componentDidCatch()` pour enregistrer les informations relatives à l'erreur.

```js{7-10,12-15,18-21}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Mettez à jour l'état, de façon à montrer l'UI de repli au prochain rendu.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez aussi enregistrer l'erreur au sein d'un service de rapport.
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Vous pouvez afficher n'importe quelle UI de repli.
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

Vous pouvez alors l'utiliser comme un composant classique :

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

Les périmètres d'erreurs fonctionnent comme un bloc JavaScript `catch {}`, mais pour les composants. Seuls les composants à base de classe peuvent être des périmètres d'erreurs. En pratique, vous voudrez généralement définir un seul composant de périmètre d'erreur puis l'utiliser partout dans votre application.

Notez bien que **les périmètres d'erreurs ne détectent que les erreurs présentes en dessous d'eux dans l'arbre des composants**. Un périmètre d'erreur ne peut intercepter une erreur survenant dans son propre code. Si un périmètre d'erreur plante en tentant d'afficher son message d'erreur, l’erreur se propagera alors au périmètre d'erreur le plus proche au-dessus de lui dans l'arbre. Là aussi, c'est similaire à la façon dont le bloc `catch {}` fonctionne en JavaScript.

## Démonstration interactive {#live-demo}

Jetez un coup d'œil sur [cet exemple de déclaration et d'utilisation d'un périmètre d'erreur](https://codepen.io/gaearon/pen/wqvxGa?editors=0010) avec [React 16](/blog/2017/09/26/react-v16.0.html).


## Où placer les périmètres d'erreurs ? {#where-to-place-error-boundaries}

La granularité des périmètres d'erreurs est à votre discrétion. Vous pourriez enrober les composants racines de routage pour afficher à l'utilisateur un message du type « Quelque chose s'est mal passé », à l'image de ce qui est souvent fait par les frameworks côté serveur. Vous pourriez aussi enrober des éléments d'interface précis avec un périmètre d'erreur afin de les empêcher de planter le reste de l'application.


## Nouveau comportement pour les erreurs non-rattrapées {#new-behavior-for-uncaught-errors}

Ce changement a un impact important. **À compter de React 16, les erreurs qui ne sont pas interceptées par un périmètre d'erreur entraîneront le démontage de l'intégralité de l'arbre des composants**.

Cette décision a été débattue, mais l'expérience nous a montré qu'il est bien pire de laisser en place une interface corrompue que de la supprimer complètement. Par exemple, dans un produit tel que Messenger, laisser visible une interface dégradée peut amener l'utilisateur à envoyer un message à la mauvaise personne. De la même façon, pour une application de paiement, afficher un mauvais montant est bien pire que de ne rien afficher du tout.

Cette modification signifie que lorsque vous migrez vers React 16, vous découvrirez probablement des plantages dans votre application qui étaient jusque-là passés inaperçus. L'ajout de périmètres d'erreurs permet d'offrir une meilleure expérience utilisateur en cas de problème.

Par exemple, Facebook Messanger enrobe le contenu de la barre latérale, du panneau d'information, du journal de conversation, ainsi que de la saisie de message dans des périmètres d'erreurs distincts. Si l'un des composants de ces zones d'interface plante, les autres continueront de fonctionner normalement.

Nous vous encourageons également à utiliser des services de rapport d'erreurs JavaScript (ou à construire le vôtre) afin de mieux connaître les exceptions non gérées dès qu'elles apparaissent en production, et donc de pouvoir les corriger.


## Traces de piles des composants {#component-stack-traces}

En mode développement, React 16 affiche dans la console toutes les erreurs qui apparaissent durant le rendu, même si l'application les cache accidentellement. En plus du message d'erreur et de la trace de pile *(stack trace, NdT)* JavaScript, il fournit également la trace de pile du composant. Vous pouvez désormais voir exactement où l'erreur est apparue dans l'arbre des composants :

<img src="../images/docs/error-boundaries-stack-trace.png" style="max-width:100%" alt="Une erreur interceptée par un périmètre d'erreur">

Vous pouvez également voir les noms des fichiers et les numéros de lignes dans la trace de pile du composant. C'est le fonctionnement par défaut pour les projets créés avec [Create React App](https://github.com/facebookincubator/create-react-app) :

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" style="max-width:100%" alt="Une erreur interceptée par un périmètre d'erreur avec les numéros de lignes">

Si vous n'utilisez pas Create React App, vous pouvez ajouter [cette extension](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source) manuellement dans votre configuration Babel. Remarquez que c'est conçu pour le développement et **ne doit pas être activé en production**.

> Remarque
>
> Les noms des composants affichés dans la trace de pile dépendent de la propriété [`Function.name`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function/name). Si vous devez prendre en charge des navigateurs ou des dispositifs plus anciens qui ne proposent pas ça nativement (par exemple IE 11), vous pouvez envisager d'inclure le polyfill [`function.name-polyfill`](https://github.com/JamesMGreene/Function.name) dans votre application. Autrement, vous pouvez également définir explicitement la propriété [`displayName`](/docs/react-component.html#displayname) sur tous vos composants.


## Et pourquoi pas try / catch ? {#how-about-trycatch}

Les `try` / `catch` sont super, mais ne marchent qu'avec du code impératif :

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

Mais les composants React sont déclaratifs et spécifient *ce qui* doit être rendu :

```js
<Button />
```

Les périmètres d'erreurs respectent la nature déclarative de React, et se comportent sans surprises. Par exemple, même si une erreur survient dans une méthode `componentDidUpdate` suite à un `setState` quelque part au fin fond de l'arbre des composants, elle se propagera correctement jusqu’au périmètre d'erreur le plus proche.

## Et les gestionnaires d'événements ? {#how-about-event-handlers}

Les périmètres d'erreurs n'interceptent **pas** les erreurs qui surviennent au sein des gestionnaires d'événements.

React n'a pas besoin de périmètres d'erreurs pour gérer les erreurs dans les gestionnaires d'événements. Contrairement aux méthodes de rendu ou de cycle de vie, les gestionnaires d'événements ne sont pas appelés pendant le rendu. Du coup même si ces gestionnaires lèvent une erreur, React saura tout de même quoi afficher à l'écran.

Si vous avez besoin d'intercepter une erreur au sein d'un gestionnaire d'événements, il suffit d'utiliser un classique `try` / `catch` JavaScript :

```js{9-13,17-20}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // Faites ici quelque chose qui va lever une erreur
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Une erreur a été interceptée.</h1>
    }
    return <div onClick={this.handleClick}>Cliquez ici</div>
  }
}
```

Remarquez que l'exemple ci-dessus illustre un comportement JavaScript classique et n'utilise aucun périmètre d'erreur.

## Changements de nommage par rapport à React 15 {#naming-changes-from-react-15}

React 15 disposait d'une prise en charge très limitée des périmètres d'erreurs sous un nom de méthode différent : `unstable_handleError`. Cette méthode ne fonctionne plus, et vous devrez la remplacer par `componentDidCatch` dans votre code à partir de la première version bêta de React 16.

Pour ce changement, nous fournissons un [codemod](https://github.com/reactjs/react-codemod#error-boundaries) qui vous permet de migrer automatiquement votre code.
