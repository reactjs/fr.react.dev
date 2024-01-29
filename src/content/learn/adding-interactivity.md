---
title: Ajouter de l’interactivité
---

<Intro>

Certaines choses à l’écran se mettent à jour en réponse aux actions de l’utilisateur. Par exemple, en cliquant sur une galerie d’images, l’image active change. En React, les données qui changent au fil du temps sont appelées *état*. Vous pouvez ajouter un état à n'importe quel composant et le mettre à jour quand nécessaire. Dans ce chapitre, vous apprendrez à écrire des composants qui gèrent des interactions, mettent à jour leur état et ajustent leur affichage au fil du temps.

</Intro>

<YouWillLearn isChapter={true}>

* [Comment gérer les événements initiés par l’utilisateur](/learn/responding-to-events)
* [Comment faire en sorte que les composants « se souviennent » des informations grâce aux états](/learn/state-a-components-memory)
* [Comment React met à jour l’interface utilisateur (UI) en deux phases](/learn/render-and-commit)
* [Pourquoi l’état ne se met pas à jour immédiatement après sa modification](/learn/state-as-a-snapshot)
* [Comment cumuler plusieurs mises à jour d’un même état](/learn/queueing-a-series-of-state-updates)
* [Comment mettre à jour un objet dans l’état](/learn/updating-objects-in-state)
* [Comment mettre à jour un tableau dans l’état](/learn/updating-arrays-in-state)

</YouWillLearn>

## Réagir aux événements {/*responding-to-events*/}

React vous permet d’ajouter des *gestionnaires d’événements* à votre JSX. Les gestionnaires d’événements sont vos propres fonctions qui seront déclenchées en réponse aux interactions de l’utilisateur telles que des clics, survols, activations de champs de saisie de formulaires, etc.

Les composants natifs tels que `<button>` ne prennent en charge que les événements natifs du navigateur tels que `onClick`. Cependant, vous pouvez également créer vos propres composants et donner à leurs props de gestionnaires d’événements des noms spécifiques à l’application, selon vos besoins.

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Lecture en cours !')}
      onUploadImage={() => alert('Téléversement en cours !')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Voir le film
      </Button>
      <Button onClick={onUploadImage}>
        Téléverser une image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

<LearnMore path="/learn/responding-to-events">

Lisez **[Réagir aux événements](/learn/responding-to-events)** pour apprendre comment ajouter des gestionnaires d’événements.

</LearnMore>

## L’état : la mémoire d’un composant {/*state-a-components-memory*/}

Les composants ont souvent besoin de modifier ce qui est affiché à l’écran en réponse à une interaction. Par exemple, saisir du texte dans un formulaire devrait mettre à jour le champ de saisie, cliquer sur « suivant » dans un carrousel d’images devrait changer l’image affichée, cliquer sur « acheter » ajoute un produit au panier d’achats. Les composants ont besoin de « se souvenir » de certaines choses : la valeur saisie, l’image active, le panier d’achats. En React, ce type de mémoire spécifique au composant est appelé *état*.

Vous pouvez ajouter un état à un composant avec un Hook [`useState`](/reference/react/useState). Les *Hooks* sont des fonctions spéciales qui permettent à vos composants d’utiliser des fonctionnalités de React (l’état en est une). Le Hook `useState` vous permet de déclarer une variable d’état. Il prend l’état initial en argument et renvoie une paire de valeurs : l’état actuel et une fonction qui vous permet de le modifier.

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Voici comment une galerie d’images utilise et met à jour l’état lors d’un clic :

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Suivant
      </button>
      <h2>
        <i>{sculpture.name} </i>
        par {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} sur {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Masquer' : 'Afficher'} les détails
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Bien que Colvin soit principalement connue pour ses thèmes abstraits qui font allusion à des symboles préhispaniques, cette sculpture gigantesque, un hommage à la neurochirurgie, est l’une de ses pièces d’art public les plus reconnaissables.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Une statue en bronze de deux mains croisées tenant délicatement un cerveau humain du bout des doigts.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'Cette immense fleur argentée (de 23 mètres de haut ou 75 pieds) est située à Buenos Aires. Elle est conçue pour bouger, en fermant ses pétales le soir ou lors de vents forts, et en les ouvrant le matin.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'Une sculpture de fleur métallique gigantesque avec des pétales réfléchissants, semblables à des miroirs, et des étamines solides.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson était connu pour ses préoccupations d’égalité, de justice sociale, ainsi que les qualités essentielles et spirituelles de l’humanité. Ce bronze massif (de 2,13 mètres de hauteur ou 7 pieds) représente ce qu’il a décrit comme « une présence noire symbolique imprégnée d’un sens d’humanité universelle ».',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'La sculpture représentant une tête humaine semble être toujours présente et solennelle. Elle rayonne de calme et de sérénité.'
}, {
  name: 'Moai',
  artist: 'Artiste inconnu·e',
  description: 'Sur l’île de Pâques, il y a 1 000 moaïs, ou statues monumentales encore existantes, créées par les premiers habitants Rapa Nui, que certains croient représenter des ancêtres divinisés.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Trois bustes de pierre monumentaux avec des têtes démesurément grandes et des visages sombres.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Les Nanas sont des créatures triomphantes, symboles de féminité et de maternité. Initialement, Saint Phalle utilisait des tissus et des objets trouvés pour les Nanas, et plus tard, elle a introduit du polyester pour obtenir un effet plus vibrant.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Une grande sculpture en mosaïque d’une figure féminine fantaisiste dansant dans un costume coloré rayonnant de joie.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'Cette sculpture abstraite en bronze fait partie de la série « La Famille de l’Homme » située au parc de sculptures de Yorkshire. Hepworth a choisi de ne pas créer des représentations littérales du monde, mais a développé des formes abstraites inspirées des personnes et des paysages.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'Une sculpture haute composée de trois éléments empilés rappelant une figure humaine.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descendant de quatre générations de sculpteurs sur bois, le travail de Fakeye mélangeait des thèmes yorubas traditionnels et contemporains.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Une sculpture en bois complexe représentant un guerrier au visage concentré sur un cheval orné de motifs.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow est connue pour ses sculptures du corps fragmenté en tant que métaphore de la fragilité et de l’impermanence de la jeunesse et de la beauté. Cette sculpture représente deux ventres très réalistes empilés l’un sur l’autre, chacun mesurant environ cinq pieds (1,5m) de hauteur.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'La sculpture rappelle une cascade de plis, très différente des ventres dans les sculptures classiques.'
}, {
  name: 'Terracotta Army',
  artist: 'Artiste inconnu·e',
  description: 'L’Armée de terre cuite est une collection de sculptures en terre cuite représentant les armées de Qin Shi Huang, le premier empereur de Chine. L’armée était composée de plus de 8 000 soldats, 130 chars tirés par 520 chevaux et 150 chevaux montés par des cavaliers.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 sculptures de guerriers solennels en terre cuite, chacun avec une expression faciale et une armure uniques.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson était connue pour récupérer des objets dans les débris de la ville de New York, qu’elle assemblerait plus tard en constructions monumentales. Dans celle-ci, elle a utilisé des pièces disparates telles qu’un pied de lit, un bâton de jonglage et un fragment de siège, les clouant et les collant dans des boîtes qui reflètent l’influence de l’abstraction géométrique de l’espace et de la forme du cubisme.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Une sculpture mate en noir où les éléments individuels sont initialement indiscernables.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar fusionne le traditionnel et le moderne, le naturel et l’industriel. Son art se concentre sur la relation entre l’homme et la nature. Son travail a été décrit comme étant captivant à la fois de manière abstraite et figurative, défiant la gravité, et une « synthèse fine de matériaux improbables »."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Une sculpture pâle en forme de fil de fer fixée au mur en béton et descendant jusqu’au sol. Elle semble légère.'
}, {
  name: 'Hippos',
  artist: 'Zoo de Taipei',
  description: 'Le zoo de Taipei a commandé des sculptures installées sur une place, représentant des hippopotames submergés en train de jouer.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Un groupe de sculptures d’hippopotames en bronze émergeant du trottoir en pavés comme s’ils nageaient.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/state-a-components-memory">

Lisez **[L’état : la mémoire d’un composant](/learn/state-a-components-memory)** pour apprendre comment mémoriser une valeur et la mettre à jour lors d’une interaction.

</LearnMore>

## Rendu et Commit {/*render-and-commit*/}

Avant que vos composants ne soient affichés à l’écran, React doit effectuer leur rendu. Comprendre les étapes de ce processus vous aidera à réfléchir à l’exécution de votre code et à expliquer son comportement.

Imaginez que vos composants soient des cuisiniers dans un restaurant, assemblant des plats savoureux à partir d’ingrédients. Dans ce scénario, React est le serveur qui prend les commandes des clients et leur apporte leurs plats. Ce processus de demande et de service de l’UI comporte trois étapes :

1. **Déclencher** un rendu (envoyer la commande du client à la cuisine)
2. **Faire le rendu** du composant (préparer la commande en cuisine)
3. **Mettre à jour** le DOM (phase de Commit ;  revient à déposer la commande sur la table du client)

<IllustrationBlock sequential>
  <Illustration caption="Déclencher" alt="React agit comme un serveur dans un restaurant, qui récupère les commandes des utilisateurs et les transmet à la cuisine des composants." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Faire le rendu" alt="Le chef Card fournit à React un nouveau composant Card." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Mettre à jour (Commit)" alt="React dépose le Card sur la table de l’utilisateur." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

Lisez **[Rendu et Commit](/learn/render-and-commit)** pour apprendre sur le cycle de vie d’une mise à jour de l’interface.

</LearnMore>

## L’état est un instantané {/*state-as-a-snapshot*/}

Contrairement aux variables JavaScript classiques, une variable d’état dans React se comporte davantage comme une photo instantanée. Lui affecter une nouvelle valeur ne change pas la variable d’état que vous avez déjà, mais déclenche plutôt un nouveau rendu. Ça peut surprendre au début !

```js
console.log(count);  // 0
setCount(count + 1); // Entraînera un nouveau rendu avec la valeur 1
console.log(count);  // Toujours 0 !
```

Ce comportement vous aide à éviter des bugs subtils. Voici une petite appli de discussion. Essayez de deviner ce qui se passe si vous appuyez sur « Envoyer » d’abord, *et ensuite* changez le destinataire pour Bob. Quel nom apparaîtra dans le `alert` cinq secondes plus tard ?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`Vouz avez dit ${message} à ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        À :{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<LearnMore path="/learn/state-as-a-snapshot">

Lisez **[L’état comme un instantané](/learn/state-as-a-snapshot)** pour comprendre pourquoi un état semble « fixe » et immuable à l’intérieur des gestionnaires d’événements.

</LearnMore>

## Cumuler les mises à jour d’un même état {/*queueing-a-series-of-state-updates*/}

Ce composant comporte un bug : cliquer sur « +3 » n'incrémente le score qu'une seule fois.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

[L’état comme un instantané](/learn/state-as-a-snapshot) en explique la raison. Affecter une nouvelle valeur à un état déclenchera un nouveau rendu, mais ne change pas sa valeur dans le code en cours d’exécution. Ainsi, `score` reste à `0` juste après avoir appelé `setScore(score + 1)`.

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

Vous pouvez corriger ça en passant une *fonction de mise à jour* lorsque vous affectez une nouvelle valeur à l’état. Voyez comme le remplacement de `setScore(score + 1)` par `setScore(s => s + 1)` corrige le bouton « +3 ». Ça vous permet de cumuler plusieurs mises à jour d’un même état.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-updates">

Lisez **[Cumuler les série de mises à jour d’un même état](/learn/queueing-a-series-of-state-updates)** pour apprendre comment cumuler plusieurs mises à jour d’une même variable d’état.

</LearnMore>

## Mettre à jour les objets d’un état {/*updating-objects-in-state*/}

Un état peut contenir n'importe quel type de valeur JavaScript, y compris des objets. Cependant, vous ne devez pas changer directement les objets et les tableaux que vous stockez dans l’état React. Au lieu de cela, lorsque vous voulez mettre à jour un objet ou un tableau, vous devez en créer un nouveau (ou faire une copie de l’existant), puis mettre à jour l’état pour utiliser cette copie.

Généralement, vous utiliserez la syntaxe de *spread* `...` pour copier les objets et les tableaux que vous souhaitez modifier. Par exemple, la mise à jour d’un objet imbriqué pourrait ressembler à ceci :

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
        (à {person.artwork.city})
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

Si la copie d’objets dans le code devient fastidieuse, vous pouvez utiliser une bibliothèque telle que [Immer](https://github.com/immerjs/use-immer) pour simplifier le code :

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
        (à {person.artwork.city})
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

<LearnMore path="/learn/updating-objects-in-state">

Lisez **[Mettre à jour les objets d’un état](/learn/updating-objects-in-state)** pour apprendre comment mettre à jour correctement les objets d’une variable d’état.

</LearnMore>

## Mettre à jour les tableaux d’un état {/*updating-arrays-in-state*/}

Les tableaux sont un autre type d’objet modifiable en JavaScript que vous pouvez stocker dans un état et que vous devez traiter comme étant en lecture seule. Tout comme avec les objets, lorsque vous souhaitez mettre à jour un tableau stocké dans un état, vous devez en créer un nouveau (ou en copier un existant), puis affecter le nouveau tableau dans l’état :

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, setList] = useState(
    initialList
  );

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Liste d’œuvres d’art</h1>
      <h2>Ma liste à voir absolument :</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
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

Si la copie de tableaux dans le code devient fastidieuse, vous pouvez utiliser une bibliothèque telle que [Immer](https://github.com/immerjs/use-immer) pour simplifier le code :

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
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
        artworks={list}
        onToggle={handleToggle} />
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

<LearnMore path="/learn/updating-arrays-in-state">

Lisez **[Mettre à jour les tableaux d’un état](/learn/updating-arrays-in-state)** pour apprendre comment mettre à jour correctement les tableaux d’une variable d’état.

</LearnMore>

## Et maintenant ? {/*whats-next*/}

Allez sur [Réagir aux événements](/learn/responding-to-events) pour commencer à lire ce chapitre page par page !

Ou alors, si vous êtes déjà à l’aise avec ces sujets, pourquoi ne pas explorer comment [gérer l’état](/learn/managing-state) ?
