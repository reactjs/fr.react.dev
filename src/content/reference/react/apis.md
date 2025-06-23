---
title: "API React intégrées"
---

<Intro>

En plus des [Hooks](/reference/react) et des [composants](/reference/react/components), le module `react` exporte également d'autres API utiles pour la définition des composants. Cette page répertorie toutes les autres API React modernes.


</Intro>

---

<<<<<<< HEAD
- [`createContext`](/reference/react/createContext) vous permet de définir et de fournir un contexte aux composants enfants. Utilisé conjointement avec [`useContext`](/reference/react/useContext).
- [`forwardRef`](/reference/react/forwardRef) permet à votre composant d'exposer un nœud DOM en tant que référence (ref) à son parent. Utilisé conjointement avec [`useRef`](/reference/react/useRef).
- [`lazy`](/reference/react/lazy) vous permet de différer le chargement du code d'un composant jusqu'à ce qu'il soit rendu pour la première fois.
- [`memo`](/reference/react/memo) permet à votre composant d'éviter de recalculer son rendu quand ses props n'ont pas changé. Utilisé conjointement avec [`useMemo`](/reference/react/useMemo) et [`useCallback`](/reference/react/useCallback).
- [`startTransition`](/reference/react/startTransition) vous permet de marquer une mise à jour d'état comme non urgente. Similaire à [`useTransition`](/reference/react/useTransition).
* [`act`](/reference/react/act) vous permet d'enrober le rendu et les interactions lors de tests pour garantir que les mises à jour ont été traitées avant d'exécuter vos assertions.
=======
* [`createContext`](/reference/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/reference/react/useContext)
* [`lazy`](/reference/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
* [`memo`](/reference/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/reference/react/useMemo) and [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/reference/react/useTransition)
* [`act`](/reference/react/act) lets you wrap renders and interactions in tests to ensure updates have processed before making assertions.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

---

## API de gestion des ressources {/*resource-apis*/}

Un composant peut accéder à des *ressources* sans qu'elles fassent partie de son état. Un composant peut par exemple lire un message depuis une promesse, ou lire des informations de styles depuis un contexte.

Pour lire une valeur depuis une ressource, utilisez cette fonction :

- [`use`](/reference/react/use) vous permet de lire une valeur depuis une ressource telle qu'une [promesse](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) (`Promise`) ou un [contexte](/learn/passing-data-deeply-with-context).

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```
