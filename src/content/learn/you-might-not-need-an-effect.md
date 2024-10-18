---
title: 'Vous n’avez pas forcément besoin d’un Effet'
---

<Intro>

Les Effets sont une façon d’échapper au paradigme de React.  Ils vous permettent de « sortir » de React et de synchroniser vos composants avec un système extérieur tel qu’un widget écrit sans React, le réseau, ou le DOM du navigateur.  S’il n’y a pas de système extérieur dans l’histoire (par exemple, vous voulez juste mettre à jour l’état d’un composant lorsque ses props ou son état changent), vous ne devriez pas avoir besoin d’un Effet.  Retirer des Effets superflus rendra votre code plus simple à comprendre, plus performant, et moins sujet aux erreurs.

</Intro>

<YouWillLearn>

- Pourquoi et comment retirer les Effets superflus de vos composants
- Comment mettre en cache des calculs complexes sans Effet
- Comment réinitialiser ou modifier l’état de votre composant sans Effets
- Comment partager des traitements entre gestionnaires d’événements
- Quels traitements devraient être déplacés dans des gestionnaires d’événements
- Comment notifier des composants parents d’un changement

</YouWillLearn>

## Commment retirer les Effets superflus {/*how-to-remove-unnecessary-effects*/}

Il y a deux scénarios principaux pour lesquels vous n’avez pas besoin d’Effets :

- **Vous n’avez pas besoin d’Effets pour transformer des données utilisées par le rendu.**  Disons par exemple que vous souhaitez filtrer une liste avant de l’afficher.  Vous pourriez etre tenté·e d’écrire un Effet qui mette à jour une variable d’état lorsque la liste change.  C’est pourtant inefficace.  Lorsque vous mettez à jour l’état, React va d’abord appeler vos fonctions composants pour calculer ce qu’il doit afficher à l’écran.  Puis React va [retranscrire](/learn/render-and-commit) ces modifications auprès du DOM (_phase de “commit”, NdT)_, ce qui mettra l’écran à jour. Ensuite React exécutera vos Effets. Si votre Effet met immédiatement l’état à jour *lui aussi*, ça va tout refaire du début !  Pour éviter des passes de rendu superflues, transformez les données à la racine de vos composants.  Ce code sera automatiquement ré-exécuté dès que vos props ou votre état changera.
- **Vous n’avez pas besoin d’Effets pour gérer les événements utilisateurs.**  Supposons que vou souhaitez envoyer une requête POST à `/api/buy` et afficher une notification lorsque l’utilisateur achète un produit.  Dans le gestionnaire d’événement clic du bouton Acheter, vous savez précisément pourquoi vous êtes là.  Alors qu’au moment où l’Effet s’exécutera, vous ne saurez pas *ce qu’a fait* l’utilisateur (par exemple, quel bouton il a cliqué).  C’est pourquoi vous traiterez généralement les événements utilisateurs directement au sein des gestionnaires d’événements concernés.

En revanche, *vous avez besoin* d’Effets pour [synchroniser](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events) votre composant avec des systèmes extérieurs.  Par exemple, vous pouvez écrire un Effet qui synchronise un widget basé jQuery avec votre état React.  Vous pouvez aussi charger des données avec les Effets, par exemple pour synchroniser des résultats de recherche avec la requête à jour. Gardez toutefois à l’esprit que les [frameworks](/learn/start-a-new-react-project#production-grade-react-frameworks) modernes vous fournissent de base des mécanismes de chargement de données plus efficaces que si vous l’écrivez directement dans vos Effets.

Pour vous aider à affiner votre intuition sur ce sujet, examinons ensemble plusieurs cas concrets courants !

### Mettre à jour un état sur base des props ou d’un autre état {/*updating-state-based-on-props-or-state*/}

Supposons que vous ayez un composant avec deux variables d’état : `firstName` et `lastName`.  Vous souhaitez calculer `fullName` en les concaténant.  Par ailleurs, vous aimeriez que `fullName` soit mis à jour dès que `firstName` ou `lastName` change.  Votre première pensée serait peut-être d’ajouter une variable d’état `fullName` et de la mettre à jour dans un Effet :

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Clara');
  const [lastName, setLastName] = useState('Luciani');

  // 🔴 Évitez : état redondant et Effet superflu
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

C’est inutilement compliqué. Et c’est inefficace en prime : une passe entière de rendu est faite avec une valeur obsolète pour `fullName`, immédiatement suivie d’un nouveau rendu avec la valeur à jour.  Retirez cette variable d’état et l’Effet :

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Clara');
  const [lastName, setLastName] = useState('Luciani');
  // ✅ Correct : valeur calculée lors du rendu
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**Quand quelque chose peut être calculé à partir des props et variables d’état existantes, [ne le mettez pas dans l’état](/learn/choosing-the-state-structure#avoid-redundant-state). Au lieu de ça, calculez-le pendant le rendu.**  Ça rendra votre code plus performant (pas de mises à jour en cascade), plus simple (moins de code), et moins sujet à erreurs (on évite les bugs dus à la désynchronisation des variables d’état).  Si cette approche vous paraît nouvelle, [Penser en React](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state) vous explique ce qui devrait faire l’objet de variables d’état.

### Mettre en cache des calculs complexes {/*caching-expensive-calculations*/}

Le composant ci-après calcule `visibleTodos` en partant de sa prop `todos` et en la filtrant selon sa prop `filter`.  Vous pourriez être tenté·e de stocker le résultat dans l’état et de le mettre à jour depuis un Effet :

```js {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Évitez : état redondant et Effet superflu
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

Comme dans l’exemple précédent, ce code est à la fois superflu et inefficace.  Commencez par retirer la variable d’état et l’Effet :

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Ce code ira très bien si getFilteredTodos() est rapide.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

En général, ça ira très bien comme ça !  Mais peut-être que `getFilteredTodos()` est un peu lente, ou que vous avez *beaucoup* de tâches à filtrer.  Dans un tel cas, vous ne voudrez sans doute pas recalculer `getFilteredTodos()` lorsqu’une autre variable d’état telle que `newTodo` change.

Vous pouvez alors mettre en cache (ou [« mémoïser »](https://fr.wikipedia.org/wiki/M%C3%A9mo%C3%AFsation)) un calcul coûteux en l’enrobant dans un Hook [`useMemo`](/reference/react/useMemo) :

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ Ne se ré-exécute que si les tâches ou le filtre changent
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

Ou sur une seule ligne :

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Ne ré-exécute getFilteredTodos que si les tâches ou le filtre changent
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**Ça dit à React que vous ne souhaitez pas ré-exécuter la fonction imbriquée sauf si `todos` ou `filter` ont changé.**  React se souviendra de la valeur renvoyée par `getFilteredTodos()` au moment du rendu initial. Lors des rendus ultérieurs, il vérifiera si `todos` ou `filter` ont changé.  S’ils sont identiques à leurs valeurs du rendu précédent, `useMemo` renverra le dernier résultat qu’il avait stocké.  Mais si une différence survient, React rappellera la fonction imbriquée (et stockera le résultat).

La fonction que vous enrobez avec [`useMemo`](/reference/react/useMemo) s’exécute pendant le rendu, ça ne s’applique donc que pour [des fonctions de calcul pures](/learn/keeping-components-pure).

<DeepDive>

#### Comment savoir si un calcul est coûteux ? {/*how-to-tell-if-a-calculation-is-expensive*/}

En règle générale, à moins que vous ne créiez ou itériez à travers des milliers d’objets, ça n’est probablement pas coûteux.  Si vous avez besoin de vous rassurer, vous pouvez ajouter une mesure en console du temps passé dans ce bout de code :

```js {1,3}
console.time('filtrage tableau');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filtrage tableau');
```

Réalisez l’interaction à mesurer (par exemple, saisissez quelque chose dans un champ).  Vous verrez alors un message en console du genre `filtrage tableau: 0.15ms`.  Si le temps cumulé obtenu devient important (disons `1ms` ou plus), il peut être pertinent de mémoïser le calcul.  À titre d’expérience, vous pouvez enrober le calcul avec `useMemo` pour vérifier si le temps total mesuré s’est réduit ou non pour votre interaction :

```js
console.time('filtrage tableau');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // Sauté si todos et filter n’ont pas changé
}, [todos, filter]);
console.timeEnd('filtrage tableau');
```

`useMemo` n’accélèrera pas le *premier* rendu.  Il aide seulement à sauter un traitement superflu lors des mises à jour.

Gardez à l’esprit que votre machine est probablement plus rapide que celles de vos utilisateurs, il est donc recommandé de tester la performance au sein d’un ralentissement artificiel.  Par exemple, Chrome propose une option de [bridage processeur](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) exprès pour ça.

Remarquez aussi que mesurer la performance en développement ne vous donnera pas des résultats très précis. (Par exemple, quand le [Mode Strict](/reference/react/StrictMode) est actif, chaque composant fait deux rendus au lieu d’un.)  Pour améliorer la pertinence de vos mesures, construisez la version de production de votre appli et testez-la sur des appareils similaires à ceux de vos utilisateurs.

</DeepDive>

### Réinitialiser tout votre état quand une prop change {/*resetting-all-state-when-a-prop-changes*/}

Le composant `ProfilePage` ci-dessous reçoit une prop `userId`.  La page contient un champ de commentaire, et vous utilisez la variable d’état `comment` pour en stocker la valeur.  Un beau jour, vous remarquez un problème : quand vous passez d’un profil à l’autre, l’état `comment` n’est pas réinitialisé.  Du coup, il n’est que trop facile d’envoyer par accident un commentaire au mauvais profil utilisateur.  Pour corriger ça, vous essayez de vider la variable d’état `comment` chaque fois que `userId` change :

```js {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Évitez : réinitialiser un état sur base d'une prop dans un Effet
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

C’est balourd parce que `ProfilePage` et ses enfants vont d’abord faire un rendu basé sur la valeur obsolète, puis refaire un rendu.  C’est par ailleurs compliqué, parce qu’il faut le faire dans *chaque* composant qui utilise un état issu de `ProfilePage`.  Ainsi, si l’UI de commentaire est imbriquée, il faudra nettoyer l’état de commentaire imbriqué aussi.

La bonne alternative consiste à indiquer à React que chaque composant de profil *représente un profil différent*, en leur fournissant une clé explicite.  Découpez votre composant en deux et passez une prop `key` du composant externe au composant interne :

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ Toutes les variables d’état déclarées ici seront réinitialisées automatiquement
  // en cas de changement de clé.
  const [comment, setComment] = useState('');
  // ...
}
```

En temps normal, React préserve l’état lorsqu’un même composant fait son rendu au même endroit. **En passant `userId` comme `key` au composant `Profile`, vous demandez à React de traiter deux composants `Profile` de `userId` distincts comme ayant des états séparés.**  Dès que la `key` (que vous avez définie à `userId`) change, React recréera le DOM et [réinitialisera l’état](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) du composant `Profile` et de tous ses enfants. Désormais le champ `comment` se videra automatiquement quand vous passerez d’un profil à l’autre.

Remarquez que dans cet exemple, seul le composant externe `ProfilePage` est exporté et visible par les autres fichiers du projet.  Les composants qui exploitent `ProfilePage` n’ont pas besoin de lui passer une clé : ils passent `userId` comme une prop normale.  Le fait que `ProfilePage` le passe comme `key` à son composant interne `Profile` est un détail d’implémentation.

### Modifier une partie de l’état quand une prop change {/*adjusting-some-state-when-a-prop-changes*/}

Il arrive que vous souhaitiez ne réinitialiser, ou ajuster, qu’une partie de l’état quand une prop change (plutôt que l’état dans son intégralité).

Le composant `List` ci-après reçoit une liste d’éléments *via* sa prop `items`, et garde l’élément sélectionné dans sa variable d’état `selection`.  Vous souhaitez ramener `selection` à `null` chaque fois que `items` reçoit un nouveau tableau :

```js {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Évitez : ajustement d’état sur changement de prop dans un Effet
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

Ça non plus, ce n’est pas idéal.  Chaque fois que `items` change, le composant `List` et ses composants enfants commencent par calculer un rendu sur base d’une valeur obsolète de `selection`.  React met ensuite à jour le DOM et exécute les Effets.  Enfin, l’appel `setSelection(null)` cause un nouveau rendu de `List` et de ses enfants, relançant tout le processus.

Commencez par retirer l’Effet.  Ajustez plutôt l’état directement au sein du rendu :

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Mieux : ajustement de l’état au sein du rendu
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

[Stocker des infos issues de rendus précédents](/reference/react/useState#storing-information-from-previous-renders) de cette façon peut être difficile à comprendre, mais c’est toujours mieux que de faire la même mise à jour au sein d’un Effet.  Dans l’exemple ci-dessus, `setSelection` est appelée directement au sein du rendu.  React refera le rendu de `List` *immédiatement* après qu’il aura terminé au moyen de son instruction `return`.  React n’aura pas encore fait le rendu des composants enfants de `List`, et encore moins mis à jour le DOM, ce qui permet aux enfants de `List` d’éviter un rendu sur base d’une valeur obsolète de `selection`.

Quand vous mettez à jour un composant au sein de son rendu, React jette le JSX renvoyé et retente immédiatement un rendu.  Pour éviter des cascades désastreuses de tentatives, React ne vous permet de mettre à jour que l’état du *même* composant au sein d’un rendu.  Si vous tentez d’y mettre à jour l’état d’un autre composant, vous obtiendrez une erreur.  Une condition telle que `items !== prevItems` est nécessaire pour éviter les boucles.  Vous pouvez ajuster l’état ainsi, mais tout autre effet de bord (tel qu’une modification du DOM, ou la définition de timers) devrait rester dans des gestionnaires d’événements ou des Effets afin de [garder vos composants purs](/learn/keeping-components-pure).

**Même si cette approche est plus efficace qu’un Effet, la plupart des composants ne devraient pas en avoir besoin non plus.** Peu importe comment vous vous y prenez, ajuster l’état sur base des props ou d’un autre état rend votre flux de données plus difficile à comprendre et à déboguer.  Vérifiez toujours si vous ne pourriez pas plutôt [réinitialiser tout votre état à l’aide d’une clé](#resetting-all-state-when-a-prop-changes) ou [tout calculer pendant le rendu](#updating-state-based-on-props-or-state). Par exemple, au lieu de stocker (et réinitialiser) *l’élément* sélectionné, vous pourriez stocker *son ID* :

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Nickel : on calcule tout au moment du rendu
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

À présent, plus du tout besoin « d’ajuster » l’état.  Si l’élément correspondant à l’ID est dans la liste, il restera sélectionné. S’il n’y est pas, la `selection` calculée pendant le rendu sera `null` faute de correspondance trouvée.  Le comportement est différent, mais on pourrait même dire qu’il est meilleur, car la plupart des changements de `items` préserveront la sélection.

### Partager des traitements entre gestionnaires d’événements {/*sharing-logic-between-event-handlers*/}

Disons que vous avez une page produit avec deux boutons (Acheter et Payer), qui tous les deux vous permettent d’acheter le produit.  Vous voulez afficher une notification lorsque l’utilisateur ajoute le produit au panier.  Appeler `showNotification()` dans les gestionnaires de clics des deux boutons semble répétitif, et vous êtes tenté·e de centraliser ce comportement dans un Effet :

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 Évitez : comportement lié à un événement dans un Effet
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Vous avez ajouté ${product.name} au panier !`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

Cet Effet est superflu. Il causera par ailleurs sans doute des bugs.  Par exemple, disons que votre appli « se souvient » du panier à travers le rechargement de la page.  Si vous ajoutez un produit au panier puis rafraîchissez la page, la notification réapparaîtra.  Elle recommencera à chaque rafraîchissement de la page produit.  C’est parce que `product.isInCart` sera déjà à `true` au chargement de la page, donc l'Effet ci-dessus appellera `showNotification()`.

**Quand vous ne savez pas trop si du code devrait être dans un Effet ou un gestionnaire d’événement, demandez-vous *pourquoi* ce code a besoin de s’exécuter.  Utilisez les Effets uniquement pour du code qui devrait s’exécuter *parce que* le composant a été affiché à l’utilisateur.**  Dans notre exemple, la notification devrait apparaître parce que l’utilisateur *a pressé un bouton*, pas parce que la page s’affiche !  Supprimez l’Effet et mettez le traitement partagé dans une fonction appelée depuis les deux gestionnaires d’événements :

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ Correct : comportement lié à un événement dans un gestionnaire d’événement
  function buyProduct() {
    addToCart(product);
    showNotification(`Vous avez ajouté ${product.name} au panier !`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

Non seulement ça retire un Effet superflu, mais ça corrige le bug au passage.

### Envoyer une requête POST {/*sending-a-post-request*/}

Ce composant `Form` envoie deux types de requêtes POST.  Il envoie un événement analytique au moment du montage.  Et lorsque vous remplissez les champs et cliquez sur le bouton Envoyer, il envoie une requête POST au point d’accès `/api/register` :

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Correct : ce traitement devrait s’exécuter à l’affichage initial
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Évitez : traitement lié à un événement dans un Effet
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

Appliquons les mêmes critères que pour l’exemple précédent.

La requête POST analytique devrait rester dans un Effet. En effet (ah ah), la *raison* de notre événement analytique, c’est justement le fait que le formulaire ait été affiché. (Ça s’exécuterait deux fois en développement, mais [voyez comment gérer cet aspect](/learn/synchronizing-with-effects#sending-analytics)).

En revanche, la requête POST à `/api/register` n’est pas due à *l’affichage* du formulaire.  On veut seulement envoyer cette requête pour une raison précise : quand l’utilisateur appuie sur le bouton.  Ça ne devrait arriver que *suite à cette interaction spécifique*.  Supprimez le deuxième Effet et déplacez la requête POST dans le gestionnaire d’événement :

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Correct : ce traitement devrait s’exécuter à l’affichage initial
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
  // ✅ Correct : traitement lié à un événement dans le gestionnaire d’événement
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

Quand vous décidez si vous placez un traitement dans un gestionnaire d’événement ou dans un Effet, la question principale doit être *de quel type de traitement s’agit-il* du point de vue utilisateur.  Si ça fait suite à une interaction spécifique, gardez-le dans un gestionnaire d’événement. Si c’est dû au fait que l’utilisateur *voit* le composant à l’écran, gardez-le dans un Effet.

### Chaînes de calculs {/*chains-of-computations*/}

Peut-être chaînez-vous parfois les Effets pour que chacun ajuste une partie spécifique de l’état, sur base d’autres parties de l’état :

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Évitez : chaînes d’Effets pour ajuster des bouts d’état de façon interdépendante
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Belle partie !');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('La partie est déjà terminée.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

Ce code pose deux problèmes.

Le premier problème est qu’il est très inefficace : le composant (et ses enfants) doivent refaire un rendu entre chaque appel `set` de la chaîne.  Dans l’exemple ci-dessus, dans le pire des cas (`setCard` → rendu → `setGoldCardCount` → rendu → `setRound` → rendu → `setIsGameOver` → rendu) on a pas moins de trois rendus superflus de l’arbre au sein du composant.

Le second problème vient du fait que même si ce n’était pas lent, au fil de l’évolution de votre code, vous tomberez sur des cas où la « chaîne » que vous avez construite ne correspond plus aux nouvelles spécifications.  Imaginez que vous ajoutiez un moyen de naviguer au sein de l’historique des mouvements de la partie.  Pour ce faire, vous devriez mettre à jour chaque variable d’état sur base d’une valeur passée.  Seulement voilà, redéfinir `card` à une valeur passée déclencherait à nouveau la chaîne d’Effets et modifierait la donnée affichée.  Ce genre de code est souvent rigide et fragile.

Dans un tel cas, il vaut largement mieux calculer tout ce qu’on peut pendant le rendu, et ajuster l’état au sein d’un gestionnaire d’événement :

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Calculer tout ce qu’on peut au sein du rendu
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('La partie est déjà terminée.');
    }

    // ✅ Calculer le prochain état dans le gestionnaire d’événement
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Belle partie !');
        }
      }
    }
  }

  // ...
```

Ce code est beaucoup plus performant.  Par ailleurs, si vous deviez implémenter une façon de consulter l’historique du jeu, vous pourriez désormais ramener chaque variable d’état à des valeurs passées sans déclencher une chaîne d’Effets qui écraserait d’autres valeurs.  Si vous devez réutiliser des traitements dans plusieurs gestionnaires d’événements, vous pouvez [extraire une fonction](#sharing-logic-between-event-handlers) et l’appeler depuis ces gestionnaires.

Souvenez-vous qu’au sein des gestionnaires d’événements, [l’état se comporte comme une photo instantanée](/learn/state-as-a-snapshot).  Par exemple, même après avoir appelé `setRound(round + 1)`, la variable `round` continue à refléter la valeur au moment où l’utilisateur avait cliqué sur le bouton.  Si vous avez besoin de la prochaine valeur pour vos calculs, définissez-la manuellement comme dans `const nextRound = round + 1`.

Il peut arriver que vous *ne puissiez pas* calculer le prochain état directement depuis le gestionnaire d’événement. Imaginez par exemple un formulaire avec de nombreuses listes déroulantes, où les options de la liste suivante dépendent de la valeur de la liste précédente.  Dans un tel cas, une chaîne d’Effets serait pertinente, parce que vous synchronisez votre composant avec le réseau.

### Initialiser l’application {/*initializing-the-application*/}

Certains traitements ne devraient s’exécuter qu’une fois, au démarrage de l’appli.

Il pourrait être tentant de les placer dans un Effet du composant racine :

```js {2-6}
function App() {
  // 🔴 Évitez : Effet avec un traitement à usage unique
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

Pourtant vous réaliserez rapidement qu’il [s’exécutera deux fois en développement](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development). Ça peut causer divers problèmes--peut-être y invalidez-vous le jeton d’authentification parce que la fonction n’a pas été conçue pour être appelée deux fois.  En général, vos composants devraient résister à un deuxième montage, y compris votre composant racine `App`.

Même s’il ne sera sans doute jamais remonté en pratique en production, y respecter les mêmes contraintes que pour tous vos composants facilitera la refonte du code.  Si un traitement doit s’exécuter *une fois par chargement de l’appli* plutôt qu’*une fois par montage du composant*, ajoutez une variable racine pour déterminer si il a déjà été exécuté :

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Ne s’exécute qu’une fois par chargement applicatif
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

Vous pouvez aussi l’exécuter à l’initialisation du module, avant que l’appli n’entame son rendu :

```js {1,5}
if (typeof window !== 'undefined') { // Vérifie qu’on est dans un navigateur.
  // ✅ Ne s’exécute qu’une fois par chargement applicatif
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Le code au niveau racine s’exécute une fois au moment de l’import du composant--même si ce dernier n’est au final jamais exploité.  Pour éviter les ralentissements ou comportements surprenants à l’import de composants quelconques, n’abusez pas de cette approche.  Centralisez les traitements d’initialisation applicative dans les modules du composant racine tels que `App.js` ou dans le point d’entrée de l’application.

### Notifier des composants parents d’un changement {/*notifying-parent-components-about-state-changes*/}

Imaginons que vous écriviez un composant `Toggle` avec un état interne `isOn` qui peut être `true` ou `false`.  Il y a plusieurs façons de le faire basculer (en cliquant dessus ou en le faisant glisser).  Vous souhaitez notifier le composant parent chaque fois que l’état interne du `Toggle` change, du coup vous exposez un événement `onChange` que vous appelez depuis un Effet :

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 À éviter : le gestionnaire onChange est appelé trop tard
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

Comme précédemment, ce n’est pas idéal. Le `Toggle` met d’abord à jour son état, puis React rafraîchit l’affichage.  Ensuite seulement React exécute l’Effet, qui appelle la fonction `onChange` passée par le composant parent.  C’est au tour de celui-ci de mettre à jour son propre état, ce qui déclenche une nouvelle passe de rendu.  Il serait préférable que tout soit fait en une seule passe.

Retirez l’Effet et mettez plutôt à jour l’état des *deux* composants au sein du même gestionnaire d’événement :

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Correct : on réalise toutes les mises à jour en traitant l’événement déclencheur
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

Avec cette approche, tant le composant `Toggle` que son parent mettent à jour leurs états lors de la gestion de l’événement.  React [regroupe les mises à jour](/learn/queueing-a-series-of-state-updates) issues de différents composants, de sorte qu’on ne fait qu’une passe de rendu.

Peut-être même pouvez-vous carrément retirer l’état, et recevoir `isOn` depuis votre composant parent :

```js {1,2}
// ✅ Valable aussi : le composant est entièrement contrôlé par son parent
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

[« Faire remonter l’état »](/learn/sharing-state-between-components) permet au composant parent de pleinement contrôler le `Toggle` au moyen de l’état propre au parent.  Certes, le composant parent devra contenir davantage de logique, mais vous aurez aussi moins de variables d’état à gérer au final.  Chaque fois que vous vous retrouvez à tenter de synchroniser plusieurs variables d’état, voyez si vous ne pouvez pas plutôt faire remonter l’état !

### Passer des données au parent {/*passing-data-to-the-parent*/}

Le composant `Child` charge des données et les passe au composant `Parent` au sein d’un Effet :

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 À éviter : passer des données au parent depuis un Effet
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

Dans React, les données circulent des composants parents vers leurs enfants.  Quand vous remarquez une erreur à l’écran, vous pouvez pister l’information jusqu’à sa source en remontant la chaîne des composants jusqu’à trouver celui qui a passé la mauvaise valeur de prop ou qui contient une variable d’état erronée.  Lorsque des composants enfants mettent à jour l’état de leurs composants parents au sein d’Effets, le flux de données devient très difficile à suivre.  Puisque l’enfant comme le parent ont besoin des mêmes données, laissez plutôt le parent charger celles-ci puis *passez-les* à l’enfant :

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Correct : passer les données à l’enfant
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

C’est plus simple et ça rend le flux de données plus prévisible : les données descendent du parent vers l’enfant.

### S’abonner à une source de données extérieure {/*subscribing-to-an-external-store*/}

Il arrive que vos composants aient besoin de s’abonner à une source de données extérieure, hors des états React.  Elles pourraient provenir d’une bibliothèque tierce ou d’une API du navigateur.  Dans la mesure où ces données sont susceptibles d’évoluer sans que React le sache, vous devez manuellement y abonner vos composants.  C’est le plus souvent fait au sein d’un Effet, comme dans cet exemple :

```js {2-17}
function useOnlineStatus() {
  // Pas idéal : abonnement manuel au sein d’un Effet
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Dans ce code, le composant s’abonne à une source de données extérieure (dans ce cas précis, l’API `navigator.onLine` du navigateur).  Dans la mesure où cette API n’existe pas côté serveur (et ne peut donc pas être utilisée pour le HTML initial), l’état est initialisé à `true`.  Dès que cette donnée change dans le navigateur, le composant met à jour son état.

Bien qu’il soit courant de recourir aux Effets dans ce type de cas, React a un Hook sur-mesure pour les abonnements à des sources extérieures de données, que vous devriez alors employer.  Retirez l’Effet et remplacez-le par un appel à [`useSyncExternalStore`](/reference/react/useSyncExternalStore):

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Correct : abonnement à une source de données tierce via un Hook pré-fourni
  return useSyncExternalStore(
    subscribe, // React ne se réabonnera pas tant que cette fonction ne changera pas
    () => navigator.onLine, // Lecture de la valeur côté client
    () => true // Lecture de la valeur côté serveur
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Cette approche pose moins de problèmes que la synchronisation manuelle d’un état React avec des données variables au sein d’un Effet.  Habituellement, vous écrirez un Hook personnalisé tel que le `useOnlineStatus()` ci-avant afin de ne pas avoir à répéter ce code d’un composant à l’autre. [En savoir plus sur l’abonnement à des sources de données extérieures depuis des composants React](/reference/react/useSyncExternalStore).

### Charger des données {/*fetching-data*/}

De nombreuses applis utilisent des Effets pour lancer un chargement de données.  Ce type de scénario ressemble à ça :

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 À éviter : chargement sans code de nettoyage
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

Vous n’avez *pas besoin* de déplacer ce chargement dans un gestionnaire d’événement.

Ça peut sembler contradictoire avec les exemples vus jusqu’ici, qui nous enjoignaient de déplacer la logique dans des gestionnaires d’événements !  Ceci dit, gardez à l’esprit que *l’événement de saisie clavier* n’est pas ici la cause principale du chargement.  Les champs de recherche sont souvent pré-remplis à partir de l’URL, et l’utilisateur pourrait très bien naviguer d’avant en arrière sans toucher au champ.

Peu importe d’où viennent `page` et `query`.  Lorsque ce composant est affiché, vous voulez garantir que `results` reste [synchronisé](/learn/synchronizing-with-effects) avec les données fournies par le réseau pour les `page` et `query` actuelles. Voilà pourquoi c’est un Effet.

Néanmoins, le code ci-avant a un bug.  Supposons que vous tapiez  `"hello"` rapidement.  Ça modifierait successivement `query` de `"h"` à `"he"`, `"hel"`, `"hell"`, et enfin `"hello"`.  Ça déclencherait à chaque fois un chargement dédié, mais on n’a aucune garantie que les réponses réseau arriveront dans le bon ordre.  Par exemple, la réponse pour `"hell"` pourrait arriver *après* la réponse pour `"hello"`.  Comme elle appellera `setResults()` en dernier, on affichera les mauvais résultats de recherche… un bug d’enfer.  Ce scénario s’appelle une *[“race condition”](https://fr.wikipedia.org/wiki/Situation_de_comp%C3%A9tition)* : deux requêtes distinctes ont « fait la course » l’une contre l’autre et sont arrivées dans un ordre différent de celui attendu.

**Pour corriger cette _race condition_, [ajoutez une fonction de nettoyage](/learn/synchronizing-with-effects#fetching-data) pour ignorer les réponses périmées :**

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

Ça garantit que lorsque votre Effet charge des données, toutes les réponses hormis la dernière sont ignorées.

La gestion des *race conditions* n’est d’ailleurs pas la seule difficulté lorsqu’on implémente un chargement de données.  Vous aurez peut-être à vous préoccuper de la mise en cache des données (afin qu’en naviguant en arrière vos utilisateurs retrouvent instantanément l’écran précédent), de leur chargement côté serveur (pour que le HTML initial fourni par le serveur contienne déjà les données plutôt qu’un indicateur de chargement), et d’éviter les cascades réseau (afin qu’un composant enfant puisse charger ses données sans devoir attendre que chaque parent ait fini ses chargements).

**Ces problématiques existent dans toutes les bibliothèques d’UI, pas seulement dans React.  Leur résolution n’est pas chose aisée, c’est pourquoi les [frameworks](/learn/start-a-new-react-project#production-grade-react-frameworks) modernes fournissent des mécanismes intégrés de chargement de données plus efficaces que du chargement manuel au sein d’Effets.**

Si vous n’utilisez pas de framework (et ne voulez pas créer le vôtre) mais aimeriez quand même améliorer l’ergonomie du chargement de données depuis des Effets, envisagez d’extraire votre logique de chargement dans un Hook personnalisé, comme dans l’exemple que voici :

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

Vous voudrez sans doute y ajouter de la logique de gestion d’erreur et de suivi de progression du chargement.  Vous pouvez construire un Hook de ce type vous-même, ou utiliser une des nombreuses solutions déjà disponibles dans l’écosystème React. **Même si cette approche ne sera pas aussi efficace que le recours aux mécanismes de chargement intégrés d’un framework, déplacer la logique de chargement dans un Hook personnalisé facilitera l’adoption ultérieure d’une stratégie de chargement performante.**

De façon générale, dès que vous devez recourir à des Effets, gardez un œil sur les opportunités d’extraction de bouts de fonctionnalités vers des Hooks personnalisés, afin de proposer une API plus déclarative et orientée métier telle que le `useData` ci-avant.  Moins vos composants auront d’appels `useEffect` directs, plus il sera facile de maintenir votre application.

<Recap>

- Si vous pouvez calculer quelque chose au sein du rendu, vous n’avez pas besoin d’un Effet.
- Pour mettre en cache des calculs coûteux, utilisez `useMemo` plutôt que `useEffect`.
- Pour réinitialiser l’intégralité de l’état d’un arbre de composants, passez-lui une `key` différente.
- Pour réinitialiser juste une partie de l’état suite à un changement de prop, modifiez-la au sein du rendu.
- Si du code doit être déclenché simplement en raison du *rendu*, il peut être dans un Effet ; le reste devrait être lié à des événements.
- Si vous devez mettre à jour l’état de plusieurs composants, regroupez ces modifications dans un seul gestionnaire d’événement.
- Chaque fois que vous vous retrouvez à devoir synchroniser l’état de plusieurs composants, essayez plutôt de faire remonter l’état.
- Vous pouvez charger des données dans les Effets, mais vous devrez implémenter une fonction de nettoyage pour éviter les *race conditions*.

</Recap>

<Challenges>

#### Transformer les données sans Effet {/*transform-data-without-effects*/}

La `TodoList` ci-après affiche une liste de tâches.  Lorsque la case à cocher « Seulement les tâches à faire » est cochée, les tâches terminées ne figurent pas dans la liste.  Indépendamment des tâches affichées, le pied de page affiche le nombre de tâches qui restent à effectuer.

Simplifiez ce composant en retirant les variables d'état et Effets superflus.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} tâches à faire
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Seulement les tâches à faire
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Ajouter
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Acheter des pommes', true),
  createTodo('Acheter des oranges', true),
  createTodo('Acheter des carottes'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

Si vous pouvez calculer quelque chose au sein du rendu, vous n’avez besoin ni d’un état ni d’un Effet pour le tenir à jour.

</Hint>

<Solution>

Cet exemple ne comprend que deux éléments d’état essentiels : la liste des tâches `todos` et la variable d’état `showActive` qui représente l’état de la case à cocher.  Toutes les autres variables d’état sont [redondantes](/learn/choosing-the-state-structure#avoid-redundant-state) et devraient plutôt être calculées lors du rendu, y compris le `footer` qui peut être directement mis au sein du JSX principal.

Votre résultat devrait ressembler à ceci :

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Seulement les tâches à faire
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} tâches à faire
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Ajouter
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Acheter des pommes', true),
  createTodo('Acheter des oranges', true),
  createTodo('Acheter des carottes'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Mettre en cache un calcul sans Effets {/*cache-a-calculation-without-effects*/}

Dans cet exemple, on a extrait le filtrage des tâches dans une fonction dédiée appelée `getVisibleTodos()`.  Cette fonction contient un appel à `console.log()` qui nous permet de savoir qu’elle est appelée.  Basculez le réglage « Seulement les tâches à faire » et remarquez que la fonction `getVisibleTodos()` est appelée à nouveau.  C’est normal, puisque les tâches visibles changent selon le réglage choisi.

Votre objectif est de retirer l’Effet qui recalcule la liste `visibleTodos` dans le composant `TodoList`.  Cependant, vous devrez vous assurer que `getVisibleTodos()` n’est *pas* appelée à nouveau (et donc n’affiche rien dans la console) lorsque vous saisissez un intitulé de tâche.

<Hint>

Une solution serait d’ajouter un `useMemo` pour mettre en cache les tâches visibles.  Il existe toutefois une autre solution, moins évidente.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Seulement les tâches à faire
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Ajouter
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() a été appelée ${++calls} fois`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Acheter des pommes', true),
  createTodo('Acheter des oranges', true),
  createTodo('Acheter des carottes'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

Retirez la variable d’état ainsi que l’Effet, et ajoutez plutôt un appel à `useMemo` pour mettre en cache le résultat de l’appel à la fonction `getVisibleTodos()` :

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Seulement les tâches à faire
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Ajouter
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() a été appelée ${++calls} fois`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Acheter des pommes', true),
  createTodo('Acheter des oranges', true),
  createTodo('Acheter des carottes'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

Grâce à cette modification, `getVisibleTodos()` ne sera appelée que lorsque `todos` ou `showActive` change.  La saisie dans le champ ne modifie que la variable d’état `text`, et donc ne déclenche pas d’appel à `getVisibleTodos()`.

Il existe une autre solution qui n’a pas besoin de `useMemo`.  Dans la mesure où la variable d’état `text` ne peut en aucun cas affecter la liste des tâches, vous pouvez extraire le formulaire dans un composant `NewTodo` distinct, en y déplaçant cette variable d’état :

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Seulement les tâches à faire
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Ajouter
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() a été appelée ${++calls} fois`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Acheter des pommes', true),
  createTodo('Acheter des oranges', true),
  createTodo('Acheter des carottes'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

Cette approche satisfait elle aussi nos critères.  Lorsque vous saisissez une valeur dans le champ, seule la variable d’état `text` est mise à jour.  Puisqu’elle réside dans la composant enfant `NewTodo`, elle n’entraîne pas un nouveau rendu du composant parent `TodoList`. C’est pour ça que `getVisibleTodos()` n’est pas rappelée lors de la saisie. (Elle le serait tout de même si `TodoList` refaisait un rendu pour une autre raison.)

</Solution>

#### Réinitialiser l’état sans Effet {/*reset-state-without-effects*/}

Ce composant `EditContact` reçoit un objet contact de forme `{ id, name, email }` *via* sa prop `savedContact`. Essayez de modifier les champs de nom et d’e-mail.  Lorsque vous appuyez sur Enregistrer, le bouton du contact situé au-dessus est mis à jour avec le nouveau nom.  Lorsque vous appuyez sur Réinitialiser, toute modification en cours dans le formulaire est abandonnée.  Prenez un moment pour manipuler cette interface afin d’en saisir le fonctionnement.

Lorsque vous sélectionnez un contact au moyen des boutons du haut, le formulaire est réinitialisé pour refléter les détails de ce contact.  C’est implémenté au moyen d’un Effet dans `EditContact.js`.  Retirez cet Effet, et trouvez une autre façon de réinitaliser l’état du formulaire lorsque `savedContact.id` change.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Clara', email: 'Clara@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Nom :{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        E-mail :{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Enregistrer
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Réinitialiser
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

Ce serait chouette s’il y avait un moyen de dire à React que lorsque `savedContact.id` est différent, le formulaire `EditContact` est conceptuellement un *formulaire de contact différent* et ne devrait donc pas préserver son état.  Vous souvenez-vous d’un tel moyen ?

</Hint>

<Solution>

Découpez le composant `EditContact` en deux.  Déplacez tout l’état du formulaire dans le composant interne `EditForm`.  Exportez le composant principal `EditContact` et faites-lui passer `savedContact.id` comme `key` au composant interne `EditForm`.  Grâce à ça, le composant interne `EditForm` réinitialisera tout son état de formulaire et recréera le DOM chaque fois que vous choisissez un contact différent.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Clara', email: 'Clara@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Nom :{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        E-mail :{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Enregistrer
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Réinitialiser
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Envoyer un formulaire sans Effet {/*submit-a-form-without-effects*/}

Ce composant `Form` vous permet d’envoyer un message à un ami.  Lorsque vous validez le formulaire, la variable d’état `showForm` est mise à `false`, ce qui déclenche un Effet qui appelle `sendMessage(message)`, envoyant le message (vous pouvez le voir en console).  Une fois le message envoyé, vous voyez un message « Merci » avec un bouton « Ouvrir la discussion » qui vous permet de revenir au formulaire.

Les utilisateurs de votre appli envoient beaucoup trop de messages.  Pour rendre la discussion un peu plus difficile, vous avez décidé d’afficher le message « Merci » *en premier* plutôt que le formulaire.  Modifiez la variable d’état `showForm` pour l’initialiser à `false` plutôt qu’à `true`.  Dès que vous ferez ce changement, la console affichera qu’un message vide a été envoyé.  Quelque chose dans la logique du code va de travers !

Quelle est la cause racine de ce problème ?  Comment pouvez-vous le corriger ?

<Hint>

Le message devrait-il être envoyé *parce que* l’utilisateur a vu le message « Merci  ? Ou est-ce plutôt l’inverse ?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Merci pour votre confiance !</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Ouvrir la discussion
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Envoyer
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Envoi du message : ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

La variable d’état `showForm` détermine s’il faut afficher le formulaire ou le message de remerciement.  Seulement voilà, vous n’envoyez pas le message simplement parce que le message *est affiché*.  Vous souhaitez envoyer le message parce que l’utilisateur a *soumis le formulaire*.  Retirez cet Effet trompeur et déplacez l’appel à `sendMessage` dans le gestionnaire d’événement `handleSubmit` :

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Merci pour votre confiance !</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Ouvrir la discussion
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Envoyer
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Envoi du message : ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Remarquez que dans cette version, seule *la soumission du formulaire* (qui est un événement) cause l’envoi du message.  Ça fonctionne peu importe la valeur initiale de `showForm` : `true` ou `false`. (Mettez-la à `false` et remarquez l’absence de message superflu en console.)

</Solution>

</Challenges>
