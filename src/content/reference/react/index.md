---
title: "Hooks intégrés à React"
---

<Intro>

Les *Hooks* vous permettent d'utiliser différentes fonctionnalités de React dans vos composants. Vous pouvez utiliser les Hooks intégrés ou les associer pour créer les vôtres. Cette page liste tout les Hooks intégrés à React.

</Intro>

---

## Hooks d'état local {/*state-hooks*/}

L'*État local* permet à un composant ["de se souvenir" des informations fournies par l'utilisateur.](/learn/state-a-components-memory) Par exemple, un formulaire composant peut utiliser l'état local pour enregister la valeur de saisie, alors qu'un composant de galerie d'image peut utiliser l'état local pour enregister l'index de l'image.

Pour ajouter l'état local à un composant, utilisez un de ces Hooks:

* [`useState`](/reference/react/useState) déclare une variable d'état local que vous pouvez mettre à jour directement.
* [`useReducer`](/reference/react/useReducer) déclare une variable d'état local avec une logique de mise à jour dans une [fonction réducteur.](/learn/extracting-state-logic-into-a-reducer)

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Hooks de Contexte {/*context-hooks*/}

Le *Contexte* permet à un composant [de recevoir les informations des parents éloignés sans avoir à les passer comme des props.](/learn/passing-props-to-a-component) Par exemple, le composant de niveau supérieur de votre appli peut véritablement passer le thème de l'interface utilisateur à tous ses composants inférieurs, peut importe la profondeur.

* [`useContext`](/reference/react/useContext) lit et s'abonne à un contexte.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Hooks de Ref {/*ref-hooks*/}

le *Refs* permet à un composant [de contenir certaines informations qui ne sont pas utilisés pour faire le rendu,](/learn/referencing-values-with-refs) comme un nœud DOM ou un ID de délai d'attente. Contrairement à l'état local, la mise à jour d'un ref n'entraine pas de faire à nouveau le rendu de votre composant. les Refs sont une "issue de secours" du paradigme de React. Ils sont utiles lorsque vous devez travailler avec des systèmes qui ne sont pas des systèmes React, telles que les APIs intégrées du navigateur web.

* [`useRef`](/reference/react/useRef) déclare un ref. Vous pouvez placer n'importe quelle valeur, mais le plus souvent il est utilisé pour contenir un nœud DOM.

* [`useImperativeHandle`](/reference/react/useImperativeHandle) vous permet de personnaliser le ref exposé par votre composant. ceci est rarement utilisé.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Hooks d'effet {/*effect-hooks*/}

Les *Effets* permettent à un composant [de se connecter et de se synchroniser avec des systèmes externes.](/learn/synchronizing-with-effects) Il s'agit de gérer le réseau, le DOM du navigateur, les animations, les élements d'interface écrit en utilisant une bibliothèque d'interface utilisateur différente et les codes non React.

* [`useEffect`](/reference/react/useEffect) connecte un composant à un système externe.

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

Les Effets sont une "issue de secours" du paradigme de React. N'utilisez pas les Effets pour orchestrer le flux de données de votre application. Si vous n'intéragissez pas avec un système externe, [Vous n'avez pas besoin d'un Effet.](/learn/you-might-not-need-an-effect)

Il existe deux variantes rarement utilisées de `useEffect` avec des différences de timing :

* [`useLayoutEffect`](/reference/react/useLayoutEffect) se déclenche avant que le navigateur ne repeigne l'écran. Vous pouvez mesurer la mise en page ici.
* [`useInsertionEffect`](/reference/react/useInsertionEffect) se déclenche avant que React ne fasse des changements dans le DOM. Les bibliothèques peuvent insérer du CSS dynamique ici.

---

## Les Hooks de performance {/*performance-hooks*/}

La manière courante d'optimiser la performance de réaffichage est d'éviter les tâches inutiles. Par exemple, vous pouvez demander à React de réutiliser la valeur mise en cache ou d'éviter un réaffichage si la donnée n'a pas changé depuis l'affichage précedent.

Pour éviter les calculs coûteux et les réaffichages inutiles, utilisez l'un de ces Hooks:

- [`useMemo`](/reference/react/useMemo) vous permet de mettre en cache le résultat d'un calcul coûteux.
- [`useCallback`](/reference/react/useCallback) Vous permet de mettre en cache la création d'une fonction avant de la passer à un composant optimisé.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Parfois, vous ne pouvez pas éviter le réaffichage parce que la vue actuelle doit être mis à jour. Dans ce cas, vous pouvez améliorer la performance en séparant les mises à jour bloquantes qui sont synchrones (comme si vous tapiez dans un champ de saisie) aux mises à jour non bloquantes qui ne bloquent pas l'interface utilisateur (mise à jour d'une carte).

Pour établir un ordre de priorité d'affichage, utilisez un de ces Hooks:

- [`useTransition`](/reference/react/useTransition) permet de marquer une transition d'état local comme non bloquante et d'autoriser d'autres mises à jour à l'interrompre.
- [`useDeferredValue`](/reference/react/useDeferredValue) vous permet de différer la mise à jour d'une partie non critique de l'interface utilisateur et de laisser les autres parties se mettre à jour en premier.

---

## Autres Hooks {/*other-hooks*/}

Ces Hooks sont majoritairement utiles aux auteurs de bibliothèque et ne sont pas couramment utilisés dans le code de l'application.

- [`useDebugValue`](/reference/react/useDebugValue) vous permet de personnaliser le titre que React Devtools affiche pour votre Hook personnalisé.
- [`useId`](/reference/react/useId) permet à un composant de s'associer lui-même à un ID unique. Géneralement avec les accessibilités des APIs.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) permet à un composant de s'abonner à une source de données externe.

---

## Vos propres Hooks {/*your-own-hooks*/}

Vous pouvez [définir vos propres Hooks personnalisés](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) comme des fonctions Javascript.
