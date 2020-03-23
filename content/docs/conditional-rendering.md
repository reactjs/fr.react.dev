---
id: conditional-rendering
title: Affichage conditionnel
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
  - "tips/false-in-jsx.html"
---

En React, vous pouvez concevoir des composants distincts qui encapsulent le comportement voulu. Vous pouvez alors n’afficher que certains d'entre eux, suivant l'état de votre application.

L’affichage conditionnel en React fonctionne de la même façon que les conditions en Javascript. On utilise l'instruction Javascript [`if`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Instructions/if...else) ou l’[opérateur ternaire](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Opérateurs/L_opérateur_conditionnel) pour créer des éléments représentant l'état courant, et on laisse React mettre à jour l'interface utilisateur (UI) pour qu’elle corresponde.

Considérons ces deux composants :

```js
function UserGreeting(props) {
  return <h1>Bienvenue !</h1>;
}

function GuestGreeting(props) {
  return <h1>Veuillez vous inscrire.</h1>;
}
```

Nous allons créer un composant `Greeting` qui affiche un de ces deux composants, selon qu’un utilisateur est connecté ou non :

```javascript{3-7,11,12}
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // Essayez de changer ça vers isLoggedIn={true} :
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

Cet exemple affiche un message différent selon la valeur de la prop `isLoggedIn`.

### Variables d'éléments {#element-variables}

Vous pouvez stocker les éléments dans des variables. Ça vous aide à afficher de façon conditionnelle une partie du composant tandis que le reste ne change pas.

Prenons ces deux nouveaux composants, qui représentent les boutons de Déconnexion et de Connexion :

```js
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Connexion
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Déconnexion
    </button>
  );
}
```


Dans l'exemple ci-dessous, nous allons créer un [composant à état](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) appelé `LoginControl`.

Il affichera soit `<LoginButton />`, soit `<LogoutButton />`, selon son état courant. Il affichera aussi un `<Greeting />` de l'exemple précédent :

```javascript{20-25,29,30}
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

[**Essayer sur  CodePen**](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

Même si déclarer une variable et utiliser une instruction `if` reste une bonne façon d’afficher conditionnellement un composant, parfois vous voudrez peut-être utiliser une syntaxe plus concise. Nous allons voir, ci-dessous, plusieurs façons d'utiliser des conditions à la volée en JSX.

### Condition à la volée avec l'opérateur logique `&&` {#inline-if-with-logical--operator}

Vous pouvez [utiliser n’importe quelle expression dans du JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) en l’enveloppant dans des accolades. Ça vaut aussi pour l'opérateur logique Javascript `&&`. Il peut être pratique pour inclure conditionnellement un élément :

```js{6-10}
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Bonjour !</h1>
      {unreadMessages.length > 0 &&
        <h2>
          Vous avez {unreadMessages.length} message(s) non-lu(s).
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

Ça fonctionne parce qu'en JavaScript, `true && expression` est toujours évalué à `expression`, et `false && expression` est toujours évalué à `false`.

Du coup, si la condition vaut `true`, l'élément juste après `&&` sera affiché. Si elle vaut `false`, React va l'ignorer et le sauter.

### Alternative à la volée avec opérateur ternaire {#inline-if-else-with-conditional-operator}

Une autre méthode pour l’affichage conditionnel à la volée d'éléments consiste à utiliser l'opérateur ternaire Javascript [`condition ? trueValue : falseValue`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Opérateurs/L_opérateur_conditionnel).

Dans l'exemple ci-dessous, on l'utilise pour afficher conditionnellement un bloc de texte.

```javascript{5}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      L’utilisateur <b>{isLoggedIn ? 'est actuellement' : 'n’est pas'}</b> connecté.
    </div>
  );
}
```

On peut aussi l’utiliser pour des expressions plus longues, même si c'est moins clair :

```js{5,7,9}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn
        ? <LogoutButton onClick={this.handleLogoutClick} />
        : <LoginButton onClick={this.handleLoginClick} />
      }
    </div>
  );
}
```

Tout comme en Javascript, c'est à vous de choisir un style approprié selon les préférences de lisibilité en vigueur pour vous et votre équipe. Souvenez-vous aussi que chaque fois que des conditions deviennent trop complexes, c'est peut-être le signe qu’il serait judicieux d’en [extraire un composant](/docs/components-and-props.html#extracting-components).

### Empêcher l’affichage d’un composant {#preventing-component-from-rendering}

Dans de rares cas, vous voudrez peut-être qu'un composant se masque alors même qu'il figure dans le rendu d’un autre composant. Pour ce faire, il suffit de renvoyer `null` au lieu de son affichage habituel.

Dans l'exemple ci-dessous, `<WarningBanner />` s’affichera en fonction de la valeur de la prop `warn`. Si la valeur est `false`, le composant ne s’affiche pas :

```javascript{2-4,29}
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Attention !
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Masquer' : 'Afficher'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

[**Essayer sur on CodePen**](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

Renvoyer `null` depuis la méthode `render` d'un composant n'affecte pas l'appel aux méthodes du cycle de vie du composant. Par exemple, `componentDidUpdate` sera quand même appelée.
