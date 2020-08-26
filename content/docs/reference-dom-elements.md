---
id: dom-elements
title: Éléments DOM
layout: docs
category: Reference
permalink: docs/dom-elements.html
redirect_from:
  - "docs/tags-and-attributes.html"
  - "docs/dom-differences.html"
  - "docs/special-non-dom-attributes.html"
  - "docs/class-name-manipulation.html"
  - "tips/inline-styles.html"
  - "tips/style-props-value-px.html"
  - "tips/dangerously-set-inner-html.html"
---

React implémente un système de DOM indépendant des navigateurs pour des raisons de performance et de compatibilité entre navigateurs. Nous en avons profité pour arrondir les angles des implémentations du DOM des navigateurs.

En React, toutes les propriétés et tous les attributs du DOM (y compris les gestionnaires d'événements) doivent être en *camelCase*. Par exemple, l'attribut HTML `tabindex` correspond à l'attribut `tabIndex` en React. Les attributs `aria-*` et `data-*` sont l’exception à la règle, et doivent être en minuscules. Par exemple, vous pouvez garder `aria-label` en tant que `aria-label`.

## Différences dans les attributs {#differences-in-attributes}

Un certain nombre d'attributs diffèrent entre React et HTML :

### checked {#checked}

L'attribut `checked` est accepté par les composants `<input>` de type `checkbox` ou `radio`. Vous pouvez l'utiliser pour définir si un composant est coché ou non. C'est utile pour créer des composants contrôlés. L'équivalent non-contrôlé est `defaultChecked`, qui définit l'état coché ou non du composant uniquement lorsqu'il est monté pour la première fois.

### className {#classname}

Utilisez l'attribut `className` pour spécifier une classe CSS. Ça vaut pour tous les éléments DOM et SVG tels que `<div>`, `<a>`, et les autres.

Si vous utilisez React avec les Web Components (ce qui est rare), utilisez plutôt l'attribut `class`.

### dangerouslySetInnerHTML {#dangerouslysetinnerhtml}

`dangerouslySetInnerHTML` est l'équivalent React de `innerHTML` dans le DOM des navigateurs. En règle générale, définir le HTML directement depuis le code est risqué car il est trop facile d'exposer vos utilisateurs à une attaque de type [cross-site scripting (XSS)](https://fr.wikipedia.org/wiki/Cross-site_scripting). C'est pourquoi vous pouvez définir le HTML directement depuis React, mais vous devez taper `dangerouslySetInnerHTML` et passer un objet avec une clé `__html`, pour vous souvenir que c'est dangereux. Par exemple :

```js
function createMarkup() {
  return {__html: 'Premier &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor {#htmlfor}

Puisque `for` est un mot réservé en JavaScript, les éléments React utilisent plutôt `htmlFor`.

### onChange {#onchange}

L'événement `onChange` se comporte comme on s'y attend : à chaque fois qu'un champ de formulaire change, cet événement est déclenché. Nous utilisons délibérément un comportement différent de celui des navigateurs car le nom `onChange` est un faux-ami et React s'appuie sur cet événement pour traiter les saisies utilisateurs en temps réel.

### selected {#selected}


Si vous voulez signaler qu’une option est sélectionnée, utilisez plutôt sa valeur dans le `value` de son `<select>`. Pour plus de détails, consultez [« La balise `select` »](/docs/forms.html#the-select-tag).

### style {#style}

>Remarque
>
>Certains exemples dans la documentation utilisent `style` par souci de commodité, mais **utiliser l'attribut `style` comme méthode principale pour styler les éléments est généralement déconseillé.** Dans la plupart des cas, vous devriez plutôt utiliser [`className`](#classname) pour référencer des classes définies dans une feuille de style CSS externe. Dans les applications React, on utilise plus fréquemment `style` pour ajouter des styles calculés dynamiquement au moment de l‘affichage. Voir également [FAQ : styles et CSS](/docs/faq-styling.html).

L'attribut `style` accepte un objet JavaScript avec des propriétés en `camelCase` plutôt qu'une chaîne de caractères CSS. C'est conforme à la propriété JavaScript `style`, plus performant, et évite des failles de sécurité XSS. Par exemple :

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Bonjour, monde !</div>;
}
```

Notez que ces styles ne sont pas automatiquement préfixés. Pour prendre en charge les navigateurs plus anciens vous devez fournir les propriétés de styles correspondantes :

```js
const divStyle = {
  WebkitTransition: 'all', // notez le 'W' majuscule ici
  msTransition: 'all' // 'ms' est le seul préfixe fournisseur en minuscules
};

function ComponentWithTransition() {
  return <div style={divStyle}>Ça devrait fonctionner dans tous les navigateurs</div>;
}
```

Les clés de style sont en `camelCase` pour être cohérentes avec les propriétés des nœuds du DOM (ex. `node.style.backgroundImage`). Les préfixes fournisseurs [hormis `ms`](https://www.andismith.com/blogs/2012/02/modernizr-prefixed/) doivent commencer avec une lettre majuscule. C'est pour ça que `WebkitTransition` a un « W » majuscule.

React ajoute automatiquement le suffixe « px » à certaines propriétés numériques de style. Si vous voulez une autre unité que « px », spécifiez la valeur sous forme de chaîne de caractères avec l'unité désirée. Par exemple :

```js
// Style résultat : '10px'
<div style={{ height: 10 }}>
  Bonjour, monde !
</div>

// Style résultat : '10%'
<div style={{ height: '10%' }}>
  Bonjour, monde !
</div>
```

Toutes les propriétés de style ne sont pas systématiquement converties en pixels pour autant. Certaines restent sans unité (ex. `zoom`, `order`, `flex`). La liste complète des propriétés sans unité peut-être consultée [ici](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59).

### suppressContentEditableWarning {#suppresscontenteditablewarning}

Normalement un avertissement apparaît lorsqu'un élément avec des enfants est également marqué comme `contentEditable`, car ça ne fonctionnera pas. Cet attribut supprime cet avertissement. Ne l'utilisez pas à moins que vous ne soyez en train de développer une bibliothèque comme [Draft.js](https://facebook.github.io/draft-js/), qui gère `contentEditable` manuellement.

### suppressHydrationWarning {#suppresshydrationwarning}

Si vous utilisez le rendu côté serveur de React, normalement un avertissement apparaît lorsque le serveur et le client produisent des contenus différents. Cependant, dans certains cas rares, il est très difficile—voire impossible—de garantir un contenu identique. Par exemple, les horodatages diffèrent généralement entre le serveur et le client.

Si vous définissez `suppressHydrationWarning` à `true`, React ne vous avertira pas des différences dans les attributs et le contenu de cet élément. Ça ne fonctionne qu’à un niveau de profondeur, et c’est conçu comme une échappatoire. N'en abusez pas. Pour en apprendre davantage sur la phase d'hydratation, consultez la [`documentation de ReactDOM.hydrate()`](/docs/react-dom.html#hydrate).

### value {#value}

L'attribut `value` est accepté par les composants `<input>`, `<select>` et `<textarea>`. Vous pouvez l'utiliser pour définir la valeur d'un composant. C'est utile pour créer des composants contrôlés. `defaultValue` est l'équivalent non-contrôlé, qui définit la valeur du composant uniquement lorsqu'il est monté pour la première fois.

## Tous les attributs HTML pris en charge {#all-supported-html-attributes}

Depuis React 16, tous les attributs standards ou [personnalisés](/blog/2017/09/08/dom-attributes-in-react-16.html) sont pleinement pris en charge.

React a toujours fourni une API de gestion du DOM pensée pour JavaScript. Étant donné que les composants React acceptent autant les props personnalisées que celles liées au DOM, React utilise la convention `camelCase` tout comme les API DOM :

```js
<div tabIndex="-1" />      // Tout comme l'API DOM node.tabIndex
<div className="Button" /> // Tout comme l'API DOM node.className
<input readOnly={true} />  // Tout comme l'API DOM node.readOnly
```

Ces props fonctionnent comme les attributs HTML correspondants, à l'exception des cas spéciaux documentés ci-dessus.

Les attributs du DOM pris en charge par React incluent notamment :

```
accept acceptCharset accessKey action allowFullScreen alt async autoComplete
autoFocus autoPlay capture cellPadding cellSpacing challenge charSet checked
cite classID className colSpan cols content contentEditable contextMenu controls
controlsList coords crossOrigin data dateTime default defer dir disabled
download draggable encType form formAction formEncType formMethod formNoValidate
formTarget frameBorder headers height hidden high href hrefLang htmlFor
httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list
loop low manifest marginHeight marginWidth max maxLength media mediaGroup method
min minLength multiple muted name noValidate nonce open optimum pattern
placeholder poster preload profile radioGroup readOnly rel required reversed
role rowSpan rows sandbox scope scoped scrolling seamless selected shape size
sizes span spellCheck src srcDoc srcLang srcSet start step style summary
tabIndex target title type useMap value width wmode wrap
```

Dans le même esprit, tous les attributs SVG sont pleinement pris en charge :

```
accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan
```

Vous pouvez également utiliser des attributs personnalisés du moment qu'ils sont intégralement en minuscules.
