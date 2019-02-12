---
id: forms
title: Formulaires
permalink: docs/forms.html
prev: lists-and-keys.html
next: lifting-state-up.html
redirect_from:
  - "tips/controlled-input-null-value.html"
  - "docs/forms-zh-CN.html"
---

Les formulaires HTML fonctionnent un peu différemment des autres éléments du DOM en React car ils possèdent naturellement un état interne. Par exemple, ce formulaire en HTML qui accepte seulement un nom :

```html
<form>
  <label>
    Nom :
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Envoyer" />
</form>
```

Ce formulaire a le comportement classique d'un formulaire HTML et redirige sur une nouvelle page quand l'utilisateur le soumet. Si vous souhaitez ce comportement en React, cela fonctionne déjà. Cependant dans la plupart des cas, il est pratique de gérer la soumission avec une fonction JavaScript qui accède aux données soumises par l'utilisateur. La manière classique de faire est d'utiliser les composants contrôlés.

## Composants Controlés {#controlled-components}

En HTML, les éléments de formulaire tels que `<input>`, `<textarea>`, et `<select>` maintiennent généralement leur propre état et se mettent à jour par rapport aux entrées utilisateur. En React, l'état modifiable est généralement sauvegardé dans la propriété `state` des composants et seulement mis à jour avec [`setState()`](/docs/react-component.html#setstate).

On peut combiner ces deux concepts en utilisant l'état React comme "source unique de vérité". Ainsi le composant React qui rend le formulaire contrôle aussi son comportement par rapport aux entrées utilisateur. Un élément `input` dont l'état est contrôlé par React est appelé un « composant contrôlé ».

Par exemple, en reprenant l'ancien exemple pour afficher le nom lors de la soumission, on peut écrire le formulaire en composant connecté :

```javascript{4,10-12,24}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Le nom a été soumis : ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Nom :
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Envoyer" />
      </form>
    );
  }
}
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/VmmPgp?editors=0010)

Maintenant que l'attribut `value` est utilisé sur notre élément de formulaire, la valeur affichée sera toujours `this.state.value`, plaçant ainsi l'état React comme source unique de vérité. Puisque `handleChange` est lancé a chaque entrée pour mettre a jour l'état React, la valeur affichée sera mise à jour en conséquence en même temps que l'utilisateur écrit.

Avec un composant contrôlé, chaque changement de l'état aura une fonction associée. Ça permet de modifier ou valider une entrée utilisateur en temps réel. Par exemple, si l'on veut forcer que les noms soient écris en majuscule, on peut écrire `handleChange`de la manière suivante :

```javascript{2}
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
```

## La balise Textarea {#the-textarea-tag}

En HTML, une balise `<textarea>` définit son texte via ses enfants :

```html
<textarea>
  Bonjour, c'est du texte dans un textarea
</textarea>
```

En React, un `<textarea>` utilise l'attribut `value` à la place. Du coup, un formulaire utilisant un `<textarea>` peut être écrit d'une manière similaire a un formulaire avec un seul élément `<input>`.

```javascript{4-6,12-14,26}
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Écrivez un essai à propos de votre élément du DOM favoris'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Un essai a été envoyé : ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Envoyer" />
      </form>
    );
  }
}
```

Remarquez que `this.state.value` est initialisé dans le constructeur, permettant que le textarea démarre avec du texte à l'intérieur.

## La balise Select {#the-select-tag}

En HTML, `<select>` créé une liste déroulante. Par exemple, ce HTML créé une liste déroulante de fruits.

```html
<select>
  <option value="pamplemousse">Pamplemousse</option>
  <option value="citron">Citron</option>
  <option selected value="noixcoco">Noix de coco</option>
  <option value="mangue">Mangue</option>
</select>
```

Notez que l'option Noix de coco est sélectionnée au départ, grâce à l'attribut `selected`. React, au lieu d'utiliser l'attribut `selected`, utilise un attribut `value` à la racine de la balise `select`. Ceci est plus approprié dans un composant contrôlé car vous avez seulement à mettre à jour à un seul endroit. Par exemple :

```javascript{4,10-12,24}
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'Noix de coco'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Votre fruit favoris est : ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Choisissez votre fruit favoris :
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="pamplemousse">Pamplemousse</option>
            <option value="citron">Citron</option>
            <option selected value="noixcoco">Noix de coco</option>
            <option value="mangue">Mangue</option>
          </select>
        </label>
        <input type="submit" value="Envoyer" />
      </form>
    );
  }
}
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/JbbEzX?editors=0010)

Globalement, ça permet aux balises `<input type="text">`, `<textarea>`, et `<select>` de fonctionner de manière similaire - ils acceptent tous un attribut `value` que vous pouvez utiliser pour implémenter un composant contrôlé.

> Note
>
> Vous pouvez passer un tableau pour l'attribut `value`, permettant de sélectionner plusieurs valeurs dans un élément `select` :
>
>```js
><select multiple={true} value={['B', 'C']}>
>```

## La balise input file {#the-file-input-tag}

En HTML, un `<input type="file">` permet à un utilisateur de sélectionner un ou plusieurs fichiers depuis son appareil et de les uploader vers un serveur via un formulaire ou grâce à du code JavaScript via [l'API File](https://developer.mozilla.org/fr/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

Sa valeur étant en lecture seulement, c'est un composant **non-contrôlé** en React. Ceci est expliqué en détail avec d'autres cas de composants non contrôlés [plus tard dans la documentation](/docs/uncontrolled-components.html#the-file-input-tag).

## Gérer plusieurs entrées {#handling-multiple-inputs}

Quand vous souhaitez gérer plusieurs balises input contrôlés, vous pouvez ajouter un attribut `name` a chaque éléments et laisser la fonction de traitement choisir quoi faire en fonction de la valeur de `event.target.name`.

Par exemple :

```javascript{15,18,28,37}
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Participe :
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Nombre d'invités :
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/wgedvV?editors=0010)

Notez l'utilisation de la syntaxe des [propriétés calculés](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Initialisateur_objet#Noms_de_propri%C3%A9t%C3%A9s_calcul%C3%A9s) pour mettre à jour la valeur de l'état correspondant au nom de l'input.

```js{2}
this.setState({
  [name]: value
});
```

Est équivalent à ce code ES5 :

```js{2}
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

De plus il suffit seulement de l'appeler avec les données modifiées car `setState()` combine automatiquement les données partiel dans l'état courant.

## Valeur nulle des input controllés {#controlled-input-null-value}

Définir la prop value sur un [composant contrôlé](/docs/forms.html#controlled-components) empêche l'utilisateur de changer le champ input sauf si le choisissez. Si vous spécifiez une `value` et le champ input est toujours éditable, alors `value` doit être accidentellement `undefined` ou `null`.

Le code suivant montre ce cas. (Le champ input est verrouillé au démarrage mais devient éditable après un court délai.)

```javascript
ReactDOM.render(<input value="Salut" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);

```

## Alternatives aux composants contrôlés {#alternatives-to-controlled-components}

Il est parfois compliqué d'utiliser les composants contrôlés, car il faut écrire un gestionnaire d'évènement pour chaque possibilité de changement de données et envoyer ces derniers dans l'état via un composant React. Ça peut devenir ennuyeux lors de la conversion d'un projet en React, ou l'intégration d'une application React dans une bibliothèque non-React. Dans ces situations, il est intéressant de connaitre les [composants non-contrôlés](/docs/uncontrolled-components.html), une technique alternative pour implémenter les inputs de formulaire.

## Solution complète {#fully-fledged-solutions}

Si vous cherchez une solution complète avec la validation, historique des champs visités, et gestion de soumission de formulaire, [Formik](https://jaredpalmer.com/formik) est un des choix populaires. Cependant, il est construit sur les mêmes principes que les composants contrôlés et la gestion de l'état - ne négligez pas leur apprentissage.
