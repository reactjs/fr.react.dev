---
title: Mettre à jour les objets d’un état
---

<Intro>

Un état peut contenir n'importe quel type de valeur JavaScript, y compris des objets. Cependant, vous ne devez pas changer directement les objets que vous stockez dans l’état React. Au lieu de ça, lorsque vous souhaitez mettre à jour un objet, vous devez en créer un nouveau (ou faire une copie de l’existant), puis mettre à jour l’état pour utiliser cette copie.

</Intro>

<YouWillLearn>

- Comment mettre à jour correctement un objet dans l’état de React
- Comment mettre à jour un objet imbriqué sans le modifier
- Ce qu'est l’immutabilité, et comment la préserver
- Comment rendre la copie d’objet moins répétitive avec Immer

</YouWillLearn>

## Qu’est-ce qu’une mutation ? {/*whats-a-mutation*/}

Vous pouvez stocker n’importe quel type de valeur JavaScript dans l’état.

```js
const [x, setX] = useState(0);
```

Jusqu’à présent, vous avez travaillé avec des nombres, des chaînes de caractères et des booléens. Ces types de valeurs JavaScript sont « immuables », c’est-à-dire qu’ils ne peuvent pas être modifiés ou sont en « lecture seule ». Vous pouvez déclencher un nouveau rendu pour *remplacer* une valeur :

```js
setX(5);
```

L’état `x` est passé de `0` à `5`, mais le *nombre `0` lui-même* n’a pas changé. Il est impossible en JavaScript de modifier les valeurs primitives comme les nombres, les chaînes de caractères et les booléens.

À présent, considérons un objet dans l’état :

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Techniquement, il est possible de modifier le contenu de *l’objet lui-même*. **C’est ce qu’on appelle une mutation :**

```js
position.x = 5;
```

Cependant, bien que des objets dans un état React soient techniquement modifiables, vous devez les traiter *comme s’ils étaient immuables* — au même titre que les nombres, les booléens et les chaînes de caractères. Au lieu de les modifier, vous devriez toujours les remplacer.

## Traiter l’état comme en lecture seule {/*treat-state-as-read-only*/}

En d’autres termes, vous devez **considérer tout objet JavaScript que vous placez dans l’état comme étant en lecture seule**.

Cet exemple utilise un objet dans l’état pour représenter la position actuelle du pointeur. Le point rouge est censé se déplacer lorsque vous touchez ou déplacez le curseur sur la zone de prévisualisation. Mais le point reste dans la position initiale :

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
        position.x = e.clientX;
        position.y = e.clientY;
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
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

Le problème se situe dans cette partie du code.

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

Ce code modifie l’objet affecté à `position` lors du [rendu précédent](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time). Mais faute d'utiliser la fonction de mise à jour de l’état, React ne se rend pas compte que l’objet a changé. Par conséquent, React ne réagit pas. Ce serait comme essayer de changer une commande après avoir déjà mangé le repas. Bien que la mutation de l’état puisse fonctionner dans certains cas, nous la déconseillons. Vous devriez considérer la valeur de l’état que vous lisez lors d’un rendu comme étant en lecture seule.

Pour effectivement [déclencher un nouveau rendu](/learn/state-as-a-snapshot#setting-state-triggers-renders) dans cet exemple, **créez un nouvel objet et passez-le à la fonction de mise à jour de l’état :**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

Avec `setPosition`, vous indiquez à React :

- Remplace `position` par ce nouvel objet
- Et refais le rendu ce composant

Voyez comme le point rouge suit désormais votre pointeur lorsque vous le touchez ou le survolez dans la zone de prévisualisation :

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
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### La mutation locale est acceptable {/*local-mutation-is-fine*/}

Le code suivant pose problème car il modifie un objet *existant* dans l’état :

```js
position.x = e.clientX;
position.y = e.clientY;
```

Mais le code suivant est **tout à fait acceptable** car vous modifiez en réalité un nouvel objet que *vous venez de créer* :

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

En fait, ça revient à écrire ceci :

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

La mutation pose problème uniquement lorsque vous modifiez des objets *existants* qui se trouvent déjà dans l’état. Modifier un objet que vous venez de créer est acceptable car *aucun autre code ne le référence encore*. Le modifier ne risque pas d’affecter accidentellement quelque chose qui en dépend. C’est ce qu’on appelle une « mutation locale ». Vous pouvez même effectuer une mutation locale [pendant le rendu](/learn/keeping-components-pure#local-mutation-your-components-little-secret). C’est très pratique et tout à fait acceptable !

</DeepDive>

## Copier des objets avec la syntaxe de *spread* {/*copying-objects-with-the-spread-syntax*/}

Dans l’exemple précédent, l’objet `position` est toujours recréé à partir de la position actuelle du curseur. Ceci dit, vous voudrez souvent inclure des données *existantes* au sein du nouvel objet que vous créez. Par exemple, vous souhaiterez peut-être mettre à jour *un seul champ* dans un formulaire, tout en conservant les valeurs précédentes des autres champs.

Ces champs de saisie ne fonctionnent pas car les gestionnaires `onChange` modifient l’état :

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        Prénom :
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Nom de famille :
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        E-mail :
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Par exemple, cette ligne modifie l’état à partir d’un rendu précédent :

```js
person.firstName = e.target.value;
```

La manière fiable d’obtenir le comportement que vous recherchez consiste à créer un nouvel objet et à le passer à `setPerson`. Mais ici, vous souhaitez également **copier les données existantes**, puisqu'un seul des champs a changé :

```js
setPerson({
  firstName: e.target.value, // Nouveau prénom venant du champ de saisie
  lastName: person.lastName,
  email: person.email
});
```

Vous pouvez utiliser la syntaxe de [*spread* sur objets](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Spread_syntax#utiliser_la_d%C3%A9composition_avec_les_litt%C3%A9raux_objet) `...` afin de ne pas devoir manuellement copier chaque propriété individuellement.

```js
setPerson({
  ...person, // Copie des anciens champs
  firstName: e.target.value // Mais on remplace celui-ci
});
```

Maintenant, le formulaire fonctionne !

Remarquez que vous n’avez pas déclaré une variable d’état distincte pour chaque champ de saisie. Pour les grands formulaires, regrouper toutes les données dans un objet est très pratique, à condition de les mettre à jour correctement !

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        Prénom :
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Nom de famille :
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        E-mail :
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Notez que la syntaxe de *spread* `...` est « superficielle » : elle ne réalise une copie des propriétés que sur un niveau. Ça la rend rapide, mais ça signifie également que si vous souhaitez mettre à jour une propriété imbriquée, vous devrez utiliser cette syntaxe plusieurs fois.

<DeepDive>

#### Utiliser un seul gestionnaire d’événement pour plusieurs champs {/*using-a-single-event-handler-for-multiple-fields*/}

Vous pouvez également utiliser les crochets `[` et `]` à l’intérieur de la définition de votre objet pour spécifier une propriété avec un nom dynamique. Voici le même exemple, mais avec un seul gestionnaire d’événement au lieu de trois différents :

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        Prénom :
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Nom de famille :
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        E-mail :
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Ici, `e.target.name` fait référence à la propriété `name` de l’élément DOM `<input>`.

</DeepDive>

## Mettre à jour un objet imbriqué {/*updating-a-nested-object*/}

Considérons une structure d’objet imbriquée comme celle-ci :

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

Si vous souhaitez mettre à jour `person.artwork.city`, c'est facile avec une mutation :

```js
person.artwork.city = 'New Delhi';
```

Mais avec React, l’état doit être traité comme immuable ! Pour modifier `city`, vous devez d’abord produire le nouvel objet `artwork` (pré-rempli avec les données de l’objet précédent), puis produire le nouvel objet `person` qui pointe vers le nouvel `artwork` :

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

En une seule instruction, ça donnerait ceci :

```js
setPerson({
  ...person, // Copie les autres champs
  artwork: { // mais remplace l’œuvre d’art
    ...person.artwork, // par la même œuvre d’art
    city: 'New Delhi' // mais à New Delhi !
  }
});
```

Ça devient un peu verbeux, mais ça fonctionne bien dans de nombreux cas :

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Nom :
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Titre :
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Ville :
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image :
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' par '}
        {person.name}
        <br />
        (situé à {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<DeepDive>

#### Les objets ne sont pas réellement imbriqués {/*objects-are-not-really-nested*/}

Un objet comme celui-ci semble « imbriqué » dans le code :

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

Cependant, l’« imbrication » est une façon inexacte d’envisager le comportement des objets. Lorsque le code s’exécute, il n’existe pas d’objet « imbriqué ». Il s’agit en fait de deux objets distincts :

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

L’objet `obj1` n’est en réalité pas « à l’intérieur » de `obj2`. Par exemple, `obj3` pourrait également « pointer » vers `obj1` :

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

Si vous modifiiez `obj3.artwork.city`, ça affecterait à la fois `obj2.artwork.city` et `obj1.city`. C’est parce qu'`obj3.artwork`, `obj2.artwork` et `obj1` sont le même objet. C’est difficile à percevoir quand on considère les objets comme « imbriqués ». Il s’agit plutôt d’objets distincts qui « pointent » les uns vers les autres à l’aide de propriétés.

</DeepDive>

### Écrire une logique de mise à jour concise avec Immer {/*write-concise-update-logic-with-immer*/}

Si votre état est profondément imbriqué, vous envisagerez peut-être de [l’aplanir](/learn/choosing-the-state-structure#avoid-deeply-nested-state). Mais si vous ne voulez pas modifier la structure de votre état, vous préférerez peut-être un raccourci aux *spreads* imbriqués. [Immer](https://github.com/immerjs/use-immer) est une bibliothèque populaire qui vous permet d’écrire votre code en utilisant une syntaxe pratique mais modifiante, et se charge de produire les copies pour vous. Avec Immer, le code que vous écrivez semble « enfreindre les règles » et modifier un objet :

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

Mais contrairement à une mutation classique, ça n’écrase pas l’état précédent !

<DeepDive>

#### Comment fonctionne Immer ? {/*how-does-immer-work*/}

Le `draft` fourni par Immer est un type spécial d’objet JavaScript, appelé [Proxy](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Proxy), qui « enregistre » ce que vous faites avec. C’est pourquoi vous pouvez le modifier autant que vous le souhaitez ! Sous le capot, Immer détermine quelles parties du `draft` ont été modifiées et produit un tout nouvel objet qui contient vos modifications.

</DeepDive>

Pour essayer Immer :

1. Exécutez `npm install use-immer` pour ajouter Immer en tant que dépendance
2. Remplacez alors `import { useState } from 'react'` par `import { useImmer } from 'use-immer'`.

Voici l’exemple ci-dessus converti en Immer :

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Nom :
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Titre :
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Ville :
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image :
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' par '}
        {person.name}
        <br />
        (situé à {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
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

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

Remarquez à quel point les gestionnaires d’événements sont devenus plus concis. Vous pouvez mélanger et combiner `useState` et `useImmer` dans un seul composant autant que vous le souhaitez. Immer est un excellent moyen de garder les gestionnaires de mise à jour concis, surtout s’il y a des niveaux d’imbrication dans votre état, et que la copie des objets conduit à un code répétitif.

<DeepDive>

#### Pourquoi déconseiller la mutation d’état dans React ? {/*why-is-mutating-state-not-recommended-in-react*/}

Il y a plusieurs raisons :

- **Débogage :** si vous utilisez `console.log` et que vous ne modifiez pas l’état, vos anciens logs ne seront pas écrasés par les changements d’état plus récents. Vous pouvez donc voir clairement comment l’état a changé entre les rendus.
- **Optimisations :** les [stratégies d’optimisation](/reference/react/memo) courantes de React reposent sur la possibilité de sauter des étapes si les propriétés ou l’état précédents sont identiques aux suivants. Si vous ne modifiez jamais l’état, vérifier s’il y a eu des changements peut être très rapide. Si `prevObj === obj`, vous pouvez être certain·e qu’aucun changement n’a pu se produire à l’intérieur de celui-ci.
- **Nouvelles fonctionnalités :** les nouvelles fonctionnalités de React que nous développons reposent sur le fait que l’état est [traité comme un instantané](/learn/state-as-a-snapshot). Si vous modifiez des versions précédentes de l’état, ça peut vous empêcher d’utiliser les nouvelles fonctionnalités.
- **Changements de besoin :** certaines fonctionnalités d’application, comme l’implémentation d’actions pour annuler/rétablir, l’affichage d’un historique des modifications ou la possibilité de réinitialiser un formulaire à des valeurs antérieures, sont plus faciles à réaliser lorsque rien n’est modifié. Ceci est dû au fait que vous pouvez conserver en mémoire des copies passées de l’état et les réutiliser lorsque c’est pertinent. Si vous adoptez une approche modifiante dès le départ, il peut être difficile d’ajouter ultérieurement ce type de fonctionnalités.
- **Implémentation simplifiée :** puisque React ne repose pas sur la mutation, il n’a pas besoin de faire quoi que ce soit de spécial avec vos objets. Il n’a pas besoin de trafiquer leurs propriétés, de toujours les envelopper dans des proxies ou de réaliser d’autres actions à l’initialisation, comme le font de nombreuses solutions « réactives ». C’est également la raison pour laquelle React vous permet de mettre n’importe quel objet dans l’état, quelle que soit sa taille, sans que ça cause des problèmes de performances ou d’exactitude.

En pratique, vous pouvez souvent « vous en sortir » en modifiant directement l’état dans React, mais nous vous conseillons fortement de ne pas le faire afin de pouvoir utiliser les nouvelles fonctionnalités de React développées dans cette optique. Les futurs contributeurs, et peut-être vous-même, vous en seront reconnaissants !

</DeepDive>

<Recap>

- Traitez tous les états dans React comme étant immuables.
- Lorsque vous stockez des objets dans l’état, les modifier ne déclenchera pas de rendus et modifiera l’état dans les « instantanés » issus de rendus précédents.
- Au lieu de modifier un objet, créez une *nouvelle* version de celui-ci et déclenchez un nouveau rendu en définissant l’état sur cette nouvelle version.
- Vous pouvez utiliser la syntaxe de *spread* d’objet `{...obj, something: 'newValue'}` pour créer des copies d’objets existants.
- La syntaxe de *spread* est superficielle : elle ne copie qu’à un niveau de profondeur.
- Pour mettre à jour un objet imbriqué, vous devez créer des copies à partir de l’endroit où vous effectuez la mise à jour, en remontant jusqu’au plus haut niveau de l’objet.
- Pour réduire le code requis pour créer des copies d’objet, utilisez Immer.

</Recap>

<Challenges>

#### Corriger les mises à jour incorrectes de l’état {/*fix-incorrect-state-updates*/}

Ce formulaire comporte quelques bugs. Cliquez sur le bouton qui augmente le score plusieurs fois. Remarquez qu’il n’augmente pas. Ensuite, modifiez le prénom et remarquez que le score a soudainement « rattrapé » vos modifications. Enfin, modifiez le nom de famille et remarquez que le score a complètement disparu.

Votre tâche consiste à corriger tous ces bugs. En les corrigeant, expliquez pourquoi chacun d’entre eux se produit.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        Prénom :
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Nom de famille :
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Voici une version avec les deux bugs corrigés :

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        Prénom :
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Nom de famille :
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Le problème avec `handlePlusClick`, c'était qu’elle modifiait l’objet `player`. Par conséquent, React ne savait pas qu’il devait effectuer un nouveau rendu et ne mettait pas à jour le score à l’écran. C’est pourquoi, lorsque vous avez modifié le prénom, l’état a été mis à jour, déclenchant un nouveau rendu qui a *aussi* mis à jour le score à l’écran.

Le problème avec `handleLastNameChange` était qu’elle ne copiait pas les champs existants de `...player` dans le nouvel objet. C’est pourquoi le score était perdu après avoir modifié le nom de famille.

</Solution>

#### Repérer et corriger la mutation {/*find-and-fix-the-mutation*/}

Il y a une boîte déplaçable sur un arrière-plan fixe. Vous pouvez changer la couleur de la boîte en utilisant le menu déroulant.

Mais il y a un bug. Si vous déplacez d’abord la boîte, puis changez sa couleur, l’arrière-plan (qui n’est pas censé bouger !) va « sauter » jusqu’à la position de la boîte. Mais ça ne devrait pas se produire : la propriété `position` du composant `Background` est définie sur `initialPosition`, qui est `{ x: 0, y: 0 }`. Pourquoi l’arrière-plan bouge-t-il après le changement de couleur ?

Trouvez le bug et corrigez-le.

<Hint>

S’il y a un changement inattendu, il y a une mutation. Trouvez la mutation dans `App.js` et corrigez-la.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Déplacez-moi !
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Le problème était dans la mutation à l’intérieur de `handleMove`. Elle modifiait `shape.position`, mais il s’agit du même objet que celui pointé par `initialPosition`. C’est pourquoi la forme et l’arrière-plan se déplacent tous les deux. (C’est une mutation, donc le changement ne se reflète à l’écran que lorsqu’une mise à jour non liée — le changement de couleur — déclenche un nouveau rendu.)

La solution consiste à retirer la mutation de `handleMove` et à utiliser la syntaxe de *spread* pour copier la forme. Notez que `+=` est une mutation, vous devez donc la réécrire en utilisant une opération `+` classique.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Déplacez-moi !
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Mettre à jour un objet avec Immer {/*update-an-object-with-immer*/}

Il s’agit du même exemple défectueux que dans l’exercice précédent. Cette fois-ci, corrigez la mutation en utilisant Immer. Pour vous faciliter la tâche, `useImmer` est déjà importé, vous devez donc modifier la variable d’état `shape` pour l’utiliser.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Déplacez-moi !
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

Voici la solution réécrite avec Immer. Voyez comme les gestionnaires d’événements sont écrits de manière modifiante, pourtant le bug est absent. C’est parce qu’en interne, Immer ne modifie jamais les objets existants.

<Sandpack>

```js src/App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Déplacez-moi !
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

</Solution>

</Challenges>
