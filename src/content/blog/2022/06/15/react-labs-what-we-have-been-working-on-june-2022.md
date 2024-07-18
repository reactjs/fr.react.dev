---
title: "React Labs : ce sur quoi nous bossons – juin 2022"
author:  Andrew Clark, Dan Abramov, Jan Kassens, Joseph Savona, Josh Story, Lauren Tan, Luna Ruan, Mengdi Chen, Rick Hanlon, Robert Zhang, Sathya Gunasekaran, Sebastian Markbage et Xuan Huang
date: 2022/06/15
description: React 18 a pris des années, mais il était porteur de précieuses leçons pour l'équipe React.  Sa sortie était l'aboutissement de nombreuses années de recherche, en explorant de nouvelles voies.  Certaines de ces tentatives ont réussi ; mais bien davantage se sont révélées des impasses qui nous ont toutefois fourni de nouvelles pistes.  Une des leçons que nous en avons tirées, c'est qu'il est frustrant pour la communauté d'attendre la sortie de nouvelles fonctionnalités sans que nous communiquions sur nos travaux.

---

Le 15 juin 2022 par [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Jan Kassens](https://twitter.com/kassens), [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Luna Ruan](https://twitter.com/lunaruan), [Mengdi Chen](https://twitter.com/mengdi_en), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Zhang](https://twitter.com/jiaxuanzhang01), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage) et [Xuan Huang](https://twitter.com/Huxpro)

---

<Intro>

[React 18](/blog/2022/03/29/react-v18) a pris des années, mais il était porteur de précieuses leçons pour l'équipe React.  Sa sortie était l'aboutissement de nombreuses années de recherche, en explorant de nouvelles voies.  Certaines de ces tentatives ont réussi ; mais bien davantage se sont révélées des impasses qui nous ont toutefois fourni de nouvelles pistes.  Une des leçons que nous en avons tirées, c'est qu'il est frustrant pour la communauté d'attendre la sortie de nouvelles fonctionnalités sans que nous communiquions sur nos travaux.

</Intro>

---

Nous avons généralement un certain nombre de projets en cours à tout instant, qui vont des plus expérimentaux à ceux déjà clairement spécifiés. À partir de maintenant, nous souhaitons partager régulièrement avec la communauté des informations sur nos travaux en cours au sein de ces projets.

Évitons toutefois les attentes infondées : il ne s'agit pas d'une feuille de route avec une chronologie définie.  Nombre de ces projets sont en phase de recherche active et ne permettent pas la définition d'une date concrète de sortie.  Ils pourraient même ne jamais voir le jour sous leur forme actuelle, selon les enseignements qu'on en tirera.  En revanche, nous souhaitons vous partager les problématiques qui nous occupent en ce moment, et ce que nous avons appris jusqu'ici.

## Composants Serveur {/*server-components*/}

Nous avons annoncé une [démo expérimentale des React Server Components](/blog/2020/12/21/data-fetching-with-react-server-components) (RSC) en décembre 2020. Depuis lors, nous avons travaillé à en finaliser les dépendances dans React 18, et à implémenter les évolutions inspirées par leur expérimentation.

Nous avons notamment abandonné l'idée de versions dédiées de bibliothèques d'E/S (ex. react-fetch), pour plutôt adopter un modèle à base d'async/await pour une meilleure compatibilité. Ça ne bloque pas en soit la sortie des RSC parce que vous pouvez aussi utiliser des routeurs pour le chargement de données.  Autre évolution : nous avons délaissé l'approche à base d'extension de fichiers au profit [d'annotations](https://github.com/reactjs/rfcs/pull/189#issuecomment-1116482278).

Nous collaborons avec Vercel et Shopify pour unifier la prise en charge de *bundlers* pour viser une sémantique partagée avec Webpack et Vite. D'ici la sortie, nous souhaitons nous assurer que la sémantique des RSC sera la même à travers tout l'écosystème de React.  C'est le principal point bloquant pour arriver à une version stable.

## Chargement de ressources {/*asset-loading*/}

À l'heure actuelle, les ressources telles que les scripts, styles externes, fontes et images sont généralement pré-chargées ou chargées au moyen de systèmes extérieurs. Ça peut s'avérer délicat à coordonner entre des environnements tels que le streaming, les Composants Serveur et d'autres encore.

Nous explorons la possibilité d'ajouter des API pour précharger ou charger des ressources externes dédoublonnées au travers de React, pour fonctionner dans tous les environnements React.

Nous travaillons également à les prendre en charge dans Suspense, de sorte que vous pourriez avoir des images, CSS et fontes qui bloquent l'affichage le temps de leur chargement, mais qui ne bloquent pas le streaming ou les rendus concurrents.  Ça peut aider à éviter [« l'effet popcorn »](https://twitter.com/sebmarkbage/status/1516852731251724293) qui découle de l'apparition éparpillée d'éléments visuels et des décalages visuels à répétition qui les accompagnent.

## Optimisations du rendu côté serveur {/*static-server-rendering-optimizations*/}

La génération de site statique *(SSG pour Static Site Generation, NdT)* et la regénération statique incrémentale *(ISR pour Incremental Static Regeneration, NdT)* sont deux super façons d'améliorer la performance de pages qui peuvent être mises en cache, mais nous pensons pouvoir ajouter des fonctionnalités pour améliorer la performance de rendu côté serveur dynamique *(SSR pour Server Side Rendering, NdT)* — en particulier lorsque l'essentiel mais pas l'intégralité du contenu peut être mis en cache.  Nous explorons plusieurs approches d'optimisation du rendu côté serveur qui reposent sur de la compilation et des passes statiques.

## Compilateur optimisant pour React {/*react-compiler*/}

Nous avons donné un [premier aperçu](https://www.youtube.com/watch?v=lGEMwh32soc) de React Forget à la React Conf 2021. C'est un compilateur qui génère automatiquement l'équivalent d'appels à `useMemo` et `useCallback` pour minimiser le coût des nouveaux rendus, tout en maintenant le modèle de programmation de React.

Nous avons récemment terminé une réécriture de ce compilateur afin qu'il soit plus fiable et plus malin.  Cette nouvelle architecture nous permet d'analyser et de mémoïser des motifs complexes tels que le recours à des [mutations locales](/learn/keeping-components-pure#local-mutation-your-components-little-secret), ce qui ouvre la voie à de nombreuses nouvelles opportunités d'optimisation en phase de compilation, bien au-delà de simplement équivaloir à des appels judicieux de Hooks de mémoïsation.

Nous travaillons aussi sur un bac à sable permettant d'explorer plusieurs aspects du compilateur. Même si l'objectif premier du bac à sable est de faciliter le développement du compilateur, nous pensons qu'il vous permettra aussi de l'essayer plus simplement et de bâtir votre intuition quant à ses capacités. Il permet de mieux saisir le fonctionnement interne du compilateur, et affiche en temps réel la sortie du compilateur au fil de votre saisie. Nous le livrerons en même temps que le compilateur lui-même.

## Hors-écran {/*offscreen*/}

Aujourd'hui, si vous souhaitez masquer puis afficher un composant, vous avez deux options. La première consiste à l'ajouter ou le retirer totalement de l'arbre. Le souci de cette approche, c'est que l'état de votre UI est perdu à chaque démontage, y compris l'état stocké dans le DOM, tel que la position de défilement.

L'autre approche consiste à conserver le composant monté, mais à basculer sa visibilité avec CSS.  Ça préserve l'état de votre UI mais ça nuit aux performances, car React doit continuer à faire le rendu du composant masqué et de tous ses enfants dès qu'une mise à jour est déclenchée.

Le hors-écran nous propose une troisième voie : masquer l'UI visuellement, mais en déprioriser le contenu.  L'idée est similaire à la propriété CSS `content-visibility` : lorsque le contenu est masqué, il n'a pas besoin de rester en phase avec le reste de l'UI. React peut différer son travail de rendu jusqu'à ce que le reste de l'appli soit au repos, ou jusqu'à ce que le contenu redevienne visible.

Le hors-écran est une capacité de bas niveau qui ouvre la voie à plusieurs fonctionnalités de plus haut niveau. À l'instar d'autres fonctionnalités concurrentes de React telles que `startTransition`, vous n'aurez la plupart du temps pas à interagir directement avec l'API de gestion hors-écran, ce sera plutôt traité au niveau framework, selon leur stratégie, pour permettre des choses comme :

* Des **transition instantanées**. Certains frameworks de routage préchargent déjà les données pour accélérer les navigations ultérieures, par exemple au survol d'un lien. Avec le hors-écran, ils pourraient même précalculer en arrière-plan le rendu du prochain écran.
* Un **état réutilisable**. Dans le même esprit, lors de la navigation entre des routes ou des onglets, vous pourriez tirer parti du hors-écran pour préserver l'état de l'écran précédent afin de pouvoir revenir exactement là où vous en étiez.
* Du **rendu virtualisé de liste**.  Lors de l'affichage de grandes listes d'éléments, les systèmes de listes virtualisées précalculent le rendu de lignes supplémentaires à celles actuellement visibles. Le hors-écran permettrait de faire ces calculs anticipés avec une priorité inférieure à celle des éléments visibles de la liste.
* Du **contenu d'arrière-plan**. Nous explorons une possibilité associée de dépriorisation du contenu en arrière-plan sans avoir à le masquer, comme dans le cas de boîtes de dialogue modales.

## Pistage des transitions {/*transition-tracing*/}

React propose actuellement deux outils de profilage. Le [profileur d'origine](https://fr.legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) affiche un résumé de tous les commits durant la session de profilage. Pour chaque commit, il affiche également tous les composants qui ont fait un rendu, et le temps que ça leur a pris. Nous avons aussi une version beta d'un [Timeline Profiler](https://github.com/reactwg/react-18/discussions/76) arrivé dans React 18 qui indique quand les composants planifient des mises à jour et quand React les traite. Ces deux outils aident les développeurs à identifier l'origine des problèmes de performances dans leur code.

Nous avons réalisé que pour les développeurs, simplement savoir quels commits ou composants sont lents, sans davantage de contexte, n'est pas très utile. Ils préfèreraient savoir quelle est la véritable cause des commits lents. Les développeurs veulent également pouvoir pister le travail résultant d'interactions spécifiques (ex. un clic sur un bouton, le chargement initial ou une navigation) pour repérer les régressions de performances éventuelles et comprendre pourquoi l'interaction est lente et comment y remédier.

Nous avions déjà essayé de répondre à ce besoin en ajoutant une [API de pistage d'interaction](https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16), mais sa conception avait des problèmes de fond qui en réduisaient la précision et pouvaient même rater la fin d'une interaction. En conséquence, nous avons finalement [retiré cette API](https://github.com/facebook/react/pull/20037).

Nous travaillons sur une nouvelle version de l'API de pistage d'interactions (appelée pour le moment *Transition Tracing* parce qu'elle est déclenchée par `startTransition`) qui résout ces problèmes.

## Nouvelles docs React {/*new-react-docs*/}

Nous sommes en train d'écrire une section très détaillée sur les Effets, puisque vous nous avez souvent dit que c'était un des sujets les plus délicats à maîtriser pour les utilisateurs de React tant novices que chevronnés. La première page de la série s'appelle [Synchroniser grâce aux Effets](/learn/synchronizing-with-effects), et vous en verrez d'autres dans les prochaines semaines.  Lorsque nous avons commencé cette section sur les Effets, nous avons réalisé que de nombreuses approches usuelles utilisant les Effets peuvent être simplifiées en ajoutant une nouvelle primitive à React. Nous avons partagé nos premières réflexions à ce sujet dans la [RFC pour useEvent](https://github.com/reactjs/rfcs/pull/220). Elle en est aux premiers stades de la recherche, et nous itérons sur le concept. Nous apprécions les commentaires de la communauté dans la RFC jusqu'ici, ainsi que les [retours](https://github.com/reactjs/reactjs.org/issues/3308) et contributions sur le chantier en cours de la nouvelle documentation.  Nous aimerions notamment remercier [Harish Kumar](https://github.com/harish-sethuraman) pour avoir envoyé ou revu de nombreuses améliorations à l'implémentation du nouveau site web.

*Merci à [Sophie Alpert](https://twitter.com/sophiebits) pour avoir révisé ce billet !*
