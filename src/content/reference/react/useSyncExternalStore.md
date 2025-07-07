---
title: useSyncExternalStore
---

<Intro>

`useSyncExternalStore` est un Hook React qui vous permet de vous abonner à une source de données extérieure.

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

Appelez `useSyncExternalStore` à la racine de votre composant pour lire une valeur provenant d'une source de données extérieure.

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Il renvoie un instantané de cette donnée issue de la source.  Vous aurez besoin de passer deux fonctions comme arguments :

1. La fonction `subscribe` est censée s'abonner à la source et renvoyer une fonction de désabonnement.
2. La fonction `getSnapshot` est censée lire un instantané de la donnée souhaitée au sein de la source.

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `subscribe` : une fonction acceptant un unique argument `callback` et l'abonne à la source de données. Lorsque la source évolue, elle est censée invoquer `callback`, ce qui fera que React rappellera `getSnapshot` et (si besoin) refera le rendu du composant. La fonction `subscribe` est censée renvoyer une fonction qui procède au désabonnement associé.

* `getSnapshot` : une fonction qui renvoie un instantané de la donnée requise par le composant au sein de la source.  Tant que la source n'évolue pas, des appels répétés à `getSnapshot` sont censés renvoyer la même valeur. Si la source évolue et que la valeur renvoyée diffère soudain (en comparant à l'aide de [`Object.is`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), React refait un rendu du composant.

* `getServerSnapshot` **optionnelle** : une fonction qui renvoie un premier instantané de la donnée au sein de la source.  Elle ne sera utilisée que pour le rendu côté serveur, et pendant la phase d'hydratation du contenu fourni par le serveur une fois côté client.  L'instantané serveur doit être identique qu'il soit exécuté côté serveur ou côté client : il est donc généralement sérialisé et passé du serveur au client. Si vous omettez cet argument, toute tentative de rendu côté serveur de votre composant lèvera une erreur.

#### Valeur renvoyée {/*returns*/}

L'instantané actuel de la valeur issue de la source, que vous pouvez utiliser pour votre logique de rendu.

#### Limitations {/*caveats*/}

* L'instantané de la source renvoyé par `getSnapshot` doit être immuable.  Si la source de données sous-jacente a des données modifiables, renvoyez une copie immuable comme instantané lorsque la donnée change. À défaut, renvoyez une version mise en cache de l'instantané précédent.

* Si une fonction `subscribe` différente est passée lors d'un nouveau rendu, React se réabonnera à la source de données en utilisant cette nouvelle fonction `subscribe`.  Vous pouvez éviter ça en déclarant `subscribe` hors du composant.

* Si la source est modifiée au sein d'une [Transition non bloquante](/reference/react/useTransition), React se rabattra sur une application bloquante de la mise à jour. Plus spécifiquement, pour chaque mise à jour au sein de la Transition, React rappellera `getSnapshot` juste avant d'appliquer les modifications au DOM. Si la valeur renvoyée diffère de celle produite par le premier appel, React redémarrera le processus de transition de zéro, en l'appliquant cette fois en tant que mise à jour bloquante, pour garantir que chaque composant à l'écran reflète bien la même version de la source.

* Nous vous déconseillons de _suspendre_ un rendu basé sur une valeur de la source renvoyée par `useSyncExternalStore`. Ça vient de ce que les mutations de la source ne peuvent pas être marquées comme des [Transitions non bloquantes](/reference/react/useTransition), et déclencheront donc le plus proche [affichage de secours `Suspense`](/reference/react/Suspense), remplaçant ainsi du contenu déjà affiché avec un écran montrant un indicateur de chargement, ce qui est généralement indésirable en termes d'UX.

  À titre d'exemple, le code suivant est déconseillé :

  ```js
  const LazyProductDetailPage = lazy(() => import('./ProductDetailPage.js'));

  function ShoppingApp() {
    const selectedProductId = useSyncExternalStore(...);

    // ❌ Appel de `use` avec une promesse dépendant de `selectedProductId`
    const data = use(fetchItem(selectedProductId))

    // ❌ Rendu conditionnel d'un composant chargé à la demande sur base de `selectedProductId`
    return selectedProductId != null ? <LazyProductDetailPage /> : <FeaturedProducts />;
  }
  ```

---

## Utilisation {/*usage*/}

### S'abonner à une source de données extérieure {/*subscribing-to-an-external-store*/}

La plupart des composants React n'ont besoin de lire des données que depuis leurs [props](/learn/passing-props-to-a-component), leur [état](/reference/react/useState) et leur [contexte](/reference/react/useContext).  Néanmoins, il arrive parfois qu'un composant ait besoin de lire des données dont la source est extérieure à React, données qui évoluent avec le temps.  Ça inclut notamment :

* Les bibliothèques tierces de gestion d'état applicatif, qui stockent leur état hors de React.
* Les API navigateur qui exposent une valeur modifiable et des événements pour s'abonner à ses modifications.

Appelez `useSyncExternalStore` à la racine de votre composant pour lire une valeur depuis une source de données extérieure.

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Elle renvoie un <CodeStep step={3}>instantané</CodeStep> de la donnée issue de la source.  Vous devrez lui passer deux arguments fonctions :

1. La fonction <CodeStep step={1}>`subscribe`</CodeStep> est censée s'abonner à la source et renvoyer une fonction de désabonnement.
2. La fonction <CodeStep step={2}>`getSnapshot`</CodeStep> est censée lire un instantané de la donnée souhaitée au sein de la source.

React utilisera ces fonctions pour garder votre composant abonné à la source et refaire un rendu lorsque la donnée change.

Par exemple, dans le bac à sable ci-dessous, `todosStore` est implementé *via* une source de données extérieure, dont l'état est stocké hors de React. Le composant `TodosApp` se connecte à cette source extérieure avec le Hook `useSyncExternalStore`.

<Sandpack>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Ajouter une tâche</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todoStore.js
// Voici un exemple de source de données tierce
// que vous pourriez avoir besoin d'intégrer dans React.

// Si votre appli est intégralement construite avec
// React, nous vous recommandons de plutôt utiliser
// l'état local React pour ça.

let nextId = 0;
let todos = [{ id: nextId++, text: 'Tâche #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Tâche #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

</Sandpack>

<Note>

Autant que possible, nous vous recommandons de plutôt utiliser l'état local React avec [`useState`](/reference/react/useState) et [`useReducer`](/reference/react/useReducer). L'API `useSyncExternalStore` est surtout utile pour vous intégrer avec du code existant non basé sur React.

</Note>

---

### S'abonner à une API navigateur {/*subscribing-to-a-browser-api*/}

`useSyncExternalStore` est également bien utile pour vous abonner à une valeur exposée par le navigateur et susceptible de changer au fil du temps. Supposez par exemple que vous souhaitiez que votre composant affiche l'état actif ou non de la connexion réseau.  Le navigateur expose cette information au travers d'une propriété [`navigator.onLine`](https://developer.mozilla.org/docs/Web/API/Navigator/onLine).

Cette valeur peut changer sans que React le sache, vous devriez donc la lire avec `useSyncExternalStore`.

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

Pour implémenter la fonction `getSnapshot`, lisez la valeur actuelle *via* l'API navigateur :

```js
function getSnapshot() {
  return navigator.onLine;
}
```

Vous devez ensuite implémenter la fonction `subscribe`.  Il se trouve que lorsque `navigation.onLine` change, le navigateur déclenche l'événement [`online`](https://developer.mozilla.org/docs/Web/API/Window/online_event) ou [`offline`](https://developer.mozilla.org/docs/Web/API/Window/offline_event) sur l'objet `window`. Vous devez abonner l'argument `callback` à ces événements, et renvoyer une fonction qui fait le désabonnement correspondant :

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

À présent React sait comment lire cette valeur depuis l'API extérieure `navigation.onLine`, et comment s'abonner pour être au courant de ses changements.  Déconnectez votre appareil du réseau et remarquez que le composant réagit en se rafraîchissant :
<Sandpack>

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ En ligne' : '❌ Déconnecté'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Extraire la logique dans un Hook personnalisé {/*extracting-the-logic-to-a-custom-hook*/}

En temps normal vous n'appellerez pas `useSyncExternalStore` directement dans vos composants.  Vous l'enroberez généralement plutôt dans votre propre Hook personnalisé.  Ça vous permet d'utiliser la même source de données extérieure depuis plusieurs composants.

Par exemple, ce Hook personnalisé `useOnlineStatus` surveille l'état connecté ou non du réseau :

```js {3,6}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

Grâce à ça, plusieurs composants distincts peuvent utiliser `useOnlineStatus` sans avoir à répéter l'implémentation sous-jacente :

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ En ligne' : '❌ Déconnecté'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progression enregistrée');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Enregistrer la progression' : 'Reconnexion...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Prendre en charge le rendu côté serveur {/*adding-support-for-server-rendering*/}

Si votre appli React utilise le [rendu côté serveur](/reference/react-dom/server), vos composants React seront aussi exécutés hors d'un environnement navigateur pour générer le HTML initial.  Ça complexifie un peu la connexion à la source de données extérieure :

* Si vous vous connectez à une API strictement navigateur, ça ne marchera pas car elle n'existera pas, par définition, côté serveur.
* Si vous vous connectez à une source de données tierce, vous aurez besoin que ses données correspondent côté serveur et côté client.

Pour pouvoir résoudre ces problématiques, passez une fonction `getServerSnapshot` comme troisième argument à `useSyncExternalStore` :

```js {4,12-14}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Toujours dire « En ligne » pour le HTML généré côté serveur
}

function subscribe(callback) {
  // ...
}
```

La fonction `getServerSnapshot` est similaire à `getSnapshot`, mais elle n'est exécutée que dans deux cas :

* Côté serveur pour générer le HTML.
* Côté client lors de [l'hydratation](/reference/react-dom/client/hydrateRoot), c'est-à-dire lorsque React reprend la main sur le HTML renvoyé par le serveur pour le rendre interactif.

Ça vous permet de fournir une valeur initiale de l'instantané que vous pourrez utiliser avant que l'appli devienne interactive.  Si vous n'avez pas de valeur initiale pertinente à fournir lors du rendu côté serveur, omettez cet argument pour [forcer le rendu côté client](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content).

<Note>

Assurez-vous que `getServerSnapshot` renvoie exactement la même valeur lors du rendu client initial et lors du rendu côté serveur.  Par exemple, si `getServerSnapshot` renvoie un contenu prérempli de la source de données côté serveur, vous devez transférer ce contenu au client.  Une façon d'y parvenir consiste à émettre une balise `<script>` pendant le rendu côté serveur qui définit une globale du genre `window.MY_STORE_DATA`, puis de lire cette globale côté client au sein de `getServerSnapshot`. Votre source de donneés extérieure documente probablement comment faire ça.

</Note>

---

## Dépannage {/*troubleshooting*/}

### J'ai une erreur : “The result of `getSnapshot` should be cached” {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

*(« Le résultat de `getSnapshot` devrait être mis en cache », NdT.)*

Cette erreur signifie que la fonction `getSnapshot` renvoie un nouvel objet à chaque fois qu'on l'appelle :

```js {2-5}
function getSnapshot() {
  // 🔴 Ne renvoyez pas un nouvel objet à chaque fois depuis getSnapshot
  return {
    todos: myStore.todos
  };
}
```

React refera le rendu du composant si la valeur renvoyée par `getSnapshot` diffère de celle du dernier appel. C'est pourquoi, si vous renvoyez à chaque fois une nouvelle valeur, vous aboutirez à un cycle infini de rendus et obtiendrez cette erreur.

Votre fonction `getSnapshot` ne devrait renvoyer un objet différent que si quelque chose a vraiment changé.  Si votre source de données contient des données immuables, vous pouvez les renvoyer directement :

```js {2-3}
function getSnapshot() {
  // ✅ Vous pouvez renvoyer directement des données immuables
  return myStore.todos;
}
```

Si les données de votre source sont modifiables, votre fonction `getSnapshot` devrait en renvoyer un instantané immuable.  Ça implique en effet qu'elle *doive* créer de nouveaux objets, mais pas à chaque appel.  Elle devrait plutôt stocker le dernier instantané produit, et renvoyer ce même instantané jusqu'à ce que la donnée à la source ait changé.  Les détails de détection de ce changement varient selon la source exploitée.

---

### Ma fonction `subscribe` est appelée après chaque rendu {/*my-subscribe-function-gets-called-after-every-re-render*/}

La fonction `subscribe` est définie *au sein* du composant, du coup elle diffère à chaque rendu :

```js {2-5}
function ChatIndicator() {
<<<<<<< HEAD
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // 🚩 Toujours une fonction différente, donc React se réabonne à chaque rendu
=======
  // 🚩 Always a different function, so React will resubscribe on every re-render
>>>>>>> 341c312916e1b657262bbe14b134a6f1779fecf1
  function subscribe() {
    // ...
  }
  
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // ...
}
```

React se réabonnera à votre source de données dès que vous passez une fonction `subscribe` différente d'un rendu à l'autre.  Si ça nuit aux performances et que vous souhaitez éviter un réabonnement, sortez la fonction `subscribe` du composant :

```js {1-4}
// ✅ Always the same function, so React won't need to resubscribe
function subscribe() {
  // ...
}

<<<<<<< HEAD
// ✅ Toujours la même fonction, donc React ne se réabonne pas
function subscribe() {
=======
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
>>>>>>> 341c312916e1b657262bbe14b134a6f1779fecf1
  // ...
}
```

Vous pouvez aussi enrober `subscribe` dans un appel à [`useCallback`](/reference/react/useCallback) pour ne vous réabonner que lorsqu'une dépendance change :

```js {2-5}
function ChatIndicator({ userId }) {
<<<<<<< HEAD
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // ✅ Même fonction tant que userId ne change pas
=======
  // ✅ Same function as long as userId doesn't change
>>>>>>> 341c312916e1b657262bbe14b134a6f1779fecf1
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);
  
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // ...
}
```
