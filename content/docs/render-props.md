---
id: render-props
title: Props de rendu
permalink: docs/render-props.html
---

Le terme [« prop de rendu »](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) _(render prop, NdT)_ fait référence à une technique qui consiste à partager du code entre des composants React en utilisant une prop dont la valeur est une fonction.

Un composant avec une prop de rendu prend une fonction qui renvoie un élément React et l'appelle au lieu d'implémenter sa propre logique de rendu.

```jsx
<DataProvider render={data => (
  <h1>Bonjour {data.target}</h1>
)}/>
```

Des bibliothèques telles que [React Router](https://reacttraining.com/react-router/web/api/Route/render-func), [Downshift](https://github.com/paypal/downshift) et [Formik](https://github.com/jaredpalmer/formik) utilisent ces props de rendu.

Dans cette page, nous verrons en quoi les props de rendu sont pratiques, et comment vous pouvez écrire les vôtres.

## Utiliser les props de rendu pour des questions transversales {#use-render-props-for-cross-cutting-concerns}

Les composants sont l'unité de base de réutilisation de code dans React, mais il n'est pas toujours évident de partager l'état ou le comportement contenu dans un composant avec d'autres composants qui auraient besoin de ce même état.

Par exemple, le composant suivant piste la position de la souris dans une application web :

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
        <h1>Déplacez votre souris sur l’écran !</h1>
        <p>La position actuelle de la souris est ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

Lorsque le curseur se déplace sur l’écran, le composant affiche ses coordonnées (x,y) dans un élément `<p>`.

La question qui se pose maintenant est : comment pouvons-nous réutiliser ce comportement dans un autre composant ? En d'autres termes, si un autre composant a besoin de connaître la position du curseur, pouvons-nous encapsuler ce comportement pour pouvoir facilement le partager avec ce composant ?

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

        {/* ...mais comment afficher autre chose qu'un <p> ? */}
        <p>La position actuelle de la souris est ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Déplacez votre souris sur l’écran !</h1>
        <Mouse />
      </div>
    );
  }
}
```

Le composant `<Mouse>` encapsule maintenant tous les comportements associés à l'écoute des événements `mousemove` et à la sauvegarde de la position (x, y) du curseur, mais il n'est pas encore tout à fait réutilisable.

Par exemple, supposons que nous avons un composant `<Cat>` qui affiche une image de chat pourchassant une souris sur l’écran. Nous pourrions utiliser une prop `mouse`, comme dans `<Cat mouse={{ x, y }}>`, pour transmettre au composant les coordonnées de la souris pour qu'il sache où positionner l'image sur l’écran.

Au premier essai, vous tenteriez peut-être d’afficher `<Cat>` *dans la méthode `render` de `<Mouse>`*, comme ceci :

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
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
          <MouseWithSomethingElse> chaque fois que nous voudrions l'utiliser.
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
        <h1>Déplacez votre souris sur l’écran !</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

Cette approche fonctionnera dans notre cas particulier, mais nous n'avons pas atteint notre objectif qui consiste à vraiment encapsuler le comportement de façon réutilisable. En effet, chaque fois que nous aurons besoin de la position de la souris pour un cas d'utilisation différent, nous devrons créer un nouveau composant (pour ainsi dire un autre `<MouseWithCat>`) spécifique à ce cas.

C'est là que la prop de rendu entre en scène : au lieu d'écrire en dur un composant `<Cat>` dans un composant `<Mouse>`, et changer le résultat de l’affichage, nous pouvons créer `<Mouse>` avec une prop qui prendra une fonction permettant de déterminer dynamiquement ce qui doit être affiché : une prop de rendu.

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
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
          Au lieu de fournir une représentation statique de ce qu’affiche <Mouse>,
          utilisez la prop `render` pour déterminer dynamiquement quoi afficher.
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
        <h1>Déplacez votre souris sur l’écran !</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Dorénavant, au lieu de cloner le composant `<Mouse>` et d'écrire en dur quelque chose d'autre dans sa méthode `render` pour s'adapter à un cas d'utilisation, nous fournissons une prop `render` que `<Mouse>` peut utiliser pour déterminer dynamiquement quoi afficher.

Plus concrètement, **une prop de rendu est une prop de type fonction qu'un composant utilise pour savoir quoi afficher.**

Cette technique facilite énormément le partage d'un comportement. Pour récupérer ce comportement, il suffit d’afficher un `<Mouse>` avec une prop `render` qui lui dit quoi afficher avec les coordonnées (x, y) actuelles du curseur.

Un point intéressant à noter concernant les props de rendu est que vous pouvez implémenter la plupart des [composants d’ordre supérieur](/docs/higher-order-components.html) *(Higher-Order Components, ou HOC, NdT)* en utilisant un composant classique avec une prop de rendu. Par exemple, si vous préférez avoir un HOC `withMouse` au lieu d'un composant`<Mouse>`, vous pouvez facilement en créer un en utilisant un composant `<Mouse>` avec une prop de rendu :

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

## Utiliser d'autres props que `render` {#using-props-other-than-render}

Il est important de se rappeler que *ce n'est pas parce que la technique s'appelle « props de rendu » qu'il est obligatoire d'utiliser une prop appelée `render` pour la mettre en œuvre*. En fait, [*n'importe quelle* prop utilisée par un composant pour savoir quoi renvoyer est techniquement une « prop de rendu »](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

Même si les exemples ci-dessus utilisent `render`, nous pourrions tout aussi simplement utiliser la prop `children` !

```js
<Mouse children={mouse => (
  <p>La position de la souris est {mouse.x}, {mouse.y}</p>
)}/>
```

Et rappelez-vous, la propriété `children` n'a en fait pas besoin d'être nommée dans la liste des « attributs » de votre élément JSX. Au lieu de ça, vous pouvez l'utiliser directement *dans* l'élément !

```js
<Mouse>
  {mouse => (
    <p>La position de la souris est {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

Vous pouvez découvrir l'utilisation de cette technique dans l'API [react-motion](https://github.com/chenglou/react-motion).

Comme cette technique est un peu inhabituelle, vous aurez probablement envie de préciser que `children` devrait être une fonction dans vos `propTypes` au moment de concevoir votre API de cette façon.

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## Limitations {#caveats}

### Soyez prudent·e lors de l'utilisation de props de rendu avec React.PureComponent {#be-careful-when-using-render-props-with-reactpurecomponent}

Utiliser une prop de rendu peut contrebalancer l'avantage apporté par l'utilisation de [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) si vous créez la fonction dans une méthode `render`. C’est dû au fait que la comparaison superficielle des props renverra toujours `false` pour les nouvelles props, et que dans ce cas chaque `render` génèrera justement une nouvelle valeur pour la prop de rendu.

Pour revenir sur l'exemple de notre composant `<Mouse>`, si `Mouse` étendait `React.PureComponent` au lieu de `React.Component`, notre exemple ressemblerait à ça :

```js
class Mouse extends React.PureComponent {
  // Même implémentation que plus haut...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Déplacez votre souris sur l’écran !</h1>

        {/*
          Il ne faut pas faire ça ! La valeur de la prop `render`
          sera différente à chaque rendu.
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Dans cet exemple, à chaque fois que `<MouseTracker>` s’affiche, une nouvelle fonction est générée comme valeur de la prop `<Mouse render>`, ce qui annule l'optimisation recherchée à la base quand on a fait en sorte que `<Mouse>` étende `React.PureComponent` !

Pour éviter ce problème; vous pouvez parfois définir la prop comme une méthode d'instance, de la façon suivante :

```js
class MouseTracker extends React.Component {
  // Définie comme une méthode d’instance, `this.renderTheCat` se réfèrera
  // toujours à la *même* fonction quand nous l‘utiliserons dans le rendu.
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Déplacez votre souris sur l’écran !</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

Dans les cas où vous ne pourriez pas définir la prop de manière statique (ex. parce qu’elle utilise des valeurs locales à `render`), `<Mouse>` devrait plutôt étendre `React.Component`.
