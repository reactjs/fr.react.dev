---
id: react-without-es6
title: React sans ES6
permalink: docs/react-without-es6.html
---

En temps normal, pour définir un composant React, vous utilisez une classe Javascript:

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Si vous n'utilisez pas encore ES6, vous pouvez utiliser le module `create-react-class`:


```javascript
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```

À quelques exceptions près, l'API des classes ES6 est similaire a `createReactClass()`.

## Déclaration de Props par défaut {#declaring-default-props}

Dans les fonctions et les classes ES6, `defaultProps` est défini en tant que propriété a l'intérieur du composant:

```javascript
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Marie'
};
```

Avec `createReactClass()`, vous aurez besoin de définir `getDefaultProps()` en tant que fonction dans l'objet passé en paramètre:

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

Dans les classes ES6, vous pouvez définir l'état initial en affectant `this.state` dans le constructeur:

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

Avec `createReactClass()`, vous devez fournir une méthode `getInitialState` qui retourne l'état initial

```javascript
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

## Autobinding {#autobinding}

Dans les composants React déclarés en tant que classe ES6, les méthodes suivent la même sémantique tout comme les classes ES6 régulières. Cela veut dire qu'elles ne vont pas lier le `this` a l'instance de classe. Pour ce faire, devez utiliser `.bind(this)` dans le constructeur:

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
    // La ligne ci-dessous est importante!
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // Nous pourrons utiliser `this.handleClick` pour gérer un événement, car il est lié a l'instance de classe
    return (
      <button onClick={this.handleClick}>
        Dis hello
      </button>
    );
  }
}
```

Ce ne sera pas nécessaire dans `createReactClass()`, car elle lie toutes les méthodes:

```javascript
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Hello!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Dis hello
      </button>
    );
  }
});
```

L'écriture de classes ES6 inclue un peu plus de code générique pour les gestionnaires d'événements, mais ceci améliore légèrement les performances pour les grosses applis.

Si vous ne trouvez pas le code générique très attirant, vous pouvez activer la proposition de syntaxe **expérimentale** avec Babel [Propriétés de Classe](https://babeljs.io/docs/plugins/transform-class-properties/) :


```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
  }
  // ATTENTION: cette syntaxe est expérimentale!
  // L'utilisation d'une fonction flechée va lier la méthode a l'instance de classe:
  handleClick = () => {
    alert(this.state.message);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Dis hello
      </button>
    );
  }
}
```

Il faut prendre note du fait que la syntaxe ci-dessus est **expérimentale** et qu'elle pourrait être amenée à changer, ou que la proposition de syntaxe ne soit pas intergrée au langage.

Si vous préférez la prudence, quelques options s'offrent à vous:

* Lier les méthodes à l'instance de classe dans le constructeur.
* Utiliser des fonctions fléchées, e.g. `onClick={(e) => this.handleClick(e)}`.
* Continuer à utiliser `createReactClass`.

## Mixins {#mixins}

>**Note:**
>
>ES6 a été lancé sans support pour les mixins. C'est pour cette raison qu'il n'y a pas de support pour les mixins quand vous utilisez React avec les classes ES6.
>
>**Nous avons aussi trouvé pas mal de problèmes dans les bases de code utilisant les mixins, [nous recommandons de na pas les utiliser dans vos nouvelles applis](/blog/2016/07/13/mixins-considered-harmful.html).**
>
>This section exists only for the reference.

Des composants très différents les uns des autres peuvent partager des fonctionalites communes. Ce sont des [pré-occupations transversales](https://en.wikipedia.org/wiki/Cross-cutting_concern). `createReactClass` vous permet d'utiliser un système de `mixins` de patrimoine (???).

Un cas d'utilisation courant est un composent qui veut se mettre à jour par intervalle de temps. C'est facile d'utiliser `setInterval()`, mais c'est important d'annuler votre intervalle si vous n'en avez plus besoin afin d'economiser de la mémoire. React fournit des [méthodes de cycle de vie](/docs/react-component.html#the-component-lifecycle), celles-si vous font savoir quand est-ce qu'un composant va être crée ou détruit. Créons une simple mixin qui utilise ces méthodes afin de fournir une simple fonction `setInterval()` qui va se nettoyer automatiquement lorsque le composant est détruit.

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
  mixins: [SetIntervalMixin], // Utiliser la mixin
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // Appeler un méthode dans la mixin
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

Si un composant utilise plusieurs mixins et que nombreuses mixins définissent la même méthode de cycle de vie(C-à-d que de nombreuses mixins veulent faire un nettoyage lorsque le composant est détruit), vous avez la garantie que toutes ces méthodes de cycle de vie vont être appelées. Les méthodes définies dans les mixins se lancent dans l'ordre dans le lequel les mixins ont été listées, suivies par un appel de méthode dans le composant.
