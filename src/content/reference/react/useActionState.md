---
title: useActionState
canary: true
---

<Canary>

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
Le Hook `useFormState` n'est actuellement disponible que sur les canaux de livraison Canary et Expérimental de React. Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels). Par ailleurs, vous aurez besoin d'utiliser un framework qui prenne en charge les [React Server Components](/reference/react/use-client) pour tirer pleinement parti de `useFormState`.
=======
The `useActionState` Hook is currently only available in React's Canary and experimental channels. Learn more about [release channels here](/community/versioning-policy#all-release-channels). In addition, you need to use a framework that supports [React Server Components](/reference/rsc/use-client) to get the full benefit of `useActionState`.
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e:src/content/reference/react/useActionState.md

</Canary>

<Note>

In earlier React Canary versions, this API was part of React DOM and called `useFormState`.

</Note>

<Intro>

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
`useFormState` est un Hook qui vous permet de mettre à jour l'état sur base du résultat d'une action de formulaire.
=======
`useActionState` is a Hook that allows you to update state based on the result of a form action.
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e:src/content/reference/react/useActionState.md

```js
const [state, formAction] = useActionState(fn, initialState, permalink?);
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useActionState(action, initialState, permalink?)` {/*useactionstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
Appelez `useFormState` au niveau racine de votre composant pour créer un état de composant qui sera mis à jour [lorsqu'une action de formulaire sera invoquée](/reference/react-dom/components/form). Vous passez à `useFormState` une fonction d'action de formulaire existante ainsi qu'un état initial, et il renvoie une nouvelle action que vous pouvez utiliser dans votre formulaire, ainsi que le dernier état en date pour ce formulaire.  Cet état sera également passé à la fonction que vous avez fournie.
=======
Call `useActionState` at the top level of your component to create component state that is updated [when a form action is invoked](/reference/react-dom/components/form). You pass `useActionState` an existing form action function as well as an initial state, and it returns a new action that you use in your form, along with the latest form state. The latest form state is also passed to the function that you provided.
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e:src/content/reference/react/useActionState.md

```js
import { useActionState } from "react";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useActionState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Incrémenter</button>
    </form>
  )
}
```

L'état de formulaire est déterminé par la valeur renvoyée par l'action lors du dernier envoi en date du formulaire. Si le formulaire n'a pas encore été envoyé, il équivaut à l'état initial que vous avez fourni.

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
Lorsque vous l'utilisez dans une Action Serveur, `useFormState` permet d'afficher la réponse du serveur pour l'envoi du formulaire avant même que l'hydratation ne soit terminée.
=======
If used with a Server Action, `useActionState` allows the server's response from submitting the form to be shown even before hydration has completed.
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e:src/content/reference/react/useActionState.md

[Voir d'autres exemples plus bas](#usage).

#### Paramètres {/*parameters*/}

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
* `fn` : la fonction à appeler lorsque le formulaire est envoyé.  Lorsque la fonction est appelée, elle reçoit comme premier argument l'état précédent du formulaire (le `initialState` que vous avez fourni pour le premier appel, puis, pour les appels ultérieurs, la valeur précédemment renvoyée), suivi par les arguments normalement acceptés par une fonction d'action de formulaire.
* `initialState` : la valeur initiale que vous souhaitez pour votre état.  Il peut s'agir de n'importe quelle valeur sérialisable.  Cet argument est ignoré après l'appel initial de l'action.
* `permalink` **optionnel** : une chaîne de caractères contenant l'URL unique de la page que ce formulaire modifie. Conçu pour une utilisation sur des pages à contenu dynamique (telles que des flux) pour permettre une amélioration progressive : si `fn` est une [Action Serveur](/reference/react/use-server) et que le formulaire est soumis avant que le *bundle* JavaScript n'ait fini son chargement, le navigateur ira sur l'URL de permalien fournie, plutôt que sur l'URL de la page courante. Ça permet de garantir que le même composant de formulaire sera produit sur la page destinataire (y compris les infos `fn` et `permalink`), afin que React sache comment lui passer l'état.  Une fois le formulaire hydraté, ce paramètre n'a plus d'effet.
=======
* `fn`: The function to be called when the form is submitted or button pressed. When the function is called, it will receive the previous state of the form (initially the `initialState` that you pass, subsequently its previous return value) as its initial argument, followed by the arguments that a form action normally receives.
* `initialState`: The value you want the state to be initially. It can be any serializable value. This argument is ignored after the action is first invoked.
* **optional** `permalink`: A string containing the unique page URL that this form modifies. For use on pages with dynamic content (eg: feeds) in conjunction with progressive enhancement: if `fn` is a [server action](/reference/rsc/use-server) and the form is submitted before the JavaScript bundle loads, the browser will navigate to the specified permalink URL, rather than the current page's URL. Ensure that the same form component is rendered on the destination page (including the same action `fn` and `permalink`) so that React knows how to pass the state through. Once the form has been hydrated, this parameter has no effect.
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e:src/content/reference/react/useActionState.md

{/* TODO T164397693: link to serializable values docs once it exists */}

#### Valeur renvoyée {/*returns*/}

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
`useFormState` renvoie un tableau avec exactement deux valeurs :
=======
`useActionState` returns an array with exactly two values:
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e:src/content/reference/react/useActionState.md

1. L'état courant.  Lors du rendu initial, il s'agira du `initialState` que vous avez passé. Après que l'action aura été invoquée, il correspondra à la valeur renvoyée par l'action.
2. Une nouvelle action que vous pouvez passer comme prop `action` à votre composant `form`, ou comme prop `formAction` à tout composant `button` au sein du formulaire.

#### Limitations {/*caveats*/}

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
* Lorsque vous utilisez un framework prenant en charge les React Server Components, `useFormState` vous permet de rendre les formulaires interactifs avant même que JavaScript ne soit exécuté côté client.  Si vous l'utilisez hors des Server Components, il est équivalent à un état local de composant.
* La fonction passée à `useFormState` reçoit un premier argument supplémentaire : l'état précédent ou initial. Sa signature est donc différente de celles des fonctions d'action de formulaire utilisées directement par vos formulaires, sans recours à `useFormState`.
=======
* When used with a framework that supports React Server Components, `useActionState` lets you make forms interactive before JavaScript has executed on the client. When used without Server Components, it is equivalent to component local state.
* The function passed to `useActionState` receives an extra argument, the previous or initial state, as its first argument. This makes its signature different than if it were used directly as a form action without using `useActionState`.
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e:src/content/reference/react/useActionState.md

---

## Utilisation {/*usage*/}

### Utiliser les informations renvoyées par une action de formulaire {/*using-information-returned-by-a-form-action*/}

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
Appelez `useFormState` au niveau racine de votre composant pour accéder à la valeur renvoyée par l'action lors du dernier envoi du formulaire.
=======
Call `useActionState` at the top level of your component to access the return value of an action from the last time a form was submitted.
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e:src/content/reference/react/useActionState.md

```js [[1, 5, "state"], [2, 5, "formAction"], [3, 5, "action"], [4, 5, "null"], [2, 8, "formAction"]]
import { useActionState } from 'react';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useActionState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  );
}
```

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
`useFormState` renvoie un tableau avec exactement deux valeurs :
=======
`useActionState` returns an array with exactly two items:
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e:src/content/reference/react/useActionState.md

1. <CodeStep step={1}>L'état courant</CodeStep> du formulaire, qui sera au départ <CodeStep step={4}>l'état initial</CodeStep> que vous aurez fourni, puis une fois le formulaire envoyé, vaudra la valeur de retour de <CodeStep step={3}>l'action</CodeStep> que vous aurez passée.
2. Une <CodeStep step={2}>nouvelle action</CodeStep> que vous pouvez passer comme prop `action` à votre `form`.

Lorsque le formulaire sera envoyé, la fonction <CodeStep step={3}>d'action</CodeStep> que vous aurez fournie sera appelée.  Sa valeur de retour deviendra le nouvel <CodeStep step={1}>état courant</CodeStep> du formulaire.

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
<CodeStep step={3}>L'action</CodeStep> que vous aurez fournie recevra par ailleurs un premier argument supplémentaire, à savoir <CodeStep step={1}>l'état courant</CodeStep> du formulaire. Lors du premier envoi du formulaire, il s'agira de <CodeStep step={4}>l'état initial</CodeStep> que vous aurez fourni, alors que pour les envois ultérieurs, ce sera la valeur renvoyée par le dernier appel en date de l'action. Le reste des arguments est identique à une utilisation de l'action sans `useFormState`.
=======
The <CodeStep step={3}>action</CodeStep> that you provide will also receive a new first argument, namely the <CodeStep step={1}>current state</CodeStep> of the form. The first time the form is submitted, this will be the <CodeStep step={4}>initial state</CodeStep> you provided, while with subsequent submissions, it will be the return value from the last time the action was called. The rest of the arguments are the same as if `useActionState` had not been used.
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e:src/content/reference/react/useActionState.md

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'prochain état';
}
```

<Recipes titleText="Afficher des informations suite à l’envoi d'un formulaire" titleId="display-information-after-submitting-a-form">

#### Afficher des erreurs de formulaire {/*display-form-errors*/}

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
Pour afficher des messages tels qu'un message d'erreur ou une notification renvoyés par une Action Serveur, enrobez l'action dans un appel à `useFormState`.
=======
To display messages such as an error message or toast that's returned by a Server Action, wrap the action in a call to `useActionState`.
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e:src/content/reference/react/useActionState.md

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Ajouter au panier</button>
      {message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Ajouté au panier";
  } else {
    return "Impossible d’ajouter au panier : ce titre est épuisé.";
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>

<Solution />

#### Afficher des données structurées suite à l'envoi d'un formulaire {/*display-structured-information-after-submitting-a-form*/}

La valeur renvoyée par une Action Serveur peut être n'importe quelle valeur sérialisable. Il peut par exemple s'agir d'un objet avec un booléen indiquant si l'action a réussi, un message d'erreur, ou des informations mises à jour.

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useActionState(addToCart, {});
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Ajouter au panier</button>
      {formState?.success &&
        <div className="toast">
          Ajouté ! Votre panier comporte désormais {formState.cartSize} éléments.
        </div>
      }
      {formState?.success === false &&
        <div className="error">
          L’ajout a échoué : {formState.message}
        </div>
      }
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return {
      success: true,
      cartSize: 12,
    };
  } else {
    return {
      success: false,
      message: "Ce titre est épuisé.",
    };
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>

<Solution />

</Recipes>

## Dépannage {/*troubleshooting*/}

### Mon action n'arrive plus à lire les données envoyées par le formulaire {/*my-action-can-no-longer-read-the-submitted-form-data*/}

<<<<<<< HEAD:src/content/reference/react-dom/hooks/useFormState.md
Lorsque vous enrobez une action avec `useFormState`, elle reçoit un *premier argument* supplémentaire. Les données envoyées par le formulaire sont donc présentes comme *second* argument, plutôt qu'en première position comme en temps normal.  Le premier argument ainsi injecté contient l'état actuel du formulaire.
=======
When you wrap an action with `useActionState`, it gets an extra argument *as its first argument*. The submitted form data is therefore its *second* argument instead of its first as it would usually be. The new first argument that gets added is the current state of the form.
>>>>>>> b7bf6c16fb3152626a71c115b3242df6eb93bc6e:src/content/reference/react/useActionState.md

```js
function action(currentState, formData) {
  // ...
}
```
