---
title: "La gestion des erreurs dans React 16"
author: [gaearon]
---

Alors que la version 16 de React se rapproche, nous aimerions annoncer quelques modifications dans la façon dont React traite les erreurs JavaScript au sein des composants. Ces modifications figurent dans les versions beta de React 16 et feront partie de React 16.

**D'ailleurs, [nous venons de publier la première version beta de React 16 pour que vous puissiez l'essayer !](https://github.com/facebook/react/issues/10294)**

## Comportement jusqu’à React 15 inclus {#behavior-in-react-15-and-earlier}

Auparavant, les erreurs JavaScript au sein des composants avaient l'habitude de corrompre l'état interne de React, et de causer des [erreurs](https://github.com/facebook/react/issues/4026) [assez](https://github.com/facebook/react/issues/6895) [incompréhensibles](https://github.com/facebook/react/issues/8579) lors des rendus suivants. Ces erreurs étaient toujours causées par une erreur antérieure dans le code applicatif et comme React ne proposait alors aucun moyen de les gérer correctement dans les composants, il n'avait pas la possibilité de se rétablir.

## L'arrivée des périmètres d'erreurs {#introducing-error-boundaries}

Une erreur JavaScript au sein d’une partie de l'interface utilisateur (UI) ne devrait pas casser l'ensemble de l'application. Pour résoudre ce problème, React 16 a introduit un nouveau concept appelé « Périmètres d’erreurs » *(Error Boundaries, NdT)*.

Les périmètres d'erreurs sont des composants React qui **interceptent les erreurs JavaScript n'importe où au sein de leur arbre de composants enfants, enregistrent ces erreurs, et affichent une UI de repli** à la place de l'arbre de composants qui a planté. Les périmètres d'erreurs interceptent les erreurs survenant au rendu, dans les méthodes de cycle de vie, ainsi que dans les constructeurs de tous les éléments de leur arborescence.

Une classe de composant devient un périmètre d'erreur si elle définit une nouvelle méthode de cycle de vie appelée `componentDidCatch(error, info)` :

```js{7-12,15-18}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Affiche une UI de repli
    this.setState({ hasError: true });
    // Vous pouvez aussi enregistrer l'erreur au sein d'un service de rapport.
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // Vous pouvez afficher n'importe quelle UI de repli.
      return <h1>Quelque chose s'est mal passé.</h1>;
    }
    return this.props.children;
  }
}
```

Vous pouvez alors l'utiliser comme un composant classique :

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

La méthode `componentDidCatch()` fonctionne comme un bloc JavaScript `catch {}`, mais pour les composants. Seuls les composants à base de classe peuvent être des périmètres d'erreurs. En pratique, vous voudrez généralement définir un seul composant de périmètre d'erreur puis l'utiliser partout dans votre application.

Notez bien que **les périmètres d'erreurs ne détectent que les erreurs présentes en dessous d'eux dans l'arbre des composants**. Un périmètre d'erreur ne peut intercepter une erreur survenant dans son propre code. Si un périmètre d'erreur plante en tentant d'afficher son message d'erreur, l’erreur se propagera alors au périmètre d'erreur le plus proche au-dessus de lui dans l'arbre. Là aussi, c'est similaire à la façon dont le bloc `catch {}` fonctionne en JavaScript.

## Démonstration interactive {#live-demo}

Jetez un coup d'œil sur [cet exemple de déclaration et d'utilisation d'un périmètre d'erreur](https://codepen.io/gaearon/pen/wqvxGa?editors=0010) avec [React 16](https://github.com/facebook/react/issues/10294).

## Où placer les périmètres d'erreurs ? {#where-to-place-error-boundaries}

La granularité des périmètres d'erreurs est à votre discrétion. Vous pourriez enrober les composants racines de routage pour afficher à l'utilisateur un message du type « Quelque chose s'est mal passé », à l'image de ce qui est souvent fait par les frameworks côté serveur. Vous pourriez aussi enrober des éléments d'interface précis avec un périmètre d'erreur afin de les empêcher de planter le reste de l'application.

## Nouveau comportement pour les erreurs non-rattrapées {#new-behavior-for-uncaught-errors}

Ce changement a un impact important. **À compter de React 16, les erreurs qui ne sont pas interceptées par un périmètre d'erreur entraîneront le démontage de l'intégralité de l'arbre des composants**.

Cette décision a été débattue, mais l'expérience nous a montré qu'il est bien pire de laisser en place une interface corrompue que de la supprimer complètement. Par exemple, dans un produit tel que Messenger, laisser visible une interface dégradée peut amener l'utilisateur à envoyer un message à la mauvaise personne. De la même façon, pour une application de paiement, afficher un mauvais montant est bien pire que de ne rien afficher du tout.

Cette modification signifie que lorsque vous migrez vers React 16, vous découvrirez probablement des plantages dans votre application qui étaient jusque-là passés inaperçus. L'ajout de périmètres d'erreurs permet d'offrir une meilleure expérience utilisateur en cas de problème.

Par exemple, Facebook Messanger enrobe le contenu de la barre latérale, du panneau d'information, du journal de conversation, ainsi que de la saisie de message dans des périmètres d'erreurs distincts. Si l'un des composants de ces zones d'interface plante, les autres continueront de fonctionner normalement.

Nous vous encourageons également à utiliser des services de rapport d'erreurs JavaScript (ou à construire le vôtre) afin de mieux connaître les exceptions non gérées dès qu'elles apparaissent en production, et donc de pouvoir les corriger.

## Traces de piles des composants {#component-stack-traces}

En mode développement, React 16 affiche dans la console toutes les erreurs qui apparaissent durant le rendu, même si l'application les cache accidentellement. En plus du message d'erreur et de la trace de pile *(stack trace, NdT)* JavaScript, il fournit également la trace de pile du composant. Vous pouvez désormais voir exactement où l'erreur est apparue dans l'arbre des composants :

<img src="../images/docs/error-boundaries-stack-trace.png" alt="Trace de pile du composant dans un message d'erreur" style="width: 100%;">

Vous pouvez également voir les noms des fichiers et les numéros de lignes dans la trace de pile du composant. C'est le fonctionnement par défaut pour les projets créés avec [Create React App](https://github.com/facebookincubator/create-react-app) :

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" alt="Traces de pile du composants avec les numéros de ligne dans un message d'erreur" style="width: 100%;">

Si vous n'utilisez pas Create React App, vous pouvez ajouter [cette extension](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source) manuellement dans votre configuration Babel. Remarquez que c'est conçu pour le développement et **ne doit pas être activé en production**.

## Pourquoi ne pas utiliser `try` / `catch`? {#why-not-use-try--catch}

Les `try` / `catch` sont super, mais ne marchent qu'avec du code impératif :

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

Mais les composants React sont déclaratifs et spécifient *ce qui* doit être rendu :

```js
<Button />
```

Les périmètres d'erreurs respectent la nature déclarative de React, et se comportent sans surprises. Par exemple, même si une erreur survient dans une méthode `componentDidUpdate` suite à un `setState` quelque part au fin fond de l'arbre des composants, elle se propagera correctement jusqu’au périmètre d'erreur le plus proche.

## Changements de nommage par rapport à React 15 {#naming-changes-from-react-15}

React 15 disposait d'une prise en charge très limitée des périmètres d'erreurs sous un nom de méthode différent : `unstable_handleError`. Cette méthode ne fonctionne plus, et vous devrez la remplacer par `componentDidCatch` dans votre code à partir de la première version beta de React 16.

Pour ce changement, nous fournissons un [codemod](https://github.com/reactjs/react-codemod#error-boundaries) qui vous permet de migrer automatiquement votre code.
