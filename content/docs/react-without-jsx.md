---
id: react-without-jsx
title: React sans JSX
permalink: docs/react-without-jsx.html
---

Vous n'êtes pas obligé d'utiliser JSX pour utiliser React. Par exemple, React sans JSX vous dispense de compiler votre code. Cette approche peut donc être intéressante si vous ne voulez pas rajouter la compilation à votre environnement de production.

Chaque élément JSX n'est rien de plus qu'une syntaxe plus concise pour `React.createElement(component, props, ...children)`. Par conséquent, tout ce que vous pouvez faire avec JSX peut aussi être réalisé en Javascript simple.

Par exemple, ce code écrit avec JSX:

```js
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

peut être compilé vers ce code qui n'utilise pas JSX :

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

Si vous voulez voir plus d'exemples de code JSX converti en JavaScript simple, vous pouvez essayer [le compilateur Babel en ligne](babel://jsx-simple-example).

Le composant peut soit être une chaîne de caractères, soit une sous-classe de `React.Component`, soit une fonction simple pour les composants sans état.

Si vous n'avez pas envie de taper `React.createElement` à chaque fois, vous pouvez à la place créer un raccourci :

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Hello World'),
  document.getElementById('root')
);
```
Si vous utilisez un tel raccourci pour `React.createElement`, utiliser React sans JSX devient presque aussi pratique.

De plus, vous pouvez vous référer à des projets tels que [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) ou [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers) qui proposent une syntaxe encore plus concise.
