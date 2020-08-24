---
id: react-without-es6
title: React sans ES6
permalink: docs/react-without-es6.html
prev: optimizing-performance.html
next: react-without-jsx.html
---

En temps normal, pour définir un composant React, vous utilisez une classe Javascript ordinaire :

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Bonjour, {this.props.name}</h1>;
  }
}
```

Si vous n'utilisez pas encore ES6, vous pouvez utiliser le module `create-react-class` :


```javascript
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Bonjour, {this.props.name}</h1>;
  }
});
```

À quelques exceptions près, l'API des classes ES6 est similaire a `createReactClass()`.

## Déclarer des props par défaut {#declaring-default-props}

Dans les fonctions et les classes ES6, `defaultProps` est défini en tant que propriété sur le composant lui-même :

```javascript
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Marie'
};
```

Avec `createReactClass()`, vous aurez besoin de définir `getDefaultProps()` en tant que fonction dans l'objet passé en argument :

```javascript
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Marie'
    };
  },

  // ...

});
```

## Définir l'état initial {#setting-the-initial-state}

Dans les classes ES6, vous pouvez définir l'état local initial en affectant `this.state` dans le constructeur :

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

Avec `createReactClass()`, vous devez fournir une méthode `getInitialState` qui renvoie l'état initial :

```javascript
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

## Liaison automatique des méthodes {#autobinding}

Dans les composants React déclarés en tant que classes ES6, les méthodes suivent la même sémantique que dans toute classe ES6. Ça signifie qu'elles ne vont pas automatiquement lier `this` a l'instance. Pour ce faire, vous devez utiliser `.bind(this)` dans le constructeur :

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Bonjour !'};
    // La ligne ci-dessous est importante !
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // Nous pouvons utiliser `this.handleClick` comme gestionnaire d’événements,
    // car il est lié a l'instance courante.
    return (
      <button onClick={this.handleClick}>
        Dis bonjour
      </button>
    );
  }
}
```

Tout ça n’est pas nécessaire avec `createReactClass()`, car elle lie toutes les méthodes :

```javascript
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Bonjour !'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Dis bonjour
      </button>
    );
  }
});
```

L'écriture de classes ES6 nécessite un peu plus de code générique pour les gestionnaires d'événements, mais en contrepartie ça améliore légèrement les performances pour les grosses applications.

Si vous n’arrivez pas à tolérer ce code générique, vous pouvez activer dans Babel la proposition de syntaxe **expérimentale** [Propriétés de classes](https://babeljs.io/docs/plugins/transform-class-properties/) :


```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Bonjour !'};
  }
  // ATTENTION : cette syntaxe est expérimentale !
  // Recourir à une fonction fléchée va lier la méthode à l'instance :
  handleClick = () => {
    alert(this.state.message);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Dis bonjour
      </button>
    );
  }
}
```

Remarquez bien que la syntaxe ci-dessus est **expérimentale** et qu'elle pourrait être amenée à changer, ou que la proposition de syntaxe ne soit pas intégrée au langage.

Si vous préférez la prudence, quelques options s'offrent à vous :

* Lier les méthodes à l'instance dans le constructeur.
* Utiliser des fonctions fléchées, ex. `onClick={(e) => this.handleClick(e)}`.
* Continuer à utiliser `createReactClass`.

## Mixins {#mixins}

>Remarque
>
>ES6 est sorti sans prise en charge des *mixins*. C'est pour cette raison qu'ils ne sont pas pris en charge quand vous utilisez React avec les classes ES6.
>
>**Nous avons aussi trouvé pas mal de problèmes dans les bases de code utilisant les mixins, du coup [nous recommandons de ne pas les utiliser à l’avenir](/blog/2016/07/13/mixins-considered-harmful.html).**
>
>Cette section n’existe qu’à titre de référence.

Des composants très différents les uns des autres peuvent partager des fonctionnalités communes. On parle souvent de [questions transversales](https://en.wikipedia.org/wiki/Cross-cutting_concern) *(cross-cutting concerns, NdT)*. `createReactClass` vous permet d'utiliser un système historique de `mixins` pour ça.

Un cas d'usage courant concerne un composant qui veut se mettre à jour à intervalle régulier. C'est facile d'utiliser `setInterval()`, mais il est important de désactiver l’horloge quand vous n'en avez plus besoin afin d'économiser la mémoire. React fournit des [méthodes de cycle de vie](/docs/react-component.html#the-component-lifecycle) qui vous notifient quand un composant est sur le point d’être créé ou détruit. Créons un *mixin* basique qui utilise ces méthodes afin de fournir une fonction `setInterval()` simple d'emploi, qui se nettoiera automatiquement lorsque le composant est détruit.

```javascript
var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var createReactClass = require('create-react-class');

var TickTock = createReactClass({
  mixins: [SetIntervalMixin], // Utiliser le mixin
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // Appelle la méthode du mixin
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  render: function() {
    return (
      <p>
        Votre composant React tourne depuis {this.state.seconds} secondes.
      </p>
    );
  }
});

ReactDOM.render(
  <TickTock />,
  document.getElementById('example')
);
```

Si un composant utilise plusieurs mixins et que de nombreux mixins définissent la même méthode de cycle de vie (par exemple pour effectuer un nettoyage à la destruction du composant), vous avez la garantie que toutes ces méthodes de cycle de vie seront appelées. Les méthodes définies dans les mixins sont exécutées dans l'ordre dans lequel les mixins ont été listés, suivies par l’appel de la méthode homonyme éventuelle du composant lui-même.
