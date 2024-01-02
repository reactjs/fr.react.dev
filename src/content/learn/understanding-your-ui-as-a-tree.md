---
title: Votre UI vue comme un arbre
---

<Intro>

Votre appli React prend forme, et de nombreux composants sont imbriqués les uns dans les autres. Comment React garde-t-il trace de la structure de composants de votre appli ?

React, comme de nombreuses autres bibliothèques d'UI, modélise l'UI comme un arbre. Penser à votre appli comme à un arbre s'avère utile pour comprendre les relations entre les composants. Ça vous aidera à déboguer des questions ultérieures telles que l'optimisation des performances ou la gestion d'état.

</Intro>

<YouWillLearn>

* Comment React « voit » les structures de composants
* Ce qu'est un arbre de rendu, et en quoi il est utile
* Ce qu'est un arbre de dépendances de modules, et à quoi il sert

</YouWillLearn>

## Votre UI vue comme un arbre {/*your-ui-as-a-tree*/}

Les arbres sont un modèle relationnel entre des éléments, et l'UI est souvent représentée au moyen de structures arborescentes. Les navigateurs utilisent par exemple des arbres pour modéliser HTML (le [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) et CSS (le [CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)). Les plateformes mobiles utilisent aussi des arbres pour représenter leurs hiérarchies de vues.

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Un diagramme avec trois sections disposées horizontalement. Dans la première section, on trouve trois rectangles empilés verticalement, avec pour libellés « Composant A », « Composant B » et « Composant C ». Une flèche libellée « React », avec le logo React, fait la transition vers le panneau suivant. La section du milieu contient un arbre de composants, avec une racine libellée « A » et deux enfants libellés « B » et « C ». Une flèche libellée « React DOM », là encore avec le logo React, fait la transition vers le dernier panneau. Cette troisième section représente une maquette du navigateur contenant un arbre avec 8 nœuds, dont seul un sous-ensemble est mis en avant (qui représente l’arbre de la section du milieu).">

React crée un arbre de l’UI à partir de vos composants. Dans cet exemple, l’arbre d’UI est utilisé pour produire le DOM.
</Diagram>

Tout comme les navigateurs et plateformes mobiles, React utilise des structures de données arborescentes pour gérer et modéliser les relations entre les composants dans une appli React. Ces arbres constituent des outils bien utiles pour comprendre la circulation des données au travers d'une appli React, et voir comment en optimiser le rendu et la taille du code.

## L'arbre de rendu {/*the-render-tree*/}

Un aspect fondamental des composants, c'est la composition : la capacité à construire des composants à partir d'autres composants. Lorsque nous [imbriquons des composants](/learn/your-first-component#nesting-and-organizing-components), nous manipulons les concepts de composants parents et enfants, sachant que chaque parent peut lui-même être un enfant d'un autre composant.

Lorsque nous faisons le rendu d'une appli React, nous pouvons modéliser ces relations sous forme d'un arbre, appelé l'arbre de rendu.

Voici une appli React qui affiche des citations inspirantes.

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
import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

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

```js src/quotes.js
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

<Diagram name="render_tree" height={250} width={500} alt="Un graphe d’arbre avec cinq nœuds. Chaque nœud représente un composant. La racine de l’arbre est App, avec deux flèches qui en partent vers 'InspirationGenerator' et 'FancyText'. Les flèches portent le descripteur de relation « fait le rendu de ». Le nœud 'InspirationGenerator' a aussi deux flèches qui en partent pour aller vers les nœuds 'FancyText' et 'Copyright'.">

React crée un *arbre de rendu*, un arbre d'UI, constitué des composants dont on a fait le rendu.

</Diagram>

À partir de l'appli d'exemple, nous pouvons construire l'arbre de rendu ci-dessus.

L'arbre est constitué de nœuds, chacun représentant un composant. `App`, `FancyText`, `Copyright`, pour ne citer qu'eux, sont tous des nœuds de notre arbre.

Le nœud racine dans un arbre de rendu React constitue le [composant racine](/learn/importing-and-exporting-components#the-root-component-file) de l'appli. Dans notre cas, le composant racine est `App`, et c'est le premier composant dont React fera le rendu. Chaque flèche dans l'arbre pointe d'un composant parent vers un composant enfant.

<DeepDive>

#### Où sont les balises HTML dans l'arbre de rendu ? {/*where-are-the-html-elements-in-the-render-tree*/}

Vous remarquerez que dans l'arbre de rendu ci-dessus, on ne trouve nulle part les balises HTML utilisées par les composants. C'est parce que l'arbre de rendu est constitué uniquement par les [composants](learn/your-first-component#components-ui-building-blocks) React.

React, en tant que framework d'UI, est indépendant de la plateforme. Sur react.dev, nous mettons en avant des exemples qui font leur rendu sur le web, utilisant du balisage HTML pour leurs primitives d'UI. Mais une appli React pourrait tout aussi bien faire son rendu sur une plateforme mobile ou desktop, et recourir alors à d'autres primitives d'UI telles que [UIView](https://developer.apple.com/documentation/uikit/uiview) ou [FrameworkElement](https://learn.microsoft.com/fr-fr/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0).

Ces primitives d'UI spécifiques à une plateforme ne font pas partie de React. Les arbres de rendu de React vous renseignent sur votre appli React quelle que soit la plateforme visée par votre appli.

</DeepDive>

Un arbre de rendu représente une unique passe de rendu d'une application React. Si vous utilisez du [rendu conditionnel](/learn/conditional-rendering), un composant parent pourrait modifier les enfants qu'il utilise, selon les données qu'il reçoit.

Nous pouvons mettre à jour l'appli pour qu'elle affiche de façon conditionnelle soit une citation, soit une couleur pour nous inspirer.

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

```js src/Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';
import Color from './Color';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const inspiration = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Voici votre {inspiration.type === 'quote' ? 'citation' : 'couleur'} inspirante :</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

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
  {type: 'quote', value: "Ne laisse pas hier occuper trop d’aujourd’hui. — Will Rogers"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "L’ambition, c’est poser une échelle contre le ciel."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "Une joie partagée compte double."},
  {type: 'color', value: "#F9F2B4"},
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
.colorbox {
  height: 100px;
  width: 100px;
  margin: 8px;
}
```
</Sandpack>

<Diagram name="conditional_render_tree" height={250} width={561} alt="Un graphe d’arbre avec six nœuds. Le nœud racine de l’arbre est 'App', avec deux flèches qui en partent vers 'InspirationGenerator' et 'FancyText'. Les flèches utilisent un trait continu et portent le descripteur de relation « fait le rendu de ». Le nœud 'InspirationGenerator' a quant à lui trois flèches qui en partent. Celles vers les nœuds 'FancyText' et 'Copyright' utilisent un trait discontinu et portent le descripteur « fait le rendu de ? ». La troisième flèche, qui va vers le nœud 'Copyright', utilise un trait continu et porte le descripteur « fait le rendu de ».">

Avec le rendu conditionnel, d'un rendu à l'autre, l'arbre de rendu peut différer entre les composants.

</Diagram>

Dans cet exemple, selon la valeur de `inspiration.type`, nous pouvons afficher soit `<FancyText>` soit `<Color>`. L'arbre de rendu peut être différent d'une passe de rendu à l'autre.

Même si les arbres de rendu peuvent varier d'un rendu à l'autre, ces arbres restent utiles pour identifier les composants *racines* et *feuilles* d'une appli React. Les composants de haut niveau sont ceux les plus proches du composant racine, et peuvent impacter la performance de tous les composants en-dessous d'eux. Ce sont souvent eux qui ont la plus forte complexité. Les composants feuilles sont vers le bas de l'arbre, n'ont pas de composants enfants et refont fréquemment leur rendu.

Il est utile de bien identifier ces catégories de composants pour comprendre le flux de données et les performances de votre appli.

## L'arbre de dépendances de modules {/*the-module-dependency-tree*/}

Les arbres peuvent modéliser un autre type de relations dans une appli React : les dépendances entre modules de l'appli. Lorsque nous [découpons nos composants](/learn/importing-and-exporting-components#exporting-and-importing-a-component) et leur logique en fichiers distincts, nou créons des [modules JS](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) d'où nous pouvons exporter des composants, des fonctions ou encore des constantes.

Chaque nœud dans un arbre de dépendances de modules représente un module, et chaque branche représente une instruction `import` dans ce module.

Si nous reprenons l'appli d'Inspirations précédente, nous pouvons construire un arbre de dépendances de modules (ou « arbre de dépendances », pour faire plus court).

<Diagram name="module_dependency_tree" height={250} width={658} alt="Un graphe d’arbre avec sept nœuds. Chaque nœud est libellé par un nom de module. Le nœud racine de l’arbre est libellé 'App.js', avec trois flèches qui en partent vers les modules 'InspirationGenerator.js', 'FancyText.js' et 'Copyright.js'. Les flèches portent le descripteur de relation « importe ». Le nœud 'InspirationGenerator.js' a aussi trois flèches qui en partent pour aller vers les modules 'FancyText.js', 'Color.js' et 'inspirations.js', toutes trois porteuses du descripteur « importe ».">

L'arbre de dépendances de modules pour l'appli Inspirations.

</Diagram>

Le nœud racine de l'arbre constitue le module racine, également appelé point d'entrée. C'est souvent lui qui contient le composant racine.

Si on compare avec l'arbre de rendu pour la même appli, on trouve des similitudes aussi bien que des différences significatives :

* Les nœuds qui constituent l'arbre représentent des modules, pas des composants.
* Les modules sans composants, tels que `inspirations.js`, sont également visibles dans cet arbre. L'arbre de rendu ne représente que les composants.
* `Copyright.js` apparaît sous `App.js` alors que dans l'arbre de rendu, le composant `Copyright` est un enfant de `InspirationGenerator`.  C'est parce qu'`InspirationGenerator` accepte du JSX comme [prop `children`](/learn/passing-props-to-a-component#passing-jsx-as-children), de sorte qu'il fait le rendu du composant enfant `Copyright` sans en importer le module.

Les arbres de dépendances sont utiles pour déterminer de quels modules votre appli React a besoin. Lorsque vous faites le *build* d'une appli React en mode production, vous utilisez généralement un outil dédié pour cela. Ce type d'outil est appelé [*bundler*](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem), et les *bundlers* se basent sur l'arbre de dépendances pour déterminer quels modules inclure.

Au fil de la croissance de votre appli, la taille du *bundle* croît aussi. Les *bundles* massifs sont coûteux à télécharger et à exécuter pour le client. Ils peuvent retarder l'affichage de votre UI.  Avoir une bonne perception de l'arbre de dépendances de votre appli peut vous aider à déboguer ce type de problèmes.

[comment]: <> (perhaps we should also deep dive on conditional imports)

<Recap>

* Les arbres sont couramment utilisés pour représenter les relations entre des entités. On les utilise notamment pour modéliser les UI.
* Les arbres de rendu représent les imbrications entre les composants React au sein d'un unique rendu.
* Le recours au rendu conditionnel peut faire varier l'arbre de rendu d'un rendu à l'autre. Selon les valeurs des props reçues, les composants peuvent afficher divers composants enfants.
* Les arbres de rendu aident à repérer les composants racine et feuilles. Les composants situés haut dans l'arbre peuvent impacter la performance de rendu de tous ceux situés en-dessous d'eux, et les composants feuilles refont fréquemment leur rendu. En les identifiant, on facilite la compréhension et le débogage de la performance de rendu.
* Les arbres de dépendances représentent les dépendances entre modules d'une appli React.
* Les arbres de dépendances sont utilisés par les outils de *build* pour inclure le code nécessaire au déploiement d'une appli.
* Les arbres de dépendances aident à comprendre les raisons de bundles massifs, qui ralentissent l'affichage, et à percevoir des opportunités d'optimisation des éléments de code à inclure.

</Recap>

[TODO]: <> (Add challenges)
