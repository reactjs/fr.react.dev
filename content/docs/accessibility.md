---
id: accessibility
title: Accessibilité
permalink: docs/accessibility.html
---

## Pourquoi l'accessibilité ? {#why-accessibility}

L'accessibilité du web (aussi désignée par la contraction [**a11y**](https://fr.wiktionary.org/wiki/a11y)) concerne le design et la création de sites web qui peuvent être utilisés par tout le monde. La prise en charge de l'accessibilité est nécessaire pour permettre aux technologies d'assistance d'interpréter les pages web.

React prend totalement en charge la création de sites web accessibles, en s'appuyant souvent sur des techniques HTML standard.

## Standards et lignes directrices {#standards-and-guidelines}

### WCAG {#wcag}

Les [directives pour l'accessibilité au contenu web](https://www.w3.org/WAI/intro/wcag) *(Web Content Accessibility Guidelines, ou WCAG, NdT)* proposent des lignes directrices pour créer des sites web accessibles.

Les listes de contrôle du WCAG ci-dessous en fournissent un aperçu :

- [La liste de contrôle WCAG de Wuhcag](https://www.wuhcag.com/wcag-checklist/) (en anglais).
- [La liste de contrôle WCAG de WebAIM](http://webaim.org/standards/wcag/checklist) (en anglais, une traduction est disponible [ici](https://anysurfer.be/fr/en-pratique/sites-web/checklist-wcag-2-1-de-webaim)).
- [La liste de contrôle de *The A11Y Project*](http://a11yproject.com/checklist.html) (en anglais).

### WAI-ARIA {#wai-aria}

Le document de [l'Initiative d'Accessibilité du Web - Applications Internet Riches Accessibles](https://www.w3.org/WAI/intro/aria) *(Web Accessibility Initiative - Accessible Rich Internet Applications, ou WAI-ARIA, NdT)* contient les techniques nécessaires à la création d’éléments d’interface JavaScript complètement accessibles.

Remarquez que tous les attributs HTML `aria-*` sont autorisés dans JSX. Là où la plupart des propriétés DOM en React utilisent la casse *camelCase*, ces attributs doivent être en minuscules avec des tirets (casse connue sous les noms *hyphen-case*, *kebab-case*, *lisp-case*, etc.), comme ils le sont en HTML brut :

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

Le HTML sémantique est la base de l'accessibilité dans une application web. L'utilisation des différents éléments HTML pour renforcer la signification de l'information de nos sites web améliore généralement l'accessibilité à peu de frais.

- [La référence des éléments HTML sur MDN](https://developer.mozilla.org/fr/docs/Web/HTML/Element).

Il nous arrive de casser la sémantique HTML en ajoutant des balises `<div>` dans notre JSX afin de faire fonctionner notre code React, en particulier lorsqu'on travaille avec des listes (`<ol>`, `<ul>` et `<dl>`) ou des tableaux HTML `<table>`.
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

Vous pouvez représenter une liste d'éléments comme un tableau de fragments, comme vous le feriez avec tout autre type d'élément :

```javascript{7,10}
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Les fragments doivent aussi disposer de la propriété `key`
        // lors de l'itération sur les listes.
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

Lorsque vous n'avez pas besoin de définir de propriété sur la balise fragment, vous pouvez utiliser la [syntaxe courte](/docs/fragments.html#short-syntax), si votre outillage la prend en charge :

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

Pour plus d'informations, consultez [la documentation sur les fragments](/docs/fragments.html).

## Formulaires accessibles {#accessible-forms}

### L'étiquetage {#labeling}

Tous les champs de formulaire HTML, tels que `<input>` et `<textarea>`, doivent être étiquetés de manière accessible. Nous devons fournir des étiquettes descriptives, qui sont également exposées aux lecteurs d'écran.

Les ressources ci-dessous nous montrent comment procéder :

- [Le W3C nous montre comment étiqueter les éléments](https://www.w3.org/WAI/tutorials/forms/labels/) (en anglais).
- [Le WebAIM nous montre comment étiqueter les éléments](http://webaim.org/techniques/forms/controls) (en anglais).
- [Le groupe Paciello explique ce qu'est un nom accessible](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/) (en anglais).

Bien que ces pratiques HTML standard soient directement utilisables dans React, il faut noter que l'attribut `for` est écrit `htmlFor` en JSX :

```javascript{1}
<label htmlFor="namedInput">Nom :</label>
<input id="namedInput" type="text" name="name"/>
```

### Notifier des erreurs à l'utilisateur {#notifying-the-user-of-errors}

Les situations d'erreur doivent être comprises par tous les utilisateurs. Les liens ci-dessous montrent comment exposer les textes d'erreur aux lecteurs d'écran :

- [Le W3C présente les notifications utilisateur](https://www.w3.org/WAI/tutorials/forms/notifications/) (en anglais).
- [Le WebAIM se penche sur la validation de formulaire](http://webaim.org/techniques/formvalidation/) (en anglais).

## Contrôle du focus {#focus-control}

Assurez-vous que votre application web peut être complètement utilisable avec le clavier seul :

- [Le WebAIM parle de l'accessibilité depuis le clavier](http://webaim.org/techniques/keyboard/) (en anglais).

### Focus clavier et contour de focus {#keyboard-focus-and-focus-outline}

Le focus clavier fait référence à l'élément courant dans le DOM qui est sélectionné pour accepter les saisies au clavier. Nous le voyons partout comme un contour similaire à ce qu’on voit sur l'image ci-dessous :

<img src="../images/docs/keyboard-focus.png" alt="Le contour bleu du focus clavier autour d'un lien sélectionné" />

N'utilisez CSS pour retirer ce contour, par exemple en définissant `outline: 0`, que si vous le remplacez par une autre implémentation de contour de focus.

### Mécanismes pour sauter au contenu désiré {#mechanisms-to-skip-to-desired-content}

Fournissez un mécanisme permettant aux utilisateurs de sauter les sections de navigation dans votre application, car ça facilite et accélère la navigation au clavier.

Les liens d’évitement *(skiplinks, NdT)* sont des liens de navigation cachés qui ne sont visibles que lorsque l'utilisateur interagit au clavier avec la page. Ils sont très faciles à mettre en œuvre avec les ancres de pages internes et un peu de style :

- [WebAIM - Liens d’évitement](http://webaim.org/techniques/skipnav/) (en anglais).

Utilisez également les éléments et rôles de repérage, tels que `<main>` et `<aside>`, afin de délimiter les régions de la page, car les technologies d'assistance permettent à l'utilisateur de naviguer rapidement vers ces sections.

Pour en apprendre davantage sur l'utilisation de ces éléments afin d’améliorer l'accessibilité, rendez-vous sur :

- [Repères d'accessibilité](http://www.scottohara.me/blog/2018/03/03/landmarks.html) (en anglais).

### Gérer le focus programmatiquement {#programmatically-managing-focus}

Nos applications React modifient en continu le DOM HTML au cours de l'exécution, ce qui entraîne parfois la perte du focus clavier ou le positionne sur un élément inattendu. Pour corriger ça, nous devons déplacer le focus clavier programmatiquement dans la bonne direction. On peut par exemple redonner le focus clavier à un bouton qui ouvre une fenêtre modale, lorsque cette dernière se referme.

La documentation web du MDN se penche sur ça et décrit comment nous pouvons construire [des éléments d’interface JavaScript permettant la navigation au clavier](https://developer.mozilla.org/fr/docs/Contrôles_DHTML_personnalisés_navigables_au_clavier).

Afin de définir le focus en React, nous pouvons utiliser les [Refs aux éléments du DOM](/docs/refs-and-the-dom.html).

Nous créons d'abord une ref à un élément du JSX de la classe du composant :

```javascript{4-5,8-9,13}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // Créez une référence pour conserver l'élément textInput du DOM.
    this.textInput = React.createRef();
  }
  render() {
    // Utilisez la prop `ref` pour définir la valeur courante
    //  de la ref `textInput` à l'élément DOM
    return (
      <input
        type="text"
        ref={this.textInput}
      />
    );
  }
}
```

Ensuite, nous pouvons lui donner le focus depuis n'importe où dans notre composant en cas de besoin :

 ```javascript
 focus() {
   // Donnez explicitement le focus au champ de saisie en utilisant l'API du DOM.
   // Remarque : nous utilisons "current" pour accéder au nœud du DOM.
   this.textInput.current.focus();
 }
 ```

Il arrive parfois qu'un composant parent ait besoin de définir le focus sur un élément au sein d’un composant enfant. Pour ce faire, nous [exposons des refs DOM aux composants parents](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components) via une propriété spéciale sur le composant enfant qui transfère la ref du parent au nœud DOM de l'enfant.

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

// Maintenant, vous pouvez définir le focus quand vous en avez besoin.
this.inputElement.current.focus();
```

Quand vous enrobez des composants à l’aide d’un composant d’ordre supérieur *(Higher-Order Component, ou HOC, NdT)*, il est recommandé de [transférer la référence](/docs/forwarding-refs.html) vers l’élément enrobé grâce à la fonction `forwardRef` de React. Si un HOC tiers n'implémente pas le transfert de référence, le modèle ci-dessus peut être utilisé comme solution de secours.

Le composant [react-aria-modal](https://github.com/davidtheclark/react-aria-modal) est un excellent exemple de la gestion du focus. Il s'agit de l'un des rares exemples de fenêtre modale complètement accessible. Non seulement il définit le focus initial sur le bouton d'annulation (empêchant l'utilisateur du clavier d'activer accidentellement l'action de succès), mais il restreint bien le focus clavier à l'intérieur de la fenêtre modale et il remet à terme le focus sur l'élément qui a originellement déclenché la fenêtre modale.

> Remarque
>
> Bien qu'il s'agisse d'une caractéristique d'accessibilité très importante, c'est également une technique qui doit être utilisée à bon escient. Utilisez-la pour corriger le comportement du focus clavier lorsqu'il est perturbé, et non pour essayer d'anticiper la manière dont les utilisateurs souhaitent utiliser les applications.

## Événements de souris et de pointeur {#mouse-and-pointer-events}

Assurez-vous que toutes les fonctionnalités exposées via un événement de souris ou de pointeur sont également accessibles avec le clavier seul. Ne dépendre que du pointeur peut aboutir à de nombreuses situations où les utilisateurs de clavier ne pourront pas utiliser votre application.

Pour illustrer ça, examinons un exemple courant où l'accessibilité est cassée par les événements de clics. Il s'agit du modèle de clic extérieur dans lequel un utilisateur peut désactiver une liste déroulante en cliquant à l'extérieur de l'élément.

<img src="../images/docs/outerclick-with-mouse.gif" alt="Un bouton ouvrant une liste déroulante implémenté par le modèle du clic externe et déclenché par la souris montrant que l'action de fermeture fonctionne." />

C’est généralement implémenté en écoutant l'événement `click` de l'objet `window` pour fermer le menu déroulant :

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
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

Ça fonctionne peut-être pour les utilisateurs ayant des dispositifs de pointage, tels qu'une souris, mais le fait de n'utiliser que le clavier entraîne des dysfonctionnements lors de la tabulation sur l'élément suivant, car l'objet `window` ne reçoit jamais d'événement `click`. Ça peut finir par masquer des fonctionnalités, ce qui empêche les utilisateurs d'utiliser votre application.

<img src="../images/docs/outerclick-with-keyboard.gif" alt="Un bouton ouvrant une liste déroulante implémenté par le modèle du clic externe et déclenché par le clavier montrant que le menu déroulant ne se ferme pas à la perte de focus et qu'il masque d'autres éléments de l'écran." />

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

  // Nous fermons le menu déroulant au prochain tick en utilisant setTimeout.
  // C'est nécessaire car nous devons d'abord vérifier si un
  // autre enfant de l'élément a reçu le focus car l'événement
  // `blur` se déclenche avant le nouvel événement de focus.
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // Si un enfant reçoit le focus, alors on ne ferme pas le menu déroulant.
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // React nous aide en assurant la propagation des
    // événements `blur` et `focus` vers le parent.
    return (
      <div onBlur={this.onBlurHandler}
           onFocus={this.onFocusHandler}>
        <button onClick={this.onClickHandler}
                aria-haspopup="true"
                aria-expanded={this.state.isOpen}>
          Choisissez une option
        </button>
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

Ce code expose la fonctionnalité aussi bien aux utilisateurs de dispositifs de pointage qu'aux utilisateurs de clavier. Remarquez également les propriétés `aria-*` ajoutées afin de prendre en charge les lecteurs d'écran. Par souci de simplicité, les événements clavier permettant l'interaction avec les options du menu déroulant via les touches de curseur n'ont pas été implémentés.

<img src="../images/docs/blur-popover-close.gif" alt="Une liste déroulante se fermant correctement pour les utilisateurs de souris et de clavier." />

C'est un exemple des nombreux cas où le fait de ne dépendre que des événements de souris et de pointeur casse les fonctionnalités pour les utilisateurs de clavier. Toujours tester avec le clavier mettra immédiatement en évidence les problèmes qui peuvent ensuite être résolus à l'aide des gestionnaires d'événements clavier.

## Éléments d’interface plus complexes {#more-complex-widgets}

Une expérience utilisateur plus complexe ne doit pas signifier une expérience moins accessible. Alors que l'accessibilité est plus facile à réaliser en codant au plus près du HTML, même les éléments d'interface les plus complexes peuvent être codés de manière accessible.

Nous avons besoin ici de connaître les [rôles ARIA](https://www.w3.org/TR/wai-aria/#roles), ainsi que les [états et propriétés ARIA](https://www.w3.org/TR/wai-aria/#states_and_properties) (liens en anglais).
Ce sont des boîtes à outils pleines d'attributs HTML pris en charge par JSX et qui nous permettent de construire des composants React pleinement accessibles et hautement fonctionnels.

Chaque type d'élément d'interface a son modèle de conception spécifique et devrait fonctionner de la même manière avec les utilisateurs et les agents utilisateurs (notamment les navigateurs et les lecteurs d’écran) :

- [Pratiques de création WAI-ARIA - Modèles de conception et éléments d’interface](https://www.w3.org/TR/wai-aria-practices/#aria_ex) (en anglais).
- [Heydon Pickering - Exemples ARIA](http://heydonworks.com/practical_aria_examples/) (en anglais).
- [Composants inclusifs](https://inclusive-components.design/) (en anglais).

## Autres points à considérer {#other-points-for-consideration}

### Définir la langue {#setting-the-language}

Indiquez la langue des pages de texte de façon à ce que les logiciels de lecture d'écran puissent sélectionner les paramètres de voix appropriés :

- [WebAIM - Langue du document](http://webaim.org/techniques/screenreader/#language) (en anglais).

### Définir le titre du document {#setting-the-document-title}

Définissez la balise `<title>` du document pour décrire correctement le contenu de la page courante, afin de garantir que l'utilisateur est au courant du contexte de la page en cours :

- [WCAG - Comprendre l'exigence du titre du document](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html) (en anglais).

Nous pouvons le définir dans React en utilisant le [composant React Document Title](https://github.com/gaearon/react-document-title).

### Contraste des couleurs {#color-contrast}

Assurez-vous que tous les textes lisibles sur votre site web ont un contraste des couleurs suffisant pour rester lisibles de manière optimale par les utilisateurs malvoyants :

- [WCAG - Comprendre l'exigence du contraste des couleurs](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html) (en anglais).
- [Tout savoir sur le contraste des couleurs et pourquoi vous devriez le repenser](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/) (en anglais).
- [A11yProject - Qu'est-ce que le contraste des couleurs ?](http://a11yproject.com/posts/what-is-color-contrast/) (en anglais).

Il peut être fastidieux de calculer manuellement les combinaisons de couleurs appropriées pour toutes les situations sur votre site web, aussi vous est-il possible de [calculer une palette entière de couleurs accessible avec Colorable](http://jxnblk.com/colorable/) (en anglais).

Les outils aXe et WAVE mentionnés ci-dessous incluent également des tests de contraste des couleurs et signalent les erreurs de contraste.

Si vous souhaitez étendre vos capacités de test de contraste, vous pouvez utiliser ces outils :

- [WebAIM - Vérification de contraste des couleurs](http://webaim.org/resources/contrastchecker/) (en anglais).
- [The Paciello Group - Analyseur de contraste des couleurs](https://www.paciellogroup.com/resources/contrastanalyser/) (en anglais).

## Outils de développement et de test {#development-and-testing-tools}

Il existe de nombreux outils que nous pouvons utiliser pour nous assister durant la création d'applications web accessibles.

### Le clavier {#the-keyboard}

La vérification de loin la plus simple, mais aussi l'une des plus importantes, consiste à tester si l'ensemble de votre site web est accessible et utilisable avec le clavier seul. Procédez ainsi :

1. Débranchez votre souris.
2. Utilisez `Tab` et `Shift + Tab` pour naviguer.
3. Utilisez `Entrée` pour activer des éléments.
4. Le cas échéant, utilisez les touches de curseur du clavier pour interagir avec certains éléments, tels que les menus et les listes déroulantes.

### Assistance au développement {#development-assistance}

Nous pouvons tester certaines fonctionnalités d'accessibilité directement dans notre code JSX. Souvent des contrôles automatiques sont déjà présents dans les EDI qui prennent en charge JSX pour vérifier les rôles, états et propriétés ARIA. Nous avons également accès à l'outil suivant :

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

L'extension [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) pour ESLint fournit des informations concernant les problèmes d'accessibilité dans votre JSX. De nombreux EDI vous permettent d'intégrer ces résultats directement dans leurs fenêtres d'analyse de code ou de code source.

[Create React App](https://facebook.github.io/create-react-app/) pré-configure cette extension avec un sous-ensemble de règles activées. Si vous souhaitez activer encore plus de règles d'accessibilité, vous pouvez créer un fichier `.eslintrc` à la racine de votre projet avec ce contenu :

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### Tester l'accessibilité dans le navigateur {#testing-accessibility-in-the-browser}

Il existe un certain nombre d'outils pour exécuter des audits d'accessibilité sur des pages web dans votre navigateur. Veuillez les utiliser conjointement avec d'autres contrôles d'accessibilité mentionnés ici car ils ne peuvent tester que l'accessibilité technique de votre HTML.

#### aXe, aXe-core et react-axe {#axe-axe-core-and-react-axe}

Deque Systems propose [aXe-core](https://github.com/dequelabs/axe-core) pour automatiser les tests d'accessibilité de bout en bout de vos applications. Ce module comprend des intégrations pour Selenium.

[*The Accessibility Engine*](https://www.deque.com/products/axe/) (en anglais) ou aXe, est une extension du navigateur qui fournit un inspecteur d'accessibilité en se basant sur `aXe-core`.

Vous pouvez aussi utiliser le module [react-axe](https://github.com/dylanb/react-axe) pour signaler directement ces résultats d'accessibilité dans la console durant le développement et le débogage.

#### WebAIM WAVE {#webaim-wave}

L'[outil Web Accessibility Evaluation](http://wave.webaim.org/extension/) (en anglais) est une autre extension du navigateur pour l'accessibilité.

#### Inspecteurs d'accessibilité et arbre d'accessibilité {#accessibility-inspectors-and-the-accessibility-tree}

[L'arbre d'accessibilité](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) (en anglais) est un sous-ensemble de l'arbre DOM qui contient des objets d'accessibilité pour chaque élément du DOM devant être exposé aux technologies d'assistance, telles que les lecteurs d'écrans.

Sur certains navigateurs, nous pouvons facilement consulter les informations d'accessibilité pour chaque élément de l'arbre d'accessibilité :

- [Utiliser l'inspecteur d'accessibilité de Firefox](https://developer.mozilla.org/fr/docs/Outils/Inspecteur_accessibilite).
- [Utiliser l'inspecteur d'accessibilité de Chrome](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference#pane) (en anglais).
- [Utiliser l'inspecteur d'accessibilité d'OS X Safari](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html) (en anglais).

### Lecteurs d'écran {#screen-readers}

Tester avec un lecteur d'écran devrait faire partie de vos tests d'accessibilité.

Veuillez noter que les combinaisons navigateur / lecteur d'écran ont leur importance. Il est recommandé de tester votre application dans le navigateur le plus adapté au lecteur d'écran de votre choix.

### Lecteurs d'écran fréquemment utilisés {#commonly-used-screen-readers}

#### NVDA dans Firefox {#nvda-in-firefox}

[*NonVisual Desktop Access*](https://www.nvaccess.org/) (en anglais) ou NVDA est un logiciel libre de lecteur d'écran qui est largement utilisé.

Reportez-vous aux guides suivants pour savoir comment utiliser au mieux NVDA :

- [WebAIM - Utiliser NVDA pour évaluer l'accessibilité web](http://webaim.org/articles/nvda/) (en anglais).
- [Deque - Raccourcis clavier NVDA](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts) (en anglais).

#### VoiceOver dans Safari {#voiceover-in-safari}

VoiceOver est un lecteur d'écran intégré dans les appareils d'Apple.

Reportez-vous aux guides suivants pour savoir comment activer et utiliser VoiceOver :

- [WebAIM - Utiliser VoiceOver pour évaluer l'accessibilité web](http://webaim.org/articles/voiceover/) (en anglais).
- [Deque - Raccourcis clavier pour VoiceOver sur OS X](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts) (en anglais).
- [Deque - Raccourcis pour VoiceOver sur iOS](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts) (en anglais).

#### JAWS dans Internet Explorer {#jaws-in-internet-explorer}

[*Job Access With Speech*](http://www.freedomscientific.com/Products/Blindness/JAWS) (en anglais) ou JAWS, est un lecteur d'écran très largement utilisé sur Windows.

Reportez-vous aux guides suivants pour utiliser au mieux JAWS :

- [WebAIM - Utiliser JAWS pour évaluer l'accessibilité web](http://webaim.org/articles/jaws/) (en anglais).
- [Deque - Raccourcis clavier pour JAWS](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts) (en anglais).

### Autres lecteurs d'écran {#other-screen-readers}

#### ChromeVox dans Google Chrome {#chromevox-in-google-chrome}

[ChromeVox](http://www.chromevox.com/) est un lecteur d'écran intégré aux Chromebooks et est disponible [en tant qu'extension](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=fr) pour Google Chrome.

Reportez-vous aux guides suivants pour utiliser au mieux ChromeVox :

- [Aide de Google Chromebook - Utiliser le lecteur d'écran intégré](https://support.google.com/chromebook/answer/7031755?hl=fr).
- [Référence des raccourcis clavier pour ChromeVox Classic](http://www.chromevox.com/keyboard_shortcuts.html) (en anglais).
