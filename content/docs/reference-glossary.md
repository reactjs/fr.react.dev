---
id: glossary
title: Glossaire des termes React
layout: docs
category: Reference
permalink: docs/glossary.html

---

## Single-page Application {#single-page-application}

Une *single-page application* (SPA) est une application qui charge une unique page HTML et toutes les ressources nécessaires (telles que du JavaScript et des CSS) requises pour le fonctionnement de l’application.  Aucune interaction sur la page ou les pages ultérieures ne nécessitera un nouvel aller-retour avec le serveur, ce qui signifie que la page n’a pas besoin d’être rafraîchie.

Même si vous pouvez construire une SPA avec React, ce n’est pas obligatoire.  React peut aussi être utilisé pour améliorer de petites parties de sites existants en leur apportant une interactivité supplémentaire.  Le code écrit en React cohabite paisiblement tant avec le balisage produit par le serveur, au moyen de technologies telles que PHP, qu’avec les autres bibliothèques côté client.  En fait, c’est exactement ainsi que React est utilisé chez Facebook.

## ES6, ES2015, ES2016, etc. {#es6-es2015-es2016-etc}

Ces acronymes font référence aux versions les plus récentes du standard *ECMAScript Language Specification*, dont le langage JavaScript est une implémentation. La version ES6 (également connue sous le nom ES2015) apporte de nombreuses nouveautés par rapport aux versions précédentes, telles que : les fonctions fléchées, les classes, les gabarits de chaînes, les déclarations `let` et `const`…  Vous pouvez en apprendre plus sur des versions précises [ici](https://fr.wikipedia.org/wiki/ECMAScript#Versions).

## Compilateurs {#compilers}

Un compilateur JavaScript, souvent appelé *transpileur*, prend du code JavaScript, le transforme et renvoie un code JavaScript de format différent.  Le cas d’usage le plus courant consiste à prendre la syntaxe ES6 et à la transformer en une syntaxe que les navigateurs plus anciens sont capables d’interpréter. [Babel](https://babeljs.io/) est le compilateur le plus utilisé avec React.

## Bundlers {#bundlers}

Les *bundlers* prennent du code JavaScript et CSS écrit sous forme de modules distincts (souvent par centaines), et les combine pour produire un petit nombre de fichiers plus optimisés pour les navigateurs.  Parmi les *bundlers* couramment utilisés pour les applications React, on trouve [Webpack](https://webpack.js.org/) et [Browserify](http://browserify.org/).

## Gestionnaires de paquets {#package-managers}

Les gestionnaires de paquets sont des outils qui vous permettent de gérer les dépendances de votre projet. [npm](https://www.npmjs.com/) et [Yarn](https://yarnpkg.com/) sont les deux gestionnaires de paquet couramment utilisés pour les applications React. Les deux travaillent en fait avec le même référentiel de modules, géré par npm.

## CDN {#cdn}

CDN est l’acronyme de *Content Delivery Network* *(réseau de distribution de contenu, NdT)*.   Les CDN fournissent des contenus statiques mis en cache via un réseau de serveurs répartis dans le monde entier.

## JSX {#jsx}

JSX est une extension syntaxique de JavaScript.  C’est un peu comme un langage de gestion de gabarit utilisant du balisage, mais il tire parti de toute la puissance de JavaScript.  JSX est compilé en appels à `React.createElement()`, qui renvoient des objets JavaScript nus appelés « éléments React ».  Pour découvrir les bases de JSX [consultez cette page de doc](/docs/introducing-jsx.html), et pour l’explorer plus en profondeur vous avez [cette page-ci](/docs/jsx-in-depth.html).

React DOM utilise la casse `camelCase` comme convention de nommage des propriétés, au lieu des noms d’attributs HTML. Par exemple, l’attribut `class` devient `className`, dans la mesure où `class` est un mot réservé en JavaScript :

```js
const name = 'Clémentine';
ReactDOM.render(
  <h1 className="hello">Je m’appelle {name} !</h1>,
  document.getElementById('root')
);
```

## [Éléments](/docs/rendering-elements.html) {#elements}

Les éléments React sont les blocs élémentaires de construction d’applications React. On les confond parfois avec le concept plus répandu de « composants ». Un élément décrit ce que vous voulez voir à l’écran.  Les éléments React sont immuables.

```js
const element = <h1>Bonjour, monde</h1>;
```

Habituellement, les éléments ne sont pas utilisés directement, mais renvoyés par les composants.

## [Composants](/docs/components-and-props.html) {#components}

Les composants React sont de petits morceaux de code réutilisables qui renvoient un élément React à afficher dans la page.  Dans sa forme la plus simple, un composant React est une bête fonction JavaScript qui renvoie un élément React :

```js
function Welcome(props) {
  return <h1>Bonjour, {props.name}</h1>;
}
```

Les composants peuvent aussi être basés sur une classe ES6 :

```js
class Welcome extends React.Component {
  render() {
    return <h1>Bonjour, {this.props.name}</h1>;
  }
}
```

Les composants peuvent être scindés en blocs fonctionnels distincts, et utilisés dans d’autres composants.  Les composants peuvent renvoyer d’autres composants, des tableaux, des chaînes de caractères et des nombres.  Pour décider si une partie de l’UI ferait un bon candidat pour un composant réutilisable, il suffit de se demander si elle apparaît plusieurs fois (`Button`, `Panel`, `Avatar`), ou si elle est suffisamment complexe en elle-même (`App`, `FeedStory`, `Comment`).  Les noms de composants devraient toujours démarrer par une majuscule (`<Wrapper/>` **pas** `<wrapper/>`). Consultez [cette documentation](/docs/components-and-props.html#rendering-a-component) pour de plus amples informations sur le rendu des composants.

### [`props`](/docs/components-and-props.html) {#props}

Les `props` sont les entrées d’un composant React.  Elles sont passées d’un composant parent à un composant enfant.

Gardez à l’esprit que les `props` sont en lecture seule.  Elles ne doivent jamais être modifiées :

```js
// Erroné !
props.number = 42;
```

Si vous avez besoin de modifier une valeur en réaction à une saisie utilisateur ou à une réponse réseau, utilisez plutôt `state`.

### `props.children` {#propschildren}

`props.children` est disponible dans chaque composant. Elle référence le contenu présent entre les balises ouvrante et fermante du composant.  Par exemple :

```js
<Welcome>Bonjour monde !</Welcome>
```

Le texte `Bonjour monde !` est présent dans la `props.children` du composant `Welcome` :

```js
function Welcome(props) {
  return <p>{props.children}</p>;
}
```

Pour les composants définis par des classes, on utilise `this.props.children` :

```js
class Welcome extends React.Component {
  render() {
    return <p>{this.props.children}</p>;
  }
}
```

### [`state`](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) {#state}

Un composant a besoin d’un `state` lorsque des données qui lui sont associées évoluent dans le temps.  Par exemple, un composant `Checkbox` pourrait avoir besoin d’une donnée d’état local `isChecked`, et un composant `NewsFeed` pourrait vouloir suivre la progression de `fetchedPosts` dans son état local.

La principale différence entre `state` et `props`, c’est que les `props` sont passées depuis le composant parent, alors que `state` est géré en interne par le composant lui-même.  Un composant ne peut pas changer ses `props`, mais il peut changer son `state`.

Pour chaque petite donnée qui va changer, un seul composant devrait la « posséder » dans son état local.  N’essayez pas de synchroniser les états de plusieurs composants.  Préférez [le faire remonter](/docs/lifting-state-up.html) dans leur plus proche ancêtre commun, et faire redescendre l’info via les props aux composants concernés.

## [Méthodes de cycle de vie](/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) {#lifecycle-methods}

Les méthodes de cycle de vie permettent d’implémenter des traitements personnalisés lors des différentes phases d’un composant.  Il en existe pour les phases de création et d’insertion dans le DOM ([montage](/docs/react-component.html#mounting)), de mise à jour du composant, et lorsque le composant est démonté et retiré du DOM.

 ## [Composants contrôlés](/docs/forms.html#controlled-components) ou [non-contrôlés](/docs/uncontrolled-components.html)

React a deux approches pour la gestion des saisies de formulaire.

Un champ de formulaire dont la valeur est contrôlée par React est appelé un *composant contrôlé*.  Quand un utilisateur saisit des données dans un composant contrôlé, un gestionnaire d’événements de modification est déclenché dans votre code, qui décide si la saisie est valide (en ré-affichant le composant avec la valeur mise à jour).  Si vous ne ré-affichez pas le champ, sa valeur reste inchangée.

Un *composant non-contrôlé* fonctionne comme les champs habituels non gérés par React.  Quand un utilisateur saisit des données dans un champ de formulaire (une zone de texte, une liste déroulante, etc.) l’information mise à jour est reflétée sans que React ait quoi que ce soit à faire.  En revanche, cela signifie aussi que vous ne pouvez pas, à la volée, contraindre ou formater les données saisies.

Dans la plupart des cas, vous devriez utiliser des champs contrôlés.

## [Clés](/docs/lists-and-keys.html) {#keys}

Une « clé » *(key)* est un attribut spécial que vous devez ajouter quand vous créez des tableaux d’éléments.  Les clés aident React à identifier quels éléments ont changé, ont été ajoutés ou retirés.  Les clés sont à placer sur les éléments du tableau pour leur donner une identité stable.

Les clés doivent être uniques au sein du tableau, mais n’ont pas besoin de l’être pour toute l’application, ou même au sein du composant.

N’utilisez pas quelque chose comme `Math.random()` pour vos clés.  Il est critique que les clés aient une « identité stable » d’un rendu à l’autre, pour que React puisse détecter les ajouts, suppressions ou ré-ordonnancements.  Dans l’idéal, les clés devraient correspondre à des identifiants stables issus de vos données, comme `post.id`.

## [Refs](/docs/refs-and-the-dom.html) {#refs}

React propose un attribut spécial que vous pouvez utiliser pour n’importe quel composant.  L’attribut `ref` peut être soit un objet créé par la [fonction `React.createRef()`](/docs/react-api.html#reactcreateref), soit une fonction de rappel, soit encore une chaîne (mais cette dernière forme est dépréciée). Quand l’attribut `ref` est une fonction de rappel, celle-ci reçoit comme argument l’élément du DOM ou l’instance de classe sous-jacents (suivant le type de l’élément).  Ça vous permet d’obtenir un accès direct à l’élément du DOM ou à l’instance du composant.

N’abusez pas des refs.  Si vous vous retrouvez à souvent recourir à des refs pour « faire que ça marche », vous avez probablement besoin de réviser le [flux de données unidirectionnel](/docs/lifting-state-up.html) de React.

## [Événements](/docs/handling-events.html) {#events}

La gestion des événements dans React présente quelques différences de syntaxe dans le balisage :

* Les gestionnaires d’événements React sont nommés en `casseCamel`, plutôt qu’en minuscules.
* En JSX, on passe une fonction comme gestionnaire, pas une chaîne de caractères.

## [Réconciliation](/docs/reconciliation.html) {#reconciliation}

Quand les props ou l’état local d’un composant changent, React détermine si une mise à jour effective du DOM est nécessaire en comparant les éléments fraîchement renvoyés et ceux de la passe précédente.  Lorsqu’ils ne sont pas égaux, React met à jour le DOM.  Ce processus est appelé « réconciliation ».
