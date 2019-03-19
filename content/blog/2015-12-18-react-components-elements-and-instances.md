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

Un élément n'est pas une vrai instance. C'est plutôt un moyen de dire à React ce que vous *voulez* voir à l'écran. Vous ne pouvez appeler aucune méthode sur l'élément. C'est juste un objet de description immuable avec deux champs : `type: (string | ReactClass)` et `props: Object`[^1].

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

L’important c'est que les éléments parent et enfant ne soient *que des descriptions et non des vraies instances*. Elles ne font référence à rien à l’écran lorsque vous les créez. Vous pouvez les créer et les jeter, et ça aura peu d'importance.

Les éléments React sont faciles à parcourir, ils n’ont pas besoin d’être analysés, et bien sûr, ils sont beaucoup plus légers que les vrais éléments DOM — ce ne sont que des objets !

### Éléments composant {#component-elements}

However, the `type` of an element can also be a function or a class corresponding to a React component:

```js
{
  type: Button,
  props: {
    color: 'blue',
    children: 'OK!'
  }
}
```

This is the core idea of React.

**An element describing a component is also an element, just like an element describing the DOM node. They can be nested and mixed with each other.**

This feature lets you define a `DangerButton` component as a `Button` with a specific `color` property value without worrying about whether `Button` renders to a DOM `<button>`, a `<div>`, or something else entirely:

```js
const DangerButton = ({ children }) => ({
  type: Button,
  props: {
    color: 'red',
    children: children
  }
});
```

You can mix and match DOM and component elements in a single element tree:

```js
const DeleteAccount = () => ({
  type: 'div',
  props: {
    children: [{
      type: 'p',
      props: {
        children: 'Are you sure?'
      }
    }, {
      type: DangerButton,
      props: {
        children: 'Yep'
      }
    }, {
      type: Button,
      props: {
        color: 'blue',
        children: 'Cancel'
      }
   }]
});
```

Or, if you prefer JSX:

```js
const DeleteAccount = () => (
  <div>
    <p>Are you sure?</p>
    <DangerButton>Yep</DangerButton>
    <Button color='blue'>Cancel</Button>
  </div>
);
```

This mix and matching helps keep components decoupled from each other, as they can express both *is-a* and *has-a* relationships exclusively through composition:

* `Button` is a DOM `<button>` with specific properties.
* `DangerButton` is a `Button` with specific properties.
* `DeleteAccount` contains a `Button` and a `DangerButton` inside a `<div>`.

### Components Encapsulate Element Trees {#components-encapsulate-element-trees}

When React sees an element with a function or class `type`, it knows to ask *that* component what element it renders to, given the corresponding `props`.

When it sees this element:

```js
{
  type: Button,
  props: {
    color: 'blue',
    children: 'OK!'
  }
}
```

React will ask `Button` what it renders to. The `Button` will return this element:

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

React will repeat this process until it knows the underlying DOM tag elements for every component on the page.

React is like a child asking “what is Y” for every “X is Y” you explain to them until they figure out every little thing in the world.

Remember the `Form` example above? It can be written in React as follows[^1]:

```js
const Form = ({ isSubmitted, buttonText }) => {
  if (isSubmitted) {
    // Form submitted! Return a message element.
    return {
      type: Message,
      props: {
        text: 'Success!'
      }
    };
  }

  // Form is still visible! Return a button element.
  return {
    type: Button,
    props: {
      children: buttonText,
      color: 'blue'
    }
  };
};
```

That’s it! For a React component, props are the input, and an element tree is the output.

**The returned element tree can contain both elements describing DOM nodes, and elements describing other components. This lets you compose independent parts of UI without relying on their internal DOM structure.**

We let React create, update, and destroy instances. We *describe* them with elements we return from the components, and React takes care of managing the instances.

### Components Can Be Classes or Functions {#components-can-be-classes-or-functions}

In the code above, `Form`, `Message`, and `Button` are React components. They can either be written as functions, like above, or as classes descending from `React.Component`. These three ways to declare a component are mostly equivalent:

```js
// 1) As a function of props
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

// 2) Using the React.createClass() factory
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

// 3) As an ES6 class descending from React.Component
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
