---
id: design-principles
title: Principes de conception
layout: contributing
permalink: docs/design-principles.html
prev: implementation-notes.html
redirect_from:
  - "contributing/design-principles.html"
---

Nous avons écrit ce document afin que vous ayez une meilleure idée de la façon dont nous décidons ce que React fait et ne fait pas, et quelle est notre philosophie de développement. Bien que nous soyons enthousiasmés par les contributions de la communauté, il est peu probable que nous choisissions un chemin qui enfreint un ou plusieurs de ces principes.

> **Remarque**
>
> Ce document suppose une solide compréhension de React. Il décrit les principes de design de *React lui-même*, et non des composants ou des applications React.
>
> Pour une introduction à React, consultez plutôt [Thinking in React](/docs/thinking-in-react.html).

### Composition {#composition}

La caractéristique principale de React est la composition de composants. Les composants écrits par des personnes différentes doivent fonctionner correctement ensemble. Il est important pour nous que vous puissiez ajouter des fonctionnalités à un composant sans impacter la base de code.

Par exemple, il devrait être possible d'introduire un état local dans un composant sans changer les composants qui l'utilisent. De même, il devrait être possible d'ajouter du code d'initialisation et de démontage à n'importe quel composant, lorsque c'est nécessaire.

Il n'y a rien de « mauvais » à utiliser les méthodes d'état ou du cycle de vie dans les composants. Comme n'importe quelle fonctionnalité puissante, elles doivent être utilisées avec modération, mais nous n'avons aucune intention de les supprimer. Au contraire, nous pensons qu'elles font partie intégrante de ce qui rend React utile. Nous pourrions ajouter [d'autres modèles fonctionnels](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) (en anglais) à l'avenir, mais les méthodes d'état local et de cycle de vie feront partie de ce modèle.

Les composants sont souvent décrits comme de « simples fonctions » mais selon notre vision ils doivent être bien plus que ça pour être utiles. Dans React, les composants décrivent tout comportement composable, ce qui inclut le rendu, le cycle de vie et l'état. Certaines bibliothèques externes telles que [Relay](https://facebook.github.io/relay/) ajoutent d'autres responsabilités aux composants comme la description des dépendances de données. Il est possible que ces idées reviennent dans React sous une forme ou une autre.

### Abstraction courante {#common-abstraction}

En général, nous [refusons d'ajouter des fonctionnalités](https://www.youtube.com/watch?v=4anAwXYqLG8) (en anglais) pouvant être mises en œuvre par les utilisateurs. Nous ne voulons pas surcharger vos applications avec du code inutile. Il y a toutefois des exceptions à ça.

Par exemple, si React n'offrait pas de support pour les méthodes de l'état local ou du cycle de vie, les utilisateurs créeraient leurs propres abstractions personnalisées pour ça. Quand plusieurs abstractions s'affrontent, React ne peut forcer ni bénéficier des propriétés de l'une ou de l'autre. Il doit fonctionner avec le plus petit dénominateur commun.

C'est la raison pour laquelle nous ajoutons parfois des fonctionnalités directement à React. Si nous constatons que de nombreux composants implémentent une certaine fonctionnalité d'une façon incompatible ou inefficace, nous préférons peut-être l'intégrer à React. Nous ne le faisons pas à la légère. Lorsque nous le faisons, c'est parce que nous sommes convaincus qu'élever le niveau d'abstraction profite à l'ensemble de l'écosystème. L'état, les méthodes du cycle de vie ou la normalisation des événements des navigateurs en sont de bons exemples.

Nous discutons toujours de ces propositions d'amélioration avec la communauté. Vous pouvez trouver certaines de ces discussions avec l'étiquette [« big picture »](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"Type:+Big+Picture") sur le suivi des problèmes de React.

### Escape Hatches {#escape-hatches}

React est pragmatique. Il est dicté par les besoins des produits écrits chez Facebook. Bien qu'il soit influencé par certains paradigmes qui ne sont pas tout à fait populaires comme la programmation fonctionnelle, le rendre accessible à un large public de développeurs aux compétences et expériences variées est un objectif affiché du projet.

Si nous voulons déprécier un modèle que nous n'aimons pas, il est de notre responsabilité de considérer tous ses cas d'usage et d'[éduquer la communauté à propos des alternatives](/blog/2016/07/13/mixins-considered-harmful.html) avant de le déprécier. Si un modèle utile pour la création d'applications est difficile à exprimer de manière déclarative, nous lui [fournirons une API impérative](/docs/more-about-refs.html). Si nous ne parvenons pas à trouver l'API parfaite pour quelque chose que nous jugeons nécessaire dans de nombreuses applications, nous [fournissons une API temporaire de moindre qualité](/docs/legacy-context.html) s'il est possible de s'en débarrasser ultérieurement et qu'elle laisse la porte ouverte à de futures améliorations.

### Stabilité {#stability}

Nous accordons de l'importance la stabilité de l'API. Chez Facebook, nous avons plus de 50 mille composants utilisant React. De nombreuses autres sociétés, telles que [Twitter](https://twitter.com/) ou [Airbnb](https://www.airbnb.com/), sont également de grandes utilisatrices de React. C'est pour cela que nous sommes généralement réticents à changer les API ou les comportements publics.

Cependant, nous pensons que la stabilité au sens où « rien ne change » est surfaite. Ça se transforme vite en stagnation. Nous préférons plutôt la stabilité au sens « c'est fortement utilisé en production et lorsque quelque chose change, il existe un chemin de migration clair (et de préférence automatisé) ».

Lorsque nous déprécions un modèle, nous étudions son utilisation interne chez Facebook et nous ajoutons des avertissements de dépréciation. Ils nous permettent de mesurer l'impact du changement. Parfois nous renonçons quand nous voyons que c'est encore trop tôt, et nous réfléchissons de manière plus stratégique sur la façon de préparer les bases de code à ce changement.

Si nous sommes convaincus que le changement n'est pas trop disruptif et que la stratégie de migration est viable pour tous les cas d'usage, nous livrons les avertissements de dépréciation à la communauté open source. Nous sommes en contact étroit avec de nombreux utilisateurs de React en dehors de Facebook, nous surveillons les projets open source populaires et les aidons à corriger ces dépréciations.

Compte tenu de la taille même de la base de code React chez Facebook, la réussite de la migration en interne est généralement un bon indicateur du fait que les autres sociétés n'auront pas de problèmes non plus. Néanmoins, il arrive que des personnes nous signalent des cas d'usage auxquels nous n'avons pas pensé, et nous ajoutons alors des solutions de contournement pour eux ou repensons notre approche.

Nous ne déprécions rien sans une bonne raison. Nous reconnaissons que les avertissements de dépréciation sont parfois frustrants, mais nous les ajoutons car les dépréciations permettent de préparer le terrain à des améliorations ou de nouvelles fonctionnalités que la communauté et nous-mêmes estimons utiles.

Par exemple, nous avons ajouté un [avertissement concernant les props DOM inconnues](/warnings/unknown-prop.html) dans React 15.2.0. De nombreux projets en furent impactés. Cependant, corriger cet avertissement est important pour pouvoir introduire la prise en charge des [attributs personnalisés](https://github.com/facebook/react/issues/140) dans React. Il y a une raison comme celle-ci derrière chaque dépréciation que nous ajoutons.

Lorsque nous ajoutons un avertissement de dépréciation, nous le conservons pour le reste de la version majeure, et nous [changeons le comportement lors de la version majeure suivante](/blog/2016/02/19/new-versioning-scheme.html). S'il y a beaucoup de travail manuel répétitif à la clé, nous publions un script [codemod](https://www.youtube.com/watch?v=d0pOgY8__JM) (en anglais) qui automatise la plus grande partie de ce changement. Les codemods nous permettent d'avancer sans stagner sur une base de code importante, et nous vous encourageons à les utiliser également.

Vous trouverez les codemods que nous publions dans le dépôt [react-codemod](https://github.com/reactjs/react-codemod).

### Interopérabilité {#interoperability}

Nous accordons une grande importance à l'interopérabilité avec les systèmes existants et leur adoption progressive. Facebook a une importante base de code sans React. Son site web utilise à la fois un système de composant côté serveur appelé XHP, des bibliothèques d'interface utilisateur (*UI*) qui existaient avant React et React lui-même. Il est important pour nous que n'importe quelle équipe produit puisse [commencer à utiliser React pour une petite fonctionnalité](https://www.youtube.com/watch?v=BF58ZJ1ZQxY) (en anglais) plutôt que de réécrire leur code pour en bénéficier.

C'est pour cela que React propose des solutions de contournement pour fonctionner avec des modèles mutables, et essaie de fonctionner correctement avec d'autres bibliothèques d'UI. Vous pouvez enrôber une UI impérative déjà existante dans un composant déclaratif, et inversement. Ceci est crucial pour une adoption progressive.

### Planification {#scheduling}

Même si vos composants sont décrits comme des fonctions, en utilisant React vous ne les appelez pas directement. Chaque composant renvoie une [description de ce qui doit être rendu](/blog/2015/12/18/react-components-elements-and-instances.html#elements-describe-the-tree), et cette description peut inclure à la fois des composants écrits par l'utilisateur comme `<LikeButton>` et des composants spécifiques à la plateforme tels que `<div>`. React doit se charger de « dérouler » `<LikeButton>` et d'appliquer à l'arbre de l'UI les modifications apportées par le rendu des composants de façon récursive.

Il s'agit d'une distinction subtile mais puissante. Puisque c'est React qui appelle cette fonction de composant à votre place, ça signifie que React peut différer son appel si nécessaire. Dans son implémentation actuelle, React parcourt l'arbre de façon récursive et appelle les fonctions de rendu de l'ensemble de l'arbre mis à jour au cours du même tick. Cependant, à l'avenir, [certaines mises à jour pourraient être retardées pour éviter la perte d'images](https://github.com/facebook/react/issues/6170).

C'est un thème courant dans la conception de React. Certaiens bibliothèques populaires implémente l'approche du « *push* » dans laquelle les calculs sont exécutés lorsque de nouvelles données sont disponibles. React, quant à lui, s'en tient à l'approche « *pull* » où les calculs peuvent être différés au besoin.

React n'est pas une bibliothèque de traitement des données générique. C'est une bibliothèque pour construire des interfaces utilisateur. Nous pensons qu'il est particulièrement bien placé dans une application pour savoir quels calculs sont pertinents à un instant précis et lesquels ne le sont pas.

Si quelque chose est en dehors de l'écran, nous pouvons différer toute la logique qui lui est attachée. Si les données arrivent plus vite que la fréquence des images, nous pouvons fusionner et regrouper les mises à jour. Nous pouvons donner la priorité au travail résultant des interactions utilisateur (telles qu'une animation engendrée par le clic d'un bouton) plutôt qu'à une tâche de fond de moindre importance (telle que le rendu d'un nouveau contenu nouvellement chargé du réseau) afin d'éviter la perte d'images.

Pour être clair, nous ne tirons pas avantage de ça pour l'instant. Cependant, c'est pour avoir la liberté de faire quelque chose comme ça que nous préférons avoir le contrôle de la planification et que `setState()` est asynchrone. Sur un plan conceptuel, nous voyons ça comme la « planification d'une mise à jour ».

Il nous serait plus difficile de contrôler la planification si nous permettions à l'utilisateur de composer directement des vues avec le paradigme « *push* » commun à certaines variations de la [programmation fonctionnelle réactive](https://en.wikipedia.org/wiki/Functional_reactive_programming). Nous voulons garder le contrôle du code qui sert de « colle ».

React a comme objectif clé de minimiser la quantité de code utilisateur qui s'exécute avant de laisser la main à React. Cela garantit que React conserve la possibilité de planifier et scinder le travail en morceaux selon sa connaissance de l'UI.

Il y a une blague en interne dans l'équipe selon laquelle React aurait dû s'appeler « *Schedule* » parce que React ne veut pas être totalement « réactif ».

### Expérience développeur {#developer-experience}

Il est important pour nous d'offrir une bonne expérience développeur.

Par exemple, nous maintenons [React DevTools](https://github.com/facebook/react-devtools) qui vous permet d'inspecter l'arbre des composants React dans Chrome et Firefox. Nous avons entendu dire que ça apporte une forte augmentation de productivité aux ingénieur·e·s de Facebook et à la communauté.

Nous essayons également de faire un effort supplémentaire pour fournir des avertissements utiles aux développeurs. Par exemple, React vous avertit durant le développement si vous imbriquez des balises d'une façon que le navigateur ne comprend pas, ou si vous faites une faute de frappe courante dans l'API. Les avertissements aux développeurs et les vérifications associées sont la raison principale pour laquelle la version de développement de React est plus lente que celle de production.

Les modèles d'utilisation que nous voyons en interne chez Facebook nous aident à comprendre quelles sont les erreurs courantes et comment les prévenir rapidement. Lorsque nous ajoutons de nouvelles fonctionnalités, nous essayons d'anticiper les erreurs courantes et avertissons à leur sujet.

Nous cherchons toujours des moyens d'améliorer l'expérience développeur. Nous aimons écouter vos suggestions et acceptons vos contributions pour la rendre encore meilleure.

### Débogage {#debugging}

Lorsque quelque chose se passe mal, il est important que vous ayez des aides pour remonter jusqu'à l'erreur dans le source de la base de code. Dans React, les props et l'état sont ces indicateurs.

Si quelque chose ne va pas à l'écran, vous pouvez ouvrir React DevTools, trouver le composant responsable du rendu, et ainsi voir si les props et l'état sont corrects. Si c'est le cas, vous savez que le problème se situe dans la fonction `render()` ou dans une fonction appelée par `render()`. Le problème est isolé.

Si l'état est incorrect, vous savez que le problème est dû à l'un des appels à `setState()` au sein de ce fichier. C'est également facile à localiser et à corriger car il y a généralement peu d'appels à `setState()` dans un même fichier.

Si les props sont incorrectes, vous pouvez parcourir l'arbre dans l'inspecteur à la recherche du composant qui est à l'origine de la propagation de mauvaises props.

Cette capacité à relier n'importe quelle UI aux données qui l'ont générée est très importante dans React. C'est un objectif explicite de conception de ne pas « emprisonner » l'état au sein de fermetures lexicales (*closures*, NdT) ou de combinatoires et de le rendre disponible directement dans React.

Alors que l'UI est dynamique, nous pensons que les fonctions synchrones `render()` des props et de l'état rendent le débogage ennuyeux mais limité, sans devenir un jeu de devinettes. Nous aimerions conserver cette contrainte dans React même si ça complexifie certains cas d'usage, tels que des animations complexes. 

### Configuration {#configuration}

Nous considérons les options de configuration d'exécution comme problématiques.

Par exemple, il est parfois demandé d'implémenter une fonction telle que `React.configure(options)` ou `React.register(component)`. Cela pose toutefois de nombreux problèmes, et nous ne connaissons pas de bonnes solutions à ça.

Que se passe-t-il si cette fonction est appelée depuis une autre bibliothèque de composants ? Et si une application React intègre une autre application React et que leurs configurations respectives sont incompatibles ? Comment un composant tiers peut-il spécifier qu'il nécessite une configuration spécifique ? Nous pensons que la configuration globale ne fonctionne pas correctement avec la composition. Puisque la composition est au cœur de React, nous ne fournissons aucune configuration globale dans le code.

Nous fournissons cependant une configuration globale au niveau de la construction. Par exemple, nous offrons des versions dinstinctes pour le développement et la production. Nous pourrions également [ajouter une version de profilage](https://github.com/facebook/react/issues/6627) à l'avenir, et sommes ouverts à considérer d'autres indicateurs de construction.

### Au-delà du DOM {#beyond-the-dom}

Nous voyons l'utilité de React dans la mesure où il nous permet d'écrire des composants qui ont moins de bugs et fonctionnent bien en composition. Le DOM est la cible d'origine pour le rendu de React, mais [React Native](https://facebook.github.io/react-native/) est tout aussi important pour Facebook que pour la communauté.

Être agnostique vis-à-vis du moteur de rendu est une contrainte de conception importante pour React. Ça alourdit un peu la représentation interne. D'un autre côté, les améliorations apportées au noyau bénéficient à toutes les plateformes.

Avoir un seul modèle de programmation nous permet de former des équipes d'ingénieur·e·s autour de produits plutôt que de plateformes. Jusqu'à présent le jeu en valait la chandelle.

### Implémentation {#implementation}

Nous essayons de fournir des API élégantes dans la mesure du possible. Nous sommes beaucoup moins préoccupés par l'élégance de l'implémentation. Le monde réel est loin d'être parfait et, dans une mesure raisonnable, nous préférons mettre du code laid dans la bibliothèque si cela signifie que l'utilisateur n'aura pas à l'écrire. Lorsque nous évaluons du code nouveau, nous recherchons une implémentation correcte, performante et offrant une bonne expérience développeur. L'élégance est secondaire.

Nous préférons le code ennuyeux au code intelligent. Le code est jetable et change souvent. Il est donc important qu'il [n'introduise pas de nouvelles abstractions internes sauf si cela est absolument nécessaire](https://youtu.be/4anAwXYqLG8?t=13m9s) (en anglais). Un code verbeux qui est facile à déplacer, modifier et supprimer est préférable à un code élégant qui est prématurément abstrait et difficile à modifier.

### Optimisé pour l'outillage {#optimized-for-tooling}

Certaines API couramment utilisées ont des noms à rallonge. Par exemple, nous utilisons `componentDidMount()` plutôt que `didMount()` ou `onMount()`. C'est [intentionnel](https://github.com/reactjs/react-future/issues/40#issuecomment-142442124). L'objectif est de rendre visible les points d'interactions avec la bibliothèque.

Dans une base de code importante comme Facebook, il est très important de pouvoir rechercher les utilisations d'API spécifiques. Nous privilégions les noms verbeux et distincts, tout particulièrement pour les fonctionnalités qui doivent être utilisées avec parcimonie. Par exemple, il est difficile de rater `dangerouslySetInnerHTML` lors d'une revue de code.

L'optimisation pour la recherche est importante aussi du fait de notre dépendance aux [codemods](https://www.youtube.com/watch?v=d0pOgY8__JM) (en anglais) pour opérer des changements cassants. Nous voulons que les changements automatiques sur la base de code soient faciles et sûrs, et des noms verbeux nous aident à accomplir ça. De même, des noms distincts facilitent l'écriture de [règles lint](https://github.com/yannickcr/eslint-plugin-react) personnalisées pour React sans avoir à se soucier de potentiels faux positifs.

[JSX](/docs/introducing-jsx.html) joue un rôle similaire. Bien qu'il ne soit pas nécessaire avec React, nous l'utilisons beaucoup chez Facebook à la fois pour des raisons esthétiques et pragmatiques.

Dans notre base de code, JSX propose des indications claires à destination des outils qui travaillent avec l'arbre des éléments React. Ça rend possible l'ajout à la construction d'optimisations telles que [l'élévation (*hoisting*) des éléments constants](https://babeljs.io/docs/en/babel-plugin-transform-react-constant-elements/) (en anglais), l'utilisation sure de lint et des composants internes de codemod, et [l'inclusion de la localisation du source du JSX](https://github.com/facebook/react/pull/6771) dans les messages d'avertissement.

### *Dogfooding* {#dogfooding}

Nous faisons de notre mieux pour résoudre les problèmes soulevés par la communauté. Néanmoins, nous sommes susceptibles de prioriser les problèmes rencontrés aussi par les personnes en interne chez Facebook. Peut-être de façon contre-intuitive, nous pensons que c'est la raison principale pour laquelle la communauté peut compter sur React.

L'utilisation importante faite en interne nous conforte dans l'idée que React n'est pas prêt de disparaître. React a été créé chez Facebook pour résoudre ses problèmes. Il apporte une valeur métier tangible à la société et est utilisé dans bon nombreux de ses produits. Le [*Dogfooding*](https://fr.wikipedia.org/wiki/Dogfooding) signifie que notre vision reste claire et que nous avons une direction bien ciblée pour l'avenir.

Ça ne signifie pas que nous ignorons les problèmes soulevés par la communauté. Par exemple, nous avons ajouté la prise en charge des [Web Components](/docs/webcomponents.html) et du [SVG](https://github.com/facebook/react/pull/6243) à React bien que nous n'utilisons ni l'un ni l'autre en interne. Nous [écoutons attentivement vos problèmes](https://github.com/facebook/react/issues/2686) et nous [y répondons](/blog/2016/07/11/introducing-reacts-error-code-system.html) au mieux de nos capacités. La communauté est ce qui rend React si spécial pour nous et nous sommes honorés de contribuer en retour.

Après avoir livré de nombreux projets open source chez Facebook, nous avons appris qu'essayer de satisfaire tout le monde en même temps aboutissait à des projets mal ciblés et qui ne se développaient pas. Au lieu de ça, nous avons constaté que choisir un petit public et s'efforcer de le satisfaire avait un net effet positif. C'est exactement ce que nous avons fait avec React et, jusqu'à présent, la résolution des problèmes rencontrés par les équipes de produits chez Facebook s'est bien transposé à la communauté open source.

L'inconvénient de cette approche est que parfois nous ne mettons pas assez l'accent sur les problèmes auxquels les équipes de Facebook n'ont pas à faire face, telles que l'expérience du « démarrage ». Nous en sommes parfaitement conscients, et nous réfléchissons à une amélioration qui profiterait à toute la communauté sans commettre les mêmes erreurs que nous avions fait sur de précédents projets open source.
