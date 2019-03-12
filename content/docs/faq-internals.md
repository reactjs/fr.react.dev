---
id: faq-internals
title: DOM virtuel et autres détails
permalink: docs/faq-internals.html
layout: docs
category: FAQ
---

### Qu'est-ce que le DOM virtuel ? {#what-is-the-virtual-dom}

Le DOM virtuel (VDOM) est un concept de programmation dans lequel une représentation idéale, ou « virtuelle », d'une interface utilisateur (UI) est conservée en mémoire et synchronisée avec le DOM « réel » par une bibliothèque telle que ReactDOM. Ce processus s'appelle [réconciliation](/docs/reconciliation.html).

Cette approche rend possible l'API déclarative de React : vous indiquez à React dans quel état, vous souhaitez que l'UI se trouve, et il s'assure que le DOM correspond à cet état. Ça permet de faire abstraction de la manipulation des attributs, de la gestion des événements et de la mise à jour manuelle du DOM que vous auriez dû faire normalement pour créer votre application.

Puisque le « DOM virtuel » est plus un modèle qu'une technologie spécifique, on l'emploie parfois pour désigner différentes choses. Dans le monde React, le terme « DOM virtuel » est généralement associé aux [éléments React](/docs/rendering-elements.html), car il s'agit des objets représentant l'interface utilisateur. Cependant, React utilise également des objets internes appelés « fibres » _(fibers, NdT)_ pour conserver des informations supplémentaires sur l’arbre des composants. Ils peuvent également être considérés comme faisant partie de l'implémentation du « DOM virtuel » dans React.

### Est-ce que le Shadow DOM est identique au DOM virtuel ? {#is-the-shadow-dom-the-same-as-the-virtual-dom}

Non, ils sont différents. Le Shadow DOM est une technologie du navigateur conçue principalement pour limiter la portée des variables et du CSS dans les Web Components. Le DOM virtuel est un concept implémenté par les bibliothèques en JavaScript en plus des API des navigateurs.

### Qu'est-ce que « React Fiber » ? {#what-is-react-fiber}

Fiber est le nouveau moteur de réconciliation de React 16. Son objectif principal est de permettre le rendu incrémentiel du DOM virtuel. [En savoir plus](https://github.com/acdlite/react-fiber-architecture).
