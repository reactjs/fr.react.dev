---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

Ce guide de référence documente l’enrobage `SyntheticEvent` qui fait partie du système d'événements de React. Consultez le guide sur la [gestion d'événements](/docs/handling-events.html) pour en savoir plus.

## Aperçu {#overview}

Vos gestionnaires d'événements recevront des instances de `SyntheticEvent`, un enrobage compatible tous navigateurs autour de l'événement natif du navigateur. Il fournit la même interface que l'événement natif, comprenant notamment `stopPropagation()` et `preventDefault()`, à ceci près que ces événements fonctionnent de façon identique sur tous les navigateurs.

Si pour une raison ou une autre, vous avez besoin de l'événement sous-jacent du navigateur, utilisez l'attribut `nativeEvent` pour le récupérer. Tous les objets `SyntheticEvent` disposent des attributs suivants :

```javascript
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
DOMEventTarget target
number timeStamp
string type
```

>Remarque
>
> Depuis la version 0.14, renvoyer `false` depuis un gestionnaire d'événements n’interrompt plus la propagation de l'événement. Pour ce faire, appelez explicitement `e.stopPropagation()` ou `e.preventDefault()`, selon le besoin.

### Recyclage des événements {#event-pooling}

Les objets `SyntheticEvent` sont recyclés. En d’autres termes, tout objet `SyntheticEvent` sera réutilisé et ses propriétés seront remises à `null` une fois que la fonction de rappel de l'événement aura été invoquée.
React agit ainsi pour améliorer les performances.
Par consé­quent, vous ne pouvez pas accéder à l'événement de façon asynchrone.

```javascript
function onClick(event) {
  console.log(event); // => objet nullifié.
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // Ne fonctionnera pas. this.state.clickEvent ne contiendra que des valeurs à null.
  this.setState({clickEvent: event});

  // Vous pouvez toutefois exporter les propriétés de l'événement.
  this.setState({eventType: event.type});
}
```

>Remarque
>
> Si vous souhaitez accéder aux propriétés de l'événement de façon asynchrone, vous devez appeler sa méthode `event.persist()`, ce qui le retirera du système de recyclage, et permettra à votre code de conserver sans problème des références sur l’événement.

## Événements pris en charge {#supported-events}

React normalise les événements pour qu’ils aient les mêmes propriétés dans tous les navigateurs.

Les gestionnaires d'événements ci-dessous sont déclenchés par un événement durant la phase de propagation. Pour inscrire un gestionnaire d'événements pour la phase de capture, ajoutez le suffixe `Capture` au nom de l'événement ; par exemple, vous utiliserez `onClickCapture` plutôt que `onClick` pour gérer l'événement de clic durant la phase de capture.

- [Événements de presse-papiers](#clipboard-events)
- [Événements de composition](#composition-events)
- [Événements du clavier](#keyboard-events)
- [Événements de focus](#focus-events)
- [Événements de formulaires](#form-events)
- [Événements de la souris](#mouse-events)
- [Événements du pointeur](#pointer-events)
- [Événements de sélection](#selection-events)
- [Événements d'interaction tactile](#touch-events)
- [Événements visuels](#ui-events)
- [Événements de la molette](#wheel-events)
- [Événements de média](#media-events)
- [Événements d'images](#image-events)
- [Événements d'animation](#animation-events)
- [Événements de transition](#transition-events)
- [Autres événements](#other-events)

* * *

## Référence de l'API {#reference}

### Événements de presse-papiers {#clipboard-events}

Noms des événements :

```
onCopy onCut onPaste
```

Propriétés :

```javascript
DOMDataTransfer clipboardData
```

* * *

### Événements de composition {#composition-events}

Noms des événements :

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

Propriétés :

```javascript
string data

```

* * *

### Événements du clavier {#keyboard-events}

Noms des événements :

```
onKeyDown onKeyPress onKeyUp
```

Propriétés :

```javascript
boolean altKey
number charCode
boolean ctrlKey
boolean getModifierState(key)
string key
number keyCode
string locale
number location
boolean metaKey
boolean repeat
boolean shiftKey
number which
```

La propriété `key` peut prendre n'importe quelle valeur documentée dans la [spécification des événements DOM de niveau 3](https://www.w3.org/TR/uievents-key/#named-key-attribute-values).

* * *

### Événements de focus {#focus-events}

Noms des événements :

```
onFocus onBlur
```

Ces événements de focus fonctionnent sur tous les éléments du DOM de React, et pas uniquement sur les éléments du formulaire.

Propriétés :

```javascript
DOMEventTarget relatedTarget
```

* * *

### Événements de formulaires {#form-events}

Noms des événements :

```
onChange onInput onInvalid onSubmit
```

Pour plus d'informations sur l'événement onChange, consultez la documentation sur [les formulaires](/docs/forms.html).

* * *

### Événements de la souris {#mouse-events}

Noms des événements :

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

Les événements `onMouseEnter` et `onMouseLeave` se propagent de l'élément qui vient d'être quitté par la souris à celui sur lequel la souris arrive (au lieu d'une propagation classique) et n'ont pas de phase de capture.

Propriétés :

```javascript
boolean altKey
number button
number buttons
number clientX
number clientY
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
number pageX
number pageY
DOMEventTarget relatedTarget
number screenX
number screenY
boolean shiftKey
```

* * *

### Événements du pointeur {#pointer-events}

Noms des événements :

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

Les événements `onPointerEnter` et `onPointerLeave` se propagent de l'élément qui vient d'être quitté par le pointeur à celui sur lequel le pointeur arrive (au lieu d'une propagation classique) et n'ont pas de phase de capture.

Propriétés :

Comme défini par la [spécification W3](https://www.w3.org/TR/pointerevents/), les événements du pointeur étendent les [événements de la souris](#mouse-events) avec les propriétés suivantes :

```javascript
number pointerId
number width
number height
number pressure
number tangentialPressure
number tiltX
number tiltY
number twist
string pointerType
boolean isPrimary
```

Une remarque concernant la prise en charge tous navigateurs :

Les événements du pointeur ne sont pas encore pris en charge par tous les navigateurs (au moment de l'écriture de cet article, les navigateurs qui les prennent en charge comprennent Chrome, Firefox, Edge, et Internet Explorer). React ne fournit volontairement pas de *polyfill* pour les autres navigateurs, dans la mesure où un polyfill conforme au standard augmenterait significativement la taille du module `react-dom`.

Si votre application nécessite les événements du pointeur, nous vous conseillons d'ajouter un polyfill tiers pour les prendre en charge.

* * *

### Événements de sélection {#selection-events}

Noms des événements :

```
onSelect
```

* * *

### Événements d'interaction tactile {#touch-events}

Noms des événements :

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

Propriétés :

```javascript
boolean altKey
DOMTouchList changedTouches
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
boolean shiftKey
DOMTouchList targetTouches
DOMTouchList touches
```

* * *

### Événements visuels {#ui-events}

Noms des événements :

```
onScroll
```

Propriétés :

```javascript
number detail
DOMAbstractView view
```

* * *

### Événements de la molette {#wheel-events}

Noms des événements :

```
onWheel
```

Propriétés :

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### Événements de média {#media-events}

Noms des événements :

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### Événements d'images {#image-events}

Noms des événements :

```
onLoad onError
```

* * *

### Événements d'animation {#animation-events}

Noms des événements :

```
onAnimationStart onAnimationEnd onAnimationIteration
```

Propriétés :

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### Événements de transition {#transition-events}

Noms des événements :

```
onTransitionEnd
```

Propriétés :

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### Autres événements {#other-events}

Noms des événements :

```
onToggle
```
