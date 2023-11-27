---
title: useFormState
canary: true
---

<Canary>

<<<<<<< HEAD
Le Hook `useFormState` n'est actuellement disponible que sur les canaux de livraison Canary et Expérimental de React. Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels). Par ailleurs, vous aurez besoin d'utiliser un framework qui prenne en charge les [React Server Components](/reference/react/use-client) pour tirer pleinement parti de `useFormState`.
=======
The `useFormState` Hook is currently only available in React's Canary and experimental channels. Learn more about [release channels here](/community/versioning-policy#all-release-channels). In addition, you need to use a framework that supports [React Server Components](/reference/react/use-client) to get the full benefit of `useFormState`.
>>>>>>> 6570e6cd79a16ac3b1a2902632eddab7e6abb9ad

</Canary>

<Intro>

`useFormState` est un Hook qui vous permet de mettre à jour l'état sur base du résultat d'une action de formulaire.

```js
const [state, formAction] = useFormState(fn, initialState);
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useFormState(action, initialState)` {/*useformstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

Appelez `useFormState` au niveau racine de votre composant pour créer un état de composant qui sera mis à jour [lorsqu'une action de formulaire sera invoquée](/reference/react-dom/components/form). Vous passez à `useFormState` une fonction d'action de formulaire existante ainsi qu'un état initial, et il renvoie une nouvelle action que vous pouvez utiliser dans votre formulaire, ainsi que le dernier état en date pour ce formulaire.  Cet état sera également passé à la fonction que vous avez fournie.

```js
import { useFormState } from "react-dom";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useFormState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Incrémenter</button>
    </form>
  )
}
```

L'état de formulaire est déterminé par la valeur renvoyée par l'action lors du dernier envoi en date du formulaire. Si le formulaire n'a pas encore été envoyé, il équivaut à l'état initial que vous avez fourni.

Lorsque vous l'utilisez dans une Action Serveur, `useFormState` permet d'afficher la réponse du serveur pour l'envoi du formulaire avant même que l'hydratation ne soit terminée.

[Voir d'autres exemples plus bas](#usage).

#### Paramètres {/*parameters*/}

* `fn` : la fonction à appeler lorsque le formulaire est envoyé.  Lorsque la fonction est appelée, elle reçoit comme premier argument l'état précédent du formulaire (le `initialState` que vous avez fourni pour le premier appel, puis, pour les appels ultérieurs, la valeur précédemment renvoyée), suivi par les arguments normalement acceptés par une fonction d'action de formulaire.
* `initialState` : la valeur initiale que vous souhaitez pour votre état.  Il peut s'agir de n'importe quelle valeur sérialisable.  Cet argument est ignoré après l'appel initial de l'action.

{/* TODO T164397693: link to serializable values docs once it exists */}

#### Valeur renvoyée {/*returns*/}

`useFormState` renvoie un tableau avec exactement deux valeurs :

1. L'état courant.  Lors du rendu initial, il s'agira du `initialState` que vous avez passé. Après que l'action aura été invoquée, il correspondra à la valeur renvoyée par l'action.
2. Une nouvelle action que vous pouvez passer comme prop `action` à votre composant `form`, ou comme prop `formAction` à tout composant `button` au sein du formulaire.

#### Limitations {/*caveats*/}

* Lorsque vous utilisez un framework prenant en charge les React Server Components, `useFormState` vous permet de rendre les formulaires interactifs avant même que JavaScript ne soit exécuté côté client.  Si vous l'utilisez hors des Server Components, il est équivalent à un état local de composant.
* La fonction passée à `useFormState` reçoit un premier argument supplémentaire : l'état précédent ou initial. Sa signature est donc différente de celles des fonctions d'action de formulaire utilisées directement par vos formulaires, sans recours à `useFormState`.

---

## Utilisation {/*usage*/}

### Utiliser les informations renvoyées par une action de formulaire {/*using-information-returned-by-a-form-action*/}

Appelez `useFormState` au niveau racine de votre composant pour accéder à la valeur renvoyée par l'action lors du dernier envoi du formulaire.

```js [[1, 5, "state"], [2, 5, "formAction"], [3, 5, "action"], [4, 5, "null"], [2, 8, "formAction"]]
import { useFormState } from 'react-dom';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useFormState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  );
}
```

`useFormState` renvoie un tableau avec exactement deux valeurs :

1. <CodeStep step={1}>L'état courant</CodeStep> du formulaire, qui sera au départ <CodeStep step={4}>l'état initial</CodeStep> que vous aurez fourni, puis une fois le formulaire envoyé, vaudra la valeur de retour de <CodeStep step={3}>l'action</CodeStep> que vous aurez passée.
2. Une <CodeStep step={2}>nouvelle action</CodeStep> que vous pouvez passer comme prop `action` à votre `form`.

Lorsque le formulaire sera envoyé, la fonction <CodeStep step={3}>d'action</CodeStep> que vous aurez fournie sera appelée.  Sa valeur de retour deviendra le nouvel <CodeStep step={1}>état courant</CodeStep> du formulaire.

<CodeStep step={3}>L'action</CodeStep> que vous aurez fournie recevra par ailleurs un premier argument supplémentaire, à savoir <CodeStep step={1}>l'état courant</CodeStep> du formulaire. Lors du premier envoi du formulaire, il s'agira de <CodeStep step={4}>l'état initial</CodeStep> que vous aurez fourni, alors que pour les envois ultérieurs, ce sera la valeur renvoyée par le dernier appel en date de l'action. Le reste des arguments est identique à une utilisation de l'action sans `useFormState`.

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'prochain état';
}
```

<Recipes titleText="Afficher des informations suite à l’envoi d'un formulaire" titleId="display-information-after-submitting-a-form">

#### Afficher des erreurs de formulaire {/*display-form-errors*/}

Pour afficher des messages tels qu'un message d'erreur ou une notification renvoyés par une Action Serveur, enrobez l'action dans un appel à `useFormState`.

<Sandpack>

```js App.js
import { useState } from "react";
import { useFormState } from "react-dom";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction] = useFormState(addToCart, null);
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

```js actions.js
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

```css styles.css hidden
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

```js App.js
import { useState } from "react";
import { useFormState } from "react-dom";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useFormState(addToCart, {});
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

```js actions.js
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

```css styles.css hidden
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

Lorsque vous enrobez une action avec `useFormState`, elle reçoit un *premier argument* supplémentaire. Les données envoyées par le formulaire sont donc présentes comme *second* argument, plutôt qu'en première position comme en temps normal.  Le premier argument ainsi injecté contient l'état actuel du formulaire.

```js
function action(currentState, formData) {
  // ...
}
```
