---
title: Component
---

<Pitfall>

Nous vous conseillons de définir vos composants au moyen de fonctions plutôt que de classes. [Voyez comment migrer](#alternatives).

</Pitfall>

<Intro>

`Component` est la classe de base pour les composants React définis à l'aide de [classes JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes). Les composants à base de classes restent pris en charge par React, mais nous les déconseillons pour tout nouveau code.

```js
class Greeting extends Component {
  render() {
    return <h1>Salut {this.props.name} !</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `Component` {/*component*/}

Pour définir un composant React sous forme de classe, étendez la classe `Component` fournie et définissez sa [méthode `render`](#render) :

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Salut {this.props.name} !</h1>;
  }
}
```

Seule la méthode `render` est requise, les autres méthodes sont optionnelles.

[Voir d'autres exemples ci-dessous](#usage).

---

### `context` {/*context*/}

Le [contexte](/learn/passing-data-deeply-with-context) d'un composant à base de classe est mis à disposition dans `this.context`.  Il n'est disponible que si vous précisez *quel* contexte vous souhaitez récupérer en utilisant [`static contextType`](#static-contexttype) (approche plus récente) ou [`static contextTypes`](#static-contexttypes) (approche dépréciée).

Un composant à base de classe ne peut lire qu'un contexte à la fois.

```js {2,5}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

```

<Note>

La lecture de `this.context` dans des composants à base de classes est équivalente à un appel à [`useContext`](/reference/react/useContext) dans les fonctions composants.

[Voyez comment migrer](#migrating-a-component-with-context-from-a-class-to-a-function).

</Note>

---

### `props` {/*props*/}

Les props passées à un composant à base de classe sont mises à disposition dans `this.props`.

```js {3}
class Greeting extends Component {
  render() {
    return <h1>Salut {this.props.name} !</h1>;
  }
}

<Greeting name="Clara" />
```

<Note>

La lecture de `this.props` dans des composants à base de classes est équivalente à la [déclaration des props](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component) dans des fonctions composants.

[Voyez comment migrer](#migrating-a-simple-component-from-a-class-to-a-function).

</Note>

---

### `refs` {/*refs*/}

<Deprecated>

Cette API sera retirée d'une future version majeure de React. [Utilisez plutôt `createRef`](/reference/react/createRef).

</Deprecated>

Vous permet d'accéder à des [refs textuelles historiques](https://legacy.reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) pour ce composant.

---

### `state` {/*state*/}

L'état d'un composant à base de classe est mis à disposition dans `this.state`. La champ `state` doit être un objet. Ne modifiez pas l'état directement.  Si vous souhaitez modifier l'état, appelez `setState` avec le nouvel état.

```js {2-4,7-9,18}
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
        Prendre de l’âge
        </button>
        <p>Vous avez {this.state.age} ans.</p>
      </>
    );
  }
}
```

<Note>

La définition de `state` dans les composants à base de classes est équivalente à l'appel de [`useState`](/reference/react/useState) dans les fonctions composants.

[Voyez comment migrer](#migrating-a-component-with-state-from-a-class-to-a-function).

</Note>

---

### `constructor(props)` {/*constructor*/}

Le [constructeur](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes/constructor) est exécuté avant le *montage* (l'ajout dans le doM) de votre composant. En général, vous n'utilisez un constructeur dans React que pour deux raisons.  Il vous permet de déclarer votre état puis de [lier](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_objects/Function/bind) certaines de vos méthodes à votre instance :

```js {2-6}
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
```

Si vous utilisez une syntaxe JavaScript moderne, vous aurez rarement besoin des constructeurs.  Vous pouvez plutôt réécrire le code ci-dessus en utilisant des [initialiseurs de champs d'instance](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes/Public_class_fields) qui sont pris en charge par tous les navigateurs modernes et par des outils comme [Babel](https://babeljs.io/) :

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

Un constructeur ne devrait contenir aucun effet de bord ni aucun abonnement.

#### Paramètres {/*constructor-parameters*/}

* `props` : les props initiales du composant.

#### Valeur renvoyée {/*constructor-returns*/}

`constructor` ne devrait rien renvoyer.

#### Limitations {/*constructor-caveats*/}

* Ne lancez aucun effet de bord et n'effectuez aucun abonnement dans le constructeur.  Utilisez plutôt [`componentDidMount`](#componentdidmount) pour ça.

* Dans un constructeur, vous devez impérativement appeler `super(props)` avant toute autre instruction.  Si vous ne le faites pas, `this.props` sera `undefined` pendant l'exécution du constructeur, ce qui peut être déroutant et causer des bugs.

* Le constructeur est le seul endroit où vous pouvez affecter une valeur directement à [`this.state`](#state).  Dans toutes les autres méthodes, vous devez plutôt utiliser [`this.setState()`](#setstate). N'appelez pas `setState` dans le constructeur.

* Lorsque vous faites du [rendu côté serveur](/reference/react-dom/server), le constructeur sera exécuté côté serveur aussi, suivi de la méthode [`render`](#render). En revanche, les méthodes de cycle de vie telles que `componentDidMount` ou `componentWillUnmount` ne seront pas exécutées côté serveur.

* En [mode strict](/reference/react/StrictMode), React appellera votre `constructor` deux fois en développement et jettera une des instances.  Ça vous permet de repérer des effets de bords involontaires qui doivent être sortis du `constructor`.

<Note>

Il n'y a pas d'équivalent réel du `constructor` dans les fonctions composants.  Pour déclarer un état dans une fonction composant, utilisez [`useState`](/reference/react/useState).  Pour éviter de recalculer l'état initial, [passez une fonction à `useState`](/reference/react/useState#avoiding-recreating-the-initial-state).

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

Si vous définissez `componentDidCatch`, React l'appellera lorsqu'un composant descendant lève une erreur lors du rendu.  Ça vous permettra de loguer l'erreur à un service de supervision en production.

Elle est en général utilisée conjointement avec [`static getDerivedStateFromError`](#static-getderivedstatefromerror), qui vous permet de mettre à jour l'état en réaction à une erreur afin d'afficher un message d'erreur à l'utilisateur.  Un composant doté de ces méthodes est ce qu'on appelle un *périmètre d'erreur*.

[Voir un exemple](#catching-rendering-errors-with-an-error-boundary).

#### Paramètres {/*componentdidcatch-parameters*/}

* `error` : l'erreur qui a été levée.  En pratique il s'agira généralement d'une instance d'[`Error`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error), mais ce n'est pas garanti parce que JavaScript autorise un [`throw`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/throw) de n'importe quelle valeur, y compris des chaînes de caractères et même `null`.

* `info` : un objet contenant des informations complémentaires sur l'erreur. Son champ `componentStack` contient une pile d'appel de rendu avec le composant ayant levé l'erreur, ainsi que les noms et emplacements dans le code source de tous ses composants parents. En production, les noms des composants seront minifiés. Si vous mettez en place un signalement d'erreurs en production, vous pouvez décoder la pile d'appels de rendu grâce aux *sorrcemaps*, comme pour les piles d'appels d'erreurs JavaScript usuelles.

#### Valeur renvoyée {/*componentdidcatch-returns*/}

`componentDidCatch` ne devrait rien renvoyer.

#### Limitations {/*componentdidcatch-caveats*/}

* Par le passé, on appelait couramment `setState` dans `componentDidCatch` pour mettre à jour l'UI et afficher un message d'erreur de remplacement.  C'est dépéréié en faveur d'une définition de [`static getDerivedStateFromError`](#static-getderivedstatefromerror).

* Les *builds* de production et de développement diffèrent légèrement dans leur gestion de l'erreur par `componentDidCatch`. En développement, les erreurs se propageront jusqu'à `window`, ce qui signifie que `window.onerror` et `window.addEventListener('error', callback)` intercepteront les erreurs attrapées par `componentDidCatch`. En production, les erreurs ne seront pas propagées, de sorte que les gestionnaires d'erreurs placés plus haut dans l'arbre ne recevront que les erreurs qui n'auront pas été expressément interceptées par `componentDidCatch`.

<Note>

Il n'y a pas encore d'équivalent direct à `componentDidCatch` dans les fonctions composants.  Si vous souhaitez éviter de créer des composants à base de classes, écrivez un unique composant `ErrorBundary` comme ci-dessus et utilisez-le dans toute votre appli.  Vous pouvez aussi utiliser le module [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) qui fait ça (et davantage) pour vous.

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

Si vous définissez la méthode `componentDidMount`, React l'appellera lorsque votre composant est ajouté au DOM (*monté*). C'est l'endroit classique pour démarrer un chargement de données, souscrire des abonnements, ou manipuler des nœuds du DOM.

Si vous implémentez `componentDidMount`, vous aurez généralement besoin d'implémenter d'autres méthodes de cycle de vie pour éviter les bugs. Si par exemple `componentDidMount` lit de l'état et des props, vous devrez aussi implémenter [`componentDidUpdate`](#componentdidupdate) pour en gérer les modifications, et [`componentWillUnmount`](#componentwillunmount) pour nettoyer toute mise en place effectuée par `componentDidMount`.

```js {6-8}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Voir d'autres exemples](#adding-lifecycle-methods-to-a-class-component).

#### Paramètres {/*componentdidmount-parameters*/}

`componentDidMount` ne prend aucun paramètre.

#### Valeur renvoyée {/*componentdidmount-returns*/}

`componentDidMount` ne devrait rien renvoyer.

#### Limitations {/*componentdidmount-caveats*/}

- En [mode strict](/reference/react/StrictMode), en développement React appellera `componentDidMount`, puis appellera immédiatement [`componentWillUnmount`](#componentwillunmount) et rappellera `componentDidMount` une seconde fois. Ça vous aider à remarquer un oubli d'implémentation de `componentWillUnmount`, ou un « miroir » insuffisant dans celle-ci de la logique de `componentDidMount`.

- Même si vous pourriez appeler immédiatement [`setState`](#setstate) dans `componentDidMount`, il est préférable de l'éviter autant que possible.  Ça déclencherait un rendu supplémentaire, qui arriverait toutefois avant que le navigateur n'ait mis à jour l'affichage. Ça garantit que même si la méthode [`render`](#render) est bien appelée deux fois dans un tel cas, l'utilisateur ne verra pas l'état intermédiaire.  Utilisez cette approche avec précaution, parce qu'elle nuit aux performances.  La plupart du temps, vous devriez pouvoir plutôt définir l'état initial dans le [`constructor`](#constructor). Ça reste toutefois utile pour des cas comme les boîtes de dialogue modales et les infobulles, qui nécessitent une mesure de nœud DOM avant de pouvoir afficher quelque chose qui dépend de leur taille ou de leur position.

<Note>

Dans de nombreux cas, définir `componentDidMount`, `componentDidUpdate` et `componentWillUnmount` conjointement dans des composants à base de classes revient à un simple appel à [`useEffect`](/reference/react/useEffect) dans les fonctions composants.  Dans les rares cas où il est important d'exécuter du code avant l'affichage par le navigateur, un meilleur équivalent serait [`useLayoutEffect`](/reference/react/useLayoutEffect).

[Voyez comment migrer](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function).

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

Si vous définissez la méthode `componentDidUpdate`, React l'appellera immédiatement après que le composant a recalculé son rendu et mis à jour ses props et son état.  Cette méthode n'est pas appelée lors du rendu initial.

Vous pouvez l'utiliser pour manipuler le DOM après une mise à jour. C'est également un endroit courant pour des requêtes réseau, du moment que vous comparez les nouvelles props aux anciennes (une requête réseau pourrait par exemple être superflue si les props n'ont pas bougé).  En général, vous l'utiliserez conjointement à [`componentDidMount`](#componentdidmount) et [`componentWillUnmount`](#componentwillunmount) :

```js {10-18}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Voir d'autres exemples](#adding-lifecycle-methods-to-a-class-component).

#### Paramètres {/*componentdidupdate-parameters*/}

* `prevProps` : les props avant la mise à jour. Comparez `prevProps` à [`this.props`](#props) pour déterminer ce qui a changé.

* `prevState` : l'état avant la mise à jour. Comparez `prevState` à [`this.state`](#state) pour déterminer ce qui a changé.

* `snapshot` : si vous avez implémenté [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate), `snapshot` contiendra la valeur que vous aviez renvoyée depuis cette méthode. Dans les autres cas, ça vaudra `undefined`.

#### Valeur renvoyée {/*componentdidupdate-returns*/}

`componentDidUpdate` ne devrait rien renvoyer.

#### Limitations {/*componentdidupdate-caveats*/}

- `componentDidUpdate` ne sera pas appelée si [`shouldComponentUpdate`](#shouldcomponentupdate) est définie et renvoie `false`.

- La logique dans `componentDidUpdate` devrait généralement être entourée de conditions comparant `this.props` et `prevProps`, ainsi que `this.state` et `prevState`. Faute de quoi vous risquez des boucles de rendu infinies.

- Même si vous pourriez appeler immédiatement [`setState`](#setstate) dans `componentDidMount`, il est préférable de l'éviter autant que possible.  Ça déclencherait un rendu supplémentaire, qui arriverait toutefois avant que le navigateur n'ait mis à jour l'affichage. Ça garantit que même si la méthode [`render`](#render) est bien appelée deux fois dans un tel cas, l'utilisateur ne verra pas l'état intermédiaire.  Cette approche peut nuire aux performances, mais reste toutefois utile pour des cas comme les boîtes de dialogue modales et les infobulles, qui nécessitent une mesure de nœud DOM avant de pouvoir afficher quelque chose qui dépend de leur taille ou de leur position.

<Note>

Dans de nombreux cas, définir `componentDidMount`, `componentDidUpdate` et `componentWillUnmount` conjointement dans des composants à base de classes revient à un simple appel à [`useEffect`](/reference/react/useEffect) dans les fonctions composants.  Dans les rares cas où il est important d'exécuter du code avant l'affichage par le navigateur, un meilleur équivalent serait [`useLayoutEffect`](/reference/react/useLayoutEffect).

[Voyez comment migrer](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function).

</Note>

---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

Cette API a été renommée de `componentWillMount` en [`UNSAFE_componentWillMount`](#unsafe_componentwillmount). L'ancien nom est déprécié.  Dans les futures versions de React, seul le nouveau nom fonctionnera.

Exécutez le [*codemod* `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) pour mettre automatiquement vos composants à jour.

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

Cette API a été renommée de `componentWillReceiveProps` en [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops). L'ancien nom est déprécié.  Dans les futures versions de React, seul le nouveau nom fonctionnera.

Exécutez le [*codemod* `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) pour mettre automatiquement vos composants à jour.

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

Cette API a été renommée de `componentWillUpdate` en [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate). L'ancien nom est déprécié.  Dans les futures versions de React, seul le nouveau nom fonctionnera.

Exécutez le [*codemod* `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) pour mettre automatiquement vos composants à jour.

</Deprecated>

---

### `componentWillUnmount()` {/*componentwillunmount*/}

Si vous définissez la méthode `componentWillUnmount`, React l'appellera avant que votre composant soit retiré du DOM (*démonté*).  C'est un endroit courant pour annuler les chargements de données et vous désabonner.

La logique dans `componentWillUnmount` devrait agir « en miroir » de celle dans [`componentDidMount`](#componentdidmount). Si par exemple `componentDidMount` souscrit un abonnement, `componentWillUnmount` devrait faire le désabonnement associé. Si la logique de nettoyage dans votre `componentWillUnmount` lit des props ou  de l'état, vous aurez généralement besoin d'implémenter également [`componentDidUpdate`](#componentdidupdate) pour nettoyer les ressources (tels que les abonnements) correspondant aux anciennes props et anciens états.

```js {20-22}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Voir d'autres exemples](#adding-lifecycle-methods-to-a-class-component).

#### Paramètres {/*componentwillunmount-parameters*/}

`componentWillUnmount` ne prend aucun paramètre.

#### Valeur renvoyée {/*componentwillunmount-returns*/}

`componentWillUnmount` ne devrait rien renvoyer.

#### Limitations {/*componentwillunmount-caveats*/}

- En [mode strict](/reference/react/StrictMode), en développement React appellera `componentDidMount`, puis appellera immédiatement [`componentWillUnmount`](#componentwillunmount) et rappellera `componentDidMount` une seconde fois. Ça vous aider à remarquer un oubli d'implémentation de `componentWillUnmount`, ou un « miroir » insuffisant dans celle-ci de la logique de `componentDidMount`.

<Note>

Dans de nombreux cas, définir `componentDidMount`, `componentDidUpdate` et `componentWillUnmount` conjointement dans des composants à base de classes revient à un simple appel à [`useEffect`](/reference/react/useEffect) dans les fonctions composants.  Dans les rares cas où il est important d'exécuter du code avant l'affichage par le navigateur, un meilleur équivalent serait [`useLayoutEffect`](/reference/react/useLayoutEffect).

[Voyez comment migrer](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function).

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

Forces a component to re-render.

Usually, this is not necessary. If your component's [`render`](#render) method only reads from [`this.props`](#props), [`this.state`](#state), or [`this.context`,](#context) it will re-render automatically when you call [`setState`](#setstate) inside your component or one of its parents. However, if your component's `render` method reads directly from an external data source, you have to tell React to update the user interface when that data source changes. That's what `forceUpdate` lets you do.

Try to avoid all uses of `forceUpdate` and only read from `this.props` and `this.state` in `render`.

#### Paramètres {/*forceupdate-parameters*/}

* **optional** `callback` If specified, React will call the `callback` you've provided after the update is committed.

#### Valeur renvoyée {/*forceupdate-returns*/}

`forceUpdate` does not return anything.

#### Limitations {/*forceupdate-caveats*/}

- If you call `forceUpdate`, React will re-render without calling [`shouldComponentUpdate`.](#shouldcomponentupdate)

<Note>

Reading an external data source and forcing class components to re-render in response to its changes with `forceUpdate` has been superseded by [`useSyncExternalStore`](/reference/react/useSyncExternalStore) in function components.

</Note>

---

### `getChildContext()` {/*getchildcontext*/}

<Deprecated>

Cette API sera retirée d'une future version majeure de React. [Utilisez plutôt `Context.Provider`](/reference/react/createContext#provider).

</Deprecated>

Lets you specify the values for the [legacy context](https://reactjs.org/docs/legacy-context.html) is provided by this component.

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

If you implement `getSnapshotBeforeUpdate`, React will call it immediately before React updates the DOM. It enables your component to capture some information from the DOM (e.g. scroll position) before it is potentially changed. Any value returned by this lifecycle method will be passed as a parameter to [`componentDidUpdate`.](#componentdidupdate)

For example, you can use it in a UI like a chat thread that needs to preserve its scroll position during updates:

```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

In the above example, it is important to read the `scrollHeight` property directly in `getSnapshotBeforeUpdate`. It is not safe to read it in [`render`](#render), [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops), or [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate) because there is a potential time gap between these methods getting called and React updating the DOM.

#### Paramètres {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`: Props before the update. Compare `prevProps` to [`this.props`](#props) to determine what changed.

* `prevState`: State before the update. Compare `prevState` to [`this.state`](#state) to determine what changed.

#### Valeur renvoyée {/*getsnapshotbeforeupdate-returns*/}

You should return a snapshot value of any type that you'd like, or `null`. The value you returned will be passed as the third argument to [`componentDidUpdate`.](#componentdidupdate)

#### Limitations {/*getsnapshotbeforeupdate-caveats*/}

- `getSnapshotBeforeUpdate` will not get called if [`shouldComponentUpdate`](#shouldcomponentupdate) is defined and returns `false`.

<Note>

At the moment, there is no equivalent to `getSnapshotBeforeUpdate` for function components. This use case is very uncommon, but if you have the need for it, for now you'll have to write a class component.

</Note>

---

### `render()` {/*render*/}

The `render` method is the only required method in a class component.

The `render` method should specify what you want to appear on the screen, for example:

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Salut {this.props.name} !</h1>;
  }
}
```

React may call `render` at any moment, so you shouldn't assume that it runs at a particular time. Usually, the `render` method should return a piece of [JSX](/learn/writing-markup-with-jsx), but a few [other return types](#render-returns) (like strings) are supported. To calculate the returned JSX, the `render` method can read [`this.props`](#props), [`this.state`](#state), and [`this.context`](#context).

You should write the `render` method as a pure function, meaning that it should return the same result if props, state, and context are the same. It also shouldn't contain side effects (like setting up subscriptions) or interact with the browser APIs. Side effects should happen either in event handlers or methods like [`componentDidMount`.](#componentdidmount)

#### Paramètres {/*render-parameters*/}

`render` does not take any parameters.

#### Valeur renvoyée {/*render-returns*/}

`render` can return any valid React node. This includes React elements such as `<div />`, strings, numbers, [portals](/reference/react-dom/createPortal), empty nodes (`null`, `undefined`, `true`, and `false`), and arrays of React nodes.

#### Limitations {/*render-caveats*/}

- `render` should be written as a pure function of props, state, and context. It should not have side effects.

- `render` will not get called if [`shouldComponentUpdate`](#shouldcomponentupdate) is defined and returns `false`.

- When [Strict Mode](/reference/react/StrictMode) is on, React will call `render` twice in development and then throw away one of the results. This helps you notice the accidental side effects that need to be moved out of the `render` method.

- There is no one-to-one correspondence between the `render` call and the subsequent `componentDidMount` or `componentDidUpdate` call. Some of the `render` call results may be discarded by React when it's beneficial.

---

### `setState(nextState, callback?)` {/*setstate*/}

Call `setState` to update the state of your React component.

```js {8-10}
class Form extends Component {
  state = {
    name: 'Taylor',
  };

  handleNameChange = (e) => {
    const newName = e.target.value;
    this.setState({
      name: newName
    });
  }

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <p>Salut {this.state.name}.
      </>
    );
  }
}
```

`setState` enqueues changes to the component state. It tells React that this component and its children need to re-render with the new state. This is the main way you'll update the user interface in response to interactions.

<Pitfall>

Calling `setState` **does not** change the current state in the already executing code:

```js {6}
function handleClick() {
  console.log(this.state.name); // "Taylor"
  this.setState({
    name: 'Robin'
  });
  console.log(this.state.name); // Still "Taylor"!
}
```

It only affects what `this.state` will return starting from the *next* render.

</Pitfall>

You can also pass a function to `setState`. It lets you update state based on the previous state:

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

You don't have to do this, but it's handy if you want to update state multiple times during the same event.

#### Paramètres {/*setstate-parameters*/}

* `nextState`: Either an object or a function.
  * If you pass an object as `nextState`, it will be shallowly merged into `this.state`.
  * If you pass a function as `nextState`, it will be treated as an _updater function_. It must be pure, should take the pending state and props as arguments, and should return the object to be shallowly merged into `this.state`. React will put your updater function in a queue and re-render your component. During the next render, React will calculate the next state by applying all of the queued updaters to the previous state.

* **optional** `callback`: If specified, React will call the `callback` you've provided after the update is committed.

#### Valeur renvoyée {/*setstate-returns*/}

`setState` does not return anything.

#### Limitations {/*setstate-caveats*/}

- Think of `setState` as a *request* rather than an immediate command to update the component. When multiple components update their state in response to an event, React will batch their updates and re-render them together in a single pass at the end of the event. In the rare case that you need to force a particular state update to be applied synchronously, you may wrap it in [`flushSync`,](/reference/react-dom/flushSync) but this may hurt performance.

- `setState` does not update `this.state` immediately. This makes reading `this.state` right after calling `setState` a potential pitfall. Instead, use [`componentDidUpdate`](#componentdidupdate) or the setState `callback` argument, either of which are guaranteed to fire after the update has been applied. If you need to set the state based on the previous state, you can pass a function to `nextState` as described above.

<Note>

Calling `setState` in class components is similar to calling a [`set` function](/reference/react/useState#setstate) in function components.

[See how to migrate.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

If you define `shouldComponentUpdate`, React will call it to determine whether a re-render can be skipped.

If you are confident you want to write it by hand, you may compare `this.props` with `nextProps` and `this.state` with `nextState` and return `false` to tell React the update can be skipped.

```js {6-18}
class Rectangle extends Component {
  state = {
    isHovered: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.position.x === this.props.position.x &&
      nextProps.position.y === this.props.position.y &&
      nextProps.size.width === this.props.size.width &&
      nextProps.size.height === this.props.size.height &&
      nextState.isHovered === this.state.isHovered
    ) {
      // Nothing has changed, so a re-render is unnecessary
      return false;
    }
    return true;
  }

  // ...
}

```

React calls `shouldComponentUpdate` before rendering when new props or state are being received. Defaults to `true`. This method is not called for the initial render or when [`forceUpdate`](#forceupdate) is used.

#### Paramètres {/*shouldcomponentupdate-parameters*/}

- `nextProps`: The next props that the component is about to render with. Compare `nextProps` to [`this.props`](#props) to determine what changed.
- `nextState`: The next state that the component is about to render with. Compare `nextState` to [`this.state`](#props) to determine what changed.
- `nextContext`: The next context that the component is about to render with. Compare `nextContext` to [`this.context`](#context) to determine what changed. Only available if you specify [`static contextType`](#static-contexttype) (modern) or [`static contextTypes`](#static-contexttypes) (legacy).

#### Valeur renvoyée {/*shouldcomponentupdate-returns*/}

Return `true` if you want the component to re-render. That's the default behavior.

Return `false` to tell React that re-rendering can be skipped.

#### Limitations {/*shouldcomponentupdate-caveats*/}

- This method *only* exists as a performance optimization. If your component breaks without it, fix that first.

- Consider using [`PureComponent`](/reference/react/PureComponent) instead of writing `shouldComponentUpdate` by hand. `PureComponent` shallowly compares props and state, and reduces the chance that you'll skip a necessary update.

- We do not recommend doing deep equality checks or using `JSON.stringify` in `shouldComponentUpdate`. It makes performance unpredictable and dependent on the data structure of every prop and state. In the best case, you risk introducing multi-second stalls to your application, and in the worst case you risk crashing it.

- Returning `false` does not prevent child components from re-rendering when *their* state changes.

- Returning `false` does not *guarantee* that the component will not re-render. React will use the return value as a hint but it may still choose to re-render your component if it makes sense to do for other reasons.

<Note>

Optimizing class components with `shouldComponentUpdate` is similar to optimizing function components with [`memo`.](/reference/react/memo) Function components also offer more granular optimization with [`useMemo`.](/reference/react/useMemo)

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

If you define `UNSAFE_componentWillMount`, React will call it immediately after the [`constructor`.](#constructor) It only exists for historical reasons and should not be used in any new code. Instead, use one of the alternatives:

- To initialize state, declare [`state`](#state) as a class field or set `this.state` inside the [`constructor`.](#constructor)
- If you need to run a side effect or set up a subscription, move that logic to [`componentDidMount`](#componentdidmount) instead.

[See examples of migrating away from unsafe lifecycles.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Paramètres {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount` does not take any parameters.

#### Valeur renvoyée {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount` should not return anything.

#### Limitations {/*unsafe_componentwillmount-caveats*/}

- `UNSAFE_componentWillMount` will not get called if the component implements [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) or [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- Despite its naming, `UNSAFE_componentWillMount` does not guarantee that the component *will* get mounted if your app uses modern React features like [`Suspense`.](/reference/react/Suspense) If a render attempt is suspended (for example, because the code for some child component has not loaded yet), React will throw the in-progress tree away and attempt to construct the component from scratch during the next attempt. This is why this method is "unsafe". Code that relies on mounting (like adding a subscription) should go into [`componentDidMount`.](#componentdidmount)

- `UNSAFE_componentWillMount` is the only lifecycle method that runs during [server rendering.](/reference/react-dom/server) For all practical purposes, it is identical to [`constructor`,](#constructor) so you should use the `constructor` for this type of logic instead.

<Note>

Calling [`setState`](#setstate) inside `UNSAFE_componentWillMount` in a class component to initialize state is equivalent to passing that state as the initial state to [`useState`](/reference/react/useState) in a function component.

</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

If you define `UNSAFE_componentWillReceiveProps`, React will call it when the component receives new props. It only exists for historical reasons and should not be used in any new code. Instead, use one of the alternatives:

- If you need to **run a side effect** (for example, fetch data, run an animation, or reinitialize a subscription) in response to prop changes, move that logic to [`componentDidUpdate`](#componentdidupdate) instead.
- If you need to **avoid re-computing some data only when a prop changes,** use a [memoization helper](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization) instead.
- If you need to **"reset" some state when a prop changes,** consider either making a component [fully controlled](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) or [fully uncontrolled with a key](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) instead.
- If you need to **"adjust" some state when a prop changes,** check whether you can compute all the necessary information from props alone during rendering. If you can't, use [`static getDerivedStateFromProps`](/reference/react/Component#static-getderivedstatefromprops) instead.

[See examples of migrating away from unsafe lifecycles.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

#### Paramètres {/*unsafe_componentwillreceiveprops-parameters*/}

- `nextProps`: The next props that the component is about to receive from its parent component. Compare `nextProps` to [`this.props`](#props) to determine what changed.
- `nextContext`: The next props that the component is about to receive from the closest provider. Compare `nextContext` to [`this.context`](#context) to determine what changed. Only available if you specify [`static contextType`](#static-contexttype) (modern) or [`static contextTypes`](#static-contexttypes) (legacy).

#### Valeur renvoyée {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps` should not return anything.

#### Limitations {/*unsafe_componentwillreceiveprops-caveats*/}

- `UNSAFE_componentWillReceiveProps` will not get called if the component implements [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) or [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- Despite its naming, `UNSAFE_componentWillReceiveProps` does not guarantee that the component *will* receive those props if your app uses modern React features like [`Suspense`.](/reference/react/Suspense) If a render attempt is suspended (for example, because the code for some child component has not loaded yet), React will throw the in-progress tree away and attempt to construct the component from scratch during the next attempt. By the time of the next render attempt, the props might be different. This is why this method is "unsafe". Code that should run only for committed updates (like resetting a subscription) should go into [`componentDidUpdate`.](#componentdidupdate)

- `UNSAFE_componentWillReceiveProps` does not mean that the component has received *different* props than the last time. You need to compare `nextProps` and `this.props` yourself to check if something changed.

- React doesn't call `UNSAFE_componentWillReceiveProps` with initial props during mounting. It only calls this method if some of component's props are going to be updated. For example, calling [`setState`](#setstate) doesn't generally trigger `UNSAFE_componentWillReceiveProps` inside the same component.

<Note>

Calling [`setState`](#setstate) inside `UNSAFE_componentWillReceiveProps` in a class component to "adjust" state is equivalent to [calling the `set` function from `useState` during rendering](/reference/react/useState#storing-information-from-previous-renders) in a function component.

</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}


If you define `UNSAFE_componentWillUpdate`, React will call it before rendering with the new props or state. It only exists for historical reasons and should not be used in any new code. Instead, use one of the alternatives:

- If you need to run a side effect (for example, fetch data, run an animation, or reinitialize a subscription) in response to prop or state changes, move that logic to [`componentDidUpdate`](#componentdidupdate) instead.
- If you need to read some information from the DOM (for example, to save the current scroll position) so that you can use it in [`componentDidUpdate`](#componentdidupdate) later, read it inside [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) instead.

[See examples of migrating away from unsafe lifecycles.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Paramètres {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`: The next props that the component is about to render with. Compare `nextProps` to [`this.props`](#props) to determine what changed.
- `nextState`: The next state that the component is about to render with. Compare `nextState` to [`this.state`](#state) to determine what changed.

#### Valeur renvoyée {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate` should not return anything.

#### Limitations {/*unsafe_componentwillupdate-caveats*/}

- `UNSAFE_componentWillUpdate` will not get called if [`shouldComponentUpdate`](#shouldcomponentupdate) is defined and returns `false`.

- `UNSAFE_componentWillUpdate` will not get called if the component implements [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) or [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- It's not supported to call [`setState`](#setstate) (or any method that leads to `setState` being called, like dispatching a Redux action) during `componentWillUpdate`.

- Despite its naming, `UNSAFE_componentWillUpdate` does not guarantee that the component *will* update if your app uses modern React features like [`Suspense`.](/reference/react/Suspense) If a render attempt is suspended (for example, because the code for some child component has not loaded yet), React will throw the in-progress tree away and attempt to construct the component from scratch during the next attempt. By the time of the next render attempt, the props and state might be different. This is why this method is "unsafe". Code that should run only for committed updates (like resetting a subscription) should go into [`componentDidUpdate`.](#componentdidupdate)

- `UNSAFE_componentWillUpdate` does not mean that the component has received *different* props or state than the last time. You need to compare `nextProps` with `this.props` and `nextState` with `this.state` yourself to check if something changed.

- React doesn't call `UNSAFE_componentWillUpdate` with initial props and state during mounting.

<Note>

There is no direct equivalent to `UNSAFE_componentWillUpdate` in function components.

</Note>

---

### `static childContextTypes` {/*static-childcontexttypes*/}

<Deprecated>

Cette API sera retirée d'une future version majeure de React. [Utilisez plutôt `static contextType`](#static-contexttype).

</Deprecated>

Lets you specify which [legacy context](https://reactjs.org/docs/legacy-context.html) is provided by this component.

---

### `static contextTypes` {/*static-contexttypes*/}

<Deprecated>

Cette API sera retirée d'une future version majeure de React. [Utilisez plutôt `static contextType`](#static-contexttype).

</Deprecated>


Lets you specify which [legacy context](https://reactjs.org/docs/legacy-context.html) is consumed by this component.

---

### `static contextType` {/*static-contexttype*/}

If you want to read [`this.context`](#context-instance-field) from your class component, you must specify which context it needs to read. The context you specify as the `static contextType` must be a value previously created by [`createContext`.](/reference/react/createContext)

```js {2}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}
```

<Note>

Reading `this.context` in class components is equivalent to [`useContext`](/reference/react/useContext) in function components.

[See how to migrate.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

You can define `static defaultProps` to set the default props for the class. They will be used for `undefined` and missing props, but not for `null` props.

For example, here is how you define that the `color` prop should default to `'blue'`:

```js {2-4}
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };

  render() {
    return <button className={this.props.color}>click me</button>;
  }
}
```

If the `color` prop is not provided or is `undefined`, it will be set by default to `'blue'`:

```js
<>
  {/* this.props.color is "blue" */}
  <Button />

  {/* this.props.color is "blue" */}
  <Button color={undefined} />

  {/* this.props.color is null */}
  <Button color={null} />

  {/* this.props.color is "red" */}
  <Button color="red" />
</>
```

<Note>

Defining `defaultProps` in class components is similar to using [default values](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop) in function components.

</Note>

---

### `static propTypes` {/*static-proptypes*/}

You can define `static propTypes` together with the [`prop-types`](https://www.npmjs.com/package/prop-types) library to declare the types of the props accepted by your component. These types will be checked during rendering and in development only.

```js
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  static propTypes = {
    name: PropTypes.string
  };

  render() {
    return (
      <h1>Salut {this.props.name}</h1>
    );
  }
}
```

<Note>

We recommend using [TypeScript](https://www.typescriptlang.org/) instead of checking prop types at runtime.

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

If you define `static getDerivedStateFromError`, React will call it when a child component (including distant children) throws an error during rendering. This lets you display an error message instead of clearing the UI.

Typically, it is used together with [`componentDidCatch`](#componentdidcatch) which lets you send the error report to some analytics service. A component with these methods is called an *error boundary.*

[See an example.](#catching-rendering-errors-with-an-error-boundary)

#### Paramètres {/*static-getderivedstatefromerror-parameters*/}

* `error`: The error that was thrown. In practice, it will usually be an instance of [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) but this is not guaranteed because JavaScript allows to [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) any value, including strings or even `null`.

#### Valeur renvoyée {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError` should return the state telling the component to display the error message.

#### Limitations {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError` should be a pure function. If you want to perform a side effect (for example, to call an analytics service), you need to also implement [`componentDidCatch`.](#componentdidcatch)

<Note>

There is no direct equivalent for `static getDerivedStateFromError` in function components yet. If you'd like to avoid creating class components, write a single `ErrorBoundary` component like above and use it throughout your app. Alternatively, use the [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) package which does that.

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

If you define `static getDerivedStateFromProps`, React will call it right before calling [`render`,](#render) both on the initial mount and on subsequent updates. It should return an object to update the state, or `null` to update nothing.

This method exists for [rare use cases](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) where the state depends on changes in props over time. For example, this `Form` component resets the `email` state when the `userID` prop changes:

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.userID !== state.prevUserID) {
      return {
        prevUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

Note that this pattern requires you to keep a previous value of the prop (like `userID`) in state (like `prevUserID`).

<Pitfall>

Deriving state leads to verbose code and makes your components difficult to think about. [Make sure you're familiar with simpler alternatives:](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

- If you need to **perform a side effect** (for example, data fetching or an animation) in response to a change in props, use [`componentDidUpdate`](#componentdidupdate) method instead.
- If you want to **re-compute some data only when a prop changes,** [use a memoization helper instead.](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)
- If you want to **"reset" some state when a prop changes,** consider either making a component [fully controlled](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) or [fully uncontrolled with a key](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) instead.

</Pitfall>

#### Paramètres {/*static-getderivedstatefromprops-parameters*/}

- `props`: The next props that the component is about to render with.
- `state`: The next state that the component is about to render with.

#### Valeur renvoyée {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps` return an object to update the state, or `null` to update nothing.

#### Limitations {/*static-getderivedstatefromprops-caveats*/}

- This method is fired on *every* render, regardless of the cause. This is different from [`UNSAFE_componentWillReceiveProps`](#unsafe_cmoponentwillreceiveprops), which only fires when the parent causes a re-render and not as a result of a local `setState`.

- This method doesn't have access to the component instance. If you'd like, you can reuse some code between `static getDerivedStateFromProps` and the other class methods by extracting pure functions of the component props and state outside the class definition.

<Note>

Implementing `static getDerivedStateFromProps` in a class component is equivalent to [calling the `set` function from `useState` during rendering](/reference/react/useState#storing-information-from-previous-renders) in a function component.

</Note>

---

## Usage {/*usage*/}

### Defining a class component {/*defining-a-class-component*/}

To define a React component as a class, extend the built-in `Component` class and define a [`render` method:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Salut {this.props.name} !</h1>;
  }
}
```

React will call your [`render`](#render) method whenever it needs to figure out what to display on the screen. Usually, you will return some [JSX](/learn/writing-markup-with-jsx) from it. Your `render` method should be a [pure function:](https://en.wikipedia.org/wiki/Pure_function) it should only calculate the JSX.

Similarly to [function components,](/learn/your-first-component#defining-a-component) a class component can [receive information by props](/learn/your-first-component#defining-a-component) from its parent component. However, the syntax for reading props is different. For example, if the parent component renders `<Greeting name="Taylor" />`, then you can read the `name` prop from [`this.props`](#props), like `this.props.name`:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Salut {this.props.name} !</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

Note that Hooks (functions starting with `use`, like [`useState`](/reference/react/useState)) are not supported inside class components.

<Pitfall>

We recommend defining components as functions instead of classes. [See how to migrate.](#migrating-a-simple-component-from-a-class-to-a-function)

</Pitfall>

---

### Adding state to a class component {/*adding-state-to-a-class-component*/}

To add [state](/learn/state-a-components-memory) to a class, assign an object to a property called [`state`](#state). To update state, call [`this.setState`](#setstate).

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Prendre de l’âge
        </button>
        <p>Salut {this.state.name}. Vous avez {this.state.age} ans.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Pitfall>

We recommend defining components as functions instead of classes. [See how to migrate.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Pitfall>

---

### Adding lifecycle methods to a class component {/*adding-lifecycle-methods-to-a-class-component*/}

There are a few special methods you can define on your class.

If you define the [`componentDidMount`](#componentdidmount) method, React will call it when your component is added *(mounted)* to the screen. React will call [`componentDidUpdate`](#componentdidupdate) after your component re-renders due to changed props or state. React will call [`componentWillUnmount`](#componentwillunmount) after your component has been removed *(unmounted)* from the screen.

If you implement `componentDidMount`, you usually need to implement all three lifecycles to avoid bugs. For example, if `componentDidMount` reads some state or props, you also have to implement `componentDidUpdate` to handle their changes, and `componentWillUnmount` to clean up whatever `componentDidMount` was doing.

For example, this `ChatRoom` component keeps a chat connection synchronized with props and state:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Note that in development when [Strict Mode](/reference/react/StrictMode) is on, React will call `componentDidMount`, immediately call `componentWillUnmount`, and then call `componentDidMount` again. This helps you notice if you forgot to implement `componentWillUnmount` or if its logic doesn't fully "mirror" what `componentDidMount` does.

<Pitfall>

We recommend defining components as functions instead of classes. [See how to migrate.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Pitfall>

---

### Catching rendering errors with an error boundary {/*catching-rendering-errors-with-an-error-boundary*/}

By default, if your application throws an error during rendering, React will remove its UI from the screen. To prevent this, you can wrap a part of your UI into an *error boundary*. An error boundary is a special component that lets you display some fallback UI instead of the part that crashed--for example, an error message.

To implement an error boundary component, you need to provide [`static getDerivedStateFromError`](#static-getderivedstatefromerror) which lets you update state in response to an error and display an error message to the user. You can also optionally implement [`componentDidCatch`](#componentdidcatch) to add some extra logic, for example, to log the error to an analytics service.

```js {7-10,12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

Then you can wrap a part of your component tree with it:

```js {1,3}
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

If `Profile` or its child component throws an error, `ErrorBoundary` will "catch" that error, display a fallback UI with the error message you've provided, and send a production error report to your error reporting service.

You don't need to wrap every component into a separate error boundary. When you think about the [granularity of error boundaries,](https://www.brandondail.com/posts/fault-tolerance-react) consider where it makes sense to display an error message. For example, in a messaging app, it makes sense to place an error boundary around the list of conversations. It also makes sense to place one around every individual message. However, it wouldn't make sense to place a boundary around every avatar.

<Note>

There is currently no way to write an error boundary as a function component. However, you don't have to write the error boundary class yourself. For example, you can use [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) instead.

</Note>

---

## Alternatives {/*alternatives*/}

### Migrating a simple component from a class to a function {/*migrating-a-simple-component-from-a-class-to-a-function*/}

Typically, you will [define components as functions](/learn/your-first-component#defining-a-component) instead.

For example, suppose you're converting this `Greeting` class component to a function:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Salut {this.props.name} !</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

Define a function called `Greeting`. This is where you will move the body of your `render` function.

```js
function Greeting() {
  // ... move the code from the render method here ...
}
```

Instead of `this.props.name`, define the `name` prop [using the destructuring syntax](/learn/passing-props-to-a-component) and read it directly:

```js
function Greeting({ name }) {
  return <h1>Salut {name} !</h1>;
}
```

Here is a complete example:

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Salut {name} !</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

---

### Migrating a component with state from a class to a function {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

Suppose you're converting this `Counter` class component to a function:

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Prendre de l’âge
        </button>
        <p>Salut {this.state.name}. Vous avez {this.state.age} ans.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

Start by declaring a function with the necessary [state variables:](/reference/react/useState#adding-state-to-a-component)

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

Next, convert the event handlers:

```js {5-7,9-11}
function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }
  // ...
```

Finally, replace all references starting with `this` with the variables and functions you defined in your component. For example, replace `this.state.age` with `age`, and replace `this.handleNameChange` with `handleNameChange`.

Here is a fully converted component:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        Prendre de l’âge
      </button>
      <p>Salut {name}. You are {age}.</p>
    </>
  )
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

---

### Migrating a component with lifecycle methods from a class to a function {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

Suppose you're converting this `ChatRoom` class component with lifecycle methods to a function:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

First, verify that your [`componentWillUnmount`](#componentwillunmount) does the opposite of [`componentDidMount`.](#componentdidmount) In the above example, that's true: it disconnects the connection that `componentDidMount` sets up. If such logic is missing, add it first.

Next, verify that your [`componentDidUpdate`](#componentdidupdate) method handles changes to any props and state you're using in `componentDidMount`. In the above example, `componentDidMount` calls `setupConnection` which reads `this.state.serverUrl` and `this.props.roomId`. This is why `componentDidUpdate` checks whether `this.state.serverUrl` and `this.props.roomId` have changed, and resets the connection if they did. If your `componentDidUpdate` logic is missing or doesn't handle changes to all relevant props and state, fix that first.

In the above example, the logic inside the lifecycle methods connects the component to a system outside of React (a chat server). To connect a component to an external system, [describe this logic as a single Effect:](/reference/react/useEffect#connecting-to-an-external-system)

```js {6-12}
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

This [`useEffect`](/reference/react/useEffect) call is equivalent to the logic in the lifecycle methods above. If your lifecycle methods do multiple unrelated things, [split them into multiple independent Effects.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) Here is a complete example you can play with:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Note>

If your component does not synchronize with any external systems, [you might not need an Effect.](/learn/you-might-not-need-an-effect)

</Note>

---

### Migrating a component with context from a class to a function {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

In this example, the `Panel` and `Button` class components read [context](/learn/passing-data-deeply-with-context) from [`this.context`:](#context)

<Sandpack>

```js
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

When you convert them to function components, replace `this.context` with [`useContext`](/reference/react/useContext) calls:

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>
