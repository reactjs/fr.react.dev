---
title: Extraire la logique d’état dans un réducteur
---

<Intro>

Les composants avec beaucoup de mises à jour d'état dispersées dans de nombreux gestionnaires d'événements peuvent devenir difficiles à maîtriser. Dans ces circonstances, vous pouvez consolider toute la logique de mise à jour d'état dans une seule fonction (idéalement extérieure au composant), appelée _réducteur_.

</Intro>

<YouWillLearn>

- Ce qu'est un réducteur
- Comment remplacer `useState` par `useReducer`
- Quand utiliser un réducteur
- Comment l'écrire correctement

</YouWillLearn>

## Consolider la logique d'état avec un réducteur {/*consolidate-state-logic-with-a-reducer*/}

Plus vos composants deviennent complexes, plus il est difficile de voir d'un coup d'œil les différentes façons dont leurs états sont mis à jour. Par exemple, le composant `TaskApp` ci-dessous contient un tableau de `tasks` dans un état et utilise trois gestionnaires d'événements différents pour créer, supprimer ou éditer ces tâches :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Voyage à Prague</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visiter le musée Franz-Kafka', done: true},
  {id: 1, text: 'Voir un spectacle de marionnettes', done: false},
  {id: 2, text: 'Prendre une photo du mur John Lennon', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Ajouter"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Enregistrer</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Modifier</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Supprimer</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Chaque gestionnaire d'événement appelle `setTasks` afin de mettre à jour l'état. Avec l'évolution de ce composant, la quantité de logique qu'il contient grandit également. Pour réduire cette complexité et garder votre logique en un seul endroit facile d'accès, vous pouvez la déplacer dans une fonction unique à l'extérieur du composant, **appelée « réducteur »**.

Les réducteurs proposent une autre façon de gérer l'état. Vous pouvez migrer de `useState` à `useReducer` en trois étapes :

1. **Passez** de l'écriture de l'état au _dispatch_ d'actions.
2. **Écrivez** la fonction du réducteur.
3. **Utilisez** le réducteur depuis votre composant.

### Étape 1 : passez de l'écriture de l'état au _dispatch_ d'actions {/*step-1-move-from-setting-state-to-dispatching-actions*/}

Vos gestionnaires d'événements spécifient pour le moment _ce qu'il faut faire_ en remplaçant l'état :

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

Supprimez toute la logique de définition d'état. Il vous reste ces trois gestionnaires d'événements :

- `handleAddTask(text)` est appelé quand l'utilisateur appuie sur « Ajouter ».
- `handleChangeTask(task)` est appelé quand l'utilisateur bascule l'état de complétion d'une tâche ou appuie sur « Enregistrer ».
- `handleDeleteTask(taskId)` est appelé quand l'utilisateur appuie sur « Supprimer ».

La gestion de l'état avec des réducteurs diffère légèrement d'une définition directe de l'état. Plutôt que de dire à React « quoi faire » en définissant l'état, vous dites « ce que l'utilisateur vient de faire » en émettant des « actions » à partir de vos gestionnaires d'événements (la logique de mise à jour de l'état se situe ailleurs). Ainsi, au lieu de « définir `tasks` » _via_ un gestionnaire d'événement, vous _dispatchez_ une action « ajout / mise à jour / suppression d'une tâche ». C'est davantage une description de l'intention de l'utilisateur.

```js
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
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

L'objet que vous passez à `dispatch` est appelé une « action » :

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // objet « action » :
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

C'est un objet JavaScript ordinaire. Vous décidez ce que vous y mettez, mais généralement il ne doit contenir que les informations sur _ce qui vient d'arriver_ (vous ajouterez la fonction `dispatch` vous-même dans une prochaine étape).

<Note>

Un objet action peut avoir n'importe quelle forme.

Par convention, il est courant d'y mettre une propriété textuelle `type` qui décrit ce qui s'est passé, et d'ajouter les informations complémentaires dans d'autres champs. Le `type` est spécifique à un composant, donc `'added'` ou `'added_task'` conviendraient pour cet exemple. Choisissez un nom qui décrit ce qui s'est passé !

```js
dispatch({
  // Spécifique au composant
  type: 'what_happened',
  // Les autres champs vont ici
});
```

</Note>

### Étape 2 : écrivez une fonction de réduction {/*step-2-write-a-reducer-function*/}

Votre logique d'état se situera dans une fonction de réduction. Elle prend deux arguments, l'état courant et l'objet d'action, puis renvoie le nouvel état :

```js
function yourReducer(state, action) {
  // renvoie le prochain état pour que React l'utilise
}
```

React définira l'état avec ce qu'aura renvoyé le réducteur.

Pour déplacer votre logique de définition d'état des gestionnaires d'événements à une fonction de réduction dans cet exemple, vous :

1. Déclarerez l'état courant (`tasks`) comme premier argument.
2. Déclarerez l'objet `action` comme second argument.
3. Renverrez le _prochain_ état depuis le réducteur (à partir duquel React fixera l'état).

Voici toute la logique de définition d'état une fois migrée vers une fonction de réduction :

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Action inconnue : ' + action.type);
  }
}
```

Puisque la fonction de réduction prend l'état (`tasks`) comme argument, vous pouvez **la déclarer hors de votre composant**. Ça réduit le niveau d'indentation et rend votre code plus facile à lire.

<Note>

Le code plus haut utilise des instructions `if` / `else`, mais nous utiliserons [l'instruction `switch`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/switch) au sein des réducteurs. Le résultat est le même, mais il est sans doute plus facile de lire des instructions `switch` d'un coup d'œil.

Nous les utiliserons dans le reste de cette documentation de cette façon :

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Action inconnue : ' + action.type);
    }
  }
}
```

Nous recommandons d'enrober chaque bloc `case` entre des accolades `{` et `}` afin qu'il n'y ait pas d'interférences entre les variables déclarées dans chacun des `case`. De plus, un `case` doit généralement se terminer par un `return`. Si vous l'oubliez, le code va « dégringoler » sur le `case` suivant, ce qui peut entraîner des erreurs !

Si vous n'êtes pas à l'aise avec les instructions `switch`, vous pouvez tout à fait utiliser des `if` / `else`.

</Note>

<DeepDive>

#### D'où vient le terme « réducteur » ? {/*why-are-reducers-called-this-way*/}

Bien que les réducteurs puissent « réduire » la taille du code dans votre composant, ils sont en réalité appelés ainsi en référence à l'opération [`reduce()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) que vous pouvez exécuter sur les tableaux.

L'opération `reduce()` permet de prendre un tableau puis « d'accumuler » une seule valeur à partir de celles du tableau :

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

La fonction que vous passez à `reduce` est appelée « réducteur ». Elle prend le _résultat en cours_ et l'_élément courant_, puis renvoie le _prochain résultat_. Les réducteurs React sont un exemple de la même idée : ils prennent _l'état en cours_ et une _action_, puis renvoient le _prochain état_. De cette façon, ils accumulent avec le temps les actions au sein de l'état.

Vous pourriez d'ailleurs utiliser la méthode `reduce()` avec un `initialState` et un tableau d'`actions` pour calculer l'état final en lui passant votre fonction de réduction :

<Sandpack>

```js src/index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Visiter le musée Franz-Kafka'},
  {type: 'added', id: 2, text: 'Voir un spectacle de marionnettes'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Prendre une photo du mur John Lennon'},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Action inconnue : ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

Vous n'aurez probablement pas besoin de le faire vous-même, mais c'est similaire à ce que fait React !

</DeepDive>

### Étape 3 : utilisez le réducteur depuis votre composant {/*step-3-use-the-reducer-from-your-component*/}

Pour finir, vous devez connecter le `tasksReducer` à votre composant. Commencez par importer le Hook `useReducer` depuis React :

```js
import { useReducer } from 'react';
```

Ensuite, vous pouvez remplacer le `useState` :

```js
const [tasks, setTasks] = useState(initialTasks);
```

…par `useReducer` de cette façon :

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

Le Hook `useReducer` est similaire à `useState` : d'une part vous devez lui passer un état initial, d'autre part il renvoie une valeur d'état ainsi qu'un moyen de le redéfinir (en l'occurrence, la fonction de _dispatch_). Toutefois, des différences existent.

Le Hook `useReducer` prend deux arguments :

1. Une fonction de réduction.
2. Un état initial.

Il renvoie :

1. Une valeur d'état.
2. Une fonction _dispatch_ (pour « _dispatcher_ » les actions de l'utilisateur vers le réducteur).

Tout est câblé maintenant ! Ici, le réducteur est déclaré à la fin du fichier de composant :

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Voyage à Prague</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Action inconnue : ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visiter le musée Franz-Kafka', done: true},
  {id: 1, text: 'Voir un spectacle de marionnettes', done: false},
  {id: 2, text: 'Prendre une photo du mur John Lennon', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Ajouter"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Enregistrer</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Modifier</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Supprimer</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Si vous voulez, vous pouvez même déplacer le réducteur dans un fichier à part :

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Voyage à Prague</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visiter le musée Franz-Kafka', done: true},
  {id: 1, text: 'Voir un spectacle de marionnettes', done: false},
  {id: 2, text: 'Prendre une photo du mur John Lennon', done: false},
];
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Action inconnue : ' + action.type);
    }
  }
}
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Ajouter"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Enregistrer</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Modifier</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Supprimer</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

La logique des composants peut être plus simple à lire quand vous séparez les responsabilités de cette façon. Maintenant les gestionnaires d'événements spécifient seulement _ce qui s'est passé_ en _dispatchant_ les actions, et la fonction de réduction détermine _comment l'état se met à jour_ en réponse à celles-ci.

## Comparaison de `useState` et `useReducer` {/*comparing-usestate-and-usereducer*/}

Les réducteurs ne sont pas sans inconvénients ! Voici quelques éléments de comparaison :

- **Taille du code** : avec un `useState`, vous devez généralement écrire moins de code au début. Avec `useReducer`, vous devez écrire à la fois la fonction de réduction _et_ _dispatcher_ les actions. Cependant, `useReducer` peut aider à réduire le code si plusieurs gestionnaires d'événements modifient l'état local de façon similaire.
- **Lisibilité** : `useState` est très facile à lire lorsque les mises à jour d'état sont simples. Mais quand ça se complique, elles peuvent gonfler le code de votre composant et le rendre difficile à analyser. Dans ce cas, `useReducer` vous permet de séparer proprement le _comment_ de la logique du _ce qui est arrivé_ des gestionnaires d'événements.
- **Débogage** : quand vous avez un bug avec un `useState`, il peut être difficile de dire _où_ l'état a été mal défini et _pourquoi_. Avec un `useReducer`, vous pouvez ajouter des messages dans la console depuis votre réducteur pour voir chaque mise à jour d'état et _pourquoi_ elles ont lieu (en rapport à quelle `action`). Si chaque `action` est correcte, vous saurez que le problème se trouve dans la logique de réduction elle-même. En revanche, vous devez parcourir plus de code qu'avec `useState`.
- **Tests** : un réducteur est une fonction pure qui ne dépend pas de votre composant. Ça signifie que vous pouvez l'exporter et la tester en isolation. Bien qu'il soit généralement préférable de tester des composants dans un environnement plus réaliste, pour une logique de mise à jour d'état plus complexe, il peut être utile de vérifier que votre réducteur renvoie un état spécifique pour un état initial et une action particuliers.
- **Préférence personnelle** : certaines personnes aiment les réducteurs, d'autres non. Ce n'est pas grave. C'est une question de préférence. Vous pouvez toujours convertir un `useState` en un `useReducer` et inversement : ils sont équivalents !

Nous recommandons d'utiliser un réducteur si vous rencontrez souvent des bugs à cause de mauvaises mises à jour d'état dans un composant et que vous souhaitez introduire plus de structure dans son code. Vous n'êtes pas obligé·e d'utiliser les réducteurs pour tout : n'hésitez pas à mélanger les approches ! Vous pouvez aussi utiliser `useState` et `useReducer` dans le même composant.

## Écrire les réducteurs correctement {/*writing-reducers-well*/}

Gardez ces deux points à l'esprit quand vous écrivez des réducteurs :

- **Les réducteurs doivent être purs.** Tout comme les [fonctions de mise à jour d'état](/learn/queueing-a-series-of-state-updates), les réducteurs sont exécutés pendant le rendu! ! (Les actions sont mises en attente jusqu'au rendu suivant.) Ça signifie que les réducteurs [doivent être purs](/learn/keeping-components-pure) — les mêmes entrées doivent toujours produire les mêmes sorties. Ils ne doivent pas envoyer de requêtes, planifier des _timers_ ou traiter des effets secondaires (des opérations qui impactent des entités extérieures au composant). Ils doivent mettre à jour des [objets](/learn/updating-objects-in-state) et [des tableaux](/learn/updating-arrays-in-state) en respectant l'immutabilité.
- **Chaque action décrit une interaction utilisateur unique, même si ça entraîne plusieurs modifications des données.** Par exemple, si l'utilisateur appuie sur le bouton « Réinitialiser » d'un formulaire comportant cinq champs gérés par un réducteur, il sera plus logique de _dispatcher_ une seule action `reset_form` plutôt que cinq actions `set_field` distinctes. Si vous journalisez chaque action d'un réducteur, ce journal doit être suffisamment clair pour vous permettre de reconstruire l'ordre et la nature des interactions et de leurs traitements. Ça facilite le débogage !

## Écrire des réducteurs concis avec Immer {/*writing-concise-reducers-with-immer*/}

Comme  pour la [mise à jour des objets](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) et [des tableaux](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) dans un état ordinaire, vous pouvez utiliser la bibliothèque Immer pour rendre les réducteurs plus concis. Ici, [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) vous permet de modifier l'état avec un appel à `push` ou encore une affectation `arr[i] =` :

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
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Action inconnue : ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Voyage à Prague</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visiter le musée Franz-Kafka', done: true},
  {id: 1, text: 'Voir un spectacle de marionnettes', done: false},
  {id: 2, text: 'Prendre une photo du mur John Lennon', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Ajouter"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Enregistrer</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Modifier</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Supprimer</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
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

Les réducteurs doivent être purs, donc ils ne doivent pas modifier l'état. Cependant, Immer fournit un objet spécial `draft` qu'il est possible de modifier. Sous le capot, Immer créera une copie de votre état avec les changements que vous avez appliqué sur le `draft`. C'est pourquoi les réducteurs gérés par `useImmerReducer` peuvent modifier leur premier argument et n'ont pas besoin de renvoyer l'état.

<Recap>

- Pour convertir `useState` vers `useReducer` :
  1. _Dispatchez_ les actions depuis des gestionnaires d'événements.
  2. Écrivez une fonction de réduction qui s'occupera de renvoyer le prochain état, à partir d'un état et d'une action donnés.
  3. Remplacez `useState` par `useReducer`.
- Les réducteurs vous obligent à écrire un peu plus de code, mais ils facilitent le débogage et les tests.
- Les réducteurs doivent être purs.
- Chaque action décrit une interaction utilisateur unique.
- Utilisez Immer si vous souhaitez écrire des réducteurs en modifiant directement l'état entrant.

</Recap>

<Challenges>

#### _Dispatcher_ des actions depuis des gestionnaires d'événements {/*dispatch-actions-from-event-handlers*/}

Pour l'instant, les gestionnaires d'événements dans `ContactList.js` et `Chat.js` contiennent des commentaires `// TODO`. C'est pour ça que taper au clavier dans le champ de saisie ne marche pas, et cliquer sur les boutons ne change pas le destinataire sélectionné.

Remplacez ces deux commentaires `// TODO` par du code qui `dispatch` les actions correspondantes. Pour connaître la forme attendue et le type des actions, allez voir le réducteur dans `messengerReducer.js`. Il est déjà écrit, vous n'avez donc pas besoin de le changer. Vous devez seulement _dispatcher_ les actions dans `ContactList.js` et `Chat.js`.

<Hint>

La fonction `dispatch` est déjà disponible dans les deux composants parce qu'elle a été passée comme une prop. Vous devez donc appeler `dispatch`avec l'objet d'action correspondant.

Pour vérifier la forme de l'objet d'action, vous pouvez examiner le réducteur et voir à quels champs d'`action` il s'attend. Par exemple, le cas de l'action `changed_selection` du réducteur ressemble à ceci :

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

Ça signifie que votre objet d'action doit avoir `type: 'changed_selection'`. Vous remarquez aussi que le `action.contactId` est utilisé, vous devez donc inclure une propriété `contactId` dans votre action.

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Clara', email: 'clara@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Bonjour',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Action inconnue : ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                // TODO : dispatcher changed_selection
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Discuter avec ' + contact.name}
        onChange={(e) => {
          // TODO : dispatcher edited_message
          // (Lire la valeur d’entrée dans e.target.value)
        }}
      />
      <br />
      <button>Envoyer à {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Sur la base du code du réducteur, vous pouvez déduire que les actions doivent ressembler à ceci :

```js
// Quand l’utilisateur choisit "Alice"
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// Quand l’utilisateur tape « Bonjour ! »
dispatch({
  type: 'edited_message',
  message: 'Bonjour !',
});
```

Voici l'exemple mis à jour afin pour envoyer les messages correspondants :

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Clara', email: 'clara@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Bonjour',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Action inconnue : ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Discuter avec ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Envoyer à {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

</Solution>

#### Vider la saisie après l'envoi d'un message {/*clear-the-input-on-sending-a-message*/}

Pour le moment, appuyer sur le bouton « Envoyer » ne fait rien du tout. Ajoutez un gestionnaire d'événement au bouton « Envoyer » qui va :

1. Afficher une `alert` avec l'e-mail du destinataire et le message.
2. Vider le champ de saisie.

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Clara', email: 'clara@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Bonjour',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Action inconnue : ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Discuter avec ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Envoyer à {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Il existe plusieurs façons de procéder dans le gestionnaire d'événement du bouton « Envoyer ». L'une d'elle consiste à afficher une alerte et _dispatcher_ une action `edited_message` avec un `message` vide :

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Clara', email: 'clara@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Bonjour',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Action inconnue : ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Discuter avec ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Envoi de « ${message} » à ${contact.email}`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}>
        Envoyer à {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Ça fonctionne et le champ de saisie est vidé quand vous appuyez sur « Envoyer ».

Cependant, _du point de vue de l'utilisateur_, envoyer un message constitue une action différente de celle de l'édition du champ. Pour faire cette distinction, vous pouvez plutôt créer un _nouvelle_ action appelée `sent_message`, et la gérer séparément dans le réducteur :

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Clara', email: 'clara@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js active
export const initialState = {
  selectedId: 0,
  message: 'Bonjour',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Action inconnue : ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Discuter avec ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Envoi de « ${message} » à ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Envoyer à {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Le comportement visible reste identique. Cependant, gardez à l'esprit que les types d'action doivent idéalement décrire « ce qu'a fait l'utilisateur » plutôt que « la façon dont vous voulez que l'état change ». Respecter cette philosophie facilite l'ajout de fonctionnalités par la suite.

Quelle que soit l'approche retenue, il est important que vous ne placiez _pas_ l'`alert` dans un réducteur. Le réducteur doit être une fonction pure : il doit se limiter au calcul du prochain état. Il ne doit rien « faire », y compris afficher des messages à l'utilisateur. Ça doit être fait dans le gestionnaire d'événement (pour détecter ce genre d'erreur, React en Mode Strict appellera vos réducteurs plusieurs fois. Du coup, si vous placez une alerte dans un réducteur, vous la verrez deux fois).

</Solution>

#### Restaurer les valeurs de saisie au changement d'onglet {/*restore-input-values-when-switching-between-tabs*/}

Dans cet exemple, changer de destinataires vide toujours le champ de saisie :

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // Vide la saisie
  };
```

En effet, vous ne souhaitez pas partager un seul brouillon de message entre plusieurs destinataires. Néanmoins, il serait préférable que votre appli « se souvienne » des brouillons pour chaque contact séparément, et les restaure quand vous changez de contact.

Votre tâche consiste à modifier la façon dont l'état est structuré afin de mémoriser le brouillon _pour chaque contact_. Vous aurez besoin d'appliquer quelques changements au réducteur, à l'état initial ainsi qu'aux composants.

<Hint>

Vous pouvez changer la structure de votre état ainsi :

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Bonjour, Clara', // Brouillon pour contactId = 0
    1: 'Bonjour, Alice', // Brouillon pour contactId = 1
  },
};
```

La syntaxe `[key]: value` des [noms de propriétés calculés](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Object_initializer#noms_de_propri%C3%A9t%C3%A9s_calcul%C3%A9s) peut vous aider à mettre à jour l'objet `messages` :

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Clara', email: 'clara@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Bonjour',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Action inconnue : ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Discuter avec ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Envoi de « ${message} » à ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Envoyer à {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Vous devrez mettre à jour le réducteur pour conserver et mettre à jour un message distinct pour chaque contact :

```js
// Quand la saisie est modifiée
case 'edited_message': {
  return {
    // Garder le reste de l’état, comme la sélection
    ...state,
    messages: {
      // Garder les messages des autres contacts
      ...state.messages,
      // Mais changer celui du contact sélectionné
      [state.selectedId]: action.message
    }
  };
}
```

Vous devrez aussi mettre à jour le composant `Messenger` pour lire le message du contact sélectionné :

```js
const message = state.messages[state.selectedId];
```

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Clara', email: 'clara@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Bonjour, Clara',
    1: 'Bonjour, Alice',
    2: 'Bonjour, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Action inconnue : ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Discuter avec ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Envoi de « ${message} » à ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Envoyer à {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Notez que vous n'avez pas eu besoin de modifier les gestionnaires d'événements pour implémenter ce nouveau comportement. Sans réducteur, vous auriez dû changer chaque gestionnaire d'événement qui met à jour l'état.

</Solution>

#### Implémenter `useReducer` de zéro {/*implement-usereducer-from-scratch*/}

Dans les exemples précédents, vous avez importé le Hook `useReducer` de React. Cette fois, vous allez implémenter _le Hook `useReducer` vous-même_ ! Voici un bout de code pour démarrer. Ça ne devrait pas vous prendre plus de 10 lignes de code.

Pour tester vos modifications, essayez de taper dans le champ de saisie ou choisissez un contact.

<Hint>

Voici une esquisse plus détaillée de l'implémentation :

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

Souvenez-vous qu'une fonction de réduction prend deux arguments — l'état courant et l'objet d'action — et renvoie le prochain état. Que doit en faire votre implémentation de `dispatch` ?

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Clara', email: 'clara@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Bonjour, Clara',
    1: 'Bonjour, Alice',
    2: 'Bonjour, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Action inconnue : ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Discuter avec ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Envoi de « ${message} » à ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Envoyer à {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

*Dispatcher* une action appelle un réducteur avec l'état actuel et l'action, puis conserve le résultat comme prochain état. Voici à quoi ça ressemble dans le code :

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Clara', email: 'clara@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Bonjour, Clara',
    1: 'Bonjour, Alice',
    2: 'Bonjour, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Action inconnue : ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Discuter avec ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Envoi de « ${message} » à ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Envoyer à {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Bien que ça n'ait pas d'importance dans la plupart des cas, une implémentation un peu plus précise ressemble à ça :

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

En effet, les actions _dispatchées_ sont mises en file d'attente jusqu'au prochain rendu, [exactement comme les fonctions de mise à jour](/learn/queueing-a-series-of-state-updates).

</Solution>

</Challenges>
