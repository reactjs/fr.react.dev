---
title: cache
---

<<<<<<< HEAD
<Canary>

* `cache` n'est destinée qu'aux [React Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components). Découvrez quels [frameworks](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) prennent en charge les Composants Serveur.

* `cache` n'est disponible que dans les canaux de livraison [Canary](/community/versioning-policy#canary-channel) et [Expérimental](/community/versioning-policy#experimental-channel). Assurez-vous d'en comprendre les limitations avant d'utiliser `cache` en production. Apprenez-en davantage sur les [canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>
=======
<RSC>

`cache` is only for use with [React Server Components](/reference/rsc/server-components).

</RSC>
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698

<Intro>

`cache` vous permet de mettre en cache le résultat d'un chargement de données ou d'un calcul.

```js
const cachedFn = cache(fn);
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `cache(fn)` {/*cache*/}

Appelez `cache` hors de tout composant pour créer une variante d'une fonction dotée de mise en cache.

```js {4,7}
import {cache} from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({data}) {
  const report = getMetrics(data);
  // ...
}
```

Lors du premier appel de `getMetrics` avec `data`, `getMetrics` appellera `calculateMetrics(data)` et mettra le résultat en cache. Si `getMetrics` est rappelée avec le même argument `data`, elle renverra le résultat mis en cache plutôt que de rappeler `calculateMetrics(data)`.

[Voir d'autres exemples plus bas](#usage).

#### Paramètres {/*parameters*/}

* `fn` : la fonction dont vous voulez mettre les résultats en cache. `fn` peut prendre un nombre quelconque d'arguments et renvoyer n'importe quel type de résultat.

#### Valeur renvoyée {/*returns*/}

`cache` renvoie une version de `fn` dotée d'un cache, avec la même signature de type.  Elle n'appelle pas `fn` à ce moment-là.

Lors d'un appel à `cachedFn` avec des arguments donnés, elle vérifiera d'abord si un résultat correspondant existe dans le cache. Si tel est le cas, elle renverra ce résultat. Dans le cas contraire, elle appellera `fn` avec les arguments, mettra le résultat en cache et le renverra. `fn` n'est appelée qu'en cas d'absence de correspondance dans le cache *(cache miss, NdT)*.

<Note>

L'optimisation qui consiste à mettre en cache les valeurs résultats sur base des arguments passés est généralement appelée [_mémoïsation_](https://fr.wikipedia.org/wiki/M%C3%A9mo%C3%AFsation). La fonction renvoyée par `cache` est dite « fonction mémoïsée ».

</Note>

#### Limitations {/*caveats*/}

<<<<<<< HEAD
[//]: # 'TODO: add links to Server/Client Component reference once https://github.com/reactjs/react.dev/pull/6177 is merged'

- React invalidera le cache de toutes les fonctions mémoïsées à chaque requête serveur.
- Chaque appel à `cache` crée une nouvelle fonction. Ça signifie qu'appeler `cache` plusieurs fois avec la même fonction renverra plusieurs fonctions mémoïsées distinctes, avec chacune leur propre cache.
- `cachedFn` mettra également les erreurs en cache. Si `fn` lève une exception pour certains arguments, ce sera mis en cache, et la même erreur sera levée lorsque `cachedFn` sera rappelée avec ces mêmes arguments.
- `cache` est destinée uniquement aux [Composants Serveur](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).
=======
- React will invalidate the cache for all memoized functions for each server request.
- Each call to `cache` creates a new function. This means that calling `cache` with the same function multiple times will return different memoized functions that do not share the same cache.
- `cachedFn` will also cache errors. If `fn` throws an error for certain arguments, it will be cached, and the same error is re-thrown when `cachedFn` is called with those same arguments.
- `cache` is for use in [Server Components](/reference/rsc/server-components) only.
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698

---

## Utilisation {/*usage*/}

### Mettre en cache un calcul coûteux {/*cache-expensive-computation*/}

Utilisez `cache` pour éviter de dupliquer un traitement.

```js [[1, 7, "getUserMetrics(user)"],[2, 13, "getUserMetrics(user)"]]
import {cache} from 'react';
import calculateUserMetrics from 'lib/user';

const getUserMetrics = cache(calculateUserMetrics);

function Profile({user}) {
  const metrics = getUserMetrics(user);
  // ...
}

function TeamReport({users}) {
  for (const user of users) {
    const metrics = getUserMetrics(user);
    // ...
  }
  // ...
}
```

<<<<<<< HEAD
Si le même objet `user` est affiché dans `Profile` et `TeamReport`, les deux composants peuvent mutualiser le travail et n'appeler `calculateUserMetrics` qu'une fois pour ce `user`.

Supposons que `Profile` fasse son rendu en premier. Il appellera <CodeStep step={1}>`getUserMetrics`</CodeStep>, qui vérifiera si un résultat existe en cache.  Comme il s'agit du premier appel de `getUserMetrics` pour ce `user`, elle ne trouvera aucune correspondance. `getUserMetrics` appellera alors effectivement `calculateUserMetrics` avec ce `user` puis mettra le résultat en cache.
=======
If the same `user` object is rendered in both `Profile` and `TeamReport`, the two components can share work and only call `calculateUserMetrics` once for that `user`.

Assume `Profile` is rendered first. It will call <CodeStep step={1}>`getUserMetrics`</CodeStep>, and check if there is a cached result. Since it is the first time `getUserMetrics` is called with that `user`, there will be a cache miss. `getUserMetrics` will then call `calculateUserMetrics` with that `user` and write the result to cache.
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698

Lorsque `TeamReport` affichera sa liste de `users` et atteindra le même objet `user`, il appellera <CodeStep step={2}>`getUserMetrics`</CodeStep> qui lira le résultat depuis son cache.

If `calculateUserMetrics` can be aborted by passing an [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), you can use [`cacheSignal()`](/reference/react/cacheSignal) to cancel the expensive computation if React has finished rendering. `calculateUserMetrics` may already handle cancellation internally by using `cacheSignal` directly.

<Pitfall>

#### Appeler des fonctions mémoïsées distinctes lira des caches distincts {/*pitfall-different-memoized-functions*/}

Pour partager un cache, des composants doivent appeler la même fonction mémoïsée.

```js [[1, 8, "getWeekReport"], [1, 8, "cache(calculateWeekReport)"], [1, 9, "getWeekReport"]]
// Temperature.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export function Temperature({cityData}) {
  // 🚩 Erroné : Appeler `cache` au sein du composant
  // crée une nouvelle `getWeekReport` à chaque rendu
  const getWeekReport = cache(calculateWeekReport);
  const report = getWeekReport(cityData);
  // ...
}
```

```js [[2, 7, "getWeekReport"], [2, 7, "cache(calculateWeekReport)"], [2, 10, "getWeekReport"]]
// Precipitation.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

// 🚩 Erroné : `getWeekReport` n’est accessible que depuis
// le composant `Precipitation`.
const getWeekReport = cache(calculateWeekReport);

export function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

Dans l'exemple ci-dessus, <CodeStep step={2}>`Precipitation`</CodeStep> et <CodeStep step={1}>`Temperature`</CodeStep> appellent chacun `cache` pour créer une nouvelle fonction mémoïsée, qui dispose à chaque fois de son propre cache.  Si les deux composants s'affichent avec les mêmes `cityData`, ils dupliqueront tout de même le travail en appelant à chaque fois `calculateWeekReport`.

Qui plus est, `Temperature` crée une <CodeStep step={1}>nouvelle fonction mémoïsée</CodeStep> à chaque rendu, ce qui ne permet aucun partage de cache.

Pour maximiser les correspondances trouvées et réduire la charge de calcul, les deux composants devraient s'assurer de partager la même fonction mémoïsée, pour pouvoir accéder au même cache.  Définissez plutôt la fonction mémoïsée dans un module dédié qui peut faire l'objet d'un [`import`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/import) dans les divers composants.

```js [[3, 5, "export default cache(calculateWeekReport)"]]
// getWeekReport.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export default cache(calculateWeekReport);
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Temperature.js
import getWeekReport from './getWeekReport';

export default function Temperature({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Precipitation.js
import getWeekReport from './getWeekReport';

export default function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```
<<<<<<< HEAD

Désormais les deux composants appellent la <CodeStep step={3}>même fonction mémoïsée</CodeStep>, exportée depuis `./getWeekReport.js`, afin de lire et d'écrire dans le même cache.

=======
Here, both components call the <CodeStep step={3}>same memoized function</CodeStep> exported from `./getWeekReport.js` to read and write to the same cache.
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698
</Pitfall>

### Partager un instantané de données {/*take-and-share-snapshot-of-data*/}

<<<<<<< HEAD
Pour partager un instantané de données d'un composant à l'autre, appelez `cache` sur une fonction de chargement de données telle que `fetch`.  Lorsque plusieurs composants feront le même chargement de données, seule une requête sera faite, et ses données résultantes mises en cache et partagées à travers plusieurs composants.  Tous les composants utiliseront le même instantané de ces données au sein du rendu côté serveur.
=======
To share a snapshot of data between components, call `cache` with a data-fetching function like `fetch`. When multiple components make the same data fetch, only one request is made and the data returned is cached and shared across components. All components refer to the same snapshot of data across the server render.
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698

```js [[1, 4, "city"], [1, 5, "fetchTemperature(city)"], [2, 4, "getTemperature"], [2, 9, "getTemperature"], [1, 9, "city"], [2, 14, "getTemperature"], [1, 14, "city"]]
import {cache} from 'react';
import {fetchTemperature} from './api.js';

const getTemperature = cache(async (city) => {
  return await fetchTemperature(city);
});

async function AnimatedWeatherCard({city}) {
  const temperature = await getTemperature(city);
  // ...
}

async function MinimalWeatherCard({city}) {
  const temperature = await getTemperature(city);
  // ...
}
```

<<<<<<< HEAD
Si `AnimatedWeatherCard` et `MinimalWeatherCard` s'affichent tous deux avec la même <CodeStep step={1}>city</CodeStep>, ils recevront le même instantané de données depuis la <CodeStep step={2}>fonction mémoïsée</CodeStep>.
=======
If `AnimatedWeatherCard` and `MinimalWeatherCard` both render for the same <CodeStep step={1}>city</CodeStep>, they will receive the same snapshot of data from the <CodeStep step={2}>memoized function</CodeStep>.
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698

Si `AnimatedWeatherCard` et `MinimalWeatherCard` fournissent un argument <CodeStep step={1}>city</CodeStep> différent à <CodeStep step={2}>`getTemperature`</CodeStep>, alors `fetchTemperature` sera appelée deux fois, et chaque point d'appel recevra ses données spécifiques.

La <CodeStep step={1}>city</CodeStep> agit comme une clé de cache.

<Note>

<<<<<<< HEAD
[//]: # 'TODO: add links to Server Components when merged.'

<CodeStep step={3}>Le rendu asynchrone</CodeStep> n'est possible que dans les Composants Serveur.
=======
<CodeStep step={3}>Asynchronous rendering</CodeStep> is only supported for Server Components.
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698

```js [[3, 1, "async"], [3, 2, "await"]]
async function AnimatedWeatherCard({city}) {
  const temperature = await getTemperature(city);
  // ...
}
```

<<<<<<< HEAD
[//]: # 'TODO: add link and mention to use documentation when merged'
[//]: # 'To render components that use asynchronous data in Client Components, see `use` documentation.'
=======
To render components that use asynchronous data in Client Components, see [`use()` documentation](/reference/react/use).
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698

</Note>

### Précharger des données {/*preload-data*/}

En mettant en cache un chargement de données qui prendrait du temps, vous pouvez démarrer des traitements asynchrones avant de faire le rendu d'un composant.

```jsx [[2, 6, "await getUser(id)"], [1, 17, "getUser(id)"]]
const getUser = cache(async (id) => {
  return await db.user.query(id);
});

async function Profile({id}) {
  const user = await getUser(id);
  return (
    <section>
      <img src={user.profilePic} />
      <h2>{user.name}</h2>
    </section>
  );
}

function Page({id}) {
  // ✅ Malin : commence à charger les données utilisateur
  getUser(id);
  // ... des calculs ici
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

Lorsque `Page` fait son rendu, le composant appelle <CodeStep step={1}>`getUser`</CodeStep>, mais remarquez qu'il n'utilise pas les données renvoyées.  Cet appel anticipé à <CodeStep step={1}>`getUser`</CodeStep> déclenche la requête asynchrone à la base de données, qui s'exécute pendant que `Page` fait d'autres calculs puis déclenche le rendu de ses enfants.

Lorsque `Profile` fait son rendu, nous appelons à nouveau <CodeStep step={2}>`getUser`</CodeStep>. Si l'appel initial à <CodeStep step={1}>`getUser`</CodeStep> a fini son chargement et mis en cache les données utilisateur, lorsque `Profile` <CodeStep step={2}>demande ces données puis attend</CodeStep>, il n'a plus qu'à les lire du cache, sans relancer un appel réseau. Si la <CodeStep step={1}>requête de données initiale</CodeStep> n'est pas encore terminée, cette approche de préchargement réduit tout de même le délai d'obtention des données.

<DeepDive>

#### Mettre en cache un traitement asynchrone {/*caching-asynchronous-work*/}

Lorsque vous évaluez une [fonction asynchrone](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/async_function), vous recevez une [Promise](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) représentant le traitement. La promesse maintient un état pour le traitement (*en attente*, *accompli* ou *rejeté*) ainsi que l'aboutissement du traitement à terme.

<<<<<<< HEAD
Dans cet exemple, la fonction asynchrone <CodeStep step={1}>`fetchData`</CodeStep> renvoie une promesse pour le résultat de notre appel à `fetch`.
=======
In this example, the asynchronous function <CodeStep step={1}>`fetchData`</CodeStep> returns a promise that is awaiting the `fetch`.
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698

```js [[1, 1, "fetchData()"], [2, 8, "getData()"], [3, 10, "getData()"]]
async function fetchData() {
  return await fetch(`https://...`);
}

const getData = cache(fetchData);

async function MyComponent() {
  getData();
<<<<<<< HEAD
  // ... des calculs ici
=======
  // ... some computational work
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698
  await getData();
  // ...
}
```

En appelant <CodeStep step={2}>`getData`</CodeStep> pour la première fois, la promesse renvoyée par <CodeStep step={1}>`fetchData`</CodeStep> est mise en cache. Les appels ultérieurs utiliseront la même promesse.

Remarquez que le premier appel à <CodeStep step={2}>`getData`</CodeStep> n'appelle pas `await`, alors que le <CodeStep step={3}>second</CodeStep> le fait. [`await`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/await) est un opérateur JavaScript qui attend l'établissement de la promesse et renvoie son résultat accompli (ou lève son erreur de rejet). Le premier appel à <CodeStep step={2}>`getData`</CodeStep> lance simplement le chargement (`fetch`) pour mettre la promesse en cache, afin que le deuxième <CodeStep step={3}>`getData`</CodeStep> la trouve déjà en cours d'exécution.

<<<<<<< HEAD
Si lors du <CodeStep step={3}>deuxième appel</CodeStep> la promesse est toujours _en attente_, alors `await`  attendra son résultat. L'optimisation tient à ce que, pendant le `fetch` issu du premier appel, React peut continuer son travail de calcul, ce qui réduit l'attente pour le <CodeStep step={3}>deuxième appel</CodeStep>.

Si la promesse est déjà établie à ce moment-là, `await` renverra immédiatement la valeur accomplie (ou lèvera immédiatement l'erreur de rejet).  Dans les deux cas, on améliore la performance perçue.
=======
If by the <CodeStep step={3}>second call</CodeStep> the promise is still _pending_, then `await` will pause for the result. The optimization is that while we wait on the `fetch`, React can continue with computational work, thus reducing the wait time for the <CodeStep step={3}>second call</CodeStep>.
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698

</DeepDive>

<Pitfall>

#### Appeler une fonction mémoïsée hors d'un composant n'utilisera pas le cache {/*pitfall-memoized-call-outside-component*/}

```jsx [[1, 3, "getUser"]]
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// 🚩 Erroné : Appeler une fontion mémoïsée hors d’un composant
// n’exploitera pas le cache.
getUser('demo-id');

async function DemoProfile() {
  // ✅ Correct : `getUser` exploitera le cache.
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

React ne fournit un accès au cache pour les fonctions mémoïsées qu'au sein d'un composant. Si vous appelez <CodeStep step={1}>`getUser`</CodeStep> hors d'un composant, il évaluera la fonction mais n'utilisera pas le cache (ni en lecture ni en écriture).

<<<<<<< HEAD
C'est parce que l'accès au cache est fourni via un [contexte](/learn/passing-data-deeply-with-context), et que les contextes ne sont accessibles que depuis les composants.
=======
This is because cache access is provided through a [context](/learn/passing-data-deeply-with-context) which is only accessible from a component.
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698

</Pitfall>

<DeepDive>

#### Comment choisir entre `cache`, [`memo`](/reference/react/memo) et [`useMemo`](/reference/react/useMemo) ? {/*cache-memo-usememo*/}

Toutes ces API proposent de la mémoïsation, mais diffèrent sur ce que vous cherchez à mémoïser, sur les destinataires du cache, et sur les méthodes d'invalidation de ce cache.

#### `useMemo` {/*deep-dive-use-memo*/}

<<<<<<< HEAD
Vous devriez généralement utiliser [`useMemo`](/reference/react/useMemo) pour mettre en cache d'un rendu à l'autre un calcul coûteux dans un Composant Client.  Ça pourrait par exemple mémoïser une transformation de données dans un composant.
=======
In general, you should use [`useMemo`](/reference/react/useMemo) for caching an expensive computation in a Client Component across renders. As an example, to memoize a transformation of data within a component.
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698

```jsx {expectedErrors: {'react-compiler': [4]}} {4}
'use client';

function WeatherReport({record}) {
  const avgTemp = useMemo(() => calculateAvg(record), record);
  // ...
}

function App() {
  const record = getRecord();
  return (
    <>
      <WeatherReport record={record} />
      <WeatherReport record={record} />
    </>
  );
}
```

<<<<<<< HEAD
Dans cet exemple, `App` affiche deux `WeatherReport` avec le même enregistrement. Même si les deux composants font le même travail, ils ne peuvent pas partager des traitements. Le cache de `useMemo` est local à chaque composant.

En revanche, `useMemo` s'assure bien que si `App` refait un rendu et que l'objet `record` n'a pas changé, chaque instance du composant évitera son calcul et utilisera plutôt sa valeur `avgTemp` mémoïsée. `useMemo` mettra le dernier calcul d'`avgTemp` en cache sur base des dépendances qu'on lui fournit.
=======
However, `useMemo` does ensure that if `App` re-renders and the `record` object doesn't change, each component instance would skip work and use the memoized value of `avgTemp`. `useMemo` will only cache the last computation of `avgTemp` with the given dependencies.
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698

#### `cache` {/*deep-dive-cache*/}

Vous utiliserez `cache` dans des Composants Serveur pour mémoïser du travail à partager entre plusieurs composants.

```js [[1, 12, "<WeatherReport city={city} />"], [3, 13, "<WeatherReport city={city} />"], [2, 1, "cache(fetchReport)"]]
const cachedFetchReport = cache(fetchReport);

function WeatherReport({city}) {
  const report = cachedFetchReport(city);
  // ...
}

function App() {
  const city = "Paris";
  return (
    <>
      <WeatherReport city={city} />
      <WeatherReport city={city} />
    </>
  );
}
```

En réécrivant l'exemple précédent pour utiliser `cache`, cette fois la <CodeStep step={3}>deuxième instance de `WeatherReport`</CodeStep> pourra s'éviter une duplication d'effort et lira depuis le même cache que le <CodeStep step={1}>premier `WeatherReport`</CodeStep>. Une autre différence avec l'exemple précédent, c'est que `cache` est également conseillée pour <CodeStep step={2}>mémoïser des chargements de données</CodeStep>, contrairement à `useMemo` qui ne devrait être utilisée que pour des calculs.

Pour le moment, `cache` ne devrait être utilisée que dans des Composants Serveur, et le cache sera invalidé à chaque requête serveur.

#### `memo` {/*deep-dive-memo*/}

Vous devriez utiliser [`memo`](reference/react/memo) pour éviter qu'un composant ne recalcule son rendu alors que ses props n'ont pas changé.

```js
'use client';

function WeatherReport({record}) {
  const avgTemp = calculateAvg(record);
  // ...
}

const MemoWeatherReport = memo(WeatherReport);

function App() {
  const record = getRecord();
  return (
    <>
      <MemoWeatherReport record={record} />
      <MemoWeatherReport record={record} />
    </>
  );
}
```

<<<<<<< HEAD
Dans cet exemple, les deux composants `MemoWeatherReport` appelleront `calculateAvg` lors de leur premier rendu. Cependant, si `App` refait son rendu, sans pour autant changer `record`, aucune des props n'aura changé et `MemoWeatherReport` ne refera pas son rendu.
=======
In this example, both `MemoWeatherReport` components will call `calculateAvg` when first rendered. However, if `App` re-renders, with no changes to `record`, none of the props have changed and `MemoWeatherReport` will not re-render.
>>>>>>> 7b6c3ceb9dd97249e9dce4a8a94e61aed6424698

Comparé à `useMemo`, `memo` mémoïse le rendu du composant sur base de ses props, au lieu de mémoïser des calculs spécifiques. Un peu comme avec `useMemo`, le composant mémoïsé ne met en cache que le dernier rendu, avec les dernières valeurs de props. Dès que les props changent, le cache est invalidé et le composant refait son rendu.

</DeepDive>

---

## Dépannage {/*troubleshooting*/}

### Ma fonction mémoïsée est ré-exécutée alors que je l'ai appelée avec les mêmes arguments {/*memoized-function-still-runs*/}

Voyez déjà les pièges signalés plus haut :

* [Appeler des fonctions mémoïsées distinctes lira des caches distincts](#pitfall-different-memoized-functions)
* [Appeler une fonction mémoïsée hors d'un composant n'utilisera pas le cache](#pitfall-memoized-call-outside-component)

Si rien de tout ça ne s'applique, le problème peut être lié à la façon dont React vérifie l'existence de quelque chose dans le cache.

Si vos arguments ne sont pas des [primitives](https://developer.mozilla.org/fr/docs/Glossary/Primitive) (ce sont par exemple des objets, des fonctions, des tableaux), assurez-vous de toujours passer la même référence d'objet.

Lors d'un appel à une fonction mémoïsée, React utilisera les arguments passés pour déterminer si un résultat existe déjà dans le cache. React utilisera pour ce faire une comparaison superficielle des arguments.

```js
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // 🚩 Erroné : les props sont un objet différent à chaque rendu.
  const length = calculateNorm(props);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

Dans le cas ci-dessus, les deux `MapMarker` semblent faire exactement la même chose et appeler `calculateNorm` avec les mêmes valeurs `{x: 10, y: 10, z:10}`. Même si les objets contiennent des valeurs identiques, il ne s'agit pas d'une unique référence à un même objet, car chaque composant crée son propre objet `props`.

React appellera [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is) sur chaque argument pour vérifier l'existence dans le cache.

```js {3,9}
import {cache} from 'react';

const calculateNorm = cache((x, y, z) => {
  // ...
});

function MapMarker(props) {
  // ✅ Correct : passe des primitives à la fonction mémoïsée
  const length = calculateNorm(props.x, props.y, props.z);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

Une façon de remédier à ça consiste à passer les dimensions du vecteur à `calculateNorm`. Ça fonctionne parce que chaque dimension passée est une valeur primitive.

Vous pourriez aussi passer l'objet vecteur lui-même comme prop au composant.  Il vous faudrait toutefois passer le même objet en mémoire aux deux instances du composant.

```js {3,9,14}
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // ✅ Correct : passe le même objet `vector`
  const length = calculateNorm(props.vector);
  // ...
}

function App() {
  const vector = [10, 10, 10];
  return (
    <>
      <MapMarker vector={vector} />
      <MapMarker vector={vector} />
    </>
  );
}
```
