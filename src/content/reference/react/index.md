---
title: Référence API React
---

<Intro>

Cette section fournit une documentation de référence détaillée pour travailler avec React. Pour une introduction à React, consultez plutôt la section [Apprendre](/learn).

</Intro>

La documentation de référence React est découpée en plusieurs groupes de fonctionnalités :

## React {/*react*/}

Les fonctionnalités programmatiques de React :

* [Hooks](/reference/react/hooks) - Pour utiliser diverses fonctionnalités de React au sein de vos composants.
* [Composants](/reference/react/components) - Détaille les composants fournis par React que vous pouvez utiliser dans votre JSX.
* [Fonctions](/reference/react/apis) - Fonctions de l'API utiles pour définir vos composants.
* [Directives](/reference/rsc/directives) - Fournit des instructions aux *bundlers* compatibles avec React Server Components.

## React DOM {/*react-dom*/}

<<<<<<< HEAD
React-DOM comprend les fonctionnalités qui ne sont prises en charge que pour les applications web (celles qui tournent dans un environnement DOM navigateur).  Cette section comprend les parties suivantes :

* [Hooks](/reference/react-dom/hooks) - Les Hooks dédiés aux applications web s'exécutant dans un environnement DOM navigateur.
* [Composants](/reference/react-dom/components) - React prend en charge tous les composants natifs du navigateur pour HTML et SVG.
* [Fonctions](/reference/react-dom) - Le module `react-dom` fournit les fonctions dédiées aux applications web.
* [Fonctions côté client](/reference/react-dom/client) - L'API dans `react-dom/client` vous permet d'effectuer le rendu de composants React côté client (dans le navigateur).
* [Fonctions côté serveur](/reference/react-dom/server) - L'API dans `react-dom/server` vous permet d'effectuer le rendu de composants React côté serveur, vers du HTML.
=======
React DOM contains features that are only supported for web applications (which run in the browser DOM environment). This section is broken into the following:

* [Hooks](/reference/react-dom/hooks) - Hooks for web applications which run in the browser DOM environment.
* [Components](/reference/react-dom/components) - React supports all of the browser built-in HTML and SVG components.
* [APIs](/reference/react-dom) - The `react-dom` package contains methods supported only in web applications.
* [Client APIs](/reference/react-dom/client) - The `react-dom/client` APIs let you render React components on the client (in the browser).
* [Server APIs](/reference/react-dom/server) - The `react-dom/server` APIs let you render React components to HTML on the server.
* [Static APIs](/reference/react-dom/static) - The `react-dom/static` APIs let you generate static HTML for React components.

## React Compiler {/*react-compiler*/}

The React Compiler is a build-time optimization tool that automatically memoizes your React components and values:

* [Configuration](/reference/react-compiler/configuration) - Configuration options for React Compiler.
* [Directives](/reference/react-compiler/directives) - Function-level directives to control compilation.
* [Compiling Libraries](/reference/react-compiler/compiling-libraries) - Guide for shipping pre-compiled library code.

## ESLint Plugin React Hooks {/*eslint-plugin-react-hooks*/}

The [ESLint plugin for React Hooks](/reference/eslint-plugin-react-hooks) helps enforce the Rules of React:

* [Lints](/reference/eslint-plugin-react-hooks) - Detailed documentation for each lint with examples.
>>>>>>> 40ea071c846b3ab1232391bab15d31f508913bf4

## Les règles de React {/*rules-of-react*/}

React repose sur des idiomes — ou règles — visant à exprimer vos approches de façon facile à comprendre, et à même de produire des applications de grande qualité :

* [Les composants et les Hooks doivent être purs](/reference/rules/components-and-hooks-must-be-pure) – Cette pureté facilite la compréhension de votre code ainsi que son débogage, et permet à React d'optimiser automatiquement et correctement vos composants et Hooks.
* [React appelle les composants et les Hooks](/reference/rules/react-calls-components-and-hooks) – React est responsable du rendu des composants et des Hooks de façon à optimiser l'expérience utilisateur.
* [Les règles des Hooks](/reference/rules/rules-of-hooks) – Les Hooks reposent sur de simples fonctions JavaScript, mais ils représentent un type spécifique de logique UI réutilisable, et ne peuvent être appelés que dans des circonstances bien précises.

## API React historique {/*legacy-apis*/}

* [API React historique](/reference/react/legacy) - Ces fonctions sont présentes dans le module `react`, mais leur utilisation est découragée pour tout nouveau code.
