---
id: hooks-intro
title: Introduction aux Hooks
permalink: docs/hooks-intro.html
next: hooks-overview.html
---

Les *Hooks* sont arrivés avec React 16.8. Ils vous permettent de bénéficier d’un état local et d'autres fonctionnalités de React sans avoir à écrire une classe.

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Déclare une nouvelle variable d'état, que l'on va appeler « count »
  const [count, setCount] = useState(0);

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

Cette nouvelle fonction `useState` est le premier « Hook » que nous allons explorer, mais cet exemple est juste un petit aperçu. Ne vous inquiétez pas si vous n’y comprenez rien pour le moment !

**Vous pouvez commencer à apprendre les Hooks [à la page suivante](/docs/hooks-overview.html).** Dans celle-ci, nous vous expliquons pourquoi nous avons ajouté les Hooks à React et comment ils vous aideront à écrire des applications géniales.

>Remarque
>
>Les Hooks sont apparus dans React 16.8.0. Lors de la mise à jour de React, n'oubliez pas de mettre à jour tous les modules, dont React DOM. React Native prendre en charge les Hooks dans sa prochaine version stable.

## Vidéo de présentation {#video-introduction}

Lors de la React Conf 2018, Sophie Alpert et Dan Abramov ont présenté les Hooks, suivis de Ryan Florence qui a montré comment refactoriser une application pour les utiliser. Regardez la vidéo ici :

<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## Pas de rupture de compatibilité {#no-breaking-changes}

Avant de continuer, remarquez bien que les hooks sont :

* **Complètement optionnels.** Vous pouvez essayer les Hooks dans quelques composants sans réécrire le code existant. Mais vous n’avez pas à apprendre et utiliser les Hooks dès maintenant si vous ne le souhaitez pas.
* **100% rétro-compatibles.** les Hooks préservent la compatibilité ascendante.
* **Disponibles maintenant.** Les Hooks sont disponibles depuis la version 16.8.0.

**Les classes en React ne sont pas menacées.** Vous pouvez en apprendre davantage sur la stratégie d'adoption progressive des Hooks [en bas de cette page](#gradual-adoption-strategy).

**Les Hooks n'invalident pas vos connaissances des concepts de React.** Les Hooks fournissent plutôt une API plus directe pour les concepts React que vous connaissez déjà : props, état local, contexte, refs et cycle de vie. Comme nous le verrons plus tard, les Hooks offrent également un nouveau moyen puissant de les combiner.

**Si vous voulez juste commencer à apprendre les Hooks, n’hésitez pas à [aller directement à la page suivante !](/docs/hooks-overview.html)** Vous pouvez également continuer à lire cette page pour en apprendre davantage sur les raisons pour lesquelles nous ajoutons les Hooks et sur la façon dont nous allons commencer à les utiliser sans réécrire nos applications.

## Raisons {#motivation}

Les Hooks résolvent une grande variété de problèmes apparemment sans rapports en React, que nous avons rencontrés pendant cinq ans d'écriture et de maintenance de dizaines de milliers de composants. Que vous appreniez React, l'utilisiez quotidiennement ou préfériez une bibliothèque différente avec un modèle de composants similaire, vous pourriez reconnaître certains de ces problèmes.

### Il est difficile de réutiliser la logique à état entre les composants {#its-hard-to-reuse-stateful-logic-between-components}

React n'offre aucun moyen "d'attacher" un comportement réutisable aux composants (par exemple le connecter à un état global). Si vous utilisez React, vous êtes déjà familier avec les expressions telle que [rendu des props](/docs/render-props.html) et [composant d'ordre supérieur](/docs/higher-order-components.html) qui tentent de les resoudre. Mais ces expressions exigent la réstructuration de vos composants lorsque vous les utilisés, ce qui rendra le code lourd et difficile à maintenir. Pendant l'analyse d'une application React dans le DevTools, Vous trouverez un "grand nombre" de composants entourés par des couches fournisseurs, consommateurs, composants d'odre supérieur, rendu de props, et d'autres abstractions. Bien que nous puissions [les analyser dans le DevTools](https://github.com/facebook/react-devtools/pull/503), cela indique un problème plus majeur: React a besoin d'une meilleur primitive pour le partage de la logique à état.

Avec les Hooks, la logique à état d'un composant peut être extraire afin que celle-ci puisse être réutilisée et testée indépendamment. **Les Hooks autorisent la réutilisation de la logique à état sans modifier la hiérachie des composants.** Cela facilite le partage des Hooks avec la communauté ou parmis plusieurs composants.

Nous parlerons de ça plus en détail dans [Construire vos propres Hooks](/docs/hooks-custom.html).

### Les composants complexes deviennent difficiles à comprendre {#complex-components-become-hard-to-understand}

Souvent, nous avons été confronté à maintenir les compsants simple qui ont fini pour devenir des composants à plusieurs logique à état et effet de bord ingérable. Chaque méthode de cycle de vie contient un mélange de logique sans aucun rapport. Par exemple, les composants peuvent collecter les données grâce à la méthode `componentDidMount` et `componentDidUpdate`. Parfois, la méthode `componentDidMount` peut contenir différente logique qui configure les écouteurs d'évenements qui sont à leur tour supprimé ou nettoyé dans la méthode `componentWillUnmount`. Le code mutuellement lié qui change ensemble est divisé en deux parties, mais un code totalement non lié finit par être combiné en une seule méthode. Ceci permet d'introduire les bugs et incohérences.

Dans plusieurs cas, il n'est autorisé de changer ces composants en plus petit car la logique à état est partout. Il est aussi difficile de les tester. C'est la raison pour laquelle les utilisateurs de React préferent associer React à une librairie externe pour la gestion d'état de leur application. Toutefois, ceci introduit beaucoup plus d'abstraction et exige que vous vous deplacez de fichier en fichier afin que ces composants réutiisable deviennent difficile à comprendre.

Pour corriger ceci, **Les Hooks permettent de transformer un composant en petite fonction comprehensive en fonction des éléments qui sont liés (comme la configuration d'un abonnement ou la collecte de données)**, plutôt que de forcer la transformation sur des méthodes de cycle de vie. Il est aussi possible de gérer l'état local d'un composant avec un réducteur plus prévisible.

Nous en parlerons plus dans [l'utilisation de l'Effet à Hook](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns).

### Les classes sont déroutantes pour les gens comme pour les machines {#classes-confuse-both-people-and-machines}

En plus de rendre plus difficiles la réutilisation et l’organisation du code, nous avons remarqué que les classes peuvent constituer une barrière significative à l'apprentissage de React. Vous devez comprendre comment `this` fonctionne en JavaScript, d’une façon très différente de la plupart des langages. Vous devez vous souvenir de lier les gestionnaires d'événements. Sans certaines [propositions de syntaxes](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/) encore instables, le code est très verbeux. Les gens peuvent parfaitement comprendre les props, l’état local, et le flux de données descendant mais lutter néanmoins avec les classes. La distinction entre fonctions composants et composants à base de classes, ainsi que les situations où leur usage respectif est approprié, conduisent à des désaccords même entre développeurs React expérimentés.

En outre, React est sorti il y a cinq ans, et nous voulons nous assurer qu'il reste pertinent pour les cinq prochaines années. Comme [Svelte](https://svelte.technology/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/), et d'autres l'ont montré, la [compilation anticipée](https://fr.wikipedia.org/wiki/Compilation_anticipée) de composants recèle un fort potentiel, surtout si elle ne se limite pas aux gabarits. Récemment, nous avons expérimenté autour du *[component folding](https://github.com/facebook/react/issues/7323)* en utilisant [Prepack](https://prepack.io/), et les premiers résultats sont encourageants. Toutefois, nous avons constaté que les composants à base de classes peuvent encourager des approches involontaires qui empêchent de telles optimisations. Les classes présentent aussi des problèmes pour l’outillage actuel. Par exemple, les classes ne sont pas efficacement minifiées, et elles rendent le rechargement à chaud peu fiable. Nous voulons présenter une API qui permet au code de rester plus aisément optimisable.

Pour résoudre ces problèmes, **les Hooks nous permettent d'utiliser davantage de fonctionnalités de React sans recourir aux classes.** Conceptuellement, les composants React ont toujours été proches des fonctions. Les Hooks tirent pleinement parti des fonctions, sans sacrifier l'esprit pratique de React. Les Hooks donnent accès à des échappatoires impératifs et ne vous obligent pas à apprendre des techniques complexes de programmation fonctionnelle ou réactive..

>Exemples
>
>[L’aperçu des Hooks](/docs/hooks-overview.html) est un bon moyen de commencer à apprendre les Hooks.

## Stratégie d'adoption progressive {#gradual-adoption-strategy}

>**TLDR : nous n'avons aucune intention de retirer les classes de React.**

Nous savons que les développeurs React se concentrent sur la sortie de leurs produits et n'ont pas le temps d’explorer chaque nouvelle API qui sort. Les Hooks sont tout nouveaux, et il serait peut-être sage d'attendre que davantage d’exemples et de tutoriels soient disponibles avant d'envisager de les apprendre ou de les adopter.

Nous comprenons aussi que la barre pour ajouter une nouvelle primitive à React est extrêmement haute. Pour les lecteurs curieux, nous avons préparé une [RFC détaillée](https://github.com/reactjs/rfcs/pull/68) qui explore plus en détail les raisons derrière les Hooks, et fournit une perspective supplémentaire sur certaines décisions de conception et sur des sources d'inspiration.

**Point très important : les Hooks fonctionnent côte à côte avec du code existant, vous pouvez donc les adopter progressivement.** Il n'y aucune raison pressante de migrer vers les Hooks. Nous conseillons d'éviter les « réécritures intégrales », en particulier pour les composants existants complexes à base de classes. Il faut ajuster un peu son modèle mental pour commencer à « penser en Hooks ». À en croire notre expérience, il vaut mieux s'habituer aux Hooks dans de nouveaux composants non-critiques, et s'assurer que toutes les personnes de l'équipe sont à l'aise avec. Après avoir essayé les Hooks, n’hésitez pas à [nous faire vos retours](https://github.com/facebook/react/issues/new), qu'ils soient positifs ou négatifs.

Nos voulons que les Hooks couvrent tout les cas d'usages des classes, mais **nous continuerons à prendre en charge les composants à base de classes jusqu’à nouvel ordre.** Chez Facebook, nous avons des dizaines de milliers de composants écrit en tant que classes, et nous n’avons absolument pas l'intention de les réécrire. Au lieu de ça, nous avons commencé à utiliser les Hooks dans le nouveau code, côte à côte avec les classes.

## Questions fréquemment posées {#frequently-asked-questions}

Nous avons préparé une [FAQ des Hooks](/docs/hooks-faq.html) qui répond aux questions les plus courantes sur les Hooks.

## Prochaines étapes {#next-steps}

Arrivés sur cette fin de page, vous devriez avoir une idée plus claire des problèmes résolus par les Hooks, mais de nombreux détails restent sans doute obscurs. Ne vous en faites pas ! **En route pour [la page suivante](/docs/hooks-overview.html), dans laquelle nous commencerons à apprendre les Hooks par l'exemple.**
