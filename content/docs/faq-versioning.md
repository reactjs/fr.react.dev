---
id: faq-versioning
title: Politique de gestion des versions  
permalink: docs/faq-versioning.html
layout: docs
category: FAQ
---

React suit les principes de [gestion sémantique de version (semver)](https://semver.org/lang/fr/).

Ça signifie qu'avec un numéro de version de type **x.y.z** :

* Pour publier des **modifications cassant la compatibilité ascendante**, nous changeons de **version majeure** en modifiant le nombre **x** (ex. 15.6.2 à 16.0.0).
* Pour publier des **nouvelles fonctionnalités**, nous changeons de **version mineure** en modifiant le nombre **y** (ex. 15.6.2 à 15.7.0).
* Pour publier des **corrections de bugs**, nous changeons de **version de correctif** en modifiant le nombre **z** (ex. 15.6.2 à 15.6.3).

Les versions majeures peuvent également contenir de nouvelles fonctionnalités, et toute version peut inclure des corrections de bugs.  

### Ruptures de compatibilité ascendante {#breaking-changes}

Personne n’aime perdre en compatibilité ascendante, nous essayons donc de minimiser le nombre de versions majeures ; par exemple, React 15 est sorti en avril 2016 et React 16 en septembre 2017 ; React 17 n'est pas prévu avant 2019. 

Au lieu de ça, nous publions les nouvelles fonctionnalités dans des versions mineures. Celles-ci sont souvent plus intéressantes et motivantes que les majeures, malgré leur nom modeste.

### Nos engagements en termes de stabilité {#commitment-to-stability}

À mesure que nous améliorons React, nous essayons d'abaisser la barrière d'entrée pour tirer parti des nouvelles fonctionnalités. Chaque fois que possible, nous continuons à prendre en charge une vieille API, même si ça implique de la placer dans un module séparé. Par exemple, [les mixins sont découragés depuis des années](/blog/2016/07/13/mixins-considered-harmful.html) mais ils restent pris en charge à ce jour [via create-react-class](/docs/react-without-es6.html#mixins) et de nombreuses bases de code continuent de les utiliser dans du code historique stable.

Plus d'un million de développeurs utilisent React, qui gère collectivement des millions de composants. La base de code de Facebook contient à elle seule plus de 50 000 composants React.
Cela signifie que nous devons faciliter au maximum la mise à niveau vers les nouvelles versions de React; Si nous apportons des modifications importantes sans passer par la migration, les utilisateurs resteront bloqués sur les anciennes versions. Nous testons ces chemins de mise à niveau sur Facebook même - si notre équipe de moins de 10 personnes peut mettre à jour plus de 50 000 composants à elle seule, nous espérons que la mise à niveau sera gérable pour toute personne utilisant React. Dans de nombreux cas, nous écrivons des [scripts automatisés] (https://github.com/reactjs/react-codemod) pour mettre à niveau la syntaxe du composant, que nous incluons ensuite dans la version du code source ouvert que chacun pourra utiliser.  

### Mises à niveau graduelles avec avertissements {#gradual-upgrades-via-warnings}

Les versions de développement de React incluent de nombreux avertissements utiles. Dans la mesure du possible, nous ajoutons des avertissements en prévision de futurs changements radicaux. Ainsi, si votre application ne contient aucun avertissement sur la dernière version, elle sera compatible avec la prochaine version majeure. Cela vous permet de mettre à niveau vos applications composant par composant.

Les avertissements de développement n'affecteront pas le comportement d'exécution de votre application. De cette façon, vous pouvez être sûr que votre application se comportera de la même façon entre les versions de développement et de production. La seule différence est que la version de production n'enregistrera pas les avertissements et qu'elle sera plus efficace. (Si vous remarquez le contraire, veuillez déposer un problème.)  

### Qu'est ce qui est comptabilisé pour dernières modifications? {#what-counts-as-a-breaking-change}

En général, nous *ne* supprimons *pas* le numéro de version majeur pour les modifications apportées à:

* **Avertissements de développement.** Depuis que celles-ci n'affectent pas le comportement de production, nous pouvons ajouter de nouveaux avertissements ou modifier les avertissements existants entre les versions majeures. En fait, c’est ce qui nous permet, d’être averti de manière fiable, des changements à venir. In fact, this is what allows us to reliably warn about upcoming breaking changes.
* **API commençant par `unstable_`.** Celles-ci sont fournies en tant que fonctionnalités expérimentales  et nous ne sommes pas encore satisfaits de leurs API. En les publiant avec un préfixe `unstable_`, nous pouvons itérer plus rapidement dessus et obtenir une API stable plus tôt.
* **Versions alpha et canary de React.** 
Nous fournissons des versions alpha de React afin de tester les nouvelles fonctionnalités à un stade précoce, mais nous avons besoin de la souplesse nécessaire pour apporter des modifications en fonction de ce que nous apprenons au cours de la période alpha. Si vous utilisez ces versions, notez que les API peuvent changer avant la version stable.
* **API non documentées et structures de données internes.** Si vous accédez à des noms de propriété internes tels que `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` ou` __reactInternalInstance $ uk43rzhitjg`, il n'y a aucune garantie. Débrouillez-vous.

Cette politique se veut pragmatique : nous ne voulons évidemment pas vous causer de maux de tête. Si nous élevions la version majeure pour tous ces changements, nous finirions par publier plus de versions majeures, ce qui s'avèrerait plus pénible pour la communauté. Ça signifierait également que nous ne pourrions pas améliorer React aussi rapidement que nous le souhaiterions.

Cela dit, si nous nous attendons à ce qu’un changement sur cette liste cause de gros problèmes dans la communauté, nous ferons tout notre possible pour fournir un chemin de migration graduel.
