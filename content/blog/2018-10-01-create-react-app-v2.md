---
title: "Create React App 2.0: Babel 7, Sass, et plus encore"
author: [timer, gaearon]
---

Create React App 2.0 a été publié aujourd'hui, et il apporte l'équivalent d'une année d'améliorations dans une seule mise à jour des dépendances.

Alors que React lui-même [ne nécessite aucune dépendance de compilation](/docs/create-a-new-react-app.html), il peut être difficile d'écrire une application complexe sans un lanceur de test rapide, un minificateur de production et une base de code modulaire. Depuis la toute première version, l'objectif de [Create React App](https://github.com/facebook/create-react-app) a été de vous aider à vous concentrer sur ce qui compte le plus -- votre code d'application -- et de gérer la compilation et la configuration des tests pour vous.

Bon nombre des outils sur lesquels elle s'appuie ont depuis publié de nouvelles versions contenant de nouvelles fonctionnalités et des améliorations de performance : [Babel 7](https://babeljs.io/blog/2018/08/27/7.0.0), [webpack 4](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4), et [Jest 23](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing.html). Cependant, les mettre à jour manuellement et les faire bien fonctionner ensemble demande beaucoup d'efforts. Et c'est exactement ce que les [contributeurs de Create React App 2.0](https://github.com/facebook/create-react-app/graphs/contributors) ont été occupés à faire ces derniers mois : **migrer la configuration et les dépendances pour que vous n'ayez pas à le faire vous-même.**

Maintenant que Create React App 2.0 n'est plus en beta, voyons ce qu'il y a de nouveau et comment vous pouvez l'essayer !
>Note
>
>Ne vous sentez pas obligé d'améliorer quoi que ce soit. Si vous êtes satisfait du jeu de fonctionnalités actuel, de ses performances et de sa fiabilité, vous pouvez continuer à utiliser la version à laquelle vous êtes actuellement ! Il peut également être une bonne idée de laisser la version 2.0 se stabiliser un peu avant de passer à celle-ci en production.

## Quoi de neuf {#whats-new}

Voici un bref résumé des nouveautés de cette version :

* 🎉 Plus d'options de style : vous pouvez utiliser [Sass](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-a-sass-stylesheet) et [des modules CSS](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-a-css-modules-stylesheet) tel quels.
* 🐠 Nous avons mis à jour [Babel 7](https://babeljs.io/blog/2018/08/27/7.0.0), y compris le support de la [syntaxe React fragment](/docs/fragments.html#short-syntax) et de nombreuses corrections de bogues.
* 📦 Nous avons mis à jour [webpack 4](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4), qui divise automatiquement les paquets JS de manière plus intelligente.
* 🃏 Nous avons mis à jour [Jest 23](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing.html), qui comprend un [mode interactif](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing#interactive-snapshot-mode) pour l'examen des snapshots.
* 💄 Nous avons ajouté [PostCSS](https://preset-env.cssdb.org/features#stage-3) afin que vous puissiez utiliser les nouvelles fonctionnalités CSS dans les anciens navigateurs.
* 💎 Vous pouvez utiliser [Apollo](https://github.com/leoasis/graphql-tag.macro#usage), [Relay Modern](https://github.com/facebook/relay/pull/2171#issuecomment-411459604), [MDX](https://github.com/facebook/create-react-app/issues/5149#issuecomment-425396995), et d'autres tiers [Babel Macros](https://babeljs.io/blog/2017/09/11/zero-config-with-babel-macros) transformations.
* 🌠 Vous pouvez maintenant [importer un SVG en tant que composant React](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-svgs) et utilisez-le dans JSX.
* 🐈 Vous pouvez essayer la mode expérimentale [Yarn Plug'n'Play](https://github.com/yarnpkg/rfcs/pull/101) qui supprime `node_modules`.
* 🕸 Vous pouvez maintenant [brancher votre propre implémentation de proxy](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#configuring-the-proxy-manually) en développement pour correspondre à votre API back-end.

* 🚀 Vous pouvez maintenant utiliser les [paquets écrits pour les dernières versions de Node](https://github.com/sindresorhus/ama/issues/446#issuecomment-281014491) sans casser la construction.
* ✂️ Vous pouvez maintenant opter pour un paquet CSS plus petit si vous prévoyez seulement de cibler les navigateurs modernes.
* 👷‍♀️ Les service workers sont maintenant opt-in et sont construits à l'aide de Google [Workbox].(https://developers.google.com/web/tools/workbox/).

**Toutes ces fonctions sont prêtes à l'emploi** -- pour les activer, suivez les instructions ci-dessous.

## Démarrer un projet avec Create React App 2.0 {#starting-a-project-with-create-react-app-20}

Vous n'avez pas besoin de mettre à jour quoi que ce soit de spécial. A partir d'aujourd'hui, lorsque vous lancez `create-react-app` il utilisera la version 2.0 du template par défaut. Amusez-vous bien !

Si vous voulez **utiliser l'ancien modèle 1.x** pour une raison quelconque, vous pouvez le faire en passant `--scripts-version=react-scripts@1.x` comme argument pour `create-react-app`.

## Mise à jour d'un projet Create React App 2.0 {#updating-a-project-to-create-react-app-20}

Upgrading a non-ejected project to Create React App 2.0 should usually be straightforward. Open `package.json` in the root of your project and find `react-scripts` there.

Then change its version to `2.0.3`:

```js{2}
  // ... other dependencies ...
  "react-scripts": "2.0.3"
```

Run `npm install` (or `yarn`, if you use it). **For many projects, this one-line change is sufficient to upgrade!**

<blockquote class="twitter-tweet" data-conversation="none" data-dnt="true"><p lang="en" dir="ltr">working here... thanks for all the new functionality 👍</p>&mdash; Stephen Haney (@sdothaney) <a href="https://twitter.com/sdothaney/status/1046822703116607490?ref_src=twsrc%5Etfw">October 1, 2018</a></blockquote>

Here are a few more tips to get you started.

**When you run `npm start` for the first time after the upgrade,** you'll get a prompt asking about which browsers you'd like to support. Press `y` to accept the default ones. They'll be written to your `package.json` and you can edit them any time. Create React App will use this information to produce smaller or polyfilled CSS bundles depending on whether you target modern browsers or older browsers.

**If `npm start` still doesn't quite work for you after the upgrade,** [check out the more detailed migration instructions in the release notes](https://github.com/facebook/create-react-app/releases/tag/v2.0.3). There *are* a few breaking changes in this release but the scope of them is limited, so they shouldn't take more than a few hours to sort out. Note that **[support for older browsers](https://github.com/facebook/create-react-app/blob/master/packages/react-app-polyfill/README.md) is now opt-in** to reduce the polyfill size.

**If you previously ejected but now want to upgrade,** one common solution is to find the commits where you ejected (and any subsequent commits changing the configuration), revert them, upgrade, and later optionally eject again. It's also possible that the feature you ejected for (maybe Sass or CSS Modules?) is now supported out of the box.

>Note
>
>Due to a possible bug in npm, you might see warnings about unsatisfied peer dependencies. You should be able to ignore them. As far as we're aware, this issue isn't present with Yarn.

## Breaking Changes {#breaking-changes}

Here's a short list of breaking changes in this release:

* Node 6 is no longer supported.
* Support for older browsers (such as IE 9 to IE 11) is now opt-in with a [separate package](https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill).
* Code-splitting with `import()` now behaves closer to specification, while `require.ensure()` is disabled.
* The default Jest environment now includes jsdom.
* Support for specifying an object as `proxy` setting was replaced with support for a custom proxy module.
* Support for `.mjs` extension was removed until the ecosystem around it stabilizes.
* PropTypes definitions are automatically stripped out of the production builds.

If either of these points affects you, [2.0.3 release notes](https://github.com/facebook/create-react-app/releases/tag/v2.0.3) contain more detailed instructions.

## Learn More {#learn-more}

You can find the full changelog in the [release notes](https://github.com/facebook/create-react-app/releases/tag/v2.0.3). This was a large release, and we may have missed something. Please report any problems to our [issue tracker](https://github.com/facebook/create-react-app/issues/new) and we'll try to help.

>Note
>
>If you've been using 2.x alpha versions, we provide [separate migration instructions](https://gist.github.com/gaearon/8650d1c70e436e5eff01f396dffc4114) for them.

## Thanks {#thanks}

This release wouldn't be possible without our wonderful community of contributors. We'd like to thank [Andreas Cederström](https://github.com/andriijas), [Clement Hoang](https://github.com/clemmy), [Brian Ng](https://github.com/existentialism), [Kent C. Dodds](https://github.com/kentcdodds), [Ade Viankakrisna Fadlil](https://github.com/viankakrisna), [Andrey Sitnik](https://github.com/ai), [Ro Savage](https://github.com/ro-savage), [Fabiano Brito](https://github.com/Fabianopb), [Ian Sutherland](https://github.com/iansu), [Pete Nykänen](https://github.com/petetnt), [Jeffrey Posnick](https://github.com/jeffposnick), [Jack Zhao](https://github.com/bugzpodder), [Tobias Koppers](https://github.com/sokra), [Henry Zhu](https://github.com/hzoo), [Maël Nison](https://github.com/arcanis), [XiaoYan Li](https://github.com/lixiaoyan), [Marko Trebizan](https://github.com/themre), [Marek Suscak](https://github.com/mareksuscak), [Mikhail Osher](https://github.com/miraage), and many others who provided feedback and testing for this release.
