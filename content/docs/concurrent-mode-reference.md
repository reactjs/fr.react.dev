---
id: concurrent-mode-reference
title: Référence de l’API du mode concurrent (expérimental)
permalink: docs/concurrent-mode-reference.html
prev: concurrent-mode-adoption.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

> Attention
>
> Cette page décrit **des fonctionnalités expérimentales qui [ne sont pas encore disponibles](/docs/concurrent-mode-adoption.html) dans une version stable**. Ne vous basez pas sur les builds expérimentaux de React pour vos applis en production. Ces fonctionnalités sont susceptibles d’évoluer de façon significative et sans avertissement avant d’intégrer officiellement React.
>
> Cette documentation est destinée aux personnes curieuses ou habituées à adopter les nouvelles technologies très tôt. **Si vous débutez en React, ne vous préoccupez pas de ces fonctionnalités** : vous n’avez pas besoin de les apprendre pour le moment.

</div>

Cette page est une référence de l’API du [mode concurrent](/docs/concurrent-mode-intro.html) de React.  Si vous cherchez plutôt un guide introductif, jetez un coup d’œil à [Approches pour une UI concurrente](/docs/concurrent-mode-patterns.html).

**Remarque : ceci est un Aperçu pour la Communauté et ne constitue pas la version stable finale.  Ces API changeront probablement à l’avenir.  Ne les utilisez qu’à vos risques et périls !**

- [Activer le mode concurrent](#concurrent-mode)
    - [`createRoot`](#createroot)
    - [`createBlockingRoot`](#createblockingroot)
- [API de Suspense](#suspense)
    - [`<Suspense>`](#suspensecomponent)
    - [`<SuspenseList>`](#suspenselist)
    - [`useTransition`](#usetransition)
    - [`useDeferredValue`](#usedeferredvalue)

## Activer le mode concurrent {#concurrent-mode}

### `createRoot` {#createroot}

```js
ReactDOM.createRoot(rootNode).render(<App />);
```

Remplace `ReactDOM.render(<App />, rootNode)` et active le mode concurrent.

Pour en savoir plus sur le mode concurrent, consultez la [documentation du mode concurrent](/docs/concurrent-mode-intro.html).

### `createBlockingRoot` {#createblockingroot}

```js
ReactDOM.createBlockingRoot(rootNode).render(<App />)
```

Remplace `ReactDOM.render(<App />, rootNode)` at active le [mode bloquant](/docs/concurrent-mode-adoption.html#migration-step-blocking-mode).

Choisir le mode concurrent introduit des modifications sémantiques dans le fonctionnement de React. Ça signifie que vous ne pouvez pas utiliser le mode concurrent sur seulement certains composants. Pour cette raison, certaines applis risquent de ne pas pouvoir migrer directement vers le mode concurrent.

Le mode bloquant fournit une petite partie des fonctionnalités du mode concurrent, et constitue une étape de migration intermédiaire pour les applis qui ne peuvent malheureusement pas migrer directement.

## API de Suspense {#suspense}

### `<Suspense>` {#suspensecomponent}

```js
<Suspense fallback={<h1>Chargement...</h1>}>
  <ProfilePhoto />
  <ProfileDetails />
</Suspense>
```

`Suspense` permet à vos composants « d’attendre » que quelque chose ait lieu avant qu’ils procèdent à leur rendu, en affichant dans l’intervalle une interface utilisateur (UI) de repli.

Dans cet example, `ProfileDetails` attend qu’un appel API asynchrone charge des données.  Pendant que nous attendons `ProfileDetails` et `ProfilePhoto`, nous affichons le repli `Chargement...` à leur place.  Il faut bien comprendre que jusqu’à ce que tous les enfants de `<Suspense>` soient chargés, nous continuerons à afficher l’UI de repli.

`Suspense` prend deux props :

* **`fallback`** fournit un indicateur de chargement.  Cette UI de repli est affichée jusqu’à ce que les enfants du composant `Suspense` aient fini leur rendu.
* **`unstable_avoidThisFallback`** prend un booléen.  Elle indique à React s’il doit « sauter » la révélation de cette limite (c’est-à-dire le comportement d’attente) lors du chargement initial.  Cette API sera probablement retirée dans une version à venir.

### `<SuspenseList>` {#suspenselist}

```js
<SuspenseList revealOrder="forwards">
  <Suspense fallback={'Chargement...'}>
    <ProfilePicture id={1} />
  </Suspense>
  <Suspense fallback={'Chargement...'}>
    <ProfilePicture id={2} />
  </Suspense>
  <Suspense fallback={'Chargement...'}>
    <ProfilePicture id={3} />
  </Suspense>
  ...
</SuspenseList>
```

`SuspenseList` aide à orchestrer la révélation progressive de composants susceptibles d’être suspendus.

Lorsque plusieurs composants ont besoin de charger des données, celles-ci peuvent arriver dans un ordre imprévisible.  Cependant, si vous enrobez ces éléments dans un `SuspenseList`, React ne montrera un élément de la liste qu’une fois que tous les éléments qui le précèdent auront été affichés (ce comportement est d’ailleurs ajustable).

`SuspenseList` prend deux props :

* **`revealOrder` (`'forwards'`, `'backwards'`, `'together'`)** indique dans quel ordre les enfants de la `SuspenseList` doivent être révélés.
  * `'together'` les révèle *tous* d’un coup une fois qu’ils sont prêts, au lieu de le faire individuellement.
* **`tail` (`'collapsed'`, `'hidden'`)** indique comment afficher les éléments non chargés dans une `SuspenseList`.
  * Par défaut, `SuspenseList` affichera toutes les UI de repli dans la liste.
  * `'collapsed'` affiche uniquement le repli du prochain élément dans la liste.
  * `'hidden'` n’affiche aucun élément non chargé.

Remarquez que `SuspenseList` n’opère que sur les composants enfants `Suspense` et `SuspenseList` les plus proches d’elle. Elle ne recherche pas les périmètres à plus d’un niveau de profondeur.  Ceci dit, il est possible d’imbriquer plusieurs composants `SuspenseList` pour construire des grilles.

### `useTransition` {#usetransition}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
```

`useTransition` permet aux composants d’éviter des états de chargement indésirables en attendant que le contenu soit chargé avant de **transiter vers le prochain écran**.  Il permet aussi aux composants de différer des chargements de données plus lents vers des rendus ultérieurs afin que les mises à jour les plus cruciales puissent être affichées immédiatement.

Le hook `useTransition` renvoie deux valeurs dans un tableau.

* `startTransition` est une fonction qui prend une fonction de rappel.  Nous pouvons l’utiliser pour indiquer à React quel état nous souhaitons différer.
* `isPending` est un booléen, grâce auquel React nous indique si nous sommes en train d’attendre la fin de la transition.

**Si une mise à jour donnée de l’état entraîne la suspension d’un composant, cette mise à jour devrait être enrobée dans une transition.**

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(resource.userId);
            setResource(fetchProfileData(nextUserId));
          });
        }}
      >
        Suivant
      </button>
      {isPending ? " Chargement..." : null}
      <Suspense fallback={<Spinner />}>
        <ProfilePage resource={resource} />
      </Suspense>
    </>
  );
}
```

Dans ce code, nous avons enrobé notre chargement de données avec `startTransition`.  Ça nous permet de commencer immédiatement à charger les données du profil, tout en différant le rendu de la prochaine page de profil et de son `Spinner` associé pendant 2 secondes (le temps indiqué par `timeoutMs`).

Le booléen `isPending` est fourni par React pour nous indiquer que notre composant est en cours de transition, ce qui nous permet d’avertir l’utilisateur en affichant un texte de chargement au sein de la précédente page de profil.

**Pour une exploration en profondeur des transitions, vous pouvez lire les [Approches pour une UI concurrente](/docs/concurrent-mode-patterns.html#transitions).**

#### Configuration de `useTransition` {#usetransition-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useTransition` accepte une **configuration Suspense optionnelle** avec un champ `timeoutMs`.  Ce délai d’expiration (en millisecondes) indique à React combien de temps attendre avant d’afficher le prochain état (dans l’exemple ci avant, ce serait la prochaine page de profil).

**Remarque : nous vous conseillons de partager une unique configuration Suspense entre vos différents modules.**

### `useDeferredValue` {#usedeferredvalue}

```js
const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });
```

Renvoie une version différée de la valeur qui est susceptible d’être « en retard » pour un temps maximum de `timeoutMs`.

On utilise couramment ça pour préserver la réactivité de l’interface, avec des affichages immédiats suite à des saisies par l’utilisateur·rice malgré le besoin d’attendre un chargement de données.

La saisie de texte constitue un bon exemple :

```js
function App() {
  const [text, setText] = useState("bonjour");
  const deferredText = useDeferredValue(text, { timeoutMs: 2000 });

  return (
    <div className="App">
      {/* Continue à passer le texte actuel au champ */}
      <input value={text} onChange={handleChange} />
      ...
      {/* Mais la liste des résultats est autorisée à « être en retard » si nécessaire */}
      <MySlowList text={deferredText} />
    </div>
  );
 }
```

Ça nous permet de commencer à afficher le nouveau texte du `input` immédiatement, ce qui donne un sentiment de réactivité pour la page web.  Dans le même temps, la mise à jour de `MySlowList` peut « retarder » à hauteur de 2 secondes en vertu du `timeoutMs`, ce qui lui permet de réaliser son rendu adapté au texte courant en arrière-plan.

**Vous trouverez une exploration en profondeur des valeurs différés dans les [Approches pour une UI concurrente](/docs/concurrent-mode-patterns.html#deferring-a-value).**

#### Configuration de `useDeferredValue` {#usedeferredvalue-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useDeferredValue` accepte une **configuration Suspense optionnelle** avec un champ `timeoutMs`.  Ce délai d’expiration (en millisecondes) indique à React pendant combien de temps la valeur différée est autorisée à retarder.

React essaiera toujours de minimiser le retard lorsque le réseau et l’appareil le permettent.
