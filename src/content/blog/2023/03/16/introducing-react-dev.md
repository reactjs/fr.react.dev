---
title: "Découvrez react.dev"
author: Dan Abramov et Rachel Nabors
date: 2023/03/16
description: Nous sommes enchantés d'annoncer aujourd'hui la sortie de react.dev, le nouveau site officiel de React et de sa documentation.  Dans ce billet, nous aimerions vous faire faire un tour du nouveau site.
---

Le 16 mars 2023 par [Dan Abramov](https://twitter.com/dan_abramov) et [Rachel Nabors](https://twitter.com/rachelnabors)

---

<Intro>

Nous sommes enchantés d'annoncer aujourd'hui la sortie de react.dev, le nouveau site officiel de React et de sa documentation.  Dans ce billet, nous aimerions vous faire faire un tour du nouveau site.

</Intro>

---

## tl;pl {/*tldr*/}

* Le nouveau site de React ([react.dev](https://fr.react.dev)) enseigne une pratique moderne de React basée sur les fonctions composants et les Hooks.
* Nous avons ajouté des diagrammes, des illustrations, des défis et plus de 600 exemples interactifs.
* La documentation historique de React a été déplacée sur [legacy.reactjs.org](https://legacy.reactjs.org).

## Nouveau site, nouveau domaine, nouvelle page d'accueil {/*new-site-new-domain-new-homepage*/}

Commençons par un peu de ménage.

Pour célébrer comme il se doit la sortie des nouvelles documentations et, plus important encore, pour clairement séparer le nouveau contenu de l'ancien, nous avons migré vers le domaine [react.dev](https://fr.react.dev). L'ancien domaine [reactjs.org](https://reactjs.org) redirigera sur `react.dev`.

L'ancienne documentation de React est désormais archivée sur [legacy.reactjs.org](https://fr.legacy.reactjs.org). Tous les liens existants vers l'ancien contenu redirigeront automatiquement là-bas pour éviter de « casser Internet », mais la documentation historique ne recevra que très peu de mises à jours.

Croyez-le ou non, React va bientôt avoir dix ans. En années JavaScript, c'est comme un siècle entier ! Nous avons [repensé la page d'accueil](/) pour refléter les raisons pour lesquelles nous pensons que React reste une excellente façon de construire des interfaces utilisateurs, et mis à jour le guide de démarrage pour mettre plus en avant les frameworks modernes basés sur React.

Si vous n'avez pas encore vu la nouvelle page d'accueil, allez donc y jeter un coup d'œil !

## Tout en React moderne avec les Hooks {/*going-all-in-on-modern-react-with-hooks*/}

Lorsque nous avons sorti les Hooks React en 2018, la documentation des Hooks supposait que les lecteurs étaient habitués aux composants à base de classes.  Ça a permis à la communauté d'adopter rapidement les Hooks, mais au bout d'un moment les anciennes docs ont échoué à bien accompagner les nouveaux utilisateurs.  Ils devaient apprendre React deux fois : d'abord pour les composants à base de classes, et à nouveau pour les Hooks.


**Les nouvelles docs enseignent React avec les Hooks dès le départ.**  Les docs sont découpées en deux grandes sections principales :

* **[Apprendre React](/learn)** est un cours complet, à suivre à votre rythme, qui enseigne React à partir de zéro.
* **[La Référence API](/reference)** fournit tous les détails et exemples d'utilisation pour chaque API de React.

Examinons plus en détail ce que vous trouverez dans chaque section.

<Note>

Il reste quelques rares cas d'utilisation pour les composants à base de classes, qui ne disposent pas encore d'un équivalent basé sur les Hooks. Les composants à base de classes restent pris en charge et sont documentés dans la section [API historique](/reference/react/legacy) du nouveau site.

</Note>

## Démarrage rapide {/*quick-start*/}

La section Apprendre commence par la page de [Démarrage rapide](/learn). C'est un rapide tour d'horizon de React.  Elle présente la syntaxe associée aux concepts de composants, de props et d'état local, mais ne rentre pas trop dans les détails.

Si vous aimez apprendre en pratiquant, nous vous recommandons de continuer avec le [tutoriel de tic-tac-toe](/learn/tutorial-tic-tac-toe). Il vous guide à travers la construction d'un petit jeu en React, tout en vous enseignant les compétences que vous utiliserez au quotidien. Voici ce que vous allez construire :

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = winner + ' a gagné';
  } else {
    status = 'Prochain tour : ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Aller au coup #' + move;
    } else {
      description = 'Revenir au début';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Nous aimerions aussi signaler [Penser en React](/learn/thinking-in-react) — c'est le tutoriel qui a permis à nombre d'entre nous de « comprendre » React. **Nous avons mis à jour ces deux tutoriels bien connus pour reposer sur les fonctions composants et les Hooks**, ils sont donc flambants neufs.

<Note>

L'exemple ci-dessus est un *bac à sable*.  Nous en avons mis plein partout dans ce site — plus de 600 !  Vous pouvez modifier n'importe quel bac à sable, voire cliquer sur “Fork” dans le coin supérieur droit pour l'ouvrir dans un nouvel onglet.  Les bacs à sable vous permettent de jouer rapidement avec les API React, d'explorer vos idées et de valider votre compréhension.

</Note>

## Apprendre React pas à pas {/*learn-react-step-by-step*/}

Nous souhaitons qu'absolument tout le monde puisse avoir la même opportunité d'apprendre React gratuitement, par eux-mêmes.

C'est pourquoi la section Apprendre est conçue comme un cours à suivre à votre rythme, découpé en chapitres. Les deux premiers chapitres décrivent les fondamentaux de React. Si vous commencez en React ou si vous voulez juste vous rafraîchir la mémoire, commencez par là :

- **[Décrire l'UI](/learn/describing-the-ui)** vous apprend à afficher des informations à l'aide de composants.
- **[Ajouter de l'interactivité](/learn/adding-interactivity)** vous apprend à mettre à jour l'affichage en réaction à des saisies utilisateur.

Les deux chapitres suivants sont plus avancés, et vous donneront une meilleure compréhension des parties plus subtiles de React :

- **[Gérer l'état](/learn/managing-state)** vous explique comment organiser votre code métier au fil de la croissance de votre application.
- **[Échappatoires](/learn/escape-hatches)** vous apprend à « sortir » de React, et surtout à savoir quand et pourquoi c'est pertinent, et quand ce serait une mauvaise idée.

Chaque chapitre comprend plusieurs pages associées. La plupart des pages enseignent une compétence ou technique particulière, comme [Écrire du balisage avec JSX](/learn/writing-markup-with-jsx), [Mettre à jour les objets d'un état](/learn/updating-objects-in-state) ou [Partager l'état entre des composants](/learn/sharing-state-between-components). Certaines pages se concentrent sur l'explication de notions importantes, commme [Rendu et Commit](/learn/render-and-commit) ou [L'état est un instantané](/learn/state-as-a-snapshot). Et d'autres pages encore, comme [Vous n'avez pas forcément besoin d'un Effet](/learn/you-might-not-need-an-effect), partagent les meilleures pratiques et intuitions que nous avons bâties au fil des ans.

Il n'est pas strictement obligatoire de lire ces chapitres séquentiellement. Qui a le temps pour ça ? Mais vous pourriez le faire, ça donnerait les meilleurs résultats. Chaque page de la section Apprendre se repose uniquement sur les concepts des pages qui la précèdent. Si vous souhaitez lire cette section comme un livre, n'hésitez pas !

### Vérifiez que vous avez compris grâce aux défis {/*check-your-understanding-with-challenges*/}

La plupart des pages de la section Apprendre se terminent par quelques défis pour vous permettre de valider votre compréhension.  Voici par exemple quelques défis issus de la page sur [l'affichage conditionnel](/learn/conditional-rendering#challenges).

Vous n'avez pas à les résoudre maintenant ! À moins que vous ne le vouliez *vraiment*.

<Challenges noTitle={true}>

#### Afficher un icône pour les objets non traités avec `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Utilisez l'opérateur conditionnel (`cond ? a : b`) pour afficher ❌ si `isPacked` ne vaut pas `true`.

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

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✅' : '❌'}
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

</Solution>

#### Afficher l'importance de l'objet avec `&&` {/*show-the-item-importance-with-*/}

Dans cet exemple, chaque `Item` reçoit une prop d'`importance` numérique.  Utilisez l'opérateur `&&` pour afficher « *(Importance : X)* » en italiques, mais seulement pour les objets dont l'importance n'est pas zéro.  Votre liste d'objets devrait à terme ressembler à ceci :

* Combinaison spatiale _(Importance : 9)_
* Casque à feuille d’or
* Photo de Tam _(Importance : 6)_

N'oubliez pas d'ajouter une espace entre les deux libellés !

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Liste d’affaires de Sally Ride</h1>
      <ul>
        <Item
          importance={9}
          name="Combinaison spatiale"
        />
        <Item
          importance={0}
          name="Casque à feuille d’or"
        />
        <Item
          importance={6}
          name="Photo de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

Voilà qui devrait marcher :

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance : {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Liste d’affaires de Sally Ride</h1>
      <ul>
        <Item
          importance={9}
          name="Combinaison spatiale"
        />
        <Item
          importance={0}
          name="Casque à feuille d’or"
        />
        <Item
          importance={6}
          name="Photo de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Remarquez qu'il faut écrire `importance > 0 && ...` plutôt que juste `importance && ...` afin de nous assurer que si `importance` vaut `0`, `0` ne sera pas affiché comme résultat !

Dans cette solution, on utilise deux conditions distinctes pour insérer une espace entre le nom et le libellé d'importance.  On aurait aussi pu utiliser un Fragment avec une espace au début : `importance > 0 && <> <i>...</i></>` ou ajouter l'espace immédiatement au début du `<i>` :  `importance > 0 && <i> ...</i>`.

</Solution>

</Challenges>

Remarquez le bouton « Afficher la solution » dans le coin inférieur gauche. Il est bien pratique pour comparer avec votre propre tentative !

### Bâtir votre intuition avec les diagrammes et illustrations {/*build-an-intuition-with-diagrams-and-illustrations*/}

Lorsqu'on ne trouvait pas une bonne manière d'expliquer quelque chose juste avec du code et des mots, on a ajouté des diagrammes pour vous aider à bâtir votre intuition.  Voici par exemple un des diagrammes de [Préserver et réinitialiser l'état](/learn/preserving-and-resetting-state) :

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagramme avec trois sections, avec une flèche allant d'une section à l'autre. La première section contient un composant React appelé « div » avec un seul enfant appelé « section », qui lui-même n'a qu'un seul enfant appelé « Counter », qui dispose d'une bulle d'état appelée « count » dont la valeur est à 3. La section du milieu a le même parent « div », mais les composants enfants ont maintenant été supprimés, indiqué par une image avec des étincelles. La troisième section a toujours le même parent « div », mais avec un nouvel enfant appelé « div » surligné en jaune, ainsi qu'un nouvel enfant appelé « Counter » contenant une bulle d'état appelée « count » avec une valeur à 0, le tout surligné en jaune.">

Quand la `section` change pour un `div`, la `section` est supprimée est le nouveau `div` est ajouté

</Diagram>

Vous verrez aussi des illustrations un peu partout dans les docs — en voici une qui parle du [navigateur qui dessine à l'écran](/learn/render-and-commit#epilogue-browser-paint):

<Illustration alt="Un navigateur dessine « nature morte avec l’élément carte »." src="/images/docs/illustrations/i_browser-paint.png" />

Nous avons eu confirmation par les éditeurs de navigateurs que cette représentation est scientifiquement juste à 100%.

## Une nouvelle référence API très détaillée {/*a-new-detailed-api-reference*/}

Dans la [référence API](/reference/react), chaque API de React dispose de sa propre page.  Ça inclut tous types d'API :

- Les Hooks fournis tels que [`useState`](/reference/react/useState).
- Les composants fournis tels que [`<Suspense>`](/reference/react/Suspense).
- Les composants natifs tels qu'[`<input>`](/reference/react-dom/components/input).
- Des API orientées frameworks comme [`renderToPipeableStream`](/reference/react-dom/server/renderToReadableStream).
- D'autres API React telles que [`memo`](/reference/react/memo).

Vous verrez que chaque page d'API est découpée en au moins deux parties : *Référence* et *Utilisation*.

[Référence](/reference/react/useState#reference) décrit la signature formelle de l'API en listant ses arguments et sa valeur renvoyée.  Cette partie reste concise mais peut sembler un peu abstraite si l'API en question vous est encore inconnue.  Elle décrit ce que fait l'API, mais pas comment s'en servir.

[Utilisation](/reference/react/useState#usage) illustre comment et pourquoi recourir à cette API dans la pratique, comme vous l'expliquerait un·e ami·e ou collègue.  Elle présente **chaque scénario classique d'utilisation de cette API qu'a anticipé l'équipe React**.  Nous avons ajouté des extraits de code avec des vignettes à codes couleurs, des exemples d'utilisation combinée avec d'autres API, et des recettes que vous pouvez copier-coller :

<Recipes titleText="Exemples basiques d'utilisation de useState" titleId="examples-basic">

#### Compteur (nombre) {/*counter-number*/}

Dans cet exemple, la variable d'état `count` contient un nombre. Elle est incrémentée en cliquant sur un bouton.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Vous avez cliqué sur ce bouton {count} fois
    </button>
  );
}
```

</Sandpack>

<Solution />

#### Champ de saisie (chaîne de caractères) {/*text-field-string*/}

Dans cet exemple, la variable d'état `text` contient une chaîne de caractères. Lors de la frappe, `handleChange` lit la dernière valeur du champ de saisie dans le DOM, et appelle `setText` pour mettre à jour l'état. Ça vous permet d'afficher le `text` courant en dessous.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('bonjour');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>Vous avez saisi : {text}</p>
      <button onClick={() => setText('bonjour')}>
        Réinitialiser
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Case à cocher (booléen) {/*checkbox-boolean*/}

Dans cet exemple, la variable d'état `liked` contient un booléen. Lorsque vous cliquez sur la case, `setLiked` met à jour la variable d'état `liked` selon que la case est cochée ou non. La variable `liked` est utilisée dans le rendu du texte sous la case à cocher.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        J’ai aimé
      </label>
      <p>Vous {liked ? 'avez' : 'n’avez pas'} aimé.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Formulaire (deux variables) {/*form-two-variables*/}

Vous pouvez déclarer plus d'une variable d'état dans le même composant. Chaque variable d'état est complètement indépendante des autres.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Clara');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Incrémenter l'âge
      </button>
      <p>Bonjour, {name}. Vous avez {age} ans.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

Certaines pages d'API comprennent aussi des parties [Dépannage](/reference/react/useEffect#troubleshooting) (pour les bugs courants) et [Alternatives](/reference/react-dom/findDOMNode#alternatives) (lorsque l'API est dépréciée).

Nous espérons que cette approche rendra la référence API utile non seulement pour retrouver rapidement la définition d'un argument, mais aussi pour explorer tout ce qu'on peut faire avec une API donnée — et comment la combiner à d'autres.

## Et maintenant ? {/*whats-next*/}

Voilà qui conclut notre visite guidée ! Baladez-vous sur le nouveau site, voyez ce que vous aimez ou pas, et n'hésitez pas à nous faire part de vos retours dans notre [gestion de tickets](https://github.com/reactjs/react.dev/issues).

Nous sommes conscients que ce projet a mis longtemps à voir le jour. Nous voulions mettre très haut la barre de la qualité, car nous estimons que la communauté React le mérite.  Durant l'écriture de ces docs et la création de tous les exemples, nous avons repéré des erreurs dans nos propres explications, des bugs dans React, et même des trous dans la conception de React que nous travaillons désormais à régler.  Nous espérons que cette documentation nous aidera à garder la barre très haut pour React à l'avenir.

Nous avons bien reçu vos demandes d'extension du contenu et des fonctionnalités du site, notamment :

- Une version TypeScript de tous les exemples ;
- Des guides à jour sur la performance, les tests et l'accessibilité ;
- Une documentation des React Server Components indépendante du framework utilisé ;
- La traduction des nouvelles docs grâce à notre communauté internationale ;
- L'ajout de fonctionnalités manquantes au nouveau site (par exemple un flux RSS pour ce blog).

À présent que [react.dev](https://fr.react.dev/) est sorti, nous allons pouvoir cesser de « rattraper » les ressources éducatives tierces sur React pour ajouter de nouvelles informations et améliorer le site.

Nous pensons qu'il n'y a jamais eu de meilleur moment pour apprendre React.

## Qui a travaillé sur tout ça ? {/*who-worked-on-this*/}

Dans l'équipe React, [Rachel Nabors](https://twitter.com/rachelnabors/) a piloté le projet (et fourni les illustrations) et [Dan Abramov](https://twitter.com/dan_abramov) a conçu le cursus. Ils ont par ailleurs co-écrit ensemble la majorité du contenu.

Naturellement, un projet de cette taille ne se fait pas avec une petite équipe dans son coin !  Nous avons beaucoup de monde à remercier !

[Sylwia Vargas](https://twitter.com/SylwiaVargas) a dépoussieré nos exemples pour aller au-delà des "foo/bar/baz" et des chatons et plutôt parler de scientifiques, d'artistes et de villes du monde. [Maggie Appleton](https://twitter.com/Mappletons) a transformé nos gribouillages en un système clair de diagrammes.

Merci à [David McCabe](https://twitter.com/mcc_abe), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite) et [Matt Carroll](https://twitter.com/mattcarrollcode) pour leurs rédactions de contenus complémentaires. Nous aimerions aussi remercier [Natalia Tepluhina](https://twitter.com/n_tepluhina) et [Sebastian Markbåge](https://twitter.com/sebmarkbage) pour leurs idées et leurs retours.

Merci à [Dan Lebowitz](https://twitter.com/lebo) pour la design du site et à [Razvan Gradinar](https://dribbble.com/GradinarRazvan) pour le design des bacs à sable.

Côté développement, merci à  [Jared Palmer](https://twitter.com/jaredpalmer) pour avoir codé le prototype. Merci à [Dane Grant](https://twitter.com/danecando) et [Dustin Goodman](https://twitter.com/dustinsgoodman) de [ThisDotLabs](https://www.thisdot.co/) pour leur aide dans le développement de l'UI. Merci à [Ives van Hoorne](https://twitter.com/CompuIves), [Alex Moldovan](https://twitter.com/alexnmoldovan), [Jasper De Moor](https://twitter.com/JasperDeMoor) et [Danilo Woznica](https://twitter.com/danilowoz) de [CodeSandbox](https://codesandbox.io/) pour leur boulot sur l'intégration des bacs à sable. Merci à [Rick Hanlon](https://twitter.com/rickhanlonii) pour son travail de qualité sur le développement et le design, l'affinage des couleurs et d'autres subtilités. Merci à [Harish Kumar](https://www.strek.in/) et [Luna Ruan](https://twitter.com/lunaruan) pour avoir ajouté des nouvelles fonctionnalités au site et pour nous aider à le maintenir.

Un immense merci à celles et ceux qui ont donné de leur temps pour participer aux programmes de tests alpha et beta. Votre enthousiasme et vos retours précieux nous ont aidé à affiner ces docs. Un merci tout particulier à notre beta testeuse [Debbie O'Brien](https://twitter.com/debs_obrien), qui a présenté son expérience avec les docs React à la React Conf 2021.

Enfin, merci à la communauté React de nous avoir inspirés dans cette entreprise.  Vous êtes la raison de tout cela, et nous espérons que ces nouvelles docs vous aideront à utiliser React pour construire toutes les interfaces utilisateurs que vous pourriez imaginer.
