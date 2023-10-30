---
title: "'use client'"
titleForTitleTag: "'use client' directive"
canary: true
---

<Canary>

`'use client'` n'est utile que si vous [utilisez React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) ou créez une bibliothèque compatible avec eux.

</Canary>


<Intro>

`'use client'` marque les fichiers sources dont les composants s'exécutent côté client.

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `'use client'` {/*use-client*/}

Ajoutez `'use client';` tout en haut d'un fichier pour indiquer que ce fichier (ainsi que tout composant enfant qu'il utilise) s'exécute coté client, indépendamment des endroits qui l'importent.

```js
'use client';

import { useState } from 'react';

export default function RichTextEditor(props) {
  // ...
```

Lorsqu'un fichier marqué avec `'use client'` est importé par un composant côté serveur, [les *bundlers* compatibles](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) traiteront l'import comme un « point de césure » entre le code exclusivement côté serveur et le code côté client.  Les composants qui figurent dans ce module ou dans ses dépendances peuvent utiliser des fonctionnalités React réservées au côté client, telles que [`useState`](/reference/react/useState).

#### Limitations {/*caveats*/}

* Vous n'avez pas besoin d'ajouter `'use client'` à chaque fichier pour utiliser des fonctionnalités React réservées au côté client, il suffit de le faire pour les fichiers importés par des fichiers de composants côté serveur. `'use client'` dénote une *frontière* entre le code exclusivement côté serveur et le code client ; tout composant plus bas dans l'arbre sera automatiquement exécuté côté client.  Pour qu'ils puissent être exploités par des composants côté serveur, les composants exportés depuis des fichiers `'use client'` doivent avoir des props sérialisables.
* Lorsqu'un fichier `'use client'` est importé depuis un fichier côté serveur, les valeurs importées peuvent être traitées comme un composant React ou passées comme props à un composant côté client.  Toute autre utilisation lèvera une exception.
* Lorsqu'un fichier `'use client'` est importé depuis un autre fichier côté client, la directive n'a aucun effet. Ça permet d'écrire des composants côté client qui sont utilisables à la fois par des composants côté serveur et d'autres côté client.
* Tout le code d'un fichier `'use client'`, ainsi que tous les modules qu'il importe (directement ou indirectement), feront partie du graphe de modules côté client et devront être envoyés pour exécution côté client afin d'être affichés par le navigateur.  Pour réduire la taille du *bundle* et tirer le meilleur parti du serveur, déplacez l'état (et les directives `'use client'`) plus bas dans l'arbre lorsque c'est possible, et passez les composants côté serveur [comme enfants](/learn/passing-props-to-a-component#passing-jsx-as-children) aux composants côté client.
* Dans la mesure où les props sont sérialisées pour franchir la frontière serveur–client, vous comprendrez que l'emplacement de ces directives peut affecter la quantité de données envoyée au client. Évitez les structures de données inutilement lourdes.
* Les composants tels que `<MarkdownRenderer>`, qui ne recourent à aucune fonctionnalité strictement côté serveur ou côté client, ne devraient généralement pas être marqués avec `'use client'`. Ainsi, ils peuvent faire leur rendu entièrement côté serveur lorsqu'ils sont utilisés par un composant côté serveur, mais aussi être ajoutés au *bundle* client lorsqu'ils sont utilisés par un composant côté client.
* Les bibliothèques publiées sur npm devraient inclure `'use client'` dans les composants React qu'elles exportent dont les props sont sérialisables et qui utilisent des fonctionnalités React réservées au côté client, afin que ces composants puissent être importés et exploités par les composants côté serveur. Dans le cas contraire, leurs utilisateurs auraient besoin d'enrober les composants de la bibliothèque dans leurs propres fichiers `'use client'`, ce qui est fastidieux et empêche la bibliothèque de déplacer plus tard une partie de sa logique vers le côté serveur.  Pour la publication de fichier pré-*bundlés* sur npm, assurez-vous que les fichiers sources `'use client'` atterrissent dans un *bundle* marqué avec `'use client'`, distinct de tout *bundle* contenant des exports susceptibles d'être utilisés directement par le serveur.
* Les composants côté client continueront à être exécutés dans le cadre du rendu côté serveur (SSR, *Server-Side Rendering, NdT*) ou de la génération de sites statiques lors du *build* (SSG, *Static Site Generation, NdT*), qui se comportent comme des clients pour transformer le rendu initial de composants React en HTML apte à être affiché avant que les *bundles* JavaScript ne soient téléchargés. Ils ne peuvent toutefois pas utiliser de fonctionnalités réservées au côté serveur, telles que la lecture en direct d'une base de données.
* Les directives telles que `'use client'` doivent être placées au tout début du fichier, au-dessus de tout import et de quelque autre code que ce soit (à l'exception des commentaires, qui peuvent apparaître avant).  Elles doivent utiliser des apostrophes (`'`) ou guillemets (`"`), pas des apostrophes inverses (<code>\`</code>). (Le format de directive `'use xyz'` n'est pas sans rappeler la convention de nommage `useXyz()` des Hooks, mais c'est là une simple coïncidence.)

## Utilisation {/*usage*/}

<Wip>

Cette section est en cours de rédaction.

Cette API peut être utilisée par n'importe quel framework prenant en charge les React Server Components. Ces frameworks vous fourniront davantage de documentation.

* [Documentation Next.js](https://nextjs.org/docs/getting-started/react-essentials)
* D'autres arrivent prochainement

</Wip>
