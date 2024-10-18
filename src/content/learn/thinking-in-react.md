---
title: Penser en React
---

<Intro>

React peut changer votre façon de penser aux designs que vous observez et aux applis que vous construisez. Lorsque vous construirez une interface utilisateur (UI) avec React, vous commencerez par la décomposer en éléments appelés *composants*. Ensuite, vous décrirez les différents états visuels de chaque composant. Enfin, vous brancherez vos composants ensemble de façon à ce que les données circulent entre eux.  Dans ce tutoriel, nous allons vous guider à travers le processus mental de construction d'un tableau de données de produits filtrable, en utilisant React.

</Intro>

## Partir de la maquette {/*start-with-the-mockup*/}

Imaginons que vous ayez déjà une API JSON et une maquette fournie par la designer.

L'API JSON renvoie des données qui ressemblent à ça :

```json
[
  { category: "Fruits", price: "$1", stocked: true, name: "Pomme" },
  { category: "Fruits", price: "$1", stocked: true, name: "Fruit du dragon" },
  { category: "Fruits", price: "$2", stocked: false, name: "Fruit de la passion" },
  { category: "Légumes", price: "$2", stocked: true, name: "Épinard" },
  { category: "Légumes", price: "$4", stocked: false, name: "Citrouille" },
  { category: "Légumes", price: "$1", stocked: true, name: "Petits pois" }
]
```

La maquette ressemble à ça :

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

Pour implémenter cette UI en React, vous allez généralement devoir suivre les mêmes cinq étapes.

## Étape 1 : décomposer l'UI en une hiérarchie de composants {/*step-1-break-the-ui-into-a-component-hierarchy*/}

Commencez par dessiner des boîtes autour de chaque composant et sous-composant sur la maquette, et nommez-les.  Si vous travaillez avec un·e designer, iel aura peut-être déjà nommé ces composants dans ses outils de design : demandez-lui !

En fonction de votre propre vécu, vous pouvez aborder la découpe du design en composants selon divers axes :

- **Programmatique** : utilisez les mêmes techniques d'arbitrage que si vous deviez créer une nouvelle fonction ou un nouvel objet.  Une de ces techniques réside dans le [principe de responsabilité unique](https://fr.wikipedia.org/wiki/Principe_de_responsabilit%C3%A9_unique), qui veut qu'un composant ne doive idéalement faire qu'une seule chose. S'il se retrouve à grandir, il devrait sans doute être décomposé en sous-composants plus simples.
- **CSS** : réfléchissez aux endroits pour lesquels vous définiriez un sélecteur de classe. (Ceci dit, les composants sont un peu moins granulaires.)
- **Design** : imaginez comment vous organiseriez les couches du design.

Si votre JSON est bien structuré, vous constaterez souvent qu'il a une sorte de correspondance naturelle à la structure des composants de votre UI. C'est parce que l'UI et les modèles de données ont souvent la même architecture d'information — la même forme, en somme.  Découpez votre UI en composants, avec chaque composant qui correspond à une partie de votre modèle de données.

Il y a cinq composants sur cet écran :

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable` (gris) contient l'appli entière.
2. `SearchBar` (bleu) reçoit les saisies de l'utilisateur.
3. `ProductTable` (mauve) affiche et filtre la liste en fonction de la saisie utilisateur.
4. `ProductCategoryRow` (vert) affiche un en-tête pour chaque catégorie.
5. `ProductRow` (jaune) affiche une ligne pour chaque produit.

</CodeDiagram>

</FullWidth>

Si vous examinez `ProductTable` (en mauve), vous verrez que l'en-tête du tableau (qui contient les libellés « Nom » et « Prix ») n'a pas son propre composant.  C'est une question de préférence personnelle, et les deux approches se valent.  Dans cet exemple, il fait partie de `ProductTable` parce qu'il apparaît au sein de la liste de `ProductTable`.  Ceci dit, si cet en-tête devenait complexe (par exemple en ajoutant des déclencheurs de tri), vous pourriez l'extraire vers son propre composant `ProductTableHeader`.

Maintenant que vous avez identifié les composants de la maquette, déterminez leur hiérarchie. Les composants qui apparaissent au sein d'un autre composant dans la maquette devraient apparaître comme enfants dans cette arborescence :

- `FilterableProductTable`
  - `SearchBar`
  - `ProductTable`
    - `ProductCategoryRow`
    - `ProductRow`

## Étape 2 : construire une version statique en React {/*step-2-build-a-static-version-in-react*/}

À présent que vous avez votre hiérarchie de composants, il est temps d'implémenter votre appli.  L'approche la plus directe consiste à construire une version qui affiche l'UI à partir du modèle de données, sans en gérer l'interactivité… pour le moment !  Il est souvent plus facile de construire une version statique d'abord et d'ajouter l'interactivité ensuite.  Construire une version statique nécessite beaucoup de saisie mais peu de réflexion, alors qu'ajouter de l'interactivité nécessite beaucoup de réflexion mais peu de saisie.

Pour construire une version statique de votre appli qui affiche votre modèle de données, vous aurez besoin de construire des [composants](/learn/your-first-component) qui en réutilisent d'autres et leur passent des données grâce aux [props](/learn/passing-props-to-a-component). Les props sont un moyen de passer des données du parent aux enfants. (Si vous êtes à l'aise avec la notion d'[état](/learn/state-a-components-memory), n'utilisez pas d'état pour construire cette version statique.  L'état est réservé à l'interactivité, c'est-à-dire à des données qui changent avec le temps.  Vous construisez une version statique : vous n'en avez pas besoin.)

Vous pouvez construire l'appli soit « de haut en bas », en commençant par construire les composants les plus en haut de la hiérarchie (tels que `FilterableProductTable`), soit « de bas en haut », en commençant par les composants de niveau inférieur (tels que `ProductRow`).  Dans des contextes simples, il est généralement plus facile de procéder de haut en bas, et sur les projets plus complexes, il est plus aisé de procéder de bas en haut.

<Sandpack>

```jsx src/App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Prix</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Recherche..." />
      <label>
        <input type="checkbox" />
        {' '}
        N’afficher que les produits en stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  { category: "Fruits", price: "1 €", stocked: true, name: "Pomme" },
  { category: "Fruits", price: "1 €", stocked: true, name: "Fruit du dragon" },
  { category: "Fruits", price: "2 €", stocked: false, name: "Fruit de la passion" },
  { category: "Légumes", price: "2 €", stocked: true, name: "Épinard" },
  { category: "Légumes", price: "4 €", stocked: false, name: "Citrouille" },
  { category: "Légumes", price: "1 €", stocked: true, name: "Petits pois" }
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

(Si ce code vous paraît intimidant, faites un détour par notre [démarrage rapide](/learn/) d'abord !)

Après avoir construit vos composants, vous disposerez d'une bibliothèque de composants réutilisables qui afficheront votre modèle de données.  Puisque vous construisez ici une version statique de l'appli, ces composants ne renvoient que du JSX. Le composant au sommet de la hiérarchie (`FilterableProductTable`) prendra votre modèle de données comme prop. On parle de *flux de données unidirectionnel* parce que les données circulent uniquement en descente, du composant racine vers ceux tout en bas de l'arborescence.

<Pitfall>

À ce stade, vous ne devriez utiliser aucune valeur d'état. Ce sera pour la prochaine étape !

</Pitfall>

## Étape 3 : trouver une représentation minimale suffisante de l'état de l'UI {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

Pour rendre votre UI interactive, vous allez devoir permettre aux utilisateurs de modifier le modèle de données sous-jacent. Vous utiliserez *l'état* pour ça.

Considérez l'état comme le jeu minimum de données susceptibles de changer dont votre appli doit se souvenir.  Le principe le plus important pour structurer l'état consiste à le maintenir [DRY *(Don't Repeat Yourself)*](https://fr.wikipedia.org/wiki/Ne_vous_r%C3%A9p%C3%A9tez_pas) *(Ne vous répétez pas, NdT)*.  Déterminez la plus petite représentation possible de l'état dont votre application a besoin, et calculez tout le reste à la volée. Par exemple, si vous construisez une liste d'achats, vous pouvez en stocker les éléments comme un tableau dans l'état. Si vous avez aussi besoin d'afficher le nombre d'éléments du panier, ne stockez pas ce nombre dans une autre valeur d'état : lisez plutôt la longueur du tableau.

Réfléchissez maintenant à toutes les données dans cette application d'exemple :

1. La liste originale des produits
2. Le texte de recherche saisi par l'utilisateur
3. L'état de la case à cocher
4. La liste filtrée des produits

Qu'est-ce qui constitue de l'état là-dedans ? Identifiez ce qui n'en est pas :

- Est-ce que ça **reste inchangé** au fil du temps ? Si oui, ce n'est pas de l'état.
- Est-ce que c'est **passé depuis un parent** *via* les props ? Si oui, ce n'est pas de l'état.
- **Pouvez-vous le calculer** sur base d'états ou props existants de votre composant ? Si oui, ce n'est *clairement* pas de l'état !

Ce qui reste est sans doute de l'état.

Refaisons ça pour chaque donnée :

1. La liste originale des produits nous est **passée dans les props, donc ce n'est pas de l'état**.
2. Le texte de la recherche semble être de l'état car il change au fil du temps et ne peut être calculé sur aucune autre base.
3. L'état de la case à cocher semble être de l'état car il change au fil du temps et ne peut etre calculé sur aucune autre base.
4. La liste filtrée des produits **n'est pas de l'état car elle peut être calculée** en prenant la liste originale des produits pour la filtrer selon le texte de la rechercher et l'état de la case à cocher.

Au bout du compte, seuls le texte de la recherche et l'état de la case à cocher sont de l'état ! Bien joué !

<DeepDive>

#### Props vs. état {/*props-vs-state*/}

React propose deux types de données de « modèle » : les props et l'état. Ces deux types diffèrent de façon drastique :

- [Les **props** sont comme des arguments que vous passez](/learn/passing-props-to-a-component) à une fonction.  Elles permettent au composant parent de passer des données à un composant enfant et de personnaliser ainsi son apparence.  Par exemple, un `Form` pourrait passer une prop `color` à un `Button`.
- [L'**état** est comme la mémoire du composant](/learn/state-a-components-memory). Il permet au composant de garder trace de certaines informations et de les modifier en réaction à des interactions.  Par exemple, un `Button` pourrait vouloir garder trace de son état `isHovered`.

Les props et l'état sont très différents, mais ils collaborent.  Un composant parent conservera souvent des informations dans son état (pour pouvoir les faire évoluer) qu'il va **passer** à ses composants enfants *via* leurs props.  Si la différence vous semble encore un peu floue après cette première lecture, ne vous en faites pas.  Bien la saisir nécessite un peu de pratique !

</DeepDive>

## Étape 4 : identifier où l'état devrait vivre {/*step-4-identify-where-your-state-should-live*/}

Après avoir identifié les données d'état minimales de votre appli, vous allez devoir identifier quel composant est responsable de faire évoluer cet état, c'est-à-dire quel composant *possède* l'état.  Souvenez-vous : React utilise un flux de données unidirectionnel, où les données descendent le long de la hiérarchie des composants, des parents vers les enfants.  Il n'est pas toujours immédiatement évident de savoir quel composant devrait posséder quel état.  C'est difficile si ce concept est nouveau pour vous, mais vous pouvez trouver la réponse en utilisant les étapes qui suivent !

Pour chaque élément d'état de votre application :

1. Identifiez *chaque* composant qui affiche quelque chose sur base de cet état.
2. Trouvez leur plus proche ancêtre commun : un composant qui est au-dessus d'eux tous dans l'aborescence.
3. Décidez où l'état devrait vivre :
    1. Le plus souvent, vous pourrez mettre l'état directement dans leur ancêtre commun.
    2. Vous pouvez aussi le mettre dans un composant au-dessus de leur ancêtre commun.
    3. Si vous ne trouvez aucun composant dans lequel il semble logique de placer l'état, créez un nouveau composant spécifiquement pour contenir l'état, et insérez-le dans l'arborescence juste au-dessus de leur ancêtre commun.

Lors de l'étape précédente, vous avez trouvé deux éléments d'état pour cette application : le texte de la recherche et l'état de la case à cocher.  Dans notre exemple, ils apparaissent toujours ensemble, de sorte qu'il semble logique de les placer au même endroit.

Déroulons notre stratégie pour eux :

1. **Identifier les composants qui utilisent l'état** :
    - `ProductTable` a besoin de filtrer la liste des produits sur base de cet état (texte de la recherche et état de la case à cocher).
    - `SearchBar` a besoin d'afficher cet état (texte de la recherche et état de la case à cocher).
2. **Trouver leur ancêtre commun** : le plus proche ancêtre commun à ces deux composants est `FilterableProductTable`.
3. **Décider où l'état devrait vivre** : nous stockerons le texte de la recherche et l'état de la case à cocher dans `FilterableProductTable`.

Ainsi, les valeurs d'état vivront dans `FilterableProductTable`.

Ajoutez l'état au composant à l'aide du [Hook `useState()`](/reference/react/useState). Les Hooks sont des fonctions spéciales qui vous permettent de « vous accrocher » à React. Ajoutez deux variables d'état à la racine de `FilterableProductTable` et donnez-leur des valeurs initiales :

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
```

Ensuite, passez `filterText` et `inStockOnly` à `ProductTable` et `SearchBar` *via* des props :

```js
<div>
  <SearchBar
    filterText={filterText}
    inStockOnly={inStockOnly} />
  <ProductTable
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

Vous pouvez commencer à percevoir la façon dont votre application va se comporter.  Changez la valeur initiale de `filterText` en passant de `useState('')` à `useState('fruit')` dans le bac à sable ci-dessous. Vous verrez aussi bien le texte de la recherche que le tableau se mettre à jour :

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Prix</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Recherche..."/>
      <label>
        <input
          type="checkbox"
          checked={inStockOnly} />
        {' '}
        N’afficher que les produits en stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  { category: "Fruits", price: "1 €", stocked: true, name: "Pomme" },
  { category: "Fruits", price: "1 €", stocked: true, name: "Fruit du dragon" },
  { category: "Fruits", price: "2 €", stocked: false, name: "Fruit de la passion" },
  { category: "Légumes", price: "2 €", stocked: true, name: "Épinard" },
  { category: "Légumes", price: "4 €", stocked: false, name: "Citrouille" },
  { category: "Légumes", price: "1 €", stocked: true, name: "Petits pois" }
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Remarquez que la saisie dans le formulaire ne marche pas encore.  On voit une erreur dans la console du bac à sable qui nous explique pourquoi :

<ConsoleBlock level="error">

You provided a \`value\` prop to a form field without an \`onChange\` handler. This will render a read-only field. […]

</ConsoleBlock>

*(« Vous avez fourni une prop `value` au champ de formulaire sans gestionnaire `onChange`.  Le champ sera placé en lecture seule. », NdT)*

Dans le bac à sable ci-dessus, `ProductTable` et `SearchBar` lisent les props `filterText` et `inStockOnly` pour afficher le tableau, le champ de saisie, et la case à cocher. Par exemple, voici comment `SearchBar` fournit la valeur du champ :

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Recherche..."/>
```

Cependant, vous n'avez pas encore ajouté de code pour réagir aux actions de l'utilisateur, comme la saisie.  Ce sera notre dernière étape.

## Étape 5 : ajouter un flux de données inverse {/*step-5-add-inverse-data-flow*/}

Pour le moment, votre appli s'affiche correctement avec les props et l'état qui circulent le long de son arborescence.  Mais pour modifier l'état suite à des saisies utilisateur, vous allez devoir permettre un flux de données dans l'autre sens : les composants de formulaire enfouis dans l'arbre vont avoir besoin de mettre à jour l'état de `FilterableProductTable`.

React impose que ce flux de données soit explicite, ce qui nécessite un peu plus de code qu'avec des liaisons de données bidirectionnelles.  Si vous essayez de saisir quelque chose dans la recherche, ou de cocher la case dans l'exemple ci-dessus, vous verrez que React ignore vos saisies. C'est voulu. En écrivant `<input value={filterText} />`, vous avez calé la prop `value` de l'`input` pour qu'elle reflète toujours l'état `filterText` passé depuis `FilterableProductTable`. Puisque l'état `filterText` n'est jamais modifié, le champ ne change jamais de valeur.

Vous souhaitez que chaque fois que l'utilisateur modifie les champs du formulaire, l'état soit mis à jour pour refléter ces changements. L'état appartient à `FilterableProductTable`, de sorte que seul ce composant peut appeler `setFilterText` et `setInStockOnly`. Pour permettre à `SearchBar` de mettre à jour l'état de `FilterableProductTable`, vous allez devoir passer des fonctions à `SearchBar` :

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

Au sein de `SearchBar`, ajoutez des gestionnaires d'événements `onChange` à vos champs et utilisez-les pour modifier l'état du parent :

```js {4,5,13,19}
function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Recherche..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
```

À présent votre application fonctionne complètement !

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Prix</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText} placeholder="Recherche..."
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        N’afficher que les produits en stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  { category: "Fruits", price: "1 €", stocked: true, name: "Pomme" },
  { category: "Fruits", price: "1 €", stocked: true, name: "Fruit du dragon" },
  { category: "Fruits", price: "2 €", stocked: false, name: "Fruit de la passion" },
  { category: "Légumes", price: "2 €", stocked: true, name: "Épinard" },
  { category: "Légumes", price: "4 €", stocked: false, name: "Citrouille" },
  { category: "Légumes", price: "1 €", stocked: true, name: "Petits pois" }
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Vous pourrez apprendre tout ce qu'il y a à savoir sur la gestion des événements et la mise à jour de l'état dans la section [Ajouter de l'interactivité](/learn/adding-interactivity).

## Et maintenant ? {/*where-to-go-from-here*/}

C'était une introduction très rapide sur la façon de penser lorsqu'on construit des composants et applications avec React. Vous pouvez  [démarrer un projet React](/learn/installation) dès maintenant ou [explorer plus en détails](/learn/describing-the-ui) toutes les syntaxes utilisées dans ce tutoriel.
