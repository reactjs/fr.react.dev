---
title: "React Labs : ce sur quoi nous bossons – février 2024"
author: Joseph Savona, Ricky Hanlon, Andrew Clark, Matt Carroll et Dan Abramov
date: 2024/02/15
description: Dans les billets React Labs, nous vous parlons de nos projets de recherche et développement actifs.  Depuis notre dernier bulletin, nous avons fait des progrès significatifs et nous aimerions partager ce que nous avons appris.
---

Le 15 février 2024 par [Joseph Savona](https://twitter.com/en_JS), [Ricky Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), [Matt Carroll](https://twitter.com/mattcarrollcode) et [Dan Abramov](https://twitter.com/dan_abramov).

---

<Intro>

Dans les billets React Labs, nous vous parlons de nos projets de recherche et développement actifs.  Depuis notre [dernier bulletin](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023), nous avons fait des progrès significatifs et nous aimerions partager ce que nous avons appris.

</Intro>

<Note>

La React Conf 2024 est prévue pour les 15–16 mai à Henderson, Nevada ! Si vous avez l'intention de participer à la React Conf en personne, vous pouvez [participer à un tirage au sort](https://forms.reform.app/bLaLeE/react-conf-2024-ticket-lottery/1aRQLK) jusqu’au 28 février.

Pour en savoir plus sur les billets, la diffusion gratuite en ligne, les partenariats et tout le reste, consultez [le site web de la React Conf](https://conf.react.dev).

</Note>

---

## React Compiler {/*react-compiler*/}

React Compiler n'en est plus au stade du projet de recherche : le compilateur gère désormais la production d'instagram.com, et nous travaillons à son utilisation sur d'autres propriétés de Meta, ainsi qu'à la préparation de sa première version *open source*.

Comme nous l'évoquions dans notre [précédent bulletin](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler), il arrive *parfois* que React fasse trop de rendus lorsqu'un état change. Depuis le début, notre solution pour ce type de cas reposait sur une mémoïsation manuelle. En termes de nos API actuelles, ça implique d'utiliser [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback) et [`memo`](/reference/react/memo) pour peaufiner manuellement la quantité de rendus qu'opère React lorsqu'un état change.  Mais la mémoïsation manuelle n'est pas sans défauts.  Elle encombre notre code, est une source fréquente d'erreurs, et nécessite du travail supplémentaire pour être tenue à jour.

La mémoïsation manuelle constituait un compromis acceptable, mais nous n'en étions pas satisfaits.  Nous imaginons un React qui ne referait *automatiquement* que le rendu ciblé des seules parties de l'UI concernées lorsqu'un état change, *sans compromettre le modèle mental au cœur de React*.  Nous estimons que l'approche de React — considérer l'UI comme une simple fonction de l'état, en utilisant les valeurs et idiômes classiques de JavaScript — est la clé de sa facilité d'accès pour un grand nombre de développeur·ses.  C'est pourquoi nous avons investi dans la construction d'un compilateur optimisant pour React.

JavaScript est un langage notoirement difficile à optimiser, en raison de ses règles souples et de sa nature dynamique.  React Compiler est capable de compiler du code de façon fiable en modélisant à la fois les règles de JavaScript *et* les « règles de React ». Par exemple, les composants React doivent être idempotents — ils doivent renvoyer la même valeur pour les mêmes entrées — et ne peuvent pas modifier leurs props ou leurs valeurs d'état. Ces règles limitent ce que les développeur·ses peuvent faire et permettent de façonner un espace sécurisé dans lequel le compilateur peut appliquer ses optimisations.

Bien entendu, nous comprenons que les développeur·ses font parfois des entorses aux règles, mais notre objectif reste de permettre à React Compiler de fonctionner sans ajustement sur la plus grande partie de code possible. Le compilateur tente de détecter les morceaux de code qui ne suivraient pas strictement les règles de React, et selon le cas compilera le code (lorsque c'est fiable) ou sautera la compilation (en cas de doute). Nous le testons sur la base de code énorme et très variée de Meta afin de nous aider à valider cette approche.

Pour les développeur·ses qui souhaitent s'assurer que leur code respecte bien les règles de React, nous conseillons [d'activer le Mode Strict](/reference/react/StrictMode) et de [configurer le plugin ESLint pour React](/learn/editor-setup#linting). Ces outils aident à repérer des bugs subtils dans votre code React, améliorant ainsi la qualité de vos applications dès aujourd'hui tout en les préparant aux fonctionnalités à venir telles que React Compiler. Nous travaillons également à une documentation consolidée des règles de React et à des mises à jour de notre plugin ESLint pour aider les équipes à comprendre ces règles et les appliquer pour créer des applis plus robustes.

Pour voir le compilateur en action, vous pouvez regarder notre [présentation de l'automne dernier](https://www.youtube.com/watch?v=qOQClO3g8-Y). Lors de cette présentation, nous avions de premières données expérimentales suite à nos essais du React Compiler sur une page d'instagram.com.  Depuis, nous avons déployé le compilateur en production sur l'ensemble de ce site.  Nous avons aussi étendu notre équipe pour accélérer son déploiement sur d'autres propriétés de Meta et en *open source*.  Nous avons hâte pour la suite et nous aurons plein de choses à vous dire dans les prochains mois.

## Actions {/*actions*/}

Nous avions [précédemment parlé](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) de notre exploration de solutions pour envoyer des données du client au serveur au travers des Actions Serveur, afin que vous puissiez exécuter des modifications de bases de données et implémenter des formulaires.  Lors du développement des Actions Serveur, nosu avons étendu ces API pour prendre également en charge la gestion de données entièrement côté client.

Nous appelons cette collection plus large de fonctionnalités simplement « Actions ». Les Actions vous permettent de passer une fonction à des éléments DOM tels que [`<form/>`](/reference/react-dom/components/form) :

```js
<form action={search}>
  <input name="query" />
  <button type="submit">Recherche</button>
</form>
```

La fonction `action` peut être synchrone ou asynchrone. Vous pouvez la définir côté client avec du JavaScript classique, ou côté serveur avec la directive [`'use server'`](/reference/rsc/use-server). Lorsque vous utilisez une Action, React gère le cycle de vie de l'envoi de données pour vous, en fournissant des Hooks tels que [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) et [`useActionState`](/reference/react/hooks/useActionState) pour accéder à l'état courant et la réponse à l'action du formulaire.

Par défaut, les Actions sont exécutées au sein d'une [transition](/reference/react/useTransition), ce qui permet de conserver une page interactive pendant leur traitement. Dans la mesure où les Actions autorisent les fonctions asynchrones, nous avons ajouté la possibilité d'utiliser `async/await` dans les transitions. Ça vous permet d'afficher une UI avec l'état `isPending` d'une transition lorsqu'une requête asynchrone telle que `fetch` démarre, et de maintenir cette UI d'attente tout le temps de la mise à jour.

En complément des Actions, nous dévoilons une fonctionnalité appelée [`useOptimistic`](/reference/react/useOptimistic) pour gérer les mises à jour optimistes d'état. Avec ce Hook, vous pouvez appliquer des mises à jour temporaires qui sont automatiquement ajustées lorsque l'état final est ancré.  Pour les Actions, ça vous permet de mettre le client dans son état final de façon optimiste, en supposant donc que l'envoi aura réussi, mais de vous recaler à terme sur la donnée renvoyée par le serveur.  Ça fonctionne avec du `async`/`await` classique, de sorte que le comportement est identique que vous utilisiez `fetch` côté client ou des Actions Serveur depuis le serveur.

Les auteur·es de bibliothèques peuvent implémenter leurs propres props `action={fn}` dans leurs composants, en combinaison avec `useTransition`. Nous souhaitons que les bibliothèques puissent adopter cette approche à base d'Actions lorsqu'elles conçoivent l'API de leurs composants, afin de fournir une expérience cohérente aux développeur·ses React. Si par exemple votre bibliothèque fournit un composant `<Calendar onSelect={eventHandler}>`, envisagez de proposer aussi une API `<Calendar selectAction={action}>`.

Même si nous nous sommes d'abord concentrés sur les Actions Serveur pour le transfert de données entre client et serveur, notre philosophie pour React consiste à fournir un modèle de programmation unifié pour toutes les plateformes et tous les environnements.  Chaque fois que posssible, si nous ajoutons une fonctionnalité côté client nous essayons de la faire fonctionner également côté serveur, et réciproquement.  Cette philosophie nous permet de créer un jeu unique d'API qui fonctionnent où que votre appli s'exécute, ce qui facilite sa migration ultérieure vers d'autres environnements.

Les Actions sont désormais disponibles sur le canal de livraison Canary, et feront partie de la prochaine version stable de React.

## Nouvelles fonctionnalités dans React Canary {/*new-features-in-react-canary*/}

Nous avons proposé les [React Canaries](/blog/2023/05/03/react-canaries) comme une option pour adopter de nouvelles fonctionnalités stables au cas par cas, dès que leur conception est quasi-bouclée, sans avoir besoin d'attendre qu'elles apparaissent dans une version stable.

Les Canaries changent la façon dont nous développons React. Par le passé, chaque fonctionnalité était conçue, testée et construite en privé chez Meta, de sorte que nos utilistaurs ne voyaient que le produit final, peaufiné, dans une version du canal Stable.  Avec les Canaries, nous construisons davantage en public, avec l'aide de la communauté, pour finaliser des fonctionnalités que nous partageons au travers de la série de bulletins React Labs.  Vous entendez ainsi parler des nouvelles fonctionnalités plus tôt, au fil de leur finalisation plutôt qu'une fois qu'elles sont totalement terminées.

Les Composants Serveur, le Chargement de ressources, les Métadonnées de documents et les Actions sont autant de fonctionnalités disponibles dans React Canary, et nous avons ajouté de la documentation pour ces fonctionnalités sur fr.react.dev :

- **Directives** : [`"use client"`](/reference/rsc/use-client) et [`"use server"`](/reference/rsc/use-server) sont des marqueurs de *bundling* conçus pour les frameworks React full-stack.  Ils indiquent des « points de césure » entre deux environnements : `"use client"` indique au *bundler* de générer une balise `<script>` (comme les [îles Astro](https://docs.astro.build/fr/concepts/islands/#creating-an-island)), tandis que `"use server"` indique au *bundler* de générer un point d'entrée HTTP POST (comme les [mutations tRPC](https://trpc.io/docs/concepts)). Ensemble, elles vous permettent d'écrire des composants réutilisables qui composent l'interactivité du côté client avec la logique associée côté serveur.

- **Métadonnées de documents** : nous avons ajouté une prise en charge native des balises [`<title>`](/reference/react-dom/components/title), [`<meta>`](/reference/react-dom/components/meta) et [`<link>`](/reference/react-dom/components/link) n'importe où dans l'arbre des composants. Ils fonctionnent de la même façon dans tous les environnements, qu'il s'agisse de code entièrement côté client, de SSR ou de RSC. Ils fournissent une fonctionnalité native auparavant proposée par des bibliothèques telles que [React Helmet](https://github.com/nfl/react-helmet).

- **Chargement de ressources** : nous avons intégré Suspense avec le cycle de vie du chargement des ressources telles que des feuilles de styles, des fontes et des scripts, de façon à ce que React les prenne en compte pour déterminer si le contenu d'éléments comme [`<style>`](/reference/react-dom/components/style), [`<link>`](/reference/react-dom/components/link) et [`<script>`](/reference/react-dom/components/script) est prêt à être utilisé.  Nous avons ajouté de nouvelles [API de préchargement de ressources](/reference/react-dom#resource-preloading-apis) comme `preload` et `preinit` pour vous donner un contrôle fin sur les moments de chargement et d'initialisation de ces ressources.

- **Actions** : comme vu plus haut, nous avons ajouté les Actions pour gérer l'envoi de données du client vers le serveur. Vous pouvez ajouter `action` à des éléments tels que [`<form/>`](/reference/react-dom/components/form), accéder à l'état d'envoi avec [`useFormStatus`](/reference/react-dom/hooks/useFormStatus), traiter le résultat avec [`useActionState`](/reference/react/hooks/useActionState) et mettre à jour l'UI de façon optimiste avec [`useOptimistic`](/reference/react/useOptimistic).

Dans la mesure où toutes ces fonctionnalités travaillent ensemble, il serait délicat de les publier sur le canal Stable de façon indépendante.  Livrer les Actions sans les Hooks complémentaire d'accès aux états de formulaire en limiterait l'utilité pratique.  Dévoiler les Composants Serveur sans intégrer les Actions Serveur compliquerait la modification de données côté serveur.

Avant de pouvoir publier un jeu de fonctionnalités sur le canal Stable, nous avons besoin de nous assurer qu'elles forment un tout cohérent, et que les développeur·ses ont tout ce qu'il leur faut pour les utiliser en production. Les React Canaries nous permettent de développer ces fonctionnalités indépendamment, et de livrer les API stables de façon incrémentale tant que le jeu complet de fonctionnalités n'est pas encore prêt.

Le jeu actuel de fonctionnalités dans React Canary est complet et prêt à être livré.

## La prochaine version majeure de React {/*the-next-major-version-of-react*/}

Après plusieurs années d'itération, `react@canary` est désormais prêt à être livré en `react@latest`.  Les nouvelles fonctionnalités listées ci-avant sont compatibles avec tout environnement d'exécution de votre appli, et fournissent tout ce dont vous avez besoin pour un usage en production.  Dans la mesure où le Chargement de ressources et les Métadonnées de document pourraient constituer une rupture de compatibilité ascendante pour certaines applis, la prochaine version de React sera une version majeure : **React 19**.

Il nous reste du travail pour préparer cette livraison. Dans React 19, nous allons aussi ajouter des améliorations demandées de longue date, susceptibles d'introduire des ruptures de compatibilité, telles que la prise en charge des Web Components. Nous nous concentrons désormais sur la livraison de ces changements, la préparation de la version, la finalisation de la documentation des nouveautés, et la publication des annonces sur le contenu final.

Dans les prochains mois, nous en dévoilerons davantage sur tout ce que React 19 apportera, comment adopter les nouveautés côté client, et comment prendre en charge les Composants Serveur.

## Hors-écran (renommé Activité). {/*offscreen-renamed-to-activity*/}

Depuis notre dernier bulletin, nous avons renommé une recherche en cours historiquement appelée « Hors-écran » en « Activité ». Le terme « Hors-écran » impliquait qu'il ne s'agissait que de parties de l'appli qui n'étaient pas visibles, mais lors de nos recherches sur cette fonctionnalité nous avons réalisé qu'il était possible que des parties de l'appli soient visibles et inactives, comme le contenu derrière une modale.  Le nouveau nom reflète mieux le comportement qui consiste à marquer certaines parties de l'appli comme « actives » ou « inactives ».

Activité est toujours en phase de recherche, et nous devons encore finaliser les primitives qu'elle exposera aux développeur·ses de bibliothèques. Nous avons dépriorisé ce point tandis que nous nous concentrons sur la livraison des fonctionnalités qui sont davantage finalisées.

* * *

En complément de ce bulletin, notre équipe est intervenue en conférences ou dans des podcasts pour en dire davantage sur nos travaux et répondre à vos questions.

- [Sathya Gunasekaran](/community/team#sathya-gunasekaran) a parlé de React Compiler lors de la conférence [React India](https://www.youtube.com/watch?v=kjOacmVsLSE)

- [Dan Abramov](/community/team#dan-abramov) a donné une présentation à [RemixConf](https://www.youtube.com/watch?v=zMf_xeGPn6s) intitulée « React dans une autre dimension », qui explorait une histoire alternative de la création des React Server Components et des Actions.

- [Dan Abramov](/community/team#dan-abramov) était l'invité du [podcast JS Party de The Changelog](https://changelog.com/jsparty/311) au sujet des React Server Components

- [Matt Carroll](/community/team#matt-carroll) était l'invité du [podcast Front-End Fire](https://www.buzzsprout.com/2226499/14462424-interview-the-two-reacts-with-rachel-nabors-evan-bacon-and-matt-carroll) pour parler des [Deux Reacts](https://overreacted.io/the-two-reacts/)

Merci à [Lauren Tan](https://twitter.com/potetotes), [Sophie Alpert](https://twitter.com/sophiebits), [Jason Bonta](https://threads.net/someextent), [Eli White](https://twitter.com/Eli_White) et [Sathya Gunasekaran](https://twitter.com/_gsathya) pour leurs relectures attentives de ce billet.

Merci de nous avoir lus, et [à bientôt pour la React Conf](https://conf.react.dev/) !
