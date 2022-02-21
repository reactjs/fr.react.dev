---
id: typechecking-with-proptypes
title: Validation de types avec PropTypes
permalink: docs/typechecking-with-proptypes.html
redirect_from:
  - "docs/react-api.html#typechecking-with-proptypes"
---

> Remarque
>
> `React.PropTypes` a été déplacé dans un autre module depuis React v15.5. Merci de plutôt utiliser [le module `prop-types`](https://www.npmjs.com/package/prop-types).
>
>Nous fournissons [un script codemod](/blog/2017/04/07/react-v15.5.0.html#migrating-from-reactproptypes) pour automatiser cette transition.

Au fur et à mesure que votre application grandit, vous pouvez détecter un grand nombre de bugs grâce à la validation de types. Dans certains cas, vous pouvez utiliser des extensions JavaScript comme [Flow](https://flow.org/) ou [TypeScript](https://www.typescriptlang.org/) pour valider les types de toute votre application. Mais même si vous ne les utilisez pas, React possède ses propres fonctionnalités de validation de types. Pour lancer la validation de types des props d'un composant, vous pouvez ajouter la propriété spéciale `propTypes` :

```javascript{11-13}
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Bonjour, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

<<<<<<< HEAD
Dans cet exemple nous utilisons un composant à base de classe, mais ça reste vrai pour les fonctions composants et les composants créés avec [`React.memo`](https://reactjs.org/docs/react-api.html#reactmemo) ou [`React.forwardRef`](https://reactjs.org/docs/react-api.html#reactforwardref).
=======
In this example, we are using a class component, but the same functionality could also be applied to function components, or components created by [`React.memo`](/docs/react-api.html#reactmemo) or [`React.forwardRef`](/docs/react-api.html#reactforwardref).
>>>>>>> 2310e15532aba273d713996a4c6ef04247dff764

`PropTypes` exporte un ensemble de validateurs qui peuvent être utilisés pour s'assurer que la donnée que vous recevez est valide. Dans cet exemple, nous utilisons `PropTypes.string`. Quand une valeur non valide est fournie à une prop, un message d'avertissement apparaîtra dans la console JavaScript. Pour des raisons de performances, `propTypes` n'est vérifiée qu'en mode développement.

### PropTypes {#proptypes}

Voici un exemple qui détaille les différents validateurs fournis :

```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // Vous pouvez déclarer qu'une prop est d'un certain type JS. Par défaut,
  // elles sont toutes optionnelles.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Tout ce qui peut apparaître dans le rendu : des nombres, des chaînes de
  //  caractères, des éléments ou des tableaux (ou fragments) contenant ces types.
  optionalNode: PropTypes.node,

  // Un élément React.
  optionalElement: PropTypes.element,

  // Un type d’élément React (ex. MyComponent).
  optionalElementType: PropTypes.elementType,

<<<<<<< HEAD
  // Vous pouvez aussi déclarer qu'une prop est une instance d'une classe.
  // On utilise pour ça l'opérateur JS instanceof.
=======
  // You can also declare that a prop is an instance of a class. This uses
  // JS's instanceof operator.
>>>>>>> 2310e15532aba273d713996a4c6ef04247dff764
  optionalMessage: PropTypes.instanceOf(Message),

  // Vous pouvez vous assurer que votre prop est limitée à certaines
  // valeurs spécifiques en la traitant comme une enumération.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // Cette prop peut être de n'importe lequel de ces trois types
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // Un tableau avec des valeurs d'un certain type
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // Un objet avec des valeurs d'un certain type
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // Un objet avec une forme spécifique
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // An object with warnings on extra properties
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number
  }),

  // Vous pouvez ajouter `isRequired` à la fin de n'importe lequel des validateurs
  // ci-dessus pour vous assurer qu'un message d'avertissement s'affiche lorsque
  // la prop n'est pas fournie.
  requiredFunc: PropTypes.func.isRequired,

<<<<<<< HEAD
  // Cette prop est requise et peut être de n'importe quel type
=======
  // A required value of any data type
>>>>>>> 2310e15532aba273d713996a4c6ef04247dff764
  requiredAny: PropTypes.any.isRequired,

  // Vous pouvez aussi spécifier un validateur personnalisé. Il devra renvoyer
  // un objet Error si la validation échoue. N'utilisez pas de `console.warn`
  // ou `throw`, car ça ne fonctionnera pas dans `oneOfType`.
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // Vous pouvez aussi fournir un validateur personnalisé à `arrayOf` et `objectOf`.
  // Il faudra renvoyer un objet Error si la validation échoue. Le validateur
  // sera appelé pour chaque clé du tableau ou de l'objet. Les deux premiers
  // arguments du validateur sont le tableau ou l'objet lui-même, et la clé
  // de la valeur actuelle.
  customArrayProp: PropTypes.arrayOf(
    function(propValue, key, componentName, location, propFullName) {
      if (!/matchme/.test(propValue[key])) {
        return new Error(
          'Invalid prop `' + propFullName + '` supplied to' +
          ' `' + componentName + '`. Validation failed.'
        );
      }
    }
  )
};
```

### Exiger un seul enfant {#requiring-single-child}

Avec `PropTypes.element`, vous pouvez spécifier qu'un seul enfant peut être passé à un composant.

```javascript
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // Ça doit être un élément unique ou un avertissement sera affiché.
    const children = this.props.children;
    return (
      <div>
        {children}
      </div>
    );
  }
}

MyComponent.propTypes = {
  children: PropTypes.element.isRequired
};
```

### Valeurs par défaut des props {#default-prop-values}

Vous pouvez définir des valeurs par défaut pour vos `props` en utilisant la propriété spéciale `defaultProps` :

```javascript
class Greeting extends React.Component {
  render() {
    return (
      <h1>Bonjour, {this.props.name}</h1>
    );
  }
}

// Spécifie les valeurs par défaut des props :
Greeting.defaultProps = {
  name: 'bel inconnu'
};

// Affiche « Bonjour, bel inconnu » :
ReactDOM.render(
  <Greeting />,
  document.getElementById('example')
);
```

<<<<<<< HEAD
Si vous utilisez une transformation Babel telle que [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/) , vous pouvez aussi déclarer `defaultProps` comme propriété statique dans une classe de composant React. Cependant, cette syntaxe n'a pas encore été finalisée et requiert une étape de compilation supplémentaire pour fonctionner dans un navigateur. Pour plus d'informations, voir la [proposition des aspects statiques de classe](https://github.com/tc39/proposal-static-class-features/).
=======
If you are using a Babel transform like [plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties/) (previously _plugin-transform-class-properties_), you can also declare `defaultProps` as static property within a React component class. This syntax has not yet been finalized though and will require a compilation step to work within a browser. For more information, see the [class fields proposal](https://github.com/tc39/proposal-class-fields).
>>>>>>> 2310e15532aba273d713996a4c6ef04247dff764

```javascript
class Greeting extends React.Component {
  static defaultProps = {
    name: 'bel inconnu'
  }

  render() {
    return (
      <div>Bonjour, {this.props.name}</div>
    )
  }
}
```

<<<<<<< HEAD
Les `defaultProps` seront utilisées pour s'assurer que `this.props.name` aura une valeur si elle n'était pas spécifiée par le composant parent. La validation de types des `propTypes` aura lieu après que `defaultProps` est résolu, la validation de types s'applique donc également aux `defaultProps`.
=======
The `defaultProps` will be used to ensure that `this.props.name` will have a value if it was not specified by the parent component. The `propTypes` typechecking happens after `defaultProps` are resolved, so typechecking will also apply to the `defaultProps`.

### Function Components {#function-components}

If you are using function components in your regular development, you may want to make some small changes to allow PropTypes to be properly applied.

Let's say you have a component like this:

```javascript
export default function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}
```

To add PropTypes, you may want to declare the component in a separate function before exporting, like this:

```javascript
function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}

export default HelloWorldComponent
```

Then, you can add PropTypes directly to the `HelloWorldComponent`:

```javascript
import PropTypes from 'prop-types'

function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}

HelloWorldComponent.propTypes = {
  name: PropTypes.string
}

export default HelloWorldComponent
```
>>>>>>> 2310e15532aba273d713996a4c6ef04247dff764
