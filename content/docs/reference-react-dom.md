---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

Si vous chargez React directement au moyen d’une balise `<script>`, ces API de haut-niveau seront disponibles directement via la variable globale `ReactDOM`.  Si vous utilisez ES6 avec `npm`, vous pouvez écrire `import ReactDOM from 'react-dom'`.  Si vous utilisez ES5 avec npm, utilisez `var ReactDOM = require('react-dom')`.

## Aperçu {#overview}

Le module `react-dom` fournit des méthodes spécifiques au DOM que vous pouvez utiliser au niveau racine de votre appli et comme échappatoire pour travailler hors du modèle React si vous en avez besoin.  La plupart des composants ne devraient jamais avoir besoin d’utiliser ce module.

- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)
- [`findDOMNode()`](#finddomnode)
- [`createPortal()`](#createportal)

### Navigateurs pris en charge {#browser-support}

React prend en charge tous les navigateurs populaires, y compris Internet Explorer 9 et au-delà, même si [certains polyfills sont nécessaires](/docs/javascript-environment-requirements.html) pour les navigateurs plus anciens tels qu’IE 9 et IE 10.

>Remarque
>
>Nous ne prenons pas en charge les navigateurs plus anciens qui n'exposent pas les méthodes ES5 mais vous verrez que vos applis peuvent y fonctionner si vous incluez des polyfills tels que [es5-shim et es5-sham](https://github.com/es-shims/es5-shim) dans la page.  Ceci dit, vous serez alors livré·e à vous-même en termes de support.

* * *

## Référence de l’API {#reference}

### `render()` {#render}

```javascript
ReactDOM.render(element, container[, callback])
```

Affiche un élément React au sein du nœud DOM spécifié par `container` et renvoie une [référence](/docs/more-about-refs.html) sur le composant (ou renvoie `null` pour les [fonctions composants](/docs/components-and-props.html#function-and-class-components)).

Si l’élément React était déjà affiché dans `container`, cette méthode effectuera plutôt une mise à jour et ne modifiera le DOM que là où c’est strictement nécessaire pour refléter l’élément React à jour.

Si la fonction de rappel optionnelle est fournie, elle sera exécutée après que le composant est affiché ou mis à jour.

>Remarque
>
>`ReactDOM.render()` contrôle le contenu du nœud conteneur que vous lui passez.  Tout élément DOM existant à l’intérieur sera potentiellement remplacé au premier appel.  Les appels ultérieurs utiliseront l’algorithme de différence DOM de React pour des mises à jour efficaces.
>
>`ReactDOM.render()` ne modifie pas le nœud conteneur lui-même (seulement ses enfants).  Il peut arriver qu’insérer un composant dans un nœud DOM existant n’en modifie pas les enfants.
>
>`ReactDOM.render()` renvoie pour le moment une référence sur l’instance racine de composant React.  Toutefois, manipuler la valeur renvoyée est considéré comme déprécié, et vous devriez vous en abstenir dans la mesure où de futures versions de React pourraient gérer le rendu de façon asynchrone dans certains cas.  Si vous avez besoin d’une référence sur l’instance racine de composant React, une meilleure solution consiste à associer une [ref de rappel](/docs/more-about-refs.html#callback-refs) à l’élément racine.
>
>Utiliser `ReactDOM.render()` pour hydrater un conteneur rendu côté serveur est une pratique dépréciée qui disparaîtra avec React 17.  Utilisez plutôt la méthode [`hydrate()`](#hydrate).

* * *

### `hydrate()` {#hydrate}

```javascript
ReactDOM.hydrate(element, container[, callback])
```

Similaire à [`render()`](#render), mais sert à hydrater un conteneur dont le HTML a déjà été produit par [`ReactDOMServer`](/docs/react-dom-server.html). React tentera alors d’associer les gestionnaires d’événements au balisage existant.

React s’attend à ce que le balisage produit soit identique entre le serveur et le client. Il peut gérer des différences de contenu textuel mais vous devriez considérer toute erreur de correspondance comme un bug et la corriger. En mode développement, React vous avertit de telles erreurs lors de l’hydratation. Nous ne garantissons notamment pas que les écarts d’attributs seront correctement résolus. C’est important pour les performances car dans la plupart des applications les erreurs de correspondance sont rares et faire une validation trop fine du balisage serait sans doute inutilement coûteux.

Si un attribut ou contenu textuel sur un élément précis est forcément différent entre le serveur et le client (par exemple, un horodatage), vous pouvez empêcher cet avertissement en ajoutant `suppressHydrationWarning={true}` à l’élément. Ça ne marche toutefois qu’à un niveau de profondeur et c’est considéré comme une échappatoire. N’en abusez pas.  À moins qu’il ne s’agisse de contenu textuel, React ne tentera de toutes façons pas de résoudre la différence qui pourrait rester incohérente jusqu’aux prochaines mises à jour.

Si vous faites volontairement un rendu différent entre le serveur et le client, vous pouvez procéder à un rendu en deux passes. Les composants qui ont un rendu serveur différent peuvent lire une variable d’état local du style `this.state.isClient`, que vous définirez à `true` au sein de `componentDidMount()`. Ainsi, la première passe de rendu affichera le même contenu que celui du serveur, évitant les écarts, mais une passe supplémentaire surviendra de façon synchrone juste après l’hydratation.  Remarquez que cette approche ralentira l’initialisation de vos composants car ils devront faire un double rendu au démarrage : ne l’employez qu’avec précaution.

Souvenez-vous que les connexions lentes ont un impact sur l’expérience utilisateur. Le code JavaScript peut être chargé très longtemps après l’affichage HTML initial de sorte que si vous affichez quelque chose de différent lors du rendu coté client, la transition risque de désorienter l’utilisateur. Ceci dit, si vous vous y prenez bien, il peut tout de même être utile de produire d’abord une « ossature » de l’application sur le serveur et de n’ajouter certains éléments visuels supplémentaires qu’une fois coté client.  Pour apprendre à faire ça sans souffrir d'écarts de balisage, relisez le paragraphe précédent.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
ReactDOM.unmountComponentAtNode(container)
```

Retire un composant React monté du DOM et nettoie ses gestionnaires d’événements et son état local.  Si aucun composant n’était monté sur ce conteneur, appeler cette fonction ne fait rien.  Renvoie `true` si un composant a bien été démonté et `false` si aucun composant ne nécessitait de démontage.

* * *

### `findDOMNode()` {#finddomnode}

>Remarque
>
>`findDOMNode` est une échappatoire utilisée pour accéder au nœud du DOM associé au composant.  La plupart du temps, nous déconseillons le recours à cette échappatoire parce qu’elle rompt l’abstraction du composant. [Elle est d’ailleurs désormais dépréciée en mode strict.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
ReactDOM.findDOMNode(component)
```

Si le composant a été monté dans le DOM, cette méthode renvoie l’élément DOM (natif au navigateur) qui a servi de point de montage. Ça peut être utile pour lire des valeurs issues du DOM, telles que la valeur d’un champ de formulaire, ou pour effectuer des mesures de tailles sur les nœuds du DOM.  **La plupart du temps, préférez associer une ref au nœud du DOM, et évitez complètement `findDOMNode`.**

Quand le rendu d’un composant produit `null` ou `false`, `finDOMNode` renvoie `null`.  Quand ça produit une chaîne de caractère, `findDOMNode` renvoie le nœud DOM textuel qui contient cette valeur.  Depuis React 16, un composant peut renvoyer un fragment avec de multiples enfants, auquel cas `findDOMNode` renverra le nœud DOM correspondant au premier enfant non-vide.

>Remarque
>
>`findDOMNode` ne fonctionne que sur des composants montés (c’est-à-dire des composants qui ont été placés dans le DOM).  Si vous tentez de l’appeler sur un composant qui n’a pas encore été monté (par exemple en appelant `findDOMNode()` dans le `render()` initial d’un composant), une exception sera levée.
>
>`findDOMNode` ne peut pas être utilisée sur des fonctions composants.

* * *

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

Crée un portail.  Les portails fournissent un moyen d’[afficher des enfants dans un nœud du DOM à l’extérieur de la hiérarchie DOM du composant](/docs/portals.html).
