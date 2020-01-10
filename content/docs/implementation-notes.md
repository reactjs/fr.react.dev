---
id: implementation-notes
title: Notes d’implémentation
layout: contributing
permalink: docs/implementation-notes.html
prev: codebase-overview.html
next: design-principles.html
redirect_from:
  - "contributing/implementation-notes.html"
---

Cette section fournit un ensemble de notes relatives à l’implémentation du [réconciliateur *“stack”*](/docs/codebase-overview.html#stack-reconciler).

C'est très technique et suppose une solide compréhension de l’API publique de React ainsi que de sa structure divisée en noyau, moteurs de rendu et réconciliateur. Si vous ne connaissez pas bien la base de code React, lisez d'abord l'[aperçu du code source](/docs/codebase-overview.html).

Ça suppose également de comprendre les [différences entre les composants React, leurs instances et leurs éléments](/blog/2015/12/18/react-components-elements-and-instances.html).

Le réconciliateur *“stack”* était utilisé jusqu’à React 15 inclus. Il se trouve dans [src/renderers/shared/stack/reconciler](https://github.com/facebook/react/tree/15-stable/src/renderers/shared/stack/reconciler).

### Vidéo : construire React à partir de zéro {#video-building-react-from-scratch}

[Paul O'Shannessy](https://twitter.com/zpao) a donné une conférence (en anglais) sur la [construction de React à partir de zéro](https://www.youtube.com/watch?v=_MAD4Oly9yg) qui a largement inspiré ce document.

Ce document et sa conférence sont des simplifications de la véritable base de code : en vous familiarisant avec ces deux sources, vous devriez mieux comprendre.

### Aperçu {#overview}

Le réconciliateur lui-même n’a pas d’API publique. Les [moteurs de rendu](/docs/codebase-overview.html#renderers) comme React DOM et React Native l'utilisent pour mettre à jour efficacement l'interface utilisateur en fonction des composants React écrits par l'utilisateur.

### Le montage, un processus récursif {#mounting-as-a-recursive-process}

Intéressons-nous à la première fois que vous montez un composant :

```js
ReactDOM.render(<App />, rootEl);
```

React DOM passera `<App />` au réconciliateur. Rappelez-vous que `<App />` est un élément React, c’est-à-dire une description de *quoi* afficher. Vous pouvez le considérer comme un simple objet :

```js
console.log(<App />);
// { type: App, props: {} }
```

Le réconciliateur vérifiera si `App` est une classe ou une fonction.

Si `App` est une fonction, le réconciliateur appellera `App(props)` pour obtenir le rendu de l’élément associé.

Si `App` est une classe, le réconciliateur instanciera une `App` avec `new App(props)`, appellera la méthode de cycle de vie `componentWillMount()`, puis appellera la méthode `render()` pour obtenir le rendu de l’élément.

Dans les deux cas, le réconciliateur saura quel élément « a été produit par le rendu » de `App`.

Ce processus est récursif. Le rendu de `App` peut produire un `<Greeting />`, celui de `Greeting` peut produire un `<Button />`, et ainsi de suite. Le réconciliateur « creusera » récursivement dans les composants définis par l'utilisateur, et saura ainsi ce que produit le rendu de chacun.

Vous pouvez imaginer ce processus comme un pseudo-code :

```js
function isClass(type) {
  // Les sous-classes de React.Component ont ce drapeau
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// Cette fonction prend en paramètre un élément React (par exemple <App />)
// et renvoie un nœud DOM ou natif représentant l’arbre monté.
function mount(element) {
  var type = element.type;
  var props = element.props;

  // Nous déterminerons l’élément rendu
  // soit en exécutant le type comme une fonction
  // soit en créant une instance puis en appelant render().
  var renderedElement;
  if (isClass(type)) {
    // Composant basé classe
    var publicInstance = new type(props);
    // Initialise les props
    publicInstance.props = props;
    // Appelle le cycle de vie si besoin
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    // Obtient l’élément rendu en appelant render()
    renderedElement = publicInstance.render();
  } else {
    // Fonction composant
    renderedElement = type(props);
  }

  // Ce processus est récursif parce qu’un composant peut
  // renvoyer un élément avec un autre type de composant.
  return mount(renderedElement);

  // Remarque : cette implémentation est incomplète et la récursivité est infinie !
  // Ça gère uniquement les éléments comme <App /> ou <Button />.
  // Ça ne gère pas pour l’instant les éléments comme <div /> ou <p />.
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

>Remarque
>
>C’est *vraiment* du pseudo-code. L'implémentation actuelle diffère pas mal. Ce code saturerait la pile car nous n’avons pas précisé de condition d’arrêt pour la récursivité.

Récapitulons quelques idées clés dans l’exemple ci-dessus :

* Les éléments React sont des objets simples représentant le type du composant (par exemple `App`) et les props.
* Les composants définis par l'utilisateur (par exemple `App`) peuvent être des classes ou des fonctions mais toutes « font un rendu » avec des éléments comme résultat.
* Le « montage » est un processus récursif qui crée un arbre DOM ou natif à partir de l'élément racine React (par exemple `<App />`).

### Montage d'éléments hôtes {#mounting-host-elements}

Ce processus serait inutile si nous n'affichions pas quelque chose à l'écran au final.

En plus des composants définis par l'utilisateur (« composites »), les éléments React peuvent également représenter des composants pour des plates-formes spécifiques (« hôtes »). Par exemple, la méthode de rendu de `Button` pourrait renvoyer une `<div />`.

Si la propriété `type` de l'élément est une chaîne de caractères, il s’agit d’un élément hôte :

```js
console.log(<div />);
// { type: 'div', props: {} }
```

Il n’y a aucun code défini par l’utilisateur associé aux éléments hôtes.

Lorsque le réconciliateur rencontre un élément hôte, il laisse le moteur de rendu s'occuper du montage. Par exemple, React DOM créerait un nœud DOM.

Si l'élément hôte a des enfants, le réconciliateur les monte de manière récursive en suivant le même algorithme que celui décrit plus haut. Peu importe que les enfants soient hôtes (comme `<div><hr /></div>`), composites (comme `<div><Button /></div>`) ou un mélange des deux.

Les nœuds DOM produits par les composants enfants seront ajoutés au nœud DOM parent, et donc de manière récursive, l’ensemble de la structure DOM sera constituée.

>Remarque
>
>Le réconciliateur lui-même n'est pas lié au DOM. Le résultat exact du montage (parfois appelé *“mount image”* dans le code source) dépend du moteur de rendu, et donc peut être un nœud DOM (React DOM), une chaîne de caractères (React DOM Server) ou un nombre représentant une vue native (React Native).

Si nous devions étendre le code pour gérer des éléments hôtes, il ressemblerait à ceci :

```js
function isClass(type) {
  // Les sous-classes de React.Component ont ce drapeau
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// Cette fonction gère uniquement les éléments avec un type composite.
// Par exemple, elle gère <App /> et <Button />, mais pas une <div />.
function mountComposite(element) {
  var type = element.type;
  var props = element.props;

  var renderedElement;
  if (isClass(type)) {
    // Composant basé classe
    var publicInstance = new type(props);
    // Initialise les props
    publicInstance.props = props;
    // Appelle le cycle de vie si besoin
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    renderedElement = publicInstance.render();
  } else if (typeof type === 'function') {
    // Fonction composant
    renderedElement = type(props);
  }

  // C’est récursif mais nous atteindrons finalement le bas de la récursion lorsque
  // l’élément sera hôte (par exemple <div />) au lieu de composite (par exemple <App />) :
  return mount(renderedElement);
}

// Cette fonction gère uniquement les éléments avec un type hôte.
// Par exemple, il gère <div /> et <p />, mais pas un <App />.
function mountHost(element) {
  var type = element.type;
  var props = element.props;
  var children = props.children || [];
  if (!Array.isArray(children)) {
    children = [children];
  }
  children = children.filter(Boolean);

  // Ce bloc de code ne devrait pas être dans le réconciliateur.
  // Les différents moteurs de rendu peuvent initialiser les nœuds différemment.
  // Par exemple, React Native crée des vues iOS ou Android.
  var node = document.createElement(type);
  Object.keys(props).forEach(propName => {
    if (propName !== 'children') {
      node.setAttribute(propName, props[propName]);
    }
  });

  // Monte les enfants
  children.forEach(childElement => {
    // L’enfant peut être hôte (par exemple <div />) ou composite (par exemple <Button />).
    // Nous les monterons également de manière récursive :
    var childNode = mount(childElement);

    // Cette ligne de code est également spécifique au moteur de rendu.
    // Ce serait différent en fonction du moteur de rendu :
    node.appendChild(childNode);
  });

  // Renvoie le nœud DOM comme résultat de montage.
  // C’est ici que se termine la récursion.
  return node;
}

function mount(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // Composants définis par l’utilisateur
    return mountComposite(element);
  } else if (typeof type === 'string') {
    // Composants spécifiques aux plates-formes
    return mountHost(element);
  }
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

Ça fonctionne mais ça reste loin de la manière dont le réconciliateur est réellement implémenté. L’ingrédient clé manquant est la prise en charge des mises à jour.

### Voici venir les instances internes {#introducing-internal-instances}

La principale caractéristique de React est que vous pouvez refaire tout le rendu sans recréer le DOM ni réinitialiser l'état :

```js
ReactDOM.render(<App />, rootEl);
// Devrait réutiliser le DOM existant :
ReactDOM.render(<App />, rootEl);
```

Cependant, notre implémentation ci-dessus sait uniquement monter l'arbre initial. Elle ne peut pas effectuer de mises à jour dans l'arborescence car elle ne stocke pas toutes les informations nécessaires, telles que toutes les références `publicInstance` ou les nœuds DOM qui correspondent aux composants.

La base de code du réconciliateur *“stack”* résout ce problème en faisant de la fonction `mount()` une méthode au sein d’une classe. Cette approche présente des inconvénients et nous allons dans la direction opposée pour la [réécriture en cours du réconciliateur](/docs/codebase-overview.html#fiber-reconciler). Cependant, voici comment ça fonctionne dans le réconciliateur historique.

Plutôt que deux fonctions distinctes `mountHost` et `mountComposite`, nous créerons deux classes : `DOMComponent` et `CompositeComponent`.

Les deux classes ont un constructeur acceptant `element`, ainsi qu'une méthode `mount()` qui renvoie le nœud monté. Nous remplacerons la fonction racine `mount()` par une fabrique _(factory, NdT)_ qui instanciera la bonne classe :

```js
function instantiateComponent(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // Composants définis par l’utilisateur
    return new CompositeComponent(element);
  } else if (typeof type === 'string') {
    // Composants spécifiques aux plates-formes
    return new DOMComponent(element);
  }
}
```

Tout d’abord, examinons l'implémentation de `CompositeComponent` :

```js
class CompositeComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedComponent = null;
    this.publicInstance = null;
  }

  getPublicInstance() {
    // Pour les composants composites, exposons l’instance de la classe.
    return this.publicInstance;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;

    var publicInstance;
    var renderedElement;
    if (isClass(type)) {
      // Composant basé classe
      publicInstance = new type(props);
      // Initialise les props
      publicInstance.props = props;
      // Appelle le cycle de vie si besoin
      if (publicInstance.componentWillMount) {
        publicInstance.componentWillMount();
      }
      renderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Fonction composant
      publicInstance = null;
      renderedElement = type(props);
    }

    // Sauvegarde l’instance publique
    this.publicInstance = publicInstance;

    // Construit l’instance interne de l’enfant en fonction de l’élément.
    // Ce sera un DOMComponent pour <div /> ou <p />,
    // et un CompositeComponent pour <App /> ou <Button /> :
    var renderedComponent = instantiateComponent(renderedElement);
    this.renderedComponent = renderedComponent;

    // Monte le résultat du rendu
    return renderedComponent.mount();
  }
}
```

Ce n'est pas très différent de notre implémentation précédente de `mountComposite()`, mais maintenant, nous pouvons sauver certaines informations, telles que `this.currentElement`, `this.renderedComponent` et `this.publicInstance`, pour les utiliser lors des mises à jour d’éléments.

Remarquez qu’une instance de `CompositeComponent` n’est pas la même chose qu’une instance du `element.type` fourni par l'utilisateur. `CompositeComponent` est un détail d'implémentation de notre réconciliateur et n'est jamais exposé à l'utilisateur. La classe définie par l'utilisateur est celle que nous avons lue dans `element.type`, et `CompositeComponent` crée une instance de celle-ci.

Pour éviter toute confusion, nous appellerons les instances de `CompositeComponent` et `DOMComponent` des « instances internes ». Elles existent pour nous permettre de leur associer des données durables. Seuls le moteur de rendu et le réconciliateur s’en servent.

En revanche, nous appelons une instance de classe définie par l'utilisateur « instance publique ». L'instance publique, c'est ce que vous voyez comme `this` dans `render()` et les autres méthodes de vos composants personnalisés.

La fonction `mountHost()` a été refactorisée pour devenir la méthode `mount()` dans la classe `DOMComponent`, et son code a des airs familiers :

```js
class DOMComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedChildren = [];
    this.node = null;
  }

  getPublicInstance() {
    // Pour les composants DOM, expose uniquement le nœud du DOM.
    return this.node;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;
    var children = props.children || [];
    if (!Array.isArray(children)) {
      children = [children];
    }

    // Crée et sauvegarde le nœud
    var node = document.createElement(type);
    this.node = node;

    // Initialise les attributs
    Object.keys(props).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, props[propName]);
      }
    });

    // Crée et sauvegarde les enfants contenus.
    // Chacun d’eux peut être un DOMComponent ou un CompositeComponent,
    // selon que le type de l’élément est une chaîne de caractères ou une fonction.
    var renderedChildren = children.map(instantiateComponent);
    this.renderedChildren = renderedChildren;

    // Collecte les nœuds DOM qui sont renvoyés lors du montage
    var childNodes = renderedChildren.map(child => child.mount());
    childNodes.forEach(childNode => node.appendChild(childNode));

    // Renvoie le nœud DOM comme résultat du montage
    return node;
  }
}
```

Après la refactorisation de `mountHost()`, la différence principale est que nous conservons `this.node` et `this.renderedChildren`, qui sont maintenant associés à l'instance interne du composant DOM. Nous les utiliserons également à l'avenir pour appliquer des mises à jour non destructives.

Par conséquent, chaque instance interne, composite ou hôte, pointe maintenant vers ses instances internes enfants. Pour vous aider à le visualiser, si une fonction composant `<App>` donne un composant basé classe `<Button>`, et qu’un `Button` donne une `<div>`, l'arbre des instances internes ressemblera à ceci :

```js
[object CompositeComponent] {
  currentElement: <App />,
  publicInstance: null,
  renderedComponent: [object CompositeComponent] {
    currentElement: <Button />,
    publicInstance: [object Button],
    renderedComponent: [object DOMComponent] {
      currentElement: <div />,
      node: [object HTMLDivElement],
      renderedChildren: []
    }
  }
}
```

Dans le DOM, vous verriez uniquement la `<div>`. Pourtant, l’arbre d’instances internes contient tant les instances internes composites que celles hôtes.

Les instances internes composites ont besoin de stocker :

* L'élément actuel.
* L'instance publique si le type de l'élément est une classe.
* L’instance interne unique produite par le rendu. Il peut s'agir d'un `DOMComponent` ou d’un `CompositeComponent`.

Les instances internes hôtes ont besoin de stocker :

* L'élément actuel.
* Le nœud DOM.
* Toutes les instances internes enfants. Chacune d’elles peut être soit un `DOMComponent` soit un `CompositeComponent`.

Si vous avez du mal à imaginer la structure d’un arbre d’instances internes dans des applications plus complexes, [React DevTools](https://github.com/facebook/react-devtools) peut vous donner une bonne approximation, dans la mesure où il signale les instances hôtes en gris, et les instances composites en violet :

 <img src="../images/docs/implementation-notes-tree.png" width="500" style="max-width: 100%" alt="Arbre React DevTools" />

Pour terminer cette refactorisation, nous allons introduire une fonction qui monte une arbre complet dans un nœud conteneur, tout comme `ReactDOM.render()`. Elle renvoie une instance publique, là aussi comme `ReactDOM.render()` :

```js
function mountTree(element, containerNode) {
  // Crée une instance interne racine
  var rootComponent = instantiateComponent(element);

  // Monte le composant racine dans le conteneur
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Renvoie l’instance publique fournie
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}

var rootEl = document.getElementById('root');
mountTree(<App />, rootEl);
```

### Démontage {#unmounting}

Maintenant que nous avons des instances internes qui conservent leurs enfants et les nœuds DOM, nous pouvons implémenter le démontage. Pour un composant composite, le démontage appelle une méthode de cycle de vie et opère récursivement.

```js
class CompositeComponent {

  // ...

  unmount() {
    // Appelle la méthode de cycle de vie si besoin
    var publicInstance = this.publicInstance;
    if (publicInstance) {
      if (publicInstance.componentWillUnmount) {
        publicInstance.componentWillUnmount();
      }
    }

    // Démonte l’unique composant affiché
    var renderedComponent = this.renderedComponent;
    renderedComponent.unmount();
  }
}
```

Pour `DOMComponent`, le démontage appelle celui de chaque enfant :

```js
class DOMComponent {

  // ...

  unmount() {
    // Démonte tous les éléments enfants
    var renderedChildren = this.renderedChildren;
    renderedChildren.forEach(child => child.unmount());
  }
}
```

En pratique, le démontage des composants DOM enlève également les écouteurs d'événements et efface certains caches, mais nous ignorerons ces détails.

Nous pouvons maintenant ajouter une nouvelle fonction racine appelée `unmountTree(containerNode)`, semblable à `ReactDOM.unmountComponentAtNode()` :

```js
function unmountTree(containerNode) {
  // Lit l’instance interne depuis un nœud DOM :
  // (Ça ne fonctionne pas encore, il faudra changer mountTree() pour le stocker.)
  var node = containerNode.firstChild;
  var rootComponent = node._internalInstance;

  // Démonte l’arbre et efface le conteneur
  rootComponent.unmount();
  containerNode.innerHTML = '';
}
```

Pour que ça fonctionne, nous devons lire une instance interne racine à partir d'un nœud DOM. Nous modifierons `mountTree()` pour ajouter la propriété `_internalInstance` au nœud DOM racine. Nous apprendrons aussi à `mountTree()` à détruire n'importe quel arbre existant, donc nous pourrons l'appeler plusieurs fois :

```js
function mountTree(element, containerNode) {
  // Détruit un éventuel arbre existant
  if (containerNode.firstChild) {
    unmountTree(containerNode);
  }

  // Crée l’instance interne racine
  var rootComponent = instantiateComponent(element);

  // Monte le composant racine dans un conteneur
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Sauvegarde une référence à l’instance interne
  node._internalInstance = rootComponent;

  // Renvoie l’instance publique fournie
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}
```

À présent, l’exécution répétée de `unmountTree()` ou de `mountTree()` supprime l’ancien arbre et exécute la méthode de cycle de vie `componentWillUnmount()` sur les composants.

### Mise à jour {#updating}

Dans la section précédente, nous avons implémenté le démontage. Cependant, React ne serait pas très utile si à chaque modification de prop, l'arbre entier était démonté puis remonté. Le but du réconciliateur est de réutiliser dans la mesure du possible les instances existantes afin de préserver le DOM et l’état local :

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Devrait réutiliser le DOM existant :
mountTree(<App />, rootEl);
```

Nous allons ajouter une méthode supplémentaire au contrat de nos instances internes. En plus de `mount()` et `unmount()`, `DOMComponent` et `CompositeComponent` implémenteront une nouvelle méthode appelée `receive(nextElement)` :

```js
class CompositeComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}

class DOMComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}
```

Son travail consiste à faire tout le nécessaire pour mettre à jour le composant (et ses enfants) avec la description fournie par `nextElement`.

C’est la partie qui est souvent décrite comme la « comparaison de DOM virtuel » *(virtual DOM diffing, NdT)*, même si ça consiste en réalité à parcourir récursivement l'arbre interne pour permettre à chaque instance interne de recevoir une mise à jour.

### Mise à jour des composants composites {#updating-composite-components}

Lorsqu'un composant composite reçoit un nouvel élément, nous exécutons la méthode de cycle de vie `componentWillUpdate()`.

Ensuite nous rafraîchissons le composant avec les nouvelles props et récupérons le prochain élément issu du rendu :

```js
class CompositeComponent {

  // ...

  receive(nextElement) {
    var prevProps = this.currentElement.props;
    var publicInstance = this.publicInstance;
    var prevRenderedComponent = this.renderedComponent;
    var prevRenderedElement = prevRenderedComponent.currentElement;

    // Met à jour l’élément *associé*
    this.currentElement = nextElement;
    var type = nextElement.type;
    var nextProps = nextElement.props;

    // Détermine quel est le prochain résultat de render()
    var nextRenderedElement;
    if (isClass(type)) {
      // Composant basé classe
      // Appelle le cycle de vie si besoin
      if (publicInstance.componentWillUpdate) {
        publicInstance.componentWillUpdate(nextProps);
      }
      // Met à jour les props
      publicInstance.props = nextProps;
      // Rafraîchit
      nextRenderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Fonction composant
      nextRenderedElement = type(nextProps);
    }

    // ...
```

Ensuite, nous pouvons regarder le `type` de l'élément produit. Si le `type` n'a pas changé depuis le dernier rendu, le composant sous-jacent peut être mis à jour directement.

Par exemple, s'il renvoie `<Button color="red" />` la première fois et `<Button color="blue" />` la seconde fois, nous pouvons simplement dire à l'instance interne correspondante de recevoir (`receive()`) l'élément mis à jour :

```js
    // ...

    // Si le type de l’élément affiché n’a pas changé,
    // réutilise l’instance du composant existant et sort.
    if (prevRenderedElement.type === nextRenderedElement.type) {
      prevRenderedComponent.receive(nextRenderedElement);
      return;
    }

    // ...
```

Cependant, si l’élément mis à jour a un `type` différent de celui affiché jusqu'ici, nous ne pouvons pas mettre à jour l’instance interne. Un `<button>` ne peut pas simplement « devenir » un `<input>`.

Dans ce cas, nous devons démonter l'instance interne existante et monter la nouvelle correspondant au type du nouvel élément. Par exemple, voici ce qui se produit lorsqu'un composant ayant précédemment affiché un `<button />` affiche désormais un `<input />` :

```js
    // ...

    // Si nous arrivons jusqu’ici, nous devons démonter le composant
    // précédemment monté, monter le nouveau et échanger leurs nœuds.

    // Récupère l’ancien nœud car il devra être remplacé
    var prevNode = prevRenderedComponent.getHostNode();

    // Démonte l’ancien élément enfant et en monte un nouveau
    prevRenderedComponent.unmount();
    var nextRenderedComponent = instantiateComponent(nextRenderedElement);
    var nextNode = nextRenderedComponent.mount();

    // Remplace la référence à l’enfant
    this.renderedComponent = nextRenderedComponent;

    // Remplace l’ancien nœud par le nouveau.
    // Remarque : il s’agit d’un code spécifique au moteur de rendu et
    // idéalement il devrait vivre en dehors de CompositeComponent :
    prevNode.parentNode.replaceChild(nextNode, prevNode);
  }
}
```

En résumé, lorsqu'un composant composite reçoit un nouvel élément, il peut soit déléguer la mise à jour à son instance interne issue du rendu précédent, soit la démonter et en monter une nouvelle en remplacement.

Il existe un autre cas dans lequel un composant va être remonté plutôt que de recevoir un élément : lorsque la `key` de cet élément a été modifiée. Nous ne voyons pas la gestion des `key` dans ce document, car elle ajoute une complexité supplémentaire à un tutoriel déjà velu.

Remarquez que nous devons encore ajouter une méthode appelée `getHostNode()` à l'instance interne afin qu'il soit possible de localiser le nœud spécifique à la plate-forme et de le remplacer lors de la mise à jour. Son implémentation est simple pour les deux classes :

```js
class CompositeComponent {
  // ...

  getHostNode() {
    // Demande au composant issu du rendu de le fournir.
    // Ça analysera récursivement tous les composites.
    return this.renderedComponent.getHostNode();
  }
}

class DOMComponent {
  // ...

  getHostNode() {
    return this.node;
  }
}
```

### Mise à jour des composants hôtes {#updating-host-components}

Les implémentations de composant hôte, comme `DOMComponent`, font leurs mises à jour différemment. À la réception d’un élément, ils ont besoin de mettre à jour la vue spécifique à la plate-forme sous-jacente. Dans le cas de React DOM, ça implique de mettre à jour les attributs DOM :

```js
class DOMComponent {
  // ...

  receive(nextElement) {
    var node = this.node;
    var prevElement = this.currentElement;
    var prevProps = prevElement.props;
    var nextProps = nextElement.props;
    this.currentElement = nextElement;

    // Supprime les anciens attributs.
    Object.keys(prevProps).forEach(propName => {
      if (propName !== 'children' && !nextProps.hasOwnProperty(propName)) {
        node.removeAttribute(propName);
      }
    });
    // Initialise les nouveaux attributs.
    Object.keys(nextProps).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, nextProps[propName]);
      }
    });

    // ...
```

Ensuite, les composants hôtes doivent mettre à jour leurs enfants. Contrairement aux composants composites, ils peuvent posséder plusieurs enfants.

Dans cet exemple simplifié, nous utilisons un tableau d'instances internes et itérons dessus. Si le `type` reçu des instances internes correspond au `type` précédent, nous les mettons à jour, sinon nous les remplaçons. Le vrai réconciliateur prend également en compte la `key` de l'élément et détecte les déplacements en plus des insertions et des suppressions, mais nous omettons cette logique.

Nous collectons les opérations DOM sur les enfants dans une liste, afin de pouvoir les exécuter par lot :

```js
    // ...

    // Ce sont des tableaux d’éléments React :
    var prevChildren = prevProps.children || [];
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }
    var nextChildren = nextProps.children || [];
    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }
    // Ce sont des tableaux d’instances internes :
    var prevRenderedChildren = this.renderedChildren;
    var nextRenderedChildren = [];

    // Au fil de l’itération sur les enfants, nous ajouterons des opérations dans le tableau.
    var operationQueue = [];

    // Remarque : la section ci-dessous est extrêmement simplifiée !
    // Elle ne gère pas le réordonnancement, les enfants avec des trous ou les clés (`key`).
    // Elle existe uniquement pour illustrer le flux général, pas les détails.

    for (var i = 0; i < nextChildren.length; i++) {
      // Essaie de récupérer une instance interne existante pour cet enfant
      var prevChild = prevRenderedChildren[i];

      // S’il n’y a aucune instance interne pour cet index,
      // c’est qu’un enfant a été ajouté à la fin. Nous créons une nouvelle
      // instance interne, nous la montons, et nous utilisons son nœud.
      if (!prevChild) {
        var nextChild = instantiateComponent(nextChildren[i]);
        var node = nextChild.mount();

        // Enregistre le besoin d'ajouter un nœud
        operationQueue.push({type: 'ADD', node});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // Nous ne pouvons mettre à jour l’instance que si le type de son élément est identique.
      // Par exemple, <Button size="small" /> peut être mis à jour par
      // <Button size="large" /> mais pas par un <App />.
      var canUpdate = prevChildren[i].type === nextChildren[i].type;

      // Si nous ne pouvons pas mettre à jour une instance existante, nous devons la démonter
      // et monter une nouvelle à la place.
      if (!canUpdate) {
        var prevNode = prevChild.getHostNode();
        prevChild.unmount();

        var nextChild = instantiateComponent(nextChildren[i]);
        var nextNode = nextChild.mount();

        // Enregistre le besoin de remplacer un nœud
        operationQueue.push({type: 'REPLACE', prevNode, nextNode});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // Si nous pouvons mettre à jour une instance existante,
      // laissons-la simplement recevoir l’élément cible et gérer sa propre mise à jour.
      prevChild.receive(nextChildren[i]);
      nextRenderedChildren.push(prevChild);
    }

    // Enfin, démonte tous les enfants qui n’existent pas :
    for (var j = nextChildren.length; j < prevChildren.length; j++) {
      var prevChild = prevRenderedChildren[j];
      var node = prevChild.getHostNode();
      prevChild.unmount();

      // Enregistre le besoin de supprimer un nœud
      operationQueue.push({type: 'REMOVE', node});
    }

    // Actualise la liste des enfants issus du rendu.
    this.renderedChildren = nextRenderedChildren;

    // ...
```

Pour finir, nous exécutons les opérations sur le DOM. Encore une fois, le vrai code du réconciliateur est plus complexe car il gère également les déplacements :

```js
    // ...

    // Traite les opérations dans la file d’attente
    while (operationQueue.length > 0) {
      var operation = operationQueue.shift();
      switch (operation.type) {
      case 'ADD':
        this.node.appendChild(operation.node);
        break;
      case 'REPLACE':
        this.node.replaceChild(operation.nextNode, operation.prevNode);
        break;
      case 'REMOVE':
        this.node.removeChild(operation.node);
        break;
      }
    }
  }
}
```

Et c'est tout pour la mise à jour des composants hôtes.

### Mise à jour de la racine {#top-level-updates}

Maintenant que `CompositeComponent` et `DOMComponent` implémentent la méthode `receive(nextElement)`, nous pouvons modifier la fonction racine `mountTree()` pour l’utiliser lorsque le `type` de l’élément est identique à celui de la dernière fois :

```js
function mountTree(element, containerNode) {
  // Vérifie l'existence d’un arbre
  if (containerNode.firstChild) {
    var prevNode = containerNode.firstChild;
    var prevRootComponent = prevNode._internalInstance;
    var prevElement = prevRootComponent.currentElement;

    // Si possible, réutilise le composant racine existant
    if (prevElement.type === element.type) {
      prevRootComponent.receive(element);
      return;
    }

    // Autrement, démonte l’arborescence existante
    unmountTree(containerNode);
  }

  // ...

}
```

Désormais, appeler deux fois `mountTree()` avec le même type n’est plus destructif :

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Réutilise le DOM existant :
mountTree(<App />, rootEl);
```

Et voilà les bases du fonctionnement interne de React.

### Ce que nous avons laissé de côté {#what-we-left-out}

Ce document est simplifié par rapport au vrai code. Il y a quelques aspects importants que nous n'avons pas abordés :

* Les composants peuvent faire un rendu à `null` et le réconciliateur peut gérer des « emplacements vides » dans les tableaux et le résultat du rendu.
* Le réconciliateur lit également la `key` des éléments, et l'utilise pour déterminer quelle instance interne correspond à quel élément dans un tableau. Une grande partie de la complexité de la véritable implémentation de React est liée à ça.
* En plus des classes d’instance interne composite et hôte, il existe également des classes pour les composants « texte » et « vide ». Ils représentent des nœuds de texte et des « emplacements vides » que vous obtenez en faisant un rendu `null`.
* Les moteurs de rendu utilisent l'[injection](/docs/codebase-overview.html#dynamic-injection) pour passer la classe interne hôte au réconciliateur. Par exemple, React DOM indique au réconciliateur d'utiliser `ReactDOMComponent` pour l'implémentation de l'instance interne hôte.
* La logique de mise à jour de la liste des enfants est extraite dans un _mixin_ appelé `ReactMultiChild`, utilisé par les implémentations de la classe d'instance interne hôte dans React DOM comme dans React Native.
* Le réconciliateur implémente également la prise en charge de `setState()` dans les composants composites. Les mises à jour d'état multiples dans les gestionnaires d'événements sont regroupées en lot pour une mise à jour unique.
* Le réconciliateur prend également en charge l’attachement et le détachement des refs aux composants composites et aux nœuds hôtes.
* Les méthodes de cycle de vie appelées une fois que le DOM est prêt, telles que `componentDidMount()` et `componentDidUpdate()`, sont rassemblées dans des « files d'attente de fonctions de rappel » et exécutées en un seul lot.
* React stocke les informations sur la mise à jour en cours dans un objet interne appelé « transaction ». Les transactions sont utiles pour garder trace de la liste des méthodes de cycle de vie en attente, de l'imbrication actuelle du DOM pour les avertissements et de tout ce qui est « global » à une mise à jour spécifique. Les transactions garantissent également que React « nettoie tout » après les mises à jour. Par exemple, la classe de transaction fournie par React DOM restaure après toute mise à jour l’éventuelle sélection d'une saisie.

### Sauter dans le code {#jumping-into-the-code}

* [`ReactMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/client/ReactMount.js) est l'endroit où réside le code équivalent aux `mountTree()` et `unmountTree()` de ce tutoriel. Il s'occupe du montage et du démontage des composants racines. [`ReactNativeMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeMount.js) est son homologue pour React Native.
* [`ReactDOMComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/shared/ReactDOMComponent.js) est l'équivalent de `DOMComponent` dans ce tutoriel. Il implémente la classe de composant hôte pour le moteur de rendu de React DOM. [`ReactNativeBaseComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeBaseComponent.js) est son équivalent React Native.
* [`ReactCompositeComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js) est l'équivalent de `CompositeComponent` dans ce tutoriel. Il gère l'appel des composants définis par l'utilisateur et la maintenance de leur état local.
* [`instantiateReactComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/instantiateReactComponent.js) contient le code qui sélectionne la classe d'instance interne appropriée pour construire un élément. C'est l'équivalent de `instantiateComponent()` dans ce tutoriel.

* [`ReactReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactReconciler.js) est un enrobage avec les méthodes `mountComponent()`, `receiveComponent()` et `unmountComponent()`. Il appelle les implémentations sous-jacentes des instances internes, mais contient en prime du code de gestion partagé par toutes ces implémentations.

* [`ReactChildReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactChildReconciler.js) implémente la logique de montage, de mise à jour et de démontage des enfants en fonction de la `key` de leurs éléments.

* [`ReactMultiChild`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactMultiChild.js) implémente le traitement de la file d'attente des opérations pour les insertions, les suppressions et les déplacements d'enfants indépendamment du moteur de rendu.

* `mount()`, `receive()` et `unmount()` sont nommées en réalité `mountComponent()`, `receiveComponent()` et `unmountComponent()` dans la base de code React pour des raisons historiques, mais elles reçoivent des éléments.

* Les propriétés des instances internes commencent par un tiret bas *(underscore, NdT)*, par exemple `_currentElement`. Elles sont considérées dans la base de code comme des champs publics en lecture seule.

### Orientations futures {#future-directions}

Le réconciliateur *“stack”* a des limitations intrinsèques, comme le fait qu'il soit synchrone et incapable d'interrompre le travail ou de le découper en plusieurs morceaux. Le [nouveau réconciliateur *“fiber”*](/docs/codebase-overview.html#fiber-reconciler) a une [architecture complètement différente](https://github.com/acdlite/react-fiber-architecture). À partir de React 16, il remplace le réconciliateur *“stack”*.

### Prochaines étapes {#next-steps}

Lisez la [page suivante](/docs/design-principles.html) pour en apprendre davantage sur les principes de conception que nous utilisons pour le développement de React.
