---
title: "Nouvelle politique de gestion de versions"
author: [sebmarkbage]
---

Aujourd’hui, nous annonçons notre bascule vers une gestion de versions majeures pour React. La version actuelle est la 0.14.7. La prochaine sera la **15.0.0**.

Cette bascule ne devrait pas concrètement affecter la plupart d’entre vous.  Passer à une gestion sémantique de versions nous aide simplement à affirmer notre engagement de stabilité, et nous donne la flexibilité nécessaire à l’ajout de fonctionnalités compatibles en amont dans des versions mineures.  Ça signifie que nous pouvons avoir moins de versions majeures, et que vous n’aurez pas à attendre aussi longtemps pour profiter des améliorations apportées à React.  En prime, si vous êtes l’auteur·e de composants, cette gestion de versions vous permet de prendre en charge deux versions majeures de React simultanément, sans que vous ayez à laisser une partie de vos utilisateurs au bord de la route.

Le cœur de l’API de React est stable depuis des années.  Notre propre activité, comme celle de beaucoup d’entre vous, se repose fortement sur l’utilisation de React comme élément central de notre infrastructure.  Nous avons à cœur de maintenir la stabilité de React sans entraver son évolution future.

## Disponible pour tout le monde {#bring-everyone-along}

React n’est pas juste une bibliothèque, mais un écosystème.  Nous savons bien que vos applications, comme les nôtres, ne sont pas de petits îlots de code isolés.  Elles sont faites de l’entrelacement de votre propre code applicatif, de vos composants open source, et de bibliothèques tierces dont beaucoup se reposent sur React.

<img src="../images/blog/versioning-1.png" width="403" alt="Diagramme insistant sur la dépendance de notre code applicatif vis-à-vis de bibliothèques et composants tiers">

Il est donc vital que nous ne nous contentions pas de seulement mettre à jour nos bases de code, mais que nous puissions entraîner toute la communauté avec nous.  Nous prenons la question de la migration très au sérieux, et pour tout le monde.

<img src="../images/blog/versioning-poll.png" width="596" alt="Sondage Twitter : quelle version de React utilisez-vous en production en ce moment ? 79% la 0.14, 13% la 0.13, 8% les autres">

## Dites bonjour aux versions mineures {#introducing-minor-releases}

Dans l’idéal, tout le monde se baserait en permanence sur la dernière version de React.

<img src="../images/blog/versioning-2.png" width="463" alt="Diagramme où toutes les bibliothèques sont sur la 15.0.0">

Nous savons bien que c’est impossible en pratique.  À l’avenir, nous anticipons davantage d’API complémentaires que de ruptures de compatibilité dans les API existantes.  En adoptant une gestion sémantique de versions, avec des versions majeures, nous pouvons sortir de nouvelles versions sans casser les anciennes.

<img src="../images/blog/versioning-3.png" width="503" alt="Diagramme où les bibliothèques disposent automatiquement des nouvelles versions mineures">

Ça signifie que si un composant a besoin d’une nouvelle API, les autres composants n’ont rien à faire de leur côté.  Ils restent compatibles.

## Où est passée la 1.0.0 ? {#what-happened-to-100}

La croissance et la popularité de React sont en partie dues à sa stabilité et sa performance en production.  Les gens nous demandent depuis longtemps à quoi ressemblera React v1.0.  Techniquement il faut parfois en passer par des ruptures de compatibilité pour éviter la stagnation, mais nous pouvons tout de même préserver la stabilité en facilitant les mises à jour.  Si les versions majeures indiquent que l’API est stable et entraînent une utilisation confiante en production, alors on y est depuis longtemps.  Il y a trop d’idées reçues sur ce qui constitue une v1.0.  Nous suivons toujours une gestion sémantique de versions, c’est juste que nous indiquons cette stabilité en déplaçant le 0 (zéro) du début vers la fin.

## Ruptures de compatibilité ascendante {#breaking-changes}

Les versions mineures inclueront des avertissements de dépréciation et des astuces pour mettre à jour une API ou une approche de code qui seront retirées ou modifiées à l’avenir.

Nous continuerons à publier des [codemods](https://www.youtube.com/watch?v=d0pOgY8__JM) pour les approches courantes afin de faciliter la mise à jour automatique de votre base de code.

Une fois que nous aurons atteint la fin de vie d’une version majeure donnée, nous publierons une nouvelle version majeure dans laquelle toutes les API dépréciées auront été retirées.

## Éviter le « mur » de version majeure {#avoiding-the-major-cliff}

Si vous tentez de mettre à jour votre composant vers la 16.0.0 vous risquez de constater que votre application ne fonctionne plus si vous avez encore des dépendances tierces.  Par exemple, il se pourrait que les composants de Ryan et Jed ne soient compatibles qu’avec les versions 15.x.x.

<img src="../images/blog/versioning-4.png" width="498" alt="Diagramme dans lequel certaines dépendances tierces sont restées bloquées sur la majeure précédente">

Au pire des cas, vous devrez revenir à la 15.1.0 pour votre application.  Dans la mesure où vous voudrez utiliser votre composant, vous aurez peut-être besoin de le faire revenir en arrière lui aussi.

<img src="../images/blog/versioning-5.png" width="493" alt="Diagramme dans lequel toute la base de code reste privée de la 16.0.0, tout le monde est triste">

Naturellement, Ryan et Jed sont dans le même cas. Si nous ne sommes pas attentifs, nous pouvons nous prendre un mur dû à l’absence de mise à jour chez tout le monde.  C’est déjà arrivé dans d’autres écosystèmes logiciels par le passé.

C’est pourquoi nous nous engageons à faciliter la vie de la plupart des composants et bibliothèques basés sur React en leur permettant d’être compatibles avec deux versions majeures simultanément.  Pour y arriver, nous aurons soin de laisser du temps entre l’introduction de nouvelles API et le retrait des anciennes, évitant ainsi la survenue de ce genre de « murs ».

<img src="../images/blog/versioning-6.png" width="493" alt="Diagramme dans lequel deux composants se déclarent compatibles avec 15.1 et 16.0, ce qui permet de les utiliser aussi avec la nouvelle version majeure">
