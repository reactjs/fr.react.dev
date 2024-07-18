---
title: "Hooks fournis par React DOM"
---

<Intro>

Le module `react-dom` contient les Hooks qui ne sont pris en charge que dans des applications web (qui ne tournent que dans un environnement DOM navigateur). Ces Hooks ne sont pas pris en charge dans des environnements hors-navigateur tels que les applications iOS, Android ou Windows. Si vous cherchez les Hooks pris en charge dans les navigateurs *et les autres environnements*, consultez la [page des Hooks React](/reference/react). La page où vous vous trouvez liste quant à elle tous les Hooks du module `react-dom`.

</Intro>

---

## Hooks de formulaires {/*form-hooks*/}

<Canary>

Les Hooks de formulaires ne sont actuellement disponibles que sur les canaux de livraison Canary et Expérimental de React. Apprenez-en davantage sur [les canaux de livraison React](/community/versioning-policy#all-release-channels).

</Canary>

Les *formulaires* vous permettent de créer des contrôles interactifs pour envoyer des informations.  Pour gérer les formulaires dans vos composants, utilisez l'un des Hooks suivants :

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) vous permet de mettre à jour l'UI sur base de l'état d'un formulaire.

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useActionState(increment, 0);
  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Compteur : {count}</button>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      Envoyer
    </button>
  );
}
```
