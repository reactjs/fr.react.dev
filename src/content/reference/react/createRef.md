---
title: createRef
---

<Pitfall>

`createRef` est principalement utilisée pour les [composants à base de classes](/reference/react/Component). Les fonctions composants utilisent plutôt [`useRef`](/reference/react/useRef).

</Pitfall>

<Intro>

`createRef` crée un objet [ref](/learn/referencing-values-with-refs) qui peut contenir une valeur quelconque.

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `createRef()` {/*createref*/}

Appelez `createRef` pour déclarer une [ref](/learn/referencing-values-with-refs) au sein d'un [composant à base de classe](/reference/react/Component).

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

`createRef` ne prend aucun paramètre.

#### Valeur renvoyée {/*returns*/}

`createRef` renvoie un objet doté d'une unique propriété :

* `current` : elle vaut initialement `null`. Vous pourrez ensuite la modifier. Si vous passez l'objet *ref* à React en tant que prop `ref` d'un nœud JSX, React définira automatiquement sa propriété `current`.

#### Limitations {/*caveats*/}

* `createRef` renvoie toujours un objet *différent*. C'est équivalent à écrire `{ current: null }` vous-même.
* Dans une fonction composant, vous voudrez certainement utiliser plutôt [`useRef`](/reference/react/useRef), qui renverra toujours le même objet.
* `const ref = useRef(null)` est équivalent à `const [ref, _] = useState(() => createRef())`.

---

## Usage {/*usage*/}

### Déclarer une ref dans un composant à base de classe {/*declaring-a-ref-in-a-class-component*/}

Pour déclarer une ref dans un [composant à base de classe](/reference/react/Component), appelez `createRef` et affectez son résultat à un champ d'instance :

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

Si vous passez ensuite `ref={this.inputRef}` à un `<input>` dans votre JSX, React fera automatiquement pointer `this.inputRef.current` sur le nœud DOM du champ. Par exemple, voici comment écrire un bouton qui activera le champ :

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Activer le champ
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`createRef` est principalement utilisée pour les [composants à base de classes](/reference/react/Component). Les fonctions composants utilisent plutôt [`useRef`](/reference/react/useRef).

</Pitfall>

---

## Alternatives {/*alternatives*/}

### Migrer d'une classe avec `createRef` à une fonction avec `useRef` {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

Pour tout nouveau code, nous vous conseillons d'utiliser des fonctions composants plutôt que des [composants à base de classes](/reference/react/Component). Si vous avez des composants existants à base de classes qui utilisent `createRef`, voici comment les convertir. Prenons le code original suivant :

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Activer le champ
        </button>
      </>
    );
  }
}
```

</Sandpack>

Lorsque vous [convertissez ce composant d'une classe vers une fonction](/reference/react/Component#alternatives), remplacez les appels à `createRef` par des appels à [`useRef`](/reference/react/useRef) :

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Activer le champ
      </button>
    </>
  );
}
```

</Sandpack>
