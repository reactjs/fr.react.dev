---
title: useTransition
---

<Intro>

<<<<<<< HEAD
`useTransition` est un Hook React qui vous permet de mettre à jour l'état sans bloquer l'UI.
=======
`useTransition` is a React Hook that lets you render a part of the UI in the background.
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useTransition()` {/*usetransition*/}

Appelez `useTransition` au niveau racine de votre composant pour marquer certaines mises à jour d'état comme étant des Transitions.

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

`useTransition` ne prend aucun argument.

#### Valeur renvoyée {/*returns*/}

`useTransition` renvoie un tableau avec exactement deux éléments :

<<<<<<< HEAD
1. Le drapeau `isPending` qui vous indique si la Transition est en cours.
2. La [fonction `startTransition`](#starttransition) qui vous permet de marquer une mise à jour d'état comme Transition.

---

### La fonction `startTransition` {/*starttransition*/}

La fonction `startTransition` renvoyée par `useTransition` vous permet de marquer une mise à jour d'état comme étant une Transition.
=======
1. The `isPending` flag that tells you whether there is a pending Transition.
2. The [`startTransition` function](#starttransition) that lets you mark updates as a Transition.

---

### `startTransition(action)` {/*starttransition*/}

The `startTransition` function returned by `useTransition` lets you mark an update as a Transition.
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

<<<<<<< HEAD
#### Paramètres {/*starttransition-parameters*/}

* `scope` : une fonction qui met à jour l'état en appelant au moins une [fonction `set`](/reference/react/useState#setstate).  React appelle immédiatement `scope` sans argument et marque toutes les mises à jour d'état demandées durant l'exécution synchrone de `scope` comme des Transitions.  Elles seront [non bloquantes](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) et [n'afficheront pas d'indicateurs de chargement indésirables](/reference/react/useTransition#preventing-unwanted-loading-indicators).
=======
<Note>
#### Functions called in `startTransition` are called "Actions". {/*functions-called-in-starttransition-are-called-actions*/}

The function passed to `startTransition` is called an "Action". By convention, any callback called inside `startTransition` (such as a callback prop) should be named `action` or include the "Action" suffix:

```js {1,9}
function SubmitButton({ submitAction }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          submitAction();
        });
      }}
    >
      Submit
    </button>
  );
}

```

</Note>



#### Parameters {/*starttransition-parameters*/}

* `action`: A function that updates some state by calling one or more [`set` functions](/reference/react/useState#setstate). React calls `action` immediately with no parameters and marks all state updates scheduled synchronously during the `action` function call as Transitions. Any async calls that are awaited in the `action` will be included in the Transition, but currently require wrapping any `set` functions after the `await` in an additional `startTransition` (see [Troubleshooting](#react-doesnt-treat-my-state-update-after-await-as-a-transition)). State updates marked as Transitions will be [non-blocking](#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators](#preventing-unwanted-loading-indicators).
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

#### Valeur renvoyée {/*starttransition-returns*/}

`startTransition` ne renvoie rien.

#### Limitations et points à noter {/*starttransition-caveats*/}

* `useTransition` est un Hook, il ne peut donc être appelé qu'au sein de composants ou de Hooks personnalisés.  Si vous avez besoin de démarrer une Transition à un autre endroit (par exemple, depuis une bibliothèque de gestion de données), utilisez plutôt la fonction autonome [`startTransition`](/reference/react/startTransition).

* Vous pouvez enrober une mise à jour dans une Transition uniquement si vous avez accès à la fonction `set` de l'état en question.  Si vous souhaitez démarrer une Transition en réaction à une prop ou à la valeur renvoyée par un Hook personnalisé, utilisez plutôt [`useDeferredValue`](/reference/react/useDeferredValue).

<<<<<<< HEAD
* La fonction que vous passez à `startTransition` doit être synchrone.  React exécute cette fonction immédiatement, et marque toutes les mises à jour demandées lors de son exécution comme des Transitions.  Si vous essayez de faire des mises à jour d'état plus tard (par exemple avec un timer), elles ne seront pas marquées comme des Transitions.
=======
* The function you pass to `startTransition` is called immediately, marking all state updates that happen while it executes as Transitions. If you try to perform state updates in a `setTimeout`, for example, they won't be marked as Transitions.

* You must wrap any state updates after any async requests in another `startTransition` to mark them as Transitions. This is a known limitation that we will fix in the future (see [Troubleshooting](#react-doesnt-treat-my-state-update-after-await-as-a-transition)).
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

* La fonction `startTransition` a une identité stable, elle ne figure donc généralement pas dans les dépendances des Effets, mais l'inclure n'entraînera pas un déclenchement d'Effet superflu.  Si le *linter* vous permet de l'omettre sans erreurs, c'est que cette omission est sans danger. [Apprenez-en davantage sur l'allègement des dépendances d'Effets](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* Une mise à jour d'état marquée comme une Transition pourra être interrompue par d'autres mises à jour d'état.  Par exemple, si vous mettez à jour un composant de graphe au sein d'une Transition, mais commencez alors une saisie dans un champ texte tandis que le graphe est en train de refaire son rendu, React redémarrera le rendu du composant graphe après avoir traité la mise à jour d'état du champ.

* Les mises à jour en Transition ne peuvent pas être utilisées pour contrôler des champs textuels.

<<<<<<< HEAD
* Si plusieurs Transitions sont en cours, React les regroupe pour le moment.  Cette limitation sera sans doute levée dans une future version.

---
=======
* If there are multiple ongoing Transitions, React currently batches them together. This is a limitation that may be removed in a future release.
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

## Utilisation {/*usage*/}

<<<<<<< HEAD
### Marquer une mise à jour d'état comme étant une Transition non bloquante {/*marking-a-state-update-as-a-non-blocking-transition*/}

Appelez `useTransition` au niveau racine de votre composant pour marquer des mises à jour d'état comme étant des *Transitions* non bloquantes.
=======
### Perform non-blocking updates with Actions {/*perform-non-blocking-updates-with-actions*/}

Call `useTransition` at the top of your component to create Actions, and access the pending state:
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import {useState, useTransition} from 'react';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` renvoie un tableau avec exactement deux éléments :

<<<<<<< HEAD
1. Le <CodeStep step={1}>drapeau `isPending`</CodeStep> qui vous indique si la Transition est en cours.
2. La <CodeStep step={2}>fonction `startTransition`</CodeStep> qui vous permet de marquer une mise à jour d'état comme Transition.

Vous pouvez marquer une mise à jour d'état comme étant une Transition de la façon suivante :
=======
1. The <CodeStep step={1}>`isPending` flag</CodeStep> that tells you whether there is a pending Transition.
2. The <CodeStep step={2}>`startTransition` function</CodeStep> that lets you create an Action.

To start a Transition, pass a function to `startTransition` like this:
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

```js
import {useState, useTransition} from 'react';
import {updateQuantity} from './api';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);

  function onSubmit(newQuantity) {
    startTransition(async function () {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  }
  // ...
}
```

<<<<<<< HEAD
Les Transitions vous permettent de conserver la réactivité des mises à jour d'interface utilisateur, même sur des appareils lents.

Avec une Transition, votre UI reste réactive pendant le rendu. Par exemple, si l'utilisateur clique sur un onglet mais ensuite change d'avis et va sur un autre onglet, il peut le faire sans devoir d'abord attendre que le premier onglet ait fini son rendu.

<Recipes titleText="La différence entre useTransition et des mises à jour d’état classiques" titleId="examples">

#### Changer l'onglet actif au sein d'une Transition {/*updating-the-current-tab-in-a-transition*/}

Dans cet exemple, l'onglet « Articles » est **artificiellement ralenti** pour que son rendu prenne au moins une seconde.

Cliquez sur « Articles » puis cliquez immédiatement sur « Contact ». Remarquez que ça interrompt le rendu lent d'« Articles ». L'onglet « Contact » est affiché immédiatement.  Puisque la mise à jour d'état est marquée comme une Transition, un rendu lent ne gèle pas pour autant l'interface utilisateur.
=======
The function passed to `startTransition` is called the "Action". You can update state and (optionally) perform side effects within an Action, and the work will be done in the background without blocking user interactions on the page. A Transition can include multiple Actions, and while a Transition is in progress, your UI stays responsive. For example, if the user clicks a tab but then changes their mind and clicks another tab, the second click will be immediately handled without waiting for the first update to finish. 

To give the user feedback about in-progress Transitions, to `isPending` state switches to `true` at the first call to `startTransition`, and stays `true` until all Actions complete and the final state is shown to the user. Transitions ensure side effects in Actions to complete in order to [prevent unwanted loading indicators](#preventing-unwanted-loading-indicators), and you can provide immediate feedback while the Transition is in progress with `useOptimistic`.

<Recipes titleText="The difference between Actions and regular event handling">

#### Updating the quantity in an Action {/*updating-the-quantity-in-an-action*/}

In this example, the `updateQuantity` function simulates a request to the server to update the item's quantity in the cart. This function is *artificially slowed down* so that it takes at least a second to complete the request.

Update the quantity multiple times quickly. Notice that the pending "Total" state is shown while any requests are in progress, and the "Total" updates only after the final request is complete. Because the update is in an Action, the "quantity" can continue to be updated while the request is in progress.
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const updateQuantityAction = async newQuantity => {
    // To access the pending state of a transition,
    // call startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
<<<<<<< HEAD
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        À propos
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Articles (lent)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
=======
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}
```

```js src/Item.js
import { startTransition } from "react";

export default function Item({action}) {
  function handleChange(event) {
    // To expose an action prop, call the callback in startTransition.
    startTransition(async () => {
      action(event.target.value);
    })
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

<<<<<<< HEAD
```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Bienvenue sur mon profil !</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Un seul log. La lenteur réside en fait dans SlowPost.
  console.log('[ARTIFICIELLEMENT LENT] Rendu de 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Ne rien faire pendant 1 ms par élément pour simuler
    // du code extrêmement lent.
  }

  return (
    <li className="item">
      Article #{index + 1}
    </li>
  );
=======
```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
}
```

<<<<<<< HEAD
```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Vous me trouverez en ligne ici :
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
=======
```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

This is a basic example to demonstrate how Actions work, but this example does not handle requests completing out of order. When updating the quantity multiple times, it's possible for the previous requests to finish after later requests causing the quantity to update out of order. This is a known limitation that we will fix in the future (see [Troubleshooting](#my-state-updates-in-transitions-are-out-of-order) below).

For common use cases, React provides built-in abstractions such as:
- [`useActionState`](/reference/react/useActionState)
- [`<form>` actions](/reference/react-dom/components/form)
- [Server Functions](/reference/rsc/server-functions)

These solutions handle request ordering for you. When using Transitions to build your own custom hooks or libraries that manage async state transitions, you have greater control over the request ordering, but you must handle it yourself.

<Solution />

<<<<<<< HEAD
#### Changer l'onglet actif sans Transitions {/*updating-the-current-tab-without-a-transition*/}

Dans cet exemple, l'onglet « Articles » est toujours **artificiellement ralenti** pour que son rendu prenne au moins une seconde. Mais contrairement à l'exemple précédent, la mise à jour d'état ne figure **pas dans une Transition**.

Cliquez sur « Articles » puis cliquez immédiatement sur « Contact ». Remarquez que l'appli gèle pendant le rendu de l'onglet lent, et que l'UI ne répond plus. La mise à jour d'état ne figure pas dans une Transition, de sorte que le rendu lent gèle l'interface utilisateur.
=======
#### Updating the quantity without an Action {/*updating-the-users-name-without-an-action*/}

In this example, the `updateQuantity` function also simulates a request to the server to update the item's quantity in the cart. This function is *artificially slowed down* so that it takes at least a second to complete the request.

Update the quantity multiple times quickly. Notice that the pending "Total" state is shown while any requests is in progress, but the "Total" updates multiple times for each time the "quantity" was clicked:
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
<<<<<<< HEAD

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        À propos
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Articles (lent)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
=======
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
}
```

```js src/App.js
import { useState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async newQuantity => {
    // Manually set the isPending State.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({onUpdateQuantity}) {
  function handleChange(event) {
    onUpdateQuantity(event.target.value);
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

<<<<<<< HEAD
```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Bienvenue sur mon profil !</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Un seul log. La lenteur réside en fait dans SlowPost.
  console.log('[ARTIFICIELLEMENT LENT] Rendu de 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Ne rien faire pendant 1 ms par élément pour simuler
    // du code extrêmement lent.
  }

  return (
    <li className="item">
      Article #{index + 1}
    </li>
  );
=======
```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
}
```

<<<<<<< HEAD
```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Vous me trouverez en ligne ici :
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
=======
```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

A common solution to this problem is to prevent the user from making changes while the quantity is updating:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async event => {
    const newQuantity = event.target.value;
    // Manually set the isPending state.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item isPending={isPending} onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({isPending, onUpdateQuantity}) {
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        disabled={isPending}
        onChange={onUpdateQuantity}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

This solution makes the app feel slow, because the user must wait each time they update the quantity. It's possible to add more complex handling manually to allow the user to interact with the UI while the quantity is updating, but Actions handle this case with a straight-forward built-in API.

<Solution />

</Recipes>

---

<<<<<<< HEAD
### Mettre à jour le composant parent dans une Transition {/*updating-the-parent-component-in-a-transition*/}

Vous pouvez tout aussi bien mettre à jour l'état du composant parent depuis un appel à `useTransition`.  Par exemple, le composant `TabButton` enrobe la logique de son `onClick` avec une Transition :
=======
### Exposing `action` prop from components {/*exposing-action-props-from-components*/}

You can expose an `action` prop from a component to allow a parent to call an Action.


For example, this `TabButton` component wraps its `onClick` logic in an `action` prop:
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

```js {8-10}
export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

<<<<<<< HEAD
Puisque le composant parent met à jour son état au sein du gestionnaire d'événement `onClick`, cette mise à jour d'état sera marquée comme étant une Transition.  C'est pourquoi, comme dans l'exemple précédent, vous pouvez cliquer sur « Articles » puis immédiatement sur « Contact ».  Le changement d'onglet est marqué comme étant une Transition : il ne bloque donc pas les interactions utilisateur.
=======
Because the parent component updates its state inside the `action`, that state update gets marked as a Transition. This means you can click on "Posts" and then immediately click "Contact" and it does not block user interactions:
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        À propos
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Articles (lent)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Bienvenue sur mon profil !</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Un seul log. La lenteur réside en fait dans SlowPost.
  console.log('[ARTIFICIELLEMENT LENT] Rendu de 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Ne rien faire pendant 1 ms par élément pour simuler
    // du code extrêmement lent.
  }

  return (
    <li className="item">
      Article #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Vous me trouverez en ligne ici :
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

---

<<<<<<< HEAD
### Afficher une indication visuelle pendant la Transition {/*displaying-a-pending-visual-state-during-the-transition*/}
=======
### Displaying a pending visual state {/*displaying-a-pending-visual-state*/}
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

Vous pouvez utiliser la valeur booléenne `isPending` renvoyée par `useTransition` pour indiquer à l'utilisateur qu'une Transition est en cours.  Par exemple, le bouton d'onglet peut avoir un état visuel spécial « en cours » :

```js {4-6}
function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

Remarquez que le clic sur « Articles » semble désormais plus réactif parce que le bouton d'onglet lui-même se met à jour immédiatement :

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        À propos
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Articles (lent)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Bienvenue sur mon profil !</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Un seul log. La lenteur réside en fait dans SlowPost.
  console.log('[ARTIFICIELLEMENT LENT] Rendu de 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Ne rien faire pendant 1 ms par élément pour simuler
    // du code extrêmement lent.
  }

  return (
    <li className="item">
      Article #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Vous me trouverez en ligne ici :
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

---

### Empêcher les indicateurs de chargement indésirables {/*preventing-unwanted-loading-indicators*/}

<<<<<<< HEAD
Dans cet exemple, le composant `PostsTab` charge des données en utilisant une source de données [compatible Suspense](/reference/react/Suspense).  Lorsque vous cliquez sur l'onglet « Articles », le composant `PostsTab` *suspend*, entraînant l'affichage du plus proche contenu de secours :
=======
In this example, the `PostsTab` component fetches some data using [use](/reference/react/use). When you click the "Posts" tab, the `PostsTab` component *suspends*, causing the closest loading fallback to appear:
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Chargement...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        À propos
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Articles
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js
export default function TabButton({ action, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      action();
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Bienvenue sur mon profil !</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
<<<<<<< HEAD

// Ceci est une solution de contournement pour permettre à la
// démo de fonctionner.
// TODO: remplacer par une véritable implémentation une fois
// le bug corrigé.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
=======
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        Vous me trouverez en ligne ici :
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note : la façon de charger vos données dépend du framework
// que vous utilisez en complément de Suspense.
// Normalement, la logique de cache serait fournie par le framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Article #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

<<<<<<< HEAD
Masquer le conteneur d'onglets dans son intégralité pour afficher un indicateur de chargement entraîne une expérience utilisateur désagréable.  Si vous ajoutez `useTransition` à `TabButton`, vous pouvez plutôt manifester l'attente en cours dans le bouton d'onglet.
=======
Hiding the entire tab container to show a loading indicator leads to a jarring user experience. If you add `useTransition` to `TabButton`, you can instead display the pending state in the tab button instead.
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

Remarquez que cliquer sur « Articles » ne remplace plus l'ensemble du conteneur d'onglets avec un *spinner* :

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Chargement...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        À propos
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Articles
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Bienvenue sur mon profil !</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
<<<<<<< HEAD

// Ceci est une solution de contournement pour permettre à la
// démo de fonctionner.
// TODO: remplacer par une véritable implémentation une fois
// le bug corrigé.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
=======
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        Vous me trouverez en ligne ici :
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note : la façon de charger vos données dépend du framework
// que vous utilisez en complément de Suspense.
// Normalement, la logique de cache serait fournie par le framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Article #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[Apprenez-en davantage sur l'utilisation des Transitions avec Suspense](/reference/react/Suspense#preventing-already-revealed-content-from-hiding).

<Note>

<<<<<<< HEAD
Les Transitions « n'attendront » que le temps nécessaire pour éviter de masquer du contenu *déjà révélé* (comme le conteneur d'onglets).  Si l'onglet Articles avait un [périmètre `<Suspense>` imbriqué](/reference/react/Suspense#revealing-nested-content-as-it-loads), la Transition « n'attendrait » pas ce dernier.
=======
Transitions only "wait" long enough to avoid hiding *already revealed* content (like the tab container). If the Posts tab had a [nested `<Suspense>` boundary,](/reference/react/Suspense#revealing-nested-content-as-it-loads) the Transition would not "wait" for it.
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

</Note>

---

### Construire un routeur compatible Suspense {/*building-a-suspense-enabled-router*/}

Si vous construisez un framework React ou un routeur, nous vous recommandons de marquer toutes les navigations de pages comme étant des Transitions.

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

<<<<<<< HEAD
Nous recommandons ça pour deux raisons :

- [Les Transitions sont interruptibles](#marking-a-state-update-as-a-non-blocking-transition), ce qui permet à l'utilisateur de cliquer pour aller ailleurs sans devoir attendre la fin du rendu de son premier choix.
- [Les Transitions évitent les indicateurs de chargement indésirables](#preventing-unwanted-loading-indicators), ce qui vous évite de produire des « clignotements » désagréables lors de la navigation.

Voici un petit exemple de routeur très simplifié utilisant les Transitions pour ses navigations.
=======
This is recommended for three reasons:

- [Transitions are interruptible,](#marking-a-state-update-as-a-non-blocking-transition) which lets the user click away without waiting for the re-render to complete.
- [Transitions prevent unwanted loading indicators,](#preventing-unwanted-loading-indicators) which lets the user avoid jarring jumps on navigation.
- [Transitions wait for all pending actions](#perform-non-blocking-updates-with-actions) which lets the user wait for side effects to complete before the new page is shown.

Here is a simplified router example using Transitions for navigations.
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Chargement...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Musicothèque
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Ouvrir la page artiste des Beatles
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Note : ce composant est écrit au moyen d'une API expérimentale
// qui n'est pas encore disponible dans une version stable de React.

// Pour un exemple réaliste que vous pouvez suivre dès aujourd'hui,
// essayez un framework intégrant Suspense, tel que Relay ou Next.js.

=======
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
<<<<<<< HEAD

// Ceci est une solution de contournement pour permettre à la
// démo de fonctionner.
// TODO: remplacer par une véritable implémentation une fois
// le bug corrigé.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
=======
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Note : ce composant est écrit au moyen d'une API expérimentale
// qui n'est pas encore disponible dans une version stable de React.

// Pour un exemple réaliste que vous pouvez suivre dès aujourd'hui,
// essayez un framework intégrant Suspense, tel que Relay ou Next.js.

=======
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
<<<<<<< HEAD

// Ceci est une solution de contournement pour permettre à la
// démo de fonctionner.
// TODO: remplacer par une véritable implémentation une fois
// le bug corrigé.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
=======
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note : la façon de charger vos données dépend du framework
// que vous utilisez en complément de Suspense.
// Normalement, la logique de cache serait fournie par le framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `Les Beatles étaient un groupe de rock anglais,
    formé à Liverpool en 1960, qui était composé de
    John Lennon, Paul McCartney, George Harrison
    et Ringo Starr.`;
}

async function getAlbums() {
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper’s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day’s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

Les routeurs [compatibles Suspense](/reference/react/Suspense) sont censés enrober par défaut leurs mises à jour de navigation dans des Transitions.

</Note>

---

### Afficher une erreur à l'utilisateur avec un périmètre d'erreur {/*displaying-an-error-to-users-with-error-boundary*/}

<<<<<<< HEAD
<Canary>

Les périmètres d'erreurs pour `useTransition` ne sont actuellement disponibles que sur les canaux de livraison Canary et Expérimental de React. Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>

Si une fonction passée à `startTransition` lève une erreur, vous pouvez afficher l'erreur à votre utilisateur au moyen d'un [périmètre d'erreur](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Pour utiliser un périmètre d'erreur, enrobez le composant qui appelle `useTransition` avec ce périmètre. Lorsque la fonction passée à `startTransition` lèvera une erreur, le contenu de secours du périmètre d'erreur sera affiché.
=======
If a function passed to `startTransition` throws an error, you can display an error to your user with an [error boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). To use an error boundary, wrap the component where you are calling the `useTransition` in an error boundary. Once the function passed to `startTransition` errors, the fallback for the error boundary will be displayed.
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

<Sandpack>

```js src/AddCommentContainer.js active
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️ Ça sent le pâté…</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // Pour les besoins de la démonstration uniquement
  if(comment == null) {
    throw Error('Example Error: An error thrown to trigger error boundary')
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // On ne passe volontairement pas de commentaire
          // afin d’entraîner une erreur.
          addComment();
        });
      }}
    >
      Ajouter un commentaire
    </button>
  );
}
```

```js src/App.js hidden
import { AddCommentContainer } from "./AddCommentContainer.js";

export default function App() {
  return <AddCommentContainer />;
}
```

```js src/index.js hidden
<<<<<<< HEAD
// TODO: mettre à jour l'import vers la version stable de React
// une fois que le Hook `use` actuellement Canary y figurera
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: mettre à jour cet exemple pour utiliser l'environnement
// de démo Server Component de Codesandbox quand celui-ci sera disponible
=======
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## Dépannage {/*troubleshooting*/}

### Mettre à jour un champ depuis une Transition ne fonctionne pas {/*updating-an-input-in-a-transition-doesnt-work*/}

Vous ne pouvez pas utiliser une Transition pour mettre à jour une variable d'état qui contrôle un champ :

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Les Transitions ne peuvent enrober des mises à jour d'état qui contrôlent des champs
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

C'est parce que les Transitions sont non bloquantes, alors que la mise à jour d'un champ en réaction à un événement de modification doit survenir de façon synchrone.  Si vous souhaitez exécuter une Transition en réponse à une saisie, vous avez deux options :

1. Vous pouvez déclarer deux variables d'état distinctes : une pour l'état du champ (qui sera toujours mise à jour de façon synchrone), et une que vous mettrez à jour au sein d'une Transition.  Ça vous permet de contrôler le champ avec l'état synchrone, tout en passant la variable d'état en Transition (qui est susceptible de « retarder » par rapport à la saisie) au reste de votre logique de rendu.
2. Sinon, vous pouvez n'avoir qu'une variable d'état et utiliser [`useDeferredValue`](/reference/react/useDeferredValue) qui vous permettra d'être « en retard » sur la véritable valeur.  Ça déclenchera automatiquement des rendus non bloquants pour « rattraper » la nouvelle valeur.

---

### React ne traite pas ma mise à jour d'état comme étant une Transition {/*react-doesnt-treat-my-state-update-as-a-transition*/}

Lorsque vous enrobez une mise à jour d'état dans une Transition, assurez-vous qu'elle survient effectivement *pendant* l'appel à `startTransition` :

```js
startTransition(() => {
  // ✅ L’état est mis à jour *pendant* l’appel à startTransition
  setPage('/about');
});
```

<<<<<<< HEAD
La fonction que vous passez à `startTransition` doit être synchrone.

Vous ne pouvez pas marquer une mise à jour comme étant une Transition avec ce genre de code :
=======
The function you pass to `startTransition` must be synchronous. You can't mark an update as a Transition like this:
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

```js
startTransition(() => {
  // ❌ L’état est mis à jour *après* l’appel à startTransition
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

Faites plutôt ceci :

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ L’état est mis à jour *pendant* l’appel à startTransition
    setPage('/about');
  });
}, 1000);
```

<<<<<<< HEAD
Dans le même esprit, vous ne pouvez pas marquer une mise à jour comme étant une Transition avec du code ressemblant à ça :
=======
---

### React doesn't treat my state update after `await` as a Transition {/*react-doesnt-treat-my-state-update-after-await-as-a-transition*/}

When you use `await` inside a `startTransition` function, the state updates that happen after the `await` are not marked as Transitions. You must wrap state updates after each `await` in a `startTransition` call:
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

```js
startTransition(async () => {
  await someAsyncFunction();
<<<<<<< HEAD
  // ❌ L’état est mis à jour *après* l’appel à startTransition
=======
  // ❌ Not using startTransition after await
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
  setPage('/about');
});
```

En revanche, ce type de code fonctionne :

```js
<<<<<<< HEAD
await someAsyncFunction();
startTransition(() => {
  // ✅ L’état est mis à jour *pendant* l’appel à startTransition
  setPage('/about');
=======
startTransition(async () => {
  await someAsyncFunction();
  // ✅ Using startTransition *after* await
  startTransition(() => {
    setPage('/about');
  });
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
});
```

This is a JavaScript limitation due to React losing the scope of the async context. In the future, when [AsyncContext](https://github.com/tc39/proposal-async-context) is available, this limitation will be removed.

---

### Je veux appeler `useTransition` ailleurs que dans un composant {/*i-want-to-call-usetransition-from-outside-a-component*/}

Vous ne pouvez pas appeler `useTransition` hors d'un composant parce que c'est un Hook.  Pour ce type de besoin, préférez la fonction autonome [`startTransition`](/reference/react/startTransition).   Son fonctionnement est identique, à ceci près qu'elle ne fournit pas l'indicateur `isPending`.

---

### La fonction que je passe à `startTransition` est exécutée immédiatement {/*the-function-i-pass-to-starttransition-executes-immediately*/}

Si vous exécutez ce code, ça affichera 1, 2, 3 :

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**C'est censé afficher 1, 2, 3.**  La fonction que vous passez à `startTransition` ne doit pas être différée.  Contrairement au `setTimeout` du navigateur, la fonction de rappel n'est pas appelée plus tard.  React exécute votre fonction immédiatement, mais les mises à jour d'état que vous y demandez *pendant son exécution* sont marquées comme étant des Transitions.  Vous pouvez vous imaginer le fonctionnement suivant :

```js
// Version simplifiée du fonctionnement de React

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... planifie une mise à jour d’état en tant que Transition ...
  } else {
    // ... planifie une mise à jour d’état urgente ...
  }
}
```

### My state updates in Transitions are out of order {/*my-state-updates-in-transitions-are-out-of-order*/}

If you `await` inside `startTransition`, you might see the updates happen out of order.

In this example, the `updateQuantity` function simulates a request to the server to update the item's quantity in the cart. This function *artificially returns the every other request after the previous* to simulate race conditions for network requests.

Try updating the quantity once, then update it quickly multiple times. You might see the incorrect total:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);
  
  const updateQuantityAction = newQuantity => {
    setClientQuantity(newQuantity);

    // Access the pending state of the transition,
    // by wrapping in startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Update the quantity in an Action.
    startTransition(() => {
      action(e.target.value);
    });
  }  
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>Total:</span>
      <div>
        <div>
          {isPending
            ? "🌀 Updating..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `Wrong total, expected: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simulate every other request being slower
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>


When clicking multiple times, it's possible for previous requests to finish after later requests. When this happens, React currently has no way to know the intended order. This is because the updates are scheduled asynchronously, and React loses context of the order across the async boundary.

This is expected, because Actions within a Transition do not guarantee execution order. For common use cases, React provides higher-level abstractions like [`useActionState`](/reference/react/useActionState) and [`<form>` actions](/reference/react-dom/components/form) that handle ordering for you. For advanced use cases, you'll need to implement your own queuing and abort logic to handle this.


