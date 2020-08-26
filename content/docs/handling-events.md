---
id: handling-events
title: Gérer les événements
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

La gestion des événements pour les éléments React est très similaire à celle des éléments du DOM. Il y a tout de même quelques différences de syntaxe :

* Les événements de React sont nommés en `camelCase` plutôt qu’en minuscules.
* En JSX on passe une fonction comme gestionnaire d'événements plutôt qu’une chaîne de caractères.

Par exemple, le HTML suivant :

```html
<button onclick="activateLasers()">
  Activer les lasers
</button>
```

est légèrement différent avec React:

```js{1}
<button onClick={activateLasers}>
  Activer les lasers
</button>
```

Autre différence importante : en React, on ne peut pas renvoyer `false` pour empêcher le comportement par défaut. Vous devez appeler explicitement `preventDefault`. Par exemple, en HTML, pour annuler le comportement par défaut des liens qui consiste à ouvrir une nouvelle page, vous pourriez écrire :

```html
<a href="#" onclick="console.log('Le lien a été cliqué.'); return false">
  Clique ici
</a>
```

En React, ça pourrait être :

```js{2-5,8}
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('Le lien a été cliqué.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Clique ici
    </a>
  );
}
```

Ici, `e` est un événement synthétique. React le définit en suivant les [spécifications W3C](https://www.w3.org/TR/DOM-Level-3-Events/), afin que vous n'ayez pas à vous préoccuper de la compatibilité entre les navigateurs. Les événements React ne fonctionnent pas tout à fait comme les événements natifs. Pour en apprendre davantage, consultez le guide de référence de [`SyntheticEvent`](/docs/events.html).

Lorsque vous utilisez React, vous n'avez généralement pas besoin d'appeler la méthode `addEventListener` pour ajouter des écouteurs d'événements *(event listeners, NdT)* à un élément du DOM après que celui-ci est créé. À la place, on fournit l'écouteur lors du rendu initial de l'élément.

Lorsque vous définissez un composant en utilisant les [classes ES6](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes), il est d'usage que le gestionnaire d'événements soit une méthode de la classe. Par exemple, ce composant `Toggle` affiche un bouton qui permet à l'utilisateur de basculer l'état de "ON" à "OFF".

```js{6-8,11-15,19}
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // Cette liaison est nécéssaire afin de permettre
    // l'utilisation de `this` dans la fonction de rappel.
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

[**Essayer dans CodePen**](https://codepen.io/gaearon/pen/xEmzGg?editors=0010)

En JSX, vous devez être prudent·e avec l'utilisation de `this` dans les fonctions de rappel. En JavaScript, les méthodes de classes ne sont pas [liées](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function/bind) par défaut. Si vous oubliez de lier `this.handleClick` et l'utilisez dans `onClick`, `this` sera `undefined` quand la fonction sera appelée.

Ce n'est pas un comportement spécifique à React, ça fait partie du [fonctionnement normal des fonctions en JavaScript](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/). En général, si vous faites référence à une méthode sans l’appeler avec `()`, comme dans `onClick={this.handleClick}`, vous devriez lier cette méthode.

Si vous ne souhaitez pas utiliser `bind`, vous avez deux alternatives possibles. Si vous avez l'habitude d'utiliser la [syntaxe des champs de classes](https://babeljs.io/docs/plugins/transform-class-properties/), qui est encore expérimentale, vous pourriez l’utiliser pour lier les fonctions de rappel :

```js{2-6}
class LoggingButton extends React.Component {
  // Cette syntaxe nous assure que `this` est bien lié dans la méthode handleClick.
  // Attention : cette syntaxe est encore *expérimentale*.
  handleClick = () => {
    console.log('this vaut :', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Clique ici
      </button>
    );
  }
}
```

Cette syntaxe est activée par défaut dans [Create React App](https://github.com/facebookincubator/create-react-app).

Si vous n'utilisez pas la syntaxe des champs de classe, vous pouvez utiliser les [fonctions fléchées](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Fonctions/Fonctions_fléchées) pour les fonctions de rappel.

```js{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this vaut :', this);
  }

  render() {
    // Cette syntaxe nous assure que `this` est bien lié dans la méthode handleClick
    return (
      <button onClick={() => this.handleClick()}>
        Clique ici
      </button>
    );
  }
}
```

Cette syntaxe n’est toutefois pas sans défauts, car elle crée une nouvelle fonction de rappel à chaque affichage de `LoggingButton`. Dans la plupart des cas ce n’est pas gênant. Néanmoins, si cette fonction était passée comme  prop à des composants plus bas dans l’arbre, ces composants risqueraient de faire des ré-affichages superflus. Nous recommandons donc, en règle générale, de lier ces méthodes dans le constructeur ou d’utiliser un champ de classe afin d'éviter ce genre de  problèmes de performances.

## Passer des arguments à un gestionnaire d'événements {#passing-arguments-to-event-handlers}

Au sein d'une boucle, il est courant de vouloir passer un argument supplémentaire à un gestionnaire d'événements. Par exemple, si `id` représente la ligne sélectionnée, on peut faire au choix :

```js
<button onClick={(e) => this.deleteRow(id, e)}>Supprimer la ligne</button>
<button onClick={this.deleteRow.bind(this, id)}>Supprimer la ligne</button>
```

Les lignes précédentes sont équivalentes et utilisent respectivement les [fonctions fléchées](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Fonctions/Fonctions_fléchées) et [`Function.prototype.bind`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function/bind).

Dans les deux cas, l'argument `e` represente l'événement React qui sera passé en second argument après l'ID. Avec une fonction fléchée, nous devons passer l'argument explicitement, alors qu'avec `bind` tous les arguments sont automatiquement transmis.
