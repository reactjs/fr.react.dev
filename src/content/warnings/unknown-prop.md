---
title: Avertissement de prop inconnue
---

L'avertissement de prop inconnue est déclenché lorsque vous tentez d'afficher un élément DOM avec une prop que React ne reconnaît pas comme étant une propriété / un attribut DOM légal.  Assurez-vous que vos éléments DOM n'ont pas des propriétés louches qui traînent.

Il y a quelques raisons courantes pour cet avertissement :

1. Utilisez-vous `{...props}` ou `cloneElement(element, props)` ? Quand vous copiez des props vers un composant enfant, assurez-vous que vous ne transmettez pas accidentellement des props qui ne visaient que le composant parent.  Vous trouverez des solutions usuelles plus bas.

2. Vous utilisez un attribut DOM non standard sur un nœud DOM natif, peut-être pour représenter des données personnalisées.  Si vous tentez d'attacher des données personnalisées à un élément DOM standard, envisagez plutôt d'utiliser des attributs `data-*` comme le décrit le [MDN](https://developer.mozilla.org/fr/docs/Learn/HTML/Howto/Use_data_attributes).

3. React ne reconnaît pas encore l'attribut que vous avez spécifié.  Ça sera probablement corrigé dans une future version de React.  React vous autorisera à passer cet attribut sans avertissement si son nom est entièrement en minuscules.

4. Vous utilisez un composant React sans initiale majuscule, par exemple `<myButton />`. React comprend ça comme une balise DOM native parce que JSX distingue entre les initiales majuscule et minuscule des balises pour choisir entre des composants à vous et des éléments DOM natifs.  Pour vos propres composants React, utilisez la *PascalCase*. Écrivez par exemple `<MyButton />` plutôt que `<myButton />`.

---

Si vous recevez cet avertissement parce que vous transmettez des props avec par exemple `{...props}`, votre composant parent doit d'abord « consommer » toute prop qui ne vise que lui, et non ses composants enfants.  Voici un exemple :

**Erroné :** une prop `layout` inattendue est transmise à la balise `div`.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // PROBLÉMATIQUE ! Car on sait bien que <div> n’a pas de propriété "layout".
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // PROBLÉMATIQUE ! Car on sait bien que <div> n’a pas de propriété "layout".
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**Correct :** vous pouvez utiliser la syntaxe de *rest nominatif* pour retirer certaines données des props à transférer, en plaçant les autres dans une variable.

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

**Correct :** vous pouvez aussi affecter les props à un nouvel objet et en retirer les clés que vous n'utilisez pas.  Assurez-vous de ne pas retirer ces clés des props d'origine, car celles-ci sont considérées immuables.

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
