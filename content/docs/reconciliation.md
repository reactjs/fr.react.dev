---
id: reconciliation
title: Réconciliation
permalink: docs/reconciliation.html
---

React fournit une API déclarative afin que vous n'ayez pas à vous soucier de savoir ce qui change exactement lors de chaque mise à jour. Cela facilite grandement l'écriture d'applications, mais la manière dont cela est fait dans React n'est pas forcément évident. Cet article explique les choix que nous avons fait dans l'algorithme de comparaison de façon à rendre prévisibles les mises à jour des composants tout en étant suffisament rapides pour des applications hautes performances.

## Motivation {#motivation}

Quand vous utilisez React, à un moment donné, vous pouvez utiliser la fonction `render()` pour créer un arbre d'éléments React. Lors de l'état suivant, ou de la mise à jour des propriétés, cette fonction `render()` renverra un arbre différent d'éléments React. React doit alors détérminer comment mettre à jour efficacement l'interface utilisateur pour qu'elle corresponde à l'arbre le plus récent.

Il existe des solutions génériques à ce problème algorithmique consistant à générer le nombre minimal d'opérations pour transformer un arbre en un autre. Néanmoins, [les algorithmes à la point de l'état de l'art](http://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf) ont une complexité de l'ordre de O(n<sup>3</sup>) où n est le nombre d'éléments dans l'arbre.

Si nous utilisions cela dans React, l'affichage de 1000 éléments nécessiterait environ un milliard d'opérations. Cela est beaucoup trop coûteux. React implémente plutôt un algorithme heuristique en O(n) basé sur deux hypothèses :

1. Deux éléments de types différents produiront des arbres différents.
2. Le développeur peut indiquer quels éléments peuvent être stables sur différents rendus grâce à la propriété `key`.

En pratique, ces hypothèses sont valables dans presque tous les cas.

## L'algorithme de comparaison {#the-diffing-algorithm}

En comparant deux arbres, React va commencer par comparer les éléments racines. Le comportement est différent selon le type des éléments racines.

### Éléments de types différents {#elements-of-different-types}

Chaque fois que les éléments racines ont des types différents, React va casser l'ancien arbre et reconstruire le nouvel arbre de zéro. Partir de `<a>` vers `<img>`, ou de `<Article>` vers `<Comment>`, ou de `<Button>` vers `<div>` — tous aboutiront à une reconstruction complète.

Lors de la destruction d'un arbre, les anciens nœuds DOM sont détruits. Les instances des composants reçoivent `componentWillUnmount()`. Lors de la construction d'un nouvel arbre, les nouveaux nœuds sont insérés dans le DOM. Les instances de composants reçoivent `componentWillMount()` puis `componentDidMount()`. Tous les états associés à l'ancien arbre sont perdus.

Tous les composants au-dessous de la racine seront également démontés et leur état détruit. Par exemple, en comparant :

```xml
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

Cela détruira l'ancien `Counter` puis en remontera un nouveau.

### Éléments DOM de même type {#dom-elements-of-the-same-type}

Lors de la comparaison entre deux éléments DOM React de même type, React examine les attributs des deux, conserve le même nœud DOM sous-jacent, et ne met à jour que les attributs modifiés. Par exemple :

```xml
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

En comparant ces deux éléments, React sait qu'il ne faut modifier que le `className` du nœud DOM sous-jacent.

Lors d'une mise à jour du `style`, React sait aussi ne mettre à jour que les propriétés qui ont changé. Par exemple :

```xml
<div style={{color: 'red', fontWeight: 'bold'}} />

<div style={{color: 'green', fontWeight: 'bold'}} />
```

Lors de la conversion entre les deux éléments, React sait qu'il ne doit modifier que le style `color` et pas `fontWeight`.

Après avoir manipulé le nœud DOM, React réitère sur les enfants.

### Éléments composants de même type {#component-elements-of-the-same-type}

Lorsqu'un composant est mis à jour, l'instance reste la même, afin que l'état soit maintenu entre les rendus. React met à jour les propriétés des instances des composants sous-jacents pour correspondre au nouvel élément, et appelle `componentWillReceiveProps()` et `componentWillUpdate()` sur l'instance sous-jacente.

Ensuite, la méthode `render()` est appelée et l'algorithme de comparaison réitère sur le résultat précédent et le nouveau résultat.

### Réitération sur les enfants {#recursing-on-children}

Par défaut, en réitérant sur les enfants d'un nœud DOM, React effectue une itération simultanée sur les deux listes d'enfants et procède à un changement chaque fois qu'il y a une différence.

Par exemple, lors de l'ajout d'un élément à la fin des enfants, la conversion entre les deux arbres fonctionne bien :

```xml
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

React fera correspondre les deux arbres `<li>first</li>`, les deux arbres `<li>second</li>`, et insérera l'arbre `<li>third</li>`.

Si vous l'implémentez de façon naïve, l'insertion d'un élément au début aura de moins bonnes performances. Par exemple, la conversion entre ces deux arbres fonctionnera assez mal :

```xml
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

React va modifier chacun des enfants plutôt que de réaliser qu'il pouvait garder les sous-arbres `<li>Duke</li>` et `<li>Villanova</li>` intacts. Cette inefficacité peut être un problème.

### Clés {#keys}

Afin de résoudre ce problème, React prend en charge l'attribut `key`. Quand des enfants ont cette clé, React l'utilise pour faire correspondre les enfants de l'arbre d'origine avec les enfants de l'arbre suivant. Par exemple, l'ajout d'une `key` dans notre exemple inefficace peut rendre la conversion de l'arbre plus efficace :

```xml
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

Désormais, React sait que l'élément avec la clé `'2014'` est le nouvel élément, et que les éléments avec les clés `'2015'` et `'2016'` ont été déplacés.

En pratique, trouver une clé n'est généralement pas difficile. L'élément que vous allez afficher peut déjà disposer d'un identifiant unique, la clé provenant alors de vos données :

```js
<li key={item.id}>{item.name}</li>
```

Quand ce n'est pas le cas, vous pouvez ajouter une nouvelle propriété d'identification à votre modèle, ou hacher certaines parties de votre contenu pour générer une clé. La clé doit être unique parmi ses autres éléments frères, pas nécessairement au niveau global.

En dernier recours, vous pouvez utiliser l'index de l'élément dans un tableau comme clé. Cela fonctionne correctement si les éléments ne sont jamais réordonnés, dans le cas contraire ce serait assez lent.

Les tris peuvent également causer des problèmes avec les états des composants quand les index sont utilisés comme des clés. Les instances des composants sont mises à jour et réutilisées en fonction de leur clé. Si la clé est un index, déplacer un élément changera sa clé. En conséquence, l'état des composants utilisés pour des saisies non contrôlées peut se mélanger et se mettre à jour de manière inattendue.

[Voici](codepen://reconciliation/index-used-as-key) un exemple sur CodePen des problèmes qui peuvent être causés en utilisant des index comme clés. [Voilà](codepen://reconciliation/no-index-used-as-key) une version mise à jour du même exemple montrant comment, en évitant d'utiliser les index comme clé, on résoudra ces problèmes de réarrangement, de tri et d'ajout préalable.

## Compromis {#tradeoffs}

Il est important de se souvenir que l'algorithme de réconciliation est un détail d'implémentation. React pourrait refaire le rendu de l'ensemble de l'arbre à chaque action ; le résultat final serait le même. Pour être clair, refaire le rendu dans ce contexte signifie appeler `render` sur tous les composants, cela ne signifie pas que React les démontera et remontera. Il n'appliquera que les différences selon les règles énoncées dans les chapitres précédents.

Nous affinons régulièrement les heuristiques afin d'accélérer les cas d'utilisation courants. Dans l'implémentation actuelle, vous pouvez exprimer le fait qu'un sous-arbre a été déplacé parmi ses frères, mais vous ne pouvez pas dire qu'il a été déplacé ailleurs. L'algorithme va refaire le rendu de l'ensemble du sous-arbre.

Puisque React se repose sur des heuristiques, les performances en pâtiront si les hypothèses derrière celles-ci ne sont pas satisfaites.

1. L'algorithme n'essaiera pas de faire correspondre des sous-arbres de types de composants différents. Si vous êtes amenés à alterner entre deux types de composants au rendu très similaire, vous devriez peut-être en faire un type unique. En pratique, nous ne considérons pas cela comme un problème.

2. Les clés doivent être stables, prévisibles et uniques. Des clés instables (comme celles produites par `Math.random()`) engendreront la recréation de nombreuses instances de composants et de nœuds DOM, ce qui peut entraîner une dégradation des performances et une perte d'état dans les composants enfants.
