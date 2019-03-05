---
title: "Avertissement : React element factories and JSX"
layout: single
permalink: warnings/legacy-factories.html
---

Fabriques d’éléments React et JSX

Vous êtes probablement sur cette page parce que votre code appelle votre composant comme une fonction classique.  C’est désormais déprécié :

```javascript
var MyComponent = require('MyComponent');

function render() {
  return MyComponent({ foo: 'bar' });  // ATTENTION
}
```

## JSX {#jsx}

Les composants React ne peuvent plus être appelés ainsi directement.  [Utilisez plutôt JSX](/docs/jsx-in-depth.html).

```javascript
var React = require('react');
var MyComponent = require('MyComponent');

function render() {
  return <MyComponent foo="bar" />;
}
```

## Sans JSX {#without-jsx}

Si vous ne voulez pas ou ne pouvez pas utiliser JSX, vous aurez besoin d’enrober votre composant dans une _factory_ avant de l’appeler :

```javascript
var React = require('react');
var MyComponent = React.createFactory(require('MyComponent'));

function render() {
  return MyComponent({ foo: 'bar' });
}
```

Ça permet une migration facile si vous avez beaucoup d’appels de fonctions de ce type.

## Composants dynamiques sans JSX {#dynamic-components-without-jsx}

Si vous obtenez dynamiquement la classe d’un composant, il est peut-être superflu de créer une _factory_ que vous invoqueriez immédiatement.  Vous pouvez plutôt simplement créer votre élément à la volée :

```javascript
var React = require('react');

function render(MyComponent) {
  return React.createElement(MyComponent, { foo: 'bar' });
}
```

## Aller plus loin {#in-depth}

[Lisez le détail des **raisons** qui ont motivé ce changement](https://gist.github.com/sebmarkbage/d7bce729f38730399d28).
