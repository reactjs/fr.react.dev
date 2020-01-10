---
id: codebase-overview
title: Aperçu du code source
layout: contributing
permalink: docs/codebase-overview.html
prev: how-to-contribute.html
next: implementation-notes.html
redirect_from:
  - "contributing/codebase-overview.html"
---

Cette section vous donne un aperçu de l’organisation du code source de React, de ses conventions et de son implémentation.

Si vous souhaitez [contribuer à React](/docs/how-to-contribute.html), nous espérons que ce guide vous aidera à vous sentir plus à l'aise pour apporter des modifications.

Nous ne recommandons pas nécessairement ces conventions dans les applications React. Nombre d'entre elles existent pour des raisons historiques et sont susceptibles d’évoluer avec le temps.

### Dépendances externes {#external-dependencies}

React n'a presque pas de dépendances externes. Habituellement, un `require()` pointe vers un fichier dans le code de React lui-même. Cependant, il existe quelques exceptions relativement rares.

Le [dépôt fbjs](https://github.com/facebook/fbjs) existe parce que React partage quelques petits utilitaires avec des bibliothèques telles que [Relay](https://github.com/facebook/relay) et que nous les gardons synchronisées. Nous ne dépendons pas de petits modules équivalents dans l'écosystème Node, car nous souhaitons que les ingénieurs de Facebook puissent les modifier à tout moment. Aucun des utilitaires contenus dans fbjs n'est considéré comme une API publique et ils ne doivent être utilisés que par des projets Facebook tels que React.

### Dossiers racines {#top-level-folders}

Après avoir cloné le [dépôt React](https://github.com/facebook/react), vous verrez quelques dossiers racines :

* [`packages`](https://github.com/facebook/react/tree/master/packages) contient des métadonnées (telles que `package.json`) et le code source (sous-répertoire `src`) de tous les paquets du dépôt React. **Si votre modification est liée au code, vous passerez le plus clair de votre temps dans le sous-répertoire `src` des différents paquets.**
* [`fixtures`](https://github.com/facebook/react/tree/master/fixtures) contient quelques petites applications React de test pour les contributeurs.
* `build` est la sortie de construction de React. Il ne figure pas dans le dépôt, mais il apparaîtra dans votre clone de React après que vous [l'aurez construit](/docs/how-to-contribute.html#development-workflow) pour la première fois.

La documentation est hébergée [dans un dépôt distinct de React](https://github.com/reactjs/fr.reactjs.org).

Il existe quelques autres dossiers racines, mais ils sont principalement utilisés par l’outillage et vous n’aurez probablement jamais affaire à eux lorsque vous contribuerez.

### Tests colocalisés {#colocated-tests}

Nous n'avons pas de répertoire racine pour les tests unitaires. Nous les plaçons plutôt dans un répertoire appelé `__tests__` situé à côté des fichiers qu’ils testent.

Par exemple, un test pour [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js) sera placé juste à côté, dans [`__tests__/setInnerHTML-test.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js).

### Avertissements et invariants {#warnings-and-invariants}

Le code source de React utilise le module `warning` pour afficher les avertissements :

```js
var warning = require('warning');

warning(
  2 + 2 === 4,
  'Les maths sont en vacances aujourd’hui.'
);
```

**L'avertissement est affiché lorsque la condition de `warning` est `false`.**

Pensez-y en vous disant que la condition devrait refléter la situation normale plutôt que la situation exceptionnelle.

Ce serait plutôt bien d'éviter de spammer la console avec des avertissements en double :

```js
var warning = require('warning');

var didWarnAboutMath = false;
if (!didWarnAboutMath) {
  warning(
    2 + 2 === 4,
    'Les maths sont en vacances aujourd’hui.'
  );
  didWarnAboutMath = true;
}
```

Les avertissements ne sont activés que dans la phase de développement. En production, ils sont complètement retirés du code. Si vous avez besoin d'interdire l'exécution d'une partie de code, utilisez plutôt le module `invariant` :

```js
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'Vous ne passerez pas !'
);
```

**L'invariant est levé lorsque la condition de `invariant` est `false`.**

Le terme « invariant » signifie simplement « cette condition est toujours vraie ». Vous pouvez voir ça comme une affirmation.

Pour les invariants, il est important d’avoir un comportement similaire en développement et en production, afin qu’ils soient levés dans les deux cas. Les messages d'erreur sont automatiquement remplacés par des codes d'erreur en production afin d'éviter toute incidence négative sur la taille (en octets) du fichier.

### Développement et production {#development-and-production}

Vous pouvez utiliser la variable pseudo-globale `__DEV__` dans le code source pour délimiter les blocs de code réservés au développement.

La variable est remplacée lors de la compilation et se transforme en contrôles `process.env.NODE_ENV !== 'production'` dans les _builds_ CommonJS.

Pour les versions autonomes, la variable devient `true` dans la version non-minifiée du fichier produit, alors qu'elle est complètement effacée, ainsi que les blocs `if` qu'elle contrôle, dans la version minifiée.

```js
if (__DEV__) {
  // Ce code va uniquement s’appliquer pendant le développement.
}
```

### Flow {#flow}

Nous avons récemment commencé à introduire des contrôles [Flow](https://flow.org/) dans le code source. Les fichiers marqués avec l'annotation `@flow` dans le commentaire d'en-tête de licence sont soumis à vérification.

Nous acceptons les _pull requests_ [qui ajoutent des annotations Flow au code existant](https://github.com/facebook/react/pull/7600/files). Les annotations Flow ressemblent à ceci :

```js
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```

Dans la mesure du possible, le nouveau code devrait utiliser des annotations Flow.
Vous pouvez exécuter `yarn flow` localement pour vérifier votre code avec Flow.

### Injection dynamique {#dynamic-injection}

React utilise l'injection dynamique dans certains modules. Bien que ce soit toujours explicite, c’est quand même dommage car ça nuit à la compréhension du code. Ces injections viennent principalement du fait que React ne visait initialement que le DOM. React Native a commencé comme un fork de React. Nous avons dû ajouter une injection dynamique pour permettre à React Native de remplacer certains comportements.

Vous verrez peut-être des modules déclarer leurs dépendances dynamiques comme ceci :

```js
// Dynamically injected
var textComponentClass = null;

// Relies on dynamically injected value
function createInstanceForText(text) {
  return new textComponentClass(text);
}

var ReactHostComponent = {
  createInstanceForText,

  // Provides an opportunity for dynamic injection
  injection: {
    injectTextComponentClass: function(componentClass) {
      textComponentClass = componentClass;
    },
  },
};

module.exports = ReactHostComponent;
```

Le champ `injection` n'est en aucun cas traité spécialement. Mais par convention, il signifie que ce module veut recevoir certaines dépendances (supposément spécifiques à une plate-forme) par injection au moment de l'exécution.

Il y a plusieurs points d'injection dans le code source. À l’avenir, nous entendons nous débarrasser du mécanisme d’injection dynamique et raccorder toutes les pièces de manière statique pendant la construction.

### Plusieurs paquets {#multiple-packages}

React est un [monorepo](https://danluu.com/monorepo/). Son dépôt contient plusieurs paquets distincts afin que leurs modifications puissent être coordonnées et que les problèmes puissent être signalés dans un seul et même endroit.

### Le noyau de React {#react-core}

Le « noyau » de React inclut toutes les [API `React` de niveau racine](/docs/top-level-api.html#react), par exemple :

* `React.createElement()`
* `React.Component`
* `React.Children`

**Le noyau React n'inclut que les API nécessaires à la définition des composants.**  Il n'inclut pas l'algorithme de [réconciliation](/docs/reconciliation.html) ni aucun code spécifique à une plate-forme. Il est utilisé à la fois par les composants de React DOM et de React Native.

Le code pour le noyau React se trouve dans [`packages/react`](https://github.com/facebook/react/tree/master/packages/react) au sein de l'arborescence source. Il est disponible sur npm via le module [`react`](https://www.npmjs.com/package/react). La version autonome correspondante pour l’utilisation à même le navigateur est appelée `react.js`, et exporte une variable globale appelée `React`.

### Moteurs de rendu {#renderers}

React a été créé à l'origine pour le DOM, mais il a ensuite été adapté pour prendre également en charge les plates-formes natives avec [React Native](https://facebook.github.io/react-native/). C’est ainsi qu’est né le concept de « moteurs de rendu » *(renderers, terme que nous utiliserons sans italiques dans la suite de ce texte, NdT)* au sein de React.

**Les renderers gèrent la transformation d'une arborescence React en appels à la plate-forme sous-jacente.**

Les renderers sont également situés dans [`packages/`](https://github.com/facebook/react/tree/master/packages/) :

* [Le renderer de React DOM](https://github.com/facebook/react/tree/master/packages/react-dom) retranscrit les composants React dans le DOM. Il implémente [les API `ReactDOM` racines](/docs/react-dom.html) et est disponible via le module npm [`react-dom`](https://www.npmjs.com/package/react-dom). Il peut aussi être utilisé en tant que _bundle_ autonome dans le navigateur, lequel est nommé `react-dom.js` et exporte une variable globale `ReactDOM`.
* [Le renderer de React Native](https://github.com/facebook/react/tree/master/packages/react-native-renderer) retranscrit les composants React sous forme de vues natives. Il est utilisé en interne par React Native.
* [Le renderer de test de React](https://github.com/facebook/react/tree/master/packages/react-test-renderer) retranscrit les composants React sous forme d’arbres JSON. Il est utilisé par la fonctionnalité d’[instantanés](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) *(snapshots, NdT)* de [Jest](https://facebook.github.io/jest) et est disponible via le module npm [react-test-renderer](https://www.npmjs.com/package/react-test-renderer).

Le seul autre moteur de rendu officiellement pris en charge est [`react-art`](https://github.com/facebook/react/tree/master/packages/react-art). Auparavant, il se trouvait dans un [dépôt GitHub](https://github.com/reactjs/react-art) séparé, mais nous l'avons déplacé dans l'arborescence source principale pour le moment.

>Remarque
>
>Techniquement, le [`react-native-renderer`](https://github.com/facebook/react/tree/master/packages/react-native-renderer) est une couche très mince qui apprend à React à interagir avec l’implémentation de React Native.  Le véritable code spécifique à la plate-forme, qui gère les vues natives et fournit les composants, réside quant à lui dans le [dépôt React Native](https://github.com/facebook/react-native).

### Réconciliateurs {#reconcilers}

Même des moteurs de rendu très différents comme React DOM et React Native doivent partager beaucoup de logique. En particulier, l'algorithme de [réconciliation](/docs/reconciliation.html) doit être aussi similaire que possible afin que le rendu déclaratif, les composants personnalisés, l'état local, les méthodes de cycle de vie et les refs fonctionnent de manière cohérente sur toutes les plates-formes prises en charge.

Pour résoudre ce problème, différents moteurs de rendu partagent du code entre eux. Nous appelons cette partie de React un « réconciliateur ». Lorsqu'une mise à jour telle que `setState()` est planifiée, le réconciliateur appelle `render()` sur les composants de l'arborescence et les monte, les met à jour ou les démonte.

Les réconciliateurs ne font pas l’objet de modules séparés, car ils ne disposent actuellement d'aucune API publique. Ils sont exclusivement utilisés par les moteurs de rendu tels que React DOM et React Native.

### Réconciliateur Stack {#stack-reconciler}

Le réconciliateur _“stack”_ est l'implémentation qui sous-tend React 15 et les versions antérieures. Nous avons depuis cessé de l'utiliser, mais il reste décrit en détail dans la [prochaine page](/docs/implementation-notes.html).

### Réconciliateur Fiber {#fiber-reconciler}

Le réconciliateur _“fiber”_ représente une nouvelle tentative de résoudre les problèmes inhérents au réconciliateur “stack” en plus de quelques problèmes anciens. C’est le réconciliateur par défaut depuis React 16.

Ses objectifs principaux sont :

* la capacité à diviser un travail interruptible en segments ;
* la capacité à hiérarchiser, déplacer et réutiliser des travaux en cours ;
* la capacité à jongler entre parents et enfants pour exécuter une mise en page avec React ;
* la capacité à renvoyer plusieurs éléments depuis `render()` ;
* une meilleure prise en charge des périmètres d'erreur.

Vous pouvez en apprendre davantage sur l’architecture React Fiber [ici](https://github.com/acdlite/react-fiber-architecture) et [ici](https://blog.ag-grid.com/inside-fiber-an-in-depth-overview-of-the-new-reconciliation-algorithm-in-react). Bien qu’elles soient livrées avec React 16, les fonctionnalités asynchrones ne sont pas encore activées par défaut.

Son code source est situé dans [`packages/react-reconciler`](https://github.com/facebook/react/tree/master/packages/react-reconciler).

### Système d'événements {#event-system}

React implémente un système d'événements synthétiques indépendant du moteur de rendu, qui fonctionne à la fois avec React DOM et React Native. Son code source se trouve dans [`packages/legacy-events`](https://github.com/facebook/react/tree/master/packages/legacy-events).

Voici une [vidéo qui plonge en profondeur dans ce code](https://www.youtube.com/watch?v=dRo_egw7tBc) (66 minutes).

### Et maintenant ? {#what-next}

Lisez la [prochaine page](/docs/implementation-notes.html) pour en apprendre davantage sur l’implémentation du réconciliateur utilisé avant React 16. Nous n'avons pas encore documenté les détails internes d’implémentation du nouveau réconciliateur.
