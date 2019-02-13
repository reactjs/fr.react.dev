---
id: shallow-renderer
title: Rendu superficiel
permalink: docs/shallow-renderer.html
layout: docs
category: Reference
---

**Importation**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // ES5 avec npm
```

## Vue d'ensemble {#overview}

Quand on ecrit des tests unitaires pour React, le rendu superficiel peut être utile. Le rendu superficiel vous permet de faire le rendu d'un composant "à un seul niveau de profondeur" afin vérifier des faits sur le retour de la fonction de rendu, sans se préoccuper des composants enfants, qui ne sont ni instanciés ni rendu. Cela ne nécessite donc pas de DOM.

Si vous avez par exemple le composant suivant:

```javascript
function MyComponent() {
  return (
    <div>
      <span className="heading">Titre</span>
      <Subcomponent foo="bar" />
    </div>
  );
}
```

Vous pouvez alors vérifier les faits comme suit:

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// dans votre test:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Title</span>,
  <Subcomponent foo="bar" />
]);
```

Le rendu superficiel connait cependant quelques limites, notamment l'absence de support des refs.

> Note:
>
> Nous vous recommendons de voir l'API du rendu superficiel de Enzyme's [Shallow Rendering API](http://airbnb.io/enzyme/docs/api/shallow.html). Il propose une meilleure API de haut niveau pour les même fonctionnalités.

## Réference {#reference}

### `shallowRenderer.render()` {#shallowrendererrender}

You can think of the shallowRenderer as a "place" to render the component you're testing, and from which you can extract the component's output.

`shallowRenderer.render()` is similar to [`ReactDOM.render()`](/docs/react-dom.html#render) but it doesn't require DOM and only renders a single level deep. This means you can test components isolated from how their children are implemented.

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

After `shallowRenderer.render()` has been called, you can use `shallowRenderer.getRenderOutput()` to get the shallowly rendered output.

You can then begin to assert facts about the output.
