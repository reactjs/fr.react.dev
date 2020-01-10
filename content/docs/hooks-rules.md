---
id: hooks-rules
title: Les règles des Hooks
permalink: docs/hooks-rules.html
next: hooks-custom.html
prev: hooks-effect.html
---

Les *Hooks* sont arrivés avec React 16.8. Ils vous permettent de bénéficier d’un état local et d'autres fonctionnalités de React sans avoir à écrire une classe.

Les Hooks sont des fonctions JavaScript, mais vous devez suivre deux règles lorsque vous les utilisez. Nous mettons à votre disposition un [plugin de *linter*](https://www.npmjs.com/package/eslint-plugin-react-hooks) pour vérifier ces règles automatiquement :

### Appelez les Hooks uniquement au niveau racine {#only-call-hooks-at-the-top-level}

**N'appelez pas de Hooks à l'intérieur de boucles, de code conditionnel ou de fonctions imbriquées.** Au lieu de ça, utilisez seulement les Hooks au niveau racine de votre fonction React. En suivant cette règle, vous garantissez que les Hooks sont appelés dans le même ordre à chaque affichage du composant. C'est ce qui permet à React de garantir le bon état des Hooks entre plusieurs appels à `useState` et `useEffect`. (Si vous êtes curieux·se, nous expliquerons ça en détail [plus bas](#explanation).)

### Appelez les Hooks uniquement depuis des fonctions React {#only-call-hooks-from-react-functions}

**N'appelez pas les Hooks depuis des fonctions JavaScript classiques.** Vous pouvez en revanche :

* ✅ Appeler les Hooks depuis des fonctions composants React.
* ✅ Appeler les Hooks depuis des Hooks personnalisés (nous aborderons le sujet [dans la prochaine page](/docs/hooks-custom.html)).

En suivant cette règle, vous garantissez que toute la logique d’état d’un composant est clairement identifiable dans son code source.

## Plugin ESLint {#eslint-plugin}

Nous avons publié un plugin ESLint appelé [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) qui assure le respect de ces deux règles. Vous pouvez ajouter ce plugin à votre projet si vous souhaitez l'utiliser :

```bash
npm install eslint-plugin-react-hooks --save-dev
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
    "react-hooks/rules-of-hooks": "error", // Vérifie les règles des Hooks
    "react-hooks/exhaustive-deps": "warn"  // Vérifie les tableaux de dépendances
  }
}
```

Ce plugin est inclus par défaut dans Create React App[Create React App](/docs/create-a-new-react-app.html#create-react-app).

**Vous pouvez maintenant passer directement à la prochaine page, qui explique comment écrire [vos propres Hooks](/docs/hooks-custom.html).** Dans cette page, nous allons maintenant expliquer le raisonnement qui se cache derrière ces règles.

## Explications {#explanation}

Comme nous l'avons [appris plus tôt](/docs/hooks-state.html#tip-using-multiple-state-variables), nous pouvons utiliser plusieurs Hooks *State* ou *Effect* au sein d'un même composant :

```js
function Form() {
  // 1. Utilise la variable d'état name
  const [name, setName] = useState('Mary');

  // 2. Utilise un effet pour persister le formulaire
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

Alors, comment React sait-il quel état correspond à quel appel à `useState` ? Réponse : **React se repose sur l'ordre dans lequel les Hooks sont appelés**. Notre exemple fonctionne car l'ordre d'appel des Hooks est le même à chaque affichage :

```js
// ------------
// Premier affichage
// ------------
useState('Mary')           // 1. Initialise la variable d'état name avec 'Mary'
useEffect(persistForm)     // 2. Ajoute un effet pour persister le formulaire
useState('Poppins')        // 3. Initialise la variable d'état surname avec 'Poppins'
useEffect(updateTitle)     // 4. Ajoute un effet pour mettre à jour le titre

// -------------
// Deuxième affichage
// -------------
useState('Mary')           // 1. Lit la variable d'état name (l'argument est ignoré)
useEffect(persistForm)     // 2. Remplace l'effet pour persister le formulaire
useState('Poppins')        // 3. Lit la variable d'état surname (l'argument est ignoré)
useEffect(updateTitle)     // 4. Remplace l'effet pour mettre à jour le titre

// ...
```

Tant que l'ordre d'appel aux Hooks est le même d’un affichage à l’autre, React peut associer un état local à chacun d'entre eux. Mais que se passerait-il si nous appelions un Hook (par exemple, l'effet `persistForm`) de façon conditionnelle ?

```js
  // 🔴 Nous enfreignons la première règle en utilisant un Hook de façon conditionnelle
  if (name !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }
```

La condition `name !== ''` est vraie au premier affichage, donc nous exécutons ce Hook. Cependant, lors du prochain affichage l'utilisateur risque de vider le formulaire, ce qui invalidera la condition. À présent que nous sautons ce Hook lors de l’affichage, l'ordre d'appel aux Hooks devient différent :

```js
useState('Mary')           // 1. Lit la variable d'état name (l'argument est ignoré)
// useEffect(persistForm)  // 🔴 Ce Hook n'a pas été appelé !
useState('Poppins')        // 🔴 2. (mais était 3). Échoue à lire la variable d'état surname
useEffect(updateTitle)     // 🔴 3. (mais était 4). Échoue à remplacer de l'effet
```

React ne saurait pas quoi renvoyer lors du second appel au Hook `useState`. React s'attendait à ce que le deuxième appel à un Hook dans ce composant corresponde à l'effet `persistForm`, comme lors de l’affichage précédent, mais ce n'est plus le cas. A partir de là, chaque appel à un Hook ultérieur à celui que nous avons sauté sera aussi décalé de un, provoquant des bugs.

**C'est pourquoi les Hooks doivent être appelés au niveau racine de vos composants.** Si vous voulez exécuter un effet de manière conditionnelle, vous pouvez mettre cette condition *à l'intérieur* de votre Hook :

```js
  useEffect(function persistForm() {
    // 👍 Nous n’enfreignons plus la première règle
    if (name !== '') {
      localStorage.setItem('formData', name);
    }
  });
```

**Remarquez que vous n’avez pas à vous inquiéter de ça si vous utilisez [le plugin de *linter* fourni](https://www.npmjs.com/package/eslint-plugin-react-hooks).** Mais maintenant, vous savez *pourquoi* les Hooks fonctionnent de cette manière et quels problèmes ces règles évitent.

## Prochaines étapes {#next-steps}

Enfin, nous sommes prêts pour apprendre à [écrire nos propres Hooks](/docs/hooks-custom.html) ! Les Hooks personnalisés vous permettent de combiner les Hooks fournis par React pour créer vos propres abstractions et réutiliser une logique d’état commune dans différents composants.
