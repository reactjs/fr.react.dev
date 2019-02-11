---
id: components-and-props
title: Composants et Props
permalink: docs/components-and-props.html
redirect_from:
  - "docs/reusable-components.html"
  - "docs/reusable-components-zh-CN.html"
  - "docs/transferring-props.html"
  - "docs/transferring-props-it-IT.html"
  - "docs/transferring-props-ja-JP.html"
  - "docs/transferring-props-ko-KR.html"
  - "docs/transferring-props-zh-CN.html"
  - "tips/props-in-getInitialState-as-anti-pattern.html"
  - "tips/communicate-between-components.html"
prev: rendering-elements.html
next: state-and-lifecycle.html
---

Les composants vous permettent de découper l'interface utilisateur en éléments indépendants et réutilisables, vous permettant ainsi de considérer chaque élément de manière isolée. Cette page fournit une introduction au concept de composants. Vous trouverez une [référence détaillée de l'API des composants ici](/docs/react-component.html).

Conceptuellement, les composants sont comme des fonctions JavaScript. Ils acceptent des entrées quelconques (appelées « props ») et renvoient des éléments React décrivant ce qui doit apparaître à l'écran.

## Fonctions composants et composants à base de classe {#function-and-class-components}

Le moyen le plus simple de définir un composant consiste à écrire une fonction JavaScript:

```js
function Welcome(props) {
  return <h1>Bonjour, {props.name}</h1>;
}
```

Cette fonction est un composant React valide car elle accepte un seul argument "props" (qui se traduit par "propriétés") contenant des données et renvoie un élément React. Nous appelons de tels composants "fonctions composants" car sont littéralement des fonctions JavaScript.

Vous pouvez également utiliser une [classe ES6](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes) pour définir un composant:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Bonjour, {this.props.name}</h1>;
  }
}
```

Les deux composants ci-dessus sont équivalents d'un point de vue React.

Les classes possèdent quelques fonctionnalités supplémentaires dont nous discuterons dans les [sections suivantes](/docs/state-and-lifecycle.html). En attendant, nous utiliserons les fonctions composants pour leur forme concise.

## Rendu d'un Component {#rendering-a-component}

Jusqu’ici, nous avons uniquement rencontré des éléments React qui représentent des balises DOM :

```js
const element = <div />;
```

Cependant, ces éléments peuvent également représenter des composants définis par l'utilisateur:

```js
const element = <Welcome name="Sara" />;
```

Lorsque React trouve un élément représentant un composant défini par l'utilisateur, il transmet les attributs JSX à ce composant sous la forme d'un objet unique. Nous appelons cet objet "props".

Par exemple, ce code affiche "Bonjour, Sara" sur la page:

```js{1,5}
function Welcome(props) {
  return <h1>Bonjour, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[**Essayer sur CodePen**](codepen://components-and-props/rendering-a-component)

Récapitulons ce qui se passe dans cet exemple:

1. On appelle `ReactDOM.render()` avec l'élément `<Welcome name="Sara" />`.
2. React appelle le composant `Welcome` avec comme props `{name: 'Sara'}`.
3. Notre composant `Welcome` retourne un élément `<h1>Bonjour, Sara</h1>` pour résultat.
4. Le DOM React met à jour efficacement le DOM de manière à correspondre à `<h1>Bonjour, Sara</h1>`.

>**Note:** Commencez toujours vos noms de composants par une majuscule.
>
>React concidère les composants commençant par des lettres minuscules comme des balises DOM. Par exemple, `<div />` représente une balise HTML div, mais `<Welcome />` représente un composant et nécessite `Welcome` pour appartenir aux contexte d'exécution.
>
>Vous pouvez en apprendre plus sur le raisonnement qui se cache derrière cette convention [ici.](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized)

## Composition de Componsants {#composing-components}

Les composants peuvent faire référence à d'autres composants dans leur sortie. Ça nous permet d'utiliser la même abstraction de composant pour n'importe quel niveau de détail. Un bouton, un formulaire, une boîte de dialogue, un écran: dans React, ils sont généralement tous exprimées par des composants.

Par exemple, nous pouvons créer un composant `App` qui fait un rendu mutliple du composant ` Welcome`:

```js{8-10}
function Welcome(props) {
  return <h1>Bonjour, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[**Essayer sur CodePen**](codepen://components-and-props/composing-components)

En règle générale, les nouvelles applications React n'ont un seul composant `App` en haut de leur hiérarchie.  Cependant, si vous intégrez React à une application existante, vous pouvez commencer par un petit composant comme `Button` et vous diriger progressivement vers le haut de la hiérarchie.

## Extraire des Composants {#extracting-components}

N'ayez pas peur de scinder des composants en composants plus petits.

Prennons par exemple ce composent `Comment`:

```js
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[**Essayer sur CodePen**](codepen://components-and-props/extracting-components)

Il accepte `author` (un objet),` text` (une chaîne de caractères) et `date` (une date) comme props, et décrit un commentaire sur un réseau social en ligne.

Les différentes imbrications rendent la modification de ce composant fastidieuse, et il est également compliqué de de réutiliser des parties individuelles de celui-ci. Essayons donc d'extraire quelques composants.

Tout d'abord, nous allons extraire `Avatar`:

```js{3-6}
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}
```

Le composant `Avatar` n'a pas besoin de savoir qu'il est rendu dans un composant ` Comment`. C'est pourquoi nous avons donné à ses props un nom plus générique: `user` plutôt que` author`.

Nous vous recommandons de nommer les props du point de vue du composant plutôt que de celui du contexte dans lequel il est utilisé.

On peut maintenant un peu simplifier `Comment`:

```js{5}
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

Ensuite, nous allons extraire un composant `UserInfo` qui effectue le rendu du composant `Avatar` à côté du nom de l'utilisateur:

```js{3-8}
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```

Ce qui nous permet de simplifer encore plus `Comment`:

```js{4}
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[**Essayer sur CodePen**](codepen://components-and-props/extracting-components-continued)

Au début, extraire des composants peut vous sembler fastidieux, mais disposer d'une palette de composants réutilisables s'avère rentable sur des applications de plus grande taille. En règle générale, si une partie de votre interface utilisateur est utilisée plusieurs fois (`Button`,` Panel`, `Avatar`) ou si elle est suffisamment complexe en elle-même (` App`, `FeedStory`, 'Comment` ), c’est un bon candidat pour être un composant réutilisable.

## Les Props en Lecture Seule {#props-are-read-only}

Que vous déclariez un composant [sous forme de fonction ou de classe](#function-and-class-components), il ne doit jamais modifier ses propres props. Considérons cette fonction `sum`:

```js
function sum(a, b) {
  return a + b;
}
```

Ces fonctions sont dites ["pure"](https://fr.wikipedia.org/wiki/Fonction_pure) parce qu'ils ne tentent pas de modifier leurs entrées et retournent toujours le même résultat pour leurs entrées respectives.

En revanche, cette fonction est impure car elle change sa propre entrée:

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React est assez flexible mais possède une règle stricte:

**Tous les composants React doivent agir comme des fonctions pures vis-à-vis de leurs proprs.**

Bien entendu, les interfaces utilisateur des applications sont dynamiques et évoluent dans le temps. Dans la [section suivante](/docs/state-and-lifecycle.html), nous introduirons un nouveau concept "d'état" (State). Le State permet aux composants React de modifier leur sortie au fil du temps aux regards des actions de l'utilisateur, des réponses réseau et à tout autre chose, mais toujours sans enfreindre cette règle.
