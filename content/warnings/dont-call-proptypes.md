---
title: "Avertissement : don't call PropTypes"
layout: single
permalink: warnings/dont-call-proptypes.html
---

N’appelez pas les PropTypes

> Remarque
>
> `React.PropTypes` a été déplacé dans un paquet dédié depuis React v15.5. Merci d'utiliser désormais [la bibliothèque `prop-types`](https://www.npmjs.com/package/prop-types).
>
>Nous fournissons [un script codemod](/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes) pour automatiser la conversion.

Dans une future version majeure de React, le code implémentant les fonctions de validation de PropType sera supprimé en production. Quand ça arrivera, tout code appelant ces fonctions manuellement (si ce code n'est pas supprimé en production) lèvera une erreur.

### Déclarer des PropTypes reste une bonne idée {#declaring-proptypes-is-still-fine}

L'utilisation normale de PropTypes reste prise en charge :

```javascript
Button.propTypes = {
  highlighted: PropTypes.bool
};
```

Rien ne change ici.

### N'appelez pas PropTypes directement {#dont-call-proptypes-directly}

L'utilisation de PropTypes autrement que par l'annotation de composants React n'est plus acceptée :

```javascript
var apiShape = PropTypes.shape({
  body: PropTypes.object,
  statusCode: PropTypes.number.isRequired
}).isRequired;

// N'est plus accepté !
var error = apiShape(json, 'response');
```

Si vous avez besoin d’utiliser PropTypes de cette façon, nous vous encourageons à utiliser ou créer un *fork* de PropTypes (tels que [ces](https://github.com/aackerman/PropTypes) [deux](https://github.com/developit/proptypes) modules).

Si vous ne corrigez pas l'avertissement, ce code plantera en production avec React 16.

### Si vous n'appelez pas directement PropTypes mais recevez toujours l'avertissement {#if-you-dont-call-proptypes-directly-but-still-get-the-warning}

Inspectez la pile d’appels générée par l'avertissement. Vous y trouverez la définition de composant responsable de l'appel direct à PropTypes. Le problème est probablement dû à des PropTypes tiers qui enrobent ceux de React, par exemple :

```js
Button.propTypes = {
  highlighted: ThirdPartyPropTypes.deprecated(
    PropTypes.bool,
    'Use `active` prop instead'
  )
}
```

Dans ce cas, `ThirdPartyPropTypes.deprecated` est un container appelant `PropTypes.bool`. Ce modèle en soi est correct, mais déclenche un faux positif, car React pense que vous appelez directement PropTypes. La section suivante explique comment résoudre ce problème pour une bibliothèque implémentant quelque chose similaire à `ThirdPartyPropTypes`. Si ce n'est pas une bibliothèque que vous avez écrite, vous pouvez créer un problème à ce sujet.

### Correction du faux positif dans les PropTypes tiers {#fixing-the-false-positive-in-third-party-proptypes}

Si vous êtes l'auteur·e d'une bibliothèque PropTypes tierce et que vous laissez vos utilisateurs enrober les PropTypes React existants, ils risquent de voir apparaître cet avertissement provenant de votre bibliothèque. C’est dû au fait que React ne voit pas le dernier argument « secret » qu'il [passe](https://github.com/facebook/react/pull/7132) pour détecter les appels manuels à PropTypes.

Voici comment y remédier. Nous utiliserons le `deprecated` de  [react-bootstrap/react-prop-types](https://github.com/react-bootstrap/react-prop-types/blob/0d1cd3a49a93e513325e3258b28a82ce7d38e690/src/deprecated.js) comme exemple. L'implémentation actuelle ne transmet que les arguments `props`, `propName`, et `componentName` :

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName) {
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName);
  };
}
```

Afin de corriger le faux positif, assurez-vous de transmettre **tous** les arguments au PropType enrobé. C’est facile à faire avec la notation ES6 `...rest` :

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName, ...rest) { // Remarquez le ...rest ici
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName, ...rest); // et ici
  };
}
```

Cela fera taire l'avertissement.
