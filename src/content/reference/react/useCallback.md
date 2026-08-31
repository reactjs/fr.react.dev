---
title: useCallback
---

<Intro>

`useCallback` est un Hook React qui vous permet de mettre en cache une définition de fonction d'un rendu à l'autre.

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) automatically memoizes values and functions, reducing the need for manual `useCallback` calls. You can use the compiler to handle memoization automatically.

</Note>

<InlineToc />

---

## Référence {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

Appelez `useCallback` à la racine de votre composant pour mettre en cache une définition de fonction d'un rendu à l'autre :

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `fn` : la fonction que vous souhaitez mettre en cache.  Elle peut prendre un nombre quelconque d'arguments et renvoyer n'importe quelle valeur.  React vous renverra (sans l'appeler !) votre fonction lors du rendu initial. Lors des rendus suivants, React vous donnera la même fonction tant que les `dependencies` n'auront pas changé depuis le rendu précédent.  Dans le cas contraire, il vous renverra la fonction passée lors du rendu en cours, et la mettra en cache pour la suite.  React n'appellera pas votre fonction. La fonction vous est renvoyée afin que vous l'appeliez vous-même au moment de votre choix.

* `dependencies` : la liste des valeurs réactives référencées par le code de `fn`.  Les valeurs réactives comprennent les props, les variables d'état et toutes les variables et fonctions déclarées localement dans le corps de votre composant.  Si votre *linter* est [configuré pour React](/learn/editor-setup#linting), il vérifiera que chaque valeur réactive concernée est bien spécifiée comme dépendance.  La liste des dépendances doit avoir un nombre constant d'éléments et utiliser un littéral défini à la volée, du genre `[dep1, dep2, dep3]`. React comparera chaque dépendance à sa valeur précédente au moyen de la comparaison [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Valeur renvoyée {/*returns*/}

Lors du rendu initial, `useCallback` renvoie la fonction `fn` que vous venez de lui passer.

<<<<<<< HEAD
Lors des rendus ultérieurs, il vous renverra soit la fonction `fn` mise en cache jusqu'ici (si les dépendances n'ont pas changé), soit la fonction `fn` que vous venez de lui passer pour le rendu courant.
=======
During subsequent renders, it will either return an already stored `fn` function from the last render (if the dependencies haven't changed), or return the `fn` function you have passed during this render.
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab

#### Limitations {/*caveats*/}

* `useCallback` est un Hook, vous pouvez donc uniquement l’appeler **à la racine de votre composant** ou de vos propres Hooks. Vous ne pouvez pas l’appeler à l’intérieur de boucles ou de conditions. Si nécessaire, extrayez un nouveau composant et déplacez l'Effet dans celui-ci.

* React **ne libèrera pas la fonction mise en cache s'il n'a pas une raison bien précise de le faire**.  Par exemple, en développement, React vide le cache dès que vous modifiez le fichier de votre composant.  Et tant en développement qu'en production, React vide le cache si votre composant suspend lors du montage initial.  À l'avenir, React est susceptible d'ajouter de nouvelles fonctionnalités qui tireront parti du vidage de cache — si par exemple React prenait un jour nativement en charge la virtualisation des listes, il serait logique qu'il retire du cache les éléments défilant hors de la zone visible de la liste virtualisée.  Ça devrait correspondre à vos attentes si vous concevez `useCallback` comme une optimisation de performance.  Dans le cas contraire, vous voudrez sans doute plutôt recourir à une [variable d'état](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) ou à une [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents).

---

## Utilisation {/*usage*/}

### Éviter les rendus superflus de composants {/*skipping-re-rendering-of-components*/}

Lorsque vous optimisez la performance de rendu, vous aurez parfois besoin de mettre en cache les fonctions que vous passez à des composants enfants.  Commençons par regarder la syntaxe pour y parvenir, puis voyons dans quels cas c'est utile.

Pour mettre en cache une fonction d'un rendu à l'autre au sein de votre composant, enrobez sa définition avec le Hook `useCallback` :

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

Vous devez passer deux arguments à `useCallback` :

1. Une définition de fonction que vous souhaitez mettre en cache d'un rendu à l'autre.
2. Une <CodeStep step={2}>liste de dépendances</CodeStep> comprenant chaque valeur issue de votre composant que cette fonction utilise.

Lors du rendu initial, la <CodeStep step={3}>fonction renvoyée</CodeStep> par `useCallback` sera la fonction que vous avez passée.

Lors des rendus suivants, React comparera les <CodeStep step={2}>dépendances</CodeStep> avec celles passées lors du rendu précédent. Si aucune dépendance n'a changé (sur base d'une comparaison avec l'algorithme [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useCallback` continuera à utiliser la même fonction. Dans le cas contraire, `useCallback` renverra la fonction que vous venez de lui passer pour le rendu *courant*.

En d'autres termes, `useCallback` met en cache une fonction d'un rendu à l'autre jusqu'à ce que ses dépendances changent.

**Déroulons un exemple afin de comprendre en quoi c'est utile.**

Supposons que vous passiez une fonction `handleSubmit` depuis un composant `ProductPage` vers le composant `ShippingForm` :

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

En utilisant l'interface, vous avez remarqué que basculer la prop `theme` gèle l'appli pendant un moment, mais si vous retirez `<ShippingForm/>` de votre JSX, il redevient performant.  Ça vous indique qu'il serait bon de tenter d'optimiser le composant `ShippingForm`.

**Par défaut, lorsqu'un composant refait son rendu, React refait le rendu de tous ses composants enfants, récursivement.**  C'est pourquoi lorsque `ProductPage` refait son rendu avec un `theme` différent, le composant `ShippingForm` refait *aussi* son rendu.  Ça ne pose aucun problème pour les composants dont le rendu n'est pas trop coûteux.  Mais si vous avez confirmé que son rendu est lent, vous pouvez dire à `ShippingForm` d'éviter de nouveaux rendus lorsque ses props ne changent pas en l'enrobant avec [`memo`](/reference/react/memo) :

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**Avec cet ajustement, `ShippingForm` évitera de refaire son rendu si toutes ses propriétés sont *identiques* depuis le dernier rendu.**  Et c'est là que la mise en cache de fonction devient importante !  Imaginons que vous définissiez `handleSubmit` sans `useCallback` :

```js {2,3,8,12-14}
function ProductPage({ productId, referrer, theme }) {
  // Chaque fois que le `theme` change, cette fonction sera différente...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      {/* ... du coup les props de ShippingForm seront toujours différentes,
          et il refera son rendu à chaque fois. */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**En JavaScript, une `function () {}` ou `() => {}` crée toujours une fonction _différente_**, de la même façon qu'un littéral objet `{}` crée toujours un nouvel objet. En temps normal ça ne poserait pas problème, mais ici ça signifie que les props de `ShippingForm` ne seront jamais identiques, de sorte que votre optimisation avec [`memo`](/reference/react/memo) ne servira à rien. C'est là que `useCallback` entre en scène :

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Dit à React de mettre en cache votre fonction d’un rendu à l’autre...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...du coup tant que ces dépendances ne changent pas...

  return (
    <div className={theme}>
      {/* ...ShippingForm recevra les mêmes props et ne refera pas son rendu. */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**En enrobant `handleSubmit` dans un `useCallback`, vous garantissez qu'il s'agira de la *même* fonction d'un rendu à l'autre** (tant que les dépendances ne changent pas).  Vous n'avez *pas besoin* d'enrober une fonction dans `useCallback` par défaut, sans raison précise.  Dans cet exemple, la raison tient à ce que vous la passez à un composant enrobé par [`memo`](/reference/react/memo), ça lui permet donc d'effectivement éviter des rendus superflus.  Il existe d'autres raisons de recourir à `useCallback`, qui sont détaillées dans la suite de cette page.

<Note>

**Vous ne devriez recourir à `useCallback` que pour optimiser les performances.**  Si votre code ne fonctionne pas sans lui, commencez par débusquer la cause racine puis corrigez-la.  Alors seulement envisagez de remettre `useCallback`.

</Note>

<DeepDive>

#### En quoi `useCallback` diffère-t-il de `useMemo` ? {/*how-is-usecallback-related-to-usememo*/}

Vous verrez souvent [`useMemo`](/reference/react/useMemo) utilisé à proximité de `useCallback`. Les deux sont utiles pour optimiser un composant enfant.  Ils vous permettent de [mémoïser](https://fr.wikipedia.org/wiki/M%C3%A9mo%C3%AFsation) (en d'autres termes, de mettre en cache) une valeur que vous souhaitez leur transmettre :

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // Appelle votre fonction et met le résultat en cache
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // Met en cache la fonction elle-même
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

La différence réside dans *la valeur* qu'ils vous permettent de mettre en cache :

* **[`useMemo`](/reference/react/useMemo) met en cache le *résultat* d'un appel à votre fonction.**  Dans cet exemple, il met en cache le résultat de l'appel à `computeRequirements(product)`, qui n'est donc plus appelée tant que `product` est inchangé. Ça vous permet de transmettre à vos enfants l'objet `requirements` sans entraîner obligatoirement un nouveau rendu de `ShippingForm`.  Lorsque c'est nécessaire, React rappelle la fonction que vous avez passée lors du rendu pour recalculer le résultat.
* **`useCallback` met en cache *la fonction elle-même*.**  Contrairement à `useMemo`, elle n'appelle pas la fonction que vous lui passez.  Au lieu de ça, elle met en cache la fonction pour que `handleSubmit` *elle-même* ne change pas tant que `productId` et `referrer` sont stables. Ça vous permet de passer la fonction `handleSubmit` à `ShippingForm` sans nécessairement que ça entraîne son rendu. Le code de la fonction ne sera lui exécuté que lorsque l'utilisateur soumettra le formulaire.

Si vous êtes déjà à l'aise avec [`useMemo`](/reference/react/useMemo), vous trouverez peut-être pratique de penser à `useCallback` comme un équivalent du code suivant :

<<<<<<< HEAD
```js
// Implémentation simplifiée (code interne de React)
=======
```js {expectedErrors: {'react-compiler': [3]}}
// Simplified implementation (inside React)
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[Apprenez-en davantage sur la différence entre `useMemo` et `useCallback`](/reference/react/useMemo#memoizing-a-function).

</DeepDive>

<DeepDive>

#### Devriez-vous mettre des `useCallback` partout ? {/*should-you-add-usecallback-everywhere*/}

<<<<<<< HEAD
Si votre appli est comme ce site, l'essentiel des interactions ont un impact assez large (genre remplacer une page ou une section entière), de sorte que la mémoïsation est rarement nécessaire.  En revanche, si votre appli est plus comme un éditeur de dessin, et que la plupart des interactions sont granulaires (comme déplacer des formes), alors la mémoïsation est susceptible de beaucoup vous aider.

Mettre en cache une fonction avec `useCallback` n'est utile que dans deux grands cas de figure :
=======
If your app is like this site, and most interactions are coarse (like replacing a page or an entire section), memoization is usually unnecessary. On the other hand, if your app is more like a drawing editor, and most interactions are granular (like moving shapes), then you might find memoization very helpful.

Caching a function with `useCallback` is only valuable in a few cases:
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab

- Vous la passez comme prop à un composant enrobé avec [`memo`](/reference/react/memo).  Vous voulez qu'il puisse éviter de refaire son rendu si la valeur n'a pas changé.  En mémoïsant la fonction, vous limitez ses nouveaux rendus aux cas où les dépendances de votre fonction ont en effet changé.
- La fonction que vous passez est utilisée plus loin comme dépendance par un Hook.  Par exemple, une autre fonction enrobée par `useCallback` en dépend, ou vous en dépendez pour un [`useEffect`](/reference/react/useEffect).

Le reste du temps, enrober une fonction avec `useCallback` n'a pas d'intérêt.  Ça ne va pas gêner non plus, aussi certaines équipes décident de ne pas réfléchir au cas par cas, et mémoïsent autant que possible.  L'inconvénient, c'est que ça nuit à la lisibilité du code.  Par ailleurs, toutes les mémoïsations ne sont pas efficaces.  Il suffit d'une seule valeur « toujours différente » pour casser la mémoïsation de tout un composant.

Remarquez que `useCallback` n'empêche pas la *création* de la fonction.  Vous créez la fonction à chaque rendu (et tout va bien !) mais React l'ignorera et vous renverra la fonction mise en cache si aucune dépendance n'a changé.

**En pratique, vous pouvez rendre beaucoup de mémoïsations superflues rien qu'en respectant les principes suivants :**

<<<<<<< HEAD
1. Lorsqu'un composant en enrobe d'autres visuellement, permettez-lui [d'accepter du JSX comme enfant](/learn/passing-props-to-a-component#passing-jsx-as-children). Ainsi, si le composant d'enrobage met à jour son propre état, React saura que ses enfants n'ont pas besoin de refaire leur rendu.
2. Préférez l'état local et ne faites pas [remonter l'état](/learn/sharing-state-between-components) plus haut que nécessaire.  Ne conservez pas les éléments d'état transients (tels que les champs de formulaire ou l'état de survol d'un élément) à la racine de votre arbre ou dans une bibliothèque de gestion d'état global.
3. Assurez-vous d'avoir une [logique de rendu pure](/learn/keeping-components-pure).  Si refaire le rendu d'un composant entraîne des problèmes ou produit un artefact visuel perceptible, c'est un bug dans votre composant !  Corrigez le bug plutôt que de tenter de le cacher avec une mémoïsation.
4. Évitez [les Effets superflus qui mettent à jour l'état](/learn/you-might-not-need-an-effect).  La plupart des problèmes de performance des applis React viennent de chaînes de mise à jour issues d'Effets, qui entraînent de multiples rendus consécutifs de vos composants.
5. Essayez [d'alléger les dépendances de vos Effets](/learn/removing-effect-dependencies). Par exemple, plutôt que de mémoïser, il est souvent plus simple de déplacer un objet ou une fonction à l'intérieur de l'Effet voire hors de votre composant.
=======
1. When a component visually wraps other components, let it [accept JSX as children.](/learn/passing-props-to-a-component#passing-jsx-as-children) Then, if the wrapper component updates its own state, React knows that its children don't need to re-render.
2. Prefer local state and don't [lift state up](/learn/sharing-state-between-components) any further than necessary. Don't keep transient state like forms and whether an item is hovered at the top of your tree or in a global state library.
3. Keep your [rendering logic pure.](/learn/keeping-components-pure) If re-rendering a component causes a problem or produces some noticeable visual artifact, it's a bug in your component! Fix the bug instead of adding memoization.
4. Avoid [unnecessary Effects that update state.](/learn/you-might-not-need-an-effect) Most performance problems in React apps are caused by chains of updates originating from Effects that cause your components to render over and over.
5. Try to [remove unnecessary dependencies from your Effects.](/learn/removing-effect-dependencies) For example, instead of memoization, it's often simpler to move some object or a function inside an Effect or outside the component.
>>>>>>> 7c36f7ac329fe3cf2e11222edce9a535158c2cab

Si une interaction spécifique continue à traîner la patte, [utilisez le Profiler des outils de développement React](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) pour découvrir quels composants bénéficieraient le plus d'une mémoïsation, et ajoutez-en au cas par cas.  Ces principes facilitent le débogage et la maintenabilité de vos composants, ils sont donc utiles à suivre dans tous les cas.  À plus long terme, nous faisons de la recherche sur les moyens de [mémoïser automatiquement](https://www.youtube.com/watch?v=lGEMwh32soc) pour résoudre ces questions une bonne fois pour toutes.

</DeepDive>

<Recipes titleText="La différence entre useCallback et déclarer une fonction directement" titleId="examples-rerendering">

#### Éviter les rendus superflus avec `useCallback` et `memo` {/*skipping-re-rendering-with-usecallback-and-memo*/}

Dans cet exemple, le composant `ShippingForm` est **artificiellement ralenti** pour que vous puissiez bien voir ce qui se passe lorsque le rendu d'un composant React est véritablement lent.  Essayez d'incrémenter le compteur et de basculer le thème.

L'incrémentation du compteur semble lente parce qu'elle force le `ShippingForm` ralenti à refaire son rendu.  On pouvait s'y attendre, puisque le compteur a changé, vous devez donc refléter le nouveau choix de l'utilisateur à l'écran.

Essayez maintenant de basculer le thème. **Grâce à la combinaison de `useCallback` et [`memo`](/reference/react/memo), c'est rapide en dépit du ralenti artificiel !** `ShippingForm` a évité un nouveau rendu parce que la fonction `handleSubmit` n'a pas changé, dans la mesure où ni `productId` ni `referrer` (les dépendances déclarées pour le `useCallback`) n'ont changé depuis le dernier rendu.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Mode sombre
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imaginez que ça envoie une requête...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIELLEMENT LENT] Rendu de <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Ne rien faire pendant 500 ms pour simuler du code extrêmement lent
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Remarque : <code>ShippingForm</code> est artificiellement ralenti !</b></p>
      <label>
        Nombre d’éléments :
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Rue :
        <input name="street" />
      </label>
      <label>
        Ville :
        <input name="city" />
      </label>
      <label>
        Code postal :
        <input name="zipCode" />
      </label>
      <button type="submit">Envoyer</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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

Dans cet exemple, l'implémentation de `ShippingForm` est toujours **artificiellement ralentie** pour que vous puissiez bien voir ce qui se passe lorsque le rendu d'un composant React est véritablement lent.  Essayez d'incrémenter le compteur et de basculer le thème.

Contrairement à l'exemple précédent, la bascule du thème est désormais lente, elle aussi ! C'est parce **qu'il n'y a pas d'appel à `useCallback` dans cette version**, de sorte qu'`handleSubmit` est toujours une nouvelle fonction, ce qui empêche le composant `ShippingForm` ralenti de sauter un nouveau rendu.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Mode sombre
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imaginez que ça envoie une requête...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIELLEMENT LENT] Rendu de <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Ne rien faire pendant 500 ms pour simuler du code extrêmement lent
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Remarque : <code>ShippingForm</code> est artificiellement ralenti !</b></p>
      <label>
        Nombre d’éléments :
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Rue :
        <input name="street" />
      </label>
      <label>
        Ville :
        <input name="city" />
      </label>
      <label>
        Code postal :
        <input name="zipCode" />
      </label>
      <button type="submit">Envoyer</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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

Ceci dit, voici le même code **sans le ralentissement artificiel**. Est-ce que vous pouvez percevoir l'absence de `useCallback` ?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Mode sombre
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imaginez que ça envoie une requête...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('Rendu de <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nombre d’éléments :
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Rue :
        <input name="street" />
      </label>
      <label>
        Ville :
        <input name="city" />
      </label>
      <label>
        Code postal :
        <input name="zipCode" />
      </label>
      <button type="submit">Envoyer</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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

### Mettre à jour l'état depuis une fonction mémoïsée {/*updating-state-from-a-memoized-callback*/}

Il peut arriver que vous ayez besoin, au sein d'une fonction mémoïsée, de mettre à jour l'état sur base d'une valeur d'état antérieur.

La fonction `handleAddTodo` ci-dessous spécifie `todos` comme dépendance parce qu'elle s'en sert pour calculer les prochaines tâches :

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

Il est généralement souhaitable que vos fonctions mémoïsées aient le moins de dépendances possibles. Lorsque vous lisez l'état uniquement pour calculer sa prochaine valeur, vous pouvez retirer cette dépendance en utilisant plutôt une [fonction de mise à jour](/reference/react/useState#updating-state-based-on-the-previous-state) :

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ Plus besoin de la dépendance `todos`
  // ...
```

Dans cette version, plutôt que de dépendre de `todos` pour la lire dans le code, vous indiquez plutôt à React *comment* mettre à jour l'état (`todos => [...todos, newTodo]`). [Apprenez-en davantage sur les fonctions de mise à jour](/reference/react/useState#updating-state-based-on-the-previous-state).

---

### Empêcher les déclenchements intempestifs d'un Effet {/*preventing-an-effect-from-firing-too-often*/}

Vous souhaitez parfois appeler une fonction locale depuis un [Effet](/learn/synchronizing-with-effects) :

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Ça pose toutefois problème. [Chaque valeur réactive doit être déclarée comme dépendance de votre Effet](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency).  Seulement voilà, si vous déclarez `createOptions` comme dépendance, votre Effet se reconnectera systématiquement au salon de discussion :


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Problème : cette dépendance change à chaque rendu
  // ...
```

Pour résoudre ça, vous pouvez enrober la fonction à appeler depuis l'Effet avec `useCallback` :

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Ne change que si `roomId` change

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Ne change que si createOptions change
  // ...
```

Ça garantit que la fonction `createOptions` sera la même d'un rendu à l'autre tant que `roomId` ne changera pas. **Ceci dit, il serait encore préférable d'éviter toute dépendance à la fonction locale.**  Déplacez plutôt votre fonction *au sein* de l'Effet :

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ Ni `useCallback` ni dépendance sur fonction !
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Ne change que si `roomId` change
  // ...
```

À présent votre code est plus simple et n'a même pas besoin de `useCallback`. [Apprenez-en davantage sur l'allègement des dépendances d'un Effet](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect).

---

### Optimiser un Hook personnalisé {/*optimizing-a-custom-hook*/}

Si vous écrivez un [Hook personnalisé](/learn/reusing-logic-with-custom-hooks), nous vous conseillons d'enrober avec `useCallback` toute fonction qu'il serait amené à renvoyer :

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

Ça garantit que les consommateurs de votre Hook pourront optimiser leur propre code en cas de besoin.

---

## Dépannage {/*troubleshooting*/}

### À chaque rendu de mon composant, `useCallback` renvoie une fonction distincte {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

Assurez-vous d'avoir spécifié le tableau de dépendances comme second argument !

Si vous oubliez le tableau de dépendances, `useCallback` renverra une nouvelle fonction à chaque fois :

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Renvoie une nouvelle fonction à chaque fois, faute de tableau de dépendances
  // ...
```

Voici la version corrigée, qui passe bien le tableau de dépendances comme second argument :

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ Ne renvoie pas de nouvelle fonction pour rien
  // ...
```

Si ça n'aide pas, alors le problème vient de ce qu'au moins une de vos dépendances diffère depuis le rendu précédent.  Vous pouvez déboguer ce problème en affichant manuellement vos dépendances dans la console :

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

Vous pouvez alors cliquer bouton droit, dans la console, sur les tableaux issus de différents rendus et sélectionner « Stocker objet en tant que variable globale » pour chacun d'entre eux.  En supposant que vous avez stocké le premier en tant que `temp1` et le second en tant que `temp2`, vous pouvez alors utiliser la console du navigateur pour vérifier si chaque dépendance des tableaux est identique :

```js
Object.is(temp1[0], temp2[0]); // La première dépendance est-elle inchangée ?
Object.is(temp1[1], temp2[1]); // La deuxième dépendance est-elle inchangée ?
Object.is(temp1[2], temp2[2]); // ... et ainsi de suite pour chaque dépendance ...
```

Lorsque vous aurez repéré la dépendance qui casse la mémoïsation, vous pouvez soit tenter de la retirer, soit [la mémoïser aussi](/reference/react/useMemo#memoizing-a-dependency-of-another-hook).

---

### Je souhaite appeler `useCallback` pour chaque élément d'une liste dans une boucle, mais c'est interdit {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Imaginez que le composant `Chart` utilisé ci-dessous soit enrobé par [`memo`](/reference/react/memo).  Vous souhaitez éviter des rendus superflus de chaque `Chart` dans la liste lorsque le composant `ReportList` refait son rendu.  Cependant, vous ne pouvez pas appeler `useCallback` au sein de la boucle :

```js {expectedErrors: {'react-compiler': [6]}} {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 Vous n’avez pas le droit d’utiliser `useCallback` dans une boucle comme ceci :
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

Au lieu de ça, extrayez un composant pour chaque élément individuel, et mettez-y l'appel à `useCallback` :

```js {5,12-21}
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
  // ✅ Appelez `useCallback` au niveau racine :
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

Une autre solution consisterait à retirer `useCallback` de l'exemple précédent, pour plutôt enrober `Report` lui-même avec un [`memo`](/reference/react/memo).  Ainsi, si la prop `item` ne change pas, `Report` évitera de refaire son rendu, de sorte que `Chart` sera épargné lui aussi :

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
