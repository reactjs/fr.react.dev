---
title: "API React historique"
---

<Intro>

Ces API sont exposées par le module `react`, mais sont déconseillées pour l'écriture de nouveau code.  Consultez les pages API individuelles liées ci-dessous pour découvrir les alternatives que nous leur proposons.

</Intro>

---

## API historiques {/*legacy-apis*/}

* [`Children`](/reference/react/Children) vous permet de manipuler et transformer les contenus JSX reçus *via* la prop `children`. [Découvrez les alternatives](/reference/react/Children#alternatives).
* [`cloneElement`](/reference/react/cloneElement) vous permet de créer un élément React en vous basant sur un élément existant. [Découvrez les alternatives](/reference/react/cloneElement#alternatives).
* [`Component`](/reference/react/Component) vous permet de définir un composant React sous forme d'une classe JavaScript ES2015+. [Découvrez les alternatives](/reference/react/Component#alternatives).
* [`createElement`](/reference/react/createElement) vous permet de créer un élément React. Vous utiliserez plutôt JSX pour ça.
* [`createRef`](/reference/react/createRef) crée un objet *ref* pouvant contenir une valeur quelconque. [Découvrez les alternatives](/reference/react/createRef#alternatives).
* [`isValidElement`](/reference/react/isValidElement) vérifie qu'une valeur est un élément React. Généralement utilisé avec [`cloneElement`](/reference/react/cloneElement).
* [`PureComponent`](/reference/react/PureComponent) est similaire à [`Component`](/reference/react/Component), mais évite un nouveau rendu lorsque les props sont identiques. [Découvrez les alternatives](/reference/react/PureComponent#alternatives).


---

## API dépréciées {/*deprecated-apis*/}

<Deprecated>

Ces API seront retirées d'une future version majeure de React.

</Deprecated>

* [`createFactory`](/reference/react/createFactory) vous permet de créer une fonction qui produit des éléments React d'un type prédéfini.
