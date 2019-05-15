---
id: faq-functions
title: Passer des fonctions aux composants
permalink: docs/faq-functions.html
layout: docs
category: FAQ
---

### Comment passer un gestionnaire d'événements (par exemple onClick) à un composant ? {#how-do-i-pass-an-event-handler-like-onclick-to-a-component}

On peut passer un gestionnaire d'événements et d'autres fonctions dans les props d'un composant, comme n’importe quelle autre valeur :

```jsx
<button onClick={this.handleClick}>
```

Si vous avez besoin d'accéder au composant parent dans le gestionnaire d'événements, vous devrez lier la fonction à l'instance du composant (comme ci-dessous).

### Comment lier une fonction à l'instance d'un composant ? {#how-do-i-bind-a-function-to-a-component-instance}

Il y'a plusieurs façons de s'assurer que des fonctions ont accès aux attributs du composant comme `this.props` et `this.state`, qui dépendent de la syntaxe et de l’outillage éventuel que vous utilisez.

#### Lier la fonction dans le constructeur (ES2015) {#bind-in-constructor-es2015}

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
    return <button onClick={this.handleClick}>Cliquez ici</button>;
  }
}
```

#### Propriété de classe (proposition stade 3) {#class-properties-stage-3-proposal}

```jsx
class Foo extends Component {
  // Remarque : cette syntaxe est expérimentale et n'est pas encore standardisée
  handleClick = () => {
    console.log('Cliqué');
  }
  render() {
    return <button onClick={this.handleClick}>Cliquez ici</button>;
  }
}
```

#### Lier dans la méthode `render` {#bind-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Cliqué');
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>Cliquez ici</button>;
  }
}
```

>Remarque
>
>Utiliser `Function.prototype.bind` dans la méthode `render` crée une nouvelle fonction à chaque fois que le composant est affiché, ce qui peut impacter négativement les performances (voir plus bas).

#### Fonction fléchée dans le rendu {#arrow-function-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Cliqué');
  }
  render() {
    return <button onClick={() => this.handleClick()}>Cliquez ici</button>;
  }
}
```

>Remarque
>
>Utiliser une fonction fléchée dans la fonction de rendu crée une nouvelle fonction à chaque fois que le composant est affiché, ce qui peut impacter négativement les optimisations basées sur une comparaison stricte d'identité.

### Est-il acceptable d'utiliser une fonction fléchée à l’intérieur de la méthode `render` ? {#is-it-ok-to-use-arrow-functions-in-render-methods}

C'est généralement acceptable, et c'est souvent la façon la plus facile de passer des arguments à une fonction de rappel.

Si vous avez des problèmes de performances, n’hésitez pas à optimiser !

### Pourquoi est-il parfois nécessaire de lier une fonction ? {#why-is-binding-necessary-at-all}

En JavaScript, ces deux extraits de code ne sont **pas** équivalents :

```js
obj.method();
```

```js
var method = obj.method;
method();
```

Lier les méthodes permet de s'assurer que le deuxième extrait de code fonctionne de la même manière que le premier.

Avec React, vous n’avez généralement besoin de lier que les méthodes que vous *passez* à d'autres composants. Par exemple, `<button onClick={this.handleClick}>` passe `this.handleClick`, vous devez donc la lier. Cependant, il n'est pas nécessaire de lier la méthode `render` ou les méthodes de cycle de vie : on ne les passe pas à d'autres composants.

[Cet article de Yehuda Katz](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/) (en anglais) explique en détail ce qu'est la liaison de méthode et comment les fonctions marchent en JavaScript.

### Pourquoi ma fonction est appelée à chaque affichage du composant ? {#why-is-my-function-being-called-every-time-the-component-renders}

Vérifiez que vous _n'appelez pas la fonction_ en la passant au composant :

```jsx
render() {
  // Erroné : handleClick est appelée au lieu d'être passée par référence !
  return <button onClick={this.handleClick()}>Cliquez ici</button>
}
```

Au lieu de ça, *passez la fonction* (sans les parenthèses) :

```jsx
render() {
  // Correct : handleClick est passée par référence !
  return <button onClick={this.handleClick}>Cliquez ici</button>
}
```

### Comment passer un argument à un gestionnaire d'événements ou une fonction de rappel ? {#how-do-i-pass-a-parameter-to-an-event-handler-or-callback}

Vous pouvez utiliser une fonction fléchée pour enrober un gestionnaire d'événements et lui passer des arguments :

```jsx
<button onClick={() => this.handleClick(id)} />
```

Le code ci-dessous est équivalent à une utilisation de `.bind` :

```jsx
<button onClick={this.handleClick.bind(this, id)} />
```

#### Exemple : passer des arguments en utilisant une fonction fléchée {#example-passing-params-using-arrow-functions}

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
        Cliqué : {this.state.justClicked}
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

#### Exemple : passer des arguments en utilisant des attributs `data-*` {#example-passing-params-using-data-attributes}

Une autre approche consiste à utiliser des API DOM pour stocker les données nécessaires aux gestionnaires d'événements. Pensez-y si vous avez besoin d'optimiser un grand nombre d'éléments ou si vous avez des composants basés sur `React.PureComponent`.

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

  handleClick(e) {
    this.setState({
      justClicked: e.target.dataset.letter
    });
  }

  render() {
    return (
      <div>
        Cliqué : {this.state.justClicked}
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

### Comment éviter qu'une fonction soit appelée trop tôt ou trop souvent ? {#how-can-i-prevent-a-function-from-being-called-too-quickly-or-too-many-times-in-a-row}

Si vous avez un gestionnaire d'événements comme `onClick` ou `onScroll` et que vous voulez éviter que la fonction de rappel soit appelée trop fréquemment, vous pouvez limiter sa fréquence d‘exécution. Vous pouvez le faire en utilisant :

- **le _throttling_** : limitation de la fréquence de déclenchement (exemple : [`_.throttle`](https://lodash.com/docs#throttle))
- **le _debouncing_** : application des modifications après une période d'inactivité (exemple : [`_.debounce`](https://lodash.com/docs#debounce))
- **le _throttling_ basé sur `requestAnimationFrame`** : limitation de la fréquence de déclenchement grâce à [`requestAnimationFrame`](https://developer.mozilla.org/fr/docs/Web/API/Window/requestAnimationFrame) (exemple : [`raf-schd`](https://github.com/alexreardon/raf-schd))

Jetez un coup d'œil à [cette visualisation](http://demo.nimius.net/debounce_throttle/) pour une comparaison intuitive des fonctions `throttle` et `debounce`.

> Remarque
>
> `_.debounce`, `_.throttle` et `raf-schd` fournissent une méthode `cancel` pour annuler l'appel à la fonction de rappel différée. Il est recommandé d'appeler cette méthode dans `componentWillUnmount` _ou_ de s'assurer dans la fonction différée que le composant est toujours monté.


#### Throttle {#throttle}

Le _throttling_ évite qu'une fonction soit appelée plus d'une fois dans un certain laps de temps. L'exemple ci-dessous limite le gestionnaire d'événements de clic pour éviter qu'il soit appelé plus d'une fois par seconde.

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
    return <button onClick={this.handleClickThrottled}>Charger la suite</button>;
  }

  handleClick() {
    this.props.loadMore();
  }
}
```

#### Debounce {#debounce}

Le _debouncing_ garantit qu'une fonction ne sera appelée qu'après qu‘un certain temps a passé depuis le dernier appel à cette fonction : on garantit un intervalle minimal entre deux exécutions. Ça peut être utile quand vous avez un calcul complexe à faire en réponse à un événement susceptible d’être déclenché fréquemment (comme le défilement d'une page ou les frappes au clavier). L'exemple ci-dessous utilise cette méthode sur un champ texte avec un délai de 250 ms.

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
    // React recycle les événements, on a donc besoin de lire la valeur avant le différé.
    // On aurait aussi pu appeler `event.persist()` et passer l’événement complet.
    // Pour en apprendre davantage, consultez fr.reactjs.org/docs/events.html#event-pooling
    this.emitChangeDebounced(e.target.value);
  }

  emitChange(value) {
    this.props.onChange(value);
  }
}
```

#### _Throttling_ basé sur `requestAnimationFrame` {#requestanimationframe-throttling}

[`requestAnimationFrame`](https://developer.mozilla.org/fr/docs/Web/API/Window/requestAnimationFrame) permet de différer une fonction pour qu'elle soit exécutée par le navigateur à un moment optimal pour les performances d'affichage. Une fonction différée avec `requestAnimationFrame` sera exécutée à la prochaine passe d'affichage *(frame, NdT)*. Le navigateur fera de son mieux pour qu'il y ait toujours 60 passes par seconde (60 fps). Cependant, si le navigateur n’y arrive pas, il _limitera_ naturellement le nombre de passes par seconde. Par exemple, un appareil pourrait n'être capable d'afficher que 30 fps, vous n'obtiendrez donc que 30 passes par seconde. Utiliser `requestAnimationFrame` pour limiter l’exécution est une technique pratique afin d'éviter de faire plus de 60 mises à jour par seconde. Si vous faites 100 mises à jour en une seconde, vous créez une charge de travail supplémentaire pour le navigateur que l'utilisateur ne pourra de toutes façons pas voir.

>Remarque
>
>Utiliser cette technique ne capturera que la dernière valeur publiée à chaque passe. Vous pouvez voir un exemple du fonctionnement de cette optimisation sur le [`MDN`](https://developer.mozilla.org/fr/docs/Web/Events/scroll).

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
    // Quand on reçoit un événement de défilement de la page, planifier une mise à jour.
    // Si on reçoit plusieurs mises à jour dans la même passe, on ne publiera que la
    // dernière valeur.
    this.scheduleUpdate({ x: e.clientX, y: e.clientY });
  }

  componentWillUnmount() {
    // Annule toute mise à jour en attente puisqu’on démonte le composant
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

#### Tester votre limitation de fréquence {#testing-your-rate-limiting}

Afin de tester que votre code de limitation de fréquence fonctionne correctement, il est utile de pouvoir manipuler le temps. Si vous utilisez [`jest`](https://facebook.github.io/jest/), vous pouvez utiliser les [fausses horloges](https://facebook.github.io/jest/docs/en/timer-mocks.html) *(mock timers, NdT)* pour accélérer le temps. Si vous utilisez `requestAnimationFrame`, vous pouvez utiliser [`raf-stub`](https://github.com/alexreardon/raf-stub) afin de contrôler la progression des passes d'animation.
