---
id: web-components
title: Composants Web
permalink: docs/web-components.html
redirect_from:
  - "docs/webcomponents.html"
---

React et [les Composants Web](https://developer.mozilla.org/fr/docs/Web/Web_Components) sont conçus pour résoudre des problèmes différents. Les Composants Web offrent une encapsulation forte pour des composants réutilisables, tandis que React fournit une bibliothèque déclarative qui permet au DOM de rester synchronisé avec vos données. Les deux objectifs sont complémentaires. En tant que développeur, vous être libre d'utiliser React dans vos Composants Web, ou bien d'utiliser des Composants Web dans React, ou encore les deux à la fois.

La plupart des personnes qui utilisent React n'utilisent pas les Composants Web, mais vous voudrez peut-être le faire, en particulier si vous utilisez des composants d'interface utilisateur tiers écrits à l'aide de Composants Web.

## Utiliser des Composants Web dans React {#using-web-components-in-react}

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Bonjour <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> Note :
>
> Les Composants Web exposent souvent une API impérative. Par exemple, un Composant Web `video` peut exposer les fonctions `play()` et `pause()`. Pour accéder à l'API impérative d'un Composant Web, vous devez utiliser une référence pour interagir directement avec le nœud du DOM. Si vous utilisez des Composants Web tiers, la meilleure solution consiste à écrire un composant React qui se comporte comme un wrapper pour votre Composant Web.
>
> Les événements émis par un Composant Web peuvent ne se propager correctement à travers un arbre de rendu de React.
> Vous devrez attacher manuellement les gestionnaires d'événements afin de gérer ces événements au sein de vos composants React.

Une confusion courante est que les Composants Web utilisent « class » au lieu de « className ».

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

## Utiliser React dans vos Composants Web {#using-react-in-your-web-components}

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

> Note :
>
> Ce code **ne fonctionnera pas** si vous transformez vos classes avec Babel. Consultez la discussion à ce sujet sur [ce ticket](https://github.com/w3c/webcomponents/issues/587).
> Intégrez l'adaptateur [custom-elements-es5-adapter](https://github.com/webcomponents/webcomponentsjs#custom-elements-es5-adapterjs) préalablement au chargement de vos Composants Web afin de résoudre ce problème.
