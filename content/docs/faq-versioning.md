---
id: faq-versioning
title: Politique de gestion des versions  
permalink: docs/faq-versioning.html
layout: docs
category: FAQ
---

React suit les principes de [sémantique de version (semver)](https://semver.org/lang/fr/).

Cela signifie qu'avec un numéro de version de type **x.y.z**:

* Nous effectuons une ** version majeure ** en modifiant le nombre ** x ** (ex: 15.6.2 à 16.0.0), lors de la publication de ** dernières modifications **.   
* Nous effectuons une ** version mineure ** en modifiant le nombre ** y ** (ex: 15.6.2 à 15.7.0), lors de la publication de ** nouvelles fonctionnalités **.  
* Nous effectuons un ** version de correctif **, en modifiant le nombre ** z ** (ex: 15.6.2 to 15.6.3) lors de la publication de ** corrections de bugs **.  

Les versions majeures peuvent également contenir de nouvelles fonctionnalités, et toute version peut inclure des corrections de bugs.  

### Dernières modifications {#breaking-changes}

Les dernières modifications sont un inconvénient pour tout le monde. Nous essayons donc de réduire le nombre de versions majeures - par exemple, React 15 a été publié en avril 2016 et React 16 en septembre 2017; React 17 n'est pas prévu avant 2019. 

Et cela, du fait que nous publions les nouvelles fonctionnalités dans des versions mineures. Celles-ci sont souvent plus intéressantes et convaincantes que les majeures, malgré leur nom modeste.

### Sélection des versions stable {#commitment-to-stability}

À mesure que nous apportons des changements sur React au fil du temps, nous essayons de réduire les efforts requis afin de tirer parti des nouvelles fonctionnalités. Du moment que c'est possible, nous gardons une vieille API fonctionnelle. Et même si ça implique de la placer dans un paquet séparé. Par exemple, [les mixins sont découragés depuis des années] (/ blog / 2016/07/13 / mixins-Considered-dangerous.html) mais ils sont pris en charge à ce jour [via create-react-class] (/ docs / react -without-es6.html # mixins) et de nombreuses bases de code continuent de les utiliser dans du code stable et hérité.

Plus d'un million de développeurs utilisent React, qui gère collectivement des millions de composants. La base de code de Facebook contient à elle seule plus de 50 000 composants React.
Cela signifie que nous devons faciliter au maximum la mise à niveau vers les nouvelles versions de React; Si nous apportons des modifications importantes sans passer par la migration, les utilisateurs resteront bloqués sur les anciennes versions. Nous testons ces chemins de mise à niveau sur Facebook même - si notre équipe de moins de 10 personnes peut mettre à jour plus de 50 000 composants à elle seule, nous espérons que la mise à niveau sera gérable pour toute personne utilisant React. Dans de nombreux cas, nous écrivons des [scripts automatisés] (https://github.com/reactjs/react-codemod) pour mettre à niveau la syntaxe du composant, que nous incluons ensuite dans la version du code source ouvert que chacun pourra utiliser.  

### Mises à niveau graduelles avec avertissements {#gradual-upgrades-via-warnings}

Les versions de développement de React incluent de nombreux avertissements utiles. Dans la mesure du possible, nous ajoutons des avertissements en prévision de futurs changements radicaux. Ainsi, si votre application ne contient aucun avertissement sur la dernière version, elle sera compatible avec la prochaine version majeure. Cela vous permet de mettre à niveau vos applications composant par composant.

Les avertissements de développement n'affecteront pas le comportement d'exécution de votre application. De cette façon, vous pouvez être sûr que votre application se comportera de la même façon entre les versions de développement et de production. La seule différence est que la version de production n'enregistrera pas les avertissements et qu'elle sera plus efficace. (Si vous remarquez le contraire, veuillez déposer un problème.)  

### Qu'est ce qui est comptabilisé pour dernières modifications? {#what-counts-as-a-breaking-change}

En général, nous *ne* supprimons *pas* le numéro de version majeur pour les modifications apportées à:

* **Avertissements de développement.** Depuis que celles-ci n'affectent pas le comportement de production, nous pouvons ajouter de nouveaux avertissements ou modifier les avertissements existants entre les versions majeures. En fait, c’est ce qui nous permet, d’être averti de manière fiable, des changements à venir. In fact, this is what allows us to reliably warn about upcoming breaking changes.
* **API commençant par `unstable_`.** Celles-ci sont fournies en tant que fonctionnalités expérimentales  et nous ne sommes pas encore sûrs des API dont nous avons confiance. En les publiant avec un préfixe `unstable_`, nous pouvons itérer plus rapidement et obtenir une API stable plus rapidement.
* **Versions alpha et canary de React.** 
480/5000
Nous fournissons des versions alpha de React afin de tester les nouvelles fonctionnalités à un stade précoce, mais nous avons besoin de la souplesse nécessaire pour apporter des modifications en fonction de ce que nous avons appris au cours de la période alpha. Si vous utilisez ces versions, notez que les API peuvent changer avant la version stable.
* **API non documentées et structures de données internes.** Si vous accédez à des noms de propriété internes tels que `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` ou` __reactInternalInstance $ uk43rzhitjg`, il n'y a aucune garantie. Tu es seul.

Cette politique se veut pragmatique: nous ne voulons certainement pas vous causer de maux de tête. Si nous remplacions la version majeure par tous ces changements, nous finirions par publier de nouvelles versions majeures, ce qui causerait plus de problèmes à la communauté. Cela signifierait également que nous ne pouvons pas progresser dans l'amélioration de React aussi rapidement que nous le souhaiterions.

Cela dit, si nous nous attendons à ce qu’un changement sur cette liste cause de gros problèmes dans la communauté, nous ferons tout notre possible pour fournir un chemin de migration graduel.



