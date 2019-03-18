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
  // Declarer une nouvelle variable d'état, que nous appelerons "count"
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
>Les Hooks sont pris en charge à partir de la version 16.8.0 de React. Lors de la mise à jour de React, n'oubliez pas de mettre à jour tout les paquets en incluant React DOM. React Native supportera les Hooks dans sa prochaine version stable.

## Introduction de la Vidéo {#video-introduction}

A la React Conf 2018, Sophie Alpert et Dan Abramov introduisent les Hooks, suivi de Ryan Florence qui demontre comment refactoriser une application pour les utiliser. Regardez les vidéos ici:

<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## Aucun changement majeur {#no-breaking-changes}

Avant de continuer, notez que les hooks sont:

* **Complètement opt-in.** Vous pouvez essayer les Hooks dans quelques composants sans réécrire le code existant. Mais vous ne devez pas apprendre ou utiliser les Hooks maintenant si vous ne voulez pas.
* **100% rétro-compatible.** les Hooks ne contiennent aucun changement majeur.
* **Disponible maintenant.** les Hooks sont disponible maintenant avec la version v16.8.0.

**Aucun plan de supprimer les classes de React.** Vous pouvez en savoir plus sur la stratégie d'adoption des Hooks à la [section du bas](#gradual-adoption-strategy) de cette page.

**Hooks ne remplacent pas votre connaissance et vos concpets de React.** les Hooks fournissent plutôt une API plus directe aux concepts React que vous connaissez déjà: props, état, contexte, refs et cycle de vie. Comme nous le verrons plus tard, les Hooks offrent également un nouveau moyen puissant de les combiner.

**Si vous voulez commencer à apprendre les Hooks, soyez libre [d'aller directement à la page suivante!](/docs/hooks-overview.html)** Vous pouvez également continuer à lire cette page pour en savoir plus sur les raisons pour lesquelles nous ajoutons les Hooks et sur la façon dont nous allons commencer à les utiliser sans réécrire nos applications.

## Motivation {#motivation}

Les Hooks résolvent une grande variété de problèmes apparemment non liés à React, que nous avons rencontrés pendant cinq ans au cours de la rédaction et de la maintenance de dizaines de milliers de composants. Que vous appreniez React, l'utilisiez quotidiennement ou préfériez une bibliothèque différente avec un modèle de composant similaire, vous pourriez reconnaître certains de ces problèmes.

### Il est difficile de réutiliser la logique à état entre les composants {#its-hard-to-reuse-stateful-logic-between-components}

React doesn't offer a way to "attach" reusable behavior to a component (for example, connecting it to a store). If you've worked with React for a while, you may be familiar with patterns like [render props](/docs/render-props.html) and [higher-order components](/docs/higher-order-components.html) that try to solve this. But these patterns require you to restructure your components when you use them, which can be cumbersome and make code harder to follow. If you look at a typical React application in React DevTools, you will likely find a "wrapper hell" of components surrounded by layers of providers, consumers, higher-order components, render props, and other abstractions. While we could [filter them out in DevTools](https://github.com/facebook/react-devtools/pull/503), this points to a deeper underlying problem: React needs a better primitive for sharing stateful logic.

With Hooks, you can extract stateful logic from a component so it can be tested independently and reused. **Hooks allow you to reuse stateful logic without changing your component hierarchy.** This makes it easy to share Hooks among many components or with the community.

Nous discutons enormement de cela dans [Construire vos propres Hooks](/docs/hooks-custom.html).

### Les composants complexe deviennent difficile à comprendre {#complex-components-become-hard-to-understand}

We've often had to maintain components that started out simple but grew into an unmanageable mess of stateful logic and side effects. Each lifecycle method often contains a mix of unrelated logic. For example, components might perform some data fetching in `componentDidMount` and `componentDidUpdate`. However, the same `componentDidMount` method might also contain some unrelated logic that sets up event listeners, with cleanup performed in `componentWillUnmount`. Mutually related code that changes together gets split apart, but completely unrelated code ends up combined in a single method. This makes it too easy to introduce bugs and inconsistencies.

In many cases it's not possible to break these components into smaller ones because the stateful logic is all over the place. It's also difficult to test them. This is one of the reasons many people prefer to combine React with a separate state management library. However, that often introduces too much abstraction, requires you to jump between different files, and makes reusing components more difficult.

To solve this, **Hooks let you split one component into smaller functions based on what pieces are related (such as setting up a subscription or fetching data)**, rather than forcing a split based on lifecycle methods. You may also opt into managing the component's local state with a reducer to make it more predictable.

We'll discuss this more in [Using the Effect Hook](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns).

### Les Classes confondent les gens et les machines {#classes-confuse-both-people-and-machines}

En plus de rendre plus difficile la réutilisation et l’organisation du code, nous avons trouvé que les classes peuvent etre une large barrière à l'apprentissage de React. Vous avez compris comment `this` fonctionne dans le JavaScript, qui est très différent de la manière dont il fonctionne dans la plupart des autres languages. Vous devez vous rappeler de lier les gestionnaires d'évenements. Sans l'instabiité de [syntaxe proposées](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/), le code est très verbeux. Les gens peuvent comprendre les props, état, et le flux de données descendant parfaitement bien mais toujours aux prises avec des classes. La distinction entre fonction et composant à base de classe et le moment d'utilisation de chacun conduit à des désaccords entre développeurs expérimentés de React.

En oûtre, React est sorti il y'a cinq années de cela, et nous voulons s'assurer qu'il reste pertinent pour les cinq prochaines années. Comme [Svelte](https://svelte.technology/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/), et d'autres montrent, [ahead-of-time compilation](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) de composants à beaucoup de potentiel futur. Surtout si ce n'est pas limité aux modèles. Récemment, nous avons experimenté avec [component folding](https://github.com/facebook/react/issues/7323) en utilisant [Prepack](https://prepack.io/), et nous avons vu les premiers résultats prometteurs. Toutefois, nous trouvons que les composants à base de classe peuvent encourager des motifs non intentionnels qui font que ces optimisations retombent plus lentement. Les classes présentent des problèmes pour les outils d'aujourd'hui. Par exemple, les classes ne réduisent pas correctement bien, et ils rendent le rechargement à chaud peu fiable. Nous voulons présenter une API qui permet au code de rester optimisé.

Pour résoudre ces problèmes, **Les Hooks nous permentent d'utiliser beaucoup plus de fonctionnalités de React sans les classes.** Conceptuellement, Les composants React ont toujours été fermé aux fonctions. Les Hooks sont compatible avec les fonctions sans  sacrifier l'esprit pratique de React. Les Hooks donne accès aux trappes d’évacuation impératives et ne vous oblige pas à apprendre des techniques complexes de programmation fonctionnelle ou réactive..

>Exemple
>
>[les Hooks en un coup d'oeil](/docs/hooks-overview.html) est une bonne partie pour commener à apprendre les Hooks.

## Stratégie d'adoption progressive {#gradual-adoption-strategy}

>**TLDR: Il n'y a aucune idée de supprimer les classes de React.**

Nous savons que les developpeurs React sont focalisés sur la sortie de produits et n'ont pas assez de temps pour regarder à l'intérieur de chaque nouvelle API qui est publiée. Les Hooks sont nouveaux, et il sera sage d'attendre plusieurs exemples et tutoriels avant d'envisager de les apprendre ou de les adopter.

Nous comprenons aussi que la barre pour ajouter une nouvelle primitive à React est extremement haute. Pour les lecteurs curieux, nous avons preparé un [RFC detaillé](https://github.com/reactjs/rfcs/pull/68) qui plonge au plus profond des motivations avec beaucoup plus de détails, et fournit une perspective supplémentaire sur les decisions de conception spécifique.

**Point très important : les Hooks fonctionnent côte à côte avec du code existant, vous pouvez donc les adopter progressivement.** Il n'y aucune raison pressante de migrer vers les Hooks. Nous conseillons d'éviter les « réécritures intégrales », en particulier pour les composants existants complexes à base de classes. Il faut ajuster un peu son modèle mental pour commencer à « penser en Hooks ». À en croire notre expérience, il vaut mieux s'habituer aux Hooks dans de nouveaux composants non-critiques, et s'assurer que toutes les personnes de l'équipe sont à l'aise avec. Après avoir essayé les Hooks, n’hésitez pas à [nous faire vos retours](https://github.com/facebook/react/issues/new), qu'ils soient positifs ou négatifs.

Nos voulons que les Hooks couvrent tout les cas d'usages des classes, mais **nous continuerons à prendre en charge les composants à base de classes jusqu’à nouvel ordre.** Chez Facebook, nous avons des dizaines de milliers de composants écrit en tant que classes, et nous n’avons absolument pas l'intention de les réécrire. Au lieu de ça, nous avons commencé à utiliser les Hooks dans le nouveau code, côte à côte avec les classes.

## Questions fréquemment posées {#frequently-asked-questions}

Nous avons préparé une [FAQ des Hooks](/docs/hooks-faq.html) qui répond aux questions les plus courantes sur les Hooks.

## Nouvelle étape {#next-steps}

A la fin de cette page, vous devriez avoir une idée plus claire sur les problèmes résolus par les Hooks, mais plusieurs détails ne sont probablement pas clair. Aucun soucis! **Allons-y maintenant à [la page suivante](/docs/hooks-overview.html) où nous commencons l'apprentissage des Hooks.**
