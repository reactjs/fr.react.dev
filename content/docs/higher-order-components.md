---
id: higher-order-components
title: Composants d’ordre supérieur
permalink: docs/higher-order-components.html
---

Un composant d'ordre supérieur *(Higher-Order Component ou HOC, NdT)* est une technique avancée de React qui permet de réutiliser la logique de composants. Les HOC ne font pas partie de l'API de React à proprement parler, mais découlent de sa nature compositionnelle.

Concrètement, **un composant d'ordre supérieur est une fonction qui accepte un composant et renvoie un nouveau composant.**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

Là où un composant transforme des props en interface utilisateur (UI), un composant d'ordre supérieur transforme un composant en un autre composant.

Les HOC sont courants dans des bibliothèques tierces de React, comme [`connect`](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#connect) dans Redux et [`createFragmentContainer`](http://facebook.github.io/relay/docs/en/fragment-container.html) dans Relay.

Dans ce guide, nous verrons pourquoi les composants d'ordre supérieurs sont utiles, et comment créer le vôtre.

## Utiliser les HOC pour les questions transversales {#use-hocs-for-cross-cutting-concerns}

> Remarque
>
> Auparavant, nous recommandions d'employer des *mixins* pour gérer les questions transversales. Depuis, nous nous sommes rendus compte que les *mixins* créent plus de problèmes qu'ils n'en résolvent. Vous pouvez [lire le détail](/blog/2016/07/13/mixins-considered-harmful.html) des raisons qui nous ont fait renoncer aux *mixins*, et de la façon dont vous pouvez faire de même pour vos composants existants.

Les composants sont le principal moyen de réutiliser du code en React. Cependant, vous remarquerez que les composants classiques ne conviennent pas à tous les modèles.

Imaginez que vous ayez créé un composant `CommentList` qui s’abonne à une source externe de données pour afficher une liste de commentaires&nbsp;:

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // `DataSource` est une source de données quelconque
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // On s’abonne aux modifications
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // On se désabonne
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Met à jour l’état local quand la source de données est modifiée
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

Plus tard, vous créez un composant `BlogPost` qui s'abonne à un unique article, et dont la structure est similaire :

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

`CommentList` et `BlogPost` ne sont pas identiques : ils appellent des méthodes différentes sur `DataSource`, et ont des affichages distincts. Pourtant une grande partie de leur implémentation est la même :

- Au montage *(quand le composant entre dans la couche d'affichage, NdT)*, ils ajoutent un écouteur d'événements à `DataSource`.
- Dans l'écouteur, ils appellent `setState` quand la source de données est modifiée.
- Au démontage *(quand le composant sort de la couche d'affichage, NdT)*, ils enlèvent l'écouteur d'événements.

Vous imaginez bien que dans une appli importante, ce motif d'abonnement à une `DataSource` et d'appel à `setState` sera récurrent. Il nous faut une abstraction qui nous permette de définir cette logique en un seul endroit et de la réutiliser pour de nombreux composants. C'est là que les composants d'ordre supérieur sont particulièrement utiles.

Nous pouvons écrire une fonction qui crée des composants qui s'abonnent à une `DataSource`, comme `CommentList` et `BlogPost`. La fonction acceptera parmi ses arguments un composant initial, qui recevra les données suivies en props. Appelons cette fonction `withSubscription` :

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

Le premier paramètre est le composant initial. Le second charge les données qui nous intéressent, en fonction de la `DataSource` et des props existantes.

Lorsque `CommentListWithSubscription` et `BlogPostWithSubscription` s'affichent, `CommentList` et `BlogPost` reçoivent une prop `data` qui contient les données les plus récentes issues de la `DataSource` :

```js
// Cette fonction accepte un composant...
function withSubscription(WrappedComponent, selectData) {
  // ... et renvoie un autre composant...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... qui s’occupe de l'abonnement...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... et affiche le composant enrobé avec les données à jour !
      // Remarquez qu’on passe aussi toute autre prop reçue.
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

Remarquez qu'un HOC ne modifie pas le composant qu'on lui passe, et ne recourt pas non plus à l’héritage pour copier son comportement. Un HOC *compose* le composant initial en l'*enrobant* dans un composant conteneur. Il s'agit d'une fonction pure, sans effets de bord.

Et voilà ! Le composant enrobé reçoit toutes les props du conteneur ainsi qu'une nouvelle prop, `data`, qu'il emploie pour produire son résultat. Le HOC ne se préoccupe pas de savoir comment ou pourquoi les données sont utilisées, et le composant enrobé ne se préoccupe pas de savoir d'où viennent les données.

Puisque `withSubscription` est juste une fonction, vous pouvez lui définir autant ou aussi peu de paramètres que vous le souhaitez. Par exemple, vous pourriez rendre configurable le nom de la prop `data`, afin d’isoler encore davantage le HOC et le composant enrobé. Ou alors, vous pourriez accepter un argument qui configure `shouldComponentUpdate`, ou un autre qui configure la source de données. Tout ça est possible parce que le HOC a un contrôle total sur la façon dont le composant est défini.

Comme pour les composants, le rapport entre `withSubscription` et le composant enrobé se base entièrement sur les props. Ça facilite l'échange d'un HOC pour un autre, du moment qu'ils fournissent les mêmes props au composant enrobé. Ça peut s'avérer utile si vous changez de bibliothèque pour charger vos données, par exemple.

## Ne modifiez pas le composant initial : composez-le. {#dont-mutate-the-original-component-use-composition}

Résistez à la tentation de modifier le prototype d'un composant (ou de le modifier de quelque façon que ce soit) dans un HOC.

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentWillReceiveProps = function(nextProps) {
    console.log('Props actuelles : ', this.props);
    console.log('Prochaines props : ', nextProps);
  };
  // Le fait que le composant initial soit renvoyé est un signe qu’il a été modifié.
  return InputComponent;
}

// EnhancedComponent fera un log à chaque fois qu’il reçoit des props.
const EnhancedComponent = logProps(InputComponent);
```

Ce genre d'approche pose quelques problèmes. Pour commencer, le composant initial ne peut pas être réutilisé indépendamment du composant amélioré. Plus important encore, si vous appliquez un autre HOC sur `EnhancedComponent` qui modifie *aussi* `componentWillReceiveProps`, les fonctionnalités du premier HOC seront perdues ! Enfin, ce HOC ne fonctionnera pas avec des fonctions composants, qui n'ont pas de méthodes de cycle de vie.

Les HOC qui modifient le composant enrobé sont une abstraction foireuse : leurs utilisateurs doivent savoir comment ils sont implémentés afin d’éviter des conflits avec d'autres HOC.

Plutôt que la mutation, les HOC devraient utiliser la composition, en enrobant le composant initial dans un composant conteneur.

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentWillReceiveProps(nextProps) {
      console.log('Props actuelles : ', this.props);
      console.log('Prochaines props : ', nextProps);
    }
    render() {
      // Enrobe le composant initial dans un conteneur, sans le modifier. Mieux !
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

Ce HOC a la même fonctionnalité que la version modifiante, tout en évitant le risque de conflits. Il fonctionne tout aussi bien avec les composants à base de classe et les fonctions composants. Et puisqu'il s'agit d'une fonction pure, il est composable avec d'autres HOC voire même avec lui-même.

Vous avez peut-être remarqué des ressemblances entre les HOC et le motif des **composants conteneurs**. Les composants conteneurs participent à des stratégies de séparation de responsabilités entre les préoccupations de haut et de bas niveau. Les conteneurs se préoccupent par exemple des abonnements et de l'état, et passent des props à d'autres composants qui se préoccupent par exemple d'afficher l’UI. Les HOC utilisent des conteneurs dans leur implémentation. Vous pouvez voir les HOC comme des définitions paramétrables de composants conteneurs.

## Convention : transmettez les props annexes au composant enrobé {#convention-pass-unrelated-props-through-to-the-wrapped-component}

Les HOC ajoutent des fonctionnalités à un composant. Ils ne devraient pas drastiquement modifier son contrat. On s'attend à ce que le composant renvoyé par un HOC ait une interface semblable au composant initial.

Les HOC devraient transmettre les props sans rapport avec leur propre fonctionnement. La plupart des HOC ont une méthode de rendu qui ressemble à ça :

```js
render() {
  // Filtre les props supplémentaires propres à ce HOC
  // qui ne devraient pas être transmises
  const { extraProp, ...passThroughProps } = this.props;

  // Injecte les props dans le composant enrobé. Il s’agit en général
  // de valeurs de l’état local ou de méthodes d’instance.
  const injectedProp = someStateOrInstanceMethod;

  // Transmet les props au composant enrobé
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

Cette convention améliore la flexibilité et la réutilisabilité de nos HOC.

## Convention : maximisez la composabilité {#convention-maximizing-composability}

Tous les HOC n’ont pas la même interface. Ils n'acceptent parfois qu'un seul argument, le composant enrobé :

```js
const NavbarWithRouter = withRouter(Navbar);
```

Mais en général, les HOC acceptent des arguments supplémentaires. Dans cet exemple tiré de Relay, un objet de configuration `config` est transmis pour spécifier les dépendances d'un composant aux données :

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

La signature la plus courante pour un HOC ressemble à ceci :

```js
// `connect` de React Redux
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

*Pardon ?!* Il est plus facile de voir ce qui se passe si on décortique l'appel.

```js
// connect est une fonction qui renvoie une autre fonction
const enhance = connect(commentListSelector, commentListActions);
// La fonction renvoyée est un HOC, qui renvoie un composant connecté au store Redux
const ConnectedComment = enhance(CommentList);
```

Autrement dit, `connect` est une fonction d'ordre supérieur… qui renvoie un composant d'ordre supérieur !

Cette forme peut sembler déroutante ou superflue, pourtant elle a une propriété utile. Les HOC n'acceptant qu'un argument comme celui que renvoie la fonction `connect` ont une signature `Composant => Composant`. Les fonctions dont le type de données est le même en sortie qu'en entrée sont beaucoup plus faciles à composer.

```js
// Plutôt que de faire ceci...
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ... vous pouvez utiliser un utilitaire de composition de fonction.
// compose(f, g, h) est l’équivalent de (...args) => f(g(h(...args)))
const enhance = compose(
  // Ces deux-là sont des HOC n’acceptant qu’un argument.
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

(C'est aussi cette propriété qui permet à `connect` et à d'autres HOC du même type d'être utilisés comme décorateurs, une proposition expérimentale JavaScript.)

La fonction utilitaire `compose` est fournie par de nombreuses bibliothèques tierces, dont lodash (sous le nom [`lodash.flowRight`](https://lodash.com/docs/#flowRight)), [Redux](https://redux.js.org/api/compose), et [Ramda](https://ramdajs.com/docs/#compose).

## Convention : enrobez le `displayName` pour faciliter le débogage {#convention-wrap-the-display-name-for-easy-debugging}

Tout comme n'importe quel autre composant, les composants conteneurs créés par des HOC apparaissent dans les [Outils de développement React](https://github.com/facebook/react-devtools). Pour faciliter votre débogage, donnez-leur un nom affichable qui indique qu'ils sont le résultat d'un HOC.

Le technique la plus répandue consiste à enrober le nom d'affichage du composant enrobé. Par exemple, si votre composant d'ordre supérieur s'appelle `withSubscription`, et que le nom d'affichage du composant enrobé est `CommentList`, utilisez le nom d'affichage `WithSubscription(CommentList)` :

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```


## Limitations {#caveats}

L'utilisation de composants d'ordre supérieur est sujette à quelques limitations qui ne sont pas tout de suite évidentes si vous débutez avec React.

### Pas de HOC à l'intérieur de la méthode de rendu {#dont-use-hocs-inside-the-render-method}

L'algorithme de comparaison de React (qu'on appelle la réconciliation) utilise l'identité des composants pour déterminer s'il faut mettre à jour l'arborescence existante ou la jeter et en monter une nouvelle. Si le composant renvoyé par `render` est identique (`===`) au composant du rendu précédent, React met récursivement à jour l'arborescence en la comparant avec la nouvelle. S'ils ne sont pas identiques, l'ancienne arborescence est intégralement démontée.

En général, vous ne devriez pas avoir à y penser. Mais dans le cadre des HOC c'est important, puisque ça signifie que vous ne pouvez pas appliquer un HOC au sein de la méthode de rendu d'un composant :

```js
render() {
  // Une nouvelle version de EnhancedComponent est créée à chaque rendu
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // Ça entraîne un démontage/remontage complet à chaque fois !
  return <EnhancedComponent />;
}
```

Il ne s'agit pas uniquement d'un problème de performances : remonter un composant signifie que l'état local de ce composant ainsi que ceux de tous ses enfants seront perdus.

Appliquez plutôt les HOC à l'extérieur de la définition d'un composant, afin de créer le composant enrobé une seule fois. Son identité sera alors constante d’un rendu à l'autre. C'est généralement ce que vous voulez, de toutes façons.

Dans les rares cas où vous avez besoin d’appliquer un HOC de façon dynamique, vous pouvez le faire au sein des méthodes de cycle de vie d'un composant ou dans son constructeur.

### Les méthodes statiques doivent être copiées {#static-methods-must-be-copied-over}

Il est parfois utile de définir une méthode statique dans un composant React. Par exemple, les conteneurs Relay exposent une méthode statique `getFragment` pour simplifier la composition de fragments GraphQL.

Cependant, quand vous appliquez un HOC à un composant, le composant initial est enrobé par un composant conteneur. Ça signifie que le nouveau composant ne comporte aucune des méthodes statiques du composant initial.

```js
// Définit une méthode statique
WrappedComponent.staticMethod = function() {/*...*/}
// Applique un HOC
const EnhancedComponent = enhance(WrappedComponent);

// Le composant amélioré n’a pas de méthode statique
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

Pour résoudre ça, vous pouvez copier les méthodes dans le conteneur avant de le renvoyer :

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Doit savoir exactement quelles méthodes recopier :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

Le problème, c’est que ça exige que vous sachiez exactement quelles méthodes doivent être recopiées. Vous devriez plutôt utiliser [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics) pour copier automatiquement toutes les méthodes statiques qui ne viennent pas de React :

```js
import hoistNonReactStatics from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatics(Enhance, WrappedComponent);
  return Enhance;
}
```

Une autre solution consiste à exporter les méthodes statiques de façon séparée du composant lui-même.

```js
// Plutôt que...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ... exportez les méthodes séparément...
export { someFunction };

// ... et dans le module qui les utilise, importez les deux.
import MyComponent, { someFunction } from './MyComponent.js';
```

### Les refs ne sont pas transmises {#refs-arent-passed-through}

Bien que que la convention pour les composants d'ordre supérieur soit de transmettre toutes les props au composant enrobé, ça ne marche pas pour les refs. C'est parce que `ref` n'est pas vraiment une prop : comme `key`, React la traite de façon particulière. Si vous ajoutez une ref à un élément dont le composant résulte d'un HOC, la ref fait référence à une instance du composant conteneur extérieur, et non au composant enrobé.

La solution à ce problème réside dans l'utilisation de l'API `React.forwardRef` (introduite dans React 16.3). [Vous pouvez en apprendre davantage dans la section sur la transmission des refs](/docs/forwarding-refs.html).
