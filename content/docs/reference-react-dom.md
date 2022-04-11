---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

<<<<<<< HEAD
Si vous chargez React directement au moyen d’une balise `<script>`, ces API de haut-niveau seront disponibles directement via la variable globale `ReactDOM`.  Si vous utilisez ES6 avec `npm`, vous pouvez écrire `import ReactDOM from 'react-dom'`.  Si vous utilisez ES5 avec npm, utilisez `var ReactDOM = require('react-dom')`.
=======
The `react-dom` package provides DOM-specific methods that can be used at the top level of your app and as an escape hatch to get outside the React model if you need to.

```js
import * as ReactDOM from 'react-dom';
```

If you use ES5 with npm, you can write:

```js
var ReactDOM = require('react-dom');
```

The `react-dom` package also provides modules specific to client and server apps:
- [`react-dom/client`](/docs/react-dom-client.html)
- [`react-dom/server`](/docs/react-dom-server.html)
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

## Aperçu {#overview}

<<<<<<< HEAD
Le module `react-dom` fournit des méthodes spécifiques au DOM que vous pouvez utiliser au niveau racine de votre appli et comme échappatoire pour travailler hors du modèle React si vous en avez besoin.  La plupart des composants ne devraient jamais avoir besoin d’utiliser ce module.
=======
The `react-dom` package exports these methods:
- [`createPortal()`](#createportal)
- [`flushSync()`](#flushsync)
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

These `react-dom` methods are also exported, but are considered legacy:
- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`findDOMNode()`](#finddomnode)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)

> Note: 
> 
> Both `render` and `hydrate` have been replaced with new [client methods](/docs/react-dom-client.html) in React 18. These methods will warn that your app will behave as if it's running React 17 (learn more [here](https://reactjs.org/link/switch-to-createroot)).

### Navigateurs pris en charge {#browser-support}

<<<<<<< HEAD
React prend en charge tous les navigateurs populaires, y compris Internet Explorer 9 et au-delà, même si [certains polyfills sont nécessaires](/docs/javascript-environment-requirements.html) pour les navigateurs plus anciens tels qu’IE 9 et IE 10.
=======
React supports all modern browsers, although [some polyfills are required](/docs/javascript-environment-requirements.html) for older versions.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

>Remarque
>
<<<<<<< HEAD
>Nous ne prenons pas en charge les navigateurs plus anciens qui n'exposent pas les méthodes ES5 mais vous verrez que vos applis peuvent y fonctionner si vous incluez des polyfills tels que [es5-shim et es5-sham](https://github.com/es-shims/es5-shim) dans la page.  Ceci dit, vous serez alors livré·e à vous-même en termes de support.

* * *
=======
> We do not support older browsers that don't support ES5 methods or microtasks such as Internet Explorer. You may find that your apps do work in older browsers if polyfills such as [es5-shim and es5-sham](https://github.com/es-shims/es5-shim) are included in the page, but you're on your own if you choose to take this path.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

## Référence de l’API {#reference}

### `createPortal()` {#createportal}

```javascript
createPortal(child, container)
```

<<<<<<< HEAD
Affiche un élément React au sein du nœud DOM spécifié par `container` et renvoie une [référence](/docs/more-about-refs.html) sur le composant (ou renvoie `null` pour les [fonctions composants](/docs/components-and-props.html#function-and-class-components)).
=======
Creates a portal. Portals provide a way to [render children into a DOM node that exists outside the hierarchy of the DOM component](/docs/portals.html).

### `flushSync()` {#flushsync}

```javascript
flushSync(callback)
```

Force React to flush any updates inside the provided callback synchronously. This ensures that the DOM is updated immediately.

```javascript
// Force this state update to be synchronous.
flushSync(() => {
  setCount(count + 1);
});
// By this point, DOM is updated.
```

> Note:
> 
> `flushSync` can significantly hurt performance. Use sparingly.
> 
> `flushSync` may force pending Suspense boundaries to show their `fallback` state.
> 
> `flushSync` may also run pending effects and synchronously apply any updates they contain before returning.
> 
> `flushSync` may also flush updates outside the callback when necessary to flush the updates inside the callback. For example, if there are pending updates from a click, React may flush those before flushing the updates inside the callback.

## Legacy Reference {#legacy-reference}
### `render()` {#render}
```javascript
render(element, container[, callback])
```

> Note:
>
> `render` has been replaced with `createRoot` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Render a React element into the DOM in the supplied `container` and return a [reference](/docs/more-about-refs.html) to the component (or returns `null` for [stateless components](/docs/components-and-props.html#function-and-class-components)).
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

Si l’élément React était déjà affiché dans `container`, cette méthode effectuera plutôt une mise à jour et ne modifiera le DOM que là où c’est strictement nécessaire pour refléter l’élément React à jour.

Si la fonction de rappel optionnelle est fournie, elle sera exécutée après que le composant est affiché ou mis à jour.

>Remarque
>
<<<<<<< HEAD
>`ReactDOM.render()` contrôle le contenu du nœud conteneur que vous lui passez.  Tout élément DOM existant à l’intérieur sera potentiellement remplacé au premier appel.  Les appels ultérieurs utiliseront l’algorithme de différence DOM de React pour des mises à jour efficaces.
>
>`ReactDOM.render()` ne modifie pas le nœud conteneur lui-même (seulement ses enfants).  Il peut arriver qu’insérer un composant dans un nœud DOM existant n’en modifie pas les enfants.
>
>`ReactDOM.render()` renvoie pour le moment une référence sur l’instance racine de composant React.  Toutefois, manipuler la valeur renvoyée est considéré comme déprécié, et vous devriez vous en abstenir dans la mesure où de futures versions de React pourraient gérer le rendu de façon asynchrone dans certains cas.  Si vous avez besoin d’une référence sur l’instance racine de composant React, une meilleure solution consiste à associer une [ref de rappel](/docs/more-about-refs.html#callback-refs) à l’élément racine.
>
>Utiliser `ReactDOM.render()` pour hydrater un conteneur rendu côté serveur est une pratique dépréciée qui disparaîtra avec React 17.  Utilisez plutôt la méthode [`hydrate()`](#hydrate).
=======
> `render()` controls the contents of the container node you pass in. Any existing DOM elements inside are replaced when first called. Later calls use React’s DOM diffing algorithm for efficient updates.
>
> `render()` does not modify the container node (only modifies the children of the container). It may be possible to insert a component to an existing DOM node without overwriting the existing children.
>
> `render()` currently returns a reference to the root `ReactComponent` instance. However, using this return value is legacy
> and should be avoided because future versions of React may render components asynchronously in some cases. If you need a reference to the root `ReactComponent` instance, the preferred solution is to attach a
> [callback ref](/docs/refs-and-the-dom.html#callback-refs) to the root element.
>
> Using `render()` to hydrate a server-rendered container is deprecated. Use [`hydrateRoot()`](#hydrateroot) instead.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

* * *

### `hydrate()` {#hydrate}

```javascript
hydrate(element, container[, callback])
```

<<<<<<< HEAD
Similaire à [`render()`](#render), mais sert à hydrater un conteneur dont le HTML a déjà été produit par [`ReactDOMServer`](/docs/react-dom-server.html). React tentera alors d’associer les gestionnaires d’événements au balisage existant.
=======
> Note:
>
> `hydrate` has been replaced with `hydrateRoot` in React 18. See [hydrateRoot](/docs/react-dom-client.html#hydrateroot) for more info.

Same as [`render()`](#render), but is used to hydrate a container whose HTML contents were rendered by [`ReactDOMServer`](/docs/react-dom-server.html). React will attempt to attach event listeners to the existing markup.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

React s’attend à ce que le balisage produit soit identique entre le serveur et le client. Il peut gérer des différences de contenu textuel mais vous devriez considérer toute erreur de correspondance comme un bug et la corriger. En mode développement, React vous avertit de telles erreurs lors de l’hydratation. Nous ne garantissons notamment pas que les écarts d’attributs seront correctement résolus. C’est important pour les performances car dans la plupart des applications les erreurs de correspondance sont rares et faire une validation trop fine du balisage serait sans doute inutilement coûteux.

Si un attribut ou contenu textuel sur un élément précis est forcément différent entre le serveur et le client (par exemple, un horodatage), vous pouvez empêcher cet avertissement en ajoutant `suppressHydrationWarning={true}` à l’élément. Ça ne marche toutefois qu’à un niveau de profondeur et c’est considéré comme une échappatoire. N’en abusez pas.  À moins qu’il ne s’agisse de contenu textuel, React ne tentera de toutes façons pas de résoudre la différence qui pourrait rester incohérente jusqu’aux prochaines mises à jour.

Si vous faites volontairement un rendu différent entre le serveur et le client, vous pouvez procéder à un rendu en deux passes. Les composants qui ont un rendu serveur différent peuvent lire une variable d’état local du style `this.state.isClient`, que vous définirez à `true` au sein de `componentDidMount()`. Ainsi, la première passe de rendu affichera le même contenu que celui du serveur, évitant les écarts, mais une passe supplémentaire surviendra de façon synchrone juste après l’hydratation.  Remarquez que cette approche ralentira l’initialisation de vos composants car ils devront faire un double rendu au démarrage : ne l’employez qu’avec précaution.

Souvenez-vous que les connexions lentes ont un impact sur l’expérience utilisateur. Le code JavaScript peut être chargé très longtemps après l’affichage HTML initial de sorte que si vous affichez quelque chose de différent lors du rendu coté client, la transition risque de désorienter l’utilisateur. Ceci dit, si vous vous y prenez bien, il peut tout de même être utile de produire d’abord une « ossature » de l’application sur le serveur et de n’ajouter certains éléments visuels supplémentaires qu’une fois coté client.  Pour apprendre à faire ça sans souffrir d'écarts de balisage, relisez le paragraphe précédent.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
unmountComponentAtNode(container)
```

<<<<<<< HEAD
Retire un composant React monté du DOM et nettoie ses gestionnaires d’événements et son état local.  Si aucun composant n’était monté sur ce conteneur, appeler cette fonction ne fait rien.  Renvoie `true` si un composant a bien été démonté et `false` si aucun composant ne nécessitait de démontage.
=======
> Note:
>
> `unmountComponentAtNode` has been replaced with `root.unmount()` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Remove a mounted React component from the DOM and clean up its event handlers and state. If no component was mounted in the container, calling this function does nothing. Returns `true` if a component was unmounted and `false` if there was no component to unmount.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

* * *

### `findDOMNode()` {#finddomnode}

>Remarque
>
>`findDOMNode` est une échappatoire utilisée pour accéder au nœud du DOM associé au composant.  La plupart du temps, nous déconseillons le recours à cette échappatoire parce qu’elle rompt l’abstraction du composant. [Elle est d’ailleurs désormais dépréciée en mode strict.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
findDOMNode(component)
```

Si le composant a été monté dans le DOM, cette méthode renvoie l’élément DOM (natif au navigateur) qui a servi de point de montage. Ça peut être utile pour lire des valeurs issues du DOM, telles que la valeur d’un champ de formulaire, ou pour effectuer des mesures de tailles sur les nœuds du DOM.  **La plupart du temps, préférez associer une ref au nœud du DOM, et évitez complètement `findDOMNode`.**

Quand le rendu d’un composant produit `null` ou `false`, `finDOMNode` renvoie `null`.  Quand ça produit une chaîne de caractère, `findDOMNode` renvoie le nœud DOM textuel qui contient cette valeur.  Depuis React 16, un composant peut renvoyer un fragment avec de multiples enfants, auquel cas `findDOMNode` renverra le nœud DOM correspondant au premier enfant non-vide.

>Remarque
>
>`findDOMNode` ne fonctionne que sur des composants montés (c’est-à-dire des composants qui ont été placés dans le DOM).  Si vous tentez de l’appeler sur un composant qui n’a pas encore été monté (par exemple en appelant `findDOMNode()` dans le `render()` initial d’un composant), une exception sera levée.
>
>`findDOMNode` ne peut pas être utilisée sur des fonctions composants.

* * *
<<<<<<< HEAD

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

Crée un portail.  Les portails fournissent un moyen d’[afficher des enfants dans un nœud du DOM à l’extérieur de la hiérarchie DOM du composant](/docs/portals.html).
=======
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b
