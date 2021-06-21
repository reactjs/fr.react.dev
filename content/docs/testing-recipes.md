---
id: testing-recipes
title: Recettes de test
permalink: docs/testing-recipes.html
prev: testing.html
next: testing-environments.html
---

Voici quelques approches courantes pour tester des composants React.

> Remarque
>
> Cette page suppose que vous utilisez [Jest](https://jestjs.io/) comme harnais de test.  Si vous utilisez un harnais différent, vous aurez peut-être besoin d’ajuster l’API, mais l’aspect général de la solution restera probablement inchangé.   Pour en apprendre davantage sur la mise en place d’un environnement de test, consultez la page [Environnements de test](/docs/testing-environments.html).

Dans cette page, nous utiliserons principalement des fonctions composants.  Ceci dit, ces stratégies de test sont découplées de ce genre de détail d’implémentation, et fonctionneront tout aussi bien pour des composants définis à base de classes.

- [Mise en place / nettoyage](#setup--teardown)
- [`act()`](#act)
- [Rendu](#rendering)
- [Chargement de données](#data-fetching)
- [Simuler des modules](#mocking-modules)
- [Événements](#events)
- [Horloges](#timers)
- [Capture d’instantanés](#snapshot-testing)
- [Moteurs de rendu multiples](#multiple-renderers)
- [Pas trouvé votre bonheur ?](#something-missing)

---

### Mise en place / nettoyage {#setup--teardown}

Pour chaque test, nous voulons habituellement réaliser le rendu d’un arbre React au sein d’un élément DOM attaché à `document`.  Ce dernier point est nécessaire pour que le composant puisse recevoir les événements du DOM.  Et lorsque le test se termine, nous voulons « nettoyer » et démonter l’arbre présent dans `document`.

Une façon courante de faire ça consiste à associer les blocks `beforeEach` et `afterEach` afin qu’il s’exécutent systématiquement autour de chaque test, ce qui permet d’en isoler les effets :

```jsx
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // met en place un élément DOM comme cible de rendu
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // nettoie en sortie de test
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
```

Vous utilisez peut-être une autre approche, mais gardez à l’esprit que vous voulez exécuter le nettoyage _même si un test échoue_.  Sinon, vos tests peuvent commencer à « fuire », et un test pourrait altérer par inadvertance le comportement d’un autre, ce qui complexifie beaucoup le débogage.

---

### `act()` {#act}

Lorsqu’on écrit des tests UI, des tâches comme le rendu lui-même, les événements utilisateurs ou encore le chargement de données peuvent être considérées comme autant « d’unités » d’interaction avec l’interface utilisateur.  `react-dom/test-utils` fournit une fonction utilitaire appelée [`act()`](/docs/test-utils.html#act) qui s’assure que toutes les mises à jour relatives à ces « unités » ont bien été traitées et appliquées au DOM avant que nous ne commencions à exprimer nos assertions :

```js
act(() => {
  // rendu des composants
});
// exécution des assertions
```

Ça nous aide à rapprocher nos tests du comportement que de véritables utilisateurs constateraient en utilisant notre application.  La suite de ces exemples utilise `act()` pour bénéficier de ces garanties.

Vous trouverez peut-être que le recours manuel à `act()` est rapidement un tantinet verbeux.  Pour vous épargner une bonne partie du code générique associé, vous pouvez opter pour une bibliothèque telle que [React Testing Library](https://testing-library.com/react), dont les utilitaires sont basés sur `act()`.

> Remarque
>
> Le terme `act` vient de l’approche [Arrange-Act-Assert](http://wiki.c2.com/?ArrangeActAssert).

---

### Rendu {#rendering}

Vous voudrez fréquemment vérifier que le rendu d’un composant est correct pour un jeu de props donné.  Prenons un composant simple qui affiche un message basé sur une prop :

```jsx
// hello.js

import React from "react";

export default function Hello(props) {
  if (props.name) {
    return <h1>Bonjour, {props.name} !</h1>;
  } else {
    return <span>Salut, étranger</span>;
  }
}
```

Nous pouvons écrire un test pour ce composant :

```jsx{24-27}
// hello.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // met en place un élément DOM comme cible de rendu
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // nettoie en sortie de test
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("s’affiche avec ou sans nom", () => {
  act(() => {
    render(<Hello />, container);
  });
  expect(container.textContent).toBe("Salut, étranger");

  act(() => {
    render(<Hello name="Jenny" />, container);
  });
  expect(container.textContent).toBe("Bonjour, Jenny !");

  act(() => {
    render(<Hello name="Margaret" />, container);
  });
  expect(container.textContent).toBe("Bonjour, Margaret !");
});
```

---

### Chargement de données {#data-fetching}

Au lieu d’appeler de véritables API dans tous vos tests, vous pouvez simuler les requêtes et renvoyer des données factices.  Simuler le chargement de données avec de « fausses » données évite de fragiliser les tests lors d’un back-end indisponible, et les accélère en prime.  Remarquez que vous voudrez peut-être qu’une petite partie de vos tests utilisent un framework [« de bout en bout »](/docs/testing-environments.html#end-to-end-tests-aka-e2e-tests) pour vérifier que l’appli dans son ensemble fonctionne bien.

```jsx
// user.js

import React, { useState, useEffect } from "react";

export default function User(props) {
  const [user, setUser] = useState(null);

  async function fetchUserData(id) {
    const response = await fetch("/" + id);
    setUser(await response.json());
  }

  useEffect(() => {
    fetchUserData(props.id);
  }, [props.id]);

  if (!user) {
    return "Chargement…";
  }

  return (
    <details>
      <summary>{user.name}</summary>
      <strong>{user.age}</strong> ans
      <br />
      vit à {user.address}
    </details>
  );
}
```

Nous pouvons écrire les tests associés :

```jsx{23-33,44-45}
// user.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import User from "./user";

let container = null;
beforeEach(() => {
  // met en place un élément DOM comme cible de rendu
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // nettoie en sortie de test
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("affiche les données utilisateur", async () => {
  const fakeUser = {
    name: "Joni Baez",
    age: "32",
    address: "123, Charming Avenue"
  };

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeUser)
    })
  );

  // Utilise la version asynchrone de `act` pour appliquer les promesses accomplies
  await act(async () => {
    render(<User id="123" />, container);
  });

  expect(container.querySelector("summary").textContent).toBe(fakeUser.name);
  expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
  expect(container.textContent).toContain(fakeUser.address);

  // retire la simulation pour assurer une bonne isolation des tests
  global.fetch.mockRestore();
});
```

---

### Simuler des modules {#mocking-modules}

Certains modules ne fonctionneront peut-être pas bien dans un environnement de test, ou ne seront pas essentiels au test en lui-même.  En simulant ces modules pour les remplacer par des versions factices, nous pouvons faciliter l’écriture des tests pour notre propre code.

Prenons un composant `Contact` qui intègre un composant tiers `GoogleMap` :

```jsx
// map.js

import React from "react";

import { LoadScript, GoogleMap } from "react-google-maps";
export default function Map(props) {
  return (
    <LoadScript id="script-loader" googleMapsApiKey="VOTRE_CLÉ_API">
      <GoogleMap id="example-map" center={props.center} />
    </LoadScript>
  );
}

// contact.js

import React from "react";
import Map from "./map";

export default function Contact(props) {
  return (
    <div>
      <address>
        Contacter {props.name} par{" "}
        <a data-testid="email" href={"mailto:" + props.email}>
          e-mail
        </a>
        ou sur son <a data-testid="site" href={props.site}>
          site web
        </a>.
      </address>
      <Map center={props.center} />
    </div>
  );
}
```

Si nous ne voulons pas charger ce composant tiers lors de nos tests, nous pouvons simuler la dépendance elle-même pour renvoyer un composant factice, et exécuter nos tests :

```jsx{10-18}
// contact.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Contact from "./contact";
import MockedMap from "./map";

jest.mock("./map", () => {
  return function DummyMap(props) {
    return (
      <div data-testid="map">
        {props.center.lat}:{props.center.long}
      </div>
    );
  };
});

let container = null;
beforeEach(() => {
  // met en place un élément DOM comme cible de rendu
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // nettoie en sortie de test
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("devrait afficher les infos de contact", () => {
  const center = { lat: 0, long: 0 };
  act(() => {
    render(
      <Contact
        name="Joni Baez"
        email="test@example.com"
        site="http://test.com"
        center={center}
      />,
      container
    );
  });

  expect(
    container.querySelector("[data-testid='email']").getAttribute("href")
  ).toEqual("mailto:test@example.com");

  expect(
    container.querySelector('[data-testid="site"]').getAttribute("href")
  ).toEqual("http://test.com");

  expect(container.querySelector('[data-testid="map"]').textContent).toEqual(
    "0:0"
  );
});
```

---

### Événements {#events}

Nous vous conseillons de déclencher de véritables événements DOM sur des éléments DOM, et de vérifier le résultat.  Prenez ce composant `Toggle` :

```jsx
// toggle.js

import React, { useState } from "react";

export default function Toggle(props) {
  const [state, setState] = useState(false);
  return (
    <button
      onClick={() => {
        setState(previousState => !previousState);
        props.onChange(!state);
      }}
      data-testid="toggle"
    >
      {state === true ? "Éteindre" : "Allumer"}
    </button>
  );
}
```

Nous pourrions le tester comme ceci :

```jsx{13-14,35,43}
// toggle.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Toggle from "./toggle";

let container = null;
beforeEach(() => {
  // met en place un élément DOM comme cible de rendu
  container = document.createElement("div");
  // `container` *doit* être attaché à `document` pour que les événements
  // fonctionnent correctement.
  document.body.appendChild(container);
});

afterEach(() => {
  // nettoie en sortie de test
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("change de valeur suite au clic", () => {
  const onChange = jest.fn();
  act(() => {
    render(<Toggle onChange={onChange} />, container);
  });

  // récupère l’élément bouton et déclenche quelques clics dessus
  const button = document.querySelector("[data-testid=toggle]");
  expect(button.innerHTML).toBe("Allumer");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(button.innerHTML).toBe("Éteindre");

  act(() => {
    for (let i = 0; i < 5; i++) {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });

  expect(onChange).toHaveBeenCalledTimes(6);
  expect(button.innerHTML).toBe("Allumer");
});
```

Les événements DOM disponibles et leurs propriétés sont décrits dans le [MDN](https://developer.mozilla.org/fr/docs/Web/API/MouseEvent).  Remarquez que vous devez passer `{ bubbles: true }` pour chaque événement créé afin qu’ils puissent atteindre l’écouteur de React, car React délègue automatiquement les événements au niveau racine du document.

> Remarque
>
> React Testing Library propose [une façon plus concise](https://testing-library.com/docs/dom-testing-library/api-events) de déclencher des événements.

---

### Horloges {#timers}

Votre code dépend peut-être de fonctions calées sur le temps telles que `setTimeout`, afin de planifier davantage de travail à l’avenir.  Dans l’exemple ci-après, un panneau de choix multiples attend une sélection puis avance, avec un timeout si la sélection ne survient pas dans les 5 secondes :

```jsx
// card.js

import React, { useEffect } from "react";

export default function Card(props) {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      props.onSelect(null);
    }, 5000);
    return () => {
      clearTimeout(timeoutID);
    };
  }, [props.onSelect]);

  return [1, 2, 3, 4].map(choice => (
    <button
      key={choice}
      data-testid={choice}
      onClick={() => props.onSelect(choice)}
    >
      {choice}
    </button>
  ));
}
```

Nous pouvons écrire les tests de ce composant en tirant parti de la [simulation d’horloges de Jest](https://jestjs.io/docs/en/timer-mocks) et en testant les différents états possibles.

```jsx{7,31,37,49,59}
// card.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Card from "./card";

jest.useFakeTimers();

let container = null;
beforeEach(() => {
  // met en place un élément DOM comme cible de rendu
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // nettoie en sortie de test
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("devrait sélectionner null à expiration", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  // avance dans le temps de 100ms
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // puis avance de 5 secondes
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).toHaveBeenCalledWith(null);
});

it("devrait nettoyer derrière lui lorsqu’il est retiré", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // démonte l’appli
  act(() => {
    render(null, container);
  });

  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).not.toHaveBeenCalled();
});

it("devrait accepter des sélections", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    container
      .querySelector("[data-testid='2']")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onSelect).toHaveBeenCalledWith(2);
});
```

Vous pouvez ne recourir à de fausses horloges que pour certains tests.  Ci-avant nous les avons activées en appelant `jest.useFakeTimers()`.   Le principal avantage réside dans le fait que votre test n’a pas besoin d’attendre effectivement cinq secondes pour s’exécuter, et vous n’avez pas eu besoin de complexifier le code de votre composant uniquement pour permettre ses tests.

---

### Capture d’instantanés {#snapshot-testing}

Les frameworks tels que Jest vous permettent aussi de sauvegarder des « instantanés » de données grâce à [`toMatchSnapshot` / `toMatchInlineSnapshot`](https://jestjs.io/docs/en/snapshot-testing). Avec elles, vous pouvez « sauver » la sortie de rendu d’un composant et vous assurer que toute modification qui lui sera apportée devra être explicitement confirmée en tant qu’évolution de l’instantané.

Dans l’exemple qui suit, nous affichons un composant et formatons le HTML obtenu grâce au module [`pretty`](https://www.npmjs.com/package/pretty), pour enfin le sauvegarder comme instantané en ligne :

```jsx{29-31}
// hello.test.js, à nouveau

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // met en place un élément DOM comme cible de rendu
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // nettoie en sortie de test
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("devrait afficher une salutation", () => {
  act(() => {
    render(<Hello />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* …rempli automatiquement par Jest… */

  act(() => {
    render(<Hello name="Jenny" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* …rempli automatiquement par Jest… */

  act(() => {
    render(<Hello name="Margaret" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* …rempli automatiquement par Jest… */
});
```

Il est généralement préférable de recourir à des assertions spécifiques plutôt qu’à des instantanés.  Ce type de tests inclut des détails d’implémentation qui les rendent particulièrement fragiles, entraînant une sorte d’anesthésie des équipes vis-à-vis des échecs de tests dus aux instantanés.  Une [simulation ciblée de composants enfants](#mocking-modules) peut vous aider à réduire la taille de vos instantanés et à les garder lisibles pour vos revues de code.

---

### Moteurs de rendu multiples {#multiple-renderers}

Dans de rares cas, vous pourrez vous retrouver à exécuter un test pour un composant qui, lui, recourt à plusieurs moteurs de rendu.  Par exemple, peut-être exécutez-vous des tests à base d’instantanés sur un composant en utilisant `react-test-renderer`, alors que sous le capot le composant utilise `ReactDOM.render` pour obtenir le contenu d’un composant enfant.  Dans un tel scénario vous pouvez enrober les mises à jour avec les appels aux fonctions `act()` des moteurs appropriés.

```jsx
import { act as domAct } from "react-dom/test-utils";
import { act as testAct, create } from "react-test-renderer";
// ...
let root;
domAct(() => {
  testAct(() => {
    root = create(<App />);
  });
});
expect(root).toMatchSnapshot();
```

---

### Pas trouvé votre bonheur ? {#something-missing}

Si nous avons oublié de couvrir un scénario courant, n’hésitez pas à nous en faire part sur notre [outil de suivi de tickets](https://github.com/reactjs/reactjs.org/issues) pour le site web de la documentation.
