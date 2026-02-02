---
title: useRef
---

<Intro>

`useRef` est un Hook React qui vous permet de référencer une valeur qui n'est pas nécessaire au code du rendu lui-même.

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

Appelez `useRef` au niveau racine de votre composant pour déclarer une [ref](/learn/referencing-values-with-refs).

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `initialValue` : la valeur initiale pour la propriété `current` de l'objet ref.  Elle peut être de n'importe quel type. Cet argument est ignoré après le rendu initial.

#### Valeur renvoyée {/*returns*/}

`useRef` renvoie un objet doté d'une unique propriété :

* `current` : elle vaut initialement la `initialValue` que vous avez passée. Vous pourrez ensuite la modifier. Si vous passez l'objet `ref` à React en tant que prop `ref` d'un nœud JSX, React définira automatiquement sa propriété `current`.

Lors des rendus ultérieurs, `useRef` renverra le même objet.

#### Limitations {/*caveats*/}

* Vous pouvez modifier la propriété `ref.current`.  Contrairement à l'état, elle est modifiable. En revanche, si vous y stockez un objet nécessaire au rendu (par exemple un morceau de votre état), vous ne devriez pas modifier cet objet.
* Lorsque vous modifiez la propriété `ref.current`, React ne refait pas de rendu de votre composant. React n'est pas au courant de vos modifications parce qu'une ref est un objet JavaScript brut.
* Évitez d'écrire _ou même de lire_ `ref.current`  lors du rendu, sauf pour [l'initialiser](#avoiding-recreating-the-ref-contents).  Ça rendrait le comportement de votre composant imprévisible.
* En Mode Strict, React **appellera votre fonction composant deux fois** afin de [vous aider à repérer des impuretés accidentelles](/reference/react/useState#my-initializer-or-updater-function-runs-twice).  Ce comportement est limité au développement et n'affecte pas la production.  Chaque objet ref sera créé deux fois, mais une de ses versions sera ignorée.  Si votre fonction composant est pure (ce qui devrait être le cas), ça n'affectera en rien son comportement.

---

## Utilisation {/*usage*/}

### Référencer une valeur avec une ref {/*referencing-a-value-with-a-ref*/}

Appelez `useRef` au niveau racine de votre composant pour déclarer une ou plusieurs [refs](/learn/referencing-values-with-refs).

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef` renvoie un <CodeStep step={1}>objet ref</CodeStep> avec une unique <CodeStep step={2}>propriété `current`</CodeStep> initialement définie à la <CodeStep step={3}>valeur initiale</CodeStep> que vous avez fournie.

Lors des rendus ultérieurs, `useRef` renverra le même objet.  Vous pouvez en modifier la propriété `current` pour stocker une information que vous relirez plus tard.  Ça vous rappelle peut-être [l'état](/reference/react/useState), mais il y a une différence fondamentale.

**Modifier une ref ne redéclenche pas le rendu.**  Ça signifie que les refs sont idéales pour stocker des informations qui n'affectent pas le résultat visuel de votre composant. Par exemple, si vous devez stocker un [identifiant de timer](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) et le récupérer plus tard, mettez-le dans une ref.  Pour mettre à jour la valeur d'une ref, vous devez modifier manuellement sa <CodeStep step={2}>propriété `current`</CodeStep> :

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

Par la suite, vous pouvez lire l'identifiant du timer depuis la ref afin de [décommissionner le timer](https://developer.mozilla.org/fr/docs/Web/API/clearInterval) :

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

En utilisant une ref, vous garantissez que :

* Vous pouvez **stocker de l'information** d'un rendu à l'autre (contrairement aux variables classiques, réinitialisées à chaque rendu).
* La modifier **ne déclenche pas un nouveau rendu** (contrairement aux variables d'état, qui déclenchent un nouveau rendu).
* **L'information reste locale** à chaque instance de votre composant (contrairement aux variables extérieures, qui sont partagées).

Modifier une ref ne déclenche pas de nouveau rendu, de sorte que les refs sont inadaptées au stockage d'information que vous souhaitez afficher à l'écran. Utilisez plutôt des variables d'état pour ça. Apprenez comment [choisir entre `useRef` et `useState`](/learn/referencing-values-with-refs#differences-between-refs-and-state).

<Recipes titleText="Exemples de référencements de valeurs avec useRef" titleId="examples-value">

#### Compteur de clics {/*click-counter*/}

Ce composant utilise une ref pour garder le compte du nombre de fois qu'un bouton a été cliqué.  Notez qu'on peut parfaitement utiliser une ref plutôt qu'une variable d'état dans ce cas, puisque le compteur n'est lu et écrit qu'au sein d'un gestionnaire d'événement.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('Vous avez cliqué ' + ref.current + ' fois !');
  }

  return (
    <button onClick={handleClick}>
      Cliquez ici !
    </button>
  );
}
```

</Sandpack>

Si vous affichiez `{ref.current}` dans le JSX, le nombre ne serait pas mis à jour au clic. C'est parce que la redéfinition de `ref.current` ne déclenche pas de nouveau rendu. Les informations utilisées par le rendu devraient plutôt être stockées dans des variables d'état.

<Solution />

#### Chronomètre {/*a-stopwatch*/}

Cet exemple utilise une combinaison d'états et de refs. Tant `startTime` que `now` sont des variables d'état, parce qu'elles sont utilisées par le rendu. Mais nous devons aussi garder trace de [l'identifiant du timer](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) pour pouvoir l'arrêter lorsqu'on appuie sur le bouton.  Dans la mesure où cet identifiant de timer n'est pas utilisé par le rendu, il est préférable de le conserver dans une ref et de le mettre à jour manuellement.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Temps écoulé : {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Démarrer
      </button>{' '}
      <button onClick={handleStop}>
        Arrêter
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

**N'écrivez pas _et ne lisez pas_ `ref.current` lors du rendu.**

React s'attend à ce que le corps de votre composant [se comporte comme une fonction pure](/learn/keeping-components-pure) :

* Si les entrées (les [props](/learn/passing-props-to-a-component), l'[état](/learn/state-a-components-memory) et le [contexte](/learn/passing-data-deeply-with-context)) sont les mêmes, votre composant devrait renvoyer exactement le même JSX.
* L'appeler dans un ordre différent ou avec des arguments différents ne devrait pas affecter les résultats des autres appels.

Lire ou écrire une ref **lors du rendu** va à l'encontre de ces attentes.

```js {expectedErrors: {'react-compiler': [4]}} {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 N'écrivez pas une ref pendant le rendu
  myRef.current = 123;
  // ...
  // 🚩 Ne lisez pas une ref pendant le rendu
  return <h1>{myOtherRef.current}</h1>;
}
```

Vous pouvez plutôt lire ou écrire des refs **au sein de gestionnaires d'événements ou d'Effets**.

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ Vous pouvez lire ou écrire des refs dans un Effet
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ Vous pouvez lire ou écrire des refs dans un gestionnaire d'événement
    doSomething(myOtherRef.current);
  }
  // ...
}
```

Si vous *devez* lire [ou écrire](/reference/react/useState#storing-information-from-previous-renders) quelque chose durant le rendu, [utilisez plutôt un état](/reference/react/useState).

Lorsque vous enfreignez ces règles, votre composant restera peut-être opérationnel, mais la plupart des nouvelles fonctionnalités que nous sommes en train d'ajouter à React dépendent de ces attentes.  Apprenez plutôt comment [garder vos composants purs](/learn/keeping-components-pure#where-you-_can_-cause-side-effects).

</Pitfall>

---

### Manipuler le DOM avec une ref {/*manipulating-the-dom-with-a-ref*/}

Il est particulièrement courant d'utiliser une ref pour manipuler le [DOM](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API). React prend nativement en charge ce cas de figure.

Commencez par déclarer un <CodeStep step={1}>objet ref</CodeStep> avec une <CodeStep step={3}>valeur initiale</CodeStep> à `null` :

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

Passez ensuite votre objet ref comme prop `ref` du JSX d'un nœud DOM que vous souhaitez manipuler :

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

Une fois que React a créé le nœud DOM et l'a mis à l'écran, React définira la <CodeStep step={2}>propriété `current`</CodeStep> de votre objet ref pour pointer sur ce nœud DOM. Vous pouvez désormais accéder au nœud DOM de l'`<input>` et appeler des méthodes telles que [`focus()`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/focus) :

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

React remettra la propriété `current` à `null` lorsque le nœud sera retiré de l'écran.

Découvrez plus en détails la [manipulation du DOM avec des refs](/learn/manipulating-the-dom-with-refs).

<Recipes titleText="Exemples de manipulation du DOM avec useRef" titleId="examples-dom">

#### Activer un champ {/*focusing-a-text-input*/}

Dans cet exemple, cliquer sur le bouton activera le champ de saisie :

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Activer le champ de saisie
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Défiler jusqu'à une image {/*scrolling-an-image-into-view*/}

Dans cet exemple, cliquer sur le bouton fera défiler la page jusqu'à ce qu'une image soit visible.  Il utilise une ref vers le nœud DOM de la liste, puis appelle l'API [`querySelectorAll`](https://developer.mozilla.org/fr/docs/Web/API/Document/querySelectorAll) du DOM pour trouver l'image vers laquelle nous souhaitons défiler.

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // Cette ligne suppose une structure DOM bien définie :
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Neo
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Millie
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Bella
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<Solution />

#### Lecture / pause d'une vidéo {/*playing-and-pausing-a-video*/}

Cet exemple utilise une ref pour appeler les méthodes [`play()`](https://developer.mozilla.org/fr/docs/Web/API/HTMLMediaElement/play) et [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) d'un nœud DOM `<video>`.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Lecture'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### Exposer une ref vers votre composant {/*exposing-a-ref-to-your-own-component*/}

<<<<<<< HEAD
Il arrive que vous souhaitiez permettre à votre composant parent de manipuler une partie du DOM au sein de votre propre composant.  Par exemple, vous pourriez être en train d'écrire un composant `MyInput` et souhaiteriez que le parent puisse activer le champ de saisie qui y figure (et auquel le parent n'a pas accès).  Vous pouvez recourir à une combinaison de `useRef` pour référencer le champ et [`forwardRef`](/reference/react/forwardRef) pour l'exposer au composant parent. Consultez un [pas-à-pas détaillé](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) ici.
=======
Sometimes, you may want to let the parent component manipulate the DOM inside of your component. For example, maybe you're writing a `MyInput` component, but you want the parent to be able to focus the input (which the parent has no access to). You can create a `ref` in the parent and pass the `ref` as prop to the child component. Read a [detailed walkthrough](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) here.
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Activer le champ de saisie
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Éviter de recréer le contenu de la ref {/*avoiding-recreating-the-ref-contents*/}

React sauvegardera la valeur initiale de la ref au premier rendu, puis l'ignorera lors des rendus ultérieurs.

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

Même si le résultat de `new VideoPlayer()` n'est utilisé que lors du rendu initial, vous appelez quand même cette fonction à chaque rendu.  Ça peut gâcher les performances si cette création d'objet est coûteuse.

Pour résoudre ça, utilisez plutôt une initialisation conditionnelle, comme ceci :

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

En temps normal, lire ou écrire `ref.current` lors du rendu est interdit.  Ceci dit, c'est acceptable dans ce cas précis car le résultat sera toujours le même, et que la condition n'est vérifiée que lors de l'initialisation, ce qui la rend pleinement prévisible.

<DeepDive>

#### Comment éviter des vérifications de `null` lors d'appels ultérieurs à `useRef` {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

Si vous utilisez un vérificateur de types et souhaitez ne pas toujours avoir à vérifier le cas `null`, vous pouvez plutôt tenter une approche comme celle-ci :

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

Ici, la `playerRef` elle-même peut être `null`.  En revanche, vous devriez arriver à convaincre votre vérificateur de types qu'il n'y a aucun scénario dans lequel `getPlayer()` renvoie `null`. Utilisez alors `getPlayer()` dans vos gestionnaires d'événements.

</DeepDive>

---

## Dépannage {/*troubleshooting*/}

### Je n'arrive pas à obtenir une ref sur un composant personnalisé {/*i-cant-get-a-ref-to-a-custom-component*/}

Si vous tentez de passer une `ref` à votre propre composant, comme ceci :

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

…vous obtiendrez peut-être une erreur dans la console :

<ConsoleBlock level="error">

TypeError: Cannot read properties of null

</ConsoleBlock>

*(«  Avertissement : les fonctions composants ne peuvent pas recevoir de refs.  Toute tentative d'accéder à cette ref échouera.  Souhaitiez-vous utiliser React.forwardRef() ? », NdT)*

Par défaut, vos propres composants n'exposent pas de refs vers les nœuds DOM qu'ils contiennent.

Pour corriger ça, trouvez le composant vers lequel vous souhaitez obtenir une ref :

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

<<<<<<< HEAD
Enrobez-le alors dans un [`forwardRef`](/reference/react/forwardRef) comme ceci :
=======
And then add `ref` to the list of props your component accepts and pass `ref` as a prop to the relevant child [built-in component](/reference/react-dom/components/common) like this:
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

```js {1,6}
function MyInput({ value, onChange, ref }) {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
};

export default MyInput;
```

Le composant parent peut désormais obtenir une ref vers lui.

Explorez plus avant comment [accéder au nœuds DOM d'un autre composant](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes).
