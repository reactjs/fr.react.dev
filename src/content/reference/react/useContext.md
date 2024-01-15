---
title: useContext
---

<Intro>

`useContext` est un Hook React qui vous permet de lire et de vous abonner à un [contexte](/learn/passing-data-deeply-with-context) depuis votre composant.

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

Appelez `useContext` à la racine de votre composant pour lire et vous abonner au [contexte](/learn/passing-data-deeply-with-context).

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[Voir d'autres exemples plus bas](#usage).

#### Paramètres {/*parameters*/}

* `SomeContext` : le contexte que vous avez préalablement créé avec [`createContext`](/reference/react/createContext). Le contexte lui-même ne contient pas d'information, il représente seulement le type d'information que vous pouvez fournir ou lire depuis des composants.

#### Valeur renvoyée {/*returns*/}

`useContext` renvoie la valeur du contexte pour le composant qui l'appelle. C'est déterminé par la `value` passée par le `SomeContext.Provider` le plus proche au-dessus du composant appelant. S'il n'y a pas un tel fournisseur, alors la valeur renvoyée sera la `defaultValue` que vous avez passée à [`createContext`](/reference/react/createContext) pour ce contexte. La valeur renvoyée est toujours à jour. React refait automatiquement le rendu des composants qui lisent un contexte lorsque ce dernier change.

#### Limitations {/*caveats*/}

* L'appel à `useContext()` dans un composant n'est pas affecté par les fournisseurs renvoyés par le *même* composant. Le `<Context.Provider>` correspondant **doit figurer *au-dessus*** du composant qui appelle le Hook `useContext()`.
* React **fait automatiquement le rendu** de tous les enfants qui utilisent un contexte spécifique, en commençant par le fournisseur qui reçoit une `value` différente. La valeur précédente et la suivante sont comparées avec [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Sauter des rendus avec [`memo`](/reference/react/memo) n'empêche pas les enfants de recevoir une nouvelle valeur de contexte.
* Le contexte peut être cassé si votre système de construction produit des modules dupliqués en sortie (ce qui peut arriver avec les liens symboliques). Passer quelque chose *via* le contexte ne marche que si le `SomeContext` que vous avez utilisé pour fournir le contexte et le `SomeContext` que vous utilisez pour le lire sont ***exactement* le même objet**, ce qui est déterminé par une comparaison `===`.

---

## Utilisation {/*usage*/}


### Transmettre des données en profondeur dans l'arbre {/*passing-data-deeply-into-the-tree*/}

Appelez `useContext` au niveau le plus élevé de votre composant pour lire et vous abonner au [contexte](/learn/passing-data-deeply-with-context).

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

`useContext` renvoie la <CodeStep step={2}>valeur du contexte</CodeStep> pour le <CodeStep step={1}>contexte</CodeStep> que vous avez passé. Pour définir la valeur du contexte, React remonte dans l'arbre des composants à la recherche du **fournisseur de contexte le plus proche** pour ce contexte particulier.

Pour passer un contexte à un `Button`, il faut enrober ce composant ou l'un de ses parents dans le fournisseur de contexte correspondant :

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... faire le rendu des boutons à l'intérieur ...
}
```

Le nombre de couches de composants qu'il y a entre le fournisseur et le `Bouton` importe peu. Un `Button` situé *n'importe où* à l'intérieur du `Form` reçoit la valeur `"dark"` quand il appelle `useContext(ThemeContext)`.

<Pitfall>

`useContext()` cherche toujours le fournisseur le plus proche *au-dessus* du composant qui l'appelle. Il cherche vers le haut et **ne prend pas en compte** les fournisseurs situés dans le composant à partir duquel vous appelez `useContext()`.

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Bienvenue">
      <Button>S'inscrire</Button>
      <Button>Se connecter</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Mettre à jour les données passées au contexte {/*updating-data-passed-via-context*/}

Vous voudrez souvent que le contexte change avec le temps. Pour mettre à jour le contexte, associez-le à [un état](/reference/react/useState). Déclarez une variable d'état dans le composant parent, et passez l'état actuel au fournisseur en tant que <CodeStep step={2}>valeur de contexte</CodeStep>.

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Passer au thème clair
      </Button>
    </ThemeContext.Provider>
  );
}
```

Désormais, tout `Button` à l'intérieur du fournisseur recevra la valeur actuelle de `theme`. Si vous appelez `setTheme` pour mettre à jour la valeur de `theme` que vous avez passée au fournisseur, tous les `Button` referont leurs rendus avec la nouvelle valeur `"light"`.

<Recipes titleText="Exemples de mises à jour du contexte" titleId="examples-basic">

#### Mettre à jour une valeur *via* le contexte {/*updating-a-value-via-context*/}

Dans cet exemple, le composant `MyApp` contient une variable d'état qui est ensuite passée au fournisseur `ThemeContext`. Cocher la case « Utiliser le mode sombre » met à jour cet état. Changer la valeur fournie refait le rendu de tous les composants utilisant ce contexte.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Utiliser le mode sombre
      </label>
    </ThemeContext.Provider>
  )
}

function Form({ children }) {
  return (
    <Panel title="Bienvenue">
      <Button>S'inscrire</Button>
      <Button>Se connecter</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

Remarquez que `value="dark"` passe la chaîne de caractères `"dark"`, mais que `value={theme}` passe la valeur de la variable JavaScript `theme` en utilisant [les accolades de JSX](/learn/javascript-in-jsx-with-curly-braces). Ces accolades vous permettent également de passer des valeurs de contexte qui ne sont pas des chaînes de caractères.

<Solution />

#### Mettre à jour un objet *via* le contexte {/*updating-an-object-via-context*/}

Dans cet exemple, il y a une variable d'état `currentUser` qui contient un objet. Vous combinez `{ currentUser, setCurrentUser }` en un seul objet que vous transmettez au contexte à l'intérieur de `value={}`. Ça permet à n'importe quel composant situé plus bas dans l'arbre, tel que `LoginButton`, de lire `currentUser` et `setCurrentUser`, et ainsi appeler `setCurrentUser` si nécessaire.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext.Provider>
  );
}

function Form({ children }) {
  return (
    <Panel title="Bienvenue">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>Vous êtes connecté·e en tant que {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Se connecter en tant que Advika</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### Contextes multiples {/*multiple-contexts*/}

Dans cet exemple, il y a deux contextes distincts. `ThemeContext` fournit le thème courant, qui est une chaîne de caractères, tandis que `CurrentUserContext` contient l'objet représentant l'utilisateur actuel.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          Utiliser le mode sombre
        </label>
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Bienvenue">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>Vous êtes connecté·e en tant que {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName.trim() !== '' && lastName.trim() !== '';
  return (
    <>
      <label>
        Prénom :{' '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Nom :{' '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Se connecter
      </Button>
      {!canLogin && <i>Remplissez les deux champs.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Extraire les fournisseurs d'un composant {/*extracting-providers-to-a-component*/}

Au fur et à mesure que votre appli grandit, vous pouvez vous attendre à avoir une « pyramide » de contextes proches de la racine de votre appli. Il n'y a pas de mal à ça. Cependant, si vous n'appréciez pas l'esthétique de cette imbrication, vous pouvez extraire les fournisseurs dans un seul composant. Dans cet exemple, `MyProviders` cache la « plomberie » et fait le rendu des enfants qui lui sont passés dans les fournisseurs appropriés. Remarquez que l'état `theme` et `setTheme` sont nécessaires à `MyApp`, donc `MyApp` conserve cet élément d'état.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Utiliser le mode sombre
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Bienvenue">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>Vous êtes connecté·e en tant que {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        Prénom :{' '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Nom :{' '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Se connecter
      </Button>
      {!canLogin && <i>Remplissez les deux champs.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Montée à l'échelle avec un contexte et un réducteur {/*scaling-up-with-context-and-a-reducer*/}

Dans les applis plus importantes, il est courant de combiner un contexte avec un [réducteur](/reference/react/useReducer) afin d'extraire des composants la logique associée à certains états. Dans cet exemple, toute la « plomberie » est cachée dans `TasksContext.js`, qui contient un réducteur et deux contextes séparés.

Lisez un [guide détaillé](/learn/scaling-up-with-reducer-and-context) de cet exemple.

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Jour de repos à Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

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

const initialTasks = [
  { id: 0, text: 'La promenade du philosophe', done: true },
  { id: 1, text: 'Visiter le temple', done: false },
  { id: 2, text: 'Boire du thé matcha', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Ajouter une tâche"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>Ajouter</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js
import { useState, useContext } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
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

</Recipes>

---

### Spécifier une valeur de secours par défaut {/*specifying-a-fallback-default-value*/}

Si React ne trouve aucun fournisseur pour ce <CodeStep step={1}>contexte</CodeStep> particulier dans l'arbre du parent, la valeur de contexte renvoyée par `useContext()` sera égale à la <CodeStep step={3}>valeur par défaut</CodeStep> que vous avez spécifiée lorsque vous avez [créé ce contexte](/reference/react/createContext) :

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

La valeur par défaut **ne change jamais**. Si vous voulez mettre à jour le contexte, associez-le avec un état comme [décrit plus haut](#updating-data-passed-via-context).

Vous pouvez souvent utiliser une valeur par défaut plus significative que `null`, comme par exemple :

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

De cette façon, si par inadvertance vous faites le rendu de certains composants sans le bon contexte associé, ça ne cassera pas. Ça permet aussi à votre composant de se comporter correctement dans un environnement de test sans avoir à définir tout un tas de fournisseurs pour les tests.

Dans l'exemple ci-dessous, le bouton « Changer de thème » est toujours en clair, parce qu'il se situe **en dehors de tout contexte fournissant le thème**, et la valeur par défaut de ce thème est `'light'`. Essayez de changer la valeur par défaut à `'dark'`.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext.Provider value={theme}>
        <Form />
      </ThemeContext.Provider>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Changer de thème
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Bienvenue">
      <Button>S'inscrire</Button>
      <Button>Se connecter</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Surcharger le contexte pour une partie de l'arbre {/*overriding-context-for-a-part-of-the-tree*/}

Vous pouvez surcharger le contexte pour une partie de l'arbre en l'enrobant avec un fournisseur ayant une valeur différente.

```js {3,5}
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

Vous pouvez imbriquer et surcharger les fournisseurs autant de fois que nécessaire.

<Recipes titleText="Exemples de surcharge de contexte">

#### Surcharger un thème {/*overriding-a-theme*/}

Ici, le bouton *à l'intérieur* du `Footer` reçoit une valeur de contexte différente (`"light"`) de celle reçue par les boutons à l'extérieur (`"dark"`).

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Bienvenue">
      <Button>S'inscrire</Button>
      <Button>Se connecter</Button>
      <ThemeContext.Provider value="light">
        <Footer />
      </ThemeContext.Provider>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Paramètres</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Hiérarchiser automatiquement les en-têtes {/*automatically-nested-headings*/}

Vous pouvez « accumuler » l'information quand vous imbriquez des fournisseurs de contexte. Dans cet exemple, le composant `Section` garde une trace du `LevelContext` qui spécifie la profondeur de l'imbrication des sections. Il lit le `LevelContext` depuis une section parente et fournit à ses enfants le nombre `LevelContext` incrémenté de un. En conséquence, le composant `Heading` peut automatiquement décider laquelle des balises `<h1>`, `<h2>`, `<h3>`, … utiliser en fonction du nombre de composants `Section` à l'intérieur desquels il est imbriqué.

Lisez un [guide détaillé](/learn/passing-data-deeply-with-context) de cet exemple.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Titre</Heading>
      <Section>
        <Heading>Section</Heading>
        <Heading>Section</Heading>
        <Heading>Section</Heading>
        <Section>
          <Heading>Sous-section</Heading>
          <Heading>Sous-section</Heading>
          <Heading>Sous-section</Heading>
          <Section>
            <Heading>Sous-sous-section</Heading>
            <Heading>Sous-sous-section</Heading>
            <Heading>Sous-sous-section</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Optimiser les rendus lorsqu'on passe des objets et des fonctions {/*optimizing-re-renders-when-passing-objects-and-functions*/}

Vous pouvez passer n'importe quelle valeur *via* le contexte, y compris des objets et des fonctions.

```js [[2, 10, "{ currentUser, login }"]]
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      <Page />
    </AuthContext.Provider>
  );
}
```

Ici, la <CodeStep step={2}>valeur de contexte</CodeStep> est un objet JavaScript avec deux propriétés, dont l'une est une fonction. À chaque fois que `MyApp` fait son rendu (par exemple lors d'un changement de route), ce sera un objet *différent* pointant vers une fonction *différente*, React devra donc refaire le rendu de tous les composants situés en profondeur dans l'arbre qui appellent `useContext(AuthContext)`.

Ce n'est pas un problème pour les petites applis. Cependant, il est inutile de faire le rendu si les données sous-jacentes, comme `currentUser`, n'ont pas changé. Pour aider React à tirer parti de ça, vous pouvez enrober la fonction `login` dans un Hook [`useCallback`](/reference/react/useCallback) et la création de l'objet dans un Hook [`useMemo`](/reference/react/useMemo). C'est une optimisation de performances :

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}
```

Grâce à ce changement, même si `MyApp` a besoin d'un nouveau rendu, les composants appelant `useContext(AuthContext)` pourront se l'épargner, à moins que `currentUser` ait changé.

Apprenez-en davantage sur [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) et [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components).

---

## Dépannage {/*troubleshooting*/}

### Mon composant ne voit pas la valeur de mon fournisseur {/*my-component-doesnt-see-the-value-from-my-provider*/}

Il y a plusieurs raisons pour ça se produise :

1. Vous faites le rendu de `<SomeContext.Provider>` dans le même composant (ou en dessous) que celui où vous appelez `useContext()`. Déplacez `<SomeContext.Provider>` *au-dessus et en-dehors* du composant appelant `useContext()`.
2. Vous avez peut-être oublié d'enrober votre composant avec `<SomeContext.Provider>` ou vous l'avez placé dans une partie différente de votre arbre que celle que vous imaginiez. Vérifiez si la hiérarchie est correcte en utilisant [les outils de développement React](/learn/react-developer-tools).
3. Il se peut que vous rencontriez un problème de *build* avec vos outils qui fait que le `SomeContext` vu par le composant fournisseur et le `SomeContext` vu par le composant qui le lit sont deux objets différents. Ça peut arriver si vous utilisez des liens symboliques par exemple. Vous pouvez vous en assurer en les affectant à des variables globales comme `window.SomeContext1` et `window.SomeContext2` et en vérifiant le résultat de `window.SomeContext1 === window.SomeContext2` dans la console. Si elles sont différentes, corrigez le problème au niveau de l'outil de *build*.

### Je reçois `undefined` de mon contexte bien que la valeur par défaut soit différente {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

Vous avez peut-être un fournisseur sans `value` dans l'arbre :

```js {1,2}
// 🚩 Ça ne marche pas : pas de prop « value »
<ThemeContext.Provider>
   <Button />
</ThemeContext.Provider>
```

Oublier de spécifier la `value` revient à passer `value={undefined}`.

Il se peut également que vous ayez utilisé par erreur un autre nom de prop :

```js {1,2}
// 🚩 Ça ne marche pas : la prop doit s'appeler « value »
<ThemeContext.Provider theme={theme}>
   <Button />
</ThemeContext.Provider>
```

Dans ces deux cas, vous devriez voir un message d'alerte de React dans la console. Pour les corriger, appelez la prop `value` :

```js {1,2}
// ✅ Passer la prop « value »
<ThemeContext.Provider value={theme}>
   <Button />
</ThemeContext.Provider>
```

Notez que la [valeur par défaut de votre appel à `createContext(defaultValue)`](#specifying-a-fallback-default-value) est seulement utilisée **s'il n'y a pas d'autre fournisseur correspondant au-dessus**. S'il y a un composant `<SomeContext.Provider value={undefined}>` quelque part dans l'arbre parent, le composant qui appelle `useContext(SomeContext)` *recevra* `undefined` pour la valeur de contexte.
