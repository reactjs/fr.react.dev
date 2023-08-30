---
title: "<select>"
---

<Intro>

Le  [composant natif `<select>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/select) vous permet d'afficher une liste de sélection (éventuellement déroulante) d'options.

```js
<select>
  <option value="someOption">Une option</option>
  <option value="otherOption">Une autre option</option>
</select>
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `<select>` {/*select*/}

Pour afficher une liste de sélection, utilisez le [composant natif `<select>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/select).

```js
<select>
  <option value="someOption">Une option</option>
  <option value="otherOption">Une autre option</option>
</select>
```

[Voir plus d'exemples ci-dessous](#usage).

#### Props {/*props*/}

`<select>` prend en charge toutes les [props communes aux éléments](/reference/react-dom/components/common#props).

Une liste de sélection peut devenir un [champ contrôlé](#controlling-a-select-box-with-a-state-variable) en lui passant une prop `value` :

* `value` : une chaîne de caractères (ou un tableau de chaînes de caractères pour [`multiple={true}`](#enabling-multiple-selection)). Contrôle la ou les options sélectionnées dans la liste.  Chaque valeur textuelle doit correspondre à la `value` d'une des `<option>` à l'intérieur du `<select>`.

Lorsque vous passez `value`, vous devez également passer un gestionnaire d'événement `onChange` qui met à jour la valeur passée.

Si votre `<select>` n'est pas contrôlée, passez plutôt la prop `defaultValue` :

* `defaultValue` : une chaîne de caractères (ou un tableau de chaînes de caractères pour [`multiple={true}`](#enabling-multiple-selection)). Spécifie [la ou les options initialement sélectionnées](#providing-an-initially-selected-option).

Ces props de `<select>` sont compatibles avec les listes de sélection contrôlées et non contrôlées :

* [`autoComplete`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/select#autocomplete) : une chaîne de caractères. Spécifie un des [comportements de l'autocomplétion](https://developer.mozilla.org/fr/docs/Web/HTML/Attributes/autocomplete#valeurs).
* [`autoFocus`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/select#autofocus) : un booléen. Si `true`, React va activer l'élément après le montage _(l'apparition initiale dans le DOM, NdT)_.
* `children` : `<select>` accepte comme enfants des composants [`<option>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/option), [`<optgroup>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/optgroup) et [`<datalist>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/datalist). Vous pouvez aussi passer vos propres composants à condition qu'ils finissent par produire un des composants natifs autorisés.  Si vous passez vos propres composants et que ceux-ci produisent au final des balises `<option>`, chaque `<option>` que vous affichez doit avoir une `value`.
* [`disabled`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/select#disabled) : un booléen. Si `true`, la liste de sélection ne sera pas interactive et sera grisée.
* [`form`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/select#form) : une chaîne de caractères. Spécifie l'`id` du `<form>` auquel appartient cette liste de sélection. S'il est absent, la zone de saisie sera associée au formulaire parent le plus proche.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#multiple) : un booléen. Si `true`, le navigateur autorisera la [sélection multiple](#enabling-multiple-selection).
* [`name`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/select#name) : une chaîne de caractères. Spécifie le nom de cette liste de sélection au sein de [l'envoi du formulaire](#reading-the-select-box-when-submitting-a-form).
* `onChange` : une fonction [gestionnaire d'événement](/reference/react-dom/components/common#event-handler). Requis pour [les listes de sélection contrôlées](#controlling-a-select-box-with-a-state-variable). Se déclenche immédiatement lorsque l'utilisateur sélectionne une option différente. Se comporte comme [l'événement `input`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/input_event) du navigateur.
* `onChangeCapture` : une version de `onChange` qui se déclenche lors de la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onInput`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/input_event) : une fonction [gestionnaire d'événement](/reference/react-dom/components/common#event-handler). Se déclenche immédiatement lorsque la valeur de la liste de sélection est modifiée par l'utilisateur. Pour des raisons historiques, en React l'usage consiste à plutôt utiliser `onChange`, qui fonctionne de manière similaire.
* `onInputCapture` : une version de `onInput` qui se déclenche lors de la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event) : une fonction [gestionnaire d'événement](/reference/react-dom/components/common#event-handler). Se déclenche si une liste de sélection échoue à la validation lors de la soumission du formulaire. Contrairement à l'événement natif `invalid`, l'événement React `onInvalid` se propage.
* `onInvalidCapture` : une version de `onInvalid` qui se déclenche lors de la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`required`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/select#required) : un booléen. Si `true`, la valeur doit être fournie pour que le formulaire puisse être soumis.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#size) : un nombre. Pour les listes de sélection avec `multiple={true}`, spécifie le nombre souhaitable d'éléments initialement visibles.

#### Limitations {/*caveats*/}

- Contrairement à HTML, vous n'avez pas le droit de passer un attribut `selected` aux composants `<option>`. Utilisez plutôt [`<select defaultValue>`](#providing-an-initially-selected-option) pour les listes de sélection non contrôlées et [`<select value>`](#controlling-a-select-box-with-a-state-variable) pour celles qui sont contrôlées.
- Si une liste de sélection reçoit une prop `value` textuelle, elle sera [traitée comme contrôlée](#controlling-a-select-box-with-a-state-variable).
- Une liste de sélection ne peut pas être à la fois contrôlée et non contrôlée.
- Une liste de sélection ne peut pas basculer entre un statut contrôlé et non contrôlé entre son montage et son démontage.
- Une liste de sélection contrôlée doit avoir en plus de `value` un gestionnaire `onChange` qui met à jour sa valeur de façon synchrone.

---

## Utilisation {/*usage*/}

### Afficher une liste de sélection d'options {/*displaying-a-select-box-with-options*/}

Utilisez un `<select>` avec une série de composants `<option>` à l'intérieur pour afficher une liste de sélection.  Donnez une `value` à chaque `<option>` pour représenter les données qui seront soumises avec le formulaire.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Choisissez un fruit :
      <select name="selectedFruit">
        <option value="apple">Pomme</option>
        <option value="banana">Banane</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>

---

### Fournir une légende pour une liste de sélection {/*providing-a-label-for-a-select-box*/}

Vous placerez généralement chaque `<select>` à l'intérieur d'une balise [`<label>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/label). Ça indique au navigateur que cette légende est associée à cette liste de sélection. Lorsque l'utilisateur cliquera sur la légende, le navigateur activera la liste de sélection. C'est également essentiel pour l'accessibilité : un lecteur d'écran annoncera la légende lorsque l'utilisateur activera la liste de sélection.

Si vous ne pouvez pas imbriquer votre `<select>` dans un `<label>`, associez-les en passant le même `id` à `<select id>` et [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor). Pour éviter les conflits entre les instances d'un composant, générez un `id` avec [`useId`](/reference/react/useId).

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Choisissez un fruit :
        <select name="selectedFruit">
          <option value="apple">Pomme</option>
          <option value="banana">Banane</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Choisissez un légume :
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Concombre</option>
        <option value="corn">Maïs</option>
        <option value="tomato">Tomate</option>
      </select>
    </>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>


---

### Passer une option initialement sélectionnée {/*providing-an-initially-selected-option*/}

Par défaut, le navigateur sélectionnera la première `<option>` de la liste. Pour spécifier une autre option par défaut, passez la `value` de cette `<option>` dans la prop `defaultValue` de l'élément `<select>` :

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Choisissez un fruit :
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">Pomme</option>
        <option value="banana">Banane</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>

<Pitfall>

Contrairement à HTML, passer un attribut `selected` à une `<option>` individuelle n'est pas autorisé.

</Pitfall>

---

### Autoriser la sélection multiple {/*enabling-multiple-selection*/}

Passez `multiple={true}` au `<select>` pour permettre à l'utilisateur de sélectionner plusieurs options.  Dans ce cas, si vous précisez aussi une `defaultValue` pour les options initialement sélectionnées (ou une `value` pour les options actuellement sélectionnées), il doit s'agir d'un tableau.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Choisissez des fruits :
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Pomme</option>
        <option value="banana">Banane</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { display: block; margin-top: 10px; width: 200px; }
```

</Sandpack>

---

### Lire la valeur d'une liste de sélection lors de la soumission d'un formulaire {/*reading-the-select-box-value-when-submitting-a-form*/}

Ajoutez un [`<form>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/form) autour de votre liste de sélection avec un [`<button type="submit">`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/button) à l'intérieur. Il appellera votre gestionnaire d'événement `<form onSubmit>`. Par défaut, le navigateur enverra les données du formulaire à l'URL actuelle et rechargera la page. Vous pouvez remplacer ce comportement en appelant `e.preventDefault()`. Lisez les données du formulaire avec [`new FormData(e.target)`](https://developer.mozilla.org/fr/docs/Web/API/FormData).

<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Empêche le navigateur de recharger la page
    e.preventDefault();

    // Lit les données du formulaire
    const form = e.target;
    const formData = new FormData(form);

    // Vous pouvez passer formData directement comme
    // corps de la requête fetch :
    fetch('/some-api', { method: form.method, body: formData });

    // Vous pouvez générer une URL sur cette base, comme
    // le fait par défaut le navigateur :
    console.log(new URLSearchParams(formData).toString());

    // Ou vous pouvez travailler avec comme un objet
    // simple :
    const formJson = Object.fromEntries(formData.entries());
    // (!) Ça ne gère pas les sélections multiples
    console.log(formJson);

    // Ou vous pouvez obtenir un tableau de paires
    // clé-valeur.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Choisissez votre fruit préféré :
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Pomme</option>
          <option value="banana">Banane</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <label>
        Choisissez tous vos fruits préférés :
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <button type="reset">Réinitialiser</button>
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

```css
label, select { display: block; }
label { margin-bottom: 20px; }
```

</Sandpack>

<Note>

Donnez un `name` à votre `<select>`, par exemple `<select name="selectedFruit" />`. Le `name` que vous avez spécifié sera utilisé comme clé dans les données du formulaire, par exemple `{ selectedFruit: "orange" }`.

Si vous utilisez `<select multiple={true}>`, le [`FormData`](https://developer.mozilla.org/fr/docs/Web/API/FormData) que vous récupèrerez du formulaire incluera chaque valeur sélectionnée comme une paire clé-valeur distincte.  Examinez attentivement les messages en console de l'exemple ci-dessus.

</Note>

<Pitfall>

Par défaut, *n'importe quel* `<button>` à l'intérieur d'un `<form>` va le soumettre. Ça peut surprendre ! Si vous avez votre propre composant React `Button`, envisagez de renvoyer [`<button type="button">`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input/button) au lieu de `<button>`. Ensuite, pour être explicite, utilisez `<button type="submit">` pour les boutons qui *sont* censés soumettre le formulaire.

</Pitfall>

---

### Contrôler une liste de sélection avec une variable d'état {/*controlling-a-select-box-with-a-state-variable*/}

Une liste de sélection comme `<select />` est *non contrôlée*. Même si vous [passez une valeur initiale](#providing-an-initially-selected-option) comme `<select defaultValue="orange" />`, votre JSX ne spécifie que la ou les valeurs initiales, il ne contrôle pas la ou les valeurs actuelles.

**Pour afficher une liste de sélection _contrôlée_, passez une prop `value` à `<select />`.** React forcera la liste de sélection à toujours avoir la valeur que vous avez passée. Généralement, vous contrôlerez une liste de sélection en déclarant une [variable d'état](/reference/react/useState) :

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // Déclare une variable d’état...
  // ...
  return (
    <select
      value={selectedFruit} // ...force la valeur du champ de saisie à la valeur de la variable d'état...
      onChange={e => setSelectedFruit(e.target.value)} // ...et met à jour la variable d'état à chaque modification !
    >
      <option value="apple">Pomme</option>
      <option value="banana">Banane</option>
      <option value="orange">Orange</option>
    </select>
  );
}
```

C'est utile lorsque vous voulez rafraîchir une partie de l'interface utilisateur à chaque sélection.

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        Choisissez un fruit :
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Pomme</option>
          <option value="banana">Banane</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label>
        Choisissez tous vos légumes préférés :
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Concombre</option>
          <option value="corn">Maïs</option>
          <option value="tomato">Tomate</option>
        </select>
      </label>
      <hr />
      <p>Votre fruit préféré : {selectedFruit}</p>
      <p>Vos légumes préférés : {selectedVegs.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**Si vous passez `value` sans `onChange`, il sera impossible de sélectionner une option.** Lorsque vous contrôlez une liste de sélection en passant une `value`, vous *forcez* la liste de sélection à toujours avoir la valeur que vous avez passée. Donc, si vous passez une variable d'état comme `value` mais oubliez de mettre à jour cette variable d'état de manière synchrone au sein du gestionnaire d'événement `onChange`, React réinitialisera la liste de sélection, après tentative de changement, à la `value` que vous avez spécifiée.

Contrairement à HTML, passer un attribut `selected` aux composants `<option>` n'est pas autorisé.

</Pitfall>
