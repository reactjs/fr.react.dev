---
id: hooks-reference
title: Référence de l'API des Hooks
permalink: docs/hooks-reference.html
prev: hooks-custom.html
next: hooks-faq.html
---

Les *Hooks* sont un nouvel ajout dans React 16.8. Ils permettent d'utiliser l'état local et d'autres fonctionnalités de React sans avoir recours à une classe.

Cette page décrit les APIs des Hooks disponibles par défaut dans React.

Si les Hooks sont nouveaux pour vous, vous voudrez peut-être consulter [la vue d'ensemble](/docs/hooks-overview.html) en premier. Vous trouverez peut-être aussi des informations utiles dans [la foire aux questions](/docs/hooks-faq.html).

- [Les Hooks de base](#basic-hooks)
  - [`useState`](#usestate)
  - [`useEffect`](#useeffect)
  - [`useContext`](#usecontext)
- [Hooks supplémentaires](#additional-hooks)
  - [`useReducer`](#usereducer)
  - [`useCallback`](#usecallback)
  - [`useMemo`](#usememo)
  - [`useRef`](#useref)
  - [`useImperativeHandle`](#useimperativehandle)
  - [`useLayoutEffect`](#uselayouteffect)
  - [`useDebugValue`](#usedebugvalue)

## Les Hooks de base {#basic-hooks}

### `useState` {#usestate}

```js
const [state, setState] = useState(initialState);
```

Renvoie une valeur d'état local et une fonction pour la mettre à jour.

Pendant le rendu initial, l'état local (`state`) renvoie la même valeur que celle passée en premier argument (`initialState`).

La fonction `setState` permet de mettre à jour l'état local. Elle accepte une nouvelle valeur d'état local et place le composant dans la queue du moteur de rendu pour être re-rendu ultérieurement.

```js
setState(newState);
```

Au cours des rendus suivants, la première valeur renvoyée par `useState` sera toujours celle de l'état local le plus récent, une fois les mises à jour effectuées.

#### Mises à jour fonctionnelles {#functional-updates}

Si le nouvel état local est déduit de l'état local précédent, vous pouvez passer une fonction à `setState`. Cette fonction recevra la valeur précédente de l'état local et renverra une nouvelle valur de l'état local. Voici un exemple d'un composant compteur qui utilise les deux formes de `setState`:

```js
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Total: {count}
      <button onClick={() => setCount(initialCount)}>Remettre à zéro</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
    </>
  );
}
```

Les boutons "+" and "-" utilisent la forme fonctionnelle, puisque la nouvelle valeur est calculée à partir de la valeur précédente. Cependant, le bouton « Remettre à zéro » utilise la forme normale puisqu'il remet toujours le total à zéro.

> Remarque
>
> À l'inverse de la méthode `setState` que l'on trouve dans les composants définis à l'aide d'une classe, `useState` ne fusionne pas automatiquement les objets mis à jour. Vous pouvez imiter ce comportement en combinant la forme fonctionnelle de mise à jour avec la syntaxe de décomposition des objets:
>
> ```js
> setState(prevState => {
>   // Object.assign marcherait aussi
>   return {...prevState, ...updatedValues};
> });
> ```
>
> Il est aussi possible d'utiliser `userReducer`, qui est plus adapté pour gérer les objets d'état local qui contiennent plusieurs sous-valeurs.

#### État local initial paresseux {#lazy-initial-state}

Le rendu initial utilise l'argument `initialState` comme état local. Au cours des rendus suivants, il est ignoré. Si l'état local initial est le résultat d'un calcul coûteux, vous pouvez plutôt fournir une fonction qui sera executée seulement au cours du rendu initial:

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

#### Abandon de la mise à jour de l'état local {#bailing-out-of-a-state-update}

Si vous mettez à jour le Hook d'état local avec la même valeur que l'état local actuel, React abandonnera cette mise à jour, ce qui signifie qu'aucun nouveau rendu des enfants ne sera effectué et qu'aucun effet ne sera déclenché. (React utilise [l'algrorithme de comparaison `Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/is).)

### `useEffect` {#useeffect}

```js
useEffect(didUpdate);
```

Accepte une fonction qui contient du code impératif, pouvant éventuellement produire des effets. 

L'utilisation de mutations, abonnements, comptes à rebourd, notes dans le journal d'événements, et autres effets de bord n'est pas autorisée au sein du corps principal d'un composant fonctionnel (qu'on appelle _phase de rendu_ de React). Cela produirait autrement des bugs déroutants et des incohérences dans l'interface utilisateur.

 Pour ce faire, utilisez plutôt `useEffect`. La fonction fournie à `useEffect` s'exécutera après que le rendu soit apparu sur l'écran. Vous pouvez penser aux effets de bord comme à une trappe de secours pour passer du monde purement fonctionnel de React au monde impératif.

Par défaut, les effets de bord s'exécutent après la complétion de chaque rendu, mais vous pouvez choisir d'en exécuter certains [uniquement en réponse au changement de certaines valeurs](#conditionally-firing-an-effect).

#### Nettoyage d'un effet de bord {#cleaning-up-an-effect}

Souvent, les effets de bord créent des ressources qui nécessitent d'être nettoyées avant que le composant ne quitte l'écran, tel qu'un abonnement ou l'ID d'un compte à rebourd. Pour ce faire, la fonction fournie à `useEffect` peut renvoyer une fonction de nettoyage. Par exemple, pour créer un abonnement:

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Nettoyage de l'abonnement
    subscription.unsubscribe();
  };
});
```
La fonction de nettoyage s'exécute avant que le composant ne soit retiré de l'interface utilisateur pour éviter les fuites de mémoire. Par ailleurs, si un composant est rendu plusieurs fois (comme c'est typiquement le cas), **l'effet de bord précédent est nettoyé avant l'exécution du prochain effet de bord**. Dans notre exemple, cela veut dire qu'un nouvel abonnement est créé à chaque mise à jour. Pour éviter d'exécuter un effet de bord à chaque mise à jour, veuillez consulter le paragraphe suivant.

#### Moment d'exécution des effets de bord {#timing-of-effects}

Au contraire de `componentDidMount` et `componentDidUpdate`, la fonction fournie à `useEffect` s'exécute au cours d'un événement différé, **après** la mise en page et la peinture (NdT: _layout and paint_ en anglais). `useEffect` est donc bien adapté pour une grande partie des effets de bord, comme la mise en place d'abonnements et de gestionnaires d'événements, puisque la plupart des types de travail ne devrait pas bloquer la mise à jour de l'écran du navigateur.

Cependant, tous les effets de bord ne peuvent pas être différés. Par exemple, une mutation du DOM qui est visible pour l'utilisateur doit s'exécuter de manière synchrone avant la peinture suivante, de telle sorte que l'utilisateur ne puisse pas percevoir une incohérence visuelle. (La distinction est conceptuellement similaire à celle entre récepteur d'événement passif et actif.) Pour ces types d'effets de bord, React fournit un Hook supplémentaire qui s'appelle [`useLayoutEffect`](#uselayouteffect). Il a la même signature que `useEffect`, et s'en distingue seulement par le moment où il s'exécute.

Bien que `useEffect` est différé jusqu'à ce que le navigateur ait finit la peinture, son exécution est garantie avant n'importe quel autre nouveau rendu. React traitera toujours les effets de bord des rendus précédents avant de commencer une nouvelle mise à jour.

#### Exécution conditionnelle d'un effet de bord {#conditionally-firing-an-effect}

Le comportement par défaut des effets de bord est d'exécuter l'effet après chaque complétion de rendu. De cette manière, un effet est toujours recréé si une de ses entrées change.

Cependant, ça pourrait être exagéré dans certains cas, comme dans l'exemple avec l'abonnement dans le paragraphe précédent. Il n'est pas nécessaire de créer un nouvel abonnement à chaque mise à jour, seulement si la prop `source` a changé.

Pour mettre ça en œuvre, fournissez un deuxième argument à `useEffect` qui consiste en un tableau de valeurs dont l'effet dépend. Notre exemple mis à jour ressemble maintenant à ça :

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

L'abonnement sera maintenant recréé uniquement quand `props.source` change.

Fournir un tableau vide `[]` d'entrées indique à React que votre effet ne dépend d'aucune valeur du composant, et ainsi, l'effet ne s'exécuterait uniquement lors du montage et lors de son nettoyage avant de se démonter ; il ne s'exécutera pas lors des mises à jour.

> Remarque
>
> Le tableau d'entrées n'est pas fourni comme argument à la fonction d'effet de bord. Conceptuellement cependant, c'est en quelque sorte ce qu'il se passe : chaque valeur référencée dans la fonction d'effet de bord devrait aussi apparaître dans le tableau d'entrées. Dans le futur, un compileur suffisamment avancé pourrait créer ce tableau automatiquement. 

### `useContext` {#usecontext}

```js
const context = useContext(Context);
```

Accepte un objet contexte (la valeur renvoyée par `React.createContext`), et renvoie la valeur actuelle du contexte telle qu'elle est donnée par le fournisseur de contexte le plus proche du contexte donné.

Quand le fournisseur se met à jour, ce Hook va déclencher un nouveau rendu avec la valeur la plus récente du contexte.

## Hooks supplémentaires {#additional-hooks}

Les Hooks suivant sont ou bien des variantes des Hooks basiques des paragraphes précédents, ou sont seulement nécessaires dans des cas particuliers. Ne vous souciez pas de les apprendre dès le départ.

### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

Alternative à [`useState`](#usestate). Accepte un réducteur de type `(state, action) => newState`, et renvoie l'état local actuel accompagné d'une méthode `dispatch`. (Si Redux vous est familier, vous savez déjà comment ça fonctionne.)

`useReducer` est souvent à préférer à `useState` quand vous avez une logique d'état local complexe qui comprend plusieurs sous-valeurs, ou quand l'état suivant dépend de l'état précédent. `useReducer` vous permet aussi d'optimiser les performances pour des composants qui déclenchent des mises à jours profondes puisque [vous pouvez fournir `dispatch` à la place de fonctions de rappel](/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down).

Voice l'exemple du composant compteur du paragraphe [`useState`](#usestate) ré-écrit avec un réducteur :

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter({initialState}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Total: {state.count}
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

#### Préciser l'état local initial {#specifying-the-initial-state}

Il existe deux manières différentes d'initialiser l'état de `useReducer`. Vous pouvez choisir l'un ou l'autre suivant le cas. La manière la plus simple est de fournir l'état local initial comme deuxième argument :

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

>Remarque
>
>React n'utilise pas la convention d'argument `state = initialState` popularisée par Redux. La valeur initiale doit parfois dépendre de props et est donc plutôt spécifiée par l'appel du Hook. Si votre opinion est déjà forgée à ce propos, vous pouvez utiliser `useReducer(reducer, undefined, reducer)` pour simuler le comportement de Redux, bien que ça ne soit pas encouragé.

#### Initialisation paresseuse {#lazy-initialization}

Vous pouvez aussi créer l'état local initial paresseusement. Pour ce faire, vous pouvez fournir une fonction `init` comme troisième argument. L'état initial sera alors égal à `init(initialArg)`.

Ça vous permet d'extraire la logique pour calculer l'état local initial en dehors du réducteur. C'est aussi pratique pour remettre l'état local à zéro en réponse à une action dans le futur :

```js{1-3,11-12,19,24}
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Total: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

#### Abandon d'un dispatch {#bailing-out-of-a-dispatch}

Si vous renvoyez la même valeur d'un Hook Réducteur que l'état actuel, React abandonnera la mise à jour, ce qui signifie qu'aucun nouveau rendu des enfants ne sera effectué et qu'aucun effet ne sera déclenché. (React utilise [l'algrorithme de comparaison `Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/is).)

### `useCallback` {#usecallback}

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

Renvoie une fonction de rappel [mémoïsée](https://fr.wikipedia.org/wiki/M%C3%A9mo%C3%AFsation)

Fournissez une fonction de rappel et un tableau d'entrées. `useCallback` renverra une version mémoïsée de la fonction de rappel qui changera uniquement si une des entrées a changé. Ceci est utile quand des fonctions de rappel sont fournies à des composants enfant optimisés qui se basent sur des égalités de références pour éviter des rendus non nécessaires (par exemple `shouldComponentUpdate`).


`useCallback(fn, inputs)` est équivalent à `useMemo(() => fn, inputs)`.

> Remarque
>
> Le tableau d'entrées n'est pas fourni comme argument à la fonction de rappel. Conceptuellement cependant, c'est en quelque sorte ce qu'il se passe : chaque valeur référencée dans la fonction de rappel devrait aussi apparaître dans le tableau d'entrées. Dans le futur, un compileur suffisamment avancé pourrait créer ce tableau automatiquement.

### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Renvoie une valeur [mémoïsée](https://fr.wikipedia.org/wiki/M%C3%A9mo%C3%AFsation)

Fournissez une fonction « créer » et un tableau d'entrées. `useMemo` recalculera la valeur mémoïsée seulement si une des entrées a changé. Cette optimisation permet d'éviter des calculs coûteux à chaque rendu.

Rappelez-vous que la fonction fournie à `useMemo` s'exécute pendant le rendu. Ne faites rien là-bas que vous ne feriez pas normalement pendant un rendu. Par exemple, les effets de bord doivent passer par `useEffect`, et non `useMemo`.

Si vous ne fournissez aucun tableau, une nouvelle valeur sera calculée quand une nouvelle instance de la fonction sera fournie comme premier argument. (Avec une fonction en ligne, donc, à chaque rendu.)

**Vous pouvez vous appuyer sur `useMemo` comme d'un moyen d'optimiser les performances, pas comme d'une garantie sémantique.** Dans le futur, React pourrait peut-être choisir « d'oublier » certaines valeurs précédemment mémoïsées et de les recalculer au rendu suivant, par exemple pour libérer de la mémoire pour les composants qui sont hors de l'écran. Écrivez votre code de telle manière à ce qu'il fonctionne sans `useMemo` et ajoutez le ensuite pour optimiser les performances.

> Remarque
>
> Le tableau d'entrées n'est pas fourni comme argument à la fonction. Conceptuellement cependant, c'est en quelque sorte ce qu'il se passe : chaque valeur référencée dans la fonction devrait aussi apparaître dans le tableau d'entrées. Dans le futur, un compileur suffisamment avancé pourrait créer ce tableau automatiquement.

### `useRef` {#useref}

```js
const refContainer = useRef(initialValue);
```

`useRef` remvoie un objet ref modifiable dont la propriété `.current` est initialisée avec l'argument fourni (`initialValue`). L'objet renvoyé persistera au cours du cycle de vie complet du composant.

Accéder à un enfant de manière impérative est un cas d'utilisation courant :

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` fait référence à l'élément text input monté
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focaliser l'input</button>
    </>
  );
}
```

Remarquez que `useRef()` est utile pour plus de choses que seulement l'attribut `ref`. C'est [pratique pour garder des valeurs modifiables sous la main](/docs/hooks-faq.html#is-there-something-like-instance-variables), de la même manière que vous utiliseriez des attributs sur l'instance d'une classe.

### `useImperativeHandle` {#useimperativehandle}

```js
useImperativeHandle(ref, createHandle, [inputs])
```

`useImperativeHandle` adapte la valeur de l'instance qui est exposée au composant parent lors de l'utilisation de `ref`. Comme toujours, il vaut mieux s'abstenir d'utiliser du code impératif manipulant des refs dans la plupart des cas. `useImperativeHandle` devrait s'utiliser avec `forwardRef`:

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```
Dans cet exemple, un composant parent qui ferait le rendu de `<FancyInput ref={fancyInputRef} />` serait capable d'appeler `fancyInputRef.current.focus()`.

### `useLayoutEffect` {#uselayouteffect}

La signature est identique à celle de `useEffect`, mais `useLayoutEffect` s'exécute de manière synchrone après que toutes les mutations du DOM aient eu lieu. Utilisez-le pour lire la mise en page du DOM et effectuer un nouveau rendu de manière synchrone. Les mises à jour planifiées dans `useLayoutEffect` seront traitées de manière synchrone avant que le navigateur n'ait eu la chance de peindre.

Préférez l'utilisation du plus standard `useEffect` dès que possible pour éviter de bloquer les mises à jour visuelles.

> Conseil
>
> Si vous migrez du code depuis un composant écrit à l'aide d'une classe, `useLayoutEffect` s'exécute dans la même phase que `componentDidMount` et `componentDidUpdate`. Si vous n'êtes donc pas sûrs de quel Hook d'effet de bord utiliser, c'est probablament le moins risqué.

### `useDebugValue` {#usedebugvalue}

```js
useDebugValue(value)
```

Vous pouvez utiliser `useDebugValue` pour faire apparaître une étiquette pour des Hooks customisés dans les outils de débogage de React (NdT: React DevTools).

Par exemple, considérez le hook customisé `useFriendStatus` décrit dans ["Construire ses propres Hooks"](/docs/hooks-custom.html):

```js{6-8}
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // Montrez une étiquette dans les DevTools à côté de ce Hook
  // par exemple, "FriendStatus: En ligne"
  useDebugValue(isOnline ? 'En ligne' : 'Hors ligne');

  return isOnline;
}
```

> Conseil
>
> Nous ne conseillons pas l'ajout de valeurs de débogage pour chaque Hook customisé. C'est surout utile pour les Hooks customisés provenant de bibliothèques partagées.

#### Différer le formattage des valeurs de débogage {#defer-formatting-debug-values}

Dans certains cas, formatter une valeur à montrer peut être une opération coûteuse. C'est aussi inutile, à moins que l'on aille inspecter le Hook.

Pour cette raison, `useDebugValue` accepte une fonction de formattage comme deuxième paramètre optionnel. Cette fonction est appelée uniquement si les Hooks sont inspectés. Elle reçoit la valeur de débogage comme paramètre et devrait renvoyer une valeur d'affichage formattée.

Par example, un Hook customisé qui renvoie une valeur `Date` pourrait éviter d'appeler inutilement la fonction `toDateString` en fournissant le formatteur suivant :

```js
useDebugValue(date, date => date.toDateString());
```
