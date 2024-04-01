---
title: <Profiler>
---

<Intro>

`<Profiler>` vous permet de mesurer au sein de votre code les performances de rendu d’un arbre de composants React.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<Profiler>` {/*profiler*/}

Enrobez un arbre de composants dans un `<Profiler>` afin de mesurer ses performances de rendu.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### Props {/*props*/}

* `id` : une chaîne de caractères identifiant la portion de l’UI que vous souhaitez mesurer.
* `onRender` : une [fonction de rappel `onRender`](#onrender-callback) appelée à chaque nouveau rendu d’un composant situé dans l’arbre profilé. Elle reçoit des informations indiquant ce qui a fait l’objet d'un rendu et quel temps ça a pris.

#### Limitations {/*caveats*/}

* Le profilage alourdit un peu le moteur, il est donc **désactivé par défaut dans les *builds* de production**. Pour activer le profilage en production, vous devez utiliser un [*build* spécifique avec profilage activé](https://fb.me/react-profiling).

---

### Fonction de rappel `onRender` {/*onrender-callback*/}

React appellera votre fonction de rappel `onRender` avec des informations de rendu.

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Agréger ou afficher les durées de rendu...
}
```

#### Paramètres {/*onrender-parameters*/}

<<<<<<< HEAD
* `id` : la prop textuelle `id` du `<Profiler>` qui vient de boucler son rendu. Elle vous permet d’identifier quelle partie de l’arbre est finalisée lorsque vous utilisez plusieurs profileurs.
* `phase` : `"mount"`, `"update"` ou `"nested-update"`. Ça vous permet de savoir si l’arbre vient d’être monté pour la première fois ou a fait un nouveau rendu suite à un changement dans les props, l’état ou les hooks.
* `actualDuration` : la durée en millisecondes du rendu du `<Profiler>` et de ses enfants pour la mise à jour concernée. Ça indique à quel point vos descendants profitent de la mémoïsation (notamment [`memo`](/reference/react/memo) et [`useMemo`](/reference/react/useMemo)). Idéalement, cette valeur devrait décroître de façon significative après le montage initial car la plupart des descendants ne referont un rendu que si leurs props changent.
* `baseDuration` : une estimation de la durée en millisecondes que prendrait un rendu complet du `<Profiler>` et de ses descendants, sans aucune optimisation. Elle est calculée en ajoutant les durées de rendu les plus récentes de chaque composant concerné. Cette valeur représente le coût maximal de rendu (c’est-à-dire le temps initial de montage sans mémoïsation). Comparez-la avec `actualDuration` pour déterminer si la mémoïsation fonctionne.
* `startTime` : un horodatage numérique du début de la mise à jour par React.
* `commitTime` : un horodatage numérique de la fin de la mise à jour par React. Cette valeur est partagée par tous les profileurs d’une même phase de commit, ce qui permet si besoin de les grouper.
=======
* `id`: The string `id` prop of the `<Profiler>` tree that has just committed. This lets you identify which part of the tree was committed if you are using multiple profilers.
* `phase`: `"mount"`, `"update"` or `"nested-update"`. This lets you know whether the tree has just been mounted for the first time or re-rendered due to a change in props, state, or Hooks.
* `actualDuration`: The number of milliseconds spent rendering the `<Profiler>` and its descendants for the current update. This indicates how well the subtree makes use of memoization (e.g. [`memo`](/reference/react/memo) and [`useMemo`](/reference/react/useMemo)). Ideally this value should decrease significantly after the initial mount as many of the descendants will only need to re-render if their specific props change.
* `baseDuration`: The number of milliseconds estimating how much time it would take to re-render the entire `<Profiler>` subtree without any optimizations. It is calculated by summing up the most recent render durations of each component in the tree. This value estimates a worst-case cost of rendering (e.g. the initial mount or a tree with no memoization). Compare `actualDuration` against it to see if memoization is working.
* `startTime`: A numeric timestamp for when React began rendering the current update.
* `commitTime`: A numeric timestamp for when React committed the current update. This value is shared between all profilers in a commit, enabling them to be grouped if desirable.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

---

## Utilisation {/*usage*/}

### Mesurer les performances depuis votre code {/*measuring-rendering-performance-programmatically*/}

Enrobez un arbre React avec `<Profiler>` pour mesurer ses performances des rendu.

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

Deux props sont nécessaires : une chaîne de caractères `id` et une fonction de rappel `onRender` que React appellera à chaque fois qu’un composant dans l’arbre finalisera une mise à jour (phase de “commit”).

<Pitfall>

Le profilage alourdit un peu le moteur, il est donc **désactivé par défaut dans les *builds* de production**. Pour activer le profilage en production, vous devez utiliser un [*build* spécifique avec profilage activé](https://fb.me/react-profiling).

</Pitfall>

<Note>

`<Profiler>` vous permet de mesurer les performances depuis votre propre code. Si vous cherchez un outil interactif, essayez l’onglet Profiler des [outils de développement](/learn/react-developer-tools). Cette extension de votre navigateur propose des fonctionnalités similaires.

</Note>

---

### Mesurer différentes parties de votre application {/*measuring-different-parts-of-the-application*/}

Vous pouvez utiliser plusieurs composants `<Profiler>` pour mesurer différentes parties de votre application :

```js {5,7}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

Vous pouvez aussi imbriquer des `<Profiler>` :

```js {5,7,9,12}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

Bien que le composant `<Profiler>` soit léger, il ne devrait être utilisé que lorsque c’est nécessaire. Chaque utilisation ajoute de la charge CPU et de la consommation mémoire à une application.

---
