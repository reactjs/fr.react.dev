---
script: "<script>"
canary: true
---

<Canary>

Les extensions de React à `<script>` ne sont actuellement disponibles que sur les canaux de livraison Canary et Expérimental de React. Dans les versions stables de React, `<script>` fonctionne comme [le composant HTML natif du navigateur](/reference/react-dom/components#all-html-components). Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

Le [composant natif `<script>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/script) vous permet d'ajouter un script à votre document.

```js
<script> alert("salut !") </script>
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `<script>` {/*script*/}

Pour ajouter un script défini à la volée ou extérieur à votre document, utilisez le [composant natif `<script>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/script). Vous pouvez utiliser `<script>` depuis n'importe quel composant et React placera [dans certains cas](#special-rendering-behavior) l'élément DOM correspondant dans l'en-tête (`head`) du document et dédoublonnera les scripts identiques.

```js
<script> alert("salut !") </script>
<script src="script.js" />
```

[Voir d'autres exemples plus bas](#usage).

#### Props {/*props*/}

`<script>` prend en charge toutes les [props communes aux éléments](/reference/react-dom/components/common#props).

Il est censé utiliser *l'une ou l'autre* des props `chilren` ou `src`.

* `children` : une chaîne de caractères. Le code source du script défini à la volée.
* `src` : une chaîne de caractères. L'URL d'un script extérieur.

L'élément prend en charge d'autres props :

* `async` : un booléen. Permet au navigateur de différer l'exécution du script jusqu'à ce que le reste du document ait été traité — c'est le comportement à favoriser pour des raisons de performances.
*  `crossOrigin` : une chaîne de caractères. La [politique CORS](https://developer.mozilla.org/docs/Web/HTML/Attributes/crossorigin) à utiliser. Les valeurs possibles sont `anonymous` et `use-credentials`.
* `fetchPriority` : une chaîne de caractères. Suggère une priorité relative pour le chargement lorsque plusieurs scripts sont chargés en parallèle. Les valeurs possibles sont `auto` (par défaut), `high` ou `low`.
* `integrity` : une chaîne de caractères. Une empreinte cryptographique du script afin de [vérifier son authenticité](https://developer.mozilla.org/fr/docs/Web/Security/Subresource_Integrity).
* `noModule` : un booléen. Désactive le script dans les navigateurs qui ne prennent pas en charge les modules ES (ESM), ce qui permet de charger un script de secours pour ces navigateurs.
* `nonce` : une chaîne de caractères. Un [nonce cryptographique autorisant la ressource](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/nonce) dans le cadre d'une Politique de Sécurité de Contenu (CSP) stricte.
* `referrer` : une chaîne de caractères. Indique [l'en-tête Referer à envoyer](https://developer.mozilla.org/docs/Web/HTML/Element/script#referrerpolicy) lors du chargement du script et de toutes ressources que le script chargerait à son tour.
* `type` : une chaîne de caractères. Indique si le script est un [script classique, un module ES ou une *import map*](https://developer.mozilla.org/fr/docs/Web/HTML/Element/script/type).

Ces props désactivement le [traitement spécial des scripts](#special-rendering-behavior) de React :

* `onError` : une fonction. Appelée lorsque le chargement du script échoue.
* `onLoad` : une fonction. Appelée lorsque le chargement du script est terminé.

Ces props sont **déconseillées** pour une utilisation avec React :

* `blocking` : une chaîne de caractères. Si elle vaut `"render"`, le navigateur attendra pour afficher la page que le script ait fini son chargement.  React permet un contrôle plus granulaire grâce à Suspense.
* `defer` : une chaîne de caractères. Empêche le navigateur d'exécuter le script tant que le chargement du document n'est pas terminé.  Ce fonctionnement est incompatible avec le streaming de Composants Serveur : préférez la prop `async`.

#### Comportement spécifique de rendu {/*special-rendering-behavior*/}

React peut déplacer les composants `<script>` dans le `<head>` du document et dédoublonner les scripts identiques.

Pour activer ces comportements, fournissez les props `src` et `async={true}`.  React dédoublonnera les scripts qui ont le même `src`.  La prop `async` doit être active pour permettre aux scripts d'être déplacés sans risque.

Ce comportement a deux limitations :

* React ignorera les changements à ces props après le rendu du script. (React produira un avertissement en développement si ce cas survient.)
* React est susceptible de laisser le script dans le DOM même après le démontage du composant qui l'a produit. (Ça n'a toutefois aucun impact dans la mesure où les scripts ne sont exécutés qu'une fois : au moment de leur insertion dans le DOM.)

---

## Utilisation {/*usage*/}

### Exécuter un script extérieur {/*rendering-an-external-script*/}

Si un composant dépend de certains scripts pour pouvoir fonctionner correctement, vous pouvez utiliser `<script>` au sein de ce composant. Cependant, le composant pourrait finaliser son commit avant que le script ait terminé son chargement. Vous pouvez démarrer un traitement une fois le script chargé en écoutant son événement `load`, par exemple au moyen de sa prop `onLoad`.

React dédoublonnera les scripts ayant le même `src`, et n'insèrera que l'un d'entre eux dans le DOM même si plusieurs composants utilisent ce script.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" onLoad={() => console.log('script loaded')} />
      <div id="map" data-lat={lat} data-long={long} />
    </>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <Map />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

<Note>

Lorsque vous souhaitez utiliser un script, il peut être avantageux d'appeler la fonction [`preinit`](/reference/react-dom/preinit). Un tel appel suggère au navigateur de commencer à charger le script plus tôt que lorsque vous vous contentez d'utiliser le composant `<script>`, par exemple en utilisant une [réponse HTTP Early Hints](https://developer.mozilla.org/docs/Web/HTTP/Status/103).

</Note>

### Exécuter un script défini à la volée {/*rendering-an-inline-script*/}

Pour exécuter un script défini à la volée, utilisez le composant `<script>` avec le code source à l'intérieur. Les scripts définis à la volée ne sont pas dédoublonnés ou déplacés dans le `<head>` du document.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Tracking() {
  return (
    <script>
      ga('send', 'pageview');
    </script>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <h1>Mon site web</h1>
      <Tracking />
      <p>Bienvenue</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
