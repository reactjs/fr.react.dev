---
title: "APIs React intégrées"
---

<Intro>

En plus des [Hooks](/reference/react) et des [Composants](/reference/react/components), le package `react` propose également d'autres API utiles pour la définition des composants. Cette page répertorie toutes les autres API React modernes.


</Intro>

---

- [`createContext`](/reference/react/createContext) vous permet de définir et de fournir un contexte aux composants enfants. Utilisé conjointement avec [`useContext`](/reference/react/useContext).
- [`forwardRef`](/reference/react/forwardRef) permet à votre composant d'exposer un nœud DOM en tant que référence (ref) à son parent. Utilisé conjointement avec [`useRef`](/reference/react/useRef).
- [`lazy`](/reference/react/lazy) vous permet de différer le chargement du code d'un composant jusqu'à ce qu'il soit rendu pour la première fois.
- [`memo`](/reference/react/memo) permet à votre composant de sauter les réaffichages avec les mêmes props. Utilisé conjointement avec [`useMemo`](/reference/react/useMemo) et [`useCallback`](/reference/react/useCallback).
- [`startTransition`](/reference/react/startTransition) vous permet de marquer une mise à jour d'état comme non urgente. Similaire à [`useTransition`](/reference/react/useTransition).
