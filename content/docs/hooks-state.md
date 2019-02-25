---
id: hooks-state
title: Utiliser le Hook State
permalink: docs/hooks-state.html
next: hooks-effect.html
prev: hooks-overview.html
---

Les *Hooks* sont la grande nouveauté de React 16.8. Ils permettent d'utiliser l'état et d'autres fonctionnalités React sans avoir à écrire une classe.

La [page précédente](/docs/hooks-intro.html) introduit les Hooks avec cet exemple :

```js{4-5}
import React, { useState } from 'react';

function Example() {
  // Déclare une nouvelle variable d'état, que l'on va appeler « count »
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Vous avez cliqué {count} fois</p>
      <button onClick={() => setCount(count + 1)}>
        Cliquez moi
      </button>
    </div>
  );
}
```

Comparons ce code avec un exemple équivalent utilisant une classe pour commencer à comprendre comment fonctionnent les Hooks.

## Exemple équivalent avec une classe {#equivalent-class-example}

Si vous avez déjà utilisé les classes en React, ce code devrait vous être familier :

```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>Vous avez cliqué {this.state.count} fois</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Cliquez moi
        </button>
      </div>
    );
  }
}
```

L'état vaut d'abord `{ count: 0 }`, et nous incrémenterons `state.count` en appelant `this.setState()` lorsque l'utilisateur cliquera sur le bouton. Dans la suite de cette page, nous réutiliserons des extraits de cette classe.

>Remarque :
>
>Vous vous demandez peut-être pourquoi nous utilisons un compteur plutôt qu'un exemple plus réaliste. Ça nous permet tout simplement de nous concentrer sur l'API pendant que nous faisons nos premiers pas avec les Hooks.

## Hooks et fonctions composants {#hooks-and-function-components}

Pour rappel, les fonctions composants dans React peuvent ressembler à ceci :

```js
const Example = (props) => {
  // Vous pouvez utiliser des Hooks ici !
  return <div />;
}
```

ou cela :

```js
function Example(props) {
  // Vous pouvez utiliser des Hooks ici !
  return <div />;
}
```

Vous les connaissiez peut-être sous le nom de « composants sans état ». Comme nous allons maintenant introduire la possibilité d'utiliser l'état React avec ces composants, nous préférerons utiliser le terme « fonctions composants ».

Les Hooks **ne fonctionnent pas** dans les classes. Mais vous pouvez les utiliser pour éviter d'écrire des classes.

## Un Hook, qu'est-ce que c'est ? {#whats-a-hook}

Pour notre nouvel exemple, commençons par importer le Hook `useState` de React :

```js{1}
import React, { useState } from 'react';

function Example() {
  // ...
}
```

**Qu'est-ce qu'un Hook ?** Un Hook est une fonction qui permet de se « brancher » (*”hook into“ en anglais*, NdT) à des fonctionnalités React. Par exemple, `useState` est un Hook qui permet d'ajouter l'état local React à des fonctions composants. Nous en apprendrons plus sur les Hooks par la suite.

**Quand utiliser un Hook ?** Auparavant, si vous écriviez une fonction composant et que vous réalisiez que vous aviez besoin d'un state à l'intérieur, il fallait le convertir en classe. Maintenant, vous pouvez utiliser un Hook à l'intérieur de votre fonction composant. Et c'est justement ce que nous allons faire !

>Remarque :
>
>Des règles spécifiques existent pour savoir quand utiliser ou ne pas utiliser les Hooks dans un composant. Nous les découvrirons dans les [Règles des Hooks](/docs/hooks-rules.html).

## Déclarer une variable d'état {#declaring-a-state-variable}

Dans une classe, on initialise le state `count` à `0` en initialisant `this.state` à `{ count : 0 }` dans le constructeur :

```js{4-6}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

Dans une fonction composant, nous ne pouvons pas assigner ou lire `this.state` puisqu'il n'y a pas de `this`. Au lieu de ça, nous appellerons directement le Hook `useState` dans notre composant :

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Déclare une nouvelle variable d'état, que nous appellerons « count »
  const [count, setCount] = useState(0);
```

**Appeler `useState`, qu'est-ce que ça fait ?** Cela déclare une « variable d'état ». Notre variable est appelée `count` mais nous aurions pu l'appeler n'importe comment, par exemple `banane`. C'est un moyen de « préserver » des valeurs entre différents appels de fonctions. `useState` est un moyen d'utiliser exactement les mêmes possibilités qu'offrent `this.state` dans une classe. Normalement, les variables « disparaissent » quand la fonction s'achève mais les variables d'état sont préservées par React.

**Qu'est-ce que l'on passe à `useState` comme argument ?** Le seul argument à passer au Hook `useState()` est l'état initial. Contrairement à son usage dans les classes, l'état n'est pas obligatoirement un objet. Il peut être un nombre ou une chaîne de caractères si c'est tout ce dont on a besoin. Dans notre exemple, nous voulons simplement un nombre traduisant le nombre de fois qu'un utilisateur a cliqué sur un bouton, nous passerons donc `0` comme état initial pour notre variable. (Si nous voulions stocker deux valeurs différentes dans l'état, nous aurions appelé `useState()` deux fois.)

**Qu'est-ce que renvoie `useState` ?** Elle renvoie une paire de valeurs : l'état actuel et une fonction pour le modifier. C'est pourquoi nous écrivons `const [count, setCount] = useState()`. C'est semblable au `this.state.count` et `this.setState` dans une classe mais ici nous les récupérons en même temps. Si vous n'êtes pas familier avec la syntaxe que nous avons utilisé, nous y reviendrons [plus tard sur cette page](/docs/hooks-state.html#tip-what-do-square-brackets-mean).

Maintenant que nous savons ce que fait le Hook `useState`, notre exemple devrait commencer à être plus clair :

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Déclare une nouvelle variable d'état, que nous appellerons « count »
  const [count, setCount] = useState(0);
```

Nous déclarons une variable appelée `count`, et l'initialisons à `0`. React se rappellera sa valeur entre deux re-renders et fournira la plus récente à notre fonction. Si nous voulons modifier la valeur de `count`, nous pouvons utiliser `setCount`.

>Remarque :
>
>Vous vous demandez peut-être pourquoi `useState` n'est pas plutôt appelée `createState` ?
>
>En fait, « create » ne serait pas correct puisque ce n'est que lorsque notre composant est rendu pour la première fois que l'état est créé. Dans les rendus suivants, `useState` nous renvoie l'état actuel. Autrement, ce ne serait pas un état du tout ! Il y a aussi une autre raison pour laquelle les noms des Hooks commencent *toujours* par `use`. Nous découvrirons quelle est cette raison plus tard dans les [Règles des Hooks](/docs/hooks-rules.html).

## Lire l'état {#reading-state}

Quand nous voulons afficher la valeur actuelle de `count` dans une classe, nous récupérons la valeur de `this.state.count` :

```js
  <p>Vous avez cliqué {this.state.count} fois</p>
```

Dans une fonction, nous pouvons directement utiliser `count` :


```js
  <p>Vous avez cliqué {count} fois</p>
```

## Mettre à jour l'état {#updating-state}

Dans une classe, nous devons appeler `this.setState()` pour mettre à jour l'état `count` :

```js{1}
  <button onClick={() => this.setState({ count: this.state.count + 1 })}>
    Cliquez moi
  </button>
```

Dans une fonction, nous récupérons directement `setCount` et `count` comme variables, nous n'avons donc pas besoin d'utiliser `this` :

```js{1}
  <button onClick={() => setCount(count + 1)}>
    Cliquez moi
  </button>
```

## Résumé {#recap}

Il est maintenant temps de **récapituler ce que nous avons appris ligne par ligne** et vérifier que nous avons bien compris.

<!--
  I'm not proud of this line markup. Please somebody fix this.
  But if GitHub got away with it for years we can cheat.
-->
```js{1,4,9}
 1:  import React, { useState } from 'react';
 2:
 3:  function Example() {
 4:    const [count, setCount] = useState(0);
 5:
 6:    return (
 7:      <div>
 8:        <p>Vous avez cliqué {count} fois</p>
 9:        <button onClick={() => setCount(count + 1)}>
10:         Cliquez moi
11:        </button>
12:      </div>
13:    );
14:  }
```

* **Ligne 1 :** Nous importons le Hook `useState` de React. Il nous permet d'utiliser un état local dans une fonction composant. 
* **Ligne 4 :** Dans le composant `Example`, nous déclarons une nouvelle variable d'état en appelant le Hook `useState`. Il renvoie une paire de valeurs que nous pouvons nommer à notre guise. Ici, nous appelons notre variable `count` puisqu'elle contient le nombre de clics sur le bouton. Nous l'initialisons à zéro en passant `0` comme seul argument à `useState`. Le second élément renvoyé est une fonction. Il nous permet de modifier la variable `count`, nous l'appellerons donc `setCount`.
* **Ligne 9 :** Quand l'utilisateur clique, nous appelons `setCount` avec une nouvelle valeur. React refera le rendu du composant `Example` et lui passera la nouvelle valeur de `count`.

C'est peut-être beaucoup à digérer d'un coup. Ne vous pressez pas ! Si vous vous sentez un peu perdu·e·, jetez un nouveau coup d'œil au code ci-dessus et essayez de le relire en entier. Promis, une fois que vous essaierez « d'oublier » la manière dont fonctionne l'état dans les classes, et que vous regarderez ce code avec un regard neuf, ça sera plus clair.

### Astuce : Que signifient les crochets ? {#tip-what-do-square-brackets-mean}

Vous avez peut-être remarqué les crochets que nous utilisons lorsque nous déclarons une variable d'état :

```js
  const [count, setCount] = useState(0);
```

Les noms utilisés dans la partie gauche ne font pas partie de l'API React. Vous pouvez nommer vos variables d'état comme bon vous chante :

```js
  const [fruit, setFruit] = useState('banane');
```

Cette syntaxe Javascript est appelée [« déstructuration positionnelle »](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Affecter_par_d%C3%A9composition#D%C3%A9composition_d'un_tableau). Cela signifie que nous sommes en train de créer deux nouvelles variables `fruit` et `setFruit`, où la première valeur renvoyée par `useState` est affectée à `fruit`, et la deuxième à `setFruit`. C'est équivalent au code ci-dessous :

```js
  var fruitStateVariable = useState('banana'); // Renvoie une paire
  var fruit = fruitStateVariable[0]; // Premier élément dans une paire
  var setFruit = fruitStateVariable[1]; // Deuxième élément dans une paire
```

Quand nous déclarons une variable d'état avec `useState`, cela renvoie une paire (un tableau avec deux éléments). La première valeur de la paire est la valeur actuelle, et la deuxième est une fonction qui permet de la modifier. Utiliser `[0]` et `[1]` pour y accéder est un peu déconcertant puisqu'ils ont un sens spécifique. C'est pourquoi nous préférons plutôt utiliser la déstructuration positionnelle.

>Remarque :
>
>Vous vous demandez peut-être comment React sait à quel composant `useState` fait référence étant donné que nous ne lui passons plus rien de similaire à `this`. Nous répondrons à [cette question](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components) ainsi qu'à plein d'autres dans la section FAQ.

### Astuce : Utiliser plusieurs variables d'état {#tip-using-multiple-state-variables}

Déclarer des variables d'état comme une paire de `[quelquechose, setQuelquechose]` est également pratique parce que cela nous permet de donner des noms *différents* à des variables d'état différentes si nous voulons en utiliser plus d'une :

```js
function ExampleWithManyStates() {
  // Déclarer plusieurs variables d'état !
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banane');
  const [todos, setTodos] = useState([{ text: 'Apprendre les Hooks' }]);
```

Dans le composant ci-dessus, nous avons `age`, `fruit`, et `todos` comme variables locales, et nous pouvons les modifier indépendamment les unes des autres :

```js
  function handleOrangeClick() {
    // Similaire à this.setState({ fruit: 'orange' })
    setFruit('orange');
  }
```

Utiliser plusieurs variables d'état **n'est pas obligatoire**. Les variables d'état peuvent tout à fait contenir des objets et des tableaux, vous pouvez donc toujours regrouper des données ensemble. Cependant, lorsque l'on modifie une variable d'état sa valeur est *remplacée* et non mergée, ce qui n'est pas le cas de `this.setState` dans les classes.

Découvrez plus de raisons de préférer séparer vos variables d'état [dans la FAQ](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables).

## Prochaines étapes {#next-steps}

Dans cet article, vous avez appris à utiliser un des Hooks fournis par React, appelé `useState`. Nous nous y référons parfois par le terme « Hook State ». Il nous permet d'ajouter un état local dans une fonction composant React–ce qui est une première !

Nous en savons également un peu plus sur ce que sont les Hooks. Les Hooks sont des fonctions qui nous permettent de nous « brancher » à des fonctionnalités React depuis des fonctions composants. Leur noms commencent toujours par `use`, et il y a encore beaucoup de Hooks que nous n'avons pas encore vus !

**Continuons maintenant en [découvrant le prochain Hook : `useEffect`.](/docs/hooks-effect.html)** Il vous permet de déclencher des effets de bord dans les composants, et est similaire aux méthodes de cycles de vie dans les classes.
