---
id: glossary
title: Glossaire des termes React
layout: docs
category: Reference
permalink: docs/glossary.html

---

## *Single-page Application* {#single-page-application}

Une *single-page application* (SPA) est une application qui charge une unique page HTML et toutes les ressources nécessaires (telles que du JavaScript et des CSS) requises pour le fonctionnement de l’application.  Aucune interaction sur la page ou les pages ultérieures ne nécessitera un nouvel aller-retour avec le serveur, ce qui signifie que la page n’a pas besoin d’être rafraîchie.

Même si vous pouvez construire une SPA avec React, ce n’est pas obligatoire.  React peut aussi être utilisé pour améliorer de petites parties de sites existants en leur apportant une interactivité supplémentaire.  Le code écrit en React cohabite paisiblement tant avec le balisage produit par le serveur, au moyen de technologies telles que PHP, qu’avec les autres bibliothèques côté client.  En fait, c’est exactement ainsi que React est utilisé chez Facebook.

## ES6, ES2015, ES2016, etc. {#es6-es2015-es2016-etc}

Ces acronymes font référence aux versions les plus récentes du standard *ECMAScript Language Specification*, dont le langage JavaScript est une implémentation. La version ES6 (également connue sous le nom ES2015) apporte de nombreuses nouveautés par rapport aux versions précédentes, telles que : les fonctions fléchées, les classes, les gabarits de chaînes, les déclarations `let` et `const`…  Vous pouvez en apprendre plus sur des versions précises [ici](https://fr.wikipedia.org/wiki/ECMAScript#Versions).

## Compilateurs {#compilers}

Un compilateur JavaScript, souvent appelé *transpileur*, prend du code JavaScript, le transforme et renvoie un code JavaScript de format différent.  Le cas d’usage le plus courant consiste à prendre la syntaxe ES6 et à la transformer en une syntaxe que les navigateurs plus anciens sont capables d’interpréter. [Babel](https://babeljs.io/) est le compilateur le plus utilisé avec React.

## *Bundlers* {#bundlers}

Les *bundlers* prennent du code JavaScript et CSS écrit sous forme de modules distincts (souvent par centaines), et les combine pour produire un petit nombre de fichiers plus optimisés pour les navigateurs.  Parmi les *bundlers* couramment utilisés pour les applications React, on trouve [Webpack](https://webpack.js.org/) et [Browserify](http://browserify.org/).

## Gestionnaires de paquets {#package-managers}

Les gestionnaires de paquets sont des outils qui vous permettent de gérer les dépendances de votre projet. [npm](https://www.npmjs.com/) et [Yarn](https://yarnpkg.com/) sont les deux gestionnaires de paquet couramment utilisés pour les applications React. Les deux travaillent en fait avec le même référentiel de modules, géré par npm.

## CDN {#cdn}

CDN est l’acronyme de *Content Delivery Network* *(réseau de distribution de contenu, NdT)*.   Les CDNs fournissent des contenus statiques mis en cache via un réseau de serveurs répartis dans le monde entier.

## JSX {#jsx}

JSX est une extension syntaxique de JavaScript.  C’est un peu comme un langage de gestion de gabarit utilisant du balisage, mais il tire parti de toute la puissance de JavaScript.  JSX est compilé en appels à `React.createElement()`, qui renvoient des objets JavaScript nus appelés « éléments React ».  Pour découvrir les bases de JSX [consultez cette page de doc](/docs/introducing-jsx.html), et pour l’explorer plus en profondeur vous avez [cette page-ci](/docs/jsx-in-depth.html).

React DOM utilise la casse `camelCase` comme convention de nommage des propriétés, au lieu des noms d’attributs HTML. Par exemple, l’attribut `class` devient `className`, dans la mesure où `class` est un mot réservé en JavaScript :

```js
const name = 'Clémentine';
ReactDOM.render(
  <h1 className="hello">Je m’appelle {name} !</h1>,
  document.getElementById('root')
);
```

## [Elements](/docs/rendering-elements.html) {#elements}

React elements are the building blocks of React applications. One might confuse elements with a more widely known concept of "components". An element describes what you want to see on the screen. React elements are immutable.

```js
const element = <h1>Hello, world</h1>;
```

Typically, elements are not used directly, but get returned from components.

## [Components](/docs/components-and-props.html) {#components}

React components are small, reusable pieces of code that return a React element to be rendered to the page. The simplest version of React component is a plain JavaScript function that returns a React element:

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Components can also be ES6 classes:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Components can be broken down into distinct pieces of functionality and used within other components. Components can return other components, arrays, strings and numbers. A good rule of thumb is that if a part of your UI is used several times (Button, Panel, Avatar), or is complex enough on its own (App, FeedStory, Comment), it is a good candidate to be a reusable component. Component names should also always start with a capital letter (`<Wrapper/>` **not** `<wrapper/>`). See [this documentation](/docs/components-and-props.html#rendering-a-component) for more information on rendering components.

### [`props`](/docs/components-and-props.html) {#props}

`props` are inputs to a React component. They are data passed down from a parent component to a child component.

Remember that `props` are readonly. They should not be modified in any way:

```js
// Wrong!
props.number = 42;
```

If you need to modify some value in response to user input or a network response, use `state` instead.

### `props.children` {#propschildren}

`props.children` is available on every component. It contains the content between the opening and closing tags of a component. For example:

```js
<Welcome>Hello world!</Welcome>
```

The string `Hello world!` is available in `props.children` in the `Welcome` component:

```js
function Welcome(props) {
  return <p>{props.children}</p>;
}
```

For components defined as classes, use `this.props.children`:

```js
class Welcome extends React.Component {
  render() {
    return <p>{this.props.children}</p>;
  }
}
```

### [`state`](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) {#state}

A component needs `state` when some data associated with it changes over time. For example, a `Checkbox` component might need `isChecked` in its state, and a `NewsFeed` component might want to keep track of `fetchedPosts` in its state.

The most important difference between `state` and `props` is that `props` are passed from a parent component, but `state` is managed by the component itself. A component cannot change its `props`, but it can change its `state`. To do so, it must call `this.setState()`. Only components defined as classes can have state.

For each particular piece of changing data, there should be just one component that "owns" it in its state. Don't try to synchronize states of two different components. Instead, [lift it up](/docs/lifting-state-up.html) to their closest shared ancestor, and pass it down as props to both of them.

## [Lifecycle Methods](/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) {#lifecycle-methods}

Lifecycle methods are custom functionality that gets executed during the different phases of a component. There are methods available when the component gets created and inserted into the DOM ([mounting](/docs/react-component.html#mounting)), when the component updates, and when the component gets unmounted or removed from the DOM.

 ## [Controlled](/docs/forms.html#controlled-components) vs. [Uncontrolled Components](/docs/uncontrolled-components.html)

React has two different approaches to dealing with form inputs.

An input form element whose value is controlled by React is called a *controlled component*. When a user enters data into a controlled component a change event handler is triggered and your code decides whether the input is valid (by re-rendering with the updated value). If you do not re-render then the form element will remain unchanged.

An *uncontrolled component* works like form elements do outside of React. When a user inputs data into a form field (an input box, dropdown, etc) the updated information is reflected without React needing to do anything. However, this also means that you can't force the field to have a certain value.

In most cases you should use controlled components.

## [Keys](/docs/lists-and-keys.html) {#keys}

A "key" is a special string attribute you need to include when creating arrays of elements. Keys help React identify which items have changed, are added, or are removed. Keys should be given to the elements inside an array to give the elements a stable identity.

Keys only need to be unique among sibling elements in the same array. They don't need to be unique across the whole application or even a single component.

Don't pass something like `Math.random()` to keys. It is important that keys have a "stable identity" across re-renders so that React can determine when items are added, removed, or re-ordered. Ideally, keys should correspond to unique and stable identifiers coming from your data, such as `post.id`.

## [Refs](/docs/refs-and-the-dom.html) {#refs}

React supports a special attribute that you can attach to any component. The `ref` attribute can be an object created by [`React.createRef()` function](/docs/react-api.html#reactcreateref) or a callback function, or a string (in legacy API). When the `ref` attribute is a callback function, the function receives the underlying DOM element or class instance (depending on the type of element) as its argument. This allows you to have direct access to the DOM element or component instance.

Use refs sparingly. If you find yourself often using refs to "make things happen" in your app, consider getting more familiar with [top-down data flow](/docs/lifting-state-up.html).

## [Events](/docs/handling-events.html) {#events}

Handling events with React elements has some syntactic differences:

* React event handlers are named using camelCase, rather than lowercase.
* With JSX you pass a function as the event handler, rather than a string.

## [Reconciliation](/docs/reconciliation.html) {#reconciliation}

When a component's props or state change, React decides whether an actual DOM update is necessary by comparing the newly returned element with the previously rendered one. When they are not equal, React will update the DOM. This process is called "reconciliation".
