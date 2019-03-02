---
id: static-type-checking
title: La validation de types statique
permalink: docs/static-type-checking.html
prev: typechecking-with-proptypes.html
next: refs-and-the-dom.html
---

Les systèmes de typage statique tels que [Flow](https://flow.org/) et [TypeScript](https://www.typescriptlang.org/) parviennent à identifier certains types de problèmes avant même de lancer votre code. Ils peuvent aussi améliorer le processus de travail du développeur en y ajoutant des fonctionalités telles que l'autocomplétion. C'est pourquoi nous recommendons l'usage de Flow ou TypeScript au lieu des `PropTypes` pour les grandes bases de code source.

## Flow {#flow}

[Flow](https://flow.org/) est un système de typage statique pour votre code JavaScript. Il est développé à Facebook et est souvent utilisé avec React. Il permet d'annoter les variables, fonctions et composants React avec une syntaxe spéciale de typage, et de déceler préventivement les erreurs. Vous pouvez lire [cette introduction à Flow](https://flow.org/en/docs/getting-started/) pour en apprendre les bases.

Pour utiliser Flow, vous devrez :
* Ajouter Flow comme dépendence à votre projet.
* Vous assurer que la syntaxe Flow soit bien enlevée du code, une fois compilée.
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

Maintenant, ajoutez `flow` à la section `"scripts"` de votre `package.json` afin de pouvoir l'utiliser dans votre terminal :

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

Si vous utilisez [Yarn](https://yarnpkg.com/) :

```bash
yarn run flow init
```

Si vous utilisez [npm](https://www.npmjs.com/) :

```bash
npm run flow init
```

Cette commande va créer un fichier de configuration Flow qu'il va falloir ajouter avec un commit.

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

Ensuite, ajoutez le preset `flow` à votre [configuration Babel](https://babeljs.io/docs/usage/babelrc/). Par exemple, si vous configurez Babel avec le ficher `.babelrc`, cela pourrait ressembler à :

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

#### Autres configurations {#other-build-setups}

Si vous n'utilisez ni Create React App, ni Babel, vous pouvez utiliser [flow-remove-types](https://github.com/flowtype/flow-remove-types) pour enlever les annotations de type.

### Exécuter Flow {#running-flow}

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

Il existe aussi [une option](https://flow.org/en/docs/config/options/#toc-all-boolean) pour forcer Flow à vérifier *tous* les fichiers, même sans l'annotation. Ça peut être trop pour des projets préexistants, mais raisonnable pour un nouveau projet si vous souhaitez le typer avec Flow de façon intégrale.

Vous êtes paré ! Nous vous recommendons d'aller voir les ressources suivantes pour en apprendre davantage sur Flow:

* [Documentation Flow : Les annotations de type](https://flow.org/en/docs/types/)
* [Documentation Flow : Editeurs de code](https://flow.org/en/docs/editors/)
* [Documentation Flow : React](https://flow.org/en/docs/react/)
* [Le linting avec Flow](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## TypeScript {#typescript}

[TypeScript](https://www.typescriptlang.org/) est un langage de programmation développé par Microsoft. C'est un sur-ensemble typé de JavaScript, et il inclut son propre compilateur. Étant un langage typé, TypeScript peut trouver les erreurs et bugs lors de la compilation, bien avant que l'application ne soit mise en ligne. Vous trouverez plus d'informations au sujet de l'utilisation de TypeScript avec React [ici](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

Pour utiliser TypeScript, vous devez :
* Ajouter la dépendance TypeScript à votre projet
* Configurer les options du compilateur TypeScript
* Utiliser les extenstions correctes pour vos fichiers
* Ajouter les définitions de type pour les bibliothèques que vous utilisez

Voyons cela plus en détail.

### Utiliser TypeScript avec Create React App {#using-typescript-with-create-react-app}

Create React App supporte TypeScript clés en main.

Pour créer un **nouveau projet** avec le support de TypeScript, exécutez :

```bash
npx create-react-app my-app --typescript
```

Vous pouvez aussi l'ajouter à **un projet Create React App déjà existant**, [comme documenté ici](https://facebook.github.io/create-react-app/docs/adding-typescript).

>Remarque :
>
>Si vous utilisez Create React App, vous pouvez **passer le reste de cette page**. Elle décrit l'installation manuelle qui ne s'applique pas aux utilisateurs de Create React App.


### Ajouter TypeScript à un projet {#adding-typescript-to-a-project}
On commence par exécuter une commande dans le terminal.

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

### Configurer le compilateur TypeScript {#configuring-the-typescript-compiler}
Le compilateur est inutile tant qu'on ne lui a pas dit quoi faire. En TypeScript, ces règles sont définies dans un fichier spécial appelé `tsconfig.json`. Pour générer ce fichier :

Si vous utilisez [Yarn](https://yarnpkg.com/), exécutez :

```bash
yarn run tsc --init
```

Si vous utilisez [npm](https://www.npmjs.com/), exécutez :

```bash
npx tsc --init
```

Allons voir `tsconfig.json` qui vient d'être généré, vous voyez les nombreuses options que l'on peut utiliser pour configurer le compilateur. Pour une explication détaillée des options, voyez [cette page](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

Parmi les nombreuses options, nous allons regarder `rootDir` et `outDir`. Conformément à son rôle, le compilateur accepte les fichiers typescript et génère des fichiers javascript. Cela dit, nous ne voudrions pas confondre les fichiers source avec le résultat généré.

Nous allons régler ça en deux étapes :
* Premièrement, réorganisons notre projet. Nous allons placer tout notre code source dans le dossier `src`.

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

* Ensuite, nous allons dire au compilateur où se trouve notre code et où placer le résultat.

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

Génial ! Maintenant, quand on exécute notre script, le compilateur va envoyer le javascript généré vers le dossier `build`. Le [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json) met à disposition un `tsconfig.json` avec un bon ensemble de règles pour vous aider à démarrer.

De façon générale, vous n'aurez pas besoin d'enregistrer le javascript généré dans votre système de contrôle de version, alors veillez à bien l'ajouer à `.gitignore`.

### Extensions de fichiers {#file-extensions}
Avec React, vous écrivez probablement vos composants dans un fichier `.js`. En TypeScript, il existe deux extensions de fichier :

`.ts` est l'extension par défaut, tandis que `.tsx` est une extension spéciale pour les fichiers qui contiennent du `JSX`.

### Exécuter TypeScript {#running-typescript}

Si vous avez bien suivi les instructions ci-dessus, vous devriez pouvoir exécuter TypeScript pour la première fois.

Si vous utilisez Yarn, exécutez :

```bash
yarn build
```

Si vous utilisez npm, exécutez :

```bash
npm run build
```

Si aucun message ne s'affiche, ça veut dire que tout a bien fonctionné.


### Définitions de types {#type-definitions}
Afin de pouvoir montrer les erreurs et indications des autres modules, le compilateur a besoin de fichiers de déclarations. Un fichier de déclarations contient toutes les informations sur les types d'une bibliothèque. Ça nous permet d'utiliser des bibliothèques javascript telles que celles que l'on trouve sur npm dans notre projet.

Les deux principales façons d'obtenir les déclarations de types d'une bibliothèque sont les suivantes :

__Inclue__ - La bibliothèque comprend déjà un fichier de déclarations. Ça nous arrange, il nous suffira d'installer la bibliothèque et nous pourrons l'utiliser sans tarder. Pour vérifier qu'une bibliothèque contient les types, cherchez un fichier `index.d.ts` dans le projet. Certaines bibliothèques l'annoncent dans leur `package.json` sous le champ `typings` ou `types`.

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ - DefinitelyTyped est un énorme dépôt de déclarations pour les bibliothèques qui n'ont pas de fichier de déclarations. Les déclarations sont faites par la tout le mode et gérées par Microsoft et les contributeurs open source. React par exemple n'a pas de fichier de déclarations. On peut l'obtenir sur DefinitelyTyped. Pour y arriver, exécutez cette commande dans votre terminal.

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__Déclarations locales__
Parfois, un module que vous souhaitez utiliser ne contient pas de déclarations et n'est pas non plus disponible sur DefinitelyTyped. Dans ce cas, on peut créer un fichier de déclarations local. Créez un fichier `declarations.d.ts` à la base de votre dossier. Une déclaration simple pourrait ressembler à ceci :

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

Vous êtes maintenant prêt à écrire du code ! Nous vous recommendons de vérifier les ressources suivantes pour en apprendre davantage sur TypeScript:

* [Documentation TypeScript : les types de base](https://www.typescriptlang.org/docs/handbook/basic-types.html)
* [Documentation TypeScript : migrer à partir de JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [Documentation TypeScript : React et Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## Reason {#reason}

[Reason](https://reasonml.github.io/) n'est pas un nouveau langage, c'est une nouvelle syntaxe et boîte d'outils supportées par le langage reconnu [OCaml](https://ocaml.org/). Reason donne à OCaml une syntaxe qui semblera familiaire aux développeurs JavaScript, et fonctionne avec les outils de workflow existants que nous connaissons déjà tels que NPM et Yarn.

Reason est développé chez Facebook et est utilisée pour certains de leurs produits tels que Messenger. Elle est encore relativement expérimentale mais elle a des [intégrations React dédiées](https://reasonml.github.io/reason-react/) maintenues par Facebook et une [communauté dynamique](https://reasonml.github.io/docs/en/community.html).

## Kotlin {#kotlin}

[Kotlin](https://kotlinlang.org/) est un langage au typage statique développé par JetBrains. Ses plateformes cibles sont entre autres la JVM, Android, LLVM et [JavaScript](https://kotlinlang.org/docs/reference/js-overview.html).

JetBrains développe et maintient certains outils spécialement pour la communauté React : [React bindings](https://github.com/JetBrains/kotlin-wrappers) ainsi que [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app). Ce dernier est conçu pour vous aider à commencer à construire des applications React avec Kotlin sans configuration de build.

## Autres langages {#other-languages}

Notez qu'il existe d'autres langages au typage statique qui se compilent en JavaScript et sont donc compatibles avec React. Par exemple, [F#/Fable](https://fable.io/) avec [elmish-react](https://elmish.github.io/react). Allez voir leurs site respectifs pour plus d'information et n'hésitez pas à ajouter d'autres langages au typage statique fonctionnant avec React à cette page !
