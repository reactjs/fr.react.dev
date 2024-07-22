---
title: useDeferredValue
---

<Intro>

`useDeferredValue` est un Hook React qui vous laisse différer la mise à jour d'une partie de l'interface utilisateur *(UI, NdT)*.

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useDeferredValue(value, initialValue?)` {/*usedeferredvalue*/}

Appelez `useDeferredValue` à la racine de votre composant pour recevoir une version différée de cette valeur.

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

[Voir d’autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `value` : la valeur que vous souhaitez différer. Elle peut être de n'importe quel type.
* <CanaryBadge title="Cette fonctionnalité n’est disponible que sur le canal de version Canary" /> `initialValue` **optionnelle** : une valeur à utiliser lors du rendu initial d'un composant. Si cette option est manquante, `useDeferredValue` ne différera pas lors du rendu initial, faute d'une version précédente de `value` à lui substituer lors du rendu.

#### Valeur renvoyée {/*returns*/}

- `currentValue` : durant le rendu initial, la valeur différée renvoyée sera celle que vous avez fournie. Lors des mises à jour, React tentera d'abord un rendu avec l'ancienne valeur (il va donc renvoyer l'ancienne valeur), et ensuite essayer en arrière-plan un rendu avec la nouvelle valeur (il va donc renvoyer la valeur à jour).


<Canary>

Dans les dernières versions React Canary, `useDeferredValue` renvoie la `initialValue` lors du rendu initial, puis planifie un nouceau rendu en arrière-plan avec la `value` renvoyée.

</Canary>

#### Limitations {/*caveats*/}

- Lors d'une mise à jour au sein d'une Transition, `useDeferredValue` renverra toujours la nouvelle `value` et ne déclenchera pas un rendu différé, puisque la mise à jour est déjà différée.

- Les valeurs que vous passez à `useDeferredValue` doivent être soit des valeurs primitives (comme des chaînes de caractères ou des nombres), soit des objets créés en-dehors du rendu. Si vous créez un nouvel objet pendant le rendu et que vous le passez immédiatement à `useDeferredValue`, il sera différent à chaque rendu, entraînant des rendus inutiles en arrière-plan.

- Quand `useDeferredValue` reçoit une valeur différente (en comparant au moyen de [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), en plus du rendu en cours (dans lequel il utilisera encore la valeur précédente), il planifie un rendu supplémentaire en arrière-plan avec la nouvelle valeur. Ce rendu d'arrière-plan est susceptible d'être interrompu : s'il y a un nouvelle mise à jour de `value`, React le recommencera de zéro. Par exemple, si l'utilisateur tape dans un champ de saisie trop rapidement pour qu'un graphique basé sur sa valeur différée puisse suivre, le graphique ne se mettra à jour qu'une fois que l'utilisateur aura terminé sa saisie.

- `useDeferredValue` s'intègre très bien avec [`<Suspense>`](/reference/react/Suspense). Si la mise à jour d'arrière-plan suspend l'UI, l'utilisateur ne verra pas l'UI de secours : il continuera à voir l'ancienne valeur différée jusqu'à ce que les données soient chargées.

- `useDeferredValue` n'empêche pas par lui-même des requêtes réseau supplémentaires.

- `useDeferredValue` ne recourt pas à un différé de durée fixe. Dès que React termine le premier nouveau rendu, il commence immédiatement à travailler sur le rendu d'arrière-plan avec la nouvelle valeur différée. Toute mise à jour causée par des évènements (comme écrire dans un champ de saisie) interrompra le rendu d'arrière-plan et sera traitée en priorité.

- Le rendu d'arrière-plan entraîné par un `useDeferredValue` ne déclenche pas les Effets tant qu'il n'est pas retranscrit à l'écran. Si le rendu d'arrière-plan suspend, ses Effets ne seront lancés qu'après que les données seront chargées et que l'UI sera mise à jour.

---

## Utilisation {/*usage*/}

### Afficher du contenu obsolète pendant le chargement du nouveau contenu {/*showing-stale-content-while-fresh-content-is-loading*/}

Appelez `useDeferredValue` à la racine de votre composant pour différer la mise à jour de certaines parties de votre interface utilisateur.

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

Lors du rendu initial, la <CodeStep step={2}>valeur différée</CodeStep> sera la même que la <CodeStep step={1}>valeur</CodeStep> que vous avez fournie.

Lors des mises à jour, la <CodeStep step={2}>valeur différée</CodeStep> sera « en retard » par rapport à la dernière <CodeStep step={1}>valeur</CodeStep>. Plus particulièrement, React fera d'abord un rendu *sans* mettre à jour la valeur différée, puis tentera un rendu supplémentaire en arrière-plan avec la nouvelle valeur reçue.

**Parcourons un exemple afin de comprendre l'utilité de ce Hook.**

<Note>

Cet exemple part du principe que vous utilisez une source de donnée compatible avec Suspense :

- Le chargement de données fourni par des frameworks intégrant Suspense tels que [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) et [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Le chargement à la demande de composants avec [`lazy`](/reference/react/lazy)
- La lecture de la valeur d'une promesse avec [`use`](/reference/react/use)

[Apprenez-en davantage sur Suspense et ses limitations](/reference/react/Suspense).

</Note>


Dans cet exemple, le composant `SearchResults` [suspend](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading) pendant le chargement des résultats de recherche. Essayez de saisir `"a"`, attendez que les résultats s'affichent, puis modifiez la saisie en `"ab"`. Les résultats pour `"a"` sont remplacés par une UI de secours pendant le chargement.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Rechercher des albums :
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Chargement...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import { fetchData } from './data.js';

// Remarque : ce composant est écrit en utilisant une API expérimentale
// qui n'est pas encore disponible dans les versions stables de React.

// Si vous souhaitez suivre cet exemple avec une version stable,
// essayez un framework intégrant Suspense, comme Relay ou Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>Pas de résultat pour <i>« {query} »</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// Astuce de contournement d'un bug afin d'exécuter la démo.
// TODO: remplacer avec la véritable implémentation quand le bug sera corrigé.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/data.js hidden
// Remarque : la manière de récupérer les données dépend
// du framework avec lequel vous utilisez Suspense.
// En temps normal, la logique de cache est fournie par le framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Non implémenté');
  }
}

async function getSearchResults(query) {
    // Ajoute un faux délai pour que le temps d'attente soit remarqué par l'utilisateur.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

Une alternative visuelle courante consiste à *différer* la mise à jour d'une liste de résultats, en continuant à montrer les anciens résultats jusqu'à ce que les nouveaux soient prêts. Appelez `useDeferredValue` pour pouvoir passer une version différée de la recherche :

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Rechercher des albums :
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Chargement...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

La `query` va se mettre à jour immédiatement, donc le champ de saisie affichera la nouvelle valeur. En revanche, la `deferredQuery` gardera son ancienne valeur jusqu'à ce que les données soient chargées, et `SearchResults` affichera les anciens résultats dans l'intervalle.

Tapez`"a"` dans l'exemple ci-dessous, attendez que les résultats soient chargés, et modifiez ensuite votre saisie pour `"ab"`. Remarquez qu’au lieu d'apercevoir l'interface de chargement, vous continuez à voir la liste des anciens résultats jusqu'à ce que les nouveaux résultats soient chargés :

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Rechercher des albums :
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Chargement...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import { fetchData } from './data.js';

// Remarque : ce composant est écrit en utilisant une API expérimentale
// qui n'est pas encore disponible dans les versions stables de React.

// Si vous souhaitez suivre cet exemple avec une version stable,
// essayez un framework intégrant Suspense, comme Relay ou Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>Pas de résultat pour <i>« {query} »</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// Astuce de contournement d'un bug afin d'exécuter la démo.
// TODO: remplacer avec la véritable implémentation quand le bug sera corrigé.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/data.js hidden
// Remarque : la manière de récupérer les données dépend
// du framework avec lequel vous utilisez Suspense.
// En temps normal, la logique de cache est fournie par le framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Non implémenté');
  }
}

async function getSearchResults(query) {
    // Ajoute un faux délai pour que le temps d'attente soit remarqué par l'utilisateur.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<DeepDive>

#### Comment une valeur différée fonctionne-t-elle sous le capot ? {/*how-does-deferring-a-value-work-under-the-hood*/}

Imaginez un déroulement en deux étapes :

1. **Pour commencer, React refait un rendu avec la nouvelle `query` (`"ab"`) mais avec l'ancienne `deferredQuery` (toujours `"a")`.** La valeur `deferredQuery`, que vous passez à la liste de résultats, est *différée* : elle est « en retard » par rapport à la valeur `query`.

2. **En arrière-plan, React tente alors un autre rendu avec `query` et `deferredQuery` valant *toutes les deux* `"ab"`.** Si ce rendu aboutit, React l'affichera à l'écran. Cependant, s'il suspend (les résultats pour `"ab"` ne sont pas encore chargés), React abandonnera cet essai de rendu, et essaiera à nouveau une fois les données chargées. L'utilisateur continuera à voir l'ancienne valeur différée jusqu'à ce que les données soient prêtes.

Le rendu différé « d'arrière-plan » est susceptible d'être interrompu. Par exemple, si vous tapez à nouveau dans le champ de saisie, React l'abandonnera et recommencera avec la nouvelle valeur. React utilisera toujours la dernière valeur fournie.

Remarquez qu'il y a quand même une requête réseau par frappe clavier. Ce qui est différé ici, c'est l'affichage des résultats (jusqu'à ce qu'ils soient prêts), et non pas les requêtes réseau elles-mêmes. Même si l'utilisateur continue à saisir, les réponses pour chaque frappe clavier sont mises en cache, donc les données ne sont pas chargées à nouveau lorsqu'on appuie sur Backspace : la mise à jour est alors instantanée.

</DeepDive>

---

### Indiquer que le contenu est obsolète {/*indicating-that-the-content-is-stale*/}

Dans l'exemple ci-avant, il n'y aucune indication que la liste des résultats pour la dernière requête est toujours en train de charger. Cela peut être déroutant pour l'utilisateur si les nouveaux résultats prennent du temps à charger. Afin de bien signifier que la liste de résultats ne reflète pas encore la dernière recherche, vous pouvez ajouter une indication visuelle lorsque l'ancienne liste de résultats est affichée :

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Avec ce changement, dès que vous commencerez à taper, l'ancienne liste de résultats sera légèrement assombrie, jusqu'à ce que la nouvelle liste de résultats soit chargée. Vous pouvez également ajouter une transition CSS pour un résultat plus graduel, comme dans l'exemple ci-dessous :

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Rechercher des albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Chargement...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import { fetchData } from './data.js';

// Remarque : ce composant est écrit en utilisant une API expérimentale
// qui n'est pas encore disponible dans les versions stables de React.

// Si vous souhaitez suivre cet exemple avec une version stable,
// essayez un framework intégrant Suspense, comme Relay ou Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>Pas de résultats pour <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// Astuce de contournement d'un bug afin d'exécuter la démo.
// TODO: remplacer avec la véritable implémentation quand le bug sera corrigé.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/data.js hidden
// Remarque : la manière de récupérer les données dépend
// du framework avec lequel vous utilisez Suspense.
// En temps normal, la logique de cache est fournie par le framework.
let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
    // Ajoute un faux délai pour que le temps d'attente soit remarqué par l'utilisateur.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

---

### Différer le rendu d'une partie de l'UI {/*deferring-re-rendering-for-a-part-of-the-ui*/}

Vous pouvez également utiliser `useDeferredValue` pour optimiser les performances. C'est pratique lorsqu'une partie de votre UI a un rendu lent, qu'il n'y a pas de manière simple de l'optimiser, et que vous voulez éviter qu'elle bloque le reste de l'UI.

Imaginez que vous avez un champ textuel et un composant (comme un graphique ou une longue liste) qui refait son rendu à chaque frappe clavier :

```js
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

Pour commencer, optimisez `SlowList` pour éviter un nouveau rendu quand ses propriétés n'ont pas changé. Pour ce faire, [enrobez-le avec `memo`](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged) :

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

Cependant, ça ne vous aide que si les propriétés de `SlowList` sont *les mêmes* que lors du rendu précédent. Ce composant peut toujours être lent lorsque les propriétés sont *différentes*, et que vous avez effectivement besoin de produire un rendu visuel distinct.

Concrètement, le souci de performances principal vient de ce que lorsque vous tapez dans le champ de saisie, la `SlowList` reçoit des nouvelles propriétés, et la lenteur de sa mise à jour rend la saisie saccadée. Dans un tel cas, `useDeferredValue` vous permet de prioriser la mise à jour du champ de saisie (qui doit être rapide) par rapport à celle de la liste de résultats (qui peut être plus lente) :

```js {3,7}
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

Ça n'accélère pas le rendu de `SlowList`. Néanmoins, ça indique à React de déprioriser le rendu de la liste afin de ne pas bloquer les frappes clavier. La liste sera « en retard » par rapport au champ de saisie, pour finalement le « rattraper ». Comme auparavant, React essaiera de mettre à jour la liste le plus vite possible, mais sans empêcher l'utilisateur de taper.

<Recipes titleText="Différence entre useDeferredValue et un rendu non optimisé" titleId="examples">

#### Différer le rendu de la liste {/*deferred-re-rendering-of-the-list*/}

Dans cet exemple, chaque élément du composant `SlowList` est **artificiellement ralenti** afin que vous puissiez constater que `useDeferredValue` permet de garder le champ de saisie réactif. Écrivez dans le champ de saisie et voyez comme la saisie reste réactive, alors que la liste « est en retard ».

<Sandpack>

```js
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

```js src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // S'affiche une seule fois. Le ralentissement est dans SlowItem.
  console.log('[ARTIFICIELLEMENT LENT] Rendu de 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Ne fait rien pendant 1 ms par élément pour simuler du code extrêmement lent
  }

  return (
    <li className="item">
      Texte : {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

#### Rendu non optimisé de la liste {/*unoptimized-re-rendering-of-the-list*/}

Dans cet exemple, chaque élément du composant `SlowList` est **artificiellement ralenti**, mais on n'utilise pas `useDeferredValue`.

Vous pouvez remarquer que la frappe dans le champ de saisie est très saccadée. Sans `useDeferredValue`, chaque frappe clavier force la liste entière à refaire un rendu immédiatement, sans possibilité d'interruption.

<Sandpack>

```js
import { useState } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

```js src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // S'affiche une seule fois. Le ralentissement est dans SlowItem.
  console.log('[ARTIFICIELLEMENT LENT] Rendu de 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Ne fait rien pendant 1 ms par élément pour simuler du code extrêmement lent
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

Cette optimisation nécessite que `SlowList` soit enrobée par un [`memo`](/reference/react/memo). En effet, à chaque fois que `text` change, React doit pouvoir refaire le rendu du composant parent rapidement. Durant ce rendu, `deferredText` a toujours sa valeur précédente, donc `SlowList` peut s'épargner un nouveau rendu (ses propriétés n'ont pas changé). Sans [`memo`](/reference/react/memo), il y aurait un nouveau rendu dans tous les cas, ce qui tue tout l'intérêt de l'optimisation.

</Pitfall>

<DeepDive>

#### Valeur différée, *debouncing* et *throttling* : quelles différences ? {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

Il existe deux technique d'optimisation courantes que vous avez peut-être utilisées auparavant dans ce genre de scénarios :

- Le *debouncing* signifie que vous attendriez que l'utilisateur cesse de taper (par exemple pendant une seconde) avant de mettre à jour la liste.
- Le *throttling* signifie que vous ne mettriez à jour la liste qu'à une fréquence limitée (par exemple au maximum une fois par seconde).

Mêmes si ces techniques sont utiles dans certains cas, `useDeferredValue` est plus adapté pour optimiser le rendu, car il est totalement intégré avec React et il s'adapte à l'appareil de l'utilisateur.

Contrairement au *debouncing* et au *throttling*, il ne nécessite pas de choisir un délai fixe. Si l'appareil de l'utilisateur est rapide (par exemple un ordinateur puissant), le rendu différé serait quasiment immédiat, le rendant imperceptible pour l'utilisateur. Si l'appareil est lent, la liste serait « en retard » par rapport au champ de saisie, proportionnellement à la lenteur de l'appareil.

De plus, les rendus différés planifiés par `useDeferredValue` sont par défaut susceptibles d'être interrompus, ce qui n'est pas le cas du *debouncing* ou du *throttling*. Ça signifie que si React est en plein milieu du rendu d'une vaste liste, et que l'utilisateur ajuste sa saisie, React abandonnera ce rendu, traitera la frappe, et recommencera le rendu en arrière-plan. Par opposition, le *debouncing* et le *throttling* donneraient ici toujours une expérience saccadée car ils sont *bloquants* : ils diffèrent simplement le moment auquel le rendu bloque la frappe.

Si vous souhaitez optimiser des traitements hors du rendu, le *debouncing* et le *throttling* restent utiles. Par exemple, ils peuvent vous permettre de lancer moins de de requêtes réseau. Vous pouvez parfaitement combiner ces techniques.

</DeepDive>
