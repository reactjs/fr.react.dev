---
title: Importer et exporter des composants
---

<Intro>

La magie des composants réside dans leur réutilisabilité : vous pouvez créer des composants qui sont composés d’autres composants. Mais plus vous imbriquez de composants, plus il devient judicieux de les répartir en différents fichiers. Ça vous permet de garder vos fichiers faciles à analyser et de réutiliser les composants à davantage d’endroits.

</Intro>

<YouWillLearn>

* Qu’est-ce qu’un fichier de composant racine
* Comment importer et exporter un composant
* Quand utiliser les imports/exports par défaut et nommés
* Comment importer et exporter plusieurs composants à partir d’un seul fichier
* Comment découper les composants en plusieurs fichiers

</YouWillLearn>

## Le fichier de composant racine {/*the-root-component-file*/}

Dans [Votre premier composant](/learn/your-first-component), vous avez créé un composant `Profile`, ainsi qu'un second composant `Gallery` qui l'affiche :

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

Ces composants sont actuellement déclarés dans un **fichier de composant racine**, nommé `App.js` dans cet exemple. Selon votre configuration, votre composant racine pourrait toutefois être dans un autre fichier. Si vous utilisez un framework avec un système de routage basé sur les fichiers, comme par exemple Next.js, votre composant racine sera différent pour chaque page.

## Exporter et importer un composant {/*exporting-and-importing-a-component*/}

Et si vous souhaitiez changer l’écran d’accueil à l’avenir et y mettre une liste de livres de science ? Ou encore placer tous les profils ailleurs ? Il est logique de déplacer `Gallery` et `Profile` en dehors du fichier de composant racine. Ça les rendra plus modulaires et réutilisables par d’autres fichiers. Vous pouvez déplacer un composant en trois étapes :

1. **Créez** un nouveau fichier JS pour y mettre les composants.
2. **Exportez** votre fonction composant à partir de ce fichier (en utilisant soit les exports [par défaut](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/export#utilisation_dexports_par_d%C3%A9faut) soit les exports [nommés](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/export#utilisation_dexports_nomm%C3%A9s)).
3. **Importez-la** dans le fichier qui utilisera le composant (en utilisant la technique correspondante pour importer les exports [par défaut](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/import#importation_des_d%C3%A9fauts) ou [nommés](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/import#importer_un_seul_export_depuis_un_module)).

À présent que les deux composants `Profile` et `Gallery` ont été déplacés du fichier `App.js` vers un nouveau fichier `Gallery.js`, Vous pouvez modifier `App.js` pour importer le composant `Gallery` depuis `Gallery.js` :

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js
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

Voyez comme cet exemple est désormais découpé en deux fichiers de composants :

1. `Gallery.js`:
     * Définit le composant `Profile` qui n’est utilisé qu'au sein de ce même fichier et n’est pas exporté.
     * Exporte le composant `Gallery` en tant qu’**export par défaut**.
2. `App.js`:
     * Importe `Gallery` en tant qu’**import par défaut** depuis `Gallery.js`.
     * Exporte le composant racine `App` en tant qu’**export par défaut**.

<Note>

Il se peut que vous rencontriez des fichiers qui omettent l’extension `.js` comme ceci :

```js
import Gallery from './Gallery';
```

`'./Gallery.js'` ou `'./Gallery'` fonctionneront tous les deux avec React, bien que la première syntaxe soit plus proche du fonctionnement des [modules ES natifs](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules).

</Note>

<DeepDive>

#### Exports par défaut vs. exports nommés {/*default-vs-named-exports*/}

Il existe deux façons principales d’exporter des valeurs avec JavaScript : les exports par défaut et les exports nommés. Jusqu’à présent, nos exemples n’ont utilisé que des exports par défaut. Mais vous pouvez utiliser l’un ou l’autre, ou les deux, dans le même fichier. **Un fichier ne peut avoir qu’un seul export *par défaut*, mais il peut avoir autant d’exports *nommés* que vous le souhaitez.**

![Exports par défaut et nommés](/images/docs/illustrations/i_import-export.svg)

La manière dont vous exportez votre composant dicte la manière dont vous devez l’importer. Vous obtiendrez une erreur si vous essayez d’importer un export par défaut de la même manière que vous le feriez pour un export nommé ! Ce tableau peut vous aider à vous y retrouver :

| Syntaxe           | Déclaration d’export                           | Déclaration d’import                          |
| -----------      | -----------                                | -----------                               |
| Par défaut  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Nommé    | `export function Button() {}`         | `import { Button } from './Button.js';` |

Lorsque vous utilisez un *import par défaut*, vous pouvez mettre n’importe quel nom après `import`. Par exemple, vous pourriez écrire `import Banana from './Button.js'` et ça vous fournirait toujours le même export par défaut. En revanche, avec les imports nommés, le nom doit correspondre des deux côtés. C'est pour ça qu'on parle d'imports *nommés*.

**On utilise souvent les exports par défaut si le fichier n’exporte qu’un seul composant, et les exports nommés si l'on souhaite exporter plusieurs composants et valeurs.** Quel que soit le style de développement que vous préférez, donnez toujours des noms descriptifs à vos fonctions composants et aux fichiers qui les contiennent. Les composants anonymes, du genre `export default () => {}`, sont à proscrire car ils rendent le débogage plus difficile.

</DeepDive>

## Exporter et importer plusieurs composants depuis le même fichier {/*exporting-and-importing-multiple-components-from-the-same-file*/}

Et si vous vouliez afficher un seul `Profile` au lieu d’une galerie ? Vous pouvez également exporter le composant `Profile`. Mais `Gallery.js` a déjà un export *par défaut*, et vous ne pouvez pas en avoir *deux* dans un même fichier. Dans ce cas, vous pouvez créer un nouveau fichier avec un export par défaut, ou ajouter un export *nommé* pour le composant `Profile`. **Un fichier ne peut avoir qu’un seul export par défaut, mais il peut avoir de nombreux exports nommés !**

<Note>

Pour réduire la confusion potentielle entre les exports par défaut et nommés, certaines équipes choisissent de ne s’en tenir qu’à un seul style (par défaut ou nommé), ou évitent simplement de les mélanger dans un seul fichier. Faites ce qui vous convient le mieux !

</Note>

Tout d’abord, **exportez** `Profile` depuis `Gallery.js` en utilisant un export nommé (sans le mot-clé `default`) :

```js
export function Profile() {
  // ...
}
```

Puis, **importez** `Profile` depuis `Gallery.js` dans `App.js` en utilisant un import nommé (avec les accolades) :

```js
import { Profile } from './Gallery.js';
```

Enfin, **affichez** `<Profile />` depuis le composant `App` :

```js
export default function App() {
  return <Profile />;
}
```

Désormais, `Gallery.js` contient deux exports : un export par défaut `Gallery`, et un export nommé `Profile`. `App.js` importe à présent les deux. Essayez de passer de `<Profile />` à `<Gallery />` et inversement dans cet exemple :

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js src/Gallery.js
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

Vous utilisez à présent un mélange d’exports par défaut et nommés :

* `Gallery.js`:
  * Exporte le composant `Profile` en tant qu’**export nommé appelé `Profile`**.
  * Exporte le composant `Gallery` en tant qu’**export par défaut**.
* `App.js`:
  * Importe `Profile` en tant qu’**import nommé appelé `Profile`** depuis `Gallery.js`.
  * Importe `Gallery` en tant qu’**import par défaut** depuis `Gallery.js`.
  * Exporte le composant racine `App` en tant qu’**export par défaut**.

<Recap>

Dans cette page, vous avez appris :

* Ce qu'est un fichier de composant racine
* Comment importer et exporter un composant
* Quand et comment utiliser les imports/exports par défaut et nommés
* Comment importer plusieurs composants depuis le même fichier

</Recap>



<Challenges>

#### Découper davantage les composants {/*split-the-components-further*/}

Pour le moment, `Gallery.js` exporte à la fois `Profile` et `Gallery`, ce qui est un peu déroutant.

Déplacez le composant `Profile` vers son propre fichier `Profile.js`, puis modifiez le composant `App` pour qu’il affiche à la fois `<Profile />` et `<Gallery />` l'un après l’autre.

Vous pouvez utiliser soit un export par défaut, soit un export nommé pour le composant `Profile`, mais assurez-vous d’utiliser la syntaxe d’importation correspondante dans `App.js` et `Gallery.js` ! N'hésitez pas à vous référer au tableau de la partie « En détail » vue plus tôt :

| Syntaxe           | Déclaration d’export                           | Déclaration d’import                          |
| -----------      | -----------                                | -----------                               |
| Par défaut  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Nommé    | `export function Button() {}`         | `import { Button } from './Button.js';` |

<Hint>

N’oubliez pas d’importer vos composants là où ils sont appelés. `Gallery` n’utilise-t-il pas lui aussi `Profile` ?

</Hint>

<Sandpack>

```js src/App.js
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

```js src/Gallery.js active
// Déplace-moi vers Profile.js !
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

```js src/Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Après avoir réussi à faire fonctionner votre composant avec un type d’export, faites-le fonctionner avec l’autre type.

<Solution>

Voici la solution avec les exports nommés :

<Sandpack>

```js src/App.js
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

```js src/Gallery.js
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

```js src/Profile.js
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

Voici la solution avec les exports par défaut :

<Sandpack>

```js src/App.js
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

```js src/Gallery.js
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

```js src/Profile.js
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
