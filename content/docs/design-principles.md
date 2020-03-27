---
id: design-principles
title: Principes de conception
layout: contributing
permalink: docs/design-principles.html
prev: implementation-notes.html
redirect_from:
  - "contributing/design-principles.html"
---

Nous avons écrit ce document afin que vous ayez une meilleure idée de la façon dont nous décidons ce que React fait et ne fait pas, et de notre philosophie de développement. Bien que nous adorions les contributions de la communauté, il est peu probable que nous choisissions un chemin qui enfreindrait un ou plusieurs de ces principes.

>Remarque
>
> Ce document suppose une solide compréhension de React. Il décrit les principes de conception de *React lui-même*, et non des composants ou des applications React.
>
> Pour une introduction à React, consultez plutôt [Penser en React](/docs/thinking-in-react.html).

### Composition {#composition}

La caractéristique principale de React est la composition de composants. Les composants écrits par des personnes différentes devraient fonctionner correctement ensemble. Nous tenons à ce que vous puissiez ajouter des fonctionnalités à un composant sans que ça impacte le reste de la base de code.

Par exemple, il devrait être possible d'introduire un état local dans un composant sans changer les composants qui l'utilisent. Dans le même esprit, il devrait être possible d'ajouter du code d'initialisation et de nettoyage à n'importe quel composant lorsque c'est nécessaire.

Il n'y a rien de « mauvais » à utiliser les méthodes d'état ou de cycle de vie dans les composants. Comme n'importe quelle fonctionnalité puissante, elles devraient être utilisées avec modération, mais nous n'avons aucune intention de les retirer. Au contraire, nous pensons qu'elles font partie intégrante de ce qui rend React utile. Nous ajouterons peut-être [des approches plus fonctionnelles](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) (en anglais) à l'avenir, mais les méthodes d'état local et de cycle de vie feront partie de ce modèle.

Les composants sont souvent décrits comme de « simples fonctions » mais à nos yeux ils doivent être bien plus que ça pour être utiles. Avec React, les composants décrivent un comportement composable, ce qui inclut le rendu, le cycle de vie et l'état local. Certaines bibliothèques externes telles que [Relay](https://facebook.github.io/relay/) ajoutent d'autres responsabilités aux composants comme la description des dépendances de données. Il est possible que ces idées reviennent dans React sous une forme ou une autre.

### Abstraction commune {#common-abstraction}

En général, nous [évitons d'ajouter des fonctionnalités](https://www.youtube.com/watch?v=4anAwXYqLG8) (vidéo en anglais) pouvant être mises en œuvre par les utilisateurs. Nous ne voulons pas surcharger vos applications avec du code inutile. Il y a toutefois des exceptions à ça.

Par exemple, si React ne proposait pas des méthodes pour l'état local ou le cycle de vie, les utilisateurs créeraient leurs propres abstractions personnalisées pour ça. Quand plusieurs abstractions s'affrontent, React ne peut garantir ni bénéficier des propriétés de l'une ou l'autre. Il doit se contenter du plus petit dénominateur commun.

C'est la raison pour laquelle nous ajoutons parfois des fonctionnalités directement à React. Si nous constatons que de nombreux composants implémentent une certaine fonctionnalité de façons incompatibles ou inefficaces, nous préférons parfois l'intégrer à React. Nous ne le faisons pas à la légère. Lorsque nous le faisons, c'est parce que nous sommes convaincus qu'élever le niveau d'abstraction profite à l'ensemble de l'écosystème. L'état local, les méthodes de cycle de vie ou la normalisation des événements des navigateurs en sont de bons exemples.

Nous discutons toujours de ces propositions d'amélioration avec la communauté. Vous pouvez trouver certaines de ces discussions avec l'étiquette [_“big picture”_](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"Type:+Big+Picture") dans le suivi des problèmes et questions de React.

### Échappatoires {#escape-hatches}

React est pragmatique. Il est piloté par les besoins des produits développés chez Facebook. Bien qu'il soit influencé par certains paradigmes qui ne sont pas tout à fait populaires comme la programmation fonctionnelle, le rendre accessible à un large public de développeurs aux compétences et expériences variées est un objectif affiché du projet.

Si nous voulons déprécier une approche que nous n'aimons pas, il est de notre responsabilité de considérer tous ses cas d'usage et d'[éduquer la communauté sur les alternatives](/blog/2016/07/13/mixins-considered-harmful.html) avant de la déprécier. Si une approche utile pour la création d'applications est difficile à exprimer de manière déclarative, nous lui [fournirons une API impérative](/docs/more-about-refs.html). Si nous ne parvenons pas à trouver l'API parfaite pour une fonctionnalité que nous estimons nécessaire dans de nombreuses applications, nous [fournirons une API temporaire de moindre qualité](/docs/legacy-context.html) du moment qu’il reste possible de nous en débarrasser ultérieurement et qu'elle laisse la porte ouverte à de futures améliorations.

### Stabilité {#stability}

Nous accordons de l'importance la stabilité de l'API. Chez Facebook, nous avons plus de 50 000 composants utilisant React. De nombreuses autres sociétés, telles que [Twitter](https://twitter.com/) ou [Airbnb](https://www.airbnb.com/), sont également de grandes utilisatrices de React. C'est pour ça que nous sommes généralement réticents à changer les API ou les comportements publics.

Cependant, nous pensons que la stabilité au sens où « rien ne change » est surfaite. Ça finit vite par stagner. Nous préférons plutôt la stabilité au sens où « c'est largement utilisé en production et lorsque quelque chose change, il existe un chemin de migration clair (et de préférence automatisé) ».

Lorsque nous déprécions une approche, nous étudions son utilisation interne chez Facebook et nous ajoutons des avertissements de dépréciation. Ils nous permettent de mesurer l'impact du changement. Parfois nous renonçons quand nous voyons que c'est encore trop tôt, et nous réfléchissons de manière plus stratégique sur la façon de préparer les bases de code à ce changement.

Si nous sommes convaincus que le changement n'est pas trop disruptif et que la stratégie de migration est viable pour tous les cas d'usage, nous livrons les avertissements de dépréciation à la communauté open source. Nous sommes en contact étroit avec de nombreux utilisateurs de React en dehors de Facebook, nous surveillons les projets open source populaires et les aidons à corriger ces dépréciations.

Compte tenu de la taille considérable de la base de code React chez Facebook, la réussite de la migration en interne est généralement un bon indicateur du fait que les autres sociétés n'auront pas de problèmes non plus. Néanmoins, il arrive que des personnes nous signalent des cas d'usage auxquels nous n'avons pas pensé, et nous ajoutons alors des solutions de contournement pour elles ou repensons notre approche.

Nous ne déprécions rien sans une bonne raison. Nous reconnaissons que les avertissements de dépréciation sont parfois frustrants, mais nous les ajoutons car les dépréciations permettent de préparer le terrain à des améliorations ou de nouvelles fonctionnalités que la communauté et nous-mêmes estimons utiles.

Par exemple, nous avons ajouté un [avertissement concernant les props DOM inconnues](/warnings/unknown-prop.html) dans React 15.2.0. De nombreux projets en furent impactés. Cependant, corriger cet avertissement est important pour pouvoir introduire la prise en charge des [attributs personnalisés](https://github.com/facebook/react/issues/140) dans React. Il y a une raison comme celle-ci derrière chaque dépréciation que nous ajoutons.

Lorsque nous ajoutons un avertissement de dépréciation, nous le conservons pour le reste de la version majeure en cours, et nous [changeons le comportement lors de la version majeure suivante](/blog/2016/02/19/new-versioning-scheme.html). S'il y a beaucoup de travail manuel répétitif à la clé, nous publions un script [codemod](https://www.youtube.com/watch?v=d0pOgY8__JM) (vidéo en anglais) qui automatise la plus grande partie des ajustements nécessaires. Les _codemods_ nous permettent d'avancer sans stagner sur une base de code importante, et nous vous encourageons à les utiliser également.

Vous trouverez les codemods que nous publions dans le dépôt [react-codemod](https://github.com/reactjs/react-codemod).

### Interopérabilité {#interoperability}

Nous accordons une grande importance à l'interopérabilité avec les systèmes existants et à l’adoption progressive. Facebook a une importante base de code sans React. Son site web utilise à la fois un système de composants côté serveur appelé XHP, des bibliothèques d'interface utilisateur (*UI*) internes antérieures à React et React lui-même. Il est important pour nous que n'importe quelle équipe produit puisse [commencer à utiliser React pour une petite fonctionnalité](https://www.youtube.com/watch?v=BF58ZJ1ZQxY) (vidéo en anglais) plutôt que de réécrire leur code pour pouvoir en bénéficier.

C'est pour ça que React propose des échappatoires pour fonctionner avec des modèles mutables, et essaie de fonctionner correctement avec d'autres bibliothèques d’UI. Vous pouvez enrober une UI impérative existante dans un composant déclaratif, et inversement. C’est crucial pour une adoption progressive.

### Planification {#scheduling}

Même si vos composants sont décrits comme des fonctions, en utilisant React vous ne les appelez pas directement. Chaque composant renvoie une [description de ce qui doit être affiché](/blog/2015/12/18/react-components-elements-and-instances.html#elements-describe-the-tree), et cette description peut inclure à la fois des composants écrits par l'utilisateur comme `<LikeButton>` et des composants spécifiques à la plate-forme tels que `<div>`. React doit se charger de « dérouler » `<LikeButton>` plus tard et d'appliquer récursivement à l'arbre de l'UI les modifications apportées par les rendus des composants.

Il s'agit d'une distinction subtile mais puissante. Puisque c'est React qui appelle cette fonction de composant à votre place, ça signifie que React peut différer son appel si nécessaire. Dans son implémentation actuelle, React parcourt l'arbre de façon récursive et appelle les fonctions de rendu de l'ensemble de l'arbre mis à jour en une seule passe. À l'avenir cependant, [certaines mises à jour pourraient être différées pour conserver un affichage fluide](https://github.com/facebook/react/issues/6170).

C'est un thème courant dans la conception de React. Certaines bibliothèques populaires implémentent une approche *“push”* dans laquelle les calculs sont exécutés dès que de nouvelles données sont disponibles. React, quant à lui, s'en tient à l'approche *“pull”* où les calculs peuvent être différés au besoin.

React n'est pas une bibliothèque de traitement de données générique. C'est une bibliothèque pour construire des interfaces utilisateurs. Nous pensons que React est particulièrement bien placé dans une application pour savoir quels calculs sont pertinents à un instant précis et lesquels ne le sont pas.

Si quelque chose est en dehors de la zone affichée à l'écran, nous pouvons différer toute la logique qui y est associée. Si les données arrivent plus vite que la fréquence de rafraîchissement, nous pouvons fusionner et regrouper les mises à jour. Nous pouvons donner la priorité au travail résultant des interactions utilisateurs (telles qu'une animation déclenchée par le clic d'un bouton) plutôt qu'à une tâche de fond de moindre importance (telle que l’affichage d'un nouveau contenu fraîchement chargé depuis le réseau) afin d'éviter de produire un affichage saccadé.

Pour être clairs, nous n’en sommes pas encore là. Cependant, c'est pour avoir la liberté de faire quelque chose comme ça que nous préférons avoir le contrôle de la planification et que `setState()` est asynchrone. Sur un plan conceptuel, nous voyons ça comme la « planification d'une mise à jour ».

Il nous serait plus difficile de contrôler la planification si nous permettions à l'utilisateur de composer directement des vues avec le paradigme *“push”* commun à certaines variations de la [programmation fonctionnelle réactive](https://en.wikipedia.org/wiki/Functional_reactive_programming). Nous voulons garder le contrôle du code intermédiaire qui sert de « colle ».

React a pour objectif-clé de minimiser la quantité de code utilisateur qui s'exécute avant de lui rendre la main. Ça garantit que React conserve la possibilité de planifier et scinder le travail en segments selon sa connaissance de l'UI.

Il y a une blague interne dans l'équipe selon laquelle React aurait dû s'appeler *“Schedule”* parce que React ne veut pas être totalement « réactif ».

### Expérience de développement {#developer-experience}

Nous tenons à offrir une bonne expérience de développement.

Par exemple, nous maintenons les [React DevTools](https://github.com/facebook/react-devtools) qui vous permettent d'inspecter l'arbre des composants React dans Chrome et Firefox. Nous avons entendu dire que ça améliore considérablement la productivité des ingénieur·e·s de Facebook et de la communauté.

Nous essayons également de faire un effort supplémentaire pour fournir des avertissements utiles aux développeurs. Par exemple, React vous avertit durant le développement si vous imbriquez des balises d'une façon que le navigateur ne comprend pas, ou si vous faites une faute de frappe courante dans l'API. Les avertissements aux développeurs et les vérifications associées sont la raison principale pour laquelle la version de développement de React est plus lente que celle de production.

Les schémas d'utilisation que nous voyons en interne chez Facebook nous aident à comprendre quelles sont les erreurs courantes et comment les prévenir rapidement. Lorsque nous ajoutons de nouvelles fonctionnalités, nous essayons d'anticiper les erreurs courantes et vous avertissons à leur sujet.

Nous cherchons en permanence des moyens d'améliorer l'expérience de développement. Nous aimons recueillir vos suggestions et accepter vos contributions visant à la rendre encore meilleure.

### Débogage {#debugging}

Lorsque quelque chose se passe mal, il est important que vous ayez des pistes pour remonter jusqu'à la source de l'erreur dans votre base de code. Avec React, ces pistes se basent sur les props et l'état local.

Si quelque chose ne va pas à l'écran, vous pouvez ouvrir React DevTools, trouver le composant responsable du rendu, et ainsi voir si les props et l'état sont corrects. Si c'est le cas, vous savez que le problème se situe dans la fonction `render()` ou dans une fonction appelée par `render()`. Le problème est isolé.

Si l'état est incorrect, vous savez que le problème est dû à l'un des appels à `setState()` au sein de ce fichier. C'est là aussi facile à localiser et à corriger car il y a généralement peu d'appels à `setState()` dans un même fichier.

Si les props sont incorrectes, vous pouvez remonter le long de l'arbre dans l'inspecteur à la recherche du composant qui est à l'origine des mauvaises props.

Cette capacité à relier n'importe quelle UI aux données qui l'ont générée est très importante dans React. Un objectif explicite de conception impose de ne pas « emprisonner » l'état au sein de fermetures lexicales *(closures, NdT)* ou de combinateurs, mais de le rendre plutôt disponible directement dans React.

Alors que l'UI est dynamique, nous pensons que les fonctions synchrones `render()` basées entièrement sur les props et l'état local rendent le débogage certes ennuyeux mais déterministe et bien délimité, plutôt que de virer au jeu de devinettes. Nous aimerions conserver cette contrainte dans React même si ça complexifie certains cas d'usage, tels que des animations complexes.

### Configuration {#configuration}

Nous considérons les options de configuration d'exécution comme problématiques.

Par exemple, on nous demande parfois d'implémenter une fonction du genre `React.configure(options)` ou `React.register(component)`. Ça pose toutefois de nombreux problèmes, et nous ne connaissons pas de bonne solution.

Que se passerait-il si cette fonction était appelée depuis une bibliothèque de composants tierce ? Et si une application React intégrait une autre application React et que leurs configurations respectives étaient incompatibles ? Comment un composant tiers peut-il spécifier qu'il nécessite une configuration spécifique ? Nous pensons que la configuration globale ne fonctionne pas correctement avec la composition. Puisque la composition est au cœur de React, nous ne fournissons aucune configuration globale dans le code.

Nous fournissons cependant une configuration globale au niveau de la construction. Par exemple, nous offrons des versions dinstinctes pour le développement et la production. Nous pourrions également [ajouter une version de profilage](https://github.com/facebook/react/issues/6627) à l'avenir, et sommes ouverts à l’examen d'autres paramètres de construction.

### Au-delà du DOM {#beyond-the-dom}

Nous voyons l'utilité de React dans la mesure où il nous permet d'écrire des composants qui ont moins de bugs et se composent facilement entre eux. React visait originellement le DOM, mais [React Native](https://react-native.dev/) est tout aussi important pour Facebook et pour la communauté.

Être indépendant du moteur de rendu constitue une contrainte de conception importante pour React. Ça alourdit un peu la représentation interne. D'un autre côté, les améliorations apportées au noyau bénéficient à toutes les plates-formes.

Avoir un seul modèle de programmation nous permet de former des équipes d'ingénieur·e·s autour de produits plutôt que de plates-formes. Jusqu'à présent le jeu en vaut la chandelle.

### Implémentation {#implementation}

Nous essayons de fournir des API élégantes dans la mesure du possible. Nous sommes beaucoup moins préoccupés par l'élégance de l'implémentation. Le monde réel est loin d'être parfait et, dans une mesure raisonnable, nous préférons mettre du code laid dans la bibliothèque si ça signifie que l'utilisateur n'aura pas à l'écrire. Lorsque nous évaluons du nouveau code, nous visons d'abord une implémentation correcte, performante et offrant une bonne expérience de développement. L'élégance est secondaire.

Nous préférons le code ennuyeux au code trop « malin ». Le code est jetable et change souvent. Il est donc important qu'il [n'introduise pas de nouvelles abstractions internes sauf si c’est absolument nécessaire](https://youtu.be/4anAwXYqLG8?t=13m9s) (vidéo en anglais). Un code verbeux qui est facile à déplacer, modifier et retirer reste préférable à un code élégant qui est prématurément abstrait et difficile à modifier.

### Optimisé pour l'outillage {#optimized-for-tooling}

Certaines API couramment utilisées ont des noms à rallonge. Par exemple, nous utilisons `componentDidMount()` plutôt que `didMount()` ou `onMount()`. C'est [volontaire](https://github.com/reactjs/react-future/issues/40#issuecomment-142442124). L'objectif est de bien mettre en avant les points d'interactions avec la bibliothèque.

Dans une base de code aussi vaste que celle de Facebook, il est très important de pouvoir rechercher les utilisations d'API spécifiques. Nous privilégions les noms verbeux et distinctifs, tout particulièrement pour les fonctionnalités qui doivent être utilisées avec parcimonie. Par exemple, il est difficile de rater `dangerouslySetInnerHTML` lors d'une revue de code.

L'optimisation pour la recherche est également importante du fait de notre dépendance aux [codemods](https://www.youtube.com/watch?v=d0pOgY8__JM) (vidéo en anglais) pour exécuter des modifications qui rompent la compatibilité ascendante. Nous voulons que les changements automatiques sur la base de code soient faciles et surs, et des noms verbeux nous aident à y parvenir. De même, des noms aisément identifiables facilitent l'écriture de [règles d'analyse statique](https://github.com/yannickcr/eslint-plugin-react) personnalisées pour React sans avoir à se soucier de potentiels faux positifs.

[JSX](/docs/introducing-jsx.html) joue un rôle similaire. Bien qu'il ne soit pas nécessaire à React, nous l'utilisons beaucoup chez Facebook à la fois pour des raisons esthétiques et pragmatiques.

Dans notre base de code, JSX indique clairement aux outils qu’ils travaillent avec un arbre d’éléments React. Ça rend possible l'ajout à la construction d'optimisations telles que [l’extraction *(hoisting, NdT)* des éléments constants](https://babeljs.io/docs/en/babel-plugin-transform-react-constant-elements/) (en anglais), l'utilisation sûre d‘analyseurs statiques et de *codemods* internes, et [l'inclusion de l’emplacement dans le source JSX](https://github.com/facebook/react/pull/6771) au sein des messages d'avertissements.

### *Dogfooding* {#dogfooding}

Nous faisons de notre mieux pour résoudre les problèmes soulevés par la communauté. Néanmoins, nous sommes susceptibles de prioriser les problèmes rencontrés aussi par les personnes en interne chez Facebook. Ça peut sembler contre-intuitif, mais nous pensons que c'est la raison principale pour laquelle la communauté peut miser sur React.

L'utilisation importante faite en interne nous conforte dans l'idée que React n'est pas près de disparaître. React a été créé chez Facebook pour résoudre ses problèmes. Il apporte une valeur métier tangible à la société et est utilisé dans bon nombre de ses produits. Notre [*dogfooding*](https://fr.wikipedia.org/wiki/Dogfooding) de React signifie que notre vision reste claire et que nous avons une direction bien établie pour l'avenir.

Ça ne signifie pas que nous ignorons les problèmes soulevés par la communauté. Par exemple, nous avons ajouté la prise en charge des [Web Components](/docs/webcomponents.html) et de [SVG](https://github.com/facebook/react/pull/6243) à React alors que nous n'utilisions ni l'un ni l'autre en interne. Nous [écoutons attentivement vos difficultés](https://github.com/facebook/react/issues/2686) et nous [y répondons](/blog/2016/07/11/introducing-reacts-error-code-system.html) au mieux de nos capacités. La communauté est ce qui rend React si spécial pour nous et nous sommes honorés d’y contribuer en retour.

Après avoir livré de nombreux projets open source chez Facebook, nous avons appris qu'essayer de satisfaire tout le monde en même temps aboutissait à des projets mal ciblés et qui ne grandissaient pas. Au lieu de ça, nous avons constaté que choisir un petit public et s'efforcer de le satisfaire avait un net effet positif. C'est exactement ce que nous avons fait avec React et, jusqu'à présent, la résolution des problèmes rencontrés par les équipes de produits chez Facebook s'est bien transposée à la communauté open source.

L'inconvénient de cette approche est que parfois nous ne mettons pas assez l'accent sur les problèmes auxquels les équipes de Facebook n'ont pas à faire face, telles que l'expérience de « démarrage ». Nous en sommes parfaitement conscients, et nous réfléchissons aux façons de nous améliorer qui profiteraient à toute la communauté sans commettre les mêmes erreurs que nous avons faites sur de précédents projets open source.
