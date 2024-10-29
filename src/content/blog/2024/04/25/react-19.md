---
title: "React 19 RC"
author: L'équipe React
date: 2024/04/25
description: React 19 RC est désormais disponible sur npm ! Dans cet article, nous vous donnons un aperçu des nouveautés de React 19 et de la façon de les adopter.
---

Le 25 avril 2024 par [l'équipe React](/community/team)

---

<Intro>

React 19 RC est désormais disponible sur npm !

</Intro>

Dans notre [guide de migration pour React 19 RC](/blog/2024/04/25/react-19-upgrade-guide), nous avons fourni des instructions pas à pas pour mettre à jour votre appli vers React 19.  Dans cet article, nous allons passer en revue les nouveautés de React 19, et voir comment vous pouvez les adopter.

- [Quoi de neuf dans React 19](#whats-new-in-react-19)
- [React Server Components](#react-server-components)
- [Les améliorations de React 19](#improvements-in-react-19)
- [Comment mettre à jour](#how-to-upgrade)

Pour une liste des ruptures de compatibilité ascendante, consultez le [guide de migration](/blog/2024/04/25/react-19-upgrade-guide).

---

## Quoi de neuf dans React 19 {/*whats-new-in-react-19*/}

### Actions {/*actions*/}

Dans les applis React, il est courant de modifier les données puis d'attendre une mise à jour de l'état suite à ça.  Lorsque par exemple un utilisateur envoie un formulaire pour modifier son nom, vous faites une requête API et traitez la réponse.  Par le passé, vous auriez eu à gérer manuellement l'état en attente, les erreurs, les mises à jour optimistes et le séquençage des requêtes.

Vous auriez pu par exemple gérer l'état en attente et les erreurs avec `useState` :

```js
// Avant les Actions
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    const error = await updateName(name);
    setIsPending(false);
    if (error) {
      setError(error);
      return;
    } 
    redirect("/path");
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Mettre à jour
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

Avec React 19, nous prenons désormais en charge les fonctions asynchrones dans les transitions pour gérer automatiquement l'état d'attente, les erreurs, les formulaires, et les mises à jour optimistes.

Vous pouvez par exemple utiliser `useTransition` pour gérer l'état d'attente pour vous :

```js
// Obtention de l'état d'attente depuis les Actions
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);
      if (error) {
        setError(error);
        return;
      } 
      redirect("/path");
    })
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Mettre à jour
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

La transition asynchrone mettra immédiatement l'état `isPending` à `true`, fera la requête asynchrone, et basculera `isPending` à `false` après que les transitions auront terminé.  Ça vous permet de conserver une UI réactive et interactive pendant le chargement des données.

<Note>

#### Par convention, une fonction utilisant une transition asynchrone est une « Action » {/*by-convention-functions-that-use-async-transitions-are-called-actions*/}

Les Actions gèrent automatiquement l'envoi de données pour vous :

- **L'état en attente** : les Actions fournissent un état en attente qui démarre au début de la requête et se réinitialise automatiquement lorsque la dernière mise à jour d'état est finalisée.
- **Mises à jour optimistes** : les Actions prennent en charge le nouveau Hook [`useOptimistic`](#new-hook-optimistic-updates) pour pouvoir fournir un retour instantané à l'utilisateur pendant le traitement des requêtes.
- **Gestion d'erreurs** : les Actions fournissent une gestion d'erreurs afin que vous puissiez afficher des Périmètres d'Erreurs si la requête échoue, et annuler automatiquement des mises à jour optimistes pour revenir à leurs valeurs antérieures.
- **Formulaires** : les éléments `<form>` autorisent désormais des fonctions comme valeur pour leurs props `action` et `formAction`. Le passage de fonctions à ces props utilise par défaut des Actions et réinitialise automatiquement le formulaire après envoi.

</Note>

En s'appuyant sur les Actions, React 19 apporte [`useOptimistic`](#new-hook-optimistic-updates) pour gérer les mises à jour optimistes, ainsi qu'un nouveau Hook [`useActionState`](#new-hook-useactionstate) pour traiter des cas courants liés aux Actions. Nous ajoutons par ailleurs à `react-dom` les [Actions de formulaires](#form-actions) pour gérer automatiquement les formulaires et [`useFormStatus`](#new-hook-useformstatus) pour prendre en charge des cas courants liés aux Actions de formulaires.

Avec React 19, l'exemple de tout à l'heure peut être simplifié comme ceci :

```js
// En utilisant des Actions de formulaire et useActionState
function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      return null;
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>Mettre à jour</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

Dans la prochaine section, nous détaillerons chaque nouveauté de React 19 liée aux Actions.

### Nouveau Hook : `useActionState` {/*new-hook-useactionstate*/}

Pour simplifier les cas courants liés aux Actions, nous avons ajouté un nouveau Hook appelé `useActionState` :

```js
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);
    if (error) {
      // Vous pouvez renvoyer ce que vous voulez depuis une Action.
      // Nous renvoyons ici juste l'erreur.
      return error;
    }

    // Ici, le traitement de la mise à jour réussie
    return null;
  },
  null,
);
```

`useActionState` accepte une fonction (« l'Action ») et renvoie une Action enrobée à appeler. Ça fonctionne car les Actions peuvent être composées.  Lorsque l'Action enrobée est appelée, `useActionState` ernverra le dernier résultat connu de l'Action en tant que `data`, et l'état en attente de l'Action en tant que `pending`.

<Note>

`React.useActionState` était auparavant exposée via `ReactDOM.useFormState` dans les versions Canari, mais nous l'avons renommée et avons déprécié `useFormState`.

Allez voir [#28491](https://github.com/facebook/react/pull/28491) pour plus de détails à ce sujet.

</Note>

Pour en apprendre davantage, consultez la documentation de [`useActionState`](/reference/react/useActionState).

### React DOM : actions de formulaires (sur `<form>`) {/*form-actions*/}

Les Actions s'intègrent également avec les nouvelles fonctionnalités liées à `<form>` fournies par `react-dom` dans React 19. Nous avons ajouté la prise en charge de valeurs de type fonction pour les props `action` et `formAction` des éléments `<form>`, `<input>` et `<button>`, afin d'envoyer automatiquement des formulaires grâce aux Actions :

```js [[1,1,"actionFunction"]]
<form action={actionFunction}>
```

Lorsqu'une Action de formulaire réussit, React réinitialise automatiquement les composants non contrôlés du formulaire.  Si vous avez besoin de réinitialiser manuellement le `<form>`, vous pouvez appeler la nouvelle fonction React DOM `requestFormReset`.

Pour en apprendre davantage, consultez la documentation de `react-dom` pour [`<form>`](/reference/react-dom/components/form), [`<input>`](/reference/react-dom/components/input) et `<button>`.

### React DOM : nouveau Hook : `useFormStatus` {/*new-hook-useformstatus*/}

Dans un Design System, il est courant d'écrire des composants qui ont besoin d'accéder à des informations sur le `<form>` qui les contient, sans avoir à faire percoler des props jusqu'au composant.  On peut y arriver avec un Contexte, mais pour faciliter les cas courants nous avons ajouté un nouveau Hook `useFormStatus` :

```js [[1, 4, "pending"], [1, 5, "pending"]]
import {useFormStatus} from 'react-dom';

function DesignButton() {
  const {pending} = useFormStatus();
  return <button type="submit" disabled={pending} />
}
```

`useFormStatus` lit l'état du `<form>` parent comme si ce dernier était un fournisseur de Contexte.

Pour en apprendre davantage, consultez la documentation de `react-dom` pour [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).

### Nouveau Hook : `useOptimistic` {/*new-hook-optimistic-updates*/}

Une autre approche courante d'UI lorsqu'on exécute une mutation de données consiste à afficher l'état final de façon optimiste (anticipée) tandis que la requête asynchrone est en cours.  Avec React 19, nous apportons un nouveau Hook appelé `useOptimistic` pour faciliter ça :

```js {2,6,13,19}
function ChangeName({currentName, onUpdateName}) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async formData => {
    const newName = formData.get("name");
    setOptimisticName(newName);
    const updatedName = await updateName(newName);
    onUpdateName(updatedName);
  };

  return (
    <form action={submitAction}>
      <p>Vous vous appelez {optimisticName}</p>
      <p>
        <label>Changer votre nom :</label>
        <input
          type="text"
          name="name"
          disabled={currentName !== optimisticName}
        />
      </p>
    </form>
  );
}
```

Le Hook `useOptimistic` produira immédiatement le `optimisticName` pour le rendu, pendant que la requête `updateName` est en cours. Lorsque la mise à jour se termine ou produit une erreur, React rebascule automatiquement sur la valeur de `currentName`.

Pour en apprendre davantage, consultez la documentation de [`useOptimistic`](/reference/react/useOptimistic).

### Nouvelle fonction : `use` {/*new-feature-use*/}

React 19 apporte une nouvelle fonction pour consommer des ressources lors du rendu : `use`.

Vous pouvez par exemple consommer une promesse avec `use`, et React suspendra le composant le temps que la promesse s'établisse :

```js {1,5}
import {use} from 'react';

function Comments({commentsPromise}) {
  // `use` suspendra le composant le temps que la promesse s’établisse
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

function Page({commentsPromise}) {
  // Lorsque `use` suspendra Comments,
  // ce périmètre Suspense affichera le rendu de secours.
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

<Note>

#### `use` n'accepte pas les promesses créées lors du rendu. {/*use-does-not-support-promises-created-in-render*/}

Si vous essayez de passer à `use` une promesse créée lors du rendu, React vous avertira :

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.

</ConsoleLogLine>

</ConsoleBlockMulti>

*(« Un composant est suspendu sur une promesse absente du cache.  Nous ne prenons pas encore en charge les promesses créées dans un Composant Client ou dans un Hook, sauf au travers de bibliothèques ou frameworks compatibles avec Suspense. » — NdT)*

Pour corriger ça, vous devez passer une promesse issue d'une bibliothèque ou d'un framework prenant en charge la mise en cache de promesses à destination de Suspense.  Nous prévoyons de livrer à l'avenir des fonctionnalités qui faciliteront la mise en cache de promesses au sein du rendu.

</Note>

Vous pouvez aussi consommer un Contexte avec `use`, ce qui vous permet de lire des Contextes conditionnellement, par exemple après un retour anticipé :

```js {1,11}
import {use} from 'react';
import ThemeContext from './ThemeContext'

function Heading({children}) {
  if (children == null) {
    return null;
  }

  // Ça ne marcherait pas avec `useContext`
  // puisqu’on est derrière un retour anticipé.
  const theme = use(ThemeContext);
  return (
    <h1 style={{color: theme.color}}>
      {children}
    </h1>
  );
}
```

La fonction `use` ne peut être appelée qu'au sein du rendu, comme pour les Hooks. Mais contrairement aux Hooks, `use` peut être appelée conditionnellement.  Nous prévoyons d'ajouter à l'avenir des modes supplémentaires de consommation de ressources lors du rendu grâce à `use`.

Pour en apprendre davantage, consultez la documentation de [`use`](/reference/react/use).

## React Server Components {/*react-server-components*/}

### Composants Serveur {/*server-components*/}

Les Composants Serveur *(React Server Components, ou RSC — NdT)* sont un nouveau type de Composant qui font un rendu anticipé, avant le *bundling*, dans un environnement distinct de votre appli client et d'un serveur SSR. Cet environnement séparé est le « serveur » des Composants Serveur. Les Composants Serveur peuvent n'être exécutés qu'une seule fois au moment du build sur votre serveur de CI, ou peuvent l'être à chaque requête au sein d'un serveur web.

React 19 inclut toutes les fonctionnalités de Composants Serveur issues du canal Canari.  Ça signifie que les bibliothèques qui utilisent les Composants Serveur peuvent désormais cibler React 19 comme dépendance de pair avec une [condition d'export](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md#react-server-conditional-exports) `react-server` afin d'être utilisables par des frameworks qui prennent en charge [l'architecture Full-stack React](/learn/start-a-new-react-project#which-features-make-up-the-react-teams-full-stack-architecture-vision).

<Note>

#### Comment prendre en charge les Composants Serveur ? {/*how-do-i-build-support-for-server-components*/}

Même si les Composants Serveur dans React 19 sont stables et ne casseront pas la compatibilité entre les versions majeures, les API sous-jacentes utilisées pour implémenter les Composants Serveur au sein d'un *bundler* ou framework ne suivent pas, elles, le versionnage sémantique et sont susceptibles de casser la compatibilité entre les versions mineures de React 19.x.

Pour prendre en charge les Composants Serveur dans un *bundler* ou framework, nous vous conseillons de figer React sur une version spécifique, ou d'utiliser une version Canari.  Nous allons continuer à collaborer avec les *bundlers* et frameworks pour stabiliser les API utilisées pour implémenter les Composants Serveur à l'avenir.

</Note>

Pour en apprendre davantage, consultez la documentation des [Composants Serveur](/reference/rsc/server-components).

### Actions Serveur {/*server-actions*/}

Les Actions Serveur permettent aux Composants Client d'appeler des fonctions asynchrones exécutées côté serveur.

Lorsqu'une Action Serveur est définie au moyen d'une directive `"use server"`, votre framework crée automatiquement une référence à la fonction serveur, et la passe au Composant Client.  Lorsque cette fonction sera appelée côté client, React réagira en envoyant une requête au serveur pour exécuter cette fonction, et en renvoyant le résultat.

<Note>

#### Les Composants Serveur n'ont pas de directive. {/*there-is-no-directive-for-server-components*/}

Une erreur de perception courante veut que les Composants Serveur soient identifié par `"use server"`, mais les Composants Serveur n'ont en fait pas de directive dédiée. La directive `"use server"` est là pour les Actions Serveur.

Pour en savoir plus, lisez la documentation des [directives](/reference/rsc/directives).

</Note>

Les Actions Serveur peuvent être créées dans les Composants Serveur et passées comme props à des Composants Client, ou peuvent être directement importées et utilisées dans des Composants Client.

Pour en apprendre davantage, consultez la documentation des [Actions Serveur](/reference/rsc/server-actions).

## Les améliorations de React 19 {/*improvements-in-react-19*/}

### `ref` est une prop {/*ref-as-a-prop*/}

À partir de React 19, vous pouvez accéder à `ref` en tant que prop dans les fonctions composants :

```js [[1, 1, "ref"], [1, 2, "ref", 45], [1, 6, "ref", 14]]
function MyInput({placeholder, ref}) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
<MyInput ref={ref} />
```

Les nouvelles fonctions composants n'ont plus besoin de `forwardRef`, et nous publierons un codemod pour automatiquement mettre à jour vos composants afin qu'ils utilisent la nouvelle prop `ref`. De futures versions déprécieront puis retireront `forwardRef`.

<Note>

Les `refs` passées aux classes ne sont pas passées comme props puisqu'elles référencent l'instance du composant.

</Note>

### Des diffs dans les erreurs d'hydratation {/*diffs-for-hydration-errors*/}

Nous avons aussi amélioré le signalement des erreurs d'hydratation dans `react-dom`.  Par exemple, plutôt que de signaler plusieurs erreurs en mode développement sans aucune information sur la discordance :

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: Text content does not match server-rendered HTML.
{'  '}at checkForUnmatchedText
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

Nous affichons désormais un message unique avec un diff de la discordance :

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if an SSR-ed Client Component used:{'\n'}
\- A server/client branch `if (typeof window !== 'undefined')`.
\- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
\- Date formatting in a user's locale which doesn't match the server.
\- External changing data without sending a snapshot of it along with the HTML.
\- Invalid HTML tag nesting.{'\n'}
It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.{'\n'}
https://react.dev/link/hydration-mismatch {'\n'}
{'  '}\<App\>
{'    '}\<span\>
{'+    '}Client
{'-    '}Server{'\n'}
{'  '}at throwOnHydrationMismatch
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

### `<Context>` fournit directement le contexte {/*context-as-a-provider*/}

Avec React 19, vous pouvez désormais utiliser `<Context>` comme fournisseur plutôt que `<Context.Provider>` :


```js {5,7}
const ThemeContext = createContext('');

function App({children}) {
  return (
    <ThemeContext value="dark">
      {children}
    </ThemeContext>
  );  
}
```

Les nouveaux fournisseurs de Contexte peuvent utiliser `<Context>` et nous publierons un codemod pour convertir les fournisseurs existants.  Une future version dépréciera `<Context.Provider>`.

### Les refs ont des fonctions de nettoyage {/*cleanup-functions-for-refs*/}

Nous permettons désormais le renvoi d'une fonction de nettoyage depuis les fonctions de rappel de `ref` :

```js {7-9}
<input
  ref={(ref) => {
    // ref créée

    // NOUVEAU : renvoi d’une fonction de nettoyage pour
    // réinitialiser la ref quand l’élément quitte le DOM
    return () => {
      // nettoyage de la ref
    };
  }}
/>
```

Lorsque le composant est démonté, React appellera la fonction de nettoyage renvoyée par la fonction de rappel de `ref`.  Ça fonctionne pour les refs DOM, les refs des composants à base de classe, et même la fonction `useImperativeHandle`.

<Note>

Auparavant, React appelait les fonctions de `ref` avec `null` lors du démontage d'un composant.  Si votre `ref` renvoie une fonction de nettoyage, React sautera désormais cette étape.

Une future version dépréciera l'appel de refs avec `null` au démontage de composants.

</Note>

Suite à l'arrivée des fonctions de nettoyage de ref, TypeScript refuse désormais qu'une fonction de rappel de `ref` renvoie autre chose qu'une fonction.  Le correctif consiste en général à cesser d'utiliser les renvois implicites, par exemple comme ceci :

```diff [[2, 1, "("], [2, 1, ")"], [4, 2, "{", 15], [4, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

Le code original renvoyait l'instance de `HTMLDivElement` et TypeScript ne pouvait savoir si le résultat était _censé_ être une fonction de nettoyage, ou si vous n'aviez pas l'intention de renvoyer quoi que ce soit.

Vous pouvez corriger ce motif de code avec le codemod [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return).

### `useDeferredValue` accepte une valeur initiale {/*use-deferred-value-initial-value*/}

Nous avons ajouté une `initialValue` optionnelle à `useDeferredValue` :

```js [[1, 1, "deferredValue"], [1, 4, "deferredValue"], [2, 4, "''"]]
function Search({deferredValue}) {
  // Au rendu initial la valeur est ''.
  // Un rendu ultérieur sera planifié avec `deferredValue`.
  const value = useDeferredValue(deferredValue, '');
  
  return (
    <Results query={value} />
  );
}
```

Lorsqu'<CodeStep step={2}>initialValue</CodeStep> est fournie, `useDeferredValue` la renvoie comme `value` pour le rendu initial du composant, et planifie un nouveau rendu en arrière-plan, lors duquel elle renverra <CodeStep step={1}>deferredValue</CodeStep>.

Pour en apprendre davantage, consultez la documentation de [`useDeferredValue`](/reference/react/useDeferredValue).

### Prise en charge des métadonnées du document {/*support-for-metadata-tags*/}

En HTML, les balises de métadonnées du document telles que `<title>`, `<link>` et `<meta>` ne peuvent être placées que dans la section `<head>` du document. Avec React, le composant qui décide de quelles métadonnées sont pertinentes pour l'appli est généralement bien éloigné de l'endroit où vous définissez `<head>`. Par le passé, ces éléments auraient nécessité une insertion manuelle dans un Effet, ou au travers de bibliothèques telles que [`react-helmet`](https://github.com/nfl/react-helmet), et auraient nécessité quelques précautions lors du rendu côté serveur d'une application React. 

React 19 prend désormais nativement en charge le rendu de métadonnées du document depuis vos composants :

```js {5-8}
function BlogPost({post}) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      <meta name="author" content="Josh" />
      <link rel="author" href="https://twitter.com/joshcstory/" />
      <meta name="keywords" content={post.keywords} />
      <p>
        E égale m c au carré...
      </p>
    </article>
  );
}
```

Lorsque React fait le rendu de ce composant, il voit les balises `<title>`, `<link>` et `<meta>`, et les remonte automatiquement dans la section `<head>` du document.  En prenant nativement en charge ces métadonnées, nous nous assurons au passage qu'elles fonctionnent aussi bien dans les applis entièrement côté client que dans des flux SSR ou des Composants Serveur.

<Note>

#### Vous aurez peut-être encore besoin d'une bibliothèque de métadonnées {/*you-may-still-want-a-metadata-library*/}

Pour les cas simples, effectuer le rendu des métadonnées du document sous forme de balises est certes acceptable, mais les bibliothèques peuvent offrir des fonctionnalités plus avancées telles que la surcharge de métadonnées génériques par des valeurs spécifiques basées sur la route active. Ce que nous fournissons nativement facilite l'implémentation de frameworks et bibliothèques tels que [`react-helmet`](https://github.com/nfl/react-helmet), sans pour autant les remplacer.

</Note>

Pour en apprendre davantage, consultez les documentations de [`<title>`](/reference/react-dom/components/title), [`<link>`](/reference/react-dom/components/link) et [`<meta>`](/reference/react-dom/components/meta).

### Prise en charge des feuilles de styles {/*support-for-stylesheets*/}

Les feuilles de styles, tant en variante externe (`<link rel="stylesheet" href="...">`) qu'intégrée (`<style>...</style>`), requièrent un emplacement adéquat dans le DOM en raison des règles de précédence de styles.  Il n'est pas aisé de construire une gestion de feuilles de styles permettant la composabilité au sein des composants, de sorte que les utilisateurs se retrouvent souvent à charger tous leurs styles séparément des composants susceptibles d'en dépendre, ou à recourir à une bibliothèque de styles qui masque cette complexité.

Avec React 19, nous gérons cette complexité et proposons une intégration plus étroite encore avec le Rendu Concurrent côté client, et les flux de rendu côté serveur, grâce à une prise en charge native des feuilles de styles.  Si vous indiquez à React la `precedence` de votre feuille de styles, il gèrera son ordre d'insertion dans le DOM et s'assurera que la feuille de styles (si elle est externe) est bien chargée avant d'afficher du contenu qui dépende des règles de style ainsi obtenues.

```js {4,5,17}
function ComponentOne() {
  return (
    <Suspense fallback="Chargement...">
      <link rel="stylesheet" href="foo" precedence="default" />
      <link rel="stylesheet" href="bar" precedence="high" />
      <article class="foo-class bar-class">
        {...}
      </article>
    </Suspense>
  )
}

function ComponentTwo() {
  return (
    <div>
      <p>{...}</p>
      <link rel="stylesheet" href="baz" precedence="default" /> <-- sera insérée entre foo et bar
    </div>
  )
}
```

Lors du rendu côté serveur *(SSR, Server-Side Rendering — NdT)*, React inclura la feuille de styles dans le `<head>`, ce qui garantira que le navigateur n'affichera rien jusqu'à son chargement. Si la feuille de styles est découverte tardivement après le début du flux de réponse, React s'assurera que la feuille de styles est insérée dans le `<head>` du client avant de révéler le contenu du périmètre Suspense qui dépend de cette feuille de styles.

Lors du rendu côté client, React attendra que les feuilles de styles nouvellement injectées soient chargées avant de finaliser le rendu (phase de commit).  Si vous affichez ce composant à de multiples endroits dans votre application, React n'inclura la feuille de styles qu'une seule fois dans le document :

```js {5}
function App() {
  return <>
    <ComponentOne />
    ...
    <ComponentOne /> // n’entraînera pas d’élément `link` dupliqué dans le DOM
  </>
}
```

Si vous êtes habitué·e à charger vos feuilles de styles manuellement, c'est l'occasion de placer ces feuilles de styles à côté des composants qui en dépendent, ce qui facilite un raisonnement local et permet de ne charger que les feuilles de styles dont vous avez effectivement besoin.

Les bibliothèques de styles et les intégrations de styles par les *bundlers* peuvent aussi s'appuyer sur cette nouvelle fonctionnalité, de sorte que même si vous ne réalisez pas directement le rendu de vos feuilles de styles, vous pourriez en bénéficier une fois l'outillage mis à jour pour en tirer parti.

Pour en apprendre davantage, consultez les documentations de [`<link>`](/reference/react-dom/components/link) et [`<style>`](/reference/react-dom/components/style).

### Prise en charge des scripts asynchrones {/*support-for-async-scripts*/}

En HTML, les scripts normaux (`<script src="...">`) et différés (`<script defer="" src="...">`) sont chargés dans l'ordre du document, ce qui rend délicate leur injection dynamique au sein de votre arbre de composants. Les scripts asynchrones (`<script async="" src="...">`) sont en revanche chargés dans un ordre quelconque.

Avec React 19, nous avons ajouté une meilleure prise en charge des scripts asynchrones en vous permettant de faire leur rendu à n'importe quel endroit de l'arbre de composants, au sein des composants qui se servent effectivement du script, sans avoir à gérer leur déplacement ni leur dédoublonnement.

```js {4,15}
function MyComponent() {
  return (
    <div>
      <script async={true} src="..." />
      Salut tout le monde
    </div>
  )
}

function App() {
  <html>
    <body>
      <MyComponent>
      ...
      <MyComponent> // n’entraînera pas d’élément `script` dupliqué dans le DOM
    </body>
  </html>
}
```

Quel que soit l'environnement de rendu, les scripts asynchrones seront dédoublonnés afin que React ne charge et n'exécute le script qu'une seule fois, même s'ils figurent dans les rendus de plusieurs composants distincts.

Pour le rendu côté serveur, les scripts asynchrones sont inclus dans le `<head>` et dépriorisés par rapport à des ressources plus critiques qui bloqueraient l'affichage, tels que les feuilles de styles, fontes et images préchargées.

Pour en apprendre davantage, consultez la documentation de [`<script>`](/reference/react-dom/components/script).

### Prise en charge du préchargement de ressources {/*support-for-preloading-resources*/}

Lors du chargement initial du document et des mises à jour côté client, le fait d'indiquer au navigateur quelles ressources il devrait probablement charger le plus tôt possible peut dramatiquement améliorer les performances de la page.

React 19 fournit une série de nouvelles fonctions pour charger voire précharger des ressources navigateur, afin de faciliter au mieux la construction d'expériences utilisateur haut de gamme qui ne soient pas gênées par un chargement inefficace des ressources.

```js
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'
function MyComponent() {
  preinit('https://.../path/to/some/script.js', {as: 'script' }) // charge et exécute le script au plus tôt
  preload('https://.../path/to/font.woff', { as: 'font' }) // précharge cette fonte
  preload('https://.../path/to/stylesheet.css', { as: 'style' }) // précharge cette feuille de styles
  prefetchDNS('https://...') // si vous n’êtes pas certain·e de charger quelque chose depuis cet hôte
  preconnect('https://...') // si vous allez y charger quelque chose, mais n’êtes pas sûr·e de quoi
}
```
```html
<!-- le code ci-dessus produirait le DOM/HTML suivant -->
<html>
  <head>
    <!-- les `link`/`script` sont priorisés selon leur utilité pour le chargement rapide,
         et non selon leur ordre d’appel -->
    <link rel="prefetch-dns" href="https://...">
    <link rel="preconnect" href="https://...">
    <link rel="preload" as="font" href="https://.../path/to/font.woff">
    <link rel="preload" as="style" href="https://.../path/to/stylesheet.css">
    <script async="" src="https://.../path/to/some/script.js"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

Ces fonctions peuvent être utilisées pour optimiser le chargement initial de la page en faisant remonter la découverte de ressources additionnelles, telles que les fontes, avant le chargement des feuilles de styles.  Elles peuvent aussi accélérer les mises à jour côté client en pré-résolvant une série de ressources qu'utilisera une navigation, puis en préchargeant agressivement ces ressources lors du clic voire du survol.

Pour en apprendre davantage, consultez [API de préchargement de ressources](/reference/react-dom#resource-preloading-apis).

### Compatibilité avec les scripts et extensions tiers {/*compatibility-with-third-party-scripts-and-extensions*/}

Nous avons amélioré l'hydratation pour tenir compte des scripts et extensions de navigateur tiers.

Lors de l'hydratation, si un élément rendu côté client ne correspond pas à celui trouvé dans le HTML fourni par le serveur, React force un nouveau rendu client pour corriger le contenu.  Auparavant, si un élément était injecté par des scripts ou extensions tiers, ça constituait une telle discordance et entraînait donc un nouveau rendu client.

Avec React 19, les balises inattendues dans `<head>` et `<body>` sont ignorées, ce qui évite des discordances.  Si React a besoin de refaire le rendu du document entier en raison d'une autre discordance d'hydratation, il laissera en place les feuilles de styles injectées par les scripts et extensions tiers.

### Meilleur signalement d'erreurs {/*error-handling*/}

Nous avons amélioré la gestion d'erreurs dans React 19 pour retirer les doublons et fournir des options pour gérer vous-même les erreurs interceptées ou non interceptées.  Lorsque par exemple une erreur survenue lors d'un rendu est interceptée par un Périmètre d'Erreurs, auparavant React aurait levé l'erreur deux fois (une pour l'erreur originale, puis une autre après avoir échoué à retomber sur ses pieds), pour finir par appeler `console.error` avec des infos d'emplacement pour l'erreur.

Ça donnait trois erreurs listées pour chaque erreur interceptée :

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: hit<span className="ms-2 text-gray-30">{'    <--'} Doublon</span>
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.

</ConsoleLogLine>

</ConsoleBlockMulti>

Avec React 19, nous signalons une seule erreur avec toutes les infos déjà présentes :

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...{'\n'}
The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
{'  '}at ErrorBoundary
{'  '}at App

</ConsoleLogLine>

</ConsoleBlockMulti>

Qui plus est, nous avons ajouté deux nouvelles options racines en complément de `onRecoverableError` :

- `onCaughtError` : appelée lorsque React intercepte une erreur avec un Périmètre d'Erreurs.
- `onUncaughtError` : appelée lorsque l'erreur est levée mais non interceptée par un Périmètre d'Erreurs.
- `onRecoverableError` : appelée lorsque l'erreur est levée mais que React retombe sur ses pieds.

Pour en apprendre davantage et voir d'autres exemples, consultez les documentations de [`createRoot`](/reference/react-dom/client/createRoot) et [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).

### Prise en charge des *Custom Elements* {/*support-for-custom-elements*/}

React 19 prend désormais pleinement en charge les éléments personnalisés *(Custom Elements, nécessaires aux Web Components natifs, NdT)* et passe tous les tests de [Custom Elements Everywhere](https://custom-elements-everywhere.com/).

Dans les précédentes versions, utiliser des éléments personnalisés dans React s'avérait difficile parce que React traitait les props non reconnues comme des attributs plutôt que comme des props.  Avec React 19, nous avons ajouté une prise en charge des props qui fonctionne côté client et lors du SSR selon la stratégie suivante :

- **Côté serveur** : les props passées à un élément personnalisé produisent des attributs si leur type est primitif (ex. `string`, `number`) ou si la valeur est `true`. Les props de type non primitif tels qu’`object`, `symbol`, `function` ainsi que la valeur `false` sont ignorés.
- **Côté client** : les props qui correspondent à une propriété de l'instance de l'élément personnalisé sont affectées à ces propriétés, à défaut de quoi elles produisent des attributs.

Merci à [Joey Arhar](https://github.com/josepharhar) pour avoir piloté la conception et l'implémentation de la prise en charge des éléments personnalisés dans React.

## Comment mettre à jour {/*how-to-upgrade*/}

Consultez le [guide de migration React 19](/blog/2024/04/25/react-19-upgrade-guide) pour des instructions pas à pas et la liste complète des ruptures de compatibilité ascendante et des changements notables.