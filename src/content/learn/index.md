---
title: Démarrage rapide
---

<Intro>

Bienvenue dans la documentation React !  Dans cette page, vous allez découvrir les 80% de concepts React que vous utiliserez sans doute au quotidien.

</Intro>

<YouWillLearn>

- Comment créer et imbriquer des composants
- Comment ajouter du balisage et des styles
- Comment afficher des données
- Comment faire un rendu conditionnel et traiter des listes
- Comment réagir à des événements et mettre à jour l’affichage
- Comment partager des données entre composants

</YouWillLearn>

## Créer et imbriquer des composants {/*components*/}

Les applis React sont constituées de *composants*.  Un composant, c’est un bout d’UI (*User Interface*, donc interface utilisateur) avec son comportement et son apparence propres.  Un composant peut être aussi petit qu’un bouton, ou aussi grand qu’une page entière.

Les composants React sont des fonctions JavaScript qui renvoient du balisage :

```js
function MyButton() {
  return (
    <button>Je suis un bouton</button>
  );
}
```

À présent que vous avez déclaré `MyButton`, vous pouvez l’imbriquer dans un autre composant :

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Bienvenue dans mon appli</h1>
      <MyButton />
    </div>
  );
}
```

Remarquez que `<MyButton />` commence par une majuscule.  C’est comme ça que React sait qu’il s’agit d’un composant.  Les noms de composants React doivent toujours démarrer par une majuscule, alors que les balises HTML doivent être en minuscules.

Voyons ce que ça donne :

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      Je suis un bouton
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Bienvenue dans mon appli</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

Les mots-clés `export default` indiquent le composant principal du fichier.  Si vous n’êtes pas habitué·e à certains éléments syntaxiques de JavaScript, le [MDN](https://developer.mozilla.org/fr/docs/web/javascript/reference/statements/export) et [javascript.info](https://fr.javascript.info/import-export) sont d’excellentes références.

## Écrire du balisage avec JSX {/*writing-markup-with-jsx*/}

La syntaxe de balisage que vous avez vue ci-avant s’appelle *JSX*.  Elle n’est pas à proprement parler obligatoire, mais la plupart des projets React utilisent JSX par confort.  Tous les [outils que nous recommandons pour le développement en local](/learn/installation) prennent en charge JSX d’entrée de jeu.

JSX est plus exigeant que HTML. Vous devez fermer les balises telles que `<br />`. Par ailleurs, votre composant ne peut pas renvoyer plusieurs balises JSX.  Il vous faudrait les enrober dans un parent commun, tel qu’un `<div>...</div>` ou un Fragment `<>...</>` vide :

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>À propos</h1>
      <p>Bien le bonjour.<br />Comment ça va ?</p>
    </>
  );
}
```

Si vous avez beaucoup de HTML à migrer vers du JSX, vous pouvez vous aider d’un [convertisseur en ligne](https://transform.tools/html-to-jsx).

## Ajouter des styles {/*adding-styles*/}

Dans React, vous précisez une classe CSS avec `className`.  Ça fonctionne exactement comme l’attribut [`class`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/class) en HTML :

```js
<img className="avatar" />
```

Ensuite vous écrivez vos règles CSS dans un fichier CSS distinct :

```css
/* Dans votre CSS */
.avatar {
  border-radius: 50%;
}
```

React n’impose aucune façon particulière de fournir des fichiers CSS.  Le cas le plus simple consiste à utiliser une balise [`<link>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/link) dans votre HTML.  Si vous utilisez un outil de *build* ou un framework, consultez sa documentation pour apprendre comment ajouter un fichier CSS à votre projet.

## Afficher des données {/*displaying-data*/}

JSX vous permet de mettre du balisage dans du JavaScript.  Les accolades servent à « ressortir » dans JavaScript afin d’injecter une variable ou expression dans votre code et de l’afficher à l’utilisateur.  Par exemple, ce code affichera `user.name` :

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

Vous pouvez aussi « ressortir dans JavaScript » au sein d’attributs JSX, mais vous devrez utiliser des accolades *à la place* des guillemets.  Par exemple, `className="avatar"` passe la chaîne `"avatar"` comme classe CSS, mais `src={user.imageUrl}` lit d’abord la valeur de l’expression JavaScript `user.imageUrl`, et ensuite passe cette valeur à l’attribut `src` :

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

Vous pouvez utiliser des expressions plus complexes au sein des accolades JSX, par exemple de la [concaténation de chaînes](https://fr.javascript.info/operators#concatenation-de-chaines-de-caracteres-binaire) :

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo de ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

Dans l’exemple ci-avant, `style={{}}` ne constitue pas une syntaxe spéciale : c’est un littéral objet `{}` au sein d’accolades JSX `style={}`.  Vous pouvez utiliser l’attribut `style` lorsque vos styles dépendent de données dans votre code JavaScript.

## Affichage conditionnel {/*conditional-rendering*/}

Dans React, il n’y a pas de syntaxe spéciale pour écrire des conditions.  Au lieu de ça, on utilise les mêmes techniques que pour écrire du code JavaScript normal.  Par exemple, vous pouvez utiliser une instruction [`if`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/if...else) pour choisir quel bout de JSX inclure :

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

Si vous préférez un style plus compact, vous pouvez utiliser l’[opérateur ternaire conditionnel `?`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Conditional_Operator).  Contrairement à `if`, celui-ci marche aussi au sein-même de JSX :

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

Si vous n’avez pas besoin de la branche `else`, vous pouvez utiliser l’[opérateur `&&` logique](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation), plus court :

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

Toutes ces façons de faire fonctionnent aussi pour la définition conditionnelle d’attributs.  Si certaines de ces syntaxes vous déroutent, vous pouvez toujours commencer par `if...else`.

## Afficher des listes {/*rendering-lists*/}

Pour afficher des listes de composants vous utiliserez principalement la [méthode `map()` des tableaux](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/map), et parfois des [boucles `for`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/for).

Par exemple, disons que vous avez un tableau de produits :

```js
const products = [
  { title: 'Chou', id: 1 },
  { title: 'Ail', id: 2 },
  { title: 'Pomme', id: 3 },
];
```

Dans ce composant, on utilise la méthode `map()` pour transformer un tableau de produits en tableau d’éléments `<li>` :

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

Remarquez que `<li>` a un attribut `key`.  Pour chaque élément d’une liste, vous devriez passer une chaîne de caractères ou un numéro qui l’identifie de façon unique au sein de cette liste.  En général, cette clé vient de vos données, par exemple une clé primaire dans la base de données.  React utilise ces clés pour comprendre la nature de vos changements : insertion, suppression ou réordonnancement des éléments.

<Sandpack>

```js
const products = [
  { title: 'Chou', isFruit: false, id: 1 },
  { title: 'Ail', isFruit: false, id: 2 },
  { title: 'Pomme', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## Réagir à des événements {/*responding-to-events*/}

Vous pouvez réagir à des événements en utilisant des *gestionnaires d’événements* dans vos composants :

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('Vous avez cliqué !');
  }

  return (
    <button onClick={handleClick}>
      Cliquez ici
    </button>
  );
}
```

Remarquez que `onClick={handleClick}` n’a pas de parenthèses à la fin !  Prenez garde de ne pas *appeler* la fonction de gestion d’événement : vous avez seulement besoin de *la transmettre*.  React appellera votre gestionnaire d’événement lorsque l’utilisateur activera le bouton.

## Mettre à jour l’affichage {/*updating-the-screen*/}

Le plus souvent, vous voudrez que votre composant « se souvienne » de certaines informations et les affiche.  Par exemple, peut-être souhaitez-vous compter le nombre de fois qu’un bouton a été cliqué.  Pour cela, il vous faut équiper votre composant d’un *état*.

Commencez par importer [`useState`](/reference/react/useState) depuis React :

```js
import { useState } from 'react';
```

Servez-vous-en pour déclarer une *variable d’état* dans votre composant :

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

Un appel à `useState` vous renvoie deux choses : l’état courant (`count`), et une fonction pour le mettre à jour (`setCount`).  Vous pouvez leur donner n’importe quels noms, mais la convention largement répandue consiste à écrire `[something, setSomething]`.

La première fois que le bouton est affiché, `count` est à `0` car vous avez passé `0` à `useState()`. Lorsque vous souhaitez modifier l’état, appelez  `setCount()` et passez-lui la nouvelle valeur.  Cliquer sur ce bouton incrémentera le compteur :

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Cliqué {count} fois
    </button>
  );
}
```

React appellera à nouveau la fonction de votre composant. Cette fois, `count` vaudra `1`.  La fois suivante, ce sera `2`.  Et ainsi de suite.

Si vous affichez le même composant plusieurs fois, chacun a son propre état.  Cliquez les différents boutons séparément :

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Des compteurs indépendants</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Cliqué {count} fois
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

Voyez comme chaque bouton « se souvient » de son propre état `count` et n’affecte pas les autres boutons.

## Utiliser des Hooks {/*using-hooks*/}

Les fonctions dont le nom commence par `use` sont appelées *Hooks*. `useState` est un Hook fourni directement par React.  Vous pouvez trouver les autres Hooks fournis dans la [référence de l’API](/reference/react).  Vous pouvez aussi créer vos propres Hooks en combinant ceux existants.

Les Hooks sont plus contraignants que les autres fonctions.  Vous pouvez seulement appeler les Hooks *au début* du code vos composants (ou d’autres Hooks).  Si vous voulez utiliser `useState` dans une condition ou une boucle, extrayez un composant dédié au besoin et mettez le Hook à l’intérieur.

## Partager des données entre composants {/*sharing-data-between-components*/}

Dans l’exemple précédent, chaque `MyButton` avait son propre `count` indépendant, et lorsqu’un bouton était cliqué, seul le `count` de ce bouton changeait :

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="Diagramme montrant une arborescence de trois composants, un parent appelé MyApp et deux enfants appelés MyButton. Les deux composants MyButton ont un count de valeur zéro.">

Au départ, l’état `count` de chaque `MyButton` est à `0`

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="Le même diagramme que précédemment, avec le count du premier composant enfant MyButton mis en exergue pour indiquer qu’un clic l’a incrémenté à un. Le deuxième composant MyButton indique toujours une valeur de zéro." >

Le premier `MyButton` met à jour son état `count` à `1`

</Diagram>

</DiagramGroup>

Toutefois, vous aurez régulièrement besoin que vos composants *partagent des données et se mettent à jour de façon synchronisée*.

Afin que les deux composants `MyButton` affichent le même `count` et se mettent à jour ensemble, vous allez devoir déplacer l’état depuis les boutons individuels « vers le haut », vers le plus proche composant qui les contienne tous.

Dans cet exemple, il s’agit de `MyApp` :

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="Diagramme montrant une arborescence de trois composants, un parent appelé MyApp et deux enfants appelés MyButton. MyApp contient une valeur count de zéro, qui est transmise deux deux composants MyButton, lesquels affichent également zéro." >

Au départ, l’état `count` de `MyApp` vaut `0`, qui est transmis aux deux enfants

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="Le même diagramme que précédemment, avec le count du premier composant enfant MyApp mis en exergue pour indiquer qu’un clic l’a incrémenté à un. Le flux vers les deux enfants MyButton est mis en exergue aussi, et la valeur count de chaque enfant est à un, illustrant la transmission de la valeur vers le bas." >

Au clic, `MyApp` met à jour son état `count` à `1`, et le transmet aux deux enfants

</Diagram>

</DiagramGroup>

À présent quand vous cliquez l’un ou l’autre bouton, le `count` de `MyApp` change, ce qui altère les deux compteurs dans `MyButton`.  Voici comment exprimer la même chose sous forme de code.

Pour commencer, *faites remonter l’état* de `MyButton` vers `MyApp` :

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Des compteurs indépendants</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... on a bougé ce code à partir d’ici ...
}

```

Ensuite, *transmettez l’état vers le bas* de `MyApp` à chaque `MyButton`, ainsi que le gestionnaire partagé de clics.  Vous pouvez passer ces informations à `MyButton` au moyen d’accolades JSX, comme nous le faisions précédemment pour des balises natives comme `<img>` :

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Des compteurs synchronisés</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

Les informations ainsi transmises vers le bas s’appellent des *props*. Désormais, le composant `MyApp` contient l’état `state` et le gestionnaire d’événement `handleClick`, et *passe ces deux informations comme props* à chacun des boutons.

Pour finir, modifiez `MyButton` pour *lire* les props que le composant parent lui a passées :

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Cliqué {count} fois
    </button>
  );
}
```

Lorsque vous cliquez un bouton, le gestionnaire `onClick` est déclenché.  La prop `onClick` de chaque bouton utilise la fonction `handleClick` issue de `MyApp`, c’est donc ce code-là qui s’exécute.  Le code appelle `setCount(count + 1)`, incrémentant la variable d’état `count`. La nouvelle valeur `count` est passée comme prop à chaque bouton, de sorte qu’ils affichent tous cette nouvelle valeur.  C’est ce qu’on appelle « faire remonter l’état » _(“lifting state up”, NdT)_.  En déplaçant l’état vers le haut, nos composants peuvent le partager.

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Des compteurs synchronisés</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Cliqué {count} fois
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## Et maintenant ? {/*next-steps*/}

Bravo, vous connaissez désormais les bases de l’écriture de code React !

Allez donc découvrir notre [tutoriel](/learn/tutorial-tic-tac-toe) pour mettre tout ça en pratique et construire votre première petite appli avec React.
