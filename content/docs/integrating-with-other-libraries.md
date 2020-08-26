---
id: integrating-with-other-libraries
title: Intégration avec d'autres bibliothèques
permalink: docs/integrating-with-other-libraries.html
prev: render-props.html
next: accessibility.html
---

React peut être utilisé dans n'importe quelle application web. Il peut être intégré à d'autres applications et, avec un peu de soin, d'autres applications peuvent être intégrées à React. Ce guide examine certains des cas d'utilisation les plus courants, en se concentrant sur l'intégration avec [jQuery](https://jquery.com/) et [Backbone](https://backbonejs.org/), mais les mêmes idées peuvent être appliquées à l'intégration de composants à n'importe quel code existant.

## Intégration aux plugins de manipulation DOM {#integrating-with-dom-manipulation-plugins}

React ignore les modifications apportées au DOM en dehors de React. Il détermine les mises à jour en fonction de sa propre représentation interne et, si les mêmes nœuds du DOM sont manipulés par une autre bibliothèque, React s'emmêle les pinceaux et ne dispose d'aucun moyen de se rétablir.

Ça ne signifie pas qu'il est impossible ni même nécessairement difficile de combiner React avec d'autres moyens d'affecter le DOM, vous devez simplement être attentifs à ce que chacun fait.

Le moyen le plus simple d'éviter les conflits consiste à empêcher le composant React de mettre à jour l’élément « partagé ». Vous pouvez faire ça en utilisant des éléments que React n’aura aucune raison de mettre à jour, comme une `<div />` vide.

### Comment aborder le problème {#how-to-approach-the-problem}

Pour illustrer ça, esquissons un enrobage pour un plugin générique jQuery.

Nous attacherons une [ref](/docs/refs-and-the-dom.html) à l'élément racine DOM. Dans `componentDidMount`, nous obtiendrons une référence qui pourra être passée au plugin jQuery.

Pour empêcher React de toucher au DOM après le montage, nous renverrons une `<div />` vide depuis la méthode `render()`. L'élément `<div />` n'a pas de propriétés ni d'enfants, donc React n'a aucune raison de le mettre à jour, laissant le plugin jQuery libre de gérer cette partie du DOM :

```js{3,4,8,12}
class SomePlugin extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }

  componentWillUnmount() {
    this.$el.somePlugin('destroy');
  }

  render() {
    return <div ref={el => this.el = el} />;
  }
}
```

Notez que nous avons défini les deux [méthodes de cycle de vie](/docs/react-component.html#the-component-lifecycle) `componentDidMount` et ` componentWillUnmount` . De nombreux plugins jQuery attachent des gestionnaires d'événements au DOM, il est donc important de les détacher dans `componentWillUnmount`. Si le plugin ne fournit pas de méthode de nettoyage, vous devrez probablement fournir la vôtre, en vous souvenant de supprimer tous les gestionnaires d'événements enregistrés par le plugin pour éviter les fuites de mémoire.

### Intégration avec le plugin jQuery Chosen {#integrating-with-jquery-chosen-plugin}

Pour un exemple plus concret de ces concepts, écrivons un enrobage minimal pour le plugin [Chosen](https://harvesthq.github.io/chosen/), qui enrichit les champs `<select>`.

>Remarque
>
>Ça n’est pas parce que c’est possible qu'il s'agit de la meilleure approche pour les applications React. Nous vous encourageons à utiliser les composants React lorsque vous le pouvez. Les composants React sont plus faciles à réutiliser dans les applications React et permettent souvent de mieux contrôler leur comportement et leur apparence.

Tout d'abord, regardons ce que Chosen fait au DOM.

Si vous l'appelez sur un nœud DOM `<select>`, il lit les attributs du nœud DOM d'origine, le masque avec du style en ligne, puis ajoute un nœud DOM distinct avec sa propre représentation visuelle juste après le `<select>`. Ensuite, il déclenche des événements jQuery pour nous informer des modifications.

Disons que nous visons cette API pour notre composant React d’enrobage `<Chosen>` :

```js
function Example() {
  return (
    <Chosen onChange={value => console.log(value)}>
      <option>vanille</option>
      <option>chocolat</option>
      <option>fraise</option>
    </Chosen>
  );
}
```

Nous allons l'implémenter en tant que [composant non-contrôlé](/docs/uncontrolled-components.html) pour plus de simplicité.

Pour commencer, nous allons créer un composant vide avec une méthode `render()` où nous renvoyons `<select>` enrobé dans une `<div>`:

```js{4,5}
class Chosen extends React.Component {
  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

Remarquez comment nous avons enrobé `<select>` dans une `<div>` supplémentaire. C’est nécessaire car Chosen ajoutera un autre élément DOM juste après le nœud `<select>` que nous lui aurons transmis. Cependant, en ce qui concerne React, `<div>` n'a toujours qu'un seul enfant. C'est de cette manière que nous nous assurons que les mises à jour React n'entreront pas en conflit avec le nœud DOM supplémentaire ajouté par Chosen. Si vous modifiez le DOM en-dehors du flux React, il est important que vous vous assuriez que React n'ait aucune raison de toucher à ces nœuds du DOM.

Ensuite, nous allons implémenter les méthodes de cycle de vie. Nous devons initialiser Chosen avec la référence du nœud `<select>` dans `componentDidMount`, et nettoyer le tout dans `componentWillUnmount` :

```js{2,3,7}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();
}

componentWillUnmount() {
  this.$el.chosen('destroy');
}
```

[**Essayez dans CodePen**](https://codepen.io/gaearon/pen/qmqeQx?editors=0010)

Notez que React n'attribue aucune signification particulière au champ `this.el`. Ça ne fonctionne que parce que nous avons déjà affecté une `ref` à ce champ dans la méthode `render()` :

```js
<select className="Chosen-select" ref={el => this.el = el}>
```

Ça suffit pour afficher notre composant, mais nous souhaitons également être informés des modifications de valeur. Pour ce faire, nous nous abonnerons à l'événement jQuery `change` sur le` <select>` géré par Chosen.

Nous ne transmettrons pas `this.props.onChange` directement à Chosen, car les props du composant peuvent changer avec le temps, ce qui inclut les gestionnaires d'événements. Au lieu de ça, nous allons déclarer une méthode `handleChange()` qui appelle `this.props.onChange`, et l'utiliserons pour nous abonner à l'événement jQuery `change` :

```js{5,6,10,14-16}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();

  this.handleChange = this.handleChange.bind(this);
  this.$el.on('change', this.handleChange);
}

componentWillUnmount() {
  this.$el.off('change', this.handleChange);
  this.$el.chosen('destroy');
}

handleChange(e) {
  this.props.onChange(e.target.value);
}
```

[**Essayez dans CodePen**](https://codepen.io/gaearon/pen/bWgbeE?editors=0010)

Enfin, il reste une dernière chose à faire. Dans React, les props peuvent changer avec le temps. Par exemple, le composant `<Chosen>` peut avoir différents enfants si l'état du composant parent change. Ça signifie qu’aux points d’intégration, il est important de mettre à jour manuellement le DOM en réponse aux mises à jour des props, car nous ne laissons plus React gérer le DOM pour nous.

La documentation de Chosen suggère que nous pouvons utiliser l'API `trigger()` de jQuery pour l'informer des modifications apportées à l'élément DOM d'origine. Nous laisserons React se charger de la mise à jour de `this.props.children` dans `<select>`, mais nous ajouterons également une méthode de cycle de vie `componentDidUpdate()` notifiant Chosen de tout changement dans la liste des enfants:

```js{2,3}
componentDidUpdate(prevProps) {
  if (prevProps.children !== this.props.children) {
    this.$el.trigger("chosen:updated");
  }
}
```

De cette façon, Chosen saura mettre à jour son élément DOM lorsque les enfants de `<select>` gérés par React changent.

L’implémentation complète du composant `Chosen` ressemble à ceci :

```js
class Chosen extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.chosen();

    this.handleChange = this.handleChange.bind(this);
    this.$el.on('change', this.handleChange);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.$el.trigger("chosen:updated");
    }
  }

  componentWillUnmount() {
    this.$el.off('change', this.handleChange);
    this.$el.chosen('destroy');
  }

  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

[**Essayez dans CodePen**](https://codepen.io/gaearon/pen/xdgKOz?editors=0010)

## Intégration à d'autres bibliothèques de vues {#integrating-with-other-view-libraries}

React peut être intégré à d’autres applications grâce à la flexibilité de [`ReactDOM.render()`](/docs/react-dom.html#render).

Bien que React soit couramment utilisé au démarrage pour charger un seul composant racine React dans le DOM, `ReactDOM.render()` peut également être appelé plusieurs fois pour afficher des parties indépendantes de l'interface utilisateur (UI), qui peuvent être aussi petites qu'un bouton ou aussi grandes qu'une application.

En fait, c’est exactement comme ça que React est utilisé chez Facebook. Ça nous permet d'écrire des applications en React morceau par morceau, et de les combiner avec nos gabarits existants générés par le serveur et d'autres codes côté client.

### Remplacement d’un rendu basé chaînes par React {#replacing-string-based-rendering-with-react}

Une pratique courante dans les anciennes applications web consiste à décrire des fragments du DOM sous forme de chaîne et à les insérer dans le DOM comme suit : `$el.html(htmlString)`. Ces points d'insertion dans une base de code sont parfaits pour introduire React. Il suffit de réécrire le rendu basé sur une chaîne sous la forme d'un composant React.

Donc, l'implémentation jQuery suivante...

```js
$('#container').html('<button id="btn">Dis bonjour</button>');
$('#btn').click(function() {
  alert('Bonjour !');
});
```

... pourrait être réécrite en utilisant un composant React :

```js
function Button() {
  return <button id="btn">Dis bonjour</button>;
}

ReactDOM.render(
  <Button />,
  document.getElementById('container'),
  function() {
    $('#btn').click(function() {
      alert('Bonjour !');
    });
  }
);
```

À partir de là, vous pouvez intégrer plus de logique dans le composant et commencer à adopter des pratiques React plus courantes. Par exemple, dans les composants, il est préférable de ne pas compter sur les ID, car un même composant peut être affiché plusieurs fois. Nous utiliserons plutôt le [système d’événements React](/docs/handling-events.html) et enregistrerons le gestionnaire de clics directement sur l’élément React `<button>` :

```js{2,6,9}
function Button(props) {
  return <button onClick={props.onClick}>Dis bonjour</button>;
}

function HelloButton() {
  function handleClick() {
    alert('Bonjour !');
  }
  return <Button onClick={handleClick} />;
}

ReactDOM.render(
  <HelloButton />,
  document.getElementById('container')
);
```

[**Essayez dans CodePen**](https://codepen.io/gaearon/pen/RVKbvW?editors=1010)

Vous pouvez avoir autant de composants isolés que vous le souhaitez et utiliser `ReactDOM.render()` pour les restituer dans différents conteneurs DOM. Au fur et à mesure que vous convertissez les parties de votre application en React, vous pourrez les combiner en composants plus volumineux et déplacer une partie des appels à `ReactDOM.render()` plus haut dans la hiérarchie.

### Incorporer React dans une vue Backbone {#embedding-react-in-a-backbone-view}

Les vues [Backbone](https://backbonejs.org/) utilisent généralement des chaînes HTML ou des fonctions de gabarit produisant des chaînes pour créer le contenu de leurs éléments DOM. Ce processus peut également être remplacé par le rendu d'un composant React.

Ci-dessous, nous allons créer une vue Backbone appelée `ParagraphView`. La fonction `render()` de Backbone sera remplacée pour afficher un composant React `<Paragraph>` dans l'élément DOM fourni par Backbone (`this.el`). Ici aussi, nous utilisons  [`ReactDOM.render()`](/docs/react-dom.html#render):

```js{1,5,8,12}
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  render() {
    const text = this.model.get('text');
    ReactDOM.render(<Paragraph text={text} />, this.el);
    return this;
  },
  remove() {
    ReactDOM.unmountComponentAtNode(this.el);
    Backbone.View.prototype.remove.call(this);
  }
});
```

[**Essayez dans CodePen**](https://codepen.io/gaearon/pen/gWgOYL?editors=0010)

Il est important que nous appelions également `ReactDOM.unmountComponentAtNode()` dans la méthode `remove` afin que React désinscrive les gestionnaires d'événements et les autres ressources associées à l'arborescence des composants lorsqu'ils sont détachés.

Lorsqu'un composant est supprimé *depuis* une arborescence React, le nettoyage est effectué automatiquement, mais comme nous supprimons l'arborescence complète à la main, nous devons appeler cette méthode.

## Intégration avec des couches modèles {#integrating-with-model-layers}

Bien qu’il soit généralement recommandé d’utiliser un flux de données unidirectionnel tel que [l'état de React](/docs/lifting-state-up.html), [Flux](https://facebook.github.io/flux/) ou [Redux](https://redux.js.org/), les composants React peuvent utiliser une couche de modèle provenant d’autres frameworks et bibliothèques.

### Utiliser les modèles Backbone dans les composants React {#using-backbone-models-in-react-components}

Le moyen le plus simple de consommer des modèles et des collections [Backbone](https://backbonejs.org/) à partir d'un composant React consiste à écouter les divers événements de modification et à forcer manuellement une mise à jour.

Les composants responsables de l'affichage des modèles écouteraient les événements `'change'`, tandis que les composants responsables de l'affichage des collections écouteraient les événements `'add'` et `'remove'`. Dans les deux cas, appelez [`this.forceUpdate()`](/docs/react-component.html#forceupdate) pour rafraîchir le composant avec les nouvelles données.

Dans l'exemple ci-dessous, le composant `List` affiche une collection Backbone, en utilisant le composant `Item` pour restituer des éléments individuels.

```js{1,7-9,12,16,24,30-32,35,39,46}
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.model.on('change', this.handleChange);
  }

  componentWillUnmount() {
    this.props.model.off('change', this.handleChange);
  }

  render() {
    return <li>{this.props.model.get('text')}</li>;
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.collection.on('add', 'remove', this.handleChange);
  }

  componentWillUnmount() {
    this.props.collection.off('add', 'remove', this.handleChange);
  }

  render() {
    return (
      <ul>
        {this.props.collection.map(model => (
          <Item key={model.cid} model={model} />
        ))}
      </ul>
    );
  }
}
```

[**Essayez dans CodePen**](https://codepen.io/gaearon/pen/GmrREm?editors=0010)

### Extraction de données à partir des modèles Backbone {#extracting-data-from-backbone-models}

L'approche ci-dessus nécessite que vos composants React soient conscients des modèles et des collections Backbone. Si vous envisagez par la suite de migrer vers une autre solution de gestion de données, vous voudrez peut-être concentrer les connaissances sur Backbone dans le moins possible de parties du code.

Une solution à ce problème consiste à extraire les attributs du modèle sous forme de données simples à chaque modification, et à conserver cette logique en un seul endroit. Ce qui suit est [un composant d'ordre supérieur](/docs/higher-order-components.html) qui extrait tous les attributs d'un modèle Backbone et les stocke dans son état, pour finalement passer les données au composant enrobé.

De cette façon, seul le composant d'ordre supérieur doit connaître les détails du modèle Backbone, et la plupart des composants de l'application peuvent rester indépendants de Backbone.

Dans l'exemple ci-dessous, nous allons copier les attributs du modèle pour former l'état initial. Nous nous abonnons à l'événement `change` (et nous nous désabonnons lors du démontage), et lorsque l’événement survient, nous mettons à jour l'état avec les attributs actuels du modèle. Enfin, nous nous assurons que si la propriété `model` elle-même change, nous n’oublions pas de nous désabonner de l’ancien modèle et de nous abonner au nouveau.

Notez que cet exemple n'est pas exhaustif en ce qui concerne l'utilisation de Backbone, mais il devrait vous donner une idée de la manière générique de l'aborder :

```js{1,5,10,14,16,17,22,26,32}
function connectToBackboneModel(WrappedComponent) {
  return class BackboneComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = Object.assign({}, props.model.attributes);
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.props.model.on('change', this.handleChange);
    }

    componentWillReceiveProps(nextProps) {
      this.setState(Object.assign({}, nextProps.model.attributes));
      if (nextProps.model !== this.props.model) {
        this.props.model.off('change', this.handleChange);
        nextProps.model.on('change', this.handleChange);
      }
    }

    componentWillUnmount() {
      this.props.model.off('change', this.handleChange);
    }

    handleChange(model) {
      this.setState(model.changedAttributes());
    }

    render() {
      const propsExceptModel = Object.assign({}, this.props);
      delete propsExceptModel.model;
      return <WrappedComponent {...propsExceptModel} {...this.state} />;
    }
  }
}
```

Pour montrer comment l'utiliser, connectons un composant `NameInput` React à un modèle Backbone et mettons à jour son attribut `firstName` chaque fois que la saisie change :

```js{4,6,11,15,19-21}
function NameInput(props) {
  return (
    <p>
      <input value={props.firstName} onChange={props.handleChange} />
      <br />
      Je m’appelle {props.firstName}.
    </p>
  );
}

const BackboneNameInput = connectToBackboneModel(NameInput);

function Example(props) {
  function handleChange(e) {
    props.model.set('firstName', e.target.value);
  }

  return (
    <BackboneNameInput
      model={props.model}
      handleChange={handleChange}
    />
  );
}

const model = new Backbone.Model({ firstName: 'Frodo' });
ReactDOM.render(
  <Example model={model} />,
  document.getElementById('root')
);
```

[**Essayez dans CodePen**](https://codepen.io/gaearon/pen/PmWwwa?editors=0010)

Cette technique ne se limite pas à Backbone. Vous pouvez utiliser React avec n’importe quelle bibliothèque de modèles en vous abonnant à ses modifications dans les méthodes de cycle de vie et, éventuellement, en copiant les données dans l’état local React.
