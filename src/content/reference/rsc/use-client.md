---
title: "'use client'"
titleForTitleTag: "Directive 'use client'"
canary: true
---

<Canary>

`'use client'` n'est utile que si vous [utilisez React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) ou créez une bibliothèque compatible avec eux.

</Canary>


<Intro>

`'use client'` vous permet d'indiquer quel code est exécuté côté client.

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `'use client'` {/*use-client*/}

Ajoutez `'use client';` tout en haut d'un fichier pour indiquer que ce fichier (ainsi que toutes ses dépendances directes et indirectes) s'exécute coté client.

```js {1}
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

Lorsqu'un fichier marqué avec `'use client'` est importé par un Composant Serveur, [les *bundlers* compatibles](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) traiteront l'import comme un « point de césure » entre le code côté serveur et le code côté client.

En tant que dépendances de `RichTextEditor`, `formatDate` et `Button` seront également évaluées côté client, indépendamment de la présence d'une directive `'use client'` dans le module qui les déclare.  Notez qu'un même module peut être évalué tant côté serveur lorsqu'il est importé par du code côté serveur, que côté client lorsqu'il est importé par du code côté client.

#### Limitations {/*caveats*/}

* `'use client'` doit être placé au tout début de la fonction ou du module concerné ; au-dessus notamment de tout code, y compris les imports (mais il peut y avoir des commentaires avant les directives).  La directive doit utiliser des apostrophes (`'`) ou guillemets (`"`), mais pas des *backticks* (<code>`</code>).
* Lorsqu'un fichier `'use client'` est importé depuis un autre fichier côté client, la directive n'a aucun effet.
* Lorsqu'un module de composant contient une directive `'use client'`, toute utilisation de ce composant produit de façon garantie un Composant Client. Ceci dit, un composant peut être évalué côté client même s'il n'utilise pas de directive `'use client'`.
  * L'utilisation d'un composant constitue un Composant Client si elle a lieu dans un module doté d'une directive `'use client'` ou si elle compte dans ses dépendances (directes ou indirectes) un module doté d'une directive `'use client'`.  Dans tous les autres cas, on considère que le composant est côté serveur.
* Le code marqué comme exécutable côté client ne se limite pas aux composants. Tout code figurant dans l'arbre des dépendances d'un Module Client est envoyé vers le client pour y être exécuté.
* Lorsqu'un Module Serveur importe les valeurs d'un module doté de la directive `'use client'`, les valeurs en question doivent être soit un composant React, soit une des [valeurs de prop sérialisables](#passing-props-from-server-to-client-components) prises en charge afin de pouvoir être passées au Composant Client par du code côté serveur. Tout autre cas de figure lève une exception.

### Comment `'use client'` marque du code comme étant côté client {/*how-use-client-marks-client-code*/}

Dans une appli React, les composants sont souvent répartis en plusieurs fichiers ou [modules](/learn/importing-and-exporting-components#exporting-and-importing-a-component).

Pour les applis ayant recours aux React Server Components, l'appli fait par défaut son rendu coté serveur. `'use client'` crée un « point de césure » entre les codes côté client et côté serveur au sein de [l'arbre de dépendances de modules](/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree), produisant de fait une sous-arborescence de Modules Client.

Afin de mieux illustrer cet aspect, considérons l'appli suivante basée sur les React Server Components.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Une appli pour être inspiré·e" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
'use client';

import { useState } from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = useState(0);
  const quote = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Voici de quoi vous inspirer :</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire-moi encore</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  "Ne laisse pas hier occuper trop d’aujourd’hui. — Will Rogers",
  "L’ambition, c’est poser une échelle contre le ciel.",
  "Une joie partagée compte double.",
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

Dans l'arbre de dépendances de modules pour cette appli d'exemple, la directive `'use client'` dans `InspirationGenerator.js` marque ce module et toutes ses dépendances transitives comme des Modules Client.  La partie de l'arborescence qui démarre avec `InspirationGenerator.js` est désormais marquée comme des Modules Client.

<Diagram name="use_client_module_dependency" height={250} width={545} alt="Un graphe d’arborescence avec le nœud sommet représentant le module 'App.js'. 'App.js' a trois enfants : 'Copyright.js', 'FancyText.js' et 'InspirationGenerator.js'. 'InspirationGenerator.js' a deux enfants : 'FancyText.js' et 'inspirations.js'. Les nœuds à partir de 'InspirationGenerator.js' ont un arrière-plan jaune pour indiquer qu’il s’agit du sous-graphe exécuté côté client en raison de la directive 'use client' dans 'InspirationGenerator.js'.">

`'use client'` segmente l'arbre de dépendances de modules de l'appli utilisant les React Server Components, en marquant `InspirationGenerator.js` et toutes ses dépendances comme exécutables côté client.
</Diagram>


Lors du rendu, le framework fera un rendu côté serveur du composant racine et continuera à traverser [l'arbre de rendu](/learn/understanding-your-ui-as-a-tree#the-render-tree), en sautant l'évaluation de tout code importé par du code côté client.

La partie rendue côté serveur de l'arbre de rendu est alors envoyée côté client. Le client, ainsi que le code côté client qu'il aura téléchargé, termine enfin le rendu du reste de l'arborescence.

<Diagram name="use_client_render_tree" height={250} width={500} alt="Un graphe d’arborescence où chaque nœud représente un composant et ses enfants comme composants enfants.  Le nœud sommet est étiquetté 'App' et a deux composants enfants : 'InspirationGenerator' et 'FancyText'. 'InspirationGenerator' a deux composants enfants, 'FancyText' et 'Copyright'. Aussi bien 'InspirationGenerator' que son composant enfant 'FancyText' sont marqués comme utilisant un rendu côté client.">

L'arbre de rendu de l'appli utilisant les React Server Components. `InspirationGenerator` et son composant enfant `FancyText` sont des composants exportés par du code marqué comme côté client, et sont donc considérés comme des Composants Client.

</Diagram>

On introduit ici les définitions suivantes :

* Les **Composants Client** sont les composants dans l'arbre de rendu dont le rendu est fait côté client.
* Les **Composants Serveur** sont les composants dans l'arbre de rendu dont le rendu est fait côté serveur.

En parcourant l'appli d'exemple, `App`, `FancyText` et `Copyright` sont tous rendus côté serveur et donc considérés comme des Composants Serveur. Mais puisque `InspirationGenerator.js` et ses dépendances transitives sont marquées comme du code côté client, le composant `InspirationGenerator` et son composant enfant `FancyText` sont des Composants Client.

<DeepDive>

#### Pourqoi `FancyText` est-il à la fois un Composant Serveur et un Composant Client ? {/*how-is-fancytext-both-a-server-and-a-client-component*/}

À en croire les définitions ci-dessus, le composant `FancyText` est à la fois un Composant Serveur et côté client, comment est-ce possible ?

Commençons par clarifier le terme « composant », qui n'est pas très précis.  Voici deux façons de comprendre « composant » :

1. Un « composant » peut désigner une **définition de composant**. La plupart du temps, il s'agira en pratique d'une fonction.

```js
// Voici une définition de composant
function MyComponent() {
  return <p>Mon composant</p>
}
```

1. Un « composant » peut également faire référence à une **utilisation de la définition du composant**.
```js
import MyComponent from './MyComponent';

function App() {
  // Voici une utilisation du composant
  return <MyComponent />;
}
```

Cette distinction est généralement superflue lorsqu'on explique des concepts, mais revêt ici une importance particulière.

Lorsque nous parlons de Composants Serveur ou côté client, nous faisons spécifiquement référence à l'utilisation des composants.

* Si le composant est défini dans un module porteur de la directive `'use client'`, ou s'il est importé et appelé dans un Composant Client, alors l'utilisation de ce composant constitue un Composant Client.
* Dans les autres cas, l'utilisation de ce composant constitue un Composant Serveur.

<Diagram name="use_client_render_tree" height={150} width={450} alt="Un graphe d’arborescence où chaque nœud représente un composant et ses enfants comme composants enfants.  Le nœud sommet est étiquetté 'App' et a deux composants enfants : 'InspirationGenerator' et 'FancyText'. 'InspirationGenerator' a deux composants enfants, 'FancyText' et 'Copyright'. Aussi bien 'InspirationGenerator' que son composant enfant 'FancyText' sont marqués comme utilisant un rendu côté client.">

Un arbre de rendu illustre les utilisations des composants.

</Diagram>

Pour en revenir à la question de `FancyText`, nous pouvons voir que la définition du composant *ne comporte pas* de directive `'use client'` et qu'elle est utilisée deux fois.

L'utilisation de `FancyText` comme enfant de `App` marque cette utilisation comme un Composant Serveur. En revanche, l'import et l'appel de `FancyText` au sein de `InspirationGenerator` marque cette utilisation comme un Composant Client puisque `InspirationGenerator` est assujetti à une directive `'use client'`.

Ça signifie que la définition du composant `FancyText` sera évaluée côté serveur mais aussi envoyée vers le client pour faire le rendu de son utilisation en tant que Composant Client.

</DeepDive>

<DeepDive>

#### Pourquoi `Copyright` est-il un Composant Serveur ? {/*why-is-copyright-a-server-component*/}

Dans la mesure où `Copyright` figure comme composant enfant dans le rendu du Composant Client `InspirationGenerator`, vous êtes peut-être surpris·e qu'il soit considéré comme un Composant Serveur.

Gardez à l'esprit que `'use client'` définit un « point de césure » entre les codes côté serveur et côté client dans *l'arbre de dépendances de modules*, pas dans l'arbre de rendu.

<Diagram name="use_client_module_dependency" height={200} width={500} alt="Un graphe d’arborescence avec le nœud sommet représentant le module 'App.js'. 'App.js' a trois enfants : 'Copyright.js', 'FancyText.js' et 'InspirationGenerator.js'. 'InspirationGenerator.js' a deux enfants : 'FancyText.js' et 'inspirations.js'. Les nœuds à partir de 'InspirationGenerator.js' ont un arrière-plan jaune pour indiquer qu’il s’agit du sous-graphe exécuté côté client en raison de la directive 'use client' dans 'InspirationGenerator.js'.">

`'use client'` définit un « point de césure » entre les codes côté serveur et côté client de l'arbre de dépendances de modules.

</Diagram>

Dans l'arbre de dépendances de modules, nous voyons que `App.js` importe et appelle `Copyright` depuis le module `Copyright.js`. Puisque `Copyright.js` ne comporte pas de directive `'use client'`, cette utilisation du composant est rendue côté serveur. `App` est lui aussi rendu côté serveur puisqu'il s'agit du composant racine.

Les Composants Client peuvent faire le rendu de Composants Serveur parce que vous pouvez passer du JSX comme props. Dans notre cas, `InspirationGenerator` reçoit `Copyright` comme [enfant](/learn/passing-props-to-a-component#passing-jsx-as-children). Cependant, le module `InspirationGenerator.js` n'importe jamais directement le module `Copyright.js`, c'est le module `App.js` qui s'en occupe. En fait, le composant `Copyright` est entièrement exécuté avant même qu'`InspirationGenerator` ne commence son rendu.

Le point important à retenir, c'est que la relation de rendu parent-enfant ne garantit pas un environnement de rendu unique.

</DeepDive>

### Quand utiliser `'use client'` {/*when-to-use-use-client*/}

Avec `'use client'`, vous pouvez déterminer quand les composants sont des Composants Client. Dans la mesure où les composants sont côté serveur par défaut, voici un survol rapide des avantages et limitations des Composants Serveur, pour vous aider à déterminer si vous avez besoin de marquer du code comme étant côté client.

Par souci de simplicité, nous parlons ici des Composants Serveur, mais les mêmes principes s'appliquent à tout code de votre appli qui serait exécuté côté serveur.

#### Avantages des Composants Serveur {/*advantages*/}

* Les Composants Serveur aident à réduire la quantité de code envoyée et exécutée côté client. Seuls les Modules Client sont intégrés aux *bundles* et évalués côté client.
* Les Composants Serveur tirent parti de leur exécution côté serveur : ils peuvent accéder à son système de fichiers local et bénéficient par ailleurs d'une faible latence pour leurs chargements de données et autres requêtes réseau.

#### Limitations des Composants Serveurs {/*limitations*/}

* Les Composants Serveur ne peuvent pas gérer d'interactions, puisque les gestionnaires d'événements ne peuvent être inscrits et déclenchés que par le client.
  * Des gestionnaires d'événements tels que `onClick` ne peuvent par exemple être définis que dans des Composants Client.
* Les Composants Serveur ne peuvent pas utiliser la plupart des Hooks.
  * Lorsque les Composants Serveur font leur rendu, le résultat se résume pour l'essentiel à une liste de composants dont le rendu doit être fait côté client. Les Composants Serveur ne persistent pas en mémoire une fois le rendu effectué, et ne peuvent donc pas avoir leur propre état.

### Types sérialisables renvoyés par les Composants Serveur {/*serializable-types*/}

Les types de props sérialisables comprennent :

* Les types primitifs
	* [string](https://developer.mozilla.org/fr/docs/Glossary/String)
	* [number](https://developer.mozilla.org/fr/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/fr/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/fr/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/fr/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Symbol), mais uniquement pour ceux inscrits auprès du référentiel global de symboles *via* [`Symbol.for`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Les itérables contenant des valeurs sérialisables
	* [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) et [ArrayBuffer](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Date)
* Les [objets](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) bruts : ceux créés via des [initialiseurs d'objets](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Object_initializer), dont les propriétés sont sérialisables
* Les fonctions qui sont des [Actions Serveur](/reference/react/use-server)
* Les éléments basés sur des Composants Client ou côté serveur (JSX)
* Les [promesses](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise)

En particulier, les types suivants ne sont **pas** pris en charge :

* Les [fonctions](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) qui ne sont pas exportées par des modules marqués comme côté client, ou qui sont marquées avec [`'use server'`](/reference/react/use-server)
* Les [classes](https://developer.mozilla.org/fr/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Les objets de quelque classe que ce soit (hormis les classes natives explicitement listées plus haut) ainsi que les objets ayant [un prototype nul](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Les symboles non inscrits au global, ex. `Symbol('my new symbol')`

## Utilisation {/*usage*/}

### Utiliser de l'interactivité et un état local {/*building-with-interactivity-and-state*/}

<Sandpack>

```js src/App.js
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Compteur : {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

</Sandpack>

Dans la mesure où `Counter` utilise aussi bien le Hook `useState` que des gestionnaires d'événements pour incrémenter et décrémenter la valeur, ce composant doit être un Composant Client et nécessitera donc une directive `'use client'` tout en haut de son fichier.

Par opposition, un composant qui fait le rendu d'une UI non interactive n'aura pas besoin d'être un Composant Client.

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

Ici le composant parent de `Counter`, à savoir `CounterContainer`, ne requiert par exemple pas de directive `'use client'` puisqu'il n'est pas interactif et n'utilise aucun état.  Qui plus est, `CounterContainer` doit être un Composant Serveur puisqu'il lit le système de fichiers local du serveur, ce qui n'est possible que dans un Composant Serveur.

On trouve aussi des composants qui n'utilisent aucun aspect exclusif aux côtés serveur ou client, et sont donc agnostiques quant à leur environnement de rendu. Dans notre exemple précédent, c'est notamment le cas du composant `FancyText`.

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

On n'a ici pas besoin d'ajouter la directive `'use client'`, de sorte que c'est le *résultat* (et non le code source) de `FancyText` qui sera envoyé au navigateur lorsqu'il est utilisé comme Composant Serveur.  Comme l'appli d'exemple sur les citations inspirantes l'a montré, `FancyText` y est utilisé tant comme Composant Serveur que comme Composant Client, suivant les endroits qui l'importent et l'utilisent.

Mais si le HTML produit par `FancyText` s'avérait nettement plus lourd que son code source (dépendances comprises), il pourrait être utile, du point de vue des performances, de le forcer à toujours être un Composant Client. Les composants qui renvoient un énorme descriptif de chemin SVG sont un cas classique où le forçage d'un composant comme étant côté client peut s'avérer bénéfique.

### Utiliser des API réservées au côté client {/*using-client-apis*/}

Votre appli React utilise peut-être des API réservées au côté client, telles que des API web de stockage, de manipulation audio/vidéo ou d'interaction avec le matériel, [pour ne citer qu'elles](https://developer.mozilla.org/fr/docs/Web/API).

Dans le code qui suit, le composant utilise [l'API DOM](https://developer.mozilla.org/fr/docs/Glossary/DOM) pour manipuler un élément [`canvas`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/canvas). Dans la mesure où ces API ne sont disponibles que dans le navigateur, le composant doit être marqué comme étant côté client.

```js
'use client';

import {useRef, useEffect} from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### Utiliser des bibliothèques tierces {/*using-third-party-libraries*/}

Dans une appli React, il est fréquent de tirer parti de bibliothèques tierces pour gérer des approches UI courantes ou implémenter une logique récurrente.

Ces bibliothèques sont susceptibles de recourir aux Hooks ou à des API réservées au côté client.  Les composants tiers utilisant au moins une des API React suivantes doivent nécessairement être côté client :

* [createContext](/reference/react/createContext)
* Les Hooks fournis par [`react`](/reference/react/hooks) et [`react-dom`](/reference/react-dom/hooks), à l'exception de [`use`](/reference/react/use) et [`useId`](/reference/react/useId)
* [forwardRef](/reference/react/forwardRef)
* [memo](/reference/react/memo)
* [startTransition](/reference/react/startTransition)
* Toute API réservée au côté client, telle que l'insertion DOM ou les vues natives de la plateforme

Si ces bibliothèques ont été mises à jour pour être compatibles avec les React Server Components, elles inclueront alors d'emblée des marqueurs `'use client'` aux endroits pertinents, ce qui vous permettra de les utiliser directement depuis vos Composants Serveur.  Mais si une bibliothèque n'a pas été mise à jour, ou si un composant a besoin de props telles qu'un gestionnaire d'événement (qui ne peut être fourni que côté client), vous aurez peut-être besoin de créer votre propre fichier de Composant Client pour faire le lien entre les Composants Client tiers et les Composants Serveur au sein desquels vous aimeriez les utiliser.

[TODO]: <> (Troubleshooting - need use-cases)
