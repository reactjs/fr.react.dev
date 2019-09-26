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

Les formulaires HTML fonctionnent un peu différemment des autres éléments du DOM en React car ils possèdent naturellement un état interne. Par exemple, ce formulaire en HTML qui accepte juste un nom :

```html
<form>
  <label>
    Nom :
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Envoyer" />
</form>
```

Ce formulaire a le comportement classique d'un formulaire HTML et redirige sur une nouvelle page quand l'utilisateur le soumet. Si vous souhaitez ce comportement en React, vous n’avez rien à faire. Cependant, dans la plupart des cas, vous voudrez pouvoir gérer la soumission avec une fonction JavaScript, qui accède aux données saisies par l'utilisateur. La manière classique de faire ça consiste à utiliser les « composants contrôlés ».

## Composants contrôlés {#controlled-components}

En HTML, les éléments de formulaire tels que `<input>`, `<textarea>`, et `<select>` maintiennent généralement leur propre état et se mettent à jour par rapport aux saisies de l’utilisateur. En React, l'état modifiable est généralement stocké dans la propriété `state` des composants et mis à jour uniquement avec [`setState()`](/docs/react-component.html#setstate).

On peut combiner ces deux concepts en utilisant l'état local React comme « source unique de vérité ». Ainsi le composant React qui affiche le formulaire contrôle aussi son comportement par rapport aux saisies de l’utilisateur. Un champ de formulaire dont l'état est contrôlé de cette façon par React est appelé un « composant contrôlé ».

Par exemple, en reprenant le code ci-dessus pour afficher le nom lors de la soumission, on peut écrire le formulaire sous forme de composant contrôlé :

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
    alert('Le nom a été soumis : ' + this.state.value);
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

À présent que l'attribut `value` est défini sur notre élément de formulaire, la valeur affichée sera toujours `this.state.value`, faisant ainsi de l'état local React la source de vérité. Puisque `handleChange` est déclenché à chaque frappe pour mettre à jour l'état local React, la valeur affichée restera mise à jour au fil de la saisie.

Dans un composant contrôlé, chaque changement de l'état aura une fonction gestionnaire associée. Ça permet de modifier ou valider facilement, à la volée, les saisies de l’utilisateur. Par exemple, si nous voulions forcer les noms en majuscules, on pourrait écrire `handleChange` de la manière suivante :

```javascript{2}
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
```

## La balise `textarea` {#the-textarea-tag}

En HTML, une balise `<textarea>` définit son texte via ses enfants :

```html
<textarea>
  Bonjour, voici du texte dans une zone de texte
</textarea>
```

En React, un `<textarea>` utilise à la place l'attribut `value`. Du coup, un formulaire utilisant un `<textarea>` peut être écrit d'une manière très similaire à un formulaire avec un élément `<input>` mono-ligne.

```javascript{4-6,12-14,26}
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Écrivez un essai à propos de votre élément du DOM préféré'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Un essai a été envoyé : ' + this.state.value);
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

## La balise `select` {#the-select-tag}

En HTML, `<select>` crée une liste déroulante. Par exemple, ce HTML crée une liste déroulante de parfums.

```html
<select>
  <option value="grapefruit">Pamplemousse</option>
  <option value="lime">Citron vert</option>
  <option selected value="coconut">Noix de coco</option>
  <option value="mango">Mangue</option>
</select>
```

Notez que l'option Noix de coco est sélectionnée au départ, grâce à l'attribut `selected`. React, au lieu d'utiliser l'attribut `selected`, utilise un attribut `value` sur la balise racine `select`. C’est plus pratique dans un composant contrôlé car vous n’avez qu’un seul endroit à mettre à jour. Par exemple :

```javascript{4,10-12,24}
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Votre parfum favori est : ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Choisissez votre parfum favori :
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Pamplemousse</option>
            <option value="lime">Citron vert</option>
            <option value="coconut">Noix de coco</option>
            <option value="mango">Mangue</option>
          </select>
        </label>
        <input type="submit" value="Envoyer" />
      </form>
    );
  }
}
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/JbbEzX?editors=0010)

Au final, ça permet aux balises `<input type="text">`, `<textarea>`, et `<select>` de fonctionner de manière très similaire—elles acceptent toutes un attribut `value` que vous pouvez utiliser pour implémenter un composant contrôlé.

> Note
>
> Vous pouvez passer un tableau pour l'attribut `value`, permettant de sélectionner plusieurs valeurs dans un élément `select` :
>
>```js
><select multiple={true} value={['B', 'C']}>
>```

## La balise `input type="file"` {#the-file-input-tag}

En HTML, un `<input type="file">` permet à l’utilisateur de sélectionner un ou plusieurs fichiers depuis son appareil et de les téléverser vers un serveur ou de les manipuler en JavaScript grâce à [l'API File](https://developer.mozilla.org/fr/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

Sa valeur étant en lecture seule, c'est un composant **non-contrôlé** en React. Ce cas de figure et le sujet des composants non-contrôlés en général sera détaillé [plus tard dans la documentation](/docs/uncontrolled-components.html#the-file-input-tag).

## Gérer plusieurs saisies {#handling-multiple-inputs}

Quand vous souhaitez gérer plusieurs champs contrôlés, vous pouvez ajouter un attribut `name` à chaque champ et laisser la fonction gestionnaire choisir quoi faire en fonction de la valeur de `event.target.name`.

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
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Participe :
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Nombre d'invités :
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

Notez l'utilisation de la syntaxe des [propriétés calculés](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Initialisateur_objet#Noms_de_propri%C3%A9t%C3%A9s_calcul%C3%A9s) pour mettre à jour la valeur de l'état correspondant au nom du champ.

```js{2}
this.setState({
  [name]: value
});
```

C’est équivalent à ce code ES5 :

```js{2}
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

Qui plus est, comme `setState()` fusionne automatiquement un état partiel dans l'état local courant, il nous a suffi de l'appeler avec les parties modifiées.

## Valeur nulle des champs contrôlés {#controlled-input-null-value}

Définir la prop `value` sur un [composant contrôlé](/docs/forms.html#controlled-components) empêche l'utilisateur de changer la saisie sauf si vous le permettez. Si vous spécifiez une `value` mais que le champ reste modifiable, alors `value` doit s’être accidentellement retrouvée à `undefined` ou `null`.

Le code suivant illustre ce cas de figure. (Le champ est verrouillé au démarrage mais devient modifiable après un court délai.)

```javascript
ReactDOM.render(<input value="Salut" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);

```

## Alternatives aux composants contrôlés {#alternatives-to-controlled-components}

Il est parfois fastidieux d'utiliser les composants contrôlés, car il vous faut écrire un gestionnaire d'événement pour chaque possibilité de changement des données, et gérer toute modification des saisies via un composant React. Ça peut devenir particulièrement irritant lors de la conversion d'un projet en React, ou l'intégration d'une application React avec une bibliothèque non-React. Dans ces situations, il est intéressant de connaître les [composants non-contrôlés](/docs/uncontrolled-components.html), une technique alternative pour implémenter les formulaires de saisie.

## Solutions clé en main {#fully-fledged-solutions}

Si vous cherchez une solution complète gérant la validation, l’historique des champs visités, et la gestion de soumission de formulaire, [Formik](https://jaredpalmer.com/formik) fait partie des choix populaires. Ceci dit, il repose sur les mêmes principes de composants contrôlés et de gestion d'état local—alors ne faites pas l’impasse dessus.
