---
title: forwardRef
---

<Intro>

`forwardRef` permet à votre composant d'exposer un nœud DOM à son composant parent au travers d'une [ref](/learn/manipulating-the-dom-with-refs).


```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

Appelez `forwardRef()` pour que votre composant reçoive une ref qu'il puisse transmette à un de ses composants enfants :

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[Voir dautres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `render` : la fonction de rendu de votre composant. React appellera cette fonction avec les props et la `ref` que votre composant aura reçu de son parent. Cette fonction renvoie, comme d'habitude, le JSX constitutif du composant.

#### Valeur renvoyée {/*returns*/}

`forwardRef` renvoie un composant React qui peut figurer dans un rendu JSX. Contrairement aux composants React définis par des fonctions classiques, un composant renvoyé par `forwardRef` pourra en prime accepter une prop `ref`.

#### Limitations {/*caveats*/}

* En Mode Strict, React **appellera votre fonction composant deux fois** afin de [vous aider à repérer des impuretés accidentelles](/reference/react/useState#my-initializer-or-updater-function-runs-twice).  Ce comportement est limité au développement et n'affecte pas la production.  Une des valeurs renvoyées sera ignorée.  Si votre fonction composant est pure (ce qui devrait être le cas), ça n'affectera en rien son comportement.

---

### La fonction `render` {/*render-function*/}

`forwardRef` accepte une fonction de rendu en argument. React appellera cette fonction avec `props` et `ref` :

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### Paramètres {/*render-parameters*/}

* `props` : les props passées par le composant parent.

* `ref` : la prop `ref` passée par le composant parent. La `ref` peut être un objet ou une fonction. Si le composant parent n'a pas passé de ref, elle sera `null`.  Vous pouvez soit passer la `ref` reçue à un autre composant soit la passer à [`useImperativeHandle`](/reference/react/useImperativeHandle).

#### Valeur renvoyée {/*render-returns*/}

`forwardRef` renvoie un composant React qui peut figurer dans un rendu JSX. Contrairement aux composants React définis par des fonctions classiques, un composant renvoyé par `forwardRef` pourra en prime accepter une prop `ref`.

---

## Utilisation {/*usage*/}

### Exposer un nœud DOM au composant parent {/*exposing-a-dom-node-to-the-parent-component*/}

Par défaut, tous les nœuds DOM de votre composant sont privés.  Ceci dit, il peut parfois être utile d'exposer un nœud DOM à votre parent — par exemple pour en permettre l'activation.  Pour permettre ça, enrobez votre définition de composant avec `forwardRef()` :

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

Vous recevrez une <CodeStep step={1}>ref</CodeStep> comme second argument, juste après les props.  Passez-la au nœud DOM que vous souhaitez exposer :

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

Ça permet au composant parent `Form` d'accéder au <CodeStep step={2}>nœud DOM `<input>`</CodeStep> exposé par `MyInput` :

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Saisissez votre nom :" ref={ref} />
      <button type="button" onClick={handleClick}>
        Modifier
      </button>
    </form>
  );
}
```

Le composant `Form` [passe une ref](/reference/react/useRef#manipulating-the-dom-with-a-ref) à `MyInput`. Le composant `MyInput` *transmet* cette ref à la balise native `<input>`. Résultat, le composant `Form` peut accéder au nœud DOM `<input>` et appeler sa méthode [`focus()`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/focus).

Gardez à l'esprit qu'exposer une ref vers un nœud DOM au sein de votre composant peut vous embêter plus tard si vous souhaitez refondre la structure interne de celui-ci.  Classiquement, vous exposerez des nœuds DOM depuis des composants réutilisables de bas niveau tels que des boutons ou des champs de saisie, mais vous éviterez de le faire pour des composants applicatifs comme un avatar ou un bloc de commentaire.

<Recipes titleText="Exemples de transmission de ref">

#### Activer un champ de saisie {/*focusing-a-text-input*/}

Un clic sur le bouton activera le champ de saisie. Le composant `Form` définit une ref qu'il passe au composant `MyInput`. Ce composant `MyInput` transmet la ref au `<input>` du navigateur.  Ça permet au composant `Form` d'activer le `<input>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Saisissez votre nom :" ref={ref} />
      <button type="button" onClick={handleClick}>
        Modifier
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### Lire et mettre en pause une vidéo {/*playing-and-pausing-a-video*/}

Ici un clic sur le bouton appellera les méthodes [`play()`](https://developer.mozilla.org/fr/docs/Web/API/HTMLMediaElement/play) et [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) d'un nœud DOM `<video>`. Le composant `App` définit une ref qu'il passe au composant `MyVideoPlayer`.  Ce composant `MyVideoPlayer` transmet cette ref au nœud `<video>` du navigateur. Ça permet au composant `App` de lire et mettre en pause la `<video>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Lecture
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js src/MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Transmettre une ref à travers plusieurs composants {/*forwarding-a-ref-through-multiple-components*/}

Au lieu de transmettre la `ref` à un nœud DOM, vous avez parfois besoin de la transmettre à votre propre composant, comme `MyInput` :

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

Si ce composant `MyInput` transmet une ref à son `<input>`,  une ref à `FormField` vous donnera ce `<input>` :

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Saisissez votre nom :" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Modifier
      </button>
    </form>
  );
}
```

Le composant `Form` définit une ref et la passer au `FormField `.  Le composant `FormField` transmet cette ref au `MyInput`, qui la transmet au nœud DOM `<input>`.  C'est ainsi que `Form` accède à ce nœud DOM.


<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Saisissez votre nom :" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Modifier
      </button>
    </form>
  );
}
```

```js src/FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      {(isRequired && value === '') &&
        <i>Requis</i>
      }
    </>
  );
});

export default FormField;
```


```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### Exposer un point d'accès impératif plutôt qu'un nœud DOM {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

Au lieu d'exposer l'intégralité du nœud DOM, vous pouvez exposer un objet personnalisé qu'on appelle *point d'accès impératif*, doté d'un jeu plus restreint de méthodes.  Pour cela, vous devez définir une ref séparée pour référencer le nœud DOM :

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

Passez la `ref` que vous avez reçue à [`useImperativeHandle`](/reference/react/useImperativeHandle) et spécifiez la valeur que vous souhaitez exposer en tant que `ref` :

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

Si un composant récupère la ref de `MyInput`, il ne recevra que votre objet `{ focus, scrollIntoView }` au lieu du nœud DOM. Ça vous permet de limiter au minimum les parties du nœud DOM que vous exposez.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // Ça ne marchera pas parce que le nœud DOM
    // n'est pas exposé :
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Saisissez votre nom :" ref={ref} />
      <button type="button" onClick={handleClick}>
        Modifier
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[En savoir plus sur les points d'accès impératifs](/reference/react/useImperativeHandle).

<Pitfall>


**N'abusez pas des refs.**  Vous ne devriez utiliser des refs que pour des comportements *impératifs* qui ne peuvent pas être exprimés par des props : faire défiler jusqu'à un nœud, activer un nœud, déclencher une animation, sélectionner un texte, et ainsi de suite.

**Si vous pouvez exprimer quelque chose sous forme de prop, n'utilisez pas une ref.**  Par exemple, plutôt que d'exposer un objet impératif du genre `{ open, close }` depuis un composant `Modal`, préférez proposer une prop `isOpen` pour une utilisation du style `<Modal isOpen={isOpen} />`. [Les Effets](/learn/synchronizing-with-effects) peuvent vous aider à exposer des comportements impératifs au travers de props.

</Pitfall>

---

## Dépannage {/*troubleshooting*/}

### Mon composant est enrobé par `forwardRef`, mais la `ref` que je reçois est toujours `null` {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

Ça signifie généralement que vous avez oublié d'utiliser effectivement la ref que vous avez reçue.

Par exemple, ce composant ne fait rien avec sa `ref` :

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

Pour corriger ça, transmettez la `ref` au nœud DOM ou à un autre composant qui peut acccepter une ref :

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

La `ref` à `MyInput` pourrait aussi être `null` si une partie de la logique était conditionnelle :

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

Si `showInput` est `false`, alors la ref ne sera transmise à aucun nœud, et la ref à `MyInput` restera vide. C'est particulièrement difficile à repérer si la condition est enfouie dans un autre composant, comme `Panel` dans l'exemple ci-après :

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```
