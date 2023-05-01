---
title: <Profiler>
---

<Intro>

`<Profiler>` vous permet de mesurer les performance de rendu d'un arbre React.

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

Enrober un arbre de composant dans un `<Profiler>` afin de mesurer ses performances de rendu.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### Props {/*props*/}

* `id`: Une chaîne de caractère identifiant le composant que vous souhaitez mesurer.
* `onRender`: Une [fonction de rappel `onRender`](#onrender-callback) appelée à chaque nouveau rendu d'un composant situé l'arbre profilé. Elle reçoit les informations de rendu tel que le composant et la durée prise.

#### Limitations {/*caveats*/}

* Le profilage une certaine lourdeur, il est ainsi **désactivé par défaut dans les builds de production**. Pour activer le profilage en production, vous devez utiliser un [build spécifique avec profilage activé](https://fb.me/react-profiling).

---

### `onRender` fonction de rappel {/*onrender-callback*/}

React va appeler votre fonction de rappel `onRender` avec les informations de rendu.

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Agréger ou afficher la durée de rendu...
}
```

#### Paramètres {/*onrender-parameters*/}

* `id`: La chaîne de caractère `id` utilisée en prop de l'arbre `<Profiler>`. Elle vous permet d'identifier quelles partie de l'arbre re-rendu en cas de co-existence de profiler.
* `phase`: `"mount"`, `"update"` ou `"nested-update"`. Ça vous permet de savoir si l'arbre a été monté pour la première fois ou re-monté à cause d'un changement dans les props, state ou hooks.
* `actualDuration`: La durée en millisecondes écoulée pendant le rendu de `<Profiler>` et ses enfants pour la mise à jour concernée. Elle indique à quel point vos enfants profitent de la mémorisation (plus précisément [`memo`](/reference/react/memo) et [`useMemo`](/reference/react/useMemo)). Idéalement, cette valeur devrait décroître de façon significative après le rendu initial car les enfants devront uniquement être re-rendu si leurs props spécifique changent.
* `baseDuration`: Le temps en milliseconde estimant la durée que prendrait un rendu complet de `<Profiler>` sans aucune optimisation. Elle est calculée en sommant la durée de chaque rendu des composants enfant. Cette valeur estime le pire scénario de rendu(c'est à dire le temps initial de rendu sans mémorisation). Comparez avec `actualDuration` afin de voir si la mémorisation fonctionne.
* `startTime`: A numeric timestamp for when React began rendering the current update.
* `endTime`: A numeric timestamp for when React committed the current update. This value is shared between all profilers in a commit, enabling them to be grouped if desirable.

---

## Usage {/*usage*/}

### Measuring rendering performance programmatically {/*measuring-rendering-performance-programmatically*/}

Wrap the `<Profiler>` component around a React tree to measure its rendering performance.

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

It requires two props: an `id` (string) and an `onRender` callback (function) which React calls any time a component within the tree "commits" an update.

<Pitfall>

Profiling adds some additional overhead, so **it is disabled in the production build by default.** To opt into production profiling, you need to enable a [special production build with profiling enabled.](https://fb.me/react-profiling)

</Pitfall>

<Note>

`<Profiler>` lets you gather measurements programmatically. If you're looking for an interactive profiler, try the Profiler tab in [React Developer Tools](/learn/react-developer-tools). It exposes similar functionality as a browser extension.

</Note>

---

### Measuring different parts of the application {/*measuring-different-parts-of-the-application*/}

You can use multiple `<Profiler>` components to measure different parts of your application:

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

You can also nest `<Profiler>` components:

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

Although `<Profiler>` is a lightweight component, it should be used only when necessary. Each use adds some CPU and memory overhead to an application.

---
