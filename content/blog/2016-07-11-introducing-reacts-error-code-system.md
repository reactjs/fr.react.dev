---
title: "Introduction au système de codes d'erreur de React"
author: [keyanzhang]
---

Construire une meilleure expérience pour les développeurs a été importante préoccupation de React, dont une partie cruciale consiste à détecter rapidement les anti-modèles/erreurs potentielles et à fournir des messages d'erreur utiles lorsque les choses vont (peut-être) mal tourner.
Cependant, la plupart d'entre eux n'existent qu'en mode développement ; en production, nous évitons d'avoir des assertions coûteuses supplémentaires et d'envoyer des messages d'erreur complets afin de réduire le nombre d'octets envoyés sur le câble.
Avant cette version, nous avons supprimé les messages d'erreur au moment de la construction et c'est pourquoi vous avez peut-être vu ce message en production :

> Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.

Afin de faciliter le débogage en production, nous introduisons un système de code d'erreur dans [15.2.0](https://github.com/facebook/react/releases/tag/v15.2.0). Nous avons développé un [script gulp](https://github.com/facebook/react/blob/master/scripts/error-codes/gulp-extract-errors.js) qui recueille tous nos messages d'erreur « invariants » et les recense en un [fichier JSON](https://github.com/facebook/react/blob/master/scripts/error-codes/codes.json), et au moment de la construction, Babel utilise le JSON pour [réécrire](https://github.com/facebook/react/blob/master/scripts/error-codes/replace-invariant-error-codes.js) nos appels «invariants» en production pour référencer les ID d'erreur correspondants. Maintenant, lorsque les choses tournent mal en production, l'erreur que React envoie contiendra une URL avec un ID d'erreur et des informations pertinentes. L'URL vous dirigera vers une page de notre documentation où le message d'erreur d'origine est réassemblé.

Bien que nous espérons que vous ne voyez pas souvent les erreurs, vous pouvez voir comment cela fonctionne[ici](/docs/error-decoder.html?invariant=109&args[]=Foo). Voici à quoi ressemblera la même erreur ci-dessus :

> Minified React error #109; visit [https://reactjs.org/docs/error-decoder.html?invariant=109&args[]=Foo](/docs/error-decoder.html?invariant=109&args[]=Foo) for the full message or use the non-minified dev environment for full errors and additional helpful warnings.

Nous le faisons pour que l'expérience du développeur soit aussi bonne que possible, tout en gardant la taille du bundle de production aussi petite que possible. Cette fonctionnalité ne devrait nécessiter aucune modification de votre côté — utilisez les fichiers `min.js` en production ou regroupez votre code d'application avec `process.env.NODE_ENV === 'production'` et vous devriez être prêt à démarrer !
