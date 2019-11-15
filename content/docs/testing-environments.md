---
id: testing-environments
title: Environnements de test
permalink: docs/testing-environments.html
prev: testing-recipes.html
---

<!-- Ce document vise les personnes déjà à l’aise avec JavaScript, et qui ont probablement déjà écrit des tests avec.  Il constitue une sorte de référence des différences entre les environnements de test pour les composants React, en explicitant en quoi ces différences affectent l’écriture des tests.  Ce document suppose par ailleurs une légère priorité envers les composants web basés sur react-dom, mais comprend des informations pour les autres moteurs de rendu. -->

Ce document détaille les facteurs susceptibles d’affecter votre environ­­nement, et fournit des conseils pour quelques scénarios.

### Harnais de test {#test-runners}

Les harnais de test tels que [Jest](https://jestjs.io/), [mocha](https://mochajs.org/) ou [ava](https://github.com/avajs/ava) vous permettent d’écrire des suites de tests en utilisant du JavaScript classique, et les exécutent dans le cadre de votre processus de développement. Qui plus est, les suites de tests peuvent être exécutées au sein de votre intégration continue.

- Jest est largement compatible avec les projets React, en offrant des fonctionnalités telles que l’isolation des [modules](#mocking-modules) et des [horloges](#mocking-timers), ainsi qu’une prise en charge de [`jsdom`](#mocking-a-rendering-surface). **Si vous utilisez Create React App, [Jest est fourni de base](https://facebook.github.io/create-react-app/docs/running-tests) avec des réglages par défaut très utiles.**
- Les bibliothèques comme [mocha](https://mochajs.org/#running-mocha-in-the-browser) sont bien adaptées à une utilisation au sein de véritables navigateurs, et pourraient vous aider pour des tests ayant explicitement besoin de ce type de contexte d’exécution.
- Les tests de bout en bout sont surtout pertinents pour des scénarios plus longs impliquant plusieurs pages successives, et requièrent une [mise en place distincte](#end-to-end-tests-aka-e2e-tests).

### Simuler une surface d’affichage {#mocking-a-rendering-surface}

Les tests s’exécutent souvent dans un environnement qui n’est pas doté d’une véritable surface d’affichage (comme le serait un navigateur).  Pour ces environnements-là, nous vous conseillons de simuler un navigateur avec [`jsdom`](https://github.com/jsdom/jsdom), une implémentation légère de navigateur qui s’exécute dans un processus Node.js.

La plupart du temps, jsdom se comporte comme un navigateur classique, à ceci près qu’il ne fournit pas des aspects comme [la mise en page et la navigation](https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform). Ça reste utile pour la plupart des tests de composants basés web, dans la mesure où il s’exécute bien plus vite que lorsque vous devez démarrer un navigateur pour chaque test.  Qui plus est, il s’exécute dans le même processus que vos tests, de sorte qu’il est facile d’écrire du code qui examine le DOM obtenu et vérifie son contenu.

Tout comme un véritable navigateur, jsdom nous permet de modéliser les interactions utilisateurs ; vos tests peuvent déclencher des événements sur les nœuds du DOM, puis observer le DOM et vérifier les effets de bord de ces actions [<small>(exemple)</small>](/docs/testing-recipes.html#events).

Une large part des tests d’interface utilisateur (UI) peuvent être écrits de cette façon : en utilisant Jest comme harnais, en réalisant le rendu avec jsdom, et en spécifiant les interactions utilisateurs sous forme de séquences d’événements au sein du navigateur, à l’aide de la fonction utilitaire `act()` [<small>(exemple)</small>](/docs/testing-recipes.html).  Par exemple, de très nombreux tests de React lui-même sont écrits ainsi.

Si vous écrivez une bibliothèque qui doit tester principalement des comportements spécifiques aux navigateurs, et requiert donc des comportements natifs du navigateur tels que la mise en page ou de véritables champs de saisie, il vous faudra alors plutôt une solution comme [mocha](https://mochajs.org/).

Dans un environnement où vous _ne pouvez pas_ simuler un DOM (par exemple en testant des composants React Native depuis Node.js), vous pourriez opter pour des [utilitaires de simulation d’événements](https://reactjs.org/docs/test-utils.html#simulate), qui simulent les interactions avec les éléments. Une autre option consisterait à utiliser la fonction utilitaire `fireEvent` fournie par [`@testing-library/react-native`](https://testing-library.com/docs/native-testing-library).

Les frameworks comme [Cypress](https://www.cypress.io/), [puppeteer](https://github.com/GoogleChrome/puppeteer) et [webdriver](https://www.seleniumhq.org/projects/webdriver/) sont quant à eux utiles pour exécuter des [tests de bout en bout](#end-to-end-tests-aka-e2e-tests).

### Simuler des fonctions {#mocking-functions}

Lorsqu’on écrit des tests, on aimerait les isoler des parties de notre code qui n’ont pas d’équivalent dans notre environnement de test (par exemple pour vérifier l’état de `navigator.onLine` alors qu’on est en Node.js).  Les tests peuvent aussi surveiller certaines fonctions, et observer l’interaction entre ces fonctions et d’autres parties du test.  Il est alors utile de pouvoir simuler sélectivement ces fonctions en les remplaçant par des versions adaptées à nos tests.

C’est particulièrement vrai pour le chargement de données.  Il est généralement préférable d’utiliser de « fausses » données pour nos tests, afin d’éviter la lenteur et la fragilité d’une récupération depuis de véritables points d’accès API [<small>(exemple)</small>](/docs/testing-recipes.html#data-fetching).  On gagne ainsi en fiabilité pour nos tests.  Des bibliothèques comme [Jest](https://jestjs.io/) et [sinon](https://sinonjs.org/), entre autres, permettent de simuler les fonctions.  Pour des tests de bout en bout, il peut être un peu plus délicat de simuler complètement le réseau, mais vous voudrez sans doute utiliser de véritables points d’accès API dans ces tests-là de toutes façons.

### Simuler des modules {#mocking-modules}

Certains composants ont des dépendances à des modules qui peuvent ne pas bien fonctionner dans un environnement de test, ou ne sont pas essentiels à nos tests.  Il peut alors être utile de les simuler en les remplaçant par des versions appropriées [<small>(exemple)</small>](/docs/testing-recipes.html#mocking-modules).

Dans Node.js, les harnais comme Jest [permettent la simulation de modules](https://jestjs.io/docs/en/manual-mocks). Vous pouvez aussi recourir à des bibliothèques telles que [`mock-require`](https://www.npmjs.com/package/mock-require).

### Simuler des horloges {#mocking-timers}

Vos composants pourront parfois utiliser des fonctionnalités sensibles au temps, telles que `setTimeout`, `setInterval`, ou `Date.now`. Dans des environnements de test, il peut être pratique de les remplacer par des versions qui vous permettent de faire manuellement « avancer » le temps. C’est super pour garantir que nos tests s’exécutent rapidement ! Les tests basés sur des horloges seraient toujours exécutés dans l’ordre, juste plus vite [<small>(exemple)</small>](/docs/testing-recipes.html#timers). La plupart des frameworks, y compris [Jest](https://jestjs.io/docs/en/timer-mocks), [sinon](https://sinonjs.org/releases/v7.3.2/fake-timers/) et [lolex](https://github.com/sinonjs/lolex), vous permettent de simuler les horloges dans vos tests.

Parfois, vous voudrez sans doute ne pas simuler les horloges, par exemple si vous testez une animation, ou une interaction avec un point d’accès sensible au temps (tel qu’une API imposant une limitation de trafic).  Les bibliothèques qui simulent les horloges vous permettent d’activer ou désactiver ces interceptions par test ou par suite de tests, de sorte que vous pouvez choisir explicitement dans quels tests ces simulations sont exploitées.

### Tests de bout en bout {#end-to-end-tests-aka-e2e-tests}

Les tests de bout en bout sont utiles pour tester des scénarios plus longs, en particulier s’ils sont critiques à votre activité (comme des paiements ou des inscriptions).  Pour de tels tests, vous voudrez sans doute tester comment un véritable navigateur affiche votre appli entière, charge les données depuis de véritables points d’accès API, utilise les sessions et les cookies, navigue au travers de divers liens…  Vous voudrez sans doute aussi vérifier non seulement l’état du DOM, mais les données sous-jacentes (par exemple pour vérifier si des mises à jour ont bien été persistées en base).

Dans un tel scénario, vous utiliserez probablement un framework comme [Cypress](https://www.cypress.io/) ou une bibliothèque telle que [puppeteer](https://github.com/GoogleChrome/puppeteer) afin de pouvoir naviguer à travers de multiples routes et vérifier les effets de bord non seulement au sein du navigateur, mais dans votre couche serveur également.
