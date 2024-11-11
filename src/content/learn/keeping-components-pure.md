---
title: Garder les composants purs
---

<Intro>

Certaines fonctions JavaScript sont *pures*. Les fonctions pures se contentent de réaliser un calcul, rien de plus. En écrivant rigoureusement vos composants sous forme de fonctions pures, vous éviterez une catégorie entière de bugs ahurissants et de comportements imprévisibles au fil de la croissance de votre base de code. Pour en bénéficier, il vous faut toutefois suivre quelques règles.

</Intro>

<YouWillLearn>

- Ce qu'est la pureté d'une fonction, et en quoi elle vous aide à éviter les bugs
- Comment garder vos composants purs en ne modifiant rien pendant la phase de rendu
- Comment utiliser le Mode Strict pour détecter les erreurs dans vos composants

</YouWillLearn>

## La pureté : les composants vus comme des formules {/*purity-components-as-formulas*/}

En informatique (en particulier dans le monde de la programmation fonctionnelle), [une fonction pure](https://fr.wikipedia.org/wiki/Fonction_pure) a les caractéristiques suivantes :

- **Elle s'occupe de ses affaires.** Elle ne modifie aucun objet ou variable qui existaient avant son appel.
- **Pour les mêmes entrées, elle produit la même sortie.** Pour un jeu d'entrées données, une fonction pure renverra toujours le même résultat.

Vous avez peut-être déjà l'habitude d'une catégorie de fonctions pures : les formules mathématiques.

Prenons la formule suivante : <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>.

Si <Math><MathI>x</MathI> = 2</Math> alors <Math><MathI>y</MathI> = 4</Math>. Toujours.

Si <Math><MathI>x</MathI> = 3</Math> alors <Math><MathI>y</MathI> = 6</Math>. Toujours.

Si <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> ne vaudra pas parfois <Math>9</Math>, parfois <Math>–1</Math> ou parfois <Math>2,5</Math> en fonction du moment de la journée ou de l'état du marché boursier.

Si <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> et <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> vaudra *toujours* <Math>6</Math>.

Si nous en faisions une fonction JavaScript, elle ressemblerait à ça :

```js
function double(number) {
  return 2 * number;
}
```

Dans l'exemple ci-dessus, `double` est une **fonction pure**. Si vous lui passez `3`, elle renverra `6`.  Toujours.

React est fondé sur cette notion. **React suppose que chaque composant que vous écrivez est une fonction pure.** Ça signifie que les composants React que vous écrivez doivent toujours renvoyer le même JSX pour les mêmes entrées :

<Sandpack>

```js src/App.js
function Recipe({ drinkers }) {
  return (
    <ol>
      <li>Faire bouillir {drinkers} tasses d’eau.</li>
      <li>Ajouter {drinkers} cuillers de thé et {0.5 * drinkers} cuillers d’épices.</li>
      <li>Ajouter {0.5 * drinkers} tasses de lait jusqu’à ébullition, et du sucre selon les goûts de chacun.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Recette du Chai Épicé</h1>
      <h2>Pour deux</h2>
      <Recipe drinkers={2} />
      <h2>Pour un groupe</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

Lorsque vous passez `drinkers={2}` à `Recipe`, il renverra du JSX avec `2 tasses d’eau`. Toujours.

Si vous passez `drinkers={4}`, il renverra du JSX avec `4 tasses d’eau`. Toujours.

Comme une formule de maths.

Vous pourriez voir vos composants comme des recettes : si vous les suivez et n'introduisez pas de nouveaux ingrédients lors du processus de confection, vous obtiendrez le même plat à chaque fois. Ce « plat » est le JSX que le composant sert à React pour le [rendu](/learn/render-and-commit).

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="Une recette de thé pour x personnes : prendre x tasses d’eau, ajouter x cuillers de thé et 0,5x cuillers d’épices, puis 0,5x tasses de lait." />

## Les effets de bord : les conséquences (in)attendues {/*side-effects-unintended-consequences*/}

Le processus de rendu de React doit toujours être pur. Les composants ne devraient *renvoyer* que leur JSX, et ne pas *modifier* des objets ou variables qui existaient avant le rendu : ça les rendrait impurs !

Voici un composant qui enfreint cette règle :

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Erroné : modifie une variable pré-existante !
  guest = guest + 1;
  return <h2>Tasse de thé pour l’invité #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

Ce composant lit et écrit une variable `guest` déclarée hors de sa fonction.  Ça signifie **qu'appeler ce composant plusieurs fois produira un JSX différent !**  En prime, si *d'autres* composants lisent `guest`, eux aussi produiront un JSX différent, selon le moment de leur rendu ! Tout le système devient imprévisible.

Pour en revenir à notre formule <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>, désormais même si <Math><MathI>x</MathI> = 2</Math>, nous n'avons plus la certitude que <Math><MathI>y</MathI> = 4</Math>. Nos tests pourraient échouer, nos utilisateurs pourraient être désarçonnés, les avions pourraient tomber comme des pierres… Vous voyez bien que ça donnerait des bugs insondables !

Vous pouvez corriger ce composant en [passant plutôt `guest` comme prop](/learn/passing-props-to-a-component) :

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tasse de thé pour l’invité #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

Votre composant est désormais pur, et le JSX qu'il renvoie ne dépend que de la prop `guest`.

De façon générale, vous ne devriez pas exiger un ordre particulier de rendu pour vos composants. Peu importe si vous appelez <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> avant ou après <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math> : les deux formules se calculent indépendamment l'une de l'autre. De la même façon, chaque composant ne devrait que « penser à lui-même » plutôt que de tenter de se coordonner avec d'autres (ou dépendre d'eux) lors du rendu.  Le rendu est comme un examen scolaire : chaque composant devrait calculer son JSX par lui-même !

<DeepDive>

#### Détecter les impuretés grâce à `StrictMode` {/*detecting-impure-calculations-with-strict-mode*/}

Même si vous ne les avez pas encore toutes utilisées à ce stade, sachez que dans React il existe trois types d'entrées que vous pouvez lire lors d'un rendu : [les props](/learn/passing-props-to-a-component), [l'état](/learn/state-a-components-memory), et [le contexte](/learn/passing-data-deeply-with-context).  Vous devriez toujours considérer ces trois entités comme étant en lecture seule.

Lorsque vous souhaitez *modifier* quelque chose en réaction à une interaction utilisateur, vous devriez [mettre à jour l'état](/learn/state-a-components-memory) plutôt que d'écrire dans une variable.  Vous ne devriez jamais modifier des variables ou objets pré-existants lors du rendu de votre composant.

React propose un « Mode Strict » dans lequel il appelle chaque fonction composant deux fois pendant le développement. **En appelant chaque fonction composant deux fois, le Mode Strict vous aide à repérer les composants qui enfreignent ces règles.**

Avez-vous remarqué que le premier exemple affichait « invité #2 », « invité #4 » et « invité #6 » au lieu de « invité #1 », « invité #2 » et « invité #3 » ?  La fonction d'origine était impure, de sorte que l'appeler deux fois cassait son fonctionnement.  Mais la fonction corrigée, qui est pure, fonctionne même si elle est systématiquement appelée deux fois. **Les fonctions pures font juste un calcul, aussi les appeler deux fois ne change rien**, tout comme appeler `double(2)` deux fois ne change pas son résultat, et résoudre <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> deux fois ne change pas la valeur de <MathI>y</MathI>. Mêmes entrées, même sorties. Toujours.

Le Mode Strict n'a aucun effet en production, il ne ralentira donc pas votre appli pour vos utilisateurs.  Pour activer le Mode Strict, enrobez votre composant racine dans un `<React.StrictMode>`. Certains frameworks mettent ça en place par défaut.

</DeepDive>

### Les mutations locales : les petits secrets de votre composant {/*local-mutation-your-components-little-secret*/}

Dans l'exemple ci-avant, le problème venait de ce que le composant modifiait une variable *pré-existante* pendant son rendu.  On parle alors souvent de **« mutation »** pour rendre ça un peu plus effrayant.  Les fonctions pures ne modifient pas les variables hors de leur portée, ni les objets créés avant l'appel : si elles le faisaient, ça les rendrait impures !

En revanche, **il est parfaitement acceptable de modifier les variables ou objets que vous *venez* de créer pendant le rendu.**  Dans l'exemple qui suit, vous créez un tableau `[]`, l'affectez à une variable `cups` puis y ajoutez une douzaine de tasses à coups de `push` :

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tasse de thé pour l’invité #{guest}</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

Si la variable `cups` ou le tableau `[]` avaient été créés hors de la fonction `TeaGathering`, ça aurait posé un énorme problème ! Vous auriez modifié un objet *pré-existant* en ajoutant des éléments au tableau.

Mais là, tout va bien parce que vous les avez créés *pendant ce même rendu*, au sein de `TeaGathering`.  Aucun code hors de `TeaGathering` ne saura jamais que ça s'est passé. On parle alors de **mutation locale** ; c'est comme un petit secret de votre composant.

## Les endroits où vous *pouvez* causer des effets de bord {/*where-you-can-cause-side-effects*/}

S'il est vrai que la programmation fonctionnelle s'appuie fortement sur la pureté, à un moment, quelque part, *quelque chose* va devoir changer. C'est un peu l'objectif d'un programme ! Ces modifications (mettre à jour l'affichage, démarrer une animation, modifier des données) sont appelées des **effets de bord**.  C'est ce qui arrive *« à côté »*, et non au sein du rendu.

Dans React, **les effets de bord résident généralement dans des [gestionnaires d'événements](/learn/responding-to-events)**. Les gestionnaires d'événements sont des fonctions que React exécute lorsque vous faites une action donnée — par exemple lorsque vous cliquez sur un bouton. Même si les gestionnaires d'événements sont définis *au sein de* votre composant, il ne sont pas exécutés *pendant* le rendu ! **Du coup, les gestionnaires d'événements n'ont pas besoin d'être purs.**

Si vous avez épuisé toutes les autres options et ne pouvez pas trouver un gestionnaire d'événement adéquat pour votre effet de bord, vous pouvez tout de même en associer un au JSX que vous renvoyez en appelant [`useEffect`](/reference/react/useEffect) dans votre composant. Ça dit à React de l'exécuter plus tard, après le rendu, lorsque les effets de bord seront autorisés. **Ceci dit, cette approche doit être votre dernier recours.**

Lorsque c'est possible, essayez d'exprimer votre logique rien qu'avec le rendu. Vous serez surpris·e de tout ce que ça permet de faire !

<DeepDive>

#### Pourquoi React tient-il tant à la pureté ? {/*why-does-react-care-about-purity*/}

Écrire des fonctions pures nécessite de la pratique et de la discipline.  Mais ça ouvre aussi des opportunités merveilleuses :

- Vos composants peuvent être exécutés dans différents environnements — par exemple sur le serveur !  Puisqu'il renvoie toujours le même résultat pour les mêmes entrées, un composant peut servir à de nombreuses requêtes utilisateur.
- Vous pouvez améliorer les performances en [sautant le rendu](/reference/react/memo) des composants dont les entrées n'ont pas changé.  C'est sans risque parce que les fonctions pures renvoient toujours les mêmes résultats, on peut donc les mettre en cache.
- Si certaines données changent au cours du rendu d'une arborescence profonde de composants, React peut redémarrer le rendu sans perdre son temps à finir celui en cours, désormais obsolète.  La pureté permet de stopper le calcul à tout moment, sans risque.

Toutes les nouvelles fonctionnalités de React que nous sommes en train de construire tirent parti de la pureté.  Du chargement de données aux performances en passant par les animations, garder vos composants purs permet d'exploiter la pleine puissance du paradigme de React.

</DeepDive>

<Recap>

- Un composant doit être pur, ce qui signifie que :
  - **Il s'occupe de ses affaires.** Il ne modifie aucun objet ou variable qui existaient avant son rendu.
  - **Pour les mêmes entrées, il produit la même sortie.** Pour un jeu d'entrées données, un composant renverra toujours le même JSX.
- Le rendu peut survenir à tout moment, c'est pourquoi les composants ne doivent pas dépendre de leurs positions respectives dans la séquence de rendu.
- Vous ne devriez pas modifier les entrées utilisées par vos composants pour leur rendu. Ça concerne les props, l'état et le contexte. Pour mettre à jour l'affichage, [mettez à jour l'état](/learn/state-a-components-memory) plutôt que de modifier des objets pré-existants.
- Faites le maximum pour exprimer la logique de votre composant dans le JSX que vous renvoyez.  Lorsque vous devez absolument « modifier un truc », vous voudrez généralement le faire au sein d'un gestionnaire d'événement. En dernier recours, vous pouvez utiliser `useEffect`.
- Écrire des fonctions pures nécessite un peu de pratique, mais ça permet d'exploiter la pleine puissance du paradigme de React.

</Recap>

<Challenges>

#### Réparer une horloge {/*fix-a-broken-clock*/}

Ce composant essaie de passer la classe CSS du `<h1>` à `"night"` entre minuit et six heures du matin, et à `"day"` le reste de la journée. Cependant, il ne fonctionne pas.  Pouvez-vous le corriger ?

Vous pouvez vérifier si votre solution fonctionne en modifiant temporairement le fuseau horaire de votre ordinateur. Lorsque l'horloge est entre minuit et six heures du matin, elle devrait être en couleurs inversées !

<Hint>

Le rendu est un *calcul*, il ne devrait pas essayer de « faire » des choses. Pouvez-vous exprimer la même idée différemment ?

</Hint>

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
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
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

Vous pouvez corriger ce composant en calculant le `className` puis en l'incluant dans le résultat du rendu :

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
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
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

Dans cet exemple, l'effet de bord (à savoir modifier le DOM) était totalement superflu. Vous aviez juste besoin de renvoyer le bon JSX.

</Solution>

#### Réparer un profil {/*fix-a-broken-profile*/}

Deux composants `Profile` sont affichés côte à côte avec des données différentes.  Appuyez sur le bouton « Replier » du premier, puis sur « Déplier ». Vous remarquerez que les deux profils affichent désormais la même personne.  Il y a un os !

Trouvez l'origine du bug et corrigez-le.

<Hint>

Le code problématique est dans `Profile.js`.  Assurez-vous de bien l'avoir complètement lu de haut en bas !

</Hint>

<Sandpack>

```js src/Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Replier' : 'Déplier'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

Le souci vient de ce que le composant `Profile` modifie une variable pré-existante appelée `currentPerson`, et que les composants `Header` et `Avatar` la lisent. Du coup, *tous les trois* sont impurs et leurs comportements sont imprévisibles.

Pour corriger ce bug, supprimez la variable `currentPerson`.  Passez plutôt toute l'information de `Profile` à `Header` et `Avatar` *via* des props. Vous devrez ajouter la prop `person` aux deux composants pour pouvoir la passer jusqu'en bas.

<Sandpack>

```js src/Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Replier' : 'Déplier'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

Rappelez-vous que React ne garantit pas un ordre d'exécution particulier pour les fonctions composants, vous ne pouvez donc pas communiquer entre elles au travers de variables externes.  Toute communication doit passer par les props.

</Solution>

#### Réparer une liste d'histoires {/*fix-a-broken-story-tray*/}

Le PDG de votre société vous demande d'ajouter une « liste d'histoires » à votre appli d'horloge en ligne, et vous ne pouvez pas lui dire non. Vous avez écrit un composant `StoryTray` qui accepte une liste de `stories`, suivies par un emplacement « Créer une histoire ».

Vous avez implémenté ce dernier en ajoutant une pseudo-histoire supplémentaire à la fin du tableau `stories` que vous avez reçu en props. Mais pour une raison obscure, « Créer une histoire » apparaît plusieurs fois. Corrigez le problème.

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Créer une histoire'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "L’histoire d’Ankit" },
  {id: 1, label: "L’histoire de Clara" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: évite à la mémoire d'être trop phagocytée pendant
  // que vous lisez les docs.  On enfreint ici nos propres
  // règles !
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>Il est {time.toLocaleTimeString()}.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

Remarquez que chaque fois que l'horloge change, « Créer une histoire » est ajoutée *deux fois*. C'est un indice que la mutation est dans notre rendu : le Mode Strict appelle les composants deux fois pour rendre ce type de soucis plus facile à remarquer.

La fonction `StoryTray` n'est pas pure. En appelant `push` sur le tableau `stories` reçu (une prop !), elle modifie un objet créé *avant* que `StoryTray` ait commencé son rendu.  Ça donne un bug et un comportement imprévisible.

Le correctif le plus simple consiste à ne pas toucher au tableau du tout, et à ajouter « Créer une histoire » séparément :

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Créer une histoire</li>
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "L’histoire d’Ankit" },
  {id: 1, label: "L’histoire de Clara" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: évite à la mémoire d'être trop phagocytée pendant
  // que vous lisez les docs.  On enfreint ici nos propres
  // règles !
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>Il est {time.toLocaleTimeString()}.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Une autre approche consisterait à créer un *nouveau* tableau (en partant de celui existant) avant d'y ajouter un élément :

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  // Copier le tableau !
  let storiesToDisplay = stories.slice();

  // N'affecte plus le tableau d'origine :
  storiesToDisplay.push({
    id: 'create',
    label: 'Créer une histoire'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "L’histoire d’Ankit" },
  {id: 1, label: "L’histoire de Clara" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: évite à la mémoire d'être trop phagocytée pendant
  // que vous lisez les docs.  On enfreint ici nos propres
  // règles !
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>Il est {time.toLocaleTimeString()}.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

La mutation reste alors locale, et la fonction de rendu reste pure.  Toutefois, vous devez rester vigilant·e : par exemple, si vous tentiez de modifier un élément du tableau, il vous faudrait d'abord cloner ces éléments eux aussi.

Il est utile de savoir quelles opérations sur tableaux sont mutatives, et quelles opérations ne le sont pas. Par exemple, `push`, `pop`, `reverse` et `sort` modifieront le tableau d'origine, tandis que `slice`, `filter` et `map` en créeront un nouveau.

</Solution>

</Challenges>
