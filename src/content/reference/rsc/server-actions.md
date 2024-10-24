---
title: Actions Serveur
canary: true
---

<Intro>

Les Actions Serveur permettent aux Composants Client d'appeler des fonctions asynchrones exécutées côté serveur.

</Intro>

<InlineToc />

<Note>

#### Comment prendre en charge les Actions Serveur ? {/*how-do-i-build-support-for-server-actions*/}

Même si les Actions Serveur dans React 19 sont stables et ne casseront pas la compatibilité entre les versions majeures, les API sous-jacentes utilisées pour implémenter les Actions Serveur au sein d'un *bundler* ou framework compatible avec les React Server Components ne suivent pas, elles, le versionnage sémantique et sont susceptibles de casser la compatibilité entre les versions mineures de React 19.x.

Pour prendre en charge les Actions Serveur dans un *bundler* ou framework, nous vous conseillons de figer React sur une version spécifique, ou d'utiliser une version Canari.  Nous allons continuer à collaborer avec les *bundlers* et frameworks pour stabiliser les API utilisées pour implémenter les Actions Serveur à l'avenir.

</Note>

Lorsqu'une Action Serveur est définie au moyen d'une directive `"use server"`, votre framework crée automatiquement une référence à la fonction serveur, et la passe au Composant Client.  Lorsque cette fonction sera appelée côté client, React réagira en envoyant une requête au serveur pour exécuter cette fonction, et en renvoyant le résultat.

Les Actions Serveur peuvent être créées dans les Composants Serveur et passées comme props à des Composants Client, ou peuvent être directement importées et utilisées dans des Composants Client.

### Créer une Action Serveur à partir d'un Composant Serveur {/*creating-a-server-action-from-a-server-component*/}

Les Composants Serveur peuvent définir des Actions Serveur au moyen de la directive `"use server"` :

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Composant Serveur
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Action Serveur
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

Lorsque React affichera le Composant Serveur `EmptyNote`, il créera une référence à la fonction `createNoteAction` et passera cette référence au Composant Client `Button`. Lorsqu'on cliquera sur le bouton, React enverra la requête au serveur pour exécuter la fonction `createNoteAction` avec la référence fournie :

```js {5}
"use client";

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Créer une note vide</button>
}
```

Pour en savoir plus, consultez la documentation de [`"use server"`](/reference/rsc/use-server).


### Importer des Actions Serveur depuis des Composants Client {/*importing-server-actions-from-client-components*/}

Les Composants Client peuvent importer des Actions Serveur depuis des modules utilisant la directive `"use server"` :

```js [[1, 3, "createNoteAction"]]
"use server";

export async function createNoteAction() {
  await db.notes.create();
}

```

Lorsque le *bundler* construit le Composant Client `EmptyNote`, il injecte dans le *bundle* une référence à la fonction `createNoteAction`. Lorsqu'on cliquera sur le `button`, React enverra une requête au serveur pour exécuter la fonction `createNoteAction` au moyen de la référence fournie :

```js [[1, 2, "createNoteAction"], [1, 5, "createNoteAction"], [1, 7, "createNoteAction"]]
"use client";
import {createNoteAction} from './actions';

function EmptyNote() {
  console.log(createNoteAction);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={createNoteAction} />
}
```

Pour en savoir plus, consultez la documentation de [`"use server"`](/reference/rsc/use-server).

### Composer les Actions Serveur au moyen des Actions {/*composing-server-actions-with-actions*/}

Les Actions Serveur peuvent être composées avec des Actions côté client :

```js [[1, 3, "updateName"]]
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Le nom est requis'};
  }
  await db.users.updateName(name);
}
```

```js [[1, 3, "updateName"], [1, 13, "updateName"], [2, 11, "submitAction"],  [2, 23, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  const submitAction = async () => {
    startTransition(async () => {
      const {error} = await updateName(name);
      if (!error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Échec : {state.error}</span>}
    </form>
  )
}
```

Ça vous permet d'accéder à l'état `isPending` de l'Action Serveur en l'enrobant dans une Action côté client.

Pour en savoir plus, allez lire [Appeler une Action Serveur hors d'un `<form>`](/reference/rsc/use-server#calling-a-server-action-outside-of-form).

### Actions de formulaire et Actions Serveur {/*form-actions-with-server-actions*/}

Les Actions Serveur peuvent interagir avec des fonctionnalités de formulaire de React 19.

Vous pouvez passer une Action Serveur à un formulaire pour envoyer automatiquement le formulaire au serveur :


```js [[1, 3, "updateName"], [1, 7, "updateName"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  )
}
```

Lorsque l'envoi du formulaire aura réussi, React réinitialisera automatiquement le formulaire. Vous pouvez ajouter `useActionState` pour accéder à l'état d'attente, consulter la dernière réponse connue, ou prendre en charge l'amélioration progressive.

Pour en savoir plus, allez lire [Les Actions Serveur dans les formulaires](/reference/rsc/use-server#server-actions-in-forms).

### Actions Serveur et `useActionState` {/*server-actions-with-use-action-state*/}

Vous pouvez composer des Actions Serveur avec `useActionState` pour le cas classique où vous avez juste besoin d'accéder à l'état en attente de l'action et à sa dernière réponse connue :

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "submitAction"], [2, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Échec : {state.error}</span>}
    </form>
  );
}
```

Lorsque vous utilisez `useActionState` avec des Actions Serveur, React rejoue automatiquement les envois de formulaire réalisés avant la fin de l'hydratation.  Ça signifie que les utilisateurs peuvent interagir avec votre appli avant même qu'elle soit hydratée.

Pour en savoir plus, consultez la documentation de [`useActionState`](/reference/react-dom/hooks/useFormState).

### Amélioration progressive avec `useActionState` {/*progressive-enhancement-with-useactionstate*/}

Les Actions Serveur prennent aussi en charge l'amélioration progressive grâce au troisième argument de `useActionState`.

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "/name/update"], [3, 6, "submitAction"], [3, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, null, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

Lorsqu'un <CodeStep step={2}>permalien</CodeStep> est fourni à `useActionState`, React redirigera sur l'URL fournie si le formulaire est envoyé avant que le *bundle* JavaScript soit chargé.

Apprenez-en davantage dans la documentation de [`useActionState`](/reference/react-dom/hooks/useFormState).
