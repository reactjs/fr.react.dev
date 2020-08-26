---
id: uncontrolled-components
title: Composants non-contrôlés
permalink: docs/uncontrolled-components.html
prev: refs-and-the-dom.html
next: optimizing-performance.html
---

Dans la plupart des cas, pour implémenter des formulaires, nous recommandons d'utiliser des [composants contrôlés](/docs/forms.html#controlled-components). Dans un composant contrôlé, les données du formulaires sont gérées par le composant React. L'alternative est le composant non-contrôlé, où les données sont gérées par le DOM.

Au lieu d'écrire un gestionnaire d'événements pour chaque mise à jour de l'état d'un composant non-contrôlé, vous pouvez [utiliser une ref](/docs/refs-and-the-dom.html).

Par exemple, ce code accepte une saisie de nom dans un composant non-contrôlé :

```javascript{5,9,18}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('Un nom a été envoyé : ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Nom :
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Envoyer" />
      </form>
    );
  }
}
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

Puisqu'un composant non-contrôlé garde la source de vérité dans le DOM, il est parfois plus simple d'intégrer du code React à base de composants non-contrôlés avec du code non-React. Le code peut également être légèrement plus concis si vous souhaitez pondre un truc vite fait. Autrement, vous devriez utiliser les composants contrôlés.

Si dans une situation donnée il n'est pas toujours évident de savoir quel type de composant utiliser, [cet article sur les champs contrôlés ou non-contrôlés](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) vous sera peut-être utile.

### Valeurs par défaut {#default-values}

Dans le cycle de vie des rendus React, l'attribut `value` des éléments du formulaire va écraser la valeur du DOM. Avec un composant non-contrôlé, vous souhaiterez plus souvent spécifier la valeur initiale et laisser les mises à jours suivantes non-contrôlées. Dans ces cas-là, vous pouvez spécifier un attribut `defaultValue` plutôt que `value`.

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Nom :
        <input
          defaultValue="Thierry"
          type="text"
          ref={this.input} />
      </label>
      <input type="submit" value="Envoyer" />
    </form>
  );
}
```

Dans la même série, `<input type="checkbox">` et `<input type="radio">` ont un attribut `defaultChecked`, et `<select>` et `<textarea>` ont aussi `defaultValue`.

## La balise `input type="file"` {#the-file-input-tag}

En HTML, un `<input type="file">` permet à l’utilisateur de sélectionner un ou plusieurs fichiers depuis son appareil, et de les téléverser vers un serveur ou de les manipuler en JavaScript grâce à [l'API *File*](https://developer.mozilla.org/fr/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

`<input type="file" />` est toujours un composant non-contrôlé en React, puisque sa valeur ne peut être définie que par l’utilisateur et non programmatiquement.

Vous devriez utiliser l'API *File* pour interagir avec les fichiers. L'exemple suivant montre comment créer une [ref sur le nœud DOM](/docs/refs-and-the-dom.html) pour accéder aux fichiers lors de l'envoi du formulaire :


`embed:uncontrolled-components/input-type-file.js`

**[Essayer sur CodePen](codepen://uncontrolled-components/input-type-file)**

