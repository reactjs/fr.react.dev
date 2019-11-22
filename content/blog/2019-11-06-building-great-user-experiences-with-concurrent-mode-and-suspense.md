---
title: "Construire des super expériences utilisateurs avec le mode concurrent et Suspense"
author: [josephsavona]
---

Lors de la React Conf 2019 nous avons annoncé une [version expérimentale](/docs/concurrent-mode-adoption.html#installation) de React qui prend en charge le mode concurrent et Suspense.  Dans cet article nous allons présenter quelques meilleures pratiques pour leur utilisation que nous avons identifiées lors de la construction du [nouveau facebook.com](https://twitter.com/facebook/status/1123322299418124289).

> Cet article est surtout pertinent pour les personnes qui écrivent des _bibliothèques de chargement de données_ pour React.
>
> Il montre comment les intégrer au mieux avec le mode concurrent et Suspense.  Les approches présentées ici sont basées sur [Relay](https://relay.dev/docs/en/experimental/step-by-step), notre bibliothèque de construction d’UI pilotées par les données avec GraphQL.  Cependant, les idées que décrit cet article **s’appliquent aux autres clients GraphQL ainsi qu’aux bibliothèques utilisant REST** ou d’autres approches.

Cet article **s’adresse aux auteur·e·s de bibliothèques**.  Si vous développez avant tout des applications, vous y trouverez peut-être des idées intéressantes, mais ne vous sentez pas obligé·e de le lire dans son intégralité.

## Vidéos de présentations {#talk-videos}

Si vous préférez regarder des vidéos, certaines des idées de cet article ont été discutées dans plusieurs présentations durant la React Conf 2019 :

* [Chargement de données avec Suspense et Relay](https://www.youtube.com/watch?v=Tl0S7QkxFE4&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=15&t=0s) par [Joe Savona](https://twitter.com/en_JS) *(en anglais)*
* [Construire le nouveau Facebook avec React et Relay](https://www.youtube.com/watch?v=KT3XKDBZW7M&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=4) par [Ashley Watkins](https://twitter.com/catchingash) *(en anglais)*
* [Keynote de la React Conf](https://www.youtube.com/watch?v=uXEEL9mrkAQ&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=2) par [Yuzhi Zheng](https://twitter.com/yuzhiz) *(en anglais)*

Cet article explore plus en profondeur l’implémentation d’un bibliothèque de chargement de données avec Suspense.

## Prioriser l’expérience utilisateur {#putting-user-experience-first}

L’équipe React et la communauté ont longtemps accordé une attention particulière (certes méritée) à l’expérience développeur : en s’assurant que React avait de bons messages d’erreurs, en considérant les composants d’abord comme un moyen de réfléchir localement au comportement applicatif, en façonnant des API qui étaient prévisibles et encourageaient par défaut une utilisation correcte, etc.  Mais nous n’avons pas fourni assez de recommandations  sur les meilleures manières d’obtenir une excellente expérience *utilisateur* dans de grandes applis.

Par exemple, l’équipe React s’est concentrée sur la performance *du framework* et sur la fourniture d’outils à destination des développeurs pour déboguer et améliorer les performances applicatives (par ex. `React.memo`). Mais nous n’avons pas été prescriptifs sur les *approches de haut niveau* qui font la différence entre des applis rapides et fluides d’un côté, et des applis lentes et saccadées de l’autre.  Nous essayons toujours de nous assurer que React reste abordable pour les nouveaux utilisateurs et prend en charge une large gamme de cas d’usages ; après tout, toutes les applis n’ont pas besoin d’être « ultra-rapides ».  Mais en tant que communauté nous pourrions et devrions viser plus haut. **Nous devrions faciliter au maximum la construction d’applis qui démarrent rapidement et restent rapides,** même si elles gagnent en complexité, pour des utilisateurs sur des appareils et réseaux diversifiés dans le monde entier.

[Le mode concurrent](/docs/concurrent-mode-intro.html) et [Suspense](/docs/concurrent-mode-suspense.html) sont des fonctionnalités expérimentales qui aident les développeurs à atteindre cet objectif.  Nous les avons d’abord introduits à [JSConf Iceland en 2018](/blog/2018/03/01/sneak-peek-beyond-react-16.html), en dévoilant volontairement très tôt les détails de ces API afin de donner le temps à la communauté de digérer ces nouveaux concepts et de préparer le terrain pour des changements à venir.  Depuis lors nous avons terminé des travaux corollaires, tels que la nouvelle API de Contexte et l’arrivée des Hooks, qui sont conçus en partie pour aider les développeurs à naturellement écrire du code qui est davantage compatible avec le mode concurrent.  Mais nous ne voulions pas implémenter ces fonctionnalités et les publier sans valider qu’elles fonctionnent.  Ainsi, sur l’année écoulée, les équipes chez Facebook en charge de React, Relay, de l’infrastructure web et des produits ont toutes étroitement collaboré pour construire une nouvelle version de facebook.com qui intègre en profondeur le mode concurrent et Suspense pour créer une expérience offrant un ressenti plus fluide, plus proche des applis natives.

Grâce à ce projet, nous sommes plus confiants que jamais dans la capacité du mode concurrent et de Suspense à faciliter la livraison d’expériences utilisateurs agréables et *rapides*.  Mais pour y arriver, nous avons dû repenser notre façon de charger le code et les données de nos applis.  En pratique, tous les chargements de données du nouveau facebook.com sont désormais gérés par les [Hooks Relay](https://relay.dev/docs/en/experimental/step-by-step), une nouvelle API Relay basée sur les Hooks qui intègre d’entrée de jeu le mode concurrent et Suspense.

Les hooks Relay (et GraphQL) ne seront pas pour tout le monde, et c’est très bien ainsi !  En élaborant ces API nous avons identifié un ensemble d’approches plus générales pour utiliser au mieux Suspense. **Même si Relay n’est pas la bonne technologie pour vous, nous pensons que les approches-clés que nous avons mises en place avec les Hooks Relay peuvent être adaptées à d’autres frameworks.**

## Meilleures pratiques pour Suspense {#best-practices-for-suspense}

Il est tentant de se concentrer uniquement sur le temps de démarrage pour une appli, mais il s’avère que la perception qu’ont les utilisateurs de la performance n’est pas seulement basée sur le temps de chargement lui-même.  Par exemple, en comparant deux applis avec le même temps de chargement absolu, nos recherches ont montré que les utilisateurs percevront en général celle avec le moins d’états de chargement intermédiaires et le moins d’altérations de mise en page comme étant la plus rapide.  Suspense est un outil puissant pour orchestrer soigneusement une séquence de chargement élégante avec un nombre réduit d’états bien définis pour révéler progressivement le contenu.  Mais améliorer la performance perçue ne suffira pas toujours : nos applis devraient tout de même minimiser le temps qu’elles passent à charger leur code, leurs données, leurs images et autres ressources.

L’approche traditionnelle pour charger des données dans une appli React repose sur ce que nous appelons [“fetch-on-render”](/docs/concurrent-mode-suspense.html#approach-1-fetch-on-render-not-using-suspense).  On commence par afficher un composant avec un *spinner*, puis on charge les données au montage (`componentDidMount` ou `useEffect`), et pour finir on met à jour le rendu avec les données résultats.  Il est certes *possible* d’utiliser cette approche avec Suspense : plutôt que de faire un premier rendu avec le contenu d’attente, un composant peut « se suspendre » pour indiquer à React qu’il n’est pas encore prêt.  React saura ainsi qu’il doit aller chercher le plus proche ancêtre `<Suspense fallback={<Placeholder/>}>`, et afficher pour le moment l’UI de repli indiquée.  Si vous avez regardé d’anciennes démos de Suspense cet exemple vous semblera familier : c’est ainsi  que nous avions d’abord conçu le chargement de données avec Suspense.

Cette approche a néanmoins quelques limites.  Prenez une page qui affiche une publication sur un réseau social par un utilisateur, ainsi que les commentaires associés.  Elle est peut-être structurée avec un composant `<Post>` qui affiche tant le corps de la publication qu’un `<CommentList>` en charge des commentaires.  Recourir à l’approche fetch-on-render décrite ci-avant pour implémenter ça pourrait entraîner des allers-retours séquentiels (parfois désignés par le terme « cascade ») *(waterfall, NdT)*.  On commencerait par charger les données pour le composant `<Post>`, puis on chargerait celles pour le `<CommentList>`, augmentant le temps nécessaire au chargement complet de la page.

Cette approche a par ailleurs un inconvénient souvent négligé.  Si `<Post>` requiert (ou importe) statiquement le composant `<CommentList>`, notre appli devra attendre que le code des *commentaires* soit chargé pour afficher le *contenu* de la publication.  Nous pourrions charger `<CommentList>` paresseusement, mais ça retarderait le chargement des données des commentaires, et du coup l’aboutissement de l’affichage de la page.  Comment résoudre ce problème sans faire de compromis sur l’expérience utilisateur ?

## Render-as-you-fetch {#render-as-you-fetch}

L’approche fetch-on-render est largement utilisée par les applis React actuelles, et peut tout-à-fait servir à créer de superbes applis.  Mais peut-on faire mieux ?  Prenons un peu de recul pour penser à notre objectif.

Dans l’exemple `<Post>` ci-avant, nous afficherions idéalement le contenu le plus important (le corps de publication) aussitôt que possible *sans* impacter négativement le temps que prendra la page à se charger totalement (commentaires compris).  Réfléchissons aux contraintes-clés pour une solution et voyons comment nous pouvons y arriver :

* Afficher le contenu le plus important (le corps de publication) le plus tôt possible implique que nous devons charger le code et les données de la vue de façon incrémentale.  Nous *ne voulons pas bloquer l’affichage du corps de publication* à cause du chargement du code de `<CommentList>`, par exemple.
* Dans le même temps, nous ne voulons pas augmenter le temps que prendra l’affichage intégral de la page (commentaires compris).  Alors nous devons *commencer à charger le code et les données des commentaires* aussitôt que possible, idéalement *en parallèle* du chargement du corps de publication.

Ça peut sembler difficile à réaliser, mais ces contraintes sont en fait extrêmement utiles.  Elles éliminent un grand nombre d’approches et dessinent une solution pour nous.  Ça nous amène aux approches-clés que nous avons implémentées avec les Hooks Relay, et qui peuvent être adaptées pour d’autres bibliothèques de chargement de données.  Nous allons examiner chacune de ces approches-clés à tour de rôle et voir comment elles se combinent pour réaliser notre vision d’expériences de chargement rapides et agréables :

1. Arbres parallèles pour les données et la vue
2. Chargement depuis les gestionnaires d’événements
3. Chargement incrémental des données
4. Traiter le code comme des données

### Arbres parallèles pour les données et la vue {#parallel-data-and-view-trees}

Un des aspects les plus intéressants de l’approche fetch-on-render, c’est qu’elle regroupe en un même endroit la définition de *quelles* données notre composant nécessite et de *comment* afficher ces données.  Ce regroupement est top, il illustre tout le sens qu’il y a à regrouper le code par sujets et non par technologies.  Tous les problèmes évoqués plus tôt étaient dus au *moment* du chargement des données dans cette approche : lors du rendu.  Nous devons trouver un moyen de charger les données *avant* d’afficher le composant.  Le seul moyen d’y arriver consiste à extraire les dépendances de données pour aboutir à des arbres parallèles pour les données d’une part, les vues d’autre part.

Voici comment ça fonctionne avec les Hooks Relay.  Pour continuer avec notre exemple de publication sur réseau social et de ses commentaires, ça pourrait ressembler à ceci :

```javascript
// Post.js
function Post(props) {
  // Sur base d’une référence à une publication (`props.post`),
  // de *quelles* données a-t-on besoin autour de cette publication ?
  const postData = useFragment(graphql`
    fragment PostData on Post @refetchable(queryName: "PostQuery") {
      author
      title
      # ... champs supplémentaires ...
    }
  `, props.post);

  // À présent que nous avons les données, comment les afficher ?
  return (
    <div>
      <h1>{postData.title}</h1>
      <h2>par {postData.author}</h2>
      {/* champs supplémentaires */}
    </div>
  );
}
```

Bien que le GraphQL soit écrit au sein du composant, Relay a une étape de traitement (le Relay Compiler) qui extrait ces dépendances de données dans des fichiers séparés et agrège le GraphQL de chaque vue en une seule requête.  Nous avons donc les avantages du regroupement par sujet, tout en bénéficiant à l’exécution d’arbres parallèles pour les données et les vues.  D’autres frameworks peuvent obtenir un effet similaire en autorisant les développeurs à définir leur logique de chargement de données dans un fichier jumeau (peut-être `Post.data.js`), ou pourquoi pas en s’intégrant avec un *bundler* pour permettre la définition des dépendances de données dans le code d’UI tout en l’extrayant automatiquement, de façon similaire au Relay Compiler.

Ce qui compte ici, c’est qu’indépendamment de la technologie utilisée pour charger nos données (GraphQL, REST, etc.) nous pouvons définir séparément *quelles* données sont chargées d’une part, et les modalités de leur chargement d’autre part.  Mais une fois qu’on en est là justement, comment et quand charge-t-on *effectivement* nos données ?

### Chargement depuis les gestionnaires d’événements {#fetch-in-event-handlers}

Supposez que vous êtes sur le point de naviguer depuis une liste des publications d’un utilisateur vers la page d’une publication spécifique.  Nous allons devoir télécharger le code pour cette page (`Post.js`), ainsi qu’en charger les données.

Patienter jusqu’au rendu du composant pose les problèmes présentés plus tôt.  Le cœur de la solution consiste à déclencher le chargement du code et des données de la nouvelle vue *dans le même gestionnaire d’événement qui déclenche l’affichage de cette vue*.  Nous pouvons tout aussi bien charger les données au sein de notre routeur (si celui-ci propose le pré-chargement des données pour les routes) ou dans le gestionnaire d’événement de clic pour le lien qui a déclenché la navigation.  Et de fait, les mainteneurs de React Router travaillent dur à construire des API qui permettront le pré-chargement des données pour les routes.  Mais d’autres solutions de routage peuvent aussi implémenter cette idée.

Conceptuellement, nous voulons que chaque définition de route contienne deux choses : le composant à afficher et les données à pré-charger, en tant que fonction acceptant les paramètres de la route ou l’URL.  Voici à quoi une telle définition de route *pourrait* ressembler.  Cet exemple est librement inspiré des définitions de route de React Router et *sert surtout à illustrer le concept, et non une API spécifique* :

```javascript
// PostRoute.js (version GraphQL)

// Requête générée par Relay pour charger les données du `Post`
import PostQuery from './__generated__/PostQuery.graphql';

const PostRoute = {
  // une expression de correspondance indiquant les chemins à gérer
  path: '/post/:id',

  // le composant à afficher pour cette route
  component: React.lazy(() => import('./Post')),

  // les données à charger pour cette route, sous forme de fonction
  // acceptant les paramètres de la route
  prepare: routeParams => {
    // Relay extrait les requêtes des composants, nous permettant de
    // référencer les dépendances de données (l’arbre de données) depuis
    // l’extérieur.
    const postData = preloadQuery(PostQuery, {
      postId: routeParams.id,
    });

    return { postData };
  },
};

export default PostRoute;
```

Avec une telle définition, un routeur peut :

* Faire correspondre une URL à une définition de route.
* Appeler la fonction `prepare()` pour commencer à charger les données de la route.  Remarquez que `prepare()` est synchrone : *nous n’attendons pas que les données soient disponibles*, puisque nous voulons commencer à afficher les parties importantes de la vue (telles que le corps de publication) aussi rapidement que possible.
* Passer les données pré-chargées au composant.  Si le composant est disponible (l’import dynamique via `React.lazy` a abouti), celui-ci s’affichera et essaiera d’accéder à ses données.  Dans le cas contraire, `React.lazy` suspendra le rendu jusqu’à ce que le code soit disponible.

Cette approche peut être généralisée à d’autres solutions de chargement de données.  Une appli qui utilise REST pourrait définir une route comme suit :

```javascript
// PostRoute.js (version REST)

// Logique écrite manuellement pour charger les données du composant
import PostData from './Post.data';

const PostRoute = {
  // une expression de correspondance indiquant les chemins à gérer
  path: '/post/:id',

  // le composant à afficher pour cette route
  component: React.lazy(() => import('./Post')),

  // les données à charger pour cette route, sous forme de fonction
  // acceptant les paramètres de la route
  prepare: routeParams => {
    const postData = preloadRestEndpoint(
      PostData.endpointUrl,
      {
        postId: routeParams.id,
      },
    );
    return { postData };
  },
};

export default PostRoute;
```

Cette même approche peut être exploitée non seulement pour le routage, mais à d’autres endroits qui ont besoin d’afficher du contenu paresseusement ou suite à une interaction utilisateur.  Par exemple, un composant onglets pourrait charger de façon anticipée le code et les données du premier onglet, et recourir à l’approche ci-avant pour le code et les données des autres onglets, dans le gestionnaire d’événement responsable du changement d’onglet.  Un composant qui affiche un dialogue modal pourrait pré-charger le code et les données de celui-ci dans le gestionnaire de clic qui déclenche son ouverture, etc.

Une fois que nous avons implémenté la capacité à déclencher le chargement du code et des données de façon indépendante, nous avons la possibilité d’aller plus loin.  Prenez un composant `<Link to={path} />` qui lie vers une route.  Si l’utilisateur le survole, il y a une bonne probabilité qu’il clique dessus.  Et s’il enfonce un bouton de la souris, la probabilité est élevée que ça aboutisse à un clic.  Si nous pouvons charger le code et les données de la vue *après* le clic par l’utilisateur, nous pouvons aussi démarrer ce travail *avant* le clic, et gagner encore un peu de temps pour préparer la vue.

Le mieux dans tout ça, c’est que nous pouvons centraliser cette logique dans quelques emplacements-clés (un routeur ou des composants UI noyaux) et bénéficier de ces améliorations de performances dans toute notre appli.  Naturellement, le pré-chargement n’est pas systématiquement intéressant.  C’est le genre de chose qu’une application va adapter selon l’appareil ou la capacité réseau de l’utilisateur afin d’éviter l'épuisement de son forfait de données.  Mais cette approche facilite la centralisation de l’implémentation du pré-chargement et de ses conditions d’activation.

### Chargement incrémental de données {#load-data-incrementally}

Les approches détaillées jusqu’ici (arbres parallèles pour les données et la vue, et chargement depuis les gestionnaires d’événements) nous permettent de déclencher en amont le chargement des données d’une vue.  Mais nous voulons toujours pouvoir afficher les parties les plus importantes de la vue sans devoir attendre que *toutes* les données soient disponibles.  Chez Facebook nous avons implémenté la prise en charge de cet aspect dans GraphQL et Relay sous le forme de nouvelles directives GraphQL (des annotations qui affectent quand et comment les données sont livrées, sans toucher à la nature des données).  Ces nouvelles directives, appelées `@defer` et `@stream`, nous permettent de récupérer les données de façon incrémentale.  Par exemple, prenez le composant `<Post>` évoqué plus tôt.  Nous voulons afficher le corps de publication sans attendre que les commentaires soient disponibles.  Nous pouvons accomplir ça avec `@defer` et `<Suspense>` :

```javascript
// Post.js
function Post(props) {
  const postData = useFragment(graphql`
    fragment PostData on Post {
      author
      title

      # charge les données des commentaires, mais ne rend pas leur
      # récupération bloquante
      ...CommentList @defer
    }
  `, props.post);

  return (
    <div>
      <h1>{postData.title}</h1>
      <h2>par {postData.author}</h2>
      {/* @defer se combine naturellement à <Suspense> pour rendre
          l’UI également non-bloquante */}
      <Suspense fallback={<Spinner/>}>
        <CommentList post={postData} />
      </Suspense>
    </div>
  );
}
```

Dans le cas présent, notre serveur GraphQL renverra un flux de résultats, avec d’abord les champs `author` et `title` puis, lorsqu’elles seront disponibles, les données des commentaires.  Nous enrobons `<CommentList>` dans un périmètre `<Suspense>` de façon à pouvoir afficher le corps de publication avant que `<CommentList>` et ses données ne soient prêts.  On peut parfaitement appliquer cette même approche à d’autres technologies.  Par exemple, des applis utilisant une API REST pourraient faire des requêtes parallèles pour charger le corps de publication d’un côté, et les données des commentaires de l’autre, afin d’éviter de bloquer sur la disponibilité de la totalité des données.

### Traiter le code comme des données {#treat-code-like-data}

Il reste toutefois une pièce manquante au puzzle.  Nous avons montré comment pré-charger les *données* pour une route, mais qu’en est-il du code ?  L’exemple ci-avant trichait un peu en utilisant `React.lazy`.  Cependant, comme son nom l’indique, `React.lazy` est… *paresseux*.  Il ne commencera à charger le code que lorsque le composant paresseux tentera de s’afficher : c’est du code “fetch-on-render” !

Pour résoudre ce problème, l’équipe React planche sur des API qui permettraient la découpe automatique de *bundle* et le pré-chargement effectif du code.  L’utilisateur pourrait alors passer un composant paresseux au routeur, sous une forme à définir, et le routeur en déclencherait le chargement en parallèle de celui des données, le plus tôt possible.

## En résumé {#putting-it-all-together}

En somme, mettre en œuvre une super expérience utilisateur de chargement implique que nous puissions **déclencher le chargement du code et des données aussitôt que possible, mais sans avoir besoin d’attendre que l’ensemble des réponses soient disponibles**.  Avoir des arbres parallèles pour les données et la vue nous permet justement de paralléliser leurs chargements.  Déclencher ceux-ci depuis un gestionnaire d’événement signifie que nous pouvons démarrer aussitôt que possible, voire dans une approche prédictive optimiste si la probabilité est suffisamment haute que l’utilisateur naviguera vers cette vue.  Le chargement incrémental des données nous permet de charger les données les plus importantes en premier, sans retarder pour autant le chargement des données moins critiques.  Et traiter le code comme des données (en le pré-chargeant grâce à des API similaires) nous permet d’anticiper aussi son chargement.

## Utiliser ces approches {#using-these-patterns}

Ces approches n’en sont plus au stade strictement conceptuel : nous les avons implémentées dans les Hooks Relay et les utilisons en production partout sur le nouveau facebook.com (actuellement en phase de test privée).  Si vous souhaitez en apprendre davantage sur ces approches et leur utilisation, voici quelques ressources :

* La [documentation du mode concurrent de React](/docs/concurrent-mode-intro.html) explore l’utilisation du mode concurrent avec Suspense et rentrent dans le détail de plusieurs de ces approches.  C’est une excellente ressource pour en apprendre davantage sur ces API et les cas d’usages qu’elles prennent en charge.
* La [version expérimentale des Hooks Relay](https://relay.dev/docs/en/experimental/step-by-step) implémente les approches décrites ici.
* Nous avons implémenté deux applis d’exemple similaires qui illustrent ces concepts :
  * [L’appli d’exemple Relay Hooks](https://github.com/relayjs/relay-examples/tree/master/issue-tracker) utilise l’API GraphQL publique de GitHub pour implémenter une gestion simple de tickets.  Elle prend en charge les routes imbriquées avec pré-chargement du code et des données.  Le code est intégralement commenté : nous vous encourageons à cloner le dépôt, lancer l’appli localement, et explorer son fonctionnement.
  * Nous avons aussi une [version de l’appli sans GraphQL](https://github.com/gaearon/suspense-experimental-github-demo) qui illustre l’application de ces concepts à d’autres bibliothèques de chargement de données.

Bien que les API du mode concurrent et de Suspense soient [encore expérimentales](/docs/concurrent-mode-adoption.html#who-is-this-experimental-release-for), nous estimons que la pratique a prouvé la validité des idées de cet article.  Cependant, nous comprenons bien que Relay et GraphQL ne sont pas forcément la meilleure option pour tout le monde.  Et c’est très bien ! **Nous recherchons activement les moyens de généraliser ces approches pour des substrats tels que REST,** et testons des idées d’API plus générique (c’est-à-dire non-basées sur GraphQL) pour composer un arbre de dépendances de données. Dans l’intervalle, nous avons hâte de voir quelles nouvelles bibliothèques vont émerger pour implémenter les approches décrites ici afin de faciliter l’écriture d’expériences utilisateurs agréables et *rapides*.
