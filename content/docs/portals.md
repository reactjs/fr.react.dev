---
id: portals
title: Les portails
permalink: docs/portals.html
---

Les portails fournissent une excellente solution pour afficher des composants enfants dans un nœud DOM qui existe en dehors de la hiérarchie DOM du composant parent.

```js
ReactDOM.createPortal(child, container)
```

Le premier argument (`child`) peut être n'importe quel [enfant affichable par React](/docs/react-component.html#render), comme un élément, une chaine de caractères ou un fragment. Le second argument (`container`) est un élément du DOM.

## Utilisation {#usage}

D’habitude, lorsque vous renvoyez un élément depuis le rendu d'un composant, cet élément est monté dans le DOM en tant qu'enfant du plus proche parent :

```js{4,6}
render() {
  // React monte une nouvelle div et affiche les enfants à l’intérieur de celle-ci
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

Cependant il est parfois utile d'insérer un enfant à un autre emplacement du DOM :

```js{6}
render() {
  // React *ne crée pas* une nouvelle div, mais affiche les enfants dans `domNode`.
  // `domNode` peut être n’importe quel élément valide du DOM, peu importe sa position.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

Un cas typique d'utilisation des portails survient lorsqu'un composant parent possède un style `overflow: hidden` ou `z-index` et que l'enfant a besoin de « sortir de son conteneur »  visuellement. C’est par exemple le cas des boîtes de dialogues, des pop-ups ou encore des infobulles.

> Remarque
>
> Lorsque vous travaillez avec les portails, gardez en tête que la [gestion du focus du clavier](/docs/accessibility.html#programmatically-managing-focus) devient très importante.
>
> Pour les fenêtres modales, assurez-vous que tout le monde puisse interagir avec celles-ci en suivant les règles [WAI-ARIA Modal Authoring Practices du W3C](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal) (en anglais).

[**Essayer dans CodePen**](https://codepen.io/gaearon/pen/yzMaBd)

## La propagation des événements dans les portails {#event-bubbling-through-portals}

Même si un portail peut être placé n'importe où dans l'arborescence DOM, il se comporte comme un enfant React normal à tous les autres points de vue. Les fonctionnalités comme le contexte se comportent exactement de la même façon, indépendamment du fait que l'enfant soit un portail, car le portail existe toujours dans *l'arborescence React*, indépendamment de sa position dans *l'arborescence DOM*.

Ça concerne aussi la propagation montante des événements. Un événement déclenché à l'intérieur d'un portail sera propagé aux ancêtres dans *l'arborescence React*, même si ces éléments ne sont pas ses ancêtres dans *l'arborescence DOM*. Prenons par exemple le code HTML suivant :

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

Un composant `Parent` dans `#app-root` pourrait attraper un événement montant non-intercepté provenant du nœud frère `#modal-root`.

```js{28-31,42-49,53,60-62,69-70,73}
// Ces deux conteneurs sont frères dans le DOM
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // L’élément portail est inséré dans l’arborescence DOM une fois
    // que les enfants du Modal sont montés, ce qui signifie que
    // les enfants seront montés sur un nœud DOM détaché.
    // Si un composant enfant nécessite d’être attaché au DOM
    // dès le montage, par exemple pour mesurer un nœud DOM ou
    // utiliser 'autoFocus' dans un nœud descendant, ajoutez un état
    // à la modale et affichez uniquement les enfants une fois la
    // modale insérée dans le DOM.
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
    // La fonction se déclenchera lorsque le bouton dans l’enfant sera cliqué,
    // permettant la mise à jour de l’état du parent, même si le bouton
    // n’en est pas un descendant direct dans le DOM.
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Nombre de clics : {this.state.clicks}</p>
        <p>
          Ouvrez les outils de développement de votre navigateur
          pour observer que ce bouton n’est pas un enfant de la div
          qui écoute les événements de clic.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // Lors de clics sur ce bouton, l’événement sera propagé au parent
  // car il n’y a pas d'attribut 'onClick' défini ici.
  return (
    <div className="modal">
      <button>Cliquez ici</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

[**Essayer dans CodePen**](https://codepen.io/gaearon/pen/jGBWpE)

Attraper un événement en cours de propagation depuis un portail dans un composant parent autorise le développement d'abstractions plus flexibles qui ne sont pas forcément liées aux portails. Par exemple, si vous affichez un composant `<Modal />`, le parent peut capturer ses événements, que le parent soit implémenté à base de portails ou non.
