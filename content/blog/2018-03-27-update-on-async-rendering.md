---
title: Des nouvelles du rendering asynchrone
author: [bvaughn]
---

Pendant plus d’un an, l’équipe React a travaillé sur l'implémentation du rendering asynchrone.  Le mois dernier, lors de sa présentation à JSConf Iceland, [Dan a dévoilé une partie des nouvelles possibilités excitantes qu‘offre le rendering asynchrone](/blog/2018/03/01/sneak-peek-beyond-react-16.html).  Nous aimerions aujourd’hui partager avec vous certaines des leçons que nous avons apprises en travaillant sur ces fonctionnalités, et quelques recettes pour vous aider à préparer vos composants à la sortie du rendering asynchrone.

Une des principales leçons que nous avons apprises, c’est que certaines de nos méthodes historiques de cycle de vie ont tendance à encourager des pratiques de code dangereuses.  Il s’agit de :

* `componentWillMount`
* `componentWillReceiveProps`
* `componentWillUpdate`

Ces méthodes de cycle de vie ont souvent été mal comprises et subtilement mal utilisées ; qui plus est, nous anticipons un plus gros risque de mésutilisation une fois le rendering asynchrone disponible.  Pour cette raison, nous allons leur ajouter un préfixe `UNSAFE_` dans une prochaine version. (Dans ce cas précis, “unsafe” est sans rapport avec la sécurité, mais indique que le code utilisant ces méthodes de cycle de vie aura un plus grand risque de bugs dans les prochaines versions de React, surtout si le rendering asynchrone est activé.)

## Chemin de migration progressif {#gradual-migration-path}

[React suit les principes de versions sémantiques](/blog/2016/02/19/new-versioning-scheme.html), du coup ce changement sera progressif.  Notre plan actuel est le suivant :

* **16.3** : ajouter des alias pour les méthodes de cycle de vie dangereeuses :`UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps` et `UNSAFE_componentWillUpdate`. (l’ancien nom continuera à fonctionner en parallèle du nouvel alias pour cette version.)
* **Dans une version 16.x ultérieure** : activer les avertissements de dépréciation sur `componentWillMount`, `componentWillReceiveProps` et `componentWillUpdate`. (l’ancien nom continuera à fonctionner en parallèle du nouvel alias pour cette version, mais les anciens noms n’afficheront les avertissements qu‘en mode développement.)
* **17.0** : Retirer `componentWillMount`, `componentWillReceiveProps` et `componentWillUpdate` . (Seuls les noms préfixés par `UNSAFE_`seront utilisables à partir de là.)

**Remarquez que si vous développez des applications React, vous n’avez pour le moment rien à faire concernant ces méthodes historiques.  L’objectif principal de la version 16.3 à venir est de permettre aux mainteneurs de bibliothèques open-source de mettre à jour leurs bibliothèque en amont de l'arrivée des avertissements de dépréciation.  Ces avertissemeents ne seront activés que dans une version 16.x ultérieure.**

Chez Facebook, nous maintenons plus de 50 000 composants, et nous n’avons pas l’intention de tous les réécrire dans l'immédiat.  On est bien conscients que les migrations prennent du temps.  Nous mettrons en place un chemin de migration progressif pour toute la communauté React.

---

## Sortir des méthodes historiques de cycle de vie {#migrating-from-legacy-lifecycles}

Si vous souhaitez commencer à utiliser les nouvelles API de composant introduites dans React 16.3 (ou si vous maintenez une bibliothèque et souhaitez la mettre à jour en avance), voici quelques exemples dont nous espérons qu’îls vous aideront à commencer à réfléchir un peu différemment à vos composants.  Au fil du temps, nous avons l'intention d'ajouter des « recettes » supplémentaires dans notre documentation pour illustrer les meilleures pratiques liées à certaines tâches courantes afin d'éviter ces méthodes de cycle de vie problématiques.

Avant de commencer, voici un aperçu rapide des modifications de cycle de vie prévues pour la version 16.3 :

* Nous **ajoutons les alias de cycle de vie suivants** : `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps`  et `UNSAFE_componentWillUpdate`. (l’ancien nom continuera à fonctionner en parallèle du nouvel alias.)
* Nous **introduisons deux nouvelles méthodes de cycle de vie**, `static getDerivedStateFromProps` et `getSnapshotBeforeUpdate`.

### Nouvelle méthode de cycle de vie : `getDerivedStateFromProps` {#new-lifecycle-getderivedstatefromprops}

`embed:update-on-async-rendering/definition-getderivedstatefromprops.js`

La nouvelle méthode statique de cycle de vie `getDerivedStateFromProps` est appelée après que le composant est instancié, ainsi qu’avant chaque rafraîchissement.  Elle peut renvoyer un objet qui mettra à jour `state`, ou `null` pour indiquer que les nouvelles `props` ne nécessitent aucune mise à jour de l’état local.

En combinaison avec `componentDidUpdate`, cette nouvelle méthode devrait couvrir tous les cas d’usage de l’obsolète `componentWillReceiveProps`.

>Remarque
>
>Tant l’ancienne `componentWillReceiveProps` que la nouvelle `getDerivedStateFromProps` ajoutent une complexité significative aux composants.  Ça entraîne souvent des [bugs](/blog/2018/06/07/you-probably-dont-need-derived-state.html#common-bugs-when-using-derived-state). Préférez des **[ alternatives à l’état dérivé plus simples](/blog/2018/06/07/you-probably-dont-need-derived-state.html)** afin de rendre vos composants prévisibles et maintenables.

### Nouvelle méthode de cycle de vie : `getSnapshotBeforeUpdate` {#new-lifecycle-getsnapshotbeforeupdate}

`embed:update-on-async-rendering/definition-getsnapshotbeforeupdate.js`

La nouvelle méthode de cycle de vie `getSnapshotBeforeUpdate` est appelée juste avant que les modifications soient finalisées (ex. juste avant la mise à jour du DOM).  La valeur optionnellement renvoyée par cette méthode sera passée en troisième argument à `componentDidUpdate`. (Cette méthode de cycle de vie est rarement nécessaire, mais peut s'avérer utile dans des cas tels que la préservation de la position de défilement à travers un rafraîchissement.)

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
> Par souci de concision, les exemples ci-dessous seront écrits en utilisant la transformée Babel expérimentale de propriétés de classes mais ces stratégies de migration restent valables sans ça.

### Initialisation de l’état local {#initializing-state}

<!-- RESUME/FIXME -->

This example shows a component with `setState` calls inside of `componentWillMount`:
`embed:update-on-async-rendering/initializing-state-before.js`

The simplest refactor for this type of component is to move state initialization to the constructor or to a property initializer, like so:
`embed:update-on-async-rendering/initializing-state-after.js`

### Récupération de données externes {#fetching-external-data}

Here is an example of a component that uses `componentWillMount` to fetch external data:
`embed:update-on-async-rendering/fetching-external-data-before.js`

The above code is problematic for both server rendering (where the external data won't be used) and the upcoming async rendering mode (where the request might be initiated multiple times).

The recommended upgrade path for most use cases is to move data-fetching into `componentDidMount`:
`embed:update-on-async-rendering/fetching-external-data-after.js`

There is a common misconception that fetching in `componentWillMount` lets you avoid the first empty rendering state. In practice this was never true because React has always executed `render` immediately after `componentWillMount`. If the data is not available by the time `componentWillMount` fires, the first `render` will still show a loading state regardless of where you initiate the fetch. This is why moving the fetch to `componentDidMount` has no perceptible effect in the vast majority of cases.

> Note
>
> Some advanced use-cases (e.g. libraries like Relay) may want to experiment with eagerly prefetching async data. An example of how this can be done is available [here](https://gist.github.com/bvaughn/89700e525ff423a75ffb63b1b1e30a8f).
>
> In the longer term, the canonical way to fetch data in React components will likely be based on the “suspense” API [introduced at JSConf Iceland](/blog/2018/03/01/sneak-peek-beyond-react-16.html). Both simple data fetching solutions and libraries like Apollo and Relay will be able to use it under the hood. It is significantly less verbose than either of the above solutions, but will not be finalized in time for the 16.3 release.
>
> When supporting server rendering, it's currently necessary to provide the data synchronously – `componentWillMount` was often used for this purpose but the constructor can be used as a replacement. The upcoming suspense APIs will make async data fetching cleanly possible for both client and server rendering.

### Ajout de gestionnaires d’événements (ou abonnements) {#adding-event-listeners-or-subscriptions}

Here is an example of a component that subscribes to an external event dispatcher when mounting:
`embed:update-on-async-rendering/adding-event-listeners-before.js`

Unfortunately, this can cause memory leaks for server rendering (where `componentWillUnmount` will never be called) and async rendering (where rendering might be interrupted before it completes, causing `componentWillUnmount` not to be called).

People often assume that `componentWillMount` and `componentWillUnmount` are always paired, but that is not guaranteed. Only once `componentDidMount` has been called does React guarantee that `componentWillUnmount` will later be called for clean up.

For this reason, the recommended way to add listeners/subscriptions is to use the `componentDidMount` lifecycle:
`embed:update-on-async-rendering/adding-event-listeners-after.js`

Sometimes it is important to update subscriptions in response to property changes. If you're using a library like Redux or MobX, the library's container component should handle this for you. For application authors, we've created a small library, [`create-subscription`](https://github.com/facebook/react/tree/master/packages/create-subscription), to help with this. We'll publish it along with React 16.3.

Rather than passing a subscribable `dataSource` prop as we did in the example above, we could use `create-subscription` to pass in the subscribed value:

`embed:update-on-async-rendering/adding-event-listeners-create-subscription.js`

> Note
>
> Libraries like Relay/Apollo should manage subscriptions manually with the same techniques as `create-subscription` uses under the hood (as referenced [here](https://gist.github.com/bvaughn/d569177d70b50b58bff69c3c4a5353f3)) in a way that is most optimized for their library usage.

### Mise à jour de `state` sur la base des props {#updating-state-based-on-props}

>Note:
>
>Both the older `componentWillReceiveProps` and the new `getDerivedStateFromProps` methods add significant complexity to components. This often leads to [bugs](/blog/2018/06/07/you-probably-dont-need-derived-state.html#common-bugs-when-using-derived-state). Consider **[simpler alternatives to derived state](/blog/2018/06/07/you-probably-dont-need-derived-state.html)** to make components predictable and maintainable.

Here is an example of a component that uses the legacy `componentWillReceiveProps` lifecycle to update `state` based on new `props` values:
`embed:update-on-async-rendering/updating-state-from-props-before.js`

Although the above code is not problematic in itself, the `componentWillReceiveProps` lifecycle is often mis-used in ways that _do_ present problems. Because of this, the method will be deprecated.

As of version 16.3, the recommended way to update `state` in response to `props` changes is with the new `static getDerivedStateFromProps` lifecycle. (That lifecycle is called when a component is created and each time it receives new props):
`embed:update-on-async-rendering/updating-state-from-props-after.js`

You may notice in the example above that `props.currentRow` is mirrored in state (as `state.lastRow`). This enables `getDerivedStateFromProps` to access the previous props value in the same way as is done in `componentWillReceiveProps`.

You may wonder why we don't just pass previous props as a parameter to `getDerivedStateFromProps`. We considered this option when designing the API, but ultimately decided against it for two reasons:
* A `prevProps` parameter would be null the first time `getDerivedStateFromProps` was called (after instantiation), requiring an if-not-null check to be added any time `prevProps` was accessed.
* Not passing the previous props to this function is a step toward freeing up memory in future versions of React. (If React does not need to pass previous props to lifecycles, then it does not need to keep the previous `props` object in memory.)

> Note
>
> If you're writing a shared component, the [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat) polyfill enables the new `getDerivedStateFromProps` lifecycle to be used with older versions of React as well. [Learn more about how to use it below.](#open-source-project-maintainers)

### Invocation de fonctions de rappel externes {#invoking-external-callbacks}

Here is an example of a component that calls an external function when its internal state changes:
`embed:update-on-async-rendering/invoking-external-callbacks-before.js`

Sometimes people use `componentWillUpdate` out of a misplaced fear that by the time `componentDidUpdate` fires, it is "too late" to update the state of other components. This is not the case. React ensures that any `setState` calls that happen during `componentDidMount` and `componentDidUpdate` are flushed before the user sees the updated UI. In general, it is better to avoid cascading updates like this, but in some cases they are necessary (for example, if you need to position a tooltip after measuring the rendered DOM element).

Either way, it is unsafe to use `componentWillUpdate` for this purpose in async mode, because the external callback might get called multiple times for a single update. Instead, the `componentDidUpdate` lifecycle should be used since it is guaranteed to be invoked only once per update:
`embed:update-on-async-rendering/invoking-external-callbacks-after.js`

### Effets de bord lorsque les props changent {#side-effects-on-props-change}

Similar to the [example above](#invoking-external-callbacks), sometimes components have side effects when `props` change.

`embed:update-on-async-rendering/side-effects-when-props-change-before.js`

Like `componentWillUpdate`, `componentWillReceiveProps` might get called multiple times for a single update. For this reason it is important to avoid putting side effects in this method. Instead, `componentDidUpdate` should be used since it is guaranteed to be invoked only once per update:

`embed:update-on-async-rendering/side-effects-when-props-change-after.js`

### Récupération de données externes lorsque les props changent {#fetching-external-data-when-props-change}

Here is an example of a component that fetches external data based on `props` values:
`embed:update-on-async-rendering/updating-external-data-when-props-change-before.js`

The recommended upgrade path for this component is to move data updates into `componentDidUpdate`. You can also use the new `getDerivedStateFromProps` lifecycle to clear stale data before rendering the new props:
`embed:update-on-async-rendering/updating-external-data-when-props-change-after.js`

> Note
>
> If you're using an HTTP library that supports cancellation, like [axios](https://www.npmjs.com/package/axios), then it's simple to cancel an in-progress request when unmounting. For native Promises, you can use an approach like [the one shown here](https://gist.github.com/bvaughn/982ab689a41097237f6e9860db7ca8d6).

### Lecture de propriétés du DOM avant sa mise à jour {#reading-dom-properties-before-an-update}

Here is an example of a component that reads a property from the DOM before an update in order to maintain scroll position within a list:
`embed:update-on-async-rendering/react-dom-properties-before-update-before.js`

In the above example, `componentWillUpdate` is used to read the DOM property. However with async rendering, there may be delays between "render" phase lifecycles (like `componentWillUpdate` and `render`) and "commit" phase lifecycles (like `componentDidUpdate`). If the user does something like resize the window during this time, the `scrollHeight` value read from `componentWillUpdate` will be stale.

The solution to this problem is to use the new "commit" phase lifecycle, `getSnapshotBeforeUpdate`. This method gets called _immediately before_ mutations are made (e.g. before the DOM is updated). It can return a value for React to pass as a parameter to `componentDidUpdate`, which gets called _immediately after_ mutations.

The two lifecycles can be used together like this:

`embed:update-on-async-rendering/react-dom-properties-before-update-after.js`

> Note
>
> If you're writing a shared component, the [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat) polyfill enables the new `getSnapshotBeforeUpdate` lifecycle to be used with older versions of React as well. [Learn more about how to use it below.](#open-source-project-maintainers)

## Autres scénarios {#other-scenarios}

While we tried to cover the most common use cases in this post, we recognize that we might have missed some of them. If you are using `componentWillMount`, `componentWillUpdate`, or `componentWillReceiveProps` in ways that aren't covered by this blog post, and aren't sure how to migrate off these legacy lifecycles, please [file a new issue against our documentation](https://github.com/reactjs/reactjs.org/issues/new) with your code examples and as much background information as you can provide. We will update this document with new alternative patterns as they come up.

## Mainteneurs de projets open-source {#open-source-project-maintainers}

Open source maintainers might be wondering what these changes mean for shared components. If you implement the above suggestions, what happens with components that depend on the new static `getDerivedStateFromProps` lifecycle? Do you also have to release a new major version and drop compatibility for React 16.2 and older?

Fortunately, you do not!

When React 16.3 is published, we'll also publish a new npm package, [`react-lifecycles-compat`](https://github.com/reactjs/react-lifecycles-compat). This package polyfills components so that the new `getDerivedStateFromProps` and `getSnapshotBeforeUpdate` lifecycles will also work with older versions of React (0.14.9+).

To use this polyfill, first add it as a dependency to your library:

```bash
# Yarn
yarn add react-lifecycles-compat

# NPM
npm install react-lifecycles-compat --save
```

Next, update your components to use the new lifecycles (as described above).

Lastly, use the polyfill to make your component backwards compatible with older versions of React:
`embed:update-on-async-rendering/using-react-lifecycles-compat.js`

<!-- FIXME: embedded files, too! -->
