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
  * [Que signifie const [thing, setThing] = useState() ?](#what-does-const-thing-setthing--usestate-mean)
* **[Optimisations de performance](#performance-optimizations)**
  * [Puis-je sauter un effet lors de mises à jour ?](#can-i-skip-an-effect-on-updates)
  * [Comment puis-je implémenter shouldComponentUpdate ?](#how-do-i-implement-shouldcomponentupdate)
  * [Comment mémoïser les calculs ?](#how-to-memoize-calculations)
  * [Comment créer des objets lourds sans trop de travail ?](#how-to-create-expensive-objects-lazily)
  * [Les Hooks sont-ils lents à cause de la création de fonctions dans le rendu ?](#are-hooks-slow-because-of-creating-functions-in-render)
  * [Comment éviter de transmettre des fonctions de rappel ?](#how-to-avoid-passing-callbacks-down)
  * [Comment lire une valeur changeant fréquemment avec useCallback ?](#how-to-read-an-often-changing-value-from-usecallback)
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

Maintenant, disons que nous voulons écrire un bout de code pour modifier `left` et `top` quand l'utilisateur bouge la souris. Notez comment nous devons fusionner ces champs dans l'état local précédent manuellement :

```js{4,5}
  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // La déstructuration de "...state" permet de s'assure que l'on ne "perd" pas width et height
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // Notez : cette implémentation est un peu simplifiée
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

Ceci est dû au fait que lorsque nous mettons à jour une variable de l'état local, nous *remplaçons* sa valeur. À la différence de `this.setState` dans une classe, qui *fusionne* les champs mis à jour dans l'objet.

Si la fusion automatique vous manque, vous pouvez écrire un Hook personnalisé `useLgacyState` qui fusionne les mises à jour de l'état local. Cependant, au lieu de ça **nous recommandons de séparer l'état local en de multiple variables d'état en se basant sur celles qui ont tendance à changer de valeur ensemble**.

Par exemple, nous pouvons séparer l'état local de notre composant en deux objets `position` et `size`, et toujours remplacer la `position` sans avoir besoin de fusionner :

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

Séparer les variables d'état indépendantes a également un autre intérêt. Il devient alors facile d'extraire une partie de la logique dans un Hook personnalisé, par exemple :

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

Notez comment nous avons pu déplacer l'appel à `useState` pour la variable d'état local `position` et l'effet associé dans un Hook personnalisé sans rien changer au code. Si tout l'état local était un unique objet, l'extraire aurait été plus difficile.

Les deux méthodes, mettre tout l'état local dans un simple appel à `useState` et avoir un appel à `useState` par champ, sont possibles. La lisibilité des composants dépendra de la balance que vous trouverez entre ces deux extrêmes, et le regroupement de l'état local associé en quelques variables d'état indépendantes. Si la logique de l'état local devient trop complexe, nous recommandons de la [gérer avec un réducteur](/docs/hooks-reference.html#usereducer) ou un Hook personnalisé.

### Puis-je exécuter un effet seulement lors des mises à jour ? {#can-i-run-an-effect-only-on-updates}

C'est un cas d'utilisation assez rare. Si vous en avez besoin, vous pouvez [utiliser une ref modifiable](#is-there-something-like-instance-variables) pour stocker manuellement un booléen indiquant si vous êtes sur le premier rendu ou un rendu postérieur, et vérifier ensuite ce drapeau dans votre effet. (Si vous vous trouvez à agir de la sorte régulièrement, vous pouvez sans doute créer un Hook personnalisé pour ça.)

### Comment récupérer les props ou l'état local précédent(s) ? {#how-to-get-the-previous-props-or-state}

Actuellement, vous pouvez le faire manuellement [avec une ref](#is-there-something-like-instance-variables) :

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

Cela peut sembler un peu trop complexifier les choses mais vous pouvez l'extraire dans un Hook personnalisé :

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

Notez que ceci peut fonctionner pour les props, l'état local, et toute autre valeur calculée.

```js{5}
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count * 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

Il est possible que dans le futur React fournisse un Hook `usePrevious` prêt à l'emploi, comme c'est un cas d'usage assez commun.

Voir aussi [le pattern recommandé pour un état local dérivé](#how-do-i-implement-getderivedstatefromprops).

### Comment puis-je implémenter getDerivedStateFromProps ? {#how-do-i-implement-getderivedstatefromprops}

Même si vous n'en avez probablement [pas besoin](/blog/2018/06/07/you-probably-dont-need-derived-state.html), dans de rares cas (comme implémenter un composant `<Transition>`) vous pouvez mettre à jour l'état local en plein rendu. React va ré-évaluer le composant avec l'état local mis à jour immédiatement après être sorti du premier rendu afin que 
ça ne soit pas trop couteux.

Ici, nous stockons la valeur précédente de la prop `row` dans une variable de l'état local afin que nous puissions les comparer :

```js
function ScrollView({row}) {
  let [isScrollingDown, setIsScrollingDown] = useState(false);
  let [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row a changé depuis le dernier rendu. Met à jour isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `On défile vers le bas: ${isScrollingDown}`;
}
```

Ça peut sembler étrange à première vue, mais une mise à jour pendant le rendu est exactement ce pourquoi a été conçu `getDerivedStateFromProps`.

### Existe-t-il un équivalent à forceUpdate ? {#is-there-something-like-forceupdate}

Les deux Hooks `useState` et `useReducer` [refoulent les mises à jour](/docs/hooks-reference.html#bailing-out-of-a-state-update) si la valeur suivante est la même que la valeur précédente. Modifier l'état local en place et appeler `setState` ne causera pas de nouveau rendu.

Généralement, vous ne devez pas modifier l'état local en React. Cependant, si vous cherchez une astuce, vous pouvez un compteur incrémental pour forcer un re-rendu même si l'état local n'a pas changé :

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

Éviter d'utiliser ce pattern autant que possible.

### Puis-je créer une ref vers une fonction composant ? {#can-i-make-a-ref-to-a-function-component}

Bien que vous ne devriez pas en avoir besoin souvent, vous pouvez exposer quelques méthodes impératives à un composant parent avec le Hook [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle).

### Que signifie const [thing, setThing] = useState() ? {#what-does-const-thing-setthing--usestate-mean}

If you're not familiar with this syntax, check out the [explanation](/docs/hooks-state.html#tip-what-do-square-brackets-mean) in the State Hook documentation.

Si vous n'êtes pas familier avec cette syntaxe, allez voir l'[explication](/docs/hooks-state.html#tip-what-do-square-brackets-mean) dans la documentation du Hook de l'état local

## Optimisations de performance {#performance-optimizations}

### Puis-je sauter un effet lors de mises à jour ? {#can-i-skip-an-effect-on-updates}

Oui. Reportez-vous au [déclenchement conditionnel d'un effet](/docs/hooks-reference.html#conditionally-firing-an-effect). Notez qu'oublier de gérer des mises à jour est souvent [source de bugs](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update), ce qui explique pourquoi ce n'est pas le comportement par défaut.

### Comment puis-je implémenter shouldComponentUpdate ? {#how-do-i-implement-shouldcomponentupdate}

Vous pouvez enrober une fonction composant avec `React.memo` pour comparer superficiellement ses props :

```js
const Button = React.memo((props) => {
  // votre composant
});
```

Ce n'est pas un Hook car il n'est pas composé de la même manière. `React.memo` est équivalent à `PureComponent`, mais ne compare que les props. (Vous pouvez aussi ajouter un second argument pour spécifier une fonction de comparaison personnalisée qui prendra en arguments les anciennes et nouvelles props. Si elle retourne true, la mise à jour est évitée.)

`React.memo` ne compare pas l'état local car il n'y a aucun objet d'état local à comparer. Mais vous pouvez rendre les descendants purs également, ou même [optimiser les descendants séparément avec `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations).

### Comment mémoïser les calculs ? {#how-to-memoize-calculations}

Le Hook [`useMemo`](/docs/hooks-reference.html#usememo) vous permet de cacher les calculs entre plusieurs rendus en "se remémorant" le dernier calcul.

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Ce code appelle `computeExpensiveValue(a, b)`. Mais si les arguments `[a, b]` n'ont pas changé depuis le dernier calcul, `useMemo` saute le second appel et réutilise la dernière valeur retournée.

Rappelez-vous que la fonction passée à `useMemo` s'exécute pendant le rendu. Ne faîtes rien ici que vous ne feriez normalement pendant le rendu. Par exemple, les effets de bord sont du ressort de `useEffect`, pas `useMemo`.

**Vous pouvez vous appuyer sur `useMemo` pour les optimisations de performance, mais pas comme garantie sémantique.** Dans le futur, React peut très bien choisir d'"oublier" certaines valeurs préalablement mémoïsées et les recalculer lors du rendu suivant, i.e. pour libérer de la mémoire pour les composants hors écran. Écrivez votre code de façon à ce qu'il fonctionne toujours sans `useMemo` - et ajoutez-le ensuite pour optimiser les performances. (Pour de rares cas où une valeur ne doit *jamais* être recalculée, vous pouvez utiliser [initialiser paresseusement](#how-to-create-expensive-objects-lazily) une ref.)

Par commodité, `useMemo` vous permet aussi d'éviter le re-rendu trop lourd d'un enfant :

```js
function Parent({ a, b }) {
  // Ne fait le re-rendu que si `a` change:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Ne fait le re-rendu que si `b` change:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

Notez que cette approche ne fonctionne pas dans une boucle car les appels aux Hooks [ne peuvent](/docs/hooks-rules.html) être placé dans des boucles. Mais vous pouvez extraire la liste dans un composant à part, et appeler `useMemo` depuis celui-ci.

### Comment créer des objets lourds sans trop de travail ? {#how-to-create-expensive-objects-lazily}

`useMemo` vous permet de [mémoïser un calcul coûteux](#how-to-memoize-calculations) si les arguments sont les mêmes. Cependant, il n'est là que pour aider, et ne *garantit* pas que le calcul ne se refera pas. Mais parfois vous devez vous assurer qu'un objet n'est créé qu'une seule fois.

**Le principal cas d'utilisation est lorsque la création de l'état initial est coûteux :**

```js
function Table(props) {
  // ⚠️ createRows() est appelé lors de chaque rendu
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

Pour éviter de recréer l'état initial ignoré, nous pouvons passer une **fonction** à `useState` :

```js
function Table(props) {
  // ✅ createRows() n'est appelé qu'une seule fois
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React n'appelera cette fonction que lors du premier rendu. Voir l'[API de référence de `useState`](/docs/hooks-reference.html#usestate).

**Vous pouvez aussi vouloir occasionnellement éviter de recréer la valeur initiale de `useRef()`.** Par exemple, vous voulez peut-être vous assurer qu'une instance de classe majeure n'est créée qu'une seule fois :

```js
function Image(props) {
  // ⚠️ IntersectionObserver est créé à chaque rendu
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef` **n'accepte pas** de surcharge de fonction spécial comme `useState`. Au lieu de ça, vous pouvez écrire votre propre fonction qui la créer et la définit paresseusement : 

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver est créé paresseusement une seule fois
  function getObserver() {
    let observer = ref.current;
    if (observer !== null) {
      return observer;
    }
    let newObserver = new IntersectionObserver(onIntersect);
    ref.current = newObserver;
    return newObserver;
  }

  // Quand vous en avez besoin, appelez getObserver()
  // ...
}
```

Ça permet d'éviter de recréer un objet lourd tant que ce n'est pas nécessaire. Si vous utilisez Flow ou TypeScript, vous pouvez aussi donner à `getObserver()` un type non nul pour plus de commodités.

### [Les Hooks sont-ils lents à cause de la création de fonctions dans le rendu ? {#are-hooks-slow-because-of-creating-functions-in-render}

Non. Dans les navigateurs modernes, les performances brutes des fermetures lexicales comparées à celles des classes ne diffèrent pas énormément, sauf lors des scénarios extrêmes.

Par ailleurs, considerez que la conception de Hooks est plus rentable pour deux raisons :

* Les Hooks permettent d'éviter une grande partie de l'investissement requis par les classes, comme le coût de la création d'instances de classe et la liaison des gestionnaires d'événements dans le constructeur.

* **Le code idiomatique utilisant des Hooks n'a pas besoin d'une aussi grande imbrication de composants** comme cela prevaut dans des projets utilisants des composants d'ordre supérieur, des props de rendu, et des contextes. Avec des arborescences plus petites, React a moins de travail à faire.

Traditionnellement, les problématiques de performance autour des fonctions en ligne en React sont liés au fait que le passage de nouvelles fonctions de rappel à chaque rendu brise les optimisations de `shouldComponentUpdate` dans les composants enfants. Les Hooks abordent ce problème sous trois angles.

* Le Hook [`useCallback`](/docs/hooks-reference.html#usecallback) vous permettent d'utiliser la référence à la même fonction de rappel entre les re-rendus afin que `shouldComponentUpdate` puisse continuer de fonctionner :

    ```js{2}
    // Ne changera pas sauf si `a` ou `b` change
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* Le [Hook `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations) permet de contrôler plus facilement les mises à jour des enfants, réduisant le besoin de en composants purs.

* Enfin, le Hook `useReducer` réduit le besoin de passer des fonctions de rappel en profondeur, comme expliqué ci-dessous.

### Comment éviter de transmettre des fonctions de rappel ? {#how-to-avoid-passing-callbacks-down}

Nous nous sommes aperçus que la majorité des gens n'aime pas passer des fonctions de rappel au travers de chaque niveau de l'arborescence. Même si c'est plus explicite, ça peut ressembler à de la "plomberie".

Dans de grosses abrorescences de composants, l'alternative que nous recommandons est de transmettre une fonction `dispatch` depuis [`useReducer`](/docs/hooks-reference.html#usereducer) via le contexte :

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Notez : `dispatch` ne va pas changer entre les re-rendus
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

Chaque enfant de l'arborescence dans `TodosApp` peut utiliser la fonction `dispatch` pour remonter des actions à `TodosApp` :

```js{2,3}
function DeepChild(props) {
  // Si nous voulons exécuter une action, nous pouvons récupérer dispatch depuis le contexte.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'salut' });
  }

  return (
    <button onClick={handleClick}>Ajouter une tâche</button>
  );
}
```

C'est à la fois plus pratique d'un point de vue maintenance (pas besoin de continuer à passer des fonctions de rappel), et règle aussi le problème de fonction de rappel en même temps. Transmettre `dispatch` de cette façon est le pattern à suivre pour les mises à jour en profondeur.

Notez que vous pouvez toujours choisir de transmettre l'*état* de l'application comme props (plsu explicite) ou comme contexte (plus pratique pour les mises à jour très profondes). Si vous utilisez le contexte pour transmettre l'état local également, utilisez deux types de contexte différents -- le contexte `dispatch` ne change jamais, dont les composants qui l'utilisent n'ont pas besoin de refaire de rendu à moins qu'ils aient aussi besoin de l'état de l'application.

### Comment lire une valeur changeant fréquemment avec `useCallback` ? {#how-to-read-an-often-changing-value-from-usecallback}

>Note
>
>Nous recommandons de [transmettre `dispatch` dans le contexte](#how-to-avoid-passing-callbacks-down) plutôt que des fonctions de rappel individuelles dans les props. L'approche ci-dessous n'est mentionnée que pour des raisons d'exhaustivité et comme solution de secours.
>
>Notez aussi que ce pattern peut être à l'origine de problèmes dans le [mode concurrent](/blog/2018/03/27/update-on-async-rendering.html). Nous prévoyons de proposer des alternatives plus ergonomiques dans le futur, mais la solution la plus sûre pour l'instant est de toujours invalider la fonction de rappel si certaines valeurs dont elle dépend changent.

Dans de rares cas vous pourriez avoir besoin de mémoïser une fonction de rappel avec [`useCallback`](/docs/hooks-reference.html#usecallback) mais la mémoïsation ne fonctionne pas très bien parce que la fonction interne a besoin d'être recréer trop souvent. Si la fonction que vous mémoïsez est un gestionnaire d'événement et n'est pas utilisée pendant le rendu, vous pouvez utiliser une [ref comme variable d'instance](#is-there-something-like-instance-variables), et y stocker la dernière valeur retournée manuellement :

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useLayoutEffect(() => {
    textRef.current = text; // Écriture dans la ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // Lecture depuis la ref
    alert(currentText);
  }, [textRef]); // Ne recréer pas handleSubmit comme [text] le ferait

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

C'est un pattern un peu confusant mais cela montre que vous pouvez faire cette optimisation si vous en avez besoin en dernier ressort. Il est plus noble de l'extraire dans un Hook personnalisé :


```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // Sera mémoïsé même si `text` change :
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
    throw new Error('Ne peut pas appeler un gestionnaire d\'événement pendant le rendu');
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

Dans les deux cas, nous **ne recommandons pas ce pattern** et ne le mettons en évidence ici que dans un souci d'exhaustivité. Au lieu de ça, il est préférable d'[éviter de transmettre des fonctions de rappel en profondeur](#how-to-avoid-passing-callbacks-down).


## Sous le capot {#under-the-hood}

### Quelles sont les idées à l'origine des Hooks ? {#how-does-react-associate-hook-calls-with-components}

React garde une trace du composant en cours de rendu. Grâce aux [Règles des Hooks](/docs/hooks-rules.html), nous savons que les Hooks sont uniquement appelés depuis des composants React (ou des Hooks personnalisés -- qui sont aussi uniquement appelés depuis des composants React).

Il existe une liste interne de "cellules mémoire" associées à chaque composant. Seuls des objets JavaScript peuvent contenir des données. Quand vous appelez un Hook tel que `useState()`, il lit la cellule courante (ou l'initialise pendant le premier rendu), et déplace alors le pointeur au prochain. C'est ainsi que de multiples appels à `useState()` peuvent avoir chacun un état local indépendant.

### Quelles sont les idées à l'origine des Hooks ? {#what-is-the-prior-art-for-hooks}

Les Hooks synthétisent des idées de plusieurs sources différentes :

* Nos précédents essais avec des APIs fonctionnelles dans le repo [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State).
* Les essaie de la communauté React avec les APIs de props de rendu, y compris le [composant Reaction](https://github.com/reactions/component) de [Ryan Florence](https://github.com/ryanflorence).
* La proposition de [mot-clé `adopt`](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067) de [Dominic Gannaway](https://github.com/trueadm) comme syntaxe plus douce pour les props de rendu.
* State variables and state cells in [DisplayScript](http://displayscript.org/introduction.html).
* Les variables d'état et les cellules à état en DisplayScript](http://displayscript.org/introduction.html).
* [Reducer components](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html) in ReasonReact.
* Les [composants réducteurs](https://reasonml.github.io/reason-react/docs/fr/state-actions-reducer.html) de ReasonReact.
* Les [souscriptions](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html) de Rx.
* Les [effets algébriques](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting) de OCaml Multicore.

[Sebastian Markbåge](https://github.com/sebmarkbage) a proposé la première conception des Hooks, plus tard peaufinée par [Andrew Clark](https://github.com/acdlite), [Sophie Alpert](https://github.com/sophiebits), [Dominic Gannaway](https://github.com/trueadm), et d'autres membres de l'équipe React.