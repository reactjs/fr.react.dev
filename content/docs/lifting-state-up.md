---
id: lifting-state-up
title: Lifting State Up
permalink: docs/lifting-state-up.html
prev: forms.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

Plusieurs composants ont souvent besoin de refléter les mêmes données dynamiques. Nous recommandons de remonter l'état dans l'ancêtre commun le plus proche. Voyons comment ça marche.

Dans cette section, nous allons créer un calculateur de température qui détermine si l'eau bout à une température donnée.

Commençons avec un composant appelé `BoilingVerdict`. Il acceptte un prop `celsius` contenant la température, et affiche si c'est assez pour fair bouillir de l'eau :

```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>L'eau bout.</p>;
  }
  return <p>L'eau ne bout pas.</p>;
}
```

Ensuite, nous allons créer un composant appeler `Calculator`. Il affiche un `<input>` et permet d'entrer une température, gardant sa valeur dans `this.state.temperature`.

De plus, il affiche le `BoilingVerdict` pour la température entrée.

```js{5,9,13,17-21}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>Entrez la température en Celsius:</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(temperature)} />
      </fieldset>
    );
  }
}
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/ZXeOBm?editors=0010)

## Ajouter une Deuxième Entrée {#adding-a-second-input}

Notre nouvelle contrainte est que, en plus d'une entrée en Celsius, on peut fournir une entrée en Fahrenheit, et synchroniser les deux valeurs.

On peut commencer en extrayant un composant `TemperatureInput`. Ajoutons un prop `scale` qui peut être soit `"c"`, soit `"f"` :

```js{1-4,19,22}
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Entrez la température en {scaleNames[scale]} :</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

On peut changer le composant `Calculator` pour afficher deux entrées de température :

```js{5,6}
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/jGBryx?editors=0010)

Nous avons maintenant deux entrées, mais quand vous entrez la température dans un des deux, l'autre ne se met pas à jour. Nous avons besoin de les garder synchronisés.

De plus, nous ne pouvons pas afficher `BoilingVerdict` depuis `Calculator`. Le composant `Calculator` n'a pas accès à la température entrée car elle est cachée dans `TemperatureInput`.

## Écrire une Fonction de Conversion {#writing-conversion-functions}

D'abord, écrivons deux fonctions pour convertir de Celsius à Fahrenheit et vis-versa :

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

Ces deux fonctions convertissent des nombres. Écrivons une autre fonction qui prend en argument une chaîne de caractères de `temperature` et une fonction de conversion, et qui renvoie une chaîne de caractères. Nous utiliserons cette fonction pour calculer la valeur d'un champ en fonction de l'autre.

Elle retourne une chaîne de caractères vide pour une `temperature` incorrecte, et arrondit la valeur de retour à trois décimales :

```js
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

Par exemple, `tryConvert('abc', toCelsius)` retourne une chaîne de caractères vide, et `tryConvert('10.22', toFahrenheit)` retourne `'50.396'`.

## Remonter l'Étatt {#lifting-state-up}

Pour l'instant, les deux éléments `TemperatureInput` gardent leur propre état local indépendamment de l'autre :

```js{5,9,13}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    // ...  
```

Cependant, nous voulons que les deux entrées soient synchronisées. Quand on met à jour l'entrée en Celsius, celle en Fahrenheit doit refléter la température convertie, ete vice versa.

Avec React, partager l'état est possible en le déplaçant dans le plus proche ancêtre commun. On appelle ça "remonter l'état". Nous allons supprimer l'état local de `TemperatureInput` et le déplacer dans le composant `Calculator`.

Si le composant `Calculator` gère l'état, il devient la «source de vérité » pour la température des deux entrées. Il peut leur donner leur valeur afin qu'ils soient synchronisés. Comme le prop des deux composants `TemperatureInput` viennent du même composant parent `Calculator`, les deux entrées seront toujours synchronisées.

Voyons comment ça marche étape par étape.

D'abord, on remplate `this.state.temperature` par `this.props.temperature` dans le composant `TemperatureInput`. Maintenant, imaginons que `this.props.temperature` existe déjà, bien qu'on va devoir le passer depuis `Calculator` plus tard :

```js{3}
  render() {
    // Avant : const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

On sait que [les props sont en lecture seule](/docs/components-and-props.html#props-are-read-only). Quand la `temperature` étant dans l'état local, le composant `TemperatureInput` pouvait juste appeler `this.setState()` pour le changer. Cependant, maintenant que `temperature` vient du parent par un prop, le composant `TemperatureInput` n'a pas de contrôle dessus.

Avec React, on gère généralement ça en rendant le composant « contrôlé ». Comme un élément DOM `<input>` qui il accepte un prop `value` et un `onChange`, notre `TemperatureInput` accepte `temperature` et `onTemperatureChange` dans les props depuis son parent, `Calculator`.

Maintenant, quand le composant `TemperatureInput` veut mettre à jour la température, il appelle `this.props.onTemperatureChange`.

```js{3}
  handleChange(e) {
    // Avant: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

>Note :
>
>There is no special meaning to either `temperature` or `onTemperatureChange` prop names in custom components. We could have called them anything else, like name them `value` and `onChange` which is a common convention.

The `onTemperatureChange` prop will be provided together with the `temperature` prop by the parent `Calculator` component. It will handle the change by modifying its own local state, thus re-rendering both inputs with the new values. We will look at the new `Calculator` implementation very soon.

Before diving into the changes in the `Calculator`, let's recap our changes to the `TemperatureInput` component. We have removed the local state from it, and instead of reading `this.state.temperature`, we now read `this.props.temperature`. Instead of calling `this.setState()` when we want to make a change, we now call `this.props.onTemperatureChange()`, which will be provided by the `Calculator`:

```js{8,12}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Now let's turn to the `Calculator` component.

We will store the current input's `temperature` and `scale` in its local state. This is the state we "lifted up" from the inputs, and it will serve as the "source of truth" for both of them. It is the minimal representation of all the data we need to know in order to render both inputs.

For example, if we enter 37 into the Celsius input, the state of the `Calculator` component will be:

```js
{
  temperature: '37',
  scale: 'c'
}
```

If we later edit the Fahrenheit field to be 212, the state of the `Calculator` will be:

```js
{
  temperature: '212',
  scale: 'f'
}
```

We could have stored the value of both inputs but it turns out to be unnecessary. It is enough to store the value of the most recently changed input, and the scale that it represents. We can then infer the value of the other input based on the current `temperature` and `scale` alone.

The inputs stay in sync because their values are computed from the same state:

```js{6,10,14,18-21,27-28,31-32,34}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/WZpxpz?editors=0010)

Now, no matter which input you edit, `this.state.temperature` and `this.state.scale` in the `Calculator` get updated. One of the inputs gets the value as is, so any user input is preserved, and the other input value is always recalculated based on it.

Let's recap what happens when you edit an input:

* React calls the function specified as `onChange` on the DOM `<input>`. In our case, this is the `handleChange` method in the `TemperatureInput` component.
* The `handleChange` method in the `TemperatureInput` component calls `this.props.onTemperatureChange()` with the new desired value. Its props, including `onTemperatureChange`, were provided by its parent component, the `Calculator`.
* When it previously rendered, the `Calculator` has specified that `onTemperatureChange` of the Celsius `TemperatureInput` is the `Calculator`'s `handleCelsiusChange` method, and `onTemperatureChange` of the Fahrenheit `TemperatureInput` is the `Calculator`'s `handleFahrenheitChange` method. So either of these two `Calculator` methods gets called depending on which input we edited.
* Inside these methods, the `Calculator` component asks React to re-render itself by calling `this.setState()` with the new input value and the current scale of the input we just edited.
* React calls the `Calculator` component's `render` method to learn what the UI should look like. The values of both inputs are recomputed based on the current temperature and the active scale. The temperature conversion is performed here.
* React calls the `render` methods of the individual `TemperatureInput` components with their new props specified by the `Calculator`. It learns what their UI should look like.
* React calls the `render` method of the `BoilingVerdict` component, passing the temperature in Celsius as its props.
* React DOM updates the DOM with the boiling verdict and to match the desired input values. The input we just edited receives its current value, and the other input is updated to the temperature after conversion.

Every update goes through the same steps so the inputs stay in sync.

## Lessons Learned {#lessons-learned}

There should be a single "source of truth" for any data that changes in a React application. Usually, the state is first added to the component that needs it for rendering. Then, if other components also need it, you can lift it up to their closest common ancestor. Instead of trying to sync the state between different components, you should rely on the [top-down data flow](/docs/state-and-lifecycle.html#the-data-flows-down).

Lifting state involves writing more "boilerplate" code than two-way binding approaches, but as a benefit, it takes less work to find and isolate bugs. Since any state "lives" in some component and that component alone can change it, the surface area for bugs is greatly reduced. Additionally, you can implement any custom logic to reject or transform user input.

If something can be derived from either props or state, it probably shouldn't be in the state. For example, instead of storing both `celsiusValue` and `fahrenheitValue`, we store just the last edited `temperature` and its `scale`. The value of the other input can always be calculated from them in the `render()` method. This lets us clear or apply rounding to the other field without losing any precision in the user input.

When you see something wrong in the UI, you can use [React Developer Tools](https://github.com/facebook/react-devtools) to inspect the props and move up the tree until you find the component responsible for updating the state. This lets you trace the bugs to their source:

<img src="../images/docs/react-devtools-state.gif" alt="Monitoring State in React DevTools" max-width="100%" height="100%">

