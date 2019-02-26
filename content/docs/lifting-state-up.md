---
id: lifting-state-up
title: Remonter l'état
permalink: docs/lifting-state-up.html
prev: forms.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

Plusieurs composants ont souvent besoin de refléter les mêmes données dynamiques. Nous recommandons de remonter l'état dans l'ancêtre commun le plus proche. Voyons comment ça marche.

Dans cette section, nous allons créer un calculateur de température qui détermine si l'eau bout à une température donnée.

Commençons avec un composant appelé `BoilingVerdict`. Il accepte une prop `celsius` contenant la température, et il affiche si c'est suffisant pour faire bouillir de l'eau :

```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>L'eau bout.</p>;
  }
  return <p>L'eau ne bout pas.</p>;
}
```

Ensuite, nous allons créer un composant appelé `Calculator`. Il affiche un `<input>` qui permet d'entrer une température et de garder sa valeur dans `this.state.temperature`.

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

[**Essayez sur CodePen**](https://codepen.io/gaearon/pen/ZXeOBm?editors=0010)

## Ajouter une Deuxième Entrée {#adding-a-second-input}

Notre nouvelle contrainte est que, en plus d'une entrée en Celsius, on peut fournir une entrée en Fahrenheit, et synchroniser les deux valeurs.

On peut commencer par extraire un composant `TemperatureInput` du code de `Calculator`. Ajoutons une prop `scale` qui peut être soit `"c"`, soit `"f"` :

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

On peut à présent changer le composant `Calculator` pour afficher deux entrées de température :

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

[**Essayez sur CodePen**](https://codepen.io/gaearon/pen/jGBryx?editors=0010)

Nous avons maintenant deux entrées, mais quand vous saisissez la température dans une des deux, l'autre ne se met pas à jour. Nous avons besoin de les garder synchronisés.

De plus, nous ne pouvons pas afficher `BoilingVerdict` depuis `Calculator`. Le composant `Calculator` n'a pas accès à la température entrée car elle est cachée dans `TemperatureInput`.

## Écrire une Fonction de Conversion {#writing-conversion-functions}

D'abord, écrivons deux fonctions pour convertir de Celsius à Fahrenheit et vice-versa :

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

## Remonter l'État {#lifting-state-up}

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

Cependant, nous voulons que les deux entrées soient synchronisées. Quand on met à jour l'entrée en Celsius, celle en Fahrenheit doit refléter la température convertie, et vice-versa.

Avec React, partager l'état est possible en le déplaçant dans le plus proche ancêtre commun. On appelle ça « remonter l'état ». Nous allons supprimer l'état local de `TemperatureInput` et le déplacer dans le composant `Calculator`.

Si le composant `Calculator` gère l'état, il devient la « source de vérité » pour la température des deux entrées. Il peut leur donner leur valeur afin qu'ils soient synchronisés. Comme les props des deux composants `TemperatureInput` viennent du même composant parent `Calculator`, les deux entrées seront toujours synchronisées.

Voyons comment ça marche étape par étape.

D'abord, on remplace `this.state.temperature` par `this.props.temperature` dans le composant `TemperatureInput`. Maintenant, imaginons que `this.props.temperature` existe déjà, bien qu'on va devoir le passer depuis `Calculator` plus tard :

```js{3}
  render() {
    // Avant : const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

On sait que [les props sont en lecture seule](/docs/components-and-props.html#props-are-read-only). Quand la `temperature` était dans l'état local, le composant `TemperatureInput` pouvait simplement appeler `this.setState()` pour la changer. Cependant, maintenant que `temperature` vient du parent par une prop, le composant `TemperatureInput` n'a pas de contrôle dessus.

Avec React, on gère généralement ça en rendant le composant « contrôlé ». Comme un élément DOM `<input>` qui accepte des props `value` et `onChange`, notre `TemperatureInput` accepte `temperature` et `onTemperatureChange` dans les props depuis son parent, `Calculator`.

Maintenant, quand le composant `TemperatureInput` veut mettre à jour la température, il appelle `this.props.onTemperatureChange`.

```js{3}
  handleChange(e) {
    // Avant: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

>Remarque :
>
>Il n'y a pas de sens particulier aux noms des props `temperature` et `onTemperatureChange`. On aurait pu les appeler comme on voulait, comme `value` et `onChange`, qui est une convention de nommage.

Le prop `onTemperatureChange` sera fourni dans les props par le composant parent `Calculator`, comme la prop `temperature`. Il s'occupera du changement en modifiant son état local, provocant un nouveau rendu des deux entrées avec les nouvelles valeurs. Nous allons nous pencher sur l'implémentation du nouveau composant `Calculator` très bientôt.

Avant de regarder les changements du composant `Calculator`, récapitulons nos changements au composant `TemperatureInput`. Nous en avons supprimé l'état local, et au lieu de lire `this.state.temperature`, on lit `this.props.temperature`. Au lieu d'appeler `this.setState()` quand on veut faire un changement, on appelle `this.props.onTemperatureChange()`, qui est fourni par le composant `Calculator` :

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
        <legend>Entrez la température en {scaleNames[scale]} :</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Revenons maintenant sur notre composant `Calculator`.

Nous allons stocker la valeur courante de `temperature` et de `scale` dans son état local. C'est l'état que nous avons « remonté » depuis les entrées, et il servira de « source de vérité » pour les deux entrées. C'est la représentation minimale des données dont nous avons besoin afin d'afficher les deux entrées.

Par exemple, si on entre 37 dans l'entrée en Celsius, l'état du composant `Calculator` sera :

```js
{
  temperature: '37',
  scale: 'c'
}
```

Si plus tard on change le champ Fahrenheit à 212, l'état du composant `Calculator` sera :

```js
{
  temperature: '212',
  scale: 'f'
}
```

On pourrait avoir stocké la valeur des deux entrées, mais ce n'est pas nécessaire. Stocker uniquement la valeur la plus récente et son unité est suffisant. On peut inférer la valeur de l'autre entrée à partir des valeurs de `temperature` et de `scale` stockées.

Les entrées restent synchronisées car leurs valeurs sont calculées depuis le même état :

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

[**Essayez sur CodePen**](https://codepen.io/gaearon/pen/WZpxpz?editors=0010)

Maintenant, quelle que soit l'entrée que vous modifiez, `this.state.temperature` et `this.state.scale` dans le composant `Calculator` seront mis à jour. L'une des deux entrées reçoit la valeur telle quelle, et l'autre est toujours recalculée à partir de l'état.

Récapitulons ce qui se passe quand on modifie une entrée :

* React appelle la fonction spécifiée dans l'attribut `onChange` de l'élément DOM `<input>`. Dans notre cas, c'est la méthode `handleChange` du composant `TemperatureInput`.
* La méthode `handleChange` du composant `TemperatureInput` appelle `this.props.onTemperatureChange()` avec la nouvelle valeur. Ses props, notamment `onTemperatureChange`, ont été fournies par son composant parent, `Calculator`.
* Lors du rendu précédent, le composant `Calculator` a spécifié que le prop `onTemperatureChange` du `TemperatureInput` en Celsius est la méthode `handleCelsiusChange` de `Calculator`, et la prop `onTemperatureChange` du `TemperatureInput` en Fahrenheit est la méthode `handleFahrenheitChange` de `Calculator`. Ces deux méthodes de `Calculator` sont ainsi appelées en fonction de l'entrée modifiée.
* Dans ces méthodes, le composant `Calculator` demande à React de se rafraîchir en appelant `this.setState()` avec la nouvelle valeur de l'entrée et l'unité de l'entrée modifiée.
* React appelle la méthode `render` du composant `Calculator` afin de savoir comment afficher son interface utilisateur. La valeur des deux entrées est recalculée en fonction de la température et de l'unité actuelles. La conversion de température est faite ici.
* React appelle la méthode `render` des deux composants `TemperatureInput` avec leurs nouvelles props spécifiées par le `Calculator`. React sait alors comment afficher leur interface utilisateur.
* React appelle la méthode `render` du composant `BoilingVerdict`, en lui passant la température en Celsius dans les props.
* React DOM met à jour le DOM avec le résultat correspondant à la valeur d'entrée souhaitée. L'entrée que nous venons de modifier reçoit la valeur actuelle, et l'autre entrée est mis à jour avec la température convertie.

Chaque mise à jour suit ces étapes pour que les entrées restent synchronisées.

## Leçons apprises {#lessons-learned}

Il ne doit y avoir qu'une seule « source de vérité » pour toute donnée qui change dans une application React. En générale, on donne un état aux composants qui en ont besoin pour s'afficher. Ensuite, si d'autres composants en ont également besoin, vous pouvez remonter l'état (*lift it up* NdT) à l'ancêtre commun le plus proche. Au lieu d'essayer de synchroniser des états entre différents composants, vous devriez vous baser sur des données qui se propagent [du haut vers le bas](/docs/state-and-lifecycle.html#the-data-flows-down).

Remonter l'état implique d'écrire plus de code générique (*boilerplate code*, NdT) par opposition à une liaison bidirectionnel, mais ça demande moins de travail pour trouver et isoler les bugs. Puisque tout état « vit » dans un composant et que seul ce composant peut le changer, les possibilités de bugs sont grandement réduites. De plus, vous pouvez implémenter n'importe quelle logique supplémentaire pour rejeter ou transformer la saisie des utilisateurs.

Si quelque chose peut être dérivé des props ou de l'état, cette chose ne devrait probablement pas être dans l'état. Par exemple, plutôt que de stocker à la fois `celsiusValue` et `fahrenheitValue`, on stock uniquement la dernière `temperature` modifiée et son unité `scale`. La valeur de l'autre entrée peut toujours être calculée dans la méthode `render()` à partir de la valeur de l'autre entrée. Ça nous permet de nettoyer ou arrondir la valeur des autres champs sans perdre de précision sur la valeur entrée par l'utilisateur.

Quand vous voyez quelque chose qui ne va pas dans l'interface utilisateur, vous pouvez utiliser les [outils de développement React](https://github.com/facebook/react-devtools) pour inspecter les props et vous déplacer dans l'arborescence des composants jusqu'à trouver le composant responsable de la mise à jour de l'état. Ça vous permet de remonter à la source des bugs :

<img src="../images/docs/react-devtools-state.gif" alt="Monitoring State in React DevTools" max-width="100%" height="100%">

