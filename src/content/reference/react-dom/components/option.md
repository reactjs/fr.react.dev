---
title: "<option>"
---

<Intro>

Le [composant natif `<option>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/option) vous permet d'afficher une option dans une liste [`<select>`](/reference/react-dom/components/select).

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

Le [composant natif `<option>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/option) vous permet d'afficher une option dans une liste déroulante [`<select>`](/reference/react-dom/components/select).

```js
<select>
  <option value="someOption">Une option</option>
  <option value="otherOption">Une autre option</option>
</select>
```

[Voir d'autres exemples ci-dessous](#usage).

#### Props {/*props*/}

`<option>` prend en charge toutes les [props communes aux éléments](/reference/react-dom/components/common#props).

`<option>` prend également en charge les props suivantes :

* [`disabled`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/option#disabled) : un booléen. Si `true`, l'option ne sera pas sélectionnable et apparaîtra grisée.
* [`label`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/option#label) : une chaine de caractères. Indique la signification de l'option. Lorsqu'elle est manquante, le texte de l'option est utilisé.
* [`value`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/option#value) : la valeur utilisée [quand on soumet le `<select>` parent dans un formulaire](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form) et que cette option est sélectionnée dans la liste.

#### Limitations {/*caveats*/}

* React ne prend pas en charge l'attribut `selected` pour `<option>`. Passez plutôt la `value` de cette option au [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option) parent pour une liste déroulante non contrôlée, ou [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable) pour une liste déroulante contrôlée.

---

## Utilisation {/*usage*/}

### Afficher une liste déroulante avec des options {/*displaying-a-select-box-with-options*/}

Utilisez un `<select>` avec une liste de composants `<option>` à l'intérieur pour afficher une liste déroulante. Donnez à chaque `<option>` une `value` qui représente la donnée qui sera soumise avec le formulaire.

[Apprenez-en davantage sur l'affichage d'un `<select>` avec une liste de composants `<option>`](/reference/react-dom/components/select).

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
