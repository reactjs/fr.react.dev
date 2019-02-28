---
id: strict-mode
title: Le mode strict
permalink: docs/strict-mode.html
---

`StrictMode` est un outil pour signaler les problémes potentiels qui peuvent apparaître dans une application. Tout comme `Fragment`, `StrictMode` n'effectue aucun rendu visuel. Il active des vérifications et avertissement supplémentaire pour ses descendants.

> Remarque:
>
> Les vérifications du mode strict sont effectuées uniquement durant le développement. _Elles n'impactent pas la version utilisée en production_.

Vous pouvez activer le mode strict pour toutes les partie de votre application. Par exemple:
`embed:strict-mode/enabling-strict-mode.js`

Dans l'exemple ci-dessus, les vérifications du mode strict ne s'effectueront *pas* pour les composants `Header` et `Footer`. Cependant, les composants `ComponentOne` et `ComponentTwo`, ainsi que tous leurs descendants, seront vérifiés.

Actuellement, `StrictMode` est utilisé pour :
* [Identifier les composants incorporant un cycle de vie à risque](#identifying-unsafe-lifecycles)
* [Signaler l'utilisation dépréciée de l'API ref avec chaîne de caractére](#warning-about-legacy-string-ref-api-usage)
* [Signaler l'utilisation dépréciée de findDOMNode](#warning-about-deprecated-finddomnode-usage)
* [Détecter des effets de bord inattendus](#detecting-unexpected-side-effects)
* [Détecter l'API dépréciée contexte](#detecting-legacy-context-api)

D'autres fonctionnalités seront ajoutées dans une future version de React.

### Identifier les cycles de vie à risque{#identifying-unsafe-lifecycles}

Comme l'explique [cette article de blog](/blog/2018/03/27/update-on-async-rendering.html), certaines méthodes dépréciées du cycle de vie entrainent un risque, lorsqu'elles sont utilisées dans des applications React asynchrones. Cependant, si votre application utilise des librairies tierces, il est difficile de s'assurer que ces cycles de vie ne sont pas utilisés. Heureusement, le mode strict peut nous aider à les identifier!

Lorsque le mode strict est activé, React compile une liste de tous les composants à base de classe utilisant les cycles de vie à risque, et affiche un message d'avertissement avec des informations à propos de ces composants, comme ceci:

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

Résoudre les problémes identifiés par le mode strict _tout de suite_ vous aidera à tirer profit des rendus asynchrones, qui apparaîtront dans les futures versions de React.

### Signaler l'utilisation dépréciée de l'API ref avec chaîne de caractére{#warning-about-legacy-string-ref-api-usage}

Précédemment, React fournissaient deux moyens pour gérer les refs : l'API dépréciée de ref avec chaîne de caractére et l'API de fonction de rappel. Bien que l'API de ref avec chaîne de caractére était la plus pratique des deux, elle a [plusieurs inconvénients](https://github.com/facebook/react/issues/1373). Du coups, nous recommandons officiellement [d'utiliser la forme avec fonction de rappel à la place](/docs/refs-and-the-dom.html#legacy-api-string-refs).

React 16.3 a ajouté une troisiéme option qui offre la praticité de la ref avec chaîne de caractére, sans inconvénient:
`embed:16-3-release-blog-post/create-ref-example.js`

Comme les refs avec objets sont largement utilisées en tant que substituts des refs avec chaîne de caractére, le mode strict signale désormais l'utilisation des refs avec chaîne de caractére.

> **Remarque:**
>
> Les refs avec fonction de rappel continueront d'être pris en charge en plus de la nouvelle API `createRef`.
>
> Vous n'avez pas besoin de remplacer les refs avec fonction de rappel dans vos composants. Elles sont un peu plus flexible. Elles demeureront donc en tant que fonctionnalité avancée.

[Vous en apprendrez plus à propos de l'API `createRef` ici.](/docs/refs-and-the-dom.html)

### Signaler l'utilisation dépréciée de findDOMNode {#warning-about-deprecated-finddomnode-usage}

Dans le passé, React permettait à `findDOMNode` de rechercher, dans l'arborescence, un nœud du DOM grâce à une instance de classe.
Normalement, vous n'avez pas besoin de ça car vous pouvez [attacher directement une ref à un nœud du DOM](/docs/refs-and-the-dom.html#creating-refs).

`findDOMNode` peut aussi être utilisé avec des composants à base de classe, mais cette utilisation brise les niveaux d'abstraction en autorisant un parent a effectué un rendu sur certains enfants. Cette technique crée un réusinage risqué où vous ne pouvez pas changer les détails d'implémentation d'un composant, car son parent a un accès directe à son nœud du DOM.`findDOMNode` renvoit uniquement le premier enfant, mais lorsque les Fragments sont utilisés, il est possible qu'un composant effectue un rendu de plusieurs nœuds du DOM. `findDOMNode` est une API à lecture unique. Elle vous offre une réponse uniquement lorsqu'elle est appellé. Lorsqu'un composant enfant effectue un rendu de nœud du DOM différent, l'API n'est pas capable de gérer ces changements. Ainsi, `findDOMNode` fonctionne uniquement lorsque les composants renvoient, exclusivement, un unique nœud du DOM qui ne change jamais.

À la place, vous pouvez expliciter ça en passant une ref à votre composant personnalisé et le passer dans le DOM en utilisant la [transmission de ref](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

Vous pouvez également ajouter un élément enveloppant votre nœud du DOM node dans votre composant et lui ajouter une ref directement.

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

> Remarque:
>
> En CSS, l'attribut [`display: contents`](https://developer.mozilla.org/fr/docs/Web/CSS/display#display_contents) peut être utilisé si vous ne voulez pas que le nœud fasse partie de votre page.

### Détecter les effets de bord innatendus{#detecting-unexpected-side-effects}

Théoriquement, React fonctionne en deux étapes :
* La phase de **rendu** détermine les changements qui ont besoin d'être fait ex : le DOM. Lors de cette phase, React appelle `render` puis compare le résultat au rendu précédent.
* La phase d'**engagement** se produit dés que React applique un changement. (Dans le cas de React DOM, cette phase se produit lorsque React insère, modifie, et supprime des nœuds du DOM.) React appelle également les cycle de vie, comme `componentDidMount` et `componentDidUpdate`, durant cette phase.

Généralement, la phase d'engagement est trés rapide, mais le rendu peut être lent. C'est la raison pour laquelle le mode asynchrone à venir (qui n'est pas encore activé par défaut) divise le travail de rendu en morceaux, suspendant et reprenant le travail pour éviter de bloquer le navigateur. Ça signifie que React peut invoquer la phase de rendu des cycles de vie plus d'une fois avant l'engagement ou alors il peut les invoquer sans la phase d'engagement (à cause d'une erreur ou d'une interruption de plus haute priorité).

La phase de rendu des cycles de vie inclue les méthodes de composant à base de classe suivant :
* `constructor`
* `componentWillMount`
* `componentWillReceiveProps`
* `componentWillUpdate`
* `getDerivedStateFromProps`
* `shouldComponentUpdate`
* `render`
* les fonctions modificatrices de `setState` (le premier argument)

Vu que les méthodes ci-dessus peuvent être appelées plus d'une fois, il est impératif qu'elles ne contiennent pas d'effet de bord. Ignorer cette régle peut entrainer diverses problémes, incluant des fuites de mémoire et une invalidatité d'état de l'application. Malheureusement, il peut être difficile de détecter ces problémes car ils sont souvent [non déterministe](https://fr.wikipedia.org/wiki/Algorithme_d%C3%A9terministe).

Le mode strict ne détecte pas automatiquement ces effets de bord, mais il peut vous aider à les repérer en les marquant comme étant non déterministe. Le strict mode réussit ça en invoquant intentionellement deux fois les méthodes suivantes :

* la méthode `constructor` des composants à base de classe
* La méthode `render`
* les fonctions modificatrices de `setState` (le premier argument)
* Le cycle de vie statique `getDerivedStateFromProps`

> Remarque:
>
> Cette fonctionnalité s'applique uniquement au mode de développement. _Les cycles de vie ne seront pas invoqués deux fois dans le mode de production._

Par exemple, examinez le code suivant:
`embed:strict-mode/side-effects-in-constructor.js`

Au premier abord, ce code ne semble pas problématique. Cependant, si `SharedApplicationState.recordEvent` n'est pas [idempotent](https://fr.wikipedia.org/wiki/Idempotence#En_informatique), alors l'instanciation multiple de ce composant peut entrainer une invalidité d'état de l'application. Cette subtile erreur peut ne pas se manifester durant le développement, ou elle peut être tellement inconsistente qu'elle a été négligé.

En invoquant intentionnellement deux fois les méthodes comme le constructeur d'un composant, le mode strict facilite la détection de ces schémas.

### Détecter l'API dépréciée contexte {#detecting-legacy-context-api}

L'API dépréciée contexte est source d'erreur, et sera supprimée dans une future version de React. Elle fonctionne toujours pour les versions 16.x mais le mode strict affichera ce message d'erreur:

![](../images/blog/warn-legacy-context-in-strict-mode.png)

Lisez la [documentation sur la nouvelle API contexte](/docs/context.html) pour faciliter la migration vers cette nouvelle version.