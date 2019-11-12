---
title: "Create React App 2.0 : Babel 7, Sass, et plus encore"
author: [timer, gaearon]
---

Create React App 2.0 a été publié aujourd'hui, et il apporte l'équivalent d'une année d'améliorations dans une seule mise à jour des dépendances.

Alors que React lui-même [ne nécessite aucune dépendance de compilation](/docs/create-a-new-react-app.html), il peut être difficile d'écrire une application complexe sans un lanceur de tests rapide, un minifieur de production et une base de code modulaire. Dès sa toute première version, l'objectif de [Create React App](https://github.com/facebook/create-react-app) a été de vous aider à vous concentrer sur ce qui compte le plus—votre code d'application—et de gérer la compilation et la configuration des tests pour vous.

Bon nombre des outils sur lesquels il s'appuie ont depuis publié de nouvelles versions contenant de nouvelles fonctionnalités et des améliorations de performances : [Babel 7](https://babeljs.io/blog/2018/08/27/7.0.0), [Webpack 4](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4), et [Jest 23](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing.html). Cependant, les mettre à jour manuellement et les faire bien fonctionner ensemble demande beaucoup d'efforts. Et c'est exactement ce que les [contributeurs à Create React App 2.0](https://github.com/facebook/create-react-app/graphs/contributors) ont été occupés à faire ces derniers mois : **migrer la configuration et les dépendances pour que vous n'ayez pas à le faire vous-même.**

Maintenant que Create React App 2.0 n'est plus en beta, voyons ce qu'il y a de nouveau et comment vous pouvez l'essayer !

> Remarque
>
> Ne vous sentez pas obligé·e de mettre à jour quoi que ce soit. Si vous êtes satisfait·e du jeu de fonctionnalités actuel, de ses performances et de sa fiabilité, vous pouvez continuer à utiliser la version que vous avez actuellement ! Il peut également être une bonne idée de laisser la version 2.0 se stabiliser un peu avant de passer à celle-ci en production.

## Quoi de neuf ? {#whats-new}

Voici un bref résumé des nouveautés de cette version :

* 🎉 Plus d'options de style : vous pouvez utiliser [Sass](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-a-sass-stylesheet) et [les modules CSS](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-a-css-modules-stylesheet) d’entrée de jeu.
* 🐠 Nous avons mis à jour [Babel 7](https://babeljs.io/blog/2018/08/27/7.0.0), y compris la prise en charge de la [syntaxe de fragments React](/docs/fragments.html#short-syntax) et de nombreuses corrections de bugs.
* 📦 Nous avons mis à jour [Webpack 4](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4), qui découpe automatiquement les modules JS de manière plus intelligente.
* 🃏 Nous avons mis à jour [Jest 23](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing.html), qui comprend un [mode interactif](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing#interactive-snapshot-mode) pour l'examen des snapshots.
* 💄 Nous avons ajouté [PostCSS](https://preset-env.cssdb.org/features#stage-3) afin que vous puissiez utiliser les nouvelles fonctionnalités CSS dans les anciens navigateurs.
* 💎 Vous pouvez utiliser [Apollo](https://github.com/leoasis/graphql-tag.macro#usage), [Relay Modern](https://github.com/facebook/relay/pull/2171#issuecomment-411459604), [MDX](https://github.com/facebook/create-react-app/issues/5149#issuecomment-425396995), et d'autres [macros Babel](https://babeljs.io/blog/2017/09/11/zero-config-with-babel-macros) tierces.
* 🌠 Vous pouvez maintenant [importer un SVG en tant que composant React](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-svgs) et utilisez-le dans JSX.
* 🐈 Vous pouvez essayer la mode expérimentale [Yarn Plug'n'Play](https://github.com/yarnpkg/rfcs/pull/101) qui supprime `node_modules`.
* 🕸 Vous pouvez maintenant [brancher votre propre implémentation de proxy](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#configuring-the-proxy-manually) en développement pour correspondre à votre API back-end.

* 🚀 Vous pouvez maintenant utiliser les [paquets écrits pour les dernières versions de Node](https://github.com/sindresorhus/ama/issues/446#issuecomment-281014491) sans casser la construction.
* ✂️ Vous pouvez maintenant opter pour un *bundle* CSS plus petit si vous prévoyez seulement de cibler les navigateurs modernes.
* 👷‍♀️ Les Service Workers sont désormais *opt-in* et sont construits à l'aide de Google [Workbox].(https://developers.google.com/web/tools/workbox/).

**Toutes ces fonctionnalités sont prêtes à l'emploi**—pour les activer, suivez les instructions ci-dessous.

## Démarrer un projet avec Create React App 2.0 {#starting-a-project-with-create-react-app-20}

Vous n’avez pas besoin de mettre à jour quoi que ce soit de spécial. A partir d'aujourd'hui, lorsque vous lancez `create-react-app` il utilisera la version 2.0 du gabrait par défaut. Amusez-vous bien !

Si vous voulez **utiliser l'ancien modèle 1.x** pour une raison quelconque, vous pouvez le faire en passant `--scripts-version=react-scripts@1.x` comme argument pour `create-react-app`.

## Mise à jour d'un projet vers Create React App 2.0 {#updating-a-project-to-create-react-app-20}

La mise à niveau d'un projet non-éjecté vers Create React App 2.0 devrait généralement être facile. Ouvrez `package.json` à la racine de votre projet et trouvez-y `react-scripts`.

Puis changez sa version en `2.0.3` :


```js{2}
  // ... autres dépendances ...
  "react-scripts": "2.0.3"
```

Éxécutez `npm install` (ou `yarn`, si vous l'utilisez). **Pour de nombreux projets, ce changement d'une seule ligne est suffisant pour la mise à niveau !**

<blockquote class="twitter-tweet" data-conversation="none" data-dnt="true"><p lang="fr" dir="ltr">ça fonctionne ici… Merci pour toutes les nouvelles fonctionnalités 👍</p>&mdash; Stephen Haney (@sdothaney) <a href="https://twitter.com/sdothaney/status/1046822703116607490?ref_src=twsrc%5Etfw">1er octobre 2018</a></blockquote>

Voici quelques autres conseils pour vous aider à démarrer.

**Lorsque vous lancez `npm start` pour la première fois après la mise à niveau,** vous obtiendrez une invite vous demandant quels navigateurs vous souhaitez prendre en charge. Appuyez sur `y` pour accepter les valeurs par défaut. Elles seront écrites dans votre fichier `package.json` et vous pouvez les éditer à tout moment. Create React App utilisera ces informations pour produire des *bundles* CSS plus ou moins compatibles selon que vous visez des navigateurs modernes ou plus anciens.

**Si `npm start` ne fonctionne toujours pas pour vous après la mise à jour,** [consultez les instructions de migration plus détaillées dans les notes de publication](https://github.com/facebook/create-react-app/releases/tag/v2.0.3). Il y a *en effet* quelques ruptures de compatibilité ascendante dans cette version, mais leur portée est limitée, donc ils ne devraient pas prendre plus de quelques heures à résoudre. Notez que **[la prise en charge des anciens navigateurs](https://github.com/facebook/create-react-app/blob/master/packages/react-app-polyfill/README.md) est maintenant opt-in** pour réduire la taille des polyfills.

**Si vous avez déjà éjecté mais que vous voulez maintenant mettre à niveau,** une solution courante consiste à trouver les commits où vous avez été éjecté (et tous les commits ultérieurs modifiant la configuration), les renverser (au sens `git revert`), mettre à niveau, puis éventuellement éjecter à nouveau plus tard. Il est également possible que la fonctionnalité pour laquelle vous aviez éjectée (peut-être Sass ou les modules CSS ?) soit maintenant prise en charge de base.



> Remarque
>
> En raison d'un bug possible dans npm, vous risquez de voir des avertissements sur les dépendances paires insatisfaites. Vous devriez pouvoir les ignorer. Pour autant que nous le sachions, ce problème n'existe pas avec Yarn.

## Ruptures de compatibilité ascendante {#breaking-changes}

Voici une courte liste des ruptures de compatibilité ascendante dans cette version :

* Node 6 n'est plus pris en charge.
* La prise en charge des anciens navigateurs (comme IE 9 jusqu'à IE 11) est maintenant opt-in avec [un paquet séparé](https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill).
* La découpe de code avec `import()` suit désormais au plus près la spécification, alors que `require.ensure()` est désactivé.
* L'environnement de Jest par défaut inclut maintenant jsdom.
* La prise en charge de la spécification d'un objet en tant que paramètre `proxy` a été remplacée par la prise en charge d'un module proxy personnalisé.
* L'extension `.mjs` n’est plus prise en charge en attendant que l'écosystème qui l'entoure se stabilise.
* Les définitions PropTypes sont automatiquement supprimées des builds de production.

Si l'un ou l'autre de ces points vous concerne, les [notes de version 2.0.3](https://github.com/facebook/create-react-app/releases/tag/v2.0.3) contiennent des instructions plus détaillées à leur sujet.

## En savoir plus {#learn-more}

Vous pouvez trouver le journal complet des modifications dans les [notes de publication](https://github.com/facebook/create-react-app/releases/tag/v2.0.3). Il s'agissait d'une version touffue, et nous avons peut-être raté quelque chose. Veuillez signaler tout problème à notre [outil de suivi des problèmes] (https://github.com/facebook/create-react-app/issues/new) et nous essaierons de vous aider.

> Remarque
>
> Si vous avez utilisé des versions alpha 2.x, nous fournissons des [instructions de migration séparées].(https://gist.github.com/gaearon/8650d1c70e436e5eff01f396dffc4114) pour elles.

## Remerciements {#thanks}

Cette version ne serait pas possible sans notre merveilleuse communauté de contributeurs. Nous aimerions remercier [Andreas Cederström](https://github.com/andriijas), [Clement Hoang](https://github.com/clemmy), [Brian Ng](https://github.com/existentialism), [Kent C. Dodds](https://github.com/kentcdodds), [Ade Viankakrisna Fadlil](https://github.com/viankakrisna), [Andrey Sitnik](https://github.com/ai), [Ro Savage](https://github.com/ro-savage), [Fabiano Brito](https://github.com/Fabianopb), [Ian Sutherland](https://github.com/iansu), [Pete Nykänen](https://github.com/petetnt), [Jeffrey Posnick](https://github.com/jeffposnick), [Jack Zhao](https://github.com/bugzpodder), [Tobias Koppers](https://github.com/sokra), [Henry Zhu](https://github.com/hzoo), [Maël Nison](https://github.com/arcanis), [XiaoYan Li](https://github.com/lixiaoyan), [Marko Trebizan](https://github.com/themre), [Marek Suscak](https://github.com/mareksuscak), [Mikhail Osher](https://github.com/miraage), et beaucoup d'autres qui ont fourni des commentaires et des tests pour cette version.
