---
title: "API React intégrées"
---

<Intro>

<<<<<<< HEAD
En plus des [Hooks](/reference/react) et des [composants](/reference/react/components), le module `react` exporte également d'autres API utiles pour la définition des composants. Cette page répertorie toutes les autres API React modernes.

=======
In addition to [Hooks](/reference/react/hooks) and [Components](/reference/react/components), the `react` package exports a few other APIs that are useful for defining components. This page lists all the remaining modern React APIs.
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab

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
* [`cache`](/reference/react/cache) lets you cache the result of a data fetch or computation.
* [`cacheSignal`](/reference/react/cacheSignal) lets you know when the `cache()` lifetime is over.
* [`captureOwnerStack`](/reference/react/captureOwnerStack) reads the current Owner Stack in development and returns it as a string if available.
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab

---

## API de gestion des ressources {/*resource-apis*/}

Un composant peut accéder à des *ressources* sans qu'elles fassent partie de son état. Un composant peut par exemple lire un message depuis une promesse, ou lire des informations de styles depuis un contexte.

<<<<<<< HEAD
Pour lire une valeur depuis une ressource, utilisez cette fonction :

- [`use`](/reference/react/use) vous permet de lire une valeur depuis une ressource telle qu'une [promesse](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) (`Promise`) ou un [contexte](/learn/passing-data-deeply-with-context).
=======
You can pass these types of resources to [`use`](/reference/react/use):

* A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to read its resolved value.
* A [context](/learn/passing-data-deeply-with-context) to read its value.
* <CanaryBadge /> The value returned by [`browser`](/reference/react-dom/browser) to mark a component as browser-only during server rendering.
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  use(browser());
  // ...
}
```
