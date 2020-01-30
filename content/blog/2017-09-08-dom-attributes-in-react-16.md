---
title: "Les attributs du DOM dans React 16"
author: [gaearon]
---

Dans le passé, React ignorait les attributs DOM inconnus. Si vous écriviez du JSX avec un attribut que React ne reconnaissait pas, React le sautait tout simplement. Par exemple, ceci:

```js
// Votre code:
<div mycustomattribute="quelque chose" />
```

rendrait une div vide dans le DOM avec React 15:

```js
// rendu de React 15:
<div />
```

Dans React 16, nous apportons un changement. Maintenant, tous les attributs inconnus se retrouveront dans le DOM:

```js
// rendu de React 16:
<div mycustomattribute="quelque chose" />
```

## Pourquoi changeons-nous cela? {#pourquoi-changeons-nous-cela}

React a toujours fourni une API Javascript centrée sur le DOM. Étant donné que les composants React prennent souvent à la fois des propriétés personnalisées et relative au DOM, il est logique que React utilise la convention `camelCase` tout comme les API DOM:

```js
<div tabIndex="-1" />
```

Cela n'a pas changé. Cependant, la façon dont nous l'avons appliqué dans le passé nous a obligés à maintenir une liste blanche de tous les attributs DOM React valides dans le paquet:

```js
// ...
summary: 'summary',
tabIndex: 'tabindex'
target: 'target',
title: 'title',
// ...
```

Cela avait deux inconvénients:

* Vous ne pouviez pas [passer un attribut personnalisé](https://github.com/facebook/react/issues/140). Cela est utile pour fournir des attributs non standard spécifiques au navigateur, essayer de nouvelles API DOM et s'intégrer à des bibliothèques tierces avisées.

* La liste d'attributs n'a cessé de croître au fil du temps, mais la plupart des noms d'attributs canoniques React sont déjà valides dans le DOM. La suppression de la majorité de liste blanche nous a aidé à diminuer un peu la taille du paquet.

Avec la nouvelle approche, ces deux problèmes sont résolus. Avec React 16, vous pouvez désormais transmettre des attributs personnalisés à tous les éléments HTML et SVG, et React n'a pas à inclure de liste blanche d'attributs dans sa version de production.

** Notez que vous devez toujours utiliser la dénomination canonique React pour les attributs connus: **

```js
// Oui, s'il vous plaît
<div tabIndex="-1" />

// Attention: propriété du DOM invalide `tabindex`. Vous voulez certainement dire `tabIndex`?
<div tabindex="-1" />
```

En d'autres termes, la façon dont vous utilisez les composants du DOM dans React n'a pas changé, mais vous disposez désormais de nouvelles fonctionnalités.

## Dois-je conserver les données dans des attributs personnalisés ? {#dois-je-conserver-les-donnees-dans-des-attributs-personnalises}

Non. Nous ne vous encourageons pas à conserver les données dans les attributs DOM. Même si vous le devez, les attributs `data-` sont probablement une meilleure approche, mais dans la plupart des cas, les données doivent être conservées dans l'état du composant React ou dans des collections externes.

Cependant, la nouvelle fonctionnalité est pratique si vous devez utiliser un attribut DOM non standard ou nouveau, ou si vous devez intégrer une bibliothèque tierce qui s'appuie sur de tels attributs.

## Attributs Data et ARIA {#Attributs-data-et-aria}

Comme auparavant, React vous permet de passer librement les attributs `data-` et `aria-`:

```js
<div data-foo="42" />
<button aria-label="Fermer" onClick={onClose} />
```

Cela n'a pas changé.

[L'accessibilité](/docs/accessibility.html) est très importante, donc même si React 16 transmet tous les attributs, il valide toujours que les accessoires `aria-` aient des noms corrects en mode développement, tout comme React 15.

## Chemin de migration {#chemin-de-migration}

Nous avons inclus [un avertissement concernant les attributs inconnus](/warnings/unknown-prop.html) depuis [React 15.2.0](https://github.com/facebook/react/releases/tag/v15.2.0) qui est paru il y a plus d'un an. La grande majorité des bibliothèques tierces ont déjà mis à jour leur code. Si votre application ne génère pas d'avertissements avec React 15.2.0 ou une version ultérieure, ce changement ne devrait pas nécessiter de modifications dans votre code.

Si vous envoyez accidentellement des propriétés non-DOM aux composants du DOM, avec React 16, vous commencerez à voir ces attributs dans le DOM, comme par exemple:

```js
<div myData='[Object object]' />
```

D'une certaine manière c'est peu risqué (le navigateur les ignorera) mais nous vous recommandons de corriger ces cas lorsque vous les voyez. Un danger potentiel est possible si vous passez un objet qui implémente une méthode personnalisée `toString ()` ou `valueOf ()` qui retourne. Un autre problème possible est que les attributs HTML hérités comme `align` et `valign` seront désormais transmis au DOM. Ils étaient auparavant enlevés parce que React ne les prenait pas en charge.

Pour éviter ces problèmes, nous vous suggérons de corriger les avertissements que vous voyez dans React 15 avant de passer à React 16.

## Changements dans les détails {#changements-dans-les-details}

Nous avons apporté quelques autres modifications pour rendre le comportement plus prévisible et vous aider à vous assurer que vous ne commettez pas d'erreurs. Il n'est pas prévu que ces changements risquent de perturber les applications du monde réel.

**Ces modifications n'affectent que les composants DOM comme `<div>`, pas vos propres composants.**

En voici une liste détaillée.

* **Attributs inconnus avec chaîne, nombre et valeurs d'objet:**  

    ```js
    <div mycustomattribute="valeur" />
    <div mycustomattribute={42} />
    <div mycustomattribute={monObjet} />
    ```

    React 15: montre un avertissement et les ignore.
    React 16: convertit les valeurs en chaînes et les transmet.

    *Remarque: les attributs commençant par `on` ne sont pas transmis comme exception, car cela pourrait devenir une faille de sécurité potentielle.*

* **Attributs connus avec un nom canonique React différent:**  

    ```js
    <div tabindex="-1" />
    <div class="salut" />
    ```

    React 15: montre un avertissement et les ignore.
    React 16: montre un avertissement mais convertit les valeurs en chaînes et les transmet.

    *Remarque: utilisez toujours la dénomination canonique React pour tous les attributs pris en charge.*

* **Attributs non booléens avec des valeurs booléennes:**  

    ```js
    <div className={false} />
    ```

    React 15: convertit les booléens en chaînes et les fait passer.
    React 16: montre un avertissement et les ignore.

* **Attributs non événementiels avec des fonctions comme valeur:**  

    ```js
    <div className={function() {}} />
    ```

    React 15: convertit les fonctions en chaînes et les fait passer.
    React 16: montre un avertissement et les ignore.

* **Attributs avec des valeurs de symbole:**

    ```js
    <div className={Symbol('foo')} />
    ```

    React 15: plante.  
    React 16: montre un avertissement et les ignore.

* **Attributs avec des valeurs `NaN`:**

    ```js
    <div tabIndex={0 / 0} />
    ```

    React 15: convertit les `NaN` en chaînes et les fait passer.  
    React 15: convertit les `NaN` en chaînes et les fait passer avec un avertissement.

While testing this release, we have also [created an automatically generated table](https://github.com/facebook/react/blob/master/fixtures/attribute-behavior/AttributeTableSnapshot.md) for all known attributes to track potential regressions.

## Try It! {#try-it}

You can try the change in [this CodePen](https://codepen.io/gaearon/pen/gxNVdP?editors=0010).  
It uses React 16 RC, and you can [help us by testing the RC in your project!](https://github.com/facebook/react/issues/10294)

## Thanks {#thanks}

This effort was largely driven by [Nathan Hunzaker](https://github.com/nhunzaker) who has been a [prolific outside contributor to React](https://github.com/facebook/react/pulls?q=is:pr+author:nhunzaker+is:closed).

You can find his work on this issue in several PRs over the course of last year: [#6459](https://github.com/facebook/react/pull/6459), [#7311](https://github.com/facebook/react/pull/7311), [#10229](https://github.com/facebook/react/pull/10229), [#10397](https://github.com/facebook/react/pull/10397), [#10385](https://github.com/facebook/react/pull/10385), and [#10470](https://github.com/facebook/react/pull/10470).

Major changes in a popular project can take a lot of time and research. Nathan demonstrated perseverance and commitment to getting this change through, and we are very thankful to him for this and other efforts.

We would also like to thank [Brandon Dail](https://github.com/aweary) and [Jason Quense](https://github.com/jquense) for their invaluable help maintaining React this year.

## Future Work {#future-work}

We are not changing how [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements) work in React 16, but there are [existing discussions](https://github.com/facebook/react/issues/7249) about setting properties instead of attributes, and we might revisit this in React 17. Feel free to chime in if you'd like to help!
