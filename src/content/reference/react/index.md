---
title: Référence API React
---

<Intro>

Cette section fournit une documentation de référence détaillée pour travailler avec React. Pour une introduction à React, consultez plutôt la section [Apprendre](/learn).

</Intro>

<<<<<<< HEAD
La documentation de référence React est découpée en plusieurs groupes de fonctionnalités :
=======
The React reference documentation is broken down into functional subsections:
>>>>>>> bb3a0f5c10aaeba6e6fb35f31f36b47812ece158

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

## API React historique {/*legacy-apis*/}

* [API React historique](/reference/react/legacy) - Ces fonctions sont présentes dans le module `react`, mais leur utilisation est découragée pour tout nouveau code.
