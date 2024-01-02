---
title: Rendu et Commit
---

<Intro>

Avant que vos composants ne soient affichés à l'écran, React doit en effectuer le rendu.  Bien comprendre les étapes de ce processus vous aidera à réfléchir à l'exécution de votre code de façon à en expliquer le comportement.

</Intro>

<YouWillLearn>

- Ce que signifie « rendu » en React
- Quand et pourquoi React fait le rendu d'un composant
- Les étapes nécessaires à l'affichage d'un composant à l'écran
- Pourquoi le rendu n'entraîne pas toujours une mise à jour du DOM

</YouWillLearn>

Imaginons que vos composants soient les membres d'une brigade de cuisine, qui confectionnent de savoureux plats à partir d'ingrédients de base.  Dans ce cas, React serait le serveur qui transmet les commandes des clients et leur ramène leurs plats.  Ce processus de requêtes et réponses liées à l'interface utilisateur *(UI pour User Interface, NdT)* comporte trois étapes :

1. Le **déclenchement** du rendu (on transmet la commande du client à la cuisine)
2. Le **rendu** du composant (on prépare la commande en cuisine)
3. Le **commit** (la retranscription des changements) dans le DOM (on amène les plats sur la table)

<IllustrationBlock sequential>
  <Illustration caption="Déclenchement" alt="React est le serveur d’un restaurant, qui récupère les commandes des clients et les transmet à la Cuisine des Composants." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Rendu" alt="Le Chef des Cards fournit à React un composant Card fraîchement préparé." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React amène le Card à la table de l'utilisateur." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## Étape 1 : déclenchement d’un rendu {/*step-1-trigger-a-render*/}

Il y a deux déclencheurs possibles pour le rendu d'un composant :

1. On est sur le **rendu initial** du composant.
2. Dans le composant (ou un de ses ancêtres), **l'état local a été mis à jour**.

### Rendu initial {/*initial-render*/}

Lorsque votre appli démarre, vous devez déclencher le rendu initial. Les frameworks et bacs à sable masquent parfois le code qui en est responsable, mais ça se fait en appelant [`createRoot`](/reference/react-dom/client/createRoot) avec le nœud DOM cible, puis en appelant la méthode  `render` avec votre composant :

<Sandpack>

```js src/index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js src/Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' par Eduardo Catalano : une sculpture de fleur métallique gigantesque avec des pétales réfléchissants."
    />
  );
}
```

</Sandpack>

Essayez de commenter l'appel à `root.render()` pour voir votre composant disparaître !

### Nouveaux rendus suite à des mises à jour d'état {/*re-renders-when-state-updates*/}

Une fois que le composant a fait son rendu initial, vous pouvez déclencher des rendus supplémentaires en mettant à jour son état au moyen d'une [fonction `set`](/reference/react/useState#setstate). Mettre à jour l'état local d'un composant met automatiquement un rendu en file d'attente. (C'est un peu comme le convive d'un restaurant qui commanderait du thé, un dessert et plein d'autres choses après avoir passé sa commande initiale, en fonction de l'état de sa faim et de sa soif.)

<IllustrationBlock sequential>
  <Illustration caption="Une mise à jour d'état…" alt="React est le serveur d’un restaurant, qui sert une UI Card à l'utilisateur, représenté par une convive avec un curseur en guise de tête.  La cliente indique alors qu'elle veut une carte rose, pas une carte noire !" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="…déclenche…" alt="React retourne dans la Cuisine des Composants et indique au Chef des Cards qu'il a besoin d'une Card rose." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="…un rendu !" alt="Le Chef des Cards donne une Card rose à React." src="/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

## Étape 2 : rendu des composants par React {/*step-2-react-renders-your-components*/}

Après que vous avez déclenché un rendu, React appelle vos composants pour déterminer ce qu'il doit afficher à l'écran. **Le « rendu », c'est React qui appelle vos composants.**

- **Lors du rendu initial**, React appelle le composant racine.
- **Lors des rendus suivants**, React appellera les fonctions composants dont une mise à jour de l'état local a déclenché le rendu.

Ce processus est récursif : si le composant mis à jour renvoie un autre composant, React fera le rendu de *ce* composant-là ensuite, et si ce dernier renvoie à son tour un autre composant, il fera le rendu de *ce* composant-là, et ainsi de suite.  Le processus continue jusqu'à ce qu'il ne reste plus de composants imbriqués à traiter, pour que React sache exactement ce qu'il doit afficher à l'écran.

Dans l'exemple qui suit, React appellera `Gallery()`, puis plusieurs fois `Image()` :

<Sandpack>

```js src/Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>Sculptures inspirantes</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="Floralis Genérica' par Eduardo Catalano : une sculpture de fleur métallique gigantesque avec des pétales réfléchissants."
    />
  );
}
```

```js src/index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

- **Lors du rendu initial**, React [créera les nœuds DOM](https://developer.mozilla.org/fr/docs/Web/API/Document/createElement) pour les balises `<section>`, `<h1>` et les trois `<img>`.
- **Lors des rendus ultérieurs**, React déterminera si certaines de leurs propriétés ont changé depuis le rendu précédent. Il gardera cette information au chaud jusqu'à l'étape suivante : la phase de commit.

<Pitfall>

Le rendu doit toujours être un [calcul pur](/learn/keeping-components-pure) :

- **Mêmes entrées, mêmes sorties.**  Pour les mêmes données en entrée, un composant devrait toujours produire le même JSX. (Lorsque vous commandez une salade de tomates, vous ne devriez pas voir arriver une salade de concombres !)
- **On se mêle de ses affaires.**  Un composant ne devrait pas modifier des objets ou variables qui existaient avant le rendu. (Une commande donnée ne devrait pas changer la commande de quelqu'un d'autre.)

En enfreignant ces règles, attendez-vous à des bugs déroutants et des comportements inattendus au fil de la croissance de votre base de code.  Lorsqu'on développe en « Mode Strict », React appelle deux fois la fonction de chaque composant, ce qui aide à repérer les erreurs dues à des fonctions « impures ».

</Pitfall>

<DeepDive>

#### Optimiser les performances {/*optimizing-performance*/}

Le comportement par défaut, qui fait le rendu de tous les composants enveloppés par le composant mis à jour, n'est pas optimal pour les performances lorsque le composant mis à jour est situé très haut dans l'arbre.  Si vous constatez un souci avéré de performances, vous disposez de plusieurs options à mettre en place explicitement pour résoudre ça ; elles sont décrites dans la section [Performance](https://fr.legacy.reactjs.org/docs/optimizing-performance.html). **Évitez les optimisations prématurées !**

</DeepDive>

## Étape 3 : commit dans le DOM par React {/*step-3-react-commits-changes-to-the-dom*/}

Après avoir fait le rendu de vos composants (c'est-à-dire après avoir appelé leurs fonctions), React devra mettre à jour le DOM.

- **Lors du rendu initial**, React utilisera l'API DOM [`appendChild()`](https://developer.mozilla.org/fr/docs/Web/API/Node/appendChild) pour retranscrire à l'écran tous les nœuds DOM qu'il a créés.
- **Lors des rendus ultérieurs**, React s'attachera à effectuer le strict minimum d'opérations nécessaires (qu'il aura déterminées lors de la phase de rendu !) pour mettre le DOM en correspondance avec le résultat du dernier rendu en date.

**React ne modifie les nœuds DOM que s'il y a un écart d'un rendu à l'autre.**  Par exemple, voici un composant qui refait son rendu avec des props différentes passées depuis son parent à chaque seconde.  Remarquez que vous pouvez ajouter du texte dans l'`<input>`, modifier sa `value`, mais le texte ne disparaît pas quand le composant refait son rendu :

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

Ça fonctionne parce qu'à l'étape précédente (le rendu), React n'a mis à jour que le contenu du `<h1>`, avec le nouveau `time`.  Il constate qu'un `<input/>` est présent dans le JSX au même endroit que la dernière fois, avec les mêmes props (il n'en a pas), aussi React ne touche-t-il pas à l'`<input/>`--encore moins à sa `value` !

## Épilogue : dessin par le navigateur *(Browser Paint)* {/*epilogue-browser-paint*/}

Une fois que React a mis à jour le DOM en se basant sur les résultats du rendu, le navigateur va devoir redessiner l'écran. Même si ce procédé est souvent appelé « rendu » *(“rendering”, NdT)*, nous parlerons plutôt dans cette documentation de « dessin » *(“painting”, NdT)* pour éviter toute confusion.

<Illustration alt="Un navigateur dessine « nature morte avec l’élément carte »." src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

- Toute mise à jour à l'écran dans une appli React se déroule en trois temps :
  1. Déclenchement
  2. Rendu
  3. Commit
- Vous pouvez tirer parti du Mode Strict pour repérer les erreurs dans vos composants
- React ne touchera pas au DOM si le résultat du rendu est identique d'une fois sur l'autre

</Recap>
