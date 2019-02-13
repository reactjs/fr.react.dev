---
id: introducing-jsx
title: Introduction à JSX
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

Observez cette déclaration de variable :

```js
const element = <h1>Bonjour, monde !</h1>;
```

Cette drôle de syntaxe n'est ni une chaîne de caractères ni du HTML. 
 
Ça s'appelle du JSX, et c'est une extension syntaxique de JavaScript. Nous recommandons de l'utiliser avec React afin de décrire à quoi devrait ressembler l'interface utilisateur (UI). JSX vous fait sûrement penser à un langage de balisage, mais il recèle toute la puissance de JavaScript.

JSX produit des « éléments » React. Nous verrons comment les retranscrire dans le DOM dans la [prochaine section](/docs/rendering-elements.html). Dans la suite de ce document, nous verrons les bases de JSX dont vous aurez besoin pour bien démarrer.

### Pourquoi JSX ? {#why-jsx}

React embrasse le fait que la logique de rendu est intrinsèquement couplée à la logique de l'interface utilisateur : comment les événements sont-ils gérés, comment l'état évolue t-il dans le temps, et comment la donnée est-elle préparée pour l'affichage.

Au lieu de séparer artificiellement les *technologies* en mettant le balisage et la logique dans des fichiers séparés, React [sépare les *préoccupations*](https://fr.wikipedia.org/wiki/S%C3%A9paration_des_pr%C3%A9occupations) via des unités faiblement couplées appelées des "composants" qui contiennent les deux. Nous reviendrons sur les composants dans une [prochaine section](/docs/components-and-props.html), si vous vous ne sentez pas convaincu avec l'idée de mixer des balises dans du JS, [cette présentation](https://www.youtube.com/watch?v=x7cQ3mrcKaY) pourra peut-être vous faire changer d'avis.

React ne [nécessite pas](/docs/react-without-jsx.html) l'utilisation de JSX pour fonctionner, mais la plupart des gens le considère comme une aide visuel quand ils manipulent l'interface utilisateur dans le code JavaScript. Cela permet aussi à React de montrer des messages d'erreurs et d'avertissements plus utiles.

Nous pouvons enfin commencer !

### Imbriqué des Expressions en JSX {#embedding-expressions-in-jsx}

Dans l'exemple suivant, nous déclarons une variable appelée `name` et nous l'utilisons ensuite dans du JSX en l'encadrant avec des accolades :

```js{1,2}
const name = 'Clarisse Agbegnenou';
const element = <h1>Bonjour, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

Vous pouvez utiliser n'importe quelle [expression JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Expressions_et_Op%C3%A9rateurs#Expressions) valide dans des accolades en JSX. Par exemple, `2 + 2`, `user.firstName`, or `formatName(user)` sont toutes des expressions JavaScript valides.

Dans l'exemple suivant, on intègre le résultat de l'appel d'une fonction JavaScript, `formatName(user)`, dans un élément `<h1>`.

```js{12}
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Kylian',
  lastName: 'Mbappé'
};

const element = (
  <h1>
    Bonjour, {formatName(user)} !
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[](codepen://introducing-jsx)

On sépare le JSX sur plusieurs lignes pour une meilleure lecture. Par la même occasion, nous recommandons aussi de le mettre entre parenthèses afin d'éviter les pièges [d'insertion de point-virgule automatique](http://stackoverflow.com/q/2846283), notez que cette pratique n'est pas obligatoire.

### JSX est aussi une expression {#jsx-is-an-expression-too}

Après la compilation, les expressions JSX deviennent des appels de fonctions JavaScripts réguliers et sont évalués en tant qu'objet JavaScript.

Cela signifie que vous pouvez utiliser JSX à l'intérieur d'instructions `if` ou de boucles `for`, l'assigner dans une variable, l'accepter en tant qu'argument, et le retourner depuis des fonctions :

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Bonjour, {formatName(user)} !</h1>;
  }
  return <h1>Bonjour, Inconnu.</h1>;
}
```

### Spécifier des Attributs avec JSX {#specifying-attributes-with-jsx}

Vous pouvez utiliser des guillemets doubles pour spécifier des chaînes de caractères littérales en tant qu’attributs :

```js
const element = <div tabIndex="0"></div>;
```

Vous pouvez aussi utiliser des accolades pour intégrer une expression JavaScript dans un attribut :

```js
const element = <img src={user.avatarUrl}></img>;
```

Ne mettez pas des guillemets doubles autour d'accolades quand vous intégrez une expression JavaScript dans un attribut. You devrez utiliser des guillemets doubles (for des valeurs de type chaîne de caractères) ou des accolades (pour des expressions), mais pas les deux dans le même attribut.

>**Attention :**
>
>Comme JSX est plus proche de JavaScript qu'il ne l'est du HTML, React DOM utilise le `camelCase` comme convention de nommage pour ses propriétés au lieu des noms des attributs HTML.
>
>Par exemple, `class` devient [`className`](https://developer.mozilla.org/fr/docs/Web/API/Element/className) en JSX, et `tabindex` devient [`tabIndex`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/tabIndex).

### Spécifier des Enfants avec JSX {#specifying-children-with-jsx}

Si une balise est vide, vous pouvez le fermer immédiatement via `/>`, comment en XML :

```js
const element = <img src={user.avatarUrl} />;
```

Les balises JSX peuvent contenir des enfants :

```js
const element = (
  <div>
    <h1>Bonjour !</h1>
    <h2>Content de te voir ici.</h2>
  </div>
);
```

### JSX Empêchent les Attaques de type Injection {#jsx-prevents-injection-attacks}

Vous ne risquez rien si vous intégré une entrée utilisateur en JSX :

```js
const title = response.potentiallyMaliciousInput;
// Cela est sûr :
const element = <h1>{title}</h1>;
```


Par défaut, React DOM [échappe](http://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) toutes les valeurs intégrées dans JSX avant de les rendre. Cela assure que vous ne pouvez jamais injecter quoi que ce soit d'autre que ce vous avez explicitement écrit dans votre application. Tout est converti en chaîne de caractères avant d'être rendu. Celle contribute a la prevention des attaques de type [XSS (cross-site-scripting)](https://fr.wikipedia.org/wiki/Cross-site_scripting).

### JSX Représente des Objets {#jsx-represents-objects}

Babel compile JSX vers des appels `React.createElement()`.

Ces deux exemples sont identiques :

```js
const element = (
  <h1 className="greeting">
    Bonjour, monde !
  </h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Bonjour, monde !'
);
```

`React.createElement()` effectue quelques controls pour vous aider à écrire un code sans bug mais essentiellement il crée un semblant d'objet qui ressemble à ceci :

```js
// Note: this structure is simplified
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Bonjour, monde !'
  }
};
```

Ces objets sont appelés des "éléments React". Vous pouvez les imaginer commes des descriptions de ce que vous voulez voir sur l'écran. React lit ces objets et les utilises pour construir le DOM et tenir à jour.

Nous explorons le rendu des éléments React vers le DOM dans la prochaine section.

>**Astuce :**
>
>Nous recommandons d'utiliser le [language de définition "Babel"](http://babeljs.io/docs/editors) dans votre éditeur préféré ainsi les codes ES6 et JSX sont proprement soulignés. Ce site internet utilise schéma de couleur [Oceanic Next](https://labs.voronianski.com/oceanic-next-color-scheme/) qui est compatible avec celui-ci.
