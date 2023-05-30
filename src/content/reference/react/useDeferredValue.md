---
title: useDeferredValue
---

<Intro>

`useDeferredValue` est un Hook React qui vous laisse délayer (*defer, NdT*) une partie de l'UI.

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useDeferredValue(value)` {/*usedeferredvalue*/}

Appelez `useDeferredValue` à la racine de votre composant pour recevoir une version délayée de cette valeur.

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

[Voir d’autres exemples ci-dessous.](#usage)

#### Paramètres {/*parameters*/}

* `value`: La valeur que vous souhaitez délayer. Elle peut avoir n'importe quel type.

#### Valeur renvoyée {/*returns*/}

Durant le rendu initial, la valeur délayée retournée sera semblable à la valeur que vous avez donné en entrée. Pendant les mises à jour, React va d'abord tenter un re-render avec l'ancienne valeur (il va donc retourner l'ancienne valeur), et ensuite essayer un autre re-render en arrière-plan avec la nouvelle valeur (il va donc retourner la valeur mise à jour). 

#### Limitations {/*caveats*/}

- Les valeurs que vous passez à `useDeferredValue` doivent soit être des valeurs primitives (comme des chaînes de caractères ou des nombres), soit des objets créés en-dehors du rendu. Si vous créez un nouvel objet pendant le rendu et que vous le passez immédiatement à `useDeferredValue`, il sera différent à chaque rendu, causant des re-renders inutiles en arrière-plan.

- Quand `useDeferredValue` reçoit une valeur différente (comparaison logique avec [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), en plus du rendu en cours (quand il utilise toujours la valeur précédente), il planifie un re-render en arrière-plan avec la nouvelle valeur. Le re-render en arrière-plan est susceptible d'être interrompu (*interruptible, NdT*) : s'il y a un nouvelle mise à jour de `value`, React va redémarrer le re-render depuis le début. Par exemple, si l'utilisateur écrit dans une entrée plus rapidement que la vitesse à laquelle un graphique peut re-render sa valeur délayée, le graphique ne se mettra à jour seulement après que l'utilisateur ait arrêté d'écrire.

- `useDeferredValue` est intégré avec [`<Suspense>`.](/reference/react/Suspense) Si l'UI est suspendue à cause d'un mise à jour de l'arrière-plan causée par une nouvelle valeur, l'utilisateur ne verra pas le fallback (*recours prévu en cas de suspension de l'UI, NdT*). Il verra l'ancienne valeur délayée jusqu'à ce que les données chargent. 

- `useDeferredValue` n'empêche pas par lui-même des requêtes réseau supplémentaires. 

- Il n'y a pas de délai fixé causé par `useDeferredValue` en lui-même. Dès que React finit son re-render originel, React va immédiatement commencer à travailler sur le re-render de l'arrière-plan avec la nouvelle valeur délayée. Toute mise à jour causée par des évènements (comme écrire dans un champ de saisie) va interrompre le re-render en arrière-plan et sera priorisée par rapport à celui-ci. 

- Le rendu causé par un `useDeferredValue` ne déclenche pas des Effets, jusqu'à ce qu'il soit envoyé sur l'écran. Si le re-render de l'arrière-plan se suspend, ses Effets vont se lancer après que les données soit chargées et que l'UI soit mise à jour.

---

## Utilisation {/*usage*/}

###  Affichage du contenu obsolète pendant le chargement du nouveau contenu {/*showing-stale-content-while-fresh-content-is-loading*/}

Appellez `useDeferredValue` à la racine de votre composant pour délayer la mise à jour de certaines parties de votre UI.

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

Durant le rendu initial, la <CodeStep step={2}>valeur délayée</CodeStep> sera la même que la <CodeStep step={1}>valeur</CodeStep> que vous avez donné.

Pendant la mise à jour, la <CodeStep step={2}>valeur délayée</CodeStep> va "être en retard" par rapport à la dernière <CodeStep step={1}>valeur</CodeStep>. Plus particulièrement, React va d'abord faire un rendu *sans* mettre à jour la valeur délayée, et puis essayer un autre rendu avec la nouvelle valeur reçue en arrière-plan.

**Essayons un exemple afin de comprendre l'utilité de ce Hook.**

<Note>

Cet exemple part du principe que vous utilisez une de ces méthodes intégrées avec Suspense : 

- Des frameworks de récupération de données utilisant Suspense comme [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) ou [Next.js](https://nextjs.org/docs/advanced-features/react-18)
- Des composants de Lazy-loading (*chargement fainéant, NdT*) avec [`lazy`](/reference/react/lazy)

[Apprenez-en plus à propos de Suspense et de ses limitations.](/reference/react/Suspense)

</Note>


Dans cet exemple, le composant `SearchResults` va se [suspendre](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading) en récupérant les résultats de recherche. Essayez en écrivant `"a"`, attendez que les résultats s'affichent, puis éditez en écrivant `"ab"`. Les résultats de `"a"` sont remplacés par un chargement.

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

```js App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Rechercher des albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Chargement...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js SearchResults.js hidden
import { fetchData } from './data.js';

// Note: ce composant est écrit en utilisant une API expérimentale
// qui n'est pas encore disponible dans les versions stables de React.

// Pour un exemple réaliste que vous pouvez suivre aujourd'hui, 
// essayez un framework intégré avec Suspense, comme Relay ou Next.js.

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

// C'est une solution de contournement d'un bug pour lancer la démo. 
// TODO: replacer avec la vraie implémentation quand le bug sera fixé. 
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

```js data.js hidden
// Note: la manière dont vous pourriez récupérer les données 
// dépends du framework avec lequel vous utilisez Suspense. 
// Normalement, la logique de cache serait à l'intérieur d'un framework. 

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

Alternativement, une architecture UI couramment utilisée est de *délayer* la mise à jour d'une liste de résultats, et de continuer à montrer les anciens résultats jusqu'à ce que les nouveaux résultats soient prêts. Appellez `useDeferredValue` pour passer en entrée une version reportée de la recherche : 

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Rechercher des albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Chargement...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

La `query` va se mettre à jour immédiatement, et le champ de saisie va afficher la nouvelle valeur. Cependant, la `deferredQuery` va garder son ancienne valeur jusqu'à ce que les données soient chargées, et `SearchResults` affichera les anciens résultats un court instant. 

Entrez `"a"` dans l'exemple ci-dessous, attendez que les résultats soient chargés, et éditez ensuite le champ de saisie pour `"ab"`. Vous pouvez remarquez que, au lieu d'apercevoir le chargement, vous verrez la liste des anciens résultats jusqu'à ce que les nouveaux résultats soient chargés :

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

```js App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Rechercher des albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Chargement...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

```js SearchResults.js hidden
import { fetchData } from './data.js';

// Note: ce composant est écrit en utilisant une API expérimentale
// qui n'est pas encore disponible dans les versions stables de React.

// Pour un exemple réaliste que vous pouvez suivre aujourd'hui, 
// essayez un framework intégré avec Suspense, comme Relay ou Next.js.

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

// C'est une solution de contournement d'un bug pour lancer la démo. 
// TODO: replacer avec la vraie implémentation quand le bug sera fixé. 
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

```js data.js hidden
// Note: la manière dont vous pourriez récupérer les données 
// dépends du framework avec lequel vous utilisez Suspense. 
// Normalement, la logique de cache serait à l'intérieur d'un framework. 

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

#### Comment délayer une valeur fonctionne-t-il en sous-jacent ? {/*how-does-deferring-a-value-work-under-the-hood*/}

Vous pouvez imaginer le déroulement en deux étapes : 

1. **Premièrement, React re-renders avec la nouvelle `query` (`"ab"`) mais avec l'ancienne `deferredQuery` (toujours `"a")`.** La valeur `deferredQuery`, à laquelle vous passez la liste de résultats, est *délayée:* elle "se met en retard" par rapport à la valeur `query`.

2. **En arrière-plan, React essaye de re-render avec `query` et `deferredQuery` mis à jour *ensemble* avec `"ab"`.** Si ce re-render réussi, React vous le montre sur l'écran. Cependant, s'il se suspend (les résultats pour `"ab"` n'ont pas encore été chargés), React va abandonner cet essai de rendu, et essayer de re-render après que les données aient été chargées. L'utilisateur va continuer à voir l'ancienne valeur reportée jusqu'à ce que les données soient chargées. 

Le rendu de "l'arrière-plan" délayé est susceptible d'être interrompu. Par exemple, si vous tapez dans la zone de saisie à nouveau, React va l'abandonner et recommencer avec la nouvelle valeur. React va toujours utiliser la dernière valeur donnée. 

Notez qu'il y a toujours une requête réseau par frappe au clavier. Ce qui est reporté ici est l'affichage des résultats (jusqu'à ce qu'ils soient prêts), et non pas les requêtes réseaux en elle-mêmes. Même si l'utilisateur continue à écrire, les réponses pour chaque frappe au clavier sont cachées (*cached, NdT*), et donc les données ne sont pas récupérées une fois de plus lorsqu'on appuie sur Espace. Cette frappe est par ailleurs instantanée.

</DeepDive>

---

### Indiquer que le contenu est obsolète {/*indicating-that-the-content-is-stale*/}

Dans l'exemple ci-dessous, il n'y aucune indication montrant que la liste des résultats est toujours en train de charger, et qu'elle prend en compte la dernière recherche. Cela peut être dérangeant pour l'utilisateur si les nouveaux résultats prennent du temps à charger. Afin que l'utilisateur comprenne que la liste de résultats n'est pas la même que celle obtenue lors de la dernière recherche, vous pouvez ajouter une indication visuelle lorsque l'ancienne liste de résultats est affichée : 

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Avec ce changement, dès que vous commencerez à taper, l'ancienne liste de résultats sera légèrement transparente, jusqu'à ce que la nouvelle liste de résultats soit chargée. Vous pouvez également ajouter une transition CSS pour que le rendu soit graduel, comme dans l'exemple ci-dessous : 

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

```js App.js
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

```js SearchResults.js hidden
import { fetchData } from './data.js';

// Note: ce composant est écrit en utilisant une API expérimentale
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

// Ceci est une astuce permettant de contourner un bug afin de lancer la démo. 
// TODO: remplacer avec la vraie implémentation quand le bug sera fixé. 
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

```js data.js hidden
// Note: la manière dont vous pourriez récupérer les données 
// dépends du framework avec lequel vous utilisez Suspense. 
// Normalement, la logique de cache serait à l'intérieur d'un framework. 
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

### Délayer le rendu d'une partie de l'UI {/*deferring-re-rendering-for-a-part-of-the-ui*/}

Vous pouvez également utiliser `useDeferredValue` pour optimiser les performances. Cette manière de faire est utile lorsqu'une partie de votre UI est lente à re-render, qu'il n'y a pas de manière facile de l'optimiser, et que vous voulez éviter qu'elle bloque le reste de l'UI.

Imaginez que vous avez une zone de saisie de texte et un composant (comme un graphique ou une longue liste) qui re-renders à chaque frappe sur le clavier :

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

D'abord, optimisez `SlowList` pour éviter le re-render lorsque ses propriétés sont les mêmes. Pour se faire, [enveloppez-le dans `memo`:](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

Cependant, cette manière de faire n'est utile que si les propriétés de `SlowList` sont *les mêmes* que pendant le rendu précédent. Ce composant peut toujours être lent lorsque les propriétés sont *différentes,* et lorsque vous avez besoin de montrer un visuel différent.

Concrètement, le problème de performances est causé lorsque vous tapez dans le champ de saisie. La `SlowList` reçoit des nouvelles propriétés à chaque frappe, et l'écriture est saccadée. Son arbre entier est re-render. Dans ce cas, `useDeferredValue` vous permet de mettre à jour en priorité le champ de saisie (qui doit être rapide) plutôt que de mettre à jour la liste de résultats (qui peut être plus lente):

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

Cela ne rend pas le nouveau rendu de `SlowList` plus rapide. Cependant, cela dit à React que rendre la liste peut être dépriorisé afin de ne pas bloquer les frappes au clavier. La liste va "être en retard" par rapport au champ de saisie avant de le "rattraper". Comme auparavant, React va essayer de mettre à jour la liste le plus vite possible, mais sans empêcher l'utilisateur de taper.

<Recipes titleText="La différence entre useDeferredValue et le rendu non optimisé" titleId="examples">

#### Reporter le rendu d'une liste {/*deferred-re-rendering-of-the-list*/}

Dans cet exemple, chaque élément du composant `SlowList` est **artificiellement ralenti** afin que vous puissiez observer comment `useDeferredValue` permet de garder ce champ de saisie réactif. Ecrivez dans le champ de saisie et observez comment écrire semble rapide et comment la liste "est en retard".

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

```js SlowList.js
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
    // Ne fait rien pendant 1 ms par élément pour émuler du code extrêmement lent
  }

  return (
    <li className="item">
      Texte: {text}
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

Dans cet exemple, chaque élément du composant `SlowList` est **artificiellement ralenti** sans utiliser `useDeferredValue`.

Vous pouvez remarquer que la frappe dans le champ de saisie est très saccadée. Sans `useDeferredValue`, chaque frappe au clavier force la liste entière à re-render immédiatement et de manière inarrêtable.

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

```js SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // S'affiche une seule fois. Le ralentissement est à l'intérieur de SlowItem.
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
    // Ne fais rien pendant une 1 ms par élément pour simuler du code extrêmement lent 
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

L'optimisation nécessite que `SlowList` soit accompagnée d'un [`memo`.](/reference/react/memo) A chaque fois que `text` change, React a besoin d'être capable de re-render le composant parent rapidement. Durant ce rendu, `deferredText` possède toujours sa valeur précédente, donc `SlowList` est capable d'ignorer le re-rendering (ses propriétés n'ont pas changé). Sans [`memo`,](/reference/react/memo) il a besoin de re-render dans tous les cas, ce qui empêche l'optimisation.

</Pitfall>

<DeepDive>

#### Quelle est la différence entre reporter une valeur et le debouncing et le throttling ? {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

Il existe deux technique d'optimisation communes que vous avez pu peut-être utiliser auparavant dans ce genre de scénarios :

- *Debouncing* signifie que vous attendez qu'un utilisateur arrête de taper (par exemple pendant une seconde) avant de mettre à jour la liste.
- *Throttling* signifie que vous mettez à jour la liste à un temps donné (par exemple toutes les secondes).

Mêmes si ces techniques sont utiles dans certains cas, `useDeferredValue` est plus adapté pour optimiser le rendu, car il est totalement intégré avec React et il s'adapte au support de l'utilisateur.

Il ne demande pas de choisir un délai fixé, contrairement au debouncing et au throttling. Si le support de l'utilisateur est rapide (par exemple un ordinateur puissant), le rendu délayé arrive quasiment immédiatement et n'est pas visible pour l'utilisateur. Si le support de l'utilisateur est lent, la liste est "en retard" par rapport au champ de saisie, proportionnellement à la vitesse de l'appareil. 

De plus, les rendu reportés réalisés par `useDeferredValue` sont susceptibles d'être interrompus par défaut, ce qui n'est pas le cas du debouncing ou du throttling. Cela signifie que si React est au milieu du rendu d'une liste large, mais que l'utilisateur frappe sur une autre touche, React va abandonner ce rendu, considérer la frappe, et va ensuite commencer à faire le rendu en arrière-plan encore une fois. En contraste, le debouncing et le throttling produisent toujours une expérience lente car ils *bloquent:* ils reportent simplement le moment où le rendu bloque la frappe.

Si vous souhaitez optimiser des éléments qui n'arrivent pas pendant le rendu, le debouncing et le throttling sont toujours utiles. Par exemple, ils peuvent vous laisser entamer moins de requêtes réseau. Vous pouvez également utiliser différentes de ces techniques réunies. 

</DeepDive>
