---
id: faq-versioning
title: Politique de gestion des versions
permalink: docs/faq-versioning.html
layout: docs
category: FAQ
---

React suit les principes de [gestion sémantique de version (semver)](https://semver.org/lang/fr/).

Ça signifie qu'avec un numéro de version de type **x.y.z** :

* Pour publier des **corrections de bugs critiques**, nous changeons de **version de correctif** en modifiant le nombre **z** (ex. 15.6.2 à 15.6.3).
* Pour publier des **nouvelles fonctionnalités** ou des **corrections de bugs non-critiques**, nous changeons de **version mineure** en modifiant le nombre **y** (ex. 15.6.2 à 15.7.0).
* Pour publier des **modifications cassant la compatibilité ascendante**, nous changeons de **version majeure** en modifiant le nombre **x** (ex. 15.6.2 à 16.0.0).

Les versions majeures peuvent également contenir de nouvelles fonctionnalités, et toute version peut inclure des corrections de bugs.

Les versions mineures sont de loin les plus courantes.

### Ruptures de compatibilité ascendante {#breaking-changes}

> Cette politique de versions ne s’applique pas aux pré-versions dans les canaux *Next* et *Experimental*. [En savoir plus sur les pré-versions](/docs/release-channels.html).

Personne n’aime perdre en compatibilité ascendante, nous essayons donc de minimiser le nombre de versions majeures ; par exemple, React 15 est sorti en avril 2016 et React 16 en septembre 2017 ; React 17 n'est pas prévu avant 2019.

Au lieu de ça, nous publions les nouvelles fonctionnalités dans des versions mineures. Celles-ci sont souvent plus intéressantes et motivantes que les majeures, malgré leur nom modeste.

### Nos engagements en termes de stabilité {#commitment-to-stability}

À mesure que nous améliorons React, nous essayons d'abaisser la barrière d'entrée pour tirer parti des nouvelles fonctionnalités. Chaque fois que possible, nous continuons à prendre en charge une vieille API, même si ça implique de la placer dans un module séparé. Par exemple, [les mixins sont découragés depuis des années](/blog/2016/07/13/mixins-considered-harmful.html) mais ils restent pris en charge à ce jour [via create-react-class](/docs/react-without-es6.html#mixins) et de nombreuses bases de code continuent de les utiliser dans du code historique stable.

Plus d'un million de développeurs utilisent React, qui maintiennent collectivement des millions de composants. La base de code de Facebook contient à elle seule plus de 50 000 composants React.
Ça signifie que nous devons faciliter au maximum la mise à niveau vers les nouvelles versions de React ; si nous apportons des modifications importantes sans fournir d’aide à la migration, les utilisateurs resteront bloqués sur les anciennes versions. Nous testons ces approches de mise à niveau sur Facebook même : si notre équipe de moins de 10 personnes peut mettre à jour plus de 50 000 composants à elle seule, nous espérons que la mise à niveau sera gérable pour toute personne utilisant React. Dans de nombreux cas, nous écrivons des [scripts automatisés](https://github.com/reactjs/react-codemod) pour mettre à niveau la syntaxe des composants, que nous incluons ensuite dans la version libre de notre code source pour que chacun·e puisse les utiliser.

### Mises à niveau progressives grâce aux avertissements {#gradual-upgrades-via-warnings}

Les versions de développement de React incluent de nombreux avertissements utiles. Dans la mesure du possible, nous ajoutons des avertissements en prévision de futurs changements radicaux. Ainsi, si votre application ne contient aucun avertissement sur la dernière version, elle sera compatible avec la prochaine version majeure. Ça vous permet de mettre à niveau vos applications composant par composant.

Les avertissements de développement n'affecteront pas le comportement d'exécution de votre application. De cette façon, vous pouvez être sûr·e que votre application se comportera de la même façon entre les versions de développement et de production. La seule différence, c’est que la version de production n'émettra pas les avertissements et qu'elle sera plus efficace. (Si vous remarquez le contraire, veuillez créer une *issue* dans le dépôt GitHub.)

### Qu'est ce qui constitue une rupture de compatibilité ? {#what-counts-as-a-breaking-change}

En général, nous *n’élevons pas* le numéro de version majeure pour les modifications apportées aux aspects suivants :

* **Avertissements de développement.** Dans la mesure où ils n'affectent pas le comportement de production, nous nous réservons le droit d’ajouter de nouveaux avertissements ou de modifier les avertissements existants entre les versions majeures. En fait, c’est ce qui nous permet de vous avertir de manière fiable des changements à venir.
* **API commençant par `unstable_`.** Celles-ci sont fournies en tant que fonctionnalités expérimentales  et nous ne sommes pas encore satisfaits de leurs API. En les publiant avec un préfixe `unstable_`, nous pouvons itérer plus rapidement dessus et obtenir une API stable plus tôt.
* **Versions alpha et canary de React.**
Nous fournissons des versions alpha de React afin de tester les nouvelles fonctionnalités à un stade précoce, mais nous avons besoin de la souplesse nécessaire pour apporter des modifications en fonction de ce que nous apprenons au cours de la période alpha. Si vous utilisez ces versions, notez que les API peuvent changer avant la version stable.
* **API non documentées et structures de données internes.** Si vous accédez à des noms de propriété internes tels que `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` ou` __reactInternalInstance$uk43rzhitjg`, il n'y a aucune garantie. Débrouillez-vous.

Cette politique se veut pragmatique : nous ne voulons évidemment pas vous causer de maux de tête. Si nous élevions la version majeure pour tous ces changements, nous finirions par publier plus de versions majeures, ce qui s'avèrerait plus pénible pour la communauté. Ça signifierait également que nous ne pourrions pas améliorer React aussi rapidement que nous le souhaiterions.

Cela dit, si nous nous attendons à ce qu’un changement sur cette liste cause de gros problèmes dans la communauté, nous ferons tout notre possible pour fournir un chemin de migration progressif.

### Si une version mineure n’ajoute pas de fonctionnalités, pourquoi n’est-ce pas un correctif ? {#minors-versus-patches}

Il est possible qu’une version mineure n’inclue pas de nouvelles fonctionnalités. [Semver autorise ça](https://semver.org/#spec-item-7), en disant qu’**« [une version mineure] PEUT être incrémentée lors de nouvelles fonctionnalités substancielles ou d’améliorations introduites dans le code privé. Elle PEUT inclure des modifications de type correctif. »**

Toutefois, cela soulève la question de pourquoi ces versions ne sont pas signalées comme de simples correctifs.

Cela tient au fait que toute modification à React (ou à d’autres logiciels) emporte un risque de dysfonctionnements inattendus.  Imaginez un scénario dans lequel une version de correctif qui corrige un bug en introduit accidentellement un autre. Ce ne serait pas seulement dérangeant pour les développeur·se·s, mais ça nuirait à la confiance dans les versions de correctif ultérieures. C’est particulièrement regrettable si le correctif d’origine visait un bug survenant rarement en pratique.

Nous avons un historique plutôt honorable de versions de React sans bugs, mais les versions de correctif mettent la barre encore plus haut en termes de fiabilité parce que la plupart des gens supposent qu’ils peuvent les adopter sans risque.

Voilà pourquoi nous réservons les versions de correctifs aux bugs les plus critiques et aux failles de sécurité.

Si une version inclut des modifications qui ne sont pas essentielles—telles que des refactorings internes, des modifications d’implémentation, des améliorations de performances ou des correctifs mineurs—nous incrémenterons la version mineure quand bien même aucune nouvelle fonctionnalité n’est présente.
