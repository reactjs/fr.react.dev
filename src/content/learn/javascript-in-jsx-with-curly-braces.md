---
title: JavaScript dans JSX grâce aux accolades
---

<Intro>

JSX vous permet d'écrire du balisage similaire à HTML au sein de votre fichier JavaScript, ce qui regroupe la logique et le contenu associés dans un même endroit.  Vous voudrez régulièrement ajouter un peu de logique JavaScript dans votre balisage, ou y référencer une propriété dynamique.  Dans de tels cas, vous utiliserez des accolades dans votre JSX pour y « ouvrir une fenêtre » vers le monde JavaScript.

</Intro>

<YouWillLearn>

* Comment passer des chaînes de caractères grâce aux guillemets
* Comment référencer une variable JavaScript dans du JSX grâce aux accolades
* Comment appeler une fonction JavaScript dans du JSX grâce aux accolades
* Comment utiliser un objet JavaScript dans du JSX grâce aux accolades

</YouWillLearn>

## Passer des chaînes de caractères grâce aux guillemets {/*passing-strings-with-quotes*/}

Lorsque vous voulez passer une valeur textuelle fixe à un attribut en JSX, vous l'entourez d'apostrophes (`'`) ou de guillemets (`"`) :

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Dans cet exemple, `"https://i.imgur.com/7vQD0fPs.jpg"` et `"Gregorio Y. Zara"` sont passées en tant que chaînes de caractères.

Mais comment faire pour spécifier dynamiquement les textes pour `src` ou `alt` ? Vous pouvez **utiliser une valeur JavaScript en remplaçant les guillemets (`"`) par des accolades (`{` et `}`)** :

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Remarquez la différence entre `className="avatar"`, qui spécifie une classe CSS `"avatar"` pour arrondir l'image, et `src={avatar}` qui lit la valeur de la variable JavaScript `avatar`.  En effet, les accolades vous permettent de mettre du JavaScript directement dans votre balisage !

## Les accolades : une fenêtre vers le monde JavaScript {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX n'est qu'une façon particulière d'écrire du JavaScript. Vous pouvez donc y utiliser du JavaScript directement — dans des accolades `{ }`. L'exemple ci-dessous commence par déclarer le nom du scientifique dans `name`, puis l'incorpore dans le `<h1>` grâce aux accolades :

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>Liste des tâches de {name}</h1>
  );
}
```

</Sandpack>

Essayez de modifier la valeur de `name` de `'Gregorio Y. Zara'` vers `'Hedy Lamarr'`. Vous voyez comme le titre de la liste change ?

N'importe quelle expression JavaScript fonctionnera au sein des accolades, y compris des appels de fonction comme `formatDate()` :

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'fr-FR',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>Liste de tâches pour {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### Où utiliser les accolades {/*where-to-use-curly-braces*/}

Vous ne pouvez utiliser des accolades qu'à deux endroits dans JSX :

1. **Comme texte** directement au sein d'une balise JSX : `<h1>Liste de tâches de {name}</h1>` fonctionne, mais pas `<{tag}>Liste de tâches de Gregorio Y. Zara</{tag}>`.
2. **Comme attributs** juste après le symbole `=` : `src={avatar}` lira la variable `avatar`, mais `src="{avatar}"` passera juste le texte `"{avatar}"`.

## « Double accolades » : les CSS et autres objets dans JSX {/*using-double-curlies-css-and-other-objects-in-jsx*/}

En plus des chaînes de caractères, nombres et autres expressions JavaScript, vous pouvez même passer des objets dans JSX. Les littéraux objets sont délimités par des accolades, comme par exemple `{ name: "Hedy Lamarr", inventions: 5 }`. Du coup, pour passer un littéral objet en JSX, vous devez l'enrober par une autre paire d'accolades : `person={{ name: "Hedy Lamarr", inventions: 5 }}`.

Vous rencontrerez peut-être ça pour des styles en ligne en JSX. React n'exige pas que vous utilisez des styles en ligne (les classes CSS marchent très bien la plupart du temps). Mais lorsque vous en avez effectivement besoin, vous passez un objet à l'attribut `style` :

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Améliorer le visiophone</li>
      <li>Préparer les cours d’aéronautique</li>
      <li>Travailler sur un moteur à alcool</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

Essayez de modifier les valeurs de `backgroundColor` et `color`.

On peut mieux voir l'objet JavaScript au sein des accolades lorsqu'on l'écrit comme ceci :

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

La prochaine fois que vous verrez `{{` et `}}` dans du JSX, sachez que ce n'est rien de plus qu'un littéral objet dans des accolades JSX !

<Pitfall>

Les propriétés `style` en ligne sont écrites en casse Camel. Par exemple, le HTML `<ul style="background-color: black">` s'écrirait `<ul style={{ backgroundColor: 'black' }}>`  dans votre composant.

</Pitfall>

## Amusons-nous avec les objets JavaScript et les accolades {/*more-fun-with-javascript-objects-and-curly-braces*/}

Vous pouvez placer plusieurs expressions dans un même objet, et les référencer dans votre JSX au sein de vos paires d'accolades :

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Liste des tâches de {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Améliorer le visiophone</li>
        <li>Préparer les cours d’aéronautique</li>
        <li>Travailler sur un moteur à alcool</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Dans cet exemple, l'objet JavaScript `person` contient une chaîne de caractères `name` et un objet `theme` :

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

Le composant peut utiliser ces propriétés de `person` comme ceci :

```js
<div style={person.theme}>
  <h1>Liste des tâches de {person.name}</h1>
```

JSX est très minimal en termes de *templating* parce qu'il vous laisse organiser vos données et votre logique directement en JavaScript.

<Recap>

Vous connaissez désormais presque tout ce que vous avez à savoir sur JSX :

* Les attributs JSX entre apostrophes ou guillemets sont passés en tant que chaînes de caractères.
* Les accolades vous permettent d'incorporer de la logique et des expressions JavaScript dans votre balisage.
* Elles fonctionnent au sein du contenu d'une balise JSX ou juste après le `=` des attributs.
* `{{` et `}}` ne constituent pas une syntaxe spéciale : il ne s'agit que d'un littéral objet JavaScript au sein des accolades JSX.

</Recap>

<Challenges>

#### Réparez l'erreur {/*fix-the-mistake*/}

Ce code plante avec un erreur qui dit `Objects are not valid as a React child` *(« Les objets ne sont pas des enfants React valides », NdT)* :

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Liste des tâches de {person}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Améliorer le visiophone</li>
        <li>Préparer les cours d’aéronautique</li>
        <li>Travailler sur un moteur à alcool</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Pouvez-vous trouver l'origine du problème ?

<Hint>

Regardez ce qui figure entre les accolades.  Est-ce qu'on y met le bon contenu ?

</Hint>

<Solution>

Le souci vient de ce que cet exemple tente d'afficher *l'objet lui-même* dans le balisage plutôt qu'un texte : `<h1>Liste des tâches de {person}</h1>` essaie d'afficher l'objet `person` entier ! Inclure des objets bruts dans du contenu textuel lève une erreur parce que React ne sait pas comment vous souhaitez les afficher.

Pour corriger ça, remplacez le JSX `<h1>Liste des tâches de {person}</h1>` par `<h1>Liste des tâches de {person.name}</h1>` :

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Liste des tâches de {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Améliorer le visiophone</li>
        <li>Préparer les cours d’aéronautique</li>
        <li>Travailler sur un moteur à alcool</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Extrayez l'information d'un objet {/*extract-information-into-an-object*/}

Extrayez l'URL de l'image depuis l'objet `person` plutôt que de l'inscrire en dur.

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Liste des tâches de {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Améliorer le visiophone</li>
        <li>Préparer les cours d’aéronautique</li>
        <li>Travailler sur un moteur à alcool</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<Solution>

Déplacez l'URL de l'image dans une propriété `imageUrl` au sein de l'objet `person` et utilisez-la dans la balise `<img>` en utilisant les accolades :

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Liste des tâches de {person.name}</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Améliorer le visiophone</li>
        <li>Préparer les cours d’aéronautique</li>
        <li>Travailler sur un moteur à alcool</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Écrivez une expression entre des accolades JSX {/*write-an-expression-inside-jsx-curly-braces*/}

Dans l'objet ci-dessous, l'URL complète de l'image est découpée en quatre parties : l'URL de base, `imageId`, `imageSize` et l'extension de fichier.

Nous souhaitons que l'URL de l'image combine ces attributs : URL de base (toujours `'https://i.imgur.com/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`), et l'extension de fichier (toujours `'.jpg'`). Hélas, quelque chose ne va pas dans la façon dont la balise `<img>` spécifie son `src`.

Pouvez-vous réparer ça ?

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Liste des tâches de {person.name}</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Améliorer le visiophone</li>
        <li>Préparer les cours d’aéronautique</li>
        <li>Travailler sur un moteur à alcool</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Pour vérifier que votre correctif fonctionne, essayez de modifier la valeur de `imageSize` à `'b'`. L'image devrait se redimensionner après votre changement.

<Solution>

Vous pouvez écrire la composition de l'URL avec une concaténation JavaScript, comme ceci : `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.

1. `{` ouvre l'expression JavaScript
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` produit la bonne URL
3. `}` ferme l'expression JavaScript

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Liste des tâches de {person.name}</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Améliorer le visiophone</li>
        <li>Préparer les cours d’aéronautique</li>
        <li>Travailler sur un moteur à alcool</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Vous pouvez aussi déplacer cette expression dans une fonction séparée genre `getImageUrl` :

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Liste des tâches de {person.name}</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Améliorer le visiophone</li>
        <li>Préparer les cours d’aéronautique</li>
        <li>Travailler sur un moteur à alcool</li>
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Les variables et les fonctions peuvent vous aider à garder un balisage aisément lisible !

</Solution>

</Challenges>
