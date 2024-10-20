---
title: act
---

<Intro>

`act` est un utilitaire de test pour appliquer les mises à jour React en attente avant d'exécuter vos assertions.

```js
await act(async actFn)
```

</Intro>

Pour préparer un composant à vos assertions, enrobez le code qui en fait le rendu et exécute des mises à jour par un appel `await act()`.  Votre test aura ainsi un comportement plus proche du véritable fonctionnement de React au sein d'un navigateur.

<Note>

Vous estimerez peut-être que le recours direct à `act()` est un peu verbeux.  Pour éviter en partie ce code générique, vous pourriez utiliser une bibliothèque telle que [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), dont les utilitaires s'appuient déjà sur `act()`.

</Note>


<InlineToc />

---

## Référence {/*reference*/}

### `await act(async actFn)` {/*await-act-async-actfn*/}

Lors de l'écriture de tests pour votre interface utilisateur (UI), des tâches telles que le rendu, les événements utilisateurs ou le chargement de données sont considérées comme des « unités » d'interaction avec l'interface.  React fournit un utilitaire appelé `act()` pour garantir que les mises à jour liées à ces « unités » ont bien été traitées et appliquées au DOM avant que vous n'exécutiez vos assertions.

Le nom `act` vient de l'approche [Arrange-Act-Assert](https://wiki.c2.com/?ArrangeActAssert).

```js {2,4}
it ('renders with button disabled', async () => {
  await act(async () => {
    root.render(<TestComponent />)
  });
  expect(container.querySelector('button')).toBeDisabled();
});
```

<Note>

Nous conseillons d'utiliser `act` avec un `await` dans une fonction `async`.  Même si la version synchrone fonctionne dans de nombreux cas, elle ne couvre pas tous les scénarios ; en raison de la façon dont React planifie les mises à jour en interne, il est difficile de prédire si vous pouvez utiliser la version synchrone sans risque.

Nous déprécierons puis retirerons la version synchrone à l'avenir.

</Note>

#### Paramètres {/*parameters*/}

* `async actFn` : une fonction asynchrone qui enrobe les rendus et interactions avec le composant que vous allez tester.  Toute mise à jour déclenchée au sein de `actFn` est ajoutée à une file interne dédiée, qui est déroulée d'un bloc pour traitement, et ses résultats appliqués au DOM.  Dans la mesure où elle est asynchrone, React pourra exécuter tout code asynchrone et appliquer les mises à jour qui en résultent.

#### Valeur renvoyée {/*returns*/}

`act` ne renvoie rien.

## Utilisation {/*usage*/}

Lors de tests d'un composant, vous pouvez utiliser `act` pour exprimer des assertions sur le résultat.

Par exemple, disons que vous avez le composant `Counter` suivant, les exemples d'utilisation ci-dessous illustreront comment le tester :

```js
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(prev => prev + 1);
  }

  useEffect(() => {
    document.title = `Vous avez cliqué ${this.state.count} fois`;
  }, [count]);

  return (
    <div>
      <p>Vous avez cliqué {this.state.count} fois</p>
      <button onClick={this.handleClick}>
        Cliquez ici
      </button>
    </div>
  )
}
```

### Faire le rendu de composants dans nos tests {/*rendering-components-in-tests*/}

Pour tester le résultat du rendu d'un composant, enrobez son rendu dans `act()` :

```js  {10,12}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it('can render and update a counter', async () => {
  container = document.createElement('div');
  document.body.appendChild(container);

  // ✅ Fait le rendu du composant au sein d'un `act()`.
  await act(() => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Vous avez cliqué 0 fois');
  expect(document.title).toBe('Vous avez cliqué 0 fois');
});
```

Dans ce code, nous créons un conteneur, l'ajoutons au document, puis faisons le rendu du composant `Counter` au sein d'un appel `act()`. Ça garantit que le composant a bien été rendu et ses Effets appliqués avant de passer aux assertions.

Le recours à `act()` garantit que toute mise à jour a bien été appliquée avant d'exécuter nos assertions.

### Déclencher des événements dans nos tests {/*dispatching-events-in-tests*/}

Pour tester les événements, enrobez leur déclenchement dans `act()` :

```js {14,16}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it.only('can render and update a counter', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  await act( async () => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });
  
  // ✅ Déclenchement d'événement dans `act()`.
  await act(async () => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Vous avez cliqué 1 fois');
  expect(document.title).toBe('Vous avez cliqué 1 fois');
});
```

Dans ce code, nous faisons le rendu dans `act()`, puis nous déclenchons un événement dans un autre `act()`.  Ça garantit que toutes les mises à jour qu'aura entraînées l'événement ont bien été appliquées avant de passer aux assertions.

<Pitfall>

N'oubliez pas que le déclenchement d'événements DOM ne fonctionne que si le conteneur DOM est bien ajouté au document. Vous pouvez utiliser une bibliothèque telle que [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) pour alléger ce code.

</Pitfall>

## Dépannage {/*troubleshooting*/}

### J'ai une erreur : "The current testing environment is not configured to support act"(...)" {/*error-the-current-testing-environment-is-not-configured-to-support-act*/}

Le recours à `act` nécessite un réglage `global.IS_REACT_ACT_ENVIRONMENT=true` dans votre environnement de test.  Ça permet de garantir que `act` n'est utilisé que dans un environnement adapté.

Si vous n'avez pas défini cette globale, vous obtiendrez l'erreur suivante :

<ConsoleBlock level="error">

Warning: The current testing environment is not configured to support act(...)

</ConsoleBlock>

_(« Avertissement : l'environnement de test actuel n'est pas configuré pour prendre en charge act(...) », NdT)_

Pour la corriger, ajouter le code suivant dans le fichier de mise en place globale de vos tests React :

```js
global.IS_REACT_ACT_ENVIRONMENT=true
```

<Note>

Les bibliothèques telles que [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) s'assurent que `IS_REACT_ACT_ENVIRONMENT` est déjà défini pour vous.

</Note>
