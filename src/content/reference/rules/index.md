---
title: Les règles de React
---

<Intro>

Tout comme des langages de programmation distincts ont leurs propres manières d'exprimer des concepts, React a ses propres idiômes — ou règles — pour exprimer certaines approches de façon facile à comprendre, afin de produire des applications de grande qualité.

</Intro>

<InlineToc />

---

<Note>

Pour apprendre comment décrire des UI avec React, nous vous recommandons de lire [Penser en React](/learn/thinking-in-react).

</Note>

Cette section décrit les règles que vous devez suivre pour écrire du code React idiomatique.  Écrire du code React idiomatique vous aidera à construire des applications bien organisées, fiables et composables.  Ces propriétés améliorent la résilience aux chaangements de votre appli, et facilitent son sa maintenance par d'autres développeur·ses et son intégration avec des bibliothèques et outils tiers.

Ces règles sont connues sous le termes **Règles de React**. Ce sont bien des règles — et pas juste des recommandations — dans le sens où, si vous les enfreignez, votre appli aura sans doute des bugs.  Votre code deviendra non-idiomatique et plus difficile à comprendre et à modéliser mentalement.

Nous vous encourageons fortement à utiliser le [mode strict](/reference/react/StrictMode) ainsi que le [plugin ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks) de React pour vous aider à produire une base de code qui suive les Règles de React.  En suivant les Règles de React, vous détecterez et corrigerez ces bugs et obtiendrez une application plus maintenable.

---

## Les composants et les Hooks doivent être des fonctions pures {/*components-and-hooks-must-be-pure*/}

[La pureté des Composants et des Hooks](/reference/rules/components-and-hooks-must-be-pure) est une règle clé de React qui rend votre appli prévisible, facile à déboguer, et permet à React d'optimiser votre code.

* [Les composants doivent être idempotents](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent) – Les composants React sont supposés toujours renvoyer le même résultat pour les mêmes entrées – props, états locaux et contextes.
* [Les effets de bord doivent être exécutés hors du rendu](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) – Les effets de bord ne doivent pas être exécutés lors du rendu, afin que React puisse effectuer plusieurs fois le rendu de composants afin de créer la meilleure expérience utilisateur.
* [Les props et l'état sont immuables](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) – Les props et les états locaux d'un composant sont considérés comme des instantanés immuables au sein d'un même rendu.  Ne les modifiez jamais directement.
* [Les arguments des Hooks et leurs valeurs renvoyées sont immuables](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable) – Une fois que des valeurs sont passées à un Hook, vous ne devriez jamais les modifier.  Tout comme les props en JSX, ces valeurs deviennent immuables une fois passées à un Hook.
* [Les valeurs sont immuables une fois passées à JSX](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) – Ne modifiez pas des valeurs une fois que vous les avez utilisées dans du JSX.  Déplacez la mutation en amont, avant que le JSX soit créé.

---

## React appelle les composants et les Hooks {/*react-calls-components-and-hooks*/}

[React s'occupe de réaliser le rendu des composants et des Hooks lorsque c'est nécessaire, afin d'optimiser l'expérience utilisateur](/reference/rules/react-calls-components-and-hooks). C'est une approche déclarative : vous dites à React quel rendu effectuer dans la logique de votre composant, et React déterminera comment réaliser au mieux l'affichage pour l'utilisateur.

* [N'appelez jamais les fonctions composants directement](/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) – Les composants ne devraient être utilisés que dans du JSX. Ne les appelez pas en tant que fonctions classiques.
* [Ne passez jamais des Hooks comme des valeurs classiques](/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values) – Les Hooks ne devraient être appelés qu'au sein de composants. Ne les passez pas comme des valeurs classiques.

---

## Les règles des Hooks {/*rules-of-hooks*/}

Les Hooks sont définis au moyen de fonctions JavaScript, mais représentent un type spécifique de logique d'UI réutilisable, avec des restrictions sur leurs emplacements d'appel. Vous devez suivre les [Règles des Hooks](/reference/rules/rules-of-hooks) lorsque vous les employez.

* [N'appelez des Hooks qu'au niveau racine](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) – Ne les appelez pas dans des boucles, des conditions ou des fonctions imbriquées.  Utilisez plutôt toujours les Hooks au niveau racine de votre fonction React, avant d'éventuels retours anticipés.
* [N'appelez les Hooks que depuis des fonctions React](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) – N'appelez pas les Hooks depuis des fonctions JavaScript classiques.

