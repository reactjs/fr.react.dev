---
id: test-utils
title: Utilitaires de test
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**Importer les utilitaires**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 avec npm
```

## Aperçu de l'API {#overview}

`ReactTestUtils` facilite le test de composants React quelque soit le framework de test que vous ayez choisi. Chez Facebook, nous utilisons [Jest](https://facebook.github.io/jest/) pour réaliser facilement nos tests JavaScript. Pour bien démarrer avec Jest vous pouvez lire le [Tutoriel React](http://facebook.github.io/jest/docs/en/tutorial-react.html#content) du site web de Jest.

> Note:
>
> Nous recommandons l'usage de [`react-testing-library`](https://git.io/react-testing-library). Cette bibliothèque est conçue pour permettre et encourager l'écriture de tests qui utilisent vos composants à la manière des utilisateurs finaux.
>
> A titre d'alternative, Airbnb a publié un utilitaire de test appelé [Enzyme](http://airbnb.io/enzyme/), qui permet facilement de tester des assertions, de manipuler vos composants React et d'en explorer le rendu.

 - [`act()`](#act)
 - [`mockComponent()`](#mockcomponent)
 - [`isElement()`](#iselement)
 - [`isElementOfType()`](#iselementoftype)
 - [`isDOMComponent()`](#isdomcomponent)
 - [`isCompositeComponent()`](#iscompositecomponent)
 - [`isCompositeComponentWithType()`](#iscompositecomponentwithtype)
 - [`findAllInRenderedTree()`](#findallinrenderedtree)
 - [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)
 - [`findRenderedDOMComponentWithClass()`](#findrendereddomcomponentwithclass)
 - [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)
 - [`findRenderedDOMComponentWithTag()`](#findrendereddomcomponentwithtag)
 - [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)
 - [`findRenderedComponentWithType()`](#findrenderedcomponentwithtype)
 - [`renderIntoDocument()`](#renderintodocument)
 - [`Simulate`](#simulate)

## Référence {#reference}

### `act()` {#act}

Afin de préparer un composant aux assertions, il suffit d'encapsuler le code qui se charge de son rendu et de ses mises à jour au sein d'une fonction qui sera passée à `act()`. De cette manière votre test s’exécutera dans un environnement au fonctionnement plus proche de React dans le navigateur.

> Remarque :
>
> Si vous utilisez `react-test-renderer`, ce dernier propose un export de `act` qui se comporte de la même façon.

Considérons l'exemple d'un composant `Counter` :

```js
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    document.title = `Vous avez cliqué ${this.state.count} fois`;
  }
  componentDidUpdate() {
    document.title = `Vous avez cliqué ${this.state.count} fois`;
  }
  handleClick() {
    this.setState(state => ({
      count: state.count + 1,
    }));
  }
  render() {
    return (
      <div>
        <p>Vous avez cliqué {this.state.count} fois</p>
        <button onClick={this.handleClick}>
          Cliquez-moi
        </button>
      </div>
    );
  }
}
```

Voici comment nous pouvons le tester :

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('peut faire le rendu et mettre à jour un compteur', () => {
  // Tester le premier rendu et l'appel à componentDidMount
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Vous avez cliqué 0 fois');
  expect(document.title).toBe('Vous avez cliqué 0 fois');

  // Tester un second rendu et l'appel à componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('Vous avez cliqué 1 fois');
  expect(document.title).toBe('Vous avez cliqué 1 fois');
});
```

N'oubliez pas que l'émission d'événements DOM ne fonctionne que lorsque le conteneur DOM a été ajouté au`document`. Vous pouvez utiliser un utilitaire comme [`react-testing-library`](https://github.com/kentcdodds/react-testing-library) afin de réduire le volume de code récurent.

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

Cette méthode prend un module de composant bouchonné et lui ajoute des méthodes utiles pour lui permettre d'être utilisé comme un composant React factice. Plutôt que de réaliser un rendu classique, le composant va simplement devenir une balise `<div>` (ou tout autre balise si `mockTagName` est renseigné) contenant les enfants qui lui sont fournis.

> Remarque :
>
> `mockComponent()` est une API obsolète. Nous recommandons plutôt l'usage du [rendu superficiel](/docs/test-utils.html#shallow-rendering) ou de [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock).

* * *

### `isElement()` {#iselement}

```javascript
isElement(element)
```

Renvoie `true` si `element` est un élément React.

* * *

### `isElementOfType()` {#iselementoftype}

```javascript
isElementOfType(
  element,
  componentClass
)
```

Renvoie `true` si `element` est un élément React dont le type est un `componentClass` React.

* * *

### `isDOMComponent()` {#isdomcomponent}

```javascript
isDOMComponent(instance)
```

Renvoie `true` si `instance` est un composant DOM (tel que `<div>` ou `<span>`).

* * *

### `isCompositeComponent()` {#iscompositecomponent}

```javascript
isCompositeComponent(instance)
```

Renvoie `true` si `instance` est un composant défini par l'utilisateur, telle qu'une classe ou une fonction.

* * *

### `isCompositeComponentWithType()` {#iscompositecomponentwithtype}

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

Renvoie `true` si `instance` est un composant dont le type est un `componentClass` React.

* * *

### `findAllInRenderedTree()` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

Traverse tous les componsants présents dans `tree` et conserve les composants pour lesquels `test(component)` renvoie `true`. Ce n'est guère utile en soi, mais cela sert de base à d'autres utilitaires de test.

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

Trouve tous les éléments DOM des composants de l'arbre de rendu qui sont des composants DOM dont la classe correspond à `className`.

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

Fonctionne comme [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass), mais cette méthode s'attend à ne trouver qu'un seul résultat qu'elle renverra. Si elle trouve un nombre d'éléments différent de un, elle lancera une exception .

* * *

### `scryRenderedDOMComponentsWithTag()` {#scryrendereddomcomponentswithtag}

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

Trouve tous les éléments DOM parmi les composants de l'arbre de rendu qui sont des composants DOM dont le nom de balise correspond à`tagName`.

* * *

### `findRenderedDOMComponentWithTag()` {#findrendereddomcomponentwithtag}

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

Fonctionne comme [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag), mais cette méthode s'attend à ne trouver qu'un seul résultat qu'elle renverra. Si elle trouve un nombre d'éléments différent de un, elle lancera une exception.

* * *

### `scryRenderedComponentsWithType()` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

Trouve toutes les instances des composants dont le type correspond à `componentClass`.

* * *

### `findRenderedComponentWithType()` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

Fonctionne comme [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype), mais cette méthode s'attend à ne trouver qu'un seul résultat qu'elle renverra. Si elle trouve un nombre d'éléments différent de un, elle lancera une exception.

***

### `renderIntoDocument()` {#renderintodocument}

```javascript
renderIntoDocument(element)
```

Réalise le rendu d'un élément React au sein d'un nœud du DOM détaché du document. **Cette fonction nécessite un DOM**. C'est en fait équivalent à :

```js
const domContainer = document.createElement('div');
ReactDOM.render(element, domContainer);
```

> Remarque :
>
> Vous aurez besoin d'avoir `window`, `window.document` et `window.document.createElement` disponibles globalement **préalablement** à votre import de `React`. Autrement, React pensera qu'il ne peut accéder au DOM, et des méthodes telles que `setState` ne fonctionneront pas.

* * *

## Autre utilitaires {#other-utilities}

### `Simulate` {#simulate}

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

Simule l'envoi d'un événement sur un nœud du DOM avec les données optionnelles `eventData`.

`Simulate` dispose d'une méthode pour [chaque événement que React comprend](/docs/events.html#supported-events).

**Cliquer sur un élément**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**Changer la valeur d'un champ de saisie puis presser ENTRÉE.**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'girafe';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> Remarque :
>
> Vous devrez fournir toute les propriétés dédiées aux événements que vous utilisez dans votre composant (par exemple keyCode, which, etc...) puisque React ne les créera pas pour vous.

* * *
