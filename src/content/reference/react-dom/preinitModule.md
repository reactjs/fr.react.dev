---
title: preinitModule
canary: true
---

<Canary>

La fonction `preinitModule` n'est actuellement disponible que sur les canaux de livraison Canary et Expérimental de React. Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

[Les frameworks basés sur React](/learn/start-a-new-react-project) s'occupent fréquemment pour vous du chargement des ressources, de sorte que vous n'aurez peut-être pas besoin d'appeler ces API vous-même.  Consultez la documentation de votre framework pour en savoir plus à ce sujet.

</Note>

<Intro>

`preinitModule` vous permet de charger et d'évaluer en avance un module ESM.

```js
preinitModule("https://example.com/module.js", { as: "script" });
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `preinitModule(href, options)` {/*preinitmodule*/}

Pour préinitialiser un module ESM, appelez la fonction `preinitModule` de `react-dom`.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", { as: "script" });
  // ...
}

```

[Voir d'autres exemples plus bas](#usage).

La fonction `preinitModule` suggère au navigateur de commencer à télécharger puis d'évaluer un module donné, ce qui peut faire gagner du temps.  Les modules que vous passez à `preinitModule` sont exécutés dès qu'ils ont terminé leur chargement.

#### Parameters {/*parameters*/}

* `href` : une chaîne de caractères. L'URL du module que vous souhaitez télécharger et évaluer.
* `options` : un objet. Il contient les propriétés suivantes :
  *  `as` : une chaîne de caractères obligatoire. La seule valeur autorisée est `script`.
  * `crossOrigin` : une chaîne de caractères. La [politique CORS](https://developer.mozilla.org/fr/docs/Web/HTML/Attributes/crossorigin) à utiliser. Les valeurs possibles sont `anonymous` et `use-credentials`.
  * `integrity` : une chaîne de caractères. Une empreinte cryptographique de la ressource afin de [vérifier son authenticité](https://developer.mozilla.org/fr/docs/Web/Security/Subresource_Integrity).
  * `nonce` : une chaîne de caractères. Un [nonce cryptographique autorisant la ressource](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/nonce) dans le cadre d'une Politique de Sécurité de Contenu (CSP) stricte.

#### Valeur renvoyée {/*returns*/}

`preinitModule` ne renvoie rien.

#### Limitations {/*caveats*/}

* Plusieurs appels à `preinitModule` avec le même `href` ont le même effet qu'un unique appel.
* Côté client, vous pouvez appeler `preinitModule` n'importe où : lors du rendu d'un composant, dans un Effet, dans un gestionnaire d'événement, etc.
* Lors d'un rendu côté serveur ou du rendu de Composants Serveur, `preinitModule` n'a d'effet que si vous l'appelez lors du rendu d'un composant ou dans une fonction asynchrone issue du rendu d'un composant.  Tout autre appel sera ignoré.

---

## Utilisation {/*usage*/}

### Préinitialisation lors du rendu {/*preiniting-when-rendering*/}

Appelez `preinitModule` lors du rendu d'un composant si vous savez que ses enfants auront besoin de charger un module spécifique, et que vous acceptez d'évaluer ce module immédiatement après son chargement.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", { as: "script" });
  return ...;
}
```

Si vous souhaitez que le navigateur télécharge mais n'évalue pas le module immédiatement, utilisez plutôt [`preload`](/reference/react-dom/preload). Si vous souhaitez charger et évaluer un script qui n'est pas un module ESM, utilisez [`preinit`](/reference/react-dom/preinitModule).

### Préinitialisation dans un gestionnaire d'événement {/*preiniting-in-an-event-handler*/}

Appelez `preinitModule` depuis un gestionnaire d'événement avant de passer à une page ou un état qui auront besoin de modules.  Ça permet de déclencher le processus plus tôt que si vous l'appeliez au sein de la nouvelle page ou suite au nouvel état.

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", { as: "script" });
    startWizard();
  }
  return (
    <button onClick={onClick}>Démarrer l’assistant</button>
  );
}
```
