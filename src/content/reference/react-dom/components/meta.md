---
meta: "<meta>"
canary: true
---

<Canary>

Les extensions de React à `<meta>` ne sont actuellement disponibles que sur les canaux de livraison Canary et Expérimental de React. Dans les versions stables de React, `<meta>` fonctionne comme [le composant HTML natif du navigateur](/reference/react-dom/components#all-html-components). Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>


<Intro>

Le [composant natif `<meta>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/meta) vous permet d'ajouter des métadonnées au document ou à des éléments spécifiques.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `<meta>` {/*meta*/}

Pour ajouter des métadonnées au document, utilisez le [composant natif `<meta>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/meta). Vous pouvez utiliser `<meta>` depuis n'importe quel composant et React placera systématiquement l'élément DOM correspondant dans l'en-tête (`head`) du document.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

[Voir d'autres exemples plus bas](#usage).

#### Props {/*props*/}

`<meta>` prend en charge toutes les [props communes aux éléments](/reference/react-dom/components/common#props).

Il est censé utiliser *une et une seule* des props suivantes : `name`, `httpEquiv`, `charset` ou `itemProp`. Le composant `<meta>` a un comportement distinct selon la prop que vous utilisez.

* `name` : une chaîne de caractères. Indique le [type de métadonnée](https://developer.mozilla.org/fr/docs/Web/HTML/Element/meta/name) à associer au document. 
* `charset` : une chaîne de caractères. Indique le jeu de caractères à utiliser pour le document. La seule valeur acceptable est `"utf-8"`.
* `httpEquiv` : une chaîne de caractères. Fournit une directive de traitement du document.
* `itemProp` : une chaîne de caractères. Associe la métadonnée à un élément spécifique du document plutôt qu'au document dans son ensemble.
* `content` : une chaîne de caractères. Fournit la valeur de la métadonnée lorsque la prop utilisée est `name` ou `itemProp`, ou le comportement de la directive lorsque la prop `httpEquiv` est utilisée.

#### Comportement spécifique de rendu {/*special-rendering-behavior*/}

React placera toujours l'élément DOM correspondant au composant `<meta>` dans le `<head>` du document, peu importe où il figure dans l'arborescence React. Le `<head>` est le seul endroit valide pour un `<link>` dans le DOM, mais il est plus confortable, et préférable en termes de composition, qu'un composant représentant une page donnée puisse produire les composants `<link>` lui-même.

Il y a toutefois une exception : si le `<meta>` a une prop [`itemProp`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemprop), aucun comportement spécifique n'est mis en place, parce que dans un tel cas la métadonnée ne s'applique pas au document mais à une partie spécifique de la page.

---

## Utilisation {/*usage*/}

### Annoter le document avec des métadonnées {/*annotating-the-document-with-metadata*/}

Vous pouvez annoter le document avec des métadonnées telles que des mots-clés, un résumé, ou encore l'identité de son auteur·e.  React placera ces métadonnées dans le `<head>`, peu importe où `<meta>` figure dans l'arborescence React.

```html
<meta name="author" content="John Smith" />
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
<meta name="description" content="Référence API pour le composant <meta> de React DOM" />
```

Vous pouvez utiliser le composant `<meta>` depuis n'importe quel emplacement. React injectera toujours le nœud DOM correspodant dans le `<head>` du document.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <meta name="keywords" content="React" />
      <meta name="description" content="Un plan du site web de React" />
      <h1>Plan du site</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Annoter des éléments spécifiques du document avec des métadonnées {/*annotating-specific-items-within-the-document-with-metadata*/}

Vous pouvez utiliser le composant `<meta>` avec la prop `itemProp` pour annoter des éléments spécifiques avec des métadonnées.  Dans de tels cas, React *ne placera pas* ces métadonnées dans le `<head>`, mais les traitera comme n'importe quel autre composant React.

```js
<section itemScope>
  <h3>Annoter des éléments spécifiques</h3>
  <meta itemProp="description" content="Référence API pour l’utilisation de <meta> avec itemProp" />
  <p>...</p>
</section>
```
