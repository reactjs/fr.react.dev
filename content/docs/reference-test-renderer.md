---
id: test-renderer
title: Moteur de rendu de test
permalink: docs/test-renderer.html
layout: docs
category: Reference
---

**Importation**

```javascript
import TestRenderer from 'react-test-renderer'; // ES6
const TestRenderer = require('react-test-renderer'); // ES5 avec npm
```

## Aperçu {#overview}

Ce paquet fournit un moteur de rendu _(dans la suite de cet article, pour des raisons de concision, nous emploierons le terme générique anglais renderer sans italiques, NdT)_ capable de produire un rendu de composants React sous forme d'objets JavaScript nus, sans dépendre du DOM ou d'un environnement mobile natif.

Fondamentalement, ce paquet facilite la création d'un instantané de la hiérarchie produite par un renderer React DOM ou React Native (similaire à un arbre DOM) sans recourir à un navigateur ou à [jsdom](https://github.com/tmpvar/jsdom).

Exemple :

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

Vous pouvez utiliser la fonctionnalité de test par instantanés *(snapshot testing, NdT)* de Jest pour sauvegarder automatiquement une copie de l'arbre JSON obtenu dans un fichier, puis vérifier dans vos tests qu'il n'a pas changé : [vous trouverez plus de détails ici](https://jestjs.io/docs/en/snapshot-testing).

Vous pouvez également explorer le résultat pour trouver des nœuds spécifiques et vérifier vos attentes les concernant.

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
    <p className="sub">Sous-Composant</p>
  );
}

const testRenderer = TestRenderer.create(<MyComponent />);
const testInstance = testRenderer.root;

expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
expect(testInstance.findByProps({className: "sub"}).children).toEqual(['Sous-Composant']);
```

### TestRenderer {#testrenderer}

* [`TestRenderer.create()`](#testrenderercreate)
* [`TestRenderer.act()`](#testrendereract)

### Instance de `TestRenderer` {#testrenderer-instance}

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

## Référence de l'API {#reference}

### `TestRenderer.create()` {#testrenderercreate}

```javascript
TestRenderer.create(element, options);
```

Crée une instance de `TestRenderer` avec l'élément React passé en argument. Ça n’utilise pas un véritable DOM, mais ça ne l’empêche pas de produire l'arbre intégral des composants en mémoire pour pouvoir vérifier vos attentes dessus. Renvoie une [instance de TestRenderer](#testrenderer-instance).

### `TestRenderer.act()` {#testrendereract}

```javascript
TestRenderer.act(callback);
```

De la même manière que l'[utilitaire `act()` de `react-dom/test-utils`](/docs/test-utils.html#act), `TestRenderer.act` prépare un composant permettant la vérification d'attentes. Utilisez cette version de `act()` pour englober les appels à `TestRenderer.create` et `testRenderer.update`.

```javascript
import {create, act} from 'react-test-renderer';
import App from './app.js'; // Le composant testé

// Fait le rendu du component
let root; 
act(() => {
  root = create(<App value={1}/>)
});

// Exprime des attentes sur la racine
expect(root.toJSON()).toMatchSnapshot();

// Met à jour avec des props différentes
act(() => {
  root.update(<App value={2}/>);
})

// Exprime des attentes sur la racine
expect(root.toJSON()).toMatchSnapshot();
```

### `testRenderer.toJSON()` {#testrenderertojson}

```javascript
testRenderer.toJSON()
```

Renvoie un objet représentant l'arbre obtenu. Cet arbre contient uniquement les nœuds spécifiques à la plateforme comme `<div>` ou `<View>` avec leur props mais ne contient aucun composant écrit par l'utilisateur. C’est pratique pour le [test par instantanés](http://facebook.github.io/jest/docs/en/snapshot-testing.html#snapshot-testing-with-jest).

### `testRenderer.toTree()` {#testrenderertotree}

```javascript
testRenderer.toTree()
```

Renvoie un objet représentant l'arbre obtenu. Contrairement à `toJSON()`, la représentation y est plus détaillée et contient les composants écrits par l'utilisateur. Vous n'aurez probablement pas besoin de cette méthode à moins que vous n’écriviez votre propre bibliothèque de vérification d'attentes construite au-dessus du renderer de test.

### `testRenderer.update()` {#testrendererupdate}

```javascript
testRenderer.update(element)
```

Effectue à nouveau le rendu de l'arbre en mémoire, avec un nouvel élément racine. Ça simule une mise à jour de l'arbre React à la racine. Si le nouvel élément a le même type et la même clé que l'élément précédent, l'arbre sera mis à jour ; dans le cas contraire, un nouvel arbre sera re-monté.

### `testRenderer.unmount()` {#testrendererunmount}

```javascript
testRenderer.unmount()
```

Démonte l'arbre en mémoire, en déclenchant les événements de cycle de vie appropriés.

### `testRenderer.getInstance()` {#testrenderergetinstance}

```javascript
testRenderer.getInstance()
```

Renvoie l'instance correspondant à l'élément racine, s’il est disponible. Ça ne marchera pas si l'élément racine est une fonction composant car celles-ci n'ont pas d'instance.

### `testRenderer.root` {#testrendererroot}

```javascript
testRenderer.root
```

Renvoie l'objet « instance de test » racine, qui est utile pour faire des vérifications d'attentes à propos de nœuds spécifiques dans l'arbre. Vous pouvez l'utiliser pour trouver d'autres « instances de test » présentes plus profond dans l'arbre.

### `testInstance.find()` {#testinstancefind}

```javascript
testInstance.find(test)
```

Trouve une unique « instance de test » descendante pour laquelle `test(testInstance)` renvoie `true`. Si `test(testInstance)` ne renvoie pas `true` pour exactement une « instance de test », une erreur est levée.

### `testInstance.findByType()` {#testinstancefindbytype}

```javascript
testInstance.findByType(type)
```

Trouve une unique « instance de test » avec le `type` donné. Si il n'y a pas exactement une « instance de test » avec le `type` donné, une erreur est levée.

### `testInstance.findByProps()` {#testinstancefindbyprops}

```javascript
testInstance.findByProps(props)
```

Trouve une unique « instance de test » avec les `props` données. Si il n'y a pas exactement une « instance de test » avec les `props` données, une erreur est levée.

### `testInstance.findAll()` {#testinstancefindall}

```javascript
testInstance.findAll(test)
```

Trouve toutes les « instances de test » descendantes pour lesquelles `test(testInstance)` renvoie `true`.

### `testInstance.findAllByType()` {#testinstancefindallbytype}

```javascript
testInstance.findAllByType(type)
```

Trouve toutes les « instances de test » descendantes avec le `type` donné.

### `testInstance.findAllByProps()` {#testinstancefindallbyprops}

```javascript
testInstance.findAllByProps(props)
```

Trouve toutes les « instances de test » descendantes avec les `props` données.

### `testInstance.instance` {#testinstanceinstance}

```javascript
testInstance.instance
```

L'instance de composant correspondant à cette « instance de test ». Ça n'est disponible que pour les composants à base de classe, vu que les fonctions composants n'ont pas d'instances. Ça correspond à la valeur de `this` au sein du composant donné.

### `testInstance.type` {#testinstancetype}

```javascript
testInstance.type
```

Le type de composant correspondant à cette « instance de test ». Par exemple, un composant `<Button />` a pour type `Button`.

### `testInstance.props` {#testinstanceprops}

```javascript
testInstance.props
```

Les props correspondant à cette « instance de test ». Par exemple, un composant `<Button size="small" />` a comme props `{size: 'small'}`.

### `testInstance.parent` {#testinstanceparent}

```javascript
testInstance.parent
```

L'« instance de test » parente de cette « instance de test ».

### `testInstance.children` {#testinstancechildren}

```javascript
testInstance.children
```

Les « instances de test » enfants de cette « instance de test ».

## Idées {#ideas}

Vous pouvez passer la fonction `createNodeMock` à `TestRenderer.create` comme option pour créer des simulations  personnalisées de refs.
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
        // simule une fonction focus
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
