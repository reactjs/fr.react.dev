---
title: "<progress>"
---

<Intro>

Le  [composant natif `<progress>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/progress) vous permet d'afficher un indicateur de progression (généralement sous forme d'une barre).

```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `<progress>` {/*progress*/}

Pour afficher un indicateur de progression, utilisez le [composant natif`<progress>` du navigateur](https://developer.mozilla.org/fr/docs/Web/HTML/Element/progress).

```js
<progress value={0.5} />
```

[Voir plus d'exemples ci-dessous](#usage).

#### Props {/*props*/}

`<progress>` prend en charge toutes les [props communes aux éléments](/reference/react-dom/components/common#props).

En complément, `<progress>` prend en charge les props suivantes :

* [`max`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/progress#max) : un nombre. Spécifie la `value` maximale. Par défaut `1`.
* [`value`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/progress#value) : un nombre entre `0` et `max`, ou `null` pour indiquer une progression indéterminée. Spécifie le taux de progression accomplie.

---

## Utilisation {/*usage*/}

### Contrôler un indicateur de progression {/*controlling-a-progress-indicator*/}

Utilisez un composant `<progress>` pour afficher un indicateur de progression.  Vous pouvez passer une `value` numérique entre `0` et la valeur `max` que vous auriez précisée.  Si vous ne passez pas de valeur `max`, celle-ci est supposée valoir `1` par défaut.

Si l'opération n'est pas en cours, ou que sa progression n'est pas déterminable, passez `value={null}` pour que l'indicateur de progression reflète cet état indéterminé.

<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>
