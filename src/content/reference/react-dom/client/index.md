---
title: API React DOM côté client
---

<Intro>

<<<<<<< HEAD
Les API `react-dom/client` vous permettent d'afficher des composants React côté client (dans le navigateur).  Ces API sont généralement utilisées à la racine de votre appli pour initialiser l'arborescence React. Un [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) pourrait les appeler pour vous.  La plupart de vos composants n'auront pas besoin de les importer, encore moins de les utiliser.
=======
The `react-dom/client` APIs let you render React components on the client (in the browser). These APIs are typically used at the top level of your app to initialize your React tree. A [framework](/learn/creating-a-react-app#full-stack-frameworks) may call them for you. Most of your components don't need to import or use them.
>>>>>>> f3d9794fc31f4a3faf7e863984d37f4ae86b3290

</Intro>

---

## API côté client {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) vous permet de créer une racine dans laquelle afficher des composants React au sein d’un nœud DOM du navigateur.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) vous permet d'afficher des composants React au sein d'un nœud DOM du navigateur dont le contenu HTML a été auparavant produit par [`react-dom/server`](/reference/react-dom/server).

---

## Navigateurs pris en charge {/*browser-support*/}

React prend en charge tous les principaux navigateurs, y compris Internet Explorer 9 et plus récents.  Certaines prothèses d'émulation *(polyfills, NdT)* sont nécessaires pour les navigateurs anciens tels que IE 9 et IE 10.
