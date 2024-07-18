---
title: experimental_taintUniqueValue
---

<Wip>

**Cette API est expérimentale : elle n’a donc pas encore été livrée dans une version stable de React.**

Vous pouvez l'essayer en mettant à jour vos modules React afin d'utiliser la version expérimentale la plus récente :

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Les versions expérimentales de React sont susceptibles de contenir des bugs. Veillez donc à ne pas les utiliser en production.

Cette API n'est disponible qu'au sein des [Composants Serveur](/reference/rsc/use-client).

</Wip>

<Intro>

`taintUniqueValue` vous permet d'empêcher que certaines valeurs uniques soient passées à un Composant Client, telles que des mots de passe, clés ou jetons.

```js
taintUniqueValue(errMessage, lifetime, value)
```

Pour empêcher le passage d'un objet contenant des données sensibles, utilisez [`taintObjectReference`](/reference/react/experimental_taintObjectReference).

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `taintUniqueValue(message, lifetime, value)` {/*taintuniquevalue*/}

Appelez `taintUniqueValue` avec un mot de passe, jeton, clé ou *hash* pour indiquer à React qu'il ne doit pas permettre le passage de cette valeur vers le côté client :

```js
import { experimental_taintUniqueValue } from 'react';

experimental_taintUniqueValue(
  'Ne passez pas de clés secrètes au client.',
  process,
  process.env.SECRET_KEY
);
```

[Voir plus d'exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `message` : le message que vous souhaitez afficher si `value` est passée à un Composant Client.  Ce message fera partie de l'erreur qui sera levée si `value` est passée à un Composant Client.

* `lifetime` : tout objet indiquant pour combien de temps `value` devrait être « ternie ». React bloquera le passage de `value` aux Composants Clients tant que cet objet existera. Passer `globalThis` pour cet argument bloquerait par exemple le passage de cette valeur pour toute la durée de vie de l'appli. `lifetime` est le plus souvent un objet dont l'une des propriétés contient `value`.

* `value` : une chaîne de caractères, un *bigint* ou un *TypedArray* (tableau typé). `value` doit être une séquence unique de caractères ou d'octets dotée d'une forte entropie, telle qu'un jeton cryptographique, une clé privée, un *hash* ou un long mot de passe. `value` ne pourra alors plus être passée à un Composant Client.

#### Valeur renvoyée {/*returns*/}

`experimental_taintUniqueValue` renvoie `undefined`.

#### Limitations {/*caveats*/}

- La dérivation de valeurs à partir des valeurs ternies peut nuire à la protection par ternissement. Les nouvelles valeurs créées par exemple en changeant la casse de valeurs ternies, en concaténant des chaînes ternies vers une chaîne de caractères plus longue, en convertissant des valeurs ternies en Base 64, en extrayant des portions de chaînes ternies, ou toute autre transformation du même genre, ne constituent plus des valeurs ternies à moins que vous n'appeliez explicitement `taintUniqueValue` sur les nouvelles valeurs ainsi produites.
- N'utilisez pas `taintUniqueValue` pour protéger des valeurs à basse entropie, telles que des codes PIN ou des numéros de téléphones. Si une valeur de requête est contrôlée par vos attaquants, ils peuvent alors déterminer la valeur ternie en énumérant toutes les valeurs possibles du secret.

---

## Utilisation {/*usage*/}

### Empêcher le passage d'un jeton à un Composant Client {/*prevent-a-token-from-being-passed-to-client-components*/}

Pour vous assurer que des données sensibles telles que des mots de passe, jetons de sessions et autres valeurs uniques ne soient pas passées par inadvertance à des Composants Clients, la fonction `taintUniqueValue` vous offre une couche de protection. Lorsqu'une valeur est ternie, toute tentative de la passer à un Composant Client lèvera une erreur.

L'argument `lifetime` définit la durée du ternissement pour cette valeur. Si vous souhaitez un ternissement définitif, utilisez pour l'argument `lifetime` des objets tels que [`globalThis`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/globalThis) ou `process`. Ces objets ont une durée de vie qui couvre toute l'exécution de votre appli.

```js
import { experimental_taintUniqueValue } from 'react';

experimental_taintUniqueValue(
  'Ne passez pas une clé privée au client.',
  globalThis,
  process.env.SECRET_KEY
);
```

Si la durée de vie de la valeur ternie est liée à un objet, définissez `lifetime` à l'objet qui encapsule cette valeur. Ça garantit que la valeur ternie restera protégée pendant toute la durée de vie de l'objet qui la contient.

```js
import { experimental_taintUniqueValue } from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintUniqueValue(
    'Ne passez par un jeton de session utilisateur au client.',
    user,
    user.session.token
  );
  return user;
}
```

Dans cet exemple, l'objet `user` sert comme argument `lifetime`.  Si cet objet est stocké dans un cache global ou se retrouve accessible par une autre requête, le jeton de session restera terni.

<Pitfall>

**Ne comptez pas sur le ternissement pour garantir la sécurité.** Ternir une valeur n'empêche pas la fuite de toute donnée dérivée imaginable. Créer par exemple une nouvelle valeur en convertissant la chaîne ternie en majuscules ne produira pas une chaîne elle aussi ternie.

```js
import { experimental_taintUniqueValue } from 'react';

const password = 'correct horse battery staple';

experimental_taintUniqueValue(
  'Ne passez par le mot de passe au client.',
  globalThis,
  password
);

const uppercasePassword = password.toUpperCase() // `uppercasePassword` n’est pas ternie
```

Dans le code ci-dessus, la constante`password` est ternie. Puis `password` sert de base à la nouvelle valeur `uppercasePassword`, créée en appelant la méthode `toUpperCase` de `password`. Cette nouvelle valeur `uppercasePassword` n'est pas ternie.

On obtiendrait le même résultat avec d'autres façons de dériver de nouvelles valeurs à partir de valeurs ternies, telles que la concaténation de chaîne, leur encodage en Base 64 ou l'extraction d'une portion de la chaîne.

Le ternissement ne vous protège que contre les bévues simples lorsqu'une valeur sensible est explicitement passée à un Composant Client. Des appels erronés de `taintUniqueValue`, comme le fait de recourir à un stockage global hors de React, sans l'objet de durée de vie associée, peuvent entraîner la perte du ternissement de la valeur. Le ternissement est une couche de protection ; une appli sécurisée aura plusieurs couches de protection complémentaires, des API soigneusement conçues et des mécanismes d'isolation en place.

</Pitfall>

<DeepDive>

#### Utiliser `server-only` et `taintUniqueValue` pour empêcher la fuite de secrets {/*using-server-only-and-taintuniquevalue-to-prevent-leaking-secrets*/}

Si votre environnement de Composants Serveur a accès à des données sensibles telles que des clés privées ou des mots de passe, vous devez être attentif·ve à ne pas les passer à un Composant Client.

```js
export async function Dashboard(props) {
  // NE FAITES PAS ÇA
  return <Overview password={process.env.API_PASSWORD} />;
}
```

```js
"use client";

import {useEffect} from '...'

export async function Overview({ password }) {
  useEffect(() => {
    const headers = { Authorization: password };
    fetch(url, { headers }).then(...);
  }, [password]);
  ...
}
```

Cet exemple ferait fuiter un jeton d'API secret vers le côté client. Si ce jeton d'API peut être utilisé pour accéder à des données auxquelles cet utilisateur spécifique ne devrait pas avoir accès, il constituerait une faille de sécurité.

[comment]: <> (TODO: Link to `server-only` docs once they are written)

Dans l'idéal, ce type de secrets est isolé dans un unique fichier utilitaire qui ne doit pouvoir être importé que par des utilitaires de confiance côté serveur. Ce type de fichier peut même être étiqueté avec [`server-only`](https://www.npmjs.com/package/server-only) pour garantir qu'il ne sera pas importé côté client.

```js
import "server-only";

export function fetchAPI(url) {
  const headers = { Authorization: process.env.API_PASSWORD };
  return fetch(url, { headers });
}
```

Lors d'une refonte, des erreurs peuvent survenir car l'ensemble de votre équipe ne sera peut-être pas attentive à ce point de sécurité. Pour vous éviter des erreurs en aval vous pouvez « ternir » le mot de passe effectif :

```js
import "server-only";
import { experimental_taintUniqueValue } from 'react';

experimental_taintUniqueValue(
  'Ne passez pas le jeton d’API au client. ' +
    'Effectuez plutôt les chargements côté serveur.'
  process,
  process.env.API_PASSWORD
);
```

À présent, dès que quiconque essaierait de passer ce mot de passe à un Composant Client, ou enverrait le mot de passe à un Composant Client *via* une *Server Action*, une erreur serait levée avec le message défini lors de l'appel à `taintUniqueValue`.

</DeepDive>

---
