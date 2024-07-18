---
title: "'use server'"
titleForTitleTag: "Directive 'use server'"
canary: true
---

<Canary>

`'use server'` n'est utile que si vous [utilisez React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) ou créez une bibliothèque compatible avec eux.

</Canary>


<Intro>

`'use server'` marque les fonctions côté serveur qui peuvent être appelées par du code React côté client.

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `'use server'` {/*use-server*/}

Ajoutez `'use server';` tout en haut d'une fonction asynchrone pour indiquer que cette fonction peut être appelée par du code côté client. Nous appelons ces fonctions des _Actions Serveur_.

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

Lorsque vous appelez une Action Serveur côté client, elle fait une requête réseau auprès du serveur en incluant une copie sérialisée des arguments que vous avez passés. Si l'Action Serveur renvoie une valeur, cette valeur sera sérialisée puis renvoyée au client.

Plutôt que de marquer chaque fonction concernée avec `'use server'`, vous pouvez ajouter cette directive tout en haut d'un fichier afin d'en marquer tous les exports comme des Actions Serveur utilisables n'importe où, y compris au travers d'imports par du code client.

#### Limitations {/*caveats*/}

* `'use server'` doit être placé au tout début de la fonction ou du module concerné ; au-dessus notamment de tout code, y compris les imports (mais il peut y avoir des commentaires avant les directives).  La directive doit utiliser des apostrophes (`'`) ou guillemets (`"`), mais pas des *backticks* (<code>`</code>).
* `'use server'` ne peut être utilisé qu'au sein de fichiers côté serveur.  Les Actions Serveur résultantes peuvent être passées à des Composants Client au moyen des props. Consultez la liste des [types sérialisables](#serializable-parameters-and-return-values).
* Pour importer une Action Serveur depuis du [code côté client](/reference/rsc/use-client), la directive doit obligatoirement être utilisée au niveau du module.
* Dans la mesure où les appels réseau sous-jacents sont forcément asynchrones, `'use server'` n'est utilisable qu'au sein de fonctions asynchrones.
* Considérez toujours les arguments de vos Actions Serveur comme des données non validées, et soumettez toute mutation à un processus d'autorisation. Allez voir les [considérations sécuritaires](#security).
* Les Actions Serveur devraient toujours être appelées au sein d'une [Transition](/reference/react/useTransition). Les Actions Serveur passées à [`<form action>`](/reference/react-dom/components/form#props) ou [`formAction`](/reference/react-dom/components/input#props) seront automatiquement enrobées par une transition.
* Les Actions Serveur sont conçues pour des mutations qui mettent à jour l'état côté serveur ; il est déconseillé de s'en servir pour du simple chargement de données. Dans cet esprit, les frameworks qui implémentent les Actions Serveur traitent généralement une action à la fois et ne permettent pas la mise en cache de leur valeur renvoyée.

### Considérations sécuritaires {/*security*/}

Les arguments passés aux Actions Serveur sont entièrement contrôlés par le côté client. Pour des raisons de sécurité, traitez-les toujours comme des données non validées, et assurez-vous d'en vérifier la structure et le contenu, et de procéder à leur échappement lorsque c'est nécessaire.

Par ailleurs, et quelle que soit l'Action Serveur, assurez-vous toujours que l'utilisateur authentifié a le droit d'effectuer cette action.

<Wip>

Pour éviter le renvoi de données sensibles par une Action Serveur, nous proposons des API expérimentales empêchant l'envoi vers du code côté client de valeurs et objets uniques « ternis ».

Allez jeter un coup d'œil à [experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) et [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference).

</Wip>

### Arguments et valeurs renvoyées sérialisables {/*serializable-parameters-and-return-values*/}

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

* Les éléments React, ainsi que [JSX](/learn/writing-markup-with-jsx)
* Les fonctions, y compris les fonctions composants, et de façon plus générale toute fonction qui ne serait pas une Action Serveur
* Les [classes](https://developer.mozilla.org/fr/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Les objets de quelque classe que ce soit (hormis les classes natives explicitement listées plus haut) ainsi que les objets ayant [un prototype nul](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Les symboles non inscrits au global, ex. `Symbol('my new symbol')`

Les valeurs renvoyées sérialisables sont les mêmes que pour les [props sérialisables](/reference/rsc/use-client#passing-props-from-server-to-client-components) d'un Composant Client agissant comme « point de césure » entre le code côté client et le code côté serveur.

## Utilisation {/*usage*/}

### Les Actions Serveur dans les formulaires {/*server-actions-in-forms*/}

Le cas le plus courant d'Actions Serveur consiste à appeler des fonctions côté serveur pour modifier des données. Dans le navigateur, on utilise traditionnellement [l'élément HTML `form`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/form) pour permettre à l'utilisateur de demander une mutation de données.  Avec les React Server Components, React prend désormais pleinement en charge les Actions Serveur dans les [formulaires](/reference/react-dom/components/form).

Voici un formulaire qui permet à l'utilisateur de réserver un identifiant.

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

Dans cet exemple, `requestUsername` est une Action Serveur passée à un `<form>`. Lorsque l'utilisateur envoie le formulaire, une requête réseau est faite à l'Action Serveur `requestUsername`. Puisque celle-ci est appelée au travers d'un formulaire, React fournit les <CodeStep step={1}>[FormData](https://developer.mozilla.org/fr/docs/Web/API/FormData)</CodeStep> du formulaire comme premier argument à l'Action Serveur.

Grâce au passage d'une Action Serveur comme `action` du formulaire, React peut faire [l'amélioration progressive](https://developer.mozilla.org/fr/docs/Glossary/Progressive_Enhancement) du formulaire. Ça signifie que les formulaires peuvent être envoyés avant même que le *bundle* JavaScript ne soit chargé et exécuté.

#### Gérer les valeurs renvoyées dans les formulaires {/*handling-return-values*/}

Pour revenir à notre formulaire de réservation d'identifiant, il peut arriver que l'identifiant ne soit plus disponible. `requestUsername` devrait nous indiquer si elle a réussi ou non sa réservation.

Pour mettre à jour l'UI sur base du résultat d'une Action Serveur, tout en proposant une amélioration progressive, utilisez [`useActionState`](/reference/react/useActionState).

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

### Appeler une Action Serveur hors d'un `<form>` {/*calling-a-server-action-outside-of-form*/}

Les Actions Serveur exposent en pratique des points d'entrée côté serveur, et peuvent être appelées n'importe où dans du code client.

Pour utiliser une Action Serveur hors d'un [formulaire](/reference/react-dom/components/form), appelez l'Action Serveur au sein d'une [Transition](/reference/react/useTransition), ce qui vous permettra non seulement d'afficher un indicateur de chargement, mais aussi de réaliser des [mises à jour optimistes d'état](/reference/react/useOptimistic) et de gérer les éventuelles erreurs. Les formulaires enrobent automatiquement vos Actions Serveur dans une transition.

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

Pour obtenir la valeur renvoyée par une Action Serveur, vous aurez besoin d'un `await` sur la promesse renvoyée.
