---
title: "React est-il enfin traduit? ¡Sí! Sím! はい！"
author: [tesseralis]
---

Nous sommes ravis d’annoncer un effort en cours pour maintenir les traductions officielles du site web de documentation de React dans différentes langues. Grâce aux efforts dévoués des membres de la communauté React du monde entier, React est maintenant traduit dans plus de 30 langues ! Vous pouvez les trouver sur la nouvelle page [Langues](/languages).

En outre, les trois langues suivantes ont achevé la traduction de l’essentiel de la documentation de React ! 🎉

* **Espagnol : [es.reactjs.org](https://es.reactjs.org)**
* **Japonais : [ja.reactjs.org](https://ja.reactjs.org)**
* **Portugais brésilien : [pt-br.reactjs.org](https://pt-br.reactjs.org)**

Félicitations à [Alejandro Ñáñez Ortiz](https://github.com/alejandronanez), [Rainer Martínez Fraga](https://github.com/carburo), [David Morales](https://github.com/dmorales), [Miguel Alejandro Bolivar Portilla](https://github.com/Darking360), et tou·te·s les contributeur·rice·s à la traduction espagnole pour avoir été les premiers à *complètement* traduire les pages principales de la documentation !

## Pourquoi la traduction est-elle importante ? {#why-localization-matters}

React a déjà de nombreux meetups et conférences à travers le monde, mais de nombreux·ses programmeur·se·s n'utilisent pas l'anglais comme langue principale. Nous aimerions aider les communautés locales qui utilisent React en rendant notre documentation disponible dans la plupart des langues.

Par le passé, les membres de la communauté React avaient créé des traductions non officielles pour le [japonais](https://github.com/discountry/react), l’[arabe](https://wiki.hsoub.com/React), et le [coréen](https://github.com/reactjs/ko.reactjs.org/issues/4) ; en créant un canal officiel pour ces traductions, nous espérons les rendre plus faciles à trouver et aider à faire en sorte que les utilisateurs non anglophones de React ne soient pas laissés pour compte.

## Contribuer {#contributing}

Si vous souhaitez apporter votre aide pour une traduction en cours, consultez la rubrique [Langues](/languages) et cliquez sur le lien « Contribuer » pour votre langue.

Vous ne trouvez pas votre langue ? Si vous souhaitez maintenir le fork de traduction de votre langue, suivez les instructions dans le [dépôt de traduction](https://github.com/reactjs/reactjs.org-translation#starting-a-new-translation) !

## Histoire {#backstory}

Salut tout le monde ! Je m‘appelle [Nat](https://twitter.com/tesseralis) ! Vous me connaissez peut-être comme [la dame qui adore les polyèdres](https://www.youtube.com/watch?v=Ew-UzGC8RqQ). Depuis quelques semaines, j'aide l'équipe de React à coordonner ses efforts de traduction. Voici comment.

Notre approche initiale en matière de traduction reposait sur une plate-forme SaaS permettant aux utilisateurs de soumettre des traductions. Il y avait déjà une [*pull request*](https://github.com/reactjs/reactjs.org/pull/873) pour l'intégrer et ma responsabilité initiale consistait à finaliser cette intégration. Cependant, nous avions des inquiétudes quant à la faisabilité de cette intégration et à la qualité actuelle des traductions sur la plate-forme. Notre principale préoccupation était de veiller à ce que les traductions restent à jour avec le dépôt principal et ne deviennent pas « obsolètes ».

[Dan](https://twitter.com/dan_abramov) m'a encouragé à chercher d'autres solutions et nous sommes tombés sur la façon dont [Vue](https://vuejs.org) maintenait ses traductions : à travers différents forks du dépôt GitHub principal.  En particulier, la [traduction japonaise](https://jp.vuejs.org) utilisait un bot pour vérifier périodiquement les modifications dans le dépôt anglais et soumettait des *pull requests* à chaque modification.

Cette approche nous a plu pour plusieurs raisons :

* C’était moins d’intégration de code pour démarrer.
* Ça encourageait les mainteneurs actifs pour chaque dépôt à assurer la qualité.
* Les contributeur·rice·s connaissent déjà la plate-forme GitHub et sont motivé·e·s pour contribuer directement à l'organisation React.

Nous avons commencé par une première période d’essai en trois langues : espagnol, japonais et chinois simplifié. Ça nous a permis de résoudre tous les problèmes dans notre processus et de nous assurer que les futures traductions pourraient aboutir. Je voulais donner aux équipes de traduction la liberté de choisir les outils avec lesquels elles se sentaient à l'aise. La seule exigence était une [liste de cases à cocher](https://github.com/reactjs/reactjs.org-translation/blob/master/PROGRESS.template.md) qui décrivait l'ordre d'importance pour la traduction des pages. 

Après la période d’essai, nous étions prêts à accepter davantage de langues. J'ai créé [un script](https://github.com/reactjs/reactjs.org-translation/blob/master/scripts/create.js) pour automatiser la création d’un nouveau dépôt de langue, ainsi qu’un site, [Is React Translated Yet?](https://isreacttranslatedyet.com), pour suivre les progrès des différentes traductions. Nous avons démarré *10* nouvelles traductions rien que le premier jour !

En raison de l'automatisation, le reste de la maintenance s'est déroulé sans encombre. Nous avons finalement créé un [canal Slack](https://rt-slack-invite.herokuapp.com) pour faciliter l'échange d'informations entre traducteurs, et j'ai publié un guide renforçant les [responsabilités des mainteneurs](https://github.com/reactjs/reactjs.org-translation/blob/master/maintainer-guide.md). Permettre aux traducteurs de se parler était une aubaine ; par exemple, les traductions arabes, persanes et hébraïques ont pu se parler afin de faire fonctionner le [texte de droite à gauche](https://en.wikipedia.org/wiki/Right-to-left).

## Le bot {#the-bot}

La partie la plus difficile a été d'obtenir que le bot synchronise les modifications depuis la version anglaise du site. Initialement, nous utilisions le bot [che-tsumi](https://github.com/vuejs-jp/che-tsumi) créé par l'équipe de traduction japonaise de Vue, mais nous avons rapidement décidé de créer notre propre bot pour répondre à nos besoins spécifiques. En particulier, le bot che-tsumi fonctionne par [*cherry-picking*](https://git-scm.com/docs/git-cherry-pick) de nouveaux commits. Ça a fini par provoquer une avalanche de nouveaux problèmes étroitement liés, notamment lorsque [les Hooks sont sortis](/blog/2019/02/06/react-v16.8.0.html).

En fin de compte, nous avons décidé qu'au lieu de faire un *cherry-pick* de chaque commit, il était plus logique de fusionner tous les nouveaux commits et de créer une *pull request* environ une fois par jour. Les conflits sont fusionnés tels quels et répertoriés dans la [*pull request*](https://github.com/reactjs/pt-BR.reactjs.org/pull/114), laissant une liste de tâches de correction pour les mainteneurs.

Créer le [script de synchronisation](https://github.com/reactjs/reactjs.org-translation/blob/master/scripts/sync.js) était assez simple : il télécharge le dépôt traduit, ajoute l'original en tant que *remote*, le récupère, fusionne les conflits et crée une *pull request*.

Le problème était de trouver un endroit où faire tourner le bot. Je suis développeuse frontend pour une raison—Heroku et consorts me sont étrangers et *infiniment* frustrants. En fait, jusqu'à mardi dernier, j'exécutais le script à la main sur ma machine locale !

Le plus gros défi venait de l'espace disque. Chaque fork du dépôt fait environ 100Mo, ce qui prend quelques minutes pour cloner sur ma machine locale. Nous avons *32* forks et les niveaux gratuits de la plupart des plateformes de déploiement que j'ai examinées limitent à 512Mo de stockage. 

Après de nombreux calculs sur un coin de table, j'ai trouvé une solution : supprimer chaque dépôt une fois son traitement terminé et limiter la concurrence des scripts de synchronisation pour respecter les limites de stockage. Heureusement, les dynos Heroku ont une connexion internet beaucoup plus rapide et sont capables de cloner rapidement même le dépôt React.

J‘ai rencontré d'autres problèmes plus petits. J'ai essayé d'utiliser l'add-on [Heroku Scheduler](https://elements.heroku.com/addons/scheduler) pour ne pas avoir à écrire mon propre code de suivi, mais il s’est avéré s'exécuter de manière trop inégale, et j'ai [eu une crise existentielle sur Twitter](https://twitter.com/tesseralis/status/1097387938088796160) quand je n’arrivais pas à envoyer des commits depuis le dyno Heroku. Mais pour finir, l’ingénieure frontend que je suis a réussi à faire fonctionner le bot !

J’ai évidemment toujours une liste de choses que je voudrais améliorer dans ce bot. Pour l'instant, il ne vérifie pas s'il existe une *pull request* en attente avant d'en envoyer une autre. Il reste difficile de déterminer le changement exact qui s’est produit dans le source original, et il reste possible de passer à côté d’un changement de traduction nécessaire. Mais je fais confiance aux mainteneurs que nous avons choisis pour résoudre ces problèmes, et le bot est [open source](https://github.com/reactjs/reactjs.org-translation) si quelqu'un veut m'aider à améliorer tout ça !

## Merci {#thanks}

Pour finir, je voudrais exprimer ma gratitude aux personnes et groupes suivants :

 * Tous les responsables de la traduction et les contributeurs qui aident à traduire React dans plus de trente langues.
 * Le [groupe d'utilisateurs Vue.js Japan](https://github.com/vuejs-jp) pour avoir initié l'idée de traductions gérées par des bots, et plus particulièrement [Hanatani Takuma](https://github.com/potato4d) pour nous avoir aidés à comprendre leur approche et pour maintenir la traduction japonaise.
 * [Soichiro Miki](https://github.com/smikitky) pour ses nombreuses [contributions](https://github.com/reactjs/reactjs.org/pull/1636) et commentaires réfléchis sur l'ensemble du processus de traduction, ainsi que pour la maintenance de la traduction japonaise.
 * [Eric Nakagawa](https://github.com/ericnakagawa) pour la gestion de notre processus de traduction précédent.
 * [Brian Vaughn](https://github.com/bvaughn) pour la configuration de la [page des langues](/languages) et la gestion de tous les sous-domaines.

 Et enfin, merci à [Dan Abramov](https://twitter.com/dan_abramov) de m’avoir donné cette occasion et d’avoir été un excellent mentor tout du long.
