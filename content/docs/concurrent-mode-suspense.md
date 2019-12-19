---
id: concurrent-mode-suspense
title: Suspense pour le chargement de données (expérimental)
permalink: docs/concurrent-mode-suspense.html
prev: concurrent-mode-intro.html
next: concurrent-mode-patterns.html
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

React 16.6 ajoutait un composant `<Suspense>` qui vous permettait « d’attendre » que du code soit chargé en spécifiant déclarativement un état de chargement (tel qu’un *spinner*) pendant l’attente :

```jsx
const ProfilePage = React.lazy(() => import('./ProfilePage')); // Chargé à la demande

// Affiche un spinner pendant que le profil se charge
<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>
```

Suspense pour le chargement de données est une nouvelle fonctionnalité qui vous permet d’utiliser également `<Suspense>` pour **« attendre » déclarativement n’importe quoi d’autre, y compris le chargement de données distantes.**  Cette page se concentre sur ce cas d’utilisation, mais vous pouvez utiliser cette technique pour attendre des images, des scripts, ou d’autres traitements asynchrones.

- [Qu’est-ce que Suspense, exactement ?](#what-is-suspense-exactly)
  - [Ce que Suspense n’est pas](#what-suspense-is-not)
  - [Ce que Suspense vous permet de faire](#what-suspense-lets-you-do)
- [Utiliser Suspense en pratique](#using-suspense-in-practice)
  - [Et si je n’utilise pas Relay ?](#what-if-i-dont-use-relay)
  - [À l’attention des auteurs de bibliothèques](#for-library-authors)
- [Les approches traditionnelles vs. Suspense](#traditional-approaches-vs-suspense)
  - [Approche 1 : _fetch-on-render_ (sans utiliser Suspense)](#approach-1-fetch-on-render-not-using-suspense)
  - [Approche 2 : _fetch-then-render_ (sans utiliser Suspense)](#approach-2-fetch-then-render-not-using-suspense)
  - [Approche 3 : _render-as-you-fetch_ (en utilisant Suspense)](#approach-3-render-as-you-fetch-using-suspense)
- [Démarrer le chargement tôt](#start-fetching-early)
  - [On expérimente encore](#were-still-figuring-this-out)
- [Suspense et les situations de compétition](#suspense-and-race-conditions) *(race conditions, NdT)*
  - [Compétitions avec `useEffect`](#race-conditions-with-useeffect)
  - [Compétitions avec `componentDidUpdate`](#race-conditions-with-componentdidupdate)
  - [Le problème](#the-problem)
  - [Résoudre les situations de compétition avec Suspense](#solving-race-conditions-with-suspense)
- [Gérer les erreurs](#handling-errors)
- [Prochaines étapes](#next-steps)

## Qu’est-ce que Suspense, exactement ? {#what-is-suspense-exactly}

Suspense permet à vos composants « d’attendre » quelque chose avant qu’ils s’affichent. Dans [cet exemple](https://codesandbox.io/s/frosty-hermann-bztrp), deux composants attendent le résultat d’un appel API asynchrone destiné à charger des données :

```js
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Chargement du profil...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Chargement des publications...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Essaie de lire les infos utilisateur, bien qu’elles puissent ne pas être encore chargées
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Essaie de lire les publications, bien qu’elles puissent ne pas être encore chargées
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/frosty-hermann-bztrp)**

Cette démo est là pour vous ouvrir l’appétit. Ne vous inquiétez pas si elle est déroutante à ce stade, nous la décrirons plus en détail dans un instant. Gardez à l’esprit que Suspense est davantage un *mécanisme*, et que les API spécifiques dans l’exemple ci-avant, telles que `fetchProfileData()` ou `resource.posts.read()`, n’ont que peu d’importance. Si vous êtes curieux·se, vous pouvez toujours en consulter l’implémentation directement dans la [sandbox de démonstration](https://codesandbox.io/s/frosty-hermann-bztrp).

Suspense n’est pas une bibliothèque de chargement de données. C’est un **mécanisme à destination des bibliothèques de chargement de données** pour qu’elles puissent indiquer à React que *les données que lit un composant ne sont pas encore disponibles*. React peut alors attendre qu’elles le deviennent et mettre à jour l’interface utilisateur (UI). Chez Facebook, nous utilisons Relay et sa [nouvelle intégration avec Suspense](https://relay.dev/docs/en/experimental/step-by-step). Nous pensons que d’autres bibliothèques, telles qu’Apollo, fournirons des intégrations similaires.

Sur le long terme, nous prévoyons que Suspense deviendra le moyen principal de lire des données asynchrone depuis des composants, et ce quelle que soit la provenance des données.

### Ce que Suspense n’est pas {#what-suspense-is-not}

Suspense est significativement différent des approches existantes pour ce type de problème, de sorte qu’au premier abord il est facile de l’interpréter de travers. Permettez-nous de clarifier les principales erreurs de perception :

* **Ce n’est pas une implémentation de chargement de données.**  Ça ne suppose pas que vous utilisiez GraphQL, REST ou tout autre format, bibliothèque, transport ou protocole spécifiques.
* **Ce n’est pas un client prêt à l’emploi.**  Vous ne pouvez pas « remplacer » `fetch` ou Relay par Suspense. Mais vous pouvez utiliser une bibliothèque qui s’intègre avec Suspense (par exemple, les [nouvelles API de Relay](https://relay.dev/docs/en/experimental/api-reference)).
* **Ça ne lie pas le chargement des données à la couche vue.**  Ça aide à orchestrer l’affichage des états de chargement dans votre UI, mais ça ne lie pas votre logique réseau à vos composants React.

### Ce que Suspense vous permet de faire {#what-suspense-lets-you-do}

Alors quel est le but de Suspense ?  Il y a plusieurs manières de répondre à cette question :

* **Ça permet aux bibliothèques de chargement de données de s’intégrer finement avec React.**  Si une bibliothèque de chargement de données implémente la prise en charge de Suspense, son utilisation au sein des composants React devient très naturelle.
* **Ça vous permet d’orchestrer vos états de chargement de façon choisie.**  Ça ne dit pas _comment_ les données sont chargées, mais ça vous permet de contrôler finement la séquence visuelle de chargement de votre appli.
* **Ça vous aide à éviter les situations de compétition** *(race conditions, NdT)*. Même avec `await`, le code asynchrone est souvent sujet aux erreurs. Suspense donne davantage l’impression de lire les données *de façon synchrone*, comme si elles étaient en fait déjà chargées.

## Utiliser Suspense en pratique {#using-suspense-in-practice}

Chez Facebook, nous n’avons pour le moment utilisé en production que l’intégration de Relay avec Suspense. **Si vous cherchez un guide pratique pour démarrer maintenant, [jetez un coup d’œil au guide de Relay](https://relay.dev/docs/en/experimental/step-by-step) !**  Il illustre des approches qui ont déjà fait leurs preuves chez nous en production.

**Les démos de code sur cette page utilisent une implémentation d’une API « factice » plutôt que Relay.**  Ça simplifie leur compréhension si vous n’avez pas déjà l’habitude de GraphQL, mais ça ne veut pas dire qu’il s’agisse là de la « bonne manière » de construire une appli avec Suspense. Cette page est davantage conceptuelle, et cherche à vous aider à comprendre *pourquoi* Suspense fonctionne comme il le fait, et quels problèmes il résout.

### Et si je n’utilise pas Relay ? {#what-if-i-dont-use-relay}

Si vous n’utilisez pas Relay aujourd’hui, vous aurez peut-être besoin d’attendre avant de pouvoir véritablement essayer Suspense dans votre appli. Pour le moment, c’est la seule implémentation que nous ayons testée en production et qui nous a satisfaits.

Pendant les prochains mois, plusieurs bibliothèques vont apparaître qui exploiteront de diverses façons les API Suspense. **Si vous préférez apprendre une fois que les choses sont raisonnablement stables, vous voudrez peut-être ignorer tout ça pour le moment, et revenir lorsque l’écosystème Suspense sera plus mûr.**

Vous pouvez aussi écrire votre propre intégration pour une bibliothèque de chargement de données, si vous le souhaitez.

### À l’attention des auteur·e·s de bibliothèques {#for-library-authors}

Nous nous attendons à voir la communauté expérimenter largement avec d’autres bibliothèques. Il y a un point important à noter pour les personnes qui maintiennent des bibliothèques de chargement de données.

Bien que ce soit techniquement faisable, Suspense n’est **pas** pour le moment conçu comme une façon de charger les données lorsqu’un composant s’affiche. Il sert plutôt à permettre aux composants d’exprimer qu’ils « attendent » des données qui sont *déjà en cours de chargement*. **L’article [Construire des super expériences utilisateurs avec le mode concurrent et Suspense](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html) décrit en quoi cette distinction est importante, et comment implémenter cette approche en pratique.**

À moins que vous n’ayez une solution pour empêcher les chargements en cascade, nous vous conseillons d’opter pour des API qui favorisent voire exigent un déclenchement du chargement des données en amont du rendu. Pour un exemple concret, vous pouvez regarder comment [l’API Suspense de Relay](https://relay.dev/docs/en/experimental/api-reference#usepreloadedquery) garantit le pré-chargement. Par le passé, nous n’avons pas communiqué de façon très cohérente sur ce sujet. Suspense pour le chargement de données reste expérimental, de sorte que nos recommandations sont susceptibles de changer avec le temps, au fur et à mesure que nous tirons de nouvelles leçons de notre utilisation en production et améliorons notre compréhension de cette typologie de problèmes.

## Les approches traditionnelles vs. Suspense {#traditional-approaches-vs-suspense}

Nous pourrions introduire Suspense sans mentionner les approches répandues de chargement de données. Néanmoins, il serait alors plus difficile de bien percevoir les problèmes que Suspense résout, en quoi ces problèmes méritent une résolution, et ce qui différencie Suspense des solutions existantes.

Nous allons plutôt considérer Suspense comme l’étape suivante logique dans une chronologie d’approches :

* **_Fetch-on-render_ (par exemple, `fetch` dans `useEffect`) :** on commence l’affichage des composants. Chacun d’eux est susceptible de déclencher un chargement de données au sein de ses effets ou méthodes de cycle de vie. Cette approche aboutit souvent à des « cascades ».
* **_Fetch-then-render_ (par exemple, Relay sans Suspense) :** on commence par charger toutes les données pour le prochain écran aussitôt que possible. Quand les données sont prêtes, on affiche le nouvel écran. On ne peut rien faire avant que les données ne soient reçues.
* **_Render-as-you-fetch_ (par exemple, Relay avec Suspense) :** on lance le chargement de toutes les données requises par le prochain écran aussitôt que possible, et on commence le rendu du nouvel écran *immédiatement, avant d’avoir la réponse du réseau*. Au fil de la réception des flux de données, React retente le rendu des composants qui ont encore besoin de données jusqu’à ce que tout soit disponible.

> Remarque
>
> Il s’agit là d’une légère simplification, et en pratique les solutions ont tendance à combiner plusieurs approches. Quoi qu’il en soit, nous les examinerons en isolation pour mieux mettre en lumière leurs avantages et inconvénients respectifs.

Pour comparer ces approches, nous allons implémenter une page de profil avec chacune d’entre elles.

### Approche 1 : _fetch-on-render_ (sans utiliser Suspense) {#approach-1-fetch-on-render-not-using-suspense}

Une façon courante de charger les données dans une application React aujourd’hui consiste à utiliser un effet :

```js
// Dans une fonction composant :
useEffect(() => {
  fetchSomething();
}, []);

// Ou dans un composant à base de classe :
componentDidMount() {
  fetchSomething();
}
```

Nous appelons cette approche _“fetch-on-render”_ parce qu’elle ne commence à charger *qu’après* que le composant s’est affiché. Elle entraîne un problème appelé « la cascade ».

Prenez ces composants `<ProfilePage>` et `<ProfileTimeline>` :

```js{4-6,22-24}
function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(u => setUser(u));
  }, []);

  if (user === null) {
    return <p>Chargement du profil...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline />
    </>
  );
}

function ProfileTimeline() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts().then(p => setPosts(p));
  }, []);

  if (posts === null) {
    return <h2>Chargement des publications...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/fragrant-glade-8huj6)**

Si vous exécutez ce code et examinez les logs dans la console, vous y verrez se dérouler la séquence suivante :

1. On commence à charger les détails de l’utilisateur
2. On attend…
3. On finit de charger les détails de l’utilisateur
4. On commence à charger les publications
5. On attend…
6. On finit de charger les publications

Si le chargement des détails de l’utilisateur prend trois secondes, nous ne *commencerons* à charger les publications qu’au bout de trois secondes ! C’est une « cascade » : une *séquence* involontaire qui aurait dû être parallélisée.

Les cascades sont courantes dans le code qui charge les données au sein du rendu. On peut les corriger, mais à mesure que le produit grandit, les gens préfèreront une solution qui évite carrément ce problème.

### Approche 2 : _fetch-then-render_ (sans utiliser Suspense) {#approach-2-fetch-then-render-not-using-suspense}

Les bibliothèques peuvent prévenir les cascades en offrant une approche plus centralisée du chargement de données. Par exemple, Relay résout ce problème en déplaçant les informations relatives aux données dont un composant a besoin dans des *fragments* analysables statiquement, qui sont ensuite composés en une seule requête.

Sur cette page, nous ne supposons aucune connaissance préalable de Relay, aussi nous ne l’utiliserons pas dans cet exemple. Nous écrirons plutôt manuellement quelque chose de similaire en combinant nos méthodes de chargement de données :

```js
function fetchProfileData() {
  return Promise.all([
    fetchUser(),
    fetchPosts()
  ]).then(([user, posts]) => {
    return {user, posts};
  })
}
```

Dans cet exemple, `<ProfilePage>` attend les deux requêtes mais les démarre en parallèle :

```js{1,2,8-13}
// Lance les chargements aussitôt que possible
const promise = fetchProfileData();

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    promise.then(data => {
      setUser(data.user);
      setPosts(data.posts);
    });
  }, []);

  if (user === null) {
    return <p>Chargement du profil...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline posts={posts} />
    </>
  );
}

// Le fils n’a plus besoin de déclencher une chargement
function ProfileTimeline({ posts }) {
  if (posts === null) {
    return <h2>Chargement des publications...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/wandering-morning-ev6r0)**

La séquence d’événements devient la suivante :

1. On commence à charger les détails de l’utilisateur
2. On commence à charger les publications
3. On attend…
4. On finit de charger les détails de l’utilisateur
5. On finit de charger les publications

On a résolu la « cascade » réseau de l’exemple précédent, mais introduit un autre souci pas inadvertance. Nous attendons à présent que *toutes* les données soient chargées, en raison du `Promise.all()` dans `fetchProfileData`, de sorte qu’on ne peut pas afficher les détails du profil tant qu’on n’a pas aussi les publications. On doit attendre les deux.

Naturellement, il est possible de corriger cet exemple spécifique. On pourrait retirer l’appel à `Promise.all()` et attendre chaque promesse séparément. Cependant, cette approche devient progressivement plus ardue au fur et à mesure que nos données et notre arborescence de composants gagnent en complexité. Il est difficile d’écrire des composants fiables lorsque des parties aléatoires de notre arbre de données peuvent manquer ou se périmer, de sorte qu’il est souvent plus pragmatique de charger toutes les données pour le nouvel écran *et ensuite* l’afficher.

### Approche 3 : _render-as-you-fetch_ (en utilisant Suspense) {#approach-3-render-as-you-fetch-using-suspense}

Dans l’approche précédente, nous chargions les données avant d’appeler `setState` :

1. Commencer le chargement
2. Finir le chargement
3. Commencer le rendu

Avec Suspense, nous déclencherons le chargement en premier, mais inverserons les deux dernières étapes :

1. Commencer le chargement
2. **Commencer le rendu**
3. **Finir le chargement**

**Avec Suspense, nous n’attendons pas que la réponse nous parvienne pour commencer le rendu.**  En fait, nous commençons le rendu *presque immédiatement* après avoir déclenché la requête réseau :

```js{2,17,23}
// Ce n’est pas une `Promise`. C’est un objet spécial issu de l’intégration avec Suspense.
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Chargement du profil...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Chargement des publications...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Essaie de lire les infos utilisateur, bien qu’elles puissent ne pas être encore chargées
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Essaie de lire les publications, bien qu’elles puissent ne pas être encore chargées
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/frosty-hermann-bztrp)**

Voici ce qui se passe quand on affiche `<ProfilePage>` à l’écran :

1. Nous avons déjà déclenché les requêtes dans `fetchProfileData()`. Ça nous a fourni une « ressource » spéciale au lieu d’une `Promise`. En situation réelle, cet objet viendrait de l’intégration Suspense de notre bibliothèque, par exemple Relay.
2. React essaie d’afficher `<ProfilePage>`. Il renvoie `<ProfileDetails>` et `<ProfileTimeline>` comme composants enfants.
3. React essaie d’afficher `<ProfileDetails>`. Il appelle `resource.user.read()`. Aucune donnée n’étant disponible à ce stade, ce composant « se suspend ». React le saute, et essaie d’afficher les autres composants dans l’arborescence.
4. React essaie d’afficher `<ProfileTimeline>`. Il appelle `resource.posts.read()`. Là aussi, faute de données disponibles, le composant « se suspend ». React le saute à son tour, et essaie d’afficher les autres composants dans l’arborescence.
5. Il ne reste rien à afficher. Puisque `<ProfileDetails>` est suspendu, React affiche le contenu de repli *(fallback, NdT)* de l’ancêtre `<Suspense>` le plus proche, à savoir : `<h1>Chargement du profil...</h1>`. Et il en a fini pour l’instant.

Cet objet `resource` représente les données qui ne sont pas encore arrivées, mais devraient à terme être disponibles. Lorsqu’on appelle `read()`, soit on obtient les données, soit le composant « se suspend ».

**Au fil de l’arrivée des données, React recommencera le rendu, et chaque fois il pourra peut-être progresser « plus loin ».**  Lorsque `resource.user` sera chargée, le composant `<ProfileDetails>` pourra être affiché correctement et nous n’aurons plus besoin du contenu de repli `<h1>Chargement du profil...</h1>`. À terme, quand nous aurons toutes les données, il n’y aura plus de contenus de repli à l’écran.

Ce fonctionnement a une conséquence intéressante. Même si nous utilisons un client GraphQL qui regroupe tous nos besoins en données dans une seule requête, *streamer la réponse nous permet d’afficher plus de contenu plus tôt*. Parce que nous faisons le rendu *pendant le chargement* (par opposition à un rendu *après*), si `user` apparaît dans la réponse avant `posts`, nous serons à même de « déverrouiller » le périmètre `<Suspense>` extérieur avant même que la réponse n’ait été totalement reçue. On ne s’en était pas forcément rendu compte avant, mais même la solution *fetch-then-render* contenait une cascade : entre le chargement et le rendu. Suspense ne souffre pas intrinsèquement de ce type de cascade, et les bibliothèques comme Relay en tirent parti.

Remarquez que nous avons éliminé les vérifications `if (...)` « si ça charge » de nos composants. Il ne s’agit pas juste de retirer du code générique, mais ça facilite aussi les ajustements rapides d’expérience utilisateur. Par exemple, si nous voulions que les détails du profil et les publications « surgissent » toujours d’un bloc, il nous suffirait de retirer le périmètre `<Suspense>` entre eux. Ou nous pourrions les rentre complètement indépendants l’un de l’autre en leur donnant à chacun *leur propre* périmètre `<Suspense>`. Suspense nous permet d’ajuster la granularité de nos états de chargement et d’orchestrer leur séquencement sans avoir à réaliser des changements invasifs dans notre code.

## Démarrer le chargement tôt {#start-fetching-early}

Si vous travaillez sur une bibliothèque de chargement de données, il y a un aspect crucial de _render-as-you-fetch_ que vous devez bien intégrer. **On déclenche le chargement _avant_ le rendu.**  Examinez le code suivant de plus près :

```js
// Commence à charger tôt !
const resource = fetchProfileData();

// ...

function ProfileDetails() {
  // Essaie de lire les infos utilisateur
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/frosty-hermann-bztrp)**

Remarquez que l’appel à `read()` dans cet exemple ne *déclenche* pas le chargement. Il essaie juste de lire les données qui *sont déjà en cours de chargement*. Cette distinction est cruciale pour produire des applications rapides avec Suspense. Nous ne voulons pas différer le chargement des données jusqu’au rendu d’un composant. En tant qu’auteur·e de bibliothèque, vous pouvez garantir ça en rendant impossible l’obtention d’un objet `resource` sans déclencher au passage le chargement. Toutes les démos sur cette page qui utilisent notre « API factice » garantissent cet aspect.

Vous pourriez objecter que charger les données « au niveau racine » comme ici n’est guère pratique. Que ferons-nous si nous naviguons vers une autre page de profil ?  On pourrait vouloir charger sur base des props. La réponse est que **nous voulons plutôt commencer le chargement dans les gestionnaires d’événements**. Voici un exemple simplifié de la navigation entre des pages utilisateurs :

```js{1,2,10,11}
// Premier chargement : aussitôt que possible
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        // Chargement suivant : lorsque l’utilisateur clique
        setResource(fetchProfileData(nextUserId));
      }}>
        Suivant
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/infallible-feather-xjtbu)**

Avec cette approche, on peut **charger le code et les données en parallèle**. Quand on navigue entre les pages, on n’a pas besoin d’attendre le code de la page pour commencer à charger ses données. On peut commencer à charger aussi bien le code que les données au même moment (lors du clic sur le lien), ce qui donne une bien meilleure expérience utilisateur.

La question qui se pose alors est : comment savons-nous *quoi* charger avant d’afficher le prochain écran ?  Il y a plusieurs solutions possibles (par exemple, en intégrant le chargement des données au plus près de notre système de routage). Si vous travaillez sur une bibliothèque de chargement de données, [Construire des super expériences utilisateurs avec le mode concurrent et Suspense](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html) explore en profondeur les moyens d’accomplir ça en expliquant pourquoi c’est important.

### On expérimente encore {#were-still-figuring-this-out}

Suspense lui-même est un mécanisme flexible qui n’impose que peu de contraintes. Le code produit doit se contraindre un peu plus pour être sûr d’éviter les cascades, mais il y a différentes façons de fournir ces garanties. Voici quelques-unes des questions que nous explorons en ce moment :

* Le chargement anticipé peut être lourd à exprimer. Comment faciliter ça en évitant les cascades ?
* Quand on charge les données d’une page, l’API peut-elle encourager l’inclusion de données en vue de transitions instantanées *pour en sortir* ?
* Quel est le délai de péremption d’une réponse ?  Le cache doit-il être global ou local ? Qui gère le cache ?
* Les Proxies *(au sens JS, NdT)* peuvent-ils aider à exprimer des API de chargement paresseux sans avoir à coller des appels `read()` partout ?
* À quoi ressemblerait l’équivalent de la composition de requêtes GraphQL pour des données Suspense quelconques ?

Relay a ses propres réponses à certaines de ces questions. Il y a certainement plusieurs façons de s’y prendre, et nous avons hâte de voir quelles nouvelles idées la communauté React va faire émerger.

## Suspense et les situations de compétition {#suspense-and-race-conditions}

Les situations de compétition *(race conditions, NdT)* sont des bugs qui surviennent suite à des suppositions incorrectes sur l’ordre d’exécution de notre code. On en rencontre souvent lorsqu’on charge des données dans un Hook `useEffect` ou une méthode de cycle de vie comme `componentDidUpdate`. Suspense peut là aussi nous être d’une aide précieuse ; voyons comment.

Pour illustrer le problème, nous allons ajouter un composant racine `<App>` qui affiche notre `<ProfilePage>` avec un bouton nous permettant de **basculer entre différents profils** :

```js{9-11}
function getNextId(id) {
  // ...
}

function App() {
  const [id, setId] = useState(0);
  return (
    <>
      <button onClick={() => setId(getNextId(id))}>
        Suivant
      </button>
      <ProfilePage id={id} />
    </>
  );
}
```

Voyons ensemble la façon dont les différentes stratégies de chargement de données traitent ce besoin.

### Compétitions avec `useEffect` {#race-conditions-with-useeffect}

Commençons par une variation de notre exemple antérieur « chargement depuis un effet ». Nous allons le modifier pour passer un paramètre `id` depuis les props de `<ProfilePage>` vers `fetchUser(id)` et `fetchPosts(id)` :

```js{1,5,6,14,19,23,24}
function ProfilePage({ id }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(id).then(u => setUser(u));
  }, [id]);

  if (user === null) {
    return <p>Chargement du profil...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline id={id} />
    </>
  );
}

function ProfileTimeline({ id }) {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts(id).then(p => setPosts(p));
  }, [id]);

  if (posts === null) {
    return <h2>Chargement des publications...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/nervous-glade-b5sel)**

Remarquez que nous avons aussi ajusté les dépendances de l’effet, passant de `[]` à `[id]`, car nous voulons que l’effet s’exécute à nouveau si `id` change. Autrement, nous ne chargerions pas les nouvelles données.

Si nous essayons ce code, il peut sembler fonctionner au premier abord. Néanmoins, si nous introduisons un délai de réponse aléatoire dans l’implémentation de notre « API factice » et appuyons suffisamment en rafale sur le bouton « Suivant », nous verrons dans les logs de la console que quelque chose ne tourne pas rond du tout. **Les requêtes associées aux profils précédents répondent parfois après que nous avons changé à nouveau de profil, et du coup écrasent le nouvel état avec une réponse périmée associée à un ID différent.**

Ce problème peut être résolu (on pourrait utiliser la fonction de nettoyage de l’effet pour ignorer voire annuler les requêtes périmées), mais c’est contre-intuitif et difficile à déboguer.

### Compétitions avec `componentDidUpdate` {#race-conditions-with-componentdidupdate}

On pourrait penser que c‘est un problème spécifique à `useEffect` ou aux Hooks. Peut-être que si nous portions ce code vers des classes et utilisions des syntaxes confortables comme `async` / `await`, le problème serait résolu ?

Essayons ça :

```js
class ProfilePage extends React.Component {
  state = {
    user: null,
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const user = await fetchUser(id);
    this.setState({ user });
  }
  render() {
    const { id } = this.props;
    const { user } = this.state;
    if (user === null) {
      return <p>Chargement du profil...</p>;
    }
    return (
      <>
        <h1>{user.name}</h1>
        <ProfileTimeline id={id} />
      </>
    );
  }
}

class ProfileTimeline extends React.Component {
  state = {
    posts: null,
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const posts = await fetchPosts(id);
    this.setState({ posts });
  }
  render() {
    const { posts } = this.state;
    if (posts === null) {
      return <h2>Chargement des publications...</h2>;
    }
    return (
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.text}</li>
        ))}
      </ul>
    );
  }
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/trusting-clarke-8twuq)**

Ce code est faussement simple à lire.

Malheureusement, ni le recours aux classes ni la syntaxe `async` / `await` ne nous ont aidés à résoudre le problème. Cette version souffre exactement du même problème de situations de compétition, pour les mêmes raisons.

### Le problème {#the-problem}

Les composants React ont leur propre « cycle de vie ». Ils sont susceptibles de recevoir des props ou de mettre à jour leur état à n’importe quel moment. Mais hélas, chaque requête asynchrone a *aussi* son propre « cycle de vie ». Il démarre quand on déclenche le traitement, et se termine quand nous obtenons une réponse. La difficulté que nous rencontrons vient de la « synchronisation » entre différents processus au fil du temps, qui dépendent les uns des autres. Il est difficile d’y réfléchir correctement.

### Résoudre les situations de compétition avec Suspense {#solving-race-conditions-with-suspense}

Reprenons à nouveau notre exemple, mais en utilisant seulement Suspense :

```js
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        setResource(fetchProfileData(nextUserId));
      }}>
        Suivant
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}

function ProfilePage({ resource }) {
  return (
    <Suspense fallback={<h1>Chargement du profil...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Chargement des publications...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails({ resource }) {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({ resource }) {
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/infallible-feather-xjtbu)**

Dans l’exemple Suspense précédent, nous n’avions qu’une `resource`, aussi la placions-nous dans une variable de la portée racine. À présent que nous avons plusieurs ressources, nous les avons déplacées dans l’état local du composant `<App>` racine :

```js{4}
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
```

Quand on clique sur « Suivant », le composant `<App>` déclenche une requête pour le prochain profil, et passe *cet objet-là* au composant `<ProfilePage>` :

```js{4,8}
  <>
    <button onClick={() => {
      const nextUserId = getNextId(resource.userId);
      setResource(fetchProfileData(nextUserId));
    }}>
      Suivant
    </button>
    <ProfilePage resource={resource} />
  </>
```

Là aussi, remarquez que **nous n’attendons pas la réponse pour modifier l’état. C’est tout l’inverse : nous définissons l’état (et commençons le rendu) immédiatement après avoir déclenché une requête**. Dès que nous aurons plus de données, React « remplira » le contenu dans les composants `<Suspense>`.

Ce code est très lisible, mais contrairement aux exemples précédents, la version Suspense ne souffre pas de situations de compétition. Vous vous demandez peut-être pourquoi. La réponse est que dans la version Suspense, nous n’avons pas besoin de penser aussi intensément au *temps* dans notre code. Le code original, avec ses situations de compétition, avait besoin de modifier l’état *au bon moment ultérieur*, faute de quoi l’état devenait incorrect. Mais avec Suspense, nous définissons l’état *immédiatement* : c’est plus dur d’en corrompre la valeur.

## Gérer les erreurs {#handling-errors}

Quand nous écrivons du code à base de promesses (`Promise`), nous pouvons recourir à `catch()` pour en gérer les erreurs. Comment faire avec Suspense, dans la mesure où nous *n’attendons pas* après des promesses pour commencer le rendu ?

Avec Suspense, gérer les erreurs de chargement fonctionne comme la gestion des erreurs de rendu : vous pouvez utiliser un [périmètre d’erreur](/docs/error-boundaries.html) où bon vous semble pour « attraper » les erreurs dans les composants qu’il enrobe.

Commençons par définir un périmètre d’erreur utilisable dans tout notre projet :

```js
// Les périmètres d’erreur exigent pour le moment une définition à base de classe.
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

Après quoi nous pouvons le placer où nous voulons dans l’arbre pour attraper les erreurs :

```js{5,9}
function ProfilePage() {
  return (
    <Suspense fallback={<h1>Chargement du profil...</h1>}>
      <ProfileDetails />
      <ErrorBoundary fallback={<h2>La récupération des publications a échoué.</h2>}>
        <Suspense fallback={<h1>Chargement des publications...</h1>}>
          <ProfileTimeline />
        </Suspense>
      </ErrorBoundary>
    </Suspense>
  );
}
```

**[Essayez sur CodeSandbox](https://codesandbox.io/s/adoring-goodall-8wbn7)**

Il attraperait à la fois les erreurs de rendu *et* les erreurs du chargement de données Suspense. Nous pouvons avoir autant de périmètres d’erreur que nous le souhaitons, mais il vaut mieux [bien réfléchir](https://aweary.dev/fault-tolerance-react/) à leurs emplacements.

## Prochaines étapes {#next-steps}

Et voilà, nous avons couvert les bases de Suspense pour le chargement de données ! Mais surtout, nous comprenons désormais mieux *pourquoi* Suspense fonctionne comme il le fait, et comment il s’inscrit dans la problématique du chargement de données.

Suspense apporte des réponses, mais pose aussi ses propres questions :

* Si un composant « se suspend », l’appli gèle-t-elle ? Comment éviter ça ?
* Comment faire pour afficher un *spinner* à un endroit autre que « au-dessus » du composant prévu dans l’arbre ?
* Supposons que nous *voulions* explicitement afficher une UI incohérente pendant un bref instant, est-ce possible ?
* Au lieu d’afficher un *spinner*, peut-on ajouter un effet visuel, comme « griser » l’écran en cours ?
* Pourquoi notre [dernier exemple Suspense](https://codesandbox.io/s/infallible-feather-xjtbu) affiche-t-il un avertissement quand on clique sur le bouton « Suivant » ?

Pour répondre à ces questions, nous vous invitons à lire la prochaine section sur les [Approches pour une UI concurrente](/docs/concurrent-mode-patterns.html).
