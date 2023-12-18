---
title: useDebugValue
---

<Intro>

`useDebugValue` est un Hook React qui vous permet d'ajouter une étiquette visible dans [les outils de développement React](/learn/react-developer-tools) à un Hook personnalisé.

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

Appelez `useDebugValue` à la racine de votre [Hook personnalisé](/learn/reusing-logic-with-custom-hooks) pour afficher une valeur de débogage lisible :

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'En ligne' : 'Déconnecté');
  // ...
}
```

[Voir d’autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `value` : la valeur que vous souhaitez afficher dans les outils de développement React. Elle peut être de n'importe quel type.
* `format` **optionnel** : une fonction de formatage. Lorsque le composant est inspecté, les outils de développement React appelleront la fonction de formatage avec `value` comme argument, puis afficheront la valeur formatée renvoyée (qui peut avoir n'importe quel type). Si vous ne spécifiez pas la fonction de formatage, la `value` originale sera affichée.

#### Valeur renvoyée {/*returns*/}

`useDebugValue` ne renvoie aucune valeur.

## Utilisation {/*usage*/}

### Ajouter un libellé à un Hook personnalisé {/*adding-a-label-to-a-custom-hook*/}

Appelez `useDebugValue` à la racine de votre [Hook personnalisé](/learn/reusing-logic-with-custom-hooks) pour afficher une <CodeStep step={1}>valeur de débogage</CodeStep> dans [les outils de développement React](/learn/react-developer-tools).

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

Ça donne aux composants qui appellent `useOnlineStatus` une étiquette du genre `OnlineStatus: "En ligne"` lorsque vous les inspectez :

![Une capture d'écran des outils de développement React montrant la valeur de débogage](/images/docs/react-devtools-usedebugvalue.png)

Sans l'appel de `useDebugValue`, seule la donnée sous-jacente (dans cet exemple, `true`) serait affichée.

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ En ligne' : '❌ Déconnecté'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'En ligne' : 'Déconnecté');
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

N'ajoutez pas de valeurs de débogage à chaque Hook personnalisé. Cette méthode est surtout utile pour les Hooks personnalisés qui font partie de bibliothèques partagées et qui ont une structure de données interne complexe et difficile à inspecter.

</Note>

---

### Différer le formatage d'une valeur de débogage {/*deferring-formatting-of-a-debug-value*/}

Vous pouvez transmettre une fonction de formatage comme deuxième argument à `useDebugValue` :

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

Votre fonction de formatage recevra la <CodeStep step={1}>valeur de débogage</CodeStep> comme argument et devra renvoyer une <CodeStep step={2}>valeur formatée pour l'affichage</CodeStep>. Lorsque votre composant sera inspecté, les outils de développement React appelleront cette fonction et afficheront son résultat.

Ça vous permet d'éviter d'exécuter une logique de formatage potentiellement coûteuse tant que le composant n'est pas réellement inspecté. Par exemple, si `date` est une valeur de type Date, ça évite d'appeler `toDateString()` à chaque rendu.
