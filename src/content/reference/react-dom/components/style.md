---
style: "<style>"
canary: true
---

<Canary>

Les extensions de React à `<style>` ne sont actuellement disponibles que sur les canaux de livraison Canary et Expérimental de React. Dans les versions stables de React, `<style>` fonctionne comme [le composant HTML natif du navigateur](/reference/react-dom/components#all-html-components). Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

Le [composant natif `<style>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/style) vous permet d'ajouter des feuilles de styles définies à la volée dans votre document.

```js
<style>{` p { color: red; } `}</style>
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `<style>` {/*style*/}

Pour ajouter une feuille de styles définie à la volée dans votre document, utilisez le [composant natif `<style>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/style). Vous pouvez utiliser `<style>` depuis n'importe quel composant et React placera [dans certains cas](#special-rendering-behavior) l'élément DOM correspondant dans l'en-tête (`head`) du document et dédoublonnera les styles identiques.

```js
<style>{` p { color: red; } `}</style>
```

[Voir d'autres exemples plus bas](#usage).

#### Props {/*props*/}

`<style>` prend en charge toutes les [props communes aux éléments](/reference/react-dom/components/common#props).

<<<<<<< HEAD
* `children` : une chaîne de caractères, obligatoire. Le code source de la feuille de styles définie à la volée.
* `precedence` : une chaîne de caractères. Indique à React où placer le nœud DOM `<style>` par rapport aux autres présents dans le `<head>` du document, ce qui détermine quelle feuille de styles a priorité sur quelle autre. La valeur peut être (par ordre de précédence) `"reset"`, `"low"`, `"medium"` ou `"high"`. Les feuilles de styles de même précédence sont regroupées, qu'il s'agisse de balises `<link>` ou `<style>`, y compris si elles sont chargées *via* les fonctions [`preload`](/reference/react-dom/preload) ou [`preinit`](/reference/react-dom/preinit).
* `href` : une chaîne de caractères. Permet à React de [dédoublonner les styles](#special-rendering-behavior) qui auraient le même `href`.
* `media` : une chaîne de caractères. Restreint la feuille de styles à une [media query](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_media_queries/Using_media_queries) spécifique.
* `nonce` : une chaîne de caractères. Un [nonce cryptographique autorisant la ressource](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/nonce) dans le cadre d'une Politique de Sécurité de Contenu (CSP) stricte.
* `title` : une chaîne de caractères. Indique le nom d'une [feuille de styles alternative](https://developer.mozilla.org/fr/docs/Web/CSS/Alternative_style_sheets).
=======
* `children`: a string, required. The contents of the stylesheet.
* `precedence`: a string. Tells React where to rank the `<style>` DOM node relative to others in the document `<head>`, which determines which stylesheet can override the other. React will infer that precedence values it discovers first are "lower" and precedence values it discovers later are "higher". Many style systems can work fine using a single precedence value because style rules are atomic. Stylesheets with the same precedence go together whether they are `<link>` or inline `<style>` tags or loaded using [`preinit`](/reference/react-dom/preinit) functions.
* `href`: a string. Allows React to [de-duplicate styles](#special-rendering-behavior) that have the same `href`.
* `media`: a string. Restricts the stylesheet to a certain [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries).
* `nonce`: a string. A cryptographic [nonce to allow the resource](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) when using a strict Content Security Policy.
* `title`: a string. Specifies the name of an [alternative stylesheet](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).
>>>>>>> c3bc5affa0e7452e306c785af11798d16b4f6dd4

Ces props sont **déconseillées** pour une utilisation avec React :

* `blocking` : une chaîne de caractères. Si elle vaut `"render"`, le navigateur attendra pour afficher la page que la feuille de styles ait fini son chargement.  React permet un contrôle plus granulaire grâce à Suspense.

#### Comportement spécifique de rendu {/*special-rendering-behavior*/}

React peut déplacer les composants `<style>` dans le `<head>` du document, dédoublonner les feuilles de styles identiques et [suspendre](/reference/react/Suspense) pendant le chargement de la feuille de styles.

Pour activer ces comportements, fournissez les props `href` et `precedence`.  React dédoublonnera les feuilles de styles qui ont le même `href`.  La précédence indique à React où placer le nœud DOM `<style>` par rapport aux autres dans le `<head>` du document, ce qui détermine quelle feuille de styles peut surcharger quelle autre.

Pour finir, ce comportement a deux limitations :

* React ignorera les changements à ces props après le rendu de la feuille de styles. (React produira un avertissement en développement si ce cas survient.)
* React est susceptible de laisser la feuille de styles dans le DOM même après le démontage du composant qui l'a produit.

---

## Utilisation {/*usage*/}

### Injecter une feuille de styles définie à la volée {/*rendering-an-inline-css-stylesheet*/}

Si un composant dépend de certains styles CSS pour pouvoir fonctionner correctement, vous pouvez injecter une feuille de styles définie à la volée au sein de ce composant.

Si vous fournissez les props `href` et `precedence`,  votre composant suspendra le temps du chargement de la feuille de styles. (Même pour des feuilles définies à la volée, il peut y avoir un temps de chargement en raison de ressources extérieures référencées par les styles, telles que des fontes ou images.)  La prop `href` devrait identifier la feuille de styles de façon unique, car React dédoublonnera les feuilles de styles de même `href`.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';
import { useId } from 'react';

function PieChart({data, colors}) {
  const id = useId();
  const stylesheet = colors.map((color, index) =>
    `#${id} .color-${index}: \{ color: "${color}"; \}`
  ).join();
  return (
    <>
      <style href={"PieChart-" + JSON.stringify(colors)} precedence="medium">
        {stylesheet}
      </style>
      <svg id={id}>
        …
      </svg>
    </>
  );
}

export default function App() {
  return (
    <ShowRenderedHTML>
      <PieChart data="..." colors={['red', 'green', 'blue']} />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
