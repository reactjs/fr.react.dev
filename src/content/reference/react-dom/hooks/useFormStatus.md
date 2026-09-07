---
title: useFormStatus
---

<<<<<<< HEAD
<Canary>

Le Hook `useFormStatus` n'est actuellement disponible que sur les canaux de livraison Canary et Expérimental de React. Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>

=======
>>>>>>> f3d9794fc31f4a3faf7e863984d37f4ae86b3290
<Intro>

`useFormStatus` est un Hook qui vous fournit des informations d'état sur le dernier envoi de formulaire parent.

```js
const { pending, data, method, action } = useFormStatus();
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useFormStatus()` {/*use-form-status*/}

Le Hook `useFormStatus` vous fournit des informations d'état sur le dernier envoi de formulaire parent.

```js {5},[[1, 6, "status.pending"]]
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Envoyer</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

<<<<<<< HEAD
Pour récupérer les informations d'état, le composant `Submit` doit être utilisé au sein d'un `<form>`. Le Hook renvoie des informations telles que la propriété <CodeStep step={1}>`pending`</CodeStep>, qui vous indique si le formulaire est en cours d'envoi.
=======
To get status information, the `Submit` component must be rendered within a `<form>`. The Hook returns information like the <CodeStep step={1}>`pending`</CodeStep> property which tells you if the form is actively submitting.
>>>>>>> f3d9794fc31f4a3faf7e863984d37f4ae86b3290

Dans l'exemple ci-dessus, `Submit` utilise cette information pour désactiver l'interactivité du `<button>` pendant l'envoi du formulaire.

[Voir plus d'exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

`useFormStatus` ne prend aucun paramètre.

#### Valeur renvoyée {/*returns*/}

Un objet `status` doté des propriétés suivantes :

* `pending` : un booléen. Vaut `true` si le `<form>` parent est en cours d'envoi, sinon `false`.

* `data` : un objet qui implémente [l'interface `FormData`](https://developer.mozilla.org/docs/Web/API/FormData), contenant les données que le `<form>` parent est en train d'envoyer.  Si aucun envoi n'est en cours, ou s'il n'y a pas de `<form>` parent, cette propriété vaut `null`.

* `method` : une chaîne de caractères valant soit `'get'`, soit `'post'`, selon que le `<form>` parent est en train de faire un envoi avec une [méthode HTTP](https://developer.mozilla.org/docs/Web/HTTP/Methods) `GET` ou `POST`. Par défaut, un `<form>` utilisera la méthode `GET`, mais ça peut être spécifié par l'attribut [`method`](https://developer.mozilla.org/docs/Web/HTML/Element/form#method).

[//]: # (Link to `<form>` documentation. "Read more on the `action` prop on `<form>`.")
* `action` : une référence vers la fonction passée à la prop `action` du `<form>` parent. S'il n'y a pas de `<form>` parent, cette propriété vaut `null`. Si la prop `action` a reçu une valeur URI, ou si aucune prop `action` n'est spécifiée, cette propriété vaut `null`.

#### Limitations {/*caveats*/}

<<<<<<< HEAD
* Le Hook `useFormStatus` doit être appelé dans un composant dont le rendu a lieu au sein d'un `<form>`.
* `useFormStatus` ne renverra que les informations d'état du `<form>` parent. Il ne renverra pas les informations de statut d'un `<form>` placé dans le rendu du composant courant ou de ses composants enfants.
=======
* The `useFormStatus` Hook must be called from a component that is rendered inside a `<form>`.
* `useFormStatus` will only return status information for a parent `<form>`. It will not return status information for any `<form>` rendered in that same component or children components.
>>>>>>> f3d9794fc31f4a3faf7e863984d37f4ae86b3290

---

## Utilisation {/*usage*/}

### Afficher un état d'attente pendant l'envoi du formulaire {/*display-a-pending-state-during-form-submission*/}

<<<<<<< HEAD
Pour afficher un état d'attente pendant que le formulaire est en cours d'envoi, vous pouvez utilisez le Hook `useFormStatus` dans un composant au sein du `<form>` et lire la propriété `pending` qu'il renvoie.

Nous utilisons ci-dessous la propriété `pending` pour indiquer que le formulaire est en cours d'envoi.
=======
Here, we use the `pending` property to indicate the form is submitting.
>>>>>>> f3d9794fc31f4a3faf7e863984d37f4ae86b3290

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Envoi en cours..." : "Envoyer"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```
<<<<<<< HEAD

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
=======
>>>>>>> f3d9794fc31f4a3faf7e863984d37f4ae86b3290
</Sandpack>

<Pitfall>

#### `useFormStatus` ne renverra pas d'information d'état pour un `<form>` situé dans le même composant. {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

Le Hook `useFormStatus` ne renvoie que les informations d'état du `<form>` parent, et non celles d'un `<form>` placé dans le rendu du composant appelant le Hook ou dans ses composants enfants.

```js
function Form() {
  // 🚩 `pending` ne sera jamais `true`
  // useFormStatus ne surveille pas le formulaire situé dans le
  // rendu de ce composant
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

Appelez plutôt `useFormStatus` depuis un composant imbriqué dans `<form>`.

```js
function Submit() {
<<<<<<< HEAD
  // ✅ `pending` se basera sur le formulaire qui enrobe
  // le composant Submit
=======
  // ✅ `pending` will be derived from the form that wraps the Submit component
>>>>>>> f3d9794fc31f4a3faf7e863984d37f4ae86b3290
  const { pending } = useFormStatus();
  return <button disabled={pending}>...</button>;
}

function Form() {
  // Voici le <form> surveillé par `useFormStatus`
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

### Lire les données en cours d'envoi {/*read-form-data-being-submitted*/}

Vous pouvez utiliser la propriété `data` des informations d'état renvoyées par `useFormStatus` pour afficher les données que l'utilisateur est en train d'envoyer.

Dans l'exemple ci-dessous, nous avons un formulaire permettant à l'utilisateur de réserver un identifiant. Nous pouvons y utiliser `useFormStatus` pour afficher un message temporaire confirmant l'identifiant demandé.

<Sandpack>

```js src/UsernameForm.js active
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  return (
    <div>
      <h3>Réserver l’identifiant : </h3><br />
      <input type="text" name="username" disabled={pending} />
      <button type="submit" disabled={pending}>
        Envoyer
      </button>
      <br />
      <p>{data ? `Récupération de ${data?.get('username')}...` : ''}</p>
    </div>
  );
}
```

```js src/App.js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";
import { useRef } from 'react';

export default function App() {
  const ref = useRef(null);
  return (
    <form ref={ref} action={async (formData) => {
      await submitForm(formData);
      ref.current.reset();
    }}>
      <UsernameForm />
    </form>
  );
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 2000));
}
```

```css
p {
    height: 14px;
    padding: 0;
    margin: 2px 0 0 0 ;
    font-size: 14px
}

button {
    margin-left: 2px;
}

```

<<<<<<< HEAD
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
=======
>>>>>>> f3d9794fc31f4a3faf7e863984d37f4ae86b3290
</Sandpack>

---

## Dépannage {/*troubleshooting*/}

### `status.pending` ne vaut jamais `true` {/*pending-is-never-true*/}

<<<<<<< HEAD
`useFormStatus` ne renvoie d'informations d'état que pour un `<form>` parent.
=======
`useFormStatus` will only return status information for a parent `<form>`.
>>>>>>> f3d9794fc31f4a3faf7e863984d37f4ae86b3290

Si le composant qui appelle `useFormStatus` n'est pas imbriqué dans un `<form>`, `status.pending` vaudra toujours `false`. Vérifiez que `useFormStatus` est appelé depuis un composant qui figure à l'intérieur d'un élément `<form>`.

`useFormStatus` ne surveillera pas l'état d'un `<form>` situé dans le rendu du même composant. Consultez le [Piège](#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component) pour en savoir plus.
