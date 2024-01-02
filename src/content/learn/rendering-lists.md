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

3. **Renvoyez** `listItems` à partir de votre composant, enrobé dans un `<ul>` :

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

2. A présent **transformez** `chemists` avec `map()` :

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

3. Enfin, **renvoyez** le `listItems` depuis votre composant :

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js src/App.js
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

```js src/data.js
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

```js src/utils.js
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

Vous devez fournir à chaque élément de tableau une `key` — une chaîne de caractères ou un nombre qui identifie de façon unique cet élément au sein du tableau :

```js
<li key={person.id}>...</li>
```

<Note>

Les éléments JSX directement au sein d'un appel à `map()` ont toujours besoin de clés !

</Note>

Les clés indiquent à React à quel élément du tableau de données correspond chaque élément du tableau de composants, pour qu'il puisse les faire correspondre plus tard.  Ça devient important si les éléments de votre tableau sont susceptibles de s'y déplacer (par exemple dans le cadre d'un tri), d'y être insérés ou supprimés.  Une `key` bien choisie aide React à inférer la nature exacte du changement, et à faire les mises à jour adaptées dans l'arbre DOM.

Plutôt que de générer vos clés à la volée, vous devriez les faire figurer dans vos données :

<Sandpack>

```js src/App.js
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

```js src/data.js active
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

```js src/utils.js
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

La syntaxe concise de [Fragment `<>...</>`](/reference/react/Fragment) ne vous permet pas de passer une clé, vous devez donc soit les regrouper dans une `<div>`, soit utiliser la [syntaxe plus explicite `<Fragment>`](/reference/react/Fragment#rendering-a-list-of-fragments), certes un peu plus longue, mais plus explicite :

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

#### Découper une liste en deux {/*splitting-a-list-in-two*/}

Cet exemple affiche une liste de personnes.

Modifiez-le pour afficher deux listes distinctes l'une de l'autre : les **Chimistes** et **Tous les autres**.  Comme précédemment, vous pouvez déterminer si une personne est chimiste en testant `person.profession === 'chimiste'`.

<Sandpack>

```js src/App.js
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
        célèbre pour {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientifiques</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js src/data.js
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

```js src/utils.js
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

Vous pourriez utiliser `filter()` deux fois, pour créer deux tableaux distincts, et faire un `map` sur chacun des deux :

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chimiste'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chimiste'
  );
  return (
    <article>
      <h1>Scientifiques</h1>
      <h2>Chimistes</h2>
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
              célèbre pour {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
      <h2>Tous les autres</h2>
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
              célèbre pour {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </article>
  );
}
```

```js src/data.js
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

```js src/utils.js
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

Dans cette solution, les appels à `map` sont placés directement en ligne dans les éléments `<ul>` parents, mais vous pouvez introduire des variables si vous trouvez ça plus lisible.

Il reste quand même un peu de duplication au niveau des listes affichées.  Vous pouvez allez plus loin et extraire les parties répétitives dans un composant `<ListSection>` :

<Sandpack>

```js src/App.js
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
              célèbre pour {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chimiste'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chimiste'
  );
  return (
    <article>
      <h1>Scientifiques</h1>
      <ListSection
        title="Chimistes"
        people={chemists}
      />
      <ListSection
        title="Tous les autres"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js src/data.js
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

```js src/utils.js
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

Si vous êtes particulièrement attentif·ve, vous avez remarqué qu'avec deux appels à `filter`, on vérifie la profession de chaque personne deux fois.  Vérifier une propriété reste très rapide, donc dans cet exemple ce n'est pas grave.   Mais si votre logique était plus coûteuse que ça, vous pourriez remplacer les appels à `filter` par une boucle qui construit manuellement les tableaux en ne vérifiant chaque personne qu'une fois.

En fait, si `people` ne change jamais, vous pourriez carrément sortir ce code de votre composant. Du point de vue de React, tout ce qui compte, c'est que vous fournissiez un tableau de nœuds JSX au final.  Il ne se préoccupe pas de la façon dont vous produisez ce tableau :

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chimiste') {
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
              célèbre pour {person.accomplishment}
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
      <h1>Scientifiques</h1>
      <ListSection
        title="Chimistes"
        people={chemists}
      />
      <ListSection
        title="Tous les autres"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js src/data.js
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

```js src/utils.js
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

#### Des listes imbriquées {/*nested-lists-in-one-component*/}

Affichez une liste de recettes à partir du tableau fourni ! Pour chaque recette du tableau, affichez son nom dans un `<h2>` et listez ses ingrédients dans un `<ul>`.

<Hint>

Il vous faudra imbriquer deux appels `map` distincts.

</Hint>

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recettes</h1>
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Salade grecque',
  ingredients: ['tomates', 'concombre', 'oignon', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Pizza hawaïenne',
  ingredients: ['pâte à pizza', 'sauce pizza', 'mozzarella', 'jambon', 'ananas']
}, {
  id: 'hummus',
  name: 'Houmous',
  ingredients: ['pois chiches', 'huile d’olive', 'gousses d’ail', 'citron', 'tahini']
}];
```

</Sandpack>

<Solution>

Voici une des façons d'y arriver :

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recettes</h1>
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

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Salade grecque',
  ingredients: ['tomates', 'concombre', 'oignon', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Pizza hawaïenne',
  ingredients: ['pâte à pizza', 'sauce pizza', 'mozzarella', 'jambon', 'ananas']
}, {
  id: 'hummus',
  name: 'Houmous',
  ingredients: ['pois chiches', 'huile d’olive', 'gousses d’ail', 'citron', 'tahini']
}];
```

</Sandpack>

Chaque recette dans `recipes` inclut déjà un champ `id`, que vous pouvez utiliser pour les `key` de la boucle principale.  Il n'y a pas d'ID utilisable pour les ingrédients.  Ceci dit, on peut raisonnablement supposer que le même ingrédient n'apparaîtra pas deux fois dans la même recette, de sorte que son nom peut servir de `key`.  Sinon, vous pourriez changer les données pour ajouter des ID, ou utiliser l'index comme `key` (sauf que vous ne pourrez alors plus réordonner les ingrédients de façon fiable).

</Solution>

#### Extraire un composant d'élément de liste {/*extracting-a-list-item-component*/}

Ce composant `RecipeList` contient deux appels `map` imbriqués.  Pour le simplifier, extrayez-en un composant `Recipe` qui acceptera des props `id`, `name` et `ingredients`.  Où placer sa `key` et pourquoi ?

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recettes</h1>
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

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Salade grecque',
  ingredients: ['tomates', 'concombre', 'oignon', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Pizza hawaïenne',
  ingredients: ['pâte à pizza', 'sauce pizza', 'mozzarella', 'jambon', 'ananas']
}, {
  id: 'hummus',
  name: 'Houmous',
  ingredients: ['pois chiches', 'huile d’olive', 'gousses d’ail', 'citron', 'tahini']
}];
```

</Sandpack>

<Solution>

Vous pouvez copier-coller le JSX du `map` principal dans un nouveau composant `Recipe` qui renvoie ce JSX.  Ensuite vous changez `recipe.name` en `name`, `recipe.id` en `id` et ainsi de suite, et les passez comme props à `Recipe` :

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
      <h1>Recettes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Salade grecque',
  ingredients: ['tomates', 'concombre', 'oignon', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Pizza hawaïenne',
  ingredients: ['pâte à pizza', 'sauce pizza', 'mozzarella', 'jambon', 'ananas']
}, {
  id: 'hummus',
  name: 'Houmous',
  ingredients: ['pois chiches', 'huile d’olive', 'gousses d’ail', 'citron', 'tahini']
}];
```

</Sandpack>

Dans ce code, `<Recipe {...recipe} key={recipe.id} />` est un raccourci syntaxique qui dit « passe toutes les propriétés de l'objet `recipe` comme props au composant `Recipe` ».  Vous pourriez aussi écrire chaque prop explicitement : `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.

**Remarquez que la `key` est spécifié sur le `<Recipe>` lui-même plutôt que sur la `<div>` racine renvoyée par `Recipe`.**  C'est parce que `key` doit figurer directement dans le contexte du tableau environnant.  Précédemment, vous aviez un tableau de `<div>` donc chacune d'elles nécessitait une `key` mais maintenant vous avez un tableau de `<Recipe>`.  En d'autres termes, quand vous extrayez un composant, n'oubliez pas de conserver la `key` hors du JSX que vous copiez-collez.

</Solution>

#### Liste avec séparateur {/*list-with-a-separator*/}

Cet exemple affiche un célèbre haïku de Tachibana Hokushi, dont chaque ligne est enrobée par une balise `<p>`. Votre tâche consiste à insérer un séparateur `<hr />` entre chaque paragraphe.  La structure finale devrait ressembler à ceci :

```js
<article>
  <p>J’écris, efface, réécris</p>
  <hr />
  <p>Efface à nouveau, puis</p>
  <hr />
  <p>Un coquelicot fleurit.</p>
</article>
```

Un haïku contient trois lignes, mais votre solution devrait fonctionner pour un nombre quelconque de lignes.  Remarquez que les éléments `<hr />` n'apparaissent *qu'entre* les éléments `<p>`, donc ni au début ni à la fin !

<Sandpack>

```js
const poem = {
  lines: [
    'J’écris, efface, réécris',
    'Efface à nouveau, puis',
    'Un coquelicot fleurit.'
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

(C'est un des rares cas où l'utilisation de l'index comme clé serait acceptable parce que les lignes du poème ne changeront jamais ni de nombre ni de place.)

<Hint>

Vous aurez besoin soit de convertir le `map` en une boucle manuelle, soit d'utiliser un Fragment.

</Hint>

<Solution>

Vous pouvez écrire une boucle manuelle qui insère les `<hr />` et les `<p>...</p>` dans le tableau résultat au fil de l'eau :

<Sandpack>

```js
const poem = {
  lines: [
    'J’écris, efface, réécris',
    'Efface à nouveau, puis',
    'Un coquelicot fleurit.'
  ]
};

export default function Poem() {
  let output = [];

  // Remplir le tableau résultat
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
  // Retirer le premier <hr />
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

Il ne suffit plus d'utiliser l'index de la ligne comme `key` car chaque séparateur et paragraphe font ici partie du même tableau.  En revanche, vous pouvez leur donner à chacun une clé distincte en utilisant un suffixe, par exemple `key={i + '-text'}`.

Une autre approche consisterait à produire une collection de Fragments qui contiennent chacun `<hr />` et `<p>...</p>`. Attention cependant, la syntaxe concise `<>...</>` ne nous permettrait pas de passer des clés, nous devons donc écrire `<Fragment>` explicitement :

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'J’écris, efface, réécris',
    'Efface à nouveau, puis',
    'Un coquelicot fleurit.'
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

Souvenez-vous que les Fragments (souvent écrits `<> </>`) vous permettent de regrouper des nœuds JSX sans avoir à ajouter des `<div>` superflues !

</Solution>

</Challenges>
