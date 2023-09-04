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

Force un composant à recalculer son rendu.

Vous n'en avez normalement pas besoin. Si la méthode [`render`](#render) de votre composant se contente de lire [`this.props`](#props), [`this.state`](#state) ou [`this.context`](#context), il refera automatiquement son rendu lorsque vous appelez [`setState`](#setstate) dans votre composant ou dans un de ses parents.  En revanche, si la méthode `render` de votre composant lit directement une source de données extérieure, vous devrez demander à React de mettre à jour l'interface utilisateur lorsque cette source de données change.  C'est ce à quoi sert `forceUpdate`.

Essayez d'éviter tout utilisation de `forceUpdate` en ne lisant que `this.props` et `this.state` dans `render`.

#### Paramètres {/*forceupdate-parameters*/}

* `callback` **optionnel** : s'il est précisé, React appellera le `callback` que vous avez précisé une fois la mise à jour retranscrite dans le DOM.

#### Valeur renvoyée {/*forceupdate-returns*/}

`forceUpdate` ne renvoie rien.

#### Limitations {/*forceupdate-caveats*/}

- Si vous appelez `forceUpdate`, React recalculera le rendu sans appeler d'abord [`shouldComponentUpdate`.](#shouldcomponentupdate)

<Note>

Là où les composants à base de classes lisent une source de données extérieure et forcent avec `forceUpdate` le recalcul de leur rendu lorsque celle-ci change, les fonctions composants utilisent plutôt [`useSyncExternalStore`](/reference/react/useSyncExternalStore).

</Note>

---

### `getChildContext()` {/*getchildcontext*/}

<Deprecated>

Cette API sera retirée d'une future version majeure de React. [Utilisez plutôt `Context.Provider`](/reference/react/createContext#provider).

</Deprecated>

Vous permet de spécifier les valeurs fournies par le composant pour les [contextes historiques](https://legacy.reactjs.org/docs/legacy-context.html).

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

Si vous implémentez `getSnapshotBeforeUpdate`, React l'appellera juste avant de mettre à jour le DOM.  Ça permet à votre composant de capturer certaines informations issues du DOM (telles que la position de défilement) avant qu'elles risquent d'évoluer.  Toute valeur renvoyée par cette méthode de cycle de vie sera passée en paramètre à [`componentDidUpdate`](#componentdidupdate).

Vous pouvez par exemple l'utiliser dans une UI de type fil de discussion qui aurait besoin de préserver la position de défilement lors des mises à jour :

```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Ajoute-t-on des nouveaux éléments à la liste ?
    // Capturons alors la position de défilement pour l’ajuster
    // par la suite.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Si nous avons une valeur capturée, c’est qu’on a ajouté
    // de nouveaux éléments. On ajuste alors le défilement de façon
    // à ce que les nouceaux éléments ne décalent pas les anciens
    // hors de la zone visible.
    // (Ici `snapshot` est la valeur renvoyée `getSnapshotBeforeUpdate`.)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contenu... */}</div>
    );
  }
}
```

Dans l'exemple ci-dessus, il est vital de lire la propriété `scrollHeight` directement dans `getSnapshotBeforeUpdate`.  On ne pourrait pas la lire de façon fiable dans [`render`](#render), [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops), ou [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate) parce qu'il existe un risque de décalage temporel entre les appels de ces méthodes et la mise à jour du DOM par React.

#### Paramètres {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps` : les props avant la mise à jour. Comparez `prevProps` à [`this.props`](#props) pour déterminer ce qui a changé.

* `prevState` : l'état avant la mise à jour. Comparez `prevState` à [`this.state`](#state) pour déterminer ce qui a changé.

#### Valeur renvoyée {/*getsnapshotbeforeupdate-returns*/}

Vous devriez renvoyer une valeur capturée de quelque type que ce soit, ou `null`.  La valeur que vous renvoyez sera passée en troisième argument à [`componentDidUpdate`](#componentdidupdate).

#### Limitations {/*getsnapshotbeforeupdate-caveats*/}

- `getSnapshotBeforeUpdate` ne sera pas appelée si [`shouldComponentUpdate`](#shouldcomponentupdate) est définie et renvoie `false`.

<Note>

Il n'y a pas encore d'équivalent direct à `getSnapshotBeforeUpdate` dans les fonctions composants.  C'est un cas d'usage très rare, mais si vous en avez absolument besoin, vous devrez pour le moment écrire un composant à base de classe.

</Note>

---

### `render()` {/*render*/}

La méthode `render` est la seule méthode obligatoire dans un composant à base de classe.

La méthode `render` devrait spécifier ce que vous souhaitez afficher à l'écran, par exemple :

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Salut {this.props.name} !</h1>;
  }
}
```

React est susceptible d'appeler `render` à tout moment, mais vous ne devriez pas supposer son exécution à un moment particulier.  En général, la méthode `render` devrait renvoyer un contenu [JSX](/learn/writing-markup-with-jsx), mais certains [autres types de résultats](#render-returns) (comme les chaînes de caractères) sont autorisés. Pour calculer le JSX renvoyé, la méthode `render` peut lire [`this.props`](#props), [`this.state`](#state) et [`this.context`](#context).

Vous devriez écrire la méthode `render` sous forme de fonction pure, c'est-à-dire qu'elle devrait toujours renvoyer le même résultat si les props, l'état et le contexte n'ont pas changé.  Elle ne devrait par ailleurs pas contenir d'effets de bords (tels que des souscriptions d'abonnements) ou interagir avec des API du navigateur.  Les effets de bord sont censés survenir soit dans des gestionnaires d'événements, soit dans des méthodes comme[`componentDidMount`](#componentdidmount).

#### Paramètres {/*render-parameters*/}

`render` ne prend aucun paramètre.

#### Valeur renvoyée {/*render-returns*/}

`render` peut renvoyer n'importe quel nœud React valide. Ça inclut les éléments React tels que `<div />`, les chaînes de caractères, les nombres, [les portails](/reference/react-dom/createPortal), les nœuds vides (`null`, `undefined`, `true` et `false`) et les tableaux de nœuds React.

#### Limitations {/*render-caveats*/}

- `render` devrait être écrite comme une fonction pure des props, de l'état et du contexte.  Elle ne devrait comporter aucun effet de bord.

- `render` ne sera pas appelée si [`shouldComponentUpdate`](#shouldcomponentupdate) est définie et renvoie `false`.

* En [mode strict](/reference/react/StrictMode), React appellera `render` deux fois en développement et jettera un des résultats.  Ça vous permet de repérer des effets de bords involontaires qui doivent être sortis de `render`.

- Il n'y a pas de correspondance directe entre l'appel à `render` et les appels ultérieurs à `componentDidMount` et `componentDidUpdate`.  Certains résultats d'appels à `render` sont susceptibles d'être ignorés par React lorsque ça présente un avantage.

---

### `setState(nextState, callback?)` {/*setstate*/}

Appelez `setState` pour mettre à jour l'état de votre composant React.

```js {8-10}
class Form extends Component {
  state = {
    name: 'Clara',
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

`setState` maintient une file d'attente de modifications à apporter à l'état du composant.  Elle indique à React que ce composant et ses enfants doivent recalculer leur rendu avec un nouvel état.  C'est le principal moyen de mettre à jour l'interface utilisateur en réaction à des interactions.

<Pitfall>

Appeler `setState` **ne change pas** l'état actuel pour le code en cours d'exécution :

```js {6}
function handleClick() {
  console.log(this.state.name); // « Clara »
  this.setState({
    name: 'Juliette'
  });
  console.log(this.state.name); // Toujours « Clara » !
}
```

Ça affecte uniquement ce que vaudra `this.state` à partir du *prochain* rendu.

</Pitfall>

Vous pouvez aussi passer une fonction à `setState`.  Ça vous permet de mettre à jour l'état sur base de sa valeur précédente :

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

Vous n'êtes pas obligé·e de faire ça, mais c'est pratique lorsque vous souhaitez accumuler plusieurs mises à jour de l'état au sein d'un même événement.

#### Paramètres {/*setstate-parameters*/}

* `nextState` : soit un objet, soit une fonction.
  * Si vous passez un objet comme `nextState`, il sera superficiellement fusionné dans `this.state`.
  * Si vous passez une fonction comme `nextState`, elle sera traitée comme une *fonction de mise à jour*.  Elle doit être pure, doit accepter l'état en attente et les props comme arguments, et doit renvoyer un objet qui sera superficiellement fusionné dans `this.state`.  React placera votre fonction de mise à jour dans une file d'attente puis refera le rendu de votre composant. Lors du prochain rendu, React calculera le prochain état en appliquant successivement toutes les fonctions de mise à jour de la file, en commençant avec l'état précédent.

* `callback` **optionnel** : s'il est précisé, React appellera le `callback` que vous avez précisé une fois la mise à jour retranscrite dans le DOM.

#### Valeur renvoyée {/*setstate-returns*/}

`setState` ne renvoie rien.

#### Limitations {/*setstate-caveats*/}

- Pensez à `setState` comme à une *requête* plutôt qu'une commande de mise à jour immédiate du composabt. Lorsque plusieurs composants mettent à jour leurs états en réaction à un événement, React regroupera leurs mises à jour et refera leurs rendus sur une unique passe, à la fin de l'événement.  Pour les rares cas où vous auriez besoin de forcer une mise à jour d'état spécifique à être appliquée de façon synchrone, vous pourriez l'enrober dans [`flushSync`](/reference/react-dom/flushSync), mais ça gâche généralement la performance.

- `setState` ne met pas immédiatement à jour `this.state`.  Il est donc piégeux de lire `this.state` juste après avoir appelé `setState`.  Utilisez plutôt [`componentDidUpdate`](#componentdidupdate) ou l'argument `callback` de `setState`, qui vous garantissent tous les deux une exécutiona près que la mise à jour a été appliquée.  Si vous avez besoin de mettre à jour l'état sur base de l'état précédent, vous pouvez passer une fonction comme `nextState`, comme décrit plus haut.

<Note>

Appeler `setState` dans les composants à base de classe  est similaire à l'appel d'une [fonction `set`](/reference/react/useState#setstate) dans les fonctions composants.

[Voyez comment migrer](#migrating-a-component-with-state-from-a-class-to-a-function).

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

Si vous définissez `shouldComponentUpdate`, React l'appellera pour déterminer s'il peut sauter un nouveau rendu.

Si vous êtes certain·e de vouloir écrire ça vous-même, vous pouvez comparer `this.props` avec `nextProps` et `this.state` avec `nextState` et renvoyer `false` pour indiquer à React que le recalcul du rendu peut être sauté.

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
      // Rien n’a changé, un nouveau rendu est donc superflu
      return false;
    }
    return true;
  }

  // ...
}

```

React appelle `shouldComponentUpdate` avant de refaire le rendu lorsque des nouvelles props ou un nouvel état sont fournis.  Ça renvoie par défaut `true`. Cette méthode n'est pas appelée pour le rendu initial, ni lorsque [`forceUpdate`](#forceupdate) est utilisée.

#### Paramètres {/*shouldcomponentupdate-parameters*/}

* `nextProps` : les prochaines props pour le rendu à venir. Comparez `nextProps` à [`this.props`](#props) pour déterminer ce qui a changé.
* `nextState` : le prochain état pour le rendu à venir. Comparez `nextState` à [`this.state`](#state) pour déterminer ce qui a changé.
* `nextContext` : le prochain contexte pour le rendu à venir. Comparez `nextContext` à [`this.context`](#state) pour déterminer ce qui a changé. N'est disponible que si vous avez spécifié [`static contextType`](#static-contexttype) (approche plus récente) ou [`static contextTypes`](#static-contexttypes) (approche dépréciée).

#### Valeur renvoyée {/*shouldcomponentupdate-returns*/}

Renvoie `true` si vous souhaiter que le composant refasse son rendu. C'est le comportement par défaut.

Renvoie `false` pour indiquer à React de sauter le recalcul du rendu.

#### Limitations {/*shouldcomponentupdate-caveats*/}

- Cette méthode existe *seulement* comme une optimisation des performances. Si votre composant ne fonctionne pas sans elle, corrigez-le d'abord.

- Envisagez de recourir à [`PureComponent`](/reference/react/PureComponent) plutôt que d'écrire `shouldComponentUpdate` à la main. `PureComponent` fait une comparaison superficielle des props et de l'état, et réduit le risque de sauter une mise à jour utile.

- Nous vous déconseillons de faire des comparaisons profondes ou d'utiliser `JSON.stringify` dans `shouldComponentUpdate`. Ça rend la performance imprévisible et dépendante des structures de données de chaque prop et élément d'état.  Au meilleur des cas, vous risquez d'introduire des gels de plusieurs secondes dans votre appli, au pire cas de la faire carrément planter.

- Renvoyer `false` n'empêche pas vos composants enfants de refaire leurs calculs si *leurs* données changent.

- Renvoyer `false` ne *garantit* pas que le composant ne refera pas son rendu.  React se servira de votre valeur renvoyée comme d'un conseil, mais reste susceptible d'opter pour un recalcul du rendu si ça lui semble par ailleurs justifié.

<Note>

L'optimisation des composants à base de classes avec `shouldComponentUpdate` est similaire à l'optimisation des fonctions composants avec [`memo`](/reference/react/memo). Les fonctions composants proposent aussi des optimisations plus granulaires avec[`useMemo`](/reference/react/useMemo).

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
