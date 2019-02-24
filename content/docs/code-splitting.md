---
id: code-splitting
title: Séparation du code
permalink: docs/code-splitting.html
---

## Bundling {#bundling}

La plupart des applications React ont leur fichiers assemblés par des outils tels que [Webpack](https://webpack.js.org/) ou [Browserify](http://browserify.org/). L'assemblage consiste à suivre les fichiers importés et à les regrouper au sein d'un même fichier : un paquet (appelé *bundle* en anglais, que nous utiliserons dans la suite de la page — NdT). Ce bundle peut ensuite être inclus dans une page web pour charger une application entière d'un seul coup.

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

> Remarque :
>
> Vos bundles finiront par être très différents de ceux-là.

Si vous utilisez [Create React App](https://github.com/facebookincubator/create-react-app), [Next.js](https://github.com/zeit/next.js/), [Gatsby](https://www.gatsbyjs.org/) ou un outil similaire, vous bénéficierez d'une configuration de Webpack prête à l'emploi pour créer le bundle de votre application.

Si ce n'est pas le cas, vous devrez configurer la génération de votre bundle vous-même. Consultez les guides [d'installation](https://webpack.js.org/guides/installation/) et de [démarrage](https://webpack.js.org/guides/getting-started/) de la documentation de Webpack comme exemples.

## La séparation du code {#code-splitting}

Créer des bundles est génial, mais au fur et à mesure que votre application grandit, votre bundle va grossir aussi. En particulier si vous intégrez des bibliothèques tierces. Vous devez garder un œil sur le code que vous intégrez dans votre bundle pour éviter de le rendre si lourd que le chargement de votre application prendra beaucoup de temps.

Pour éviter de vous retrouver avec un bundle trop volumineux, il est bon d'anticiper les problèmes et de commencer à fractionner votre bundle. La [séparation du code](https://webpack.js.org/guides/code-splitting/) est une fonctionnalité supportée par les outils de génération de bundles tels que Webpack ou Browserify (via [factor-bundle](https://github.com/browserify/factor-bundle)) qui permet de créer plusieurs bundles pouvant être chargés dynamiquement au moment de l'exécution.

Fractionner votre application peut vous aider à charger à la demande (*lazy-load*) les éléments qui sont nécessaires pour l'utilisateur à un moment donné, ce qui peut améliorer grandement les performances de votre application. Bien que vous n'ayez pas réduit la quantité de code de votre application, vous évitez de charger du code dont l'utilisateur n'aura peut-être jamais besoin, et réduit la quantité de code nécessaire au chargement initial.

## `import()` {#import}

La meilleure façon d'introduire la séparation du code dans votre application est par la syntaxe dynamique `import()`.

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

> Remarque :
>
> La syntaxe dynamique `import()` est une [proposition](https://github.com/tc39/proposal-dynamic-import) ECMAScript (JavaScript) qui ne fait pas partie du standard du langage. Il devrait être accepté dans un avenir proche.

Lorsque Webpack rencontre cette syntaxe, il démarre automatiquement la séparation du code de votre application. Si vous utilisez Create React App, cela est déjà configuré pour vous et vous pouvez [l'utiliser](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#code-splitting) immédiatement. Il est également pris en charge par [Next.js](https://github.com/zeit/next.js/#dynamic-import).

Si vous configurez Webpack vous-même, vous voudrez sans doute lire le [guide sur la séparation du code](https://webpack.js.org/guides/code-splitting/) de Webpack. Votre configuration Webpack devrait vaguement ressembler [à cela](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

Lorsque vous utilisez [Babel](http://babeljs.io/), vous devrez vous assurer que Babel peut analyser la syntaxe dynamique d'import sans la transformer. Pour cela, vous aurez besoin de l'extension [babel-plugin-syntax-dynamic-import](https://yarnpkg.com/en/package/babel-plugin-syntax-dynamic-import).

## `React.lazy` {#reactlazy}

> Remarque :
>
> `React.lazy` et Suspense ne sont pas encore disponibles pour le rendu côté serveur. Si vous souhaitez fractionner votre code dans une application rendue côté serveur, nous vous recommandons d'utiliser [Loadable Components](https://github.com/smooth-code/loadable-components). Il contient un [guide pratique pour fractionner le bundle avec un rendu côté serveur](https://github.com/smooth-code/loadable-components/blob/master/packages/server/README.md).

La fonction `React.lazy` vous permet d'avoir un rendu d'import dynamique pour un composant classique.

**Avant :**

```js
import OtherComponent from './OtherComponent';

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

**Après :**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <OtherComponent />
    </div>
  );
}
```

Cela chargera automatiquement le bundle contenant le composant `OtherComponent` quand celui-ci doit être rendu.

`React.lazy` prend une fonction qui doit appeller un `import()` dynamique. Cela doit renvoyer une `Promise` résolue en un module avec un export par défault contenant un composant React.

### Suspense {#suspense}

Si le module contenant le composant `OtherComponent` n'est pas encore chargé au moment du rendu de `MyComponent`, alors nous devons afficher un contenu de repli en attendant qu'il soit chargé — comme un indicateur de chargement. Cela se fait en utilisant le composant `Suspense`.

```js
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

La propriété  `fallback` accepte n'importe quel élément React que vous souhaitez utiliser pour le rendu en attendant le chargement du composant. Vous pouvez placer le composant `Suspense` n'importe où au-dessus du composant chargé à la demande. Vous pouvez également envelopper plusieurs composants chargés à la demande avec un seul composant `Suspense`.

```js
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

### Limites d'erreur {#error-boundaries}

Si le chargement de l'autre module échoue (par exemple à cause d'une défaillance réseau), une erreur sera générée. Vous pouvez gérer ces erreurs pour donner une expérience utilisateur agréable et gérer la récupération avec [les limites d'erreur (*Error Boundaries*)](/docs/error-boundaries.html). Une fois que vous avez créé votre limite d'erreur, vous pouvez l'utiliser n'importe où au-dessus de vos composants chargés à la demande pour afficher un état d'erreur lors d'une défaillance réseau.

```js
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

## Séparation du code basé sur les routes {#route-based-code-splitting}

Décider où introduire la séparation du code dans votre application peut être délicat. Vous voulez être sûr de choisir les endroits qui fractionnent les bundles de manière uniforme, sans perturber l'expérience utilisateur.

Un bon endroit pour commencer est au niveau des routes. La plupart des gens sur le web sont habitués aux transitions entre les pages qui prennent du temps à charger. Vous aurez également tendance à refaire le rendu de la page entière d'une traite, de sorte qu'il est peu probable que vos utilisateurs interagissent avec d'autres éléments de la page en même temps.

Voici un exemple de configuration de séparation du code basé sur les routes, à intégrer dans votre application en utilisant des bibliothèques telles que [React Router](https://reacttraining.com/react-router/) avec `React.lazy`.

```js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Chargement...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

## Exports nommés {#named-exports}

`React.lazy` ne supporte actuellement que les exports par défaut. Si le module que vous souhaitez importer utilise des exports nommés, vous pouvez créer un module intermédiaire qui les réexportera par défaut. Cela garantit que le *tree shaking* ([procédé permettant de supprimer le code mort](https://developer.mozilla.org/fr/docs/Glossaire/Tree_shaking) — NdT) continue de fonctionner et que vous n'intégrez pas de composants inutilisés.

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
