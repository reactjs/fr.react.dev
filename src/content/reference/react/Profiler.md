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

* `id` : la prop textuelle `id` du `<Profiler>` qui vient de boucler son rendu. Elle vous permet d’identifier quelle partie de l’arbre est finalisée lorsque vous utilisez plusieurs profileurs.
* `phase` : `"mount"`, `"update"` ou `"nested-update"`. Ça vous permet de savoir si l’arbre vient d’être monté pour la première fois ou a fait un nouveau rendu suite à un changement dans les props, l’état ou les Hooks.
* `actualDuration` : la durée en millisecondes du rendu du `<Profiler>` et de ses enfants pour la mise à jour concernée. Ça indique à quel point vos descendants profitent de la mémoïsation (notamment [`memo`](/reference/react/memo) et [`useMemo`](/reference/react/useMemo)). Idéalement, cette valeur devrait décroître de façon significative après le montage initial car la plupart des descendants ne referont un rendu que si leurs props changent.
* `baseDuration` : une estimation de la durée en millisecondes que prendrait un rendu complet du `<Profiler>` et de ses descendants, sans aucune optimisation. Elle est calculée en ajoutant les durées de rendu les plus récentes de chaque composant concerné. Cette valeur représente le coût maximal de rendu (c’est-à-dire le temps initial de montage sans mémoïsation). Comparez-la avec `actualDuration` pour déterminer si la mémoïsation fonctionne.
* `startTime` : un horodatage numérique du début de la mise à jour par React.
* `commitTime` : un horodatage numérique de la fin de la mise à jour par React. Cette valeur est partagée par tous les profileurs d’une même phase de commit, ce qui permet si besoin de les grouper.

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
