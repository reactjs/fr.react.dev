---
title: Réagir à la saisie avec un état
---

<Intro>

React offre un moyen déclaratif de manipuler l’interface utilisateur (UI). Au lieu de manipuler directement des éléments individuels de l’interface, vous décrivez les différents états dans lesquels votre composant peut se trouver, et vous passez de l’un à l’autre en réponse à la saisie de l’utilisateur. Ça ressemble à la façon dont les designers réfléchissent à l’UI.

</Intro>

<YouWillLearn>

* En quoi la programmation déclarative de l’UI diffère de sa programmation impérative
* Comment répertorier les différents états visuels dans lesquels votre composant peut se trouver
* Comment déclencher les transition entre les différents états visuels à partir du code

</YouWillLearn>

## Différences entre UI déclarative et impérative {/*how-declarative-ui-compares-to-imperative*/}

Lorsque vous concevez des interactions avec l’UI, vous pensez probablement à la manière dont l'interface *change* en réponse aux actions de l’utilisateur. Prenons l’exemple d’un questionnaire qui permet à l’utilisateur de soumettre une réponse :

* Quand vous saisissez quelque chose dans le questionnaire, le bouton « Envoyer » **devient actif**.
* Quand vous appuyez sur « Envoyer », le questionnaire et le bouton **deviennent inactifs**, et un *spinner* (une roue de chargement) **apparaît**
* Si la requête réseau réussit, le questionnaire **disparaît**, et le message « Merci » **apparaît**.
* Si la requête réseau échoue, un message d'erreur **apparaît** et le questionnaire **redevient actif**.

En **programmation impérative**, ce qui précède correspond directement à la manière dont vous implémentez l’interaction. Vous devez écrire les instructions exactes pour manipuler l’interface en fonction de ce qui vient de se passer. Voici une autre façon de voir les choses : imaginez que vous êtes à côté de quelqu’un dans une voiture et que vous lui indiquez pas à pas où aller.

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="Dans une voiture conduite par une personne l’air anxieuse représentant JavaScript, un passager lui ordonne d'exécuter une séquence de navigations compliquées, étape par étape." />

La personne qui conduit ne sait pas où vous voulez aller, elle se contente de suivre vos ordres. (Et si vous vous trompez de direction, vous vous retrouvez au mauvais endroit !) On appelle ça le style *impératif* parce que vous devez « commander » chaque élément, du *spinner* au bouton, en indiquant à l’ordinateur *comment* mettre à jour l’interface utilisateur.

Dans cet exemple de programmation impérative de l'UI, le questionnaire est construit *sans* React. Il utilise uniquement le [DOM](https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model) du navigateur :

<Sandpack>

```js src/index.js active
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
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('Bonne idée, mais mauvaise réponse. Réessayez !'));
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
    Quelle ville est située sur deux continents ?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Envoyer</button>
  <p id="loading" style="display: none">Chargement...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">C’est exact !</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

La manipulation impérative de l’UI marche assez bien pour des exemples isolés, mais elle devient exponentiellement plus difficile à gérer dans des systèmes plus complexes. Imaginez la mise à jour d’une page remplie de différents questionnaires comme celui-ci. L’ajout d’un nouvel élément d’interface ou d’une nouvelle interaction nécessiterait de vérifier soigneusement tout le code existant pour s’assurer que vous n’avez pas introduit de bug (par exemple, en oubliant d’afficher ou de masquer quelque chose).

React a été conçu pour résoudre ce problème.

Avec React, vous ne manipulez pas directement l’UI--vous ne vous souciez pas d’activer, désactiver, afficher ou masquer les composants directement. Au lieu de ça, vous **déclarez ce que vous voulez montrer**, et React se charge de mettre à jour l’interface. Imaginez que vous montez dans un taxi et dites au chauffeur où vous voulez aller au lieu de lui dire exactement par où passer. C’est le travail du chauffeur de vous y emmener, et il peut même connaître des raccourcis que vous n’avez pas envisagés !

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="Dans une voiture conduite par React, un passager demande à être emmené à un endroit spécifique sur la carte. React détermine comment y aller." />

## Penser l'UI de manière déclarative {/*thinking-about-ui-declaratively*/}

Vous avez vu ci-dessus comment implémenter un questionnaire de manière impérative. Pour mieux comprendre comment penser en React, vous allez voir comment réimplémenter cette interface avec React :

1. **Identifiez** les différents états visuels de votre composant
2. **Déterminez** ce qui déclenche ces changement d’état
3. **Représentez** l’état en mémoire avec `useState`
4. **Retirez** les variables d’état non essentielles
5. **Connectez** les gestionnaires d’évènements pour définir l’état

### Étape 1 : identifier les différents états visuels de votre composant {/*step-1-identify-your-components-different-visual-states*/}

En informatique, vous entendez parfois parler d’une [« machine à états »](https://fr.wikipedia.org/wiki/Automate_fini) qui se trouve dans un « état » parmi plusieurs bien définis. Si vous travaillez avec un designer, vous avez peut-être vu des maquettes représentant différents « états visuels ». React se situe à l’intersection du design et de l’informatique, ces deux idées sont donc des sources d’inspiration.

Pour commencer, vous devez visualiser tous les « états » distincts de l’interface que l’utilisateur est susceptible de voir :

* **Vide** : le questionnaire a un bouton « Envoyer » inactif.
* **Saisie** : le questionnaire a un bouton « Envoyer » actif.
* **Envoi** : le questionnaire est complètement inactif, le *spinner* est affiché.
* **Succès** : le message « Merci » est affiché au lieu du questionnaire.
* **Erreur** : comme l’état de saisie, mais avec un message d’erreur en plus.

Tout comme un designer, vous voudrez sans doute créer des maquettes pour les différents états avant d’ajouter du comportement. Par exemple, voici une maquette pour la partie visuelle du questionnaire. Cette maquette est contrôlée par une prop appelée `status` dont la valeur par défaut est `'empty'` :

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>C’est exact !</h1>
  }
  return (
    <>
      <h2>Quiz sur les villes</h2>
      <p>
        Dans quelle ville trouve-t-on une pancarte qui transforme l’air en eau potable ?
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

Vous pouvez appeler cette propriété comme bon vous semble, le nom n’est pas important. Essayez de modifier `status = 'empty'` en `status = 'success'` pour voir le message de succès apparaître. La création de maquettes vous permet d’itérer rapidement sur l’interface avant de câbler le comportement. Voici un prototype plus élaboré du même composant, toujours « contrôlé » par la prop `status` :

<Sandpack>

```js
export default function Form({
  // Essayez 'submitting', 'error', 'success' :
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>C’est exact !</h1>
  }
  return (
    <>
      <h2>Quiz sur les villes</h2>
      <p>
        Dans quelle ville trouve-t-on une pancarte qui transforme l’air en eau potable ?
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
          Envoyer
        </button>
        {status === 'error' &&
          <p className="Error">
            Bonne idée, mais mauvaise réponse. Réessayez !
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

Si un composant a beaucoup d'états visuels, il peut être pratique de tous les afficher sur la même page :

<Sandpack>

```js src/App.js active
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
          <h4>Questionnaire ({status}) :</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js src/Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>C’est exact !</h1>
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
        Envoyer
      </button>
      {status === 'error' &&
        <p className="Error">
          Bonne idée, mais mauvaise réponse. Réessayez !
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

Les pages de ce type sont souvent appelées « guides de style dynamiques » ou *“storybooks”*.

</DeepDive>

### Étape 2 : déterminer ce qui déclenche ces changements d’état {/*step-2-determine-what-triggers-those-state-changes*/}

Vous pouvez déclencher des mises à jour de l'état en réponse à deux types de stimuli :

* **Des événements utilisateurs**, tels que cliquer sur un bouton, écrire dans un champ ou suivre un lien de navigation.
* **Des événements techniques**, tels qu’une réponse réseau qui arrive, un délai qui se termine, une image qui charge.

<IllustrationBlock>
  <Illustration caption="Événements utilisateurs" alt="Un doigt." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Événements techniques" alt="Des 1 et des 0." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

Dans les deux cas, **vous devez définir des [variables d’état](/learn/state-a-components-memory#anatomy-of-usestate) pour mettre à jour l’interface**. Pour le questionnaire que vous développez, vous allez devoir changer l’état en réponse à quelques événements distincts :

* **Ajuster la saisie** (utilisateur) devrait basculer l’état entre *Vide* et *Saisie*, selon que le champ est vide ou non.
* **Cliquer sur le bouton Envoyer** (utilisateur) devrait passer l’état à *Envoi*.
* **Un succès de réponse réseau** (technique) devrait passer l’état à *Succès*.
* **Un échec de réponse réseau** (technique) devrait passer l’état à *Erreur* avec le message correspondant.

<Note>

Notez que les événements utilisateurs nécessitent souvent des [gestionnaires d’événements](/learn/responding-to-events) !

</Note>

Pour vous aider à visualiser ce flux, essayez de dessiner chaque état sur papier sous forme d’un cercle étiqueté, et chaque changement entre deux états sous forme d’une flèche. Vous pouvez dessiner beaucoup de flux de cette façon, et corriger des bugs bien en amont de l’implémentation.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="Diagramme de flux circulant de gauche à droite avec 5 nœuds. Le premier nœud appelé « Vide » a une liaison appelée « début de saisie » connectée à un nœud appelé « Saisie ». Ce nœud a une liaison appelée « Appui sur Envoi » connectée à un nœud appelé « Envoi », qui a 2 liaisons. Celle de gauche est appelée « Erreur réseau », elle est connectée à un nœud appelé « Erreur ». Celle de droite est appelée « Succès réseau », elle est connectée à un nœud appelé « Succès ».">

États du questionnaire

</Diagram>

</DiagramGroup>

### Étape 3 : représenter l’état en mémoire avec `useState` {/*step-3-represent-the-state-in-memory-with-usestate*/}

Ensuite, vous devrez représenter les états visuels de votre composant en mémoire avec [`useState`](/reference/react/useState). La simplicité est la clé : chaque élément d’état est une « pièce mobile », et **vous voulez le moins de « pièces mobiles » possible**. Plus de complexité conduit à davantage de bugs !

Commencez par l’état qui *doit absolument* être présent. Par exemple, vous aurez besoin de stocker `answer` pour la saisie, et `error` pour stocker la dernière erreur (le cas échéant) :

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

Ensuite, vous aurez besoin d’une variable d’état représentant l’état visuel que vous souhaitez afficher. Il n’y a généralement plusieurs façons de représenter ça en mémoire, vous devrez donc expérimenter.

Si vous avez du mal à trouver la meilleure méthode d’entrée de jeu, commencez par ajouter suffisamment d’états pour être *complètement* sûr·e que tous les états visuels possibles sont couverts :

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

Votre première idée ne sera sûrement pas la meilleure, mais ce n’est pas grave--la refonte de la structure de l’état fait partie du processus !

### Étape 4: retirer les variables d’état non essentielles {/*step-4-remove-any-non-essential-state-variables*/}

Il est préférable d’éviter les doublons entre éléments ɗ’état afin de se concentrer sur ce qui est essentiel. En consacrant un peu de temps à la refonte de votre structure d’état, vous rendrez vos composants plus faciles à comprendre, vous réduirez la duplication et vous éviterez des erreurs d’interprétation. Votre objectif est d’**éviter les cas où l’état en mémoire ne représente aucune interface valide que vous accepteriez de montrer à l’utilisateur**. (Par exemple, vous ne voulez jamais afficher un message d’erreur et désactiver la saisie en même temps, ou l’utilisateur ne sera pas en mesure de corriger l’erreur !)

Voici quelques questions que vous pouvez vous poser sur vos variables d'état :

* **Es-ce que cet état est paradoxal ?** Par exemple, `isTyping` et `isSubmitting` ne peuvent pas être tous les deux à `true`. Un paradoxe signifie généralement que l’état n’est pas suffisamment contraint. Il y a quatre combinaisons possibles de deux booléens, mais seulement trois correspondent à des états valides. Pour supprimer l’état « impossible », vous pouvez les combiner dans un `status` qui doit être l’une des trois valeurs suivantes : `'typing'`, `'submitting'`, ou `'success'`.
* **La même information est-elle déjà disponible dans une autre variable d’état ?** Un autre paradoxe : `isEmpty` et `isTyping` ne peuvent pas être à `true` en même temps. En les rendant distinctes, vous risquez de les désynchroniser et de provoquer des bugs. Heureusement, vous pouvez supprimer `isEmpty` et vérifier à la place `answer.length === 0`.
* **Pouvez-vous obtenir la même information en inversant une autre variable d’état ?** `isError` n’est pas nécessaire car vous pouvez vérifier `error !== null` à la place.

Après ce nettoyage, il vous reste seulement 3 (au lieu de 7 !) variables d’état *essentielles* :

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', ou 'success'
```

Vous savez qu’elles sont essentielles parce que vous ne pouvez retirer aucune d’entre elles sans casser le fonctionnement de l’interface.

<DeepDive>

#### Éliminer les états « impossibles » avec un réducteur {/*eliminating-impossible-states-with-a-reducer*/}

Ces trois variables représentent assez bien l’état de ce questionnaire. Cependant, il y a encore quelques états intermédiaires qui n’ont pas tout à fait de sens. Par exemple, une `error` non nulle n’a pas de sens quand `status` est à `'success'`. Pour modéliser l’état plus précisément, vous pouvez [l’extraire dans un réducteur](/learn/extracting-state-logic-into-a-reducer). Les réducteurs vous permettent d’unifier plusieurs variables d’état en un seul objet et de consolider toute la logique associée !

</DeepDive>

### Étape 5 : connecter les gestionnaires d’événements pour définir l’état {/*step-5-connect-the-event-handlers-to-set-state*/}

Enfin, créez des gestionnaires d’événements qui mettent à jour l’état. Voici le questionnaire final, avec tous les gestionnaires d’événements connectés :

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>C’est exact !</h1>
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
      <h2>Quiz sur les villes</h2>
      <p>
        Dans quelle ville trouve-t-on un panneau d’affichage qui transforme l’air en eau potable ?
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
          Envoyer
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
        reject(new Error('Bonne idée, mais mauvaise réponse. Réessayez !'));
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

Bien que ce code soit plus long que l’exemple impératif original, il est beaucoup moins fragile. Le fait d’exprimer toutes les interactions sous forme de changements d’état vous permet d’introduire ultérieurement de nouveaux états visuels sans casser les états existants. Cela vous permet également de modifier ce qui doit être affiché dans chaque état sans changer la logique de l’interaction elle-même.

<Recap>

* La programmation déclarative consiste à décrire l’interface utilisateur pour chaque état visuel plutôt que de micro-gérer l’interface (style impératif).
* Lors du développement d’un composant :
  1. Identifiez tous ses états visuels.
  2. Déterminez les déclencheurs humains et techniques des changements d’état.
  3. Modélisez l’état avec `useState`.
  4. Supprimez les états non essentiels pour éviter les bugs et les paradoxes.
  5. Connectez les gestionnaires d’événements pour définir l’état.

</Recap>



<Challenges>

#### Ajouter et retirer une classe CSS {/*add-and-remove-a-css-class*/}

Faites en sorte que cliquer sur l’image *supprime* la classe CSS `background--active` de la `<div>` extérieure, mais *ajoute* la classe `picture--active` à la balise `<img>`. Un nouveau clic sur l’arrière-plan devrait rétablir les classes CSS d'origine.

Visuellement, il faut s’attendre à ce qu’un clic sur l’image supprime l’arrière-plan violet et mette en évidence la bordure de l’image. Si vous cliquez en dehors de l’image, l’arrière-plan est mis en évidence, mais la bordure de l’image ne l’est plus.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Des maisons multicolores à Kampung Pelangi, Indonésie"
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

<Solution>

Ce composant a deux états visuels : lorsque l’image est active, et lorsque l’image est inactive :

* Lorsque l’image est active, les classes CSS sont `background` et `picture picture--active`.
* Lorsque l’image est inactive, les classes CSS sont `background background--active` et `picture`.

Une seule variable d’état booléenne suffit pour se souvenir si l’image est active. La tâche initiale était de supprimer ou d’ajouter des classes CSS. Avec React cependant, vous devez *décrire* ce que vous voulez voir plutôt que *manipuler* les éléments de l’interface utilisateur. Vous devez donc calculer les deux classes CSS en fonction de l’état actuel. Vous devez également [arrêter la propagation](/learn/responding-to-events#stopping-propagation) pour que le clic sur l’image ne soit pas aussi exploité comme clic sur l’arrière-plan.

Vérifiez que cette version fonctionne en cliquant sur l’image puis en-dehors :

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
        alt="Des maisons multicolores à Kampung Pelangi, Indonésie"
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

Autrement, vous pouvez retourner deux morceaux distincts de JSX :

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
          alt="Des maisons multicolores à Kampung Pelangi, Indonésie"
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
        alt="Des maisons multicolores à Kampung Pelangi, Indonésie"
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

Gardez à l'esprit que si deux morceaux de JSX différents décrivent le même arbre, leur imbrication (première `<div>` → première `<img>`) doit correspondre. Sinon, basculer `isActive` recréerait tout l'arbre en-dessous et [réinitialiserait son état](/learn/preserving-and-resetting-state). C’est pourquoi, si un arbre JSX similaire est renvoyé dans les deux cas, il est préférable de l’implémenter comme un seul morceau de JSX.

</Solution>

#### Éditeur de profil {/*profile-editor*/}

Voici un court questionnaire implémenté en JavaScript pur avec le DOM. Utilisez-le pour en comprendre le comportement :

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Modifier le profil') {
    editButton.textContent = 'Sauvegarder le profil';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Modifier le profil';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Bonjour ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + ' !'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Bonjour ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + ' !'
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
    Prénom :
    <b id="firstNameText">Jeanne</b>
    <input
      id="firstNameInput"
      value="Jeanne"
      style="display: none">
  </label>
  <label>
    Nom :
    <b id="lastNameText">Deroin</b>
    <input
      id="lastNameInput"
      value="Deroin"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Modifier le profil</button>
  <p><i id="helloText">Bonjour, Jeanne Deroin !</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Ce questionnaire passe d’un mode à l’autre : en mode édition, vous voyez les champs de saisie, et en mode visualisation, vous ne voyez que le résultat. L’intitulé du bouton bascule entre « Modifier » et « Enregistrer » en fonction du mode dans lequel vous vous trouvez. Lorsque vous modifiez les saisies, le message de bienvenue en bas est mis à jour en temps réel.

Votre tâche consiste à le réimplémenter en React dans le bac à sable ci-dessous. Pour vous aider à démarrer, le balisage a déjà été converti en JSX, mais vous devrez faire en sorte qu’il affiche ou masque les champs de saisie comme le fait l’original.

Veillez également à ce qu'il mette à jour le texte en bas de page !

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        Prénom :{' '}
        <b>Jeanne</b>
        <input />
      </label>
      <label>
        Nom :{' '}
        <b>Deroin</b>
        <input />
      </label>
      <button type="submit">
        Modifier le profil
      </button>
      <p><i>Bonjour, Jeanne Deroin !</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

Vous aurez besoin de deux variables d’état pour stocker les valeurs saisies : `firstName` et `lastName`. Vous aurez aussi besoin d’une variable d’état `isEditing` qui indique si les champs de saisie doivent être affichés ou non. Vous ne devriez _pas_ avoir besoin d'une variable `fullName` car le nom complet peut toujours être calculé à partir de `firstName` et de `lastName`.

Enfin, vous devriez utiliser le [rendu conditionnel](/learn/conditional-rendering) pour afficher ou masquer les champs de saisie en fonction de `isEditing`.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jeanne');
  const [lastName, setLastName] = useState('Deroin');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        Prénom :{' '}
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
        Nom :{' '}
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
        {isEditing ? 'Sauvegarder' : 'Modifier'} le profil
      </button>
      <p><i>Bonjour, {firstName} {lastName} !</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

Comparez cette solution à la version impérative originale du code. En quoi sont-elles différentes ?

</Solution>

#### Refondre la solution impérative sans React {/*refactor-the-imperative-solution-without-react*/}

Voici la sandbox originale du challenge précédent, écrite en style impératif sans React :

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Modifier le profil') {
    editButton.textContent = 'Sauvegarder le profil';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Modifier le profil';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Bonjour ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + ' !'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Bonjour ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + ' !'
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
    Prénom :
    <b id="firstNameText">Jeanne</b>
    <input
      id="firstNameInput"
      value="Jeanne"
      style="display: none">
  </label>
  <label>
    Nom :
    <b id="lastNameText">Deroin</b>
    <input
      id="lastNameInput"
      value="Deroin"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Modifier le profil</button>
  <p><i id="helloText">Bonjour, Jeanne Deroin !</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Imaginez que React n’existe pas. Pouvez-vous refactoriser ce code de manière à rendre son fonctionnement moins fragile et plus similaire à la version React ? À quoi cela ressemblerait-il si l’état était explicite, comme dans React ?

Si vous avez du mal à savoir par où commencer, le code ci-dessous a déjà la plupart de la structure en place. Si vous commencez ici, complétez la logique manquante dans la fonction `updateDOM`. (Référez-vous au code original si nécessaire.)

<Sandpack>

```js src/index.js active
let firstName = 'Jeanne';
let lastName = 'Deroin';
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
    editButton.textContent = 'Sauvegarder le profil';
    // TODO: afficher les champs, cacher le contenu
  } else {
    editButton.textContent = 'Modifier le profil';
    // TODO: masquer les champs, afficher le contenu
  }
  // TODO: mettre à jour les textes
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
    Prénom :
    <b id="firstNameText">Jeanne</b>
    <input
      id="firstNameInput"
      value="Jeanne"
      style="display: none">
  </label>
  <label>
    Nom :
    <b id="lastNameText">Deroin</b>
    <input
      id="lastNameInput"
      value="Deroin"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Modifier le profil</button>
  <p><i id="helloText">Bonjour Jeanne Deroin !</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

Les traitements manquants comprenaient le basculement de l’affichage des champs et du contenu, ainsi que la mise à jour des textes :

<Sandpack>

```js src/index.js active
let firstName = 'Jeanne';
let lastName = 'Deroin';
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
    editButton.textContent = 'Sauvegarder le profil';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Modifier le profil';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Bonjour ' +
    firstName + ' ' +
    lastName + ' !'
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
    Prénom :
    <b id="firstNameText">Jeanne</b>
    <input
      id="firstNameInput"
      value="Jeanne"
      style="display: none">
  </label>
  <label>
    Nom :
    <b id="lastNameText">Deroin</b>
    <input
      id="lastNameInput"
      value="Deroin"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Modifier le profil</button>
  <p><i id="helloText">Bonjour, Jeanne Deroin !</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

La fonction `updateDOM` que vous avez écrite montre ce que React fait sous le capot lorsque vous définissez l’état. (Cependant, React évite également de redéfinir les aspects du DOM qui n’ont pas bougé depuis la dernière mise à jour.)

</Solution>

</Challenges>
