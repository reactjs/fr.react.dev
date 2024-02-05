---
title: "Composants React DOM"
---

<Intro>

React prend en charge tous les composants natifs [HTML](https://developer.mozilla.org/docs/Web/HTML/Element) et [SVG](https://developer.mozilla.org/docs/Web/SVG/Element) du navigateur.

</Intro>

---

## Composants communs {/*common-components*/}

Tous les composants natifs du navigateur prennent en charge un jeu commun de props et d'événements.

* [Composants communs (ex. `<div>`)](/reference/react-dom/components/common)

Ça inclut quelques props spécifiques à React telles que `ref` et `dangerouslySetInnerHTML`.

---

## Composants de formulaire {/*form-components*/}

Ces composants natifs du navigateur acceptent des saisies utilisateur :

* [`<input>`](/reference/react-dom/components/input)
* [`<select>`](/reference/react-dom/components/select)
* [`<textarea>`](/reference/react-dom/components/textarea)

React leur réserve un traitement particulier parce que leur passer la prop `value` en fait des *[champs contrôlés](/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)*.

---

## Composants de ressources et métadonnées {/*resource-and-metadata-components*/}

Ces composants natifs du navigateur vous permettent de charger des ressources externes ou d'annoter le document avec des métadonnées :

* [`<link>`](/reference/react-dom/components/link)
* [`<meta>`](/reference/react-dom/components/meta)
* [`<script>`](/reference/react-dom/components/script)
* [`<style>`](/reference/react-dom/components/style)
* [`<title>`](/reference/react-dom/components/title)

Ils font l'objet d'un traitement particulier par React car celui-ci va les restituer directement dans l'en-tête du document, suspendre pendant le chargement des ressources, puis exécuter les autres comportements décrits dans les pages de référence pour chacun de ces composants.

---

## Tous les composants HTML {/*all-html-components*/}

React prend en charge tous les composants HTML natifs du navigateur, ce qui inclut :

* [`<aside>`](https://developer.mozilla.org/docs/Web/HTML/Element/aside)
* [`<audio>`](https://developer.mozilla.org/docs/Web/HTML/Element/audio)
* [`<b>`](https://developer.mozilla.org/docs/Web/HTML/Element/b)
* [`<base>`](https://developer.mozilla.org/docs/Web/HTML/Element/base)
* [`<bdi>`](https://developer.mozilla.org/docs/Web/HTML/Element/bdi)
* [`<bdo>`](https://developer.mozilla.org/docs/Web/HTML/Element/bdo)
* [`<blockquote>`](https://developer.mozilla.org/docs/Web/HTML/Element/blockquote)
* [`<body>`](https://developer.mozilla.org/docs/Web/HTML/Element/body)
* [`<br>`](https://developer.mozilla.org/docs/Web/HTML/Element/br)
* [`<button>`](https://developer.mozilla.org/docs/Web/HTML/Element/button)
* [`<canvas>`](https://developer.mozilla.org/docs/Web/HTML/Element/canvas)
* [`<caption>`](https://developer.mozilla.org/docs/Web/HTML/Element/caption)
* [`<cite>`](https://developer.mozilla.org/docs/Web/HTML/Element/cite)
* [`<code>`](https://developer.mozilla.org/docs/Web/HTML/Element/code)
* [`<col>`](https://developer.mozilla.org/docs/Web/HTML/Element/col)
* [`<colgroup>`](https://developer.mozilla.org/docs/Web/HTML/Element/colgroup)
* [`<data>`](https://developer.mozilla.org/docs/Web/HTML/Element/data)
* [`<datalist>`](https://developer.mozilla.org/docs/Web/HTML/Element/datalist)
* [`<dd>`](https://developer.mozilla.org/docs/Web/HTML/Element/dd)
* [`<del>`](https://developer.mozilla.org/docs/Web/HTML/Element/del)
* [`<details>`](https://developer.mozilla.org/docs/Web/HTML/Element/details)
* [`<dfn>`](https://developer.mozilla.org/docs/Web/HTML/Element/dfn)
* [`<dialog>`](https://developer.mozilla.org/docs/Web/HTML/Element/dialog)
* [`<div>`](https://developer.mozilla.org/docs/Web/HTML/Element/div)
* [`<dl>`](https://developer.mozilla.org/docs/Web/HTML/Element/dl)
* [`<dt>`](https://developer.mozilla.org/docs/Web/HTML/Element/dt)
* [`<em>`](https://developer.mozilla.org/docs/Web/HTML/Element/em)
* [`<embed>`](https://developer.mozilla.org/docs/Web/HTML/Element/embed)
* [`<fieldset>`](https://developer.mozilla.org/docs/Web/HTML/Element/fieldset)
* [`<figcaption>`](https://developer.mozilla.org/docs/Web/HTML/Element/figcaption)
* [`<figure>`](https://developer.mozilla.org/docs/Web/HTML/Element/figure)
* [`<footer>`](https://developer.mozilla.org/docs/Web/HTML/Element/footer)
* [`<form>`](https://developer.mozilla.org/docs/Web/HTML/Element/form)
* [`<h1>`](https://developer.mozilla.org/docs/Web/HTML/Element/h1)
* [`<head>`](https://developer.mozilla.org/docs/Web/HTML/Element/head)
* [`<header>`](https://developer.mozilla.org/docs/Web/HTML/Element/header)
* [`<hgroup>`](https://developer.mozilla.org/docs/Web/HTML/Element/hgroup)
* [`<hr>`](https://developer.mozilla.org/docs/Web/HTML/Element/hr)
* [`<html>`](https://developer.mozilla.org/docs/Web/HTML/Element/html)
* [`<i>`](https://developer.mozilla.org/docs/Web/HTML/Element/i)
* [`<iframe>`](https://developer.mozilla.org/docs/Web/HTML/Element/iframe)
* [`<img>`](https://developer.mozilla.org/docs/Web/HTML/Element/img)
* [`<input>`](/reference/react-dom/components/input)
* [`<ins>`](https://developer.mozilla.org/docs/Web/HTML/Element/ins)
* [`<kbd>`](https://developer.mozilla.org/docs/Web/HTML/Element/kbd)
* [`<label>`](https://developer.mozilla.org/docs/Web/HTML/Element/label)
* [`<legend>`](https://developer.mozilla.org/docs/Web/HTML/Element/legend)
* [`<li>`](https://developer.mozilla.org/docs/Web/HTML/Element/li)
* [`<link>`](https://developer.mozilla.org/docs/Web/HTML/Element/link)
* [`<main>`](https://developer.mozilla.org/docs/Web/HTML/Element/main)
* [`<map>`](https://developer.mozilla.org/docs/Web/HTML/Element/map)
* [`<mark>`](https://developer.mozilla.org/docs/Web/HTML/Element/mark)
* [`<menu>`](https://developer.mozilla.org/docs/Web/HTML/Element/menu)
* [`<meta>`](https://developer.mozilla.org/docs/Web/HTML/Element/meta)
* [`<meter>`](https://developer.mozilla.org/docs/Web/HTML/Element/meter)
* [`<nav>`](https://developer.mozilla.org/docs/Web/HTML/Element/nav)
* [`<noscript>`](https://developer.mozilla.org/docs/Web/HTML/Element/noscript)
* [`<object>`](https://developer.mozilla.org/docs/Web/HTML/Element/object)
* [`<ol>`](https://developer.mozilla.org/docs/Web/HTML/Element/ol)
* [`<optgroup>`](https://developer.mozilla.org/docs/Web/HTML/Element/optgroup)
* [`<option>`](/reference/react-dom/components/option)
* [`<output>`](https://developer.mozilla.org/docs/Web/HTML/Element/output)
* [`<p>`](https://developer.mozilla.org/docs/Web/HTML/Element/p)
* [`<picture>`](https://developer.mozilla.org/docs/Web/HTML/Element/picture)
* [`<pre>`](https://developer.mozilla.org/docs/Web/HTML/Element/pre)
* [`<progress>`](/reference/react-dom/components/progress)
* [`<q>`](https://developer.mozilla.org/docs/Web/HTML/Element/q)
* [`<rp>`](https://developer.mozilla.org/docs/Web/HTML/Element/rp)
* [`<rt>`](https://developer.mozilla.org/docs/Web/HTML/Element/rt)
* [`<ruby>`](https://developer.mozilla.org/docs/Web/HTML/Element/ruby)
* [`<s>`](https://developer.mozilla.org/docs/Web/HTML/Element/s)
* [`<samp>`](https://developer.mozilla.org/docs/Web/HTML/Element/samp)
* [`<script>`](https://developer.mozilla.org/docs/Web/HTML/Element/script)
* [`<section>`](https://developer.mozilla.org/docs/Web/HTML/Element/section)
* [`<select>`](/reference/react-dom/components/select)
* [`<slot>`](https://developer.mozilla.org/docs/Web/HTML/Element/slot)
* [`<small>`](https://developer.mozilla.org/docs/Web/HTML/Element/small)
* [`<source>`](https://developer.mozilla.org/docs/Web/HTML/Element/source)
* [`<span>`](https://developer.mozilla.org/docs/Web/HTML/Element/span)
* [`<strong>`](https://developer.mozilla.org/docs/Web/HTML/Element/strong)
* [`<style>`](https://developer.mozilla.org/docs/Web/HTML/Element/style)
* [`<sub>`](https://developer.mozilla.org/docs/Web/HTML/Element/sub)
* [`<summary>`](https://developer.mozilla.org/docs/Web/HTML/Element/summary)
* [`<sup>`](https://developer.mozilla.org/docs/Web/HTML/Element/sup)
* [`<table>`](https://developer.mozilla.org/docs/Web/HTML/Element/table)
* [`<tbody>`](https://developer.mozilla.org/docs/Web/HTML/Element/tbody)
* [`<td>`](https://developer.mozilla.org/docs/Web/HTML/Element/td)
* [`<template>`](https://developer.mozilla.org/docs/Web/HTML/Element/template)
* [`<textarea>`](/reference/react-dom/components/textarea)
* [`<tfoot>`](https://developer.mozilla.org/docs/Web/HTML/Element/tfoot)
* [`<th>`](https://developer.mozilla.org/docs/Web/HTML/Element/th)
* [`<thead>`](https://developer.mozilla.org/docs/Web/HTML/Element/thead)
* [`<time>`](https://developer.mozilla.org/docs/Web/HTML/Element/time)
* [`<title>`](https://developer.mozilla.org/docs/Web/HTML/Element/title)
* [`<tr>`](https://developer.mozilla.org/docs/Web/HTML/Element/tr)
* [`<track>`](https://developer.mozilla.org/docs/Web/HTML/Element/track)
* [`<u>`](https://developer.mozilla.org/docs/Web/HTML/Element/u)
* [`<ul>`](https://developer.mozilla.org/docs/Web/HTML/Element/ul)
* [`<var>`](https://developer.mozilla.org/docs/Web/HTML/Element/var)
* [`<video>`](https://developer.mozilla.org/docs/Web/HTML/Element/video)
* [`<wbr>`](https://developer.mozilla.org/docs/Web/HTML/Element/wbr)

<Note>

Comme dans le [standard du DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model), React utilise une convention `camelCase` de nommage des props. Par exemple, vous écrirez `tabIndex` au lieu de `tabindex`. Vous pouvez convertir votre HTML existant en JSX grâce à un [convertisseur en ligne](https://transform.tools/html-to-jsx).

</Note>

---

### Éléments HTML personnalisés {/*custom-html-elements*/}

Si vous utilisez dans votre rendu une balise avec un tiret, comme dans `<my-element>`, React supposera que vous souhaitez exploiter un [élément HTML personnalisé](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements) *(custom element, une des parties des Web Components, NdT)*. Dans React, le rendu des éléments personnalisés fonctionne différemment du rendu des éléments natifs du navigateur :

- Toutes les props des éléments personnalisés sont séralisées sous forme de chaînes de caractères, et sont systématiquement définies en tant qu'attributs.
- Les éléments personnalisés utilisent  `class` plutôt que `className` et `for` plutôt que `htmlFor`.

Si vous utilisez un élément HTML natif du navigateur doté d'un attribut [`is`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/is), il sera traité de la même façon qu'un élément personnalisé.

<Note>

[Une future version de React prendra plus largement en charge les éléments personnalisés](https://github.com/facebook/react/issues/11347#issuecomment-1122275286).

Vous pouvez l'essayer en mettant à niveau vos modules React vers la version expérimentale publiée la plus récente :

- `react@experimental`
- `react-dom@experimental`

Les versions expérimentales de React peuvent contenir des bugs. Ne les utilisez pas en production.

</Note>

---

## Tous les composants SVG {/*all-svg-components*/}

React prend en charge tous les composants SVG natifs du navigateur, ce qui inclut :

* [`<a>`](https://developer.mozilla.org/docs/Web/SVG/Element/a)
* [`<animate>`](https://developer.mozilla.org/docs/Web/SVG/Element/animate)
* [`<animateMotion>`](https://developer.mozilla.org/docs/Web/SVG/Element/animateMotion)
* [`<animateTransform>`](https://developer.mozilla.org/docs/Web/SVG/Element/animateTransform)
* [`<circle>`](https://developer.mozilla.org/docs/Web/SVG/Element/circle)
* [`<clipPath>`](https://developer.mozilla.org/docs/Web/SVG/Element/clipPath)
* [`<defs>`](https://developer.mozilla.org/docs/Web/SVG/Element/defs)
* [`<desc>`](https://developer.mozilla.org/docs/Web/SVG/Element/desc)
* [`<discard>`](https://developer.mozilla.org/docs/Web/SVG/Element/discard)
* [`<ellipse>`](https://developer.mozilla.org/docs/Web/SVG/Element/ellipse)
* [`<feBlend>`](https://developer.mozilla.org/docs/Web/SVG/Element/feBlend)
* [`<feColorMatrix>`](https://developer.mozilla.org/docs/Web/SVG/Element/feColorMatrix)
* [`<feComponentTransfer>`](https://developer.mozilla.org/docs/Web/SVG/Element/feComponentTransfer)
* [`<feComposite>`](https://developer.mozilla.org/docs/Web/SVG/Element/feComposite)
* [`<feConvolveMatrix>`](https://developer.mozilla.org/docs/Web/SVG/Element/feConvolveMatrix)
* [`<feDiffuseLighting>`](https://developer.mozilla.org/docs/Web/SVG/Element/feDiffuseLighting)
* [`<feDisplacementMap>`](https://developer.mozilla.org/docs/Web/SVG/Element/feDisplacementMap)
* [`<feDistantLight>`](https://developer.mozilla.org/docs/Web/SVG/Element/feDistantLight)
* [`<feDropShadow>`](https://developer.mozilla.org/docs/Web/SVG/Element/feDropShadow)
* [`<feFlood>`](https://developer.mozilla.org/docs/Web/SVG/Element/feFlood)
* [`<feFuncA>`](https://developer.mozilla.org/docs/Web/SVG/Element/feFuncA)
* [`<feFuncB>`](https://developer.mozilla.org/docs/Web/SVG/Element/feFuncB)
* [`<feFuncG>`](https://developer.mozilla.org/docs/Web/SVG/Element/feFuncG)
* [`<feFuncR>`](https://developer.mozilla.org/docs/Web/SVG/Element/feFuncR)
* [`<feGaussianBlur>`](https://developer.mozilla.org/docs/Web/SVG/Element/feGaussianBlur)
* [`<feImage>`](https://developer.mozilla.org/docs/Web/SVG/Element/feImage)
* [`<feMerge>`](https://developer.mozilla.org/docs/Web/SVG/Element/feMerge)
* [`<feMergeNode>`](https://developer.mozilla.org/docs/Web/SVG/Element/feMergeNode)
* [`<feMorphology>`](https://developer.mozilla.org/docs/Web/SVG/Element/feMorphology)
* [`<feOffset>`](https://developer.mozilla.org/docs/Web/SVG/Element/feOffset)
* [`<fePointLight>`](https://developer.mozilla.org/docs/Web/SVG/Element/fePointLight)
* [`<feSpecularLighting>`](https://developer.mozilla.org/docs/Web/SVG/Element/feSpecularLighting)
* [`<feSpotLight>`](https://developer.mozilla.org/docs/Web/SVG/Element/feSpotLight)
* [`<feTile>`](https://developer.mozilla.org/docs/Web/SVG/Element/feTile)
* [`<feTurbulence>`](https://developer.mozilla.org/docs/Web/SVG/Element/feTurbulence)
* [`<filter>`](https://developer.mozilla.org/docs/Web/SVG/Element/filter)
* [`<foreignObject>`](https://developer.mozilla.org/docs/Web/SVG/Element/foreignObject)
* [`<g>`](https://developer.mozilla.org/docs/Web/SVG/Element/g)
* `<hatch>`
* `<hatchpath>`
* [`<image>`](https://developer.mozilla.org/docs/Web/SVG/Element/image)
* [`<line>`](https://developer.mozilla.org/docs/Web/SVG/Element/line)
* [`<linearGradient>`](https://developer.mozilla.org/docs/Web/SVG/Element/linearGradient)
* [`<marker>`](https://developer.mozilla.org/docs/Web/SVG/Element/marker)
* [`<mask>`](https://developer.mozilla.org/docs/Web/SVG/Element/mask)
* [`<metadata>`](https://developer.mozilla.org/docs/Web/SVG/Element/metadata)
* [`<mpath>`](https://developer.mozilla.org/docs/Web/SVG/Element/mpath)
* [`<path>`](https://developer.mozilla.org/docs/Web/SVG/Element/path)
* [`<pattern>`](https://developer.mozilla.org/docs/Web/SVG/Element/pattern)
* [`<polygon>`](https://developer.mozilla.org/docs/Web/SVG/Element/polygon)
* [`<polyline>`](https://developer.mozilla.org/docs/Web/SVG/Element/polyline)
* [`<radialGradient>`](https://developer.mozilla.org/docs/Web/SVG/Element/radialGradient)
* [`<rect>`](https://developer.mozilla.org/docs/Web/SVG/Element/rect)
* [`<script>`](https://developer.mozilla.org/docs/Web/SVG/Element/script)
* [`<set>`](https://developer.mozilla.org/docs/Web/SVG/Element/set)
* [`<stop>`](https://developer.mozilla.org/docs/Web/SVG/Element/stop)
* [`<style>`](https://developer.mozilla.org/docs/Web/SVG/Element/style)
* [`<svg>`](https://developer.mozilla.org/docs/Web/SVG/Element/svg)
* [`<switch>`](https://developer.mozilla.org/docs/Web/SVG/Element/switch)
* [`<symbol>`](https://developer.mozilla.org/docs/Web/SVG/Element/symbol)
* [`<text>`](https://developer.mozilla.org/docs/Web/SVG/Element/text)
* [`<textPath>`](https://developer.mozilla.org/docs/Web/SVG/Element/textPath)
* [`<title>`](https://developer.mozilla.org/docs/Web/SVG/Element/title)
* [`<tspan>`](https://developer.mozilla.org/docs/Web/SVG/Element/tspan)
* [`<use>`](https://developer.mozilla.org/docs/Web/SVG/Element/use)
* [`<view>`](https://developer.mozilla.org/docs/Web/SVG/Element/view)

<Note>

Comme dans le [standard du DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model), React utilise une convention `camelCase` de nommage des props. Par exemple, vous écrirez `tabIndex` au lieu de `tabindex`. Vous pouvez convertir votre HTML existant en JSX grâce à un [convertisseur en ligne](https://transform.tools/html-to-jsx).

Les attributs à espace de noms doivent également être écrits sans le deux-points :

* `xlink:actuate` devient `xlinkActuate`.
* `xlink:arcrole` devient `xlinkArcrole`.
* `xlink:href` devient `xlinkHref`.
* `xlink:role` devient `xlinkRole`.
* `xlink:show` devient `xlinkShow`.
* `xlink:title` devient `xlinkTitle`.
* `xlink:type` devient `xlinkType`.
* `xml:base` devient `xmlBase`.
* `xml:lang` devient `xmlLang`.
* `xml:space` devient `xmlSpace`.
* `xmlns:xlink` devient `xmlnsXlink`.

</Note>
