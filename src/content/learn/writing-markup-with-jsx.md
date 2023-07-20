---
title: Écrire du balisage avec JSX
---

<Intro>

*JSX* est une extension de syntaxe pour JavaScript qui vous permet d'écrire du balisage similaire au HTML au sein d'un fichier JavaScript.  Même s'il existe d'autres façons d'écrire des composants, la plupart des personnes qui développent avec React préfèrent la concision de JSX, et la quasi totalité des bases de code s'en servent.

</Intro>

<YouWillLearn>

* Pourquoi React mélange le balisage et la logique de rendu
* En quoi JSX diffère de HTML
* Comment afficher des informations avec JSX

</YouWillLearn>

## JSX : mettre du balisage dans JavaScript {/*jsx-putting-markup-into-javascript*/}

Le Web est construit avec HTML, CSS et JavaScript.  Durant de nombreuses années, les devs web séparaient soigneusement le contenu dans HTML, le design dans CSS, et la logique dans JavaScript — bien souvent dans des fichiers distincts !  Le contenu était balisé dans du HTML tandis que la logique de la page vivait dans son coin, dans un fichier JavaScript :

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="Du balisage HTML sur un fond mauve, contenant une div et deux balises enfants : p et form.">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Trois gestionnaires JavaScript sur un fond sable : onSubmit, onLogin et onClick.">

JavaScript

</Diagram>

</DiagramGroup>

Mais alors que le Web devenait chaque jour plus interactif, la logique déterminait de plus en plus le contenu. JavaScript devenait responsable du HTML !  C'est pourquoi **en React, la logique de rendu et le balisage vivent ensemble au même endroit : les composants**.

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="Un composant React avec du HTML et du JavaScript mélangeant les exemples précédents.  La nom de la fonction est Sidebar, qui appelle la fonction isLoggedIn, mise en exergue en jaune.  Au sein de la fonction, mis en exergue en mauve, on trouve la balise p déjà rencontrée, et une balise Form qui référence le composant du prochain diagramme.">

Composant React `Sidebar.js`

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="Un composant React avec du HTML et du JavaScript mélangeant les exemples précédents. Le nom de la fonction est Form, qui contient deux gestionnaires onClick et onSubmit mis en exergue en jaune.  Ils sont suivis par du HTML, mis en exergue en mauve.  Le HTML contient un élément form doté d'une prop onSubmit avec deux éléments input à l'intérieur, chacun doté d'une prop onClick.">

Composant React `Form.js`

</Diagram>

</DiagramGroup>

Conserver ensemble la logique de rendu d'un bouton et son balisage permet de s'assurer que les deux restent synchronisés à chaque évolution.  Inversement, les détails qui n'ont pas de rapport, comme le balisage du bouton vis-à-vis du balisage de la barre latérale, sont isolés les uns des autres, ce qui évite de modifier l'un par erreur en modifiant l'autre.

Chaque composant React est une fonction JavaScript qui peut contenir du balisage que React affichera à terme dans le navigateur.  Les composants React utilisent une extension de syntaxe appelée JSX qui représente ce balisage.  JSX ressemble beaucoup à HTML, mais il est un peu plus strict et peut afficher des informations dynamiques.  La meilleure façon de comprendre ça consiste à convertir du balisage HTML en balisage JSX.

<Note>

JSX et React sont techniquement séparés. On les utilise souvent ensemble, mais *il est possible* de [les utiliser indépendamment](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform) l'un de l'autre.  JSX est une extension de syntaxe, alors que React est une bibliothèque JavaScript.

</Note>

## Convertir du HTML en JSX {/*converting-html-to-jsx*/}

Supposons que vous ayez du HTML (parfaitement valide) :

```html
<h1>Liste de tâches de Hedy Lamarr</h1>
<img
  src="https://i.imgur.com/yXOvdOSs.jpg"
  alt="Hedy Lamarr"
  class="photo"
>
<ul>
  <li>Inventer de nouveaux feux de circulation
  <li>Répéter une scène de film
  <li>Améliorer les techniques de spectrographie
</ul>
```

Et disons que vous souhaitiez le placer dans votre composant :

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

Si vous le copiez-collez tel quel, ça ne marchera pas :


<Sandpack>

```js
export default function TodoList() {
  return (
    // Ça ne marche pas tout à fait !
    <h1>Liste de tâches de Hedy Lamarr</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Inventer de nouveaux feux de circulation
      <li>Répéter une scène de film
      <li>Améliorer les techniques de spectrographie
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

C'est parce que JSX est plus strict et a davantages de règles que HTML ! Si vous lisez les messages d'erreur ci-dessus, ils vous guideront dans le correction du balisage ; vous pouvez aussi lire le guide ci-dessous.

<Note>

La plupart du temps, les messages d'erreur de React à l'écran vous aideront à trouver l'origine du problème. Prenez la peine de les lire !

</Note>

## Les règles de JSX {/*the-rules-of-jsx*/}

### 1. Renvoyez un seul élément racine {/*1-return-a-single-root-element*/}

Pour renvoyer plusieurs éléments avec votre composant, **enrobez-les dans une balise parent**.

Par exemple, vous pouvez utiliser une `<div>` :

```js {1,11}
<div>
  <h1>Liste de tâches de Hedy Lamarr</h1>
  <img
    src="https://i.imgur.com/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```

Si vous ne voulez pas ajouter une `<div>` superflue à votre balisage, vous pouvez plutôt écrire `<>` et `</>` :

```js {1,11}
<>
  <h1>Liste de tâches de Hedy Lamarr</h1>
  <img
    src="https://i.imgur.com/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

Cette balise vide est ce qu'on appelle un *[Fragment](/reference/react/Fragment)*.  Les Fragments vous permettent de grouper des éléments sans laisser de trace dans l'arbre HTML du navigateur.

<DeepDive>

#### Pourquoi faut-il enrober des balises JSX multiples ? {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX ressemble à HTML, mais sous le capot il est transformé en objets JavaScript bruts.  Vous ne pouvez pas renvoyer deux objets depuis une fonction sans les enrober dans un tableau.  Ça explique pourquoi vous ne pouvez pas non plus renvoyer deux balises JSX sans les enrober dans une autre balise ou un Fragment.

</DeepDive>

### 2. Fermez toutes les balises {/*2-close-all-the-tags*/}

JSX exige que les balises soient explicitement fermées : les balises auto-fermantes telles que `<img>` doivent utiliser `<img />`, et les balises enrobantes telles que `<li>oranges` doivent utiliser `<li>oranges</li>`.

Voici à quoi ressemblent l'image et les tâches de Hedy Lamarr une fois correctement fermées :

```js {2-6,8-10}
<>
  <img
    src="https://i.imgur.com/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
   />
  <ul>
    <li>Inventer de nouveaux feux de circulation</li>
    <li>Répéter une scène de film</li>
    <li>Améliorer les techniques de spectrographie</li>
  </ul>
</>
```

### 3. Utilisez la casseCamel pour (presque) tout ! {/*3-camelcase-salls-most-of-the-things*/}

JSX produit à terme du JavaScript, et les attributs en JSX deviennent des noms de propriétés d'objets JavaScript. Dans vos propres composants vous voudrez souvent lire ces attributs dans des variables. Mais JavaScript limite la syntaxe des noms de variables. Par exemple, ils ne peuvent pas contenir des tirets ou être des mots réservés tels que `class`.

C'est pourquoi, en React, de nombreux attributs HTML et SVG sont écrits en casse Camel *(camelCase, NdT)*.  Par exemple, au lieu de `stroke-width` vous écrirez `strokeWidth`.  Puisque `class` est un mot réservé, en React vous écrirez plutôt `className`, nommé d'après la [propriété DOM correspondante](https://developer.mozilla.org/docs/Web/API/Element/className) :

```js {4}
<img
  src="https://i.imgur.com/yXOvdOSs.jpg"
  alt="Hedy Lamarr"
  className="photo"
/>
```

Vous pouvez [consulter tous les attributs dans la liste des props de composants DOM](/reference/react-dom/components/common). Si vous vous trompez sur l'un d'eux, ne vous inquiétez pas : React vous affichera un message avec une suggestion de correction dans la [console du navigateur](https://developer.mozilla.org/docs/Tools/Browser_Console) *(lien en anglais, NdT)*.

<Pitfall>

Pour des raisons historiques, les attributs [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) et [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) sont écrits comme en HTML, c'est-à-dire avec des tirets.

</Pitfall>

### Astuce : utilisez un convertisseur JSX {/*pro-tip-use-a-jsx-converter*/}

Il est vite fastidieux de convertir tous les attributs d'un balisage existant ! Nous vous conseillons d'utiliser un [convertisseur](https://transform.tools/html-to-jsx) pour produire le JSX correspondant à du HTML et du SVG. Les convertisseurs sont très utiles en pratique, mais ça reste une bonne idée de comprendre ce qui se passe pour que vous puissiez aisément écrire du JSX par vous-même.

Voici notre résultat final :

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Liste de tâches de Hedy Lamarr</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Inventer de nouveaux feux de circulation</li>
        <li>Répéter une scène de film</li>
        <li>Améliorer les techniques de spectrographie</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

Vous savez désormais pourquoi JSX existe et comment l'utiliser dans les composants :

* Les composants React regroupent la logique de rendu et le balisage parce qu'ils ont un lien étroit.
* JSX est similaire à HTML, mais avec quelques différences. Vous pouvez utiliser un [convertisseur](https://transform.tools/html-to-jsx) si besoin.
* Les messages d'erreur vous indiqueront souvent quoi faire pour corriger votre balisage.

</Recap>



<Challenges>

#### Convertir du HTML en JSX {/*convert-some-html-to-jsx*/}

Ce HTML a été copié-collé dans un composant, mais il ne constitue pas du JSX valide. Corrigez-le :

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Bienvenue sur mon site !</h1>
    </div>
    <p class="summary">
      Vous trouverez mes réflexions ici.
      <br><br>
      <b>Et des <i>photos</b></i> de scientifiques !
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

Que vous le fassiez à la main ou en passant par un convertisseur, ça vous regarde !

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Bienvenue sur mon site !</h1>
      </div>
      <p className="summary">
        Vous trouverez mes réflexions ici.
        <br /><br />
        <b>Et des <i>photos</i></b> de scientifiques !
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>
