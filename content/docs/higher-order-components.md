---
id: higher-order-components
title: Composants d'ordre supérieur
permalink: docs/higher-order-components.html
---

Un composant d'ordre supérieur (HOC) est une technique avancée de React qui permet de réutiliser la logique de composants. Les HOC ne font pas partie de l'API de React en soi, mais émergent de la nature compositionnelle de React.

Concrètement, **un composant d'ordre supérieur est une fonction qui accepte un composant et renvoie un nouveau composant.**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

Là où un composant transforme des props en interface utilisateur, un composant d'ordre supérieur transforme un composant en un autre composant.

Les HOC sont courants dans des bibliothèques tierces de React, comme [`connect`](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#connect) dans Redux et [`createFragmentContainer`](http://facebook.github.io/relay/docs/en/fragment-container.html) dans Relay.

Dans ce guide, nous verrons pourquoi les composants d'ordre supérieurs sont utiles, et comment créer le vôtre.

## Utiliser les HOC pour les préoccupations transversales {#use-hocs-for-cross-cutting-concerns}

> **Remarque**
>
> Nous recommandions dans le passé d'employer des mixins pour gérer les préoccupations transversales. Depuis, nous nous sommes rendus compte que les mixins créent plus de problèmes qu'ils n'en résolvent. [Lisez-en plus](/blog/2016/07/13/mixins-considered-harmful.html) sur pourquoi nous avons renoncé aux mixins, et comment vous pouvez faire de même pour vos composants existants.

Les composants React constituent le moyen le plus primaire de réutiliser du code. Cependant, vous remarquerez que les composants classiques ne conviennent pas à tous les modèles.

Imaginez que vous ayez créé un composant `CommentList` qui écoute une source externe de données pour faire le rendu d'une liste de commentaires&nbsp;:

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" est une source de données quelconque
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // Crée un écouteur d'événement
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // Nettoie l'écouteur d'événement
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Met à jour l'état local quand la source de données est modifiée
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

Ensuite, vous créez un composant `BlogPost` qui gère les événements pour un unique article, et dont la structure est similaire à la précédente&nbsp;:

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

`CommentList` et `BlogPost` ne sont pas identiques—ils appellent des méthodes différentes sur `DataSource`, et font différents rendus. Pourtant une grande partie de leur fonctionnement est la même:

- Au montage *(quand le composant entre dans la couche d'affichage, NdT)*, ils ajoutent un écouteur d'événement à `DataSource`.
- Dans l'écouteur, ils appellent `setState` quand la source de données est modifiée.
- Au démontage *(quand le composant sort de la couche d'affichage, NdT)*, ils enlèvent l'écouteur d'événement.

Vous imaginez bien que dans une appli importante, ce motif d'écoute de `DataSource` et d'appel à `setState` sera récurrent. Il nous faut une abstraction qui nous permette de définir cette logique à un seul endroit et de la partager parmi de nombreux composants. C'est là que les composants d'ordre supérieur entrent en jeu.

Vous pouvez donc écrire une fonction pour créer des composants qui écoutent `DataSource`, comme `CommentList` et `BlogPost`. L'un des arguments qu'accepte la fonction est un composant enfant, qui recevra les données écoutées en props. Appelons cette fonction `withSubscription`:

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

Le premier paramètre est le composant enfant. Le second récupère les données qui nous intéressent, selon la `DataSource` et les props existantes.

Au moment où `CommentListWithSubscription` et `BlogPostWithSubscription` font leur rendu, `CommentList` et `BlogPost` reçoivent une prop `data` qui contient les données les plus récentes de `DataSource`:

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
      // ... qui s'occupe d'écouter les événements...
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
      // ... et fait le rendu du composant enfant avec les données à jour!
      // Notez qu'on passe aussi toute prop existante
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

Vous voyez qu'un HOC ne modifie pas le composant qu'on lui passe, ni ni n'hérite et ne copie son comportement. Un HOC *compose* le composant initial en l'*enveloppant* dans un composant conteneur. Il s'agit purement d'une fonction, sans effets secondaires.

Et voilà&nbsp;! Le composant enfant reçoit toutes les props du conteneur ainsi qu'une nouvelle prop, `data`, qu'il emploie pour faire son rendu. Le HOC ne se préoccupe pas de comment ou pourquoi les données sont utilisées, et le composant enfant ne se préoccupe pas d'où les données viennent.

Puisque `withSubscription` est simplement une fonction, vous pouvez lui passer autant ou aussi peu d'arguments que vous voulez. Par exemple, vous pourriez rendre configurable le nom de la prop `data`, afin se séparer encore plus le HOC et son enfant. Ou alors, vous pourriez accepter un argument qui configure `shouldComponentUpdate`, ou un autre qui configure la source de données. Tout cela est possible parce que le HOC a un contrôle total sur la façon dont le composant est défini.

Comme pour les composants, le rapport entre `withSubscription` et le composant enfant se base sur les props. Cela facilite l'échange d'un HOC pour un autre, tant qu'ils fournissent les mêmes props au composant enfant. Cela peut être utile si vous changez de bibliothèque pour récupérer vos données, par exemple.

## Ne modifiez pas le composant initial. Composez-le. {#dont-mutate-the-original-component-use-composition}

Résistez à la tentation de modifier le prototype d'un composant (ou de faire une mutation) dans un HOC.

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentWillReceiveProps = function(nextProps) {
    console.log('Current props: ', this.props);
    console.log('Next props: ', nextProps);
  };
  // Le fait que le composant initial soit renvoyé est un signe qu'il a subi une mutation.
  return InputComponent;
}

// EnhancedComponent fera un log à chaque fois qu'il reçoit des props
const EnhancedComponent = logProps(InputComponent);
```

Cela pose certains problèmes. Pour commencer, le composant initial ne peut pas être réutilisé sans le composant amélioré. Plus important encore, si vous appliquez un autre HOC sur `EnhancedComponent` qui fait *aussi* une mutation de `componentWillReceiveProps`, les fonctionnalités du premier HOC seront écrasées. Finalement, ce HOC ne fonctionnera pas avec des fonctions composants, qui n'ont pas de méthodes de cycle de vie.

La mutation de HOC est une abstraction peu fiable—le client doit savoir comment ils sont implémentés s'il veut éviter des conflits avec d'autres HOC.

Plutôt que la mutation, les HOC devraient utiliser la composition, en enveloppant le composant initial dans un composant conteneur.

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentWillReceiveProps(nextProps) {
      console.log('Current props: ', this.props);
      console.log('Next props: ', nextProps);
    }
    render() {
      // Enveloppe le composant initial dans un conteneur, sans faire de mutation. Mieux !
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

Ce HOC a la même fonctionnalité que la version effectuant une mutation, tout en évitant le risque de confits. Il fonctionne tout aussi bien avec les composants à base de classe et les fonctions composants. Et, puisqu'il est tout simplement une fonction, il est compatible avec d'autres HOC et même avec lui-même.

Vous avez peut-être remarqué des ressemblances entre les HOC et le motif des **composants conteneurs**. Les composants conteneurs participent à la stratégie de séparer les responsabilités entre les préoccupations de haut et de bas niveau. Les conteneurs se préoccupent par exemple des souscriptions et de l'état global, et passent des props à d'autres composants qui se préoccupent par exemple de faire le rendu de l'interface utilisateur. Les HOC utilisent des conteneurs dans leur implémentation. Vous pouvez voir les HOC comme des définitions paramétrées de composants conteneurs.

## Convention: transmettez les props sans rapport au composant enfant {#convention-pass-unrelated-props-through-to-the-wrapped-component}

Les HOC ajoutent des fonctionnalités à un composant. Ils ne devraient pas drastiquement modifier son contrat. On s'attend à ce que le composant renvoyé par un HOC aie une interface semblable au composant initial.

Les HOC devraient transmettre les props sans rapport avec leurs propres préoccupations. La méthode de rendu de la plupart des HOC ressemble à ceci&nbsp;:

```js
render() {
  // Filtre les props supplémentaires propres à ce HOC qui ne devraient pas être trasmises
  const { extraProp, ...passThroughProps } = this.props;

  // Injecte les props dans le composant enfant. Il s'agit en général de valeurs de l'état global ou de méthodes d'instance
  const injectedProp = someStateOrInstanceMethod;

  // Transmet les props au composant enfant
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

Cette convention participe à garantir que les HOC soient aussi flexibles et réutilisables que possible.

## Convention: maximisez la composabilité {#convention-maximizing-composability}

Tous les HOC ne sont pas pareils. Dans certains cas ils n'acceptent qu'un seul argument, le composant enfant&nbsp;:

```js
const NavbarWithRouter = withRouter(Navbar);
```

Mais en général, les HOC acceptent des arguments supplémentires. Dans cet exemple tiré de Relay, un objet de configuration `config` est transmis pour spécifier les dépendances d'un composant à des données&nbsp;:

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

La signature la plus commune des HOC ressemble à ceci&nbsp;:

```js
// `connect` de React Redux
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

*Pardon&nbsp;?!* Il est plus facile de voir ce qu'il se passe si on le sépare en plusieurs morceaux.

```js
// connect est une fonction qui renvoie une autre function
const enhance = connect(commentListSelector, commentListActions);
// La fonction renvoyée est un HOC, qui renvoie un composant connecté au store Redux
const ConnectedComment = enhance(CommentList);
```

Autrement dit, `connect` est une fonction d'ordre supérieur qui renvoie un composant d'ordre supérieur&nbsp;!

Cette structure peut sembler déroutante ou superflue, pourtant elle apporte une propriété utile. Les HOC n'acceptant qu'un argument comme celui que renvoie la fonction `connect` ont une signature `Composant => Composant`. Les fonctions dont le type de données est le même à la sortie qu'à l'entrée sont beaucoup plus facile à composer.

```js
// Plutôt que de faire ceci...
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ... vous pouvez utiliser un utilitaire de composition de fonction
// compose(f, g, h) est l'équivalent de (...args) => f(g(h(...args)))
const enhance = compose(
  // Ceux-ci sont tous deux des HOC n'acceptant qu'un argument
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

(C'est aussi cette propriété qui permet à `connect` et à d'autres HOC du même type d'être utilisés comme décorateurs, une proposition expérimentale JavaScript)

La fonction utilitaire `compose` est offerte par de nombreuses bibliothèqes tierces, y compris lodash (nommée [`lodash.flowRight`](https://lodash.com/docs/#flowRight)), [Redux](https://redux.js.org/api/compose), et [Ramda](https://ramdajs.com/docs/#compose).

## Convention: enveloppez le nom d'affichage pour faciliter le débogage {#convention-wrap-the-display-name-for-easy-debugging}

Tout comme n'importe quel autre composant, les composants conteneurs créés par des HOC apparaîssent dans les [Outils de développement React](https://github.com/facebook/react-devtools). Pour faciliter votre débogage, donnez-leur un nom d'affichage qui signifie qu'ils ont été crées par des HOC.

Le technique ls plus commune est d'envelopper le nom d'affichage du composant enfant. Par exemple, si votre composant d'ordre supérieur s'appelle `withSubscription`, et que le nom d'affichage du composant enfant est `CommentList`, utilisez le nom d'affichage `WithSubscription(CommentList)`&nbsp;:

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


## Avertissements {#caveats}

L'utilisation de composants d'ordre supérieur comporte quelques risques qui ne seront pas tout de suite évidents si vous débutez avec React.

### Pas de HOC à l'intérieur de la méthode de rendu {#dont-use-hocs-inside-the-render-method}

L'algorithme de différentiation de React (qu'on appelle réconcilation) utilise l'identité des composants pour déterminer s'il faut mettre à jour l'arborescence existante ou en monter une nouvelle. Si le composant renvoyé par `render` est identique (`===`) au composant du rendu précédent, React met à jour l'ancienne arborescence en la différenciant résursivement avec la nouvelle. S'ils ne sont pas identiques, l'ancienne arborescence est intégralement démontée.

En général, vous ne devriez pas avoir à y penser. Mais dans le cadre des HOC, cela importe puisque cela signifie que vous ne pouvez pas appliquer un HOC au sein de la méthode de rendu d'un composant&nbsp;:

```js
render() {
  // Une nouvelle version de EnhancedComponent est créée à chaque rendu
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // Cela cause le démontage et remontage de toute l'arborescence à chaque fois !
  return <EnhancedComponent />;
}
```

Il ne s'agit pas uniquement d'un problème de performance—remonter un composant signifie que l'état local de ce composant ainsi que celui de tous ses enfants sera perdu.

Appliquez plutôt les HOC à l'extérieur de la définition d'un composant, afin de créer le composant final une seule fois. Son identité sera alors constante lors des rendus. C'est normalement ce que vous voulez, non&nbsp;?

Dans les rares cas où vous devriez appliquer un HOC de façon dynamique, vous pouvez le faire au sein des méthodes de cycle de vie d'un composant ou dans son contructeur.

### Les méthodes statiques doivent être copiées {#static-methods-must-be-copied-over}

Il est parfois utile de définir une méthode statique dans un composant React. Par exemple, les conteneurs Relay exposent une méthode statique `getFragment` pour simplifier la composition de fragments GraphQL.

Cependant, quand vous appliquez un HOC à un composant, le composant initial est enveloppé par un composant conteneur. Cela signifie que le nouveau composant ne comporte aucune des méthodes statiques du composant initial.

```js
// Définit une méthode statique
WrappedComponent.staticMethod = function() {/*...*/}
// Applique un HOC
const EnhancedComponent = enhance(WrappedComponent);

// Le composant amélioré n'a pas de méthode statique
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

Pour résoudre cela, vous pouvez copier les méthodes dans le conteneur avant de le renvoyer&nbsp;:

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Doit connaître exactement quelles méthodes recopier :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

Par contre, cela exige que vous sachiez exactement quelles méthodes doivent être copiées. Vous pouvez autrement utiliser [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics) qui copie automatiquement toutes les méthodes statiques&nbsp;:

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

Une autre solution est d'exporter les méthodes statiques séparées du composant lui-même.

```js
// Plutôt que...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ... exportez les méthodes séparées du composant...
export { someFunction };

// ... et dans le module qui les utilise, importez les deux
import MyComponent, { someFunction } from './MyComponent.js';
```

### Ne transmettez pas les refs {#refs-arent-passed-through}

Bien que que la convention pour les composants d'ordre supérieur soit de transmettre toutes les props au composant enfant, elle ne s'applique pas aux refs. Une `ref` n'est en effet pas vraiment une prop—comme une `key`, React la traite de façon particulière. Si vous ajoutez une ref à un élément dont le composant résulte d'un HOC, la ref fait référence à une instance du composant conteneur le plus à l'extérieur, et non pas au composant enfant.

La solution à ce problème réside dans l'utilisation de l'API `React.forwardRef` (introduite dans React 16.3). [Apprenez-en plus dans la section sur la transmission des refs](/docs/forwarding-refs.html).
