---
id: introducing-jsx
title: Introduction à JSX
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

Observez cette déclaration de variable :

```js
const element = <h1>Bonjour, monde !</h1>;
```

Cette drôle de syntaxe n'est ni une chaîne de caractères ni du HTML.

Ça s'appelle du JSX, et c'est une extension syntaxique de JavaScript. Nous recommandons de l'utiliser avec React afin de décrire à quoi devrait ressembler l'interface utilisateur (UI). JSX vous fait sûrement penser à un langage de balisage, mais il recèle toute la puissance de JavaScript.

JSX produit des « éléments » React. Nous verrons comment les retranscrire dans le DOM dans la [prochaine section](/docs/rendering-elements.html). Dans la suite de ce document, nous verrons les bases de JSX dont vous aurez besoin pour bien démarrer.

### Pourquoi JSX ? {#why-jsx}

Le fonctionnement d’une UI conditionnera toujours les logiques de rendu, de la gestion des événements à la préparation des données pour l'affichage, en passant par l'évolution de l'état au fil du temps. React a choisi d'assumer pleinement cet état de fait.

Au lieu de séparer artificiellement les *technologies* en mettant le balisage et la logique dans des fichiers séparés, React [sépare les *préoccupations*](https://fr.wikipedia.org/wiki/S%C3%A9paration_des_pr%C3%A9occupations) via des unités faiblement couplées appelées « composants », qui contiennent les deux. Nous reviendrons sur les composants dans une [prochaine section](/docs/components-and-props.html), mais si l'idée d’injecter des balises dans du JS vous met mal à l’aise, [cette présentation](https://www.youtube.com/watch?v=x7cQ3mrcKaY) vous fera peut-être changer d'avis.

React [ne vous oblige pas](/docs/react-without-jsx.html) à utiliser JSX, mais la plupart des gens y trouvent une aide visuelle quand ils manipulent l'interface utilisateur dans le code JavaScript. Ça permet aussi à React de produire des messages d'erreurs et d'avertissements plus utiles.

Ceci étant posé, commençons !

### Utiliser des expressions dans JSX {#embedding-expressions-in-jsx}

Dans l'exemple suivant, nous déclarons une variable appelée `name` et nous l'utilisons ensuite dans JSX en l'encadrant avec des accolades :

```js{1,2}
const name = 'Clarisse Agbegnenou';
const element = <h1>Bonjour, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

Vous pouvez utiliser n'importe quelle [expression JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Expressions_et_Op%C3%A9rateurs#Expressions) valide dans des accolades en JSX. Par exemple, `2 + 2`, `user.firstName`, ou `formatName(user)` sont toutes des expressions JavaScript valides.

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
    Bonjour, {formatName(user)} !
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

**[Essayer sur CodePen](codepen://introducing-jsx)**

On découple le JSX en plusieurs lignes pour une meilleure lisibilité. Par la même occasion, nous recommandons également de le mettre entre parenthèses afin d'éviter les pièges [d'insertion de point-virgule automatique](https://stackoverflow.com/q/2846283), même si cette pratique n'est pas obligatoire.

### JSX n’est rien d’autre qu’une expression {#jsx-is-an-expression-too}

Après la compilation, les expressions JSX deviennent de simples appels de fonctions JavaScript, dont l'évaluation renvoie des objets JavaScript.

Ça signifie que vous pouvez utiliser JSX à l'intérieur d'instructions `if` ou de boucles `for`, l'affecter à des variables, l'accepter en tant qu'argument, et le renvoyer depuis des fonctions :

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Bonjour, {formatName(user)} !</h1>;
  }
  return <h1>Bonjour, Belle Inconnue.</h1>;
}
```

### Spécifier des attributs en JSX {#specifying-attributes-with-jsx}

Vous pouvez utiliser des guillemets pour spécifier des littéraux chaînes de caractères dans les attributs :

```js
const element = <div tabIndex="0"></div>;
```

Vous pouvez aussi utiliser des accolades pour utiliser une expression JavaScript dans un attribut :

```js
const element = <img src={user.avatarUrl}></img>;
```

Ne mettez pas de guillemets autour des accolades quand vous utilisez une expression JavaScript dans un attribut. Vous pouvez utiliser soit des guillemets (pour des valeurs textuelles) soit des accolades (pour des expressions), mais pas les deux à la fois pour un même attribut.

>**Attention :**
>
>Dans la mesure où JSX est plus proche de JavaScript que de HTML, React DOM utilise la casse `camelCase` comme convention de nommage des propriétés, au lieu des noms d’attributs HTML.
>
>Par exemple, `class` devient [`className`](https://developer.mozilla.org/fr/docs/Web/API/Element/className) en JSX, et `tabindex` devient [`tabIndex`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/tabIndex).

### Spécifier des éléments enfants en JSX {#specifying-children-with-jsx}

Si une balise est vide, vous pouvez la fermer immédiatement avec `/>`, comme en XML :

```js
const element = <img src={user.avatarUrl} />;
```

Les balises JSX peuvent contenir des enfants :

```js
const element = (
  <div>
    <h1>Bonjour !</h1>
    <h2>Content de te voir ici.</h2>
  </div>
);
```

### JSX empêche les attaques d’injection {#jsx-prevents-injection-attacks}

Vous ne risquez rien en utilisant une saisie utilisateur dans JSX :

```js
const title = response.potentiallyMaliciousInput;
// Ceci est sans risque :
const element = <h1>{title}</h1>;
```

Par défaut, React DOM [échappe](https://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) toutes les valeurs intégrées avec JSX avant d’en faire le rendu. Il garantit ainsi que vous ne risquez jamais d’injecter quoi que ce soit d'autre que ce vous avez explicitement écrit dans votre application. Tout est converti en chaîne de caractères avant de produire le rendu. Ça aide à éviter les attaques [XSS (cross-site-scripting)](https://fr.wikipedia.org/wiki/Cross-site_scripting).

### JSX représente des objets {#jsx-represents-objects}

Babel compile JSX vers des appels à `React.createElement()`.

Ces deux exemples sont identiques :

```js
const element = (
  <h1 className="greeting">
    Bonjour, monde !
  </h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Bonjour, monde !'
);
```

`React.createElement()` effectue quelques vérifications pour vous aider à écrire un code sans bug, mais pour l'essentiel il crée un objet qui ressemble à ceci :

```js
// Remarque : cette structure est simplifiée
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Bonjour, monde !'
  }
};
```

Ces objets sont appelés des « éléments React ». Vous pouvez les considérer comme des descriptions de ce que vous voulez voir sur l'écran. React lit ces objets et les utilise pour construire le DOM et le tenir à jour.

Nous explorerons la retranscription des éléments React dans le DOM dans la [prochaine section](/docs/rendering-elements.html).

>**Astuce :**
>
>Nous recommandons d'utiliser la [définition de langage « Babel »](https://babeljs.io/docs/editors) dans votre éditeur préféré, afin que les codes ES6 et JSX soient correctement colorisés.
