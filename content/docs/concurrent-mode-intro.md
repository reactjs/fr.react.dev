---
id: concurrent-mode-intro
title: Introduction au mode concurrent (expérimental)
permalink: docs/concurrent-mode-intro.html
next: concurrent-mode-suspense.html
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

Cette page fournit un aperçu théorique du mode concurrent. **Pour une introduction plus orientée vers la pratique, vous voudrez sans doute consulter les prochaines sections :**

* [Suspense pour le chargement de données](/docs/concurrent-mode-suspense.html) décrit un nouveau mécanisme de chargement de données distantes au sein de composants React.
* [Approches pour une UI concurrente](/docs/concurrent-mode-patterns.html) illustre quelques approches de conception d’UI rendues possibles par le mode concurrent et Suspense.
* [Adopter le mode concurrent](/docs/concurrent-mode-adoption.html) explique comment vous pouvez essayer le mode concurrent dans votre projet.
* [Référence de l’API du mode concurrent](/docs/concurrent-mode-reference.html) documente les nouvelles API disponibles dans les builds expérimentaux de React.

## Qu’est-ce que le mode concurrent ? {#what-is-concurrent-mode}

Le mode concurrent est un ensemble de nouvelles fonctionnalités qui aident les applis React à rester réactives et à s’adapter de façon fluide aux capacités et au débit réseau de l’appareil de l’utilisateur.

Ces fonctionnalités sont encore expérimentales et peuvent changer. Elles ne font pas encore partie d’une version stable de React, mais vous pouvez les essayer dès maintenant au moyen d’un build expérimental.

## Rendu bloquant vs. interruptible {#blocking-vs-interruptible-rendering}

**Pour expliquer le mode concurrent, nous allons utiliser la gestion de versions comme métaphore.**  Si vous travaillez en équipe, vous utilisez probablement un système de gestion de versions tel que Git, et travaillez sur des branches. Quand une branche est finalisée, vous pouvez en fusionner le travail dans `master` afin que d’autres puissent le récupérer.

Avant que la gestion de versions n’apparaisse, les flux de développement étaient très différents. On n’y trouvait aucun concept de branche. Si vous aviez besoin de modifier certains fichiers, il fallait prévenir tout le monde de ne pas y toucher pendant ce temps-là. Vous ne pouviez même pas commencer à travailler dessus en parallèle les uns des autres : vous étiez littéralement **bloqué·e** par l’autre personne.

Ce scénario illustre bien la façon dont les bibliothèques d’interface utilisateur (UI) fonctionnent généralement aujourd’hui. Une fois qu’elles démarrent le rendu d’une mise à jour, y compris la création de nouveaux nœuds DOM et l’exécution du code au sein des composants, elles ne peuvent pas être interrompues. Nous appelons cette approche le « rendu bloquant ».

Avec le mode concurrent, le rendu n’est pas bloquant : il est interruptible. Ça améliore l’expérience utilisateur, et en prime, ça ouvre la porte à de nouvelles fonctionnalités qui étaient impossibles jusque-là. Avant de nous pencher sur des exemples concrets dans les [prochaines](/docs/concurrent-mode-suspense.html) [sections](/docs/concurrent-mode-patterns.html), survolons rapidement ces nouvelles fonctionnalités.

### Rendu interruptible {#interruptible-rendering}

Prenez une liste de produits filtrable. Vous est-il déjà arrivé de taper dans le champ de filtrage pour ressentir un affichage saccadé à chaque touche pressée ?  Une partie du travail de mise à jour de la liste de produits est peut-être incontournable, telle que la création des nouveaux nœuds DOM ou la mise en page effectuée par le navigateur. En revanche, le *moment* d’exécution de ce travail et la *manière* dont il est exécuté jouent un rôle crucial.

Une manière courante de contourner ces saccades consiste à *“debouncer”* la saisie dans le champ. En lissant ainsi le traitement de la saisie, nous ne mettons à jour la liste *qu’après* que l’utilisateur·rice a cessé de saisir sa valeur. Cependant, il peut être frustrant de ne constater aucune mise à jour de l’UI lors de la frappe. On pourrait plutôt « ralentir » *(throttle, NdT)* la gestion de la saisie, et ne mettre à jour la liste qu’à hauteur d’une fréquence maximale définie. Mais sur des appareils de faible puissance nous constaterions toujours une saccade. Tant le *debouncing* que le *throttling* aboutissent à une expérience utilisateur sous-optimale.

La raison de cette saccade est simple : une fois que le rendu commence, il ne peut être interrompu. Ainsi le navigateur ne peut plus mettre à jour le texte dans le champ de saisie juste après que vous avez pressé une touche. Peu importent les scores mirifiques que votre bibliothèque UI (telle que React) obtient dans tel ou tel comparatif, si elle recourt à un rendu bloquant, à partir d’une certaine charge de travail sur vos composants vous obtiendrez toujours un affichage saccadé. Et la plupart du temps, il n’existe pas de correctif simple.

**Le mode concurrent corrige cette limitation fondamentale en utilisant un rendu interruptible.**  Ça signifie que lorsque l’utilisateur·rice presse une touche, React n’a pas besoin d’empêcher le navigateur de mettre à jour le champ de saisie. Il va plutôt laisser le navigateur afficher cette mise à jour, et continuer le rendu de la liste à jour *en mémoire*. Quand le rendu sera fini, React mettra à jour le DOM, et les modifications seront ainsi reflétées à l’écran.

Conceptuellement, vous pouvez imaginer que React prépare chaque mise à jour « sur une branche ». Tout comme vous êtes libre d’abandonner le travail d’une branche ou de passer d’une branche à l’autre, React en mode concurrent peut interrompre une mise à jour en cours afin de prioriser une tâche plus critique, puis revenir à ce qu’il était en train de faire. Cette technique n’est pas sans rappeler le [double buffering](https://fr.wikipedia.org/wiki/Multiple_buffering) des jeux vidéos.

Les techniques du mode concurrent réduisent le besoin de *debouncing* et de *throttling* dans l’UI. Le rendu étant interruptible, React n’a plus besoin de *différer* artificiellement du travail afin d’éviter les saccades. Il peut commencer le rendu immédiatement, et interrompre ce travail si nécessaire afin de préserver la réactivité de l’appli.

### Séquences de chargement intentionnelles {#intentional-loading-sequences}

Nous disions tout à l’heure que pour comprendre le mode concurrent, on peut imaginer que React travaille « sur une branche ». Les branches ne sont pas seulement utiles pour des correctifs à court terme, mais aussi pour des fonctionnalités plus longues à écrire. Parfois vous pouvez travailler sur une fonctionnalité qui va mettre des semaines avant d’être « assez finie » pour être fusionnée dans `master`. Ici aussi, la métaphore de la gestion de versions s’applique bien au rendu.

Imaginez que vous naviguiez entre deux écrans d’une appli. Parfois, nous n’aurons peut-être pas assez de code et de données pour afficher un état de chargement « assez fini » à l’utilisateur au sein du nouvel écran. Transiter vers un écran vide (ou doté d’un gros *spinner*) n’est pas une expérience agréable. Et pourtant, il arrive fréquemment que les chargements du code et des données nécessaires ne prennent en fait que peu de temps. **Ne serait-il pas plus agréable que React puisse rester sur l’ancien écran un tout petit peu plus longtemps, pour ensuite « sauter » l’état de « chargement désagréable » lors de la bascule vers le nouvel écran ?**

C’est certes possible aujourd’hui, mais au prix d’une orchestration délicate. Avec le mode concurrent, cette fonctionnalité est directement disponible. React commence à préparer le nouvel écran en mémoire d’abord—ou, pour revenir à notre métaphore, « sur une autre branche ». Ainsi, React peut attendre que davantage de contenu ait été chargé avant de mettre à jour le DOM. Avec le mode concurrent, nous pouvons dire à React de continuer à afficher l’ancien écran, pleinement interactif, avec peut-être un indicateur de chargement dans un coin. Et lorsque le nouvel écran est prêt, React peut nous y amener.

### Concurrence {#concurrency}

Résumons les deux exemples ci-avant pour voir comment le mode concurrent en unifie le traitement. **Avec le mode concurrent, React peut travailler à plusieurs mises à jour de l’état _en exécution concurrente_**, tout comme les branches permettent à divers membres d’une équipe de travailler indépendamment les uns des autres :

* Pour les mises à jour dépendantes du processeur (CPU, telles que la création des nœuds DOM et l’exécution du code des composants), la concurrence permet à une mise à jour plus urgente « d’interrompre » le rendu qui a déjà démarré.
* Pour les mises à jour dépendantes des entrées/sorties (I/O, telles que le chargement de code ou de données à partir du réseau), la concurrence permet à React de commencer le rendu en mémoire avant même que les données n’arrivent, et de sauter des états de chargement désagréables.

Ce qui est critique, c’est que la façon dont vous *utilisez* React reste inchangée. Les concepts tels que les composants, les props et l’état local continuent fondamentalement à marcher de la même façon. Quand vous voulez mettre à jour l’écran, vous ajustez l’état.

React utilise des heuristiques pour déterminer le degré « d’urgence » d’une mise à jour, et vous permet d’ajuster ces choix au moyen de quelques lignes de code pour aboutir à l’expérience utilisateur que vous souhaitez suite à chaque interaction.

## Bénéficier de la recherche dans la production {#putting-research-into-production}

Les fonctionnalités du mode concurrent ont toutes le même objectif. **Leur mission consiste à faire bénéficier de véritables UI des dernières trouvailles de la recherche en Interactions Humain-Machine.**

Par exemple, la recherche montre qu’afficher trop d’états de chargement intermédiaires lors d’une transition entre écrans entraîne un sentiment accru de *lenteur*. C’est pourquoi le mode concurrent n’affiche de nouveaux états de chargement que selon un « planning » fixe afin d’éviter des mises à jour trop fréquentes ou désagréables.

Dans le même esprit, la recherche nous dit que des interactions telles que le survol du pointeur ou la saisie de texte doivent être traitées dans un très court laps de temps, alors que les clics et les transitions de pages peuvent durer un peu plus longtemps sans pour autant sembler lentes. Les différentes « priorités » que le mode concurrent utilise en interne correspondent à peu près aux catégories d’interactions qu’on peut trouver dans la recherche en perception humaine.

Les équipes accordant une importance primordiale à l’expérience utilisateur résolvent parfois ce type de problème avec une solution *ad hoc*. Néanmoins, ces solutions survivent rarement à l’épreuve du temps, et sont difficiles à maintenir. Avec le mode concurrent, nous tentons de condenser les résultats de la recherche UI directement dans l’abstraction proposée par React, et d’en rendre l’utilisation idiomatique. React, en tant que bibliothèque UI, est bien placée pour ça.

## Prochaines étapes {#next-steps}

Vous savez désormais à quoi sert le mode concurrent !

Dans les prochaines pages, vous en apprendrez davantage sur des sujets plus spécifiques :

* [Suspense pour le chargement de données](/docs/concurrent-mode-suspense.html) décrit un nouveau mécanisme de chargement de données distantes au sein de composants React.
* [Approches pour une UI concurrente](/docs/concurrent-mode-patterns.html) illustre quelques approches de conception d’UI rendues possibles par le mode concurrent et Suspense.
* [Adopter le mode concurrent](/docs/concurrent-mode-adoption.html) explique comment vous pouvez essayer le mode concurrent dans votre projet.
* [Référence de l’API du mode concurrent](/docs/concurrent-mode-reference.html) documente les nouvelles API disponibles dans les builds expérimentaux de React.
