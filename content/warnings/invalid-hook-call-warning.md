---
title: "Avertissement : invalid Hook call"
layout: single
permalink: warnings/invalid-hook-call-warning.html
---

Appel de Hook invalide

Vous êtes probablement sur cette page parce que vous avez reçu ce message d’erreur :

> *Hooks can only be called inside the body of a function component.*
>
> Les Hooks ne peuvent être appelés que dans le corps d’une fonction composant

Il y a trois situations courantes qui déclenchent cet avertissement :

1. Vous avez peut-être **des versions désynchronisées** de React et React DOM.
2. Vous **enfreignez peut-être les [règles des Hooks](/docs/hooks-rules.html)**.
3. Vous avez peut-être **plus d’une copie de React** dans la même appli.

Examinons chaque cas séparément.

## Versions désynchronisées de React et React DOM {#mismatching-versions-of-react-and-react-dom}

Vous utilisez peut-être une version de `react-dom` (< 16.8.0) ou de `react-native` (< 0.59) qui ne prend pas encore en charge les Hooks.  Vous pouvez exécuter `npm ls react-dom` ou `npm ls react-native` dans le dossier de votre application pour vérifier quelle version vous utilisez.  Si vous en trouvez plus d’une, ça peut aussi être une source de problème (nous y revenons plus bas).

## Enfreindre les règles des Hooks {#breaking-the-rules-of-hooks}

Vous ne pouvez appeler des Hooks que **pendant que React fait le rendu d’une fonction composant** :

* ✅ Appelez-les au niveau racine du corps de la fonction composant.
* ✅ Appelez-les au niveau racine du corps d’un [Hook personnalisé](/docs/hooks-custom.html).

**Vous pouvez en apprendre davantage à ce sujet dans les [règles des Hooks](/docs/hooks-rules.html).**

```js{2-3,8-9}
function Counter() {
  // ✅ Bien : niveau racine d’une fonction composant
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Bien : niveau racine d’un Hook personnalisé
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

Pour éviter des comportements déroutants, l’appel de Hooks n’est **pas** autorisé dans les autres cas :

* 🔴 N’appelez pas de Hooks dans les composants à base de classes.
* 🔴 N’appelez pas de Hooks dans les gestionnaires d’événements.
* 🔴 N’appelez pas de Hooks dans les fonctions passées à `useMemo`, `useReducer`, ou `useEffect`.

Si vous enfreignez ces règles, vous verrez peut-être cette erreur.

```js{3-4,11-12,20-21}
function Bad1() {
  function handleClick() {
    // 🔴 Erroné : dans un gestionnaire d’événements (sortez-en pour corriger !)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad2() {
  const style = useMemo(() => {
    // 🔴 Erroné : dans useMemo (sortez-en pour corriger !)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad3 extends React.Component {
  render() {
    // 🔴 Erroné : dans un composant à base de classe
    useEffect(() => {})
    // ...
  }
}
```

Vous pouvez utiliser le [plugin `eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) pour détecter certains de ces cas en amont.

>Remarque
>
>[Les Hooks personnalisés](/docs/hooks-custom.html) *peuvent* appeler d’autres Hooks (c’est leur raison d’être).  Ça fonctionne parce que les Hooks personnalisés ne peuvent eux-même être appelés que pendant le rendu d’une fonction composant.

## Copies multiples de React {#duplicate-react}

Pour que les Hooks fonctionnent, l’import `react` de votre code applicatif doit résoudre vers le même module que l’import `react` effectué par le module `react-dom`.

Si ces deux imports amènent à des objets d’export distincts, vous obtiendrez cet avertissement.  Ça peut arriver si vous **vous retrouvez accidentellement avec deux copies** du module `react`.

Si vous utilisez Node pour votre gestion de modules, vous pouvez vérifier ce qu’il en est dans votre dossier de projet :

    npm ls react

Si vous voyez plus d’un React, il vous faudra comprendre la raison de ce doublon, et corriger votre arbre de dépendances.  Par exemple, peut-être qu’une bibliothèque déclare à tort `react` comme une dépendance (au lieu d’une dépendance sur module pair, *peer dependency*).  Tant que cette bibliothèque ne sera pas corrigée, les [résolutions Yarn](https://yarnpkg.com/fr/docs/selective-version-resolutions) peuvent vous aider à contourner le problème.

Vous pouvez aussi tenter de déboguer ce problème en ajoutant quelques logs et en redémarrant votre serveur de développement :

```js
// Ajoutez ça dans node_modules/react-dom/index.js
window.React1 = require('react');

// Ajoutez ça dans votre fichier de composant
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

Si ça affiche `false`, vous avez sans doute deux React et devez comprendre l’origine du problème. [Cette *issue*](https://github.com/facebook/react/issues/13991) liste quelques raisons fréquentes que la communauté a identifiées.

Ce problème peut aussi survenir quand vous utilisez `npm link` ou un équivalent.  Dans ce cas, votre *bundler* risque de « voir » deux React—un dans le dossier applicatif et un dans votre dossier bibliothèque.  Si on suppose que `myapp` et `mylib` sont deux dossiers voisins, un correctif possible consisterait à exécuter `npm link ../myapp/node_modules/react` depuis le dossier `mylib`.  Ça devrait permettre à la bibliothèque d’utiliser la copie de React présente dans l’application.

>Remarque
>
>De façon générale, React autorise des copies multiples sur une même page (par exemple, si une appli et un élément d'interface tiers l’utilisent tous les deux).  Ça ne casse que si `require('react')` résoud différemment entre le composant et la copie de `react-dom` qui a effectué son rendu.

## Autres raisons {#other-causes}

Si rien de tout ça n’a marché, merci d’ajouter un commentaire dans [cette *issue*](https://github.com/facebook/react/issues/13991) : nous essaierons alors de vous aider. L’idéal serait que vous créiez une reproduction minimaliste du problème, accessible en ligne ; vous trouverez peut-être la solution à cette occasion.
