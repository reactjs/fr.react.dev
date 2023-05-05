---
title: useId
---

<Intro>

`useId` est un React Hook permettant de générer des identifiants uniques qui peuvent être transmis aux attributs d'accessibilité.

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useId()` {/*useid*/}

Appelez `useId` au niveau supérieur de votre composant pour générer un identifiant unique :

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[Voir d'autres exemples ci-dessous.](#usage)

#### Arguments {/*parameters*/}

`useId` n'accepte aucun argument.

#### Valeur renvoyer {/*returns*/}

`useId` renvoie un identifiant unique en chaîne de caractères associée à cet appel `useId` particulier le composant en question.

#### Limitations {/*caveats*/}

* `useId` est un Hook, vous pouvez donc uniquement l'appeler **au niveau supérieur de votre composant** ou de vos propres Hooks. Vous ne pouvez pas l'appeler à l'intérieur de boucles ou de conditions. Si nécessaire, extrayez un nouveau composant et déplacez l'état dans celui-ci.

* `useId` ne doit pas être utilisé pour générer des clés dans une liste. [Les clés doivent être obtenues à partir de vos données.](/learn/rendering-lists#where-to-get-your-key)

---

## Usage {/*usage*/}

<Pitfall>

**N'appelez pas `useId` pour générer des clés dans une liste.** [Les clés doivent être obtenues à partir de vos données.](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### Générer des identifiants uniques pour les attributs d'accessibilité {/*generating-unique-ids-for-accessibility-attributes*/}

Appelez `useId` au niveau supérieur de votre composant pour générer un identifiant unique :

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

Vous pouvez ensuite transmettre <CodeStep step={1}>l'identifiant généré</CodeStep> à différents attributs :

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**Prenons un exemple pour mieux saisir l'utilité de cette méthode.**

[Les attributs d'accessibilité HTML](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) tels que [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) vous permettent de spécifier que deux balises sont liées l'une à l'autre. Par exemple, vous pouvez spécifier qu'un élément (exemple : un champ de saisie) est décrit par un autre élément (un paragraphe).

En HTML classique, vous l'écririez comme suit :

```html {5,8}
<label>
  Mot de passe :
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  Le mot de passe doit contenir au moins 18 caractères
</p>
```

Cependant, coder des ID en dur comme cela n'est pas une bonne pratique avec React. Un composant pourrait être rendu plus d'une fois sur la page--mais les ID doivent être uniques ! Au lieu de coder en dur un identifiant, générez un identifiant unique avec `useId` :

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Mot de passe :
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        Le mot de passe doit contenir au moins 18 caractères
      </p>
    </>
  );
}
```

Désormais, même si `PasswordField` apparaît plusieurs fois à l'écran, les identifiants générés ne seront pas en conflit.

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Mot de passe:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        Le mot de passe doit contenir au moins 18 caractères
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choisissez un mot de passe</h2>
      <PasswordField />
      <h2>Confirmez le mot de passe</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[Regardez cette vidéo](https://www.youtube.com/watch?v=0dNzNcuEuOo) pour voir la différence d'expérience de l'utilisateur avec l'utilisation des technologies d'assistance.

<Pitfall>

Avec [le rendu côté serveur](/reference/react-dom/server), **`useId` requiert une arborescence de composants identique sur le serveur et sur le client**. Si les arborescences que vous rendez sur le serveur et sur le client ne correspondent pas exactement, les identifiants générés ne correspondront donc pas.

</Pitfall>

<DeepDive>

#### Pourquoi utiliser useId plutôt qu'un compteur incrémental ? {/*why-is-useid-better-than-an-incrementing-counter*/}

Vous vous demandez peut-être pour quelle raison il vaut mieux utiliser `useId` plutôt que d'incrémenter une variable globale comme `nextId++`.

Le principal avantage de `useId` est que React s'assure de son bon fonctionnement avec [le rendu serveur.](/reference/react-dom/server) Lors du rendu serveur, vos composants génèrent une sortie HTML. Plus tard, sur le client, le processus d'[hydratation](/reference/react-dom/client/hydrateRoot) attache vos gestionnaires d'événements au HTML généré. Pour que l'hydratation fonctionne, la sortie du client doit correspondre au HTML du serveur.

Il est très difficile de garantir cela avec un compteur incrémentiel, car l'ordre dans lequel les composants du client sont hydratés peut ne pas correspondre à l'ordre dans lequel le code HTML du serveur a été émis. En appelant `useId`, vous vous assurez que l'hydratation fonctionnera et que la sortie correspondra entre le serveur et le client.

Dans React, `useId` est généré à partir du "chemin parent" du composant appelant. C'est pourquoi, si l'arbre du client et celui du serveur sont identiques, le "chemin parent" correspondra quel que soit l'ordre de rendu.

</DeepDive>

---

### Générer des identifiants pour plusieurs éléments liés {/*generating-ids-for-several-related-elements*/}

Si vous devez attribuer des identifiants à plusieurs éléments liés, vous pouvez appeler `useId` pour leur attribuer un préfixe commun :

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>Prénom :</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Nom de famille :</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

Cela permet d'éviter d'appeler `useId` pour chaque élément qui a besoin d'un identifiant unique.

---

### Préciser un préfixe partagé pour tous les identifiants générés {/*specifying-a-shared-prefix-for-all-generated-ids*/}

Si vous rendez plusieurs applications React indépendantes sur une même page, passez `identifierPrefix` comme option à vos appels [`createRoot`](/reference/react-dom/client/createRoot#parameters) ou [`hydrateRoot`](/reference/react-dom/client/hydrateRoot). Cela garantira que les identifiants générés par les deux applications distinctes ne seront jamais en conflit, car chaque identifiant généré avec `useId` commencera par le préfixe distinct que vous avez spécifié.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>Mon app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Identifiant généré :', passwordHintId)
  return (
    <>
      <label>
        Mot de passe :
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        Le mot de passe doit contenir au moins 18 caractères
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choisissez un mot de passe</h2>
      <PasswordField />
    </>
  );
}
```

```js index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>

