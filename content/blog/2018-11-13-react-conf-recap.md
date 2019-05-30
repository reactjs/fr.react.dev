---
title: "Résumé de la conférence React : Hooks, Suspense, et rendu concurrent"
author: [tomocchino]
---


Cette année, la [Conférence React](https://conf.reactjs.org/) a eu lieu les 25 et 26 octobre à Henderson dans le Nevada, où plus de 600 participants se sont réunis pour suivre les dernières nouveautés en matière de conception d’UI.

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/V-QO-KO90iQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Sophie Alpert et Dan Abramov ont ouvert ce 1er jour de conférence avec une présentation intitulée “React Today and Tomorrow”. Durant celle-ci, ils ont introduit les [Hooks](/docs/hooks-intro.html), une nouvelle fonctionnalité expérimentale qui permet d’exploiter certaines fonctionnalités dans un composant, notamment l'état local, sans avoir à passer par une classe JavaScript. Les Hooks promettent de simplifier drastiquement le code nécessaire à la création d'un composant React, et sont dès à présent disponibles dans la version alpha de React.

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/ByBPyMBTzM0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Durant la matinée de cette 2ème journée, Andrew Clark et Brian Vaughn ont présenté “Concurrent Rendering in React”. Andrew a introduit la très récente [API React.lazy pour faire de la découpe de code](/blog/2018/10/23/react-v-16-6.html), puis a donné un aperçu de 2 fonctionnalités futures : le mode de rendu concurrent et Suspense. Brian a ensuite montré comment utiliser les outils du [nouveau profileur de React](/blog/2018/09/10/introducing-the-react-profiler.html) pour optimiser l'exécution des applis React.

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/UcqRXTriUVI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Dans l'après-midi, Parashuram N a détaillé la nouvelle architecture de React Native. C’est un projet de longue haleine sur lequel l'équipe React Native travaille depuis un an et qui [avait été annoncé en juin dernier](https://facebook.github.io/react-native/blog/2018/06/14/state-of-react-native-2018). Ce projet nous semble très prometteur, notamment en ce qui concerne l'amélioration de la performance, la simplification de l'interopérabilité avec les autres bibliothèques, et la mise en place de fondations solides pour le futur de React Native.

Maintenant que la conférence est terminée, retrouvez les 28 présentations [en ligne](https://www.youtube.com/playlist?list=PLPxbbTqCLbGE5AihOSExAa4wUM-P42EIJ). De nombreuses présentations très intéressantes ont eu lieu durant ces 2 jours. Vivement la conférence de l'année prochaine !
