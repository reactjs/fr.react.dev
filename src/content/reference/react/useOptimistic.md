---
title: useOptimistic
canary: true
---

<Canary>

Le Hook `useOptimistic` n'est actuellement disponible que sur les canaux de livraison Canary et Expérimental de React. Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`useOptimistic` est un Hook React qui vous permet de mettre à jour l'interface utilisateur (UI) de façon optimiste.

```js
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useOptimistic(state, updateFn)` {/*useoptimistic*/}

`useOptimistic` est un Hook React qui vous permet d'afficher un état distinct pendant qu'une action asynchrone est en cours.  Il accepte un argument d'état et renvoie une copie de cet état qui peut être différente pendant l'exécution de l'action asynchrone (par exemple une requête réseau). Vous fournissez une fonction qui accepte en arguments l'état courant et les données fournies à l'action, et renvoie l'état optimiste à utiliser pendant que l'action est en cours.

Cet état est qualifié « d'optimiste » parce qu'il est généralement utilisé pour immédiatement présenter à l'utilisateur le résultat de l'exécution de l'action, même si cette action met en réalité du temps à aboutir.

```js
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // fusionne et renvoie l'état avec une valeur optimiste
    }
  );
}
```

[Voir d'autres exemples plus bas](#usage).

#### Paramètres {/*parameters*/}

* `state` : la valeur à renvoyer initialement, ainsi que lorsqu'aucune action n'est en cours.
* `updateFn(currentState, optimisticValue)` : une fonction qui accepte en arguments l'état courant et la valeur optimiste passée à `addOptimistic`, et renvoie l'état optimiste résultant. Il doit s'agir d'une fonction pure. `updateFn` accepte deux arguments : le `currentState` et la `optimisticValue`. La valeur renvoyée doit être le résultat d'une fusion métier de `currentState` et `optimisticValue`.


#### Valeur renvoyée {/*returns*/}

* `optimisticState` : l'état optimiste résultant. Il équivaut à `state`, à moins qu'une action soit en cours, auquel cas il est la valeur renvoyée par `updateFn`.
* `addOptimistic` : `addOptimistic` est une fonction déclencheur que vous appelez lorsque vous avez une mise à jour optimiste à faire. Elle accepte un argument, `optimisticValue`, de quelque type que ce soit, et appellera `updateFn` avec `state` et `optimisticValue`.

---

## Utilisation {/*usage*/}

### Mise à jour optimiste de formulaires {/*optimistically-updating-with-forms*/}

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
    setMessages((messages) => [...messages, { text: sentMessage }]);
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
