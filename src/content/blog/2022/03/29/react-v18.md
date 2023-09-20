---
title: "React v18.0"
---

March 29, 2022 by [The React Team](/community/team)

---

<Intro>

React 18 est désormais disponible sur npm ! Dans notre dernier billet, nous vous donnions des instructions pas à pas pour [mettre à jour votre appli sur React 18](/blog/2022/03/08/react-18-upgrade-guide). Dans celui-ci, nous faisons un tour d'horizon des nouveautés de cette version, et de ce qu'elles impliquent pour l'avenir…

</Intro>

---

Notre dernière version majeure en date inclut des améliorations automatiques telles que le traitement par lots côté serveur, des API comme `startTransition`, et du rendu streamé côté serveur qui prend même en charge Suspense.

Plusieurs fonctionnalités de React 18 reposent sur notre nouveau moteur de rendu concurrent, une évolution en coulisses qui ouvre la porte à de nouvelles possibilités impressionnantes.  L'utilisation de React en mode concurrent se fait sur demande — elle n'est activée que lorsque vous utilisez une fonctionnalité de concurrence – mais nous pensons qu'elle aura un fort impact sur la façon dont les gens construisent leurs applications.

Nous avons consacré des années de recherche et développement à la prise en charge de la concurrence en React, et nous avons pris grand soin de fournir un chemin d'adoption graduelle pour les utilisateurs existants. L'été dernier, [nous avons constitué le groupe de travail React 18](/blog/2021/06/08/the-plan-for-react-18) afin de récolter les retours d'experts issus de la communauté pour garantir une expérience de mise à jour lisse pour l'ensemble de l'écosystème React.

Au cas où vous seriez passé·e à côté, nous avons largement partagé cette vision à la React Conf 2021 :

* Dans [la plénière d'ouverture](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa), nous avons expliqué en quoi React 18 s'intègre avec notre mission visant à faciliter le développement d'expériences utilisateurs haut de gamme.
* [Shruti Kapoor](https://twitter.com/shrutikapoor08) [a fait une démo d'utilisation des nouveautés de React 18](https://www.youtube.com/watch?v=ytudH8je5ko&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=2)
* [Shaundai Person](https://twitter.com/shaundai) a fait un tour d'horizon du [rendu streamé côté serveur avec Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=3)

Vous trouverez ci-après un tour d'horizon complet de cette nouvelle version, à commencer par le rendu concurrent.

<Note>

Concernant les uti_lisateurs de React Native, React 18 sera livré dans React Native en même temps que la nouvelle architecture de React Native. Pour plus d'informations, regardez la [plénière d'ouverture de React Conf](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s).

</Note>

## Qu'est-ce que « React concurrent » ? {/*what-is-concurrent-react*/}

La nouveauté la plus importante de React 18 tient à quelque chose dont nous espérons que vous n'aurez jamais à vous en soucier : la concurrence. Nous pensons que ce sera largement le cas pour les développeurs d'applications, même si les choses seront sans doute plus nuancées pour les mainteneurs de bibliothèques.

La concurrence n'est pas une fonctionnalité à proprement parler.  C'est un nouveau mécanisme en coulisses qui permet à React de préparer plusieurs versions de votre UI en même temps.  Vous pouvez concevoir la concurrence comme un détail d'implémentation : elle n'a de valeur que par les fonctionnalités qu'elle rend possibles.  Le code de React utilise des techniques sophistiquées telles que les files priorisées et les tampons multiples, mais vous ne trouverez ces notions nulle part dans notre API publique.

Lorsque nous concevons une API, nous essayons d'en masquer les détails d'implémentation pour les développeurs. En tant que développeur React, vous êtes censé·e vous concentrer sur *le résultat* de votre expérience utilisateur souhaitée, tandis que React s'occupe de *comment* fournir cette expérience. Nous n'attendons donc pas des développeurs React qu'ils comprennent comment la concurrence fonctionne sous le capot.

Ceci dit, React concurrent reste plus important qu'un détail d'implémentation traditionnel ; il constitue un nouveau pilier du modèle de rendu central à React. Aussi, bien qu'il ne soit pas très important de savoir comment la concurrence fonctionne, il pourrait être utile de comprendre ce que c'est, au moins en surface.

Un aspect clé de React concurrent, c'est que son processus de rendu est interruptible.  Lorsque vous mettez à jour vers React 18 pour la première fois, avant d'exploiter les fonctionnalités concurrentes, les mises à jour d'état entraînent un rendu de la même façon que dans les précédentes versions de React : au sein d'une unique transaction, synchrone et ininterruptible.  Avec ce rendu synchrone, une fois qu'une mise à jour commence à calculer le rendu, rien ne peut l'interrompre jusqu'à ce que l'utilisateur voie le résultat à l'écran.

Dans un rendu concurrent, ce n'est pas toujours le cas. React est susceptible de démarrer le rendu d'une mise à jour puis de s'arrêter en plein milieu, pour continuer plus tard. Il pourrait même abandonner complètement le rendu en cours. React garantit que l'UI qui apparaîtra sera cohérente, même si un rendu a été interrompu.  Pour y parvenir, il attend la fin du rendu pour exécuter les mutations du DOM, une fois que l'ensemble de l'arbre a donc été évalué.  Grâce à ça, React peut préparer de nouveaux écrans en arrière-plan, sans bloquer le *thread* principal. Ça signifie que l'UI peut rester réactive aux saisies utilisateur, même si React est en plein dans une tâche de rendu massive, ce qui préserve une expérience utilisateur fluide.

Autre exemple : l'état réutilisable. React concurrent peut retirer des sections entières d'UI de l'écran pour les rajouter plus tard, tout en réutilisant leur état précédent. Lorsqu'un utilisateur clique par exemple sur un nouvel onglet pour revenir ensuite sur celui qui était actif auparavant, React devrait pouvoir en restaurer l'état. Nous prévoyons d'ajouter dans une prochaine version mineure un nouveau composant `<Offscreen>` qui implémente cette approche.  Vous pourrez aussi vous en servir pour préparer de nouvelles UI en arrière-plan afin qu'elles soient déjà prêtes lorsque l'utilisateur demandera leur affichage.

Le rendu concurrent est un nouvel outil puissant de React, et la plupart des nouvelles fonctionnalités sont conçues pour en tirer avantage, y compris Suspense, les transitions et le rendu streamé côté serveur. Mais React 18 n'est que le début de ce que nous comptons construire sur cette base.

## Adoption graduelle des fonctionnalités concurrentes {/*gradually-adopting-concurrent-features*/}

Techniquement, le rendu concurrent constitue une rupture de compatibilité ascendante *(breaking change, NdT)*. Dans la mesure où un rendu concurrent est interruptible, les composants se comportent d'une façon légèrement différente lorsqu'il est activé.

Pour nos tests, nous avons migré des milliers de composants sur React 18. Nous avons constaté que presque tous les composants existants continuent à marcher avec le rendu concurrent, sans rien avoir besoin d'y changer.  Cependant, certains d'entre eux risquent de nécessiter un effort supplémentaire de migration. Même si ces changements sont généralement mineurs, vous pourrez quand même les apporter à votre rythme. Le nouveau comportement de rendu de React 18 **n'est activé que dans les parties de votre appli qui utilisent les nouvelles fonctionnalités**.

La stratégie générale de mise à jour consiste à faire tourner votre application avec React 18 sans casser le code existant. Vous pouvez alors commencer à ajouter graduellement des fonctionnalités concurrentes, à votre rythme. Vous pouvez utiliser [`<StrictMode>`](/reference/react/StrictMode) pour vous aider à faire émerger des bugs liés à la concurrence lors du développement. Le mode strict n'a aucun impact sur le comportement en production, mais lors du développement il affichera en console des avertissements supplémentaires, et fera des invocations doubles de fonctions censées être idempotentes (pures).  Ça n'attrapera pas tout, mais ça reste un moyen efficace d'éviter les principaux types d'erreurs.

Après que vous aurez migré sur React 18, vous pourrez commencer à utiliser les fonctionnalités concurrentes immédiatement.  Vous pourrez par exemple utiliser `startTransition` pour naviguer entre les écrans sans bloquer la saisie utilisateur. Ou `useDeferredValue` pour minimiser le nombre de rendus coûteux.

Ceci dit, sur le plus long terme, nous pensons que le principal moyen d'ajouter de la concurrence à votre appli consistera à utiliser une bibliothèque ou un framework gérant directement ces aspects.  La plupart du temps, vous n'aurez pas à utiliser directement les API de concurrence. Par exemple, plutôt que d'appeler `startTransition` chaque fois qu'ils ont besoin de naviguer vers un nouvel écran, les développeurs pourront se reposer sur leur bibliothèque de routage pour enrober automatiquement les navigations dans un tel appel.

Ça prendra sans doute un peu de temps pour que les bibliothèques se mettent à jour afin de prendre en charge la concurrence. Nous avons fourni de nouvelles API pour faciliter cette évolution des bibliothèques. Dans l'intervalle, faites preuve de patience avec les mainteneurs tandis que nous travaillons tous à faire évoluer l'écosystème de React.

Pour en savoir plus, consultez notre précédent billet : [Comment migrer vers React 18](/blog/2022/03/08/react-18-upgrade-guide).

## Suspense dans les frameworks de données {/*suspense-in-data-frameworks*/}

Avec React 18, vous pouvez commencer à utiliser [Suspense](/reference/react/Suspense) pour le chargement de données dans des frameworks orientés comme Relay, Next.js, Hydrogen ou Remix. Il reste techniquement possible d'écrire du code sur-mesure de chargement de données avec Suspense, mais ça reste une statégie généralement déconseillée.

À l'avenir nous exposerons peut-être de nouvelles primitives que vous pourrez utiliser pour accéder à vos données ave Suspense, peut-être sans avoir besoin d'un framework adapté.  Quoi qu'il en soit, Suspense marche le mieux lorsqu'il est profondément intégré dans l'architecture de votre application : dans votre routeur, votre couche de données, et votre environnement de rendu côté serveur.  Du coup, même à long terme, nous estimons que les bibliothèques et frameworks joueront un rôle crucial dans l'écosystème React.

Comme pour les versions précédentes de React, vous pouvez aussi utiliser Suspense pour de la découpe de code *(code splitting, NdT)* coté client avec `React.lazy`.  Mais notre vision pour Suspense a toujours été bien plus large que le seul chargement de code : l'objectif est d'étendre la prise en charge de Suspense afin qu'à terme la même déclaration de contenu de secours Suspense puisse gérer toutes les opérations asynchrones (les chargements de code, de données, d'images, etc.).

## Les Composants Serveur ne sont pas encore prêts {/*server-components-is-still-in-development*/}

Les [**Composants Serveur**](/blog/2020/12/21/data-fetching-with-react-server-components) sont une fonctionnalité future qui permettra aux développeurs de construire des applis à cheval entre le serveur et le client, combinant une interactivité riche côté client avec les performances supérieures du rendu serveur traditionnel.  Les Composants Serveur ne sont pas intrinsèquement liés à React concurrent, mais ils n'atteindront leur plein potentiel qu'avec des fonctionnalités concurrentes telles que Suspense et le rendu streamé côté serveur.

Les Composants Serveur sont encore expérimentaux, mais nous pensons pouvoir sortir une version initiale dans une version mineure 18.x. D'ici là, nous collaborons avec des frameworks comme Next.js, Hydrogen et Remix pour faire avancer ce chantier et le préparer à une adoption plus large.

## Les nouveautés de React 18 {/*whats-new-in-react-18*/}

### Nouvelle fonctionnalité : traitement par lots automatique {/*new-feature-automatic-batching*/}

React regroupe souvent plusieurs mises à jour d'état au sein d'un seul recalcul de rendu pour améliorer les performances : c'est ce qu'on appelle le traitement par lots.  Sans traitement automatique, nous ne regroupions que les mises à jour déclenchées au sein des gestionnaires d'événements React. Celles qui venaient de promesses, de `setTimeout`, de gestionnaires d'événements natifs ou de tout autre contexte n'étaient par défaut pas regroupées par React. Avec le traitement par lots automatique, ces mises à jour seront regroupées… automatiquement :


```js
// Avant : seuls les événements React utilisent le regroupement.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React fera deux rendus, un pour chaque mise à jour d’état
  // (pas de regroupement)
}, 1000);

// Après : les mises à jour dans les timers, promesses, gestionnaires
// d’événements natifs et tout autre contexte utilisent le regroupement.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React ne fera qu’un rendu à la fin (traitement par lot !)
}, 1000);
```

Pour en apprendre davantage, voyez cette discussion sur [le traitement par lots automatique pour entraîner moins de rendus dans React 18](https://github.com/reactwg/react-18/discussions/21).

### Nouvelle fonctionnalité : transitions {/*new-feature-transitions*/}

Les transitions sont un nouveau concept de React qui permettent de distinguer les mises à jour urgentes des non urgentes.

* **Les mises à jour urgentes** reflètent une interaction directe, telle qu'une saisie, un clic, une touche enfoncée, etc.
* **Les mises à jour de transition** amènent l'UI d'une vue vers une autre.

Les mises à jour urgentes telles qu'une saisie, un clic ou un enfoncement de touche nécessitent une réponse immédiate pour correspondre au comportement intuitif d'objets physiques, sans quoi elles semblent « factices ».  Les transitions sont différentes parce que l'utilisateur ne s'attend pas à voir chaque valeur intermédiaire à l'écran.

Lorsque vous sélectionnez par exemple un filtre dans une liste déroulante, vous vous attendez à ce que le bouton de filtrage lui-même réagisse immédiatement au clic. En revanche, les résultats du filtrage pourraient constituer une transition distincte. Un léger délai serait imperceptible et, le plus souvent, attendu.  Et si vous changez à nouveau le filtre avant même que les résultats aient fini leur rendu, seuls les résultats de ce deuxième filtrage vous intéresseraient.

En général, la meilleure expérience utilisateur serait celle où une même saisie utilisateur produit à la fois une mise à jour urgente, et une autre non urgente. Vous pouvez utiliser l'API `startTransition` dans votre gestionnaire d'événement de saisie pour indiquer à Reaxt quelles mises à jour sont urgentes et quelles autres sont des « transitions » :


```js
import { startTransition } from 'react';

// Urgent : afficher le texte saisi
setInputValue(input);

// Toutes les mises à jour enrobées ici sont des transitions
startTransition(() => {
  // Transition : afficher les résultats
  setSearchQuery(input);
});
```

Les mises à jour enrobées par `startTransition` sont traitées comme non urgentes et seront interrompues si des mises à jour plus urgentes, telles que des clics ou touche spressées, arrivent entretemps.  Si une transition est interrompue par l'utilisateur (par exemple en tapant plusieurs caractères d'affilée), React jettera le travail périmé de rendu qui n'avait pas abouti et refera uniquement le rendu de la dernière mise à jour.

* `useTransition` : un Hook pour démarrer des transitions, qui fournit une valeur pour en connaître la progression.
* `startTransition` : une méthode pour démarrer des transitions lorsque le Hook ne peut pas être utilisé.

Les transitions activent le rendu concurrent, afin de permettre l'interruption des mises à jour. Si le contenu suspend à nouveau, les transitions diront à React de continuer à afficher le contenu existant tant que le rendu d'arrière-plan du contenu de transition est en cours (consultez la [RFC de Suspense](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md) pour plus d'infos).

[En apprendre davantage sur les transitions](/reference/react/useTransition).

### Nouvelles fonctionnalités de Suspense {/*new-suspense-features*/}

Suspense lets you declaratively specify the loading state for a part of the component tree if it's not yet ready to be displayed:

```js
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

Suspense makes the "UI loading state" a first-class declarative concept in the React programming model. This lets us build higher-level features on top of it.

We introduced a limited version of Suspense several years ago. However, the only supported use case was code splitting with React.lazy, and it wasn't supported at all when rendering on the server.

In React 18, we've added support for Suspense on the server and expanded its capabilities using concurrent rendering features.

Suspense in React 18 works best when combined with the transition API. If you suspend during a transition, React will prevent already-visible content from being replaced by a fallback. Instead, React will delay the render until enough data has loaded to prevent a bad loading state.

For more, see the RFC for [Suspense in React 18](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md).

### Nouvelles API de rendu côté client et serveur {/*new-client-and-server-rendering-apis*/}

In this release we took the opportunity to redesign the APIs we expose for rendering on the client and server. These changes allow users to continue using the old APIs in React 17 mode while they upgrade to the new APIs in React 18.

#### React DOM Client {/*react-dom-client*/}

These new APIs are now exported from `react-dom/client`:

* `createRoot`: New method to create a root to `render` or `unmount`. Use it instead of `ReactDOM.render`. New features in React 18 don't work without it.
* `hydrateRoot`: New method to hydrate a server rendered application. Use it instead of  `ReactDOM.hydrate` in conjunction with the new React DOM Server APIs. New features in React 18 don't work without it.

Both `createRoot` and `hydrateRoot` accept a new option called `onRecoverableError` in case you want to be notified when React recovers from errors during rendering or hydration for logging. By default, React will use [`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/reportError), or `console.error` in the older browsers.

[See docs for React DOM Client here](/reference/react-dom/client).

#### React DOM Server {/*react-dom-server*/}

These new APIs are now exported from `react-dom/server` and have full support for streaming Suspense on the server:

* `renderToPipeableStream`: for streaming in Node environments.
* `renderToReadableStream`: for modern edge runtime environments, such as Deno and Cloudflare workers.

The existing `renderToString` method keeps working but is discouraged.

[See docs for React DOM Server here](/reference/react-dom/server).

### Nouveaux comportements du mode strict {/*new-strict-mode-behaviors*/}

In the future, we’d like to add a feature that allows React to add and remove sections of the UI while preserving state. For example, when a user tabs away from a screen and back, React should be able to immediately show the previous screen. To do this, React would unmount and remount trees using the same component state as before.

This feature will give React apps better performance out-of-the-box, but requires components to be resilient to effects being mounted and destroyed multiple times. Most effects will work without any changes, but some effects assume they are only mounted or destroyed once.

To help surface these issues, React 18 introduces a new development-only check to Strict Mode. This new check will automatically unmount and remount every component, whenever a component mounts for the first time, restoring the previous state on the second mount.

Before this change, React would mount the component and create the effects:

```
* React mounts the component.
  * Layout effects are created.
  * Effects are created.
```


With Strict Mode in React 18, React will simulate unmounting and remounting the component in development mode:

```
* React mounts the component.
  * Layout effects are created.
  * Effects are created.
* React simulates unmounting the component.
  * Layout effects are destroyed.
  * Effects are destroyed.
* React simulates mounting the component with the previous state.
  * Layout effects are created.
  * Effects are created.
```

[See docs for ensuring reusable state here](/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development).

### Nouveaux Hooks {/*new-hooks*/}

#### useId {/*useid*/}

`useId` is a new hook for generating unique IDs on both the client and server, while avoiding hydration mismatches. It is primarily useful for component libraries integrating with accessibility APIs that require unique IDs. This solves an issue that already exists in React 17 and below, but it's even more important in React 18 because of how the new streaming server renderer delivers HTML out-of-order. [See docs here](/reference/react/useId).

> Note
>
> `useId` is **not** for generating [keys in a list](/learn/rendering-lists#where-to-get-your-key). Keys should be generated from your data.

#### useTransition {/*usetransition*/}

`useTransition` and `startTransition` let you mark some state updates as not urgent. Other state updates are considered urgent by default. React will allow urgent state updates (for example, updating a text input) to interrupt non-urgent state updates (for example, rendering a list of search results). [See docs here](/reference/react/useTransition)

#### useDeferredValue {/*usedeferredvalue*/}

`useDeferredValue` lets you defer re-rendering a non-urgent part of the tree. It is similar to debouncing, but has a few advantages compared to it. There is no fixed time delay, so React will attempt the deferred render right after the first render is reflected on the screen. The deferred render is interruptible and doesn't block user input. [See docs here](/reference/react/useDeferredValue).

#### useSyncExternalStore {/*usesyncexternalstore*/}

`useSyncExternalStore` is a new hook that allows external stores to support concurrent reads by forcing updates to the store to be synchronous. It removes the need for useEffect when implementing subscriptions to external data sources, and is recommended for any library that integrates with state external to React. [See docs here](/reference/react/useSyncExternalStore).

> Note
>
> `useSyncExternalStore` is intended to be used by libraries, not application code.

#### useInsertionEffect {/*useinsertioneffect*/}

`useInsertionEffect` is a new hook that allows CSS-in-JS libraries to address performance issues of injecting styles in render. Unless you’ve already built a CSS-in-JS library we don’t expect you to ever use this. This hook will run after the DOM is mutated, but before layout effects read the new layout. This solves an issue that already exists in React 17 and below, but is even more important in React 18 because React yields to the browser during concurrent rendering, giving it a chance to recalculate layout. [See docs here](/reference/react/useInsertionEffect).

> Note
>
> `useInsertionEffect` is intended to be used by libraries, not application code.

## Comment migrer {/*how-to-upgrade*/}

Lisez [Comment migrer vers React 18](/blog/2022/03/08/react-18-upgrade-guide) pour des instructions pas à pas et pour la liste complète des ruptures de compatibilité ascendante *(breaking changes, NdT)* et des évolutions notables.

## Changelog {/*changelog*/}

### React {/*react*/}

* Add `useTransition` and `useDeferredValue` to separate urgent updates from transitions. ([#10426](https://github.com/facebook/react/pull/10426), [#10715](https://github.com/facebook/react/pull/10715), [#15593](https://github.com/facebook/react/pull/15593), [#15272](https://github.com/facebook/react/pull/15272), [#15578](https://github.com/facebook/react/pull/15578), [#15769](https://github.com/facebook/react/pull/15769), [#17058](https://github.com/facebook/react/pull/17058), [#18796](https://github.com/facebook/react/pull/18796), [#19121](https://github.com/facebook/react/pull/19121), [#19703](https://github.com/facebook/react/pull/19703), [#19719](https://github.com/facebook/react/pull/19719), [#19724](https://github.com/facebook/react/pull/19724), [#20672](https://github.com/facebook/react/pull/20672), [#20976](https://github.com/facebook/react/pull/20976) by [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), and [@sebmarkbage](https://github.com/sebmarkbage))
* Add `useId` for generating unique IDs. ([#17322](https://github.com/facebook/react/pull/17322), [#18576](https://github.com/facebook/react/pull/18576), [#22644](https://github.com/facebook/react/pull/22644), [#22672](https://github.com/facebook/react/pull/22672), [#21260](https://github.com/facebook/react/pull/21260) by [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), and [@sebmarkbage](https://github.com/sebmarkbage))
* Add `useSyncExternalStore` to help external store libraries integrate with React. ([#15022](https://github.com/facebook/react/pull/15022), [#18000](https://github.com/facebook/react/pull/18000), [#18771](https://github.com/facebook/react/pull/18771), [#22211](https://github.com/facebook/react/pull/22211), [#22292](https://github.com/facebook/react/pull/22292), [#22239](https://github.com/facebook/react/pull/22239), [#22347](https://github.com/facebook/react/pull/22347), [#23150](https://github.com/facebook/react/pull/23150) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), and [@drarmstr](https://github.com/drarmstr))
* Add `startTransition` as a version of `useTransition` without pending feedback. ([#19696](https://github.com/facebook/react/pull/19696)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Add `useInsertionEffect` for CSS-in-JS libraries. ([#21913](https://github.com/facebook/react/pull/21913)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Make Suspense remount layout effects when content reappears.  ([#19322](https://github.com/facebook/react/pull/19322), [#19374](https://github.com/facebook/react/pull/19374), [#19523](https://github.com/facebook/react/pull/19523), [#20625](https://github.com/facebook/react/pull/20625), [#21079](https://github.com/facebook/react/pull/21079) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), and [@lunaruan](https://github.com/lunaruan))
* Make `<StrictMode>` re-run effects to check for restorable state. ([#19523](https://github.com/facebook/react/pull/19523) , [#21418](https://github.com/facebook/react/pull/21418)  by [@bvaughn](https://github.com/bvaughn) and [@lunaruan](https://github.com/lunaruan))
* Assume Symbols are always available. ([#23348](https://github.com/facebook/react/pull/23348)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Remove `object-assign` polyfill. ([#23351](https://github.com/facebook/react/pull/23351)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Remove unsupported `unstable_changedBits` API.  ([#20953](https://github.com/facebook/react/pull/20953)  by [@acdlite](https://github.com/acdlite))
* Allow components to render undefined. ([#21869](https://github.com/facebook/react/pull/21869)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Flush `useEffect` resulting from discrete events like clicks synchronously. ([#21150](https://github.com/facebook/react/pull/21150)  by [@acdlite](https://github.com/acdlite))
* Suspense `fallback={undefined}` now behaves the same as `null` and isn't ignored. ([#21854](https://github.com/facebook/react/pull/21854)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Consider all `lazy()` resolving to the same component equivalent. ([#20357](https://github.com/facebook/react/pull/20357)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Don't patch console during first render. ([#22308](https://github.com/facebook/react/pull/22308)  by [@lunaruan](https://github.com/lunaruan))
* Improve memory usage. ([#21039](https://github.com/facebook/react/pull/21039)  by [@bgirard](https://github.com/bgirard))
* Improve messages if string coercion throws (Temporal.*, Symbol, etc.) ([#22064](https://github.com/facebook/react/pull/22064)  by [@justingrant](https://github.com/justingrant))
* Use `setImmediate` when available over `MessageChannel`. ([#20834](https://github.com/facebook/react/pull/20834)  by [@gaearon](https://github.com/gaearon))
* Fix context failing to propagate inside suspended trees. ([#23095](https://github.com/facebook/react/pull/23095)  by [@gaearon](https://github.com/gaearon))
* Fix `useReducer` observing incorrect props by removing the eager bailout mechanism. ([#22445](https://github.com/facebook/react/pull/22445)  by [@josephsavona](https://github.com/josephsavona))
* Fix `setState` being ignored in Safari when appending iframes. ([#23111](https://github.com/facebook/react/pull/23111)  by [@gaearon](https://github.com/gaearon))
* Fix a crash when rendering `ZonedDateTime` in the tree. ([#20617](https://github.com/facebook/react/pull/20617)  by [@dimaqq](https://github.com/dimaqq))
* Fix a crash when document is set to `null` in tests. ([#22695](https://github.com/facebook/react/pull/22695)  by [@SimenB](https://github.com/SimenB))
* Fix `onLoad` not triggering when concurrent features are on. ([#23316](https://github.com/facebook/react/pull/23316)  by [@gnoff](https://github.com/gnoff))
* Fix a warning when a selector returns `NaN`.  ([#23333](https://github.com/facebook/react/pull/23333)  by [@hachibeeDI](https://github.com/hachibeeDI))
* Fix a crash when document is set to `null` in tests. ([#22695](https://github.com/facebook/react/pull/22695) by [@SimenB](https://github.com/SimenB))
* Fix the generated license header. ([#23004](https://github.com/facebook/react/pull/23004)  by [@vitaliemiron](https://github.com/vitaliemiron))
* Add `package.json` as one of the entry points. ([#22954](https://github.com/facebook/react/pull/22954)  by [@Jack](https://github.com/Jack-Works))
* Allow suspending outside a Suspense boundary. ([#23267](https://github.com/facebook/react/pull/23267)  by [@acdlite](https://github.com/acdlite))
* Log a recoverable error whenever hydration fails. ([#23319](https://github.com/facebook/react/pull/23319)  by [@acdlite](https://github.com/acdlite))

### React DOM {/*react-dom*/}

* Add `createRoot` and `hydrateRoot`. ([#10239](https://github.com/facebook/react/pull/10239), [#11225](https://github.com/facebook/react/pull/11225), [#12117](https://github.com/facebook/react/pull/12117), [#13732](https://github.com/facebook/react/pull/13732), [#15502](https://github.com/facebook/react/pull/15502), [#15532](https://github.com/facebook/react/pull/15532), [#17035](https://github.com/facebook/react/pull/17035), [#17165](https://github.com/facebook/react/pull/17165), [#20669](https://github.com/facebook/react/pull/20669), [#20748](https://github.com/facebook/react/pull/20748), [#20888](https://github.com/facebook/react/pull/20888), [#21072](https://github.com/facebook/react/pull/21072), [#21417](https://github.com/facebook/react/pull/21417), [#21652](https://github.com/facebook/react/pull/21652), [#21687](https://github.com/facebook/react/pull/21687), [#23207](https://github.com/facebook/react/pull/23207), [#23385](https://github.com/facebook/react/pull/23385) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), [@gaearon](https://github.com/gaearon), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), [@trueadm](https://github.com/trueadm), and [@sebmarkbage](https://github.com/sebmarkbage))
* Add selective hydration. ([#14717](https://github.com/facebook/react/pull/14717), [#14884](https://github.com/facebook/react/pull/14884), [#16725](https://github.com/facebook/react/pull/16725), [#16880](https://github.com/facebook/react/pull/16880), [#17004](https://github.com/facebook/react/pull/17004), [#22416](https://github.com/facebook/react/pull/22416), [#22629](https://github.com/facebook/react/pull/22629), [#22448](https://github.com/facebook/react/pull/22448), [#22856](https://github.com/facebook/react/pull/22856), [#23176](https://github.com/facebook/react/pull/23176) by [@acdlite](https://github.com/acdlite), [@gaearon](https://github.com/gaearon), [@salazarm](https://github.com/salazarm), and [@sebmarkbage](https://github.com/sebmarkbage))
* Add `aria-description` to the list of known ARIA attributes. ([#22142](https://github.com/facebook/react/pull/22142)  by [@mahyareb](https://github.com/mahyareb))
* Add `onResize` event to video elements. ([#21973](https://github.com/facebook/react/pull/21973)  by [@rileyjshaw](https://github.com/rileyjshaw))
* Add `imageSizes` and `imageSrcSet` to known props. ([#22550](https://github.com/facebook/react/pull/22550)  by [@eps1lon](https://github.com/eps1lon))
* Allow non-string `<option>` children if `value` is provided.  ([#21431](https://github.com/facebook/react/pull/21431)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Fix `aspectRatio` style not being applied. ([#21100](https://github.com/facebook/react/pull/21100)  by [@gaearon](https://github.com/gaearon))
* Warn if `renderSubtreeIntoContainer` is called. ([#23355](https://github.com/facebook/react/pull/23355)  by [@acdlite](https://github.com/acdlite))

### React DOM (Côté serveur) {/*react-dom-server-1*/}

* Add the new streaming renderer. ([#14144](https://github.com/facebook/react/pull/14144), [#20970](https://github.com/facebook/react/pull/20970), [#21056](https://github.com/facebook/react/pull/21056), [#21255](https://github.com/facebook/react/pull/21255), [#21200](https://github.com/facebook/react/pull/21200), [#21257](https://github.com/facebook/react/pull/21257), [#21276](https://github.com/facebook/react/pull/21276), [#22443](https://github.com/facebook/react/pull/22443), [#22450](https://github.com/facebook/react/pull/22450), [#23247](https://github.com/facebook/react/pull/23247), [#24025](https://github.com/facebook/react/pull/24025), [#24030](https://github.com/facebook/react/pull/24030) by [@sebmarkbage](https://github.com/sebmarkbage))
* Fix context providers in SSR when handling multiple requests. ([#23171](https://github.com/facebook/react/pull/23171)  by [@frandiox](https://github.com/frandiox))
* Revert to client render on text mismatch. ([#23354](https://github.com/facebook/react/pull/23354)  by [@acdlite](https://github.com/acdlite))
* Deprecate `renderToNodeStream`. ([#23359](https://github.com/facebook/react/pull/23359)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Fix a spurious error log in the new server renderer. ([#24043](https://github.com/facebook/react/pull/24043)  by [@eps1lon](https://github.com/eps1lon))
* Fix a bug in the new server renderer. ([#22617](https://github.com/facebook/react/pull/22617)  by [@shuding](https://github.com/shuding))
* Ignore function and symbol values inside custom elements on the server. ([#21157](https://github.com/facebook/react/pull/21157)  by [@sebmarkbage](https://github.com/sebmarkbage))

### React DOM (Utilitaires de test) {/*react-dom-test-utils*/}

* Throw when `act` is used in production. ([#21686](https://github.com/facebook/react/pull/21686)  by [@acdlite](https://github.com/acdlite))
* Support disabling spurious act warnings with `global.IS_REACT_ACT_ENVIRONMENT`. ([#22561](https://github.com/facebook/react/pull/22561)  by [@acdlite](https://github.com/acdlite))
* Expand act warning to cover all APIs that might schedule React work. ([#22607](https://github.com/facebook/react/pull/22607)  by [@acdlite](https://github.com/acdlite))
* Make `act` batch updates. ([#21797](https://github.com/facebook/react/pull/21797)  by [@acdlite](https://github.com/acdlite))
* Remove warning for dangling passive effects. ([#22609](https://github.com/facebook/react/pull/22609)  by [@acdlite](https://github.com/acdlite))

### React Refresh {/*react-refresh*/}

* Track late-mounted roots in Fast Refresh. ([#22740](https://github.com/facebook/react/pull/22740)  by [@anc95](https://github.com/anc95))
* Add `exports` field to `package.json`. ([#23087](https://github.com/facebook/react/pull/23087)  by [@otakustay](https://github.com/otakustay))

### Composants Serveur (Expérimental) {/*server-components-experimental*/}

* Add Server Context support. ([#23244](https://github.com/facebook/react/pull/23244)  by [@salazarm](https://github.com/salazarm))
* Add `lazy` support. ([#24068](https://github.com/facebook/react/pull/24068)  by [@gnoff](https://github.com/gnoff))
* Update webpack plugin for webpack 5 ([#22739](https://github.com/facebook/react/pull/22739)  by [@michenly](https://github.com/michenly))
* Fix a mistake in the Node loader. ([#22537](https://github.com/facebook/react/pull/22537)  by [@btea](https://github.com/btea))
* Use `globalThis` instead of `window` for edge environments. ([#22777](https://github.com/facebook/react/pull/22777)  by [@huozhi](https://github.com/huozhi))
