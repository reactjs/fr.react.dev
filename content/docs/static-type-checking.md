---
id: static-type-checking
title: La validation de types statique
permalink: docs/static-type-checking.html
---

Les systèmes de typage statique tels que [Flow](https://flow.org/) et [TypeScript](https://www.typescriptlang.org/) parviennent à identifier certains types de problèmes avant même d’exécuter votre code. Ils peuvent aussi améliorer le processus de travail des développeurs en y ajoutant des assistances telles que l'auto-complétion. C'est pourquoi nous recommandons l'utilisation de Flow ou TypeScript au lieu des `PropTypes` pour les grandes bases de code source.

## Flow {#flow}

[Flow](https://flow.org/) est un système de typage statique pour votre code JavaScript. Il est développé chez Facebook et souvent utilisé avec React. Il permet d'annoter les variables, fonctions et composants React avec une syntaxe spéciale de typage, et de déceler préventivement les erreurs. Vous pouvez lire [cette introduction à Flow](https://flow.org/en/docs/getting-started/) pour en apprendre les bases.

Pour utiliser Flow, vous devrez :

* Ajouter Flow comme dépendance dans votre projet.
* Vous assurer que la syntaxe Flow soit bien enlevée du code, une fois compilé.
* Ajouter les annotations de typage et lancer Flow pour les vérifier.

Nous allons vous expliquer ces étapes en détail ci-dessous.

### Ajouter Flow à un projet {#adding-flow-to-a-project}

Premièrement, naviguez vers le dossier de votre projet dans le terminal (ou l'invite de commandes). Vous allez devoir exécuter la commande suivante :

Si vous utilisez [Yarn](https://yarnpkg.com/) :

```bash
yarn add --dev flow-bin
```

Si vous utilisez [npm](https://www.npmjs.com/) :

```bash
npm install --save-dev flow-bin
```

Cette commande installe la dernière version de Flow dans votre projet.

Maintenant, ajoutez `flow` à la section `"scripts"` de votre `package.json` afin de pouvoir l'utiliser dans votre terminal :

```js{4}
{
  // ...
  "scripts": {
    "flow": "flow",
    // ...
  },
  // ...
}
```

Enfin, exécutez l'une des commandes suivantes :

Si vous utilisez [Yarn](https://yarnpkg.com/) :

```bash
yarn run flow init
```

Si vous utilisez [npm](https://www.npmjs.com/) :

```bash
npm run flow init
```

Cette commande va créer un fichier de configuration Flow qu'il va falloir ajouter à la gestion de versions de votre code source.

### Retirer la syntaxe Flow du code compilé {#stripping-flow-syntax-from-the-compiled-code}

Flow est une extension du langage JavaScript avec une syntaxe spéciale pour les annotations de type. Cependant les navigateurs ne connaissent pas cette syntaxe. Nous devons donc nous assurer qu'elle ne finisse pas dans le *bundle* de JavaScript compilé qui sera à terme envoyé au navigateur.

Le procédé exact pour y arriver dépend des outils que vous utilisez pour compiler votre code source JavaScript.

#### Create React App {#create-react-app}

Si vous avez utilisé [Create React App](https://github.com/facebookincubator/create-react-app) pour initialiser votre projet, félicitations ! Dans ce scénario, les annotations Flow sont déjà retirées par défaut, donc vous n'avez rien à faire de plus pour cette étape.

#### Babel {#babel}

>Remarque
>
>Ces instructions *ne sont pas adaptées* aux utilisateurs de Create React App. Bien que Create React App utilise Babel en interne, il est déjà configuré pour comprendre Flow. Ne suivez cette étape que si vous n'utilisez *pas* Create React App.

Si vous avez configuré Babel manuellement pour votre projet, il vous faudra ajouter un *preset* spécial pour prendre en charge Flow.

Si vous utilisez [Yarn](https://yarnpkg.com/), exécutez :

```bash
yarn add --dev @babel/preset-flow
```

Si vous utilisez [npm](https://www.npmjs.com/), exécutez :

```bash
npm install --save-dev @babel/preset-flow
```

Ensuite, ajoutez le preset `flow` à votre [configuration Babel](https://babeljs.io/docs/usage/babelrc/). Par exemple, si vous configurez Babel avec le ficher `.babelrc`, ça pourrait ressembler à ceci :

```js{3}
{
  "presets": [
    "@babel/preset-flow",
    "react"
  ]
}
```

De cette façon, vous pourrez utiliser la syntaxe Flow dans votre code.

>Remarque
>
>Il n'est pas nécessaire d'avoir le preset `react` afin d'utiliser Flow, mais ils sont souvent utilisés ensemble. Flow comprend déjà quant à lui la syntaxe JSX.

#### Autres configurations {#other-build-setups}

Si vous n'utilisez ni Create React App, ni Babel, vous pouvez utiliser [flow-remove-types](https://github.com/flowtype/flow-remove-types) pour enlever les annotations de type.

### Exécuter Flow {#running-flow}

Si vous avez bien suivi les instructions ci-dessus, vous devriez être prêt·e à exécuter Flow pour la première fois.

Si vous utilisez [Yarn](https://yarnpkg.com/), exécutez :

```bash
yarn flow
```

Si vous utilisez [npm](https://www.npmjs.com/), exécutez :

```bash
npm run flow
```

Vous devriez voir apparaître un message similaire à celui-ci :

```
No errors!
✨  Done in 0.17s.
```

### Ajouter des annotations de type Flow {#adding-flow-type-annotations}

Par défaut, Flow ne vérifie que les fichiers qui contiennent cette annotation :

```js
// @flow
```

Elle est habituellement placée au début du document. Essayez de l'ajouter à quelques fichiers dans votre projet, et exécutez `yarn flow` ou `npm run flow` pour voir si Flow a déjà découvert des problèmes.

Il existe aussi [une option](https://flow.org/en/docs/config/options/#toc-all-boolean) pour forcer Flow à vérifier *tous* les fichiers, même sans l'annotation. Ça peut être trop pour des projets existants, mais raisonnable pour un nouveau projet si vous souhaitez le typer avec Flow de façon intégrale.

Vous êtes paré·e ! Nous vous conseillons d'aller voir les ressources suivantes pour en apprendre davantage sur Flow :

* [Documentation Flow : les annotations de type](https://flow.org/en/docs/types/)
* [Documentation Flow : éditeurs de code](https://flow.org/en/docs/editors/)
* [Documentation Flow : React](https://flow.org/en/docs/react/)
* [Le linting avec Flow](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## TypeScript {#typescript}

[TypeScript](https://www.typescriptlang.org/) est un langage de programmation développé par Microsoft. C'est un sur-ensemble typé de JavaScript, et il fournit son propre compilateur. Étant un langage typé, TypeScript peut trouver des erreurs et bugs lors de la compilation, bien avant que l'application ne soit déployée. Vous trouverez plus d'informations sur l'utilisation de TypeScript avec React [ici](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

Pour utiliser TypeScript, vous devez :
* Ajouter la dépendance TypeScript dans votre projet
* Configurer les options du compilateur TypeScript
* Utiliser les extensions appropriées pour vos fichiers
* Ajouter les définitions de type pour les bibliothèques que vous utilisez

Voyons ça plus en détail.

### Utiliser TypeScript avec Create React App {#using-typescript-with-create-react-app}

Create React App prend déjà en charge TypeScript.

Pour créer un **nouveau projet** avec la prise en charge de TypeScript, exécutez :

```bash
npx create-react-app my-app --template typescript
```

Vous pouvez aussi l'ajouter à **un projet Create React App existant**, [comme documenté ici](https://facebook.github.io/create-react-app/docs/adding-typescript).

>Remarque
>
>Si vous utilisez Create React App, vous pouvez **sauter le reste de cette page**. Elle décrit l'installation manuelle qui ne s'applique pas aux utilisateurs de Create React App.


### Ajouter TypeScript à un projet {#adding-typescript-to-a-project}
On commence par exécuter une commande dans le terminal.

Si vous utilisez [Yarn](https://yarnpkg.com/) :

```bash
yarn add --dev typescript
```

Si vous utilisez [npm](https://www.npmjs.com/) :

```bash
npm install --save-dev typescript
```

Félicitations ! Vous venez d'installer la dernière version de TypeScript dans votre projet. L'installation de TypeScript rend disponible la commande `tsc`. Avant de traiter la configuration, ajoutons `tsc` à la section `"scripts"` de notre `package.json` :

```js{4}
{
  // ...
  "scripts": {
    "build": "tsc",
    // ...
  },
  // ...
}
```

### Configurer le compilateur TypeScript {#configuring-the-typescript-compiler}
Le compilateur ne nous aidera pas tant qu'on ne lui aura pas dit quoi faire. En TypeScript, ces règles sont définies dans un fichier spécial appelé `tsconfig.json`. Pour générer ce fichier :

Si vous utilisez [Yarn](https://yarnpkg.com/), exécutez :

```bash
yarn run tsc --init
```

Si vous utilisez [npm](https://www.npmjs.com/), exécutez :

```bash
npx tsc --init
```

Allez voir le `tsconfig.json` qui vient d'être généré : vous voyez qu’il y a de nombreuses options qu'on peut utiliser pour configurer le compilateur. Pour une explication détaillée des options, voyez [cette page](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

Parmi les nombreuses options, nous allons regarder `rootDir` et `outDir`. Conformément à son rôle, le compilateur accepte des fichiers TypeScript et génère des fichiers JavaScript. Mais nous ne voudrions pas confondre les fichiers sources avec le résultat de la compilation.

Nous allons régler ça en deux étapes :
* D'abord, réorganisons notre projet. Nous allons placer tout notre code source à l’intérieur du dossier `src`.

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

* Ensuite, nous allons dire au compilateur où se trouve notre code source et où déposer le résultat.

```js{6,7}
// tsconfig.json

{
  "compilerOptions": {
    // ...
    "rootDir": "src",
    "outDir": "build"
    // ...
  },
}
```

Génial ! Désormais, quand on exécute notre script, le compilateur va déposer le JS généré dans le dossier `build`. Le [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json) fournit un `tsconfig.json` avec un bon ensemble de règles pour vous aider à démarrer.

En règle générale, vous ne souhaitez pas enregistrer le JS généré dans votre système de gestion de versions, aussi veillez à bien ajouter le dossier de sortie dans votre `.gitignore`.

### Extensions de fichiers {#file-extensions}

Avec React, vous écrivez probablement vos composants dans un fichier `.js`. En TypeScript, il existe deux extensions de fichier : `.ts` est l'extension par défaut, tandis que `.tsx` est une extension spéciale pour les fichiers qui contiennent du JSX.

### Exécuter TypeScript {#running-typescript}

Si vous avez bien suivi les instructions ci-dessus, vous devriez pouvoir exécuter TypeScript pour la première fois.

Si vous utilisez [Yarn](https://yarnpkg.com/) :

```bash
yarn build
```

Si vous utilisez [npm](https://www.npmjs.com/) :

```bash
npm run build
```

Si aucun message ne s'affiche, ça veut dire que tout a bien fonctionné.


### Définitions de types {#type-definitions}

Afin de pouvoir afficher les erreurs et conseils des autres modules, le compilateur a besoin de fichiers de déclarations. Un fichier de déclarations contient toutes les informations de typage d'une bibliothèque. Ça nous permet d'utiliser dans notre projet des bibliothèques JS telles que celles que l'on trouve sur npm.

Il y a deux façons principales d'obtenir les déclarations de types d'une bibliothèque :

__Inclue__ – La bibliothèque fournit déjà son fichier de déclarations. Ça nous arrange, il nous suffira d'installer la bibliothèque et nous pourrons l'utiliser sans tarder. Pour déterminer si une bibliothèque contient ses types, cherchez un fichier `index.d.ts` dans son projet. Certaines bibliothèques l'annoncent dans leur `package.json` avec le champ `typings` ou `types`.

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ – DefinitelyTyped est un énorme référentiel de déclarations pour les bibliothèques qui n’incluent pas leur fichier de déclarations. Les déclarations sont faites par  tout le monde et gérées par Microsoft et des contributeurs en logiciel libre. React par exemple n'inclut pas de fichier de déclarations, mais on peut l'obtenir sur DefinitelyTyped. Pour ce faire, exécutez cette commande dans votre terminal.

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__Déclarations locales__ – Parfois, un module que vous souhaitez utiliser ne contient pas de déclarations et n'est pas non plus disponible sur DefinitelyTyped. Dans ce cas, on peut créer un fichier de déclarations local. Créez un fichier `declarations.d.ts` à la racine de votre dossier source. Une déclaration simple pourrait ressembler à ceci :

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

Vous êtes maintenant prêt·e à écrire du code ! Nous vous conseillons de jeter un coup d’œil aux ressources suivantes pour en apprendre davantage sur TypeScript :

* [Documentation TypeScript : les types de base](https://www.typescriptlang.org/docs/handbook/basic-types.html)
* [Documentation TypeScript : migrer depuis JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [Documentation TypeScript : React et Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## Reason {#reason}

[Reason](https://reasonml.github.io/) n'est pas un nouveau langage, c'est une nouvelle syntaxe et une boîte à outils par-dessus le langage reconnu [OCaml](https://ocaml.org/). Reason donne à OCaml une syntaxe qui plaira aux développeurs JavaScript, et s’intègre bien avec les processus de développement basés sur npm et Yarn que les développeurs utilisent quotidiennement.

Reason est développé chez Facebook, qui l’utilise pour certains de ses produits tels que Messenger. Il est encore relativement expérimental mais a des [intégrations React dédiées](https://reasonml.github.io/reason-react/) maintenues par Facebook et par une [communauté dynamique](https://reasonml.github.io/docs/en/community.html).

## Kotlin {#kotlin}

[Kotlin](https://kotlinlang.org/) est un langage au typage statique développé par JetBrains. Ses plateformes cibles sont entre autres la JVM, Android, LLVM et [JavaScript](https://kotlinlang.org/docs/reference/js-overview.html).

JetBrains développe et maintient certains outils spécialement pour la communauté React : des [intégrations React](https://github.com/JetBrains/kotlin-wrappers) ainsi que [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app). Ce dernier est conçu pour vous aider à commencer à construire des applications React avec Kotlin sans avoir à vous farcir une configuration de construction.

## Autres langages {#other-languages}

Remarquez qu'il existe d'autres langages au typage statique qui compilent vers JavaScript et sont donc compatibles avec React. Par exemple, [F#/Fable](https://fable.io/) avec [elmish-react](https://elmish.github.io/react). Allez voir leurs sites respectifs pour plus d'informations et n'hésitez pas à ajouter sur cette page d'autres langages au typage statique fonctionnant avec React !
