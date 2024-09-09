---
title: Décrire l’UI
---

<Intro>

React est une bibliothèque JavaScript pour afficher des interfaces utilisateurs (UI). L'UI est construite à partir de petites briques telles que des boutons, des textes ou des images. React vous permet de les combiner sous forme de *composants* réutilisables et imbricables. Des sites web aux applis mobiles, tout ce qui figure sur un écran peut être découpé en composants.  Dans ce chapitre, vous apprendrez à créer, personnaliser et afficher conditionnellement des composants React.

</Intro>

<YouWillLearn isChapter={true}>

* [Comment écrire votre premier composant React](/learn/your-first-component)
* [Quand et comment créer des fichiers multi-composants](/learn/importing-and-exporting-components)
* [Comment ajouter du balisage au JavaScript grâce à JSX](/learn/writing-markup-with-jsx)
* [Comment utiliser les accolades avec JSX pour utiliser pleinement JavaScript dans vos composants](/learn/javascript-in-jsx-with-curly-braces)
* [Comment configurer les composants grâce aux props](/learn/passing-props-to-a-component)
* [Comment afficher des composants conditionnellement](/learn/conditional-rendering)
* [Comment afficher plusieurs composants à la fois](/learn/rendering-lists)
* [Comment éviter des bugs déroutants en gardant vos composants purs](/learn/keeping-components-pure)
* [L'utilité d'une conception arborescente de votre UI](/learn/understanding-your-ui-as-a-tree)

</YouWillLearn>

## Votre premier composant {/*your-first-component*/}

Les applications React sont construites à base de morceaux isolés de l'UI appelés *composants*. Un composant React est une fonction JavaScript avec un peu de balisage à l'intérieur. Les composants peuvent être de taille modeste, comme des boutons, ou occuper carrément toute la page.  Voici un composant `Gallery` qui affiche trois composants `Profile` :

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Scientifiques de renom</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/your-first-component">

Lisez **[Votre premier composant](/learn/your-first-component)** pour apprendre comment déclarer et utiliser des composants React.

</LearnMore>

## Importer et exporter des composants {/*importing-and-exporting-components*/}

Vous pouvez déclarer plusieurs composants dans un même fichier, mais les fichiers trop gros peuvent devenir difficiles à lire. Pour éviter ça, vous pouvez *exporter* un composant dans son propre fichier, et *importer* ce composant depuis un autre fichier :

<Sandpack>

```js src/App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Scientifiques de renom</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

Lisez **[Importer et exporter des composants](/learn/importing-and-exporting-components)** pour apprendre comment extraire des composants dans leurs propres fichiers.

</LearnMore>

## Écrire du balisage avec JSX {/*writing-markup-with-jsx*/}

Chaque composant React est une fonction JavaScript qui peut contenir du balisage que React retranscrit dans le navigateur. Les composants React utilisent une extension de syntaxe appelée JSX pour représenter ce balisage. JSX ressemble beaucoup à HTML, mais sa syntaxe est un peu plus stricte et permet d'afficher des informations dynamiques.

Si nous copions du balisage HTML existant dans un composant React, ça ne marchera pas toujours :

<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Liste de tâches de Hedy Lamarr</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Inventer de nouveaux feux de circulation
      <li>Répéter une scène de film
      <li>Améliorer les techniques de spectrographie
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

Si vous avez du HTML existant comme ça, vous pouvez le remettre d'aplomb en utilisant un [convertisseur](https://transform.tools/html-to-jsx) :

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Liste de tâches de Hedy Lamarr</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Inventer de nouveaux feux de circulation</li>
        <li>Répéter une scène de film</li>
        <li>Améliorer les techniques de spectrographie</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

Lisez **[Écrire du balisage avec JSX](/learn/writing-markup-with-jsx)** pour apprendre à écrire du JSX valide.

</LearnMore>

## JavaScript dans JSX grâce aux accolades {/*javascript-in-jsx-with-curly-braces*/}

JSX vous permet d'écrire du balisage similaire à HTML au sein d'un fichier JavaScript, ce qui permet de regrouper le contenu et la logique d'affichage dans un même endroit.  Vous voudrez parfois ajouter un peu de logique JavaScript dans votre balisage, ou y référencer une propriété dynamique.  Dans de tels cas, vous pouvez utiliser des accolades dans votre JSX pour « ouvrir une fenêtre » vers le monde JavaScript :

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Liste de tâches de {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Améliorer le visiophone</li>
        <li>Préparer les cours d’aéronautique</li>
        <li>Travailler sur un moteur à alcool</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

Lisez **[JavaScript dans JSX grâce aux accolades](/learn/javascript-in-jsx-with-curly-braces)** pour apprendre à accéder à des données JavaScript depuis JSX.

</LearnMore>

## Passer des props à un composant {/*passing-props-to-a-component*/}

Les composants React utilisent des *props* pour communiquer entre eux. Chaque composant parent peut passer des informations à ses composants enfants en leur fournissant des props. Les props vous rappellent peut-être les attributs HTML, mais vous pouvez y passer n'importe quelle valeur JavaScript, y compris des objets, des tableaux, des fonctions et même du JSX !

<Sandpack>

```js
import { getImageUrl } from './utils.js'

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

function Card({ children }) {
  return (
    <div className="card">
      {children}
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

<LearnMore path="/learn/passing-props-to-a-component">

Lisez **[Passer des props à un composant](/learn/passing-props-to-a-component)** pour apprendre comment passer puis lire des props.

</LearnMore>

## Affichage conditionnel {/*conditional-rendering*/}

Vos composants devront souvent produire des affichages distincts en fonction de certaines conditions.  Dans React, vous pouvez produire du JSX conditionnellement en utilisant des syntaxes JavaScript telles que les instructions `if` et les opérateurs `&&` et `? :`.

Dans cet exemple, on utilise l'opérateur JavaScript `&&` pour afficher conditionnellement une coche :

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Liste d’affaires de Sally Ride</h1>
      <ul>
        <Item
          isPacked={true}
          name="Combinaison spatiale"
        />
        <Item
          isPacked={true}
          name="Casque à feuille d’or"
        />
        <Item
          isPacked={false}
          name="Photo de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

Lisez **[Affichage conditionnel](/learn/conditional-rendering)** pour explorer les différentes manières d'afficher conditionnellement du contenu dans un composant.

</LearnMore>

## Afficher des listes {/*rendering-lists*/}

Vous aurez souvent besoin d'afficher plusieurs composants similaires pour refléter une collection de données.  Dans React, vous pouvez utiliser les méthodes `filter()` et `map()` de JavaScript pour filtrer et transformer votre tableau de données en un tableau de composants.

Pour chaque élément du tableau, vous devrez spécifier une `key`. En général, vous utiliserez un ID issu de la base de données comme `key`.  Les clés permettent à React de garder trace de la position d'un élément dans la liste lorsque celle-ci évolue.

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
        <b>{person.name} :</b>
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
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

Lisez **[Afficher des listes](/learn/rendering-lists)** pour apprendre comment afficher une liste de composants, et comment en choisir les clés.

</LearnMore>

## Garder les composants purs {/*keeping-components-pure*/}

Certaines fonctions JavaScript sont *pures*. Une fonction pure :

* **S'occupe de ses affaires.** Elle ne modifie aucun objet ou variable qui existaient avant son appel.
* **Pour les mêmes entrées, produit la même sortie.** Pour un jeu d'entrées données, une fonction pure renverra toujours le même résultat.

En écrivant rigoureusement vos composants comme des fonctions pures, vous éviterez une catégorie entière de bugs ahurissants et de comportements imprévisibles au fil de la croissance de votre base de code. Voici un exemple de composant impur :

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Erroné : modifie une variable qui existait déjà !
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

Pour rendre ce composant pur, vous pouvez lui passer l'information comme prop plutôt que de modifier une variable pré-existante :

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

<LearnMore path="/learn/keeping-components-pure">

Lisez **[Garder les composants purs](/learn/keeping-components-pure)** pour apprendre comment écrire vos composants au moyen de fonctions pures et prévisibles.

</LearnMore>

## Votre UI vue comme un arbre {/*your-ui-as-a-tree*/}

React utilise des arbres pour modéliser les relations entre les composants ou les modules.

Un arbre de rendu React représente les relations parent-enfants entre les composants.

<Diagram name="generic_render_tree" height={250} width={500} alt="Un graphe arborescent avec cinq nœuds, où chaque nœud représente un composant.  Le nœud racine est situé tout en haut du graphe et porte le libellé « Composant Racine ».  Deux flèches en partent pour atteindre plus bas deux nœuds libellés « Composant A » et « Composant C ». Chaque flèche porte le descripteur de relation « fait le rendu de ». Une flèche de rendu unique part du « Composant A » vers un nœud libellé « Composant B ». Une flèche de rendu unique part du « Composant C » vers un nœud libellé « Composant D ».">

Un exemple d’arbre de rendu React.

</Diagram>

Les composants proches du haut de l'arbre, près du composant racine, sont considérés comme des composants de haut niveau. Les composants qui n'ont pas de composants enfants sont qualifiés de composants feuilles. La catégorisation des composants aide à comprendre le flux de données et les performances de rendu.

Une autre manière utile de percevoir votre application consiste à modéliser les relations entre les modules JavaScript. Nous parlons alors d'arbre de dépendances de modules.

<Diagram name="generic_dependency_tree" height={250} width={500} alt="Un graphe arborescent avec cinq nœuds. Chaque nœud représente un module JavaScript. Le nœud tout en haut est libellé « RootModule.js ». Trois flèches en partent vers d’autres nœuds : « ModuleA.js », « ModuleB.js » et « ModuleC.js ». Chaque flèche porte le descripteur de relation « importe ». Un flèche d’import unique part de « ModuleC.js » vers un nœud libellé « ModuleD.js ».">

Un exemple d’arbre de dépendances de modules.

</Diagram>

On utilise souvent un arbre de dépendances dans les outils de *build* pour *bundler* tout le code JavaScript que le client devra télécharger pour assurer le rendu. Un *bundle* massif nuira à l'expérience utilisateur des applis React. Comprendre l'arborescence des dépendances de modules aide à déboguer ces problèmes.

<LearnMore path="/learn/understanding-your-ui-as-a-tree">

Lisez **[Votre UI vue comme un arbre](/learn/understanding-your-ui-as-a-tree)** pour apprendre comment créer des arbres de rendu ou de dépendances de modules pour une appli React, et voir en quoi ils constituent un modèle mental utile pour améliorer l'expérience utilisateur et les performances.

</LearnMore>

## Et maintenant ? {/*whats-next*/}

Allez sur [Votre premier composant](/learn/your-first-component) pour commencer à lire ce chapitre page par page !

Ou alors, si vous êtes déjà à l’aise avec ces sujets, pourquoi ne pas explorer comment [ajouter de l'interactivité](/learn/adding-interactivity) ?
