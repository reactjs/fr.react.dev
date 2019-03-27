---
id: rendering-elements
title: Le rendu des éléments
permalink: docs/rendering-elements.html
redirect_from:
  - "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

Les éléments sont les blocs élémentaires d’une application React.

Un élément décrit ce que vous voulez voir à l’écran :

```js
const element = <h1>Bonjour, monde</h1>;
```

Contrairement aux éléments DOM d’un navigateur, les éléments React sont de simples objets peu coûteux à créer. React DOM se charge de mettre à jour le DOM afin qu’il corresponde aux éléments React.

>Remarque
>
>On pourrait confondre les éléments avec le concept plus répandu de « composants ». Nous présenterons les composants dans la [prochaine section](/docs/components-and-props.html). Les éléments représentent la base des composants, aussi nous vous conseillons de bien lire cette section avant d’aller plus loin.

## Afficher un élément dans le DOM {#rendering-an-element-into-the-dom}

Supposons qu’il y ait une balise `<div>` quelque part dans votre fichier HTML :

```html
<div id="root"></div>
```

Nous parlons de nœud DOM « racine » car tout ce qu’il contient sera géré par React DOM.

Les applications dévéloppées uniquement avec React ont généralement un seul nœud DOM racine. Si vous intégrez React dans une application existante, vous pouvez avoir autant de nœuds DOM racines isolés que vous le souhaitez.

Pour faire le rendu d’un élément React dans un nœud DOM racine, passez les deux à la méthode `ReactDOM.render()` :

`embed:rendering-elements/render-an-element.js`

**[Essayer sur CodePen](codepen://rendering-elements/render-an-element)**

Cet exemple de code affichera « Bonjour, monde » sur la page.

## Mettre à jour un élément affiché {#updating-the-rendered-element}

Les éléments React sont [immuables](https://fr.wikipedia.org/wiki/Objet_immuable). Une fois votre élément créé, vous ne pouvez plus modifier ses enfants ou ses attributs. Un élément est comme une image d’un film à un instant T : il représente l’interface utilisateur à un point précis dans le temps.

Avec nos connaissances actuelles, la seule façon de mettre à jour l’interface utilisateur est de créer un nouvel élément et de le passer à `ReactDOM.render()`.

Prenons l’exemple de cette horloge :

`embed:rendering-elements/update-rendered-element.js`

**[Essayer dans CodePen](codepen://rendering-elements/update-rendered-element)**

À chaque seconde, nous appellons `ReactDOM.render()` depuis une fonction de rappel passée à [`setInterval()`](https://developer.mozilla.org/fr/docs/Web/API/WindowTimers/setInterval).

>Remarque
>
>En pratique, la plupart des applications React n’appellent `ReactDOM.render()` qu’une seule fois. Dans les prochaines sections, nous apprendrons comment encapsuler un tel code dans des [composants à état](/docs/state-and-lifecycle.html).
>
>Nous vous conseillons de lire les sujets abordés dans l’ordre car ils s'appuient l’un sur l’autre.

## React met à jour le strict nécessaire {#react-only-updates-whats-necessary}

React DOM compare l’élément et ses enfants avec la version précédente, et applique uniquement les mises à jour DOM nécessaires pour refléter l’état voulu.

Vous pouvez vérifier ce comportement en inspectant le [dernier exemple](codepen://rendering-elements/update-rendered-element) avec les outils de développement du navigateur :

![L’inspecteur montrant des mises à jour atomiques](../images/docs/granular-dom-updates.gif)

Même si nous créons à chaque seconde un élément décrivant l’arborescence complète de l’interface utilisateur, seul le nœud texte dont le contenu a été modifié est mis à jour par React DOM.

L’expérience nous montre que réfléchir à quoi devrait ressembler une interface utilisateur à un moment donné plutôt que de réfléchir à comment elle devrait évoluer permet d’éliminer toute une catégorie de bugs.
