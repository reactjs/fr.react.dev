---
title: Avertissement de dépréciation react-dom/test-utils
---

## Avertissement sur ReactDOMTestUtils.act() {/*reactdomtestutilsact-warning*/}

La fonction `act` de `react-dom/test-utils` est dépréciée au profit de la fonction `act` de `react`.

Avant :

```js
import { act } from 'react-dom/test-utils';
```

Après :

```js
import { act } from 'react';
```

## Reste des API ReactDOMTestUtils {/*rest-of-reactdomtestutils-apis*/}

Toutes les API excepté `act` ont été retirées.

L'équipe React vous conseille de migrer vos tests vers [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) afin de profiter d'une expérience de test moderne et bien maintenue.

### ReactDOMTestUtils.renderIntoDocument {/*reactdomtestutilsrenderintodocument*/}

`renderIntoDocument` peut être remplacée par la fonction `render` de `@testing-library/react`.

Avant :

```js
import { renderIntoDocument } from 'react-dom/test-utils';

renderIntoDocument(<Component />);
```

Après :

```js
import { render } from '@testing-library/react';

render(<Component />);
```

### ReactDOMTestUtils.Simulate {/*reactdomtestutilssimulate*/}

`Simulate` peut être remplacée par la fonction `fireEvent` de `@testing-library/react`.

Avant :

```js
import { Simulate } from 'react-dom/test-utils';

const element = document.querySelector('button');
Simulate.click(element);
```

Après :

```js
import { fireEvent } from '@testing-library/react';

const element = document.querySelector('button');
fireEvent.click(element);
```

Sachez toutefois que `fireEvent` déclenche un véritable événement sur l'élément, plutôt que d'appeler de façon synthétique le gestionnaire d'événement.

### Liste des API retirées {/*list-of-all-removed-apis-list-of-all-removed-apis*/}

- `mockComponent()`
- `isElement()`
- `isElementOfType()`
- `isDOMComponent()`
- `isCompositeComponent()`
- `isCompositeComponentWithType()`
- `findAllInRenderedTree()`
- `scryRenderedDOMComponentsWithClass()`
- `findRenderedDOMComponentWithClass()`
- `scryRenderedDOMComponentsWithTag()`
- `findRenderedDOMComponentWithTag()`
- `scryRenderedComponentsWithType()`
- `findRenderedComponentWithType()`
- `renderIntoDocument`
- `Simulate`
