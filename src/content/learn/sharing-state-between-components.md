---
title: Partager l’état entre des composants
---

<Intro>

Vous souhaitez parfois que les états de deux composants changent toujours ensemble. Pour ça, retirez leurs états et fusionnez-les dans leur plus proche parent commun, puis passez-leur ces données *via* les props. C'est ce qu'on appelle *faire remonter l'état*, et c'est l'une des choses les plus communes que vous ferez en écrivant du code React.

</Intro>

<YouWillLearn>

- Comment partager l'état entre composants en le faisant remonter
- Ce que sont les composants contrôlés et non contrôlés

</YouWillLearn>

## Faire remonter l'état par l'exemple {/*lifting-state-up-by-example*/}

Dans cet exemple, un composant parent `Accordion` affiche deux `Panel` distincts :

* `Accordion`
  - `Panel`
  - `Panel`

Chaque composant `Panel` a une variable d'état booléenne `isActive` qui définit si le contenu du panneau est visible ou non.

Appuyez sur le bouton Afficher pour les deux panneaux :

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Afficher
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="À propos">
        Avec une population d'environ 2 millions d'habitants, Almaty est la plus grande ville du Kazakhstan. Elle en était la capitale 1929 à 1997.
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Étymologie">
        Le nom vient de <span lang="kk-KZ">алма</span>, le mot kazakh pour « pomme » ; il est souvent traduit par « pleine de pommes ». En fait, la région entourant Almaty est considérée comme le berceau ancestral de la pomme, et la <i lang="la">Malus sieversii</i> sauvage est considérée comme une probable candidate pour être l'ancêtre de la pomme domestique moderne.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Constatez que le fait d'appuyer sur le bouton d'un des panneaux n'affecte pas l'affichage de l'autre panneau : ils sont indépendants.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Un diagramme montrant un arbre de trois composants, avec un parent appelé Accordion et deux enfants appelés Panel. Les deux composants Panel contiennent une valeur isActive valant false.">

Initialement, l'état `isActive` de chaque `Panel` vaut `false`, ils apparaissent donc repliés.

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="Le même diagramme que le précédent, avec le isActive du premier enfant Panel surligné indiquant un clic, et dont la valeur est à true. Le second composant Panel contient toujours une valeur à false." >

Le fait de cliquer sur le bouton d'un `Panel` ne met à jour que l'état `isActive` de ce `Panel`.

</Diagram>

</DiagramGroup>

**Supposons maintenant que vous souhaitiez le modifier afin qu'un seul panneau soit déplié à la fois.** Avec cette conception, étendre le second panneau devrait replier le premier. Comment feriez-vous ça ?

Afin de coordonner ces deux panneaux, vous devez « faire remonter leur état » jusqu'à un composant parent en trois étapes :

1. **Retirez** les états des composants enfants.
2. **Passez** des valeurs codées en dur depuis le parent commun.
3. **Ajoutez** l'état au parent commun et passez-le aux enfants avec les gestionnaires d'événements.

Ça permettra au composant `Accordion` de coordonner les deux `Panel` et ainsi n'en déplier qu'un seul à la fois.

### Étape 1 : retirez l'état des composants enfants {/*step-1-remove-state-from-the-child-components*/}

Vous donnerez le contrôle du `isActive` des `Panel` au composant parent. Ça signifie que le composant parent passera `isActive` aux `Panel` *via* les props. Commencez par **supprimer cette ligne** du composant `Panel` :

```js
const [isActive, setIsActive] = useState(false);
```

À la place, ajoutez `isActive` à la liste des props de `Panel` :

```js
function Panel({ title, children, isActive }) {
```

Désormais, le composant parent du `Panel` peut *contrôler* `isActive` en [le passant en tant que prop](/learn/passing-props-to-a-component). À l'inverse, le composant `Panel` *n'a plus le contrôle* sur la valeur de `isActive` — elle est désormais entre les mains du composant parent !

### Étape 2 : passez la valeur codée en dur depuis le parent commun {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

Pour faire remonter l'état, vous devez identifier le parent commun le plus proche des *deux* composants enfants que vous souhaitez coordonner :

* `Accordion` *(parent commun le plus proche)*
  - `Panel`
  - `Panel`

Dans cet exemple, il s'agit du composant `Accordion`. Puisqu'il se situe au-dessus des deux panneaux et qu'il peut contrôler leurs props, il devient la « source de vérité » pour savoir quel panneau est actuellement actif. Faites en sorte que le composant `Accordion` passe la valeur codée en dur de `isActive` (par exemple `true`) aux deux panneaux :

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="À propos" isActive={true}>
        Avec une population d'environ 2 millions d'habitants, Almaty est la plus grande ville du Kazakhstan. De 1929 à 1997, elle en a été la capitale.
      </Panel>
      <Panel title="Étymologie" isActive={true}>
        Le nom vient de <span lang="kk-KZ">алма</span>, le mot kazakh pour « pomme » ; il est souvent traduit par « pleine de pommes ». En fait, la région entourant Almaty est considérée comme le berceau ancestral de la pomme, et la <i lang="la">Malus sieversii</i> sauvage est considérée comme une probable candidate pour être l'ancêtre de la pomme domestique moderne.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Afficher
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Modifiez les valeurs de `isActive` codées en dur dans le composant `Accordion` et voyez le résultat à l'écran.

### Étape 3 : ajoutez l'état au parent commun {/*step-3-add-state-to-the-common-parent*/}

Faire remonter l'état change souvent la nature de ce que vous y stockez.

Dans cet exemple, un seul panneau doit être actif à un instant donné. Ça signifie que le parent commun `Accordion` doit garder trace de *quel* panneau est actif. Pour la variable d'état, il pourrait utiliser un nombre représentant l'index du `Panel` actif plutôt qu'un `boolean` :

```js
const [activeIndex, setActiveIndex] = useState(0);
```

Quand `activeIndex` vaut `0`, le premier panneau est actif, et quand il vaut `1`, alors c'est le second.

Le fait d'appuyer sur le bouton « Afficher » dans l'un ou l'autre des `Panel` doit modifier l'index actif dans `Accordion`. Un `Panel` ne peut définir l'état `activeIndex` directement puisqu'il est défini à l'intérieur d'`Accordion`. Ce dernier doit *explicitement autoriser* le composant `Panel` à changer son état en [lui transmettant un gestionnaire d'événement en tant que prop](/learn/responding-to-events#passing-event-handlers-as-props) :

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

Le `<button>` à l'intérieur du `Panel` va maintenant utiliser la prop `onShow` comme gestionnaire d'événement pour le clic :

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="À propos"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Avec une population d'environ 2 millions d'habitants, Almaty est la plus grande ville du Kazakhstan. De 1929 à 1997, elle en a été la capitale.
      </Panel>
      <Panel
        title="Étymologie"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        Le nom vient de <span lang="kk-KZ">алма</span>, le mot kazakh pour « pomme » ; il est souvent traduit par « pleine de pommes ». En fait, la région entourant Almaty est considérée comme le berceau ancestral de la pomme, et la <i lang="la">Malus sieversii</i> sauvage est considérée comme une probable candidate pour être l'ancêtre de la pomme domestique moderne.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Afficher
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Ainsi s'achève la partie pour faire remonter l'état ! Déplacer l'état dans le composant parent commun vous permet de coordonner les deux panneaux. L'utilisation d'un index actif à la place de deux indicateurs « est affiché » garantit qu'un seul panneau est actif à la fois. Enfin, passer le gestionnaire d'événement à l'enfant permet à ce dernier de changer l'état du parent.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Un diagramme montrant un arbre de trois composants, un parent appelé Accordion et deux enfants appelés Panel. Accordion contient une valeur activeIndex à 0 qui se transforme en une valeur isActive à true passée au premier Panel et une autre à false passée au second Panel." >

Au départ, la valeur du `activeIndex` de l'`Accordion` vaut `0`, le premier `Panel` reçoit donc `isActive = true`.

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="Le même diagramme que le précédent, avec la valeur de activeIndex du parent Accordion en surbrillance, indiquant un clic et dont la valeur a été changée en 1. Le flux en direction des deux composants enfants Panel est également en surbrillance, la valeur isActive passée à chacun des enfants étant définie par opposition : false pour le premier Panel et true pour le second." >

Quant l'état `activeIndex` de l'`Accordion` change à `1`, le second `Panel` reçoit désormais `isActive = true`.

</Diagram>

</DiagramGroup>

<DeepDive>

#### Composants contrôlés et non contrôlés {/*controlled-and-uncontrolled-components*/}

Il est courant d'appeler « non contrôlé » un composant ayant un état local. Par exemple, le composant `Panel` d'origine avec une variable d'état `isActive` est non contrôlé parce que son parent ne peut pas influencer le fait que le panneau soit actif ou non.

À l'inverse, vous pouvez dire qu'un composant est « contrôlé » quand les informations importantes qu'il contient sont pilotées par les props plutôt que par son propre état local. Ça permet au parent de spécifier entièrement son comportement. Le composant final `Panel` avec la prop `isActive` est contrôlé par le composant `Accordion`.

Les composants non contrôlés sont plus simples d'utilisation au sein de leurs parents puisqu'ils nécessitent moins de configuration. Cependant, ils sont moins flexibles lorsque vous souhaitez les coordonner . Les composants contrôlés sont extrêmement flexibles, mais leurs composants parents doivent les configurer complètement avec des props.

Dans la pratique, « contrôlé » et « non contrôlé » ne sont pas des termes techniques stricts — chaque composant dispose généralement d'un mélange entre état local et props. Ça reste une façon pratique de décrire comment les composants sont conçus et les capacités qu'ils offrent.

En écrivant un composant, déterminez quelles informations doivent être contrôlées (*via* les props) ou non contrôlées (*via* l'état). De toutes façons, vous pouvez toujours changer d'avis par la suite et remanier le composant.

</DeepDive>

## Une source de vérité unique pour chaque état {/*a-single-source-of-truth-for-each-state*/}

Dans une application React, de nombreux composants auront leur propre état. Ces derniers peuvent « vivre » à proximité des composants feuilles (les composants en bas de l'arbre) tels que les champs de saisie. D'autres peuvent « vivre » plus proches de la racine de l'appli. Ainsi, même les bibliothèques de routage côté client sont généralement implémentées en stockant la route actuelle dans un état React, puis en la transmettant au travers des props !

**Pour chaque élément unique de l'état, vous devrez choisir le composant auquel il va « appartenir ».** Ce principe est également connu comme une [« source de vérité unique »](https://en.wikipedia.org/wiki/Single_source_of_truth) *(lien en anglais, NdT)*. Ça ne signifie pas que tout l'état se situe à un seul endroit mais plutôt que pour _chaque_ élément d'état, il y a un composant _spécifique_ qui détient cet élément. Au lieu de dupliquer un état partagé entre des composants, il faut le *faire remonter* jusqu'à leur parent commun, puis le *passer vers le bas* aux composants qui en ont besoin.

Votre appli évoluera au fur et à mesure que vous y travaillerez. Il est fréquent que vous déplaciez un état vers le bas ou vers le haut alors que vous êtes en train de déterminer où chaque élément de l'état doit « vivre ». Ça fait partie du processus !

Pour voir ce que ça donne en pratique avec quelques composants supplémentaires, lisez [Penser en React](/learn/thinking-in-react).

<Recap>

* Lorsque vous souhaitez coordonner deux composants, déplacez leur état vers leur parent commun.
* Ensuite, passez l'information vers le bas *via* les props provenant de leur parent commun.
* Enfin, transmettez des gestionnaires d'événements afin que les enfants puissent changer l'état du parent.
* Il est utile de considérer les composants comme étant « contrôlés » (pilotés par les props) ou « non contrôlés » (pilotés par l'état).

</Recap>

<Challenges>

#### Saisies synchronisées {/*synced-inputs*/}

Ces deux champs de saisie sont indépendants. Faites en sorte qu'ils soient synchronisés : modifier l'un des champs doit également mettre à jour l'autre champ avec le même texte, et vice-versa.

<Hint>

Vous aurez besoin de faire remonter l'état au composant parent.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="Premier champ" />
      <Input label="Deuxième champ" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

Déplacez la variable d'état `text` dans le parent commun ainsi que le gestionnaire `handleChange`. Ensuite, passez-les vers le bas aux deux composants `Input`. Ils resteront ainsi synchronisés.

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="Premier champ"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Deuxième champ"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### Filtrer une liste {/*filtering-a-list*/}

Dans cet exemple, la `SearchBar` dispose de son propre état `query` qui contrôle le champ de saisie. Son composant parent `FilterableList` affiche une `List` d'éléments, mais ne tient pas compte de la recherche.

Utilisez la fonction `filterItems(foods, query)` pour filtrer la liste selon la requête de recherche. Pour tester vos modifications, vérifiez que le fait de taper « s » dans le champ de filtre réduit la liste aux éléments « Sushi », « Shish kebab » et « Dim sum ».

Remarquez que `filterItems` est déjà implémentée et importée afin que vous n'ayez pas à l'écrire vous-même !

<Hint>

Vous devrez retirer l'état `query` et le gestionnaire `handleChange` de la `SearchBar` puis les déplacer dans `FilterableList`. Transmettez-les ensuite à `SearchBar` en tant que props `query` et `onChange`.

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Recherche :{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Le sushi est un plat traditionnel japonais préparé à base de riz vinaigré.'
}, {
  id: 1,
  name: 'Dal',
  description: "Le dal est généralement préparé sous forme d'une soupe à laquelle on peut ajouter des oignons, des tomates et diverses épices."
}, {
  id: 2,
  name: 'Pierogi',
  description: "Les pierogi sont des boulettes fourrées fabriquées en enroulant une pâte non levée autour d'une farce salée ou sucrée et en la faisant cuire dans de l'eau bouillante."
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Le shish kebab est un plat populaire composé de cubes de viande embrochés et grillés.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Le dim sum est un large éventail de petits plats que les Cantonais dégustent traditionnellement dans les restaurants pour le petit-déjeuner et le déjeuner.'
}];
```

</Sandpack>

<Solution>

Il faut faire remonter l'état `query` dans le composant `FilterableList`. Il faut ensuite appeler `filterItems(foods, query)` pour obtenir la liste filtrée et la passer à la `List`. Les modifications du champ de requête se reflètent désormais dans la liste :

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Recherche :{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Le sushi est un plat traditionnel japonais préparé à base de riz vinaigré.'
}, {
  id: 1,
  name: 'Dal',
  description: "Le dal est généralement préparé sous forme d'une soupe à laquelle on peut ajouter des oignons, des tomates et diverses épices."
}, {
  id: 2,
  name: 'Pierogi',
  description: "Les pierogi sont des boulettes fourrées fabriquées en enroulant une pâte non levée autour d'une farce salée ou sucrée et en la faisant cuire dans de l'eau bouillante."
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Le shish kebab est un plat populaire composé de cubes de viande embrochés et grillés.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Le dim sum est un large éventail de petits plats que les Cantonais dégustent traditionnellement dans les restaurants pour le petit-déjeuner et le déjeuner.'
}];
```

</Sandpack>

</Solution>

</Challenges>
