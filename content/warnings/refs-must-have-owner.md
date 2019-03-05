---
title: "Avertissement : Refs Must Have Owner"
layout: single
permalink: warnings/refs-must-have-owner.html
---

Les refs doivent avoir un propriétaire

Vous êtes probablement sur cette page parce que vous avez reçu l’un des messages d’erreur suivants :

*React 16.0.0+*

> Warning:
>
> Element ref was specified as a string (myRefName) but no owner was set. You may have multiple copies of React loaded. (details: https://fb.me/react-refs-must-have-owner).
>
> _(Une ref d’élément a été spécifiée via une chaîne (myRefName), mais aucun propriétaire n’est défini.  Vous avez peut-être plusieurs copies de React chargées.)_

*Versions antérieures de React*

> Warning:
>
> addComponentAsRefTo(...): Only a ReactOwner can have refs. You might be adding a ref to a component that was not created inside a component's `render` method, or you have multiple copies of React loaded.
>
> _(Seul un ReactOwner peut avoir des refs.  Vous êtes peut-être en train d’ajouter une ref à un compoant qui n’a pas été créé au sein de la méthode `render` d’un autre composant, ou vous avez plusieurs copies de React chargées.)_

Ça implique généralement l’une des trois situations suivantes :

- Vous essayez d’ajouter une `ref` à une fonction composant.
- Vous essayez d’ajouter une `ref` à un élément créé hors de la fonction `render()` d’un autre.
- Vous avez plusieurs copies (en conflit) de React chargées (ex. en raison d’une dépendance npm mal configurée).

## Refs sur fonctions composants {#refs-on-function-components}

Si `<Foo>` est une fonction composant, vous ne pouvez pas lui ajouter une ref :

```js
// Ne marche pas si Foo est une fonction !
<Foo ref={foo} />
```

Si vous avez besoin d’ajouter une ref à un composant, convertissez-le d’abord en classe, ou envisagez de ne pas utiliser de ref, dans la mesure où elle sont [rarement nécessaires](/docs/refs-and-the-dom.html#when-to-use-refs).

## Refs textuelles hors d’une méthode `render` {#strings-refs-outside-the-render-method}

Ça signifie généralement que vous essayez d’ajouter une ref à un composant qui n’a pas de propriétaire (c'est-à-dire qu’il n’a pas été créé au sein de la méthode `render` d’un autre composant).  Par exemple, le code suivant ne marchera pas :

```js
// Ne fonctionne pas !
ReactDOM.render(<App ref="app" />, el);
```

Essayez d’afficher ce composant au sein d’un composant racine qui possèdera la ref.  Vous pouvez aussi opter pour une ref de rappel :

```js
let app;
ReactDOM.render(
  <App ref={inst => {
    app = inst;
  }} />,
  el
);
```

Reconsidérez tout de même [la nécessité-même d’une ref](/docs/refs-and-the-dom.html#when-to-use-refs) avant d’en arriver là.

## Copies multiples de React {#multiple-copies-of-react}

Bower se débrouille plutôt bien pour dédoublonner les dépendances, mais npm est moins efficace sur ce point.  Si vous ne faites rien de particulièrement avancé avec les refs, il est probable que votre problème ne vienne pas de vos refs, mais soit en rapport avec la présence de plusieurs copies de React chargées dans votre projet.  Parfois, on se met à utiliser un module tiers via npm, et on récupère une copie supplémentaire de la bibliothèque dont il dépend, ce qui peut créer des problèmes.

Si vous utilisez npm… `npm ls` ou `npm ls react` pourront vous aider à vérifier.
