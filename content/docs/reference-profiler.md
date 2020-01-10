---
id: profiler
title: API du profileur
layout: docs
category: Reference
permalink: docs/profiler.html
---

Le `Profiler` mesure à quelle fréquence une application React réalise son rendu, et détermine le « coût » de ces rendus.  L’objectif est de vous aider à identifier les parties d’une application qui sont lentes et pourraient bénéficier [d’optimisations telles que la mémoïsation](https://reactjs.org/docs/hooks-faq.html#how-to-memoize-calculations).

> Remarque
>
> Le profilage pénalise légèrement les performances effectives, il est donc **désactivé dans [le build de production](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build)**.
>
> Pour activer le profilage en production, React fournit un build de production spécifique avec le profilage
> activé.  Vous pouvez apprendre comment l’utiliser sur [fb.me/react-profiling](https://fb.me/react-profiling).

## Utilisation {#usage}

Un `Profiler` peut être ajouté n’importe où dans l’arborescence React pour mesurer le coût de rendu de la partie de l’arbre qu’il entoure.  Il nécessite deux props : un `id` (chaîne de caractères) et une fonction de rappel `onRender` que React appellera dès qu’un composant au sein de l’arborescence enrobée « finalise » *(“commits”, NdT)* une mise à jour.

Par exemple, pour profiler le composant `Navigation` et ses descendants, on ferait ceci :

```js{3}
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Main {...props} />
  </App>
);
```

Vous pouvez utiliser plusieurs composants `Profiler` pour mesurer différentes parties d’une même application :

```js{3,6}
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Profiler id="Main" onRender={callback}>
      <Main {...props} />
    </Profiler>
  </App>
);
```

Les composants `Profiler` peuvent par ailleurs être imbriqués pour mesurer différents périmètres dans une même partie de l’arborescence :

```js{2,6,8}
render(
  <App>
    <Profiler id="Panel" onRender={callback}>
      <Panel {...props}>
        <Profiler id="Content" onRender={callback}>
          <Content {...props} />
        </Profiler>
        <Profiler id="PreviewPane" onRender={callback}>
          <PreviewPane {...props} />
        </Profiler>
      </Panel>
    </Profiler>
  </App>
);
```

> Remarque
>
> Même si `Profiler` est un composant léger, il ne devrait être utilisé que lorsqu’il est nécessaire, car chaque utilisation entraîne une pénalité en termes de processeur et de mémoire pour l’application.

## Fonction de rappel `onRender` {#onrender-callback}

Le `Profiler` nécessite une fonction `onRender` dans ses props.  React appelle cette fonction dès qu’un composant dans l’arbre profilé « finalise » *(“commits”, NdT)* une mise à jour.  La fonction reçoit des paramètres dérivant ce qui vient de faire l‘objet d’un rendu, et le temps que ça a pris.

```js
function onRenderCallback(
  id, // la prop "id" du Profiler dont l’arborescence vient d’être mise à jour
  phase, // soit "mount" (si on est au montage) soit "update" (pour une mise à jour)
  actualDuration, // temps passé à faire le rendu de la mise à jour finalisée
  baseDuration, // temps estimé du rendu pour l’ensemble du sous-arbre sans mémoïsation
  startTime, // horodatage du début de rendu de cette mise à jour par React
  commitTime, // horodatage de la finalisation de cette mise à jour par React
  interactions // Un Set des interactions qui constituent cette mise à jour
) {
  // Agrège ou logue les mesures de rendu…
}
```

Examinons chaque argument d’un peu plus près…

* **`id: string`** -
la prop `id` du `Profiler` dont l’arbre vient d’être finalisé.
On s’en sert pour identifier la partie de l’arbre qui vient d’être finalisée si on utilise plusieurs profileurs.
* **`phase: "mount" | "update"`** -
nous permet de savoir si l’arbre vient d’être monté (premier rendu) ou si c’est un nouveau rendu suite à une modification des props, de l’état local ou de hooks.
* **`actualDuration: number`** -
temps passé à faire le rendu du `Profiler` et de ses descendants lors de la mise à jour courante.
Nous permet de voir dans quelle mesure le sous-arbre tire parti de la mémoïsation (ex. [`React.memo`](/docs/react-api.html#reactmemo), [`useMemo`](/docs/hooks-reference.html#usememo), [`shouldComponentUpdate`](/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate)).
Dans l’idéal cette valeur devrait décroître significativement après le montage initial, car de nombreux descendants ne devraient nécessiter un nouveau rendu que si leurs propres props changent.
* **`baseDuration: number`** -
durée du `render` le plus récent qui revisitait l’ensemble des composants dans l’arbre enrobé par le `Profiler`.
Cette valeur nous permet d’estimer un scénario du pire (ex. le montage initial ou un arbre sans mémoïsation).
* **`startTime: number`** -
horodatage du début du rendu de la mise à jour courante par React.
* **`commitTime: number`** -
horodatage de la finalisation de la mise à jour courante par React.
Cette valeur est partagée entre tous les profileurs d’une même finalisation, ce qui permet de les regrouper si on le souhaite.
* **`interactions: Set`** -
un `Set` des [« interactions »](https://fb.me/react-interaction-tracing) qui ont été pistées lors de la planification de la mise à jour (ex. lors des appels à `render` ou `setState`).

> Remarque
>
> Vous pouvez utiliser les interactions pour identifier la cause d’une mise à jour, même si l’API pour le pistage des interactions est encore expérimentale.
>
> Vous pouvez en apprendre davantage sur [fb.me/react-interaction-tracing](https://fb.me/react-interaction-tracing).
