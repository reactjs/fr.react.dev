---
title: Votre premier composant
---

<Intro>

Les *composants* sont un des concepts fondamentaux de React. Ils sont les fondations sur lesquelles vous construisez vos interfaces utilisateurs (UI), ce qui en fait le point de départ idéal pour votre apprentissage de React !

</Intro>

<YouWillLearn>

* Ce qu'est un composant
* Quel rôle jouent les composants dans une application React
* Comment écrire votre premier composant React

</YouWillLearn>

## Les composants : les blocs de construction de l'UI {/*components-ui-building-blocks*/}

Sur le Web, HTML nous permet de créer des documents riches et structurés grâce à son vaste jeu de balises telles que `<h1>` et `<li>` :

```html
<article>
  <h1>Mon premier composant</h1>
  <ol>
    <li>Les composants : les blocs de construction de l’UI</li>
    <li>Définir un composant</li>
    <li>Utiliser un composant</li>
  </ol>
</article>
```

Ce balisage représente cet article `<article>`, son en-tête `<h1>`, et une table des matières (abrégée) au moyen d'une liste ordonnée `<ol>`. Ce type de balisage, combiné à CSS pour en contrôler l'apparence et à JavaScript pour gérer son interactivité, constitue le socle de toute barre latérale, avatar, boîte de dialogue, liste déroulante… en fait absolument tout morceau d'UI que vous voyez sur le Web.

React vous permet de combiner votre balisage et ses codes CSS et JavaScript associés pour en faire des « composants » personnalisés, **des éléments d'UI réutilisables pour votre appli**. Le code de la table des matières que vous avez vu ci-dessus pourrait devenir un composant `<TableOfContents />` que vous pourriez afficher sur chaque page. Sous le capot, il utiliserait toujours les mêmes balises HTML telles que `<article>`, `<h1>`, `<ol>`, etc.

Tout comme avec les balises HTML, vous pouvez composer, ordonner et imbriquer les composants pour concevoir des pages entières. Par exemple, la page de documentation que vous êtes en train de lire est constituée de composants React :

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Docs</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

Au fil de la croissance de votre projet, vous remarquerez que nombre de vos blocs visuels peuvent être assemblés en réutilisant des composants que vous avez déjà écrits, ce qui accélère votre développement. Notre table des matières ci-dessus pourrait être ajoutée à n'importe quel écran avec un `<TableOfContents />` ! Vous pouvez même démarrer un projet avec des milliers de composants partagés par la communauté *open source* de React, tels que [Chakra UI](https://chakra-ui.com/) et [Material UI](https://material-ui.com/).

## Définir un composant {/*defining-a-component*/}

Traditionnellement, lorsqu'ils créent des pages web, les développeurs web écrivent le balisage de leur contenu puis ajoutent de l'interactivité en le saupoudrant de JavaScript.  Ça fonctionnait très bien lorsque l'interactivité n'était qu'un bonus appréciable sur le Web.  Aujourd'hui, c'est une exigence de base pour de nombreux sites et pour toutes les applis. React met l'interactivité à l'honneur tout en utilisant les mêmes technologies de fond : **un composant React est une fonction JavaScript que vous pouvez *saupoudrer de balisage***.  Voici à quoi ça ressemble (l'exemple ci-dessous est modifiable).

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

Et voici comment construire un composant :

### Étape 1 : exporter le composant {/*step-1-export-the-component*/}

Le préfixe `export default` est une [syntaxe JavaScript standard](https://developer.mozilla.org/fr/docs/web/javascript/reference/statements/export) (elle n'a rien de spécifique à React). Elle vous permet d'indiquer la fonction principale dans un fichier, de façon à ce qu'elle puisse aisément être importée par la suite depuis d'autres fichiers. (Explorez ce sujet plus en détails dans [Importer et exporter des composants](/learn/importing-and-exporting-components) !)

### Étape 2 : définir la fonction {/*step-2-define-the-function*/}

Avec `function Profile() { }`, vous définissez une fonction JavaScript dont le nom est `Profile`.

<Pitfall>

Les composants React sont des fonctions JavaScript classiques, mais **leurs noms doivent commencer par une majuscule**, sinon ils ne fonctionneront pas !

</Pitfall>

### Étape 3 : ajouter le balisage {/*step-3-add-markup*/}

Le composant renvoie une balise `<img />` avec des attributs `src` et `alt`. `<img />` s'écrit comme en HTML, mais il s'agit en fait de JavaScript sous le capot ! Cette syntaxe s'appelle [JSX](/learn/writing-markup-with-jsx), et elle vous permet d'incorporer du balisage dans JavaScript.

Vous pouvez écrire votre renvoi de valeur en une seule ligne, comme dans ce composant :

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

Mais si votre balisage n'est pas entièrement sur la même ligne que le mot-clé `return`, vous aurez intérêt à l'enrober de parenthèses :

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Pitfall>

Sans ces parenthèses, tout code qui suit un `return` seul sur sa ligne [serait ignoré](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi) !

</Pitfall>

## Utiliser un composant {/*using-a-component*/}

À présent que vous avez défini votre composant `Profile`, vous pouvez l'imbriquer dans d'autres composants. Par exemple, vous pouvez exporter un composant `Gallery` qui utilise plusieurs composants `Profile` :

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Scientifiques de renom</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

### Ce que voit le navigateur {/*what-the-browser-sees*/}

Remarquez les différences de casse :

* `<section>` est en minuscules : React comprend qu'il s'agit d'une balise HTML.
* `<Profile />` démarre par un `P` majuscule : React comprend que nous souhaitons utiliser notre composant appelé `Profile`.

Et `Profile` contient lui-même du HTML : `<img />`.  Au final, voici ce que voit le navigateur :

```html
<section>
  <h1>Scientifiques de renom</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### Imbriquer et organiser les composants {/*nesting-and-organizing-components*/}

Les composants sont des fonctions JavaScript classiques, de sorte que vous pouvez définir plusieurs composants dans un même fichier.  C'est pratique lorsque les composants sont relativement petits ou étroitement liés les uns aux autres.  Si ce fichier devient trop encombré, vous pouvez toujours déplacer `Profile` dans un fichier à part. Vous apprendrez comment procéder très bientôt dans la [page sur les imports](/learn/importing-and-exporting-components).

Puisque les composants `Profile` sont affichés au sein de `Gallery` (et même plusieurs fois !), on peut dire que `Gallery` est un **composant parent**, qui affiche chaque `Profile` en tant que composant « enfant ».  Ça fait partie de la magie de React : vous pouvez définir un composant une seule fois, puis l'utiliser à autant d'endroits et autant de fois que vous le souhaitez.

<Pitfall>

Les composants peuvent afficher d'autres composants, mais **faites bien attention à ne jamais imbriquer leurs définitions** :

```js {2-5}
export default function Gallery() {
  // 🔴 Ne définissez jamais un composant au sein d’un autre composant !
  function Profile() {
    // ...
  }
  // ...
}
```

Le fragment de code si-dessus est [très lent et plein de bugs](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state). Définissez plutôt tous vos composants au niveau racine du module :

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ Déclarez les composants au niveau racine
function Profile() {
  // ...
}
```

Lorsqu'un composant enfant a besoin de données venant d'un parent, [passez-les en props](/learn/passing-props-to-a-component) plutôt que d'imbriquer leurs définitions.

</Pitfall>

<DeepDive>

#### Des composants jusqu'au bout {/*components-all-the-way-down*/}

Votre application React commence avec un composant « racine ».  En général, il est créé automatiquement lorsque vous démarrez un nouveau projet. Par exemple, si vous utilisez [CodeSandbox](https://codesandbox.io/) ou si vous utilisez le framework [Next.js](https://nextjs.org/), le composant racine est défini dans `pages/index.js`. Dans les exemples qui précédaient, vous avez exporté des composants racines.

La plupart des applis React utilisent des composants « jusqu'au bout ». Ça signifie que vous utiliserez des composants non seulement pour des éléments réutilisables tels que des boutons, mais aussi pour des blocs plus importants tels que des barres latérales, des listes, et au final des pages complètes !  Les composants sont un moyen pratique d'organiser le code et le balisage de l'UI, même si certains ne seront utilisés qu'une fois.

<<<<<<< HEAD
[Les frameworks basés sur React](/learn/start-a-new-react-project) poussent cette logique plus loin. Plutôt que d'utiliser un fichier HTML vide et de laisser React « prendre la main » pour gérer la page avec JavaScript, ils génèrent *aussi* automatiquement le HTML de vos composants React. Ça permet à votre appli d'afficher du contenu avant même que le JavaScript ne soit chargé.
=======
[React-based frameworks](/learn/creating-a-react-app) take this a step further. Instead of using an empty HTML file and letting React "take over" managing the page with JavaScript, they *also* generate the HTML automatically from your React components. This allows your app to show some content before the JavaScript code loads.
>>>>>>> e22544e68d6fffda33332771efe27034739f35a4

Ceci dit, de nombreux sites web utilisent uniquement React pour [ajouter de l'interactivité à des pages HTML existantes](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page).  Ils ont plusieurs composants racines au lieu d'un seul pour la page entière.  Vous pouvez utiliser React aussi largement — ou légèrement – que vous le souhaitez.

</DeepDive>

<Recap>

Vous venez d'avoir un avant-goût de React ! Reprenons-en les points saillants.

* React vous permet de créer des composants, qui sont **des éléments d'UI réutilisables pour votre appli**.
* Dans une appli React, chaque morceau de l'UI est un composant.
* Les composants React sont des fonctions JavaScript classiques, à ceci près que :

  1. Leurs noms commencent toujours par une majuscule.
  2. Ils renvoient du balisage JSX.

</Recap>

<Challenges>

#### Exporter le composant {/*export-the-component*/}

Ce bac à sable ne fonctionne pas, parce que le composant racine n'est pas exporté :

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Essayez de le corriger vous-même avant de consulter la solution !

<Solution>

Ajoutez `export default` avant la définition de la fonction, comme ceci :

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Vous vous demandez peut-être pourquoi écrire `export` seul ne suffit pas à corriger cet exemple. Vous apprendrez la différence entre `export` et `export default` dans [Importer et exporter des composants](/learn/importing-and-exporting-components).

</Solution>

#### Corriger l'instruction `return` {/*fix-the-return-statement*/}

Quelque chose cloche dans cette instruction `return`.  Saurez-vous la corriger ?

<Hint>

Vous aurez peut-être une erreur *“Unexpected token”* en tentant de corriger ça.  Si ça vous arrive, vérifiez que le point-virgule apparaît *après* la parenthèse fermante. Laisser le point-virgule au sein du `return ()` entraînerait une erreur.

</Hint>

<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

Vous pouvez corriger ce composant en ramenant l'instruction `return` sur une seule ligne, comme ceci :

<Sandpack>

```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

Ou alors, enrobez le JSX renvoyé par des parenthèses qui s'ouvrent immédiatement à la suite du `return` :

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/jA8hHMpm.jpg"
      alt="Katsuko Saruhashi"
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### Repérer l'erreur {/*spot-the-mistake*/}

Il y a un souci dans la façon dont le composant `Profile` est déclaré et utilisé.  Repérez-vous l'erreur ? (Essayez de vous rappeler comment React fait la distinction entre les composants et les balises HTML classiques !)

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Scientifiques de renom</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

Les noms de composants React doivent commencer par une majuscule.

Changez `function profile()` en `function Profile()`, et changez chaque `<profile />` en `<Profile />` :

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

#### Votre propre composant {/*your-own-component*/}

Écrivez un composant à partir de zéro. Vous pouvez lui donner n'importe quel nom valide, et renvoyer le balisage de votre choix. Si vous êtes à court d'idée, vous pouvez écrire un composant `Congratulations` qui affiche `<h1>Bien joué !</h1>`.  N'oubliez pas de l'exporter !

<Sandpack>

```js
// Écrivez votre composant ici !

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>Bien joué !</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
