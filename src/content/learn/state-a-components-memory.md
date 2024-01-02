---
title: "L’état : la mémoire d’un composant"
---

<Intro>

Les composants ont souvent besoin de changer ce qu'ils affichent suite à une interaction.  Une saisie dans un formulaire devrait mettre à jour la valeur du champ, cliquer sur « Suivant » sur un carrousel d'images devrait modifier l'image affichée, cliquer sur « Acheter » devrait ajouter le produit au panier.  Les composants ont besoin de « se souvenir » de certaines informations : la valeur actuelle du champ, l'image active, le panier.  Dans React, ce type de mémoire spécifique au composant est appelée *état*.

</Intro>

<YouWillLearn>

* Comment ajouter une variable d'état avec le Hook [`useState`](/reference/react/useState)
* Quelle paire de valeurs le Hook `useState` renvoie
* Comment ajouter plus d'une variable d'état
* Pourquoi on parle d'état *local*

</YouWillLearn>

## Quand une variable classique ne suffit pas {/*when-a-regular-variable-isnt-enough*/}

Voici un composant qui affiche une image de sculpture. Cliquer sur le bouton « Suivant » derait afficher la sculpture suivante en passant l'`index` à `1`, puis `2` et ainsi de suite.  Pourtant, ça **ne fonctionne pas** (essayez !) :

<Sandpack>

```js
import { sculptureList } from './data.js';

export default function Gallery() {
  let index = 0;

  function handleClick() {
    index = index + 1;
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Suivant
      </button>
      <h2>
        <i>{sculpture.name} </i>
        par {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} sur {sculptureList.length})
      </h3>
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
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

Le gestionnaire d'événement `handleClick` met à jour une variable locale, `index`.  Mais deux choses empêchent cette modification d'être affichée :

1. **Les variables locales ne persistent pas d'un rendu à l'autre.**  Lorsque React refait le rendu de ce composant, il recommence à zéro — il ne prend pas en compte les modifications aux variables locales.
2. **Modifier des variables locales ne déclenche pas de rendu.**  React ne réalise pas qu'il doit refaire le rendu du composant avec les nouvelles données.

Pour mettre à jour un composant avec de nouvelles données, on a besoin de deux choses :

1. **Conserver** les données d'un rendu à l'autre.
2. **Déclencher** un rendu React du composant avec ces nouvelles données (refaire le rendu).

Le Hook [`useState`](/reference/react/useState) remplit ce contrat :

1. Une **variable d'état** pour conserver la donnée d'un rendu à l'autre.
2. Une **fonction de mise à jour d'état** pour modifier la variable et indiquer à React qu'il doit désormais refaire le rendu du composant.

## Ajouter une variable d'état {/*adding-a-state-variable*/}

Pour ajouter une variable d'état, importez `useState` depuis React en haut de votre fichier :

```js
import { useState } from 'react';
```

Puis remplacez cette ligne :

```js
let index = 0;
```

…par celle-ci :

```js
const [index, setIndex] = useState(0);
```

`index` est une variable d'état et `setIndex` est sa fonction de mise à jour.

> La syntaxe de crochets `[` et `]` employée ici s'appelle une [déstructuration de tableau](https://fr.javascript.info/destructuring-assignment) *(certains traduisent « décomposition », dans un amalgame avec d'autres aspects comme le spread, NdT)*, elle nous permet de lire plusieurs valeurs depuis un tableau. Le tableau renvoyé par `useState` contient toujours exactement deux éléments (on parle de « paire »).

Voici comment les utiliser dans `handleClick` :

```js
function handleClick() {
  setIndex(index + 1);
}
```

À présent, cliquer sur le bouton « Suivant » change bel et bien la sculpture active :

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);

  function handleClick() {
    setIndex(index + 1);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Suivant
      </button>
      <h2>
        <i>{sculpture.name} </i>
        par {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} sur {sculptureList.length})
      </h3>
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
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

### Dites bonjour à votre premier Hook {/*meet-your-first-hook*/}

Dans React, `useState` est ce qu'on appelle un Hook, au même titre que toute autre fonction dont le nom commence par « `use` ».

Les *Hooks* sont des fonctions spéciales qui ne sont utilisables que pendant la phase de [rendu](/learn/render-and-commit#step-1-trigger-a-render) de React (on reviendra plus en détails sur ce sujet dans la prochaine page). Ils vous permettent de « vous accrocher » à certaines fonctionnalités de React.

L'état n'est que l'une de ces fonctionnalités, mais vous découvrirez d'autres Hooks prochainement.

<Pitfall>

**Les Hooks — les fonctions dont le nom commence par `use` — ne peuvent être appelés que depuis la racine de vos composants ou de [vos propres Hooks](/learn/reusing-logic-with-custom-hooks).**  Vous ne pouvez pas appeler des Hooks au sein de conditions, de boucles ou de fonctions imbriquées. Les Hooks restent des fonctions, mais il peut être utile de les envisager comme des déclarations inconditionnelles des besoins de votre composant. Vous « utilisez » des fonctionnalités de React à la racine de votre composant, de la même façon que vous « importez » des modules au tout début de votre fichier.

</Pitfall>

### Anatomie de `useState` {/*anatomy-of-usestate*/}

Lorsque vous appelez [`useState`](/reference/react/useState), vous dites à React que vous aimeriez que votre composant se souvienne de quelque chose :

```js
const [index, setIndex] = useState(0);
```

Dans ce cas précis, vous aimeriez que React se souvienne de `index`.

<Note>

La convention consiste à nommer la paire quelque chose comme `const [something, setSomething]`.  Vous pouvez les nommer comme bon vous semble, mais les conventions facilitent la compréhension d'un projet à l'autre.

</Note>

Le seul argument de `useState` est la **valeur initiale** de votre variable d'état.  Dans cet exemple, la valeur initiale d'`index` est définie à `0` avec `useState(0)`.

Chaque fois que votre composant fait son rendu, `useState` vous fournit un tableau contenant deux valeurs :

1. La **variable d'état** (`index`) avec la valeur que vous avez stockée.
2. La **fonction de mise à jour d'état** (`setIndex`) capable de mettre à jour la variable d'état puis de demander à React de refaire le rendu du composant.

Voici comment ça se passe concrètement :

```js
const [index, setIndex] = useState(0);
```

1. **Votre composant fait son rendu initial.** Comme vous avez passé `0` à `useState` en tant que valeur initiale pour `index`, la fonction renverra `[0, setIndex]`. React se souvient de `0` comme valeur à jour de l'état.
2. **Vous mettez à jour l'état.** Lorsqu'un utilisateur clique sur le bouton, ça appelle `setIndex(index + 1)`. Puisque `index` vaut `0`, ça appelle donc `setIndex(1)`.  Ça indique à React de se souvenir qu'`index` vaut désormais `1` et de refaire un rendu.
3. **Votre composant fait son deuxième rendu.**  React voit toujours `useState(0)`, mais comme React *se souvient* que vous avez mis `index` à `1`, il renvoie bien `[1, setIndex]` cette fois-là.
4. Et ainsi de suite !

## Utiliser plusieurs variables d'état dans un composant {/*giving-a-component-multiple-state-variables*/}

Vous pouvez avoir autant de variables d'état que nécessaire dans un même composant, avec les types que vous voulez.  Le composant ci-après a deux variables d'état : un nombre `index` et un booléen `showMore` qui est basculé lorsque vous cliquez sur « Afficher les détails » :

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
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

Il est judicieux d'utiliser plusieurs variables d'état si leurs données sont sans rapport, comme `index` et `showMore` dans cet exemple. Mais si vous réalisez que vous modifiez souvent deux variables ensemble, il peut être plus pratique de les combiner en une seule. Par exemple, si vous avez un formulaire avec de nombreux champs, il peut être confortable d'utiliser une seule variable d'état contenant un objet, plutôt qu'une variable d'état par champ. Lisez [Choisir la structure de l’état](/learn/choosing-the-state-structure) pour mieux décider ce genre de choses.

<DeepDive>

#### Comment React sait-il quelle partie de l'état renvoyer ? {/*how-does-react-know-which-state-to-return*/}

Vous avez peut-être remarqué que l'appel à `useState` ne prend aucune information indiquant *quelle* variable d'état vous manipulez. Il n'y a pas « d'identifiant » qui passé à `useState`, alors comment sait-elle de quelle variable d'état vous avez besoin en retour ?  Y'a-t-il une sorte d'analyse magique de vos fonctions ? Eh bien, pas du tout.

Pour permettre cette syntaxe d'utilisation concise, les Hooks préfèrent **se reposer sur un ordre d'appel stable pour tous les rendus du composant**.  Ça fonctionne très bien en pratique, car du moment que vous respectez la règle évoquée précédemment (« n'appelez les Hooks que depuis la racine »), les mêmes Hooks seront toujours appelés dans le même ordre. Qui plus est, un [plugin de *linter*](https://www.npmjs.com/package/eslint-plugin-react-hooks) vous rattrape par le col dans le cas contraire.

En interne, React maintient un tableau de paires d'état pour chaque instance de composant. Il maintient aussi l'index de la paire actuelle, qui démarre à zéro avant le rendu. Chaque fois que vous appelez `useState`, React vous donne la prochaine paire d'état et incrémente cet index. Vous pouvez en apprendre davantage sur ce mécanisme dans *[React Hooks: Not Magic, Just Arrays](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)* (en anglais) et apprendre en quoi seule cette approche permet de déployer toute la puissance des Hooks dans [Pourquoi les Hooks React dépendent-ils de l'ordre d'appel ?](https://overreacted.io/fr/why-do-hooks-rely-on-call-order/).

L'exemple ci-après **n'utilise pas React** mais vous permet de vous faire une idée de comment `useState` fonctionne en interne :

<Sandpack>

```js src/index.js active
let componentHooks = [];
let currentHookIndex = 0;

// Version simplifiée du fonctionnement de useState au sein de React.
function useState(initialState) {
  let pair = componentHooks[currentHookIndex];
  if (pair) {
    // On n’est pas sur le rendu initial, donc la paire
    // existe déjà.  On la renvoie et on prépare le prochain
    // appel au Hook.
    currentHookIndex++;
    return pair;
  }

  // On est sur le rendu initial, donc on crée la
  // paire d’état et on la stocke.
  pair = [initialState, setState];

  function setState(nextState) {
    // Quand l’utilisateur demande un changement d’état,
    // on met à jour la paire avec la nouvelle valeur.
    pair[0] = nextState;
    updateDOM();
  }

  // Stockage de la paire pour les futurs rendus
  // et préparation du prochain appel au Hook.
  componentHooks[currentHookIndex] = pair;
  currentHookIndex++;
  return pair;
}

function Gallery() {
  // Chaque appel à useState() obtiendra la prochaine paire.
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  // Cet exemple n’utilise pas React, donc on
  // renvoie un objet en sortie plutôt que du JSX.
  return {
    onNextClick: handleNextClick,
    onMoreClick: handleMoreClick,
    header: `${sculpture.name} par ${sculpture.artist}`,
    counter: `${index + 1} sur ${sculptureList.length}`,
    more: `${showMore ? 'Masquer' : 'Afficher'} les détails`,
    description: showMore ? sculpture.description : null,
    imageSrc: sculpture.url,
    imageAlt: sculpture.alt
  };
}

function updateDOM() {
  // Réinitialisation de l’index du Hook courant avant
  // de refaire le rendu du composant.
  currentHookIndex = 0;
  let output = Gallery();

  // Mise à jour du DOM pour refléter la sortie.
  // C’est la partie que React fait pour vous.
  nextButton.onclick = output.onNextClick;
  header.textContent = output.header;
  moreButton.onclick = output.onMoreClick;
  moreButton.textContent = output.more;
  image.src = output.imageSrc;
  image.alt = output.imageAlt;
  if (output.description !== null) {
    description.textContent = output.description;
    description.style.display = '';
  } else {
    description.style.display = 'none';
  }
}

let nextButton = document.getElementById('nextButton');
let header = document.getElementById('header');
let moreButton = document.getElementById('moreButton');
let description = document.getElementById('description');
let image = document.getElementById('image');
let sculptureList = [{
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

// Synchroniser l’UI avec l'état initial.
updateDOM();
```

```html public/index.html
<button id="nextButton">
  Suivant
</button>
<h3 id="header"></h3>
<button id="moreButton"></button>
<p id="description"></p>
<img id="image">

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
button { display: block; margin-bottom: 10px; }
</style>
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

Vous n'avez pas besoin de comprendre ce code d'illustration pour utiliser React, mais vous trouverez peut-être ce modèle mental utile.

</DeepDive>

## L'état est isolé et privé {/*state-is-isolated-and-private*/}

L'état est local à l'instance du composant à l'écran. En d'autres termes, **si vous affichez le même composant deux fois, chaque copie aura son propre état, complètement isolé !**  Modifier l'un des deux laissera l'autre état complètement intact.

Dans cet exemple, le composant `Gallery` vu plus tôt est affiché deux fois, sans aucun changement dans son code. Essayez de cliquer sur les boutons de chacune des deux galeries.  Vous pouvez constater que leurs états sont bel et bien indépendants :

<Sandpack>

```js
import Gallery from './Gallery.js';

export default function Page() {
  return (
    <div className="Page">
      <Gallery />
      <Gallery />
    </div>
  );
}

```

```js src/Gallery.js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <section>
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
    </section>
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
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
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

Voilà le cœur de la différence entre des variables d'état et des variables classiques que vous auriez pu déclarer à la racine de votre module. L'état n'est pas lié à un appel de fonction particulier ou à un endroit dans votre code, il est « local » à un emplacement précis à l'écran. Vous avez affiché deux composants `<Gallery />`, leurs états sont donc stockés séparément.

Remarquez aussi que le composant `Page` ne « connaît » rien de l'état du composant `Gallery`, il ne sait en fait même pas s'il a un état.  Contrairement aux props, **l'état est totalement privé pour le composant qui le déclare.**  Le composant parent ne peut pas le modifier. Ça vous permet d'ajouter ou de retirer de l'état dans n'importe quel composant sans impacter les autres.

Et si vous vouliez que les deux galeries conservent un état synchronisé ? Avec React, la bonne manière d'y parvenir consisterait à *retirer* l'état des composants enfants pour le déplacer vers leur plus proche ancêtre commun.  Dans les prochaines pages, nous nous concentrerons sur l'organisation de l'état au sein d'un seul composant, mais nous reviendrons sur ce sujet dans [Partager l’état entre des composants](/learn/sharing-state-between-components).

<Recap>

* Utilisez une variable d'état quand un composant doit « se souvenir » d'une information d'un rendu à l'autre.
* Les variables d'état sont déclarées en appelant le Hook `useState`.
* Les Hooks sont des fonctions spéciales dont le nom commence par `use`.  Ils vous permettent de « vous accrocher » à certaines fonctionnalités de React, telles que l'état local.
* Les Hooks vous rappellent peut-être les imports : ils doivent être appelés inconditionnellement.  Appeler des Hooks, y compris `useState`, n'est autorisé qu'à la racine d'un composant ou d'un autre Hook.
* Le Hook `useState` renvoie une paire de valeurs : la valeur courante de l'état et la fonction qui la met à jour.
* Vous pouvez avoir plusieurs variables d'état. En interne, React maintient la correspondance au moyen de leur ordre d'appel.
* L'état est privé au composant. Si vous affichez un composant à deux endroits, chaque instance dispose de son propre état.

</Recap>

<Challenges>

#### Compléter la galerie {/*complete-the-gallery*/}

Lorsque vous appuyez sur « Suivant » alors que la dernière sculpture est affichée, le code plante. Corrigez la logique pour éviter ça. Vous pouvez y parvenir en ajoutant du code au gestionnaire d'événement, ou en désactivant le bouton quand l'action devient impossible.

Après avoir corrigé le crash, ajoutez un bouton « Précédent » qui permet de revenir en arrière.  Il ne devrait pas planter sur la première sculpture.

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
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
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
```

</Sandpack>

<Solution>

Ajoutez une condition de garde-fou dans les deux gestionnaires d'événements et profitez-en pour désactiver les boutons quand c'est nécessaire :

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  let hasPrev = index > 0;
  let hasNext = index < sculptureList.length - 1;

  function handlePrevClick() {
    if (hasPrev) {
      setIndex(index - 1);
    }
  }

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button
        onClick={handlePrevClick}
        disabled={!hasPrev}
      >
        Précédent
      </button>
      <button
        onClick={handleNextClick}
        disabled={!hasNext}
      >
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

```js src/data.js hidden
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
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
```

</Sandpack>

Remarquez que `hasPrev` et `hasNext` sont utilisés *à la fois* dans le JSX renvoyé et au sein des gestionnaires d'événements ! Cette approche bien pratique fonctionne parce que les fonctions des gestionnaires d'événements bénéficient par [« fermeture lexicale »](https://developer.mozilla.org/fr/docs/Web/JavaScript/Closures) des variables déclarées lors du rendu.

</Solution>

#### Dégeler le champ de formulaire {/*fix-stuck-form-inputs*/}

Lorsque vous tapez au clavier quelque chose dans les champs de saisie, rien n'y apparaît. C'est comme si vos champs étaient « figés » sur leurs valeurs vides. La `value` du premier `<input>` est définie de façon à toujours correspondre à la variable `firstName`, et la `value` du second `<input>` est calée pour toujours correspondre à la variable `lastName`.  Ça, c'est bon.  Les deux champs ont des gestionnaires d'événements `onChange`, qui essaient de mettre à jour les variables sur base de la dernière saisie en date (`e.target.value`). Pourtant, ces variables ne semblent pas « se souvenir » de leurs valeurs d'un rendu à l'autre. Corrigez ça en utilisant plutôt des variables d'état.

<Sandpack>

```js
export default function Form() {
  let firstName = '';
  let lastName = '';

  function handleFirstNameChange(e) {
    firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    lastName = e.target.value;
  }

  function handleReset() {
    firstName = '';
    lastName = '';
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="Prénom"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Nom"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Salut {firstName} {lastName}</h1>
      <button onClick={handleReset}>Réinitialiser</button>
    </form>
  );
}
```

```css
h1 { margin-top: 10px; }
```

</Sandpack>

<Solution>

Commencez par importer `useState` depuis React. Ensuite, remplacez `firstName` et `lastName` par des variables d'état déclarées en appelant `useState`.  Pour finir, remplacez chaque affectation `firstName =  …` par `setFirstName(…)`, et faites de même pour `lastName`.  N'oubliez pas de mettre à jour `handleReset` pour que le bouton de réinitialisation fonctionne.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  function handleReset() {
    setFirstName('');
    setLastName('');
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="Prénom"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Nom"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Salut {firstName} {lastName}</h1>
      <button onClick={handleReset}>Réinitialiser</button>
    </form>
  );
}
```

```css
h1 { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Corriger un crash {/*fix-a-crash*/}

Voici un petit formulaire censé permettre à l'utilisateur de nous faire part de ses retours.  Lorsque le formulaire est envoyé, il est supposé afficher un message de remerciement. Pourtant, il plante avec un message d'erreur *“Rendered fewer hooks than expected”* *(« Moins de Hooks que prévu lors du rendu », NdT)*.  Saurez-vous repérer l'origine du problème et la corriger ?

<Hint>

Y'a-t-il des limitations sur les *endroits* où un Hook peut être appelé ? Ce composant enfreint-il des règles ? Regardez s'il n'y aurait pas des commentaires qui désactivent des vérifications du *linter* — c'est souvent là que les bugs se cachent !

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  if (isSent) {
    return <h1>Merci !</h1>;
  } else {
    // eslint-disable-next-line
    const [message, setMessage] = useState('');
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`Sending: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Envoyer</button>
      </form>
    );
  }
}
```

</Sandpack>

<Solution>

Les Hooks ne peuvent être appelés qu'à la racine de votre fonction composant.  Ici la première définition (`isSent`) obéit à cette règle, mais celle de `message` figure au sein d'une condition.

Sortez-la de la condition pour corriger le problème :

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  if (isSent) {
    return <h1>Merci !</h1>;
  } else {
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`Sending: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Envoyer</button>
      </form>
    );
  }
}
```

</Sandpack>

Souvenez-vous : les Hooks doivent être appelés inconditionnellement et toujours dans le même ordre !

Vous pouvez aussi retirer la branche `else` superflue pour réduire l'indentation.  Cependant, il reste nécessaire que tous les appels aux Hooks aient lieu *avant* le premier `return`.

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  if (isSent) {
    return <h1>Merci !</h1>;
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert(`Sending: "${message}"`);
      setIsSent(true);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <br />
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

</Sandpack>

Essayez de déplacer le second appel à `useState` après la condition `if` et voyez comme ça crashe à nouveau.

Si votre *linter* est [configuré pour React](/learn/editor-setup#linting), vous verrez une erreur de *linting* lorsque vous faites ce genre de bévue.  Si vous ne voyez pas d'erreur quand vous essayez ce code en local, c'est qu'il vous faut configurer le *linting* pour votre projet.

</Solution>

#### Retirer l'état superflu {/*remove-unnecessary-state*/}

Dans cet exemple, cliquer sur le bouton devrait demander à l'utilisateur son nom et le saluer dans une alerte.  Vous avez essayé de recourir à un état pour vous souvenir du nom, mais pour une raison ou une autre ça affiche toujours « Bonjour ! ».

Pour corriger ce code, retirez la variable d'état superflue. (Nous explorerons les [raisons de ce problème](/learn/state-as-a-snapshot) prochainement.)

Sauriez-vous expliquer en quoi cette variable d'état est superflue ?

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [name, setName] = useState('');

  function handleClick() {
    setName(prompt('Comment vous appelez-vous ?'));
    alert(`Bonjour ${name} !`);
  }

  return (
    <button onClick={handleClick}>
      Saluer
    </button>
  );
}
```

</Sandpack>

<Solution>

Voici une version corrigée qui utilise une variable `name` classique, déclarée dans la fonction qui en a besoin :

<Sandpack>

```js
export default function FeedbackForm() {
  function handleClick() {
    const name = prompt('Comment vous appelez-vous ?');
    alert(`Bonjour ${name} !`);
  }

  return (
    <button onClick={handleClick}>
      Saluer
    </button>
  );
}
```

</Sandpack>

Une variable d'état n'est nécessaire que pour persister une information d'un rendu à l'autre pour un composant.  Au sein d'un unique gestionnaire d'événement, une variable classique suffira amplement.  N'ajoutez pas de variables d'état quand une variable classique suffirait.

</Solution>

</Challenges>
