---
title: Afficher des listes
---

<Intro>

Vous aurez souvent besoin d'afficher des composants similaires à partir d'une collection de données.  Vous pouvez utiliser les [méthodes des tableaux JavaScript](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#) pour manipuler un tableau de données.  Dans cette page, vous utiliserez [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) et [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) avec React pour filtrer et transformer vos données afin de produire un tableau de composants.

</Intro>

<YouWillLearn>

* Comment afficher des composants à partir d'un tableau de données en utilisant le `map()` de JavaScript
* Comment n'afficher que certains composants précis en utilisant le `filter()` de JavaScript
* Quand et pourquoi utiliser des clés React

</YouWillLearn>

## Afficher des données à partir de tableaux {/*rendering-data-from-arrays*/}

Disons que vous avez une liste de contenus.

```js
<ul>
  <li>Creola Katherine Johnson : mathématicienne</li>
  <li>Mario José Molina-Pasquel Henríquez : chimiste</li>
  <li>Mohammad Abdus Salam : physicien</li>
  <li>Percy Lavon Julian : chimiste</li>
  <li>Subrahmanyan Chandrasekhar : astrophysicien</li>
</ul>
```

La seule différence entre ces éléments de liste, c'est leur contenu, c'est-à-dire leurs données.  Vous aurez souvent besoin d'afficher plusieurs instances d'un même composant mais avec des données différentes lorsque vous construirez des interfaces : listes de commentaires, galeries d'images de profils, etc.  Dans de telles situations, vous pourrez stocker les données dans des objets et tableaux JavaScript et utiliser des méthodes comme [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) et [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) pour produire des listes de composants à partir de ces données.

Voici un court exemple de génération d'une liste d'éléments à partir d'un tableau :

1. **Déplacez** les données dans un tableau

```js
const people = [
  'Creola Katherine Johnson : mathématicienne',
  'Mario José Molina-Pasquel Henríquez : chimiste',
  'Mohammad Abdus Salam : physicien',
  'Percy Lavon Julian : chimiste',
  'Subrahmanyan Chandrasekhar : astrophysicien',
];
```

2. **Transformez** les membres de `people` en un nouveau tableau de nœuds JSX, `listItems` :

```js
const listItems = people.map(person => <li>{person}</li>);
```

1. **Renvoyez** `listItems` à partir de votre composant, enrobé dans un `<ul>` :

```js
return <ul>{listItems}</ul>;
```

Voici le résultat :

<Sandpack>

```js
const people = [
  'Creola Katherine Johnson : mathématicienne',
  'Mario José Molina-Pasquel Henríquez : chimiste',
  'Mohammad Abdus Salam : physicien',
  'Percy Lavon Julian : chimiste',
  'Subrahmanyan Chandrasekhar : astrophysicien',
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

Remarquez l'erreur dans la console du bac à sable :

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

*(« Avertissement : chaque enfant d'une liste devrait avoir une prop "key" unique », NdT.)*

Vous apprendrez à corriger cette erreur plus loin dans cette page.  Avant d'en arriver là, commençons par structurer un peu plus vos données.

## Filtrer des tableaux d'éléments {/*filtering-arrays-of-items*/}

On peut structurer davantage nos données.

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathématicienne',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chimiste',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicien',
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chimiste',
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicien',
}];
```

Disons que vous cherchez un moyen de n'afficher que les chimistes.  Vous pouvez utiliser la méthode `filter()` de JavaScript pour ne renvoyer que ces personnes.  Cette méthode s'applique sur un tableau d'éléments, les fait passer à travers un « prédicat » (une fonction qui renvoie `true` ou `false` au sujet de son argument), et renvoie un nouveau tableau ne contenant que les éléments qui ont satisfait le prédicat (il a renvoyé `true` pour ces éléments).

Vous ne vous intéressez qu'aux éléments dont la `profession` est `'chimiste'`.  Le prédicat correspondant ressemble à `(person) => person.profession === 'chimiste'`. Voici comment assembler tout ça :

1. **Créez** un nouveau tableau avec juste les chimistes, `chemists`, en appelant `filter()` sur `people` et en filtrant avec `person.profession === 'chimiste'` :

```js
const chemists = people.filter(person =>
  person.profession === 'chimiste'
);
```

1. A présent **transformez** `chemists` avec `map()` :

```js {1,13}
const listItems = chemists.map(person =>
  <li>
     <img
       src={getImageUrl(person)}
       alt={person.name}
     />
     <p>
       <b>{person.name}:</b>
       {' ' + person.profession + ' '}
       célèbre pour {person.accomplishment}
     </p>
  </li>
);
```

1. Enfin, **renvoyez** le `listItems` depuis votre composant :

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chimiste'
  );
  const listItems = chemists.map(person =>
    <li>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        célèbre pour {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathématicienne',
  accomplishment: 'ses calculs pour vol spatiaux',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chimiste',
  accomplishment: 'sa découverte du trou dans la couche d’ozone au-dessus de l’Arctique',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicien',
  accomplishment: 'sa théorie de l’électromagnétisme',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chimiste',
  accomplishment: 'ses travaux pionniers sur la cortisone, les stéroïdes et les pilules contraceptives',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicien',
  accomplishment: 'son calcul de la masse des naines blanches',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

Les fonctions fléchées renvoient implicitement l'expression qui suit immédiatement `=>`, de sorte que vous n'avez alors pas besoin d'une instruction `return` :

```js
const listItems = chemists.map(person =>
  <li>...</li> // return implicite !
);
```

En revanche, **vous devez écrire un `return` explicite si votre `=>` est suivie par une accolade `{`** !

```js
const listItems = chemists.map(person => { // Curly brace
  return <li>...</li>;
});
```

Les fonctions fléchées utilisant `=> {` ont un [« corps de fonction »](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Functions/Arrow_functions#gestion_du_corps_de_la_fonction).  Vous pouvez y écrire plus qu'une expression, mais vous *devez* écrire l'instruction `return` vous-même.  Si vous l'oubliez, rien n'est renvoyé !

</Pitfall>

## Maintenir l'ordre des éléments de liste avec `key` {/*keeping-list-items-in-order-with-key*/}

Vous avez pu remarquer dans tous les bacs à sable ci-dessus une erreur dans la console :

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

*(« Avertissement : chaque enfant d'une liste devrait avoir une prop "key" unique », NdT.)*

Vous devez fournir à chaque élément de tableau un `key` — une chaîne de caractères ou un nombre qui identifie de façon unique cet élément au sein du tableau :

```js
<li key={person.id}>...</li>
```

<Note>

Les éléments JSX directement au sein d'un appel à `map()` ont toujours besoin de clés !

</Note>

Les clés indiquent à React à quel élément du tableau de données correspond chaque élément du tableau de composants, pour qu'il puisse les faire correspondre plus tard.  Ça devient important si les éléments de votre tableau sont susceptibles de s'y déplacer (par exemple dans le cadre d'un tri), d'y être insérés ou supprimés.  Une `key` bien choisie aide React à inférer la nature exacte du changement, et à faire les mises à jour adaptées dans l'arbre DOM.

Plutôt que de générer vos clés à la volée, vous devriez les faire figurer dans vos données :

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          célèbre pour {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js active
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathématicienne',
  accomplishment: 'ses calculs pour vol spatiaux',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chimiste',
  accomplishment: 'sa découverte du trou dans la couche d’ozone au-dessus de l’Arctique',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicien',
  accomplishment: 'sa théorie de l’électromagnétisme',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chimiste',
  accomplishment: 'ses travaux pionniers sur la cortisone, les stéroïdes et les pilules contraceptives',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicien',
  accomplishment: 'son calcul de la masse des naines blanches',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### Afficher plusieurs nœuds DOM pour chaque élément de la liste {/*displaying-several-dom-nodes-for-each-list-item*/}

Que faire lorsque chaque élément de la liste doit produire non pas un, mais plusieurs nœuds DOM ?

La syntaxe concise de [Fragment `<>...</>`](/reference/react/Fragment) ne vous permet pas de passer une clé, vous devez donc soit les regrouper dans une `<div>`, soit utiliser la [syntaxe plus explicite `<Fragment>`](/reference/react/Fragment#rendering-a-list-of-fragments), certes un peu plus longue :

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Les Fragments n'impactent pas le DOM, de sorte que ce code produira une liste à plat de `<h1>`, `<p>`, `<h1>`, `<p>`, et ainsi de suite.

</DeepDive>

### Où récupérer la `key` {/*where-to-get-your-key*/}

Selon la source de vos données, vous aurez différentes sources de clés :

* **Données issues d'une base de données :** si vos données viennent d'une base de données, vous pouvez utiliser les clés / ID de la base, qui sont uniques par nature.
* **Données générées localement :** si vos données sont générées et persistées localement (ex. une appli de prise de notes), utilisez un compteur incrémentiel, [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) ou un module du style [`uuid`](https://www.npmjs.com/package/uuid) en créant vos éléments.

### Les règles des clés {/*rules-of-keys*/}

* **Les clés doivent être uniques dans une même liste.**  En revanche, vous pouvez avoir les mêmes clés pour des nœuds JSX dans des tableaux *distincts*.
* **Les clés ne doivent pas changer** sans quoi elles ne serviraient à rien ! Ne générez pas les clés lors du rendu.

### Pourquoi React a-t-il besoin de clés ? {/*why-does-react-need-keys*/}

Imaginez que les fichiers sur votre bureau n'aient pas de noms. Vous y feriez alors référence plutôt par leur ordre : le premier fichier, le deuxième, et ainsi de suite. Vous pourriez vous y habituer, sauf que lorsque vous supprimez un fichier, un problème surgit. Le deuxième fichier devient le premier, le troisième devient le deuxième, etc.

Les noms de fichiers dans un dossier et les clés JSX dans un tableau jouent un rôle similaire.  Ils nous permettent d'identifier de façon unique un élément parmi ceux qui l'entourent.  Une clé bien choisie nous fournit plus d'information que la simple position dans le tableau. Même si la *position* change en raison d'un réordonnancement, la `key` permettra à React d'identifier l'élément tout au long de sa vie.

<Pitfall>

Vous pourriez être tenté·e d'utiliser la position d'un élément dans le tableau comme clé.  C'est d'ailleurs ce que fera React si vous ne précisez pas de `key`.  Mais l'ordre d'affichage des éléments variera au cours du temps si un élément est inséré, supprimé, ou si le tableau est réordonnancé.  Utiliser l'index comme clé entraînera des bugs subtils et déroutants.

Dans le même esprit, évitez de générer les clés à la volée, du style `key={Math.random()}`. Les clés ne correspondraient alors jamais d'un rendu à l'autre, ce qui forcerait la recréation de vos composants et du DOM à chaque fois.  C'est non seulement lent, mais ça entraînerait la perte des saisies dans les champs au sein des éléments de la liste.  Utilisez plutôt un ID stable basé sur la donnée.

Notez que vos composants ne reçoivent pas la `key` dans leurs props.  Elle n'est utilisée que comme indice par React lui-même.  Si votre composant a besoin d'un ID, vous pouvez lui passer dans une prop dédiée : `<Profile key={id} userId={id} />`.

</Pitfall>

<Recap>

Dans cette page, vous avez appris :

* Comment extraire les données de vos composants pour les placer dans des structures de données comme des tableaux et des objets.
* Comment générer des séries de composants similaires avec le `map()` de JavaScript.
* Comment créer des tableaux filtrés d'éléments avec le `filter()` de JavaScript.
* Pourquoi et comment utiliser `key` sur chaque composant d'une collection afin que React puisse garder trace de leurs identités même lorsque leurs positions ou les données sous-jacentes changent.

</Recap>



<Challenges>

#### Splitting a list in two {/*splitting-a-list-in-two*/}

This example shows a list of all people.

Change it to show two separate lists one after another: **Chemists** and **Everyone Else.** Like previously, you can determine whether a person is a chemist by checking if `person.profession === 'chemist'`.

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

You could use `filter()` twice, creating two separate arrays, and then `map` over both of them:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
      <h2>Everyone Else</h2>
      <ul>
        {everyoneElse.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

In this solution, the `map` calls are placed directly inline into the parent `<ul>` elements, but you could introduce variables for them if you find that more readable.

There is still a bit duplication between the rendered lists. You can go further and extract the repetitive parts into a `<ListSection>` component:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

A very attentive reader might notice that with two `filter` calls, we check each person's profession twice. Checking a property is very fast, so in this example it's fine. If your logic was more expensive than that, you could replace the `filter` calls with a loop that manually constructs the arrays and checks each person once.

In fact, if `people` never change, you could move this code out of your component. From React's perspective, all that matters is that you give it an array of JSX nodes in the end. It doesn't care how you produce that array:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### Nested lists in one component {/*nested-lists-in-one-component*/}

Make a list of recipes from this array! For each recipe in the array, display its name as an `<h2>` and list its ingredients in a `<ul>`.

<Hint>

This will require nesting two different `map` calls.

</Hint>

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Here is one way you could go about it:

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Each of the `recipes` already includes an `id` field, so that's what the outer loop uses for its `key`. There is no ID you could use to loop over ingredients. However, it's reasonable to assume that the same ingredient won't be listed twice within the same recipe, so its name can serve as a `key`. Alternatively, you could change the data structure to add IDs, or use index as a `key` (with the caveat that you can't safely reorder ingredients).

</Solution>

#### Extracting a list item component {/*extracting-a-list-item-component*/}

This `RecipeList` component contains two nested `map` calls. To simplify it, extract a `Recipe` component from it which will accept `id`, `name`, and `ingredients` props. Where do you place the outer `key` and why?

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

You can copy-paste the JSX from the outer `map` into a new `Recipe` component and return that JSX. Then you can change `recipe.name` to `name`, `recipe.id` to `id`, and so on, and pass them as props to the `Recipe`:

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Here, `<Recipe {...recipe} key={recipe.id} />` is a syntax shortcut saying "pass all properties of the `recipe` object as props to the `Recipe` component". You could also write each prop explicitly: `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.

**Note that the `key` is specified on the `<Recipe>` itself rather than on the root `<div>` returned from `Recipe`.** This is because this `key` is needed directly within the context of the surrounding array. Previously, you had an array of `<div>`s so each of them needed a `key`, but now you have an array of `<Recipe>`s. In other words, when you extract a component, don't forget to leave the `key` outside the JSX you copy and paste.

</Solution>

#### List with a separator {/*list-with-a-separator*/}

This example renders a famous haiku by Katsushika Hokusai, with each line wrapped in a `<p>` tag. Your job is to insert an `<hr />` separator between each paragraph. Your resulting structure should look like this:

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

A haiku only contains three lines, but your solution should work with any number of lines. Note that `<hr />` elements only appear *between* the `<p>` elements, not in the beginning or the end!

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(This is a rare case where index as a key is acceptable because a poem's lines will never reorder.)

<Hint>

You'll either need to convert `map` to a manual loop, or use a fragment.

</Hint>

<Solution>

You can write a manual loop, inserting `<hr />` and `<p>...</p>` into the output array as you go:

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // Fill the output array
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Remove the first <hr />
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Using the original line index as a `key` doesn't work anymore because each separator and paragraph are now in the same array. However, you can give each of them a distinct key using a suffix, e.g. `key={i + '-text'}`.

Alternatively, you could render a collection of fragments which contain `<hr />` and `<p>...</p>`. However, the `<>...</>` shorthand syntax doesn't support passing keys, so you'd have to write `<Fragment>` explicitly:

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Remember, fragments (often written as `<> </>`) let you group JSX nodes without adding extra `<div>`s!

</Solution>

</Challenges>
