---
id: refs-and-the-dom
title: Les refs et le DOM
prev: static-type-checking.html
next: uncontrolled-components.html
redirect_from:
  - "docs/working-with-the-browser.html"
  - "docs/more-about-refs.html"
  - "docs/more-about-refs-ko-KR.html"
  - "docs/more-about-refs-zh-CN.html"
  - "tips/expose-component-functions.html"
  - "tips/children-undefined.html"
permalink: docs/refs-and-the-dom.html
---

Les refs fournissent un moyen d’accéder aux nœuds du DOM ou éléments React créés dans la méthode de rendu.

Dans le flux de données habituel de React, les [props](/docs/components-and-props.html) constituent le seul moyen pour des composants parents d'interagir avec leurs enfants.  Pour modifier un enfant, vous le rafraîchissez avec de nouvelles props.  Ceci dit, dans certains cas vous aurez besoin de modifier un enfant de façon impérative, hors du flux de données normal.  L’enfant à modifier pourrait être une instance d'un composant React ou un élément DOM.  Dans les deux cas, React vous fournit une échappatoire.

### Quand utiliser les refs {#when-to-use-refs}

Voici quelques cas d'usages tout trouvés pour les refs :

* Gérer le focus, la sélection du texte, ou la lecture de média.
* Lancer des animations impératives.
* S'interfacer avec des bibliothèques DOM tierces.

Evitez d'utiliser les refs pour tout ce qui peut être fait déclarativement.

Par exemple, au lieu d'exposer les méthodes `open()` et `close()`dans un composant `Dialog`, vous pouvez lui passer une prop `isOpen`.

### N'abusez pas des refs {#dont-overuse-refs}

Vous serez peut-être enclin·e à toujours commencer par une ref pour « faire le boulot » dans votre appli. Si tel est le cas, examinez d'un œil critique votre hiérarchie de composants pour déterminer lesquels sont censés posséder l'état.  Vous remarquerez souvent que l’état serait mieux géré plus haut dans la hiérarchie. Voyez le guide [Faire remonter l'état](/docs/lifting-state-up.html) pour des exemples.

> Remarque
>
> Les exemples ci-dessous ont été mis à jour pour utiliser l'API `React.createRef()` introduite dans React 16.3. Si vous utilisez une version précédente de React, nous recommandons d'utiliser [les refs avec fonctions de rappel](#callback-refs) à la place.

### Créer des refs {#creating-refs}

Les refs sont créées en utilisant `React.createRef()` et attachées aux éléments React via l'attribut `ref`. Les refs sont souvent affectées à une propriété d'instance quand un composant est construit et peuvent donc être référencées à travers le composant.

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

### Accéder aux refs {#accessing-refs}

Quand une ref est passée à un élément dans `render`, une référence au nœud devient accessible via l'attribut `current` de la ref.

```javascript
const node = this.myRef.current;
```

La valeur de la ref change suivant le type de nœud :

- Quand l'attribut `ref` est utilisé sur un élément HTML, la `ref` créée dans le constructeur avec `React.createRef()` reçoit l’élément DOM sous-jacent dans sa propriété `current`.
- Quand l'attribut `ref` est utilisé sur un composant de classe personnalisée, l'objet `ref` reçoit l'instance du composant créée dans son `current`.
- **Vous ne pouvez pas utiliser l'attribut `ref` sur les fonctions composants** parce qu'elles n'ont pas d'instance.

Les exemples ci-dessous illustrent les différences.

#### Ajouter une ref à un élément du DOM {#adding-a-ref-to-a-dom-element}

Ce code utilise une `ref` pour stocker une référence à un nœud du DOM :

```javascript{5,12,22}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // Crée une référence pour stocker l’élément DOM textInput
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Donne explicitement le focus au champ texte en utilisant l’API DOM native.
    // Remarque : nous utilisons `current` pour cibler le nœud DOM
    this.textInput.current.focus();
  }

  render() {
    // Dit à React qu’on veut associer la ref `textInput` créée
    // dans le constructeur avec le `<input>`.
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Donner le focus au champ texte"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React affectera l'élément DOM à la propriété `current` quand le composant sera monté, et la remettra à `null` lorsqu'il sera démonté. La `ref` est mise à jour avant le déclenchement des méthodes de cycle de vie `componentDidMount` et `componentDidUpdate`.

#### Ajouter une ref à un composant à base de classe {#adding-a-ref-to-a-class-component}

Si on voulait enrober le `CustomTextInput` ci-dessus pour simuler un clic immédiatement après le montage, on pourrait utiliser une ref pour accéder au champ personnalisé et appeler manuellement sa méthode `focusTextInput` :

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

Il faut noter que ça ne fonctionne que si `CustomTextInput` est déclaré comme une classe :

```js{1}
class CustomTextInput extends React.Component {
  // ...
}
```

#### Les refs et les fonctions composants {#refs-and-function-components}

Par défaut, **vous ne pouvez pas utiliser l'attribut `ref` sur les fonctions composants** parce qu'elles n'ont pas d'instance.

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
    // Ça ne fonctionnera pas !
    return (
      <MyFunctionComponent ref={this.textInput} />
    );
  }
}
```

Si vous voulez permettre à vos utilisateurs de passer une `ref` à votre fonction composant, vous pouvez utiliser[`forwardRef`](/docs/forwarding-refs.html) (peut-être combiné à un [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)), ou vous pouvez convertir votre composant pour être à base de classe.

Vous pouvez néanmoins **utiliser l'attribut `ref` dans une fonction composant**, tant que vous vous référez à un élément DOM ou un composant à base de classe :

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // textInput doit être déclaré ici pour que la ref puisse s’y référer
  const textInput = useRef(null);

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
        value="Donner le focus au champ texte"
        onClick={handleClick}
      />
    </div>
  );
}
```

### Exposer les refs DOM aux composants parents {#exposing-dom-refs-to-parent-components}

Dans de rares cas, un composant parent pourrait vouloir accéder aux nœuds DOM d’un enfant. C’est généralement déconseillé car ça brise l'encapsulation, mais c’est parfois utile pour gérer le focus, mesurer les dimensions ou la position d'un nœud DOM enfant.

Même si vous pourriez [ajouter une ref à un composant enfant](#adding-a-ref-to-a-class-component), ce n'est pas une solution idéale car vous n'obtiendriez qu'une instance de composant plutôt qu'un nœud DOM. De plus, ça ne fonctionnerait pas avec les fonctions composants.

Si vous utilisez React 16.3 ou une version ultérieure, nous recommandons d'utiliser [le transfert de refs](/docs/forwarding-refs.html) pour ce genre de cas. **Le transfert de refs permet à un composant de choisir d'exposer une ref à un de ses enfants comme étant la sienne**. Vous trouverez un exemple détaillé de la façon d’exposer un nœud DOM enfant à un composant parent [dans la documentation du transfert de refs](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

Si vous utilisez React 16.2 ou une version antérieure, ou si vous avez besoin de plus de flexibilité que ce que permet le transfert de refs, vous pouvez utiliser [cette approche alternative](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509) et passer explicitement une ref via une autre prop.

Autant que possible, nous déconseillons d’exposer les nœuds DOM, mais ça peut être une échappatoire utile. Remarquez que cette approche exige la modification du code du composant enfant. Si vous n'avez pas cette possibilité, votre seule option consiste à utiliser [`findDOMNode()`](/docs/react-dom.html#finddomnode), mais c’est déconseillé et déprécié en [mode strict](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage).

### Refs avec fonctions de rappel {#callback-refs}

React propose une autre façon de définir des refs appelée « refs avec fonctions de rappel », qui permet un contrôle plus fin sur l’affectation et le nettoyage des refs.

Plutôt que de passer un attribut `ref` créé par `createRef()`, vous pouvez passer une fonction. La fonction récupère l'instance du composant React ou l'élément du DOM HTML comme argument, qui peut être stocké et accédé depuis ailleurs.

L'exemple ci-dessous implémente une approche fréquente : utiliser la fonction de rappel `ref` pour stocker une référence à un nœud DOM dans une propriété d'instance.

```javascript{5,7-9,11-14,19,29,34}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Donne le focus au champ texte en utilisant l’API DOM native.
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // Focus automatique sur le champ au montage
    this.focusTextInput();
  }

  render() {
    // Utilise la fonction de rappel `ref` pour stocker une référence à l’élément
    // DOM du champ texte dans une propriété d’instance (ex. this.textInput)
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Donner le focus au champ texte"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React appellera la fonction de rappel `ref` avec l'élément DOM quand le composant sera monté, puis avec `null` quand il sera démonté. Les refs sont toujours mises à jour avant l'exécution de `componentDidMount` et `componentDidUpdate`.

Vous pouvez passer une fonction de rappel de ref d’un composant à l’autre comme vous le feriez avec les objets refs créés par `React.createRef()`.

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

Dans l'exemple ci-dessus, `Parent` passe sa fonction de rappel de ref dans la propriété `inputRef` du `CustomTextInput`, et `CustomTextInput` passe la même fonction dans l’attribut spécial `ref` à l’`<input>`. Au final, `this.inputElement` dans `Parent` recevra le nœud DOM correspondant à l'élément `<input>` dans `CustomTextInput`.

### API historique : refs textuelles {#legacy-api-string-refs}

Si vous avez travaillé avec React par le passé, vous avez peut-être l’habitude d’une ancienne API où l'attribut `ref` était une chaîne de caractères du genre `"textInput"`, et le nœud DOM était accessible via `this.refs.textInput`. Nous recommandons de ne plus utiliser cette approche en raison de [plusieurs problèmes](https://github.com/facebook/react/pull/8333#issuecomment-271648615) ; elle est dépréciée et **sera probablement supprimée dans une version future**.

> Remarque
>
> Si vous utilisez actuellement la syntaxe `this.refs.textInput` pour accéder aux refs, nous vous conseillons d'utiliser soit [l’approche avec fonction de rappel](#callback-refs) soit [l'API `createRef`](#creating-refs).

### Limitations des refs avec fonctions de rappels {#caveats-with-callback-refs}

Si la fonction de rappel `ref` est définie à la volée, elle sera appelée deux fois à chaque mise à jour, d'abord avec `null` puis avec l'élément DOM. C’est parce qu'une nouvelle instance de la fonction est créée à chaque affichage, et React a besoin de nettoyer l'ancienne ref avant d'affecter la nouvelle. Vous pouvez éviter ça en définissant la fonction de rappel `ref` comme une méthode liée de la classe, même si ça ne devrait pas être gênant la plupart du temps.
