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
* Utilisation de bibliothèques tierces depuis npm.
* Détection précoce des erreurs courantes.
* L’édition à la volée du CSS et du JS en développement.
* Optimisation pour la production.

Les chaînes d'outils recommandées sur cette page **ne nécessitent aucune configuration pour démarrer**.

## Vous n'avez peut-être pas besoin d’une boîte à outils {#you-might-not-need-a-toolchain}

Si vous ne rencontrez pas les problèmes décrits ci-dessus ou si vous n'êtes pas encore à l'aise avec l'utilisation d'outils JavaScript, envisagez [d'ajouter React comme une simple balise `<script>` sur une page HTML](/docs/add-react-to-a-website.html), éventuellement [avec du JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx).

C'est également **la façon la plus simple d'intégrer React au sein d'un site web existant**. Vous pourrez toujours étendre votre chaîne d'outils si vous trouvez cela utile !

## Chaînes d'outils recommandées {#recommended-toolchains}

L'équipe React recommande en premier lieu ces solutions :

- Si vous **apprenez React** ou **créez une nouvelle [application web monopage](/docs/glossary.html#single-page-application)**, alors utilisez [Create React App](#create-react-app).
- Si vous construisez un **site web rendu côté serveur avec Node.js**, essayez [Next.js](#nextjs).
- Si vous construisez un **site web statique orienté sur le contenu**, essayez [Gatsby](#gatsby).
- Si vous construisez une **bibliothèque de composants** ou une **intégration avec du code déjà existant**, essayez [des chaînes d'outils plus flexibles](#more-flexible-toolchains).

### Create React App {#create-react-app}

[Create React App](http://github.com/facebookincubator/create-react-app) est un environnement confortable pour **apprendre React**, et représente la meilleure option pour démarrer **une nouvelle [application web monopage](/docs/glossary.html#single-page-application)** en React.

Il configure votre environnement de développement de façon à vous permettre d'utiliser les dernières fonctionnalités de JavaScript, propose une bonne expérience développeur et optimise votre application pour la production. Vous aurez besoin de Node >= 6 et npm >= 5.2 sur votre machine. Pour créer un projet, exécutez :

```bash
npx create-react-app mon-app
cd mon-app
npm start
```

>Note
>
>`npx` sur la première ligne n'est pas une faute de frappe -- c'est un [exécuteur de paquets qui est inclut dans npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Create React App ne prend pas en charge la logique côté serveur ni les bases de données ; il crée simplement une chaîne de construction pour la partie frontale, de telle façon que vous pouvez utiliser n'importe quel serveur de votre choix. Sous le capot, it utilise [Babel](http://babeljs.io/) et [webpack](https://webpack.js.org/), mais vous n'avez pas besoin de connaître ces outils.

Lorsque vous êtes prêt à déployer en production, exécuter `npm run build` créera une version optimisée de votre application dans le répertoire `build`. Vous pouvez en apprendre davantage sur Create React App [depuis son README](https://github.com/facebookincubator/create-react-app#create-react-app-) et son [guide utilisateur](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#table-of-contents).

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) est un framework populaire et léger pour les **applications statiques rendues côté serveur** construites avec React. Il inclut des solutions prêtes à l'emploi pour le **style et le routage**, et suppose que vous utilisez [Node.js](https://nodejs.org/) comme environnement de serveur.

Apprenez Next.js grâce à [son guide officiel](https://nextjs.org/learn/).

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) est la meilleure option pour créer des **sites web statiques** avec React. Il vous permet d'utiliser des composants React, mais génère du HTML et du CSS pré-rendus afin de garantir le temps de chargement le plus rapide.

Apprenez Gatsby grâce à [son guide officiel](https://www.gatsbyjs.org/docs/) et à une [collection de kits de démarrage](https://www.gatsbyjs.org/docs/gatsby-starters/).

### Chaînes d'outils plus flexibles {#more-flexible-toolchains}

Les chaînes d'outils suivantes offrent plus de flexibilité et de choix. Nous les recommandons pour les utilisateurs expérimentés :

- **[Neutrino](https://neutrinojs.org/)** combine la puissance de [webpack](https://webpack.js.org/) avec la simplicité des préréglages. Il inclut un préréglage pour les [applications React](https://neutrinojs.org/packages/react/) et les [composants React](https://neutrinojs.org/packages/react-components/).

- **[nwb](https://github.com/insin/nwb)** est particulièrement utile pour [publier des composants React pour npm](https://github.com/insin/nwb/blob/master/docs/guides/ReactComponents.md#developing-react-components-and-libraries-with-nwb). Il [peut également être utilisé](https://github.com/insin/nwb/blob/master/docs/guides/ReactApps.md#developing-react-apps-with-nwb) pour créer des applications React.

- **[Parcel](https://parceljs.org/)** est un empaqueteur d'applications web rapide et sans configuration qui [fonctionne avec React](https://parceljs.org/recipes.html#react).

- **[Razzle](https://github.com/jaredpalmer/razzle)** est un framework de rendu côté serveur qui ne requiert aucune configuration, mais offre plus de flexibilité que Next.js.

## Créer une chaîne d'outils à partir de rien {#creating-a-toolchain-from-scratch}

Une chaîne d'outils de construction en JavaScript consiste généralement en :

* Un **gestionnaire de paquets**, tel que [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/). Il vous permet de tirer parti d'un vaste écosystème de paquets tiers, et de les installer ou les mettre à jour facilement.

* Un **empaqueteur**, tel que [webpack](https://webpack.js.org/) ou [Parcel](https://parceljs.org/). Il vous permet d'écrire du code modulaire et de le regrouper en petits paquets permettant d'optimiser le temps de chargement.

* Un **compilateur** tel que [Babel](http://babeljs.io/). Il vous permet d'écrire du JavaScript moderne qui continuera à fonctionner dans les navigateurs les plus anciens.

Si vous préférez configurer votre propre chaîne d'outils JavaScript à partir de rien, [consultez ce guide](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) qui re-crée certaines des fonctionnalités de Create React App.

N'oubliez pas de vous assurer que votre chaîne d'outils personnalisée [est correctement configurée pour la production](/docs/optimizing-performance.html#use-the-production-build).
