---
title: Mettre à jour les tableaux d’un état
---

<Intro>

Les tableaux sont un type d’objet modifiable en JavaScript que vous pouvez stocker dans un état et que vous devez traiter comme étant en lecture seule. Tout comme avec les objets, lorsque vous souhaitez mettre à jour un tableau stocké dans un état, vous devez en créer un nouveau (ou en copier un existant), puis affecter le nouveau tableau dans l’état.

</Intro>

<YouWillLearn>

- Comment ajouter, supprimer ou modifier des éléments dans un tableau dans l'état React
- Comment mettre à jour un objet à l'intérieur d'un tableau
- Comment rendre la copie de tableaux moins répétitive avec Immer

</YouWillLearn>

## Mettre à jour des tableaux sans modification en place {/*updating-arrays-without-mutation*/}

En JavaScript, les tableaux sont des objets comme les autres. [Tout comme avec les objets](/learn/updating-objects-in-state), **vous devez considérer les tableaux dans l'état React comme étant en lecture seule**. Ça signifie que vous ne devez pas réaffecter les éléments à l'intérieur d'un tableau, comme dans `arr[0] = 'oiseau'`, et vous ne devez pas non plus utiliser des méthodes qui modifient le tableau en place, telles que `push()` et `pop()`.

Au lieu de ça, chaque fois que vous souhaitez mettre à jour un tableau, vous devez passer un *nouveau* tableau à la fonction de mise à jour de l'état. Pour cela, vous pouvez créer un nouveau tableau à partir de l'original en utilisant des méthodes non modifiantes telles que `filter()` et `map()`. Ensuite, vous pouvez mettre à jour l'état avec le nouveau tableau résultant.

Voici un tableau de référence des opérations courantes sur les tableaux. Lorsque vous traitez des tableaux dans l'état de React, évitez les méthodes de la colonne de gauche et privilégiez celles de la colonne de droite :

|              | à éviter (modifie le tableau)        | à privilégier (renvoie un nouveau tableau)                                |
| ------------ | ------------------------------------ | ------------------------------------------------------------------------- |
| ajout        | `push`, `unshift`                    | `concat`, syntaxe de *spread* `[...arr]` ([exemple](#adding-to-an-array)) |
| suppression  | `pop`, `shift`, `splice`             | `filter`, `slice` ([exemple](#removing-from-an-array))                    |
| remplacement | `splice`, affectation `arr[i] = ...` | `map` ([exemple](#replacing-items-in-an-array))                           |
| tri          | `reverse`, `sort`                    | copiez d'abord le tableau ([exemple](#making-other-changes-to-an-array))  |

Vous pouvez également [utiliser Immer](#write-concise-update-logic-with-immer) qui vous permet d'utiliser des méthodes des deux colonnes.

<Pitfall>

Malheureusement, [`slice`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) et [`splice`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) ont des noms similaires mais sont très différents :

- `slice` vous permet de copier un tableau ou une partie de celui-ci.
- `splice` **modifie** le tableau (pour insérer ou supprimer des éléments).

En React, vous utiliserez beaucoup plus souvent `slice` (sans le `p` !) car vous ne voulez pas modifier en place les objets ou les tableaux dans l'état. La page [Mettre à jour les objets d'un état](/learn/updating-objects-in-state) explique ce qu'est la modification en place, et pourquoi elle est déconseillée pour l'état.

</Pitfall>

### Ajouter un élément à un tableau {/*adding-to-an-array*/}

`push()` modifiera un tableau, ce que vous ne souhaitez pas faire :

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Sculpteurs inspirants :</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Ajouter</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Au lieu de ça, créez un *nouveau* tableau qui contient les éléments existants *et* un nouvel élément à la fin. Il existe plusieurs façons de le faire, mais la plus simple consiste à utiliser [la syntaxe de *spread* de tableaux](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals) `...` :

```js
setArtists( // Remplace l'état
  [ // par un nouveau tableau
    ...artists, // qui contient tous les anciens éléments
    { id: nextId++, name: name } // et un nouvel élément à la fin
  ]
);
```

Maintenant, ça fonctionne correctement :

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Sculpteurs inspirants :</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Ajouter</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

La syntaxe de *spread* de tableaux permet également d'ajouter un élément au début du tableau en le plaçant *avant* le `...artists` d'origine :

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Place les anciens éléments à la fin
]);
```

De cette manière, l'opérateur de *spread* peut à la fois agir comme `push()`, en ajoutant un élément à la fin d'un tableau, et comme `unshift()`, en ajoutant un élément au début d'un tableau. Essayez de l'utiliser dans le bac à sable ci-dessus !

### Retirer un élément d'un tableau {/*removing-from-an-array*/}

Le moyen le plus simple de retirer un élément d'un tableau consiste à le *filtrer*. En d'autres termes, vous allez créer un nouveau tableau qui ne contiendra pas cet élément. Pour cela, utilisez la méthode `filter` des tableaux, par exemple:

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Sculpteurs inspirants :</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Cliquez sur le bouton « Supprimer » plusieurs fois et observez son gestionnaire de clics.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Ici, `artists.filter(a => a.id !== artist.id)` signifie « crée un tableau comprenant les `artists` dont les IDs sont différents de `artist.id` ». En d'autres termes, le bouton « Supprimer » de chaque artiste filtre _cet_ artiste du tableau, puis demande un nouveau rendu avec le tableau résultant. Notez que `filter` ne modifie pas le tableau d'origine.

### Transformer un tableau {/*transforming-an-array*/}

Si vous souhaitez modifier tout ou partie des éléments du tableau, vous pouvez utiliser `map()` pour créer un **nouveau** tableau. La fonction que vous passerez à `map` décidera quoi faire avec chaque élément en fonction de ses données ou de son index (ou les deux).

Dans cet exemple, un tableau contient les coordonnées de deux cercles et d'un carré. Lorsque vous appuyez sur le bouton, seuls les cercles sont déplacés de 50 pixels vers le bas. On y parvient en produisant un nouveau tableau de données à l'aide de `map()` :

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // Pas de changement
        return shape;
      } else {
        // Renvoie un nouveau cercle décalé de 50px vers le bas
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Nouveau rendu avec le nouveau tableau
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Déplacez les cercles vers le bas !
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### Remplacer des éléments dans un tableau {/*replacing-items-in-an-array*/}

Il est très courant de vouloir remplacer un ou plusieurs éléments dans un tableau. Les affectations telles que `arr[0] = 'oiseau'` modifient le tableau d'origine, vous devrez donc encore une fois plutôt utiliser `map`.

Pour remplacer un élément, créez un nouveau tableau avec `map`. À l'intérieur de votre appel à `map`, vous recevrez l'index de l'élément comme deuxième argument. Utilisez-le pour décider s'il faut renvoyer l'élément d'origine (premier argument) ou autre chose :

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Incrémente le compteur cliqué
        return c + 1;
      } else {
        // Les autres n'ont pas changé
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### Insérer un élément dans un tableau {/*inserting-into-an-array*/}

Parfois, vous souhaiterez peut-être insérer un élément à une position spécifique qui n'est ni au début ni à la fin du tableau. Pour cela, vous pouvez utiliser la syntaxe de *spread* de tableaux `...` combinée avec la méthode `slice()`. La méthode `slice()` vous permet de découper une « tranche » du tableau. Pour insérer un élément, vous créerez un nouveau tableau qui contiendra la « tranche » _avant_ le point d'insertion, puis le nouvel élément, et enfin le reste du tableau d'origine.

Dans cet exemple, le bouton Insérer insère toujours à l'index `1` :

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Peut être n’importe quel index
    const nextArtists = [
      // Éléments avant le point d’insertion :
      ...artists.slice(0, insertAt),
      // Nouvel élément :
      { id: nextId++, name: name },
      // Éléments après le point d’insertion :
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Sculpteurs inspirants :</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insérer
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### Apporter d'autres modifications à un tableau {/*making-other-changes-to-an-array*/}

Il y a certaines choses que vous ne pouvez pas faire en utilisant seulement la syntaxe de *spread* et des méthodes non modifiantes telles que `map()` et `filter()`. Par exemple, vous pourriez vouloir inverser ou trier un tableau. Les méthodes `reverse()` et `sort()` de JavaScript modifient le tableau d'origine, vous ne pouvez donc pas les utiliser directement.

**Cependant, vous pouvez d'abord copier le tableau, puis apporter des modifications à cette copie.**

Par exemple :

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Inverser
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Ici, vous utilisez d'abord la syntaxe de *spread* `[...list]` pour créer une copie du tableau d'origine. Maintenant que vous avez une copie, vous pouvez utiliser des méthodes modifiantes comme `nextList.reverse()` ou `nextList.sort()`, ou même affecter individuellement des éléments avec `nextList[0] = "quelque chose"`.

Cependant, **même si vous copiez un tableau, vous ne pouvez pas modifier directement les éléments existants _à l'intérieur_ de celui-ci.** C'est parce que la copie est superficielle : le nouveau tableau contiendra les mêmes éléments que le tableau d'origine. Ainsi, si vous modifiez un objet à l'intérieur du tableau copié, vous modifiez l'état existant. Par exemple, le code suivant est problématique.

```js
const nextList = [...list];
nextList[0].seen = true; // Problème : modifie list[0]
setList(nextList);
```

Bien que `nextList` et `list` soient deux tableaux différents, **`nextList[0]` et `list[0]` pointent vers le même objet.** Donc, en modifiant `nextList[0].seen`, vous modifiez également `list[0].seen`. C'est une mutation de l'état, que vous devez éviter ! Vous pouvez résoudre ce problème de la même manière que pour [mettre à jour des objets JavaScript imbriqués](/learn/updating-objects-in-state#updating-a-nested-object) en copiant les éléments individuels que vous souhaitez changer au lieu de les modifier. Voici comment faire.

## Mettre à jour des objets dans des tableaux {/*updating-objects-inside-arrays*/}

Les objets ne sont pas _vraiment_ « à l'intérieur » des tableaux. Ils peuvent sembler être « à l'intérieur » dans le code, mais chaque objet dans un tableau est une valeur distincte vers laquelle le tableau « pointe ». C'est pourquoi vous devez faire attention lorsque vous modifiez des champs imbriqués tels que `list[0]`. La liste d'œuvres d'art d'une autre personne peut pointer vers le même élément du tableau !

**Lorsque vous mettez à jour un état imbriqué, vous devez créer des copies à partir de l'endroit où vous souhaitez effectuer la mise à jour, en remontant jusqu’au plus haut niveau.** Voyons comment ça fonctionne.

Dans cet exemple, deux listes d'œuvres d'art séparées ont le même état initial. Elles sont censées être isolées, mais à cause d'une modification directe, leur état est accidentellement partagé, et cocher une case dans l'une des listes affecte l'autre liste :

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Liste d’œuvres d’art</h1>
      <h2>Ma liste à voir absolument :</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Votre liste à voir absolument :</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Le problème se trouve dans du code comme celui-ci :

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Problème : modifie un élément existant
setMyList(myNextList);
```

Bien que le tableau `myNextList` soit nouveau, les *éléments eux-mêmes* sont les mêmes que dans le tableau `myList` d'origine. Donc, en changeant `artwork.seen`, vous modifiez l'œuvre d'art *d'origine*. Cette œuvre d'art est également dans `yourList`, ce qui provoque le bug. Des bugs comme celui-ci peuvent être difficiles à comprendre, mais heureusement, ils n'ont pas lieu si vous évitez de modifier l'état.

**Vous pouvez utiliser `map` pour remplacer un ancien élément par sa nouvelle version sans mutation.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Crée un *nouvel* objet avec les modifications
    return { ...artwork, seen: nextSeen };
  } else {
    // Pas de changement
    return artwork;
  }
}));
```

Ici, `...` est la syntaxe de *spread* d'objets utilisée pour [créer une copie d'un objet](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax).

Avec cette approche, aucun des éléments de l'état existant n'est modifié et le bug est corrigé :

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Crée un *nouvel* objet avec les modifications
        return { ...artwork, seen: nextSeen };
      } else {
        // Pas de changement
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Crée un *nouvel* objet avec les modifications
        return { ...artwork, seen: nextSeen };
      } else {
        // Pas de changement
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Liste d’œuvres d’art</h1>
      <h2>Ma liste à voir absolument :</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Votre liste à voir absolument :</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

En général, **vous ne devriez modifier que les objets que vous venez de créer**. Si vous insérez une *nouvelle* œuvre d'art, vous pouvez la modifier, mais si vous traitez quelque chose qui est déjà dans l'état, vous devez faire une copie.

### Écrire une logique de mise à jour concise avec Immer {/*write-concise-update-logic-with-immer*/}

Mettre à jour des tableaux imbriqués sans modification directe peut conduire à du code un peu répétitif. [Tout comme avec les objets](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) :

- En général, vous ne devriez pas avoir besoin de mettre à jour l'état à plus de quelques niveaux de profondeur. Si vos objets d'état sont très profonds, vous pouvez envisager de [les restructurer différemment](/learn/choosing-the-state-structure#avoid-deeply-nested-state) pour les rendre plus plats.
- Si vous ne souhaitez pas changer la structure de votre état, vous préférerez peut-être utiliser [Immer](https://github.com/immerjs/use-immer), qui vous permet d’écrire votre code en utilisant une syntaxe pratique mais modifiante, et se charge de produire les copies pour vous.

Voici l'exemple de la liste des œuvres d'art réécrit avec Immer :

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Liste d’œuvres d’art</h1>
      <h2>Ma liste à voir absolument :</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Votre liste à voir absolument :</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Notez qu'avec Immer, **une mutation comme `artwork.seen = nextSeen` est désormais autorisée :**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

C'est parce que vous ne modifiez pas l'état _d'origine_, mais un objet `draft` spécial fourni par Immer. De même, vous pouvez appliquer des méthodes modifiantes telles que `push()` et `pop()` au contenu du `draft`.

En interne, Immer construit toujours le prochain état à partir de zéro en fonction des changements que vous avez apportés au `draft`. Ça permet de garder des gestionnaires d'événements très concis sans jamais modifier l'état directement.

<Recap>

- Vous pouvez mettre des tableaux dans l'état, mais vous ne pouvez pas les modifier.
- Au lieu de modifier un tableau, créez une *nouvelle* version de celui-ci et mettez à jour l'état avec cette nouvelle version.
- Vous pouvez utiliser la syntaxe de *spread* de tableaux `[...arr, newItem]` pour créer des tableaux avec de nouveaux éléments.
- Vous pouvez utiliser `filter()` et `map()` pour créer de nouveaux tableaux avec des éléments filtrés ou transformés.
- Vous pouvez utiliser Immer pour garder votre code concis.

</Recap>



<Challenges>

#### Mettre à jour un élément dans le panier {/*update-an-item-in-the-shopping-cart*/}

Complétez la logique de `handleIncreaseClick` de manière à ce que lorsqu'on appuie sur « + », la quantité de produit correspondante augmente :

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Fromage',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Vous pouvez utiliser la fonction `map` pour créer un nouveau tableau, puis utiliser la syntaxe de *spread* d'objets `...` pour créer une copie de l'objet modifié pour le nouveau tableau :

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Fromage',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Retirer un article du panier {/*remove-an-item-from-the-shopping-cart*/}

Ce panier d'achat dispose d'un bouton « + » fonctionnel, mais le bouton « – » ne fait rien. Vous devez lui ajouter un gestionnaire d'événement pour qu'en appuyant dessus, le `count` du produit correspondant diminue. Si vous appuyez sur « – » lorsque le count est à 1, le produit devrait automatiquement être retiré du panier. Assurez-vous qu'il n'affiche jamais 0.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Fromage',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Vous pouvez d'abord utiliser `map` pour créer un nouveau tableau, puis `filter` pour supprimer les produits avec un `count` égal à `0` :

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Fromage',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Basculer vers des méthodes non modifiantes {/*fix-the-mutations-using-non-mutative-methods*/}

Dans cet exemple, tous les gestionnaires d'événements dans `App.js` utilisent des modifications en place. Par conséquent, la modification et la suppression des tâches ne fonctionnent pas. Réécrivez `handleAddTodo`, `handleChangeTodo` et `handleDeleteTodo` en utilisant des méthodes non modifiantes :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Acheter du lait', done: true },
  { id: 1, title: 'Manger des tacos', done: false },
  { id: 2, title: 'Infuser du thé', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Ajouter une tâche"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Ajouter</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Sauvegarder
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Modifier
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Supprimer
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

Dans `handleAddTodo`, vous pouvez utiliser la syntaxe de *spread* de tableaux. Dans `handleChangeTodo`, vous pouvez créer un nouveau tableau avec `map`. Dans `handleDeleteTodo`, vous pouvez créer un nouveau tableau avec `filter`. À présent, la liste fonctionne correctement :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Acheter du lait', done: true },
  { id: 1, title: 'Manger des tacos', done: false },
  { id: 2, title: 'Infuser du thé', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Ajouter une tâche"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Ajouter</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Sauvegarder
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Modifier
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Supprimer
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>


#### Corriger les modifications en utilisant Immer {/*fix-the-mutations-using-immer*/}

Il s'agit du même exemple que dans l'exercice précédent. Cette fois-ci, corrigez les modifications en utilisant Immer. Pour vous faciliter la tâche, `useImmer` est déjà importé, vous devez donc modifier la variable d'état `todos` pour l'utiliser.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Acheter du lait', done: true },
  { id: 1, title: 'Manger des tacos', done: false },
  { id: 2, title: 'Infuser du thé', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Ajouter une tâche"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Ajouter</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Sauvegarder
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Modifier
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Supprimer
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution>

Avec Immer, vous pouvez écrire du code de manière modifiante, tant que vous ne modifiez que des parties du `draft` que Immer vous fournit. Ici, toutes les modifications sont effectuées sur le `draft` de sorte que le code fonctionne bien :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Acheter du lait', done: true },
  { id: 1, title: 'Manger des tacos', done: false },
  { id: 2, title: 'Infuser du thé', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Ajouter une tâche"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Ajouter</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Sauvegarder
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Modifier
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Supprimer
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Vous pouvez également combiner les approches modifiantes et non modifiantes avec Immer.

Par exemple, dans cette version, `handleAddTodo` est implémenté en modifiant le `draft` d'Immer, tandis que `handleChangeTodo` et `handleDeleteTodo` utilisent les méthodes non modifiantes `map` et `filter` :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Acheter du lait', done: true },
  { id: 1, title: 'Manger des tacos', done: false },
  { id: 2, title: 'Infuser du thé', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Ajouter une tâche"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Ajouter</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Sauvegarder
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Modifier
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Supprimer
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Avec Immer, vous pouvez choisir l'approche qui vous semble la plus appropriée selon le cas rencontré.

</Solution>

</Challenges>
