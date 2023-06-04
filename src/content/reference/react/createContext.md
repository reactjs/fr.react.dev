---
title: createContext
---

<Intro>

`createContext` vous permet de créer un [contexte](/learn/passing-data-deeply-with-context) que des composants peuvent fournir ou lire.


```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

Appelez `createContext` en dehors de tout composant afin de créer un contexte.

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `defaultValue` : la valeur utilisée lorsqu'il n'y a pas de contexte adapté fourni au-dessus du composant qui lit ce contexte. Si vous n'avez pas de valeur par défaut appropriée, indiquez `null`. La valeur par défaut est vue comme un « dernier recours ». Elle est statique et ne change jamais au fil du temps.

#### Valeur renvoyée {/*returns*/}

`createContext` renvoie un objet représentant le contexte.

**L'objet contexte lui-même ne contient aucune information.** Il représente _quel_ contexte les autres composants lisent ou fournissent. Vous utiliserez habituellement [`SomeContext.Provider`](#provider) dans les composants au-dessus afin de spécifier la valeur du contexte, et vous appellerez [`useContext(SomeContext)`](/reference/react/useContext) dans les composants en-dessous afin de lire cette valeur. L'objet contexte a quelques propriétés :

* `SomeContext.Provider` vous permet de fournir la valeur du contexte aux composants enfants.
* `SomeContext.Consumer` est une façon alternative rarement utilisée de lire la valeur du contexte.

---

### `SomeContext.Provider` {/*provider*/}

Enveloppez vos composants dans un fournisseur de contexte afin de définir la valeur de ce contexte pour tous les composants enveloppés :

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

* `value`: la valeur que vous souhaitez passer à tous les composants lisant ce contexte à l'intérieur de ce fournisseur, à quelque profondeur que ce soit. La valeur du contexte peut être de n'importe quel type. Un composant appelant [`useContext(SomeContext)`](/reference/react/useContext) à l'intérieur d'un fournisseur de contexte reçoit la `value` du fournisseur correspondant le plus proche en amont.
---

### `SomeContext.Consumer` {/*consumer*/}

Avant l'arrivée de `useContext`, il existait une ancienne façon de lire un contexte :


```js
function Button() {
  // 🟡 Ancienne méthode (déconseillée)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```
Bien que cette ancienne méthode fonctionne toujours, **privilégiez la lecture d'un contexte à l'aide de [`useContext()`](/reference/react/useContext) dans du nouveau code :**
```js
function Button() {
  // ✅ Méthode recommandée
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### Props {/*consumer-props*/}

* `children` : une fonction. React appellera cette fonction avec la valeur du contexte actuel, déterminée par le même algorithme que pour `useContext()`, puis affichera le résultat renvoyé par cette fonction. De plus, chaque fois que le contexte des composants parents changera, React réexécutera cette fonction et mettra à jour l'interface utilisateur en conséquence.

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

`createContext` renvoie un <CodeStep step={1}>objet contexte</CodeStep>. Les composants peuvent lire le contexte en le passant à [`useContext()`](/reference/react/useContext) :


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


Par défaut, les valeurs reçues seront les <CodeStep step={3}>valeurs par défaut</CodeStep> que vous avez spécifiées lors de la création des contextes. Cependant, ça n'est pas très utile en soi car les valeurs par défaut ne changent jamais.

L'utilité du contexte réside dans la possibilité de **fournir des valeurs dynamiques supplémentaires à partir de vos composants** :


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

Désormais, le composant `Page`, ainsi que tous les composants imbriqués, quel que soit leur niveau de profondeur, auront accès aux valeurs de contexte transmises. Si ces valeurs de contexte changent, React réexécutera les composants qui les lisent.

[Apprenez-en davantage sur la fourniture et la lecture de contexte au travers d'exemples concrets](/reference/react/useContext).

---

### Importer et exporter un contexte depuis un fichier {/*importing-and-exporting-context-from-a-file*/}

Des composants auront souvent besoin d'accéder au même contexte depuis de multiples fichiers. C'est pourquoi il est courant de déclarer les contextes dans un fichier séparé. Vous pouvez alors utiliser [l'instruction `export`](https://developer.mozilla.org/fr/docs/web/javascript/reference/statements/export) pour rendre le contexte accessible par d'autres fichiers :


```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

Les composants déclarés dans d'autres fichiers peuvent alors utiliser l'instruction [`import`](https://developer.mozilla.org/fr/docs/web/javascript/reference/statements/import) pour lire ou fournir ce contexte :

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

Ça fonctionne de la même manière que [l'importation et l'exportation de composants](/learn/importing-and-exporting-components).

---

## Dépannage {/*troubleshooting*/}

### Je ne parviens pas à modifier la valeur du contexte {/*i-cant-find-a-way-to-change-the-context-value*/}

Un code comme celui-ci spécifie la *valeur par défaut* du contexte :

```js
const ThemeContext = createContext('light');
```

Cette valeur ne change jamais. React utilise cette valeur uniquement comme une valeur de secours si aucun fournisseur correspondant n'est trouvé au-dessus du composant lecteur.

Pour mettre à jour le contexte au fil du temps, [intégrez un état local et enveloppez vos composants avec un fournisseur de contexte](/reference/react/useContext#updating-data-passed-via-context).
