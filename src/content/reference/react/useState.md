---
title: useState
---

<Intro>

`useState` est un Hook React qui ajoute une [variable d'état](/learn/state-a-components-memory) dans votre composant.

```js
const [state, setState] = useState(initialState)
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

La convention est de nommer les variables d'états de cette manière : `[something, setSomething]`, en utilisant la [déstructuration positionnelle](https://fr.javascript.info/destructuring-assignment).

[Voir d’autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `initialState`: La valeur initiale de votre état. Ça peut être une valeur de n'importe quel type, mais il existe un comportement spécial pour les fonctions. Cet argument est ignoré après le rendu initial.
  * Si vous passez une fonction comme `initialState`, elle sera traitée comme une _fonction d'initialisation_. Elle doit être pure, ne doit pas prendre d'argument, et doit retourner une valeur qui peut être de n'importe quel type. React appellera votre fonction d'initialisation en initialisant le composant, et stockera sa valeur de retour dans votre état initial. [Voir un exemple ci-dessous](#avoiding-recreating-the-initial-state).

#### Valeur renvoyée {/*returns*/}

`useState` retourne un tableau avec exactement deux valeurs :

1. L'état courant. Lors du premier rendu, ce sera l'`initialState` que vous avez passé en argument.
2. La [fonction de mise à jour](#setstate). Elle vous permet de mettre à jour l'état avec une valeur différente et de déclencher un nouveau rendu.

#### Limitations {/*caveats*/}

* `useState` est un Hook, vous ne pouvez donc l’appeler qu'**à la racine de votre composant** ou de vos propres Hooks. Vous ne pouvez pas l’appeler à l’intérieur de boucles ou de conditions. Si nécessaire, extrayez un nouveau composant et déplacez l'état dans celui-ci.
* En Mode Strict, React **appellera votre fonction d'initialisation deux fois** afin de vous aider à [détecter des impuretés accidentelles](#my-initializer-or-updater-function-runs-twice). Ce comportement est uniquement présent en mode développement et n'affecte pas la production. Si votre fonction d'initialisation est pure (ce qui devrait être le cas), ça ne devrait pas affecter le comportement. Le résultat d'un des appels sera ignoré.

---

### Les fonctions de mise à jour, comme `setSomething(nextState)` {/*setstate*/}

La fonction de mise à jour renvoyée par `useState` permet de mettre à jour l'état avec une valeur différente et de déclencher un nouveau rendu. Vous pouvez passer le prochain état directement, ou passer une fonction qui le calcule sur base de l'état précédent :

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Clara');
  setAge(a => a + 1);
  // ...
```

#### Paramètres {/*setstate-parameters*/}

* `nextState`: La valeur désirée de l'état. Elle peut être de n'importe quel type, mais les fonctions reçoivent un traitement spécifique.
  * Si vous passez une fonction en tant que `nextState`, elle sera traitée comme une _fonction de mise à jour_. Elle doit être pure, doit prendre l'état en attente comme unique argument, et doit retourner le prochain état. React placera votre fonction de mise à jour dans une file d'attente et fera un nouveau rendu de votre composant. Pendant ce prochain rendu, React calculera le prochain état en appliquant toutes les fonctions de mise à jour l'une après l'autre, en commençant avec l'état précédent. [Voir un exemple ci-dessous](#updating-state-based-on-the-previous-state).

#### Valeur renvoyée {/*setstate-returns*/}

Les fonctions de mise à jour (celles renvoyées par `useState`) n'ont pas de valeur de retour.

#### Limitations et points à noter {/*setstate-caveats*/}

* La fonction de mise à jour **ne met à jour que les variables d'état pour le *prochain* rendu**. Si vous lisez la variable d'état après avoir appelé la fonction de mise à jour, [vous obtiendrez la même ancienne valeur](#ive-updated-the-state-but-logging-gives-me-the-old-value) qui était sur votre écran avant l'appel.

* Si la nouvelle valeur que vous donnez est identique au `state` actuel, en comparant au moyen de [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React **ne fera pas un nouveau rendu de ce composant et de ses enfants**. Il s'agit d'une optimisation. Même si, dans certains cas, React a tout de même besoin d'appeler votre composant sans faire de rendu de ses enfants, ça ne devrait pas affecter votre code.

* React [met à jour les états par lots](/learn/queueing-a-series-of-state-updates). Il met à jour l'écran **après que tous les gestionnaires d'événements ont été lancés** et qu'ils auront appelé leurs fonctions de mise à jour. Ça évite des rendus inutiles suite à un unique événement. Dans les rares cas où vous auriez besoin de forcer React à mettre à jour l'écran plus tôt, par exemple pour accéder au DOM, vous pouvez utiliser [`flushSync`](/reference/react-dom/flushSync).

* La fonction de mise à jour a une identité stable, elle ne figure donc généralement pas dans les dépendances des Effets, mais l'inclure n'entraînera pas un déclenchement d'Effet superflu.  Si le *linter* vous permet de l'omettre sans erreurs, c'est que cette omission est sans danger. [Apprenez-en davantage sur l'allègement des dépendances d'Effets](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* Il est possible d'appeler la fonction de mise à jour *pendant le rendu*, mais uniquement au sein du composant en cours de rendu. React ignorera le JSX résultat pour refaire immédiatement un rendu avec le nouvel état. Cette approche est rarement nécessaire, mais vous pouvez l'utiliser pour **stocker des informations des précédents rendus**. [Voir un exemple ci-dessous](#storing-information-from-previous-renders).

* En Mode Strict, React **appellera votre fonction d'initialisation deux fois** afin de vous aider à [détecter des impuretés accidentelles](#my-initializer-or-updater-function-runs-twice). Ce comportement est spécifique au mode développement et n'affecte pas la production. Si votre fonction de mise à jour est pure (ce qui devrait être le cas), ça ne devrait pas affecter le comportement. Le résultat d'un des appels sera ignoré.

---

## Utilisation {/*usage*/}

### Ajouter un état à un composant {/*adding-state-to-a-component*/}

Appelez `useState` à la racine de votre composant pour déclarer une ou plusieurs [variables d'état](/learn/state-a-components-memory).

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Clara'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Clara');
  // ...
```

Par convention, on nomme les variables d'état comme suit : `[something, setSomething]`, en utilisant la [déstructuration positionnelle](https://fr.javascript.info/destructuring-assignment).

`useState` renvoie un tableau avec exactement deux valeurs :

1. L'<CodeStep step={1}>état courant</CodeStep> de cette variable d'état, initialement le même que l'<CodeStep step={3}>état initial</CodeStep> que vous avez passé en entrée.
2. La <CodeStep step={2}>fonction de mise à jour</CodeStep> qui vous permet d'en modifier la valeur lors d'une interaction.

Pour mettre à jour l'affichage, appelez la fonction de mise à jour avec le prochain état :

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React stockera ce prochain état, fera un nouveau rendu de votre composant avec les nouvelles valeurs, et mettra à jour l'interface utilisateur *(UI pour User Interface, NdT)*.

<Pitfall>

Appeler la fonction de mise à jour [**ne change pas** l'état actuel dans le code en train d'être exécuté](#ive-updated-the-state-but-logging-gives-me-the-old-value) :

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // Toujours "Clara" !
}
```

Elle n'affecte que ce que `useState` renverra à partir du *prochain* rendu.

</Pitfall>

<Recipes titleText="Exemples basiques d'utilisation de useState" titleId="examples-basic">

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

Dans cet exemple, la variable d'état `text` contient une chaîne de caractères. Lors de la frappe, `handleChange` lit la dernière valeur du champ de saisie dans le DOM, et appelle `setText` pour mettre à jour l'état. Ça vous permet d'afficher le `text` courant en dessous.

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
      <p>Vous avez saisi : {text}</p>
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

Dans cet exemple, la variable d'état `liked` contient un booléen. Lorsque vous cliquez sur la case, `setLiked` met à jour la variable d'état `liked` selon que la case est cochée ou non. La variable `liked` est utilisée dans le rendu du texte sous la case à cocher.

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
        J’ai aimé
      </label>
      <p>Vous {liked ? 'avez' : 'n’avez pas'} aimé.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Formulaire (deux variables) {/*form-two-variables*/}

Vous pouvez déclarer plus d'une variable d'état dans le même composant. Chaque variable d'état est complètement indépendante des autres.

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

### Mettre à jour l'état sur base de l'état précédent {/*updating-state-based-on-the-previous-state*/}

Supposons que `age` vaille `42`. Ce gestionnaire appelle `setAge(age + 1)` trois fois :

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

Cependant, après un click, `age` ne va valoir que `43`, plutôt que `45` ! C'est parce qu'appeler la fonction de mise à jour [ne met pas à jour](/learn/state-as-a-snapshot) la variable d'état `age` dans le code en cours d'exécution. Donc, chaque appel à `setAge(age + 1)` devient `setAge(43)`.

Pour résoudre ce problème, **vous devez passer une *fonction de mise à jour*** à `setAge` au lieu du prochain état :

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

Ici, `a => a + 1` est votre fonction de mise à jour. Elle prend l'<CodeStep step={1}>état en attente</CodeStep> et calcule à partir de celui-ci le <CodeStep step={2}>prochain état</CodeStep>.

React met vos fonctions de mise à jour dans une [file d'attente](/learn/queueing-a-series-of-state-updates). Ensuite, pendant le prochain rendu, il va les appeler dans le même ordre :

1. `a => a + 1` recevra un état en attente à `42` et renverra `43` comme prochain état.
1. `a => a + 1` recevra un état en attente à `43` et renverra `44` comme prochain état.
1. `a => a + 1` recevra un état en attente à `44` et renverra `45` comme prochain état.

Il n'y a pas d'autres mises à jour en file d'attente, React stockera donc au final `45` comme état courant.

La convention veut qu'on nomme l'argument de l'état en attente selon la première lettre du nom de la variable d'état, comme `a` pour `age`. Cependant, vous pouvez tout aussi bien le nommer `prevAge`, ou quelque chose d'autre que vous trouveriez plus explicite.

En développement, React pourra [appeler vos mises à jour deux fois](#my-initializer-or-updater-function-runs-twice) pour vérifier qu'elles sont [pures](/learn/keeping-components-pure).

<DeepDive>

#### Est-il toujours préférable d'utiliser une fonction de mise à jour ? {/*is-using-an-updater-always-preferred*/}

Certains vous recommandront peut-être de toujours écrire votre code de cette manière, si l'état que vous mettez à jour est calculé depuis l'état précédent : `setAge(a => a + 1)`. Il n'y a aucun mal à ça, mais ce n'est pas toujours nécessaire.

Dans la plupart des cas, il n'y a aucune différence entre ces deux approches. React s'assurera toujours, pour les actions intentionnelles des utilisateurs, que l'état `age` sera à jour pour le prochain click. Il n'y a donc aucun risque qu'un gestionnaire de clic voie un `age` "obsolète" au début d'un écouteur d'événement.

Cependant, si vous effectuez plusieurs mises à jour pour le même événement, les fonctions de mises à jours peuvent être utiles. Elles sont également utiles s'il n'est pas pratique d'accéder à la variable d'état elle-même (vous pourrez rencontrer ce cas lorsque vous cherchez à optimiser les rendus).

Si vous souhaitez rester cohérent·e dans le style employé, au prix d'une syntaxe légèrement plus verbeuse, vous pouvez choisir de toujours recourir à une fonction de mise à jour lorsque l'état que vous mettez à jour est calculé à partir de l'état précédent. S'il est calculé depuis l'état précédent d'une *autre* variable d'état, vous pourrez peut-être les combiner en un seul objet et [utiliser un réducteur](/learn/extracting-state-logic-into-a-reducer).

</DeepDive>

<Recipes titleText="La différence entre passer une fonction de mise à jour et passer directement le prochain état" titleId="examples-updater">

#### Passer la fonction de mise à jour {/*passing-the-updater-function*/}

Cet exemple passe la fonction de mise à jour, du coup le bouton "+3" fonctionne.

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
      <h1>Votre âge : {age}</h1>
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

Cet exemple **ne passe pas** la fonction de mise à jour, résultat le bouton "+3" **ne fonctionne pas comme prévu**.

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
      <h1>Votre âge : {age}</h1>
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

Vous pouvez utiliser des objets et des tableaux dans un état. En React, un état est considéré comme en lecture seule, **vous devez donc *remplacer* vos objets existants plutôt que les *modifier***. Par exemple, si vous avez un objet `form` dans un état, ne le modifiez pas :

```js
// 🚩 Ne modifiez pas un objet dans un état comme ceci :
form.firstName = 'Clara';
```

À la place, replacez l'objet entier en en créant un nouveau :

```js
// ✅ Remplacez l'état avec un nouvel objet
setForm({
  ...form,
  firstName: 'Clara'
});
```

Consultez [Mettre à jour les objets d'un état](/learn/updating-objects-in-state) et [Mettre à jour les tableaux d'un état](/learn/updating-arrays-in-state) pour en savoir plus.

<Recipes titleText="Exemples d'objets et de tableaux dans un état" titleId="examples-objects">

#### Formulaire (objet) {/*form-object*/}

Dans cet exemple, la variable d'état `form` contient un objet. Chaque champ de saisie possède un gestionnaire de changement qui appelle `setForm` avec le prochain état du formulaire tout entier. La syntaxe de *spread* `{...form}` permet de s'assurer que l'état de l'objet est remplacé, plutôt que modifié.

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
        Prénom :
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
        Nom de famille :
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
        Mail :
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

Dans cet exemple, l'état est constitué d'objets imbriqués. Lorsque vous mettez à jour un état imbriqué, vous devez créer une copie de l'objet que vous mettez à jour, ainsi que de tous les objets « conteneurs ». Consultez [Mettre à jour un objet imbriqué](/learn/updating-objects-in-state#updating-a-nested-object) pour en savoir plus.

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
        Nom :
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Titre :
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Ville :
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image :
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
        (situé à {person.artwork.city})
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

Dans cet exemple, la variable d'état `todos` contient un tableau. Chaque gestionnaire de bouton appelle `setTodos` avec la prochaine version de ce tableau. La syntaxe de *spread* `[...todos]`, ainsi que `todos.map()` et `todos.filter()`, permettent de remplacer l'état du tableau, plutôt que de le modifier.

<Sandpack>

```js src/App.js
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

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Ajouter une tâche"
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

```js src/TaskList.js
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
          Modifier
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

#### Du code de mise à jour plus concis grâce à Immer {/*writing-concise-update-logic-with-immer*/}

Si le fait de mettre à jour des tableaux et des objets en préservant l'immutabilité vous paraît fastidieux, vous pouvez utiliser une bibliothèque pour réduire le code répétitif, comme [Immer](https://github.com/immerjs/use-immer). Immer vous permet d'écrire du code concis comme si vous modifiiez les objets, mais en pratique il préserve l'immutabilité :

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
      <h1>Art à voir</h1>
      <h2>Ma liste d'œuvres d'art à voir :</h2>
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

### Éviter de recalculer l'état initial {/*avoiding-recreating-the-initial-state*/}

React sauvegarde l'état initial et l'ignore lors des rendus ultérieurs.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

Même si le résultat de `createInitialTodos()` est utilisé seulement pour le rendu initial, vous appelez tout de même cette fonction à chaque rendu. Ça peut gâcher les performances si vous créez de grands tableaux ou effectuez des calculs coûteux.

Pour résoudre cette problématique, vous pouvez **passer plutôt une fonction _d'initialisation_** à `useState` :

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

Remarquez que vous passez désormais `createInitialTodos`, c'est-à-dire *la fonction elle-même*, au lieu de `createInitialTodos()`, qui est le résultat de l'appel. Si vous passez une fonction à `useState`, React ne l'appellera que pendant l'initialisation.

React pourra [appeler vos fonctions d'initialisations deux fois](#my-initializer-or-updater-function-runs-twice) afin de vérifier qu'elles sont [pures](/learn/keeping-components-pure).

<Recipes titleText="La différence entre passer une fonction d'initialisation et passer directement l'état initial" titleId="examples-initializer">

#### Passer la fonction d'initialisation {/*passing-the-initializer-function*/}

Cet exemple passe la fonction `createInitialTodos` en tant que fonction d'initialisation, afin qu'elle ne soit lancée que lors de l'initialisation. Elle n'est pas lancée quand le composant effectue un nouveau rendu, par exemple lorsque vous tapez dans le champ de saisie.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Élément ' + (i + 1)
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

#### Passer directement l'état initial {/*passing-the-initial-state-directly*/}

Cet exemple **ne passe pas** de fonction d'initialisation, de sorte que `createInitialTodos` est appelée à chaque rendu, y compris lorsque vous tapez dans le champ de saisie. Il n'y a pas de différence perceptible de comportement, mais le code est moins efficace.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Élément ' + (i + 1)
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

Vous rencontrerez souvent la *prop* `key` dans des [rendus de listes](/learn/rendering-lists). Sachez qu'elle a une autre utilité.

Vous pouvez **réinitialiser l'état d'un composant en lui passant une `key` différente**. Dans cet exemple, le bouton Réinitialiser change la variable d'état `version`, laquelle est passée comme `key` au `Form`. Quand la `key` change, React recrée le composant `Form` (et tous ses enfants) à partir de zéro, ce qui réinitialise son état.

Consultez [Préserver et réinitialiser l'état](/learn/preserving-and-resetting-state) pour en savoir plus.

<Sandpack>

```js src/App.js
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

La plupart du temps, vous mettrez à jour les états dans des gestionnaires d'événements. Cependant, dans de rares cas, vous pourriez vouloir ajuster l'état en fonction du rendu -- par exemple, pour modifier une variable d'état quand une propriété change.

Dans la plupart des cas, vous n'en avez en réalité pas besoin :

* **Si la valeur dont vous avez besoin peut être totalement calculée à partir des propriétés actuelles ou d'un autre état, [supprimez carrément cette variable d'état redondante](/learn/choosing-the-state-structure#avoid-redundant-state)**. Si vous craignez d'effectuer alors de nouveaux calculs trop fréquemment, le [Hook `useMemo`](/reference/react/useMemo) peut vous aider.
* Si vous voulez réinitialiser l'intégralité des états du composant et de ses enfants, [passez une `key` différente à votre composant](#resetting-state-with-a-key).
* Si vous le pouvez, mettez à jour tous les états pertinents dans des gestionnaires d'événements.

Dans de rares autres cas, il existe une approche que vous pouvez utiliser pour mettre à jour un état sur la base des valeurs actuelles du rendu : appelez sa fonction de mise à jour pendant le rendu de votre composant.

Voici un exemple. Ce composant `CountLabel` affiche une prop `count` qui lui est passée :

```js src/CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

Mettons que vous vouliez indiquer si le compteur a *augmenté ou diminué* depuis le dernier changement. La prop `count` ne vous permet pas de le savoir -- vous avez besoin de garder trace de sa dernière valeur. Ajoutez la variable d'état `prevCount` pour y parvenir. Puis ajoutez une autre variable d'état appelée `trend` qui permet de savoir si le compteur a augmenté ou diminué. Comparez `prevCount` avec `count`, et, s'ils ne sont pas égaux, mettez à jour `prevCount` et `trend`. Vous pouvez maintenant afficher tant la prop du compteur courant que *la façon dont elle a changé depuis le dernier rendu*.

<Sandpack>

```js src/App.js
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

```js src/CountLabel.js active
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

Notez que si vous appelez une fonction de mise à jour pendant le rendu, elle doit être assujettie à une condition, telle que `prevCount !== count`, laquelle contrôle l'appel, tel que `setPrevCount(count)`. À défaut, votre composant effectuera des rendus en boucle jusqu'à cause un plantage. De plus, vous ne pouvez mettre ainsi à jour que l'état du composant *en cours de rendu*. Appeler une fonction de mise à jour issue d'un *autre* composant pendant le rendu entraîne une erreur. Pour finir, votre appel de mise à jour devrait toujours [mettre à jour l'état sans le modifier](#updating-objects-and-arrays-in-state) -- appeler depuis le rendu ne vous autorise pas à enfreindre les règles des [fonctions pures](/learn/keeping-components-pure).

Cette approche peut être délicate à bien comprendre : la plupart du temps, vous devriez l'éviter. Cependant, c'est toujours mieux que de mettre à jour un état au sein d'un effet. Lorsque vous appelez une fonction de mise à jour pendant le rendu, React effectuera un nouveau rendu de ce composant immédiatement après que votre fonction composant a terminé avec un `return`, avant d'effectuer le rendu de ses enfants. Grâce à ça, les enfants n'auront pas besoin d'effectuer deux rendus. Le reste de votre fonction composant s'exécutera toujours (et le résultat sera jeté). Si votre condition se situe en dessous de tous les appels à des Hooks, vous pouvez même y ajouter un `return;` anticipé pour déclencher le nouveau rendu plus tôt.

---

## Dépannage {/*troubleshooting*/}

### J'ai mis à jour l'état, mais je vois toujours l'ancienne valeur {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

Appeler la fonction de mise à jour **ne modifie pas l'état dans le code en cours d"exécution** :

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Demande un nouveau rendu avec 1
  console.log(count);  // Toujours 0 !

  setTimeout(() => {
    console.log(count); // Encore 0 !
  }, 5000);
}
```

C'est parce que l'[état se comporte comme un instantané](/learn/state-as-a-snapshot). Mettre à jour l'état planifie un autre rendu avec la nouvelle valeur d'état, mais n'affecte pas la variable JavaScript `count` dans le gestionnaire d'événements en train de s'exécuter.

Si vous avez besoin du prochain état, vous pouvez le sauvegarder dans une variable avant de le passer dans la fonction de mise à jour :

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### J'ai mis à jour l'état, mais l'affichage ne se met pas à jour {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React **ignorera votre mise à jour si le prochain état est égal à l'état précédent**, en comparant au moyen de [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Ça arrive généralement lorsque vous modifiez directement un objet ou un tableau dans l'état :

```js
obj.x = 10;  // 🚩 Erroné : mutation d’un objet existant
setObj(obj); // 🚩 Ne fait rien
```

Vous avez modifié un objet `obj` existant et vous l'avez passé à `setObj`, donc React ignore la mise à jour (c'est la même référence, le même objet en mémoire). Pour corriger ça, vous devez vous assurer de [toujours _remplacer_ les objets et les tableaux de l'état plutôt que les _modifier_](#updating-objects-and-arrays-in-state) :

```js
// ✅ Correct : création d’un nouvel objet
setObj({
  ...obj,
  x: 10
});
```

---

### J'ai une erreur : "Too many re-renders" {/*im-getting-an-error-too-many-re-renders*/}

Vous verrez peut-être une erreur disant : `Too many re-renders. React limits the number of renders to prevent an infinite loop` _(« Trop re rendus successifs.  React limite le nombre de rendus pour éviter une boucle infinie », NdT)_. Ça signifie le plus souvent que vous mettez à jour un état de manière inconditionnelle *pendant le rendu*, de sorte que votre composant entre dans une boucle : rendu, mise à jour de l'état (qui déclenche un rendu), rendu, mise à jour de l'état (qui entraîne un rendu), etc. Le plus souvent, ça vient d'une erreur classique de fourniture d'un gestionnaire d'événement :

```js {1-2}
// 🚩 Erroné : appelle le gestionnaire pendant le rendu
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct : passe le gestionnaire d’événement
return <button onClick={handleClick}>Click me</button>

// ✅ Correct : passe une fonction créée à la volée
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

Si vous n'arrivez pas à trouver le cause de cette erreur, cliquez dans la console sur la flèche à côté de l'erreur, et examinez votre pile d'appels JavaScript afin d'y repérer la fonction de mise à jour responsable de l'erreur.

---

### Ma fonction d'initialisation (ou de mise à jour) est exécutée deux fois {/*my-initializer-or-updater-function-runs-twice*/}

En [Mode Strict](/reference/react/StrictMode), React appellera certaines de vos fonctions plutôt deux fois qu'une :

```js {2,5-6,11-12}
function TodoList() {
  // Cette fonction composant sera appelée deux fois par rendu.

  const [todos, setTodos] = useState(() => {
    // Cette fonction d'initialisation sera appelée deux fois par rendu.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // Cette fonction de mise à jour sera appelée deux fois par clic.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

C'est voulu, et ça ne devrait pas casser votre code.

Ce comportement, **uniquement présent en développement**, vous aide à [garder vos composants purs](/learn/keeping-components-pure). React utilise le résultat d'un des appels et ignore le résultat de l'autre. Tant que vos composants, vos fonctions d'initialisation, et vos fonctions de mise à jour sont pures, ça ne devrait pas affecter le comportement. Cependant, si elles sont accidentellement impures, ça vous aide à détecter le problème.

Par exemple, cette fonction de mise à jour impure modifie directement un tableau dans un état :

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Erreur : modification en place de l'état
  prevTodos.push(createTodo());
});
```
Comme React a appelé votre fonction de mise à jour à deux reprises, vous verrez que la tâche a été ajoutée deux fois, et vous saurez qu'il y a une erreur. Dans cet exemple, vous pouvez corriger l'erreur en [remplaçant le tableau, plutôt que de le modifier](#updating-objects-and-arrays-in-state) :

```js {2,3}
setTodos(prevTodos => {
  // ✅ Correct : remplacement par un nouvel état
  return [...prevTodos, createTodo()];
});
```

Maintenant que cette fonction de mise à jour est pure, l'appeler une fois de plus n'entraîne aucune différence de comportement. C'est en cela que le double appel par React vous aide à détecter les problèmes. **Seuls les composants, les fonctions d'initialisation et les fonctions de mise à jour doivent être purs**. Les gestionnaires d'événements n'ont pas besoin d'être purs, aussi React ne les appellera jamais deux fois.

Consultez [Garder les composants purs](/learn/keeping-components-pure) pour en savoir plus.

---

### J'essaie de placer une fonction dans un état, mais elle est appelée directement {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

Vous ne pouvez pas mettre une fonction dans un état comme ceci :

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

Comme vous passez une fonction, React part du principe que `someFunction` est une [fonction d'initialisation](#avoiding-recreating-the-initial-state), et que `someOtherFunction` est une [fonction de mise à jour](#updating-state-based-on-the-previous-state) ; il va donc les appeler pour stocker leurs résultats. Afin de *stocker* effectivement une fonction, dans les deux cas vous devrez la préfixer par `() =>`. Dans ce cas, React stockera les fonctions que vous passez.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
