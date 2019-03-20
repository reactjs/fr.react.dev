---
id: refs-and-the-dom
title: Références et le DOM
redirect_from:
  - "docs/working-with-the-browser.html"
  - "docs/more-about-refs.html"
  - "docs/more-about-refs-ko-KR.html"
  - "docs/more-about-refs-zh-CN.html"
  - "tips/expose-component-functions.html"
  - "tips/children-undefined.html"
permalink: docs/refs-and-the-dom.html
---

Les références fournissent une solution pour accéder aux noeuds du DOM ou aux éléments React créés dans la méthode d'affichage.

In the typical React dataflow, [props](/docs/components-and-props.html) are the only way that parent components interact with their children. To modify a child, you re-render it with new props. However, there are a few cases where you need to imperatively modify a child outside of the typical dataflow. The child to be modified could be an instance of a React component, or it could be a DOM element. For both of these cases, React provides an escape hatch.

### Quand utiliser les références {#when-to-use-refs}

Il y a quelques bons cas d'utilisation pour les références :

* Gérer le focus, la sélection du texte, ou les médias.
* Lancer des animations impératives.
* Intégrer avec des bibliothèques externes du DOM.

Evitez d'utiliser les références pour tout ce qui peut être fait par déclaration.

Par exemple, au lieu d'exposer les méthodes `open()` et `close()`dans un composant `Dialog`, vous pouvez lui passer une prop `isOpen`.

### N'abusez pas des références {#dont-overuse-refs}

Votre première inclinaison serait d'utiliser les références pour que les choses se produisent dans votre app. Si c'est le cas, prenez un moment et ayez une pensée critique pour savoir où l'état doit être géré dans la hiérarchie des composants. Souvent, il est clair que la bonne place pour gérer l'état est à un haut niveau de la hiérarchie. Voyez le guide [Remonter l'état](/docs/lifting-state-up.html) pour des exemples.

> Remarque
>
> Les exemples ci-dessous ont été mis à jour pour utiliser l'API `React.createRef()` introduite dans React 16.3. Si vous utilisez une version précédente de React, nous recommandons d'utiliser [les références de fonction de rappel](#callback-refs) à la place.

### Créer des références {#creating-refs}

Les références sont créées en utilisant `React.createRef()` et attachées aux éléments React via l'attribut `ref`. Les références sont souvent assignées à une propriété d'instance quand un composant est construit et peuvent donc référencées à travers le composant.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

### Accéder aux références {#accessing-refs}

Quand une référence est passée à un élément dans `render`, une référence au noeud devient accessible dans l'attribut `current` de la référence.

```javascript
const node = this.myRef.current;
```

La valeur de la références change suivant le type de noeud :

- Quand l'attribut `ref` est utilisé dans une élément HTML, la `ref` créée dans le constructeur avec `React.createRef()` reçoit le sous élément DOM comme la propriété `current`. 
- Quand l'attribut `ref` est utilisé dans un composant de classe personnalisé, l'objet `ref` reçoit l'instance du composant créée en tant que `current`.
- **Vous ne pouvez pas utiliser l'attribut `ref` dans les fonctions de composants** parce qu'ils n'ont pas d'instance.

Les exemples ci-dessous présentent les différences.

#### Ajouter une références à un élément du DOM {#adding-a-ref-to-a-dom-element}

Ce code utilise une `ref` pour stocker une référence à un noeud du DOM :

```javascript{5,12,22}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // créez une référence pour stocker l'élément DOM textInput
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Focus explicitement  l'input texte en utilisant l'API native du DOM
    // Remarque : nous accédons "current" pour cibler le noeud DOM
    this.textInput.current.focus();
  }

  render() {
    // Précise à React que l'on veut associer la référence input
    // avec le `textInput` créé dans le constructeur
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Focus l'input texte"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React va assigner la propriété `current` avec l'élément DOM quand le composant est créé et la remettre à `null` lorsqu'il est détruit. La mise à jour de `ref` se produit avant les méthodes du cycle de vie `componentDidMount` ou `componentDidUpdate`.

#### Ajouter une références à un composant de classe {#adding-a-ref-to-a-class-component}

Si on veut englober le `CustomTextInput` ci-dessus pour simuler un clic immédiatement après la création, on peut utiliser une référence pour accéder à l'input personnalisé et appeler manuellement la méthode `focusTextInput` :

```javascript{4,8,13}
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```

Il faut noter que ça ne fonctionne que si `CustomTextInput` est déclaré comme une classe :

```js{1}
class CustomTextInput extends React.Component {
  // ...
}
```

#### Refs and Function Components {#refs-and-function-components}

**Vous ne pouvez pas utiliser l'attribut `ref` dans les fonctions de composants** parce qu'ils n'ont pas d'instance.

```javascript{1,8,13}
function MyFunctionComponent() {
  return <input />;
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    // Cela ne fonctionnera pas !
    return (
      <MyFunctionComponent ref={this.textInput} />
    );
  }
}
```

Vous devez convertir le composant en une classe si vous avez besoin d'une référence,de la même manière qu'avec les méthodes du cycle de vie ou d'état.

Vous pouvez, néanmoins, **utiliser l'attribut `ref` dans une fonction de composant** tant que vous vous référez à un élément DOM ou une composant de classe :

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // textInput doit être déclaré ici pour que la référence puisse s'y référer
  let textInput = React.createRef();

  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Focus l'input texte"
        onClick={handleClick}
      />
    </div>
  );
}
```

### Exposer les références du DOM aux parents du composant {#exposing-dom-refs-to-parent-components}

In rare cases, you might want to have access to a child's DOM node from a parent component. This is generally not recommended because it breaks component encapsulation, but it can occasionally be useful for triggering focus or measuring the size or position of a child DOM node.

Même si vous pouvez [ajouter une référence à un composant enfant](#adding-a-ref-to-a-class-component), ce n'est pas une solution idéale car vous n'obtenez qu'une instance de composant plutôt qu'un noeud du DOM. De plus, ça ne fonctionne pas avec les fonctions de composants.

Si vous utiliser React 16.3 ou supérieur, nous recommandons d'utiliser [le transfert de références](/docs/forwarding-refs.html) pour ces cas. **Le transfert de références permet d'exposer les références d'un composant enfant comme celles du composant parent**. Vous pouvez trouver un exemple détaillé de comment exposer un noeud DOM enfant pour un composant parent [dans la documentation de transfert de références](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

Si vous utilisez React 16.2 ou précédent, ou si vous avez besoin de plus de flexibilités que fournies par le transfert de références, vous pouvez utiliser [cette alternative](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509) et explicitement passer une références via une autre prop.

Quand possible, nous recommandons de ne pas exposer les noeuds du DOM, mais ça peut être une pirouette utile. Si vous n'avez aucun contrôle sur l'implémentation du composant enfant, votre seule option est d'utiliser [`findDOMNode()`](/docs/react-dom.html#finddomnode), mais ce n'est pas recommandé et obsolète dans [`StrictMode`](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage). 

### Fonction de rappel de références {#callback-refs}

React supporte aussi une autre façon d'appliquer les références appelée "fonction de rappel de références", qui permet un contrôle plus fin sur la création et destruction des références.

Plutôt que de passer un attribut `ref` créé par `createRef()`, vous pouvez passer une fonction. La fonction récupère l'instance du composant React ou l'élément HTML du DOM comme argument, qui peut être stocké et accédé  de partout.

L'exemple ci-dessous implémente un pattern commun : utiliser la fonction de rappel `ref` pour stocker une référence à un noeud DO? dans une propriété d'instance.

```javascript{5,7-9,11-14,19,29,34}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Focus sur l'input texte en utilisant l'API native du DOM
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // Focus automatique sur l'input à la création
    this.focusTextInput();
  }

  render() {
    // Utilisez la fonction de rappel `ref` pour stocker une référence à l'élément
    // d'input du DOM dans un champ d'instance
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus l'input texte"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React va appeler la fonction de rappel `ref` avec l'élément DOM quand le composant est créé et l'appeler avec `null` quand il est détruit. Les références sont toujours à jour avant l'exécution de `componentDidMount` ou `componentDidUpdate`.

Vous pouvez passer une fonction de rappel de références entre des composants comme vous pouvez avec des objets de références qui ont été conçu avec `React.createRef()`.

```javascript{4,13}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

Dans l'exemple précédent, `Parent` passe sa référence de fonction de rappel en tant qu'une propriété `inputRef` à `CustomTextInput` et `CustomTextInput` passe la même fonction comme un attribut spécial `ref` à `l'<input>`. En résultat, `this.inputElement` dans `Parent` va être mis dans le noeud DOM correspondant à l'élément `<input>` dans `CustomTextInput`.

### Legacy API: String Refs {#legacy-api-string-refs}

Si vous avez précédemment travaillé avec React, vous êtes peut être familier avec une ancienne API où l'attribut `ref` est une chaîne de caractères, comme `textInput`, et le noeud DOM est accessible via `this.refs.textInput`. Nous recommandons de ne plus utiliser cette solution à cause de [plusieurs problèmes](https://github.com/facebook/react/pull/8333#issuecomment-271648615), du côté ancien et **parce que cette solution sera surement supprimée dans une version future**.

> Remarque
>
> Si vous utilisez `this.refs.textInput` pour accéder aux références, nous recommandons d'utiliser soit le [pattern de fonction de rappel](#callback-refs) soit  [l'API `createRef`](#creating-refs).

### Avertissement avec les références des fonctions de rappels {#caveats-with-callback-refs}

Si la fonction de rappel `ref` est définie comme fonction en ligne, elle va être appelée deux fois pendant les mises à jour. Tout d'abord avec la valeur `null` puis une seconde fois avec l'élément DOM. Cet effet se produit parce qu'une nouvelle instance de la fonction est créée à chaque affichage, et React a besoin de vider l'ancienne référence avant d'affecter la nouvelle. Vous pouvez éviter ça en définissant la fonction de rappel `ref` comme liée à une méthode de la classe, mais notez que ça ne devrait pas avoir d'importance dans la plupart des cas.
