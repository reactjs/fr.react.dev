---
title: 'Référencer des valeurs avec les refs'
---

<Intro>

Lorsque vous souhaitez que votre composant « se souvienne » de quelque chose, mais que vous voulez éviter que l’évolution de ces données [déclenche de nouveaux rendus](/learn/render-and-commit), vous pouvez utiliser une *ref*.

</Intro>

<YouWillLearn>

- Comment ajouter une ref à votre composant
- Comment mettre à jour la valeur d'une ref
- En quoi les refs diffèrent des variables d'état
- Comment utiliser les refs de façon fiable

</YouWillLearn>

## Ajouter une ref à votre composant {/*adding-a-ref-to-your-component*/}

Vous pouvez ajouter une ref à votre composant en important le Hook `useRef` de React :

```js
import { useRef } from 'react';
```

Au sein de votre composant, appelez le Hook `useRef` et passez-lui comme unique argument la valeur initiale que vous souhaitez référencer.  Par exemple, voici une ref vers la valeur `0` :

```js
const ref = useRef(0);
```

`useRef` renvoie un objet comme celui-ci :

```js
{
  current: 0 // La valeur que vous avez passée à useRef
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="Une flèche labellisée “current” au sein d'une poche avec “ref” écrit dessus." />

Vous pouvez accéder à la valeur actuelle de cette ref au travers de la propriété `ref.current`.  Cette valeur est volontairement modifiable, ce qui signifie que vous pouvez aussi bien la lire que l'écrire.  C'est un peu comme une poche secrète de votre composant que React ne peut pas surveiller. (C'est ce qui en fait une « échappatoire » du flux de données unidirectionnel de React--on va détailler ça dans un instant !)

Voici maintenant un bouton qui incrémente `ref.current` à chaque clic :

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
      Cliquez ici
    </button>
  );
}
```

</Sandpack>

La ref pointe vers un nombre, mais tout comme pour [l'état](/learn/state-a-components-memory), vous pouvez pointer vers ce que vous voulez : une chaîne de caractères, un objet, ou même une fonction.  Contrairement aux variables d'état, une ref est juste un objet JavaScript brut avec une propriété `current` que vous pouvez lire et modifier.

Remarquez que **le composant ne refait pas de rendu à chaque incrémentation**.  Comme les variables d'état, les refs sont préservées par React d'un rendu à l'autre. Cependant, modifier un état entraîne un nouveau rendu du composant, tandis que modifier une ref ne le fait pas !

## Exemple : construire un chronomètre {/*example-building-a-stopwatch*/}

Vous pouvez combiner des refs et des variables d'état dans un même composant.  Construisons par exemple un chronomètre que l'utilisateur peut démarrer et arrêter en pressant un bouton.  Afin de pouvoir afficher le temps écoulé depuis que l'utilisateur a pressé « Démarrer », vous allez devoir garder trace du moment auquel ce bouton a été pressé, et du moment courant. **Ces informations sont nécessaires au rendu, de sorte que vous les stockez dans des variables d'état :**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

Lorsque l'utilisateur pressera « Démarrer », vous utiliserez [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) afin de mettre à jour le moment courant toutes les 10 millisecondes :

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Commencer à chronométrer.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Mettre à jour le temps toutes les 10ms.
      setNow(Date.now());
    }, 10);
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
      </button>
    </>
  );
}
```

</Sandpack>

Lorsque le bouton « Arrêter » est pressé, vous devez annuler l'intervalle pour qu'il cesse de mettre à jour la variable d'état `now`.  Vous pouvez faire ça en appelant [`clearInterval`](https://developer.mozilla.org/fr/docs/Web/API/clearInterval), mais vous avez besoin de lui fournir l'ID du timer renvoyé précédemment par votre appel à `setInterval` lorsque l'utilisateur avait pressé « Démarrer ».  Il faut donc bien conserver cet ID quelque part. **Puisque l'ID de l'intervalle n'est pas nécessaire au rendu, vous pouvez le conserver dans une ref :**

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
      </button>
      <button onClick={handleStop}>
        Arrêter
      </button>
    </>
  );
}
```

</Sandpack>

Lorsqu'une information est utilisée pour le rendu, conservez-la dans une variable d'état. Lorsqu'elle n'est nécessaire qu'aux gestionnaires d'événements, et que la modifier ne doit pas entraîner un nouveau rendu, il est plus efficace de passer par une ref.

## Différences entre refs et variables d'état {/*differences-between-refs-and-state*/}

Vous trouvez peut-être que les refs semblent moins « strictes » que les variables d'état--vous pouvez les modifier plutôt que de devoir passer par une fonction de mise à jour d'état, par exemple.  Pourtant dans la majorité des cas, vous voudrez utiliser des états.  Les refs sont une « échappatoire » dont vous n'aurez pas souvent besoin.  Voici un comparatif entre variables d'état et refs :

| Ref                                                                                  | Variable d'état                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` renvoie `{ current: initialValue }`.                            | `useState(initialValue)` renvoie la valeur actuelle d'une variable d'état et une fonction de modification de cette valeur (`[value, setValue]`). |
| Ne redéclenche pas un rendu quand vous la modifiez.                                         | Déclenche un nouveau rendu quand vous la modifiez.                                                                                    |
| Modifiable : vous pouvez changer la valeur de `current` hors du rendu. | « Immuable » : vous devez passer par la fonction de mise à jour de l'état pour changer la variable d'état, ce qui est mis en attente pour le prochain rendu.                       |
| Vous ne devriez pas lire (ou écrire) la valeur de `current` pendant le rendu. | Vous pouvez lire l'état à tout moment.  En revanche, chaque rendu a son propre [instantané](/learn/state-as-a-snapshot) de l'état, qui ne change pas.

Voici un bouton de compteur implémenté avec une variable d'état :

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
      Vous avez cliqué {count} fois
    </button>
  );
}
```

</Sandpack>

Étant donné que la valeur `count` est affichée, il est logique d'utiliser une variable d'état pour la stocker.  Quand la valeur du compteur est modifiée via `setCount()`, React fait un nouveau rendu du composant et l'écran est mis à jour pour refléter le nouveau compteur.

Si vous utilisiez une ref, React ne déclencherait jamais un nouveau rendu du composant, et vous ne verriez jamais la valeur changer !  Essayez ci-dessous de cliquer le bouton, **ça ne met pas à jour le texte** :

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // Le composant ne refait pas son rendu !
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      Vous avez cliqué {countRef.current} fois
    </button>
  );
}
```

</Sandpack>

Voilà pourquoi la lecture de `ref.current` pendant le rendu n'est pas une pratique fiable.  Si vous avez besoin de ça, utilisez plutôt une variable d'état.

<DeepDive>

#### Comment fonctionne `useRef` en interne ? {/*how-does-use-ref-work-inside*/}

Même si `useState` et `useRef` sont fournis par React, en principe `useRef` pourrait être implémenté *par-dessus* `useState`.  On pourrait imaginer que dans le code de React, `useRef` serait peut-être implémenté de la façon suivante :

```js
// Dans React…
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

Lors du premier rendu, `useRef` renvoie `{ current: initialValue}`.  Cet objet est stocké par React, de sorte qu'au prochain rendu il renverra le même objet.  Remarquez que la fonction de modification de l'état est inutilisée dans ce code.  Elle est superflue puisque `useRef` renvoie toujours le même objet !

React fournit directement `useRef` parce qu'il s'agit d'un cas d'usage suffisamment courant.  Mais vous pouvez le voir comme une variable d'état classique mais sans fonction modificatrice.  Si vous avez l'habitude de la programmation orientée objet, les refs vous font peut-être penser à des champs d'instance--sauf qu'au lieu d'écrire `this.something` vous écrivez `somethingRef.current`.

</DeepDive>

## Quand utiliser des refs {/*when-to-use-refs*/}

En général, vous utiliserez une ref lorsque votre composant a besoin de « sortir » de React et communiquer avec des API extérieures (souvent une API du navigateur qui n'impactera pas l'apparence du composant).  Voici quelques-unes de ces situations peu fréquentes :

- Conserver des [ID de timers](https://developer.mozilla.org/fr/docs/Web/API/setTimeout).
- Référencer puis manipuler des [éléments du DOM](https://developer.mozilla.org/fr/docs/Web/API/Element), comme nous le verrons en détail [dans la prochaine page](/learn/manipulating-the-dom-with-refs).
- Référencer d'autres objets qui ne sont pas nécessaires au calcul du JSX.

Si votre composant a besoin de stocker une valeur, mais que cette valeur n'impacte pas la logique de rendu, optez pour une ref.

## Meilleures pratiques pour les refs {/*best-practices-for-refs*/}

Pour rendre vos composants plus prévisibles, respectez les principes suivants :

- **Traitez les refs comme une échappatoire.**  Les refs sont utiles lorsque vous travaillez avec des systèmes extérieurs ou des API du navigateur.  Mais si une large part de votre logique applicative et de votre flux de données repose sur les refs, vous devriez probablement repenser votre approche.
- **Ne lisez pas et n'écrivez pas dans `ref.current` pendant le rendu.** Si une information est nécessaire au rendu, utilisez plutôt [un état](/learn/state-a-components-memory).  Comme React ne sait pas que `ref.current` change, même le simple fait de la lire pendant le rendu peut introduire des comportements déroutants dans votre composant. (La seule exception concerne du code du style `if (!ref.current) ref.current = new Thing()`, qui ne met à jour la ref qu'une fois lors du rendu initial.)

Les contraintes des états React ne s'appliquent pas aux refs.  Par exemple, l'état se comporte comme un [instantané pour chaque rendu](/learn/state-as-a-snapshot) et [est mis à jour en asynchrone](/learn/queueing-a-series-of-state-updates).  En revanche, lorsque vous modifiez la valeur actuelle d'une ref, c'est immédiat :

```js
ref.current = 5;
console.log(ref.current); // 5
```

C'est parce que **la ref elle-même n'est qu'un objet JavaScript brut**, et se comporte donc comme tel.

Vous n'avez pas non plus à vous préoccuper [d'éviter les mutations](/learn/updating-objects-in-state) lorsque vous travaillez avec une ref.  Du moment que l'objet que vous modifiez n'est pas utilisé pour le rendu, React se fiche de ce que vous faites avec la ref et son contenu.

## Les refs et le DOM {/*refs-and-the-dom*/}

Vous pouvez faire pointer votre ref vers ce que vous voulez.  Ceci dit, le cas le plus courant pour une ref consiste à accéder à un élément du DOM. C'est par exemple bien pratique pour gérer le focus programmatiquement. Quand vous passez une ref à la prop `ref` d'un élément en JSX, comme dans `<div ref={myRef}>`, React référencera l'élément DOM correspondant dans `myRef.current`.  Lorsque l'élément sera retiré du DOM, React recalera `ref.current` à `null`. Vous pouvez en apprendre davantage dans [Manipuler le DOM avec des refs](/learn/manipulating-the-dom-with-refs).

<Recap>

- Les refs sont une échappatoire qui vous permet de conserver des valeurs qui ne servent pas au rendu.  Vous n'en aurez pas souvent besoin.
- Une ref est un objet JavaScript brut avec une unique propriété `current`, que vous pouvez lire et écrire.
- Vous pouvez demander à React de vous fournir une ref en appelant le Hook `useRef`.
- Tout comme les variables d'état, les refs préservent leur information d'un rendu à l'autre du composant.
- Contrairement aux états, modifier la valeur `current` d'une ref ne déclenche pas un nouveau rendu.
- Évitez de lire ou d'écrire dans `ref.current` pendant le rendu ; le comportement de votre composant deviendrait imprévisible.

</Recap>

<Challenges>

#### Corriger un bouton de discussion {/*fix-a-broken-chat-input*/}

Tapez un message et cliquez sur « Envoyer ». Vous remarquerez un délai de trois secondes avant de voir la notification « Envoyé ! ». Dans l'intervalle, vous pouvez voir un bouton « Annuler ». Ce bouton est supposé empêcher l'apparition de la notification « Envoyé ! ». Pour cela, il appelle [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) sur l'ID de timer sauvegardé lors de `handleSend`. Pourtant, même après avoir cliqué sur « Annuler », la notification « Envoyé ! » apparaît.  Trouvez ce qui cloche et corrigez-le.

<Hint>

Les simples variables comme `let timeoutID` ne « survivent » pas d'un rendu à l'autre, car chaque rendu réexécute votre composant (et donc initialise ses variables) à partir de zéro.  Peut-être devriez-vous conserver l'ID du timer ailleurs ?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Envoyé !');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Envoi...' : 'Envoyer'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Annuler
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

Chaque fois que votre composant fait un nouveau rendu (par exemple suite à un changement d'état), toutes les variables locales sont réinitialisées.  C'est pourquoi vous ne pouvez pas préserver un ID de timer dans une variable locale comme `timeoutID` et vous attendre à ce que votre gestionnaire d'événement la « voie » par la suite.  Conservez-le plutôt dans une ref, que React préservera d'un rendu à l'autre.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Envoyé !');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Envoi...' : 'Envoyer'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Annuler
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>


#### Re-déclencher le rendu {/*fix-a-component-failing-to-re-render*/}

Ce bouton est censé basculer entre un affichage "On" et "Off". Pourtant, il affiche toujours "Off". Quel est le problème ? Corrigez ça.

<Sandpack>

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

<Solution>

Dans cet exemple, la valeur actuelle de la ref est utilisée pour calculer le résultat du rendu : `{isOnRef.current ? 'On' : 'Off'}`. C'est le signe que cette information ne devrait pas figurer dans une ref, mais aurait dû être stockée dans une variable d'état.  Pour corriger ça, retirez la ref et remplacez-la par une variable d'état :

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Corriger le *debouncing* {/*fix-debouncing*/}

Dans l'exemple qui suit, tous les gestionnaires de clic des boutons sont *["debounced"](https://redd.one/blog/debounce-vs-throttle)*.  Pour saisir ce que ça signifie, pressez l'un des boutons.  Remarquez que le message apparaît une seconde plus tard.  Si vous pressez le bouton pendant que vous attendez le message, le timer sera réinitialisé.  Du coup, si vous cliquez en rafale sur le même bouton, le message n'apparaîtra qu'une seconde *après* que vous aurez arrêté de cliquer.  Le *debouncing* permet de retarder une action jusqu'à ce que l'utilisateur « termine ce qu'il est en train de faire ».

Cet exemple fonctionne, mais pas tout à fait comme prévu.  Les boutons ne sont pas indépendants.  Pour comprendre le problème, cliquez sur l'un des boutons, puis cliquez immédiatement sur un autre bouton.  Vous vous attendriez à ce qu'une fois le délai écoulé, vous obteniez les messages des deux boutons.  Mais seul le message du dernier bouton apparaît. Celui du premier bouton est perdu.

Pourquoi ces boutons interfèrent-ils l'un avec l'autre ? Trouvez et corrigez le problème.

<Hint>

La variable contenant l'ID du dernier timer en date est partagée par tous les composants `DebouncedButton`.  C'est pour ça que cliquer sur un des boutons réinitialise aussi le timer des autres boutons.  Comment stocker un ID de timer distinct pour chaque bouton ?

</Hint>

<Sandpack>

```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Décollage !')}
      >
        Faire décoller le vaisseau
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('À la soupe !')}
      >
        Faire cuire la soupe
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Bonne nuit !')}
      >
        Chanter une berceuse
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

Une variable comme `timeoutID` est partagée par tous les composants, c'est pourquoi cliquer sur le deuxième bouton réinitialise le timer en cours du premier bouton.  Pour corriger ça, vous pouvez conserver l'ID de timer dans une ref.  Chaque bouton gardera ainsi sa propre ref, et il n'y aura plus de conflit.  Essayez de cliquer rapidement sur deux boutons : vous devriez voir les deux messages.

<Sandpack>

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Décollage !')}
      >
        Faire décoller le vaisseau
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('À la soupe !')}
      >
        Faire cuire la soupe
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Bonne nuit !')}
      >
        Chanter une berceuse
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### Lire la dernière valeur à jour {/*read-the-latest-state*/}

Dans cet exemple, lorsque vous pressez « Envoyer », un message est affiché après un petit délai.  Tapez « bonjour », pressez « Envoyer », puis modifiez rapidement la saisie.  Malgré vos changements, le message devrait rester « bonjour » (qui était la valeur de l'état [au moment](/learn/state-as-a-snapshot#state-over-time) où vous avez cliqué sur le bouton).

D'habitude, c'est bien le comportement que vous souhaitez.  Toutefois, il arrive parfois que vous souhaitiez que du code asynchrone lise la *dernière* version d'une donnée.  Avez-vous une idée pour faire que le message affiche la version *à jour* du champ de saisie, plutôt que celle en vigueur au moment du clic ?

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Envoi : ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Envoyer
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

L'état fonctionne [comme un instantané](/learn/state-as-a-snapshot), de sorte que vous ne pouvez pas lire le dernier état à jour depuis un traitement asynchrone comme un timer.  En revanche, vous pouvez conserver la valeur saisie dans une ref.  Une ref est modifiable, donc vous pouvez lire sa propriété `current` à tout moment.  Comme le texte saisi est aussi utilisé pour le rendu, dans cet exemple il vous faudra *à la fois* une variable d'état (pour le rendu) *et* une ref (pour la lire depuis le timeout).  Vous aurez besoin de mettre à jour la valeur de la ref manuellement.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Envoi : ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Envoyer
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
