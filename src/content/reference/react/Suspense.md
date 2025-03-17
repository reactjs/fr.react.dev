---
title: <Suspense>
---

<Intro>

`<Suspense>` vous permet d'afficher un contenu de secours en attendant que ses composants enfants aient fini de se charger.


```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `<Suspense>` {/*suspense*/}

#### Props {/*props*/}

* `children` : l'interface utilisateur (UI) que vous souhaitez effectivement afficher à terme.  Si `children` suspend pendant son rendu, ce périmètre Suspense basculera le rendu sur `fallback`.
* `fallback` : une UI alternative à afficher au lieu de l'UI finale si celle-ci n'a pas fini de se charger.  Ça peut être n'importe quel nœud React valide, mais en pratique une UI de secours est une vue de remplacement légère, telle qu'un *spinner* ou un squelette structurel.  Suspense basculera automatiquement de `fallback` vers `children` quand les données seront prêtes.  Si `fallback` suspend pendant son rendu, ça activera le périmètre Suspense parent le plus proche.

#### Limitations {/*caveats*/}

- React ne préserve pas l'état pour les rendus suspendus avant d'avoir pu faire un premier montage.  Une fois le composant chargé, React retentera un rendu de l'arborescence suspendue à partir de zéro.
- Si Suspense affichait du contenu pour l'arborescence, puis est suspendu à nouveau, le `fallback` sera affiché à nouveau à moins que la mise à jour à l'origine de la suspension ait utilisé [`startTransition`](/reference/react/startTransition) ou [`useDeferredValue`](/reference/react/useDeferredValue).
- Si React a besoin de cacher le contenu déjà visible parce qu'il suspend à nouveau, il nettoiera les [Effets de layout](/reference/react/useLayoutEffect) pour l'arborescence du contenu.  Lorsque le contenu est de nouveau prêt à être affiché, React recommencera à traiter les Effets de rendu.  Ça garantit que les Effets qui mesurent la mise en page du DOM n'essaient pas de le faire pendant que le contenu est masqué.
- React inclut des optimisations sous le capot telles que le *rendu serveur streamé* ou *l'hydratation sélective* qui sont compatibles avec Suspense. Lisez [un survol architectural](https://github.com/reactwg/react-18/discussions/37) et regardez [cette présentation technique](https://www.youtube.com/watch?v=pj5N-Khihgc) pour en savoir plus. *(Les deux ressources sont en anglais, NdT)*

---

## Utilisation {/*usage*/}

### Afficher une UI de secours pendant le chargement du contenu {/*displaying-a-fallback-while-content-is-loading*/}

Vous pouvez enrober n'importe quelle partie de votre application dans un périmètre Suspense :

```js [[1, 1, "<Loading />"], [2, 2, "<Albums />"]]
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

React affichera le <CodeStep step={1}>contenu de secours</CodeStep> jusqu'à ce que le code et les données nécessaires aux <CodeStep step={2}>enfants</CodeStep> aient fini de se charger.

Dans l'exemple ci-dessous, le composant `Albums` *suspend* pendant qu'il charge la liste des albums.  Jusqu'à ce qu'il soit prêt à s'afficher, React bascule sur le plus proche périmètre Suspense parent pour en afficher le contenu de secours : votre composant `Loading`.  Ensuite, une fois les données chargées, React masquera le contenu de secours `Loading` et affichera le composant `Albums` avec ses données.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Ouvrir la page artiste des Beatles
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Chargement...</h2>;
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Note : ce composant est écrit au moyen d'une API expérimentale
// qui n'est pas encore disponible dans une version stable de React.

// Pour un exemple réaliste que vous pouvez suivre dès aujourd'hui,
// essayez un framework intégrant Suspense, tel que Relay ou Next.js.

=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
<<<<<<< HEAD

// Ceci est une solution de contournement pour permettre à la
// démo de fonctionner.
// TODO: remplacer par une véritable implémentation une fois
// le bug corrigé.
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
=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
```

```js src/data.js hidden
// Note : la façon de charger vos données dépend du framework
// que vous utilisez en complément de Suspense.
// Normalement, la logique de cache serait fournie par le framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
    title: 'Sgt. Pepper’s Lonely Hearts Club Band',
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
    title: 'A Hard Day’s Night',
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
}
```

</Sandpack>

<Note>

**Seules les sources de données compatibles Suspense activeront le composant Suspense.** Ces sources de données comprennent :

<<<<<<< HEAD
- Le chargement de données fourni par des frameworks intégrant Suspense tels que [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) et [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Le chargement à la demande du code de composants avec [`lazy`](/reference/react/lazy)
- La lecture de la valeur d'une promesse avec [`use`](/reference/react/use)
=======
- Data fetching with Suspense-enabled frameworks like [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) and [Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)
- Lazy-loading component code with [`lazy`](/reference/react/lazy)
- Reading the value of a cached Promise with [`use`](/reference/react/use)
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff

Suspense **ne détecte pas** le chargement de données depuis un Effet ou un gestionnaire d'événement.

Les modalités exactes de votre chargement de données dans le composant `Albums` ci-dessus dépenderont de votre framework.  Si vous utilisez un framework intégrant Suspense, vous trouverez tous les détails dans sa documentation sur le chargement de données.

Le chargement de données compatible avec Suspense sans recourir à un framework spécifique n'est pas encore pris en charge.  Les spécifications d'implémentation d'une source de données intégrant Suspense sont encore instables et non documentées.  Une API officielle pour intégrer les sources de données avec Suspense sera publiée dans une future version de React.

</Note>

---

### Révéler plusieurs contenus d'un coup {/*revealing-content-together-at-once*/}

Par défaut, toute l'arborescence à l'intérieur de Suspense est considérée comme une unité indivisible.  Par exemple, même si *un seul* de ses composants suspendait en attendant des données, *tous* les composants seraient remplacés par un indicateur de chargement :

```js {2-5}
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

Ensuite, une fois que tous les composants sont prêts à être affichés, ils apparaitront tous d'un bloc.

Dans l'exemple ci-dessous, les composants `Biography` et `Albums` chargent des données.  Cependant, puisqu'ils appartiennent à un même périmètre Suspense, ces composants « apparaissent » toujours en même temps, d'un bloc.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Ouvrir la page artiste des Beatles
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Biography artistId={artist.id} />
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 Chargement...</h2>;
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Note : ce composant est écrit au moyen d'une API expérimentale
// qui n'est pas encore disponible dans une version stable de React.

// Pour un exemple réaliste que vous pouvez suivre dès aujourd'hui,
// essayez un framework intégrant Suspense, tel que Relay ou Next.js.

=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
<<<<<<< HEAD

// Ceci est une solution de contournement pour permettre à la
// démo de fonctionner.
// TODO: remplacer par une véritable implémentation une fois
// le bug corrigé.
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
=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Note : ce composant est écrit au moyen d'une API expérimentale
// qui n'est pas encore disponible dans une version stable de React.

// Pour un exemple réaliste que vous pouvez suivre dès aujourd'hui,
// essayez un framework intégrant Suspense, tel que Relay ou Next.js.

=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
<<<<<<< HEAD

// Ceci est une solution de contournement pour permettre à la
// démo de fonctionner.
// TODO: remplacer par une véritable implémentation une fois
// le bug corrigé.
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
=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
```

```js src/data.js hidden
// Note : la façon de charger vos données dépend du framework
// que vous utilisez en complément de Suspense.
// Normalement, la logique de cache serait fournie par le framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return `Les Beatles étaient un groupe de rock anglais,
    formé à Liverpool en 1960, qui était composé de
    John Lennon, Paul McCartney, George Harrison
    et Ringo Starr.`;
}

async function getAlbums() {
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
    title: 'Sgt. Pepper’s Lonely Hearts Club Band',
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
    title: 'A Hard Day’s Night',
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
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
```

</Sandpack>

Les composants qui chargent des données n'ont pas besoin d'être des enfants directs du périmètre Suspense. Par exemple, vous pouvez déplacer `Biography` et `Albums` dans un nouveau composant `Details` : ça ne changera rien au comportement. `Biography` et `Albums` partagent le même périmètre Suspense parent le plus proche, de sorte qu'ils seront forcément révélés ensemble.

```js {2,8-11}
<Suspense fallback={<Loading />}>
  <Details artistId={artist.id} />
</Suspense>

function Details({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Panel>
        <Albums artistId={artistId} />
      </Panel>
    </>
  );
}
```

---

### Révéler des contenus imbriqués au fil du chargement {/*revealing-nested-content-as-it-loads*/}

Lorsqu'un composant suspend, le plus proche composant Suspense parent affiche le contenu de secours.  Ça vous permet d'imbriquer plusieurs composants Suspense pour créer des séquences de chargement. Pour chaque périmètre Suspense, le contenu de secours sera remplacé lorsque le niveau suivant de contenu deviendra disponible. Par exemple, vous pouvez donner son propre contenu de secours à la liste des albums :

```js {3,7}
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

Avec ce changement, l'affichage de `Biography` n'a plus besoin « d'attendre » qu'`Albums` se charge.

La séquence sera :

<<<<<<< HEAD
1. Si `Biography` n'est pas encore chargé, `BigSpinner` est affiché à la place de l'intégralité du contenu.
2. Une fois que `Biography` est chargé, `BigSpinner` est remplacé par le contenu.
3. Si `Albums` n'est pas encore chargé, `AlbumsGlimmer` est affiché à la place d'`Albums` et de son parent `Panel`.
4. Pour finir, une fois `Albums` chargé, il remplace `AlbumsGlimmer`.
=======
1. If `Biography` hasn't loaded yet, `BigSpinner` is shown in place of the entire content area.
2. Once `Biography` finishes loading, `BigSpinner` is replaced by the content.
3. If `Albums` hasn't loaded yet, `AlbumsGlimmer` is shown in place of `Albums` and its parent `Panel`.
4. Finally, once `Albums` finishes loading, it replaces `AlbumsGlimmer`.
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Ouvrir la page artiste des Beatles
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<BigSpinner />}>
        <Biography artistId={artist.id} />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Panel>
            <Albums artistId={artist.id} />
          </Panel>
        </Suspense>
      </Suspense>
    </>
  );
}

function BigSpinner() {
  return <h2>🌀 Chargement...</h2>;
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Note : ce composant est écrit au moyen d'une API expérimentale
// qui n'est pas encore disponible dans une version stable de React.

// Pour un exemple réaliste que vous pouvez suivre dès aujourd'hui,
// essayez un framework intégrant Suspense, tel que Relay ou Next.js.

=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
<<<<<<< HEAD

// Ceci est une solution de contournement pour permettre à la
// démo de fonctionner.
// TODO: remplacer par une véritable implémentation une fois
// le bug corrigé.
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
=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Note : ce composant est écrit au moyen d'une API expérimentale
// qui n'est pas encore disponible dans une version stable de React.

// Pour un exemple réaliste que vous pouvez suivre dès aujourd'hui,
// essayez un framework intégrant Suspense, tel que Relay ou Next.js.

=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
<<<<<<< HEAD

// Ceci est une solution de contournement pour permettre à la
// démo de fonctionner.
// TODO: remplacer par une véritable implémentation une fois
// le bug corrigé.
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
=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
```

```js src/data.js hidden
// Note : la façon de charger vos données dépend du framework
// que vous utilisez en complément de Suspense.
// Normalement, la logique de cache serait fournie par le framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `Les Beatles étaient un groupe de rock anglais,
    formé à Liverpool en 1960, qui était composé de
    John Lennon, Paul McCartney, George Harrison
    et Ringo Starr.`;
}

async function getAlbums() {
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
    title: 'Sgt. Pepper’s Lonely Hearts Club Band',
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
    title: 'A Hard Day’s Night',
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
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Les périmètres Suspense vous permettent de coordonner les parties de votre UI qui devraient toujours « débarquer » ensemble, et celles qui devraient révéler progressivement davantage de contenu selon une séquence d'états de chargement. Vous pouvez ajouter, déplacer ou retirer des périmètres Suspense à n'importe quel endroit de l'arbre sans affecter le comportement du reste de l'appli.

Ne mettez pas un périmètre Suspense autour de chaque composant. Les périmètres Suspense ne devraient pas être plus granulaires que la séquence de chargement que vous souhaitez proposer à l'utilisateur.  Si vous travaillez avec des designers, demandez-leur où les états de chargement devraient être proposés — ils ont sans doute déjà prévu ça dans leurs maquettes.

---

### Afficher du contenu périmé pendant que le contenu frais charge {/*showing-stale-content-while-fresh-content-is-loading*/}

Dans cet exemple, le composant `SearchResults` suspend pendant le chargement des résultats de recherche.  Tapez `"a"`, attendez les résultats, puis modifiez votre saisie pour `"ab"`.  Les résultats pour `"a"` seront alors remplacés par le contenu de secours.

<Sandpack>

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

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Note : ce composant est écrit au moyen d'une API expérimentale
// qui n'est pas encore disponible dans une version stable de React.

// Pour un exemple réaliste que vous pouvez suivre dès aujourd'hui,
// essayez un framework intégrant Suspense, tel que Relay ou Next.js.

=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>Aucun résultat pour <i>« {query} »</i></p>;
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
<<<<<<< HEAD

// Ceci est une solution de contournement pour permettre à la
// démo de fonctionner.
// TODO: remplacer par une véritable implémentation une fois
// le bug corrigé.
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
=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
```

```js src/data.js hidden
// Note : la façon de charger vos données dépend du framework
// que vous utilisez en complément de Suspense.
// Normalement, la logique de cache serait fournie par le framework.

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
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
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
    title: 'Sgt. Pepper’s Lonely Hearts Club Band',
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
    title: 'A Hard Day’s Night',
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

Une approche visuelle alternative courante consisterait à *différer* la mise à jour de la liste et continuer à afficher les résultats précédents jusqu'à ce que les nouveaux résultats soient disponibles. Le Hook [`useDeferredValue`](/reference/react/useDeferredValue) vous permet de passer une version différée de la requête aux enfants :

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

La `query` sera mise à jour immédiatement, donc le champ affichera la nouvelle valeur.  En revanche, la `deferredQuery` conservera l'ancienne valeur jusqu'à ce que les données soient chargées, de sorte que `SearchResults` affichera des résultats périmés pendant un instant.

Pour que l'utilisateur comprenne ce qui se passe, vous pouvez ajouter un indicateur visuel lorsque la liste affichée est périmée :

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1
}}>
  <SearchResults query={deferredQuery} />
</div>
```

Tapez `"a"` dans l'exemple ci-dessous, attendez les résultats, puis modifiez votre saisie pour `"ab"`.  Constatez qu'au lieu d'afficher le contenu de secours Suspense, vous voyez désormais une liste de résultats périmés assombrie, jusqu'à ce que les nouveaux résultats soient chargés :

<Sandpack>

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
        Rechercher des albums :
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Chargement...</h2>}>
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Note : ce composant est écrit au moyen d'une API expérimentale
// qui n'est pas encore disponible dans une version stable de React.

// Pour un exemple réaliste que vous pouvez suivre dès aujourd'hui,
// essayez un framework intégrant Suspense, tel que Relay ou Next.js.

=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>Aucun résultat pour <i>« {query} »</i></p>;
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
<<<<<<< HEAD

// Ceci est une solution de contournement pour permettre à la
// démo de fonctionner.
// TODO: remplacer par une véritable implémentation une fois
// le bug corrigé.
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
=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
```

```js src/data.js hidden
// Note : la façon de charger vos données dépend du framework
// que vous utilisez en complément de Suspense.
// Normalement, la logique de cache serait fournie par le framework.

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
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
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
    title: 'Sgt. Pepper’s Lonely Hearts Club Band',
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
    title: 'A Hard Day’s Night',
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

<Note>

Les valeurs différées ainsi que les [Transitions](#preventing-already-revealed-content-from-hiding) vous permettent d'éviter d'afficher le contenu de secours Suspense en lui préférant une indication de chargement.  Les transitions marquent l'ensemble de leur mise à jour comme non urgente, elles sont donc généralement utilisées par les frameworks et les bibliothèques de routage pour la navigation.  Les valeurs différées sont elles surtout utiles dans du code applicatif lorsque vous souhaitez indiquer qu'une partie de l'UI est non urgente, pour lui permettre d'être temporairement « en retard » sur le reste de l'UI.

</Note>

---

### Empêcher le masquage de contenu déjà révélé {/*preventing-already-revealed-content-from-hiding*/}

Lorsqu'un composant suspend, le périmètre Suspense parent le plus proche bascule vers le contenu de secours.  Ça peut produire une expérience utilisateur désagréable si du contenu était déjà affiché.  Essayez d'appuyer sur ce bouton :

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    setPage(url);
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Chargement...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Musicothèque
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Ouvrir la page artiste des Beatles
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Note : ce composant est écrit au moyen d'une API expérimentale
// qui n'est pas encore disponible dans une version stable de React.

// Pour un exemple réaliste que vous pouvez suivre dès aujourd'hui,
// essayez un framework intégrant Suspense, tel que Relay ou Next.js.

=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
<<<<<<< HEAD

// Ceci est une solution de contournement pour permettre à la
// démo de fonctionner.
// TODO: remplacer par une véritable implémentation une fois
// le bug corrigé.
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
=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Note : ce composant est écrit au moyen d'une API expérimentale
// qui n'est pas encore disponible dans une version stable de React.

// Pour un exemple réaliste que vous pouvez suivre dès aujourd'hui,
// essayez un framework intégrant Suspense, tel que Relay ou Next.js.

=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
<<<<<<< HEAD

// Ceci est une solution de contournement pour permettre à la
// démo de fonctionner.
// TODO: remplacer par une véritable implémentation une fois
// le bug corrigé.
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
=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note : la façon de charger vos données dépend du framework
// que vous utilisez en complément de Suspense.
// Normalement, la logique de cache serait fournie par le framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `Les Beatles étaient un groupe de rock anglais,
    formé à Liverpool en 1960, qui était composé de
    John Lennon, Paul McCartney, George Harrison
    et Ringo Starr.`;
}

async function getAlbums() {
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
    title: 'Sgt. Pepper’s Lonely Hearts Club Band',
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
    title: 'A Hard Day’s Night',
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Quand vous avez appuyé sur le bouton, le composant `Router` a affiché `ArtistPage` au lieu de `IndexPage`. Un composant au sein d'`ArtistPage` a suspendu, du coup le plus proche périmètre Suspense a basculé sur son contenu de secours. Comme ce périmètre était proche de la racine, la mise en page complète du site a été remplacée par `BigSpinner`.

Pour éviter ça, vous pouvez indiquer que la mise à jour de l'état de navigation est une *Transition*, en utilisant [`startTransition`](/reference/react/startTransition) :

```js {5,7}
function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

Ça dit à React que cette Transition d'état n'est pas urgente, et qu'il est préférable de continuer à afficher la page précédente plutôt que de masquer du contenu déjà révélé.  À présent cliquer sur le bouton « attend » que `Biography` soit chargé :

<Sandpack>

```js src/App.js
import { Suspense, startTransition, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Chargement...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        Musicothèque
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Ouvrir la page artiste des Beatles
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Note : ce composant est écrit au moyen d'une API expérimentale
// qui n'est pas encore disponible dans une version stable de React.

// Pour un exemple réaliste que vous pouvez suivre dès aujourd'hui,
// essayez un framework intégrant Suspense, tel que Relay ou Next.js.

=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
<<<<<<< HEAD

// Ceci est une solution de contournement pour permettre à la
// démo de fonctionner.
// TODO: remplacer par une véritable implémentation une fois
// le bug corrigé.
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
=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Note : ce composant est écrit au moyen d'une API expérimentale
// qui n'est pas encore disponible dans une version stable de React.

// Pour un exemple réaliste que vous pouvez suivre dès aujourd'hui,
// essayez un framework intégrant Suspense, tel que Relay ou Next.js.

=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
<<<<<<< HEAD

// Ceci est une solution de contournement pour permettre à la
// démo de fonctionner.
// TODO: remplacer par une véritable implémentation une fois
// le bug corrigé.
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
=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note : la façon de charger vos données dépend du framework
// que vous utilisez en complément de Suspense.
// Normalement, la logique de cache serait fournie par le framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `Les Beatles étaient un groupe de rock anglais,
    formé à Liverpool en 1960, qui était composé de
    John Lennon, Paul McCartney, George Harrison
    et Ringo Starr.`;
}

async function getAlbums() {
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
    title: 'Sgt. Pepper’s Lonely Hearts Club Band',
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
    title: 'A Hard Day’s Night',
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Une Transition n'attend pas que *tout* le contenu soit chargé. Elle attend seulement assez longtemps pour éviter d'avoir à masquer du contenu déjà révélé. Par exemple, le `Layout` du site était déjà révélé, ce serait donc dommage de le masquer derrière un *spinner* de chargement.  En revanche, le périmètre `Suspense` imbriqué autour d'`Albums` est nouveau, la Transition ne l'attend donc pas.

<Note>

Les routeurs compatibles Suspense sont censés enrober par défaut leurs navigations dans des Transitions.

</Note>

---

### Indiquer qu'une Transition est en cours {/*indicating-that-a-transition-is-happening*/}

Dans l'exemple précédent, une fois que vous avez cliqué sur le bouton, aucune indication visuelle ne vous informe qu'une navigation est en cours. Pour ajouter une indication, vous pouvez remplacer [`startTransition`](/reference/react/startTransition) par [`useTransition`](/reference/react/useTransition), qui vous donne une valeur booléenne `isPending`. Dans l'exemple qui suit, on l'utilise pour modifier le style de l'en-tête du site pendant qu'une Transition est en cours :

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Chargement...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Musicothèque
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Ouvrir la page artiste des Beatles
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Note : ce composant est écrit au moyen d'une API expérimentale
// qui n'est pas encore disponible dans une version stable de React.

// Pour un exemple réaliste que vous pouvez suivre dès aujourd'hui,
// essayez un framework intégrant Suspense, tel que Relay ou Next.js.

=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
<<<<<<< HEAD

// Ceci est une solution de contournement pour permettre à la
// démo de fonctionner.
// TODO: remplacer par une véritable implémentation une fois
// le bug corrigé.
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
=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

<<<<<<< HEAD
// Note : ce composant est écrit au moyen d'une API expérimentale
// qui n'est pas encore disponible dans une version stable de React.

// Pour un exemple réaliste que vous pouvez suivre dès aujourd'hui,
// essayez un framework intégrant Suspense, tel que Relay ou Next.js.

=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
<<<<<<< HEAD

// Ceci est une solution de contournement pour permettre à la
// démo de fonctionner.
// TODO: remplacer par une véritable implémentation une fois
// le bug corrigé.
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
=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note : la façon de charger vos données dépend du framework
// que vous utilisez en complément de Suspense.
// Normalement, la logique de cache serait fournie par le framework.
let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
    title: 'Sgt. Pepper’s Lonely Hearts Club Band',
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
    title: 'A Hard Day’s Night',
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

---

### Réinitialiser les périmètres Suspense à la navigation {/*resetting-suspense-boundaries-on-navigation*/}

Pendant une Transition, React évitera de masquer du contenu déjà révélé. Ceci dit, lorsque vous naviguez vers une route aux paramètres différents, vous voudrez peut-être indiquer à React que le contenu est *différent*.  Vous pouvez exprimer ça avec une `key` :

```js
<ProfilePage key={queryParams.id} />
```

Imaginez que vous naviguiez au sein d'une page de profil utilisateur, et que quelque chose suspende.  Si cette mise à jour est enrobée dans une Transition, elle ne déclenchera pas de contenu de secours pour le contenu déjà visible.  C'est bien le comportement attendu.

En revanche, imaginez maintenant que vous naviguiez entre deux profils utilisateurs différents.  Dans ce cas, afficher le contenu de secours aurait du sens. Par exemple, le fil des publications d'un utilisateur constitue un *contenu différent* de celui d'un autre utilisateur.  En spécifiant une `key`, vous garantissez que React traitera les fils de publications d'utilisateurs différents comme des composants différents, et réinitialisera les périmètres Suspense lors de la navigation.  Les routeurs compatibles Suspense sont censés le faire automatiquement.

---

### Fournir une UI de secours pour les erreurs serveur et le contenu 100% client {/*providing-a-fallback-for-server-errors-and-client-only-content*/}

Si vous utilisez une des [API de rendu serveur streamé](/reference/react-dom/server) (ou un framework qui repose dessus), React capitalisera sur vos périmètres `<Suspense>` pour le traitement des erreurs survenant côté serveur.  Si un composant lève une erreur côté serveur, React n'abandonnera pas le rendu serveur. Il cherchera plutôt le composant parent `<Suspense>` le plus proche et incluera son contenu de secours (tel qu'un *spinner*) dans le HTML généré par le serveur.  L'utilisateur verra le *spinner* pour commencer.

Côté client, React tentera de refaire le rendu de ce composant. Si le client rencontre également des erreurs, React lèvera une erreur et affichera le [périmètre d'erreur](/reference/react/Component#static-getderivedstatefromerror) le plus proche.  En revanche, si le rendu côté client fonctionne, React n'affichera aucune erreur à l'utilisateur, puisqu'au final le contenu aura bien pu être affiché.

Vous pouvez tirer parti de ça pour exclure certains composants du rendu serveur.  Il vous suffit de lever une erreur lorsque vous faites le rendu côté serveur, et de les enrober dans un périmètre `<Suspense>` pour remplacer leur HTML par un contenu de secours :

```js
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('La discussion ne devrait faire son rendu que côté client.');
  }
  // ...
}
```

Le HTML produit par le serveur incluera l'indicateur de chargement. Il sera ensuite remplacé par le composant `Chat` coté client.

---

## Dépannage {/*troubleshooting*/}

### Comment puis-je empêcher l'UI d'être remplacée par le contenu de secours lors d'une mise à jour ? {/*preventing-unwanted-fallbacks*/}

Le remplacement d'une UI visible par un contenu de secours produit une expérience utilisateur désagréable.  Ça peut arriver lorsqu'une mise à jour entraîne la suspension d'un composant, et que le périmètre Suspense le plus proche affiche déjà du contenu à l'utilisateur.

Pour empêcher ça, [indiquez que la mise à jour est non urgente grâce à `startTransition`](#preventing-already-revealed-content-from-hiding). Pendant la Transition, React attendra jusqu'à ce qu'assez de données aient été chargées, afin d'éviter l'affichage d'un contenu de secours indésirable :

```js {2-3,5}
function handleNextPageClick() {
  // Si cette mise à jour suspend, ne masque pas du contenu déjà visible
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

Ça évitera de masquer du contenu déjà visible.  En revanche, tout nouveau périmètre `Suspense` affichera tout de même immédiatement son contenu de secours pour éviter de bloquer l'UI, et affichera le contenu à l'utilisateur lorsque celui-ci deviendra disponible.

**React n'empêchera l'affichage de contenus de secours indésirables que pour les mises à jour non urgentes.**  Il ne retardera pas le rendu s'il est le résultat d'une mise à jour urgente. Vous devez explicitement utiliser une API telle que [`startTransition`](/reference/react/startTransition) ou [`useDeferredValue`](/reference/react/useDeferredValue).

Remarquez que si votre routeur est intégré avec Suspense, il est censé enrober automatiquement ses mises à jour avec [`startTransition`](/reference/react/startTransition).
