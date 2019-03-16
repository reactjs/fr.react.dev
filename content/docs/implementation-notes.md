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

Ça suppose également de comprendre les [différences entre les composants React, leurs instances et leurs éléments](/blog/2015/12/18/react-components-elements-and-instances.html).

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

React DOM passera `<App />` au réconciliateur. Rappelez-vous que `<App />` est un élément de React, c’est-à-dire, une description de *quoi* rendre. Vous pouvez le considérer comme un objet simple :

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
// et renvoie un DOM ou un nœud natif représentant l'arbre monté.
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
    // Initialise les props
    publicInstance.props = props;
    // Appelle le cycle de vie si besoin
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    // Obtient l'élément rendu en appelant render()
    renderedElement = publicInstance.render();
  } else {
    // La fonction du composant
    renderedElement = type(props);
  }

  // Ce processus est récursif parce qu'un composant peut
  // renvoyer un élément avec le type d'un autre composant.
  return mount(renderedElement);

  // Remarque : cette implémentation est incomplète et la récursivité est infinie !
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
* Le « montage » est un processus récursif qui crée un DOM ou un arbre natif à partir de l'élément React de niveau supérieur (par exemple `<App />`).

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
    // Initialise les props
    publicInstance.props = props;
    // Appelle le cycle de vie si besoin
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

Ça fonctionne mais ça reste loin de la manière dont le réconciliateur est réellement implémenté. L’ingrédient clé manquant est la prise en charge des mises à jour.

### Introduction aux instances internes {#introducing-internal-instances}

La principale caractéristique de React est que vous pouvez refaire tout le rendu sans recréer le DOM ni réinitialiser l'état :

```js
ReactDOM.render(<App />, rootEl);
// Devrait réutiliser le DOM existant :
ReactDOM.render(<App />, rootEl);
```

Cependant, notre implémentation ci-dessus sait uniquement monter l'arbre initial. Elle ne peut pas effectuer de mises à jour dans l'arborescence car elle ne stocke pas toutes les informations nécessaires, telles que toutes les `publicInstance`s, ni les nœuds DOM qui correspondent aux composants.

La base de code du réconciliateur de pile résout ce problème en faisant de la fonction `mount()` une méthode et en la plaçant dans une classe. Cette approche présente des inconvénients et nous allons dans la direction opposée de la [réécriture actuelle du réconciliateur](/docs/codebase-overview.html#fiber-reconciler). Cependant, voici comment ça fonctionne aujourd'hui.

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
      // Initialise les props
      publicInstance.props = props;
      // Appelle le cycle de vie si besoin
      if (publicInstance.componentWillMount) {
        publicInstance.componentWillMount();
      }
      renderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // La fonction du composant
      publicInstance = null;
      renderedElement = type(props);
    }

    // Sauvegarde l'instance publique
    this.publicInstance = publicInstance;

    // Instantie l'instance interne de l'enfant en fonction de l'élément.
    // Ce sera un DOMComponent pour <div /> ou <p />,
    // et un CompositeComponent pour <App /> ou <Button /> :
    var renderedComponent = instantiateComponent(renderedElement);
    this.renderedComponent = renderedComponent;

    // Monte la valeur de sortie rendue
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
    // selon si le type de l'élément est une chaîne de caractère ou une fonction.
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

Après la refactorisation à partir de `mountHost()`, la différence principale, c’est que nous conservons `this.node` et `this.renderedChildren` qui sont maintenant associés à l'instance interne du composant DOM. Nous les utiliserons également à l'avenir pour appliquer des mises à jour non destructives.

Par conséquent, chaque instance interne, composite ou hôte, pointe maintenant vers ses instances internes enfants. Pour vous aider à le visualiser, si une fonction du composant `<App>` restitue un composant de classe `<Button>`, et la classe `Button` restitue un `<div>`, l'arbre de l'instance interne ressemblerait à ceci :

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

Dans le DOM, vous voyez uniquement le `<div>`. Cependant l’arbre d’instance interne contient des instances internes de composite et d'hôte.

Les instances internes de composite doivent stocker :

* L'élément actuel.
* L'instance publique si le type de l'élément est une classe.
* La seule instance interne rendue. Il peut s'agir d'un `DOMComponent` ou un `CompositeComponent`.

Les instances internes d'hôte doivent stocker :

* L'élément actuel.
* Le nœud DOM.
* Toutes les instances internes enfants. Chacune d’elles peut être soit un `DOMComponent` ou un `CompositeComponent`.

Si vous avez du mal à imaginer la structure d’un arbre d’instance interne dans des applications plus complexes, [React DevTools](https://github.com/facebook/react-devtools) peut vous donner une bonne approximation, car il met en évidence les instances hôte en gris, et les instances composite en violet :

 <img src="../images/docs/implementation-notes-tree.png" width="500" style="max-width: 100%" alt="React DevTools tree" />

Pour terminer cette refactorisation, nous allons introduire une fonction qui monte une arbre complet dans un nœud de conteneur, tout comme `ReactDOM.render()`. Elle renvoie une instance publique, également semblable à `ReactDOM.render()` :

```js
function mountTree(element, containerNode) {
  // Crée une instance interne de haut niveau
  var rootComponent = instantiateComponent(element);

  // Monte le composant de haut niveau dans le conteneur
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Renvoie l'instance publique fournie
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}

var rootEl = document.getElementById('root');
mountTree(<App />, rootEl);
```

### Démontage {#unmounting}

Maintenant que nous avons des instances internes qui conservent leurs enfants et les nœuds DOM, nous pouvons implémenter le démontage. Pour un composant composite, le démontage appelle une méthode du cycle de vie et elle est récursive.

```js
class CompositeComponent {

  // ...

  unmount() {
    // Appelle la méthode du cycle de vie si besoin
    var publicInstance = this.publicInstance;
    if (publicInstance) {
      if (publicInstance.componentWillUnmount) {
        publicInstance.componentWillUnmount();
      }
    }

    // Démonte l'unique composant rendu
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
    // Démonte tous les enfants
    var renderedChildren = this.renderedChildren;
    renderedChildren.forEach(child => child.unmount());
  }
}
```

En pratique, le démontage des composants DOM enlève également les écouteurs d'événements et efface certains caches, mais nous ignorerons ces détails.

Nous pouvons maintenant ajouter une nouvelle fonction de niveau supérieur appelée `unmountTree(containerNode)` qui est semblable à `ReactDOM.unmountComponentAtNode()`:

```js
function unmountTree(containerNode) {
  // Lit l'instance interne depuis un nœud DOM :
  // (Ça ne fonctionne pas encore, il faudra changer mountTree() pour le stocker.)
  var node = containerNode.firstChild;
  var rootComponent = node._internalInstance;

  // Démonte l'arbre et efface le conteneur
  rootComponent.unmount();
  containerNode.innerHTML = '';
}
```

Pour que ça fonctionne, nous devons lire une instance racine interne à partir d'un nœud DOM. Nous modifierons `mountTree()` pour ajouter la propriété `_internalInstance` au nœud DOM racine. Nous apprendrons aussi à `mountTree()` à détruire n'importe quel arbre existant donc nous pourrons l'appeler plusieurs fois :

```js
function mountTree(element, containerNode) {
  // Détruit n'importe quel arbre
  if (containerNode.firstChild) {
    unmountTree(containerNode);
  }

  // Crée l'instance interne de haut niveau
  var rootComponent = instantiateComponent(element);

  // Monte le composant de haut niveau dans un conteneur
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Sauvegarde une référence dans l'instance interne
  node._internalInstance = rootComponent;

  // Renvoie l'instance publique fournie
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}
```

À présent, l’exécution à plusieurs reprises de `unmountTree()` ou de `mountTree()` supprime l’ancien arbre et exécute la méthode du cycle de vie `componentWillUnmount()` sur les composants.

### Mise à jour {#updating}

Dans la section précédente, nous avons implémenté le démontage. Cependant, React ne serait pas très utile si à chaque modification de prop, l'arbre entier était démonté et monté. Le but du réconciliateur est de réutiliser dans la mesure du possible les instances existantes afin de préserver le DOM et l’état local :

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Devrait réutiliser le DOM existant :
mountTree(<App />, rootEl);
```

Nous allons étendre notre instance interne avec une méthode supplémentaire. En plus de `mount()` et `unmount()`, `DOMComponent` et `CompositeComponent` implémenteront une nouvelle méthode appelée `receive(nextElement)` :

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

Son travail consiste à faire tout ce qui est nécessaire pour mettre à jour le composant (et ses enfants) avec la description fournie par `nextElement`.

C’est la partie qui est souvent décrite comme « _virtual DOM diffing_ » (« comparaison du DOM virtuel »), bien que ce qui se passe réellement consiste à parcourir l'arbre interne de manière récursive et permettre à chaque instance interne de recevoir une mise à jour.

### Mise à jour des composants composite {#updating-composite-components}

Lorsqu'un composant composite reçoit un nouvel élément, nous exécutons la méthode du cycle de vie `componentWillUpdate()`.

Ensuite nous restituons à nouveau le composant avec les nouvelles props et récupérons le prochain élément restitué :

```js
class CompositeComponent {

  // ...

  receive(nextElement) {
    var prevProps = this.currentElement.props;
    var publicInstance = this.publicInstance;
    var prevRenderedComponent = this.renderedComponent;
    var prevRenderedElement = prevRenderedComponent.currentElement;

    // Met à jour l'élément *courant*
    this.currentElement = nextElement;
    var type = nextElement.type;
    var nextProps = nextElement.props;

    // Détermine quelle est la prochaine sortie de render()
    var nextRenderedElement;
    if (isClass(type)) {
      // La classe du composant
      // Appelle le cycle de vie si besoin
      if (publicInstance.componentWillUpdate) {
        publicInstance.componentWillUpdate(nextProps);
      }
      // Met à jour les props
      publicInstance.props = nextProps;
      // Relance render()
      nextRenderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // La fonction du composant
      nextRenderedElement = type(nextProps);
    }

    // ...
```

Ensuite, nous pouvons regarder le `type` de l'élément rendu. Si le `type` n'a pas changé depuis le dernier rendu, le composant ci-dessous peut être mis à jour au même endroit.

Par exemple, s'il renvoie `<Button color="red" />` la première fois et `<Button color="blue" />` la seconde fois, nous pouvons simplement dire à l'instance interne correspondante de recevoir (`receive()`) l'élément successeur :

```js
    // ...

    // Si le type de l'élément affiché n'a pas changé,
    // réutilise l'instance du composant existant et sort.
    if (prevRenderedElement.type === nextRenderedElement.type) {
      prevRenderedComponent.receive(nextRenderedElement);
      return;
    }

    // ...
```

Cependant, si l’élément successeur a un `type` différent du prédécesseur, nous ne pouvons pas mettre à jour l’instance interne. Un `<button>` ne peut pas « devenir » un `<input>`.

Dans ce cas, nous devons démonter l'instance interne existante et monter la nouvelle correspondant au type du nouvel élément. Par exemple, voici ce qui se produit lorsqu'un composant ayant précédemment affiché un `<button />` fait apparaître un `<input />` :

```js
    // ...

    // Si nous arrivons à ce point, nous devons démonter le composant
    // précédemment monté, monter le nouveau et et échanger leurs nœuds.

    // Récupère l'ancien nœud car il devra être remplacé
    var prevNode = prevRenderedComponent.getHostNode();

    // Démonte l'ancien enfant et monte un nouvel enfant
    prevRenderedComponent.unmount();
    var nextRenderedComponent = instantiateComponent(nextRenderedElement);
    var nextNode = nextRenderedComponent.mount();

    // Remplace la référence de l'enfant
    this.renderedComponent = nextRenderedComponent;

    // Remplace l'ancien nœud avec un nouveau
    // Remarque: il s'agit d'un code de rendu spécifique et
    // idéalement il devrait vivre en dehors de CompositeComponent :
    prevNode.parentNode.replaceChild(nextNode, prevNode);
  }
}
```

En résumé, lorsqu'un composant composite reçoit un nouvel élément, il peut soit déléguer la mise à jour à son instance interne rendue, soit le démonter et en monter une nouvelle à sa place.

Il existe une autre condition où un composant va être remonté plutôt que de recevoir un élément, c'est lorsque la `key` de cet élément a été modifiée. Nous ne discutons pas de la gestion des `key`s dans ce document car ça ajoute une complexité supplémentaire à un tutoriel qui l'est déjà.

Notez que nous devons ajouter une méthode appelée `getHostNode()` à l'instance interne afin qu'il soit possible de localiser le nœud spécifique à la plateforme et de le remplacer lors de la mise à jour. Son implémentation est simple pour les deux classes :

```js
class CompositeComponent {
  // ...

  getHostNode() {
    // Demande au composant rendu de lui fournir.
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

### Mise à jour des composants hôte {#updating-host-components}

Les implémentations de composant hôte, comme `DOMComponent`, font des mises à jour de manière différentes. A la réception d’un élément, ils ont besoin de mettre à jour la vue spécifique de la plateforme sous-jacente. Dans le cas de React DOM, ça signifie la mise à jour des attributs du DOM :

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

Ensuite, les composants hôte doivent mettre à jour leurs enfants. Contrairement aux composants composite, ils peuvent posséder plusieurs enfants.

Dans cet exemple simplifié, nous utilisons un tableau d'instances internes et effectuons une itération sur celui-ci. Si le `type` reçu des instances internes correspond au `type` précédent, nous les mettons à jour, sinon nous les remplaçons. Le vrai réconciliateur prend également en compte la `key` de l'élément et scrute les déplacements en plus des insertions et des suppressions, mais nous omettons cette logique.

Nous collectons les opérations DOM sur les enfants dans une liste, afin que nous puissions les exécuter par lot :

```js
    // ...

    // Ce sont des tableaux d'éléments React :
    var prevChildren = prevProps.children || [];
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }
    var nextChildren = nextProps.children || [];
    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }
    // Ce sont des tableaux d'instances internes :
    var prevRenderedChildren = this.renderedChildren;
    var nextRenderedChildren = [];

    // Comme nous itérons sur les enfants, nous allons ajouter des opérations dans le tableau.
    var operationQueue = [];

    // Remarque : la section ci-dessous est extrêmement simplifiée !
    // Elle ne gère pas la réorganisation, les enfants avec des trous ou les clés (`key`).
    // Elle existe uniquement pour illustrer le flux global, pas les spécifités.

    for (var i = 0; i < nextChildren.length; i++) {
      // Essaye de récupérer une instance interne existante pour cet enfant
      var prevChild = prevRenderedChildren[i];

      // S'il n'y a aucune instance interne pour cet index,
      // c'est qu'un enfant a été ajouté à la fin. Nous créons une nouvelle
      // instance interne, nous la montons, et nous utilisons son nœud.
      if (!prevChild) {
        var nextChild = instantiateComponent(nextChildren[i]);
        var node = nextChild.mount();

        // Enregistre le besoin d'ajouter un nœud
        operationQueue.push({type: 'ADD', node});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // Nous ne pouvons mettre à jour l'instance que si le type de son élément est identique.
      // Par exemple, <Button size="small" /> peut être mis à jour par
      // <Button size="large" /> mais pas par un <App />.
      var canUpdate = prevChildren[i].type === nextChildren[i].type;

      // Si nous ne pouvons pas mettre à jour une instance existante, nous devons la démonter
      // et monter à la place une nouvelle.
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
      // laissons-la simplement recevoir l'élément futur et gérer sa propre mise à jour.
      prevChild.receive(nextChildren[i]);
      nextRenderedChildren.push(prevChild);
    }

    // Enfin, démonte tous les enfants qui n'existent pas :
    for (var j = nextChildren.length; j < prevChildren.length; j++) {
      var prevChild = prevRenderedChildren[j];
      var node = prevChild.getHostNode();
      prevChild.unmount();

      // Enregistre le besoin de supprimer un nœud
      operationQueue.push({type: 'REMOVE', node});
    }

    // Pointe la liste des enfants rendus sur la version actualisées.
    this.renderedChildren = nextRenderedChildren;

    // ...
```

Lors de la dernière étape, nous exécutons les opérations du DOM. Encore une fois, le vrai code réconciliateur est plus complexe car il gère également les déplacements :

```js
    // ...

    // Traite les opérations dans la file d'attente
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

Et c'est tout pour la mise à jour des composants hôte.

### Mises à jour de haut niveau {#top-level-updates}

Maintenant que `CompositeComponent` et `DOMComponent` implémentent la méthode `receive(nextElement)`, nous pouvons modifier la fonction `mountTree()` de haut niveau pour l’utiliser lorsque le `type` de l’élément est identique à celui de la dernière fois :

```js
function mountTree(element, containerNode) {
  // Vérifie l'existence d'un arbre
  if (containerNode.firstChild) {
    var prevNode = containerNode.firstChild;
    var prevRootComponent = prevNode._internalInstance;
    var prevElement = prevRootComponent.currentElement;

    // Si nous pouvons, réutilise le composant racine existant
    if (prevElement.type === element.type) {
      prevRootComponent.receive(element);
      return;
    }

    // Autrement, démonte l'arborescence existante
    unmountTree(containerNode);
  }

  // ...

}
```

Maintenant, appeler  deux fois `mountTree()` avec le même type n’est pas destructif :

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Reuses the existing DOM:
mountTree(<App />, rootEl);
```

Ce sont les bases du fonctionnement interne de React.

### Ce que nous avons laissé de côté {#what-we-left-out}

Ce document est simplifié par rapport au vrai code. Il y a quelques aspects importants que nous n'avons pas abordés :

* Les composants peuvent rendre la valeur `null` et le réconciliateur peut gérer les « emplacements vides » dans les tableaux et la sortie rendue.

* Le réconciliateur lit également la `key` depuis les éléments, et l'utilise pour déterminer quelle instance interne correspond à quel élément dans un tableau. Une grande partie de la complexité de la vraie implémentation de React est liée à ça.

* En plus des classes d’instance interne composite et hôte, il existe également des classes pour les composants « texte » et « vide ». Ils représentent des nœuds de texte et des « emplacements vides » que vous obtenez en faisant un rendu `null`.

* Les moteurs de rendu utilisent l'[injection](/docs/codebase-overview.html#dynamic-injection) pour passer la classe interne de l'hôte au réconciliateur. Par exemple, React DOM indique au réconciliateur d'utiliser `ReactDOMComponent` pour l'implémentation de l'instance interne de l'hôte.

* La logique de mise à jour de la liste des enfants est extraite dans un _mixin_ appelé `ReactMultiChild`, utilisé par les implémentations de la classe d'instance interne de l'hôte dans React DOM et React Native.

* Le réconciliateur implémente également la prise en charge de `setState()` dans les composants composites. Plusieurs actualisations dans les gestionnaires d'événements sont faites par lot dans une seule mise à jour.

* Le réconciliateur prend également en charge l’attachement et le détachement des refs aux composants composites et aux nœuds hôtes.

* Les méthodes du cycle de vie appelées une fois que le DOM est prêt, telles que `componentDidMount()` et `componentDidUpdate()`, sont rassemblées dans des « files d'attente de fonction de rappel » et sont exécutées en un seul lot.

* React place les informations à propos de la mise à jour courante dans un objet interne appelé « transaction ». Les transactions sont utiles pour suivre la liste des méthodes du cycle de vie en attente, l'imbrication actuelle du DOM pour les avertissements et tout ce qui est « global » à une mise à jour spécifique. Les transactions garantissent également que React « nettoie tout » après les mises à jour. Par exemple, la classe transaction fournie par React DOM restaure après toute mise à jour la sélection d'une saisie.

### Saut dans le code {#jumping-into-the-code}

* [`ReactMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/client/ReactMount.js) est l'endroit où réside le code de `mountTree()` et `unmountTree()` de ce tutoriel. Il prend en charge le montage et le démontage des composants de niveau supérieur. [`ReactNativeMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeMount.js) est son analogue pour React Native.
* [`ReactDOMComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/shared/ReactDOMComponent.js) est l'équivalent de `DOMComponent` dans ce tutoriel. Il implémente la classe de composant hôte pour le moteur de rendu de React DOM. [`ReactNativeBaseComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeBaseComponent.js) est son analogue pour React Native.
* [`ReactCompositeComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js) est l'équivalent de `CompositeComponent` dans ce tutoriel. Il gère l'appel des composants définis par l'utilisateur et le maintien de leur état.
* [`instantiateReactComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/instantiateReactComponent.js) contient le commutateur qui sélectionne la classe d'instance interne appropriée pour construire un élément. C'est l'équivalent de `instantiateComponent()` dans ce tutoriel.

* [`ReactReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactReconciler.js) est un enrobage avec les méthodes `mountComponent()`, `receiveComponent()` et `unmountComponent()`. Il appelle les implémentations sous-jacentes des instances internes, mais en plus il inclut du code autour d'elles partagé par toutes.

* [`ReactChildReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactChildReconciler.js) implémente la logique de montage, de mise à jour et de démontage des enfants en fonction de la `key` de leurs éléments.

* [`ReactMultiChild`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactMultiChild.js) implémente le traitement de la file d'attente des opérations pour les insertions, les suppressions et les déplacements d'enfants indépendamment du moteur de rendu.

* `mount()`, `receive()` et `unmount()` sont nommées en réalité `mountComponent()`, `receiveComponent()` et `unmountComponent()` dans la base de code React pour des raisons historiques, mais elles reçoivent des éléments.

* Les propriétés des instances internes commencent par un trait de soulignement (_underscore_), par exemple `_currentElement`. Elles sont considérées dans la base de code comme des champs publics en lecture seule.

### Orientations futures {#future-directions}

Le réconciliateur de pile a des limitations inhérentes, comme le fait qu'il soit synchrone et incapable d'interrompre le travail ou de le découper en plusieurs morceaux. Il y a un travail en cours sur le [nouveau réconciliateur Fiber](/docs/codebase-overview.html#fiber-reconciler) avec une [architecture complètement différente](https://github.com/acdlite/react-fiber-architecture). Dans l’avenir, nous avons l’intention de remplacer le réconciliateur de pile avec ça, mais pour le moment, nous sommes loin de l'iso-fonctionnalité.

### Prochaines étapes {#next-steps}

Lisez la [section suivante](/docs/design-principles.html) pour en savoir plus sur les principes de conception que nous utilisons pour le développement de React.
