---
title: createFactory
---

<Deprecated>

Cette API sera retirée d'une future version majeure de React. [Découvrez les alternatives](#alternatives).

</Deprecated>

<Intro>

`createFactory` vous permet de créer une fonction qui produira ensuite des éléments React d'un type prédéfini.

```js
const factory = createFactory(type)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `createFactory(type)` {/*createfactory*/}

Appelez `createFactory(type)` pour créer une fonction *factory* qui produira ensuite des éléments React du `type` passé.

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

Vous pouvez alors l'utiliser pour créer des éléments React sans recourir à JSX :

```js
export default function App() {
  return button({
    onClick: () => {
      alert('Cliqué !')
    }
  }, 'Cliquez ici');
}
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `type` : l'argument `type` doit être un type de composant React valide. Par exemple, ce pourrait être un nom de balise (tel que `'div'` ou `'span'`) ou un composant React (une fonction, une classe ou un composant spécial comme un [`Fragment`](/reference/react/Fragment)).

#### Valeur renvoyée {/*returns*/}

Renvoie une fonction *factory*.  Cette fonction *factory* reçoit un objet `props` comme premier argument, suivi par une liste d'arguments `...children`, et renvoie un élément React avec les `type`, `props` et `children` passés.

---

## Utilisation {/*usage*/}

### Créer des éléments React avec une *factory* {/*creating-react-elements-with-a-factory*/}

Même si la majorité des projets React utilisent [JSX](/learn/writing-markup-with-jsx) pour décrire leurs interfaces utilisateurs (UI), JSX n'est pas obligatoire.  Autrefois, une des manières de décrire l'UI sans recourir à JSX consistait à utiliser `createFactory`.

Appelez `createFactory` pour créer une *fonction factory* calée sur un type d'élément spécifique, par exemple la balise native `'button'` :

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

En appelant cette fonction *factory*, vous obtiendrez des éléments React avec les props et enfants que vous aurez fournis :

<Sandpack>

```js src/App.js
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Cliqué !')
    }
  }, 'Cliquez ici');
}
```

</Sandpack>

Voilà comment on utilisait `createFactory` au lieu de JSX. Ceci dit, `createFactory` est dépréciée, et vous ne devriez pas utiliser `createFactory` dans du nouveau code.  Découvrez ci-dessous comment retirer les appels à `createFactory` de votre code.

---

## Alternatives {/*alternatives*/}

### Copier `createFactory` dans votre projet {/*copying-createfactory-into-your-project*/}

Si votre projet à de nombreux appels à `createFactory`, copiez cette implémentation alternative `createFactory.js` dans votre base de code :

<Sandpack>

```js src/App.js
import { createFactory } from './createFactory.js';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Cliqué !')
    }
  }, 'Cliquez ici');
}
```

```js src/createFactory.js
import { createElement } from 'react';

export function createFactory(type) {
  return createElement.bind(null, type);
}
```

</Sandpack>

Ça vous permettra de conserver votre code intact, à l'exception des imports.

---

### Remplacer `createFactory` par `createElement` {/*replacing-createfactory-with-createelement*/}

Si vous n'avez que quelques appels à `createFactory` et que vous voulez bien les migrer manuellement, sans pour autant recourir à JSX, vous pouvez remplacer chaque appel à une fonction *factory* par un appel à [`createElement`](/reference/react/createElement). Par exemple, vous pouvez remplacer ce code :

```js {1,3,6}
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Cliqué !')
    }
  }, 'Cliquez ici ');
}
```

…par ce code :


```js {1,4}
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Cliqué !')
    }
  }, 'Cliquez ici');
}
```

Voici un exemple complet d'utilisation de React sans JSX :

<Sandpack>

```js src/App.js
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Cliqué !')
    }
  }, 'Cliquez ici');
}
```

</Sandpack>

---

### Remplacer `createFactory` par JSX {/*replacing-createfactory-with-jsx*/}

Pour finir, vous pouvez utiliser JSX plutôt que `createFactory`. C'est la façon la plus courante d'utiliser React :

<Sandpack>

```js src/App.js
export default function App() {
  return (
    <button onClick={() => {
      alert('Cliqué !');
    }}>
      Cliquez ici
    </button>
  );
};
```

</Sandpack>

<Pitfall>

Il peut arriver que votre code existant passe une variable comme `type` plutôt qu'une constante du genre `'button'` :

```js {3}
function Heading({ isSubheading, ...props }) {
  const type = isSubheading ? 'h2' : 'h1';
  const factory = createFactory(type);
  return factory(props);
}
```

Pour y parvenir en JSX, vous devez renommer votre variable pour qu'elle démarre par une lettre majuscule, comme par exemple `Type` :

```js {2,3}
function Heading({ isSubheading, ...props }) {
  const Type = isSubheading ? 'h2' : 'h1';
  return <Type {...props} />;
}
```

Dans le cas contraire, React interprèterait `<type>` comme une balise HTML native, parce qu'elle serait tout en minuscules.

</Pitfall>
