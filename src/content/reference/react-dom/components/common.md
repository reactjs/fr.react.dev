---
title: "Composants communs (par exemple <div>)"
---

<Intro>

Tous les composants natifs du navigateur, tels que [`<div>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/div), prennent en charge des props et des événements communs.

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### Composants communs (par exemple `<div>`) {/*common*/}

```js
<div className="wrapper">Quelque chose</div>
```

[Voir d'autres exemples plus bas](#usage).

#### Props {/*common-props*/}

Ces props spécifiques à React sont prises en charge pour tous les composants natifs :

* `children` : un nœud React (un élément, une chaîne de caractères, un nombre, [un portail](/reference/react-dom/createPortal), un nœud vide comme `null`, `undefined` ou un booléen, ou encore un tableau d'autres nœuds React). Elle spécifie le contenu à l'intérieur d'un composant. Lorsque vous utilisez du JSX, vous spécifiez généralement la prop `children` de manière implicite en imbriquant les balises comme dans `<div><span /></div>`.

* `dangerouslySetInnerHTML` : un objet de la forme `{ __html: '<p>du HTML</p>' }` avec du HTML brut dans une chaîne de caractères. Il réécrit la propriété [`innerHTML`](https://developer.mozilla.org/fr/docs/Web/API/Element/innerHTML) du nœud DOM et affiche à l'intérieur le HTML fourni. Cette méthode doit être utilisée avec une extrême prudence ! Si le HTML fourni n'est pas fiable (par exemple s'il est basé sur des données de l'utilisateur), vous risquez d'introduire une vulnérabilité [XSS](https://fr.wikipedia.org/wiki/Cross-site_scripting). [Apprenez-en davantage sur `dangerouslySetInnerHTML`](#dangerously-setting-the-inner-html).

* `ref` : un objet ref provenant de [`useRef`](/reference/react/useRef), de [`createRef`](/reference/react/createRef), d'une [fonction de rappel `ref`](#ref-callback) ou d'une chaîne de caractères pour les [refs historiques](https://legacy.reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs). Votre ref sera calée sur l'élément DOM pour ce nœud. [Apprenez-en davantage sur la manipulation du DOM avec les refs](#manipulating-a-dom-node-with-a-ref).

* `suppressContentEditableWarning` : un booléen. S'il est à `true`, supprime l'avertissement que React affiche pour les éléments qui ont à la fois des `children` et `contentEditable={true}` (lesquels ne fonctionnent normalement pas ensemble). Vous pouvez l'utiliser si vous construisez une bibliothèque de champ de saisie qui gère manuellement le contenu `contentEditable`.

* `suppressHydrationWarning` : un booléen. Si vous utilisez le [rendu côté serveur](/reference/react-dom/server), il y a normalement un avertissement lorsque les rendus côté serveur et côté client produisent un contenu différent. Dans certains rares cas (comme avec les horodatages), il est très compliqué — voire impossible — de garantir une correspondance exacte. Si vous définissez `suppressHydrationWarning` à `true`, React ne vous alertera plus en cas d'incohérence d'attributs ou de contenu pour cet élément. Ça ne fonctionne qu'à un seul niveau de profondeur, et c'est conçu comme une échappatoire. N'en n'abusez pas. [Apprenez-en davantage sur la suppression des erreurs d'hydratation](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors).

* `style` : un objet contenant des styles CSS, par exemple `{ fontWeight: 'bold', margin: 20 }`. À l'image de la propriété [`style`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/style) du DOM, les noms des propriétés CSS doivent être écrites en `camelCase`, comme `fontWeight` au lieu de `font-weight`. Vous pouvez passer des valeurs sous forme de chaîne de caractères ou de nombre. Si vous utilisez un nombre, tel que `width: 100`, React ajoutera automatiquement `px` (« pixels ») à la valeur, à moins qu'il ne s'agisse d'une [propriété sans unité](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57). Nous vous conseillons de n'utiliser `style` que pour les styles dynamiques, pour lesquels vous ne connaissez pas les valeurs de style à l'avance. Dans les autres cas, il est bien plus performant d'utiliser des classes CSS avec `className`. [Apprenez-en davantage sur `className` et `style`](#applying-css-styles).

Ces props standard du DOM sont également prises en charge pour tous les composants natifs :

* [`accessKey`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/accesskey) : une chaîne de caractères. Elle spécifie un raccourci clavier pour l'élément. [Son utilisation est généralement déconseillée](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/accesskey#accessibilité).
* [`aria-*`](https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA/Attributes) : les attributs ARIA vous permettent de spécifier les informations de l'arbre d'accessibilité pour cet élément. Consultez [les attributs ARIA](https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA/Attributes) pour une référence exhaustive. En React, les noms des attributs ARIA sont exactement les mêmes qu'en HTML.
* [`autoCapitalize`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/autocapitalize) : une chaîne de caractères. Elle spécifie la façon dont le texte saisi bénéficie de conversions automatiques en majuscules (sur des claviers virtuels).
* [`className`](https://developer.mozilla.org/fr/docs/Web/API/Element/className) : une chaîne de caractères. Elle spécifie le nom de la classe CSS de l'élément. [Apprenez-en davantage sur la façon d'appliquer des styles CSS](#applying-css-styles).
* [`contentEditable`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/contenteditable) : un booléen. S'il vaut `true`, le navigateur permet à l'utilisateur de modifier directement le contenu de l'élément. C'est utilisé pour implémenter des bibliothèques d'éditeurs riches telle que [Lexical](https://lexical.dev/). React avertit quand vous essayez de donner des `children` React à un élément qui dispose de `contentEditable={true}`, parce que React ne sera pas capable de mettre à jour son contenu après les modifications faites par l'utilisateur.
* [`data-*`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/data-*) : des attributs sur-mesure qui vous permettent d'associer des données à l'élément, par exemple `data-fruit="banane"`. Ils sont rarement utilisés en React car vous lisez généralement les données à partir des props ou de l'état.
* [`dir`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/dir) : `'ltr'` ou `'rtl'`. Ça spécifie la direction du texte de l'élément.
* [`draggable`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/draggable) : un booléen. Il spécifie si l'élément peut être déplacé ou non. Ça fait partie de [l'API HTML de glisser-déposer](https://developer.mozilla.org/fr/docs/Web/API/HTML_Drag_and_Drop_API).
* [`enterKeyHint`](https://developer.mozilla.org/docs/Web/API/HTMLElement/enterKeyHint) : une chaîne de caractères. Elle spécifie quelle action correspond à la touche entrée d'un clavier virtuel.
* [`htmlFor`](https://developer.mozilla.org/docs/Web/API/HTMLLabelElement/htmlFor) : une chaîne de caractères. Pour les [`<label>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/label) et les [`<output>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/output), elle vous permet [d'associer un libellé au contrôle](/reference/react-dom/components/input#providing-a-label-for-an-input). C'est équivalent à [l'attribut HTML `for`](https://developer.mozilla.org/fr/docs/Web/HTML/Attributes/for). React utilise le nom de la propriété standard du DOM (`htmlFor`) plutôt que le nom de l'attribut HTML.
* [`hidden`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/hidden) : un booléen ou une chaîne de caractères. Il spécifie si l'élément doit être caché ou non.
* [`id`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/id) : une chaîne de caractères. Elle spécifie un identifiant unique pour cet élément, qui peut être utilisé afin de le trouver ultérieurement, ou pour le connecter à d'autres éléments. Générez cet identifiant avec [`useId`](/reference/react/useId) pour éviter tout conflit avec des instances multiples d'un même composant.
* [`is`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/is) : une chaîne de caractères. Lorsqu'elle est spécifiée, le composant se comporte comme un [élément HTML personnalisé](/reference/react-dom/components#custom-html-elements) *(custom element, NdT)*.
* [`inputMode`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/inputmode) : une chaîne de caractères. Elle définit le type de clavier virtuel à afficher (textuel, numérique ou téléphonique par exemple).
* [`itemProp`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/itemprop) : une chaîne de caractères. Elle spécifie la propriété associée pour les robots indexeurs de données riches structurées.
* [`lang`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/lang) : une chaîne de caractères. Elle spéficie la langue de l'élément.
* [`onAnimationEnd`](https://developer.mozilla.org/fr/docs/Web/API/Element/animationend_event) : un [gestionnaire d'événement `AnimationEvent`](#animationevent-handler). Cet événement est déclenché à la fin d'une animation CSS.
* `onAnimationEndCapture` : une version de `onAnimationEnd` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onAnimationIteration`](https://developer.mozilla.org/fr/docs/Web/API/Element/animationiteration_event) : un [gestionnaire d'événement `AnimationEvent`](#animationevent-handler). Cet événement est déclenché quand une itération d'une animation CSS se termine, et qu'une nouvelle commence.
* `onAnimationIterationCapture` : une version de `onAnimationIteration` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onAnimationStart`](https://developer.mozilla.org/fr/docs/Web/API/Element/animationstart_event) : un [gestionnaire d'événement `AnimationEvent`](#animationevent-handler). Cet événement est déclenché au démarrage d'une animation CSS.
* `onAnimationStartCapture` : une version de `onAnimationStart` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onAuxClick`](https://developer.mozilla.org/fr/docs/Web/API/Element/auxclick_event) : un [gestionnaire d'événement `MouseEvent`](#mouseevent-handler). Cet événement est déclenché quand un bouton non principal du dispositif de pointage est pressé.
* `onAuxClickCapture` : une version de `onAuxClick` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* `onBeforeInput` : un [gestionnaire d'événement `InputEvent`](#inputevent-handler). Cet événement est déclenché avant que la valeur d'un élément modifiable ne soit modifiée. React n'utilise *pas* encore l'événement natif [`beforeinput`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/beforeinput_event), et utilise un polyfill pour le simuler à l'aide d'autres événements.
* `onBeforeInputCapture` : une version de `onBeforeInput` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* `onBlur` : un [gestionnaire d'événement `FocusEvent`](#focusevent-handler). Cet événement est déclenché lorsqu'un élément perd le focus. Contrairement à l'événement natif [`blur`](https://developer.mozilla.org/fr/docs/Web/API/Element/blur_event) du navigateur, en React l'événement `onBlur` est propagé le long du DOM.
* `onBlurCapture` : une version de `onBlur` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onClick`](https://developer.mozilla.org/fr/docs/Web/API/Element/click_event) : un [gestionnaire d'événement `MouseEvent`](#mouseevent-handler). Cet événement est déclenché quand un bouton principal du dispositif de pointage est pressé.
* `onClickCapture` : une version de `onClick` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onCompositionStart`](https://developer.mozilla.org/fr/docs/Web/API/Element/compositionstart_event) : un [gestionnaire d'événement `CompositionEvent`](#compositionevent-handler). Cet événement est déclenché quand [un système de composition de texte](https://developer.mozilla.org/fr/docs/Glossary/Input_method_editor) démarre une nouvelle session de composition.
* `onCompositionStartCapture` : une version de `onCompositionStart` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onCompositionEnd`](https://developer.mozilla.org/fr/docs/Web/API/Element/compositionend_event) : un [gestionnaire d'événement `CompositionEvent`](#compositionevent-handler). Cet événement est déclenché quand [un système de composition de texte](https://developer.mozilla.org/fr/docs/Glossary/Input_method_editor) termine ou annule une session de composition.
* `onCompositionEndCapture` : une version de `onCompositionEnd` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onCompositionUpdate`](https://developer.mozilla.org/fr/docs/Web/API/Element/compositionupdate_event) : un [gestionnaire d'événement `CompositionEvent`](#compositionevent-handler). Cet événement est déclenché quand [un système de composition de texte](https://developer.mozilla.org/fr/docs/Glossary/Input_method_editor) reçoit un nouveau caractère.
* `onCompositionUpdateCapture` : une version de `onCompositionUpdate` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onContextMenu`](https://developer.mozilla.org/fr/docs/Web/API/Element/contextmenu_event) : un [gestionnaire d'événement `MouseEvent`](#mouseevent-handler). Cet événement est déclenché lorsque l'utilisateur tente d'ouvrir un menu contextuel.
* `onContextMenuCapture` : une version de `onContextMenu` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onCopy`](https://developer.mozilla.org/fr/docs/Web/API/Element/copy_event) : un [gestionnaire d'événement `ClipboardEvent`](#clipboardevent-handler). Cet événement est déclenché quand l'utilisateur tente de copier quelque chose dans le presse-papier.
* `onCopyCapture` : une version de `onCopy` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onCut`](https://developer.mozilla.org/docs/Web/API/Element/cut_event) : un [gestionnaire d'événement `ClipboardEvent`](#clipboardevent-handler). Cet événement est déclenché quand l'utilisateur tente de couper quelque chose dans le presse-papier.
* `onCutCapture` : une version de `onCut` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* `onDoubleClick` : un [gestionnaire d'événement `MouseEvent`](#mouseevent-handler). Cet événement est déclenché quand l'utilisateur double clique. Ça correspond à [l'événement `dblclick`](https://developer.mozilla.org/fr/docs/Web/API/Element/dblclick_event) du navigateur.
* `onDoubleClickCapture` : une version de `onDoubleClick` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onDrag`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/drag_event) : un [gestionnaire d'événement `DragEvent`](#dragevent-handler). Cet événement est déclenché tant que l'utilisateur fait glisser quelque chose.
* `onDragCapture` : une version de `onDrag` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onDragEnd`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/dragend_event) : un [gestionnaire d'événement `DragEvent`](#dragevent-handler). Cet événement est déclenché lorsque l'utilisateur arrête de glisser-déposer quelque chose.
* `onDragEndCapture` : une version de `onDragEnd` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onDragEnter`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/dragenter_event) : un [gestionnaire d'événement `DragEvent`](#dragevent-handler). Cet événement est déclenché quand le contenu en cours de glissement entre dans une cible de dépôt valide.
* `onDragEnterCapture` : une version de `onDragEnter` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onDragOver`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/dragover_event) : un [gestionnaire d'événement `DragEvent`](#dragevent-handler). Cet événement est déclenché sur une cible de dépôt valide tant que le contenu en cours de glissement se situe au-dessus. Vous devez appeler `e.preventDefault()` ici pour autoriser le dépôt.
* `onDragOverCapture` : une version de `onDragOver` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onDragStart`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/dragstart_event) : un [gestionnaire d'événement `DragEvent`](#dragevent-handler). Cet événement est déclenché lorsque l'utilisateur commence le glisser-déposer d'un élément.
* `onDragStartCapture` : une version de `onDragStart` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onDrop`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/drop_event) : un [gestionnaire d'événement `DragEvent` handler](#dragevent-handler). Cet événement est déclenché lorsque quelque chose a été glissé-déposé sur une cible valide.
* `onDropCapture` : une version de `onDrop` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* `onFocus` : un [gestionnaire d'événement `FocusEvent`](#focusevent-handler). Cet événement est déclenché lorsqu'un élément reçoit le focus. Contrairement à l'événement natif [`focus`](https://developer.mozilla.org/docs/Web/API/Element/focus_event) du navigateur, en React l'événement `onFocus` est propagé le long du DOM.
* `onFocusCapture` : une version de `onFocus` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onGotPointerCapture`](https://developer.mozilla.org/fr/docs/Web/API/Element/gotpointercapture_event) : un [gestionnaire d'événement `PointerEvent`](#pointerevent-handler). Cet événement est déclenché lorsqu'un élément capture programmatiquement le pointeur.
* `onGotPointerCaptureCapture` : une version de `onGotPointerCapture` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onKeyDown`](https://developer.mozilla.org/fr/docs/Web/API/Element/keydown_event) : un [gestionnaire d'événement `KeyboardEvent` handler](#keyboardevent-handler). Cet événement est déclenché quand une touche est pressée.
* `onKeyDownCapture` : une version de `onKeyDown` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onKeyPress`](https://developer.mozilla.org/fr/docs/Web/API/Element/keypress_event) : un [gestionnaire d'événement `KeyboardEvent`](#keyboardevent-handler). Il est déprécié. Privilégiez `onKeyDown` ou `onBeforeInput`.
* `onKeyPressCapture` : une version de `onKeyPress` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onKeyUp`](https://developer.mozilla.org/fr/docs/Web/API/Element/keyup_event) : un [gestionnaire d'événement `KeyboardEvent`](#keyboardevent-handler). Cet événement est déclenché quand une touche est relâchée.
* `onKeyUpCapture` : une version de `onKeyUp` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onLostPointerCapture`](https://developer.mozilla.org/docs/Web/API/Element/lostpointercapture_event) : un [gestionnaire d'événement `PointerEvent`](#pointerevent-handler). Cet événement est déclenché quand un élément cesse de capturer le pointeur.
* `onLostPointerCaptureCapture` : une version de `onLostPointerCapture` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onMouseDown`](https://developer.mozilla.org/fr/docs/Web/API/Element/mousedown_event) : un [gestionnaire d'événement `MouseEvent`](#mouseevent-handler). Cet événement est déclenché quand un bouton du dispositif de pointage est pressé.
* `onMouseDownCapture` : une version de `onMouseDown` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onMouseEnter`](https://developer.mozilla.org/fr/docs/Web/API/Element/mouseenter_event) : un [gestionnaire d'événement `MouseEvent`](#mouseevent-handler). Cet événement est déclenché lorsque le pointeur arrive dans un élément. Il n'y a pas de phase de capture. Au lieu de ça, `onMouseLeave` et `onMouseEnter` se propagent de l'élément que l'on quitte à celui sur lequel on arrive.
* [`onMouseLeave`](https://developer.mozilla.org/fr/docs/Web/API/Element/mouseleave_event) : un [gestionnaire d'événement `MouseEvent`](#mouseevent-handler). Cet événement est déclenché lorsque le pointeur quitte un élément. Il n'y a pas de phase de capture. Au lieu de ça, `onMouseLeave` et `onMouseEnter` se propagent de l'élément que l'on quitte à celui sur lequel on arrive.
* [`onMouseMove`](https://developer.mozilla.org/fr/docs/Web/API/Element/mousemove_event) : un [gestionnaire d'événement `MouseEvent`](#mouseevent-handler). Cet événement est déclenché lorsque les coordonnées du pointeur changent.
* `onMouseMoveCapture` : une version de `onMouseMove` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onMouseOut`](https://developer.mozilla.org/fr/docs/Web/API/Element/mouseout_event) : un [gestionnaire d'événement `MouseEvent`](#mouseevent-handler). Cet événement est déclenché lorsque le pointeur quitte un élément ou s'il entre dans un élément enfant.
* `onMouseOutCapture` : une version de `onMouseOut` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onMouseUp`](https://developer.mozilla.org/fr/docs/Web/API/Element/mouseup_event) : un [gestionnaire d'événement `MouseEvent`](#mouseevent-handler). Cet événement est déclenché quand un bouton du dispositif de pointage est relâché.
* `onMouseUpCapture` : une version de `onMouseUp` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onPaste`](https://developer.mozilla.org/docs/Web/API/Element/paste_event) : un [gestionnaire d'événement `ClipboardEvent`](#clipboardevent-handler). Cet événement est déclenché lorsque l'utilisateur tente de coller quelque chose depuis le presse-papier.
* `onPasteCapture` : une version de `onPaste` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onPointerCancel`](https://developer.mozilla.org/docs/Web/API/Element/pointercancel_event) : un [gestionnaire d'événement `PointerEvent`](#pointerevent-handler). Cet événement est déclenché lorque le navigateur annule une interaction du dispositif de pointage.
* `onPointerCancelCapture` : une version de `onPointerCancel` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onPointerDown`](https://developer.mozilla.org/docs/Web/API/Element/pointerdown_event) : un [gestionnaire d'événement `PointerEvent`](#pointerevent-handler). Cet événement est déclenché quand un pointeur devient actif.
* `onPointerDownCapture` : une version de `onPointerDown` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onPointerEnter`](https://developer.mozilla.org/docs/Web/API/Element/pointerenter_event) : un [gestionnaire d'événement `PointerEvent`](#pointerevent-handler). Cet événement est déclenché quand un pointeur entre dans un élément. Il n'y a pas de phase de capture. Au lieu de ça, `onPointerLeave` et `onPointerEnter` se propagent de l'élément que l'on quitte à celui sur lequel on arrive.
* [`onPointerLeave`](https://developer.mozilla.org/docs/Web/API/Element/pointerleave_event) : un [gestionnaire d'événement `PointerEvent`](#pointerevent-handler). Cet événement est déclenché quand un pointeur quitte un élément. Il n'y a pas de phase de capture. Au lieu de ça, `onPointerLeave` et `onPointerEnter` se propagent de l'élément que l'on quitte à celui sur lequel on arrive.
* [`onPointerMove`](https://developer.mozilla.org/docs/Web/API/Element/pointermove_event) : un [gestionnaire d'événement `PointerEvent`](#pointerevent-handler). Cet événement est déclenché lorsque les coordonnées d'un pointeur changent.
* `onPointerMoveCapture` : une version de `onPointerMove` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onPointerOut`](https://developer.mozilla.org/docs/Web/API/Element/pointerout_event) : un [gestionnaire d'événement `PointerEvent`](#pointerevent-handler). Cet événement est déclenché lorsqu'un pointeur quitte un élément, si l'interaction du pointeur est annulée, ainsi [que pour quelques autres raisons](https://developer.mozilla.org/docs/Web/API/Element/pointerout_event).
* `onPointerOutCapture` : une version de `onPointerOut` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onPointerUp`](https://developer.mozilla.org/docs/Web/API/Element/pointerup_event) : un [gestionnaire d'événement `PointerEvent`](#pointerevent-handler). Cet événement est déclenché lorsqu'un pointeur n'est plus actif.
* `onPointerUpCapture` : une version de `onPointerUp` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onScroll`](https://developer.mozilla.org/fr/docs/Web/API/Element/scroll_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque l'utilisateur fait défiler le contenu d'un élément. Cet événement n'est pas propagé.
* `onScrollCapture` : une version de `onScroll` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onSelect`](https://developer.mozilla.org/fr/docs/Web/API/HTMLInputElement/select_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché après que la sélection dans un élément éditable tel qu'un champ de saisie a changé. React étend l'événement `onSelect` pour qu'il fonctionne aussi avec les éléments `contentEditable={true}`. React le modifie également pour se déclencher lors d'une sélection vide et lors de modifications (ce qui peut affecter la sélection).
* `onSelectCapture` : une version de `onSelect` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onTouchCancel`](https://developer.mozilla.org/docs/Web/API/Element/touchcancel_event) : un [gestionnaire d'événement `TouchEvent`](#touchevent-handler). Cet événement est déclenché lorsque le navigateur annule une interaction tactile.
* `onTouchCancelCapture` : une version de `onTouchCancel` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onTouchEnd`](https://developer.mozilla.org/fr/docs/Web/API/Element/touchend_event) : un [gestionnaire d'événement `TouchEvent`](#touchevent-handler). Cet événement est déclenché lorsqu'au moins un pointeur tactile est enlevé.
* `onTouchEndCapture` : une version de `onTouchEnd` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onTouchMove`](https://developer.mozilla.org/docs/Web/API/Element/touchmove_event) : un [gestionnaire d'événement `TouchEvent`](#touchevent-handler). Cet événement est déclenché quand au moins un pointeur tactile est déplacé.
* `onTouchMoveCapture` : une version de `onTouchMove` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onTouchStart`](https://developer.mozilla.org/docs/Web/API/Element/touchstart_event) : un [gestionnaire d'événement `TouchEvent`](#touchevent-handler). Cet événement est déclenché quand au moins un pointeur tactile est détecté.
* `onTouchStartCapture` : une version de `onTouchStart` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onTransitionEnd`](https://developer.mozilla.org/fr/docs/Web/API/Element/transitionend_event) : un [gestionnaire d'événement `TransitionEvent`](#transitionevent-handler). Cet événement est déclenché quand une transition CSS se termine.
* `onTransitionEndCapture` : une version de `onTransitionEnd` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onWheel`](https://developer.mozilla.org/fr/docs/Web/API/Element/wheel_event) : un [gestionnaire d'événement `WheelEvent`](#wheelevent-handler). Cet événement est déclenché lorsque l'utilisateur fait tourner la molette du dispositif de pointage.
* `onWheelCapture` : une version de `onWheel` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`role`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles) : une chaîne de caractères. Elle explicite le rôle de l'élément pour les technologies d'assistance.
* [`slot`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/slot) : une chaîne de caractères. Elle spécifie le nom de l'emplacement *(slot, NdT)* lorsque le *shadow DOM* est utilisé. En React, on obtient un résultat équivalent en passant du JSX dans les props, comme par exemple `<Layout left={<Sidebar />} right={<Content />} />`.
* [`spellCheck`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/spellcheck) : un booléen ou `null`. Lorsqu'il est défini explicitement à `true` ou `false`, la vérification orthographique est activée ou désactivée.
* [`tabIndex`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/tabindex) : un nombre. Celui-ci surcharge le comportement par défaut de la touche <kbd>Tab</kbd>. [Évitez d'utiliser d'autres valeurs que `-1` et `0`](https://www.tpgi.com/using-the-tabindex-attribute/).
* [`title`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/title) : une chaîne de caractères. Elle spécifie le texte pour l'infobulle de l'élément.
* [`translate`](https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/translate) : `'yes'` ou `'no'`. Le contenu de l'élément n'est pas sujet à traduction lorsqu'il vaut `'no'`.

Vous pouvez également passer des attributs personnalisés comme props, par exemple `mycustomprop="uneValeur"`. Ça peut être utile à l'intégration de bibliothèques tierces. Le nom de l'attribut personnalisé doit être en minuscules et ne doit pas commencer par `on`. La valeur sera convertie en chaîne de caractères. Si vous passez `null` ou `undefined`, l'attribut personnalisé sera retiré.

Ces événements sont déclenchés pour les éléments [`<form>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/form) :

* [`onReset`](https://developer.mozilla.org/fr/docs/Web/API/HTMLFormElement/reset_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché quand un formulaire est réinitialisé (ramené à ses valeurs définies par le code HTML).
* `onResetCapture` : une version de `onReset` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onSubmit`](https://developer.mozilla.org/fr/docs/Web/API/HTMLFormElement/submit_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché quand un formulaire est soumis pour traitement.
* `onSubmitCapture` : une version de `onSubmit` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).

Ces événements sont déclenchés pour les éléments [`<dialog>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/dialog). Contrairement aux événements du navigateur, ceux en React sont propagés le long du DOM :

* [`onCancel`](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/cancel_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché quand l'utilisateur tente de fermer la boîte de dialogue.
* `onCancelCapture` : une version de `onCancel` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onClose`](https://developer.mozilla.org/fr/docs/Web/API/HTMLDialogElement/close_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché quand une boîte de dialogue a terminé de se fermer.
* `onCloseCapture` : une version de `onClose` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).

Ces événements sont déclenchés pour les éléments [`<details>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/details). Contrairement aux événements du navigateur, ceux en React sont propagés le long du DOM :

* [`onToggle`](https://developer.mozilla.org/docs/Web/API/HTMLDetailsElement/toggle_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque l'utilisateur fait basculer les détails.
* `onToggleCapture` : une version de `onToggle` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).

Ces événements sont déclenchés pour les éléments [`<img>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/link), et [`<image>` SVG](https://developer.mozilla.org/fr/docs/Web/SVG/Tutorial/SVG_Image_Tag). Contrairement aux événements du navigateur, ceux en React sont propagés le long du DOM :

* `onLoad` : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché quand la ressouce a été complètement chargée.
* `onLoadCapture` : une version de `onLoad` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onError`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/error_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque la ressource n'a pas pu être chargée.
* `onErrorCapture` : une version de `onError` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).

Ces événements sont déclenchés pour les ressources comme [`<audio>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/audio) et [`<video>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/video). Contrairement aux événements du navigateur, ceux en React sont propagés le long du DOM :

* [`onAbort`](https://developer.mozilla.org/fr/docs/Web/API/HTMLMediaElement/abort_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque la ressource n'a pas été chargée complétement, sans que ça provienne d'une erreur.
* `onAbortCapture` : une version de `onAbort` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onCanPlay`](https://developer.mozilla.org/fr/docs/Web/API/HTMLMediaElement/canplay_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsqu'il y a suffisament de données pour démarrer la lecture, mais pas suffisament pour aller jusqu'à la fin sans mise en mémoire tampon (*buffering*).
* `onCanPlayCapture` : une version de `onCanPlay` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onCanPlayThrough`](https://developer.mozilla.org/fr/docs/Web/API/HTMLMediaElement/canplaythrough_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché quand il y a suffisamment de données pour qu'il soit possible de commencer la lecture sans mise en mémoire tampon jusqu'à la fin.
* `onCanPlayThroughCapture` : une version de `onCanPlayThrough` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onDurationChange`](https://developer.mozilla.org/fr/docs/Web/API/HTMLMediaElement/durationchange_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque la durée du média a changé.
* `onDurationChangeCapture` : une version de `onDurationChange` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onEmptied`](https://developer.mozilla.org/fr/docs/Web/API/HTMLMediaElement/emptied_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque le média est devenu vide (purge du flux par exemple).
* `onEmptiedCapture` : une version de `onEmptied` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque le navigateur rencontre un média chiffré.
* `onEncryptedCapture` : une version de `onEncrypted` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onEnded`](https://developer.mozilla.org/fr/docs/Web/API/HTMLMediaElement/ended_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque la lecture s'arrête car il n'y a plus rien à jouer.
* `onEndedCapture` : une version de `onEnded` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onError`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/error_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque la ressource n'a pas pu être chargée.
* `onErrorCapture` : une version de `onError` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onLoadedData`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loadeddata_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque le segment de lecture courant a été chargé.
* `onLoadedDataCapture` : une version de `onLoadedData` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onLoadedMetadata`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loadedmetadata_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque les métadonnées ont été chargées.
* `onLoadedMetadataCapture` : une version de `onLoadedMetadata` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onLoadStart`](https://developer.mozilla.org/fr/docs/Web/API/HTMLMediaElement/loadstart_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque le navigateur commence à charger une ressource.
* `onLoadStartCapture` : une version de `onLoadStart` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onPause`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/pause_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque la lecture du média est mise en pause.
* `onPauseCapture` : une version de `onPause` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onPlay`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/play_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché le média n'est plus en pause.
* `onPlayCapture` : une version de `onPlay` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onPlaying`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/playing_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché le média commence ou recommence sa lecture.
* `onPlayingCapture` : une version de `onPlaying` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onProgress`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/progress_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché périodiquement pendant le chargement de la ressource.
* `onProgressCapture` : une version de `onProgress` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onRateChange`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/ratechange_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque le débit de lecture change.
* `onRateChangeCapture` : une version de `onRateChange` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events)
* `onResize` : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque les dimensions de la vidéo changent.
* `onResizeCapture` : une version de `onResize` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onSeeked`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/seeked_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsqu'un déplacement du pointeur de lecture se termine.
* `onSeekedCapture` : une version de `onSeeked` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onSeeking`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/seeking_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsqu'un déplacement du pointeur de lecture commence.
* `onSeekingCapture` : une version de `onSeeking` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onStalled`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/stalled_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque le navigateur est en attente de données, mais que celles-ci ne se chargent pas.
* `onStalledCapture` : une version de `onStalled` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onSuspend`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/suspend_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque le chargement de la ressource est suspendu.
* `onSuspendCapture` : une version de `onSuspend` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onTimeUpdate`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/timeupdate_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque le temps de lecture est mis à jour.
* `onTimeUpdateCapture` : une version de `onTimeUpdate` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onVolumeChange`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/volumechange_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque le volume audio a changé.
* `onVolumeChangeCapture` : une version de `onVolumeChange` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).
* [`onWaiting`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/waiting_event) : un [gestionnaire d'événement `Event`](#event-handler). Cet événement est déclenché lorsque la lecture s'est arrêtée suite à un manque de données.
* `onWaitingCapture` : une version de `onWaiting` qui se déclenche durant la [phase de capture](/learn/responding-to-events#capture-phase-events).

#### Limitations {/*common-caveats*/}

- Vous ne pouvez pas passer à la fois `children` et `dangerouslySetInnerHTML`.
- Certains événements (tels que `onAbort` et `onLoad`) ne sont pas propagés le long du DOM par le navigateur, mais le sont en React.

---

### La fonction de rappel `ref` {/*ref-callback*/}

Au lieu d'un objet ref (tel que celui renvoyé par [`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref)), vous pouvez passer une fonction à l'attribut `ref`.

```js
<div ref={(node) => console.log(node)} />
```

[Voir un exemple d'utilisation de la fonction de rappel `ref`](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback).

Quand le nœud DOM `<div>` sera ajouté à l'écran, React appellera votre fonction `ref` avec le `node` DOM comme argument. Quand ce nœud DOM `<div>` sera retiré, React apppellera votre fonction `ref` avec `null`.

React appellera aussi votre fonction `ref` à chaque fois que vous passez une fonction `ref` *différente*. Dans l'exemple précédent, `(node) => { ... }` est une fonction différente à chaque rendu. Lorsque votre composant refait un rendu, la fonction *précédente* est appelée avec l'argument `null`, et la fonction *à jour* est appelée avec le nœud DOM.

#### Paramètres {/*ref-callback-parameters*/}

* `node` : un nœud DOM ou `null`. React vous donnera le nœud DOM lorsque la ref sera attachée, et `null` lorsqu'elle sera détachée. À moins de passer la même référence de fonction `ref` à chaque rendu, la fonction de rappel sera détachée et réattachée à chaque rendu du composant.

<Canary>

#### Valeur renvoyée {/*returns*/}

* fonction `cleanup` **optionnelle** : lorsque la `ref` est détachée, React appellera cette fonction de nettoyage.  Si la fonction de rappel `ref` ne renvoie pas de fonction, React rappellera la fonction de rappel avec un argument `null` lorsque la `ref` sera détachée.

```js

<div ref={(node) => {
  console.log(node);

  return () => {
    console.log('Nettoyage', node)
  }
}}>

```

#### Limitations {/*caveats*/}

* Quand le Mode Strict est activé, React **appellera une fois de plus votre cycle mise en place + nettoyage, uniquement en développement**, avant la première mise en place réelle.  C'est une mise à l'épreuve pour vérifier que votre logique de nettoyage reflète bien votre logique de mise en place, et décommissionne ou défait toute la mise en place effectuée.  Si ça entraîne des problèmes, écrivez une fonction de nettoyage.
* Si vous passez une fonction de rappel `ref` *différente*, React appellera la fonction de nettoyage renvoyée par la fonction de rappel *précédente*, si celle-ci en avait renvoyé une. Dans le cas contraire, la fonction de rappel `ref` précédente sera appelée avec un argument `null`.  La fonction de rappel *suivante* sera alors appelée avec le nœud DOM.

</Canary>

---

### Objet d'événement React {/*react-event-object*/}

Vos gestionnaires d'événements recevront un *objet d'événement React*. On parle aussi parfois « d'événement synthétique » React.

```js
<button onClick={e => {
  console.log(e); // Objet d’événement React
}} />
```

Il respecte le même standard que les événements DOM natifs, mais corrige certaines incohérences d'implémentation d'un navigateurs à l'autr.

Certains événements React ne correspondent pas directement aux événements natifs des navigateurs. Dans `onMouseLeave` par exemple, `e.nativeEvent` référence un événement `mouseout`. La correspondance spécifique ne fait pas partie de l'API publique et pourrait changer à l'avenir. Si, pour certaines raisons, vous avez besoin de l'événement sous-jacent du navigateur, vous le trouverez dans dans `e.nativeEvent`.

#### Propriétés {/*react-event-object-properties*/}

Les objets d'événements React implémentent certaines propriétés standard d'[`Event`](https://developer.mozilla.org/fr/docs/Web/API/Event) :

* [`bubbles`](https://developer.mozilla.org/fr/docs/Web/API/Event/bubbles) : un booléen. Il indique si l'événement se propage le long du DOM.
* [`cancelable`](https://developer.mozilla.org/fr/docs/Web/API/Event/cancelable) : un booléen. Il indique si l'événement peut être annulé.
* [`currentTarget`](https://developer.mozilla.org/fr/docs/Web/API/Event/currentTarget) : un nœud DOM. Il renvoie le nœud auquel le gestionnaire d'événement est attaché dans l'arbre React.
* [`defaultPrevented`](https://developer.mozilla.org/fr/docs/Web/API/Event/defaultPrevented) : un booléen. Il indique si la fonction `preventDefault` a été appelée.
* [`eventPhase`](https://developer.mozilla.org/fr/docs/Web/API/Event/eventPhase) : un nombre. Il indique la phase dans laquelle se situe actuellement l'événement.
* [`isTrusted`](https://developer.mozilla.org/fr/docs/Web/API/Event/isTrusted) : un booléen. Il indique si l'événement a été initié par l'utilisateur.
* [`target`](https://developer.mozilla.org/fr/docs/Web/API/Event/target) : un nœud DOM. Il renvoie le nœud sur lequel l'événement a été déclenché (qui peut être un descendant lointain).
* [`timeStamp`](https://developer.mozilla.org/fr/docs/Web/API/Event/timeStamp) : un nombre. Il indique le moment où l'événement a été déclenché.

Les objets d'événements React proposent également ces propriétés :

* `nativeEvent` : un [`Event`](https://developer.mozilla.org/fr/docs/Web/API/Event) DOM. Il s'agit de l'objet d'événement originel du navigateur.

#### Méthodes {/*react-event-object-methods*/}

Les objets d'événements React implémentent certaines méthodes standard d'[`Event`](https://developer.mozilla.org/fr/docs/Web/API/Event) :

* [`preventDefault()`](https://developer.mozilla.org/fr/docs/Web/API/Event/preventDefault) : empêche l'action par défaut du navigateur pour cet événement.
* [`stopPropagation()`](https://developer.mozilla.org/fr/docs/Web/API/Event/stopPropagation) : interrompt la propagation de cet événement le long de l'arbre React.

Les objets d'événements React proposent également ces méthodes :

* `isDefaultPrevented()` : renvoie une valeur booléenne indiquant si `preventDefault` a été appelée.
* `isPropagationStopped()` : renvoie une valeur booléenne indiquant si `stopPropagation` a été appelée.
* `persist()` : inutile pour React DOM. Avec React Native, vous pouvez l'appeler pour lire les propriétés de l'événement après son exécution.
* `isPersistent()` : inutile pour React DOM. Avec React Native, indique si `persist` a été appelée.

#### Limitations {/*react-event-object-caveats*/}

* Les valeurs de `currentTarget`, `eventPhase`, `target` et `type` réflètent les valeurs attendues par votre code React. Sous le capot, React attache les gestionnaires d'événements à la racine, mais ce n'est pas reflété par les objets d'événements React. Par exemple, `e.currentTarget` peut différer du `e.nativeEvent.currentTarget` sous-jacent. Pour les événements simulés, `e.type` (type de l'événement React) peut aussi différer de `e.nativeEvent.type` (type sous-jacent).

---

### Gestionnaire `AnimationEvent` {/*animationevent-handler*/}

Un type de gestionnaire d'événement pour les événements des [animations CSS](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Animations/Using_CSS_animations) .

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### Paramètres {/*animationevent-handler-parameters*/}

* `e` : un [objet d'événement React](#react-event-object) avec ces propriétés spécifiques à [`AnimationEvent`](https://developer.mozilla.org/fr/docs/Web/API/AnimationEvent) :
  * [`animationName`](https://developer.mozilla.org/fr/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/fr/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/fr/docs/Web/API/AnimationEvent/pseudoElement)

---

### Gestionnaire `ClipboardEvent` {/*clipboadevent-handler*/}

Un type de gestionnaire d'événement pour les événements de l'[API Clipboard](https://developer.mozilla.org/fr/docs/Web/API/Clipboard_API).

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### Paramètres {/*clipboadevent-handler-parameters*/}

* `e` : un [objet d'événement React](#react-event-object) avec ces propriétés spécifiques à [`ClipboardEvent`](https://developer.mozilla.org/docs/Web/API/ClipboardEvent) :

  * [`clipboardData`](https://developer.mozilla.org/docs/Web/API/ClipboardEvent/clipboardData)

---

### Gestionnaire `CompositionEvent` {/*compositionevent-handler*/}

Un type de gestionnaire d'événement pour les événements [des systèmes de composition de texte](https://developer.mozilla.org/fr/docs/Glossary/Input_method_editor) *(IME pour Input Method Editor, NdT)*.

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### Paramètres {/*compositionevent-handler-parameters*/}

* `e` : un [objet d'événement React](#react-event-object) avec ces propriétés spécifiques à [`CompositionEvent`](https://developer.mozilla.org/fr/docs/Web/API/CompositionEvent) :
  * [`data`](https://developer.mozilla.org/docs/Web/API/CompositionEvent/data)

---

### Gestionnaire `DragEvent` {/*dragevent-handler*/}

Un type de gestionnaire d'événement pour les événements de [l'API HTML de glisser-déposer](https://developer.mozilla.org/fr/docs/Web/API/HTML_Drag_and_Drop_API).

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    Source pour le glissement
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Cible pour le dépôt
  </div>
</>
```

#### Paramètres {/*dragevent-handler-parameters*/}

* `e` : un [objet d'événement React](#react-event-object) avec ces propriétés spécifiques à [`DragEvent`](https://developer.mozilla.org/docs/Web/API/DragEvent) :
  * [`dataTransfer`](https://developer.mozilla.org/docs/Web/API/DragEvent/dataTransfer).

  Il inclut également les propriétés héritées de [`MouseEvent`](https://developer.mozilla.org/fr/docs/Web/API/MouseEvent) :

  * [`altKey`](https://developer.mozilla.org/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/docs/Web/API/MouseEvent/shiftKey)

  Il inclut enfin les propriétés héritées de [`UIEvent`](https://developer.mozilla.org/fr/docs/Web/API/UIEvent) :

  * [`detail`](https://developer.mozilla.org/fr/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/docs/Web/API/UIEvent/view)

---

### Gestionnaire `FocusEvent` {/*focusevent-handler*/}

Un type de gestionnaire d'événement pour les événements de focus.

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[Voir un exemple](#handling-focus-events).

#### Paramètres {/*focusevent-handler-parameters*/}

* `e` : un [objet d'événement React](#react-event-object) avec ces propriétés spécifiques à [`FocusEvent`](https://developer.mozilla.org/fr/docs/Web/API/FocusEvent) :
  * [`relatedTarget`](https://developer.mozilla.org/docs/Web/API/FocusEvent/relatedTarget)

  Il inclut également les propriétés héritées de [`UIEvent`](https://developer.mozilla.org/fr/docs/Web/API/UIEvent) :

  * [`detail`](https://developer.mozilla.org/fr/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/docs/Web/API/UIEvent/view)

---

### Gestionnaire `Event` {/*event-handler*/}

Un gestionnaire d'événement pour les événements génériques.

#### Paramètres {/*event-handler-parameters*/}

* `e` : un [objet d'événement React](#react-event-object) sans propriété complémentaire.

---

### Gestionnaire `InputEvent` {/*inputevent-handler*/}

Un type de gestionnaire d'événement pour les événements `onBeforeInput`.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### Paramètres {/*inputevent-handler-parameters*/}

* `e` : un [objet d'événement React](#react-event-object) avec ces propriétés spécifiques à [`InputEvent`](https://developer.mozilla.org/fr/docs/Web/API/InputEvent) :
  * [`data`](https://developer.mozilla.org/docs/Web/API/InputEvent/data)

---

### Gestionnaire `KeyboardEvent` {/*keyboardevent-handler*/}

Un type de gestionnaire d'événement pour les événements liés au clavier.

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[Voir un exemple](#handling-keyboard-events).

#### Paramètres {/*keyboardevent-handler-parameters*/}

* `e` : un [objet d'événement React](#react-event-object) avec ces propriétés spécifiques à [`KeyboardEvent`](https://developer.mozilla.org/fr/docs/Web/API/KeyboardEvent) :
  * [`altKey`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/fr/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/fr/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/fr/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/fr/docs/Web/API/KeyboardEvent)
  * [`metaKey`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/docs/Web/API/KeyboardEvent/which)

  Il inclut également les propriétés héritées de [`UIEvent`](https://developer.mozilla.org/fr/docs/Web/API/UIEvent) :

  * [`detail`](https://developer.mozilla.org/fr/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/docs/Web/API/UIEvent/view)

---

### Gestionnaire `MouseEvent` {/*mouseevent-handler*/}

Un type de gestionnaire d'événement pour les événements liés à la souris.

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[Voir un exemple](#handling-mouse-events).

#### Paramètres {/*mouseevent-handler-parameters*/}

* `e` : un [objet d'événement React](#react-event-object) avec ces propriétés spécifiques à [`MouseEvent`](https://developer.mozilla.org/fr/docs/Web/API/MouseEvent) :
  * [`altKey`](https://developer.mozilla.org/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/docs/Web/API/MouseEvent/shiftKey)

  Il inclut également les propriétés héritées de [`UIEvent`](https://developer.mozilla.org/fr/docs/Web/API/UIEvent) :

  * [`detail`](https://developer.mozilla.org/fr/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/docs/Web/API/UIEvent/view)

---

### Gestionnaire `PointerEvent` {/*pointerevent-handler*/}

Un type de gestionnaire d'événement pour les [événements liés aux pointeurs](https://developer.mozilla.org/fr/docs/Web/API/Pointer_events).

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[Voir un exemple](#handling-pointer-events).

#### Paramètres {/*pointerevent-handler-parameters*/}

* `e` : un [objet d'événement React](#react-event-object) avec ces propriétés spécifiques à [`PointerEvent`](https://developer.mozilla.org/fr/docs/Web/API/PointerEvent) :
  * [`height`](https://developer.mozilla.org/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/docs/Web/API/PointerEvent/width)

  Il inclut également les propriétés héritées de [`MouseEvent`](https://developer.mozilla.org/fr/docs/Web/API/MouseEvent) :

  * [`altKey`](https://developer.mozilla.org/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/docs/Web/API/MouseEvent/shiftKey)

  Il inclut enfin les propriétés héritées de [`UIEvent`](https://developer.mozilla.org/fr/docs/Web/API/UIEvent) :

  * [`detail`](https://developer.mozilla.org/fr/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/docs/Web/API/UIEvent/view)

---

### Gestionnaire `TouchEvent` {/*touchevent-handler*/}

Un type de gestionnaire d'événement pour les [événements tactiles](https://developer.mozilla.org/fr/docs/Web/API/Touch_events).

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### Paramètres {/*touchevent-handler-parameters*/}

* `e` : un [objet d'événement React](#react-event-object) avec ces propriétés spécifiques à [`TouchEvent`](https://developer.mozilla.org/docs/Web/API/TouchEvent) :
  * [`altKey`](https://developer.mozilla.org/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/docs/Web/API/TouchEvent/changedTouches)
  * [`metaKey`](https://developer.mozilla.org/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/docs/Web/API/TouchEvent/targetTouches)

  Il inclut également les propriétés héritées de [`UIEvent`](https://developer.mozilla.org/fr/docs/Web/API/UIEvent) :

  * [`detail`](https://developer.mozilla.org/fr/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/docs/Web/API/UIEvent/view)

---

### Gestionnaire `TransitionEvent` {/*transitionevent-handler*/}

Un type de gestionnaire d'événement pour les événements de transitions CSS.

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### Paramètres {/*transitionevent-handler-parameters*/}

* `e` : un [objet d'événement React](#react-event-object) avec ces propriétés spécifiques à [`TransitionEvent`](https://developer.mozilla.org/fr/docs/Web/API/TransitionEvent) :
  * [`elapsedTime`](https://developer.mozilla.org/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/docs/Web/API/TransitionEvent/pseudoElement)

---

### Gestionnaire `UIEvent` {/*uievent-handler*/}

Un type de gestionnaire d'événement pour les événements génériques de l'interface utilisateur.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### Paramètres {/*uievent-handler-parameters*/}

* `e` : un [objet d'événement React](#react-event-object) avec ces propriétés spécifiques à [`UIEvent`](https://developer.mozilla.org/fr/docs/Web/API/UIEvent) :
  * [`detail`](https://developer.mozilla.org/fr/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/docs/Web/API/UIEvent/view)

---

### Gestionnaire `WheelEvent` {/*wheelevent-handler*/}

Un type de gestionnaire d'événement pour les événements `onWheel` (molette de souris).

```js
<div
  onWheel={e => console.log('onWheel')}
/>
```

#### Paramètres {/*wheelevent-handler-parameters*/}

* `e` : un [objet d'événement React](#react-event-object) avec ces propriétés spécifiques à [`WheelEvent`](https://developer.mozilla.org/fr/docs/Web/API/WheelEvent) :
  * [`deltaMode`](https://developer.mozilla.org/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/fr/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/fr/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/fr/docs/Web/API/WheelEvent/deltaZ)


  Il inclut également les propriétés héritées de [`MouseEvent`](https://developer.mozilla.org/fr/docs/Web/API/MouseEvent) :

  * [`altKey`](https://developer.mozilla.org/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/docs/Web/API/MouseEvent/shiftKey)

  Il inclut enfin les propriétés héritées de [`UIEvent`](https://developer.mozilla.org/fr/docs/Web/API/UIEvent) :

  * [`detail`](https://developer.mozilla.org/fr/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/docs/Web/API/UIEvent/view)

---

## Utilisation {/*usage*/}

### Appliquer les styles CSS {/*applying-css-styles*/}

En React, vous spécifiez une classe CSS avec [`className`](https://developer.mozilla.org/fr/docs/Web/API/Element/className). Ça fonctionne comme l'attribut HTML `class` :

```js
<img className="avatar" />
```

Vous écrivez ensuite vos règles CSS dans un fichier CSS séparé :

```css
/* Dans votre CSS */
.avatar {
  border-radius: 50%;
}
```

React n'impose aucune façon particulière d'ajouter des fichiers CSS. Dans les cas les plus simples, vous ajouterez une balise [`<link>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/link) dans votre HTML. Si vous utilisez un outil de *build* ou un framework, consultez sa documentation pour connaître la façon d'ajouter un fichier CSS à votre projet.

Parfois, les valeurs de style que vous souhaitez utiliser dépendent de vos données. Utilisez l'attribut `style` pour passer certains styles dynamiquement :

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```

Dans l'exemple ci-dessus, `style={{}}` n'est pas une syntaxe particulière, mais un objet classique `{}` à l'intérieur des [accolades JSX](/learn/javascript-in-jsx-with-curly-braces) `style={ }`. Nous vous conseillons de n'utiliser l'attribut `style` que si vos styles dépendent de variables JavaScript.

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js src/Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={'Photo de ' + user.name}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css src/styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### Comment appliquer conditionnellement plusieurs classes CSS ? {/*how-to-apply-multiple-css-classes-conditionally*/}

Pour conditionner l'application de classes CSS, vous devez produire vous-même la chaîne de caractères `className` en utilisant JavaScript.

Par exemple, `className={'row ' + (isSelected ? 'selected': '')}` produira soit `className="row"`, soit `className="row selected"`, selon que `isSelected` est à `true` ou non.

Pour faciliter la lecture, vous pouvez utiliser une petite bibliothèque telle que [`classnames`](https://github.com/JedWatson/classnames) :

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

C'est particulièrement utile si vous avez plusieurs classes conditionnelles :

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### Manipuler un nœud DOM avec une ref {/*manipulating-a-dom-node-with-a-ref*/}

Vous aurez parfois besoin de récupérer le nœud DOM du navigateur associé à une balise en JSX. Si par exemple vous voulez activer un `<input>` après qu'un bouton a été cliqué, vous aurez besoin d'appeler [`focus()`](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/focus) sur le nœud DOM `<input>` du navigateur.

Pour obtenir le nœud DOM du navigateur correspondant à une balise, [déclarez une ref](/reference/react/useRef) et passez-la à l'attribut `ref` de cette balise :

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

React référencera le nœud DOM depuis la propriété `inputRef.current` une fois le DOM mis à jour.

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Activer le champ
      </button>
    </>
  );
}
```

</Sandpack>

Apprenez-en davantage sur la [manipulation du DOM avec les refs](/learn/manipulating-the-dom-with-refs) et [découvrez d'autres exemples](/reference/react/useRef#examples-dom).

Pour des utilisations plus avancées, l'attribut `ref` accepte églament une [fonction de rappel](#ref-callback).

---

### Définir le HTML interne (mais c'est risqué) {/*dangerously-setting-the-inner-html*/}

Vous pouvez passer une chaîne de caractères contenant du HTML brut à un élément comme suit :

```js
const markup = { __html: '<p>du HTML brut</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**C'est dangereux. Comme avec la propriété [`innerHTML`](https://developer.mozilla.org/fr/docs/Web/API/Element/innerHTML) du DOM, vous devez faire preuve d'une extrême prudence ! À moins que le balisage ne provienne d'une source parfaitement fiable, il est facile d'introduire une vulnérabilité [XSS](https://fr.wikipedia.org/wiki/Cross-site_scripting) de cette façon.**

Par exemple, si vous utilisez une bibliothèque qui convertit du Markdown en HTML, que vous êtes sûr·e que son *parser* ne contient pas de bug et que l'utilisateur ne voit que ses propres données, vous pouvez afficher le HTML généré de cette façon :

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Bonjour_, **Markdown**!');
  return (
    <>
      <label>
        Saisissez du Markdown :
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // C’est fiable UNIQUEMENT parce que le HTML généré
  // n’est affiché qu’à l’utilisateur qui l’a saisi,
  // et parce que vous avez confiance dans le fait que
  // ce parser de Markdown ne contient pas de bugs.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

L'objet `{__html}` est censé être produit le plus près possible de la génération effective du HTML, comme le fait l'exemple précédent dans la fonction `renderMarkdownToHTML`. Ça garantit que tous les morceaux de HTML brut dans votre code sont explicitement identifiés comme tels, et que seules les variables dans le contenu desquelles vous anticipez la présence de HTML sont passées à `dangerouslySetInnerHTML`. Nous vous déconseillons de créer ces objets à la volée comme dans `<div dangerouslySetInnerHTML={{__html: markup}} />`.

Pour comprendre pourquoi l'injection d'un contenu HTML quelconque est dangereuse, remplacez le code plus haut par celui-ci :

```js {1-4,7,8}
const post = {
  // Imaginez que ce contenu soit stocké en base de données.
  content: `<img src="" onerror='alert("vous avez été hacké")'>`
};

export default function MarkdownPreview() {
  // 🔴 FAILLE DE SÉCURITÉ : passage d’une saisie non fiable à dangerouslySetInnerHTML
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

Le code intégré dans le HTML sera exécuté. Un hacker pourrait utiliser cette faille de sécurité pour voler des informations à l'utilisateur ou effectuer certaines actions en son nom. **Utilisez seulement `dangerouslySetInnerHTML` avec des données de confiance, dûment assainies.**

---

### Gérer des événements liés à la souris {/*handling-mouse-events*/}

Cet exemple montre quelques [événements liés à la souris](#mouseevent-handler) courants et la chronologie de leurs déclenchements.

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (parent)')}
      onMouseLeave={e => console.log('onMouseLeave (parent)')}
    >
      <button
        onClick={e => console.log('onClick (premier bouton)')}
        onMouseDown={e => console.log('onMouseDown (premier bouton)')}
        onMouseEnter={e => console.log('onMouseEnter (premier bouton)')}
        onMouseLeave={e => console.log('onMouseLeave (premier bouton)')}
        onMouseOver={e => console.log('onMouseOver (premier bouton)')}
        onMouseUp={e => console.log('onMouseUp (premier bouton)')}
      >
        Premier bouton
      </button>
      <button
        onClick={e => console.log('onClick (deuxième bouton)')}
        onMouseDown={e => console.log('onMouseDown (deuxième bouton)')}
        onMouseEnter={e => console.log('onMouseEnter (deuxième bouton)')}
        onMouseLeave={e => console.log('onMouseLeave (deuxième bouton)')}
        onMouseOver={e => console.log('onMouseOver (deuxième bouton)')}
        onMouseUp={e => console.log('onMouseUp (deuxième bouton)')}
      >
        Deuxième bouton
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Gérer des événements du pointeur {/*handling-pointer-events*/}

Cet exemple montre quelques [événements liés aux pointeurs](#pointerevent-handler) courants et permet de suivre la chronologie de leurs déclenchements.

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (parent)')}
      onPointerLeave={e => console.log('onPointerLeave (parent)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (premier enfant)')}
        onPointerEnter={e => console.log('onPointerEnter (premier enfant)')}
        onPointerLeave={e => console.log('onPointerLeave (premier enfant)')}
        onPointerMove={e => console.log('onPointerMove (premier enfant)')}
        onPointerUp={e => console.log('onPointerUp (premier enfant)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        Premier enfant
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (deuxième enfant)')}
        onPointerEnter={e => console.log('onPointerEnter (deuxième enfant)')}
        onPointerLeave={e => console.log('onPointerLeave (deuxième enfant)')}
        onPointerMove={e => console.log('onPointerMove (deuxième enfant)')}
        onPointerUp={e => console.log('onPointerUp (deuxième enfant)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        Deuxième enfant
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Gérer les événéments de focus {/*handling-focus-events*/}

Avec React, les [événements de focus](#focusevent-handler) se propagent le long du DOM. Vous pouvez utiliser `currentTarget` et `relatedTarget` pour savoir si les événements de prise de focus ou de perte de focus proviennent de l'extérieur de l'élément parent. L'exemple montre comment détecter le focus d'un enfant, celui de l'élément parent, et comment détecter l'entrée ou la sortie du focus sur l'ensemble du sous-arbre.

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focus sur le parent');
        } else {
          console.log("focus sur l’enfant", e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // N’est pas déclenché quand on passe d’un enfant à l’autre
          console.log('focus entré au niveau du parent');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('perte du focus par le parent');
        } else {
          console.log("perte du focus par l’enfant", e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // N’est pas déclenché quand on passe d’un enfant à l’autre
          console.log('le focus quitte le parent');
        }
      }}
    >
      <label>
        Prénom :
        <input name="firstName" />
      </label>
      <label>
        Nom :
        <input name="lastName" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Gérer les événements liés au clavier {/*handling-keyboard-events*/}

Cet exemple montre quelques [événements liés au clavier](#keyboardevent-handler) courants et la chronologie de leurs déclenchements.

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      Prénom :
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>
