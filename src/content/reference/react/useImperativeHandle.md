---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle` est un Hook React qui vous permet de personnaliser la référence exposée comme [ref](/learn/manipulating-the-dom-with-refs).

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

Appelez `useImperativeHandle` au niveau racine de votre composant pour personnaliser la ref qu'il expose :

```js
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... vos méthodes ...
    };
  }, []);
  // ...
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

<<<<<<< HEAD
* `ref` : la `ref` que vous avez reçue comme second argument depuis la [fonction de rendu de `forwardRef`](/reference/react/forwardRef#render-function).
=======
* `ref`: The `ref` you received as a prop to the `MyInput` component.
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669

* `createHandle` : une fonction ne prenant aucun argument, qui renvoie la ref que vous souhaitez effectivement exposer.  Cette ref peut être de n'importe quel type.  En général, vous renverrez un objet avec les méthodes que vous souhaitez exposer.

* `dependencies` **optionnelles** : la liste des valeurs réactives référencées par le code de `createHandle`.  Les valeurs réactives comprennent les props, les variables d'état et toutes les variables et fonctions déclarées localement dans le corps de votre composant.  Si votre *linter* est [configuré pour React](/learn/editor-setup#linting), il vérifiera que chaque valeur réactive concernée est bien spécifiée comme dépendance.  La liste des dépendances doit avoir un nombre constant d'éléments et utiliser un littéral défini à la volée, du genre `[dep1, dep2, dep3]`. React comparera chaque dépendance à sa valeur précédente au moyen de la comparaison [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Si un nouveau rendu résulte d'une modification à une dépendance, ou si vous avez omis cet argument, la fonction `createHandle` sera réexécutée et la référence fraîchement créée sera affectée à la ref.

<<<<<<< HEAD
#### Valeur renvoyée {/*returns*/}
=======
<Note>

Starting with React 19, [`ref` is available as a prop.](/blog/2024/12/05/react-19#ref-as-a-prop) In React 18 and earlier, it was necessary to get the `ref` from [`forwardRef`.](/reference/react/forwardRef) 

</Note>

#### Returns {/*returns*/}
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669

`useImperativeHandle` renvoie `undefined`.

---

## Utilisation {/*usage*/}

### Fournir une référence personnalisée au composant parent {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

<<<<<<< HEAD
Par défaut, les composants n'exposent pas leurs nœuds DOM aux composants parents. Par exemple, si vous souhaitez que le composant parent de `MyInput` [ait accès](/learn/manipulating-the-dom-with-refs) au nœud DOM `<input>`, vous devez le permettre explicitement avec [`forwardRef`](/reference/react/forwardRef) :
=======
To expose a DOM node to the parent element, pass in the `ref` prop to the node.
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669

```js {2}
function MyInput({ ref }) {
  return <input ref={ref} />;
};
```

<<<<<<< HEAD
Dans le code ci-avant, [une ref à `MyInput` recevra le nœud DOM `<input>`](/reference/react/forwardRef#exposing-a-dom-node-to-the-parent-component).  Cependant, vous pouvez plutôt exposer une valeur personnalisée. Pour définir vous-même la référence à exposer, appelez `useImperativeHandle` au niveau racine de votre composant :
=======
With the code above, [a ref to `MyInput` will receive the `<input>` DOM node.](/learn/manipulating-the-dom-with-refs) However, you can expose a custom value instead. To customize the exposed handle, call `useImperativeHandle` at the top level of your component:
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669

```js {4-8}
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... vos méthodes ...
    };
  }, []);

  return <input />;
};
```

<<<<<<< HEAD
Remarquez que dans le code ci-avant, la `ref` n'est plus transmise au `<input>`.
=======
Note that in the code above, the `ref` is no longer passed to the `<input>`.
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669

Supposons par exemple que vous ne souhaitiez pas exposer l'intégralité du nœud DOM `<input>`, mais seulement deux de ses méthodes : `focus` et `scrollIntoView`. Pour y parvenir, conservez le véritable nœud DOM dans une ref distincte, puis utilisez `useImperativeHandle` pour exposer un objet avec seulement les méthodes que vous souhaitez permettre au composant parent d'appeler :

```js {7-14}
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
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

  return <input ref={inputRef} />;
};
```

Désormais, si le composant parent récupère une ref sur `MyInput`, il ne pourra plus appeler que ses méthodes `focus` et `scrollIntoView`.  Il n'aura pas un accès complet au nœud DOM `<input>` sous-jacent.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // Ça ne marcherait pas, car le nœud DOM n'est pas exposé :
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
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref, ...props }) {
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
};

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

---

### Exposer vos propres méthodes impératives {/*exposing-your-own-imperative-methods*/}

Les méthodes que vous exposez *via* un objet impératif n'ont pas l'obligation de correspondre à des méthodes du DOM. Par exemple, ce composant `Post` expose une méthode `scrollAndFocusAddComment` *via* un objet impératif.  Elle permet au `Page` parent de faire défiler la liste des commentaires *et* d'activer le champ de saisie lorsque vous cliquez sur le bouton :

<Sandpack>

```js
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Rédiger un commentaire
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

```js src/Post.js
import { useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

function Post({ ref }) {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Bienvenue sur mon blog !</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
};

export default Post;
```


```js src/CommentList.js
import { useRef, useImperativeHandle } from 'react';

function CommentList({ ref }) {
  const divRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comment #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
}

export default CommentList;
```

```js src/AddComment.js
import { useRef, useImperativeHandle } from 'react';

<<<<<<< HEAD
const AddComment = forwardRef(function AddComment(props, ref) {
  return <input placeholder="Ajouter un commentaire..." ref={ref} />;
});
=======
function AddComment({ ref }) {
  return <input placeholder="Add comment..." ref={ref} />;
}
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669

export default AddComment;
```

```css
.CommentList {
  height: 100px;
  overflow: scroll;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 20px;
}
```

</Sandpack>

<Pitfall>

**N'abusez pas des refs.**  Vous ne devriez utiliser des refs que pour des comportements *impératifs* qui ne peuvent pas être exprimés par des props : faire défiler jusqu'à un nœud, activer un nœud, déclencher une animation, sélectionner un texte, et ainsi de suite.

**Si vous pouvez exprimer quelque chose sous forme de prop, n'utilisez pas une ref.**  Par exemple, plutôt que d'exposer un objet impératif du genre `{ open, close }` depuis un composant `Modal`, préférez proposer une prop `isOpen` pour une utilisation du style `<Modal isOpen={isOpen} />`. [Les Effets](/learn/synchronizing-with-effects) peuvent vous aider à exposer des comportements impératifs au travers de props.

</Pitfall>
