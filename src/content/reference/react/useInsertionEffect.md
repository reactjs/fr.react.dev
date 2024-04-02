---
title: useInsertionEffect
---

<Pitfall>

`useInsertionEffect` s'adresse aux auteurs de bibliothèques de CSS-en-JS. À moins que vous ne travailliez sur une bibliothèque de CSS-en-JS et ayez besoin d'injecter des styles, vous voudrez probablement utiliser plutôt [`useEffect`](/reference/react/useEffect) ou [`useLayoutEffect`](/reference/react/useLayoutEffect).

</Pitfall>

<Intro>

`useInsertionEffect` permet l'insertion d'éléments dans le DOM avant que les Effets de mise en page ne soient déclenchés.

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Appelez `useInsertionEffect` pour insérer des styles avant que des Effets ayant besoin de consulter la mise en page soient déclenchés :

```js
import { useInsertionEffect } from 'react';

// Dans votre bibliothèque de CSS-en-JS
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... injectez des balises <style> ici ...
  });
  return rule;
}
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `setup` : la fonction contenant la logique de votre Effet.  Votre fonction de mise en place peut par ailleurs renvoyer une fonction de *nettoyage*.  Quand votre composant sera ajouté au DOM, mais avant le déclenchement des Effets de mise en page, React exécutera votre fonction de mise en place.  Après chaque nouveau rendu dont les dépendances ont changé, React commencera par exécuter votre fonction de nettoyage (si vous en avez fourni une) avec les anciennes valeurs, puis exécutera votre fonction de mise en place avec les nouvelles valeurs.  Une fois votre composant retiré du DOM, React exécutera votre fonction de nettoyage une dernière fois.

* `dependencies` **optionnelles** : la liste des valeurs réactives référencées par le code de `setup`.  Les valeurs réactives comprennent les props, les variables d'état et toutes les variables et fonctions déclarées localement dans le corps de votre composant.  Si votre *linter* est [configuré pour React](/learn/editor-setup#linting), il vérifiera que chaque valeur réactive concernée est bien spécifiée comme dépendance.  La liste des dépendances doit avoir un nombre constant d'éléments et utiliser un littéral défini à la volée, du genre `[dep1, dep2, dep3]`. React comparera chaque dépendance à sa valeur précédente au moyen de la comparaison [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is).  Si vous omettez cet argument, votre Effet sera re-exécuté après chaque rendu du composant.

#### Valeur renvoyée {/*returns*/}

`useInsertionEffect` renvoie `undefined`.

#### Limitations {/*caveats*/}

* Les Effets ne sont exécutés que côté client.  Ils sont ignorés lors du rendu côté serveur.
* Vous ne pouvez pas mettre à jour l'état au sein de `useInsertionEffect`.
* Au moment où `useInsertionEffect` est exécuté, les refs ne sont pas encore associées.
* `useInsertionEffect` est susceptible d'exécuter votre code avant ou après que le DOM a été mis à jour. Vous ne devriez pas vous baser sur une chronologie spécifique de mise à jour du DOM.
* Contrairement aux autres types d'Effets, qui exécutent leurs nettoyages pour chaque Effet puis les mises en place pour chaque Effet, `useInsertionEffect` exécutera en séquence le nettoyage et la mise en place un composant à la fois.  Ça entraîne donc un « entrelacement » des exécutions de nettoyage et de mise en place.

---

## Utilisation {/*usage*/}

### Injecter des styles dynamiques depuis des bibliothèques de CSS-en-JS {/*injecting-dynamic-styles-from-css-in-js-libraries*/}

D'habitude, vous styleriez vos composants React avec du CSS normal.

```js
// Dans votre fichier JS :
<button className="success" />

// Dans votre fichier CSS :
.success { color: green; }
```

Certaines équipes préfèrent gérer les styles directement dans le code JavaScript, plutôt que de recourir à des fichiers CSS.  Ça nécessite habituellement une bibliothèque de CSS-en-JS ou un outil.  On recense trois approches fréquentes pour du CSS-en-JS :

1. L'extraction statique de fichiers CSS par un compilateur
2. Les styles en ligne, par exemple `<div style={{ opacity: 1 }}>`
3. L'injection à l'exécution de balises `<style>`

Si vous utilisez du CSS-en-JS, nous vous recommandons de combiner les deux premières approches (les fichiers CSS pour les styles statiques, et les styles en ligne pour les styles dynamiques). **Nous ne recommandons pas l'injection à l'exécution de balise `<style>` pour deux raisons :**

1. L'injection à l'exécution force le navigateur à recalculer les styles beaucoup plus souvent.
2. L'injection à l'exécution peut être très lente si elle survient au mauvais moment du cycle de vie de React.

Le premier problème est incontournable, mais `useInsertionEffect` vous aide à résoudre le second.

Appelez `useInsertionEffect` pour insérer des styles avant que les Effets de mise en page soient déclenchés :

```js {4-11}
// Dans votre bibliothèque de CSS-en-JS
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // Comme expliqué plus haut, nous ne recommandons pas l'injection à l'exécution de balise <style>.
    // Mais si vous devez absolument le faire, alors il est important de le faire dans un
    // useInsertionEffect.
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

Tout comme `useEffect`, `useInsertionEffect` est ignoré côté serveur. Si vous avez besoin de collecter les règles CSS utilisées côté serveur, vous pouvez le faire durant le rendu :

```js {1,4-6}
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // ...
  });
  return rule;
}
```

[Apprenez-en davantage sur la mise à jour des bibliothèques de CSS-en-JS faisant de l'injection à l'exécution pour tirer parti de `useInsertionEffect`.](https://github.com/reactwg/react-18/discussions/110)

<DeepDive>

#### En quoi est-ce préférable à l'injection de styles durant le rendu ou à `useLayoutEffect` ? {/*how-is-this-better-than-injecting-styles-during-rendering-or-uselayouteffect*/}

Si vous insérez des styles pendant le rendu et que React traite une [mise à jour non bloquante](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition), le navigateur recalculera les styles à chaque étape du rendu de l'arborescence de composants, ce qui peut être **extrêmement lent**.

`useInsertionEffect` est préférable à l'insertion de styles dans [`useLayoutEffect`](/reference/react/useLayoutEffect) ou [`useEffect`](/reference/react/useEffect) parce qu'il garantit qu'au moment de l'exécution des autres Effets de vos composants, les balises `<style>`  auront déjà été insérées.  Faute de ça, les calculs de mise en page au sein d'Effets classiques seraient erronés en raison de styles obsolètes.

</DeepDive>
