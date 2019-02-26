---
id: faq-internals
title: DOM virtuel et fonctionnalités
permalink: docs/faq-internals.html
layout: docs
category: FAQ
---

### Qu'est ce que le DOM virtuel ? {#what-is-the-virtual-dom}

Le DOM virtuel (VDOM) est un concept de programmation dans lequel une représentation idéale, ou "virtuelle", d'une interface utilisateur est conservée en mémoire et synchronisée avec le DOM "réel" par une bibliothèque telle que ReactDOM. Ce processus s'appelle [réconciliation](/docs/reconciliation.html).

Cette approche active l'API déclarative de React: vous indiquez à React dans quel état vous souhaitez que l'interface utilisateur se trouve, et il s'assure que le DOM correspond à cet état. Cela extrait la manipulation des attributs, la gestion des événements et la mise à jour manuelle du DOM que sinon vous auriez dû utiliser pour créer votre application.

Puisque le "DOM virtuel" est plus un modèle qu'une technologie spécifique, on l'employe parfois pour désigner différentes choses. Dans le monde React, le terme "DOM virtuel" est généralement associé aux [éléments React](/docs/rendering-elements.html) car il s'agit des objets représentant l'interface utilisateur. Cependant, React utilise également des objets internes appelés "fibres" pour contenir des informations supplémentaires sur l’arbre des composants. Ils peuvent également être considérés comme faisant partie de l'implémentation du "DOM virtuel" dans React.

### Est-ce que le DOM fantôme est le même que le DOM virtuel ? {#is-the-shadow-dom-the-same-as-the-virtual-dom}

No, they are different. The Shadow DOM is a browser technology designed primarily for scoping variables and CSS in web components. The virtual DOM is a concept implemented by libraries in JavaScript on top of browser APIs.

Non, ils sont différents. Le DOM fantôme est une technologie du navigateur conçue principalement pour parcourir les variables et le CSS des composants Web. Le DOM virtuel est un concept implémenté par les bibliothèques en JavaScript en plus des API de navigateur.

### Qu'est ce que "React Fiber"? {#what-is-react-fiber}

Fiber est le nouveau moteur de réconcialiation de React 16. Son objectif principal est de permettre le rendu incrémentiel du DOM virtuel. [En savoir plus](https://github.com/acdlite/react-fiber-architecture).
