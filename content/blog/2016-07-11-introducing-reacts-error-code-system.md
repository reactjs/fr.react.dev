---
title: "Le nouveau système de codes d'erreurs de React"
author: [keyanzhang]
---

React a toujours été particulièrement soucieux de construire une meilleure expérience pour les développeurs, et une partie cruciale de ça consiste à détecter rapidement les approches contre-productives *(anti-patterns, NdT)*  et erreurs potentielles, et à fournir des messages d'erreurs utiles lorsque les choses tournent (peut-être) mal.
Ceci étant dit, la plupart de ces messages n'existent qu'en mode développement ; en production, nous évitons d'avoir des assertions coûteuses supplémentaires et d'envoyer des messages d'erreur complets afin de réduire le nombre d'octets à faire circuler sur le réseau.
Avant cette version, nous supprimions les messages d'erreur au moment du *build*, c'est pourquoi vous avez peut-être vu ce message en production :

> Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.
>
> *(Une erreur de minification est survenue ; utilisez un environnement de développement non-minifié pour obtenir le message d’erreur intégral et des avertissements supplémentaires utiles.)*

Afin de faciliter le débogage en production, nous introduisons un système de code d'erreurs dans la [15.2.0](https://github.com/facebook/react/releases/tag/v15.2.0). Nous avons développé un [script gulp](https://github.com/facebook/react/blob/master/scripts/error-codes/gulp-extract-errors.js) qui recueille tous nos messages d'erreur `invariant` et les ramène à un [fichier JSON](https://github.com/facebook/react/blob/master/scripts/error-codes/codes.json), puis lors du build Babel utilise le JSON pour [réécrire](https://github.com/facebook/react/blob/master/scripts/error-codes/replace-invariant-error-codes.js) nos appels `invariant` en production afin qu’ils référencent les ID d'erreurs correspondants. Désormais, lorsque les choses tournent mal en production, l'erreur que lève React contiendra une URL avec un ID d'erreur et des informations pertinentes. L'URL vous dirigera vers une page de notre documentation où le message d'erreur d'origine sera disponible.

Même si nous espérons que vous ne verrez pas souvent ces erreurs, vous pouvez voir [ici](/docs/error-decoder.html?invariant=109&args[]=Foo) comment ça fonctionne. Voici à quoi ressemblera la même erreur que ci-dessus :

> Minified React error #109; visit [https://reactjs.org/docs/error-decoder.html?invariant=109&args[]=Foo](/docs/error-decoder.html?invariant=109&args[]=Foo) for the full message or use the non-minified dev environment for full errors and additional helpful warnings.
>
> *(Erreur React minifiée #109 ; allez sur [https://reactjs.org/docs/error-decoder.html?invariant=109&args[]=Foo](/docs/error-decoder.html?invariant=109&args[]=Foo) pour consulter le message intégral ou utilisez un environnement de développement non minifié pour des erreurs complètes et des avertissements supplémentaires utiles.)*

Nous faisons ça pour que l'expérience développeurs soit aussi bonne que possible, tout en gardant la taille du bundle de production aussi réduite que possible. Cette fonctionnalité ne devrait nécessiter aucune modification de votre côté : utilisez les fichiers `min.js` en production ou bundlez votre code applicatif avec `process.env.NODE_ENV === 'production'` et vous devriez être prêt·e à démarrer !
