---
id: faq-styling
title: Styles et CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### Comment ajouter des classes CSS aux composants ? {#how-do-i-add-css-classes-to-components}

En passant une chaîne à la prop `className` :

```jsx
render() {
  return <span className="menu navigation-menu">Menu</span>
}
```

Les classes CSS dépendent fréquemment des props ou de l'état local du composant :

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>Menu</span>
}
```

>Astuce
>
>S'il vous arrive régulièrement d'écrire du code comme celui-ci, le module [classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) peut vous aider à simplifier votre code.

### Puis-je utiliser des styles en ligne ? {#can-i-use-inline-styles}

Oui, consultez la documentation sur le style [ici](/docs/dom-elements.html#style).

### Est-ce que les styles en ligne sont une mauvaise pratique ? {#are-inline-styles-bad}

Les classes CSS sont généralement plus performantes que les styles en ligne.

### Qu'est-ce que CSS-in-JS ? {#what-is-css-in-js}

"CSS-in-JS" fait référence à un modèle où les styles CSS sont créés en utilisant du JavaScript au lieu d'être définis dans des fichiers externes.

_Remarquez bien que cette fonctionnalité ne fait pas partie de React : elle est fournie par des bibliothèques tierces._ React n'a pas d'opinion sur la manière dont les styles doivent être définis ; si vous avez un doute, une bonne manière de commencer consiste à définir vos styles dans des fichiers `*.css` séparés comme d'habitude et à y faire référence en utilisant [`className`](/docs/dom-elements.html#classname).

### Puis-je faire des animations avec React ? {#can-i-do-animations-in-react}

React peut être utilisé pour générer des animations. Voyez par exemple [React Transition Group](https://reactcommunity.org/react-transition-group/) et [React Spring](https://github.com/react-spring/react-spring).
