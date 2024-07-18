---
link: "<link>"
canary: true
---

<Canary>

Les extensions de React à `<link>` ne sont actuellement disponibles que sur les canaux de livraison Canary et Expérimental de React. Dans les versions stables de React, `<link>` fonctionne comme [le composant HTML natif du navigateur](/reference/react-dom/components#all-html-components). Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

Le [composant natif `<link>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/link) vous permet d'utiliser des ressources externes telles que des feuilles de styles, ou d'annoter le document avec des métadonnées de type lien.

```js
<link rel="icon" href="favicon.ico" />
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `<link>` {/*link*/}

Pour établir un lien vers des ressources externes telles que des feuilles de styles, fontes et icônes, ou pour annoter le document avec des métadonnées de type lien, utilisez le [composant natif `<link>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/link). Vous pouvez utiliser `<link>` depuis n'importe quel composant et React, [la plupart du temps](#special-rendering-behavior), placera l'élément DOM correspondant dans l'en-tête (`head`) du document.

```js
<link rel="icon" href="favicon.ico" />
```

[Voir d'autres exemples plus bas](#usage).

#### Props {/*props*/}

`<link>` prend en charge toutes les [props communes aux éléments](/reference/react-dom/components/common#props).

* `rel` : une chaîne de caractères obligatoire. Spécifie la [relation à la ressource](https://developer.mozilla.org/fr/docs/Web/HTML/Attributes/rel). React [traite les liens avec `rel="stylesheet"` différemment](#special-rendering-behavior) des autres liens.

Ces props sont disponibles lorsque `rel="stylesheet"` :

* `precedence` : une chaîne de caractères. Indique à React où placer le nœud DOM `<link>` par rapport aux autres présents dans le `<head>` du document, ce qui détermine quelle feuille de styles a priorité sur quelle autre. React déduira que les valeurs de précédence qu'il rencontre en premier sont « plus faibles » et que celles qu'il rencontre plus tard sont « plus fortes ». De nombreux systèmes de gestion de styles fonctionneront très bien avec une unique valeur de précédence, parce que les règles de styles y sont atomiques. Les feuilles de style de même précédence sont regroupées, qu'il s'agisse de balises `<link>` ou `<style>`, y compris si elles sont chargées *via* la fonction [`preinit`](/reference/react-dom/preinit).
* `media` : une chaîne de caractères. Restreint la feuille de styles à une [media query](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_media_queries/Using_media_queries) spécifique.
* `title` : une chaîne de caractères. Indique le nom d'une [feuille de styles alternative](https://developer.mozilla.org/fr/docs/Web/CSS/Alternative_style_sheets).

Ces props sont disponibles lorsque `rel="stylesheet"` mais elles désactivent le [traitement spécial des feuilles de style](#special-rendering-behavior) par React :

* `disabled` : un booléen. Désactive la feuille de styles.
* `onError` : une fonction. Appelée lorsque le chargement de la feuille de styles échoue.
* `onLoad` : une fonction. Appelée lorsque le chargement de la feuille de styles est terminé.

Ces props sont disponibles lorsque `rel="preload"` ou `rel="modulepreload"` :

* `as` : une chaîne de caractères. Indique le type de ressource. Les valeurs possibles sont `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video` ou `worker`.
* `imageSrcSet` : une chaîne de caractères, utilisable uniquement lorsque `as="image"`. Indique le [jeu de sources de l'image](https://developer.mozilla.org/fr/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
* `imageSizes` : une chaîne de caractères, utilisable uniquement lorsque `as="image"`. Indique le [jeu de tailles de l'image](https://developer.mozilla.org/fr/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

Ces props sont disponibles lorsque `rel="icon"` ou `rel="apple-touch-icon"` :

* `sizes` : une chaîne de caractères. Les [tailles de l'icône](https://developer.mozilla.org/fr/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

Ces props sont disponibles dans tous les cas :

* `href` : une chaîne de caractères. L'URL de la ressource liée.
*  `crossOrigin` : une chaîne de caractères. La [politique CORS](https://developer.mozilla.org/fr/docs/Web/HTML/Attributes/crossorigin) à utiliser. Les valeurs possibles sont `anonymous` et `use-credentials`.  Elle est obligatoire lorsque `as` vaut `"fetch"`.
*  `referrerPolicy` : une chaîne de caractères. [L'en-tête Referrer](https://developer.mozilla.org/fr/docs/Web/HTML/Element/link#referrerpolicy) à envoyer lors du chargement. Les valeurs possibles sont `no-referrer-when-downgrade` (par défaut), `no-referrer`, `origin`, `origin-when-cross-origin` ou `unsafe-url`.
* `fetchPriority` : une chaîne de caractères. Suggère une priorité relative pour le chargement de la ressource. Les valeurs possibles sont `auto` (par défaut), `high` ou `low`.
* `hrefLang` : une chaîne de caractères. La langue de la ressource liée.
* `integrity` : une chaîne de caractères. Une empreinte cryptographique de la ressource afin de [vérifier son authenticité](https://developer.mozilla.org/fr/docs/Web/Security/Subresource_Integrity).
* `type` : une chaîne de caractères. Le type MIME de la ressource liée.

Ces props sont **déconseillées** pour une utilisation avec React :

* `blocking` : une chaîne de caractères. Si elle vaut `"render"`, le navigateur attendra pour afficher la page que la feuille de styles ait fini son chargement.  React permet un contrôle plus granulaire grâce à Suspense.

#### Comportement spécifique de rendu {/*special-rendering-behavior*/}

React placera toujours l'élément DOM correspondant au composant `<link>` dans le `<head>` du document, peu importe où il figure dans l'arborescence React. Le `<head>` est le seul endroit valide pour un `<link>` dans le DOM, mais il est plus confortable, et préférable en termes de composition, qu'un composant représentant une page donnée puisse produire les composants `<link>` lui-même.

Il y a toutefois quelques exceptions :

- Si le `<link>` a une prop `rel="stylesheet"`, il doit également disposer d'une prop `precedence` pour bénéficier de ce traitement. C'est parce que l'ordre des feuilles de style dans un document n'est pas anodin, de sorte que React a besoin de savoir où placer la feuille de styles par rapport aux autres, ce que vous lui indiquez avec la prop `precedence`.  Si la prop `precedence` est manquante, le composant ne sera pas injecté dans le `<head>`.
* Si le `<link>` a une prop [`itemProp`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/itemprop), aucun comportement spécifique n'est mis en place, parce que dans un tel cas le lien ne s'applique pas au document, il fournit au contraire des métadonnées sur l'emplacement spécifique de la page où il figure.
* Si le `<link>` a une prop `onLoad` ou `onError`, le comportement est là aussi absent puisque vous gérez manuellement le chargement de la ressource liée au sein de votre composant React.

#### Comportement spécifique aux feuilles de styles {/*special-behavior-for-stylesheets*/}

Qui plus est, si le `<link>` est une feuille de styles (en d'autres termes, ses props comportent `rel="stylesheet"`), React ajoutera le comportement spécifique que voici :

* Le composant qui utilise `<link>` [suspendra](/reference/react/Suspense) pendant le chargement de la feuille de styles.
* Si plusieurs composants produisent des liens vers la même feuille de styles, React les dédoublonnera et ne placera qu'un lien dans le DOM. Deux liens sont considérés identiques s'ils ont la même valeur de prop `href`.

Ce comportement connaît toutefois deux exceptions :

* Si le lien n'a pas de prop `precedence`, aucun comportement spécifique n'est fourni, parce que l'ordre des feuilles de styles dans un document n'est pas anodin, de sorte que React a besoin de savoir où placer la feuille de style par rapport aux autres, ce que vous lui indiquez avec la prop `precedence`.
* Si vous fournissez une prop `onLoad`, `onError` ou `disabled`, le comportement est là aussi absent puisque vous gérez manuellement le chargement de la ressource liée au sein de votre composant React.

Pour finir, ce comportement a deux limitations :

* React ignorera les changements à ces props après le rendu du lien. (React produira un avertissement en développement si ce cas survient.)
* React est susceptible de laisser le lien dans le DOM même après le démontage du composant qui l'a produit.

---

## Utilisation {/*usage*/}

### Lier des ressources associées {/*linking-to-related-resources*/}

Vous pouvez annoter le document avec des liens vers ressources associées telles qu'un icône, une URL canonique ou un _pingback_. React placera ces métadonnées dans le `<head>` du document, indépendamment de leur emplacement dans l'arborescence React.

<SandpackWithHTMLOutput>

```js App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function BlogPage() {
  return (
    <ShowRenderedHTML>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>Mon blog</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Lier une feuille de styles {/*linking-to-a-stylesheet*/}

Si un composant dépend d'une certaine feuille de styles pour s'afficher correctement, vous pouvez produire un lien vers cette feuille de styles depuis le composant. Votre composant [suspendra](/reference/react/Suspense) le temps que la feuille de styles se charge. Vous pouvez fournir une prop `precedence` qui indiquera à React où injecter la feuille par rapport aux autres — les feuilles de styles avec une précédence plus forte pourront surcharger celles avec une précédence plus faible.

<Note>

Lorsque vous souhaitez utiliser une feuille de styles, il peut être avantageux d'appeler la fonction [`preinit`](/reference/react-dom/preinit). Appeler cette fonction peut permettre au navigateur de commencer à charger la feuille de styles plus tôt que lorsque vous produisez simplement un composant `<link>`, en envoyant par exemple une [réponse HTTP Early Hints](https://developer.mozilla.org/fr/docs/Web/HTTP/Status/103).

</Note>

<SandpackWithHTMLOutput>

```js App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <link rel="stylesheet" href="sitemap.css" precedence="medium" />
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Contrôler la priorisation des feuilles de styles {/*controlling-stylesheet-precedence*/}

Les feuilles de styles peuvent entrer en conflit, et lorsque c'est le cas, le navigateur favorise celle listée le plus tard dans le document. React vous permet de contrôler l'ordre de vos feuilles de styles avec la prop `precedence`.  Dans cet exemple, deux composants injectent des feuilles de styles, et celle avec la plus forte précédence est injectée plus tard dans le document, même si le composant qui la produit est situé plus tôt.

{/*FIXME: this doesn't appear to actually work -- I guess precedence isn't implemented yet?*/}

<SandpackWithHTMLOutput>

```js App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <FirstComponent />
      <SecondComponent />
      ...
    </ShowRenderedHTML>
  );
}

function FirstComponent() {
  return <link rel="stylesheet" href="first.css" precedence="high" />;
}

function SecondComponent() {
  return <link rel="stylesheet" href="second.css" precedence="low" />;
}

```

</SandpackWithHTMLOutput>

### Dédoublonnement des feuilles de styles {/*deduplicated-stylesheet-rendering*/}

Si vous injectez la même feuille de styles depuis plusieurs composants, React n'injectera qu'un seul `<link>` dans l'en-tête du document.

<SandpackWithHTMLOutput>

```js App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <Component />
      <Component />
      ...
    </ShowRenderedHTML>
  );
}

function Component() {
  return <link rel="stylesheet" href="styles.css" precedence="medium" />;
}
```

</SandpackWithHTMLOutput>

### Annoter des éléments spécifiques du document avec des liens {/*annotating-specific-items-within-the-document-with-links*/}

Vous pouvez utiliser le composant `<link>` avec la prop `itemProp` pour annoter des éléments spécifiques du document avec des liens vers des ressources associées. Dans ce cas, React, n'injectera *pas* ces annotations dans le `<head>` du document, mais les placera comme n'importe quel autre composant React.

```js
<section itemScope>
  <h3>Annotation d’éléments spécifiques</h3>
  <link itemProp="author" href="http://example.com/" />
  <p>...</p>
</section>
```
