---
id: forwarding-refs
title: Transfert de Refs
permalink: docs/forwarding-refs.html
---

Le transfert de Ref est une technique permettant de transmettre automatiquement une [ref](/docs/refs-and-the-dom.html) d'un composant à l'un de ses enfants. Ça n'est généralement pas nécessaire pour la plupart des composants dans une application. Cependant, cela peut être utile pour certains types de composants, particulièrement dans les bibliothèques de composant réutilisable. Les scénarios les plus communs sont décrits ci-dessous.

## Transfert de refs vers des composants du DOM {#forwarding-refs-to-dom-components}

Prenons un composant `FancyButton` qui affiche l'élément DOM natif `button` :
`embed:forwarding-refs/fancy-button-simple.js`

Les composants React masquent leurs détails d'implémentation, y compris leur sortie du moteur de rendu. *(Dans la suite de cet article, pour des raisons de concision, nous emploierons le terme générique anglais renderer sans italiques, NdT)*
Les autres composants utilisant `FancyButton` **n'auront généralement pas besoin** [d'obtenir une ref](/docs/refs-and-the-dom.html) à l'intérieur de l'élément du DOM `button`. C'est une bonne chose, car ça empêche les composants de trop s'appuyer sur la structure du DOM des uns et des autres.

Bien qu'une telle encapsulation soit souhaitable pour les composants au niveau de l'application tels que `FeedStory` ou `Comment`, elle peut être gênante pour les composants hautement réutilisables, tels que `FancyButton` ou `MyTextInput`. Ces composants ont tendance à être utilisés dans l’application de la même manière qu’un `bouton` et un `input` « normaux », et l’accès à leurs nœuds DOM peut être inévitable pour la gestion du focus, de la sélection ou des animations.

**Le transfert de Ref est une fonctionnalité d’inscription qui permet à certains composants de prendre une `ref` qu’ils reçoivent et de les passer plus loin (en d’autres termes, « les transférer ») à un enfant.**

Dans l'exemple ci-dessous, `FancyButton` utilise `React.forwardRef` pour obtenir la `ref` qui lui est transmise, puis le transfère au DOM `button` qu'il render :
`embed:forwarding-refs/fancy-button-simple-ref.js`

De cette façon, les composants utilisant `FancyButton` peuvent obtenir une ref au nœud du DOM sous-jacent `button` et y accéder si nécessaire, comme s'ils utilisaient directement un `bouton` DOM.

Voici une explication étape par étape de ce qui se passe dans l'exemple ci-dessus :

1. Nous créons une [ref React](/docs/refs-and-the-dom.html) en appelant `React.createRef` et l'affectons à une variable `ref`.
1. Nous passons notre `ref` à `<FancyButton ref={ref}>` en le spécifiant comme un attribut JSX.
1. React transmet la `ref` à la fonction `(props, ref) => ...` à l'intérieur de `forwardRef` comme deuxième argument.
1. Nous transférons cet argument `ref` au `<button ref={ref}>` en le spécifiant comme un attribut JSX.
1. Quand la ref est lié, `ref.current` pointera vers le nœud de DOM `button`.

>Note
>
> Le second argument `ref` existe seulement quand vous définissez un composant avec l'appel `React.forwardRef`. Les composants de fonction ou de classe standard ne reçoivent pas l'argument `ref`, et ref n'est pas non plus disponible dans les props.
>
> Le transfert des références n'est pas limité aux composants DOM. Vous pouvez aussi transférer des refs vers des instances de composant de classe.

## Note pour les mainteneurs de bibliothèque de composants {#note-for-component-library-maintainers}

**Lorsque vous commencez à utiliser `forwardRef` dans une bibliothèque de composants, vous devez le traiter comme un changement radical et publier une nouvelle version majeure de votre bibliothèque.** En effet, votre bibliothèque a probablement un comportement différent (par exemple à quoi les refs sont assignés, et quels types sont exportés), et ça peut casser les applications et autres bibliothèques qui dépendent de l'ancien comportement.

L'application conditionnelle de `React.forwardRef` lorsqu'elle existe est également déconseillée pour les mêmes raisons : ça modifie le comportement de votre bibliothèque et cela peut casser les applications de vos utilisateurs lorsqu'ils mettent à jour React.

## Transfert des refs dans les composants d’ordre supérieur {#forwarding-refs-in-higher-order-components}

Cette technique peut aussi être particulièrement utile avec les [composants d'ordre supérieur](/docs/higher-order-components.html) (également connus sous le nom de HOC). Commençons par un exemple de HOC qui enregistre les props du composant dans la console :
`embed:forwarding-refs/log-props-before.js`

Le HOC "logProps" transmet tous les `props` au composant qu'il encapsule, ainsi le résultat qui sera render sera la même. Par exemple, nous pouvons utiliser ce HOC pour enregistrer toutes les props qui sont transmises à notre composant "*fancy button*" :
`embed:forwarding-refs/fancy-button.js`

Il y a une mise en garde par rapport à l'exemple ci-dessus : les refs ne seront pas transmises. C'est parce que `ref` n'est pas une prop. Comme `key`, il est géré différemment par React. Si vous ajoutez une ref à un HOC, la ref fera référence au composant conteneur le plus externe, pas au composant encapsulé.

Cela signifie que les refs destinées à notre composant `FancyButton` seront en réalité attachées au composant `LogProps` :
`embed:forwarding-refs/fancy-button-ref.js`

Heureusement, nous pouvons explicitement transférer des refs au composant `FancyButton` à l’aide de l’API `React.forwardRef`. `React.forwardRef` accepte une fonction de rendu qui reçoit les paramètres `props` et `ref` et renvoie un nœud React. Par exemple :
`embed:forwarding-refs/log-props-after.js`

## Affichage d'un nom personnalisé dans les DevTools {#displaying-a-custom-name-in-devtools}

`React.forwardRef` accepte une fonction de rendu. Les outils de développement React *(React DevTools, NdT)* utilisent cette fonction pour déterminer quoi afficher pour le composant de transfert de ref.

Par exemple, le composant suivant apparaîtra sous la forme "*ForwardRef*" dans les DevTools :
`embed:forwarding-refs/wrapped-component.js`

Si vous nommez la fonction de rendu, les DevTools incluront également son nom (par exemple, "*ForwardRef(myFunction)*") :
`embed:forwarding-refs/wrapped-component-with-function-name.js`

Vous pouvez même définir la propriété `displayName` de la fonction pour inclure le composant que vous enveloppez :
`embed:forwarding-refs/customized-display-name.js`
