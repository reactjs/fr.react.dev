---
title: "Les mixins sont dangereux"
author: [gaearon]
---

« Comment réutiliser mon code à travers plusieurs composants ? » C’est une des premières questions que les gens se posent quand ils apprennent React.  Notre réponse a toujours consisté à utiliser la composition des composants.  Vous pouvez définir un composant et l’utiliser dans plusieurs autres composants.

En fonction du contexte, la solution à base de composition n'est pas toujours évidente.  React est influencé par la programmation fonctionnelle mais il est arrivé dans un domaine où les bibliothèques orientées objets étaient monnaie courante.  Pour les ingénieurs tant chez Facebook qu'en dehors, abandonner leurs vieux modèles mentaux n’était pas chose aisée.

Pour faciliter l’adoption initiale et l'apprentissage, nous avons incorporé quelques échappatoires dans React.  Le système de mixins en faisait partie, l’objectif étant de fournir un moyen de réutiliser du code entre plusieurs composants quand vous ne saviez pas trop comment y parvenir avec la composition.

Trois ans ont passé depuis que React est sorti.  Le paysage a changé.  Des tas de bibliothèques d’interfaces utilisateurs (UI) adoptent désormais un modèle de composants similaire à React.  Préférer la composition à l'héritage pour construire des UI de façon déclarative n'a plus rien d'une nouveauté.  Nous sommes également plus confiants vis-à-vis du modèle de composants de React, et nous avons pu voir de nombreuses utilisations créatives de la bibliothèque tant en interne que dans la communauté.

Dans cet article, nous allons examiner les problèmes qu’entraînent couramment les mixins.  Nous suggérerons alors plusieurs approches alternatives pour les mêmes cas d'usages.  Nous avons constaté que ces approches restent plus maintenables que les mixins lorsque la complexité de la base de code augmente.

## Les problèmes des mixins {#why-mixins-are-broken}

Chez Facebook l'utilisation de React est passée de quelques composants à plusieurs milliers.  Ça nous offre une bonne vision des façons dont les gens utilisent React.  Grâce à un rendu déclaratif et au flux de données descendant, de nombreuses équipes ont pu corriger un paquet de bugs tout en livrant de nouvelles fonctionnalités en adoptant React.

Il est cependant inévitable qu'une partie de notre code utilisant React devienne progressivement incompréhensible.  L'équipe React tombait parfois, dans divers projets, sur des groupes de composants que plus personne n'osait toucher.  Ces composants étaient trop fragiles, déroutants pour les nouveaux développeurs—et même à terme pour leurs auteurs d'origine.  Une large part de cette confusion provenait des mixins.  À l'époque, je ne travaillais pas chez Facebook mais j’en étais arrivé aux [mêmes conclusions](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750) après avoir moi-même écrit ma part de mixins atroces.

Ça ne veut pas dire que les mixins en eux-mêmes sont mauvais.  Ils sont employés avec succès dans divers langages et paradigmes, dont certains langages fonctionnels.  Chez Facebook, nous utilisons énormément les _traits_ dans notre code écrit en Hack, et ceux-ci ressemblent beaucoup aux mixins.  Quoi qu'il en soit, nous estimons que les mixins sont superflus et problématiques dans des bases de code React.  Voyons pourquoi.

### Les mixins introduisent des dépendances implicites {#mixins-introduce-implicit-dependencies}

Il arrive qu'un composant s'appuie sur une méthode précise définie dans le mixin, telle que `getClassName()`.  D'autres fois c'est l'inverse, et le mixin appelle une méthode du composant, du genre `renderHeader()`.  JavaScript est un langage dynamique, de sorte qu'il est difficile de vérifier ou même de documenter ces dépendances.

Les mixins invalident la supposition habituelle et généralement fiable qu’on peut renommer une clé d'état local ou une méthode en recherchant ses occurrences dans le fichier du composant.  Peut-être écrivez-vous un composant à état, après quoi votre collègue y ajoute un mixin qui lit cet état.  Dans quelques mois, vous pourriez vouloir faire remonter l'état dans le composant parent, pour qu'il puisse être partagé avec vos éléments frères.  Vous rappellerez-vous alors qu'il faut mettre à jour le mixin pour qu'il lise plutôt une prop ?  Et si, à ce stade, d'autres composants utilisent le même mixin ?

Ces dépendances implicites sont autant d'obstacles empêchant les nouveaux membres de l'équipe de contribuer efficacement à la base de code.  La méthode `render()` d'un composant fait peut-être référence à une méthode qui n'est pas définie dans la classe. Peut-on alors la retirer sereinement ?  Elle est peut-être définie dans l'un des mixins.  Mais lequel ? Vous devez alors remonter jusqu'à la liste des mixins, ouvrir chaque fichier concerné, et y rechercher cette méthode.  Pire, les mixins peuvent utiliser leurs propres mixins, ce qui complexifie la recherche.

Les mixins en viennent souvent à dépendre d'autres mixins, de sorte qu'en retirer un risque d'en casser d'autres.  Dans de telles situations, il devient presque impossible de saisir les flux de données entrants et sortants des mixins, sans parler de leur graphe de dépendance.  Contrairement aux composants, les mixins ne forment pas une hiérarchie : ils sont aplatis et opèrent au sein d'un même espace de noms.

### Les mixins causent des conflits de nommage {#mixins-cause-name-clashes}

Rien ne permet de garantir que deux mixins spécifiques pourront être exploités conjointement.  Par exemple, si `FluxListenerMixin` définit `handleChange()` et que `WindowSizeMixin` définit `handleChange()`, vous ne pourrez pas les utiliser ensemble, ni d'ailleurs définir une méthode avec ce nom-là dans votre propre composant.

Ce n'est pas si grave lorsque vous contrôlez le code du mixin.  Quand vous rencontrez un conflit, vous pouvez toujours renommer cette méthode dans l'un des mixins.  C'est toutefois risqué parce que certains composants ou d'autres mixins font peut-être déjà appel à cette méthode directement, et vous devez débusquer et corriger ces appels-là aussi.

Si vous avez un conflit de nommage avec un mixin issu d'un module tiers, vous ne pouvez pas simplement renommer sa méthode.  Vous devrez plutôt utiliser des noms de méthodes balourds dans votre composant pour éviter les conflits.

La vie n'est pas rose non plus pour les auteurs de mixins.  Le simple fait d'ajouter une méthode à un mixin porte toujours le risque de casser la compatibilité, parce qu'une méthode avec le même nom pourrait exister dans des composants utilisant votre mixin, soit directement soit via d'autres mixins.  Une fois écrits, les mixins sont difficiles à retirer ou modifier.  Les mauvaises idées sont rarement éliminées par une refactorisation, parce que celle-ci est généralement trop risquée.

### Les mixins font déraper la complexité {#mixins-cause-snowballing-complexity}

Même quand les mixins démarrent avec un code simple, ils ont tendance à se complexifier avec le temps.  L'exemple ci-dessous est basé sur un véritable scénario dont j'ai été témoin dans une base de code.

Un composant a besoin d'un état local pour pister les mouvements du pointeur.  Pour permettre la réutilisation de cette logique, vous pourriez extraire `handleMouseEnter()`, `handleMouseLeave()` et `isHovering()` dans un `HoverMixin`.  Ensuite, quelqu'un a besoin d'implémenter une infobulle.  Il ne veut pas dupliquer le code du `HoverMixin` alors il crée un `TooltipMixin`  qui utilise `HoverMixin`.  `TooltipMixin` lit le `isHovering()` fourni par `HoverMixin` dans sa méthode `componentDidUpdate()` pour décider d'afficher ou de masquer l'infobulle.

Quelques mois plus tard, quelqu'un veut rendre la direction de l'infobulle configurable.  Afin d'éviter la duplication de code, ils ajoutent la prise en charge d'une méthode optionnelle `getTooltipOptions()` dans `TooltipMixin`.  À ce stade, les composants qui affichent des encarts au survol utilisent également `HoverMixin`.  En revanche, ces derniers ont besoin d'un délai de survol différent.  Pour y parvenir, quelqu'un ajoute la prise en charge d'une méthode optionnelle `getHoverOptions()`et l'implémente dans le `TooltipMixin`.  Les deux mixins sont désormais fortement couplés.

Ça tient le coup tant que les exigences n'évoluent plus.  Ceci dit, cette solution est friable.  Et si vous vouliez permettre l'affichage de plusieurs infobulles pour un même composant ?  Vous ne pouvez pas définir le même mixin deux fois dans un composant.  Et si les infobulles ont besoin d'être affichées automatiquement, lors d'une visite guidée de la page plutôt qu'au survol ?  Bonne chance pour découpler le `TooltipMixin` du `HoverMixin`.  Et si vous deviez gérer le cas où la zone de survol et le point d'ancrage de l'infobulle appartiennent à des composants différents ?  Il est délicat de faire remonter l'état utilisé par le mixin dans le composant parent.  Contrairement aux composants, les mixins ne se prêtent pas naturellement à ce genre d'évolutions.

Chaque nouveau besoin rend les mixins plus difficiles à comprendre.  Les composants qui utilisent un même mixin sont de plus en plus fortement couplés avec le temps.  Toute nouvelle fonctionnalité débarque d'office dans tous les composants utilisant le mixin.  Il est impossible d'extraire la partie « plus simple » du mixin sans dupliquer le code ni introduire davantage de dépendances et d'indirections entre les mixins.  Progressivement, les frontières de l'encapsulation se délitent, et puisqu'il est difficile de modifier ou même retirer les mixins existants, ils continuent à monter en abstraction jusqu'à ce que plus personne ne comprenne comment ils marchent.

Nous faisions déjà face à ces problématiques de construction d'appli avant React.  Nous avons constaté qu'on peut les résoudre avec du rendu déclaratif, un flux de données descendant et des composants encapsulés.  Chez Facebook, nous migrons notre code vers des approches alternatives aux mixins, et en général le résultat nous plaît beaucoup.  Vous pouvez découvrir ces approches ci-dessous.

## Sortir des mixins {#migrating-from-mixins}

Pour commencer, précisons que les mixins ne sont pas techniquement dépréciés.  Si vous utilisez `React.createClass()`, vous pouvez continuer à vous en servir.  Nous disons seulement qu'ils ne nous ont pas satisfaits, donc nous ne recommanderons par leur utilisation à l'avenir. *(Depuis React 15.5, cette méthode a été [sortie dans un module à part](/docs/react-without-es6.html#mixins), NdT.)*

Chaque section ci-dessous correspond à un schéma d'utilisation des mixins que nous avons rencontré dans la base de code de Facebook.  Pour chacune, nous décrivons le problème et une solution que nous estimons supérieure.  Les exemples sont écrits en ES5 mais dès lors que vous n'avez plus besoin des mixins, vous pouvez passer à la syntaxe de classe ES6 si vous le souhaitez.

Nous espérons que cette liste vous sera utile.  N’hésitez pas à nous signaler des cas d'usages importants que nous aurions loupé afin que nous puissions soit augmenter cette liste, soit manger notre chapeau !

### Optimisation des performances {#performance-optimizations}

Un des mixins les plus couramment utilisés est le [`PureRenderMixin`](/docs/pure-render-mixin.html). Vous vous en servez peut-être dans certains composants pour [éviter des rafraîchissements superflus](/docs/advanced-performance.html#shouldcomponentupdate-in-action) quand les props et l'état sont superficiellement égaux à leurs valeurs précédentes :

```javascript
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Button = React.createClass({
  mixins: [PureRenderMixin],

  // ...

});
```

#### Solution {#solution}

Pour faire la même chose sans mixins, vous pouvez utiliser plutôt la fonction [`shallowCompare`](/docs/shallow-compare.html) directement :

```js
var shallowCompare = require('react-addons-shallow-compare');

var Button = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  // ...

});
```

Si vous utilisez un mixin personnalisé qui implémente une fonction `shouldComponentUpdate` avec un algorithme différent, nous vous suggérons d'exporter juste cette fonction depuis un module et de l'appeler directement dans votre composant.

Nous savons bien qu'il est pénible de devoir écrire davantage de code.  Pour le cas le plus courant, nous comptons [fournir une nouvelle classe de base](https://github.com/facebook/react/pull/7195) appelée `React.PureComponent` dans la prochaine version mineure. Elle utilisera la même comparaison de surface que celle de `PureRenderMixin` aujourd’hui *(elle est arrivée avec React 15.3, NdT)*.

### Abonnements et effets de bord {#subscriptions-and-side-effects}

Le deuxième type de mixin le plus courant que nous avons rencontré permet d'abonner un composant React à une source de données tierce.  Que la source soit un dépôt Flux, un observable Rx ou quoi que ce soit d'autre, le schéma est toujours le même : on s'abonne dans `componentDidMount`, on se désabonne dans `componentWillUnmount`, et le gestionnaire de changements appelle `this.setState()`.

```javascript
var SubscriptionMixin = {
  getInitialState: function() {
    return {
      comments: DataSource.getComments()
    };
  },

  componentDidMount: function() {
    DataSource.addChangeListener(this.handleChange);
  },

  componentWillUnmount: function() {
    DataSource.removeChangeListener(this.handleChange);
  },

  handleChange: function() {
    this.setState({
      comments: DataSource.getComments()
    });
  }
};

var CommentList = React.createClass({
  mixins: [SubscriptionMixin],

  render: function() {
    // On lit les commentaires depuis l’état géré par le mixin.
    var comments = this.state.comments;
    return (
      <div>
        {comments.map(function(comment) {
          return <Comment comment={comment} key={comment.id} />
        })}
      </div>
    )
  }
});

module.exports = CommentList;
```

#### Solution {#solution-1}

Si un seul composant est abonné à la source de données, vous pouvez tout à fait incorporer la logique d'abonnement directement dans ce composant.  Il est toujours préférable d’éviter les abstractions prématurées.

Si plusieurs composants utilisent le mixin pour s'abonner à la source de données, une manière élégante d'éviter de se répéter consiste à utiliser une approche appelée [« composants d’ordre supérieur »](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750) *(Higher-Order Components ou HOC, NdT)*.  Le terme peut faire peur mais nous allons voir ensemble à quel point cette approche découle naturellement du modèle de composants.

#### Comprendre les composants d'ordre supérieur {#higher-order-components-explained}

Oublions React un instant.  Prenez ces deux fonctions qui ajoutent et multiplient des nombres, en journalisant leurs résultats au fil de l’eau :

```js
function addAndLog(x, y) {
  var result = x + y;
  console.log('Résultat :', result);
  return result;
}

function multiplyAndLog(x, y) {
  var result = x * y;
  console.log('Résultat :', result);
  return result;
}
```

Ces deux fonctions ne sont pas très utiles mais elles vont nous aider à illustrer une approche que nous pourrons ensuite appliquer aux composants.

Disons que nous voulons extraire leur logique de journalisation sans changer leurs signatures.  Comment y parvenir ?  Une solution élégante consiste à écrire une [fonction d’ordre supérieur](https://fr.wikipedia.org/wiki/Fonction_d%27ordre_supérieur), c'est-à-dire une fonction qui prend une fonction en argument et qui renvoie une fonction.

Là aussi, ça semble compliqué mais le code reste raisonnable :

```js
function withLogging(wrappedFunction) {
  // Renvoie une fonction avec la même API...
  return function(x, y) {
    // ...qui appelle la fonction d’origine...
    var result = wrappedFunction(x, y);
    // ...mais qui logue en prime son résultat !
    console.log('Résultat :', result);
    return result;
  };
}
```

La fonction d'ordre supérieur `withLogging` nous permet d'écrire `add` et `multiply` sans le code de journalisation, et de les enrober plus tard afin d'obtenir `addAndLog` et `multiplyAndLog`, qui auront exactement les mêmes signatures qu’avant :

```js
function add(x, y) {
  return x + y;
}

function multiply(x, y) {
  return x * y;
}

function withLogging(wrappedFunction) {
  return function(x, y) {
    var result = wrappedFunction(x, y);
    console.log('Résultat :', result);
    return result;
  };
}

// Revient à écrire addAndLog à la main :
var addAndLog = withLogging(add);

// Revient à écrire multiplyAndLog à la main :
var multiplyAndLog = withLogging(multiply);
```

Les composants d'ordre supérieur sont une approche très similaire, mais pour les composants dans React.  Nous allons appliquer cette transformation à partir de la version basée sur les mixins en deux étapes.

Pour commencer, nous découperons notre composant `CommentList` en deux : un enfant et un parent.  L’enfant s'occupera uniquement de l'affichage des commentaires, tandis que le parent s'occupera de l'abonnement et de transmettre des données à jour à son enfant via le mécanisme usuel des props.

```js
// Voici le composant enfant.
// Il se contente d’afficher les commentaires qu’il reçoit via ses props.
var CommentList = React.createClass({
  render: function() {
    // Remarque : on lit désormais les props et non l’état local.
    var comments = this.props.comments;
    return (
      <div>
        {comments.map(function(comment) {
          return <Comment comment={comment} key={comment.id} />
        })}
      </div>
    )
  }
});

// Voici le composant parent.
// Il gère l’abonnement à la source de données et utilise <CommentList /> pour son rendu.
var CommentListWithSubscription = React.createClass({
  getInitialState: function() {
    return {
      comments: DataSource.getComments()
    };
  },

  componentDidMount: function() {
    DataSource.addChangeListener(this.handleChange);
  },

  componentWillUnmount: function() {
    DataSource.removeChangeListener(this.handleChange);
  },

  handleChange: function() {
    this.setState({
      comments: DataSource.getComments()
    });
  },

  render: function() {
    // Nous passons l’état local à CommentList via ses props.
    return <CommentList comments={this.state.comments} />;
  }
});

module.exports = CommentListWithSubscription;
```

Il ne nous reste plus qu'une dernière chose à faire.

Vous vous rappelez comment nous avions écrit `withLogging()` pour qu'elle accepte une fonction et renvoie une autre fonction qui l'enrobait ?  Nous pouvons appliquer une approche similaire aux composants React.

Nous allons écrire une fonction `withSubscription(WrappedComponent)`.  Son argument peut être n'importe quel composant React.  Nous lui passerons `CommentList` comme `WrappedComponent`, mais on pourrait aussi appeler `withSubscription` avec n’importe quel composant de notre base de code.

Cette fonction nous renverra un autre composant.  Le composant renvoyé gérera l'abonnement et utilisera `<WrappedComponent />` pour son rendu, en lui transmettant les données actuelles.

Nous appelons cette approche un « composant d’ordre supérieur ».

La composition a lieu au niveau du rendu de React plutôt qu’avec un appel de fonction direct.  C’est pourquoi on se fiche de savoir si le composant enrobé est défini avec `createClass()`, une classe ES6 ou une fonction.  Si `WrappedComponent` est un composant React, le composant créé par `withSubscription()` peut l'utiliser.

```js
// Cette fonction accepte un composant...
function withSubscription(WrappedComponent) {
  // ...et renvoie un autre composant...
  return React.createClass({
    getInitialState: function() {
      return {
        comments: DataSource.getComments()
      };
    },

    componentDidMount: function() {
      // ...qui s'occupe de gérer l’abonnement...
      DataSource.addChangeListener(this.handleChange);
    },

    componentWillUnmount: function() {
      DataSource.removeChangeListener(this.handleChange);
    },

    handleChange: function() {
      this.setState({
        comments: DataSource.getComments()
      });
    },

    render: function() {
      // ...et utilise le composant enrobé, avec des données à jour pour son rendu !
      return <WrappedComponent comments={this.state.comments} />;
    }
  });
}
```

Nous pouvons maintenant déclarer `CommentListWithSubscription` en appliquant `withSubscription` à `CommentList` :

```js
var CommentList = React.createClass({
  render: function() {
    var comments = this.props.comments;
    return (
      <div>
        {comments.map(function(comment) {
          return <Comment comment={comment} key={comment.id} />
        })}
      </div>
    )
  }
});

// withSubscription() renvoie un nouveau composant qui
// est abonné à la source de données et utilise
// <CommentList /> avec des données à jour pour son rendu.
var CommentListWithSubscription = withSubscription(CommentList);

// Le reste de l’appli ne s’intéresse qu’au composant abonné
// alors nous l’exportons lui plutôt que le composant CommentList
// original, non-enrobé.
module.exports = CommentListWithSubscription;
```

#### Solution revisitée {#solution-revisited}

À présent que nous comprenons mieux les composants d’ordre supérieur, regardons à nouveau la solution complète qui se passe des mixins.  On y trouve quelques menus changements décrits dans les commentaires :

```js
function withSubscription(WrappedComponent) {
  return React.createClass({
    getInitialState: function() {
      return {
        comments: DataSource.getComments()
      };
    },

    componentDidMount: function() {
      DataSource.addChangeListener(this.handleChange);
    },

    componentWillUnmount: function() {
      DataSource.removeChangeListener(this.handleChange);
    },

    handleChange: function() {
      this.setState({
        comments: DataSource.getComments()
      });
    },

    render: function() {
      // Utilise la syntaxe de décomposition (spread) JSX pour transmettre
      // automatiquement toutes les props ainsi que l'état.
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  });
}

// Optionnel : on convertit CommentList en fonction composant
// puisqu’il n’utilise plus ni cycle de vie ni état local.
function CommentList(props) {
  var comments = props.comments;
  return (
    <div>
      {comments.map(function(comment) {
        return <Comment comment={comment} key={comment.id} />
      })}
    </div>
  )
}

// Au lieu de déclarer CommentListWithSubscription,
// on peut exporter à la volée le composant enrobé.
module.exports = withSubscription(CommentList);
```

Les composants d'ordre supérieur sont une approche puissante.  Vous pouvez leur passer des arguments supplémentaires pour personnaliser leur comportement.  Après tout, il ne s'agit même pas d'une fonctionnalité de React : ce sont juste des fonctions qui reçoivent des composants et en renvoient d’autres qui les enrobent.

Comme toute solution, les composants d'ordre supérieur ont leurs propres pièges.  Par exemple, si vous utilisez massivement les [refs](/docs/refs-and-the-dom.html), vous remarquerez peut-être qu’enrober quelque chose dans un composant d'ordre supérieure modifie la ref de sorte qu'elle pointe sur le composant d'enrobage.  En pratique, nous décourageons le recours aux refs pour faire communiquer les composants et ne pensons donc pas que c'est un problème majeur.  À l'avenir, nous envisagerons peut-être d’ajouter [du transfert de refs](https://github.com/facebook/react/issues/4213) dans React pour éliminer cette irritation. *([Ils l'ont effectivement ajouté](/docs/forwarding-refs.html) avec React 16.3, NdT.)*

### Logique de rendu {#rendering-logic}

Un autre cas d’usage courant des mixins que nous avons repéré dans notre base de code cherche à réutiliser de la logique de rendu entre plusieurs composants.

Voici un exemple typique de ce schéma :

```js
var RowMixin = {
  // Appelé par les composants depuis `render()`
  renderHeader: function() {
    return (
      <div className='row-header'>
        <h1>
          {this.getHeaderText() /* Défini par les composants */}
        </h1>
      </div>
    );
  }
};

var UserRow = React.createClass({
  mixins: [RowMixin],

  // Appelé par `RowMixin.renderHeader()`
  getHeaderText: function() {
    return this.props.user.fullName;
  },

  render: function() {
    return (
      <div>
        {this.renderHeader() /* Défini par `RowMixin` */}
        <h2>{this.props.user.biography}</h2>
      </div>
    )
  }
});
```

Plusieurs composants pourraient utiliser `RowMixin` pour afficher l’en-tête, et chacun d'entre eux aurait besoin de définir `getHeaderText()`.

#### Solution {#solution-2}

Si vous remarquez de la logique de rendu dans un mixin, ça veut dire que c’est le moment d'extraire un composant !

Au lieu de `RowMixin`, nous allons définir un composant `<RowHeader>`.  Nous remplacerons aussi les conventions d'appel (comme la méthode `getHeaderText()`) par le mécanisme standard de flux de données descendant de React : passer des props.

Pour finir, vu qu’aucun des composants concernés n’a besoin de cycle de vie ou d’état local, nous pouvons les déclarer comme de simples fonctions :

```js
function RowHeader(props) {
  return (
    <div className='row-header'>
      <h1>{props.text}</h1>
    </div>
  );
}

function UserRow(props) {
  return (
    <div>
      <RowHeader text={props.user.fullName} />
      <h2>{props.user.biography}</h2>
    </div>
  );
}
```

Les props permettent aux composants d’exprimer des dépendances explicites, faciles à remplacer, et vérifiables avec des outils tels que [Flow](https://flowtype.org/) et [TypeScript](https://www.typescriptlang.org/).

>Remarque
>
>Vous n’êtes pas obligé·e de définir vos composants en tant que fonctions.  Il n’y a rien de mal à utiliser des méthodes de cycle de vie ou l’état local : ce sont là des fonctionnalités à part entière de React.  Nous utilisons des fonctions composants dans cet exemple parce qu'elles sont plus faciles à lire et que nous n'avions pas l'utilité de ces fonctionnalités supplémentaires, mais ça marchera tout aussi bien avec des classes.

### Contexte {#context}

Nous avons aussi remarqué une autre catégorie de mixins, qui étaient des utilitaires pour interagir avec le [Contexte React](/docs/context.html). Le Contexte est une fonctionnalité expérimentale instable qui a [quelques soucis](https://github.com/facebook/react/issues/2517), et nous changerons sans doute son API à l’avenir *([ce qu’ils ont fait avec React 16.3](https://fr.reactjs.org/blog/2018/03/29/react-v-16-3.html#official-context-api), NdT)*. Nous déconseillons de l’utiliser à moins que vous soyez certain·e qu’il représente la seule solution à votre problème.

Toujours est-il que si vous utilisez déjà le contexte, vous avez peut-être masqué son utilisation à l'aide de mixins similaires à celui-ci :

```js
var RouterMixin = {
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  // Le mixin fournit une méthode pour que les composants
  // n’aient pas à utiliser l’API de contexte directement.
  push: function(path) {
    this.context.router.push(path)
  }
};

var Link = React.createClass({
  mixins: [RouterMixin],

  handleClick: function(e) {
    e.stopPropagation();

    // Cette méthode est définie dans `RouterMixin`.
    this.push(this.props.to);
  },

  render: function() {
    return (
      <a onClick={this.handleClick}>
        {this.props.children}
      </a>
    );
  }
});

module.exports = Link;
```

#### Solution {#solution-3}

Nous sommes d'accord : masquer l'utilisation du contexte aux yeux des composants qui le consomment est une bonne idée jusqu'à ce que l'API de contexte se stabilise.  Néanmoins, nous recommandons plutôt de recourir aux composants d'ordre supérieur pour ça.

Le composant d'enrobage récupèrerait l'info depuis le contexte, et la transmettrait via les props au composant enrobé :

```js
function withRouter(WrappedComponent) {
  return React.createClass({
    contextTypes: {
      router: React.PropTypes.object.isRequired
    },

    render: function() {
      // Le composant d’enrobage lit l’information depuis le contexte
      // et la transmet via les props au composant enrobé.
      var router = this.context.router;
      return <WrappedComponent {...this.props} router={router} />;
    }
  });
};

var Link = React.createClass({
  handleClick: function(e) {
    e.stopPropagation();

    // Le composant enrobé utilise les props au lieu du contexte.
    this.props.router.push(this.props.to);
  },

  render: function() {
    return (
      <a onClick={this.handleClick}>
        {this.props.children}
      </a>
    );
  }
});

// N’oubliez pas d’enrober le composant !
module.exports = withRouter(Link);
```

Si vous utilisez une bibliothèque tierce qui ne fournit qu’un mixin, nous vous encourageons à leur signaler le problème dans un ticket avec un lien vers cet article pour qu’ils puissent plutôt fournir un composant d’ordre supérieur.  En attendant, vous pouvez créer vous-même un composant d'ordre supérieur qui se comportera exactement pareil.

### Méthodes utilitaires {#utility-methods}

Parfois les mixins sont utilisés uniquement pour réutiliser des fonctions utilitaires d'un composant à l'autre :

```js
var ColorMixin = {
  getLuminance(color) {
    var c = parseInt(color, 16);
    var r = (c & 0xFF0000) >> 16;
    var g = (c & 0x00FF00) >> 8;
    var b = (c & 0x0000FF);
    return (0.299 * r + 0.587 * g + 0.114 * b);
  }
};

var Button = React.createClass({
  mixins: [ColorMixin],

  render: function() {
    var theme = this.getLuminance(this.props.color) > 160 ? 'dark' : 'light';
    return (
      <div className={theme}>
        {this.props.children}
      </div>
    )
  }
});
```

#### Solution {#solution-4}

Placez les fonctions utilitaires dans des modules JavaScript classiques et importez-les.  Ça les rend d'ailleurs plus faciles à tester et à utiliser hors de vos composants :

```js
var getLuminance = require('../utils/getLuminance');

var Button = React.createClass({
  render: function() {
    var theme = getLuminance(this.props.color) > 160 ? 'dark' : 'light';
    return (
      <div className={theme}>
        {this.props.children}
      </div>
    )
  }
});
```

### Autres cas d'usages {#other-use-cases}

Il arrive qu'on utilise les mixins pour ajouter sélectivement de la journalisation ou des méthodes de cycle de vie à certains composants.  À l'avenir nous comptons fournir une [API DevTools officielle](https://github.com/facebook/react/issues/5306) qui vous permettra d’implémenter quelque chose de similaire sans toucher aux composants.  Ce chantier n'est toutefois pas près d'aboutir.  Si vous vous reposez massivement sur les mixins de journalisation pour votre débogage, vous voudrez peut-être les garder sous le coude encore un moment.

Si vous n'arrivez pas à vos fins avec un composant, un composant d'ordre supérieur ou un module utilitaire, ça pourrait vouloir dire que React devrait répondre à votre besoin par défaut. [Créez un ticket](https://github.com/facebook/react/issues/new) pour nous expliquer votre cas d'usage des mixins, et nous vous aiderons à explorer des alternatives, ou peut-être implémenterons-nous la fonctionnalité dont vous avez besoin.

Les mixins ne sont pas dépréciés au sens traditionnel du terme.  Vous pouvez continuer à vous en servir avec `React.createClass()` car leur API est désormais gelée.  À mesure que les classes ES6 seront plus répandues et que leurs problèmes d'utilisabilité dans React seront réglés, nous sortirons peut-être `React.createClass()` dans un module à part car la plupart des gens n'en auront plus besoin *([ils l'ont fait avec React 15.5](/docs/react-without-es6.html#mixins), NdT)*.  Même dans ce cas, vos vieux mixins continueront à marcher.

Nous sommes convaincus que les alternatives ci-dessus leur sont supérieures dans la vaste majorité des cas, et nous vous invitons à essayer d'écrire vos applis React sans mixins.
