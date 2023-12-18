---
title: createPortal
---

<Intro>

`createPortal` vous permet d'afficher certains enfants dans une partie différente du DOM.

```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `createPortal(children, domNode, key?)` {/*createportal*/}

Pour créer un portail, appelez `createPortal`, en passant du JSX et le nœud DOM où il doit être affiché :

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>Cet enfant est placé dans la div parente.</p>
  {createPortal(
    <p>Cet enfant est placé dans le corps du document.</p>,
    document.body
  )}
</div>
```

[Voir plus d'exemples ci-dessous](#usage).

Un portail ne change que l'emplacement physique du nœud DOM. Pour tous les autres aspects, le JSX que vous placez dans un portail agit comme un nœud enfant du composant React qui l'affiche. Par exemple, l'enfant peut accéder au contexte fourni par l'arbre parent, et les événements remontent des enfants vers les parents selon l'arbre React.

#### Paramètres {/*parameters*/}

* `children` : quelque chose qui peut être affiché avec React, comme un morceau de JSX (par exemple `<div />` ou `<SomeComponent />`), un [Fragment](/reference/react/Fragment) (`<>...</>`), une chaîne de caractères ou un nombre, ou un tableau de tout ça.

* `domNode`: un nœud DOM, comme ceux retournés par `document.getElementById()`. Le nœud doit déjà exister. Passer un nœud DOM différent lors d'une mise à jour entraînera la recréation du contenu du portail.

* `key` **optionnelle** : une chaîne de caractères ou un nombre, unique, à utiliser comme [clé](/learn/rendering-lists/#keeping-list-items-in-order-with-key) du portail.

#### Valeur renvoyée {/*returns*/}

`createPortal` renvoie un nœud React qui peut être inclus dans le JSX ou renvoyé par un composant React. Si React le voit dans la sortie de l'affichage, il placera les `children` fournis à l'intérieur du `domNode` fourni.

#### Limitations {/*caveats*/}

* Les événements des portails se propagent en suivant l'arbre React, plutôt que l'arbre du DOM. Par exemple, si vous cliquez à l'intérieur d'un portail, et que le portail est situé dans une `<div onClick>`, ce gestionnaire `onClick` sera déclenché. Si ça pose des problèmes, arrêtez la propagation de l'événement à l'intérieur du portail, ou déplacez le portail lui-même plus haut dans l'arbre React.

---

## Utilisation {/*usage*/}

### Afficher dans une partie différente du DOM {/*rendering-to-a-different-part-of-the-dom*/}

Les *portails* permettent à vos composants d'afficher certains de leurs enfants dans un endroit différent du DOM. Ça permet à une partie de votre composant de « s'échapper » de tous les conteneurs dans lesquels elle peut se trouver. Par exemple, un composant peut afficher une boîte de dialogue modale ou une infobulle qui apparaît au-dessus et en-dehors du reste de la page.

Pour créer un portail, affichez le résultat de `createPortal` avec <CodeStep step={1}>du JSX</CodeStep> et le <CodeStep step={2}>nœud DOM où il doit aller</CodeStep> :

```js [[1, 8, "<p>Cet enfant est placé dans le corps du document.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Cet enfant est placé dans la div parente.</p>
      {createPortal(
        <p>Cet enfant est placé dans le corps du document.</p>,
        document.body
      )}
    </div>
  );
}
```

React placera les nœuds DOM résultant du <CodeStep step={1}>JSX que vous avez passé</CodeStep> à l'intérieur du <CodeStep step={2}>nœud DOM que vous avez fourni</CodeStep>.

Sans portail, le second `<p>` serait placé à l'intérieur de la `<div>` parente, mais le portail l'a "téléporté" dans le [`document.body`](https://developer.mozilla.org/fr/docs/Web/API/Document/body) :

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Cet enfant est placé dans la div parente.</p>
      {createPortal(
        <p>Cet enfant est placé dans le corps du document.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

Observez comment le second paragraphe apparaît visuellement en-dehors de la `<div>` parente avec la bordure. Si vous inspectez la structure du DOM avec les outils de développement, vous verrez que le second `<p>` a été placé directement dans le `<body>` :

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>Cet enfant est placé dans la div parente.</p>
      </div>
    ...
  </div>
  <p>Cet enfant est placé dans le corps du document.</p>
</body>
```

Un portail ne change que l'emplacement physique du nœud DOM. Pour tous les autres aspects, le JSX que vous placez dans un portail agit comme un nœud enfant du composant React qui l'affiche. Par exemple, l'enfant peut accéder au contexte fourni par l'arbre parent, et les événements remontent des enfants vers les parents selon l'arbre React.

---

### Afficher une boîte de dialogue modale avec un portail {/*rendering-a-modal-dialog-with-a-portal*/}

Vous pouvez utiliser un portail pour créer une boîte de dialogue modale qui flotte au-dessus du reste de la page, même si le composant qui appelle la boîte de dialogue est à l'intérieur d'un conteneur avec `overflow: hidden` ou d'autres styles qui interfèrent avec la boîte de dialogue.

Dans cet exemple, les deux conteneurs ont des styles qui perturbent la boîte de dialogue modale, mais celui qui est affiché *via* un portail n'est pas affecté car, dans le DOM, la boîte de dialogue modale n'est pas contenue dans les éléments JSX parents.

<Sandpack>

```js src/App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js src/NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Afficher la modale sans portail
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js src/PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Afficher la modale avec un portail
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js src/ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>Je suis une boîte de dialogue modale</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```


```css src/styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position:  absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

Il est important de s'assurer que votre application est accessible lors de l'utilisation de portails. Par exemple, vous devrez peut-être gérer le focus du clavier afin que l'utilisateur puisse déplacer le focus dans et hors du portail de manière naturelle.

Suivez les [bonnes pratiques WAI-ARIA de création de modales](https://www.w3.org/WAI/ARIA/apg/#dialog_modal) lors de la création de modales. Si vous utilisez un module communautaire, assurez-vous qu'il est accessible et qu'il suit ces directives.

</Pitfall>

---

### Afficher des composants React dans un balisage non-React issu du serveur {/*rendering-react-components-into-non-react-server-markup*/}

Les portails peuvent vous être utiles si votre racine React n'est qu'une partie d'une page statique ou produite côté serveur qui n'est pas construite avec React. Par exemple, si votre page est construite avec un framework côté serveur comme Rails, vous pouvez créer des zones d'interactivité dans des emplacements statiques telles que des barres latérales. Par rapport à l'utilisation de [plusieurs racines React séparées](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react), les portails vous permettent de traiter l'application comme un seul arbre React avec un état partagé, même si ses parties sont  affichées dans différentes parties du DOM.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>Mon appli</title></head>
  <body>
    <h1>Bienvenue dans mon appli hybride</h1>
    <div class="parent">
      <div class="sidebar">
        Ceci est un balisage serveur n'appartenant pas à React.
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>Cette partie est affichée par React</p>;
}

function SidebarContent() {
  return <p>Cette partie est aussi affichée par React !</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### Afficher des composants React dans des nœuds DOM qui ne sont pas gérés par React {/*rendering-react-components-into-non-react-dom-nodes*/}

Vous pouvez aussi utiliser un portail pour gérer le contenu d'un nœud DOM géré en-dehors de React. Par exemple, supposons que vous intégriez un widget de carte réalisé sans React et que vous souhaitiez afficher du contenu React dans une *popup*. Pour ce faire, déclarez une variable d'état `popupContainer` pour stocker le nœud DOM dans lequel vous allez effectuer l'affichage :

```js
const [popupContainer, setPopupContainer] = useState(null);
```

Lorsque vous créez le widget tiers, stockez le nœud DOM renvoyé par le widget afin de pouvoir y afficher du contenu par la suite :

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

Ça vous permet d'utiliser `createPortal` pour afficher du contenu React dans `popupContainer` une fois qu'il est disponible :

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Bonjour depuis React !</p>,
      popupContainer
    )}
  </div>
);
```

Voici un exemple complet avec lequel vous pouvez jouer :

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
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

```js src/App.js
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>Bonjour depuis React !</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>
