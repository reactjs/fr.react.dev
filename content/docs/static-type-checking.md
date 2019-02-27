---
id: static-type-checking
title: La validation de types statique
permalink: docs/static-type-checking.html
prev: typechecking-with-proptypes.html
next: refs-and-the-dom.html
---

Les systèmes de typage statique tels que [Flow](https://flow.org/) et [TypeScript](https://www.typescriptlang.org/) parviennent à identifier certains types de problèmes avant même de lancer votre code. Ils peuvent aussi améliorer le processus de travail du développeur en y ajoutant des fonctionalités telles que l'autocomplétion. C'est pourquoi nous recommendons l'usage de Flow ou TypeScript au lieu des `PropTypes` pour les grandes bases de code source.

## Flow {#flow}

[Flow](https://flow.org/) est un système de typage statique pour votre code JavaScript. Il est développé à Facebook et est souvent utilisé avec React. Il permet d'annoter les variables, fonctions et composants React avec une syntaxe spéciale de typage, et de déceler les erreurs tôt. Vous pouvez lire [cette introduction à Flow](https://flow.org/en/docs/getting-started/) pour en apprendre les bases.

Pour utiliser Flow, vous devrez :
* Ajouter Flow comme dépendence à votre projet.
* Vous assurer que la syntaxe Flow soie bien enlevée du code, une fois compilé.
* Ajouter les notations de typage et lancer Flow pour les vérifier.

Nous alons vous expliquer ces étapes en détail ci-dessous.

### Ajouter Flow à un projet {#adding-flow-to-a-project}

Premièrement, naviguez vers le dossier de votre projet dans le terminal. Vous allez devoir exécuter la commande suivante :

Si vous utilisez [Yarn](https://yarnpkg.com/), exécutez :

```bash
yarn add --dev flow-bin
```

Si vous utilisez [npm](https://www.npmjs.com/), exécutez :

```bash
npm install --save-dev flow-bin
```

Cette commande installe la dernière version de Flow dans votre projet.

Maintenant, ajoutez `flow` à la section `"scripts"` de votre `package.json` afin de pouvoir l'utiliser dans votre terminal.

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

Enfin, exécutez l'une des commandes suivantes :

Si vous utilisez [Yarn](https://yarnpkg.com/), exécutez :

```bash
yarn run flow init
```

Si vous utilisez [npm](https://www.npmjs.com/), exécutez :

```bash
npm run flow init
```

Cette commande va créer un fichier de configuration Flow qu'il va falloir ajouter en commit.

### Enlever la syntaxe Flow du code compilé {#stripping-flow-syntax-from-the-compiled-code}

Flow est une extension du langage JavaScript avec une syntaxe spéciale pour les annotations de type. Cependant les navigateurs ne connaissent pas cette syntaxe. Nous devons donc nous assurer qu'elle ne finisse pas dans le bundle de JavaScript compilé qui sera envoyé au navigateur.

Le procédé exact pour y arriver dépend des outils que vous utilisez pour compiler le JavaScript.

#### Create React App {#create-react-app}

Si vous avez utilisé [Create React App](https://github.com/facebookincubator/create-react-app) pour initialiser votre projet, félicitations ! Les annotations Flow sont déjà enlevées par défaut, donc vous n'avez rien à faire de plus pour cette étape.

#### Babel {#babel}

>Note:
>
>Ces instructions ne sont pas dédiées aux utilisateurs de Create React App. Bien que Create React App utilise Babel sous le capot, il est déjà configuré pour comprendre Flow. Ne suivez cette étape que si vous n'utilisez *pas* Create React App.

Si vous avez configuré Babel manuellement pour votre projet, il vous faudra un preset spécial pour Flow.

Si vous utilisez Yarn, exécutez :

```bash
yarn add --dev babel-preset-flow
```

Si vous utilisez npm, exécutez :

```bash
npm install --save-dev babel-preset-flow
```

Ensuite, ajoutez le preset `flow` à votre [configuration Babel](https://babeljs.io/docs/usage/babelrc/). Par exemple, si vous configurez Babel avec le ficher `.babelrc`, cela pourrait ressembler à ça :

```js{3}
{
  "presets": [
    "flow",
    "react"
  ]
}
```

De cette façon, vous pourrez utiliser la syntaxe Flow dans votre code.

>Note:
>
>Il n'est pas nécessaire d'avoir le preset `react` afin d'utiliser Flow, mais ils sont souvent utilisés ensemble. Flow comprend la syntaxe JSX par défaut.

#### Autres configurations de build {#other-build-setups}
#### Other Build Setups {#other-build-setups}

Si vous n'utilisez ni Create React App, ni Babel, vous pouvez utiliser [flow-remove-types](https://github.com/flowtype/flow-remove-types) pour enlever les annotations de type.

### Exeécuter Flow {#running-flow}

Si vous avez bien suivi les instructions ci-dessus, vous devriez être prêt·e à exécuter Flow pour la première fois.

```bash
yarn flow
```

Si vous utilisez npm, exécutez :

```bash
npm run flow
```

Vous devriez voir apparaître un message tel que celui-ci :

```
No errors!
✨  Done in 0.17s.
```

### Ajouter Flow aux annotations de type {#adding-flow-type-annotations}

Par défaut, Flow ne vérifie que les fichiers qui comprennent cette annotation :

```js
// @flow
```

Elle est habituellement placée au début du document. Essayez de l'ajouter à quelques fichiers dans votre projet, et exécutez `yarn flow` ou `npm run flow` pour voir si Flow a déjà découvert des problèmes.

Il existe aussi [une option](https://flow.org/en/docs/config/options/#toc-all-boolean) pour forcer Flow à vérifier *tous* les fichiers, même sans l'annotation. Ça peut être trop pour des projets préexistants, mais raisonnable pour un nouveau projet si vous souhaitez le typer avec Flow de facçon intégrale.
There is also [an option](https://flow.org/en/docs/config/options/#toc-all-boolean) to force Flow to check *all* files regardless of the annotation. This can be too noisy for existing projects, but is reasonable for a new project if you want to fully type it with Flow.

Vous êtes paré ! Nous vous recommendons d'aller voir les ressources suivantes pour en apprendre davantage sur Flow:

* [Documentation Flow : Les annotations de type](https://flow.org/en/docs/types/)
* [Documentation Flow : Editeurs](https://flow.org/en/docs/editors/)
* [Documentation Flow : React](https://flow.org/en/docs/react/)
* [Le linting avec Flow](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## TypeScript {#typescript}

[TypeScript](https://www.typescriptlang.org/) un langage de programmation dévloppé par Microsoft. C'est un sur-ensemble typé de JavaScript, et il inclut son propre compileur. Étant un langage typé, TypeScript peut attraper les erreurs et bugs lors de la compilation, bien avant que l'application ne soie mise en ligne. Vous trouverez plus d'informations au sujet de l'utilisation de TypeScript avec React [ici](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

Pour utiliser TypeScript, vous devez :
* Ajouter la deépendance TypeScript à votre projet
* Configurer les options du compileur TypeScript
* Utiliser les extenstions de fichier correctes
* Ajouter les définitions de type pour les librairies que vous utilisez

Voyons cela plus en détail.

### Utiliser TypeScript avec Create React App {#using-typescript-with-create-react-app}

Create React App supporte TypeScript clés en main.

Pour créer un **nouveau projet** avec le support TypeScript, exécutez :

```bash
npx create-react-app my-app --typescript
```

Vous pouvez aussi l'ajouter à **un projet Create React App déjà existant**, [comme documenté ici](https://facebook.github.io/create-react-app/docs/adding-typescript).

>Note:
>
>Si vous utilisez Create React App, vous pouvez **passer le reste de cette page**. Elle décrit l'installation manuelle qui ne s'applique pas aux utilisateurs de Create React App.


### Ajouter TypeScript à un projet {#adding-typescript-to-a-project}
On commence par exécuter une commande dans votre terminal.

Si vous utilisez [Yarn](https://yarnpkg.com/), exécutez :

```bash
yarn add --dev typescript
```

Si vous utilisez [npm](https://www.npmjs.com/), exécutez :

```bash
npm install --save-dev typescript
```

Félicitations ! Vous venez d'installer la dernière version de TypeScript dans votre projet. L'installation de TypeScript rend disponible la commande `tsc`. Avant configuration, ajoutons `tsc` à la section `"scripts"` de notre `package.json` :

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

### Configurer le compileur TypeScript {#configuring-the-typescript-compiler}
Le compileur est inutile tant qu'on ne lui a pas dit quoi faire. En TypeScript, ces régles sont définies dans un fichier spécial appelé `tsconfig.json`. Pour générer ce fichier :

Si vous utilisez [Yarn](https://yarnpkg.com/), exécutez :

```bash
yarn run tsc --init
```

Si vous utilisez [npm](https://www.npmjs.com/), exécutez :

```bash
npx tsc --init
```

Allons voir `tsconfig.json` qui vient d'être généré, vous voyez les nombreuses options que l'on peut utiliser pour configurer le compileur. Pour une explication détaillée des options, voyez [cette page](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

Parmi les nombreuses options, nous allons regarder `rootDir` et `outDir`. Conformément à son rôle, le compileur accepte les fichiers typescript et génère des fichiers javascript. Cela dit, nous ne voudrions pas confondre les fichiers source avec le résultat généré.

Nous allons régler ça en deux étapes :
* Premièrement, réorganisons notre projet. Nous allons placer tout notre code source dans le dossier `src`.

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

* Ensuite, nous allons dire au compileur où se trouve notre code et où placer le résultat.

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

Great! Now when we run our build script the compiler will output the generated javascript to the `build` folder. The [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json) provides a `tsconfig.json` with a good set of rules to get you started.

Generally, you don't want to keep the generated javascript in your source control, so be sure to add the build folder to your `.gitignore`.

### File extensions {#file-extensions}
In React, you most likely write your components in a `.js` file. In TypeScript we have 2 file extensions:

`.ts` is the default file extension while `.tsx` is a special extension used for files which contain `JSX`.

### Running TypeScript {#running-typescript}

If you followed the instructions above, you should be able to run TypeScript for the first time.

Si vous utilisez Yarn, exécutez :

```bash
yarn build
```

Si vous utilisez npm, exécutez :

```bash
npm run build
```

If you see no output, it means that it completed successfully.


### Type Definitions {#type-definitions}
To be able to show errors and hints from other packages, the compiler relies on declaration files. A declaration file provides all the type information about a library. This enables us to use javascript libraries like those on npm in our project. 

There are two main ways to get declarations for a library:

__Bundled__ - The library bundles its own declaration file. This is great for us, since all we need to do is install the library, and we can use it right away. To check if a library has bundled types, look for an `index.d.ts` file in the project. Some libraries will have it specified in their `package.json` under the `typings` or `types` field.

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ - DefinitelyTyped is a huge repository of declarations for libraries that don't bundle a declaration file. The declarations are crowd-sourced and managed by Microsoft and open source contributors. React for example doesn't bundle its own declaration file. Instead we can get it from DefinitelyTyped. To do so enter this command in your terminal.

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__Local Declarations__
Sometimes the package that you want to use doesn't bundle declarations nor is it available on DefinitelyTyped. In that case, we can have a local declaration file. To do this, create a `declarations.d.ts` file in the root of your source directory. A simple declaration could look like this:

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

You are now ready to code! We recommend to check out the following resources to learn more about TypeScript:

* [TypeScript Documentation: Basic Types](https://www.typescriptlang.org/docs/handbook/basic-types.html)
* [TypeScript Documentation: Migrating from Javascript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [TypeScript Documentation: React and Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## Reason {#reason}

[Reason](https://reasonml.github.io/) is not a new language; it's a new syntax and toolchain powered by the battle-tested language, [OCaml](https://ocaml.org/). Reason gives OCaml a familiar syntax geared toward JavaScript programmers, and caters to the existing NPM/Yarn workflow folks already know.

Reason is developed at Facebook, and is used in some of its products like Messenger. It is still somewhat experimental but it has [dedicated React bindings](https://reasonml.github.io/reason-react/) maintained by Facebook and a [vibrant community](https://reasonml.github.io/docs/en/community.html).

## Kotlin {#kotlin}

[Kotlin](https://kotlinlang.org/) is a statically typed language developed by JetBrains. Its target platforms include the JVM, Android, LLVM, and [JavaScript](https://kotlinlang.org/docs/reference/js-overview.html). 

JetBrains develops and maintains several tools specifically for the React community: [React bindings](https://github.com/JetBrains/kotlin-wrappers) as well as [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app). The latter helps you start building React apps with Kotlin with no build configuration.

## Other Languages {#other-languages}

Note there are other statically typed languages that compile to JavaScript and are thus React compatible. For example, [F#/Fable](https://fable.io/) with [elmish-react](https://elmish.github.io/react). Check out their respective sites for more information, and feel free to add more statically typed languages that work with React to this page!
