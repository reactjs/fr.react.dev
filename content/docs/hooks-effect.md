---
id: hooks-state
title: Utiliser un Hook d’effet
permalink: docs/hooks-effect.html
next: hooks-rules.html
prev: hooks-state.html
---

Les *Hooks* sont une nouveauté de React 16.8. Ils permettent de bénéficier d’un état local et d'autres fonctionnalités de React sans avoir à écrire de classes.

Le *Hook d’effet* permet l’exécution d’effets de bord dans les fonctions composants :

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similaire à componentDidMount et componentDidUpdate :
  useEffect(() => {
    // Met à jour le titre du document via l’API du navigateur
    document.title = `Vous avez cliqué ${count} fois`;
  });

  return (
    <div>
      <p>Vous avez cliqué {count} fois</p>
      <button onClick={() => setCount(count + 1)}>
        Cliquez ici
      </button>
    </div>
  );
}
```

Cet extrait se base sur [l’exemple de compteur présenté à la page précédente](/docs/hooks-state.html), avec toutefois une fonctionnalité supplémentaire : le titre du document est mis à jour avec un message personnalisé affichant le nombre de clics.

Charger des données depuis un serveur distant, s’abonner à quelque chose et modifier manuellement le DOM sont autant d’exemples d’effets de bord. Que vous ayez ou non l’habitude de les appeler « effets de bord » (ou juste « effets »), il est hautement probable que vous les ayez déjà utilisés dans vos composants par le passé.

>Astuce
>
>Si vous avez l’habitude des méthodes de cycle de vie des classes React, pensez au Hook `useEffect` comme à une combinaison de `componentDidMount`, `componentDidUpdate`, et `componentWillUnmount`.

Il existe deux grands types d’effets de bord dans les composants React : ceux qui ne nécessitent pas de nettoyage, et ceux qui en ont besoin. Examinons cette distinction en détail.

## Effets sans nettoyage {#effects-without-cleanup}

Parfois, nous souhaitons **exécuter du code supplémentaire après que React a mis à jour le DOM**. Les requêtes réseau, les modifications manuelles du DOM, et la journalisation sont des exemples courants d’effets qui ne nécessitent aucun nettoyage. Cela s’explique par le fait qu’ils peuvent être oubliés immédiatement après leur exécution. Comparons donc la manière dont les classes et les Hooks nous permettent d’exprimer ce genre d’effets de bord.

### Exemple en utilisant les classes {#example-using-classes}

Dans les composants React à base de classe, la méthode `render` ne devrait causer aucun effet de bord par elle-même. Ce serait trop tôt : ces effets ne sont utiles qu’*après* que React a mis à jour le DOM.

C’est la raison pour laquelle, dans les classes React, nous plaçons les effets de bord dans les méthodes `componentDidMount` et `componentDidUpdate`. En reprenant notre exemple, voici un composant React à base de classe implémentant un compteur qui met à jour le titre du document juste après que React a modifié le DOM :

```js{9-15}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `Vous avez cliqué ${this.state.count} fois`;
  }

  componentDidUpdate() {
    document.title = `Vous avez cliqué ${this.state.count} fois`;
  }

  render() {
    return (
      <div>
        <p>Vous avez cliqué {this.state.count} fois</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Cliquez ici
        </button>
      </div>
    );
  }
}
```

Notez la **duplication de code entre ces deux méthodes de cycle de vie du composant.**

En effet, la plupart du temps nous voulons que l’effet de bord soit exécuté tant au montage qu’à la mise à jour du composant. Conceptuellement, nous voulons que l’effet soit exécuté à chaque affichage, mais les composants React à base de classe ne disposent pas d’une telle méthode. Même en déplaçant l’effet de bord dans une fonction à part, on aurait tout de même besoin de l’appeler à deux endroits distincts.

Maintenant, voyons comment faire la même chose avec le Hook `useEffect`.

### Exemple en utilisant les Hooks {#example-using-hooks}

Cet exemple figurait déjà en haut de page, mais examinons-le de plus près :

```js{1,6-8}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Vous avez cliqué ${count} fois`;
  });

  return (
    <div>
      <p>Vous avez cliqué {count} fois</p>
      <button onClick={() => setCount(count + 1)}>
        Cliquez ici
      </button>
    </div>
  );
}
```

**Que fait `useEffect` ?** On utilise ce Hook pour indiquer à React que notre composant doit exécuter quelque chose après chaque affichage. React enregistre la fonction passée en argument (que nous appellerons « effet »), et l’appellera plus tard, après avoir mis à jour le DOM. L’effet ci-dessus met à jour le titre du document, mais il pourrait aussi bien charger des données distantes, ou appeler n’importe quelle autre API impérative.

**Pourquoi `useEffect` est-elle invoquée à l’intérieur d’un composant ?** Le fait d’appeler `useEffect` à l’intérieur de notre composant nous permet d’accéder à la variable d’état `count` (ou à n’importe quelle prop) directement depuis l’effet. Pas besoin d’une API dédiée pour les lire : elle est déjà dans la portée de la fonction. Les Hooks profitent pleinement des fermetures lexicales *(closures, NdT)* de JavaScript au lieu d’introduire de nouvelles API spécifiques à React, là où JavaScript propose déjà une solution.

**Est-ce que `useEffect` est appelée après chaque affichage ?** Oui ! Elle est exécutée par défaut après le premier affichage *et* après chaque mise à jour. (Nous verrons comment [personnaliser et optimiser ça](#tip-optimizing-performance-by-skipping-effects) ultérieurement.) Au lieu de penser en termes de « montage » et de « démontage », pensez plutôt que les effets arrivent tout simplement « après l’affichage ». React garantit que le DOM a été mis à jour avant chaque exécution des effets.

### Explication détaillée {#detailed-explanation}

À présent que nous en savons davantage sur les effets, ces quelques lignes devraient paraître plus claires :

```js
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Vous avez cliqué ${count} fois`;
  });
}
```

Nous déclarons la variable d’état `count`, puis indiquons à React que nous avons besoin d’utiliser un effet. Nous passons alors une fonction au Hook `useEffect`. Cette fonction *est* notre effet. À l’intérieur de celui-ci, nous mettons à jour le titre du document en utilisant l’API du navigateur `document.title`. Il est possible d’y lire la dernière valeur de `count`, puisqu’elle est accessible depuis la portée de notre fonction. Lorsque React affichera notre composant, il se souviendra de notre effet, et l’exécutera après avoir mis à jour le DOM. Ce procédé est le même à chaque affichage, dont le tout premier.

Les développeurs JavaScript expérimentés remarqueront sans doute que la fonction passée à `useEffect` sera différente à chaque affichage. C‘est voulu, et c’est ce qui nous permet d’accéder à la valeur de `count` depuis l’intérieur de l’effet sans nous inquiéter de l’obsolescence de notre fonction. À chaque nouvel affichage, nous planifions un effet _différent_, qui succède au précédent. Dans un sens, les effets font partie intégrante du résultat du rendu : chaque effet « appartient » à un rendu particulier. Nous reviendrons plus en détail sur l’utilité d’un tel comportement [plus bas](#explanation-why-effects-run-on-each-update).

>Astuce
>
> À l’inverse de `componentDidMount` ou de `componentDidUpdate`, les effets planifiés avec `useEffect` ne bloquent en rien la mise à jour de l’affichage par le navigateur, ce qui rend votre application plus réactive. La majorité des effets n’ont pas besoin d’être synchrones. Dans les cas plus rares où ils pourraient en avoir besoin (comme mesurer les dimensions d’un élément de l’interface), il existe un Hook particulier [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect) avec une API identique à celle de `useEffect`.

## Effets avec nettoyage {#effects-with-cleanup}

Nous avons vu précédemment comment écrire des effets de bord ne nécessitant aucun nettoyage. Toutefois, quelques effets peuvent en avoir besoin. Par exemple, **nous pourrions souhaiter nous abonner** à une source de données externe. Dans ce cas-là, il est impératif de nettoyer par la suite pour éviter les fuites de mémoire ! Comparons les approches à base de classe et de Hooks pour y arriver.

### Exemple en utilisant les classes {#example-using-classes-1}

Dans une classe React, on s’abonne généralement dans `componentDidMount`, et on se désabonne dans `componentWillUnmount`. Par exemple, imaginons que nous avons un module `ChatAPI` qui permet de nous abonner au statut de connexion d’un ami. Voici comment on pourrait s’abonner et l’afficher en utilisant une classe :

```js{8-26}
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Chargement...';
    }
    return this.state.isOnline ? 'En ligne' : 'Hors-ligne';
  }
}
```

Remarquez l’effet miroir de `componentDidMount` et `componentWillUnmount`. Les méthodes de cycle de vie nous forcent à séparer cette logique alors que conceptuellement le code des deux méthodes a trait au même effet.

>Remarque
>
>Les lecteurs les plus attentifs remarqueront sans doute que cet exemple nécessite aussi `componentDidUpdate` pour être tout à fait correct. Nous avons choisi d’ignorer ça pour l’instant mais nous y reviendrons dans [une section ultérieure](#explanation-why-effects-run-on-each-update) de cette page.

### Exemple en utilisant les Hooks {#example-using-hooks-1}

Voyons comment réécrire notre exemple avec les Hooks.

Instinctivement, vous pourriez imaginer qu’un effet distinct est nécessaire pour le nettoyage. Mais les codes pour s’abonner et se désabonner sont si fortement liés que `useEffect` a été pensé pour les conserver ensemble. Si votre effet renvoie une fonction, React l’exécutera lors du nettoyage :

```js{6-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Indique comment nettoyer l'effet :
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Chargement...';
  }
  return isOnline ? 'En ligne' : 'Hors-ligne';
}
```

**Pourquoi notre effet renvoie-t-il une fonction ?** Il s’agit d’un mécanisme optionnel de nettoyage des effets. Tout effet peut renvoyer une fonction qui se chargera de son propre nettoyage. Cela permet de conserver les logiques d’abonnement et de désabonnement proches l’une de l’autre. Elles font partie du même effet !

**À quel moment précis React nettoie-t-il un effet ?** React effectue le nettoyage lorsqu’il démonte le composant. Cependant, comme nous l’avons appris précédemment, les effets sont exécutés à chaque affichage, donc potentiellement plus d’une fois. C’est la raison pour laquelle React nettoie *aussi* les effets du rendu précédent avant de les exécuter une nouvelle fois. Nous verrons [pourquoi ça permet d’éviter des bugs](#explanation-why-effects-run-on-each-update) et [comment éviter ce comportement s’il nuit aux performances](#tip-optimizing-performance-by-skipping-effects) dans un instant.

>Remarque
>
>La fonction renvoyée par l’effet peut parfaitement être anonyme. Dans notre exemple, nous l’avons nommée `cleanup` par souci de clarté, mais vous pouvez renvoyer une fonction fléchée ou lui donner n’importe quel nom.

## En résumé {#recap}

Nous avons appris que `useEffect` nous permet d’exprimer différentes sortes d’effets de bord après l’affichage d’un composant. Certains effets ont besoin de nettoyer derrière eux, et peuvent renvoyer une fonction pour ça :

```js
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

D’autres effets n’ont pas besoin de nettoyage, et ne renvoient rien.

```js
  useEffect(() => {
    document.title = `Vous avez cliqué ${count} fois`;
  });
```

Le Hook d’effet traite ces deux cas en une seule API.

-------------
**Si vous pensez avoir déjà bien saisi le fonctionnement du Hook d’effet, ou si c’en est déjà trop pour vous, n’hésitez pas à passer dès maintenant à la [prochaine page sur les règles des Hooks](/docs/hooks-rules.html).**

-------------

## Astuces pour l’utilisation des effets {#tips-for-using-effects}

Nous allons maintenant nous pencher sur certaines caractéristiques de `useEffect` qui ne manqueront pas de susciter la curiosité des utilisateurs les plus expérimentés de React. Ne vous sentez pas tenu·e d’y plonger dès à présent. Vous pourrez toujours revenir plus tard sur cette page afin d’y parfaire votre connaissance du Hook d’effet.

### Astuce : Utiliser plusieurs effets pour séparer les sujets {#tip-use-multiple-effects-to-separate-concerns}

Un des problèmes soulignés dans les [raisons](/docs/hooks-intro.html#complex-components-become-hard-to-understand) pour les Hooks, c’est que les méthodes de cycle de vie d’une classe de composant deviennent souvent des ramassis de logiques différentes, alors que celles qui sont liées entre elles sont éparpillées dans plusieurs méthodes. Voici un composant qui implémente à la fois notre exemple de compteur et celui du statut de connexion d’un ami :

```js
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `Vous avez cliqué ${this.state.count} fois`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `Vous avez cliqué ${this.state.count} fois`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
```

Remarquez comme le code qui modifie `document.title` est découpé entre `componentDidMount` et `componentDidUpdate`. Quant à la gestion de l'abonnement, elle est éparpillée entre `componentDidMount` et `componentWillUnmount`. De plus, `componentDidMount` contient du code relatif aux deux tâches.

Comment les Hooks résolvent-ils ce problème ? À l’instar du [Hook `useState` qui peut être utilisé plusieurs fois](/docs/hooks-state.html#tip-using-multiple-state-variables), il est possible d’utiliser plusieurs effets. Cela nous permet de séparer correctement les sujets sans rapport au sein d’effets distincts :

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `Vous avez cliqué ${count} fois`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
  // ...
}
```

**Les Hooks permettent de découper le code selon ce qu’il fait** plutôt qu’en fonction des noms de méthodes de cycle de vie. React appliquera *tous* les effets utilisés par le composant, dans l’ordre de leur déclaration.

### Explication : raisons pour lesquelles les effets sont exécutés à chaque mise à jour {#explanation-why-effects-run-on-each-update}

Si vous avez l'habitude des classes, vous pourriez vous demander pourquoi le nettoyage des effets s’effectue après chaque rendu, au lieu d’une seule fois au démontage. Voyons un exemple pratique pour comprendre en quoi ce choix de conception nous aide à réduire les bugs dans nos composants.

[Plus haut dans cette page](#example-using-classes-1), nous avons présenté le composant d’exemple `FriendStatus` qui affiche le statut de connexion d’un ami. Notre classe récupère `friend.id` depuis `this.props`, s’abonne au statut de connexion une fois le composant monté, et se désabonne au démontage :

```js
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

**Mais que se passe-t-il si la propriété `friend` change** alors que le composant est affiché ? Notre composant continuerait d’afficher le statut de connexion de notre ami initial. C’est un bug. Nous causerions également une fuite de mémoire ou un plantage au démontage, la fonction de désabonnement utilisant l’ID du nouvel ami.

Dans un composant à base de classe, il faudrait ajouter `componentDidUpdate` pour gérer ce cas :

```js{8-19}
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate(prevProps) {
    // Se désabonne du statut de l’ami précédent
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // S’abonne au statut du prochain ami
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

Les applications React souffrent fréquemment de bugs dus à l’oubli d’une gestion correcte de `componentDidUpdate`.

Maintenant, examinez ce même composant qui utiliserait des Hooks :

```js
function FriendStatus(props) {
  // ...
  useEffect(() => {
    // ...
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

Il ne rencontre pas ce bug. (Mais nous n’y avons apporté aucun changement.)

Pas besoin de code spécifique pour gérer les mises à jour puisque `useEffect` les traite *par défaut*. Le hook nettoie les effets précédents avant d’appliquer les suivants. Pour illustrer ça, voici la séquence des abonnements et des désabonnements que ce composant pourrait produire au fil du temps :

```js
// Montage avec les propriétés { friend: { id: 100 } }
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // Exécute l’effet 1

// Mise à jour avec les propriétés { friend: { id: 200 } }
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // Nettoie l’effet 1
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // Exécute l’effet 2

// Mise à jour avec les propriétés { friend: { id: 300 } }
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // Nettoie l’effet 2
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // Exécute l’effet 3

// Démontage
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // Nettoie l’effet 3
```

Ce comportement par défaut garantit la cohérence et résout les bugs les plus courants des composants à base de classe qui oublient de gérer les mises à jour.

### Astuce : optimiser les performances en sautant des effets {#tip-optimizing-performance-by-skipping-effects}

Dans certains cas, nettoyer ou exécuter l’effet après chaque affichage risque de nuire aux performances. Dans les composants à base de classe, une solution consiste à comparer `prevProps` ou `prevState` dans `componentDidUpdate` :

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `Vous avez cliqué ${this.state.count} fois`;
  }
}
```

Ce genre de comportement est tellement courant qu’il est intégré dans l’API du Hook `useEffect`. Il est possible d’indiquer à React de *sauter* l’exécution d’un effet si certaines valeurs n’ont pas été modifiées entre deux affichages. Pour cela, il suffit de passer une liste comme second argument optionnel à `useEffect` :

```js{3}
useEffect(() => {
  document.title = `Vous avez cliqué ${count} fois`;
}, [count]); // N’exécute l’effet que si count a changé
```

Dans l’exemple ci-dessus, nous passons `[count]` comme second argument. Qu’est-ce que ça signifie ? Si `count` vaut `5`, et que notre composant est ré-affiché avec `count` toujours égal à `5`, React comparera le `[5]` de l’affichage précédent au `[5]` du suivant. Comme tous les éléments de la liste sont identiques (`5 === 5`), React n’exécutera pas l’effet. Et voilà notre optimisation.

Quand le composant est ré-affiché avec `count` égal à `6`, React comparera la liste d’éléments `[5]` de l'affichage précédent avec la liste `[6]` du suivant. Cette fois, React ré-exécutera l’effet car `5 !== 6`. Dans le cas où la liste contiendrait plusieurs éléments, React ré-appliquera l’effet si au moins l’un d’entre eux est différent de sa version précédente.

Le fonctionnement est le même pour la phase de nettoyage :

```js{10}
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Ne se ré-abonne que si props.friend.id change
```

À l’avenir, ce second argument pourrait être injecté automatiquement au moment de la compilation.

>Remarque
>
>Si vous utilisez cette optimisation, assurez-vous que votre tableau inclut bien **toutes les valeurs dans la portée du composant (telles que les props et l'état local) qui peuvent changer avec le temps et sont utilisées par l'effet**. Sinon, votre code va référencer des valeurs obsolètes issues des rendus précédents.  Vous pouvez en apprendre davantage sur [la façon de gérer les dépendances à des fonctions](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) et comment faire quand [les dépendances listées changent trop souvent](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often).
>
>Si vous voulez exécuter un effet et le nettoyer une seule fois (au montage puis au démontage), vous pouvez passer un tableau vide (`[]`) comme second argument.  Ça indique à React que votre effet ne dépend *d’aucune* valeur issue des props ou de l'état local, donc il n’a jamais besoin d’être ré-exécuté.  Il ne s'agit pas d'un cas particulier : ça découle directement de la façon dont le tableau des dépendances fonctionne à la base.
>
>Si vous passez un tableau vide (`[]`), les props et l'état local vus depuis l'intérieur de l'effet feront toujours référence à leurs valeurs initiales.  Même si passer `[]` comme second argument vous rapproche du modèle mental habituel de `componentDidMount` et `componentWillUnmount`, il y a en général de [meilleures](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [solutions](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) pour éviter de ré-exécuter les effets trop souvent. Par ailleurs, ne perdez pas de vue que React défère l’exécution de `useEffect` jusqu’à ce que le navigateur ait fini de rafraîchir l’affichage, du coup y faire plus de travail est moins un problème.
>
>Nous vous conseillons d’utiliser la règle [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) fournie par le module [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Elle vous avertira si des dépendances sont mal spécifiées et vous suggèrera un correctif.

## Prochaines étapes {#next-steps}

Félicitations ! C‘était une bien longue page, mais avec un peu de chance la plupart de vos questions à propos des effets ont pu y trouver une réponse. Vous avez appris à utiliser le Hook d’état et le Hook d’effet, qui vous ouvrent *beaucoup* de possibilités à eux deux. Ils couvrent la majorité des cas d’usage pour les classes—et sinon, peut-être trouverez-vous les [Hooks supplémentaires](/docs/hooks-reference.html) bien utiles.

Nous commençons également à deviner comment les Hooks peuvent résoudre les problématiques listées dans les [raisons](/docs/hooks-intro.html#motivation). Nous avons vu comment le nettoyage des effets évite la duplication de code dans `componentDidUpdate` et `componentWillUnmount`, regroupe le code par sujet, et aide à éviter les bugs. Enfin, nous avons appris comment séparer les effets selon leur finalité, ce qui était totalement impossible avec les classes.

A ce stade vous vous demandez peut-être comment les Hooks fonctionnent. Comment React sait-il quel appel de `useState` correspond à quelle variable d’état local d’un affichage à l’autre ? Comment React « associe-t-il » l’effet précédent au suivant à chaque mise à jour ? **Rendez-vous dans la prochaine page pour apprendre les [règles des Hooks](/docs/hooks-rules.html), qui sont indispensables à leur bon fonctionnement.**
