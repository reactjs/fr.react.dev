---
title: Transmettre des données en profondeur avec le contexte
---

<Intro>

Habituellement, vous transmettez les informations d'un composant parent à un composant enfant *via* les props. Cependant, ça peut devenir verbeux et peu pratique si vous devez les faire passer à travers de nombreux composants intermédiaires, ou si plusieurs composants de votre appli ont besoin de la même information. Le *contexte* permet au composant parent de mettre à disposition certaines informations à n'importe quel composant de l'arbre situé en dessous de lui — peu importe la profondeur — sans avoir à les passer explicitement par le biais des props.

</Intro>

<YouWillLearn>

- Ce que signifie « faire percoler des props »
- Comment remplacer le passage répétitif des props par un contexte
- Les cas d'utilisation classiques du contexte
- Les alternatives courantes au contexte

</YouWillLearn>

## Le problème du passage de props {/*the-problem-with-passing-props*/}

Le [passage de props](/learn/passing-props-to-a-component) est un excellent moyen d'acheminer explicitement des données à travers l'arborescence de l'interface utilisateur jusqu'au composant qui les utilise.

Cependant, passer des props peut devenir verbeux et peu pratique quand vous devez passer certaines props profondément dans l'arbre, ou si de nombreux composants nécessitent la même prop. L'ancêtre commun peut être très éloigné du composant qui nécessite cette donnée, et [faire remonter l'état](/learn/sharing-state-between-components) aussi loin peut amener à une situation que l'on appelle « la percolation des props » *(“prop drilling”, NdT)*.

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="Un diagramme avec une arborescence de trois composants. Le parent contient une bulle représentant un valeur surlignée en violet. La valeur est transmise à ses deux enfants, toutes deux surlignées en violet." >

Faire remonter l'état

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="Un diagramme avec un arbre à dix nœuds, chacun d'eux ayant deux enfants ou moins. Le nœud racine contient une bulle représentant une valeur surlignée en violet. La valeur est transmise aux deux enfants, qui la transmettent à leur tour sans pour autant la contenir. Le nœud enfant de gauche passe la valeur à ses deux enfants qui sont tous deux surlignés en violet. Le nœud enfant de droite transmet la valeur à l'un de ses enfants (celui de droite), qui est surligné en violet. Ce dernier passe la valeur à son enfant unique, qui lui-même la transmet à ses deux enfants, surlignés en violet.">

Faire percoler l'état

</Diagram>

</DiagramGroup>

Ne serait-ce pas génial s'il existait une façon de « téléporter » la valeur jusqu'aux composants de l'arbre qui en ont besoin sans passer par les props ? Grâce à la fonctionnalité de contexte de React, c'est possible !

## Le contexte : une alternative au passage de props {/*context-an-alternative-to-passing-props*/}

Le contexte permet à un composant parent de mettre des données à disposition de tout l'arbre en dessous de lui. Il existe de nombreuses utilisations pour un contexte. En voici un exemple. Prenez ce composant `Heading` qui utilise `level` pour déterminer son niveau :

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Titre</Heading>
      <Heading level={2}>Section</Heading>
      <Heading level={3}>Sous-section</Heading>
      <Heading level={4}>Sous-sous-section</Heading>
      <Heading level={5}>Sous-sous-sous-section</Heading>
      <Heading level={6}>Sous-sous-sous-sous-section</Heading>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Disons que vous voulez que tous les titres au sein de la même `Section` aient le même niveau :

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Titre</Heading>
      <Section>
        <Heading level={2}>Section</Heading>
        <Heading level={2}>Section</Heading>
        <Heading level={2}>Section</Heading>
        <Section>
          <Heading level={3}>Sous-section</Heading>
          <Heading level={3}>Sous-section</Heading>
          <Heading level={3}>Sous-section</Heading>
          <Section>
            <Heading level={4}>Sous-sous-section</Heading>
            <Heading level={4}>Sous-sous-section</Heading>
            <Heading level={4}>Sous-sous-section</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Pour le moment, vous passez la prop `level` individuellement à chaque `<Heading>` :

```js
<Section>
  <Heading level={3}>À propos</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Vidéos</Heading>
</Section>
```

Il serait intéressant de pouvoir passer la prop `level` au composant `<Section>` et de la supprimer de `<Heading>`. Ainsi, vous pourriez garantir que tous les titres d'une section ont le même niveau :

```js
<Section level={3}>
  <Heading>À propos</Heading>
  <Heading>Photos</Heading>
  <Heading>Vidéos</Heading>
</Section>
```

Mais comment le composant `<Heading>` peut-il connaître le niveau de sa `<Section>` la plus proche ? **Il faudrait pour ça qu'un enfant puisse « demander » une donnée à un niveau supérieur de l'arbre.**

Ce n'est pas possible uniquement avec les props. C'est ici que le contexte entre en jeu. Vous allez faire ça en trois étapes :

1. **Créez** un contexte (vous pouvez l'appeler `LevelContext`, puisque c'est le niveau des en-têtes).
2. **Utilisez** ce contexte au niveau du composant qui a besoin de la donnée (`Heading` utilisera `LevelContext`).
3. **Fournissez** ce contexte depuis le composant qui spécifie la donnée (`Section` fournira `LevelContext`).

Les contextes permettent à un parent — aussi distant soit-il — de fournir des données à l'ensemble de l'arbre en dessous de lui.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="Un diagramme avec un arbre à trois composants. Le parent contient une bulle représentant une valeur surlignée en orange qui est projetée jusqu'aux deux enfants, tous deux surlignées en orange." >

Utiliser le contexte avec des enfants proches

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="Un diagramme avec un arbres à dix nœeuds, chacun ayant deux enfants ou moins. Le nœud parent à la racine contient une bulle qui représente une valeur surlignée en orange. La valeur est projetée directement vers quatre nœuds feuilles et un composant intermédiaire de l'arbre, qui sont tous surlignés en orange. Aucun des autres composants intermédiaires n'est surligné.">

Utiliser le contexte avec de lointains descendants

</Diagram>

</DiagramGroup>

### Étape 1 : créer le contexte {/*step-1-create-the-context*/}

Tout d'abord, il vous faut créer le contexte. Vous devrez **l'exporter depuis un fichier** pour que vos composants puissent l'utiliser :

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Titre</Heading>
      <Section>
        <Heading level={2}>Section</Heading>
        <Heading level={2}>Section</Heading>
        <Heading level={2}>Section</Heading>
        <Section>
          <Heading level={3}>Sous-section</Heading>
          <Heading level={3}>Sous-section</Heading>
          <Heading level={3}>Sous-section</Heading>
          <Section>
            <Heading level={4}>Sous-sous-section</Heading>
            <Heading level={4}>Sous-sous-section</Heading>
            <Heading level={4}>Sous-sous-section</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Le seul argument à `createContext` est la valeur _par défaut_. Ici, `1` fait référence au niveau d'en-tête le plus élevé, mais vous pouvez passer n'importe quel type de valeur (y compris un objet). Vous verrez l'importance des valeurs par défaut dans la prochaine étape.

### Étape 2 : utiliser le contexte {/*step-2-use-the-context*/}

Importez le Hook `useContext` depuis React, ainsi que votre contexte :

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

Pour le moment, le composant `Heading` lit `level` depuis les props :

```js
export default function Heading({ level, children }) {
  // ...
}
```

Supprimez la prop `level`, et lisez plutôt la valeur depuis le contexte `LevelContext` que vous venez d'importer :

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` est un Hook. Tout comme `useState` et `useReducer`, vous ne pouvez appeler un Hook qu'au niveau racine d'un composant React (et non pas dans des boucles ou des conditions). **`useContext` indique à React que le composant `Heading` souhaite lire le `LevelContext`.**

Maintenant que votre composant `Heading` n'a plus besoin de la prop `level`, vous n'avez plus besoin de la passer à `Heading` dans votre JSX :

```js
<Section>
  <Heading level={4}>Sous-sous-section</Heading>
  <Heading level={4}>Sous-sous-section</Heading>
  <Heading level={4}>Sous-sous-section</Heading>
</Section>
```

Mettez à jour le JSX afin que `Section` la reçoive désormais :

```jsx
<Section level={4}>
  <Heading>Sous-sous-section</Heading>
  <Heading>Sous-sous-section</Heading>
  <Heading>Sous-sous-section</Heading>
</Section>
```

Pour rappel, voici le code que vous essayez de faire marcher :

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Titre</Heading>
      <Section level={2}>
        <Heading>Section</Heading>
        <Heading>Section</Heading>
        <Heading>Section</Heading>
        <Section level={3}>
          <Heading>Sous-section</Heading>
          <Heading>Sous-section</Heading>
          <Heading>Sous-section</Heading>
          <Section level={4}>
            <Heading>Sous-sous-section</Heading>
            <Heading>Sous-sous-section</Heading>
            <Heading>Sous-sous-section</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Remarquez que cet exemple ne fonctionne pas encore tout à fait. Tous les en-têtes ont le même niveau parce que **même si vous *utilisez* le contexte, vous ne l'avez pas encore *fourni***. React ne sait pas où l'obtenir.

Si vous ne fournissez pas le contexte, React utilisera la valeur par défaut que vous avez spécifiée dans l'étape précédente. Dans cet exemple, vous aviez spécifié `1` comme argument à `createContext`, donc `useContext(LevelContext)` renvoie `1`, transformant tous ces en-têtes en `<h1>`. Corrigeons ce problème en demandant à chaque `Section` de fournir son propre contexte.

### Étape 3 : fournir le contexte {/*step-3-provide-the-context*/}

Le composant `Section` effectue actuellement le rendu de ses enfants comme suit :

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**Enrobez-les avec le fournisseur de contexte** pour qu'ils accèdent à `LevelContext` :

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

React le comprend ainsi : « si un composant à l'intérieur de `<Section>` demande `LevelContext`, alors donne-lui ce `level` ». Le composant utilisera la valeur du `<LevelContext.Provider>` le plus proche dans l'arbre au-dessus de lui.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Titre</Heading>
      <Section level={2}>
        <Heading>Section</Heading>
        <Heading>Section</Heading>
        <Heading>Section</Heading>
        <Section level={3}>
          <Heading>Sous-section</Heading>
          <Heading>Sous-section</Heading>
          <Heading>Sous-section</Heading>
          <Section level={4}>
            <Heading>Sous-sous-section</Heading>
            <Heading>Sous-sous-section</Heading>
            <Heading>Sous-sous-section</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Le résultat est le même qu'avec le code d'origine, mais vous n'avez plus besoin de transmettre la prop `level` à chaque composant `Heading`. Au lieu de ça, il « détermine » son niveau d'en-tête en interrogeant la `Section` la plus proche :

1. Vous passez une prop `level` à la `<Section>`.
2. `Section` enrobe ses enfants dans un `<LevelContext.Provider value={level}>`.
3. `Heading` demande la valeur la plus proche de `LevelContext` avec `useContext(LevelContext)`.

## Utiliser et fournir le contexte depuis le même composant {/*using-and-providing-context-from-the-same-component*/}

À ce stade, vous devez quand même spécifier manuellement le `level` de chaque section :

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

Puisque le contexte vous permet de lire une information à partir d'un composant plus haut, chaque `Section` pourrait lire le `level` de la `Section` supérieure, puis transmettre automatiquement `level + 1` en dessous d'elle. Voici comment faire :

```js src/Section.js {5,8}
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

Avec ce changement, vous n'avez plus besoin de passer la prop `level` *ni* à `<Section>` *ni* à `<Heading>`:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Titre</Heading>
      <Section>
        <Heading>Section</Heading>
        <Heading>Section</Heading>
        <Heading>Section</Heading>
        <Section>
          <Heading>Sous-section</Heading>
          <Heading>Sous-section</Heading>
          <Heading>Sous-section</Heading>
          <Section>
            <Heading>Sous-sous-section</Heading>
            <Heading>Sous-sous-section</Heading>
            <Heading>Sous-sous-section</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Désormais, `Heading` et `Section` lisent le `LevelContext` pour déterminer à quelle « profondeur » ils se trouvent. `Section` enrobe ses enfants dans un `LevelContext` pour spécifier que tout son contenu se situe à un niveau « plus profond ».

<Note>

Cet exemple utilise des niveaux d'en-têtes parce qu'ils montrent visuellement comment des composants imbriqués peuvent surcharger le contexte. Mais le contexte est tout aussi utile dans bien d'autres cas. Vous pouvez transmettre n'importe quelle information nécessaire à tout le sous-arbre : le thème de couleurs actif, l'utilisateur connecté, et ainsi de suite.

</Note>

## Le contexte traverse les composants intermédiaires {/*context-passes-through-intermediate-components*/}

Vous pouvez insérer autant de composants que vous le souhaitez entre le composant qui fournit le contexte et celui qui l'utilise. Ça inclut aussi bien les composants natifs comme `<div>` que ceux que vous pourriez créer vous-même.

Dans cet exemple, le même composant `Post` (avec une bordure en pointillés) est rendu à deux niveaux d'imbrication différents. Remarquez que le `<Heading>` à l'intérieur obtient automatiquement son niveau depuis la `<Section>` la plus proche :

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>Mon profil</Heading>
      <Post
        title="Bonjour voyageur !"
        body="Lisez mes aventures."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Billets</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Billets récents</Heading>
      <Post
        title="Les saveurs de Lisbonne"
        body="...et ses pastéis de nata !"
      />
      <Post
        title="Buenos Aires au rythme du tango"
        body="J'ai adoré !"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

Vous n'avez rien eu à faire pour que ça marche. Une `Section` spécifie le contexte pour l'arbre qu'elle contient, vous pouvez donc y insérer un `<Heading>` n'importe où et il aura le niveau correct. Essayez donc dans le bac à sable ci-dessus.

**Le contexte vous permet d'écrire des composants qui « s'adaptent à leur environnement » et s'affichent différemment en fonction de _l'endroit_ (autrement dit _dans quel contexte_) ils sont rendus.**

La façon dont les contextes fonctionnent peut vous rappeler [l'héritage des valeurs de propriétés en CSS](https://developer.mozilla.org/fr/docs/Web/CSS/inheritance). En CSS, vous pouvez spécifier `color: blue` pour un `<div>` et n'importe quel nœud du DOM qu'il contient, aussi profond soit-il, héritera de cette couleur, à moins qu'un nœud intermédiaire ne surcharge ça avec `color: green`. C'est pareil avec React : la seule façon de surcharger un contexte venant d'en haut est d'enrober les enfants dans un fournisseur de contexte avec une valeur différente.

En CSS, des propriétés distinctes comme `color` et `background-color` ne sont pas remplacées les unes par les autres. Vous pouvez définir la `color` de toutes les `<div>` en rouge sans impacter la `background-color`. De la même façon, **des contextes React distincts ne s'écrasent pas les uns les autres**. Chaque contexte que vous créez avec `createContext()` est complétement isolé des autres et lie les composants qui utilisent et fournissent ce contexte *particulier*. Un composant peut utiliser et fournir différents contextes sans problème.

## Avant d'utiliser un contexte {/*before-you-use-context*/}

Il est souvent très tentant de recourir à des contextes ! Toutefois, il est aussi très facile d'en abuser. **Ce n'est pas parce que vous devez propager des props sur plusieurs niveaux que vous devez mettre ces informations dans un contexte**.

Voici certaines alternatives à considérer avant d'utiliser un contexte :

1. **Commencez par [passer les props](/learn/passing-props-to-a-component).** Si vos composants ne sont pas triviaux, il est courant de passer une douzaine de props à travers une douzaine de composants. Ça peut sembler fastidieux, mais ça permet de savoir clairement quels composants utilisent quelles données ! La personne chargée de la maintenance de votre code sera ravie que vous ayez rendu le flux de données explicite grâce aux props.
2. **Extrayez des composants et [passez-leur du JSX dans les `children`](/learn/passing-props-to-a-component#passing-jsx-as-children).** Si vous passez des données à travers plusieurs couches de composants qui ne les utilisent pas (et ne font que les transmettre plus bas), ça signifie souvent que vous avez oublié d'extraire certains composants en cours de route. Par exemple, vous pouvez passer certaines données en props comme `posts` à des composants visuels qui ne les utilisent pas directement, tel que `<Layout posts={posts} />`. Préférez faire en sorte que `Layout` prenne `children` en tant que prop, puis faites le rendu de `<Layout><Posts posts={posts} /></Layout>`. Ça réduit le nombre de couches entre les composants qui spécifient la donnée et ceux qui l'utilisent.

Si aucune de ces approches ne vous convient, envisagez un contexte.

## Cas d'utilisation des contextes {/*use-cases-for-context*/}

* **Thème :** si votre appli permet à l'utilisateur d'en changer l'apparence (comme le mode sombre), vous pouvez mettre un fournisseur de contexte tout en haut de votre appli et utiliser ce contexte dans les composants qui ont besoin d'ajuster leur aspect.
* **Compte utilisateur :** de nombreux composants peuvent avoir besoin de connaître l'utilisateur actuellement connecté. Le fait de le placer dans le contexte en facilite la lecture depuis n'importe quel endroit de l'arbre. Certaines applis vous permettent d'utiliser plusieurs comptes simultanément (par exemple pour laisser un commentaire avec un utilisateur différent). Dans ce cas, il peut être pratique d'enrober une partie de l'interface utilisateur dans un fournisseur avec un compte utilisateur différent.
* **Routage :** la plupart des solutions de routage utilise un contexte en interne pour conserver la route actuelle. C'est ainsi que chaque lien « sait » s'il est actif ou non. Si vous construisez votre propre routeur, vous serez peut-être tenté·e de faire de même.
* **Gestion d'état :** au fur et à mesure que votre appli grandit, vous pouvez vous retrouver avec de nombreux états proches de la racine de votre appli. De nombreux composants distants pourraient vouloir les changer. Il est courant [d'utiliser un réducteur avec un contexte](/learn/scaling-up-with-reducer-and-context) pour gérer des états complexes et les transmettre à des composants distants sans trop galérer.

Le contexte ne se limite pas aux valeurs statiques. Si vous passez une valeur différente au prochain rendu, React mettra à jour tous les composants descendants qui le lisent ! C'est pourquoi le contexte est souvent utilisé en combinaison avec l'état.

D'une manière générale, si certaines informations sont nécessaires pour des composants distants dans différentes parties de l'arborescence, alors c'est une bonne indication que le contexte vous sera utile.

<Recap>

* Le contexte permet à un composant de fournir certaines informations à l'ensemble de l'arbre situé en dessous de lui.
* Pour transmettre un contexte :
  1. Créez-le et exportez-le avec `export const MyContext = createContext(defaultValue)`.
  2. Passez-le au Hook `useContext(MyContext)` depuis n'importe quel composant enfant pour pouvoir le lire, aussi profondément imbriqué soit-il.
  3. Enrobez les enfants dans un `<MyContext.Provider value={...}>` pour le fournir depuis un parent.
* Le contexte traverse tous les composants intermédiaires.
* Le contexte vous permet d'écrire des composants qui « s'adaptent à leur environnement ».
* Avant d'utiliser un contexte, essayez de passer par les props ou en mettant du JSX dans les `children`.

</Recap>

<Challenges>

#### Remplacer la percolation de props par un contexte {/*replace-prop-drilling-with-context*/}

Dans cet exemple, le fait d'activer la case à cocher change la prop `imageSize` passée à chaque `<PlaceImage>`. L'état de cette case à cocher est conservé dans le composant racine `App`, mais chaque `<PlaceImage>` doit en être informé.

Pour l'instant, `App` transmet `imageSize` à `List`, qui la transmet ensuite à chaque `Place` qui transmettent enfin à `PlaceImage`. Supprimez la prop `imageSize` pour la fournir directement à `PlaceImage` depuis le composant `App`.

Vous pouvez déclarer le contexte dans `Context.js`.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Utiliser de grandes images
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js

```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap à Cape Town, Afrique du Sud',
  description: 'La tradition de choisir des couleurs vives pour les maisons remonte à la fin du XXe siècle.',
  imageId: 'K9HVAGH'
}, {
  id: 1,
  name: 'Rainbow Village à Taichung, Taiwan',
  description: "Pour sauver les maisons de la démolition, Huang Yung-Fu, un résident de la région, a peint l'ensemble des 1 200 maisons en 1924.",
  imageId: '9EAYZrt'
}, {
  id: 2,
  name: 'Macromural de Pachuca, Mexique',
  description: "L'une des plus grandes fresques murales du monde recouvre les maisons d'un quartier à flanc de colline.",
  imageId: 'DgXHVwu'
}, {
  id: 3,
  name: 'Selarón Staircase à Rio de Janeiro, Brésil',
  description: "Ce monument a été créé par Jorge Selarón, un artiste d'origine chilienne, en guise d’« hommage au people du Brésil ».",
  imageId: 'aeO3rpI'
}, {
  id: 4,
  name: 'Burano, Italie',
  description: 'Les maisons sont peintes selon un système de couleurs spécifique datant du XVIe siècle.',
  imageId: 'kxsph5C'
}, {
  id: 5,
  name: 'Chefchaouen, Maroc',
  description: "Plusieurs théories expliquent pourquoi les maisons sont peintes en bleu, notamment parce que cette couleur repousserait les moustiques ou qu'elle symboliserait le ciel et le paradis.",
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village à Busan, Corée du Sud',
  description: 'En 2009, le village a été converti en carrefour culturel en peignant les maisons et en accueillant des expositions et des installations artistiques.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

<Solution>

Retirez la prop `imageSize` de tous les composants.

Créez et exportez `ImageSizeContext` depuis `Context.js`. Ensuite, enrobez la `List` dans `<ImageSizeContext.Provider value={imageSize}>` pour propager la valeur vers le bas, puis `useContext(ImageSizeContext)` pour la lire dans `PlaceImage` :

<Sandpack>

```js src/App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext.Provider
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Utiliser de grandes images
      </label>
      <hr />
      <List />
    </ImageSizeContext.Provider>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap à Cape Town, Afrique du Sud',
  description: 'La tradition de choisir des couleurs vives pour les maisons remonte à la fin du XXe siècle.',
  imageId: 'K9HVAGH'
}, {
  id: 1,
  name: 'Rainbow Village à Taichung, Taiwan',
  description: "Pour sauver les maisons de la démolition, Huang Yung-Fu, un résident de la région, a peint l'ensemble des 1 200 maisons en 1924.",
  imageId: '9EAYZrt'
}, {
  id: 2,
  name: 'Macromural de Pachuca, Mexique',
  description: "L'une des plus grandes fresques murales du monde recouvre les maisons d'un quartier à flanc de colline.",
  imageId: 'DgXHVwu'
}, {
  id: 3,
  name: 'Selarón Staircase à Rio de Janeiro, Brésil',
  description: "Ce monument a été créé par Jorge Selarón, un artiste d'origine chilienne, en guise d’« hommage au people du Brésil ».",
  imageId: 'aeO3rpI'
}, {
  id: 4,
  name: 'Burano, Italie',
  description: 'Les maisons sont peintes selon un système de couleurs spécifique datant du XVIe siècle.',
  imageId: 'kxsph5C'
}, {
  id: 5,
  name: 'Chefchaouen, Maroc',
  description: "Plusieurs théories expliquent pourquoi les maisons sont peintes en bleu, notamment parce que cette couleur repousserait les moustiques ou qu'elle symboliserait le ciel et le paradis.",
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village à Busan, Corée du Sud',
  description: 'En 2009, le village a été converti en carrefour culturel en peignant les maisons et en accueillant des expositions et des installations artistiques.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

Remarquez comme les composants intermédiaires n'ont plus besoin de transmettre `imageSize`.

</Solution>

</Challenges>
