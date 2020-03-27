---
title: "Vous n'avez sans doute pas besoin d'états dérivés"
author: [bvaughn]
---

React 16.4 apportait [un correctif pour `getDerivedStateFromProps`](/blog/2018/05/23/react-v-16-4.html#bugfix-for-getderivedstatefromprops) qui déclenchait certains bugs connus des composants React plus fréquemment. Si la publication de cette version a mis en évidence un _anti-pattern_ dans votre application et l'a cassée, nous sommes désolés pour le désagrément. Dans cet article nous allons passer en revue certains anti-patterns habituels autour des états dérivés et les alternatives que nous recommandons.

Depuis longtemps, la méthode de cycle de vie `componentWillReceiveProps` était la seule façon de mettre à jour un état suite à un changement de props sans pour autant déclencher un rendu supplémentaire. Dans la version 16.3, [nous avons introduit une méthode de cycle de vie de remplacement `getDerivedStateFromProps`](/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes) pour résoudre les même problèmes mais de manière plus fiable. Dans le même temps, nous nous sommes aperçu qu'il y avait de nombreuses idées fausses autour de l'utilisation de ces deux méthodes et nous avons découvert des anti-patterns qui entraînaient des bugs à la fois subtils et déroutants. Le correctif pour `getDerivedStateFromProps` dans la version 16.4 [rend les états dérivés plus prévisibles](https://github.com/facebook/react/issues/12898), ce qui rend les conséquences d'une mauvaise utilisation plus faciles à repérer.

> Remarque
>
> Tous les anti-patterns décrits dans cet article s'appliquent aussi bien à la vieille méthode `componentWillReceiveProps` qu'à la nouvelle `getDerivedStateFromProps`.

Cet article va couvrir les sujets suivants :
* [Quand utiliser un état dérivé](#when-to-use-derived-state)
* [Les bug courants relatifs à un état dérivé](#common-bugs-when-using-derived-state)
  * [Anti-pattern : copie inconditionnelle des props dans l'état](#anti-pattern-unconditionally-copying-props-to-state)
  * [Anti-pattern : effacer l'état quand les props changent](#anti-pattern-erasing-state-when-props-change)
* [Les solutions recommandées](#preferred-solutions)
* [Et la mémoïsation dans tout ça ?](#what-about-memoization)

## Quand utiliser un état dérivé {#when-to-use-derived-state}

`getDerivedStateFromProps` n'existe que dans un seul but. Il permet à un composant de mettre à jour son état interne suite à **un changement de ses props**. Notre article de blog précédent fournissait quelques exemples tels que [l'enregistrement de la direction du défilement basé sur le changement d'une prop `offset`](/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props) ou [le chargement de données externes spécifiées avec une prop `source`](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change).

Nous n'avons pas donné beaucoup d'exemples car, de manière générale, **les états dérivés devraient être utilisés avec parcimonie**. Tous les problèmes que nous avons identifiés avec les états dérivés peuvent au bout du compte se résumer à (1) la mise à jour inconditionnelle de l'état à partir des props ou (2) la mise à jour de l'état à chaque fois que l'état et les props ne correspondent pas. (Nous allons détailler ces deux cas ci-après.)

* Si vous utilisez un état dérivé pour mémoïser certains calculs sur la seule base des props courantes, alors vous n'avez pas besoin d’un état dérivé. Allez plutôt voir [Et la mémoïsation dans tout ça ?](#what-about-memoization) ci-après.
* Si vous mettez à jour votre état dérivé quoi qu'il arrive, ou dès que l'état et les props ne correspondent pas, il y a de fortes chances que votre composant réinitialise son état trop fréquemment. Continuez votre lecture pour en apprendre davantage.

## Les bugs courants relatifs à un état dérivé {#common-bugs-when-using-derived-state}

Les termes [« contrôlé »](/docs/forms.html#controlled-components) et [« non-contrôlé »](/docs/uncontrolled-components.html) se réfèrent habituellement aux champs de formulaires, mais ils peuvent également décrire l’endroit où vivent les données d'un composant. Les données passées dans des props peuvent être considérées comme **contrôlées** (parce que le composant parent _contrôle_ ces données). Les données qui existent uniquement dans l'état local peuvent être considérées comme **non-contrôlées** (parce que le composant parent ne peut pas les changer directement).

L'erreur la plus fréquente avec les états dérivés survient lorsqu'on mélange les deux concepts ; quand la valeur d'un état dérivé est également mise à jour par un appel à `setState`, il n'y a plus une seule source de vérité pour les données. [L'exemple du chargement de données externes](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change) évoqué ci-avant peut sembler similaire mais il est en réalité différent sur un certain nombre de points clés. Dans l'exemple du chargement, il y a une source de vérité clairement identifiée à la fois pour la prop `source` et pour l'état de « chargement en cours ». Quand la prop `source` change, l'état de chargement devrait **toujours** être écrasé. Inversement, l'état n'est écrasé que lorsque la prop **change** et n'est géré par le composant que dans les autres cas.

Les problèmes surviennent dès qu’une de ces contraintes change. Ça se produit habituellement de deux façons possibles. Voyons chacun de ces cas.

### Anti-pattern : copie inconditionnelle des props dans l'état {#anti-pattern-unconditionally-copying-props-to-state}

Une erreur courante consiste à croire que `getDerivedStateFromProps` et `componentWillReceiveProps` ne sont appelées que lorsque les props « changent ». Ces méthodes de cycle de vie sont appelées à chaque fois qu'un composant parent se rafraîchit, peu importe que les props soient « différentes » ou non de la fois précédente. Pour cette raison, il a toujours été dangereux d'écraser l'état de manière _inconditionnelle_ en utilisant ces méthodes de cycle de vie. **Cette pratique conduira à la perte des mises à jour de l'état.**

Prenons un exemple pour illustrer ce problème. Voici un composant `EmailInput` qui « reflète » une prop `email` dans l'état :
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

A première vue, ce composant a une bonne tête. L'état est initialisé avec la valeur spécifiée par les props puis mis à jour quand nous saisissons quelque chose dans l’élément `<input>`. Cependant, si notre composant parent vient à se rafraîchir, tout ce que nous aurons saisi sera perdu ! ([Jetez un coup d'œil à cette démo par exemple.](https://codesandbox.io/s/m3w9zn1z8x)) Le problème persiste même si on compare `nextProps.email !== this.state.email` avant de réinitialiser la valeur.

Dans cet exemple simple, ajouter `shouldComponentUpdate` afin de ne se rafraîchir que lorsque la prop `email` change devrait résoudre le problème. Mais en pratique, les composants reçoivent en général plusieurs props et une autre prop pourrait provoquer un rafraîchissement et donc une réinitialisation malvenue. On notera également que les props fonctions et objets sont souvent créées à la volée, ce qui rend difficile la mise en œuvre d'une méthode `shouldComponentUpdate` capable de retourner `true` uniquement lors d’un changement substantiel. [Voici une démo qui montre ce qui ce passe dans un tel cas.](https://codesandbox.io/s/jl0w6r9w59) En conséquence, si `shouldComponentUpdate` est une bonne manière d’optimiser les performances, elle ne vaut rien pour garantir la qualité d’un état dérivé.

Nous espérons avoir clairement établi que **copier les props dans l'état de manière inconditionnelle est une mauvaise idée**. Avant de passer en revue les solutions possibles, jetons un coup d'œil à une approche problématique connexe : que se passerait-il si on mettait à jour l'état uniquement quand la prop `email` change ?

### Anti-pattern : effacer l'état quand les props changent {#anti-pattern-erasing-state-when-props-change}

En reprenant l'exemple précédent, on peut éviter d'effacer l'état accidentellement en ne le mettant à jour que lorsque `props.email` change :

```js
class EmailInput extends Component {
  state = {
    email: this.props.email
  };

  componentWillReceiveProps(nextProps) {
    // À chaque fois que props.email change, on met l’état à jour.
    if (nextProps.email !== this.props.email) {
      this.setState({
        email: nextProps.email
      });
    }
  }

  // ...
}
```

> Remarque
>
> Bien que l'exemple précédent utilise `componentWillReceiveProps`, le même anti-pattern s'applique à `getDerivedStateFromProps`.

Nous avons réalisé une grosse amélioration. À présent notre composant effacera notre saisie uniquement lorsque la prop changera.

Un problème subtil demeure cependant. Imaginez un gestionnaire de mots de passe qui utiliserait ce composant. En navigant entre les détails de deux comptes utilisant le même e-mail, le champ ne se mettrait pas à jour. Ça viendrait du fait que la valeur de la prop passée au composant serait la même pour les deux comptes ! Ce serait une sacrée surprise pour l'utilisateur puisqu’un changement non-sauvegardé pour un compte affecterait tous ceux qui partagent le même e-mail. ([Voyez la démo ici.](https://codesandbox.io/s/mz2lnkjkrx))

Cette approche est fondamentalement incorrecte mais c'est aussi une erreur très facile à commettre. ([Je l'ai faite moi-même !](https://twitter.com/brian_d_vaughn/status/959600888242307072)) Heureusement, il y a deux alternatives qui fonctionnent mieux. Le point clé de ces alternatives tient à ce que **pour n'importe quelle donnée vous devez choisir un seul composant comme source de vérité, et éviter de la dupliquer dans d'autres composants.** Jetons un coup d'œil à ces alternatives.

## Les solutions recommandées {#preferred-solutions}

### Recommandation : un composant pleinement contrôlé {#recommendation-fully-controlled-component}

Une façon d'éviter les problèmes que nous venons de voir consiste à retirer complètement l'état de notre composant. Si l'adresse e-mail n'existe que sous la forme d'une prop nous n'avons pas à nous soucier d'un éventuel conflit avec l'état. On peut même convertir `EmailInput` en une fonction composant plus légère :
```js
function EmailInput(props) {
  return <input onChange={props.onChange} value={props.email} />;
}
```

Cette approche simplifie l’implémentation de notre composant mais si on veut toujours stocker une valeur intermédiaire, c'est le composant de formulaire parent qui va devoir gérer ça lui-même. ([Cliquez ici pour voir une démo de cette solution.](https://codesandbox.io/s/7154w1l551))

### Recommandation : un composant pleinement non-contrôlé avec une `key` {#recommendation-fully-uncontrolled-component-with-a-key}

Une autre possibilité serait que notre composant gère lui-même le « brouillon » d’état de l'e-mail. Dans ce cas notre composant pourrait toujours accepter une prop pour définir la valeur _initiale_ mais tout changement ultérieur de cette prop serait ignoré :

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

Pour pouvoir réinitialiser la valeur lorsqu'on change de contexte (comme dans notre scénario de gestionnaire de mots de passe), on peut utiliser l'attribut spécial de React appelé `key`. Quand une `key` change, React [créera une nouvelle instance du composant plutôt que de mettre à jour le composant actuel](/docs/reconciliation.html#keys). Les clés sont habituellement utilisées pour les listes dynamiques mais sont aussi utiles dans ce cas. Dans notre exemple on pourrait utiliser l'ID de l'utilisateur pour recréer le champ e-mail à chaque sélection d'un nouvel utilisateur :

```js
<EmailInput
  defaultEmail={this.props.user.email}
  key={this.props.user.id}
/>
```

À chaque fois que l'ID change, le composant `EmailInput` sera recréé et son état sera initialisé avec la dernière valeur fournie par la prop `defaultEmail`. ([Cliquez ici pour voir la démo de cette solution.](https://codesandbox.io/s/6v1znlxyxn)) Avec cette approche, vous n'avez pas à ajouter une `key` à tous les champs. C'est d'ailleurs sans doute plus sensé d’ajouter une `key` sur le formulaire lui-même plutôt que sur un simple champ. De cette manière, chaque fois que la clé changera, tous les composants dans le formulaire seront recréés avec un nouvel état fraîchement initialisé.

C'est généralement la meilleure façon de gérer les états qui ont besoin d'être réinitialisés.

> Remarque
>
> Bien que ça semble plus lent, la différence de performance est généralement insignifiante. Utiliser une clé peut même s’avérer plus rapide si les composants exécutent une logique métier coûteuse à chaque mise à jour, puisqu’ici la comparaison des arbres enfants est court-circuitée.

#### Alternative 1 : réinitialiser un composant non-contrôlé avec une prop ID {#alternative-1-reset-uncontrolled-component-with-an-id-prop}

Si, pour quelque raison que ce soit, `key` ne répond pas aux besoins (peut-être que le composant est très coûteux à initialiser), une solution possible mais pataude consisterait à observer les changements de `userID` dans `getDerivedStateFromProps` :

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail,
    prevPropsUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // À chaque fois que l’utilisateur actuel change, on réinitialise
    // tous les aspects de l’état qui sont liés à cet utilisateur.
    // Dans cet exemple simple, il ne s’agit que de l’e-mail.
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

Ça donne aussi une certaine flexibilité pour ne réinitialiser qu'une partie de l'état de notre composant si c'est ce que l'on veut. ([Cliquez ici pour voir une démo de cette solution.](https://codesandbox.io/s/rjyvp7l3rq))

> Remarque
>
> Bien que cet exemple n'utilise que `getDerivedStateFromProps`, la même technique peut être utilisée avec `componentWillReceiveProps`.

#### Alternative 2 : réinitialiser un composant non-contrôlé avec une méthode d'instance {#alternative-2-reset-uncontrolled-component-with-an-instance-method}

Plus rarement vous pouvez avoir besoin de réinitialiser un état même s'il n'y a pas d'ID utilisable pour `key`. Une solution possible consiste à utiliser une clé avec une valeur aléatoire ou un nombre incrémenté automatiquement chaque fois qu'on veut réinitialiser l'état. Une autre solution consiste à exposer une méthode d'instance qui forcera la réinitialisation de l'état interne :

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

Le composant de formulaire parent pourrait alors [utiliser une `ref` pour appeler cette méthode](/docs/glossary.html#refs). ([Cliquez ici pour voir une démo de cette solution.](https://codesandbox.io/s/l70krvpykl))

Les refs peuvent être utiles dans certains cas comme celui-ci mais de façon générale, nous recommandons de les utiliser avec parcimonie. Même dans le cadre de cette démo, cette méthode impérative est sous-optimale car elle entraîne la réalisation de deux rendus au lieu d'un seul.

-----

### En résumé {#recap}

Quand on définit un composant, il est important de décider si ses données seront contrôlées ou non-contrôlées.

Plutôt que d'essayer de **refléter une valeur de prop dans l'état**, faites un composant **contrôlé** et réconciliez les valeurs divergentes dans l'état d'un composant parent. Par exemple, plutôt que d'avoir un composant enfant qui accepterait une valeur « finalisée » `props.value` et garderait trace de sa valeur « brouillon » dans `state.value`, faites en sorte que le composant parent gère à la fois `state.draftValue` et `state.committedValue` pour qu'il contrôle ensuite directement la valeur du composant enfant. Ça rend le flux de données plus explicite et prévisible.

Pour les composants **non-contrôlés**, si vous essayez de réinitialiser l'état quand une prop particulière (en général un ID) change, vous avez quelques options :
* **Recommandation : réinitialiser _l'intégralité de l'état interne_ en utilisant un attribut `key`.**
* Alternative 1 : réinitialiser _certains champs de l'état_ en observant les changements d'une prop donnée (i.e. `props.userID`).
* Alternative 2 : vous pouvez également envisager d'utiliser une méthode d'instance impérative via une ref.

## Et la mémoïsation dans tout ça ? {#what-about-memoization}

Nous avons également vu des états dérivés utilisés pour s'assurer qu'une valeur coûteuse utilisée dans `render` n'était recalculée que lorsque ses entrées changeaient. Cette technique est connue sous le nom de [mémoïsation](https://fr.wikipedia.org/wiki/M%C3%A9mo%C3%AFsation).

Utiliser un état dérivé pour la mémoïsation n'est pas nécessairement une mauvaise chose mais ce n'est généralement pas la meilleure solution. Il y a une complexité inhérente à la gestion d'un état dérivé et cette complexité s'accroît avec chaque nouvelle propriété. Par exemple, si nous ajoutions un deuxième champ dérivé à l'état de notre composant alors nous aurions à gérer séparément les changements de chacun d'eux.

Prenons l'exemple d'un composant qui prend une prop (une liste d'éléments) et affiche les éléments qui correspondent au résultat d'une requête de recherche saisie par l'utilisateur. Nous pourrions utiliser un état dérivé pour stocker la liste filtrée :

```js
class Example extends Component {
  state = {
    filterText: "",
  };

  // ******************************************************************
  // REMARQUE : cet exemple n’est PAS la méthode que nous recommandons.
  // Voyez plutôt l’exemple ci-après pour avoir notre recommandation.
  // ******************************************************************

  static getDerivedStateFromProps(props, state) {
    // Ré-exécute le filtre à chaque fois que la liste ou le texte du filtre change.
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

Cette solution évite de recalculer `filteredList` plus que nécessaire. Elle est toutefois inutilement compliquée car il faut suivre et vérifier les changements individuels de chacune des props et variables d'état pour pouvoir mettre à jour la liste correctement. Dans cet exemple, nous pouvons simplifier les choses en utilisant `PureComponent` et en déplaçant le filtrage dans la méthode de rendu :

```js
// Les PureComponents ne se rafraîchissent que si au moins
// une valeur de prop ou d’état change.  Les changements sont
// déterminés en faisant une comparaison de surface des clés
// des objets props et state
class Example extends PureComponent {
  // L’état n’a besoin de retenir que le texte actuel du filtre :
  state = {
    filterText: ""
  };

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // La méthode render de ce PureComponent est appelée seulement si
    // props.list ou state.filterText ont changé.
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

La solution ci-avant est bien plus propre et simple que la version avec état dérivé. Parfois, ce ne sera pas suffisant : les filtres peuvent être lents à appliquer pour les listes longues et `PureComponent` n'empêchera pas le rendu si une autre prop venait à changer. Pour régler ces problèmes nous pouvons ajouter un utilitaire de mémoïsation pour éviter de filtrer inutilement notre liste plusieurs fois.

```js
import memoize from "memoize-one";

class Example extends Component {
  // L’état n’a besoin de retenir que le texte actuel du filtre :
  state = { filterText: "" };

  // Le filtre est recalculé à chaque fois que la liste ou le texte du filtre change :
  filter = memoize(
    (list, filterText) => list.filter(item => item.text.includes(filterText))
  );

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // Calcule la dernière liste filtrée. Si les arguments n’ont pas changé depuis
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

Quand vous utilisez la mémoïsation, souvenez-vous des quelques contraintes suivantes :

1. Dans la plupart des cas, vous voudrez **rattacher la fonction mémoïsée à l'instance du composant**. Ça évite que de multiples instances d'un même composant ne réinitialisent les clés de mémoïsation les unes des autres.
2. En général, vous voudrez utiliser un utilitaire de mémoïsation avec une **taille de cache limitée** afin d'éviter d'éventuelles fuites de mémoire au fil du temps. (Dans l'exemple précédent, nous avons utilisé `memoize-one` car il ne cache que le couple arguments/résultat le plus récent.)
3. Aucune des solutions présentées ici ne fonctionnera si `props.list` est recréée à chaque fois que le composant parent se rafraîchit. Cependant, dans la plupart des cas ce système convient.

## En conclusion {#in-closing}

Dans de véritables applications en production, les composants comportent souvent un mélange de comportements contrôlés et non-contrôlés. Ce n'est pas un problème ! Si chaque valeur a une source de vérité clairement identifiée vous pouvez éviter les anti-patterns que nous avons évoqués ici.

Ça vaut également la peine de rappeler que `getDerivedStateFromProps` (et les états dérivés en général) est une fonctionnalité avancée qui devrait être utilisée avec parcimonie du fait de sa complexité. Si vos cas d'utilisation sont différents de ces schémas, n'hésitez pas à les partager avec nous sur [GitHub](https://github.com/reactjs/reactjs.org/issues/new) ou [Twitter](https://twitter.com/reactjs) !
