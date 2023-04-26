---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, souvent utilisé avec la syntaxe `<>...</>`, vous permet de grouper des éléments sans balise englobante.

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

Englober des éléments dans un `<Fragment>` pour les grouper ensemble dans des situations ou vous avez besoin d'un seul élément. Grouper des éléments dans un `<Fragment>` n'a pas d'effet particulier sur le DOM ; c'est comme si les éléments n'étaient pas groupés. La plupart du temps, la balise vide en JSX `<></>` est utilisée afin de raccourcir l'écriture de `<Fragment></Fragment>`.

#### Props {/*props*/}

- **optionnel** `key`: Les Fragments déclarés explicitement avec la syntaxe `<Fragment>` peuvent contenir des [keys.](/learn/rendering-lists#keeping-list-items-in-order-with-key)

#### Limitations {/*caveats*/}

- Si vous souhaitez utiliser des `key` dans un Fragment, vous ne pouvez pas utiliser la syntaxe `<>...</>`. Vous devez explicitement importer `Fragment` depuis `'react'` et rendre `<Fragment key={yourKey}>...</Fragment>`.

- React ne [réinitialise pas l'état](/learn/preserving-and-resetting-state) quand vous passez de rendre `<><Child /></>` à `[<Child />]` et inversement, ou ni si vous passez de rendre `<><Child /></>` à `<Child />` et inversement. Ça marche seulement à un niveau plus profond : par exemple, en passer de `<><><Child /></></>` à `<Child />` réinitialise l'état. Consultez la sémantique précise [ici.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

---

## Utilisation {/*usage*/}

### Renvoyer plusieurs éléments {/*returning-multiple-elements*/}

Utilisez `Fragment`, ou la syntaxe équivalente `<>...</>`, afin de grouper plusieurs éléments ensemble. Vous pouvez l'utiliser pour mettre plusieurs éléments à la place d'un élément. Par exemple, un composant ne peut d'habitude renvoyer qu'un élément unique, mais avec un Fragment vous pouvez grouper plusieurs éléments et renvoyer ce groupe :

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

Les Fragments sont utiles car grouper des éléments avec un Fragment n'as pas d'effet sur la mise en page ou les styles, contrairement à l'utilisation d'un autre balise englobante du DOM. Si vous inspectez cet exemple avec les outils du navigateur, vous verrez que toutes les balises `<h1>` et `<p>` du DOM apparaissent en tant frères et sœur sans balise englobante :

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="Une mise à jour" body="Ça fait un moment que je n'ai pas posté..." />
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

#### How to write a Fragment without the special syntax? {/*how-to-write-a-fragment-without-the-special-syntax*/}

The example above is equivalent to importing `Fragment` from React:

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

Usually you won't need this unless you need to [pass a `key` to your `Fragment`.](#rendering-a-list-of-fragments)

</DeepDive>

---

### Assigning multiple elements to a variable {/*assigning-multiple-elements-to-a-variable*/}

Like any other element, you can assign Fragment elements to variables, pass them as props, and so on:

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
      Are you sure you want to leave this page?
    </AlertDialog>
  );
}
```

---

### Grouping elements with text {/*grouping-elements-with-text*/}

You can use `Fragment` to group text together with components:

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      From
      <DatePicker date={start} />
      to
      <DatePicker date={end} />
    </>
  );
}
```

---

### Rendering a list of Fragments {/*rendering-a-list-of-fragments*/}

Here's a situation where you need to write `Fragment` explicitly instead of using the `<></>` syntax. When you [render multiple elements in a loop](/learn/rendering-lists), you need to assign a `key` to each element. If the elements within the loop are Fragments, you need to use the normal JSX element syntax in order to provide the `key` attribute:

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

You can inspect the DOM to verify that there are no wrapper elements around the Fragment children:

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
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
