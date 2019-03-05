---
id: hooks-faq
title: FAQ Hooks
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

Les *Hooks* sont une nouveauté de React 16.8. Ils offrent la possibilité d'utiliser état local et autres fonctionnalités de React sans avoir à écrire une classe.

Cette page contient les réponses aux questions les plus fréquemment posées à propos des [Hooks](/docs/hooks-overview.html).

<!--
  if you ever need to regenerate this, this snippet in the devtools console might help:

  $$('.anchor').map(a =>
    `${' '.repeat(2 * +a.parentNode.nodeName.slice(1))}` +
    `[${a.parentNode.textContent}](${a.getAttribute('href')})`
  ).join('\n')
-->
* **[Stratégie d'adoption](#adoption-strategy)**
  * [Quelles versions de React incluent les Hooks ?](#which-versions-of-react-include-hooks)
  * [Dois-je réécrire tous mes composants à base de classe ?](#do-i-need-to-rewrite-all-my-class-components)
  * [Que puis-je faire avec les Hooks qu'il est impossible de faire avec des classes ?](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [Quelle proportion de ma connaissance en React reste pertinente ?](#how-much-of-my-react-knowledge-stays-relevant)
  * [Dois-je utiliser des Hooks, classes ou un mélange des deux ?](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [Est-ce que les Hooks couvrent tous les cas d'utilisation des classes ?](#do-hooks-cover-all-use-cases-for-classes)
  * [Est-ce que les Hooks remplacent les props de rendu et les composants d'ordre supérieur ?](#do-hooks-replace-render-props-and-higher-order-components)
  * [Qu'est-ce que les Hooks changent pour les APIs populaires telles que Redux connect() et React Router ?](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [Est-ce que les Hooks sont compatibles avec le typage statique ?](#do-hooks-work-with-static-typing)
  * [Comment tester des composants utilisant des Hooks ?](#how-to-test-components-that-use-hooks)
  * [Qu'est-ce que les règles de linting imposent ?](#what-exactly-do-the-lint-rules-enforce)
* **[Des classes aux Hooks](#from-classes-to-hooks)**
  * [Quelle est la correspondance entre les méthodes du cycle de vie et les Hooks ?](#how-do-lifecycle-methods-correspond-to-hooks)
  * [Existe-t-il un équivalent aux variables d'instances ?](#is-there-something-like-instance-variables)
  * [Dois-je utiliser une ou plusieurs variables d'état local ?](#should-i-use-one-or-many-state-variables)
  * [Puis-je exécuter un effet seulement lors des mises à jour ?](#can-i-run-an-effect-only-on-updates)
  * [Comment récupérer les props ou l'état local précédent(s) ?](#how-to-get-the-previous-props-or-state)
  * [Comment puis-je implémenter getDerivedStateFromProps ?](#how-do-i-implement-getderivedstatefromprops)
  * [Existe-t-il un équivalent à forceUpdate ?](#is-there-something-like-forceupdate)
  * [Puis-je créer une ref vers une fonction composant ?](#can-i-make-a-ref-to-a-function-component)
  * [What does const [thing, setThing] = useState() mean?](#what-does-const-thing-setthing--usestate-mean)
  * [Que signifie const [thing, setThing] = useState() ?](#what-does-const-thing-setthing--usestate-mean)
* **[Performance Optimizations](#performance-optimizations)**
  * [Puis-je sauter un effet lors de mises à jour ?](#can-i-skip-an-effect-on-updates)
  * [Comment puis-je implémenter shouldComponentUpdate?](#how-do-i-implement-shouldcomponentupdate)
  * [Comment mémoïser les calculs ?](#how-to-memoize-calculations)
  * [Comment créer des objets lourds sans trop de travail ?](#how-to-create-expensive-objects-lazily)
  * [Les Hooks sont-ils lents à cause de la création de fonctions dans le rendu ?](#are-hooks-slow-because-of-creating-functions-in-render)
  * [Comment éviter de transmettre des fonctions de rappel ?](#how-to-avoid-passing-callbacks-down)
  * [Comment lire une valeur changeant fréquemment depuis useCallback ?](#how-to-read-an-often-changing-value-from-usecallback)
* **[Sous le capot](#under-the-hood)**
  * [Comment React associe-t-il les appels de Hook avec les composants ?](#how-does-react-associate-hook-calls-with-components)
  * [Quelles sont les idées à l'origine des Hooks ?](#what-is-the-prior-art-for-hooks)

## Stratégie d'adoption {#adoption-strategy}

### Quelles versions de React incluent les Hooks ? {#which-versions-of-react-include-hooks}

Depuis la version 16.8.0, React embarque une implémentation stable de React Hooks pour :

* Le DOM React
* Le serveur DOM React
* Le moteur de rendu de tests de React
* Le moteur de rendu de premier niveau de React

Notez que **pour activer les Hooks, tous les paquets React doivent être en version 16.8.0 ou supérieure**. Les Hooks ne fonctionneront pas si vous oubliez de mettre à jour React DOM, par exemple.

React Native prendra complètement en charge les Hooks dans sa prochaine version stable.

### Dois-je réécrire tous mes composants à base de classe ? {#do-i-need-to-rewrite-all-my-class-components}

No. There are [no plans](/docs/hooks-intro.html#gradual-adoption-strategy) to remove classes from React -- we all need to keep shipping products and can't afford rewrites. We recommend trying Hooks in new code.

Non. Il n'est [pas prévu](/docs/hooks-intro.html#gradual-adoption-strategy) de supprimer les classes de React -- nous avons tous besoin de continuer à livrer des produits et ne pouvons nous permettre de réécrire tout le code. Nous recommandons d'essayer les Hooks dans de nouveaux projets.

### Que puis-je faire avec les Hooks qu'il est impossible de faire avec des classes ? {#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

Hooks offer a powerful and expressive new way to reuse functionality between components. ["Building Your Own Hooks"](/docs/hooks-custom.html) provides a glimpse of what's possible. [This article](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889) by a React core team member dives deeper into the new capabilities unlocked by Hooks.

Les Hooks offrent un nouveau moyen puissant et remarquable de réutiliser des fonctionnalités entre composants. ["Contruire vos propres Hooks"](/docs/hooks-custom.html) offre un aperçu des possibilités. [Cet article](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889) écrit par un membre de l'équipe React core plonge en profondeur dans les nouvelles possibilités permises par les Hooks.

### Quelle proportion de ma connaissance en React reste pertinente ? {#how-much-of-my-react-knowledge-stays-relevant}

Les Hooks sont un moyen plus direct d'utiliser les fonctionnalités de React que vous connaissez déjà -- comme état local, cycle de vie, contexte et refs. Ils ne changent pas fondamentalement la façon dont React fonctionne, et vos connaissances des composants, props, et flux de données descendant sont toujours valides.

Les Hooks ont leur propre courbe d'apprentissage. Si quelque chose manque dans leur documentation, [créez une issue](https://github.com/reactjs/reactjs.org/issues/new) et nous essaierons de vous aider.

### Dois-je utiliser des Hooks, classes ou un mélange des deux ? {#should-i-use-hooks-classes-or-a-mix-of-both}

Quand vous serez prêt, nous vous encourageons de commencer à essayer les Hooks dans les nouveaux composants que vous écrirez. Assurez-vous que chaque membre de votre équipe soit former à leur utilisation et familier avec cette documentation. Nous ne recommandons pas de réécrire vos classes existante en Hooks sauf si vous planifiez de les réécrire de toute façon (i.e. pour corriger des bugs).

Vous ne pouvez pas utiliser les Hooks *à l'intérieur* d'un composant à base de classe, mais vous pouvez complètement mélanger classes et fonctions composant avec des Hooks dans une même arborescence. Qu'un composant soit une classe ou une fonction utilisant les Hooks est un détail d'implémentation de ce composant. Sur le long terme, nous nous attendons à ce que les Hooks soit le principale moyen utilisé pour écrire des composants React.

### Est-ce que les Hooks couvrent tous les cas d'utilisation des classes ? {#do-hooks-cover-all-use-cases-for-classes}

Notre but est que les Hooks couvrent tous les cas d'utilisation des classes dès que possible. Il n;existe pas d'équivalent en Hook pour les méthodes de cycle de vie non courantes `getSnapshotBeforeUpdate` et `componentDidCatch` pour l'instant, mais nous planifions de les ajouter rapidement.

Les Hooks en sont encore à leur débuts, et quelques bibliothèques tierces peuvent ne pas être compatible avec les Hooks à l'heure actuelle.

--------------------------------------

### Est-ce que les Hooks remplacent les props de rendu et les composants d'ordre supérieur ? {#do-hooks-replace-render-props-and-higher-order-components}

Souvent, les props de rendu et les composants d'ordre supérieur font le rendu d'un unique enfant. Nous pensons que les Hooks sont une façon plus simple de répondre à ce cas d'utilisation. Il reste une place pour chacun des patterns (par exemple, un composant de défilement virtuel pourrait avoir une prop `renderItem`, ou un composant de conteneur visuel pourrait avoir sa propre structure DOM). Mais dans la plupart des cas, les Hooks seront suffisants et pourront aider à réduire l'imbrication
dans votre arborescence.

### Qu'est-ce que les Hooks changent pour les APIs populaires telles que Redux connect() et React Router ? {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}

Vous pouvez continuer d'utiliser les mêmes APIs que d'habitude; elles fonctionneront toujours.

Dans le futur, de nouvelles version de ces bibliothèques pourraient aussi exposer des Hooks personnalisés tels que `useRedux()` ou `useRouter()` qui vous permettraient d'utiliser les mêmes fonctionnalités sans avoir besoin de composants d'enrobage.

### Est-ce que les Hooks sont compatibles avec le typage statique ? {#do-hooks-work-with-static-typing}

Les Hooks ont été conçus avec le typage statique à l'esprit. Comme ce sont des fonctions, il est plus facile de les typer correctement que d'autres patterns tels que les composants d'ordre supérieur. Les dernières définitions de Flow et TypeScript React incluent le support des Hooks React.

Surtout, des Hooks personnalisés vous donnent la possibilité de restreindre l'API React si vous vouliez les typer davantage. React vous donne les primitives, mais vous pouvez les combiner de différentes façons que celles proposées prêtes à l'emploi.

### Comment tester des composants utilisant des Hooks ? {#how-to-test-components-that-use-hooks}

Du point de vue de React, un composant utilisant des Hooks est un composant normal. Si votre solution de test ne repose pas sur des fonctions internes de React, tester des composants avec des Hooks ne devrait pas être différence de la façon dont vous tester vos composants habituellement.

Par exemple, prenons ce composant de comptage :

```js
function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `Vous avez cliqué ${count} fois`;
  });
  return (
    <div>
      <p>Vous avez cliqué {count} fois</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

Nous le testerons en utilisant React DOM. Pour être certain que le comportement correspond avec ce qui se passe dans la navigateur, nous enroberons le code faisant le rendu et le mettant à jour par des appels à [`ReactTestUtils.act()`](/docs/test-utils.html#act) :

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // Test du premier rendu et effet
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Vous avez cliqué 0 fois');
  expect(document.title).toBe('Vous avez cliqué 0 fois');

  // Test du second rendu et effet
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('Vous avez cliqué 1 fois');
  expect(document.title).toBe('Vous avez cliqué 1 fois');
});
```

Les appels à `act()` vont aussi supprimer les effets qu'ils contiennent.

Si vous souhaitez tester un Hook personnalisé, c'est possible en créant un composant dans votre test, et en utilisant le Hook depuis celui-ci. Vous pourrez alors tester le composant que vous avez créé.

Pour réduire le code générique, nous recommandons d'utiliser [`react-testing-library`](https://git.io/react-testing-library) qui est conçu de manière à encourager l'écriture de tests utilisant les composants comme le feraient les utilisateurs finaux.

### Qu'est-ce que les [règles de linting](https://www.npmjs.com/package/eslint-plugin-react-hooks) imposent ? {#what-exactly-do-the-lint-rules-enforce}

Nous mettons à disposition un [plugin ESlint](https://www.npmjs.com/package/eslint-plugin-react-hooks) qui impose [les règles des Hooks](/docs/hooks-rules.html) pour éviter les bugs. Il part du principe que toute fonction commençant part "`use`" et suivi d'une lettre majuscule est un Hook. Nous reconnaissons que cette heuristique n'est pas parfaite et peut déclencher de faux positifs, mais sans convention au niveau de l'écosystème, il n'existe aucun moyen de faire fonctionner les Hooks correctement -- et des noms plus longs décourageront l'adoption des Hooks ou le respect des conventions par la communauté.

En particulier, la règle impose que :

* Les appels de Hooks soient soit à l'intérieur d'une fonction `PascaleCase` (supposée être un composant) ou d'une autre fonction `useSomething` (supposée être un Hook personnalisés).
* Les Hooks soient appelés dans le même ordre à chaque rendu.

Il existe quelques autres heuristiques, et elles changeront peut-être avec le temps, au fur et à mesure que nous peaufinons la règle pour équilibrer la découverte de bugs et l'évitement de faux positifs.

## Des classes aux Hooks {#from-classes-to-hooks}

### Quelle est la correspondance entre les méthodes du cycle de vie et les Hooks ? {#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor` : Les fonctions composants n'ont pas besoin d'un constructeur. Vous pouvez initialiser l'état local lors de l'appel à [`useState`](/docs/hooks-reference.html#usestate). Si le calcul de l'état local initial est trop lourd, vous pouvez passer une fonction à `useState`.

* `getDerivedStateFromProps` : planifie une mise à jour [pendant le rendu](#how-do-i-implement-getderivedstatefromprops) plutôt.

* `shouldComponentUpdate` : Voir `React.memo` [ci-dessous](#how-do-i-implement-shouldcomponentupdate).

* `render` : C'est le corps de la fonction composant elle-même.

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` : Le [Hook `useEffect`](/docs/hooks-reference.html#useeffect) peut représenter toutes combinaisons de celles-ci (y compris des cas [moins](#can-i-skip-an-effect-on-updates) [communs](#can-i-run-an-effect-only-on-updates)).

* `componentDidCatch` et `getDerivedStateFromError` : Il n'existe pas encore de Hook équivalent pour ces méthodes, mais ils seront ajouté prochainement.

### Existe-t-il un équivalent aux variables d'instances ? {#is-there-something-like-instance-variables}

Oui ! Le Hook [`useRef()`](/docs/hooks-reference.html#useref) n'est pas seulement pour les refs au DOM. L'objet "ref" est un conteneur générique dont la propriété `current` est modifiable et peut contenir n'importe quelle valeur, de la même façon qu'une propriété d'instance dans une classe.

Vous pouvez y assigner une valeur depuis `useEffect` :

```js{2,8}
function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  // ...
}
```

Si nous avions juste voulu définir un interval, nous n'aurions pas eu besoin de la ref (`id` pouvait rester local à l'effet) mais ça peut être utile si nous voulons réinitialiser l'interval depuis un gestionnaire d’événement.

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

Conceptuellement, vous pouvez vous représenter les refs comme des variables d'instance de classe. Sauf si vous faîtes de l'[initialisation paresseuse](#how-to-create-expensive-objects-lazily), évitez de définir des refs pendant le rendu -- ça peut mener à un comportement hasardeux. Au lieu de ça, vous préférerez modifier les refs dans des gestionnaires d'événements et des effets.

### Dois-je utiliser une ou plusieurs variables d'état local ? {#should-i-use-one-or-many-state-variables}

Si vous êtes familiers avec les classes, vous serez peut-être tentés de toujours appeler `useState()` et mettre tout l'état local dans un unique objet. Vous pouvez le faire si vous le souhaitez. Voici un exemple d'un composant qui traque le mouvement de la souris. Nous gardons sa position et sa taille dans l'état local :

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

Now let's say we want to write some logic that changes `left` and `top` when the user moves their mouse. Note how we have to merge these fields into the previous state object manually:

```js{4,5}
  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // Spreading "...state" ensures we don't "lose" width and height
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // Note: this implementation is a bit simplified
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

This is because when we update a state variable, we *replace* its value. This is different from `this.setState` in a class, which *merges* the updated fields into the object.

If you miss automatic merging, you can write a custom `useLegacyState` Hook that merges object state updates. However, instead **we recommend to split state into multiple state variables based on which values tend to change together.**

For example, we could split our component state into `position` and `size` objects, and always replace the `position` with no need for merging:

```js{2,7}
function Box() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    function handleWindowMouseMove(e) {
      setPosition({ left: e.pageX, top: e.pageY });
    }
    // ...
```

Separating independent state variables also has another benefit. It makes it easy to later extract some related logic into a custom Hook, for example:

```js{2,7}
function Box() {
  const position = useWindowPosition();
  const [size, setSize] = useState({ width: 100, height: 100 });
  // ...
}

function useWindowPosition() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  useEffect(() => {
    // ...
  }, []);
  return position;
}
```

Note how we were able to move the `useState` call for the `position` state variable and the related effect into a custom Hook without changing their code. If all state was in a single object, extracting it would be more difficult.

Both putting all state in a single `useState` call, and having a `useState` call per each field can work. Components tend to be most readable when you find a balance between these two extremes, and group related state into a few independent state variables. If the state logic becomes complex, we recommend [managing it with a reducer](/docs/hooks-reference.html#usereducer) or a custom Hook.

### Can I run an effect only on updates? {#can-i-run-an-effect-only-on-updates}

This is a rare use case. If you need it, you can [use a mutable ref](#is-there-something-like-instance-variables) to manually store a boolean value corresponding to whether you are on the first or a subsequent render, then check that flag in your effect. (If you find yourself doing this often, you could create a custom Hook for it.)

### How to get the previous props or state? {#how-to-get-the-previous-props-or-state}

Currently, you can do it manually [with a ref](#is-there-something-like-instance-variables):

```js{6,8}
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

This might be a bit convoluted but you can extract it into a custom Hook:

```js{3,7}
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Now: {count}, before: {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

Note how this would work for props, state, or any other calculated value.

```js{5}
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count * 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

It's possible that in the future React will provide a `usePrevious` Hook out of the box since it's a relatively common use case.

See also [the recommended pattern for derived state](#how-do-i-implement-getderivedstatefromprops).

### How do I implement `getDerivedStateFromProps`? {#how-do-i-implement-getderivedstatefromprops}

While you probably [don't need it](/blog/2018/06/07/you-probably-dont-need-derived-state.html), in rare cases that you do (such as implementing a `<Transition>` component), you can update the state right during rendering. React will re-run the component with updated state immediately after exiting the first render so it wouldn't be expensive.

Here, we store the previous value of the `row` prop in a state variable so that we can compare:

```js
function ScrollView({row}) {
  let [isScrollingDown, setIsScrollingDown] = useState(false);
  let [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row changed since last render. Update isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```

This might look strange at first, but an update during rendering is exactly what `getDerivedStateFromProps` has always been like conceptually.

### Is there something like forceUpdate? {#is-there-something-like-forceupdate}

Both `useState` and `useReducer` Hooks [bail out of updates](/docs/hooks-reference.html#bailing-out-of-a-state-update) if the next value is the same as the previous one. Mutating state in place and calling `setState` will not cause a re-render.

Normally, you shouldn't mutate local state in React. However, as an escape hatch, you can use an incrementing counter to force a re-render even if the state has not changed:

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

Try to avoid this pattern if possible.

### Can I make a ref to a function component? {#can-i-make-a-ref-to-a-function-component}

While you shouldn't need this often, you may expose some imperative methods to a parent component with the [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle) Hook.

### What does `const [thing, setThing] = useState()` mean? {#what-does-const-thing-setthing--usestate-mean}

If you're not familiar with this syntax, check out the [explanation](/docs/hooks-state.html#tip-what-do-square-brackets-mean) in the State Hook documentation.


## Performance Optimizations {#performance-optimizations}

### Can I skip an effect on updates? {#can-i-skip-an-effect-on-updates}

Yes. See [conditionally firing an effect](/docs/hooks-reference.html#conditionally-firing-an-effect). Note that forgetting to handle updates often [introduces bugs](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update), which is why this isn't the default behavior.

### How do I implement `shouldComponentUpdate`? {#how-do-i-implement-shouldcomponentupdate}

You can wrap a function component with `React.memo` to shallowly compare its props:

```js
const Button = React.memo((props) => {
  // your component
});
```

It's not a Hook because it doesn't compose like Hooks do. `React.memo` is equivalent to `PureComponent`, but it only compares props. (You can also add a second argument to specify a custom comparison function that takes the old and new props. If it returns true, the update is skipped.)

`React.memo` doesn't compare state because there is no single state object to compare. But you can make children pure too, or even [optimize individual children with `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations).


### How to memoize calculations? {#how-to-memoize-calculations}

The [`useMemo`](/docs/hooks-reference.html#usememo) Hook lets you cache calculations between multiple renders by "remembering" the previous computation:

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

This code calls `computeExpensiveValue(a, b)`. But if the inputs `[a, b]` haven't changed since the last value, `useMemo` skips calling it a second time and simply reuses the last value it returned.

Remember that the function passed to `useMemo` runs during rendering. Don't do anything there that you wouldn't normally do while rendering. For example, side effects belong in `useEffect`, not `useMemo`.

**You may rely on `useMemo` as a performance optimization, not as a semantic guarantee.** In the future, React may choose to "forget" some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without `useMemo` — and then add it to optimize performance. (For rare cases when a value must *never* be recomputed, you can [lazily initialize](#how-to-create-expensive-objects-lazily) a ref.)

Conveniently, `useMemo` also lets you skip an expensive re-render of a child:

```js
function Parent({ a, b }) {
  // Only re-rendered if `a` changes:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Only re-rendered if `b` changes:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

Note that this approach won't work in a loop because Hook calls [can't](/docs/hooks-rules.html) be placed inside loops. But you can extract a separate component for the list item, and call `useMemo` there.

### How to create expensive objects lazily? {#how-to-create-expensive-objects-lazily}

`useMemo` lets you [memoize an expensive calculation](#how-to-memoize-calculations) if the inputs are the same. However, it only serves as a hint, and doesn't *guarantee* the computation won't re-run. But sometimes you need to be sure an object is only created once.

**The first common use case is when creating the initial state is expensive:**

```js
function Table(props) {
  // ⚠️ createRows() is called on every render
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

To avoid re-creating the ignored initial state, we can pass a **function** to `useState`:

```js
function Table(props) {
  // ✅ createRows() is only called once
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React will only call this function during the first render. See the [`useState` API reference](/docs/hooks-reference.html#usestate).

**You might also occasionally want to avoid re-creating the `useRef()` initial value.** For example, maybe you want to ensure some imperative class instance only gets created once:

```js
function Image(props) {
  // ⚠️ IntersectionObserver is created on every render
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef` **does not** accept a special function overload like `useState`. Instead, you can write your own function that creates and sets it lazily:

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver is created lazily once
  function getObserver() {
    let observer = ref.current;
    if (observer !== null) {
      return observer;
    }
    let newObserver = new IntersectionObserver(onIntersect);
    ref.current = newObserver;
    return newObserver;
  }

  // When you need it, call getObserver()
  // ...
}
```

This avoids creating an expensive object until it's truly needed for the first time. If you use Flow or TypeScript, you can also give `getObserver()` a non-nullable type for convenience.


### Are Hooks slow because of creating functions in render? {#are-hooks-slow-because-of-creating-functions-in-render}

No. In modern browsers, the raw performance of closures compared to classes doesn't differ significantly except in extreme scenarios.

In addition, consider that the design of Hooks is more efficient in a couple ways:

* Hooks avoid a lot of the overhead that classes require, like the cost of creating class instances and binding event handlers in the constructor.

* **Idiomatic code using Hooks doesn't need the deep component tree nesting** that is prevalent in codebases that use higher-order components, render props, and context. With smaller component trees, React has less work to do.

Traditionally, performance concerns around inline functions in React have been related to how passing new callbacks on each render breaks `shouldComponentUpdate` optimizations in child components. Hooks approach this problem from three sides.

* The [`useCallback`](/docs/hooks-reference.html#usecallback) Hook lets you keep the same callback reference between re-renders so that `shouldComponentUpdate` continues to work:

    ```js{2}
    // Will not change unless `a` or `b` changes
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* The [`useMemo` Hook](/docs/hooks-faq.html#how-to-memoize-calculations) makes it easier to control when individual children update, reducing the need for pure components.

* Finally, the `useReducer` Hook reduces the need to pass callbacks deeply, as explained below.

### How to avoid passing callbacks down? {#how-to-avoid-passing-callbacks-down}

We've found that most people don't enjoy manually passing callbacks through every level of a component tree. Even though it is more explicit, it can feel like a lot of "plumbing".

In large component trees, an alternative we recommend is to pass down a `dispatch` function from [`useReducer`](/docs/hooks-reference.html#usereducer) via context:

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Note: `dispatch` won't change between re-renders
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

Any child in the tree inside `TodosApp` can use the `dispatch` function to pass actions up to `TodosApp`:

```js{2,3}
function DeepChild(props) {
  // If we want to perform an action, we can get dispatch from context.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

This is both more convenient from the maintenance perspective (no need to keep forwarding callbacks), and avoids the callback problem altogether. Passing `dispatch` down like this is the recommended pattern for deep updates.

Note that you can still choose whether to pass the application *state* down as props (more explicit) or as context (more convenient for very deep updates). If you use context to pass down the state too, use two different context types -- the `dispatch` context never changes, so components that read it don't need to rerender unless they also need the application state.

### How to read an often-changing value from `useCallback`? {#how-to-read-an-often-changing-value-from-usecallback}

>Note
>
>We recommend to [pass `dispatch` down in context](#how-to-avoid-passing-callbacks-down) rather than individual callbacks in props. The approach below is only mentioned here for completeness and as an escape hatch.
>
>Also note that this pattern might cause problems in the [concurrent mode](/blog/2018/03/27/update-on-async-rendering.html). We plan to provide more ergonomic alternatives in the future, but the safest solution right now is to always invalidate the callback if some value it depends on changes.

In some rare cases you might need to memoize a callback with [`useCallback`](/docs/hooks-reference.html#usecallback) but the memoization doesn't work very well because the inner function has to be re-created too often. If the function you're memoizing is an event handler and isn't used during rendering, you can use [ref as an instance variable](#is-there-something-like-instance-variables), and save the last committed value into it manually:

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useLayoutEffect(() => {
    textRef.current = text; // Write it to the ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // Read it from the ref
    alert(currentText);
  }, [textRef]); // Don't recreate handleSubmit like [text] would do

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

This is a rather convoluted pattern but it shows that you can do this escape hatch optimization if you need it. It's more bearable if you extract it to a custom Hook:

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // Will be memoized even if `text` changes:
  const handleSubmit = useEventCallback(() => {
    alert(text);
  }, [text]);

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}

function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useLayoutEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

In either case, we **don't recommend this pattern** and only show it here for completeness. Instead, it is preferable to [avoid passing callbacks deep down](#how-to-avoid-passing-callbacks-down).


## Under the Hood {#under-the-hood}

### How does React associate Hook calls with components? {#how-does-react-associate-hook-calls-with-components}

React keeps track of the currently rendering component. Thanks to the [Rules of Hooks](/docs/hooks-rules.html), we know that Hooks are only called from React components (or custom Hooks -- which are also only called from React components).

There is an internal list of "memory cells" associated with each component. They're just JavaScript objects where we can put some data. When you call a Hook like `useState()`, it reads the current cell (or initializes it during the first render), and then moves the pointer to the next one. This is how multiple `useState()` calls each get independent local state.

### What is the prior art for Hooks? {#what-is-the-prior-art-for-hooks}

Hooks synthesize ideas from several different sources:

* Our old experiments with functional APIs in the [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) repository.
* React community's experiments with render prop APIs, including [Ryan Florence](https://github.com/ryanflorence)'s [Reactions Component](https://github.com/reactions/component).
* [Dominic Gannaway](https://github.com/trueadm)'s [`adopt` keyword](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067) proposal as a sugar syntax for render props.
* State variables and state cells in [DisplayScript](http://displayscript.org/introduction.html).
* [Reducer components](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html) in ReasonReact.
* [Subscriptions](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html) in Rx.
* [Algebraic effects](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting) in Multicore OCaml.

[Sebastian Markbåge](https://github.com/sebmarkbage) came up with the original design for Hooks, later refined by [Andrew Clark](https://github.com/acdlite), [Sophie Alpert](https://github.com/sophiebits), [Dominic Gannaway](https://github.com/trueadm), and other members of the React team.
