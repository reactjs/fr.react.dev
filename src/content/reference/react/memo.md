---
title: memo
---

<Intro>

`memo` vous permet d’éviter de recalculer le rendu d'un composant du moment que ses props n’ont pas changé.

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

Enrobez un composant dans `memo` pour obtenir une version *mémoïsée* de ce composant. Cette version mémoïsée de ce composant ne recalculera généralement pas son rendu lorsque le composant parent refera le sien, du moment que les props du composant mémoïsé restent inchangées. Mais React peut tout de même être amené à le recalculer : la mémoïsation est une optimisation de performance, pas une garantie.

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[Voir d’autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `Component` : le composant que vous souhaitez mémoïser. La fonction `memo` ne modifie pas ce composant, elle renvoie plutôt un nouveau composant mémoïsé. Tout composant React valide est accepté, y compris les fonctions et composants [`forwardRef`](/reference/react/forwardRef).

* `arePropsEqual` **optionnelle** : une fonction qui accepte deux arguments : les anciennes props du composant et ses nouvelles props. Elle doit retourner `true` si les anciennes et les nouvelles props sont équivalentes, c’est-à-dire si le composant affichera la même chose et se comportera de la même manière avec les nouvelles props qu’avec les anciennes. Dans le cas contraire, elle doit retourner `false`. En général, vous n’aurez pas à spécifier cette fonction. Par défaut, React comparera chaque prop avec [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Valeur renvoyée {/*returns*/}

`memo` renvoie un nouveau composant React. Il se comporte de la même manière que le composant fourni à `memo`, sauf que React ne recalculera pas nécessairement son rendu lorsque son composant parent refait le sien, à moins que ses props n'aient changé.

---

## Utilisation {/*usage*/}

### Éviter les rendus superflus de composants lorsque les props restent inchangées {/*skipping-re-rendering-when-props-are-unchanged*/}

React fait normalement le rendu d'un composant à chaque fois que son composant parent fait le sien. Avec `memo`, vous pouvez créer un composant dont React ne recalculera pas nécessairement le rendu lorsque son composant parent fera le sien, tant que ses nouvelles props sont équivalentes aux anciennes. Un tel composant est dit *mémoïsé*.

Pour mémoïser un composant, enrobez-le dans la fonction `memo` et utilisez la valeur qu’il renvoie plutôt que votre composant d’origine :

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Bonjour, {name} !</h1>;
});

export default Greeting;
```

Un composant React devrait toujours avoir une [logique de rendu pure](/learn/keeping-components-pure).  Ça signifie qu'il devrait toujours renvoyer le même résultat si ses props, son état et son contexte n'ont pas changé.  En utilisant `memo`, vous dites à React que votre composant obéit à cette exigence, de sorte que React n'a pas besoin d'en refaire le rendu tant que ses props et son état n'ont pas changé.  Même avec `memo`, votre composant refera bien son rendu si son état local, ou un contexte qu'il utilise, change.

Dans cet exemple, voyez comme le composant `Greeting` refait son rendu dès que `name` change (car c'est une de ses props), mais pas quand `address` change (car elle n'est pas passée comme prop à `Greeting`) :

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nom :{' '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Adresse :{' '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Rendu de Greeting à", new Date().toLocaleTimeString());
  return <h3>Bonjour{name && ', '}{name} !</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

**Vous ne devriez recourir à `memo` que pour optimiser les performances.**  Si votre code ne fonctionne pas sans lui, commencez par débusquer la cause racine puis corrigez-la.  Alors seulement envisagez de remettre `memo`.

</Note>

<DeepDive>

#### Devriez-vous mettre des `memo` partout? {/*should-you-add-memo-everywhere*/}

Si votre appli est comme ce site, l'essentiel des interactions ont un impact assez large (genre remplacer une page ou une section entière), de sorte que la mémoïsation est rarement nécessaire. En revanche, si votre appli est plus comme un éditeur de dessin, et que la plupart des interactions sont granulaires (comme déplacer des formes), alors la mémoïsation est susceptible de beaucoup vous aider.

L’optimisation avec `memo` n’est utile que si votre composant refait souvent son rendu avec les mêmes props, alors que sa logique de rendu est coûteuse. Si le rendu de votre composant n'a pas de lenteur perceptible, `memo` est inutile. Gardez à l’esprit que `memo` est parfaitement inutile si les props fournies à votre composant sont *toujours différentes*, par exemple si vous lui passez un objet ou une fonction définis pendant le rendu. C’est pourquoi vous aurez souvent besoin de [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) et [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) conjointement à `memo`.

Le reste du temps, enrober une fonction avec `memo` n’a pas d’intérêt.  Ça ne va pas gêner non plus, aussi certaines équipes décident de ne pas réfléchir au cas par cas, et mémoïsent autant que possible.  L’inconvénient, c’est que ça nuit à la lisibilité du code.  Par ailleurs, toutes les mémoïsations ne sont pas efficaces.  Il suffit d’une seule valeur « toujours différente » pour complètement casser la mémoïsation de tout un composant.

**En pratique, vous pouvez rendre beaucoup de mémoïsations superflues rien qu'en respectant les principes suivants :**

1. Lorsqu’un composant en enrobe d’autres visuellement, permettez-lui [d’accepter du JSX comme enfant](/learn/passing-props-to-a-component#passing-jsx-as-children). Ainsi, si le composant d’enrobage met à jour son propre état, React saura que ses enfants n’ont pas besoin de refaire leur rendu.
2. Préférez l’état local et ne faites pas [remonter l’état](/learn/sharing-state-between-components) plus haut que nécessaire. Ne conservez pas les éléments d’état transients (tels que les champs de formulaire ou l'état de survol d'un élément) à la racine de votre arbre ou dans une bibliothèque de gestion d’état global.
3.Assurez-vous d’avoir une [logique de rendu pure](/learn/keeping-components-pure). Si refaire le rendu d’un composant entraîne des problèmes ou produit un artefact visuel perceptible, c’est un bug dans votre composant ! Corrigez le bug plutôt que de tenter de le cacher avec une mémoïsation.
4. Évitez [les Effets superflus qui mettent à jour l’état](/learn/you-might-not-need-an-effect). La plupart des problèmes de performance des applis React viennent de chaînes de mise à jour issues d’Effets, qui entraînent de multiples rendus consécutifs de vos composants.
5. Essayez [d’alléger les dépendances de vos Effets](/learn/removing-effect-dependencies). Par exemple, plutôt que de mémoïser, il est souvent plus simple de déplacer un objet ou une fonction à l’intérieur de l’Effet, voire carrément hors de votre composant.

Si une interaction spécifique continue à traîner la patte, [utilisez le Profiler des outils de développement React](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) pour découvrir quels composants bénéficieraient le plus d'une mémoïsation, et ajoutez-en au cas par cas.  Ces principes facilitent le débogage et la maintenabilité de vos composants, ils sont donc utiles à suivre dans tous les cas.  À plus long terme, nous faisons de la recherche sur les moyens de [mémoïser automatiquement](https://www.youtube.com/watch?v=lGEMwh32soc) pour résoudre ces questions une bonne fois pour toutes.

</DeepDive>

---

### Mettre à jour un composant mémoïsé avec son état local {/*updating-a-memoized-component-using-state*/}

Même si un composant est mémoïsé, il fera toujours un nouveau rendu lorsque son propre état local change. La mémoïsation ne concerne que les props qui sont fournies au composant par son parent.

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nom :{' '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Adresse :{' '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Rendu de Greeting à', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Bonjour');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Bonjour'}
          onChange={e => onChange('Bonjour')}
        />
        Salut standard
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Bonjour et bienvenue'}
          onChange={e => onChange('Bonjour et bienvenue')}
        />
        Salut enthousiaste
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

Si vous modifiez une variable d’état local avec sa valeur actuelle, React évitera un nouveau rendu de votre composant même sans `memo`. Il se peut que votre fonction composant soit encore appelée une fois de plus, mais le résultat sera ignoré.

---

### Mettre à jour un composant mémoïsé avec son contexte {/*updating-a-memoized-component-using-a-context*/}

Même si un composant est mémoïsé, il fera toujours un nouveau rendu lorsqu'un contexte qu’il utilise change. La mémoïsation ne concerne que les props qui sont fournies au composant par son parent.

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={handleClick}>
        Changement de thème
      </button>
      <Greeting name="Clara" />
    </ThemeContext.Provider>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Rendu de Greeting à", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Bonjour, {name} !</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```

</Sandpack>

Pour que votre composant ne refasse son rendu lorsqu’une _partie_ de certains contextes change, découpez votre composant en deux. Lisez ce dont vous avez besoin dans le contexte depuis le composant extérieur, et passez l'info à un composant enfant mémoïsé sous forme d’une prop.

---

### Réduire les changements de props {/*minimizing-props-changes*/}

Lorsque vous utilisez `memo`, votre composant refera son rendu chaque fois qu’une prop n’est pas *superficiellement égale*  à sa valeur précédente. Ça signifie que React compare chaque prop de votre composant avec sa valeur précédente en utilisant [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Notez que `Object.is(3, 3)` est `true`, mais `Object.is({}, {})` est `false`.


Pour tirer le meilleur parti de `memo`, réduisez le nombre de fois que les props changent. Par exemple, si la prop est un objet, empêchez le composant parent de recréer cet objet à chaque rendu, en ayant par exemple recours à la fonction [`useMemo`](/reference/react/useMemo) :

```js {5-8}
function Page() {
  const [name, setName] = useState('Clara');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

La meilleure façon de réduire les changements de props consiste à s’assurer que le composant accepte le minimum d’informations nécessaires dans ses props. Par exemple, il pourrait accepter des valeurs individuelles plutôt qu'un objet entier :

```js {4,7}
function Page() {
  const [name, setName] = useState('Clara');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

Même les valeurs individuelles peuvent parfois être projetées vers des valeurs qui changent moins fréquemment. Par exemple, ici, un composant accepte un booléen indiquant la présence d’une valeur plutôt que la valeur elle-même :

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

Lorsque vous devez fournir une fonction à un composant mémoïsé, vous pouvez soit la déclarer en-dehors de votre composant pour qu’elle ne change jamais, soit recourir à [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) pour mettre en cache sa définition d'un rendu à l'autre.

---

### Spécifier une fonction de comparaison personnalisée {/*specifying-a-custom-comparison-function*/}

Dans de rares cas, il peut être impossible de réduire les changements de props d’un composant mémoïsé. Vous pouvez alors fournir une fonction de comparaison personnalisée, que React utilisera pour comparer les anciennes et nouvelles props plutôt que d’utiliser une égalité superficielle. Cette fonction est passée comme second argument à `memo`. Elle doit retourner `true` seulement si les nouvelles props produiront le même résultat que les anciennes props ; dans le cas contraire, elle doit retourner `false`.

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

Si vous optez pour cette approche, utilisez le panneau Performances des outils de développement de votre navigateur pour vous assurer que votre fonction de comparaison est réellement plus rapide qu'un nouveau rendu du composant. Vous pourriez être surpris·e.

Lorsque vous effectuez des mesures de performance, assurez-vous que React fonctionne en mode production.

<Pitfall>

Si vous fournissez une implémentation personnalisée de `arePropsEqual`, **vous devez comparer chaque prop, y compris les fonctions**. Les fonctions exploitent souvent une [fermeture lexicale](https://developer.mozilla.org/fr/docs/Web/JavaScript/Closures) sur les props et états des composants parents. Si vous renvoyez `true` lorsque `oldProps.onClick !== newProps.onClick`, votre composant continuera à « voir » les props et états locaux d’un rendu précédent à l’intérieur de son gestionnaire `onClick`, ce qui conduit à des bugs très déroutants.

Évitez de faire des comparaisons profondes dans `arePropsEqual` à moins que vous ne soyez 100% sûr·e que la structure de données avec laquelle vous travaillez a une profondeur maximale connue. **Les comparaisons profondes peuvent devenir incroyablement lentes** et peuvent bloquer votre appli pendant plusieurs secondes si quelqu’un change la structure de données ultérieurement.

</Pitfall>

---

## Dépannage {/*troubleshooting*/}
### Mon composant refait son rendu lorsqu’une prop est un objet, un tableau ou une fonction {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React compare les anciennes et les nouvelles props par égalité superficielle, c’est-à-dire qu’il fait une comparaison par référence des valeurs ancienne et nouvelle pour chaque prop. Si vous créez un nouvel objet ou un nouveau tableau à chaque fois que le composant parent fait son rendu, même si les éléments individuels sont tous identiques, React considérera que la prop est modifiée. De même, si vous créez une nouvelle fonction lors du rendu du composant parent, React considérera qu’elle a changé même si le corps de la fonction est identique. Pour éviter ça, [simplifiez les props ou mémoïsez-les dans le composant parent](#minimizing-props-changes).
