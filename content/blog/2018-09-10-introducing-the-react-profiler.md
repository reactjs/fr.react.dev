---
title: "Découvrez le profileur React"
author: [bvaughn]
---

React 16.5 prend en charge un nouveau plugin de profilage dans les DevTools.  Ce plugin utilise [l’API expérimentale de profileur](https://github.com/reactjs/rfcs/pull/51) de React pour collecter des données de chronologie sur chaque composant du rendu afin de repérer les goulots d’étranglement de performance dans les applications React.  Il sera totalement compatible avec les fonctionnalités à venir de [découpage temporel et Suspense](/blog/2018/03/01/sneak-peek-beyond-react-16.html).

Cet article couvre les sujets suivants :
* [Profiler une application](#profiling-an-application)
* [Lire les données de performance](#reading-performance-data)
  * [Parcourir les commits](#browsing-commits)
  * [Filtrer les commits](#filtering-commits)
  * [Graphique de flammes *(flame chart)*](#flame-chart)
  * [Graphique de classement](#ranked-chart)
  * [Graphique de composants](#component-chart)
  * [Interactions](#interactions)
* [Dépannage](#troubleshooting)
  * [Aucune donnée de profilage n’est enregistrée pour la racine sélectionnée](#no-profiling-data-has-been-recorded-for-the-selected-root)
  * [Aucune donnée de chronologie n’est affichable pour le commit sélectionné](#no-timing-data-to-display-for-the-selected-commit)
* [Présentation vidéo en profondeur](#deep-dive-video)

## Profiler une application {#profiling-an-application}

Les DevTools affichent désormais un onglet "Profiler" pour les applications prenant en charge la nouvelle API de profilage :

![Nouvel onglet “profiler” dans les Devtools](../images/blog/introducing-the-react-profiler/devtools-profiler-tab.png)

> Remarque
>
> `react-dom` 16.5+ prend en charge le profilage en mode DEV.
> Un bundle de production apte au profilage est également disponible : `react-dom/profiling`.
> Pour découvrir comment utiliser ce bundle, consultez [fb.me/react-profiling](https://fb.me/react-profiling)

Le panneau “Profiler” est initialement vide.  Cliquez sur le bouton d‘enregistrement pour commencer à profiler :

![Cliquez sur "Record" pour commencer à profiler](../images/blog/introducing-the-react-profiler/start-profiling.png)

Une fois que vous enregistrez, les DevTools collectent automatiquement les informations de performance à chaque rendu de l’application.  Utilisez votre appli comme d’habitude.  Quand vous souhaitez mettre un terme au profilage, cliquez sur le bouton “Stop”.

![Cliquez sur "Stop" quand vous avez fini de profiler](../images/blog/introducing-the-react-profiler/stop-profiling.png)

En supposant que votre application ait effectué au moins un rendu lors du profilage, les DevTools fourniront plusieurs manières de consulter les données de performance. Nous [explorons chacune d’elles ci-après](#reading-performance-data).

## Lire les données de performance {#reading-performance-data}

### Parcourir les commits {#browsing-commits}

Conceptuellement, React travaille en deux temps :

* La phase de **rendu** détermine quelles modifications doivent être effectuées, par exemple au DOM.  Durant cette phase, React appelle `render` et compare son résultat au rendu précédent.
* La phase de **commit** est celle où React applique les changements nécessaires. (Dans le cas de React DOM, c’est à ce moment-là que React insère, met à jour ou retire des nœuds DOM.)  React appelle également les méthodes de cycle de vie telles que `componentDidMount` et `componentDidUpdate` lors de cette phase.

Le profileur des DevTools regroupe les informations de performance par commit.  Les commits sont affichés dans un histogramme vers le haut du profileur :

![Histogramme des commits profilés](../images/blog/introducing-the-react-profiler/commit-selector.png)

Chaque barre du graphique représente un commit unique, celui actuellement sélectionné étant représenté en noir.  Vous pouvez cliquer sur une barre (ou utiliser les boutons fléchés à gauche et à droite) pour sélectionner un autre commit.

La couleur et la hauteur de chaque barre correspond à la durée du rendu de ce commit. (Les barres plus hautes et jaunes ont pris plus longtemps que les barres plus courtes et vertes.)

### Filtrer les commits {#filtering-commits}

Plus vous profilez longtemps, plus votre application accumulera de rendus.  Dans certains cas, vous pourriez vous retrouver avec _trop de commits_ pour que leur analyse reste aisée.  Le profileur vous permet de filtrer les commits pour y remédier.  Utilisez ce mécanisme pour préciser un seuil : le profileur masquera tous les commits dont l’exécution a pris _moins de temps_ que le seuil indiqué.

![Filtage des commits par durée d’exécution](../images/blog/introducing-the-react-profiler/filtering-commits.gif)

### Graphique de flammes *(flame chart)* {#flame-chart}

Le graphique de flammes *(flame chart, NdT)* représente l’état de votre application pour un commit donné.  Chaque barre du graphique représente un composant React (ex. `App`, `Nav`).  La taille et la couleur de la barre représente la durée de rendu du composant et de ses descendants.  (La largeur de la barre indique le temps passé _par le dernier rendu du composant_ et la couleur indique ce même temps _pour le commit sélectionné_.)

![Exemple de graphique de flammes](../images/blog/introducing-the-react-profiler/flame-chart.png)

> Remarque
>
> La largeur de la barre indique le temps pris par le dernier rendu en date du composant (et de ses descendants).  Si le composant n’a pas fait de rendu lors du commit courant, il s’agira du commit précédent.  Plus la barre est large, plus le rendu a pris longtemps.
>
> La couleur de la barre indique le temps pris par le rendu du composant (et de ses descendants) pour le commit sélectionné. Les composants jaunes ont pris plus de temps, les verts moins de temps, et les gris n’ont pas fait de rendu durant ce commit.

Par exemple, le rendu du commit illustré ci-avant a pris un total de 18,4ms. Le composant `Router` était le « plus lourd » à afficher (il a pris 18,4ms).  La majeure partie de ce temps était occupée par deux de ses enfants, `Nav` (8,4ms) et `Route` (7,9ms).  Le reste du temps était réparti entre ses enfants restants et le code interne de sa méthode `render`.

Vous pouvez (dé)zoomer dans un graphique de flammes en cliquant sur les composants :

![Cliquez sur un composant pour (dé)zoomer](../images/blog/introducing-the-react-profiler/zoom-in-and-out.gif)

Cliquer sur un composant le sélectionnera à la volée et affichera dans le panneau de droite des infos incluant ses `props` et `state` au moment du commit.  Explorez-les pour en déterminer ce que le composant affichait effectivement au moment du commit :

![Visualiser les props et l’état local d’un composant lors d’un commit](../images/blog/introducing-the-react-profiler/props-and-state.gif)

Dans certains cas, sélectionner un composant puis circuler entre les commits peut vous aider à comprendre _pourquoi_ le composant a refait un rendu :

![Voir les valeurs modifiées d’un commit à l’autre](../images/blog/introducing-the-react-profiler/see-which-props-changed.gif)

L’image ci-avant montre que `state.scrollOffset` a changé d’un commit à l’autre.  C’est sans doute pour ça que le composant `List` a refait un rendu.

### Graphique de classement {#ranked-chart}

La vue graphique de classement représente un commit unique.  Chaque barre du graphique représente un composant React (ex. `App`, `Nav`).  Le graphique trie les composants par ordre décroissant de temps de rendu, donc avec les composants les plus lents en haut.

![Exemple de graphique de classement](../images/blog/introducing-the-react-profiler/ranked-chart.png)

> Remarque
>
>Le temps de rendu d’un composant inclut celui du rendu de ses enfants, de sorte
>que les composants au rendu le plus long ont tendance à figurer vers le haut de
>l’arborescence.

Comme avec le graphique de flammes, vous pouvez (dé)zoomer dans le graphique de classement en cliquant sur les composants.

### Graphique de composants {#component-chart}

Il est parfois utile de savoir combien de fois un composant donné à refait son rendu pendant le profilage.  Le graphique de composants fournit cette information sous forme d’un histogramme.  Chaque barre du graphique représente un rendu du composant.  La couleur et la hauteur de chaque barre correspond au temps que ce rendu a pris _par rapport aux autres composants_ du commit sélectionné.

![Exemple de graphique de composants](../images/blog/introducing-the-react-profiler/component-chart.png)

Le graphique ci-avant indique que le composant `List` a fait 11 rendus au total. Il nous indique aussi qu’à chaque rendu, il était le composant le plus « lourd » de son commit (c’est-à-dire qu’il a pris le plus de temps).

Pour obtenir ce graphique, vous pouvez soit double-cliquer sur le composant, soit le sélectionner puis cliquer sur l’icône d’histogramme bleu dans le panneau de détails sur la droite.  Vous pouvez revenir au graphique précédent en cliquant sur le bouton “x” dans ce même panneau de détails.  Vous pouvez aussi double-cliquer sur une barre en particulier pour en apprendre davantage sur le commit en question.

![Comment voir tous les rendus d’un composant spécifique](../images/blog/introducing-the-react-profiler/see-all-commits-for-a-fiber.gif)

Si le composant sélectionné n’a pas fait de rendus lors de la session de profilage, le message suivant est affiché :

![Aucun temps de rendu pour le composant sélectionné](../images/blog/introducing-the-react-profiler/no-render-times-for-selected-component.png)

### Interactions {#interactions}

React a récemment ajouté une autre [API expérimentale](https://fb.me/react-interaction-tracing) pour pister la _cause_ d’une mise à jour. Les « Interactions » pistées par cette API sont aussi affichées par le profileur :

![Le panneau Interactions](../images/blog/introducing-the-react-profiler/interactions.png)

L’image ci-avant affiche une session de profilage qui a pisté quatre interactions.  Chaque ligne représente une interaction pistée.  Les points de couleur le long de la ligne représentent des commits en rapport avec cette interaction.

Vous pouvez aussi visualiser les interactions tracées pour un commit donné depuis le graphique de flammes ou le graphique de classement :

![Liste des interactions pour un commit](../images/blog/introducing-the-react-profiler/interactions-for-commit.png)

Vous pouvez naviguer entre les interactions et les commits en cliquant sur eux :

![Naviguer entre les interactions et les commits](../images/blog/introducing-the-react-profiler/navigate-between-interactions-and-commits.gif)

L’API de pistage est encore fraîche et nous la décrirons plus en détail dans un futur article.

## Dépannage {#troubleshooting}

### Aucune donnée de profilage n’est enregistrée pour la racine sélectionnée {#no-profiling-data-has-been-recorded-for-the-selected-root}

Si votre application a plusieurs « racines », vous verrez peut-être le message suivant après votre profilage :

![Aucune donnée de profilage n’est enregistrée pour la racine sélectionnée](../images/blog/introducing-the-react-profiler/no-profiler-data-multi-root.png)

Ce message signifie qu’aucune donnée de performance n’a été enregistrée pour la racine sélectionnée dans le panneau “Elements”.  Dans un tel cas, essayez de sélectionner une racine différente dans ce panneau pour visualiser les informations de profilage associées :

![Sélection d’une autre racine dans le panneau "Elements" pour en voir les données de performance](../images/blog/introducing-the-react-profiler/select-a-root-to-view-profiling-data.gif)

### Aucune donnée de chronologie n’est affichable pour le commit sélectionné {#no-timing-data-to-display-for-the-selected-commit}

Il peut arriver qu’un commit soit si rapide que `performance.now()` ne puisse pas fournir aux DevTools des données utiles.  Dans un tel cas, vous obtiendrez le message suivant :

![Aucune donnée de Chronologie à afficher pour le commit sélectionné](../images/blog/introducing-the-react-profiler/no-timing-data-for-commit.png)

## Présentation vidéo en profondeur {#deep-dive-video}

La vidéo qui suit (en anglais) illustre l’utilisation du profileur React pour détecter et résoudre des problèmes de performance sur une application React réelle.

<br>

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/nySib7ipZdk?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
