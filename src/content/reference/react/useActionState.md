---
title: useActionState
---

<<<<<<< HEAD
<Canary>

Le Hook `useActionState` n'est actuellement disponible que sur les canaux de livraison Canary et Expérimental de React. Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels). Par ailleurs, vous aurez besoin d'utiliser un framework qui prenne en charge les [Composants Serveur](/reference/rsc/use-client) pour tirer pleinement parti de `useActionState`.

</Canary>

<Note>

In earlier React Canary versions, this API was part of React DOM and called `useActionState`.

</Note>

=======
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d
<Intro>

`useActionState` est un Hook qui vous permet de mettre à jour l'état sur base du résultat d'une action de formulaire.

```js
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

</Intro>

<Note>

In earlier React Canary versions, this API was part of React DOM and called `useFormState`.

</Note>


<InlineToc />

---

## Référence {/*reference*/}

### `useActionState(action, initialState, permalink?)` {/*useactionstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

Appelez `useActionState` au niveau racine de votre composant pour créer un état de composant qui sera mis à jour [lorsqu'une action de formulaire sera invoquée](/reference/react-dom/components/form). Vous passez à `useActionState` une fonction d'action de formulaire existante ainsi qu'un état initial, et elle renvoie une nouvelle action que vous pouvez utiliser dans votre formulaire, ainsi que le dernier état en date pour ce formulaire.  Cet état sera également passé à la fonction que vous avez fournie.

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

<<<<<<< HEAD
Lorsque vous l'utilisez dans une Action Serveur, `useActionState` permet d'afficher la réponse du serveur pour l'envoi du formulaire avant même que l'hydratation ne soit terminée.
=======
If used with a Server Function, `useActionState` allows the server's response from submitting the form to be shown even before hydration has completed.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

[Voir d'autres exemples plus bas](#usage).

#### Paramètres {/*parameters*/}

<<<<<<< HEAD
* `fn` : la fonction à appeler lorsque le formulaire est envoyé.  Lorsque la fonction est appelée, elle reçoit comme premier argument l'état précédent du formulaire (le `initialState` que vous avez fourni pour le premier appel, puis, pour les appels ultérieurs, la valeur précédemment renvoyée), suivi par les arguments normalement acceptés par une fonction d'action de formulaire.
* `initialState` : la valeur initiale que vous souhaitez pour votre état.  Il peut s'agir de n'importe quelle valeur sérialisable.  Cet argument est ignoré après l'appel initial de l'action.
* `permalink` **optionnel** : une chaîne de caractères contenant l'URL unique de la page que ce formulaire modifie. Conçu pour une utilisation sur des pages à contenu dynamique (telles que des flux) pour permettre une amélioration progressive : si `fn` est une [Action Serveur](/reference/rsc/use-server) et que le formulaire est soumis avant que le *bundle* JavaScript n'ait fini son chargement, le navigateur ira sur l'URL de permalien fournie, plutôt que sur l'URL de la page courante. Ça permet de garantir que le même composant de formulaire sera produit sur la page destinataire (y compris les infos `fn` et `permalink`), afin que React sache comment lui passer l'état.  Une fois le formulaire hydraté, ce paramètre n'a plus d'effet.
=======
* `fn`: The function to be called when the form is submitted or button pressed. When the function is called, it will receive the previous state of the form (initially the `initialState` that you pass, subsequently its previous return value) as its initial argument, followed by the arguments that a form action normally receives.
* `initialState`: The value you want the state to be initially. It can be any serializable value. This argument is ignored after the action is first invoked.
* **optional** `permalink`: A string containing the unique page URL that this form modifies. For use on pages with dynamic content (eg: feeds) in conjunction with progressive enhancement: if `fn` is a [server function](/reference/rsc/server-functions) and the form is submitted before the JavaScript bundle loads, the browser will navigate to the specified permalink URL, rather than the current page's URL. Ensure that the same form component is rendered on the destination page (including the same action `fn` and `permalink`) so that React knows how to pass the state through. Once the form has been hydrated, this parameter has no effect.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

{/* TODO T164397693: link to serializable values docs once it exists */}

#### Valeur renvoyée {/*returns*/}

`useActionState` renvoie un tableau avec exactement trois valeurs :

<<<<<<< HEAD
1. L'état courant.  Lors du rendu initial, il s'agira du `initialState` que vous avez passé. Après que l'action aura été invoquée, il correspondra à la valeur renvoyée par l'action.
2. Une nouvelle action que vous pouvez passer comme prop `action` à votre composant `form`, ou comme prop `formAction` à tout composant `button` au sein du formulaire.
3. Le drapeau `isPending` qui vous indique si une Transition est en cours.
=======
1. The current state. During the first render, it will match the `initialState` you have passed. After the action is invoked, it will match the value returned by the action.
2. A new action that you can pass as the `action` prop to your `form` component or `formAction` prop to any `button` component within the form. The action can also be called manually within [`startTransition`](/reference/react/startTransition).
3. The `isPending` flag that tells you whether there is a pending Transition.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

#### Limitations {/*caveats*/}

* Lorsque vous utilisez un framework prenant en charge les React Server Components, `useActionState` vous permet de rendre les formulaires interactifs avant même que JavaScript ne soit exécuté côté client.  Si vous l'utilisez hors des Server Components, il est équivalent à un état local de composant.
* La fonction passée à `useActionState` reçoit un premier argument supplémentaire : l'état précédent ou initial. Sa signature est donc différente de celles des fonctions d'action de formulaire utilisées directement par vos formulaires, sans recours à `useActionState`.

---

## Utilisation {/*usage*/}

### Utiliser les informations renvoyées par une action de formulaire {/*using-information-returned-by-a-form-action*/}

Appelez `useActionState` au niveau racine de votre composant pour accéder à la valeur renvoyée par l'action lors du dernier envoi du formulaire.

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

`useActionState` renvoie un tableau avec exactement trois valeurs :

<<<<<<< HEAD
1. <CodeStep step={1}>L'état courant</CodeStep> du formulaire, qui sera au départ <CodeStep step={4}>l'état initial</CodeStep> que vous aurez fourni, puis une fois le formulaire envoyé, aura la valeur de retour de <CodeStep step={3}>l'action</CodeStep> que vous aurez passée.
2. Une <CodeStep step={2}>nouvelle action</CodeStep> que vous pouvez passer comme prop `action` à votre `form`.
3. Un <CodeStep step={1}>état d'attente</CodeStep> que vous pouvez utiliser tandis que l'action est en cours de traitement.
=======
1. The <CodeStep step={1}>current state</CodeStep> of the form, which is initially set to the <CodeStep step={4}>initial state</CodeStep> you provided, and after the form is submitted is set to the return value of the <CodeStep step={3}>action</CodeStep> you provided.
2. A <CodeStep step={2}>new action</CodeStep> that you pass to `<form>` as its `action` prop or call manually within `startTransition`.
3. A <CodeStep step={1}>pending state</CodeStep> that you can utilise while your action is processing.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

Lorsque le formulaire sera envoyé, la fonction <CodeStep step={3}>d'action</CodeStep> que vous aurez fournie sera appelée.  Sa valeur de retour deviendra le nouvel <CodeStep step={1}>état courant</CodeStep> du formulaire.

<CodeStep step={3}>L'action</CodeStep> que vous aurez fournie recevra par ailleurs un premier argument supplémentaire, à savoir <CodeStep step={1}>l'état courant</CodeStep> du formulaire. Lors du premier envoi du formulaire, il s'agira de <CodeStep step={4}>l'état initial</CodeStep> que vous aurez fourni, alors que pour les envois ultérieurs, ce sera la valeur renvoyée par le dernier appel en date de l'action. Le reste des arguments est identique à une utilisation de l'action sans `useActionState`.

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'prochain état';
}
```

<Recipes titleText="Afficher des informations suite à l’envoi d'un formulaire" titleId="display-information-after-submitting-a-form">

#### Afficher des erreurs de formulaire {/*display-form-errors*/}

<<<<<<< HEAD
Pour afficher des messages tels qu'un message d'erreur ou une notification renvoyés par une Action Serveur, enrobez l'action dans un appel à `useActionState`.
=======
To display messages such as an error message or toast that's returned by a Server Function, wrap the action in a call to `useActionState`.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction, isPending] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Ajouter au panier</button>
      {isPending ? "Chargement en cours..." : message}
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
    // Ajoute un faux délai pour qu’on puisse remarquer l’attente.
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
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
</Sandpack>

<Solution />

#### Afficher des données structurées suite à l'envoi d'un formulaire {/*display-structured-information-after-submitting-a-form*/}

<<<<<<< HEAD
La valeur renvoyée par une Action Serveur peut être n'importe quelle valeur sérialisable. Il peut par exemple s'agir d'un objet avec un booléen indiquant si l'action a réussi, un message d'erreur, ou des informations mises à jour.
=======
The return value from a Server Function can be any serializable value. For example, it could be an object that includes a boolean indicating whether the action was successful, an error message, or updated information.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

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
</Sandpack>

<Solution />

</Recipes>

## Dépannage {/*troubleshooting*/}

### Mon action n'arrive plus à lire les données envoyées par le formulaire {/*my-action-can-no-longer-read-the-submitted-form-data*/}

Lorsque vous enrobez une action avec `useActionState`, elle reçoit un *premier argument* supplémentaire. Les données envoyées par le formulaire sont donc présentes comme *second* argument, plutôt qu'en première position comme en temps normal.  Le premier argument ainsi injecté contient l'état actuel du formulaire.

```js
function action(currentState, formData) {
  // ...
}
```
