---
id: optimizing-performance
title: Optimiser les performances
permalink: docs/optimizing-performance.html
redirect_from:
  - "docs/advanced-performance.html"
---

En interne, React fait appel à différentes techniques intelligentes pour minimiser le nombre d'opérations coûteuses sur le DOM nécessaires à la mise à jour de l'interface utilisateur. Pour de nombreuses applications, utiliser React offrira une interface utilisateur rapide sans avoir beaucoup de travail à fournir pour optimiser les performances. Néanmoins, il existe plusieurs façons d'accélérer votre application React.

## Utiliser la version de production {#use-the-production-build}

Si vous mesurez ou rencontrez des problèmes de performances dans vos applications React, assurez-vous que vous testez bien la version minifiée de production.

Par défaut, React intègre de nombreux avertissements utiles. Ces avertissements sont très utiles lors du développement. Toutefois, ils rendent React plus gros et plus lent, vous devez donc vous assurer que vous utilisez bien une version de production lorsque vous déployez l'application.

Si vous n'êtes pas sûr que votre processus de construction est correctement configuré, vous pouvez le vérifier en installant [l'extension React Developer Tools pour Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=fr). Si vous visitez un site avec React en production, l'icône aura un fond sombre :

<img src="../images/docs/devtools-prod.png" style="max-width:100%" alt="React DevTools sur un site web en production avec React">

Si vous visitez un site avec React en phase de développement, l'icône aura un fond rouge :

<img src="../images/docs/devtools-dev.png" style="max-width:100%" alt="React DevTools sur un site web en développement avec React">

Il est attendu que vous utilisiez le mode de développement lorsque vous travaillez sur votre application, et le mode de production lorsque vous la déployez pour vos utilisateurs.

Vous trouverez ci-dessous les instructions pour construire votre application pour la production.

### Create React App {#create-react-app}

Si votre projet est construit avec [Create React App](https://github.com/facebookincubator/create-react-app), exécutez :

```
npm run build
```

Cela génèrera votre application pour la production dans le répertoire `build/` de votre projet.

Rappelez-vous que cela n'est nécessaire qu'avant le déploiement en production. Lors du développement, utilisez `npm start`.

### Génération d'un fichier unique {#single-file-builds}

Nous mettons à disposition des versions de React et de React DOM prêts pour la production sous la forme de fichiers uniques :

```html
<script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
```

Rappelez-vous que seuls les fichiers React finissant par `.production.min.js` sont adaptés à la production.

### Brunch {#brunch}

Pour obtenir la version de production la plus efficace avec Brunch, installez l'extension [`uglify-js-brunch`](https://github.com/brunch/uglify-js-brunch) :

```
# Si vous utilisez npm :
npm install --save-dev uglify-js-brunch

# Si vous utilisez Yarn :
yarn add --dev uglify-js-brunch
```

Ensuite, pour créer la version de production, ajoutez l'argument `-p` à la commande `build` :

```
brunch build -p
```

N'oubliez pas que cela n'est requis que pour la génération du paquet de production. Vous ne devez pas utiliser l'argument `-p` ni l'extension lors des phases de développement, car cela cacherait les avertissements utiles de React et ralentirait notablement la construction de l'application.

### Browserify {#browserify}

Pour obtenir la version de production la plus efficace avec Browserify, installez quelques extensions :

```
# Si vous utilisez npm :
npm install --save-dev envify uglify-js uglifyify 

# Si vous utilisez Yarn :
yarn add --dev envify uglify-js uglifyify 
```

Pour créer la version de production, assurez-vous d'ajouter ces transformations **(l'ordre a son importance)** :

* La transformation [`envify`](https://github.com/hughsk/envify) s'assure que l'environnement est correctement défini. Définissez-le globalement (`-g`).
* La transformation [`uglifyify`](https://github.com/hughsk/uglifyify) supprime les imports de développement. Définissez-le également au niveau global (`-g`).
* Enfin, le *bundle* qui en résulte est transmis à [`uglify-js`](https://github.com/mishoo/UglifyJS2) pour être obfusqué ([les raisons sont expliquées ici](https://github.com/hughsk/uglifyify#motivationusage)).

Par exemple :

```
browserify ./index.js \
  -g [ envify --NODE_ENV production ] \
  -g uglifyify \
  | uglifyjs --compress --mangle > ./bundle.js
```

> **Remarque :**
>
> Le paquet est nommé `uglify-js`, mais le binaire fourni est appelé `uglifyjs`.<br>
> Ce n'est pas une faute de frappe.

Rappelez-vous que vous n'avez à faire cela que pour la version de production. Vous ne devez pas appliquer ces extensions en développement, car cela masquerait des avertissements utiles de React, grossirait et ralentirait la construction.

### Rollup {#rollup}

Pour obtenir la version de production la plus efficace avec Rollup, installez quelques extensions :

```
# Si vous utilisez npm :
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-uglify 

# Si vous utilisez Yarn :
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-uglify 
```

Pour créer la version de production, assurez-vous d'ajouter ces transformations **(l'ordre a son importance)** :

* L'extension [`replace`](https://github.com/rollup/rollup-plugin-replace) s'assure que l'environnement est correctement configuré.
* L'extension [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) prend en charge CommonJS au sein de Rollup.
* L'extension [`uglify`](https://github.com/TrySound/rollup-plugin-uglify) réalise la compression et obfusquera le paquet final.

```js
plugins: [
  // ...
  require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  require('rollup-plugin-commonjs')(),
  require('rollup-plugin-uglify')(),
  // ...
]
```

Pour une configuration complète, [vous pouvez consulter ce gist](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0).

Rappelez-vous que vous n'avez à faire cela que pour la version de production. Vous ne devez pas utiliser les extensions `uglify` ou `replace` avec une valeur `'production'` en développement, car cela masquerait des avertissements utiles de React, grossirait et ralentirait la construction.

### webpack {#webpack}

> **Remarque :**
>
> Si vous utilisez Create React App, merci de suivre [les instructions ci-dessus](#create-react-app).<br>
> Cette section n'est utile que si vous configurez webpack vous-même.

Pour obtenir la version de production la plus efficace avec webpack, assurez-vous d'inclure ces extensions dans votre configuration de production :

```js
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production')
}),
new webpack.optimize.UglifyJsPlugin()
```

Vous pouvez en apprendre plus sur le sujet en consultant la [documentation webpack](https://webpack.js.org/guides/production-build/).

Rappelez-vous que vous n'avez à faire cela que pour la version de production. Vous ne devez pas utiliser `UglifyJsPlugin` ou `DefinePlugin` with `'production'` avec une valeur `'production'` en développement, car cela masquerait des avertissements utiles de React et ralentirait la construction.

## Profilage des composants avec l'onglet performances de Chrome {#profiling-components-with-the-chrome-performance-tab}

En mode de **développement**, vous pouvez voir comment les composants sont montés, mis à jour et démonter en utilisant les outils de performances dans les navigateurs qui les prennent en charge. Par exemple :

<center><img src="../images/blog/react-perf-chrome-timeline.png" style="max-width:100%" alt="Des components React dans la frise chronologie de Chrome" /></center>

Pour faire cela avec Chrome :

1. **Désactiver temporairement tous les extensions de Chrome, en particulier React DevTools**. Elles peuvent considérablement impacter les résutats !

2. Assurez-vous d'utiliser l'application en mode de développement.

3. Ouvrez l'onglet ***[Performances](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool)*** dans les DevTools de Chrome tab et appuyez sur ***Record***.

4. Effectuez les opérations que vous voulez analyser. N'enregistrez pas plus de 20 secondes, car Chrome pourrait se bloquer.

5. Arrêtez l'enregistrement.

6. Les événements React seront regroupés sous l'étiquette ***User Timing***.

Pour un aperçu plus détaillé, consulez [cet article de Ben Schwarz](https://calibreapp.com/blog/2017-11-28-debugging-react/).

Veuillez noter que **ces résultats sont relatifs et que les composants seront rendus plus rapidement en production**. Néanmoins, cela devrait vous aider à comprendre quand les éléments graphiques sont mis à jour par erreur, ainsi que la profondeur et la fréquence des mises à jour de l'interface utilisateur.

Actuellement, Chrome, Edge et IE sont les seuls navigateurs prenant en charge cette fonctionnalité, mais comme nous utilisons [l'API standard User Timing](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API), nous nous attendons à ce que d'autres navigateurs la prennent en charge.

## Profilage des composants avec le DevTools Profiler {#profiling-components-with-the-devtools-profiler}

`react-dom` 16.5+ et `react-native` 0.57+ offrent des capacités de profilage avancées en mode de développement avec l'extension React DevTools Profiler.
Vous trouvez un aperçu du *Profiler* sur le billet de blog ["*Introducing the React Profiler*"](/blog/2018/09/10/introducing-the-react-profiler.html).
Une présentation vidéo du *Profiler* est également [disponible sur YouTube](https://www.youtube.com/watch?v=nySib7ipZdk).

Si vous n'avez pas encore installé l'extension React DevTools, vous pourrez les trouver ici :

- [L'extension pour le navigateur Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=fr).
- [L'extension pour le navigateur Firefox](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/).
- [Paquet pour Node.js](https://www.npmjs.com/package/react-devtools).

> Remarque :
>
> Un paquet de profilage pour la production de `react-dom` existe aussi dans `react-dom/profiling`.
> Pour en savoir plus sur l'utilisation de ce paquet, rendez-vous à l'adresse [fb.me/react-profiling](https://fb.me/react-profiling).

## Virtualiser les listes longues {#virtualize-long-lists}

Si votre application génère d'importantes listes de données (des centaines ou des milliers de lignes), nous vous recommandons d'utiliser la technique de « fenêtrage » (en anglais « *windowing* »). Cette technique consiste à n'afficher qu'un petit ensemble des lignes à un moment donné, ce qui permet de diminuer considérablement le temps nécessaire au rendu des composants ainsi que le nombre de nœuds DOM créés.

[react-window](https://react-window.now.sh/) et [react-virtualized](https://bvaughn.github.io/react-virtualized/) sont des bibliothèques populaires pour la prise en charge du fenêtrage. Elles fournissent différents composants réutilisables pour afficher des listes, grilles et données tabulaires. Vous pouvez également créer votre propre composant, comme [l'a fait Twitter](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3), si vous voulez quelque chose de plus adapté au cas d'usage spécifique de votre application.

## Éviter la réconciliation {#avoid-reconciliation}

React construit et maintient une représentation interne de l'interface utilisateur rendue. Cela inclut les éléments React qui sont renvoyés par vos composants. Cette représentation permet à React d'éviter la création de nœuds DOM superflus et l'accès excessif aux nœuds existants, dans la mesure où ces opérations sont plus lentes que sur des objets JavaScript. On y fait parfois référence en parlant de « *Virtual DOM* », mais cela fonctionne de la même façon avec React Native.

Quand les propriétés ou l'état d'un composant changent, React décide si une mise à jour du DOM est nécessaire en comparant l'élément renvoyé avec l'élément précédemment rendu. Quand ils ne sont pas égaux, React met à jour le DOM.

Vous pouvez visualiser ces rendus du *Virtual DOM* avec React DevTools :

- [L'extension pour le navigateur Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=fr).
- [L'extension pour le navigateur Firefox](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/).
- [Le paquet pour Node.js](https://www.npmjs.com/package/react-devtools).

Dans la console de développement, choisissez l'option ***Highlight Updates*** dans l'onglet **React** :

<center><img src="../images/blog/devtools-highlight-updates.png" style="max-width:100%; margin-top:10px;" alt="Comment activer l'option" /></center>

Interagissez avec votre page, et vous devriez voir des bordures colorées apparaître momentanément autour des composants dont le rendu est mis à jour. Cela vous permet de détecter les mises à jour inutiles. Vous pouvez en apprendre plus sur cette fonctionnalité du React DevTools en lisant [ce billet du blog](https://blog.logrocket.com/make-react-fast-again-part-3-highlighting-component-updates-6119e45e6833) de [Ben Edelstein](https://blog.logrocket.com/@edelstein).

Prenons cet exemple :

<center><img src="../images/blog/highlight-updates-example.gif" style="max-width:100%; margin-top:20px;" alt="Exemple de la fonctionnalité de mise en évidence des mises à jour avec React DevTools" /></center>

Remarquez que lorsque l'on saisit une seconde tâche, la première clignote également à l'écran à chaque frappe. Cela signifie qu'elle est également rendue par React avec le champ de saisie. On appelle parfois cela un rendu « gâché ». Nous savons que cela est inutile car le contenu de la première tâche est inchangé, mais React l'ignore.

Même si React ne met à jour que les nœuds DOM modifiés, refaire un rendu prend un certain temps. Dans la plupart des cas ce n'est pas un problème, mais si le ralentissement est perceptible, vous pouvez accélérer le processus en surchargeant la méthode `shouldComponentUpdate` du cycle de vie, qui est déclenchée avant le démarrage du processus de rendu. L'implémentation par défaut de cette méthode renvoie `true`, laissant ainsi React faire la mise à jour :

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

Si vous savez que dans certaines situations votre composant n'a pas besoin d'être mis à jour, vous pouvez plutôt renvoyer `false` depuis `shouldComponentUpdate` afin d'ignorer le processus de rendu, et donc l'appel à la méthode `render()` sur ce composant et ses enfants.

Dans la plupart des cas, plutôt que d'écrire manuellement `shouldComponentUpdate()`, vous pouvez hériter de [`React.PureComponent`](/docs/react-api.html#reactpurecomponent). Cela revient à implémenter `shouldComponentUpdate()` avec une comparaison superficielle des propriétés et état actuels et précédents.

## shouldComponentUpdate en action {#shouldcomponentupdate-in-action}

Voici un sous-arbre de composants. Pour chacun, `SCU` indique ce que `shouldComponentUpdate` renvoie, et `vDOMEq` indique si les éléments React rendus étaient équivalents. Enfin, la couleur du cercle indique si le composant doit être réconcilé ou non.

<figure><img src="../images/docs/should-component-update.png" style="max-width:100%" alt="Arbre des composants montrant l'utilisation de shouldComponentUpdate"/></figure>

Puisque `shouldComponentUpdate` a renvoyé `false` pour le sous-arbre d'origine C2, React n'a pas tenté de faire le rendu de C2, et n'a pas invoqué non plus `shouldComponentUpdate` sur C4 et C5.

Pour C1 et C3, `shouldComponentUpdate` a renvoyé `true`, React a donc dû descendre dans les feuilles de l'arbre et les vérifier. Pour C6, `shouldComponentUpdate` a renvoyé `true`, et puisque les éléments rendus n'étaient pas équivalents, React a dû mettre à jour le DOM.

Le dernier cas intéressant concerne C8. React a eut besoin de faire le rendu de ce composant, mais puisque les éléments React renvoyés étaient équivalents à ceux précédemment rendus, il n'était pas nécessaire de mettre à jour le DOM.

Remarquez que React n'a eu à faire de mutations sur le DOM que pour C6, ce qui était inévitable. Pour C8, il a comparé les éléments React rendus, et pour les sous-arbres de C2 et C7, il n'a pas eu à comparer les éléments car nous avons débraillé au niveau de `shouldComponentUpdate`, et `render` n'a pas été appelé.

## Exemples {#examples}

Si la seule façon de changer pour votre composant et une modification de la variable `props.color` ou `state.count`, alors vous devez vérifier ces variables dans `shouldComponentUpdate` :

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

Dans ce code, `shouldComponentUpdate` vérifie simplement s'il y a eu une modification de `props.color` ou `state.count`. Si ces valeurs ne changent pas, alors le composant n'est pas mis à jour. Si votre composant devient plus complexe, vous devriez utiliser un modèle similaire en procédant à une « comparaison superficielle » (« *shallow comparison* ») de tous les champs de `props` et `state` afin de déterminer si le composant doit être mis à jour. Ce modèle est suffisamment commun pour que React propose un assistant pour cela — en héritant simplement de `React.PureComponent`. Ce code est donc une façon plus simple de réaliser la même chose :

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

La plupart du temps, vous pouvez utiliser `React.PureComponent` au lieu de redéfinir `shouldComponentUpdate` vous-même. Il ne réalise qu'une comparaison superficielle, vous ne pouvez donc pas l'utiliser si les propriétés ou l'état sont modifiés d'une façon qui échapperait à une comparaison superficielle.

Cela peut devenir un problème avec des structures de données plus complexes. Supposons, par exemple, que vous voulez qu'un composant `ListOfWords` affiche une liste de mots séparés par des virgules, avec un composant parent `WordAdder` qui vous permet d'ajouter un mot à la liste d'un simple clic. Ce code *ne fonctionnera pas* correctement :

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
    // Cette section utilise un mauvais style et causera un bogue.
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

Le problème est que `PureComponent` va faire une comparaison simple entre l'ancienne et la nouvelle valeur de `this.props.words`. Dans la mesure où ce code modifie le tableau `words` dans la méthode `handleClick` de `WordAdder`, les anciennes valeurs et les nouvelles de `this.props.words` seront considérées comme équivalentes, bien que les mots dans le tableau aient été modifiés. Le composant `ListOfWords` ne sera pas mis à jour, même s'il contient de nouveaux mots qui devraient être affichés.

## La puissance de ne pas modifier les données {#the-power-of-not-mutating-data}

La façon la plus simple d'éviter ce problème et d'éviter de modifier les valeurs que vous utilisez en tant que propriété ou état. Par exemple, la méthode `handleClick` au-dessus pourra être réécrite en utilisant `concat` de cette façon :

```javascript
handleClick() {
  this.setState(state => ({
    words: state.words.concat(['marklar'])
  }));
}
```

ES6 offre la [syntaxe de décomposition (*spread syntax*)](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Syntaxe_d%C3%A9composition) pour les tableaux ce qui rend l'écriture plus facile. Si vous utilisez Create React App, cette syntaxe est disponible par défaut.

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

`updateColorMap` renvoie désormais un nouvel objet, plutôt que de modifier l'ancien. `Object.assign` fait partie d'ES6 et requiert un polyfill.

Il existe une proposition JavaScript pour ajouter [la décomposition des propriétés d'objet (*object spread properties*)](https://github.com/sebmarkbage/ecmascript-rest-spread) afin de simplifier la mise à jour des objets sans pour autant les modifier :

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

Si vous utilisez Create React App, la méthode `Object.assign` et la syntaxe de décomposition d'objets sont toutes deux disponibles par défaut.

## Utiliser des structures de données immuables {#using-immutable-data-structures}

L'utilisation d'[Immutable.js](https://github.com/facebook/immutable-js) est une autre façon de résoudre ce problème. Elle fournit des collections immuables et persistantes qui fonctionnent avec du partage structurel :

* *Immutable* : une fois créée, une collection ne peut plus être modifiée ultérieurement.
* *Persistent* : de nouvelles collections peuvent être créées à partir d'une ancienne collection et d'une mutation telle que `set`. La collection d'origine reste valide une fois la nouvelle collection créée.
* *Structural Sharing* : de nouvelles collections sont créées en utilisant une structure la plus proche possible de celle d'origine, réduisant la copie au minimum pour améliorer les performances.

L'immuabilité rend le suivi des modifications peu coûteux. Un changement résultera toujours en un nouvel objet, nous n'avons alors qu'à vérifier si la référence de l'objet a changé. Par exemple, dans ce code JavaScript classique :

```javascript
const x = { foo: 'bar' };
const y = x;
y.foo = 'baz';
x === y; // true
```

Bien que `y` ait été modifié, vu qu'il s'agit toujours d'une référence au même objet `x`, alors cette comparaison renverra `true`. Vous pouvez écrire un code similaire avec immutable.js :

```javascript
const SomeRecord = Immutable.Record({ foo: null });
const x = new SomeRecord({ foo: 'bar' });
const y = x.set('foo', 'baz');
const z = x.set('foo', 'bar');
x === y; // false
x === z; // true
```

Dans ce cas, puisqu'une nouvelle référence est renvoyée quand on modifie `x`, alors nous pouvons utiliser la vérification d'égalité `(x === y)` pour vérifier que la nouvelle valeur stockée dans `y` est différente de celle d'origine stockée dans `x`.

Les deux autres bibliothèques qui facilitent l'utilisation des données immuables sont [seamless-immutable](https://github.com/rtfeldman/seamless-immutable) et [immutability-helper](https://github.com/kolodny/immutability-helper).

Les structures de données immuables vous offrent un moyen peu coûteux de suivre les modifications apportées aux objets. C'est tout ce dont nous avons besoin pour implémenter `shouldComponentUpdate`. Cela peut souvent contribuer à une amélioration des performances.
