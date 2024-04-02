---
title: preinit
canary: true
---

<Canary>

La fonction `preinit` n'est actuellement disponible que sur les canaux de livraison Canary et Expérimental de React. Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

[Les frameworks basés sur React](/learn/start-a-new-react-project) s'occupent fréquemment pour vous du chargement des ressources, de sorte que vous n'aurez peut-être pas besoin d'appeler ces API vous-même.  Consultez la documentation de votre framework pour en savoir plus à ce sujet.

</Note>

<Intro>

`preinit` vous permet de charger et d'évaluer en avance une feuille de styles ou un script extérieurs.

```js
preinit("https://example.com/script.js", { as: "script" });
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `preinit(href, options)` {/*preinit*/}

Pour préinitialiser un script ou une feuille de styles, appelez la fonction `preinit` de `react-dom`.

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", { as: "script" });
  // ...
}

```

[Voir d'autres exemples plus bas](#usage).

La fonction `preinit` suggère au navigateur de commencer à télécharger puis d'évaluer une ressource donnée, ce qui peut faire gagner du temps.  Les scripts que vous passez à `preinit` sont exécutés dès qu'ils ont terminé leur chargement. Les feuilles de styles sont immédiatement insérées dans le document, ce qui les applique automatiquement.

#### Paramètres {/*parameters*/}

* `href` : une chaîne de caractères. L'URL de la ressource que vous souhaitez télécharger et évaluer.
* `options` : un objet. Il contient les propriétés suivantes :
  *  `as` : une chaîne de caractères obligatoire. Le type de la ressource. Les valeurs autorisées sont `script` et `style`.
  * `precedence` : une chaîne de caractères. Indique à React où placer le nœud DOM `<style>` par rapport aux autres présents dans le `<head>` du document, ce qui détermine quelle feuille de styles a priorité sur quelle autre. La valeur peut être (par ordre de précédence) `"reset"`, `"low"`, `"medium"` ou `"high"`.
  * `crossOrigin` : une chaîne de caractères. La [politique CORS](https://developer.mozilla.org/fr/docs/Web/HTML/Attributes/crossorigin) à utiliser. Les valeurs possibles sont `anonymous` et `use-credentials`.
  * `integrity` : une chaîne de caractères. Une empreinte cryptographique de la ressource afin de [vérifier son authenticité](https://developer.mozilla.org/fr/docs/Web/Security/Subresource_Integrity).
  * `nonce` : une chaîne de caractères. Un [nonce cryptographique autorisant la ressource](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/nonce) dans le cadre d'une Politique de Sécurité de Contenu (CSP) stricte.
  * `fetchPriority` : une chaîne de caractères. Suggère une priorité relative pour le chargement de la ressource. Les valeurs possibles sont `auto` (par défaut), `high` ou `low`.

#### Valeur renvoyée {/*returns*/}

`preinit` ne renvoie rien.

#### Limitations {/*caveats*/}

* Plusieurs appels à `preinit` avec le même `href` ont le même effet qu'un unique appel.
* Côté client, vous pouvez appeler `preinit` n'importe où : lors du rendu d'un composant, dans un Effet, dans un gestionnaire d'événement, etc.
* Lors d'un rendu côté serveur ou du rendu de Composants Serveur, `preinit` n'a d'effet que si vous l'appelez lors du rendu d'un composant ou dans une fonction asynchrone issue du rendu d'un composant.  Tout autre appel sera ignoré.

---

## Utilisation {/*usage*/}

### Préinitialisation lors du rendu {/*preiniting-when-rendering*/}

Appelez `preinit` lors du rendu d'un composant si vous savez que ses enfants auront besoin de charger une ressource spécifique, et que vous acceptez d'évaluer cette ressource dès son chargement (ce qui l'appliquera automatiquement).

<Recipes titleText="Exemples de préinitialisation">

#### Préinitialiser un script extérieur {/*preiniting-an-external-script*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", { as: "script" });
  return ...;
}
```

Si vous souhaitez que le navigateur télécharge mais n'évalue pas la ressource immédiatement, utilisez plutôt [`preload`](/reference/react-dom/preload). Si vous souhaitez charger et évaluer un module ESM, utilisez [`preinitModule`](/reference/react-dom/preinitModule).

<Solution />

#### Préinitialiser une feuille de styles {/*preiniting-a-stylesheet*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
  return ...;
}
```

L'option `precedence`, qui est ici obligatoire, vous permet de contrôler l'ordre des feuilles de styles dans le document. Les feuilles de styles avec une précédence plus élevée peuvent surcharger celles de précédence inférieure.

Si vous souhaitez que le navigateur télécharge mais n'insère pas la feuille de styles immédiatement, utilisez plutôt [`preload`](/reference/react-dom/preload).

<Solution />

</Recipes>

### Préinitialisation dans un gestionnaire d'événement {/*preiniting-in-an-event-handler*/}

Appelez `preinit` depuis un gestionnaire d'événement avant de passer à une page ou un état qui auront besoin de ressources extérieures.  Ça permet de déclencher le processus plus tôt que si vous l'appeliez au sein de la nouvelle page ou suite au nouvel état.

```js
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit("https://example.com/wizardStyles.css", { as: "style" });
    startWizard();
  }
  return (
    <button onClick={onClick}>Démarrer l’assistant</button>
  );
}
```
