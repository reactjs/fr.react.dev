---
title: experimental_taintObjectReference
---

<Wip>

**Cette API est expérimentale : elle n’a donc pas encore été livrée dans une version stable de React.**

Vous pouvez l'essayer en mettant à jour vos modules React afin d'utiliser la version expérimentale la plus récente :

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Les versions expérimentales de React sont susceptibles de contenir des bugs. Veillez donc à ne pas les utiliser en production.

Cette API n'est disponible qu'au sein des React Server Components.

</Wip>


<Intro>

`taintObjectReference` vous permet d'empêcher qu'une instance objet précise soit passée à un Composant Client, comme par exemple un objet `user`.

```js
experimental_taintObjectReference(message, object);
```

Pour empêcher le passage d'une clé, d'un hash ou d'un jeton, utilisez [`taintUniqueValue`](/reference/react/experimental_taintUniqueValue).

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `taintObjectReference(message, object)` {/*taintobjectreference*/}

Appelez `taintObjectReference` avec un objet pour indiquer à React qu'il ne doit pas permettre le passage de cet objet tel quel vers le côté client :

```js
import { experimental_taintObjectReference } from 'react';

experimental_taintObjectReference(
  'Ne passez pas TOUTES les variables d’environnement au client.',
  process.env
);
```

[Voir plus d'exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `message` : le message que vous souhaitez afficher si l'objet est passé à un Composant Client.  Ce message fera partie de l'erreur qui sera levée si l'objet est passé à un Composant Client.

* `object` : l'objet a « ternir ».  Les fonctions et instances de classes peuvent être passées en tant qu'`object` à `taintObjectReference`. React empêche d'entrée de jeu leur passage aux Composants Clients, mais ça remplacera le message d'erreur par défaut avec ce que vous aurez passé comme `message`. Notez que lorsqu'une instance précise d'un tableau typé *(Typed Array, NdT)* est passée comme `object` à `taintObjectReference`, les copies de ce tableau typé ne seront quant à elles pas ternies.

#### Valeur renvoyée {/*returns*/}

`experimental_taintObjectReference` renvoie `undefined`.

#### Limitations {/*caveats*/}

- Recréer ou cloner un objet terni produit un nouvel objet intact, susceptible de contenir des données sensibles. Si par exemple vous avez un objet `user` terni, `const userInfo = {name: user.name, ssn: user.ssn}` ou `{...user}` produiront de nouveaux objets qui ne seront, eux, pas ternis. `taintObjectReference` ne protège que contre les bévues simples lorsque l'objet est passé tel quel à un Composant Client.

<Pitfall>

**Ne comptez pas sur le ternissement pour garantir la sécurité.** Ternir un objet n'empêche pas la fuite de toute donnée dérivée imaginable. Un clone de l'objet terni créera par exemple un objet intact. L'utilisation de données d'un objet terni (ex. `{secret: taintedObj.secret}`) crée une nouvelle valeur, ou un nouvel objet, qui ne sera pas terni·e. Le ternissement est une couche de protection ; une appli sécurisée aura plusieurs couches de protection complémentaires, des API soigneusement conçues et des mécanismes d'isolation en place.

</Pitfall>

---

## Utilisation {/*usage*/}

### Empêcher des données utilisateur d'atteindre le client par inadvertance {/*prevent-user-data-from-unintentionally-reaching-the-client*/}

Un Composant Client ne devrait jamais accepter des objets comportant des données sensibles.  Dans l'idéal, les fonctions de chargement de données ne devraient pas exposer des données auxquelles l'utilisateur actif n'a pas accès.  Mais des erreurs peuvent survenir lors d'une refonte du code.  Pour se protéger contre des erreurs en aval nous pouvons « ternir » l'objet utilisateur dans notre API de données.

```js
import { experimental_taintObjectReference } from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Ne passez pas l’objet utilisateur entier au client. ' +
      'Récupérez plutôt les propriétés spécifiques à votre scénario.',
    user,
  );
  return user;
}
```

Désormais, si un code serveur quelconque essaie de passer cet objet à un Composant Client, une erreur sera levée avec le message d'erreur fourni.

<DeepDive>

#### Se protéger contre les fuites lors du chargement de données {/*protecting-against-leaks-in-data-fetching*/}

Si votre environnement de Composants Serveur a accès à des données sensibles, vous devez être attentif·ve à ne pas passer des objets directement :

```js
// api.js
export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  return user;
}
```

```js
import { getUser } from 'api.js';
import { InfoCard } from 'components.js';

export async function Profile(props) {
  const user = await getUser(props.userId);
  // NE FAITES PAS ÇA
  return <InfoCard user={user} />;
}
```

```js
// components.js
"use client";

export async function InfoCard({ user }) {
  return <div>{user.name}</div>;
}
```

Dans l'idéal, `getUser` ne devait pas exposer de données auxquelles l'utilisateur courant n'a pas accès. Pour empêcher le passage en aval de l'objet `user` à un Composant Client, nous pouvons décider de « ternir » cet objet :


```js
// api.js
import { experimental_taintObjectReference } from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Ne passez pas l’objet utilisateur entier au client. ' +
      'Récupérez plutôt les propriétés spécifiques à votre scénario.',
    user,
  );
  return user;
}
```

Désormais, si un code serveur quelconque essaie de passer cet objet à un Composant Client, une erreur sera levée avec le message d'erreur fourni.

</DeepDive>
