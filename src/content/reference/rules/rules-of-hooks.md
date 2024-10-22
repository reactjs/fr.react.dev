---
title: Les règles des Hooks
---

<Intro>

Les Hooks sont définis au moyen de fonctions JavaScript, mais représentent un type particulier de logique d'UI réutilisables, avec des restrictions sur leurs emplacements possibles d'appel.

</Intro>

<InlineToc />

---

## N'appelez des Hooks qu'au niveau racine {/*only-call-hooks-at-the-top-level*/}

Les fonctions dont le nom commence par `use` sont appelées [*Hooks*](/reference/react) en React.

**N'appelez pas de Hooks au sein de boucles, conditions, fonctions imbriquées ou blocks `try`/`catch`/`finally` .** Utilisez plutôt les Hooks systématiquement au niveau racine de votre fonction React, avant tout retour anticipé éventuel *(early return, NdT)*. Vous ne pouvez appelez des Hooks que pendant que React fait le rendu d'une fonction composant :

* ✅ Appelez-les à la racine du corps d'une [fonction composant](/learn/your-first-component).
* ✅ Appelez-les à la racine du corps d'un [Hook personnalisé](/learn/reusing-logic-with-custom-hooks).

```js{2-3,8-9}
function Counter() {
  // ✅ Correct : niveau racine d’une fonction composant
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Correct : niveau racine d’un Hook personnalisé
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

React **ne permet pas** l'appels de Hooks (les fonctions dont le nom commence par `use`) dans d'autres situations, par exemple :

* 🔴 N'appelez pas de Hooks au sein de conditions ou de boucles.
* 🔴 N'appelez pas de Hooks après une instruction `return` conditionnelle.
* 🔴 N'appelez pas de Hooks au sein de gestionnaires d'événements.
* 🔴 N'appelez pas de Hooks dans des composants à base de classes.
* 🔴 N'appelez pas de Hooks au sein de fonctions passées à `useMemo`, `useReducer` ou `useEffect`.
* 🔴 N'appelez pas de Hooks au sein de blocs `try`/`catch`/`finally`.

Si vous enfreignez ces règles, vous verrez peut-être une erreur.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Incorrect : au sein d’une condition (pour corriger ça, sortez-en-le !)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Incorrect : au sein d’une boucle (pour corriger ça, sortez-en-le !)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Incorrect : après un retour anticipé conditionnel (déplacez-le avant le return !)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Incorrect : au sein d’un gestionnaire d’événements (pour corriger ça, sortez-en-le !)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Incorrect : au sein d’un useMemo (pour corriger ça, sortez-en-le !)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Incorrect : au sein d’un composant à base de classe (utilisez plutôt une fonction composant !)
    useEffect(() => {})
    // ...
  }
}

function Bad() {
  try {
    // 🔴 Incorrect : au sein d’un bloc try/catch/finally block (pour corriger ça, sortez-en-le !)
    const [x, setX] = useState(0);
  } catch {
    const [x, setX] = useState(1);
  }
}
```

Vous pouvez utiliser le [plugin `eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) pour repérer ces erreurs.

<Note>

[Les Hooks personnalisés](/learn/reusing-logic-with-custom-hooks) *peuvent* appeler d'autres Hooks (c'est même leur raison d'être). Ça fonctionne parce que les Hooks personnalisés sont eux aussi censés n'être appelés que pendant la phase de rendu d'une fonction composant.

</Note>

---

## N'appelez des Hooks que depuis des fonctions React {/*only-call-hooks-from-react-functions*/}

N'appelez pas de Hooks depuis des fonctions JavaScript classiques.  Vous devriez plutôt :

✅ Appeler des Hooks depuis des fonctions composants React.
✅ Appeler des Hooks depuis des [Hooks personnalisés](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component).

En suivant cette règle, vous garantissez que toute la logique à état d'un composant est clairement visible dans son code source.

```js {2,5}
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅
}

function setOnlineStatus() { // ❌ Ni un composant ni un Hook personnalisé !
  const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}
```
