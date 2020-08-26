---
id: react-without-jsx
title: React sans JSX
permalink: docs/react-without-jsx.html
prev: react-without-es6.html
next: reconciliation.html
---

Vous n'êtes pas obligé·e d'employer JSX pour utiliser React. React sans JSX vous dispense de configurer votre environnement de travail pour gérer la compilation de votre code.

Chaque élément JSX n'est rien de plus que du sucre syntaxique pour `React.createElement(component, props, ...children)`. Par conséquent, tout ce que vous pouvez faire avec JSX peut aussi être réalisé en Javascript brut.

Prenons par exemple ce code écrit avec JSX :

```js
class Hello extends React.Component {
  render() {
    return <div>Bonjour {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="monde" />,
  document.getElementById('root')
);
```

Il peut être compilé vers ce code qui n'utilise pas JSX :

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Bonjour ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'monde'}, null),
  document.getElementById('root')
);
```

Si vous voulez voir plus d'exemples de conversion de code JSX en JavaScript brut, vous pouvez essayer [le compilateur Babel en ligne](babel://jsx-simple-example).

Le composant peut être soit une chaîne de caractères, soit une sous-classe de `React.Component`, soit une fonction simple.

Si vous n'avez pas envie de taper `React.createElement` à chaque fois, vous pouvez à la place créer un raccourci :

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Bonjour, monde'),
  document.getElementById('root')
);
```
Si vous utilisez un tel raccourci pour `React.createElement`, utiliser React sans JSX devient presque aussi pratique.

Dans le même esprit, vous pouvez aller regarder des projets tels que [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) ou [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers), qui proposent une syntaxe encore plus concise.
