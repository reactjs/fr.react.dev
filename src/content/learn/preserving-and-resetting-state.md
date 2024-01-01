---
title: Préserver et réinitialiser l’état
---

<Intro>

L'état est isolé entre les composants. React garde en mémoire quel état appartient à quel composant en fonction de leur place dans l'arbre de l'interface utilisateur (l'UI). Vous pouvez contrôler quand préserver l'état et quand le réinitialiser entre les différents rendus.

</Intro>

<YouWillLearn>

* Quand React choisit de préserver ou de réinitialiser l'état
* Comment forcer React à réinitialiser l'état d'un composant
* Comment les clés et les types déterminent si l'état est préservé ou non

</YouWillLearn>

## L'état est lié à une position dans l'arbre {/*state-is-tied-to-a-position-in-the-tree*/}

React construit un [arbre de rendu](/learn/understanding-your-ui-as-a-tree#the-render-tree) pour représenter la structure des composants de votre UI.

Lorsque vous donnez un état à un composant, vous pouvez penser que l'état « vit » à l'intérieur du composant. En réalité, l'état est conservé à l'intérieur de React. React associe chaque élément d'état qu'il conserve au composant correspondant en fonction de la place que celui-ci occupe dans l'arbre de rendu.

Ci-dessous, il n'y a qu'une seule balise `<Counter />`, pourtant elle est affichée à deux positions différentes :

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Incrémenter
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Voici comment les visualiser sous forme d'arbre :

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Diagramme d'un arbre de composants React. Le nœud racine est appelé « div » et a deux enfants. Chacun d'eux est appelé « Counter » et contient une bulle d'état appelée « count » dont la valeur est à 0.">

L'arbre de React

</Diagram>

</DiagramGroup>

**Il s'agit de deux compteurs distincts car chacun d'eux a sa propre position dans l'arbre.** Généralement, vous n'avez pas besoin de penser à ces positions pour utiliser React, mais il peut être utile de comprendre comment ça fonctionne.

Dans React, chaque composant à l'écran a son propre état complétement isolé. Par exemple, si vous affichez deux composants `Counter` l'un à côté de l'autre, chacun d'eux aura ses propres variables d'état indépendantes de `score` et d'`hover`.

Cliquez sur chaque compteur et constatez qu'ils ne s'affectent pas l'un l'autre :

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Incrémenter
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Comme vous pouvez le voir, quand un compteur est mis à jour, seul l'état de ce composant est mis à jour :


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Diagramme avec un arbre de composants React. Le nœud racine est appelé « div » et a deux enfants. L'enfant à gauche est appelé « Counter » et contient un bulle d'état appelée « count » ayant une valeur à 0. L'enfant à droite est appelé « Counter » et contient une bulle d'état appelée « count » avec une valeur à 1. La bulle d'état de l'enfant à droite est surlignée en jaune afin d'indiquer que sa valeur a été mise à jour.">

Mise à jour de l’état

</Diagram>

</DiagramGroup>


React conservera l'état tant que vous afficherez le même composant à la même position dans l'arbre. Pour vous en rendre compte, incrémentez les deux compteurs, puis supprimez le deuxième composant en décochant « Afficher le deuxième compteur », et enfin remettez-le en cochant à nouveau la case :

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />}
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Afficher le deuxième compteur
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Incrémenter
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Remarquez qu'au moment où vous cessez d'afficher le deuxième compteur, son état disparaît complètement. Lorsque React supprime un composant, il supprime également son état.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Diagramme avec un arbre de composants React. Le nœud racine est appelé « div » et a deux enfants. L'enfant à gauche est appelé « Counter » et contient une bulle d'état appelée « count » avec une valeur à 0. L'enfant à droite est manquant, et à sa place est affichée une image avec des étincelles indiquant qu'il a été supprimé de l'arbre.">

Suppression d’un composant

</Diagram>

</DiagramGroup>

Lorsque vous cochez « Afficher le deuxième compteur », un deuxième `Counter` avec son état associé sont initialisés de zéro (`score = 0`), puis ajoutés au DOM.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Diagramme d'un arbre de composants React. Le nœud racine est appelé « div » et a deux enfants. L'enfant à gauche est appelé « Counter » et contient une bulle d'état appelée « count » avec une valeur à 0. L'enfant à droite est appelé « Counter » et contient une bulle d'état « count » valant 0. Tout le nœud de l'enfant à droite est surligné en jaune, indiquant qu'il vient juste d'être ajouté à l'arbre.">

Ajout d’un composant

</Diagram>

</DiagramGroup>

**React préserve l'état d'un composant tant qu'il est affiché à sa position dans l'arbre de l'UI.** S'il est supprimé, ou si un composant différent est affiché à la même position, alors React se débarrasse de son état.

## Le même composant à la même position préserve son état {/*same-component-at-the-same-position-preserves-state*/}

Dans cet exemple, il y a deux balises `<Counter />` différentes :

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} />
      ) : (
        <Counter isFancy={false} />
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Utiliser un style fantaisiste
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Incrémenter
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Quand vous cochez ou décochez la case, l'état du compteur n'est pas réinitialisé. Que `isFancy` soit à `true` ou à `false`, vous avez toujours un `<Counter />` comme premier enfant du `div` renvoyé par le composant racine `App` :

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Diagramme avec deux sections séparées par une flèche allant de l'une à l'autre. Chaque section affiche une structure de composants avec un parent appelé « App », contenant une bulle d'état appelée « isFancy ». Ce composant a un enfant appelé « div », qui amène à une bulle de prop contenant « isFancy » (qui est affichée en violet), laquelle est donnée plus bas à l'enfant unique. Le dernier enfant est appelé « Counter » et contient une bulle d'état appelée « count » dont la valeur est à 3 dans les deux diagrammes. Dans la section de gauche du diagramme, il n'y a rien de surligné et la valeur de l'état « isFancy » du parent est à false. Dans la section de droite, la valeur de l'état « isFancy » a été changée à true, et est surlignée en jaune, de la même façon que la bulle plus bas, qui a aussi sa valeur « isFancy » à true.">

Mettre à jour l’état de `App` ne remet pas à jour le `Counter` parce que ce dernier reste à la même position

</Diagram>

</DiagramGroup>


C'est le même composant à la même position, donc du point de vue de React, il s'agit du même compteur.

<Pitfall>

Souvenez-vous que **c'est la position dans l'arbre de l'UI — et non dans le JSX — qui importe à React** ! Ce composant a deux clauses `return` avec des balises JSX différentes de `<Counter />` à l'intérieur et l'extérieur du `if` :

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Utiliser un style fantaisiste
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Utiliser un style fantaisiste
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Incrémenter
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Vous pourriez supposer que l'état est réinitialisé quand vous cochez la case, mais ce n'est pas le cas ! C'est parce que **les deux balises `<Counter />` sont affichées à la même position**. React ne sait pas où vous placez les conditions dans votre fonction. Tout ce qu'il « voit » c'est l'arbre qui est renvoyé.

Dans les deux cas, le composant `App` renvoie un `<div>` avec un `<Counter />` comme premier enfant. Pour React, ces deux compteurs ont la même « adresse » : le premier enfant du premier enfant de la racine. C'est ainsi que React les associe d'un rendu à l'autre, peu importe la façon dont vous structurez votre logique.

</Pitfall>

## Des composants différents à la même position réinitialisent l'état {/*different-components-at-the-same-position-reset-state*/}

Dans cet exemple, cliquer sur la case remplacera `<Counter>` par un `<p>` :

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>À bientôt !</p>
      ) : (
        <Counter />
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Faire une pause
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Incrémenter
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Vous basculez ici entre deux types de composants _différents_ à la même position. À l'origine, le premier enfant du `<div>` contenait un `Counter`. Ensuite, comme vous l'avez échangé avec un `p`, React a supprimé le `Counter` de l'UI et détruit son état.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Diagramme avec trois sections, avec une flèche allant d'une section à une autre. La première section contient un composant React appelé « div » avec un seul enfant « Counter » contenant une bulle d'état appelée « count », avec une valeur à 3. La section du milieu a le même parent « div », mais le composant enfant a maintenant été supprimé, indiqué par une image avec des étincelles. La troisième section a toujours le même parent « div », mais avec un nouvel enfant appelé « p », surligné en jaune.">

Quand `Counter` est changé en `p`, le `Counter` est supprimé et le `p` est ajouté

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Diagramme avec trois sections, avec une flèche allant d'une section à une autre. La première section contient un composant React appelé « p ». La section du milieu a le même parent « div », mais le composant enfant a maintenant été supprimé, indiqué par une image avec des étincelles. La troisième section a toujours le même parent « div », mais avec un nouvel enfant appelé « Counter » contenant une bulle d'état « count » de valeur 0, surligné en jaune.">

En revenant en arrière, le `p` est supprimé et le `Counter` est ajouté

</Diagram>

</DiagramGroup>

Ainsi, **quand vous faites le rendu d'un composant différent à la même position, l'état de tout son sous-arbre est réinitialisé**. Pour comprendre comment ça fonctionne, incrémentez le compteur et cochez la case :

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} />
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Utiliser un style fantaisiste
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Incrémenter
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

L'état du compteur se réinitialise quand vous cliquez sur la case. Bien que vous affichiez un `Counter`, le premier enfant du `div` passe d'un `div` à une `section`. Lorsque l'enfant `div` a été retiré du DOM, tout l'arbre en dessous de lui (ce qui inclut le `Counter` et son état) a également été détruit.

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagramme avec trois sections, avec une flèche allant d'une section à l'autre. La première section contient un composant React appelé « div » avec un seul enfant appelé « section », qui lui-même n'a qu'un seul enfant appelé « Counter », qui dispose d'une bulle d'état appelée « count » dont la valeur est à 3. La section du milieu a le même parent « div », mais les composants enfants ont maintenant été supprimés, indiqué par une image avec des étincelles. La troisième section a toujours le même parent « div », mais avec un nouvel enfant appelé « div » surligné en jaune, ainsi qu'un nouvel enfant appelé « Counter » contenant une bulle d'état appelée « count » avec une valeur à 0, le tout surligné en jaune.">

Quand la `section` change pour un `div`, la `section` est supprimée est le nouveau `div` est ajouté

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Diagramme avec trois sections, avec une flèche allant d'une section à l'autre. La première section contient un composant React appelé « div » avec un seul enfant appelé « div », qui lui-même n'a qu'un seul enfant appelé « Counter », qui dispose d'une bulle d'état appelé « count » dont la valeur est à 0. La section du milieu a le même parent « div », mais les composants enfants ont maintenant été supprimés, indiqué par une image avec des étincelles. La troisième section a toujours le même parent « div », mais avec un nouvel enfant appelé « section » surligné en jaune, ainsi qu'un nouvel enfant appelé « Counter » contenant une bulle d'état appelée « count » de valeur 0, le tout surligné en jaune.">

En revenant en arrière, le `div` est supprimé et la nouvelle `section` est ajoutée

</Diagram>

</DiagramGroup>

De manière générale, **si vous voulez préserver l'état entre les rendus, la structure de votre arbre doit « correspondre »** d'un rendu à l'autre. Si la structure est différente, l'état sera détruit car React détruit l'état quand il enlève un composant de l'arbre.

<Pitfall>

Voici pourquoi il ne faut pas imbriquer les définitions des fonctions des composants.

Ici, la fonction du composant `MyTextField` est définie à *l'intérieur de* `MyComponent` :

<Sandpack>

```js
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Cliqué {counter} fois</button>
    </>
  );
}
```

</Sandpack>


Chaque fois que vous appuyez sur le bouton, l'état du champ de saisie disparaît ! C'est parce qu'une fonction `MyTextField` *différente* est créée à chaque rendu de `MyComponent`. Puisque vous affichez composant *différent* à la même position, React réinitialise tout l'état en dessous. Ça cause des bugs et des problèmes de performances. Pour éviter ce problème, **déclarez toujours les fonctions de composants au niveau racine, et n'imbriquez pas leurs définitions**.

</Pitfall>

## Réinitialiser l'état à la même position {/*resetting-state-at-the-same-position*/}

Par défaut, React préserve l'état d'un composant tant que celui-ci conserve sa position. Généralement, c'est exactement ce que vous voulez, c'est donc logique qu'il s'agisse du comportement par défaut. Cependant, il peut arriver que vous vouliez réinitialiser l'état d'un composant. Regardez cette appli qui permet à deux joueurs de surveiller leur score pendant leur tour :

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Clara" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Joueur suivant !
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>Score de {person} : {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Incrémenter
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Pour le moment, le score est conservé quand vous changez de joueur. Les deux `Counter` apparaissent à la même position, donc React les voit comme *le même* `Counter` dont la prop `person` a changé.

Conceptuellement, dans cette appli, ils doivent être considérés comme deux compteurs distincts. Ils apparaissent certes à la même place dans l'UI, mais l'un est pour Clara, l'autre pour Sarah.

Il y a deux façons de réinitialiser l'état lorsqu'on passe de l'un à l'autre :

1. Afficher les composants à deux positions différentes.
2. Donner explicitement à chaque composant une identité avec `key`.


### Option 1 : changer la position du composant {/*option-1-rendering-a-component-in-different-positions*/}

Si vous souhaitez rendre ces deux `Counter` indépendants, vous pouvez choisir de les afficher à deux positions différentes :

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Clara" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Joueur suivant !
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>Score de {person} : {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Incrémenter
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* Initialement, `isPlayerA` vaut `true`. Ainsi la première position contient l'état de `Counter`, tandis que la seconde position est vide.
* Quand vous cliquez sur le bouton « Joueur suivant », la première position se vide et la seconde contient désormais un `Counter`.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Diagramme d'un arbre de composants React. Le parent est appelé « Scoreboard » avec une bulle d'état appelée « isPlayerA » qui vaut true. Le seul enfant, placé à gauche, est appelé « Counter », avec une bulle d'état appelée « count » dont la valeur est à 0. L'enfant à gauche est entièrement surligné en jaune, indiquant qu'il a été ajouté.">

État initial

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Diagramme d'un arbre de composants React. Le parent est appelé « Scoreboard » avec une bulle d'état appelée « isPlayerA » qui vaut false. La bulle d'état est surlignée en jaune, indiquant qu'elle a changé. L'enfant à gauche est remplacé par une image avec des étincelles, indiquant qu'il a été supprimé, et il y a désormais un nouvel enfant à droite, surligné en jaune indiquant qu'il a été ajouté. Le nouvel enfant est appelé « Counter » et contient une bulle d'état appelée « count » avec une valeur à 0.">

Appui sur « Joueur suivant »

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Diagramme d'un arbre de composants React. Le parent est appelé « Scoreboard » avec une bulle d'état appelée « isPlayerA » qui vaut true. La bulle d'état est surlignée en jaune, indiquant qu'elle a changé. Il y a un nouvel enfant à gauche, surligné en jaune pour indiquer qu'il a été ajouté. Ce nouvel enfant est appelé « Counter » et contient une bulle d'état appelée « count » avec une valeur à 0. L'enfant à droite est remplacé par une image avec des étincelles, indiquant qu'il a été supprimé.">

Nouvel appui sur « Joueur suivant »

</Diagram>

</DiagramGroup>

Chaque état de `Counter` est supprimé dès que ce dernier est retiré du DOM. C'est pour ça qu'il est réinitialisé à chaque fois que vous appuyez sur le bouton.

Cette solution est pratique quand vous n'avez qu'un petit nombre de composants indépendants à afficher à la même position dans l'arbre. Dans cet exemple, vous n'en avez que deux, ce n'est donc pas compliqué de faire leurs rendus séparément dans le JSX.

### Option 2 : réinitialiser l'état avec une clé {/*option-2-resetting-state-with-a-key*/}

Il existe une méthode plus générique pour réinitialiser l'état d'un composant.

Vous avez peut-être déjà vu les `key` lors de [l'affichage des listes](/learn/rendering-lists#keeping-list-items-in-order-with-key). Ces clés ne sont pas réservées aux listes ! Vous pouvez les utiliser pour aider React à faire la distinction entre n'importe quels composants. Par défaut, React utilise l'ordre dans un parent (« premier compteur », « deuxième compteur ») pour différencier les composants. Les clés vous permettent de dire à React qu'il ne s'agit pas simplement d'un *premier* compteur ou d'un *deuxième* compteur, mais plutôt un compteur spécifique — par exemple le compteur de *Clara*. De cette façon, React reconnaîtra le compteur de *Clara* où qu'il apparaisse dans l'arbre.

Dans cet exemple, les deux `<Counter />` ne partagent pas leur état, bien qu'ils apparaissent à la même position dans le JSX :

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Clara" person="Clara" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Joueur suivant !
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>Score de {person} : {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Incrémenter
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 150px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Remplacer Clara par Sarah ne préserve pas l'état. C'est parce que **vous leur avez donné des `key` différentes :**

```js
{isPlayerA ? (
  <Counter key="Clara" person="Clara" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

Le fait de spécifier une `key` indique à React de l'utiliser également comme élément de position, plutôt que son ordre au sein du parent. Ainsi, même si vous faites le rendu à la même position dans le JSX, React les voit comme deux compteurs distincts qui ne partageront jamais leur état. À chaque fois qu'un compteur apparaît à l'écran, son état est créé. À chaque fois qu'il est supprimé, son état est supprimé. Passer de l'un à l'autre réinitialise leur état, encore et encore.

<Note>

Retenez que les clés ne sont pas uniques au niveau global. Elles spécifient uniquement la position *au sein du parent*.

</Note>

### Réinitialiser un formulaire avec une clé {/*resetting-a-form-with-a-key*/}

Réinitialiser un état avec une clé s'avère particulièrement utile quand on manipule des formulaires.

Dans cette appli de discussions, le composant `<Chat>` contient l'état du champ de saisie :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Clara', email: 'clara@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Discuter avec ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Envoyer à {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 150px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Essayez de saisir quelque chose dans le champ, puis appuyez sur « Alice » ou « Bob » pour choisir un destinataire différent. Vous noterez que le champ de saisie est conservé parce que le `<Chat>` est affiché à la même position dans l'arbre.

**Dans beaucoup d'applis, c'est le comportement désiré, mais pas dans cette appli de discussion !** Vous ne souhaitez pas qu'un utilisateur envoie un message qu'il a déjà tapé à la mauvaise personne à la suite d'un clic malencontreux. Pour corriger ça, ajoutez une `key` :

```js
<Chat key={to.id} contact={to} />
```

Ça garantit que lorsque vous sélectionnez un destinataire différent, le composant `Chat` sera recréé de zéro, ce qui inclut tout l'état dans l'arbre en dessous. React recréera également tous les éléments DOM plutôt que de les réutiliser.

Désormais, changer de destinataire vide le champ de saisie :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Clara', email: 'clara@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Discuter avec ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Envoyer à {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 150px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<DeepDive>

#### Préserver l'état des composants supprimés {/*preserving-state-for-removed-components*/}

Dans une véritable appli de discussion, vous souhaiterez probablement récupérer l'état de la saisie lorsque l'utilisateur resélectionne le destinataire précédent. Il existe plusieurs manières de garder « vivant » l'état d'un composant qui n'est plus visible :

- Vous pouvez afficher _toutes_ les discussions plutôt que seulement celle qui est active, mais en masquant les autres avec du CSS. Les discussions ne seraient pas supprimés de l'arbre, de sorte que leur état local serait préservé. Cette solution fonctionne très bien pour des UI simples. Cependant, ça peut devenir très lent si les arbres cachés sont grands et contiennent de nombreux nœuds DOM.
- Vous pouvez [faire remonter l'état](/learn/sharing-state-between-components) et conserver dans le composant parent le message en attente pour chaque destinataire. De cette façon, le fait que les composants enfants soient supprimés importe peu, car c'est en réalité le parent qui conserve les informations importantes. C'est la solution la plus courante.
- Vous pouvez aussi utiliser une source différente en plus de l'état React. Par exemple, vous souhaitez sans doute qu'un brouillon du message persiste même si l'utilisateur ferme accidentellement la page. Pour implémenter ça, vous pouvez faire en sorte que le composant `Chat` intialise son état en lisant le [`localStorage`](https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage) et y sauve également les brouillons.

Quelle que soit votre stratégie, une discussion _avec Alice_ est conceptuellement différente d'une autre _avec Bob_, il est donc naturel de donner une `key` à l'arbre `<Chat>` en fonction du destinataire actuel.

</DeepDive>

<Recap>

- React conserve l'état tant que le même composant est affiché à la même position.
- L'état n'est pas conservé dans les balises JSX. Il est associé à la position dans l'arbre où vous placez ce JSX.
- Vous pouvez forcer un sous-arbre à réinitialiser son état en lui donnant une clé différente.
- N'imbriquez pas les définitions de composants ou vous allez accidentellement réinitialiser leur état.

</Recap>



<Challenges>

#### Corriger une saisie qui disparaît {/*fix-disappearing-input-text*/}

Cet exemple affiche un message quand vous appuyez sur le bouton. Cependant, appuyer sur ce bouton vide aussi le champ de saisie par accident. Pourquoi ? Corrigez ça pour que le champ de saisie ne se vide pas quand on appuie sur le bouton.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Indice : votre ville préférée ?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Cacher l'indice</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Afficher l'indice</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

Le problème vient de ce que le `Form` est affiché à des positions différentes. Dans la branche du `if`, c'est le second enfant du `<div>`, mais c'est le premier enfant dans la branche `else`. Du coup, le type du composant à chaque position change. Dans un cas, la première position reçoit un `p` puis un `Form`, alors que dans l'autre cas, elle reçoit un `Form` puis un `button`. React réinitialise l'état à chaque fois que le type du composant change.

La solution la plus simple consiste à réunir les branches de façon à ce que `Form` soit toujours affiché à la même position :

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Indice : votre ville favorite ?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Cacher l'indice</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Afficher l'indice</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


Techniquement, vous pourriez aussi ajouter un `null` avant le `<Form />` dans la branche `else` pour que ça corresponde à la structure de la branche `if` :

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Indice : votre ville favorite ?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Cacher l'indice</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Afficher l'indice</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

De cette façon, `Form` est toujours le second enfant, il conserve donc sa position et garde son état. Cette approche est toutefois moins intuitive et introduit le risque que quelqu'un vienne supprimer ce `null`.

</Solution>

#### Échanger deux champs du formulaire {/*swap-two-form-fields*/}

Ce formulaire vous permet de saisir le prénom et le nom. Il y a également une case à cocher contrôlant quel champ vient en premier. Si vous cochez la case, le champ « nom » apparaît avant le champ « prénom ».

Ça fonctionne presque, mais il y a un bug. Si vous remplissez le « prénom » puis cochez la case, le texte restera dans le premier champ (qui est désormais « nom »). Corrigez ça pour que le texte du champ se déplace *lui aussi* lorsque vous changez l'ordre des champs.

<Hint>

Il semble que la position de ces champs au sein du parent n'est pas suffisante. Existe-t-il un moyen de dire à React de faire correspondre les états entre les rendus ?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Changer l'ordre
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Nom" />
        <Field label="Prénom" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="Prénom" />
        <Field label="Nom" />
        {checkbox}
      </>
    );
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label} :{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

Donnez une `key` à chacun des composants `<Field>` dans les branches `if` et `else`. Ça indique à React de « faire correspondre » le bon état à chacun des `<Field>` même si l'ordre au sein du parent change :

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Changer l'ordre
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Nom" />
        <Field key="firstName" label="Prénom" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="Prénom" />
        <Field key="lastName" label="Nom" />
        {checkbox}
      </>
    );
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label} :{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

#### Réinitialiser un formulaire de détails {/*reset-a-detail-form*/}

Voici une liste modifiable de contacts. Vous pouvez modifier les détails du contact sélectionné, puis cliquer soit sur « Enregistrer » pour les mettre à jour, soit sur « Annuler » pour annuler vos modifications.

Lorsque vous choisissez un contact différent (par exemple Alice), l'état se met à jour mais le formulaire conserve les détails du contact précédent. Corrigez ça afin que le formulaire se réinitialise lorsque le contact sélectionné change.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Clara', email: 'clara@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Nom :{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        E-mail :{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Enregistrer
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Annuler
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

Ajoutez `key={selectedId}` au composant `EditContact`. De cette façon, changer de contact réinitialisera le formulaire :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Clara', email: 'clara@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Nom :{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        E-mail :{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Enregistrer
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Annuler
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Effacer une image au chargement {/*clear-an-image-while-its-loading*/}

Lorsque vous appuyez sur « Suivante », le navigateur commence à charger l'image suivante. Cependant, comme elle est affichée dans la même balise `<img>`, l'image précédente reste toujours affichée par défaut jusqu'à ce que la suivante soit chargée. Ça peut être un problème s'il est important que le texte corresponde toujours à l'image. Changez ça afin que l'image précédente soit immédiatement effacée dès que vous appuyez sur « Suivante ».

<Hint>

Existe-t-il un moyen de dire à React de recréer le DOM plutôt que de le réutiliser ?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Suivante
      </button>
      <h3>
        Image {index + 1} sur {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaisie',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbonne, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Espagne',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaiso, Chili',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Canton de Schwyz, Suisse',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, République Tchèque',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovénie',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

Vous pouvez fournir une `key` à la balise `<img>`. Lorsque cette `key`change, React recréera de zéro le nœud DOM `<img>`. Ça causera un bref flash lorsque chaque image se chargera, ce n'est donc pas quelque chose de souhaitable pour chaque image de votre appli. Cependant, ça a un intérêt si vous voulez garantir que l'image corresponde effectivement au texte.

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Suivante
      </button>
      <h3>
        Image {index + 1} sur {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaisie',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbonne, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Espagne',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaiso, Chili',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Canton de Schwyz, Suisse',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, République Tchèque',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovénie',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### Corriger un état mal placé dans la liste {/*fix-misplaced-state-in-the-list*/}

Dans cette liste, chaque `Contact` a un état qui détermine si son bouton « Voir l'e-mail » a été appuyé. Appuyez sur « Voir l'e-mail » pour Alice, puis cochez la case « Afficher dans l'ordre inverse ». Vous constaterez que c'est l'e-mail de _Clara_ qui est désormais déplié, alors que celui d'Alice — qui a été déplacée en bas de liste — apparait replié.

Corrigez ça afin que l'état déplié soit associé à chaque contact, quel que soit l'ordre d'affichage choisi.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Afficher dans l’ordre inverse
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Clara', email: 'clara@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Cacher' : 'Afficher'} l’e-mail
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

Le problème de cet exemple, c'est qu'il utilisait l'index en tant que `key` :

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

Cependant, vous voulez que l'état soit associé à _chaque contact en particulier_.

Utiliser l'identifiant de contact comme `key` corrige le problème :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Afficher dans l’ordre inverse
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Clara', email: 'clara@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Cacher' : 'Afficher'} l’e-mail
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

L'état est associé à la position dans l'arbre. Une `key` vous permet de spécifier une position nommée au lieu de vous fier à l'ordre des éléments.

</Solution>

</Challenges>
