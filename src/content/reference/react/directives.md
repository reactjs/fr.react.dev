---
title: "Directives"
canary: true
---

<Canary>

Ces directives ne sont utiles que si vous [utilisez React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) ou créez une bibliothèque compatible avec eux.

</Canary>

<Intro>

Les directives fournissent des instructions à destination des [*bundlers* compatibles avec React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).

</Intro>

---

## Directives dans le code source {/*source-code-directives*/}

* [`'use client'`](/reference/react/use-client) marque les fichiers sources dont les composants s'exécutent côté client.
* [`'use server'`](/reference/react/use-server) marque les fonctions côté serveur qui peuvent être appelées par du code côté client.
