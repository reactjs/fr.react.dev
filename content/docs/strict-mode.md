---
id: strict-mode
title: Le mode strict
permalink: docs/strict-mode.html
---

`StrictMode` est un outil pour détecter les problèmes potentiels d’une application. Tout comme `Fragment`, `StrictMode` n'affiche rien. Il active des vérifications et avertissements supplémentaires pour ses descendants.

> Remarque
>
> Les vérifications du mode strict sont effectuées uniquement durant le développement. _Elles n'impactent pas la version utilisée en production_.

Vous pouvez activer le mode strict pour n’importe quelle partie du code de votre application. Par exemple :
`embed:strict-mode/enabling-strict-mode.js`

Dans l'exemple ci-dessus, les vérifications du mode strict ne seront *pas* appliquées pour les composants `Header` et `Footer`. En revanche, les composants `ComponentOne` et `ComponentTwo`, ainsi que tous leurs descendants, seront vérifiés.

Actuellement, `StrictMode` est utilisé pour :
* [Identifier les composants utilisant des méthodes de cycle de vie dépréciées](#identifying-unsafe-lifecycles)
* [Signaler l'utilisation dépréciée de l'API ref à base de chaîne de caractères](#warning-about-legacy-string-ref-api-usage)
* [Signaler l'utilisation dépréciée de `findDOMNode`](#warning-about-deprecated-finddomnode-usage)
* [Détecter des effets de bord inattendus](#detecting-unexpected-side-effects)
* [Détecter l'API dépréciée de Contexte](#detecting-legacy-context-api) (ex. `childContextTypes`)

D'autres fonctionnalités seront ajoutées dans les futures versions de React.

### Identifier les méthodes de cycle de vie dépréciées {#identifying-unsafe-lifecycles}

Comme l'explique [cet article de blog](/blog/2018/03/27/update-on-async-rendering.html), certaines méthodes dépréciées de cycle de vie comportent des risques lorsqu'elles sont utilisées dans des applications React asynchrones. Qui plus est, si votre application utilise des bibliothèques tierces, il devient difficile de s'assurer que ces méthodes ne sont pas utilisées. Heureusement, le mode strict peut nous aider à les identifier !

Lorsque le mode strict est actif, React constitue une liste de tous les composants à base de classe utilisant les méthodes de cycle de vie à risque, et affiche dans la console un message d'avertissement avec des informations à propos de ces composants, comme ceci :

![Exemple de message d'avertissement sur les méthodes dépréciées](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

En résolvant les problèmes identifiés par le mode strict _aujourd’hui_, vous pourrez plus facilement tirer parti du rendu concurrent qui arrivera dans les futures versions de React.

### Signaler l'utilisation dépréciée de l'API ref à base de chaîne de caractères {#warning-about-legacy-string-ref-api-usage}

Auparavant, React fournissait deux manières de gérer les refs : l'API dépréciée à base de chaîne de caractères et l'API à base de fonction de rappel. Bien que la première ait été la plus pratique des deux, elle avait [plusieurs inconvénients](https://github.com/facebook/react/issues/1373). Du coup, nous recommandions officiellement [d'utiliser plutôt la forme à base de fonction de rappel](/docs/refs-and-the-dom.html#legacy-api-string-refs).

React 16.3 a ajouté une troisième option qui offre le confort de la première approche, mais sans ses inconvénients :
`embed:16-3-release-blog-post/create-ref-example.js`

Dans la mesure où les refs à base d’objets sont largement utilisées comme substitut des refs à base de chaînes de caractères, le mode strict nous avertit désormais lors de l'utilisation de ces dernières.

> Remarque
>
> Les refs à base de fonction de rappel continueront d'être prises en charge en plus de la nouvelle API `createRef`.
>
> Vous n'avez pas besoin de remplacer les refs à base de fonctions de rappel dans vos composants. Elles sont un peu plus flexibles et resteront donc prises en charge, à titre de fonctionnalité avancée.

[Vous pouvez en apprendre davantage sur l'API `createRef` ici.](/docs/refs-and-the-dom.html)

### Signaler l'utilisation dépréciée de `findDOMNode` {#warning-about-deprecated-finddomnode-usage}

React proposait autrefois `findDOMNode` pour rechercher dans l'arborescence le nœud DOM associé à une instance de classe. Normalement, vous n'avez pas besoin de ça car vous pouvez [attacher directement une ref à un nœud du DOM](/docs/refs-and-the-dom.html#creating-refs).

`findDOMNode` pouvait aussi être utilisée sur des composants à base de classe, mais ça cassait l’encapsulation en permettant à un parent d’exiger que certains enfants soient présents dans le rendu. Cette technique gênait les refactorisations car un composant ne pouvait plus changer ses détails d'implémentation en confiance, dans la mesure où des parents étaient susceptibles d’obtenir un accès direct à son nœud DOM. `findDOMNode` ne renvoie par ailleurs que le premier enfant, alors qu’avec les Fragments un composant peut renvoyer plusieurs nœuds DOM. `findDOMNode` est aussi une API temporalisée : sa valeur renvoyée n'est pas mise à jour automatiquement, de sorte que si un composant enfant se rafraîchit avec un autre nœud DOM, l'API ne vous en informe pas. En d'autres termes, `findDOMNode` ne fonctionnait que pour les composants renvoyant un unique nœud DOM qui ne changeait jamais.

Préférez une approche explicite en passant une ref à votre composant personnalisé et en la transférant au DOM grâce au [transfert de ref](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

Vous pouvez également ajouter un nœud DOM d'enrobage dans votre composant et lui associer une ref directement.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }
  render() {
    return <div ref={this.wrapper}>{this.props.children}</div>;
  }
}
```

> Remarque
>
> En CSS, la propriété [`display: contents`](https://developer.mozilla.org/fr/docs/Web/CSS/display#display_contents) peut être utilisée si vous ne voulez pas que le nœud fasse partie de la mise en page.

### Détecter les effets de bord inattendus {#detecting-unexpected-side-effects}

Conceptuellement, React fonctionne en deux étapes :
* La phase de **rendu** détermine les modifications qui doivent être retranscrites, par exemple dans le DOM. Lors de cette phase, React appelle `render` puis compare le résultat au rendu précédent.
* La phase de **commit** est celle de l'application des modifications. (Dans le cas de React DOM, c'est durant cette phase que React insère, modifie, et supprime des nœuds du DOM.) C’est également durant cette phase que React appelle des méthodes de cycle de vie comme `componentDidMount` et `componentDidUpdate`.

La phase de commit est le plus souvent très rapide, mais le rendu peut être lent. C'est pourquoi le mode concurrent à venir (qui n'est pas encore activé par défaut) découpe le travail de rendu en morceaux, suspendant et reprenant le travail pour éviter de bloquer le navigateur. Ça signifie que React peut invoquer les méthodes de cycle de vie de la phase de rendu plus d'une fois avant le commit, ou les invoquer sans phase de commit du tout (à cause d'une erreur ou d'une interruption de plus haute priorité).

Pour les composants à base de classes, les méthodes de cycle de vie de la phase de rendu sont les suivantes :

* `constructor`
* `componentWillMount` (or `UNSAFE_componentWillMount`)
* `componentWillReceiveProps` (or `UNSAFE_componentWillReceiveProps`)
* `componentWillUpdate` (or `UNSAFE_componentWillUpdate`)
* `getDerivedStateFromProps`
* `shouldComponentUpdate`
* `render`
* les fonctions de modifications passées à `setState` (son premier argument)

Vu que les méthodes ci-dessus peuvent être appelées plus d'une fois, il est impératif qu'elles ne contiennent pas d'effets de bord. Ignorer cette règle peut entraîner divers problèmes, dont des fuites de mémoire et un état applicatif invalide. Malheureusement, il peut être difficile de détecter ces problèmes car ils sont souvent [non-déterministes](https://fr.wikipedia.org/wiki/Algorithme_d%C3%A9terministe).

Le mode strict ne détecte pas automatiquement ces effets de bord, mais il peut vous aider à les repérer en les rendant un peu plus déterministes. Il y parvient en invoquant volontairement deux fois les fonctions suivantes :

* Les méthodes `constructor`, `render` et `shouldComponentUpdate` des composants à base de classe
* La méthode statique `getDerivedStateFromProps` des composants à base de classe
* Le corps des fonctions composants
* Les fonctions de mise à jour d’état (le premier argument passé à `setState`)
* Les fonctions passées à `useState`, `useMemo` ou `useReducer`

> Remarque
>
> Cette fonctionnalité s'applique uniquement en mode développement. _Les méthodes de cycle de vie ne seront pas invoquées deux fois en mode production._

Par exemple, examinez le code suivant :
`embed:strict-mode/side-effects-in-constructor.js`

Au premier abord, ce code ne semble pas problématique. Cependant, si `SharedApplicationState.recordEvent` n'est pas [idempotent](https://fr.wikipedia.org/wiki/Idempotence#En_informatique), alors l'instanciation multiple de ce composant pourrait corrompre l'état applicatif. Ce genre de bug subtil peut ne pas se manifester durant le développement, ou s'avérer tellement erratique qu'il est négligé.

En invoquant volontairement deux fois les méthodes comme le constructeur d'un composant, le mode strict facilite la détection de ces schémas.

### Détecter l'API dépréciée de Contexte {#detecting-legacy-context-api}

L'API dépréciée de Contexte est source d'erreur, et sera retirée dans une future version majeure de React. Elle fonctionne toujours dans les versions 16.x mais le mode strict affichera ce message d'avertissement :

![Avertissement du mode strict à l'utilisation de l'API dépréciée de Contexte](../images/blog/warn-legacy-context-in-strict-mode.png)

Lisez la [documentation de la nouvelle API de Contexte](/docs/context.html) pour faciliter la migration vers cette nouvelle version.
