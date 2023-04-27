---
title: Réagir à la saisie avec un état
---

<Intro>

React offre un moyen déclaratif de manipuler l’interface utilisateur. Au lieu de manipuler directement des éléments individuels de l’interface, vous décrivez les différents états dans lesquels votre composant peut se trouver, et vous passez de l’un à l’autre en réponse à la saisie de l’utilisateur. Ça ressemble à la façon dont les designers réfléchissent à l’interface utilisateur.

</Intro>

<YouWillLearn>

* En quoi la programmation déclarative de l’interface utilisateur diffère-t-elle de la programmation impérative de celle-ci
* Comment répertorier les différents états visuels dans lesquels votre composant peut se trouver
* Comment déclencher les changements entre les différents états visuels à partir du code ?

</YouWillLearn>

## En quoi l’interface utilisateur déclarative diffère-t-elle de l’impérative {/*how-declarative-ui-compares-to-imperative*/}

Lorsque vous concevez des interactions avec l’interface utilisateur, vous pensez probablement à la manière dont l'interface change en réponse aux actions de l’utilisateur. Prenons l’exemple d’un questionnaire qui permet à l’utilisateur de soumettre une réponse :

* Quand vous écrivez quelque chose dans le questionnaire, le bouton « Submit » **devient activé**.
* Quand vous appuyez sur « Submit », le questionnaire et le bouton **deviennent désactivés**, et un *spinner* **apparait**
* Si la requête réseau réussit, le questionnaire **devient caché**, et le message « Merci » **apparait**.
* Si la requête réseau échoue, un message d'erreur **apparait** et le questionnaire **devient activé** de nouveau.

En **programmation impérative**, ce qui précède correspond directement à la manière dont vous mettez en œuvre l’interaction. Vous devez écrire les instructions exactes pour manipuler l’interface utilisateur en fonction de ce qui vient de se passer. Voici une autre façon de voir les choses : imaginez que vous êtes à côté de quelqu’un dans une voiture et que vous lui dites tour à tour où aller.

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="Dans une voiture conduite par une personne à l’air anxieuse représentant le Javascript, un passager lui odronne d'exécuter une séquence de navigations compliquées, virage par virage." />

Ils ne savent pas où vous voulez aller, ils se contentent de suivre vos ordres. (Et si vous vous trompez de direction, vous vous retrouvez au mauvais endroit !) On l'appelle *impératif* parce que vous devez « commander » chaque élément, d *spinner* au bouton, en indiquant à l’ordinateur *comment* mettre à jour l’interface utilisateur.

Dans cet exemple de programmation impérative de l'interface utilisateur, le formulaire est construit *sans* React. Il utilise uniquement le navigateur [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model):

<Sandpack>

```js index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Imaginez que ça fait une requête réseau
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() == 'istanbul') {
        resolve();
      } else {
        reject(new Error('Bonne idée, mais mauvaise réponse. Réessayez !'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>City quiz</h2>
  <p>
    Quelle ville est située sur deux continents ?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Envoyer</button>
  <p id="loading" style="display: none">Chargement...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">C’est exact !</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

La manipulation impérative de l’interface utilisateur fonctionne assez bien pour des exemples isolés, mais elle devient exponentiellement plus difficile à gérer dans des systèmes plus complexes. Imaginez la mise à jour d’une page remplie de différents formulaires comme celui-ci. L’ajout d’un nouvel élément d’interface ou d’une nouvelle interaction nécessiterait de vérifier soigneusement tout le code existant pour s’assurer que vous n’avez pas introduit de bug (par exemple, en oubliant d’afficher ou de masquer quelque chose).

React a été conçu pour résoudre ce problème.

Avec React, vous ne manipulez pas directement l’interface utilisateur, c’est-à-dire que vous n’activez pas, ne désactivez pas, n’affichez pas ou ne cachez pas les composants directement. Au lieu de cela, vous **déclarez ce que vous voulez montrer**, et React se charge de mettre à jour l’interface utilisateur. Imaginez que vous montiez dans un taxi et que vous disiez au chauffeur où vous voulez aller au lieu de lui dire exactement où tourner. C’est le travail du chauffeur de vous y emmener, et il peut même connaître des raccourcis que vous n’avez pas envisagés !

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="Dans une voiture conduite par React, un passager demande à être emmené à un endroit spécifique sur la carte. React détermine comment faire ça." />

## Penser l'interface utilisateur de manière déclarative {/*thinking-about-ui-declaratively*/}

Vous avez vu comment implémenter un questionnaire de manière impérative au dessus. Pour mieux comprendre comment penser avec React, vous verrez ci-dessous comment réimplémenter cette interface utilisateur avec React :

1. **Identifier** les différents états visuels de votre composant
2. **Déterminer** ce qui déclenche des changement d’état
3. **Representer** l’état en mémoire avec `useState`
4. **Retirer** les variables d’état non-essentielles
5. **Connecter** les gestionnaires d’évènements pour définir l’état

### Étape 1: Identifier les différents états visuels de votre composent {/*step-1-identify-your-components-different-visual-states*/}

En informatique, vous pouvez entendre parler d’une ["machine à états"](https://en.wikipedia.org/wiki/Finite-state_machine) qui se trouve dans un « état » parmis d’autres. Si vous travaillez avec un designer, vous avez peut-être vu des maquettes représentant différents « états visuels ». React se situe à l’intersection du design et de l’informatique, ces deux idées sont donc des sources d’inspiration.

En premier, vous devez visualiser tous les différents « états » de l’interface utilisateur que l’utilisateut pourrait voir :

* **Vide**: Le questionnaire a un bouton « Submit » désactivé.
* **Ecriture**: Le questionnaire a un bouton « Submit » activé.
* **Envoi**: Le questionnaire est complètement désactivé, la roue de chargement est affichée.
* **Succès**: Le message « Merci » est affiché au lieu du questionnaire.
* **Erreur**: Comme l’état d’écriture, mais avec un message d'erreur en plus.

Tout comme un designer, vous devez créer des maquettes pour les différents états avant d’ajouter de la logique. Par exemple, voici une maquette pour la partie visuelle du questionnaire. Cette maquette est contrôlée par une prop appelée `status` dont la valeur par défaut est `'empty'` :

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>C’est exact !</h1>
  }
  return (
    <>
      <h2>Quiz sur les villes</h2>
      <p>
        Dans quelle ville trouve-t-on une pancarte qui transforme l’air en eau potable ?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Envoyer
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

You could call that prop anything you like, the naming is not important. Try editing `status = 'empty'` to `status = 'success'` to see the success message appear. Mocking lets you quickly iterate on the UI before you wire up any logic. Here is a more fleshed out prototype of the same component, still "controlled" by the `status` prop:
Vous pouvez appeler cette propriété comme vous le souhaitez, le nom n’est pas important. Essayez de modifier `status = 'empty'` en `status = 'success'` pour voir le message de succès apparaître. La création de maquettes vous permet d’itérer rapidement sur l’interface utilisateur avant de câbler la logique. Voici un prototype plus élaboré du même composant, toujours « contrôlé » par la propriété `status` :

<Sandpack>

```js
export default function Form({
  // Try 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>C’est exact !</h1>
  }
  return (
    <>
      <h2>Quiz sur les villes</h2>
      <p>
        Dans quelle ville trouve-t-on une pancarte qui transforme l’air en eau potable ?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Submit
        </button>
        {status === 'error' &&
          <p className="Error">
            Bonne idée, mais mauvaise réponse. Réessayez !
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### Afficher plusieurs états visuels à la fois {/*displaying-many-visual-states-at-once*/}

If a component has a lot of visual states, it can be convenient to show them all on one page:
Si un composant a beaucoup d'états visuels, ça peut être plus pratique de les tous les afficher sur la même page :

<Sandpack>

```js App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>C’est exact !</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Bonne idée, mais mauvaise réponse. Réessayez !
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

Pages like this are often called "living styleguides" or "storybooks".
Les pages de ce type sont souvent appelées "living styleguides" ou "storybooks"

</DeepDive>

### Étape 2: Déterminer ce qui déclenche ces changements d’état {/*step-2-determine-what-triggers-those-state-changes*/}

You can trigger state updates in response to two kinds of inputs:
Vous pouvez déclencher des mises à jour de l'état en réponse à deux types d’entrées :

* **Entrées humaines**, telles que cliquer sur un bouton, écrire dans un champ ou naviguer dans un lien.
* **Entrées de l’ordinateur**, telles qu’une réponse réseau qui arrive, un délai qui se termine, une image qui charge.

<IllustrationBlock>
  <Illustration caption="Entrées humaines" alt="Un doigt." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Entrées de l’ordinateur" alt="Des 1 et des 0." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

Dans chaque cas, **vous devez définir des [variables d’état](/learn/state-a-components-memory#anatomy-of-usestate) pour mettre à jour l’interface**. Pour le questionnaire que vous développez, vous allez devoir changer l’état en réponse à quelques entrées différentes :

* **Changer la saisie du texte** (humain) doit changer l’état depuis *Empty* vers *Typing*, ou dans l’autre sens, selon si la saisie est vide ou non.
* **Clicking the Submit button** (humain) doit changer l’état en *Submitting*.
* **Successful network response** (ordinateur) doit changer l’état en *Success*.
* **Failed network response** (ordinateur) doit changer l’état en *Error* avec le message d’erreur correspondant.

<Note>

Notez que les entrées humaines nécéssitent souvent des [gestionnaires d’évènements](/learn/responding-to-events) !

</Note>

Pour vous aider à visualiser ce flux, essayez de dessiner chaque état sur papier sous forme d’un cercle étiqueté, et chaque changement entre deux états sous forme d’une flèche. Vous pouvez dessiner beaucoup de flux de cette façon, et trier des bugs longtemps avant l’implémentation.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="Organigramme bougeant de la gauche à la droite avec 5 noeuds. Le premier noeud appellé « empty » a un bord appelé « start typing » connecté à un noeud appelé « typing ». Ce noeud a un bord appelé « press submit » connecté à un noeud appelé « submitting », qui a 2 bords. Le bord de gauche est appelé « network error » connecté à un noeud à un noeud appelé « error ». Le bord de droite est appelé « network success », et est connecté à un noeud appelé « success ».">

États du questionnaire

</Diagram>

</DiagramGroup>

### Étape 3: Représenter l’état en mémoire avec `useState` {/*step-3-represent-the-state-in-memory-with-usestate*/}

Ensuite, vous devrez représenter les états visuels de votre composant en mémoire avec [`useState`](/reference/react/useState). La simplicité est la clé : chaque élément d’état est une « pièces mobiles », et **vous voulez le moins de « pièces mobiles » possible**. Plus de complexité conduit à plus de bugs !

Commencez par l’état qui *doit absolument* être présent. Par exemple, vous aurez besoin de stocker `answer` pour l’entrée, et `error` (si elle existe) pour stocker la dernière erreur :

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

Ensuite, vous aurez besoin d’une variable d’état représentant l’état visuel que vous souhaitez afficher. Il n’y a généralement pas qu’une seule façon de représenter cela en mémoire, vous devrez donc expérimenter.

Si vous avez du mal à trouver la meilleure méthode immédiatement, commencez par ajouter suffisamment d’états pour être *définitivement* sûr que tous les états visuels possibles sont couverts :

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

Your first idea likely won't be the best, but that's ok--refactoring state is a part of the process!
Votre première idée ne sera sûrement pas la meilleure, mais ce n’est mas grave -- la refonte fait partie du processus !

### Étape 4: Remove any non-essential state variables {/*step-4-remove-any-non-essential-state-variables*/}

Vous souhaitez éviter les doublons dans le contenu des états afin de ne suivre que ce qui est essentiel. En consacrant un peu de temps à la refonte de votre structure d’état, vous rendrez vos composants plus faciles à comprendre, vous réduirez la duplication et vous éviterez les significations involontaires. Votre objectif est de **prévenir les cas où l’état en mémoire ne représente aucune interface utilisateur valide que vous ne voudriez pas que l’utilisateur voie** (par exemple, vous ne voulez jamais afficher un message d’erreur et désactiver la saisie en même temps, ou l’utilisateur ne sera pas en mesure de corriger l’erreur).

Voici quelques questions que vous pouvez poser sur vos variables d'état :

* **Es-ce que cet état cause un paradoxe ?** Par exemple, `isTyping` et `isSubmitting` ne peuvent pas être tous les deux définis à `true`. Un paradoxe signifie généralement que l’état n’est pas suffisamment contraint. Il y a quatre combinaisons possibles de deux booléens, mais seulement trois correspondent à des états valides. Pour supprimer l’état "impossible", vous pouvez les combiner dans un `status` qui doit être l’une des trois valeurs suivantes : `'typing'`, `'submitting'`, ou `'success'`.
* **Is the same information available in another state variable already?** Another paradox: `isEmpty` and `isTyping` can't be `true` at the same time. By making them separate state variables, you risk them going out of sync and causing bugs. Fortunately, you can remove `isEmpty` and instead check `answer.length === 0`.
* **La même information est-elle déjà disponible dans une autre variable d’état ?** Un autre paradoxe : `isEmpty` et `isTyping` ne peuvent pas être à `true` en même temps. En les rendant distinctes, vous risquez de les désynchroniser et de provoquer des bugs. Heureusement, vous pouvez supprimer `isEmpty` et vérifier à la place `answer.length === 0`.
* **Pouvez-vous obtenir la même information à partir de l’inverse d'une autre variable d’état ?** `isError` n’est pas nécessaire car vous pouvez vérifier `error !== null` à la place.

Après ce nettoyage, il vous reste seulement 3 (au lieu de 7 !) variables d’état *essentielles* :

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

Vous savez qu’elles sont essentielles parce que vous ne pouvez retirer aucune d’entre elles sans casser le fonctionnement.

<DeepDive>

#### Éliminer les états « impossibles » avec un réducteur {/*eliminating-impossible-states-with-a-reducer*/}

Ces trois variables représentent assez bien l’état de ce formulaire. Cependant, il y a encore quelques états intermédiaires qui n’ont pas tout à fait de sens. Par exemple, une `error` non nulle n’a pas de sens quand `status` est à `'success'`. Pour modéliser l’état plus précisément, vous pouvez [l’extraire dans un réducteur](/learn/extracting-state-logic-into-a-reducer). Les réducteurs vous permettent d’unifier plusieurs variables d’état en un seul objet et de consolider toute la logique associée !

</DeepDive>

### Étape 5: Connect the event handlers to set state {/*step-5-connect-the-event-handlers-to-set-state*/}

Lastly, create event handlers that update the state. Below is the final form, with all event handlers wired up:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

Although this code is longer than the original imperative example, it is much less fragile. Expressing all interactions as state changes lets you later introduce new visual states without breaking existing ones. It also lets you change what should be displayed in each state without changing the logic of the interaction itself.

<Recap>

* Declarative programming means describing the UI for each visual state rather than micromanaging the UI (imperative).
* When developing a component:
  1. Identify all its visual states.
  2. Determine the human and computer triggers for state changes.
  3. Model the state with `useState`.
  4. Remove non-essential state to avoid bugs and paradoxes.
  5. Connect the event handlers to set state.

</Recap>



<Challenges>

#### Add and remove a CSS class {/*add-and-remove-a-css-class*/}

Make it so that clicking on the picture *removes* the `background--active` CSS class from the outer `<div>`, but *adds* the `picture--active` class to the `<img>`. Clicking the background again should restore the original CSS classes.

Visually, you should expect that clicking on the picture removes the purple background and highlights the picture border. Clicking outside the picture highlights the background, but removes the picture border highlight.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

This component has two visual states: when the image is active, and when the image is inactive:

* When the image is active, the CSS classes are `background` and `picture picture--active`.
* When the image is inactive, the CSS classes are `background background--active` and `picture`.

A single boolean state variable is enough to remember whether the image is active. The original task was to remove or add CSS classes. However, in React you need to *describe* what you want to see rather than *manipulate* the UI elements. So you need to calculate both CSS classes based on the current state. You also need to [stop the propagation](/learn/responding-to-events#stopping-propagation) so that clicking the image doesn't register as a click on the background.

Verify that this version works by clicking the image and then outside of it:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Alternatively, you could return two separate chunks of JSX:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Rainbow houses in Kampung Pelangi, Indonesia"
          src="https://i.imgur.com/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Keep in mind that if two different JSX chunks describe the same tree, their nesting (first `<div>` → first `<img>`) has to line up. Otherwise, toggling `isActive` would recreate the whole tree below and [reset its state.](/learn/preserving-and-resetting-state) This is why, if a similar JSX tree gets returned in both cases, it is better to write them as a single piece of JSX.

</Solution>

#### Profile editor {/*profile-editor*/}

Here is a small form implemented with plain JavaScript and DOM. Play with it to understand its behavior:

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

This form switches between two modes: in the editing mode, you see the inputs, and in the viewing mode, you only see the result. The button label changes between "Edit" and "Save" depending on the mode you're in. When you change the inputs, the welcome message at the bottom updates in real time.

Your task is to reimplement it in React in the sandbox below. For your convenience, the markup was already converted to JSX, but you'll need to make it show and hide the inputs like the original does.

Make sure that it updates the text at the bottom, too!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        First name:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        Last name:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Edit Profile
      </button>
      <p><i>Hello, Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

You will need two state variables to hold the input values: `firstName` and `lastName`. You're also going to need an `isEditing` state variable that holds whether to display the inputs or not. You should _not_ need a `fullName` variable because the full name can always be calculated from the `firstName` and the `lastName`.

Finally, you should use [conditional rendering](/learn/conditional-rendering) to show or hide the inputs depending on `isEditing`.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        First name:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Last name:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

Compare this solution to the original imperative code. How are they different?

</Solution>

#### Refactor the imperative solution without React {/*refactor-the-imperative-solution-without-react*/}

Here is the original sandbox from the previous challenge, written imperatively without React:

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Imagine React didn't exist. Can you refactor this code in a way that makes the logic less fragile and more similar to the React version? What would it look like if the state was explicit, like in React?

If you're struggling to think where to start, the stub below already has most of the structure in place. If you start here, fill in the missing logic in the `updateDOM` function. (Refer to the original code where needed.)

<Sandpack>

```js index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    // TODO: show inputs, hide content
  } else {
    editButton.textContent = 'Edit Profile';
    // TODO: hide inputs, show content
  }
  // TODO: update text labels
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

The missing logic included toggling the display of inputs and content, and updating the labels:

<Sandpack>

```js index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

The `updateDOM` function you wrote shows what React does under the hood when you set the state. (However, React also avoids touching the DOM for properties that have not changed since the last time they were set.)

</Solution>

</Challenges>
