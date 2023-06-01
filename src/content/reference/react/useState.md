---
title: useState
---

<Intro>

`useState` est un Hook React qui vous laisse ajouter une [variable d'état](/learn/state-a-components-memory) (*state, NdT*) dans votre composant.

```js
const [state, setState] = useState(initialState);
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useState(initialState)` {/*usestate*/}

Appelez `useState` à la racine de votre composant pour déclarer une [variable d'état](/learn/state-a-components-memory).

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

La convention est de nommer les variables d'états de cette manière : `[something, setSomething]`, en utilisant la [déstructuration positionnelle](https://fr.javascript.info/destructuring-assignment).

[Voir d’autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `initialState`: La valeur initiale de votre état. Ça peut être une valeur de n'importe quel type, mais il existe un comportement spécial pour les fonctions. Cet argument est ignoré après le rendu initial.
  * Si vous passez une fonction dans votre `initialState`, elle sera traitée comme une _fonction d'initialisation_ (*initializer function, NdT*). Elle doit être pure, ne doit pas prendre d'argument, et doit retourner une valeur de n'importe quel type. React appellera votre fonction d'initialisation en initialisant le composant, et stockera sa valeur de retour dans votre état initial. [Voir un exemple ci-dessous](#avoiding-recreating-the-initial-state).

#### Valeur renvoyée {/*returns*/}

`useState` retourne un tableau avec exactement deux valeurs :

1. L'état courant. Pendant le premier rendu, il sera le même que l'`initialState` que vous avez passé en entrée.
2. La [fonction `set`](#setstate). Elle vous permet de mettre à jour l'état avec une valeur différente et de déclencher un nouveau rendu.

#### Limitations {/*caveats*/}

* `useState` est un Hook, vous ne pouvez donc l’appeler qu'uniquement **à la racine de votre composant** ou de vos propres Hooks. Vous ne pouvez pas l’appeler à l’intérieur de boucles ou de conditions. Si nécessaire, extrayez un nouveau composant et déplacez l'état dans celui-ci.
* En mode Strict, React appellera votre **fonction d'initialisation** deux fois dans le but de vous aider à [trouver les impuretés accidentelles](#my-initializer-or-updater-function-runs-twice). Ce comportement est uniquement présent en mode développement et n'affecte pas la production. Si votre fonction d'initialisation est pure (ce qui devrait être le cas), ça ne devrait pas affecter le comportement. Le résultat d'un des appels sera ignoré.

---

### Les fonctions `set`, comme `setSomething(nextState)` {/*setstate*/}

La fonction `set` retournée par `useState` permet de mettre à jour l'état avec une valeur différente et de déclencher un nouveau rendu. Vous pouvez directement passer le prochain état, ou une fonction qui le calcule à l'aide de l'état précédent :

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### Paramètres {/*setstate-parameters*/}

* `nextState`: La valeur désirée de l'état. Elle peut être une valeur de n'importe quel type, mais il existe un comportement spécial pour les fonctions.
  * Si vous passez une fonction en tant que `nextState`, elle sera traitée comme une _fonction de mise à jour_ (*updater function, NdT*). Elle doit être pure, doit prendre l'état en attente comme seul argument, et doit retourner le prochain état. React mettra votre fonction de mise à jour dans une file et fera un nouveau rendu de votre composant. Pendant le prochain rendu, React va calculer le prochain état en appliquant toutes les fonctions de mises à jour à l'état précédent. [Voir un exemple ci-dessous](#updating-state-based-on-the-previous-state).

#### Valeur renvoyée {/*setstate-returns*/}

Les fonctions `set` n'ont pas de valeur de retour.

#### Limitations {/*setstate-caveats*/}

* La fonction `set` **ne met à jour que les variables d'état pour le *prochain* rendu**. Si vous lisez la variable d'état après avoir appelé la fonction `set`, [vous obtiendrez la même ancienne valeur](#ive-updated-the-state-but-logging-gives-me-the-old-value) qui était sur votre écran avant l'appel.

* Si la nouvelle valeur que vous donnez est identique au `state` actuel, en comparant au moyen de [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React **ne fera pas un nouveau rendu de ce composant et de ses enfants**. Il s'agit d'une optimisation. Même si, dans certains cas, React a tout de même besoin d'appeler votre composant sans faire de rendu de ses enfants, ça ne devrait pas affecter votre code.

* React [met à jour les états par lots](/learn/queueing-a-series-of-state-updates). Il met à jour l'écran après que tous les gestionnaires d'évènements aient été lancés et qu'ils aient appelés leurs fonctions `set`. Ça évite des rendu inutiles pour un unique évènement. Dans de rares cas où vous avez besoin de forcer React à mettre à jour l'écran plus tôt, par exemple pour accéder au DOM, vous pouvez utiliser [`flushSync`](/reference/react-dom/flushSync).

* Appeler la fonction `set` *pendant le rendu* est autorisé seulement dans le composant en train d'être rendu. React ignorera son retour et essayera immédiatement de faire un nouveau rendu avec le nouvel état. Ce modèle est rarement nécessaire, mais vous pouvez l'utiliser pour **stocker des informations des précédents rendus**. [Voir un exemple ci-dessous](#storing-information-from-previous-renders).

* En mode Strict, React **appellera votre fonction d'initialisation deux fois** dans le but de vous aider à [trouver les impuretés accidentelles](#my-initializer-or-updater-function-runs-twice). Ce comportement est uniquement présent en mode développement et n'affecte pas la production. Si votre fonction de mise à jour est pure (ce qui devrait être le cas), ça ne devrait pas affecter le comportement. Le résultat d'un des appels sera ignoré.

---

## Usage {/*usage*/}

### Ajouter un état à un composant {/*adding-state-to-a-component*/}

Appelez `useState` à la racine de votre composant pour déclarer une ou plusieurs [variables d'état](/learn/state-a-components-memory).

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

La convention est de nommer les variables d'états de cette manière : `[something, setSomething]`, en utilisant la [déstructuration positionnelle](https://fr.javascript.info/destructuring-assignment).

`useState` retourne un tableau avec exactement deux valeurs :

1. L'<CodeStep step={1}>état courant</CodeStep> de cette variable d'état, initialement le même que l'<CodeStep step={3}>état initial</CodeStep> que vous avez passé en entrée.
2. La <CodeStep step={2}>fonction `set`</CodeStep> qui vous permet de le changer avec n'importe quelle valeur lors d'une interaction.

Pour mettre à jour ce qu'il y a sur l'écran, appelez la fonction `set` avec le prochain autre état :

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React stockera ce prochain état, fera un nouveau rendu de votre composant avec les nouvelles valeurs, et mettra à jour l'interface utilisateur *(UI, NdT)*

<Pitfall>

Appeler la fonction `set` [**ne change pas** l'état actuel dans le code en train d'être exécuté](#ive-updated-the-state-but-logging-gives-me-the-old-value) :

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // Toujours "Taylor" !
}
```

Elle n'affecte que ce que `useState` va retourner à partir du *prochain* rendu.

</Pitfall>

<Recipes titleText="Exemple basique d'utilisation de useState" titleId="examples-basic">

#### Compteur (nombre) {/*counter-number*/}

Dans cet exemple, la variable d'état `count` contient un nombre. Elle est incrémentée en cliquant sur un bouton.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Vous avez cliqué sur ce bouton {count} fois
    </button>
  );
}
```

</Sandpack>

<Solution />

#### Champ de saisie (chaîne de caractères) {/*text-field-string*/}

Dans cet exemple, la variable d'état `text` contient une chaîne de caractères. Lorsque vous tapez, `handleChange` lit la dernière valeur entrée dans l'élément de champ de saisie du DOM, et appelle `setText` pour mettre à jour l'état. Ça vous permet d'afficher le `text` courant ci-dessous.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('bonjour');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>Vous avez tapé : {text}</p>
      <button onClick={() => setText('bonjour')}>
        Réinitialiser
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Case à cocher (booléan) {/*checkbox-boolean*/}

Dans cet exemple, la variable d'état `liked` contient un booléan. Lorsque vous cliquez sur la case, `setLiked` met à jour la variable d'état `liked` selon si la case est cochée ou non. La variable `liked` est utilisée pour effectuer le rendu du texte sous la case à cocher.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        J'ai aimé
      </label>
      <p>Vous {liked ? 'avez' : 'n\'avez pas'} aimé.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Formulaire (deux variables) {/*form-two-variables*/}

Vous pouvez déclarer plus d'une variable d'état dans le même composant. Chaque variable d'état est complètement indépendante.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Incrémenter l'âge
      </button>
      <p>Bonjour, {name}. Vous avez {age} ans.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Mettre à jour l'état selon son état précédent {/*updating-state-based-on-the-previous-state*/}

Supposons que `age` vaut `42`. Ce gestionnaire appelle `setAge(age + 1)` trois fois :

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

Cependant, après un click, `age` ne va valoir que `43`, plutôt que `45` ! C'est parce qu'appeler la fonction `set` [ne met pas à jour](/learn/state-as-a-snapshot) la variable d'état `age` dans le code en cours d'exécution. Donc, chaque appel à `setAge(age + 1)` devient `setAge(43)`.

Pour résoudre ce problème, **vous devez passer une *fonction de mise à jour*** à `setAge` au lieu du prochain état :

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

Ici, `a => a + 1` est votre fonction de mise à jour. Elle prend l'<CodeStep step={1}>état en attente</CodeStep> et calcule à partir de celui-ci le <CodeStep step={2}>prochain état</CodeStep>.

React met vos fonctions de mise à jour dans une [file](/learn/queueing-a-series-of-state-updates). Ensuite, pendant le prochain rendu, il va les appeler dans le même ordre :

1. `a => a + 1` recevra un état en attente valant `42` et va retourner un prochain état valant `43`.
1. `a => a + 1` recevra un état en attente valant `43` et va retourner un prochain état valant `44`.
1. `a => a + 1` recevra un état en attente valant `44` et va retourner un prochain état valant `45`.

Il n'y a pas d'autres mises à jour en file, React stockera donc à la fin `45` comme étant l'état courant.

Par convention, il est commun de nommer l'argument de l'état en attente selon la première lettre du nom de la variable d'état, comme `a` pour `age`. Cependant, vous pouvez également le nommer `prevAge`, ou quelque chose d'autre que vous trouvez plus clair.

En développement, React pourra [appeler deux fois vos mises à jour](#my-initializer-or-updater-function-runs-twice) pour vérifier si elles sont [pures](/learn/keeping-components-pure).

<DeepDive>

#### Est-il toujours préférable d'utiliser une mise à jour ? {/*is-using-an-updater-always-preferred*/}

Vous pourrez peut-être entendre des recommandations vous disant de toujours écrire votre code de cette manière, si l'état que vous mettez à jour est calculé depuis l'état précédent : `setAge(a => a + 1)`. Il n'y a aucun mal à le faire, mais ce n'est pas toujours nécessaire.

Dans la plupart des cas, il n'y a aucune différence entre ces deux approches. React vérifiera toujours, pour les actions intentionnelles des utilisateurs, que l'état `age` soit mis à jour avant le prochain click. Cela signifie qu'il n'y a aucun risque à ce qu'un gestionnaire de click voit un `age` "obsolète" au début de la gestion des évènements.

Cependant, si vous opérez plusieurs mises à jour dans le même évènement, les mises à jours peuvent être utiles. Elles sont également utiles s'il n'est pas pratique d'accèder à la variable d'état elle-même (vous pourrez rencontrer ce cas en optimisant les rendus).

Si vous préfèrez la consistance plutôt qu'une syntaxe un peu moins verbeuse, il est raisonnable de toujours écrire une mise à jour si l'état que vous mettez à jour est calculé à partir de l'état précédent. S'il est calculé depuis l'état précédent d'une *autre* variable d'état, vous pourrez peut-être les combiner en une seul objet et [utiliser un reducer.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes titleText="The difference between passing an updater and passing the next state directly" titleId="examples-updater">

#### Passing the updater function {/*passing-the-updater-function*/}

This example passes the updater function, so the "+3" button works.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

#### Passing the next state directly {/*passing-the-next-state-directly*/}

This example **does not** pass the updater function, so the "+3" button **doesn't work as intended**.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Updating objects and arrays in state {/*updating-objects-and-arrays-in-state*/}

You can put objects and arrays into state. In React, state is considered read-only, so **you should *replace* it rather than *mutate* your existing objects**. For example, if you have a `form` object in state, don't mutate it:

```js
// 🚩 Don't mutate an object in state like this:
form.firstName = 'Taylor';
```

Instead, replace the whole object by creating a new one:

```js
// ✅ Replace state with a new object
setForm({
  ...form,
  firstName: 'Taylor'
});
```

Read [updating objects in state](/learn/updating-objects-in-state) and [updating arrays in state](/learn/updating-arrays-in-state) to learn more.

<Recipes titleText="Examples of objects and arrays in state" titleId="examples-objects">

#### Form (object) {/*form-object*/}

In this example, the `form` state variable holds an object. Each input has a change handler that calls `setForm` with the next state of the entire form. The `{ ...form }` spread syntax ensures that the state object is replaced rather than mutated.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        First name:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Last name:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Form (nested object) {/*form-nested-object*/}

In this example, the state is more nested. When you update nested state, you need to create a copy of the object you're updating, as well as any objects "containing" it on the way upwards. Read [updating a nested object](/learn/updating-objects-in-state#updating-a-nested-object) to learn more.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

#### List (array) {/*list-array*/}

In this example, the `todos` state variable holds an array. Each button handler calls `setTodos` with the next version of that array. The `[...todos]` spread syntax, `todos.map()` and `todos.filter()` ensure the state array is replaced rather than mutated.

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

#### Writing concise update logic with Immer {/*writing-concise-update-logic-with-immer*/}

If updating arrays and objects without mutation feels tedious, you can use a library like [Immer](https://github.com/immerjs/use-immer) to reduce repetitive code. Immer lets you write concise code as if you were mutating objects, but under the hood it performs immutable updates:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Avoiding recreating the initial state {/*avoiding-recreating-the-initial-state*/}

React saves the initial state once and ignores it on the next renders.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

Although the result of `createInitialTodos()` is only used for the initial render, you're still calling this function on every render. This can be wasteful if it's creating large arrays or performing expensive calculations.

To solve this, you may **pass it as an _initializer_ function** to `useState` instead:

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

Notice that you’re passing `createInitialTodos`, which is the *function itself*, and not `createInitialTodos()`, which is the result of calling it. If you pass a function to `useState`, React will only call it during initialization.

React may [call your initializers twice](#my-initializer-or-updater-function-runs-twice) in development to verify that they are [pure.](/learn/keeping-components-pure)

<Recipes titleText="The difference between passing an initializer and passing the initial state directly" titleId="examples-initializer">

#### Passing the initializer function {/*passing-the-initializer-function*/}

This example passes the initializer function, so the `createInitialTodos` function only runs during initialization. It does not run when component re-renders, such as when you type into the input.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Passing the initial state directly {/*passing-the-initial-state-directly*/}

This example **does not** pass the initializer function, so the `createInitialTodos` function runs on every render, such as when you type into the input. There is no observable difference in behavior, but this code is less efficient.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Resetting state with a key {/*resetting-state-with-a-key*/}

You'll often encounter the `key` attribute when [rendering lists.](/learn/rendering-lists) However, it also serves another purpose.

You can **reset a component's state by passing a different `key` to a component.** In this example, the Reset button changes the `version` state variable, which we pass as a `key` to the `Form`. When the `key` changes, React re-creates the `Form` component (and all of its children) from scratch, so its state gets reset.

Read [preserving and resetting state](/learn/preserving-and-resetting-state) to learn more.

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### Storing information from previous renders {/*storing-information-from-previous-renders*/}

Usually, you will update state in event handlers. However, in rare cases you might want to adjust state in response to rendering -- for example, you might want to change a state variable when a prop changes.

In most cases, you don't need this:

* **If the value you need can be computed entirely from the current props or other state, [remove that redundant state altogether.](/learn/choosing-the-state-structure#avoid-redundant-state)** If you're worried about recomputing too often, the [`useMemo` Hook](/reference/react/useMemo) can help.
* If you want to reset the entire component tree's state, [pass a different `key` to your component.](#resetting-state-with-a-key)
* If you can, update all the relevant state in the event handlers.

In the rare case that none of these apply, there is a pattern you can use to update state based on the values that have been rendered so far, by calling a `set` function while your component is rendering.

Here's an example. This `CountLabel` component displays the `count` prop passed to it:

```js CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

Say you want to show whether the counter has *increased or decreased* since the last change. The `count` prop doesn't tell you this -- you need to keep track of its previous value. Add the `prevCount` state variable to track it. Add another state variable called `trend` to hold whether the count has increased or decreased. Compare `prevCount` with `count`, and if they're not equal, update both `prevCount` and `trend`. Now you can show both the current count prop and *how it has changed since the last render*.

<Sandpack>

```js App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

Note that if you call a `set` function while rendering, it must be inside a condition like `prevCount !== count`, and there must be a call like `setPrevCount(count)` inside of the condition. Otherwise, your component would re-render in a loop until it crashes. Also, you can only update the state of the *currently rendering* component like this. Calling the `set` function of *another* component during rendering is an error. Finally, your `set` call should still [update state without mutation](#updating-objects-and-arrays-in-state) -- this doesn't mean you can break other rules of [pure functions.](/learn/keeping-components-pure)

This pattern can be hard to understand and is usually best avoided. However, it's better than updating state in an effect. When you call the `set` function during render, React will re-render that component immediately after your component exits with a `return` statement, and before rendering the children. This way, children don't need to render twice. The rest of your component function will still execute (and the result will be thrown away). If your condition is below all the Hook calls, you may add an early `return;` to restart rendering earlier.

---

## Troubleshooting {/*troubleshooting*/}

### I've updated the state, but logging gives me the old value {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

Calling the `set` function **does not change state in the running code**:

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Request a re-render with 1
  console.log(count);  // Still 0!

  setTimeout(() => {
    console.log(count); // Also 0!
  }, 5000);
}
```

This is because [states behaves like a snapshot.](/learn/state-as-a-snapshot) Updating state requests another render with the new state value, but does not affect the `count` JavaScript variable in your already-running event handler.

If you need to use the next state, you can save it in a variable before passing it to the `set` function:

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### I've updated the state, but the screen doesn't update {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React will **ignore your update if the next state is equal to the previous state,** as determined by an [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. This usually happens when you change an object or an array in state directly:

```js
obj.x = 10;  // 🚩 Wrong: mutating existing object
setObj(obj); // 🚩 Doesn't do anything
```

You mutated an existing `obj` object and passed it back to `setObj`, so React ignored the update. To fix this, you need to ensure that you're always [_replacing_ objects and arrays in state instead of _mutating_ them](#updating-objects-and-arrays-in-state):

```js
// ✅ Correct: creating a new object
setObj({
  ...obj,
  x: 10
});
```

---

### I'm getting an error: "Too many re-renders" {/*im-getting-an-error-too-many-re-renders*/}

You might get an error that says: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` Typically, this means that you're unconditionally setting state *during render*, so your component enters a loop: render, set state (which causes a render), render, set state (which causes a render), and so on. Very often, this is caused by a mistake in specifying an event handler:

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

If you can't find the cause of this error, click on the arrow next to the error in the console and look through the JavaScript stack to find the specific `set` function call responsible for the error.

---

### My initializer or updater function runs twice {/*my-initializer-or-updater-function-runs-twice*/}

In [Strict Mode](/reference/react/StrictMode), React will call some of your functions twice instead of once:

```js {2,5-6,11-12}
function TodoList() {
  // This component function will run twice for every render.

  const [todos, setTodos] = useState(() => {
    // This initializer function will run twice during initialization.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // This updater function will run twice for every click.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

This is expected and shouldn't break your code.

This **development-only** behavior helps you [keep components pure.](/learn/keeping-components-pure) React uses the result of one of the calls, and ignores the result of the other call. As long as your component, initializer, and updater functions are pure, this shouldn't affect your logic. However, if they are accidentally impure, this helps you notice the mistakes.

For example, this impure updater function mutates an array in state:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Mistake: mutating state
  prevTodos.push(createTodo());
});
```

Because React calls your updater function twice, you'll see the todo was added twice, so you'll know that there is a mistake. In this example, you can fix the mistake by [replacing the array instead of mutating it](#updating-objects-and-arrays-in-state):

```js {2,3}
setTodos(prevTodos => {
  // ✅ Correct: replacing with new state
  return [...prevTodos, createTodo()];
});
```

Now that this updater function is pure, calling it an extra time doesn't make a difference in behavior. This is why React calling it twice helps you find mistakes. **Only component, initializer, and updater functions need to be pure.** Event handlers don't need to be pure, so React will never call your event handlers twice.

Read [keeping components pure](/learn/keeping-components-pure) to learn more.

---

### I'm trying to set state to a function, but it gets called instead {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

You can't put a function into state like this:

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

Because you're passing a function, React assumes that `someFunction` is an [initializer function](#avoiding-recreating-the-initial-state), and that `someOtherFunction` is an [updater function](#updating-state-based-on-the-previous-state), so it tries to call them and store the result. To actually *store* a function, you have to put `() =>` before them in both cases. Then React will store the functions you pass.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
