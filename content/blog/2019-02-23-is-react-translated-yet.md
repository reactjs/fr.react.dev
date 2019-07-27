---
title: "React est-il encore traduit? ¡Sí! Sím! はい！"
author: [tesseralis]
---

Nous sommes ravis d’annoncer un effort continu pour maintenir les traductions officielles du site Web de documentation de React dans différentes langues. Grâce aux efforts dévoués des membres de la communauté React du monde entier, React est maintenant traduit dans plus de 30 langues! Vous pouvez les trouver sur la nouvelle page [Langues](/languages).

En outre, les trois langues suivantes ont achevé la traduction de la plupart des documents React! 🎉

* **Espagnol: [es.reactjs.org](https://es.reactjs.org)**
* **Japonais: [ja.reactjs.org](https://ja.reactjs.org)**
* **Brasilien Portugais: [pt-br.reactjs.org](https://pt-br.reactjs.org)**

Félicitations à [Alejandro Ñáñez Ortiz](https://github.com/alejandronanez), [Rainer Martínez Fraga](https://github.com/carburo), [David Morales](https://github.com/dmorales), [Miguel Alejandro Bolivar Portilla](https://github.com/Darking360), et tous les contributeurs à la traduction espagnole pour avoir été les premiers à * complètement * traduire les pages principales de la documentation!

## Pourquoi la localisation est-elle importante? {#why-localization-matters}

React a déjà de nombreuses réunions et conférences à travers le monde, mais de nombreux programmeurs n'utilisent pas l'anglais comme langue principale. Nous aimerions aider les communautés locales qui utilisent React en rendant notre documentation disponible dans la plupart des langues.

Dans le passé, les membres de la communauté React avaient créé des traductions non officielles pour le [Japonais](https://github.com/discountry/react), [Arabe](https://wiki.hsoub.com/React), et [Coréen](https://github.com/reactjs/ko.reactjs.org/issues/4); en créant un canal officiel pour ces documents traduits, nous espérons les rendre plus faciles à trouver et aider à faire en sorte que les utilisateurs non anglophones de React ne soient pas laissés pour compte.

## Contribuer {#contributing}

Si vous souhaitez apporter votre aide pour une traduction en cours, consultez la rubrique [Languages](/languages) et cliquez sur le lien "Contribuer" pour votre langue.

Vous ne trouvez pas votre langue? Si vous souhaitez conserver votre fork de traduction, suivez les instructions dans le [repo traduction](https://github.com/reactjs/reactjs.org-translation#starting-a-new-translation)!

## Histoire {#backstory}

Salut à tous! je suis [Nat](https://twitter.com/tesseralis)! Vous me connaissez peut-être comme la [dame-polyhedra](https://www.youtube.com/watch?v=Ew-UzGC8RqQ). Depuis quelques semaines, j'aide l'équipe de React à coordonner ses efforts de traduction. Voici comment je l’ai fait.

Notre approche initiale en matière de traduction consistait à utiliser une plate-forme SaaS permettant aux utilisateurs de soumettre des traductions. Il y avait déjà une [demande d'extraction](https://github.com/reactjs/reactjs.org/pull/873) pour l'intégrer et ma responsabilité initiale était de terminer cette intégration. Cependant, nous avions des inquiétudes quant à la faisabilité de cette intégration et à la qualité actuelle des traductions sur la plate-forme. Notre principale préoccupation était de veiller à ce que les traductions restent à jour avec le repository principal et ne deviennent pas "obsolètes".

[Dan](https://twitter.com/dan_abramov) m'a encouragé à rechercher d'autres solutions et nous sommes tombés sur la façon dont [Vue](https://vuejs.org) maintenait ses traductions -- à travers différentes fork du repository principal sur GitHub.  En particulier, la [Traduction Japonaise](https://jp.vuejs.org) utilisait un bot pour vérifier périodiquement les modifications dans le repository anglais et soumettait des demandes d'extraction à chaque modification.

Cette approche nous a plu pour plusieurs raisons:

* Il fallait moins d’intégration de code pour démarrer.
* Il a encouragé les mainteneurs actifs pour chaque repository à assurer la qualité.
* Les contributeurs comprennent déjà GitHub comme une plate-forme et sont motivés pour contribuer directement à l'organisation React.

Nous avons commencé par une première période d’essai en trois langues: Espagnol, Japonais et Chinois Simplifié. Cela nous a permis de résoudre tous les problèmes dans notre processus et de nous assurer que les traductions futures sont configurées de manière à garantir le succès. Je voulais donner aux équipes de traduction la liberté de choisir les outils avec lesquels elles se sentaient à l'aise. La seule condition requise est une [liste de contrôle](https://github.com/reactjs/reactjs.org-translation/blob/master/PROGRESS.template.md) qui décrit l'ordre d'importance pour la traduction des pages. 

Après la période d’essai, nous étions prêts à accepter plus de langues. J'ai créé [un script](https://github.com/reactjs/reactjs.org-translation/blob/master/scripts/create.js) pour automatiser la création du nouveau repository de langue et un site, [React est-il encore traduit?](https://isreacttranslatedyet.com), pour suivre les progrès des différentes traductions. Nous avons commencé *10* nouvelles traductions le premier jour!

En raison de l'automatisation, le reste de la maintenance s'est déroulé sans encombre. Nous avons finalement créé un [canal Slack](https://rt-slack-invite.herokuapp.com) pour faciliter l'échange d'informations entre traducteurs, et j'ai publié un guide renforçant les [responsabilités des mainteneurs](https://github.com/reactjs/reactjs.org-translation/blob/master/maintainer-guide.md). Permettre aux traducteurs de se parler était une aubaine -- par exemple, les traductions Arabe, Persan et Hébreu ont pu se parler afin de faire fonctionner un [texte de droite à gauche](https://en.wikipedia.org/wiki/Right-to-left).

## Le Bot {#the-bot}

La partie la plus difficile a été d'obtenir que le bot synchronise les modifications depuis la version Anglaise du site. Initialement, nous utilisions le bot [che-tsumi](https://github.com/vuejs-jp/che-tsumi) créé par l'équipe de traduction de Japanese Vue, mais nous avons rapidement décidé de créer notre propre bot pour répondre à nos besoins. En particulier, le bot che-tsumi fonctionne par [sélectionner](https://git-scm.com/docs/git-cherry-pick) de nouveaux commits. Cela a fini par provoquer une cavalade de nouveaux problèmes qui ont été interconnectés, en particulier lorsque [Hooks ont été publiés](/blog/2019/02/06/react-v16.8.0.html).

En fin de compte, nous avons décidé qu'au lieu de sélectionner chacun des commits, il était plus logique de fusionner tous les nouveaux commits et de créer une demande d'extraction une fois par jour. Les conflits sont fusionnés tels quels et répertoriés dans la [demande d'extraction](https://github.com/reactjs/pt-BR.reactjs.org/pull/114), laissant une liste de contrôle à corriger pour les mainteneurs.

Créer le [script de synchronisation](https://github.com/reactjs/reactjs.org-translation/blob/master/scripts/sync.js) était assez simple: il télécharge le repository traduit, ajoute l'original en tant que remote, en extrait, fusionne les conflits et crée une demande d'extraction.

Le problème était de trouver une place pour que le bot s'exécute. Je suis développeur frontend pour une raison -- Heroku et ses semblables sont étrangers à moi et frustrants à *l'infini*. En fait, jusqu'à mardi dernier, j'exécutais le script à la main sur ma machine locale!

Le plus gros défi était l'espace. Chaque branche du repository fait environ 100Mo -- ce qui prend quelques minutes pour cloner sur ma machine locale. Nous avons *32* forks et les niveaux gratuits ou la plupart des plateformes de déploiement que j'ai vérifiées vous ont limité à 512Mo de stockage. 

Après de nombreux calculs du bloc-notes, j'ai trouvé une solution: supprimez chaque repository une fois que vous avez terminé le script and limitez la simultanéité des scripts de `synchronisation ` qui s'exécutent simultanément pour respecter les exigences de stockage. Heureusement, les dynos Heroku ont une connexion Internet beaucoup plus rapide et sont capables de cloner rapidement même le repository React.

Il y avait d'autres problèmes plus petits que j'ai rencontrés. J'ai essayé d'utiliser l'add-on [Heroku Scheduler](https://elements.heroku.com/addons/scheduler) pour ne pas avoir à écrire de code de `suivi` réel, mais il a fini par s'exécuter de manière trop incohérente, et j'ai [eu une crise existentielle sur Twitter](https://twitter.com/tesseralis/status/1097387938088796160) lorsque je ne savais pas comment envoyer des commits du dyno Heroku. Mais à la fin, cet ingénieur front-end a réussi à faire fonctionner le bot!

Comme toujours, je souhaite apporter des améliorations au bot. Pour l'instant, il ne vérifie pas s'il existe une demande d'extraction en attente avant d'en envoyer une autre. Il est toujours difficile de dire le changement exact qui s’est produit dans la source originale, et il est possible de passer à côté d’un changement de traduction nécessaire. Mais je fais confiance aux mainteneurs que nous avons choisi pour résoudre ces problèmes, et le bot est [open source](https://github.com/reactjs/reactjs.org-translation) si quelqu'un veut m'aider à faire ces améliorations!

## Merci {#thanks}

Enfin, je voudrais exprimer ma gratitude aux personnes et groupes suivants:

 * Tous les responsables de la traduction et les contributeurs qui aident à traduire React dans plus de trente langues.
 * Le [groupe d'utilisateurs Vue.js Japan](https://github.com/vuejs-jp) pour avoir initié l'idée de traductions gérées par des robots, et plus particulièrement [Hanatani Takuma](https://github.com/potato4d) pour nous avoir aidés à comprendre leur approche et à maintenir la traduction en Japonais.
 * [Soichiro Miki](https://github.com/smikitky) pour ses nombreuses [contributions](https://github.com/reactjs/reactjs.org/pull/1636) et commentaires réfléchis sur l'ensemble du processus de traduction, ainsi que pour la maintenance de la traduction Japonaise.
 * [Eric Nakagawa](https://github.com/ericnakagawa) pour la gestion de notre processus de traduction précédent.
 * [Brian Vaughn](https://github.com/bvaughn) pour la configuration de la [page des langues](/languages) et la gestion de tous les sous-domaines.

 Et enfin, merci à [Dan Abramov](https://twitter.com/dan_abramov) de m’avoir donné cette occasion et d’être un excellent mentor en cours de route.
