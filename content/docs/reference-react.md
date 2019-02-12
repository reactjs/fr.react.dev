---
id: react-api
title: L'API haut-niveau de React
layout: docs
category: Reference
permalink: docs/react-api.html
redirect_from:
  - "docs/reference.html"
  - "docs/clone-with-props.html"
  - "docs/top-level-api.html"
  - "docs/top-level-api-ja-JP.html"
  - "docs/top-level-api-ko-KR.html"
  - "docs/top-level-api-zh-CN.html"
---

l'objet `React` est le point d'entrée de la bibliothèque React. Si vous chargez React depuis une balise `<script>`, ces API de haut-niveau sont disponibles depuis l'objet global `React`. Si vous utilisez npm avec la syntax ES6, vous pouvez écrire : `import React from 'react'`. Si vous utilisez npm avec la syntaxe ES5, vous pouvez écrire : `var React = require('react')`.

## Aperçu de l'API {#overview}

### Composants {#components}

Les composant React vous permettent de séparer une UI (_User Interface_: Interface utilisateur) en pièces indépendantes et réutilisables, ce qui vous permet de concevoir chaque pièce isolément. Un composant React peut être défini en étendant les classes `React.Component` ou `React.PureComponent`.

 - [`React.Component`](#reactcomponent)
 - [`React.PureComponent`](#reactpurecomponent)

Si vous n'utilisez pas les classes ES6, vous pouvez utiliser le module `create-react-class` à la place. Lisez [Utiliser React sans ES6](/docs/react-without-es6.html) pour plus de détails.

Un composant React peut aussi être définie via une fonction que l'on va encapsuler :

- [`React.memo`](#reactmemo)

### Créer des éléments React {#creating-react-elements}

Nous vous recommandons d'[utiliser JSX](/docs/introducing-jsx.html) pour définir à quoi ressemblera votre UI. Tous les éléments JSX ne sont que du sucre syntaxique par dessus des appels à [`React.createElement()`](#createelement). Si vous utilisez JSX, vous ne devriez pas avoir besoin d'appeler les méthodes suivantes :

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

Lisez [Utiliser React sans JSX](/docs/react-without-jsx.html) pour plus de détails.

### Transformer des éléments {#transforming-elements}

`React` propose plusieurs API pour manipuler les éléments :

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#reactchildren)

### Fragments {#fragments}

`React` fournis également un composant spécial pour rendre plusieurs éléments sans avoir à les enrober avec un autre élément.

- [`React.Fragment`](#reactfragment)

### Refs {#refs}

- [`React.createRef`](#reactcreateref)
- [`React.forwardRef`](#reactforwardref)

### Suspense {#suspense}

Le *Suspense* permet aux composants « d'attendre » quelque chose avant d'être rendu. Aujourd'hui, le *Suspense* ne supporte qu'un seul cas d'usage : [Le chargement dynamique de composants avec `React.lazy`](/docs/code-splitting.html#reactlazy). Dans le future, il supportera d'autres cas d'usages tel que le chargement de données distantes.

- [`React.lazy`](#reactlazy)
- [`React.Suspense`](#reactsuspense)

### Hooks {#hooks}

Les *Hooks* sont une nouveauté de React 16.8. Ils vous permettent d'utiliser les états et d'autres fonctionnalités de React sans avoir à écrire de classes. Les *Hooks* disposent de [leur propre documentation](/docs/hooks-intro.html) et leur API est détaillée à part :

- [*Hooks* de base](/docs/hooks-reference.html#basic-hooks)
  - [`useState`](/docs/hooks-reference.html#usestate)
  - [`useEffect`](/docs/hooks-reference.html#useeffect)
  - [`useContext`](/docs/hooks-reference.html#usecontext)
- [*Hooks* supplémentaires](/docs/hooks-reference.html#additional-hooks)
  - [`useReducer`](/docs/hooks-reference.html#usereducer)
  - [`useCallback`](/docs/hooks-reference.html#usecallback)
  - [`useMemo`](/docs/hooks-reference.html#usememo)
  - [`useRef`](/docs/hooks-reference.html#useref)
  - [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)
  - [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect)
  - [`useDebugValue`](/docs/hooks-reference.html#usedebugvalue)

* * *

## Référence {#reference}

### `React.Component` {#reactcomponent}

`React.Component` est la classe de base utilisée pour créer des composants React avec la syntaxe des [classes ES6](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) :

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Bonjour {this.props.name}</h1>;
  }
}
```

Rendez-vous sur [la page de référence de l'API `React.Component`](/docs/react-component.html) pour voir la liste complète des méthodes et propriétés de la classe de base `React.Component`.

* * *

### `React.PureComponent` {#reactpurecomponent}

`React.PureComponent` est similaire à [`React.Component`](#reactcomponent). La seul différence est que [`React.Component`](#reactcomponent) n'implémente pas la méthode [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) là où `React.PureComponent` en implémente une version qui réalise une comparaison de surface de l'état et des propriétés.

Si la fonction `render()` d'un de vos composants React produit un rendu identique pour le même état ou les même propriétés, utiliser `React.PureComponent` devrait améliorer les performances dans certains cas.


> Remarque
>
> La méthode `shouldComponentUpdate()` de `React.PureComponent` réalise une simple comparaison de surface. Avec des données complexes, elle peut produire des faux positifs si la structure de données subit des changements profond. Ne créez des composants avec `PureComponent` que si vous avez des états ou des props simples, le cas échéant utilisez [`forceUpdate()`](/docs/react-component.html#forceupdate) si vous savez que vos données ont profondément changées. Vous pouvez aussi envisager d'utiliser des [objets immuables](https://facebook.github.io/immutable-js/) pour simplifier la comparaison rapide de données imbriquées.
>
> De plus, la méthode `shouldComponentUpdate()` de `React.PureComponent` ignore la mise à jour des propriétés de tout l'arbre des composants enfants. Assurez vous que tout les composants enfants sont également "pure".

* * *

### `React.memo` {#reactmemo}

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* Faire le rendu en utilisant les props */
});
```

`React.memo` est un [composant d'ordre supérieur](/docs/higher-order-components.html). Il est similaire à [`React.PureComponent`](#reactpurecomponent) mais à destination des composants créés à l'aide de fonctions plutôt que de classes.

Si vous avec un composant créés avec une fonction et qu'il affiche toujours le même résultat pour un même jeu de propriétés, vous pouvez l'encapsuler avec `React.memo` ce qui mémoïsera le résultat et devrait augmenter les performances dans certain cas.

Par défaut, seule une comparaison de surface des objets de propriétés sera faite. Si vous voulez gérer cette comparaison vous-même, vous pouvez fournir une fonction de comparaison personnalisée en deuxième argument.

```javascript
function MyComponent(props) {
  /* Faire le rendu en utilisant les props */
}
function areEqual(prevProps, nextProps) {
  /*
  Renvoie vrai si utiliser l'objet nextProps à la fonction de rendu
  produira le même résultat que de lui passer l'objet prevProps.
  Renvoie faux si ce n'est pas le cas.
  */
}
export default React.memo(MyComponent, areEqual);
```

Cette méthode n'est qu'un outil d'**[optimisation de performance](/docs/optimizing-performance.html)**. Ne vous y fiez pas pour “empêcher” un rendu car cela peut causer des bugs.

> Remarque
>
> Contrairement à la méthode [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) des compostants créer à l'aide de classes, la fonction `areEqual` renvoie `true` si les props sont égales et `false` si ce n'est pas le cas. C'est donc l'inverse de `shouldComponentUpdate`.

* * *

### `createElement()` {#createelement}

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

Cette méthode Créée et renvoie un nouvel [element React](/docs/rendering-elements.html) du type choisie. L'argument `type` peut être au choix : une chaine représentant un nom de balise (tel que `'div'` ou `'span'`), un type de [composant React](/docs/components-and-props.html) (une classe ou une fonction), ou bien un objet de type [fragment React](#reactfragment).

Tout code écrit avec [JSX](/docs/introducing-jsx.html) sera convertis de manière à utiliser `React.createElement()`. Normalement vous ne devriez pas appeler `React.createElement()` si vous utilisez JSX. Lisez [React sans JSX](/docs/react-without-jsx.html) pour en savoir plus.

* * *

### `cloneElement()` {#cloneelement}

```
React.cloneElement(
  element,
  [props],
  [...children]
)
```

Cette méthode clone et renvoie un nouvel element en utilisant `element` comme point de départ. L'élément obtenu aura les props de l'élément originel sur lesquelles ont aura effectué une fusion de surface des nouvelles props. Les nouveaux elements enfants replaceront les anciens. les `key` et `ref` issues de l'élément originel seront préservées.

`React.cloneElement()` est quasiment équivalent à :

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

Cependant elle préserve les `ref`. Concrètement, ça signifie que si vous avez un element enfant avec une `ref` qui lui est attaché, vous ne le volerez pas accidentellement à son ancêtre. Vous aurez la même `ref` attaché à un nouvel élément.

Cette API a été introduite pour remplacer la méthode dépréciée `React.addons.cloneWithProps()`.

* * *

### `createFactory()` {#createfactory}

```javascript
React.createFactory(type)
```

Cette méthode renvoie une fonction qui produit des éléments React d'un type donné. Tout comme [`React.createElement()`](#createElement), l'argument `type` peut être au choix : une chaine représentant un nom de balise (tel que `'div'` ou `'span'`), un type de [composant React](/docs/components-and-props.html) (une classe ou une fonction), ou bien un objet de type [fragment React](#reactfragment).

Cette fonction d'aide est historique et nous vous encourageons à plutôt utiliser JSX ou directement `React.createElement()`.

Normalement vous ne devriez pas appeler `React.createFactory()` si vous utilisez JSX. Lisez [React sans JSX](/docs/react-without-jsx.html) pour en savoir plus.

* * *

### `isValidElement()` {#isvalidelement}

```javascript
React.isValidElement(object)
```

Cette méthode vérifie qu'un objet est bien un élément React. Elle renvoie `true` ou `false`.

* * *

### `React.Children` {#reactchildren}

`React.Children` fournit des utilitaires pour interagir avec la structure de données opaque de `this.props.children`.

#### `React.Children.map` {#reactchildrenmap}

```javascript
React.Children.map(children, function[(thisArg)])
```

Cette méthode exécute une fonction sur chacun des enfants direct contenu dans `children` avec `this` défini pour être `thisArg`. Si `children` est un tableau, il sera parcouru et la fonction sera appelée sur chacun des enfants contenu dans ce tableau. Si `children` est `null` ou `undefined`, elle renverra `null` ou `undefined` plutôt qu'un tableau.

> Remarque
>
> Si `children` est un `Fragment` il sera traité comme un unique enfant et ne sera pas parcouru.

#### `React.Children.forEach` {#reactchildrenforeach}

```javascript
React.Children.forEach(children, function[(thisArg)])
```

Même chose que [`React.Children.map()`](#reactchildrenmap) mais sans renvoyer de tableau.

#### `React.Children.count` {#reactchildrencount}

```javascript
React.Children.count(children)
```

Cette méthode renvoie le nombre total de composant présent dans `children`, ce total étant égale au nombre de fois ou une fonction de rappel passée à `map` or `forEach` serait exécutée.

#### `React.Children.only` {#reactchildrenonly}

```javascript
React.Children.only(children)
```

Cette méthode vérifie que `children` n'a qu'un seul enfant (un élément React) et le renvoie. Si ce n'est pas le cas elle lancera une erreur.

> Remarque :
>
> `React.Children.only()` n'accepte pas le type de valeur retourné par [`React.Children.map()`](#reactchildrenmap) car il s'agit d'un tableaux et pas d'un éléments React.

#### `React.Children.toArray` {#reactchildrentoarray}

```javascript
React.Children.toArray(children)
```

Cette méthode renvoie la structure de donnée opaque de `children` sous la forme d'un tableau linéarisé ou chaque enfant se voie assigné une `key`. C'est utile si vous voulez manipuler une collection d'enfant dans votre méthode de rendu, en particulier si vous voulez réorganiser ou réduire `this.props.children` avant de le passer à d'autres élements.

> Remarque :
>
> `React.Children.toArray()` change les `key` pour préserver la sémantique des tableaux imbriqués pendant la linéarisation des enfants. Sa signifie que `toArray` préfixe chaque `key` dans le tableau qui sera renvoyé de manière a ce que la `key` de chaque élément soit associée au tableau originel qui les contient.

* * *

### `React.Fragment` {#reactfragment}

Le composant `React.Fragment` vous permet de renvoyer plusieurs éléments depuis une méthode `render()` sans avoir à créer un élément DOM supplémentaire.

```javascript
render() {
  return (
    <React.Fragment>
      Du texte.
      <h2>Un en-tête</h2>
    </React.Fragment>
  );
}
```

Vous pouvez également l'utiliser via la syntaxe raccourcie `<></>` . Pour plus d'information, lisez [_React v16.2.0: Improved Support for Fragments_ (en)](/blog/2017/11/28/react-v16.2.0-fragment-support.html).


### `React.createRef` {#reactcreateref}

`React.createRef` créée une [`ref`](/docs/refs-and-the-dom.html) qui peut être associée à des éléments React via l'attribut `ref`.
`embed:16-3-release-blog-post/create-ref-example.js`

### `React.forwardRef` {#reactforwardref}

`React.forwardRef` créée un composant React qui transfert la valeur de l'attribut [ref](/docs/refs-and-the-dom.html) qu'il reçoit à un autre composant plus bas dans l'arbre. Cette technique est assez inhabituel mais elle est particulièrement utile dans deux cas :

* [Transférer une référence à un composant DOM](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
* [Transférer une référence à un composant de haut niveau](/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

`React.forwardRef` prend une fonction de rendu comme argument. React appellera cette fonction avec deux arguments `props` et `ref`. Cette fonction devrait renvoyer un nœud React.

`embed:reference-react-forward-ref.js`

Dans l'exemple ci-avant, la fonction de rendu passé à `React.forwardRef` va recevoir comme deuxième argument la `ref` initialement donnée à l'élément `<FancyButton ref={ref}>`. Cette fonction va alors transférer la `ref` à l'élément `<button ref={ref}>`.

En conséquence, après que React ait attaché la ref, `ref.current` pointera directement vers l'instance de l'élément DOM de `<button>`.

Pour plus d'information, lisez [Transférer les refs](/docs/forwarding-refs.html)

### `React.lazy` {#reactlazy}

`React.lazy()` vous permet de définir un composant qui sera chargé dynamiquement. Cela aide à réduire la taille du fichier initial en reportant à plus tard le chargement des composants inutiles lors du rendu initial.

Vous pouvez apprendre comment l'utiliser en lisant [la documentation sur l'organisation du code](/docs/code-splitting.html#reactlazy). Vous pouvez aussi vouloir lire [cette article](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d) qui explique comment l'utiliser en détail.

```js
// Ce composant est chargé dynamiquement
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

Vous noterez que l'affichage d'un composant `lazy` à besoin d'un composant `<React.Suspense>` plus haut dans l'arbre de rendu. C'est de cette manière que vous pouvez spécifier un indicateur de chargement.

> **Remarque**
>
> Utiliser `React.lazy` avec un import dynamique requiers que l'environnement JS supporte les _Promises_. Vous aurez donc besoin de _polyfill_ pour IE11 et inférieur.

### `React.Suspense` {#reactsuspense}

`React.Suspense` vous permet de définir un indicateur de chargement dans le cas ou certain composants de l'arbre des composants ne sont pas près à être affiché. Aujourd'hui le **seul** cas d'usage supporté par `<React.Suspense>` est le chargement de composant différé via [`React.lazy`](#reactlazy) :

```js
// Ce composant est chargé dynamiquement
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // Affiche <Spinner> jusqu'a ce que <OtherComponent> soit chargé
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

Tout est détaillé dans [la documentation sur l'organisation du code](/docs/code-splitting.html#reactlazy). Vous noterez que les composants `lazy` peuvent êtres profondément enfouis dans l'arbre des enfants de `Suspense` -- Ils n'ont pas besoin d'être enveloppés individuellement. La bonne pratique consiste à placer un `<Suspense>` partout où vous souhaitez voir un indicateur de chargement et à utiliser `lazy()` partout ou vous voulez découper votre code.

Bien que ce ne soit pas le cas pour le moment, nous prévoyons d'étendre les capacités de `Suspense` pour qu'il puisse gérer d'autre scénarios tel que le chargement de données. Vous pourrez en savoir plus en jetant un coup d'œil à [notre feuille de route](/blog/2018/11/27/react-16-roadmap.html).

>Remarque :
>
>`React.lazy()` et `<React.Suspense>` ne sont pas encore supportés par `ReactDOMServer`. C'est une limitation connue qui devrait être résolu dans le futur.
