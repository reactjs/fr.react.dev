---
title: createElement
---

<Intro>

`createElement` vous permet de créer un élément React. Elle est utile si vous ne voulez pas (ou ne *pouvez* pas) écrire du [JSX](/learn/writing-markup-with-jsx).

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

Appelez `createElement` pour créer un élément React avec un `type`, des `props` et des `children`.

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Bonjour'
  );
}
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `type` : l'argument `type` doit être un type de composant React valide. Par exemple, ce pourrait être un nom de balise (tel que `'div'` ou `'span'`) ou un composant React (une fonction, une classe ou un composant spécial comme un [`Fragment`](/reference/react/Fragment)).

* `props` : l'argument `props` doit être soit un objet, soit `null`. Si vous passez `null`, il sera traité comme un objet vide. React créera l'élément avec des props correspondant aux `props` que vous avez passées. Remarquez que les propriétés `ref` et `key` de votre objet `props` sont spéciales et ne seront *pas* disponibles en tant que `element.props.ref` et `element.props.key` sur l'`element` renvoyé. Elles seront exposées en tant que `element.ref` et `element.key`.

* `...children` **optionnels** : une série quelconque de nœuds enfants. Il peut s'agir de n'importe quels nœuds React, y compris des éléments React, des chaînes de caractères, des nombres, des [portails](/reference/react-dom/createPortal), des nœuds vides (`null`, `undefined`, `true` et `false`), et des tableaux de nœuds React.

#### Valeur renvoyée {/*returns*/}

`createElement` renvoie un objet élément React avec quelques propriétés :

* `type` : le `type` que vous avez passé.
* `props` : les `props` que vous avez passées, sauf `ref` et `key`. Si le `type` est un composant doté de la propriété historique `type.defaultProps`, alors toute prop manquante ou `undefined` dans `props` prendra sa valeur depuis `type.defaultProps`.
* `ref` : la `ref` que vous avez passée. Considérée `null` si manquante.
* `key` : la `key` que vous avez passée, convertie en chaîne de caractères. Considérée `null` si manquante.

En général, vous renverrez l'élément depuis votre composant, ou en ferez l'enfant d'un autre élément. Même si vous pourriez lire les propriétés de l'élément, il vaut mieux traiter tout objet élément comme une boîte noire après sa création, et vous contenter de l'afficher.

#### Limitations {/*caveats*/}

* Vous devez **traiter les éléments React et leurs props comme [immuables](https://fr.wikipedia.org/wiki/Objet_immuable)** et ne jamais changer leur contenu après création. En développement, React [gèlera](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) l'élément renvoyé, ainsi que sa propriété `props` (à un niveau de profondeur), pour garantir cet aspect.

* Quand vous utilisez JSX, **vous devez faire démarrer le nom de la balise par une lettre majuscule afin d'afficher votre propre composant**.  En d'autres termes, `<Something />` est équivalent à `createElement(Something)`, mais `<something />` (minuscules) est équivalent à `createElement('something')` (remarquez qu'il s'agit ici d'une chaîne de caractères, qui sera donc traitée comme une balise HTML native).

* Vous ne devriez **passer les enfants comme arguments multiples à `createElement` que s'ils sont statiquement connus**, comme par exemple `createElement('h1', {}, child1, child2, child3)`. Si vos enfants sont dynamiques, passez leur tableau entier comme troisième argument : `createElement('ul', {}, listItems)`. Ça garantit que React vous [avertira en cas de `key` manquantes](/learn/rendering-lists#keeping-list-items-in-order-with-key) lors de listes dynamiques.  C'est inutile pour les listes statiques puisque leur ordre et leur taille ne changent jamais.

---

## Utilisation {/*usage*/}

### Créer un élément sans JSX {/*creating-an-element-without-jsx*/}

Si vous n'aimez pas [JSX](/learn/writing-markup-with-jsx) ou ne pouvez pas l'utiliser dans votre projet, vous pouvez utiliser `createElement` comme alternative.

Pour créer un élément sans JSX, appelez `createElement` avec un <CodeStep step={1}>type</CodeStep>, des <CodeStep step={2}>props</CodeStep> et des <CodeStep step={3}>enfants</CodeStep> :

```js [[1, 5, "'h1'"], [2, 6, "{ className: 'greeting' }"], [3, 7, "'Bonjour ',"], [3, 8, "createElement('i', null, name),"], [3, 9, "'. Bienvenue !'"]]
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Bonjour ',
    createElement('i', null, name),
    '. Bienvenue !'
  );
}
```

Les <CodeStep step={3}>enfants</CodeStep> sont optionnels, et vous pouvez en passer autant que vous le souhaitez (l'exemple ci-dessus a trois enfants). Ce code affichera un en-tête `<h1>` avec un message de bienvenue.  À titre de comparaison, voici le même exemple utilisant JSX :

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "Bonjour <i>{name}</i>. Bienvenue !"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Bonjour <i>{name}</i>. Bienvenue !
    </h1>
  );
}
```

Pour afficher votre propre composant React, passez une fonction telle que `Greeting` comme <CodeStep step={1}>type</CodeStep>, plutôt qu'une chaîne de caractères comme `'h1'` :

```js [[1, 2, "Greeting"], [2, 2, "{ name: 'Clara' }"]]
export default function App() {
  return createElement(Greeting, { name: 'Clara' });
}
```

En JSX, ça donnerait ceci :

```js [[1, 2, "Greeting"], [2, 2, "name=\\"Clara\\""]]
export default function App() {
  return <Greeting name="Clara" />;
}
```

Voici un exemple complet écrit avec `createElement` :

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Bonjour ',
    createElement('i', null, name),
    '. Bienvenue !'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Clara' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

Et voici le même écrit en JSX :

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Bonjour <i>{name}</i>. Bienvenue !
    </h1>
  );
}

export default function App() {
  return <Greeting name="Clara" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

Les deux styles sont acceptables, vous pouvez donc utiliser celui que vous préférez dans votre projet. L'avantage principal de JSX, comparé à `createElement`, c'est qu'il est plus facile de voir où les éléments commencent et où ils finissent.

<DeepDive>

#### Mais c'est quoi concrètement, un élément React ? {/*what-is-a-react-element-exactly*/}

Un élément est une description légère d'un bout de votre interface utilisateur. Par exemple, tant `<Greeting name="Clara" />` que `createElement(Greeting, { name: 'Clara' })` produisent un objet comme celui-ci :

```js
// Légèrement simplifié
{
  type: Greeting,
  props: {
    name: 'Clara'
  },
  key: null,
  ref: null,
}
```

**Remarquez que la seule création de l'objet ne suffit pas à afficher le composant `Greeting`, et ne crée pas non plus d'éléments DOM.**

Un élément React est plus comme une description — des instructions pour React, afin qu'il puisse plus tard afficher le composant `Greeting`. En renvoyant cet objet depuis votre composant `App`, vous indiquez à React quoi faire ensuite.

La création d'éléments a un coût quasi nul, vous n'avez donc pas besoin de l'optimiser ou de chercher activement à l'éviter.

</DeepDive>
