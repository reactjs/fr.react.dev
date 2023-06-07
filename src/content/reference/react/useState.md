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
  const [name, setName] = useState('Clara');
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
2. La [fonction de mise à jour](#setstate). Elle vous permet de mettre à jour l'état avec une valeur différente et de déclencher un nouveau rendu.

#### Limitations {/*caveats*/}

* `useState` est un Hook, vous ne pouvez donc l’appeler qu'uniquement **à la racine de votre composant** ou de vos propres Hooks. Vous ne pouvez pas l’appeler à l’intérieur de boucles ou de conditions. Si nécessaire, extrayez un nouveau composant et déplacez l'état dans celui-ci.
* En mode Strict, React appellera votre **fonction d'initialisation** deux fois dans le but de vous aider à [trouver les impuretés accidentelles](#my-initializer-or-updater-function-runs-twice). Ce comportement est uniquement présent en mode développement et n'affecte pas la production. Si votre fonction d'initialisation est pure (ce qui devrait être le cas), ça ne devrait pas affecter le comportement. Le résultat d'un des appels sera ignoré.

---

### Les fonctions de mise à jour, comme `setSomething(nextState)` {/*setstate*/}

La fonction de mise à jour retournée par `useState` permet de mettre à jour l'état avec une valeur différente et de déclencher un nouveau rendu. Vous pouvez directement passer le prochain état, ou une fonction qui le calcule à l'aide de l'état précédent :

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Clara');
  setAge(a => a + 1);
  // ...
```

#### Paramètres {/*setstate-parameters*/}

* `nextState`: La valeur désirée de l'état. Elle peut être une valeur de n'importe quel type, mais il existe un comportement spécial pour les fonctions.
  * Si vous passez une fonction en tant que `nextState`, elle sera traitée comme une _fonction de mise à jour_ (*updater function, NdT*). Elle doit être pure, doit prendre l'état en attente comme seul argument, et doit retourner le prochain état. React mettra votre fonction de mise à jour dans une file d'attente et fera un nouveau rendu de votre composant. Pendant le prochain rendu, React va calculer le prochain état en appliquant toutes les fonctions de mises à jour à l'état précédent. [Voir un exemple ci-dessous](#updating-state-based-on-the-previous-state).

#### Valeur renvoyée {/*setstate-returns*/}

Les fonctions de mise à jour n'ont pas de valeur de retour.

#### Limitations {/*setstate-caveats*/}

* La fonction de mise à jour **ne met à jour que les variables d'état pour le *prochain* rendu**. Si vous lisez la variable d'état après avoir appelé la fonction de mise à jour, [vous obtiendrez la même ancienne valeur](#ive-updated-the-state-but-logging-gives-me-the-old-value) qui était sur votre écran avant l'appel.

* Si la nouvelle valeur que vous donnez est identique au `state` actuel, en comparant au moyen de [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React **ne fera pas un nouveau rendu de ce composant et de ses enfants**. Il s'agit d'une optimisation. Même si, dans certains cas, React a tout de même besoin d'appeler votre composant sans faire de rendu de ses enfants, ça ne devrait pas affecter votre code.

* React [met à jour les états par lots](/learn/queueing-a-series-of-state-updates). Il met à jour l'écran après que tous les gestionnaires d'évènements aient été lancés et qu'ils aient appelé leurs fonctions de mise à jour. Ça évite des rendu inutiles pour un unique évènement. Dans de rares cas où vous avez besoin de forcer React à mettre à jour l'écran plus tôt, par exemple pour accéder au DOM, vous pouvez utiliser [`flushSync`](/reference/react-dom/flushSync).

* Appeler la fonction de mise à jour *pendant le rendu* est autorisé seulement dans le composant en train d'être rendu. React ignorera son retour et essayera immédiatement de faire un nouveau rendu avec le nouvel état. Ce modèle est rarement nécessaire, mais vous pouvez l'utiliser pour **stocker des informations des précédents rendus**. [Voir un exemple ci-dessous](#storing-information-from-previous-renders).

* En mode Strict, React **appellera votre fonction d'initialisation deux fois** dans le but de vous aider à [trouver les impuretés accidentelles](#my-initializer-or-updater-function-runs-twice). Ce comportement est uniquement présent en mode développement et n'affecte pas la production. Si votre fonction de mise à jour est pure (ce qui devrait être le cas), ça ne devrait pas affecter le comportement. Le résultat d'un des appels sera ignoré.

---

## Usage {/*usage*/}

### Ajouter un état à un composant {/*adding-state-to-a-component*/}

Appelez `useState` à la racine de votre composant pour déclarer une ou plusieurs [variables d'état](/learn/state-a-components-memory).

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Clara'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Clara');
  // ...
```

La convention est de nommer les variables d'états de cette manière : `[something, setSomething]`, en utilisant la [déstructuration positionnelle](https://fr.javascript.info/destructuring-assignment).

`useState` retourne un tableau avec exactement deux valeurs :

1. L'<CodeStep step={1}>état courant</CodeStep> de cette variable d'état, initialement le même que l'<CodeStep step={3}>état initial</CodeStep> que vous avez passé en entrée.
2. La <CodeStep step={2}>fonction de mise à jour</CodeStep> qui vous permet de le changer avec n'importe quelle valeur lors d'une interaction.

Pour mettre à jour ce qu'il y a sur l'écran, appelez la fonction de mise à jour avec le prochain autre état :

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React stockera ce prochain état, fera un nouveau rendu de votre composant avec les nouvelles valeurs, et mettra à jour l'interface utilisateur *(UI, NdT)*.

<Pitfall>

Appeler la fonction de mise à jour [**ne change pas** l'état actuel dans le code en train d'être exécuté](#ive-updated-the-state-but-logging-gives-me-the-old-value) :

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // Toujours "Clara" !
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

#### Case à cocher (booléen) {/*checkbox-boolean*/}

Dans cet exemple, la variable d'état `liked` contient un booléen. Lorsque vous cliquez sur la case, `setLiked` met à jour la variable d'état `liked` selon si la case est cochée ou non. La variable `liked` est utilisée pour effectuer le rendu du texte sous la case à cocher.

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
  const [name, setName] = useState('Clara');
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

Cependant, après un click, `age` ne va valoir que `43`, plutôt que `45` ! C'est parce qu'appeler la fonction de mise à jour [ne met pas à jour](/learn/state-as-a-snapshot) la variable d'état `age` dans le code en cours d'exécution. Donc, chaque appel à `setAge(age + 1)` devient `setAge(43)`.

Pour résoudre ce problème, **vous devez passer une *fonction de mise à jour*** à `setAge` au lieu du prochain état :

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

Ici, `a => a + 1` est votre fonction de mise à jour. Elle prend l'<CodeStep step={1}>état en attente</CodeStep> et calcule à partir de celui-ci le <CodeStep step={2}>prochain état</CodeStep>.

React met vos fonctions de mise à jour dans une [file d'attente](/learn/queueing-a-series-of-state-updates). Ensuite, pendant le prochain rendu, il va les appeler dans le même ordre :

1. `a => a + 1` recevra un état en attente valant `42` et va retourner un prochain état valant `43`.
1. `a => a + 1` recevra un état en attente valant `43` et va retourner un prochain état valant `44`.
1. `a => a + 1` recevra un état en attente valant `44` et va retourner un prochain état valant `45`.

Il n'y a pas d'autres mises à jour en file d'attente, React stockera donc à la fin `45` comme étant l'état courant.

Par convention, il est commun de nommer l'argument de l'état en attente selon la première lettre du nom de la variable d'état, comme `a` pour `age`. Cependant, vous pouvez également le nommer `prevAge`, ou quelque chose d'autre que vous trouvez plus clair.

En développement, React pourra [appeler deux fois vos mises à jour](#my-initializer-or-updater-function-runs-twice) pour vérifier si elles sont [pures](/learn/keeping-components-pure).

<DeepDive>

#### Est-il toujours préférable d'utiliser une mise à jour ? {/*is-using-an-updater-always-preferred*/}

Vous pourrez peut-être entendre des recommandations vous disant de toujours écrire votre code de cette manière, si l'état que vous mettez à jour est calculé depuis l'état précédent : `setAge(a => a + 1)`. Il n'y a aucun mal à le faire, mais ce n'est pas toujours nécessaire.

Dans la plupart des cas, il n'y a aucune différence entre ces deux approches. React vérifiera toujours, pour les actions intentionnelles des utilisateurs, que l'état `age` soit mis à jour avant le prochain click. Cela signifie qu'il n'y a aucun risque à ce qu'un gestionnaire de click voit un `age` "obsolète" au début de la gestion des évènements.

Cependant, si vous opérez plusieurs mises à jour dans le même évènement, les mises à jours peuvent être utiles. Elles sont également utiles s'il n'est pas pratique d'accèder à la variable d'état elle-même (vous pourrez rencontrer ce cas en optimisant les rendus).

Si vous préfèrez la consistance plutôt qu'une syntaxe un peu moins verbeuse, il est raisonnable de toujours écrire une mise à jour si l'état que vous mettez à jour est calculé à partir de l'état précédent. S'il est calculé depuis l'état précédent d'une *autre* variable d'état, vous pourrez peut-être les combiner en une seul objet et [utiliser un reducer.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes titleText="La différence entre passer une fonction de mise à jour et passer directement le prochain état" titleId="examples-updater">

#### Passer la fonction de mise à jour {/*passing-the-updater-function*/}

Cet exemple passe la fonction de mise à jour, donc le bouton "+3" fonctionne.

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
      <h1>Votre âge : {age}</h1>
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

#### Passer directement le prochain état {/*passing-the-next-state-directly*/}

Cet exemple **ne passe pas** la fonction de mise à jour, donc le bouton "+3" **ne fonctionne pas comme prévu**.

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
      <h1>Votre âge : {age}</h1>
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

### Mettre à jour des objets et des tableaux dans un état {/*updating-objects-and-arrays-in-state*/}

Vous pouvez insérer des objets et des tableaux dans un état. En React, un état est considéré comme en lecture seule, **vous devez donc *replacer* vos objets existants plutôt que les *muter***. Par exemple, si vous avez un objet `form` dans un état, ne le mutez pas :

```js
// 🚩 Ne mutez pas un objet dans un état comme ceci :
form.firstName = 'Clara';
```

À la place, replacez l'objet entier en en créant un nouveau :

```js
// ✅ Remplacez l'état avec un nouvel objet 
setForm({
  ...form,
  firstName: 'Clara'
});
```

Lire [mettre à jour des objets dans un état](/learn/updating-objects-in-state) et [mettre à jour des tableaux dans un état](/learn/updating-arrays-in-state) pour en savoir plus.

<Recipes titleText="Exemples d'objets et de tableaux dans un état" titleId="examples-objects">

#### Formulaire (objet) {/*form-object*/}

Dans cet exemple, la variable d'état `form` contient un objet. Chaque champ de saisie possède un gestionnaire de changement qui appelle `setForm` avec le prochain état du formulaire tout entier. La syntaxe de décomposition `{...form}` permet de s'assurer que l'état de l'objet est remplacé, plutôt que muté.

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
        Prénom :
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
        Nom de famille :
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
        Mail :
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

#### Formulaire (objet imbriqué) {/*form-nested-object*/}

Dans cet exemple, l'état est imbriqué (*nested, NdT*). Lorsque vous mettez à jour un état imbriqué, vous avez besoin de créer une copie de l'objet que vous mettez à jour, ainsi que de tous les objets hiérarchiquement plus hauts le "contenant". Lire [mettre à jour un objet imbriqué](/learn/updating-objects-in-state#updating-a-nested-object) pour en savoir plus.

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
        Nom :
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Titre :
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Ville :
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image :
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' par '}
        {person.name}
        <br />
        (basé à {person.artwork.city})
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

#### Liste (tableau) {/*list-array*/}

Dans cet exemple, la variable d'état `todos` contient un tableau. Chaque gestionnaire de bouton appelle `setTodos` avec la prochaine version de ce tableau. La syntaxe de décomposition `[...todos]`, `todos.map()` et `todos.filter()` permettent de remplacer l'état du tableau, plutôt que de le muter.

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Acheter du lait', done: true },
  { id: 1, title: 'Manger des tacos', done: false },
  { id: 2, title: 'Faire infuser du thé', done: false },
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
        placeholder="Ajouter une chose à faire"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Ajouter</button>
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
          Sauvegarder
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Éditer
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
        Supprimer
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

#### Écrire la logique d'une mise à jour de manière concise avec Immer {/*writing-concise-update-logic-with-immer*/}

Si le fait de mettre à jour des tableaux et des objets sans mutation vous paraît fastidieux, vous pouvez utiliser une librairie pour réduire le code répétitif, comme [Immer](https://github.com/immerjs/use-immer). Immer vous permet d'écrire du code concis comme si vous étiez en train de muter des objets, mais, en réalité, il réalise des mises à jour immutables :

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
      <h1>Liste d'Art</h1>
      <h2>Ma liste d'œuvres d'art à voir :</h2>
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

### Éviter de récréer l'état initial {/*avoiding-recreating-the-initial-state*/}

React sauvegarde l'état initial et l'ignore pendant le prochain rendu.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

Même si le résultat de `createInitialTodos()` est utilisé seulement pour le rendu initial, vous appelez tout de même cette fonction à chaque rendu. Ça peut gâcher les performances de votre application si vous créez de grands tableaux ou si vous lancez des calculs coûteux. 

Pour résoudre cette problématique, vous pouvez à la place **passer une fonction _d'initialisation_** à `useState` :

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

Notez que vous passez `createInitialTodos`, qui est la *fonction elle-même*, et non pas `createInitialTodos()`, qui est le résultat de l'appel. Si vous passez une fonction à `useState`, React ne l'appelera que pendant l'initialisation.

React pourrait [appeler vos fonctions d'initialisations deux fois](#my-initializer-or-updater-function-runs-twice) afin de vérifier qu'elles soient [pures.](/learn/keeping-components-pure)

<Recipes titleText="La différence entre passer une fonction d'initialisation et directement passer l'état initial" titleId="examples-initializer">

#### Passer la fonction d'initialisation {/*passing-the-initializer-function*/}

Cet exemple passe la fonction d'initialisation pour que la fonction `createInitialTodos` ne soit lancée que pendant l'initialisation. Elle ne se lance pas quand le composant effectue un nouveau rendu, comme lorsque vous tapez dans le champ de saisie.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Objet ' + (i + 1)
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
      }}>Ajouter</button>
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

#### Directement passer l'état initial {/*passing-the-initial-state-directly*/}

Cet exemple **ne passe pas** la fonction d'initialisation, donc la fonction `createInitialTodos` se lance à chaque rendu, comme lorsque vous tapez dans le champ de saisie. Il n'y a pas de différence de comportement remarquable, mais le code est moins efficace.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Objet ' + (i + 1)
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
      }}>Ajouter</button>
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

### Réinitialiser l'état avec une clé {/*resetting-state-with-a-key*/}

Vous pourriez parfois rencontrer un attribut `key` lors du [rendu de listes](/learn/rendering-lists). Cependant, il sert à autre chose.

Vous pouvez **réinitialiser l'état d'un composant en lui passant une `key` différente**. Dans cet exemple, le bouton Réinitialiser change la variable d'état `version`, laquelle étant passée dans une `key` à `Form`. Quand la `key` change, React re-crée le composant `Form` (et tous ses enfants) depuis le début, donc son état est réinitialisé.

Lire [préserver et réinitialiser l'état](/learn/preserving-and-resetting-state) pour en savoir plus.

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
      <button onClick={handleReset}>Réinitialiser</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Clara');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Bonjour, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### Stocker les informations des rendus précédents {/*storing-information-from-previous-renders*/}

La plupart du temps, vous mettrez à jour les états dans des gestionnaires d'évènements. Cependant, dans de rares cas, vous pourriez peut-être vouloir ajouter l'état en fonction du rendu -- par exemple, vous pourriez peut-être vouloir changer une variable d'état quand une propriété change.

Dans la plupart des cas, vous n'avez pas besoin de ça :

* **Si la valeur dont vous avez besoin peut être totalement calculée à partir des propriétés actuelles ou d'un autre état, [supprimez complètement ces états redondants](/learn/choosing-the-state-structure#avoid-redundant-state)**. Si effectuer de nouveaux calculs trop fréquemment vous dérange, le [Hook `useMemo`](/reference/react/useMemo) peut vous aider.   
* Si vous voulez réinitialiser l'entièreté de l'arbre d'un composant, [passez une `key` différente à votre composant](#resetting-state-with-a-key).
* Si vous le pouvez, mettez à jour tous les états correspondants dans des gestionnaires d'évènements.

Dans de rares autres cas, il existe un modèle que vous pouvez utiliser pour mettre à jour un état selon les états qui ont été rendus jusqu'ici, en appelant une fonction de mise à jour pendant que votre composant est en cours de rendu.

Voici un exemple. Ce composant `CountLabel` affiche une propriété `count` qui lui est passé :

```js CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

Mettons que vous vouliez montrer si le compteur a *augmenté ou diminué* depuis le dernier changement. La propriété `count` ne vous permet pas de savoir ça -- vous avez besoin de garder une trace de sa dernière valeur. Ajoutez la variable d'état `prevCount` afin de garder une trace de sa dernière valeur. Ajoutez une autre variable d'état appelée `trend` qui permet de savoir si le compteur a augmenté ou diminué. Comparez `prevCount` avec `count`, et, s'ils ne sont pas égaux, mettez à jour `prevCount` et `trend`. Vous pouvez maintenant montrer la propriété du compteur courante et *comment elle a changé depuis le dernier rendu*.

<Sandpack>

```js App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Incrémenter
      </button>
      <button onClick={() => setCount(count - 1)}>
        Décrémenter
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
    setTrend(count > prevCount ? 'augmenté' : 'diminué');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>Le compteur a {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

Notez que si vous appelez une fonction de mise à jour pendant le rendu, elle doit être dans une condition, telle que `prevCount !== count`, et il doit y avoir un appel dans la condition, tel que `setPrevCount(count)`. Sinon, votre composant effectuera des rendus en boucle jusqu'à crash. De plus, vous pouvez seulement mettre à jour l'état du composant *en cours de rendu* de cette manière. Appeler la fonction de mise à jour d'un *autre* composant pendant le rendu est une erreur. Finalement, votre appel de mise à jour devrait toujours [mettre à jour l'état sans mutation](#updating-objects-and-arrays-in-state) -- cela ne veut pas dire que vous pouvez enfreindre les autres règles des [fonctions pures](/learn/keeping-components-pure).

Cette méthode peut être difficile à comprendre et est la plupart du temps à éviter. Cependant, c'est toujours mieux que de mettre à jour un état dans un effet. Lorsque vous appelez une fonction de mise à jour pendant le rendu, React va effectuer un autre rendu de ce composant immédiatement après que votre composant se soit terminé grâce à un `return`, et avant d'effectuer un rendu de ses enfants. De cette manière, les enfants n'ont pas besoin d'effectuer deux rendus. Le reste de votre composant va toujours s'effectuer (et le résultat va être jeté). Si votre composant est en-dessous de tous les appels à des Hook, vous devez ajouter un `return;` en avance pour redémarrer plus tôt le rendu.

---

## Dépannage {/*troubleshooting*/}

### J'ai mis à jour l'état, mais le logging m'affiche toujours l'ancienne valeur {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

Appeler la fonction de mise à jour **ne change pas l'état dans le code en cours de lancement** :

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Demander un nouveau rendu avec 1
  console.log(count);  // Toujours 0 !

  setTimeout(() => {
    console.log(count); // Encore 0 !
  }, 5000);
}
```

C'est parce que l'[état se comporte comme une snapshot](/learn/state-as-a-snapshot). Mettre à jour l'état déclenche un autre rendu avec la nouvelle variable d'état, mais cela n'affecte pas la variable JavaScript `count` dans le gestionnaire d'évènements en train de s'exécuter.

Si vous avez besoin du prochain état, vous pouvez le sauvegarder dans une variable avant de le passer dans la fonction de mise à jour :

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### J'ai mis à jour l'état, mais l'écran ne se met pas à jour {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React va **ignorer votre mise à jour si le prochain état est égal à l'état précédent**, en comparant au moyen de [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Ça arrive la plupart du temps lorsque vous changez un objet ou un tableau directement dans l'état :

```js
obj.x = 10;  // 🚩 Faux : mutation d'un objet existant
setObj(obj); // 🚩 Ne fait rien
```

Vous avez muté un objet `obj` existant et vous l'avez re-passé à `setObj`, donc React ignore la mise à jour. Pour résoudre cela, vous devez vous assurer que vous [remplacez toujours les objets et les tableaux dans l'état plutôt que les _muter_](#updating-objects-and-arrays-in-state) :

```js
// ✅ Correct : créer un nouvel objet
setObj({
  ...obj,
  x: 10
});
```

---

### J'ai une erreur : "Too many re-renders" {/*im-getting-an-error-too-many-re-renders*/}

Vous pourriez peut-être avoir une erreur disant : `Too many re-renders. React limits the number of renders to prevent an infinite loop`. La plupart du temps, cela signifie que vous mettez à jour un état de manière non conditionnelle *pendant le rendu*, donc votre composant rentre dans une boucle : rendu, mise à jour de l'état (qui cause un rendu), rendu, mise à jour de l'état (qui cause un rendu), etc. Peu souvent, c'est causé par une erreur en spécifiant le gestionnaire d'évènement : 

```js {1-2}
// 🚩 Faux : appelle le gestionnaire pendant le rendu
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct : passe le gestionnaire d'évènement 
return <button onClick={handleClick}>Click me</button>

// ✅ Correct : passe une fonction en ligne
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

Si vous n'arrivez pas à trouver le cause de cette erreur, cliquez, dans la console, sur la flèche à côté de l'erreur, et regardez dans votre pile JavaScript afin de trouver la fonction de mise à jour responsable de cette erreur.

---

### Ma fonction d'initialisation ou ma fonction de mise à jour se lance deux fois {/*my-initializer-or-updater-function-runs-twice*/}

En [mode Strict](/reference/react/StrictMode), React va appeler certaines de vos fonctions deux fois plutôt qu'une :

```js {2,5-6,11-12}
function TodoList() {
  // La fonction de ce composant va se lancer deux fois pendant le rendu.

  const [todos, setTodos] = useState(() => {
    // Cette fonction d'initialisation va se lancer deux fois pendant le rendu.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // Cette fonction de mise à jour va se lancer deux fois à chaque click.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

C'est voulu, et ça ne devrait pas casser votre code.

Ce comportement, **uniquement présent en développement**, vous aide à [garder vos composants purs](/learn/keeping-components-pure). React utilise le résultat d'un des appels, et ignore le résultat de l'autre. Tant que vos composants, vos fonctions d'initialisation, et vos fonctions de mise à jour sont pures, ça ne devrait pas affecter votre logique. Cependant, si elles sont accidentellement impures, ça vous aide à remarquer vos erreurs. 

Par exemple, cette fonction de mise à jour impure mute un tableau dans un état :

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Erreur : muter un état
  prevTodos.push(createTodo());
});
```
Comme React a appelé votre fonction de mise à jour à deux reprises, vous verrez que le `todo` a été appelé deux fois, et vous saurez qu'il y a une erreur. Dans cet exemple, vous pouvez résoudre l'erreur en [remplaçant le tableau, plutôt que de le muter](#updating-objects-and-arrays-in-state) :

```js {2,3}
setTodos(prevTodos => {
  // ✅ Correct : remplacer avec le nouvel état
  return [...prevTodos, createTodo()];
});
```

Maintenant que cette fonction de mise à jour est pure, l'appeler une autre fois ne fait aucune différence de comportement. C'est pour cette raison que l'appel à deux reprises de React vous aide à trouver des erreurs. **Seulement les composants, les fonctions d'initialisation et les fonctions de mise à jour doivent être pures**. Les gestionnaires d'évènements n'ont pas besoin d'être purs, donc React ne les appellera jamais deux fois.

Lire [garder les composants purs](/learn/keeping-components-pure) pour en savoir plus.

---

### J'essaye de mettre à jour un état avec une fonction, mais elle est appelée à la place {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

Vous ne pouvez pas mettre une fonction dans un état comme ceci :

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

Comme vous passez une fonction, React part de principe que `someFunction` est une [fonction d'initialisation](#avoiding-recreating-the-initial-state), et que `someOtherFunction` est une [fonction de mise à jour](#updating-state-based-on-the-previous-state), et donc essaye de les appeler et de stocker leurs résultats. Pour réellement *stocker* une fonction, dans les deux cas, vous devez placer en amont `() =>`. Dans ce cas, React stockera les fonctions que vous passez.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
