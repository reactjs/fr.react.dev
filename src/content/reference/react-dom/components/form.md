---
title: "<form>"
canary: true
---

<Canary>

Les extensions de React à `<form>` ne sont actuellement disponibles que sur les canaux de livraison Canary et Expérimental de React. Dans les versions stables de React, `<form>` fonctionne comme [le composant HTML natif du navigateur](https://react.dev/reference/react-dom/components#all-html-components). Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

Le [composant natif `<form>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/form) vous permet de créer des champs interactifs pour envoyer des informations.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Rechercher</button>
</form>
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `<form>` {/*form*/}

Pour créer des formulaires interactifs, utilisez le [composant natif `<form>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/form).

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Rechercher</button>
</form>
```

[Voir d'autres exemples plus bas](#usage).

#### Props {/*props*/}

`<form>` prend en charge toutes les [props communes aux éléments](/reference/react-dom/components/common#props).

[`action`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/form#action) : une URL ou une fonction. Lorsqu'une URL est passée à `action`, le formulaire se comporte comme un formulaire HTML classique. Mais si une fonction est passée à `action`, la fonction traitera l'envoi du formulaire. La fonction passée à `action` peut être asynchrone et sera appelée avec un unique argument contenant les [données envoyées par le formulaire](https://developer.mozilla.org/fr/docs/Web/API/FormData). La prop `action` peut céder la priorité à la prop `formAction` d'un composant `<button>`, `<input type="submit">`, ou `<input type="image">`.

#### Limitations {/*caveats*/}

* Lorsqu'une fonction est passée à `action` ou `formAction`, la méthode HTTP sera POST indépendamment de la valeur de la prop `method`.

---

## Utilisation {/*usage*/}

### Gérer l'envoi de formulaire côté client {/*handle-form-submission-on-the-client*/}

Passez une fonction à la prop `action` du formulaire pour exécuter cette fonction lors de l'envoi du formulaire. Les [`formData`](https://developer.mozilla.org/fr/docs/Web/API/FormData) lui seront passées en argument, afin que vous puissiez accéder aux données envoyées par le formulaire. C'est là une différence avec l'attribut [HTML `action`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/form#action), qui n'accepte que des URL.

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`Vous avez recherché « ${query} »`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Rechercher</button>
    </form>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### Gérer l'envoi de formulaire dans une Action Serveur {/*handle-form-submission-with-a-server-action*/}

Affichez un `<form>` avec un champ de saisie et un bouton d'envoi, puis passez-lui une Action Serveur (une fonction dotée de la directive [`'use server'`](/reference/rsc/use-server)) *via* sa prop `action` pour exécuter cette fonction quand le formulaire sera envoyé.

Passer une Action Serveur à `<form action>` permet aux utilisateurs d'envoyer le formulaire même sans JavaScript activé, ou avant que le code JavaScript ne soit chargé et exécuté.  C'est bien pratique pour les utilisateurs ne disposant que d'une connexion ou d'un appareil lents, ou qui ont JavaScript désactivé.  C'est d'ailleurs un comportement similaire à celui des formulaires dont la prop `action` contient une URL.

Vous pouvez utiliser des champs cachés pour fournir des données à l'action du `<form>`.  L'Action Serveur récupèrera ces données de champs cachés au moyen d'une instance de [`FormData`](https://developer.mozilla.org/fr/docs/Web/API/FormData).

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server'
    const productId = formData.get('productId')
    await updateCart(productId)
  }
  return (
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">Ajouter au panier</button>
    </form>

  );
}
```

Plutôt que de fournir les données à l'action du `<form>` au moyen de champs cachés, vous pouvez recourir à la méthode <CodeStep step={1}>`bind`</CodeStep> pour pré-remplir ses arguments. Dans l'exemple qui suit, on pré-remplit un argument (<CodeStep step={2}>`productId`</CodeStep>) pour la fonction, en plus des <CodeStep step={3}>`formData`</CodeStep> qui lui sont passées par défaut.

```jsx [[1, 8, "bind"], [2,8, "productId"], [2,4, "productId"], [3,4, "formData"]]
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(productId, formData) {
    "use server";
    await updateCart(productId)
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Ajouter au panier</button>
    </form>
  );
}
```

Lorsqu'un `<form>` fait son rendu au sein d'un [Composant Serveur](/reference/rsc/use-client), et qu'en prime une [Action Serveur](/reference/rsc/use-server) est passée à la prop `action` du `<form>`, le formulaire bénéficie d'une [amélioration progressive](https://developer.mozilla.org/fr/docs/Glossary/Progressive_Enhancement).

### Afficher un état d'attente pendant l'envoi du formulaire {/*display-a-pending-state-during-form-submission*/}

Pour afficher un état d'attente dans un formulaire pendant son envoi, vous pouvez utiliser le Hook `useFormStatus` dans un composant affiché au sein d'un `<form>`, et lire la propriété `pending` qu'il renvoie.

Nous utilisons ci-dessous la propriété `pending` pour indiquer que le formulaire est en cours d'envoi.

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

Pour en apprendre davantage, consultez la [documentation de référence du Hook `useFormStatus`](/reference/react-dom/hooks/useFormStatus).

### Mettre à jour les données de formulaire de façon optimiste {/*optimistically-updating-form-data*/}

Le Hook `useOptimistic` fournit un moyen de mettre à jour l'UI de façon optimiste le temps qu'une opération d'arrière-plan, telle qu'une requête réseau, aboutisse. Dans le contexte des formulaires, cette technique permet d'améliorer la fluidité perçue de l'appli.  Lorsqu'un utilisateur envoie un formulaire, plutôt que d'attendre la réponse du serveur avant de refléter les changements, l'interface peut être mise à jour immédiatement avec le résultat prévu.

Lorsqu'un utilisateur saisit par exemple un message dans un formulaire puis clique sur le bouton « Envoyer », le Hook `useOptimistic` permet à ce message d'apparaître immédiatement dans la liste avec une étiquette « Envoi… », avant même que le message ne soit réellement envoyé au serveur. Cette approche « optimiste » donne une impression de vitesse et de réactivité.  Le formulaire tente ensuite de réellement envoyer le message en arrière-plan. Une fois que le serveur en a confirmé réception, l'étiquette « Envoi… » est retirée.

<Sandpack>

```js src/App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Envoi...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="(exemple : Salut !)" />
        <button type="submit">Envoyer</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Coucou toi !", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages([...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

Pour en apprendre davantage, consultez la [documentation de référence du Hook `useOptimistic`](/reference/react/useOptimistic).

### Gérer les erreurs d'envoi du formulaire {/*handling-form-submission-errors*/}

Il peut arriver que la fonction appelée par la prop `action` de `<form>` lève une erreur. Vous pouvez traiter ces erreurs en enrobant `<form>` dans un périmètre d'erreur.  Si la fonction appelée par la prop `action` de `<form>` lève une erreur, le contenu de secours du périmètre d'erreur sera affiché.

<Sandpack>

```js src/App.js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    // Pour les besoins de la démonstration uniquement
    if(comment == null){
      throw Error('Example error')
    }
  }
  return (
    <ErrorBoundary
      fallback={<p>Une erreur est survenue lors de l’envoi du formulaire</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Rechercher</button>
      </form>
    </ErrorBoundary>
  );
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### Afficher une erreur d'envoi de formulaire sans JavaScript {/*display-a-form-submission-error-without-javascript*/}

Afin d'afficher un message d'erreur d'envoi de formulaire avant même que le *bundle* JavaScript soit chargé et exécuté (à des fins d'amélioration progressive), plusieurs choses sont nécessaires :

1. le `<form>` doit figurer dans un [Composant Serveur](/reference/rsc/use-client)
2. la fonction passée à la prop `action` du `<form>` doit être une [Action Serveur](/reference/rsc/use-server)
3. le Hook `useActionState` doit être utilisé pour produire le message d'erreur

`useActionState` accepte deux arguments : une [Action Serveur](/reference/rsc/use-server) et un état initial. `useActionState` renvoie deux valeurs : une variable d'état et une action. L'action ainsi renvoyée par `useActionState` doit être passée à la prop `action` du formulaire. La variable d'état renvoyée par `useActionState` peut être utilisée pour afficher le message d'erreur. La valeur renvoyée par [l'Action Serveur](/reference/rsc/use-server) passée à `useActionState` sera utilisée pour mettre à jour la variable d'état.

<Sandpack>

```js src/App.js
import { useActionState } from "react";
import { signUpNewUser } from "./api";

export default function Page() {
  async function signup(prevState, formData) {
    "use server";
    const email = formData.get("email");
    try {
      await signUpNewUser(email);
      alert(`Inscription de « ${email} » confirmée`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
    <>
      <h1>Inscris-toi à ma newsletter</h1>
      <p>L’utilisation d’un e-mail déjà inscrit produira une erreur</p>
      <form action={formAction} id="signup-form">
        <label htmlFor="email">E-mail : </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Inscription</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  );
}
```

```js src/api.js hidden
let emails = [];

export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
    throw new Error("Cette adresse e-mail est déjà inscrite");
  }
  emails.push(newEmail);
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

Apprenez-en avantage sur la mise à jour de l'état depuis une action de formulaire dans la [documentation de référence du Hook `useFormState`](/reference/react/hooks/useActionState).

### Gérer plusieurs types d'envois {/*handling-multiple-submission-types*/}

Il est possible de concevoir un formulaire pour qu'il gère plusieurs actions d'envoi selon le bouton pressé par l'utilisateur. Chaque bouton au sein du formulaire peut être associé à une action ou un comportement distincts au moyen de sa prop `formAction`.

Lorsque l'utilisateur active un bouton précis, le formulaire est envoyé, et l'action correspondante (définie par les attributs et l'action du bouton) est exécutée. Un formulaire pourrait par exemple publier un article par défaut, mais disposer par ailleurs d'un bouton distinct avec sa propre `formAction` pour simplement le stocker comme brouillon.

<Sandpack>

```js src/App.js
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`« ${content} » vient d’être publié avec le bouton « ${button} »`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`Votre brouillon de « ${content} » est sauvegardé !`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">Publier</button>
      <button formAction={save}>Enregistrer comme brouillon</button>
    </form>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>
