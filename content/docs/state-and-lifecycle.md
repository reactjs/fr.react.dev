---
id: state-and-lifecycle
title: État et cycle de vie
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

Cette page présente les concepts d'état local et de cycle de vie dans un composant React. Vous pouvez trouver [la référence d'API des composants ici](/docs/react-component.html).

Prenons l'exemple de l'horloge dans [une des sections précédentes](/docs/rendering-elements.html#updating-the-rendered-element). Dans [Le rendu des éléments](/docs/rendering-elements.html#rendering-an-element-into-the-dom), nous avons appris une seule façon de mettre à jour l'interface utilisateur (UI). On appelle `ReactDOM.render()` pour changer la sortie rendue :

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>Bonjour, monde !</h1>
      <h2>Il est {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/gwoJZk?editors=0010)

Dans cette section, nous allons apprendre à faire un composant `Clock` vraiment réutilisable et isolé. Il mettra en place son propre minuteur et se mettra à jour tout seul à chaque seconde.

Nous commençons par isoler l'apparence de l'horloge :

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>Bonjour, monde !</h1>
      <h2>Il est {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/dpdoYR?editors=0010)

Cependant, il manque une contrainte cruciale : le fait que la `Clock` mette en place le minuteur et mette à jour son interface utilisateur devrait être un détail d'implémentation de la `Clock`.

Idéalement, on veut écrire ceci une seule fois et voir la `Clock` se mettre à jour elle-même :

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Pour implémenter ça, on a besoin d'ajouter un « état local » au composant `Horloge`.

L'état local est similaire aux props, mais il est privé et complètement contrôlé par le composant.

## Convertir une fonction en classe {#converting-a-function-to-a-class}

Vous pouvez convertir un composant fonctionnel comme `Clock` en une classe en cinq étapes :

1. Créez une [classe ES6](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes), avec le même nom, qui étend `React.Component`.

2. Ajoutez-y une méthode vide appelée `render()`.

3. Déplacez le corps de la fonction dans la méthode `render()`.

4. Remplacez `props` par `this.props` dans le corps de la méthode `render()`.

5. Supprimez la déclaration désormais vide de la fonction.

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Bonjour, monde !</h1>
        <h2>Il est {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/zKRGpo?editors=0010)

Le composant `Clock` est maintenant défini comme une classe au lieu d'une fonction.

La méthode `render` sera appelée à chaque fois qu'une mise à jour aura lieu, mais tant que l'on exploite le rendu de `<Clock />` dans le même nœud DOM, une seule instance de la classe `clock` sera utilisée. Cela nous permet d'utiliser des fonctionnalités supplémentaires telles que l'état local et les méthodes de cycle de vie.

## Ajouter un état local à une classe {#adding-local-state-to-a-class}

Nous allons déplacer la `date` des props vers l'état en trois étapes :

1) Remplacez `this.props.date` avec `this.state.date` dans la méthode `render()` :

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Bonjour, monde !</h1>
        <h2>Il est {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

2) Ajoutez [un constructeur de classe](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes#Constructeur) qui initialise `this.state`:

```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Bonjour, monde !</h1>
        <h2>Il est {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Notez que l'on passe `props` au constructeur de base :

```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

Les composants à base de classe devraient toujours appeler le constructeur de base avec `props`.

3) Supprimez la prop `date` de l'élément `<Clock />` :

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Nous rajouterons plus tard le code du minuteur dans le composant lui-même.

Le résultat ressemble à ceci :

```js{2-5,11,18}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Bonjour, monde !</h1>
        <h2>Il est {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/KgQpJd?editors=0010)

Ensuite, nous allons faire en sorte que le composant `Clock` mette en place son propre minuteur et se mette à jour toutes les secondes.

## Ajouter des méthodes de cycle de vie à une classe {#adding-lifecycle-methods-to-a-class}

Dans des applications avec de nombreux composants, il est très important de libérer les ressources utilisées par les composants quand ils sont détruits.

Nous voulons [mettre en place un minuteur](https://developer.mozilla.org/fr/docs/Web/API/WindowTimers/setInterval) quand une `Horloge` apparaît dans le DOM pour la première fois. Le terme React « montage » désigne cette phase.

Nous voulons également [nettoyer le minuteur](https://developer.mozilla.org/fr/docs/Web/API/WindowTimers/clearInterval) quand le DOM produit par l'`Horloge` est supprimé. En React, on parle de « démontage ».

Nous pouvons déclarer des méthodes spéciales sur un composant à base de classe pour exécuter du code quand un composant est monté et démonté :

```js{7-9,11-13}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Bonjour, monde !</h1>
        <h2>Il est {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

On les appelle des « méthodes de cycle de vie ».

La méthode `componentDidMount()` est exécutée après que la sortie du composant a été injectée dans le DOM. C'est un bon endroit pour mettre en place le minuteur :

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

Notez qu’on a enregistré l'ID du minuteur directement sur `this` (`this.timerID`).

Alors que `this.props` est mis en place par React lui-même et que `this.state` a un sens bien spécial, vous pouvez très bien ajouter manuellement d'autres champs sur la classe si vous avez besoin de stocker quelque chose qui ne participe pas au flux de données (comme un ID de minuteur).

Nous allons détruire le minuteur dans la méthode de cycle de vie `componentWillUnmount()` :

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

Enfin, nous allons implémenter une méthode appelée `tick()` que le composant `Clock` va exécuter toutes les secondes.

Elle utilisera `this.setState()` pour planifier une mise à jour de l'état local du composant :

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Bonjour, monde !</h1>
        <h2>Il est {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/amqdNA?editors=0010)

Maintenant l'horloge se met à jour toutes les secondes.

Récapitulons ce qui se passe et l'ordre dans lequel les méthodes sont invoquées :

1) Quand `<Clock />` est passé à `ReactDOM.render()`, React appelle le constructeur du composant `Clock`. Puisque `Clock` a besoin d'afficher l'heure actuelle, il initialise `this.state` avec un objet contenant l'heure actuelle. Nous mettrons cet état à jour par la suite.

2) React appelle ensuite la méthode `render()` du composant `Clock`. C'est comme cela que React découvre ce qu'il faut afficher à l'écran. React met ensuite à jour le DOM pour correspondre à la sortie de la méthode `render()` du composant `Clock`.

3) Quand la sortie de la `Clock` est insérée dans le DOM, React appelle la méthode de cycle de vie `componentDidMount()`. À l'intérieur, le composant `Clock` demande au navigateur de mettre en place un minuteur pour appeler la méthode `tick()` du composant une fois par seconde.

4) Chaque seconde, le navigateur appelle la méthode `tick()`. À l'intérieur, le composant `Clock` planifie une mise à jour de l'interface utilisateur en appelant `setState()` avec un objet contenant l'heure actuelle. Grâce à l'appel à `setState()`, React sait que l'état a changé, et invoque à nouveau la méthode `render()` pour savoir ce qui devrait être affiché à l'écran. Cette fois, la valeur de `this.state.date` dans la méthode `render()` est différente, la sortie devrait donc inclure l'heure mise à jour. React met à jour le DOM en accord avec cela.

5) Si le composant `Clock` finit par être retiré du DOM, React appellera la méthode de cycle de vie `componentWillUnmount()` pour que le minuteur soit arrêté.

## Utiliser l'état local correctement {#using-state-correctly}

Il y'a trois choses que vous devriez savoir à propos de `setState()`.

### Ne modifiez pas l'état directement {#do-not-modify-state-directly}

Par exemple, ceci ne déclenchera pas un rafraîchissement du composant :

```js
// Erroné
this.state.comment = 'Bonjour';
```

À la place, utilisez `setState()` :

```js
// Correct
this.setState({comment: 'Bonjour'});
```

Le seul endroit où vous pouvez affecter `this.state`, c’est le constructeur.

### Les mises à jour de l'état peuvent être asynchrones {#state-updates-may-be-asynchronous}

React peut grouper plusieurs appels à `setState()` en une seule mise à jour pour des raisons de performance.

Comme `this.props` et `this.state` peuvent être mises à jour de façon asynchrone, vous ne devez pas vous baser sur leurs valeurs pour calculer le prochain état.

Par exemple, ce code peut échouer pour mettre à jour un compteur :

```js
// Erroné
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

Pour remédier à ce problème, utilisez la seconde forme de `setState()` qui accepte une fonction à la place d'un objet. Cette fonction recevra l'état précédent comme premier argument et les props au moment de la mise à jour comme second argument :

```js
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

Nous avons utilisé une [fonction fléchée](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Fonctions/Fonctions_fl%C3%A9ch%C3%A9es) ci-dessus, mais une fonction normale marche aussi :

```js
// Correct
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

### Les mises à jour de l'état sont fusionnées {#state-updates-are-merged}

Quand vous invoquez `setState()`, React fusionne les objets que vous donnez avec l'état actuel.

Par exemple, votre état peut contenir plusieurs variables indépendantes :

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

Ensuite, vous pouvez les mettre à jour indépendamment avec des appels séparés à `setState()` :

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

La fusion n'est pas profonde, donc `this.setState({comments})` laisse `this.state.posts` intacte, mais remplace complètement `this.state.comments`.

## Les données descendent {#the-data-flows-down}

Ni parent ni enfant ne peuvent savoir si un certain composant est à état ou non, et ne devraient pas se soucier de savoir s'il est défini par une fonction ou une classe.

C'est pourquoi on dit souvent que l'état est local ou encapsulé. Il est impossible d'y accéder depuis un autre composant.

Un composant peut choisir de passer son état à ses enfants via des props :

```js
<h2>Il est {this.state.date.toLocaleTimeString()}.</h2>
```

Cela marche également avec des composants définis par l'utilisateur :

```js
<FormattedDate date={this.state.date} />
```

Le composant `FormattedDate` reçoit la `date` dans ses props et ne sait pas si elle vient de l'état de la `Clock`, des props de la `Clock`, ou a été tapée à la main :

```js
function FormattedDate(props) {
  return <h2>Il est {props.date.toLocaleTimeString()}.</h2>;
}
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/zKRqNB?editors=0010)

On appelle souvent cela un flux de données « du haut vers le bas » ou « unidirectionnel ». Un état local est toujours possédé par un composant spécifique, et toute donnée ou interface utilisateur dérivée de cet état ne peut affecter que les composants « en-dessous » de celui-ci dans l'arbre de composants.

Si vous imaginez un arbre de composants comme une cascade de props, chaque état de composant est une source d'eau supplémentaire qui rejoint la cascade à un point quelconque, mais qui coule également vers le bas.

Pour démontrer que tous les composants sont réellement isolés, nous pouvons créer un composant `App` qui affiche trois `<Clock>`s :

```js{4-6}
function Application() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <Application />,
  document.getElementById('root')
);
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/vXdGmd?editors=0010)

Chaque `Clock` met en place son propre minuteur et se met à jour indépendamment.

Dans une application React, le fait qu'un composant soit à état ou non est considéré comme un détail d'implémentation du composant qui peut varier avec le temps. Vous pouvez utiliser des composants sans état à l'intérieur de composants à état, et vice-versa.
