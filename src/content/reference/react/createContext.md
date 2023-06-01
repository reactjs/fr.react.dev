---
title: createContext
---

<Intro>

`createContext` vous permet de créer un [contexte](/learn/passing-data-deeply-with-context) que les composants peuvent partager ou lire.


```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

Utilisez `createContext` en dehors de tout composant afin de créer un contexte.

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[Voir d'autres exemples ci-dessous.](#usage)

#### Paramètres {/*parameters*/}

* `defaultValue` : Ce sera la valeur uniquement utilisé lorsqu'il n'y a pas de contexte correspondant au-dessus du composant qui lit le contexte. Si vous n'avez pas de valeur par défaut, spécifiez `null`. La valeur par défaut est un "dernier recours". Elle est statique et ne change jamais au fil du temps.

#### Retours {/*returns*/}

`createContext` retourne un objet représentant le context.

**L'objet contexte lui-même ne contient aucune information.** Il représente _le_ contexte que les autres composants lisent ou partagent. Typiquement, vous utiliserez [`SomeContext.Provider`](#provider) dans les composants au-dessus afin de spécifier la valeur du contexte, et vous appellerez [`useContext(SomeContext)`](/reference/react/useContext) dans les composants en-dessous afin de lire la valeur du contexte. L'objet contexte a quelques propriétés :

* `SomeContext.Provider` vous permet de fournir la valeur du contexte aux composants enfants.
* `SomeContext.Consumer` est une alternative et une manière rarement utilisée afin de lire la valeur d'un contexte.

---

### `SomeContext.Provider` {/*provider*/}

Enveloppez vos composants dans un Provider afin de répartir sa valeur pour tous les composants à l'intérieur :

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

#### Props {/*provider-props*/}

* `value`: La valeur que vous souhaitez passer à tous les composants lisant ce contexte à l'intérieur d'un Provider, peu importe la profondeur. La valeur du contexte peut être de n'importe quel type. Un composant appelant [`useContext(SomeContext)`](/reference/react/useContext) à l'intérieur d'un Provider reçoit la `value` du Provider correspondant le plus proche qui l'englobe.
---

### `SomeContext.Consumer` {/*consumer*/}

Avant l'existence de `useContext`, il existait une ancienne méthode pour lire un contexte :


```js
function Button() {
  // 🟡 Ancienne méthode (non recommandée)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```
Bien que cette ancienne méthode fonctionne toujours, **privilégiez la lecture d'un contexte à l'aide de [`useContext()`](/reference/react/useContext) dans du nouveau code :**
```js
function Button() {
  // ✅ Méthode recommandée
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### Props {/*consumer-props*/}

* `children`: Une fonction. React appelle cette fonction avec la valeur du contexte actuel, déterminée par le même algorithme que `useContext()`, puis affiche le résultat retourné par cette fonction. De plus, chaque fois que le contexte des composants parents change, React réexécute cette fonction et met à jour l'interface utilisateur en conséquence.

---

## Utilisation {/*usage*/}

### Création d'un contexte {/*creating-context*/}

Le contexte permet aux composants de [transmettre des informations en profondeur](/learn/passing-data-deeply-with-context) sans avoir à passer explicitement des props.


Pour créer un ou plusieurs contextes, il suffit d'appeler `createContext` en dehors de tout composant.


```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` renvoie un <CodeStep step={1}>objet contexte</CodeStep>. Les composants peuvent lire le contexte en le passant à [`useContext()`](/reference/react/useContext) :


```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```


Par défaut, les valeurs reçues seront les <CodeStep step={3}>valeurs par défaut</CodeStep> que vous avez spécifiées lors de la création des contextes. Cependant, ça n'est pas utile car les valeurs par défaut ne changent jamais.

Le contexte est utile car vous avez la possibilité de **fournir des valeurs dynamiques supplémentaires à partir de vos composants :**


```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

Now the `Page` component and any components inside it, no matter how deep, will "see" the passed context values. If the passed context values change, React will re-render the components reading the context as well.

Maintenant, le composant `Page`, ainsi que tous les composants imbriqués, quel que soit leur niveau de profondeur, auront accès aux valeurs de contexte transmises. Si ces valeurs de contexte changent, React réexécutera les composants qui les lisent.

[Approfondissez vos connaissances sur la consommation et la création de contexte au travers d'exemples concrets.](/reference/react/useContext)

---

### Importation et exportation du contexte à partir d'un fichier {/*importing-and-exporting-context-from-a-file*/}

Parfois, il est nécessaire que des composants présents dans différents fichiers puissent accéder au même contexte. C'est pourquoi il est courant de déclarer les contextes dans un fichier séparé. Ensuite, vous pouvez utiliser [l'instruction  `export`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) pour rendre le contexte disponible aux autres fichiers :


```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

Components declared in other files can then use the [`import`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) statement to read or provide this context:
Ensuite, les composants déclarés dans d'autres fichiers peuvent utiliser l'instruction [`import`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) pour lire ou partager ce contexte :

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

Ça fonctionne de la même manière que [l'importation et l'exportation de composants.](/learn/importing-and-exporting-components)

---

## Dépannage {/*troubleshooting*/}

### Je ne trouve pas de moyen de modifier la valeur du contexte {/*i-cant-find-a-way-to-change-the-context-value*/}

Un code comme celui-ci spécifie la *valeur par défaut* du contexte :

```js
const ThemeContext = createContext('light');
```

Cette valeur ne change jamais. React utilise cette valeur uniquement comme une valeur de secours si aucun Provider correspondant n'est trouvé au-dessus.

Pour mettre à jour le contexte au fil du temps, [intégrez un état et entourez vos composants avec un Provider.](/reference/react/useContext#updating-data-passed-via-context)


