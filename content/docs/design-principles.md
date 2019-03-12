---
id: design-principles
title: Principes de conception
layout: contributing
permalink: docs/design-principles.html
prev: implementation-notes.html
redirect_from:
  - "contributing/design-principles.html"
---

Nous avons écrit cet article afin que vous ayez une meilleure idée de la façon dont nous décidons ce que React fait et ne fait pas, et quelle est notre philosophie de développement. Bien que nous soyons enthousiasmés par les contributions de la communauté, il est peu probable que nous choisissions un chemin qui enfreint un ou plusieurs de ces principes.

> **Remarque**
>
> Cet article requiert une solide compréhension de React. Il décrit les principes de designe de *React lui-même*, et non des composants ou des applications React.
>
> Pour une introduction à React, consultez plutôt [Thinking in React](/docs/thinking-in-react.html).

### Composition {#composition}

La caractéristique principale de React est la composition de composants. Les composants écrits par des personnes différentes doivent fonctionner correctement ensemble. Pour nous, il est important que vous puissiez ajouter des fonctionnalités à un composant sans impacter la base de code.

Par exemple, il devrait être possible d'introduire un état local dans un composant sans changer les composants qui l'utilisent. De même, il devrait être possible d’ajouter du code d'initialisation et de démontage à n'importe quel composant, lorsque c'est nécessaire.

Il n'y a rien de « mauvais » à utiliser un état ou une méthode du cycle de vie dans des composants. Comme n'importe quelle fonctionnalité puissante, elles doivent être utilisées avec modération, mais nous n'avons aucune intention de les supprimer. Au contraire, nous pensons qu'ils font partie intégrante de ce qui rend React utile. Nous pourrions activer [davantage de modèles de conception fonctionnelle](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) (en anglais) à l'avenir, mais les méthodes d'état local et de cycle de vie feront partie de ce modèle.

Les composants sont souvent décrits comme de « simples fonctions » mais selon nous, ils doivent être bien plus que ça pour être utiles. Dans React, les composants décrivent tout comportement composable, notamment le rendu, le cycle de vie et l'état. Certaines bibliothèques externes telles que [Relay](https://facebook.github.io/relay/) ajoutent d'autres responsabilités aux composants comme la description des dépendances de données. Il est possible que ces idées reviennent dans React sous une forme ou une autre.

### Abstraction commune {#common-abstraction}

En général, nous [refusons d’ajouter des fonctionnalités](https://www.youtube.com/watch?v=4anAwXYqLG8) (en anglais) pouvant être mises en œuvre dans le paysage des utilisateurs. Nous ne voulons pas surcharger vos applications avec du code inutile. Cependant, il y a des exceptions à ça.

Par exemple, si React n'offrait pas de support pour l'état local ou les méthodes du cycle de vie, les utilisateurs créeraient leurs propres abstractions personnalisées pour ça. Quand plusieurs abstractions sont en concurrence, React ne peut ni forcer ni bénéficier des propriétés de l'une d'elles. Il doit fonctionner avec le plus petit dénominateur commun.

C'est la raison pour laquelle nous ajoutons parfois des fonctionnalités directement à React. Si nous constatons que de nombreux composants implémentent une certaine fonctionnalité d'une façon incompatible ou peu efficace, nous préférerions peut-être l'intégrer à React. Nous ne le faisons pas à la légère. Lorsque nous le faisons, c’est parce que nous sommes convaincus qu'élever le niveau d’abstraction profite à l’ensemble de l’écosystème. L'état, les méthodes du cycle de vie, la normalisation des événements des navigateurs en sont de bons exemples.

Nous discutons toujours de telles propositions d'amélioration avec la communauté. Vous pouvez trouver certaines de ces discussions avec l'étiquette [« big picture »](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"Type:+Big+Picture") sur le suivi des problèmes de React.

### Escape Hatches {#escape-hatches}

React est pragmatique. Il est dicté par les besoins des produits écrits chez Facebook. Bien qu'il soit influencé par certains paradigmes qui ne sont pas tout à fait populaires comme la programmation fonctionnelle, l'accessibilité à un large panel de développeurs aux compétences et expériences variées est un objectif affiché du projet.

Si nous voulons déprécier un modèle que nous n'aimons pas, il est de notre responsabilité de considérer tous ses cas d'usage et d'[éduquer la communauté à propos des alternatives](/blog/2016/07/13/mixins-considered-harmful.html) avant de le déprécier. Si un modèle utile pour la création d'applications est difficile à exprimer de manière déclarative, nous lui [fournirons une API impérative](/docs/more-about-refs.html). Si nous ne parvenons pas à trouver l'API parfaite pour quelque chose que nous jugeons nécessaire dans de nombreuses applications, nous [fournissons une API temporaire de moindre qualité](/docs/legacy-context.html) dans la mesure où il est possible de s'en débarrasser ultérieurement et qu'elle laisse la porte ouverte à de futures améliorations.

### Stabilité {#stability}

Nous accordons de l'importance à la stabilité de l'API. Chez Facebook, nous avons plus de 50 mille composants utilisant React. De nombreuses autres sociétés, telles que [Twitter](https://twitter.com/) et [Airbnb](https://www.airbnb.com/), sont également de grandes utilisatrices de React. C'est pour cela que nous sommes généralement réticents à changer les API ou les comportements publics.

Cependant, nous pensons que la stabilité au sens où « rien ne change » est surestimée. Cela se transforme vite en stagnation. Nous préférons plutôt la stabilité au sens « c'est fortement utilisé en production et lorsque quelque chose change, il existe un chemin de migration clair (et de préférence automatisé) ».

Lorsque nous déprécions un modèle, nous étudions son utilisation interne chez Facebook et nous ajoutons des avertissements de dépréciation. Ils nous permettent de mesurer l'impact du changement. Parfois nous renonçons quand nous voyons qu'il est encore trop tôt, et nous réfléchissons de manière plus stratégique sur la façon de préparer les bases de code à ce changement.

Si nous sommes convaincus que le changement n'est pas trop disruptif et que la stratégie de migration est viable pour tous les cas d'usage, nous publions les avertissements de dépréciation à la communauté open source. Nous sommes en contact étroit avec de nombreux utilisateurs de React en dehors de Facebook, nous surveillons les projets open source populaires et les aidons à corriger ces dépréciations.

Compte tenu de la taille même de la base de code React chez Facebook, la réussite de la migration en interne est généralement un bon indicateur du fait que les autres sociétés n'auront pas de problèmes non plus. Néanmoins, il arrive que des personnes nous signalent des cas d'usage auxquels nous n'avons pas pensé, et nous ajoutons alors des solutions de contournement pour eux ou repensons notre approche.

Nous ne déprécions rien sans une bonne raison. Nous reconnaissons que les avertissements de dépréciation sont parfois frustrants, mais nous les ajoutons car les dépréciations permettent de préparer le terrain à des améliorations ou de nouvelles fonctionnalités que la communauté et nous-mêmes estimons utiles.

Par exemple, nous avons ajouté un [avertissement concernant les props DOM inconnues](/warnings/unknown-prop.html) dans React 15.2.0. De nombreux projets en furent impactés. Cependant, corriger cet avertissement est important pour pouvoir introduire la prise en charge des [attributs personnalisés](https://github.com/facebook/react/issues/140) dans React. Il y a une raison comme celle-ci derrière chaque dépréciation que nous ajoutons.

Lorsque nous ajoutons un avertissement de dépréciation, nous le conservons pour le reste de la version majeure, et nous [changeons le comportement lors de la version majeure suivante](/blog/2016/02/19/new-versioning-scheme.html). S'il y a beaucoup de travail manuel répétitif à la clé, nous publions un script [codemod](https://www.youtube.com/watch?v=d0pOgY8__JM) (en anglais) qui automatise la plus grande partie de ce changement. Les Codemods nous permettent d'avancer sans stagner sur une base de code importante, et nous vous encourageons à les utiliser également.

Vous trouverez les codemods que nous publions dans le dépôt [react-codemod](https://github.com/reactjs/react-codemod).

### Interopérabilité {#interoperability}

Nous accordons une grande importance à l'interopérabilité avec les systèmes existants et leur adoption progressive. Facebook a une importante base de code non-React. Son site web utilise à la fois un système de composant côté serveur appelé XHP, des bibliothèques d'interface utilisateur (*UI*) qui existaient avant React et React lui-même. Il est important pour nous que n'importe quelle équipe produit puisse [commencer à utiliser React pour une petite fonctionnalité](https://www.youtube.com/watch?v=BF58ZJ1ZQxY) (en anglais) plutôt que de réécrire leur code pour se baser dessus.

C'est pour cela que React propose des solutions de contournement pour fonctionner avec des modèles mutables, et essaie de fonctionner correctement avec d'autres bibliothques d'UI. Vous pouvez enrôber une UI impérative déjà existante dans un composant déclaratif, et inversement. Ceci est crucial pour une adoption progressive.

### Scheduling {#scheduling}

Even when your components are described as functions, when you use React you don't call them directly. Every component returns a [description of what needs to be rendered](/blog/2015/12/18/react-components-elements-and-instances.html#elements-describe-the-tree), and that description may include both user-written components like `<LikeButton>` and platform-specific components like `<div>`. It is up to React to "unroll" `<LikeButton>` at some point in the future and actually apply changes to the UI tree according to the render results of the components recursively.

This is a subtle distinction but a powerful one. Since you don't call that component function but let React call it, it means React has the power to delay calling it if necessary. In its current implementation React walks the tree recursively and calls render functions of the whole updated tree during a single tick. However in the future it might start [delaying some updates to avoid dropping frames](https://github.com/facebook/react/issues/6170).

This is a common theme in React design. Some popular libraries implement the "push" approach where computations are performed when the new data is available. React, however, sticks to the "pull" approach where computations can be delayed until necessary.

React is not a generic data processing library. It is a library for building user interfaces. We think that it is uniquely positioned in an app to know which computations are relevant right now and which are not.

If something is offscreen, we can delay any logic related to it. If data is arriving faster than the frame rate, we can coalesce and batch updates. We can prioritize work coming from user interactions (such as an animation caused by a button click) over less important background work (such as rendering new content just loaded from the network) to avoid dropping frames.

To be clear, we are not taking advantage of this right now. However the freedom to do something like this is why we prefer to have control over scheduling, and why `setState()` is asynchronous. Conceptually, we think of it as "scheduling an update".

The control over scheduling would be harder for us to gain if we let the user directly compose views with a "push" based paradigm common in some variations of [Functional Reactive Programming](https://en.wikipedia.org/wiki/Functional_reactive_programming). We want to own the "glue" code.

It is a key goal for React that the amount of the user code that executes before yielding back into React is minimal. This ensures that React retains the capability to schedule and split work in chunks according to what it knows about the UI.

There is an internal joke in the team that React should have been called "Schedule" because React does not want to be fully "reactive".

### Developer Experience {#developer-experience}

Providing a good developer experience is important to us.

For example, we maintain [React DevTools](https://github.com/facebook/react-devtools) which let you inspect the React component tree in Chrome and Firefox. We have heard that it brings a big productivity boost both to the Facebook engineers and to the community.

We also try to go an extra mile to provide helpful developer warnings. For example, React warns you in development if you nest tags in a way that the browser doesn't understand, or if you make a common typo in the API. Developer warnings and the related checks are the main reason why the development version of React is slower than the production version.

The usage patterns that we see internally at Facebook help us understand what the common mistakes are, and how to prevent them early. When we add new features, we try to anticipate the common mistakes and warn about them.

We are always looking out for ways to improve the developer experience. We love to hear your suggestions and accept your contributions to make it even better.

### Debugging {#debugging}

When something goes wrong, it is important that you have breadcrumbs to trace the mistake to its source in the codebase. In React, props and state are those breadcrumbs.

If you see something wrong on the screen, you can open React DevTools, find the component responsible for rendering, and then see if the props and state are correct. If they are, you know that the problem is in the component’s `render()` function, or some function that is called by `render()`. The problem is isolated.

If the state is wrong, you know that the problem is caused by one of the `setState()` calls in this file. This, too, is relatively simple to locate and fix because usually there are only a few `setState()` calls in a single file.

If the props are wrong, you can traverse the tree up in the inspector, looking for the component that first "poisoned the well" by passing bad props down.

This ability to trace any UI to the data that produced it in the form of current props and state is very important to React. It is an explicit design goal that state is not "trapped" in closures and combinators, and is available to React directly.

While the UI is dynamic, we believe that synchronous `render()` functions of props and state turn debugging from guesswork into a boring but finite procedure. We would like to preserve this constraint in React even though it makes some use cases, like complex animations, harder.

### Configuration {#configuration}

We find global runtime configuration options to be problematic.

For example, it is occasionally requested that we implement a function like `React.configure(options)` or `React.register(component)`. However this poses multiple problems, and we are not aware of good solutions to them.

What if somebody calls such a function from a third-party component library? What if one React app embeds another React app, and their desired configurations are incompatible? How can a third-party component specify that it requires a particular configuration? We think that global configuration doesn't work well with composition. Since composition is central to React, we don't provide global configuration in code.

We do, however, provide some global configuration on the build level. For example, we provide separate development and production builds. We may also [add a profiling build](https://github.com/facebook/react/issues/6627) in the future, and we are open to considering other build flags.

### Beyond the DOM {#beyond-the-dom}

We see the value of React in the way it allows us to write components that have fewer bugs and compose together well. DOM is the original rendering target for React but [React Native](https://facebook.github.io/react-native/) is just as important both to Facebook and the community.

Being renderer-agnostic is an important design constraint of React. It adds some overhead in the internal representations. On the other hand, any improvements to the core translate across platforms.

Having a single programming model lets us form engineering teams around products instead of platforms. So far the tradeoff has been worth it for us.

### Implementation {#implementation}

We try to provide elegant APIs where possible. We are much less concerned with the implementation being elegant. The real world is far from perfect, and to a reasonable extent we prefer to put the ugly code into the library if it means the user does not have to write it. When we evaluate new code, we are looking for an implementation that is correct, performant and affords a good developer experience. Elegance is secondary.

We prefer boring code to clever code. Code is disposable and often changes. So it is important that it [doesn't introduce new internal abstractions unless absolutely necessary](https://youtu.be/4anAwXYqLG8?t=13m9s). Verbose code that is easy to move around, change and remove is preferred to elegant code that is prematurely abstracted and hard to change.

### Optimized for Tooling {#optimized-for-tooling}

Some commonly used APIs have verbose names. For example, we use `componentDidMount()` instead of `didMount()` or `onMount()`. This is [intentional](https://github.com/reactjs/react-future/issues/40#issuecomment-142442124). The goal is to make the points of interaction with the library highly visible.

In a massive codebase like Facebook, being able to search for uses of specific APIs is very important. We value distinct verbose names, and especially for the features that should be used sparingly. For example, `dangerouslySetInnerHTML` is hard to miss in a code review.

Optimizing for search is also important because of our reliance on [codemods](https://www.youtube.com/watch?v=d0pOgY8__JM) to make breaking changes. We want it to be easy and safe to apply vast automated changes across the codebase, and unique verbose names help us achieve this. Similarly, distinctive names make it easy to write custom [lint rules](https://github.com/yannickcr/eslint-plugin-react) about using React without worrying about potential false positives.

[JSX](/docs/introducing-jsx.html) plays a similar role. While it is not required with React, we use it extensively at Facebook both for aesthetic and pragmatic reasons.

In our codebase, JSX provides an unambiguous hint to the tools that they are dealing with a React element tree. This makes it possible to add build-time optimizations such as [hoisting constant elements](https://babeljs.io/docs/en/babel-plugin-transform-react-constant-elements/), safely lint and codemod internal component usage, and [include JSX source location](https://github.com/facebook/react/pull/6771) into the warnings.

### Dogfooding {#dogfooding}

We try our best to address the problems raised by the community. However we are likely to prioritize the issues that people are *also* experiencing internally at Facebook. Perhaps counter-intuitively, we think this is the main reason why the community can bet on React.

Heavy internal usage gives us the confidence that React won't disappear tomorrow. React was created at Facebook to solve its problems. It brings tangible business value to the company and is used in many of its products. [Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) it means that our vision stays sharp and we have a focused direction going forward.

This doesn't mean that we ignore the issues raised by the community. For example, we added support for [web components](/docs/webcomponents.html) and [SVG](https://github.com/facebook/react/pull/6243) to React even though we don't rely on either of them internally. We are actively [listening to your pain points](https://github.com/facebook/react/issues/2686) and [address them](/blog/2016/07/11/introducing-reacts-error-code-system.html) to the best of our ability. The community is what makes React special to us, and we are honored to contribute back.

After releasing many open source projects at Facebook, we have learned that trying to make everyone happy at the same time produced projects with poor focus that didn't grow well. Instead, we found that picking a small audience and focusing on making them happy brings a positive net effect. That's exactly what we did with React, and so far solving the problems encountered by Facebook product teams has translated well to the open source community.

The downside of this approach is that sometimes we fail to give enough focus to the things that Facebook teams don't have to deal with, such as the "getting started" experience. We are acutely aware of this, and we are thinking of how to improve in a way that would benefit everyone in the community without making the same mistakes we did with open source projects before.
