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

Un point intéressant à noter concernant les props de rendu est que vous pouvez implémenter la plupart des [composants d’ordre supérieur](/docs/higher-order-components.html) (HOC) en utilisant un composant classique avec une prop de rendu. Par exemple, si vous préférez avoir un HOC `withMouse` au lieu d'un composant`<Mouse>`, vous pouvez facilement en créer un en utilisant un composant `<Mouse>` avec une prop de rendu :

```js
// Si, pour une raison ou une autre, vous voulez vraiment utiliser un HOC, vous pouvez
// facilement en créer un en utilisant un composant classique avec une prop de rendu !
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

Utiliser une prop de rendu rend donc possible l'utilisation des deux méthodes.

## Utiliser d'autres propriétés que `render` {#using-props-other-than-render}

Il est important de se rappeler que *ce n'est pas parce que la méthode s'appelle "props de rendu" qu'il est obligatoire d'utiliser une propriété appelée `render` pour utiliser cette méthode*. En fait, [*n'importe quelle* propriété qui est utilisée par un composant pour savoir quoi renvoyer est techniquement une "prop de rendu" ](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

Même si les exemples ci-dessus utilise `render`, nous pourrions tout aussi simplement utiliser la propriété `children` !

```js
<Mouse children={mouse => (
  <p>La position de la souris est {mouse.x}, {mouse.y}</p>
)}/>
```

Et rappelez-vous, la propriété `children` n'a en fait pas besoin d'être nommée dans la liste des "attributs" de votre élément JSX. Au lieu de ça, vous pouvez l'utiliser directement *dans* l'élément !

```js
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

Vous pouvez découvrir l'utilisation de cette méthode dans l'API [react-motion](https://github.com/chenglou/react-motion).

Comme cette méthode est un peu inhabituelle, vous aurez probablement envie de préciser que `children` devrait être une fonction dans vos `propTypes` au moment de faire le design de votre API de la manière suivante.

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## Exceptions {#caveats}

### Soyez prudents lors de l'utilisation de props de rendu avec React.PureComponent {#be-careful-when-using-render-props-with-reactpurecomponent}

Utiliser une prop de rendu peut contrebalancer l'avantage apporté par l'utilisation de [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) si vous créer une fonction dans une méthode `render`. Cela est dû au fait que la comparaison superficielle des propriétés retournera toujours `false` pour les nouvelles propriétés, et que dans ce cas, chaque `render` génèrera une nouvelle valeur pour la prop de rendu.

Par exemple, en gardant l'exemple de notre composant `<Mouse>`, si `Mouse` étendait `React.PureComponent` au lieu de `React.Component`, notre exemple ressemblerait alors à ça :

```js
class Mouse extends React.PureComponent {
  // Même implémentation que plus haut...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Déplacez votre souris sur l'écran !</h1>

        {/*
          Il ne faut pas faire ça ! La valeur de la propriété `render`
          sera différente à chaque render.
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Dans cet exemple, à chaque fois que `<MouseTracker>` est rendu, une nouvelle fonction est générée comme valeur de la propriété `<Mouse render>`, ce qui annule l'effet de `<Mouse>` qui étend `React.PureComponent` !

Pour éviter ce problème; vous pouvez parfois définir la propriété comme une méthode d'instance, de la façon suivante :

```js
class MouseTracker extends React.Component {
  // Définie comme une méthode d'instance, `this.renderTheCat` se réfèrera
  // toujours à la *même* fonction quand nous l'utiliserons dans le rendu
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Déplacez votre souris sur l'écran !</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

Dans les cas où vous ne pourrez pas définir la propriété de manière statique (e.g. parce que vous devez fermer la propriété et/ou l'état local) `<Mouse>` devrait plutôt étendre `React.Component`.
