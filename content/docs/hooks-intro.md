---
id: hooks-intro
title: Introduction aux Hooks
permalink: docs/hooks-intro.html
next: hooks-overview.html
---

*Hooks* sont une nouvelle fonctionnalitée de React 16.8. Ils vous permet d'utiliser l'état et autre fonctionnalitée de React sans écrire de classe.

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

Cette nouvelle fonction `useState` est le premier "Hook" que nous allons apprendre, mais cet exemple est juste un petit aperçu. Ne vous inquiétez pas si cela n'a pas encore de sens!

**Vous pouvez demarrer l'apprentissage des Hooks [à la page suivante](/docs/hooks-overview.html).** A cette page, nous expliquerons pourquoi nous avons ajouté les Hooks à React et comment ils vous aidera à ecrire de grandes applications.

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

### It's hard to reuse stateful logic between components {#its-hard-to-reuse-stateful-logic-between-components}

React doesn't offer a way to "attach" reusable behavior to a component (for example, connecting it to a store). If you've worked with React for a while, you may be familiar with patterns like [render props](/docs/render-props.html) and [higher-order components](/docs/higher-order-components.html) that try to solve this. But these patterns require you to restructure your components when you use them, which can be cumbersome and make code harder to follow. If you look at a typical React application in React DevTools, you will likely find a "wrapper hell" of components surrounded by layers of providers, consumers, higher-order components, render props, and other abstractions. While we could [filter them out in DevTools](https://github.com/facebook/react-devtools/pull/503), this points to a deeper underlying problem: React needs a better primitive for sharing stateful logic.

With Hooks, you can extract stateful logic from a component so it can be tested independently and reused. **Hooks allow you to reuse stateful logic without changing your component hierarchy.** This makes it easy to share Hooks among many components or with the community.

We'll discuss this more in [Building Your Own Hooks](/docs/hooks-custom.html).

### Complex components become hard to understand {#complex-components-become-hard-to-understand}

We've often had to maintain components that started out simple but grew into an unmanageable mess of stateful logic and side effects. Each lifecycle method often contains a mix of unrelated logic. For example, components might perform some data fetching in `componentDidMount` and `componentDidUpdate`. However, the same `componentDidMount` method might also contain some unrelated logic that sets up event listeners, with cleanup performed in `componentWillUnmount`. Mutually related code that changes together gets split apart, but completely unrelated code ends up combined in a single method. This makes it too easy to introduce bugs and inconsistencies.

In many cases it's not possible to break these components into smaller ones because the stateful logic is all over the place. It's also difficult to test them. This is one of the reasons many people prefer to combine React with a separate state management library. However, that often introduces too much abstraction, requires you to jump between different files, and makes reusing components more difficult.

To solve this, **Hooks let you split one component into smaller functions based on what pieces are related (such as setting up a subscription or fetching data)**, rather than forcing a split based on lifecycle methods. You may also opt into managing the component's local state with a reducer to make it more predictable.

We'll discuss this more in [Using the Effect Hook](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns).

### Classes confuse both people and machines {#classes-confuse-both-people-and-machines}

In addition to making code reuse and code organization more difficult, we've found that classes can be a large barrier to learning React. You have to understand how `this` works in JavaScript, which is very different from how it works in most languages. You have to remember to bind the event handlers. Without unstable [syntax proposals](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/), the code is very verbose. People can understand props, state, and top-down data flow perfectly well but still struggle with classes. The distinction between function and class components in React and when to use each one leads to disagreements even between experienced React developers.

Additionally, React has been out for about five years, and we want to make sure it stays relevant in the next five years. As [Svelte](https://svelte.technology/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/), and others show, [ahead-of-time compilation](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) of components has a lot of future potential. Especially if it's not limited to templates. Recently, we've been experimenting with [component folding](https://github.com/facebook/react/issues/7323) using [Prepack](https://prepack.io/), and we've seen promising early results. However, we found that class components can encourage unintentional patterns that make these optimizations fall back to a slower path. Classes present issues for today's tools, too. For example, classes don't minify very well, and they make hot reloading flaky and unreliable. We want to present an API that makes it more likely for code to stay on the optimizable path.

To solve these problems, **Hooks let you use more of React's features without classes.** Conceptually, React components have always been closer to functions. Hooks embrace functions, but without sacrificing the practical spirit of React. Hooks provide access to imperative escape hatches and don't require you to learn complex functional or reactive programming techniques.

>Examples
>
>[Hooks at a Glance](/docs/hooks-overview.html) is a good place to start learning Hooks.

## Gradual Adoption Strategy {#gradual-adoption-strategy}

>**TLDR: There are no plans to remove classes from React.**

We know that React developers are focused on shipping products and don't have time to look into every new API that's being released. Hooks are very new, and it might be better to wait for more examples and tutorials before considering learning or adopting them.

We also understand that the bar for adding a new primitive to React is extremely high. For curious readers, we have prepared a [detailed RFC](https://github.com/reactjs/rfcs/pull/68) that dives into motivation with more details, and provides extra perspective on the specific design decisions and related prior art.

**Crucially, Hooks work side-by-side with existing code so you can adopt them gradually.** There is no rush to migrate to Hooks. We recommend avoiding any "big rewrites", especially for existing, complex class components. It takes a bit of a mindshift to start "thinking in Hooks". In our experience, it's best to practice using Hooks in new and non-critical components first, and ensure that everybody on your team feels comfortable with them. After you give Hooks a try, please feel free to [send us feedback](https://github.com/facebook/react/issues/new), positive or negative.

We intend for Hooks to cover all existing use cases for classes, but **we will keep supporting class components for the foreseeable future.** At Facebook, we have tens of thousands of components written as classes, and we have absolutely no plans to rewrite them. Instead, we are starting to use Hooks in the new code side by side with classes.

## Frequently Asked Questions {#frequently-asked-questions}

We've prepared a [Hooks FAQ page](/docs/hooks-faq.html) that answers the most common questions about Hooks.

## Next Steps {#next-steps}

By the end of this page, you should have a rough idea of what problems Hooks are solving, but many details are probably unclear. Don't worry! **Let's now go to [the next page](/docs/hooks-overview.html) where we start learning about Hooks by example.**
