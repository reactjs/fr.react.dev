---
title: useReducer
---

<Intro>

`useReducer` est un Hook React qui vous permet d'ajouter un [réducteur](/learn/extracting-state-logic-into-a-reducer) à votre composant.

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useReducer(reducer, initialArg, init?)` {/*usereducer*/}

Appelez `useReducer` au niveau racine de votre composant pour gérer son état avec un [réducteur](/learn/extracting-state-logic-into-a-reducer).

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `reducer` : la fonction de réduction qui spécifie comment votre état est mis à jour. Elle doit être pure, prendre l'état et l'action en paramètres et renvoyer le prochain état. L'état et l'action peuvent être de n'importe quels types.
* `initialArg` : la valeur à partir de laquelle l'état est calculé. Elle peut être de n'importe quel type. La façon dont l'état initial est calculé dépend du paramètre `init` qui suit.
* `init` **optionnelle** : la fonction d'initialisation qui doit renvoyer l'état initial. Si elle n'est pas spécifiée, l'état initial est défini avec `initialArg`. Autrement, il est défini en appelant `init(initialArg)`.

#### Valeur renvoyée {/*returns*/}

`useReducer` renvoie un tableau avec exactement deux valeurs :

1. L'état courant. Lors du premier rendu, il est défini avec `init(initialArg)` ou `initialArg` (s'il n'y a pas d'argument `init`).
2. La [fonction `dispatch`](#dispatch) qui vous permet de mettre à jour l'état vers une valeur différente et ainsi redéclencher un rendu.

#### Limitations et points à noter {/*caveats*/}

* `useReducer` est un Hook, vous ne pouvez donc l'appeler **qu'au niveau racine de votre composant** ou de vos propres Hooks. Vous ne pouvez pas l'appeler dans des boucles ou des conditions. Si vous avez besoin de le faire, extrayez un nouveau composant et déplacez-y l'état.
* La fonction `dispatch` a une identité stable, elle ne figure donc généralement pas dans les dépendances des Effets, mais l'inclure n'entraînera pas un déclenchement d'Effet superflu.  Si le *linter* vous permet de l'omettre sans erreurs, c'est que cette omission est sans danger. [Apprenez-en davantage sur l'allègement des dépendances d'Effets](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
* En Mode Strict, React **appellera deux fois votre réducteur et votre fonction d'initialisation** afin de [vous aider à détecter des impuretés accidentelles](#my-reducer-or-initializer-function-runs-twice). Ce comportement est limité au développement et n'affecte pas la production. Si votre réducteur et votre fonction d'initialisation sont pures (ce qui devrait être le cas), ça n'impactera pas votre logique. Le résultat de l'un des appels est ignoré.

---

### Fonction `dispatch` {/*dispatch*/}

La fonction `dispatch` renvoyée par `useReducer` vous permet de mettre à jour l'état avec une valeur différente et de déclencher un rendu. Le seul paramètre à passer à la fonction `dispatch` est l'action :

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

React définira le prochain état avec le résultat de l'appel de la fonction `reducer` que vous avez fournie avec le `state` courant et l'action que vous avez passée à `dispatch`.

#### Paramètres {/*dispatch-parameters*/}

* `action` : l'action réalisée par l'utilisateur. Elle peut être de n'importe quelle nature. Par convention, une action est généralement un objet avec une propriété `type` permettant son identification et, optionnellement, d'autres propriétés avec des informations additionnelles.

#### Valeur renvoyée {/*dispatch-returns*/}

Les fonctions `dispatch` ne renvoient rien.

#### Limitations {/*setstate-caveats*/}

* La fonction `dispatch` **ne met à jour l'état que pour le *prochain* rendu**. Si vous lisez une variable d'état après avoir appelé la fonction de `dispatch`, [vous aurez encore l'ancienne valeur](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value) qui était à l'écran avant cet appel.

* Si la nouvelle valeur fournie est identique au `state` actuel, déterminé par une comparaison avec [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React **sautera le nouveau rendu du composant et de ses enfants**. C'est une optimisation. React aura peut-être quand même besoin d'appeler votre composant avant d'en ignorer le résultat, mais ça ne devrait pas affecter votre code.

* React [met à jour l'état par lots](/learn/queueing-a-series-of-state-updates). Il met à jour l'écran **une fois que tous les gestionnaires d'événements ont été exécutés** et ont appelé leurs fonctions `set`. Ça évite les rendus multiples à la suite d'un événement unique. Dans les rares cas où vous devez forcer React à mettre à jour l'écran prématurément, par exemple pour accéder au DOM, vous pouvez utiliser [`flushSync`](/reference/react-dom/flushSync).

---

## Utilisation {/*usage*/}

### Ajouter un réducteur à un composant {/*adding-a-reducer-to-a-component*/}

Appelez `useReducer` au niveau racine de votre composant pour gérer l'état avec un [réducteur](/learn/extracting-state-logic-into-a-reducer).

```js [[1, 8, "state"], [2, 8, "dispatch"], [4, 8, "reducer"], [3, 8, "{ age: 42 }"]]
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

`useReducer` renvoie un tableau avec exactement deux éléments :

1. L'<CodeStep step={1}>état actuel</CodeStep> de cette variable d'état, défini initialement avec l'<CodeStep step={3}>état initial</CodeStep> que vous avez fourni.
2. La <CodeStep step={2}>fonction `dispatch`</CodeStep> qui vous permet de le modifier en réponse à une interaction.

Pour mettre à jour ce qui est à l'écran, appelez <CodeStep step={2}>`dispatch`</CodeStep> avec un objet, nommé **action**, qui représente ce que l'utilisateur a fait :

```js [[2, 2, "dispatch"]]
function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

React passera l'état actuel et l'action à votre <CodeStep step={4}>fonction de réduction</CodeStep>. Votre réducteur calculera et renverra le nouvel état. React sauvera ce nouvel état, fera le rendu avec celui-ci puis mettra à jour l'interface utilisateur.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Incrémenter l’âge
      </button>
      <p>Bonjour ! Vous avez {state.age} ans.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

`useReducer` est très similaire à [`useState`](/reference/react/useState), mais il vous permet de déplacer la logique de mise à jour de l'état depuis les gestionnaires d'événements vers une seule fonction à l'extérieur de votre composant. Apprenez-en davantage sur [comment choisir entre `useState` et `useReducer`](/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer).

---

### Écrire la fonction de réduction {/*writing-the-reducer-function*/}

Une fonction de réduction est déclarée ainsi :

```js
function reducer(state, action) {
  // ...
}
```

Ensuite, vous devez la remplir avec le code qui va calculer et renvoyer le prochain état. Par convention, il est courant de l'écrire en utilisant une [instruction `switch`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/switch). Pour chaque `case` du `switch`, calculez et renvoyez un état suivant.

```js {4-7,10-13}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

Les actions peuvent prendre n'importe quelle forme. Par convention, il est courant de passer des objets avec une propriété `type` pour identifier l'action. Ils doivent juste inclure les informations nécessaires au réducteur pour calculer le prochain état.

```js {5,9-12}
function Form() {
  const [state, dispatch] = useReducer(reducer, { name: 'Clara', age: 42 });

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }
  // ...
```

Les noms des types d'actions sont locaux à votre composant. [Chaque action décrit une seule interaction, même si ça amène à modifier plusieurs fois la donnée](/learn/extracting-state-logic-into-a-reducer#writing-reducers-well). L'état peut avoir n'importe quelle forme, mais ce sera généralement un objet ou un tableau.

Lisez [Extraire la logique d'état dans un réducteur](/learn/extracting-state-logic-into-a-reducer) pour en apprendre davantage.

<Pitfall>

L'état est en lecture seule. Ne modifiez pas les objets ou les tableaux dans l'état :

```js {4,5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Ne modifiez pas l’objet dans l’état de cette façon :
      state.age = state.age + 1;
      return state;
    }
```

Au lieu de ça, renvoyez toujours de nouveaux objets depuis votre réducteur :

```js {4-8}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Renvoyez plutôt un nouvel objet
      return {
        ...state,
        age: state.age + 1
      };
    }
```

Lisez nos pages [Mettre à jour les objets d'un état](/learn/updating-objects-in-state) et [Mettre à jour les tableaux d'un état](/learn/updating-arrays-in-state) pour en apprendre davantage.

</Pitfall>

<Recipes titleText="Exemples simples de useReducer" titleId="examples-basic">

#### Formulaire (objet) {/*form-object*/}

Dans cet exemple, le réducteur gère un état sous forme d'objet ayant deux champs : `name` et `age`.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

const initialState = { name: 'Clara', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        Incrémenter l’âge
      </button>
      <p>Bonjour, {state.name}. Vous avez {state.age} ans.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

#### Liste de tâches (tableau) {/*todo-list-array*/}

Dans cet exemple, le réducteur gère un tableau de tâches. Le tableau doit être mis à jour [en respectant l'immutabilité](/learn/updating-arrays-in-state).

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Guide de Prague</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visiter le musée Franz-Kafka', done: true },
  { id: 1, text: 'Voir un spectacle de marionnettes', done: false },
  { id: 2, text: 'Prendre une photo du mur John Lennon', done: false }
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Ajouter une tâche"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Ajouter</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Enregistrer
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Modifier
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

#### Écrire de la logique concise avec Immer {/*writing-concise-update-logic-with-immer*/}

S'il est fastidieux de mettre à jour les tableaux et les objets sans les modifier en place, vous pouvez utiliser une bibliothèque comme [Immer](https://github.com/immerjs/use-immer#useimmerreducer) pour réduire le code répétitif. Immer vous permet d'écrire du code plus concis comme si vous modifiiez directement les objets, mais sous le capot, il effectue des mises à jour respectant l'immutabilité :

<Sandpack>

```js src/App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Guide de Prague</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visiter le musée Franz-Kafka', done: true },
  { id: 1, text: 'Voir un spectacle de marionnettes', done: false },
  { id: 2, text: 'Prendre une photo du mur John Lennon', done: false },
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Ajouter une tâche"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Ajouter</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Ajouter
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Modifier
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

### Éviter de recréer l'état initial {/*avoiding-recreating-the-initial-state*/}

React sauvegarde l'état initial une fois et l'ignore lors des rendus suivants.

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

Bien que le résultat de `createInitialState(username)` soit seulement utilisé pour le premier rendu, vous continuez d'appeler cette fonction à chaque rendu. C'est du gâchis si elle crée de grands tableaux ou effectue des calculs coûteux.

Pour corriger ça, vous pouvez plutôt **la passer comme fonction _d'initialisation_** au `useReducer` en tant que troisième argument.

```js {6}
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

Remarquez que vous passez `createInitialState`, à savoir *la fonction elle-même*, et non `createInitialState()`, qui est le résultat de son exécution. De cette façon, l'état initial n'est pas recréé après l'initialisation.

Dans l'exemple ci-dessus, `createInitialState` prend un argument `username`. Si votre fonction d'initialisation n'a besoin d'aucune information pour calculer l'état initial, vous pouvez passez `null` comme second argument à `useReducer`.

<Recipes titleText="La différence entre passer une fonction d'initialisation et un état initial directement" titleId="examples-initializer">

#### Passer la fonction d'initialisation {/*passing-the-initializer-function*/}

Cet exemple passe la fonction d'initialisation, la fonction `createInitialState` ne s'exécute donc que durant l'initialisation. Elle ne s'exécute pas lorsque le composant fait de nouveau son rendu, comme lorsque vous tapez dans le champ de saisie.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Clara" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: "Tâche #" + (i + 1) + " de " + username
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Ajouter</button>
      <ul>
        {state.todos.map(item => (
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

#### Passer l'état initial directement {/*passing-the-initial-state-directly*/}

Cet exemple **ne passe pas** la fonction d'initialisation, donc la fonction `createInitialState` s'exécute à chaque rendu, comme lorsque vous tapez dans le champ de saisie. Il n'y a pas de différence perceptible dans le comportement, mais ce code est moins efficace.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Clara" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: "Tâche #" + (i + 1) + " de " + username
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(username)
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Ajouter</button>
      <ul>
        {state.todos.map(item => (
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

## Dépannage {/*troubleshooting*/}

### J'ai dispatché une action, mais la console m'affiche l'ancienne valeur {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

Appeler la fonction `dispatch` **ne change pas l'état dans le code qui est en train de s'exécuter** :

```js {4,5,8}
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // Demande un nouveau rendu avec 43
  console.log(state.age);  // Toujours 42 !

  setTimeout(() => {
    console.log(state.age); // 42 ici aussi !
  }, 5000);
}
```

C'est parce que [l'état se comporte comme un instantané](/learn/state-as-a-snapshot). Mettre à jour un état planifie un nouveau rendu avec sa nouvelle valeur, mais n'affecte pas la variable JavaScript `state` dans votre gestionnaire d'événement en cours d'exécution.

Si vous avez besoin de deviner la prochaine valeur de l'état, vous pouvez la calculer en appelant vous-même votre réducteur :

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

---

### J'ai dispatché une action, mais l'écran ne se met pas à jour {/*ive-dispatched-an-action-but-the-screen-doesnt-update*/}

React **ignorera votre mise à jour si le prochain état est égal à l'état précédent**, déterminé avec une comparaison [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is). C'est généralement ce qui arrive quand vous changez l'objet ou le tableau directement dans l'état :

```js {4-5,9-10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Incorrect : modification de l’objet existant
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 Incorrect : modification de l’objet existant
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

Vous avez modifié un objet existant de `state` puis l'avez renvoyé, React a ainsi ignoré la mise à jour. Pour corriger ça, vous devez toujours vous assurer que vous [mettez à jour les objets dans l'état](/learn/updating-objects-in-state) et [mettez à jour les tableaux dans l'état](/learn/updating-arrays-in-state) plutôt que de les modifier en place :

```js {4-8,11-15}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Correct : création d’un nouvel objet
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ Correct : création d’un nouvel objet
      return {
        ...state,
        name: action.nextName
      };
    }
    // ...
  }
}
```

---

### Une partie de l'état de mon réducteur devient undefined après le dispatch {/*a-part-of-my-reducer-state-becomes-undefined-after-dispatching*/}

Assurez-vous que chaque branche `case` **copie tous les champs existants** lorsqu'elle renvoie le nouvel état :

```js {5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // N’oubliez pas ceci !
        age: state.age + 1
      };
    }
    // ...
```

Sans le `...state` ci-dessus, le prochain état renvoyé ne contiendrait que le champ `age` et rien d'autre.

---

### Tout l'état de mon réducteur devient undefined après le dispatch {/*my-entire-reducer-state-becomes-undefined-after-dispatching*/}

Si votre état devient `undefined` de manière imprévue, c'est que vous avez probablement oublié de `return` l'état dans l'un de vos cas, ou que le type d'action ne correspond à aucune des instructions `case`. Pour comprendre pourquoi, levez une erreur à l'extérieur du `switch` :

```js {10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

Vous pouvez également utiliser un vérificateur de type statique comme TypeScript pour détecter ces erreurs.

---

### J'obtiens l'erreur *“Too many re-renders”* {/*im-getting-an-error-too-many-re-renders*/}

*(« Trop de rendus successifs », NdT)*

Vous pouvez rencontrer l'erreur indiquant `Too many re-renders. React limits the number of renders to prevent an infinite loop.` *(« Trop de rendus successifs. React limite le nombre de rendus pour éviter des boucles infinies », NdT)* Ça signifie généralement que vous dispatchez une action inconditionnellement *pendant un rendu* et ainsi votre composant entre dans une boucle : rendu, dispatch (qui occasionne un rendu), rendu, dispatch (qui occasionne un rendu), et ainsi de suite. Ça vient le plus souvent d'une erreur dans la spécification d'un gestionnaire d'événement :

```js {1-2}
// 🚩 Incorrect : appelle le gestionnaire pendant le rendu
return <button onClick={handleClick()}>Cliquez ici</button>

// ✅ Correct : passe le gestionnaire d’événement
return <button onClick={handleClick}>Cliquez ici</button>

// ✅ Correct : passe une fonction en ligne
return <button onClick={(e) => handleClick(e)}>Cliquez ici</button>
```

Si vous ne trouvez pas la cause de cette erreur, cliquez sur la flèche à côté de l'erreur dans la console et parcourez la pile d'appels JavaScript pour trouver l'appel à la fonction `dispatch` responsable de l'erreur.

---

### Mon réducteur ou ma fonction d'initialisation s'exécute deux fois {/*my-reducer-or-initializer-function-runs-twice*/}

En [Mode Strict](/reference/react/StrictMode), React appellera votre réducteur et votre fonction d'initialisation deux fois. Ça ne devrait pas casser votre code.

Ce comportement **spécifique au développement** vous aide à [garder les composants purs](/learn/keeping-components-pure). React utilise le résultat de l'un des appels et ignore l'autre. Tant que votre composant, votre fonction d'initialisation et votre réducteur sont purs, ça ne devrait pas affecter votre logique. Si toutefois ils sont malencontreusement impurs, ça vous permettra de détecter les erreurs.

Par exemple, cette fonction de réduction impure modifie directement un tableau dans l'état :

```js {4-6}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 Erreur : modification de l’état
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```

Comme React appelle deux fois votre fonction de réduction, vous verrez que la liste a été ajoutée deux fois, vous saurez donc qu'il y a un problème. Dans cet exemple, vous pouvez le corriger [en remplaçant le tableau plutôt que de le modifier en place](/learn/updating-arrays-in-state#adding-to-an-array) :

```js {4-11}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ Correct : remplacement par un nouvel état
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId++, text: action.text }
        ]
      };
    }
    // ...
  }
}
```

Maintenant que cette fonction de réduction est pure, l'appeler une fois de plus ne change pas le comportement. C'est pourquoi React vous aide à détecter des erreurs en l'appelant deux fois. **Seuls les composants, les fonctions d'initialisation et les réducteurs doivent être purs.** Les gestionnaires d'événements n'ont pas besoin de l'être, React ne les appellera donc jamais deux fois.

Lisez [Garder les composants purs](/learn/keeping-components-pure) pour en apprendre davantage.
