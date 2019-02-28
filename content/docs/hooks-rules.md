---
id: hooks-rules
title: Les règles des Hooks
permalink: docs/hooks-rules.html
next: hooks-custom.html
prev: hooks-effect.html
---

Les *Hooks* sont arrivés avec React 16.8. Ils vous permettent de bénéficier d’un état local et d'autres fonctionnalités de React sans avoir à écrire une classe.

Les Hooks sont des fonctions JavaScript, mais vous devez suivre deux règles lorsque vous les utilisez. Nous mettons à votre disposition un [plugin de *linter*](https://www.npmjs.com/package/eslint-plugin-react-hooks) pour vérifier ces règles automatiquement :

### Appelez les Hooks uniquement au niveau racine {#only-call-hooks-at-the-top-level}

**N'appelez pas de Hooks à l'intérieur de boucles, conditions ou de fonctions imbriquées.** À la place, utilisez seulement les Hooks au premier niveau de votre fonction React. En suivant cette règle, vous assurez que les Hooks sont appelés dans le même ordre à chaque fois que le composant est rendu. C'est ce qui permet à React de garantir le bon état des Hooks entre plusieurs appels de `useState` et `useEffect`. (Si vous êtes curieux, nous expliquerons cela en détails [ci-dessous](#explanation).)

### Appelez les Hooks uniquement depuis des fonctions React {#only-call-hooks-from-react-functions}

**N'appelez pas les Hooks depuis des fonctions JavaScript classiques.** À la place, vous pouvez :

* ✅ Appeler les Hooks depuis des fonctions composants React.
* ✅ Appeler les Hooks depuis des Hooks personnalisés (nous aborderons le sujet [à la page suivante](/docs/hooks-custom.html)).

En suivant cette règle, vous assurez que toute la logique à états dans un composant est clairement visible depuis ses sources.

## Plugin linter {#eslint-plugin}

Nous avons publié un plugin ESLint appelé [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) qui assure le respect de ces deux règles. Vous pouvez ajouter ce plugin à votre projet si vous souhaitez l'utiliser :

```bash
npm install eslint-plugin-react-hooks
```

```js
// Votre configuration ESLint
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error"
  }
}
```

Dans le futur, nous avons l'intention d'inclure ce plugin par défaut dans Create React App et d'autres boîtes à outils similaires.

**Vous pouvez maintenant passer à la page expliquant comment écrire [vos propres Hooks](/docs/hooks-custom.html).** Sur cette page, nous allons continuer à expliquer le raisonnement qui se cache derrière ces règles.

## Explications {#explanation}

Comme nous l'avons [appris plus tôt](/docs/hooks-state.html#tip-using-multiple-state-variables), nous pouvons utiliser plusieurs Hooks State ou Effect au sein d'un même composant :

```js
function Form() {
  // 1. Utilise la variable d'état name
  const [name, setName] = useState('Mary');

  // 2. Utilise un effect pour conserver le formulaire
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. Utilise la variable d'état surname
  const [surname, setSurname] = useState('Poppins');

  // 4. Utilise un effet pour mettre à jour le titre
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
```

Alors, comment React sait quel état correspond à quel `useState`? La réponse est que **React repose sur l'ordre dans lequel les Hooks sont appelés**. Notre exemple fonctionne car l'ordre d'appel des Hooks est le même à chaque rendu :

```js
// ------------
// First render
// ------------
useState('Mary')           // 1. Initialise la variable d'état name avec 'Mary'
useEffect(persistForm)     // 2. Ajoute un effet pour conserver le formulaire
useState('Poppins')        // 3. Initialise la variable d'état surname avec 'Poppins'
useEffect(updateTitle)     // 4. Ajoute un effet pour mettre à jour le titre

// -------------
// Second render
// -------------
useState('Mary')           // 1. Lit la variable d'état name (l'argument est ignoré)
useEffect(persistForm)     // 2. Remplace l'effet pour conserver le formulaire
useState('Poppins')        // 3. Lit la variable d'état surname (l'argument est ignoré)
useEffect(updateTitle)     // 4. Remplace l'effet pour mettre à jour le titre

// ...
```

Tant que l'ordre d'appel aux Hooks est le même entre chaque rendu, React peut associer un état local à chacun d'entre eux. Mais que se passe-t-il si nous appelons un Hook (par exemple, l'effet `persistForm`) dans une condition ?

```js
  // 🔴 Nous brisons la règle en utilisant un Hook dans une condition
  if (name !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }
```

La condition `name !== ''` est `true` au premier rendu, donc nous exécutons le Hook. Cependant, lors du prochain rendu l'utilisateur pourrait vider le formulaire, ce qui aura pour effet de rendre la condition `false`. Maintenant que nous passons ce Hook lors du rendu, l'ordre d'appel aux Hooks devient différent :

```js
useState('Mary')           // 1. Lit la variable d'état name (l'argument est ignoré)
// useEffect(persistForm)  // 🔴 Le Hook n'a pas été appelé !
useState('Poppins')        // 🔴 2 (mais était 3). Échoue lors de la lecture de la variable d'état surname
useEffect(updateTitle)     // 🔴 3 (mais était 4). Échoue lors du remplacement de l'effet
```

React ne saurait quoi retourner lors du second appel au Hook `useState`. React s'attend à ce que le second appel à un Hook dans ce composant corresponde à l'effet `persistForm`, comme lors du rendu précédent, mais ce n'est plus le cas. A partir de là, chaque nouvel appel à un Hook suivant celui que nous avons passé, sera aussi décalé de un, provocant ainsi des bugs.

**C'est pourquoi les Hooks doivent être appelé au premier niveau de vos composants.** Si vous voulez exécuter un effet de manière conditionelle, vous pouvez mettre cette condition *à l'intérieur* de votre Hook :

```js
  useEffect(function persistForm() {
    // 👍 Nous ne brisons plus la première règle
    if (name !== '') {
      localStorage.setItem('formData', name);
    }
  });
```

**Notez que vous ne devez pas vous inquiéter de ce problème si vous utilisez [la règle de lint fournie](https://www.npmjs.com/package/eslint-plugin-react-hooks).** Mais maintenant vous savez *pourquoi* les Hooks fonctionnent de cette manière et quels problèmes prévient la règle.

## Prochaines étapes {#next-steps}

Enfin, nous sommes prêt à apprendre à [écrire nos propres Hooks](/docs/hooks-custom.html) ! Les Hooks personnalisés vous permettent de combiner les Hooks fournis par React dans vos propres abstractions et réutiliser la logique à états commune à vos différents composants.
