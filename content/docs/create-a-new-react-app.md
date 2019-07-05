---
id: create-a-new-react-app
title: Créer une nouvelle appli React
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

Utilisez une boîte à outils intégrée pour la meilleure expérience utilisateur et développeur possible.

Cette page décrit quelques boîtes à outils populaires qui facilitent les tâches telles que :

* La montée à l'échelle avec de nombreux fichiers et composants.
* L'utilisation de bibliothèques tierces depuis npm.
* La détection précoce des erreurs courantes.
* L’édition à la volée du CSS et du JS en développement.
* L'optimisation pour la production.

Les boîtes à outils recommandées sur cette page **ne nécessitent aucune configuration pour démarrer**.

## Vous n'avez peut-être pas besoin d’une boîte à outils {#you-might-not-need-a-toolchain}

Si vous ne rencontrez pas les problèmes décrits ci-dessus ou si vous n'êtes pas encore à l'aise avec l'utilisation d'outils JavaScript, envisagez [d'ajouter React comme une simple balise `<script>` sur une page HTML](/docs/add-react-to-a-website.html), éventuellement [avec du JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx).

C'est également **la façon la plus simple d'intégrer React au sein d'un site web existant**. Vous pourrez toujours étendre votre outillage si ça vous semble utile !

## Boîtes à outils recommandées {#recommended-toolchains}

L'équipe React recommande en premier lieu ces solutions :

- Si vous **apprenez React** ou **créez une nouvelle [application web monopage](/docs/glossary.html#single-page-application)**, alors utilisez [Create React App](#create-react-app).
- Si vous construisez un **site web rendu côté serveur avec Node.js**, essayez [Next.js](#nextjs).
- Si vous construisez un **site web statique orienté contenu**, essayez [Gatsby](#gatsby).
- Si vous construisez une **bibliothèque de composants** ou une **intégration avec du code déjà existant**, essayez [des boîtes à outils plus flexibles](#more-flexible-toolchains).

### Create React App {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app) est un environnement confortable pour **apprendre React**, et constitue la meilleure option pour démarrer **une nouvelle [application web monopage](/docs/glossary.html#single-page-application)** en React.

Il configure votre environnement de développement de façon à vous permettre d'utiliser les dernières fonctionnalités de JavaScript, propose une expérience développeur agréable et optimise votre application pour la production. Vous aurez besoin de Node >= 8.10 et de npm >= 5.6 sur votre machine. Pour créer un projet, exécutez :

```bash
npx create-react-app mon-app
cd mon-app
npm start
```

> Remaque :
>
> `npx` sur la première ligne n'est pas une faute de frappe -- c'est un [exécuteur de paquets qui est inclus dans npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Create React App ne prend pas en charge la logique côté serveur ni les bases de données ; il crée simplement une chaîne de construction pour la partie frontale, de sorte que vous pouvez utiliser le serveur de votre choix. Sous le capot, il utilise [Babel](https://babeljs.io/) et [webpack](https://webpack.js.org/), mais vous n'avez pas besoin de connaître ces outils.

Lorsque vous êtes prêt·e à déployer en production, exécutez `npm run build` pour créer une version optimisée de votre application dans le répertoire `build`. Vous pouvez en apprendre davantage sur Create React App [dans son README](https://github.com/facebookincubator/create-react-app#create-react-app--) et son [guide utilisateur](https://facebook.github.io/create-react-app/).

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) est un framework populaire et léger pour les **applications statiques rendues côté serveur** construites avec React. Il fournit des solutions prêtes à l'emploi pour **les styles et le routage**, et suppose que vous utilisez [Node.js](https://nodejs.org/) comme environnement serveur.

Apprenez Next.js grâce à [son guide officiel](https://nextjs.org/learn/).

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) est la meilleure option pour créer des **sites web statiques** avec React. Il vous permet d'utiliser des composants React, mais génère du HTML et du CSS pré-rendus afin de garantir le temps de chargement le plus rapide.

Apprenez Gatsby grâce à [son guide officiel](https://www.gatsbyjs.org/docs/) et à une [collection de kits de démarrage](https://www.gatsbyjs.org/docs/gatsby-starters/).

### Boîtes à outils plus flexibles {#more-flexible-toolchains}

Les boîtes à outils suivantes offrent plus de flexibilité et de choix. Nous les recommandons pour les utilisateurs expérimentés :

- **[Neutrino](https://neutrinojs.org/)** combine la puissance de [webpack](https://webpack.js.org/) avec la simplicité des préréglages. Il inclut un préréglage pour les [applications React](https://neutrinojs.org/packages/react/) et les [composants React](https://neutrinojs.org/packages/react-components/).
- **[nwb](https://github.com/insin/nwb)** est particulièrement utile pour [publier des composants React sur npm](https://github.com/insin/nwb/blob/master/docs/guides/ReactComponents.md#developing-react-components-and-libraries-with-nwb). Il [peut également être utilisé](https://github.com/insin/nwb/blob/master/docs/guides/ReactApps.md#developing-react-apps-with-nwb) pour créer des applications React.
- **[Parcel](https://parceljs.org/)** est un *bundler* d'applications web rapide et sans configuration qui [fonctionne avec React](https://parceljs.org/recipes.html#react).
- **[Razzle](https://github.com/jaredpalmer/razzle)** est un framework de rendu côté serveur qui ne requiert aucune configuration, mais offre plus de flexibilité que Next.js.

## Créer une boîte à outils à partir de zéro {#creating-a-toolchain-from-scratch}

Une boîte à outils de construction en JavaScript comprend généralement :

* Un **gestionnaire de paquets**, tel que [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/). Il vous permet de tirer parti d'un vaste écosystème de paquets tiers, et de les installer ou les mettre à jour facilement.

* Un **_bundler_**, tel que [webpack](https://webpack.js.org/) ou [Parcel](https://parceljs.org/). Il vous permet d'écrire du code modulaire et de le regrouper en petits paquets permettant d'optimiser le temps de chargement.

* Un **compilateur** tel que [Babel](https://babeljs.io/). Il vous permet d'écrire du JavaScript moderne qui fonctionnera quand même dans les navigateurs les plus anciens.

Si vous préférez configurer votre propre boîte à outils JavaScript à partir de zéro, [jetez un œil à ce guide](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) qui re-crée certaines des fonctionnalités de Create React App.

Pensez à vous assurer que votre outillage personnalisé [est correctement configuré pour la production](/docs/optimizing-performance.html#use-the-production-build).
