---
title: <Profiler>
---

<Intro>

`<Profiler>` vous permet de mesurer dans votre code les performances de rendu d’un arbre React.

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
* `onRender`: Une [fonction de rappel `onRender`](#onrender-callback) appelée à chaque nouveau rendu d’un composant situé l’arbre profilé. Elle reçoit les informations de rendu tel que le composant et la durée prise.Ò

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

* `id`: La chaîne de caractère `id` utilisée en prop de l’arbre `<Profiler>`. Elle vous permet d’identifier quelles partie de l’arbre re-rendu en cas de co-existence de profiler.
* `phase`: `"mount"`, `"update"` ou `"nested-update"`. Ça vous permet de savoir si l’arbre a été monté pour la première fois ou re-monté à cause d’un changement dans les props, state ou hooks.
* `actualDuration`: La durée en millisecondes écoulée pendant le rendu de `<Profiler>` et de ses enfants pour la mise à jour concernée. Elle indique à quel point vos enfants profitent de la mémorisation (plus précisément [`memo`](/reference/react/memo) et [`useMemo`](/reference/react/useMemo)). Idéalement, cette valeur devrait décroître de façon significative après le rendu initial car les enfants devront uniquement être re-rendu si leurs props changent.
* `baseDuration`: Le durée en milliseconde estimant le temps que prendrait un rendu complet de `<Profiler>` sans aucune optimisation. Elle est calculée en sommant la durée de rendu des composants enfant. Cette valeur représente la durée maximale de rendu (c’est à dire le temps initial de rendu sans mémorisation). Comparez la avec `actualDuration` afin de voir si la mémorisation fonctionne.
* `startTime`: Un horodatage numérique de React datant le début de la mise à jour.
* `endTime`: Un horodatage numérique de React datant la fin de la mise à jour. Cette valeur est partagée entre les profileurs, leur permettant de les grouper si souhaité.

---

## Utilisation {/*usage*/}

### Mesurer les performances de votre code {/*measuring-rendering-performance-programmatically*/}

Enrober un arbre React avec `<Profiler>` pour mesurer ses performance des rendu.

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

Deux props sont nécessaires : une chaîne de caractère `id` et une fonction de rappel `onRender`que React appelle à chaque mise à jour de l’arbre.

<Pitfall>

Le profilage une certaine lourdeur, il est ainsi **désactivé par défaut dans les builds de production**. Pour activer le profilage en production, vous devez utiliser un [build spécifique avec profilage activé](https://fb.me/react-profiling).

</Pitfall>

<Note>

`<Profiler>` vous permet de mesurer les performances de façon unitaires. Si vous cherchez à mesurer vos performances globales, essayez l’onglet profiler avec les [outils de développement](/learn/react-developer-tools). Des fonctionnalités similaires sont disponibles avec l’extension web.

</Note>

---

### Mesurer différentes parties de votre application {/*measuring-different-parts-of-the-application*/}

Vous pouvez utiliser plusieurs composants `<Profiler>` pour mesurer différentes parties de votre application to measure different parts of your application :

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

Bien que le composant `<Profiler>` soit léger, il ne devrait être utilisé que lorsque nécessaire. Chaque utilisation ajoute de la charge CPU et de l’utilisation mémoire à une application.

---
