---
id: fragments
title: Fragments
permalink: docs/fragments.html
prev: context.html
next: portals.html
---

En React, il est courant pour un composant de renvoyer plusieurs éléments. Les fragments nous permettent de grouper une liste d'enfants sans ajouter de nœud supplémentaire au DOM.

```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

Il existe aussi une nouvelle [syntaxe concise](#short-syntax) pour les déclarer.

## Motivation {#motivation}

Il est courant qu’un composant renvoie une liste d'enfants. Prenez cette exemple de bout de code React :

```jsx
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```

`<Columns />` aurait besoin de renvoyer plusieurs éléments `<td>` pour que le HTML obtenu soit valide. Mais si une div parente était utilisée dans le `render()` de `<Columns />`, alors le HTML résultat serait invalide.

```jsx
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Bonjour</td>
        <td>Monde</td>
      </div>
    );
  }
}
```

Ce code donne en sortie le `<Table />` suivant :

```jsx
<table>
  <tr>
    <div>
      <td>Bonjour</td>
      <td>Monde</td>
    </div>
  </tr>
</table>
```

Les fragments résolvent ce problème.

## Usage {#usage}

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Bonjour</td>
        <td>Monde</td>
      </React.Fragment>
    );
  }
}
```

Ce qui donne en sortie le `<Table />` correct suivant :

```jsx
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

### Syntaxe concise {#short-syntax}

Il existe une nouvelle syntaxe plus concise, que vous pouvez utiliser pour déclarer des fragments. Ça ressemble à des balises vides :

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Bonjour</td>
        <td>Monde</td>
      </>
    );
  }
}
```

Vous pouvez utiliser `<>…</>` de la même manière que n'importe quel élément, à ceci près que cette syntaxe n’accepte ni clés ni attributs.

### Les fragments à clé {#keyed-fragments}

Les fragments déclarés explicitement avec la syntaxe `<React.Fragment>` peuvent avoir des clés *(key, NdT)*. Un cas d'utilisation consisterait à faire correspondre une collection à un tableau de fragments—par exemple pour créer une liste de descriptions :

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Sans la `key`, React produira un avertissement spécifique
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key` est le seul attribut qui peut être passé à `Fragment`. À l'avenir, nous prendrons peut-être en charge des attributs supplémentaires, tels que des gestionnaires d'événements .

### Démo interactive {#live-demo}

Vous pouvez essayer la nouvelle syntaxe JSX de fragment avec ce [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000).
