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

Pour définir un composant React sous forme de classe, étendez la classe `Component` fournie par React et définissez sa [méthode `render`](#render) :

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

La lecture de `this.props` dans des composants à base de classes est équivalente à la [déclaration des props](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component) dans les fonctions composants.

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

L'état d'un composant à base de classe est mis à disposition dans `this.state`. La champ `state` doit être un objet. Ne modifiez pas l'état directement.  Si vous souhaitez modifier l'état, appelez `setState` avec un objet d'état en argument.

```js {2-4,7-9,18}
class Counter extends Component {
  state = {
    age: 31,
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

Le [constructeur](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes/constructor) est exécuté avant le *montage* (l'ajout dans le DOM) de votre composant. En général, vous n'utilisez un constructeur dans React que pour deux raisons.  Il vous permet de déclarer votre état puis de [lier](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_objects/Function/bind) certaines de vos méthodes à votre instance :

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

* Ne lancez aucun effet de bord et ne souscrivez aucun abonnement dans le constructeur.  Utilisez plutôt [`componentDidMount`](#componentdidmount) pour ça.

* Dans un constructeur, vous devez impérativement appeler `super(props)` avant toute autre instruction.  Si vous ne le faites pas, `this.props` sera `undefined` pendant l'exécution du constructeur, ce qui peut être déroutant et causer des bugs.

* Le constructeur est le seul endroit où vous pouvez affecter une valeur directement à [`this.state`](#state).  Dans toutes les autres méthodes, vous devez plutôt utiliser [`this.setState()`](#setstate). En revanche, n'appelez pas `setState` dans le constructeur.

* Lorsque vous faites du [rendu côté serveur](/reference/react-dom/server), le constructeur sera exécuté côté serveur aussi, suivi de la méthode [`render`](#render). En revanche, les méthodes de cycle de vie telles que `componentDidMount` ou `componentWillUnmount` ne seront pas exécutées côté serveur.

* En [Mode Strict](/reference/react/StrictMode), React appellera votre `constructor` deux fois en développement, puis jettera une des instances obtenues.  Ce comportement vous permet de repérer des effets de bord involontaires qui doivent être sortis du `constructor`.

<Note>

Il n'y a pas d'équivalent réel du `constructor` dans les fonctions composants.  Pour déclarer un état dans une fonction composant, utilisez [`useState`](/reference/react/useState).  Pour éviter de recalculer l'état initial, [passez une fonction à `useState`](/reference/react/useState#avoiding-recreating-the-initial-state).

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

Si vous définissez `componentDidCatch`, React l'appellera lorsqu'un composant descendant lèvera une erreur lors du rendu.  Ça vous permettra de signaler l'erreur à un service de supervision en production.

Elle est en général utilisée conjointement avec [`static getDerivedStateFromError`](#static-getderivedstatefromerror), qui vous permet de mettre à jour l'état en réaction à une erreur afin d'afficher un message d'erreur à l'utilisateur.  Un composant doté de ces méthodes est ce qu'on appelle un *périmètre d'erreur*.

[Voir un exemple](#catching-rendering-errors-with-an-error-boundary).

#### Paramètres {/*componentdidcatch-parameters*/}

* `error` : l'erreur qui a été levée.  En pratique il s'agira généralement d'une instance d'[`Error`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error), mais ce n'est pas garanti parce que JavaScript autorise un [`throw`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/throw) de n'importe quelle valeur, y compris des chaînes de caractères et même `null`.

* `info` : un objet contenant des informations complémentaires sur l'erreur. Son champ `componentStack` contient une pile d'appel de rendu avec le composant ayant levé l'erreur, ainsi que les noms et emplacements dans le code source de tous ses composants parents. En production, les noms des composants seront minifiés. Si vous mettez en place un signalement d'erreurs en production, vous pouvez décoder la pile d'appels de rendu grâce aux *sourcemaps*, exactement comme pour les piles d'appels d'erreurs JavaScript usuelles.

#### Valeur renvoyée {/*componentdidcatch-returns*/}

`componentDidCatch` ne devrait rien renvoyer.

#### Limitations {/*componentdidcatch-caveats*/}

* Par le passé, on appelait couramment `setState` dans `componentDidCatch` pour mettre à jour l'UI et afficher un message d'erreur de remplacement.  C'est déprécié en faveur d'une définition de [`static getDerivedStateFromError`](#static-getderivedstatefromerror).

* Les *builds* de production et de développement diffèrent légèrement dans leur gestion de l'erreur par `componentDidCatch`. En développement, les erreurs se propageront jusqu'à `window`, ce qui signifie que `window.onerror` et `window.addEventListener('error', callback)` intercepteront les erreurs attrapées par `componentDidCatch`. En production, les erreurs ne seront pas propagées, de sorte que les gestionnaires d'erreurs placés plus haut dans l'arbre ne recevront que les erreurs qui n'auront pas été expressément interceptées par `componentDidCatch`.

<Note>

Il n'y a pas encore d'équivalent direct à `componentDidCatch` dans les fonctions composants.  Si vous souhaitez éviter de créer des composants à base de classes, écrivez un unique composant `ErrorBoundary` comme ci-dessus et utilisez-le dans toute votre appli.  Vous pouvez aussi utiliser le module [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) qui fait ça (et davantage) pour vous.

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

Si vous définissez la méthode `componentDidMount`, React l'appellera lorsque votre composant sera ajouté au DOM (*monté*). C'est l'endroit classique pour démarrer un chargement de données, souscrire des abonnements, ou manipuler des nœuds du DOM.

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

- En [Mode Strict](/reference/react/StrictMode), en développement React appellera `componentDidMount`, puis appellera immédiatement [`componentWillUnmount`](#componentwillunmount) et rappellera `componentDidMount` une seconde fois. Ça vous aide à remarquer un oubli d'implémentation de `componentWillUnmount`, ou un « miroir » insuffisant dans celle-ci de la logique présente dans `componentDidMount`.

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

* `prevProps` : les props de votre composant avant la mise à jour. Comparez `prevProps` à [`this.props`](#props) pour déterminer ce qui a changé.

* `prevState` : l'état de votre composant avant la mise à jour. Comparez `prevState` à [`this.state`](#state) pour déterminer ce qui a changé.

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

Exécutez le [*codemod* `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) pour mettre automatiquement le code de vos composants à jour.

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

Cette API a été renommée de `componentWillReceiveProps` en [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops). L'ancien nom est déprécié.  Dans les futures versions de React, seul le nouveau nom fonctionnera.

Exécutez le [*codemod* `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) pour mettre automatiquement le code de vos composants à jour.

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

Cette API a été renommée de `componentWillUpdate` en [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate). L'ancien nom est déprécié.  Dans les futures versions de React, seul le nouveau nom fonctionnera.

Exécutez le [*codemod* `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) pour mettre automatiquement le code de vos composants à jour.

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

- En [Mode Strict](/reference/react/StrictMode), en développement React appellera `componentDidMount`, puis appellera immédiatement [`componentWillUnmount`](#componentwillunmount) et rappellera `componentDidMount` une seconde fois. Ça vous aide à remarquer un oubli d'implémentation de `componentWillUnmount`, ou un « miroir » insuffisant dans celle-ci de la logique présente dans `componentDidMount`.

<Note>

Dans de nombreux cas, définir `componentDidMount`, `componentDidUpdate` et `componentWillUnmount` conjointement dans des composants à base de classes revient à un simple appel à [`useEffect`](/reference/react/useEffect) dans les fonctions composants.  Dans les rares cas où il est important d'exécuter du code avant l'affichage par le navigateur, un meilleur équivalent serait [`useLayoutEffect`](/reference/react/useLayoutEffect).

[Voyez comment migrer](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function).

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

Force un composant à recalculer son rendu.

Vous n'en avez normalement pas besoin. Si la méthode [`render`](#render) de votre composant se contente de lire [`this.props`](#props), [`this.state`](#state) ou [`this.context`](#context), il refera automatiquement son rendu lorsque vous appelez [`setState`](#setstate) dans votre composant ou dans un de ses parents.  En revanche, si la méthode `render` de votre composant lit directement une source de données extérieure, vous devrez demander à React de mettre à jour l'interface utilisateur lorsque cette source de données change.  C'est ce à quoi sert `forceUpdate`.

Essayez d'éviter tout utilisation de `forceUpdate`, en ne lisant que `this.props` et `this.state` dans `render`.

#### Paramètres {/*forceupdate-parameters*/}

* `callback` **optionnel** : s'il est précisé, React appellera le `callback` que vous avez fourni une fois la mise à jour retranscrite dans le DOM.

#### Valeur renvoyée {/*forceupdate-returns*/}

`forceUpdate` ne renvoie rien.

#### Limitations {/*forceupdate-caveats*/}

- Si vous appelez `forceUpdate`, React recalculera le rendu sans appeler d'abord [`shouldComponentUpdate`.](#shouldcomponentupdate)

<Note>

Là où les composants à base de classes lisent une source de données extérieure pour ensuite forcer avec `forceUpdate` le recalcul de leur rendu lorsque celle-ci change, les fonctions composants utilisent plutôt [`useSyncExternalStore`](/reference/react/useSyncExternalStore).

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

```js {7-16,18}
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
    // à ce que les nouveaux éléments ne décalent pas les anciens
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

Dans l'exemple ci-dessus, il est vital de lire la propriété `scrollHeight` directement dans `getSnapshotBeforeUpdate`.  On ne pourrait pas la lire de façon fiable dans [`render`](#render), [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops) ou [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate) parce qu'il existe un risque de décalage temporel entre les appels de ces méthodes et la mise à jour du DOM par React.

#### Paramètres {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps` : les props de votre composant avant la mise à jour. Comparez `prevProps` à [`this.props`](#props) pour déterminer ce qui a changé.

* `prevState` : l'état de votre composant avant la mise à jour. Comparez `prevState` à [`this.state`](#state) pour déterminer ce qui a changé.

#### Valeur renvoyée {/*getsnapshotbeforeupdate-returns*/}

Vous devriez renvoyer une valeur capturée de quelque type que ce soit, voire `null`.  La valeur que vous renvoyez sera passée en troisième argument à [`componentDidUpdate`](#componentdidupdate).

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

React est susceptible d'appeler `render` à tout moment, aussi vous ne devriez pas supposer son exécution à un moment particulier.  En général, la méthode `render` devrait renvoyer un contenu [JSX](/learn/writing-markup-with-jsx), mais certains [autres types de résultats](#render-returns) (comme les chaînes de caractères) sont autorisés. Pour calculer le JSX renvoyé, la méthode `render` peut lire [`this.props`](#props), [`this.state`](#state) et [`this.context`](#context).

Vous devriez écrire la méthode `render` sous forme de fonction pure, c'est-à-dire qu'elle devrait toujours renvoyer le même résultat si les props, l'état et le contexte n'ont pas changé.  Elle ne devrait par ailleurs pas contenir d'effets de bord (tels que des souscriptions d'abonnements) ou interagir avec des API du navigateur.  Les effets de bord sont censés survenir soit dans des gestionnaires d'événements, soit dans des méthodes comme[`componentDidMount`](#componentdidmount).

#### Paramètres {/*render-parameters*/}

`render` ne prend aucun paramètre.

#### Valeur renvoyée {/*render-returns*/}

`render` peut renvoyer n'importe quel nœud React valide. Ça inclut les éléments React tels que `<div />`, les chaînes de caractères, les nombres, [les portails](/reference/react-dom/createPortal), les nœuds vides (`null`, `undefined`, `true` et `false`) et les tableaux de nœuds React.

#### Limitations {/*render-caveats*/}

- `render` devrait être écrite comme une fonction pure des props, de l'état et du contexte.  Elle ne devrait comporter aucun effet de bord.

- `render` ne sera pas appelée si [`shouldComponentUpdate`](#shouldcomponentupdate) est définie et renvoie `false`.

* En [Mode Strict](/reference/react/StrictMode), React appellera `render` deux fois en développement et jettera un des résultats.  Ça vous permet de repérer des effets de bord involontaires qui doivent être sortis de `render`.

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
        <p>Salut {this.state.name}.</p>
      </>
    );
  }
}
```

`setState` maintient une file d'attente de modifications à apporter à l'état du composant.  Elle indique à React que ce composant et ses enfants doivent recalculer leur rendu avec un nouvel état.  C'est le principal moyen de mettre à jour l'interface utilisateur suite à des interactions.

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
  * Si vous passez une fonction comme `nextState`, elle sera traitée comme une *fonction de mise à jour*.  Elle doit être pure, doit accepter l'état en attente et les props comme arguments, et doit renvoyer un objet qui sera superficiellement fusionné dans `this.state`.  React placera votre fonction de mise à jour dans une file d'attente puis refera le rendu de votre composant. Lors du prochain rendu, React calculera le prochain état en appliquant successivement toutes les fonctions de mise à jour en attente, en partant de l'état précédent.

* `callback` **optionnel** : s'il est précisé, React appellera le `callback` que vous avez fourni une fois la mise à jour retranscrite dans le DOM.

#### Valeur renvoyée {/*setstate-returns*/}

`setState` ne renvoie rien.

#### Limitations {/*setstate-caveats*/}

- Pensez à `setState` comme à une *requête* plutôt qu'une commande de mise à jour immédiate du composant. Lorsque plusieurs composants mettent à jour leurs états en réaction à un événement, React regroupe leurs mises à jour et refait leurs rendus en une unique passe, à la fin de l'événement.  Pour les rares cas où vous auriez besoin de forcer une mise à jour d'état spécifique à être appliquée de façon synchrone, vous pourriez l'enrober dans [`flushSync`](/reference/react-dom/flushSync), mais ça gâche généralement la performance.

- `setState` ne met pas immédiatement à jour `this.state`.  Il est donc piégeux de lire `this.state` juste après avoir appelé `setState`.  Utilisez plutôt [`componentDidUpdate`](#componentdidupdate) ou l'argument `callback` de `setState`, qui vous garantissent tous les deux une exécution après que la mise à jour a été appliquée.  Si vous avez besoin de mettre à jour l'état sur base de l'état précédent, vous pouvez passer une fonction pour `nextState`, comme décrit plus haut.

<Note>

Appeler `setState` dans les composants à base de classe  est similaire à l'appel d'une [fonction `set`](/reference/react/useState#setstate) dans les fonctions composants.

[Voyez comment migrer](#migrating-a-component-with-state-from-a-class-to-a-function).

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

Si vous définissez `shouldComponentUpdate`, React l'appellera pour déterminer s'il peut éviter de calculer un nouveau rendu.

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

Renvoie `true` si vous souhaitez que le composant refasse son rendu. C'est le comportement par défaut.

Renvoie `false` pour indiquer à React de sauter le recalcul du rendu.

#### Limitations {/*shouldcomponentupdate-caveats*/}

- Cette méthode existe *seulement* comme une optimisation des performances. Si votre composant ne fonctionne pas sans elle, corrigez-le d'abord.

- Envisagez de recourir à [`PureComponent`](/reference/react/PureComponent) plutôt que d'écrire `shouldComponentUpdate` à la main. `PureComponent` fait une comparaison superficielle des props et de l'état, et réduit le risque de sauter une mise à jour utile.

- Nous vous déconseillons de faire des comparaisons profondes ou d'utiliser `JSON.stringify` dans `shouldComponentUpdate`. Ça rend la performance imprévisible et dépendante des structures de données de chaque prop et élément d'état.  Au meilleur des cas, vous risquez d'introduire des gels de plusieurs secondes dans votre appli, au pire cas de la faire carrément planter.

- Renvoyer `false` n'empêche pas vos composants enfants de refaire leurs calculs si *leurs* données changent.

- Renvoyer `false` ne *garantit* pas que le composant sautera son rendu.  React se servira de votre valeur renvoyée comme d'un conseil, mais reste susceptible d'opter pour un recalcul du rendu si ça lui semble par ailleurs justifié.

<Note>

L'optimisation des composants à base de classes avec `shouldComponentUpdate` est similaire à l'optimisation des fonctions composants avec [`memo`](/reference/react/memo). Les fonctions composants proposent aussi des optimisations plus granulaires avec[`useMemo`](/reference/react/useMemo).

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

Si vous définissez `UNSAFE_componentWillMount`, React l'appellera immédiatement après le [`constructor`](#constructor).  Cette méthode n'existe plus que pour des raisons historiques et ne devrait pas être utilisée dans du nouveau code.  Utilisez plutôt l'une de ces alternatives :

- Pour initialiser l'état, déclarez un champ d'instance [`state`](#state) ou affectez `this.state` dans le [`constructor`](#constructor).
- Si vous avez besoin d'exécuter un effet de bord ou de souscrire un abonnement, déplacez plutôt cette logique dans [`componentDidMount`](#componentdidmount).

[Consultez des exemples de migration des méthodes historiques de cycle de vie](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples).

#### Paramètres {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount` ne prend aucun paramètre.

#### Valeur renvoyée {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount` ne devrait rien renvoyer.

#### Limitations {/*unsafe_componentwillmount-caveats*/}

- `UNSAFE_componentWillMount` ne sera pas appelée si le composant implémente [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) ou [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate).

- En dépit de son nom, `UNSAFE_componentWillMount` ne garantit pas que le composant *sera effectivement monté* si votre appli utilise des fonctionnalités modernes de React telles que [`Suspense`](/reference/react/Suspense).  Si une tentative de rendu suspend (en raison par exemple d'un code de composant enfant qui ne serait pas encore chargé), React jettera l'arborescence en cours et essaiera de reconstruire le composant de zéro lors de la prochaine tentative.  C'est pourquoi cette méthode n'est « pas fiable » *(“unsafe”, NdT)*. Tout code qui se base sur le montage (comme la souscription d'un abonnement) devrait être placé dans [`componentDidMount`](#componentdidmount).

- `UNSAFE_componentWillMount` est la seule méthode de cycle de vie qui est exécutée lors d'un [rendu côté serveur](/reference/react-dom/server). Son déclenchement est en pratique identique à celui de [`constructor`](#constructor), vous devriez donc plutôt utiliser `constructor` pour ce type de logique.

<Note>

Appeler [`setState`](#setstate) dans `UNSAFE_componentWillMount` au sein d'un composant à base de classe, afin d'initialiser l'état du composant, est équivalent au passage de cet état comme état initial à [`useState`](/reference/react/useState) dans une fonction composant.

</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

Si vous définissez `UNSAFE_componentWillReceiveProps`, React l'appellera lorsque le composant recevra des nouvelles props.  Cette méthode n'existe plus que pour des raisons historiques et ne devrait pas être utilisée dans du nouveau code.  Utilisez plutôt l'une de ces alternatives :

- Si vous avez besoin **d'exécuter un effet de bord** (par exemple charger des données, dérouler une animation ou réinitialiser un abonnement) en réaction à des changements de props, déplacez plutôt cette logique dans [`componentDidUpdate`](#componentdidupdate).
- Si vous souhaitez **ne recalculer certaines données que lorsque certaines props changent**, utilisez plutôt un [utilitaire de mémoïsation](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
- Si vous essayez de **« réinitialiser » tout l'état quand une prop change**, envisagez de plutôt faire un composant soit [pleinement contrôlé](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) soit [pleinement non contrôlé mais avec une clé](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).
- Si vous avez besoin **« d'ajuster » une partie de l'état quand une prop change**, voyez si vous ne pouvez pas plutôt calculer toutes les infos nécessaires à partir des props seules lors du rendu.  Si ce n'est pas possible, préférez [`static getDerivedStateFromProps`](/reference/react/Component#static-getderivedstatefromprops).

[Consultez des exemples de migration des méthodes historiques de cycle de vie](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props).

#### Paramètres {/*unsafe_componentwillreceiveprops-parameters*/}

* `nextProps` : les prochaines props que le composant va recevoir de son composant parent. Comparez `nextProps` à [`this.props`](#props) pour déterminer ce qui a changé.
* `nextContext` : le prochain contexte que le composant va recevoir de son plus proche fournisseur de contexte. Comparez `nextContext` à [`this.context`](#state) pour déterminer ce qui a changé. N'est disponible que si vous avez par ailleurs spécifié [`static contextType`](#static-contexttype) (approche plus récente) ou [`static contextTypes`](#static-contexttypes) (approche dépréciée).

#### Valeur renvoyée {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps` ne devrait rien renvoyer.

#### Limitations {/*unsafe_componentwillreceiveprops-caveats*/}

- `UNSAFE_componentWillReceiveProps` ne sera pas appelée si le composant implémente [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) ou [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate).

- En dépit de son nom, `UNSAFE_componentWillReceiveProps` ne garantit pas que le composant *recevra effectivement ces props* si votre appli utilise des fonctionnalités modernes de React telles que [`Suspense`](/reference/react/Suspense).  Si une tentative de rendu suspend (en raison par exemple d'un code de composant enfant qui ne serait pas encore chargé), React jettera l'arborescence en cours et essaiera de reconstruire le composant de zéro lors de la prochaine tentative.  D'ici là, les props pourraient avoir encore changé. C'est pourquoi cette méthode n'est « pas fiable » *(“unsafe”, NdT)*. Tout code qui ne devrait être exécuté que pour des mises à jour confirmées (comme la réinitialisation d'un abonnement) devrait être placé dans [`componentDidUpdate`](#componentdidupdate).

- `UNSAFE_componentWillReceiveProps` n'implique pas que le composant recevra des props *différentes* de la fois précédente.  Vous devez comparer `nextProps` avec `this.props` vous-même pour vérifier que quelque chose a changé.

- React n'appelle pas `UNSAFE_componentWillReceiveProps` avec les props initiales lors du montage.  Il n'appelle cette méthode que si tout ou partie des props du composant vont être mises à jour.  Par exemple, un appel à [`setState`](#setstate) ne déclenche généralement pas `UNSAFE_componentWillReceiveProps` au sein du même composant.

<Note>

Appeler [`setState`](#setstate) dans `UNSAFE_componentWillReceiveProps` pour « ajuster » l'état au sein d'un composant à base de classe est équivalent à [l'appel d'une fonction `set` fournie par `useState` lors du rendu](/reference/react/useState#storing-information-from-previous-renders) dans une fonction composant.

</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}

Si vous définissez `UNSAFE_componentWillUpdate`, React l'appellera avant de refaire un rendu avec les nouvelles props et le nouvel état.  Cette méthode n'existe plus que pour des raisons historiques et ne devrait pas être utilisée dans du nouveau code.  Utilisez plutôt l'une de ces alternatives :

- Si vous avez besoin d'exécuter un effet de bord (par exemple charger des données, dérouler une animation ou réinitialiser un abonnement) en réaction à des changements de props ou d'état, déplacez plutôt cette logique dans [`componentDidUpdate`](#componentdidupdate).
- Si vous avez besoin de lire des informations depuis le DOM (par exemple la position de défilement) pour l'utiliser ensuite dans [`componentDidUpdate`](#componentdidupdate), lisez-la plutôt dans [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate).

[Consultez des exemples de migration des méthodes historiques de cycle de vie](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples).

#### Paramètres {/*unsafe_componentwillupdate-parameters*/}

* `nextProps` : les prochaines props de votre composant pour le rendu à venir. Comparez `nextProps` à [`this.props`](#props) pour déterminer ce qui a changé.
* `nextState` : le prochain état de votre composant pour le rendu à venir. Comparez `nextState` à [`this.state`](#state) pour déterminer ce qui a changé.

#### Valeur renvoyée {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate` ne devrait rien renvoyer.

#### Limitations {/*unsafe_componentwillupdate-caveats*/}

- `UNSAFE_componentWillUpdate` ne sera pas appelée si [`shouldComponentUpdate`](#shouldcomponentupdate) est définie et renvoie `false`.

- `UNSAFE_componentWillUpdate` ne sera pas appelée si le composant implémente [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) ou [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate).

- Il est interdit d'appeler [`setState`](#setstate) (ou toute méthode entraînant un appel à `setState`, tel que le *dispatch* d'une action Redux) au sein de `componentWillUpdate`.

- En dépit de son nom, `UNSAFE_componentWillUpdate` ne garantit pas que le composant *sera effectivement mis à jour* si votre appli utilise des fonctionnalités modernes de React telles que [`Suspense`](/reference/react/Suspense).  Si une tentative de rendu suspend (en raison par exemple d'un code de composant enfant qui ne serait pas encore chargé), React jettera l'arborescence en cours et essaiera de reconstruire le composant de zéro lors de la prochaine tentative. D'ici là, les props ou l'état pourraient avoir encore changé. C'est pourquoi cette méthode n'est « pas fiable » *(“unsafe”, NdT)*. Tout code qui ne devrait être exécuté que pour des mises à jour confirmées (comme la réinitialisation d'un abonnement) devrait être placé dans [`componentDidUpdate`](#componentdidupdate).

- `UNSAFE_componentWillUpdate` n'implique pas que le composant recevra des props ou un état *différents* de la fois précédente.  Vous devez comparer vous-même `nextProps` avec `this.props` et `nextState` avec `this.state` pour vérifier que quelque chose a changé.

- React n'appellera pas `UNSAFE_componentWillUpdate` avec les props et état initiaux lors du montage.

<Note>

Il n'y a pas d'équivalent direct à `UNSAFE_componentWillUpdate` dans les fonctions composants.

</Note>

---

### `static childContextTypes` {/*static-childcontexttypes*/}

<Deprecated>

Cette API sera retirée d'une future version majeure de React. [Utilisez plutôt `static contextType`](#static-contexttype).

</Deprecated>

Vous permet de spécifier quel [contexte historique](https://legacy.reactjs.org/docs/legacy-context.html) est fourni par ce composant.

---

### `static contextTypes` {/*static-contexttypes*/}

<Deprecated>

Cette API sera retirée d'une future version majeure de React. [Utilisez plutôt `static contextType`](#static-contexttype).

</Deprecated>

Vous permet de spécifier quel [contexte historique](https://legacy.reactjs.org/docs/legacy-context.html) est consommé par ce composant.

---

### `static contextType` {/*static-contexttype*/}

Si vous souhaitez lire [`this.context`](#context-instance-field) dans votre composant à base de classe, vous devez spécifier le contexte que vous souhaitez lire.  Le contexte que vous spécifiez comme `static contextType` doit être une valeur créée auparavant par[`createContext`](/reference/react/createContext).

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

La lecture de `this.context` dans les composants à base de classes est équivalente à [`useContext`](/reference/react/useContext) dans les fonctions composants.

[Voyez comment migrer](#migrating-a-component-with-context-from-a-class-to-a-function).

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

Vous pouvez définir `static defaultProps` pour fournir des valeurs par défaut aux props de la classe.  Elles seront utilisées pour les props manquantes ou valant `undefined`, mais pas pour les props valant `null`.

Voici par exemple comment définir une prop `color` qui devrait valoir `'blue'` par défaut :

```js {2-4}
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };

  render() {
    return <button className={this.props.color}>Cliquez ici</button>;
  }
}
```

Si la prop `color` n'est pas fournie ou est à `undefined`, elle sera mise par défaut à `'blue'` :

```js
<>
  {/* this.props.color vaudra "blue" */}
  <Button />

  {/* this.props.color vaudra "blue" */}
  <Button color={undefined} />

  {/* this.props.color vaudra null */}
  <Button color={null} />

  {/* this.props.color vaudra "red" */}
  <Button color="red" />
</>
```

<Note>

La définition de `defaultProps` dans les composants à base de classes est équivalente à l'utilisation de [valeurs par défaut](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop) dans les fonctions composants.

</Note>

---

### `static propTypes` {/*static-proptypes*/}

Vous pouvez définir `static propTypes` en utilisant le module[`prop-types`](https://www.npmjs.com/package/prop-types) pour déclarer les types des props acceptées par votre composant.  Ces types seront vérifiés lors du rendu en développement uniquement.

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

Nous vous conseillons d'utiliser [TypeScript](/learn/typescript) plutôt que de vérifier vos types de props à l'exécution.

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

Si vous définissez `static getDerivedStateFromError`, React l'appellera lorsqu'un composant descendant lèvera une erreur pendant le rendu.  Ça vous permet d'afficher un message d'erreur plutôt que d'aboutir à une UI vide.

Elle est en général utilisée conjointement avec [`componentDidCatch`](#componentdidcatch), qui vous permet par exemple d'envoyer un rapport d'erreur à un service de supervision.  Un composant doté de ces méthodes est ce qu'on appelle un *périmètre d'erreur*.

[Voir un exemple](#catching-rendering-errors-with-an-error-boundary).

#### Paramètres {/*static-getderivedstatefromerror-parameters*/}

* `error` : l'erreur qui a été levée.  En pratique il s'agira généralement d'une instance d'[`Error`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error), mais ce n'est pas garanti parce que JavaScript autorise un [`throw`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/throw) de n'importe quelle valeur, y compris des chaînes de caractères et même `null`.

#### Valeur renvoyée {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError` devrait renvoyer un objet d'état indiquant au composant d'afficher un message d'erreur.

#### Limitations {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError` devrait être une fonction pure. Si vous souhaiter exécuter un effet de bord (comme par exemple un signalement à un service de supervision), vous devez aussi implémenter la méthode [`componentDidCatch`](#componentdidcatch).

<Note>

Il n'y a pas encore d'équivalent direct à `static getDerivedStateFromError` dans les fonctions composants.  Si vous souhaitez éviter de créer des composants à base de classes, écrivez un unique composant `ErrorBoundary` comme ci-dessus et utilisez-le dans toute votre appli.  Vous pouvez aussi utiliser le module [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) qui fait ça (et davantage) pour vous.

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

Si vous définissez `static getDerivedStateFromProps`, React l'appellera juste avant d'appeler [`render`](#render), tant au montage initial que lors des mises à jour ultérieures.  Elle devrait renvoyer un objet de mise à jour de l'état, ou `null` pour ne faire aucune mise à jour.

Cette méthode existe pour [les rares cas d'usage](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) où l'état dépend de changements de props au fil du temps. Par exemple, le composant `Form` ci-dessous réinitialise son état `email` lorsque la prop `userID` change :

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Dès que l’utilisateur actif change, réinitialise
    // les parties de l’état liées à cet utilisateur.
    // Dans cet exemple simple, il s’agit juste de l’e-mail.
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

Remarquez que cette approche requiert la conservation de la valeur précédente de la prop (comme `userID`) dans l'état (comme ici `prevUserID`).

<Pitfall>

Dériver ainsi l'état conduit à du code verbeux et rend difficile la compréhension de vos composants. [Assurez-vous de bien connaître les alternatives plus simples](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html) :

- Si vous avez besoin **d'exécuter un effet de bord** (par exemple charger des données ou dérouler une animation) en réaction à un changement de prop, utilisez plutôt la méthode [`componentDidUpdate`](#componentdidupdate).
- Si vous souhaitez **ne recalculer certaines données que lorsque certaines props changent**, utilisez plutôt un [utilitaire de mémoïsation](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
- Si vous essayez de **« réinitialiser » tout l'état quand une prop change**, envisagez de plutôt faire un composant soit [pleinement contrôlé](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) soit [pleinement non contrôlé mais avec une clé](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).

</Pitfall>

#### Paramètres {/*static-getderivedstatefromprops-parameters*/}

* `props` : les prochaines props pour le rendu à venir.
* `state` : le prochain état pour le rendu à venir.

#### Valeur renvoyée {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps` renvoie un objet utilisé pour mettre à jour l'état, ou `null` pour ne rien mettre à jour.

#### Limitations {/*static-getderivedstatefromprops-caveats*/}

- Cette méthode est déclenchée à *chaque* rendu, peu en importe la raison. Ce n'est pas comme [`UNSAFE_componentWillReceiveProps`](#unsafe_cmoponentwillreceiveprops), qui elle ne serait déclenchée que lorsque le parent entraîne un nouveau rendu, mais pas suite à un `setState` local.

- Cette méthode n'a pas accès à l'instance du composant. Si vous le souhaitez, vous pouvez réutiliser du code entre `static getDerivedStateFromProps` et les autres méthodes de la classe en extrayant des fonctions pures basées sur les props et l'état du composant, que vous placeriez hors de la définition de la classe.

<Note>

L'implémentation de la méthode `static getDerivedStateFromProps` dans un composant à base de classe est équivalente à [l'appel d'une fonction `set` fournie par `useState` lors du rendu](/reference/react/useState#storing-information-from-previous-renders) dans une fonction composant.

</Note>

---

## Utilisation {/*usage*/}

### Définir un composant à base de classe {/*defining-a-class-component*/}

Pour définir un composant React sous forme de classe, étendez la classe `Component` fournie par React et définissez sa [méthode `render`](#render) :

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Salut {this.props.name} !</h1>;
  }
}
```

React appellera votre méthode [`render`](#render) dès qu'il doit déterminer quoi afficher à l'écran.  Vous y renverrez en général du [JSX](/learn/writing-markup-with-jsx). Votre méthode `render` devrait être une [fonction pure](https://fr.wikipedia.org/wiki/Fonction_pure) : elle devrait se limiter à calculer le JSX.

Tout comme les [fonctions composants](/learn/your-first-component#defining-a-component), un composant à base de classe peut [recevoir des informations *via* ses props](/learn/your-first-component#defining-a-component) depuis son composant parent.  En revanche, la syntaxe de consultation des props est différente. Si par exemple le composant parent fait le rendu de `<Greeting name="Clara" />`, vous pourrez lire la prop `name` depuis [`this.props`](#props), en utilisant `this.props.name` :

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
      <Greeting name="Laure" />
      <Greeting name="Marie" />
      <Greeting name="Nina" />
    </>
  );
}
```

</Sandpack>

Remarquez que les Hooks (des fonctions dont le nom commence par `use`, telles que [`useState`](/reference/react/useState)) ne sont pas pris en charge par les composants à base de classes.

<Pitfall>

Nous vous conseillons de définir vos composants au moyen de fonctions plutôt que de classes. [Voyez comment migrer](#migrating-a-simple-component-from-a-class-to-a-function).

</Pitfall>

---

### Ajouter de l'état à un composant à base de classe {/*adding-state-to-a-class-component*/}

Pour ajouter un [état](/learn/state-a-components-memory) à une classe, affectez un objet à la propriété [`state`](#state). Pour mettre à jour l'état, appelez [`this.setState`](#setstate).

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Clara',
    age: 31,
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

Nous vous conseillons de définir vos composants au moyen de fonctions plutôt que de classes. [Voyez comment migrer](#migrating-a-component-with-state-from-a-class-to-a-function).

</Pitfall>

---

### Ajouter des méthodes de cycle de vie à un composant à base de classe {/*adding-lifecycle-methods-to-a-class-component*/}

Il existe plusieurs méthodes spéciales que vous pouvez définir sur votre classe.

Si vous définissez la méthode [`componentDidMount`](#componentdidmount), React l'appellera quand votre composant aura été ajouté au DOM (*monté*). React appellera [`componentDidUpdate`](#componentdidupdate) après que votre composant aura refait son rendu en raison de props ou d'un état modifiés. React appellera [`componentWillUnmount`](#componentwillunmount) juste avant que votre composant ne soit retiré du DOM (*démonté*).

Si vous implémentez `componentDidMount`, vous aurez généralement besoin d'implémenter ces trois méthodes de cycle de vie pour éviter les bugs. Si par exemple `componentDidMount` lit un état ou des props, vous devrez également implémenter `componentDidUpdate` pour en gérer les évolutions, ainsi que `componentWillUnmount` pour nettoyer toute mise en place effectuée dans `componentDidMount`.

Par exemple, ce composant `ChatRoom` conserve une connexion au salon de discussion synchronisée avec les props et l'état :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choisissez votre salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">général</option>
          <option value="travel">voyage</option>
          <option value="music">musique</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Fermer le salon' : 'Ouvrir le salon'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
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
          URL du serveur :{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Bienvenue dans le salon {this.props.roomId} !</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Remarquez qu'en développement et lorsque le [Mode Strict](/reference/react/StrictMode) est actif, React appellera `componentDidMount`, puis appellera immédiatement `componentWillUnmount` et rappellera `componentDidMount` une seconde fois. Ça vous aide à remarquer un oubli d'implémentation de `componentWillUnmount`, ou un « miroir » insuffisant dans celle-ci de la logique de `componentDidMount`.

<Pitfall>

Nous vous conseillons de définir vos composants au moyen de fonctions plutôt que de classes. [Voyez comment migrer](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function).

</Pitfall>

---

### Capturer les erreurs de rendu avec un périmètre d'erreur {/*catching-rendering-errors-with-an-error-boundary*/}

Par défaut, si votre application lève une erreur lors du rendu, React retirera son UI de l'écran.  Pour éviter ça, vous pouvez enrober tout ou partie de votre UI dans un *périmètre d'erreur*. Un périmètre d'erreur est un composant spécial qui vous permet d'afficher une UI de secours plutôt que la partie plantée : un message d'erreur par exemple.

Pour implémenter un composant de périmètre d'erreur, vous devez fournir [`static getDerivedStateFromError`](#static-getderivedstatefromerror) qui vous permet de mettre à jour votre état en réaction à une erreur afin d'afficher un message à l'utilisateur. Vous pouvez aussi, optionnellement, implémenter [`componentDidCatch`](#componentdidcatch) pour ajouter de la logique supplémentaire, comme par exemple un signalement de l'erreur à un service de supervision.

```js {7-11,13-20}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Met à jour l'état pour que le prochain rendu affiche une
    // UI de secours.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Exemple de "componentStack" :
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Vous pouvez afficher n’importe quelle UI de secours
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

Vous pouvez alors enrober une partie de votre arbre de composants avec le périmètre :

```js {1,3}
<ErrorBoundary fallback={<p>Ça sent le pâté…</p>}>
  <Profile />
</ErrorBoundary>
```

Si `Profile` ou un de ses composants descendants lève une erreur, `ErrorBoundary` « attrapera » cette erreur, affichera une UI de secours avec le message d'erreur fourni, et enverra un signalement de l'erreur de production à votre service de supervision.

Vous n'avez pas besoin d'enrober chaque composant dans son propre périmètre d'erreur.  Lorsque vous réfléchissez à la [granularité de vos périmètres d'erreurs](https://www.brandondail.com/posts/fault-tolerance-react), pensez aux emplacements logiques pour des messages d'erreurs.  Dans une appli de messagerie par exemple, un périmètre d'erreur naturel se situerait autour de la liste des conversations.  Il serait également envisageable de placer un périmètre autour de chaque message individuel.  En revanche, ça ne servirait à rien d'en placer un autour de chaque avatar.

<Note>

Il n'existe pour le moment pas de moyen d'écrire un périmètre d'erreur sous forme de fonction composant.  Ceci dit, vous n'avez pas à écrire votre classe de périmètre d'erreur vous-même. Vous pouvez par exemple utiliser plutôt le module [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary).

</Note>

---

## Alternatives {/*alternatives*/}

### Migrer un composant simple d'une classe vers une fonction {/*migrating-a-simple-component-from-a-class-to-a-function*/}

Généralement, vous [définirez plutôt vos composants sous forme de fonctions](/learn/your-first-component#defining-a-component).

Supposons par exemple que vous souhaitiez convertir ce composant à base de classe `Greeting` en une fonction composant :

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
      <Greeting name="Laure" />
      <Greeting name="Marie" />
      <Greeting name="Nina" />
    </>
  );
}
```

</Sandpack>

Définissez pour commencer une fonction nommée `Greeting`.  C'est là que vous allez déplacer le corps de votre méthode `render` :

```js
function Greeting() {
  // ... déplacez ici le code de votre méthode `render` ...
}
```

Plutôt que de lire `this.props.name`, définissez une prop `name` [au moyen d'une déstructuration dans la signature](/learn/passing-props-to-a-component) et lisez-la directement :

```js
function Greeting({ name }) {
  return <h1>Salut {name} !</h1>;
}
```

Voici l'exemple complet :

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Salut {name} !</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Laure" />
      <Greeting name="Marie" />
      <Greeting name="Nina" />
    </>
  );
}
```

</Sandpack>

---

### Migrer un composant avec état d'une classe vers une fonction {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

Supposons que vous convertissiez ce composant à base de classe `Counter` vers une fonction :

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Clara',
    age: 31,
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

Commencez par déclarer une fonction avec les [variables d'état](/reference/react/useState#adding-state-to-a-component) nécessaires :

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Clara');
  const [age, setAge] = useState(42);
  // ...
```

Convertissez ensuite les gestionnaires d'événements :

```js {5-7,9-11}
function Counter() {
  const [name, setName] = useState('Clara');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }
  // ...
```

Pour finir, remplacez toutes les références qui démarrent par `this` avec les variables et fonctions définies dans votre composant.  Remplacez par exemple `this.state.age` par `age` et `this.handleNameChange` par `handleNameChange`.

Voici le composant pleinement converti :

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Clara');
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

### Migrer un composant doté de méthodes de cycle de vie d'une classe vers une fonction {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

Supposons que vous convertissiez ce composant à base de classe `ChatRoom`, doté de méthodes de cycle de vie, vers une fonction :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choisissez un salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">général</option>
          <option value="travel">voyage</option>
          <option value="music">musique</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Ferme le salon' : 'Ouvrir le salon'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
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
          URL du serveur :{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Bienvenue dans le salon {this.props.roomId} !</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Commencez par vérifier que votre [`componentWillUnmount`](#componentwillunmount) fait bien l'inverse de votre [`componentDidMount`](#componentdidmount).  Dans l'exemple ci-dessus, c'est bien le cas : elle débranche la connexion établie par `componentDidMount`. Si cette logique est manquante, commencez par l'ajouter.

Ensuite, vérifiez que votre méthode [`componentDidUpdate`](#componentdidupdate) gère les changements des props et états que vous utilisez dans `componentDidMount`. Dans l'exemple ci-dessus, `componentDidMount` appelle `setupConnection` qui lit `this.state.serverUrl` et `this.props.roomId`. C'est pourquoi `componentDidUpdate` vérifie si `this.state.serverUrl` ou `this.props.roomId` ont changé, et réinitialise la connexion le cas échéant. Si la logique de votre `componentDidUpdate` est manquante ou ne gère pas les changements à toutes les parties pertinentes des props et de l'état, corrigez d'abord ça.

Dans l'exemple qui précède, la logique dans les méthodes de cycle de vie connecte le composant à un système extérieur à React (un serveur de discussion).  Pour connecter un composant à un système extérieur, [décrivez la logique nécessaire dans un Effet unique](/reference/react/useEffect#connecting-to-an-external-system) :

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

Cet appel à [`useEffect`](/reference/react/useEffect) est équivalent à la logique des méthodes de cycle de vie ci-avant.  Si vos méthodes de cycle de vie s'occupent de plusieurs sujets distincts, [découpez-les en Effets indépendants](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things).  Voici l'exemple complet que vous pouvez manipuler :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choisissez un salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">général</option>
          <option value="travel">voyage</option>
          <option value="music">musique</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Ferme le salon' : 'Ouvrir le salon'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
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
        URL du serveur :{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Bienvenue dans le salon {roomId} !</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
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

Si votre composant ne se synchronise pas avec un système extérieur, alors [vous n'avez pas forcément besoin d'un Effet](/learn/you-might-not-need-an-effect).

</Note>

---

### Migrer un composant avec un contexte d'une classe vers une fonction {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

Dans l'exemple qui suit, les composants à base de classes `Panel` et `Button` lisent un [contexte](/learn/passing-data-deeply-with-context) en utilisant [`this.context`](#context) :

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
    <Panel title="Bienvenue">
      <Button>Inscription</Button>
      <Button>Connexion</Button>
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

Lorsque vous convertissez ça en fonctions composants, remplacez votre utilisation de`this.context` par des appels à [`useContext`](/reference/react/useContext) :

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
    <Panel title="Bienvenue">
      <Button>Inscription</Button>
      <Button>Connexion</Button>
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
