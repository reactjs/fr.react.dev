---
title: Children
---

<Pitfall>

Il est rare de recourir à `Children`, car cette API est susceptible de fragiliser votre code. [Découvrez les alternatives](#alternatives).

</Pitfall>

<Intro>

`Children` vous permet de manipuler et transformer les contenus JSX que votre composant reçoit *via* la [prop `children`](/learn/passing-props-to-a-component#passing-jsx-as-children).

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

Appelez `Children.count(children)` pour compter les enfants dans la structure de données `children`.

```js src/RowList.js active
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

- Les nœuds vides (`null`, `undefined` et les booléens), les chaînes de caractères, les nombres, les [éléments React](/reference/react/createElement) sont tous comptabilisés. Les tableaux ne comptent pas comme des nœuds individuels, mais leurs enfants si. **La traversée s'arrête aux éléments React** : leur rendu n'est pas effectué, et leurs enfants ne sont pas traversés. Les [Fragments](/reference/react/Fragment) ne sont pas traversés non plus.

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

Appelez `Children.forEach(children, fn, thisArg?)` pour exécuter du code pour chaque enfant dans la structure de données `children`.

```js src/RowList.js active
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
* `fn` : la fonction que vous souhaitez exécuter pour chaque enfant, comme la fonction de rappel de la [méthode `forEach` des tableaux](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). Elle sera appelée avec l'enfant comme premier argument et son index en second argument.  L'index démarre à `0` et s'incrémente à chaque appel.
* `thisArg` **optionnel** : la [valeur de `this`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/this) avec laquella la fonction `fn` sera appelée. S'il est manquant, `this` sera `undefined`.

#### Valeur renvoyée {/*children-foreach-returns*/}

`Children.forEach` renvoie `undefined`.

#### Limitations {/*children-foreach-caveats*/}

- Les nœuds vides (`null`, `undefined` et les booléens), les chaînes de caractères, les nombres, les [éléments React](/reference/react/createElement) sont tous comptabilisés. Les tableaux ne comptent pas comme des nœuds individuels, mais leurs enfants si. **La traversée s'arrête aux éléments React** : leur rendu n'est pas effectué, et leurs enfants ne sont pas traversés. Les [Fragments](/reference/react/Fragment) ne sont pas traversés non plus.

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

Appelez `Children.map(children, fn, thisArg?)` pour produire une transformée de chaque enfant dans la structure de données `children`.

```js src/RowList.js active
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
* `fn` : la fonction que vous souhaitez exécuter pour chaque enfant, comme la fonction de rappel de la [méthode `forEach` des tableaux](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). Elle sera appelée avec l'enfant comme premier argument et son index en second argument.  L'index démarre à `0` et s'incrémente à chaque appel. Cette fonction doit renvoyer un nœud React. Ça peut être un nœud vide (`null`, `undefined` ou un booléen), une chaîne de caractères, un nombre, un élément React ou un tableau de nœuds React.
* `thisArg` **optionnel** : la [valeur de `this`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/this) avec laquella la fonction `fn` sera appelée. S'il est manquant, `this` sera `undefined`.

#### Valeur renvoyée {/*children-map-returns*/}

Si `children` est `null` ou `undefined`, renvoie la même valeur.

Dans le cas contraire, renvoie un tableau plat constitué des nœuds que vous avez renvoyé depuis la fonction `fn`.  Le tableau renvoyé contiendra tous les nœuds à l'exception de `null` et `undefined`.

#### Limitations {/*children-map-caveats*/}

- Les nœuds vides (`null`, `undefined` et les booléens), les chaînes de caractères, les nombres, les [éléments React](/reference/react/createElement) sont tous comptabilisés. Les tableaux ne comptent pas comme des nœuds individuels, mais leurs enfants si. **La traversée s'arrête aux éléments React** : leur rendu n'est pas effectué, et leurs enfants ne sont pas traversés. Les [Fragments](/reference/react/Fragment) ne sont pas traversés non plus.

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

```js src/ReversedList.js active
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

Pour transformer les enfants JSX que votre composant [reçoit dans sa prop `children`](/learn/passing-props-to-a-component#passing-jsx-as-children), appelez `Children.map` :

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

Dans l'exemple ci-dessus, la `RowList` enrobe chaque enfant qu'elle reçoit dans un conteneur `<div className="Row">`. Disons par exemple que le composant parent passe trois balises `<p>` dans la prop `children` de `RowList` :

```js
<RowList>
  <p>Voici le premier élément.</p>
  <p>Voici le deuxième.</p>
  <p>Et voici le troisième.</p>
</RowList>
```

Dans ce cas, avec l'implémentation de `RowList` ci-dessus, le rendu final ressemblera à ceci :

```js
<div className="RowList">
  <div className="Row">
    <p>Voici le premier élément.</p>
  </div>
  <div className="Row">
    <p>Voici le deuxième.</p>
  </div>
  <div className="Row">
    <p>Et voici le troisième.</p>
  </div>
</div>
```

`Children.map` ressemble à une [transformation de tableaux avec `map()`](/learn/rendering-lists).  La différence vient de ce que la structure de données `children` est considérée *opaque*.  Ça signifie que même s'il s'agit parfois d'un tableau, vous ne devriez pas supposer qu'elle en soit effectivement un, ou de n'importe quel autre type particulier d'ailleurs.  C'est pourquoi vous devriez utiliser `Children.map` si vous avez besoin de la transformer.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Voici le premier élément.</p>
      <p>Voici le deuxième.</p>
      <p>Et voici le troisième.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
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

#### Pourquoi la prop `children` n'est-elle pas un tableau ? {/*why-is-the-children-prop-not-always-an-array*/}

Dans React, la prop `children` est vue comme une structure de données *opaque*. Ça signifie que vous ne devriez pas dépendre de sa structure effective.  Pour transformer, filtrer ou compter les nœuds enfants, vous devriez utiliser les méthodes de `Children`.

En pratique, la structure de données `children` est souvent représentée en interne par un tableau.  Ceci dit, s'il n'y a qu'un seul enfant, React ne créera pas de tableau superflu afin de ménager la mémoire. Tant que vous utilisez les méthodes de `Children` au lieu de manipuler ou inspecter directement la prop `children`, votre code ne cassera pas, même si React modifie l'implémentation effective de la structure de données.

Même lorsque `children` est bien un tableau, `Children.map` a des particularités utiles. Par exemple, `Children.map` combine les [clés](/learn/rendering-lists#keeping-list-items-in-order-with-key) des éléments renvoyés avec celles des `children` que vous lui aviez passés. Ça permet de garantir que les enfants JSX d'origine ne « perdent » pas leurs clés même s'ils sont enrobés comme dans l'exemple ci-dessus.

</DeepDive>

<Pitfall>

La structure de données `children` **n'inclut pas le résultat du rendu** des composants que vous passez en JSX.  Dans l'exemple ci-dessous, les `children` reçus par la `RowList` contiennent deux éléments, pas trois :

1. `<p>Voici le premier élément.</p>`
2. `<MoreRows />`

C'est pourquoi seulement deux enrobages sont générés dans cet exemple :

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Voici le premier élément.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>Voici le deuxième.</p>
      <p>Et voici le troisième.</p>
    </>
  );
}
```

```js src/RowList.js
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

**Il n'y a aucun moyen d'obtenir le résultat du rendu d'un composant imbriqué** tel que `<MoreRows />` lorsqu'on manipule `children`.  C'est pourquoi [il est généralement préférable d'utiliser une des solutions alternatives](#alternatives).

</Pitfall>

---

### Exécuter du code pour chaque enfant {/*running-some-code-for-each-child*/}

Appelez `Children.forEach` pour itérer sur chaque enfant dans la structure de données `children`. Elle ne renvoie aucune valeur et fonctionne de façon similaire à la [méthode `forEach` des tableaux](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).  Vous pouvez l'utiliser pour exécuter de la logique personnalisée, comme la construction de votre propre tableau.

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>Voici le premier élément.</p>
      <p>Voici le deuxième.</p>
      <p>Et voici le troisième.</p>
    </SeparatorList>
  );
}
```

```js src/SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Retrait du dernier séparateur
  return result;
}
```

</Sandpack>

<Pitfall>

Comme mentionné plus haut, il n'y a aucun moyen d'obtenir le résultat du rendu d'un composant imbriqué lorsqu'on manipule `children`.  C'est pourquoi [il est généralement préférable d'utiliser une des solutions alternatives](#alternatives).

</Pitfall>

---

### Compter les nœuds enfants {/*counting-children*/}

Appelez `Children.count(children)` pour calculer le nombre de nœuds enfants.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Voici le premier élément.</p>
      <p>Voici le deuxième.</p>
      <p>Et voici le troisième.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Nombre de lignes : {Children.count(children)}
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

Comme mentionné plus haut, il n'y a aucun moyen d'obtenir le résultat du rendu d'un composant imbriqué lorsqu'on manipule `children`.  C'est pourquoi [il est généralement préférable d'utiliser une des solutions alternatives](#alternatives).

</Pitfall>

---

### Convertir les enfants en tableau {/*converting-children-to-an-array*/}

Appelez `Children.toArray(children)` pour transformer la structure de données `children` en un véritable tableau JavaScript. Ça vous permet de le manipuler avec les méthodes natives des tableaux telles que [`filter`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`sort`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) ou [`reverse`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse).

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>Voici le premier élément.</p>
      <p>Voici le deuxième.</p>
      <p>Et voici le troisième.</p>
    </ReversedList>
  );
}
```

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

Comme mentionné plus haut, il n'y a aucun moyen d'obtenir le résultat du rendu d'un composant imbriqué lorsqu'on manipule `children`.  C'est pourquoi [il est généralement préférable d'utiliser une des solutions alternatives](#alternatives).

</Pitfall>

---

## Alternatives {/*alternatives*/}

<Note>

Cette section décrit des alternatives à l'API `Children` (avec un `C` majuscule), importée comme ceci :

```js
import { Children } from 'react';
```

Ne la confondez pas avec [l'utilisation de la prop `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) (`c` minuscule), qui de son côté reste valide et même encouragée.

</Note>

### Exposer plusieurs composants {/*exposing-multiple-components*/}

La manipulation des nœuds enfants avec les méthodes de `Children` fragilise souvent le code.  Lorsque vous passez des enfants à un composant en JSX, vous ne vous attendez généralement pas à ce que le composant manipule ou transforme individuellement ces enfants.

Autant que possible, évitez les méthodes de `Children`.  Si par exemple vous souhaitez que chaque enfant d'une `RowList` soit enrobé par un `<div className="Row">`, exportez un composant `Row` et enrobez chaque ligne avec manuellement, comme ceci :

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>Voici le premier élément.</p>
      </Row>
      <Row>
        <p>Voici le deuxième.</p>
      </Row>
      <Row>
        <p>Et voici le troisième.</p>
      </Row>
    </RowList>
  );
}
```

```js src/RowList.js
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

Contrairement au recours à `Children.map`, cette approche n'enrobe pas automatiquement chaque enfant.  **Ceci dit, cette approche a un avantage considérable par rapport à [l'exemple précédent avec `Children.map`](#transforming-children), parce qu'elle marche même si vous continuez à extraire davantage de composants.** Par exemple, elle fonctionnera toujours si vous extrayez votre propre composant `MoreRows` :

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>Voici le premier élément.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>Voici le deuxième.</p>
      </Row>
      <Row>
        <p>Et voici le troisième.</p>
      </Row>
    </>
  );
}
```

```js src/RowList.js
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

Ça ne fonctionnerait pas avec `Children.map` parce qu'elle « verrait » `<MoreRows />` comme un enfant unique (et donc une ligne unique).

---

### Accepter un tableau d'objets comme prop {/*accepting-an-array-of-objects-as-a-prop*/}

Vous pouvez aussi passer explicitement un tableau comme prop. La `RowList` ci-dessous accepte par exemple un tableau pour sa prop `rows` :

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>Voici le premier élément.</p> },
      { id: 'second', content: <p>Voici le deuxième.</p> },
      { id: 'third', content: <p>Et voici le troisième.</p> }
    ]} />
  );
}
```

```js src/RowList.js
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

Dans la mesure où `rows` est un tableau JavaScript standard, le composant `RowList` peut utiliser ses méthodes de tableau natives, telles que [`map`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

Cette approche est particulièrement utile lorsque vous souhaitez pouvoir passer davantage d'informations structurées en complément des enfants.  Dans l'exemple qui suit, le composant `TabSwitcher` reçoit un tableau d'objets dans sa prop `tabs` :

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'Premier',
        content: <p>Voici le premier élément.</p>
      },
      {
        id: 'second',
        header: 'Deuxième',
        content: <p>Voici le deuxième.</p>
      },
      {
        id: 'third',
        header: 'Troisième',
        content: <p>Et voici le troisième.</p>
      }
    ]} />
  );
}
```

```js src/TabSwitcher.js
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

Contrairement au passage des enfants par JSX, cette approche vous permet d'associer des données supplémentaires à chaque élément, comme par exemple `header`.  Puisque vous travaillez directement avec `tabs` et qu'il s'agit d'un tableau, vous n'avez pas besoin des méthodes de `Children`.

---

### Appeler une *prop de rendu* pour personnaliser le rendu {/*calling-a-render-prop-to-customize-rendering*/}

Plutôt que de produire du JSX pour chaque élément individuel, vous pouvez passer une fonction qui renverra ce JSX, puis appeler cette fonction lorsque nécessaire. Dans l'exemple ci-après, le composant `App` passe une fonction `renderContent` au composant `TabSwitcher`. Le composant `TabSwitcher` appelle `renderContent` uniquement pour l'onglet sélectionné :

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['premier', 'deuxième', 'troisième']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>Voici le {tabId} élément.</p>;
      }}
    />
  );
}
```

```js src/TabSwitcher.js
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

Une prop comme `renderContent` est appelée une *prop de rendu* parce qu'elle décrit comment faire le rendu d'un bout d'interface utilisateur.  Ceci étant dit, elle n'a rien de spécial : c'est une prop comme une autre, dont la valeur se trouve être une fonction.

Les props de rendu sont des fonctions, vous pouvez donc leur passer des informations. Le composant `RowList` ci-dessous passe par exemple l'`id` et l'`index` de chaque ligne à la prop de rendu `renderRow`, qui utilise `index` pour mettre en exergue les lignes paires :

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['premier', 'deuxième', 'troisième']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>Voici le {id} élément</p>
          </Row>
        );
      }}
    />
  );
}
```

```js src/RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Nombre de lignes : {rowIds.length}
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

C'est un autre exemple de coopération entre composants parents et enfants sans manipulation des enfants.

---

## Dépannage {/*troubleshooting*/}

### Je passe un composant personnalisé, mais les méthodes de `Children` n'affichent pas son rendu {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

Supposons que vous passiez deux enfants à `RowList` comme ceci :

```js
<RowList>
  <p>Premier élément</p>
  <MoreRows />
</RowList>
```

Si vous faites un `Children.count(children)` au sein de `RowList`, vous obtiendrez `2`. Même si `MoreRows` produit 10 éléments différents, ou s’il renvoie `null`, `Children.count(children)` vaudra tout de même `2`. Du point de vue de `RowList`, il ne « voit » que le JSX qu'il reçoit. Il ne « voit » pas la tambouille interne du composant `MoreRows`.

Cette limitation complexifie l'extraction d'une partie du contenu dans un composant dédié. C'est pourquoi vous devriez préférer les [alternatives](#alternatives) à l'utilisation de `Children`.
