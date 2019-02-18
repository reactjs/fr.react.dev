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

- [La référence des éléments HTML sur MDN](https://developer.mozilla.org/fr/docs/Web/HTML/Element).

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

- [Le W3C nous montre comme étiqueter les éléments](https://www.w3.org/WAI/tutorials/forms/labels/).
- [Le WebAIM nous montre comme étiqueter les éléments](http://webaim.org/techniques/forms/controls).
- [Le groupe Paciello explique ce qu'est un nom accessible](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/).

Bien que ces pratiques HTML standard soient directement utilisables dans React, il faut noter que l'attribut `for` est écrit `htmlFor` en JSX :

```javascript{1}
<label htmlFor="namedInput">Nom :</label>
<input id="namedInput" type="text" name="name"/>
```

### Notifier des erreurs à l'utilisateur {#notifying-the-user-of-errors}

Les situations d'erreur doivent être comprises par tous les utilisateurs. Les liens ci-dessous montrent comme exposer les textes d'erreur aux lecteurs d'écran :

- [Le W3C présente les notifications utilisateurs](https://www.w3.org/WAI/tutorials/forms/notifications/).
- [Le WebAIM se penche sur les validations de formulaire](http://webaim.org/techniques/formvalidation/).

## Contrôle du focus {#focus-control}

Assurez-vous que votre application web peut être complètement utilisable avec la seule utilisation du clavier :

- [Le WebAIM parle de l'accessibilité depuis le clavier](http://webaim.org/techniques/keyboard/).

### Focus par le clavier et mise en contour de focus {#keyboard-focus-and-focus-outline}

Le focus par le clavier fait référence à l'élément courant dans le DOM qui est sélectionné pour accepter les saisies du clavier. Nous le voyons partout comme une mise en contour telle que cela est montré sur l'image ci-dessous :

<img src="../images/docs/keyboard-focus.png" alt="Le contour bleu du focus clavier autour d'un lien sélectionné" />

N'utilisez le CSS qui retire ce contour, par exemple en définissant `outline: 0`, uniquement si vous le remplacez par une autre implémentation de contour de focus.

### Mécanismes pour sauter au contenu désiré {#mechanisms-to-skip-to-desired-content}

Fournissez un mécanisme permettant aux utilisateurs de sauter les sections de navigation précédentes de votre application, car cela facilite et accélère la navigation au clavier.

Les liens de passage (*Skiplinks*) ou lien de navigation de passage sont des liens de navigation cachés qui ne sont visibles que lorsque l'utilisateur interagit au clavier avec la page. Ils sont très faciles à mettre en œuvre avec les ancres de pages internes et un peu de style :

- [WebAIM - Liens de navigation de passage](http://webaim.org/techniques/skipnav/).

Utilisez également les éléments et rôles de repérage, tels que `<main>` et `<aside>`, afin de délimiter les régions de la page, car les technologies d'assistance permettent à l'utilisateur de naviguer rapidement vers ces sections.

Pour en savoir plus sur l'utilisation de ces éléments améliorant l'accessibilité, rendez-vous sur :

- [Repères d'accessibilité](http://www.scottohara.me/blog/2018/03/03/landmarks.html).

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
   // Donner explicitement le focus au champ de saisie en utilisant l'API du DOM.
   // Remarque : nous utilisons "current" pour accéder au nœud du DOM.
   this.textInput.current.focus();
 }
 ```

Il arrive parfois qu'un composant parent ait besoin de définir le focus sur un composant enfant. Pour ce faire, nous [exposons les références DOM aux composants parents](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components) via une propriété spéciale sur le composant enfant qui transmet la référence du parent au nœud DOM de l'enfant.

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

// Maintenant, vous pouvez définir le focus lorsque cela est nécessaire.
this.inputElement.current.focus();
```

Lors de l'utilisation d'un *HOC* pour étendre des composants, il est recommandé de [transmettre la référence](/docs/forwarding-refs.html) to l'élément d'encapsulation en utilisant la fonction `forwardRef` de React. Si un *HOC* tiers n'implémente par le transfert de référence, le modèle ci-dessus peut être utilisé comme solution de secours.

Un excellent exemple de la gestion du focus est le [react-aria-modal](https://github.com/davidtheclark/react-aria-modal). Il s'agit de l'un des rares exemples d'une fenêtre modale complètement accessible. Non seulement il définit le focus initial sur le bouton d'annulation (empêchant l'utilisateur du clavier d'activer accidentellement l'action de succès), restreint le focus clavier à l'intérieur de la fenêtre modale, mais réinitialise le focus sur l'élément qui a originellement déclenché la fenêtre modale.

> Remarque :
>
> Bien qu'il s'agisse d'une caractéristique d'accessibilité très importante, c'est également une technique qui doit être utilisée à bon escient. Utilisez-la pour réparer le comportement du focus clavier lorsqu'il est perturbé, et non pour essayer d'anticiper la manière dont les utilisateurs souhaitent utiliser les applications.

## Événements de souris et de pointeur {#mouse-and-pointer-events}

Assurez-vous que toutes les fonctionnalités exposées via un événement de souris ou de pointeur sont également accessibles avec le clavier seul. Ne dépendre que du pointeur peut aboutir à de nombreuses situations où les utilisateurs de clavier ne pourront pas utiliser votre application.

Pour illustrer cela, examinons un exemple prolifique où l'accessibilité est cassée par les événements de clics. Il s'agit du modèle de clic extérieur dans lequel un utilisateur peut désactiver un *popover* en cliquant à l'extérieur de l'élément.

<img src="../images/docs/outerclick-with-mouse.gif" alt="Un bouton à bascule ouvrant une liste déroulante implémenté par le modèle du clic externe et déclenché par la souris montrant que l'action de fermeture fonctionne." />

Cela est généralement implémenté en attachant l'événement `click` à l'objet `window` qui ferme le *popover* :

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
        <button onClick={this.onClickHandler}>Choisissez une option</button>
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

Cela peut fonctionner pour les utilisateurs disposant de dispositifs de pointage, tels qu'une souris, mais le fait de n'utiliser que le clavier seul entraîne des dysfonctionnements lors de la tabulation sur l'élément suivant, car l'objet `window` ne reçoit jamais d'événement `click`. Cela peut entraîner une fonctionnalité masquée qui empêche les utilisateurs d'utiliser votre application.

<img src="../images/docs/outerclick-with-keyboard.gif" alt="Un bouton à bascule ouvrant une liste déroulante implémenté par le modèle du clic externe et déclenché par le clavier montrant que le popover ne se ferme pas au blur et qu'il masque d'autre éléments de l'écran." />

La même fonctionnalité peut être obtenue en utilisant les gestionnaires d'événements appropriés, tels que `onBlur` et `onFocus` :

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

  // Nous fermons le popover au prochain tick en utilisant setTimeout.
  // Cela est nécessaire car nous devons d'abord vérifier si un
  // autre enfant de l'élément a reçu le focus lorsque l'élément
  // `blur` se déclenche avant le nouvel événement de focus.
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // Si un enfant reçoit le focus, alors on ne ferme pas le popover.
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // React nous aide en diffusant les événements `blur` et
    // `focus` au parent.
    return (
      <div onBlur={this.onBlurHandler}
           onFocus={this.onFocusHandler}>
        <button onClick={this.onClickHandler}
                aria-haspopup="true"
                aria-expanded={this.state.isOpen}>
          Choisissez une option
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

Ce code expose la fonctionnalité aussi bien aux utilisateurs de dispositifs de pointage qu'aux utilisateurs de clavier. Remarquez également les propriétés ajoutées `aria-*` afin de supporter les lecteurs d'écran. Par souci de simplicité, les événements clavier permettant l'interaction avec les options du popover via les touches de direction n'ont pas été implémentés.

<img src="../images/docs/blur-popover-close.gif" alt="Une liste déroulante se fermant correctement pour les utilisateurs de souris et de clavier." />

C'est un exemple des nombreux cas où, le fait de ne dépendre que des événements de souris et de pointeur casse les fonctionnalités pour les utilisateurs de clavier. Toujours tester avec le clavier mettra immédiatement en évidence les problèmes qui peuvent ensuite être résolus grâce à l'aide des gestionnaires d'événement clavier.

## Widgets plus complexes {#more-complex-widgets}

Une expérience utilisateur plus complexe ne doit pas signifier une expérience moins accessible. Alors que l'accessibilité est plus facile à réaliser en codant le plus près possible du HTML, même les widgets les plus complexes peuvent être codés de manière accessible.

Nous avons besoin ici de connaître les [rôles ARIA](https://www.w3.org/TR/wai-aria/#roles), ainsi que les [états et propriétés ARIA](https://www.w3.org/TR/wai-aria/#states_and_properties).
Ce sont des boîtes à outils pleines d'attributs HTML pris en charge dans le JSX et qui nous permettent de construire des composants React entièrement accessibles et hautement fonctionnels.

Chaque type de widget à son modèle de design spécifique et devrait fonctionner de la même manière avec les utilisateurs et avec les agents :

- [Pratique de création WAI-ARIA - Modèles de design et widgets](https://www.w3.org/TR/wai-aria-practices/#aria_ex) (*WIA* signifie *Web Accessibility Initiative* - NdT).
- [Heydon Pickering - Exemples ARIA](http://heydonworks.com/practical_aria_examples/).
- [Composants inclusifs](https://inclusive-components.design/).

## Autres points de considération {#other-points-for-consideration}

### Définir la langue {#setting-the-language}

Indiquez la langue des pages de texte de façon à ce que les logiciels de lecture d'écran puissent sélectionner les paramètres de voix appropriés :

- [WebAIM - Document sur les langues](http://webaim.org/techniques/screenreader/#language).

### Définir le titre du document {#setting-the-document-title}

Définissez la balise `<title>` du document pour décrire correctement le contenu de la page courante, afin de garantir que l'utilisateur soit au courant du contexte de la page en cours :

- [WCAG - Comprendre l'exigence du titre du document](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html).

Nous pouvons le définir dans React en utilisant le [composant React Document Title](https://github.com/gaearon/react-document-title).

### Contraste de couleur {#color-contrast}

Assurez-vous que tous les textes lisibles sur votre site web ont un contraste de couleur suffisant pour rester lisibles de manière optimale par les utilisateurs malvoyants :

- [WCAG - Comprendre l'exigence du contraste de couleur](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html).
- [Tout sur le contraste de couleur et pourquoi vous devez le repenser](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/).
- [A11yProject - Qu'est-ce qu'un contraste de couleur ?](http://a11yproject.com/posts/what-is-color-contrast/).

Il peut être fastidieux de calculer manuellement les combinaisons de couleurs appropriées pour toutes les situations de votre site web, aussi vous est-il possible de [calculer toute une palette de couleurs accessible avec Colorable](http://jxnblk.com/colorable/).

Les outils aXe et WAVE mentionnés ci-dessous incluent également des tests de contraste de couleur et signlent les erreurs de contraste.

Si vous souhaitez étendre vos capacités de test de contraste, vous pouvez utiliser ces outils :

- [WebAIM - Vérification de contraste de couleur](http://webaim.org/resources/contrastchecker/)
- [The Paciello Group - Analyseur de contraste de couleur](https://www.paciellogroup.com/resources/contrastanalyser/)

## Développement et outils de test {#development-and-testing-tools}

Il existe de nombreux outils pour nous pouvons utiliser pour nous assister durant la création d'applications web accessibles.

### Le clavier {#the-keyboard}

De loin la plus simple mais aussi l'une des plus importante vérification à faire est de tester si l'ensemble de votre site web peut être accessible et utilisables avec le clavier seul. Procédez ainsi :

1. Débranchez votre souris.
1. Utilisez `Tab` et `Shift+Tab` pour naviguer.
1. Utilisez `Enter` pour activer des éléments.
1. Le cas échéant, utilisez les touches de direction du clavier pour interagir avec certains éléments, tels que les menus et les menus déroulants.

### Assistance au développement {#development-assistance}

Nous pouvons tester certaines fonctionnalités d'accessibilités directement dans notre code JSX. Souvent des contrôles intellisense sont déjà présents dans les IDE pour prenant en charge les rôles, états et propriétés ARIA. Nous avons également accès à l'outil suivant :

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

L'extension [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) pour ESLint fournit des informations sur l'AST concernant les problèmes d'accessibilité dans votre JSX. De nombreux IDE vous permettent d'intégrer ces résultats directement dans des fenêtres d'analyse de code ou de code source.

[Create React App](https://github.com/facebookincubator/create-react-app) dispose de cette extension avec un sous-ensemble de règles activées. Si vous souhaitez activer encore plus de règles d'accessibilité, vous pouvez créer un fichier `.eslintrc` à la racine de votre projet avec ce contenu :

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### Tester l'accessibilité dans le navigateur {#testing-accessibility-in-the-browser}

Il existe un certain nombres d'outils pouvant exécuter des audits d'accessibilité sur des pages web dans votre navigateur. Veuillez les utiliser conjointement avec d'autres contrôles d'accessibilité mentionnés ici car ils ne peuvent que tester l'accessibilité technique de votre HTML.

#### aXe, aXe-core et react-axe {#axe-axe-core-and-react-axe}

Deque Systems offre [aXe-core](https://github.com/dequelabs/axe-core) pour automatiser les tests d'accessibilité de bout en bout de vos applications. Ce module comprend des intégrations pour Selenium.

[Le moteur d'accessibilité](https://www.deque.com/products/axe/) ou aXe, est une extension du navigateur d'inspection de l'accessibilité construite sur `aXe-core`.

Vous pouvez aussi utiliser le module [react-axe](https://github.com/dylanb/react-axe) pour signaler directement ces résultats d'accessibilité dans la console during le développement et le déboguage.

#### WebAIM WAVE {#webaim-wave}

L'[outil Web Accessibility Evaluation](http://wave.webaim.org/extension/) est une autre extension du navigateur pour l'accessibilité.

#### Inspecteurs d'accessibilité et arbre d'accessibilité {#accessibility-inspectors-and-the-accessibility-tree}

[L'arbre d'accessibilité](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) est un sous-ensemble de l'arbre DOM qui contient des objects accessibles pour chaque élément du DOM devant être exposé aux technologies d'assistance, telles que les lecteurs d'écrans.

Sur certains navigateurs, nous pouvons facilement consulter les informations d'accessibilité pour chaque élément de l'arbre d'accessibilité :

- [En utilisant l'inspecteur d'accessibilité de Firefox](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector).
- [En activant l'inspecteur d'accessibilité de Chrome](https://gist.github.com/marcysutton/0a42f815878c159517a55e6652e3b23a).
- [En utilisant l'inspecteur d'accessibilité d'OS X Safari](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html).

### Lecteurs d'écran {#screen-readers}

Tester avec un lecteur d'écran devrait faire partie de vos tests d'accessibilité.

Veuillez noter que les combinaisons navigateur / lecteur d'écran ont leur importance. Il est recommandé de tester votre application dans le navigateur le plus adapté au lecteur d'écran de votre choix.

### Lecteurs d'écran utilisés fréquemment {#commonly-used-screen-readers}

#### NVDA dans Firefox {#nvda-in-firefox}

[*NonVisual Desktop Access*](https://www.nvaccess.org/) ou NVDA est un lecteur d'écran open source qui est largement utilisé.

Reportez-vous aux guides suivants pour savoir comment utiliser au mieux NVDA :

- [WebAIM - Utiliser NVDA pour évaluer l'accessibilité web](http://webaim.org/articles/nvda/).
- [Deque - Raccourcis clavier NVDA](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts).

#### VoiceOver dans Safari {#voiceover-in-safari}

VoiceOver est un lecteur d'écrans intégrer dans les dispositifs d'Apple.

Reportez-vous aux guides suivants pour savoir comment activer et utiliser VoiceOver :

- [WebAIM - Utiliser VoiceOver pour évaluer l'accessibilité web](http://webaim.org/articles/voiceover/).
- [Deque - Raccourcis clavier pour VoiceOver sur OS X](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts).
- [Deque - Raccourcis pour VoiceOver sur iOS](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts).

#### JAWS dans Internet Explorer {#jaws-in-internet-explorer}

[*Job Access With Speech*](http://www.freedomscientific.com/Products/Blindness/JAWS) ou JAWS, est un lecteur d'écran utilisé de manière prolifique sur Windows.

Reportez-vous aux guides suivants pour utiliser au mieux JAWS :

- [WebAIM - Utiliser JAWS pour évaluer l'accessibilité web](http://webaim.org/articles/jaws/).
- [Deque - Raccourcis clavier pour JAWS](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### Autres lecteurs d'écran {#other-screen-readers}

#### ChromeVox dans Google Chrome {#chromevox-in-google-chrome}

[ChromeVox](http://www.chromevox.com/) est un lecteur d'écran intégré aux Chromebooks et est disponible [en tant qu'extension](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=fr) à Google Chrome.

Reportez-vous aux guides suivants pour utiliser au mieux ChromeVox :

- [Aide de Google Chromebook - Utiliser le lecteur d'écran intégré](https://support.google.com/chromebook/answer/7031755?hl=en)
- [Références des raccourcis clavier pour ChromeVox Classic](http://www.chromevox.com/keyboard_shortcuts.html)
