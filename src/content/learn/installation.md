---
title: Installation
---

<Intro>

React a été conçu dès le départ pour une adoption progressive.  Vous pouvez l'utiliser aussi légèrement ou largement que vous le souhaitez.  Que vous souhaitiez juste goûter à React, ajouter de l'interactivité à une page HTML, ou commencer une appli complexe basée React, cette section vous aidera à démarrer.

</Intro>

<YouWillLearn isChapter={true}>

* [Comment commencer un nouveau projet React](/learn/start-a-new-react-project)
* [Comment ajouter React à un projet existant](/learn/add-react-to-an-existing-project)
* [Comment configurer votre éditeur](/learn/editor-setup)
* [Comment installer les Outils de développement React](/learn/react-developer-tools)

</YouWillLearn>

## Essayer React {/*try-react*/}

Vous n'avez pas besoin d'installer quoi que ce soit pour jouer avec React.  Essayez de modifier ce bac à sable !

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Bonjour {name}</h1>;
}

export default function App() {
  return <Greeting name="tout le monde" />
}
```

</Sandpack>

Vous pouvez le modifier directement ou l'ouvrir dans un nouvel onglet en appuyant sur le bouton *“Fork”* dans le coin supérieur droit.

La plupart des pages de la documentation de React contiennent des bacs à sable comme celui-ci. Hors de la documentation de React, il existe de nombreux bacs à sable qui prennent en charge React, par exemple [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react) ou encore [CodePen](https://codepen.io/pen?template=QWYVwWN).

### Essayer React sur votre machine {/*try-react-locally*/}

Pour essayer React localement sur votre ordinateur, [téléchargez cette page HTML](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html). Ouvrez-la dans votre éditeur et dans votre navigateur !

## Démarrer un nouveau projet React {/*start-a-new-react-project*/}

Si vous souhaitez construire une appli ou un site entièrement avec React, [créez un nouveau projet React](/learn/start-a-new-react-project).

## Ajouter React à un projet existant {/*add-react-to-an-existing-project*/}

Si vous souhaitez essayer d'utiliser React dans une appli ou un site existants, [ajoutez React à un projet existant](/learn/add-react-to-an-existing-project).

## Et maintenant ? {/*next-steps*/}

Consultez notre guide de [démarrage rapide](/learn) pour un passage en revue des concepts les plus importants de React que vous manipulerez quotidiennement.
