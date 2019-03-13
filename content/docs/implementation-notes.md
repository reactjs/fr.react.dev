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

Cette section est un ensemble de notes d'implémentation pour le [réconciliateur de pile](/docs/codebase-overview.html#stack-reconciler).

C'est très technique et suppose une solide compréhension de l’API publique de React ainsi que de sa structure divisée en cœur, moteurs de rendu et réconciliateur. Si vous ne connaissez pas bien la base de code React, lisez d'abord l'[aperçu de la base de code](/docs/codebase-overview.html).

Cela suppose également de comprendre les [différences entre les composants React, leurs instances et leurs éléments](/blog/2015/12/18/react-components-elements-and-instances.html).

Le réconciliateur de pile a été utilisé dans React 15 et les versions antérieures. Il se trouve dans [src/renderers/shared/stack/reconciler](https://github.com/facebook/react/tree/15-stable/src/renderers/shared/stack/reconciler).

### Vidéo : construire React à partir de zéro {#video-building-react-from-scratch}

[Paul O'Shannessy](https://twitter.com/zpao) a donné une conférence sur la [construction de React à partir de zéro](https://www.youtube.com/watch?v=_MAD4Oly9yg) qui a largement inspiré ce document.

Ce document et sa conférence sont des simplifications de la base de code actuelle, en vous familiarisant avec les deux, vous devriez mieux comprendre.

### Aperçu {#overview}

Le réconciliateur lui-même n’a pas d’API publique. Les [moteurs de rendu](/docs/codebase-overview.html#stack-renderers) comme React DOM et React Native l'utilisent pour mettre à jour efficacement l'interface utilisateur en fonction des composants React écrits par l'utilisateur.

### Montage en tant que processus récursif {#mounting-as-a-recursive-process}

Intéressons-nous à la première fois que vous montez un composant :

```js
ReactDOM.render(<App />, rootEl);
```

React DOM transmettra `<App />` au réconciliateur. Rappelez-vous que `<App />` est un élément de React, c’est-à-dire, une description de *quoi* rendre. Vous pouvez le considérer comme un objet simple :

```js
console.log(<App />);
// { type: App, props: {} }
```

Le réconciliateur vérifiera si `App` est une classe ou une fonction.

Si `App` est une fonction, le réconciliateur appellera `App(props)` pour obtenir l'élément rendu.

Si `App` est une classe, le réconciliateur instanciera une `App` avec `new App(props)`, appellera la méthode `componentWillMount()` du cycle de vie, puis appellera la méthode `render()` pour obtenir l'élément rendu.

Dans les deux cas, le réconciliateur saura quel élément « a été produit par le rendu de » `App`.

Ce processus est récursif. Le rendu de `App` peut produire un `<Greeting />`, le rendu de `Greeting` peut produire un `<Button />`, et ainsi de suite. Le réconciliateur « s’enfoncera » de manière récursive dans les composants définis par l'utilisateur, et saura ainsi ce que produit le rendu de chacun.

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
// et renvoie un DOM ou un nœud natif représentant l'arborescence montée.
function mount(element) {
  var type = element.type;
  var props = element.props;

  // Nous déterminerons l'élément rendu
  // soit en exécutant le type comme une fonction
  // ou soit en créant une instance puis un appel de render().
  var renderedElement;
  if (isClass(type)) {
    // La classe du composant
    var publicInstance = new type(props);
    // Initialiser les props
    publicInstance.props = props;
    // Appeler le cycle de vie si besoin
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    // Obtenir l'élément rendu en appelant render()
    renderedElement = publicInstance.render();
  } else {
    // La fonction du composant
    renderedElement = type(props);
  }

  // Ce processus est récursif parce qu'un composant peut
  // renvoyer un élément avec le type d'un autre composant.
  return mount(renderedElement);

  // Remarque : cette implémentation est incomplète et la récursivité est infinie !
  // Ça gère uniquement les éléments comme <App /> ou <Button />.
  // Ça ne gère pas pour l'instant les éléments comme <div /> ou <p />.
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

>**Remarque :**
>
>Ceci *est* vraiment un pseudo-code. Il n’est pas similaire à l'implémentation actuelle. Il provoquera aussi un débordement de la pile car nous n’avons pas précisé l'arrêt de la récursivité.

Récapitulons quelques idées clés dans l’exemple ci-dessus :

* Les éléments React sont des objets simples représentant le type du composant (par exemple `App`) et les props.
* Les composants définis par l'utilisateur (par exemple `App`) peuvent être des classes ou des fonctions mais toutes « font le rendu des » éléments.
* Le « montage » est un processus récursif qui crée un DOM ou une arborescence native à partir de l'élément React de niveau supérieur (par exemple `<App />`).

### Montage d'éléments hôtes {#mounting-host-elements}

Ce processus serait inutile si le résultat n'affichait rien à l'écran.

En plus des composants définis par l'utilisateur (« composite »), les éléments React peuvent également représenter des composants pour des plateformes spécifiques (« hôte »). Par exemple, la méthode qui fait le rendu de `Button`, peut renvoyer un `<div />`.

Si la propriété `type` de l'élément est une chaîne de caractère, il s’agit d’un élément hôte :

```js
console.log(<div />);
// { type: 'div', props: {} }
```

Il n’y a aucun code défini par l’utilisateur associé aux éléments hôtes.

Lorsque le réconciliateur rencontre un élément hôte, il laisse au moteur de rendu la charge du montage. Par exemple, React DOM créerait un nœud DOM.

Si l'élément hôte a des enfants, le réconciliateur les monte de manière récursive en suivant le même algorithme que celui décrit ci-dessus. Peu importe que les enfants soient hôtes (comme `<div><hr /></div>`), composites (comme `<div><Button /></div>`) ou les deux.

Les nœuds DOM produits par les composants enfants seront ajoutés au nœud DOM parent, et donc de manière récursive, l’ensemble de la structure DOM sera constituée.

>**Remarque :**
>
>Le réconciliateur lui-même n'est pas lié au DOM. Le résultat exact du montage (parfois appelé « mount image » dans le code source) dépend du moteur de rendu, et donc peut-être un nœud DOM (React DOM), une chaîne de caractère (React DOM Server) ou un nombre représentant une vue native (React Native).

Si nous devions étendre le code pour gérer des éléments de l’hôte, il ressemblerait à ceci :

```js
function isClass(type) {
  // Les sous-classes de React.Component ont ce drapeau
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// Cette fonction gère uniquement les éléments avec un type composite.
// Par exemple, il gère <App /> et <Button />, mais pas un <div />.
function mountComposite(element) {
  var type = element.type;
  var props = element.props;

  var renderedElement;
  if (isClass(type)) {
    // La classe du composant
    var publicInstance = new type(props);
    // Initialiser les props
    publicInstance.props = props;
    // Appeler le cycle de vie si besoin
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    renderedElement = publicInstance.render();
  } else if (typeof type === 'function') {
    // La fonction du composant
    renderedElement = type(props);
  }

  // C'est récursif mais nous atteindrons finalement le bas de la récursion lorsque
  // l'élément sera hôte (par exemple <div />) au lieu de composite (par exemple <App />) :
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
  // Le différents moteurs de rendu peuvent initialiser les nœuds différemment.
  // Par exemple, React Native créerait des vues iOS ou Android.
  var node = document.createElement(type);
  Object.keys(props).forEach(propName => {
    if (propName !== 'children') {
      node.setAttribute(propName, props[propName]);
    }
  });

  // Monter les enfants
  children.forEach(childElement => {
    // L'enfant peut être un hôte (par exemple <div />) ou un composite (par exemple <Button />).
    // Nous les monterons également de manière récursive :
    var childNode = mount(childElement);

    // Cette ligne de code est également spécifique au moteur de rendu.
    // Ce serait différent en fonction du moteur de rendu :
    node.appendChild(childNode);
  });

  // Renvoie le nœud DOM comme résultat de montage.
  // C'est ici que se termine la récursion.
  return node;
}

function mount(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // Composants définis par l'utilisateur
    return mountComposite(element);
  } else if (typeof type === 'string') {
    // Composants des plateformes spécifiques
    return mountHost(element);
  }
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

Cela fonctionne mais ça reste loin de la manière dont le réconciliateur est réellement implémenté. L’ingrédient clé manquant est la prise en charge des mises à jour.

### Introduction aux instances internes {#introducing-internal-instances}

La principale caractéristique de React est que vous pouvez refaire tout le rendu sans recréer le DOM ni réinitialiser l'état :

```js
ReactDOM.render(<App />, rootEl);
// Devrait réutiliser le DOM existant :
ReactDOM.render(<App />, rootEl);
```

Cependant, notre implémentation ci-dessus sait uniquement monter l'arbre initial. Elle ne peut pas effectuer de mises à jour dans l'arborescence car elle ne stocke pas toutes les informations nécessaires, telles que toutes les `publicInstance`s, ni les nœuds DOM qui correspond aux composants.

La base de code du réconciliateur de pile résout ce problème en faisant de la fonction `mount()` une méthode et en la plaçant dans une classe. Cette approche présente des inconvénients et nous allons dans la direction opposée de la [réécriture actuelle du réconciliateur](/docs/codebase-overview.html#fiber-reconciler). Cependant, voici comment cela fonctionne aujourd'hui.

Plutôt que deux fonctions distinctes `mountHost` et `mountComposite`, nous créerons deux classes : `DOMComponent` et `CompositeComponent`.

Les deux classes ont un constructeur acceptant `element`, ainsi qu'une méthode `mount()` qui renvoie le nœud monté. Nous remplacerons une fonction `mount()` de haut niveau avec une _factory_ qui instanciera la bonne classe :

```js
function instantiateComponent(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // Composants définis par l'utilisateur
    return new CompositeComponent(element);
  } else if (typeof type === 'string') {
    // Composants des plateformes spécifiques
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
    // Pour les composants composite, exposer l'instance de la classe.
    return this.publicInstance;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;

    var publicInstance;
    var renderedElement;
    if (isClass(type)) {
      // La classe du composant
      publicInstance = new type(props);
      // Initialiser les props
      publicInstance.props = props;
      // Appeler le cycle de vie si besoin
      if (publicInstance.componentWillMount) {
        publicInstance.componentWillMount();
      }
      renderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // La fonction du composant
      publicInstance = null;
      renderedElement = type(props);
    }

    // Sauvegarder l'instance publique
    this.publicInstance = publicInstance;

    // Instantier l'instance interne de l'enfant en fonction de l'élément.
    // Ce sera un DOMComponent pour <div /> ou <p />,
    // et un CompositeComponent pour <App /> ou <Button /> :
    var renderedComponent = instantiateComponent(renderedElement);
    this.renderedComponent = renderedComponent;

    // Monter la valeur de sortie rendue
    return renderedComponent.mount();
  }
}
```

Ce n'est pas très différent de notre précédente implémentation de `mountComposite()`, mais maintenant, nous pouvons sauver certaines informations, telles que `this.currentElement`, `this.renderedComponent` et `this.publicInstance`, pour une utilisation pendant les mises à jour.

Notez qu’une instance de `CompositeComponent` n’est pas la même chose qu’une instance de `element.type` fourni par l'utilisateur. `CompositeComponent` est un détail d'implémentation de notre réconciliateur et n'est jamais exposé à l'utilisateur. La classe définie par l'utilisateur est celle que nous avons lu dans `element.type`, et `CompositeComponent` crée une instance de celle-ci.

Pour éviter toute confusion, nous appellerons les instances `CompositeComponent` et `DOMComponent`, « des instances internes ». Leur existence permet de leur associer des données de longue durée. Seuls le moteur de rendu et le réconciliateur savent qu'elles existent.

En revanche, nous appelons une instance de classe définie par l'utilisateur, une « instance publique ». L'instance publique, c'est ce que vous voyez sous la forme `this` dans `render()` et d'autres méthodes de vos composants personnalisés.

La fonction `mountHost()` a été refactorisée pour devenir la méthode `mount()` dans la classe `DOMComponent`, elle a l'air aussi familier :

```js
class DOMComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedChildren = [];
    this.node = null;
  }

  getPublicInstance() {
    // Pour les composants DOM, exposer uniquement le nœud du DOM.
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

    // Créer et sauvegarder le nœud
    var node = document.createElement(type);
    this.node = node;

    // Initialiser les attributs
    Object.keys(props).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, props[propName]);
      }
    });

    // Créer et sauvegarder les enfants contenus.
    // Chacun d’eux peut être un DOMComponent ou un CompositeComponent,
    // selon si le type de l'élément est une chaîne de caractère ou une fonction.
    var renderedChildren = children.map(instantiateComponent);
    this.renderedChildren = renderedChildren;

    // Collecter les nœuds DOM qui sont renvoyés lors du montage
    var childNodes = renderedChildren.map(child => child.mount());
    childNodes.forEach(childNode => node.appendChild(childNode));

    // Renvoyer le nœud DOM comme résultat du montage
    return node;
  }
}
```

La différence principale, après la refactorisation à partir de `mountHost()`, c’est que nous conservons maintenant `this.node` et `this.renderedChildren` associés à l'instance du composant DOM interne. Nous les utiliserons également à l'avenir pour appliquer des mises à jour non destructives.

Par conséquent, chaque instance interne, composite ou hôte, pointe maintenant vers ses instances internes enfants. Pour vous aider à le visualiser, if a function `<App>` component renders a `<Button>` class component, and `Button` class renders a `<div>`, the internal instance tree would look like this:

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

Dans le DOM, vous ne voyez que le `<div>`. Cependant l’arborescence d’instance interne contient des instances internes de composite et d'hôte.

Les instances internes de composite doivent stocker :

* L'élément actuel.
* L'instance publique si le type de l'élément est une classe.
* La seule instance interne rendue. Il peut s'agir d'un `DOMComponent` ou un `CompositeComponent`.

Les instances internes d'hôte doivent stocker :

* L'élément actuel.
* Le nœud DOM.
* Toutes les instances internes enfants. Chacune d’elles peut être soit un `DOMComponent` ou un `CompositeComponent`.

Si vous avez du mal à imaginer la structure d’une arborescence d’instances internes dans des applications plus complexes, [React DevTools](https://github.com/facebook/react-devtools) peut vous donner une bonne approximation, car il met en évidence les instances hôte en gris, et les instances composite en violet :

 <img src="../images/docs/implementation-notes-tree.png" width="500" style="max-width: 100%" alt="React DevTools tree" />

Pour terminer cette refactorisation, nous allons introduire une fonction qui monte une arborescence complète dans un nœud de conteneur, tout comme `ReactDOM.render()`. Il renvoie une instance publique, également semblable à `ReactDOM.render()` :

```js
function mountTree(element, containerNode) {
  // Créer une instance interne de haut niveau
  var rootComponent = instantiateComponent(element);

  // Monter le composant de haut niveau dans le conteneur
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Renvoyer l'instance publique fournie
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}

var rootEl = document.getElementById('root');
mountTree(<App />, rootEl);
```

### Démontage {#unmounting}

Maintenant que nous avons des instances internes qui conservent leurs enfants et les nœuds DOM, nous pouvons implémenter le démontage. Pour un composant composite, le démontage appelle une méthode du cycle de vie et il est récursif.

```js
class CompositeComponent {

  // ...

  unmount() {
    // Appeler la méthode du cycle de vie si besoin
    var publicInstance = this.publicInstance;
    if (publicInstance) {
      if (publicInstance.componentWillUnmount) {
        publicInstance.componentWillUnmount();
      }
    }

    // Démonter l'unique composant rendu
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
    // Démonter tous les enfants
    var renderedChildren = this.renderedChildren;
    renderedChildren.forEach(child => child.unmount());
  }
}
```

In practice, unmounting DOM components also removes the event listeners and clears some caches, but we will skip those details.

We can now add a new top-level function called `unmountTree(containerNode)` that is similar to `ReactDOM.unmountComponentAtNode()`:

```js
function unmountTree(containerNode) {
  // Read the internal instance from a DOM node:
  // (This doesn't work yet, we will need to change mountTree() to store it.)
  var node = containerNode.firstChild;
  var rootComponent = node._internalInstance;

  // Unmount the tree and clear the container
  rootComponent.unmount();
  containerNode.innerHTML = '';
}
```

In order for this to work, we need to read an internal root instance from a DOM node. We will modify `mountTree()` to add the `_internalInstance` property to the root DOM node. We will also teach `mountTree()` to destroy any existing tree so it can be called multiple times:

```js
function mountTree(element, containerNode) {
  // Destroy any existing tree
  if (containerNode.firstChild) {
    unmountTree(containerNode);
  }

  // Create the top-level internal instance
  var rootComponent = instantiateComponent(element);

  // Mount the top-level component into the container
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Save a reference to the internal instance
  node._internalInstance = rootComponent;

  // Return the public instance it provides
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}
```

Now, running `unmountTree()`, or running `mountTree()` repeatedly, removes the old tree and runs the `componentWillUnmount()` lifecycle method on components.

### Updating {#updating}

In the previous section, we implemented unmounting. However React wouldn't be very useful if each prop change unmounted and mounted the whole tree. The goal of the reconciler is to reuse existing instances where possible to preserve the DOM and the state:

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Should reuse the existing DOM:
mountTree(<App />, rootEl);
```

We will extend our internal instance contract with one more method. In addition to `mount()` and `unmount()`, both `DOMComponent` and `CompositeComponent` will implement a new method called `receive(nextElement)`:

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

Its job is to do whatever is necessary to bring the component (and any of its children) up to date with the description provided by the `nextElement`.

This is the part that is often described as "virtual DOM diffing" although what really happens is that we walk the internal tree recursively and let each internal instance receive an update.

### Updating Composite Components {#updating-composite-components}

When a composite component receives a new element, we run the `componentWillUpdate()` lifecycle method.

Then we re-render the component with the new props, and get the next rendered element:

```js
class CompositeComponent {

  // ...

  receive(nextElement) {
    var prevProps = this.currentElement.props;
    var publicInstance = this.publicInstance;
    var prevRenderedComponent = this.renderedComponent;
    var prevRenderedElement = prevRenderedComponent.currentElement;

    // Update *own* element
    this.currentElement = nextElement;
    var type = nextElement.type;
    var nextProps = nextElement.props;

    // Figure out what the next render() output is
    var nextRenderedElement;
    if (isClass(type)) {
      // La classe du composant
      // Appeler le cycle de vie si besoin
      if (publicInstance.componentWillUpdate) {
        publicInstance.componentWillUpdate(nextProps);
      }
      // Update the props
      publicInstance.props = nextProps;
      // Re-render
      nextRenderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // La fonction du composant
      nextRenderedElement = type(nextProps);
    }

    // ...
```

Next, we can look at the rendered element's `type`. If the `type` has not changed since the last render, the component below can also be updated in place.

For example, if it returned `<Button color="red" />` the first time, and `<Button color="blue" />` the second time, we can just tell the corresponding internal instance to `receive()` the next element:

```js
    // ...

    // If the rendered element type has not changed,
    // reuse the existing component instance and exit.
    if (prevRenderedElement.type === nextRenderedElement.type) {
      prevRenderedComponent.receive(nextRenderedElement);
      return;
    }

    // ...
```

However, if the next rendered element has a different `type` than the previously rendered element, we can't update the internal instance. A `<button>` can't "become" an `<input>`.

Instead, we have to unmount the existing internal instance and mount the new one corresponding to the rendered element type. For example, this is what happens when a component that previously rendered a `<button />` renders an `<input />`:

```js
    // ...

    // If we reached this point, we need to unmount the previously
    // mounted component, mount the new one, and swap their nodes.

    // Find the old node because it will need to be replaced
    var prevNode = prevRenderedComponent.getHostNode();

    // Unmount the old child and mount a new child
    prevRenderedComponent.unmount();
    var nextRenderedComponent = instantiateComponent(nextRenderedElement);
    var nextNode = nextRenderedComponent.mount();

    // Replace the reference to the child
    this.renderedComponent = nextRenderedComponent;

    // Replace the old node with the new one
    // Note: this is renderer-specific code and
    // ideally should live outside of CompositeComponent:
    prevNode.parentNode.replaceChild(nextNode, prevNode);
  }
}
```

To sum this up, when a composite component receives a new element, it may either delegate the update to its rendered internal instance, or unmount it and mount a new one in its place.

There is another condition under which a component will re-mount rather than receive an element, and that is when the element's `key` has changed. We don't discuss `key` handling in this document because it adds more complexity to an already complex tutorial.

Note that we needed to add a method called `getHostNode()` to the internal instance contract so that it's possible to locate the platform-specific node and replace it during the update. Its implementation is straightforward for both classes:

```js
class CompositeComponent {
  // ...

  getHostNode() {
    // Ask the rendered component to provide it.
    // This will recursively drill down any composites.
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

### Updating Host Components {#updating-host-components}

Host component implementations, such as `DOMComponent`, update differently. When they receive an element, they need to update the underlying platform-specific view. In case of React DOM, this means updating the DOM attributes:

```js
class DOMComponent {
  // ...

  receive(nextElement) {
    var node = this.node;
    var prevElement = this.currentElement;
    var prevProps = prevElement.props;
    var nextProps = nextElement.props;    
    this.currentElement = nextElement;

    // Remove old attributes.
    Object.keys(prevProps).forEach(propName => {
      if (propName !== 'children' && !nextProps.hasOwnProperty(propName)) {
        node.removeAttribute(propName);
      }
    });
    // Set next attributes.
    Object.keys(nextProps).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, nextProps[propName]);
      }
    });

    // ...
```

Then, host components need to update their children. Unlike composite components, they might contain more than a single child.

In this simplified example, we use an array of internal instances and iterate over it, either updating or replacing the internal instances depending on whether the received `type` matches their previous `type`. The real reconciler also takes element's `key` in the account and track moves in addition to insertions and deletions, but we will omit this logic.

We collect DOM operations on children in a list so we can execute them in batch:

```js
    // ...

    // These are arrays of React elements:
    var prevChildren = prevProps.children || [];
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }
    var nextChildren = nextProps.children || [];
    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }
    // These are arrays of internal instances:
    var prevRenderedChildren = this.renderedChildren;
    var nextRenderedChildren = [];

    // As we iterate over children, we will add operations to the array.
    var operationQueue = [];

    // Note: the section below is extremely simplified!
    // It doesn't handle reorders, children with holes, or keys.
    // It only exists to illustrate the overall flow, not the specifics.

    for (var i = 0; i < nextChildren.length; i++) {
      // Try to get an existing internal instance for this child
      var prevChild = prevRenderedChildren[i];

      // If there is no internal instance under this index,
      // a child has been appended to the end. Create a new
      // internal instance, mount it, and use its node.
      if (!prevChild) {
        var nextChild = instantiateComponent(nextChildren[i]);
        var node = nextChild.mount();

        // Record that we need to append a node
        operationQueue.push({type: 'ADD', node});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // We can only update the instance if its element's type matches.
      // For example, <Button size="small" /> can be updated to
      // <Button size="large" /> but not to an <App />.
      var canUpdate = prevChildren[i].type === nextChildren[i].type;

      // If we can't update an existing instance, we have to unmount it
      // and mount a new one instead of it.
      if (!canUpdate) {
        var prevNode = prevChild.getHostNode();
        prevChild.unmount();

        var nextChild = instantiateComponent(nextChildren[i]);
        var nextNode = nextChild.mount();

        // Record that we need to swap the nodes
        operationQueue.push({type: 'REPLACE', prevNode, nextNode});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // If we can update an existing internal instance,
      // just let it receive the next element and handle its own update.
      prevChild.receive(nextChildren[i]);
      nextRenderedChildren.push(prevChild);
    }

    // Finally, unmount any children that don't exist:
    for (var j = nextChildren.length; j < prevChildren.length; j++) {
      var prevChild = prevRenderedChildren[j];
      var node = prevChild.getHostNode();
      prevChild.unmount();

      // Record that we need to remove the node
      operationQueue.push({type: 'REMOVE', node});
    }

    // Point the list of rendered children to the updated version.
    this.renderedChildren = nextRenderedChildren;

    // ...
```

As the last step, we execute the DOM operations. Again, the real reconciler code is more complex because it also handles moves:

```js
    // ...

    // Process the operation queue.
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

And that is it for updating host components.

### Top-Level Updates {#top-level-updates}

Now that both `CompositeComponent` and `DOMComponent` implement the `receive(nextElement)` method, we can change the top-level `mountTree()` function to use it when the element `type` is the same as it was the last time:

```js
function mountTree(element, containerNode) {
  // Check for an existing tree
  if (containerNode.firstChild) {
    var prevNode = containerNode.firstChild;
    var prevRootComponent = prevNode._internalInstance;
    var prevElement = prevRootComponent.currentElement;

    // If we can, reuse the existing root component
    if (prevElement.type === element.type) {
      prevRootComponent.receive(element);
      return;
    }

    // Otherwise, unmount the existing tree
    unmountTree(containerNode);
  }

  // ...

}
```

Now calling `mountTree()` two times with the same type isn't destructive:

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Reuses the existing DOM:
mountTree(<App />, rootEl);
```

These are the basics of how React works internally.

### What We Left Out {#what-we-left-out}

This document is simplified compared to the real codebase. There are a few important aspects we didn't address:

* Components can render `null`, and the reconciler can handle "empty slots" in arrays and rendered output.

* The reconciler also reads `key` from the elements, and uses it to establish which internal instance corresponds to which element in an array. A bulk of complexity in the actual React implementation is related to that.

* In addition to composite and host internal instance classes, there are also classes for "text" and "empty" components. They represent text nodes and the "empty slots" you get by rendering `null`.

* Renderers use [injection](/docs/codebase-overview.html#dynamic-injection) to pass the host internal class to the reconciler. For example, React DOM tells the reconciler to use `ReactDOMComponent` as the host internal instance implementation.

* The logic for updating the list of children is extracted into a mixin called `ReactMultiChild` which is used by the host internal instance class implementations both in React DOM and React Native.

* The reconciler also implements support for `setState()` in composite components. Multiple updates inside event handlers get batched into a single update.

* The reconciler also takes care of attaching and detaching refs to composite components and host nodes.

* Lifecycle methods that are called after the DOM is ready, such as `componentDidMount()` and `componentDidUpdate()`, get collected into "callback queues" and are executed in a single batch.

* React puts information about the current update into an internal object called "transaction". Transactions are useful for keeping track of the queue of pending lifecycle methods, the current DOM nesting for the warnings, and anything else that is "global" to a specific update. Transactions also ensure React "cleans everything up" after updates. For example, the transaction class provided by React DOM restores the input selection after any update.

### Jumping into the Code {#jumping-into-the-code}

* [`ReactMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/client/ReactMount.js) is where the code like `mountTree()` and `unmountTree()` from this tutorial lives. It takes care of mounting and unmounting top-level components. [`ReactNativeMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeMount.js) is its React Native analog.
* [`ReactDOMComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/shared/ReactDOMComponent.js) is the equivalent of `DOMComponent` in this tutorial. It implements the host component class for React DOM renderer. [`ReactNativeBaseComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeBaseComponent.js) is its React Native analog.
* [`ReactCompositeComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js) is the equivalent of `CompositeComponent` in this tutorial. It handles calling user-defined components and maintaining their state.
* [`instantiateReactComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/instantiateReactComponent.js) contains the switch that picks the right internal instance class to construct for an element. It is equivalent to `instantiateComponent()` in this tutorial.

* [`ReactReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactReconciler.js) is a wrapper with `mountComponent()`, `receiveComponent()`, and `unmountComponent()` methods. It calls the underlying implementations on the internal instances, but also includes some code around them that is shared by all internal instance implementations.

* [`ReactChildReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactChildReconciler.js) implements the logic for mounting, updating, and unmounting children according to the `key` of their elements.

* [`ReactMultiChild`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactMultiChild.js) implements processing the operation queue for child insertions, deletions, and moves independently of the renderer.

* `mount()`, `receive()`, and `unmount()` are really called `mountComponent()`, `receiveComponent()`, and `unmountComponent()` in React codebase for legacy reasons, but they receive elements.

* Properties on the internal instances start with an underscore, e.g. `_currentElement`. They are considered to be read-only public fields throughout the codebase.

### Future Directions {#future-directions}

Stack reconciler has inherent limitations such as being synchronous and unable to interrupt the work or split it in chunks. There is a work in progress on the [new Fiber reconciler](/docs/codebase-overview.html#fiber-reconciler) with a [completely different architecture](https://github.com/acdlite/react-fiber-architecture). In the future, we intend to replace stack reconciler with it, but at the moment it is far from feature parity.

### Next Steps {#next-steps}

Read the [next section](/docs/design-principles.html) to learn about the guiding principles we use for React development.
