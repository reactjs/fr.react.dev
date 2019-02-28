---
id: render-props
title: Props de rendu
permalink: docs/render-props.html
---

Le terme ["prop de rendu"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) fait référence à une technique qui consiste à partager du code entre des composants React en utilisant une propriété dont la valeur est une fonction.

Un composant avec une propriété render prend une fonction qui renvoie un élément React et l'appelle au lieu d'implémenter sa propre logique de rendu.

```jsx
<DataProvider render={data => (
  <h1>Bonjour {data.target}</h1>
)}/>
```

Des bibliothèques telles que [React Router](https://reacttraining.com/react-router/web/api/Route/Route-render-methods) et [Downshift](https://github.com/paypal/downshift) utilisent ces props de rendu.

Dans cet article, nous vous exposerons pourquoi les props de rendu sont pratiques, et comment écrire les vôtres.

## Utiliser les props de rendu pour des questions transversales {#use-render-props-for-cross-cutting-concerns}

Les composants sont l'unité de base de réutilisation du code dans React, mais il n'est pas toujours évident de partager l'état ou le comportement contenu dans un composant à d'autres composants qui auraient besoin de ce même état.

Par exemple, le composant suivant traque la position de la souris dans une application web :

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
        <h1>Déplacez votre souris sur l'écran !</h1>
        <p>La position actuelle de la souris est ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

Lorsque le curseur se déplace sur l'écran, le composant affiche ses coordonnées (x,y) dans un `<p>`.

La question qui se pose maintenant est : Comment pouvons-nous réutiliser ce comportement dans un autre composant ?En d'autres mots, si un autre composant a besoin de connaître la position du curseur, pouvons-nous encapsuler ce comportement pour pouvoir facilement le partager avec ce composant ?

Puisque les composants sont l'unité de réutilisation de code dans React, essayons de refactoriser un peu le code pour pouvoir utiliser un composant `<Mouse>` qui encapsule le comportement dont nous avons besoin ailleurs.

```js
// Le composant <Mouse> encapsule le comportement dont nous avons besoin...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/* ...mais comment rendre autre chose qu'un <p> ? */}
        <p>La position actuelle de la souris est ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Déplacez votre souris sur l'écran !</h1>
        <Mouse />
      </div>
    );
  }
}
```

Le composant `<Mouse>` encapsule maintenant tous les comportements associés à l'écoute des évènements `mousemove` et à la sauvegarde de la position (x, y) du sauvegarde, mais il n'est pas encore tout à fait réutilisable.

Par exemple, supposons que nous avons un composant `<Cat>` qui rend une image de chat chassant une souris sur l'écran. Nous pourrions utiliser une propriété `<Cat mouse={{ x, y }}>` pour transmettre au composant les coordonnées de la souris pour qu'il sache où positionner l'image sur l'écran.

En première tentative, vous essayeriez peut-être de rendre `<Cat>` *dans la méthode `render` de `<Mouse>`*, comme ceci :

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/chat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
          Nous pourrions simplement remplacer le <p> par un <Cat> ici...
          mais nous devrions alors créer un composant séparé
          <MouseWithSomethingElse> chaque fois que nous voudrions l'utiliser,
          <MouseWithCat> n'est donc pas si réutilisable que ça pour le moment.
        */}
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Déplacez votre souris sur l'écran !</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

Cette approche fonctionnera dans notre cas d'utilisation, mais nous n'avons pas atteint notre objectif de vraiment encapsuler le comportement de façon réutilisable. En effet, chaque fois que nous aurons besoin de la position de la souris pour un cas d'utilisation différent, nous devrons créer un nouveau composant (i.e. pour ainsi dire un autre `<MouseWithCat>`) that renders something specifically for that use case.

C'est là que la propriété render entre en scène : au lieu d'écrire en dur un composant `<Cat>` dans un composant `<Mouse>`, et changer la valeur de sortie rendue, nous pouvons fournir `<Mouse>` avec une propriété qui est une fonction qui permet de déterminer dynamiquement ce qui doit être rendu, c'est-à-dire une render prop.

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/chat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
          Au lieu de fournir un représentation statique de ce que rend <Mouse>,
          utilisez la prop `render` pour déterminer dynamiquement quoi rendre.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Déplacez votre souris sur l'écran !</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Dorénavant, au lieu de cloner le composant `<Mouse>` et d'écrire en dur quelque chose d'autre dans sa méthode `render` pour s'adapter à un cas d'utilisation, nous fournissons une prop `render` que `<Mouse>` peut utiliser pour déterminer dynamiquement quoi rendre.

Plus concrètement, **une prop de rendu est une propriété fonction qu'un composant utilise pour savoir quoi rendre.**

Cette technique facilite énormément le partage d'un comportement. Pour récupérer ce comportement, il suffit de faire le rendu d'un `<Mouse>` avec une propriété `render` qui lui dit quoi rendre avec les coordonnées (x, y) actuelles du curseur.

One interesting thing to note about render props is that you can implement most [higher-order components](/docs/higher-order-components.html) (HOC) using a regular component with a render prop. For example, if you would prefer to have a `withMouse` HOC instead of a `<Mouse>` component, you could easily create one using a regular `<Mouse>` with a render prop:

```js
// If you really want a HOC for some reason, you can easily
// create one using a regular component with a render prop!
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
```

So using a render prop makes it possible to use either pattern.

## Using Props Other Than `render` {#using-props-other-than-render}

It's important to remember that just because the pattern is called "render props" you don't *have to use a prop named `render` to use this pattern*. In fact, [*any* prop that is a function that a component uses to know what to render is technically a "render prop"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

Although the examples above use `render`, we could just as easily use the `children` prop!

```js
<Mouse children={mouse => (
  <p>The mouse position is {mouse.x}, {mouse.y}</p>
)}/>
```

And remember, the `children` prop doesn't actually need to be named in the list of "attributes" in your JSX element. Instead, you can put it directly *inside* the element!

```js
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

You'll see this technique used in the [react-motion](https://github.com/chenglou/react-motion) API.

Since this technique is a little unusual, you'll probably want to explicitly state that `children` should be a function in your `propTypes` when designing an API like this.

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## Caveats {#caveats}

### Be careful when using Render Props with React.PureComponent {#be-careful-when-using-render-props-with-reactpurecomponent}

Using a render prop can negate the advantage that comes from using [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) if you create the function inside a `render` method. This is because the shallow prop comparison will always return `false` for new props, and each `render` in this case will generate a new value for the render prop.

For example, continuing with our `<Mouse>` component from above, if `Mouse` were to extend `React.PureComponent` instead of `React.Component`, our example would look like this:

```js
class Mouse extends React.PureComponent {
  // Same implementation as above...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>

        {/*
          This is bad! The value of the `render` prop will
          be different on each render.
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

In this example, each time `<MouseTracker>` renders, it generates a new function as the value of the `<Mouse render>` prop, thus negating the effect of `<Mouse>` extending `React.PureComponent` in the first place!

To get around this problem, you can sometimes define the prop as an instance method, like so:

```js
class MouseTracker extends React.Component {
  // Defined as an instance method, `this.renderTheCat` always
  // refers to *same* function when we use it in render
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

In cases where you cannot define the prop statically (e.g. because you need to close over the component's props and/or state) `<Mouse>` should extend `React.Component` instead.
