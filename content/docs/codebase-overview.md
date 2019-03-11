---
id: codebase-overview
title: Vue d'ensemble de la base de code
layout: contributing
permalink: docs/codebase-overview.html
prev: how-to-contribute.html
next: implementation-notes.html
redirect_from:
  - "contributing/codebase-overview.html"
---

Cette section vous donne un aperçu de l’organisation de la base de code React, de ses conventions et de sa mise en oeuvre.

Si vous souhaitez [contribuer à React](/docs/how-to-contribute.html) nous espérons que ce guide vous aidera à vous sentir plus à l'aise pour apporter des modifications.

Nous ne recommandons pas nécessairement l'une de ces conventions dans les applications React. Nombre d'entre elles existent pour des raisons historiques et pourraient évoluer avec le temps.

### Dépendances externes {#external-dependencies}

React n'a presque pas de dépendances externes. Habituellement, un `require()` pointe vers un fichier dans le propre code de React. Cependant, il existe quelques exceptions relativement rares.

Le [répertoire fbjs](https://github.com/facebook/fbjs) existe car React partage quelques petits utilitaires avec des bibliothèques telles que [Relay] (https://github.com/facebook/relay) et nous les conservons synchroniser. Nous ne dépendons pas de petits modules équivalents dans l'écosystème Node, car nous souhaitons que les ingénieurs de Facebook puissent les modifier à tout moment. Aucun des utilitaires contenus dans fbjs n'est considéré comme une API publique et ils ne doivent être utilisés que par des projets Facebook tels que React.

### Dossiers de premier niveau {#top-level-folders}

Après avoir cloné le [référentiel React] (https://github.com/facebook/react), vous verrez quelques dossiers de niveau supérieur:

* [`packages`] (https://github.com/facebook/react/tree/master/packages) contient des métadonnées (telles que `package.json`) et le code source (sous-répertoire `src`) du répertoire React. **Si votre modification est liée au code, le sous-répertoire `src` de chaque paquet est l'endroit où vous passerez le plus clair de votre temps.**
* [`fixtures`] (https://github.com/facebook/react/tree/master/fixtures) contient quelques petites applications de test React pour les contributeurs.
* `build` est la sortie de construction de React. Il ne figure pas dans le référentiel, mais il apparaîtra dans votre clone de React après que vous [l'aurez construit](/docs/how-to-contribute.html#development-workflow) pour la première fois.

La documentation est hébergée [dans un référentiel distinct de React] (https://github.com/reactjs/reactjs.org).

Il existe quelques autres dossiers de niveau supérieur, mais ils sont principalement utilisés pour les outils et vous ne les rencontrerez probablement jamais lorsque vous contribuez.

### Tests colocalisés {#colocated-tests}

Nous n'avons pas de répertoire de niveau supérieur pour les tests unitaires. Au lieu de cela, nous les plaçons dans un répertoire appelé `__tests__` en fonction des fichiers qu’ils testent.

Par exemple, un test pour [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js) est placé, juste à côté, dans [`__tests__/setInnerHTML-test.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js).

### Avertissements et invariants {#warnings-and-invariants}

La base de code de React utilise le module `warning` pour afficher les avertissements:

```js
var warning = require('warning');

warning(
  2 + 2 === 4,
  'Les Mathématiques ne fonctionnent pas auourd\'hui.'
);
```

**L'avertissement est affiché lorsque la condition `warning` est `false`.**

Une façon de se le représenter est que la condition devrait refléter la situation normale plutôt que la situation exceptionnelle.

C'est une bonne idée d'éviter de spammer la console avec des avertissements en double:

```js
var warning = require('warning');

var didWarnAboutMath = false;
if (!didWarnAboutMath) {
  warning(
    2 + 2 === 4,
    'Les Mathématiques ne fonctionnent pas auourd\'hui.'
  );
  didWarnAboutMath = true;
}
```

Les avertissements ne sont activés que dans la phase de développement. En production, ils sont complètement occultés. Si vous avez besoin d'interdire l'exécution d'une partie de code, utilisez plutôt le module `invariant`:

```js
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'Vous ne passerez pas !'
);
```

**L'invariant est levé lorsque la condition `invariant` est` false`.**

"Invariant" est juste une façon de dire "cette condition est toujours vraie". Vous pouvez voir ça comme une affirmation.

Il est important de garder similaire les comportements de développement et de production, afin que les invariants se lancent à la fois en développement et en production. Les messages d'erreur sont automatiquement remplacés par des codes d'erreur en production afin d'éviter toutes incidences négatives sur la taille des octets.

### Développement et production {#development-and-production}

Vous pouvez utiliser la variable pseudo-globale `__DEV__` dans la base de code pour protéger les blocs de code réservés au développement.

Il est en ligne lors de la compilation et se transforme en contrôles `process.env.NODE_ENV! == 'production'` dans les versions CommonJS.

Pour les versions autonomes, il devient `true` dans la version non minisée et est complètement effacé ainsi que les blocs `if` qu'il protège dans la version minimisée.

```js
if (__DEV__) {
  // Ce code va uniquement s'appliquer pendant le développement.
}
```

### Flow {#flow}

Nous avons récemment commencé à introduire des contrôles [Flow](https://flow.org/) dans la base de code. Les fichiers marqués avec l'annotation `@flow` dans le commentaire d'en-tête de licence sont en cours de vérification.

Nous acceptons les pull requests [ajoutant des annotations de Flow au code existant](https://github.com/facebook/react/pull/7600/files). Les annotations Flow ressemblent à cela:

```js
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```

Dans la mesure du possible, le nouveau code devrait utiliser les annotations Flow.
Vous pouvez exécuter `yarn flow` localement pour vérifier votre code avec Flow.

### Injection dynamique {#dynamic-injection}

React utilise l'injection dynamique dans certains modules. Bien que ce soit toujours explicite, cela reste malheureux car cela nuit à la compréhension du code. Cela s'explique principalement par le fait que React ne prenait initialement en charge que le DOM en tant que cible. React Native a commencé comme un fork de React. Nous avons dû ajouter une injection dynamique pour permettre à React Native de remplacer certains comportements.

Vous pouvez voir des modules déclarer leurs dépendances dynamiques comme ceci:

```js
// Injecté dynamiquement
var textComponentClass = null;

// Repose sur une valeur injectée dynamiquement
function createInstanceForText(text) {
  return new textComponentClass(text);
}

var ReactHostComponent = {
  createInstanceForText,

  // Fournit une opportunité d'injection dynamique
  injection: {
    injectTextComponentClass: function(componentClass) {
      textComponentClass = componentClass;
    },
  },
};

module.exports = ReactHostComponent;
```

Le champ `injection` n'est en aucun cas traité spécialement. Mais par convention, cela veut dire que ce module veut avoir certaines dépendances (supposément spécifiques à une plate-forme) qui lui sont injectées au moment de l'exécution.

Il y a plusieurs points d'injection dans la base de code. À l’avenir, nous entendons nous débarrasser du mécanisme d’injection dynamique et raccorder toutes les pièces de manière statique pendant la construction.

### Plusieurs paquets {#multiple-packages}

React est un [monorepo] (https://danluu.com/monorepo/). Son référentiel contient plusieurs paquets distincts afin que leurs modifications puissent être coordonnées ensemble et que les problèmes vivent d'un même endroit.

### Le noyau de React {#react-core}

Le "noyau" de React inclut toutes les [API `React` de premiers niveaux](/docs/top-level-api.html#react), par exemple:

* `React.createElement()`
* `React.Component`
* `React.Children`

**Le noyau React n'inclut que les API nécessaires à la définition des composants.**  Il n'inclut pas l'algorithme [réconciliation](/docs/reconciliation.html) ni aucun code spécifique à la plate-forme. Il est utilisé à la fois par les composants React du DOM et React Native.

Le code pour le noyau React se trouve dans [`packages/react`](https://github.com/facebook/react/tree/master/packages/react) dans l'arborescence source. Il est disponible sur npm sous la forme du paquet [`react`](https://www.npmjs.com/package/react). La version autonome compilée pour navigateur correspondante est appelée `react.js`, et exporte une variable globale appelée `React`.

### Renderers {#renderers}

React a été créé à l'origine pour le DOM, mais il a ensuite été adapté pour prendre également en charge les plates-formes natives avec [React Native](https://facebook.github.io/react-native/). Cela a introduit le concept de "renderers" aux fonctionnalités React.

**Renderers gèrent la transformation d'une arborescence React en appels de plate-forme sous-jacents.**

Renderers sont aussi localisés dans [`packages/`](https://github.com/facebook/react/tree/master/packages/):

* [React DOM Renderer](https://github.com/facebook/react/tree/master/packages/react-dom) renders React components to the DOM. It implements [top-level `ReactDOM` APIs](/docs/react-dom.html) and is available as [`react-dom`](https://www.npmjs.com/package/react-dom) npm package. It can also be used as standalone browser bundle called `react-dom.js` that exports a `ReactDOM` global.
* [React Native Renderer](https://github.com/facebook/react/tree/master/packages/react-native-renderer) renders React components to native views. It is used internally by React Native.
* [React Test Renderer](https://github.com/facebook/react/tree/master/packages/react-test-renderer) renders React components to JSON trees. It is used by the [Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) feature of [Jest](https://facebook.github.io/jest) and is available as [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) npm package.

The only other officially supported renderer is [`react-art`](https://github.com/facebook/react/tree/master/packages/react-art). It used to be in a separate [GitHub repository](https://github.com/reactjs/react-art) but we moved it into the main source tree for now.

>**Remarque:**
>
>Techniquement, le [`react-native-renderer`](https://github.com/facebook/react/tree/master/packages/react-native-renderer) est une couche très mince qui apprend à React à interagir avec la mise en oeuvre de React Native.  Le véritable code spécifique à la plate-forme, gérant les vues natives ainsi que ses composants, réside dans le [répertoire React Native](https://github.com/facebook/react-native).

### Réconciliateurs {#reconcilers}

Même des moteurs de rendu très différents comme React DOM et React Native doivent partager beaucoup de logique. En particulier, l'algorithme [réconciliation](/docs/reconciliation.html) doit être aussi similaire que possible afin que le rendu déclaratif, les composants personnalisés, l'état, les méthodes de cycle de vie et les références fonctionnent de manière cohérente sur toutes les plateformes.

Pour résoudre ce problème, différents moteurs de rendu partagent du code entre eux. Nous appelons cette partie de React un "réconciliateur". Lorsqu'une mise à jour telle que `setState()` est planifiée, le réconciliateur appelle `render()` sur les composants de l'arborescence et les monte, les met à jour ou les supprime.

Les réconciliateurs ne sont pas empaquetés séparément car ils ne disposent actuellement d'aucune API publique. Au lieu de cela, ils sont exclusivement utilisés par les moteurs de rendu tels que React DOM et React Native.

### Réconciliateur Stack {#stack-reconciler}

Le réconciliateur "stack" est l'implémentation qui alimente React 15 et les versions antérieures. Nous avons depuis cessé de l'utiliser, tout ceci est décrit en détail dans la [prochaine section](/docs/implementation-notes.html).

### Réconciliateur Fiber {#fiber-reconciler}

Le réconciliateur "fiber" est un nouvel effort visant à résoudre les problèmes inhérents au réconciliateur de pile et à résoudre quelques problèmes de longue date. C’est le réconciliateur par défaut depuis React 16.

Ses objectifs principaux sont :

* Possibilité de diviser le travail arrêtable en morceaux.
* Possibilité de hiérarchiser, de rebaser et de réutiliser des travaux en cours.
* Possibilité de se répartir entre parents et enfants pour subvenir aux besoins du rendu dans React.
* Possibilité de retourner plusieurs éléments de `render()`.
* Meilleur support pour les limites d'erreur.

Vous pouvez en savoir plus sur l’architecture des Fiber React [ici](https://github.com/acdlite/react-fiber-architecture) et [ici](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e). Bien qu’elles soient livrées avec React 16, les fonctionnalités asynchrones ne sont pas encore activées par défaut.

Son code source est situé dans [`packages/react-reconciler`](https://github.com/facebook/react/tree/master/packages/react-reconciler).

### Système d'événements {#event-system}

React implémente un système d'événements synthétiques agnostique des moteurs de rendu et fonctionne à la fois avec React DOM et React Native. Son code source se trouve dans [`packages/events`](https://github.com/facebook/react/tree/master/packages/events).

Voici une [vidéo qui plonge en profondeur dans ce code](https://www.youtube.com/watch?v=dRo_egw7tBc) (66 minutes).

### Et ensuite ? {#what-next}

Lisez la [section suivante](/docs/implementation-notes.html) pour en savoir plus sur la mise en œuvre du réconciliateur avant React 16. Nous n'avons pas encore documenté les composants internes du nouveau réconciliateur.
