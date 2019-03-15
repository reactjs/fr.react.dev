---
title: "Vous n'avez sans doute pas besoin d'états dérivés"
author: [bvaughn]
---

React 16.4 comprend [un fix pour `getDerivedStateFromProps`](/blog/2018/05/23/react-v-16-4.html#bugfix-for-getderivedstatefromprops) qui rend certains bugs connus des composants React plus fréquemment. Si la publication de cette version avec ce fix à mis en évidence un anti-pattern dans votre application et l'a cassée, nous sommes désolé pour le désagrément. Dans cet article nous allons passer en revus certains anti-patterns habituels autour des état dérivé et les alternatives que nous recommandons.

Depuis longtemps, la méthode de cycle de vie `componentWillReceiveProps` était la seule façon de mettre à jour un état suite à un changement de props sans pour autant déclencher un rendu supplémentaire. Dans la version 16.3, [nous avons introduit une méthode de cycle de vie de remplacement `getDerivedStateFromProps`](/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes) pour résoudre les même problèmes mais de manière plus sur. Au même moment, nous nous sommes aperçus qu'il y avait de nombreuses idées fausses autour de l'utilisation de ces deux méthodes et nous avons découverts des anti-patterns qui amenaient des bugs à la foi subtiles et déroutant. Le fix pour `getDerivedStateFromProps` dans la version 16.4 [rend les états dérivés plus prédictifs](https://github.com/facebook/react/issues/12898), ce qui rend les conséquences d'une mauvaise utilisation plus facile à identifier.

> Remarque :
>
> Tous les anti-patterns décrits dans cet article s'appliquent aussi bien à la vieille méthode `componentWillReceiveProps` qu'à la nouvelle `getDerivedStateFromProps`.

Cette article va couvrir les sujets suivant :
* [Quand utiliser les états dérivés](#when-to-use-derived-state)
* [Les bug courant lors de l'utilisation des états dérivés](#common-bugs-when-using-derived-state)
  * [Anti-pattern: La copie inconditionnelle des props dans l'état](#anti-pattern-unconditionally-copying-props-to-state)
  * [Anti-pattern: Effacer l'état quand les props changent](#anti-pattern-erasing-state-when-props-change)
* [Les solution recommandées](#preferred-solutions)
* [Et la mémoïsation dans tout ça ?](#what-about-memoization)

## Quand utiliser les états dérivés {#when-to-use-derived-state}

`getDerivedStateFromProps` n'existe que dans un seul but. Il permet à un composant de mettre à jour son état interne suite à **un changement de ses props**. Notre article de blog précédent fournissait quelques examples tel que [l'enregistrement de la direction du défilement basé sur le changement d'une prop `offset`](/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props) ou [le chargement de données externes spécifié avec une prop source](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change).

Nous n'avons pas données beaucoup d'examples car, de manière général, **les états dérivés devraient être utilisés avec parcimonie**. Tous les problèmes que nous avons identifiés avec les états dérivés peuvent, au bout du bout, se résumer à (1) la mise à jour inconditionnel de l'états avec les props ou (2) la mise à jour de l'état à chaque fois que l'état et les props ne correspondent pas. (Nous allons détailler ces deux cas ci-après)

* Si vous utilisez les états dérivés pour mémoïser certains calcules sur la seul base des props courantes vous n'avez pas besoin des états dérivés. Allez voir [Et la mémoïsation dans tout ça ƒ?](#what-about-memoization) ci-après.
* Si vous mettrez à jour votre état dérivé sans condition ou si vous le mettez à jour même quand l'état et les props ne correspondent pas, il y a de forte chance que votre composant réinitialise son état trop fréquemment. Continuez votre lecture pour plus de détails.

## Les bugs courants lors de l'utilisation des états dérivés {#common-bugs-when-using-derived-state}

Les termes [« controlé »](/docs/forms.html#controlled-components) et [« non-controlé »](/docs/uncontrolled-components.html) se réfèrent habituellement aux champs de formulaire, cependant ils peuvent également décrire là où vive les données d'un composant. Les données passées dans des props peuvent êtres considérées comme **controlé** (parce que le composant parent _controle_ ces données). Les données qui existent uniquement dans l'état interne peuvent êtres considérées comme **non-controlé** (parce que le composant parent ne peut pas les changer directement).

L'erreur la plus courante avec les états dérivés survient lorsqu'on mélange les deux concepts ; quand la valeur d'un état dérivé et également mise à jour par un appel à `setState`, il n'y a plus une seul source de vérité pour les données. [L'example du chargement de données externes](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change) évoqué ci-avant peut sembler similaire mais il est en réalité différent sur un certain nombre de points clés. Dans l'example du chargement, il y a une source de vérité clairement identifiée à la fois pour la prop « source » et pour l'état de « chargement ». Quand la prop source change, l'état de chargement devrait **toujours** être écrasé. Inversement, l'état n'est écrasé que lorsque la prop **change** et n'est géré par le composant que dans les autres cas.

Les problèmes surviennent quand n'importe laquelle de ces contraintes change. Cela se produit habituellement de deux façons. Voyons chacun de ces cas.

### Anti-pattern: La copie inconditionnelle des props dans l'état {#anti-pattern-unconditionally-copying-props-to-state}

Une erreur courante consiste à croire que `getDerivedStateFromProps` and `componentWillReceiveProps` ne sont appelées que lorsque les props « changes ». Ces méthodes de cycle de vie sont appelées à chaque fois qu'un composant parent va être rendu, peut importe que les props soient « différentes » ou non de la fois précédente. Pour cette raison, il a toujours été dangereux d'écraser l'état de manière _inconditionnelle_ en utilisant ces méthodes de cycle de vie. **Cette pratique conduira à une perte des mises à jour de l'état.**

Prenons un example pour illustrer ce problème. Voici un composant `EmailInput` qui « reflète » une prop `email` dans l'état :
```js
class EmailInput extends Component {
  state = { email: this.props.email };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  componentWillReceiveProps(nextProps) {
    // Ça va écraser toute mise à jour de l'état local !
    // Ne faites pas ça.
    this.setState({ email: nextProps.email });
  }
}
```

A première vue, ce composant à l'air bien. L'état est initialisé avec la valeur spécifiée par les props et mis à jour quand nous saisissons quelque chose dans la balise `<input>`. Cependant, si notre composant parent vient à être rendu à nouveau, tout ce que nous aurons saisie sera perdu ! ([Jetez un coup d'œil à cette démo par example.](https://codesandbox.io/s/m3w9zn1z8x)) Le problème persiste même si on compare `nextProps.email !== this.state.email` avant de réinitialiser la valeur.

Dans cette example, ajouter `shouldComponentUpdate` afin de réaliser un nouveau rendu quand la prop `email` change devrait résoudre le problème. Cependant, en pratique, les composants reçoivent plusieurs props et une autre prop pourrait provoquer un nouveau rendu et donc une réinitialisation malvenue. On notera également que Les props function et objet sont souvent inlinées ce qui rend difficile la mise en œuvre d'une méthode `shouldComponentUpdate` capable de retourner `true` à chaque changement substantiel. [Voici une démo qui montre ce qui ce passe dans un tel cas.](https://codesandbox.io/s/jl0w6r9w59) En conséquences, si `shouldComponentUpdate` est un bon système pour optimiser les performances, il ne vaux rien pour garantir la qualité des états dérivés.

On peut espérer que nous avons clairement établie que copier les props dans l'état de manière inconditionnelle est une mauvaise idée. Avant de passer en revue les solutions possibles, jetons un coup d'œil à un autre pattern problématique connexe : Que ce passerait-il si on met à jour l'état uniquement quand la prop `email` change ?

### Anti-pattern: Effacer l'état quand les props changent {#anti-pattern-erasing-state-when-props-change}

Si on reprend l'example précédent, on peut éviter d'effacer l'état accidentellement en ne le mettant à jour que lorsque `props.email` change :

```js
class EmailInput extends Component {
  state = {
    email: this.props.email
  };

  componentWillReceiveProps(nextProps) {
    // A chaque fois que props.email change, on met l'état à jour.
    if (nextProps.email !== this.props.email) {
      this.setState({
        email: nextProps.email
      });
    }
  }

  // ...
}
```

> Remarque :
>
> Bien que l'example précédent utilise `componentWillReceiveProps`, le même anti-pattern s'applique à `getDerivedStateFromProps`.

Nous avons réalisé une grosse amélioration. Á présent notre composant va effacer ce que nous avons saisie uniquement lorsque la prop changera.

Il y a cependant encore un problème subtile. Imaginez un gestionnaire de mot de passe qui utiliserai ce composant. En navigant entre les détails de deux comptes utilisant le même e-mail, le champs ne se mettrai pas à jour. Cela est dû au fait que la valeur de la prop passée au composant sera la même pour les deux comptes ! Ce serais une sacré surprise pour l'utilisateur puisque un changement non-sauvegardé pour un compte affecterai un autre qui partage le même e-mail. ([Voyez la démo ici.](https://codesandbox.io/s/mz2lnkjkrx))

Cette approche est fondamentalement incorrecte mais c'est également une erreur très facile à commettre. ([Je l'ai faite moi-même !](https://twitter.com/brian_d_vaughn/status/959600888242307072)) Heureusement, il y a deux alternatives qui fonctionnent mieux. Le point clé de ces alternatives tiens à ce que **pour n'importe quelle donnée vous devez choisir un seul composant comme source de vérité de cette donnée et vous devez éviter de la dupliquer dans d'autre composants.** Jetons un coup d'œil à ces alternatives.

## Les solution recommandées {#preferred-solutions}

### Recommandation: Un composant complètement controlé {#recommendation-fully-controlled-component}

Une façon d'éviter les problèmes que nous venons de voir consiste à supprimer complètement l'état de notre composant. Si l'adresse e-mail n'existe que sous la forme d'une prop nous n'avons pas à nous soucier d'un éventuel conflit avec l'état. On peut même convertir `EmailInput` en un petit composant fonction :
```js
function EmailInput(props) {
  return <input onChange={props.onChange} value={props.email} />;
}
```

Cette approche simplifie la mise en œuvre de notre composant mais si on veut toujours stocker une valeur intermédiaire, c'est le composant de formulaire parent qui va devoir gérer ça lui-même. ([Cliquez ici pour voir la démo de cette solution.](https://codesandbox.io/s/7154w1l551))

### Recommendation: Un composant complètement non-controlé avec une `key` {#recommendation-fully-uncontrolled-component-with-a-key}

Une autre possibilité serait que notre composant gère lui-même les états « intermédiaires » de l'e-mail. Dans ce cas notre composant pourrait toujours accepter une prop pour définir la valeur _initiale_ mais elle serait ignorée lors de tous ses changement subséquent :

```js
class EmailInput extends Component {
  state = { email: this.props.defaultEmail };

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }
}
```

Pour pouvoir réinitialiser la valeur lorsqu'on change de contexte (comme dans notre scénario de gestionnaire de mot de passe), on peut utiliser l'attribut spécial de React appelé `key`. Quand une `key` change, React [créera une nouvelle instance du composant plutôt que de mettre à jour le composant courant](/docs/reconciliation.html#keys). Les clés sont habituellement utilisées pour les listes dynamiques mais peuvent êtres également utiles dans ce cas. Dans notre example on pourrai utiliser l'ID de l'utilisateur pour recréer le champs e-mail à chaque fois qu'un nouvel utilisateur est sélectionné :

```js
<EmailInput
  defaultEmail={this.props.user.email}
  key={this.props.user.id}
/>
```

A chaque fois que l'ID change, le composant `EmailInput` sera recréé et son état sera initialisé avec la dernière valeur fournis par la prop `defaultEmail`. ([Cliquez ici pour voir la démo de cette solution.](https://codesandbox.io/s/6v1znlxyxn)) Avec cette méthode, vous n'avez pas à ajouter une `key` à tous les champs. C'est d'ailleurs sans doute plus sensé de rajouter une `key` sur le formulaire lui-même plutôt que sur un simple champs. De cette manière, chaque fois que la clé changera, tous les composants dans le formulaire seront recréés avec un nouvelle état fraichement initialisé.

Dans la plupart des cas, c'est la meilleur façon de gérer les états qui ont besoin d'êtres réinitialisés.

> Remarque :
>
> Bien que ça semble plus lent, la différence de performance est généralement insignifiante. Utiliser une clé peut même être plus rapide si les composants on une logique lourde qui s'exécute à chaque mise à jour, là où aucun calcul d'écart n'est réalisé sur l'arbre enfant.

#### Alternative 1: Réinitialisé un composant non-controlé avec une prop ID {#alternative-1-reset-uncontrolled-component-with-an-id-prop}

Si, pour quelque raison que ce soit, `key` ne répond pas aux besoins (peut-être que le composant est très couteux à initialiser), une solution possible mais lourde serait d'observer les changements de `userID` dans `getDerivedStateFromProps` :

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail,
    prevPropsUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // A chaque fois que l'utilisateur courant change, on réinitialise
    // tous les aspects de l'état qui sont liés à cet utilisateur.
    // Dans cette example simple, il ne s'agit que de l'e-mail.
    if (props.userID !== state.prevPropsUserID) {
      return {
        prevPropsUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

Ça donne aussi une certaine flexibilité pour ne réinitialiser qu'une partie de l'état de notre composant si c'est ce que l'on veut. ([Cliquez ici pour voir la démo de cette solution.](https://codesandbox.io/s/rjyvp7l3rq))

> Remarque :
>
> Bien que cet example n'utilise que `getDerivedStateFromProps`, la même technique peut être utilisée avec `componentWillReceiveProps`.

#### Alternative 2: Réinitialiser un composant non-controlé avec une méthode d'instance {#alternative-2-reset-uncontrolled-component-with-an-instance-method}

Plus rarement vous pouvez avoir besoin de réinitialiser un état même s'il n'y a pas d'ID utilisable avec `key`. Une solution possible consiste à utiliser une clé avec une valeur aléatoire ou un nombre incrémenté automatiquement chaque fois qu'on veux réinitialiser l'état. Une autre solution consiste à exposer une méthode d'instance qui forcera la réinitialisation de l'état interne :

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail
  };

  resetEmailForNewUser(newEmail) {
    this.setState({ email: newEmail });
  }

  // ...
}
```

Le composant de formulaire parent pourrait alors [utiliser une `ref` pour appeler cette méthode](/docs/glossary.html#refs). ([Cliquez ici pour voir la démo de cette solution.](https://codesandbox.io/s/l70krvpykl))

Les références peuvent être utiles dans certains cas comme celui-ci mais, généralement, nous recommandons de les utiliser avec parcimonie. Même dans le cadre de cette démo, cette méthode impérative est sous-optimale car elle entraine la réalisation de deux rendus au lieu d'un seul.

-----

### Récapitulons {#recap}

Quand on définie un composant, il est important de décider si ses données seront controlées ou non-controlées.

Plutôt que d'essayer de **refléter les valeur des props dans l'état**, faite un composant controlé et réconciliez les valeurs divergentes dans l'état d'un composant parent. Par example, plutôt que d'avoir un composant enfant qui accepterai une valeur « imperative » `props.value` et de suivre les valeurs intermédiaire via `state.value`, faites en sorte que le composant parent gère à la fois `state.draftValue` et `state.committedValue` pour qu'il contrôle ensuite directement la valeur du composant enfant. Ça rend le flux de données plus explicite et prédictif.

Pour les composants non-controlés, si vous essayez de réinitialiser l'état quand une prop particulière (en général un ID) change, vous avez peu d'options :
* **Recommandation: Réinitialiser _l'intégralité de l'état interne_ en utilisant un attribut `key`.**
* Alternative 1: Réinitialiser _certain champs de l'état_ en observant les changement d'une propriété donnée (i.e. `props.userID`).
* Alternative 2: Vous pouvez également envisager d'utiliser une méthode d'instance impérative via une référence.

## Et la mémoïsation dans tout ça ? {#what-about-memoization}

Nous avons également vu que les états dérivés étaient utilisés pour s'assurer qu'une valeur couteuse utilisée dans `render` n'était recalculée que lorsque les entrées changeaient. Cette technique est connus sous le nom de [mémoïsation](https://fr.wikipedia.org/wiki/M%C3%A9mo%C3%AFsation).

Utiliser les états dérivés pour la mémoïsation n'est pas nécessairement une mauvaise chose mais ce n'est généralement pas la meilleur solution. Il y a une complexité inhérente à la gestion des états dérivés et cette complexité s'accroit avec chaque nouvelle propriété. Par example, si nous ajoutons un deuxième champs dérivé à l'état de notre composant alors nous aurions à gérer séparément les changements de chacun d'eux.

Prenons l'example d'un composant qui prend une prop (une liste d'elements) et effectue le rendu des éléments qui correspondent au résultat d'une requête de recherche saisie par l'utilisateur. Nous pourrions utiliser un état dérivé pour stocker la liste filtrée :

```js
class Example extends Component {
  state = {
    filterText: "",
  };

  // *****************************************************************
  // REMARQUE: Cet example n'est pas la méthode que nous recommandons.
  // Voyez plutôt l'example ci-après pour avoir notre recommandation.
  // *****************************************************************

  static getDerivedStateFromProps(props, state) {
    // Ré-exécute le filtre à chaque fois que la liste ou le text du filtre change
    // Remarquez que nous avons besoin de stocker prevPropsList et prevFilterText
    // pour pouvoir détecter le changement.
    if (
      props.list !== state.prevPropsList ||
      state.prevFilterText !== state.filterText
    ) {
      return {
        prevPropsList: props.list,
        prevFilterText: state.filterText,
        filteredList: props.list.filter(item => item.text.includes(state.filterText))
      };
    }
    return null;
  }

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{this.state.filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

Cette solution évite de recalculer `filteredList` plus que nécessaire. Cependant c'est plus compliqué que ça ne devrais car il faut suivre et vérifier les changements individuels de chacunes des props et de l'état pour pouvoir mettre à jour la liste correctement. Dans cet example, nous pouvons simplifier les choses en utilisant `PureComponent` et en déplaçant les operation de filtrage dans la méthode de rendu :

```js
// Les PureComponents ne sont rendu que si au moins une props ou une valeur d'état change.
// Les changements sont déterminés en faisant une comparaison de surface des clés des objets props et state
class Example extends PureComponent {
  // L'état n'a besoin de retenir que le text du filtre courrant :
  state = {
    filterText: ""
  };

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // La méthode render de ce PureComponent est appelé seulement si
    // props.list ou state.filterText ont changés.
    const filteredList = this.props.list.filter(
      item => item.text.includes(this.state.filterText)
    )

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

La solution ci-avant est bien plus propre et simple que la version avec état dérivé. Parfois, ce ne sera pas suffisant—les filtres peuvent êtres lent à appliquer pour les listes longues et `PureComponent` n'empêchera pas le rendu si une autre prop venait à changer. Pour régler ces problèmes nous pouvons ajouter un utilitaire de mémoïsation pour éviter de filtrer inutilement notre liste plusieurs fois.

```js
import memoize from "memoize-one";

class Example extends Component {
  // L'état n'a besoin de retenir que le text du filtre courrant :
  state = { filterText: "" };

  // Le filtre est recalculé à chaque fois que la liste ou le texte du filtre change :
  filter = memoize(
    (list, filterText) => list.filter(item => item.text.includes(filterText))
  );

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // Calcule la dernière liste filtré. Si les arguments n'ont pas changés depuis
    // le dernier rendu, `memoize-one` réutilisera la dernière valeur renvoyée.
    const filteredList = this.filter(this.props.list, this.state.filterText);

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

C'est beaucoup plus simple et c'est aussi performant que la version avec état dérivé !

Quand vous utilisez la mémoïsation, souvenez vous des quelques contraintes suivantes :

1. Dans la plupart des cas, vous voudrez **rattacher la fonction mémoïsée à l'instance du composant**. Ça évite que de multiples instances d'un même composant ne réinitialisent les clés de mémoïsation les unes des autres.
1. En général, vous voudrez utiliser un utilitaire de mémoïsation avec une **taille de cache limité** afin d'éviter d'éventuelle fuite de mémoire au fur et à mesure que le temps passe. (Dans l'example précédent, nous avons utilisé `memoize-one` car il ne cache que le couple arguments/résultats le plus récent.)
1. Aucune des solutions présentées ici ne fonctionnera si `props.list` et recréée à chaque fois que le composant parent est rendu. Cependant, dans la plus part des cas ce système convient.

## En conclusion {#in-closing}

Dans les applications de la vie réelle, les composants comportent un mélange de comportements controlés et non-controlés. Ce n'est pas un problème ! Si chaque valeur a une source de vérité clairement identifiée vous pouvez éviter les anti-pattern que nous avons évoqués ici.

Ça vaut également la peine de redire que `getDerivedStateFromProps` (et les états dérivés en général) est une fonctionnalité avancée qui devrait être utilisée avec parcimonie du fait de sa complexité. Si vos cas d'utilisation sont différents de ces patterns, n'hésitez pas à les partager avec nous sur [GitHub](https://github.com/reactjs/reactjs.org/issues/new) ou [Twitter](https://twitter.com/reactjs) !
