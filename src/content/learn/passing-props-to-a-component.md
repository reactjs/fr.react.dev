---
title: Passer des props à un composant
---

<Intro>

Les composants React utilisent des *props* pour communiquer entre eux.  Chaque composant parent peut passer des informations à ses composants enfants en leur donnant des props. Les props vous rappellent peut-être les attributs HTML, mais vous pouvez y passer n'importe quelle valeur JavaScript, y compris des objets et des fonctions.

</Intro>

<YouWillLearn>

* Comment passer des props à un composant
* Comment lire les props au sein d'un composant
* Comment spécifier des valeurs par défaut pour les props
* Comment passer du JSX à un composant
* Comment les props peuvent changer au fil du temps

</YouWillLearn>

## Props standardisées {/*familiar-props*/}

Les props sont des informations que vous passez à une balise JSX. Par exemple, une balise `<img>` compte parmi ses props `className`, `src`, `alt`, `width` et `height` :

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Les props que vous pouvez passer à une balise `<img>` sont bien définies (ReactDOM respecte le [standard HTML](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)). Mais vous pouvez passer les props de votre choix à *vos propres* composants, tels qu'`<Avatar>`, pour les personnaliser.  Voici comment faire !

## Passer des props à un composant {/*passing-props-to-a-component*/}

Dans le code qui suit, le composant `Profile` ne passe aucune prop à son composant fils, `Avatar` :

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

Vous pouvez donner quelques props à `Avatar` en deux étapes.

### Étape 1 : passez des props au composant enfant {/*step-1-pass-props-to-the-child-component*/}

Commencez par passer quelques props à `Avatar`.  Par exemple, passons deux props : `person` (un objet) et `size` (un nombre) :

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

Si les doubles accolades après `person=` vous déroutent, souvenez-vous qu'il s'agit [juste d'un littéral objet](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx) entre les accolades JSX.

</Note>

Vous pouvez maintenant lire ces props au sein du composant `Avatar`.

### Étape 2 : lisez les props dans le composant enfant {/*step-2-read-props-inside-the-child-component*/}

Vous pouvez lire ces props en listant leurs noms `person, size` séparés par des virgules entre `({` et `})` immédiatement après `function Avatar`. Ça vous permet de les utiliser dans le code d'`Avatar`, comme si vous aviez une variable locale.

```js
function Avatar({ person, size }) {
  // person et size sont disponibles ici
}
```

Ajoutez un peu de logique à `Avatar` qui se base sur les props `person` et `size` pour le rendu, et vous y serez !

Vous pouvez désormais configurer `Avatar` pour s'afficher de différentes façons selon les valeurs de ses props. Essayez de jouer avec ces valeurs !

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma',
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
    </div>
  );
}
```

```js src/utils.js
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
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

Les props vous permettent de réfléchir aux composants parent et enfant indépendamment. Par exemple, vous pouvez modifier les props `person` et `size` au sein de `Profile` sans avoir à vous préoccuper de comment `Avatar` les utilise.  De la même façon, vous pouvez modifier l'utilisation interne de ces props par `Avatar` sans vous préoccuper de `Profile`.

Vous pouvez concevoir les props comme des « molettes » que vous pouvez ajuster. Elles jouent le même rôle que les arguments des fonctions — en fait, les props *sont* le seul argument de votre composant ! Les fonctions composants React ne prennent qu'un argument, qui est l'objet `props` :

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

Le plus souvent vous n'aurez pas besoin de l'objet `props` lui-même dans son intégralité, vous le déstructurerez donc en props individuelles.

<Pitfall>

**N'oubliez pas la paire d'accolades `{` et `}`** entre les parenthèses `(` et `)` lorsque vous déclarez les props dans la signature de votre fonction composant :

```js
function Avatar({ person, size }) {
  // ...
}
```

Cette syntaxe est appelée [« déstructuration »](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter) *(le MDN parle de façon discutable de « décomposition », qu'il amalgame en prime avec le rest/spread, NdT)* et c'est l'équivalent concis de la lecture des propriétés depuis le paramètre de la fonction :

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## Spécifier une valeur par défaut pour une prop {/*specifying-a-default-value-for-a-prop*/}

Si vous souhaitez donner une valeur par défaut à une prop pour qu'elle l'exploite lorsque le composant parent ne fournit pas de valeur, vous pouvez le faire dans la déstructuration en ajoutant `=` suivi de la valeur par défaut, juste après le nom de la prop :

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

À présent, si `<Avatar person={...} />` est utilisé sans prop `size`, la `size` sera définie à `100`.

La valeur par défaut n'est utilisée que si la prop `size` est manquante ou que vous passez `size={undefined}`. Mais si vous passez `size={null}` ou `size={0}`, la valeur par défaut **ne sera pas** utilisée.

## Transmettre des props avec la syntaxe de *spread* JSX {/*forwarding-props-with-the-jsx-spread-syntax*/}

Il peut arriver que passer des props soit très répétitif :

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

Un tel code répétitif n'est pas problématique en soi — il peut même être plus lisible.  Mais vous pourriez préférer la concision.  Certains composants refilent toutes leurs props à leurs enfants, comme ce `Profile` le fait avec `Avatar`.  Dans la mesure où ils n'utilisent pas leurs props directement, il peut être pertinent de recourir à la syntaxe de *spread*, nettement plus concise :

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

Ça transmet toutes les props de `Profile` à `Avatar` sans avoir à les lister chacune par leur nom.

**Utilisez la syntaxe de *spread* avec discernement.**  Si vous l'utilisez dans de nombreux composants, c'est que quelque chose ne va pas.  Le plus souvent, c'est un signe que vous devriez découper vos composants et passer du JSX enfant.  On va voir comment tout de suite !

## Passer du JSX comme enfant {/*passing-jsx-as-children*/}

On imbrique fréquemment les balises natives du navigateur :

```js
<div>
  <img />
</div>
```

Vous voudrez parfois faire de même avec vos propres composants :

```js
<Card>
  <Avatar />
</Card>
```

Lorsque vous imbriquez du contenu dans une balise JSX, le composant parent reçoit ce contenu sous forme d'une prop appelée `children`. Par exemple, le composant `Card` ci-dessous recevra une prop `children` qui vaudra `<Avatar />` et l'affichera dans une div d'enrobage :

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}
```

```js src/Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
```

```js src/utils.js
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
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

Tentez de remplacer le `<Avatar>` au sein de `<Card>` avec du texte pour constater que le composant `Card` peut enrober n'importe quel contenu imbriqué.  Il n'a pas besoin de « savoir » ce qui est affiché à l'intérieur de lui.  Vous retrouverez cette approche flexible dans de nombreux endroits.

Voyez la prop `children` d'un composant comme une sorte de « trou » qui peut être « rempli » par les composants parents avec du JSX quelconque.  Vous utiliserez souvent la prop `children` pour des enrobages visuels : panneaux, grilles, etc.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='Une Card ressemblant à une pièce de puzzle avec un emplacement pour les pièces « enfants » tels que du texte ou un Avatar' />

## Les props changent avec le temps {/*how-props-change-over-time*/}

Le composant `Clock` ci-dessous reçoit deux props de son composant parent : `color` et `time`. (Le code du composant parent est laissé de côté parce qu'il utilise un [état](/learn/state-a-components-memory), concept que nous n'avons pas encore exploré.)

Essayez de modifier la couleur dans la liste déroulante :

<Sandpack>

```js src/Clock.js active
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

Cet exemple illustre le fait qu'**un composant peut recevoir des props différentes au fil du temps**.  Les props ne sont pas toujours figées !  Ici la prop `time` change à chaque seconde, et la prop `color` change lorsque vous sélectionnez une autre couleur.  Les props reflètent les données du composant à un instant donné, plutôt que seulement leurs valeurs au démarrage.

Cependant, les props sont [immuables](https://fr.wikipedia.org/wiki/Objet_immuable) — un terme qui en informatique signifie « non modifiable ».  Lorsqu'un composant a besoin de changer ses props (par exemple, en réponse à une interaction utilisateur ou à de nouvelles données), il doit « demander » à son composant parent de lui passer *des props différentes* — et donc un nouvel objet !  Ses anciennes props seront alors mises au rebut, et le moteur JavaScript récupèrera à terme la mémoire qui leur était associée.

**N'essayez pas de « changer les props ».** Lorsque vous aurez besoin de réagir à une interaction utilisateur (telle qu'un changement de la couleur sélectionnée), vous devrez « mettre à jour l'état », ce que vous apprendrez à faire dans [L'état : la mémoire d'un composant](/learn/state-a-components-memory).

<Recap>

* Pour passer des props, ajoutez-les au JSX, comme pour des attributs HTML.
* Pour lire des props, utilisez une déstructuration comme dans  `function Avatar({ person, size })`.
* Vous pouvez spécifier une valeur par défaut comme `size = 100`, qui sera utilisée si la prop est manquante ou vaut `undefined`.
* Vous pouvez transmettre tous les props avec la syntaxe de *spread* JSX `<Avatar {...props} />`, mais n'en abusez pas !
* Le JSX imbriqué dans votre composant, comme dans `<Card><Avatar /></Card>` est fourni *via* la prop `children` du composant `Card`.
* Les props sont des instantanés en lecture seule : chaque rendu reçoit une nouvelle version des props.
* Ne modifiez pas les props. Si vous avez besoin d'interactivité, utilisez l'état.

</Recap>

<Challenges>

#### Extraire un composant {/*extract-a-component*/}

Ce composant `Gallery` contient un balisage très similaire pour deux profils. Extrayez-en un composant `Profile` pour réduire la duplication. Vous devrez choisir quelles props lui passer.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Scientifiques remarquables</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession : </b>
            physicienne et chimiste
          </li>
          <li>
            <b>Récompenses : 4 </b>
            (Prix Nobel de Physique, Prix Nobel de Chimie, Médaille Davy, Médaille Matteucci)
          </li>
          <li>
            <b>A découvert : </b>
            le Polonium (élément chimique)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession : </b>
            géochimiste
          </li>
          <li>
            <b>Récompenses : 2 </b>
            (Prix Miyake de géochimie, Prix Tanaka)
          </li>
          <li>
            <b>A découvert : </b>
            une méthode de mesure du dioxyde de carbone dans l’eau de mer
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

Commencez par extraire le balisage pour un des scientifiques. Puis trouvez les endroits qui divergent dans le second exemple, et rendez-les configurables par des props.

</Hint>

<Solution>

Dans cette solution, le composant `Profile` accepte plusieurs props : `imageId` (une chaîne de caractères), `name` (une chaîne), `profession` (une chaîne), `awards` (un tableau de chaînes), `discovery` (une chaîne) et `imageSize` (un nombre).

Remarquez que la prop `imageSize` a une valeur par défaut, raison pour laquelle on ne la passe pas au composant.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Profession :</b> {profession}</li>
        <li>
          <b>Récompenses : {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>A découvert : </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Scientifiques remarquables</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="physicienne et chimiste"
        discovery="le Polonium (élément)"
        awards={[
          'Prix Nobel de Physique',
          'Prix Nobel de Chimie',
          'Médaille Davy',
          'Médaille Matteucci'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='géochimiste'
        discovery="une méthode de mesure du dioxyde de carbone dans l’eau de mer"
        awards={[
          'Prix Miyake de géochimie',
          'Prix Tanaka'
        ]}
      />
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Remarquez que vous n'avez pas besoin d'une prop distinte `awardCount` si `awards` est un tableau : vous pouvez utiliser `awards.length` pour compter les récompenses.  Souvenez-vous que les props peuvent contenir n'importe quelle valeur, y compris des tableaux !

Une autre solution, plus semblable aux premiers exemples de cette page, consisterait à regrouper les informations d'une personne dans un objet unique, puis à passer cet objet en tant que prop :

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Profession :</b> {person.profession}
        </li>
        <li>
          <b>Récompenses : {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>A découvert : </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Scientifiques remarquables</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'physicienne et chimiste',
        discovery: 'le Polonium (élément)',
        awards: [
          'Prix Nobel de Physique',
          'Prix Nobel de Chimie',
          'Médaille Davy',
          'Médaille Matteucci'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'géochimiste',
        discovery: 'une méthode de mesure du dioxyde de carbone dans l’eau de mer',
        awards: [
          'Prix Miyake de géochimie',
          'Prix Tanaka'
        ],
      }} />
    </div>
  );
}
```

```js src/utils.js
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
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Même si la syntaxe a un aspect légèrement différent parce qu'on décrit les propriétés d'un objet JavaScript plutôt qu'une collection d'attributs JSX, ces exemples sont au final équivalents, alors choisissez l'approche qui vous convient le mieux.

</Solution>

#### Ajuster la taille d'une image sur base d'une prop {/*adjust-the-image-size-based-on-a-prop*/}

Dans cet exemple, `Avatar` reçoit une prop numérique `size` qui détermine les largeur et hauteur de l'`<img>`.  La prop `size` est définie à `40` dans cet exemple. Pourtant, si vous ouvrez l'image dans un nouvel onglet (cliquez bouton droit dessus pour pouvoir le faire), vous constaterez que l'image elle-même est plus grande (`160` pixels).  La véritable taille de l'image est déterminée en fonction de la taille de vignette demandée.

Modifiez le composant `Avatar` pour demander la taille d'image la plus proche sur base de la prop `size`.  Plus précisement, si la `size` fait moins de `90`, passez `'s'` (pour *“small”*) plutôt que `'b'` (pour *“big”*) à la fonction `getImageUrl`.  Vérifiez que vos modifications fonctionnent en affichant des avatars avec différentes valeurs de la prop `size` et en ouvrant les images dans de nouveaux onglets.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{
        name: 'Gregorio Y. Zara',
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Voici comment vous pourriez vous y prendre :

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Vous pourriez même afficher une image avec un meilleur piqué pour les écrans à forte densité de pixels en prenant en compte [`window.devicePixelRatio`](https://developer.mozilla.org/docs/Web/API/Window/devicePixelRatio) :

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Les props vous permettent d'encapsuler ce type de logique à l'intérieur du composant `Avatar` (et de la faire évoluer plus tard si besoin) de façon à ce que tout un chacun puisse utiliser le composant `Avatar` sans avoir à réfléchir à la façon dont les images sont requêtées puis redimensionnées.

</Solution>

#### Passer du JSX dans la prop `children` {/*passing-jsx-in-a-children-prop*/}

Extrayez un composant `Card` du balisage ci-dessous, et utilisez la prop `children` pour lui passer divers contenus JSX :

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Photo</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>À propos</h1>
          <p>Aklilu Lemma était un scientifique éthiopien renommé qui a découvert le traitement naturel de la bilharziose.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

Tout JSX que vous placez à l'intérieur d'une balise de composant lui sera passée *via* sa prop `children`.

</Hint>

<Solution>

Voici comment vous pouvez utiliser le composant `Card` aux deux endroits :

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Photo</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>À propos</h1>
        <p>Aklilu Lemma était un scientifique éthiopien renommé qui a découvert le traitement naturel de la bilharziose.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

Vous pourriez aussi faire de `title` une prop distincte si vous souhaitez que chaque `Card` ait un titre :

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="Photo">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="À propos">
        <p>Aklilu Lemma était un scientifique éthiopien renommé qui a découvert le traitement naturel de la bilharziose.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>
