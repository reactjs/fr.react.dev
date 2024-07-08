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
=======
* [`createContext`](/reference/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/reference/react/useContext)
* [`forwardRef`](/reference/react/forwardRef) lets your component expose a DOM node as a ref to the parent. Used with [`useRef`.](/reference/react/useRef)
* [`lazy`](/reference/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
* [`memo`](/reference/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/reference/react/useMemo) and [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/reference/react/useTransition)
* [`act`](/reference/react/act) lets you wrap renders and interactions in tests to ensure updates have processed before making assertions.

---

## Resource APIs {/*resource-apis*/}

*Resources* can be accessed by a component without having them as part of their state. For example, a component can read a message from a Promise or read styling information from a context.

To read a value from a resource, use this API:

* [`use`](/reference/react/use) lets you read the value of a resource like a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```
>>>>>>> 2a2e02f1d88f4d2828728ce352626e84ed8abda0
