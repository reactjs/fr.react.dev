---
id: concurrent-mode-adoption
title: Adopter le mode concurrent (expérimental)
permalink: docs/concurrent-mode-adoption.html
prev: concurrent-mode-patterns.html
next: concurrent-mode-reference.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

> Attention
>
> Cette page décrit **des fonctionnalités expérimentales qui [ne sont pas encore disponibles](/docs/concurrent-mode-adoption.html) dans une version stable**. Ne vous basez pas sur les builds expérimentaux de React pour vos applis en production. Ces fonctionnalités sont susceptibles d’évoluer de façon significative et sans avertissement avant d’intégrer officiellement React.
>
> Cette documentation est destinée aux personnes curieuses ou habituées à adopter les nouvelles technologies très tôt. **Si vous débutez en React, ne vous préoccupez pas de ces fonctionnalités** : vous n’avez pas besoin de les apprendre pour le moment.

</div>

- [Installation](#installation)
  - [À qui s’adresse cette version expérimentale ?](#who-is-this-experimental-release-for)
  - [Activer le mode concurrent](#enabling-concurrent-mode)
- [À quoi s’attendre ?](#what-to-expect)
  - [Étape de migration : le mode bloquant](#migration-step-blocking-mode)
  - [Pourquoi tant de modes ?](#why-so-many-modes)
  - [Comparaison des fonctionnalités](#feature-comparison)

## Installation {#installation}

Le mode concurrent est disponible uniquement dans les [builds expérimentaux](/blog/2019/10/22/react-release-channels.html#experimental-channel) de React. Pour les installer, exécutez :

```
npm install react@experimental react-dom@experimental
```

**Les builds expérimentaux n’offrent aucune des garanties de la gestion sémantique des versions.**  Nous sommes susceptibles d’ajouter, modifier ou retirer des API dans n’importe quelle version `@experimental`.

**Les versions expérimentales rompront souvent la compatibilité ascendante.**

Vous pouvez essayer ces builds sur des projets personnels ou dans une branche, mais nous déconseillons leur utilisation en production. Chez Facebook, nous les utilisons *effectivement* en production, mais uniquement parce que nous sommes à même d’en corriger les bugs immédiatement. Vous voilà averti·e !

### À qui s’adresse cette version expérimentale ? {#who-is-this-experimental-release-for}

Cette version est surtout destinée aux personnes habituées à adopter les nouvelles technologies très tôt, aux mainteneurs de bibliothèques et, de façon plus générale, aux personnes curieuses.

Nous utilisons ce code en production (et ça fonctionne pour nous) mais il reste quelques bugs, des fonctionnalités manquantes, et des lacunes dans la documentation. Nous sommes avides de vos retours sur ce qui casse en mode concurrent, afin que nous puissions mieux le préparer pour sa sortie prochaine au sein d’une version stable.

### Activer le mode concurrent {#enabling-concurrent-mode}

En temps normal, quand nous ajoutons des fonctionnalités à React, vous pouvez vous en servir immédiatement. Les fragments, les Contextes ou même les Hooks sont autant d’exemples récents. Vous pouvez les utiliser dans du nouveau code sans avoir à changer quoi que ce soit au code existant.

Il en va différemment pour le mode concurrent. Il introduit des changements sémantiques dans le fonctionnement de React. Si ce n’était pas le cas, les [nouvelles fonctionnalités](/docs/concurrent-mode-patterns.html) qu’il permet *ne seraient pas possibles*. C’est pourquoi nous les avons regroupées dans un « mode » au lieu de les sortir, une à une, en isolation.

Vous  ne pouvez pas activer le mode concurrent seulement pour une partie de l’arborescence React. Au lieu de ça, pour l’activer, vous devez le faire à l’endroit où, aujourd’hui, vous appelez `ReactDOM.render()`.

**Voici comment activer le mode concurrent pour toute l’arborescence de `<App />` :**

```js
import ReactDOM from 'react-dom';

// Si vous aviez auparavant :
//
// ReactDOM.render(<App />, document.getElementById('root'));
//
// Vous pouvez désormais activer le mode concurrent en écrivant :

ReactDOM.createRoot(
  document.getElementById('root')
).render(<App />);
```

> Remarque
>
> Les API du mode concurrent, telles que `createRoot`, n’existent que dans les builds expérimentaux de React.

En mode concurrent, les méthodes de cycle de vie qui étaient [auparavant désignées](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html) comme « dangereuses » *(“unsafe”, NdT)* sont *effectivement* dangereuses, et peuvent entraîner des bugs encore plus souvent que dans le code React habituel. Nous vous déconseillons de tester le mode concurrent tant que votre appli n’est pas compatible avec le [mode strict](https://reactjs.org/docs/strict-mode.html).

## À quoi s’attendre ? {#what-to-expect}

Si vous avez une grosse appli existante, ou si votre appli dépend de nombreux modules tiers, ne vous attendez pas à pouvoir utiliser le mode concurrent immédiatement. **Par exemple, chez Facebook nous utilisons le mode concurrent sur le nouveau site web, mais nous n’avons pas l’intention de l’activer sur l’ancien site.**  C’est parce que notre ancien site utilise encore de nombreuses méthodes de cycle de vie classées dangereuses, dans son code produit comme dans des bibliothèques tierces, ainsi que diverses approches qui ne fonctionnent pas bien avec le mode concurrent.

L’expérience nous indique que la manière la plus simple de fonctionner en mode concurrent, c’est d’avoir du code qui utilise des approches React idiomatiques et ne repose pas sur des solutions externes de gestion de l’état. Dans les prochaines semaines, nous documenterons séparément les problèmes courants que nous avons rencontrés et leurs solutions.

### Étape de migration : le mode bloquant {#migration-step-blocking-mode}

Le mode concurrent est sans doute une fausse bonne idée pour les bases de code anciennes. C’est pourquoi nous fournissons aussi un nouveau « mode bloquant » dans nos builds expérimentaux. Vous pouvez l’essayer en remplaçant `createRoot` par `createBlockingRoot`. Il ne fournit qu’un *petit sous-ensemble* des fonctionnalités du mode concurrent, mais il est plus proche de la façon dont React fonctionne aujourd’hui et peut vous faciliter la transition.

En résumé :

* **Mode historique :** `ReactDOM.render(<App />, rootNode)`. C’est le fonctionnement actuel de React. Nous n’avons pas l’intention de retirer le mode historique dans un avenir proche, mais il ne prendra pas en charge ces nouvelles fonctionnalités.
* **Mode bloquant :** `ReactDOM.createBlockingRoot(rootNode).render(<App />)`. Il est expérimental pour le moment. Il est pensé comme une première étape de migration pour les applis qui veulent bénéficier d’au moins certaines fonctionnalités du mode concurrent.
* **Mode concurrent :** `ReactDOM.createRoot(rootNode).render(<App />)`. Il est expérimental pour le moment. À l’avenir, une fois qu’il sera stabilisé, nous comptons en faire le mode par défaut de React. Ce mode active *toutes* les nouvelles fonctionnalités.

### Pourquoi tant de modes ? {#why-so-many-modes}

Nous estimons qu’il est préférable de proposer une [stratégie de migration graduelle](/docs/faq-versioning.html#commitment-to-stability) plutôt que de faire d’énormes ruptures de compatibilité ascendante—qui scléroseraient React jusqu’à le rendre hors-sujet.

En pratique, nous pensons que la plupart des applis utilisant aujourd’hui le mode historique devraient pouvoir migrer vers au moins le mode bloquant (voire le mode concurrent). Cette fragmentation peut être irritante pour les bibliothèques qui essaient de prendre en charge l’ensemble des modes sur le court terme. Toutefois, éloigner progressivement l’écosystème du mode historique va aussi *résoudre* des problèmes qui affectent des bibliothèques de premier plan dans l’écosystème React, telles que [des comportements déroutants de Suspense lorsqu’on lit la mise en page](https://github.com/facebook/react/issues/14536) et [le manque de garanties stables de traitement par lot](https://github.com/facebook/react/issues/15080). Un certain nombre de bugs ne peuvent pas être corrigés en mode historique, sans changement de sémantique, mais n’existent pas dans les modes bloquant et concurrent.

Pensez au mode bloquant comme à une version en « gracieusement dégradée » du mode concurrent. **Résultat, sur le long terme nous devrions pouvoir converger et totalement cesser de nous préoccuper des différents modes.**  Mais pour le moment, les modes constituent une importante stratégie de migration. Ils permettent à chacun·e de décider si la migration vaut le coup, et de réaliser la mise à jour à leur propre rythme.

### Comparaison des fonctionnalités {#feature-comparison}

<style>
  #feature-table table { border-collapse: collapse; }
  #feature-table th { padding-right: 30px; }
  #feature-table tr { border-bottom: 1px solid #eee; }
</style>

<div id="feature-table">

|                                                                                                       | Mode histo. | Mode bloquant | Mode concurrent |
| ----------------------------------------------------------------------------------------------------- | ----------- | ------------- | --------------- |
| [Refs de type string](/docs/refs-and-the-dom.html#legacy-api-string-refs)                             | ✅           | 🚫**          | 🚫**            |
| [API historique de Contexte](/docs/legacy-context.html)                                               | ✅           | 🚫**          | 🚫**            |
| [`findDOMNode`](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)                    | ✅           | 🚫**          | 🚫**            |
| [`Suspense`](/docs/concurrent-mode-suspense.html#what-is-suspense-exactly)                            | ✅           | ✅             | ✅               |
| [`SuspenseList`](/docs/concurrent-mode-patterns.html#suspenselist)                                    | 🚫          | ✅             | ✅               |
| Suspense côté serveur + Hydratation                                                                   | 🚫          | ✅             | ✅               |
| Hydratation progressive                                                                               | 🚫          | ✅             | ✅               |
| Hydratation sélective                                                                                 | 🚫          | 🚫            | ✅               |
| Multitâches coopératif                                                                                | 🚫          | 🚫            | ✅               |
| Regroupement automatique de multiples `setState`                                                      | 🚫*         | ✅             | ✅               |
| [Rendu basé sur priorités](/docs/concurrent-mode-patterns.html#splitting-high-and-low-priority-state) | 🚫          | 🚫            | ✅               |
| [Prérendu interruptible](/docs/concurrent-mode-intro.html#interruptible-rendering)                    | 🚫          | 🚫            | ✅               |
| [`useTransition`](/docs/concurrent-mode-patterns.html#transitions)                                    | 🚫          | 🚫            | ✅               |
| [`useDeferredValue`](/docs/concurrent-mode-patterns.html#deferring-a-value)                           | 🚫          | 🚫            | ✅               |
| [« Train » de révélations de Suspense](/docs/concurrent-mode-patterns.html#suspense-reveal-train)     | 🚫          | 🚫            | ✅               |

</div>

\* : le mode historique regroupe automatiquement les événements gérés par React, mais il est limité à une tâche navigateur. Les événements non-React doivent le demander explicitement en appelant `unstable_batchedUpdates`. Dans les modes bloquant et concurrent, tous les `setState`s sont traités par lot par défaut.

\*\* : affiche des avertissements en développement.
