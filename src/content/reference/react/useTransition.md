---
title: useTransition
---

<Intro>

`useTransition` est un Hook React qui vous permet de mettre à jour l'état sans bloquer l'UI.

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useTransition()` {/*usetransition*/}

Appelez `useTransition` au niveau racine de votre composant pour marquer certaines mises à jour d'état comme étant des Transitions.

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

`useTransition` ne prend aucun argument.

#### Valeur renvoyée {/*returns*/}

`useTransition` renvoie un tableau avec exactement deux éléments :

1. Le drapeau `isPending` qui vous indique si la Transition est en cours.
2. La [fonction `startTransition`](#starttransition) qui vous permet de marquer une mise à jour d'état comme Transition.

---

### La fonction `startTransition` {/*starttransition*/}

La fonction `startTransition` renvoyée par `useTransition` vous permet de marquer une mise à jour d'état comme étant une Transition.

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

#### Paramètres {/*starttransition-parameters*/}

* `scope` : une fonction qui met à jour l'état en appelant au moins une [fonction `set`](/reference/react/useState#setstate).  React appelle immédiatement `scope` sans argument et marque toutes les mises à jour d'état demandées durant l'exécution synchrone de `scope` comme des Transitions.  Elles seront [non bloquantes](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) et [n'afficheront pas d'indicateurs de chargement indésirables](/reference/react/useTransition#preventing-unwanted-loading-indicators).

#### Valeur renvoyée {/*starttransition-returns*/}

`startTransition` ne renvoie rien.

#### Limitations et points à noter {/*starttransition-caveats*/}

* `useTransition` est un Hook, il ne peut donc être appelé qu'au sein de composants ou de Hooks personnalisés.  Si vous avez besoin de démarrer une Transition à un autre endroit (par exemple, depuis une bibliothèque de gestion de données), utilisez plutôt la fonction autonome [`startTransition`](/reference/react/startTransition).

* Vous pouvez enrober une mise à jour dans une Transition uniquement si vous avez accès à la fonction `set` de l'état en question.  Si vous souhaitez démarrer une Transition en réaction à une prop ou à la valeur renvoyée par un Hook personnalisé, utilisez plutôt [`useDeferredValue`](/reference/react/useDeferredValue).

* La fonction que vous passez à `startTransition` doit être synchrone.  React exécute cette fonction immédiatement, et marque toutes les mises à jour demandées lors de son exécution comme des Transitions.  Si vous essayez de faire des mises à jour d'état plus tard (par exemple avec un timer), elles ne seront pas marquées comme des Transitions.

* La fonction `startTransition` a une identité stable, elle ne figure donc généralement pas dans les dépendances des Effets, mais l'inclure n'entraînera pas un déclenchement d'Effet superflu.  Si le *linter* vous permet de l'omettre sans erreurs, c'est que cette omission est sans danger. [Apprenez-en davantage sur l'allègement des dépendances d'Effets](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* Une mise à jour d'état marquée comme une Transition pourra être interrompue par d'autres mises à jour d'état.  Par exemple, si vous mettez à jour un composant de graphe au sein d'une Transition, mais commencez alors une saisie dans un champ texte tandis que le graphe est en train de refaire son rendu, React redémarrera le rendu du composant graphe après avoir traité la mise à jour d'état du champ.

* Les mises à jour en Transition ne peuvent pas être utilisées pour contrôler des champs textuels.

* Si plusieurs Transitions sont en cours, React les regroupe pour le moment.  Cette limitation sera sans doute levée dans une future version.

---

## Utilisation {/*usage*/}

### Marquer une mise à jour d'état comme étant une Transition non bloquante {/*marking-a-state-update-as-a-non-blocking-transition*/}

Appelez `useTransition` au niveau racine de votre composant pour marquer des mises à jour d'état comme étant des *Transitions* non bloquantes.

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` renvoie un tableau avec exactement deux éléments :

1. Le <CodeStep step={1}>drapeau `isPending`</CodeStep> qui vous indique si la Transition est en cours.
2. La <CodeStep step={2}>fonction `startTransition`</CodeStep> qui vous permet de marquer une mise à jour d'état comme Transition.

Vous pouvez marquer une mise à jour d'état comme étant une Transition de la façon suivante :

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Les Transitions vous permettent de conserver la réactivité des mises à jour d'interface utilisateur, même sur des appareils lents.

Avec une Transition, votre UI reste réactive pendant le rendu. Par exemple, si l'utilisateur clique sur un onglet mais ensuite change d'avis et va sur un autre onglet, il peut le faire sans devoir d'abord attendre que le premier onglet ait fini son rendu.

<Recipes titleText="La différence entre useTransition et des mises à jour d’état classiques" titleId="examples">

#### Changer l'onglet actif au sein d'une Transition {/*updating-the-current-tab-in-a-transition*/}

Dans cet exemple, l'onglet « Articles » est **artificiellement ralenti** pour que son rendu prenne au moins une seconde.

Cliquez sur « Articles » puis cliquez immédiatement sur « Contact ». Remarquez que ça interrompt le rendu lent d'« Articles ». L'onglet « Contact » est affiché immédiatement.  Puisque la mise à jour d'état est marquée comme une Transition, un rendu lent ne gèle pas pour autant l'interface utilisateur.

<Sandpack>

```js
import { useState, useTransition } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        À propos
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Articles (lent)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Bienvenue sur mon profil !</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Un seul log. La lenteur réside en fait dans SlowPost.
  console.log('[ARTIFICIELLEMENT LENT] Rendu de 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Ne rien faire pendant 1 ms par élément pour simuler
    // du code extrêmement lent.
  }

  return (
    <li className="item">
      Article #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Vous me trouverez en ligne ici :
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

#### Changer l'onglet actif sans Transitions {/*updating-the-current-tab-without-a-transition*/}

Dans cet exemple, l'onglet « Articles » est toujours **artificiellement ralenti** pour que son rendu prenne au moins une seconde. Mais contrairement à l'exemple précédent, la mise à jour d'état ne figure **pas dans une Transition**.

Cliquez sur « Articles » puis cliquez immédiatement sur « Contact ». Remarquez que l'appli gèle pendant le rendu de l'onglet lent, et que l'UI ne répond plus. La mise à jour d'état ne figure pas dans une Transition, de sorte que le rendu lent gèle l'interface utilisateur.

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    setTab(nextTab);
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        À propos
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Articles (lent)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Bienvenue sur mon profil !</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Un seul log. La lenteur réside en fait dans SlowPost.
  console.log('[ARTIFICIELLEMENT LENT] Rendu de 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Ne rien faire pendant 1 ms par élément pour simuler
    // du code extrêmement lent.
  }

  return (
    <li className="item">
      Article #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Vous me trouverez en ligne ici :
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Mettre à jour le composant parent dans une Transition {/*updating-the-parent-component-in-a-transition*/}

Vous pouvez tout aussi bien mettre à jour l'état du composant parent depuis un appel à `useTransition`.  Par exemple, le composant `TabButton` enrobe la logique de son `onClick` avec une Transition :

```js {8-10}
export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

Puisque le composant parent met à jour son état au sein du gestionnaire d'événement `onClick`, cette mise à jour d'état sera marquée comme étant une Transition.  C'est pourquoi, comme dans l'exemple précédent, vous pouvez cliquer sur « Articles » puis immédiatement sur « Contact ».  Le changement d'onglet est marqué comme étant une Transition : il ne bloque donc pas les interactions utilisateur.

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        À propos
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Articles (lent)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Bienvenue sur mon profil !</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Un seul log. La lenteur réside en fait dans SlowPost.
  console.log('[ARTIFICIELLEMENT LENT] Rendu de 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Ne rien faire pendant 1 ms par élément pour simuler
    // du code extrêmement lent.
  }

  return (
    <li className="item">
      Article #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Vous me trouverez en ligne ici :
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

---

### Afficher une indication visuelle pendant la Transition {/*displaying-a-pending-visual-state-during-the-transition*/}

Vous pouvez utiliser la valeur booléenne `isPending` renvoyée par `useTransition` pour indiquer à l'utilisateur qu'une Transition est en cours.  Par exemple, le bouton d'onglet peut avoir un état visuel spécial « en cours » :

```js {4-6}
function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

Remarquez que le clic sur « Articles » semble désormais plus réactif parce que le bouton d'onglet lui-même se met à jour immédiatement :

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        À propos
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Articles (lent)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Bienvenue sur mon profil !</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Un seul log. La lenteur réside en fait dans SlowPost.
  console.log('[ARTIFICIELLEMENT LENT] Rendu de 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Ne rien faire pendant 1 ms par élément pour simuler
    // du code extrêmement lent.
  }

  return (
    <li className="item">
      Article #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Vous me trouverez en ligne ici :
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

---

### Empêcher les indicateurs de chargement indésirables {/*preventing-unwanted-loading-indicators*/}

Dans cet exemple, le composant `PostsTab` charge des données en utilisant une source de données [compatible Suspense](/reference/react/Suspense).  Lorsque vous cliquez sur l'onglet « Articles », le composant `PostsTab` *suspend*, entraînant l'affichage du plus proche contenu de secours :

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Chargement...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        À propos
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Articles
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js
export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Bienvenue sur mon profil !</p>
  );
}
```

```js src/PostsTab.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

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
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        Vous me trouverez en ligne ici :
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
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
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Article #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

Masquer le conteneur d'onglets dans son intégralité pour afficher un indicateur de chargement entraîne une expérience utilisateur désagréable.  Si vous ajoutez `useTransition` à `TabButton`, vous pouvez plutôt manifester l'attente en cours dans le bouton d'onglet.

Remarquez que cliquer sur « Articles » ne remplace plus l'ensemble du conteneur d'onglets avec un *spinner* :

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Chargement...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        À propos
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Articles
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Bienvenue sur mon profil !</p>
  );
}
```

```js src/PostsTab.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

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
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        Vous me trouverez en ligne ici :
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
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
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Ajoute un délai artificiel pour rendre l’attente perceptible.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Article #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[Apprenez-en davantage sur l'utilisation des Transitions avec Suspense](/reference/react/Suspense#preventing-already-revealed-content-from-hiding).

<Note>

Les Transitions « n'attendront » que le temps nécessaire pour éviter de masquer du contenu *déjà révélé* (comme le conteneur d'onglets).  Si l'onglet Articles avait un [périmètre `<Suspense>` imbriqué](/reference/react/Suspense#revealing-nested-content-as-it-loads), la Transition « n'attendrait » pas ce dernier.

</Note>

---

### Construire un routeur compatible Suspense {/*building-a-suspense-enabled-router*/}

Si vous construisez un framework React ou un routeur, nous vous recommandons de marquer toutes les navigations de pages comme étant des Transitions.

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

Nous recommandons ça pour deux raisons :

- [Les Transitions sont interruptibles](#marking-a-state-update-as-a-non-blocking-transition), ce qui permet à l'utilisateur de cliquer pour aller ailleurs sans devoir attendre la fin du rendu de son premier choix.
- [Les Transitions évitent les indicateurs de chargement indésirables](#preventing-unwanted-loading-indicators), ce qui vous évite de produire des « clignotements » désagréables lors de la navigation.

Voici un petit exemple de routeur très simplifié utilisant les Transitions pour ses navigations.

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

```js src/Albums.js hidden
import { fetchData } from './data.js';

// Note : ce composant est écrit au moyen d'une API expérimentale
// qui n'est pas encore disponible dans une version stable de React.

// Pour un exemple réaliste que vous pouvez suivre dès aujourd'hui,
// essayez un framework intégrant Suspense, tel que Relay ou Next.js.

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
```

```js src/Biography.js hidden
import { fetchData } from './data.js';

// Note : ce composant est écrit au moyen d'une API expérimentale
// qui n'est pas encore disponible dans une version stable de React.

// Pour un exemple réaliste que vous pouvez suivre dès aujourd'hui,
// essayez un framework intégrant Suspense, tel que Relay ou Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

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
```

```js src/Panel.js hidden
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

<Note>

Les routeurs [compatibles Suspense](/reference/react/Suspense) sont censés enrober par défaut leurs mises à jour de navigation dans des Transitions.

</Note>

---

### Afficher une erreur à l'utilisateur avec un périmètre d'erreur {/*displaying-an-error-to-users-with-error-boundary*/}

<Canary>

Les périmètres d'erreurs pour `useTransition` ne sont actuellement disponibles que sur les canaux de livraison Canary et Expérimental de React. Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>

Si une fonction passée à `startTransition` lève une erreur, vous pouvez afficher l'erreur à votre utilisateur au moyen d'un [périmètre d'erreur](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Pour utiliser un périmètre d'erreur, enrobez le composant qui appelle `useTransition` avec ce périmètre. Lorsque la fonction passée à `startTransition` lèvera une erreur, le contenu de secours du périmètre d'erreur sera affiché.

<Sandpack>

```js src/AddCommentContainer.js active
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️ Ça sent le pâté…</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // Pour les besoins de la démonstration uniquement
  if(comment == null) {
    throw Error('Example Error: An error thrown to trigger error boundary')
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // On ne passe volontairement pas de commentaire
          // afin d’entraîner une erreur.
          addComment();
        });
      }}
    >
      Ajouter un commentaire
    </button>
  );
}
```

```js src/App.js hidden
import { AddCommentContainer } from "./AddCommentContainer.js";

export default function App() {
  return <AddCommentContainer />;
}
```

```js src/index.js hidden
// TODO: mettre à jour l'import vers la version stable de React
// une fois que le Hook `use` actuellement Canary y figurera
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: mettre à jour cet exemple pour utiliser l'environnement
// de démo Server Component de Codesandbox quand celui-ci sera disponible
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## Dépannage {/*troubleshooting*/}

### Mettre à jour un champ depuis une Transition ne fonctionne pas {/*updating-an-input-in-a-transition-doesnt-work*/}

Vous ne pouvez pas utiliser une Transition pour mettre à jour une variable d'état qui contrôle un champ :

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Les Transitions ne peuvent enrober des mises à jour d'état qui contrôlent des champs
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

C'est parce que les Transitions sont non bloquantes, alors que la mise à jour d'un champ en réaction à un événement de modification doit survenir de façon synchrone.  Si vous souhaitez exécuter une Transition en réponse à une saisie, vous avez deux options :

1. Vous pouvez déclarer deux variables d'état distinctes : une pour l'état du champ (qui sera toujours mise à jour de façon synchrone), et une que vous mettrez à jour au sein d'une Transition.  Ça vous permet de contrôler le champ avec l'état synchrone, tout en passant la variable d'état en Transition (qui est susceptible de « retarder » par rapport à la saisie) au reste de votre logique de rendu.
2. Sinon, vous pouvez n'avoir qu'une variable d'état et utiliser [`useDeferredValue`](/reference/react/useDeferredValue) qui vous permettra d'être « en retard » sur la véritable valeur.  Ça déclenchera automatiquement des rendus non bloquants pour « rattraper » la nouvelle valeur.

---

### React ne traite pas ma mise à jour d'état comme étant une Transition {/*react-doesnt-treat-my-state-update-as-a-transition*/}

Lorsque vous enrobez une mise à jour d'état dans une Transition, assurez-vous qu'elle survient effectivement *pendant* l'appel à `startTransition` :

```js
startTransition(() => {
  // ✅ L’état est mis à jour *pendant* l’appel à startTransition
  setPage('/about');
});
```

La fonction que vous passez à `startTransition` doit être synchrone.

Vous ne pouvez pas marquer une mise à jour comme étant une Transition avec ce genre de code :

```js
startTransition(() => {
  // ❌ L’état est mis à jour *après* l’appel à startTransition
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

Faites plutôt ceci :

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ L’état est mis à jour *pendant* l’appel à startTransition
    setPage('/about');
  });
}, 1000);
```

Dans le même esprit, vous ne pouvez pas marquer une mise à jour comme étant une Transition avec du code ressemblant à ça :

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ L’état est mis à jour *après* l’appel à startTransition
  setPage('/about');
});
```

En revanche, ce type de code fonctionne :

```js
await someAsyncFunction();
startTransition(() => {
  // ✅ L’état est mis à jour *pendant* l’appel à startTransition
  setPage('/about');
});
```

---

### Je veux appeler `useTransition` ailleurs que dans un composant {/*i-want-to-call-usetransition-from-outside-a-component*/}

Vous ne pouvez pas appeler `useTransition` hors d'un composant parce que c'est un Hook.  Pour ce type de besoin, préférez la fonction autonome [`startTransition`](/reference/react/startTransition).   Son fonctionnement est identique, à ceci près qu'elle ne fournit pas l'indicateur `isPending`.

---

### La fonction que je passe à `startTransition` est exécutée immédiatement {/*the-function-i-pass-to-starttransition-executes-immediately*/}

Si vous exécutez ce code, ça affichera 1, 2, 3 :

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**C'est censé afficher 1, 2, 3.**  La fonction que vous passez à `startTransition` ne doit pas être différée.  Contrairement au `setTimeout` du navigateur, la fonction de rappel n'est pas appelée plus tard.  React exécute votre fonction immédiatement, mais les mises à jour d'état que vous y demandez *pendant son exécution* sont marquées comme étant des Transitions.  Vous pouvez vous imaginer le fonctionnement suivant :

```js
// Version simplifiée du fonctionnement de React

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... planifie une mise à jour d’état en tant que Transition ...
  } else {
    // ... planifie une mise à jour d’état urgente ...
  }
}
```
