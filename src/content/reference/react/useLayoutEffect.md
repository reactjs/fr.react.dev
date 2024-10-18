---
title: useLayoutEffect
---

<Pitfall>

`useLayoutEffect` peut nuire aux performances. Préférez autant que possible [`useEffect`](/reference/react/useEffect).

</Pitfall>

<Intro>

`useLayoutEffect` est une version de [`useEffect`](/reference/react/useEffect) qui est déclenchée avant que le navigateur ne rafraîchisse l'affichage.

```js
useLayoutEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `useLayoutEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Appelez `useLayoutEffect` pour effectuer des mesures de mise en page avant que la navigateur ne rafraîchisse l'affichage à l'écran :

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```


[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `setup` : la fonction contenant la logique de votre Effet.  Votre fonction de mise en place peut par ailleurs renvoyer une fonction de *nettoyage*.  Quand votre composant sera ajouté au DOM, React exécutera votre fonction de mise en place.  Après chaque nouveau rendu dont les dépendances ont changé, React commencera par exécuter votre fonction de nettoyage (si vous en avez fourni une) avec les anciennes valeurs, puis exécutera votre fonction de mise en place avec les nouvelles valeurs.  Une fois votre composant retiré du DOM, React exécutera votre fonction de nettoyage une dernière fois.

* `dependencies` **optionnelles** : la liste des valeurs réactives référencées par le code de `setup`.  Les valeurs réactives comprennent les props, les variables d'état et toutes les variables et fonctions déclarées localement dans le corps de votre composant.  Si votre *linter* est [configuré pour React](/learn/editor-setup#linting), il vérifiera que chaque valeur réactive concernée est bien spécifiée comme dépendance.  La liste des dépendances doit avoir un nombre constant d'éléments et utiliser un littéral défini à la volée, du genre `[dep1, dep2, dep3]`. React comparera chaque dépendance à sa valeur précédente au moyen de la comparaison [`Object.is`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is).  Si vous omettez cet argument, votre Effet sera re-exécuté après chaque rendu du composant.

#### Valeur renvoyée {/*returns*/}

`useLayoutEffect` renvoie `undefined`.

#### Limitations {/*caveats*/}

* `useLayoutEffect` est un Hook, vous pouvez donc uniquement l’appeler **à la racine de votre composant** ou de vos propres Hooks. Vous ne pouvez pas l’appeler à l’intérieur de boucles ou de conditions. Si nécessaire, extrayez un nouveau composant et déplacez l'Effet dans celui-ci.

* Quand le Mode Strict est activé, React **appellera une fois de plus votre cycle mise en place + nettoyage, uniquement en développement**, avant la première mise en place réelle.  C'est une mise à l'épreuve pour vérifier que votre logique de nettoyage reflète bien votre logique de mise en place, et décommissionne ou défait toute la mise en place effectuée.  Si ça entraîne des problèmes, [écrivez une fonction de nettoyage](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development).

* Si certaines de vos dépendances sont des objets ou fonctions définies au sein de votre composant, il existe un risque qu'elles **entraînent des exécutions superflues de votre Effet**.  Pour corriger ça, retirez les dépendances superflues sur des [objets](#removing-unnecessary-object-dependencies) et [fonctions](#removing-unnecessary-function-dependencies).  Vous pouvez aussi [extraire les mises à jour d'état](#updating-state-based-on-previous-state-from-an-effect) et la [logique non réactive](#reading-the-latest-props-and-state-from-an-effect) hors de votre Effet.

* Les Effets **ne sont exécutés que côté client**.  Ils sont ignorés lors du rendu côté serveur.

* Le code dans `useLayoutEffect` et toutes les mises à jour d'état qui y sont demandées **empêchent le navigateur de rafraîchir l'affichage à l'écran**. Si vous l'utilisez trop, ça ralentira votre appli.  Autant que possible, préférez [`useEffect`](/reference/react/useEffect).

* Si vous déclenchez une mise à jour d'état au sein d'un `useLayoutEffect`, React exécutera immédiatement tous les Effets restants, y compris les `useEffect`.

---

## Utilisation {/*usage*/}

### Mesurer la mise en page avant que le navigateur ne rafraîchisse l'écran {/*measuring-layout-before-the-browser-repaints-the-screen*/}

La plupart des composants n'ont pas besoin de connaître leur position ou leurs dimensions à l'écran pour déterminer ce qu'ils affichent.  Ils renvoient simplement du JSX, après quoi le navigateur calcule leur *mise en page* (position et taille) et rafraîchit l'écran.

Parfois cependant, ça ne suffit pas.  Imaginez une infobulle qui doit apparaître à côté d'un élément quand on survole ce dernier.  S'il y a suffisamment de place, l'infobulle devrait apparaître au-dessus de l'élément, mais si c'est trop étroit, elle devrait apparaître en dessous.  Pour afficher l'infobulle dans la bonne position d'entrée de jeu, vous aurez besoin de connaître sa hauteur (afin de déterminer si elle tiendra au-dessus).

Pour y parvenir, vous devrez faire un rendu en deux temps :

1. Faire le rendu de l'infobulle n'importe où (même dans la mauvaise position).
2. Mesurer sa hauteur et décider où la placer.
3. Faire *à nouveau* le rendu de l'infobulle au bon endroit.

**Tout ça doit se passer avant que le navigateur ait rafraîchi l'affichage.**  Vous ne voulez surtout pas que l'utilisateur voie l'infobulle se déplacer.  Appelez `useLayoutEffect` pour mesurer la mise en page avant le rafraîchissement de l'écran :

```js {5-8}
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // Vous ne connaissez pas encore sa hauteur

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // Refaire un rendu maintenant que vous connaissez la véritable hauteur
  }, []);

  // ...utilisez tooltipHeight dans la logique de rendu qui suit...
}
```

Voici comment ça fonctionne, étape par étape :

1. `Tooltip` fait un premier rendu avec `tooltipHeight = 0` (du coup l'infobulle est peut-être mal positionnée).
2. React met tout ça dans le DOM et exécute le code dans `useLayoutEffect`.
3. Votre `useLayoutEffect` [mesure la hauteur](https://developer.mozilla.org/fr/docs/Web/API/Element/getBoundingClientRect) du contenu de l'infobulle et déclenche immédiatement un nouveau rendu.
4. `Tooltip` refait son rendu avec la véritable hauteur dans `tooltipHeight` (du coup l'infobulle est correctement positionnée).
5. React met à jour le DOM, et le navigateur peut enfin afficher l'infobulle.

Survolez les boutons ci-dessous pour voir de quelle façon l'infobulle ajuste sa position en fonction de la place dont elle dispose :

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Cette infobulle ne tient pas au-dessus du bouton.
            <br />
            C’est pourquoi elle s’affiche en dessous !
          </div>
        }
      >
        Survolez-moi (infobulle en dessous)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Cette infobulle tient au-dessus du bouton.</div>
        }
      >
        Survolez-moi (infobulle au-dessus)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Cette infobulle tient au-dessus du bouton.</div>
        }
      >
        Survolez-moi (infobulle au-dessus)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Hauteur mesurée de l’infobulle : ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Ça ne tient pas au-dessus, donc on la place en dessous.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Remarquez que même si le composant `Tooltip` a besoin de faire un rendu en deux temps (une première fois avec `tooltipHeight` initialisée à `0`, puis avec la véritable hauteur mesurée), vous ne voyez que le résultat final. C'est pourquoi vous devez utiliser `useLayoutEffect` plutôt que [`useEffect`](/reference/react/useEffect) dans cet exemple. Examinons les différences en détails ci-dessous.

<Recipes titleText="useLayoutEffect vs. useEffect" titleId="examples">

#### `useLayoutEffect` empêche le navigateur de rafraîchir l'affichage {/*uselayouteffect-blocks-the-browser-from-repainting*/}

React garantit que le code au sein de `useLayoutEffect` et toutes les mises à jour d'état qui y sont demandées seront traités **avant que le navigateur ne rafraîchisse l'affichage à l'écran**.  Ça vous permet de faire un rendu de l'infobulle, la mesurer, et refaire un rendu de l'infobulle sans que l'utilisateur puisse remarquer le premier rendu supplémentaire.  En d'autres termes, `useLayoutEffect` empêche le navigateur de rafraîchir l'affichage.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Cette infobulle ne tient pas au-dessus du bouton.
            <br />
            C’est pourquoi elle s’affiche en dessous !
          </div>
        }
      >
        Survolez-moi (infobulle en dessous)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Cette infobulle tient au-dessus du bouton.</div>
        }
      >
        Survolez-moi (infobulle au-dessus)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Cette infobulle tient au-dessus du bouton.</div>
        }
      >
        Survolez-moi (infobulle au-dessus)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Elle ne tient pas au-dessus, donc on la place en dessous.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

<Solution />

#### `useEffect` ne bloque pas le navigateur {/*useeffect-does-not-block-the-browser*/}

Voici le même exemple, mais en utilisant [`useEffect`](/reference/react/useEffect) plutôt que `useLayoutEffect`. Si vous êtes sur un appareil un peu lent, vous remarquerez peut-être un « vacillement » occasionnel de l'infobulle, qui s'affichera d'abord brièvement à sa position initiale avant d'opter pour la position appropriée.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Cette infobulle ne tient pas au-dessus du bouton.
            <br />
            C’est pourquoi elle s’affiche en dessous !
          </div>
        }
      >
        Survolez-moi (infobulle en dessous)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Cette infobulle tient au-dessus du bouton.</div>
        }
      >
        Survolez-moi (infobulle au-dessus)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Cette infobulle tient au-dessus du bouton.</div>
        }
      >
        Survolez-moi (infobulle au-dessus)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Elle ne tient pas au-dessus, donc on la place en dessous.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Pour vous permettre de reproduire le bug plus facilement, la version ci-dessous introduit un retard artificiel lors du rendu.  React laissera le navigateur rafraîchir l'affichage avant de traiter les mises à jour d'état demandées au sein du `useEffect`.  Résultat, l'infobulle vacille :

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Cette infobulle ne tient pas au-dessus du bouton.
            <br />
            C’est pourquoi elle s’affiche en dessous !
          </div>
        }
      >
        Survolez-moi (infobulle en dessous)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Cette infobulle tient au-dessus du bouton.</div>
        }
      >
        Survolez-moi (infobulle au-dessus)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Cette infobulle tient au-dessus du bouton.</div>
        }
      >
        Survolez-moi (infobulle au-dessus)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // Ce code ralentit artificiellement le rendu
  let now = performance.now();
  while (performance.now() - now < 100) {
    // On glande pendant un court moment...
  }

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Elle ne tient pas au-dessus, donc on la place en dessous.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Modifiez maintenant cet exemple pour utiliser `useLayoutEffect` (pensez à ajuster l'import), et constatez qu'il empêche le rafraichissement même si le rendu est ralenti.

<Solution />

</Recipes>

<Note>

Faire un rendu en deux temps et bloquer le navigateur nuit aux performances.  Essayez d'éviter ça autant que possible.

</Note>

---

## Dépannage {/*troubleshooting*/}

### J'ai une erreur : “`useLayoutEffect` does nothing on the server” {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

*(« `useLayoutEffect` ne fait rien côté serveur », NdT)*

L'objectif de `useLayoutEffect` consiste à permettre à votre composant [d'utiliser des infos de mise en page pour son rendu](#measuring-layout-before-the-browser-repaints-the-screen) :

1. Faire le rendu initial
2. Mesurer la mise en page *avant que le navigateur ne rafraîchisse l'écran*.
3. Faire le rendu final en utilisant les infos de mise en page obtenues.

Lorsque vous ou votre framework utilisez le [rendu côté serveur](/reference/react-dom/server), votre appli React produit du HTML côté serveur pour le rendu initial.  Ça permet d'afficher ce HTML initial avant que le code JavaScript ne soit chargé.

Le problème est que côté serveur, il n'y a aucune information de mise en page.

Dans [l'exemple précédent](#measuring-layout-before-the-browser-repaints-the-screen), l'appel à `useLayoutEffect` dans le composant `Tooltip` lui permet de se positionner correctement (au-dessus ou en dessous du contenu), en fonction de la hauteur de son contenu.  Si vous tentiez d'afficher `Tooltip` au sein du HTML initial produit par le serveur, il serait impossible d'en déterminer la hauteur.  Côté serveur, il n'y a pas encore de mise en page !  Du coup, même si vous en faites le rendu côté serveur, sa position « sursautera » côté client après que le JavaScript aura été chargé et exécuté.

En général, les composants qui reposent sur des infos de mise en page n'ont de toutes façons pas besoin d'être rendus côté serveur.  Par exemple, ça n'a probablement pas de sens d'afficher un `Tooltip` lors du rendu initial.  Il est déclenché par une interaction utilisateur.

Quoi qu'il en soit, si vous rencontrez ce problème, vous avez quelques options :

- Remplacez `useLayoutEffect` par [`useEffect`](/reference/react/useEffect).  Ça dit à React qu'il peut afficher le rendu initial sans bloquer le rafraîchissement (puisque le HTML d'origine deviendra visible avant que votre Effet ne soit exécuté).

- Vous pouvez aussi [indiquer que votre composant est réservé au côté client](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content).  Ça indique à React qu'il faudra en remplacer le contenu jusqu'au périmètre [`<Suspense>`](/reference/react/Suspense) le plus proche par un contenu de secours (par exemple un *spinner* ou un squelette structurel) pendant le rendu côté serveur.

- Vous pouvez encore ne faire le rendu d'un composant qui recourt à `useLayoutEffect` qu'après l'hydratation.  Maintenez un état booléen `isMounted` initialisé à `false`, que vous mettrez à `true` au sein d'un appel à `useEffect`.  Votre logique de rendu peut alors ressembler à `return isMounted ? <RealContent /> : <FallbackContent />`. Côté serveur et pendant l'hydratation, l'utilisateur verra le `FallbackContent` qui, lui, n'appellera pas `useLayoutEffect`. Puis React le remplacera par `RealContent` qui s'exécute côté client uniquement et pourra inclure des appels à `useLayoutEffect`.

- Si vous synchronisez votre composant avec un stockage de données extérieur et vous appuyez sur `useLayoutEffect` pour des raisons autres que la mesure de la mise en page, envisagez d'utiliser plutôt [`useSyncExternalStore`](/reference/react/useSyncExternalStore) qui, lui, [prend en charge le rendu côté serveur](/reference/react/useSyncExternalStore#adding-support-for-server-rendering).
