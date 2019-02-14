---
id: thinking-in-react
title: Penser en React
permalink: docs/thinking-in-react.html
redirect_from:
  - 'blog/2013/11/05/thinking-in-react.html'
  - 'docs/thinking-in-react-zh-CN.html'
prev: composition-vs-inheritance.html
---

React est, à notre avis, la meilleure façon de créer de large et rapide applications Web avec JavaScript. Il s'est très bien adapté pour nous à Facebook et Instagram.

L'un des nombreux points forts de React est la façon dont il vous fait penser aux applications lorsque vous les créez. Dans ce document, nous vous guiderons dans l'élaboration d'un tableau de données de produit recherchable avec React.

## Commençons avec une maquette {#start-with-a-mock}

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

## Étape 1 : Décomposer l'interface utilisateur en une hiérarchie de composants {#step-1-break-the-ui-into-a-component-hierarchy}

La première chose que vous voudrez faire est de dessiner des cases autour de chaque composant (et sous-composant) sur la maquette et de leur donner à toutes un nom. Si vous travaillez avec un designer, il se peut qu'il l'ait déjà fait, alors allez lui parler ! Leurs noms de calques Photoshop peuvent devenir les noms de vos composants React !

Mais comment savez-vous ce qui devrait être son propre composant ? Utilisez simplement les mêmes techniques que celles pour décider si vous devez créer une nouvelle fonction ou un nouvel objet. L'une de ces techniques est le [principe de responsabilité unique](https://en.wikipedia.org/wiki/Single_responsibility_principle), c'est-à-dire qu'un composant ne devrait idéalement faire qu'une seule chose. S'il finit par s'agrandir, il devrait être décomposé en sous-composants plus petits.

Comme vous affichez souvent un modèle de données JSON à un utilisateur, vous constaterez que si votre modèle a été correctement construit, votre interface utilisateur (et donc la structure de vos composants) correspondra joliment. En effet, l'interface utilisateur et les modèles de données tendent à adhérer à la même *architecture d'information*, ce qui signifie que le travail de séparation de votre interface utilisateur en composants est souvent trivial. Il suffit de décomposer en composants qui représentent exactement un élément de votre modèle de données.

![Schéma des composants](../images/blog/thinking-in-react-components.png)

Vous verrez ici que nous avons cinq composants dans notre application. Nous avons mis en italique les données que chaque composant représente.

  1. **`FilterableProductTable` (orange):** contient l'intégralité de l'exemple
  2. **`SearchBar` (bleu):** reçoit toutes les *données saisies par l'utilisateur*
  3. **`ProductTable` (vert):** affiche et filtre la *collection de données* en fonction des *données saisies par l'utilisateur*
  4. **`ProductCategoryRow` (turquoise):** affiche un titre pour chaque *catégorie*
  5. **`ProductRow` (rouge):** affiche une ligne pour chaque *produit*

Si vous regardez `ProductTable`, vous verrez que l'en-tête du tableau (contenant les titres « Name » et « Price ») n'est pas son propre composant. C'est une question de préférence, et il y a des arguments à faire valoir dans les deux cas. Pour cet exemple, nous l'avons laissé comme faisant partie de `ProductTable` car il fait partie du rendu de la *collection de données* qui est la responsabilité de `ProductTable`. Cependant, si cet en-tête devient complexe (c.à-d. si nous devions ajouter des moyens de trier), il serait certainement logique d'en faire son propre composant `ProductTableHeader`.

Maintenant que nous avons identifié les composants dans notre maquette, organisons-les en une hiérarchie. C'est facile à faire. Les composants qui apparaissent dans un autre composant de la maquette doivent apparaître comme un enfant dans cette hiérarchie :

  * `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
      * `ProductCategoryRow`
      * `ProductRow`

## Étape 2 : Construire une version statique avec React {#step-2-build-a-static-version-in-react}

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">Voir le Pen <a href="https://codepen.io/gaearon/pen/BwWzwm">Thinking In React: Step 2</a> sur <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Maintenant que vous avez votre hiérarchie de composants, il est temps d'implémenter votre application. La façon la plus simple est de construire une version qui prend votre modèle de données et fait le rendu de l'interface utilisateur mais sans aucune interactivité. Il est préférable de découpler ces processus car la construction d'une version statique nécessite beaucoup d'écriture et aucune réflexion, et ajouter de l'interactivité demande beaucoup de réflexion et peu d'écriture. Nous verrons pourquoi.

Pour créer une version statique de votre application qui fera le rendu de votre modèle de données, vous devrez créer des composants qui réutilisent d'autres composants et transmettent les données en utilisant les *props*. Les *props* sont un moyen de transmettre des données d'un parent à un enfant. Si vous êtes familier avec le concept d'*état*, **n'utilisez pas d'état du tout** pour construire cette version statique. L'état est reservé à l'interactivité, c'est-à-dire aux données qui évoluent dans le temps. Comme il s'agit d'une version statique de l'application, vous n'en avez pas besoin.

Vous pouvez construire de haut en bas ou de bas en haut. En d'autres termes, vous pouvez aussi bien commencer par construire les composants les plus haut dans la hiérarchie (c-à.d. en commençant par `FilterableProductTable`), que par ceux les plus bas (`ProductRow`). Dans des exemples plus simples, il est généralement plus facile d'aller de haut en bas, et sur des projets plus importants, il est plus facile d'aller de bas en haut et d'écrire les tests à mesures que vous conçevez.

À la fin de cette étape, vous disposerez d'une bibliothèque de composants réutilisable qui feront le rendu de votre modèle de données. Les composants n'auront que des méthodes `render()` puisque c'est une version statique de l'application. Le composant au sommet de la hiérarchie (`FilterableProductTable`) prendra votre modèle de données en tant que prop. Si vous apportez un changement à votre modèle de données et appelez `ReactDOM.render()` à nouveau, l'interface utilisateur sera mis à jour. Il est facile de voir comment votre interface utilisateur est mis à jour et où y apporter des modifications, car il n'y a rien de compliqué. **Le flux de données unidirectionnel** de React (également appelé *liaison unidirectionnelle*) permet de maintenir la modularité et la rapidité de l'ensemble.

Il suffit de se reporter à la [documentation de React](/docs/) si vous avez besoin d'aide pour exécuter cette étape.

### Un bref intermède : Props ou État {#a-brief-interlude-props-vs-state}

Il existe deux types de « modèles » de données avec React : les props et l'état. Il est important de comprendre la distinction entre les deux ; parcourez [la documentation officielle de React](/docs/interactivity-and-dynamic-uis.html) si vous n'êtes pas sûr de la différence.

## Étape 3 : Déterminer l'état de l'interface utilisateur de façon minimale (mais complète) {#step-3-identify-the-minimal-but-complete-representation-of-ui-state}

Pour rendre votre interface utilisateur interactive, vous devez être capable de déclencher des modifications à votre modèle de données. React vous facilite la tâche avec l'**état**.

Afin de correctement construire votre application, vous devez d'abord penser à l'ensemble minimal d'état modifiable dont votre application a besoin. La clé, ici, est : [*Ne vous Répétez Pas*](https://fr.wikipedia.org/wiki/Ne_vous_r%C3%A9p%C3%A9tez_pas) *(Don’t Repeat Yourself en anglais, aussi désigné par l’acronyme DRY, NdT)*. Déterminez la représentation minimale de l'état dont votre application a besoin et calculez le reste à la demande. Par exemple, si vous construisez une liste de tâche, gardez simplement un tableau des différentes tâches ; ne gardez pas de variable d'état pour le compteur. Au lieu de cela, lorsque vous voulez calculer le nombre de tâches, prenez simplement la longueur du tableau contenant les tâches.

Pensez à toutes les différentes données de notre application. On a :

  * La liste des produits
  * Le texte de recherche saisi par l'utilisateur
  * La valeur de la case à cocher
  * La liste filtrée des produits

Passons en revue chacun d'entre elle et déterminons laquelle est un état. Posez vous simplement ces trois questions sur chaque donnée :

  1. Est-elle passée depuis un parent par l'intermédiaire des props ? Si oui, ce n'est probablement pas un état.
  2. Est-ce qu'elle ne change pas dans le temps ? Si oui, ce n'est probablement pas un état.
  3. Pouvez vous la calculer en vous basant sur un autre état ou props de votre composant ? Si oui, ce n'est probablement pas un état.

La liste des produits est passée en tant que props, ce n'est donc pas un état. Le texte de recherche et la case à cocher semblent être des états car ils changent avec le temps et ne peuvent être calculé à partir d'un autre état ou prop. Enfin, la liste filtré des produits n'est pas un état car elle peut être calculé en combinant la liste originale des produits avec le texte de recherche et la valeur de la case à cocher.

Au final, notre état est :

  * Le texte de recherche saisi par l'utilisateur
  * La valeur de la case à cocher

## Étape 4 : Identifier où votre état doit vivre {#step-4-identify-where-your-state-should-live}

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">Voir le Pen <a href="https://codepen.io/gaearon/pen/qPrNQZ">Thinking In React: Step 4</a> sur <a href="http://codepen.io">CodePen</a>.</p>

Nous avons identifié l'ensemble minimal de l'état de notre application. Maintenant, nous devons identifier quel composant peux modifier, ou *possède*, cet état.

Souvenez-vous : React est un flux de données unidirectionnel dans la hiérarchie des composants. Il n'est peut être pas immédiatement clair de savoir quel composant devrait posséder quel état . **C'est souvent la partie la plus difficile à comprendre pour les novices,** alors suivez ces étapes pour le découvrir :

Pour chaque état de votre application :

  * Identifiez chaque composant qui fait le rendu de quelque chose basé sur cet état.
  * Trouvez un composant parent commun (un seul composant au-dessus de tous les composants qui ont besoin de l'état dans la hiérarchie).
  * Le composant parent commun ou un autre composant situé plus haut dans la hiérarchie devrait posséder l'état.
  * Si vous ne trouvez pas de composant logique pour posséder l'état, créez un nouveau composant pour contenir cet état et ajoutez le quelque part dans la hiérarchie au-dessus du composant parent commun.

Utilisons cette stratégie pour notre application :

  * `ProductTable` doit filtrer la liste des produits en fonction de l'état et `SearchBar` doit afficher l'état du texte de recherche et de la case à cocher.
  * Le composant parent commun est `FilterableProductTable`.
  * Conceptuellement, il est logique que le texte du filtre et la valeur de la case à cocher soient dans `FilterableProductTable`

Parfait, nous avons donc décidé que `FilterableProductTable` possèdera notre état. Tout d'abord, ajoutez une propriété d'instance `this.state = {filterText: '', inStockOnly: false}` dans le `constructeur` de `FilterableProductTable` pour refléter l'état initial de votre application. Ensuite, passez `filterText` et `inStockOnly` à `ProductTable` et `SearchBar` en tant que prop. Enfin, utilisez ces props pour filtrer les lignes dans `ProductTable` et définissez les valeurs des champs du formulaire dans `SearchBar`.

Vous pouvez commencer à voir comment votre application se comportera : initialisez `filterText` à `"ball"` et rafraîchissez votre application. Vous verrez que la table de données est correctement mise à jour.

## Étape 5 : Ajouter un flux de données inversé {#step-5-add-inverse-data-flow}

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="rohan10" data-embed-version="2" data-pen-title="Thinking In React: Step 5" class="codepen">Voir le Pen <a href="https://codepen.io/gaearon/pen/LzWZvb">Thinking In React: Step 5</a> sur <a href="http://codepen.io">CodePen</a>.</p>

Jusqu'à présent, nous avons construit une application qui fait son rendu correctement en fonction des props et de l'état qui descend dans la hiérarchie. Maintenant il est temps de supporter la circulation des données dans l'autre sens : le composant formulaire situé en bas de la hiérarchie a besoin de mettre à jour l'état dans `FilterableProductTable`.

React rend ce flux de données explicite pour faciliter la compréhension du fonctionnement de votre programme, mais cela demande un peu plus d'écriture que la liaison de données bidirectionnelle traditionnelle.

Si vous essayez d'écrire ou de cocher la case dans la version actuelle de l'exemple, vous verrez que React ne tient pas compte de vos entrées. C'est intentionnel, car nous avons définit l'attribut `value` de l'élément `input` pour être toujours égal à l'`état` passé depuis `FilterableProductTable`.

Réfléchissons à ce que nous voulons qu'il se passe. Nous voulons nous assurer que chaque fois que l'utilisateur met à jour le formulaire, nous mettons à jour l'état pour refléter l'entrée de l'utilisateur. Puisque les composants ne doivent mettre à jour que leur propre état, `FilterableProductTable` passera une fonction de rappel à `SearchBar` qui se déclenchera chaque fois que l'état doit être mis à jour. Nous pouvons utiliser l'évenement `onChange` sur les entrées dont on veut être notifié. Les fonctions de rappel passées par `FilterableProductTable` appelleront `setState()`, et l'application sera mise à jour.

Bien que cela semble complexe, c'est juste quelques lignes de code. Et la façon dont vos données circulent dans l'application est vraiment clair.

## Et c'est tout {#and-thats-it}

Avec un peu de chance, cela vous donnera une idée de la façon de penser la construction de vos composants et applications React. Bien que cela demande peut-être plus d'écriture que vous n'en avez l'habitude, rappelez-vous que le code est beaucoup plus lu qu'écrit, et qu'il est extrêmement facile de lire ce code modulaire et explicite. Au fur et à mesure que vous commencerez à écrire de plus grande bilbliothèques de composants, vous apprécierez cette clarté et modularité, et avec la réutilisation du code, vos lignes de codes commenceront à se réduire. :)
