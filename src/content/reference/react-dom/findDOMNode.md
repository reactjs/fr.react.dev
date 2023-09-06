---
title: findDOMNode
---

<Deprecated>

Cette API sera retirée dans une future version majeure de React. [Voir les solutions alternatives](#alternatives).

</Deprecated>

<Intro>

`findDOMNode` trouve le nœud du navigateur pour une instance React à [composant à base de classe](/reference/react/Component).

```js
const domNode = findDOMNode(componentInstance)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `findDOMNode(componentInstance)` {/*finddomnode*/}

Appeler `findDOMNode` pour trouver le nœud du navigateur pour une instance React à [composant à base de classe](/reference/react/Component) donnée.

```js
import { findDOMNode } from 'react-dom';

const domNode = findDOMNode(componentInstance);
```

[Voir les exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `componentInstance` : Une instance de la sous-classe du [`Component`](/reference/react/Component). Par exemple `this` dans un composant à base de classe.


#### Valeur renvoyée {/*returns*/}

`findDOMNode` renvoie le plus proche nœud du DOM du navigateur dans une `componentInstance` donnée. Lorsqu'un composant fait le rendu à `null`, fait le rendu à `false`, `findDOMNode` renvoie `null`. Lorsqu'un composant fait le rendu d'une string, `findDOMNode` renvoie un nœud DOM sous forme de texte contenant cette valeur.

#### Limitations {/*caveats*/}

* Un composant peut renvoyer un tableau ou un [Fragment](/reference/react/Fragment) avec plusieurs enfants. Dans ce cas `findDOMNode`, renverra le nœud du DOM correspondant au premier enfant non-vide.

* `findDOMNode` fonctionne seulement sur les composants montés (c'est-à-dire, les composants qui ont été placés dans le DOM). Si vous essayez d'appeler `this` sur un composant qui n'a pas encore été monté (comme l'appel de `findDOMNode()` dans `render()` sur un composant qui doit être crée), une exception sera levée.

* `findDOMNode` renvoie seulement le résultat au moment de votre appel. Si un composant enfant fait plutard le rendu d'un nœud différent, vous n'avez aucun moyen d'être informé de ce changement.

* `findDOMNode` accepte une instance de composant à base de classe, il ne peut être utilisé avec les fonctions composants.

---

## Utilisation {/*usage*/}

### Trouver le nœud racine du DOM d'un composant à base de classe {/*finding-the-root-dom-node-of-a-class-component*/}


Appeler `findDOMNode` avec une instance de [composant à base de classe](/reference/react/Component)  (généralement, `this`) pour trouver le nœud du DOM qu'il a affiché.

```js {3}
class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Bonjour" />
  }
}
```

Ici, la variable de `input` sera défini sur l'élément DOM `<input>`. Cela vous permet de faire quelque chose avec. Par exemple, en cliquant « voir l'exemple » ci-dessous, le champ de saisi est monté, [`input.select()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select) sélectionne tout le text dans le champ :

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Voir l'exemple
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Bonjour" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

---

## Alternatives {/*alternatives*/}

### Lecture du nœud DOM à partir d'une ref {/*reading-components-own-dom-node-from-a-ref*/}

Le code qui utilise `findDOMNode` est fragile parce que la connection entre le nœud JSX et le code manipulant le nœud du DOM correspondant n'est pas explicite. Par exemple, essayez d'enrober ce `<input />` dans un `<div>` :

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Voir l'exemple
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <input defaultValue="Bonjour" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

Le code sera interrompu maintenant, `findDOMNode(this)` trouve le nœud `<div>` du DOM, mais le code attend un nœud DOM `<input>`. Pour éviter ce genre de problèmes, utilisez [`createRef`](/reference/react/createRef) pour gérer un nœud DOM spécifique.

Dans cet exemple, `findDOMNode` n'est plus utilisé. Par contre, `inputRef = createRef(null)` est défini comme champ d'instance de la classe. Pour lire le nœud du DOM à partir de celui-ci, vous pouvez utiliser `this.inputRef.current`. Pour le rattacher au JSX, vous faites le rendu `<input ref={this.inputRef} />`. Cela connecte le code utilisant le nœud DOM à son JSX :

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Afficher l'exemple
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { createRef, Component } from 'react';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <input ref={this.inputRef} defaultValue="Bonjour" />
    );
  }
}

export default AutoselectingInput;
```

</Sandpack>

Dans les versions modernes de React sans les composants à base de classe, le code équivalent appelerait [`useRef`](/reference/react/useRef) à la place :

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Voir l'exemple
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { useRef, useEffect } from 'react';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <input ref={inputRef} defaultValue="Bonjour" />
}
```

</Sandpack>

[En savoir plus sur la manipulation du DOM avec les refs](/learn/manipulating-the-dom-with-refs).

---

### Lecture d'un nœud DOM d'un composant enfant à partir d'un ref transmis {/*reading-a-child-components-dom-node-from-a-forwarded-ref*/}

Dans cet exemple, `findDOMNode(this)` trouve un nœud DOM qui appartient à un autre composant. Le composant `AutoselectingInput` fait le rendu de `MyInput`, qui est votre propre composant qui affiche un navigateur `<input>`.

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Voir l'exemple
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <MyInput />;
  }
}

export default AutoselectingInput;
```

```js MyInput.js
export default function MyInput() {
  return <input defaultValue="Bonjour" />;
}
```

</Sandpack>

Notez que l'appel de `findDOMNode(this)` à l'intérieur de `AutoselectingInput` vous donne toujours le DOM `<input>` - même si le JSX de ce `<input>` est masqué à l'intérieur du composant `MyInput`. Cela semble pratique dans l'exemple ci-dessus, mais il conduit à un code fragile. Imaginez que vous voulez modifier `MyInput` plutard et l'enrober autour d'un `<div>`. Cela ne respectera pas le code de `AutoselectingInput` (qui attend de trouver un `<input>`).

Pour remplacer `findDOMNode` dans cet exemple, les deux composants doivent être coordonnés :

1. `AutoSelectingInput` doit déclarer un ref, comme dans [l'exemple précédent](#reading-components-own-dom-node-from-a-ref), et le founir à `<MyInput>`.
2. `MyInput` doit être déclaré avec [`forwardRef`](/reference/react/forwardRef) pour prendre ce ref et le transmettre au nœud `<input>`.

C'est ce que fait cette version, qui n'a donc plus besoin de `findDOMNode` :

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Afficher l'exemple
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { createRef, Component } from 'react';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <MyInput ref={this.inputRef} />
    );
  }
}

export default AutoselectingInput;
```

```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Bonjour" />;
});

export default MyInput;
```

</Sandpack>

Voici à quoi ressemblerait ce code avec les fonctions composants au lieu de classes :

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Afficher l'exemple
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { useRef, useEffect } from 'react';
import MyInput from './MyInput.js';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <MyInput ref={inputRef} defaultValue="Bonjour" />
}
```

```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Bonjour" />;
});

export default MyInput;
```

</Sandpack>

---

### Ajout d'un élement `<div>` enrobant {/*adding-a-wrapper-div-element*/}

Souvent un composant a besoin de connaître la position et la taille de ses enfants. Il est donc tentant de trouver l'enfant avec `findDOMNode(this)`, et utiliser la méthode du DOM comme [`getBoundingClientRect`](https://developer.mozilla.org/fr/docs/Web/API/Element/getBoundingClientRect) pour des mesures.

Il n'existe actuellement aucun équivalent direct pour ce cas d'utilisation, c'est pourquoi `findDOMNode` est déprécié mais n'a pas encore été retiré complètement de React. En attendant, vous pouvez essayez d'afficher un nœud `<div>` enrobant le contenu comme solution de contournement, et d'obtenir un ref à ce nœud. Cependant, les enveloppes supplémentaires peuvent nuire à la stylisation.

```js
<div ref={someRef}>
  {children}
</div>
```

Cela s'applique également à la focalisation et au défilement vers des enfants arbitraires.
