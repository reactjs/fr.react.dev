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

## API de préchargement de ressources {/*resource-preloading-apis*/}

Ces API peuvent être utilisées pour accélérer vos applis en préchargeant des ressources telles que les scripts, feuilles de style et fontes dès que vous savez que vous en aurez besoin, par exemple avant de naviguer sur une autre page qui utilisera ces ressources.

[Les frameworks basés sur React](/learn/start-a-new-react-project) s'occupent fréquemment pour vous du chargement des ressources, de sorte que vous n'aurez peut-être pas besoin d'appeler ces API vous-même.  Consultez la documentation de votre framework pour en savoir plus à ce sujet.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) vous permet de précharger l'adresse IP d'un nom de domaine DNS auquel vous anticipez une connexion.
* [`preconnect`](/reference/react-dom/preconnect) vous permet de vous connecter à un serveur en vue d'y charger des ressources par la suite, même si vous ne savez pas encore exactement lesquelles.
* [`preload`](/reference/react-dom/preload) vous permet de charger une feuille de styles, une fonte, une image ou un script externe dont vous anticipez l'utilisation.
* [`preloadModule`](/reference/react-dom/preloadModule) vous permet de charger un module ESM en vue de son utilisation imminente.
* [`preinit`](/reference/react-dom/preinit) vous permet de charger et d'évaluer un script tiers ou de charger et insérer une feuille de style.
* [`preinitModule`](/reference/react-dom/preinitModule) vous permet de charget et évaluer un module ESM.

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

* [`findDOMNode`](/reference/react-dom/findDOMNode) trouve le nœud DOM le plus proche associé à une instance de composant à base de classe.
* [`hydrate`](/reference/react-dom/hydrate) monte une arborescence dans le DOM créé à partir du HTML serveur.  Elle est remplacée par la plus récente [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).
* [`render`](/reference/react-dom/render) monte une arborescence dans le DOM. Elle est remplacée par [`createRoot`](/reference/react-dom/client/createRoot).
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) démonte une arborescence du DOM. Elle est remplacée par [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount).
