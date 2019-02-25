---
id: error-boundaries
title: Limiteurs d'erreurs
permalink: docs/error-boundaries.html
---

Auparavant, les erreurs JavaScript au sein des composants avaient l'habitude de corrompre l'état interne de React, et de causer des [erreurs](https://github.com/facebook/react/issues/4026) [assez](https://github.com/facebook/react/issues/6895) [incompréhensibles](https://github.com/facebook/react/issues/8579) lors des rendus suivants. Ces erreurs étaient toujours causées par une erreur antérieure dans le code applicatif, et React ne proposait alors aucun moyen de les gérer correctement dans les composants, et n'était pas capable de se rétablir.

## L'arrivée des limiteurs d'erreurs {#introducing-error-boundaries}

Une erreur JavaScript au sein de la partie UI ne devrait pas casser l'ensemble de l'application. Pour résoudre ce problème pour les utilisateurs de React, React 16 a introduit un nouveau concept appelé « *Error Boundary* » (nous traduirons ce terme par « Limiteur d'erreur » par la suite — NdT).

Les limiteurs d'erreurs sont des composants React qui **interceptent les erreurs JavaScript n'importe où au sein de leur arbre de composants enfants, trace ces erreurs, et affiche une interface de secours** à la place du composants en erreur. Les limiteurs d'erreurs interceptent les erreurs durant le rendu, dans les méthodes du cycle de vie, ainsi que dans les constructeurs dans toute leur arborescence.

> Remarque :
>
> Les limiteurs d'erreurs n'interceptent **pas** les erreurs pour :
>
> * Les gestionnaire d'événements ([en savoir plus](#how-about-event-handlers)).
> * Le code asynchrone (par exemple les fonctions de rappel `setTimeout` ou `requestAnimationFrame`).
> * Le code généré côté serveur.
> * Les erreurs lancées dans le composant du limiteur d'erreur lui-même (plutôt qu'au sein de ses enfants).

Une classe de composants devient un limiteur d'erreur s'il définit l'une (ou les deux) des méthodes du cycle de vie [`static getDerivedStateFromError()`](/docs/react-component.html#static-getderivedstatefromerror) ou [`componentDidCatch()`](/docs/react-component.html#componentdidcatch). Utilisez `static getDerivedStateFromError()` pour faire le rendu de l'UI de secours lorsqu'une erreur a été lancée. Utilisez `componentDidCatch()` pour tracer l'information relative à l'erreur.

```js{7-10,12-15,18-21}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Mettez à jour l'état, de façon à montrer l'UI de secours au prochain rendu.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Vous pouvez aussi tracer l'erreur au sein d'un service de rapport.
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // Vous pouvez faire le rendu de n'importe quelle UI de secours.
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

Les limiteurs d'erreurs fonctionnent comme un bloc JavaScript `catch {}`, mais pour des composants. Seules des classes de composants peuvent être des limiteurs d'erreurs. En pratique, vous voudrez généralement définir un seul composant limiteur d'erreur et l'utiliser dans votre application.

Remarquez que **les limiteurs d'erreurs ne détectent que les erreurs présentes en dessous d'eux dans l'arbre des composants**. Un limiteurs d'erreur ne peut intercepter une erreur sur lui-même. Si un limiteur d'erreur échoue à faire le rendu du message d'erreur, l'erreur se propagera alors au limiteur d'erreur le plus proche. Cela est également similaire à la façon dont le bloc `catch {}` fonctionne en JavaScript.

## Démonstration {#live-demo}

Jetez un œil sur [cet exemple de déclaration et d'usage d'un limiteur d'erreur](https://codepen.io/gaearon/pen/wqvxGa?editors=0010) avec [React 16](/blog/2017/09/26/react-v16.0.html).


## Où placer les Error Boundaries ? {#where-to-place-error-boundaries}

La granularité des limiteurs d'erreurs est à votre discrétion. Vous pouvez envelopper les composants de routage haut-niveau pour afficher un message du type « Quelque chose s'est mal passé » à l'utilisateur, à l'image de ce qui est souvent fait par les frameworks côté serveur. Vous pouvez aussi envelopper chaque widget avec un limiteur d'erreur afin de les empêcher d'impacter le reste l'application.


## Nouveau comportement pour les erreurs non attrapées {#new-behavior-for-uncaught-errors}

Ce changement a un impact important. **À compter de React 16, les erreurs qui ne sont pas interceptées par un limiteur d'erreur entraîneront le démontage de l'intégralité de l'arbre des composants**.

Cette décision a été débattue, mais selon notre expérience, laisser une interface corrompue en place est bien pire que de la supprimer complètement. Par exemple, dans un produit tel que Messenger, laisser une interface dégradée visible peut amener l'utilisateur à envoyer un message à la mauvaise personne. De la même façon, pour une application de paiement, afficher un mauvais montant est bien pire que de ne rien afficher du tout.

Cette modification signifie que lorsque vous migrez vers React 16, vous découvrirez probablement des plantages dans votre application qui étaient alors passés inaperçus. L'ajout de limiteurs d'erreurs permet d'offrir une meilleure expérience utilisateurs en cas de problème.

Par exemple, Facebook Messanger enveloppe le contenu de la barre latérale, du panneau d'information, du journal de conversation, ainsi que de la saisie du message dans des limiteurs d'erreurs dinstincts. Si l'un des composants de ces zones d'interface fait défaut, les autres continueront de fonctionner normalement.

Nous vous encourageons également à utiliser des services de rapport d'erreurs JavaScript (ou à construire le vôtre) afin de mieux connaître les exceptions non gérées dès qu'elles apparaissent en production, et ainsi de les corriger.


## Trace d'appels des composants {#component-stack-traces}

React 16 affiche dans la console toutes les erreurs qui apparaissent durant le rendu en cours de développement, même si l'application les cachait accidentellement. En plus du message d'erreur et de la trace d'appels (*stacktrace*) JavaScript, il fournit également la trace d'appels du composant. Maintenant, vous pouvez voir exactement où l'erreur est apparue dans l'arbre des composants :

<img src="../images/docs/error-boundaries-stack-trace.png" style="max-width:100%" alt="Une erreur interceptée par un limiteur d'erreur">

Vous pouvez également voir les noms des fichiers et les lignes dans la trace d'appels du composant. C'est le fonctionnement par défaut dans les projets créés avec [Create React App](https://github.com/facebookincubator/create-react-app) :

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" style="max-width:100%" alt="Une erreur interceptée par un limiteur d'erreur avec les numéros de lignes">

Si vous n'utilisez pas Create React App, vous pouvez ajouter [cette extension](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source) manuellement dans votre configuration Babel. Remarquez que cela ne doit être utilisé que durant le développement et **ne doit pas être activé en production**.

> Remarque :
>
> Les noms des composants affichés dans la trace d'appels dépendent de la propriété [`Function.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name). Si vous devez prendre en charge des navigateurs ou des dispositifs plus anciens qui ne proposent pas cela naturellement (par exemple IE 11), vous pourrez envisager d'inclure le polyfill [`Function.name`](https://github.com/JamesMGreene/Function.name) dans votre application. Vous pourrez également définir explicitement la propriété [`displayName`](/docs/react-component.html#displayname) sur tous vos composants.


## Et pourquoi pas try / catch ? {#how-about-trycatch}

Les instructions `try` / `catch` sont vraiment intéressantes, mais ne marchent qu'avec du code impératif :

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

Cependant, les composants React sont déclaratifs et spécifient *ce qui* doit être rendu :

```js
<Button />
```

Les limiteurs d'erreurs conservent la nature déclarative de React, et se comportent comme prévu. Par exemple, même si une erreur survient lors de la méthode `componentDidUpdate` causée par un `setState` quelque part dans l'arbre des composants, alors elle se propagera correctement à son limiteur d'erreur le plus proche.

## Et à propos des gestionnaires d'événement ? {#how-about-event-handlers}

Les limiteurs d'erreurs n'interceptent **pas** les erreurs qui surviennent au sein des gestionnaires d'événements.

React n'a pas besoin de limiteurs d'erreurs pour récupérer des erreurs dans les gestionnaires d'événements. Contrairement aux méthodes de rendu ou du cycle de vie, les gestionnaires d'événements ne se produisent pas pendant le rendu. Ainsi, si cela arrive, React saura tout de même quoi afficher à l'écran.

Si vous avez besoin d'intercepter une erreur au sein d'un gestionnaire d'événement, il suffit d'utiliser une instruction JavaScript classique `try` / `catch` :

```js{9-13,17-20}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // Faites ici quelque chose qui va émettre une erreur.
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Une erreur a été interceptée.</h1>
    }
    return <div onClick={this.handleClick}>Cliquez-moi</div>
  }
}
```

Remarquez que l'exemple ci-dessus illustre un comportement JavaScript classique et n'utilise aucun limiteur d'erreur.

## Changement de nommage depuis React 15 {#naming-changes-from-react-15}

React 15 disposait d'une prise en charge très limitée de limiteurs d'erreurs sous un nom de méthode différent : `unstable_handleError`. Cette méthode ne fonctionne plus, et vous devrez la remplacer par `componentDidCatch` dans votre code à partir de la première version bêta 16 de React.

Pour ce changement, nous fournissons un [codemod](https://github.com/reactjs/react-codemod#error-boundaries) pour migrer automatiquement votre code.
