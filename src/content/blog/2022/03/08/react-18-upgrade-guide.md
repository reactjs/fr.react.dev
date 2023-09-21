---
title: "Comment migrer sur React 18"
---

Le 8 mars 2022 par [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

Comme nous l'avons annoncé dans le [billet de sortie](/blog/2022/03/29/react-v18), React 18 introduit des fonctionnalités basées sur notre nouveau moteur de rendu concurrent, avec une statégie d'adoption graduelle pour les applications existantes. Dans ce billet, nous vous guidons étape par étape dans votre migration sur React 18.

Merci de nous [signaler tout problème](https://github.com/facebook/react/issues/new/choose) que vous rencontreriez en migrant sur React 18.

</Intro>

<Note>

Concernant les utilisateurs de React Native, React 18 sera livré dans une future version de React Native. C'est parce que React 18 repose sur la nouvelle architecture de React Native pour mettre en œuvre les nouvelles fonctionnalités présentées dans ce billet. Pour plus d'informations, regardez la [plénière d'ouverture de la React Conf](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s).

</Note>

---

## Installation {/*installing*/}

Pour installer la dernière version de React, faites :

```bash
npm install react react-dom
```

Ou si vous utilisez Yarn :

```bash
yarn add react react-dom
```

## Évolutions des API de rendu côté client {/*updates-to-client-rendering-apis*/}

Lorsque vous installez React &_ pour la première fois, vous verrez cet avertissement dans la console :

<ConsoleBlock level="error">

ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot

</ConsoleBlock>

*(« ReactDOM.render n'est plus pris en charge dans React 18. Utilisez plutôt createRoot.  Tant que vous ne basculerez pas vers la nouvelle API, votre appli se comportera comme si elle utilisait React 17.  Apprenez-en davantage ici : https://reactjs.org/link/switch-to-createroot », NdT)*

React 18 propose une nouvelle API avec une bien meilleure ergonomie pour gérer les racines applicatives. Cette nouvelle API permet également le recours au nouveau moteur de rendu concurrent, et donc aux fonctionnalités concurrentes.

```js
// Avant
import { render } from 'react-dom';
const container = document.getElementById('app');
render(<App tab="home" />, container);

// Après
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) si vous utilisez TypeScript
root.render(<App tab="home" />);
```

Nous passons aussi de `unmountComponentAtNode` à `root.unmount` :

```js
// Avant
unmountComponentAtNode(container);

// Après
root.unmount();
```

La fonction de rappel de `render` a également disparu, dans la mesure où elle n'a généralement pas le résultat attendu lorsqu'on utilise Suspense :

```js
// Avant
const container = document.getElementById('app');
render(<App tab="home" />, container, () => {
  console.log('rendu effectué');
});

// Après
function AppWithCallbackAfterRender() {
  useEffect(() => {
    console.log('rendu effectué');
  });

  return <App tab="home" />
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<AppWithCallbackAfterRender />);
```

<Note>

Il n'y a pas d'alternative exacte à l'ancienne fonction de rappel de l'API de rendu racine ; tout dépend de votre cas d'utilisation.  Consultez la discussion du groupe de travail sur [le remplacement de `render` par `createRoot`](https://github.com/reactwg/react-18/discussions/5) pour en apprendre davantage.

</Note>

Pour finir, si votre appli utilise le rendu côté serveur avec l'hydratation, remplacez `hydrate` par `hydrateRoot` :

```js
// Avant
import { hydrate } from 'react-dom';
const container = document.getElementById('app');
hydrate(<App tab="home" />, container);

// Après
import { hydrateRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = hydrateRoot(container, <App tab="home" />);
// Contrairement à createRoot, vous n’avez ici pas besoin d’un appel
// distinct à root.render()
```

Pour en apprendre davantage, consultez [cette discussion du groupe de travail](https://github.com/reactwg/react-18/discussions/5).

<Note>

**Si votre appli ne fonctionne plus après la migration, vérifiez si elle est enrobée par `<StrictMode>`.** [Le mode strict est plus strict en React 18](#updates-to-strict-mode), et tous vos composants ne sont pas forcément conformes aux nouvelles vérifications qu'il effectue en mode développement.  Si le retrait du mode strict fait refonctionner votre appli, vous pouvez le retirer pendant la migration puis le rajouter à la fin (soit à la racine soit sur une partie de l'arbre), après que vous aurez corrigé les problèmes qu'il met en lumière.

</Note>

## Évolutions des API de rendu côté serveur {/*updates-to-server-rendering-apis*/}

Cette version a repensé les API de `react-dom/server` pour prendre pleinement en charge Suspense côté serveur, ainsi que le rendu streamé côté serveur.  Dans ce cadre, nous déprécions l'ancienne API de streaming basée Node, qui ne permettait pas un streaming incrémental côté serveur grâce à Suspense.

Le recours à cette ancienne API entraînera un avertissement :

* `renderToNodeStream` : **déprécié ⛔️️**

Pour des environnements de streaming basés Node, utilisez plutôt :

* `renderToPipeableStream` : **nouveau ✨**

Nous avons aussi ajouté une nouvelle API permettant le rendu streamé côté serveur avec Suspense pour les moteurs JavaScript plus modernes, tels que Deno ou les Cloudflare Workers :

* `renderToReadableStream` : **nouveau ✨**

Les API suivantes continuent de fonctionner, mais ne prennent que partiellement Suspense en charge :

* `renderToString` : **limité** ⚠️
* `renderToStaticMarkup` : **limité** ⚠️

Enfin, cette API continuera à fonctionner pour par exemple produire des e-mails :

* `renderToStaticNodeStream`

Pour de plus amples informations sur les évolutions des API de rendu côté serveur, consultez la discussion du groupe de travail sur [la migration sur React 18 côté serveur](https://github.com/reactwg/react-18/discussions/22), une [exploration en profondeur de la nouvelle architecture de SSR avec Suspense](https://github.com/reactwg/react-18/discussions/37), et la présentation de [Shaundai Person](https://twitter.com/shaundai) sur le [rendu streamé côté serveur avec Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc) à la React Conf 2021.

## Évolutions des définitions TypeScript {/*updates-to-typescript-definitions*/}

If your project uses TypeScript, you will need to update your `@types/react` and `@types/react-dom` dependencies to the latest versions. The new types are safer and catch issues that used to be ignored by the type checker. The most notable change is that the `children` prop now needs to be listed explicitly when defining props, for example:

```typescript{3}
interface MyButtonProps {
  color: string;
  children?: React.ReactNode;
}
```

See the [React 18 typings pull request](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210) for a full list of type-only changes. It links to example fixes in library types so you can see how to adjust your code. You can use the [automated migration script](https://github.com/eps1lon/types-react-codemod) to help port your application code to the new and safer typings faster.

If you find a bug in the typings, please [file an issue](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/new?category=issues-with-a-types-package) in the DefinitelyTyped repo.

## Traitement par lots automatique {/*automatic-batching*/}

React 18 adds out-of-the-box performance improvements by doing more batching by default. Batching is when React groups multiple state updates into a single re-render for better performance. Before React 18, we only batched updates inside React event handlers. Updates inside of promises, setTimeout, native event handlers, or any other event were not batched in React by default:

```js
// Before React 18 only React events were batched

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will render twice, once for each state update (no batching)
}, 1000);
```


Starting in React 18 with `createRoot`, all updates will be automatically batched, no matter where they originate from. This means that updates inside of timeouts, promises, native event handlers or any other event will batch the same way as updates inside of React events:

```js
// After React 18 updates inside of timeouts, promises,
// native event handlers or any other event are batched.

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}, 1000);
```

This is a breaking change, but we expect this to result in less work rendering, and therefore better performance in your applications. To opt-out of automatic batching, you can use `flushSync`:

```js
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // React has updated the DOM by now
  flushSync(() => {
    setFlag(f => !f);
  });
  // React has updated the DOM by now
}
```

For more information, see the [Automatic batching deep dive](https://github.com/reactwg/react-18/discussions/21).

## Nouvelles API à destination des bibliothèques {/*new-apis-for-libraries*/}

In the React 18 Working Group we worked with library maintainers to create new APIs needed to support concurrent rendering for use cases specific to their use case in areas like styles, and external stores. To support React 18, some libraries may need to switch to one of the following APIs:

* `useSyncExternalStore` is a new hook that allows external stores to support concurrent reads by forcing updates to the store to be synchronous. This new API is recommended for any library that integrates with state external to React. For more information, see the [useSyncExternalStore overview post](https://github.com/reactwg/react-18/discussions/70) and [useSyncExternalStore API details](https://github.com/reactwg/react-18/discussions/86).
* `useInsertionEffect` is a new hook that allows CSS-in-JS libraries to address performance issues of injecting styles in render. Unless you've already built a CSS-in-JS library we don't expect you to ever use this. This hook will run after the DOM is mutated, but before layout effects read the new layout. This solves an issue that already exists in React 17 and below, but is even more important in React 18 because React yields to the browser during concurrent rendering, giving it a chance to recalculate layout. For more information, see the [Library Upgrade Guide for `<style>`](https://github.com/reactwg/react-18/discussions/110).

React 18 also introduces new APIs for concurrent rendering such as `startTransition`, `useDeferredValue` and `useId`, which we share more about in the [release post](/blog/2022/03/29/react-v18).

## Évolutions du mode strict {/*updates-to-strict-mode*/}

In the future, we'd like to add a feature that allows React to add and remove sections of the UI while preserving state. For example, when a user tabs away from a screen and back, React should be able to immediately show the previous screen. To do this, React would unmount and remount trees using the same component state as before.

This feature will give React better performance out-of-the-box, but requires components to be resilient to effects being mounted and destroyed multiple times. Most effects will work without any changes, but some effects assume they are only mounted or destroyed once.

To help surface these issues, React 18 introduces a new development-only check to Strict Mode. This new check will automatically unmount and remount every component, whenever a component mounts for the first time, restoring the previous state on the second mount.

Before this change, React would mount the component and create the effects:

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
```

With Strict Mode in React 18, React will simulate unmounting and remounting the component in development mode:

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
* React simulates unmounting the component.
    * Layout effects are destroyed.
    * Effects are destroyed.
* React simulates mounting the component with the previous state.
    * Layout effect setup code runs
    * Effect setup code runs
```

For more information, see the Working Group posts for [Adding Reusable State to StrictMode](https://github.com/reactwg/react-18/discussions/19) and [How to support Reusable State in Effects](https://github.com/reactwg/react-18/discussions/18).

## Configurer votre environnement de test {/*configuring-your-testing-environment*/}

When you first update your tests to use `createRoot`, you may see this warning in your test console:

<ConsoleBlock level="error">

The current testing environment is not configured to support act(...)

</ConsoleBlock>

To fix this, set `globalThis.IS_REACT_ACT_ENVIRONMENT` to `true` before running your test:

```js
// In your test setup file
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

The purpose of the flag is to tell React that it's running in a unit test-like environment. React will log helpful warnings if you forget to wrap an update with `act`.

You can also set the flag to `false` to tell React that `act` isn't needed. This can be useful for end-to-end tests that simulate a full browser environment.

Eventually, we expect testing libraries will configure this for you automatically. For example, the [next version of React Testing Library has built-in support for React 18](https://github.com/testing-library/react-testing-library/issues/509#issuecomment-917989936) without any additional configuration.

[More background on the `act` testing API and related changes](https://github.com/reactwg/react-18/discussions/102) is available in the working group.

## Arrêt de la prise en charge d'Internet Explorer {/*dropping-support-for-internet-explorer*/}

In this release, React is dropping support for Internet Explorer, which is [going out of support on June 15, 2022](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge). We’re making this change now because new features introduced in React 18 are built using modern browser features such as microtasks which cannot be adequately polyfilled in IE.

If you need to support Internet Explorer we recommend you stay with React 17.

## Dépréciations {/*deprecations*/}

* `react-dom`: `ReactDOM.render` has been deprecated. Using it will warn and run your app in React 17 mode.
* `react-dom`: `ReactDOM.hydrate` has been deprecated. Using it will warn and run your app in React 17 mode.
* `react-dom`: `ReactDOM.unmountComponentAtNode` has been deprecated.
* `react-dom`: `ReactDOM.renderSubtreeIntoContainer` has been deprecated.
* `react-dom/server`: `ReactDOMServer.renderToNodeStream` has been deprecated.

## Autres ruptures de compatibilité ascendante {/*other-breaking-changes*/}

* **Consistent useEffect timing**: React now always synchronously flushes effect functions if the update was triggered during a discrete user input event such as a click or a keydown event. Previously, the behavior wasn't always predictable or consistent.
* **Stricter hydration errors**: Hydration mismatches due to missing or extra text content are now treated like errors instead of warnings. React will no longer attempt to "patch up" individual nodes by inserting or deleting a node on the client in an attempt to match the server markup, and will revert to client rendering up to the closest `<Suspense>` boundary in the tree. This ensures the hydrated tree is consistent and avoids potential privacy and security holes that can be caused by hydration mismatches.
* **Suspense trees are always consistent:** If a component suspends before it's fully added to the tree, React will not add it to the tree in an incomplete state or fire its effects. Instead, React will throw away the new tree completely, wait for the asynchronous operation to finish, and then retry rendering again from scratch. React will render the retry attempt concurrently, and without blocking the browser.
* **Layout Effects with Suspense**: When a tree re-suspends and reverts to a fallback, React will now clean up layout effects, and then re-create them when the content inside the boundary is shown again. This fixes an issue which prevented component libraries from correctly measuring layout when used with Suspense.
* **New JS Environment Requirements**: React now depends on modern browsers features including `Promise`, `Symbol`, and `Object.assign`. If you support older browsers and devices such as Internet Explorer which do not provide modern browser features natively or have non-compliant implementations, consider including a global polyfill in your bundled application.

## Autres évolutions notables {/*other-notable-changes*/}

### React {/*react*/}

* **Components can now render `undefined`:** React no longer warns if you return `undefined` from a component. This makes the allowed component return values consistent with values that are allowed in the middle of a component tree. We suggest to use a linter to prevent mistakes like forgetting a `return` statement before JSX.
* **In tests, `act` warnings are now opt-in:** If you're running end-to-end tests, the `act` warnings are unnecessary. We've introduced an [opt-in](https://github.com/reactwg/react-18/discussions/102) mechanism so you can enable them only for unit tests where they are useful and beneficial.
* **No warning about `setState` on unmounted components:** Previously, React warned about memory leaks when you call `setState` on an unmounted component. This warning was added for subscriptions, but people primarily run into it in scenarios where setting state is fine, and workarounds make the code worse. We've [removed](https://github.com/facebook/react/pull/22114) this warning.
* **No suppression of console logs:** When you use Strict Mode, React renders each component twice to help you find unexpected side effects. In React 17, we've suppressed console logs for one of the two renders to make the logs easier to read. In response to [community feedback](https://github.com/facebook/react/issues/21783) about this being confusing, we've removed the suppression. Instead, if you have React DevTools installed, the second log's renders will be displayed in grey, and there will be an option (off by default) to suppress them completely.
* **Improved memory usage:** React now cleans up more internal fields on unmount, making the impact from unfixed memory leaks that may exist in your application code less severe.

### React DOM Server {/*react-dom-server*/}

* **`renderToString`:** Will no longer error when suspending on the server. Instead, it will emit the fallback HTML for the closest `<Suspense>` boundary and then retry rendering the same content on the client. It is still recommended that you switch to a streaming API like `renderToPipeableStream` or `renderToReadableStream` instead.
* **`renderToStaticMarkup`:** Will no longer error when suspending on the server. Instead, it will emit the fallback HTML for the closest `<Suspense>` boundary.

## Changelog {/*changelog*/}

Vous pouvez consulter le [changelog complet ici](https://github.com/facebook/react/blob/main/CHANGELOG.md).
