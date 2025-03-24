---
title: "'use server'"
<<<<<<< HEAD
titleForTitleTag: "Directive 'use server'"
canary: true
=======
titleForTitleTag: "'use server' directive"
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d
---

<RSC>

<<<<<<< HEAD
`'use server'` n'est utile que si vous [utilisez React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) ou créez une bibliothèque compatible avec eux.
=======
`'use server'` is for use with [using React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

</RSC>


<Intro>

`'use server'` marque les fonctions côté serveur qui peuvent être appelées par du code React côté client.

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `'use server'` {/*use-server*/}

<<<<<<< HEAD
Ajoutez `'use server';` tout en haut d'une fonction asynchrone pour indiquer que cette fonction peut être appelée par du code côté client. Nous appelons ces fonctions des _Actions Serveur_.
=======
Add `'use server'` at the top of an async function body to mark the function as callable by the client. We call these functions [_Server Functions_](/reference/rsc/server-functions).
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

<<<<<<< HEAD
Lorsque vous appelez une Action Serveur côté client, elle fait une requête réseau auprès du serveur en incluant une copie sérialisée des arguments que vous avez passés. Si l'Action Serveur renvoie une valeur, cette valeur sera sérialisée puis renvoyée au client.

Plutôt que de marquer chaque fonction concernée avec `'use server'`, vous pouvez ajouter cette directive tout en haut d'un fichier afin d'en marquer tous les exports comme des Actions Serveur utilisables n'importe où, y compris au travers d'imports par du code client.

#### Limitations {/*caveats*/}
=======
When calling a Server Function on the client, it will make a network request to the server that includes a serialized copy of any arguments passed. If the Server Function returns a value, that value will be serialized and returned to the client.

Instead of individually marking functions with `'use server'`, you can add the directive to the top of a file to mark all exports within that file as Server Functions that can be used anywhere, including imported in client code.

#### Caveats {/*caveats*/}
* `'use server'` must be at the very beginning of their function or module; above any other code including imports (comments above directives are OK). They must be written with single or double quotes, not backticks.
* `'use server'` can only be used in server-side files. The resulting Server Functions can be passed to Client Components through props. See supported [types for serialization](#serializable-parameters-and-return-values).
* To import a Server Functions from [client code](/reference/rsc/use-client), the directive must be used on a module level.
* Because the underlying network calls are always asynchronous, `'use server'` can only be used on async functions.
* Always treat arguments to Server Functions as untrusted input and authorize any mutations. See [security considerations](#security).
* Server Functions should be called in a [Transition](/reference/react/useTransition). Server Functions passed to [`<form action>`](/reference/react-dom/components/form#props) or [`formAction`](/reference/react-dom/components/input#props) will automatically be called in a transition.
* Server Functions are designed for mutations that update server-side state; they are not recommended for data fetching. Accordingly, frameworks implementing Server Functions typically process one action at a time and do not have a way to cache the return value.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

* `'use server'` doit être placé au tout début de la fonction ou du module concerné ; au-dessus notamment de tout code, y compris les imports (mais il peut y avoir des commentaires avant les directives).  La directive doit utiliser des apostrophes (`'`) ou guillemets (`"`), mais pas des *backticks* (<code>`</code>).
* `'use server'` ne peut être utilisé qu'au sein de fichiers côté serveur.  Les Actions Serveur résultantes peuvent être passées à des Composants Client au moyen des props. Consultez la liste des [types sérialisables](#serializable-parameters-and-return-values).
* Pour importer une Action Serveur depuis du [code côté client](/reference/rsc/use-client), la directive doit obligatoirement être utilisée au niveau du module.
* Dans la mesure où les appels réseau sous-jacents sont forcément asynchrones, `'use server'` n'est utilisable qu'au sein de fonctions asynchrones.
* Considérez toujours les arguments de vos Actions Serveur comme des données non validées, et soumettez toute mutation à un processus d'autorisation. Allez voir les [considérations sécuritaires](#security).
* Les Actions Serveur devraient toujours être appelées au sein d'une [Transition](/reference/react/useTransition). Les Actions Serveur passées à [`<form action>`](/reference/react-dom/components/form#props) ou [`formAction`](/reference/react-dom/components/input#props) seront automatiquement enrobées par une transition.
* Les Actions Serveur sont conçues pour des mutations qui mettent à jour l'état côté serveur ; il est déconseillé de s'en servir pour du simple chargement de données. Dans cet esprit, les frameworks qui implémentent les Actions Serveur traitent généralement une action à la fois et ne permettent pas la mise en cache de leur valeur renvoyée.

<<<<<<< HEAD
### Considérations sécuritaires {/*security*/}

Les arguments passés aux Actions Serveur sont entièrement contrôlés par le côté client. Pour des raisons de sécurité, traitez-les toujours comme des données non validées, et assurez-vous d'en vérifier la structure et le contenu, et de procéder à leur échappement lorsque c'est nécessaire.

Par ailleurs, et quelle que soit l'Action Serveur, assurez-vous toujours que l'utilisateur authentifié a le droit d'effectuer cette action.

<Wip>

Pour éviter le renvoi de données sensibles par une Action Serveur, nous proposons des API expérimentales empêchant l'envoi vers du code côté client de valeurs et objets uniques « ternis ».
=======
Arguments to Server Functions are fully client-controlled. For security, always treat them as untrusted input, and make sure to validate and escape arguments as appropriate.

In any Server Function, make sure to validate that the logged-in user is allowed to perform that action.

<Wip>

To prevent sending sensitive data from a Server Function, there are experimental taint APIs to prevent unique values and objects from being passed to client code.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

Allez jeter un coup d'œil à [experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) et [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference).

</Wip>

### Arguments et valeurs renvoyées sérialisables {/*serializable-parameters-and-return-values*/}

<<<<<<< HEAD
Lorsque du code côté client appelle l'Action Serveur au travers du réseau, tout argument passé aura besoin d'être sérialisé.

Voici les types pris en charge pour les arguments d'une Action Serveur :

* Types primitifs
	* [string](https://developer.mozilla.org/fr/docs/Glossary/String)
	* [number](https://developer.mozilla.org/fr/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/fr/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/fr/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/fr/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Symbol), mais uniquement pour ceux inscrits auprès du référentiel global de symboles *via* [`Symbol.for`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Les itérables contenant des valeurs sérialisables
	* [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) et [ArrayBuffer](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Date)
* Les instances de [FormData](https://developer.mozilla.org/fr/docs/Web/API/FormData)
* Les [objets](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) bruts : ceux créés via des [initialiseurs d'objets](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Object_initializer), dont les propriétés sont sérialisables
* Les fonctions qui sont des Actions Serveur
* Les [promesses](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise)

En particulier, les types suivants ne sont **pas** pris en charge :
=======
Since client code calls the Server Function over the network, any arguments passed will need to be serializable.

Here are supported types for Server Function arguments:

* Primitives
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), only symbols registered in the global Symbol registry via [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Iterables containing serializable values
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) and [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instances
* Plain [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): those created with [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), with serializable properties
* Functions that are Server Functions
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Notably, these are not supported:
* React elements, or [JSX](/learn/writing-markup-with-jsx)
* Functions, including component functions or any other function that is not a Server Function
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Objects that are instances of any class (other than the built-ins mentioned) or objects with [a null prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Symbols not registered globally, ex. `Symbol('my new symbol')`
* Events from event handlers
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

* Les éléments React, ainsi que [JSX](/learn/writing-markup-with-jsx)
* Les fonctions, y compris les fonctions composants, et de façon plus générale toute fonction qui ne serait pas une Action Serveur
* Les [classes](https://developer.mozilla.org/fr/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Les objets de quelque classe que ce soit (hormis les classes natives explicitement listées plus haut) ainsi que les objets ayant [un prototype nul](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Les symboles non inscrits au global, ex. `Symbol('my new symbol')`

Les valeurs renvoyées sérialisables sont les mêmes que pour les [props sérialisables](/reference/rsc/use-client#passing-props-from-server-to-client-components) d'un Composant Client agissant comme « point de césure » entre le code côté client et le code côté serveur.

## Utilisation {/*usage*/}

### Les Actions Serveur dans les formulaires {/*server-actions-in-forms*/}

<<<<<<< HEAD
Le cas le plus courant d'Actions Serveur consiste à appeler des fonctions côté serveur pour modifier des données. Dans le navigateur, on utilise traditionnellement [l'élément HTML `form`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/form) pour permettre à l'utilisateur de demander une mutation de données.  Avec les React Server Components, React prend désormais pleinement en charge les Actions Serveur dans les [formulaires](/reference/react-dom/components/form).

Voici un formulaire qui permet à l'utilisateur de réserver un identifiant.
=======
### Server Functions in forms {/*server-functions-in-forms*/}

The most common use case of Server Functions will be calling functions that mutate data. On the browser, the [HTML form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) is the traditional approach for a user to submit a mutation. With React Server Components, React introduces first-class support for Server Functions as Actions in [forms](/reference/react-dom/components/form).

Here is a form that allows a user to request a username.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

```js [[1, 3, "formData"]]
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Réserver</button>
    </form>
  );
}
```

<<<<<<< HEAD
Dans cet exemple, `requestUsername` est une Action Serveur passée à un `<form>`. Lorsque l'utilisateur envoie le formulaire, une requête réseau est faite à l'Action Serveur `requestUsername`. Puisque celle-ci est appelée au travers d'un formulaire, React fournit les <CodeStep step={1}>[FormData](https://developer.mozilla.org/fr/docs/Web/API/FormData)</CodeStep> du formulaire comme premier argument à l'Action Serveur.

Grâce au passage d'une Action Serveur comme `action` du formulaire, React peut faire [l'amélioration progressive](https://developer.mozilla.org/fr/docs/Glossary/Progressive_Enhancement) du formulaire. Ça signifie que les formulaires peuvent être envoyés avant même que le *bundle* JavaScript ne soit chargé et exécuté.
=======
In this example `requestUsername` is a Server Function passed to a `<form>`. When a user submits this form, there is a network request to the server function `requestUsername`. When calling a Server Function in a form, React will supply the form's <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> as the first argument to the Server Function.

By passing a Server Function to the form `action`, React can [progressively enhance](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) the form. This means that forms can be submitted before the JavaScript bundle is loaded.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

#### Gérer les valeurs renvoyées dans les formulaires {/*handling-return-values*/}

Pour revenir à notre formulaire de réservation d'identifiant, il peut arriver que l'identifiant ne soit plus disponible. `requestUsername` devrait nous indiquer si elle a réussi ou non sa réservation.

<<<<<<< HEAD
Pour mettre à jour l'UI sur base du résultat d'une Action Serveur, tout en proposant une amélioration progressive, utilisez [`useActionState`](/reference/react/useActionState).
=======
To update the UI based on the result of a Server Function while supporting progressive enhancement, use [`useActionState`](/reference/react/useActionState).
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

```js
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'réussie';
  }
  return 'échouée';
}
```

```js {4,8}, [[1, 2, "'use client'"]]
// UsernameForm.js
'use client';

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/d');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Réserver</button>
      </form>
      <p>Résultat de la dernière réservation : {state}</p>
    </>
  );
}
```

Remarquez que `useActionState`, au même titre que la plupart des Hooks, ne peut être appelé que depuis du <CodeStep step={1}>[code côté client](/reference/rsc/use-client)</CodeStep>.

<<<<<<< HEAD
### Appeler une Action Serveur hors d'un `<form>` {/*calling-a-server-action-outside-of-form*/}

Les Actions Serveur exposent en pratique des points d'entrée côté serveur, et peuvent être appelées n'importe où dans du code client.

Pour utiliser une Action Serveur hors d'un [formulaire](/reference/react-dom/components/form), appelez l'Action Serveur au sein d'une [Transition](/reference/react/useTransition), ce qui vous permettra non seulement d'afficher un indicateur de chargement, mais aussi de réaliser des [mises à jour optimistes d'état](/reference/react/useOptimistic) et de gérer les éventuelles erreurs. Les formulaires enrobent automatiquement vos Actions Serveur dans une transition.
=======
### Calling a Server Function outside of `<form>` {/*calling-a-server-function-outside-of-form*/}

Server Functions are exposed server endpoints and can be called anywhere in client code.

When using a Server Function outside a [form](/reference/react-dom/components/form), call the Server Function in a [Transition](/reference/react/useTransition), which allows you to display a loading indicator, show [optimistic state updates](/reference/react/useOptimistic), and handle unexpected errors. Forms will automatically wrap Server Functions in transitions.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d

```js {9-12}
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Total des Likes : {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Like</button>;
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

<<<<<<< HEAD
Pour obtenir la valeur renvoyée par une Action Serveur, vous aurez besoin d'un `await` sur la promesse renvoyée.
=======
To read a Server Function return value, you'll need to `await` the promise returned.
>>>>>>> f6d762cbbf958ca45bb8d1d011b31e5289e43a3d
