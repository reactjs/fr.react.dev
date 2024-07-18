---
title: "API React intégrées"
---

<Intro>

En plus des [Hooks](/reference/react) et des [composants](/reference/react/components), le module `react` exporte également d'autres API utiles pour la définition des composants. Cette page répertorie toutes les autres API React modernes.


</Intro>

---

- [`createContext`](/reference/react/createContext) vous permet de définir et de fournir un contexte aux composants enfants. Utilisé conjointement avec [`useContext`](/reference/react/useContext).
- [`forwardRef`](/reference/react/forwardRef) permet à votre composant d'exposer un nœud DOM en tant que référence (ref) à son parent. Utilisé conjointement avec [`useRef`](/reference/react/useRef).
- [`lazy`](/reference/react/lazy) vous permet de différer le chargement du code d'un composant jusqu'à ce qu'il soit rendu pour la première fois.
- [`memo`](/reference/react/memo) permet à votre composant d'éviter de recalculer son rendu quand ses props n'ont pas changé. Utilisé conjointement avec [`useMemo`](/reference/react/useMemo) et [`useCallback`](/reference/react/useCallback).
- [`startTransition`](/reference/react/startTransition) vous permet de marquer une mise à jour d'état comme non urgente. Similaire à [`useTransition`](/reference/react/useTransition).
* [`act`](/reference/react/act) vous permet d'enrober le rendu et les interactions lors de tests pour garantir que les mises à jour ont été traitées avant d'exécuter vos assertions.

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
