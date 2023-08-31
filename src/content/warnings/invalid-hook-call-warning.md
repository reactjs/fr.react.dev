---
title: Les Règles des Hooks
---

Vous êtes probablement ici parce que vous avez reçu ce message d'erreur :

<ConsoleBlock level="error">

Hooks can only be called inside the body of a function component.

</ConsoleBlock>

*(« Les Hooks ne peuvent être appelés que depuis le corps immédiat d'une fonction composant », NdT)*

Il y a trois raisons habituelles derrière  cette erreur :

1. Vous avez peut-être **enfreint les Règles des Hooks**.
2. Vous avez peut-être des **versions disparates** de React et React DOM.
3. Vous avez peut-être **plus d'un exemplaire de React** dans la même appli.

Passons-les en revue.

## Enfreindre les Règles des Hooks {/*breaking-rules-of-hooks*/}

Les fonctions dont les noms commencent par `use` sont appelées [*Hooks*](/reference/react) en React.

**N'appelez pas des Hooks au sein de boucles, de conditions ou de fonctions imbriquées.**  Utilisez toujours les Hooks au niveau racine de vos fonctions React, avant tout `return` anticipé.  Vous ne pouvez appelez des Hooks que pendant que React fait le rendu d'une fonction composant :

* ✅ Appelez-les au niveau racine du corps d'une [fonction composant](/learn/your-first-component).
* ✅ Appelez-les au niveau racine du corps d'un [Hook personnalisé](/learn/reusing-logic-with-custom-hooks).

```js{2-3,8-9}
function Counter() {
  // ✅ Correct : niveau racine d’une fonction composant
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Correct : niveau racine d’un Hook personnalisé
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

Vous **ne pouvez pas** appeler des Hooks (des fonctions démarrant par `use`) dans quelque autre cas que ce soit, par exemple :

* 🔴 N'appelez pas de Hooks dans des conditions ou boucles.
* 🔴 N'appelez pas de Hooks après une instruction `return` conditionnelle.
* 🔴 N'appelez pas de Hooks dans des gestionnaires d'événements.
* 🔴 N'appelez pas de Hooks dans des composants à base de classes.
* 🔴 N'appelez pas de Hooks dans des fonctions passées à `useMemo`, `useReducer` ou `useEffect`.

Si vous enfreignez ces règles, vous verrez sans doute cette erreur.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Erroné : dans une condition (sortez-en l’appel !)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Erroné : dans une boucle (sortez-en l’appel !)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Erroné : après un `return` conditionnel (déplacez l’appel avant !)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Erroné : dans un gestionnaire d’événement (sortez-en l’appel !)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Erroné : dans `useMemo` (sortez-en l’appel !)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Erroné : dans un composant à base de classe (utilisez une fonction composant !)
    useEffect(() => {})
    // ...
  }
}
```

Vous pouvez utiliser le [plugin `eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) pour détecter ces erreurs.

<Note>

[Les Hooks personnalisés](/learn/reusing-logic-with-custom-hooks) *peuvent* appeler d'autres Hooks (c'est leur raison d'être).  Ça fonctionne parce que les Hooks personnalisés sont eux-mêmes supposés n'être appelés que pendant le rendu d'une fonction composant.

</Note>

## Versions disparates de React et React DOM {/*mismatching-versions-of-react-and-react-dom*/}

Vous utilisez peut-être une version de `react-dom` (< 16.8.0) ou de `react-native` (< 0.59) qui ne prend pas encore en charge les Hooks. Vous pouvez exécuter `npm ls react-dom` ou `npm ls react-native` dans le dossier de votre application pour vérifier la version que vous utilisez.  Si vous en trouvez plus d'une, ça peut aussi créer des problèmes (on en reparle juste en-dessous).

## Multiples copies de React {/*duplicate-react*/}

Pour que les Hooks fonctionnent, l'import de `react` dans votre code applicatif doit amener au même module que l'import de `react` depuis le module `react-dom`.

Si ces imports de `react` amènent à des objets d'export distincts, vous verrez cet avertissement.  Ça peut arriver quand vous **vous retrouvez par inadvertance avec deux copies** du module `react`.

Si vous utilisez Node pour gérer vos modules, vous pouvez lancer la vérification suivante depuis le dossier de votre projet :

<TerminalBlock>

npm ls react

</TerminalBlock>

Si vous voyez plus d'un React, vous devrez déterminer d'où ça vient et corriger votre arbre de dépendances.  Peut-être par exemple qu'une bibliothèque que vous utilisez spécifie à tort `react` comme dépendance (plutôt que comme dépendance sur module pair *(peer dependency, NdT)*).  Tant que cette bibliothèque ne sera pas corrigée, un contournement possible consiste à utiliser les [résolutions Yarn](https://yarnpkg.com/configuration/manifest#resolutions).

Vous pouvez aussi tenter de déboguer le problème en ajoutant des logs à des endroits stratégiques et en redémarrant votre serveur de développement :

```js
// Ajoutez ça dans node_modules/react-dom/index.js
window.React1 = require('react');

// Ajoutez ça dans votre code applicatif
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

Si ça affiche `false` alors vous avez probablement deux Reacts et devez en déterminer la cause. [Ce ticket](https://github.com/facebook/react/issues/13991) détaille quelques raisons rencontrées par la communauté.

Ce problème peut aussi survenir lorsque vous utilisez `npm link` ou un équivalent. Dans un tel cas, votre *bundler* pourrait « voir » deux Reacts — un dans votre dossier applicatif et un dans votre dossier de bibliothèque.  En supposant que `myapp` et `mylib` sont des dossiers de même niveau, un correctif possible consiste à exécuter `npm link ../myapp/node_modules/react` depuis `mylib`. Ça devrait faire en sorte que la bibliothèque utilise bien la copie de React du dossier applicatif.

<Note>

En général, React prend en charge plusieurs copies indépendantes sur une même page (si par exemple une appli et un widget tiers s'en servent tous les deux).  Ça ne pose problème que si `require('react')` ou `import from 'react'` résolvent différemment entre un composant et la copie de `react-dom` qui assure son rendu.

</Note>

## Autres causes {/*other-causes*/}

Si rien de tout ça n'a résolu le souci, merci d'ajouter un commentaire à [ce ticket](https://github.com/facebook/react/issues/13991), nous essaierons de vous aider. Essayez de créer un cas minimal reproductible pour appuyer votre demande — vous pourriez d'ailleurs trouver l'origine du problème à cette occasion.
