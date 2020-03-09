---
id: lifting-state-up
title: Faire remonter l'état
permalink: docs/lifting-state-up.html
prev: forms.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

Plusieurs composants ont souvent besoin de refléter les mêmes données dynamiques. Nous conseillons de faire remonter l'état partagé dans leur ancêtre commun le plus proche. Voyons comment ça marche.

Dans cette section, nous allons créer un calculateur de température qui détermine si l'eau bout à une température donnée.

Commençons par un composant appelé `BoilingVerdict`. Il accepte une prop `celsius` pour la température, et il affiche si elle est suffisante pour faire bouillir l'eau :

```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>L'eau bout.</p>;
  }
  return <p>L'eau ne bout pas.</p>;
}
```

Ensuite, nous allons créer un composant appelé `Calculator`. Il affiche un `<input>` qui permet de saisir une température et de conserver sa valeur dans `this.state.temperature`.

Par ailleurs, il affiche le `BoilingVerdict` pour la température saisie.

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
        <legend>Saisissez la température en Celsius :</legend>
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

## Ajouter un deuxième champ {#adding-a-second-input}

Il nous faut à présent proposer, en plus d'une saisie en Celsius, une saisie en Fahrenheit, les deux devant rester synchronisées.

On peut commencer par extraire un composant `TemperatureInput` du code de `Calculator`. Ajoutons-y une prop `scale` qui pourra être soit `"c"`, soit `"f"` :

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
        <legend>Saisissez la température en {scaleNames[scale]} :</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Nous pouvons désormais modifier le composant `Calculator` pour afficher deux saisies de température :

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

Nous avons maintenant deux champs de saisie, mais lorsque vous saisissez la température dans un des deux, l'autre ne se met pas à jour. Nous avons besoin de les garder synchronisés.

Qui plus est, nous ne pouvons pas afficher le `BoilingVerdict` depuis `Calculator`. Le composant `Calculator` n'a pas accès à la température saisie, car elle est cachée dans le `TemperatureInput`.

## Écrire des fonctions de conversion {#writing-conversion-functions}

D'abord, écrivons deux fonctions pour convertir de Celsius à Fahrenheit et réciproquement :

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

Ces deux fonctions convertissent des nombres. Écrivons une autre fonction qui prend en arguments une chaîne de caractères `temperature` et une fonction de conversion, et qui renvoie une chaîne. Nous utiliserons cette nouvelle fonction pour calculer la valeur d'un champ en fonction de l'autre.

Elle renvoie une chaîne vide pour une `temperature` incorrecte, et arrondit la valeur de retour à trois décimales :

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

Par exemple, `tryConvert('abc', toCelsius)` renvoie une chaîne vide, et `tryConvert('10.22', toFahrenheit)` renvoie `'50.396'`.

## Faire remonter l'état {#lifting-state-up}

Pour l'instant, les deux éléments `TemperatureInput` conservent leur propre état local indépendamment l’un de l'autre :

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

Cependant, nous voulons que les deux champs soient synchronisés. Lorsqu’on modifie le champ en Celsius, celui en Fahrenheit doit refléter la température convertie, et réciproquement.

Avec React, partager l'état est possible en le déplaçant dans le plus proche ancêtre commun. On appelle ça « faire remonter l'état ». Nous allons supprimer l'état local de `TemperatureInput` et le déplacer dans le composant `Calculator`.

Si le composant `Calculator` est responsable de l'état partagé, il devient la « source de vérité » pour la température des deux champs. Il peut leur fournir des valeurs qui soient cohérentes l’une avec l’autre. Comme les props des deux composants `TemperatureInput` viennent du même composant parent `Calculator`, les deux champs seront toujours synchronisés.

Voyons comment ça marche étape par étape.

D'abord, remplaçons `this.state.temperature` par `this.props.temperature` dans le composant `TemperatureInput`. Pour le moment, faisons comme si `this.props.temperature` existait déjà, même si nous allons devoir la passer depuis `Calculator` plus tard :

```js{3}
  render() {
    // Avant : const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

On sait que [les props sont en lecture seule](/docs/components-and-props.html#props-are-read-only). Quand la `temperature` était dans l'état local, le composant `TemperatureInput` pouvait simplement appeler `this.setState()` pour la changer. Cependant, maintenant que `temperature` vient du parent par une prop, le composant `TemperatureInput` n'a pas le contrôle dessus.

Avec React, on gère généralement ça en rendant le composant « contrôlé ». Tout comme un élément DOM `<input>` accepte des props `value` et `onChange`, notre `TemperatureInput` peut accepter des props `temperature` et `onTemperatureChange` fournies par son parent `Calculator`.

Maintenant, quand le composant `TemperatureInput` veut mettre à jour la température, il appelle `this.props.onTemperatureChange` :

```js{3}
  handleChange(e) {
    // Avant : this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

>Remarque
>
>Les noms de props `temperature` et `onTemperatureChange` n’ont pas de sens particulier. On aurait pu les appeler n’importe comment, par exemple `value` et `onChange`, qui constituent une convention de nommage répandue.

La prop `onTemperatureChange` sera fournie par le composant parent `Calculator`, tout comme la prop `temperature`. Elle s'occupera du changement en modifiant son propre état local, entraînant un nouvel affichage des deux champs avec leurs nouvelles valeurs. Nous allons nous pencher très bientôt sur l'implémentation du nouveau composant `Calculator`.

Avant de modifier le composant `Calculator`, récapitulons les modifications apportées au composant `TemperatureInput`. Nous en avons retiré l'état local, et nous lisons désormais `this.props.temperature` au lieu de `this.state.temperature`. Plutôt que d'appeler `this.setState()` quand on veut faire un changement, on appelle désormais `this.props.onTemperatureChange()`, qui est fournie par le `Calculator` :

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
        <legend>Saisissez la température en {scaleNames[scale]} :</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Intéressons-nous maintenant au composant `Calculator`.

Nous allons stocker la valeur courante de `temperature` et de `scale` dans son état local. C'est l'état que nous avons « remonté » depuis les champs, et il servira de « source de vérité » pour eux deux. C'est la représentation minimale des données dont nous avons besoin afin d'afficher les deux champs.

Par exemple, si on saisit 37 dans le champ en Celsius, l'état local du composant `Calculator` sera :

```js
{
  temperature: '37',
  scale: 'c'
}
```

Si plus tard on change le champ Fahrenheit à 212, l'état local du composant `Calculator` sera :

```js
{
  temperature: '212',
  scale: 'f'
}
```

On pourrait avoir stocké les valeurs des deux champs, mais en fait ce n'est pas nécessaire. Stocker uniquement la valeur la plus récente et son unité s’avère suffisant. On peut déduire la valeur de l'autre champ rien qu’à partir des valeurs de `temperature` et de `scale` stockées.

Les champs restent synchronisés car leurs valeurs sont calculées depuis le même état :

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

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/WZpxpz?editors=0010)

Désormais, quel que soit le champ que vous modifiez, `this.state.temperature` et `this.state.scale` seront mis à jour au sein du composant `Calculator`. L'un des deux champ recevra la valeur telle quelle, et l'autre valeur de champ sera toujours recalculée à partir de la valeur modifiée.

Récapitulons ce qui se passe quand on change la valeur d’un champ :

* React appelle la fonction spécifiée dans l'attribut `onChange` de l'élément DOM `<input>`. Dans notre cas, c'est la méthode `handleChange` du composant `TemperatureInput`.
* La méthode `handleChange` du composant `TemperatureInput` appelle `this.props.onTemperatureChange()` avec la nouvelle valeur. Ses props, notamment `onTemperatureChange`, ont été fournies par son composant parent, `Calculator`.
* Au dernier affichage en date, le composant `Calculator` avait passé la méthode `handleCelsiusChange` de `Calculator` comme prop `onTemperatureChange` du `TemperatureInput`  en Celsius, et la méthode `handleFahrenheitChange` de `Calculator` comme prop `onTemperatureChange` du `TemperatureInput` en Fahrenheit. L’une ou l’autre de ces méthodes de `Calculator` sera ainsi appelée en fonction du champ modifié.
* Dans ces méthodes, le composant `Calculator` demande à React de le rafraîchir en appelant `this.setState()` avec la nouvelle valeur du champ et l'unité du champ modifié.
* React appelle la méthode `render` du composant `Calculator` afin de savoir à quoi devrait ressembler son UI. Les valeurs des deux champs sont recalculées en fonction de la température actuelle et de l'unité active. La conversion de température est faite ici.
* React appelle les méthodes `render` des deux composants `TemperatureInput` avec leurs nouvelles props, spécifiées par le `Calculator`. React sait alors à quoi devraient ressembler leurs UI.
* React appelle la méthode `render` du composant `BoilingVerdict`, en lui passant la température en Celsius dans les props.
* React DOM met à jour le DOM avec le verdict d'ébullition, et retranscrit les valeurs de champs souhaitées. Le champ que nous venons de modifier reçoit sa valeur actuelle, et l'autre champ est mis à jour avec la température convertie.

Chaque mise à jour suit ces mêmes étapes, ainsi les champs restent synchronisés.

## Ce qu’il faut retenir {#lessons-learned}

Il ne doit y avoir qu'une seule « source de vérité » pour toute donnée qui change dans une application React. En général, l’état est d’abord ajouté au composant qui en a besoin pour s'afficher. Ensuite, si d'autres composants en ont également besoin, vous pouvez faire remonter l'état dans l'ancêtre commun le plus proche. Au lieu d'essayer de synchroniser les états de différents composants, vous devriez vous baser sur des données qui se propagent [du haut vers le bas](/docs/state-and-lifecycle.html#the-data-flows-down).

Faire remonter l'état implique d'écrire plus de code générique *(boilerplate code, NdT)* qu’avec une liaison de données bidirectionnelle, mais le jeu en vaut la chandelle, car ça demande moins de travail pour trouver et isoler les bugs. Puisque tout état « vit » dans un composant et que seul ce composant peut le changer, la surface d’impact des bugs est grandement réduite. Qui plus est, vous pouvez implémenter n'importe quelle logique personnalisée pour rejeter ou transformer les saisies des utilisateurs.

Si quelque chose peut être dérivé des props ou de l'état, cette chose ne devrait probablement pas figurer dans l'état. Par exemple, plutôt que de stocker à la fois `celsiusValue` et `fahrenheitValue`, on stocke uniquement la dernière `temperature` modifiée et son unité `scale`. La valeur de l'autre champ peut toujours être calculée dans la méthode `render()` à partir de la valeur de ces données. Ça nous permet de vider ou d’arrondir la valeur de l’autre champ sans perdre la valeur saisie par l'utilisateur.

Quand vous voyez quelque chose qui ne va pas dans l'UI, vous pouvez utiliser les [outils de développement React](https://github.com/facebook/react/tree/master/packages/react-devtools) pour examiner les props et remonter dans l'arborescence des composants jusqu'à trouver le composant responsable de la mise à jour de l'état. Ça vous permet de remonter à la source des bugs :

<img src="../images/docs/react-devtools-state.gif" alt="Monitoring State in React DevTools" max-width="100%" height="100%">

