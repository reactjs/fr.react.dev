---
title: Gérer l’état
---

<Intro>

Au fur et à mesure que votre application se développe, il est utile de réfléchir à la façon dont vous organisez votre état et à la façon dont les données circulent entre vos composants. Les états redondants ou dupliqués sont une source fréquente de bugs.
Dans ce chapitre, vous apprendrez à bien structurer votre état, à garder une logique de mise à jour de l'état maintenable, et à partager l'état entre des composants distants.

</Intro>

<YouWillLearn isChapter={true}>

* [Comment modéliser les changements d’interface en tant que changements d'état](/learn/reacting-to-input-with-state)
* [Comment bien structurer l’état](/learn/choosing-the-state-structure)
* [Comment « faire remonter l'état » pour le partager entre les composants](/learn/sharing-state-between-components)
* [Comment contrôler si l'état est préservé ou réinitialisé](/learn/preserving-and-resetting-state)
* [Comment consolider une logique d'état complexe dans une fonction](/learn/extracting-state-logic-into-a-reducer)
* [Comment transmettre l’information sans « faire percoler les props »](/learn/passing-data-deeply-with-context)
* [Comment adapter la gestion d’état à la croissance de votre application](/learn/scaling-up-with-reducer-and-context)

</YouWillLearn>

## Réagir à la saisie avec un état {/*reacting-to-input-with-state*/}

Avec React, vous ne modifierez pas l’interface utilisateur directement à partir du code. Par exemple, vous n'écrirez pas de commandes telles que « désactive le bouton », « active le bouton », « affiche le message de réussite », etc. Au lieu de ça, vous décrirez l’interface utilisateur que vous souhaitez voir apparaître pour les différents états visuels de votre composant (« état initial », « état de saisie », « état de réussite »), puis vous déclencherez les changements d'état en réponse aux interactions de l’utilisateur. Ça ressemble à la façon dont les designers réfléchissent à l’interface utilisateur.

Voici un formulaire de quiz construit avec React. Voyez comment il utilise la variable d'état `status` pour déterminer s'il faut activer ou désactiver le bouton d’envoi, et s'il faut plutôt afficher le message de réussite.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>C’est exact !</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>Quiz sur les villes</h2>
      <p>
        Dans quelle ville trouve-t-on un panneau d’affichage qui transforme l’air en eau potable ?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Imaginez que ça fait une requête réseau
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Bonne idée, mais mauvaise réponse. Réessayez !'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

<LearnMore path="/learn/reacting-to-input-with-state">

Lisez **[Réagir à la saisie avec un état](/learn/reacting-to-input-with-state)** pour apprendre à aborder les interactions dans une optique d’état.

</LearnMore>

## Choisir la structure de l'état {/*choosing-the-state-structure*/}

Une bonne structuration de l'état peut faire la différence entre un composant agréable à modifier et à déboguer, et un composant qui est une source constante de bugs. Le principe le plus important est que l'état ne doit pas contenir d’informations redondantes ou dupliquées.
S'il y a des éléments d’état inutiles, il est facile d’oublier de les mettre à jour et d’introduire des bugs !

Par exemple, ce formulaire a une variable d'état `fullName` **redondante** :

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Enregistrez-vous :</h2>
      <label>
        Prénom :{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Nom :{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Votre billet sera au nom de : <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Vous pouvez la retirer et simplifier le code en calculant `fullName` à l’affichage du composant :

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Enregistrez-vous :</h2>
      <label>
        Prénom :{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Nom :{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Votre billet sera au nom de : <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Ce changement peut sembler mineur, mais de nombreux bugs dans les applis React se corrigent ainsi.

<LearnMore path="/learn/choosing-the-state-structure">

Lisez **[Choisir la structure de l'état](/learn/choosing-the-state-structure)** pour apprendre à architecturer votre état afin d'éviter les bugs.

</LearnMore>

## Partager l'état entre des composants {/*sharing-state-between-components*/}

Parfois, vous souhaitez que l’état de deux composants change toujours en même temps. Pour cela, retirez l’état des deux composants, déplacez-le vers leur ancêtre commun le plus proche, puis transmettez-leur par l’intermédiaire des props. C’est ce qu’on appelle « faire remonter l’état », et c’est l’une des choses que vous ferez le plus souvent en écrivant du code React.

Dans l’exemple qui suit, seul un panneau devrait être actif à tout moment. Pour ce faire, au lieu de conserver l'état actif au sein de chaque panneau, le composant parent conserve l'état et spécifie les props de ses enfants.

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="À propos"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Avec une population d’environ 2 millions d’habitants, Almaty est la plus grande ville du Kazakhstan. De 1929 à 1997, elle en était la capitale.
      </Panel>
      <Panel
        title="Étymologie"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        Le nom vient de <span lang="kk-KZ">алма</span>, le mot kazakh pour « pomme » et est souvent traduit comme « plein de pommes ». En fait, la région d’Almaty est considérée comme le berceau ancestral de la pomme, et la <i lang="la">Malus sieversii</i> sauvage est considérée comme l’ancêtre probable de la pomme domestique moderne.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Afficher
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/sharing-state-between-components">

Lisez **[Partager l’état entre des composants](/learn/sharing-state-between-components)** pour apprendre comment faire remonter l’état et garder des composants synchronisés.

</LearnMore>

## Préserver et réinitialiser l'état {/*preserving-and-resetting-state*/}

Lorsque vous rafraîchissez un composant, React doit décider quelles parties de l’arbre doivent être conservées (et mises à jour), et quelles parties doivent être supprimées ou recréées à partir de zéro. Dans la plupart des cas, le comportement automatique de React fonctionne assez bien. Par défaut, React préserve les parties de l’arbre qui « correspondent » avec l’arbre de composants du rendu précédent.

Cependant, il arrive que ce ne soit pas ce que vous souhaitez. Dans cette appli de discussion, le fait de taper un message puis de changer de destinataire ne réinitialise pas la saisie. L’utilisateur risque ainsi d’envoyer accidentellement un message à la mauvaise personne :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Thierry', email: 'thierry@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Écrire à ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Envoyer à {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

React vous permet d’outrepasser le comportement par défaut, et de *forcer* un composant à réinitialiser son état en lui passant une `key` différente, comme `<Chat key={email} />`. Ça dit à React que si le destinataire est différent, alors le composant `Chat` est considéré comme *différent* et doit être recréé à partir de zéro avec les nouvelles données (et l’interface utilisateur, par exemple les champs de saisie). À présent, passer d’un destinataire à l’autre réinitialise le champ de saisie, même si vous affichez le même composant.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Thierry', email: 'thierry@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Écrire à ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Envoyer à {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

<LearnMore path="/learn/preserving-and-resetting-state">

Lisez **[Préserver et réinitialiser l'état](/learn/preserving-and-resetting-state)** pour apprendre le cycle de vie d’un état et comment le contrôler.

</LearnMore>

## Extraire la logique d'état dans un réducteur {/*extracting-state-logic-into-a-reducer*/}

Les composants comportant de nombreuses mises à jour d'état réparties entre de nombreux gestionnaires d'événements peuvent devenir intimidants. Dans un tel cas, vous pouvez consolider toute la logique de mise à jour de l'état en-dehors de votre composant dans une seule fonction, appelée « réducteur » *(reducer, NdT)*. Vos gestionnaires d'événements deviennent concis car ils ne spécifient que les « actions » de l’utilisateur. Au bas du fichier, la fonction du réducteur spécifie comment l'état doit être mis à jour en réponse à chaque action !

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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
      <h1>Itinéraire à Prague</h1>
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
      throw Error('Action inconnue : ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visiter le musée Kafka', done: true },
  { id: 1, text: 'Spectacle de marionnettes', done: false },
  { id: 2, text: 'Photo du mur Lennon', done: false }
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
          Valider
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

<LearnMore path="/learn/extracting-state-logic-into-a-reducer">

Lisez **[Extraire la logique d'état dans un réducteur](/learn/extracting-state-logic-into-a-reducer)** pour apprendre à consolider la logique au sein d’une fonction réducteur.

</LearnMore>

## Transmettre des données en profondeur avec le contexte {/*passing-data-deeply-with-context*/}

Habituellement, vous transmettez des informations d’un composant parent à un composant enfant par l’intermédiaire des props. Mais le passage des props peut s'avérer gênant si vous devez faire passer une information à travers plusieurs composants, ou si plusieurs composants ont besoin de la même information.
Le contexte permet au composant parent de rendre certaines informations disponibles à n’importe quel composant de l’arbre situé en-dessous de lui--quelle que soit sa profondeur--sans avoir à les transmettre explicitement par le biais de props.

Ici, le composant `Heading` détermine son niveau d’en-tête en « demandant » son niveau à la `Section` la plus proche. Chaque `Section` détermine son propre niveau en demandant à la `Section` parente le sien, et en lui ajoutant un. Chaque `Section` fournit des informations à tous les composants situés en-dessous d’elle sans passer de props--elle le fait par le biais du contexte.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Titre</Heading>
      <Section>
        <Heading>En-tête</Heading>
        <Heading>En-tête</Heading>
        <Heading>En-tête</Heading>
        <Section>
          <Heading>Sous-en-tête</Heading>
          <Heading>Sous-en-tête</Heading>
          <Heading>Sous-en-tête</Heading>
          <Section>
            <Heading>Sous-sous-en-tête</Heading>
            <Heading>Sous-sous-en-tête</Heading>
            <Heading>Sous-sous-en-tête</Heading>
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
      throw Error("Un en-tête doit être à l’intérieur d’une section !");
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
      throw Error('Niveau inconnu : ' + level);
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

<LearnMore path="/learn/passing-data-deeply-with-context">

Lisez **[Transmettre des données en profondeur avec le contexte](/learn/passing-data-deeply-with-context)** pour apprendre à utiliser le contexte comme une alternative aux props.

</LearnMore>

## Mise à l'échelle en combinant réducteur et contexte {/*scaling-up-with-reducer-and-context*/}

Les réducteurs vous permettent de consolider la logique de mise à jour de l'état d’un composant. Le contexte vous permet de transmettre des informations en profondeur à d’autres composants. Vous pouvez combiner les réducteurs et le contexte pour gérer l'état d’un écran complexe.

Avec cette approche, un composant parent ayant un état complexe le gère à l’aide d’un réducteur. D’autres composants situés à n’importe quel endroit de l’arbre peuvent lire son état *via* le contexte. Ils peuvent également envoyer des actions pour mettre à jour cet état.

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Journée de repos à Kyoto</h1>
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
      <TasksDispatchContext.Provider
        value={dispatch}
      >
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
      throw Error('Action inconnue : ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Le chemin des philosophes', done: true },
  { id: 1, text: 'Visiter le temple', done: false },
  { id: 2, text: 'Boire du matcha', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask({ onAddTask }) {
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
          Valider
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

<LearnMore path="/learn/scaling-up-with-reducer-and-context">

Lisez **[Mise à l'échelle en combinant réducteur et contexte](/learn/scaling-up-with-reducer-and-context)** pour apprendre comment adapter la gestion d’état à une application en pleine croissance.

</LearnMore>

## Et maintenant ? {/*whats-next*/}

Allez sur [Réagir à la saisie avec un état](/learn/reacting-to-input-with-state) pour commencer à lire ce chapitre page par page !

Ou alors, si vous êtes déjà à l’aise avec ces sujets, pourquoi ne pas explorer les [échappatoires](/learn/escape-hatches)?
