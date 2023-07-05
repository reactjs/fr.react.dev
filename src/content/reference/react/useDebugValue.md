---
title: useDebugValue
---

<Intro>

`useDebugValue` est un Hook React permettant d'ajouter une étiquette visible dans [React DevTools](/learn/react-developer-tools) à un Hook personnalisé.

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

Appelez `useDebugValue` à la racine de votre [hook personnalisé](/learn/reusing-logic-with-custom-hooks) pour afficher une valeur de débogage visible :

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'En ligne' : 'Déconnecté');
  // ...
}
```

[Voir d’autres exemples ci-dessous.](#usage)

#### Paramètres {/*parameters*/}

* `value`: La valeur que vous souhaitez afficher dans React DevTools. Elle peut être de n'importe quel type.
* **optional** `format` : Une fonction de formatage. Lorsque le composant est inspecté, React DevTools appellera la fonction de formatage avec la `valeur` comme argument, puis affichera la valeur formatée renvoyée (qui peut avoir n'importe quel type). Si vous ne spécifiez pas la fonction de formatage, la `value` originale sera affichée.

#### Valeur renvoyée {/*returns*/}

`useDebugValue` ne renvoie aucune valeur.

## Utilisation {/*usage*/}

### Adding a label to a custom Hook {/*adding-a-label-to-a-custom-hook*/}

Call `useDebugValue` at the top level of your [custom Hook](/learn/reusing-logic-with-custom-hooks) to display a readable <CodeStep step={1}>debug value</CodeStep> for [React DevTools.](/learn/react-developer-tools)

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

This gives components calling `useOnlineStatus` a label like `OnlineStatus: "Online"` when you inspect them:

![A screenshot of React DevTools showing the debug value](/images/docs/react-devtools-usedebugvalue.png)

Without the `useDebugValue` call, only the underlying data (in this example, `true`) would be displayed.

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
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

<Note>

Don't add debug values to every custom Hook. It's most valuable for custom Hooks that are part of shared libraries and that have a complex internal data structure that's difficult to inspect.

</Note>

---

### Deferring formatting of a debug value {/*deferring-formatting-of-a-debug-value*/}

You can also pass a formatting function as the second argument to `useDebugValue`:

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

Your formatting function will receive the <CodeStep step={1}>debug value</CodeStep> as a parameter and should return a <CodeStep step={2}>formatted display value</CodeStep>. When your component is inspected, React DevTools will call this function and display its result.

This lets you avoid running potentially expensive formatting logic unless the component is actually inspected. For example, if `date` is a Date value, this avoids calling `toDateString()` on it for every render.
