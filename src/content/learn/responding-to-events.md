---
title: Réagir aux événements
---

<Intro>

React vous permet d’ajouter des *gestionnaires d’événements* à votre JSX. Les gestionnaires d’événements sont vos propres fonctions qui seront déclenchées en réponse aux interactions de l’utilisateur telles que des clics, survols, activations de champs de saisie de formulaires, etc.

</Intro>

<YouWillLearn>

* Différentes façons d’écrire un gestionnaire d’événement
* Comment passer la logique de gestion d’événement depuis un composant parent
* Comment les événements se propagent et comment les arrêter

</YouWillLearn>

## Ajouter des gestionnaires d’événements {/*adding-event-handlers*/}

Pour ajouter un gestionnaire d’événement, vous devrez d’abord définir une fonction et [la passer en tant que prop](/learn/passing-props-to-a-component) à la balise JSX appropriée. Par exemple, voici un bouton qui ne fait rien pour le moment :

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      Je ne fais rien
    </button>
  );
}
```

</Sandpack>

Vous pouvez lui faire afficher un message au clic de l'utilisateur en suivant ces trois étapes :

1. Déclarez une fonction appelée `handleClick` *dans* votre composant `Button`.
2. Implémentez la logique de cette fonction (utilisez `alert` pour afficher le message).
3. Ajoutez `onClick={handleClick}` au `<button>` du JSX.

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('Vous avez cliqué !');
  }

  return (
    <button onClick={handleClick}>
      Cliquez ici
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Vous avez défini la fonction `handleClick` puis l’avez [passée en tant que prop](/learn/passing-props-to-a-component) à `<button>`. `handleClick` est un **gestionnaire d’événement**. Les gestionnaires d’événements sont des fonctions qui :

* Sont généralement définies au sein de vos composants.
* Ont des noms qui commencent par `handle`, suivi du nom de l’événement.

Par convention, on nomme souvent les gestionnaires d’événements en utilisant `handle` suivi du nom de l’événement. Vous verrez souvent `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}`, etc.

Vous pouvez aussi définir un gestionnaire d’événement en ligne dans le JSX :

```jsx
<button onClick={function handleClick() {
  alert('Vous avez cliqué !');
}}>
```

Ou vous pouvez être plus concis en utilisant une fonction fléchée :

```jsx
<button onClick={() => {
  alert('Vous avez cliqué !');
}}>
```

Tous ces styles sont équivalents. Les gestionnaires d’événements en ligne sont notamment pratiques pour les fonctions courtes.

<Pitfall>

Vous devez *passer* une fonction comme gestionnaire d’événement, vous ne devez pas *l’appeler*.

Par exemple :

| Passer une fonction (correct)     | Appeler une fonction (incorrect)     |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

La différence est subtile. Dans le premier exemple, on passe la fonction `handleClick` comme gestionnaire d’événement à `onClick`. Ça indique à React de la mémoriser et d’appeler votre fonction uniquement lorsque l’utilisateur clique sur le bouton.

Dans le deuxième exemple, on appelle la fonction `handleClick()` (avec `()` à la fin), ce qui déclenche la fonction immédiatement pendant [le rendu](/learn/render-and-commit), sans aucun clic. C’est parce que le code JavaScript à l’intérieur des [accolades `{` et `}` du JSX](/learn/javascript-in-jsx-with-curly-braces) s’exécute immédiatement.

Quand vous écrivez du code en ligne, le même écueil se présente de manière différente :

| Passer une fonction (correct)            | Appeler une fonction (incorrect)    |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


Le code suivant passé en ligne à `onClick` ne se déclenchera pas lors du clic, mais à chaque fois que le composant fera son rendu :

```jsx
// alert se déclenchera à chaque rendu, pas au clic sur le bouton !
<button onClick={alert('Vous avez cliqué !')}>
```

Si vous souhaitez définir votre gestionnaire d’événement en ligne, enrobez-le dans une fonction anonyme de la manière suivante :

```jsx
<button onClick={() => alert('Vous avez cliqué !')}>
```

Au lieu d’exécuter le code à chaque rendu, ça crée une fonction à appeler ultérieurement.

Dans les deux cas, ce que vous souhaitez passer est une fonction :

* La fonction `handleClick` est passée à `<button onClick={handleClick}>`.
* La fonction `() => alert('...')` est passée à `<button onClick={() => alert('...')}>`.

Lisez [Les fonctions fléchées](https://fr.javascript.info/arrow-functions-basics) pour en apprendre davantage.

</Pitfall>

### Lire les props dans les gestionnaires d’événements {/*reading-props-in-event-handlers*/}

Puisque les gestionnaires d’événements sont déclarés à l’intérieur d’un composant, ils ont accès aux props du composant. Voici un bouton qui, lorsqu'on clique dessus, affiche une `alert` avec sa prop `message` :

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Lecture en cours !">
        Voir le film
      </AlertButton>
      <AlertButton message="Téléversement en cours !">
        Téléverser une image
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Ça permet à ces deux boutons d’afficher des messages différents. Essayez de modifier les messages qui leur sont passés.

### Passer des gestionnaires d’événements en tant que props {/*passing-event-handlers-as-props*/}

Souvent, vous souhaiterez que le composant parent spécifie le gestionnaire d’événement d’un composant enfant. Prenons l’exemple des boutons : en fonction de l’endroit où vous utilisez un composant `Button`, vous voudrez peut-être exécuter une fonction différente, par exemple voir un film ou téléverser une image.

Pour ça, vous devez passer une prop reçue du composant parent en tant que gestionnaire d’événement, comme ceci :

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`${movieName} en cours de lecture !`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Voir « {movieName} »
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Téléversement en cours !')}>
      Téléverser une image
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki la petite sorcière" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Dans cet exemple, le composant `Toolbar` affiche un `PlayButton` et un `UploadButton` :

- Dans `PlayButton`, on passe `handlePlayClick` à la prop `onClick` du `Button` qu'il contient.
- Dans `UploadButton`, on passe `() => alert('Téléversement en cours !')` à la prop `onClick` du `Button` qu'il contient.

Enfin, votre composant `Button` accepte une prop appelée `onClick` qu’il passe ensuite au composant natif `<button>` avec `onClick={onClick}`. Ça indique à React d’appeler la fonction lors du clic.

Si vous utilisez un [Design System](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), il est courant que des composants tels que les boutons contiennent des styles mais ne spécifient pas de comportement. À la place, des composants tels que `PlayButton` et `UploadButton` transmettront leurs gestionnaires d’événements.

### Nommer les props de gestionnaires d’événements {/*naming-event-handler-props*/}

Les composants natifs tels que `<button>` et `<div>` ne prennent en charge que les [événements navigateur](/reference/react-dom/components/common#common-props) comme `onClick`. Cependant, lorsque vous créez vos propres composants, vous pouvez nommer les props de gestionnaires d’événements comme vous le souhaitez.

Par convention, les noms des props de gestionnaires d’événements devraient commencer par `on`, suivi d’une lettre majuscule.

Par exemple, on aurait pu nommer la prop `onClick` du composant `Button` `onSmash` :

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Lecture en cours !')}>
        Voir le film
      </Button>
      <Button onSmash={() => alert('Téléversement en cours !')}>
        Téléverser une image
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Dans cet exemple, `<button onClick={onSmash}>` montre que le `<button>` (en minuscules) natif a toujours besoin d’une prop `onClick` mais le nom de la prop de votre composant `Button` vous appartient !

Lorsque votre composant prend en charge plusieurs interactions, vous pouvez nommer les props de gestionnaires d’événements en fonction des utilisations spécifiques à votre application. Par exemple, ce composant `Toolbar` reçoit les gestionnaires d’événements `onPlayMovie` et `onUploadImage` :

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

Remarquez que le composant `App` n’a pas besoin de savoir *ce que fera* `Toolbar` avec `onPlayMovie` ou `onUploadImage`. C’est un détail d’implémentation de `Toolbar`. Ici, `Toolbar` les transmet en tant que gestionnaires `onClick` à ses `Button`s, mais il pourrait également les déclencher ultérieurement avec un raccourci clavier. Nommer les props d’après des interactions spécifiques à l’application telles que `onPlayMovie` vous donne de la flexibilité pour modifier leur utilisation ultérieurement.

<Note>

Assurez-vous d’utiliser les balises HTML appropriées pour vos gestionnaires d’événements. Par exemple, utilisez [`<button onClick={handleClick}>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/button) au lieu de `<div onClick={handleClick}>` pour gérer les clics. Utiliser un composant `<button>` natif permet de bénéficier des comportements natifs du navigateur, tels que la navigation au clavier. Si vous n’aimez pas le style par défaut d’un bouton natif et que vous souhaitez le faire ressembler davantage à un lien ou à un autre élément d’UI, vous pouvez faire ça en CSS. [Apprenez-en davantage sur l'écriture de balisage accessible](https://developer.mozilla.org/fr/docs/Learn/Accessibility/HTML).

</Note>

## Propagation d’événements {/*event-propagation*/}

Les gestionnaires d’événements réagiront également aux événements provenant de tous les enfants que votre composant pourrait avoir. On dit que l’événement « bouillonne » ou « se propage » dans l’arbre : il commence à l’endroit où l’événement s’est produit, puis remonte dans l’arborescence.

L’élément `<div>` suivant *et* ses deux boutons ont leur propre gestionnaire d’événement `onClick`. D’après vous, quels gestionnaires d’événements se déclencheront lorsque vous cliquerez sur un bouton ?

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('Vous avez cliqué sur la barre d’outils !');
    }}>
      <button onClick={() => alert('Lecture en cours !')}>
        Voir le film
      </button>
      <button onClick={() => alert('Téléversement en cours !')}>
        Téléverser une image
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Si vous cliquez sur l’un des boutons, son `onClick` sera exécuté en premier, suivi de l’`onClick` de l’élément parent `<div>`. Ainsi, deux messages vont apparaître. Si vous cliquez sur la barre d’outils elle-même, seul l’`onClick` de l’élément `<div>` sera exécuté.

<Pitfall>

Tous les événements se propagent dans React, sauf `onScroll`, qui fonctionne uniquement sur l'élément JSX auquel il est attaché.

</Pitfall>

### Arrêter la propagation {/*stopping-propagation*/}

Les gestionnaires d’événements reçoivent un **objet événement** comme seul argument. Par convention, il est généralement appelé `e`, ce qui signifie *“event”* *(« événement », NdT)*. Vous pouvez utiliser cet objet pour obtenir des informations sur l’événement.

Cet objet événement vous permet également d’arrêter la propagation. Si vous souhaitez empêcher un événement de se propager vers les composants parents, vous devez appeler `e.stopPropagation()`, comme le fait le composant `Button` :

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('Vous avez cliqué sur la barre d’outils !');
    }}>
      <Button onClick={() => alert('Lecture en cours !')}>
        Voir le film
      </Button>
      <Button onClick={() => alert('Téléversement en cours !')}>
        Téléverser une image
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Quand vous cliquez sur un bouton :

1. React appelle le gestionnaire `onClick` passé au `<button>` natif.
2. Ce gestionnaire, défini dans `Button`, effectue les actions suivantes :
   * Appelle `e.stopPropagation()`, ce qui interrompt la propagation de l’événement.
   * Appelle la fonction `onClick`, qui est une prop transmise depuis le composant `Toolbar`.
3. Cette fonction, définie dans le composant `Toolbar`, affiche l’`alert` spécifique au bouton.
4. Étant donné que la propagation a été arrêtée, le gestionnaire `onClick` de l’élément parent `<div>` *ne s’exécute pas*.

L’appel à `e.stopPropagation()` fait que cliquer sur les boutons n’affiche désormais qu’une seule `alert` (du `<button>`) au lieu de deux (du `<button>` et de l’élément parent `<div>` de la barre d’outils). Cliquer sur un bouton ne revient pas à cliquer sur la barre d’outils qui l’enrobe. Il est donc logique d’arrêter la propagation dans cette UI.

<DeepDive>

#### Événements de la phase de capture {/*capture-phase-events*/}

Dans de rares cas, vous pourriez avoir besoin de capturer tous les événements sur les éléments enfants, *même s’ils ont arrêté la propagation*. Par exemple, vous souhaitez peut-être envoyer des logs dans un outil d’analyse à chaque clic, indépendamment de la logique de propagation. Vous pouvez le faire en ajoutant `Capture` à la fin du nom de l’événement :

```js
<div onClickCapture={() => { /* ça s’exécute en premier */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

Chaque événement se propage en trois phases :

1. Il descend depuis la racine, appelant tous les gestionnaires `onClickCapture`.
2. Il exécute le gestionnaire `onClick` de l’élément cliqué.
3. Il remonte, appelant tous les gestionnaires `onClick`.

Les événements de capture sont utiles pour du code tel que les systèmes de routage ou les outils d’analyse, mais vous ne les utiliserez probablement pas dans du code applicatif.

</DeepDive>

### Passer des gestionnaires d’événements au lieu de propager {/*passing-handlers-as-alternative-to-propagation*/}

Vous remarquerez ci-dessous que le gestionnaire du clic exécute une ligne de code _puis_ appelle la prop `onClick` passée par le parent :

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

Vous pourriez ajouter davantage de code à ce gestionnaire avant d’appeler le gestionnaire d’événement `onClick` du parent. Cette approche offre une *alternative* à la propagation. Elle permet au composant enfant de gérer l’événement tout en permettant au composant parent de spécifier un comportement supplémentaire. Contrairement à la propagation, ce n’est pas automatique. Mais l’avantage de ce concept tient à ce que vous pouvez suivre clairement l’ensemble de la chaîne de code qui s’exécute en réaction à un événement.

Essayez plutôt cette approche si vous vous appuyez sur la propagation d’événements et qu’il est difficile de retracer quels gestionnaires sont exécutés et pourquoi.

### Empêcher le comportement par défaut {/*preventing-default-behavior*/}

Certains événements natifs du navigateur ont un comportement par défaut qui leur est associé. Par exemple, lorsqu’un bouton à l’intérieur d’un élément `<form>` est cliqué, l’événement de soumission (`submit`) du formulaire se déclenche et, par défaut, provoque le rechargement complet de la page :

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Envoi en cours !')}>
      <input />
      <button>Envoyer</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Vous pouvez appeler `e.preventDefault()` sur l’objet événement pour empêcher ça :

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Envoi en cours !');
    }}>
      <input />
      <button>Envoyer</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Ne confondez pas `e.stopPropagation()` et `e.preventDefault()`. Ils sont tous les deux utiles, mais ils sont sans rapport :

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) est utilisé pour arrêter la propagation de l’événement vers les éléments parents.
* [`e.preventDefault()` ](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) est utilisé pour empêcher le comportement par défaut associé à un événement natif du navigateur.

## Les gestionnaires d’événements peuvent-ils avoir des effets de bord ? {/*can-event-handlers-have-side-effects*/}

Absolument ! Les gestionnaires d’événements sont l’endroit idéal pour les effets de bord.

Contrairement aux fonctions de rendu, les gestionnaires d’événements n’ont pas besoin d’être [purs](/learn/keeping-components-pure). Ce sont donc d'excellents endroits pour *changer* des trucs, par exemple modifier la valeur d’une saisie en réponse à une frappe, ou modifier une liste en réponse à un appui sur un bouton. Ceci dit, pour modifier des informations, vous avez d’abord besoin d’un moyen de les stocker. En React, ça se fait en utilisant [l’état, la mémoire d’un composant](/learn/state-a-components-memory). Vous apprendrez tout ça dans la page suivante.

<Recap>

* Vous pouvez gérer les événements en passant la fonction gestionnaire en tant que prop à un élément comme `<button>`.
* Les gestionnaires d’événements doivent être passés, **pas appelés !** Utilisez `onClick={handleClick}`, pas `onClick={handleClick()}`.
* Vous pouvez définir une fonction de gestion d’événement hors du JSX ou en ligne.
* Les gestionnaires d’événements sont définis au sein du composant, ce qui leur permet d’accéder à ses props et son état local.
* Vous pouvez déclarer un gestionnaire d’événement dans un composant parent et le passer en tant que prop à un enfant.
* Vous pouvez définir vos propres noms de gestionnaires d’événements spécifiques à l’application.
* Les événements se propagent vers le haut. Appelez `e.stopPropagation()` sur le premier argument pour empêcher ça.
* Les événements peuvent avoir des comportements navigateur par défaut que vous ne souhaitez pas. Appelez `e.preventDefault()` pour les empêcher.
* Appeler explicitement une prop de gestionnaire d’événement depuis un gestionnaire d’événement enfant est une bonne alternative à la propagation.

</Recap>



<Challenges>

#### Réparer un gestionnaire d’événement {/*fix-an-event-handler*/}

Cliquer sur ce bouton est censé alterner la couleur de l’arrière-plan de la page entre blanc et noir. Cependant, rien ne se produit lorsque vous cliquez dessus. Corrigez le problème. (Ne vous inquiétez pas de la logique à l’intérieur de `handleClick` - cette partie est correcte).

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Basculer la lumière
    </button>
  );
}
```

</Sandpack>

<Solution>

Le problème tient à ce que `<button onClick={handleClick()}>` _appelle_ la fonction `handleClick` lors du rendu au lieu de la _passer_ en tant que prop. On résout le problème en supprimant l’appel `()` pour que ça devienne `<button onClick={handleClick}>` :

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Basculer la lumière
    </button>
  );
}
```

</Sandpack>

Vous pourriez aussi enrober l’appel dans une autre fonction, par exemple `<button onClick={() => handleClick()}>` :

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Basculer la lumière
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Connecter les événements {/*wire-up-the-events*/}

Ce composant `ColorSwitch` affiche un bouton. Il est censé changer la couleur de la page. Connectez-le à la prop `onChangeColor` de gestionnaire d'événement qu'il reçoit de son composant parent, de sorte que la couleur change lorsqu'on clique sur le bouton.

Après avoir effectué cette modification, vous remarquerez que le clic du bouton incrémente également le compteur de clics de la page. Votre collègue, qui a écrit le composant parent, vous certifie que `onChangeColor` n’incrémente aucun compteur. Que pourrait-il se passer d’autre ? Corrigez ça afin qu'un clic sur le bouton change uniquement la couleur, mais n’incrémente _pas_ le compteur.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Changer la couleur
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Nombre de clics sur la page : {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

Tout d’abord, vous devez ajouter le gestionnaire d’événement : `<button onClick={onChangeColor}>`.

Cependant, ça introduit le problème de l’incrémentation du compteur. Si le problème ne vient pas de `onChangeColor`, comme le jure votre collègue, alors c’est que cet événement se propage vers le haut et qu’un autre gestionnaire situé au-dessus le fait. Pour résoudre ce problème, vous devez arrêter la propagation de l’événement. Mais n’oubliez pas que vous devez toujours appeler `onChangeColor`.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Changer la couleur
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Nombre de clics sur la page : {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
