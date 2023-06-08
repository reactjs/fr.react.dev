---
title: Importer et exporter des composants
---

<Intro>

La magie des composants réside dans leur réutilisabilité : vous pouvez créer des composants qui sont composés d’autres composants. Mais plus vous imbriquez de composants, plus il est souvent judicieux de les diviser en différents fichiers. Cela vous permet de garder vos fichiers faciles à analyser et de réutiliser les composants à plus d’endroits.

</Intro>

<YouWillLearn>

* Qu’est-ce qu’un fichier de composant racine
* Comment importer et exporter un composant
* Quand utiliser les imports/exports par défaut et nommés
* Comment importer et exporter plusieurs composants à partir d’un seul fichier
* Comment diviser les composants en plusieurs fichiers

</YouWillLearn>

## Le fichier de composant racine{/*the-root-component-file*/}

Dans [Votre premier composant](/learn/your-first-component), vous avez créé un composant `Profile` et un composant `Gallery`, en voici le code :

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

Ces composants sont déclarés dans un **fichier de composant racine,** nommé `App.js` dans cet exemple. Si vous utilisez [Create React App](https://create-react-app.dev/), votre application se trouve dans `src/App.js`. Selon votre configuration, votre composant racine pourrait être dans un autre fichier. Si vous utilisez un framework avec un système routage basé sur les fichiers, comme Next.js, votre composant racine sera différent pour chaque page.

## Exporter et importer un composant{/*exporting-and-importing-a-component*/}

Et si vous souhaitiez changer l’écran d’accueil à l’avenir et y mettre une liste de livres de science ? Ou encore placer tous les profils ailleurs ? Il est logique de déplacer `Gallery` et `Profile` en dehors du fichier de composant racine. Cela les rendra plus modulaires et réutilisables dans d’autres fichiers. Il est possible déplacer un composant en trois étapes :

1. **Créer** un nouveau fichier JS pour y mettre les composants.
2. **Exporter** votre fonction composant de ce fichier (en utilisant soit les exports [par défaut](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) ou [nommés](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/export#using_named_exports)).
3. **Importer** le dans le fichier où vous utiliserez le composant (en utilisant la technique correspondante pour importer les exports [par défaut](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) ou [nommés](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module)).

Maintenant que les deux composants `Profile` et `Gallery` ont été déplacés du fichier `App.js` vers un nouveau fichier `Gallery.js`, Vous pouvez modifier `App.js` pour importer le composant `Gallery` depuis `Gallery.js` :

<Sandpack>

```js App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js
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

Cet exemple est maintenant divisé en deux fichiers de composants :

1. `Gallery.js`:
     * Définit le composant `Profile` qui n’est utilisé que dans le même fichier et n’est pas exporté.
     * Exporte le composant `Gallery` en tant qu’**export par défaut**.
2. `App.js`:
     * Importe `Gallery` en tant qu’**import par défaut** depuis `Gallery.js`.
     * Exporte le composant racine `App` en tant qu’**export par défaut**.

<Note>

Il se peut que vous rencontriez des fichiers qui omettent l’extension `.js` comme ceci :

```js
import Gallery from './Gallery';
```

`'./Gallery.js'` ou `'./Gallery'` fonctionneront tous les deux avec React, bien que le premier soit plus proche de la façon dont fonctionnent les [modules natifs ES](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules).

</Note>

<DeepDive>

#### Les Exports par défaut versus les exports nommés {/*default-vs-named-exports*/}

Il existe deux façons principales d’exporter des valeurs avec JavaScript : les exports par défaut et les exports nommés. Jusqu’à présent, nos exemples n’ont utilisé que des exports par défaut. Mais vous pouvez utiliser l’un ou l’autre, ou les deux, dans le même fichier. **Un fichier ne peut avoir qu’un seul export *par défaut*, mais il peut avoir autant d’exports *nommés* que vous le souhaitez.**

![Exports par défaut et nommés](/images/docs/illustrations/i_import-export.svg)

La manière dont vous exportez votre composant dicte la manière dont vous devez l’importer. Vous obtiendrez une erreur si vous essayez d’importer un export par défaut de la même manière que vous le feriez avec un export nommé ! Ce tableau peut vous aider à vous y retrouver :

| Syntaxe           | Déclaration d’exportation                           | Déclaration d’importation                          |
| -----------      | -----------                                | -----------                               |
| Par défaut  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Nommé    | `export function Button() {}`         | `import { Button } from './Button.js';` |

Lorsque vous utilisez un *import par défaut*, vous pouvez mettre n’importe quel nom après `import`. Par exemple, vous pourriez écrire `import Banana from './Button.js'` et cela vous fournirait toujours la même exportation par défaut. En revanche, avec les imports nommés, le nom doit correspondre des deux côtés. C'est pour ça qu'on les appelent les imports *nommés*.

**On utilise souvent les exports par défaut si le fichier n’exporte qu’un seul composant, et les exports nommés si l'on souhaite exporter plusieurs composants et valeurs.** Quel que soit le style de développement que vous préférez, donnez toujours des noms significatifs à vos fonctions composants et aux fichiers qui les contiennent. Les composants sans noms, comme `export default () => {}`, sont découragés car ils rendent le débogage plus difficile.

</DeepDive>

## Exporter et importer plusieurs composants depuis le même fichier {/*exporting-and-importing-multiple-components-from-the-same-file*/}

Et si vous vouliez afficher un seul `Profile` au lieu d’une galerie ? Vous pouvez également exporter le composant `Profile`. Mais `Gallery.js` a déjà un export *par défaut*, et vous ne pouvez pas en avoir *deux* dans un même fichier. Dans ce cas, vous pouvez créer un nouveau fichier avec un export par défaut, ou ajouter un export *nommé* pour le composant `Profile`. **Un fichier ne peut avoir qu’un seul export par défaut, mais il peut avoir de nombreux exports nommés !**

<Note>

Pour réduire la confusion potentielle entre les exports par défaut et nommés, certaines équipes choisissent de ne s’en tenir qu’à un seul style (par défaut ou nommé), ou évitent simplement de les mélanger dans un seul fichier. Faites ce qui vous convient le mieux !

</Note>

Tout d’abord, **exportez** `Profile` depuis `Gallery.js` en utilisant un export nommé (sans le mot-clé `default`) :

```js
export function Profile() {
  // ...
}
```

Puis, **importez** `Profile` depuis `Gallery.js` vers `App.js` en utilisant un import nommé (avec les accolades) :

```js
import { Profile } from './Gallery.js';
```

Enfin, **Affichez** `<Profile />` depuis le composant `App` :

```js
export default function App() {
  return <Profile />;
}
```

Désormais, `Gallery.js` contient deux exports : un export par défaut : `Gallery`, et un export nommé : `Profile`. `App.js` les importe maintenant les 2 composants. Essayez d’éditer `<Profile />` en `<Gallery />` et inversement dans cet exemple :

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js Gallery.js
export function Profile() {
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

Dorénavant, vous utilisez un mélange d’exports par défaut et nommés :

* `Gallery.js`:
  * Exporte le composant `Profile` en tant qu’**export nommé appelé `Profile`.**
  * Exporte le composant `Gallery` en tant qu’**export par défaut.**
* `App.js`:
  * Importe `Profile` en tant qu’**import nommé appelé `Profile`** depuis `Gallery.js`.
  * Importe `Gallery` en tant qu’**import par défaut** depuis `Gallery.js`.
  * Exporte le composant racine `App` en tant qu’**export par défaut.**

<Recap>

Dans cette page, vous avez appris :

* Qu’est-ce qu’un fichier de composant racine
* Comment importer et exporter un composant
* Comment et quand utiliser les imports/exports par défaut et nommés
* Comment importer plusieurs composants depuis le même fichier

</Recap>



<Challenges>

#### Séparer les composants davantage {/*split-the-components-further*/}

Actuellement, `Gallery.js` exporte à la fois `Profile` et `Gallery`, ce qui est un peu confus.

Déplacez le composant `Profile` vers son propre fichier `Profile.js`, puis modifiez le composant `App` pour qu’il affiche à la fois `<Profile />` et `<Gallery />` l'un après l’autre.

Vous devrier utiliser soit un export par défaut, soit un export nommé pour le composant `Profile`, mais assurez-vous d’utiliser la syntaxe d’importation correspondante dans `App.js` et `Gallery.js` ! N'hésitez pas à vous référer au tableau de la partie "En détail" ci-dessus :

| Syntaxe           | Déclaration d’exportation                           | Déclaration d’importation                          |
| -----------      | -----------                                | -----------                               |
| Par défaut  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Nommé    | `export function Button() {}`         | `import { Button } from './Button.js';` |

<Hint>

N’oublier pas d’importer vos composants là où ils sont appelés. `Gallery` n’utilise-t-il pas aussi `Profile` ?

</Hint>

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js Gallery.js active
// Déplace-moi vers Profile.js !
export function Profile() {
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
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Après avoir réussi à faire fonctionner votre composant avec un type d’export, faites-le fonctionner avec l’autre type.

<Solution>

Voici la solution avec les exports nommés :

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import { Profile } from './Profile.js';

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

```js Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Voici la solution avec les exports par défaut :

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import Profile from './Profile.js';

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

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>
