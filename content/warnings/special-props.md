---
title: "Avertissement : special props"
layout: single
permalink: warnings/special-props.html
---

Props spéciales.  La plupart des props d’un élément JSX sont passées au composant, mais il existe deux props spéciales (`ref` et `key`) qui sont réservées à React, et ne sont donc pas transmises au composant.

Par exemple, tenter d’accéder à `this.props.key` depuis un composant (ex. dans sa fonction `render` ou ses [propTypes](/docs/typechecking-with-proptypes.html#proptypes)) donnera `undefined`.  Si vous avez besoin d’accéder à la même valeur au sein du composant enfant, il vous faut la passer dans une prop différente (ex. `<ListItemWrapper key={result.id} id={result.id} />`). Ça peut sembler redondant, mais ça permet de distinguer la logique applicative des aides à la réconciliation.
