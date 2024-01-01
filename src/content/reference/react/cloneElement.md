---
title: cloneElement
---

<Pitfall>

Il est rare de recourir à `cloneElement`, car cette API est susceptible de fragiliser votre code. [Découvrez les alternatives](#alternatives).

</Pitfall>

<Intro>

`cloneElement` vous permet de créer un élément React en vous basant sur un élément existant.

```js
const clonedElement = cloneElement(element, props, ...children)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `cloneElement(element, props, ...children)` {/*cloneelement*/}

Appelez `cloneElement` pour créer un élément React basé sur  `element`, mais avec des `props` (y compris `children`) distincts :

```js
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Greeting">
    Bonjour
  </Row>,
  { isHighlighted: true },
  'Au revoir'
);

console.log(clonedElement); // <Row title="Greeting" isHighlighted={true}>Au revoir</Row>
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `element` : l'argument `element` doit être un élément React valide. Il peut par exemple s'agir d'un nœud JSX tel que `<Something />` ou du résultat d'un appel à [`createElement`](/reference/react/createElement) voire d'un autre appel à `cloneElement`.

* `props` : l'argument `props` doit être soit un objet, soit `null`. Si vous passez `null`, l'élément cloné conservera toutes les `element.props` d'origine. Dans le cas contraire, pour chaque prop de l'objet `props`, l'élément renvoyé « favorisera » la valeur issue de `props` plutôt que celle issue d'`element.props`. Le reste des props seront remplies à partir des `element.props` d'origine. Si vous passez `props.key` ou `props.ref`, elles remplaceront également celles d'origine.

* `...children` **optionels** : un nombre quelconque de nœuds enfants. Il peut s'agir de n'importe quels nœuds React, y compris des éléments React, des chaînes de caractères, des nombres, des [portails](/reference/react-dom/createPortal), des nœuds vides (`null`, `undefined`, `true` et `false`) et des tableaux de nœuds React. Si vous ne passez aucun argument `...children`, les `element.props.children` d'origine seront préservés.

#### Valeur renvoyée {/*returns*/}

`cloneElement` renvoie un objet descripteur d'élément React avec quelques propriétés :

* `type` : identique à `element.type`.
* `props` : le résultat d'une fusion superficielle de `element.props` avec les `props` prioritaires que vous auriez éventuellement passées.
* `ref` : la `element.ref` d'origine, à moins qu'elle n'ait été remplacée par `props.ref`.
* `key` : la `element.key` d'origine, à moins qu'elle n'ait été remplacée par `props.key`.

En général, vous renverrez l'élément depuis votre composant, ou en ferez l'enfant d'un autre élément. Même si vous pourriez lire les propriétés de l'élément, il vaut mieux traiter tout objet élément comme une boîte noire après sa création, et vous contenter de l'afficher.

#### Limitations {/*caveats*/}

* Le clonage d'un élément **ne modifie pas l'élément d'origine**.

* Vous ne devriez **passer les enfants comme arguments multiples à `cloneElement` que s'ils sont statiquement connus**, comme par exemple `cloneElement(element, null, child1, child2, child3)`. Si vos enfants sont dynamiques, passez leur tableau entier comme troisième argument : `cloneElement(element, null, listItems)`. Ça garantit que React vous [avertira en cas de `key` manquantes](/learn/rendering-lists#keeping-list-items-in-order-with-key) lors de listes dynamiques.  C'est inutile pour les listes statiques puisque leur ordre et leur taille ne changent jamais.

* `cloneElement` complexifie le pistage du flux de données, aussi vous devriez **préférer ses [alternatives](#alternatives)**.

---

## Utilisation {/*usage*/}

### Surcharger les props d'un élément {/*overriding-props-of-an-element*/}

Pour surcharger les props d'un <CodeStep step={1}>élément React</CodeStep>, passez-le à `cloneElement`, conjointement aux <CodeStep step={2}>props que vous souhaitez remplacer</CodeStep> :

```js [[1, 5, "<Row title=\\"Greeting\\" />"], [2, 6, "{ isHighlighted: true }"], [3, 4, "clonedElement"]]
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Greeting" />,
  { isHighlighted: true }
);
```

Ici, l'<CodeStep step={3}>élément cloné</CodeStep> sera `<Row title="Greeting" isHighlighted={true} />`.

**Déroulons un exemple afin de comprendre en quoi c'est utile.**

Imaginons qu'un composant `List` affiche ses [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) comme une liste de lignes sélectionnables avec un bouton « Suivant » qui modifie la ligne sélectionnée. Le composant `List` doit pouvoir afficher la `Row` sélectionnée d'une façon différente, il clone donc chaque enfant `<Row>` qu'il reçoit, et y ajoute une prop supplémentaire `isHighlighted: true` ou `isHighlighted: false` :

```js {6-8}
export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex
        })
      )}
```

Disons que le JSX d'origine reçu par `List` ressemble à ça :

```js {2-4}
<List>
  <Row title="Chou" />
  <Row title="Ail" />
  <Row title="Pomme" />
</List>
```

En clonant ses enfants, la `List` peut passer des infos supplémentaires à chaque `Row` qu'elle contient. Le résultat ressemblerait à ceci :

```js {4,8,12}
<List>
  <Row
    title="Chou"
    isHighlighted={true}
  />
  <Row
    title="Ail"
    isHighlighted={false}
  />
  <Row
    title="Pomme"
    isHighlighted={false}
  />
</List>
```

Voyez comme le fait de presser « Suivant » met à jour l'état de la `List` et met en exergue une ligne différente :

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List>
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
        />
      )}
    </List>
  );
}
```

```js src/List.js active
import { Children, cloneElement, useState } from 'react';

export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Suivant
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Chou', id: 1 },
  { title: 'Ail', id: 2 },
  { title: 'Pomme', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

En résumé, la `List` a cloné les éléments `<Row />` qu'elle a reçus et leur a ajouté une prop supplémentaire.

<Pitfall>

Le clonage des nœuds enfants complexifie le flux de données dans votre appli : vous devriez donc plutôt essayer une des [alternatives](#alternatives).

</Pitfall>

---

## Alternatives {/*alternatives*/}

### Passer des données *via* une prop de rendu {/*passing-data-with-a-render-prop*/}

Plutôt que d'utiliser `cloneElement`, envisagez d'accepter une *prop de rendu* *(render prop, NdT)* du genre `renderItem`. Ci-dessous, `List` reçoit une prop `renderItem`. `List` appelle `renderItem` pour chaque élément et lui passe `isHighlighted` comme argument :

```js {1,7}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
```

La prop `renderItem` est appelée « prop de rendu » parce que c'est une prop indiquant *comment* faire le rendu de quelque chose.  Vous pouvez par exemple passer une implémentation de `renderItem` qui produit une `<Row>` avec la valeur `isHighlighted` reçue :

```js {3,7}
<List
  items={products}
  renderItem={(product, isHighlighted) =>
    <Row
      key={product.id}
      title={product.title}
      isHighlighted={isHighlighted}
    />
  }
/>
```

Le résultat final est identique à la version basée sur `cloneElement` :

```js {4,8,12}
<List>
  <Row
    title="Chou"
    isHighlighted={true}
  />
  <Row
    title="Ail"
    isHighlighted={false}
  />
  <Row
    title="Pomme"
    isHighlighted={false}
  />
</List>
```

En revanche, il est plus facile de pister l'origine de la valeur `isHighlighted`.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product, isHighlighted) =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={isHighlighted}
        />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Suivant
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Chou', id: 1 },
  { title: 'Ail', id: 2 },
  { title: 'Pomme', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Cette approche est préférable à `cloneElement` car elle est plus explicite.

---

### Passer des données *via* un contexte {/*passing-data-through-context*/}

Une autre alternative à `cloneElement` consiste à [passer des données *via* un contexte](/learn/passing-data-deeply-with-context).

Vous pourriez par exemple appeler [`createContext`](/reference/react/createContext) pour définir un `HighlightContext` :

```js
export const HighlightContext = createContext(false);
```

Votre composant `List` peut enrober chaque élément qu'il affiche dans un fournisseur de `HighlightContext` :

```js {8,10}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider key={item.id} value={isHighlighted}>
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
```

Avec cette approche, `Row` n'a même pas besoin de recevoir une prop `isHighlighted`. Il la lit plutôt directement depuis le contexte :

```js src/Row.js {2}
export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  // ...
```

Ça permet au composant appelant de ne pas avoir à se soucier de passer `isHighlighted` à `<Row>` :

```js {4}
<List
  items={products}
  renderItem={product =>
    <Row title={product.title} />
  }
/>
```

`List` et `Row` coordonnent plutôt la logique de mise en exergue au travers du contexte.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product) =>
        <Row title={product.title} />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider
            key={item.id}
            value={isHighlighted}
          >
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Suivant
      </button>
    </div>
  );
}
```

```js src/Row.js
import { useContext } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/HighlightContext.js
import { createContext } from 'react';

export const HighlightContext = createContext(false);
```

```js src/data.js
export const products = [
  { title: 'Chou', id: 1 },
  { title: 'Ail', id: 2 },
  { title: 'Pomme', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

[Apprenez-en davantage sur la transmission de données *via* un contexte](/reference/react/useContext#passing-data-deeply-into-the-tree).

---

### Extraire la logique dans un Hook personnalisé {/*extracting-logic-into-a-custom-hook*/}

Une autre approche que vous pouvez tenter consiste à extraire la logique « non visuelle » dans votre propre Hook, puis à utiliser l'information renvoyée par votre Hook pour décider du contenu de votre rendu.  Vous pourriez par exemple écrire un Hook personnalisé `useList` comme celui-ci :

```js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

Puis vous l'utiliseriez comme suit :

```js {2,9,13}
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Suivant
      </button>
    </div>
  );
}
```

Le flux de données est explicite, mais l'état réside dans le Hook personnalisé `useList` que vous pouvez réutiliser dans n'importe quel composant :

<Sandpack>

```js
import Row from './Row.js';
import useList from './useList.js';
import { products } from './data.js';

export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Suivant
      </button>
    </div>
  );
}
```

```js src/useList.js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Chou', id: 1 },
  { title: 'Ail', id: 2 },
  { title: 'Pomme', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Cette approche est particulièrement utile lorsque vous voulez réutiliser une même logique dans des composants distincts.
