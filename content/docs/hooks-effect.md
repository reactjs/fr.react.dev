---
id: hooks-state
title: Utiliser un Effect Hook
permalink: docs/hooks-effect.html
next: hooks-rules.html
prev: hooks-intro.html
---

Les *Hooks* sont une nouveauté introduite dans React 16.8. Ils permettent d‘utiliser la gestion d‘état, ainsi que d‘autres fonctionnalités de React, en se passant des classes.

Le *Effect Hook* permet l‘exécution d‘effets de bord dans les Fonctions Composants :

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similaire à componentDidMount et componentDidUpdate :
  useEffect(() => {
    // Met à jour le titre du document via l‘API du navigateur
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

Cet extrait se base sur [l‘exemple de compteur présenté à la page précédente](/docs/hooks-state.html), avec toutefois une fonctionnalité supplémentaire : le titre du document est mis à jour avec un message personnalisé affichant le nombre de clics.

Récupérer des données depuis un serveur distant, s‘abonner à une souscription et modifier manuellement le DOM constituent des exemples d‘effets de bord. Qu‘ils soient désignés "effets de bord" (ou juste "effets"), il est hautement probable que vous les ayez déjà utilisés dans vos composants par le passé.

>Astuce
>
>Si les méthodes du cycle de vie des classes React vous sont plus familières, vous pouvez penser le Hook `useEffect` comme une combinaison de `componentDidMount`, `componentDidUpdate`, et `componentWillUnmount`.

Il existe deux grands types d‘effets de bord dans les composants React : ceux qui ne nécessitent pas de nettoyage, et ceux qui en ont besoin. Éxaminons cette distinction en détail.

## Effets sans nettoyage {#effects-without-cleanup}

Parfois, il arrive d‘avoir à **exécuter du code supplémentaire après que React a mis à jour le DOM**. Les accès au réseau, les modifications manuelles du DOM, et le logging sont des exemples courants d‘effets qui ne nécessitent aucun nettoyage. Cela s‘explique par le fait qu‘ils peuvent être oubliés immédiatement après leur exécution. Comparons donc la manière dont les classes et les Hooks nous permettent d‘exprimer ce genre d‘effets de bord.

### Exemple en utilisant les classes {#example-using-classes}

Dans les composants React à base de classe, la méthode `render` ne devrait causer aucun effet de bord par elle-même. Ce serait trop tôt -- ces effets trouvent leur intérêt *après* que React a mis à jour le DOM.

C‘est la raison pour laquelle les composants à base de classe React exécutent les effets de bord dans les méthodes `componentDidMount` et `componentDidUpdate`. En reprenant notre exemple, voici un composant React à base de classe implémentant un compteur qui met à jour le titre du document juste après que React a modifié le DOM :

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

Notez la **duplication de code entre les deux méthodes du cycle de vie du composant.**

En effet, le même effet de bord doit être exécuté au montage et à la mise à jour du composant. Idéalement, il faudrait que cet effet soit exécuté à chaque rendu -- mais les composants React à base de classe ne disposent pas d‘une telle méthode. Même en découpant ce code pour déclarer l‘effet de bord dans une fonction à part, celle-ci devra malgré tout être invoquée à deux endroits distincts.

Maintenant, voyons comment fonctionne le Hook `useEffect`.

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

**Que fait `useEffect` ?** Utiliser ce Hook indique à React que notre composant doit exécuter quelque chose après chaque rendu. React enregistre la fonction passée en paramètre (nous y référerons par la suite comme notre "effet"), mais l‘appelera plus tard, après avoir mis à jour le DOM. L‘effet ci-dessus met à jour le titre du document, mais il pourrait aussi bien interroger un serveur distant pour y récupérer des données, ou appeler n‘importe quelle autre API impérative.

**Pourquoi `useEffect` est-elle invoquée à l‘intérieur d‘un composant ?** Le fait d‘appeler `useEffect` à l‘intérieur de notre composant lui permet d‘accéder à la variable d‘état `count` (*state variable, NdT*) (ou à n‘importe quelle propriété du composant). Pas besoin d‘une quelconque API externe pour y faire référence -- elle est déjà contenue dans le contexte de la fonction (*function scope, NdT*). Les Hooks tirent avantage des fermetures lexicales de JavaScript (*JavaScript closures, NdT*) au lieu d‘introduire de nouvelles librairies spécifiques à React, là où JavaScript offre déjà une solution plus que satisfaisante.

**Est-ce que `useEffect` est appelée après chaque rendu ?** Oui ! Elle est exécutée par défaut après le premier rendu *et* après chaque mise à jour. (Nous aborderons sa [personnalisation et son optimisation](#tip-optimizing-performance-by-skipping-effects) ultérieurement.) Au lieu que de penser en termes de « montage » et de « démontage », pensez plutôt que les effets arrivent tout simplement « après le rendu ».

### Explication détaillée {#detailed-explanation}

Notre connaissance des effets étant désormais plus étoffée, ces quelques lignes devraient paraître évidentes :

```js
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Vous avez cliqué ${count} fois`;
  });
```

Nous déclarons la variable d‘état `count`, puis indiquons à React que nous devons utiliser un effet. Nous passons alors une fonction au Hook `useEffect`. Cette fonction *est* notre effet. À l‘intérieur de celui-ci, le titre du document est mis à jour en utilisant l‘API du navigateur `document.title`. Il donc possible d‘y lire la dernière valeur de `count`, puisqu‘elle est contenue dans le contexte de notre fonction. Lorsque React affichera notre composant, il se souviendra de notre effet, et l‘exécutera après avoir mis à jour le DOM. Ce procédé est le même à chaque rendu, dont le tout premier.

Les développeurs JavaScript les plus aguerris ne manqueront pas de noter que la fonction passée à `useEffect` sera différente à chaque rendu. Ceci est voulu, et c‘est ce qui nous permet d‘accéder à la valeur de `count` depuis le contexte de l‘effet sans s‘inquiéter de l‘obsolescence de notre fonction. À chaque nouveau rendu, un effet _différent_ est programmé, succédant au précédent. Dans un sens, les effets font partie intégrante du résultat du rendu -- chaque effet « appartient » à un rendu particulier. Nous reviendrons plus en détail sur l‘utilité d‘un tel comportement [ultérieurement](#explanation-why-effects-run-on-each-update).

>Astuce
>
> À l‘inverse de `componentDidMount` ou de `componentDidUpdate`, les effets implémentés avec `useEffect` ne bloquent en rien la mise à jour de l‘affichage par le navigateur, rendant votre appli plus réactive. La majorité des effets n‘ont pas besoin d‘être synchrones. Dans les cas plus rares où ils pourraient en avoir besoin (comme mesurer la taille d‘un élément de l‘interface), il existe un Hook particulier [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect) avec une API identique à celle de `useEffect`.

## Effets avec nettoyage {#effects-with-cleanup}

Nous avons vu précédemment comment écrire des effets de bords ne demandant aucun nettoyage. Toutefois, quelques effets peuvent en nécessiter. Par exemple, **nous pourrions souhaiter souscrire un abonnement** à un service externe. Dans ce cas-là, il s‘avère important de nettoyer l‘environnement pour éviter les fuites de mémoire ! Comparons l‘approche d‘une classe avec celle d‘un Hook pour implémenter une telle fonctionnalité.

### Exemple en utilisant les classes {#example-using-classes-1}

Dans une classe React, une souscription est généralement lancée dans `componentDidMount`, et nettoyée dans `componentWillUnmount`. Par exemple, considérons un module `ChatAPI` permettant de s‘abonner au statut de connexion d‘un ami. Voici comment y souscrire et l‘afficher en utilisant une classe :

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
      return ‘Chargement...‘;
    }
    return this.state.isOnline ? ‘En ligne‘ : ‘Hors ligne‘;
  }
}
```

Remarquez l‘effet miroir de `componentDidMount` et `componentWillUnmount`. Les méthodes du cycle de vie nous forcent à séparer cette logique alors que, conceptuellement, le code des deux méthodes se réfère au même effet.

>Note
>
>Les lecteurs les plus attentifis remarqueront certainement que cet exemple nécessite aussi `componentDidUpdate` pour être tout à fait correct. Nous avons fait le choix d‘ignorer cela pour l‘instant mais nous y reviendrons dans [une section ultérieure](#explanation-why-effects-run-on-each-update) de cette page.

### Exemple en utilisant les Hooks {#example-using-hooks-1}

Voyons comment réécrire notre exemple avec les Hooks.

Instinctivement, vous pourriez imaginer qu‘un effet distinct est nécessaire pour le nettoyage. Mais le code pour s‘abonner à une souscription est tellement lié à celui pour s‘en désabonner que `useEffect` a été pensé pour l‘écrire dans un seul endroit. Si votre effet retourne une fonction, React l‘exécutera lors du nettoyage :

```js{10-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Indique comment nettoyer une fois l‘effet terminé :
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return ‘Chargement...‘;
  }
  return isOnline ? ‘En ligne‘ : ‘Hors ligne‘;
}
```

**Pourquoi notre effet retourne-t-il une fonction ?** Il s‘agit d‘un mécanisme optionnel de nettoyage des effets. Tout effet peut retourner une fonction qui se chargera de son propre nettoyage. Cela permet de conserver les logiques d‘abonnement et de désabonnement à une souscription proches l‘une de l‘autre. Elles font partie du même effet !

**À quel moment précis React nettoie-t-il un effet ?** React effectue le nettoyage lorsqu‘il démonte le composant. Cependant, comme nous l‘avons appris précédemment, les effets sont exécutés à chaque rendu, donc plus d‘une fois. C‘est la raison pour laquelle React effectue *aussi* un nettoyage des effets du rendu précédent avant d‘exécuter les effets du prochain. Nous verrons [pourquoi cela permet d‘éviter des bugs](#explanation-why-effects-run-on-each-update) et [comment se détourner de ce comportement en cas de problèmes de performance](#tip-optimizing-performance-by-skipping-effects) dans quelques lignes.

>Note
>
>Il est tout à fait possible de retourner une fonction anonyme depuis l‘effet. Dans notre exemple, nous avons souhaité clarifier son rôle en la nommant `cleanup`, mais vous pouvez retourner une fonction fléchée (*arrow function, NdT*) ou lui donner n‘importe quel nom.

## Récapitulatif {#recap}

Nous avons appris que `useEffect` nous permet d‘exprimer différentes sortes d‘effets de bord après l‘affichage d‘un composant. Certains effets ont besoin de nettoyer derrière eux, et doivent retourner une fonction pour le faire :

```js
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

D‘autres effets n‘ont pas besoin de nettoyage, et ne retournent rien.

```js
  useEffect(() => {
    document.title = `Vous avez cliqué ${count} fois`;
  });
```

Le Effect Hook traite ces deux cas en une seule API.

-------------
**Si vous pensez avoir déjà bien saisi le fonctionnement des Effect Hooks, ou si c‘en est déjà trop pour vous, n‘hésitez pas à passer à la [page suivante sur les Règles des Hooks](/docs/hooks-rules.html) dès à présent.**

-------------

## Astuces pour l‘utilisation des effets {#tips-for-using-effects}

À partir de maintenant, nous allons nous pencher de plus près sur certaines caractéristiques de `useEffect` qui ne manqueront pas de susciter la curiosité des utilisateurs les plus expérimentés de React. Ne vous sentez pas tenus d‘y plonger dès à présent. Vous pourrez toujours revenir sur cette page afin d‘y parfaire votre connaissance de l‘Effect Hook plus tard.

### Astuce : Utiliser plusieurs effets pour séparer la logique {#tip-use-multiple-effects-to-separate-concerns}

Un des problèmes souligné dans la [Motivation](/docs/hooks-intro.html#complex-components-become-hard-to-understand) est que les méthodes du cycle de vie d‘un composant à base de classe deviennent souvent des ramassis de logiques différentes, alors que celles qui sont liées entre elles s‘éparpillent dans plusieurs méthodes. Voici un composant qui implémente à la fois notre exemple de compteur et celui du statut de connexion d‘un ami :

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

Notez comment la logique qui modifie `document.title` est coupée entre `componentDidMount` et `componentDidUpdate`. Quant à celle de la souscription, elle est également séparée entre `componentDidMount` et `componentWillUnmount`. De plus, `componentDidMount` contient du code relatif aux deux tâches.

Comment les Hooks adressent-ils ce problème ? À l‘instar du [Hook `useState` qui peut être utilisé plusieurs fois](/docs/hooks-state.html#tip-using-multiple-state-variables), il est possible d‘utiliser plusieurs effets. Cela nous permet de découper correctement notre logique dans des effets différents :

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `Vous avez cliqué ${count} fois`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  // ...
}
```

**Les Hooks permettent de découper le code selon ce qu‘il fait** plutôt que sa place dans le cycle de vie du composant. React appliquera *tous* les effets utilisés par le composant, dans l‘ordre dans lequel ils sont déclarés.

### Explication : pourquoi les effets sont exécutés à chaque mise à jour {#explanation-why-effects-run-on-each-update}

Si vous êtes coutumiers des classes, vous pourriez vous demander pourquoi le nettoyage des effets s‘effectue après chaque rendu, au lieu d‘être exécuté uniquement au démontage. Considérons cet exemple pratique pour nous apercevoir que cette implémentation permet de créer des composants générant moins de bugs.

[Plus haut dans cette page](#example-using-classes-1), nous avons introduit l‘exemple du composant `FriendStatus` qui affiche le statut de connexion d‘un ami. Notre classe récupère `friend.id` depuis `this.props`, s‘abonne au statut de connexion une fois le composant monté, et se désabonne au démontage :

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

**Mais que se passe-t-il si la propriété `friend` change** alors que le composant est affiché ? Notre composant continuerait d‘afficher le statut de connexion de notre ami initial. C‘est un bug. Nous causerions également une fuite de mémoire ou un crash au démontage, la fonction de désabonnement utilisant l‘ID du nouvel ami.

Dans un composant à base de classe, il faudrait ajouter `componentDidUpdate` pour gérer ce cas :

```js{8-19}
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate(prevProps) {
    // Se désabonne du statut de l‘ami précédent
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // S‘abonne au statut du prochain ami
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

Oublier de gérer correctement `componentDidUpdate` est une source classique de bugs dans les applications React.

Maintenant, regardez une version du même composant qui utilise des Hooks :

```js
function FriendStatus(props) {
  // ...
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

Il ne rencontre pas ce bug. (Mais nous n‘y avons apporté aucun changement.)

Pas besoin de code spécifique pour gérer les mises à jour puisque `useEffect` les traite *par défaut*. Charge à l‘effet de nettoyer le précédent avant d‘appliquer le suivant. Pour l‘illustrer, voici la séquentialité des abonnements et des désabonnements que ce composant produirait au cours du temps :

```js
// Montage avec les propriétés { friend: { id: 100 } }
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // Exécute le premier effet

// Mise à jour avec les propriétés { friend: { id: 200 } }
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // Nettoie l‘effet précédent
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // Exécute l‘effet suivant

// Mise à jour avec les propriétés { friend: { id: 300 } }
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // Nettoie l‘effet précédent
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // Exécute l‘effet suivant

// Démontage
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // Nettoie le dernier effet
```

Ce comportement par défaut garantit la cohérence et résout les bugs les plus courants des composants à base de classe qui oublient de gérer les mises à jour.

### Astuce : optimiser les performances en sautant des effets {#tip-optimizing-performance-by-skipping-effects}

Dans certains cas, nettoyer ou exécuter l‘effet après chaque rendu est susceptible d‘entraîner une baisse de performance. Dans les composants à base de classe, une solution simple est d‘ajouter une condition comparant `prevProps` ou `prevState` dans `componentDidUpdate` :

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `Vous avez cliqué ${this.state.count} fois`;
  }
}
```

Ce genre de comportement est tellement courant qu‘il est intégré dans l‘API du Hook `useEffect`. Il est possible d‘indiquer à React de *sauter* l‘exécution d‘un effet si certaines valeurs n‘ont pas été modifiées entre deux rendus. Pour cela, il suffit de passer une liste en second argument à `useEffect` :

```js{3}
useEffect(() => {
  document.title = `Vous avez cliqué ${count} fois`;
}, [count]); // N‘exécute l‘effet que si count a changé
```

Dans l‘exemple ci-dessus, nous passons `[count]` comme second argument. Qu‘est-ce que cela signifie ? Si `count` vaut `5`, et que notre composant est réaffiché avec `count` toujours égal à `5`, React comparera `[5]` du rendu précédent et `[5]` du rendu suivant. Comme tous les éléments de la liste sont identiques (`5 === 5`), React n‘exécutera pas l‘effet. Notre composant est désormais optimisé.

Quand le composant est réaffiché avec `count` égal à `6`, React comparera la liste d‘éléments `[5]` du rendu précédent contre celle du rendu suivant `[6]`. Cette fois, React ré-exécutera l‘effet car `5 !== 6`. Dans le cas où la liste contient plusieurs éléments, React réappliquera l‘effet si au moins l‘un d‘entre eux est différent de sa version précédente.

Le fonctionnement est le même pour la phase de nettoyage :

```js{6}
useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Ne se réabonne que si props.friend.id change
```

À l‘avenir, ce second argument pourrait être injecté automatiquement au moment de la compilation.

>Note
>
>Si vous utilisez cette optimisation, prenez bien garde à ce que la liste inclue bien **toutes les valeurs susceptibles d‘être modifiées par le contexte extérieur que l‘effet utilise**. Sinon, votre code utilisera des références à des variables obsolètes relatives aux rendus précédents. D‘autres méthodes d‘optimisation seront discutées dans la [référence de l‘API des Hooks](/docs/hooks-reference.html).
>
>Si vous souhaitez exécuter un effet et le nettoyer une seule fois (au montage et au démontage), il est possible de passer une liste vide (`[]`) en second paramètre. Cela indique à React que votre effet ne dépend d‘*aucune* valeur venant de l‘état local ou des props, donc qu‘il n‘aura jamais besoin d‘être exécuté à nouveau. Ce n‘est pas un cas traité isolément -- mais découle directement du fonctionnement interne de la liste de paramètres. Bien que passer `[]` se rapproche du modèle mental courant `componentDidMount` et `componentWillUnmount`, nous suggérons de ne pas en faire une habitude car cela entraîne de nombreux bugs, [comme abordé plus haut](#explanation-why-effects-run-on-each-update). Gardez à l‘esprit que React n‘exécute `useEffect` qu‘une fois l‘affichage terminé, exécuter du travail supplémentaire est par conséquent moins lourd pour le navigateur.

## Étapes suivantes {#next-steps}

Félicitations ! Une bien longue page, mais avec un peu de chance la plupart de vos questions à propos des effets ont finalement pu trouver une réponse. Vous avez appris à la fois le State Hook et le Effect Hook, vous ouvrant *beaucoup* de possibilités en les combinant. Ils couvrent la majorité des cas d‘usage pour les classes -- et sinon, peut-être trouverez-vous les [Hooks supplémentaires](/docs/hooks-reference.html) bien utiles.

Nous commençons également à voir se dessiner le contour des solutions proposées par les Hooks pour adresser les problématiques soulevées dans [Motivation](/docs/hooks-intro.html#motivation). Nous avons vu comment le nettoyage des effets évite la duplication de code dans `componentDidUpdate` et `componentWillUnmount`, concentre des codes reliés entre eux en un endroit, et aide à éviter les bugs. Enfin, nous avons appris comment séparer les effets selon leur finalité, ce qui était totalement impossible avec les classes.

A ce stade vous vous demandez peut-être comment les Hooks fonctionnent. Comment React sait-il quel appel de `useState` correspond à quelle variable d‘état local entre chaque rendu ? Comment React « lie » l‘effet précédent au suivant à chaque mise à jour ? **Rendez-vous à la prochaine page pour apprendre les [Règles des Hooks](/docs/hooks-rules.html) -- indispensables à leur bon fonctionnement.**
