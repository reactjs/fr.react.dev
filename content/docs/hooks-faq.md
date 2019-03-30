---
id: hooks-faq
title: FAQ des Hooks
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

Les *Hooks* sont une nouveauté de React 16.8. Ils permettent de bénéficier d’un état local et d'autres fonctionnalités de React sans avoir à écrire de classes.

Cette page contient les réponses aux questions les plus fréquentes sur les [Hooks](/docs/hooks-overview.html).

<!--
  if you ever need to regenerate this, this snippet in the devtools console might help:

  $$('.anchor').map(a =>
    `${' '.repeat(2 * +a.parentNode.nodeName.slice(1))}` +
    `[${a.parentNode.textContent}](${a.getAttribute('href')})`
  ).join('\n')
-->
* **[Stratégie d'adoption](#adoption-strategy)**
  * [Quelles versions de React incluent les Hooks ?](#which-versions-of-react-include-hooks)
  * [Dois-je réécrire tous mes composants à base de classe ?](#do-i-need-to-rewrite-all-my-class-components)
  * [Que puis-je faire avec les Hooks qu'il est impossible de faire avec des classes ?](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [Quelle proportion de mes connaissances en React reste pertinente ?](#how-much-of-my-react-knowledge-stays-relevant)
  * [Dois-je utiliser des Hooks, des classes ou un mélange des deux ?](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [Est-ce que les Hooks couvrent tous les cas d'utilisation des classes ?](#do-hooks-cover-all-use-cases-for-classes)
  * [Est-ce que les Hooks remplacent les props de rendu et les composants d'ordre supérieur ?](#do-hooks-replace-render-props-and-higher-order-components)
  * [Qu'est-ce que les Hooks changent pour les API populaires telles que Redux `connect()` et React Router ?](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [Est-ce que les Hooks sont compatibles avec le typage statique ?](#do-hooks-work-with-static-typing)
  * [Comment tester des composants utilisant des Hooks ?](#how-to-test-components-that-use-hooks)
  * [Qu'est-ce que les règles de linting imposent ?](#what-exactly-do-the-lint-rules-enforce)
* **[Des classes aux Hooks](#from-classes-to-hooks)**
  * [Quelles sont les correspondances entre les méthodes de cycle de vie et les Hooks ?](#how-do-lifecycle-methods-correspond-to-hooks)
  * [Existe-t-il un équivalent aux variables d'instances ?](#is-there-something-like-instance-variables)
  * [Dois-je utiliser une ou plusieurs variables d'état local ?](#should-i-use-one-or-many-state-variables)
  * [Puis-je exécuter un effet seulement lors des mises à jour ?](#can-i-run-an-effect-only-on-updates)
  * [Comment récupérer les props ou l'état local précédents ?](#how-to-get-the-previous-props-or-state)
  * [Comment puis-je implémenter `getDerivedStateFromProps` ?](#how-do-i-implement-getderivedstatefromprops)
  * [Existe-t-il un équivalent à `forceUpdate` ?](#is-there-something-like-forceupdate)
  * [Puis-je créer une ref vers une fonction composant ?](#can-i-make-a-ref-to-a-function-component)
  * [Que signifie `const [thing, setThing] = useState()` ?](#what-does-const-thing-setthing--usestate-mean)
* **[Optimisations des performances](#performance-optimizations)**
  * [Puis-je sauter un effet lors des mises à jour ?](#can-i-skip-an-effect-on-updates)
  * [Comment puis-je implémenter `shouldComponentUpdate` ?](#how-do-i-implement-shouldcomponentupdate)
  * [Comment mémoïser les calculs ?](#how-to-memoize-calculations)
  * [Comment créer paresseusement des objets coûteux ?](#how-to-create-expensive-objects-lazily)
  * [La création de fonctions à la volée pendant le rendu ralentit-elle les Hooks ?](#are-hooks-slow-because-of-creating-functions-in-render)
  * [Comment éviter de transmettre des fonctions de rappel ?](#how-to-avoid-passing-callbacks-down)
  * [Comment lire une valeur changeant fréquemment avec `useCallback` ?](#how-to-read-an-often-changing-value-from-usecallback)
* **[Sous le capot](#under-the-hood)**
  * [Comment React associe-t-il les appels de Hooks avec les composants ?](#how-does-react-associate-hook-calls-with-components)
  * [Quelles sont les sources d'inspiration des Hooks ?](#what-is-the-prior-art-for-hooks)

## Stratégie d'adoption {#adoption-strategy}

### Quelles versions de React incluent les Hooks ? {#which-versions-of-react-include-hooks}

Depuis la version 16.8.0, React embarque une implémentation stable de React Hooks pour :

* React DOM
* React DOM Server
* Le moteur de rendu de test de React
* Le moteur de rendu superficiel de React

Remarquez que **pour activer les Hooks, tous les paquets React doivent être en version 16.8.0 ou supérieure**. Les Hooks ne fonctionneront pas si vous oubliez de mettre à jour React DOM, par exemple.

React Native prendra complètement en charge les Hooks dans sa prochaine version stable.

### Dois-je réécrire tous mes composants à base de classe ? {#do-i-need-to-rewrite-all-my-class-components}

Non. Il n'est [pas prévu](/docs/hooks-intro.html#gradual-adoption-strategy) de retirer les classes de React : nous avons tous besoin de continuer à livrer nos produits et ne pouvons pas nous permettre de réécrire tout le code. Nous recommandons d'essayer les Hooks dans de nouveaux composants et projets.

### Que puis-je faire avec les Hooks qu'il est impossible de faire avec des classes ? {#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

Les Hooks offrent un nouveau moyen puissant et expressif de réutiliser des fonctionnalités entre composants. [« Contruire vos propres Hooks »](/docs/hooks-custom.html) offre un aperçu des possibilités. [Cet article](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889) écrit par un membre de l'équipe noyau de React explore plus en détail les nouvelles possibilités apportées par les Hooks.

### Quelle proportion de mes connaissances en React reste pertinente ? {#how-much-of-my-react-knowledge-stays-relevant}

Les Hooks sont un moyen plus direct d'utiliser les fonctionnalités de React que vous connaissez déjà, telles que l’état local, le cycle de vie, le contexte et les refs. Ils ne changent pas fondamentalement la façon dont React fonctionne, et vos connaissances des composants, des props, et du flux de données descendant sont toujours valides.

Les Hooks ont tout de même une courbe d'apprentissage. Si quelque chose manque dans leur documentation, [créez un ticket](https://github.com/reactjs/reactjs.org/issues/new) sur le dépôt GitHub et nous essaierons de vous aider.

### Dois-je utiliser des Hooks, des classes ou un mélange des deux ? {#should-i-use-hooks-classes-or-a-mix-of-both}

Quand vous serez prêt·e, nous vous conseillons de commencer à essayer les Hooks dans les nouveaux composants que vous écrirez. Assurez-vous que chaque membre de votre équipe soit partant·e pour les utiliser, et à l’aise avec cette documentation. Nous déconseillons de réécrire vos classes existantes avec les Hooks, sauf si vous aviez déjà prévu de les réécrire de toute façon (ex. pour corriger des bugs).

Vous ne pouvez pas utiliser les Hooks *à l'intérieur* d'un composant à base de classe, mais vous pouvez complètement mélanger classes et fonctions composants utilisant des Hooks dans une même arborescence. Qu'un composant soit une classe ou une fonction utilisant les Hooks ne constitue qu’un détail d'implémentation de ce composant. Sur le long terme, nous nous attendons à ce que l’essentiel des composants React soient écrits à base de Hooks.

### Est-ce que les Hooks couvrent tous les cas d'utilisation des classes ? {#do-hooks-cover-all-use-cases-for-classes}

Notre but est que les Hooks couvrent tous les cas d'utilisation des classes dès que possible. Il n’existe pas pour l'instant d'équivalent en Hook pour les méthodes de cycle de vie moins courantes que sont `getSnapshotBeforeUpdate` et `componentDidCatch`, mais nous prévoyons de les ajouter rapidement.

Les Hooks en sont encore à leur débuts, et quelques bibliothèques tierces peuvent ne pas être compatibles avec les Hooks à l'heure actuelle.

### Est-ce que les Hooks remplacent les props de rendu et les composants d'ordre supérieur ? {#do-hooks-replace-render-props-and-higher-order-components}

Souvent, les props de rendu et les composants d'ordre supérieur n’affichent qu’un seul enfant. Nous pensons que les Hooks simplifient ce cas d'utilisation. Ces deux approches restent pertinentes (par exemple, un composant de défilement virtuel pourrait avoir une prop `renderItem`, ou un composant de conteneur visuel pourrait avoir sa propre structure DOM). Mais dans la plupart des cas, les Hooks seront suffisants et pourront aider à réduire l'imbrication dans votre arborescence de composants.

### Qu'est-ce que les Hooks changent pour les API populaires telles que Redux `connect()` et React Router ? {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}

Vous pouvez continuer à utiliser les mêmes API que d'habitude ; elles fonctionneront toujours comme avant.

À l'avenir, de nouvelles versions de ces bibliothèques pourraient aussi exposer des Hooks personnalisés tels que `useRedux()` ou `useRouter()` qui vous permettraient d'utiliser les mêmes fonctionnalités sans avoir besoin de composants d'enrobage.

### Est-ce que les Hooks sont compatibles avec le typage statique ? {#do-hooks-work-with-static-typing}

Les Hooks ont été conçus avec le typage statique à l'esprit. Comme ce sont des fonctions, il est plus facile de les typer correctement que d'autres approches telles que les composants d'ordre supérieur. Les dernières définitions Flow et TypeScript pour React prennent en charge les Hooks React.

Surtout, les Hooks personnalisés vous donnent la possibilité de restreindre l'API React si vous souhaitez les typer de façon plus stricte. React vous fournit des primitives, mais vous pouvez les combiner de façons différentes de celles que nous fournissons d'entrée de jeu.

### Comment tester des composants utilisant des Hooks ? {#how-to-test-components-that-use-hooks}

Du point de vue de React, un composant utilisant des Hooks est un composant normal. Si votre solution de test ne repose pas sur des fonctionnements internes de React, tester des composants avec des Hooks ne devrait pas être différent de la façon dont vous testez vos composants habituellement.

Par exemple, prenons ce composant de comptage :

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
        Cliquez ici
      </button>
    </div>
  );
}
```

Nous le testerons en utilisant React DOM. Pour être certains que le comportement correspond à ce qui se passerait dans le navigateur, nous enroberons le code d'affichage et de mise à jour par des appels à [`ReactTestUtils.act()`](/docs/test-utils.html#act) :

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
  // Test du premier rendu et de son effet
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Vous avez cliqué 0 fois');
  expect(document.title).toBe('Vous avez cliqué 0 fois');

  // Test du second rendu et de son effet
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('Vous avez cliqué 1 fois');
  expect(document.title).toBe('Vous avez cliqué 1 fois');
});
```

Les appels à `act()` vont aussi traiter les effets qu'ils contiennent.

Si vous souhaitez tester un Hook personnalisé, c'est possible en créant un composant dans votre test, et en utilisant le Hook depuis celui-ci. Vous pourrez alors tester le composant que vous venez de créer.

Pour réduire le code générique, nous vous conseillons d'utiliser [`react-testing-library`](https://git.io/react-testing-library) qui est conçu de manière à encourager l'écriture de tests utilisant les composants comme le feraient les utilisateurs finaux.

### Qu'est-ce que les [règles de linting](https://www.npmjs.com/package/eslint-plugin-react-hooks) imposent ? {#what-exactly-do-the-lint-rules-enforce}

Nous mettons à disposition un [plugin ESlint](https://www.npmjs.com/package/eslint-plugin-react-hooks) qui impose [les règles des Hooks](/docs/hooks-rules.html) pour éviter les bugs. Il part du principe que toute fonction commençant par "`use`" suivi d'une lettre majuscule est un Hook. Nous admettons que cette heuristique n'est pas parfaite et peut déclencher des faux positifs, mais sans convention au niveau de l'écosystème, il n'existe aucun moyen de faire fonctionner les Hooks correctement—et des noms plus longs décourageront l'adoption des Hooks ou le respect des conventions par la communauté.

En particulier, la règle impose que :

* Les appels de Hooks soient situés soit à l'intérieur d'une fonction nommée en casse `PascalCase` (supposée être un composant) ou d'une autre fonction `useSomething` (supposée être un Hook personnalisé).
* Les Hooks soient appelés dans le même ordre à chaque rendu.

Il existe quelques autres heuristiques, et elles changeront peut-être avec le temps, au fur et à mesure que nous peaufinons la règle pour améliorer la découverte de bugs tout en évitant les faux positifs.

## Des classes aux Hooks {#from-classes-to-hooks}

### Quelles sont les correspondances entre les méthodes de cycle de vie et les Hooks ? {#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor` : les fonctions composants n'ont pas besoin d'un constructeur. Vous pouvez initialiser l'état local lors de l'appel à [`useState`](/docs/hooks-reference.html#usestate). Si le calcul de l'état local initial est trop coûteux, vous pouvez passer une fonction à `useState`.
* `getDerivedStateFromProps` : planifiez plutôt une mise à jour [pendant le rendu](#how-do-i-implement-getderivedstatefromprops).
* `shouldComponentUpdate` : voyez `React.memo` [ci-dessous](#how-do-i-implement-shouldcomponentupdate).
* `render` : c'est le corps-même de la fonction composant.
* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` : le [Hook `useEffect`](/docs/hooks-reference.html#useeffect) peut exprimer toutes les combinaisons de celles-ci (y compris des cas [moins](#can-i-skip-an-effect-on-updates) [fréquents](#can-i-run-an-effect-only-on-updates)).
* `componentDidCatch` et `getDerivedStateFromError` : il n'existe pas encore de Hook équivalent pour ces méthodes, mais ils seront ajoutés prochainement.

### Existe-t-il un équivalent aux variables d'instances ? {#is-there-something-like-instance-variables}

Oui ! Le Hook [`useRef()`](/docs/hooks-reference.html#useref) n'est pas seulement pour les refs au DOM. L'objet "ref" est un conteneur générique dont la propriété `current` est modifiable et peut contenir n'importe quelle valeur, de la même façon qu'une propriété d'instance dans une classe.

Vous pouvez lui affecter une valeur depuis `useEffect` :

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

Si nous avions juste voulu définir une horloge, nous n'aurions pas eu besoin de la ref (`id` pouvait rester local à l'effet) mais ça peut être utile si nous voulons arrêter l'horloge depuis un gestionnaire d’événements.

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

Conceptuellement, vous pouvez vous représenter les refs comme des variables d'instance dans une classe. À moins que vous n'ayez recours à de l'[initialisation paresseuse](#how-to-create-expensive-objects-lazily), évitez d’écrire dans vos refs pendant le rendu : ça peut donner des comportements hasardeux. Au lieu de ça, vous voudrez généralement modifier les refs au sein de gestionnaires d'événements ou d’effets.

### Dois-je utiliser une ou plusieurs variables d'état local ? {#should-i-use-one-or-many-state-variables}

Si vous avez l'habitude des classes, vous serez peut-être tenté·e de toujours appeler `useState()` une seule fois, en mettant tout l'état local dans un unique objet. Si vous y tenez, c'est tout à fait possible. Voici un exemple d'un composant qui piste le mouvement de la souris. Nous gardons sa position et sa taille dans l'état local :

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

Maintenant, disons que nous voulons écrire un bout de code pour modifier `left` et `top` quand l'utilisateur bouge la souris. Voyez comme nous devons fusionner manuellement ces champs dans l'état local précédent :

```js{4,5}
  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // La décomposition de "...state" permet de s’assurer qu’on ne « perd » pas width et height
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // Remarque : cette implémentation est un peu simplifiée
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

C'est dû au fait que lorsque nous mettons à jour une variable de l'état local, nous *remplaçons* sa valeur, alors qu’avec `this.setState` dans une classe, on *fusionne* les champs mis à jour dans l'objet.

Si la fusion automatique vous manque, vous pouvez écrire un Hook personnalisé `useLegacyState` qui fusionne les mises à jour de l'état local. Cependant, **nous recommandons plutôt de séparer l'état local en de multiple variables d'état en se basant sur celles qui ont tendance à changer de valeur ensemble**.

Par exemple, nous pourrions découper l'état local de notre composant en deux objets `position` et `size`, et toujours remplacer la `position` sans avoir besoin de fusionner :

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

Séparer les variables d'état indépendantes présente un intérêt supplémentaire : il devient facile d'extraire une partie de la logique dans un Hook personnalisé, par exemple :

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

Remarquez comme nous avons pu déplacer l'appel à `useState` pour la variable d'état local `position` et l'effet associé dans un Hook personnalisé sans rien changer au code. Si tout l'état local était un unique objet, extraire cet aspect aurait été plus difficile.

Les deux approches sont possibles : mettre tout l'état local dans un unique appel à `useState` ou avoir un appel à `useState` par champ. La lisibilité des composants sera fonction de l'équilibre que vous trouverez entre ces deux extrêmes, et du regroupement des états locaux associés en quelques variables d'état indépendantes. Si la logique de l'état local devient trop complexe, nous vous conseillons de plutôt la [gérer avec un réducteur](/docs/hooks-reference.html#usereducer) ou un Hook personnalisé.

### Puis-je exécuter un effet seulement lors des mises à jour ? {#can-i-run-an-effect-only-on-updates}

C'est un cas d'utilisation assez rare. Si vous en avez besoin, vous pouvez [utiliser une ref modifiable](#is-there-something-like-instance-variables) pour stocker manuellement un booléen indiquant si vous êtes sur le premier rendu ou un rendu postérieur, et vérifier ensuite ce drapeau dans votre effet. (Si vous faites ça régulièrement, vous voudrez sans doute créer un Hook personnalisé pour ça.)

### Comment récupérer les props ou l'état local précédents ? {#how-to-get-the-previous-props-or-state}

Actuellement, vous pouvez le faire manuellement [avec une ref](#is-there-something-like-instance-variables) :

```js{6,8}
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return <h1>Maintenant : {count}, avant : {prevCount}</h1>;
}
```

Ça peut sembler un peu biscornu mais vous pouvez l'extraire dans un Hook personnalisé :

```js{3,7}
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Maintenant : {count}, avant : {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

Remaquez que ça fonctionne pour les props, l'état local, et toute autre valeur calculée.

```js{5}
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count * 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

Il est possible qu’à l'avenir React fournisse un Hook `usePrevious` prêt à l'emploi, puisque c'est un cas d'usage assez fréquent.

Voir aussi [l’approche recommandée pour un état local dérivé](#how-do-i-implement-getderivedstatefromprops).

### Comment puis-je implémenter `getDerivedStateFromProps` ? {#how-do-i-implement-getderivedstatefromprops}

Même si vous n'en avez probablement [pas besoin](/blog/2018/06/07/you-probably-dont-need-derived-state.html), dans les rares cas où c'est nécessaire (comme implémenter un composant `<Transition>`) vous pouvez mettre à jour l'état local en plein rendu. React va rafraîchir le composant avec l'état local mis à jour immédiatement après être sorti du premier rendu afin que ça ne soit pas trop coûteux.

Ici, nous stockons la valeur précédente de la prop `row` dans une variable de l'état local afin que nous puissions les comparer :

```js
function ScrollView({row}) {
  let [isScrollingDown, setIsScrollingDown] = useState(false);
  let [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row a changé depuis le dernier rendu. Met à jour isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `On défile vers le bas : ${isScrollingDown}`;
}
```

Ça peut sembler étrange à première vue, mais `getDerivedStateFromProps` avait précisément été conçue pour des mises à jour pendant le rendu.

### Existe-t-il un équivalent à forceUpdate ? {#is-there-something-like-forceupdate}

Les deux Hooks `useState` et `useReducer` [abandonnent la mise à jour](/docs/hooks-reference.html#bailing-out-of-a-state-update) si la valeur suivante est la même que la valeur précédente. Modifier l'état local en place et appeler `setState` ne causera pas de rafraîchissement.

Généralement, vous ne devez pas modifier l'état local directement en React. Cependant, à titre d'échappatoire, vous pouvez maintenir un compteur incrémental pour forcer un rafraîchissement même si l'état local n'a pas changé :

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

Évitez autant que possible d'utiliser cette approche.

### Puis-je créer une ref vers une fonction composant ? {#can-i-make-a-ref-to-a-function-component}

Vous ne devriez pas en avoir besoin souvent, mais vous pouvez exposer quelques méthodes impératives à un composant parent avec le Hook [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle).

### Que signifie `const [thing, setThing] = useState()` ? {#what-does-const-thing-setthing--usestate-mean}

Si vous n’avez pas l'habitude de cette syntaxe, allez voir l'[explication](/docs/hooks-state.html#tip-what-do-square-brackets-mean) dans la documentation du Hook d’état.

## Optimisations des performances {#performance-optimizations}

### Puis-je sauter un effet lors des mises à jour ? {#can-i-skip-an-effect-on-updates}

Oui. Reportez-vous au [déclenchement conditionnel d'un effet](/docs/hooks-reference.html#conditionally-firing-an-effect). Remarquez qu'oublier de gérer des mises à jour est souvent [source de bugs](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update), ce qui explique pourquoi ce n'est pas le comportement par défaut.

### Comment puis-je implémenter shouldComponentUpdate ? {#how-do-i-implement-shouldcomponentupdate}

Vous pouvez enrober une fonction composant avec `React.memo` pour comparer superficiellement ses props :

```js
const Button = React.memo((props) => {
  // votre composant
});
```

Ce n'est pas un Hook car ce n'est pas composable, alors que les Hooks le sont. `React.memo` est équivalent à `PureComponent`, mais ne compare que les props. (Vous pouvez aussi ajouter un second argument pour spécifier une fonction de comparaison personnalisée qui prendra en arguments les anciennes et nouvelles props. Si elle renvoie `true`, la mise à jour est évitée.)

`React.memo` ne compare pas l'état local car il n'y a pas d’unique objet d'état local à comparer. Mais vous pouvez rendre les descendants purs également, ou même [optimiser les descendants individuellement avec `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations).

### Comment mémoïser les calculs ? {#how-to-memoize-calculations}

Le Hook [`useMemo`](/docs/hooks-reference.html#usememo) vous permet de mettre en cache les calculs à travers les rendus en « se souvenant » du dernier calcul.

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Ce code appelle `computeExpensiveValue(a, b)`. Mais si les arguments `[a, b]` n'ont pas changé depuis le dernier calcul, `useMemo` saute le second appel et réutilise la dernière valeur renvoyée.

Rappelez-vous que la fonction passée à `useMemo` s'exécute pendant le rendu. N‘y faites rien que vous ne feriez normalement pendant le rendu. Par exemple, les effets de bord sont du ressort de `useEffect`, pas de `useMemo`.

**Vous pouvez vous appuyer sur `useMemo` pour les optimisations de performances, mais pas comme une garantie sémantique.** À l'avenir, React pourrait très bien choisir « d'oublier » certaines valeurs préalablement mémoïsées et de les recalculer lors du rendu suivant, par exemple pour libérer de la mémoire pour les composants non visibles. Écrivez votre code de façon à ce qu'il fonctionne toujours sans `useMemo`, et ajoutez-le ensuite pour optimiser les performances. (Pour les rares cas où une valeur ne doit *jamais* être recalculée, vous pouvez [l’initialiser paresseusement](#how-to-create-expensive-objects-lazily) dans une ref.)

Vous pouvez aussi utiliser `useMemo` pour éviter le rafraîchissement coûteux d'un enfant :

```js
function Parent({ a, b }) {
  // N’est rafraîchi que si `a` change :
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // N’est rafraîchi que si `b` change :
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

Remarquez que cette approche ne fonctionne pas dans une boucle car les appels aux Hooks [ne doivent pas](/docs/hooks-rules.html) être placés dans des boucles. Mais vous pouvez extraire la liste dans un composant à part, et appeler `useMemo` sur celui-ci.

### Comment créer paresseusement des objets coûteux ? {#how-to-create-expensive-objects-lazily}

`useMemo` vous permet de [mémoïser un calcul coûteux](#how-to-memoize-calculations) si les arguments sont les mêmes. Cependant, il n'est là que pour aider, et ne *garantit* pas que le calcul ne sera pas refait. Mais parfois vous devez vous assurer qu'un objet n'est créé qu'une seule fois.

**Le principal cas d'utilisation concerne la création d'un état initial coûteux :**

```js
function Table(props) {
  // ⚠️ createRows() est appelée à chaque rendu
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

Pour éviter de recréer l'état initial ignoré, nous pouvons passer une **fonction** à `useState` :

```js
function Table(props) {
  // ✅ createRows() n'est appelée qu'une seule fois
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React n'appelera cette fonction que lors du premier rendu. Vous trouverez de plus amples détails dans l'[API de référence de `useState`](/docs/hooks-reference.html#usestate).

**Vous pouvez aussi vouloir occasionnellement éviter de recréer la valeur initiale de `useRef()`.** Par exemple, vous voulez peut-être vous assurer qu'une instance de classe impérative n'est créée qu'une seule fois :

```js
function Image(props) {
  // ⚠️ IntersectionObserver est créé à chaque rendu
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef` **n'accepte pas** un argument de fonction spécial comme pour `useState`. Au lieu de ça, vous pouvez écrire votre propre fonction qui la crée et la définit paresseusement :

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

Ça permet d'éviter de recréer un objet coûteux tant qu’il n'est pas nécessaire. Si vous utilisez Flow ou TypeScript, vous pouvez aussi donner à `getObserver()` un type non-nullable pour un typage plus fin.

### La création de fonctions à la volée pendant le rendu ralentit-elle les Hooks ? {#are-hooks-slow-because-of-creating-functions-in-render}

Non. Dans les navigateurs modernes, les performances brutes des fermetures lexicales comparées à celles des classes diffèrent peu, sauf dans des scénarios extrêmes.

Par ailleurs, gardez à l'esprit que la conception de Hooks est plus efficace pour deux raisons :

* Les Hooks permettent d'éviter une grande partie de la « graisse » amenée par les classes, comme le coût de la création d'instances et la liaison des gestionnaires d'événements dans le constructeur.
* **Le code idiomatique utilisant des Hooks n'a pas besoin d'une imbrication profonde de composants** qui prévaudrait dans des projets utilisant des composants d'ordre supérieur, des props de rendu et des contextes. Avec des arborescences plus petites, React a moins de travail à faire.

Traditionnellement, les problématiques de performance associées aux fonctions définies à la volée en React sont liées au fait que passer de nouvelles fonctions de rappel à chaque rendu empêche les optimisations basées sur `shouldComponentUpdate` dans les composants enfants. Les Hooks abordent ce problème sous trois angles.

* Le Hook [`useCallback`](/docs/hooks-reference.html#usecallback) vous permet d'utiliser la même fonction de rappel d’un rendu à l’autre afin que `shouldComponentUpdate` puisse continuer à fonctionner :

```js{2}
// Ne changera pas sauf si `a` ou `b` change
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

* Le [Hook `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations) permet de contrôler plus facilement les mises à jour des enfants, réduisant le besoin de composants purs.
* Enfin, le Hook `useReducer` réduit le besoin de passer des fonctions de rappel en profondeur, comme expliqué ci-dessous.

### Comment éviter de transmettre des fonctions de rappel ? {#how-to-avoid-passing-callbacks-down}

Nous nous sommes aperçu que la majorité des gens n'aiment pas passer des fonctions de rappel à travers chaque niveau de l'arborescence. Même si c'est plus explicite, ça fait franchement « plomberie ».

Dans de grandes arborescences de composants, nous conseillons plutôt de transmettre une fonction `dispatch` issue de [`useReducer`](/docs/hooks-reference.html#usereducer) via le contexte :

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Remarque : `dispatch` ne va pas changer d'un rendu à l'autre
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

N’importe quel enfant de l'arborescence de `TodosApp` peut utiliser la fonction `dispatch` pour remonter des actions à `TodosApp` :

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

C'est à la fois plus pratique d'un point de vue maintenance (pas besoin de continuer à passer des fonctions de rappel), et ça règle au passage le problème (de mémoïsation) des fonctions de rappel. Pour les mises à jour déclenchées en profondeur, nous conseillons de transmettre `dispatch` de cette façon.

Remarquez que vous pouvez toujours choisir de transmettre l'*état* applicatif comme props (plus explicite) ou comme contexte (plus pratique pour les mises à jour très profondes). Si vous utilisez le contexte pour transmettre également l'état local, utilisez deux types de contexte différents : la donnée de contexte `dispatch` ne changera jamais, donc les composants qui l'utilisent n'ont pas besoin de se rafraîchir à moins qu'ils n’aient aussi besoin de l'état applicatif.

### Comment lire une valeur changeant fréquemment avec `useCallback` ? {#how-to-read-an-often-changing-value-from-usecallback}

>Remarque
>
>Nous recommandons de [transmettre `dispatch` dans le contexte](#how-to-avoid-passing-callbacks-down) plutôt que des fonctions de rappel individuelles dans les props. L'approche ci-dessous n'est mentionnée que par souci d'exhaustivité et à titre d'échappatoire.
>
>Notez aussi que cette approche peut causer des problèmes avec le [mode concurrent](/blog/2018/03/27/update-on-async-rendering.html). Nous prévoyons de proposer des alternatives plus ergonomiques à l'avenir, mais la solution la plus sûre pour l'instant consiste à toujours invalider la fonction de rappel si des valeurs dont elle dépend changent.

Dans de rares cas vous pourriez avoir besoin de mémoïser une fonction de rappel avec [`useCallback`](/docs/hooks-reference.html#usecallback) mais la mémoïsation ne fonctionne pas très bien parce que la fonction interne a tout de même trop souvent besoin d'être recréée. Si la fonction que vous mémoïsez est un gestionnaire d'événements et n'est pas utilisée pendant le rendu, vous pouvez utiliser une [ref comme variable d'instance](#is-there-something-like-instance-variables), et y stocker manuellement la dernière valeur renvoyée :

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
  }, [textRef]); // Ne recrée pas handleSubmit comme `[text]` le ferait

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

C'est une approche un peu biscornue mais ça montre que vous pouvez faire cette optimisation en dernier ressort, si vous en avez vraiment besoin. Vous pouvez en masquer les détails dérangeants en l'extrayant dans un Hook personnalisé :


```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // Sera mémoïsé même si `text` change :
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

Dans les deux cas, nous **déconseillons cette approche** et ne l’illustrons ici que dans un souci d'exhaustivité. Au lieu de ça, il est préférable d'[éviter de transmettre des fonctions de rappel en profondeur](#how-to-avoid-passing-callbacks-down).

## Sous le capot {#under-the-hood}

### Comment React associe-t-il les appels de Hooks avec les composants ? {#how-does-react-associate-hook-calls-with-components}

React garde trace du composant en cours de rendu. Grâce aux [règles des Hooks](/docs/hooks-rules.html), nous savons que les Hooks sont uniquement appelés depuis des composants React (ou des Hooks personnalisés, qui sont aussi uniquement appelés depuis des composants React).

Il existe une liste interne de « cellules mémoire » associées à chaque composant. Ce sont juste des objets JavaScript où nous stockons quelques données. Quand vous appelez un Hook tel que `useState()`, il lit la cellule courante (ou l'initialise pendant le premier rendu), et déplace alors le pointeur sur la prochaine. C'est ainsi que de multiples appels à `useState()` peuvent avoir chacun un état local distinct.

### Quelles sont les sources d'inspiration des Hooks ? {#what-is-the-prior-art-for-hooks}

Les Hooks font la synthèse d’idées issues de plusieurs sources :

* Nos précédentes expériences autour d’API fonctionnelles dans le dépôt [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State).
* Les expériences de la communauté React avec les API de props de rendu, notamment le [composant Reactions](https://github.com/reactions/component) de [Ryan Florence](https://github.com/ryanflorence).
* La proposition de [mot-clé `adopt`](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067) de [Dominic Gannaway](https://github.com/trueadm) comme sucre syntaxique pour les props de rendu.
* Les [variables d'état et les cellules à état en DisplayScript](http://displayscript.org/introduction.html).
* Les [composants réducteurs](https://reasonml.github.io/reason-react/docs/fr/state-actions-reducer.html) de ReasonReact.
* Les [abonnements](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html) *(Subscriptions, NdT)* en Rx.
* Les [effets algébriques](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting) de OCaml Multicore.

[Sebastian Markbåge](https://github.com/sebmarkbage) a proposé la conception initiale des Hooks, peaufinée ensuite par [Andrew Clark](https://github.com/acdlite), [Sophie Alpert](https://github.com/sophiebits), [Dominic Gannaway](https://github.com/trueadm) et d'autres membres de l'équipe React.
