---
title: "Vous n'avez sans doute pas besoin d'états dérivés"
author: [bvaughn]
---

React 16.4 comprend [un fix pour `getDerivedStateFromProps`](/blog/2018/05/23/react-v-16-4.html#bugfix-for-getderivedstatefromprops) qui fait que certains bugs connus des composants React se produisent plus fréquemment. Si la publication de cette version avec ce fix à mis en evidence un anti-pattern dans votre application et l'a cassée, nous sommes désolé pour le désagrément. Dans cet article nous allons passer en revus certains anti-patterns habituels autour des état dérivé et les alternatives que nous recommandons.

Depuis longtemps, la méthode de cycle de vie `componentWillReceiveProps` était la seule façon de mettre à jour un état suite à un changement de props sans pour autant déclencher un rendu supplémentaire. Dans la version 16.3, [nous avons introduit une méthode de cycle de vie de remplacement `getDerivedStateFromProps`](/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes) afin de résoudre ce cas d'usage de manière plus sur. Au même moment, nous nous sommes aperçus que les gens avait de nombreuses idées fausses quand à l'utilisation de ces deux méthodes et nous avons découverts des anti-patterns qui amenaient des bugs à la foi subtiles et déroutant. Le fix pour `getDerivedStateFromProps` dans la version 16.4 [rend les états dérivés plus prédictifs](https://github.com/facebook/react/issues/12898), ainsi les conséquences d'uns mauvaise utilisation sont plus facile à identifier.

> Remarque :
>
> Tous les anti-patterns décrits dans cette article s'appliquent aussi bien à la vieille méthode `componentWillReceiveProps` qu'à la nouvelle `getDerivedStateFromProps`.

Cette article va couvrir les sujets suivant :
* [Quand utiliser les états dérivés](#when-to-use-derived-state)
* [Les bug courant lors de l'utilisation des états dérivés](#common-bugs-when-using-derived-state)
  * [Anti-pattern: La copie inconditionnelle des props dans l'état](#anti-pattern-unconditionally-copying-props-to-state)
  * [Anti-pattern: Effacer l'état quand les props changent](#anti-pattern-erasing-state-when-props-change)
* [Les solution recommandées](#preferred-solutions)
* [Et la memoization dans tout ça?](#what-about-memoization)

## Quand utiliser les états dérivés {#when-to-use-derived-state}

`getDerivedStateFromProps` n'existe que dans un seul but. Il permet à un composant de mettre à jour son état interne suite à **un changement de ses props**. Notre article de blog précédent fournissait quelques examples tel que [l'enregistrement de la direction du défilement basé sur le changement d'une prop `offset`](/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props) ou [le chargement de données externes spécifiées avec une prop source](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change).

Nous n'avons pas données beaucoup d'example car, de manière général, **les états dérivés devraient être utilisés avec parcimonie**. Tous les problèmes que nous avons identifié avec les états dérivés peuvent, au bout du bout, se résumer à (1) la mise à jour inconditionnel de l'états avec les props ou (2) la mise à jour de l'état à chaque fois que l'état et les props ne correspondent pas. (Nous allons détailler ces deux cas ci-après)

* Si vous utilisez les états dérivés pour mémoriser (NdT : _memoize_) certains calcules sur la seul base des props courant vous n'avez pas besoin des états dérivés. Allez voir [Et la memoization dans tout ça?](#what-about-memoization) ci-après.
* Si vous mettrez à jour votre état dérivé sans condition ou si vous le mettez à jour même quand l'état et les props ne correspondent pas, il y a de forte chance que votre composant réinitialise son état trop fréquemment. Continuer votre lecture pour plus de détails.

## Les bug courant lors de l'utilisation des états dérivés {#common-bugs-when-using-derived-state}

Les termes [« controlé »](/docs/forms.html#controlled-components) et [« non-controlé »](/docs/uncontrolled-components.html) se réfère habituellement aux champs de formulaire, cependant ils peuvent également décrire là où vive les données d'un composant. Les données passées dans des props peuvent êtres considérées comme **controlé** (parce que le composant parent _controle_ ces données). Les données qui existent uniquement dans l'état interne peuvent êtres considérées comme **non-controlé** (parce que le composant parent ne peut pas les changer directement).

L'erreur la plus courante avec les états dérivé survient lorsqu'on mélange les deux concepts ; quand la valeur d'un état dérivé et également mise à jour par un appel à `setState`, il n'y a plus une seul source de vérité pour les données. [L'example de chargement de données externes](/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change) évoqué ci-avant peut sembler similaire mais il est en réalité différent sur un certain nombre de points clés. Dans l'example du chargement, il y a une source de vérité clairement identifiée à la fois pour la prop « source » et pour l'état de « chargement ». Quand la prop source change, l'état de chargement devrait **toujours** être écrasé. Inversement, l'état n'est écrasé que lorsque la prop **change** et est géré par le composant dans tous les autres cas.

Les problèmes surviennent quand n'importe laquelle de ces contraintes change. Cela se produit habituellement de deux façon. Voyons chacun de ces cas.

### Anti-pattern: La copie inconditionnelle des props dans l'état {#anti-pattern-unconditionally-copying-props-to-state}

Une erreur courante consiste à croire que `getDerivedStateFromProps` and `componentWillReceiveProps` ne sont appelées que lorsque les props « change ». Ces méthodes de cycle de vie sont appelées à chaque fois qu'un composant parent va être rendu, peut importe que les props soit « différentes » ou non de la fois précédente. Pour cette raison, il a toujours été dangereux d'écraser l'état de manière _inconditionnelle_ en utilisant ces méthodes de cycle de vie. **Cette pratique conduira à une perte des mises à jour de l'état.**

Prenons un example pour illustrer ce problème. Voici un composant `EmailInput` qui « reflète » une prop e-mail dans l'état :
```js
class EmailInput extends Component {
  state = { email: this.props.email };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  componentWillReceiveProps(nextProps) {
    // Ça va écraser toute mise à jour de l'état local !
    // Ne faites pas ça.
    this.setState({ email: nextProps.email });
  }
}
```

A première vue, ce composant à l'air bien. L'état est initialisé avec la valeur spécifiée par les props et mis à jour quand nous saisissons quelque chose dans la balise `<input>`. Cependant, si notre composant parent vient à être rendu à nouveau, tout ce que nous aurons saisie sera perdu ! ([Jetez un coup d'œil à cette démo par example.](https://codesandbox.io/s/m3w9zn1z8x)) Le problème persiste même si on compare `nextProps.email !== this.state.email` avant de réinitialiser la valeur.

Dans cette example, ajouter `shouldComponentUpdate` afin de réaliser un nouveau rendu quand la prop e-mail change devrait résoudre le problème. Cependant, en pratique, les composant reçoivent plusieurs props et une autre prop pourrait provoquer un nouveau rendu et donc une réinitialisation malvenue. Les props function et objet sont aussi souvent inlinées ce qui rend difficile la mise en œuvre d'une méthode `shouldComponentUpdate` capable de retourner `true` à chaque changement substantiel. [Voici une démo qui montre ce qui ce passe dans un tel cas.](https://codesandbox.io/s/jl0w6r9w59) En conséquences, `shouldComponentUpdate` est un bon système pour optimiser les performances mais il ne vaux rien pour garantir la qualité des états dérivés.

On peut espérer que vous savez maintenant pourquoi c'est une mauvaise idée de copier les props dans l'état de manière inconditionnelle. Avant de passer en revue les solutions possibles, jetons un coup d'œil à un autre pattern problématique connexe: Que ce passerait-il si on met à jour l'état quand la prop e-mail change ?

### Anti-pattern: Effacer l'état quand les props changent {#anti-pattern-erasing-state-when-props-change}

Si on reprend l'example précédent, on peut éviter d'effacer l'état accidentellement en ne le mettant à jour que lorsque `props.email` change :

```js
class EmailInput extends Component {
  state = {
    email: this.props.email
  };

  componentWillReceiveProps(nextProps) {
    // A chaque fois que props.email change, on met l'état à jour.
    if (nextProps.email !== this.props.email) {
      this.setState({
        email: nextProps.email
      });
    }
  }

  // ...
}
```

> Note
>
> Even though the example above shows `componentWillReceiveProps`, the same anti-pattern applies to `getDerivedStateFromProps`.

We've just made a big improvement. Now our component will erase what we've typed only when the props actually change.

There is still a subtle problem. Imagine a password manager app using the above input component. When navigating between details for two accounts with the same email, the input would fail to reset. This is because the prop value passed to the component would be the same for both accounts! This would be a surprise to the user, as an unsaved change to one account would appear to affect other accounts that happened to share the same email. ([See demo here.](https://codesandbox.io/s/mz2lnkjkrx))

This design is fundamentally flawed, but it's also an easy mistake to make. ([I've made it myself!](https://twitter.com/brian_d_vaughn/status/959600888242307072)) Fortunately there are two alternatives that work better. The key to both is that **for any piece of data, you need to pick a single component that owns it as the source of truth, and avoid duplicating it in other components.** Let's take a look at each of the alternatives.

## Preferred Solutions {#preferred-solutions}

### Recommendation: Fully controlled component {#recommendation-fully-controlled-component}

One way to avoid the problems mentioned above is to remove state from our component entirely. If the email address only exists as a prop, then we don't have to worry about conflicts with state. We could even convert `EmailInput` to a lighter-weight function component:
```js
function EmailInput(props) {
  return <input onChange={props.onChange} value={props.email} />;
}
```

This approach simplifies the implementation of our component, but if we still want to store a draft value, the parent form component will now need to do that manually. ([Click here to see a demo of this pattern.](https://codesandbox.io/s/7154w1l551))

### Recommendation: Fully uncontrolled component with a `key` {#recommendation-fully-uncontrolled-component-with-a-key}

Another alternative would be for our component to fully own the "draft" email state. In that case, our component could still accept a prop for the _initial_ value, but it would ignore subsequent changes to that prop:

```js
class EmailInput extends Component {
  state = { email: this.props.defaultEmail };

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }
}
```

In order to reset the value when moving to a different item (as in our password manager scenario), we can use the special React attribute called `key`. When a `key` changes, React will [_create_ a new component instance rather than _update_ the current one](/docs/reconciliation.html#keys). Keys are usually used for dynamic lists but are also useful here. In our case, we could use the user ID to recreate the email input any time a new user is selected:

```js
<EmailInput
  defaultEmail={this.props.user.email}
  key={this.props.user.id}
/>
```

Each time the ID changes, the `EmailInput` will be recreated and its state will be reset to the latest `defaultEmail` value. ([Click here to see a demo of this pattern.](https://codesandbox.io/s/6v1znlxyxn)) With this approach, you don't have to add `key` to every input. It might make more sense to put a `key` on the whole form instead. Every time the key changes, all components within the form will be recreated with a freshly initialized state.

In most cases, this is the best way to handle state that needs to be reset.

> Note
>
> While this may sound slow, the performance difference is usually insignificant. Using a key can even be faster if the components have heavy logic that runs on updates since diffing gets bypassed for that subtree.

#### Alternative 1: Reset uncontrolled component with an ID prop {#alternative-1-reset-uncontrolled-component-with-an-id-prop}

If `key` doesn't work for some reason (perhaps the component is very expensive to initialize), a workable but cumbersome solution would be to watch for changes to "userID" in `getDerivedStateFromProps`:

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail,
    prevPropsUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.userID !== state.prevPropsUserID) {
      return {
        prevPropsUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

This also provides the flexibility to only reset parts of our component's internal state if we so choose. ([Click here to see a demo of this pattern.](https://codesandbox.io/s/rjyvp7l3rq))

> Note
>
> Even though the example above shows `getDerivedStateFromProps`, the same technique can be used with `componentWillReceiveProps`.

#### Alternative 2: Reset uncontrolled component with an instance method {#alternative-2-reset-uncontrolled-component-with-an-instance-method}

More rarely, you may need to reset state even if there's no appropriate ID to use as `key`. One solution is to reset the key to a random value or autoincrementing number each time you want to reset. One other viable alternative is to expose an instance method to imperatively reset the internal state:

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail
  };

  resetEmailForNewUser(newEmail) {
    this.setState({ email: newEmail });
  }

  // ...
}
```

The parent form component could then [use a `ref` to call this method](/docs/glossary.html#refs). ([Click here to see a demo of this pattern.](https://codesandbox.io/s/l70krvpykl))

Refs can be useful in certain cases like this one, but generally we recommend you use them sparingly. Even in the demo, this imperative method is nonideal because two renders will occur instead of one.

-----

### Recap {#recap}

To recap, when designing a component, it is important to decide whether its data will be controlled or uncontrolled.

Instead of trying to **"mirror" a prop value in state**, make the component **controlled**, and consolidate the two diverging values in the state of some parent component. For example, rather than a child accepting a "committed" `props.value` and tracking a "draft" `state.value`, have the parent manage both `state.draftValue` and `state.committedValue` and control the child's value directly. This makes the data flow more explicit and predictable.

For **uncontrolled** components, if you're trying to reset state when a particular prop (usually an ID) changes, you have a few options:
* **Recommendation: To reset _all internal state_, use the `key` attribute.**
* Alternative 1: To reset _only certain state fields_, watch for changes in a special property (e.g. `props.userID`).
* Alternative 2: You can also consider fall back to an imperative instance method using refs.

## What about memoization? {#what-about-memoization}

We've also seen derived state used to ensure an expensive value used in `render` is recomputed only when the inputs change. This technique is known as [memoization](https://en.wikipedia.org/wiki/Memoization).

Using derived state for memoization isn't necessarily bad, but it's usually not the best solution. There is inherent complexity in managing derived state, and this complexity increases with each additional property. For example, if we add a second derived field to our component state then our implementation would need to separately track changes to both.

Let's look at an example of one component that takes one prop—a list of items—and renders the items that match a search query entered by the user. We could use derived state to store the filtered list:

```js
class Example extends Component {
  state = {
    filterText: "",
  };

  // *******************************************************
  // NOTE: this example is NOT the recommended approach.
  // See the examples below for our recommendations instead.
  // *******************************************************

  static getDerivedStateFromProps(props, state) {
    // Re-run the filter whenever the list array or filter text change.
    // Note we need to store prevPropsList and prevFilterText to detect changes.
    if (
      props.list !== state.prevPropsList ||
      state.prevFilterText !== state.filterText
    ) {
      return {
        prevPropsList: props.list,
        prevFilterText: state.filterText,
        filteredList: props.list.filter(item => item.text.includes(state.filterText))
      };
    }
    return null;
  }

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{this.state.filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

This implementation avoids recalculating `filteredList` more often than necessary. But it is more complicated than it needs to be, because it has to separately track and detect changes in both props and state in order to properly update the filtered list. In this example, we could simplify things by using `PureComponent` and moving the filter operation into the render method:

```js
// PureComponents only rerender if at least one state or prop value changes.
// Change is determined by doing a shallow comparison of state and prop keys.
class Example extends PureComponent {
  // State only needs to hold the current filter text value:
  state = {
    filterText: ""
  };

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // The render method on this PureComponent is called only if
    // props.list or state.filterText has changed.
    const filteredList = this.props.list.filter(
      item => item.text.includes(this.state.filterText)
    )

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

The above approach is much cleaner and simpler than the derived state version. Occasionally, this won't be good enough—filtering may be slow for large lists, and `PureComponent` won't prevent rerenders if another prop were to change. To address both of these concerns, we could add a memoization helper to avoid unnecessarily re-filtering our list:

```js
import memoize from "memoize-one";

class Example extends Component {
  // State only needs to hold the current filter text value:
  state = { filterText: "" };

  // Re-run the filter whenever the list array or filter text changes:
  filter = memoize(
    (list, filterText) => list.filter(item => item.text.includes(filterText))
  );

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // Calculate the latest filtered list. If these arguments haven't changed
    // since the last render, `memoize-one` will reuse the last return value.
    const filteredList = this.filter(this.props.list, this.state.filterText);

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

This is much simpler and performs just as well as the derived state version!

When using memoization, remember a couple of constraints:

1. In most cases, you'll want to **attach the memoized function to a component instance**. This prevents multiple instances of a component from resetting each other's memoized keys.
1. Typically you'll want to use a memoization helper with a **limited cache size** in order to prevent memory leaks over time. (In the example above, we used `memoize-one` because it only caches the most recent arguments and result.)
1. None of the implementations shown in this section will work if `props.list` is recreated each time the parent component renders. But in most cases, this setup is appropriate.

## In closing {#in-closing}

In real world applications, components often contain a mix of controlled and uncontrolled behaviors. This is okay! If each value has a clear source of truth, you can avoid the anti-patterns mentioned above.

It is also worth re-iterating that `getDerivedStateFromProps` (and derived state in general) is an advanced feature and should be used sparingly because of this complexity. If your use case falls outside of these patterns, please share it with us on [GitHub](https://github.com/reactjs/reactjs.org/issues/new) or [Twitter](https://twitter.com/reactjs)!
