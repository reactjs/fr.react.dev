---
title: Cumuler les mises à jour d’un même état
---

<Intro>

Modifier une variable d'état va planifier un nouveau rendu. Mais parfois vous souhaitez effectuer plusieurs opérations sur la valeur avant de passer au rendu suivant.  Pour y parvenir, il est utile de comprendre comment React regroupe les mises à jour d'états en lots.

</Intro>

<YouWillLearn>

* Ce qu'est le « traitement par lots » *(batching, NdT)* et la façon React s'en sert pour traiter plusieurs mises à jour d'état successives
* Comment appliquer plusieurs mises à jour d'affilée à la même variable d'état

</YouWillLearn>

## React regroupe les mises à jour d'état en lots {/*react-batches-state-updates*/}

Vous vous attendez peut-être à ce que cliquer le bouton « +3 » incrémente le compteur trois fois, parce qu'il appelle `setNumber(number + 1)` trois fois :

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

Pourtant, comme vous vous en souvenez peut-être après avoir lu la page précédente, [les valeurs d'état de chaque rendu sont figées](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time), de sorte que la valeur de `number` au sein du gestionnaire d'événement du rendu initial sera toujours `0`, peu importe le nombre de fois que vous appelez `setNumber(1)` :

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

Un autre facteur entre cependant en ligne de compte. **React attendra que *tout* le code de vos gestionnaires d'événements ait été exécuté avant de traiter vos mises à jour d'état.** C'est pourquoi le nouveau rendu ne survient *qu'après* tous les appels à `setNumber()`.

Ça vous rappelle peut-être la prise de commande par un serveur dans un restaurant.  Un serveur ne se précipite pas à la cuisine dès que le premier plat est demandé !  Il vous laisse plutôt terminer votre commande, vous permet de l'ajuster si besoin, et prendra même les commandes des autres convives à la même table.

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="Un curseur élégant dans un restaurant passe plusieurs versions de sa commande à React, qui joue le rôle du serveur.  Après les multiples appels à setState(), le serveur inscrit le dernier appel comme sa commande définitive." />

Ça vous permet de mettre à jour plusieurs variables d'état (même au sein de plusieurs composants) sans déclencher trop de [nouveaux rendus](/learn/render-and-commit#re-renders-when-state-updates).  Mais ça signifie aussi que l'interface utilisateur (UI) ne sera mise à jour *qu'après* que votre gestionnaire d'événement, et tout code qu'il contient, aura terminé son exécution.  Ce comportement, connu sous le nom de **traitement par lots** *(batching, NdT)* permet d'accélérer considérablement votre appli React.  Il évite aussi d'avoir à gérer des rendus « pas finis » qui dérouteraient l'utilisateur, si seulement certaines variables étaient mises à jour.

**React ne crée pas de lots regroupant *plusieurs* événements intentionnels tels que des clics** : chaque clic est traité séparément.  Rassurez-vous, React ne regroupe par lots que lorsque c'est sans danger.  Ça garantit par exemple que si le premier clic d'un bouton désactive un formulaire, le second ne pourra pas soumettre à nouveau ce même formulaire.

## Mettre à jour un même état plusieurs fois avant le prochain rendu {/*updating-the-same-state-multiple-times-before-the-next-render*/}

Il s'agit d'un scénario assez inhabituel, mais si vous souhaitiez mettre à jour la même variable d'état plusieurs fois avant le prochain rendu, au lieu de passer *la prochaine valeur d'état* comme dans `setNumber(number + 1)`, vous pouvez passer une *fonction* qui va calculer le prochain état sur base du précédent dans la file des mises à jour, comme dans `setNumber(n => n + 1)`.  C'est une façon de dire à React de « faire un truc avec la valeur de l'état » au lieu de simplement la remplacer.

Essayez d'incrémenter le compteur désormais :

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
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

Ici, `n => n + 1` est ce qu'on appelle une **fonction de mise à jour**.  Lorsque vous la passez à une fonction de modification d'état :

1. React met votre fonction en file d'attente, pour la traiter après que tout le reste du code du gestionnaire d'événement aura terminé.
2. Lors du prochain rendu, React traitera toute la file et vous donnera le résultat final des mises à jour.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

Voici comment React traite ces lignes de code en exécutant le gestionnaire d'événement :

1. `setNumber(n => n + 1)` : `n => n + 1` est une fonction. React l'ajoute à la file d'attente.
2. `setNumber(n => n + 1)` : `n => n + 1` est une fonction. React l'ajoute à la file d'attente.
3. `setNumber(n => n + 1)` : `n => n + 1` est une fonction. React l'ajoute à la file d'attente.

Lorsque vous appelez `useState` lors du rendu suivant, React traite toute la file dans l'ordre. L'état précédent pour `number` valait `0`, c'est donc ce que passe React à la première fonction de mise à jour, au travers de son argument `n`. Puis React prend la valeur renvoyée et la passe en tant que `n` à la fonction de mise à jour suivante, et ainsi de suite :

|  mise à jour en attente | `n` | valeur renvoyée |
|-------------------------|-----|-----------------|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React stocke `3` comme résultat final et le renvoie depuis `useState`.

C'est pour ça qu'en cliquant sur « +3 » dans l'exemple ci-dessus, on incrémente correctement la valeur par 3.

### Ce qui se passe si vous mettez à jour l'état après l'avoir remplacé {/*what-happens-if-you-update-state-after-replacing-it*/}

Et pour ce gestionnaire d'événement ? Quelle sera selon vous la valeur de `number` au prochain rendu ?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

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
        setNumber(n => n + 1);
      }}>Incrémenter le nombre</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Voici ce que le gestionnaire d'événement demande à React :

1. `setNumber(number + 5)` : `number` vaut `0`, donc `setNumber(0 + 5)`. React ajoute *« remplacer par `5` »* dans la file d'attente.
2. `setNumber(n => n + 1)` : `n => n + 1` est une fonction de mise à jour. React ajoute *cette fonction* dans la file d'attente.

Lors du prochain rendu, React traite la file dans l'ordre :

|   mise à jour en attente       | `n` | valeur renvoyée |
|--------------|---------|-----|
| « remplacer par `5` » | `0` (ignoré) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React stocke `6` comme résultat final et le renvoie depuis `useState`.

<Note>

Vous avez peut-être remarqué que `setState(5)` revient à faire `setState(n => 5)`, en ignorant `n` !

</Note>

### Ce qui se passe si vous remplacez l'état après l'avoir mis à jour {/*what-happens-if-you-replace-state-after-updating-it*/}

Allez, encore un exemple. Quelle sera selon vous la valeur de `number` au prochain rendu ?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

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
        setNumber(n => n + 1);
        setNumber(42);
      }}>Incrémenter le nombre</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Voici comment React traite ces lignes de code à l'exécution du gestionnaire d'événement :

1. `setNumber(number + 5)` : `number` vaut `0`, donc `setNumber(0 + 5)`. React ajoute *« remplacer par `5` »* dans la file d'attente.
2. `setNumber(n => n + 1)` : `n => n + 1` est une fonction de mise à jour. React ajoute *cette fonction* dans la file d'attente.
3. `setNumber(42)` : React ajoute *« remplacer par `42` »* dans la file d'attente.

Lors du prochain rendu, React traite la file dans l'ordre :

|   mise à jour en attente       | `n` | valeur renvoyée |
|--------------|---------|-----|
| « remplacer par `5` » | `0` (ignoré) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| « remplacer par `42` » | `6` (ignoré) | `42` |

React stocke alors `42` comme résultat final et le renvoie depuis `useState`.

En résumé, voici comment interpréter l'argument que vous passez à une fonction de modification d'état comme `setNumber` :

* **Une fonction de mise à jour** (ex. `n => n + 1`) est ajoutée à la file d'attente.
* **N'importe quelle autre valeur** (ex. le nombre `5`) ajoute « remplacer par `5` » à la file d'attente, ce qui revient à ignorer les étapes précédentes de la file.

Après que le gestionnaire d'événement a terminé, React déclenche un nouveau rendu.  Durant celui-ci, React traite la file d'attente. Les fonctions de mise à jour sont exécutées lors du rendu, ce qui implique que **les fonctions de mise à jour doivent être [pures](/learn/keeping-components-pure)** et se contenter de *renvoyer* leur résultat.  N'essayez pas de mettre à jour l'état depuis les fonctions de mise à jour, ou de déclencher quelque autre effet de bord que ce soit.  En Mode Strict, React exécutera chaque fonction de mise à jour deux fois (en ignorant le second résultat) pour vous aider à détecter des erreurs.

### Conventions de nommage {/*naming-conventions*/}

L'usage veut qu'on nomme généralement l'argument d'une fonction de mise à jour d'après les initiales de la variable d'état correspondante :

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

Si vous préférez du code plus verbeux, une autre convention usuelle consiste à reprendre le nom complet de la variable d'état, comme dans `setEnabled(enabled => !enabled)` ; on peut aussi ajouter un préfixe comme dans `setEnabled(prevEnabled => !prevEnabled)`.

<Recap>

* Définir l'état ne change pas la variable du rendu en cours, mais demande un nouveau rendu.
* React traite les mises à jour d'état après que les gestionnaires d'événements ont fini leur exécution.  On parle de traitement par lots.
* Pour mettre à jour un état plusieurs fois au sein d'un même événement, passez une fonction de mise à jour comme dans `setNumber(n => n + 1)`.

</Recap>

<Challenges>

#### Corriger un compteur de requêtes {/*fix-a-request-counter*/}

Vous travaillez sur une appli de place de marché artistique qui permet à l'utilisateur d'envoyer plusieurs commandes à la fois pour une même œuvre d'art.  Chaque fois que l'utilisateur appuie sur le bouton « Acheter », le compteur « En attente » devrait augmenter de un. Après trois secondes, le compteur « En attente » devrait être décrémenté, et le compteur « Finalisé » devrait augmenter d'autant.

Pourtant, le compteur « En attente » ne se comporte pas comme prévu. Lorsque vous appuyez sur « Acheter », il descend à `-1` (ce qui devrait être impossible !).  Et si vous cliquez en rafale, les deux compteurs se comportent bizarrement.

Que se passe-t-il ? Corrigez les deux compteurs.

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        En attente : {pending}
      </h3>
      <h3>
        Finalisé : {completed}
      </h3>
      <button onClick={handleClick}>
        Acheter
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

Au sein du gestionnaire d'événement `handleClick`, les valeurs de `pending` et `completed` correspondent à ce qu'elles étaient au moment du clic. Lors du rendu initial, `pending` était à `0`, de sorte que `setPending(pending - 1)` revient à `setPending(-1)`, un résultat clairement incorrect.  Puisque vous souhaitez *incrémenter* ou *décrémenter* les compteurs, plutôt que d'en définir les valeurs absolues pendant le clic, préférez passer des fonctions de mise à jour :

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        En attente : {pending}
      </h3>
      <h3>
        Finalisé : {completed}
      </h3>
      <button onClick={handleClick}>
        Acheter
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

Ça garantit que lorsque vous incrémentez ou décrémentez un compteur, vous le faites par rapport à sa *dernière* valeur en date plutôt que la valeur qu'avait l'état au moment du clic.

</Solution>

#### Implémenter la file d'attente vous-même {/*implement-the-state-queue-yourself*/}

Dans ce défi, vous allez réimplémenter une toute petite partie de React à partir de zéro !  Rassurez-vous, ce n'est pas aussi ardu que ça en a l'air.

Faites défiler le panneau de prévisualisation du bac à sable. Remarquez qu'il affiche **quatre scénarios de tests**. Ils correspondent aux exemples que vous avez vu plus haut sur cette page. Votre objectif consiste à implémenter la fonction `getFinalState` pour qu'elle renvoie le résultat correct dans chaque scénario.  Si vous l'implémentez correctement, les quatre scénarios de test passeront.

Vous recevrez deux arguments : `baseState` sera l'état initial (ex. `0`) et la `queue` sera un tableau contenant un mix de nombres (ex. `5`) et de fonctions de mise à jour (ex. `n => n + 1`), dans l'ordre de leurs ajouts.

Vous devez renvoyer l'état final, comme dans les tableaux vus sur cette page !

<Hint>

Si vous êtes coincé·e, commencez par ce squelette de code :

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: appliquer la fonction de mise à jour
    } else {
      // TODO: remplacer l'état
    }
  }

  return finalState;
}
```

À vous de remplir les blancs !

</Hint>

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: faire le nécessaire avec la file...

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>État de départ : <b>{baseState}</b></p>
      <p>File : <b>[{queue.join(', ')}]</b></p>
      <p>Résultat attendu : <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Votre résultat : <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

Voici l'algorithme exact décrit sur cette page, que React utilise pour calculer l'état final :

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Appliquer la fonction de mise à jour.
      finalState = update(finalState);
    } else {
      // Remplacer le prochain état.
      finalState = update;
    }
  }

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>État de départ : <b>{baseState}</b></p>
      <p>File : <b>[{queue.join(', ')}]</b></p>
      <p>Résultat attendu : <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Votre résultat : <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

À présent vous savez comment fonctionne cette partie de React !

</Solution>

</Challenges>
