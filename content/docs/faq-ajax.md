---
id: faq-ajax
title: AJAX et les API
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### Comment faire un appel AJAX ? {#how-can-i-make-an-ajax-call}

Vous pouvez utiliser n’importe quelle bibliothèque AJAX de votre choix avec React. Parmi les plus populaires, on trouve [Axios](https://github.com/axios/axios), [jQuery AJAX](https://api.jquery.com/jQuery.ajax/), et le standard [window.fetch](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API) intégré au navigateur.

### Où dois-je faire mon appel AJAX dans le cycle de vie du composant ? {#where-in-the-component-lifecycle-should-i-make-an-ajax-call}

Vous devriez obtenir vos données via des appels AJAX dans la méthode de cycle de vie [`componentDidMount`](/docs/react-component.html#mounting). De cette façon, vous pourrez y utiliser `setState` pour mettre à jour votre composant lorsque les données seront récupérées.

### Exemple : utiliser des résultats AJAX pour initialiser un état local {#example-using-ajax-results-to-set-local-state}

Le composant ci-dessous montre comment faire un appel AJAX dans `componentDidMount` pour peupler l'état local d'un composant.

Dans l'exemple, l'API renvoie un objet JSON avec la structure suivante :

```
{
  "items": [
    { "id": 1, "name": "Apples",  "price": "$2" },
    { "id": 2, "name": "Peaches", "price": "$5" }
  ]
}
```

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // Remarque : il est important de traiter les erreurs ici
        // au lieu d'utiliser un bloc catch(), pour ne pas passer à la trappe
        // des exceptions provenant de réels bugs du composant.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Erreur : {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Chargement…</div>;
    } else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.name}>
              {item.name} {item.price}
            </li>
          ))}
        </ul>
      );
    }
  }
}
```

Voici l’équivalent avec les [Hooks](/docs/hooks-intro.html) :

```js
function MyComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Remarque : le tableau vide de dépendances [] indique
  // que useEffect ne s’exécutera qu’une fois, un peu comme
  // componentDidMount()
  useEffect(() => {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.items);
        },
        // Remarque : il faut gérer les erreurs ici plutôt que dans
        // un bloc catch() afin que nous n’avalions pas les exceptions
        // dues à de véritables bugs dans les composants.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Erreur : {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Chargement...</div>;
  } else {
    return (
      <ul>
        {items.map(item => (
          <li key={item.name}>
            {item.name} {item.price}
          </li>
        ))}
      </ul>
    );
  }
}
```
