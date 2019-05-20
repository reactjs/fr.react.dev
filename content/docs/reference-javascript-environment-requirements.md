---
id: javascript-environment-requirements
title: Pré-requis pour l'environnement JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 16 dépend des types de collections [Map](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Map) et [Set](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Set). Si vous devez supporter des navigateurs et des appareils plus anciens, qui ne supportent pas ces objets natifs (par exemple IE < 11) ou dont l'implémentation n'est pas conforme aux standards (par exemple IE 11), vous pouvez envisager d'inclure un polyfill global dans votre application, comme [core-js](https://github.com/zloirock/core-js) ou [babel-polyfill](https://babeljs.io/docs/usage/polyfill/).

L'utilisation d'un polyfill pour supporter React 16 sur les anciens navigateurs internet, grâce à core-js, peut ressembler à ceci :

```js
import 'core-js/es/map';
import 'core-js/es/set';

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Bonjour, monde !</h1>,
  document.getElementById('root')
);
```

React dépend aussi de `requestAnimationFrame` (y compris pour les environnements de test).   
Vous pouvez utiliser le paquet [raf](https://www.npmjs.com/package/raf) pour émuler `requestAnimationFrame` :

```js
import 'raf/polyfill';
```
