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

  // Vous pouvez aussi déclarer qu'une prop est une instance d'une classe.
  // On utilise pour ça l'opérateur JS instanceof.
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

  // Cette prop est requise et peut être de n'importe quel type
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

Si vous utilisez une transformation Babel telle que [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/) , vous pouvez aussi déclarer `defaultProps` comme propriété statique dans une classe de composant React. Cependant, cette syntaxe n'a pas encore été finalisée et requiert une étape de compilation supplémentaire pour fonctionner dans un navigateur. Pour plus d'informations, voir la [proposition des aspects statiques de classe](https://github.com/tc39/proposal-static-class-features/).

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

Les `defaultProps` seront utilisées pour s'assurer que `this.props.name` aura une valeur si elle n'était pas spécifiée par le composant parent. La validation de types des `propTypes` aura lieu après que `defaultProps` est résolu, la validation de types s'applique donc également aux `defaultProps`.
