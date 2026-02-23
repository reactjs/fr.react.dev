---
title: useMemo
---

<Intro>

`useMemo` est un Hook React qui vous permet de mettre en cache le résultat d'un calcul d'un rendu à l'autre.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) automatically memoizes values and functions, reducing the need for manual `useMemo` calls. You can use the compiler to handle memoization automatically.

</Note>

<InlineToc />

---

## Référence {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

Appelez `useMemo` à la racine de votre composant pour mettre en cache un calcul d'un rendu à l'autre :

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `calculateValue` : la fonction qui calcule la valeur que vous souhaitez mettre en cache. Elle doit être pure, ne prendre aucun argument, et peut renvoyer n'importe quel type de valeur. React appellera votre fonction lors du rendu initial. Lors des rendus suivants, React vous renverra cette même valeur tant que les `dependencies` n'auront pas changé depuis le rendu précédent. Dans le cas contraire, il appellera `calculateValue`, renverra sa valeur, et la stockera pour la réutiliser par la suite.

* `dependencies` : la liste des valeurs réactives référencées par le code de `calculateValue`.  Les valeurs réactives comprennent les props, les variables d'état et toutes les variables et fonctions déclarées localement dans le corps de votre composant.  Si votre *linter* est [configuré pour React](/learn/editor-setup#linting), il vérifiera que chaque valeur réactive concernée est bien spécifiée comme dépendance.  La liste des dépendances doit avoir un nombre constant d'éléments et utiliser un littéral défini à la volée, du genre `[dep1, dep2, dep3]`. React comparera chaque dépendance à sa valeur précédente au moyen de la comparaison [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Valeur renvoyée {/*returns*/}

Lors du rendu initial, `useMemo` renvoie le résultat d'un appel sans arguments à `calculateValue`.

Lors des rendus ultérieurs, soit il vous renverra la valeur résultat mise en cache jusqu'ici (si les dépendances n'ont pas changé), soit il rappellera `calculateValue` et vous renverra la valeur ainsi obtenue.

#### Limitations {/*caveats*/}

* `useMemo` est un Hook, vous pouvez donc uniquement l’appeler **à la racine de votre composant** ou de vos propres Hooks. Vous ne pouvez pas l’appeler à l’intérieur de boucles ou de conditions. Si nécessaire, extrayez un nouveau composant et déplacez l'Effet dans celui-ci.

* React **ne libèrera pas la valeur mise en cache s'il n'a pas une raison bien précise de le faire**.  Par exemple, en développement, React vide le cache dès que vous modifiez le fichier de votre composant.  Et tant en développement qu'en production, React vide le cache si votre composant suspend lors du montage initial.  À l'avenir, React est susceptible d'ajouter de nouvelles fonctionnalités qui tireront parti du vidage de cache — si par exemple React prenait un jour nativement en charge la virtualisation des listes, il serait logique qu'il retire du cache les éléments défilant hors de la zone visible de la liste virtualisée.  Ça devrait correspondre à vos attentes si vous concevez `useMemo` comme une optimisation de performance.  Dans le cas contraire, vous voudrez sans doute plutôt recourir à une [variable d'état](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) ou à une [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents).


<Note>

La mise en cache des valeurs renvoyées est également appelée [*mémoïsation*](https://fr.wikipedia.org/wiki/M%C3%A9mo%C3%AFsation), c'est pourquoi ce Hook s'appelle `useMemo`.

</Note>

---

## Utilisation {/*usage*/}

### Sauter des recalculs coûteux {/*skipping-expensive-recalculations*/}

Pour mettre en cache un calcul d'un rendu à l'autre, enrobez son appel avec le Hook `useMemo` à la racine de votre composant :

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Vous devez passer deux arguments à `useMemo` :

1. Une <CodeStep step={1}>fonction de calcul</CodeStep> qui ne prend pas d'argument, comme par exemple `() =>`, et qui renvoie la valeur que vous souhaitez calculer.
2. Une <CodeStep step={2}>liste de dépendances</CodeStep> comprenant chaque valeur issue de votre composant que cette fonction utilise.

Lors du rendu initial, la <CodeStep step={3}>valeur</CodeStep> renvoyée par `useMemo` sera le résultat de l'appel au <CodeStep step={1}>calcul</CodeStep>.

Lors des rendus suivants, React comparera les <CodeStep step={2}>dépendances</CodeStep> avec celles passées lors du rendu précédent. Si aucune dépendance n'a changé (sur base d'une comparaison avec l'algorithme [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useMemo` continuera à utiliser la même valeur déjà calculée. Dans le cas contraire, React refera le calcul et vous renverra la nouvelle valeur.

En d'autres termes, `useMemo` met en cache un calcul de valeur d'un rendu à l'autre jusqu'à ce que ses dépendances changent.

**Déroulons un exemple afin de comprendre en quoi c'est utile.**

Par défaut, React re-exécutera l'intégralite du corps de votre composant à chaque nouveau rendu. Par exemple, si `TodoList` met à jour son état ou reçoit de nouvelles props de son parent, la fonction `filterTodos` sera appelée à nouveau :

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

En temps normal, ça n'est pas un souci car la majorité des calculs sont très rapides. Cependant, si vous filtrez ou transformez un énorme tableau, ou procédez à des calculs coûteux, vous pourriez vouloir éviter de les refaire alors que les données n'ont pas changé. Si tant `todos` que `tab` sont identiques à leurs valeurs du rendu précédent, enrober le calcul avec `useMemo` comme vu plus haut vous permet de réutiliser les `visibleTodos` déjà calculées pour ces données.

Ce type de mise en cache est appelée *[mémoïsation](https://fr.wikipedia.org/wiki/M%C3%A9mo%C3%AFsation)*.

<Note>

**Vous ne devriez recourir à `useMemo` que pour optimiser les performances.**  Si votre code ne fonctionne pas sans lui, commencez par débusquer la cause racine puis corrigez-la.  Alors seulement envisagez de remettre `useMemo`.

</Note>

<DeepDive>

#### Comment savoir si un calcul est coûteux ? {/*how-to-tell-if-a-calculation-is-expensive*/}

En règle générale, à moins que vous ne créiez ou itériez à travers des milliers d’objets, ça n’est probablement pas coûteux.  Si vous avez besoin de vous rassurer, vous pouvez ajouter une mesure en console du temps passé dans ce bout de code :

```js {1,3}
console.time('filtrage tableau');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filtrage tableau');
```

Réalisez l’interaction à mesurer (par exemple, saisissez quelque chose dans un champ).  Vous verrez alors un message en console du genre `filtrage tableau: 0.15ms`.  Si le temps cumulé obtenu devient important (disons `1ms` ou plus), il peut être pertinent de mémoïser le calcul.  À titre d’expérience, vous pouvez enrober le calcul avec `useMemo` pour vérifier si le temps total mesuré s’est réduit ou non pour votre interaction :

```js
console.time('filtrage tableau');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // Sauté si todos et tab n’ont pas changé
}, [todos, tab]);
console.timeEnd('filtrage tableau');
```

`useMemo` n’accélèrera pas le *premier* rendu.  Il aide seulement à sauter un traitement superflu lors des mises à jour.

Gardez à l’esprit que votre machine est probablement plus rapide que celles de vos utilisateurs, il est donc recommandé de tester la performance au sein d’un ralentissement artificiel.  Par exemple, Chrome propose une option de [bridage processeur](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) exprès pour ça.

Remarquez aussi que mesurer la performance en développement ne vous donnera pas des résultats très précis. (Par exemple, quand le [Mode Strict](/reference/react/StrictMode) est actif, chaque composant fait deux rendus au lieu d’un.)  Pour améliorer la pertinence de vos mesures, construisez la version de production de votre appli et testez-la sur des appareils similaires à ceux de vos utilisateurs.

</DeepDive>

<DeepDive>

#### Devriez-vous mettre des `useMemo` partout ? {/*should-you-add-usememo-everywhere*/}

<<<<<<< HEAD
Si votre appli est comme ce site, l'essentiel des interactions ont un impact assez large (genre remplacer une page ou une section entière), de sorte que la mémoïsation est rarement nécessaire.  En revanche, si votre appli est plus comme un éditeur de dessin, et que la plupart des interactions sont granulaires (comme déplacer des formes), alors la mémoïsation est susceptible de beaucoup vous aider.
=======
If your app is like this site, and most interactions are coarse (like replacing a page or an entire section), memoization is usually unnecessary. On the other hand, if your app is more like a drawing editor, and most interactions are granular (like moving shapes), then you might find memoization very helpful.
>>>>>>> a1cc2ab4bf06b530f86a7049923c402baf86aca1

Optimiser avec `useMemo` n'est utile que dans trois grands cas de figure :

- Le calcul que vous enrobez avec `useMemo` est d'une lenteur perceptible, alors même que ses dépendances changent peu.
- Vous passez la valeur à un composant enrobé avec [`memo`](/reference/react/memo).  Vous voulez qu'il puisse éviter de refaire son rendu si la valeur n'a pas changé.  En mémoïsant le calcul, vous limitez ses nouveaux rendus aux cas où les dépendances de celui-ci ont en effet changé.
- La fonction que vous passez est utilisée plus loin comme dépendance par un Hook.  Par exemple, un autre calcul enrobé par `useMemo` en dépend, ou vous en dépendez pour un [`useEffect`](/reference/react/useEffect).

Le reste du temps, enrober un calcul avec `useMemo` n'a pas d'intérêt.  Ça ne va pas gêner non plus, aussi certaines équipes décident de ne pas réfléchir au cas par cas, et mémoïsent autant que possible.  L'inconvénient, c'est que ça nuit à la lisibilité du code.  Par ailleurs, toutes les mémoïsations ne sont pas efficaces.  Il suffit qu'une seule valeur utilisée soit « toujours différente » pour casser la mémoïsation de tout un composant.

Remarquez que `useMemo` n'empêche pas la *création* de la fonction.  Vous créez la fonction à chaque rendu (et tout va bien !) mais React l'ignorera et vous renverra la fonction mise en cache si aucune dépendance n'a changé.

**En pratique, vous pouvez rendre beaucoup de mémoïsations superflues rien qu'en respectant les principes suivants :**

1. Lorsqu'un composant en enrobe d'autres visuellement, permettez-lui [d'accepter du JSX comme enfant](/learn/passing-props-to-a-component#passing-jsx-as-children). Ainsi, si le composant d'enrobage met à jour son propre état, React saura que ses enfants n'ont pas besoin de refaire leur rendu.
2. Préférez l'état local et ne faites pas [remonter l'état](/learn/sharing-state-between-components) plus haut que nécessaire.  Ne conservez pas les éléments d'état transients (tels que les champs de formulaire ou l'état de survol d'un élément) à la racine de votre arbre ou dans une bibliothèque de gestion d'état global.
3. Assurez-vous d'avoir une [logique de rendu pure](/learn/keeping-components-pure).  Si refaire le rendu d'un composant entraîne des problèmes ou produit un artefact visuel perceptible, c'est un bug dans votre composant !  Corrigez le bug plutôt que de tenter de le cacher avec une mémoïsation.
4. Évitez [les Effets superflus qui mettent à jour l'état](/learn/you-might-not-need-an-effect).  La plupart des problèmes de performance des applis React viennent de chaînes de mise à jour issues d'Effets, qui entraînent de multiples rendus consécutifs de vos composants.
5. Essayez [d'alléger les dépendances de vos Effets](/learn/removing-effect-dependencies). Par exemple, plutôt que de mémoïser, il est souvent plus simple de déplacer un objet ou une fonction à l'intérieur de l'Effet voire hors de votre composant.

Si une interaction spécifique continue à traîner la patte, [utilisez le Profiler des outils de développement React](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) pour découvrir quels composants bénéficieraient le plus d'une mémoïsation, et ajoutez-en au cas par cas.  Ces principes facilitent le débogage et la maintenabilité de vos composants, ils sont donc utiles à suivre dans tous les cas.  À plus long terme, nous faisons de la recherche sur les moyens de [mémoïser automatiquement](https://www.youtube.com/watch?v=lGEMwh32soc) pour résoudre ces questions une bonne fois pour toutes.

</DeepDive>

<Recipes titleText="La différence entre useMemo et calculer la valeur directement" titleId="examples-recalculation">

#### Éviter de recalculer avec `useMemo` {/*skipping-recalculation-with-usememo*/}

Dans cet exemple, la fonction `filterTodos` est **artificiellement ralentie** pour que vous puissiez bien voir ce qui se passe lorsqu'une fonction JavaScript que vous appelez est véritablement lente.  Essayez donc de changer d'onglet ou de basculer le thème actif.

Le changement d'onglet semble lent parce qu'il force l'exécution de la fonction `filterTodos` ralentie.  On pouvait s'y attendre, puisque l'onglet a changé, le calcul a donc *besoin* d'être refait. (Si vous vous demandez pourquoi il est exécuté deux fois, on vous l'explique [ici](#my-calculation-runs-twice-on-every-re-render).)

Essayez maintenant de basculer le thème. **Grâce à `useMemo`, c'est rapide en dépit du ralenti artificiel !** L'appel lent à `filterTodos` est évité parce que ni `todos` ni `tab` (les dépendances déclarées pour le `useMemo`) n'ont changé depuis le dernier rendu.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Toutes
      </button>
      <button onClick={() => setTab('active')}>
        Actives
      </button>
      <button onClick={() => setTab('completed')}>
        Terminées
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Mode sombre
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Remarque : <code>filterTodos</code> est artificiellement ralentie !</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Tâche " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIELLEMENT LENT] Filtrage de ' + todos.length + ' tâches pour l’onglet « ' + tab + ' ».');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Ne rien faire pendant 500 ms pour simuler du code extrêmement lent
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Toujours recalculer la valeur {/*always-recalculating-a-value*/}

Dans cet exemple, l'implémentation de `filterTodos` est toujours **artificiellement ralentie** pour que vous puissiez bien voir ce qui se passe lorsqu'une fonction JavaScript que vous appelez est véritablement lente.  Essayez de changer d'onglet ou de basculer le thème.

Contrairement à l'exemple précédent, la bascule du thème est désormais lente, elle aussi ! C'est parce **qu'il n'y a pas d'appel à `useMemo` dans cette version**, de sorte que la fonction `filterTodos` artificiellement ralentie est appelée à chaque rendu, même lorsque `theme` est seul à avoir changé.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Toutes
      </button>
      <button onClick={() => setTab('active')}>
        Actives
      </button>
      <button onClick={() => setTab('completed')}>
        Terminées
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Mode sombre
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Remarque : <code>filterTodos</code> est artificiellement ralentie !</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Tâche " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIELLEMENT LENT] Filtrage de ' + todos.length + ' tâches pour l’onglet « ' + tab + ' ».');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Ne rien faire pendant 500 ms pour simuler du code extrêmement lent
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Ceci dit, voici le même code **sans le ralentissement artificiel**. Est-ce que vous pouvez percevoir l'absence de `useMemo` ?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Toutes
      </button>
      <button onClick={() => setTab('active')}>
        Actives
      </button>
      <button onClick={() => setTab('completed')}>
        Terminées
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Mode sombre
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Tâche " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Bien souvent, du code sans mémoïsation fonctionnera bien. Si vos interactions sont suffisamment rapides, ne vous embêtez pas à mémoïser.

Vous pouvez tenter d'augmenter le nombre de tâches dans `utils.js` et de voir si le comportement change.  Ce calcul spécifique n'était déjà pas bien coûteux à la base, mais si le nombre de tâches devait augmenter significativement, l'essentiel du coût viendrait des nouveaux rendus plutôt que du filtrage.  Continuez à lire pour découvrir comment optimiser les rendus superflus avec `useMemo`.

<Solution />

</Recipes>

---

### Éviter les rendus superflus de composants {/*skipping-re-rendering-of-components*/}

Dans certains cas, `useMemo` peut aussi vous aider à optimiser la performance liée aux nouveaux rendus de composants enfants. Pour illustrer ceci, supposons que vous ayez un composant `TodoList` qui passe une prop `visibleTodos` à son composant enfant `List` :

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

En utilisant l'interface, vous avez remarqué que basculer la prop `theme` gèle l'appli pendant un moment, mais si vous retirez `<List />` de votre JSX, il redevient performant.  Ça vous indique qu'il serait bon de tenter d'optimiser le composant `List`.

**Par défaut, lorsqu'un composant refait son rendu, React refait le rendu de tous ses composants enfants, récursivement.**  C'est pourquoi lorsque `TodoList` refait son rendu avec un `theme` différent, le composant `List` refait *aussi* son rendu.  Ça ne pose aucun problème pour les composants dont le rendu n'est pas trop coûteux.  Mais si vous avez confirmé que son rendu est lent, vous pouvez dire à `List` d'éviter de nouveaux rendus lorsque ses props ne changent pas en l'enrobant avec [`memo`](/reference/react/memo) :

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**Avec cet ajustement, `List` évitera de refaire son rendu si toutes ses propriétés sont *identiques* depuis le dernier rendu.**  Et c'est là que la mise en cache du calcul devient importante !  Imaginons que vous définissiez `visibleTodos` sans `useMemo` :

```js {2-3,6-8}
export default function TodoList({ todos, tab, theme }) {
  // Chaque fois que le `theme` change, ça donnera un nouveau tableau...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... du coup les props de List seront toujours différentes,
          et il refera son rendu à chaque fois. */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**Dans l'exemple ci-dessus, la fonction `filterTodos` crée toujours un tableau _différent_**, de la même façon qu'un littéral objet `{}` crée toujours un nouvel objet. En temps normal ça ne poserait pas problème, mais ici ça signifie que les props de `List` ne seront jamais identiques, de sorte que votre optimisation avec [`memo`](/reference/react/memo) ne servira à rien. C'est là que `useMemo` entre en scène :

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // Dit à React de mettre en cache votre calcul d’un rendu à l’autre...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...du coup tant que ces dépendances ne changent pas...
  );
  return (
    <div className={theme}>
      {/* ...List recevra les mêmes props et ne refera pas son rendu. */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**En enrobant le calcul de `visibleTodos` dans un `useMemo`, vous garantissez qu'il s'agira de la *même* valeur d'un rendu à l'autre** (tant que les dépendances ne changent pas).  Vous n'avez *pas besoin* d'enrober un calcul dans `useMemo` par défaut, sans raison précise.  Dans cet exemple, la raison tient à ce que vous la passez à un composant enrobé par [`memo`](/reference/react/memo), ça lui permet donc d'effectivement éviter des rendus superflus.  Il existe d'autres raisons de recourir à `useMemo`, qui sont détaillées dans la suite de cette page.

<DeepDive>

#### Mémoïser des nœuds JSX spécifiques {/*memoizing-individual-jsx-nodes*/}

Plutôt que d'enrober  `List` dans [`memo`](/reference/react/memo), vous pourriez vouloir enrober le nœud JSX `<List />` lui-même dans un `useMemo` :

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

Le comportement serait identique. Si `visibleTodos` n'a pas changé, `List` ne refera pas son rendu.

Un nœud JSX comme `<List items={visibleTodos} />` est un objet du genre `{ type: List, props: { items: visibleTodos } }`. Créer cet objet a un coût quasiment nul, mais React ne sait pas si son contenu est identique ou non à celui de la dernière fois.  C'est pourquoi, par défaut, React refera le rendu du composant `List`.

En revanche, si React voit exactement le même JSX que lors du précédent rendu, il ne tentera pas de refaire le rendu de votre composant. C'est parce que les nœuds JSX sont [immuables](https://fr.wikipedia.org/wiki/Objet_immuable). Un objet de nœud JSX n'aurait pas pu changer avec le temps, React peut donc supposer sereinement qu'il peut sauter le rendu.  Ceci dit, pour que ça fonctionne, il doit s'agir *exactement du même objet nœud en mémoire*, pas simplement d'un objet de structure identique.  C'est à ça que sert `useMemo` dans cet exemple.

Enrober manuellement des nœuds JSX avec `useMemo` n'est pas très pratique.  Par exemple, on ne peut pas le faire conditionnellement.  C'est pourquoi vous enroberez généralement la définition du composant avec [`memo`](/reference/react/memo) plutôt que d'enrober des nœuds JSX individuels.

</DeepDive>

<Recipes titleText="La différence entre sauter des rendus superflus et toujours refaire le rendu" titleId="examples-rerendering">

#### Éviter les rendus superflus avec `useMemo` et `memo` {/*skipping-re-rendering-with-usememo-and-memo*/}

Dans cet exemple, le composant `List` est **artificiellement ralenti** pour que vous puissiez bien voir ce qui se passe lorsque le rendu d'un composant React est véritablement lent.  Essayez de changer d'onglet ou de basculer le thème.

Le changement d'onglet semble lent parce qu'elle force le `List` ralenti à refaire son rendu.  On pouvait s'y attendre, puisque l'onglet a changé, vous devez donc refléter le nouveau choix de l'utilisateur à l'écran.

Essayez maintenant de basculer le thème. **Grâce à la combinaison de `useMemo` et [`memo`](/reference/react/memo), c'est rapide en dépit du ralenti artificiel !** `List` a évité un nouveau rendu parce que le tableau `visibleTodos` n'a pas changé, dans la mesure où ni `todos` ni `tab` (les dépendances déclarées pour le `useMemo`) n'ont changé depuis le dernier rendu.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Toutes
      </button>
      <button onClick={() => setTab('active')}>
        Actives
      </button>
      <button onClick={() => setTab('completed')}>
        Terminées
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Mode sombre
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Remarque : <code>List</code> est artificiellement ralenti !</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js {expectedErrors: {'react-compiler': [5, 6]}} src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIELLEMENT LENT] Rendu de <List /> avec ' + items.length + ' éléments');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Ne rien faire pendant 500 ms pour simuler du code extrêmement lent
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Tâche " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Toujours refaire le rendu d'un composant {/*always-re-rendering-a-component*/}

Dans cet exemple, l'implémentation de `List` est toujours **artificiellement ralentie** pour que vous puissiez bien voir ce qui se passe lorsque le rendu d'un composant React est véritablement lent.  Essayez de changer d'onglet ou de basculer le thème.

Contrairement à l'exemple précédent, la bascule du thème est désormais lente, elle aussi ! C'est parce **qu'il n'y a pas d'appel à `useMemo` dans cette version**, de sorte que `visibleTodos` est toujours un nouveau tableau, ce qui empêche le composant `List` ralenti de sauter un nouveau rendu.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Toutes
      </button>
      <button onClick={() => setTab('active')}>
        Actives
      </button>
      <button onClick={() => setTab('completed')}>
        Terminées
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Mode sombre
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Remarque : <code>List</code> est artificiellement ralenti !</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js {expectedErrors: {'react-compiler': [5, 6]}} src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIELLEMENT LENT] Rendu de <List /> avec ' + items.length + ' éléments');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Ne rien faire pendant 500 ms pour simuler du code extrêmement lent
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Tâche " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Ceci dit, voici le même code **sans le ralentissement artificiel**. Est-ce que vous pouvez percevoir l'absence de `useMemo` ?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Toutes
      </button>
      <button onClick={() => setTab('active')}>
        Actives
      </button>
      <button onClick={() => setTab('completed')}>
        Terminées
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Mode sombre
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Tâche " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Bien souvent, du code sans mémoïsation fonctionnera bien. Si vos interactions sont suffisamment rapides, ne vous embêtez pas à mémoïser.

Gardez à l'esprit qu'il vous faut exécuter React en mode production, désactiver les [outils de développement React](/learn/react-developer-tools), et utiliser des appareils similaires à ceux de vos utilisateurs finaux pour avoir une perception réaliste de ce qui ralentit effectivement votre appli.

<Solution />

</Recipes>

---

### Empêcher qu’un Effet ne soit déclenché trop souvent {/*preventing-an-effect-from-firing-too-often*/}

Il peut arriver que vous ayez besoin d'utiliser une valeur au sein d'un [Effet](/learn/synchronizing-with-effects) :

```js {4-7,10}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: 'https://localhost:1234',
    roomId: roomId
  }

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Ce genre de cas pose problème. [Chaque valeur réactive doit être déclarée comme dépendance de votre Effet](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency). Seulement voilà, si vous déclarez `options` comme dépendance, votre Effet va passer son temps à se reconnecter au salon de discussion :


```js {5}
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🔴 Souci : cette dépendance change à chaque rendu
  // ...
```

Pour éviter ça, vous pouvez enrober l'objet que vous avez besoin d'utiliser dans l'Effet par un `useMemo` :

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = useMemo(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Ne change que si `roomId` change

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
<<<<<<< HEAD
  }, [options]); // ✅ Ne change que si `options` change
=======
  }, [options]); // ✅ Only changes when options changes
>>>>>>> a1cc2ab4bf06b530f86a7049923c402baf86aca1
  // ...
```

Ça garantit que l'objet `options` restera le même d'un rendu à l'autre puisque `useMemo` renverra l'objet mis en cache.

Ceci étant dit, puisque `useMemo` est une optimisation de performances, pas une garantie sémantique, React est susceptible de jeter la version mise en cache s'il a [une raison précise de le faire](#caveats). Ça entraînera une ré-exécution de votre Effet, **de sorte qu'il serait encore mieux d'éliminer le besoin d'une dépendance vers l'objet**, en créant l'objet *dans* l'Effet :

```js {5-8,13}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = { // ✅ Plus besoin de useMemo ou de dépendances sur objets !
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    }

    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Ne change que si `roomId` change
  // ...
```

À présent votre code est plus simple et n'a plus besoin de `useMemo`. [Apprenez-en davantage sur l'allègement des dépendances d'un Effet](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect).

### Mémoïser une dépendance d'un autre Hook {/*memoizing-a-dependency-of-another-hook*/}

Supposons que vous ayez un calcul qui dépende d'un objet créé directement au sein du composant :

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Attention : dépend d’un objet créé dans le corps du composant
  // ...
```

Dépendre ainsi d'un objet coupe l'herbe sous le pied à la mémoïsation.  Lorsqu'un composant refait son rendu, tout le code directement au sein du corps du composant est exécuté à nouveau. **Les lignes de code qui créent l'objet `searchOptions` sont aussi exécutées pour chaque nouveau rendu.**  Dans la mesure où `searchOptions` est une dépendance dans l'appel à `useMemo`, vu qu'il est différent à chaque fois, les dépendances connues de React seront différentes à chaque fois, et on recalculera `searchItems` à chaque fois.

Pour corriger ça, vous pourriez choisir de mémoïser l'objet `searchOptions` *lui-même* avant de le passer comme dépendance à l'autre Hook :

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ Ne change que si le texte change

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ Ne change que si `allItems` ou `searchOptions` changent
  // ...
```

Dans l'exemple ci-dessus, si le `text` ne change pas, l'objet `searchOptions` ne changera pas non plus.  Ceci dit, il serait encore préférable de déplacer la déclaration de l'objet `searchOptions` *au sein* de la fonction de calcul enrobée par `useMemo` :

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Ne change que si `allItems` ou `text` changent
  // ...
```

À présent votre calcul dépend directement de `text` (qui est une chaîne de caractères et ne peut pas être un objet différent « par inadvertance »).

---

### Mémoïser une fonction {/*memoizing-a-function*/}

Supposons qu'un composant `Form` soit enrobé par [`memo`](/reference/react/memo). Vous souhaitez lui passer une fonction comme prop :

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

Tout comme `{}` crée un nouvel objet à chaque fois, les déclarations et expressions de fonctions comme `function() {}` et `() => {}` produisent une fonction *différente* à chaque rendu. En soi, créer ces fonctions n'est pas un problème.  Vous ne devriez pas chercher à l'éviter à tout prix !  En revanche, si le composant `Form` est mémoïsé, vous souhaitez sans doute éviter ses rendus superflus lorsque les props n'ont pas changé.  Une prop qui est *toujours* différente empêcherait forcément sa mémoïsation.

Pour mémoïser une fonction avec `useMemo`, la fonction de calcul que vous passez ay Hook aurait besoin de renvoyer la fonction à mémoïser :

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

Ce code est pataud ! **Mémoïser des fonctions est un besoin suffisamment courant pour que React propose un Hook dédié pour ça.  Enrobez vos fonctions avec[`useCallback`](/reference/react/useCallback) plutôt que `useMemo`** pour éviter d'avoir à écrire un niveau supplémentaire d'imbrication de fonction :

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

Ces deux exemples sont parfaitement équivalents.  Le seul avantage de `useCallback`, c'est qu'il vous évite de devoir enrober votre fonction dans une autre. Il ne fait rien de plus. [Apprenez-en davantage sur `useCallback`](/reference/react/useCallback).

---

## Dépannage {/*troubleshooting*/}

### Mon calcul est exécuté deux fois par rendu {/*my-calculation-runs-twice-on-every-re-render*/}

En [Mode Strict](/reference/react/StrictMode), React appellera certaines de vos fonctions deux fois plutôt qu'une :

```js {2,5,6}
function TodoList({ todos, tab }) {
  // Cette fonction composant sera appelée deux fois par rendu.

  const visibleTodos = useMemo(() => {
    // Ce calcul sera exécuté deux fois pour tout changement de dépendances.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

C'est intentionnel, et ça ne devrait pas casser votre code.

Ce comportement **spécifique au développement** vous aide à [garder les composants purs](/learn/keeping-components-pure). React utilise le résultat de l'un des appels et ignore l'autre. Tant que votre composant et votre fonction de calcul sont purs, ça ne devrait pas affecter votre logique. Si toutefois ils sont malencontreusement impurs, ça vous permettra de détecter les erreurs.

Par exemple, cette fonction calcul impure modifie directement un tableau reçu comme prop :

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Erreur : modification directe (en place) d'une prop
    todos.push({ id: 'last', text: 'Aller faire un tour !' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

React appelle votre fonction deux fois, afin que vous remarquiez que la tâche est ajoutée deux fois. Votre calcul ne devrait pas modifier des objets existants, mais vous pouvez très bien modifier des *nouveaux* objets créés lors du calcul. Par exemple, si la fonction `filterTodos` renvoie toujours un tableau *différent*, vous pouvez modifier plutôt *ce tableau-là* :

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Correct : modification d'un objet créé lors du calcul
    filtered.push({ id: 'last', text: 'Aller faire un tour !' });
    return filtered;
  }, [todos, tab]);
```

Lisez [Garder les composants purs](/learn/keeping-components-pure) pour en apprendre davantage.

Jetez donc aussi un coup d'œil aux guides pour [mettre à jour les objets](/learn/updating-objects-in-state) et [mettre à jour les tableaux](/learn/updating-arrays-in-state) sans les modifier directement.

---

### Mon appel à `useMemo` call est censé renvoyer un objet, mais il renvoie `undefined` {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

Ce code ne fonctionne pas :

```js {1-2,5}
  // 🔴 La syntaxe `() => {` ne renvoie pas un objet
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

En JavaScript, `() => {` démarre le corps de la fonction fléchée, de sorte que l'accolade ouvrante `{` ne marque pas le début d'un objet. C'est pourquoi ça ne renvoie pas un objet, entraînant des erreurs.  Vous pourriez corriger ça en enrobant les accolades par des parenthèses, avec `({` et `})` :

```js {1-2,5}
  // Fonctionne, mais reste facile à casser par un tiers
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

Ceci dit, ça reste suffisamment déroutant pour que quelqu'un d'autre le casse à nouveau plus tard, en retirant les parenthèses. Pour éviter ça, écrivez une instruction `return` explicite :

```js {1-3,6-7}
  // ✅ Fonctionne et rend l’intention explicite
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### À chaque rendu de mon composant, le calcul dans `useMemo` est exécuté {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

Assurez-vous d'avoir spécifié le tableau de dépendances comme second argument !

Si vous oubliez le tableau de dépendances, `useMemo` exécutera le calcul à chaque fois :

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Recalcule à chaque fois, faute de tableau de dépendances
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

Voici la version corrigée, qui passe bien le tableau de dépendances comme second argument :

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ Ne fait pas de recalcul superflu
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

Si ça n'aide pas, alors le problème vient de ce qu'au moins une de vos dépendances diffère depuis le rendu précédent.  Vous pouvez déboguer ce problème en affichant manuellement vos dépendances dans la console :

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

Vous pouvez alors cliquer bouton droit, dans la console, sur les tableaux issus de différents rendus et sélectionner « Stocker objet en tant que variable globale » pour chacun d'entre eux.  En supposant que vous avez stocké le premier en tant que `temp1` et le second en tant que `temp2`, vous pouvez alors utiliser la console du navigateur pour vérifier si chaque dépendance des tableaux est identique :

```js
Object.is(temp1[0], temp2[0]); // La première dépendance est-elle inchangée ?
Object.is(temp1[1], temp2[1]); // La deuxième dépendance est-elle inchangée ?
Object.is(temp1[2], temp2[2]); // ... et ainsi de suite pour chaque dépendance ...
```

Lorsque vous aurez repéré la dépendance qui casse la mémoïsation, vous pouvez soit tenter de la retirer, soit [la mémoïser aussi](#memoizing-a-dependency-of-another-hook).

---

### Je souhaite appeler `useMemo` pour chaque élément d'une liste dans une boucle, mais c'est interdit {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Imaginez que le composant `Chart` utilisé ci-dessous soit enrobé par [`memo`](/reference/react/memo).  Vous souhaitez éviter des rendus superflus de chaque `Chart` dans la liste lorsque le composant `ReportList` refait son rendu.  Cependant, vous ne pouvez pas appeler `useMemo` au sein de la boucle :

```js {expectedErrors: {'react-compiler': [6]}} {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 Vous n’avez pas le droit d’utiliser `useMemo` dans une boucle comme ceci :
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

Au lieu de ça, extrayez un composant pour chaque élément, et mémoïsez les données individuellement pour chaque élément :

```js {5,12-18}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Appelez `useMemo` au niveau racine :
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

Une autre solution consisterait à retirer `useMemo` de l'exemple précédent, pour plutôt enrober `Report` lui-même avec un [`memo`](/reference/react/memo).  Ainsi, si la prop `item` ne change pas, `Report` évitera de refaire son rendu, de sorte que `Chart` sera épargné lui aussi :

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```
