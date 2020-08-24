---
id: web-components
title: Web Components
permalink: docs/web-components.html
prev: error-boundaries.html
next: higher-order-components.html
redirect_from:
  - "docs/webcomponents.html"
---

React et [les Web Components](https://developer.mozilla.org/fr/docs/Web/Web_Components) sont conçus pour résoudre des problèmes différents. Les Web Components offrent une encapsulation forte pour des composants réutilisables, tandis que React fournit une bibliothèque déclarative qui permet au DOM de rester synchronisé avec vos données. Les deux objectifs sont complémentaires. En tant que développeur·se, vous êtes libre d'utiliser React dans vos Web Components, ou bien d'utiliser des Web Components dans React, ou encore les deux à la fois.

La plupart des utilisateurs de React n'utilisent pas les Web Components, mais vous voudrez peut-être le faire, en particulier si vous utilisez des composants tiers d'interface utilisateur (UI) écrits à l'aide de Web Components.

## Utiliser des Web Components dans React {#using-web-components-in-react}

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Bonjour <x-search>{this.props.name}</x-search> !</div>;
  }
}
```

>Remarque
>
> Les Web Components exposent souvent une API impérative. Par exemple, un Web Component `video` peut exposer les fonctions `play()` et `pause()`. Pour accéder à l'API impérative d'un Web Component, vous devez utiliser une référence pour interagir directement avec le nœud du DOM. Si vous utilisez des Web Components tiers, la meilleure solution consiste à écrire un composant React qui se comporte comme un enrobage pour votre Web Component.
>
> Les événements émis par un Web Component peuvent ne pas se propager correctement à travers un arbre de composants de React.
> Vous devrez attacher manuellement les gestionnaires d'événements afin de gérer ces événements au sein de vos composants React.

Une source habituelle de confusion réside dans l’utilisation par les Web Components de `class` au lieu de `className`.

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>Face</div>
      <div>Arrière</div>
    </brick-flipbox>
  );
}
```

## Utiliser React dans vos Web Components {#using-react-in-your-web-components}

```javascript
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}
customElements.define('x-search', XSearch);
```

>Remarque
>
> Ce code **ne fonctionnera pas** si vous transformez vos classes avec Babel. Consultez la discussion à ce sujet sur [ce ticket](https://github.com/w3c/webcomponents/issues/587).
> Intégrez l'adaptateur [custom-elements-es5-adapter](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs#custom-elements-es5-adapterjs) préalablement au chargement de vos Web Components afin de résoudre ce problème.
