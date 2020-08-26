---
id: context
title: Contexte
permalink: docs/context.html
prev: reconciliation.html
next: fragments.html
---

Le Contexte offre un moyen de faire passer des données à travers l'arborescence du composant sans avoir à passer manuellement les props à chaque niveau.

Dans une application React typique, les données sont passées de haut en bas (du parent à l'enfant) via les props, mais cela peut devenir lourd pour certains types de props (ex. les préférences régionales, le thème de l'interface utilisateur) qui s'avèrent nécessaires pour de nombreux composants au sein d'une application. Le Contexte offre un moyen de partager des valeurs comme celles-ci entre des composants sans avoir à explicitement passer une prop à chaque niveau de l'arborescence.

- [Quand utiliser le Contexte](#when-to-use-context)
- [Avant d'utiliser le Contexte](#before-you-use-context)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Context.Provider](#contextprovider)
  - [Class.contextType](#classcontexttype)
  - [Context.Consumer](#contextconsumer)
  - [Context.displayName](#contextdisplayname)
- [Exemples](#examples)
  - [Contexte dynamique](#dynamic-context)
  - [Mettre à jour le Contexte à partir d'un composant imbriqué](#updating-context-from-a-nested-component)
  - [Consommer plusieurs Contextes](#consuming-multiple-contexts)
- [Limitations](#caveats)
- [API historique](#legacy-api)

## Quand utiliser le Contexte {#when-to-use-context}

Le Contexte est conçu pour partager des données qui peuvent être considérées comme « globales » pour une arborescence de composants React, comme l'utilisateur actuellement authentifié, le thème, ou la préférence de langue. Par exemple, dans le code ci-dessous nous faisons passer manuellement la prop `theme` afin de styler le composant `Button` :

`embed:context/motivation-problem.js`

En utilisant le Contexte, nous pouvons éviter de passer les props à travers des éléments intermédiaires :

`embed:context/motivation-solution.js`

## Avant d'utiliser le Contexte {#before-you-use-context}

Le Contexte est principalement utilisé quand certaines données doivent être accessibles par de *nombreux* composants à différents niveaux d'imbrication. Utilisez-le avec parcimonie car il rend la réutilisation des composants plus difficile.

**Si vous voulez seulement éviter de passer certaines props à travers de nombreux niveaux, [la composition des composants](/docs/composition-vs-inheritance.html) est souvent plus simple que le contexte.**

Par exemple, prenez un composant `Page` qui passe des props `user` et `avatarSize` plusieurs niveaux plus bas pour que les composants profondément imbriqués `Link` et `Avatar` puissent les lire :

```js
<Page user={user} avatarSize={avatarSize} />
// ... qui affiche ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... qui affiche ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... qui affiche ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

Ça peut paraître redondant de passer les props `user` et `avatarSize` à travers plusieurs niveaux, si au final seul le composant `Avatar` en a réellement besoin. Il est également pénible qu'à chaque fois que le composant `Avatar` a besoin de davantage de props d'en haut, vous ayez à les ajouter à tous les niveaux.

Un des moyens de résoudre ce problème **sans le contexte** consisterait à [transmettre le composant `Avatar` lui-même](/docs/composition-vs-inheritance.html#containment) de façon à ce que les composants intermédiaires n'aient pas besoin de connaître les props `user` ou `avatarSize` :

```js
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// À présent nous avons :
<Page user={user} avatarSize={avatarSize} />
// ... qui affiche ...
<PageLayout userLink={...} />
// ... qui affiche ...
<NavigationBar userLink={...} />
// ... qui affiche ...
{props.userLink}
```

Avec cette modification, seulement le composant le plus haut placé, `Page`, a besoin de connaître l'utilisation de `user` et `avatarSize` par les composants `Link` et `Avatar`.

Cette *inversion de contrôle* peut rendre votre code plus propre dans de nombreux cas en réduisant le nombre de props que vous avez besoin de passer à travers votre application et vous donne plus de contrôle sur les composants racines. Cependant, ce n'est pas toujours la bonne approche : déplacer la complexité vers le haut de l'arborescence rend les composants des niveaux supérieurs plus compliqués et force les composants de plus bas niveau à être plus flexibles que vous pourriez le souhaiter.

Vous n'êtes pas limité·e à un unique enfant pour un composant. Vous pouvez passer plusieurs enfants, ou même prévoir dans votre JSX plusieurs emplacements séparés pour les enfants [comme documenté ici](/docs/composition-vs-inheritance.html#containment) :

```js
function Page(props) {
  const user = props.user;
  const content = <Feed user={user} />;
  const topBar = (
    <NavigationBar>
      <Link href={user.permalink}>
        <Avatar user={user} size={props.avatarSize} />
      </Link>
    </NavigationBar>
  );
  return (
    <PageLayout
      topBar={topBar}
      content={content}
    />
  );
}
```

Ce motif est suffisant pour les nombreux cas où vous avez besoin de découpler un enfant de ses parents directs. Vous pouvez aller encore plus loin avec les [props de rendu](/docs/render-props.html) si l'enfant a besoin de communiquer avec le parent avant de s'afficher.

Cependant, parfois les mêmes données ont besoin d'être accessibles par de nombreux composants dans l'arborescence, et à différents niveaux d'imbrication. Le Contexte vous permet de « diffuser » ces données, et leurs mises à jour, à tous les composants plus bas dans l'arbre. Les exemples courants où l'utilisation du Contexte apporte une simplification incluent la gestion des préférences régionales, du thème ou d'un cache de données.

## API {#api}

### `React.createContext` {#reactcreatecontext}

```js
const MyContext = React.createContext(defaultValue);
```

Crée un objet Context. Lorsque React affiche un composant qui s'abonne à cet objet `Context`, il lira la valeur actuelle du contexte depuis le `Provider` le plus proche situé plus haut dans l'arborescence.

L'argument `defaultValue` est **uniquement** utilisé lorsqu'un composant n'a pas de `Provider` correspondant au-dessus de lui dans l'arborescence. Ça peut être utile pour tester des composants de manière isolée sans les enrober. Remarquez que passer `undefined` comme valeur au `Provider` n’aboutit pas à ce que les composants consommateurs utilisent `defaultValue`.

### `Context.Provider` {#contextprovider}

```js
<MyContext.Provider value={/* une valeur */}>
```

Chaque objet Contexte est livré avec un composant React `Provider` qui permet aux composants consommateurs de s'abonner aux mises à jour du contexte.

Il accepte une prop `value` à transmettre aux composants consommateurs descendants de ce `Provider`(plus bas dans l'arbre, donc). Un `Provider` peut être connecté à plusieurs consommateurs. Les `Provider` peuvent être imbriqués pour remplacer leur valeur plus profondément dans l'arbre.

Tous les consommateurs qui sont descendants d'un `Provider` se rafraîchiront lorsque la prop `value` du `Provider` change. La propagation du `Provider` vers ses consommateurs descendants (y compris [`.contextType`](#classcontexttype) et [`useContext`](/docs/hooks-reference.html#usecontext)) n'est pas assujettie à la méthode `shouldComponentUpdate`, de sorte que le consommateur est mis à jour même lorsqu'un composant ancêtre saute sa mise à jour.

On détermine si modification il y a en comparant les nouvelles et les anciennes valeurs avec le même algorithme que [`Object.is`](//developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/is#Description).

> Remarque
>
> La manière dont les modifications sont déterminées peut provoquer des problèmes lorsqu’on passe des objets dans `value` : voir les [limitations](#caveats).

### `Class.contextType` {#classcontexttype}

```js
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* produit un effet de bord au montage sur la valeur de MyContext */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* affiche quelque chose basé sur la valeur de MyContext */
  }
}
MyClass.contextType = MyContext;
```

La propriété `contextType` d’une classe peut recevoir un objet Contexte créé par [`React.createContext()`](#reactcreatecontext). Ça vous permet de consommer la valeur la plus proche de ce Contexte en utilisant `this.context`. Vous pouvez la référencer dans toutes les méthodes de cycle de vie, y compris la fonction de rendu.

> Remarque
>
> Vous pouvez vous abonner à un unique contexte en utilisant cette API. Si vous voulez lire plus d'un contexte, voyez [Consommer plusieurs contextes](#consuming-multiple-contexts).
>
> Si vous utilisez [la syntaxe expérimentale des champs publics de classe](https://babeljs.io/docs/plugins/transform-class-properties/), vous pouvez utiliser un champ **statique**  de classe pour initialiser votre `contextType`.


```js
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* Affiche quelque chose basé sur la valeur */
  }
}
```

### `Context.Consumer` {#contextconsumer}

```js
<MyContext.Consumer>
  {value => /* affiche quelque chose basé sur la valeur du contexte */}
</MyContext.Consumer>
```

Un composant React qui s'abonne aux modifications de contexte. Ça permet de s'abonner à un contexte au sein d'une [fonction composant](/docs/components-and-props.html#function-and-class-components).

Nécessite une [fonction enfant](/docs/render-props.html#using-props-other-than-render). La fonction reçoit le contexte actuel et renvoie un nœud React. L'argument `value` envoyé à la fonction sera égal à la prop `value` du `Provider` le plus proche (plus haut dans l'arbre) pour le contexte en question. Si il n'y pas de `Provider` pour le contexte voulu, l'argument `value` sera égal à la `defaultValue` passée lors de son `createContext()`.

> Remarque
>
> Pour en apprendre davantage sur l'approche « fonction enfant », voyez les [props de rendu](/docs/render-props.html).

### `Context.displayName` {#contextdisplayname}

Les objets Contexte permettent une propriété textuelle `displayName`.  Les Outils de développement React l’utilisent pour déterminer comment afficher le contexte.

Par exemple, le composant ci-après apparaîtra dans les Outils de développement en tant que MyDisplayName :

```js{2}
const MyContext = React.createContext(/* une valeur */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" dans les DevTools
<MyContext.Consumer> // "MyDisplayName.Consumer" dans les DevTools
```

## Exemples {#examples}

### Contexte dynamique {#dynamic-context}

Un exemple plus complexe avec des valeurs dynamiques pour le thème :

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

### Mettre à jour le Contexte à partir d’un composant imbriqué {#updating-context-from-a-nested-component}

Il est souvent nécessaire de mettre à jour le contexte à partir d'un composant imbriqué profondément dans l’arbre des composants. Dans un tel cas, vous pouvez passer une fonction à travers le contexte qui permet aux consommateurs de le mettre à jour :

**theme-context.js**
`embed:context/updating-nested-context-context.js`

**theme-toggler-button.js**
`embed:context/updating-nested-context-theme-toggler-button.js`

**app.js**
`embed:context/updating-nested-context-app.js`

### Consommer plusieurs Contextes {#consuming-multiple-contexts}

Pour conserver un rafraîchissement rapide du contexte, React a besoin que chaque consommateur de contexte soit un nœud à part dans l'arborescence.

`embed:context/multiple-contexts.js`

Si plusieurs valeurs de contexte sont souvent utilisées ensemble, vous voudrez peut-être créer votre propre composant avec prop de rendu qui fournira les deux.

## Limitations {#caveats}

Dans la mesure où le contexte utilise une identité référentielle pour déterminer quand se rafraîchir, il y a des cas piégeux qui peuvent déclencher des rafraîchissements involontaires pour les consommateurs lorsque le parent d'un fournisseur se rafraîchit. Par exemple, le code ci-dessous va rafraîchir chaque consommateur, le `Provider` se rafraîchissant lui-même parce qu'un nouvel objet est créé à chaque fois pour `value` :

`embed:context/reference-caveats-problem.js`

Pour contourner ce problème, placez la valeur dans l'état du parent :

`embed:context/reference-caveats-solution.js`

## API historique {#legacy-api}

> Remarque
>
> React fournissait auparavant une API de contextes expérimentale. L'ancienne API restera prise en charge par toutes les versions 16.x, mais les applications qui l'utilisent devraient migrer vers la nouvelle version. L'API historique sera supprimée dans une future version majeure de React. Lisez la [documentation sur l’API historique de contexte ici](/docs/legacy-context.html).
