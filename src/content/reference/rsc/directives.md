---
title: Directives
---

<RSC>

<<<<<<< HEAD
Ces directives ne sont utiles que si vous [utilisez les Composants Serveur](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) ou créez une bibliothèque compatible avec eux.
=======
Directives are for use in [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

</RSC>

<Intro>

Les directives fournissent des instructions à destination des [*bundlers* compatibles avec les Composants Serveur](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).

</Intro>

---

## Directives dans le code source {/*source-code-directives*/}

* [`'use client'`](/reference/react/use-client) vous permet d'indiquer quel code est exécuté côté client.
* [`'use server'`](/reference/react/use-server) marque les fonctions côté serveur qui peuvent être appelées par du code côté client.
