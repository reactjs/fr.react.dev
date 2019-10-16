---
title: "Composants, éléments et instances en React"
author: [gaearon]
---

La différence entre **les composants, leurs instances et leurs éléments** déroute beaucoup les débutants React. Pourquoi y a-t-il trois termes différents pour désigner quelque chose qui est affiché sur l'écran ?

## Gestion des instances {#managing-the-instances}

Si vous débutez avec React, vous n’avez probablement travaillé qu’avec des classes et des instances de composants. Par exemple, vous pouvez déclarer un *composant* `Button` en créant une classe. Lorsque l'application est en cours d'exécution, vous pouvez avoir plusieurs *instances* de ce composant à l'écran, chacune avec ses propres propriétés et son état local. Il s’agit de la programmation d’interface utilisateur traditionnelle orientée objet. Pourquoi introduire des *éléments* ?

Dans ce modèle d'interface utilisateur traditionnel, c'est vous qui devez vous occuper de la création et de la destruction d'instances de composant enfants. Si un composant `Form` veut afficher un composant `Button`, il doit créer une instance de celui-ci et le maintenir manuellement à jour avec les nouvelles informations.

```js
class Form extends TraditionalObjectOrientedView {
  render() {
    // Lit certaines données passées à la vue
    const { isSubmitted, buttonText } = this.attrs;

    if (!isSubmitted && !this.button) {
      // Le formulaire n'a pas encore été soumis. Créons le bouton !
      this.button = new Button({
        children: buttonText,
        color: 'blue'
      });
      this.el.appendChild(this.button.el);
    }

    if (this.button) {
      // Le bouton est visible. Mettons à jour son texte !
      this.button.attrs.children = buttonText;
      this.button.render();
    }

    if (isSubmitted && this.button) {
      // Le formulaire a été soumis. Détruisons le bouton !
      this.el.removeChild(this.button.el);
      this.button.destroy();
    }

    if (isSubmitted && !this.message) {
      // Le formulaire a été soumis. Affichons le message de réussite !
      this.message = new Message({ text: 'Succès !' });
      this.el.appendChild(this.message.el);
    }
  }
}
```

Il s’agit de pseudo-code, mais c’est plus ou moins ce que vous obtenez lorsque vous écrivez un code d’interface utilisateur composite orienté objet qui se comporte de manière cohérente en utilisant une bibliothèque comme Backbone.

Chaque instance de composant doit conserver les références vers son nœud DOM et vers les instances des composants enfants puis les créer, les mettre à jour et les détruire au moment opportun. Le nombre de lignes de code augmente exponentiellement selon le nombre d'états du composant, de plus, les parents ont un accès direct aux instances de leurs composants enfants, ce qui va plus tard rendre difficile leur découplage.

Alors, en quoi React est-il différent ?

## Les éléments décrivent l'arbre {#elements-describe-the-tree}

Dans React, c'est là que les *éléments* viennent à la rescousse. **Un élément est un objet brut *décrivant* une instance de composant ou un nœud DOM et ses propriétés souhaitées.** Il contient uniquement des informations sur le type du composant (par exemple, un `Button`), ses propriétés (par exemple, sa `color`), et tous ses éléments enfants.

Un élément n'est pas une instance à proprement parler. C'est plutôt un moyen de dire à React ce que vous *voulez* voir à l'écran. Vous ne pouvez appeler aucune méthode sur l'élément. C'est juste un objet de description immuable avec deux champs : `type: (string | ReactClass)` et `props: Object`[^1].

### Éléments DOM {#dom-elements}

Lorsque le `type` d'un élément est une chaîne de caractères, il représente un nœud DOM avec comme nom celui de la balise, et les `props` correspondent à ses attributs. C’est ce que React produira. Par exemple :

```js
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

Cet élément, sous forme d'un objet brut, est juste un moyen de représenter le code HTML suivant :

```html
<button class='button button-blue'>
  <b>
    OK!
  </b>
</button>
```

Remarquez comment les éléments peuvent être imbriqués. Par convention, lorsque nous voulons créer une arborescence d'éléments, nous spécifions un ou plusieurs éléments enfants au moyen de la prop `children` de leur élément conteneur.

L’important c'est que les éléments parent et enfant ne soit *que des descriptions et non des véritables instances*. Lorsque vous les créez, elles ne font référence à rien sur l’écran. Vous pouvez les créer et les jeter, et cela aura peu d'importance.

Les éléments React sont faciles à parcourir, ils n’ont pas besoin d’être analysés, et bien sûr, ils sont beaucoup plus légers que les vrais éléments DOM — ce ne sont que des objets !

### Éléments composants {#component-elements}

Toutefois, le `type` d’un élément peut également être une fonction ou une classe qui correspond à un composant React :

```js
{
  type: Button,
  props: {
    color: 'blue',
    children: 'OK!'
  }
}
```

C'est là l'idée centrale de React.

**Un élément qui décrit un composant est également un élément, tout comme un élément décrivant un nœud DOM. Ils peuvent être imbriqués et mélangés les uns aux autres.**

Cette fonctionnalité vous permet de définir un composant `DangerButton` comme un `Button` avec une valeur spécifique pour la propriété `color` sans se demander si `Button` affiche un `<button>` du DOM, un `<div>` ou tout autre chose :

```js
const DangerButton = ({ children }) => ({
  type: Button,
  props: {
    color: 'red',
    children: children
  }
});
```

Vous pouvez combiner des éléments DOM et composants dans un même arbre :

```js
const DeleteAccount = () => ({
  type: 'div',
  props: {
    children: [{
      type: 'p',
      props: {
        children: 'Êtes-vous sûr·e ?'
      }
    }, {
      type: DangerButton,
      props: {
        children: 'Ouais'
      }
    }, {
      type: Button,
      props: {
        color: 'blue',
        children: 'Annuler'
      }
   }]
});
```

Ou si vous préférez JSX :

```js
const DeleteAccount = () => (
  <div>
    <p>Êtes-vous sûr·e ?</p>
    <DangerButton>Ouais</DangerButton>
    <Button color='blue'>Annuler</Button>
  </div>
);
```

Cette combinaison aide à garder les composants découplés les uns des autres, car ils peuvent exprimer, uniquement à travers la composition, aussi bien les relations *est-un* que *possède-un* :

* `Button` est un `<button>` du DOM avec des propriétés spécifiques.
* `DangerButton` est un `Button` avec des propriétés spécifiques.
* `DeleteAccount` contient un `Button` et un `DangerButton` à l'intérieur d'un `<div>`.

### Les composants encapsulent des arbres d'éléments {#components-encapsulate-element-trees}

Lorsque React voit un élément avec un `type` classe ou fonction, il sait qu’il doit demander *à ce composant* que élément il produit, en fonction des `props` correspondantes.

Quand il voit cet élément :

```js
{
  type: Button,
  props: {
    color: 'blue',
    children: 'OK!'
  }
}
```

React demandera à `Button` ce qu'il produit. Le `Button` renverra cet élément :

```js
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

React répètera ce processus pour chaque composant de la page jusqu'à ce qu'il connaisse les éléments de balise DOM sous-jacents.

React est comme un enfant demandant « c'est quoi Y ? », pour chaque « X est un Y » que vous lui répondez, jusqu'à ce qu'il comprenne tout ce qui se passe.

Vous vous rappelez l'exemple `Form` ci-dessus ? Il peut être écrit avec React de cette manière[^1] :

```js
const Form = ({ isSubmitted, buttonText }) => {
  if (isSubmitted) {
    // Le formulaire a été soumis ! Renvoyons un élément message.
    return {
      type: Message,
      props: {
        text: 'Succès !'
      }
    };
  }

  // Le formulaire est encore visible ! Renvoyons un élément button.
  return {
    type: Button,
    props: {
      children: buttonText,
      color: 'blue'
    }
  };
};
```

Voilà ! Pour un composant React, les props sont les entrées, et un arbre d'éléments constitue la sortie.

**L'arbre d'élément renvoyé peut contenir à la fois des éléments décrivant des nœuds DOM et des éléments décrivant d'autres composants. Cela vous permet de composer des parties indépendantes de l'interface utilisateur sans s'appuyer sur leur structure DOM interne.**

Nous laissons React créer, mettre à jour et détruire les instances. Nous les *décrivons* grâce aux éléments que nous renvoyons depuis les composants, et React se charge de la gestion des instances.

### Les composants peuvent être des classes ou des fonctions {#components-can-be-classes-or-functions}

Dans le code ci-dessus, `Form`, `Message` et `Button` sont des composants React. Ils peuvent être implémentés soit comme des fonctions, comme ci-dessus, soit comme des classes héritant de de `React.Component`. Les trois façons de déclarer un composant ci-après sont pour l'essentiel équivalentes :

```js
// 1) Une fonction de props
const Button = ({ children, color }) => ({
  type: 'button',
  props: {
    className: 'button button-' + color,
    children: {
      type: 'b',
      props: {
        children: children
      }
    }
  }
});

// 2) Utilisation de la fabrique React.createClass()
const Button = React.createClass({
  render() {
    const { children, color } = this.props;
    return {
      type: 'button',
      props: {
        className: 'button button-' + color,
        children: {
          type: 'b',
          props: {
            children: children
          }
        }
      }
    };
  }
});

// 3) Une classe ES6 héritant de React.Component
class Button extends React.Component {
  render() {
    const { children, color } = this.props;
    return {
      type: 'button',
      props: {
        className: 'button button-' + color,
        children: {
          type: 'b',
          props: {
            children: children
          }
        }
      }
    };
  }
}
```

Lorsqu'un composant est défini en tant que classe, il est un peu plus puissant qu'une fonction composant. Il peut stocker un état local et exécuter une logique personnalisée lorsque le nœud DOM correspondant est créé ou détruit.

Une fonction composant est moins puissante mais plus simple et agit comme un composant à base de classe doté seulement d’une méthode `render()`. Sauf si vous avez besoin de fonctionnalités disponibles uniquement dans une classe, nous vous encourageons à utiliser des fonctions composants.

**Cependant, qu’il s’agisse de fonctions ou de classes, ce sont tous des composants pour React.  Ils prennent les props en entrée et renvoient les éléments en sortie.**

### Réconciliation descendante {#top-down-reconciliation}

Quand vous appelez :

```js
ReactDOM.render({
  type: Form,
  props: {
    isSubmitted: false,
    buttonText: 'OK!'
  }
}, document.getElementById('root'));
```

Pour ces `props`, React demandera au composant `Form` quel arbre d'éléments il renvoie. Il va progressivement « affiner » sa compréhension de votre arbre de composants pour aboutir à des primitives plus simples :

```js
// React : Tu m’as dit ça…
{
  type: Form,
  props: {
    isSubmitted: false,
    buttonText: 'OK!'
  }
}

// React : …et Form m’a dit ça…
{
  type: Button,
  props: {
    children: 'OK!',
    color: 'blue'
  }
}

// React : …et Button m‘a dit ça ! Je crois que j'ai fini.
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

C'est une partie du processus que React appelle la [réconciliation](/docs/reconciliation.html), elle commence quand vous appelez [`ReactDOM.render()`](/docs/top-level-api.html#reactdom.render) ou [`setState()`](/docs/component-api.html#setstate). À la fin de la réconciliation, React connait l'arbre DOM résultant, et un moteur de rendu comme `react-dom` ou `react-native` applique l'ensemble des modifications nécessaires pour mettre à jour les nœuds DOM (ou les vues spécifiques à la plate-forme dans le cas de React Native).

Les applis React sont faciles à optimiser grâce à ce processus d'affinage progressif. Si certaines parties de l'arbre de votre composant deviennent trop grandes pour que React les visite efficacement, vous pouvez lui dire [d'ignorer cet « affinage » et la comparaison de certaines parties de l'arbre dès lors que les props pertinentes n'ont pas changé](/docs/advanced-performance.html). Si les props sont immuables, déterminer si elles ont bougé se fait très rapidement ; React et l'immutabilité fonctionnent très bien ensemble et ça permet d'excellentes optimisations avec un effort minimum.

Vous avez peut-être remarqué que cet article du blog parle beaucoup des composants, des éléments et peu des instances. En réalité, les instances ont beaucoup moins d'importance dans React que dans la plupart des frameworks d'interface utilisateur orientés objet.

Seuls les composants déclarés comme des classes ont des instances, et vous ne les créez jamais directement : React le fait pour vous. Bien qu’il existe des [mécanismes permettant à une instance de composant parent d'accéder à une instance de composant enfant](/docs/more-about-refs.html), elles ne sont utilisées que pour des actions impératives (telles que la définition du focus sur un champ) et doivent être évitées en général.

React prend en charge la création d'une instance pour chaque composant à base de classe, vous pouvez donc écrire des composants de manière orientée objet avec des méthodes et un état local, mais à part ça, les instances ne sont pas très importantes dans le modèle de programmation de React et sont gérées par React lui-même.

## En résumé {#summary}

Un *élément* est un objet simple décrivant ce que vous souhaitez voir apparaître sur l’écran en ce qui concerne les nœuds DOM ou d’autres composants. Les éléments peuvent contenir d’autres éléments dans leurs props. La création d’un élément React est bon marché. Lorsqu’un élément est créé, il n’est jamais muté.

Un *composant* peut être déclaré de plusieurs manières. Il peut s’agir d’une classe avec une méthode `render()`. Autrement, dans les cas simples, il peut être défini comme une fonction. Dans les deux cas, il prend les props en entrée et renvoie un arbre d'éléments en sortie.

Lorsqu'un composant reçoit des props en entrée, c'est parce qu'un composant parent particulier a renvoyé un élément avec son `type` et ces props. C’est la raison pour laquelle les gens disent que les props circulent dans un sens dans React : des parents vers les enfants.

Une *instance* correspond à ce que vous appelez `this` dans la classe du composant que vous écrivez. C'est utile pour [stocker l'état local et réagir aux événements du cycle de vie](/docs/component-api.html).

Les fonctions composants n’ont pas du tout d’instances. Les composants à base de classe ont des instances, mais vous n'avez jamais besoin de créer directement une instance de composant. React s'en charge.

Enfin, pour créer des éléments, utilisez [`React.createElement()`](/docs/top-level-api.html#react.createelement), [JSX](/docs/jsx-in-depth.html), ou une [aide de fabrique d'élément](/docs/top-level-api.html#react.createfactory). N’écrivez pas des éléments comme de simples objets dans le code réel, sachez simplement qu'il s'agit de simples objets sous le capot.

## Pour aller plus loin {#further-reading}

* [Présentation des éléments React](/blog/2014/10/14/introducing-react-elements.html)
* [Rationalisation des éléments React](/blog/2015/02/24/streamlining-react-elements.html)
* [Terminologie du DOM (virtuel) de React](/docs/glossary.html)

[^1]: Tous les éléments React nécessitent un champ supplémentaire ``$$typeof: Symbol.for('react.element')`` déclaré sur l'objet pour des [raisons de sécurité](https://github.com/facebook/react/pull/4832). Il est omis dans les exemples ci-dessus. Cet article du blog utilise des objets pour les éléments afin de vous donner une idée de ce qui se passe sous la surface, mais le code ne fonctionnera pas tel quel, sauf si vous ajoutez `$$typeof` aux éléments ou modifiez le code pour qu'il utilise `React.createElement()` ou JSX.
