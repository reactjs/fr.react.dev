---
title: preconnect
canary: true
---

<Canary>

La fonction `preconnect` n'est actuellement disponible que sur les canaux de livraison Canary et Expérimental de React. Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`preconnect` vous permet de vous connecter en avance à un serveur depuis lequel vous avez l'intention de charger des ressources.

```js
preconnect("https://example.com");
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `preconnect(href)` {/*preconnect*/}

Pour vous préconnecter à un hôte, appelez la fonction `preconnect` de `react-dom`.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  // ...
}

```

[Voir d'autres exemples plus bas](#usage).

La fonction `preconnect` suggère au navigateur d'ouvrir une connection vers le serveur en question.  Si le navigateur décide de le faire, ça accélèrera le chargement ultérieur de ressources depuis ce serveur.

#### Paramètres {/*parameters*/}

* `href` : une chaîne de caractères. L'URL du serveur auquel vous souhaitez vous connecter.


#### Valeur renvoyée {/*returns*/}

`preconnect` ne renvoie rien.

#### Limitations {/*caveats*/}

* Plusieurs appels à `preconnect` vers le même serveur ont le même effet qu'un unique appel.
* Côté client, vous pouvez appeler `preconnect` n'importe où : lors du rendu d'un composant, dans un Effet, dans un gestionnaire d'événement, etc.
* Lors d'un rendu côté serveur ou du rendu de Composants Serveur, `preconnect` n'a d'effet que si vous l'appelez lors du rendu d'un composant ou dans une fonction asynchrone issue du rendu d'un composant.  Tout autre appel sera ignoré.
* Si vous connaissez à l'avance les ressources précises dont vous aurez besoin, vous pouvez appeler [d'autres fonctions](/reference/react-dom/#resource-preloading-apis) plutôt que celle-ci, qui initieront directement le chargement des ressources.
* Il n'y a aucun intérêt à se préconnecter au même serveur que celui qui sert la page web elle-même, car la connexion est déjà établie lorsque la suggestion est reçue.

---

## Utilisation {/*usage*/}

### Préconnexion lors du rendu {/*preconnecting-when-rendering*/}

Appelez `preconnect` lors du rendu d'un composant si vous savez que ses enfants auront besoin de charger des ressources extérieures depuis un hôte donné.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### Préconnexion dans un gestionnaire d'événement {/*preconnecting-in-an-event-handler*/}

Appelez `preconnect` depuis un gestionnaire d'événement avant de passer à une page ou un état qui auront besoin de ressources extérieures.  Ça permet de déclencher le processus de connexion plus tôt que si vous l'appeliez au sein de la nouvelle page ou suite au nouvel état.

```js
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Démarrer l’assistant</button>
  );
}
```
