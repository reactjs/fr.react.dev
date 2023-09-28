---
title: Politique de versions
---

<Intro>

Toutes les versions stables de React sont soumises à un niveau élevé de tests et suivent le versionnement sémantique (*semver*). React propose également des canaux de publication de versions instables pour encourager les retours d'expérience sur des fonctionnalités expérimentales. Cette page décrit ce que vous pouvez attendre des versions de React.

</Intro>

## Versions stables {/*stable-releases*/}

Les versions stables de React (aussi appelé canal de distribution « *latest* ») suivent les principes du [versionnement sémantique (*semver*)](https://semver.org/lang/fr/).

Ainsi, pour un numéro de version **x.y.z**, ça signifie que :

* lorsque nous publions des **correctifs de bugs critiques**, nous faisons une **livraison de correctif** en changeant le numéro **z** (par exemple de 15.6.2 à 15.6.3).
* lorsque nous publions de **nouvelles fonctionnalités** ou **des correctifs non-critiques**, nous faisons une **livraison mineure** en changeant le numéro **y** (par exemple de 15.6.2 à 15.7.0).
* lorsque nous publions des **changements non rétrocompatibles**, nous faisons une **livraison majeure** en changeant le numéro **x** (par exemple de 15.6.2 à 16.0.0).

Les livraisons majeures peuvent également intégrer de nouvelles fonctionnalités, les correctifs peuvent être intégrés dans n'importe quelle livraison.

Les livraisons mineures sont les plus fréquentes.

### Changements non rétrocompatibles {/*breaking-changes*/}

Les changements non rétrocompatibles sont gênants pour tout le monde, aussi nous essayons de limiter le nombre de livraisons majeures — par exemple, React 15 a été publié en avril 2016, React 16 en septembre 2017 et React 17 en octobre 2020.

Au lieu de ça, nous livrons de nouvelles fonctionnalités dans des versions mineures. Ça signifie que les livraisons mineures sont généralement plus intéressantes et engageantes que les versions majeures, malgré un nom somme toute modeste.

### Engagement en faveur de la stabilité {/*commitment-to-stability*/}

Au fur et à mesure de l'évolution de React, nous essayons de réduire les efforts nécessaires pour bénéficier des nouvelles fonctionnalités. Lorsque c'est possible, nous conservons une API plus ancienne, même s'il faut pour ça la déplacer dans un paquet distinct. Ainsi, les [*mixins* sont déconseillés depuis plusieurs années](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html) mais ils sont encore supportés aujourd'hui [grâce à `create-react-class`](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) et de nombreuses bases de code continuent de les utiliser dans du code stable et *legacy*.

Plus d'un million de développeurs utilisent React et maintiennent collectivement des millions de composants. La base de code de Facebook compte à elle seule plus de 50.000 composants React. Ça signifie que nous devons faciliter au maximum la mise à niveau vers les nouvelles versions de React ; si nous faisons de nombreux changements sans prévoir un chemin de migration, les gens resteront bloqués sur d'anciennes versions. Nous testons ces chemins de migration directement sur Facebook — si notre équipe de moins de dix personnes peut mettre à jour à elle seule plus de 50.000 composants, nous espérons que ces mises à jour seront gérables par quiconque utilisant React. Dans de nombreux cas, nous écrivons des [scripts automatisés](https://github.com/reactjs/react-codemod) pour mettre à jour la syntaxe des composants, que nous intégrons ensuite dans la version open-source que tout le monde peut utiliser.

### Mises à jour progressives grâce aux avertissements {/*gradual-upgrades-via-warnings*/}

Les versions de développement de React incluent de nombreux avertissements utiles. Dans la mesure du possible, nous ajoutons des avertissements pour les changements non rétrocompatibles à venir. De cette façon, si votre appli n'a pas d'avertissement avec la dernière version, alors elle sera compatible avec la prochaine version majeure. Ça vous permet de mettre à jour votre appli composant après composant.

Les avertissements de développement n'affectent pas le comportement de votre appli pendant son exécution. Ainsi, vous pouvez être sûr que votre appli se comportera de la même façon entre les *builds* de développement et de production — à ceci près que le *build* de production n'affichera pas les avertissements et qu'elle sera plus efficace (si vous constatez le contraire, merci de nous créer un ticket).

### Qu'est-ce qui est considéré comme un changement non rétrocompatible ? {/*what-counts-as-a-breaking-change*/}

En général, nous *ne changeons pas* le numéro de version majeure pour ces changements :

* **Les avertissements de développement**. Puisqu'ils n'affectent pas le comportement de la production, nous pouvons ajouter de nouveaux avertissements ou en modifier des existants entre deux versions majeures. En fait, c'est ce qui nous permet de communiquer de manière fiable sur les prochains changements non rétrocompatible.
* **Les API commençant par `unstable_`**. Il s'agit de fonctionnalités expériementales dont les API ne sont pas encore fiabilisées. En les livrant avec le préfixe `unstable_`, nous pouvons itérer plus rapidement et obtenir une API stable plus rapidement.
* **Les versions alpha et Canary de React**. Nous fournissons des versions alpha de React pour tester les nouvelles fonctionnalités en amont, mais nous avons besoin de la flexibilité nécessaire pour apporter les changements en fonction de ce que nous apprenons durant cette période. Si vous utilisez ces versions, n'oubliez pas que ces API peuvent changer avant la sortie de la version stable.
* **Les API non documentées et les structures de données internes**. Il n'y a aucune garantie si vous utilisez des proriétés internes telle que `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` ou `__reactInternalInstance$uk43rzhitjg`. C'est à vos risques et périls.

Cette politique se veut pragmatique : assurément, nous voulons vous éviter des maux de tête. Si nous changions de version majeure pour tous ces changements, nous finirions par publier plus de versions majeures et par conséquent nous causerions de nombreux problèmes de versions à la communauté. Ça signifierait également que nous ne pourrions pas améliorer React aussi vite que nous ne le voudrions.

Ceci étant dit, si nous prévoyons qu'un changement dans cette liste cause de nombreux problèmes à la communauté, nous ferons tout notre possible pour proposer des chemins de migrations progressifs.

### Une version mineure sans nouvelles fonctionnalités ne devrait-elle pas être un patch ? {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

Il est possible pour une livraison mineure de ne pas inclure de nouvelles fonctionnalités. [*semver* l'autorise](https://semver.org/lang/fr/#spec-item-7) en stipulant que **« [le numéro de version mineure] PEUT être incrémenté si de nouvelles fonctionnalités ou des améliorations substantielles sont introduites dans le code privé. Il PEUT inclure dans le même temps des corrections. »**

Ça n'explique cependant pas pourquoi ces livraisons ne sont pas considérées comme des versions de correctif.

La réponse est que toute modification apportée à React (ou à un autre logiciel) comporte des risques de rupture inattendue. Imaginez un scénario où une livraison de correctif qui corrige un bug en introduit accidentellement un nouveau. Ce ne serait non seulement perturbant pour les développeurs, mais ça nuirait également à leur confiance dans les prochaines versions de correctif. C'est d'autant plus regrettable si le correctif d'origine concerne un bug rarement rencontré dans la pratique.

Nous avons plutôt de bons antécédents en ce qui concerne l'absence de bugs dans les livraisons de React, mais les livraisons de correctifs ont un niveau de fiabilité encore plus élevé car la plupart des développeurs considèrent qu'ils peuvent les adopter sans conséquences notables.

Pour ces raisons, nous réservons les livraisons de correctifs aux bugs et aux vulnérabilités les plus critiques. 

Si une livraison inclut des changements non-essentiels — tels que des réécritures internes, des changements de détail d'implémentation, des améliorations de performances ou des corrections de bugs mineurs — nous passerons alors sur une version mineure même s'il n'y a pas de nouvelles fonctionnalités.

## Canaux des livraisons {/*all-release-channels*/}

React s'appuie sur une communauté open-source enthousiaste pour reporter les bugs, ouvrir des *Pull Requests* et [soumettre des RFCs](https://github.com/reactjs/rfcs) (*Request for Comments*, documents décrivant les spécifications techniques d'évolution — NdT). Pour encourager les retours de la communauté, nous partageons parfois des versions spéciales de React qui incluent des fonctionnalités qui n'ont pas encore été livrées.

<Note>

Cette section s'adresse surtout aux développeurs qui travaillent sur des frameworks, des bibliothèques ou des outils de développement. Les développeurs qui utilisent React surtout pour construire des applications destinées aux utilisateurs ne devraient pas avoir à se préoccuper de nos canaux de pré-version.

</Note>

Chaque canal de livraison de React est conçu pour un cas d'utilisation précis :

- [**Latest**](#latest-channel) est dédié aux versions stables de React et sont basées sur *semver*. C'est ce que vous récupérez lorsque vous installez React avec npm. C'est le canal que vous utilisez déjà aujourd'hui. **Les applications basées sur React et destinées aux utilisateurs utilisent ce canal**.
- [**Canary**](#canary-channel) suit la branche principale du dépôt du code source de React. Voyez-les comme des versions candidates pour la prochaine version *semver*. **[Les frameworks ou des configurations choisies peuvent choisir d'utiliser ce canal avec une version épinglée de React](/blog/2023/05/03/react-canaries). Vosu pouvez aussi utiliser les versions Canary pour tester l'intégration de React avec des projets tiers.**
- [**Expérimental**](#experimental-channel) inclut les API et fonctionnalités expérimentales qui ne sont pas disponibles dans les versions stables. Elles suivent aussi la branche principale, mais avec certaines drapeaux de fonctionnalités additionnelles activés. Vous pouvez les utiliser pour tester en amont les prochaines fonctionnalités avant qu'elles ne soient livrées.

Toutes les livraisons sont publiées sur npm, mais seules les *Latest* utilisent le versionnement sémantique. Les pré-livraisons (celles des canaux Canary et Expérimental) ont des versions générées depuis un hash de leur contenu et de la date du commit, par exemple `18.3.0-canary-388686f29-20230503` pour Canary et `0.0.0-experimental-388686f29-20230503` pour Expérimental.

**Les canaux *Latest* et Canary sont tous deux supportés officiellement pour les applications à destination des utilisateurs, mais avec des attentes différentes :**

* Les livraisons *Latest* suivent le modèle traditionnel *semver*.
* Les livraisons Canary [doivent être épinglées](/blog/2023/05/03/react-canaries) et peuvent inclure des changements non rétrocompatibles. Elles existent pour des environnements choisis (tels que les frameworks) qui veulent livrer progressivement de nouvelles fonctionnalités et des correctifs de React selon leur propre calendrier de publication.

Les versions Expérimentales sont uniquement proposées à des fins de tests, et nous ne garantissons pas que leurs comportements ne changent pas entre les versions. Elles ne suivent pas le protocole établi par *semver*, contrairement aux *Latest*.

En publiant les pré-versions sur le même *registry* que celui que nous utilisons pour les livraisons stables, nous tirons profit des nombreux outils qui supportent le workflow de npm, tels que [unpkg](https://unpkg.com) ou [CodeSandbox](https://codesandbox.io).

### Canal *Latest* {/*latest-channel*/}

Le canal *Latest* est utilisé pour les livraisons stables de React. Il correspond à la balise `latest` de npm. C'est le canal recommandé pour toutes les applis React qui sont déployées auprès de vrais utilisateurs.

**Si vous ne savez pas exactement quel canal utiliser, utilisez *Latest***. Si vous utilisez React directement, c'est ce que vous utilisez déjà. Vous pouvez vous attendre à ce que les mises à jour de *Latest* soient extrêmement stables. Ces versions respectent le versionnement sémantique, comme [décrit précédemment](#stable-releases).

### Canal Canary {/*canary-channel*/}

Le canal Canary est le canal pour les pré-versions qui suit la branche principale du dépôt de React. Nous utilisons des pré-versions dans le canal Canary comme candidates pour des versions du canal *Latest*. Vous pouvez voir les versions Canary comme un sur-ensemble de *Latest* qui est mis à jour plus fréquemment.

Le degré de changement entre la version Canary la plus récente et la version *Latest* la plus récente est approximativement la même que celle que vous pourriez retrouver entre deux versions mineures de *semver*. Cependant, **le canal Canary ne suit pas le versionnement sémantique**. Vous devez vous attendre à des changements occasionnels non rétrocompatible entre les versions successives du canal Canary. 

**N'utilisez pas les pré-versions dans les applications à destination des utilisateurs, à moins de suivre le [workflow Canary](/blog/2023/05/03/react-canaries)**.

Les livraisons Canary sont publiées sur npm avec la balise `canary`. Les numéros de version sont générées à partir d'un hash du contenu du *build* et de la date du commit, par exemple `18.3.0-canary-388686f29-20230503`.

#### Utiliser le canal Canary pour les tests d'intégration {/*using-the-canary-channel-for-integration-testing*/}

Le canal Canary supporte également les tests d'intégration entre React et d'autres projets.

Toutes les modifications apportés à React font l'objet de tests internes avant d'être rendues publiques. Il y a toutefois une myriade d'environnements et de configurations utilisés dans l'écosystème React, et il nous est impossible de tous les tester. 

Si vous êtes l'auteur·e d'un framework React tiers, d'une bibliothèque, d'un outil de développement ou d'un projet d'infrastructure similaire, vous pouvez nous aider à maintenir la stabilité de React pour vos utilisateurs et pour toute la communauté React en exécutant périodiquement vos tests avec les changements les plus récents. Si vous êtes intéressé, suivez ces étapes :

- Définissez une tâche cron en utilisant votre plateforme d'intégration continue. Ces tâches cron sont supportées par [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) et [Travis CI](https://docs.travis-ci.com/user/cron-jobs/).
- Dans la tâche cron, mettez à jour vos paquets React avec la version Canary de React la plus récente, en utilisant la balise `canary` de npm. Avec la ligne de commandes npm :

  ```console
  npm update react@canary react-dom@canary
  ```

  Ou celle de yarn :

  ```console
  yarn upgrade react@canary react-dom@canary
  ```

- Exécutez vos tests avec ces paquets mis à jour.
- Si tout va bien, c'est parfait ! Vous pouvez vous attendre à ce que votre projet fonctionne avec la prochaine version mineure de React.
- Si quelque chose casse de manière inattendue, veuillez nous en informer en [créant un ticket](https://github.com/facebook/react/issues).

Nest.js est un projet utilisant un tel workflow. Vous pouvez vous inspirez de leur [configuration CircleCI](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml).

### Canal Expérimental {/*experimental-channel*/}

Comme pour le canal Canary, le canal Expérimental est un canal de pré-version qui suit la branche principale du dépôt de React. Contrairement aux versions Canary, celles du canal Expérimental incluent des fonctionnalités et des API additionnelles qui ne sont pas encore prêtes pour une diffusion plus larges.

Habituellement, une mise à jour de Canary est accompagnée d'une mise à jour correspondante sur le canal Expérimental. Elles sont basées sur la même révision du code source, mais sont constuites en activant un ensemble différent de drapeaux de fonctionnalités.

Les versions Expérimentales peuvent être significativement différentes des Canary ou *Latest*. **N'utilisez pas les versions Expérimentales dans les applications destinées aux utilisateurs**. Vous devez vous attendre à des modifications non rétrocompatibles fréquentes entre les versions du canal Expérimental.

Les versions Expérimentales sont publiées avec la balise `experimental` sur npm. Les numéros de version sont générés à partir d'un hash du contenu du *build* et de la date du commit, par exemple `0.0.0-experimental-68053d940-20210623`.

#### Que contient une livraison Expérimentale ? {/*what-goes-into-an-experimental-release*/}

Les fonctionnalités Expérimentales sont celles qui ne sont pas encore prêtes à être diffusées à un large public, et peuvent changer radicalement avant d'être finalisées. Certaines expérimentations peuvent ne jamais être finalisées — la raison pour laquelle nous avons des expérimentations est de pouvoir tester la viabilité des changements proposés.

Par exemple, si le canal Expérimental avait existé au moment où nous avions annoncé les Hooks, nous les aurions publié sur le canal Expérimental des semaines avant qu'ils ne soient disponibles en *Latest*.

Vous pouvez juger utile de lancer des tests d'intégration avec des versions Expérimentales. C'est à vous de voir. Cependant, sachez que les versions Expérimentales sont encore moins stables que les Canary. **Nous ne garantissons pas de stabilité entre les versions expérimentales**.

#### Comment en savoir plus sur les fonctionnalités expérimentales ? {/*how-can-i-learn-more-about-experimental-features*/}

Les fonctionnalités expérimentales peuvent être documentées ou non. Habituellement, les expérimentations ne sont pas documentées tant qu'elle ne sont pas proches d'être intégrées dans Canary ou *Latest*.

Si une fonctionnalité n'est pas documentée, elles peuvent être accompagnée d'un [RFC](https://github.com/reactjs/rfcs) (*Request for Comments*).

Dès que nous sommes prêts à annoncer des nouvelles expérimentations, nous le publions sur le [blog React](/blog), mais ça ne signifie pas que nous publierons chacune de ces expérimentations.

Vous pouvez toujours vous référer à l'[historique](https://github.com/facebook/react/commits/main) de notre dépôt Github public pour une liste complète des changements.
