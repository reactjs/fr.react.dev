---
id: react-component
title: React.Component
layout: docs
category: Reference
permalink: docs/react-component.html
redirect_from:
  - "docs/component-api.html"
  - "docs/component-specs.html"
  - "docs/component-specs-ko-KR.html"
  - "docs/component-specs-zh-CN.html"
  - "tips/UNSAFE_componentWillReceiveProps-not-triggered-after-mounting.html"
  - "tips/dom-event-listeners.html"
  - "tips/initial-ajax.html"
  - "tips/use-react-with-other-libraries.html"
---

Cette page fournit une référence détaillée de l'API pour la définition de composants React à base de classes. Elle suppose que vous êtes à l’aise avec les concepts fondamentaux de React, tels que les [Composants et props](/docs/components-and-props.html), ainsi que l’[État et cycle de vie](/docs/state-and-lifecycle.html). Si ce n’est pas le cas, lisez ces pages avant de continuer.

## Aperçu de l’API {#overview}

React vous permet de définir vos composants en tant que classes ou fonctions. Les composants définis par des classes fournissent pour le moment davantage de fonctionnalités, qui sont décrites en détail dans cette page. Pour définir un composant React avec une classe, vous devez étendre `React.Component` :

```js
class Welcome extends React.Component {
  render() {
    return <h1>Bonjour, {this.props.name}</h1>;
  }
}
```

La seule méthode que vous *devez* définir dans une sous-classe de `React.Component` s’appelle [`render()`](#render). Toutes les autres méthodes décrites sur cette page sont optionnelles.

**Nous vous recommandons fortement de ne pas créer vos propres classes de base pour vos composants.**  Dans les composants React, [la réutilisation de code est obtenue principalement par composition plutôt que par héritage](/docs/composition-vs-inheritance.html).

>Remarque
>
> React ne vous force pas à utiliser la syntaxe de classes ES6. Si vous préférez l’éviter, vous pouvez utiliser à la place le module `create-react-class` ou une autre abstraction maison du même genre. Allez faire un tour sur [React sans ES6](/docs/react-without-es6.html) pour en apprendre davantage.

### Le cycle de vie du composant {#the-component-lifecycle}

Chaque composant a plusieurs « méthodes de cycle de vie » que vous pouvez surcharger pour exécuter du code à des moments précis du processus. **Vous pouvez utiliser [ce diagramme de cycle de vie](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) comme aide-mémoire.**  Dans la liste ci-dessous, les méthodes de cycle de vie courantes sont indiquées en **gras**. Les autres sont là pour des cas d’utilisation relativement rares.

#### Montage {#mounting}

Les méthodes suivantes sont appelées dans cet ordre lorsqu’une instance d’un composant est créée puis insérée dans le DOM :

- [**`constructor()`**](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [**`render()`**](#render)
- [**`componentDidMount()`**](#componentdidmount)

>Remarque
>
> Les méthodes suivantes sont considérées dépréciées et vous devriez [les éviter](/blog/2018/03/27/update-on-async-rendering.html) dans vos nouveaux codes :
>
>- [`UNSAFE_componentWillMount()`](#unsafe_componentwillmount)

#### Mise à jour {#updating}

Une mise à jour est déclenchée par des changements dans les props ou l’état local. Les méthodes suivantes sont appelées dans cet ordre quand un composant se rafraîchit :

- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [**`render()`**](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](#componentdidupdate)


>Remarque
>
> Les méthodes suivantes sont considérées dépréciées et vous devriez [les éviter](/blog/2018/03/27/update-on-async-rendering.html) dans vos nouveaux codes :
>
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### Démontage {#unmounting}

La méthode suivante est appelée quand un composant est retiré du DOM :

- [**`componentWillUnmount()`**](#componentwillunmount)

#### Gestion d’erreurs {#error-handling}

Ces méthodes sont appelées lorsqu’une erreur survient au sein de n’importe quel composant enfant lors de son rendu, dans une méthode de cycle de vie, ou dans son constructeur.

- [`static getDerivedStateFromError()`](#static-getderivedstatefromerror)
- [`componentDidCatch()`](#componentdidcatch)

### Autres API {#other-apis}

Chaque composant fournit par ailleurs quelques API supplémentaires :

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### Propriétés de classes {#class-properties}

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### Propriétés d’instances {#instance-properties}

  - [`props`](#props)
  - [`state`](#state)

* * *

## Référence {#reference}

### Méthodes de cycle de vie couramment utilisées {#commonly-used-lifecycle-methods}

Les méthodes de cette section couvrent la vaste majorité des cas d’utilisation que vous rencontrerez en créant des composants React. **Pour une référence visuelle, jetez un œil à [ce diagramme de cycle de vie](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/).**

### `render()` {#render}

```javascript
render()
```

La méthode `render()` est la seule méthode requise dans une classe de composant.

Lorsqu’elle est appelée, elle examine en général `this.props` et `this.state` et renvoie un des types suivants :

- **Éléments React.**  Typiquement créés via [JSX](/docs/introducing-jsx.html). Par exemple, `<div />` et `<MyComponent />` sont des éléments React qui demandent à React de produire, respectivement, un nœud DOM et un autre composant défini par l’utilisateur.
- **Tableaux et fragments.**  Ils vous permettent de renvoyer plusieurs éléments racines depuis un rendu. Consultez la documentation des [fragments](/docs/fragments.html) pour plus de détails.
- **Portails**. Ils permettent d’effectuer le rendu des enfants dans une autre partie du DOM. Consultez la documentation des [portails](/docs/portals.html) pour plus de détails.
- **Chaînes de caractères et nombres.**  Ils deviennent des nœuds textuels dans le DOM.
- **Booléens ou `null`.**  Ils ne produisent rien. (Ça existe principalement pour permettre des motifs de code tels que `return test && <Child />`, ou `test` serait booléen.)

La fonction `render()` doit être pure, c’est-à-dire qu’elle ne doit rien changer à l’état local du composant, doit renvoyer le même résultat chaque fois qu’elle est invoquée (dans des conditions identiques), et ne doit pas interagir directement avec le navigateur.

Si vous avez besoin de telles interactions, faites-le plutôt dans `componentDidMount()` ou d’autres méthodes de cycle de vie. S’assurer que `render()` reste pure facilite la compréhension du fonctionnement des composants.

> Remarque
>
> `render()` ne sera pas appelée si [`shouldComponentUpdate()`](#shouldcomponentupdate) renvoie `false`.

* * *

### `constructor()` {#constructor}

```javascript
constructor(props)
```

**Si vous n’initialisez pas d’état local et ne liez pas de méthodes, vous n’avez pas besoin d’implémenter votre propre constructeur pour votre composant React.**

Le constructeur d’un composant React est appelé avant que celui-ci soit monté. Quand on implémente le constructeur d’une sous-classe de `React.Component`, il faut commencer par appeler `super(props)`, avant toute manipulation de `this`. Dans le cas contraire, outre une éventuelle erreur de syntaxe ES6, `this.props` sera `undefined` dans le constructeur, ce qui peut causer des bugs.

Les constructeurs React sont habituellement utilisés pour deux raisons seulement :

* Initialiser [l’état local](/docs/state-and-lifecycle.html) en affectant un objet à `this.state`.
* Lier des méthodes [gestionnaires d’événements](/docs/handling-events.html) à l’instance.

Vous **ne devez pas appeler `setState()`** dans le `constructor()`. Au lieu de ça, si votre composant a besoin d’utiliser l’état local, **affectez directement l’état initial à `this.state`** dans le constructeur :

```js
constructor(props) {
  super(props);
  // N’appelez pas `this.setState()` ici !
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

Le constructeur est le seul endroit où vous devriez affecter directement une valeur à `this.state`. Dans toutes les autres méthodes, utilisez plutôt `this.setState()`.

Évitez aussi de mettre en place des effets de bord ou abonnements dans le constructeur. Dans ces cas-là, préférez `componentDidMount()`.

> Remarque
>
> **Évitez de copier les props dans l’état local !  C’est une erreur courante :**
>
>```js
>constructor(props) {
>  super(props);
>  // Ne faites pas ça !
>  this.state = { color: props.color };
>}
>```
>
> Le problème est double : d’une part, c’est superflu (vous pouvez plutôt utiliser directement `this.props.color`), d’autre part ça crée des bugs (les mises à jour de la prop `color` ne seront pas reflétées dans l’état local).
>
> **N’utilisez cette approche que si vous avez l’intention d’ignorer les mises à jour de la prop.**  Dans un tel cas, il serait judicieux de renommer la `prop` vers quelque chose comme `initialColor` ou `defaultColor`. Vous pouvez ensuite forcer le composant à « réinitialiser » son état interne en [changeant sa `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) lorsque c’est nécessaire.
>
> Pour apprendre quelle approche utiliser lorsque vous pensez qu’une partie de votre état doit dépendre des props, lisez notre [article sur l’art d’éviter un état dérivé](/blog/2018/06/07/you-probably-dont-need-derived-state.html).


* * *

### `componentDidMount()` {#componentdidmount}

```javascript
componentDidMount()
```

`componentDidMount()` est appelée immédiatement après que le composant est monté (inséré dans l’arbre). C’est ici que vous devriez placer les initialisations qui requièrent l’existence de nœuds du DOM. Si vous avez besoin de charger des données depuis un point d’accès distant, c’est aussi le bon endroit pour déclencher votre requête réseau.

C’est enfin là que vous devriez mettre en place vos abonnements. Si vous en faites, n’oubliez pas de vous désabonner dans `componentWillUnmount()`.

Vous **avez le droit d’appeler `setState()` directement** dans `componentDidMount()`. Ça déclenchera un rendu supplémentaire, mais il surviendra avant que le navigateur ne mette à jour l’écran. Ainsi, vous avez la garantie que même si `render()` est appelée deux fois dans ce cas précis, l’utilisateur ne verra pas l’état intermédiaire. Utilisez toutefois cette façon de faire avec précaution parce qu’elle nuit souvent à la performance. Dans la plupart des cas, vous devriez plutôt pouvoir initialiser l’état local dans le `constructor()`. Ceci étant dit, dans certains cas tels que les boîtes de dialogues et infobulles, qui ont souvent besoin de mesurer un nœud du DOM avant d’afficher quelque chose qui dépend de leur taille ou de leur position, ce second rendu peut s’avérer nécessaire.

* * *

### `componentDidUpdate()` {#componentdidupdate}

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

`componentDidUpdate()` est appelée immédiatement après que la mise à jour a eu lieu. Cette méthode n’est pas appelée pour le rendu initial.

Elle vous donne l’opportunité de travailler sur le DOM une fois que le composant a été mis à jour. C’est aussi un bon endroit pour faire des requêtes réseau, du moment que vous prenez soin de vérifier que les props actuelles concernées diffèrent des anciennes props (dans le sens où une requête réseau est peut-être superflue si les props en question n’ont pas changé).

```js
componentDidUpdate(prevProps) {
  // Utilisation classique (pensez bien à comparer les props) :
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

Vous **avez le droit d’appeler `setState()` directement** dans `componentDidUpdate()` mais notez bien que **vous devez l’enrober dans une condition**, comme dans l’exemple ci-dessus, ou vous obtiendrez l’équivalent d’une boucle infinie. Là aussi, vous déclencherez un rendu supplémentaire qui, même s’il n’est pas perceptible par l’utilisateur, peut affecter la performance du composant. Si vous essayez de « refléter » dans l’état local une prop venant de plus haut, voyez si vous ne pouvez pas plutôt utiliser directement la prop. Vous pouvez en apprendre davantage sur [les raisons pour lesquelles copier des props dans l’état local est source de bugs](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

Si votre composant implémente la méthode de cycle de vie `getSnapshotBeforeUpdate()` (ce qui est rare), la valeur retournée par celle-ci sera passée comme troisième argument `snapshot` à `componentDidUpdate()`. Dans le cas inverse, cet argument sera `undefined`.

> Remarque
>
> `componentDidUpdate()` ne sera pas appelée si [`shouldComponentUpdate()`](#shouldcomponentupdate) renvoie `false`.

* * *

### `componentWillUnmount()` {#componentwillunmount}

```javascript
componentWillUnmount()
```

`componentWillUnmount()` est appelée immédiatement avant qu’un composant soit démonté ou détruit. Mettez-y tout nettoyage nécessaire, tel que l’invalidation de minuteurs, l’annulation de requêtes réseau, ou la résiliation d’abonnements effectués dans `componentDidMount()`

Vous **ne devez pas appeler `setState()`** dans `componentWillUnmount()` car le composant ne sera de toutes façons jamais ré-affiché. Une fois l’instance du composant démontée, elle ne sera plus jamais re-montée.

* * *

### Méthodes de cycle de vie rarement utilisées {#rarely-used-lifecycle-methods}

Les méthodes de cette section sont liées à des cas d’utilisation peu fréquents. Elles peuvent s’avérer utiles de temps en temps, mais la plupart de vos composants n’en auront sans doute jamais besoin. **Vous pouvez voir la plupart de ces méthods dans [ce diagramme de cycle de vie](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) en cochant la case « Montrer les cycles de vie moins courants » au-dessus.**


### `shouldComponentUpdate()` {#shouldcomponentupdate}

```javascript
shouldComponentUpdate(nextProps, nextState)
```

Utilisez `shouldComponentUpdate()` pour indiquer à React que la sortie d’un composant n’est pas affectée par la modification en cours de l’état local ou des props. Le comportement par défaut consiste à rafraîchir à chaque modification, et pour la vaste majorité des cas vous devriez en rester là.

`shouldComponentUpdate()` est appelée avant le rendu quand de nouvelles props ou un nouvel état local sont reçues. Par défaut, elle renvoie `true`. Cette méthode n’est pas appelée avant le rendu initial ou lorsque `forceUpdate()` est utilisée.

Cette méthode n’existe qu’en tant qu’**[optimisation de performance](/docs/optimizing-performance.html).**  Ne vous en servez pas pour « empêcher » un rafraîchissement, car ça finirait par causer des bugs. **Utilisez alors plutôt la classe de base prédéfinie [`PureComponent`](/docs/react-api.html#reactpurecomponent)**. Celle-ci effectue une comparaison de surface des props et de l’état local, ce qui réduit les risques de sauter une mise à jour nécessaire.

Si vous êtes certain·e de vouloir l’écrire à la main, vous pouvez comparer `this.props` avec `nextProps` et `this.state` avec `nextState`, et renvoyer `false` pour indiquer à React de sauter la mise à jour. Remarquez que renvoyer `false` n’empêche pas les composants fils de se rafraîchir quand *leur* état change.

Nous vous déconseillons de recourir à une comparaison profonde ou à `JSON.stringify()` dans `shouldComponentUpdate()`. Ce sont des techniques coûteuses qui dégraderont les performances.

À l’heure actuelle, si `shouldComponentUpdate()` renvoie `false`, alors [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate), [`render()`](#render), et [`componentDidUpdate()`](#componentdidupdate) ne seront pas appelées. À l’avenir React se réserve le droit de considérer `shouldComponentUpdate()` comme étant « consultatif » plutôt que contraignant, de sorte que renvoyer `false` pourrait tout de même aboutir à un rafraîchissement du composant.

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

`getDerivedStateFromProps` est appelée juste avant d’appeler la méthode `render()`, aussi bien pour le montage initial que lors des mises à jour ultérieures. Elle doit renvoyer un objet qui mette à jour l’état, ou `null` faute de mise à jour.

Cette méthode existe pour [les rares cas](/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) où l’état dépend bien des changements de props au fil du temps. Par exemple, elle peut être utile pour implémenter un composant `<Transition>` qui comparerait les enfants précédents et suivants pour décider lesquels animer en entrée et en sortie.

Dériver l’état entraîne généralement des composants au code verbeux et difficile à suivre. [Assurez-vous qu’une meilleure alternative n’existe pas](/blog/2018/06/07/you-probably-dont-need-derived-state.html) :

* Si vous avez besoin de **réaliser un effet de bord** (par exemple, charger des données ou dérouler une animation) en réponse à une modification des props, utilisez plutôt la méthode de cycle de vie [`componentDidUpdate`](#componentdidupdate).
* Si vous voulez **recalculer des données seulement quand une prop change**, [utilisez plutôt un utilitaire de mémoïsation](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
* Si vous souhaitez **« réinitialiser » une partie de l’état local quand une prop change**, voyez s’il ne serait pas plutôt judicieux de rendre le composant [pleinement contrôlé](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) ou [pleinement non-contrôlé avec une `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).

Cette méthode n’a pas accès à l’instance de composant. Si vous le souhaitez, vous pouvez réutiliser du code entre `getDerivedStateFromProps()` et les autres méthodes de la classe en extrayant des fonctions pures appelées avec les props et l’état local du composant, pour les placer hors de la définition de la classe.

Remarquez que cette méthode est déclenchée avant *chaque* rendu, quelle qu’en soit la cause. C’est le contraire de `UNSAFE_componentWillReceiveProps`, qui n’est déclenchée que lorsque votre composant parent vous rafraîchit, et non comme résultat d’un `setState()` local.

* * *

### `getSnapshotBeforeUpdate()` {#getsnapshotbeforeupdate}

```javascript
getSnapshotBeforeUpdate(prevProps, prevState)
```

`getSnapshotBeforeUpdate()` est appelée juste avant que le rendu le plus récent ne soit validé, par exemple envoyé au DOM. Elle vous permet de capturer des infos du DOM courant (ex. la position de défilement) avant qu’il ne subisse d’éventuelles modifications. Toute valeur renvoyée par cette méthode de cycle de vie sera passée comme argument à `componentDidUpdate()`.

C’est un cas d’utilisation peu commun, mais il peut survenir dans des UI comme une discussion en ligne qui a besoin de gérer la position de défilement d’une façon spécifique.

Il faut renvoyer une valeur capturée (ou `null`).

Par exemple :

`embed:react-component-reference/get-snapshot-before-update.js`

Dans l’exemple ci-dessus, il est important qu’on puisse lire la propriété `scrollHeight` dans `getSnapshotBeforeUpdate`, parce qu’il peut y avoir un délai entre les méthodes de cycle de vie de la « phase de rendu » (comme `render`) et celles de la « phase de commit » (comme `getSnapshotBeforeUpdate` et `componentDidUpdate`).

* * *

### Périmètres d’erreurs {#error-boundaries}

Les [périmètres d’erreurs](/docs/error-boundaries.html) *(error boundaries, NdT)* sont des composants React qui interceptent toute erreur JavaScript survenant dans l’arbre de composants de leurs enfants, loguent ces erreurs, et affichent une UI de remplacement au lieu de l’arbre de composants qui a planté.

Les périmètres d’erreurs capturent les erreurs survenant dans le rendu, les méthodes de cycle de vie, et les constructeurs de tout l’arbre en-dessous d’eux.

Un composant basé classe devient un périmètre d’erreur s’il définit au moins une des méthodes de cycle de vie `static getDerivedStateFromError()` ou `componentDidCatch()`. Mettre à jour votre état local au sein de ces méthodes vous permet d’intercepter une erreur JavaScript non gérée dans l’arbre en-dessous de vous, et d’afficher à la place une UI de remplacement.

N’utilisez les périmètres d’erreurs que pour retomber sur vos pieds lors d’exceptions inattendues ; **ne les utilisez pas comme primitives de contrôle de flux.**

Pour en apprendre davantage, lisez [*Gestion d’Erreurs dans React 16*](/blog/2017/07/26/error-handling-in-react-16.html).

> Remarque
>
> Les périmètres d’erreurs n’interceptent que les erreurs dans les composants **en-dessous** d’eux dans l’arbre. Un périmètre d’erreur ne peut pas capturer une erreur survenue en son propre sein.

### `static getDerivedStateFromError()` {#static-getderivedstatefromerror}
```javascript
static getDerivedStateFromError(error)
```

Cette méthode de cycle de vie est appelée après qu’une erreur a été levée par un composant descendant. Elle reçoit l’erreur levée comme paramètre et doit renvoyer une valeur qui mette à jour l’état.

```js{7-11,14-17}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // On met à jour l’état afin que le prochain rendu affiche
    // l’UI de remplacement.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // Vous pouvez afficher ici n’importe quelle UI de secours
      return <h1>Ça sent le brûlé.</h1>;
    }

    return this.props.children;
  }
}
```

> Remarque
>
> `getDerivedStateFromError()` est appelée pendant la « phase de rendu », de sorte que les effets de bord y sont interdits. Si vous en avez besoin, utilisez plutôt `componentDidCatch()`.

* * *

### `componentDidCatch()` {#componentdidcatch}

```javascript
componentDidCatch(error, info)
```

Cette méthode de cycle de vie est appelée après qu’une erreur a été levée par un composant descendant. Elle reçoit deux arguments :

1. `error` - L’erreur qui a été levée.
2. `info` - Un objet avec une propriété `componentStack` contenant [des informations sur le composant qui a levé l’erreur](/docs/error-boundaries.html#component-stack-traces).

`componentDidCatch()` est appelée durant la « phase de commit », donc les effets de bord y sont autorisés. On peut l’utiliser par exemple pour loguer les erreurs :

```js{13-20}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // On met à jour l’état afin que le prochain rendu affiche
    // l’UI de remplacement.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Exemple de `componentStack` :
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Vous pouvez afficher ici n’importe quelle UI de secours
      return <h1>Ça sent le brûlé.</h1>;
    }

    return this.props.children;
  }
}
```

> Remarque
>
> Si une erreur survient, vous pouvez déclencher l’affichage d’une UI de remplacement avec `componentDidCatch()` en appelant `setState`, mais une future version de React dépréciera cette possibilité. Utilisez plutôt  `static getDerivedStateFromError()` pour déclencher l’affichage de l’UI de remplacement.

* * *

### Méthodes de cycle de vie dépréciées {#legacy-lifecycle-methods}

Les méthodes de cycle de vie ci-dessous sont « historiques » *(legacy, NdT)*, et à ce titre sont considérées comme dépréciées. Elles fonctionnent encore, mais nous les déconseillons dans tout nouveau code. Vous pouvez en apprendre davantage sur la bonne façon de faire migrer ces méthodes dans [cet article sur notre blog](/blog/2018/03/27/update-on-async-rendering.html).

### `UNSAFE_componentWillMount()` {#unsafe_componentwillmount}

```javascript
UNSAFE_componentWillMount()
```

> Remarque
>
> Cette méthode de cycle de vie s’appelait à l’origine `componentWillMount`. Ce nom continuera à fonctionner jusqu’à la sortie de React 17. Utilisez le [codemod `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) pour mettre à jour automatiquement vos composants.

`UNSAFE_componentWillMount()` est appelée juste avant que le montage n’ait lieu. Elle est appelée avant `render()`, de sorte qu’appeler `setState()` de façon synchrone au sein de cette méthode ne déclenchera pas un rendu supplémentaire. Mais généralement, nous conseillons plutôt d’utiliser `constructor()` pour initialiser l’état.

Évitez d’introduire des effets de bord ou d’effectuer des abonnements dans cette méthode. Pour de tels besoins, utilisez plutôt `componentDidMount()`.

C’est la seule méthode de cycle de vie appelée lors d’un rendu côté serveur.

* * *

### `UNSAFE_componentWillReceiveProps()` {#unsafe_componentwillreceiveprops}

```javascript
UNSAFE_componentWillReceiveProps(nextProps)
```

> Remarque
>
> Cette méthode de cycle de vie s’appelait à l’origine `componentWillReceiveProps`. Ce nom continuera à fonctionner jusqu’à la sortie de React 17. Utilisez le [codemod `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) pour mettre à jour automatiquement vos composants.

> Attention
>
> Utiliser cette méthode de cycle de vie aboutit le plus souvent à des bugs de cohérence.
>
>* Si vous aviez besoin de **réaliser un effet de bord** (par exemple, charger des données ou dérouler une animation) en réponse à une modification des props, utilisez plutôt la méthode de cycle de vie [`componentDidUpdate`](#componentdidupdate).
>* Si vous utilisiez `componentWillReceiveProps` pour **recalculer des données seulement quand une prop change**, [utilisez plutôt un utilitaire de mémoïsation](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
>* Si vous utilisiez `componentWillReceiveProps` pour **« réinitialiser » une partie de l’état local quand une prop change**, voyez s’il ne serait pas plutôt judicieux de rendre le composant [pleinement contrôlé](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) ou [pleinement non-contrôlé avec une `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).
>
> Pour les autres cas, [suivez les recommandations de notre article de blog sur la dérivation d’état](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

`UNSAFE_componentWillReceiveProps()` est appelée avant que le composant déjà monté reçoive de nouvelles props. Si vous avez besoin de mettre à jour l’état en réponse à des changements de props (par exemple, pour le réinitialiser), vous pourriez comparer `this.props` et `nextProps`, et déclencher des transitions d’état local en utilisant `this.setState()` au sein de cette méthode.

Remarquez que si un composant parent déclenche le rafraîchissement du vôtre, cette méthode sera appelée même si les props n’ont pas changé. Assurez-vous donc de comparer les valeurs actuelles et futures si vous voulez ne traiter que les modifications.

React n’appelle pas `UNSAFE_componentWillReceiveProps()` avec les props initiales lors du [montage](#mounting). Il ne l’appelle que si au moins une partie des props du composant est susceptible de changer. Appeler `this.setState()` ne déclenche généralement pas `UNSAFE_componentWillReceiveProps()`.

* * *

### `UNSAFE_componentWillUpdate()` {#unsafe_componentwillupdate}

```javascript
UNSAFE_componentWillUpdate(nextProps, nextState)
```

> Remarque
>
> Cette méthode de cycle de vie s’appelait à l’origine `componentWillUpdate`. Ce nom continuera à fonctionner jusqu’à la sortie de React 17. Utilisez le [codemod `rename-unsafe-lifecycles`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) pour mettre à jour automatiquement vos composants.

`UNSAFE_componentWillUpdate()` est appelée juste avant le rendu, quand de nouvelles props ou un nouvel état ont été reçus. C’est l’occasion de faire des travaux préparatoires avant que la mise à jour n’ait lieu. Cette méthode n’est pas appelée avant le rendu initial.

Remarquez que vous ne pouvez pas appeler `this.setState()` ici ; vous ne devez pas non plus faire quoi que ce soit (comme par exemple *dispatcher* une action Redux) qui entraînerait une mise à jour d’un composant React avant que `UNSAFE_componentWillUpdate()` ne se termine.

En général, cette méthode peut être remplacée par `componentDidUpdate()`. Si vous y lisiez des données provenant du DOM (par exemple, la position de défilement), vous pouvez en déplacer le code dans `getSnapshotBeforeUpdate()`.

> Remarque
>
> `UNSAFE_componentWillUpdate()` ne sera pas appelée si [`shouldComponentUpdate()`](#shouldcomponentupdate) renvoie `false`.

* * *

## Autres API {#other-apis-1}

Contrairement aux méthodes de cycle de vie ci-dessus (que React appelle pour vous), c’est *vous* qui appelez les méthodes ci-dessous depuis vos composants.

Il n’y en a que deux : `setState()` et `forceUpdate()`.

### `setState()` {#setstate}

```javascript
setState(updater[, callback])
```

`setState()` planifie des modifications à l’état local du composant, et indique à React que ce composant et ses enfants ont besoin d’être rafraîchis une fois l’état mis à jour. C’est en général ainsi qu’on met à jour l’interface utilisateur en réaction à des événements ou réponses réseau.

Visualisez `setState()` comme une *demande* plutôt que comme une commande immédiate qui mettrait à jour le composant. Afin d’améliorer la performance perçue, React peut différer son traitement, pour ensuite mettre à jour plusieurs composants en une seule passe. React ne guarantit pas que les mises à jour d’état sont appliquées immédiatement.

`setState()` ne met pas toujours immédiatement le composant à jour. Il peut regrouper les mises à jour voire les différer. En conséquence, lire la valeur de `this.state` juste après avoir appelé `setState()` est une mauvaise idée. Utilisez plutôt `componentDidUpdate` ou la fonction de rappel de `setState` (`setState(updater, callback)`), les deux bénéficiant d'une garantie de déclenchement après que la mise à jour aura été appliquée. Si vous avez besoin de mettre à jour l’état sur base de sa valeur précédente, lisez plus bas comment fonctionne l’argument `updater`.

`setState()` causera toujours un rendu, à moins que `shouldComponentUpdate()` ne renvoie `false`. Si vous y utilisez des objets modifiables et que la logique de rendu conditionnel ne peut pas être implémentée dans `shouldComponentUpdate()`, appeler `setState()` seulement quand le nouvel état diffère du précédent évitera des rafraîchissements superflus.

Le premier argument `updater` est une fonction dont la signature est :

```javascript
(state, props) => stateChange
```

`state` est une référence à l’état local du composant au moment où cette modification est appliquée. Cet état ne devrait pas être modifié directement. Au lieu de ça, on représente les changements à apporter en construisant un nouvel objet basé sur les données entrantes de `state` et `props`. Par exemple, imaginons que nous voulions incrémenter une valeur dans l’état à raison de `props.step` :

```javascript
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

Tant le `state` que le `props` reçus par la fonction de mise à jour sont garantis à jour au moment de l’appel. La valeur de retour de la fonction est fusionnée (en surface, pas récursivement) avec `state`.

Le second argument de `setState()` est une fonction de rappel optionnelle qui sera exécutée une fois que `setState` est terminé et le composant rafraîchi. D’une façon générale, nous vous recommandons plutôt d’utiliser `componentDidUpdate()` pour ce genre de besoin.

Vous pouvez choisir de passer un objet au lieu d’une fonction comme premier argument à `setState()` :

```javascript
setState(stateChange[, callback])
```

Ça procède à la fusion de surface de `stateChange` dans le nouvel état, par exemple pour ajuster la quantité d’une ligne de commande dans un panier d’achats :

```javascript
this.setState({quantity: 2})
```

Cette forme d’appel à `setState()` reste asynchrone, et des appels répétés au sein du même cycle pourraient être regroupés. Ainsi, si vous tentez d’incrémenter une quantité plus d’une fois dans le même cycle, vous obtiendrez l’équivalent de ceci :

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

Les appels ultérieurs vont écraser les valeurs des appels précédents du même cycle, de sorte que la quantité ne sera réellement incrémentée qu’une fois. Lorsque l’état suivant dépend de l’état en vigueur, nous vous recommandons de toujours utiliser la forme fonctionnelle du paramètre `updater` :

```js
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

Pour explorer ce sujet plus en détail, vous pouvez consulter :

* [Le guide État et cycle de vie](/docs/state-and-lifecycle.html)
* [En profondeur : Quand et pourquoi les appels à `setState()` sont-ils regroupés ?](https://stackoverflow.com/a/48610973/458193) (en anglais)
* [En profondeur : Pourquoi `this.state` ne déclenche-t-il pas une mise à jour immédiate ?](https://github.com/facebook/react/issues/11527#issuecomment-360199710) (en anglais)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

Par défaut, lorsque l’état local ou les props de votre composant changent, ce dernier se rafraîchit. Si votre méthode `render()` dépend d’autres données, vous pouvez indiquer à React que le composant a besoin d’un rafraîchissement en appelant `forceUpdate()`.

Appeler `forceUpdate()` déclenchera le `render()` du composant, en faisant l’impasse sur `shouldComponentUpdate()`. Ça déclenchera les méthodes usuelles de cycle de vie des composants enfants, y compris la méthode `shouldComponentUpdate()` de chaque enfant. React continuera à ne mettre à jour le DOM que si le balisage change.

De façon générale, vous devriez tout faire pour éviter de recourir à `forceUpdate()`, et faire que votre `render()` ne lise que `this.props` et `this.state`.

* * *

## Propriétés de classes {#class-properties-1}

### `defaultProps` {#defaultprops}

`defaultProps` peut être définie comme propriété sur la classe du composant elle-même, pour définir les valeurs par défaut de props pour cette classe. On s’en sert pour les props `undefined`, mais pas pour celles à `null`. Par exemple :

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

Si `props.color` n’est pas fournie, elle sera définie par défaut à `'blue'` :

```js
  render() {
    return <CustomButton /> ; // props.color sera définie à 'blue'
  }
```

Si `props.color` est définie à `null`,  elle restera à `null` :

```js
  render() {
    return <CustomButton color={null} /> ; // props.color reste à `null`
  }
```

* * *

### `displayName` {#displayname}

La chaîne de caractères `displayName` est utilisée dans les messages de débogage. La plupart du temps, vous n’avez pas besoin de la définir explicitement parce qu’elle est déduite du nom de la fonction ou classe qui définit le composant. Mais on peut vouloir la définir lorsqu’on veut afficher un nom différent pour des raisons de débogage ou lorsqu’on crée un composant d’ordre supérieur : vous trouverez plus de détails dans [Enrober le nom d’affichage pour faciliter le débogage](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging).

* * *

## Propriétés d’instances {#instance-properties-1}

### `props` {#props}

`this.props` contient les props définies par l’appelant de ce composant. Consultez [Composants et props](/docs/components-and-props.html) pour une introduction aux props.

Cas particulier : `this.props.children` est spéciale, généralement définie par les balises enfants dans l’expression JSX plutôt que dans la balise du composant lui-même.

### `state` {#state}

L’état local contient des données spécifiques à ce composant, qui sont susceptibles d’évoluer avec le temps. C’est vous qui définissez l’état local, qui devrait être un objet JavaScript brut.

Lorsqu’une valeur n’est utilisée ni par l’affichage ni par le flux de données (par exemple, un ID de minuteur), vous n’avez pas à la mettre dans l’état local. Ce genre de valeurs peuvent être stockées comme champs de l’instance de composant.

Consultez [État et cycle de vie](/docs/state-and-lifecycle.html) pour de plus amples informations sur l’état local.

Ne modifiez jamais `this.state` directement, car appeler `setState()` par la suite risque d’écraser les modifications que vous auriez apportées. Traitez `this.state` comme s’il était immuable.
