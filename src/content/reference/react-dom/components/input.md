---
title: "<input>"
---

<Intro>

Le [composant natif `<input>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input) vous permet d'afficher différents types de champs de saisie dans un formulaire.

```js
<input />
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `<input>` {/*input*/}

Pour afficher un champ de saisie, utilisez le [composant natif `<input>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input).

```js
<input name="myInput" />
```

[Voir plus d'exemples ci-dessous](#usage).

#### Props {/*props*/}

<<<<<<< HEAD
`<input>` prend en charge toutes les [props communes aux éléments](/reference/react-dom/components/common#props).

<Canary>

Les extensions de React à la prop `formAction` ne sont actuellement disponibles que sur les canaux de livraison Canary et Expérimental de React. Dans les versions stables de React, `formAction` est limitée à son fonctionnement [du composant HTML natif du navigateur](/reference/react-dom/components#all-html-components). Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>

[`formAction`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#formaction) : une chaîne de caractères ou une fonction. Cette prop a priorité sur le `<form action>` pour les champs de `type="submit"` ou `type="image"`. Lorsqu'une URL est passée à `formAction`, le formulaire se comporte comme un formulaire HTML classique. Mais si une fonction est passée à `formAction`, la fonction traitera l'envoi du formulaire. Allez voir [`<form action>`](/reference/react-dom/components/form#props).
=======
`<input>` supports all [common element props.](/reference/react-dom/components/common#common-props)

- [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): A string or function. Overrides the parent `<form action>` for `type="submit"` and `type="image"`. When a URL is passed to `action` the form will behave like a standard HTML form. When a function is passed to `formAction` the function will handle the form submission. See [`<form action>`](/reference/react-dom/components/form#props).
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

Un champ de saisie peut devenir un [champ contrôlé](#controlling-an-input-with-a-state-variable) en lui passant une de ces props :

* [`checked`](https://developer.mozilla.org/fr/docs/Web/API/HTMLInputElement#checked) : un booléen. Pour un champ de saisie avec une case à cocher ou un bouton radio, contrôle s'il est sélectionné.
* [`value`](https://developer.mozilla.org/fr/docs/Web/API/HTMLInputElement#value) : une chaîne de caractères. Pour un champ de saisie textuel, contrôle son texte (pour un bouton radio, spécifie la valeur soumise avec le formulaire).

Lorsque vous passez une de ces valeurs, vous devez également passer un gestionnaire d'événement `onChange` qui met à jour la valeur passée.

Ces props d'`<input>` sont seulement compatibles avec les champs de saisie non contrôlés :

* [`defaultChecked`](https://developer.mozilla.org/fr/docs/Web/API/HTMLInputElement#defaultChecked): un booléen. Spécifie [la valeur initiale](#providing-an-initial-value-for-an-input) pour les champs de saisie de `type="checkbox"` ou`type="radio"`.
* [`defaultValue`](https://developer.mozilla.org/fr/docs/Web/API/HTMLInputElement#defaultValue): une chaîne de caractères. Spécifie [la valeur initiale](#providing-an-initial-value-for-an-input) pour un champ de saisie textuel.

Ces props d'`<input>` sont compatibles avec les champs de saisie contrôlés comme non contrôlés :

* [`accept`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#accept) : une chaîne de caractères. Spécifie quels types de fichiers sont acceptés par un champ de saisie de `type="file"`.
* [`alt`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#alt) : une chaîne de caractères. Spécifie le texte alternatif pour un champ de saisie `type="image"`.
* [`capture`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#capture) : une chaîne de caractères. Spécifie le média (microphone, vidéo ou caméra) capturé par un champ de saisie `type="file"`.
* [`autoComplete`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#autocomplete) : une chaîne de caractères. Spécifie l'un des [comportements d'autocomplétion](https://developer.mozilla.org/fr/docs/Web/HTML/Attributes/autocomplete#values) possibles.
* [`autoFocus`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#autofocus) : un booléen. Si `true`, React va activer l'élément après le montage _(l'apparition initiale dans le DOM, NdT)_.
* [`dirname`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#dirname) : une chaîne de caractères. Spécifie le nom de la donnée du formulaire indiquant la directionnalité de l'élément.
* [`disabled`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#disabled) : un booléen. Si `true`, le champ de saisie ne sera pas interactif et sera grisé.
* `children` : `<input>` n'accepte pas d'enfants.
* [`form`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#form) : une chaîne de caractères. Spécifie l'`id` du `<form>` auquel appartient ce champ de saisie. S'il est absent, le champ de saisie sera associé au formulaire parent le plus proche.
* [`formAction`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#formaction) : une chaîne de caractères. Remplace l'attribut `action` du `<form>` parent pour les champs de `type="submit"` ou `type="image"`.
* [`formEnctype`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#formenctype) : une chaîne de caractères. Remplace l'attribut `enctype` du `<form>` parent pour les champs de saisie de `type="submit"` ou `type="image"`.
* [`formMethod`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#formmethod) : une chaîne de caractères. Remplace l'attribut `method` du `<form>` parent pour les champs de saisie de `type="submit"` ou `type="image"`.
* [`formNoValidate`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#formnovalidate) : une chaîne de caractères. Remplace l'attribut `novalidate` du `<form>` parent pour les champs de saisie de `type="submit"` ou `type="image"`.
* [`formTarget`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#formtarget) : une chaîne de caractères. Remplace l'attribut `target` du `<form>` parent pour les champs de saisie de `type="submit"` ou `type="image"`.
* [`height`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#height) : une chaîne de caractères. Spécifie la hauteur de l'image pour le `type="image"`.
* [`list`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#list) : une chaîne de caractères. Spécifie l'`id` du `<datalist>` avec les options d'autocomplétion.
* [`max`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#max) : un nombre. Spécifie la valeur maximale pour les champs de saisie numériques et de date.
* [`maxLength`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#maxlength) : un nombre. Spécifie la longueur maximale pour les champs de saisie textuels et autres.
* [`min`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#min) : un nombre. Spécifie la valeur minimale pour les champs de saisie numériques et de date.
* [`minLength`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#minlength) : un nombre. Spécifie la longueur minimale pour les champs de saisie textuels et autres.
* [`multiple`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#multiple) : un booléen. Spécifie si plusieurs valeurs sont autorisées pour `type="file"` ou `type="email"`.
* [`name`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#name) : une chaîne de caractères. Spécifie le nom de ce champ de saisie au sein de [l'envoi du formulaire](#reading-the-input-values-when-submitting-a-form).
* `onChange` : une fonction [gestionnaire d'événement](/reference/react-dom/components/common#event-handler). Requis pour [les champs de saisie contrôlés](#controlling-an-input-with-a-state-variable). Se déclenche immédiatement lorsque la valeur du champ de saisie est modifiée par l'utilisateur (par exemple, il se déclenche à chaque frappe). Se comporte comme [l'événement `input`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/input_event) du navigateur.
* `onChangeCapture` : une version de `onChange` qui se déclenche lors de la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onInput`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/input_event) : une fonction [gestionnaire d'événement](/reference/react-dom/components/common#event-handler). Se déclenche immédiatement lorsque la valeur du champ de saisie est modifiée par l'utilisateur. Pour des raisons historiques, en React, il est préférable d'utiliser `onChange` à la place, qui fonctionne de manière similaire.
* `onInputCapture` : une version de `onInput` qui se déclenche lors de la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event) : une fonction [gestionnaire d'événement](/reference/react-dom/components/common#event-handler). Se déclenche si un champ de saisie échoue à la validation lors de la soumission du formulaire. Contrairement à l'événement natif `invalid`, l'événement React `onInvalid` se propage.
* `onInvalidCapture` : une version de `onInvalid` qui se déclenche lors de la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event) : une fonction [gestionnaire d'événement](/reference/react-dom/components/common#event-handler). Se déclenche après que la sélection à l'intérieur du champ de saisie a changé. React étend l'événement `onSelect` pour se déclencher également pour une sélection vide et sur les modifications de texte (qui peuvent affecter la sélection).
* `onSelectCapture` : une version de `onSelect` qui se déclenche lors de la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`pattern`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#pattern) : une chaîne de caractères. Spécifie une expression rationnelle qui doit correspondre à la `value` du champ de saisie.
* [`placeholder`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#placeholder) : une chaîne de caractères. Affichée dans une couleur discrète lorsque la valeur du champ de saisie est vide.
* [`readOnly`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#readonly) : un booléen. Si `true`, le champ de saisie n'est pas modifiable par l'utilisateur.
* [`required`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#required) : un booléen. Si `true`, la valeur doit être fournie pour que le formulaire puisse être soumis.
* [`size`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#size) : un nombre. Similaire à la définition de la largeur, mais l'unité dépend de la nature du champ.
* [`src`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#src) : une chaîne de caractères. Spécifie la source de l'image pour un champ de saisie `type="image"`.
* [`step`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#step) : un nombre positif ou le texte `'any'`. Spécifie la distance entre les valeurs valides.
* [`type`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#type) : une chaîne de caractères. L'un des [types de saisie](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#les_diff%C3%A9rents_types_de_champs_input).
* [`width`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#width) : une chaîne de caractères. Spécifie la largeur de l'image pour un champ de saisie `type="image"`.

#### Limitations {/*caveats*/}

- Les cases à cocher ont besoin de `checked` (ou `defaultChecked`), pas de `value` (ou `defaultValue`).
- Si un champ de saisie reçoit une prop `value` textuelle, il sera [traité comme un champ contrôlé](#controlling-an-input-with-a-state-variable).
- Si un champ de type case à cocher ou bouton radio reçoit une prop `checked` booléenne, il sera [traité comme un champ contrôlé](#controlling-an-input-with-a-state-variable).
- Un champ de saisie ne peut pas être à la fois contrôlé et non contrôlé.
- Un champ de saisie ne peut pas basculer entre un statut contrôlé et non contrôlé au cours de son existence.
- Un champ de saisie contrôlé doit avoir un gestionnaire `onChange` qui met à jour sa valeur.

---

## Utilisation {/*usage*/}

### Afficher des champs de saisie de différents types {/*displaying-inputs-of-different-types*/}

Utilisez un composant `<input>` pour afficher un champ de saisie. Par défaut, il s'agira d'un champ de saisie textuel. Vous pouvez passer `type="checkbox"` pour une case à cocher, `type="radio"` pour un bouton radio, [ou l'un des autres types de saisie](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input#les_diff%C3%A9rents_types_de_champs_input).

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Champ de saisie textuel : <input name="myInput" />
      </label>
      <hr />
      <label>
        Case à cocher : <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Bouton radio :
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Fournir une légende pour un champ de saisie {/*providing-a-label-for-an-input*/}

Vous placerez généralement chaque `<input>` à l'intérieur d'une balise [`<label>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/label). Ça indique au navigateur que cette légende est associée à ce champ de saisie. Lorsque l'utilisateur cliquera sur la légende, le navigateur activera le champ de saisie. C'est également essentiel pour l'accessibilité : un lecteur d'écran annoncera la légende lorsque l'utilisateur activera le champ de saisie.

Si vous ne pouvez pas imbriquer votre `<input>` dans un `<label>`, associez-les en passant le même `id` à `<input id>` et [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor). Pour éviter les conflits entre les instances d'un composant, générez un `id` avec [`useId`](/reference/react/useId).

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Votre prénom :
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Votre âge :</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Passer une valeur initiale à un champ de saisie {/*providing-an-initial-value-for-an-input*/}

Vous pouvez éventuellement spécifier la valeur initiale d'un champ de saisie. Passez-la comme une chaîne de caractères `defaultValue` pour les champs de saisie textuels. Les cases à cocher et les boutons radios spécifient quant à eux la valeur initiale avec le booléen `defaultChecked`.

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Champ de saisie textuel : <input name="myInput" defaultValue="Une valeur initiale" />
      </label>
      <hr />
      <label>
        Case à cocher : <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Bouton radio :
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true}
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Lire la valeur d'un champ de saisie lors de la soumission d'un formulaire {/*reading-the-input-values-when-submitting-a-form*/}

Ajoutez un [`<form>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/form) autour de votre champ de saisie avec un [`<button type="submit">`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/button) à l'intérieur. Il appellera votre gestionnaire d'événement `<form onSubmit>`. Par défaut, le navigateur enverra les données du formulaire à l'URL actuelle et rechargera la page. Vous pouvez remplacer ce comportement en appelant `e.preventDefault()`. Lisez les données du formulaire avec [`new FormData(e.target)`](https://developer.mozilla.org/fr/docs/Web/API/FormData).

<Sandpack>

```js
export default function MyForm() {
  function handleSubmit(e) {
    // Empêche le navigateur de recharger la page
    e.preventDefault();

    // Lit les données du formulaire
    const form = e.target;
    const formData = new FormData(form);

    // Vous pouvez passer formData directement comme
    // corps de la requête à fetch:
    fetch('/some-api', { method: form.method, body: formData });

    // Ou vous pouvez travailler avec comme un
    // objet simple :
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Champ de saisie textuel : <input name="myInput" defaultValue="Une valeur initiale" />
      </label>
      <hr />
      <label>
        Case à cocher : <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Bouton radio :
        <label><input type="radio" name="myRadio" value="option1" /> Option 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Option 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Option 3</label>
      </p>
      <hr />
      <button type="reset">Abandonner les modifications</button>
      <button type="submit">Envoyer le formulaire</button>
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

Donnez un `name` à votre `<input>`, par exemple `<input name="firstName" defaultValue="Clara" />`. Le `name` que vous avez spécifié sera utilisé comme clé dans les données du formulaire, par exemple `{ firstName: "Clara" }`.

</Note>

<Pitfall>

<<<<<<< HEAD
Par défaut, *n'importe quel* `<button>` à l'intérieur d'un `<form>` va le soumettre. Cela peut être surprenant ! Si vous avez votre propre composant React `Button`, envisagez de renvoyer [`<button type="button">`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input/button) au lieu de `<button>`. Ensuite, pour être explicite, utilisez `<button type="submit">` pour les boutons qui *sont* censés soumettre le formulaire.
=======
By default, a `<button>` inside a `<form>` without a `type` attribute will submit it. This can be surprising! If you have your own custom `Button` React component, consider using [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) instead of `<button>` (with no type). Then, to be explicit, use `<button type="submit">` for buttons that *are* supposed to submit the form.
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

</Pitfall>

---

### Contrôler un champ de saisie avec une variable d'état {/*controlling-an-input-with-a-state-variable*/}

Un champ de saisie comme `<input />` est *non contrôlé*. Même si vous [passez une valeur initiale](#providing-an-initial-value-for-an-input) comme `<input defaultValue="Texte initial" />`, votre JSX ne spécifie que la valeur initiale, il ne contrôle pas la valeur actuelle.

**Pour afficher un champ de saisie _contrôlé_, passez une prop `value` à `<input />`.** React forcera le champ de saisie à toujours avoir la valeur que vous avez passée. Généralement, vous contrôlerez un champ de saisie en déclarant une [variable d'état](/reference/react/useState) :

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // Déclare une variable d’état...
  // ...
  return (
    <input
      value={firstName} // ...force la valeur du champ de saisie à la valeur de la variable d'état...
      onChange={e => setFirstName(e.target.value)} // // ...et met à jour la variable d'état à chaque frappe !
    />
  );
}
```

C'est utile lorsque vous voulez rafraîchir une partie de l'interface utilisateur à chaque frappe.

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        Prénom :
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>Votre prénom est {firstName}.</p>}
      ...
```

C'est également utile si vous voulez offrir plusieurs façons d'ajuster l'état de la saisie (par exemple, en cliquant sur un bouton) :


```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Âge :
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Ajouter 10 ans
        </button>
```

La `value` que vous passez aux composants contrôlés ne doit pas être `undefined` ou `null`. Si vous avez besoin que la valeur initiale soit vide (comme avec le champ `firstName` ci-dessous), initialisez votre variable d'état avec une chaîne de caractères vide (`''`).

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Prénom :
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Âge :
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Ajouter 10 ans
        </button>
      </label>
      {firstName !== '' &&
        <p>Votre nom est {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Votre âge est {ageAsNumber}.</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**Si vous passez `value` sans `onChange`, il sera impossible de réaliser une saisie dans le champ de saisie.** Lorsque vous contrôlez un champ de saisie en passant une `value`, vous *forcez* le champ de saisie à toujours avoir la valeur que vous avez passée. Donc, si vous passez une variable d'état comme `value` mais oubliez de mettre à jour cette variable d'état de manière synchrone au sein du gestionnaire d'événement `onChange`, React réinitialisera le champ de saisie, après chaque frappe, à la `value` que vous avez spécifiée.

</Pitfall>

---

### Optimiser le recalcul de rendu à chaque frappe clavier {/*optimizing-re-rendering-on-every-keystroke*/}

Lorsque vous utilisez un champ de saisie contrôlé, vous modifiez l'état à chaque frappe. Si le composant contenant votre état recalcule le rendu d'un grand arbre, ça peut devenir lent. Il existe plusieurs façons d'optimiser les performances d'un recalcul de rendu.

Par exemple, supposons que vous commenciez avec un formulaire qui recalcule tout le contenu de la page à chaque frappe :

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

Puisque `<PageContent />` ne dépend pas de l'état de la saisie, vous pouvez déplacer l'état de la saisie dans son propre composant :

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

Ça améliore considérablement les performances car maintenant seul `SignupForm` se recalcule à chaque frappe.

S'il n'y a aucun moyen d'éviter le recalcul (par exemple, si `PageContent` dépend de la valeur de la saisie de recherche), [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) vous permet de conserver un champ de saisie contrôlé réactif même au sein d'un recalcul coûteux.

---

## Dépannage {/*troubleshooting*/}

### Mon champ de saisie réactif ne se met pas à jour lorsque je tape dedans {/*my-text-input-doesnt-update-when-i-type-into-it*/}

Si vous affichez un champ de saisie avec `value` mais sans `onChange`, vous verrez une erreur dans la console :

```js
// 🔴 Bug : champ de saisie contrôlé sans gestionnaire onChange
<input value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

_(« Vous avez fourni une prop `value` à un champ de formulaire sans gestionnaire `onChange`. Ça produira un champ en lecture seule. Si le champ doit être modifiable utilisez `defaultValue`. Sinon, définissez soit `onChange` soit `readOnly`. », NdT)_

Comme le message d'erreur le suggère, si vous ne voulez spécifier que [la valeur initiale](#providing-an-initial-value-for-an-input), passez plutôt celle-ci à la prop `defaultValue` :

```js
// ✅ Correct : champ de saisie non contrôlé avec une valeur initiale
<input defaultValue={something} />
```

Si vous voulez [contrôler ce champ de saisie avec une variable d'état](#controlling-an-input-with-a-state-variable), spécifiez un gestionnaire `onChange` :

```js
// ✅ Correct : champ de saisie contrôlé avec onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
```

Si la valeur est en lecture seule intentionnellement, ajoutez une prop `readOnly` pour supprimer l'erreur :

```js
// ✅ Correct : champ de saisie en lecture seule sans onChange
<input value={something} readOnly={true} />
```

---

### Ma case à cocher ne se met pas à jour lorsque je clique dessus {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

Si vous affichez une case à cocher avec `checked` mais sans `onChange`, vous verrez une erreur dans la console :

```js
// 🔴 Bug : case à cocher contrôlée sans gestionnaire onChange
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

Comme le message d'erreur le suggère, si vous ne voulez spécifier que [la valeur *initiale*](#providing-an-initial-value-for-an-input) de la case à cocher, passez plutôt `defaultChecked` :

```js
// ✅ Correct : case à cocher non contrôlée avec une valeur initiale
<input type="checkbox" defaultChecked={something} />
```

Si vous voulez [contrôler cette case à cocher avec une variable d'état](#controlling-an-input-with-a-state-variable), spécifiez un gestionnaire `onChange` :

```js
// ✅ Correct : case à cocher contrôlée avec onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

Vous devez lire `e.target.checked` plutôt que `e.target.value` pour les cases à cocher.

</Pitfall>

Si la case à cocher est en lecture seule intentionnellement, ajoutez une prop `readOnly` pour supprimer l'erreur :

```js
// ✅ Correct : champ de saisie en lecture seule sans onChange
<input type="checkbox" checked={something} readOnly={true} />
```

---

### Le curseur de mon champ de saisie revient au début à chaque frappe {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

Si vous [contrôlez un champ de saisie](#controlling-an-input-with-a-state-variable), vous devez mettre à jour sa variable d'état avec la valeur DOM du champ de saisie pendant le `onChange`.

Vous ne pouvez pas le mettre à jour avec autre chose que `e.target.value` (ou `e.target.checked` pour les cases à cocher) :


```js
function handleChange(e) {
  // 🔴 Bug : mettre à jour un champ de saisie avec autre chose que e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

Vous ne pouvez pas le mettre à jour de manière asynchrone :

```js
function handleChange(e) {
  // 🔴 Bug : mettre à jour un champ de saisie de manière asynchrone
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Pour corriger votre code, mettez à jour de manière synchrone avec `e.target.value` :

```js
function handleChange(e) {
  // ✅ Mettre à jour un champ de saisie contrôlé avec e.target.value de manière synchrone
  setFirstName(e.target.value);
}
```

Si ça ne corrige pas le problème, il est possible que le champ de saisie soit supprimé et réinséré dans le DOM à chaque frappe. Ça peut se produire si vous [réinitialisez accidentellement l'état](/learn/preserving-and-resetting-state) à chaque nouveau rendu. Par exemple, ça peut se produire si le champ de saisie ou l'un de ses parents reçoit toujours un attribut `key` différent, ou si vous imbriquez des définitions de composants (ce qui n'est pas autorisé en React et provoque le remontage du composant « interne » à chaque rendu).

---

### J'ai une erreur : "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}

_(« Un composant passe un champ non contrôlé en mode contrôlé », NdT)_

Si vous passez une `value` à un composant, cette valeur doit être une chaîne de caractères tout au long de son cycle de vie.

Si vous passez `value={undefined}` à un composant, puis plus tard `value="quelqueChose"`, React ne saura pas si vous voulez que le composant soit contrôlé ou non. Un composant contrôlé doit toujours recevoir une chaîne de caractères en `value`, pas `null` ni `undefined`.

Si votre `value` provient d'une API ou d'une variable d'état, elle peut être initialisée à `null` ou `undefined`. Dans ce cas, définissez-la avec une chaîne vide (`''`) initialement, ou passez `value={someValue ?? ''}` pour vous assurer que `value` est une chaîne de caractères.

De la même manière, si vous passez `checked` à une case à cocher, assurez-vous que c'est toujours un booléen.
