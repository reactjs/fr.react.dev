---
id: jsx-in-depth
title: JSX dans le détail
permalink: docs/jsx-in-depth.html
redirect_from:
  - "docs/jsx-spread.html"
  - "docs/jsx-gotchas.html"
  - "tips/if-else-in-JSX.html"
  - "tips/self-closing-tag.html"
  - "tips/maximum-number-of-jsx-root-nodes.html"
  - "tips/children-props-type.html"
  - "docs/jsx-in-depth-zh-CN.html"
  - "docs/jsx-in-depth-ko-KR.html"
---

Fondamentalement, JSX fournit juste du sucre syntaxique pour la fonction `React.createElement(component, props, ...children)`.

Le code JSX :

```js
<MyButton color="blue" shadowSize={2}>
  Cliquez ici
</MyButton>
```

est compilé en :

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Cliquez ici'
)
```

Il est aussi possible d'utiliser la balise auto-fermante si il n'y a pas d'enfants. Donc :

```js
<div className="sidebar" />
```

est compilé en :

```js
React.createElement(
  'div',
  {className: 'sidebar'},
  null
)
```
Si vous souhaitez voir comment certains éléments JSX spécifiques sont compilés en JavaScript, vous pouvez utiliser [le compilateur Babel en ligne](babel://jsx-simple-example).

## Spécifier le type d'un élément React {#specifying-the-react-element-type}

La première partie d'une balise JSX détermine le type de l'élément React en question.

Les types commençant par une lettre majuscule indiquent que la balise JSX fait référence à un composant React. Ces balises sont compilées en références directes à la variable nommée, donc si vous utilisez l'expression JSX  `<Foo />`, l’identifiant `Foo` doit être présent dans la portée.

### React doit être présent dans la portée {#react-must-be-in-scope}

Étant donné que JSX se compile en appels à `React.createElement`, la bibliothèque `React` doit aussi être présente dans la portée de votre code JSX.

Par exemple, les deux imports sont nécessaires dans le code ci-dessous même si `React` et `CustomButton` ne sont pas directement référencés depuis JavaScript :

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

Si vous n'utilisez pas un *bundler* JavaScript mais que vous chargez React à partir d'une balise `<script>`, il est déjà dans la portée en tant que variable globale `React`.

### Utiliser la notation à points pour un type JSX {#using-dot-notation-for-jsx-type}

Vous pouvez également référencer un composant React en utilisant la notation à points dans JSX. C’est pratique si vous avez un seul module qui exporte de nombreux composants React. Par exemple si `MyComponents.DatePicker` est un composant, vous pouvez directement l'utiliser dans JSX comme ceci :

```js{10}
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imaginez un sélecteur de dates {props.color} ici.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### Les composants utilisateurs doivent commencer par une majuscule {#user-defined-components-must-be-capitalized}

Quand un élément commence par une lettre minuscule il fait référence à un composant natif tel que `<div>` ou `<span>`, ce qui donne une chaîne de caractères `'div'` ou `'span'` passée à `React.createElement`. Les types qui commencent par une lettre majuscule comme `<Foo />` sont compilés en `React.createElement(Foo)` et correspondent à un composant défini ou importé dans votre fichier JavaScript.

Nous recommandons de nommer vos composants avec une initiale majuscule. Si vous avez un composant qui démarre avec une lettre minuscule, affectez-le à une variable avec une initiale majuscule avant de l'utiliser dans votre JSX.

Par exemple, ce code ne s'exécutera pas comme prévu :

```js{3,4,10,11}
import React from 'react';

// Faux ! C’est un composant, il devrait commencer par une lettre majuscule :
function hello(props) {
  // Correct ! Cette utilisation de <div> fonctionne car div est une balise HTML valide :
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Faux ! React pense que <hello /> est une balise HTML car il commence pas par une majuscule :
  return <hello toWhat="World" />;
}
```

Pour corriger ça, nous allons renommer `hello` en `Hello` et utiliser `<Hello />` lorsqu'on y fait référence :

```js{3,4,10,11}
import React from 'react';

// Correct ! C’est un composant, il doit avoir une initiale majuscule :
function Hello(props) {
  // Correct ! Cette utilisation de <div> fonctionne car div est une balise HTML valide :
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Correct ! React sait que <Hello /> est un composant car il commence par une majuscule.
  return <Hello toWhat="World" />;
}
```

### Choix du type au moment de l'exécution {#choosing-the-type-at-runtime}

Vous ne pouvez pas utiliser une expression générale pour le type d'un élément React. Si vous voulez utiliser une expression pour définir le type d'un élément, affectez-la d'abord à une variable dont l'initiale est majuscule. Ça arrive en général lorsque vous voulez afficher un composant différent en fonction d’une prop :

```js{10,11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Faux ! Un type JSX ne peut pas être une expression.
  return <components[props.storyType] story={props.story} />;
}
```

Pour corriger ça, nous allons d'abord affecter le type à une variable dont l’identifiant commence par une majuscule :

```js{10-12}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Correct ! Un type JSX peut être une variable commençant par une majuscule.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## Les props en JSX {#props-in-jsx}

Il y a différents moyens de définir les props en JSX.

### Les expressions JavaScript comme props {#javascript-expressions-as-props}

Vous pouvez passer n'importe quelle expression JavaScript comme prop, en l'entourant avec des accolades `{}`. Par exemple, dans ce code JSX :

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

Pour `MyComponent`, la valeur de `props.foo` sera `10` parce que l'expression `1 + 2 + 3 + 4` est calculée.

Les instructions `if` et les boucles `for` ne sont pas des expressions en JavaScript, donc elle ne peuvent pas être directement utilisées en JSX. Au lieu de ça, vous pouvez les mettre dans le code environnant. Par exemple :

```js{3-7}
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>pair</strong>;
  } else {
    description = <i>impair</i>;
  }
  return <div>{props.number} est un nombre {description}</div>;
}
```
Vous pouvez en apprendre davantage sur les [conditions](/docs/conditional-rendering.html) et les [boucles](/docs/lists-and-keys.html) au sein des sections correspondantes de la documentation.

### Les littéraux chaînes {#string-literals}

Vous pouvez passer un littéral chaîne comme prop. Les deux expressions JSX ci-dessous sont équivalentes :

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

Quand vous passez un littéral chaîne, sa valeur subit un échappement HTML inverse. Ces deux expressions JSX sont donc équivalentes :

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

Ce comportement n'est en général pas pertinent (au sens où vous n’avez pas à vous en soucier particulièrement), ce n'est mentionné ici que par souci d'exhaustivité.

### Les props valent `true` par défaut {#props-default-to-true}

Si vous n'affectez aucune valeur à une prop, sa valeur par défaut sera `true`. Ces deux expressions JSX sont équivalentes :

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

En général, nous déconseillons cette syntaxe car ça peut être confondu avec [la notation ES6 de propriétés concises](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Opérateurs/Initialisateur_objet) `{foo}` qui est l'abréviation de `{foo: foo}` et non de `{foo: true}`. Ce comportement existe uniquement par souci de cohérence avec HTML.

### Décomposition des props {#spread-attributes}

Si vous avez déjà un objet `props` et souhaitez l'utiliser en JSX, vous pouvez utiliser l'opérateur de décomposition *(spread operator, NdT)* `...` pour passer l'ensemble de l'objet props. Ces deux composants sont équivalents :

```js{7}
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

Vous pouvez également choisir certaines props que votre composant utilisera en passant toutes les autres props avec l'opérateur de *rest*.

```js{2}
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("cliqué !")}>
        Bonjour monde !
      </Button>
    </div>
  );
};
```

Dans l'exemple ci-dessus, la prop `kind` est extraite pour le composant principal et *n'est pas* passée à l'élément `<button>` du DOM.
Toutes les autres props sont passées via l'objet `...other`, ce qui rend ce composant très flexible. Vous pouvez voir qu’il passe les props `onClick` et `children`.

La décomposition des props peut être utile, mais elle permet aussi de passer trop facilement des props inutiles aux composants, ou de passer des attributs HTML invalides au DOM. Nous vous conseillons d'utiliser cette syntaxe avec parcimonie.

## Les éléments enfants en JSX {#children-in-jsx}

Dans les expressions JSX qui comportent une balise ouvrante et une balise fermante, le contenu entre ces deux balises est passé comme une prop spéciale : `props.children`. Il existe plusieurs moyens pour passer ces enfants :

### Littéraux chaînes {#string-literals-1}

Vous pouvez mettre une chaîne de caractères entre une balise ouvrante et une fermante et `props.children` sera juste cette chaîne de caractères. C’est utile pour la plupart des éléments HTML natifs. Par exemple :

```js
<MyComponent>Bonjour monde !</MyComponent>
```

C’est du JSX valide, et `props.children` dans `MyComponent` sera simplement la chaîne de caractères `"Bonjour monde !"`. Le HTML subit un échappement inverse, donc vous pouvez généralement écrire du JSX de la même façon que vous écrivez du HTML, c'est-à-dire :

```html
<div>Ce contenu est valide en HTML &amp; en JSX.</div>
```

JSX supprime les espaces en début et en fin de ligne. Il supprime également les lignes vides. Les sauts de lignes adjacents aux balises sont retirés ; les sauts de lignes apparaissant au sein de littéraux chaînes sont ramenés à une seule espace. Du coup, tous les codes ci-dessous donnent le même résultat :

```js
<div>Bonjour monde</div>

<div>
  Bonjour monde
</div>

<div>
  Bonjour
  monde
</div>

<div>

  Bonjour monde
</div>
```

### Éléments JSX enfants {#jsx-children}

Vous pouvez fournir des éléments JSX supplémentaires en tant qu'enfants. C’est utile pour afficher des composants imbriqués :

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

Vous pouvez mélanger différents types d'enfants, comme par exemple des littéraux chaînes et des éléments JSX. Là encore, JSX est similaire à HTML, de sorte que le code suivant est valide tant en HTML qu'en JSX :

```html
<div>
  Voici une liste :
  <ul>
    <li>Élément 1</li>
    <li>Élément 2</li>
  </ul>
</div>
```

Un composant React peut aussi renvoyer un tableau d'éléments :

```js
render() {
  // Pas besoin d’enrober les éléments de la liste dans un élément supplémentaire !
  return [
    // N'oubliez pas les "keys" :)
    <li key="A">Premier élément</li>,
    <li key="B">Deuxième élément</li>,
    <li key="C">Troisième élément</li>,
  ];
}
```

### Les expressions JavaScript comme enfants {#javascript-expressions-as-children}

Vous pouvez passer n'importe quelle expression JavaScript en tant qu'enfant, en l'enrobant avec des accolades `{}`. Ainsi, ces expressions sont équivalentes :

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

C’est souvent utile pour afficher une liste d'expressions JSX de longueur quelconque. Par exemple, ce code affiche une liste HTML :

```js{2,9}
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['finir la doc', 'envoyer la pr', 'tanner Chris pour une revue'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

Les expressions JavaScript peuvent être mélangées avec d'autres types d'enfants. C‘est souvent utile en remplacement de gabarits textuels :

```js{2}
function Hello(props) {
  return <div>Bonjour {props.addressee} !</div>;
}
```

### Les fonctions comme enfants {#functions-as-children}

En temps normal, les expressions Javascript insérées dans JSX produiront une chaîne, un élément React ou une liste de ces types. Cependant, `props.children` fonctionne exactement comme n'importe quelle prop dans le sens où elle peut passer n'importe quel genre de données, pas seulement celles que React sait afficher.

Par exemple, si vous avez un composant personnalisé, vous pouvez lui faire accepter une fonction de rappel dans `props.children` :

```js{4,13}

// Appelle la fonction de rappel children à raison de numTimes fois
// afin de produire une répétition du composant
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>Ceci est l'élément {index} de la liste</div>}
    </Repeat>
  );
}
```

Les enfants passés à un composant personnalisé peuvent être n'importe quoi, du moment que ce composant les transforme en quelque chose que React peut comprendre avant le rendu. Cette utilisation n'est pas courante, mais elle fonctionne si vous voulez étendre ce dont JSX est capable.

### Les booléens ainsi que `null` et `undefined` sont ignorés {#booleans-null-and-undefined-are-ignored}

`false`, `null`, `undefined`, et `true` sont des enfants valides. Ils ne sont simplement pas exploités. Ces expressions JSX produiront toutes la même chose :

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

Ça peut être utile pour afficher des éléments React de façon conditionnelle. Ce JSX produit un composant `<Header />` uniquement si `showHeader` est à `true` :

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

Une mise en garde s'impose : certaines valeurs [*falsy*](https://developer.mozilla.org/fr/docs/Glossaire/Falsy), comme le nombre `0`, sont tout de même affichées par React. Par exemple, ce code ne se comportera pas comme vous l'espérez car il affichera `0` lorsque `props.messages` est un tableau vide :

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

Pour corriger ça, assurez-vous que l'expression avant `&&` est toujours un booléen :

```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

Réciproquement, si vous voulez qu'une valeur comme `false`, `true`, `null`, ou `undefined` soit bien affichée, vous devez d'abord la [convertir en chaîne](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String#Conversion_en_String) :

```js{2}
<div>
  Ma variable Javascript est {String(myVariable)}.
</div>
```
