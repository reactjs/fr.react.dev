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

Si pour une raison ou une autre, vous avez besoin de l'événement sous-jacent du navigateur, utilisez l'attribut `nativeEvent` pour le récupérer. Les événements synthétiques diffèrent des événements natifs du navigateur, avec lesquels ils n’ont pas toujours de correspondance directe.  Par exemple pour `onMouseLeave`, `event.nativeEvent` référencera un événement `mouseout`. Les correspondances effectives ne font pas partie de l'API publique et sont susceptibles d’évoluer à tout moment. Tous les objets `SyntheticEvent` disposent des attributs suivants :

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
void persist()
DOMEventTarget target
number timeStamp
string type
```

>Remarque
>
<<<<<<< HEAD
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
=======
> As of v17, `e.persist()` doesn't do anything because the `SyntheticEvent` is no longer [pooled](/docs/legacy-event-pooling.html).
>>>>>>> 20f0fe280f3c122df7541256b983c46e21e33b20

>Remarque
>
<<<<<<< HEAD
> Si vous souhaitez accéder aux propriétés de l'événement de façon asynchrone, vous devez appeler sa méthode `event.persist()`, ce qui le retirera du système de recyclage, et permettra à votre code de conserver sans problème des références sur l’événement.
=======
> As of v0.14, returning `false` from an event handler will no longer stop event propagation. Instead, `e.stopPropagation()` or `e.preventDefault()` should be triggered manually, as appropriate.
>>>>>>> 20f0fe280f3c122df7541256b983c46e21e33b20

## Événements pris en charge {#supported-events}

React normalise les événements pour qu’ils aient les mêmes propriétés dans tous les navigateurs.

Les gestionnaires d'événements ci-dessous sont déclenchés par un événement durant la phase de propagation. Pour inscrire un gestionnaire d'événements pour la phase de capture, ajoutez le suffixe `Capture` au nom de l'événement ; par exemple, vous utiliserez `onClickCapture` plutôt que `onClick` pour gérer l'événement de clic durant la phase de capture.

- [Événements de presse-papiers](#clipboard-events)
- [Événements de composition](#composition-events)
- [Événements du clavier](#keyboard-events)
- [Événements de focus](#focus-events)
- [Événements de formulaires](#form-events)
- [Événements génériques](#generic-events)
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

```js
DOMEventTarget relatedTarget
```

#### onFocus {#onfocus}

The `onFocus` event is called when the element (or some element inside of it) receives focus. For example, it's called when the user clicks on a text input.

```javascript
function Example() {
  return (
    <input
      onFocus={(e) => {
        console.log('Focused on input');
      }}
      placeholder="onFocus is triggered when you click this input."
    />
  )
}
```

#### onBlur {#onblur}

The `onBlur` event handler is called when focus has left the element (or left some element inside of it). For example, it's called when the user clicks outside of a focused text input.

```javascript
function Example() {
  return (
    <input
      onBlur={(e) => {
        console.log('Triggered because this input lost focus');
      }}
      placeholder="onBlur is triggered when you click this input and then you click outside of it."
    />
  )
}
```

#### Detecting Focus Entering and Leaving {#detecting-focus-entering-and-leaving}

You can use the `currentTarget` and `relatedTarget` to differentiate if the focusing or blurring events originated from _outside_ of the parent element. Here is a demo you can copy and paste that shows how to detect focusing a child, focusing the element itself, and focus entering or leaving the whole subtree.

```javascript
function Example() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused self');
        } else {
          console.log('focused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered self');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused self');
        } else {
          console.log('unfocused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left self');
        }
      }}
    >
      <input id="1" />
      <input id="2" />
    </div>
  );
}
```

* * *

### Événements de formulaires {#form-events}

Noms des événements :

```
onChange onInput onInvalid onReset onSubmit
```

Pour plus d'informations sur l'événement onChange, consultez la documentation sur [les formulaires](/docs/forms.html).

* * *

### Événements génériques {#generic-events}

Noms des événements :

```
onError onLoad
```

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

<<<<<<< HEAD
Propriétés :
=======
>Note
>
>Starting with React 17, the `onScroll` event **does not bubble** in React. This matches the browser behavior and prevents the confusion when a nested scrollable element fires events on a distant parent.

Properties:
>>>>>>> 20f0fe280f3c122df7541256b983c46e21e33b20

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
