---
id: react-without-jsx
title: React sans JSX
permalink: docs/react-without-jsx.html
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

<<<<<<< HEAD
ReactDOM.render(
  <Hello toWhat="monde" />,
  document.getElementById('root')
);
=======
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Hello toWhat="World" />);
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c
```

Il peut être compilé vers ce code qui n'utilise pas JSX :

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Bonjour ${this.props.toWhat}`);
  }
}

<<<<<<< HEAD
ReactDOM.render(
  React.createElement(Hello, {toWhat: 'monde'}, null),
  document.getElementById('root')
);
=======
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Hello, {toWhat: 'World'}, null));
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c
```

Si vous voulez voir plus d'exemples de conversion de code JSX en JavaScript brut, vous pouvez essayer [le compilateur Babel en ligne](babel://jsx-simple-example).

Le composant peut être soit une chaîne de caractères, soit une sous-classe de `React.Component`, soit une fonction simple.

Si vous n'avez pas envie de taper `React.createElement` à chaque fois, vous pouvez à la place créer un raccourci :

```js
const e = React.createElement;

<<<<<<< HEAD
ReactDOM.render(
  e('div', null, 'Bonjour, monde'),
  document.getElementById('root')
);
=======
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e('div', null, 'Hello World'));
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c
```
Si vous utilisez un tel raccourci pour `React.createElement`, utiliser React sans JSX devient presque aussi pratique.

Dans le même esprit, vous pouvez aller regarder des projets tels que [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) ou [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers), qui proposent une syntaxe encore plus concise.
