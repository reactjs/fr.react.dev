---
id: how-to-contribute
title: Comment contribuer
layout: contributing
permalink: docs/how-to-contribute.html
next: codebase-overview.html
redirect_from:
  - "contributing/how-to-contribute.html"
  - "tips/introduction.html"
---


React est l'un des premiers projets Open Source de Facebook qui a la particularité d'être aussi bien en développement très actif qu'utilisé pour publier du code à tout le monde sur [facebook.com](https://www.facebook.com). Nous sommes toujours en train de définir les détails pour qu'il soit aussi facile et transparent que possible de contribuer à ce projet, mais nous n'y sommes pas encore arrivés. Avec un peu de chance, ce document rend le processus de contribution clair et répond certaines questions que vous pourriez avoir.

### [Code de conduite](https://code.facebook.com/codeofconduct) {#code-of-conduct}


Facebook a adopté un code de conduite et nous nous attendons à ce que les participants au projet y adhèrent. Veuillez lire [le texte complet](https://code.facebook.com/codeofconduct) afin de comprendre quelles actions seront ou ne seront pas tolérées.

### Développement ouvert {#open-development}


Tout travail sur React se passe directement sur [GitHub](https://github.com/facebook/react). Les membres de l'équipe principale (NdT core team) aussi bien que les contributeurs externes y envoient leur pull requests qui passent à travers le même processus de revue.

### Organisation des branches {#branch-organization}


Nous ferons de notre mieux pour garder la branche [`master`](https://github.com/facebook/react/tree/master) en bonne condition, avec les tests qui passent en tout temps. Mais pour pouvoir avancer rapidement, nous ferons des changements d'API avec lesquels votre application pourrait ne pas être compatible. Nous vous recommandons d'utiliser [la dernière version stable de React](/downloads.html).

Si vous envoyez une pull request, merci de la faire vers la branche `master`. Nous maintenons des branches  stables pour chaque version majeure séparément mais n'acceptons pas de pull requests vers ces dernières directement. A  la place, nous faisons un cherry-pick des changements qui ne créent pas de rupture (NdT non-breaking) de master à la version stable majeure la plus récente.

### Gestion de versions sémantique {#semantic-versioning}


React utilise le système de [gestion de versions sémantique](https://semver.org/). Nous publions des versions de correction pour les réparations de bugs, des versions mineurs pour les nouvelles fonctionnalités et des versions majeures s'il y a des changements de ruptures. Quand nous introduisons des changements de rupture, nous introduisons aussi des messages d'alertes de dépréciation dans une version mineure pour que nos utilisateurs soient au courant des changements qui arrivent, et qu'ils puissent migrer leur code à l’avance.

Nous taggons chaque pull request avec une étiquette pour marquer si le changement devrait aller dans la  prochaine [version de correction](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-patch), [version mineure](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-minor) ou [version majeure](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-major). Nous publions de nouvelles versions de correction chaque quelques semaines, versions mineures chaque quelques mois et une ou deux versions majeures par an.


Chaque changement important est documenté dans le [changelog file](https://github.com/facebook/react/blob/master/CHANGELOG.md).

### Bugs {#bugs}

#### Où trouver les problèmes connus {#where-to-find-known-issues}


Nous utilisons les [GitHub Issues](https://github.com/facebook/react/issues) pour les bugs publiques. Nous gardons cela bien à l'oeil et essayons d'être transparent quand nous avons une réparation interne en cours. Avant de créer une issue, essayez de vérifier que votre problème n'a pas déjà été documenté.

#### Documenter de nouveaux problèmes {#reporting-new-issues}


Le meilleur moyen d'avoir une  solution à votre bug est de fournir un cas de test réduit. Cet [exemple JSFiddle](https://jsfiddle.net/Luktwrdm/) est un excellent point de départ.

#### Problèmes de sécurité {#security-bugs}


Facebook a un [programme de récompenses](https://www.facebook.com/whitehat/) pour la communication sûre de problèmes de sécurité. Compte tenu du programme, merci de ne pas créer d'issue publique; suivez le processus expliqué sur cette page.

### Comment nous contacter {#how-to-get-in-touch}

* IRC: [#reactjs sur freenode](https://webchat.freenode.net/?channels=reactjs)
* Forum de discussion: [discuss.reactjs.org](https://discuss.reactjs.org/)


Au cas où vous auriez besoins d'aide avec React, il existe aussi [une communauté active d'utilisateurs de React sur la plateforme de discussion Discord](https://www.reactiflux.com/).

### Proposer un changement {#proposing-a-change}


Si vous comptez proposer un changement de l'API publique ou faire un changement non trivial à l'implémentation, nous recommandons de [créer une issue](https://github.com/facebook/react/issues/new). Cela nous permet de nous mettre d'accord par rapport à votre proposition avant que vous n'investissiez un effort important pour effectuer le changement.

Si vous réparez seulement un bug, il est tout à fait correct de soumettre directement une pull request, mais nous recommandons tout de même de créer une issue détaillant ce que vous réparez. Cela est utile au cas où nous n'acceptons pas cette réparation spécifique mais souhaitons garder une trace de ce problème..

### Votre première pull request {#your-first-pull-request}


Vous travaillez sur votre première pull request ? Vous pouvez apprendre comment le faire grâce à cette série de vidéo gratuite :

**[Comment contribuer à un projet open source sur GitHub (en anglais)](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)**


Pour vous aider à vous jeter à l'eau et vous familiariser avec le processus de contribution, nous avons une liste de **[bonnes premières issues](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"good+first+issue")** qui contient des bugs d’étendue relativement limitée.
C'est un excellent point de départ.

Si vous décidez de résoudre un problème, soyez sûr  de vérifier le fil de commentaires au cas où quelqu'un est déja en train de travailler sur ce problèmes. Si personne n'est en train de travailler dessus pour le moment, veuillez laisser un commentaire disant que vous comptez vous y attaquer pour éviter que d'autres personnes dupliquer votre effort par accodent.

Si quelqu'un dit travailler sur un problème mais ne donne pas de nouvelle pendant deux semaines, il est correct de prendre la relève, mais vous devriez tout de même laisser un commentaire.

### Envoyer une pull request {#sending-a-pull-request}

L'équipe principale surveille les pull requests. Nous faisons une revue de votre pull request et soit nous la fusionnerons, soit nous demanderons  des changements, soit nous la fermerons avec une explication. Pour les changements d'API, nous aurions peut-être besoin de changer nos usages internes à facebook.com, ce qui pourrait retarder la fusion. Nous ferons cependant notre mieux pour donner des nouvelles et des retours pendant le processus.

**Avant de soumettre une pull request,** veuillez faire attention à suivre les instructions suivantes :

1. Forkez [le dépôt](https://github.com/facebook/react) et créez votre branche depuis `master`.
2. Lancez `yarn`  à la racine du dépôt.
3. Si vous avez réparé un bug ou ajouté  du code qui devrait être testé, ajouter des tests !
4. Assurez-vous que les suites de test passent (`yarn test`). Astuce : `yarn test --watch NomDuTest` est très utile en phase de développement.
5. Lancez `yarn test-prod` pour tester dans l'environnement de production. Cette commande accepte les même options que `yarn test`.
6. Si vous avez besoin d'un debugger, lancez `yarn debug-test --watch NomDuTest`, ouvrez `chrome://inspect`, et appuyez sur “Inspecter”.
7. Formattez votre code avec [prettier](https://github.com/prettier/prettier) (`yarn prettier`).
8. Assurez-vous que votre code passe la vérification du linter (`yarn lint`). Astuce : `yarn linc` pour ne vérifier que les fichiers qui ont été changés.
9. Lancez les vérifications de types [Flow](https://flowtype.org/) (`yarn flow`).
10. Si vous ne l'avez pas encore fait, complétez le CLA.

***************

### Accord de license de contributeur (NdT Contributor License Agreement) (CLA) {#contributor-license-agreement-cla}


Pour que nous puissions accepter votre pull request, il est nécessaire que vous soumettez un CLA. Vous ne devez faire cela qu'une seule fois, donc si vous l'avez déjà fait pour un autre projet open source de Facebook, pas besoin de le refaire. Si vous soumettez une pull request pour la première fois, dites-nous simplement que vous avez déjà complété le CLA et nous pourrons vérifier cela avec votre nom d'utilisateur GitHub.

**[Complétez votre CLA ici.](https://code.facebook.com/cla)**

### Pré-requis pour contribuer {#contribution-prerequisites}

* Vous avez [Node](https://nodejs.org) installé en v8.0.0+ et [Yarn](https://yarnpkg.com/en/) en v1.2.0+.
* Vous avez `gcc` installé ou êtes à l'aise avec le fait d'installer un compilateur si besoin. Certaines de nos dépendances peuvent nécessiter une étape de compilation. Sur OS X, les outils de ligne de commande XCode s'occupent de cela. Sur Ubuntu, `apt-get install build-essential` installera les paquets nécessaires. Des commandes similaires devraient fonctionner sur d'autres distributions Linux. Windows nécessite quelques étapes additionelles, voir les [instructions d'installation de `node-gyp`]https://github.com/nodejs/node-gyp#installation) pour plus de détails.
* Vous êtes à l’aise avec Git

### Workflow de développement  {#development-workflow}


Après avoir cloné React, lancez `yarn` afin d’aller chercher ses dépendances.
Ensuite, vous pouvez lancer différentes commandes :

* `yarn lint` pour vérifier le style du code.
* `yarn linc` est comme `yarn lint` mais va plus vite car elle ne vérifie que les fichiers qui ont été changés sur votre branche.
* `yarn test` lance la suite de testa complète.
* `yarn test --watch` lance un observateur de test interactif.
* `yarn test <schema>` lance les tests des fichiers au nokm correspondant au schéma.
* `yarn test-prod` lance les tests dans l’environnement de production. Elle supporte toutes les mêmes options que `yarn test`.
* `yarn debug-test` est exactement comme `yarn test` mais avec un debugger. Ouvrez `chrome://inspect` et appuyez sur “Inspecter”.
* `yarn flow` lance les vérifications de types [Flow](https://flowtype.org/).
* `yarn build` créée un dossier `build` avec tous les paquets.
* `yarn build react/index,react-dom/index --type=UMD` créée des builds UMD seulement de React et ReactDOM.

Nous recommandons d'utiliser `yarn test` (ou ses variations mentionnées ci-dessus) pour vous assurer de ne pas introduire de régressions en travaillant sur votre changement. Cependant, il peut être pratique d'essayer votre build de React dans un vrai projet.


Tout d’abord, lancez `yarn build`. Cela produira des bundles pré-compilés dans le dossier `build`, de même que préparer les paquets npm dans `build/packages`.

La façon la plus facile d'essayer vos changements est de lancer `yarn build react/index,react-dom/index --type=UMD` et ensuite d’ouvrir `fixtures/packaging/babel-standalone/dev.html`. Ce fichier utilise déjà `react.development.js` du dossier `build`, donc il utilisera vos changements.

Si vous voulez essayer vos changements dans votre projet React existant, vous pouvez copier `build/dist/react.development.js`, `build/dist/react-dom.development.js`, ou tout autre produits de la compilation dans votre appli et utilisez les à la place de la version stable. Si votre projet utilise React depuis npm, vous pouvez supprimer `react` et `react-dom` dans ses dépendances et utiliser `yarn link` pour les pointer vers votre dossier local `build` :

```sh
cd ~/chemin_vers_votre_clone_de_react/build/node_modules/react
yarn link
cd ~/chemin_vers_votre_clone_de_react/build/node_modules/react-dom
yarn link
cd /chemin/vers/votre/projet
yarn link react react-dom
```


Chaque fois que vous lancez `yarn build` dans le dossier `react`, les versions mises à jour apparaîtront dans le dossier `node_modules` de votre projet. Vous pouvez alors re-compiler votre projet pour essayer vos changements.

Nous demandons tout de même que votre pull request contienne des tests unitaires pour chaque nouvelle fonctionnalité. De cette manière, nous pouvons nous assurer de ne pas briser votre code par la suite.

### Guide de style {#style-guide}


Nous utilisons un outil de formatage automatique qui s'appelle [Prettier](https://prettier.io/).
Lancez `yarn prettier` après avoir fait un changement du code.


Ensuite, notre linter attrappera la plupart des problèmes qui pourraient exister dans votre code.
Vous pouvez vérifier l’état du style de votre code simplement en lançant `yarn linc`.

Cependant, il y a toujours certains styles que le linter ne peut pas remarquer. Si vous n'êtes pas sûr de quelque chose, laissez vous guider par le [Guide de style de Airbnb](https://github.com/airbnb/javascript).

### Vidéo d’introduction {#introductory-video}


Vous pourriez être intéressé par cette [cette courte vidéo](https://www.youtube.com/watch?v=wUpPsEcGsg8) (26 mins) qui fait une introduction sur comment contribuer à React.

#### Points d'intérets de la vidéo : {#video-highlights}
- [4:12](https://youtu.be/wUpPsEcGsg8?t=4m12s) - Compiler et tester React en local
- [6:07](https://youtu.be/wUpPsEcGsg8?t=6m7s) - Créer et soumettre des pull requests
- [8:25](https://youtu.be/wUpPsEcGsg8?t=8m25s) - Organiser son code
- [14:43](https://youtu.be/wUpPsEcGsg8?t=14m43s) - npm & React
- [19:15](https://youtu.be/wUpPsEcGsg8?t=19m15s) - Ajouter de nouvelles fonctionnalités à React

Pour avoir une vue d'ensemble réaliste de l’expérience de contribuer à React pour la première fois, jetez un oeil à [cette présentation divertissante de ReactNYC](https://www.youtube.com/watch?v=GWCcZ6fnpn4).

### Requête de commentaires (RFC) {#request-for-comments-rfc}


Beaucoup de changements, y compris les réparations de bugs et les améliorations de documentation, peuvent être implémentés et revus par le workflow normal de pull requests GitHub.

Certains changements sont cependant plus “substantiels”, et nous demandons que ceux-ci passent par une petite phase de conception pour créer un consensus au sein de l’équipe principale de React.


Le processus de “RFC” (requête de commentaires) a pour but de fournir un processus controllé et cohérent pour l'introduction de nouvelles fonctionnalités dans le projet. Vous pouvez apporter votre contribution en consultant le [dépôt des rfcs](https://github.com/reactjs/rfcs).

### Licence {#license}


En contribuant à React, vous acceptez que toute contribution soit licenciée sous la licence MIT.

### Quelle est la suite ? {#what-next}


Lisez la [section suivante](/docs/codebase-overview.html) pour apprendre comment la base de code est organisée.
