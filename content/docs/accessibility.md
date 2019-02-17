---
id: accessibility
title: Accessibilité
permalink: docs/accessibility.html
---

## Pourquoi l'accessibilité ? {#why-accessibility}

L'accessibilité du web (aussi référencée sous la contraction [**a11y**](https://fr.wiktionary.org/wiki/a11y)) concerne le design et la création de sites web qui peuvent être utilisés par tout le monde. Le support de l'accessibilité est nécessaire pour permettre aux technologies d'assistance d'interpréter les pages web. 

React prend totalement en charge la création de sites web accessibles, en s'appuyant souvent sur des techniques HTML standard.

## Standards et lignes directrices {#standards-and-guidelines}

### WCAG {#wcag}

Les [instructions du *Web Content Accessibility*](https://www.w3.org/WAI/intro/wcag) proposent les lignes directrices pour créer des sites web accessibles.

La liste du WCAG ci-dessous fournissent un aperçu :

- [La liste de contrôle WCAG de Wuhcag](https://www.wuhcag.com/wcag-checklist/).
- [La liste de contrôle WCAG de WebAIM](http://webaim.org/standards/wcag/checklist).
- [La liste de contrôle de *The A11Y Project*](http://a11yproject.com/checklist.html).

### WAI-ARIA {#wai-aria}

Le document sur [l'initiative d'accessibilité du Web - *Accessible Rich Internet Applications*](https://www.w3.org/WAI/intro/aria) contient les techniques nécessaires à la création de *widgets* JavaScript complètement accessibles.

Remarquez que tous les attributs HTML `aria-*` sont entièrement supportés dans le JSX. Là où la plupart des propriétés DOM en React utilisent le format « camelCase », ces attributs doivent utiliser la casse par tirets (« *hyphen-case* », aussi appelée « *kebab-case* », « *lisp-case* », etc.), comme ils le sont en HTML simple :

```javascript{3,4}
<input
  type="text"
  aria-label={labelText}
  aria-required="true"
  onChange={onchangeHandler}
  value={inputValue}
  name="name"
/>
```

## HTML sémantique {#semantic-html}

Le HTML sémantique est la base de l'accessibilité dans une application web. L'utilisation des différents éléments HTML pour renforcer la signification de l'information de nos sites web offre généralement de l'accessibilité à peu de frais.
in our websites will often give us accessibility for free.

- [La référence des éléments HTML sur MDN](https://developer.mozilla.org/fr/docs/Web/HTML/Element)

Il nous arrive de casser la sémantique HTML en ajoutant des balises `<div>` dans notre JSX afin de faire fonctionner notre code React, en particulier lorsque l'on travaille avec des listes (`<ol>`, `<ul>` et `<dl>`) ou la table HTML `<table>`.
Dans ces cas-là, nous devrions plutôt utiliser les [fragments React](/docs/fragments.html) pour regrouper de multiples éléments.

Par exemple,

```javascript{1,5,8}
import React, { Fragment } from 'react';

function ListItem({ item }) {
  return (
    <Fragment>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </Fragment>
  );
}

function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        <ListItem item={item} key={item.id} />
      ))}
    </dl>
  );
}
```

Vous pouvez représenter une liste d'éléments en un tableau de fragments, comme vous pourriez également le faire pour tout autre type d'élément :

```javascript{6,9}
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Les fragments doivent aussi disposer de la propriété `key` lors de l'itération sur les listes
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

Lorsque vous n'avez besoin d'aucune propriété sur les balises fragments, vous pouvez utiliser la [syntaxe courte](/docs/fragments.html#short-syntax), lorsque votre outillage le supporte :

```javascript{3,6}
function ListItem({ item }) {
  return (
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>
  );
}
```

Pour plus d'information, consultez [la documentation sur les fragments](/docs/fragments.html).

## Formulaires accessibles {#accessible-forms}

### L'étiquetage {#labeling}

Tous les contrôles de formulaire HTML, tels que `<input>` et `<textarea>`, doivent être étiquetés de manière accessible. Nous devons fournir des étiquettes descriptives, qui sont également exposées aux lecteurs d'écran.

Les ressources ci-dessous nous montrent comme procéder :

- [Le W3C nous montre comme étiqueter les éléments](https://www.w3.org/WAI/tutorials/forms/labels/)
- [Le WebAIM nous montre comme étiqueter les éléments](http://webaim.org/techniques/forms/controls)
- [Le groupe Paciello explique ce qu'est un nom accessible](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)

Bien que ces pratiques HTML standard soient directement utilisables dans React, il faut noter que l'attribut `for` est écrit `htmlFor` en JSX :

```javascript{1}
<label htmlFor="namedInput">Nom :</label>
<input id="namedInput" type="text" name="name"/>
```

### Notifier des erreurs à l'utilisateur {#notifying-the-user-of-errors}

Les situations d'erreur doivent être comprises par tous les utilisateurs. Les liens ci-dessous montrent comme exposer les textes d'erreur aux lecteurs d'écran :

- [Le W3C présente les notifications utilisateurs](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [Le WebAIM se penche sur les validations de formulaire](http://webaim.org/techniques/formvalidation/)

## Contrôle du focus {#focus-control}

Assurez-vous que votre application web peut être complètement utilisable avec la seule utilisation du clavier :

- [Le WebAIM parle de l'accessibilité depuis le clavier](http://webaim.org/techniques/keyboard/)

### Focus par le clavier et mise en contour de focus {#keyboard-focus-and-focus-outline}

Le focus par le clavier fait référence à l'élément courant dans le DOM qui est sélectionné pour accepter les saisies du clavier. Nous le voyons partout comme une mise en contour telle que cela est montré sur l'image ci-dessous :

<img src="../images/docs/keyboard-focus.png" alt="Le contour bleu du focus clavier autour d'un lien sélectionné" />

N'utilisez le CSS qui retire ce contour, par exemple en définissant `outline: 0`, uniquement si vous le remplacez par une autre implémentation de contour de focus.

### Mécanismes pour sauter au contenu désiré {#mechanisms-to-skip-to-desired-content}

Fournissez un mécanisme permettant aux utilisateurs de sauter les sections de navigation précédentes de votre application, car cela facilite et accélère la navigation au clavier.

Les liens de passage (*Skiplinks*) ou lien de navigation de passage sont des liens de navigation cachés qui ne sont visibles que lorsque l'utilisateur interagit au clavier avec la page. Ils sont très faciles à mettre en œuvre avec les ancres de pages internes et un peu de style :

- [WebAIM - Liens de navigation de passage](http://webaim.org/techniques/skipnav/)


Utilisez également les éléments et rôles de repérage, tels que `<main>` et `<aside>`, afin de délimiter les régions de la page, car les technologies d'assistance permettent à l'utilisateur de naviguer rapidement vers ces sections.

Pour en savoir plus sur l'utilisation de ces éléments améliorant l'accessibilité, rendez-vous sur :

- [Repères d'accessibilité](http://www.scottohara.me/blog/2018/03/03/landmarks.html)

### Gérer le focus programmatiquement {#programmatically-managing-focus}

Nos applications React modifient en continu le DOM HTML au cours de l'exécution, ce qui entraîne parfois la perte du focus du clavier ou le positionne surun élément inattendu. Afin de réparer cela, nous devons déplacer le focus claiver programmatiquement dans la bonne direction. Par exemple, en redonnant le focus clavier à un bouton ouvrant une fenêtre modale, lorsque cette dernière se ferme.

La documentation web de MDN donne un aperçu à cela, et décrit comment nous pouvons construire [des widgets JavaScript permettant la navigation au clavier](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets).

Afin de définir le focus en React, nous pouvons utiliser les [références (*Ref*) aux éléments du DOM](/docs/refs-and-the-dom.html).

En utilisant cela, nous créons d'abord une référence à un élément du JSX de la classe composant :

```javascript{4-5,8-9,13}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // Création d'une référence pour conserver l'élément textInput du DOM
    this.textInput = React.createRef();
  }
  render() {
    // Utilisez la fonction de rappel `ref` pour stocker la référence de l'élément DOM
    // du champ texte dans une variable d'instance (par exemple, this.textInput).
    return (
      <input
        type="text"
        ref={this.textInput}
      />
    );
  }
}
```

Nous pouvons dès lors lui donner le focus depuis n'importe où dans notre composant en cas de besoin :

 ```javascript
 focus() {
   // Donner explicitement le focus au champ de saisie en
   // utilisant l'API du DOM.
   // Remarque : nous utilisons "current" pour accéder au nœud du DOM.
   this.textInput.current.focus();
 }
 ```

Sometimes a parent component needs to set focus to an element in a child component. We can do this by [exposing DOM refs to parent components](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components)
through a special prop on the child component that forwards the parent's ref to the child's DOM node.

```javascript{4,12,16}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render() {
    return (
      <CustomTextInput inputRef={this.inputElement} />
    );
  }
}

// Now you can set focus when required.
this.inputElement.current.focus();
```

When using a HOC to extend components, it is recommended to [forward the ref](/docs/forwarding-refs.html) to the wrapped component using the `forwardRef` function of React. If a third party HOC
does not implement ref forwarding, the above pattern can still be used as a fallback.

A great focus management example is the [react-aria-modal](https://github.com/davidtheclark/react-aria-modal). This is a relatively rare example of a fully accessible modal window. Not only does it set initial focus on
the cancel button (preventing the keyboard user from accidentally activating the success action) and trap keyboard focus inside the modal, it also resets focus back to the element that
initially triggered the modal.

>Note:
>
>While this is a very important accessibility feature, it is also a technique that should be used judiciously. Use it to repair the keyboard focus flow when it is disturbed, not to try and anticipate how
>users want to use applications.

## Mouse and pointer events {#mouse-and-pointer-events}

Ensure that all functionality exposed through a mouse or pointer event can also be accessed using the keyboard alone. Depending only on the pointer device will lead to many cases where
keyboard users cannot use your application.

To illustrate this, let's look at a prolific example of broken accessibility caused by click events. This is the outside click pattern, where a user can disable an opened popover by clicking outside the element.

<img src="../images/docs/outerclick-with-mouse.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with a mouse showing that the close action works." />

This is typically implemented by attaching a `click` event to the `window` object that closes the popover:

```javascript{12-14,26-30}
class OuterClickExample extends React.Component {
constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.toggleContainer = React.createRef();

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.onClickOutsideHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  onClickOutsideHandler(event) {
    if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    return (
      <div ref={this.toggleContainer}>
        <button onClick={this.onClickHandler}>Select an option</button>
        {this.state.isOpen ? (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        ) : null}
      </div>
    );
  }
}
```

This may work fine for users with pointer devices, such as a mouse, but operating this with the keyboard alone leads to broken functionality when tabbing to the next element
as the `window` object never receives a `click` event. This can lead to obscured functionality which blocks users from using your application.

<img src="../images/docs/outerclick-with-keyboard.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with the keyboard showing the popover not being closed on blur and it obscuring other screen elements." />

The same functionality can be achieved by using an appropriate event handlers instead, such as `onBlur` and `onFocus`:

```javascript{19-29,31-34,37-38,40-41}
class BlurExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.timeOutId = null;

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onBlurHandler = this.onBlurHandler.bind(this);
    this.onFocusHandler = this.onFocusHandler.bind(this);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  // We close the popover on the next tick by using setTimeout.
  // This is necessary because we need to first check if
  // another child of the element has received focus as
  // the blur event fires prior to the new focus event.
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // If a child receives focus, do not close the popover.
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // React assists us by bubbling the blur and
    // focus events to the parent.
    return (
      <div onBlur={this.onBlurHandler}
           onFocus={this.onFocusHandler}>
        <button onClick={this.onClickHandler}
                aria-haspopup="true"
                aria-expanded={this.state.isOpen}>
          Select an option
        </button>
        {this.state.isOpen ? (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        ) : null}
      </div>
    );
  }
}
```

This code exposes the functionality to both pointer device and keyboard users. Also note the added `aria-*` props to support screen-reader users. For simplicity's sake
the keyboard events to enable `arrow key` interaction of the popover options have not been implemented.

<img src="../images/docs/blur-popover-close.gif" alt="A popover list correctly closing for both mouse and keyboard users." />

This is one example of many cases where depending on only pointer and mouse events will break functionality for keyboard users. Always testing with the keyboard will immediately
highlight the problem areas which can then be fixed by using keyboard aware event handlers.

## More Complex Widgets {#more-complex-widgets}

A more complex user experience should not mean a less accessible one. Whereas accessibility is most easily achieved by coding as close to HTML as possible,
even the most complex widget can be coded accessibly.

Here we require knowledge of [ARIA Roles](https://www.w3.org/TR/wai-aria/#roles) as well as [ARIA States and Properties](https://www.w3.org/TR/wai-aria/#states_and_properties).
These are toolboxes filled with HTML attributes that are fully supported in JSX and enable us to construct fully accessible, highly functional React components.

Each type of widget has a specific design pattern and is expected to function in a certain way by users and user agents alike:

- [WAI-ARIA Authoring Practices - Design Patterns and Widgets](https://www.w3.org/TR/wai-aria-practices/#aria_ex)
- [Heydon Pickering - ARIA Examples](http://heydonworks.com/practical_aria_examples/)
- [Inclusive Components](https://inclusive-components.design/)

## Other Points for Consideration {#other-points-for-consideration}

### Setting the language {#setting-the-language}

Indicate the human language of page texts as screen reader software uses this to select the correct voice settings:

- [WebAIM - Document Language](http://webaim.org/techniques/screenreader/#language)

### Setting the document title {#setting-the-document-title}

Set the document `<title>` to correctly describe the current page content as this ensures that the user remains aware of the current page context:

- [WCAG - Understanding the Document Title Requirement](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

We can set this in React using the [React Document Title Component](https://github.com/gaearon/react-document-title).

### Color contrast {#color-contrast}

Ensure that all readable text on your website has sufficient color contrast to remain maximally readable by users with low vision:

- [WCAG - Understanding the Color Contrast Requirement](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [Everything About Color Contrast And Why You Should Rethink It](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [A11yProject - What is Color Contrast](http://a11yproject.com/posts/what-is-color-contrast/)

It can be tedious to manually calculate the proper color combinations for all cases in your website so instead, you can [calculate an entire accessible color palette with Colorable](http://jxnblk.com/colorable/).

Both the aXe and WAVE tools mentioned below also include color contrast tests and will report on contrast errors.

If you want to extend your contrast testing abilities you can use these tools:

- [WebAIM - Color Contrast Checker](http://webaim.org/resources/contrastchecker/)
- [The Paciello Group - Color Contrast Analyzer](https://www.paciellogroup.com/resources/contrastanalyser/)

## Development and Testing Tools {#development-and-testing-tools}

There are a number of tools we can use to assist in the creation of accessible web applications.

### The keyboard {#the-keyboard}

By far the easiest and also one of the most important checks is to test if your entire website can be reached and used with the keyboard alone. Do this by:

1. Plugging out your mouse.
1. Using `Tab` and `Shift+Tab` to browse.
1. Using `Enter` to activate elements.
1. Where required, using your keyboard arrow keys to interact with some elements, such as menus and dropdowns.

### Development assistance {#development-assistance}

We can check some accessibility features directly in our JSX code. Often intellisense checks are already provided in JSX aware IDE's for the ARIA roles, states and properties. We also
have access to the following tool:

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

The [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) plugin for ESLint provides AST linting feedback regarding accessibility issues in your JSX. Many
IDE's allow you to integrate these findings directly into code analysis and source code windows.

[Create React App](https://github.com/facebookincubator/create-react-app) has this plugin with a subset of rules activated. If you want to enable even more accessibility rules,
you can create an `.eslintrc` file in the root of your project with this content:

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### Testing accessibility in the browser {#testing-accessibility-in-the-browser}

A number of tools exist that can run accessibility audits on web pages in your browser. Please use them in combination with other accessibility checks mentioned here as they can only
test the technical accessibility of your HTML.

#### aXe, aXe-core and react-axe {#axe-axe-core-and-react-axe}

Deque Systems offers [aXe-core](https://github.com/dequelabs/axe-core) for automated and end-to-end accessibility tests of your applications. This module includes integrations for Selenium.

[The Accessibility Engine](https://www.deque.com/products/axe/) or aXe, is an accessibility inspector browser extension built on `aXe-core`.

You can also use the [react-axe](https://github.com/dylanb/react-axe) module to report these accessibility findings directly to the console while developing and debugging.

#### WebAIM WAVE {#webaim-wave}

The [Web Accessibility Evaluation Tool](http://wave.webaim.org/extension/) is another accessibility browser extension.

#### Accessibility inspectors and the Accessibility Tree {#accessibility-inspectors-and-the-accessibility-tree}

[The Accessibility Tree](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) is a subset of the DOM tree that contains accessible objects for every DOM element that should be exposed
to assistive technology, such as screen readers.

In some browsers we can easily view the accessibility information for each element in the accessibility tree:

- [Using the Accessibility Inspector in Firefox](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)
- [Activate the Accessibility Inspector in Chrome](https://gist.github.com/marcysutton/0a42f815878c159517a55e6652e3b23a)
- [Using the Accessibility Inspector in OS X Safari](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### Screen readers {#screen-readers}

Testing with a screen reader should form part of your accessibility tests.

Please note that browser / screen reader combinations matter. It is recommended that you test your application in the browser best suited to your screen reader of choice.

### Commonly Used Screen Readers {#commonly-used-screen-readers}

#### NVDA in Firefox {#nvda-in-firefox}

[NonVisual Desktop Access](https://www.nvaccess.org/) or NVDA is an open source Windows screen reader that is widely used.

Refer to the following guides on how to best use NVDA:

- [WebAIM - Using NVDA to Evaluate Web Accessibility](http://webaim.org/articles/nvda/)
- [Deque - NVDA Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### VoiceOver in Safari {#voiceover-in-safari}

VoiceOver is an integrated screen reader on Apple devices.

Refer to the following guides on how activate and use VoiceOver:

- [WebAIM - Using VoiceOver to Evaluate Web Accessibility](http://webaim.org/articles/voiceover/)
- [Deque - VoiceOver for OS X Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [Deque - VoiceOver for iOS Shortcuts](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### JAWS in Internet Explorer {#jaws-in-internet-explorer}

[Job Access With Speech](http://www.freedomscientific.com/Products/Blindness/JAWS) or JAWS, is a prolifically used screen reader on Windows.

Refer to the following guides on how to best use JAWS:

- [WebAIM - Using JAWS to Evaluate Web Accessibility](http://webaim.org/articles/jaws/)
- [Deque - JAWS Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### Other Screen Readers {#other-screen-readers}

#### ChromeVox in Google Chrome {#chromevox-in-google-chrome}

[ChromeVox](http://www.chromevox.com/) is an integrated screen reader on Chromebooks and is available [as an extension](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) for Google Chrome.

Refer to the following guides on how best to use ChromeVox:

- [Google Chromebook Help - Use the Built-in Screen Reader](https://support.google.com/chromebook/answer/7031755?hl=en)
- [ChromeVox Classic Keyboard Shortcuts Reference](http://www.chromevox.com/keyboard_shortcuts.html)
