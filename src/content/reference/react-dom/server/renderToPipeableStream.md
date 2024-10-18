---
title: renderToPipeableStream
---

<Intro>

`renderToPipeableStream` fait le rendu d'un arbre React dans un [flux Node.js](https://nodejs.org/api/stream.html) connectable à d'autres flux de sortie.

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

Cette API est spécifique à Node.js. Les environnements dotés de [Web Streams](https://developer.mozilla.org/fr/docs/Web/API/Streams_API), tels que Deno ou les moteurs légers modernes, devraient plutôt utiliser [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream).

</Note>

---

## Référence {/*reference*/}

### `renderToPipeableStream(reactNode, options?)` {/*rendertopipeablestream*/}

Appelez `renderToPipeableStream` pour faire le rendu HTML d'un arbre React dans un [flux Node.js](https://nodejs.org/api/stream.html#writable-streams).

```js
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

Côté client, appelez [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) pour rendre interactif ce HTML généré côté serveur.

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `reactNode` : un nœud React dont vous souhaitez produire le HTML. Ça pourrait par exemple être un élément JSX tel que `<App />`.  C'est censé produire le document entier, de sorte que le composant `App` devrait produire la balise `<html>`.

* `options` **optionnelles** : un objet avec des options de streaming.
  * `bootstrapScriptContent` **optionnel** : s'il est fourni, ce code source sera placé dans une balise `<script>` en ligne.
  * `bootstrapScripts` **optionnels** : un tableau d'URL sous format texte pour des balises `<script>` à émettre dans la page. Utilisez-le pour inclure le `<script>` qui appellera [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).  Vous pouvez vous en passer si vous ne souhaitez pas exécuter React côté client.
  * `bootstrapModules` **optionnels** : joue le même rôle que `bootstrapScripts`, mais émet plutôt des balises [`<script type="module">`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules).
  * `identifierPrefix` **optionnel** : un préfixe textuel utilisé pour les ID générés par [`useId`](/reference/react/useId). Pratique pour éviter les conflits entre les ID au sein de racines multiples sur une même page. Doit être le même préfixe que celui passé à [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters).
  * `namespaceURI` **optionnel** : l'URI textuel de [l'espace de noms racine](https://developer.mozilla.org/fr/docs/Web/API/Document/createElementNS#uri_despaces_de_nom_valides) pour le flux. Par défaut, celui du HTML standard. Passez `'http://www.w3.org/2000/svg'` pour SVG ou `'http://www.w3.org/1998/Math/MathML'` pour MathML.
  * `nonce` **optionnel** : un [`nonce`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/script#nonce) textuel pour permettre les scripts avec une [*Content-Security-Policy* contenant `script-src`](https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * `onAllReady` **optionnelle** : une fonction de rappel déclenchée lorsque le rendu sera complètement terminé, y compris l'[enveloppe](#specifying-what-goes-into-the-shell) et tout le [contenu](#streaming-more-content-as-it-loads) additionnel. Vous pouvez utiliser ça plutôt qu'`onShellReady` [pour les moteurs d'indexation web et la génération statique](#waiting-for-all-content-to-load-for-crawlers-and-static-generation).  Si vous commencez à streamer à ce moment-là, vous n'aurez pas de chargement progressif.  Le flux contiendra le HTML final.
  * `onError` **optionnelle** : une fonction de rappel déclenchée pour toute erreur serveur, qu'elle soit [récupérable](#recovering-from-errors-outside-the-shell) ou [pas](#recovering-from-errors-inside-the-shell). Par défaut, ça fait juste un `console.error`. Si vous l'écrasez pour [journaliser les rapports de plantage](#logging-crashes-on-the-server), assurez-vous de continuer à appeler `console.error`. Vous pouvez aussi vous en servir pour [ajuster le code de réponse HTTP](#setting-the-status-code) avant que l'enveloppe ne soit émise.
  * `onShellReady` **optionnelle** : une fonction de rappel déclenchée juste après que [l'enveloppe initiale](#specifying-what-goes-into-the-shell) a été produite. Vous pouvez y [définir le code de réponse HTTP](#setting-the-status-code) et y appeler `pipe` pour commencer le streaming. React [streamera le contenu additionnel](#streaming-more-content-as-it-loads) après l'enveloppe ainsi que les balises `<script>` en ligne qui remplaceront le HTML des contenus de secours ou de chargement par les contenus définitifs.
  * `onShellError` **optionnelle** : une fonction de rappel déclenchée si le rendu de l'enveloppe initiale rencontre une erreur.  Il reçoit l'erreur en argument.  Pas un octet n'a été émis *via* le flux à ce stade, et ni `onShellReady` ni `onAllReady` ne seront appelés, vous pouvez donc [produire une enveloppe HTML de secours](#recovering-from-errors-inside-the-shell).
  * `progressiveChunkSize` **optionnel** : le nombre d'octets dans un segment d'envoi progressif. [Apprenez-en davantage sur l'heuristique par défaut](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225).

#### Valeur renvoyée {/*returns*/}

`renderToPipeableStream` renvoie un objet avec deux méthodes :

* `pipe` envoie le HTML dans le [flux Node.js en écriture](https://nodejs.org/api/stream.html#writable-streams) fourni. Appelez `pipe` dans `onShellReady` pour activer le streaming, ou dans `onAllReady` pour les moteurs d'indexation web et la génération statique.
* `abort` vous permet [d'abandonner le rendu côté serveur](#aborting-server-rendering) pour faire le reste du rendu côté client.

---

## Utilisation {/*usage*/}

### Faire le rendu d'un arbre React sous forme HTML dans un flux Node.js {/*rendering-a-react-tree-as-html-to-a-nodejs-stream*/}

Appelez `renderToPipeableStream` pour faire le rendu d'un arbre React sous forme HTML dans un [flux Node.js](https://nodejs.org/api/stream.html#writable-streams) :

```js [[1, 6, "<App />"], [2, 7, "['/main.js']"]]
import { renderToPipeableStream } from 'react-dom/server';

// La syntaxe du gestionnaire de route dépend de votre
// framework côté serveur
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

En plus du <CodeStep step={1}>composant racine</CodeStep>, vous devrez fournir une liste des <CodeStep step={2}>chemins de `<script>` de démarrage</CodeStep>. Votre composant racine doit renvoyer **le document intégral, donc la balise `<html>` racine**.

Il pourrait par exemple ressembler à ça :

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>Mon appli</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

React injectera le [doctype](https://developer.mozilla.org/fr/docs/Glossary/Doctype) et vos <CodeStep step={2}>balises `<script>` de démarrage</CodeStep> dans le flux HTML résultant :

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML de vos composants ... -->
</html>
<script src="/main.js" async=""></script>
```

Côté client, votre script de démarrage devrait [hydrater le `document` entier avec un appel à `hydrateRoot`](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document) :

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Ça attachera les gestionnaires d'événements au HTML généré côté serveur pour le rendre interactif.

<DeepDive>

#### Lire les chemins de ressources CSS et JS depuis la sortie du *build* {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Les URL finales de ressources (telles que les fichiers JavaScript et CSS) contiennent souvent une empreinte générée par le *build* Par exemple, plutôt que `styles.css`, vous pourriez vous retrouver avec `styles.123456.css`.  L'injection d'empreinte dans les noms de fichiers des ressources statiques garantit que chaque nouveau *build* d'une même ressource aura un nom différent (si son contenu a changé).  C'est pratique pour mettre en place sans danger des stratégies de cache à long terme pour les ressources statiques : un fichier avec un nom donné ne changera jamais de contenu.

Seulement voilà, si vous ne connaissez pas les URL des ressources avant la fin du *build*, vous n'avez aucun moyen de les mettre dans votre code source. Par exemple, ça ne servirait à rien de coder en dur `"/styles.css"` dans votre JSX, comme dans le code vu plus haut. Pour garder les noms finaux hors de votre code source, votre composant racine peut lire les véritables noms depuis une table de correspondance qui lui serait passée en prop :

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        ...
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
        ...
      </head>
      ...
    </html>
  );
}
```

Côté serveur, faites le rendu de `<App assetMap={assetMap} />` et passez-lui une `assetMap` avec les URL des ressources :

```js {1-6,9-10}
// Vous devrez récupérer ce JSON depuis votre outil de build,
// par exemple en lisant son affichage résultat.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Dans la mesure où votre serveur fait désormais le rendu de `<App assetMap={assetMap} />`, vous devez lui passer cette `assetMap` côté client aussi, pour éviter toute erreur lors de l'hydratation. Vous pouvez la sérialiser et la passer au client comme ceci :

```js {9-10}
// Vous récupérereriez ce JSON depuis votre outil de build.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    // Attention : on peut stringify() ça sans danger parce que ça ne vient pas des utilisateurs.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Dans l'exemple ci-dessus, l'option `bootstrapScriptContent` ajoute une balise `<script>` en ligne complémentaire qui définit la variable globale `window.assetMap` côté client. Ça permet au code client de lire la même `assetMap` :

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

À présent le client comme le serveur font le rendu d'`App` avec la même prop `assetMap`, on n'a donc pas d'erreur d'hydratation.

</DeepDive>

---

### Streamer plus de contenu au fil du chargement {/*streaming-more-content-as-it-loads*/}

Le streaming permet à l'utilisateur de commencer à voir votre contenu avant même que toutes les données soient chargées côté serveur. Imaginez par exemple une page de profil qui affiche une image de couverture, une barre latérale avec des ami·e·s et leurs photos, et une liste d'articles :

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

Imaginez que le chargement des données de `<Posts />` prenne du temps. Dans l'idéal, vous aimeriez afficher le reste du contenu de la page profil à l'utilisateur, sans le forcer à attendre d'abord les articles.  Pour y parvenir, [enrobez `Posts` dans un périmètre `<Suspense>`](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading) :

```js {9,11}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Ça demande à React de commencer à streamer le HTML avant que `Posts` ne charge ses données. React enverra dans un premier temps le HTML du contenu de secours (`PostsGlimmer`) puis, quand `Posts` aura fini de charger ses données, React enverra le HTML restant ainsi qu'une balise `<script>` intégrée qui remplacera le contenu de secours avec ce HTML. Du point de vue de l'utilisateur, la page apparaîtra d'abord avec le `PostsGlimmer`, qui sera ensuite remplacé par les `Posts`.

Vous pouvez même [imbriquer les périmètres `<Suspense>`](/reference/react/Suspense#revealing-nested-content-as-it-loads) afin de créer des séquences de chargement avec une granularité plus fine :

```js {5,13}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

Dans cet exemple, React commencera à streamer la page encore plus tôt. Seuls `ProfileLayout` et `ProfileCover` devront d'abord terminer leur rendu, car ils ne sont enrobés dans aucun périmètre `<Suspense>`.  En revanche, si `Sidebar`, `Friends` ou `Photos` ont besoin de charger des données, React enverra le HTML du contenu de secours `BigSpinner` à leur place. Ainsi, au fil de la mise à disposition des données, davantage de contenu continuera à être affiché jusqu'à ce que tout soit enfin visible.

Le streaming n'a pas besoin d'attendre que React lui-même soit chargé dans le navigateur, ou que votre appli soit devenue interactive. Le contenu HTML généré côté serveur sera envoyé et affiché progressivement avant le chargement de n'importe quelle balise `<script>`.

[Apprenez-en davantage sur le fonctionnement du streaming HTML](https://github.com/reactwg/react-18/discussions/37).

<Note>

**Seules les sources de données compatibles Suspense activeront le composant Suspense.**  Elles comprennent :

- Le chargement de données fourni par des frameworks intégrant Suspense tels que [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) et [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Le chargement à la demande du code de composants avec [`lazy`](/reference/react/lazy)
- La lecture de la valeur d'une promesse avec [`use`](/reference/react/use)

Suspense **ne détecte pas** le chargement de données depuis un Effet ou un gestionnaire d'événement.

Les modalités exactes de votre chargement de données dans le composant `Posts` ci-dessus dépenderont de votre framework.  Si vous utilisez un framework intégrant Suspense, vous trouverez tous les détails dans sa documentation sur le chargement de données.

Le chargement de données compatible avec Suspense sans recourir à un framework spécifique n'est pas encore pris en charge.  Les spécifications d'implémentation d'une source de données intégrant Suspense sont encore instables et non documentées.  Une API officielle pour intégrer les sources de données avec Suspense sera publiée dans une future version de React.

</Note>

---

### Spécifier le contenu de l'enveloppe {/*specifying-what-goes-into-the-shell*/}

La partie de votre appli à l'extérieur de tout périmètre `<Suspense>` est appelée *l'enveloppe* :

```js {3-5,13,14}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

Elle détermine le tout premier état de chargement que vos utilisateurs sont susceptibles de voir :

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

Si vous enrobez toute l'appli dans un périmètre `<Suspense>` à la racine, l'enveloppe ne contiendra qu'un indicateur de chargement. Ce n'est hélas pas une expérience utilisateur agréable, car voir un gros indicateur de chargement à l'écran peut sembler plus lent et plus irritant que d'attendre un instant pour voir arriver la véritable mise en page.  C'est pourquoi vous voudrez généralement positionner vos périmètres `<Suspense>` de façon à ce que l'enveloppe donne une impression *minimale mais complète* — comme si elle représentait un squelette intégral de la page.

La fonction de rappel `onShellReady` est déclenchée lorsque l'enveloppe entière a fini son rendu.  C'est généralement là que vous commencerez le streaming :

```js {3-6}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

Lorsqu'`onShellReady` est déclenchée, les composants à l'intérieur des périmètres `<Suspense>` peuvent encore être en train de charger leurs données.

---

### Journaliser les plantages côté serveur {/*logging-crashes-on-the-server*/}

Par défaut, toutes les erreurs côté serveur sont affichées dans la console.  Vous pouvez remplacer ce comportement pour journaliser vos rapports de plantage :

```js {7-10}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Si vous fournissez votre propre implémentation pour `onError`, n'oubliez pas de continuer à afficher les erreurs en console, comme ci-dessus.

---

### Se rétablir après une erreur dans l'enveloppe {/*recovering-from-errors-inside-the-shell*/}

Dans l'exemple ci-dessous, l'enveloppe contient `ProfileLayout`, `ProfileCover` et `PostsGlimmer` :

```js {3-5,7-8}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Si une erreur survient lors du rendu de ces composants, React n'aura pas de HTML exploitable à envoyer au client.  Utilisez `onShellError` pour envoyer en dernier recours un HTML de secours qui n'aurait pas besoin d'un rendu côté serveur :

```js {7-11}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Ça sent le pâté…</h1>');
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Si une erreur est survenue lors de la génération de l'enveloppe, tant `onError` que `onShellError` seront déclenchées. Utilisez `onError` pour signaler l'erreur et `onShellError` pour envoyer le document HTML de secours.  Votre HTML de secours n'est d'ailleurs pas nécessairement une page d'erreur. Vous pourriez plutôt proposer une enveloppe alternative qui affiche votre appli en mode 100% client.

---

### Se rétablir après une erreur hors de l'enveloppe {/*recovering-from-errors-outside-the-shell*/}

Dans l'exemple qui suit, le composant `<Posts />` est enrobé par `<Suspense>`, ce qui signifie qu'il ne fait *pas* partie de l'enveloppe :

```js {6}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Si une erreur survient au sein du composant `Posts` ou d'un de ses enfants, React [tentera automatiquement de retomber sur ses pieds](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content) :

1. Il émettra le contenu de secours du périmètre `<Suspense>` le plus proche (`PostsGlimmer`) dans le HTML.
2. Il « laissera tomber » le rendu côté serveur du contenu de `Posts`.
3. Lorsque le code JavaScript côté client aura fini de charger, React *retentera* le rendu de `Posts`, côté client.

Si la tentative de rendu de `Posts` côté client plante *aussi*, React lèvera l'erreur côté client.  Comme pour toutes les erreurs survenant lors du rendu, le [périmètre d'erreur le plus proche](/reference/react/Component#static-getderivedstatefromerror) détermine la façon dont l'erreur sera présentée à l'utilisateur. En pratique, ça signifie que l'utilisateur verra un indicateur de chargement jusqu'à ce que React soit certain que l'erreur n'est pas récupérable.

Si la tentative de rendu de `Posts` côté client réussit, l'indicateur de chargement issu du serveur sera remplacé par le résultat du rendu côté client. L'utilisateur ne saura pas qu'une erreur est survenue côté serveur. En revanche, les fonctions de rappel `onError` côté serveur et [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) côté client seront déclenchées pour que vous soyez notifié·e de l'erreur.

---

### Définir le code de réponse HTTP {/*setting-the-status-code*/}

Le streaming implique des compromis.  Vous souhaitez commencer à streamer la page aussitôt que possible, pour que l'utilisateur voie du contenu plus tôt.  Seulement, dès que vous commencer à streamer, vous ne pouvez plus définir le code de réponse HTTP.

En [découpant votre appli](#specifying-what-goes-into-the-shell) avec d'un côté l'enveloppe (au-dessus de tous les périmètres `<Suspense>`) et de l'autre le reste du contenu, vous avez déjà en partie résolu ce problème.  Si l'enveloppe rencontre une erreur, ça déclenchera la fonction de rappel `onShellError` qui vous permet de définir le code de réponse pour l'erreur.  Dans le cas contraire, vous savez que l'appli devrait être capable de se rétablir côté client, vous pouvez donc envoyer « OK ».

```js {4}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Ça sent le pâté…</h1>');
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Si un composant *hors* de l'enveloppe (par exemple dans un périmètre `<Suspense>`) lève une erreur, React n'arrêtera pas le rendu.  Ça signifie que la fonction de rappel `onError` sera déclenchée, mais que vous verrez aussi le déclenchement d'`onShellReady` plutôt qu'`onShellError`. C'est parce que React tentera de retomber sur ses pieds côté client, [comme décrit plus haut](#recovering-from-errors-outside-the-shell).

Ceci étant dit, si vous préférez, vous pouvez prendre en compte la survenue d'une erreur pour ajuster votre code de réponse HTTP :

```js {1,6,16}
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Ça sent le pâté…</h1>');
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Ça ne capturera que les erreurs hors de l'enveloppe qui sont survenues pendant le rendu initial de l'enveloppe, ce n'est donc pas exhaustif. Si vous estimez impératif de savoir si une erreur est survenue pour un contenu donné, vous pouvez le déplacer dans l'enveloppe.

---

### Différencier la gestion selon l'erreur rencontrée {/*handling-different-errors-in-different-ways*/}

Vous pouvez [créer vos propres sous-classes d'`Error`](https://fr.javascript.info/custom-errors) et utiliser l'opérateur [`instanceof`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/instanceof) pour déterminer quelle erreur est survenue. Vous pouvez par exemple définir une `NotFoundError` sur-mesure et la lever depuis votre composant. À partir de là, vos fonctions de rappel `onError`, `onShellReady` et `onShellError` peuvent différencier leur gestion en fonction du type d'erreur :

```js {2,4-14,19,24,30}
let didError = false;
let caughtError = null;

function getStatusCode() {
  if (didError) {
    if (caughtError instanceof NotFoundError) {
      return 404;
    } else {
      return 500;
    }
  } else {
    return 200;
  }
}

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
   response.statusCode = getStatusCode();
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Ça sent le pâté…</h1>');
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Gardez à l'esprit qu'une fois que vous avez émis l'enveloppe et commencé à streamer, vous ne pourrez plus changer le code de réponse HTTP.

---

### Attendre que tout le contenu soit chargé pour les moteurs d'indexation web et la génération statique {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

Le streaming offre une meilleure expérience utilisateur parce que l'utilisateur peut voir le contenu au fur et à mesure de sa mise à disposition.

Ceci étant, lorsqu'un moteur d'indexation web visite votre page, ou si vous générez ces pages au moment du *build*, vous pourriez vouloir attendre que tout le contenu soit d'abord chargé pour ensuite produire le résultat HTML final, plutôt que de le révéler progressivement.

Vous pouvez attendre que tout le contenu soit disponible en utilisant la fonction de rappel `onAllReady` :


```js {2,7,11,18-24}
let didError = false;
let isCrawler = // ... dépend de votre stratégie de détection de bot ...

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Ça sent le pâté…</h1>');
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Un visiteur normal recevra le flux de contenu chargé progressivement. Un moteur d'indexation web recevra le résultat HTML final, une fois toutes les données chargées.  Ça signifie cependant que ce moteur devra attendre *toutes* les données, dont certaines peuvent être lentes à charger ou causer une erreur.  Selon la nature de votre appli, vous pourriez choisir d'envoyer juste l'enveloppe aux moteurs d'indexation web.

---

### Abandonner le rendu côté serveur {/*aborting-server-rendering*/}

Vous pouvez forcer le rendu côté serveur à « laisser tomber » au bout d'un certain temps :

```js {1,5-7}
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

React enverra les contenus de secours restants en HTML puis tentera de faire la fin du rendu côté client.
