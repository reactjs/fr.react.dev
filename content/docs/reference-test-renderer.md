---
id: test-renderer
title: Moteur de Rendu de Test
permalink: docs/test-renderer.html
layout: docs
category: Reference
---

**Import**

```javascript
import TestRenderer from 'react-test-renderer'; // ES6
const TestRenderer = require('react-test-renderer'); // ES5 avec npm
```

## Vue d'ensemble {#overview}

Ce paquet vous donne accès à un moteur de rendu _(Dans la suite de cet article, pour des raisons de concision, nous emploierons le terme générique anglais renderer sans italiques, NdT)_ qui peut être utilisé pour faire un rendu d'objets JavaScript purs sans dépendre du DOM ou d'un environnement mobile natif.

Fondamentalement, ce paquet rend facile la création d'un instantané de la hiérarchie rendue par un renderer React DOM ou React Native du point de vue de cette plateforme (similaire à un arbre DOM) sans utiliser un navigateur ou [jsdom](https://github.com/tmpvar/jsdom).

Exemple:

```javascript
import TestRenderer from 'react-test-renderer';

function Link(props) {
  return <a href={props.page}>{props.children}</a>;
}

const testRenderer = TestRenderer.create(
  <Link page="https://www.facebook.com/">Facebook</Link>
);

console.log(testRenderer.toJSON());
// { type: 'a',
//   props: { href: 'https://www.facebook.com/' },
//   children: [ 'Facebook' ] }
```

Vous pouvez utiliser la fonctionnalité de test par instantanés de Jest pour sauvegarder automatiquement une copie de l'arbre JSON dans un fichier et vérifier dans vos tests qu'il n'a pas changé: [Apprenez en plus ici](http://facebook.github.io/jest/blog/2016/07/27/jest-14.html).

Vous pouvez également explorer le résultat pour trouver des nœuds spécifiques et vérifier des attentes à leur propos.

```javascript
import TestRenderer from 'react-test-renderer';

function MyComponent() {
  return (
    <div>
      <SubComponent foo="bar" />
      <p className="my">Salut</p>
    </div>
  )
}

function SubComponent() {
  return (
    <p className="sub">SousComposant</p>
  );
}

const testRenderer = TestRenderer.create(<MyComponent />);
const testInstance = testRenderer.root;

expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
expect(testInstance.findByProps({className: "sub"}).children).toEqual(['SousComposant']);
```

### TestRenderer {#testrenderer}

* [`TestRenderer.create()`](#testrenderercreate)

### Instance de TestRenderer {#testrenderer-instance}

* [`testRenderer.toJSON()`](#testrenderertojson)
* [`testRenderer.toTree()`](#testrenderertotree)
* [`testRenderer.update()`](#testrendererupdate)
* [`testRenderer.unmount()`](#testrendererunmount)
* [`testRenderer.getInstance()`](#testrenderergetinstance)
* [`testRenderer.root`](#testrendererroot)

### TestInstance {#testinstance}

* [`testInstance.find()`](#testinstancefind)
* [`testInstance.findByType()`](#testinstancefindbytype)
* [`testInstance.findByProps()`](#testinstancefindbyprops)
* [`testInstance.findAll()`](#testinstancefindall)
* [`testInstance.findAllByType()`](#testinstancefindallbytype)
* [`testInstance.findAllByProps()`](#testinstancefindallbyprops)
* [`testInstance.instance`](#testinstanceinstance)
* [`testInstance.type`](#testinstancetype)
* [`testInstance.props`](#testinstanceprops)
* [`testInstance.parent`](#testinstanceparent)
* [`testInstance.children`](#testinstancechildren)

## Référence {#reference}

### `TestRenderer.create()` {#testrenderercreate}

```javascript
TestRenderer.create(element, options);
```

Crée une instance de `TestRenderer` avec l'élement React passé en paramètre. Le vrai DOM n'est pas utilisé mais cela crée toujours un rendu de l'arbre des composants dans la mémoire pour pouvoir vérifier des attentes à son propos. L'instance retournée possède les méthodes et propriétés suivantes.

### `testRenderer.toJSON()` {#testrenderertojson}

```javascript
testRenderer.toJSON()
```

Retourne un objet représentant l'arbre rendu. Cette arbre contient uniquement les nœuds spécifiques à la plateforme comme `<div>` ou `<View>` ainsi que leur props mais ne contient aucun composant écrit par l'utilisateur. Cette méthode est pratique pour le [test par instantanés](http://facebook.github.io/jest/docs/en/snapshot-testing.html#snapshot-testing-with-jest).

### `testRenderer.toTree()` {#testrenderertotree}

```javascript
testRenderer.toTree()
```

Retourne un objet représentant l'arbre rendu. Contrairement à `toJSON()` la représentation y est plus détaillée et contient les composants écrits par l'utilisateur. Vous n'aurez probablement pas besoin de cette méthode à moins que vous écriviez votre propre bibliothèque de vérification d'attentes construite au dessus du renderer de test.

### `testRenderer.update()` {#testrendererupdate}

```javascript
testRenderer.update(element)
```

Rends de nouveau l'arbre en mémoire avec un nouvel élément racine. Cela simule une mise à jour de l'arbre React à la racine. Si le nouvel élément possède le même type ainsi que la même clé que l'élément précédent, l'arbre sera mis à jour, sinon, un nouvel arbre sera re-monté.

### `testRenderer.unmount()` {#testrendererunmount}

```javascript
testRenderer.unmount()
```

Démonte l'arbre en meémoire, déclenchant les évenements de cycle de vie appropriés.

### `testRenderer.getInstance()` {#testrenderergetinstance}

```javascript
testRenderer.getInstance()
```

Retourne l'instance correspondant à l'élément racine si il est disponible. Cela ne fonctionnera pas si l'élément racine est une fonction composant car elle n'ont pas d'instance.

### `testRenderer.root` {#testrendererroot}

```javascript
testRenderer.root
```

Retourne l'objet «instance de test» racine qui est utile pour faire des vérifications d'attentes à propos de nœuds spécifiques dans l'arbre. Vous pouvez l'utiliser pour trouver d'autres «instances de test» plus profondément dans l'arbre.

### `testInstance.find()` {#testinstancefind}

```javascript
testInstance.find(test)
```

Trouve une unique «instance de test» descendante pour laquelle `test(testInstance)` retourne `true`. Si `test(testInstance)` ne retourne pas `true` pour exactement une «instance de test», une erreur sera renvoyée.

### `testInstance.findByType()` {#testinstancefindbytype}

```javascript
testInstance.findByType(type)
```

Trouve une unique «instance de test» avec le `type` donné. Si il n'y a pas exactement une seule «instance de test» avec le `type` donné, une erreur sera renvoyée.

### `testInstance.findByProps()` {#testinstancefindbyprops}

```javascript
testInstance.findByProps(props)
```

Trouve une unique «instance de test» avec les `props` données. Si il n'y a pas exactement une seule «instance de test» avec les `props` données, une erreur sera renvoyée.

### `testInstance.findAll()` {#testinstancefindall}

```javascript
testInstance.findAll(test)
```

Trouve toutes les «instances de test» descendantes pour lesquelles `test(testInstance)` retourne `true`.

### `testInstance.findAllByType()` {#testinstancefindallbytype}

```javascript
testInstance.findAllByType(type)
```

Trouve toutes les «instances de test» avec le `type` donné.

### `testInstance.findAllByProps()` {#testinstancefindallbyprops}

```javascript
testInstance.findAllByProps(props)
```

Trouve toutes les «instances de test» descendantes avec les `props` données.

### `testInstance.instance` {#testinstanceinstance}

```javascript
testInstance.instance
```

L'instance de composant correspondant à cette «instance de test». Cela n'est disponible que pour les composants à base de classe sachant que les fonctions composant n'ont pas d'instances. Cette instance de composant corresponds à la valeur de `this` au sein du composant donné.

### `testInstance.type` {#testinstancetype}

```javascript
testInstance.type
```

Le type de composant correspondant à cette «instance de test». Par exemple, un composant `<Button />` possède un type `Button`.

### `testInstance.props` {#testinstanceprops}

```javascript
testInstance.props
```

Les props correspondant à cette «instance de test». Par exemple, un composant `<Button size="small" />` possède les props suivantes: `{size: 'small'}`.

### `testInstance.parent` {#testinstanceparent}

```javascript
testInstance.parent
```

L'«instance de test» parente de cette «instance de test».

### `testInstance.children` {#testinstancechildren}

```javascript
testInstance.children
```

Les «instances de test» enfant de cette «instance de test».

## Idées {#ideas}

Vous pouvez passer la fonction `createNodeMock` à `TestRenderer.create` comme option pour créer des imitations  personalisées de refs.
`createNodeMock` accepte l'élément courant et doit retourner une imitation de ref.
C'est utile quand vous testez un composant qui utilise des refs.

```javascript
import TestRenderer from 'react-test-renderer';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
  }
  componentDidMount() {
    this.input.focus();
  }
  render() {
    return <input type="text" ref={el => this.input = el} />
  }
}

let focused = false;
TestRenderer.create(
  <MyComponent />,
  {
    createNodeMock: (element) => {
      if (element.type === 'input') {
        // mock a focus function
        return {
          focus: () => {
            focused = true;
          }
        };
      }
      return null;
    }
  }
);
expect(focused).toBe(true);
```
