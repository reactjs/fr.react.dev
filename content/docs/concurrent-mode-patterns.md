---
id: concurrent-mode-patterns
title: Approches pour une UI concurrente (expérimental)
permalink: docs/concurrent-mode-patterns.html
prev: concurrent-mode-suspense.html
next: concurrent-mode-adoption.html
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
> Cette documentation est destinée aux personnes curieuses ou habituées à adopter les nouvelles technologies très tôt. **Si vous débutez en React, ne vous préoccupez pas de ces fonctionnalités** : vous n’avez pas besoin de les apprendre pour le moment. Par exemple, si vous cherchez un tutoriel sur le chargement de données qui fonctionne dès maintenant, lisez plutôt [cet article](https://www.robinwieruch.de/react-hooks-fetch-data/).

</div>

D’habitude, quand nous mettons à jour l’état, nous nous attendons à ce que nos changements se manifestent immédiatement à l’écran.  C’est logique, dans la mesure où nous voulons que notre appli réagisse rapidement aux saisies utilisateurs.  Néanmoins, il existe des cas dans lesquels nous pourrions préférer **différer l’apparition d’une mise à jour à l’écran**.

Par exemple, si nous passons d’une page à une autre et que ni le code ni les données pour ce prochain écran ne sont encore chargés, on pourrait trouver frustrant de voir immédiatement s’afficher une page vierge avec un indicateur de chargement.  Nous préférerions peut-être rester un peu plus longtemps sur l’écran précédent.  Historiquement, implémenter cette approche en React n’était pas chose aisée.  Le mode concurrent offre un nouveau jeu d’outils pour y arriver.

- [Transitions](#transitions)
  - [Enrober `setState` dans une transition](#wrapping-setstate-in-a-transition)
  - [Ajouter un indicateur d’attente](#adding-a-pending-indicator)
  - [Le point sur les changements](#reviewing-the-changes)
  - [Où survient la mise à jour ?](#where-does-the-update-happen)
  - [Les transitions sont partout](#transitions-are-everywhere)
  - [Intégrer les transitions au système de conception](#baking-transitions-into-the-design-system)
- [Les trois étapes](#the-three-steps)
  - [Par défaut : En retrait → Squelette → Terminé](#default-receded-skeleton-complete)
  - [Préférable : En attente → Squelette → Terminé](#preferred-pending-skeleton-complete)
  - [Enrobez les fonctionnalités paresseuses avec `<Suspense>`](#wrap-lazy-features-in-suspense)
  - [Le « train » de révélations de Suspense](#suspense-reveal-train)
  - [Différer un indicateur d’attente](#delaying-a-pending-indicator)
  - [En résumé](#recap)
- [Autres approches](#other-patterns)
  - [Dissocier les états à forte et faible priorité](#splitting-high-and-low-priority-state)
  - [Différer une valeur](#deferring-a-value)
  - [`SuspenseList`](#suspenselist)
- [Prochaines étapes](#next-steps)

## Transitions {#transitions}

Reprenons [cette démo](https://codesandbox.io/s/infallible-feather-xjtbu) de la page précédente sur [Suspense pour le chargement de données](/docs/concurrent-mode-suspense.html).

Lorsqu’on clique sur le bouton « Suivant » pour basculer le profil actif, les données de la page existante disparaissent immédiatement, et nous avons à nouveau un indicateur de chargement pour la page entière.  On pourrait qualifier cet état de chargement « d’indésirable ». **Ce serait sympa si nous pouvions « sauter » cet état et attendre qu’un peu de contenu arrive avant de transiter vers le nouvel écran.**

React offre un nouveau Hook intégré `useTransition()` pour nous y aider.

On peut l’utiliser en trois temps.

Tout d’abord, nous devons nous assurer d’utiliser effectivement le mode concurrent.  Nous en reparlerons plus tard dans [Adopter le mode concurrent](/docs/concurrent-mode-adoption.html), mais pour l’instant il suffit de vérifier qu’on utilise bien `ReactDOM.createRoot()` au lieu de `ReactDOM.render()` afin que ce mode fonctionne :

```js
const rootElement = document.getElementById("root");
// Activation explicite du mode concurrent
ReactDOM.createRoot(rootElement).render(<App />);
```

Ensuite, nous ajouterons un import du Hook `useTransition` de React :

```js
import React, { useState, useTransition, Suspense } from "react";
```

Enfin, nous l’utiliserons au sein de notre composant `App` :

```js{3-5}
function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition({
    timeoutMs: 3000
  });
  // ...
```

**Pour le moment, par lui-même, ce code ne fait rien.**  Nous allons devoir utiliser les valeurs renvoyées par ce Hook pour mettre en place notre transition d’état.  Voici les deux valeurs que renvoie `useTransition` :

* `startTransition` est une fonction.  Nous l’utiliserons pour indiquer à React *quelle* mise à jour d’état nous souhaitons différer.
* `isPending` est un booléen, grâce auquel React nous indique si nous sommes actuellement en train d’attendre la fin de la transition.

Nous allons les utiliser dans un instant.

Remarquez que nous passons un objet de configuration à `useTransition`.  Sa propriété `timeoutMs` indique **combien de temps nous acceptons d’attendre que la transition se termine**.  En passant `{ timeoutMs: 3000 }`, nous disons « si le prochain profil prend plus de 3 secondes à charger, affiche le gros *spinner*—mais d’ici là, tu peux rester sur l’écran précédent ».

### Enrober `setState` dans une transition {#wrapping-setstate-in-a-transition}

Notre gestionnaire de clic pour le bouton « Suivant » déclenche la bascule du profil courant dans notre état local :

```js{4}
<button
  onClick={() => {
    const nextUserId = getNextId(resource.userId);
    setResource(fetchProfileData(nextUserId));
  }}
>
```

Nous allons enrober cette mise à jour de l’état dans un appel à `startTransition`.  C’est ainsi que nous indiquons à React que **ça ne nous dérange pas que React diffère cette mise à jour de l’état** si elle entraînait un état de chargement indésirable :

```js{3,6}
<button
  onClick={() => {
    startTransition(() => {
      const nextUserId = getNextId(resource.userId);
      setResource(fetchProfileData(nextUserId));
    });
  }}
>
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/musing-driscoll-6nkie)**

Cliquez sur « Suivant » plusieurs fois.  Remarquez comme une différence se fait déjà bien sentir. **Au lieu de voir immédiatement un écran vide suite au clic, nous continuons à voir l’écran précédent pendant un instant.**  Une fois les données chargées, React transite sur le nouvel écran.

Si nous ajustons nos API pour mettre 5 secondes à répondre, [nous pouvons confirmer](https://codesandbox.io/s/relaxed-greider-suewh) que React décide alors « d’abandonner » en transitant vers le prochain écran au bout de 3 secondes.  C’est dû à notre argument `{ timeoutMs: 3000 }` dans `useTransition()`.  À titre d’exemple, si nous avions plutôt passé `{ timeoutMs: 60000 }`, il aurait attendu une minute entière.

### Ajouter un indicateur d’attente {#adding-a-pending-indicator}

Il reste quelque chose qui semble cassé dans [notre dernier exemple](https://codesandbox.io/s/musing-driscoll-6nkie).  Bien sûr, c’est sympa de ne pas voir un « mauvais » état de chargement. **Mais n’avoir aucun indicateur de progression est quelque part encore pire !**  Quand on clique sur « Suivant », rien ne se passe et on dirait que l’appli est cassée.

Notre appel à `useTransition()` renvoie deux valeurs : `startTransition` et `isPending`.

```js
  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });
```

Nous avons déjà utilisé `startTransition` pour enrober la mise à jour de l’état.  Nous allons maintenant utiliser `isPending` en prime.  React nous fournit ce booléen pour nous indiquer que **nous sommes en train d’attendre la fin d’une transition.**  Nous l’utiliserons pour indiquer que quelque chose se passe :

```js{4,14}
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
    <ProfilePage resource={resource} />
  </>
);
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/jovial-lalande-26yep)**

Voilà qui rend beaucoup mieux !  Quand nous cliquons sur « Suivant », le bouton est désactivé puisque cliquer dessus plusieurs fois n’aurait pas de sens.  Et le nouveau texte « Chargement... » indique à l’utilisateur que l’appli n’a pas gelé.

### Le point sur les changements {#reviewing-the-changes}

Revoyons l’ensemble des modifications apportées à notre [exemple d’origine](https://codesandbox.io/s/infallible-feather-xjtbu) :

```js{3-5,9,11,14,19}
function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition({
    timeoutMs: 3000
  });
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
      <ProfilePage resource={resource} />
    </>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/jovial-lalande-26yep)**

Il ne nous aura fallu que sept lignes de code pour ajouter cette transition :

* Nous avons importé le Hook `useTransition` et l’avons utilisé dans le composant pour mettre à jour l’état.
* Nous avons passé `{ timeoutMs: 3000 }` pour rester sur l’écran précédent à raison de 3 secondes maximum.
* Nous avons enrobé la mise à jour de l’état par un `startTransition` pour indiquer à React qu’il pouvait choisir de la différer.
* Nous utilisons `isPending` pour communiquer la notion d’une transition d’état en cours à l’utilisateur et désactiver le bouton.

Résultat : cliquer sur « Suivant » n’entraîne pas une transition d’état immédiate vers un état de chargement « indésirable » mais reste plutôt sur l’écran précédent pour y communiquer une progression.

### Où survient la mise à jour ? {#where-does-the-update-happen}

Voilà qui n’était pas très difficile à implémenter.  Cependant, si vous commencez à réfléchir sur les mécanismes qui rendent ce résultat possible, ça risque de vous faire quelques nœuds au cerveau.  Si nous définissons l’état, comment se fait-il que nous n’en constations pas le résultat immédiatement ? *Où* a lieu le prochain rendu de `<ProfilePage>` ?

Clairement, les deux « versions » de `<ProfilePage>` existent en même temps.  On sait que l’ancienne existe parce qu’on la voit à l’écran et qu’on y affiche même un indicateur de progression.  Et on sait que la nouvelle version existe aussi *quelque part*, parce que c’est celle qu’on attend !

**Mais comment peut-on avoir en même temps deux versions du même composant ?**

On touche là à l’essence-même du mode concurrent.  Nous avons [dit précédemment](/docs/concurrent-mode-intro.html#intentional-loading-sequences) que c’était un peu comme si React travaillait sur la mise à jour de l’état sur une « branche ».  Une autre façon de conceptualiser ça consiste à se dire qu’enrober une mise à jour de l’état avec `startTransition` déclenche son rendu *« dans un univers parallèle »*, comme dans les films de science-fiction.  Nous ne « voyons » pas cet univers directement—mais nous pouvons en détecter des signaux qui nous informent que quelque chose s’y passe (`isPending`).  Quand la mise à jour est enfin prête, nos « univers » fusionnent, et nous voyons le résultat à l’écran !

Jouez un peu plus avec la [démo](https://codesandbox.io/s/jovial-lalande-26yep), et tentez d’imaginez ce comportement derrière elle.

Bien entendu, ces deux versions de l’arbre effectuant leur rendu *en même temps* ne sont qu’une illusion, tout comme l’idée que tous les programmes tournent sur votre ordinateur en même temps est une illusion.  Un système d’exploitation bascule entre les différentes applications très rapidement.  De façon similaire, React peut basculer entre la version de votre arbre affichée à l’écran et celle « en préparation » pour l’affichage suivant.

Une API comme `useTransition` vous permet de vous concentrer sur l’expérience utilisateur souhaitée, sans avoir à vous encombrer l’esprit avec les détails techniques de son implémentation.  Néanmoins, imaginer que les mises à jour enrobées par `useTransition` surviennent « sur une branche » ou dans un « monde parallèle » reste une métaphore utile.

### Les transitions sont partout {#transitions-are-everywhere}

Comme nous l’avons appris dans [Suspense pour le chargement de données](/docs/concurrent-mode-suspense.html), tout composant peut « se suspendre » à tout moment s’il a besoin de données qui ne sont pas encore disponibles.  Nous pouvons positionner stratégiquement des périmètres `<Suspense>` dans différentes parties de l’arbre pour gérer ça, mais ça ne sera pas toujours suffisant.

Reprenons notre [première démo de Suspense](https://codesandbox.io/s/frosty-hermann-bztrp) qui ne se préoccupait que d’un profil.  Pour le moment, elle ne récupère les données qu’une seule fois.  Ajoutons un bouton « Rafraîchir » qui vérifiera si le serveur a des mises à jour à proposer.

Notre premier essai pourrait ressembler à ceci :

```js{6-8,13-15}
const initialResource = fetchUserAndPosts();

function ProfilePage() {
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    setResource(fetchUserAndPosts());
  }

  return (
    <Suspense fallback={<h1>Chargement du profil...</h1>}>
      <ProfileDetails resource={resource} />
      <button onClick={handleRefreshClick}>
        Rafraîchir
      </button>
      <Suspense fallback={<h1>Chargement des publications...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/boring-shadow-100tf)**

Dans cet exemple, nous commençons à charger les données lorsque le composant se charge *et* à chaque fois que nous activons « Rafraîchir ».  Nous plaçons le résultat de l’appel à `fetchUserAndPosts()` dans l’état pour que les composants plus bas dans l’arbre puissent commencer à lire les nouvelles données de la requête que nous venons de déclencher.

On peut voir dans [cet exemple](https://codesandbox.io/s/boring-shadow-100tf) qu’activer « Rafraîchir » fonctionne bien. Les composants `<ProfileDetails>` et `<ProfileTimeline>` reçoivent une nouvelle prop `resource` qui représente les données à jour, ils « se suspendent » parce que la réponse n’est pas encore là, et nous en voyons les UI de repli.  Une fois la réponse chargée, nous voyons les publications mises à jour (notre API factice en ajoute toutes les 3 secondes).

Cependant, l’expérience obtenue est très saccadée.  Nous étions en train de consulter une page, mais celle-ci a été remplacée par un état de chargement alors même que nous étions en train d’interagir avec.  C’est déroutant. **Tout comme précédemment, pour éviter d’afficher un état de chargement indésirable, nous pouvons enrober la mise à jour de l’état par une transition :**

```js{2-5,9-11,21}
function ProfilePage() {
  const [startTransition, isPending] = useTransition({
    // Attendre 10 secondes avant d’afficher l’UI de repli
    timeoutMs: 10000
  });
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    startTransition(() => {
      setResource(fetchProfileData());
    });
  }

  return (
    <Suspense fallback={<h1>Chargement du profil...</h1>}>
      <ProfileDetails resource={resource} />
      <button
        onClick={handleRefreshClick}
        disabled={isPending}
      >
        {isPending ? "Rafraîchissement..." : "Rafraîchir"}
      </button>
      <Suspense fallback={<h1>Chargement des publications...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/sleepy-field-mohzb)**

Voilà qui est beaucoup plus agréable ! Cliquer sur « Rafraîchir » ne nous vire plus de la page que nous étions en train de consulter. Nous voyons que quelque chose est en train de charger « en place » dans le contenu, et lorsque les données sont enfin prêtes, elles sont automatiquement affichées.

### Intégrer les transitions au système de conception {#baking-transitions-into-the-design-system}

Nous voyons désormais qu’il est *très* courant d’avoir besoin de `useTransition`. Presque chaque clic sur un bouton ou autre interaction qui pourrait entraîner la suspension d’un composant bénéficierait d’un enrobage dans `useTransition` pour éviter de masquer accidentellement du contenu avec lequel l’utilisateur interagit.

Ça peut vite entraîner beaucoup de code répétitif d’un composant à l’autre.  C’est pourquoi **nous conseillons généralement d’intégrer `useTransition` dans le *système de conception* des composants de votre appli**.  On pourrait par exemple extraire la logique de transition dans notre propre composant `<Button>` :

```js{7-9,20,24}
function Button({ children, onClick }) {
  const [startTransition, isPending] = useTransition({
    timeoutMs: 10000
  });

  function handleClick() {
    startTransition(() => {
      onClick();
    });
  }

  const spinner = (
    // ...
  );

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isPending}
      >
        {children}
      </button>
      {isPending ? spinner : null}
    </>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/modest-ritchie-iufrh)**

Remarquez que le bouton ne se soucie pas de savoir *quel* état vous mettez à jour. Il enrobe dans une transition *n’importe quelle* mise à jour d’état qui survient au sein du gestionnaire `onClick`.  À présent que notre `<Button>` s’occupe tout seul de mettre la transition en place, le composant `<ProfilePage>` n’a plus besoin de s’en occuper lui-même :

```js{4-6,11-13}
function ProfilePage() {
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    setResource(fetchProfileData());
  }

  return (
    <Suspense fallback={<h1>Chargement du profil...</h1>}>
      <ProfileDetails resource={resource} />
      <Button onClick={handleRefreshClick}>
        Rafraîchir
      </Button>
      <Suspense fallback={<h1>Chargement des publications...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/modest-ritchie-iufrh)**

Quand on clique sur un bouton, celui-ci démarre une transition et appelle `props.onClick()` à l’intérieur—ce qui déclenche `handleRefreshClick` dans le composant `<ProfilePage>`.  On commence à charger les données à jour, mais ça n’active pas l’UI de repli car nous sommes au sein d’une transition, et que l’expiration de 10 secondes spécifiée dans l’appel à `useTransition` n’est pas encore atteinte.  Pendant que la transition est active, le bouton affiche un indicateur de chargement intégré.

On voit maintenant comment le mode concurrent nous aide à obtenir une bonne expérience utilisateur sans pour autant sacrifier l’isolation et la modularité des composants.  React coordonne la transition.

## The Three Steps {#the-three-steps}

<!-- RESUME -->

By now we have discussed all of the different visual states that an update may go through. In this section, we will give them names and talk about the progression between them.

<br>

<img src="../images/docs/cm-steps-simple.png" alt="Three steps" />

At the very end, we have the **Complete** state. That's where we want to eventually get to. It represents the moment when the next screen is fully rendered and isn't loading more data.

But before our screen can be Complete, we might need to load some data or code. When we're on the next screen, but some parts of it are still loading, we call that a **Skeleton** state.

Finally, there are two primary ways that lead us to the Skeleton state. We will illustrate the difference between them with a concrete example.

### Default: Receded → Skeleton → Complete {#default-receded-skeleton-complete}

Open [this example](https://codesandbox.io/s/prod-grass-g1lh5) and click "Open Profile". You will see several visual states one by one:

* **Receded**: For a second, you will see the `<h1>Loading the app...</h1>` fallback.
* **Skeleton:** You will see the `<ProfilePage>` component with `<h2>Chargement des publications...</h2>` inside.
* **Complete:** You will see the `<ProfilePage>` component with no fallbacks inside. Everything was fetched.

How do we separate the Receded and the Skeleton states? The difference between them is that the **Receded** state feels like "taking a step back" to the user, while the **Skeleton** state feels like "taking a step forward" in our progress to show more content.

In this example, we started our journey on the `<HomePage>`:

```js
<Suspense fallback={...}>
  {/* previous screen */}
  <HomePage />
</Suspense>
```

After the click, React started rendering the next screen:

```js
<Suspense fallback={...}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails />
    <Suspense fallback={...}>
      <ProfileTimeline />
    </Suspense>
  </ProfilePage>
</Suspense>
```

Both `<ProfileDetails>` and `<ProfileTimeline>` need data to render, so they suspend:

```js{4,6}
<Suspense fallback={...}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails /> {/* suspends! */}
    <Suspense fallback={<h2>Chargement des publications...</h2>}>
      <ProfileTimeline /> {/* suspends! */}
    </Suspense>
  </ProfilePage>
</Suspense>
```

When a component suspends, React needs to show the closest fallback. But the closest fallback to `<ProfileDetails>` is at the top level:

```js{2,3,7}
<Suspense fallback={
  // We see this fallback now because of <ProfileDetails>
  <h1>Loading the app...</h1>
}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails /> {/* suspends! */}
    <Suspense fallback={...}>
      <ProfileTimeline />
    </Suspense>
  </ProfilePage>
</Suspense>
```

This is why when we click the button, it feels like we've "taken a step back". The `<Suspense>` boundary which was previously showing useful content (`<HomePage />`) had to "recede" to showing the fallback (`<h1>Loading the app...</h1>`). We call that a **Receded** state.

As we load more data, React will retry rendering, and `<ProfileDetails>` can render successfully. Finally, we're in the **Skeleton** state. We see the new page with missing parts:

```js{6,7,9}
<Suspense fallback={...}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails />
    <Suspense fallback={
      // We see this fallback now because of <ProfileTimeline>
      <h2>Chargement des publications...</h2>
    }>
      <ProfileTimeline /> {/* suspends! */}
    </Suspense>
  </ProfilePage>
</Suspense>
```

Eventually, they load too, and we get to the **Complete** state.

This scenario (Receded → Skeleton → Complete) is the default one. However, the Receded state is not very pleasant because it "hides" existing information. This is why React lets us opt into a different sequence (**Pending** → Skeleton → Complete) with `useTransition`.

### Preferred: Pending → Skeleton → Complete {#preferred-pending-skeleton-complete}

When we `useTransition`, React will let us "stay" on the previous screen -- and show a progress indicator there. We call that a **Pending** state. It feels much better than the Receded state because none of our existing content disappears, and the page stays interactive.

You can compare these two examples to feel the difference:

* Default: [Receded → Skeleton → Complete](https://codesandbox.io/s/prod-grass-g1lh5)
* **Preferred: [Pending → Skeleton → Complete](https://codesandbox.io/s/focused-snow-xbkvl)**

The only difference between these two examples is that the first uses regular `<button>`s, but the second one uses our custom `<Button>` component with `useTransition`.

### Wrap Lazy Features in `<Suspense>` {#wrap-lazy-features-in-suspense}

Open [this example](https://codesandbox.io/s/nameless-butterfly-fkw5q). When you press a button, you'll see the Pending state for a second before moving on. This transition feels nice and fluid.

We will now add a brand new feature to the profile page -- a list of fun facts about a person:

```js{8,13-25}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Chargement des publications...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <ProfileTrivia resource={resource} />
    </>
  );
}

function ProfileTrivia({ resource }) {
  const trivia = resource.trivia.read();
  return (
    <>
      <h2>Fun Facts</h2>
      <ul>
        {trivia.map(fact => (
          <li key={fact.id}>{fact.text}</li>
        ))}
      </ul>
    </>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/focused-mountain-uhkzg)**

If you press "Open Profile" now, you can tell something is wrong. It takes whole seven seconds to make the transition now! This is because our trivia API is too slow. Let's say we can't make the API faster. How can we improve the user experience with this constraint?

If we don't want to stay in the Pending state for too long, our first instinct might be to set `timeoutMs` in `useTransition` to something smaller, like `3000`. You can try this [here](https://codesandbox.io/s/practical-kowalevski-kpjg4). This lets us escape the prolonged Pending state, but we still don't have anything useful to show!

There is a simpler way to solve this. **Instead of making the transition shorter, we can "disconnect" the slow component from the transition** by wrapping it into `<Suspense>`:

```js{8,10}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Chargement des publications...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/condescending-shape-s6694)**

This reveals an important insight. React always prefers to go to the Skeleton state as soon as possible. Even if we use transitions with long timeouts everywhere, React will not stay in the Pending state for longer than necessary to avoid the Receded state.

**If some feature isn't a vital part of the next screen, wrap it in `<Suspense>` and let it load lazily.** This ensures we can show the rest of the content as soon as possible. Conversely, if a screen is *not worth showing* without some component, such as `<ProfileDetails>` in our example, do *not* wrap it in `<Suspense>`. Then the transitions will "wait" for it to be ready.

### Suspense Reveal "Train" {#suspense-reveal-train}

When we're already on the next screen, sometimes the data needed to "unlock" different `<Suspense>` boundaries arrives in quick succession. For example, two different responses might arrive after 1000ms and 1050ms, respectively. If you've already waited for a second, waiting another 50ms is not going to be perceptible. This is why React reveals `<Suspense>` boundaries on a schedule, like a "train" that arrives periodically. This trades a small delay for reducing the layout thrashing and the number of visual changes presented to the user.

You can see a demo of this [here](https://codesandbox.io/s/admiring-mendeleev-y54mk). The "posts" and "fun facts" responses come within 100ms of each other. But React coalesces them and "reveals" their Suspense boundaries together.

### Delaying a Pending Indicator {#delaying-a-pending-indicator}

Our `Button` component will immediately show the Pending state indicator on click:

```js{2,13}
function Button({ children, onClick }) {
  const [startTransition, isPending] = useTransition({
    timeoutMs: 10000
  });

  // ...

  return (
    <>
      <button onClick={handleClick} disabled={isPending}>
        {children}
      </button>
      {isPending ? spinner : null}
    </>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/floral-thunder-iy826)**

This signals to the user that some work is happening. However, if the transition is relatively short (less than 500ms), it might be too distracting and make the transition itself feel *slower*.

One possible solution to this is to *delay the spinner itself* from displaying:

```css
.DelayedSpinner {
  animation: 0s linear 0.5s forwards makeVisible;
  visibility: hidden;
}

@keyframes makeVisible {
  to {
    visibility: visible;
  }
}
```

```js{2-4,10}
const spinner = (
  <span className="DelayedSpinner">
    {/* ... */}
  </span>
);

return (
  <>
    <button onClick={handleClick}>{children}</button>
    {isPending ? spinner : null}
  </>
);
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/gallant-spence-l6wbk)**

With this change, even though we're in the Pending state, we don't display any indication to the user until 500ms has passed. This may not seem like much of an improvement when the API responses are slow. But compare how it feels [before](https://codesandbox.io/s/thirsty-liskov-1ygph) and [after](https://codesandbox.io/s/hardcore-http-s18xr) when the API call is fast. Even though the rest of the code hasn't changed, suppressing a "too fast" loading state improves the perceived performance by not calling attention to the delay.

### Recap {#recap}

The most important things we learned so far are:

* By default, our loading sequence is Receded → Skeleton → Complete.
* The Receded state doesn't feel very nice because it hides existing content.
* With `useTransition`, we can opt into showing a Pending state first instead. This will keep us on the previous screen while the next screen is being prepared.
* If we don't want some component to delay the transition, we can wrap it in its own `<Suspense>` boundary.
* Instead of doing `useTransition` in every other component, we can build it into our design system.

## Other Patterns {#other-patterns}

Transitions are probably the most common Concurrent Mode pattern you'll encounter, but there are a few more patterns you might find useful.

### Splitting High and Low Priority State {#splitting-high-and-low-priority-state}

When you design React components, it is usually best to find the "minimal representation" of state. For example, instead of keeping `firstName`, `lastName`, and `fullName` in state, it's usually better keep only `firstName` and `lastName`, and then calculate `fullName` during rendering. This lets us avoid mistakes where we update one state but forget the other state.

However, in Concurrent Mode there are cases where you might *want* to "duplicate" some data in different state variables. Consider this tiny translation app:

```js
const initialQuery = "Hello, world";
const initialResource = fetchTranslation(initialQuery);

function App() {
  const [query, setQuery] = useState(initialQuery);
  const [resource, setResource] = useState(initialResource);

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    setResource(fetchTranslation(value));
  }

  return (
    <>
      <input
        value={query}
        onChange={handleChange}
      />
      <Suspense fallback={<p>Loading...</p>}>
        <Translation resource={resource} />
      </Suspense>
    </>
  );
}

function Translation({ resource }) {
  return (
    <p>
      <b>{resource.read()}</b>
    </p>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/brave-villani-ypxvf)**

Notice how when you type into the input, the `<Translation>` component suspends, and we see the `<p>Loading...</p>` fallback until we get fresh results. This is not ideal. It would be better if we could see the *previous* translation for a bit while we're fetching the next one.

In fact, if we open the console, we'll see a warning:

```
Warning: App triggered a user-blocking update that suspended.

The fix is to split the update into multiple parts: a user-blocking update to provide immediate feedback, and another update that triggers the bulk of the changes.

Refer to the documentation for useTransition to learn how to implement this pattern.
```

As we mentioned earlier, if some state update causes a component to suspend, that state update should be wrapped in a transition. Let's add `useTransition` to our component:

```js{4-6,10,13}
function App() {
  const [query, setQuery] = useState(initialQuery);
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition({
    timeoutMs: 5000
  });

  function handleChange(e) {
    const value = e.target.value;
    startTransition(() => {
      setQuery(value);
      setResource(fetchTranslation(value));
    });
  }

  // ...

}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/zen-keldysh-rifos)**

Try typing into the input now. Something's wrong! The input is updating very slowly.

We've fixed the first problem (suspending outside of a transition). But now because of the transition, our state doesn't update immediately, and it can't "drive" a controlled input!

The answer to this problem **is to split the state in two parts:** a "high priority" part that updates immediately, and a "low priority" part that may wait for a transition.

In our example, we already have two state variables. The input text is in `query`, and we read the translation from `resource`. We want changes to the `query` state to happen immediately, but changes to the `resource` (i.e. fetching a new translation) should trigger a transition.

So the correct fix is to put `setQuery` (which doesn't suspend) *outside* the transition, but `setResource` (which will suspend) *inside* of it.

```js{4,5}
function handleChange(e) {
  const value = e.target.value;

  // Outside the transition (urgent)
  setQuery(value);

  startTransition(() => {
    // Inside the transition (may be delayed)
    setResource(fetchTranslation(value));
  });
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/lively-smoke-fdf93)**

With this change, it works as expected. We can type into the input immediately, and the translation later "catches up" to what we have typed.

### Deferring a Value {#deferring-a-value}

By default, React always renders a consistent UI. Consider code like this:

```js
<>
  <ProfileDetails user={user} />
  <ProfileTimeline user={user} />
</>
```

React guarantees that whenever we look at these components on the screen, they will reflect data from the same `user`. If a different `user` is passed down because of a state update, you would see them changing together. You can't ever record a screen and find a frame where they would show values from different `user`s. (If you ever run into a case like this, file a bug!)

This makes sense in the vast majority of situations. Inconsistent UI is confusing and can mislead users. (For example, it would be terrible if a messenger's Send button and the conversation picker pane "disagreed" about which thread is currently selected.)

However, sometimes it might be helpful to intentionally introduce an inconsistency. We could do it manually by "splitting" the state like above, but React also offers a built-in Hook for this:

```js
import { useDeferredValue } from 'react';

const deferredValue = useDeferredValue(value, {
  timeoutMs: 5000
});
```

To demonstrate this feature, we'll use [the profile switcher example](https://codesandbox.io/s/musing-ramanujan-bgw2o). Click the "Next" button and notice how it takes 1 second to do a transition.

Let's say that fetching the user details is very fast and only takes 300 milliseconds. Currently, we're waiting a whole second because we need both user details and posts to display a consistent profile page. But what if we want to show the details faster?

If we're willing to sacrifice consistency, we could **pass potentially stale data to the components that delay our transition**. That's what `useDeferredValue()` lets us do:

```js{2-4,10,11,21}
function ProfilePage({ resource }) {
  const deferredResource = useDeferredValue(resource, {
    timeoutMs: 1000
  });
  return (
    <Suspense fallback={<h1>Chargement du profil...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Chargement des publications...</h1>}>
        <ProfileTimeline
          resource={deferredResource}
          isStale={deferredResource !== resource}
        />
      </Suspense>
    </Suspense>
  );
}

function ProfileTimeline({ isStale, resource }) {
  const posts = resource.posts.read();
  return (
    <ul style={{ opacity: isStale ? 0.7 : 1 }}>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/vigorous-keller-3ed2b)**

The tradeoff we're making here is that `<ProfileTimeline>` will be inconsistent with other components and potentially show an older item. Click "Next" a few times, and you'll notice it. But thanks to that, we were able to cut down the transition time from 1000ms to 300ms.

Whether or not it's an appropriate tradeoff depends on the situation. But it's a handy tool, especially when the content doesn't change very visible between items, and the user might not even realize they were looking at a stale version for a second.

It's worth noting that `useDeferredValue` is not *only* useful for data fetching. It also helps when an expensive component tree causes an interaction (e.g. typing in an input) to be sluggish. Just like we can "defer" a value that takes too long to fetch (and show its old value despite others components updating), we can do this with trees that take too long to render.

For example, consider a filterable list like this:

```js
function App() {
  const [text, setText] = useState("hello");

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <div className="App">
      <label>
        Type into the input:{" "}
        <input value={text} onChange={handleChange} />
      </label>
      ...
      <MySlowList text={text} />
    </div>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/pensive-shirley-wkp46)**

In this example, **every item in `<MySlowList>` has an artificial slowdown -- each of them blocks the thread for a few milliseconds**. We'd never do this in a real app, but this helps us simulate what can happen in a deep component tree with no single obvious place to optimize.

We can see how typing in the input causes stutter. Now let's add `useDeferredValue`:

```js{3-5,18}
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text, {
    timeoutMs: 5000
  });

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <div className="App">
      <label>
        Type into the input:{" "}
        <input value={text} onChange={handleChange} />
      </label>
      ...
      <MySlowList text={deferredText} />
    </div>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/infallible-dewdney-9fkv9)**

Now typing has a lot less stutter -- although we pay for this by showing the results with a lag.

How is this different from debouncing? Our example has a fixed artificial delay (3ms for every one of 80 items), so there is always a delay, no matter how fast our computer is. However, the `useDeferredValue` value only "lags behind" if the rendering takes a while. There is no minimal lag imposed by React. With a more realistic workload, you can expect the lag to adjust to the user’s device. On fast machines, the lag would be smaller or non-existent, and on slow machines, it would be more noticeable. In both cases, the app would remain responsive. That’s the advantage of this mechanism over debouncing or throttling, which always impose a minimal delay and can't avoid blocking the thread while rendering.

Even though there is an improvement in responsiveness, this example isn't as compelling yet because Concurrent Mode is missing some crucial optimizations for this use case. Still, it is interesting to see that features like `useDeferredValue` (or `useTransition`) are useful regardless of whether we're waiting for network or for computational work to finish.

### SuspenseList {#suspenselist}

`<SuspenseList>` is the last pattern that's related to orchestrating loading states.

Consider this example:

```js{5-10}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Chargement des publications...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/proud-tree-exg5t)**

The API call duration in this example is randomized. If you keep refreshing it, you will notice that sometimes the posts arrive first, and sometimes the "fun facts" arrive first.

This presents a problem. If the response for fun facts arrives first, we'll see the fun facts below the `<h2>Chargement des publications...</h2>` fallback for posts. We might start reading them, but then the *posts* response will come back, and shift all the facts down. This is jarring.

One way we could fix it is by putting them both in a single boundary:

```js
<Suspense fallback={<h2>Chargement des publications and fun facts...</h2>}>
  <ProfileTimeline resource={resource} />
  <ProfileTrivia resource={resource} />
</Suspense>
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/currying-violet-5jsiy)**

The problem with this is that now we *always* wait for both of them to be fetched. However, if it's the *posts* that came back first, there's no reason to delay showing them. When fun facts load later, they won't shift the layout because they're already below the posts.

Other approaches to this, such as composing Promises in a special way, are increasingly difficult to pull off when the loading states are located in different components down the tree.

To solve this, we will import `SuspenseList`:

```js
import { SuspenseList } from 'react';
```

`<SuspenseList>` coordinates the "reveal order" of the closest `<Suspense>` nodes below it:

```js{3,11}
function ProfilePage({ resource }) {
  return (
    <SuspenseList revealOrder="forwards">
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Chargement des publications...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </SuspenseList>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/black-wind-byilt)**

The `revealOrder="forwards"` option means that the closest `<Suspense>` nodes inside this list **will only "reveal" their content in the order they appear in the tree -- even if the data for them arrives in a different order**. `<SuspenseList>` has other interesting modes: try changing `"forwards"` to `"backwards"` or `"together"` and see what happens.

You can control how many loading states are visible at once with the `tail` prop. If we specify `tail="collapsed"`, we'll see *at most one* fallback at the time. You can play with it [here](https://codesandbox.io/s/adoring-almeida-1zzjh).

Keep in mind that `<SuspenseList>` is composable, like anything in React. For example, you can create a grid by putting several `<SuspenseList>` rows inside a `<SuspenseList>` table.

## Next Steps {#next-steps}

Concurrent Mode offers a powerful UI programming model and a set of new composable primitives to help you orchestrate delightful user experiences.

It's a result of several years of research and development, but it's not finished. In the section on [adopting Concurrent Mode](/docs/concurrent-mode-adoption.html), we'll describe how you can try it and what you can expect.
