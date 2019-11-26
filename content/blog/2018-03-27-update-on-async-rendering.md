---
title: Des nouvelles du rendu asynchrone
author: [bvaughn]
---

Pendant plus d’un an, l’équipe React a travaillé sur l'implémentation du rendu asynchrone.  Le mois dernier, lors de sa présentation à JSConf Iceland, [Dan a dévoilé une partie des nouvelles possibilités passionnantes qu‘offre le rendu asynchrone](/blog/2018/03/01/sneak-peek-beyond-react-16.html).  Nous aimerions aujourd’hui partager avec vous certaines des leçons que nous avons apprises en travaillant sur ces fonctionnalités, et quelques recettes pour vous aider à préparer vos composants à la sortie du rendu asynchrone.

Une des principales leçons que nous avons apprises, c’est que certaines de nos méthodes de cycle de vie historiques ont tendance à encourager des pratiques de code dangereuses.  Les méthodes concernées sont :

* `componentWillMount`
* `componentWillReceiveProps`
* `componentWillUpdate`

Ces méthodes de cycle de vie ont souvent été mal comprises et subtilement mal utilisées ; qui plus est, nous anticipons un plus gros risque de mésutilisation une fois le rendu asynchrone disponible.  Pour cette raison, nous prévoyons de leur ajouter un préfixe `UNSAFE_` dans une prochaine version. (Dans ce cas précis, _“unsafe”_ est sans rapport avec la sécurité, mais indique que le code utilisant ces méthodes de cycle de vie comportera un plus grand risque de bugs dans les prochaines versions de React, surtout si le rendu asynchrone est activé.)

## Chemin de migration progressif {#gradual-migration-path}

[React suit les principes de versions sémantiques](/blog/2016/02/19/new-versioning-scheme.html), du coup ce changement sera progressif.  Notre plan actuel est le suivant :

* **16.3** : ajouter des alias pour les méthodes de cycle de vie dangereuses :`UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps` et `UNSAFE_componentWillUpdate`. (L’ancien nom continuera à fonctionner en parallèle du nouvel alias pour cette version.)
* **Dans une version 16.x ultérieure** : activer les avertissements de dépréciation sur `componentWillMount`, `componentWillReceiveProps` et `componentWillUpdate`. (L’ancien nom continuera à fonctionner en parallèle du nouvel alias pour cette version, mais les anciens noms n’afficheront les avertissements qu‘en mode développement.)
* **17.0** : Retirer `componentWillMount`, `componentWillReceiveProps` et `componentWillUpdate` . (Seuls les noms préfixés par `UNSAFE_`seront utilisables à partir de là.)

**Remarquez que si vous développez des applications React, vous n’avez pour le moment rien à faire concernant ces méthodes historiques.  L’objectif principal de la version 16.3 à venir est de permettre aux mainteneurs de bibliothèques open-source de mettre à jour leurs bibliothèques en amont de l'arrivée des avertissements de dépréciation.  Ces avertissements ne seront activés que dans une version 16.x ultérieure.**

Chez Facebook, nous maintenons plus de 50 000 composants, et nous n’avons pas l’intention de tous les réécrire dans l'immédiat.  On est bien conscients que les migrations prennent du temps.  Nous mettrons en place un chemin de migration progressif pour toute la communauté React.

Si vous n’avez pas le temps de migrer ou tester ces composants, nous vous conseillons d’utiliser un script ["codemod"](https://medium.com/@cpojer/effective-javascript-codemods-5a6686bb46fb) qui les renommera automatiquement :

```bash
cd your_project
npx react-codemod rename-unsafe-lifecycles
```

Vous pouvez en apprendre davantage sur ce codemod dans [le billet d’annonce de la 16.9.0](/blog/2019/08/08/react-v16.9.0.html#renaming-unsafe-lifecycle-methods).

---

## Sortir des méthodes historiques de cycle de vie {#migrating-from-legacy-lifecycles}

Si vous souhaitez commencer à utiliser les nouvelles API de composant introduites dans React 16.3 (ou si vous maintenez une bibliothèque et souhaitez la mettre à jour en avance), voici quelques exemples dont nous espérons qu’ils vous aideront à commencer à réfléchir un peu différemment à vos composants.  Au fil du temps, nous avons l'intention d'ajouter des « recettes » supplémentaires dans notre documentation pour illustrer les meilleures pratiques liées à certaines tâches courantes, afin d'éviter ces méthodes de cycle de vie problématiques.

Avant de commencer, voici un aperçu rapide des modifications de cycle de vie prévues pour la version 16.3 :

* Nous **ajoutons les alias de cycle de vie suivants** : `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`  et `UNSAFE_componentWillUpdate`. (L’ancien nom continuera à fonctionner en parallèle du nouvel alias.)
* Nous **introduisons deux nouvelles méthodes de cycle de vie**, `static getDerivedStateFromProps` et `getSnapshotBeforeUpdate`.

### Nouvelle méthode de cycle de vie : `getDerivedStateFromProps` {#new-lifecycle-getderivedstatefromprops}

`embed:update-on-async-rendering/definition-getderivedstatefromprops.js`

La nouvelle méthode statique de cycle de vie `getDerivedStateFromProps` est appelée après que le composant est instancié, ainsi qu’avant chaque rafraîchissement.  Elle peut renvoyer un objet qui mettra à jour `state`, ou `null` pour indiquer que les nouvelles `props` ne nécessitent aucune mise à jour de l’état local.

En combinaison avec `componentDidUpdate`, cette nouvelle méthode devrait couvrir tous les cas d’usage de l’obsolète `componentWillReceiveProps`.

>Remarque
>
>Tant l’ancienne méthode `componentWillReceiveProps` que la nouvelle `getDerivedStateFromProps` ajoutent une complexité significative aux composants.  Ça entraîne souvent des [bugs](/blog/2018/06/07/you-probably-dont-need-derived-state.html#common-bugs-when-using-derived-state). Préférez des **[alternatives à l’état dérivé plus simples](/blog/2018/06/07/you-probably-dont-need-derived-state.html)** afin de rendre vos composants prévisibles et maintenables.

### Nouvelle méthode de cycle de vie : `getSnapshotBeforeUpdate` {#new-lifecycle-getsnapshotbeforeupdate}

`embed:update-on-async-rendering/definition-getsnapshotbeforeupdate.js`

La nouvelle méthode de cycle de vie `getSnapshotBeforeUpdate` est appelée juste avant que les modifications soient finalisées (ex. juste avant la mise à jour du DOM).  La valeur optionnellement renvoyée par cette méthode sera passée en troisième argument à `componentDidUpdate`. (Cette méthode de cycle de vie est rarement nécessaire, mais peut s'avérer utile dans des cas tels que la préservation de la position de défilement au travers d’un rafraîchissement.)

En combinaison avec `componentDidUpdate`, cette nouvelle méthode de cycle de vie devrait couvrir tous les cas d’usage de l’obsolète `componentWillUpdate`.

Vous pouvez trouver leurs signatures de type [dans ce gist](https://gist.github.com/gaearon/88634d27abbc4feeb40a698f760f3264).

Nous allons maintenant examiner des exemples illustrant l'utilisation de ces deux méthodes de cycle de vie.

## Exemples {#examples}

- [Initialisation de l’état local](#initializing-state)
- [Récupération de données externes](#fetching-external-data)
- [Ajout de gestionnaires d’événements (ou abonnements)](#adding-event-listeners-or-subscriptions)
- [Mise à jour de `state` sur la base des props](#updating-state-based-on-props)
- [Invocation de fonctions de rappel externes](#invoking-external-callbacks)
- [Effets de bord lorsque les props changent](#side-effects-on-props-change)
- [Récupération de données externes lorsque les props changent](#fetching-external-data-when-props-change)
- [Lecture de propriétés du DOM avant sa mise à jour](#reading-dom-properties-before-an-update)

> Remarque
>
> Par souci de concision, les exemples ci-dessous seront écrits en utilisant la transformation Babel expérimentale de propriétés de classes mais ces stratégies de migration restent valables sans ça.

### Initialisation de l’état local {#initializing-state}

Cet exemple montre un composant qui fait des appels à `setState` dans `componentWillMount` :

`embed:update-on-async-rendering/initializing-state-before.js`

La refactorisation la plus simple pour ce type de composant consiste à déplacer l'initialisation de l'état dans le constructeur ou dans un initialiseur de propriété, comme suit :

`embed:update-on-async-rendering/initializing-state-after.js`

### Récupération de données externes {#fetching-external-data}

Voici un exemple de composant qui utilise `componentWillMount` pour récupérer des données externes :

`embed:update-on-async-rendering/fetching-external-data-before.js`

Ce code est problématique tant pour le rendu côté serveur (qui n'utilisera pas les données externes) que pour le mode de rendu asynchrone qui arrivera prochainement (dans lequel la requête risquerait d'être déclenchée plusieurs fois).

La procédure de mise à niveau recommandée dans la plupart des cas consiste à déplacer la récupération des données dans `componentDidMount` :

`embed:update-on-async-rendering/fetching-external-data-after.js`

Beaucoup de gens croient à tort que la récupération de données dans `componentWillMount` évite un premier affichage vide.  En pratique, ça n'a jamais été le cas puisque React a toujours exécuté `render` immédiatement après `componentWillMount`.  Quand les données ne sont pas disponibles au moment où `componentWillMount` était appelé, le premier affichage montre toujours un état de chargement, peu importe l'endroit qui initie la récupération.  C'est pourquoi déplacer ce chargement dans `componentDidMount` n’a aucun effet perceptible dans l'immense majorité des cas.

> Remarque
>
> Dans certains cas d'usage avancés (ex. des bibliotèques telles que Relay), on peut tenter des expériences de pré-chargement asynchrone de données.  Vous pouvez trouver un exemple d'implémentation [ici](https://gist.github.com/bvaughn/89700e525ff423a75ffb63b1b1e30a8f).
>
> Sur le plus long terme, la façon canonique de récupérer des données en React sera probablement associée à l’API « Suspense » [présentée à JSConf Iceland](/blog/2018/03/01/sneak-peek-beyond-react-16.html).  Tant les solutions simples de récupération de données que les bibliothèques comme Apollo et Relay seront capables d’en tirer parti sous le capot.  Cette API est considérablement moins verbeuse que les solutions illustrées plus haut, mais ne sera pas finalisée à temps pour la version 16.3.
>
> Afin de prendre en charge le rendu côté serveur, il est pour l'instant nécessaire de fournir les données de façon synchrone ; `componentWillMount` était souvent utilisée pour ça, mais on peut aisément déplacer ce code dans le constructeur.  Les API Suspense à venir rendront le chargement asynchrone de données beaucoup plus élégant tant côté client que côté serveur.

### Ajout de gestionnaires d’événements (ou abonnements) {#adding-event-listeners-or-subscriptions}

Voici un exemple de composant qui s’abonne à un diffuseur externe d’événements au moment du montage :

`embed:update-on-async-rendering/adding-event-listeners-before.js`

Malheureusement, cette approche peut entraîner des fuites de mémoire lors du rendu côté serveur (car `componentWillUnmount` n’y est pas appelée) et du rendu asynchrone (qui est susceptible d'interrompre le rendu avant sa complétion, ce qui intercepterait l'appel à `componentWillUnmount`).

On suppose souvent que `componentWillMount` et `componentWillUnmount` vont toujours par paire, mais ce n'est pas garanti.  C’est seulement une fois que `componentDidMount` a été appelée que React garantit l’appel ultérieur de nettoyage à `componentWillUnmount`.

En conséquence, la façon recommandée d’ajouter des écouteurs ou abonnements consiste à le faire dans `componentDidMount` :

`embed:update-on-async-rendering/adding-event-listeners-after.js`

Il est parfois nécessaire de mettre à jour les abonnements en réponse à des changements de props.  Si vous utilisez une bibliothèque comme Redux ou MobX, le composant conteneur fourni par la bibliothèque devrait s'en charger pour vous.  Pour les auteurs d'applications, nous avons créé une petite bibliothèque, [`create-subscription`](https://github.com/facebook/react/tree/master/packages/create-subscription), qui vous aide dans cette tâche.  Nous la publierons en accompagnement de React 16.3.

Plutôt que de passer une prop `dataSource` sur laquelle s'abonner, comme nous l'avons fait dans l'exemple ci-dessus, nous pourrions utiliser `create-subscription` pour passer la valeur suivie :

`embed:update-on-async-rendering/adding-event-listeners-create-subscription.js`

> Remarque
>
> Les bibliothèques telles que Relay ou Apollo devraient gérer leurs abonnements manuellement avec des techniques similaires à celles que `create-subscription` utilise sous le capot (comme indiqué [ici](https://gist.github.com/bvaughn/d569177d70b50b58bff69c3c4a5353f3)) en optimisant ça au mieux vis-à-vis de leur contexte.

### Mise à jour de `state` sur la base des props {#updating-state-based-on-props}

>Remarque
>
>Tant l’ancienne méthode `componentWillReceiveProps` que la nouvelle `getDerivedStateFromProps` ajoutent une complexité significative aux composants.  Ça entraîne souvent des [bugs](/blog/2018/06/07/you-probably-dont-need-derived-state.html#common-bugs-when-using-derived-state). Préférez des **[ alternatives à l’état dérivé plus simples](/blog/2018/06/07/you-probably-dont-need-derived-state.html)** afin de rendre vos composants prévisibles et maintenables.

Voici un exemple de composant qui recourt à la méthode historique de cycle de vie `componentWillReceiveProps` pour mettre à jour `state` en fonction des valeurs actuelles des `props` :

`embed:update-on-async-rendering/updating-state-from-props-before.js`

Même si le code ci-dessus n'est pas problématique en soi, la méthode de cycle de vie `componentWillReceiveProps` est souvent mal utilisée de façons qui *posent en effet* des problèmes.  C'est pourquoi cette méthode sera bientôt dépréciée.

À partir de la version 16.3, la façon recommandée de mettre à jour `state` en réponse à des changements de `props` consiste à utiliser la nouvelle méthode de cycle de vie `static getDerivedStateFromProps`. Cette méthode est appelée quand le composant est créé et à chaque fois qu'il se rafraîchit en raison de nouvelles props ou d’un nouvel état :

`embed:update-on-async-rendering/updating-state-from-props-after.js`

Vous avez peut-être remarqué dans cet exemple que `props.currentRow` est reflétée dans l'état (en tant que `state.lastRow`). Ça permet à `getDerivedStateFromProps` d’accéder à la valeur précédente de la prop de la même façon que si on utilisait `componentWillReceiveProps`.

Vous vous demandez peut-être pourquoi nous ne nous contentons pas de passer les props précédentes en argument à `getDerivedStateFromProps`.  Nous y avons pensé en concevant l’API, mais au final nous avons décidé de ne pas le faire pour deux raisons :

* Un argument `prevProps` serait `null` au premier appel à `getDerivedStateFromProps` (après l'instanciation), vous obligeant à ajouter une vérification de nullité chaque fois que vous utiliseriez `prevProps`.
* Ne pas passer les props précédentes à la fonction constitue un pas vers l’amélioration de la gestion de la mémoire dans de futures versions de React. (Si React n'a pas besoin de passer les props précédentes aux méthodes de cycle de vie, il n'a pas besoin de conserver l’objet `props` précédent en mémoire.)

> Remarque
>
> Si vous écrivez un composant partagé, le polyfill [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat) vous permet d’utiliser la nouvelle méthode de cycle de vie `getDerivedStateFromProps` même avec d'anciennes versions de React. [Vous pouvez apprendre à l’utiliser plus bas.](#open-source-project-maintainers)

### Invocation de fonctions de rappel externes {#invoking-external-callbacks}

Voici un exemple de composant qui appelle une fonction externe quand son état change :

`embed:update-on-async-rendering/invoking-external-callbacks-before.js`

On utilise parfois `componentWillUpdate` en raison d’une peur irrationnelle selon laquelle, au premier appel à `componentDidUpdate`, il serait déjà « trop tard » pour mettre à jour l’état d’autres composants.  Il n’en est rien.  React garantit que tous les appels à `setState` effectués dans `componentDidMount` et `componentDidUpdate` sont traités avant que l’utilisateur voie l’interface utilisateur (UI) mise à jour.  En général, il vaut mieux éviter les mises à jour en cascade comme celle-ci, mais elles sont parfois nécessaires (par exemple, si vous avez besoin de positionner une infobulle après avoir mesure l’élément DOM affiché).

Dans les deux cas, utiliser `componentWillUpdate` pour ça en mode asynchrone est dangereux, car la fonction de rappel externe est susceptible d'être appelée plusieurs fois pour une unique mise à jour.  Utilisez plutôt la méthode de cycle de vie `componentDidUpdate`, dont React garantit l'invocation unique à chaque mise à jour :

`embed:update-on-async-rendering/invoking-external-callbacks-after.js`

### Effets de bord lorsque les props changent {#side-effects-on-props-change}

Dans le même esprit que [l’exemple ci-dessus](#invoking-external-callbacks), les composants ont parfois des effets de bord quand les `props` changent.

`embed:update-on-async-rendering/side-effects-when-props-change-before.js`

Comme `componentWillUpdate`, `componentWillReceiveProps` risque d'être appelée plusieurs fois pour une seule mise à jour.  C’est pourquoi il est important d’éviter d’y placer des effets de bord. Utilisez plutôt `componentDidUpdate`, qui ne sera invoquée qu’une seule fois par mise à jour :

`embed:update-on-async-rendering/side-effects-when-props-change-after.js`

### Récupération de données externes lorsque les props changent {#fetching-external-data-when-props-change}

Voici un exemple de composant qui récupère des données externes en fonction des valeurs actuelles des `props` :

`embed:update-on-async-rendering/updating-external-data-when-props-change-before.js`

La procédure de mise à niveau recommandée consiste à déplacer les mises à jour de données dans `componentDidUpdate`.  Vous pouvez aussi utiliser la nouvelle méthode de cycle de vie `getDerivedStateFromProps` pour retirer les données obsolètes avant d’afficher les nouvelles props :

`embed:update-on-async-rendering/updating-external-data-when-props-change-after.js`

> Remarque
>
> Si vous utilisez une bibliothèque HTTP qui permet l'annulation, comme [axios](https://www.npmjs.com/package/axios), il est alors facile d’annuler une requête en cours au démontage.  Pour les Promesses natives, vous pouvez utiliser une approche comme [celle illustrée ici](https://gist.github.com/bvaughn/982ab689a41097237f6e9860db7ca8d6).

### Lecture de propriétés du DOM avant sa mise à jour {#reading-dom-properties-before-an-update}

Voici un exemple de composant qui lit une propriété du DOM avant une mise à jour afin de maintenir la position de défilement au sein d’une liste :

`embed:update-on-async-rendering/react-dom-properties-before-update-before.js`

Dans cet exemple, on utilise `componentWillUpdate` pour lire la propriété du DOM.  Seulement voilà, avec le rendu asynchrone, il peut y avoir des délais entre les méthodes de cycle de vie de la phase de « rendu » (comme `componentWillUpdate` et `render`) et celles de la phase de « commit » (comme `componentDidUpdate`).  Si l’utilisateur fait dans l’intervalle quelque chose comme redimensionner la fenêtre, la valeur `scrollHeight` lue dans `componentWillUpdate` sera obsolète.

Pour résoudre ce problème, utilisez la nouvelle méthode de cycle de vie de la phase de « commit » `getSnapshotBeforeUpdate`.  Elle est appelée _juste avant_ que les mutations soient finalisées (ex. avant les mises à jour du DOM). Elle peut renvoyer une valeur que React passera en argument à `componentDidUpdate`, laquelle est appelée _juste après_ les mutations.

Ces deux méthodes de cycle de vie peuvent être utilisées en combinaison comme ceci :

`embed:update-on-async-rendering/react-dom-properties-before-update-after.js`

> Remarque
>
> Si vous écrivez un composant partagé, le polyfill [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat) vous permet d’utiliser la nouvelle méthode de cycle de vie `getSnapshotBeforeUpdate` même avec d'anciennes versions de React. [Vous pouvez apprendre à l’utiliser plus bas.](#open-source-project-maintainers)

## Autres scénarios {#other-scenarios}

Même si nous avons essayé de couvrir les cas d'usages les plus fréquents dans cet article, il est évident que nous pouvons en avoir oublié.  Si vous utilisez `componentWillMount`, `componentWillUpdate` ou `componentWillReceiveProps` d'une façon que nous n’avons pas couverte ici, et que vous n’êtes pas sûr·e de la façon de sortir de ces méthodes historiques, merci de [déposer une *issue* dans le dépôt GitHub de notre documentation](https://github.com/reactjs/reactjs.org/issues/new) avec vos exemples de code et autant d'informations de contexte que possible.  Nous mettrons à jour ce document avec de nouvelles approches au fur et à mesure de leur apparition.

## Mainteneurs de projets open-source {#open-source-project-maintainers}

Les mainteneurs de projets open-source se demandent peut-être ce que signifient ces évolutions pour leurs composants partagés.  Si vous implémentez les suggestions ci-dessus, que se passera-t-il pour les composants qui dépendent de la nouvelle méthode de cycle de vie `getDerivedStateFromProps` ? Devez-vous sortir une nouvelle version majeure et abandonner la compatibilité ascendante pour les versions de React 16.2 et antérieures ?

Heureusement, il n'en est rien !

Quand nous sortirons React 16.3, nous publierons également un nouveau module npm : [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat). Ce module polyfille les composants afin que les nouvelles méthodes de cycle de vie `getDerivedStateFromProps` et `getSnapshotBeforeUpdate` fonctionnent également dans les anciennes versions de React (0.14.9+).

Pour utiliser ce polyfill, ajoutez-le d'abord comme dépendance dans votre bibliothèque :

```bash
# Si vous utilisez Yarn
yarn add react-lifecycles-compat

# Si vous utilisez npm
npm install --save react-lifecycles-compat
```

Ensuite, mettez à jour vos composants pour utiliser les nouvelles méthodes de cycle de vie (comme décrit plus haut).

Pour finir, utilisez le polyfill pour rendre vos composants compatibles en amont avec les anciennes versions de React :

`embed:update-on-async-rendering/using-react-lifecycles-compat.js`
