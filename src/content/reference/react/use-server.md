---
title: "'use server'"
canary: true
---

<Canary>

`'use server'` n'est utile que si vous [utilisez React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) ou créez une bibliothèque compatible avec eux.

</Canary>


<Intro>

`'use server'` marque les fonctions côté serveur qui peuvent être appelées par du code React côté client.

</Intro>

<InlineToc />

---

## Référence {/*reference*/}

### `'use server'` {/*use-server*/}

Ajoutez `'use server';` tout en haut d'une fonction asynchrone pour indiquer que cette fonction peut être appelée par du code côté client.

```js
async function addToCart(data) {
  'use server';
  // ...
}

// <ProductDetailPage addToCart={addToCart} />
```

Cette fonction peut être passée au client.  Lorsqu'elle est appelée par le client, elle fera un appel réseau au serveur en lui passant une copie sérialisée des arguments qu'elle a reçus.  Si la fonction serveur renvoie une valeur, celle-ci sera sérialisée et renvoyée au client.

Vous pouvez aussi utiliser `'use server';` tout en haut d'un fichier pour indiquer que tous les exports de ce fichier sont des fonctions serveur asynchrones qui peuvent être utilisées depuis n'importe où, y compris par import dans des fichiers de composants côté client.

#### Limitations {/*caveats*/}

* Gardez à l'esprit que les paramètres des fonctions marquées par `'use server'` sont entièrement contrôlés par le client.  Pour une meilleure sécurité, traitez-les toujours commes des entrées non vérifiées, et assurez-vous de les valider et d'en échapper le contenu lorsque nécessaire.
* Pour éviter toute confusion qui pourrait résulter du mélange entre codes côté client et côté serveur au sein d'un même fichier, `'use server'` ne peut être utilisée que dans des fichiers côté serveur. Les fonctions résultantes peuvent être passées à des composants côté client *via* leurs props.
* Puisque les appels réseaux sous-jacents sont intrinsèquement asynchrones, `'use server'` ne peut être utilisée que pour des fonctions asynchrones.
* Les directives telles que `'use server'` doivent être placées au tout début du fichier, au-dessus de tout import et de quelque autre code que ce soit (à l'exception des commentaires, qui peuvent apparaître avant).  Elles doivent utiliser des apostrophes (`'`) ou guillemets (`"`), pas des apostrophes inverses (<code>\`</code>). (Le format de directive `'use xyz'` n'est pas sans rappeler la convention de nommage `useXyz()` des Hooks, mais c'est là une simple coïncidence.)

## Utilisation {/*usage*/}

<Wip>

Cette section est incomplète. Consultez la [documentation Next.js des Server Components](https://beta.nextjs.org/docs/rendering/server-and-client-components).

</Wip>
