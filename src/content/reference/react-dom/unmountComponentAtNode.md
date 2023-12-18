---
title: unmountComponentAtNode
---

<Deprecated>

Cette API sera retirée d'une future version majeure de React.

React 18 a remplacé `unmountComponentAtNode` par [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount).

</Deprecated>

<Intro>

`unmountComponentAtNode` retire un composant React monté du DOM.

```js
unmountComponentAtNode(domNode)
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `unmountComponentAtNode(domNode)` {/*unmountcomponentatnode*/}

Appelez `unmountComponentAtNode` pour retirer un composant React monté du DOM et nettoyer ses gestionnaires d'événements et son état.

```js
import { unmountComponentAtNode } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);

unmountComponentAtNode(domNode);
```

[Voir d'autres exemples ci-dessous](#usage).

#### Paramètres {/*parameters*/}

* `domNode` : un [élément DOM](https://developer.mozilla.org/docs/Web/API/Element). React retirera le composant React monté à partir de cet élément.

#### Valeur renvoyée {/*returns*/}

`unmountComponentAtNode` renvoie `true` si un composant a été démonté, ou `false` dans le cas contraire.

---

## Utilisation {/*usage*/}

Appelez `unmountComponentAtNode` pour retirer un <CodeStep step={1}>composant React monté</CodeStep> à partir d'un <CodeStep step={2}>nœud DOM du navigateur</CodeStep> et nettoyer ses gestionnaires d'événements et son état.

```js [[1, 5, "<App />"], [2, 5, "rootNode"], [2, 8, "rootNode"]]
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const rootNode = document.getElementById('root');
render(<App />, rootNode);

// ...
unmountComponentAtNode(rootNode);
```


### Retirer une appli React d'un élément DOM {/*removing-a-react-app-from-a-dom-element*/}

Vous souhaiterez occasionnellement « saupoudrer » du React dans une page existante, ou une page qui n'est pas intégralement écrite en React. Dans de tels cas, vous pourriez avoir besoin « d'arrêter » une appli React en retirant toute son interface utilisateur (UI), son état et ses gestionnaires d'événements du nœud DOM dans lequel elle avait été affichée.

Dans l'exemple ci-dessous, cliquez sur « Afficher l'appli React » pour… afficher l'appli React.  Cliquez sur « Démonter l'appli React » pour la détruire :

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>Mon appli</title></head>
  <body>
    <button id='render'>Afficher l’appli React</button>
    <button id='unmount'>Démonter l’appli React</button>
    <!-- Voici le nœud de l'appli React -->
    <div id='root'></div>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const domNode = document.getElementById('root');

document.getElementById('render').addEventListener('click', () => {
  render(<App />, domNode);
});

document.getElementById('unmount').addEventListener('click', () => {
  unmountComponentAtNode(domNode);
});
```

```js src/App.js
export default function App() {
  return <h1>Salut tout le monde !</h1>;
}
```

</Sandpack>
