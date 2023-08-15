---
title: PureComponent
---

<Pitfall>

Nous vous conseillons de définir vos composants au moyen de fonctions plutôt que de classes. [Voyez comment migrer](#alternatives).

</Pitfall>

<Intro>

`PureComponent` est similaire à [`Component`](/reference/react/Component), mais évite un nouveau rendu lorsque les props et l'état local sont identiques. Les composants à base de classes restent pris en charge par React, mais nous les déconseillons pour tout nouveau code.

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Salut {this.props.name} !</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `PureComponent` {/*purecomponent*/}

Pour éviter un rendu superflu de composant à base de classe lorsque ses props et son état sont identiques, héritez de `PureComponent` plutôt que de [`Component`](/reference/react/Component) :

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Salut {this.props.name} !</h1>;
  }
}
```

`PureComponent` est une sous-classe de `Component` et prend en charge [toute l'API de `Component`](/reference/react/Component#reference).  Hériter de `PureComponent` revient à définir votre propre méthode [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) en effectuant une comparaison de surface des props et de l'état.

[Voir d'autres exemples ci-dessous](#usage).

---

## Utilisation {/*usage*/}

### Éviter les rendus superflus de composants à base de classes {/*skipping-unnecessary-re-renders-for-class-components*/}

React refait en temps normal le rendu d'un composant dès que son parent refait son rendu.  Dans une optique d'optimisation, vous pouvez créer un composant dont le nouveau rendu du composant parent ne déclenchera pas un nouveau rendu de lui-même par React, du moment que ses nouvelles props et son état ne diffèrent pas de leurs valeurs précédentes. Les [composants à base de classes](/reference/react/Component) peuvent adopter ce comportement en étendant `PureComponent` :

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Salut {this.props.name} !</h1>;
  }
}
```

Un composant React devrait toujours avoir une [logique de rendu pure](/learn/keeping-components-pure).  Ça signifie qu'il devrait toujours renvoyer le même résultat si ses props, son état et son contexte n'ont pas changé.  En utilisant `PureComponent`, vous dites à React que votre composant obéit à cette exigence, de sorte que React n'a pas besoin d'en refaire le rendu tant que ses props et son état n'ont pas changé.  En revanche, votre composant refera bien son rendu si un contexte qu'il utilise change.

Dans cet exemple, voyez comme le composant `Greeting` refait son rendu dès que `name` change (car c'est une de ses props), mais pas quand `address` change (car elle n'est pas passée comme prop à `Greeting`) :

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting a refait son rendu à", new Date().toLocaleTimeString());
    return <h3>Salut{this.props.name && ' '}{this.props.name} !</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nom :{' '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Adresse :{' '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

Nous vous conseillons de définir vos composants au moyen de fonctions plutôt que de classes. [Voyez comment migrer](#alternatives).

</Pitfall>

---

## Alternatives {/*alternatives*/}

### Migrer d'un composant à base de classe `PureComponent` vers une fonction {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

Nous vous recommandons d'utiliser des fonctions composants pour tout nouveau code, plutôt que des [composants à base de classes](/reference/react/Component). Si vous avez des composants à base de classes existants qui utilisent `PureComponent`, voici comment les convertir.  Prenons le code original suivant :

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting a refait son rendu à", new Date().toLocaleTimeString());
    return <h3>Salut{this.props.name && ' '}{this.props.name} !</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nom :{' '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Adresse :{' '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

Lorsque vous [convertissez ce composant d'une classe vers une fonction](/reference/react/Component#alternatives), enrobez-le dans [`memo`](/reference/react/memo) :

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting a refait son rendu à", new Date().toLocaleTimeString());
  return <h3>Salut{name && ' '}{name} !</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nom :{' '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Adresse :{' '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

Contrairement à `PureComponent`, [`memo`](/reference/react/memo) ne compare pas l'ancien et le nouvel état. Dans les fonctions composants, appeler une [fonction `set`](/reference/react/useState#setstate) avec un même état [évite déjà par défaut un nouveau rendu](/reference/react/memo#updating-a-memoized-component-using-state), même sans `memo`.

</Note>
