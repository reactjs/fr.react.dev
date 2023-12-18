---
title: 'Alléger les dépendances des Effets'
---

<Intro>

Lorsque vous écrivez un Effet, le *linter* vérifiera que vous avez bien inclus, dans les dépendances de l’Effet, chaque valeur réactive (telle que des props ou variables d’état) que l’Effet lit.  Ça garantit que votre Effet reste synchronisé avec les props et variables d’état les plus récentes de votre composant.  Les dépendances superflues peuvent toutefois entraîner des exécutions trop fréquentes de votre Effet, voire créer une boucle de rendus infinie.  Ce guide vous apprend à évaluer la pertinence des dépendances de vos Effets et à retirer celles qui s'avèrent superflues.

</Intro>

<YouWillLearn>

- Comment corriger des boucles infinies dues aux dépendances des Effets
- Que faire lorsque vous souhaitez retirer une dépendance
- Comment lire une valeur depuis un Effet sans « réagir » à ses changements
- Comment et pourquoi éviter des dépendances sur objets ou fonctions
- Pourquoi retirer le *linter* de dépendances est dangereux, et quelle alternative préférer

</YouWillLearn>

## Les dépendances devraient refléter votre code {/*dependencies-should-match-the-code*/}

Quand vous écrivez un Effet, vous commencez par indiquer comment [démarrer et arrêter](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) le traitement que l'Effet est censé gérer :

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

Ensuite, si vous laissez le tableau de dépendances vide (`[]`), le *linter* vous suggèrera automatiquement les dépendances appropriées :

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Corrigez l’erreur ici !
  return <h1>Bienvenue dans le salon {roomId} !</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choisissez le salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">général</option>
          <option value="travel">voyage</option>
          <option value="music">musique</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Remplissez-les en fonction de ce que le *linter* vous dit :

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Toutes les dépendances sont déclarées
  // ...
}
```

[Les Effets « réagissent » aux valeurs réactives](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values). Puisque `roomId` est une valeur réactive (elle peut changer suite à un nouveau rendu), le *linter* vérifie que vous l'avez précisée dans les dépendances. Si `roomId` reçoit une valeur différente, React resynchronisera votre Effet. Ça garantit que l'appli reste connectée au bon salon de discussion et « réagit » à la liste déroulante :

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  return <h1>Bienvenue dans le salon {roomId} !</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choisissez le salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">général</option>
          <option value="travel">voyage</option>
          <option value="music">musique</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

### Pour retirer une dépendance, prouvez qu'elle n'en est pas une {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

Notez que vous ne pouvez pas « choisir » les dépendances de votre Effet. Chaque <CodeStep step={2}>valeur réactive</CodeStep> utilisée par le code de votre Effet doit être déclarée dans votre liste de dépendances, qui découle donc du code environnant :

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // C’est une valeur réactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Cet Effet lit la valeur réactive
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Vous devez donc lister la valeur réactive comme dépendance de votre Effet
  // ...
}
```

[Les valeurs réactives](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) comprennent les props et toutes les variables et fonctions déclarées directement au sein de votre composant. Dans la mesure où `roomId` est une valeur réactive, vous ne pouvez pas la retirer de la liste des dépendances. Le *linter* vous l'interdirait :

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 “React Hook useEffect has a missing dependency: 'roomId'”
  // ...
}
```

Et le *linter* aurait raison ! Puisque `roomId` est susceptible de changer avec le temps, omettre la dépendance introduirait un bug dans votre code.

**Pour retirer une dépendance, « prouvez » au *linter* qu'elle n'a *pas besoin* d'être une dépendance.**  Par exemple, vous pouvez déplacer `roomId` hors de votre composant pour lui prouver qu'elle n'est pas réactive et ne changera pas d'un rendu à l'autre :

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // Ce n’est plus une valeur réactive

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Toutes les dépendances sont déclarées
  // ...
}
```

À présent que `roomId` n'est plus une valeur réactive (et ne peut plus changer d'un rendu à l'autre), elle n'a plus besoin d'être déclarée comme dépendance :

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Bienvenue dans le salon {roomId} !</h1>;
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Voilà pourquoi vous pouvez désormais spécifier une [liste de dépendances vide (`[]`)](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means). Votre Effet *ne dépend effectivement plus* de quelque valeur réactive que ce soit, donc *il n'a effectivement plus besoin* d'être ré-exécuté lorsque des props ou variables d'état de votre composant changent.

### Pour changer les dépendances, changez le code {/*to-change-the-dependencies-change-the-code*/}

Vous avez peut-être remarqué un motif récurrent dans votre façon de travailler :

1. Pour commencer, vous **modifiez le code** de votre Effet, ou la façon dont les valeurs réactives sont déclarées.
2. Ensuite, vous suivez les recommandations du *linter* et ajustez les dépendances pour **correspondre à vos changements de code**.
3. Lorsque la liste des dépendances vous déplaît, vous **revenez à la première étape** (et recommencez à changer le code).

Ce dernier point est important. **Si vous voulez changer les dépendances, changez d'abord le code environnant.** Vous pouvez assimiler la liste de dépendances à [une liste de toutes les valeurs réactives utilisées par le code de votre Effet](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency). Vous ne *choisissez* pas ce que vous y mettez. La liste *décrit* votre code. Pour changer la liste des dépendances, changez le code.

Ça peut faire penser à la résolution d'une équation.  Vous pourriez commencer par un objectif (par exemple, retirer telle ou telle dépendance), et devoir alors « trouver » le code qui correspond à cet objectif.  Certes, tout le monde n'aime pas les équations, et il en va de même pour l'écriture des Effets !  Heureusement, voici une liste de recettes éprouvées que vous pouvez essayer.

<Pitfall>

Si vous avez une base de code existante, vous trouverez peut-être des Effets qui réduisent le *linter* au silence comme ceci :

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Évitez de réduire ainsi le *linter* au silence :
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Lorsque les dépendances ne correspondent pas au code, il y a un risque élevé de bugs.**  En réduisant le *linter* au silence, vous « mentez » à React quant aux valeurs dont dépend votre Effet.

Utilisez plutôt les techniques qui suivent.

</Pitfall>

<DeepDive>

#### Pourquoi est-il dangereux de réduire le *linter* des dépendances au silence ? {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

Mettre le *linter* en sourdine entraîne des bugs surprenants qui sont difficiles à découvrir et à corriger.  Voici un exemple :

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
    setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Compteur : {count}
        <button onClick={() => setCount(0)}>Réinitialiser</button>
      </h1>
      <hr />
      <p>
        À chaque seconde, incrémenter de :
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Disons que vous souhaitiez que cet Effet ne s’exécute « qu'au montage ». Vous avez lu qu'un [tableau de dépendances vide (`[]`)](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) permettait ça, aussi vous avez décidé d'ignorer le *linter*, et avez forcé les dépendances à `[]`.

Ce compteur était censé s'incrémenter chaque seconde de la quantité configurée *via* les deux boutons. Et pourtant, puisque vous avez « menti » à React en lui disant que cet Effet ne dépendait de rien, React continuera éternellement à utiliser la fonction `onTick` du rendu initial. [Pendant ce rendu](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time), `count` valait `0` et `increment` était à `1`. C'est pourquoi la `onTick` de ce rendu appelle systématiquement `setCount(0 + 1)` chaque seconde, et vous obtenez donc toujours `1`.  Ce type de bugs est encore plus délicat à corriger lorsqu'il impacte plusieurs composants.

Ignorer le *linter* n'est jamais la meilleure approche !  Pour corriger ce code, vous devez ajouter `onTick` à la liste de dépendances. (Pour vous assurer que l'intervalle ne soit mis en place qu'une seule fois, [faites de `onTick` un Événement d'Effet](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events).)

**Nous vous conseillons de traiter toute erreur du *linter* de dépendances comme une erreur de compilation.  Si vous ne le réduisez pas au silence, vous ne rencontrerez jamais ce type de bug.**  Le reste de cette page vous présente des alternatives pour divers cas de figure de ce genre.

</DeepDive>

## Retirer les dépendances superflues {/*removing-unnecessary-dependencies*/}

Chaque fois que vous ajustez la liste des dépendances de l'Effet pour refléter le code, regardez bien cette liste. Est-il logique que l'Effet soit ré-exécuté chaque fois qu'une de ces dépendances change ?  Parfois, la réponse légitime est « non » :

- Vous pourriez vouloir ré-exécuter des *parties distinctes* de votre Effet selon la situation.
- Vous pourriez vouloir seulement lire la *valeur la plus à jour* d'une dépendance plutôt que de « réagir » à chacun de ses changements.
- Une dépendance pourrait changer trop souvent *par inadvertance* car il s'agit d'un objet ou d'une fonction.

Pour trouver la solution appropriée, il vous faudra répondre à quelques questions sur votre Effet.  Passons ces questions en revue.

### Ce code devrait-il être dans un gestionnaire d'événement ? {/*should-this-code-move-to-an-event-handler*/}

Vous devriez commencer par vous demander si le code devrait être dans un Effet ou non.

Imaginons un formulaire. À la soumission, vous passez la variable d'état `submitted` à `true`.  Vous devez envoyer une requête POST et afficher une notification.  Vous avez placé ce comportement dans un Effet qui « réagit » à la valeur `true` de `submitted` :

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 À éviter : logique événementielle au sein d’un Effet
      post('/api/register');
      showNotification('Votre inscription est confirmée !');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Plus tard, vous souhaitez styler le message de notification selon le thème en vigueur, et lisez donc le thème actif.  Puisque `theme` est déclaré dans le corps du composant, c'est une valeur réactive et vous devez l'ajouter comme dépendance :

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 À éviter : logique événementielle au sein d’un Effet
      post('/api/register');
      showNotification('Votre inscription est confirmée !', theme);
    }
  }, [submitted, theme]); // ✅ Toutes les dépendances sont déclarées

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

En procédant ainsi, vous avez introduit un bug.  Supposons que vous envoyiez d'abord le formulaire, puis basculiez entre les thèmes Sombre et Clair.  Le `theme` va changer, l’Effet va se ré-exécuter, et il affichera la même notification à nouveau !

**Le problème vient de ce que vous n'auriez pas du faire un Effet à la base.**  Vous voulez envoyer la requête POST et afficher une notification en réaction à *la soumission du formulaire*, qui constitue une interaction spécifique.  Pour exécuter du code en réaction à une interaction donnée, placez ce comportement dans le gestionnaire d'événement adéquat :

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Correct : logique événementielle dans un gestionnaire d’événement
    post('/api/register');
    showNotification('Votre inscription est confirmée !', theme);
  }

  // ...
}
```

À présent que le code est dans un gestionnaire d'événement, il n'est plus réactif--il ne s'exécutera que lorsque l'utilisateur soumettra le formulaire.  Allez voir [comment choisir entre gestionnaires d'événements et Effets](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) et [comment retirer les Effets superflus](/learn/you-might-not-need-an-effect).

### Votre Effet a-t-il trop de responsabilités ? {/*is-your-effect-doing-several-unrelated-things*/}

Demandez-vous ensuite si votre Effet ne fait pas plusieurs choses sans rapport entre elles.

Disons que vous êtes en train de créer un formulaire d'expédition dans lequel l'utilisateur doit choisir sa ville et son quartier.  Vous chargez une liste de `cities` depuis le serveur en fonction du `country` sélectionné, afin de proposer une liste déroulante :

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ Toutes les dépendances sont déclarées

  // ...
```

C'est un bon exemple du [chargement de données dans un Effet](/learn/you-might-not-need-an-effect#fetching-data). Vous synchronisez un état `cities` avec le réseau en fonction de la prop `country`.  Vous ne pouvez pas faire ça dans un gestionnaire d'événement parce que vous avez besoin de charger ces données dès que `ShippingForm` est affiché, et chaque fois que `country` change (pour quelque raison que ce soit).

Disons maintenant que vous souhaitez ajouter une seconde liste déroulante pour les quartiers de la ville, qui nécessite le chargement de `areas` en fonction de la `city` sélectionnée.  Vous pourriez commencer par ajouter un second appel `fetch` pour la liste des quartiers au sein du même Effet :

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 À éviter : un seul Effet qui synchronise des processus indépendants
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ Toutes les dépendances sont déclarées

  // ...
```

Cependant, puisque l'Effet utilise désormais la variable d'état `city`, vous avez dû l'ajouter à la liste des dépendances. Par ricochet, vous avez engendré un problème : lorsque l'utilisateur choisit une ville différente, l'Effet se ré-exécute et appelle `fetchCities(country)`.  Résultat, vous allez inutilement recharger la liste des villes de nombreuses fois.

**Le problème dans ce code tient à ce que vous synchronisez deux choses sans rapport :**

1. Vous souhaitez synchroniser l'état `cities` avec le réseau en fonction de la prop `country`.
2. Vous souhaitez synchroniser l'état `areas` avec le réseau en fonction de l'état `city`.

Découpez ces comportements en deux Effets, qui chacun ne réagissent qu'à la donnée qui les concerne :

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ Toutes les dépendances sont déclarées

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]); // ✅ Toutes les dépendances sont déclarées

  // ...
```

Désormais, le premier Effet n'est ré-exécuté que lorsque `country` change, tandis que le second Effet n'est ré-exécuté que lorsque `city` change.  Vous les avez découpés par objectif : deux données différentes sont synchronisées par deux Effets différents.  Deux Effets distincts ont deux listes de dépendances distinctes, afin de ne pas se déclencher l'un l'autre par inadvertance.

Le code final est certes plus long que l'original, mais découper ces Effets reste la bonne approche. [Chaque Effet doit représenter un processus distinct de synchronisation](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process). Dans notre exemple, retirer un Effet ne casse pas le comportement de l'autre.  Ça indique bien qu'ils *synchronisent des choses distinctes*, et qu'on a bien fait de les découper. Si la duplication du code vous ennuie, vous pouvez améliorer ça en [extrayant la logique répétitive dans un Hook personnalisé](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks).

### Lisez-vous un état pour calculer le prochain ? {/*are-you-reading-some-state-to-calculate-the-next-state*/}

L'Effet ci-après met à jour la variable d'état `messages` avec un tableau fraîchement créé chaque fois qu'un nouveau message arrive :

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

Il utilise la variable `messages` pour [créer un nouveau tableau](/learn/updating-arrays-in-state) qui commence par tous les messages existants et leur ajoute le nouveau message à la fin.  Cependant, puisque `messages` est une valeur réactive utilisée par l'Effet, elle doit être déclarée dans les dépendances :

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ Toutes les dépendances sont déclarées
  // ...
```

Seulement voilà, ajouter `messages` aux dépendances pose un problème.

Chaque fois que vous recevez un nouveau message, `setMessages()` entraîne un nouveau rendu du composant, avec un nouveau tableau `messages` qui contient le message reçu.  Mais puisque l'Effet dépend désormais de `messages`, la réception du message va *aussi* resynchroniser l'Effet.  Du coup, à chaque message on se reconnecte au salon de discussion. L'utilisateur n'aimera sûrement pas ça !

Pour corriger le problème, ne lisez pas `messages` au sein de l'Effet. Optez plutôt pour le passage d'une [fonction de mise à jour](/reference/react/useState#updating-state-based-on-the-previous-state) à `setMessages` :

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Toutes les dépendances sont déclarées
  // ...
```

**Voyez comme l'Effet ne lit désormais plus du tout la variable `messages`.**  Il vous suffit de passer une fonction de mise à jour du style `msgs => [...msgs, receivedMessage]`. React [mettra la fonction de mise à jour dans une file](/learn/queueing-a-series-of-state-updates) et lui passera l'argument `msgs` pour le prochain rendu. C'est pourquoi l'Effet lui-même n'a plus besoin de dépendre de `messages`. Résultat : la réception d'un message n'entraîne plus de reconnexion.

### Voulez-vous lire une valeur sans « réagir » à ses changements ? {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

<Wip>

Cette section décrit une **API expérimentale : elle n’a donc pas encore été livrée** dans une version stable de React.

</Wip>

Disons que vous souhaitez jouer un son lorsque l'utilisateur reçoit un nouveau message, à moins que `isMuted` ne soit à `true` :

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

Puisque votre Effet utilise désormais `isMuted` au sein de son code, vous devez l'ajouter aux dépendances :

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ Toutes les dépendances sont déclarées
  // ...
```

Le problème, c'est que chaque fois que `isMuted` change (par exemple lorsque l'utilisateur appuie sur la bascule « Silencieux »), l'Effet va se resynchroniser, et donc se reconnecter au salon de discussion.  Ça n'est pas l'expérience utilisateur qu'on souhaite ! (Dans cet exemple, même la désactivation du *linter* ne changerait rien--si vous le faisiez, `isMuted` serait « bloquée » sur sa première valeur.)

Pour résoudre ce souci, vous devez extraire de l'Effet la partie du comportement qui ne devrait pas être réactive.  Vous ne souhaitez pas que cet Effet « réagisse » aux modifications de `isMuted`. [Déplacez la partie non-réactive du code dans un Événement d'Effet](/learn/separating-events-from-effects#declaring-an-effect-event) :

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Toutes les dépendances sont déclarées
  // ...
```

Les Événements d'Effets vous permettent de découper votre Effet en parties réactives (qui « réagissent » à des valeurs réactives telles que `roomId` et à leurs modifications) et non réactives (qui ne lisent que la dernière valeur à jour, comme `onMessage` lit `isMuted`). **À présent que vous lisez `isMuted` au sein d'un Événement d'Effet, il n'a plus besoin d'être une dépendance de votre Effet.** Par conséquent, il n'y aura pas de reconnexion au serveur dès que vous basculez le réglage « Silencieux », ce qui résout notre problème de base !

#### Enrober un gestionnaire d'événement issu des props {/*wrapping-an-event-handler-from-the-props*/}

Vous pourriez tomber sur un problème similaire lorsque votre composant reçoit un gestionnaire d'événement en tant que prop :

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ Toutes les dépendances sont déclarées
  // ...
```

Supposons que le composant parent passe une fonction `onReceiveMessage` *différente* à chaque rendu :

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

Dans la mesure où `onReceiveMessage` est une dépendance, ça causerait une resynchronisation de votre Effet après chaque rendu du parent.  Il y aurait donc reconnexion au serveur. Pour y remédier, enrobez l'appel dans un Événement d'Effet :

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Toutes les dépendances sont déclarées
  // ...
```

Les Événements d'Effets ne sont pas réactifs, vous n'avez donc pas à les ajouter à vos dépendances.  Grâce à ça, vous éviterez une reconnexion au serveur même lorsque le composant parent passe une fonction différente à chaque rendu.

#### Séparer les codes réactif et non réactif {/*separating-reactive-and-non-reactive-code*/}

Dans l'exemple qui suit, vous souhaitez ajouter un événement de visite dans votre journal analytique à chaque fois que `roomId` change. Vous souhaitez inclure `notificationCount` dans chaque entrée de journal, mais vous *ne voulez pas* qu'une modification de `notificationCount` déclenche une journalisation.

Pour y parvenir, sortez la partie non réactive du code dans un Événement d'Effet :

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ Toutes les dépendances sont déclarées
  // ...
}
```

Vous souhaitez continuer à avoir un comportement réactif envers `roomId`, de sorte que vous lisez `roomId` au sein de votre Effet. En revanche, vous ne voulez pas qu'un changement de `notificationCount` entraîne une entrée de journal supplémentaire, et lisez donc `notificationCount` au sein d'un Événement d'Effet. [Apprenez en détail comment lire les dernières valeurs à jour de props et variables d'état pour vos Effets grâce aux Événements d'Effets](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events).

### Une valeur réactive change-t-elle par accident ? {/*does-some-reactive-value-change-unintentionally*/}

Parfois vous *voulez effectivement* que vos Effets « réagissent » à une certaine valeur, mais cette valeur change plus souvent que vous ne le voudriez--et d'une façon qui ne reflète pas nécessairement un changement perceptible par l'utilisateur.  Par exemple, disons que vous créez un objet `options` dans le corps de votre composant, puis lisez cet objet depuis votre Effet :

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Cet objet est déclaré dans le corps du composant, il s'agit donc d'une [valeur réactive](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values).  Lorsque vous lisez une valeur réactive depuis votre Effet, vous devez la déclarer comme dépendance.  Ça garantit que votre Effet « réagit » aux modifications de cette valeur :

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Toutes les dépendances sont déclarées
  // ...
```

C'est important de déclarer cet objet comme dépendance ! Ça garantit par exemple que si `roomId` change, votre Effet se reconnecterait au serveur en utilisant les nouvelles `options`.  Toutefois, le code ci-avant a également un problème.  Pour vous en rendre compte, essayez de taper quelque chose dans le champ du bac à sable qui suit, et regardez ce qui se passe dans la console :

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Désactivation temporaire du *linter* pour mettre
  // en lumière le problème.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Bienvenue dans le salon {roomId} !</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choisissez le salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">général</option>
          <option value="travel">voyage</option>
          <option value="music">musique</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Dans le bac à sable qui précède, le champ de saisie se contente de mettre à jour la variable d'état `message`.  Du point de vue de l'utilisateur, ça ne devrait en rien impacter la connexion au serveur.  Seulement voilà, chaque fois que vous mettez à jour `message`, le composant fait un nouveau rendu. Et quand il fait un rendu, son code est intégralement exécuté à nouveau.

Un nouvel objet `options` est créé à chaque rendu du composant `ChatRoom`.  React perçoit cet objet `options` comme un *objet distinct* de l'objet `options` créé lors du rendu précédent. C'est pourquoi il resynchronise votre Effet (qui dépend d'`options`), entraînant des reconnexions au serveur au fil de votre saisie.

**Ce problème n'affecte que les objets et fonctions. En JavaScript, chaque objet ou fonction nouvellement créé est considéré comme distinct de tous les autres. Peu importe que leurs contenus soient identiques !**

```js {7-8}
// Lors du premier rendu
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// Lors du rendu suivant
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// Ce sont pourtant des objets distincts !
console.log(Object.is(options1, options2)); // false
```

**Les dépendances aux objets et fonctions peuvent entraîner des resynchronisations excessives de votre Effet.**

Voilà pourquoi, autant que possible, vous devriez essayer d'éviter les objets et fonctions dans les dépendances de votre Effet. Essayez plutôt de les sortir de votre composant, ou de les déplacer au sein de votre Effet, ou d'en extraire les valeurs primitives.

#### Sortez les objets et fonctions statiques de votre composant {/*move-static-objects-and-functions-outside-your-component*/}

Si l'objet ne dépend ni de props ni de variables d'état, vous pouvez le sortir de votre composant :

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Toutes les dépendances sont déclarées
  // ...
```

Ainsi, vous pouvez *prouver* au *linter* qu'il n'est pas réactif. Il ne peut pas changer suite à un nouveau rendu, il n'a donc pas besoin de figurer dans vos dépendances. Désormais, un nouveau rendu de `ChatRoom` n'entraînera pas une resynchronisation de votre Effet.

Ça marche aussi pour les fonctions :

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Toutes les dépendances sont déclarées
  // ...
```

Puisque `createOptions` est déclarée hors de votre composant, elle ne constitue pas une valeur réactive. C'est pourquoi elle n'a pas besoin de figurer dans les dépendances de votre Effet, et n'entraînera jamais de resynchronisation de votre Effet.

#### Déplacez les objets et fonctions dynamiques au sein de votre Effet {/*move-dynamic-objects-and-functions-inside-your-effect*/}

Si votre objet dépend de valeurs réactives, qui sont donc susceptibles de changer suite à un nouveau rendu, telles que la prop `roomId`, vous ne pouvez pas le *sortir* de votre composant. En revanche, vous pouvez en déplacer la création *au sein* du code de votre Effet :

```js {7-10,11,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Toutes les dépendances sont déclarées
  // ...
```

Maintenant qu'`options` est déclaré au sein de votre Effet, il n'en constitue plus une dépendance. La seule valeur réactive utilisée par votre Effet est désormais `roomId`.  Puisqu'elle n'est ni un objet ni une fonction, vous pouvez être certain·e qu'elle ne va pas changer *par inadvertance*. En JavaScript, les nombres et chaînes de caractères sont comparés par leur valeur :

```js {7-8}
// Lors du premier rendu
const roomId1 = 'music';

// Lors du rendu suivant
const roomId2 = 'music';

// Ces deux chaînes de caractères sont identiques !
console.log(Object.is(roomId1, roomId2)); // true
```

Grâce à ce correctif, il n'y aura pas de reconnexion au serveur lorsque vous modifiez la saisie :

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Bienvenue dans le salon {roomId} !</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choisissez le salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">général</option>
          <option value="travel">voyage</option>
          <option value="music">musique</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Une véritable implémentation se connecterait en vrai au serveur
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Ceci dit, il *se reconnectera bien* lorsque vous changerez `roomId` *via* la liste déroulante, comme vous êtes en droit de l'attendre.

Ça marche aussi pour les fonctions :

```js {7-12,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Toutes les dépendances sont déclarées
  // ...
```

Vous pouvez écrire vos propres fonctions pour regrouper les éléments de comportement dans votre Effet. Tant que vous les déclarez *au sein* de l'Effet, elles ne constitueront pas des valeurs réactives, et donc n'auront pas à figurer dans les dépendances de votre Effet.

#### Lisez les valeurs primitives constituant vos objets {/*read-primitive-values-from-objects*/}

Il arrive que vous receviez un objet en tant que prop :

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Toutes les dépendances sont déclarées
  // ...
```

Le risque vient ici du composant parent, qui pourrait créer cet objet lors de son rendu :

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

Ça entraînerait une reconnexion au serveur par votre Effet à chaque nouveau rendu du composant parent. Pour éviter ça, lisez les informations issues de l'objet *en-dehors* de votre Effet, et évitez de passer des objets ou fonctions comme dépendances :

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Toutes les dépendances sont déclarées
  // ...
```

Ce type de code a un côté un peu répétitif (on extrait quelques valeurs d'un objet hors de l'Effet, pour ensuite recréer un objet de forme et valeurs identiques au sein de l'Effet).  Mais il a l'avantage de rendre très explicite les informations dont votre Effet dépend *réellement*.  Si un objet est recréé par inadvertance par le composant parent, votre salon de discussion n'aura pas à se reconnecter.  En revanche, si `options.roomId` ou `options.serverUrl` changent réellement, vous vous reconnecterez.

#### Calculez des valeurs primitives à partir des fonctions {/*calculate-primitive-values-from-functions*/}

La même approche peut s'appliquer aux fonctions.  Imaginons par exemple que le composant parent vous passe une fonction :

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

Pour éviter d'en faire une dépendance (ce qui entraînerait une reconnexion à chaque rendu du parent), appelez-la hors de votre Effet.  Ça vous donnera des valeurs de `roomId` et `serverUrl` qui ne sont pas des objets, que vous pourrez alors lire au sein de votre Effet :

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Toutes les dépendances sont déclarées
  // ...
```

Ça ne marche toutefois que pour les fonctions [pures](/learn/keeping-components-pure), afin qu'il soit possible de les appeler au sein du rendu.  Si votre fonction est un gestionnaire d'événement, mais que vous ne souhaitez pas que ses modifications resynchronisent votre Effet, [enrobez-la plutôt dans un Événement d'Effet](#do-you-want-to-read-a-value-without-reacting-to-its-changes).

<Recap>

- Vos dépendances devraient toujours correspondre au code de l'Effet.
- Si vos dépendances vous embêtent, vous devez ajuster le code.
- Réduire le *linter* au silence entraînera des bugs très surprenants, et vous devriez bannir cette pratique.
- Pour retirer une dépendance, vous devez « prouver » au *linter* qu'elle est superflue.
- Si du code est censé s'exécuter en réaction à une interaction spécifique, déplacez-le dans un gestionnaire d'événement adéquat.
- Si diverses parties de votre Effet doivent réagir à des scénarios distincts, découpez-le en plusieurs Effets.
- Si vous souhaitez mettre à jour un état sur base d'un état précédent, passez une fonction de mise à jour.
- Si vous souhaitez lire la dernière valeur à jour sans « réagir » aux changements, extrayez un Événement d'Effet à partir de votre Effet.
- En JavaScript, les objets et fonctions sont considérés distincts s'ils sont créés à des moments distincts.
- Essayez d'éviter les dépendances sur objets ou fonctions. Sortez-les du composant ou déplacez-les directement au sein de l'Effet.

</Recap>

<Challenges>

#### Un intervalle redémarre {/*fix-a-resetting-interval*/}

Cet Effet met en place un intervalle (exécution périodique de code) qui se déclenche chaque seconde.  Vous remarquez un comportement étrange : il semble que l'intervalle soit détruit et créé à nouveau à chaque déclenchement.  Corrigez ce code de façon à ce que l'intervalle ne soit pas reconstruit en permanence.

<Hint>

Il semble que le code de votre Effet dépende de `count`.  Y'a-t-il un moyen de retirer cette dépendance ? Il doit bien exister une façon de mettre à jour la variable d'état `count` sur base de sa valeur précédente sans devoir dépendre de cette valeur.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Création de l’intervalle');
    const id = setInterval(() => {
      console.log('⏰ Tic toc');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Nettoyage de l’intervalle');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Compteur : {count}</h1>
}
```

</Sandpack>

<Solution>

Vous souhaitez mettre à jour la variable d'état `count` vers `count + 1` au sein de l'Effet.  Cependant, ça vous oblige à dépendre de `count` pour votre Effet, valeur qui change à chaque tic d'intervalle, raison pour laquelle ce dernier est recréé à chaque fois.

Pour corriger ça, utilisez une [fonction de mise à jour](/reference/react/useState#updating-state-based-on-the-previous-state) et écrivez `setCount(c => c + 1)` plutôt que `setCount(count + 1)` :

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Création de l’intervalle');
    const id = setInterval(() => {
      console.log('⏰ Tic toc');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Nettoyage de l’intervalle');
      clearInterval(id);
    };
  }, []);

  return <h1>Compteur : {count}</h1>
}
```

</Sandpack>

Au lieu de lire `count` au sein de l'Effet, passez à React la fonction `c => c + 1` (« incrémente ce nombre ! »). React l'appliquera pour le prochain rendu.  Et comme vous n'avez plus besoin de lire la valeur de `count` depuis votre Effet, vous pouvez ramener ses dépendances à un tableau vide (`[]`). Ça évite que votre Effet ne recrée l'intervalle à chaque fois.

</Solution>

#### Une animation se redéclenche {/*fix-a-retriggering-animation*/}

Dans l'exemple que voici, quand vous appuyez sur « Afficher », un message de bienvenue apparaît en fondu enchaîné.  L'animation dure une seconde. Quand vous appuyez sur « Masquer », le message disparaît immédiatement. La logique pour le fondu enchaîné est implémentée dans le fichier `animation.js` sous forme d'une [boucle d'animation](https://developer.mozilla.org/fr/docs/Web/API/window/requestAnimationFrame) en JavaScript pur.  Vous n'avez pas besoin d'y changer quoi que ce soit.  Considérez-la comme une bibliothèque tierce.  Votre Effet crée une instance de `FadeAnimation`pour le nœud DOM, puis appelle `start(duration)` ou `stop()` pour contrôler l'animation. La `duration` (durée) est contrôlée par un curseur. Ajustez le curseur et regardez comment l'animation évolue.

Ce code fonctionne en l'état, mais vous souhaitez y changer quelque chose. Pour le moment, lorsque vous déplacez le curseur qui contrôle la variable d'état `duration`, ça redéclenche l'animation.  Modifiez ce comportement de façon à ce que l'Effet ne « réagisse » pas à la variable `duration`.  Quand vous appuierez sur « Afficher », l'Effet devrait utiliser la `duration` à jour représentée par le curseur.  En revanche, manipuler le curseur lui-même ne devrait pas redéclencher l'animation.

<Hint>

Y'a-t-il une ligne de code dans votre Effet qui ne devrait pas être réactive ?  Comment sortir cette partie de votre Effet ?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect, useRef } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Durée du fondu : {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Masquer' : 'Afficher'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Sauter à la fin
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Commencer l'animation
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // Il nous reste des étapes à afficher
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution>

Votre Effet a besoin de lire la dernière valeur à jour de `duration`, mais vous ne voulez pas « réagir » aux modifications de celle-ci.  Vous utilisez `duration` pour démarrer l'animation, mais ce démarrage n'est pas réactif.  Extrayez la ligne de code non réactive dans un Événement d'Effet, et appelez cette fonction depuis votre Effet.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Durée du fondu : {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Masquer' : 'Afficher'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // Il nous reste des étapes à afficher
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

Les Événements d'Effets tels que `onAppear` ne sont pas réactifs, de sorte que vous pouvez y lire `duration` sans redéclencher une animation.

</Solution>

#### On se reconnecte au serveur {/*fix-a-reconnecting-chat*/}

Dans l'exemple ci-après, chaque fois que vous pressez « Basculer le thème », le salon se reconnecte au serveur de discussion.  Pourquoi donc ?  Corrigez l'erreur afin qu'il ne se reconnecte au serveur que si l'URL du serveur change ou lorsqu'on choisit un salon de discussion différent.

Considérez que `chat.js` est une bibliothèque tierce : vous pouvez y vérifier l'API exposée, mais ne le modifiez pas.

<Hint>

Il y a plusieurs façons de résoudre le problème, mais au bout du compte vous devriez éviter d'avoir des objets comme dépendances de votre Effet.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Basculer le thème
      </button>
      <label>
        URL du serveur :{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        Choisissez le salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">général</option>
          <option value="travel">voyage</option>
          <option value="music">musique</option>
        </select>
      </label>
      <hr />
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Bienvenue dans le salon {options.roomId} !</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Une véritable implémentation se connecterait en vrai au serveur
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

Votre Effet est ré-exécuté parce qu'il dépend de l'objet `options`.  Les objets sont susceptibles d'être recréés par inadvertance, et vous devriez essayer autant que possible de les éviter comme dépendances pour vos Effets.

Le correctif le moins impactant consiste à lire `roomId` et `serverUrl` directement hors de l'Effet, et de faire que l'Effet dépende de ces valeurs primitives (qui ne peuvent pas changer par inadvertance).  Au sein de l'Effet, créez un objet et passez-le à `createConnection` :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Basculer le thème
      </button>
      <label>
        URL du serveur :{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        Choisissez le salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">général</option>
          <option value="travel">voyage</option>
          <option value="music">musique</option>
        </select>
      </label>
      <hr />
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Bienvenue dans le salon {options.roomId} !</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Une véritable implémentation se connecterait en vrai au serveur
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Il serait encore préférable de remplacer la prop `options` de type objet par des props plus spécifiques `roomId` et `serverUrl` :

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Basculer le thème
      </button>
      <label>
        URL du serveur :{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        Choisissez le salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">général</option>
          <option value="travel">voyage</option>
          <option value="music">musique</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Bienvenue dans le salon {roomId} !</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Une véritable implémentation se connecterait en vrai au serveur
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Favorisez les props de type primitif chaque foi que c'est possible : ça facilitera l'optimisation ultérieure de vos composants.

</Solution>

#### Encore de la reconnexion {/*fix-a-reconnecting-chat-again*/}

Cet exemple se connecte au serveur de discussion avec ou sans chiffrage. Basculez la case à cocher pour constater des messages différents dans la console selon que le chiffrage est actif ou non.  Essayez de changer de salon. Ensuite, changez le thème. Lorsque vous êtes connecté·e à un salon, vous recevrez de nouveaux messages de temps en temps.  Vérifiez que leur charte couleur correspond au thème que vous avez choisi.

Dans cet exemple, on se reconnecte au serveur chaque fois que le thème change.  Corrigez ça.  Après quoi, changer le thème ne devrait plus entraîner de reconnexion au serveur ; en revanche, basculer le mode de chiffrement ou changer de salon devrait bien se reconnecter.

Ne touchez pas à `chat.js`.  À part ça, vous êtes libre de changer le reste du code, du moment que le comportement est préservé.  Par exemple, il vous semblera peut-être utile de modifier la nature des props transmises entre les composants.

<Hint>

Vous passez deux fonctions : `onMessage` et `createConnection`. Les deux sont recréées à chaque rendu de `App`.  Elles sont vues comme de nouvelles valeurs à chaque fois, ce qui redéclenche votre Effet.

Une de ces fonctions est un gestionnaire d'événement. Connaissez-vous une façon d'appeler un gestionnaire d'événement depuis un Effet sans « réagir » à de nouvelles valeurs de la fonction gestionnaire d'événement ?  Ça serait super pratique !

Une autre fonction n'existe que pour passer des données issues de l'état à une méthode API importée.  Cette fonction est-elle vraiment nécessaire ? Et si on passait uniquement les informations essentielles ?  Vous aurez peut-être besoin de déplacer quelques imports de `App.js` vers `ChatRoom.js`.

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Utiliser le thème sombre
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Activer le chiffrage
      </label>
      <label>
        Choisissez le salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">général</option>
          <option value="travel">voyage</option>
          <option value="music">musique</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        onMessage={msg => {
          showNotification('Nouveau message : ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Bienvenue dans le salon {roomId} !</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // Une véritable implémentation se connecterait en vrai au serveur
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '... (chiffré)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl + ' (chiffré)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Il n’est pas possible d’ajouter un gestionnaire deux fois.');
      }
      if (event !== 'message') {
        throw Error('Seul l’événement "message" est accepté.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // Une véritable implémentation se connecterait en vrai au serveur
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '... (non chiffré)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl + ' (non chiffré)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Il n’est pas possible d’ajouter un gestionnaire deux fois.');
      }
      if (event !== 'message') {
        throw Error('Seul l’événement "message" est accepté.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Il y a plusieurs solutions valides ; en voici une.

Dans l'exemple d'origine, le basculement du thème entraînait le passage de fonctions `onMessage` et `createConnection` différentes, car créées pour l'occasion.  Comme notre Effet dépendait de ces fonctions, la connexion au serveur était réinitialisée chaque fois qu'on changeait le thème.

Pour corriger le souci avec `onMessage`, il nous fallait l'enrober dans un Événement d'Effet :

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

Contrairement à la prop `onMessage`, l'Événement d'Effet `onReceiveMessage` n'est pas réactif.  C'est pourquoi il n'a pas besoin de figurer dans les dépendances de votre Effet. Par conséquent, les modifications de `onMessage` n'entraîneront plus de reconnexion.

Vous ne pouvez toutefois pas adopter la même approche pour `createConnection`, car celle-ci *devrait* être réactive. Vous *voulez* que l'Effet soit redéclenché si l'utilisateur bascule le mode de chiffrement de la connexion, ou s'il change de salon de discussion.  En revanche, comme `createConnection` est une fonction, vous ne pouvez pas vérifier si l'information qu'elle lit a *réellement* changé ou non.  Pour y remédier, plutôt que de passer `createConnection` depuis le composant `App`, passez les valeurs brutes `roomId` et `isEncrypted` :

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('Nouveau message : ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

Vous pouvez alors déplacer la fonction `createConnection` *au sein de* votre Effet plutôt que de la passer depuis `App` :

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

Ces ajustements faits, votre Effet ne dépend plus d'aucune fonction :

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Valeurs réactives
  const onReceiveMessage = useEffectEvent(onMessage); // Non réactives

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Lecture d'une valeur réactive
      };
      if (isEncrypted) { // Lecture d'une valeur réactive
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ Toutes les dépendances sont déclarées
```

Par conséquent, la reconnexion au serveur n'a lieu que lorsqu'une modification pertinente (c'est-à-dire un changement des props `roomId` ou `isEncrypted`) a lieu :

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Utiliser le thème sombre
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Activer le chiffrage
      </label>
      <label>
        Choisissez le salon de discussion :{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">général</option>
          <option value="travel">voyage</option>
          <option value="music">musique</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('Nouveau message : ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Bienvenue dans le salon {roomId} !</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // Une véritable implémentation se connecterait en vrai au serveur
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '... (chiffré)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl + ' (chiffré)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Il n’est pas possible d’ajouter un gestionnaire deux fois.');
      }
      if (event !== 'message') {
        throw Error('Seul l’événement "message" est accepté.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // Une véritable implémentation se connecterait en vrai au serveur
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connexion au salon « ' + roomId + ' » sur ' + serverUrl + '... (non chiffré)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Déconnexion du salon « ' + roomId + ' » sur ' + serverUrl + ' (non chiffré)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Il n’est pas possible d’ajouter un gestionnaire deux fois.');
      }
      if (event !== 'message') {
        throw Error('Seul l’événement "message" est accepté.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
