---
title: "<textarea>"
---

<Intro>

Le  [composant natif du navigateur `<textarea>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea) vous permet de faire le rendu d'une zone de saisie de texte multiligne.

```js
<textarea />
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `<textarea>` {/*textarea*/}

Pour afficher une zone de texte, effectuez le rendu du [composant natif du navigateur `<textarea>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea).

```js
<textarea name="postContent" />
```

[Voir plus d'exemples ci-dessous.](#usage)

#### Props {/*props*/}

`<textarea>` prend en charge un [jeu commun de props.](/reference/react-dom/components/common#props)

Une zone de texte peut devenir un [champ contrôlé](#controlling-a-text-area-with-a-state-variable) en lui passant une prop `value` :

* `value`: Une chaîne de caractères. Contrôle le texte dans la zone de texte.

Lorsque vous passez `value`, vous devez également passer un gestionnaire `onChange` qui met à jour la valeur passée.

Si votre `<textarea>` n'est pas contrôlée, vous pouvez passer la prop `defaultValue` à la place :

* `defaultValue`: Une chaîne de caractères. Spécifie [la valeur initiale](#providing-an-initial-value-for-a-text-area) pour une zone de texte.

Ces props `<textarea>` sont compatibles avec les zones de texte contrôlées et non contrôlées :

* [`autoComplete`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea#autocomplete) : Soit `'on'` ou `'off'`. Spécifie le comportement de l'autocomplétion.
* [`autoFocus`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea#autofocus) : Un booléen. Si `true`, React va cibler l'élément lors de son montage (_de son injection dans la couche d’affichage, NdT_).
* `children` : `<textarea>` n'accepte pas d'enfants. Pour définir sa valeur initiale, utilisez `defaultValue`.
* [`cols`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea#cols) : Un nombre. Spécifie la largeur par défaut en prenant pour échelle la largeur moyenne des caractères. Par défaut, `20`.
* [`disabled`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea#disabled) : Un booléen. Si `true`, la zone de texte ne sera pas interactive et sera grisée.
* [`form`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea#form) : Une chaîne de caractères. Spécifie l'`id` du `<form>` auquel appartient cette zone de texte. S'il est absent, la zone de saisie sera associée au formulaire parent le plus proche.
* [`maxLength`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea#maxlength) : Un nombre. Spécifie la longueur maximale du texte.
* [`minLength`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea#minlength) : Un nombre. Spécifie la longueur minimale du texte.
* [`name`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea#name) : Une chaîne de caractères. Spécifie le nom de cette zone de texte qui sera [envoyé au formulaire](#reading-the-textarea-value-when-submitting-a-form).
* `onChange` : Une fonction [gestionnaire d'événements](/reference/react-dom/components/common#event-handler). Requis pour [les zones de texte contrôlées](#controlling-a-text-area-with-a-state-variable). Se déclenche immédiatement lorsque la valeur de la zone de texte est modifiée par l'utilisateur (par exemple, il se déclenche à chaque frappe). Se comporte comme l'événement [`input` du navigateur.](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture` : Une version de `onChange` qui se déclenche lors de la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) : Une fonction [gestionnaire d'événements](/reference/react-dom/components/common#event-handler). Se déclenche immédiatement lorsque la valeur de la zone de texte est modifiée par l'utilisateur. Pour des raisons historiques, en React, il est préférable d'utiliser `onChange` à la place, qui fonctionne de manière similaire.
* `onInputCapture` : Une version de `onInput` qui se déclenche lors de la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event) : Une fonction [gestionnaire d'événements](/reference/react-dom/components/common#event-handler). Se déclenche si une zone de texte échoue à la validation lors de la soumission du formulaire. Contrairement à l'événement natif `invalid`, l'événement React `onInvalid` se propage.
* `onInvalidCapture` : Une version de `onInvalid` qui se déclenche lors de la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event) : Une fonction [gestionnaire d'événements](/reference/react-dom/components/common#event-handler). Se déclenche après que la sélection à l'intérieur de la zone de texte a changé. React étend l'événement `onSelect` pour se déclencher également pour une sélection vide et sur les modifications (qui peuvent affecter la sélection).
* `onSelectCapture` : Une version de `onSelect` qui se déclenche lors de la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`placeholder`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea#placeholder) : Une chaîne de caractères. Affichée dans une couleur claire lorsque la valeur de la zone de texte est vide.
* [`readOnly`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea#readonly) : Un booléen. Si `true`, la zone de texte n'est pas modifiable par l'utilisateur.
* [`required`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea#required) : Un booléen. Si `true`, la valeur doit être fournie pour que le formulaire soit soumis.
* [`rows`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea#rows) : Un nombre. Spécifie la hauteur par défaut en prenant pour échelle la hauteur moyenne des caractères. Par défaut, `2`.
* [`wrap`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea#wrap) : Soit `'hard'`, `'soft'`, ou `'off'`. Spécifie comment les retours à la ligne automatiques sont utilisés lors de la soumission d'un formulaire.

#### Limitations {/*caveats*/}

- Passer des enfants de cette manière n'est pas autorisé : `<textarea>quelque chose</textarea>`. [Utilisez `defaultValue` pour définir le contenu initial](#providing-an-initial-value-for-a-text-area).
- Si une zone de texte reçoit une prop `value`, elle sera [traitée comme contrôlée](#controlling-a-text-area-with-a-state-variable).
- Une zone de texte ne peut pas être à la fois contrôlée et non contrôlée en même temps.
- Une zone de texte contrôlée doit avoir un gestionnaire `onChange` qui met à jour sa valeur.

---

## Utilisation {/*usage*/}

### Afficher une zone de texte {/*displaying-a-text-area*/}

Effectuez le rendu d'une zone de texte avec `<textarea>`. Vous pouvez spécifier sa taille par défaut avec les attributs [`rows`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea#rows) et [`cols`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/textarea#cols), mais par défaut, l'utilisateur pourra la redimensionner. Pour désactiver le redimensionnement, vous pouvez spécifier `resize: none` dans le CSS.

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
       Écrivez votre post :
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### Fournir une légende pour une zone de texte {/*providing-a-label-for-a-text-area*/}

Vous placerez généralement chaque `<textarea>` à l'intérieur d'une balise [`<label>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/label). Cela indique au navigateur que cette légende est associée à cette zone de texte. Lorsque l'utilisateur clique sur la légende, le navigateur mettra en focus la zone de texte. C'est également essentiel pour l'accessibilité : un lecteur d'écran annoncera la légende lorsque l'utilisateur mettra en focus la zone de texte.

Si vous ne pouvez pas imbriquer `<textarea>` dans `<label>`, associez-les en passant le même `id` à `<textarea id>` et [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor). Pour éviter les conflits entre les instances d'un composant, générez un `id` avec [`useId`](/reference/react/useId).

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Écrivez votre post :
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Passer une valeur initiale à une zone de texte {/*passing-an-initial-value-to-a-text-area*/}

Vous pouvez éventuellement spécifier la valeur initiale d'une zone de texte en passant la prop `defaultValue` :

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Éditez votre post :
      <textarea
        name="postContent"
        defaultValue="J'ai beaucoup aimé faire du vélo hier !"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

Contrairement à HTML, passer du texte initial de cette manière n'est pas pris en charge : `<textarea>Contenu</textarea>`.

</Pitfall>

---

### Lire la valeur d'une zone de texte lors de la soumission d'un formulaire {/*reading-the-text-area-value-when-submitting-a-form*/}

Ajoutez un [`<form>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/form) autour de votre zone de texte avec un [`<button type="submit">`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/button) à l'intérieur. Il appellera votre gestionnaire d'événements `<form onSubmit>`. Par défaut, le navigateur enverra les données du formulaire à l'URL actuelle et rechargera la page. Vous pouvez remplacer ce comportement en appelant `e.preventDefault()`. Lisez les données du formulaire avec [`new FormData(e.target)`](https://developer.mozilla.org/fr/docs/Web/API/FormData).

<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Empêche le navigateur de recharger la page  
    e.preventDefault();

    // Lit les données du formulaire
    const form = e.target;
    const formData = new FormData(form);

    // Vous pouvez passer formData directement comme corps de la requête fetch :
    fetch('/some-api', { method: form.method, body: formData });

    // Ou vous pouvez travailler avec comme un objet simple :
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Titre du post : <input name="postTitle" defaultValue="Faire du vélo" />
      </label>
      <label>
        Éditez votre post :
        <textarea
          name="postContent"
          defaultValue="J'ai beaucoup aimé faire du vélo hier !"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Réinitialiser les modifications</button>
      <button type="submit">Sauvegarder le post</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

Donnez un `name` à votre `<textarea>`, par exemple `<textarea name="postContent" />`. Le `name` que vous avez spécifié sera utilisé comme clé dans les données du formulaire, par exemple `{ postContent: "Votre post" }`.

</Note>

<Pitfall>

Par défaut, *n'importe quel* `<button>` à l'intérieur d'un `<form>` va le soumettre. Cela peut être surprenant ! Si vous avez votre propre composant React `Button`, envisagez de retourner [`<button type="button">`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input/button) au lieu de `<button>`. Ensuite, pour être explicite, utilisez `<button type="submit">` pour les boutons qui *sont* censés soumettre le formulaire.

</Pitfall>

---

### Contrôler une zone de texte avec une variable d'état {/*controlling-a-text-area-with-a-state-variable*/}

Une zone de texte comme `<textarea />` n'est *pas contrôlée*. Même si vous [passez une valeur initiale](#providing-an-initial-value-for-a-text-area) comme `<textarea defaultValue="Texte initial" />`, votre JSX ne spécifie que la valeur initiale, pas la valeur actuelle.

**Pour effectuer le rendu d'une zone de texte _contrôlée_, passez une prop `value` à `<textarea />`**. React forcera la zone de texte à toujours avoir la valeur que vous avez passée. Généralement, vous contrôlerez une zone de texte en déclarant une [variable d'état](/reference/react/useState) :

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Déclare une variable d'état...
  // ...
  return (
    <textarea
      value={postContent} // ...force la valeur du champ de saisie à la valeur de la variable d'état...
      onChange={e => setPostContent(e.target.value)} // ...et met à jour la variable d'état à chaque frappe !
    />
  );
}
```

C'est utile lorsque vous voulez effectuer un nouveau rendu d'une partie de l'interface utilisateur à chaque frappe.

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Salut,_ **Markdown**!');
  return (
    <>
      <label>
        Entrez du markdown :
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

**Si vous passez `value` sans `onChange`, il sera impossible de saisir dans la zone de texte**. Lorsque vous contrôlez une zone de texte en passant une `value`, vous *forcez* la zone de texte à toujours avoir la valeur que vous avez passée. Donc, si vous passez une variable d'état comme `value` mais oubliez de mettre à jour cette variable d'état de manière synchrone pendant le gestionnaire d'événements `onChange`, React réinitialisera la zone de texte après chaque frappe à la `value` que vous avez spécifiée.

</Pitfall>

---

## Dépannage {/*troubleshooting*/}

### Ma zone de texte ne se met pas à jour lorsque je tape dedans {/*my-text-area-doesnt-update-when-i-type-into-it*/}

Si vous effectuez le rendu d'une zone de texte avec `value` mais sans `onChange`, vous verrez une erreur dans la console :

```js
// 🔴 Bug : zone de texte contrôlée sans gestionnaire onChange
<textarea value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

Comme le message d'erreur le suggère, si vous ne voulez spécifier que [la valeur initiale](#providing-an-initial-value-for-a-text-area), passez `defaultValue` à la place :

```js
// ✅ Correct : zone de texte non contrôlée avec une valeur initiale
<textarea defaultValue={something} />
```

Si vous voulez [contrôler cette zone de texte avec une variable d'état](#controlling-a-text-area-with-a-state-variable), spécifiez un gestionnaire `onChange` :

```js
// ✅ Correct : zone de texte contrôlée avec onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

Si la valeur est en lecture seule intentionnellement, ajoutez une prop `readOnly` pour supprimer l'erreur :

```js
// ✅ Correct : zone de texte en lecture seule sans onChange
<textarea value={something} readOnly={true} />
```

---

### Ma zone de texte revient au début à chaque frappe {/*my-text-area-jumps-to-the-beginning-on-every-keystroke*/}

Si vous [contrôlez une zone de texte](#controlling-a-text-area-with-a-state-variable), vous devez mettre à jour sa valeur d'état dans la valeur de la zone de texte du DOM pendant `onChange`.

Vous ne pouvez pas la mettre à jour avec autre chose que `e.target.value` :

```js
function handleChange(e) {
  // 🔴 Bug : mettre à jour un champ de saisie avec autre chose que e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Vous ne pouvez pas la mettre à jour de manière asynchrone :

```js
function handleChange(e) {
  // 🔴 Bug : mettre à jour un champ de saisie de manière asynchrone
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Pour corriger votre code, mettez à jour de manière synchrone `e.target.value` :

```js
function handleChange(e) {
  // ✅ Mettre à jour un champ de saisie contrôlé avec e.target.value de manière synchrone
  setFirstName(e.target.value);
}
```

Si cela ne corrige pas le problème, il est possible que la zone de texte soit supprimée et réinsérée dans le DOM à chaque frappe. Cela peut se produire si vous [réinitialisez accidentellement](/learn/preserving-and-resetting-state) l'état à chaque nouveau rendu. Par exemple, cela peut se produire si la zone de texte ou l'un de ses parents reçoit toujours un attribut `key` différent, ou si vous imbriquez des définitions de composants (ce qui n'est pas autorisé en React et provoque le remontage du composant "interne" à chaque rendu).

---

### J'ai une erreur : "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}

Si vous passez une `value` à un composant, il doit rester une chaîne de caractères tout au long de son cycle de vie.

Si vous passez `value={undefined}` à un composant, puis plus tard `value="quelqueChose"`, React ne saura pas si vous voulez que le composant soit contrôlé ou non. Un composant contrôlé doit toujours recevoir une chaîne de caractères `value`, pas `null` ou `undefined`.

Si votre `value` provient d'une API (_interface de programmation d'application, NdT_) ou d'une variable d'état, elle peut être initialisée à `null` ou `undefined`. Dans ce cas, définissez-la avec une chaîne vide (`''`) initialement, ou passez `value={someValue ?? ''}` pour vous assurer que `value` est une chaîne de caractères.