---
id: forwarding-refs
title: Transfert de refs
permalink: docs/forwarding-refs.html
---

Le transfert de ref est une technique permettant de déléguer automatiquement une [ref](/docs/refs-and-the-dom.html) d'un composant à l'un de ses enfants. Ça n'est généralement pas nécessaire pour la plupart des composants dans une application. Cependant, ça peut être utile pour certains types de composants, particulièrement dans les bibliothèques de composants réutilisables. Les scénarios les plus fréquents sont décrits ci-dessous.

## Transfert de refs vers des composants du DOM {#forwarding-refs-to-dom-components}

Prenons un composant `FancyButton` qui affiche l'élément DOM natif `button` :
`embed:forwarding-refs/fancy-button-simple.js`

Les composants React masquent leurs détails d'implémentation, y compris leur rendu.
Les autres composants utilisant `FancyButton` **n'auront généralement pas besoin** [d'obtenir une ref](/docs/refs-and-the-dom.html) sur l'élément DOM interne `button`. C'est une bonne chose, car ça empêche les composants de trop s'appuyer sur la structure DOM les uns et des autres.

Bien qu'une telle encapsulation soit souhaitable pour les composants applicatifs tels que `FeedStory` ou `Comment`, elle peut être gênante pour les composants hautement réutilisables, tels que `FancyButton` ou `MyTextInput`. Ces composants ont tendance à être utilisés un peu partout dans l’application de manière similaire à un `button` ou un `input`, et l’accès à leurs nœuds DOM peut s'avérer nécessaire pour la gestion du focus, de la sélection ou des animations.

**Le transfert de ref est une fonctionnalité optionnelle qui permet à certains composants de prendre une `ref` qu’ils reçoivent et de la passer plus bas dans l’arbre (en d’autres termes, la « transférer ») à un composant enfant.**

Dans l'exemple ci-dessous, `FancyButton` utilise `React.forwardRef` pour obtenir la `ref` qui lui est passée, puis la transfère au `button` DOM qu'il affiche :
`embed:forwarding-refs/fancy-button-simple-ref.js`

De cette façon, les composants utilisant `FancyButton` peuvent obtenir une ref sur le nœud DOM `button` sous-jacent et y accéder si nécessaire, comme s'ils utilisaient directement un `button` DOM.

Voici une explication étape par étape de ce qui se passe dans l'exemple ci-dessus :

1. Nous créons une [ref React](/docs/refs-and-the-dom.html) en appelant `React.createRef` et l'affectons à une variable `ref`.
1. Nous passons notre `ref` à `<FancyButton ref={ref}>` en la spécifiant comme un attribut JSX.
1. React transmet la `ref` à la fonction `(props, ref) => ...` à l'intérieur de `forwardRef` comme deuxième argument.
1. Nous transférons cet argument `ref` au `<button ref={ref}>` en le spécifiant comme un attribut JSX.
1. Quand la ref est liée, `ref.current` pointera vers le nœud DOM `button`.

>Remarque
>
> Le second argument `ref` n’existe que quand vous définissez un composant avec l'appel à `React.forwardRef`. Les fonctions composants habituelles et les composants à base de classes ne reçoivent pas l'argument `ref`, et la ref n'est pas non plus disponible dans les props du composant.
>
> Le transfert de refs n'est pas limité aux composants DOM. Vous pouvez aussi transférer des refs vers des instances de classe de composant.

## Note pour les mainteneurs de bibliothèques de composants {#note-for-component-library-maintainers}

**Lorsque vous commencez à utiliser `forwardRef` dans une bibliothèque de composants, vous devez le traiter comme une rupture de compatibilité ascendante et publier une nouvelle version majeure de votre bibliothèque.** En effet, votre bibliothèque a probablement un comportement différent (par exemple la cible d'affectation des refs et la nature des types exportés), et ça pourrait casser les applications et autres bibliothèques qui dépendent de l'ancien comportement.

L'application conditionnelle de `React.forwardRef` lorsqu'elle existe est également déconseillée pour les mêmes raisons : ça modifie le comportement de votre bibliothèque et pourrait casser les applications de vos utilisateurs lorsqu'ils mettent à jour React.

## Transfert des refs dans les composants d’ordre supérieur {#forwarding-refs-in-higher-order-components}

Cette technique peut aussi être particulièrement utile avec les [composants d'ordre supérieur](/docs/higher-order-components.html) *(Higher-Order Components ou HOC, NdT)*. Commençons par un exemple de HOC qui journalise les props du composant dans la console :
`embed:forwarding-refs/log-props-before.js`

Le HOC `logProps` transmet toutes les `props` au composant qu'il enrobe, ainsi le résultat affiché sera la même. Par exemple, nous pouvons utiliser ce HOC pour lister toutes les props transmises à notre composant *fancy button* :
`embed:forwarding-refs/fancy-button.js`

Il y a une limitation dans l'exemple ci-dessus : les refs ne seront pas transférées. C'est parce que `ref` n'est pas une prop. Comme `key`, elle est gérée différemment par React. Si vous ajoutez une ref à un HOC, la ref fera référence au composant conteneur extérieur, et non au composant enrobé.

Ça signifie que les refs destinées à notre composant `FancyButton` seront en réalité attachées au composant `LogProps` :
`embed:forwarding-refs/fancy-button-ref.js`

Heureusement, nous pouvons explicitement transférer les refs au composant `FancyButton` interne à l’aide de l’API `React.forwardRef`. Celle-ci accepte une fonction de rendu qui reçoit les arguments `props` et `ref` et renvoie un nœud React. Par exemple :
`embed:forwarding-refs/log-props-after.js`

## Affichage d'un nom personnalisé dans les DevTools {#displaying-a-custom-name-in-devtools}

`React.forwardRef` accepte une fonction de rendu. Les outils de développement React *(React DevTools, NdT)* utilisent cette fonction pour déterminer quoi afficher pour le composant de transfert de ref.

Par exemple, le composant suivant apparaîtra sous le nom "*ForwardRef*" dans les DevTools :
`embed:forwarding-refs/wrapped-component.js`

Si vous nommez la fonction de rendu, les DevTools incluront également son nom (par exemple, "*ForwardRef(myFunction)*") :
`embed:forwarding-refs/wrapped-component-with-function-name.js`

Vous pouvez même définir la propriété `displayName` de la fonction pour y inclure le composant que vous enrobez :
`embed:forwarding-refs/customized-display-name.js`
