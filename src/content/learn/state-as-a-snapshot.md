---
title: L’état est un instantané
---

<Intro>

Vous trouvez peut-être que les variables d'état ressemblent à des variables JavaScript classiques, que vous pouvez lire et écrire librement.  Pourtant, une variable d'état se comporte davantage comme une photo instantanée. Lui affecter une nouvelle valeur ne change pas la variable d’état que vous avez déjà, mais déclenche plutôt un nouveau rendu.

</Intro>

<YouWillLearn>

* Comment une modification d'état déclenche un nouveau rendu
* Comment et quand l'état est mis à jour
* Pourquoi l'état n'est pas mis à jour immédiatement après que vous l'avez modifié
* Comment les gestionnaires d'événements accèdent à un « instantané » de l'état

</YouWillLearn>

## Modifier l'état déclenche un rendu {/*setting-state-triggers-renders*/}

Vous pourriez croire que l'interface utilisateur (UI) évolue en réaction directe à des événements utilisateurs tels qu'un clic. Dans React, les choses sont un peu différentes de ce modèle mental.  Dans la page précédente, nous avons vu que [modifier l'état demande un nouveau rendu](/learn/render-and-commit#step-1-trigger-a-render) à React. Ça signifie que pour que l'interface réagisse à l'événement, vous devez *mettre à jour l'état*.

Dans cet exemple, lorsque vous appuyez sur « Envoyer », `setIsSent(true)` demande à React de refaire un rendu de l'UI :

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Salut !');
  if (isSent) {
    return <h1>Votre message est en route !</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Envoyer</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Voici ce qui se passe lorsque vous cliquez sur le bouton :

1. Le gestionnaire d'événement `onSubmit` est appelé.
2. `setIsSent(true)` définit `isSent` à `true` et planifie un nouveau rendu.
3. React refait le rendu du composant conformément à la nouvelle valeur de `isSent`.

Examinons de plus près la relation entre l'état et le rendu.

## Le rendu prend une photo instantanée {/*rendering-takes-a-snapshot-in-time*/}

[« Faire le rendu »](/learn/render-and-commit#step-2-react-renders-your-components) signifie que React appelle votre composant, qui est une fonction. Le JSX que cette fonction renvoie est comme une photo instantanée de l'UI à ce moment précis.  Ses props, ses gestionnaires d'événements et ses variables locales ont tous été calculés **en utilisant l'état au moment du rendu**.

Contrairement à une photo ou une image de film, « l'instantané » de l'UI que vous renvoyez est interactif. Il comprend des éléments de logique tels que les gestionnaires d'événements qui décrivent ce qui doit arriver suite à des interactions. React met à jour l'écran pour refléter cet instantané et le connecte aux gestionnaires d'événements.  Résultat, cliquer sur le bouton déclenchera le gestionnaire de clic défini dans votre JSX.

Lorsque React refait le rendu d'un composant :

1. React rappelle votre fonction.
2. Votre fonction renvoie un nouvel instantané JSX.
3. React met alors à jour l'écran pour refléter l'instantané que votre fonction vient de renvoyer.

<IllustrationBlock sequential>
    <Illustration caption="React appelle la fonction" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Vous calculez l’instantané" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="L’arborescence du DOM est mise à jour" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

Dans son rôle de mémoire du composant, l'état n'est pas comme une variable classique qui disparaît après que votre fonction a renvoyé son résultat. En réalité, l'état « vit » dans React lui-même — un peu comme sur une étagère ! — hors de votre fonction. Lorsque React appelle votre composant, il lui fournit un instantané de l'état pour ce rendu spécifique. Votre composant renvoie un instantané de l'UI avec un jeu tout frais de props et de gestionnaires d'événements dans son JSX, tous calculés **en utilisant les valeurs de l'état pour ce rendu** !

<IllustrationBlock sequential>
  <Illustration caption="Vous demandez à React de mettre à jour l’état" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React met à jour la valeur de l’état" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React passe un instantané de la valeur de l’état à votre composant" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

Voici une petite expérience pour vous montrer comment ça fonctionne. Dans cet exemple, vous vous attendez peut-être à ce que cliquer sur le bouton « +3 » incrémente le compteur trois fois parce qu'il appelle `setNumber(number + 1)` trois fois.

Voyez ce qui se passe lorsque vous cliquez sur le bouton « +3 » :

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Notez que `number` n'est incrémenté qu'une fois par clic !

**Définir l'état ne le change que pour le *prochain* rendu.**  Lors du rendu initial, `number` était à `0`. C'est pourquoi, dans le gestionnaire `onClick` *de ce rendu-là*, la valeur de `number` est à `0` même après que `setNumber(number + 1)` a été appelée :

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

Voici ce que le gestionnaire de clic de ce bouton dit à React de faire :

1. `setNumber(number + 1)` : `number` est à `0` donc `setNumber(0 + 1)`.
    - React se prépare à modifier `number` à `1` pour le prochain rendu.
2. `setNumber(number + 1)` : `number` est à `0` donc `setNumber(0 + 1)`.
    - React se prépare à modifier `number` à `1` pour le prochain rendu.
3. `setNumber(number + 1)` : `number` est à `0` donc `setNumber(0 + 1)`.
    - React se prépare à modifier `number` à `1` pour le prochain rendu.

Même si vous appelez `setNumber(number + 1)` trois fois, dans le gestionnaire d'événement *de ce rendu* `number` est toujours à `0`, de sorte que vous le définissez à `1` trois fois. C'est pourquoi, après que le gestionnaire d'événement a terminé, React refait le rendu du composant avec `number` égal à `1` plutôt qu'à `3`.

Vous pouvez visualiser ça mentalement en substituant les variables d'état par leurs valeurs dans votre code.  Puisque la variable d'état `number` est à `0` *pour ce rendu*, son gestionnaire d'événement a l'aspect suivant :

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

Au prochain rendu, `number` est à `1`, de sorte que le gestionnaire de clic pour *ce rendu-là* ressemble à ceci :

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

C'est pourquoi re-cliquer sur le bouton amènera le compteur à `2`, puis à `3` au clic suivant, et ainsi de suite.

## L'état au fil du temps {/*state-over-time*/}

Eh bien, c'était amusant.  Essayez de deviner ce qui s'affichera en cliquant sur ce bouton :

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Si vous utilisez la même méthode de substitution que précédemment, vous pouvez deviner que l'alerte affichera « 0 » :

```js
setNumber(0 + 5);
alert(0);
```

Mais si vous mettiez un timer sur l'alerte, de sorte qu'elle ne se déclenche _qu'après_ que le composant a refait un rendu ? Dirait-elle « 0 » ou « 5 » ? Devinez !

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Ça vous surprend ?  En utilisant la méthode de substitution, on voit bien que c'est « l'instantané » de l'état qui est passé à l'alerte :

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

L'état stocké dans React a peut-être changé lorsque l'alerte finit par être exécutée, mais elle était planifiée en utilisant un instantané de l'état au moment de l'interaction utilisateur !

**La valeur d'une variable d'état ne change jamais au sein d'un rendu**, même si le code du gestionnaire d'événement est asynchrone. Au sein du `onClick` *de ce rendu*, la valeur de `number` continue à être à `0` même après que `setNumber(number + 5)` a été appelée. Sa valeur est « figée » lorsque React « prend une photo » de l'UI en appelant votre composant.

Voici un exemple qui illustre en quoi ça réduit le potentiel d'erreur de chronologie dans vos gestionnaires d'événements.  Vous trouverez ci-dessous un formulaire qui envoie un message avec un retard de cinq secondes. Imaginez le scénario suivant :

1. Vous appuyez sur le bouton « Envoyer » pour envoyer « Bonjour » à Alice.
2. Avant que les cinq secondes ne soient écoulées, vous modifiez le champ « Destinataire » à « Bob ».

À quel affichage vous attendez-vous ? Afficherait-il « Vous avez dit Bonjour à Alice » ? Ou plutôt « Vous avez dit Bonjour à Bob » ? Essayez de deviner sur base de ce que vous savez, puis tentez la manipulation :

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Bonjour');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`Vous avez dit ${message} à ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Destinataire :{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React conserve les valeurs d'état « figées » au sein des gestionnaires d'événements d'un rendu.**  Vous n'avez pas à vous soucier des éventuelles modifications ultérieures de l'état lorsque votre code s'exécute.

Et si vous souhaitiez plutôt lire la dernière valeur à jour d'un état avant de refaire un rendu ? Vous voudrez pour cela utiliser une [fonction de mise à jour d'état](/learn/queueing-a-series-of-state-updates), que nous découvrirons dans la prochaine page !

<Recap>

* Modifier l'état demande un nouveau rendu.
* React stocke l'état hors de votre composant, comme sur une étagère.
* Lorsque vous appelez `useState`, React vous donne une photo instantanée de l'état *pour ce rendu*.
* Les variables et gestionnaires d'événements ne « survivent » pas d'un rendu à l'autre.  Chaque rendu a ses propres gestionnaires d'événements.
* Chaque rendu (et les fonctions qu'il contient) « verra » toujours l'instantané de l'état que React a fourni à *ce rendu spécifique*.
* Vous pouvez mentalement substituer l'état dans les gestionnaires d'événements, comme lorsque vous pensez au JSX produit par le rendu.
* Les gestionnaires d'événements créés par le passé continuent à voir les valeurs d'état spécifiques au rendu qui les a créés.

</Recap>



<Challenges>

#### Implémenter un passage piéton {/*implement-a-traffic-light*/}

Voici un composant de signal de passage piéton qui bascule lorsqu'on appuie sur le bouton :

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Passer à {walk ? 'Stop' : 'Traversez'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Traversez' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Ajoutez un `alert` au gestionnaire de clic. Lorsque le signal est vert et dit « Traversez », cliquer sur le bouton devrait dire « Stop arrive ». Lorsque le signal est rouge et dit « Stop », cliquer sur le bouton devrait dire « Traversez arrive ».

Appeler `alert` avant ou après `setWalk` fait-il une différence ?

<Solution>

Votre `alert` devrait ressembler à ceci :

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Stop arrive' : 'Traversez arrive');
  }

  return (
    <>
      <button onClick={handleClick}>
        Passer à {walk ? 'Stop' : 'Traversez'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Traversez' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Que vous le placiez avant ou après l'appel à `setWalk` ne change rien.  La valeur de `walk` pour ce rendu est figée. Appeler `setWalk` ne la changera que pour le *prochain* rendu, et n'affectera pas les gestionnaires d'événements du rendu courant.

Cette ligne peut sembler contre-intuitive à première vue :

```js
alert(walk ? 'Stop arrive' : 'Traversez arrive');
```

Mais elle a plus de sens si vous l'interprétez comme ceci : « Si le signal affiche “Traversez maintenant”, le message devrait dire “Stop arrive” ». La variable `walk` au sein du gestionnaire d'événement correspond à la valeur de `walk` pour le rendu courant, elle n'a pas changé.

Vous pouvez vérifier que c'est correct en appliquant la méthode de substitution. Lorsque `walk` est `true`, vous obtenez :

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop arrive');
}}>
  Passer à Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Traversez
</h1>
```

Du coup, cliquer sur « Passer à Stop » planifie un rendu avec `walk` à `false`, et affiche « Stop arrive ».

</Solution>

</Challenges>
