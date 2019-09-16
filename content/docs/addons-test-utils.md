---
id: test-utils
title: Utilitaires de test
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**Importation**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 avec npm
```

## Aperçu {#overview}

`ReactTestUtils` facilite le test de composants React quel que soit votre framework de test. Chez Facebook, nous utilisons [Jest](https://facebook.github.io/jest/) pour réaliser facilement nos tests JavaScript. Pour bien démarrer avec Jest, vous pouvez lire le [Tutoriel React](http://facebook.github.io/jest/docs/en/tutorial-react.html#content) du site web de Jest.

>Remarque
>
> Nous vous conseillons d’utiliser [React Testing Library](https://testing-library.com/react). Cette bibliothèque est conçue pour encourager l'écriture de tests utilisant vos composants de façon similaire aux utilisateurs finaux.
>
> Par ailleurs, Airbnb propose un utilitaire de test appelé [Enzyme](http://airbnb.io/enzyme/), qui permet de facilement exprimer des assertions, manipuler vos composants React et en explorer le résultat.

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

## Référence de l'API {#reference}

### `act()` {#act}

Afin de préparer un composant aux assertions, il suffit d’enrober le code qui se charge de son rendu et de ses mises à jour au sein d'une fonction de rappel qui sera passée à `act()`. De cette manière, votre test s’exécutera dans un environnement proche de celui de React dans le navigateur.

>Remarque
>
> Si vous utilisez `react-test-renderer`, ce dernier propose un export de `act` qui se comporte de la même façon.

Prenons l'exemple d'un composant `Counter` :

```js
class Counter extends React.Component {
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
          Cliquez ici
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

it('peut afficher et mettre à jour un compteur', () => {
  // Teste le premier affichage et l'appel à componentDidMount
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Vous avez cliqué 0 fois');
  expect(document.title).toBe('Vous avez cliqué 0 fois');

  // Teste un second affichage et l'appel à componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('Vous avez cliqué 1 fois');
  expect(document.title).toBe('Vous avez cliqué 1 fois');
});
```

N'oubliez pas que l'émission d'événements DOM ne fonctionne que lorsque le conteneur DOM a été ajouté au `document`. Vous pouvez utiliser un utilitaire comme [`React Testing Library`](https://testing-library.com/react) afin de réduire le volume de code générique.

La page des [`recettes`](/docs/testing-recipes.html) contient de plus amples détails sur le fonctionnement de `act()`, avec des exemples d’utilisation.

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

Cette méthode prend un module de composant simulé et lui ajoute des méthodes utiles pour lui permettre d'être utilisé comme un composant React factice. Plutôt que de réaliser un rendu classique, le composant va simplement devenir une balise `<div>` (ou toute autre balise si `mockTagName` est renseigné) contenant les enfants qui lui sont fournis.

>Remarque
>
> `mockComponent()` est une API obsolète. Nous recommandons plutôt de recourir à [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock).

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

Renvoie `true` si `instance` est un composant défini par l'utilisateur, via une classe ou une fonction.

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

Parcourt tous les composants présents dans `tree` en ne retenant que les composants pour lesquels `test(component)` renvoie `true`. Ce n'est guère utile en soi, mais ça sert de base à d'autres utilitaires de test.

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

Trouve tous les éléments DOM des composants de l'arbre de rendu qui sont des composants DOM dont la classe CSS correspond à `className`.

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

Fonctionne comme [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass), mais cette méthode s'attend à ne trouver qu'un seul résultat, qu'elle renverra. Si elle trouve un nombre d'éléments différent de un, elle lèvera une exception .

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

Fonctionne comme [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag), mais cette méthode s'attend à ne trouver qu'un seul résultat, qu'elle renverra. Si elle trouve un nombre d'éléments différent de un, elle lèvera une exception.

* * *

### `scryRenderedComponentsWithType()` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

Trouve toutes les instances des composants dont le type est `componentClass`.

* * *

### `findRenderedComponentWithType()` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

Fonctionne comme [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype), mais cette méthode s'attend à ne trouver qu'un seul résultat, qu'elle renverra. Si elle trouve un nombre d'éléments différent de un, elle lèvera une exception.

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

>Remarque
>
> Vous aurez besoin d'avoir `window`, `window.document` et `window.document.createElement` disponibles globalement **avant** votre import de `React`. Dans le cas contraire, React pensera qu'il ne peut accéder au DOM, et des méthodes telles que `setState` ne fonctionneront pas.

* * *

## Autre utilitaires {#other-utilities}

### `Simulate` {#simulate}

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

Simule l'envoi d'un événement sur un nœud du DOM avec des données optionnelles dans `eventData`.

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

>Remarque
>
> Vous devrez fournir toute les propriétés dédiées aux événements que vous utilisez dans votre composant (par exemple keyCode, which, etc.) car React ne les créera pas pour vous.

* * *
