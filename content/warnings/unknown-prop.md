---
title: "Avertissement : unknown prop"
layout: single
permalink: warnings/unknown-prop.html
---

Propriété inconnue.  Cet avertissement se déclenche si vous tentez d’afficher un élément DOM avec une prop qui n’est pas reconnue par React comme un attribut DOM légal.  Assurez-vous que vos éléments DOM n’ont pas de props suspectes qui traînent.

Si vous voyez cet avertissement, c’est en général dû à une des raisons suivantes :

1. Utilisez-vous `{...this.props}` ou `cloneElement(element, this.props)` ?  Votre composant transfère ses props directement à un élément enfant (voir [la doc les props](docs/components-and-props.html)).  Quand vous transférez des props à un composant enfant, assurez-vous de ne pas lui refiler par mégarde des props qui n’auraient dû être interprétées que par le composant parent.
2. Vous utilisez un attribut DOM non-standard sur un nœud DOM natif, peut-être pour représenter des données personnalisées.  Si vous essayez d’associer des données perso à un élément DOM standard, utilisez plutôt un attribut de données perso tel que décrit [dans le MDN](https://developer.mozilla.org/fr/docs/Apprendre/HTML/Comment/Utiliser_attributs_donnes).
3. React ne reconnaît pas encore l’attribut que vous avez spécifié.  Ça va sûrement être corrigé dans une future version de React.  Néanmoins, React supprime pour le moment tous les attributs qu’il ne connaît pas, en conséquence même si vous spécifiez de tels attributs, React ne les exploitera pas.
4. Vous utilisez un composant React sans avoir mis la première lettre en majuscule.  React l’interprète alors comme une balise DOM parce que [la transformation de JSX utilise une convention de casse pour distinguer entre composants personnalisés et balises DOM](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized).

---

Pour corriger ça, les composants qui transfèrent des props devraient « consommer » toute prop qui leur est spécifiquement destinée et ne doit pas être transmise aux composants enfants.  Par exemple :

**Erroné :** La prop inattendue `layout` est transmise à la balise `div`.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // ERRONÉ ! Vous savez bien que la prop "layout" ne sera pas comprise par <div>.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // ERRONÉ ! Vous savez bien que la prop "layout" ne sera pas comprise par <div>.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**Correct :** l’opérateur de _rest_ est utilisé pour retirer certaines props du lot général, et laisser les autres dans une nouvelle variable.

```js
function MyDiv(props) {
  const { layout, ...rest } = props
  if (layout === 'horizontal') {
    return <div {...rest} style={getHorizontalStyle()} />
  } else {
    return <div {...rest} style={getVerticalStyle()} />
  }
}
```

**Correct :** Vous pouvez aussi affecter les props à un nouvel objet et en retirer explicitement les clés que vous n’utilisez qu’au niveau racine.  Assruez-vous de ne pas supprimer ces props sur l’objet `this.props` original, car il doit pouvoir être considéré comme immuable.

```js
function MyDiv(props) {

  const divProps = Object.assign({}, props);
  delete divProps.layout;

  if (props.layout === 'horizontal') {
    return <div {...divProps} style={getHorizontalStyle()} />
  } else {
    return <div {...divProps} style={getVerticalStyle()} />
  }
}
```
