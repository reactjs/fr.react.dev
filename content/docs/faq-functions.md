---
id: faq-functions
title: Passer des fonctions aux composants
permalink: docs/faq-functions.html
layout: docs
category: FAQ
---

### Comment passer un gestionnaire d'événement (comme onClick) à un composant ? {#how-do-i-pass-an-event-handler-like-onclick-to-a-component}

On peut passer un gestionnaire d'événement et d'autres fonctions dans les props d'un composant :

```jsx
<button onClick={this.handleClick}>
```

Si vous avez besoin d'accéder au composant parent dans le gestionnaire d'événement, vous devez aussi associer la fonction à l'instance du composant (comme ci-dessous).

### Comment associer une fonction à l'instance d'un composant ? {#how-do-i-bind-a-function-to-a-component-instance}

Il y'a plusieurs façons de s'assurer que des fonctions ont accès aux attributs du composant comme `this.props` et `this.state`, qui dépendent de la syntaxe que vous utilisez.

#### Associer la fonction dans le constructeur (ES2015) {#bind-in-constructor-es2015}

```jsx
class Foo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('Cliqué');
  }
  render() {
    return <button onClick={this.handleClick}>Cliquez-moi</button>;
  }
}
```

#### Propriété de classe (Proposition Stage 3) {#class-properties-stage-3-proposal}

```jsx
class Foo extends Component {
  // Note : cette syntaxe est expérimentale et n'est pas encore standard
  handleClick = () => {
    console.log('Cliqué');
  }
  render() {
    return <button onClick={this.handleClick}>Cliquez-moi</button>;
  }
}
```

#### Associer dans la méthode render {#bind-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Cliqué');
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>Cliquez-moi</button>;
  }
}
```

>**Note :**
>
>Utiliser `Function.prototype.bind` dans la méthode `render` crée une nouvelle fonction à chaque fois que le rendu du composant est fait, ce qui peut avoir un impact sur les performances (voir plus bas).

#### Fonction fléchée dans le rendu {#arrow-function-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Cliqué');
  }
  render() {
    return <button onClick={() => this.handleClick()}>Cliquez-moi</button>;
  }
}
```

>**Note :**
>
>Utiliser une fonction fléchée dans la fonction de rendu crée une nouvelle fonction à chaque fois que le rendu du composant est fait, ce qui peut avoir un impact sur les performances (voir plus bas).

### Est-ce que c'est acceptable d'utiliser une fonction fléchée dans la méthode render ? {#is-it-ok-to-use-arrow-functions-in-render-methods}

C'est généralement acceptable, et c'est souvent la façon la plus facile de passer des paramètres à une fonction de rappel.

Si vous avez des problèmes de performance, vous devez optimiser !

### Pourquoi est-ce nécessaire d'associer une fonction ? {#why-is-binding-necessary-at-all}

En JavaScript, ces deux extraits de code ne sont **pas** équivalents :

```js
obj.method();
```

```js
var method = obj.method;
method();
```

Associer les méthode permet de s'assurer que le deuxième extrait de code fonctionne de la même manière que la première.

Avec React, vous avez généralement seulement besoin d'associer les méthode que vous *passez* à d'autres composants. Par exemple, `<button onClick={this.handleClick}>` passe `this.handleClick`, donc vous devez l'associer. Cependant, il n'est pas nécessaire d'associer la méthode `render` ou les méthodes de cycle de vie : on ne les passe pas à d'autres composants.

[Cet article de Yehuda Katz](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/) (en anglais, NdT) explique ce qu'est l'association de méthode, et comment les fonctions marchent en JavaScript, en détails.

### Pourquoi ma fonction est appelée à chaque fois que le composant est rafraîchi ? {#why-is-my-function-being-called-every-time-the-component-renders}

Vérifiez que vous _n'appelez pas la fonction_ en la passant au composant :

```jsx
render() {
  // Erroné : handleClick est appelé au lieu d'être passé par référence !
  return <button onClick={this.handleClick()}>Cliquez-moi</button>
}
```

À la place, *passez la fonction* (sans les parenthèses) :

```jsx
render() {
  // Correcte : handleClick est passé par référence !
  return <button onClick={this.handleClick}>Cliquez-moi</button>
}
```

### Comment passer un paramètre à un gestionnaire d'événement ou une fonction de rappel ? {#how-do-i-pass-a-parameter-to-an-event-handler-or-callback}

Vous pouvez utiliser une fonction fléchée pour entourer le gestionnaire d'événement et lui passer des paramètres :

```jsx
<button onClick={() => this.handleClick(id)} />
```

Le code ci-dessous est équivalent en utilisant `.bind` :

```jsx
<button onClick={this.handleClick.bind(this, id)} />
```

#### Example : Passer des paramètres en utilisant une fonction fléchée {#example-passing-params-using-arrow-functions}

```jsx
const A = 65 // Code de caractère ASCII

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }
  handleClick(letter) {
    this.setState({ justClicked: letter });
  }
  render() {
    return (
      <div>
        Cliqué : {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} onClick={() => this.handleClick(letter)}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

#### Example : Passer des paramètres en utilisant des attributs data-* {#example-passing-params-using-data-attributes}

Autrement, vous pouvez utiliser des APIs DOM pour stocker des données nécessaires à un gestionnaire d'événement. Vous pouvez utiliser cette approche si vous avez besoin d'optimiser un grand nombre d'éléments ou si vous avez des composants basés sur React.PureComponent.

```jsx
const A = 65 // Code caractère ASCII

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }

  handleClick(e) {
    this.setState({
      justClicked: e.target.dataset.letter
    });
  }

  render() {
    return (
      <div>
        Cliqué : {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} data-letter={letter} onClick={this.handleClick}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

### Comment éviter qu'une fonction soit appelée trop tôt ou trop de fois ? {#how-can-i-prevent-a-function-from-being-called-too-quickly-or-too-many-times-in-a-row}

Si vous avez un gestionnaire d'événement comme `onClick` ou `onScroll` et que vous voulez éviter que la fonction de rappel soit appelée trop vite, vous pouvez limiter le taux auquel la fonction est exécutée. Vous pouvez le faire en utilisant :

- **le throttling** : changements basés sur une fréquence de temps (exemple : [`_.throttle`](https://lodash.com/docs#throttle))
- **le debouncing** : publier des changements après une période d'inactivité (exemple : [`_.debounce`](https://lodash.com/docs#debounce))
- **le throttling basé sur `requestAnimationFrame`** : changements basés sur [`requestAnimationFrame`](https://developer.mozilla.org/fr/docs/Web/API/Window/requestAnimationFrame) (exemple : [`raf-schd`](https://github.com/alexreardon/raf-schd))

Voir [cette exemple](http://demo.nimius.net/debounce_throttle/) pour une comparaison des fonctions `throttle` eet `debounce`.

> Note :
>
> `_.debounce`, `_.throttle` eet `raf-schd` fournissent une méthtode `cancel` pour annuler l'appel à la fonction de rappel. Il est recommandé d'appeler cette méthode dans `componentWillUnmount` _ou_ de s'assurer que le composant est toujours monté dans la fonction retardée.


#### Throttle {#throttle}

Le « throttling » évite qu'une fonction ne soit appelée plus d'une fois dans un certain laps de temps. L'exemple ci-dessous retarde le gestionnaire d'événément de « click » pour éviter qu'il soit appelé plus d'une fois par seconde.

```jsx
import throttle from 'lodash.throttle';

class LoadMoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickThrottled = throttle(this.handleClick, 1000);
  }

  componentWillUnmount() {
    this.handleClickThrottled.cancel();
  }

  render() {
    return <button onClick={this.handleClickThrottled}>Charger plus</button>;
  }

  handleClick() {
    this.props.loadMore();
  }
}
```

#### Debounce {#debounce}

Le « debouncing » assure qu'une fonction ne sera appelée qu'après un certain temps soit passé après le dernier appel à cette fonction. Cela peut être utile quand vous avez un calcul complexe à faire après un événement qui peut être déclenché rapidement (comme le défilement d'une page ou les frappes d'un clavier). L'exemple ci-dessous utilise cette méthode sur un champ de texte avec un délai de 250ms.

```jsx
import debounce from 'lodash.debounce';

class Searchbox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.emitChangeDebounced = debounce(this.emitChange, 250);
  }

  componentWillUnmount() {
    this.emitChangeDebounced.cancel();
  }

  render() {
    return (
      <input
        type="text"
        onChange={this.handleChange}
        placeholder="Recherche..."
        defaultValue={this.props.value}
      />
    );
  }

  handleChange(e) {
    // React regroupe les événements, on a donc besoin de lire la valeur avec le debouce
    // Sinon, on peut appler `event.persist()` et passer l'intégralité de l'événement
    // Pour plus d'information, allez voir fr.reactjs.org/docs/events.html#event-pooling
    this.emitChangeDebounced(e.target.value);
  }

  emitChange(value) {
    this.props.onChange(value);
  }
}
```

#### le « throttling » de `requestAnimationFrame` {#requestanimationframe-throttling}

[`requestAnimationFrame`](https://developer.mozilla.org/fr/docs/Web/API/Window/requestAnimationFrame) est un moyen de mettre en file d'attente une fonction pour qu'elle soit exécutée par le navigateur à un moment optimal pour les performances d'affichage. Une fonction mise en file d'attente avec `requestAnimationFrame` sera exécutée dans la prochaine image (*frame*, NdT). Le navigateur s'assurera du mieux qu'il peut qu'il y'ait toujours 50 images par secondes (60 ips). Cependant, si le navigateur en est incapable, il limitera naturellement le nombre d'images par seconde. Par exemple, un appareil pourrait n'être capable d'afficher que 30 images par seconde, vous n'obtiendrez donc que 30 images par seconde. Utilisez `requestAnimationFrame` pour faire du « throttling » est une technique pratique afin d'éviter de faire plus de 60 mises à jour par seconde. Si vous faites 100 mises à jour en une seconde, vous créez une charge de travail supplémentaire pour le navigateur que l'utilisateur ne pourra pas voir.

>**Note :**
>
>Utilisez cette technique ne capturera que la dernière valeur publiée pour une image donnée. Vous pouvez voir un exemple de comment marche cette optimisation sur [`MDN`](https://developer.mozilla.org/fr/docs/Web/Events/scroll).

```jsx
import rafSchedule from 'raf-schd';

class ScrollListener extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);

    // Crée une nouvelle fonction à planifier
    this.scheduleUpdate = rafSchedule(
      point => this.props.onScroll(point)
    );
  }

  handleScroll(e) {
    // Quand on reçoit un événement de défilement de la page, planifier une mise à jour
    // Si on reçoit plusieurs mises à jour dans cette image, on ne publiera que la dernière valeur.
    this.scheduleUpdate({ x: e.clientX, y: e.clientY });
  }

  componentWillUnmount() {
    // Annule toute mise à jour en attente puisqu'on démonte le composant (unmount, NdT)
    this.scheduleUpdate.cancel();
  }

  render() {
    return (
      <div
        style={{ overflow: 'scroll' }}
        onScroll={this.handleScroll}
      >
        <img src="/my-huge-image.jpg" />
      </div>
    );
  }
}
```

#### Tester votre limitation de débit {#testing-your-rate-limiting}

Quand vous testez si votre code de limitation de débit fonctionne correctement, il est utile de pouvoir manipuler le temps. Si vous utilisez [`jest`](https://facebook.github.io/jest/), vous pouvez utiliser les [`faux minuteurs`](https://facebook.github.io/jest/docs/en/timer-mocks.html) pour accélérer le temps. Si vous utiliser `requestAnimationFrame`, vous pouvez utiliser [`raf-stub`](https://github.com/alexreardon/raf-stub) afin de contrôler les images d'animation.
