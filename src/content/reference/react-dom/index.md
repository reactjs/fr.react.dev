---
title: API React DOM intégrées
---

<Intro>

Le module `react-dom` contient des méthodes qui ne sont prises en charge que pour les applications web (qui tournent dans un environnement DOM de navigateur).  Elles ne sont pas prises en charge pour React Native.

</Intro>

---

## API {/*apis*/}

Ces API peuvent être importées depuis vos composants.  On les utilise rarement :

* [`createPortal`](/reference/react-dom/createPortal) vous permet d'afficher des composants enfants dans une autre partie de l'arbre du DOM.
* [`flushSync`](/reference/react-dom/flushSync) vous permet de forcer React à traiter les mises à jour d'état en attente, puis à mettre à jour le DOM de façon synchrone.

---

## Points d'entrée {/*entry-points*/}

Le module `react-dom` fournit deux points d'entrée supplémentaires :

* [`react-dom/client`](/reference/react-dom/client) contient les API pour afficher des composants React côté client (dans le navigateur).
* [`react-dom/server`](/reference/react-dom/server) contient les API pour produire le HTML des composants React côté serveur.

---

## API dépréciées {/*deprecated-apis*/}

<Deprecated>

Ces API seront retirées d'une future version majeure de React.

</Deprecated>

<<<<<<< HEAD
* [`findDOMNode`](/reference/react-dom/findDOMNode) trouve le nœud DOM le plus proche associé à une instance de composant à base de classe.
* [`hydrate`](/reference/react-dom/hydrate) monte une arborescence dans le DOM créé à partir du HTML serveur.  Elle est remplacée par la plus récente [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* [`render`](/reference/react-dom/render) monte une arborescence dans le DOM. Elle est remplacée par [`createRoot`](/reference/react-dom/client/createRoot).
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) démonte une arborescence du DOM. Elle est remplacée par [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount).
=======
* [`findDOMNode`](/reference/react-dom/findDOMNode) finds the closest DOM node corresponding to a class component instance.
* [`hydrate`](/reference/react-dom/hydrate) mounts a tree into the DOM created from server HTML. Deprecated in favor of [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* [`render`](/reference/react-dom/render) mounts a tree into the DOM. Deprecated in favor of [`createRoot`](/reference/react-dom/client/createRoot).
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) unmounts a tree from the DOM. Deprecated in favor of [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount).

>>>>>>> a472775b7c15f41b21865db1698113ca49ca95c4
