---
id: testing
title: Aperçu des tests
permalink: docs/testing.html
redirect_from:
  - "community/testing.html"
next: testing-recipes.html
---

Vous pouvez tester vos composants React au même titre que le reste de votre code JavaScript.

Il existe plusieurs façons de tester des composants React, lesquelles se divisent au final en deux grandes catégories :

* **Effectuer le rendu d’arborescences de composants** dans un environnement de test simplifié, et vérifier la sortie.
* **Exécuter une appli complète** dans un environnement navigateur réaliste (on parle alors de tests « de bout en bout ») *(end-to-end, NdT)*.

Cette partie de la documentation se concentre sur les stratégies de test pour le premier cas de figure.  Bien que des tests complets de bout en bout puissent être très utiles pour éviter des régressions dans des scénarios critiques d’utilisation, ce type de test ne se préoccupe guère des composants React en particulier, et sort donc du cadre de cette documentation.

### Faire des choix {#tradeoffs}

Lorsqu’on détermine quels outils de test employer, il faut réaliser certains arbitrages :

* **Vitesse d’itération vs. environnement réaliste :** certains outils fournissent une boucle de retour extrêmement rapide entre le moment où vous changez votre code et l’obtention du résultat, mais ils ne simulent pas très précisément le comportement du navigateur.  D’autres pourraient utiliser un véritable environnement navigateur, mais au prix d’une vitesse d’exécution moindre, sans parler des défis que leur utilisation peut poser sur un serveur d’intégration continue.
* **Jusqu’où isoler :** avec les composants, la frontière entre un test « unitaire » et un test « d’intégration » peut être floue.  Si vous testez un formulaire, le test devrait-il également tester les boutons que ce formulaire contient ? Ou le composant bouton devrait-il avoir sa propre suite de tests ?  Si on change la conception du bouton, l’échec soudain du test du formulaire est-il un dommage collatéral acceptable ?

D’une équipe ou d’un produit à l’autre, les réponses valables peuvent varier.

### Outils recommandés {#tools}

**[Jest](https://facebook.github.io/jest/)** est un harnais de test JavaScript qui vous permet d’accéder au DOM *via* [`jsdom`](/docs/testing-environments.html#mocking-a-rendering-surface). Même si jsdom ne simule que partiellement le fonctionnement d’un navigateur, il est souvent suffisant pour tester vos composants React.  Jest combine une excellente vitesse d’itération avec de puissantes fonctionnalités telles que l’isolation des [modules](/docs/testing-environments.html#mocking-modules) et des [horloges](/docs/testing-environments.html#mocking-timers), afin que vous puissiez garder un contrôle fin sur la façon dont votre code s’exécute.

**[React Testing Library](https://testing-library.com/react)** fournit un ensemble de fonctions utilitaires pour tester des composants React sans dépendre de leurs détails d’implémentation.  Cette approche facilite le changement de conception interne et vous aiguille vers de meilleures pratiques en termes d’accessibilité.  Même s’il ne fournit pas de moyen pour réaliser le rendu « superficiel » d’un composant (sans ses enfants), on peut y arriver avec un harnais tel que Jest et ses mécanismes [d’isolation](/docs/testing-recipes.html#mocking-modules).

### Pour en savoir plus {#learn-more}

Cette partie de la documentation comprend deux (autres) pages :

- [Les recettes](/docs/testing-recipes.html) : une compilation d’approches éprouvées pour l’écriture de tests visant des composants React.
- [Les environnements](/docs/testing-environments.html) : les considérations à examiner lorsque vous mettez en place un environnement de test de composants React.
