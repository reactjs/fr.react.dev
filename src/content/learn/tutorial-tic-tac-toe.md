---
title: 'Tutoriel : Tic-Tac-Toe'
---

<Intro>

Dans ce tutoriel, vous allez construire un petit jeu de tic-tac-toe.  Ce tutoriel ne requiert aucune connaissance préalable de React. Les techniques que vous apprendrez dans ce tutoriel sont fondamentales pour construire n'importe quelle appli React : bien les comprendre vous donnera une compréhension profonde de React.

</Intro>

<Note>

Ce tutoriel est conçu pour les personnes qui préfèrent **apprendre en faisant** et qui veulent essayer de produire rapidement quelque chose de concret. Si vous préférez apprendre chaque concept pas à pas, commencez à la page [Décrire l'UI](/learn/describing-the-ui).

</Note>

Ce tutoriel est découpé en plusieurs sections :

- [Se préparer au tutoriel](#setup-for-the-tutorial) vous donnera **un point de départ** pour le tutoriel.
- [Survol](#overview) vous apprendra **les fondamentaux** de React : composants, props et état.
- [Finaliser le jeu](#completing-the-game) vous apprendra **les techniques les plus courantes** du développement React.
- [Voyager dans le temps](#adding-time-travel) vous donnera **une meilleure perception** des avantages uniques de React.

### Qu'allez-vous construire ? {/*what-are-you-building*/}

Dans ce tutoriel, vous allez construire un jeu de tic-tac-toe interactif avec React.

*(Le tic-tac-toe est souvent appelé par amalgame « morpion » en français ; les deux termes existent, mais le morpion n'est pas limité à 3 × 3 cases, NdT.)*

Vous pouvez voir ci-dessous à quoi ça ressemblera une fois terminé :

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

Si le code vous paraît incompréhensible, ou si des éléments de syntaxe vous semblent étranges, ne vous inquiétez pas ! L'objectif de ce tutoriel, c'est justement de vous aider à comprendre React et sa syntaxe.

Nous vous conseillons de manipuler le jeu de tic-tac-toe ci-dessus avant de continuer ce tutoriel.  Une des fonctionnalités que vous pourrez remarquer, c'est la liste numérotée des coups à droite du plateau de jeu.  Elle vous donne un historique de tous les coups joués lors de la partie, mise à jour au fil du temps.

Lorsque vous aurez fini de vous amuser avec ce jeu de tic-tac-toe finalisé, reprenez votre lecture de la page.  Pour ce tutoriel, vous commencerez avec un gabarit simple.  Notre prochaine étape consiste à vous préparer pour commencer à construire le jeu.

## Se préparer au tutoriel {/*setup-for-the-tutorial*/}

Dans l'éditeur de code interactif ci-dessous, cliquez sur **Fork** en haut à droite pour ouvrir l'éditeur dans un nouvel onglet sur le site web CodeSandbox. CodeSandbox vous permet d'écrire du code dans votre navigateur et de prévisualiser ce que verront les utilisateurs de l'appli que vous aurez créée. Le nouvel onglet devrait afficher un carré vide et le code de démarrage pour ce tutoriel.

<Sandpack>

```js src/App.js
export default function Square() {
  return <button className="square">X</button>;
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

<Note>

Vous pouvez aussi suivre ce tutoriel dans votre environnement de développement local.  Pour cela, suivez ces étapes :

1. Installez [Node.js](https://nodejs.org/fr/)
2. Dans l'onglet CodeSandbox ouvert plus tôt, appuyez sur le bouton en haut à gauche pour ouvrir le menu, puis choisissez **Télécharger la Sandbox** dans ce menu pour télécharger localement une archive des fichiers du projet
3. Décompressez le fichier d'archive puis ouvrez un terminal et faites un `cd` dans le dossier que vous venez de décompresser
4. Installez les dépendances avec `npm install`
5. Lancer `npm start` pour démarrer un serveur local et suivez les invites affichées pour voir le code s'exécuter dans le navigateur.

Si vous êtes bloqué·e, ne vous laissez pas décourager ! Suivez ce tutoriel en ligne et retentez une mise en place locale plus tard.

</Note>

## Survol {/*overview*/}

À présent que vous êtes prêt·e, attaquons un survol de React !

### Examiner le code de démarrage {/*inspecting-the-starter-code*/}

Dans CodeSandbox vous trouverez trois sections principales :

![CodeSandbox avec le code de démarrage](../images/tutorial/react-starter-code-codesandbox.png)

1. La section _Files_ contient une liste des fichiers du projet tels que `App.js`, `index.js`, `styles.css` et un dossier nommé `public`
2. Le _code editor_ affiche le code source du fichier sélectionné
3. Le _browser_ affiche le résultat du code que vous avez écrit

Le fichier `App.js` devrait être sélectionné dans la section _Files_. Le contenu de ce fichier dans le _code editor_ devrait être le suivant :

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

La section _browser_ devrait afficher un carré avec un X à l'intérieur, comme ceci :

![Carré avec un X à l’intérieur](../images/tutorial/x-filled-square.png)

Jetons maintenant un coup d'œil au code de démarrage.

#### `App.js` {/*appjs*/}

Le code dans `App.js` crée un _composant_. Dans React, un composant est un bout de code réutilisable qui représente une partie de l'interface utilisateur (UI, pour *User Interface*).  Les composants sont utilisés pour afficher, gérer et mettre à jour des éléments d'UI dans votre application.  Examinons ce composant ligne par ligne pour voir ce qui s'y passe :

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

La première ligne définit une fonction appelée `Square`. Le mot-clé JavaScript `export` rend cette fonction accessible à l'extérieur de ce fichier. Le mot-clé `default` indique aux autres fichiers utilisant votre code qu'il s'agit là de la fonction principale de votre fichier.

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

La deuxième ligne renvoie un bouton. Le mot-clé JavaScript `return` indique que tout ce qui le suit est renvoyé comme valeur à l'appelant de la fonction. `<button>` est un *élément JSX*. Un élément JSX est une combinaison de code JavaScript et de balises similaires à HTML, qui décrit ce que vous aimeriez afficher. `className="square"` est une propriété du bouton, ou *prop*, qui indique à CSS comment styler le bouton. `X` est le texte affiché à l'intérieur du bouton et `</button>` ferme l'élément JSX en indiquant que tout ce qui suit ne devrait pas figurer dans le bouton.

#### `styles.css` {/*stylescss*/}

Cliquez sur le fichier nommé `styles.css` dans la section _Files_ de CodeSandbox.  Ce fichier définit les styles de votre appli React. Les deux premiers _sélecteurs CSS_ (`*` et `body`) définissent le style de larges pans de votre appli, tandis que le sélecteur `.square` définit le style de tout composant dont la propriété `className` vaudra `square`. Dans votre code, ça correspondrait au bouton de votre composant `Square` dans le fichier `App.js`.

#### `index.js` {/*indexjs*/}

Cliquez sur le fichier nommé `index.js` dans la section _Files_ de CodeSandbox. Vous ne modifierez pas ce fichier pendant ce tutoriel, mais il est la passerelle entre le composant que vous avez créé dans le fichier `App.js` et le navigateur web.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

Les lignes 1 à 5 rassemblent toutes les pièces du puzzle :

* React
* La bibliothèque React qui parle aux navigateurs web (React DOM)
* Les styles de vos composants
* Le composant que vous avez créé dans `App.js`.

Le reste du fichier connecte tout ça et injecte le résultat final dans `index.html` au sein du dossier `public`.

### Construire le plateau de jeu {/*building-the-board*/}

Revenons à `App.js`.  C'est là que vous passerez le reste de ce tutoriel.

À ce stade, le plateau n'est constitué que d'une seule case, mais il vous en faut neuf ! Si vous vous contentez de copier-coller votre carré pour en faire deux, comme ceci :

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

…vous obtiendrez cette erreur :

<ConsoleBlock level="error">

/src/App.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX Fragment `<>...</>`?

</ConsoleBlock>

*(« Des éléments JSX adjacents doivent être enrobés par une balise englobante. Vouliez-vous utiliser un Fragment JSX `<>...</>` ? », NdT.)*

Les composants React doivent ne renvoyer qu'un unique élément JSX, et non plusieurs éléments JSX adjacents, comme nos deux boutons. Pour corriger ça, vous pouvez utiliser des *Fragments* (`<>` et `</>`) pour enrober plusieurs éléments JSX adjacents, comme ceci :

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

Vous devriez maintenant voir ça :

![Deux carrés avec des X à l’intérieur](../images/tutorial/two-x-filled-squares.png)

Super ! Maintenant vous n'avez plus qu'à copier-coller davantage pour obtenir neuf carrés…

![Neuf carrés sur une ligne, avec des X à l’intérieur](../images/tutorial/nine-x-filled-squares.png)

Disgrâce ! Les carrés sont tous sur la même ligne, au lieu de former une grille comme nous en avons besoin pour notre plateau.  Pour corriger ça, vous allez devoir grouper vos carrés en ligne avec des `div` et ajouter quelques classes CSS.  Tant que vous y êtes, donnez un numéro à chaque carré pour être sûr·e que vous savez où chaque carré est affiché.

Dans le fichier `App.js`, mettez à jour votre composant `Square` pour ressembler à ceci :

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

Le CSS défini dans `styles.css` style les `div` dotés de la `className` de valeur `board-row`.  À présent que vous avez groupé vos composants en ligne avec ces `div` mis en page, vous avez votre plateau de tic-tac-toe :

![plateau de tic-tac-toe rempli par les numéros 1 à 9](../images/tutorial/number-filled-board.png)

Mais nous avons un problème.  Votre composant nommé `Square` n'est plus vraiment un carré tout seul.  Corrigeons ça en changeant son nom pour `Board` :

```js {1}
export default function Board() {
  //...
}
```

À ce stade, votre code devrait ressembler à ceci :

<Sandpack>

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
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

<Note>

Psssst… Ça fait un paquet de saisie de code ! N'hésitez pas à copier-coller le code de cette page.  Ceci dit, si vous vous en sentez la force, nous vous conseillons de ne copier que le code que vous avez déjà tapé manuellement au moins une fois vous-même.

</Note>

### Fournir des données avec les props {/*passing-data-through-props*/}

Pour l'étape suivante, vous allez vouloir changer la valeur d'un carré de vide à « X » lorsque l'utilisateur clique sur le carré.  Vu comme vous avez construit votre tableau jusqu'ici, il vous faudrait copier-coller le code qui met à jour un carré neuf fois (une fois par carré) !  Plutôt que de le copier-coller, l'architecture de composants de React vous permet de créer un composant réutilisable pour éviter du code dupliqué mal fichu.

Pour commencer, copiez la ligne qui définit votre premier carré (`<button className="square">1</button>`) depuis votre composant `Board` vers un nouveau composant `Square` :

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

Ensuite, mettez à jour le composant `Board` pour afficher un composant `Square` grâce à la syntaxe JSX :

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Remarquez que contrairement aux `div` du navigateur, vos propres composants `Board` et `Square` doivent avoir un nom qui démarre par une lettre majuscule.

Voyons un peu le résultat :

![Un plateau rempli de chiffres un](../images/tutorial/board-filled-with-ones.png)

Palsambleu ! Vous avez perdu les carrés numérotés que vous aviez jusque-là.  À présent chaque carré dit « 1 ».  Pour corriger ça, vous allez utiliser des *props* pour passer la valeur que chaque carré devrait avoir depuis le composant parent (`Board`) vers les enfants (`Square`).

Mettez à jour le composant `Square` pour lire une prop `value` que vous passerez depuis le `Board` :

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })` indique que le composant `Square` peut recevoir une prop nommée `value`.

Utilisez maintenant la `value` plutôt que `1` dans l'affichage de chaque carré.  Essayez comme ceci :

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

Zut, ça ne marche pas :

![Un plateau rempli de « value »](../images/tutorial/board-filled-with-value.png)

Vous vouliez afficher le contenu de la variable JavaScript nommée `value` au sein de votre composant, pas le mot “value”.  Afin de « vous échapper vers JavaScript » depuis JSX, vous avez besoin d'accolades.  Ajoutez des accolades autour de `value` dans votre JSX, comme ceci :

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

Pour le moment, vous devriez voir un plateau vide :

![Un plateau vide](../images/tutorial/empty-board.png)

C'est parce que le composant `Board` ne passe pas encore de prop `value` à chaque composant `Square` qu'il affiche.  Corrigez ça en ajoutant une prop `value` adaptée pour chaque composant `Square` affichée par le composant `Board` :

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

Vous devriez retrouver votre grille numérotée :

![Un plateau de tic-tac-toe rempli des nombres 1 à 9](../images/tutorial/number-filled-board.png)

Votre code à jour devrait ressembler à ceci :

<Sandpack>

```js src/App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
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

### Rendre le composant interactif {/*making-an-interactive-component*/}

Faisons en sorte que le composant `Square` se remplisse d'un `X` lorsqu'on clique dessus.

Déclarez une fonction appelée `handleClick` au sein du composant `Square`.  Ensuite, ajoutez la prop `onClick` à l'élément JSX de bouton renvoyé par `Square` :

```js {2-4,9}
function Square({ value }) {
  function handleClick() {
    console.log('cliqué !');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

 Désormais, si vous cliquez sur un carré, vous devriez voir un message disant `"cliqué !"` dans l'onglet _Console_ en bas de la section _Browser_ de CodeSandbox. Des clics supplémentaires devraient à nouveau y afficher `"cliqué !"`. Des logs multiples du même message n'ajouteront pas de lignes dans la console : vous verrez plutôt un compteur s'incrémenter à côté du premier message `"cliqué !"`.

<Note>

Si vous suivez ce tutoriel dans votre environnement de développement local, vous aurez besoin d'ouvrir la console de votre navigateur. Par exemple, si vous utilisez un navigateur basé Chromium tel que Chrome, Edge ou Brave, vous pouvez ouvrir la console avec le raccourci clavier **Maj + Ctrl + J** (sur Windows/Linux) ou **Option + ⌘ + J** (sur macOS).

</Note>

Vous souhaitez maintenant que le composant `Square` « se souvienne » qu'on lui a cliqué dessus, et se remplisse alors avec la marque « X ».  Pour « se souvenir » de choses, les composants utilisent *l'état*.

React fournit une fonction spéciale appelée `useState` que vous pouvez appeler depuis votre composant pour qu'il « se souvienne » de choses.  Stockons donc la valeur actuelle de `Square` dans un état, et modifions-la quand on clique sur le `Square`.

Importez `useState` au début du fichier. Retirez la prop `value` du composant `Square`.  Remplacez-la par une nouvelle ligne au début de la fonction `Square` qui appelle `useState`.  Faites-lui renvoyer une variable d'état appelée `value` :

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value` stocke la valeur et `setValue` est une fonction qu'on peut utiliser pour modifier la valeur. Le `null` passé à `useState` est utilisé comme valeur initiale de la variable d'état, de sorte que `value` démarre ici à `null`.

Puisque le composant `Square` n'accepte plus de props, vous pouvez retirer les props `value` des neuf composants `Square` créés dans le composant `Board` :

```js {6-8,11-13,16-18}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Modifiez maintenant `Square` pour afficher un « X » quand on clique dessus. Remplacez le `console.log("cliqué !");` du gestionnaire d'événement par `setValue('X');`. À présent votre composant `Square` devrait ressembler à ceci :

```js {5}
function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

En appelant la fonction `set` depuis un gestionnaire `onClick`, vous demandez à React d'afficher à nouveau ce `Square` chaque fois qu'on clique sur le `<button>`.  Après la mise à jour, la `value` dans ce `Square` sera `'X'`, et vous verrez donc un « X » sur le plateau de jeu.  Cliquez sur n'importe quel carré, et un « X » y apparaîtra :

![Ajouts de X sur le plateau de jeu](../images/tutorial/tictac-adding-x-s.gif)

Chaque `Square` a son propre état : la `value` stockée par chaque `Square` est totalement indépendante des autres. Lorsque vous appelez la fonction `set` dans un composant, React met automatiquement à jour ses composants enfants aussi.

Après que vous aurez fait les modifications ci-dessus, votre code devrait ressembler à ceci :

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
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

### Outils de développement React {/*react-developer-tools*/}

Les outils de développement React *(React DevTools, NdT)* vous permettent d'examiner les props et l'état de vos composants React. Vous les trouverez dans l'onglet *React DevTools* en bas de la section _Browser_ de CodeSandbox :

![Les React DevTools dans CodeSandbox](../images/tutorial/codesandbox-devtools.png)

Pour examiner un composant spécifique à l'écran, utilisez le bouton en haut à gauche des outils de développement React :

![Sélection de composants sur la page dans les outils de développement React](../images/tutorial/devtools-select.gif)

<Note>

Pour le développement local, les outils de développement React sont disponibles sous forme d'extension navigateur pour [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) et [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil). Installez-les, après quoi l'onglet *Composants* apparaîtra dans les outils de développement de votre navigateur sur les sites utilisant React.

</Note>

## Finaliser le jeu {/*completing-the-game*/}

À ce stade, vous avez toutes les briques élémentaires de votre jeu de tic-tac-toe.  Pour finaliser le développement du jeu, vous devez placer des « X » et des « O » en alternance sur le plateau, et devez pouvoir déterminer qui gagne (et quand).

### Faire remonter l'état {/*lifting-state-up*/}

Actuellement, chaque composant `Square` maintient une partie de l'état du jeu.  Pour déterminer si quelqu'un a gagné la partie de tic-tac-toe, le `Board` doit donc se débrouiller pour connaître l'état de chacun des 9 composants `Square`.

Comment vous y prendriez-vous ? Vous pourriez d'abord penser que le `Board` a besoin de « demander » à chaque `Square` quel est son état interne.  Même si une telle approche est techniquement possible en React, nous la déconseillons car elle engendre du code difficile à comprendre, difficile à remanier et fortement sujet aux bugs.  La meilleure approche consiste plutôt à stocker l'état du jeu dans le composant parent `Board`, plutôt qu'éparpillé dans chaque `Square`. Le composant `Board` peut dire à chaque `Square` quoi afficher en lui passant une prop, comme vous l'aviez fait en passant un nombre à chaque `Square`.

**Pour récupérer des données depuis de multiples enfants, ou pour que deux composants enfants communiquent l'un avec l'autre, déclarez plutôt leur état partagé dans leur composant parent. Le composant parent peut transmettre cet état à ses enfants *via* les props. Ça permet de garder les enfants synchronisés entre eux, ainsi qu'avec leur parent.**

Faire remonter l'état dans un composant parent est une pratique courante lors de la refonte du code des composants React.

Tirons parti de cette opportunité pour essayer ça. Modifiez le composant `Board` pour qu'il déclare une variable d'état nommée `squares` qui contient par défaut un tableau de 9 `null` correspondant aux neuf cases :

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)` crée un tableau de neuf éléments puis les définit tous à `null`.  L'appel `useState()` qui l'enrobe déclare une variable d'état `squares` qui vaut initialement ce tableau. Chaque entrée du tableau correspond à la valeur d'une case. Lorsque vous remplirez le plateau par la suite, le tableau aura une valeur ressemblant davantage à ceci :

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

Le composant `Board` doit maintenant passer la prop `value` à chaque `Square` qu'il affiche :

```js {6-8,11-13,16-18}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

Modifiez ensuite le composant `Square` pour qu'il reçoive cette prop depuis le composant `Board`.  Il faudra donc retirer du composant `Square` sa gestion d'état interne pour `value` ainsi que la prop `onClick` du bouton :

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

À ce stade vous devriez avoir un plateau de tic-tac-toe vide :

![Un plateau vide](../images/tutorial/empty-board.png)

Et votre code devrait ressembler à ceci :

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
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

Chaque `Square` reçoit désormais une prop `value` qui vaudra `'X'`, `'O'`, ou `null` pour les cases vides.

Vous devez maintenant modifier ce qui se passe lorsqu'on clique sur un `Square`.  Le composant `Board` maintient désormais la liste des cases et leur remplissage. Vous allez devoir trouver un moyen pour que le composant `Square` mette à jour l'état du `Board`. Dans la mesure où un état est défini de façon privée par chaque composant, vous ne pouvez pas mettre à jour l'état de `Board` directement depuis `Square`.

Vous allez plutôt passer une fonction depuis le composant `Board` vers le composant `Square`, et ferez en sorte que `Square` appelle cette fonction lorsqu'on clique sur la case.  Commencez par définir la fonction que le composant `Square` appellera lors du clic. Vous la nommerez `onSquareClick` :

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Ajoutez ensuite la fonction `onSquareClick` aux props du composant `Square` :

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Vous allez maintenant connecter la prop `onSquareClick` à une fonction du composant `Board` que vous nommerez `handleClick`.  Pour connecter `onSquareClick` à `handleClick`, vous passerez la fonction à la prop `onSquareClick` du premier composant `Square` :

```js {7}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick} />
        //...
  );
}
```

Pour finir, vous définirez la fonction `handleClick` au sein du composant `Board` pour qu'elle mette à jour le tableau `squares` représentant l'état de votre plateau :

```js {4-8}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick() {
    const nextSquares = squares.slice();
    nextSquares[0] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

La fonction `handleClick` crée une copie du tableau `squares` (`nextSquares`) grâce à la méthode de tableau JavaScript `slice()`. Ensuite, `handleClick` met à jour le tableau `nextSquares` pour ajouter un `X` à la première case (index `[0]`).

On appelle alors la fonction `setSquares` pour avertir React que l'état du composant a changé. Ça déclenchera un nouvel affichage des composants qui utilisent l'état `squares` (donc `Board`), ainsi que de tous leurs composants enfants (les composants `Square` qui constituent le plateau).

<Note>

JavaScript utilise des [fermetures lexicales](https://developer.mozilla.org/docs/Web/JavaScript/Closures), ce qui signifie qu'une fonction imbriquée (ex. `handleClick`) a accès aux variables et fonctions définies dans une fonction englobante (ex. `Board`). La fonction `handleClick` peut lire l'état `squares` et appeler la fonction `setSquares` parce que les deux sont définis dans la fonction `Board`.

</Note>

Vous pouvez désormais ajouter des X au plateau… mais seulement dans la case en haut à gauche. Votre fonction `handleClick` indexe en dur cette case (`0`). Mettons `handleClick` à jour pour pouvoir modifier n'importe quelle case. Ajoutez un paramètre `i` à la fonction `handleClick`, destiné à recevoir l'index de la case du plateau à modifier :

```js {4,6}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

Ensuite, vous allez devoir passer ce `i` à `handleClick`.  Vous pourriez essayer de définir directement la prop `onSquareClick` des cases à `handleClick(0)`, comme dans le JSX ci-dessous, mais ça ne marchera pas :

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

Voici pourquoi ça ne marchera pas : l'appel `handleClick(0)` fera partie du rendu du composant plateau. Puisque `handleClick(0)` altère l'état du plateau en appelant `setSquares`, votre composant plateau tout entier va refaire un rendu. Mais celui-ci appellera à nouveau `handleClick(0)`, ce qui revient à une boucle infinie :

<ConsoleBlock level="error">

Too many re-renders. React limits the number of renders to prevent an infinite loop.

</ConsoleBlock>

*(« Trop de rendus successifs. React limite le nombre de rendus pour éviter des boucles infinies », NdT)*

Pourquoi n'avions-nous pas ce problème plus tôt ?

Lorsque vous passiez `onSquareClick={handleClick}`, vous passiez la fonction `handleClick` comme prop. Vous ne l'appeliez pas ! Mais désormais vous *appelez* cette fonction immédiatement — remarquez les parenthèses dans `handleClick(0)` — et c'est pourquoi elle s'exécute trop tôt. Vous ne *voulez pas* appeler `handleClick` avant que l'utilisateur ne clique !

Vous pourriez corriger ça en créant une fonction `handleFirstSquareClick` qui appelle `handleClick(0)`, une fonction `handleSecondSquareClick` qui appelle `handleClick(1)`, et ainsi de suite. Vous passeriez (plutôt qu'appeler) ces fonctions comme props, du genre `onSquareClick={handleFirstSquareClick}`. Ça règlerait le souci de boucle infinie.

Ceci dit, définir neuf fonctions distinctes avec des noms dédiés, c'est verbeux…  Faisons plutôt comme ceci :

```js {6}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        // ...
  );
}
```

Remarquez la nouvelle syntaxe `() => `. Ici, `() => handleClick(0)` est une *fonction fléchée*, une syntaxe plus concise de définition de fonction.  Quand on cliquera sur la case, le code après la « flèche » `=>` sera exécuté, appelant alors `handleClick(0)`.

Il ne vous reste qu'à mettre à jour les huit autres cases pour appeler `handleClick` depuis des fonctions fléchées que vous passez. Assurez-vous que l'argument passé à chaque appel à `handleClick` correspond bien à l'index de la case en question :

```js {6-8,11-13,16-18}
export default function Board() {
  // ...
  return (
    <>
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
};
```

Vous pouvez à nouveau ajouter des X à n'importe quelle case du plateau en cliquant dessus :

![Remplir le plateau de X](../images/tutorial/tictac-adding-x-s.gif)

Mais cette fois, toute la gestion d'état est assurée par le composant `Board` !

Voici à quoi votre code devrait ressembler :

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

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
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

À présent que votre gestion d'état est dans le composant `Board`, le composant parent `Board` passe les props aux composants enfants `Square` de façon à ce qu'ils soient affichés correctement.  Lorsque vous cliquez sur un `Square`, le composant enfant `Square` demande désormais au composant parent `Board` de mettre à jour l'état du plateau. Lorsque l'état de `Board` change, aussi bien le composant `Board` que tous les enfants `Square` refont leur rendu automatiquement.  Conserver l'état de toutes les cases dans le composant `Board` nous permettra plus tard de déterminer qui gagne.

Récapitulons ce qui se passe techniquement lorsque l'utilisateur clique sur la case supérieure gauche du plateau pour y ajouter un `X` :

1. Le clic sur la case supérieure gauche exécute la fonction que le `button` a reçu dans sa prop `onClick` depuis le composant `Square`. Ce composant `Square` a reçu cette fonction dans sa prop `onSquareClick`, fournie par `Board`. Le composant `Board` a défini cette fonction directement dans son JSX. Elle appelle `handleClick` avec un argument à `0`.
2. `handleClick` utilise son argument (`0`) pour mettre à jour le premier élément du tableau `squares`, le faisant passer de `null` à `X`.
3. L'état `squares` du composant `Board` est mis à jour, du coup `Board` et tous ses enfants refont leur rendu. Ça modifie la prop `value` du composant `Square` d'index `0` pour la passer de `null` à `X`.

Au final l'utilisateur voit que la case supérieure gauche a changé après qu'il a cliqué dessus : elle est passée du vide à un `X`.

<Note>

L'attribut `onClick` de l'élément DOM `<button>` a un sens particulier pour React, parce qu'il s'agit d'un composant natif du navigateur. Pour des composants personnalisés comme `Square`, vous pouvez nommer vos props comme bon vous semble. Vous pourriez donner n'importe quel nom à la prop `onSquareClick` de `Square` ou à la fonction `handleClick` de `Board`, le code continuerait à fonctionner. Dans React, la convention de nommage consiste à utiliser `onSomething` pour les props qui représentent des événements et `handleSomething` pour les fonctions qui gèrent ces événements.

</Note>

### Pourquoi l'immutabilité est importante {/*why-immutability-is-important*/}

Voyez comme le code de `handleClick` utilise `.slice()` pour créer une copie du tableau `squares` au lieu de modifier le tableau existant.  Afin de comprendre pourquoi, nous devons d'abord parler d'immutabilité, et de l'importance d'apprendre cette notion.

Il y a deux approches générales pour faire évoluer des données. La première approche consiste à _modifier en place_ les données en changeant directement les valeurs. La seconde approche consiste à remplacer les données avec une nouvelle copie, dotée des modifications souhaitées.  Voici à quoi ça ressemblerait si vous modifiiez le tableau `squares` directement :

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// À présent `squares` vaut ["X", null, null, null, null, null, null, null, null];
```

Et voici à quoi ça ressemblerait si vous modifiiez les données sans toucher au tableau `squares` :

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// `squares` est intact, mais le premier élément de `nextSquares` vaut 'X' plutôt que `null`
```

Le résultat final est le même (c'est-à-dire, les données ont changé), mais l'approche qui préserve l'immutabilité a plusieurs avantages.

L'immutabilité facilite l'implémentation de fonctionnalités complexes. Plus tard dans ce tutoriel, vous implémenterez une fonctionnalité de « voyage dans le temps » qui vous permettra de consulter l'historique du jeu et de « revenir » à des coups passés.  Ce type de fonction n'est pas spécifique aux jeux — la capacité à défaire et refaire des actions est un besoin courant dans les applis. En évitant de modifier les données directement, il devient aisé de conserver leurs versions précédentes intactes pour les réutiliser ultérieurement.

L'immutabilité présente un autre avantage. Par défaut, tous les composants enfants refont automatiquement leur rendu lorsque l'état du composant parent change.  Ça inclut les composants enfants qui ne sont en pratique pas concernés par le changement. Même si le nouveau rendu n'est en soi pas perceptible par l'utilisateur (vous ne devriez pas activement chercher à l'éviter !), vous pourriez souhaiter sauter le rendu d'une partie de l'arborescence qui n'est clairement pas concernée pour des raisons de performances. L'immutabilité permet aux composants de comparer leurs données à un coût quasiment nul, pour détecter un changement.  Vous pourrez en apprendre davantage sur la façon dont React choisit de refaire ou non le rendu d'un composant dans [la référence de l'API `memo`](/reference/react/memo).

### Jouer par tours {/*taking-turns*/}

Il est temps de corriger un grave défaut de ce jeu de tic-tac-toe : il est pour le moment impossible de placer des « O » sur le plateau.

Vous allez définir le premier marqueur comme un « X » par défaut. Gardons trace de ça en ajoutant un nouvel élément d'état au composant `Board` :

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

Chaque fois qu'une personne jouera son tour, `xIsNext` (un booléen) sera basculé pour déterminer quel sera le joueur suivant, et l'état du jeu sera sauvegardé. Mettez à jour la fonction `handleClick` de `Board` pour basculer la valeur de `xIsNext` :

```js {7,8,9,10,11,13}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    //...
  );
}
```

À présent, lorsque vous cliquez sur plusieurs cases, elles alterneront entre `X` et `O`, comme de juste !

Mais attendez une minute, il y a un problème : essayez de cliquer plusieurs fois sur la même case :

![Un O écrase un X](../images/tutorial/o-replaces-x.gif)

Le `X` est écrasé par un `O` ! Même si ça pourrait constituer une variante intéressante du jeu, nous allons nous en tenir aux règles conventionnelles.

Lorsque vous marquez une case avec un `X` ou un `O`, vous ne vérifiez pas d'abord si la case a déjà une valeur `X` ou `O`.  Vous pouvez corriger ça en faisant un *retour anticipé*.  Vérifiez si la case a déjà un `X` ou un `O`. Si la case est déjà remplie, faites un `return` tôt dans la fonction `handleClick`, avant qu'elle ne tente de mettre à jour l'état du plateau.

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Désormais, vous ne pouvez plus ajouter des `X` ou des `O` que sur les cases vides ! Voici à quoi votre code devrait ressembler à ce stade :

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
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

### Déclarer la victoire {/*declaring-a-winner*/}

Maintenant que les joueurs peuvent participer tour à tour, vous allez vouloir déterminer à quel moment la partie est gagnée, ou s'il n'y a plus de tour à jouer.  Pour cela, ajoutez une petite fonction utilitaire nommée `calculateWinner` qui prend un tableau des 9 cases, vérifie s'il y a victoire et renvoie `'X'`, `'O'` ou `null` selon le cas.  Ne vous préocuppez pas trop du code de `calculateWinner`, il n'a rien de spécifique à React :

```js src/App.js
export default function Board() {
  //...
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
    [2, 4, 6]
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

<Note>

Peu importe que vous définissiez `calculateWinner` avant ou après `Board`.  Mettons-la à la fin pour ne pas avoir à défiler à travers elle chaque fois que vous souhaitez modifier vos composants.

</Note>

Vous appellerez `calculateWinner(squares)` dans la fonction `handleClick` du composant `Board` pour vérifier si un joueur a gagné.  Vous pouvez effectuer cette vérification au même endroit que celle pour une case déjà remplie.  Dans les deux cas, nous souhaitons un retour anticipé :

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Pour informer les joueurs que la partie est finie, vous pouvez afficher un texte du style « X a gagné » ou « O a gagné ». Pour y parvenir, ajoutez une section `status` au composant `Board`.  Le statut affichera le gagnant si la partie est terminée, et si elle reste en cours, indiquera à qui le tour :

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = winner + " a gagné";
  } else {
    status = "Prochain tour : " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

Félicitations ! Vous avez désormais un jeu fonctionnel de tic-tac-toe. Et vous avez appris les bases de React au passage. Finalement, _c'est à vous_ que revient réellement la victoire sur ce coup.  Voici à quoi devrait ressembler votre code :

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

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
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
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

## Voyager dans le temps {/*adding-time-travel*/}

À titre d'exercice final, nous allons permettre le « voyage dans le temps » vers des coups de la partie.

### Stocker un historique des coups {/*storing-a-history-of-moves*/}

Si nous avions modifié directement le tableau `squares`, il aurait été très difficile d'implémenter cette fonctionnalité de voyage dans le temps.

Heureusement, vous avez utilisé `slice()` pour créer une copie du tableau `squares` à chaque coup, considérant ce tableau comme immuable. Ça va vous permettre de stocker chaque version passée du tableau `squares`, et de naviguer entre les coups qui ont déjà eu lieu.

Vous stockerez les tableaux `squares` passés dans un nouveau tableau appelé `history`, qui disposera de sa propre variable d'état. Le tableau `history` représente tous les états du plateau, du premier au dernier coup, avec une forme comme celle-ci :

```jsx
[
  // Avant le premier coup
  [null, null, null, null, null, null, null, null, null],
  // Après le premier coup
  [null, null, null, null, 'X', null, null, null, null],
  // Après le deuxième coup
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### Faire (encore) remonter l'état {/*lifting-state-up-again*/}

Vous allez maintenant écrire un nouveau composant racine appelé `Game` pour afficher une liste des coups passés. C'est là que vous mettrez l'état `history`, qui contiendra l'intégralité de l'historique de la partie.

En plaçant l'état `history` dans le composant `Game`, vous pouvez retirer l'état `squares` de son composant enfant `Board`.  Tout comme vous aviez « fait remonter l'état » du composant `Square` vers le composant `Board`, vous le faites maintenant remonter depuis `Board` vers le composant racine `Game`.  Ce composant `Game` a ainsi le plein contrôle des données de `Board` et peut demander à `Board` d'afficher quelque part les coups précédents issus de `history`.

Commencez par ajouter un composant `Game` avec `export default`.  Faites-lui afficher un composant `Board` avec un peu de balisage supplémentaire :

```js {1,5-16}
function Board() {
  // ...
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}
```

Remarquez que vous avez retiré les mots-clés `export default` situés devant la déclaration `function Board() {` pour pouvoir les ajouter devant la déclaration `function Game() {`.  Ça indique au fichier `index.js` qu'il doit utiliser comme composant racine `Game` plutôt que `Board`. Les `div` supplémentaires renvoyées par le composant `Game` fournissent un endroit où afficher les informations sur la partie (vous le ferez plus tard).

Ajoutez des états au composant `Game` pour garder trace du prochain tour et de l'historique des coups :

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

Remarquez que `[Array(9).fill(null)]` est un tableau avec un unique élément, lequel est lui-même un tableau de 9 `null`.

Pour afficher les cases du coup actuel, lisez le dernier tableau de cases stocké dans `history`. Vous n'avez pas besoin d'un `useState` pour ça : vous avez déjà assez d'informations pour le calculer lors du rendu.

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

Ensuite, créez une fonction `handlePlay` au sein du composant `Game` qui sera appelée par le composant `Board` pour mettre à jour la partie.  Passez `xIsNext`, `currentSquares` et `handlePlay` comme props à votre composant `Board` :

```js {6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    // TODO
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        //...
  )
}
```

Faisons en sorte que le composant `Board` soit pleinement contrôlé par les props qu'il reçoit. Modifiez le composant `Board` pour qu'il accepte trois propriétés : `xIsNext`, `squares`, et la nouvelle fonction `onPlay` que `Board` pourra appeler pour mettre à jour le tableau des cases lorsqu'un joueur joue un coup. Ensuite, retirez les deux premières lignes de la fonction `Board`, qui appelaient `useState` :

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

Remplacez maintenant les appels à `setSquares` et `setXIsNext` dans la fonction `handleClick` du composant `Board` par un appel unique à votre nouvelle fonction `onPlay`, pour que le composant `Game` puisse mettre à jour le `Board` lorsque l'utilisateur clique sur une case :

```js {12}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //...
}
```

Le composant `Board` est désormais pleinement contrôlé par les props que lui passe le composant `Game`.  Il vous reste à implémenter la fonction `handlePlay` du composant `Game` pour remettre le jeu en état de marche.

Que devrait faire `handlePlay` lorsqu'on l'appelle ? Souvenez-vous que `Board` appelait auparavant `setSquares` avec un tableau mis à jour, alors qu'il appelle désormais `onPlay` avec ce même tableau.

La fonction `handlePlay` doit mettre à jour l'état de `Game` pour déclencher un nouveau rendu, mais nous n'avons plus de fonction `setSquares` disponible — nous utilisons maintenant la variable d'état `history` pour stocker cette information.  Vous aurez besoin de mettre à jour `history` en lui ajoutant le tableau `squares` à jour comme nouvelle entrée d'historique.  Il faudra aussi basculer `xIsNext`, tout comme le faisait `Board` :

```js {4-5}
export default function Game() {
  //...
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  //...
}
```

Dans ce code, `[...history, nextSquares]` crée un nouveau tableau qui contient tous les éléments existants de `history`, suivis de `nextSquares`. (Vous pouvez lire la [*syntaxe de spread*](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Spread_syntax) `...history` comme « énumère tous les éléments de `history` ».)

Par exemple, si `history` vaut `[[null,null,null], ["X",null,null]]` et `nextSquares` vaut `["X",null,"O"]`, alors le nouveau tableau `[...history, nextSquares]` vaudra `[[null,null,null], ["X",null,null], ["X",null,"O"]]`.

À ce stade, vous avez déplacé l'état pour qu'il vive dans le composant `Game`, et l'UI devrait à nouveau fonctionner comme avant la refonte.  Voici à quoi devrait ressembler votre code pour le moment :

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
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

### Afficher les coups passés {/*showing-the-past-moves*/}

Puisque vous enregistrez l'historique de la partie de tic-tac-toe, vous pouvez maintenant afficher au joueur une liste des coups passés.

Les éléments React tels que `<button>` sont des objets JavaScript bruts ; vous pouvez les passer où bon vous semble dans votre application. Pour afficher une liste d'éléments dans React, vous pouvez utiliser un tableau d'éléments React.

Vous avez déjà dans votre état un tableau `history` des coups, il vous faut donc le transformer en un tableau d'éléments React.  En JavaScript, transformer un tableau en un autre se fait généralement avec la [méthode `map` des tableaux](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/map) :

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

Utilisez `map` pour transformer votre `history` de coups en éléments React représentant des boutons à l'écran, et affichez une liste de boutons pour « revenir » à des coups passés. Faisons un `map` sur `history` dans le composant `Game` :

```js {11-13,15-27,35}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Aller au coup #' + move;
    } else {
      description = 'Revenir au début';
    }
    return (
      <li>
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
```

Vous pouvez voir le résultat ci-dessous. Notez que vous devriez voir une erreur dans la console des outils de développement, qui dit :

<ConsoleBlock level="warning">

Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of `Game`.

</ConsoleBlock>

*(« Avertissement : chaque enfant d'une liste devrait avoir une prop "key" unique. Vérifiez la méthode de rendu de `Game`. », NdT.)*

Vous la corrigerez dans la prochaine section.

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Aller au coup #' + move;
    } else {
      description = 'Revenir au début';
    }
    return (
      <li>
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

Lorsque vous itérez sur le tableau `history` au sein de la fonction que vous avez passée à `map`, l'argument `squares` vaut tour à tour chaque élément de `history`, et l'argument `move` vaut tour à tour chaque index de l'historique : `0`, `1`, `2`, etc. (Dans la plupart des cas, vous auriez besoin des données elles-mêmes, mais pour notre liste de coups nous n'avons besoin que des indices.)

Pour chaque coup de l'historique de notre partie de tic-tac-toe, vous créez un élément de liste `<li>` qui contient un bouton `<button>`. Le bouton a un gestionnaire `onClick` qui appelle une fonction nommée `jumpTo` (que vous n'avez pas encore écrite).

Pour le moment, vous devriez voir une liste des coups passés de la partie, ainsi qu'une erreur dans la console de développement.  Voyons ce que cette erreur de « clé » signifie.

### Choisir une clé {/*picking-a-key*/}

Lorsque vous affichez une liste, React stocke quelques informations sur chaque élément de liste affiché. Lorsque vous mettez la liste à jour, React a besoin de déterminer ce qui a changé. Vous pourriez avoir ajouté, retiré, réordonné ou mis à jour les éléments de la liste.

Imaginez une transition depuis…

```html
<li>Alexa : 7 tâches restantes</li>
<li>Ben : 5 tâches restantes</li>
```

…vers

```html
<li>Ben : 9 tâches restantes</li>
<li>Claudia : 8 tâches restantes</li>
<li>Alexa : 5 tâches restantes</li>
```

En plus des mises à jour de compteurs, un humain qui lirait ça dirait sans doute que vous avez inversé l'ordre d'Alexa et Ben, et inséré Claudia entre Alexa et Ben.  Seulement voilà, React n'est qu'un programme informatique et ne cherche pas à deviner quelle était votre intention, vous avez donc besoin de spécifier une propriété de _clé_ pour chaque élément de la liste afin de les différencier les uns des autres. Si vos données proviennent d'une base de données, les ID en base d'Alexa, Ben et Claudia pourraient être utilisés comme clés :

```js {1}
<li key={user.id}>
  {user.name} : {user.taskCount} tâches restantes
</li>
```

Quand votre liste est ré-affichée, React prend la clé de chaque élément de liste et recherche l'élément de la liste précédente avec la même clé. S'il ne le trouve pas, React crée un composant. Si la liste à jour n'a pas une clé qui existait auparavant, React détruit l'ancien composant correspondant. Si deux clés correspondent, le composant correspondant est déplacé si besoin.

Les clés informent React sur l'identité de chaque composant, ce qui lui permet de maintenir l'état d'un rendu à l'autre. Si la clé d'un composant change, il sera détruit puis recréé avec un état réinitialisé.

`key` est une propriété spéciale réservée par React. Lorsqu'un élément est créé, React extrait la propriété `key` et la stocke directement dans l'élément renvoyé. Même si `key` semble être passé comme une prop, React l'utilise automatiquement pour déterminer quel composant mettre à jour. Un composant n'a aucun moyen de demander la `key` que son parent a spécifié.

**Nous vous conseillons fortement d'affecter des clés appropriées dès que vous construisez des listes dynamiques.**  Si vous n'en avez pas, envisagez de restructurer vos données pour qu'elles en comportent.

Si aucune clé n'est spécifiée, React signalera une erreur et utilisera par défaut l'index dans le tableau comme clé. Recourir à l'index en tant que clé pose problème dès que vous essayez de réordonner la liste ou d'y insérer ou retirer des éléments.  Passer explicitement `key={i}` réduit certes l'erreur au silence, mais ne résout en rien le problème sous-jacent, c'est donc une approche généralement déconseillée.

Les clés n'ont pas besoin d'être uniques au global ; elles doivent juste être uniques au sein de la liste concernée.

### Implémenter le voyage dans le temps {/*implementing-time-travel*/}

Dans l'historique de la partie de tic-tac-toe, chaque coup passé a un ID unique qui lui est associé : c'est le numéro séquentiel du coup. Les coups ne peuvent jamais être réordonnées, modifiés ou insérés (ailleurs qu'à la fin), il est donc raisonnable d'utiliser l'index du coup comme clé.

Dans la fonction `Game`, vous pouvez ajouter la clé avec `<li key={move}>`, et si vous rechargez le jeu affiché, l'erreur de clé de React devrait disparaître :

```js {4}
const moves = history.map((squares, move) => {
  //...
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
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

Avant de pouvoir implémenter `jumpTo`, il faut que le composant `Game` détermine le coup que l'utilisateur est en train de consulter. Ajoutez une variable d'état nommée `currentMove`, qui vaudra par défaut `0` :

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

Mettez alors à jour la fonction `jumpTo` dans `Game` pour mettre à jour `currentMove`. Pensez aussi à mettre `xIsNext` à `true` si le numéro cible de `currentMove` est pair.

```js {4-5}
export default function Game() {
  // ...
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //...
}
```

Il faut maintenant apporter deux modifications à la fonction `handlePlay` de `Game`, appelée lorsqu'on clique sur une case.

- Si vous « revenez en arrière » puis faites un nouveau coup à partir de ce point, vous voulez ne conserver l'historique que jusqu'à ce point. Au lieu d'ajouter ` nextSquares` après tous les éléments (avec la syntaxe de *spread* `...`) de `history`, vous voudrez l'ajouter après les éléments de `history.slice(0, currentMove + 1)`, pour ne garder que cette portion de l'historique d'origine.
- À chaque coup, il faut mettre à jour `currentMove` pour pointer sur la dernière entrée d'historique.

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

Pour finir, il faut modifier le composant `Game` pour afficher le coup actuellement sélectionné, plutôt que de toujours afficher le dernier coup :

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

Si vous cliquez sur n'importe quelle étape de l'historique de la partie, le plateau de tic-tac-toe devrait immédiatement afficher l'état du plateau à cette étape-là.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
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

### Nettoyage final {/*final-cleanup*/}

Si vous observez attentivement le code, vous remarquerez peut-être que `xIsNext === true` quand `currentMove` est pair, et que `xIsNext === false` quand `currentMove` est impair. En d'autre termes, si vous connaissez la valeur de `currentMove`, vous pouvez toujours déduire celle de `xIsNext`.

Il n'y a dès lors aucune raison de stocker les deux informations dans l'état. En fait, vous devriez activement chercher à ne rien stocker de redondant dans l'état.  Simplifier ce que vous y stockez réduit les bugs et facilite la compréhension de votre code.  Modifiez `Game` de façon à ce qu'il ne stocke plus `xIsNext` comme une variable d'état distincte, mais le calcule plutôt sur base de `currentMove` :

```js {4,11,15}
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
  // ...
}
```

Vous n'avez plus besoin de la déclaration de variable d'état `xIsNext`, ni d'appels à `setXIsNext`.  Il n'y a du coup plus aucun risque que `xIsNext` et `currentMove` se désynchronisent, même si vous faisiez une erreur en codant un des composants.

### En résumé {/*wrapping-up*/}

Félicitations ! Vous avez créé un jeu de tic-tac-toe qui :

- vous permet de jouer au tic-tac-toe,
- signale lorsqu'un joueur a gagné la partie,
- stocke l'historique des coups au fil de la progression,
- permet aux joueurs de revoir l'historique de la partie en affichant les plateaux de chaque coup.

Beau boulot ! Nous espérons que vous avez désormais l'impression de raisonnablement comprendre comment fonctionne React.

Le résultat final est ici :

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

Si vous avez un peu plus de temps ou souhaitez pratiquer vos compétences React toutes fraîches, voici quelques idées d'améliorations que vous pourriez apporter à ce jeu de tic-tac-toe, par ordre croissant de difficulté :

1. Pour le coup actuel uniquement, affichez « Vous êtes au coup #… » plutôt qu'un bouton.
2. Remaniez `Board` pour qu'il utilise deux boucles au lieu de coder les rangées et cases du plateau en dur.
3. Ajoutez un bouton de bascule qui permet de trier les coups par ordre croissant (du premier au dernier) ou décroissant (du dernier au premier).
4. Lorsqu'un joueur gagne, mettez en exergue les trois cases qui constituent sa victoire (et si personne ne gagne, affichez un message indiquant un match nul).
5. Affichez l'emplacement de chaque coup (ligne, colonne) dans l'historique des coups joués.

Au cours de ce tutoriel, vous avez abordé des concepts React tels que les éléments, les composants, les props et l'état. À présent que vous avez pu les voir en action dans le cadre de la construction de ce jeu, allez donc lire [Penser en React](/learn/thinking-in-react) pour explorer ces mêmes concepts React dans le cadre de la construction de l'UI d'une appli.
