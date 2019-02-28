---
id: faq-internals
title: Le DOM Virtuel et son intérieur
permalink: docs/faq-internals.html
layout: docs
category: FAQ
---

### Qu'est-ce que le Virtual DOM ? {#what-is-the-virtual-dom}

Le Virtual DOM (VDOM) ou DOM virtuel est un concept en programmation où la représentation idéale, ou "virtuelle" de l'interface utilisateur est stockée en mémoire et synchronisé  le DOM "" á l'aide d'une bibliothèque comme . Ce processus est appelé [réconciliation](/docs/reconciliation.html).

Cette approche active l'API déclarative de React: Vous dites a React quel état l'interface utilisateur doit avoir, lui fait en sorte que le DOM corresponde a cet état. Ceci facilite la manipulation d'attributs, gestion d’événements et la mise á jour manuelle du DOM que vous aurez été obligés de faire pour construire votre application.

Puisque le "DOM virtuel" est plus un pattern qu'une technologie, les développeurs lui donnent quelques fois une des significations différentes. Dans le monde de React, le terme "DOM virtuel" est généralement associé aux [éléments React](/docs/rendering-elements.html) vu que que ce sont des objets qui représentent l'interface utilisateur. Cependant, React, utilise aussi des objet internes appelés "fibers" pour retenir des informations supplémentaires sur l'arbre de composants. Ils peuvent aussi êtres considères comme une partie de l'implémentation du "DOM virtuel".

### Est-ce que le Shadow DOM est pareil que le Virtual DOM?{#is-the-shadow-dom-the-same-as-the-virtual-dom}

Non, ils sont différents. le Shadow DOM est une technologie du navigateur web conçue au départ pour limiter la portée des variable et le CSS aux composants. le Virtual DOM est un concept implémenté par des bibliothèques en Javascript comme surcouche aux APIs du navigateur web.

### C'est quoi "React Fiber"? {#what-is-react-fiber}

Fiber est le nouveau moteur de réconciliation en React 16. Son but principal est de permettre le rendu incrémentale du virtual DOM.