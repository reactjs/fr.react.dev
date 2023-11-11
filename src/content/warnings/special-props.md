---
title: Avertissement de props à traitement spécial
---

La plupart des props d'un élément JSX sont passées au composant ; cependant, deux props ont un traitement spécial par React (`key` et `ref`) et ne sont donc pas passées au composant.

Vous ne pouvez pas par exemple lire `props.key` depuis un composant. Si vous avez besoin d'accéder à la même valeur au sein d'un composant enfant, vous devriez la passer via une prop distincte (par exemple `<ListItemWrapper key={result.id} id={result.id} />`), puis lire `props.id`. Ça peut sembler redondant, mais c'est nécessaire pour séparer la logique applicative des informations à destination du moteur de React.
