---
title: Ajouter React à un projet existant
---

<Intro>

Si vous souhaitez apporter de l'interactivité à votre projet existant, vous n'avez pas besoin de le réécrire entièrement en React. Ajoutez simplement React à votre pile technologique existante et affichez des composants React interactifs où vous le souhaitez.

</Intro>

<Note>

**Vous aurez besoin d'installer [Node.js](https://nodejs.org/fr/) pour le développement local.** Bien que vous puissiez [essayer React](/learn/installation#try-react) en ligne ou avec une simple page HTML, la plupart des outils JavaScript que vous souhaiterez utiliser pour le développement nécessitent en pratique Node.js.

</Note>

## Utiliser React pour une portion entière de votre site web existant {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

Supposons que vous ayez une application web existante sur `example.com` développée avec une autre technologie côté serveur (comme Rails) et que vous souhaitiez implémenter toutes les routes commençant par `example.com/some-app/` entièrement avec React.

Voici comment nous vous recommandons de procéder :

1. **Construisez la partie React de votre appli** en utilisant l'un des [frameworks basés sur React](/learn/start-a-new-react-project).
2. **Indiquez `/some-app` comme *chemin de base*** dans la configuration de votre framework (voici comment faire avec [Next.js](https://nextjs.org/docs/api-reference/next.config.js/basepath) ou [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Configurez votre serveur ou un proxy** de manière à ce que toutes les requêtes sous `/some-app/` soient traitées par votre application React.

Ça garantit que la partie React de votre application peut [bénéficier de tout un tas de bonnes pratiques](/learn/start-a-new-react-project#can-i-use-react-without-a-framework) intégrées à ces frameworks.

De nombreux frameworks basés sur React sont des frameworks full-stack qui permettent à votre application React de tirer parti du serveur. Cependant, vous pouvez utiliser la même approche même si vous ne pouvez pas ou ne souhaitez pas exécuter JavaScript côté serveur. Dans ce cas, servez plutôt l'export HTML/CSS/JS ([`next export`](https://nextjs.org/docs/advanced-features/static-html-export) pour Next.js, résultat par défaut pour Gatsby) à l'emplacement `/some-app/`.

## Utiliser React pour une partie de votre page existante {/*using-react-for-a-part-of-your-existing-page*/}

Supposons que vous ayez une page existante construite avec une autre technologie (soit côté serveur, comme Rails ; soit côté client, comme Backbone), et que vous souhaitiez afficher des composants React interactifs à un endroit spécifique de cette page. C'est une façon courante d'intégrer React--en fait, c'est ainsi que la plupart des utilisations de React étaient mises en place chez Meta pendant de nombreuses années !

Vous pouvez le faire en deux étapes :

1. **Mettez en place un environnement JavaScript** qui vous permette d'utiliser la [syntaxe JSX](/learn/writing-markup-with-jsx), de diviser votre code en modules avec la syntaxe [`import`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/export), et d'utiliser des packages (par exemple, React) provenant du référentiel de modules [npm](https://www.npmjs.com/).
2. **Affichez vos composants React** là où vous souhaitez les voir sur la page.

L'approche exacte dépend de la configuration de votre page existante, nous allons donc passer en revue quelques détails.

### Étape 1 : mettez en place un environnement JavaScript modulaire {/*step-1-set-up-a-modular-javascript-environment*/}

Un environnement JavaScript modulaire vous permet d'écrire vos composants React dans des fichiers individuels, plutôt que d'écrire tout votre code dans un seul fichier. Il vous permet également d'utiliser tous les merveilleux modules publiés par d'autres personnes sur le référentiel [npm](https://www.npmjs.com/)--y compris React lui-même ! La manière de procéder dépend de votre configuration existante :

* **Si votre application est déjà divisée en fichiers qui utilisent des déclarations `import`**, essayez d'utiliser la configuration que vous avez déjà. Vérifiez si l'écriture de `<div />` dans votre code JS provoque une erreur de syntaxe.  Si tel est le cas, vous devrez peut-être [transformer votre code JavaScript avec Babel](https://babeljs.io/setup), et activer le [préréglage Babel React](https://babeljs.io/docs/babel-preset-react) pour utiliser JSX.

* **Si votre application n'a pas de configuration existante pour la compilation des modules JavaScript**, mettez-en une en place avec [Vite](https://vitejs.dev/). La communauté Vite propose de [nombreuses intégrations avec des frameworks backend](https://github.com/vitejs/awesome-vite#integrations-with-backends), notament Rails, Django et Laravel. Si votre framework backend ne figure pas dans leur liste, [suivez ce guide](https://vitejs.dev/guide/backend-integration.html) pour intégrer manuellement les builds Vite à votre backend.

Pour vérifier si votre configuration fonctionne, exécutez cette commande dans le dossier de votre projet :

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

Ensuite, ajoutez ces lignes de code en haut de votre fichier JavaScript principal (il pourrait s'appeler `index.js` ou `main.js`) :

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

```js src/index.js active
import { createRoot } from 'react-dom/client';

// Effacez le contenu HTML existant
document.body.innerHTML = '<div id="app"></div>';

// Affichez plutôt votre composant React
const root = createRoot(document.getElementById('app'));
root.render(<h1>Bonjour tout le monde</h1>);
```

</Sandpack>

Si tout le contenu de votre page a été remplacé par un « Bonjour tout le monde », ça signifie que tout fonctionne ! Continuez à lire.

<Note>

Intégrer pour la première fois un environnement JavaScript modulaire dans un projet existant pour la première fois peut sembler intimidant, mais ça en vaut la peine ! Si vous êtes bloqué, essayez nos [ressources communautaires](/community) ou discutez sur [le forum Vite](https://chat.vitejs.dev/).

</Note>

### Étape 2 : affichez les composants React n'importe où sur la page. {/*step-2-render-react-components-anywhere-on-the-page*/}

Dans l'étape précédente, vous avez placé ce code en haut de votre fichier principal :

```js
import { createRoot } from 'react-dom/client';

// Effacez le contenu HTML existant
document.body.innerHTML = '<div id="app"></div>';

// Affichez plutôt votre composant React
const root = createRoot(document.getElementById('app'));
root.render(<h1>Bonjour tout le monde</h1>);
```

Bien sûr, vous ne voulez pas réellement effacer le contenu HTML existant !

Supprimez ce code.

Vous souhaitez probablement plutôt afficher vos composants React à des emplacements spécifiques dans votre HTML. Ouvrez votre page HTML (ou les modèles côté serveur qui la génèrent) et ajoutez un attribut [`id`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/id) unique à la balise de votre choix, par exemple :

```html
<!-- ... quelque part dans votre html ... -->
<nav id="navigation"></nav>
<!-- ... plus de html ... -->
```

Ça vous permettra de trouver cet élément HTML avec [`document.getElementById`](https://developer.mozilla.org/fr/docs/Web/API/Document/getElementById) et de le transmettre à [`createRoot`](/reference/react-dom/client/createRoot) afin de pouvoir afficher votre propre composant React à l'intérieur :

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>Mon appli</title></head>
  <body>
    <p>Ce paragraphe fait partie du HTML.</p>
    <nav id="navigation"></nav>
    <p>Ce paragraphe fait également partie du HTML.</p>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Implémentez une véritable barre de navigation
  return <h1>React vous dit bonjour !</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

Voyez comment le contenu HTML d'origine de `index.html` est préservé, alors que votre propre composant React `NavigationBar` apparaît désormais à l'intérieur de la balise `<nav id="navigation">` de votre HTML. Allez voir [la documentation sur l'utilisation de `createRoot`](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) pour en savoir plus sur l'affichage des composants React à l'intérieur d'une page HTML existante.

Lorsque vous adoptez React dans un projet existant, il est courant de commencer par de petits composants interactifs (comme des boutons), puis de progressivement « monter en gamme » jusqu'à ce que finalement l'ensemble de votre page soit construit avec React. Si vous en arrivez là, nous vous recommandons de migrer vers [un framework React](/learn/start-a-new-react-project) pour tirer le meilleur parti de React.

## Utiliser React Native dans une application mobile native existante {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) peut également être intégré progressivement dans des applis natives existantes. Si vous avez une appli native existante pour Android (Java ou Kotlin) ou iOS (Objective-C ou Swift), [suivez ce guide](https://reactnative.dev/docs/integration-with-existing-apps) pour ajouter un écran React Native à celle-ci.
