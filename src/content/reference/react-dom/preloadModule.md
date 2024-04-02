---
title: preloadModule
canary: true
---

<Canary>

La fonction `preloadModule` n'est actuellement disponible que sur les canaux de livraison Canary et Expérimental de React. Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

[Les frameworks basés sur React](/learn/start-a-new-react-project) s'occupent fréquemment pour vous du chargement des ressources, de sorte que vous n'aurez peut-être pas besoin d'appeler ces API vous-même.  Consultez la documentation de votre framework pour en savoir plus à ce sujet.

</Note>

<Intro>

`preloadModule` vous permet de charger en avance un module ESM que vous avez l'intention d'utiliser.

```js
preloadModule("https://example.com/module.js", { as: "script" });
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `preloadModule(href, options)` {/*preloadmodule*/}

Pour précharger un module ESM, appelez la fonction `preloadModule` de `react-dom`.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", { as: "script" });
  // ...
}

```

[Voir d'autres exemples plus bas](#usage).

La fonction `preloadModule` suggère au navigateur de commencer à télécharger un module donné, ce qui peut faire gagner du temps.

#### Paramètres {/*parameters*/}

* `href` : une chaîne de caractères. L'URL du module que vous souhaitez télécharger.
* `options` : un objet. Il contient les propriétés suivantes :
  *  `as` : une chaîne de caractères obligatoire. Doit être `'script'`.
  *  `crossOrigin` : une chaîne de caractères. La [politique CORS](https://developer.mozilla.org/fr/docs/Web/HTML/Attributes/crossorigin) à utiliser. Les valeurs possibles sont `anonymous` et `use-credentials`.
  * `integrity` : une chaîne de caractères. Une empreinte cryptographique du module afin de [vérifier son authenticité](https://developer.mozilla.org/fr/docs/Web/Security/Subresource_Integrity).
  * `nonce` : une chaîne de caractères. Un [nonce cryptographique autorisant le module](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/nonce) dans le cadre d'une Politique de Sécurité de Contenu (CSP) stricte.

#### Valeur renvoyée {/*returns*/}

`preloadModule` ne renvoie rien.

#### Limitations {/*caveats*/}

* Plusieurs appels à `preloadModule` avec le même `href` ont le même effet qu'un unique appel.
* Côté client, vous pouvez appeler `preloadModule` n'importe où : lors du rendu d'un composant, dans un Effet, dans un gestionnaire d'événement, etc.
* Lors d'un rendu côté serveur ou du rendu de Composants Serveur, `preloadModule` n'a d'effet que si vous l'appelez lors du rendu d'un composant ou dans une fonction asynchrone issue du rendu d'un composant.  Tout autre appel sera ignoré.

---

## Utilisation {/*usage*/}

### Précharger lors du rendu {/*preloading-when-rendering*/}

Appelez `preloadModule` lors du rendu d'un composant si vous savez que ses enfants auront besoin de charger un module spécifique.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", { as: "script" });
  return ...;
}
```

Si vous souhaitez que le navigateur évalue le module immédiatement après chargement (plutôt que simplement le charger), utilisez plutôt [`preinitModule`](/reference/react-dom/preinitModule). Si vous souhaitez charger un script qui n'est pas un module ESM, utilisez [`preload`](/reference/react-dom/preload).

### Précharger dans un gestionnaire d'événement {/*preloading-in-an-event-handler*/}

Appelez `preloadModule` depuis un gestionnaire d'événement avant de passer à une page ou un état qui auront besoin du module.  Ça permet de déclencher le processus plus tôt que si vous l'appeliez au sein de la nouvelle page ou suite au nouvel état.

```js
import { preloadModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preloadModule("https://example.com/module.js", { as: "script" });
    startWizard();
  }
  return (
    <button onClick={onClick}>Démarrer l’assistant</button>
  );
}
```
