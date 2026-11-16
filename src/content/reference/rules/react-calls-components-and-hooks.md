---
title: React appelle les composants et les Hooks
---

<Intro>

React s'occupe de réaliser le rendu des composants et des Hooks lorsque c'est nécessaire, afin d'optimiser l'expérience utilisateur. C'est une approche déclarative : vous dites à React quel rendu effectuer dans la logique de votre composant, et React déterminera comment réaliser au mieux l'affichage pour l'utilisateur.

</Intro>

<InlineToc />

---

## N'appelez jamais les fonctions composants directement {/*never-call-component-functions-directly*/}

Les composants ne devraient être utilisés que dans du JSX. Ne les appelez pas en tant que fonctions classiques. C'est à React de les appeler.

C'est à React de décider quand appeler votre fonction composant [lors du rendu](/reference/rules/components-and-hooks-must-be-pure#how-does-react-run-your-code). En React, vous utilisez pour ça la syntaxe JSX.

```js {2}
function BlogPost() {
  return <Layout><Article /></Layout>; // ✅ Correct : composants utilisés seulement par JSX
}
```

```js {expectedErrors: {'react-compiler': [2]}} {2}
function BlogPost() {
  return <Layout>{Article()}</Layout>; // 🔴 Incorrect : ne les appelez jamais directement
}
```

Si un composant contient des Hooks, il est aisé d'enfreindre les [Règles des Hooks](/reference/rules/rules-of-hooks) lorsque les composants sont appelés directement au sein de boucles ou de conditions.

Le fait de laisser React orchestrer le rendu offre de nombreux avantages :

* **Les composants deviennent plus que de simples fonctions.** React peut leur ajouter des fonctionnalités telles que _l'état local_ au moyen de Hooks associés à l'identité du composant dans l'arbre.
* **Les types des composants participent à la réconciliation.** En laissant React appeler vos composants, vous lui en dites plus sur la structure sémantique de votre arbre. Par exemple, lorsque vous passez du rendu d'un `<Feed>` à celui d'une page `<Profile>`, React ne risque pas de mélanger leurs données sous-jacentes.
* **React peut améliorer l'expérience utilisateur.** Il peut par exemple laisser le navigateur traiter certaines tâches entre les appels des composants, afin que le rendu d'un énorme arbre de composants ne bloque pas le *thread* principal.
* **Le débogage est facilité.** Si les composants sont des citoyens de plein droit connus de la bibliothèque, nous pouvons construire un outillage développeur·ses avancé pour les examiner lors du développement.
* **La réconciliation est plus efficace.** React peut déterminer précisément quels composants dans l'arbre ont besoin d'un nouveau rendu, ainsi que ceux qui peuvent être laissés tels quels. Ça aide à rendre votre appli plus rapide et réactive.

---

## Ne passez jamais des Hooks comme des valeurs classiques {/*never-pass-around-hooks-as-regular-values*/}

Les Hooks ne devraient être appelés qu'au sein de composants. Évitez de les manipuler ou transmettre comme des valeurs classiques.

Les Hooks vous permettent d'ajouter des fonctionnalités React à un composant.  Ils devraient toujours être appelés en tant que fonctions, jamais traités comme des valeurs à transmettre. Ça permet un _raisonnement local_, c'est-à-dire que ça offre la possibilité pour les développeur·ses de comprendre l'entièreté d'un composant grâce à son seul code source.

Enfreindre cette règle empêchera React d'optimiser automatiquement votre composant.

### Ne modifiez pas dynamiquement un Hook {/*dont-dynamically-mutate-a-hook*/}

Les Hooks devraient être aussi « statiques » que possible.  Ça signifie que vous ne devriez pas les modifier dynamiquement.  Vous devriez par exemple éviter d'écrire des Hooks d'ordre supérieur :

```js {expectedErrors: {'react-compiler': [2, 3]}} {2}
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // 🔴 Déconseillé : évitez les Hooks d’ordre supérieur
  const data = useDataWithLogging();
}
```

Les Hooks devraient être immuables, et donc non modifiés.  Plutôt que de modifier dynamiquement un Hook, créez une version statique du Hook avec la fonctionnalité voulue.

```js {2,6}
function ChatInput() {
  const data = useDataWithLogging(); // ✅ Correct : utilise une nouvelle version du Hook
}

function useDataWithLogging() {
  // ... Crée une nouvelle version du Hook en intégrant directement la logique ici
}
```

### N'utilisez pas dynamiquement les Hooks {/*dont-dynamically-use-hooks*/}

Les Hooks ne devraient par ailluers pas être utilisés dynamique.  Disons par exemple que vous recouriez à l'injection de dépendance en passant un Hook à un composant sous forme de valeur :

```js {expectedErrors: {'react-compiler': [2]}} {2}
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // 🔴 Incorrect : ne passez pas les Hooks en props
}
```

Vous devriez toujours intégrer directement l'appel au Hook dans votre composant, et y traiter la logique associée.

```js {6}
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging(); // ✅ Correct : utilise le Hook directement
}

function useDataWithLogging() {
  // Si une logique conditionnelle modifie le comportement du Hook, elle devrait être intégrée
  // directement dans le Hook.
}
```

De cette façon, il est bien plus facile de comprendre et déboguer `<Button />`.  Lorsque les Hooks sont utilisés de façon dynamique, ça augmente significativement la complexité de votre appli et empêche le raisonnement local, ce qui réduit sur le long terme la productivité de votre équipe.  Ça augmente aussi le risque d'enfreindre par inadvertance les [Règles des Hooks](/reference/rules/rules-of-hooks), qui dictent qu'un Hook ne doit jamais être appelé conditionnellement. Si vous vous retrouvez à devoir *mocker* des composants pour vos tests, il vaut mieux *mocker* le serveur pour qu'il réponde avec des données prédéfinies.  Lorsque c'est possible, il est généralement plus efficace de tester votre appli au moyen de tests *end-to-end* (E2E).
