---
title: Choisir la structure de l’état
---

<Intro>

Bien structurer l’état peut faire toute la différence entre un composant agréable à modifier et déboguer, et un composant qui est une source constante de bugs. Voici des conseils que vous devriez prendre en compte pour structurer vos états.

</Intro>

<YouWillLearn>

* Quand utiliser une vs. plusieurs variables d'état
* Les pièges à éviter en organisant l’état
* Comment résoudre les problèmes courants de structure de l’état

</YouWillLearn>

## Principes de structuration d’état {/*principles-for-structuring-state*/}

Quand vous créez un composant qui contient des états, vous devez faire des choix sur le nombre de variables d’état à utiliser et la forme de leurs données. Même s'il est possible d’écrire des programmes corrects avec une structure d’état sous-optimale, il y a quelques principes qui peuvent vous guider pour faire de meilleurs choix :

1. **Regroupez les états associés.** Si vous mettez tout le temps à jour plusieurs variables d’état à la fois, essayez de les fusionner en une seule variable d’état.
2. **Évitez les contradictions dans l’état.** Quand l’état est structuré de sorte que plusieurs parties d’état puissent être contradictoires, des erreurs peuvent survenir. Essayez d’éviter ça.
3. **Évitez les états redondants.** Si vous pouvez calculer des informations à partir des props du composant ou de ses variables d'état existantes pendant le rendu, vous ne devriez pas mettre ces informations dans un état du composant.
4. **Évitez la duplication d’états.** Lorsque la même donnée est dupliquée entre plusieurs variables d’état ou dans des objets imbriqués, il devient difficile de les garder synchronisées. Réduisez la duplication dans toute la mesure du possible.
5. **Évitez les états fortement imbriqués.** Un état fortement hiérarchisé n’est pas très pratique à mettre à jour. Quand c’est possible, priorisez une structure d'état plate.

Ces principes visent à *rendre l’état simple à actualiser sans créer d’erreurs*. Retirer les données redondantes et dupliquées de l’état aide à s’assurer que toutes ses parties restent synchronisées. C’est un peu comme un ingénieur de bases de données qui souhaite [« normaliser » la structure de la base de données](https://learn.microsoft.com/fr-fr/office/troubleshoot/access/database-normalization-description) pour réduire les risques de bugs. Pour paraphraser Albert Einstein : **« Faites que votre état soit le plus simple possible — mais pas plus simple. »**

Maintenant voyons comment ces principes s’appliquent concrètement.

## Regrouper les états associés {/*group-related-state*/}

Vous hésitez peut-être parfois entre utiliser une ou plusieurs variables d’état.

Devriez-vous faire ça ?

```js
const [x, setX] = useState(0);
const [y, setY] = useState(0);
```

Ou ça ?

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Techniquement, les deux approches sont possibles. Mais **si deux variables d’état changent toujours ensemble, ce serait une bonne idée de les réunir en une seule variable d’état**. Vous n’oublierez ainsi pas ensuite de les garder synchronisées, comme dans cet exemple où les mouvements du curseur mettent à jour les deux coordonnées du point rouge.

<Sandpack>

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

Une autre situation dans laquelle vous pouvez regrouper des données dans un objet ou une liste, c'est lorsque vous ne savez pas à l'avance de combien d'éléments d'état vous aurez besoin. Par exemple, c’est utile pour un formulaire dans lequel l’utilisateur peut ajouter des champs personnalisés.

<Pitfall>

Si votre variable d’état est un objet, souvenez-vous que [vous ne pouvez pas mettre à jour qu’un seul champ](/learn/updating-objects-in-state) sans explicitement copier les autres champs. Par exemple, vous ne pouvez pas faire `setPosition({ x: 100 })` dans l’exemple ci-dessus car il n’y aurait plus du tout la propriété `y` ! Au lieu de ça, si vous vouliez définir `x` tout seul, soit vous feriez `setPosition({ ...position, x: 100 })`, soit vous découperiez l'information en deux variables d’état et feriez `setX(100)`.

</Pitfall>

## Évitez les contradictions dans l’état {/*avoid-contradictions-in-state*/}

Voici un questionnaire de satisfaction d’hôtel avec les variables d’état `isSending` et `isSent` :

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) {
    return <h1>Merci pour votre retour !</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Comment était votre séjour au Poney Fringant ?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Envoyer
      </button>
      {isSending && <p>Envoi...</p>}
    </form>
  );
}

// Prétend envoyer un message.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

Même si ce code marche, il laisse la place à des états « impossibles ». Par exemple, si vous oubliez d’appeler `setIsSent` et `setIsSending` ensemble, vous pouvez finir dans une situation où les deux variables `isSending` et `isSent` sont à `true` au même moment. Plus votre composant est complexe, plus il est dur de comprendre ce qu’il s’est passé.

**Comme `isSending` et `isSent` ne doivent jamais être à `true` au même moment, il est préférable de les remplacer par une variable d’état `status` qui peut prendre l’un des *trois* états valides :** `'typing'` (initial), `'sending'`, et `'sent'` :

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('typing');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    await sendMessage(text);
    setStatus('sent');
  }

  const isSending = status === 'sending';
  const isSent = status === 'sent';

  if (isSent) {
    return <h1>Merci pour votre retour !</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Comment était votre séjour au Poney Fringant ?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Envoyer
      </button>
      {isSending && <p>Envoi...</p>}
    </form>
  );
}

// Prétend envoyer un message.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

Vous pouvez toujours déclarer quelques constantes pour plus de lisibilité :

```js
const isSending = status === 'sending';
const isSent = status === 'sent';
```

Mais ce ne sont pas des variables d’état, vous n'avez donc pas à vous soucier de leur désynchronisation.

## Évitez les états redondants {/*avoid-redundant-state*/}

Si vous pouvez calculer certaines informations depuis les props d’un composant ou une de ses variables d’état existantes pendant le rendu, vous ne **devez pas** mettre ces informations dans l’état du composant

Par exemple, prenez ce formulaire. Il marche, mais pouvez-vous y trouver un état redondant ?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Enregistrons votre arrivée</h2>
      <label>
        Prénom :{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Nom :{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Votre billet sera au nom de : <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Ce formulaire possède trois variables d’état : `firstName`, `lastName` et `fullName`. Cependant, `fullName` est redondant. **Vous pouvez toujours calculer `fullName` depuis `firstName` et `lastName` pendant le rendu, donc retirez-le de l’état.**

Voici comment vous pouvez faire :

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Enregistrons votre arrivée</h2>
      <label>
        Prénom :{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Nom :{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Votre billet sera au nom de : <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Ici, `fullName` n’est *pas* une variable d’état. Elle est plutôt évaluée pendant le rendu :

```js
const fullName = firstName + ' ' + lastName;
```

Par conséquent, les gestionnaires de changement n’auront rien à faire pour le mettre à jour. Lorsque vous appelez `setFirstName` ou `setLastName`, vous déclenchez un nouveau rendu, et le prochain `fullName` sera calculé à partir des nouvelles données.

<DeepDive>

#### Ne dupliquez pas les props dans l’état {/*don-t-mirror-props-in-state*/}

Un exemple commun d’état redondant recourt à ce genre de code :

```js
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
}
```

Ici, la prop `messageColor` est passée comme valeur initiale de la variable d’état `color`. Le problème est que **si le composant parent transmet une valeur différente dans `messageColor` plus tard (par exemple, `'red'` au lieu de `'blue'`), la variable d’état `color` ne sera pas mise à jour** ! L’état est seulement initialisé lors du rendu initial.

C’est pourquoi la "duplication" de certaines props dans des variables d’état peut être déroutante. Utilisez de préférence directement la prop `messageColor` dans votre code. Si vous voulez lui donner un nom plus court, utilisez une constante :

```js
function Message({ messageColor }) {
  const color = messageColor;
}
```

De cette manière, le composant ne sera pas désynchronisé avec la prop qui lui aura été transmise par le composant parent.

« Dupliquer » les props dans l’état n'est pertinent que lorsque vous *voulez* ignorer toutes les mises à jour d’une certaine prop. Par convention, ajoutez `initial` ou `default` au début du nom de la prop pour préciser que ses nouvelles valeurs seront ignorées :

```js
function Message({ initialColor }) {
  // La variable d’état `color` contient la *première* valeur de `initialColor`.
  // Les changements ultérieurs de la prop `initialColor` seront ignorés.
  const [color, setColor] = useState(initialColor);
}
```

</DeepDive>

## Évitez la duplication d’états {/*avoid-duplication-in-state*/}

Ce composant de carte de menu vous permet de choisir un seul en-cas de voyage parmi plusieurs :

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'bretzels', id: 0 },
  { title: 'algues croustillantes', id: 1 },
  { title: 'paquet de princes', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  return (
    <>
      <h2>Quel est votre goûter de voyage ?</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.title}
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Choisissez</button>
          </li>
        ))}
      </ul>
      <p>Vous avez choisi {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

À ce stade, il stocke l’élément selectionné en tant qu’objet dans la variable d’état `selectedItem`. Cependant, ce n’est pas optimal : **le contenu de `selectedItem` est le même objet que l’un des éléments de la liste `items`.** Ça signifie que les informations relatives à l’élément sont dupliquées à deux endroits.

Pourquoi est-ce un problème ? Rendons chaque objet modifiable :

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'bretzels', id: 0 },
  { title: 'algues croustillantes', id: 1 },
  { title: 'paquet de princes', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>Quel est votre goûter de voyage ?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Choisissez</button>
          </li>
        ))}
      </ul>
      <p>Vous avez choisi {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

Remarquez que si vous cliquez d’abord sur « Choisissez » un élément *puis* que vous le modifiez, **le champ se met à jour, mais le libellé en bas reste inchangé**. C’est parce que vous avez dupliqué l’état, et que vous avez oublié de mettre à jour `selectedItem`.

Même si vous pourriez également mettre à jour `selectedItem`, une solution plus simple consiste à supprimer la duplication. Dans cet exemple, au lieu d’un objet `selectedItem` (ce qui crée une duplication des éléments dans `items`), vous gardez le `selectedId` dans l’état, *puis* obtenez le `selectedItem` en cherchant dans la liste `items` un élément avec cet ID :

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'bretzels', id: 0 },
  { title: 'algues croustillantes', id: 1 },
  { title: 'paquet de princes', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  const selectedItem = items.find(item =>
    item.id === selectedId
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>Quel est votre goûter de voyage ?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedId(item.id);
            }}>Choisissez</button>
          </li>
        ))}
      </ul>
      <p>Vous avez choisi {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

L’état était dupliqué de cette façon :

* `items = [{ id: 0, title: 'pretzels'}, ...]`
* `selectedItem = {id: 0, title: 'pretzels'}`

Mais après nos changements, il a la structure suivante :

* `items = [{ id: 0, title: 'pretzels'}, ...]`
* `selectedId = 0`

La duplication a disparu, et vous ne conservez que l’état essentiel !

Maintenant si vous modifiez l’élément *sélectionné*, le message en dessous sera mis à jour immédiatement. C’est parce que `setItems` déclenche un nouveau rendu, et `items.find(...)` trouve l’élément dont le titre a été mis à jour. Il n’est pas nécessaire de conserver *l’objet sélectionné* dans l’état, car seul l’*ID sélectionné* est essentiel. Le reste peut être calculé lors du rendu.

## Évitez les états fortement imbriqués {/*avoid-deeply-nested-state*/}


Imaginez un plan de voyage composé de planètes, de continents et de pays. Vous pourriez être tenté·e de structurer son état à l’aide de listes et d’objets imbriqués, comme dans cet exemple :

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ place }) {
  const childPlaces = place.childPlaces;
  return (
    <li>
      {place.title}
      {childPlaces.length > 0 && (
        <ol>
          {childPlaces.map(place => (
            <PlaceTree key={place.id} place={place} />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const planets = plan.childPlaces;
  return (
    <>
      <h2>Lieux à visiter</h2>
      <ol>
        {planets.map(place => (
          <PlaceTree key={place.id} place={place} />
        ))}
      </ol>
    </>
  );
}
```

```js src/places.js active
export const initialTravelPlan = {
  id: 0,
  title: '(Root)',
  childPlaces: [{
    id: 1,
    title: 'Terre',
    childPlaces: [{
      id: 2,
      title: 'Afrique',
      childPlaces: [{
        id: 3,
        title: 'Botswana',
        childPlaces: []
      }, {
        id: 4,
        title: 'Egypte',
        childPlaces: []
      }, {
        id: 5,
        title: 'Kenya',
        childPlaces: []
      }, {
        id: 6,
        title: 'Madagascar',
        childPlaces: []
      }, {
        id: 7,
        title: 'Maroc',
        childPlaces: []
      }, {
        id: 8,
        title: 'Nigéria',
        childPlaces: []
      }, {
        id: 9,
        title: 'Afrique du Sud',
        childPlaces: []
      }]
    }, {
      id: 10,
      title: 'Amérique',
      childPlaces: [{
        id: 11,
        title: 'Argentine',
        childPlaces: []
      }, {
        id: 12,
        title: 'Brésil',
        childPlaces: []
      }, {
        id: 13,
        title: 'Barbade',
        childPlaces: []
      }, {
        id: 14,
        title: 'Canada',
        childPlaces: []
      }, {
        id: 15,
        title: 'Jamaïque',
        childPlaces: []
      }, {
        id: 16,
        title: 'Mexique',
        childPlaces: []
      }, {
        id: 17,
        title: 'Trinité-et-Tobté-et-childPlaces: []
      }, {
        id: 18,
        title: 'Venezuela',
        childPlaces: []
      }]
    }, {
      id: 19,
      title: 'Asie',
      childPlaces: [{
        id: 20,
        title: 'Chine',
        childPlaces: []
      }, {
        id: 21,
        title: 'Inde',
        childPlaces: []
      }, {
        id: 22,
        title: 'Singapour',
        childPlaces: []
      }, {
        id: 23,
        title: 'Corée du Sud',
        childPlaces: []
      }, {
        id: 24,
        title: 'Thaïlande',
        childPlaces: []
      }, {
        id: 25,
        title: 'Viêt Nam',
        childPlaces: []
      }]
    }, {
      id: 26,
      title: 'Europe',
      childPlaces: [{
        id: 27,
        title: 'Croatie',
        childPlaces: [],
      }, {
        id: 28,
        title: 'France',
        childPlaces: [],
      }, {
        id: 29,
        title: 'Allemagne',
        childPlaces: [],
      }, {
        id: 30,
        title: 'Italie',
        childPlaces: [],
      }, {
        id: 31,
        title: 'Portugal',
        childPlaces: [],
      }, {
        id: 32,
        title: 'Espagne',
        childPlaces: [],
      }, {
        id: 33,
        title: 'Turquie',
        childPlaces: [],
      }]
    }, {
      id: 34,
      title: 'Océanie',
      childPlaces: [{
        id: 35,
        title: 'Australie',
        childPlaces: [],
      }, {
        id: 36,
        title: 'Bora Bora (Polynésie française)',
        childPlaces: [],
      }, {
        id: 37,
        title: 'Île de Pâques (Chili)',
        childPlaces: [],
      }, {
        id: 38,
        title: 'Fidji',
        childPlaces: [],
      }, {
        id: 39,
        title: 'Hawaï (États-Unis)',
        childPlaces: [],
      }, {
        id: 40,
        title: 'Nouvelle-Zélande',
        childPlaces: [],
      }, {
        id: 41,
        title: 'Vanuatu',
        childPlaces: [],
      }]
    }]
  }, {
    id: 42,
    title: 'Lune',
    childPlaces: [{
      id: 43,
      title: 'Rheita',
      childPlaces: []
    }, {
      id: 44,
      title: 'Piccolomini',
      childPlaces: []
    }, {
      id: 45,
      title: 'Tycho',
      childPlaces: []
    }]
  }, {
    id: 46,
    title: 'Mars',
    childPlaces: [{
      id: 47,
      title: 'Corn Town',
      childPlaces: []
    }, {
      id: 48,
      title: 'Green Hill',
      childPlaces: []
    }]
  }]
};
```

</Sandpack>

Imaginons maintenant que vous souhaitiez ajouter un bouton pour supprimer un lieu que vous avez déjà visité. Comment procéder ? [La mise à jour d’un état imbriqué](/learn/updating-objects-in-state#updating-a-nested-object) implique de faire des copies des objets en remontant depuis la partie qui a changé. Supprimer un lieu profondément imbriqué consisterait à copier tous les niveaux supérieurs. Un tel code peut être très long.

**Si l’état est trop imbriqué pour être mis à jour facilement, envisagez de « l’aplatir ».** Voici une façon de restructurer ces données. Au lieu d’une structure arborescente où chaque *lieu* possède une liste de *ses lieux enfants*, chaque lieu peut posséder une liste des *ID de ses lieux enfants*. Vous pouvez alors stocker une table de correspondance entre chaque ID de lieu et le lieu correspondant.

Cette restructuration des données pourrait vous rappeler une table de base de données :

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ id, placesById }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      {childIds.length > 0 && (
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              placesById={placesById}
            />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Lieux à visiter</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            placesById={plan}
          />
        ))}
      </ol>
    </>
  );
}
```

```js src/places.js active
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Terre',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Afrique',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  },
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypte',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  },
  7: {
    id: 7,
    title: 'Maroc',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigéria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'Afrique du Sud',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Amerique',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],
  },
  11: {
    id: 11,
    title: 'Argentine',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brésil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbade',
    childIds: []
  },
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaïque',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexique',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinité-et-Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asie',
    childIds: [20, 21, 22, 23, 24, 25],
  },
  20: {
    id: 20,
    title: 'Chine',
    childIds: []
  },
  21: {
    id: 21,
    title: 'India',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapour',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Corée du Sud',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Thaïlande',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Viêt Nam',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europe',
    childIds: [27, 28, 29, 30, 31, 32, 33],
  },
  27: {
    id: 27,
    title: 'Croatie',
    childIds: []
  },
  28: {
    id: 28,
    title: 'France',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Allemagne',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Italie',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Turquie',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Océanie',
    childIds: [35, 36, 37, 38, 39, 40, 41],
  },
  35: {
    id: 35,
    title: 'Australie',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (Polynésie française)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Île de Pâques (Chili)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fidji',
    childIds: []
  },
  39: {
    id: 40,
    title: 'Hawaï (USA)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'Nouvelle-Zélande',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Lune',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Tycho',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Mars',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
    childIds: []
  }
};
```

</Sandpack>

**Maintenant que l’état est « plat » (on pourrait aussi dire « normalisé »), mettre à jour des éléments imbriqués devient plus simple.**

Désormais, afin d’enlever un lieu, vous n'avez besoin de mettre à jour que deux niveaux d’état :

- La version à jour de son lieu *parent* devrait exclure l’ID supprimé de sa liste `childIds`.
- La version à jour de la « table » racine d’objets doit inclure la version à jour du lieu parent.

Voici un exemple de comment vous pourriez procéder :

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);

  function handleComplete(parentId, childId) {
    const parent = plan[parentId];
    // Créer une nouvelle version du lieu parent
    // qui n’inclut pas l’ID de son enfant.
    const nextParent = {
      ...parent,
      childIds: parent.childIds
        .filter(id => id !== childId)
    };
    // Mettre à jour l’état de l’objet d’origine...
    setPlan({
      ...plan,
      // ...pour qu’il ait le parent à jour
      [parentId]: nextParent
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Lieux à visiter</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        C’est fait
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```

```js src/places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Terre',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Afrique',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  },
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypte',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  },
  7: {
    id: 7,
    title: 'Maroc',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigéria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'Afrique du Sud',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Amérique',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],
  },
  11: {
    id: 11,
    title: 'Argentine',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brésil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbade',
    childIds: []
  },
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaïque',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexique',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinité-et-Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asie',
    childIds: [20, 21, 22, 23, 24, 25],
  },
  20: {
    id: 20,
    title: 'Chine',
    childIds: []
  },
  21: {
    id: 21,
    title: 'India',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapour',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Corée du Sud',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Thaïlande',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Viêt Nam',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europe',
    childIds: [27, 28, 29, 30, 31, 32, 33],
  },
  27: {
    id: 27,
    title: 'Croatie',
    childIds: []
  },
  28: {
    id: 28,
    title: 'France',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Allemagne',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Italie',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Turquie',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Océanie',
    childIds: [35, 36, 37, 38, 39, 40, 41],
  },
  35: {
    id: 35,
    title: 'Australie',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (Polynésie française)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Île de Pâques (Chili)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fidji',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Hawaï (États-Unis)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'Nouvelle-Zélande',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Lune',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Tycho',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Mars',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
```

</Sandpack>

Vous pouvez imbriquer des états autant que vous le souhaitez, mais les rendre « plats » peut résoudre de nombreux problèmes. Ça facilite la mise à jour de l’état, et ça permet de s’assurer qu’il n’y a pas de duplication dans les différentes parties d’un objet imbriqué.

<DeepDive>

#### Consommer moins de mémoire {/*improving-memory-usage*/}

Idéalement, vous devriez également enlever les éléments supprimés (et leurs enfants !) depuis l’objet « table » pour consommer moins de mémoire. C’est ce que fait cette version. Elle utilise également [Immer](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) pour rendre la logique de mise à jour plus concise.

<Sandpack>

```js
import { useImmer } from 'use-immer';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, updatePlan] = useImmer(initialTravelPlan);

  function handleComplete(parentId, childId) {
    updatePlan(draft => {
      // Retirer des ID de lieux enfants du parent.
      const parent = draft[parentId];
      parent.childIds = parent.childIds
        .filter(id => id !== childId);

      // Oublier cet endroit et tout ce qu'il contient.
      deleteAllChildren(childId);
      function deleteAllChildren(id) {
        const place = draft[id];
        place.childIds.forEach(deleteAllChildren);
        delete draft[id];
      }
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Lieux à visiter</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        C’est fait
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```

```js src/places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Terre',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Afrique',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  },
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypte',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  },
  7: {
    id: 7,
    title: 'Maroc',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigéria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'Afrique du Sud',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Amérique',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],
  },
  11: {
    id: 11,
    title: 'Argentine',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brésil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbade',
    childIds: []
  },
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaïque',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexique',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinité-et-Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asie',
    childIds: [20, 21, 22, 23, 24, 25,],
  },
  20: {
    id: 20,
    title: 'Chine',
    childIds: []
  },
  21: {
    id: 21,
    title: 'India',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapour',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Corée du Sud',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Thaïlande',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Viêt Nam',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europe',
    childIds: [27, 28, 29, 30, 31, 32, 33],
  },
  27: {
    id: 27,
    title: 'Croatie',
    childIds: []
  },
  28: {
    id: 28,
    title: 'France',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Allemagne',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Italie',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Turquie',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Océanie',
    childIds: [35, 36, 37, 38, 39, 40,, 41],
  },
  35: {
    id: 35,
    title: 'Australie',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (Polynésie française)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Île de Pâques (Chili)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fidji',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Hawaï (États-Unis)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'Nouvelle-Zélande',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Lune',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Tycho',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Mars',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
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

</DeepDive>

Parfois, vous pouvez aussi réduire l’imbrication des états en déplaçant une partie de l’état imbriqué dans les composants enfants. C'est bien adapté aux états éphémères de l’UI qui n’ont pas besoin d’être stockés, comme le fait de savoir si un élément est survolé.

<Recap>

* Si deux variables d’état sont toujours mises à jour ensemble, envisagez de les fusionner en une seule.
* Choisissez soigneusement vos variables d’état pour éviter de créer des états « impossibles ».
* Structurez votre état de manière à réduire les risques d’erreur lors de sa mise à jour.
* Evitez les états dupliqués et redondants afin de ne pas avoir à les synchroniser.
* Ne mettez pas de props *dans* un état à moins que vous ne vouliez spécifiquement empêcher les mises à jour.
* Pour les interactions telles que la sélection d'élément, conservez l’ID ou l’index dans l’état au lieu de référencer l’objet lui-même.
* Si la mise à jour d’un état profondément imbriqué est compliquée, essayez de l’aplatir.

</Recap>

<Challenges>

#### Réparer un composant qui ne s’actualise pas {/*fix-a-component-thats-not-updating*/}

Ce composant `Clock` reçoit deux props : `color` et `time`. Lorsque vous sélectionnez une couleur différente dans la boîte de sélection, le composant `Clock` reçoit une prop `color` différente depuis son composant parent. Cependant, la couleur affichée n’est pas mise à jour. Pourquoi ? Corrigez le problème.

<Sandpack>

```js src/Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  const [color, setColor] = useState(props.color);
  return (
    <h1 style={{ color: color }}>
      {props.time}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Choisissez une couleur :{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

<Solution>

Le problème, c'est que ce composant a un état `color` initialisé avec la valeur initiale de la prop `color`. Mais quand la prop change, ça n’affecte pas la variable d’état ! Donc elles se désynchronisent. Pour régler ce problème, retirez carrément la variable d’état, et utilisez directement la prop `color`.

<Sandpack>

```js src/Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  return (
    <h1 style={{ color: props.color }}>
      {props.time}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Choisissez une couleur :{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

Ou en utilisant la syntaxe de déstructuration :

<Sandpack>

```js src/Clock.js active
import { useState } from 'react';

export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Choisissez une couleur :{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

</Solution>

#### Réparer une liste d’affaires cassée {/*fix-a-broken-packing-list*/}

Cette liste d'affaires possède un pied de page qui indique le nombre d'objets déjà dans les bagages, et le nombre total d’objets. Ça semble fonctionner au début, mais il y a des bugs. Par exemple, si vous cochez un article puis le supprimez, le compteur ne sera pas mis à jour correctement. Corrigez le compteur pour qu’il soit toujours juste.

<Hint>

Y a-t-il un état redondant dans cet exemple ?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Chaussettes chaudes', packed: true },
  { id: 1, title: 'Journal de voyage', packed: false },
  { id: 2, title: 'Aquarelles', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(3);
  const [packed, setPacked] = useState(1);

  function handleAddItem(title) {
    setTotal(total + 1);
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    if (nextItem.packed) {
      setPacked(packed + 1);
    } else {
      setPacked(packed - 1);
    }
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setTotal(total - 1);
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>{packed} sur {total} dans la valise !</b>
    </>
  );
}
```

```js src/AddItem.js hidden
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Ajouter un objet"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>Ajouter</button>
    </>
  )
}
```

```js src/PackingList.js hidden
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            Supprimer
          </button>
        </li>
      ))}
    </ul>
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

Bien que vous puissiez modifier soigneusement chaque gestionnaire d'événement pour mettre à jour correctement les compteurs `total` et `packed`, le problème principal est que ces variables d’état existent. Elles sont redondantes car vous pouvez toujours calculer le nombre d’éléments (emballés ou au total) depuis la liste `items` elle même. Supprimez les états redondants pour corriger le bug :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Chaussettes chaudes', packed: true },
  { id: 1, title: 'Journal de voyage', packed: false },
  { id: 2, title: 'Aquarelles', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);

  const total = items.length;
  const packed = items
    .filter(item => item.packed)
    .length;

  function handleAddItem(title) {
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>{packed} sur {total} dans la valise !</b>
    </>
  );
}
```

```js src/AddItem.js hidden
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Ajouter un objet"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>Ajouter</button>
    </>
  )
}
```

```js src/PackingList.js hidden
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            Supprimer
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

Notez comme les gestionnaires d’événements se préoccupent désormais uniquement d'appeler `setItems`. Les compteurs d’objets seront maintenant calculés pendant le prochain rendu depuis la liste `items`, et seront donc toujours à jour.

</Solution>

#### Réparer une sélection qui disparaît {/*fix-the-disappearing-selection*/}

Il y a une liste de `letters` dans l’état. Lorsque vous survolez ou cliquez sur un courrier particulier, celui-ci est mis en surbrillance. Le courrier actuellement en surbrillance est stocké dans la variable d’état `highlightedLetter`. Vous pouvez marquer chaque courrier comme "épinglé" ou "normal", ce qui met à jour la liste `letters` dans l’état.

Ce code fonctionne, mais il y a un bug mineur d’UI. Quand vous appuyez sur « Épingler » ou « Désépingler », la surbrillance disparaît pendant un moment. Cependant, elle réapparaît dès que vous déplacez votre curseur ou passez à un autre courrier avec le clavier. Que se passe-t-il ? Corrigez le problème pour que la surbrillance ne disparaisse pas après le clic sur le bouton.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedLetter, setHighlightedLetter] = useState(null);

  function handleHover(letter) {
    setHighlightedLetter(letter);
  }

  function handleStar(starred) {
    setLetters(letters.map(letter => {
      if (letter.id === starred.id) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>Boîte de réception</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter === highlightedLetter
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter);
      }}
      onPointerMove={() => {
        onHover(letter);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter);
      }}>
        {letter.isStarred ? 'Désépingler' : 'Épingler'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js src/data.js
export const initialLetters = [{
  id: 0,
  subject: 'Prêt pour l’aventure ?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Enregistrez-vous !',
  isStarred: false,
}, {
  id: 2,
  subject: 'Le festival démarre dans seulement SEPT jours !',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

<Solution>

Le problème tient à ce que vous stockez l’objet *letter* dans `highlightedLetter`. Mais vous gardez cette même information dans la liste `letters`. Il y a donc duplication dans votre état ! Quand vous mettez à jour la liste `letters` après avoir cliqué sur le bouton, vous créez un nouvel objet courrier qui est différent de `highlightedLetter`. C’est pourquoi l’expression `highlightedLetter === letter` devient `false` et la surbrillance disparait. Elle réapparaît la prochaine fois que vous appelez `setHighlightedLetter` lorsque le pointeur se déplace.

Pour résoudre ce problème, supprimez la duplication de l’état. Au lieu de stocker *le courrier lui-même* à deux endroits, stockez plutôt le `highlightedId`. Ensuite vous pouvez vérifier `isHighlighted` pour chaque courrier avec `letter.id === highlightedId`, ce qui fonctionnera même si l’objet `letter` a changé depuis le dernier rendu.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedId, setHighlightedId ] = useState(null);

  function handleHover(letterId) {
    setHighlightedId(letterId);
  }

  function handleStar(starredId) {
    setLetters(letters.map(letter => {
      if (letter.id === starredId) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>Boîte de réception</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter.id === highlightedId
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter.id);
      }}
      onPointerMove={() => {
        onHover(letter.id);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter.id);
      }}>
        {letter.isStarred ? 'Désépingler' : 'Épingler'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js src/data.js
export const initialLetters = [{
  id: 0,
  subject: 'Prêt pour l’aventure ?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Enregistrez-vous !',
  isStarred: false,
}, {
  id: 2,
  subject: 'Le festival démarre dans seulement SEPT jours !',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

</Solution>

#### Implémenter une sélection multiple {/*implement-multiple-selection*/}

Dans cet exemple, chaque `Letter` possède une prop `isSelected` et un gestionnaire `onToggle` qui la marque comme étant sélectionnée. Ça fonctionne, mais l’état est stocké sous la forme d’un `selectedId` (soit `null` soit un ID), de sorte qu’un seul courrier peut être sélectionné à la fois.

Modifiez la structure de l’état pour prendre en charge la sélection multiple. (Comment le structureriez-vous ? Réfléchissez-y avant d’écrire le code.) Chaque case à cocher doit devenir indépendante des autres. Le fait de cliquer sur un courrier sélectionné devrait le décocher. Enfin, le pied de page doit afficher le nombre correct d’éléments sélectionnés.

<Hint>

Au lieu d’un simple ID sélectionné, vous voulez plutôt enregistrer une liste ou un [Set](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Set) des ID sélectionnés dans l’état.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedId, setSelectedId] = useState(null);

  // TODO: autoriser la sélection multiple
  const selectedCount = 1;

  function handleToggle(toggledId) {
    // TODO: autoriser la sélection multiple
    setSelectedId(toggledId);
  }

  return (
    <>
      <h2>Boîte de réception</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              // TODO: autoriser la sélection multiple
              letter.id === selectedId
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            Vous avez sélectionné {selectedCount} courrier(s)
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js src/data.js
export const letters = [{
  id: 0,
  subject: 'Prêt pour l’aventure ?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Enregistrez-vous !',
  isStarred: false,
}, {
  id: 2,
  subject: 'Le festival démarre dans seulement SEPT jours !',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

<Solution>

Au lieu d’un simple `selectedId`, enregistrez une *liste* `selectedIds` dans l’état. Par exemple, si vous sélectionnez le premier et le dernier courrier, elle contiendrait `[0, 2]`. Quand rien n’est sélectionné, elle contiendrait une liste vide `[]` :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState([]);

  const selectedCount = selectedIds.length;

  function handleToggle(toggledId) {
    // Était-il sélectionné avant ?
    if (selectedIds.includes(toggledId)) {
      // Alors retirer l’ID de la liste.
      setSelectedIds(selectedIds.filter(id =>
        id !== toggledId
      ));
    } else {
      // Sinon, ajouter cet ID dans la liste.
      setSelectedIds([
        ...selectedIds,
        toggledId
      ]);
    }
  }

  return (
    <>
      <h2>Boîte de réception</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.includes(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            Vous avez sélectionné {selectedCount} courrier(s)
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js src/data.js
export const letters = [{
  id: 0,
  subject: 'Prêt pour l’aventure ?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Enregistrez-vous !',
  isStarred: false,
}, {
  id: 2,
  subject: 'Le festival démarre dans seulement SEPT jours !',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

Utiliser un tableau présente un léger inconvénient : pour chaque élément, vous appelez `selectedIds.includes(letter.id)` pour vérifier s'il est sélectionné. Si la liste est très grande, ça peut devenir un problème de performances car rechercher dans une liste avec [`includes()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) prend un temps linéaire, et vous effectuez cette recherche pour chaque élément.

Pour résoudre ce problème, vous pouvez plutôt utiliser un [Set](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Set) dans l’état, qui fournit une fonction [`has()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Set/has) rapide :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState(
    new Set()
  );

  const selectedCount = selectedIds.size;

  function handleToggle(toggledId) {
    // Créer une copie (pour éviter la mutation).
    const nextIds = new Set(selectedIds);
    if (nextIds.has(toggledId)) {
      nextIds.delete(toggledId);
    } else {
      nextIds.add(toggledId);
    }
    setSelectedIds(nextIds);
  }

  return (
    <>
      <h2>Boîte de réception</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.has(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            Vous avez sélectionné {selectedCount} courrier(s)
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js src/data.js
export const letters = [{
  id: 0,
  subject: 'Prêt pour l’aventure ?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Enregistrez-vous !',
  isStarred: false,
}, {
  id: 2,
  subject: 'Le festival démarre dans seulement SEPT jours !',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

Maintenant chaque élément effectue une vérification `selectedIds.has(letter.id)`, ce qui est très rapide.

Gardez en tête que vous [ne devez pas modifier des objets dans l’état](/learn/updating-objects-in-state), et ça inclut aussi les Sets. C’est pourquoi la fonction `handleToggle` crée d’abord une *copie* de ce Set, puis la met à jour.

</Solution>

</Challenges>
