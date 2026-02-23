---
title: Les composants et les Hooks doivent être des fonctions pures
---

<Intro>

Les fonctions pures ne font que des calculs, rien de plus. Elles facilitent la compréhension de votre code et son débogage, et permettent à React d'optimiser automatiquement vos composants et Hooks de façon fiable.

</Intro>

<Note>

Cette page de référence couvre des sujets avancés, et nécessite une aisance préalable avec les concepts couverts dans la page [Garder les composants purs](/learn/keeping-components-pure).

</Note>

<InlineToc />

### En quoi la pureté est-elle importante ? {/*why-does-purity-matter*/}

Un des piliers conceptuels qui font que React est _React_, c'est la _pureté_.  Dire qu'un composant ou Hook est pur, c'est affirmer qu'il :

* **est idempotent** — Vous [obtenez toujours le même résultat](/learn/keeping-components-pure#purity-components-as-formulas) lorsque vous l'appelez avec les mêmes entrées, à savoir les props, états locaux et contextes pour les composants, et les arguments pour les Hooks.
* **n'a aucun effet de bord dans son rendu** — Le code des effets de bord devrait tourner [**séparément du rendu**](#how-does-react-run-your-code). Par exemple dans un [gestionnaire d'événements](/learn/responding-to-events), lorsque l'utilisateur interagit avec l'UI et entraîne une mise à jour ; ou dans un [Effet](/reference/react/useEffect), qui s'exécute après le rendu.
* **ne modifie aucune valeur non locale** — les composants et Hooks ne devraient [jamais modifier les valeurs qui ne sont pas créées localement](#mutation) lors du rendu.

Lorsqu'on préserve la pureté du rendu, React peut comprendre comment prioriser les mises à jour les plus importantes pour que l'utilisateur les voie au plus tôt.  C'est rendu possible par la pureté du rendu : puisque les composants n'ont pas d'effets de bord [lors du rendu](#how-does-react-run-your-code), React peut mettre en pause le rendu de composants moins importants à mettre à jour, et n'y revenir que plus tard lorsqu'ils deviennent nécessaires.

Concrètement, ça signifie que la logique de rendu peut être exécutée plusieurs fois d'une façon qui permette à React de fournir une expérience utilisateur agréable.  En revanche, si votre composant a un effet de bord « clandestin » (comme par exemple une modification d'une variable globale [lors du rendu](#how-does-react-run-your-code)), lorsque React ré-exécutera votre code de rendu, vos effets de bord seront déclenchés d'une façon qui ne correspondra pas à vos attentes.  Ça entraîne souvent des bugs inattendus qui peuvent dégrader l'expérience utilisateur de votre appli.  Vous pouvez en voir un [exemple dans la page Garder les composants purs](/learn/keeping-components-pure#side-effects-unintended-consequences).

#### Comment React exécute-t-il votre code ? {/*how-does-react-run-your-code*/}

React est déclaratif : vous dites à React de _quoi_ faire le rendu, et React déterminera _comment_ afficher ça au mieux à l'utilisateur.  Pour y parvenir, React a plusieurs phases d'exécution de votre code.  Vous n'avez pas besoin de tout savoir sur ces phases pour bien utiliser React.  Mais vous devriez avoir au moins une compréhension de surface des parties du code qui tournent lors du _rendu_, et de celles qui tournent en-dehors.

<<<<<<< HEAD
Le _rendu_, c'est le calcul de la prochaine version de l'apparence de votre UI.  Après le rendu, les [Effets](/reference/react/useEffect) sont _traités_ (c'est-à-dire qu'ils sont exécutés jusqu'à ce qu'il n'en reste plus en attente) *(flushed, NdT)* et sont susceptibles de mettre à jour le calcul, si certains Effets ont un impact sur la mise en page. React récupère ce nouveau calcul et le compare à celui utilisé pour la version précédente de l'UI, puis il _commite_ le strict minimum de modifications nécessaires vers le [DOM](https://developer.mozilla.org/fr/docs/Web/API/Document_Object_Model) (ce que l'utilisateur voit en réalité) pour le synchroniser sur cette dernière version.
=======
_Rendering_ refers to calculating what the next version of your UI should look like. After rendering, React takes this new calculation and compares it to the calculation used to create the previous version of your UI. Then React commits just the minimum changes needed to the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) (what your user actually sees) to apply the changes. Finally, [Effects](/learn/synchronizing-with-effects) are flushed (meaning they are run until there are no more left). For more detailed information see the docs for [Render](/learn/render-and-commit) and [Commit and Effect Hooks](/reference/react/hooks#effect-hooks).
>>>>>>> a1cc2ab4bf06b530f86a7049923c402baf86aca1

<DeepDive>

#### Comment savoir si un code est exécuté lors du rendu {/*how-to-tell-if-code-runs-in-render*/}

Une heuristique simple pour déterminer si du code est exécuté lors du rendu consiste à examiner son emplacement : s'il figure au niveau racine, comme dans l'exemple ci-dessous, il est probable qu'il soit exécuté lors du rendu.

```js {2}
function Dropdown() {
  const selectedItems = new Set(); // créé lors du rendu
  // ...
}
```

Les gestionnaires d'événements et les Effets ne sont pas exécutés lors du rendu :

```js {4-5}
function Dropdown() {
  const selectedItems = new Set();
  const onSelect = (item) => {
    // ce code est dans un gestionnaire d’événements, il ne sera donc exécuté que
    // lorsque cet événement a lieu 
    selectedItems.add(item);
  }
}
```

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  useEffect(() => {
    // ce code est au sein d’un Effet, il ne sera donc exécuté qu’après le rendu
    logForAnalytics(selectedItems);
  }, [selectedItems]);
}
```
</DeepDive>

---

## Les composants et les Hooks doivent être idempotents {/*components-and-hooks-must-be-idempotent*/}

Les composants doivent toujours renvoyer le même résultat pour les mêmes entrées : props, états locaux et contextes.  On parle alors d'_idempotence_. [L'idempotence](https://fr.wikipedia.org/wiki/Idempotence) est un terme popularisé par la programmation fonctionnelle.  C'est l'idée selon laquelle l'exécution d'un morceau de code avec les mêmes entrées [produira le même résultat à chaque fois](learn/keeping-components-pure).

Ça implique que _tout_ le code qui est exécuté [lors du rendu](#how-does-react-run-your-code) soit aussi idempotent, sans quoi la règle ne tient plus.  Par exemple, la ligne de code ci-après n'est pas idempotente (et par conséquent, la composant non plus) :

```js {2}
function Clock() {
  const time = new Date(); // 🔴 Erroné : renvoie toujours un résultat différent !
  return <span>{time.toLocaleString()}</span>
}
```

`new Date()` n'est pas idempotent puisqu'il renvoie systématiquement l'instant courant, ce qui changera d'un appel à l'autre.  Lorsque vous faites le rendu du composant ci-dessus, l'heure affichée à l'écran sera gelée sur le moment du rendu.  Pour les mêmes raisons, des fonctions comme `Math.random()` ne sont pas idempotentes puisqu'elles renvoient un résultat différent à chaque appel, alors que leurs entrées sont identiques.

Ça ne signifie pas que vous ne devriez _jamais_ utiliser des fonctions non idempotentes telles que `new Date()` ; c'est juste que vous devriez les éviter [lors des rendus](#how-does-react-run-your-code). Pour ce genre de cas, vous pouvez _synchroniser_ le dernier moment souhaité avec le composant en utilisant par exemple un [Effet](/reference/react/useEffect):

<Sandpack>

```js
import { useState, useEffect } from 'react';

function useTime() {
  // 1. Garde trace du moment courant dans un état. `useState` reçoit une fonction
  //    d’initialisation comme état initial.  Elle ne sera exécutée qu’une fois lors de l’appel
  //    initial du Hook, afin que le moment courant au moment de cet appel soit utilisé comme
  //    valeur de départ.
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // 2.Met à jour la date à chaque seconde grâce à `setInterval`.
    const id = setInterval(() => {
      setTime(new Date()); // ✅ Correct : le code non idempotent n'est plus exécuté à chaque rendu
    }, 1000);
    // 3. Renvoie une fonction de nettoyage pour ne pas faire fuiter le timer `setInterval`.
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Clock() {
  const time = useTime();
  return <span>{time.toLocaleString()}</span>;
}
```

</Sandpack>

En enrobant l'appel non idempotent `new Date()` dans un Effet, nous déplaçons le calcul [hors du rendu](#how-does-react-run-your-code).

Si vous  n'avez pas besoin de synchroniser un état externe avec React, vous pouvez aussi envisager un [gestionnaire d'événements](/learn/responding-to-events) si la mise à jour doit résulter d'une interaction utilisateur.

---

## Les effets de bord doivent être exécutés hors du rendu {/*side-effects-must-run-outside-of-render*/}

[Les effets de bord](/learn/keeping-components-pure#side-effects-unintended-consequences) ne devraient pas être exécutés [lors du rendu](#how-does-react-run-your-code), dans la mesure où React peut faire plusieurs rendus successifs du même composant pour optimiser l'expérience utilisateur.

<Note>
Les effets de bord désignent un ensemble plus large que les Effets. Les Effets sont plus spécifiquement du code enrobé dans un appel à `useEffect`, tandis que les effets de bord au sens large désignent tout code qui a un effet observable autre que le résultat principal renvoyé à l'appelant.

Les effets de bord sont le plus souvent implémentés au sein de [gestionnaires d'événements](/learn/responding-to-events) ou d'Effets. Mais jamais au sein du rendu.
</Note>

Si le rendu doit en effet (ah ah) rester pur, les effets de bord sont néanmoins nécessaires afin que votre appli fasse quoi que ce soit d'intéressant, comme par exemple afficher quelque chose à l'écran ! L'essence de cette règle, c'est que les effets de bord ne soient pas exécutés [lors du rendu](#how-does-react-run-your-code), puisque React est susceptible d'effectuer des rendus multiples d'un composant. La plupart du temps, vous utiliserez des [gestionnaires d'événements](learn/responding-to-events) pour vos effets de bord.  Le recours à un gestionnaire d'événements indique explicitement à React que ce code n'a pas besoin d'être exécuté lors du rendu, ce qui préserve la pureté de celui-ci.  Si vous avez épuisé toutes les options possibles (et uniquement en dernier recours), vous pouvez aussi implémenter un effet de bord au moyen d'un `useEffect`.

### Quand est-il acceptable d'avoir une mutation ? {/*mutation*/}

#### Mutations locales {/*local-mutation*/}

La mutation est un cas courant d'effet de bord ; en JavaScript elle revient à modifier une valeur non [primitive](https://developer.mozilla.org/fr/docs/Glossary/Primitive). De façon générale, les mutations ne sont pas idiomatiques avec React, mais les mutations _locales_ ne posent aucun problème :

```js {2,7}
function FriendList({ friends }) {
  const items = []; // ✅ Correct : créé localement
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // ✅ Correct : les mutations locales ne posent pas de souci
  }
  return <section>{items}</section>;
}
```

Il n'est pas nécessaire de contorsionner votre code pour éviter les mutations locales. Vous pourriez aussi utiliser [`Array.map`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/map) pour plus de concision, mais il n'y a aucun mal à créer un tableau local puis le remplir [lors du rendu](#how-does-react-run-your-code).

Même s'il semble que nous mutions `items`, il faut bien voir ici que ce code n'opère que _localement_ : cette mutation n'est pas « persistée » quand le composant fait un nouveau rendu.  En d'autres termes, `items` ne reste en mémoire que le temps du rendu du composant. Puisque nous _recréons_ `items` à chaque rendu de `<FriendList />`, le composant renverra bien toujours le même résultat.

En revanche, si `items` était créé hors du composant, il contiendrait des valeurs issues de rendus précédents, dont il se souviendrait :

```js {1,7}
const items = []; // 🔴 Erroné : créé hors du composant
function FriendList({ friends }) {
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // 🔴 Erroné : mutation d’une valeur créée hors du rendu
  }
  return <section>{items}</section>;
}
```

Quand `<FriendList />` sera de nouveau exécuté, nous continuerons à ajouter `friends` à `items` à chaque exécution du composant, entraînant de multiples doublons dans le résultat. Cette version de `<FriendList />` a des effets de bord observables [lors du rendu](#how-does-react-run-your-code) et **enfreint la règle**.

#### Initialisation paresseuse {/*lazy-initialization*/}

L'initialisation paresseuse est elle aussi acceptable même si elle n'est pas parfaitement « pure » :

```js {2}
function ExpenseForm() {
  SuperCalculator.initializeIfNotReady(); // ✅ Correct (si elle n’affecte aucun autre composant)
  // Continue le rendu...
}
```

#### Modifications du DOM {/*changing-the-dom*/}

Les effets de bord qui sont directement visibles pour l'utilisateur ne sont pas autorisés au sein de la logique de rendu des composants React. En d'autres termes, appeler une fonction composant ne devrait pas, en soi, modifier l'affichage.

```js {2}
function ProductDetailPage({ product }) {
  document.title = product.title; // 🔴 Erroné : modifie le DOM
}
```

Une façon d'obtenir le résultat souhaité, à savoir mettre à jour `document.title` hors du rendu, consiste à [synchroniser le composant avec `document`](/learn/synchronizing-with-effects).

Tant que des appels multiples du composant restent fiables et n'affectent pas le rendu d'autres composants, React n'exige pas que le composant soit 100% pur au sens strict de la programmation fonctionnelle.  Il est plus important que les [composants soient idempotents](/reference/rules/components-and-hooks-must-be-pure).

---

## Les props et l'état sont immuables {/*props-and-state-are-immutable*/}

Les props et l'état d'un composant sont des [instantanés](learn/state-as-a-snapshot) immuables. Ne les mutez jamais directement. Passez plutôt de nouvelles props et appelez les fonctions de mise à jour fournies par `useState`.

Vous pouvez considérer les props et les valeurs d'état local comme des instantanés qui sont mis à jour après le rendu.  C'est pourquoi vous ne modifiez pas directement les props et variables d'état : vous passez plutôt de nouvelles props, et utilisez les fonctions de mise à jour fournies pour indiquer à React que l'état a besoin d'être mis à jour en vue du prochain rendu du composant.

<<<<<<< HEAD
### Ne modifiez pas directement les props {/*props*/}

Les props sont immuables parce que si vous les mutiez, l'application produirait un résultat incohérent qui serait difficile à déboguer, dans la mesure où il pourrait marcher ou non suivant les circonstances.
=======
### Don't mutate Props {/*props*/}
Props are immutable because if you mutate them, the application will produce inconsistent output, which can be hard to debug as it may or may not work depending on the circumstances.
>>>>>>> a1cc2ab4bf06b530f86a7049923c402baf86aca1

```js {expectedErrors: {'react-compiler': [2]}} {2}
function Post({ item }) {
  item.url = new Url(item.url, base); // 🔴 Erroné : ne mutez jamais directement les props
  return <Link url={item.url}>{item.title}</Link>;
}
```

```js {2}
function Post({ item }) {
  const url = new Url(item.url, base); // ✅ Correct : faites plutôt une copie
  return <Link url={url}>{item.title}</Link>;
}
```

### Ne modifiez pas directement les états locaux {/*state*/}

`useState` renvoie une variable d'état et une fonction de mise à jour pour cet état.

```js
const [stateVariable, setter] = useState(0);
```

Plutôt que de modifier directement la variable d'état, nous devons appeler la fonction de mise à jour renvoyée par son `useState`.  Modifier la valeur de la variable d'état n'entraîne pas de mise à jour du composant, laissant vos utilisateurs face à une UI obsolète.  Recourir aux fonctions de mise à jour permet d'informer React que l'état va changer, et qu'il doit planifier un nouveau rendu pour mettre à jour l'UI.

```js {expectedErrors: {'react-compiler': [2, 5]}} {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    count = count + 1; // 🔴 Erroné : ne mutez jamais directement l’état
  }

  return (
    <button onClick={handleClick}>
      Vous avez cliqué {count} fois
    </button>
  );
}
```

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // ✅ Correct : utilisez la fonction de mise à jour fournie par useState
  }

  return (
    <button onClick={handleClick}>
      Vous avez cliqué {count} fois
    </button>
  );
}
```

---

## Hooks : les arguments et valeurs renvoyées sont immuables {/*return-values-and-arguments-to-hooks-are-immutable*/}

Une fois que vous avez passé des valeurs à un Hook, vous ne devriez plus les modifier.  Tout comme les props en JSX, ces valeurs deviennent immuables une fois passées à un Hook.

```js {expectedErrors: {'react-compiler': [4]}} {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  if (icon.enabled) {
    icon.className = computeStyle(icon, theme); // 🔴 Erroné : ne mutez jamais directement vos arguments
  }
  return icon;
}
```

```js {3}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  const newIcon = { ...icon }; // ✅ Correct : faites plutôt une copie
  if (icon.enabled) {
    newIcon.className = computeStyle(icon, theme);
  }
  return newIcon;
}
```

Un principe important en React, c'est le _raisonnement local_ : la capacité à comprendre ce que fait un composant ou Hook rien qu'en regardant son propre code, en isolation.  Les Hooks devraient être traités comme des « boîtes noires » lorsqu'ils sont appelés.  Un Hook personnalisé pourrait par exemple utiliser ses arguments comme dépendances pour mémoïser des valeurs :

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);

  return useMemo(() => {
    const newIcon = { ...icon };
    if (icon.enabled) {
      newIcon.className = computeStyle(icon, theme);
    }
    return newIcon;
  }, [icon, theme]);
}
```

<<<<<<< HEAD
Si vous mutiez les arguments des Hooks, la mémoïsation du Hook personnalisé s'effrondrerait, il est donc important d'éviter ça.
=======
If you were to mutate the Hook's arguments, the custom hook's memoization will become incorrect,  so it's important to avoid doing that.
>>>>>>> a1cc2ab4bf06b530f86a7049923c402baf86aca1

```js {4}
style = useIconStyle(icon);         // `style` est mémoïsé sur base de `icon`
icon.enabled = false;               // Erroné : 🔴 ne mutez jamais directement les arguments
style = useIconStyle(icon);         // la mémoïsation précédente reste utilisée
```

```js {4}
style = useIconStyle(icon);         // `style` est mémoïsé sur base de `icon`
icon = { ...icon, enabled: false }; // Correct : ✅ faites plutôt une copie
style = useIconStyle(icon);         // la nouvelle valeur de `style` est bien calculée
```

Pour les mêmes raisons, il est important de ne pas modifier les valeurs renvoyées par les Hooks, puisqu'elles peuvent avoir été mémoïsées.

---

## Les valeurs sont immuables une fois passées à JSX {/*values-are-immutable-after-being-passed-to-jsx*/}

<<<<<<< HEAD
Ne mutez pas les valeurs que vous avez passées à JSX.  Déplacez la mutation en amont de la création du JSX.
=======
Don't mutate values after they've been used in JSX. Move the mutation to before the JSX is created.
>>>>>>> a1cc2ab4bf06b530f86a7049923c402baf86aca1

Lorsque vous utilisez du JSX dans une expression, React évalue le JSX avant que le composant ne termine son rendu.  Ça signifie que la mutation ultérieure de valeurs, après qu'elles ont été exploitées par JSX, peut produire des UI obsolètes, et React ne saura pas qu'il doit mettre à jour le résultat du composant.

```js {expectedErrors: {'react-compiler': [4]}} {4}
function Page({ colour }) {
  const styles = { colour, size: "large" };
  const header = <Header styles={styles} />;
  styles.size = "small"; // 🔴 Erroné : styles est déjà utilisé par le JSX ci-dessus
  const footer = <Footer styles={styles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```

```js {4}
function Page({ colour }) {
  const headerStyles = { colour, size: "large" };
  const header = <Header styles={headerStyles} />;
  const footerStyles = { colour, size: "small" }; // ✅ Correct : on a créé une valeur distincte
  const footer = <Footer styles={footerStyles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```
