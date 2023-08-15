---
title: isValidElement
---

<Intro>

`isValidElement` vérifie qu'une valeur est un élément React.

```js
const isElement = isValidElement(value)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

Appelez `isValidElement(value)` pour vérifier si `value` est un élément React.

```js
import { isValidElement, createElement } from 'react';

// ✅ Éléments React
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ Pas des éléments React
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `value` : la valeur que vous souhaitez vérifier. Elle peut être de n'importe quel type.

#### Valeur renvoyée {/*returns*/}

`isValidElement` renvoie `true` si `value` est un élément React.  Dans le cas contraire, elle renvoie `false`.

#### Limitations {/*caveats*/}

* **Seuls les [balises JSX](/learn/writing-markup-with-jsx) et les objets renvoyés par [`createElement`](/reference/react/createElement) sont considérés comme des éléments React.**  Par exemple, même si un nombre comme `42` est un *nœud* React valide (et peut être renvoyé par un composant), il ne constitue pas un élément React valide. Les tableaux et les portails créés par [`createPortal`](/reference/react-dom/createPortal) ne sont pas *non plus* considérés comme des éléments React.

---

## Utilisation {/*usage*/}

### Vérifier si quelque chose est un élément React {/*checking-if-something-is-a-react-element*/}

Appelez `isValidElement` pour vérifier si une valeur est un *élément React*.

Les éléments React sont :

- Les valeurs produites en écrivant une [balise JSX](/learn/writing-markup-with-jsx)
- Les valeurs produites en appelant [`createElement`](/reference/react/createElement)

Pour les éléments React, `isValidElement` renvoie `true` :

```js
import { isValidElement, createElement } from 'react';

// ✅ Les balises JSX sont des éléments React
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ Les valeurs renvoyées par createElement sont des éléments React
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

Tout autre valeur, comme les chaînes de caractères, les nombres, un objet ou tableau quelconque, ne constitue pas un élément React.

Dans leur cas, `isValidElement` renvoie `false` :

```js
// ❌ Ce ne sont *pas* des éléments React
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Bonjour')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

On a très rarement besoin d'`isValidElement`. Elle est principalement utile lorsque vous appelez une autre API qui n'accepte *que* des éléments React (à l'instar de [`cloneElement`](/reference/react/cloneElement)) et que vous voulez éviter une erreur si votre argument n'est pas un élément React.

À moins que vous n'ayez une raison très précise d'ajouter une vérification `isValidElement`, vous n'en aurez probablement jamais besoin.

<DeepDive>

#### Éléments React vs. nœuds React {/*react-elements-vs-react-nodes*/}

Lorsque vous écrivez un composant, vous pouvez lui faire renvoyer n'importe quel *nœud React* :

```js
function MyComponent() {
  // ... vous pouvez renvoyer n'importe quel nœud React ...
}
```

Un nœud React peut être :

- Un élément React créé avec JSX (tel que `<div />`) ou `createElement('div')`
- Un portail créé par [`createPortal`](/reference/react-dom/createPortal)
- Une chaîne de caractères
- Un nombre
- `true`, `false`, `null` ou `undefined` (qui ne sont pas affichés)
- Un tableau d'autres nœuds React

**Remarquez que `isValdiElement` vérifie que son argument est un *élément React*, pas un nœud React.** Par exemple, `42` ne constitue pas un élément React valide. En revanche, c'est un nœud React parfaitement acceptable :

```js
function MyComponent() {
  return 42; // Vous pouvez renvoyer un nombre depuis votre composant
}
```

C'est pourquoi vous ne devriez pas utiliser `isValidElement` pour vérifier qu'une valeur peut être affichée (c'est-à-dire renvoyée par un composant).

</DeepDive>
