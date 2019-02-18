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

Quand on écrit des tests unitaires pour React, le rendu superficiel peut être utile. Le rendu superficiel vous permet de réaliser le rendu d'un composant « à un seul niveau de profondeur » afin de pouvoir vérifier la qualité de ce que renvoie la fonction de rendu, sans se préoccuper des composants enfants, qui ne sont ni instanciés ni rendu. Cela ne nécessite donc pas de DOM.

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

Vous pouvez alors faire les vérifications suivantes :

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
> Nous vous recommandons de voir l'API du rendu superficiel de Enzyme [Shallow Rendering API](http://airbnb.io/enzyme/docs/api/shallow.html). Il propose une meilleure API de haut niveau pour les même fonctionnalités.

## Réference {#reference}

### `shallowRenderer.render()` {#shallowrendererrender}

Vous pouvez voir le shallowRenderer comme « l'endroit » où se fait le rendu du composant que vous testez et d'où vous pouvez extraire la sortie d'un composant.

`shallowRenderer.render()` est comparable à [`ReactDOM.render()`](/docs/react-dom.html#render) sauf qu'il n'a pas besoin du DOM et effectue le rendu à un seul niveau de profondeur. Cela signifie que vous pouvez tester des composants séparément de l'implémentation de leurs enfants.

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

Après avoir appelé `shallowRenderer.render()`, vous pouvez utiliser `shallowRenderer.getRenderOutput()` pour récupérer la sortie du superficiel.

Vous pouvez alors vérifier des faits sur cette sortie.
