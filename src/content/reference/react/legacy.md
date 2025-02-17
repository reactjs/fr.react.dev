---
title: "API React historique"
---

<Intro>

Ces API sont exposées par le module `react`, mais sont déconseillées pour l'écriture de nouveau code.  Consultez les pages API individuelles liées ci-dessous pour découvrir les alternatives que nous leur proposons.

</Intro>

---

## API historiques {/*legacy-apis*/}

<<<<<<< HEAD
* [`Children`](/reference/react/Children) vous permet de manipuler et transformer les contenus JSX reçus *via* la prop `children`. [Découvrez les alternatives](/reference/react/Children#alternatives).
* [`cloneElement`](/reference/react/cloneElement) vous permet de créer un élément React en vous basant sur un élément existant. [Découvrez les alternatives](/reference/react/cloneElement#alternatives).
* [`Component`](/reference/react/Component) vous permet de définir un composant React sous forme d'une classe JavaScript ES2015+. [Découvrez les alternatives](/reference/react/Component#alternatives).
* [`createElement`](/reference/react/createElement) vous permet de créer un élément React. Vous utiliserez plutôt JSX pour ça.
* [`createRef`](/reference/react/createRef) crée un objet *ref* pouvant contenir une valeur quelconque. [Découvrez les alternatives](/reference/react/createRef#alternatives).
* [`isValidElement`](/reference/react/isValidElement) vérifie qu'une valeur est un élément React. Généralement utilisé avec [`cloneElement`](/reference/react/cloneElement).
* [`PureComponent`](/reference/react/PureComponent) est similaire à [`Component`](/reference/react/Component), mais évite un nouveau rendu lorsque les props sont identiques. [Découvrez les alternatives](/reference/react/PureComponent#alternatives).
=======
* [`Children`](/reference/react/Children) lets you manipulate and transform the JSX received as the `children` prop. [See alternatives.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) lets you create a React element using another element as a starting point. [See alternatives.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) lets you define a React component as a JavaScript class. [See alternatives.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) lets you create a React element. Typically, you'll use JSX instead.
* [`createRef`](/reference/react/createRef) creates a ref object which can contain arbitrary value. [See alternatives.](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef) lets your component expose a DOM node to parent component with a [ref.](/learn/manipulating-the-dom-with-refs)
* [`isValidElement`](/reference/react/isValidElement) checks whether a value is a React element. Typically used with [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) is similar to [`Component`,](/reference/react/Component) but it skip re-renders with same props. [See alternatives.](/reference/react/PureComponent#alternatives)
>>>>>>> 49284218b1f5c94f930f8a9b305040dbe7d3dd48

---

<<<<<<< HEAD
## API dépréciées {/*deprecated-apis*/}
=======
## Removed APIs {/*removed-apis*/}
>>>>>>> 49284218b1f5c94f930f8a9b305040dbe7d3dd48

These APIs were removed in React 19:

<<<<<<< HEAD
Ces API seront retirées d'une future version majeure de React.

</Deprecated>

* [`createFactory`](/reference/react/createFactory) vous permet de créer une fonction qui produit des éléments React d'un type prédéfini.
=======
* [`createFactory`](https://18.react.dev/reference/react/createFactory): use JSX instead.
* Class Components: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): use [`Context.Provider`](/reference/react/createContext#provider) instead.
* Class Components: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): use a type system like [TypeScript](https://www.typescriptlang.org/) instead.
* Class Components: [`this.refs`](https://18.react.dev//reference/react/Component#refs): use [`createRef`](/reference/react/createRef) instead.
>>>>>>> 49284218b1f5c94f930f8a9b305040dbe7d3dd48
