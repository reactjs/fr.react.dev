---
id: faq-styling
title: Style et CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### Comment ajouter des classes CSS aux composants ? {#how-do-i-add-css-classes-to-components}

En passant une chaîne à la propriété `className` :

```jsx
render() {
  return <span className="menu navigation-menu">Menu</span>
}
```

Il est habituel pour les classes CSS de dépendre des propriétés ou de l'état du composant :

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>Menu</span>
}
```

>Conseil
>
>S'il vous arrive régulièrement d'écrire du code comme celui-ci, le paquet [classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) peut le simplifier.

### Puis-je utiliser du style en ligne ? {#can-i-use-inline-styles}

Oui, consultez la documentation sur le style [ici](/docs/dom-elements.html#style).

### Est ce que le style en ligne est une mauvaise pratique ? {#are-inline-styles-bad}

Les classes CSS ont généralement une meilleure performance que le style en ligne.

### Qu'est-ce que CSS-in-JS ? {#what-is-css-in-js}

"CSS-in-JS" fait référence à un modèle où le CSS est créée en utilisant du JavaScript au lieu d'être défini dans des fichiers externes. Lisez la comparaison entre les bibliothèques CSS-in-JS [ici](https://github.com/MicheleBertoli/css-in-js).

_Notez que cette fonctionnalité ne fait pas parti de React, mais est fournie par des bibliothèques tierces._ React n'a pas d'opinion sur la manière dont les styles doivent être définis ; si vous avez un doute, une bonne manière pour commencer est de définir vos styles dans des fichiers `*.css` séparés comme d'habitude et d'y faire référence en utilisant [`className`](/docs/dom-elements.html#classname).

### Puis-je faire des animations avec React ? {#can-i-do-animations-in-react}

React peut être utilisé générer des animations. Voir [React Transition Group](https://reactcommunity.org/react-transition-group/) et [React Motion](https://github.com/chenglou/react-motion), par exemple.
