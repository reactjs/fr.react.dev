---
title: "React Labs : ce sur quoi nous bossons – mars 2023"
---

Le 22 mars 2023 par [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Mengdi Chen](https://twitter.com/mengdi_en), [Samuel Susla](https://twitter.com/SamuelSusla), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage) et [Andrew Clark](https://twitter.com/acdlite).

---

<Intro>

Dans les billets React Labs, nous vous parlons de nos projets de recherche et développement actifs.  Depuis notre [dernier bulletin](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022), nous avons fait des progrès significatifs et nous aimerions partager ce que nous avons appris.

</Intro>

---

## React Server Components {/*react-server-components*/}

Les React Server Components (ou RSC) sont une nouvelle architecture applicative conçue par l'équipe React.

Notre premier partage de recherche sur les RSC s'est fait dans un [talk de présentation](/blog/2020/12/21/data-fetching-with-react-server-components) et *via* une [RFC](https://github.com/reactjs/rfcs/pull/188). En résumé, nous présentons un nouveau type de composant — les Composants Serveur — qui sont exécutés en amont et exclus de votre *bundle* JavaScript. Les Composants Serveur peuvent être exécutés pendant le *build*, ce qui leur permet de lire le système de fichiers ou de charger du contenu statique. Ils peuvent aussi être exécuté côté serveur, ce qui permet d'accéder à votre couche de données sans avoir besoin d'une API.  Vous pouvez passer des données *via* les props entre les Composants Serveur et les Composants Client interactifs dans le navigateur.

RSC combine la simplicité du modèle mental requête/réponse, courant dans les applis multi-page *(MPA pour Multi-Page Apps, NdT)* centrées sur le serveur, avec l'interactivité transparente des applis mono-page *(SPA pour Single-Page Apps, NdT)* centrées sur le client, ce qui vous donne le meilleur des deux mondes.

Depuis notre dernier bulletin, nous avons intégré la [RFC des React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) afin de ratifier cette proposition..  Nous avons résolu les problèmes en suspens de la proposition de [conventions de modules React serveur](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md), et atteint un consensus avec nos partenaires concernant la convention `"use client"`.  Ces documents jouent aussi le rôle d'une spécification à respecter par les implémentations compatibles de RSC.

Le plus gros changement survenu tient à l'introduction de [`async` / `await`](https://github.com/reactjs/rfcs/pull/229) comme mécanisme principal de chargement de données dans les Composants Serveur. Nous prévoyons aussi de permettre le chargement de données depuis les clients au moyen d'un nouveau Hook appelé `use` qui repose en interne sur des promesses (`Promise`). Même si nous ne pouvons pas autoriser `async / await` au sein de n'importe quel composant d'une appli 100% côté client, nous prévoyons de le prendre en charge lorsque la structure de votre appli 100% côté client est similaire à celle d'applis basées sur les RSC.

À présent que nous avons suffisamment débroussailé le sujet du chargement de données, nous explorons l'autre direction : l'envoi de données du client vers le serveur, afin que vous puissiez exécuter des modifications de base de données et implémenter des formulaires.  Nous vous permettons pour cela de passer des fonctions d'Actions Serveur à travers la frontière serveur/client, fonctions que le code client peut alors appeler, ce qui fournit une sorte de RPC *(Remote Procedure Call, NdT)* transparent. Les Actions Serveur vous permettent aussi de proposer des formulaires en amélioration progressive pendant le chargement de JavaScript.

Une implémentation des React Server Components a été livrée au travers de [l'*App Router* de Next.js](/learn/start-a-new-react-project#nextjs-app-router).
C'est un bon exemple d'une intégration profonde d'un routeur qui traite les RSC comme une primitive importante, mais ce n'est pas la seule façon de construire un routeur ou un framework compatibles RSC.  Il existe une distinction claire entre les fonctionnalités que permet la spec des RSC, et leur implémentation. Les React Server Components sont pensés comme une spec de composants qui puisse être prise en charge par n'importe quel framework React compatible.

Nous vous conseillons généralement d'utiliser un framework existant, mais si vous devez construire votre propre framework, c'est possible.  Créer votre propre framework compatible RSC n'est pas aussi aisé que nous l'aimerions, principalement en raison d'un exigence d'intégration profonde avec votre *bundler*.  La génération actuelle de *bundlers* est super pour un usage centré sur le client, mais ils n'ont pas été conçus avec une prise en charge de premier plan pour la découpe d'un graphe de modules selon un axe client / serveur.  C'est pourquoi nous avons un partenariat en cours avec les développeurs de *bundlers* afin d'intégrer les primitives nécessaires à RSC.

## Chargement de ressources {/*asset-loading*/}

[Suspense](/reference/react/Suspense) vous permet de spécifier quoi afficher à l'écran pendant que les données ou le code de vos composants sont encore en train de charger. Ça permet à vos utilisateurs de voir progressivement davantage de contenu au cours du chargement de la page, ainsi que pendant les navigations de routage qui chargent davantage de données ou de code.  Ceci dit, du point de vue de l'utilisateur, le chargement de données et le rendu ne suffisent pas à pleinement représenter la disponibilité de nouveau contenu.  Par défaut, les navigateurs chargent les feuilles de style, les polices de caractères et les images indépendamment, ce qui peut entraîner des décalages subits et désagréables de l'affichage *(layout shifts, NdT)*.

Nous travaillons à intégrer pleinement Suspense avec le cycle de vie du chargement des feuilles de styles, fontes et images, afin que React puisse les prendre en compte pour déterminer si le contenu est prêt à être affiché.  Sans rien changer à votre façon d'écrire vos composants React, ces mises à jour produiront un comportement plus cohérent et agréable.  À titre d'optimisation, nous fournirons également un mécanisme manuel de préchargement de ressources telles que les fontes, directement depuis vos composants.

Nous travaillons actuellement sur ces fonctionnalités et nous devrions avoir davantage à vous montrer prochainement.

## Métadonnées des documents {/*document-metadata*/}

Selon la page ou l'écran de votre appli, vous aurez besoin de métadonnées distinctes telles que la balise `<title>`, la description et d'autres balises `<meta>` spécifiques à un écran donné.  En termes de maintenance, conserver cette information à promixité du composant React pour la page ou l'écran tient mieux la route.  Seulement voilà, les balises HTML pour ces métadonnées doivent être dans le `<head>` du document, qui figure généralement à la racine de votre appli.

Pour le moment, les gens utilisent une des deux techniques suivantes pour résoudre ce problème.

La première consiste à faire le rendu d'un composant spécial tierce-partie qui déplace les `<title>`, `<meta>` et autres éléments qu'il contient dans le `<head>` du document. Ça fonctionne pour tous les principaux navigateurs mais de nombreux clients n'exécutent pas JavaScript, comme par exemple les *parsers* Open Graph, de sorte que cette technique n'est pas toujours adaptée.

L'autre technique consiste à faire un rendu côté serveur de la page en deux passes.  On commence par faire le rendu du contenu principal et y collecter toutes les balises concernées. Ensuite, on fait le rendu du `<head>` avec ces balises.  Pour finir, tant le `<head>` que le contenu principal sont envoyés au navigateur.  Cette approche fonctionne, mais elle vous empêche de tirer parti du [rendu serveur *streamé* de React 18](/reference/react-dom/server/renderToReadableStream), puisqu'il vous faut attendre que tout le contenu ait fini son rendu avant d'envoyer le `<head>`.

C'est pourquoi nous ajoutons une prise en charge native du rendu des balises de métadonnées `<title>`, `<meta>` et `<link>` partout dans votre arborescence de composants. Elle fonctionnerait de façon identique dans tous les environnements, y compris du code 100% côté client, du SSR, et à l'avenir les RSC. Nous vous en dirons davantage bientôt.

## Compilateur optimisant pour React {/*react-optimizing-compiler*/}

Since our previous update we've been actively iterating on the design of [React Forget](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#react-compiler), an optimizing compiler for React. We've previously talked about it as an "auto-memoizing compiler", and that is true in some sense. But building the compiler has helped us understand React's programming model even more deeply. A better way to understand React Forget is as an automatic *reactivity* compiler.

The core idea of React is that developers define their UI as a function of the current state. You work with plain JavaScript values — numbers, strings, arrays, objects — and use standard JavaScript idioms — if/else, for, etc — to describe your component logic. The mental model is that React will re-render whenever the application state changes. We believe this simple mental model and keeping close to JavaScript semantics is an important principle in React's programming model.

The catch is that React can sometimes be *too* reactive: it can re-render too much. For example, in JavaScript we don't have cheap ways to compare if two objects or arrays are equivalent (having the same keys and values), so creating a new object or array on each render may cause React to do more work than it strictly needs to. This means developers have to explicitly memoize components so as to not over-react to changes.

Our goal with React Forget is to ensure that React apps have just the right amount of reactivity by default: that apps re-render only when state values *meaningfully* change. From an implementation perspective this means automatically memoizing, but we believe that the reactivity framing is a better way to understand React and Forget. One way to think about this is that React currently re-renders when object identity changes. With Forget, React re-renders when the semantic value changes — but without incurring the runtime cost of deep comparisons.

In terms of concrete progress, since our last update we have substantially iterated on the design of the compiler to align with this automatic reactivity approach and to incorporate feedback from using the compiler internally. After some significant refactors to the compiler starting late last year, we've now begun using the compiler in production in limited areas at Meta. We plan to open-source it once we've proved it in production.

Finally, a lot of people have expressed interest in how the compiler works. We're looking forward to sharing a lot more details when we prove the compiler and open-source it. But there are a few bits we can share now:

The core of the compiler is almost completely decoupled from Babel, and the core compiler API is (roughly) old AST in, new AST out (while retaining source location data). Under the hood we use a custom code representation and transformation pipeline in order to do low-level semantic analysis. However, the primary public interface to the compiler will be via Babel and other build system plugins. For ease of testing we currently have a Babel plugin which is a very thin wrapper that calls the compiler to generate a new version of each function and swap it in.

As we refactored the compiler over the last few months, we wanted to focus on refining the core compilation model to ensure we could handle complexities such as conditionals, loops, reassignment, and mutation. However, JavaScript has a lot of ways to express each of those features: if/else, ternaries, for, for-in, for-of, etc. Trying to support the full language up-front would have delayed the point where we could validate the core model. Instead, we started with a small but representative subset of the language: let/const, if/else, for loops, objects, arrays, primitives, function calls, and a few other features. As we gained confidence in the core model and refined our internal abstractions, we expanded the supported language subset. We're also explicit about syntax we don't yet support, logging diagnostics and skipping compilation for unsupported input. We have utilities to try the compiler on Meta's codebases and see what unsupported features are most common so we can prioritize those next. We'll continue incrementally expanding towards supporting the whole language.

Making plain JavaScript in React components reactive requires a compiler with a deep understanding of semantics so that it can understand exactly what the code is doing. By taking this approach, we're creating a system for reactivity within JavaScript that lets you write product code of any complexity with the full expressivity of the language, instead of being limited to a domain specific language.

## Rendu hors de l'écran {/*offscreen-rendering*/}

Offscreen rendering is an upcoming capability in React for rendering screens in the background without additional performance overhead. You can think of it as a version of the [`content-visiblity` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility) that works not only for DOM elements but React components, too. During our research, we've discovered a variety of use cases:

- A router can prerender screens in the background so that when a user navigates to them, they're instantly available.
- A tab switching component can preserve the state of hidden tabs, so the user can switch between them without losing their progress.
- A virtualized list component can prerender additional rows above and below the visible window.
- When opening a modal or popup, the rest of the app can be put into "background" mode so that events and updates are disabled for everything except the modal.

Most React developers will not interact with React's offscreen APIs directly. Instead, offscreen rendering will be integrated into things like routers and UI libraries, and then developers who use those libraries will automatically benefit without additional work.

The idea is that you should be able to render any React tree offscreen without changing the way you write your components. When a component is rendered offscreen, it does not actually *mount* until the component becomes visible — its effects are not fired. For example, if a component uses `useEffect` to log analytics when it appears for the first time, prerendering won't mess up the accuracy of those analytics. Similarly, when a component goes offscreen, its effects are unmounted, too. A key feature of offscreen rendering is that you can toggle the visibility of a component without losing its state.

Since our last update, we've tested an experimental version of prerendering internally at Meta in our React Native apps on Android and iOS, with positive performance results. We've also improved how offscreen rendering works with Suspense — suspending inside an offscreen tree will not trigger Suspense fallbacks. Our remaining work involves finalizing the primitives that are exposed to library developers. We expect to publish an RFC later this year, alongside an experimental API for testing and feedback.

## Pistage des transitions {/*transition-tracing*/}

The Transition Tracing API lets you detect when [React Transitions](/reference/react/useTransition) become slower and investigate why they may be slow. Following our last update, we have completed the initial design of the API and published an [RFC](https://github.com/reactjs/rfcs/pull/238). The basic capabilities have also been implemented. The project is currently on hold. We welcome feedback on the RFC and look forward to resuming its development to provide a better performance measurement tool for React. This will be particularly useful with routers built on top of React Transitions, like the [Next.js App Router](/learn/start-a-new-react-project#nextjs-app-router).

* * *
In addition to this update, our team has made recent guest appearances on community podcasts and livestreams to speak more on our work and answer questions.

* [Dan Abramov](https://twitter.com/dan_abramov) and [Joe Savona](https://twitter.com/en_JS) were interviewed by [Kent C. Dodds on his YouTube channel](https://www.youtube.com/watch?v=h7tur48JSaw), where they discussed concerns around React Server Components.
* [Dan Abramov](https://twitter.com/dan_abramov) and [Joe Savona](https://twitter.com/en_JS) were guests on the [JSParty podcast](https://jsparty.fm/267) and shared their thoughts about the future of React.

Thanks to [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Dave McCabe](https://twitter.com/mcc_abe), [Luna Wei](https://twitter.com/lunaleaps), [Matt Carroll](https://twitter.com/mattcarrollcode), [Sean Keegan](https://twitter.com/DevRelSean), [Sebastian Silbermann](https://twitter.com/sebsilbermann), [Seth Webster](https://twitter.com/sethwebster), and [Sophie Alpert](https://twitter.com/sophiebits) for reviewing this post.

Thanks for reading, and see you in the next update!
