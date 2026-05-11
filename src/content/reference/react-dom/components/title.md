---
title: "<title>"
---

<<<<<<< HEAD
<Canary>

Les extensions de React à `<title>` ne sont actuellement disponibles que sur les canaux de livraison Canary et Expérimental de React. Dans les versions stables de React, `<title>` fonctionne comme [le composant HTML natif du navigateur](/reference/react-dom/components#all-html-components). Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>


=======
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a
<Intro>

Le [composant natif `<title>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/title) vous permet de préciser le titre de votre document.

```js
<title>Mon blog</title>
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `<title>` {/*title*/}

Pour définir le titre de votre document, utilisez le [composant natif `<title>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/title). Vous pouvez utiliser `<title>` depuis n'importe quel composant et React placera toujours l'élément DOM correspondant dans l'en-tête (`head`) du document.

```js
<title>Mon blog</title>
```

[Voir d'autres exemples plus bas](#usage).

#### Props {/*props*/}

<<<<<<< HEAD
`<title>` prend en charge toutes les [props communes aux éléments](/reference/react-dom/components/common#props).
=======
`<title>` supports all [common element props.](/reference/react-dom/components/common#common-props)
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

* `children` : `<title>` accepte uniquement du texte comme enfant. Ce texte devient le titre du document. Vous pouvez également passer vos propres composants, du moment que leur rendu aboutit à du texte.

#### Comportement spécifique de rendu {/*special-rendering-behavior*/}

<<<<<<< HEAD
React placera toujours l'élément DOM correspondant au composant `<title>` dans le `<head>` du document, peu importe où il figure dans l'arborescence React. Le `<head>` est le seul endroit valide pour un `<title>` dans le DOM, mais il est plus confortable, et préférable en termes de composition, qu'un composant représentant une page donnée puisse produire les composants `<title>` lui-même.

Il y a toutefois deux exceptions :

* Si le `<title>` figure au sein d'un composant `<svg>`, aucun comportement spécifique n'est mis en place, parce que dans un tel cas il ne représente pas le titre du document, mais constitue plutôt une [annotation d'accessibilité pour le graphique SVG](https://developer.mozilla.org/fr/docs/Web/SVG/Element/title).
* Si le `<title>` a une prop [`itemProp`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemprop), aucun comportement spécifique n'est mis en place, parce que dans un tel cas le titre ne s'applique pas au document mais à une partie spécifique de la page.
=======
React will always place the DOM element corresponding to the `<title>` component within the document’s `<head>`, regardless of where in the React tree it is rendered. The `<head>` is the only valid place for `<title>` to exist within the DOM, yet it’s convenient and keeps things composable if a component representing a specific page can render its `<title>` itself.

There are two exception to this:
* If `<title>` is within an `<svg>` component, then there is no special behavior, because in this context it doesn’t represent the document’s title but rather is an [accessibility annotation for that SVG graphic](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title).
* If the `<title>` has an [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) prop, there is no special behavior, because in this case it doesn’t represent the document’s title but rather metadata about a specific part of the page.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

<Pitfall>

Ne produisez qu'un seul `<title>` à la fois au sein de votre rendu.  Si plus d'un composant utilise une balise `<title>` à la fois, React placera l'ensemble de ces titres dans l'en-tête du document.  Dans un tel cas, le comportement des navigateurs comme celui des moteurs de recherche n'est pas spécifié.

</Pitfall>

---

## Utilisation {/*usage*/}

### Définir le titre du document {/*set-the-document-title*/}

Utilisez le composant `<title>` dans n'importe quel composant, avec du texte comme enfant.  React placera le nœud DOM `<title>` associé dans le `<head>` du document.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function ContactUsPage() {
  return (
    <ShowRenderedHTML>
      <title>Mon site : Contactez-nous</title>
      <h1>Contactez-nous</h1>
      <p>Envoyez-nous un e-mail à support@example.com</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Utiliser des variables dans le titre {/*use-variables-in-the-title*/}

Les enfants du composant `<title>` doivent être constitués d'une unique chaîne de caractères. (Ou d'un unique nombre, ou d'un unique objet doté d'une méthode `toString`.)  Ce qui n'est pas immédiatement évident, c'est qu'en utilisant des expressions JSX comme ci-dessous…

```js
<title>Page {pageNumber} de résultats</title> // 🔴 Souci : il ne s’agit pas d’un unique texte
```

…le composant `<title>` reçoit en réalité un tableau de trois éléments comme enfants (le texte`"Page "`, la valeur de `pageNumber` et le texte `" de résultats"`).  Ça entraînerait une erreur.  Utilisez plutôt l'interpolation au sein d'un texte unique passé à `<title>` :

```js
<title>{`Page ${pageNumber} de résultats`}</title>
```
