---
id: context
title: Contexte
permalink: docs/context.html
---

Le Contexte offre un moyen de faire passer des données à travers l'arborescence du composant sans avoir à passer manuellement les props à chaque niveau.

Dans une application React typique, les données sont passées de haut en bas (du parent à l'enfant) via les props, mais cela peut devenir lourd pour certains types de props (exemple la préférence régionale, le thème de l'interface utilisateur) qui sont nécéssaires pour beaucoup de composants au sein d'une application. Le Contexte offre un moyen de partager des valeurs comme celles-ci entre des composants sans avoir à explicitement passer une prop via chaque niveau de l'arborescence.

- [Quand utiliser le Contexte](#when-to-use-context)
- [Avant d'utiliser le Contexte](#before-you-use-context)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Context.Provider](#contextprovider)
  - [Class.contextType](#classcontexttype)
  - [Context.Consumer](#contextconsumer)
- [Exemples](#examples)
  - [Contexte dynamique](#dynamic-context)
  - [Mettre à jour le Contexte à partir d'un composant imbriqué](#updating-context-from-a-nested-component)
  - [Consommer plusieurs Contextes](#consuming-multiple-contexts)
- [Avertissements](#caveats)
- [API existante](#legacy-api)

## Quand utiliser le Contexte {#when-to-use-context}

Le Contexte est conçu pour partager des données qui peuvent être considérées comme « globales » pour une arborescence de composants React, comme l'utilisateur authentifié actuel, le thème, ou la langue privilegiée. Par exemple, dans le code si dessous nous faisons passer manuellement la prop « theme » afin de styler le composant Button :

`embed:context/motivation-problem.js`

En utilisant le Contexte, nous pouvons éviter de passer les props à travers des éléments intermédiaires :

`embed:context/motivation-solution.js`

## Avant d'utiliser le Contexte {#before-you-use-context}

Le Contexte est principalement utilisé quand certaines données doivent être accessibles par *beaucoup* de composants à différents niveaux d'imbrication. Utilisez le avec parcimonie car ça rend la réutilisation des composants difficile.

**Si vous voulez seulement éviter de passer certaines propos à travers beaucoup de niveaux, [la composition des composants](/docs/composition-vs-inheritance.html) est souvent une solution plus simple que le contexte.**

Par exemple, prenez un composant `Page` qui passe une prop `user` et `avatarSize` plusieurs niveaux plus bas pour que les composants profondément imbriqués `Link` et `Avatar` puissent le lire :

```js
<Page user={user} avatarSize={avatarSize} />
// ... qui fait le rendu de ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... qui fait le rendu de ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... qui fait le rendu de ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

Ça peut paraître redondant de passer les props `user` and `avatarSize` à travers plusieurs niveaux, si à la fin, seulement le composant `Avatar` en a réellement besoin. C'est aussi ennuyeux qu'à chaque fois que le composant `Avatar` a besoin de plus de props d'en haut, vous ayez à l'ajouter à tous les niveau.

Une des possibilité de résoudre ce problème **sans le contexte** serait de [transmettre le composant `Avatar` lui-même](/docs/composition-vs-inheritance.html#containment) de façon à ce que les composants intermédiaires n'aient pas besoin d'avoir connaissance des props `user` ou `avatarSize`:

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

// Maintenant nous avons :
<Page user={user} avatarSize={avatarSize} />
// ... qui fait le rendu de ...
<PageLayout userLink={...} />
// ... qui fait le rendu de ...
<NavigationBar userLink={...} />
// ... qui fait le rendu de ...
{props.userLink}
```

Avec ce changement, seulement le composant le plus haut placé, Page, a besoin de savoir l'utilisation de `user` et `avatarSize` des composants `Link` et `Avatar`.

Cette *inversion de contrôle* peut rendre votre code plus propre dans beaucoup de cas en réduisant le nombre de props que vous avez besoin de passer à travers votre application et vous donne plus de contrôle sur les composants racines. Cependant, ce n'est pas le bon choix dans tous les cas : déplacer plus de complexicité plus haut dans l'arborescence rend les composants de niveau supérieur plus compliqués et force les composants de bas niveau à être plus flexible que vous voulez.

Vous n'êtes pas limité à un unique enfant pour un composant. Vous pouvez passer plusieurs enfants, ou même avoir plusieurs « slots » séparés comme enfants [comme documenté ici](/docs/composition-vs-inheritance.html#containment) :

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

Ce motif est suffisant pour beaucoup de cas lorsque vous avez besoin de découpler un enfant de ses parents directs. Vous pouvez aller encore plus loin avec les [props de rendu](/docs/render-props.html) si l'enfant à besoin de communiquer avec le parent avant de faire son rendu.

Cepandant, parfois les mêmes données ont besoin d'être accessibles par beaucoup de composants dans l'arborescence, et à différents niveaux d'imbrication. Le Contexte vous permet de « diffuser » ces données, et leurs changements, à tous les composants en dessous. Les exemples courants où l'utilisation du Contexte pourrait être plus simple que les alternatives incluent la gestion de la locale, du thème ou d'un cache de données.

## API {#api}

### `React.createContext` {#reactcreatecontext}

```js
const MyContext = React.createContext(defaultValue);
```

Créé un objet Context. Lorsque React fait le rendu d'un composant qui s'abonne à cet objet Context il va lire la valeur actuelle du contexte du `Provider` *(fournisseur, NdT)* le plus proche situé au-dessus de lui dans l'arborescence.

L'argument `defaultValue` est **uniquement** utilisé lorsqu'un composant n'a pas de Provider correspondant au-dessus de lui dans l'arborescence. Ça peut être utile pour tester des composants de manière isolée sans les entourer. Remarque : passer `undefined` comme valeur au Provider ne fait pas utiliser `defaultValue` aux composants consommateurs.

### `Context.Provider` {#contextprovider}

```js
<MyContext.Provider value={/* une valeur */}>
```

Chaque objet Contexte est livré avec un composant React Provider qui permet au composant consommateurs de s'abonner aux changements du contexte.

Il accepte une prop `value` à transmettre aux composants consommateurs qui sont descendants de ce Provider. Un Provider peut être connecté à plusieurs consommateurs. Les Providers peuvent être imbriqués pour remplacer des valeurs plus profondes dans l'arborescence.

Tous les consommateurs qui sont descendants d'un Provider vont refaire leur rendu lorsque la prop `value` du Provider change. La propagation du Provider vers ses consommateurs descendants n'est pas sujet à la méthode `shouldComponentUpdate`, de sorte que le consommateur est mis à jour même lorsqu'un composant ancêtre abbandonne la mise à jour.

Les changements sont determinés en comparant les nouvelles et les anciennes valeurs en utilisant le même algorithme que [`Object.is`](//developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/is#Description). 

> Remarque
> 
> La manière dont les changement sont determinés peuvent provoquer des problèmes lorsque l'on passe des objets dans `value`: voir [Avertissements](#caveats).

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
    /* fait le rendu de quelque chose basé sur la valeur de MyContext */
  }
}
MyClass.contextType = MyContext;
```

La propriété `contextType` sur une classe peut avoir un objet Contexte assigné créé par [`React.createContext()`](#reactcreatecontext). Ça vous permet de consommer la valeur la plus proche de ce Contexte en utilisant `this.context`. Vous pouvez y faire référence dans toutes les méthodes du cycle de vie, y compris la fonction de rendu.

> Remarque:
>
> Vous pouvez vous abonner à un unique contexte en utilisant cette API. Si vous voulez lire plus d'un contexte, voir [Consommer plusieurs contextes](#consuming-multiple-contexts).
>
> Si vous utilisez [la syntaxe des champs publics de classe](https://babeljs.io/docs/plugins/transform-class-properties/) expérimentale, vous pouvez utiliser un champ **statique**  de classe pour initialiser votre `contextType`.


```js
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* fait le rendu de quelque chose basé sur la valeur */
  }
}
```

### `Context.Consumer` {#contextconsumer}

```js
<MyContext.Consumer>
  {value => /* fait le rendu de quelque chose basé sur la valeur du contexte */}
</MyContext.Consumer>
```

Un composant React qui s'abonne aux changement de contexte. Ça permet de s'abonner à un contexte au sein d'une [fonction composant](/docs/components-and-props.html#function-and-class-components).

Nécéssite une [fonction comme enfant](/docs/render-props.html#using-props-other-than-render). La fonction reçoit le contexte actuel et retourne un nœud React. L'argument `value` envoyé à la fonction sera égale à la prop `value` du Provider le plus proche pour le contexte ci dessous dans l'arborescence. Si il n'y pas de Provider pour le contexte ci dessous, l'argument `value` sera egal à la `defaultValue` qui était passée au `createContext()`.

> Remarque
> 
> Pour plus d'informations à propos du modèle 'fonction comme enfant', voir [	props de rendu](/docs/render-props.html).

## Exemples {#examples}

### Contexte dynamique {#dynamic-context}

Un exemple plus complexe avec des valeurs dynamique pour le thème :

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

### Mettre à jour le Contexte à partir d’un composant imbriqué {#updating-context-from-a-nested-component}

Il est souvent nécéssaire de mettre à jour le contexte d'un composant qui est imbriqué quelque part profondément dans l'arborescence d'un composant. Dans ce cas, vous pouvez une fonction à travers le contexte qui permet aux consommateurs de mettre à jour le contexte :

**theme-context.js**
`embed:context/updating-nested-context-context.js`

**theme-toggler-button.js**
`embed:context/updating-nested-context-theme-toggler-button.js`

**app.js**
`embed:context/updating-nested-context-app.js`

### Consommer plusieurs Contextes {#consuming-multiple-contexts}

Pour que le contexte refasse son rendu de manière qui reste rapide, React a besoin de faire de chaque consommateur de contexte un nœud à part dans l'arborescence. 

`embed:context/multiple-contexts.js`

Si une ou plus de valeurs de contexte sont souvent utilisées ensemble, vous pouvez peut-être considérer créer votre propre composant en prop de rendu qui fournit les deux.

## Avertissement {#caveats}

Parce que le contexte utilise l'identité de la référence pour déterminer quand faire son rendu, il y a des fonctionnalités contre-intuitives qui peuvent déclancher des rendus involontaires pour les consommateurs lorsque le parent d'un provider refait son rendu. Par exemple, le code ci-dessous va refaire le rendu de chaque consommateur à chaque fois que le Provider refait son rendu parce qu'un nouvel objet est créé à chaque fois pour `value` :

`embed:context/reference-caveats-problem.js`

Pour contourner ce problème, placez la valeur dans l'état du parent :

`embed:context/reference-caveats-solution.js`

## API existante {#legacy-api}

> Remarque
> 
> React embarquait précedemment une API expérimentale sur le contexte. L'ancienne API sera supporté par toutes les versions 16.x, mais les applications l'utilisant devraient migrer sur la nouvelle version. L'API existante sera supprimée dans une future version majeure de React. Lire la [documentation sur le contexte existant ici](/docs/legacy-context.html).
 
