---
id: handling-events
title: Gestion des événements
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

La gestion des événements des éléments dans React est très similaire à celle des éléments dans le DOM. Cependant il y a quelques différences de syntaxe :

* Les événements de React sont nommées en "camelCase" au lieu de "lowercase".
* Grâce à JSX on passe une fonction au gestionnaire d'événement au lieu d'une simple chaine de caractères.

Par exemple, l'écriture en HTML:

```html
<button onclick="activateLasers()">
  Activer les lasers
</button>
```

est sensiblement différente dans React:

```js{1}
<button onClick={activateLasers}>
  Activer les lasers
</button>
```

Le fait de ne pas pouvoir retourner la valeur `false` afin d'éviter le comportement par défaut en React est une autre difference. Vous devrez alors appeler explicitement `preventDefault`. Par exemple en HTML, afin d'éviter le comportement par défaut lors de l'ouverture de lien, vous devez écrire:

```html
<a href="#" onclick="console.log('Le lien a été cliqué.'); return false">
  Clique ici
</a>
```

En React, cela pourrait être:

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

Ici, `e` est un événement synthétique. React definit cette événement synthétique d'après les [specifications W3C](https://www.w3.org/TR/DOM-Level-3-Events/), ainsi vous n'avez pas besoin de vous préoccupez de la compatibilité entre les navigateurs. Pour allez plus loin regardez la page [`SyntheticEvent`](/docs/events.html) de la documentation.

Lorsque vous utilisez React, vous n'avez généralement pas besoins d'appeler la méthode `addEventListener` pour ajouter des écouteurs d'événements (Event Listener, NdT) à un élément du DOM après que celui-ci soit créé. À la place, on fournit l'écouteur lorsque que l'élément est initiallement rendu.

Lorsque vous definissez un composant en utilisant les [classes ES6](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes), il est d'usage que le gestionnaire d'événement soit une méthode de la classe. Par exemple, le composant `Toggle` rend un bouton qui permet à l'utilisateur de basculer l'état de "ON" à "OFF".

```js{6,7,10-14,18}
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // Cette liaison est nécéssaire afin de permettre l'utilisation de `this` dans la fonction de rappel.
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

[**Essayez-le dans CodePen**](http://codepen.io/gaearon/pen/xEmzGg?editors=0010)

En JSX, vous devez être prudent avec l'utilisation de `this` dans les fonctions de rappels. En JavaScript, les méthodes de classes ne sont pas [liées](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind) par défaut (Dans la suite de l'article, pour des raisons de concision, nous utiliserons le terme générique anglais bind, NdT). Si vous oubliez de bind `this.handleClick` et si vous l'utilisez dans `onClick`, `this` sera `undefined` quand la fonction sera appelée.

Ce n'est pas un comportement spécifique à React, cela fait en effet partie du [fonctionnement général des fonctions en JavaScript](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/). En général, si vous faites références à une méthode sans `()`, par exemple `onClick={this.handleClick}`, vous devriez utiliser une liaison de données.

Si vous ne souhaitez pas utiliser `bind`, vous avez alors deux solutions. Si vous avez l'habitude d'utiliser la [syntaxe des champs de classes](https://babeljs.io/docs/plugins/transform-class-properties/), qui sont à l'état experimental, vous pourriez alors les utiliser pour faire la liaison avec les fonctions de rappels.

```js{2-6}
class LoggingButton extends React.Component {
  // Cette syntaxe nous assure que `this` est bien lié avec la méthode handleClick.
  // Attention: cette syntaxe est encore à l'état *experimental*.
  handleClick = () => {
    console.log('Voici:', this);
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

Cette syntaxe est activé par défaut dans [Create React App](https://github.com/facebookincubator/create-react-app).

Si vous n'utilisez pas la syntaxe des variables de classe, vous pouvez utiliser les [fonctions fléchées](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) dans la fonction de rappel.

```js{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('Voici:', this);
  }

  render() {
    // Cette syntaxe nous assure que `this` est bien lié avec la méthode handleClick.
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Clique ici
      </button>
    );
  }
}
```

Cependant cette syntaxe pose un problème car elle créer une nouvelle fonction de rappel à chaque rendu de `LoggingButton`. Dans la plupart des cas c'est correct. Néanmoins, si la fonction de rappel est passée comme une prop à un composant inférieur, le composant peut produire un rendu supplémentaire. Nous recommandons donc la plupart du temps, l'utilisation de liaison de données dans le constructeur ou l'utilisation d'une variable de classe afin d'eviter des problèmes de performances.

## Passage d'arguments à un gestionnaire d'événements {#passing-arguments-to-event-handlers}

A l'interieur d'une boucle, il est courant de passer un paramètre supplementaire à un gestionnaire d'événement. Par exemple, si `id` represente la ligne selectionnée, les deux solutions suivantes fonctionnent:

```js
<button onClick={(e) => this.deleteRow(id, e)}>Supprimer la ligne</button>
<button onClick={this.deleteRow.bind(this, id)}>Supprimer la ligne</button>
```

Les lignes précédentes sont équivalentes et utilisent respectivement les [fonctions fléchées](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) et [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind).

Dans les deux cas, l'argument `e` represente l'évènement React qui sera passé en second paramètre après l'ID. Avec une fonction fléchée, nous devons passer l'argument explicitement, alors qu'avec `bind` tous les arguments sont automatiquement transmis.