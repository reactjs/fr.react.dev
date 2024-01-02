---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, qu’on peut abréger `<>...</>`, vous permet de grouper des éléments sans balise enrobante.

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `<Fragment>` {/*fragment*/}

Enrobez des éléments dans un `<Fragment>` pour les grouper dans des situations ou vous ne devez fournir qu'un seul élément. Grouper des éléments dans un `<Fragment>` n’a pas d’effet sur le DOM résultat ; c’est comme si les éléments n’étaient pas groupés. La balise vide `<></>` en JSX est utilisée la plupart du temps comme version concise de `<Fragment></Fragment>`.

#### Props {/*props*/}

- `key` **optionnel** : les Fragments déclarés explicitement avec la syntaxe `<Fragment>` peuvent avoir une [keys](/learn/rendering-lists#keeping-list-items-in-order-with-key).

#### Limitations {/*caveats*/}

- Si vous souhaitez utiliser une `key` dans un Fragment, vous ne pouvez pas utiliser la syntaxe `<>...</>`. Vous devez explicitement importer `Fragment` depuis `'react'` et écrire `<Fragment key={yourKey}>...</Fragment>`.

- React ne [réinitialise pas l’état](/learn/preserving-and-resetting-state) quand vous passez d'une structure `<><Child /></>` à `[<Child />]` et inversement, ni quand vous passez de `<><Child /></>` à `<Child />` et inversement. Ça ne marche qu’à un niveau de profondeur : par exemple, passer de `<><><Child /></></>` à `<Child />` réinitialise l’état. Consultez [la sémantique précise ici](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b).

---

## Utilisation {/*usage*/}

### Renvoyer plusieurs éléments {/*returning-multiple-elements*/}

Utilisez `Fragment`, ou la syntaxe équivalente `<>...</>`, afin de grouper plusieurs éléments ensemble. Vous pouvez l’utiliser pour passer plusieurs éléments là où un seul élément est attendu. Par exemple, un composant ne peut renvoyer qu’un seul élément, mais avec un Fragment vous pouvez grouper plusieurs éléments et renvoyer ce groupe :

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

Les Fragments sont utiles car grouper des éléments avec un Fragment n’as pas d’effet sur la mise en page ou les styles, contrairement à l’enrobage par une balise conteneur telle qu’un élément du DOM. Si vous inspectez cet exemple avec les outils du navigateur, vous verrez que toutes les balises `<h1>` et `<p>` du DOM apparaissent au même niveau (avec le même parent) sans balise enrobante :

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="Des nouvelles" body="Ça fait un moment que je n’ai pas écrit..." />
      <Post title="Mon nouveau blog" body="Je démarre un nouveau blog !" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### Comment utiliser un Fragment sans la syntaxe spéciale ? {/*how-to-write-a-fragment-without-the-special-syntax*/}

L’exemple ci-dessus revient à importer `Fragment` depuis React :

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

Normalement vous n’aurez pas besoin d’utiliser ça à moins de vouloir [associer une `key` à votre `Fragment`](#rendering-a-list-of-fragments).

</DeepDive>

---

### Affecter plusieurs éléments à une variable {/*assigning-multiple-elements-to-a-variable*/}

Comme pour tous les autres éléments, vous pouvez affecter des Fragment à des variables, les passer en tant que props, etc. :

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Êtes vous sûr·e de vouloir quitter cette page ?
    </AlertDialog>
  );
}
```

---

### Grouper des éléments et du texte {/*grouping-elements-with-text*/}

Vous pouvez utiliser `Fragment` pour grouper du texte et des éléments :

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      De
      <DatePicker date={start} />
      à
      <DatePicker date={end} />
    </>
  );
}
```

---

### Afficher une liste de Fragments {/*rendering-a-list-of-fragments*/}

Voici un cas de figure où vous devez écrire `Fragment` explicitement plutôt que d’utiliser la syntaxe `<></>`. Quand vous [affichez plusieurs éléments dans une boucle](/learn/rendering-lists), vous avez besoin d’associer une `key` à chaque élément. Si les éléments compris dans la boucle sont des Fragments, vous devez utiliser la syntaxe classique JSX afin de fournir la prop `key` :

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

Vous pouvez inspecter le DOM pour vérifier qu’il n’y a pas d'élément enrobant autour des enfants du Fragment :

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'Des nouvelles', body: 'Ça fait un moment que je n’ai pas écrit...' },
  { id: 2, title: 'Mon nouveau blog', body: 'Je démarre un nouveau blog !' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>
