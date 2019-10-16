---
id: add-react-to-a-website
title: Ajouter React à un site web
permalink: docs/add-react-to-a-website.html
redirect_from:
  - "docs/add-react-to-an-existing-app.html"
prev: getting-started.html
next: create-a-new-react-app.html
---

Utiliser React en fonction de vos besoins

React a été conçu dès le départ pour une adoption progressive, et **vous pouvez utiliser React _a minima_ ou autant que nécessaire.** Peut-être souhaitez-vous juste ajouter un peu d'interactivité à une page existante. Les composants React sont une bonne solution pour ça.

La majorité des sites web ne sont pas, et n'ont pas besoin d'être, des applications web monopages *(Single-Page Application ou plus simplement SPA, NdT)*. **Avec juste quelques lignes de code et sans outillage particulier**, vous pouvez essayer React sur une petite partie de votre site web. Vous pourrez par la suite ajouter des composants supplémentaires ou limiter React à quelques éléments dynamiques.

---

- [Ajouter React en une minute](#add-react-in-one-minute)
- [Optionnel : Essayer React avec JSX](#optional-try-react-with-jsx) (aucun _bundler_ nécessaire !)

## Ajouter React en une minute {#add-react-in-one-minute}

Dans cette partie, nous allons voir comment ajouter un composant React à une page HTML existante. Vous pouvez suivre les étapes avec votre propre site web, ou avec une page HTML vide pour vous entraîner.

Pas besoin d'outils compliqués ni de faire des installations : **pour suivre cette section, vous avez juste besoin d'une connexion à internet et d'une minute de votre temps.**

Optionnel : [Télécharger l'exemple complet (2 Ko zippé)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)

### Étape 1 : ajouter un conteneur DOM à votre HTML {#step-1-add-a-dom-container-to-the-html}

Pour commencer, ouvrez la page HTML que vous souhaitez modifier. Ajoutez une balise `<div>` vide pour indiquer l'endroit dans lequel vous souhaitez afficher quelque chose avec React. Par exemple :

```html{3}
<!-- ... code HTML existant ... -->

<div id="like_button_container"></div>

<!-- ... code HTML existant ... -->
```

L'attribut `id` de votre `<div>`, qui est unique, va vous permettre de manipuler cette balise depuis le code JavaScript afin d'afficher un composant React dans celle-ci.

>Astuce
>
>Vous pouvez placer une telle `<div>` « conteneur » **où vous le souhaitez** dans la balise `<body>`. Vous pouvez d’ailleurs avoir autant de conteneurs DOM indépendants que vous le souhaitez dans la même page. Il sont généralement vides, car React remplacera leur contenu existant de toutes façons.

### Étape 2 : ajouter les balises de script {#step-2-add-the-script-tags}

Ensuite, ajoutez trois balises `<script>` à votre page HTML, juste avant la fermeture de la balise `</body>` :

```html{6,7,10}
  <!-- ... autres contenus HTML ... -->

  <!-- Charge React -->
  <!-- Remarque : pour le déploiement, remplacez "development.js"
       par "production.min.js" -->
  <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>

  <!-- Charge notre composant React -->
  <script src="like_button.js"></script>
</body>
```

Les deux premières balises permettent de charger React, alors que la troisième charge le code de votre composant.

### Étape 3 : créer un composant React {#step-3-create-a-react-component}

Créez un fichier nommé `like_button.js` dans le même dossier que votre page HTML.

Ouvrez et copiez **[le code de démarrage](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** et collez son contenu dans votre fichier.

>Astuce
>
>Ce code définit un composant appelé `LikeButton`. Ne vous en faites pas si vous ne comprenez pas son code tout de suite, nous aborderons les facettes de React ultérieurement dans notre [tutoriel pratique](/tutorial/tutorial.html) et dans le [guide des fondamentaux](/docs/hello-world.html). Pour le moment, essayons simplement de l'afficher à l’écran !

Ajoutez deux lignes à la fin de `like_button.js`, après **[le code de démarrage](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** :

```js{3,4}
// ... le code de démarrage que vous avez collé ...

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);
```

Ces deux lignes de code vont remplacer le contenu de la `<div>` que nous avons ajoutée dans la première étape. Ainsi elles afficheront notre composant React sous forme de bouton « J’aime ».

### Et voilà ! {#thats-it}

Il n'y a pas de quatrième étape. **Vous venez tout juste d'ajouter votre premier composant React à votre site web.**

Pour plus d'astuces concernant l'intégration de React, n'hésitez pas à consulter les prochaines sections.

**[Voir le code source intégral de l'exemple](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

**[Télécharger le code source intégral de l'exemple (2 Ko zippé)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)**

### Astuce : réutiliser un composant {#tip-reuse-a-component}

Généralement, on souhaite afficher des composants React à plusieurs endroits d'une page HTML. Voici un exemple qui affiche le bouton « J’aime » à trois reprises et lui fournit quelques données :

[Voir le code source intégral de l'exemple](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda)

[Télécharger le code source intégral de l'exemple (2 Ko zippé)](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/9d0dd0ee941fea05fd1357502e5aa348abb84c12.zip)

>Remarque
>
>Cette solution est souvent utilisée lorsque les éléments de React doivent être isolés les uns des autres. Il est cependant plus facile d'utiliser le principe de [composition de composants](/docs/components-and-props.html#composing-components) au sein de votre code React.

### Astuce : minifier votre JavaScript pour la production {#tip-minify-javascript-for-production}

Avant de déployer votre site web en production, gardez à l'esprit qu'un JavaScript non-minifié risque de ralentir significativement le chargement de la page pour vos utilisateurs.

Si vous minifiez déjà vos scripts applicatifs et si vous vous assurez de référencer les versions de React dont les noms se terminent en `production.min.js`, **votre site sera prêt pour la production** :

```js
<script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script>
```

Si vous n'avez pas de minification déjà en place pour vos scripts, voici [une façon de faire](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).

## Optionnel : essayer React avec JSX {#optional-try-react-with-jsx}

Dans les exemples ci-dessus, nous utilisions uniquement les fonctionnalités prises en charge nativement par les navigateurs. C'est pourquoi nous appelions une fonction JavaScript pour indiquer à React ce qu'il fallait afficher :

```js
const e = React.createElement;

// Affiche un bouton « J’aime »
return e(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'J’aime'
);
```

Néanmoins, React nous offre aussi la possibilité d'utiliser plutôt [JSX](/docs/introducing-jsx.html).

```js
// Affiche un bouton « J’aime »
return (
  <button onClick={() => this.setState({ liked: true })}>
    J’aime
  </button>
);
```

Ces deux extraits de code sont équivalents. Même si la syntaxe **JSX est [complètement optionnelle](/docs/react-without-jsx.html)**, la plupart des développeur·euse·s React la trouvent très pratique pour écrire du code  (avec React ou même avec d'autres bibliothèques).

Vous pouvez tester JSX en utilisant un [convertisseur en ligne](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.4.3).

### Essayer JSX en un clin d’œil {#quickly-try-jsx}

La façon la plus simple et rapide de tester JSX dans votre projet est d'ajouter la balise `<script>` ci-dessous à votre page :

```html
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

Vous pouvez désormais utiliser JSX dans les fichiers chargés par n'importe quelle balise `<script>` simplement en lui ajoutant l'attribut `type="text/babel"`. Vous pouvez télécharger et tester cet exemple contenant un [fichier HTML utilisant JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html).

Cette approche est acceptable pour se former ou réaliser des démos simples. Cependant, elle va ralentir l'affichage de votre site, elle n'est donc **pas adaptée pour la production**. Lorsque vous serez prêt·e à aller plus loin, supprimez la balise `<script>` et l'attribut `type="text/babel"` que vous venez d'ajouter. Dans la section suivante, nous verrons plutôt comment configurer le préprocesseur JSX afin de convertir automatiquement toutes les balises `<script>`.

### Ajouter JSX à votre projet {#add-jsx-to-a-project}

L'ajout de JSX à votre projet ne nécessite pas d'outils compliqués comme un _bundler_ ou un serveur de développement. Cela ressemble plus **à l'ajout d'un préprocesseur CSS**. Le seul outil indispensable est [Node.js](https://nodejs.org/fr/), qui doit être installé sur votre ordinateur.

Dans un terminal (invite de commande), déplacez-vous dans le dossier de votre projet, et copiez-collez ces deux commandes :

1. **Étape 1 :** exécutez `npm init -y` (si ça ne fonctionne pas, [voici un correctif](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. **Étape 2 :** exécutez `npm install babel-cli@6 babel-preset-react-app@3`

>Astuce
>
>Nous **utilisons npm uniquement  pour installer le préprocesseur JSX** (vous n'en aurez besoin pour rien d'autre). React et le code applicatif peuvent rester sous la forme de balises `<script>` sans modification.

Bravo ! Vous venez d'ajouter **une configuration JSX de production** à votre projet.

### Lancer le préprocesseur JSX {#run-jsx-preprocessor}

Créez un dossier nommé `src` et lancez la commande suivante dans le terminal :

```
npx babel --watch src --out-dir . --presets react-app/prod
```

>Remarque
>
>`npx` n'est pas une faute de frappe, il s'agit d'un [outil d’exécution de paquet fourni avec npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) *(”package runner tool”, NdT)*.
>
>Si le message d'erreur *”You have mistakenly installed the `babel` package”* apparaît, vous avez peut-être loupé [l'étape précédente](#add-jsx-to-a-project). Dans le même dossier, recommencez l'opération et essayez de nouveau.

Cette commande surveille votre JSX en continu, inutile donc d’attendre qu’elle se termine.

Dorénavant, si à partir du **[code de démarrage JSX](https://gist.github.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js)**, vous créez un fichier nommé `src/like_button.js`, le préprocesseur va produire un fichier traduit `like_button.js`, avec du code JavaScript exploitable par le navigateur. Ce fichier sera mis à jour à chaque modification de votre fichier JSX original.

Et en bonus, ça vous permet aussi d’utiliser des syntaxes JavaScript modernes comme les classes, sans vous soucier de la compatibilité avec d'anciens navigateurs. L'outil que nous venons d’utiliser se nomme Babel, et vous pouvez en savoir plus sur lui en allant sur [sa documentation](https://babeljs.io/docs/en/babel-cli/).

Si vous vous sentez à l'aise avec les outils de compilation et souhaitez en apprendre plus, la [partie suivante](/docs/create-a-new-react-app.html) décrit les outils les plus populaires et les plus accessibles de la chaine de compilation. Si ce n'est pas le cas, les balises décrites précédemment fonctionneront à merveille !
