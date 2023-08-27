---
title: memo
---

<Intro>

`memo` vous permet d’ignorer le réaffichage d’un composant lorsque ces props sont inchangées.

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `memo(Composant, arePropsEqual?)` {/*memo*/}

Enrobez un composant dans `memo` pour obtenir une version *mémoïsée* de ce composant. Cette version mémoïsée de ce composant ne sera généralement pas réaffiché de nouveau lorsque le composant de niveau supérieur fait de nouveau son rendu, jusqu’à ce que ces props restent inchangées. Mais React peut tout de même faire le réaffichage : la mémoïsation est une optimisation de la performance, pas une garantie.

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[Voir d’autres exemples ci-dessous.](#usage)

#### Paramètres {/*parameters*/}

* `Composant`: le composant que vous souhaitez mémoïser. La fonction `memo` ne modifie pas ce composant, au lieu de cela, elle renvoie un nouveau composant mémoïsé. Tout composant React valide, y compris les fonctions et composants [`forwardRef`](/reference/react/forwardRef) sont acceptés.

* **Facultatif** `arePropsEqual`: Une fonction qui accepte deux arguments : les anciennes props du composant et ses nouvelles props. Elle doit retourner `true` si les anciennes et les nouvelles props sont égaux : c’est-à-dire, si le composant affichera la même chose et se comportera de la même manière avec les nouvelles props qu’avec les anciennes. Sinon, elle doit retourner `false`. En général, vous n’aurez pas à spécifier cette fonction. Par défaut, React compare chaque props avec [`Object.is`.](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

#### Valeur renvoyée {/*returns*/}

`memo` renvoi un nouveau composant React. Il se comporte de la même manière que le composant fourni à `memo` sauf que React ne le réaffichera pas à nouveau lorsque son composant parent est en train d’être réaffiché à nouveau à moins que ses props ne soient modifiées.

---

## Utilisation {/*usage*/}

### Éviter les rendus superflus de composants lorsque les props restent inchangées {/*skipping-re-rendering-when-props-are-unchanged*/}

React affiche normalement un composant à chaque fois que son composant parent le fait. Avec `memo`, vous pouvez créer un composant que React n’affichera lorsque son composant parent le fera, tant que ses nouvelles props sont les mêmes que les anciens. Un tel composant est dit *mémoïsé*.

Pour mémoïser un composant, enrober le dans la fonction `memo` et utilisez la valeur qu’il renvoi à la place de votre composant d’origine :

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Bonjour, {name}!</h1>;
});

export default Greeting;
```

Un composant React doit toujours avoir une [logique de rendu pure](/learn/keeping-components-pure). Cela signifie qu’il doit renvoyer la même donnée si ces props, états locaux et contexte n’ont pas changés. En utilisant `memo`, vous indiquez à React que votre composant est conforme avec cette exigence, alors React n’aura pas besoin de faire un nouveau rendu jusqu’à ce que ces props aient changées. De même avec `memo`, votre composant réaffichera si ses états locaux changent ou si un context qu’il utilise change.

Dans cet example, Notez que le composant `Greeting` réaffichera à chaque fois que `name` soit modifié (parce que c’est son unique props), et ne réaffichera pas lorsque `address` soit modifié (parce qu’il n’est pas fourni à `Greeting` en tant que props) :

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nom{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Adresse{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Rendu de Greeting à", new Date().toLocaleTimeString());
  return <h3>Bonjour {name && ', '}{name}!</h3>;
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

**Vous ne devriez utiliser `memo` que pour optimiser les performances**. Si votre code ne fonctionne pas sans lui, trouvez le problème sous-jacent et réparez le d’abord. Vous pouvez ensuite ajouter `memo` pour améliorer les performances.

</Note>

<DeepDive>

#### Devriez-vous mettre des `memo` partout? {/*should-you-add-memo-everywhere*/}

Si votre appli est comme ce site, l'essentiel des interactions ont un impact assez large (genre remplacer une page ou une section entière), de sorte que la mémoïsation est rarement nécessaire. En revanche, si votre appli est plus comme un éditeur de dessin, et que la plupart des interactions sont granulaires (comme déplacer des formes), alors la mémoïsation est susceptible de beaucoup vous aider.

L’optimisation avec `memo` n’est utile que, lorsque votre composant réaffiche souvent avec les mêmes props, et sa logique de réaffichage est coûteux. S’il n'y a pas de décalage perceptible lorsque votre composant réaffiche, `memo` est inutile. Gardez à l’esprit que `memo` est complètement inutile si les props fournis à votre composant sont *toujours différents*, par exemple si vous fournissez un objet ou une fonction simple définie pendant son rendu. C’est pourquoi vous aurez souvent besoin de [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) et [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) ensemble avec `memo`.

Le reste du temps, enrober une fonction avec `memo` n’a pas d’intérêt.  Ça ne va pas gêner non plus, aussi certaines équipes décident de ne pas réfléchir au cas par cas, et mémoïsent autant que possible.  L’inconvénient, c’est que ça nuit à la lisibilité du code.  Par ailleurs, toutes les mémoïsations ne sont pas efficaces.  Il suffit d’une seule valeur « toujours différente » pour casser la mémoïsation de tout un composant.

**En pratique, vous pouvez rendre beaucoup de mémoïsations superflues rien qu'en respectant les principes suivants :**

1. Lorsqu’un composant en enrobe d’autres visuellement, permettez-lui [d’accepter du JSX comme enfant](/learn/passing-props-to-a-component#passing-jsx-as-children). Ainsi, si le composant d’enrobage met à jour son propre état, React saura que ses enfants n’ont pas besoin de refaire leur rendu.
2. Préférez l’état local et ne faites pas [remonter l’état](/learn/sharing-state-between-components) plus haut que nécessaire. Ne conservez pas les éléments d’état transients (tels que les champs de formulaire ou l'état de survol d'un élément) à la racine de votre arbre ou dans une bibliothèque de gestion d’état global.
3.Assurez-vous d’avoir une [logique de rendu pure](/learn/keeping-components-pure). Si refaire le rendu d’un composant entraîne des problèmes ou produit un artefact visuel perceptible, c’est un bug dans votre composant ! Corrigez le bug plutôt que de tenter de le cacher avec une mémoïsation.
4. Évitez [les Effets superflus qui mettent à jour l’état](/learn/you-might-not-need-an-effect). La plupart des problèmes de performance des applis React viennent de chaînes de mise à jour issues d’Effets, qui entraînent de multiples rendus consécutifs de vos composants.
5. Essayez [d’alléger les dépendances de vos Effets](/learn/removing-effect-dependencies). Par exemple, plutôt que de mémoïser, il est souvent plus simple de déplacer un objet ou une fonction à l’intérieur de l’Effet voire hors de votre composant.

Si une interaction spécifique continue à traîner la patte, [utilisez le Profiler des outils de développement React](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) pour découvrir quels composants bénéficieraient le plus d'une mémoïsation, et ajoutez-en au cas par cas.  Ces principes facilitent le débogage et la maintenabilité de vos composants, ils sont donc utiles à suivre dans tous les cas.  À plus long terme, nous faisons de la recherche sur les moyens de [mémoïser automatiquement](https://www.youtube.com/watch?v=lGEMwh32soc) pour résoudre ces questions une bonne fois pour toutes.

</DeepDive>

---

### Mise à jour d’un composant mémoïsé avec son état local {/*updating-a-memoized-component-using-state*/}

Même si un composant est mémoïsé, il fera toujours un nouveau rendu lorsque ses propres états locaux changent. La mémoïsation ne concerne que les props qui sont fournis au composant par son parent.

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Nom{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Adresse{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Rendu de Greeting à', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Hello');
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
          checked={value === 'Hello'}
          onChange={e => onChange('Hello')}
        />
        Salutation régulière
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Hello and welcome'}
          onChange={e => onChange('Hello and welcome')}
        />
        Salutation enthousiaste
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

Si vous déclarez une variable d’état local à sa valeur actuelle, React ignorera le nouveau rendu de votre composant même sans `memo`. Il se peut que la fonction de votre composant soit encore appelée une fois de plus, mais le résultat sera rejeté.

---

### Mise à jour d’un composant mémoïsé avec son context {/*updating-a-memoized-component-using-a-context*/}

Même si un composant est mémoïsé, il fera toujours un nouveau rendu lorsqu'un context qu’il utilise change. La mémoïsation ne concerne que les props qui sont fournis au composant par son parent.

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
      <Greeting name="Taylor" />
    </ThemeContext.Provider>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Rendu de Greeting à", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Hello, {name}!</h3>
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

Pour que votre composant fasse à nouveau un rendu lorsqu’une _partie_ de certains contexte changent, découpez votre composant en deux. Lisez ce dont vous avez besoin dans le contexte du composant extérieur, et transmettez-le à un composant enfant mémoïsé sous forme d’un props.

---

### Réduire les changements de props {/*minimizing-props-changes*/}

Lorsque vous utilisez `memo`, votre composant réaffichera à chaque fois qu’un prop n’est *partiellement egal*  à ce qu’il était précédemment. Ce qui signifie que React compare chaque props dans votre composant avec leur valeur précédente avec la comparaison [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Notez que `Object.is(3, 3)` est `true`, mais `Object.is({}, {})` est `false`.


Pour profiter du meilleur parti de `memo`, réduisez le nombre de fois que les props changent. Par exemple, si la props est un objet, empêcher le composant parent de recréer cet objet à chaque fois en utilisant la fonction [`useMemo`:](/reference/react/useMemo)

```js {5-8}
function Page() {
  const [name, setName] = useState('Taylor');
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

La meilleur façon de réduire les changements de props est de s’assurer que le composant accepte le minimum d’informations necessaires dans ses props. Par exemple, il pouvait accepter les valeurs individuelles au lieu d’un objet entier :

```js {4,7}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

Même les valeurs individuelles peuvent parfois être projetées vers des valeurs qui changent moins fréquemment. Par exemple, ici, un composant accepte un booléen indiquant la présence d’une valeur plutôt que la valeur elle-même :

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

Lorsque vous devez fournir une fonction à un composant mémoïsé, soit le déclarer en dehors de votre composant pour qu’il ne change jamais, ou [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) pour mettre en cache sa définition entre les réaffichages.

---

### Spécification d'une fonction de comparaison personnalisée {/*specifying-a-custom-comparison-function*/}

Dans de rares cas, il peut être impossible de réduire les changements de props d’un composant mémoïsé. Dans ce cas, vous pouvez fournir une fonction de comparaison personnalisée, que React utilisera pour comparer l’ancien et le nouveau props au lieu d’utiliser une égalité superficielle. Cette fonction est passée comme second argument à `memo`. Elle doit retourner `true` seulement si les nouveaux props donneraient le même résultat que les anciens props; sinon elle doit retourner `false`.

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

Dans ce cas, utilisez le panneau performance des outils de développement de votre navigateur pour vous assurer que votre fonction de comparaison est réellement plus rapide que le nouveau rendu du composant. Vous pourriez être surpris.

Lorsque vous effectuez des mesures de performance, assurez-vous que React fonctionne en mode production.

<Pitfall>

Si vous fournissez une implémentation personnaliséee `arePropsEqual`, **Vous devez comparer chaque props, y compris les fonctions**. Les fonctions sont souvent [fermées sur](https://developer.mozilla.org/fr/docs/Web/JavaScript/Closures) les props et états locaux des composants parent. Si vous renvoyez `true` lorsque `oldProps.onClick !== newProps.onClick`, votre composant continuera à "voir" les props et états locaux d’un rendu précédent à l’intérieur de son gestionnaire `onClick`, ce qui conduit à des bugs très déroutants.

Evitez de faire des vérifications d’égalité en profondeur dans `arePropsEqual` à moins que vous ne soyez 100% sûr que la structure de données avec laquelle vous travaillez a une profondeur limitée connue. **Les vérifications d’égalité profondes peuvent devenir incroyablement lentes** et peuvent bloquer votre appli pendant plusieurs secondes si quelqu’un change la structure de données plus tard.

</Pitfall>

---

## Dépannage {/*troubleshooting*/}
### Mon composant réaffiche lorsqu’une prop est un objet, array, ou une fonction {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React compare les anciens et les nouvelles props par égalité superficielle : c’est-à-dire qu’il considère si chaque nouvelle prop est égale par référence à l’ancien. Si vous créez un nouvel objet ou un nouveau array à chaque fois que le composant parent fait son rendu, même si les éléments individuels sont tous identiques, React considérera qu’ils ont été modifiés. De même, si vous créez une nouvelle fonction lors du rendu du composant parent, React considérera qu’il a changé même si la fonction a la même définition. Pour éviter cela, [simplifier les props ou mémoïsez les props dans le composant parent](#minimizing-props-changes).
