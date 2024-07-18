---
title: "React Labs : ce sur quoi nous bossons – mars 2023"
author: Joseph Savona, Josh Story, Lauren Tan, Mengdi Chen, Samuel Susla, Sathya Gunasekaran, Sebastian Markbage et Andrew Clark
date: 2023/03/22
description: Dans les billets React Labs, nous vous parlons de nos projets de recherche et développement actifs.  Depuis notre dernier bulletin, nous avons fait des progrès significatifs et nous aimerions partager ce que nous avons appris.
---

Le 22 mars 2023 par [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Mengdi Chen](https://twitter.com/mengdi_en), [Samuel Susla](https://twitter.com/SamuelSusla), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage) et [Andrew Clark](https://twitter.com/acdlite).

---

<Intro>

Dans les billets React Labs, nous vous parlons de nos projets de recherche et développement actifs.  Depuis notre [dernier bulletin](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022), nous avons fait des progrès significatifs et nous aimerions partager ce que nous avons appris.

</Intro>

---

## React Server Components {/*react-server-components*/}

Les React Server Components (ou RSC) sont une nouvelle architecture applicative conçue par l'équipe React.

La première fois que nous avons parlé de nos recherches sur les RSC, c'était dans un [talk de présentation](/blog/2020/12/21/data-fetching-with-react-server-components) et *via* une [RFC](https://github.com/reactjs/rfcs/pull/188). En résumé, nous introduisons un nouveau type de composant — les Composants Serveur — qui sont exécutés en amont et exclus de votre *bundle* JavaScript. Les Composants Serveur peuvent être exécutés pendant le *build*, ce qui leur permet de lire le système de fichiers ou de charger du contenu statique. Ils peuvent aussi être exécutés côté serveur, ce qui permet d'accéder à votre couche de données sans avoir besoin d'une API.  Vous pouvez passer des données *via* les props entre les Composants Serveur et les Composants Client interactifs dans le navigateur.

RSC combine la simplicité du modèle mental requête/réponse, courant dans les applis multi-page *(MPA pour Multi-Page Apps, NdT)* centrées sur le serveur, avec l'interactivité transparente des applis mono-page *(SPA pour Single-Page Apps, NdT)* centrées sur le client, ce qui vous donne le meilleur des deux mondes.

Depuis notre dernier bulletin, nous avons intégré la [RFC des React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) afin de ratifier cette proposition. Nous avons résolu les problèmes en suspens de la proposition de [conventions de modules React serveur](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md), et atteint un consensus avec nos partenaires concernant la convention `"use client"`.  Ces documents jouent aussi le rôle d'une spécification à respecter par les implémentations compatibles de RSC.

Le plus gros changement survenu tient à l'introduction de [`async` / `await`](https://github.com/reactjs/rfcs/pull/229) comme mécanisme principal de chargement de données dans les Composants Serveur. Nous prévoyons aussi de permettre le chargement de données depuis les clients au moyen d'un nouveau Hook appelé `use` qui repose en interne sur des promesses (`Promise`). Même si nous ne pouvons pas autoriser `async / await` au sein de n'importe quel composant d'une appli 100% côté client, nous prévoyons de le prendre en charge lorsque la structure de votre appli 100% côté client est similaire à celle d'applis basées sur les RSC.

À présent que nous avons suffisamment débroussaillé le sujet du chargement de données, nous explorons l'autre direction : l'envoi de données du client vers le serveur, afin que vous puissiez exécuter des modifications de base de données et implémenter des formulaires.  Nous vous permettons pour cela de passer des fonctions d'Actions Serveur à travers la frontière serveur/client, fonctions que le code client peut alors appeler, ce qui fournit une sorte de RPC *(Remote Procedure Call, NdT)* transparent. Les Actions Serveur vous permettent aussi de proposer des formulaires en amélioration progressive pendant le chargement de JavaScript.

Une implémentation des React Server Components a été livrée au travers de [l'*App Router* de Next.js](/learn/start-a-new-react-project#nextjs-app-router).
C'est un bon exemple d'une intégration profonde d'un routeur qui traite les RSC comme une primitive importante, mais ce n'est pas la seule façon de construire un routeur ou un framework compatibles RSC.  Il existe une distinction claire entre les fonctionnalités que permet la spec des RSC, et leur implémentation. Les React Server Components sont pensés comme une spec de composants qui puisse être prise en charge par n'importe quel framework React compatible.

Nous vous conseillons généralement d'utiliser un framework existant, mais si vous devez construire votre propre framework, c'est possible.  Créer votre propre framework compatible RSC n'est pas aussi aisé que nous le voudrions, principalement en raison d'une exigence d'intégration profonde avec votre *bundler*.  La génération actuelle de *bundlers* est super pour un usage centré sur le client, mais ils n'ont pas été conçus avec une prise en charge de premier plan pour la découpe d'un graphe de modules selon un axe client / serveur.  C'est pourquoi nous avons un partenariat en cours avec les développeurs de *bundlers* afin d'intégrer dans leurs outils les primitives nécessaires à RSC.

## Chargement de ressources {/*asset-loading*/}

[Suspense](/reference/react/Suspense) vous permet de spécifier quoi afficher à l'écran pendant que les données ou le code de vos composants sont encore en train de charger. Ça permet à vos utilisateurs de voir progressivement davantage de contenu au cours du chargement de la page, ainsi que pendant les navigations de routage qui chargent davantage de données ou de code.  Ceci dit, du point de vue de l'utilisateur, le chargement de données et le rendu ne suffisent pas à pleinement représenter la disponibilité de nouveau contenu.  Par défaut, les navigateurs chargent indépendamment les feuilles de style, les fontes et les images, ce qui peut entraîner des décalages subits et désagréables de l'affichage *(layout shifts, NdT)*.

Nous travaillons à intégrer pleinement Suspense avec le cycle de vie du chargement des feuilles de styles, fontes et images, afin que React puisse les prendre en compte pour déterminer si le contenu est prêt à être affiché.  Sans rien changer à votre façon d'écrire vos composants React, ces mises à jour produiront un comportement plus cohérent et agréable.  À titre d'optimisation, nous fournirons également un mécanisme manuel de préchargement de ressources telles que les fontes, directement depuis vos composants.

Nous travaillons actuellement sur ces fonctionnalités et nous devrions pouvoir vous en montrer prochainement davantage à ce sujet.

## Métadonnées des documents {/*document-metadata*/}

Selon la page ou l'écran de votre appli, vous aurez besoin de métadonnées distinctes telles que la balise `<title>`, la description et d'autres balises `<meta>` spécifiques à un écran donné.  En termes de maintenance, il est préférable de conserver cette information à proximité du composant React pour la page ou l'écran.  Seulement voilà, les balises HTML pour ces métadonnées doivent être dans le `<head>` du document, qui figure généralement à la racine de votre appli.

Pour le moment, les gens utilisent une des deux techniques suivantes pour résoudre ce problème.

La première consiste à faire le rendu d'un composant spécial tierce-partie qui déplace les `<title>`, `<meta>` et autres éléments qu'il contient dans le `<head>` du document. Ça fonctionne pour tous les principaux navigateurs mais de nombreux clients n'exécutent pas JavaScript, comme par exemple les *parsers* Open Graph, de sorte que cette technique n'est pas toujours adaptée.

L'autre technique consiste à faire un rendu côté serveur en deux passes de la page.  On commence par faire le rendu du contenu principal et y collecter toutes les balises concernées. Ensuite, on fait le rendu du `<head>` avec ces balises.  Pour finir, tant le `<head>` que le contenu principal sont envoyés au navigateur.  Cette approche fonctionne, mais elle vous empêche de tirer parti du [rendu serveur *streamé* de React 18](/reference/react-dom/server/renderToReadableStream), puisqu'il vous faut attendre que tout le contenu ait fini son rendu avant d'envoyer le `<head>`.

C'est pourquoi nous ajoutons une prise en charge native du rendu des balises de métadonnées `<title>`, `<meta>` et `<link>` partout dans votre arborescence de composants. Elle fonctionnerait de façon identique dans tous les environnements, y compris du code 100% côté client, du SSR, et à l'avenir les RSC. Nous vous en dirons davantage bientôt.

## Compilateur optimisant pour React {/*react-optimizing-compiler*/}

Depuis notre dernier bulletin nous avons beaucoup affiné la conception de [React Forget](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#react-compiler), un compilateur optimisant pour React.  Nous en avons parlé comme d'un « compilateur auto-mémoïsant », et c'est vrai dans un sens.  Mais construire ce compilateur nous a aidés à comprendre plus en profondeur le modèle de programmation de React.  Il serait en réalité plus juste de décrire React Forget comme un compilateur de *réactivité* automatique.

L'idée maîtresse de React, c'est que les développeurs définissent leur UI comme une fonction de l'état courant. Vous travaillez avec des valeurs JavaScript brutes — des nombres, des chaînes de caractères, des tableaux, des objets — et vous utilisez des idiômes JavaScript standard — `if`/`else`, `for`, etc. — pour décrire la logique de vos composants.  Le modèle mental veut que React refasse un rendu dès que l'état de votre application change.  Nous aimons ce modèle mental simple, et rester au plus près de la sémantique de JavaScript fait partie intégrante du modèle de programmation de React.

Le souci, c'est que React peut parfois être *trop* réactif : il fait parfois trop de rendus.  Par exemple, en JavaScript nous ne disposons pas d'un mécanisme léger pour déterminer si deux objets ou tableaux sont équivalents (s'ils ont les mêmes clés et valeurs), ce qui fait que créer un nouvel objet ou tableau à chaque rendu peut amener React a faire beaucoup plus de travail que strictement nécessaire.  Ça implique que les développeurs doivent explicitement mémoïser des composants pour ne pas sur-réagir aux modifications.

Notre objectif avec React Forget, c'est de garantir que les applis React ont juste assez de réactivité par défaut : que ces applis ne refont un rendu que lorsque l'état change de façon *signifiante*.  Du point de vue de l'implémentation, ça implique une mémoïsation automatique, mais nous pensons qu'il est plus utile, pour comprendre React et Forget, d'y penser en termes de réactivité.  Aujourd'hui, React refait un rendu quand l'identité d'un objet change. Avec Forget, React ne referait un rendu que si la valeur sémantique change — sans pour autant payer le prix d'une comparaison profonde.

Pour ce qui est de nos progrès concrets, depuis notre dernier bulletin nous avons fortement itéré sur la conception du compilateur afin de l'aligner sur cette approche de réactivité automatique et d'incorporer les retours issus de l'utilisation interne de ce compilateur.  Après d'importantes refontes du compilateur qui ont démarré sur la fin de l'année dernière, nous avons commencé à l'utiliser en production sur des périmètres limités chez Meta.  Nous prévoyons de publier le code source lorsque nous aurons prouvé la valeur ajoutée du compilateur en production.

Pour finir, vous êtes nombreux à avoir exprimé un intérêt pour le fonctionnement interne du compilateur. Nous avons hâte de partager beaucoup plus de détails lorsque nous l'aurons validé et *open-sourcé*.  Voici quelques éléments que nous pouvons d'ores et déjà vous donner :


Le noyau du compilateur est presque entièrement découplé de Babel, et l'API noyau du compilateur se résume grossièrement à un AST de départ en entrée, un AST remanié en sortie (tout en préservant les informations d'emplacement source).  Sous le capot, nous utilisons un circuit sur-mesure de représentation et de transformation du code source afin de faire une analyse sémantique de bas niveau.  Ceci dit, l'interface publique principale du compilateur passera par Babel et d'autres plugins pour les systèmes de *build*.  Afin de faciliter nos tests nous avons actuellement un plugin Babel qui est en fait une surcouche très fine appelant le compilateur pour générer une nouvelle version de chaque fonction et l'utiliser en remplacement.

Lors des refontes du compilateur de ces derniers mois, nous nous sommes concentrés sur l'affinage du modèle noyau de compilation pour garantir que nous pouvions gérer des complexités telles que les conditionnels, les boucles, la réaffectation et les mutations.  Ceci dit, JavaScript offre de nombreuses manières d'exprimer chacun de ces points : `if`/`else`, les ternaires, `for`, `for-in`, `for-of`, etc.  Si nous avions voulu prendre en charge l'intégralité du langage d'entrée de jeu, nous aurions trop retardé le point de validation du modèle noyau.  Nous avons choisi de plutôt commencer avec un sous-ensemble représentatif du language : `let`/`const`, `if`/`else`, les boucles `for`, les objets, les tableaux, les primitives, les appels de fonctions et quelques autres fonctionnalités.  Au fur et à mesure que nous gagnions en confiance dans notre modèle noyau et que nous en affinions les abstractions internes, nous avons étendu le sous-ensemble pris en charge.  Nous indiquons de façon explicite les parties de la syntaxe que nous ne prenons pas encore en charge, en maintenant des journaux de diagnostic et en sautant la compilation des sources non prises en charge.  Nous avons des utilitaires pour essayer le compilateur sur les bases de code de Meta et voir quels aspects non encore pris en charge sont les plus couramment utilisés, pour prioriser les évolutions à venir.  Nous allons continuer à étendre progressivement tout ça jusqu'à prendre en charge l'intégralité du langage.

Pour permettre à du code JavaScript classique d'être réactif dans des composants React, il faut que le compilateur ait une compréhension profonde de sa sémantique pour déterminer précisément ce que fait ce code.  En adoptant cette approche, nous avons créé un système de réactivité en JavaScript qui vous permet d'écrire du code métier de quelque complexité que ce soit, en bénéficiant de la pleine expressivité du langage, plutôt que de vous limiter à un langage taillé sur-mesure.

## Rendu hors-écran {/*offscreen-rendering*/}

Le rendu hors-écran *(offscreen rendering, NdT)* désigne la possibilité prochaine pour React de calculer les rendus de vos écrans en arrière-plan, sans nuire aux performances.  Vous pouvez y penser comme à une variation de la [propriété CSS `content-visibility`](https://developer.mozilla.org/fr/docs/Web/CSS/content-visibility), qui ne fonctionnerait pas seulement pour les éléments du DOM mais aussi pour les composants React.  Au fil de nos recherches, nous avons découvert plusieurs scénarios d'utilisation :

- Un routeur pourrait précalculer le rendu d'écrans en arrière-plan pour que lorsque l'utilisateur navigue vers l'un d'eux, il soit immédiatement disponible.
- Un composant d'onglets pourrait préserver l'état d'onglets masqués, pour que lorsque l'utilisateur rebascule dessus, il ne perde pas sa progression.
- Un composant de liste virtualisée pourrait précalculer le rendu de lignes supplémentaires en amont ou en aval de la zone visible.
- Lors de l'ouverture d'une boîte de dialogue modale ou d'une zone surgissante, le reste de l'appli pourrait « passer en arrière-plan » pour que ses événements et mises à jour soient désactivées pour tout ce qui ne concerne pas la zone mise en avant.

La plupart des développeurs React n'interagiront pas directement avec les API de gestion hors-écran de React.  Le rendu hors-écran sera plutôt intégré dans des choses comme les bibliothèques de routage ou d'UI, et les développeurs qui utilisent ces bibliothèques en bénéficieront automatiquement, sans travail supplémentaire.

L'idée, c'est que vous devriez pouvoir faire le rendu d'un arbre React hors-écran sans changer la façon dont vous écrivez vos composants.  Lorsqu'un composant fait son rendu hors-écran, il n'est pas réellement *monté* jusqu'à ce qu'il devienne visible — ses Effets ne sont pas déclenchés.  Si par exemple un composant utilise `useEffect` pour tenir des journaux analytiques lorsqu'il apparaît pour la première fois, le prérendu ne nuira pas à la justesse de ces données analytiques.  Dans le même esprit, lorsqu'un composant passe hors-écran, ses effets sont démontés.  Un aspect clé du rendu hors-écran veut que vous puissiez basculer la visibilité d'un composant sans perdre son état.

Depuis notre dernier bulletin, nous avons testé une version expérimentale du prérendu en interne chez Meta dans nos applis React Native sur Android et iOS, avec des résultats de performance encourageants.  Nous avons aussi amélioré la collaboration du rendu hors-écran avec Suspense — suspendre au sein d'un arbre hors-écran ne déclenchera pas les rendus de secours de Suspense.  Il nous reste à finaliser les primitives qui seront exposées aux développeurs de bibliothèques.  Nous prévoyons de publier une RFC plus tard cette année, accompagnée d'une API expérimentale pour vos tests et retours d'expérience.

## Pistage des transitions {/*transition-tracing*/}

L'API de pistage des transitions vous permet de détecter que des [transitions React](/reference/react/useTransition) ralentissent, et d'enquêter sur les causes du ralentissement. Depuis notre dernier bulletin, nous avons terminé la conception initiale de l'API et publié une [RFC](https://github.com/reactjs/rfcs/pull/238). Les capacités de base ont été implémentées.  Le projet est actuellement en suspens.  Nous sommes à l'écoute de vos retours sur la RFC et espérons reprendre le développement pour fournir de meilleurs outils de mesure de la performance pour React.  Ça sera particulièrement utile pour les routeurs basés sur les transitions React, tels que [l'*App Router* de Next.js](/learn/start-a-new-react-project#nextjs-app-router).

---

En complément de ce bulletin, notre équipe est récemment apparue dans des podcasts communautaires et des *livestreams* pour parler de notre travail et répondre à vos questions.

* [Dan Abramov](https://twitter.com/dan_abramov) et [Joe Savona](https://twitter.com/en_JS) étaient interviewés par [Kent C. Dodds sur sa chaîne YouTube](https://www.youtube.com/watch?v=h7tur48JSaw), pour parler de leurs préoccupations sur les React Server Components.
* [Dan Abramov](https://twitter.com/dan_abramov) et [Joe Savona](https://twitter.com/en_JS) étaient les invités du [podcast JSParty](https://jsparty.fm/267) pour parler de leurd visions respectives de l'avenir de React.

Merci à [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Dave McCabe](https://twitter.com/mcc_abe), [Luna Wei](https://twitter.com/lunaleaps), [Matt Carroll](https://twitter.com/mattcarrollcode), [Sean Keegan](https://twitter.com/DevRelSean), [Sebastian Silbermann](https://twitter.com/sebsilbermann), [Seth Webster](https://twitter.com/sethwebster) et [Sophie Alpert](https://twitter.com/sophiebits) pour leurs relectures de ce billet.

Merci de nous avoir lus, et rendez-vous dans notre prochain bulletin !
