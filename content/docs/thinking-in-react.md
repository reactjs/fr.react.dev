---
id: thinking-in-react
title: Penser en React
permalink: docs/thinking-in-react.html
redirect_from:
  - 'blog/2013/11/05/thinking-in-react.html'
  - 'docs/thinking-in-react-zh-CN.html'
prev: composition-vs-inheritance.html
---

React est, à notre avis, la meilleure façon de créer des applis web vastes et performantes en JavaScript. Il a très bien tenu le coup pour nous, à Facebook et Instagram.

L'un des nombreux points forts de React, c’est la façon dont il vous fait penser aux applis pendant que vous les créez. Dans ce document, nous vous guiderons à travers l'élaboration avec React d'un tableau de données de produits proposant filtrage et recherche.

## Commençons par une maquette {#start-with-a-mock}

Imaginez que nous avons déjà une API JSON et une maquette de notre designer. La maquette ressemble à ceci :

![Maquette](../images/blog/thinking-in-react-mock.png)

Notre API JSON renvoie des données qui ressemblent à ceci :

```
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

## Étape 1 : décomposer l'interface utilisateur en une hiérarchie de composants {#step-1-break-the-ui-into-a-component-hierarchy}

Pour commencer, dessinez des cases autour de chaque composant (et sous-composant) sur la maquette, et attribuez un nom à chacune. Si vous travaillez avec un designer, il se peut qu'elle l'ait déjà fait, alors allez lui parler ! Ses noms de calques Photoshop pourraient devenir les noms de vos composants React !

Mais comment savoir quelles parties devraient disposer de leurs propres composants ? Utilisez les mêmes techniques que lorsque vous décidez de créer une nouvelle fonction ou un nouvel objet. L'une de ces techniques est le [principe de responsabilité unique](https://fr.wikipedia.org/wiki/Principe_de_responsabilité_unique), qui stipule qu'un composant ne devrait idéalement faire qu'une seule chose. S'il finit par grossir, il devrait être décomposé en sous-composants plus petits.

Comme vous affichez souvent un modèle de données JSON à un utilisateur, vous constaterez que si votre modèle a été correctement construit, votre interface utilisateur (et donc la structure de vos composants) correspondra aisément. En effet, l'interface utilisateur (UI) et les modèles de données tendent à adhérer à la même *architecture d'information*. Séparez votre UI en composants, où chaque composant représente juste un élément de votre modèle de données.

![Schéma des composants](../images/blog/thinking-in-react-components.png)

Vous pouvez voir que nous avons cinq composants dans notre petite appli. Nous avons mis en italiques les données que chaque composant représente.

  1. **`FilterableProductTable` (orange) :** contient l'intégralité de l'exemple
  2. **`SearchBar` (bleu) :** reçoit toutes les *données saisies par l'utilisateur*
  3. **`ProductTable` (vert) :** affiche et filtre la *collection de données* en fonction des *données saisies par l'utilisateur*
  4. **`ProductCategoryRow` (turquoise) :** affiche un titre pour chaque *catégorie*
  5. **`ProductRow` (rouge) :** affiche une ligne pour chaque *produit*

Si vous regardez `ProductTable`, vous verrez que l'en-tête du tableau (contenant les titres “Name” et “Price”) n'a pas son propre composant. C'est une question de préférence, et honnêtement les deux se valent. Dans cet exemple, nous l'avons laissé au sein de `ProductTable` car il fait partie de l’affichage de la *collection de données*, qui est de la responsabilité de `ProductTable`. Cependant, si cet en-tête devenait complexe (par exemple, si nous devions ajouter des options de tri), il deviendrait logique d'en faire son propre composant `ProductTableHeader`.

Maintenant que nous avons identifié les composants dans notre maquette, organisons-les en hiérarchie. Les composants qui apparaissent dans un autre composant sur la maquette doivent apparaître comme enfants dans cette hiérarchie :

  * `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
      * `ProductCategoryRow`
      * `ProductRow`

## Étape 2 : construire une version statique avec React {#step-2-build-a-static-version-in-react}

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">Voir le Pen <a href="https://codepen.io/gaearon/pen/BwWzwm">Penser en React : Étape 2</a> sur <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Maintenant que vous avez votre hiérarchie de composants, il est temps d'implémenter votre appli. La façon la plus simple consiste à construire une version qui prend votre modèle de données et affiche une UI inerte. Il est préférable de découpler ces processus, car la construction d'une version statique nécessite beaucoup de code et aucune réflexion, alors qu’ajouter de l'interactivité demande beaucoup de réflexion et peu de code. Nous verrons pourquoi.

Pour créer une version statique de votre appli qui affiche votre modèle de données, vous devrez créer des composants qui en réutilisent d'autres et transmettent les données au moyen des *props*. Les *props* sont un moyen de transmettre des données de parent à enfant. Si vous êtes à l’aise avec le concept d'*état local*, **n'utilisez pas d'état local du tout** pour construire cette version statique. L'état local est réservé à l'interactivité, c'est-à-dire aux données qui évoluent dans le temps. Comme il s'agit d'une version statique de l'appli, vous n'en avez pas besoin.

Vous pouvez construire l’appli en partant de l’extérieur ou de l’intérieur. En d'autres termes, vous pouvez aussi bien commencer par construire les composants les plus hauts dans la hiérarchie (dans notre cas, `FilterableProductTable`), que par ceux les plus bas (`ProductRow`). Dans des exemples plus simples, il est généralement plus facile de partir de l’extérieur, et sur des projets plus importants, il est plus facile de partir de l’intérieur et d'écrire les tests au fil de la construction.

À la fin de cette étape, vous disposerez d'une bibliothèque de composants réutilisables qui afficheront votre modèle de données. Les composants n'auront que des méthodes `render()` puisque c'est une version statique de l'application. Le composant au sommet de la hiérarchie (`FilterableProductTable`) prendra votre modèle de données en tant que *prop*. Si vous modifiez les données et appelez `ReactDOM.render()` à nouveau, l’UI sera mise à jour. On comprend comment votre UI est mise à jour et où y apporter des modifications, car il n'y a rien de compliqué. **Le flux de données unidirectionnel** de React (également appelé *liaison unidirectionnelle*) permet de maintenir la modularité et la rapidité de l'ensemble.

Jetez un œil à la [doc de React](/docs/) si vous avez besoin d'aide pour cette étape.

### Petit entracte : props ou état ? {#a-brief-interlude-props-vs-state}

Il existe deux types de données dans le « modèle » de React : les props et l'état local. Il est important de bien comprendre la distinction entre les deux ; jetez un coup d’œil à [la doc officielle de React](/docs/state-and-lifecycle.html) si vous n'êtes pas sûr·e de la différence. Vous pouvez aussi consulter la [FAQ : Quelle est la différence entre `state` et `props` ?](/docs/faq-state.html#what-is-the-difference-between-state-and-props)

## Étape 3 : déterminer le contenu minimal (mais suffisant) de l’état de l’UI {#step-3-identify-the-minimal-but-complete-representation-of-ui-state}

Pour rendre votre UI interactive, vous devez pouvoir déclencher des modifications à votre modèle de données. React utilise pour cela l'**état local**.

Afin de construire correctement votre appli, vous devez d'abord penser à l'état modifiable minimal dont votre appli a besoin. La règle est simple : [*ne vous répétez pas*](https://fr.wikipedia.org/wiki/Ne_vous_r%C3%A9p%C3%A9tez_pas) *(Don’t Repeat Yourself, aussi désigné par l’acronyme DRY, NdT)*. Déterminez la représentation la plus minimale possible de l'état dont votre appli a besoin, et calculez le reste à la demande. Par exemple, si vous construisez une liste de tâches, gardez un tableau des tâches sous la main ; pas besoin d’une variable d'état pour le compteur. Au lieu de ça, quand vous voulez afficher  le nombre de tâches, prenez la longueur du tableau de tâches.

Pensez à toutes les données de notre application. On a :

  * La liste des produits
  * Le texte de recherche saisi par l'utilisateur
  * La valeur de la case à cocher
  * La liste filtrée des produits

Passons-les en revue pour déterminer lesquelles constituent notre état. Posez-vous ces trois questions pour chaque donnée :

  1. Est-elle passée depuis un parent via les props ? Si oui, ce n'est probablement pas de l’état.
  2. Est-elle figée dans le temps ? Si oui, ce n'est probablement pas de l’état.
  3. Pouvez-vous la calculer en vous basant sur le reste de l’état ou les props de votre composant ? Si oui, ce n'est pas de l’état.

La liste des produits est passée via les props, ce n'est donc pas de l’état. Le texte de recherche et la case à cocher semblent être de l’état puisqu’ils changent avec le temps et ne peuvent être calculés à partir d’autre chose. Enfin, la liste filtrée des produits ne constitue pas de l’état puisqu’elle peut être calculée en combinant la liste originale des produits avec le texte de recherche et la valeur de la case à cocher.

Au final, notre état contient :

  * Le texte de recherche saisi par l'utilisateur
  * La valeur de la case à cocher

## Étape 4 : identifier où votre état doit vivre {#step-4-identify-where-your-state-should-live}

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">Voir le Pen <a href="https://codepen.io/gaearon/pen/qPrNQZ">Penser en React : Étape 4</a> sur <a href="https://codepen.io">CodePen</a>.</p>

Bon, nous avons identifié le contenu minimal de notre état applicatif. À présent, nous devons identifier quel composant modifie, ou *possède*, cet état.

Souvenez-vous : React se fonde sur un flux de données unidirectionnel qui descend le long de la hiérarchie des composants. Quant à savoir quel composant devrait posséder quel état, ce n’est pas forcément évident d’entrée de jeu. **C'est souvent la partie la plus difficile à comprendre pour les novices**, alors suivez ces étapes pour trouver la réponse :

Pour chaque partie de l’état de votre application :

  * Identifiez chaque composant qui affiche quelque chose basé sur cet état.
  * Trouvez leur plus proche ancêtre commun (un composant unique, au-dessus de tous les composants qui ont besoin de cette partie de l’état dans la hiérarchie).
  * L’ancêtre commun ou un autre composant situé plus haut dans la hiérarchie devrait posséder cette portion d’état.
  * Si vous ne trouvez pas de composant logique pour posséder cette partie de l’état, créez-en un exprès pour ça, et ajoutez-le quelque part dans la hiérarchie au-dessus de l’ancêtre commun.

Utilisons cette stratégie pour notre application :

  * `ProductTable` doit filtrer la liste des produits en fonction de l'état et `SearchBar` doit afficher l'état du texte de recherche et de la case à cocher.
  * Leur ancêtre commun est `FilterableProductTable`.
  * Conceptuellement, il est logique que le texte du filtre et la valeur de la case à cocher soient dans `FilterableProductTable`

Parfait, nous avons donc décidé que `FilterableProductTable` possèdera notre état. Tout d'abord, ajoutez une propriété d'instance `this.state = {filterText: '', inStockOnly: false}` dans le `constructor` de `FilterableProductTable` pour refléter l'état initial de votre application. Ensuite, passez `filterText` et `inStockOnly` à `ProductTable` et `SearchBar` via leurs props. Enfin, utilisez ces props pour filtrer les lignes dans `ProductTable` et définir les valeurs des champs du formulaire dans `SearchBar`.

Vous pouvez commencer à voir comment votre application se comportera : définissez `filterText` à `"ball"` et rafraîchissez votre appli. Vous verrez que le tableau de données est correctement mis à jour.

## Étape 5 : ajouter le flux de données inverse {#step-5-add-inverse-data-flow}

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="rohan10" data-embed-version="2" data-pen-title="Thinking In React: Step 5" class="codepen">Voir le Pen <a href="https://codepen.io/gaearon/pen/LzWZvb">Penser en React : Étape 5</a> sur <a href="https://codepen.io">CodePen</a>.</p>

Pour le moment, nous avons construit une appli qui s’affiche correctement en fonction des props et de l'état qui descendent le long de la hiérarchie. À présent, il est temps de permettre la circulation des données dans l'autre sens : les composants de formulaire situés plus bas dans la hiérarchie ont besoin de mettre à jour l'état dans `FilterableProductTable`.

React rend ce flux de données explicite pour vous aider à comprendre le fonctionnement de votre programme, mais cela demande un peu plus de code qu’une liaison de données bidirectionnelle classique.

Si vous essayez de saisir du texte ou de cocher la case dans la version actuelle de l'exemple, vous verrez que React ne tient pas compte de vos saisies. C'est volontaire, car nous avons spécifié l'attribut `value` de l'élément `input` pour qu’il soit toujours égal à l'état passé depuis `FilterableProductTable`.

Réfléchissons à ce que nous voulons qu'il se passe. Nous voulons garantir que chaque fois que l'utilisateur met à jour le formulaire, nous mettons à jour l'état pour refléter la saisie de l’utilisateur. Puisque les composants ne peuvent mettre à jour que leur propre état, `FilterableProductTable` passera une fonction de rappel à `SearchBar`, qui devra être déclenchée chaque fois que l'état doit être mis à jour. Nous pouvons utiliser l'événement `onChange` des champs pour cela. Les fonctions de rappel passées par `FilterableProductTable` appelleront `setState()`, et l'application sera mise à jour.

## Et c'est tout {#and-thats-it}

Avec un peu de chance, vous avez maintenant une idée de la façon de penser la construction de vos composants et applis en React. Bien que ça demande peut-être un peu plus de code que vous n'en avez l'habitude, souvenez-vous que le code est lu beaucoup plus souvent qu'il n’est écrit, et que ce type de code, modulaire et explicite, est moins difficile à lire. Plus vous écrirez de composants, plus vous apprécierez cette clarté et cette modularité, et avec la réutilisation du code, le nombre de vos lignes de code commencera à diminuer. 😀
