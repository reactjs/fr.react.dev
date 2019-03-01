---
id: uncontrolled-components
title: Composants non-contrôlés
permalink: docs/uncontrolled-components.html
---

Dans la plupart des cas, pour implémenter des formulaires, nous recommandons d'utiliser des [composants contrôlés](/docs/forms.html). Dans un composant contrôlé, les données du formulaires sont gérées par le composant React. L'alternative est le composant non-contrôlé, où les données sont gérées par le DOM.

Au lieu d'écrire un gestionnaire d'évènement pour chaque mise à jour de l'état d'un composant non-contrôlé, vous pouvez [utiliser une ref](/docs/refs-and-the-dom.html)

Par exemple, ce code accepte un unique nom dans ce composant non-contrôlé :

```javascript{5,9,18}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('Un nom a été soumis : ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Nom:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Envoyer" />
      </form>
    );
  }
}
```

[**Essayer sur CodePen**](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

Puisqu'un composant non-contrôlé garde la source de vérité dans le DOM, il est parfois plus simple d'y intégrer du code React et non-React. Le code peut être également légèrement plus concis si vous souhaitez être rapide et sale. Autrement, vous devriez utiliser les composants contrôlés.

S'il n'est toujours pas clair quel type de composant doit être utilisé pour une situation particulière, [cet article sur les entrées contrôlées ou non-contrôlées](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) peut vous être utile.

### Valeurs par défaut {#default-values}

Dans le cycle de rendu de React, l'attribut `value` des éléments du formulaire va surcharger la valeur du DOM. Avec un composant non-contrôlé, vous souhaiterez souvent spécifier la valeur initiale et laisser les mises à jours suivantes non-contrôlés. Pour gérer ces cas, vous pouvez spécifier un attribut `defaultValue` à la place de `value`.

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Nom:
        <input
          defaultValue="Thierry"
          type="text"
          ref={this.input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

De la même manière, `<input type="checkbox">` et `<input type="radio">` supportent l'attribut `defaultChecked`, tout comme `<select>` et `<textarea>` supportent `defaultValue`.

## La balise `input type="file"` {#the-file-input-tag}

En HTML, un `<input type="file">` permet à l’utilisateur de sélectionner un ou plusieurs fichiers depuis son appareil, et de les téléverser vers un serveur ou de les manipuler en JavaScript grâce à [l'API File](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

`<input type="file" />` est toujours un composant non-contrôlé en React, puisque sa valeur ne peut être définie que par un utilisateur et non programmatiquement.

Vous devriez utiliser l'API File pour interagir avec les fichiers. L'exemple suivant montre comment créer une [ref sur le noeud DOM](/docs/refs-and-the-dom.html) pour accéder aux fichiers dans un gestionnaire d'envoi.


`embed:uncontrolled-components/input-type-file.js`

[](codepen://uncontrolled-components/input-type-file)

