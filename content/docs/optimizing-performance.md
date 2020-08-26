---
id: optimizing-performance
title: Optimiser les performances
permalink: docs/optimizing-performance.html
prev: uncontrolled-components.html
next: react-without-es6.html
redirect_from:
  - "docs/advanced-performance.html"
---

En interne, React fait appel à différentes techniques intelligentes pour minimiser le nombre d'opérations coûteuses sur le DOM nécessaires à la mise à jour de l'interface utilisateur (UI). Pour de nombreuses applications, utiliser React offrira une UI rapide sans avoir à fournir beaucoup de travail pour optimiser les performances. Néanmoins, il existe plusieurs façons d'accélérer votre application React.

## Utiliser la version de production {#use-the-production-build}

Si vous mesurez ou rencontrez des problèmes de performances dans vos applications React, assurez-vous que vous testez bien la version minifiée de production.

Par défaut, React intègre de nombreux avertissements pratiques. Ces avertissements sont très utiles lors du développement. Toutefois, ils rendent React plus gros et plus lent, vous devez donc vous assurer que vous utilisez bien une version de production lorsque vous déployez l'application.

Si vous n'êtes pas sûr·e que votre processus de construction est correctement configuré, vous pouvez le vérifier en installant [l'extension React Developer Tools pour Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=fr). Si vous visitez un site avec React en production, l'icône aura un fond sombre :

<p>
  <img src="../images/docs/devtools-prod.png" style="max-width:100%" alt="React DevTools sur un site web utilisant la version de production de React">
</p>

Si vous visitez un site avec React dans sa version de développement, l'icône aura un fond rouge :

<p>
  <img src="../images/docs/devtools-dev.png" style="max-width:100%" alt="React DevTools sur un site web utilisant la version de développement de React">
</p>

L’idée, c'est que vous utilisiez le mode développement lorsque vous travaillez sur votre application, et le mode production lorsque vous la déployez pour vos utilisateurs.

Vous trouverez ci-dessous les instructions pour procéder à la construction de votre application pour la production.

### Create React App {#create-react-app}

Si votre projet est construit avec [Create React App](https://facebook.github.io/create-react-app/), exécutez :

```
npm run build
```

Cela génèrera la version de production de votre application dans le répertoire `build/` de votre projet.

Rappelez-vous que cela n'est nécessaire qu'avant le déploiement en production. Lors du développement, utilisez `npm start`.

### Versions de production officielles {#single-file-builds}

Nous mettons à disposition des versions de React et de React DOM prêtes pour la production sous la forme de fichiers uniques :

```html
<script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
```

Rappelez-vous que seuls les fichiers React finissant par `.production.min.js` sont adaptés à la production.

### Brunch {#brunch}

Pour obtenir la version de production la plus efficace avec Brunch, installez l'extension [`terser-brunch`](https://github.com/brunch/terser-brunch) :

```
# Si vous utilisez npm :
npm install --save-dev terser-brunch

# Si vous utilisez Yarn :
yarn add --dev terser-brunch
```

Ensuite, pour créer la version de production, ajoutez l'option `-p` à la commande `build` :

```
brunch build -p
```

N'oubliez pas que cela n'est nécessaire que pour générer votre version de production. Vous ne devez pas utiliser l'argument `-p` ni l'extension lors des phases de développement, car ça masquerait les avertissements utiles de React et ralentirait notablement la construction de l'application.

### Browserify {#browserify}

Pour obtenir la version de production la plus efficace avec Browserify, installez quelques extensions :

```
# Si vous utilisez npm :
npm install --save-dev envify terser uglifyify

# Si vous utilisez Yarn :
yarn add --dev envify terser uglifyify
```

Pour créer la version de production, assurez-vous d'ajouter ces transformations **(l'ordre a son importance)** :

* La transformation [`envify`](https://github.com/hughsk/envify) s'assure que l'environnement est correctement défini. Définissez-la globalement (`-g`).
* La transformation [`uglifyify`](https://github.com/hughsk/uglifyify) supprime les imports de développement. Définissez-la également au niveau global (`-g`).
* Enfin, le *bundle* qui en résulte est transmis à [`terser`](https://github.com/terser-js/terser) pour être obfusqué ([les raisons sont détaillées ici](https://github.com/hughsk/uglifyify#motivationusage)).

Par exemple :

```
browserify ./index.js \
  -g [ envify --NODE_ENV production ] \
  -g uglifyify \
  | terser --compress --mangle > ./bundle.js
```

Rappelez-vous que vous n'avez à faire cela que pour la version de production. Vous ne devez pas appliquer ces extensions en développement, car cela masquerait des avertissements utiles de React et ralentirait la construction.

### Rollup {#rollup}

Pour obtenir la version de production la plus efficace avec Rollup, installez quelques extensions :

```bash
# Si vous utilisez npm :
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser

# Si vous utilisez Yarn :
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser
```

Pour créer la version de production, assurez-vous d'ajouter ces transformations **(l'ordre a son importance)** :

* L'extension [`replace`](https://github.com/rollup/rollup-plugin-replace) s'assure que l'environnement est correctement configuré.
* L'extension [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) prend en charge CommonJS au sein de Rollup.
* L'extension [`terser`](https://github.com/TrySound/rollup-plugin-terser) réalise la compression et obfusque le bundle final.

```js
plugins: [
  // ...
  require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  require('rollup-plugin-commonjs')(),
  require('rollup-plugin-terser')(),
  // ...
]
```

Pour une configuration complète, [vous pouvez consulter ce gist](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0).

Rappelez-vous que vous n'avez à faire cela que pour la version de production. Vous ne devez pas utiliser les extensions `terser` ou `replace` avec une valeur `'production'` en développement, car cela masquerait des avertissements utiles de React et ralentirait la construction.

### webpack {#webpack}

> Remarque
>
> Si vous utilisez Create React App, merci de suivre [les instructions ci-dessus](#create-react-app).<br>
> Cette section n'est utile que si vous configurez webpack vous-même.

Webpack v4+ minifera automatiquement votre code en mode production.

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin({ /* additional options here */ })],
  },
};
```

Vous pouvez en apprendre davantage sur le sujet en consultant la [documentation webpack](https://webpack.js.org/guides/production/).

Rappelez-vous que vous n'avez à faire cela que pour la version de production. Vous ne devez pas utiliser `TerserPlugin` en développement, car cela masquerait des avertissements utiles de React et ralentirait la construction.

## Profilage des composants avec l'onglet Performance de Chrome {#profiling-components-with-the-chrome-performance-tab}

En mode de **développement**, vous pouvez voir comment les composants sont montés, mis à jour et démontés en utilisant les outils de performances dans les navigateurs qui les prennent en charge. Par exemple :

<center><img src="../images/blog/react-perf-chrome-timeline.png" style="max-width:100%" alt="Des composants React dans la frise chronologique de Chrome" /></center>

Pour faire ça avec Chrome :

1. **Désactivez temporairement toutes les extensions de Chrome, en particulier React DevTools**. Elles peuvent considérablement impacter les résutats !

2. Assurez-vous d'utiliser l'application en mode de développement.

3. Ouvrez l'onglet ***[Performances](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool)*** dans les DevTools de Chrome et appuyez sur ***Record***.

4. Effectuez les opérations que vous voulez analyser. N'enregistrez pas plus de 20 secondes, car Chrome pourrait se bloquer.

5. Arrêtez l'enregistrement.

6. Les événements React seront regroupés sous l'étiquette ***User Timing***.

Pour une présentation plus détaillée, consultez [cet article de Ben Schwarz](https://calibreapp.com/blog/react-performance-profiling-optimization).

Veuillez noter que **ces résultats sont relatifs et que les composants seront rendus plus rapidement en production**. Néanmoins, ça devrait vous aider à comprendre quand des éléments d'interface sont mis à jour par erreur, ainsi que la profondeur et la fréquence des mises à jour de l'UI.

Pour le moment, Chrome, Edge et IE sont les seuls navigateurs prenant en charge cette fonctionnalité, mais comme nous utilisons [l'API standard User Timing](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API), nous nous attendons à ce que d'autres navigateurs la prennent en charge.

## Profilage des composants avec le DevTools Profiler {#profiling-components-with-the-devtools-profiler}

`react-dom` 16.5+ et `react-native` 0.57+ offrent des capacités de profilage avancées en mode de développement avec le Profiler de l'extension React DevTools.
Vous trouverez un aperçu du profileur sur le billet de blog [*« Découvrez le profileur React »*](/blog/2018/09/10/introducing-the-react-profiler.html).
Une présentation vidéo du profileur est également [disponible sur YouTube](https://www.youtube.com/watch?v=nySib7ipZdk).

Si vous n'avez pas encore installé l'extension React DevTools, vous pourrez la trouver ici :

- [L'extension pour le navigateur Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=fr).
- [L'extension pour le navigateur Firefox](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/).
- [Le module pour Node.js](https://www.npmjs.com/package/react-devtools).

> Remarque
>
> Un module de profilage pour la production de `react-dom` existe aussi dans `react-dom/profiling`.
> Pour en savoir plus sur l'utilisation de ce module, rendez-vous à l'adresse [fb.me/react-profiling](https://fb.me/react-profiling).

## Virtualiser les listes longues {#virtualize-long-lists}

Si votre application génère d'importantes listes de données (des centaines ou des milliers de lignes), nous vous conseillons d'utiliser la technique de « fenêtrage » *(windowing, NdT)*. Cette technique consiste à n'afficher à tout instant qu'un petit sous-ensemble des lignes, ce qui permet de diminuer considérablement le temps nécessaire au rendu des composants ainsi que le nombre de nœuds DOM créés.

[react-window](https://react-window.now.sh/) et [react-virtualized](https://bvaughn.github.io/react-virtualized/) sont des bibliothèques populaires de gestion du fenêtrage. Elles fournissent différents composants réutilisables pour afficher des listes, des grilles et des données tabulaires. Vous pouvez également créer votre propre composant, comme [l'a fait Twitter](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3), si vous voulez quelque chose de plus adapté à vos cas d'usage spécifiques.

## Éviter la réconciliation {#avoid-reconciliation}

React construit et maintient une représentation interne de l’UI produite, représentation qui inclut les éléments React renvoyés par vos composants. Elle permet à React d'éviter la création de nœuds DOM superflus et l'accès excessif aux nœuds existants, dans la mesure où ces opérations sont plus lentes que sur des objets JavaScript. On y fait parfois référence en parlant de « DOM virtuel », mais ça fonctionne de la même façon avec React Native.

Quand les props ou l'état local d'un composant changent, React décide si une mise à jour du DOM est nécessaire en comparant l'élément renvoyé avec l'élément du rendu précédent. Quand ils ne sont pas égaux, React met à jour le DOM.

Même si React ne met à jour que les nœuds DOM modifiés, refaire un rendu prend un certain temps. Dans la plupart des cas ce n'est pas un problème, mais si le ralentissement est perceptible, vous pouvez accélérer le processus en surchargeant la méthode `shouldComponentUpdate` du cycle de vie, qui est déclenchée avant le démarrage du processus de rafraîchissement. L'implémentation par défaut de cette méthode renvoie `true`, laissant ainsi React faire la mise à jour :

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

Si vous savez que dans certaines situations votre composant n'a pas besoin d'être mis à jour, vous pouvez plutôt renvoyer `false` depuis `shouldComponentUpdate` afin de sauter le rendu, et donc l'appel à la méthode `render()` sur ce composant et ses enfants.

Le plus souvent, plutôt que d'écrire manuellement `shouldComponentUpdate()`, vous pouvez plutôt choisir d’étendre [`React.PureComponent`](/docs/react-api.html#reactpurecomponent). Ça revient à implémenter `shouldComponentUpdate()` avec une comparaison superficielle des propriétés et état actuels et précédents.

## shouldComponentUpdate en action {#shouldcomponentupdate-in-action}

Voici un sous-arbre de composants. Pour chacun, `SCU` indique ce que `shouldComponentUpdate` renvoie, et `vDOMEq` indique si les éléments renvoyés étaient équivalents. Enfin, la couleur du cercle indique si le composant doit être réconcilié ou non.

<p><figure><img src="../images/docs/should-component-update.png" style="max-width:100%" alt="Arbre des composants montrant l'utilisation de shouldComponentUpdate"/></figure></p>

Puisque `shouldComponentUpdate` a renvoyé `false` pour le sous-arbre d'origine C2, React n'a pas tenté de faire le rendu de C2, et n'a pas invoqué non plus `shouldComponentUpdate` sur C4 et C5.

Pour C1 et C3, `shouldComponentUpdate` a renvoyé `true`, React a donc dû descendre dans les feuilles de l'arbre et les vérifier. Pour C6, `shouldComponentUpdate` a renvoyé `true`, et puisque les éléments renvoyés n'étaient pas équivalents, React a dû mettre à jour le DOM.

Le dernier cas intéressant concerne C8. React a dû faire le rendu de ce composant, mais puisque les éléments React renvoyés étaient équivalents à ceux du rendu précédent, il n'était pas nécessaire de mettre à jour le DOM.

Remarquez que React n'a dû modifier le DOM que pour C6, ce qui était inévitable. Pour C8, il s'en est dispensé suite à la comparaison des éléments React renvoyés, et pour le sous-arbre de C2 ainsi que pour C7, il n'a même pas eu à comparer les éléments car nous avons abandonné au niveau de `shouldComponentUpdate`, et `render` n'a pas été appelée.

## Exemples {#examples}

Si la seule façon de changer pour votre composant provient d’une modification de `props.color` ou `state.count`, alors vous devez vérifier ces valeurs dans `shouldComponentUpdate` :

```javascript
class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Compteur : {this.state.count}
      </button>
    );
  }
}
```

Dans ce code, `shouldComponentUpdate` vérifie simplement si `props.color` ou `state.count` ont changé. Dans le cas contraire, le composant n'est pas mis à jour. Si votre composant devient plus complexe, vous pourriez utiliser une approche similaire en procédant à une « comparaison superficielle » *(shallow comparison, NdT)* de tous les champs de `props` et `state` afin de déterminer si le composant doit être mis à jour. Ce modèle est suffisamment fréquent pour que React nous y aide : on hérite simplement de `React.PureComponent`. Ce code est donc une façon plus simple de réaliser la même chose :

```js
class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Compteur : {this.state.count}
      </button>
    );
  }
}
```

La plupart du temps, vous pouvez utiliser `React.PureComponent` au lieu de redéfinir `shouldComponentUpdate` vous-même. Il ne réalise qu'une comparaison superficielle, vous ne pouvez donc pas l'utiliser si les propriétés ou l'état sont modifiés d'une façon qui échapperait à ce type de comparaison.

Ça peut devenir un problème avec des structures de données plus complexes. Supposons, par exemple, que vous voulez qu'un composant `ListOfWords` affiche une liste de mots séparés par des virgules, avec un composant parent `WordAdder` qui vous permet d'ajouter un mot à la liste d'un simple clic. Ce code *ne fonctionnera pas* correctement :

```javascript
class ListOfWords extends React.PureComponent {
  render() {
    return <div>{this.props.words.join(',')}</div>;
  }
}

class WordAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ['marklar']
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // Cette section comporte une mauvaise pratique qui entraînera un bug.
    const words = this.state.words;
    words.push('marklar');
    this.setState({words: words});
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <ListOfWords words={this.state.words} />
      </div>
    );
  }
}
```

Le problème est que `PureComponent` va faire une comparaison référentielle entre l'ancienne et la nouvelle valeur de `this.props.words`. Dans la mesure où ce code modifie directement le tableau `words` dans la méthode `handleClick` de `WordAdder`, l’ancienne et la nouvelle valeurs de `this.props.words` sont considérées comme équivalentes (même objet en mémoire), bien que les mots dans le tableau aient été modifiés. Le composant `ListOfWords` ne sera pas mis à jour, même s'il devrait afficher de nouveaux mots.

## La puissance des données immuables {#the-power-of-not-mutating-data}

La façon la plus simple d'éviter ce problème consiste à éviter de modifier directement les valeurs que vous utilisez dans les props ou l’état local. Par exemple, la méthode `handleClick` au-dessus pourrait être réécrite en utilisant `concat` comme suit :

```javascript
handleClick() {
  this.setState(state => ({
    words: state.words.concat(['marklar'])
  }));
}
```

ES6 offre la [syntaxe de décomposition](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Syntaxe_d%C3%A9composition) *(spread operator, NdT)* pour les tableaux, ce qui facilite ce type d'opération. Si vous utilisez Create React App, cette syntaxe est disponible par défaut.

```js
handleClick() {
  this.setState(state => ({
    words: [...state.words, 'marklar'],
  }));
};
```

D'une manière similaire, vous pouvez réécrire du code qui modifie des objets en évitant la mutation. Par exemple, supposons que nous ayons un objet nommé `colormap` et que nous voulions écrire une fonction qui change la valeur de `colormap.right` en `'blue'`. Nous pourrions l'écrire ainsi :


```js
function updateColorMap(colormap) {
  colormap.right = 'blue';
}
```

Pour écrire cela en évitant de modifier l'objet original, nous pouvons utiliser la méthode [Object.assign](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/assign) :

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}
```

`updateColorMap` renvoie désormais un nouvel objet, plutôt que de modifier l'ancien. `Object.assign` fait partie d'ES6 et nécessite un polyfill.

[La syntaxe de décomposition des objets](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Syntaxe_d%C3%A9composition) facilite la mise à jour d’objets sans pour autant les modifier :

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

Cette fonctionnalité est apparue dans JavaScript avec ES2018.

Si vous utilisez Create React App, la méthode `Object.assign` et la syntaxe de décomposition d'objets sont toutes deux disponibles par défaut.

Lorsque vous faites face à des objets profondément imbriqués, les mettre à jour de manière immuable peut se révéler compliqué. Si vous faites face à ce problème, tournez-vous vers [Immer](https://github.com/mweststrate/immer) ou [immutability-helper](http://github.com/kolodny/immutability-helper). Ces librairies vous permettent d'écrire du code très lisible sans perdre les bénéfices de l'immuabilité.
