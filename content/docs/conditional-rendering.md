---
id: conditional-rendering
title: Rendu conditionnel
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
  - "tips/false-in-jsx.html"
---

En React, vous pouvez concevoir des composants distincts qui encapsulent le comportement voulu. Ensuite vous pouvez rendre seulement certains d'entre eux, suivant l'état de votre application.

Le rendu conditionel en React fonctionne de la même façon que les conditions en Javascript. On utilise l'opérateur Javascript [`if`](https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference/Statements/if...else) ou le [opérateur conditionnel](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) pour créer des éléments représentant l'état courrant, et on laisse à React le rôle de mettre à jour l'UI.

Considérons ces deux composants :

```js
function UserGreeting(props) {
  return <h1>Bienvenue!</h1>;
}

function GuestGreeting(props) {
  return <h1>Veuillez vous inscrire.</h1>;
}
```

Nous allons créer un composant `Greeting` qui affiche un de ces deux composants, suivant si un utilisateur est connecté ou non :

```javascript{3-7,11,12}
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // Try changing to isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

Cet exemple affiche un message différent suivant la valeur de la propriété `isLoggedIn`.

### Variables d'éléments {#element-variables}

Vous pouvez utiliser des variables pour stocker des éléments. Cela peut vous aider à rendre de façon conditonnelle une partie du composant pendant que le reste ne change pas.

Considérons ces deux nouveaux composants représentant les boutons de Logout et Login :

```js
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}
```


Dans l'exemple ci-dessous, nous allons créer un [composant à état](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) appelé `LoginControl`.

Il va afficher `<LoginButton />` ou `<LogoutButton />` suivant son état actuel. Il va aussi afficher `<Greeting />` depuis l'exemple précédent :

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

Déclarer une variable et utiliser une déclaration en `if` est une bonne façon de rendre un composant conditionnellement, parfois vous voudriez utiliser une syntaxe plus courte. Nous allons voir, ci-dessous, plusieurs façons d'utiliser les conditions inlines de JSX.

### Inline If avec l'opérateur logique && {#inline-if-with-logical--operator}

Vous pouvez [intégrer des expressions dans JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) en les enveloppant dans des accolades. Cela inclut l'opérateur Javascript logique `&&`. Il peut être pratique pour inclure conditionnellement un élément :

```js{6-10}
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
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

De plus, si la condition est `true`, l'élément juste après `&&` va être rendu. Si c'est `false`, React va l'ignorer et le passer.

### Inline If-Else avec opérateur conditionnel {#inline-if-else-with-conditional-operator}

Une autre méthode pour le rendu contionnel d'éléments inline est d'utiliser l'opérateur conditionnel Javascript [`condition ? true : false`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator).

Dans l'exemple ci-dessous, on l'utilise pour rendre conditionnellement un bloc de texte.

```javascript{5}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}
```

Cela peut aussi être utilisé pour de plus larges expressions, même si c'est moins clair :

```js{5,7,9}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? (
        <LogoutButton onClick={this.handleLogoutClick} />
      ) : (
        <LoginButton onClick={this.handleLoginClick} />
      )}
    </div>
  );
}
```

Tout comme en Javascript, c'est à vous de choisir un style approprié suivant ce que vous et votre équipe considérez comme plus facilement compréhensible. Rappelez vous aussi que lorsque les conditions deviennent trop complexes, c'est peut être le bon moment pour penser à [extraire un composant](/docs/components-and-props.html#extracting-components).

### Empêcher qu'un Composant soit rendu {#preventing-component-from-rendering}

Dans de rare cas, vous voulez qu'un composant soit capable de se masquer même s'il est rendu par un autre composant. Pour ce faire, il suffit de retourner `null` à la place de son rendu.

Dans l'exemple ci-dessous, `<WarningBanner />` est rendu suivant la valeur de la propriété appelée `warn`. Si la valeur de la propriété est `false`, alors le composant n'est pas rendu :

```javascript{2-4,29}
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
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
          {this.state.showWarning ? 'Hide' : 'Show'}
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

Retourner `null` depuis la méthode `render` d'un composant n'affecte pas l'appel aux méthodes du cycle de vie du composant. Par exemple, `componentDidUpdate` sera toujours appelé.
