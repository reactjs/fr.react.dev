---
title: preload
canary: true
---

<Canary>

La fonction `preload` n'est actuellement disponible que sur les canaux de livraison Canary et Expérimental de React. Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

[Les frameworks basés sur React](/learn/start-a-new-react-project) s'occupent fréquemment pour vous du chargement des ressources, de sorte que vous n'aurez peut-être pas besoin d'appeler ces API vous-même.  Consultez la documentation de votre framework pour en savoir plus à ce sujet.

</Note>

<Intro>

`preload` vous permet de charger en avance une ressource telle qu'une feuille de styles, une fonte ou un script extérieurs que vous avez l'intention d'utiliser.

```js
preload("https://example.com/font.woff2", { as: "font" });
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `preload(href, options)` {/*preload*/}

Pour précharger une ressource, appelez la fonction `preload` de `react-dom`.

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/font.woff2", { as: "font" });
  // ...
}

```

[Voir d'autres exemples plus bas](#usage).

La fonction `preload` suggère au navigateur de commencer à télécharger une ressource donnée, ce qui peut faire gagner du temps.

#### Paramètres {/*parameters*/}

* `href` : une chaîne de caractères. L'URL de la ressource que vous souhaitez télécharger.
* `options` : un objet. Il contient les propriétés suivantes :
  *  `as` : une chaîne de caractères obligatoire. Le type de la ressource. Les [valeurs possibles](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#as) sont `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video` et `worker`.
  * `precedence` : une chaîne de caractères. Indique à React où placer le nœud DOM `<style>` par rapport aux autres présents dans le `<head>` du document, ce qui détermine quelle feuille de styles a priorité sur quelle autre. La valeur peut être (par ordre de précédence) `"reset"`, `"low"`, `"medium"` ou `"high"`.
  *  `crossOrigin` : une chaîne de caractères. La [politique CORS](https://developer.mozilla.org/fr/docs/Web/HTML/Attributes/crossorigin) à utiliser. Les valeurs possibles sont `anonymous` et `use-credentials`.  Elle est obligatoire lorsque `as` vaut `"fetch"`.
  *  `referrerPolicy` : une chaîne de caractères. [L'en-tête Referrer](https://developer.mozilla.org/fr/docs/Web/HTML/Element/link#referrerpolicy) à envoyer lors du chargement. Les valeurs possibles sont `no-referrer-when-downgrade` (par défaut), `no-referrer`, `origin`, `origin-when-cross-origin` ou `unsafe-url`.
  * `integrity` : une chaîne de caractères. Une empreinte cryptographique de la ressource afin de [vérifier son authenticité](https://developer.mozilla.org/fr/docs/Web/Security/Subresource_Integrity).
  * `type` : une chaîne de caractères. Le type MIME de la ressource liée.
  * `nonce` : une chaîne de caractères. Un [nonce cryptographique autorisant la ressource](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/nonce) dans le cadre d'une Politique de Sécurité de Contenu (CSP) stricte.
  * `fetchPriority` : une chaîne de caractères. Suggère une priorité relative pour le chargement de la ressource. Les valeurs possibles sont `auto` (par défaut), `high` ou `low`.
  *  `imageSrcSet` : une chaîne de caractères. À n'utiliser que pour `as: "image"`. Indique le [jeu de sources de l'image](https://developer.mozilla.org/fr/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
  *  `imageSizes` : une chaîne de caractères. À n'utiliser que pour `as: "image"`. Indique les [tailles de l'image](https://developer.mozilla.org/fr/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

#### Valeur renvoyée {/*returns*/}

`preload` ne renvoie rien.

#### Limitations {/*caveats*/}

* Plusieurs appels équivalents à `preload` ont le même effet qu'un unique appel. Des appels à `preload` sont considérés équivalents selon les règles que voici :
  * Deux appels sont équivalents s'ils ont le même `href`, sauf si :
  * L'option `as` vaut `image`, auquel cas les deux appels sont équivalents s'ils ont les mêmes `href`, `imageSrcSet` et `imageSizes`.
* Côté client, vous pouvez appeler `preload` n'importe où : lors du rendu d'un composant, dans un Effet, dans un gestionnaire d'événement, etc.
* Lors d'un rendu côté serveur ou du rendu de Composants Serveur, `preload` n'a d'effet que si vous l'appelez lors du rendu d'un composant ou dans une fonction asynchrone issue du rendu d'un composant.  Tout autre appel sera ignoré.

---

## Utilisation {/*usage*/}

### Précharger lors du rendu {/*preloading-when-rendering*/}

Appelez `preload` lors du rendu d'un composant si vous savez que ses enfants auront besoin de charger une ressource spécifique.

<Recipes titleText="Exemples de préchargement">

#### Précharger un script {/*preloading-an-external-script*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/script.js", { as: "script" });
  return ...;
}
```

Si vous souhaitez que le navigateur évalue la ressource immédiatement après chargement (plutôt que simplement le charger), utilisez plutôt [`preinit`](/reference/react-dom/preinit). Si vous souhaitez charger un module ESM, utilisez [`preloadModule`](/reference/react-dom/preloadModule).

<Solution />

#### Précharger une feuille de styles {/*preloading-a-stylesheet*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", { as: "style" });
  return ...;
}
```

Si vous souhaitez que le navigateur insère la feuille de styles immédiatement après chargement (c'est-à-dire qu'il la parse et l'applique aussi), utilisez plutôt [`preinit`](/reference/react-dom/preinit).

<Solution />

#### Précharger une fonte {/*preloading-a-font*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", { as: "style" });
  preload("https://example.com/font.woff2", { as: "font" });
  return ...;
}
```

Si vous préchargez une feuille de styles, il est souhaitable de précharger toute fonte que cette feuille de styles référence.  Ainsi, le navigateur pourra commencer à télécharger les fontes avant d'avoir chargé et parsé la feuille de styles.

<Solution />

#### Précharger une image {/*preloading-an-image*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("/banner.png", {
    as: "image",
    imageSrcSet: "/banner512.png 512w, /banner1024.png 1024w",
    imageSizes: "(max-width: 512px) 512px, 1024px",
  });
  return ...;
}
```

Lorsque vous préchargez une image, les options `imageSrcSet` et `imageSizes` aide le navigateur à [charger l'image de la meilleure taille pour ses dimensions d'affichage à l'écran](https://developer.mozilla.org/fr/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

<Solution />

</Recipes>

### Précharger dans un gestionnaire d'événement {/*preloading-in-an-event-handler*/}

Appelez `preload` depuis un gestionnaire d'événement avant de passer à une page ou un état qui auront besoin de ressources extérieures.  Ça permet de déclencher le processus plus tôt que si vous l'appeliez au sein de la nouvelle page ou suite au nouvel état.

```js
import { preload } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preload("https://example.com/wizardStyles.css", { as: "style" });
    startWizard();
  }
  return (
    <button onClick={onClick}>Démarrer l’assistant</button>
  );
}
```
