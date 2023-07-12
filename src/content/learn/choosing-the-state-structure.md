---
title: Choisir la structure de l'état
---

<Intro>

Bien structurer l’état peut créer une différence entre un composant agréable à modifier et débugger, et un qui est une source constante de bugs. Voici des conseils que vous devriez prendre en compte pour structurer l’état.

</Intro>

<YouWillLearn>

* Quand utiliser état unique ou multiple
* Les choses à éviter en organisant l’état
* Résoudre des problèmes connus avec la structure de l’état

</YouWillLearn>

## Les principes pour structurer l’état {/*principles-for-structuring-state*/}

Quand vous créez un comoposant qui contient des états, vous devrez faire des choix sur le nombre de variables d’état à utiliser et quelle sera la forme de leurs données. Même si il est possible d’écrire des programmes corrects avec une structure d’état peu optimale, il y a quelques principes qui peuvent vous guider pour faire des meilleurs choix :

1. **Les états de groupe.** Si vous actualisez tout le temps deux variables d’état ou plus à la fois, essayez de les fusionner en une seule variable d’état.
2. **Evitez les contradictions dans l’état.** Quand l’état est stucturé d’une manière où plusieurs parties d’état peuvent être contradictoires et en "désaccord" entre elles, des erreurs peuvent s’induire. Essayez d’éviter cela.
3. **Evitez les états redondants.** Si vous pouvez calculer des informations à partir des props du composant ou d’une de ses variables d'état pendant l’affichage, vous ne devriez pas mettre ces informations dans un état du composant.
4. **Evitez la duplication d’états.** Quand la même donnée est dupliquée entre plusieurs variables d’état ou dans des objets imbriqués, c’est difficile de les garder synchronisées. Réduisez la duplication quand vous le pouvez.
5. **Evitez les états fortement imbriqués** Un état fortement hiérarchisé n’est pas très pratique à actualiser. Quand c’est possible, priorisez une stucture d'état plate.

Le but derrière ces principes est de *rendre l’état simple à actualiser sans ajouter d’erreurs*. Retirer des données redondantes et dupliquées de l’état aide à s’assurer que toutes ses parties restent synchronisées. C’est similaire à comment un ingénieur de bases de données souhaite ["normaliser" la structure de la base de données](https://docs.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description) pour réduire les risques de bugs. Pour reprendre Albert Einstein, **"Créez votre état le plus simple qu’il puisse être, mais pas plus."**

Maintenant voyons comment ces principes s’appliquent concrètement.

## Les états de groupe {/*group-related-state*/}

Vous hésitez peut-être quelques fois entre utiliser une variable d’état simple ou multiple.

Devriez-vous faire ça ?

```js
const [x, setX] = useState(0);
const [y, setY] = useState(0);
```

Ou ça ?

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Techniquement, vous pouvez ces deux approches. Mais **si deux variables changent d’état toujours ensemble, une bonne idée serait de les unir en une seule variable d’état.** Vous n’oublirez pas par la suite de toujours les garder synchronisées, comme dans cet exemple où les mouvements du curseur actualisent les 2 coordonnées du point rouge.

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

Un autre cas où vous pouvez regrouper des données dans un objet ou une liste est lorsque vous ne savez pas combien de parties d'état vous aurez besoin. Par exemple, c’est utile quand vous avez un questionnaire dans lequel l’utilisateur peut ajouter des champs personnalisés.

<Pitfall>

Si votre variable d’état est un objet, souvenez vous que [vous ne pouvez actualiser qu’un seul de ses champs](/learn/updating-objects-in-state) sans explicitement copier les autres champs. Par exemple, vous ne pouvez pas faire `setPosition({ x: 100 })` dans l’exemple ci-dessus car om n’y aurait plus du tout la variable `y` ! À la place, si vous vouliez définir `x` tout seul, vous feriez soit `setPosition({ ...position, x: 100 })`, soit la séparation en deux variables d’état et `setX(100)`.

</Pitfall>

## Evitez les contradictions dans l’état {/*avoid-contradictions-in-state*/}

Voici un questionnaire de satisfaction d’hôtel avec les variables d’état `isSending` et `isSent` :

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
    return <h1>Merci pour votre retour !</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Comment était votre séjour au Prancing Pony ?</p>
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

Même si ce code marche, il laisse la place à des états "impossibles". Par exemple, si vous oubliez d’appeler `setIsSent` et `setIsSending` ensemble, vous pouvez finir dans une situation où les deux variables `isSending` et `isSent` sont à `true` au même moment. Plus votre composant est complexe, plus il est dur de comprendre ce qu’il s’est passé.

**Comme `isSending` et `isSent` ne doivent jamais être à `true` au même moment, il est mieux de les remplacer avec une variable d’état de `statut` qui peut prendre l’un des *trois* états valides :** `'typing'` (initial), `'sending'`, et `'sent'` :

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
    return <h1>Merci pour votre retour !</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Comment était votre séjour au Prancing Pony ?</p>
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

Vous pouvez toujours déclarer des constantes pour plus de lisibilité :

```js
const isSending = status === 'sending';
const isSent = status === 'sent';
```

Mais ce ne sont pas des variables d’état, donc vous ne devez pas vous inquiéter sur leur potentielle désynchronisation.

## Evitez les états redondants. {/*avoid-redundant-state*/}

Si vous pouvez calculer des informations depuis les props d'un composant ou une de ses variables d’état existantes pendant l’affichage vous ne **devriez pas** mettre cette information dans l’état du composant

Par exemple, prenez ce questionnaire. Il marche, mais pouvez-vous trouver des états redondants dans celui-ci ?

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
        Prénom :{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Nom :{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Votre ticket sera délivré à : <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Ce questionnaire possède trois variables d’état : `firstName`, `lastName` et `fullName`. Cependant, `fullName` est redondant. **Vous pouvez toujours calculer `fullName` depuis `firstName` et `lastName` pendant l’affichage, donc retirez-le de l’état.**

Voilà comment vous pouvez faire :

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
        Prénom :{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Nom :{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Votre ticket sera délivré à : <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Ici, `fullName` n’est *pas* une variable d’état. À la place, elle est évaluée pendant l’affichage :

```js
const fullName = firstName + ' ' + lastName;
```

Par conséquent, les gestionnaires de changement n’auront rien à faire pour l’actualiser. Quand vous appelez `setFirstName` ou `setLastName`, vous déclenchez une actualisation de l’affichage, et le prochain `fullName` sera calculé avec les nouvelles données.

<DeepDive>

#### Ne dupliquez pas les props dans l’état {/*don-t-mirror-props-in-state*/}

Un exemple commun d’état redondant est un code de ce type :

```js
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
}
```

Ici, la variable d’état `color` est initialisée à la valeur de la prop `messageColor`. Le problème est que **si le composant parent passe une valeur différente dans `messageColor` plus tard (par exemple, `'rouge'` au lieu de `'bleu'`), la variable d’état `color` ne serait pas mise à jour !** L’état est initialisé seulement durant le premier rendu.

C’est pourquoi la duplication de certaines props dans des variables d’état peut amener à la confusion. À la place, utilisez la prop `messageColor` directement dans votre code. Si vous voulez lui donner un nom plus court, utilisez une constante :

```js
function Message({ messageColor }) {
  const color = messageColor;
}
```

De cette manière, le composant ne sera pas désynchronisé avec la prop passée par le composant parent.
Dupliquer les props dans l’état fait sens uniquement quand vous *voulez* ignorer toutes les mises à jour d’une prop spécifique. Par convention, commencez le nom de la prop par `initial` ou `default` pour préciser que ses nouvelles valeurs seront ignorées :

```js
function Message({ initialColor }) {
  // La variable d’état `couleur` contient la *première* valeur de `initialColor`.
  // Les prochains changements à la prop `initialColor` sont ignorées.
  const [color, setColor] = useState(initialColor);
}
```

</DeepDive>

## Evitez la duplication d’états {/*avoid-duplication-in-state*/}

Ce composant-liste vous laisse choisir un seul voyage parmis plusieurs :

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
      <h2>Quel est votre goûter de voyage ?</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.title}
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Choisir</button>
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

Actuellement, il stocke l’objet selectionné dans la variable d’état `selectedItem`. Cependant, ce n’est pas optimal : **le contenu de `selectedItem` est le même objet que l’un des objets dans la liste `items`.** Cela signifie que les informations sur l’objet lui-même sont dupliquées en deux endroits.

Pourquoi est-ce un problème ? Rendons chaque objet modifiable :

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
      <h2>Quel est votre goûter de voyage ?</h2> 
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
            }}>Choisir</button>
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

Notez que si vous cliquez sur "Choisir" en premier sur un objet *puis* l’éditez, **la saisie se met à jour, mais le label en bas est différent des modifications.** C’est parce que vous avez un état dupliqué, et vous avez oublié de mettre à jour `selectedItem`.

Même si vous pourriez mettre à jour `selectedItem` également, une correction plus simple serait de retirer la duplication. Dans cet exemple, au lieu d’un objet `selectedItem` (qui crée une duplication des objets dans `items`), vous gardez le `selectedId` dans l’état, et *ensuite* obtenez le `selectedItem` en cherchant dans la liste `items` pour un objet avec cet ID :

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
      <h2>Quel est votre goûter de voyage ?</h2>
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
            }}>Choisir</button>
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

(Autrement, vous pouvez garder l’index sélectionné dans l’état.)

L’état était dupliqué de cette façon :

* `items = [{ id: 0, title: 'pretzels'}, ...]`
* `selectedItem = {id: 0, title: 'pretzels'}`

Mais après les changements, il est ainsi :

* `items = [{ id: 0, title: 'pretzels'}, ...]`
* `selectedId = 0`

La duplication est finie, et vous gardez seulement l’état essentiel !

Maintenant si vous modifiez l’objet *selectionné*, le message en dessous sera mis à jour immédiatement. C’est parce que `setItems` déclenche un rendu, et `items.find(...)` doit trouver l’objet avec le titre mis à jour. Vous n’aviez pas besoin de garder *l’objet selectionné* dans l’état, parce que seulement l’*ID sélectionné* est essentiel. Le reste pourrait être calculé pendant le rendu.

## Evitez les états fortement imbriqués {/*avoid-deeply-nested-state*/}


Imaginez un plan de voyage composé de planètes, de continents et de pays. Vous serez sûrement tentés de structurer son état en utlisant des listes et des objets imbriqués, comme dans cet exemple :

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
      <h2>Endroits à visiter</h2>
      <ol>
        {planets.map(place => (
          <PlaceTree key={place.id} place={place} />
        ))}
      </ol>
    </>
  );
}
```

```js places.js active
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
        title: 'Trinidad et Tobago',
        childPlaces: []
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
        title: 'Hong Kong',
        childPlaces: []
      }, {
        id: 22,
        title: 'Inde',
        childPlaces: []
      }, {
        id: 23,
        title: 'Singapour',
        childPlaces: []
      }, {
        id: 24,
        title: 'Corée du Sud',
        childPlaces: []
      }, {
        id: 25,
        title: 'Thaïlande',
        childPlaces: []
      }, {
        id: 26,
        title: 'Vietnam',
        childPlaces: []
      }]
    }, {
      id: 27,
      title: 'Europe',
      childPlaces: [{
        id: 28,
        title: 'Croatie',
        childPlaces: [],
      }, {
        id: 29,
        title: 'France',
        childPlaces: [],
      }, {
        id: 30,
        title: 'Allemagne',
        childPlaces: [],
      }, {
        id: 31,
        title: 'Italie',
        childPlaces: [],
      }, {
        id: 32,
        title: 'Portugal',
        childPlaces: [],
      }, {
        id: 33,
        title: 'Espagne',
        childPlaces: [],
      }, {
        id: 34,
        title: 'Turquie',
        childPlaces: [],
      }]
    }, {
      id: 35,
      title: 'Océanie',
      childPlaces: [{
        id: 36,
        title: 'Australie',
        childPlaces: [],
      }, {
        id: 37,
        title: 'Bora Bora (Polynésie Française)',
        childPlaces: [],
      }, {
        id: 38,
        title: 'ïle de Pâques (Chili)',
        childPlaces: [],
      }, {
        id: 39,
        title: 'Fidji',
        childPlaces: [],
      }, {
        id: 40,
        title: 'Hawaï (USA)',
        childPlaces: [],
      }, {
        id: 41,
        title: 'Nouvelle Zélande',
        childPlaces: [],
      }, {
        id: 42,
        title: 'Vanuatu',
        childPlaces: [],
      }]
    }]
  }, {
    id: 43,
    title: 'Lune',
    childPlaces: [{
      id: 44,
      title: 'Rheita',
      childPlaces: []
    }, {
      id: 45,
      title: 'Piccolomini',
      childPlaces: []
    }, {
      id: 46,
      title: 'Tycho',
      childPlaces: []
    }]
  }, {
    id: 47,
    title: 'Mars',
    childPlaces: [{
      id: 48,
      title: 'Corn Town',
      childPlaces: []
    }, {
      id: 49,
      title: 'Green Hill',
      childPlaces: []      
    }]
  }]
};
```

</Sandpack>

Maintenant disons que vous voulez ajouter un bouton pour supprimer un endroit que vous avez déjà visité. Comment feriez-vous ? [Actualiser des états imbriqués](/learn/updating-objects-in-state#updating-a-nested-object) inclus de faire des copies d’objets depuis l’endroit qui a changé. Supprimer un endroit imbriqué profondément consisterait à copier tout son chemin d’emplacement. Un tel code peut être très long. 

**Si l’état est trop imbriqué pour s’actualiser facilement, préférez le faire "plat".** C’est une manière pour restructurer cette donnée. Au lieu d’une structure arborescente où chaque `place` a une liste des *emplacements de ses enfants*, chaque endroit peut posséder une liste de *l’ID des emplacements de ses enfants*. Stockez une corrélation depuis chaque ID de `place` à la `place` correspondant.

Cette restructuration des données pourrait vous rappeler une table de base de données :

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
      <h2>Endroits à visiter</h2>
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

```js places.js active
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 43, 47],
  },
  1: {
    id: 1,
    title: 'Terre',
    childIds: [2, 10, 19, 27, 35]
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
    title: 'Trinidad et Tobago',
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
    childIds: [20, 21, 22, 23, 24, 25, 26],   
  },
  20: {
    id: 20,
    title: 'Chine',
    childIds: []
  },
  21: {
    id: 21,
    title: 'Hong Kong',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Inde',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Singapour',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Corée du Sud',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Thaïlande',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Vietnam',
    childIds: []
  },
  27: {
    id: 27,
    title: 'Europe',
    childIds: [28, 29, 30, 31, 32, 33, 34],   
  },
  28: {
    id: 28,
    title: 'Croatie',
    childIds: []
  },
  29: {
    id: 29,
    title: 'France',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Allemagne',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Italie',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Portugal',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Espagne',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Turquie',
    childIds: []
  },
  35: {
    id: 35,
    title: 'Océanie',
    childIds: [36, 37, 38, 39, 40, 41, 42],   
  },
  36: {
    id: 36,
    title: 'Australie',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Bora Bora (Polynésie Française)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Ile de Pâques (Chili)',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Fidji',
    childIds: []
  },
  40: {
    id: 40,
    title: 'Hawaï (USA)',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Nouvelle Zélande',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Vanuatu',
    childIds: []
  },
  43: {
    id: 43,
    title: 'Lune',
    childIds: [44, 45, 46]
  },
  44: {
    id: 44,
    title: 'Rheita',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Piccolomini',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Tycho',
    childIds: []
  },
  47: {
    id: 47,
    title: 'Mars',
    childIds: [48, 49]
  },
  48: {
    id: 48,
    title: 'Corn Town',
    childIds: []
  },
  49: {
    id: 49,
    title: 'Green Hill',
    childIds: []
  }
};
```

</Sandpack>

**Maintenant que l’état est "plat" (aussi dit "normalisé"), actualiser les éléments imbriqués devient plus simple**

Afin d’enlever un endroit désormais vous avez seulement besoin d’actualiser deux niveaux d’état:

- La version actualisée de son endroit *parent* devrait exclure l’ID enlevé de sa liste `childIds`.
- La version actualisée du "tableau" d’objet *root* devrait inclure la version actualisée de l’endroit parent.

Voici un exemple de commment vous devriez commencer:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);

  function handleComplete(parentId, childId) {
    const parent = plan[parentId];
    // Créez une nouvelle version de son endroit parent
    // cela n’inclut pas l’ID de son enfant.
    const nextParent = {
      ...parent,
      childIds: parent.childIds
        .filter(id => id !== childId)
    };
    // Actulisez l’état de l’objet d’origine...
    setPlan({
      ...plan,
      // ...pour qu’il ait le parent actualisé
      [parentId]: nextParent
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Endroits à visiter</h2>
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
        Compléter
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

```js places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 43, 47],
  },
  1: {
    id: 1,
    title: 'Terre',
    childIds: [2, 10, 19, 27, 35]
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
    title: 'Trinidad et Tobago',
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
    childIds: [20, 21, 22, 23, 24, 25, 26],   
  },
  20: {
    id: 20,
    title: 'Chine',
    childIds: []
  },
  21: {
    id: 21,
    title: 'Hong Kong',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Inde',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Singapour',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Corée du Sud',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Thaïlande',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Vietnam',
    childIds: []
  },
  27: {
    id: 27,
    title: 'Europe',
    childIds: [28, 29, 30, 31, 32, 33, 34],   
  },
  28: {
    id: 28,
    title: 'Croatie',
    childIds: []
  },
  29: {
    id: 29,
    title: 'France',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Allemagne',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Italie',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Portugal',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Espagne',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Turquie',
    childIds: []
  },
  35: {
    id: 35,
    title: 'Océanie',
    childIds: [36, 37, 38, 39, 40, 41,, 42],   
  },
  36: {
    id: 36,
    title: 'Australie',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Bora Bora (Polynésie Française)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Ile de Pâques (Chili)',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Fidji',
    childIds: []
  },
  40: {
    id: 40,
    title: 'Hawaï (USA)',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Nouvelle Zélande',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Vanuatu',
    childIds: []
  },
  43: {
    id: 43,
    title: 'Lune',
    childIds: [44, 45, 46]
  },
  44: {
    id: 44,
    title: 'Rheita',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Piccolomini',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Tycho',
    childIds: []
  },
  47: {
    id: 47,
    title: 'Mars',
    childIds: [48, 49]
  },
  48: {
    id: 48,
    title: 'Corn Town',
    childIds: []
  },
  49: {
    id: 49,
    title: 'Green Hill',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
```

</Sandpack>

Vous pouvez imbriquer des états autant que vous le voulez, mais les rendre "plats" peut résoudre beaucoup de problèmes. Cela rend les états plus simple à actualiser, et cela aide à être sûr que vous n’avez pas de duplication dans les différentes parties d’un objet imbriqué.

<DeepDive>

#### Améliorer l’utilisation de mémoire {/*improving-memory-usage*/}

Idéalement, vous voudrez aussi enlever les éléments supprimés (et leurs enfants !) depuis l’objet "tableau" pour améliorer l’utilisation de la mémoire. Cette version fait cela. Cela utilise également [Immer](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) pour faire de la logique d’actualisation plus courte.

<Sandpack>

```js
import { useImmer } from 'use-immer';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, updatePlan] = useImmer(initialTravelPlan);

  function handleComplete(parentId, childId) {
    updatePlan(draft => {
      // Enlevez des parents l’ID des endroits enfants
      const parent = draft[parentId];
      parent.childIds = parent.childIds
        .filter(id => id !== childId);

      // Oubliez cet endroit et toute sa descendence. 
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
      <h2>Endroits à visiter</h2>
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
        Compléter
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

```js places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 43, 47],
  },
  1: {
    id: 1,
    title: 'Terre',
    childIds: [2, 10, 19, 27, 35]
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
    title: 'Trinidad et Tobago',
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
    childIds: [20, 21, 22, 23, 24, 25, 26],   
  },
  20: {
    id: 20,
    title: 'Chine',
    childIds: []
  },
  21: {
    id: 21,
    title: 'Hong Kong',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Inde',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Singapour',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Corée du Sud',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Thaïlande',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Vietnam',
    childIds: []
  },
  27: {
    id: 27,
    title: 'Europe',
    childIds: [28, 29, 30, 31, 32, 33, 34],   
  },
  28: {
    id: 28,
    title: 'Croatie',
    childIds: []
  },
  29: {
    id: 29,
    title: 'France',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Allemagne',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Italie',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Portugal',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Espagne',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Turquie',
    childIds: []
  },
  35: {
    id: 35,
    title: 'Océanie',
    childIds: [36, 37, 38, 39, 40, 41,, 42],   
  },
  36: {
    id: 36,
    title: 'Australie',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Bora Bora (Polynésie Française)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Ile de Pâques (Chili)',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Fidji',
    childIds: []
  },
  40: {
    id: 40,
    title: 'Hawaï (USA)',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Nouvelle Zélande',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Vanuatu',
    childIds: []
  },
  43: {
    id: 43,
    title: 'Lune',
    childIds: [44, 45, 46]
  },
  44: {
    id: 44,
    title: 'Rheita',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Piccolomini',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Tycho',
    childIds: []
  },
  47: {
    id: 47,
    title: 'Mars',
    childIds: [48, 49]
  },
  48: {
    id: 48,
    title: 'Corn Town',
    childIds: []
  },
  49: {
    id: 49,
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

Parfois, vous pouvez aussi réduire l’état d’imbrication en déplaçant des états imbriqués dans les composants enfants. Cela fonctionne bien pour les états UI éphémères qui n’ont pas besoin d’être stockés, comme quand un objet est survolé.

<Recap>

* Si deux variables d’état s’actualisent toujours ensemble, pensez à les fusionner en une seule.
* Choississez votre variable d’état précautionneusement pour éviter de créer des "états" impossibles.
* Structurez votre état de manière à réduire les chances que vous fassiez une erreur en l’actualisant.
* Evitez les états dupliqués et redondants pour que vous n’ayez pas besoin de le garder synchronnisés.
* Ne mettez pas des props *dans* un état sauf si vous voulez spécifiquement prévenir les mises à jours.
* Pour les évènements d’UI tels que la sélection, gardez l’ID ou index dans l’état plutôt que l’objet lui-même.
* Si actualiser profondément l’état imbriqué est compliqué, essayez de l’aplatir.

</Recap>

<Challenges>

#### Réparer un composant qui ne s’actualise pas {/*fix-a-component-thats-not-updating*/}

Ce composant `Clock` reçoit deux props : `color` et `time`. Quand vous sélectionnez une couleur différente dans la boîte de sélection, le composant `Clock` reçoit une prop `color` différente de son composant parent. Cependant, la couleur affichée ne s'actualise pas. Pourquoi ? Réglez le problème.

<Sandpack>

```js Clock.js active
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

```js App.js hidden
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
        Choisissez une couleur :{' '}
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

Le problème est que ce composant a un état `color` initialisé avec la valeur initiale de la prop `color`. Mais quand la prop change, cela n’affecte pas la variable d’état ! Donc elles se désynchronisent. Pour régler ce problème, retirez les variables d’état entièrement, et utilisez la prop `color` directement.

<Sandpack>

```js Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  return (
    <h1 style={{ color: props.color }}>
      {props.time}
    </h1>
  );
}
```

```js App.js hidden
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
        Choisissez une couleur :{' '}
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

Ou, avec la syntaxe de destructuration :

<Sandpack>

```js Clock.js active
import { useState } from 'react';

export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js App.js hidden
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
        Choisissez une couleur :{' '}
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

#### Réparer une liste de matériel cassée {/*fix-a-broken-packing-list*/}

Cette liste de matériel possède un pied de page qui affiche combien d’objets sont prêts, et combien d’objets il y a en tout. Il a l’air de marcher au début, mais il est bugué. Par exemple, si vous cochez un objet, puis le supprimez, le compteur ne sera pas mis à jour correctement. Réparez le compteur pour qu’il soit toujours correct.

<Hint>

Y a-t-il un état redondant dans cet exemple ?

</Hint>

<Sandpack>

```js App.js
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
      <b>{packed} sur {total} emballés !</b>
    </>
  );
}
```

```js AddItem.js hidden
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

```js PackingList.js hidden
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

Même si vous pourriez changer chaque gestionnaire d'évènements pour actualiser les compteurs `total` et `packed` correctement, le problème principal est que ces variables d’état existent. Elles sont redondantes parce que vous pouvez toujours calculer le nombre d’objets (emballés ou total) depuis la liste `items` elle même. Retirez l’état redondant pour résoudre le problème :

<Sandpack>

```js App.js
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
      <b>{packed} sur {total} emballés !</b>
    </>
  );
}
```

```js AddItem.js hidden
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

```js PackingList.js hidden
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

Notez comme les gestionnaires d’évènements sont seulement utiles à appeler `setItems` après ce changement. Les compteurs d’objets seront maintenant calculés pendant le prochain rendu depuis la liste `items`, et seront donc toujours à jour.

</Solution>

#### Réparer une sélection qui disparait {/*fix-the-disappearing-selection*/}

Il y a une liste `letters` dans l’état. Quand vous survolez ou cliquez sur une lettre en particulier, elle se met en surbrillance. Le courrier actuellement en surbrillance est stocké dans la variable d’état `highlightedLetter`. Vous pouvez marquer chaque courrier comme "favori" ou "normal", ce qui met à jour la liste `letters` dans l’état.

Ce code marche, mais il y a un bug mineur d’UI. Quand vous appuyez sur "Favori" ou "Retirer", la surbrillance disparait pour un moment. Cependant, elle réaparait dès que vous bougez votre souris ou bougez vers un autre courrier avec le clavier. Pourquoi est-ce que cela se produit ? Réparez le code pour que la surbrillance ne disparaisse pas après le clic sur le bouton.

<Sandpack>

```js App.js
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

```js Letter.js
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
        {letter.isStarred ? 'Retirer' : 'Favori'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js data.js
export const initialLetters = [{
  id: 0,
  subject: 'Prêt pour l’aventure ?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Enregistrez-vous !',
  isStarred: false,
}, {
  id: 2,
  subject: 'Le festival démarre dans seulement SEPT jours !',
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

Le problème est que vous stockez l’objet *letter* dans `highlightedLetter`. Mais vous gardez cette même information dans la liste `letters`. Donc votre état a des duplications ! Quand vous mettez à jour la liste `letters` après le clic sur le bouton, vous créez un nouveau courrier qui est différent de `highlightedLetter`. C’est pourquoi l’expression `highlightedLetter === letter` devient `false` et la surbrillance disparait. Elle réaparait au prochain appel de `setHighlightedLetter` quand la souris se déplace.

Pour régler ce problème, retirez la duplication de l’état. Au lieu de stocker *le courrier lui-même* à deux endroits, stockez le `highlightedId` plutôt. Maintenant vous pouvez vérifier `isHighlighted` pour chaque courrier avec `letter.id === highlightedId`, qui va marcher même si l’objet `letter` a changé depuis le dernier rendu.

<Sandpack>

```js App.js
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

```js Letter.js
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
        {letter.isStarred ? 'Retirer' : 'Favori'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js data.js
export const initialLetters = [{
  id: 0,
  subject: 'Prêt pour l’aventure ?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Enregistrez-vous !',
  isStarred: false,
}, {
  id: 2,
  subject: 'Le festival démarre dans seulement SEPT jours !',
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

Dans cet exemple, chaque `Letter` a une prop `isSelected` et un gestionnaire `onToggle` qui la définit comme sélectionnée. Ca marche, mais l’état est stocké comme un `selectedId` (soit `null` ou un ID), donc seulement un courrier peut être sélectionné à la fois.

Changez la structure de l’état pour gérer la sélection multiple. (Comment le structureriez-vous ? Pensez à ça avant d’écrire le code.) Chaque case doit devenir indépendante des autres. Cliquer sur un courrier sélectionné doit le décocher. Enfin, le bas de page doit afficher le nombre correct d’objets sélectionnés.

<Hint>

Au lieu d’un simple ID sélectionné, vous voulez plutôt enregistrer une liste ou un [Set](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Set) des ID sélectionnés dans l’état.

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedId, setSelectedId] = useState(null);

  // A FAIRE : autoriser la sélection multiple
  const selectedCount = 1;

  function handleToggle(toggledId) {
    // A FAIRE : autoriser la sélection multiple
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
              // A FAIRE : autoriser la sélection multiple
              letter.id === selectedId
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            Vous avez sélectionné {selectedCount} courriers
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js Letter.js
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

```js data.js
export const letters = [{
  id: 0,
  subject: 'Prêt pour l’aventure ?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Enregistrez-vous !',
  isStarred: false,
}, {
  id: 2,
  subject: 'Le festival démarre dans seulement SEPT jours !',
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

À la place d’un simple `selectedId`, enregistrez une *liste* `selectedIds` dans l’état. Par exemple, si vous sélectionnez le premier et le dernier courriers, elle contiendrait `[0, 2]`. Quand rien n’est sélectionné, elle contiendrait une liste vide `[]` :

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState([]);

  const selectedCount = selectedIds.length;

  function handleToggle(toggledId) {
    // Etait-il sélectionné précédemment ?
    if (selectedIds.includes(toggledId)) {
      // Puis retirez l’ID de la liste.
      setSelectedIds(selectedIds.filter(id =>
        id !== toggledId
      ));
    } else {
      // Sinon, ajoutez cet ID dans la liste.
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
            Vous avez sélectionné {selectedCount} courriers
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js Letter.js
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

```js data.js
export const letters = [{
  id: 0,
  subject: 'Prêt pour l’aventure ?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Enregistrez-vous !',
  isStarred: false,
}, {
  id: 2,
  subject: 'Le festival démarre dans seulement SEPT jours !',
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

Un inconvénient mineur d’utiliser une liste est que pour chaque objet, vous appelez `selectedIds.includes(letter.id)` pour vérifier si il est sélectionné. Si la liste est très grande, cela peut devenir un problème de performances car une recherche de liste avec [`includes()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) prend un temps linéair, et vous effectuez cette recherche pour chaque objet.

Pour régler ça, vous pouvez enregistrer un [Set](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Set) dans l’état à la place, qui fournit une fonction [`has()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Set/has) rapide :

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState(
    new Set()
  );

  const selectedCount = selectedIds.size;

  function handleToggle(toggledId) {
    // Créez une copie (pour éviter la mutation).
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
            Vous avez sélectionné {selectedCount} courriers
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js Letter.js
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

```js data.js
export const letters = [{
  id: 0,
  subject: 'Prêt pour l’aventure ?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Enregistrez-vous !',
  isStarred: false,
}, {
  id: 2,
  subject: 'Le festival démarre dans seulement SEPT jours !',
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

Maintenant chaque objet effectue une vérification `selectedIds.has(letter.id)`, ce qui est très rapide.

Gardez en tête que vous [ne devez pas muter des objets dans l’état](/learn/updating-objects-in-state), et cela inclut les Sets aussi. C’est pourquoi la fonction `handleToggle` crée une *copie* de ce Set d’abord, puis met à jour cette copie.

</Solution>

</Challenges>
