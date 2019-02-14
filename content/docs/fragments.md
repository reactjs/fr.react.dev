---
id: fragments
title: Fragments
permalink: docs/fragments.html
---

Un composant qui retourne plusieurs éléments est une pratique commune en React. Les fragments donnent l'opportunité de grouper une liste d'enfants sans ajouter des nœuds supplémentaires au DOM.

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

Il existe aussi une nouvelle [syntaxe courte](#short-syntax) pour les déclarer, mais elle n'est pas encore supportée par tous les outils populaires.

## Motivation {#motivation}

Un composant qui retourne une liste d'enfants est une pratique commune. Prenez cette exemple de portion de React:

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

`<Columns />` aurait besoin de retourner plusieurs éléments `<td>` afin que l'HTML rendu soit valide. Si une div parent était utilisée dans le `render()` de `<Columns />`, alors l'HTML résultant serait invalide.

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

donne le rendu de `<Table />` suivant:

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

Les fragments resolvent ce problème.

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

qui donnent le rendu correct de `<Table />` suivant:

```jsx
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

### Syntaxe courte {#short-syntax}

Il y a syntaxe nouvelle et plus courte que vous pouvez utiliser pour déclarer des fragments. Cela ressemble à des balises vides:

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

Vous pouvez utiliser `<></>` de la même manière que vous utiliseriez n'importe quel élément à l'exception qu'il ne prend pas de clés ni d'attribut.

Notez que **[beaucoup d'outils ne la supporte pas encore](/blog/2017/11/28/react-v16.2.0-fragment-support.html#support-for-fragment-syntax)** donc vous voudrez peut-être explicitement écrire `<React.Fragment>` jusqu'à que les outils se mettent à niveau.

### Les fragments à clé {#keyed-fragments}

Les fragments déclarés explicitement avec la syntaxe `<React.Fragment>` peuvent avoir des clés *(key, NdT)*. Un cas d'utilisation pour cela serait de mapper une collection à un tableau de fragments -- par exemple pour créer une liste de descriptions:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Sans la `key`, React va déclancher un `key warning`
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key` est le seul attribut qui peut être passé à `Fragment`. Dans le futur, nous pourrons ajouter un support pour des attributs supplémentaires, comme des gestionnaires d'évenements.

### Demo Live {#live-demo}

Vous pouvez essayer la nouvelle syntaxe JSX de fragment avec ce [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000).
