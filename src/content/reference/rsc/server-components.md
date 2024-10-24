---
title: Composants Serveur
canary: true
---

<Intro>

Les Composants Serveur *(React Server Components, ou RSC — NdT)* sont un nouveau type de Composant qui font un rendu anticipé, avant le *bundling*, dans un environnement distinct de votre appli client et d'un serveur SSR.

</Intro>

Cet environnement séparé est le « serveur » des Composants Serveur. Les Composants Serveur peuvent n'être exécutés qu'une seule fois au moment du build sur votre serveur de CI, ou peuvent l'être à chaque requête au sein d'un serveur web.

<InlineToc />

<Note>

#### Comment prendre en charge les Composants Serveur ? {/*how-do-i-build-support-for-server-components*/}

Même si les Composants Serveur dans React 19 sont stables et ne casseront pas la compatibilité entre les versions majeures, les API sous-jacentes utilisées pour implémenter les Composants Serveur au sein d'un *bundler* ou framework ne suivent pas, elles, le versionnage sémantique et sont susceptibles de casser la compatibilité entre les versions mineures de React 19.x.

Pour prendre en charge les Composants Serveur dans un *bundler* ou framework, nous vous conseillons de figer React sur une version spécifique, ou d'utiliser une version Canari.  Nous allons continuer à collaborer avec les *bundlers* et frameworks pour stabiliser les API utilisées pour implémenter les Composants Serveur à l'avenir.

</Note>

### Composants Serveur… sans serveur {/*server-components-without-a-server*/}

Les Composants Serveur peuvent être exécutés au moment du build pour lire des données du système de fichiers ou charger du contenu statique, de sorte qu'un serveur web n'est alors pas nécessaire.  Vous pourriez par exemple vouloir lire des données statiques issues d'un système de gestion de contenu (CMS).

Sans les Composants Serveur, on aurait classiquement recours à un chargement des données statiques depuis le client, au sein d'un Effet :

```js
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // NOTE : charge *après* le rendu initial de la page.
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

```js
// api.js
app.get(`/api/content/:page`, async (req, res) => {
  const page = req.params.page;
  const content = await file.readFile(`${page}.md`);
  res.send({content});
});
```

Cette approche implique que les utilisateurs aient besoin de télécharger et parser 75 Ko (compressés) complémentaires de bibliothèques, pour ensuite attendre qu'une seconde requête de chargement aboutisse après le chargement initial de la page, tout ça pour simplement afficher du contenu statique qui ne changera plus une fois la page affichée.

Avec les Composants Serveur, vous pouvez faire le rendu de ces composants une seule fois, lors du build :

```js
import marked from 'marked'; // Non inclus dans le bundle
import sanitizeHtml from 'sanitize-html'; // Non inclus dans le bundle

async function Page({page}) {
  // NOTE : charge *pendant* le rendu, durant le build de l'appli.
  const content = await file.readFile(`${page}.md`);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

Le résultat peut alors être rendu côté serveur (SSR) en HTML et téléversé sur un CDN.  Lorsque l'appli charge, le client ne verra pas le composant `Page` d'origine, ni les lourdes bibliothèques nécessaires au rendu du Markdown. Le client ne verra que le résultat final :

```js
<div><!-- HTML issu du Markdown --></div>
```

Ça signifie que le contenu est visible dès le chargement initial de la page, et que le bundle n'inclut pas les lourdes bibliothèques nécessaires à la production du contenu statique.

<Note>

Vous avez peut-être remarqué que le Composant Serveur ci-dessus est une fonction asynchrone :

```js
async function Page({page}) {
  //...
}
```

Les composants asynchrones sont une nouvelle possibilité offerte par les Composants Serveur, qui vous permet de recourir à `await` lors du rendu.

Vous en saurez plus dans [Composants asynchrones et Composants Serveur](#async-components-with-server-components) plus loin dans cette page.

</Note>

### Composants Serveur… avec un serveur {/*server-components-with-a-server*/}

Les Composants Serveur peuvent aussi être exécutés dans un serveur web lors du traitement d'une requête pour une page, ce qui vous permet d'accéder à votre couche de données sans avoir besoin de construire une API.  Le rendu est fait avant le *bundling* de l'appli, et peut passer des données et du JSX à des Composants Client.

Sans Composants Serveur, on a généralement recours à un Effet pour charger des données côté client :

```js
// bundle.js
function Note({id}) {
  const [note, setNote] = useState('');
  // NOTE : charge *après* le rendu initial de la page.
  useEffect(() => {
    fetch(`/api/notes/${id}`).then(data => {
      setNote(data.note);
    });
  }, [id]);

  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

function Author({id}) {
  const [author, setAuthor] = useState('');
  // NOTE : charge *après* le rendu de `Note`.
  // Ça entraîne une cascade client-serveur coûteuse.
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>Par : {author.name}</span>;
}
```
```js
// api
import db from './database';

app.get(`/api/notes/:id`, async (req, res) => {
  const note = await db.notes.get(id);
  res.send({note});
});

app.get(`/api/authors/:id`, async (req, res) => {
  const author = await db.authors.get(id);
  res.send({author});
});
```

Avec les Composants Serveur, vous pouvez lire les données et les afficher au sein du composant :

```js
import db from './database';

async function Note({id}) {
  // NOTE : charge *pendant* le rendu.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // NOTE : charge *après* `Note`, mais c'est rapide si les données sont co-localisées.
  const author = await db.authors.get(id);
  return <span>Par : {author.name}</span>;
}
```

Le *bundler* produit ensuite un bundle à partir des données, des Composants Serveur dont le rendu est donc déjà fait, et des Composants Client dynamiques.  Ce bundle peut, optionnellement, faire l'objet d'un rendu côté client (SSR) pour produire le HTML initial de la page. Lorsque la page est chargée, le navigateur ne voit pas les composants `Note` et `Author` d'origine ; seul le résultat du rendu est envoyé au client :

```js
<div>
  <span>Par : L'équipe React</span>
  <p>React 19 est...</p>
</div>
```

Les Composants Serveur peuvent devenir dynamiques en les rechargeant depuis le serveur, au sein duquel ils sont libres d'accéder aux données pour refaire leur rendu.  Cette nouvelle architecture d'application combine le modèle mental simple « requête / réponse » des applis multi-page (MPA, *Multi-Page Apps*), centrées sur le serveur, avec l'interactivité fluide des applis mono-page (SPA, *Single-Page Apps*), centrées elles sur le client. Vous obtenez ainsi le meilleur des deux mondes.

### Ajouter de l'interactivité aux Composants Serveur {/*adding-interactivity-to-server-components*/}

Les Composants Serveur ne sont pas envoyés au navigateur, ils ne peuvent donc pas utiliser des API interactives telles que `useState`.  Pour ajouter de l'interactivité aux Composants Serveur, vous pouvez les composer avec des Composants Client en utilisant la directive `"use client"`.

<Note>

#### Les Composants Serveur n'ont pas de directive. {/*there-is-no-directive-for-server-components*/}

Une erreur de perception courante veut que les Composants Serveur soient identifié par `"use server"`, mais les Composants Serveur n'ont en fait pas de directive dédiée. La directive `"use server"` est là pour les Actions Serveur.

Pour en savoir plus, lisez la documentation des [directives](/reference/rsc/directives).

</Note>

Dans l'exemple qui suit, le Composant Serveur `Notes` importe le Composant Client `Expandable`, lequel utilise un état pour basculer son statut `expanded` :

```js
// Composant Serveur
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p>{note}</p>
        </Expandable>
      ))}
    </div>
  )
}
```
```js
// Composant Client
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Basculer
      </button>
      {expanded && children}
    </div>
  )
}
```

Ça fonctionne en faisant d'abord le rendu de `Notes` en tant que Composant Serveur, puis en indiquant au *bundler* de créer un bundle avec le Composant Client `Expandable`.  Dans le navigateur, ces Composants Client verront le résultat du rendu des Composants Serveur au travers de leurs props :

```js
<head>
  <!-- le bundle pour les Composants Client -->
  <script src="bundle.js" />
</head>
<body>
  <div>
    <Expandable key={1}>
      <p>Voici la première note</p>
    </Expandable>
    <Expandable key={2}>
      <p>Voici la deuxième note</p>
    </Expandable>
    <!--...-->
  </div>
</body>
```

### Composants asynchrones et Composants Serveur {/*async-components-with-server-components*/}

Les Composants Serveur apportent une nouvelle façon d'écrire les composants en tirant parti de `async`/`await`.  Lorsque vous utilisez `await` au sein d'un composant asynchrone, React le suspend et attend l'accomplissement de la promesse pour reprendre son rendu.  Ça peut traverser la frontière client/serveur grâce à la prise en charge du streaming par Suspense.

Vous pouvez même créer une promesse sur le serveur, et l'attendre côté client :

```js
// Composant Serveur
import db from './database';

async function Page({id}) {
  // Suspendra le Composant Serveur
  const note = await db.notes.get(id);

  // NOTE : on n’attend pas, on démarre juste.  On attendra côté client.
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Chargement des commentaires...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

```js
// Composant Client
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // NOTE : on reprend la promesse issue du serveur.
  // Le composant suspendra le temps que les données deviennent disponibles.
  const comments = use(commentsPromise);
  return comments.map(commment => <p>{comment}</p>);
}
```

Le contenu `note` constitue une donnée important pour le rendu de la page, de sorte qu'on l'attend côté serveur. Mais les commentaires sont sous le *fold* (la limite basse de la fenêtre initiale de visualisation) et sont donc moins prioritaire, de sorte qu'on se contente de démarrer leur chargement côté serveur, pour n'en attendre l'aboutissement que côté client grâce à l'API `use`.  Ça suspendra côté client, sans bloquer le rendu initial du contenu `note`.

Dans la mesure où les composants asynchrones ne sont pas pris en charge côté client, on attend leur promesse avec `use`.
