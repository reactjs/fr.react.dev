---
title: "Hooks fournis par React"
---

<Intro>

Les *Hooks* vous permettent d’utiliser différentes fonctionnalités de React au sein de vos composants. Vous pouvez utiliser les Hooks pré-fournis ou les associer pour créer les vôtres. Cette page liste tout les Hooks fournis par React.

</Intro>

---

## Hooks d’état local {/*state-hooks*/}

*L’état local* permet à un composant de [« se souvenir » d’informations telles que des saisies utilisateur](/learn/state-a-components-memory). Par exemple, un composant formulaire peut utiliser l’état local pour stocker la valeur saisie, alors qu’un composant de galerie d’images pourra l’utiliser pour stocker l’index de l’image affichée.

Pour ajouter un état local à un composant, utilisez un de ces Hooks :

* [`useState`](/reference/react/useState) déclare un état local que vous pouvez mettre à jour directement.
* [`useReducer`](/reference/react/useReducer) déclare un état local dont la logique de mise à jour réside dans une [fonction réducteur](/learn/extracting-state-logic-into-a-reducer).

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Hooks de Contexte {/*context-hooks*/}

Le *Contexte* permet à un composant [de recevoir des informations de parents éloignés sans avoir à passer par ses props](/learn/passing-props-to-a-component). Par exemple, le composant de niveau racine de votre appli peut passer le thème de l’interface utilisateur (UI) à tous les composants qu’elle contient, à quelque profondeur que ce soit.

* [`useContext`](/reference/react/useContext) s’abonne à un contexte et le lit.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Hooks de Ref {/*ref-hooks*/}

Les *Refs* permettent à un composant [de conserver certaines informations qui ne sont pas utilisées pour faire le rendu](/learn/referencing-values-with-refs), comme un nœud DOM ou un ID de timer. Contrairement à l’état local, la mise à jour d’une Ref ne déclenche pas un nouveau rendu de votre composant. Les Refs sont une « échappatoire » du paradigme de React. Elles sont utiles lorsque vous devez travailler avec des systèmes externes à React, telles que les API du navigateur web.

* [`useRef`](/reference/react/useRef) déclare une Ref. Vous pouvez y stocker n’importe quelle valeur, mais elle est le plus souvent utilisée pour référencer un nœud du DOM.

* [`useImperativeHandle`](/reference/react/useImperativeHandle) vous permet de personnaliser la Ref exposée par votre composant. Ce Hook est rarement utilisé.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Hooks d’effets {/*effect-hooks*/}

Les *Effets* permettent à un composant [de se connecter et de se synchroniser avec des systèmes extérieurs](/learn/synchronizing-with-effects). Il peut notamment s’agir du réseau, du DOM, des animations, d’éléments d’interface écrits en utilisant une autre bibliothèque, et d’autres codes non React.

* [`useEffect`](/reference/react/useEffect) connecte un composant à un système extérieur.

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

Les Effets sont une « échappatoire » du paradigme de React. N’utilisez pas les Effets pour orchestrer le flux de données de votre application. Si vous n’interagissez pas avec un système extérieur, [vous n’avez pas forcément besoin d’un Effet](/learn/you-might-not-need-an-effect).

Il existe deux variantes rarement utilisées de `useEffect` avec des différences de timing :

* [`useLayoutEffect`](/reference/react/useLayoutEffect) se déclenche avant que le navigateur ne repeigne l’écran. Vous pouvez y mesurer la mise en page, notamment les dimensions.
* [`useInsertionEffect`](/reference/react/useInsertionEffect) se déclenche avant que React ne fasse des changements dans le DOM. Les bibliothèques peuvent y insérer des CSS dynamiques.

---

## Les Hooks de performance {/*performance-hooks*/}

Une manière courante d’optimiser la performance de réaffichage consiste à s’épargner des tâches superflues. Par exemple, vous pouvez demander à React de réutiliser un calcul mis en cache ou d’éviter un nouveau rendu si la donnée n’a pas changé depuis le rendu précédent.

Pour éviter les calculs coûteux et les réaffichages inutiles, utilisez l’un de ces Hooks :

* [`useMemo`](/reference/react/useMemo) vous permet de mettre en cache le résultat d’un calcul coûteux.
* [`useCallback`](/reference/react/useCallback) vous permet de mettre en cache la définition d’une fonction avant de la passer à un composant optimisé.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Parfois, vous ne pouvez pas éviter le réaffichage parce que la vue doit effectivement être mise à jour. Dans ce cas, vous pouvez améliorer la performance en séparant les mises à jour bloquantes qui doivent être synchrones (comme la gestion d’une saisie dans un champ) des mises à jour non bloquantes, qui ne gèlent  pas le traitement de l’interface (comme la mise à jour d’un graphique).

Pour établir des priorités de rendu, utilisez un de ces Hooks :

* [`useTransition`](/reference/react/useTransition) permet de marquer une transition d’état local comme non bloquante ce qui autorise d’autres mises à jour à l’interrompre.
* [`useDeferredValue`](/reference/react/useDeferredValue) vous permet de différer la mise à jour d’une partie non critique de l’UI et de laisser les autres parties se mettre à jour en premier.

---

---

## Autres Hooks {/*other-hooks*/}

Ces Hooks sont majoritairement utiles aux auteur·e·s de bibliothèque et ne sont pas couramment utilisés dans du code applicatif.

* [`useDebugValue`](/reference/react/useDebugValue) vous permet de personnaliser le libellé que les outils de développement React affichent pour votre propre Hook.
* [`useId`](/reference/react/useId) permet à un composant de s’associer un ID unique. Généralement utilisé avec les API d’accessibilité.
* [`useSyncExternalStore`](/reference/react/useSyncExternalStore) permet à un composant de s’abonner à une source de données extérieure.
* [`useActionState`](/reference/react/useActionState) vous permet de gérer les états d'Actions.

---

## Vos propres Hooks {/*your-own-hooks*/}

Vous pouvez [définir vos propres Hooks personnalisés](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) au moyen de fonctions JavaScript.
