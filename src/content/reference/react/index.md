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
* [Directives](/reference/react/directives) - Fournit des instructions aux *bundlers* compatibles avec React Server Components.

## React DOM {/*react-dom*/}

React-DOM comprend les fonctionnalités qui ne sont prises en charge que pour les applications web (celles qui tournent dans un environnement DOM navigateur).  Cette section comprend les parties suivantes :

* [Hooks](/reference/react-dom/hooks) - Les Hooks dédiés aux applications web s'exécutant dans un environnement DOM navigateur.
* [Composants](/reference/react-dom/components) - React prend en charge tous les composants natifs du navigateur pour HTML et SVG.
* [Fonctions](/reference/react-dom) - Le module `react-dom` fournit les fonctions dédiées aux applications web.
* [Fonctions côté client](/reference/react-dom/client) - L'API dans `react-dom/client` vous permet d'effectuer le rendu de composants React côté client (dans le navigateur).
* [Fonctions côté serveur](/reference/react-dom/server) - L'API dans `react-dom/server` vous permet d'effectuer le rendu de composants React côté serveur, vers du HTML.

<<<<<<< HEAD
## API React historique {/*legacy-apis*/}
=======
## Rules of React {/*rules-of-react*/}

React has idioms — or rules — for how to express patterns in a way that is easy to understand and yields high-quality applications:

* [Components and Hooks must be pure](/reference/rules/components-and-hooks-must-be-pure) – Purity makes your code easier to understand, debug, and allows React to automatically optimize your components and hooks correctly.
* [React calls Components and Hooks](/reference/rules/react-calls-components-and-hooks) – React is responsible for rendering components and hooks when necessary to optimize the user experience.
* [Rules of Hooks](/reference/rules/rules-of-hooks) – Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called.

## Legacy APIs {/*legacy-apis*/}
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

* [API React historique](/reference/react/legacy) - Ces fonctions sont présentes dans le module `react`, mais leur utilisation est découragée pour tout nouveau code.
