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

Un aspect fondamental des composants, c'est la composition : la capacité à construire des composants à partir d'autres composants. Lorsque nous [imbriquons des composants](/learn/your-first-component#nesting-and-organizing-components), nous manipulons les concepts de composants parent et enfants, sachant que chaque parent peut lui-même être un enfant d'un autre composant.

Lorsque nous faisons le rendu d'une appli React, nous pouvons modéliser ces relations sous forme d'un arbre, appelé l'arbre de rendu.

Voici une appli React qui affiche des citations inspirantes.

<Sandpack>

```js App.js
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

```js FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js InspirationGenerator.js
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

```js Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js quotes.js
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

L'arbre est constitué de nœuds, chacun représentant un composant. `App`, `FancyText`, `Copyright`, pour ne nommer qu'eux, sont tous des nœuds de notre arbre.

Le nœud racine dans un arbre de rendu React constitue le [composant racine](/learn/importing-and-exporting-components#the-root-component-file) de l'appli. Dans notre cas, le composant racine est `App`, et c'est le premier composant dont React fera le rendu. Chaque flèche dans l'arbre pointe d'un composant parent vers un composant enfant.

<DeepDive>

#### Où sont les balises HTML dans l'arbre de rendu ? {/*where-are-the-html-elements-in-the-render-tree*/}

Vous remarquerez que dans l'arbre de rendu ci-dessus, on ne trouve nulle part les balises HTML dont chaque composant fait le rendu. C'est parce que l'arbre de rendu n'est constitué que de [composants](learn/your-first-component#components-ui-building-blocks) React.

React, en tant que framework d'UI, est indépendant de la plateforme. Sur react.dev, nous mettons en avant des exemples qui font leur rendu sur le web, utilisant du balisage HTML pour leurs primitives d'UI. Mais une appli React pourrait tout aussi bien faire son rendu sur une plateforme mobile ou desktop, et recourir alors à d'autres primitives d'UI telles que [UIView](https://developer.apple.com/documentation/uikit/uiview) ou [FrameworkElement](https://learn.microsoft.com/fr-fr/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0).

Ces primitives d'UI spécifiques à une plateforme ne font pas partie de React. Les arbres de rendu de React vous renseignent sur votre appli React quelle que soit la plateforme visée par votre appli.

</DeepDive>

Un arbre de rendu représente une unique passe de rendu d'une application React. Si vous utilisez du [rendu conditionnel](/learn/conditional-rendering), un composant parent pourrait varier les enfants dont il fait le rendu, en fonction des données qu'il reçoit.

Nous pouvons mettre à jour l'appli pour qu'elle affiche de façon conditionnelle soit une citation, soit une couleur pour nous inspirer.

<Sandpack>

```js App.js
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

```js FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js InspirationGenerator.js
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

```js Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js inspirations.js
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

Même si les arbres de rendu peuvent varier d'un rendu à l'autre, ces arbres restent utiles pour identifier les composants racine et feuilles d'une appli React. Les composants de haut nivecau sont ceux les plus proches du composant racine, et peuvent impacter la performance de tous les composants en-dessous d'eux. Ce sont souvent eux qui ont la plus forte complexité. Les composants feuilles sont vers le bas de l'arbre, n'ont pas de composants enfants et refont souvent fréquemment leur rendu.

Il est utile de bien identifier ces catégories de composants pour comprendre le flux de données et les performances de votre appli.

## The Module Dependency Tree {/*the-module-dependency-tree*/}

Another relationship in a React app that can be modeled with a tree are an app's module dependencies. As we [break up our components](/learn/importing-and-exporting-components#exporting-and-importing-a-component) and logic into separate files, we create [JS modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) where we may export components, functions, or constants.

Each node in a module dependency tree is a module and each branch represents an `import` statement in that module.

If we take the previous Inspirations app, we can build a module dependency tree, or dependency tree for short.

<Diagram name="module_dependency_tree" height={250} width={658} alt="A tree graph with seven nodes. Each node is labelled with a module name. The top level node of the tree is labelled 'App.js'. There are three arrows pointing to the modules 'InspirationGenerator.js', 'FancyText.js' and 'Copyright.js' and the arrows are labelled with 'imports'. From the 'InspirationGenerator.js' node, there are three arrows that extend to three modules: 'FancyText.js', 'Color.js', and 'inspirations.js'. The arrows are labelled with 'imports'.">

The module dependency tree for the Inspirations app.

</Diagram>

The root node of the tree is the root module, also known as the entrypoint file. It often is the module that contains the root component.

Comparing to the render tree of the same app, there are similar structures but some notable differences:

* The nodes that make-up the tree represent modules, not components.
* Non-component modules, like `inspirations.js`, are also represented in this tree. The render tree only encapsulates components.
* `Copyright.js` appears under `App.js` but in the render tree, `Copyright`, the component, appears as a child of `InspirationGenerator`. This is because `InspirationGenerator` accepts JSX as [children props](/learn/passing-props-to-a-component#passing-jsx-as-children), so it renders `Copyright` as a child component but does not import the module.

Dependency trees are useful to determine what modules are necessary to run your React app. When building a React app for production, there is typically a build step that will bundle all the necessary JavaScript to ship to the client. The tool responsible for this is called a [bundler](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem), and bundlers will use the dependency tree to determine what modules should be included.

As your app grows, often the bundle size does too. Large bundle sizes are expensive for a client to download and run. Large bundle sizes can delay the time for your UI to get drawn. Getting a sense of your app's dependency tree may help with debugging these issues.

[comment]: <> (perhaps we should also deep dive on conditional imports)

<Recap>

* Trees are a common way to represent the relationship between entities. They are often used to model UI.
* Render trees represent the nested relationship between React components across a single render.
* With conditional rendering, the render tree may change across different renders. With different prop values, components may render different children components.
* Render trees help identify what the top-level and leaf components are. Top-level components affect the rendering performance of all components beneath them and leaf components are often re-rendered frequently. Identifying them is useful for understanding and debugging rendering performance.
* Dependency trees represent the module dependencies in a React app.
* Dependency trees are used by build tools to bundle the necessary code to ship an app.
* Dependency trees are useful for debugging large bundle sizes that slow time to paint and expose opportunities for optimizing what code is bundled.

</Recap>

[TODO]: <> (Add challenges)
