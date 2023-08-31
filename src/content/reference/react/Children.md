---
title: Children
---

<Pitfall>

Il est rare de recourir à `Children`, car cette API est susceptible de fragiliser votre code. [Découvrez les alternatives](#alternatives).

</Pitfall>

<Intro>

`Children` vous permet de manipuler et transformer les contenus JSX reçus *via* la [prop `children`](/learn/passing-props-to-a-component#passing-jsx-as-children).

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);

```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `Children.count(children)` {/*children-count*/}

Appelez `Children.count(children)` pour compter le nombre d'enfants dans la structure de données `children`.

```js RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Nombre de lignes : {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*children-count-parameters*/}

* `children` : la valeur de la [prop `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) reçue par votre composant.

#### Valeur renvoyée {/*children-count-returns*/}

Le nombre de nœuds dans ces `children`.

#### Limitations {/*children-count-caveats*/}

- Les nœuds vides (`null`, `undefined` et les booléens), les chaînes de caractères, les nombres, les [éléments React](/reference/react/createElement) sont tous comptabilisés. Les tableaux ne comptent pas comme des nœuds individuels, mais leurs enfants si. **La traversée s'arrête aux éléments React** : leur rendu n'est pas effectué, et leurs enfants ne sont pas traversés. Les [fragments](/reference/react/Fragment) ne sont pas traversés non plus.

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

Appelez `Children.forEach(children, fn, thisArg?)` pour exécuter du code pour chaque enfant dans la structure de données `children`.

```js RowList.js active
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[Voir d'autres exemples ci-dessous](#running-some-code-for-each-child).

#### Paramètres {/*children-foreach-parameters*/}

* `children` : la valeur de la [prop `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) reçue par votre composant.
* `fn` : la fonction que vous souhaitez exécuter pour chaque enfant, comme la fonction de rappel de la [méthode `forEach` des tableaux](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). Elle sera appelée avec l'enfant comme premier argument et son index en second argument.  L'index démarre à `0` est s'incrémente à chaque appel.
* `thisArg` **optionnel** : la [valeur de `this`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/this) avec laquella la fonction `fn` sera appelée. S'il est manquant, `this` sera `undefined`.

#### Valeur renvoyée {/*children-foreach-returns*/}

`Children.forEach` renvoie `undefined`.

#### Limitations {/*children-foreach-caveats*/}

- Les nœuds vides (`null`, `undefined` et les booléens), les chaînes de caractères, les nombres, les [éléments React](/reference/react/createElement) sont tous comptabilisés. Les tableaux ne comptent pas comme des nœuds individuels, mais leurs enfants si. **La traversée s'arrête aux éléments React** : leur rendu n'est pas effectué, et leurs enfants ne sont pas traversés. Les [fragments](/reference/react/Fragment) ne sont pas traversés non plus.

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

Appelez `Children.map(children, fn, thisArg?)` pour produire une transformée de chaque enfant dans la structure de données `children`.

```js RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[Voir d'autres exemples ci-dessous](#transforming-children).

#### Paramètres {/*children-map-parameters*/}

* `children` : la valeur de la [prop `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) reçue par votre composant.
* `fn` : la fonction que vous souhaitez exécuter pour chaque enfant, comme la fonction de rappel de la [méthode `forEach` des tableaux](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). Elle sera appelée avec l'enfant comme premier argument et son index en second argument.  L'index démarre à `0` est s'incrémente à chaque appel. Cette fonction doit renvoyer un nœud React. Ça peut être un nœud vide (`null`, `undefined` ou un booléen), une chaîne de caractères, un nombre, un élément React ou un tableau de nœuds React.
* `thisArg` **optionnel** : la [valeur de `this`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/this) avec laquella la fonction `fn` sera appelée. S'il est manquant, `this` sera `undefined`.

#### Valeur renvoyée {/*children-map-returns*/}

Si `children` est `null` ou `undefined`, renvoie la même valeur.

Dans le cas contraire, renvoie un tableau plat constitué des nœuds que vous avez renvoyé depuis la fonction `fn`.  Le tableau renvoyé contiendra tous les nœuds à l'exception de `null` et `undefined`.

#### Limitations {/*children-map-caveats*/}

- Les nœuds vides (`null`, `undefined` et les booléens), les chaînes de caractères, les nombres, les [éléments React](/reference/react/createElement) sont tous comptabilisés. Les tableaux ne comptent pas comme des nœuds individuels, mais leurs enfants si. **La traversée s'arrête aux éléments React** : leur rendu n'est pas effectué, et leurs enfants ne sont pas traversés. Les [fragments](/reference/react/Fragment) ne sont pas traversés non plus.

- Si vous renvoyez un élément ou un tableau d'éléments avec des clés depuis `fn`, **les clés des éléments renvoyés seront automatiquement combinées avec la clé de l'élément correspondant dans `children`**.  Lorsque vous renvoyez plusieurs éléments depuis `fn` sous forme d'un tableau, leurs clés n'ont besoin d'être uniques qu'entre elles.

---

### `Children.only(children)` {/*children-only*/}


Appelez `Children.only(children)` pour garantir que `children` représente un seul élément React.

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### Paramètres {/*children-only-parameters*/}

* `children` : la valeur de la [prop `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) reçue par votre composant.

#### Valeur renvoyée {/*children-only-returns*/}

Si `children` [est un élément valide](/reference/react/isValidElement), renvoie cet élément.

Dans le cas contraire, lève une erreur.

#### Limitations {/*children-only-caveats*/}

- Cette méthode **lève une erreur si vous passez un tableau (tel que le résultat d'un appel à `Children.map`) comme `children`**.  En d'autres termes, elle s'assure que `children` représente un seul élément React, et non un tableau contenant un seul élément React.

---

### `Children.toArray(children)` {/*children-toarray*/}

Appelez `Children.toArray(children)` pour créer un tableau à partir de la structure de données `children`.

```js ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### Paramètres {/*children-toarray-parameters*/}

* `children` : la valeur de la [prop `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) reçue par votre composant.

#### Valeur renvoyée {/*children-toarray-returns*/}

Renvoie un tableau plat des éléments de `children`.

#### Limitations {/*children-toarray-caveats*/}

- Les nœuds vides (`null`, `undefined` et les booléens) seront omis du tableau renvoyé. **Les clés des éléments renvoyés seront calculées à partir des clés des éléments d'origine, de leur profondeur et de leur position.** Ça garantit que l'aplatissement du tableau n'altèrera pas le comportement.

---

## Utilisation {/*usage*/}

### Transformer les nœuds enfants {/*transforming-children*/}

To transform the children JSX that your component [receives as the `children` prop,](/learn/passing-props-to-a-component#passing-jsx-as-children) call `Children.map`:

```js {6,10}
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

In the example above, the `RowList` wraps every child it receives into a `<div className="Row">` container. For example, let's say the parent component passes three `<p>` tags as the `children` prop to `RowList`:

```js
<RowList>
  <p>This is the first item.</p>
  <p>This is the second item.</p>
  <p>This is the third item.</p>
</RowList>
```

Then, with the `RowList` implementation above, the final rendered result will look like this:

```js
<div className="RowList">
  <div className="Row">
    <p>This is the first item.</p>
  </div>
  <div className="Row">
    <p>This is the second item.</p>
  </div>
  <div className="Row">
    <p>This is the third item.</p>
  </div>
</div>
```

`Children.map` is similar to [to transforming arrays with `map()`.](/learn/rendering-lists) The difference is that the `children` data structure is considered *opaque.* This means that even if it's sometimes an array, you should not assume it's an array or any other particular data type. This is why you should use `Children.map` if you need to transform it.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<DeepDive>

#### Why is the children prop not always an array? {/*why-is-the-children-prop-not-always-an-array*/}

In React, the `children` prop is considered an *opaque* data structure. This means that you shouldn't rely on how it is structured. To transform, filter, or count children, you should use the `Children` methods.

In practice, the `children` data structure is often represented as an array internally. However, if there is only a single child, then React won't create an extra array since this would lead to unnecessary memory overhead. As long as you use the `Children` methods instead of directly introspecting the `children` prop, your code will not break even if React changes how the data structure is actually implemented.

Even when `children` is an array, `Children.map` has useful special behavior. For example, `Children.map` combines the [keys](/learn/rendering-lists#keeping-list-items-in-order-with-key) on the returned elements with the keys on the `children` you've passed to it. This ensures the original JSX children don't "lose" keys even if they get wrapped like in the example above.

</DeepDive>

<Pitfall>

The `children` data structure **does not include rendered output** of the components you pass as JSX. In the example below, the `children` received by the `RowList` only contains two items rather than three:

1. `<p>This is the first item.</p>`
2. `<MoreRows />`

This is why only two row wrappers are generated in this example:

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </>
  );
}
```

```js RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

**There is no way to get the rendered output of an inner component** like `<MoreRows />` when manipulating `children`. This is why [it's usually better to use one of the alternative solutions.](#alternatives)

</Pitfall>

---

### Exécuter du code pour chaque enfant {/*running-some-code-for-each-child*/}

Call `Children.forEach` to iterate over each child in the `children` data structure. It does not return any value and is similar to the [array `forEach` method.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) You can use it to run custom logic like constructing your own array.

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </SeparatorList>
  );
}
```

```js SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Remove the last separator
  return result;
}
```

</Sandpack>

<Pitfall>

As mentioned earlier, there is no way to get the rendered output of an inner component when manipulating `children`. This is why [it's usually better to use one of the alternative solutions.](#alternatives)

</Pitfall>

---

### Compter les nœuds enfants {/*counting-children*/}

Call `Children.count(children)` to calculate the number of children.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

As mentioned earlier, there is no way to get the rendered output of an inner component when manipulating `children`. This is why [it's usually better to use one of the alternative solutions.](#alternatives)

</Pitfall>

---

### Convertir les enfants en tableau {/*converting-children-to-an-array*/}

Call `Children.toArray(children)` to turn the `children` data structure into a regular JavaScript array. This lets you manipulate the array with built-in array methods like [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), or [`reverse`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </ReversedList>
  );
}
```

```js ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

As mentioned earlier, there is no way to get the rendered output of an inner component when manipulating `children`. This is why [it's usually better to use one of the alternative solutions.](#alternatives)

</Pitfall>

---

## Alternatives {/*alternatives*/}

<Note>

This section describes alternatives to the `Children` API (with capital `C`) that's imported like this:

```js
import { Children } from 'react';
```

Don't confuse it with [using the `children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) (lowercase `c`), which is good and encouraged.

</Note>

### Exposer plusieurs composants {/*exposing-multiple-components*/}

Manipulating children with the `Children` methods often leads to fragile code. When you pass children to a component in JSX, you don't usually expect the component to manipulate or transform the individual children.

When you can, try to avoid using the `Children` methods. For example, if you want every child of `RowList` to be wrapped in `<div className="Row">`, export a `Row` component, and manually wrap every row into it like this:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </RowList>
  );
}
```

```js RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Unlike using `Children.map`, this approach does not wrap every child automatically. **However, this approach has a significant benefit compared to the [earlier example with `Children.map`](#transforming-children) because it works even if you keep extracting more components.** For example, it still works if you extract your own `MoreRows` component:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </>
  );
}
```

```js RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

This wouldn't work with `Children.map` because it would "see" `<MoreRows />` as a single child (and a single row).

---

### Accepter un tableau d'objets comme prop {/*accepting-an-array-of-objects-as-a-prop*/}

You can also explicitly pass an array as a prop. For example, this `RowList` accepts a `rows` array as a prop:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>This is the first item.</p> },
      { id: 'second', content: <p>This is the second item.</p> },
      { id: 'third', content: <p>This is the third item.</p> }
    ]} />
  );
}
```

```js RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Since `rows` is a regular JavaScript array, the `RowList` component can use built-in array methods like [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) on it.

This pattern is especially useful when you want to be able to pass more information as structured data together with children. In the below example, the `TabSwitcher` component receives an array of objects as the `tabs` prop:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'First',
        content: <p>This is the first item.</p>
      },
      {
        id: 'second',
        header: 'Second',
        content: <p>This is the second item.</p>
      },
      {
        id: 'third',
        header: 'Third',
        content: <p>This is the third item.</p>
      }
    ]} />
  );
}
```

```js TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

Unlike passing the children as JSX, this approach lets you associate some extra data like `header` with each item. Because you are working with the `tabs` directly, and it is an array, you do not need the `Children` methods.

---

### Appeler une *prop de rendu* pour personnaliser le rendu {/*calling-a-render-prop-to-customize-rendering*/}

Instead of producing JSX for every single item, you can also pass a function that returns JSX, and call that function when necessary. In this example, the `App` component passes a `renderContent` function to the `TabSwitcher` component. The `TabSwitcher` component calls `renderContent` only for the selected tab:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>This is the {tabId} item.</p>;
      }}
    />
  );
}
```

```js TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

A prop like `renderContent` is called a *render prop* because it is a prop that specifies how to render a piece of the user interface. However, there is nothing special about it: it is a regular prop which happens to be a function.

Render props are functions, so you can pass information to them. For example, this `RowList` component passes the `id` and the `index` of each row to the `renderRow` render prop, which uses `index` to highlight even rows:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['first', 'second', 'third']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>This is the {id} item.</p>
          </Row>
        );
      }}
    />
  );
}
```

```js RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

This is another example of how parent and child components can cooperate without manipulating the children.

---

## Dépannage {/*troubleshooting*/}

### Je passe un composant personnalisé, mais les méthodes de `Children` n'affichent pas son rendu {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

Suppose you pass two children to `RowList` like this:

```js
<RowList>
  <p>First item</p>
  <MoreRows />
</RowList>
```

If you do `Children.count(children)` inside `RowList`, you will get `2`. Even if `MoreRows` renders 10 different items, or if it returns `null`, `Children.count(children)` will still be `2`. From the `RowList`'s perspective, it only "sees" the JSX it has received. It does not "see" the internals of the `MoreRows` component.

The limitation makes it hard to extract a component. This is why [alternatives](#alternatives) are preferred to using `Children`.
