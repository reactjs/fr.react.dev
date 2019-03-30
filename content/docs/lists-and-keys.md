---
id: lists-and-keys
title: Listes et clés
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

Tout d'abord, voyons comment transformer des listes en JavaScript.

Dans le code suivant, on utilise la méthode [`map()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/map) pour prendre un tableau de nombres et doubler leurs valeurs. On affecte le nouveau tableau retourné par `map()` à une variable `doubled` et on l'affiche dans la console :

```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

Ce code affiche `[2, 4, 6, 8, 10]` dans la console.

Avec React, transformer un tableau en une liste d'[éléments](/docs/rendering-elements.html) est presque identique.

### Afficher plusieurs composants {#rendering-multiple-components}

On peut construire des collections d'éléments et [les inclure dans du JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) en utilisant les accolades `{}`.

Ci-dessous, on itère sur le tableau de nombres en utilisant la méthode JavaScript [`map()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/map). On retourne un élément `<li>` pour chaque entrée du tableau. Enfin, on affecte le tableau d'éléments résultant à `listItems` :

```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

On inclut tout le tableau `listItems` dans un élément `<ul>`, et [on l'affiche dans le DOM](/docs/rendering-elements.html#rendering-an-element-into-the-dom) :

```javascript{2}
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

Ce code affiche une liste à puces de nombres entre 1 et 5.

### Composant basique de liste {#basic-list-component}

Généralement, on souhaite afficher une liste au sein d’un [composant](/docs/components-and-props.html).

On peut transformer l’exemple précédent pour en faire un composant qui accepte un tableau de nombres et produit une liste d'éléments.

```javascript{3-5,7,13}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

En exécutant ce code, vous obtiendrez un avertissement disant qu'une clé devrait être fournie pour les éléments d'une liste. Une « clé » *(key, NdT)*, est un attribut spécial que vous devez inclure quand vous créez une liste d'éléments. Nous verrons pourquoi c'est important dans la prochaine section.

Assignons une `key` aux éléments de notre liste dans `numbers.map()` afin de corriger  le problème de clés manquantes.

```javascript{4}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## Les clés {#keys}

Les clés aident React à identifier quels éléments d'une liste ont changé, ont été ajoutés ou supprimés. Vous devez donner une clé à chaque élément dans un tableau afin d’apporter aux éléments une identité stable :

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

Le meilleur moyen de choisir une clé est d'utiliser quelque chose qui identifie de façon unique un élément d'une liste parmi ses voisins. Le plus souvent on utilise l'ID de notre donnée comme clé :


```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

Quand vous n'avez pas d'ID stable pour les éléments affichés, vous pouvez utiliser l'index de l'élément en dernier recours :

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // Ne faites ceci que si les éléments n'ont pas d'ID stable
  <li key={index}>
    {todo.text}
  </li>
);
```

Nous vous recommandons de ne pas utiliser l'index comme clé si l'ordre des éléments est susceptible de changer. Ça peut avoir un effet négatif sur les performances, et causer des problèmes avec l'état du composant. Vous pouvez lire l'article de Robin Pokorny pour une [explication en profondeur de l'impact négatif de l'utilisation de l'index comme clé](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318) (en anglais). Si vous choisissez de ne pas donner explicitement de clé aux éléments d'une liste, React utilisera l’index par défaut.

Si vous voulez en apprendre davantage, consultez cette [explication en profondeur de la raison pour laquelle les clés sont nécessaires](/docs/reconciliation.html#recursing-on-children).

### Extraire des composants avec des clés {#extracting-components-with-keys}

Les clés n'ont une signification que dans le contexte du tableau qui les entoure.

Par exemple, si on [extrait](/docs/components-and-props.html#extracting-components) un composant `ListItem`, on doit garder la clé sur l'élément `<ListItem />` dans le tableau, et non sur l'élément `<li>` dans le composant `ListItem` lui-même.

**Exemple : utilisation erronée des clés**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // Erroné ! Pas la peine de spécifier la clé ici :
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Erroné : la clé doit être spécifiée ici :
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

**Exemple : utilisation correcte des clés**

```javascript{2,3,9,10}
function ListItem(props) {
  // Correct ! Pas la peine de spécifier la clé ici :
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Correct ! La clé doit être spécifiée dans le tableau.
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/ZXeOGM?editors=0010)

Gardez en tête cette règle simple : chaque élément à l'intérieur d'un appel à `map()` a besoin d'une clé.

### Les clés n’ont besoin d’être uniques qu’au sein de la liste {#keys-must-only-be-unique-among-siblings}

Les clés utilisées dans un tableau doivent être uniques parmi leurs voisins. Cependant, elles n'ont pas besoin d'être globalement uniques. On peut utiliser les mêmes clés dans des tableaux différents :

```js{2,5,11,12,19,21}
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Bonjour, monde', content: 'Bienvenue sur la doc de React !'},
  {id: 2, title: 'Installation', content: 'Vous pouvez installer React depuis npm.'}
];
ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

Les clés servent d'indicateur à React mais ne sont pas passées à vos composants. Si vous avez besoin de la même valeur dans votre composant, passez-la dans une prop avec un nom différent :

```js{3,4}
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

Dans l'exemple ci-dessus, le composant `Post` peut accéder à `props.id`, mais pas à `props.key`.

### Intégrer `map()` dans du JSX {#embedding-map-in-jsx}

Dans les exemples précédents, nous déclarions séparément la variable `listItems` pour ensuite l’inclure dans le JSX :

```js{3-6}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

JSX permet [d'intégrer des expressions quelconques](/docs/introducing-jsx.html#embedding-expressions-in-jsx) entre accolades. Nous pouvons donc utiliser `map()` directement dans notre code JSX :

```js{5-8}
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

Ça rend parfois le code plus lisible, mais il faut éviter d’en abuser. Comme avec JavaScript, c'est vous qui décidez quand ça vaut le coup d'extraire l'expression dans une variable pour plus de lisibilité. Gardez en tête que si le corps de `map()` est trop profond ou trop riche, c’est sans doute le signe qu’il faudrait [extraire un composant](/docs/components-and-props.html#extracting-components).
