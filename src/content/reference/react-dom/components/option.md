---
title: "<option>"
---

<Intro>

Le [composant natif `<option>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/option) vous permet de rendre une option dans un champ [`<select>`](/reference/react-dom/components/select).

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

### `<option>` {/*option*/}

Le [composant natif `<option>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/option) vous permet de rendre une option dans un champ [`<select>`](/reference/react-dom/components/select).

```js
<select>
    <option value="someOption">Une option</option>
    <option value="otherOption">Une autre option</option>
</select>
```

[Voir d'autres exemples ci-dessous.](#usage)

#### Props {/*props*/}

`<option>` supporte toutes les [props des éléments communs](/reference/react-dom/components/common#props).

De plus, `<option>` supporte ces props :

* [`disabled`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/option#disabled): Un booléen. Si `true`, l'option ne sera pas sélectionnable et apparaîtra comme atténuée.
* [`label`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/option#label): Une chaine de caractère. Indique la signification de l'option. Si non indiqué, le texte dans l'option sera utilisé.
* [`value`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/option#value): La valeur utilisée [quand on soumet le `<select>` parent dans un formulaire](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form), si cette option est sélectionnée.

#### Limitations {/*caveats*/}

* React ne supporte pas l'attribut `selected` pour `<option>`. À la place, passez la `value` de cette option au [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option) parent pour un composant select non contrôlé, ou [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable) pour un composant select contrôlé.

---

## Utilisation {/*usage*/}

### Afficher un champ select avec des options {/*displaying-a-select-box-with-options*/}

Écrivez un `<select>` avec une liste de composants `<option>` à l'intérieur pour afficher un champ select. Donnez à chaque `<option>` une `value` qui représente la donnée qui sera soumise avec le formulaire.

[Lire davantage à propos de l'affichage d'un `<select>` avec une liste de composants `<option>`.](/reference/react-dom/components/select)

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Choisissez un fruit :
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

