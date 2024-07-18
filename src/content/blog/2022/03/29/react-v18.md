---
title: "React v18.0"
author: L’équipe React
date: 2022/03/29
description: React 18 est désormais disponible sur npm ! Dans notre dernier billet, nous vous donnions des instructions pas à pas pour mettre à jour votre appli sur React 18. Dans celui-ci, nous faisons un tour d'horizon des nouveautés de cette version, et de ce qu'elles impliquent pour l'avenir…

---

Le 29 mars 2022 par [l'équipe React](/community/team)

---

<Intro>

React 18 est désormais disponible sur npm ! Dans notre dernier billet, nous vous donnions des instructions pas à pas pour [mettre à jour votre appli sur React 18](/blog/2022/03/08/react-18-upgrade-guide). Dans celui-ci, nous faisons un tour d'horizon des nouveautés de cette version, et de ce qu'elles impliquent pour l'avenir…

</Intro>

---

Notre dernière version majeure en date inclut des améliorations automatiques telles que le traitement par lots côté serveur, des API comme `startTransition`, et du rendu streamé côté serveur qui prend pleinement en charge Suspense.

Plusieurs fonctionnalités de React 18 reposent sur notre nouveau moteur de rendu concurrent, une évolution en coulisses qui ouvre la porte à de nouvelles possibilités impressionnantes.  L'utilisation de React en mode concurrent n'est pas obligatoire — elle n'est activée que lorsque vous utilisez une fonctionnalité de concurrence — mais nous sommes convaincus qu'elle aura un fort impact sur la façon dont les gens construisent leurs applications.

Nous avons consacré des années de recherche et développement à la prise en charge de la concurrence en React, et nous avons pris grand soin de fournir un chemin d'adoption graduelle pour les utilisateurs existants. L'été dernier, [nous avons constitué le groupe de travail React 18](/blog/2021/06/08/the-plan-for-react-18) afin de récolter les retours d'experts issus de la communauté pour garantir une expérience de mise à jour lisse pour l'ensemble de l'écosystème React.

Au cas où vous seriez passé·e à côté, nous avons largement partagé cette vision à la React Conf 2021 :

* Dans [la plénière d'ouverture](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa), nous avons expliqué en quoi React 18 s'intègre avec notre mission visant à faciliter le développement d'expériences utilisateur haut de gamme.
* [Shruti Kapoor](https://twitter.com/shrutikapoor08) [a fait une démo d'utilisation des nouveautés de React 18](https://www.youtube.com/watch?v=ytudH8je5ko&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=2)
* [Shaundai Person](https://twitter.com/shaundai) a fait un tour d'horizon du [rendu streamé côté serveur avec Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=3)

Vous trouverez ci-après un tour d'horizon complet de cette nouvelle version, à commencer par le nouveau mode de rendu concurrent.

<Note>

Concernant les utilisateurs de React Native, React 18 sera livré dans React Native en même temps que la nouvelle architecture de React Native. Pour plus d'informations, regardez la [plénière d'ouverture de la React Conf](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s).

</Note>

## Qu'est-ce que « React concurrent » ? {/*what-is-concurrent-react*/}

La nouveauté la plus importante de React 18 tient à quelque chose dont nous espérons que vous n'aurez jamais à vous en soucier : la concurrence. Nous pensons que ce sera largement le cas pour les développeurs d'applications, même si les choses seront sans doute plus nuancées pour les mainteneurs de bibliothèques.

La concurrence n'est pas une fonctionnalité à proprement parler.  C'est un nouveau mécanisme en coulisses qui permet à React de préparer plusieurs versions de votre UI en même temps.  Vous pouvez concevoir la concurrence comme un détail d'implémentation : elle n'a de valeur que par les fonctionnalités qu'elle rend possibles.  Le code de React utilise des techniques sophistiquées telles que les files priorisées et les tampons multiples, mais vous ne trouverez ces notions nulle part dans notre API publique.

Lorsque nous concevons une API, nous essayons d'en masquer les détails d'implémentation pour les développeurs. En tant que développeur·se React, vous êtes censé·e vous concentrer sur *le résultat* de l'expérience utilisateur que vous souhaitez, tandis que React s'occupe de *comment* fournir cette expérience. Nous n'attendons donc pas des développeurs React qu'ils comprennent comment la concurrence fonctionne sous le capot.

Ceci dit, React concurrent reste plus important qu'un détail d'implémentation traditionnel ; il constitue un nouveau pilier du modèle de rendu central à React. Aussi, bien qu'il ne soit pas très important de savoir comment la concurrence fonctionne, il pourrait être utile de comprendre ce que c'est, au moins en surface.

La clé de React concurrent réside dans son processus de rendu interruptible.  Lorsque vous migrez sur React 18 pour la première fois, avant d'exploiter les fonctionnalités concurrentes, les mises à jour d'état entraînent un rendu de la même façon que dans les précédentes versions de React : au sein d'une unique transaction, synchrone et non interruptible.  Avec ce rendu synchrone, une fois qu'une mise à jour commence à calculer le rendu, rien ne peut l'interrompre jusqu'à ce que l'utilisateur voie le résultat à l'écran.

Dans un rendu concurrent, ce n'est pas toujours le cas. React est susceptible de démarrer le rendu d'une mise à jour puis de s'arrêter en plein milieu, pour continuer plus tard. Il pourrait même abandonner complètement le rendu en cours. React garantit que l'UI qui apparaîtra sera cohérente, même si un rendu a été interrompu.  Pour y parvenir, il attend la fin du rendu pour exécuter les mutations du DOM, une fois que l'ensemble de l'arbre a donc été évalué.  Grâce à ça, React peut préparer de nouveaux écrans en arrière-plan, sans bloquer le *thread* principal. Ça signifie que l'UI peut rester réactive aux saisies utilisateur, même si React est en plein dans une tâche de rendu massive, ce qui préserve la fluidité de l'expérience utilisateur.

Autre exemple : l'état réutilisable. React concurrent peut retirer des sections entières d'UI de l'écran pour les rajouter plus tard, tout en réutilisant leur état précédent. Lorsqu'un utilisateur clique par exemple sur un nouvel onglet pour revenir ensuite sur celui qui était actif auparavant, React devrait pouvoir en restaurer l'état. Nous prévoyons d'ajouter dans une prochaine version mineure un nouveau composant `<Offscreen>` qui implémente cette approche.  Vous pourrez aussi vous en servir pour préparer de nouvelles UI en arrière-plan afin qu'elles soient déjà prêtes lorsque l'utilisateur demandera leur affichage.

Le rendu concurrent est un nouvel outil puissant de React, et la plupart des nouvelles fonctionnalités sont conçues pour en tirer avantage, y compris Suspense, les transitions et le rendu streamé côté serveur. Mais React 18 n'est que le début de ce que nous comptons construire sur cette base.

## Adoption graduelle des fonctionnalités concurrentes {/*gradually-adopting-concurrent-features*/}

Techniquement, le rendu concurrent constitue une rupture de compatibilité ascendante *(breaking change, NdT)*. Dans la mesure où un rendu concurrent est interruptible, les composants se comportent d'une façon légèrement différente lorsqu'il est activé.

Pour nos tests, nous avons migré des milliers de composants sur React 18. Nous avons constaté que presque tous les composants existants continuent à marcher avec le rendu concurrent, sans rien avoir besoin d'y changer.  Cependant, certains d'entre eux risquent de nécessiter un effort supplémentaire de migration. Même si ces changements sont généralement mineurs, vous pourrez quand même les apporter à votre rythme. Le nouveau comportement de rendu de React 18 **n'est activé que dans les parties de votre appli qui utilisent les nouvelles fonctionnalités**.

La stratégie générale de mise à jour consiste à faire tourner votre application avec React 18 sans casser le code existant. Vous pouvez alors commencer à ajouter graduellement des fonctionnalités concurrentes, à votre rythme. Vous pouvez utiliser [`<StrictMode>`](/reference/react/StrictMode) pour vous aider à faire émerger des bugs liés à la concurrence lors du développement. Le Mode Strict n'a aucun impact sur le comportement en production, mais lors du développement il affichera en console des avertissements supplémentaires, et fera des invocations doubles de fonctions censées être idempotentes (pures).  Ça n'attrapera pas tout, mais ça reste un moyen efficace d'éviter les principaux types d'erreurs.

Après que vous aurez migré sur React 18, vous pourrez commencer à utiliser les fonctionnalités concurrentes immédiatement.  Vous pourrez par exemple utiliser `startTransition` pour naviguer entre les écrans sans bloquer la saisie utilisateur. Ou `useDeferredValue` pour minimiser le nombre de rendus coûteux.

Ceci dit, sur le plus long terme, nous pensons que le principal moyen d'ajouter de la concurrence à votre appli consistera à utiliser une bibliothèque ou un framework gérant directement ces aspects.  La plupart du temps, vous n'aurez pas à utiliser directement les API de concurrence. Par exemple, plutôt que d'appeler `startTransition` chaque fois que vous aurez besoin de naviguer vers un nouvel écran, vous pourrez vous reposer sur votre bibliothèque de routage pour enrober automatiquement les navigations dans un tel appel.

Ça prendra sans doute un peu de temps pour que les bibliothèques se mettent à jour afin de prendre en charge la concurrence. Nous avons fourni de nouvelles API pour faciliter cette évolution des bibliothèques. Dans l'intervalle, faites preuve de patience avec les mainteneurs tandis que nous travaillons tou·te·s à faire évoluer l'écosystème de React.

Pour en savoir plus, consultez notre précédent billet : [Comment migrer sur React 18](/blog/2022/03/08/react-18-upgrade-guide).

## Suspense dans les frameworks de données {/*suspense-in-data-frameworks*/}

Avec React 18, vous pouvez commencer à utiliser [Suspense](/reference/react/Suspense) pour le chargement de données dans des frameworks orientés comme Relay, Next.js, Hydrogen ou Remix. Il reste techniquement possible d'écrire du code sur-mesure de chargement de données avec Suspense, mais nous le déconseillons généralement.

À l'avenir nous exposerons peut-être de nouvelles primitives que vous pourrez utiliser pour accéder à vos données avec Suspense, peut-être sans avoir besoin d'un framework adapté.  Quoi qu'il en soit, Suspense marche le mieux lorsqu'il est intégré en profondeur dans l'architecture de votre application : dans votre routeur, votre couche de données, et votre environnement de rendu côté serveur.  Du coup, même à long terme, nous estimons que les bibliothèques et frameworks joueront un rôle crucial dans l'écosystème React.

Comme pour les versions précédentes de React, vous pouvez aussi utiliser Suspense pour de la découpe de code *(code splitting, NdT)* coté client avec `React.lazy`.  Mais notre vision pour Suspense a toujours été bien plus large que le seul chargement de code : l'objectif est d'étendre la prise en charge de Suspense afin qu'à terme la même déclaration de contenu de secours Suspense puisse gérer toutes les opérations asynchrones (les chargements de code, de données, d'images, etc.).

## Les Composants Serveur ne sont pas encore prêts {/*server-components-is-still-in-development*/}

Les [**Composants Serveur**](/blog/2020/12/21/data-fetching-with-react-server-components) sont une fonctionnalité future qui permettra aux développeurs de construire des applis à cheval entre le serveur et le client, combinant une interactivité riche côté client avec les performances supérieures du rendu serveur traditionnel.  Les Composants Serveur ne sont pas intrinsèquement liés à React concurrent, mais ils n'atteindront leur plein potentiel qu'avec des fonctionnalités concurrentes telles que Suspense et le rendu streamé côté serveur.

Les Composants Serveur sont encore expérimentaux, mais nous pensons pouvoir sortir une version initiale dans une version mineure 18.x. D'ici là, nous collaborons avec des frameworks comme Next.js, Hydrogen et Remix pour faire avancer ce chantier et le préparer à une adoption plus large.

## Les nouveautés de React 18 {/*whats-new-in-react-18*/}

### Nouvelle fonctionnalité : traitement par lots automatique {/*new-feature-automatic-batching*/}

React regroupe souvent plusieurs mises à jour d'état au sein d'un seul recalcul de rendu pour améliorer les performances : c'est ce qu'on appelle le traitement par lots.  Sans traitement automatique, nous ne regroupions que les mises à jour déclenchées au sein des gestionnaires d'événements React. Celles qui venaient de promesses, de `setTimeout`, de gestionnaires d'événements natifs ou de tout autre déclencheur n'étaient par défaut pas regroupées par React. Avec le traitement par lots automatique, ces mises à jour seront regroupées… automatiquement :


```js
// Avant : seuls les événements React utilisent le regroupement.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React fera deux rendus, un pour chaque mise à jour d’état
  // (pas de regroupement)
}, 1000);

// Après : les mises à jour dans les timers, promesses, gestionnaires
// d’événements natifs et tout autre déclencheur utilisent le regroupement.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React ne fera qu’un rendu à la fin (traitement par lot !)
}, 1000);
```

Pour en apprendre davantage, voyez cette discussion sur [le traitement par lots automatique pour entraîner moins de rendus dans React 18](https://github.com/reactwg/react-18/discussions/21).

### Nouvelle fonctionnalité : transitions {/*new-feature-transitions*/}

Les transitions sont un nouveau concept de React 18. Elles permettent de distinguer les mises à jour urgentes des non urgentes.

* **Les mises à jour urgentes** reflètent une interaction directe, telle qu'une saisie, un clic, une touche pressée…
* **Les mises à jour de transition** amènent l'UI d'une vue vers une autre.

Les mises à jour urgentes telles qu'une saisie, un clic ou un enfoncement de touche nécessitent une réponse immédiate pour correspondre au comportement intuitif d'objets physiques, sans quoi elles semblent « factices ».  Les transitions sont différentes parce que l'utilisateur ne s'attend pas à voir chaque valeur intermédiaire à l'écran.

Lorsque vous sélectionnez par exemple un filtre dans une liste déroulante, vous vous attendez à ce que le bouton de filtrage lui-même réagisse immédiatement au clic. En revanche, les résultats du filtrage pourraient constituer une transition distincte. Un léger délai serait imperceptible et, le plus souvent, attendu.  Et si vous changez à nouveau le filtre avant même que les résultats aient fini leur rendu, seuls les résultats de ce deuxième filtrage vous intéresseraient.

En général, la meilleure expérience utilisateur serait celle où une même saisie utilisateur produit à la fois une mise à jour urgente, et une autre non urgente. Vous pouvez utiliser l'API `startTransition` dans votre gestionnaire d'événement de saisie pour indiquer à React quelles mises à jour sont urgentes et quelles autres sont des « transitions » :


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

Les mises à jour enrobées par `startTransition` sont traitées comme non urgentes et seront interrompues si des mises à jour plus urgentes, telles que des clics ou touches pressées, arrivent entretemps.  Si une transition est interrompue par l'utilisateur (par exemple en tapant plusieurs caractères d'affilée), React jettera le travail périmé de rendu qui n'avait pas abouti et refera uniquement le rendu de la dernière mise à jour.

* `useTransition` : un Hook pour démarrer des transitions, qui fournit par ailleurs une valeur permettant d'en connaître la progression.
* `startTransition` : une méthode pour démarrer des transitions lorsque le Hook ne peut pas être utilisé.

Les transitions activent le rendu concurrent, afin de permettre l'interruption des mises à jour. Si le contenu suspend à nouveau, les transitions diront à React de continuer à afficher le contenu existant tant que le rendu d'arrière-plan du contenu de transition est en cours (consultez la [RFC de Suspense](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md) pour plus d'infos).

[En apprendre davantage sur les transitions](/reference/react/useTransition).

### Nouvelles fonctionnalités de Suspense {/*new-suspense-features*/}

Suspense vous permet de spécifier déclarativement l'état de chargement d'une partie de l'arbre de composants lorsqu'elle n'est pas prête à être affichée :

```js
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

Suspense fait de « l'état de chargement de l'UI » un concept déclaratif de plein droit dans le modèle de programmation de React. Ça nous permet de bâtir par-dessus des fonctionnalités de plus haut niveau.

Nous avons fourni une version limitée de Suspense il y a déjà plusieurs années. Cependant, le seul cas d'utilisation pris en charge touchait à la découpe de code avec `React.lazy`, et rien n'existait par ailleurs pour le rendu côté serveur.

Dans React 18, nous avons ajouté la prise en charge de Suspense côté serveur, et étendu ses capacités grâce aux fonctionnalités concurrentes.

Suspense dans React 18 fonctionnera le mieux lorsqu'il est utilisé conjointement avec l'API de transitions.  Si vous suspendez au sein d'une transition, React empêchera le remplacement du contenu déjà visible par celui de secours. React diffèrera plutôt le rendu jusqu'à ce qu'assez de données aient été chargées pour éviter un état de chargement indésirable.

Pour en savoir plus, lisez la RFC de [Suspense dans React 18](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md).

### Nouvelles API de rendu côté client et serveur {/*new-client-and-server-rendering-apis*/}

Nous avons saisi l'opportunité de cette version pour repenser les API de rendu que nous exposons pour les côtés client et serveur.  Ces modifications permettent aux utilisateurs de continuer à utiliser les anciennes API en mode React 17, tout en migrant vers les nouvelles API en React 18.

#### React DOM (côté client) {/*react-dom-client*/}

Ces nouvelles API sont exportées depuis `react-dom/client` :

* `createRoot` : une nouvelle méthode créant une racine de rendu dotée de méthodes `render` et `unmount`. Utilisez-la de préférence à `ReactDOM.render`. Les nouvelles fonctionnalités de React 18 ne marcheront pas sans ça.
* `hydrateRoot` : une nouvelle méthode d'hydratation d'une appli ayant bénéficié d'un rendu côté serveur. Utilisez-la de préférence à  `ReactDOM.hydrate`, conjointement aux nouvelles API de React DOM côté serveur. Les nouvelles fonctionnalités de React 18 ne marcheront pas sans ça.

Tant `createRoot` qu'`hydrateRoot` acceptent une nouvelle option baptisée `onRecoverableError` si vous souhaitez être notifié·e lorsque React retombe sur ses pieds suite à des erreurs de rendu ou d'hydratation. Par défaut, React utilisera [`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/reportError) ou `console.error` pour les anciens navigateurs.

[Consultez la documentation de React DOM côté client](/reference/react-dom/client).

#### React DOM (côté serveur) {/*react-dom-server*/}

Ces nouvelles API sont exportées depuis `react-dom/server` et prennent enfin pleinement en charge Suspense côté serveur :

* `renderToPipeableStream` : pour *streamer* dans un environnement Node.
* `renderToReadableStream` : pour les environnements modernes tels que Deno ou les Cloudflare Workers.

La méthode `renderToString` existante reste disponible, mais elle est désormais déconseillée.

[Consultez la documentation de React DOM côté serveur](/reference/react-dom/server).

### Nouveaux comportements du Mode Strict {/*new-strict-mode-behaviors*/}

À l'avenir, nous aimerions ajouter une fonctionnalité permettant à React d'ajouter ou de retirer des sections de l'UI tout en en préservant l'état. Lorsqu'un utilisateur clique par exemple sur un nouvel onglet pour revenir ensuite sur celui qui était actif auparavant, React devrait pouvoir en restaurer l'état.  Pour y parvenir, React démonterait et remonterait ces arbres en utilisant le même état de composant.

Cette fonctionnalité améliorerait d'office les performances des applis React, mais exigerait que les Effets des composants résistent bien à des cycles multiples de démontage + remontage. La plupart des Effets fonctionneront sans modification, mais il peut arriver que le code de certains Effets suppose qu'ils ne seront montés ou démontés qu'une seule fois.

Pour vous aider à débusquer ces soucis, React 18 ajoute une nouvelle vérification en mode développement uniquement dans le Mode Strict. Elle démonte et remonte automatiquement chaque composant, lorsqu'un composant est monté pour la première fois, et restaure l'état précédent au second montage.

Avant cet ajustement, React montait le composant et instanciait ses Effets :

```
* React monte le composant.
  * Les Effets de layout sont créés.
  * Les Effets sont créés.
```

Avec le Mode Strict de React 18, React simule ensuite, en mode développement, le démontage et le remontage du composant :

```
* React monte le composant.
  * Les Effets de layout sont créés.
  * Les Effets sont créés.
* React simule le démontage du composant.
  * Les Effets de layout sont détruits.
  * Les Effets sont détruits.
* React simule le remontage du composant avec son état précédent.
  * Les Effets de layout sont créés.
  * Les Effets sont créés.
```

[En apprendre davantage sur ce comportement du Mode Strict](/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development).

### Nouveaux Hooks {/*new-hooks*/}

#### useId {/*useid*/}

`useId` est un nouveau Hook permettant de générer des identifiants uniques tant côté client que côté serveur, tout en évitant les écarts d'hydratation. Il est surtout utile pour les bibliothèques de composants s'intégrant avec des API d'accessibilité qui reposent sur des ID uniques.  Ça traite un besoin qui existait de longue date dans React, mais c'est d'autant plus important dans React 18 en raison de la façon dont le nouveau moteur de rendu streamé côté serveur peut livrer son HTML dans un ordre non linéaire. [Voir la documentation](/reference/react/useId).

<Note>

`useId` **ne sert pas** à générer des [clés dans une liste](/learn/rendering-lists#where-to-get-your-key). Les clés dans vos listes devraient être générées à partir de vos données.

</Note>

#### useTransition {/*usetransition*/}

`useTransition` et `startTransition` vous permettent d'indiquer que certaines mises à jour d'état ne sont pas urgentes.  Les autres mises à jour d'état sont considérées comme urgentes par défaut.  React permettra aux mises à jour d'état urgentes (par exemple la mise à jour d'un champ de saisie) d'interrompre les mises à jour d'état non urgentes (par exemple le rendu d'une liste de résultats de recherche). [Voir la documentation](/reference/react/useTransition).

#### useDeferredValue {/*usedeferredvalue*/}

`useDeferredValue` vous permet de différer le nouveau rendu d'une partie non urgente de l'arbre de composants.  C'est un peu comme le *debouncing*, mais avec quelques avantages en plus.  Il n'y a pas de délai fixe, aussi React tentera de traiter le rendu différé juste après que le premier rendu aura été affiché à l'écran.  Le rendu différé est interruptible et ne bloque pas les saisies utilisateur. [Voir la documentation](/reference/react/useDeferredValue).

#### useSyncExternalStore {/*usesyncexternalstore*/}

`useSyncExternalStore` est un nouveau Hook qui permet à des sources de données extérieures de prendre en charge des lectures concurrentes en forçant leurs mises à jour à être synchrones.  Il élimine le besoin de recourir à `useEffect` pour implémenter les abonnements à des sources de données extérieures, et il est recommandé pour toute bibliothèque qui s'intègre avec un état extérieur à React. [Voir la documentation](/reference/react/useSyncExternalStore).

<Note>

`useSyncExternalStore` est davantage destiné au code de bibliothèques qu'à du code applicatif.

</Note>

#### useInsertionEffect {/*useinsertioneffect*/}

`useInsertionEffect` est un nouveau Hook qui permet aux bibliothèques de CSS-en-JS de résoudre les problèmes de performances résultant de l'injection de styles lors du rendu. À moins que vous n'ayez déjà écrit une bibliothèque de CSS-en-JS, nous doutons que vous ayez à vous en servir un jour.  Ce Hook sera exécuté après que le DOM a été mis à jour, mais avant que les Effets de layout ne lisent la nouvelle mise en page.  Ça résout un problème de longue date dans React, mais c'est d'autant plus important dans React 18 parce que React cède le contrôle au navigateur lors du rendu concurrent, lui laissant ainsi une opportunité de recalculer la mise en page. [Voir la documentation](/reference/react/useInsertionEffect).

<Note>

`useInsertionEffect`  est davantage destiné au code de bibliothèques qu'à du code applicatif.

</Note>

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
