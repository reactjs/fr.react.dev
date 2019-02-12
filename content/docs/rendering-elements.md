---
id: rendering-elements
title: Rendu d’éléments
permalink: docs/rendering-elements.html
redirect_from:
  - "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

Les éléments constituent les plus petits blocs d’une application React.

Un élément retranscrit ce que vous voulez voir à l’écran :

```js
const element = <h1>Bonjour, monde</h1>;
```

Contrairement aux élements DOM d’un navigateur, les éléments React sont de simples objets peu coûteux à créer. Le DOM React se charge de mettre à jour le DOM afin qu’il corresponde aux éléments React.

>**Note :**
>
>On pourrait confondre les éléments avec un concept plus largement connu de « composants ». Nous présenterons les composants dans la [prochaine section](/docs/components-and-props.html). Les éléments représentant la base des composants, nous vous encourageons à bien lire cette section avant d’aller plus loin.

## Rendu d’un Élément dans le DOM {#rendering-an-element-into-the-dom}

Disons qu’il y ait une `<div>` quelque part dans votre fichier HTML :

```html
<div id="root"></div>
```

Nous l’appelons nœud DOM « racine » car tout ce qu’il contient sera géré par le DOM React.

Les applications dévéloppées uniquement avec React ont généralement un seul nœud DOM racine. Si vous intégrez React dans une application existante, vous pouvez avoir autant de nœuds DOM racines isolés que vous le souhaitez.

`embed:rendering-elements/render-an-element.js`

[](codepen://rendering-elements/render-an-element)

Cela affiche « Bonjour, monde » sur la page.

## Mettre à Jour un Élément Rendu {#updating-the-rendered-element}

Les éléments React sont [immuables](https://fr.wikipedia.org/wiki/Objet_immuable). Une fois votre élément créé, vous ne pouvez plus modifier ses enfants ou ses attributs. Un élément est comme une image d’un film à un instant T : il représente l’interface utilisateur à un point précis dans le temps.

Avec nos connaissances actuelles, la seule façon de mettre à jour l’interface utilisateur est de créer un nouvel élément et de le passer à `ReactDOM.render()`.

Prenons l’exemple de l’horloge :

`embed:rendering-elements/update-rendered-element.js`

[](codepen://rendering-elements/update-rendered-element)

À chaque seconde, nous appellons `ReactDOM.render()` depuis la fonction de rappel [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval).

>**Note :**
>
>En pratique, la plupart des applications React n’appellent `ReactDOM.render()` qu’une seule fois. Dans les sections à venir, nous apprendrons comment encapsuler un tel code dans des [composants à état](/docs/state-and-lifecycle.html).
>
>Nous vous conseillons de ne pas sauter ces sujets car ils sont dépendants les uns des autres.

## React Met à Jour Seulement ce Qui Est Nécessaire {#react-only-updates-whats-necessary}

Le DOM React compare un élément et ses enfants avec la version précédente, et applique uniquement les mises à jour nécessaires au DOM pour que celui-ci reflète bien l’état voulu.

Vous pouvez vérifier ce comportement en inspectant le [dernier example](codepen://rendering-elements/update-rendered-element) avec les outils de développement du navigateur :

![L’inspecteur montrant les mises à jour périodiques](../images/docs/granular-dom-updates.gif)

Même si nous créons chaque seconde un élément décrivant l’arborescence complète de l’interface utilisateur, seul le nœud texte dont le contenu a été modifié est mis à jour par le DOM React.

Par expérience, réfléchir à quoi devrait ressembler une interface utilisateur à un moment donné plutôt qu’à comment elle devrait évoluer dans le temps permet d’éliminer toute une classe de bugs.