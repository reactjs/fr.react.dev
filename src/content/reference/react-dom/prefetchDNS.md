---
title: prefetchDNS
canary: true
---

<Canary>

La fonction `prefetchDNS` n'est actuellement disponible que sur les canaux de livraison Canary et Expérimental de React. Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`prefetchDNS` vous permet de récupérer en avance l'IP d'un serveur depuis lequel vous avez l'intention de charger des ressources.

```js
prefetchDNS("https://example.com");
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `prefetchDNS(href)` {/*prefetchdns*/}

Pour récupérer l'adresse IP d'un hôte, appelez la fonction `prefetchDNS` de `react-dom`.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  // ...
}

```

[Voir d'autres exemples plus bas](#usage).

La fonction `prefetchDNS` suggère au navigateur de récupérer l'adresse IP du serveur en question.  Si le navigateur décide de le faire, ça accélèrera le chargement ultérieur de ressources depuis ce serveur.

#### Paramètres {/*parameters*/}

* `href` : une chaîne de caractères. L'URL du serveur auquel vous souhaiterez vous connecter.

#### Valeur renvoyée {/*returns*/}

`prefetchDNS` ne renvoie rien.

#### Limitations {/*caveats*/}

* Plusieurs appels à `prefetchDNS` vers le même serveur ont le même effet qu'un unique appel.
* Côté client, vous pouvez appeler `prefetchDNS` n'importe où : lors du rendu d'un composant, dans un Effet, dans un gestionnaire d'événement, etc.
* Lors d'un rendu côté serveur ou du rendu de Composants Serveur, `prefetchDNS` n'a d'effet que si vous l'appelez lors du rendu d'un composant ou dans une fonction asynchrone issue du rendu d'un composant.  Tout autre appel sera ignoré.
* Si vous connaissez à l'avance les ressources précises dont vous aurez besoin, vous pouvez appeler [d'autres fonctions](/reference/react-dom/#resource-preloading-apis) plutôt que celle-ci, qui initieront directement le chargement des ressources.
* Il n'y a aucun intérêt à récupérer l'IP du serveur qui sert la page web elle-même, car cette adresse est déjà connue lorsque la suggestion est reçue.
* Comparée à [`preconnect`](/reference/react-dom/preconnect), `prefetchDNS` est peut-être plus intéressante si vous anticipez des connexions à une grande quantité de domaines, auquel cas des préconnexions effectives ont un coût relatif trop élevé.

---

## Utilisation {/*usage*/}

### Résolution DNS anticipée lors du rendu {/*prefetching-dns-when-rendering*/}

Appelez `prefetchDNS` lors du rendu d'un composant si vous savez que ses enfants auront besoin de charger des ressources extérieures depuis un hôte donné.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  return ...;
}
```

### Résolution DNS anticipée dans un gestionnaire d'événement {/*prefetching-dns-in-an-event-handler*/}

Appelez `prefetchDNS` depuis un gestionnaire d'événement avant de passer à une page ou un état qui auront besoin de ressources extérieures.  Ça permet de déclencher le processus de connexion plus tôt que si vous l'appeliez au sein de la nouvelle page ou suite au nouvel état.

```js
import { prefetchDNS } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    prefetchDNS('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Démarrer l’assistant</button>
  );
}
```
