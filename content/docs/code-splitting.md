---
id: code-splitting
title: Découpage dynamique de code
permalink: docs/code-splitting.html
---

## Bundling {#bundling}

<<<<<<< HEAD
La plupart des applications React empaquetteront leur fichiers au moyen d’outils tels que [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) ou [Browserify](http://browserify.org/). L’empaquetage *(bundling, NdT)* consiste à suivre le graphe des importations dans les fichiers, et à les regrouper au sein d'un même fichier : un *bundle* *(terme que nous utiliserons sans italiques dans la suite de la page, NdT)*. Ce bundle peut ensuite être inclus dans une page web pour charger une application entière d'un seul coup.
=======
Most React apps will have their files "bundled" using tools like [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) or [Browserify](http://browserify.org/). Bundling is the process of following imported files and merging them into a single file: a "bundle". This bundle can then be included on a webpage to load an entire app at once.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

#### Exemple {#example}

**Application :**

```js
// app.js
import { add } from './math.js';

console.log(add(16, 26)); // 42
```

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

**Bundle :**

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

> Remarque
>
> Vos bundles finiront par être très différents de ceux-là.

<<<<<<< HEAD
Si vous utilisez [Create React App](https://create-react-app.dev/), [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/) ou un outil similaire, vous bénéficierez d'une configuration de Webpack prête à l'emploi pour créer le bundle de votre application.

Si ce n'est pas le cas, vous devrez configurer vous-même la génération de votre bundle. Consultez les guides [d'installation](https://webpack.js.org/guides/installation/) et de [démarrage](https://webpack.js.org/guides/getting-started/) de Webpack.
=======
If you're using [Create React App](https://create-react-app.dev/), [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/), or a similar tool, you will have a Webpack setup out of the box to bundle your app.

If you aren't, you'll need to set up bundling yourself. For example, see the [Installation](https://webpack.js.org/guides/installation/) and [Getting Started](https://webpack.js.org/guides/getting-started/) guides on the Webpack docs.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

## Le découpage dynamique de code {#code-splitting}

<<<<<<< HEAD
Les bundles c’est génial, mais au fur et à mesure que votre application grandit, votre bundle va grossir aussi. Surtout si vous intégrez de grosses bibliothèques tierces. Vous devez garder un œil sur le code que vous intégrez dans votre bundle pour éviter de le rendre si lourd que le chargement de votre application prendrait beaucoup de temps.

Pour éviter de vous retrouver avec un bundle trop volumineux, il est bon d'anticiper les problèmes et de commencer à fractionner votre bundle. Le découpage dynamique de code est une fonctionnalité prise en charge par des empaqueteurs tels que [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting) ou Browserify (via [factor-bundle](https://github.com/browserify/factor-bundle)), qui permet de créer plusieurs bundles pouvant être chargés dynamiquement au moment de l'exécution.

Fractionner votre application peut vous aider à charger à la demande *(lazy-load, NdT)* les parties qui sont nécessaires pour l'utilisateur à un moment donné, ce qui peut améliorer considérablement les performances de votre application. Bien que vous n'ayez pas réduit la quantité de code de votre application, vous évitez de charger du code dont l'utilisateur n'aura peut-être jamais besoin, et réduisez la quantité de code nécessaire au chargement initial.

## `import()` {#import}

La meilleure façon d'introduire du découpage dynamique de code dans votre application consiste à utiliser la syntaxe d’`import()` dynamique.
=======
Bundling is great, but as your app grows, your bundle will grow too. Especially if you are including large third-party libraries. You need to keep an eye on the code you are including in your bundle so that you don't accidentally make it so large that your app takes a long time to load.

To avoid winding up with a large bundle, it's good to get ahead of the problem and start "splitting" your bundle. Code-Splitting is a feature
supported by bundlers like [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting) and Browserify (via [factor-bundle](https://github.com/browserify/factor-bundle)) which can create multiple bundles that can be dynamically loaded at runtime.

Code-splitting your app can help you "lazy-load" just the things that are currently needed by the user, which can dramatically improve the performance of your app. While you haven't reduced the overall amount of code in your app, you've avoided loading code that the user may never need, and reduced the amount of code needed during the initial load.

## `import()` {#import}

The best way to introduce code-splitting into your app is through the dynamic `import()` syntax.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

**Avant :**

```js
import { add } from './math';

console.log(add(16, 26));
```

**Après :**

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

<<<<<<< HEAD
Lorsque Webpack rencontre cette syntaxe, il commence automatiquement à découper le code de votre application. Si vous utilisez Create React App, c’est déjà configuré pour vous et vous pouvez [l’utiliser](https://facebook.github.io/create-react-app/docs/code-splitting) immédiatement. C’est également pris en charge de base par [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

Si vous configurez Webpack vous-même, vous voudrez sans doute lire le [guide sur le découpage dynamique de code](https://webpack.js.org/guides/code-splitting/) de Webpack. Votre configuration Webpack devrait vaguement ressembler [à ça](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

Si vous utilisez [Babel](http://babeljs.io/), vous devrez vous assurer que Babel peut comprendre la syntaxe d'import dynamique mais ne la transforme pas. Pour cela, vous aurez besoin de l'extension [babel-plugin-syntax-dynamic-import](https://yarnpkg.com/en/package/babel-plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

> Remarque
>
> `React.lazy` et Suspense ne sont pas encore disponibles pour le rendu côté serveur. Si vous souhaitez fractionner votre code dans une application rendue côté serveur, nous vous recommandons d'utiliser [Loadable Components](https://github.com/gregberge/loadable-components). Il propose un [guide pratique pour fractionner le bundle avec un rendu côté serveur](https://loadable-components.com/docs/server-side-rendering/).

La fonction `React.lazy` vous permet d'afficher un composant importé dynamiquement comme n’importe quel autre composant.
=======
When Webpack comes across this syntax, it automatically starts code-splitting your app. If you're using Create React App, this is already configured for you and you can [start using it](https://create-react-app.dev/docs/code-splitting/) immediately. It's also supported out of the box in [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

If you're setting up Webpack yourself, you'll probably want to read Webpack's [guide on code splitting](https://webpack.js.org/guides/code-splitting/). Your Webpack config should look vaguely [like this](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

When using [Babel](https://babeljs.io/), you'll need to make sure that Babel can parse the dynamic import syntax but is not transforming it. For that you will need [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

The `React.lazy` function lets you render a dynamic import as a regular component.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

**Avant :**

```js
import OtherComponent from './OtherComponent';
```

**Après :**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

Ça chargera automatiquement le bundle contenant le composant `OtherComponent` quand celui-ci sera rendu pour la première fois.

`React.lazy` prend une fonction qui doit appeler un `import()` dynamique. Ça doit renvoyer une `Promise` qui s’accomplit avec un module dont l’export par défaut contient un composant React.

Le composant importé dynamiquement devrait être exploité dans un composant `Suspense`, qui nous permet d'afficher un contenu de repli (ex. un indicateur de chargement) en attendant que ce module soit chargé.

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Chargement...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

La prop  `fallback` accepte n'importe quel élément React que vous souhaitez afficher en attendant le chargement du composant. Vous pouvez placer le composant `Suspense` n'importe où au-dessus du composant chargé à la demande. Vous pouvez même envelopper plusieurs composants chargés à la demande avec un seul composant `Suspense`.

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Chargement...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

<<<<<<< HEAD
### Périmètres d'erreurs {#error-boundaries}
=======
### Avoiding fallbacks {#avoiding-fallbacks}
Any component may suspend as a result of rendering, even components that were already shown to the user. In order for screen content to always be consistent, if an already shown component suspends, React has to hide its tree up to the closest `<Suspense>` boundary. However, from the user's perspective, this can be disorienting.

Consider this tab switcher:

```js
import React, { Suspense } from 'react';
import Tabs from './Tabs';
import Glimmer from './Glimmer';

const Comments = React.lazy(() => import('./Comments'));
const Photos = React.lazy(() => import('./Photos'));

function MyComponent() {
  const [tab, setTab] = React.useState('photos');
  
  function handleTabSelect(tab) {
    setTab(tab);
  };

  return (
    <div>
      <Tabs onTabSelect={handleTabSelect} />
      <Suspense fallback={<Glimmer />}>
        {tab === 'photos' ? <Photos /> : <Comments />}
      </Suspense>
    </div>
  );
}

```

In this example, if tab gets changed from `'photos'` to `'comments'`, but `Comments` suspends, the user will see a glimmer. This makes sense because the user no longer wants to see `Photos`, the `Comments` component is not ready to render anything, and React needs to keep the user experience consistent, so it has no choice but to show the `Glimmer` above.

However, sometimes this user experience is not desirable. In particular, it is sometimes better to show the "old" UI while the new UI is being prepared. You can use the new [`startTransition`](/docs/react-api.html#starttransition) API to make React do this:

```js
function handleTabSelect(tab) {
  startTransition(() => {
    setTab(tab);
  });
}
```

Here, you tell React that setting tab to `'comments'` is not an urgent update, but is a [transition](/docs/react-api.html#transitions) that may take some time. React will then keep the old UI in place and interactive, and will switch to showing `<Comments />` when it is ready. See [Transitions](/docs/react-api.html#transitions) for more info.

### Error boundaries {#error-boundaries}
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

Si le chargement de l'autre module échoue (par exemple à cause d'une défaillance réseau), une erreur sera levée. Vous pouvez gérer ces erreurs pour assurer une expérience utilisateur agréable et retomber sur vos pieds avec [les périmètres d'erreurs](/docs/error-boundaries.html) *(Error boundaries, NdT)*. Une fois que vous avez créé votre périmètre d'erreur, vous pouvez l'utiliser n'importe où au-dessus de vos composants chargés à la demande pour afficher un état d'erreur lors d'une défaillance réseau.

```js
import React, { Suspense } from 'react';
import MyErrorBoundary from './MyErrorBoundary';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Chargement...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

## Découpage dynamique de code basé sur les routes {#route-based-code-splitting}

<<<<<<< HEAD
Décider où introduire un découpage dynamique de code dans votre application peut s'avérer délicat. Vous voulez être sûr·e de choisir des endroits qui fractionnent les bundles de manière uniforme, sans perturber l'expérience utilisateur.

Les routes sont un bon endroit pour commencer. La plupart des gens sont habitués sur le web à ce que les transitions entre les pages mettent du temps à charger. Vous aurez également tendance à ré-afficher la page entière d'un bloc, de sorte qu'il est peu probable que vos utilisateurs interagissent avec d'autres éléments de la page pendant ce temps-là.

Voici un exemple de configuration du découpage dynamique de code basé sur les routes de votre application, qui utilise une bibliothèque comme [React Router](https://reacttraining.com/react-router/) avec `React.lazy`.
=======
Deciding where in your app to introduce code splitting can be a bit tricky. You want to make sure you choose places that will split bundles evenly, but won't disrupt the user experience.

A good place to start is with routes. Most people on the web are used to page transitions taking some amount of time to load. You also tend to be re-rendering the entire page at once so your users are unlikely to be interacting with other elements on the page at the same time.

Here's an example of how to setup route-based code splitting into your app using libraries like [React Router](https://reactrouter.com/) with `React.lazy`.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
<<<<<<< HEAD
    <Suspense fallback={<div>Chargement...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
=======
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d
    </Suspense>
  </Router>
);
```

## Exports nommés {#named-exports}

Pour le moment, `React.lazy` ne prend en charge que les exports par défaut. Si le module que vous souhaitez importer utilise des exports nommés, vous pouvez créer un module intermédiaire qui réexportera le composant voulu en tant qu’export par défaut. Cela garantit que le *tree shaking* *([procédé permettant de supprimer les exports non-exploités](https://developer.mozilla.org/fr/docs/Glossaire/Tree_shaking), NdT)* continuera à fonctionner et que vous n’embarquerez pas de composants inutilisés.

```js
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;
```

```js
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```

```js
// MyApp.js
import React, { lazy } from 'react';
const MyComponent = lazy(() => import("./MyComponent.js"));
```
