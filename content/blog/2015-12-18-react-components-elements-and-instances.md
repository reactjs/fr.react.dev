---
title: "Composants, éléments et instances de React"
author: [gaearon]
---

La différence entre **les composants, leurs instances et leurs éléments** déroute beaucoup les débutants React. Pourquoi y a-t-il trois termes différents pour désigner quelque chose qui est peint sur l'écran ?

## Gestion des instances {#managing-the-instances}

Si vous débutez avec React, vous n’avez probablement travaillé qu’avec des classes et des instances de composants. Par exemple, vous pouvez déclarer un *composant* `Button` en créant une classe. Lorsque l'application est en cours d'exécution, vous pouvez avoir plusieurs *instances* de ce composant à l'écran, chacune avec ses propres propriétés et son état local. Il s’agit de la programmation d’interface utilisateur traditionnelle orientée objet. Pourquoi introduire des *éléments* ?

Dans ce modèle d'interface utilisateur traditionnel, c'est vous qui devez vous occuper de la création et de la destruction d'instances de composant enfant. Si un composant `Form` veut afficher un composant `Button`, il doit créer son instance et le maintenir manuellement à jour avec les nouvelles informations.

```js
class Form extends TraditionalObjectOrientedView {
  render() {
    // Lit certaines données passées à la vue
    const { isSubmitted, buttonText } = this.attrs;

    if (!isSubmitted && !this.button) {
      // Le formulaire n'a pas encore été sousmis. Créons le bouton !
      this.button = new Button({
        children: buttonText,
        color: 'blue'
      });
      this.el.appendChild(this.button.el);
    }

    if (this.button) {
      // Le bouton est visible. Mettons à jour son texte !
      this.button.attrs.children = buttonText;
      this.button.render();
    }

    if (isSubmitted && this.button) {
      // Le formulaire a été soumis. Détruisons le bouton !
      this.el.removeChild(this.button.el);
      this.button.destroy();
    }

    if (isSubmitted && !this.message) {
      // Le formulaire a été soumis. Affichons le message de réussite !
      this.message = new Message({ text: 'Succès !' });
      this.el.appendChild(this.message.el);
    }
  }
}
```

Il s’agit de pseudo-code, mais c’est plus ou moins ce que vous obtenez lorsque vous écrivez un code d’interface utilisateur composite orienté objet qui se comporte de manière cohérente en utilisant une bibliothèque comme Backbone.

Chaque instance de composant doit conserver les références vers son nœud DOM et vers les instances des composants enfants puis les créer, les mettre à jour et les détruire au moment opportun. Le nombre de ligne de code augmentent exponentiellement selon le nombre d'états du composant, de plus, les parents ont un accès direct aux instances de leurs composants enfants, ce qui va plus tard rendre difficile leur dissociation.

Alors, en quoi React est-il différent ?

## Les éléments décrivent l'arbre {#elements-describe-the-tree}

Dans React, c'est là que les *éléments* viennent à la rescousse. **Un élément est un objet brut *décrivant* une instance de composant ou un nœud DOM et ses propriétés souhaitées.** Il contient uniquement des informations sur le type du composant (par exemple, un `Button`), ses propriétés (par exemple, sa `color`), et tous ses éléments enfants.

Un élément n'est pas une vraie instance. C'est plutôt un moyen de dire à React ce que vous *voulez* voir à l'écran. Vous ne pouvez appeler aucune méthode sur l'élément. C'est juste un objet de description immuable avec deux champs : `type: (string | ReactClass)` et `props: Object`[^1].

### Éléments DOM {#dom-elements}

Lorsque le `type` d'un élément est une chaîne de caractère, il représente un nœud DOM avec comme nom celui de la balise, et les `props` correspondent à ses attributs. C’est ce que React rendra. Par exemple :

```js
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

Cet élément, sous forme d'un objet brut, est juste un moyen de représenter le code HTML suivant :

```html
<button class='button button-blue'>
  <b>
    OK!
  </b>
</button>
```

Remarquez comment les éléments peuvent être imbriqués. Par convention, lorsque nous voulons créer une arborescence d'éléments, nous spécifions un ou plusieurs éléments enfants en tant que prop `children` de leur élément conteneur.

L’important c'est que les éléments parent et enfant ne soient *que des descriptions et non des vraies instances*. Lorsque vous les créez, elles ne font référence à rien sur l’écran. Vous pouvez les créer et les jeter, et cela aura peu d'importance.

Les éléments React sont faciles à parcourir, ils n’ont pas besoin d’être analysés, et bien sûr, ils sont beaucoup plus légers que les vrais éléments DOM — ce ne sont que des objets !

### Éléments composant {#component-elements}

Toutefois, le `type` d’un élément peut également être une fonction ou une classe qui correspond à un composant React :

```js
{
  type: Button,
  props: {
    color: 'blue',
    children: 'OK!'
  }
}
```

C'est l'idée principale de React.

**Un élément qui décrit un composant est également un élément, tout comme un élément décrivant un nœud DOM. Ils peuvent être imbriqués et mélangés les uns aux autres.**

Cette fonctionnalité vous permet de définir un composant `DangerButton` comme un `Button` avec une valeur spécifique pour la propriété `color` sans se demander si `Button` affiche un `<button>` du DOM, un `<div>` ou tout autre chose :

```js
const DangerButton = ({ children }) => ({
  type: Button,
  props: {
    color: 'red',
    children: children
  }
});
```

Vous pouvez combiner des éléments DOM et composant dans un seul arbre :

```js
const DeleteAccount = () => ({
  type: 'div',
  props: {
    children: [{
      type: 'p',
      props: {
        children: 'Êtes-vous sûr ?'
      }
    }, {
      type: DangerButton,
      props: {
        children: 'Ouais'
      }
    }, {
      type: Button,
      props: {
        color: 'blue',
        children: 'Annuler'
      }
   }]
});
```

Ou si vous préférez JSX :

```js
const DeleteAccount = () => (
  <div>
    <p>Êtes-vous sûr ?</p>
    <DangerButton>Ouais</DangerButton>
    <Button color='blue'>Annuler</Button>
  </div>
);
```

Cette combinaison aide à garder les composants découplés les uns des autres, car ils peuvent exprimer à travers la composition uniquement les relations *est-un* et *possède-un* :

* `Button` est un `<button>` du DOM avec des propriétés spécifiques.
* `DangerButton` est un `Button` avec des propriétés spécifiques.
* `DeleteAccount` contient un `Button` et un `DangerButton` à l'intérieur d'un `<div>`.

### Les composants encapsulent des arbres d'élément {#components-encapsulate-element-trees}

Lorsque React voit un élément avec un `type` classe ou fonction, il sait demander *à quel* composant il rend l'élément, en fonction des `props` correspondantes.

Quand il voit cet élément :

```js
{
  type: Button,
  props: {
    color: 'blue',
    children: 'OK!'
  }
}
```

React demandera à `Button` ce qu'il rend. Le `Button` renverra cet élément :

```js
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

React répètera ce processus pour chaque composant de la page jusqu'à ce qu'il connaisse les éléments de balise DOM sous-jacents.

React est comme un enfant demandant « c'est quoi Y ? », pour chaque « X qui est Y » vous lui expliquez jusqu'à ce qu'il comprenne tout ce qui se passe.

Vous vous rappelez de l'exemple `Form` ci-dessus ? Il peut être écrit dans React de cette manière[^1] :

```js
const Form = ({ isSubmitted, buttonText }) => {
  if (isSubmitted) {
    // Le formulaire a été soumis ! Renvoyons un élément message.
    return {
      type: Message,
      props: {
        text: 'Success!'
      }
    };
  }

  // Le formulaire est encore visible ! Renvoyons un élément button.
  return {
    type: Button,
    props: {
      children: buttonText,
      color: 'blue'
    }
  };
};
```

Voilà ! Pour un composant React, les props sont les entrées, et un arbre d'élément est la sortie.

**L'arbre d'élément renvoyé peut contenir à la fois des éléments décrivant des nœuds DOM et des éléments décrivant d'autres composants. Cela vous permet de composer des parties indépendantes de l'interface utilisateur sans s'appuyer sur leur structure DOM interne.**

Nous laissons React créer, mettre à jour et détruire les instances. Nous *décrivons* les éléments que nous renvoyons des composants, et React se charge de la gestion des instances.

### Les composants peuvent être des classes ou des fonctions {#components-can-be-classes-or-functions}

Dans le code ci-dessus, `Form`, `Message` et `Button` sont des composants React. Ils peuvent soit s'écrire comme des fonctions, soit comme ci-dessus, soit comme des classes descendant de `React.Component`. Ces trois façons de déclarer un composant sont pour l'essentiel équivalentes :

```js
// 1) Une fonction de props
const Button = ({ children, color }) => ({
  type: 'button',
  props: {
    className: 'button button-' + color,
    children: {
      type: 'b',
      props: {
        children: children
      }
    }
  }
});

// 2) Utilisation de la factory React.createClass()
const Button = React.createClass({
  render() {
    const { children, color } = this.props;
    return {
      type: 'button',
      props: {
        className: 'button button-' + color,
        children: {
          type: 'b',
          props: {
            children: children
          }
        }
      }
    };
  }
});

// 3) Une classe ES6 descendante de React.Component
class Button extends React.Component {
  render() {
    const { children, color } = this.props;
    return {
      type: 'button',
      props: {
        className: 'button button-' + color,
        children: {
          type: 'b',
          props: {
            children: children
          }
        }
      }
    };
  }
}
```

When a component is defined as a class, it is a little bit more powerful than a function component. It can store some local state and perform custom logic when the corresponding DOM node is created or destroyed.

A function component is less powerful but is simpler, and acts like a class component with just a single `render()` method. Unless you need features available only in a class, we encourage you to use function components instead.

**However, whether functions or classes, fundamentally they are all components to React. They take the props as their input, and return the elements as their output.**

### Top-Down Reconciliation {#top-down-reconciliation}

When you call:

```js
ReactDOM.render({
  type: Form,
  props: {
    isSubmitted: false,
    buttonText: 'OK!'
  }
}, document.getElementById('root'));
```

React will ask the `Form` component what element tree it returns, given those `props`. It will gradually “refine” its understanding of your component tree in terms of simpler primitives:

```js
// React: You told me this...
{
  type: Form,
  props: {
    isSubmitted: false,
    buttonText: 'OK!'
  }
}

// React: ...And Form told me this...
{
  type: Button,
  props: {
    children: 'OK!',
    color: 'blue'
  }
}

// React: ...and Button told me this! I guess I'm done.
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

This is a part of the process that React calls [reconciliation](/docs/reconciliation.html) which starts when you call [`ReactDOM.render()`](/docs/top-level-api.html#reactdom.render) or [`setState()`](/docs/component-api.html#setstate). By the end of the reconciliation, React knows the result DOM tree, and a renderer like `react-dom` or `react-native` applies the minimal set of changes necessary to update the DOM nodes (or the platform-specific views in case of React Native).

This gradual refining process is also the reason React apps are easy to optimize. If some parts of your component tree become too large for React to visit efficiently, you can tell it to [skip this “refining” and diffing certain parts of the tree if the relevant props have not changed](/docs/advanced-performance.html). It is very fast to calculate whether the props have changed if they are immutable, so React and immutability work great together, and can provide great optimizations with the minimal effort.

You might have noticed that this blog entry talks a lot about components and elements, and not so much about the instances. The truth is, instances have much less importance in React than in most object-oriented UI frameworks.

Only components declared as classes have instances, and you never create them directly: React does that for you. While [mechanisms for a parent component instance to access a child component instance](/docs/more-about-refs.html) exist, they are only used for imperative actions (such as setting focus on a field), and should generally be avoided.

React takes care of creating an instance for every class component, so you can write components in an object-oriented way with methods and local state, but other than that, instances are not very important in the React’s programming model and are managed by React itself.

## Summary {#summary}

An *element* is a plain object describing what you want to appear on the screen in terms of the DOM nodes or other components. Elements can contain other elements in their props. Creating a React element is cheap. Once an element is created, it is never mutated.

A *component* can be declared in several different ways. It can be a class with a `render()` method. Alternatively, in simple cases, it can be defined as a function. In either case, it takes props as an input, and returns an element tree as the output.

When a component receives some props as an input, it is because a particular parent component returned an element with its `type` and these props. This is why people say that the props flows one way in React: from parents to children.

An *instance* is what you refer to as `this` in the component class you write. It is useful for [storing local state and reacting to the lifecycle events](/docs/component-api.html).

Function components don’t have instances at all. Class components have instances, but you never need to create a component instance directly—React takes care of this.

Finally, to create elements, use [`React.createElement()`](/docs/top-level-api.html#react.createelement), [JSX](/docs/jsx-in-depth.html), or an [element factory helper](/docs/top-level-api.html#react.createfactory). Don’t write elements as plain objects in the real code—just know that they are plain objects under the hood.

## Further Reading {#further-reading}

* [Introducing React Elements](/blog/2014/10/14/introducing-react-elements.html)
* [Streamlining React Elements](/blog/2015/02/24/streamlining-react-elements.html)
* [React (Virtual) DOM Terminology](/docs/glossary.html)

[^1]: All React elements require an additional ``$$typeof: Symbol.for('react.element')`` field declared on the object for [security reasons](https://github.com/facebook/react/pull/4832). It is omitted in the examples above. This blog entry uses inline objects for elements to give you an idea of what’s happening underneath but the code won’t run as is unless you either add `$$typeof` to the elements, or change the code to use `React.createElement()` or JSX.
