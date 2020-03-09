---
title: "Feuille de route pour React 16.x"
author: [gaearon]
---

Vous avez peut-être entendu parler de fonctionnalités telles que « les Hooks », « Suspense » ou le « rendu concurrent » dans de précédents articles de blog ou dans des présentations.  Dans cet article, nous allons examiner l’agencement de ces fonctionnalités, et la chronologie prévue pour leur mise à disposition dans une version stable de React.

> Mise à jour d’août 2019
>
> Vous pouvez trouver une mise à jour de cette feuille de route dans [l’annonce officielle de sortie de React 16.9](/blog/2019/08/08/react-v16.9.0.html#an-update-to-the-roadmap).

## TL;PL {#tldr}

Nous avons l’intention de répartir la sortie des nouvelles fonctionnalités React au fil des jalons suivants :

* React 16.6 avec [Suspense pour la découpe de code](#react-166-shipped-the-one-with-suspense-for-code-splitting) (*déjà sorti*)
* Une version mineure 16.x avec [les Hooks React](#react-16x-q1-2019-the-one-with-hooks) (~Q1 2019)
* Une version mineure 16.x avec [le mode concurrent](#react-16x-q2-2019-the-one-with-concurrent-mode) (~Q2 2019)
* Une version mineure 16.x avec [Suspense pour le chargement de données](#react-16x-mid-2019-the-one-with-suspense-for-data-fetching) (~mi-2019)

*(La version originale de cet article utilisait des numéros spécifiques de versions.  Nous l’avons ajusté pour refléter le fait que nous aurons peut-être besoin d’intercaler quelques autres version mineures avec celles annoncées ici.)*

Ce sont là des estimations, et les détails sont susceptibles d’évoluer avec le temps.  Il y a au moins deux autres projets que nous avons l’intention de mener à bien en 2019.  Ils requièrent davantage d’exploration et ne sont pour le moment pas liés à une version spécifique :

* [La modernisation de React DOM](#modernizing-react-dom)
* [Suspense pour le rendu côté serveur](#suspense-for-server-rendering)

Nous pensons y voir plus clair sur leur chronologie dans les prochains mois.

> Remarque
>
> Cet article n’est qu’une feuille de route : il ne contient rien qui nécessite votre attention immédiate.  Chaque fois qu’une de ces fonctionnalités sera livrée, nous publierons une annonce détaillée.

## Chronologie de sortie {#release-timeline}

Nous partageons une vision unifiée de ces fonctionnalités et de leur utilisation conjointe, mais nous souhaitons sortir chacune aussitôt qu’elle sera prête afin que vous puissiez la tester et commencer à l’utiliser au plus tôt.  La conception d’une API pourra sembler étrange lorsqu’on l’examine en isolation, aussi cet article essaie de présenter les principales parties du plan pour vous aider à avoir une vision d’ensemble.  (Consultez notre [politique de gestion des versions](/docs/faq-versioning.html) pour en apprendre davantage sur notre engagement en termes de stabilité.)

Cette stratégie de publication graduelle nous aide à affiner les API, mais la période de transition, durant laquelle certaines parties ne sont pas encore prêtes, peut être déroutante.  Voyons l’impact de ces fonctionnalités sur votre appli, en quoi elles sont liées les unes aux autres, et à partir de quand vous pourrez commencer à les apprendre et les utiliser.

### [React 16.6](/blog/2018/10/23/react-v-16-6.html) (déjà sorti) : celle avec Suspense pour la découpe de code {#react-166-shipped-the-one-with-suspense-for-code-splitting}

Le terme *Suspense* désigne la nouvelle capacité de React à « suspendre » le rendu pendant que des composants attendent quelque chose, et à afficher un indicateur de chargement.  Dans React 16.6, Suspense ne prend en charge qu’un cas d’usage : le chargement paresseux de composants à l’aide de `React.lazy()` et `<React.Suspense>`.

```js
// Ce composant est chargé dynamiquement
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

La découpe de code avec `React.lazy()` et `<React.Suspense>` est documentée dans [le guide sur la découpe de code](/docs/code-splitting.html#reactlazy). Vous pourrez en trouver une explication pratique supplémentaire dans [cet article](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d).

Chez Facebook, nous utilisons Suspense pour la découpe de code depuis juillet, et nous l’estimons stable.  La sortie publique initiale en 16.6.0 comportait quelques régressions, qui ont été corrigées en 16.6.3.

La découpe de code n’est toutefois que la première étape pour Suspense.  Notre vision de Suspense à plus long terme implique qu’il puisse aussi gérer le chargement de données (et s’intégrer avec des bibliothèques telles qu’Apollo).  En plus de fournir un modèle de programmation confortable, Suspense apporte une meilleure expérience utilisateur en mode concurrent.  Vous pourrez en apprendre davantage sur ces points dans la suite de ce texte.

**Statut dans React DOM :** disponible depuis React 16.6.0.

**Statut dans React DOM Server :** Suspense n‘est pas encore disponible dans le moteur de rendu côté serveur.  Ce n’est pas par manque d’intérêt.  Nous avons commencé à travailler sur un nouveau moteur de rendu asynchrone côté serveur qui prendra en charge Suspense, mais c’est un vaste projet qui se déroulera sur une bonne partie de 2019 pour aboutir.

**Statut dans React Native :** La découpe de bundle n’est pas tellement utile avec React Native, mais rien n’empêche techniquement `React.lazy()` et `<Suspense>` de fonctionner lorsqu’ils reçoivent une `Promise` pour un module.

**Notre conseil :** Si vous ne faites que du rendu client, nous vous recommandons d’adopter massivement `React.lazy()` et `<React.Suspense>` pour la découpe de code de vos composants React.  Si vous faites du rendu côté serveur, il vous faudra attendre que le nouveau moteur de rendu côté serveur soit prêt pour pouvoir démarrer cette adoption.

### React 16.x (~Q1 2019) : celle avec les Hooks {#react-16x-q1-2019-the-one-with-hooks}

Les *Hooks* vous permettent d’utiliser des fonctionnalités telles que l’état local et le cycle de vie au sein de fonctions composants.  Ils permettent aussi de réutiliser de la logique à état dans plusieurs composants sans alourdir pour autant votre arbre de composants.

```js
function Example() {
  // Déclare une nouvelle variable d’état, que nous appellerons `count`
  const [count, setCount] = useState(0);

  return (
   <div>
     <p>Vous avez cliqué {count} fois</p>
     <button onClick={() => setCount(count + 1)}>
       Cliquez ici
     </button>
   </div>
 );
}
```

Une bonne manière de démarrer consiste à lire [l’introduction](/docs/hooks-intro.html) et l’[aperçu](/docs/hooks-overview.html) des Hooks. Regardez [ces présentations](https://www.youtube.com/watch?v=V-QO-KO90iQ) si vous préférez une introduction vidéo et une plongée plus en profondeur. La [FAQ](/docs/hooks-faq.html) devrait répondre à la plupart de vos questions. Pour en apprendre davantage sur les raisons qui sous-tendent la conception des Hooks, vous pouvez lire [cet article](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889). Enfin, certains des choix de conception de l’API sont détaillés dans [cette discussion de la RFC](https://github.com/reactjs/rfcs/pull/68#issuecomment-439314884).

Nous utilisons les Hooks chez Facebook depuis septembre.  Nous ne pensons pas que des bugs majeurs subsistent dans leur implémentation.  Les Hooks ne sont disponibles que dans les versions 16.7 alpha de React.  Il est possible qu’au moins certains aspects de leur API évoluent d’ici la version finale (voir [ce commentaire](https://github.com/reactjs/rfcs/pull/68#issuecomment-439314884) pour plus de détails).  Il est également possible que la version mineure qui fournisse les Hooks ne soit pas la 16.7.

Les Hooks représentent notre vision de l’avenir de React.  Ils résolvent les deux problèmes que les utilisateurs de React rencontrent directement (« l’enfer d’enrobage » que donnent les *render props* et les composants d’ordre supérieur d’une part, la duplication de logique à travers les méthodes de cycle de vie d’autre part) tout en éliminant certains obstacles à l’optimisation de React à grande échelle (tels que la difficulté à *inliner* des composants grâce à un compilateur).  Les Hooks ne déprécient pas les classes.  Toutefois, si les Hooks rencontrent un fort succès, il n’est pas exclus que dans une future version *majeure* la prise en charge des classes soit déportée dans un module distinct, afin de réduire la taille par défaut du bundle de React.

**Statut dans React DOM :** la première version de `react` et `react-dom` à prendre en charge les Hooks est la `16.7.0-alpha.0`. Nous comptons publier des alphas supplémentaires dans les prochains mois (à l’heure où nous écrivons ceci, la plus récente est la `16.7.0-alpha.2`). Vous pouvez les essayer en installant `react@next` et `react-dom@next`. N’oubliez pas de mettre à jour `react-dom`, faute de quoi les Hooks ne fonctionneront pas.

**Statut dans React DOM Server :** les mêmes versions 16.7 alpha de `react-dom` prennent pleinement les Hooks en charge avec `react-dom/server`.

**Statut dans React Native :** React Native ne fournit pas pour le moment de prise en charge officielle des Hooks.  Mais si vous êtes joueur·se, jetez un coup d’œil à [cette discussion](https://github.com/facebook/react-native/issues/21967) pour des instructions non-officielles.  Notez qu’un problème identifié de déclenchement tardif de `useEffect` n’est pas encore résolu.

**Notre conseil :** quand vous serez prêt·e, nous vous encourageons à essayer les Hooks dans les nouveaux composants que vous écrirez.  Assurez-vous que tous les membres de votre équipe sont partant·e·s et ont parcouru la documentation associée.  Nous déconseillons de réécrire vos classes existantes vers les Hooks à moins que vous n’ayez déjà prévu de les réécrire pour d’autres raisons (par ex. pour corriger des bugs).  Vous pouvez en apprendre davantage sur la stratégie d’adoption [ici](/docs/hooks-faq.html#adoption-strategy).

### React 16.x (~Q2 2019) : celle avec le mode concurrent {#react-16x-q2-2019-the-one-with-concurrent-mode}

Le *mode concurrent* permet aux applis React d’être plus réactives en réalisant le rendu des arbres de composants sans bloquer le thread principal.  Il doit être explicitement activé et permet à React d’interrompre un rendu long (par exemple, le rendu d’un long article de presse) afin de traiter des événements de plus forte priorité (tels qu’une saisie clavier ou un survol de la souris).  Le mode concurrent améliore également l’expérience utilisateur de Suspense en sautant les états de chargement superflus lorsque la connexion est rapide.

> Remarque
>
> Vous avez peut-être entendu ou lu le terme [“async mode”](/blog/2018/03/27/update-on-async-rendering.html) par le passé pour désigner le mode concurrent.  Nous avons changé le nom en « mode concurrent » pour mettre en avant la capacité de React à réaliser des tâches selon divers niveaux de priorité.  Il s’agit là d’une approche à part dans la gestion de rendu asynchrone.

```js
// Deux façons de l’activer :

// 1. Pour une partie de l’appli (API non finalisée)
<React.unstable_ConcurrentMode>
  <Something />
</React.unstable_ConcurrentMode>

// 2. Pour l’appli entière (API non finalisée)
ReactDOM.unstable_createRoot(domNode).render(<App />);
```

Il n’existe pas encore de documentation pour le mode concurrent.  Nous tenons aussi à souligner que son modèle conceptuel vous semblera sans doute déconcertant au premier abord.  Documenter ses avantages, son utilisation efficace et ses pièges potentiels est une priorité absolue pour nous, et sera une condition préalable pour qu’on le déclare comme stable.  En attendant, [la présentation d’Andrew](https://www.youtube.com/watch?v=ByBPyMBTzM0) reste la meilleure introduction disponible.

Le mode concurrent est *largement* moins abouti que les Hooks.  Certaines API ne sont pas encore correctement « câblées » et ne fonctionnent pas comme on s’y attend.  À l’heure où nous écrivons ceci, nous déconseillons son utilisation hors de l’expérimentation pure.  Nous n’anticipons pas beaucoup de bugs dans le mode concurrent lui-même, mais sachez déjà que les composants qui produisent des avertissements au sein de [`<React.StrictMode>`](/docs/strict-mode.html) risquent de ne pas fonctionner correctement.  Par ailleurs, nous avons remarqué que le mode concurrent *fait émerger* des problèmes de performance dans le code tiers qui peuvent parfois être pris à tort pour des problèmes de performance dans le mode concurrent lui-même.  Par exemple, un `setInterval(fn, 1)` oublié dans un coin, qui s’exécuterait à chaque milliseconde, se fera davantage sentir en mode concurrent.  Nous avons l’intention de publier davantage de recommandations sur les diagnostics et correctifs pour ce type de problème au sein de la documentation pour cette version.

Le mode concurrent constitue une part importante de notre vision pour React.  Pour les tâches de calcul pur, il permet un rendu non-bloquant et préserve la réactivité de nos applis tout en réalisant le rendu d’arbres de composants complexes.  On en trouve une démonstration dans la première partie de [notre présentation à JSConf Iceland](/blog/2018/03/01/sneak-peek-beyond-react-16.html). Le mode concurrent améliore par ailleurs l’impact de Suspense.  Il vous permet d’éviter une brève apparition d’un indicateur de chargement si le réseau est suffisamment rapide.  C’est délicat à expliquer sans support visuel, aussi [la présentation d’Andrew](https://www.youtube.com/watch?v=ByBPyMBTzM0) est la meilleure ressource disponible pour le moment. Le mode concurrent repose sur un [planificateur](https://github.com/facebook/react/tree/master/packages/scheduler) coopératif pour le thread principal, et nous [collaborons avec l’équipe de Chrome](https://www.youtube.com/watch?v=mDdgfyRB5kg) pour déplacer à terme cette capacité dans le navigateur lui-même.

**Statut dans React DOM :** une version *très* instable du mode concurrent est disponible avec un préfixe `unstable_` dans React 16.6 mais nous vous déconseillons de l’utiliser à moins que vous ne soyez prêt·e à vous prendre des murs ou tomber sur des fonctionnalités manquantes. Les alphas 16.7 incluent `React.ConcurrentMode` et `ReactDOM.createRoot` sans le préfixe `unstable_`, mais nous conserverons sans doute le préfixe dans la 16.7, et ne documenterons le mode concurrent, qui sera alors considéré stable, que dans cette future version mineure.

**Statut dans React DOM Server :** le mode concurrent n’affecte pas directement le rendu côté serveur.  Il fonctionnera avec le moteur de rendu côté serveur existant.

**Statut dans React Native :** les plans actuels diffèrent l’activation du mode concurrent dans React Native jusqu’à ce que le projet [React Fabric](https://github.com/react-native-community/discussions-and-proposals/issues/4) soit sur le point d’aboutir.

**Notre conseil :** si vous souhaitez adopter le mode concurrent à l’avenir, un bon premier pas consiste à enrober des arbres de composants par un [`<React.StrictMode>`](https://reactjs.org/docs/strict-mode.html) et à corriger les avertissements qui en résultent. De façon générale, nous nous attendons à ce que le code légataire ne soit pas automatiquement compatible. Par exemple, chez Facebook nous avons surtout l’intention d’utiliser le mode concurrent pour les bases de code les plus récemment écrites, et de laisser les codes plus anciens tourner en mode synchrone pour le moment.

### React 16.x (~mi-2019) : celle avec Suspense pour le chargement de données {#react-16x-mid-2019-the-one-with-suspense-for-data-fetching}

Comme indiqué plus tôt, *Suspense* désigne la capacité de React à « suspendre » le rendu pendant que des composants attendent quelque chose, et à afficher un indicateur de chargement.  Dans sa version sortie avec React 16.6, le seul cas d’usage pris en charge concerne la découpe de code.  Dans cette future version mineure, nous aimerions fournir des prises en charge officielles pour le chargement de données également.  Nous fournirons une implémentation de référence avec un « cache React » basique qui sera compatible avec Suspense, mais vous pourrez aussi écrire le vôtre.  Les bibliothèques de chargement de données telles qu’Apollo et Relay pourront s’intégrer avec Suspense en respectant une spécification simple que nous documenterons.

```js
// Cache React pour du chargement simple de données (API non finalisée)
import {unstable_createResource} from 'react-cache';

// Dis au cache React comment charger les données
const TodoResource = unstable_createResource(fetchTodo);

function Todo(props) {
  // Se suspend jusqu’à ce que les données soient dans le cache
  const todo = TodoResource.read(props.id);
  return <li>{todo.title}</li>;
}

function App() {
  return (
    // Le même composant Suspense que vous utilisez déjà pour la découpe de
    // code serait capable de gérer également le chargement de données.
    <React.Suspense fallback={<Spinner />}>
      <ul>
        {/* Les éléments de même niveau sont chargés en parallèle */}
        <Todo id="1" />
        <Todo id="2" />
      </ul>
    </React.Suspense>
  );
}

// D’autres bibliothèques telles qu’Apollo ou Relay peuvent aussi
// fournir des intégrations avec Suspense en utilisant des API similaires.
```
Il n’existe pas encore de documentation pour le chargement de données avec Suspense, mais vous pouvez trouver quelques informations préliminaires dans [cette présentation](https://youtu.be/ByBPyMBTzM0?t=1312) et [cette petite démo](https://github.com/facebook/react/blob/master/packages/react-devtools/CHANGELOG.md#suspense-toggle).  Nous écrirons la documentation de React Cache (et de la façon d’écrire votre bibliothèque compatible avec Suspense) lorsque cette version de React approchera, mais si vous êtes curieux·se, vous pouvez en trouver le code source embryonnaire [ici](https://github.com/facebook/react/blob/master/packages/react-cache/src/ReactCache.js).

Le mécanisme de bas niveau de Suspense (qui suspend le rendu et affiche une UI de repli) derait être stable même en React 16.6.  Nous l’utilisons en production depuis des mois pour la découpe de code.  Ceci dit, les API de plus haut niveau pour le chargement de données sont très instables.  React Cache change tout le temps, et ce n’est probablement pas fini.  Certaines API supplémentaires de bas niveau sont encore [manquantes](https://github.com/reactjs/rfcs/pull/89) afin de rendre possibles de meilleures API de plus haut niveau.  Nous déconseillons l’utilisation de React Cache hors de l’expérimentation pure.  Remarquez que React Cache lui-même n’est pas strictement lié aux versions de React, mais les alphas actuelles sont dépourvues de fonctions basiques telles que l’invalidation de cache, vous vous prendrez donc rapidement un mur.  Nous devrions avoir quelque chose d’utilisable pour cette version de React.

À terme nous aimerions que la majorité des chargements de données aient lieu *via* Suspense, mais ça prendra beaucoup de temps pour que toutes les intégrations soient prêtes.  En pratique, nous anticipons une adoption très incrémentale, et souvent par l’intermédiaire de couches telles qu’Apollo ou Relay plutôt que directement.  Le manque d’API de plus haut niveau n’est d’ailleurs pas le seul obstacle : certaines approches UI importantes ne sont pas encore prises en charge, telles que [l’affichage d’un indicateur de progression hors de la hiérarchie des vues en cours de chargement](https://github.com/facebook/react/issues/14248).  Comme toujours, nous communiquerons sur notre progression dans les notes de publications sur ce blog.

**Statut dans React DOM et React Native :** techniquement, un cache compatible marcherait déjà avec `<React.Suspense>` dans React 16.6.  Toutefois, nous ne pensons pas avoir une bonne implémentation de ce cache avant cette version mineure de React.  Si vous êtes joueur·se, vous pouvez essayer d’écrire le vôtre en regardant les alphas de React Cache.  Ceci dit, gardez à l’esprit que le modèle mental est suffisamment différent pour que vous courriez un fort risque de le comprendre de travers tant que la documentation ne sera pas prête.

**Statut dans React DOM Server :**  Suspense n’est pas encore disponible dans le moteur de rendu côté serveur.  Comme vu précédemment, nous avons commencé à travailler sur un moteur de rendu asynchrone côté serveur qui prendra Suspense en charge, mais c’est un vaste projet qui devrait se déroulera sur une bonne partie de 2019 pour aboutir.

**Notre conseil :** attendez cette version mineure de React pour utiliser Suspense pour le chargement de données.  N’essayez par d’utiliser les capacités de Suspense en 16.6 pour ça : ce n’est pas pris en charge.  En revanche, vos composants `<Suspense>` existants pour la découpe de code seront capables d’afficher des états de chargement pour les données aussi quand Suspense pour le chargement de données sera officiellement disponible.

## Autres projets {#other-projects}

### Modernisation de React DOM {#modernizing-react-dom}

Nous avons commencé à explorer [la simplification et la modernisation](https://github.com/facebook/react/issues/13525) de React DOM, l’objectif étant de réduire la taille du bundle et de se rapprocher davantage du comportement du navigateur.  Il est encore trop tôt pour dire quels objectifs spécifiques seront atteints, car le projet est dans une phase exploratoire.  Nous vous tiendrons au courant.

### Suspense pour le rendu côté serveur {#suspense-for-server-rendering}

Nous avons commencé la conception d’un nouveau moteur de rendu côté serveur qui prenne en charge Suspense (y compris l’attente de données asynchrones côté serveur sans double rendu) et le chargement comme l’hydratation progressifs du contenu de la page par morceaux pour optimiser l’expérience utilisateur.  Vous pouvez voir un aperçu d’un premier prototype dans [cette présentation](https://www.youtube.com/watch?v=z-6JC0_cOns). Le nouveau moteur de rendu côté serveur sera une de nos principales priorités pour 2019, mais il est trop tôt pour parler de sa chronologie de sortie.  Son développement, comme toujours, [se fera sur GitHub](https://github.com/facebook/react/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+fizz).

-----

Et c’est à peu près tout ! Comme vous pouvez le voir, nous avons de quoi nous occuper mais nous anticipons beaucoup de progrès dans les prochains mois.

Nous espérons que cet article vous aura donné une idée de ce sur quoi nous travaillons, ce que vous pouvez déjà utiliser, et ce à quoi vous attendre à l’avenir.  Même si beaucoup de discussions sur les nouvelles fonctionnalités ont lieu sur les réseaux sociaux, si vous lisez ce blog, vous ne louperez rien d’important.

Nous sommes toujours ravis de recevoir vos retours et avis sur le [dépôt des RFC](https://github.com/reactjs/rfcs), sur [le suivi de tickets](https://github.com/facebook/react/issues), et sur [Twitter](https://mobile.twitter.com/reactjs).
