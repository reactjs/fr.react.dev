---
title: Politique de versions
---

<Intro>

Toutes les versions stables de React sont soumises à un niveau élevé de tests et utilisent un versionnement sémantique (*semver*). React propose également des canaux de publication de versions instables pour encourager les retours d'expérience sur des fonctionnalités expérimentales. Cette page décrit ce que vous pouvez attendre des différentes versions de React.

</Intro>

Pour une liste des versions antérieures, consultez la page [Versions](/versions).

## Versions stables {/*stable-releases*/}

Les versions stables de React (fournies par le canal de distribution *“Latest”*) suivent les principes du [versionnement sémantique (*semver*)](https://semver.org/lang/fr/).

Ainsi, pour un numéro de version **x.y.z**, ça signifie que :

* lorsque nous publions des **correctifs de bugs critiques**, nous faisons une **livraison de correctifs** en changeant le numéro **z** (par exemple de 15.6.2 à 15.6.3).
* lorsque nous publions de **nouvelles fonctionnalités** ou **des correctifs non critiques**, nous faisons une **livraison mineure** en changeant le numéro **y** (par exemple de 15.6.2 à 15.7.0).
* lorsque nous publions des **ruptures de compatibilité ascendante**, nous faisons une **livraison majeure** en changeant le numéro **x** (par exemple de 15.6.2 à 16.0.0).

Les livraisons majeures peuvent également intégrer de nouvelles fonctionnalités, et les correctifs peuvent être intégrés dans n'importe quelle livraison.

Les livraisons mineures sont les plus fréquentes.

### Ruptures de compatibilité ascendante {/*breaking-changes*/}

Les ruptures de compatibilité ascendante sont gênantes pour tout le monde, aussi nous essayons de limiter le nombre de livraisons majeures — par exemple, React 15 a été publié en avril 2016, React 16 en septembre 2017 et React 17 en octobre 2020.

Au lieu de ça, nous livrons de nouvelles fonctionnalités dans des versions mineures. Ça signifie que les livraisons mineures sont généralement plus intéressantes et engageantes que les versions majeures, malgré un nom somme toute modeste.

### Engagement en faveur de la stabilité {/*commitment-to-stability*/}

Au fur et à mesure de l'évolution de React, nous essayons de réduire les efforts nécessaires pour bénéficier des nouvelles fonctionnalités. Lorsque c'est possible, nous conservons une API plus ancienne, même s'il faut pour ça la déplacer dans un module distinct. Ainsi, les [*mixins* sont déconseillés depuis des années](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html) mais ils sont encore pris en charge aujourd'hui [au travers de `create-react-class`](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) et de nombreuses bases de code continuent à les utiliser dans du code stable historique.

Plus d'un million de développeurs utilisent React et maintiennent collectivement des millions de composants. La base de code de Facebook compte à elle seule plus de 50 000 composants React. Ça signifie que nous devons faciliter au maximum la mise à niveau vers les nouvelles versions de React ; si nous faisons de nombreux changements sans proposer un chemin de migration, les gens resteront bloqués sur d'anciennes versions. Nous testons ces chemins de migration directement sur Facebook — si notre équipe de moins de dix personnes peut mettre à jour à elle seule plus de 50 000 composants, nous espérons que ces mises à jour seront gérables par quiconque utilise React. Dans de nombreux cas, nous écrivons des [scripts automatisés](https://github.com/reactjs/react-codemod) pour mettre à jour la syntaxe des composants, que nous intégrons ensuite dans la version open-source afin que tout le monde puisse en bénéficier.

### Mises à jour progressives grâce aux avertissements {/*gradual-upgrades-via-warnings*/}

Les versions de développement de React incluent de nombreux avertissements utiles. Dans la mesure du possible, nous ajoutons des avertissements pour les ruptures de compatibilité ascendante à venir. De cette façon, si votre appli n'a aucun avertissement avec la dernière version, alors elle sera compatible avec la prochaine version majeure. Ça vous permet de mettre à jour votre appli un composant à la fois.

Les avertissements de développement n'affectent pas le comportement de votre appli pendant son exécution. Ainsi, vous pouvez être sûr·e que votre appli se comportera de la même façon entre les *builds* de développement et de production — à ceci près que le *build* de production n'affichera pas les avertissements et qu'il sera plus performant (si vous constatez le contraire, merci de nous créer un ticket).

### Qu'est-ce qui constitue une rupture de compatibilité ascendante ? {/*what-counts-as-a-breaking-change*/}

En général, nous *ne changeons pas* le numéro de version majeure pour les raisons suivantes :

* **Les avertissements de développement.** Puisqu'ils n'affectent pas le comportement de production, nous pouvons ajouter de nouveaux avertissements ou en modifier des existants entre deux versions majeures. C'est justement ce qui nous permet de communiquer de manière fiable sur les prochaines ruptures de compatibilité ascendante.
* **Les API commençant par `unstable_`.** Il s'agit de fonctionnalités expérimentales dont les API ne sont pas encore stabilisées. En les livrant avec le préfixe `unstable_`, nous pouvons itérer plus rapidement et obtenir une API stable plus vite.
* **Les versions Alpha et Canary de React.** Nous fournissons des versions alpha de React pour tester les nouvelles fonctionnalités en amont, mais nous avons besoin de la flexibilité nécessaire pour apporter les changements en fonction de ce que nous apprenons durant cette période. Si vous utilisez ces versions, n'oubliez pas que ces API peuvent changer avant la sortie de la version stable.
* **Les API non documentées et les structures de données internes.** Il n'y a aucune garantie si vous utilisez des proriétés internes telle que `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` ou `__reactInternalInstance$uk43rzhitjg`. C'est à vos risques et périls.

Cette politique se veut pragmatique : il ne s'agit évidemment pas de vous donner la migraine. Si nous changions de version majeure pour toutes ces raisons, nous finirions par publier plus de versions majeures et par conséquent nous causerions de nombreux problèmes de versions à la communauté. Ça signifierait également que nous ne pourrions pas améliorer React aussi vite que nous le voudrions.

Ceci étant dit, si nous anticipons qu'un changement dans cette liste causera de nombreux problèmes à la communauté, nous ferons tout notre possible pour proposer des chemins de migration progressifs.

### Une version mineure sans nouvelles fonctionnalités ne devrait-elle pas être un correctif ? {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

Il est possible qu'une livraison mineure n'inclue pas de nouvelles fonctionnalités. Le [*semver* l'autorise](https://semver.org/lang/fr/#spec-item-7) en stipulant notamment que **« [le numéro de version mineure] PEUT être incrémenté si de nouvelles fonctionnalités ou des améliorations substantielles sont introduites dans le code privé. Elle PEUT inclure dans le même temps des correctifs. »**

Ça n'explique cependant pas pourquoi ces livraisons ne sont pas considérées comme des versions de correctif.

La réponse tient à ce que toute modification apportée à React (comme pour tout logiciel) comporte des risques de rupture inattendue. Imaginez un scénario où une livraison de correctifs qui corrige un bug en introduit accidentellement un nouveau. Ce serait non seulement perturbant pour les développeurs, mais ça entamerait également leur confiance dans les prochaines versions de correctifs. C'est d'autant plus regrettable si le correctif d'origine concerne un bug rarement rencontré dans la pratique.

Nous avons plutôt de bons antécédents en ce qui concerne l'absence de bugs dans les livraisons de React, mais les livraisons de correctifs ont un niveau de fiabilité encore plus élevé car la plupart des développeurs considèrent qu'ils peuvent les adopter sans risques.

Voilà pourquoi nous réservons les livraisons de correctifs aux bugs et aux vulnérabilités les plus critiques.

Si une livraison inclut des changements non essentiels — tels que des réécritures internes, des changements de détails d'implémentation, des améliorations de performances ou des correctifs de bugs mineurs — nous passerons alors sur une version mineure même s'il n'y a pas de nouvelles fonctionnalités.

## Tous les canaux de livraison {/*all-release-channels*/}

React s'appuie sur une communauté open-source enthousiaste pour signaler les bugs, ouvrir des *Pull Requests* et [soumettre des RFC](https://github.com/reactjs/rfcs) *(Request for Comments, documents décrivant les spécifications techniques d'évolution, NdT)*. Pour encourager les retours de la communauté, nous partageons parfois des versions spéciales de React qui incluent des fonctionnalités qui n'ont pas encore été livrées.

<Note>

Cette section s'adresse surtout aux développeurs·ses qui travaillent sur des frameworks, des bibliothèques ou des outils de développement. Les personnes qui utilisent React essentiellement pour construire des applications destinées aux utilisateurs finaux ne devraient pas avoir à se préoccuper de nos canaux de pré-version.

</Note>

Chaque canal de livraison de React est conçu pour un cas d'utilisation précis :

- [**Latest**](#latest-channel) est dédié aux versions stables de React, basées sur *semver*. C'est ce que vous récupérez lorsque vous installez React avec npm. C'est le canal que vous utilisez déjà aujourd'hui. **Les applications basées sur React et destinées aux utilisateurs finaux utilisent ce canal**.
- [**Canary**](#canary-channel) suit la branche principale du dépôt du code source de React. Voyez-les comme des versions candidates pour la prochaine version *semver*. **[Les frameworks et autres environnements choisis peuvent décider d'utiliser ce canal avec une version épinglée de React](/blog/2023/05/03/react-canaries). Vous pouvez aussi utiliser les versions Canary pour tester l'intégration de React avec des projets tiers.**
- [**Expérimental**](#experimental-channel) inclut les API et fonctionnalités expérimentales qui ne sont pas disponibles dans les versions stables. Il suit lui aussi la branche principale, mais avec certains drapeaux de fonctionnalités supplémentaires activés. Vous pouvez l'utiliser pour tester en amont les prochaines fonctionnalités avant qu'elles ne soient livrées.

Toutes ces livraisons sont publiées sur npm, mais seules les *Latest* utilisent le versionnement sémantique. Les pré-versions (celles des canaux Canary et Expérimental) ont des versions générées à partir d'une empreinte de leur contenu et de la date du commit, par exemple `18.3.0-canary-388686f29-20230503` pour Canary et `0.0.0-experimental-388686f29-20230503` pour Expérimental.

**Les canaux *Latest* et Canary sont tous deux officiellement pris en charge pour les applications à destination des utilisateurs, mais avec des attentes différentes :**

* Les livraisons *Latest* suivent le modèle traditionnel *semver*.
* Les livraisons Canary [doivent être épinglées](/blog/2023/05/03/react-canaries) et sont susceptibles d'inclure des ruptures de compatibilité ascendante. Elles existent pour faciliter la vie des environnements choisis (tels que les frameworks) qui veulent livrer progressivement de nouvelles fonctionnalités et des correctifs de React selon leur propre calendrier de publication.

Les versions Expérimentales sont uniquement proposées à des fins de tests, et nous ne garantissons pas que leurs comportements ne changeront pas entre les versions. Elles ne suivent pas le protocole établi par *semver*, contrairement aux *Latest*.

En publiant les pré-versions sur le même référentiel (à savoir npm) que celui que nous utilisons pour les livraisons stables, nous tirons profit des nombreux outils qui prennent en charge un workflow basé sur npm, tels que [unpkg](https://unpkg.com) ou [CodeSandbox](https://codesandbox.io).

### Canal *Latest* {/*latest-channel*/}

Le canal *Latest* est utilisé pour les livraisons stables de React. Il correspond à l'étiquette `latest` de npm. C'est le canal recommandé pour toutes les applis React qui sont déployées auprès de véritables utilisateurs.

**Si vous ne savez pas exactement quel canal utiliser, utilisez *Latest*.** Si vous utilisez React directement, c'est ce que vous utilisez déjà. Vous pouvez vous attendre à ce que les mises à jour de *Latest* soient extrêmement stables. Ces versions respectent le versionnement sémantique, comme [décrit précédemment](#stable-releases).

### Canal Canary {/*canary-channel*/}

Le canal Canary est le canal pour les pré-versions qui suit la branche principale du dépôt de React. Nous utilisons des pré-versions dans le canal Canary comme candidates pour des versions du canal *Latest*. Vous pouvez voir les versions Canary comme un sur-ensemble de *Latest* qui est mis à jour plus fréquemment.

Le degré de changement entre la version Canary la plus récente et la version *Latest* la plus récente est à peu près le même que celui que vous pourriez retrouver entre deux versions mineures en *semver*. Cependant, **le canal Canary ne respecte pas le versionnement sémantique**. Vous devez vous attendre à des ruptures occasionnelles de compatibilité ascendante entre les versions successives du canal Canary.

**N'utilisez pas les pré-versions dans les applications à destination des utilisateurs, à moins de suivre le [workflow Canary](/blog/2023/05/03/react-canaries)**.

Les livraisons Canary sont publiées sur npm avec l'étiquette `canary`. Les numéros de version sont générés à partir d'une empreinte du contenu du *build* et de la date du commit, par exemple `18.3.0-canary-388686f29-20230503`.

#### Utiliser le canal Canary pour les tests d'intégration {/*using-the-canary-channel-for-integration-testing*/}

Le canal Canary permet également les tests d'intégration entre React et d'autres projets.

Toutes les modifications apportés à React font l'objet de nombreux tests internes avant d'être rendues publiques. Il existe toutefois une myriade d'environnements et de configurations utilisés dans l'écosystème React, et il nous est impossible de tous les tester.

Si vous êtes l'auteur·e d'un framework React tiers, d'une bibliothèque, d'un outil de développement ou d'un projet d'infrastructure similaire, vous pouvez nous aider à maintenir la stabilité de React pour vos utilisateurs et pour toute la communauté React en exécutant périodiquement vos tests avec les changements les plus récents. Si vous êtes intéressé·e, suivez ces étapes :

- Définissez une tâche périodique en utilisant votre plateforme d'intégration continue favorie. Ces tâches sont prises en charge par [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) et [Travis CI](https://docs.travis-ci.com/user/cron-jobs/).
- Dans la tâche périodique, mettez à jour vos paquets React avec la version Canary de React la plus récente, en utilisant l'étiquette `canary` de npm. Avec la ligne de commandes npm :

  ```console
  npm update react@canary react-dom@canary
  ```

  Ou celle de yarn :

  ```console
  yarn upgrade react@canary react-dom@canary
  ```

- Exécutez vos tests avec ces modules mis à jour.
- Si tout va bien, c'est parfait ! Vous pouvez vous attendre à ce que votre projet fonctionne avec la prochaine version mineure de React.
- Si quelque chose casse de manière inattendue, veuillez nous en informer en [créant un ticket](https://github.com/facebook/react/issues).

Nest.js est un projet utilisant un tel workflow. Vous pouvez vous inspirez de leur [configuration CircleCI](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml).

### Canal Expérimental {/*experimental-channel*/}

Tout comme le canal Canary, le canal Expérimental est un canal de pré-version qui suit la branche principale du dépôt de React. Contrairement aux versions Canary, celles du canal Expérimental incluent des fonctionnalités et des API supplémentaires qui ne sont pas encore prêtes pour une diffusion plus large.

Habituellement, une mise à jour de Canary est accompagnée d'une mise à jour correspondante sur le canal Expérimental. Elles sont basées sur la même révision du code source, mais sont construites en activant un ensemble différent de drapeaux de fonctionnalités.

Les versions Expérimentales peuvent être significativement différentes des Canary ou *Latest*. **N'utilisez pas les versions Expérimentales dans les applications destinées aux utilisateurs**. Vous devez vous attendre à des ruptures fréquentes de compatibilité ascendante entre les versions du canal Expérimental.

Les versions Expérimentales sont publiées avec l'étiquette `experimental` sur npm. Les numéros de version sont générés à partir d'une empreinte du contenu du *build* et de la date du commit, par exemple `0.0.0-experimental-68053d940-20210623`.

#### Que contient une livraison Expérimentale ? {/*what-goes-into-an-experimental-release*/}

Les fonctionnalités Expérimentales sont celles qui ne sont pas encore prêtes à être diffusées à un large public, et peuvent changer radicalement avant d'être finalisées. Certaines expériences peuvent d'ailleurs ne jamais aboutir — nous expérimentons justement pour tester la viabilité des changements proposés.

Par exemple, si le canal Expérimental avait existé quand nous avons annoncé les Hooks, nous les aurions publiés sur le canal Expérimental des semaines avant qu'ils ne soient disponibles en *Latest*.

Vous pouvez juger utile de lancer des tests d'intégration avec des versions Expérimentales. C'est à vous de voir. Cependant, sachez que les versions Expérimentales sont encore moins stables que les Canary. **Nous ne garantissons pas la stabilité entre les versions expérimentales.**

#### Comment en savoir plus sur les fonctionnalités expérimentales ? {/*how-can-i-learn-more-about-experimental-features*/}

Les fonctionnalités expérimentales ne sont pas toujours documentées. Habituellement, les expériences ne sont pas documentées tant qu'elle ne sont pas sur le point d'être intégrées dans Canary ou *Latest*.

Quand bien même une fonctionnalité ne serait pas documentée, elle peut en revanche faire l'objet d'une [RFC](https://github.com/reactjs/rfcs) *(Request for Comments, NdT)*.

Dès que nous sommes prêts à annoncer de nouvelles expérimentations, nous publions un article sur le [blog React](/blog), mais ça ne signifie pas que nous parlerons publiquement de toutes nos expérimentations.

Vous avez toujours la possibilité de vous référer à l'[historique](https://github.com/facebook/react/commits/main) de notre dépôt Github public pour une liste complète des changements.
