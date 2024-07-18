---
title: "React Canaries : livraison incrémentale de fonctionnalités hors de Meta"
author: Dan Abramov, Sophie Alpert, Rick Hanlon, Sebastian Markbage et Andrew Clark
date: 2023/05/03
description: Nous aimerions offrir à la communauté React un moyen d'adopter individuellement des fonctionnalités dès que leur conception est quasi finalisée —  un peu comme l'utilisation que Meta fait de React en interne depuis longtemps déjà. Nous présentons donc un nouveau [canal de livraison officiel appelé Canary](/community/versioning-policy#canary-channel). Il permet à des environnements choisis tels que les frameworks de découpler leur adoption de fonctionnalités React individuelles du calendrier officiel de sortie de React.

---

Le 3 mai 2023 par [Dan Abramov](https://twitter.com/dan_abramov), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage) et [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Nous aimerions offrir à la communauté React un moyen d'adopter individuellement des fonctionnalités dès que leur conception est quasi finalisée —  un peu comme l'utilisation que Meta fait de React en interne depuis longtemps déjà. Nous présentons donc un nouveau [canal de livraison officiel appelé Canary](/community/versioning-policy#canary-channel). Il permet à des environnements choisis tels que les frameworks de découpler leur adoption de fonctionnalités React individuelles du calendrier officiel de sortie de React.

</Intro>

---

## tl;pl {/*tldr*/}

* Nous ajoutons un [canal de livraison Canary](/community/versioning-policy#canary-channel) officiel pour React. Puisqu'il est officiellement pris en charge, si des régressions y surviennent, nous les traiterons avec la même priorité que des bugs survenant dans les versions stables.
* Les Canaries vous permettent de commencer à utiliser des nouvelles fonctionnalités individuelles de React avant qu'elles arrivent dans les versions stables officielles.
* Contrairement au canal [Expérimental](/community/versioning-policy#experimental-channel), les Canaries React n'incluent que des fonctionnalités dont nous sommes raisonnablement sûrs qu'elles sont prêtes à être adoptées.  Nous encourageons les frameworks à envisager d'incorporer une Canary React en épinglant sa version.
* Nous annoncerons les ruptures de compatibilité ascendante et les nouvelles fonctionnalités sur notre blog dès qu'elles arriveront dans des livraisons Canary.
* **Comme toujours, React continue de respecter le versionnement sémantique pour chaque version publiée sur le canal Stable.**

## Comment les fonctionnalités de React sont-elles généralement développées ? {/*how-react-features-are-usually-developed*/}

En général, une fonctionnalité React est passée à travers les mêmes étapes de développement :

1. Nous développons une version initiale et préfixons sont API par `experimental_` ou `unstable_`. La fonctionnalité n'est disponible que *via* le canal de livraison `experimental`. À ce stade, la fonctionnalité est susceptible de beaucoup évoluer.
2. Nous trouvons chez Meta une équipe motivée pour nous aider à tester cette fonctionnalité et nous faire des retours nourris dessus.  Ça entraîne un premier lot de modifications. Au fur et à mesure que la fonctionnalité gagne en stabilité, nous collaborons avec davantage d'équipes chez Meta pour la mettre à l'épreuve.
3. Nous finissons par être confiants dans sa conception. Nous retirons alors le préfixe de ses noms d'API et la rendons disponible sur la branche par défaut `main`, utilisée par la plupart des produits de Meta. À ce stade, n'importe quelle équipe chez Meta peut utiliser cette fonctionnalité.
4. Alors que la confiance grandit, nous publions une RFC sur la nouvelle fonctionnalité. On sait à ce stade que la conception fonctionne pour un large éventail de cas, mais nous sommes encore susceptibles de faire des ajustements de dernière minute.
5. Lorsque nous sommes sur le point de faire une livraison *open source*, nous rédigeons la documentation de la fonctionnalité et la livrons enfin dans une version stable de React.

Cette stratégie a bien fonctionné pour la plupart des fonctionnalités que nous avons livrées jusqu'ici. Cependant, il peut s'écouler un temps considérable entre le moment où une fonctionnalité est globalement prête à l'emploi (étape 3) et celui où elle est livrée en *open source* (étape 5).

**Nous aimerions offrir à la communauté React un moyen de suivre la même approche que chez Meta, en adoptant individuellement de nouvelles fonctionnalités React plus tôt (au fil de leur mise à disposition), sans avoir à attendre la prochaine version officielle de React.**

Comme toujours, toutes les fonctionnalités de React arriveront à terme dans une version stable.

## Ne peut-on pas juste faire plus de versions mineures ? {/*can-we-just-do-more-minor-releases*/}

En général, nous *utilisons bien* des versions mineures pour introduire de nouvelles fonctionnalités.

Ce n'est toutefois pas toujours possible.  Il arrive que de nouvelles fonctionnalités soient étroitement liées à *d'autres* nouvelles fonctionnalités qui ne sont pas tout à fait finies, et sur lesquelles nous itérons encore.  Nous ne pouvons pas les livrer séparément parce que leurs implémentations sont imbriquées. Nous ne pouvons pas les versionner séparément parce qu'elles affectent les mêmes modules (par exemple `react` et `react-dom`).  Et nous avons besoin de pouvoir continuer à itérer sur les parties qui ne sont pas encore prêtes sans publier une floppée de versions majeures, ce que le versionnement sémantique nous imposerait dans un tel cas.

Chez Meta, nous avons résolu ce problème en construisant React à partir de sa branche `main`, et en le recalant manuellement sur un commit précis chaque semaine.  C'est aussi l'approche suivie depuis quelques années par les versions publiées de React Native.  Chaque version *stable* de React Native est calée sur un commit précis de la branche `main` du dépôt React. Ça permet à React Native d'inclure des correctifs importants et d'adopter de façon incrémentale les nouvelles fonctionnalités React au niveau du framework sans être contraint par le calendrier global de versions de React.

Nous aimerions rendre ce workflow disponible à d'autres frameworks et environnements choisis. Il permet par exemple à un framework *par-dessus* React d'inclure des modifications rompant la compatibilité ascendante de React *avant* que ces ruptures n'apparaissent dans une version stable de React. C'est particulièrement utile parce que certaines ruptures de compatibilité n'affectent que les intégrations par ces frameworks. Ça permet au framework de sortir une telle évolution dans sa propre version mineure, sans avoir à casser son propre versionnement sémantique.

Des versions régulières sur le canal Canary nous permettront d'avoir une boucle de retours plus étroite et de nous assurer que les nouvelles fonctionnalités font l'objet de tests exhaustifs par la communauté. Ce workflow ressemble davantage à la façon dont le TC39 (le comité de standardisation de JavaScript) [gère ses évolutions par stades numérotés](https://tc39.es/process-document/). Les nouvelles fonctionnalités de React sont susceptibles d'être disponibles dans des frameworks basés sur React avant d'apparaître dans une version stable de React, tout comme des nouvelles fonctionnalités de JavaScript apparaissent dans des navigateurs avant d'être officiellement ratifiées dans la spécification du langage.

## Pourquoi ne pas plutôt utiliser les versions expérimentales ? {/*why-not-use-experimental-releases-instead*/}

Même si vous *pouvez* techniquement utiliser les [versions expérimentales](/community/versioning-policy#canary-channel), nous vous déconseillons de les utiliser en production car les API expérimentales peuvent subir des changements significatifs pendant leur phase de stabilisation (et sont même parfois carrément retirées).  Même si les Canaries peuvent contenir des erreurs (comme pour toute version), nous avons l'intention désormais d'annoncer toute rupture importante de compatibilité dans les Canaries sur notre blog.  Les Canaries sont ce qui se rapproche le plus du code que Meta utilise en interne, vous pouvez donc vous attendre à un bon niveau général de stabilité.  En revanche, vous *aurez bien besoin* d'épingler (c'est-à-dire de vous caler sur) une version fixe et de parocurir manuellement nos journaux de commits GitHub lorsque vous mettrez à jour la version épinglée.

**Nous nous attendons à ce que la majorité des utilisateurs de React ne travaillant pas sur un environnement choisi (comme un framework) souhaitent continuer à plutôt utiliser les versions stables.**  Ceci dit, si vous construisez un framework, vous voudrez peut-être envisager d'incorporer une version Canary de React épinglée sur un commit précis, et de la mettre à jour à votre rythme.  L'avantage de cette approche, c'est qu'elle vous permet de livrer des fonctionnalités individuelles finalisées de React (et des correctifs) plus tôt à vos propres utilisateurs, et suivant votre propre calendrier de versions, tout comme React Native le fait depuis plusieurs années.  L'inconvénient, c'est que vous endossez davantage de responsabilités en examinant quels commits React sont récupérés et en communiquant sur ces évolutions auprès de vos utilisateurs.

Si vous êtes en charge d'un framework et souhaitez tenter cette approche, merci de nous contacter.

## Annoncer les ruptures de compatibilité et les nouveautés plus tôt {/*announcing-breaking-changes-and-new-features-early*/}

Les versions Canary représentent notre meilleure vision, à un instant donné, de ce qui arrivera dans la version stable suivante.

Historiquement nous n'annoncions les ruptures de compatibilité ascendante qu'à *la fin* du cycle de livraison (en sortant une version majeure).  À présent que nous disposons d'un canal Canary officiel pour consommer React, nous pensons annoncer les ruptures de compatibilité et les nouveautés significatives *au fil de leur apparition* dans les Canaries. Si par exemple nous fusionnons une rupture de compatibilité qui apparaîtra dans une Canary, nous écrirons un billet à ce sujet sur le blog React, en incluant si besoin des *codemods* et les instructions de migration appropriées.  À partir de là, si vous travaillez sur un framework et sortez une version majeure qui met à jour sa version épinglée de React Canary pour inclure ces modifications, vous pourrez mettre un lien vers notre billet de blog dans vos notes de version. Enfin, lorsqu'une version majeure stable de React sera prête, nous y mettrons des liens vers les billets de blog déjà publiés, ce qui nous l'espérons aidera votre équipe à progresser plus vite.

Nous prévoyons de documenter les API au fil de leur apparition dans les Canaries — même si ces API ne sont pas encore disponibles par ailleurs.  Les API qui ne sont disponibles que dans les Canaries seront identifiées par une note spécifique dans leur documentation. Ça inclura des API comme [`use`](https://github.com/reactjs/rfcs/pull/229) et d'autres (telles que `cache` et `createServerContext`) pour lesquelles nous publierons des RFC.

## Les Canaries doivent être épinglés {/*canaries-must-be-pinned*/}

Si vous décidez d'adopter un workflow basé sur Canary pour votre appli ou votre framework, assurez-vous de toujours épingler la version *exacte* de la Canary que vous utilisez.  Dans la mesure où les Canaries sont des préversions, elles sont susceptibles d'inclure des ruptures de compatibilité.

## Exemple : React Server Components {/*example-react-server-components*/}

Comme nous l'avons [annoncé en mars](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components), les conventions des React Server Components sont finalisées, et nous n'anticipons pas de ruptures majeures dans leur contrat d'API publique.  En revanche, nous ne pouvons pas encore prendre en charge les React Server Components dans une version stable de React parce que nous travaillons encore sur plusieurs fonctionnalités qui leur sont étroitement liées mais qui ne concernent que les frameworks (telles que le [chargement de ressources](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#asset-loading)) et nous anticipons des ruptures de ce côté-là.

Ça signifie que les React Server Components sont prêts à être adoptés par les frameworks. Cependant, jusqu'à la prochaine version majeure de React, la seule manière pour un framework de les adopter sera d'utiliser une version Canary épinglée de React. (Pour éviter d'inclure deux copies de React dans les *bundles*, les frameworks choisissant cette approche devraient forcer une résolution des modules `react` et `react-dom` vers leur version Canary épinglée, et l'expliquer à leurs utilisateurs. C'est par exemple ce que fait le *App Router* de Next.js.)

## Tester des bibliothèques avec les versions Stable et Canary {/*testing-libraries-against-both-stable-and-canary-versions*/}

Nous ne nous attendons pas à ce que les équipes des bibliothèques tierces testent chaque version Canary, ce serait d'une difficulté prohibitive.  En revanche, tout comme lorsque nous avions [introduit les canaux originaux de préversion de React il y a trois ans](https://legacy.reactjs.org/blog/2019/10/22/react-release-channels.html), nous encourageons les bibliothèques à exécuter leurs tests *aussi bien* sur la dernière version stable que sur la dernière version Canary.  Si vous constatez un changement de comportement qui n'a fait l'objet d'aucune annonce, merci d'ouvrir un ticket sur le dépôt de React pour que nous vous aidions à diagnostiquer le problème.  Nous estimons qu'une fois cette pratique largement répandue, elle réduira l'effort nécessaire à la mise à jour des bibliothèques pour les nouvelles versions majeures de React, dans la mesure où les régressions accidentelles seront découvertes au fil de l'eau.

<Note>

À proprement parler, Canary n'est pas un *nouveau* canal de livraison — il s'appelait auparavant Next. Nous avons toutefois décidé de le renommer pour éviter la confusion avec Next.js. Nous l'annonçons comme un *nouveau* canal de livraison pour en communiquer les nouvelles attentes, notamment dans la mesure où les Canaries sont désormais une manière officiellement prise en charge d'utiliser React.

</Note>

## Les versions stables marchent comme avant {/*stable-releases-work-like-before*/}

Nous n'apportons aucun changement aux versions stables de React.
