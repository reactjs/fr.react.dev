---
title: Ajouter React à un Projet Existant
---

<Intro>

Si vous souhaitez apporter de l'interactivité à votre projet existant, vous n'avez pas besoin de le réécrire entièrement en React. Ajoutez simplement React à votre pile technologique existante et affichez des composants React interactifs où vous le souhaitez.

</Intro>

<Note>

**Vous devez installer [Node.js](https://nodejs.org/en/) pour le développement local.** Bien que vous puissiez [essayer React](/learn/installation#try-react) en ligne ou avec une simple page HTML, dans la réalité, la plupart des outils JavaScript que vous souhaiterez utiliser pour le développement nécessitent Node.js.

</Note>

## Utiliser React pour une sous-route entière de votre site web existant {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

Supposons que vous ayez une application web existante sur `example.com` développée avec une autre technologie côté serveur (comme Rails) et que vous souhaitiez implémenter toutes les routes commençant par `example.com/some-app/` entièrement avec React.

Voici comment nous vous recommandons de procéder:

1. **Construisez la partie React de votre application** en utilisant l'un des [Frameworks basés sur React](/learn/start-a-new-react-project).
2. **Spécifiez `/some-app` comme le *chemin de base*** dans la configuration de votre framework (voici comment le faire avec: [Next.js](https://nextjs.org/docs/api-reference/next.config.js/basepath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Configurez votre serveur ou un proxy** de manière à ce que toutes les requêtes sous `/some-app/` soient traitées par votre application React.

Cela garantit que la partie React de votre application peut [bénéficier des bonnes pratiques](/learn/start-a-new-react-project#can-i-use-react-without-a-framework) intégrées à ces frameworks.

De nombreux frameworks basés sur React sont des frameworks full-stack qui permettent à votre application React de tirer parti du serveur. Cependant, vous pouvez utiliser la même approche même si vous ne pouvez pas ou ne souhaitez pas exécuter JavaScript côté serveur. Dans ce cas, servez plutôt l'exportation HTML/CSS/JS ([`next export`](https://nextjs.org/docs/advanced-features/static-html-export) pour Next.js, par défaut pour Gatsby) à l'emplacement `/some-app/`.

## Utiliser React pour une partie de votre page existante {/*using-react-for-a-part-of-your-existing-page*/}

Supposons que vous avez une page existante construite avec une autre technologie (soit une technologie côté serveur comme Rails, soit une technologie côté client comme Backbone), et que vous souhaitiez afficher des composants React interactifs à un endroit spécifique de cette page. C'est une façon courante d'intégrer React - en fait, c'est ainsi que la plupart des utilisations de React étaient envisagées chez Meta pendant de nombreuses années !

Vous pouvez le faire en deux étapes :

1. **Mettre en place un environnement JavaScript** qui vous permet d'utiliser la [syntaxe JSX](/learn/writing-markup-with-jsx), de diviser votre code en modules avec la syntaxe [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export), et d'utiliser des packages (par exemple, React) provenant du registre des packages [npm](https://www.npmjs.com/).
2. **Afficher vos composants React** là où vous souhaitez les voir sur la page.

L'approche exacte dépend de la configuration de votre page existante, nous allons donc passer en revue quelques détails.

### Étape 1 : Mettre en place un environnement JavaScript modulaire {/*step-1-set-up-a-modular-javascript-environment*/}

Un environnement JavaScript modulaire vous permet d'écrire vos composants React dans des fichiers individuels, plutôt que d'écrire tout votre code dans un seul fichier. Il vous permet également d'utiliser tous les merveilleux packages publiés par d'autres développeurs sur le registre [npm](https://www.npmjs.com/) y compris React lui-même ! La manière de le faire dépend de votre configuration existante :

* **Si votre application est déjà divisée en fichiers qui utilisent des déclarations `import`,** essayez d'utiliser la configuration que vous avez déjà. Vérifiez si l'écriture de `<div />` dans votre code JS provoque une erreur de syntaxe.  Si cela provoque une erreur de syntaxe, vous devrez peut-être [transformer votre code JavaScript avec Babel](https://babeljs.io/setup), et activer le [préréglage Babel React ](https://babeljs.io/docs/babel-preset-react) pour utiliser JSX.

* **Si votre application n'a pas de configuration existante pour la compilation des modules JavaScript,** mettez-la en place avec [Vite](https://vitejs.dev/). La communauté Vite propose de [nombreuses intégrations avec des frameworks backend](https://github.com/vitejs/awesome-vite#integrations-with-backends), tels que Rails, Django et Laravel. Si votre framework backend ne figure pas dans la liste, [suivez ce guide](https://vitejs.dev/guide/backend-integration.html) pour intégrer manuellement les builds Vite à votre backend.

Pour vérifier si votre configuration fonctionne, exécutez cette commande dans le dossier de votre projet :

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

Ensuite, ajoutez ces lignes de code en haut de votre fichier JavaScript principal (il pourrait s'appeler `index.js` ou `main.js`):

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
  <head><title>Mon appli</title></head>
  <body>
    <!-- Le contenu actuel de votre page (dans cet exemple, il est remplacé) -->
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';

// Effacez le contenu HTML existant
document.body.innerHTML = '<div id="app"></div>';

// Affichez plutôt votre composant React
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

Si tout le contenu de votre page a été remplacé par un "Hello, world!", tout fonctionne ! Continuez à lire.

<Note>

Intégrer un environnement JavaScript modulaire dans un projet existant pour la première fois peut sembler intimidant, mais cela en vaut la peine ! Si vous êtes bloqué, essayez nos [ressources communautaires](/community) ou discutez sur [Vite Chat](https://chat.vitejs.dev/).

</Note>

### Étape 2 : Afficher les composants React n'importe où sur la page. {/*step-2-render-react-components-anywhere-on-the-page*/}

Dans l'étape précédente, vous avez placé ce code en haut de votre fichier principal :

```js
import { createRoot } from 'react-dom/client';

// Effacez le contenu HTML existant
document.body.innerHTML = '<div id="app"></div>';

// Affichez plutôt votre composant React
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

Bien sûr, vous ne voulez pas réellement effacer le contenu HTML existant !

Delete this code.

Instead, you probably want to render your React components in specific places in your HTML. Open your HTML page (or the server templates that generate it) and add a unique [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) attribute to any tag, for example:

```html
<!-- ... somewhere in your html ... -->
<nav id="navigation"></nav>
<!-- ... more html ... -->
```

This lets you find that HTML element with [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) and pass it to [`createRoot`](/reference/react-dom/client/createRoot) so that you can render your own React component inside:

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>This paragraph is a part of HTML.</p>
    <nav id="navigation"></nav>
    <p>This paragraph is also a part of HTML.</p>
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Actually implement a navigation bar
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

Notice how the original HTML content from `index.html` is preserved, but your own `NavigationBar` React component now appears inside the `<nav id="navigation">` from your HTML. Read the [`createRoot` usage documentation](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) to learn more about rendering React components inside an existing HTML page.

When you adopt React in an existing project, it's common to start with small interactive components (like buttons), and then gradually keep "moving upwards" until eventually your entire page is built with React. If you ever reach that point, we recommend migrating to [a React framework](/learn/start-a-new-react-project) right after to get the most out of React.

## Using React Native in an existing native mobile app {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) can also be integrated into existing native apps incrementally. If you have an existing native app for Android (Java or Kotlin) or iOS (Objective-C or Swift), [follow this guide](https://reactnative.dev/docs/integration-with-existing-apps) to add a React Native screen to it.
