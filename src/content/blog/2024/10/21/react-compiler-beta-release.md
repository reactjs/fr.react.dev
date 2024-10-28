---
title: "React Compiler : beta et feuille de route"
author: Lauren Tan
date: 2024/10/21
description: Lors de la React Conf 2024, nous avons annoncé la sortie expérimentale de React Compiler, un outil de niveau *build* qui optimise votre appli React grâce à de la mémoïsation automatique. Dans cet article, nous aimerions partager avec vous la suite de nos travaux *open source* et nos progrès sur ce compilateur.

---

Le 21 octobre 2024 par [Lauren Tan](https://twitter.com/potetotes).

---

<Intro>

L'équipe React est heureuse de partager avec vous les annonces suivantes :

</Intro>

1. Nous avons publié aujourd'hui la version beta de React Compiler, afin que les pionnier·ères de l'adoption et les mainteneur·ses de bibliothèques puissent l'essayer et nous faire part de leurs retours.
2. Nous permettons officiellement l'utilisation de React Compiler sur les applis en React 17+, au travers d'un module optionnel `react-compiler-runtime`.
3. Nous ouvrons l'accès public au [groupe de travail React Compiler](https://github.com/reactwg/react-compiler) pour préparer la communauté à l'adoption graduelle du compilateur.

---

Lors de la [React Conf 2024](/blog/2024/05/22/react-conf-2024-recap), nous avons annoncé la sortie expérimentale de React Compiler, un outil de niveau *build* qui optimise votre appli React grâce à de la mémoïsation automatique. [Vous pouvez trouver une introduction au compilateur ici](/learn/react-compiler).

Depuis cette première sortie, nous avons corrigé de nombreux bugs signalés par la communauté React, reçus plusieurs correctifs et contributions de haute qualité[^1] au compilateur, rendu le compilateur plus résilient face à une grande variété d'approches JavaScript, et continué à déployer plus largement le compilateur à Meta.

Dans cet article, nous aimerions partager avec vous la suite de nos travaux sur ce compilateur.

## Essayez React Compiler beta dès aujourd'hui {/*try-react-compiler-beta-today*/}

Lors de [React India 2024](https://www.youtube.com/watch?v=qd5yk2gxbtg), nous avons parlé des derniers travaux sur React Compiler.  Nous sommes ravi·es aujourd'hui de pouvoir annoncer la sortie en beta de React Compiler et d'un plugin ESLint.  Les nouvelles beta seront publiées sur npm avec l'étiquette `@beta`.

Pour installer React Compiler beta :

<TerminalBlock>
npm install -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

Ou si vous utilisez Yarn :

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

Vous pouvez regarder la présentation de [Sathya Gunasekaran](https://twitter.com/_gsathya) à React India ici :

<YouTubeIframe src="https://www.youtube.com/embed/qd5yk2gxbtg" />

## Utilisez le *linter* React Compiler dès maintenant {/*we-recommend-everyone-use-the-react-compiler-linter-today*/}

Le plugin ESLint de React Compiler aide les développeur·ses à identifier proactivement les violations des [Règles de React](/reference/rules) et à les corriger. **Nous conseillons fortement à tout le monde d'utiliser le *linter* dès aujourd'hui.** Le *linter* ne requiert pas l'installation du compilateur, vous pouvez l'utiliser indépendamment, même si vous n'êtes pas encore prêt·e à essayer le compilateur.

Pour installer le *linter* seul :

<TerminalBlock>
npm install -D eslint-plugin-react-compiler@beta
</TerminalBlock>

Ou si vous utilisez Yarn :

<TerminalBlock>
yarn add -D eslint-plugin-react-compiler@beta
</TerminalBlock>

Après l'installation vous pouvez activer le *linter* en [l'ajoutant à votre configuration ESLint](/learn/react-compiler#installing-eslint-plugin-react-compiler). Utiliser ce *linter* vous aidera à identifier les infractions aux Règles de React, ce qui facilitera l'adoption du compilateur lorsqu'il sera officiellement prêt.

## Rétrocompatibilité {/*backwards-compatibility*/}

React Compiler produit du code qui s'appuie sur des API à l'exécution apparues avec React 19, mais le compilateur prend désormais également en charge les projets utilisant React 17 et 18.  Si vous n'êtes pas encore sur React 19, la version beta vous permet d'essayer néanmoins React Compiler en spécifiant une `target` minimum dans votre configuration de compilation, et en ajoutant `react-compiler-runtime` comme dépendance. [Vous trouverez la documentation associée ici](/learn/react-compiler#using-react-compiler-with-react-17-or-18).

## Utiliser React Compiler dans des bibliothèques {/*using-react-compiler-in-libraries*/}

Notre version initiale se concentrait sur l'identification de problèmes majeurs lors de l'utilisation du compilateur sur du code applicatif. Nous avons reçu de super retours et avons largement amélioré le compilateur depuis. Nous sommes à présent prêt·es à recevoir des retours plus divers de la communauté, et notamment à ce que les auteur·es de bibliothèques essaient le compilateur pour améliorer leurs performances et l'expérience de développement liée à la maintenance de leur bibliothèque.

React Compiler peut donc être utilisé pour compiler des bibliothèques. Dans la mesure où React Compiler doit être exécuté sur le code source original, avant toute transformation, il n'est généralement pas possible que la chaîne de construction d'une application compile les bibliothèques dont elle dépend.  C'est pourquoi nous conseillons aux mainteneur·euses de bibliothèques de compiler et tester indépendamment leurs bibliothèques avec le compilateur, et de livrer le code compilé dans npm.

Puisque votre code est pré-compilé, les utilisateur·rices de votre bibliothèque n'auront pas besoin d'activer le compilateur pour bénéficier de la mémoïsation automatique appliquée à votre bibliothèque.  Si celle-ci s'adresse à des applications pas forcément encore sur React 19, pensez à préciser une `target` minimum et à ajouter `react-compiler-runtime` comme dépendance explicite de production.  Ce module d'exécution utilisera une implémentation correcte des API selon la version de React de l'application, et émulera les API manquantes lorsque c'est nécessaire.

[Vous trouverez la documentation associée ici](/learn/react-compiler#using-the-compiler-on-libraries).

## Ouverture du groupe de travail React Compiler au public {/*opening-up-react-compiler-working-group-to-everyone*/}

Nous avions annoncé à React Conf le [groupe de travail React Compiler](https://github.com/reactwg/react-compiler), sur invitations uniquement, pour nous fournir des retours, poser des questions, et contribuer à la sortie expérimentale du compilateur.

À compter d'aujourd'hui, de concert avec la sortie beta de React Compiler, nous ouvrons le groupe de travail à tout le monde.  Le groupe de travail React Compiler a pour objectif de préparer l'écosystème pour une adoption graduelle, en douceur, de React Compiler dans les applications et bibliothèques existantes.  Merci de continuer à nous soumettre des tickets de bugs sur le [dépôt React](https://github.com/facebook/react), mais réservez les retours, questions et échanges d'idées pour le [forum de discussion du groupe de travail](https://github.com/reactwg/react-compiler/discussions).

L'équipe noyau utilisera par ailleurs ce dépôt de discussion pour partager les résultats de nos recherches.  Alors que la version stable se rapprochera, toute information importante sera également publiée sur ce forum.

## React Compiler à Meta {/*react-compiler-at-meta*/}

Lors de la [React Conf](/blog/2024/05/22/react-conf-2024-recap), nous avions raconté les succès du déploiement du compilateur sur le Quest Store et Instagram. Nous avons depuis déployé React Compiler dans plusieurs applis web majeures de Meta, dont [Facebook](https://www.facebook.com) et [Threads](https://www.threads.net). Ça signifie que si vous avez utilisé ces applis récemment, vous avez sans doute bénéficié d'une expérience optimisée par le compilateur.  Nous avons pu l'activer sur ces applis avec peu de modifications au code, dans un monorepo contenant plus de 100 000 composants React.

Nous avons constaté des améliorations de performance significatives pour toutes ces applis.  Au fil du déploiement, nous continuons à observer des gains du même ordre de grandeur que ceux [que nous avions décrits lors de la React Conf](https://youtu.be/lyEKhv8-3n0?t=3223). Ces applis étaient déjà intensément optimisées à la main par les ingénieurs Meta experts en React depuis des années, de sorte que même une amélioration de quelques pourcents constitue un énorme bénéfice pour nous.

Nous nous attendons par ailleurs à des gains de productivité en développement grâce à React Compiler.  Pour en mesurer la portée, nous avons collaboré avec nos collègues en science des données à Meta[^2] pour mener une analyse statistique exhaustive de l'impact de la mémoïsation manuelle sur la productivité.  Avant de déployer le compilateur à Meta, nous avons découvert qu'à peine 8% environ des *pull requests* liées à React utilisaient la mémoïsation manuelle, et que ces *pull requests* prenaient 31–46% plus de temps à écrire[^3].  Ça a validé notre intuition que la mémoïsation manuelle augmente fortement la charge cognitive, et nous nous attendons à ce que React Compiler produise du code plus efficace à écrire et à réviser.  En particulier, React Compiler s'assure que *tout* le code est mémoïsé par défaut, pas seulement les 8% (dans notre cas) que les développeur·ses avaient explicitement mémoïsés.

## Feuille de route vers une version stable {/*roadmap-to-stable*/}

*Il ne s'agit pas d'une feuille de route définitive, elle reste sujette à changements.*

Nous avons l'intention de livrer une version candidate *(Release Candidate, NdT)* du compilateur dans l'avenir proche suite à la sortie de la version beta, lorsque la majorité des applis et bibliothèques qui respectent les Règles de React auront démontré leur bon fonctionnement avec le compilateur.  Après une période de retours finaux par la communauté, nous comptons fournir une version stable du compilateur.  La version stable annoncera le début de nouvelles fondations pour React, et nous conseillerons fortement à toutes les applis et bibliothèques d'utiliser le compilateur et le plugin ESLint.

* ✅ Expérimentale : sortie à React Conf 2024, surtout pour des retours par les pionnier·ères de l'adoption.
* ✅ Beta publique : disponible dès aujourd'hui, pour des retours par toute la communauté.
* 🚧 Version candidate (RC) : React Compiler fonctionne sans accroc pour la majorité des applis et bibliothèques qui respectent les règles.
* 🚧 Version stable : après une période de retours finaux de la communauté.

Ces versions incluent le plugin ESLint du compilateur, qui donne accès aux diagnostics issus de l'analyse statique par le compilateur.  Nous comptons combiner le plugin existant eslint-plugin-react-hooks avec le plugin ESLint du compilateur, pour ne plus avoir qu'un plugin unique à installer.

Au-delà de la version stable, nous prévoyons d'ajouter plus d'optimisations et d'améliorations au compilateur.  On y trouvera aussi bien des améliorations incrémentales à la mémoïsation automatique, que des optimisations entièrement nouvelles, avec le minimum d'impact sur votre code produit.  Nous avons l'intention de permettre des migrations les plus simples possibles vers chaque nouvelle version, et que chacune améliore les performances et gère mieux la diversité des approches JavaScript et React.

Tout au long de ce processus, nous pensons également prototyper une extension EDI pour React.  La recherche à ce sujet est encore très jeune ; nous vous en dirons davantage dans un prochain billet de blog React Labs.

---

Merci à [Sathya Gunasekaran](https://twitter.com/_gsathya), [Joe Savona](https://twitter.com/en_JS), [Ricky Hanlon](https://twitter.com/rickhanlonii), [Alex Taylor](https://github.com/alexmckenley), [Jason Bonta](https://twitter.com/someextent) et [Eli White](https://twitter.com/Eli_White) pour avoir révisé et amendé cet article.

---

[^1]: Merci à [@nikeee](https://github.com/facebook/react/pulls?q=is%3Apr+author%3Anikeee), [@henryqdineen](https://github.com/facebook/react/pulls?q=is%3Apr+author%3Ahenryqdineen), [@TrickyPi](https://github.com/facebook/react/pulls?q=is%3Apr+author%3ATrickyPi) et plusieurs autres pour leurs contributions au compilateur.

[^2]: Merci à [Vaishali Garg](https://www.linkedin.com/in/vaishaligarg09) pour avoir piloté cette étude sur React Compiler à Meta, et pour avoir révisé cet article.

[^3]: Après avoir ajusté l'analyse selon l'ancienneté des auteur·es, le volume et la complexité des changements, et les facteurs agravants éventuels.