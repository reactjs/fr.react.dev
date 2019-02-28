---
id: shallow-renderer
title: Moteur de rendu superficiel
permalink: docs/shallow-renderer.html
layout: docs
category: Reference
---

**Importation**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // ES5 avec npm
```

## Aperçu {#overview}

Quand on écrit des tests unitaires pour React, le rendu superficiel peut être utile. Le rendu superficiel vous permet de réaliser le rendu d'un composant « à un seul niveau de profondeur » afin de pouvoir vérifier ce que renvoie sa fonction re rendu, sans vous préoccuper des composants enfants, qui ne sont pas sollicités. Ça ne nécessite donc pas de DOM.

Par exemple, si vous avez le composant suivant :

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

// dans votre test :
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Titre</span>,
  <Subcomponent foo="bar" />
]);
```

Le rendu superficiel a pour le moment quelques limites, notamment l'absence de prise en charge des refs.

> Note:
>
> Nous vous conseillons par ailleurs de regarder [l'API de rendu superficiel](http://airbnb.io/enzyme/docs/api/shallow.html) (en anglais) d'Enzyme. Elle propose une meilleure API de haut niveau pour ce type de fonctionnalité.

## Référence de l'API {#reference}

### `shallowRenderer.render()` {#shallowrendererrender}

Vous pouvez voir le `shallowRenderer` comme un « endroit » dans lequel faire le rendu du composant que vous testez, et depuis lequel vous pouvez extraire la sortie que ce composant produit.

`shallowRenderer.render()` est similaire à [`ReactDOM.render()`](/docs/react-dom.html#render), à ceci près qu'il n'a pas besoin du DOM et n’effectue le rendu qu’à un seul niveau de profondeur. Ça signifie que vous pouvez tester des composants indépendamment de l'implémentation de leurs enfants.

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

Après avoir appelé `shallowRenderer.render()`, vous pouvez utiliser `shallowRenderer.getRenderOutput()` pour récupérer le rendu superficiel obtenu.

Vous pouvez alors vérifier ce que vous souhaitez sur le résultat attendu.
