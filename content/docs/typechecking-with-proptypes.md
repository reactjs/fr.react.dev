---
id: typechecking-with-proptypes
title: Validation de types avec PropTypes
permalink: docs/typechecking-with-proptypes.html
redirect_from:
  - "docs/react-api.html#typechecking-with-proptypes"
---

> Remarque :
>
> `React.PropTypes` a été déplacé dans un autre module depuis React v15.5. Merci de plutôt utiliser [le module `prop-types`](https://www.npmjs.com/package/prop-types).
>
>Nous fournissons [un script codemod](/blog/2017/04/07/react-v15.5.0.html#migrating-from-reactproptypes) pour automatiser cette transition.

Au fur et à mesure que votre appli grossit, vous pouvez détecter un grand nombre de bugs grâce à la validation de types. Dans certains cas, vous pouvez utiliser des extensions JavaScript comme [Flow](https://flow.org/) ou [TypeScript](https://www.typescriptlang.org/) pour valider les types de toute votre application. Mais même si vous ne les utilisez pas, React possède ses propres fonctionnalités de validation de types. Pour lancer la validation de types des propriétés d'un composant, vous pouvez ajouter la propriété spéciale `propTypes` :

```javascript
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

`PropTypes` exporte un ensemble de validateurs qui peuvent être utilisés pour s'assurer que la donnée que vous recevez est valide. Dans cet exemple, nous utilisons `PropTypes.string`. Quand une valeur invalide est fournie à une propriété, un message d'avertissement apparaîtra dans la console JavaScript. Pour des raisons de performance, `propTypes` n'est vérifiée qu'en mode développement.

### PropTypes {#proptypes}

Voici un exemple qui détaille les différents validateurs fournis :

```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // Vous pouvez déclarer qu'une propriété est d'un certain type JS. Par défaut,
  // elles sont toutes optionnelles.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Tout ce qui peut être rendu : des nombres, des chaînes de caractères, des élements
  // ou des tableaux (ou fragments) contenant ces types.
  optionalNode: PropTypes.node,

  // Un élement React.
  optionalElement: PropTypes.element,

  // Vous pouvez aussi déclarer qu'une propriété est une instance d'une classe.
  // On utilise pour ça l'opérateur JS instanceof.
  optionalMessage: PropTypes.instanceOf(Message),

  // Vous pouvez vous assurer que votre propriété est limitée à certaines valeurs spécifiques
  // en la traitant comme une enumération.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // Un objet qui pourrait être n'importe lequel de ces types
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // Un tableau d'un certain type
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // Un objet avec des valeurs d'un certain type
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // Un objet avec une forme particulière
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // Vous pouvez ajouter `isRequired` à la fin de n'importe lequel des types ci-dessus pour vous assurer
  // qu'un message d'avertissement s'affiche lorsque la propriété n'est pas fournie.
  requiredFunc: PropTypes.func.isRequired,

  // Une valeur de n'importe quel type de données
  requiredAny: PropTypes.any.isRequired,

  // Vous pouvez aussi spécifier un validateur personnalisé. Il devra retourner un objet Error
  // si la validation échoue. N'utilisez pas de `console.warn` ou `throw`,
  // car ça ne fonctionnera pas dans `oneOfType`.
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // Vous pouvez aussi fournir un validateur personnalisé à `arrayOf` et `objectOf`.
  // Il faudra retourner un objet Error si la validation échoue. Le validateur
  // sera appelé pour chaque clé du tableau ou de l'objet. Les deux premiers arguments
  // du validateur sont le tableau ou l'objet lui-même, et la clé
  // de la valeur actuelle.
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```

### Exiger un seul enfant {#requiring-single-child}

Avec `PropTypes.element`, vous pouvez spécifier qu'un seul enfant peut être passé à un composant.

```javascript
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // Ça doit être un unique élément ou un avertissement sera affiché.
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

### Valeurs par défaut des propriétés {#default-prop-values}

Vous pouvez définir des valeurs par défaut pour vos `props` en utilisant la propriété spéciale `defaultProps` :

```javascript
class Greeting extends React.Component {
  render() {
    return (
      <h1>Bonjour, {this.props.name}</h1>
    );
  }
}

// Spécifie les valeurs par défaut des propriétés :
Greeting.defaultProps = {
  name: 'Étranger'
};

// Renders "Bonjour, Étranger":
ReactDOM.render(
  <Greeting />,
  document.getElementById('exemple')
);
```

Si vous utilisez une transformation Babel telle que [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/) , vous pouvez aussi déclarer `defaultProps` comme propriété statique dans une classe d'un composant React. Cependant, cette syntaxe n'a pas encore été finalisée et requiert une étape de compilation pour fonctionner dans un navigateur. Pour plus d'informations, voir la [proposition des champs de classe](https://github.com/tc39/proposal-class-fields).

```javascript
class Greeting extends React.Component {
  static defaultProps = {
    name: 'étranger'
  }

  render() {
    return (
      <div>Bonjour, {this.props.name}</div>
    )
  }
}
```

Les `defaultProps` seront utilisées pour s'assurer que `this.props.name` aura une valeur si elle n'était pas spécifiée par le composant parent. La validation de types des `propTypes` aura lieu après que `defaultProps` soit résolu, la validation de types s'applique donc également aux `defaultProps`.
