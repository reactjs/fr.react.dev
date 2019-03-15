---
id: portals
title: Les portails
permalink: docs/portals.html
---

Les portails fournissent une excellente solution pour afficher les enfants d'un nœud DOM qui existe en dehors de la hiérarchie DOM du composant parent.

```js
ReactDOM.createPortal(child, container)
```

Le premier argument (`child`) peut être n'importe quel [enfant affichable par React](/docs/react-component.html#render), comme un élément, une chaine de caractères ou un fragment. Le second argument (`container`) est un élément du DOM.

## Utilisation {#usage}

Habituellement, lorsque vous retournez un élément depuis une méthode d'affichage d'un composant, celui-ci est fixé dans le DOM en tant qu'enfant du plus proche parent :

```js{4,6}
render() {
  // React positionne une nouvelle div et affiche les enfants à l'intérieur de celle-ci
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

Cependant il est utile d'insérer un enfant dans un autre emplacement du DOM :

```js{6}
render() {
  // React *ne crée pas* une nouvelle div, mais affiche les enfants dans `domNode`.
  // Peu importe sa position `domNode` peut être n'importe quel élément valide du DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

Un cas typique d'utilisation des portails est lorsqu'un composant parent possède un style `overflow: hidden` ou `z-index` et que l'enfant soit visuellement « sorti de son conteneur ». Par exemple avec les boites de dialogues, les pop-ups ou encore les infobulles.

> Remarque :
>
> Lorsque vous travaillez avec les portails, gardez en tête que la [gestion du focus du clavier](/docs/accessibility.html#programmatically-managing-focus) devient très importante.
>
> Pour les fenêtres modales, assurez-vous que tout le monde puissent interagir avec celle-ci en suivant les règles [WAI-ARIA Modal Authoring Practices du W3C](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal).

[**Essayer dans CodePen**](https://codepen.io/gaearon/pen/yzMaBd)

## La propagation des évènements dans les portails {#event-bubbling-through-portals}

Même si un portail peut être placé n'importe où dans l'arborescence DOM, il se comporte comme un simple enfant de React dans tous les autres cas. Les fonctionnalités comme le contexte se comporte exactement de la même façon, indépendamment du fait que l'enfant est un portail. Le portail existe toujours dans *l'arborescence React*, qu'importe sa position dans *l'arborescence DOM*.

Ceci inclut aussi la propagation montante des évènements. Un événement déclenché à l'intérieur d'un portail sera propagé aux ancêtres dans *l'arborescence React*, même si les éléments ne sont pas ancêtres de *l'arborescence DOM*. Considérons le code HTML suivant :

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

Un composant `Parent` dans `#app-root` sera capable d'attraper un événement montant non intercepté provenant d'un nœud frère `#modal-root`.

```js{28-31,42-49,53,61-63,70-71,74}
// Ces deux conteneurs sont frères dans le DOM
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // L'élément Portail est inséré dans l'arborescence DOM une fois
    // que la fenêtre modale enfante est fixée, ce qui signifie que
    // l'enfant est attaché dans un nœud DOM détaché.
    // Si un composant enfant nécessite d'être attaché dans
    // l'arborescence DOM immédiatement lorsque celui-ci est inséré,
    // par exemple pour mesurer un nœud DOM ou utiliser 'autoFocus'
    // dans un nœud descendant, ajoutez un état à la modale et affichez
    // uniquement l'enfant lorsque la modale est insérée dans le DOM.
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // La fonction se déclenchera lorsque le bouton dans l'enfant sera cliqué,
    // permettant la mise à jour de l'état du parent, même si le bouton
    // n'est pas un élément de parenté directe dans le DOM.
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Nombre de clics : {this.state.clicks}</p>
        <p>
          Ouvrez les outils de développement de votre navigateur
          pour observer que ce bouton n'est pas un enfant de la div
          qui possède l'écouteur d'évènements.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // Lors d'un clic du bouton, l'événement va être propagé au parent
  // car il n'y a pas d'attribut 'onClick' défini.
  return (
    <div className="modal">
      <button>Cliquez ici</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

[**Essayer dans CodePen**](https://codepen.io/gaearon/pen/jGBWpE)

Attraper un événement en cours de propagation depuis un portail dans un composant parent autorise le développement d'abstractions plus flexibles qui ne sont pas forcément liées aux portails. Par exemple, si vous affichez un composant `<Modal />`, le parent peut capturer ces événements indépendamment du fait que ceux-ci sont implémentés avec l'utilisation d'un portail.