---
title: "Nos plans pour React 18"
author: Andrew Clark, Brian Vaughn, Christine Abernathy, Dan Abramov, Rachel Nabors, Rick Hanlon, Sebastian Markbage et Seth Webster
date: 2021/06/08
description: L'équipe React est ravie de vous donner quelques nouvelles. Nous avons commencé à travailler sur React 18, qui sera notre prochaine version majeure. Nous avons créé un groupe de travail pour préparer la communauté à l'adoption graduelle des nouvelles fonctionnalités de React 18. Nous avons publié une React 18 Alpha pour que les mainteneurs de bibliothèques puissent l'essayer et nous faire leurs retours…
---

Le 8 juin 2021 par [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://github.com/bvaughn), [Christine Abernathy](https://twitter.com/abernathyca), [Dan Abramov](https://twitter.com/dan_abramov), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage) et [Seth Webster](https://twitter.com/sethwebster)

---

<Intro>

L'équipe React est ravie de vous donner quelques nouvelles :

1. Nous avons commencé à travailler sur React 18, qui sera notre prochaine version majeure.
2. Nous avons créé un groupe de travail pour préparer la communauté à l'adoption graduelle des nouvelles fonctionnalités de React 18.
3. Nous avons publié une React 18 Alpha pour que les mainteneurs de bibliothèques puissent l'essayer et nous faire leurs retours…

Ces nouveautés s'adressent principalement aux mainteneurs de bibliothèques tierces. Si vous apprenez, enseignez ou utilisez React pour construire des applications utilisateur, vous pouvez sans risque ignorer ce billet. Mais n'hésitez pas à suivre les discussions du groupe de travail React 18 si ça titille votre curiosité !

---

</Intro>

## Ce que vous trouverez dans React 18 {/*whats-coming-in-react-18*/}

À sa sortie, React 18 incluera des améliorations immédiates (telles que [le traitement par lots automatique](https://github.com/reactwg/react-18/discussions/21)), de nouvelles API (comme [`startTransition`](https://github.com/reactwg/react-18/discussions/41)) et un [nouveau moteur de rendu streamé côté serveur](https://github.com/reactwg/react-18/discussions/37) prenant nativement en charge `React.lazy`.

Ces fonctionnalités sont rendues possibles grâce à un nouveau mécanisme optionnel que nous sommes en train d'ajouter à React 18. Nous l'appelons « rendu concurrent », et il permet à React de préparer plusieurs versions de l'UI en même temps. Cette évolution se situe surtout en coulisses, mais elle déverrouille des nouvelles possibilités d'améliorations de la performance de votre appli, tant réelle que perçue.

Si vous avez suivi nos recherches relatives à l'avenir de React (auquel cas bravo !), vous avez peut-être entendu parler d'un truc appelé le « mode concurrent », et que ça risquait de casser votre application.  Suite à ces retours de la communauté, nous avons repensé la stratégie de migration pour permettre une adoption graduelle.  Plutôt qu'un « mode » tout-ou-rien, le rendu concurrent ne sera activé que pour les mises à jour déclenchées par une des nouvelles fonctionnalités.  En pratique, ça signifie que **vous pourrez adopter React 18 sans avoir à réécrire votre code, et essayer les nouvelles fonctionnalités à votre propre rythme**.

## Une stratégie d'adoption graduelle {/*a-gradual-adoption-strategy*/}

Dans la mesure où la concurrence en React 18 est optionnelle, elle n'introduit pas d'entrée de jeu de rupture de compatibilité ascendante *(breaking change, NdT)* dans le comportement des composants. **Vous pouvez migrer sur React 18 avec peu ou pas de modifications à votre code applicatif, au prix d'un effort comparable à celui des migrations passées sur une nouvelle version majeure de React.**  À en croire notre propre expérience de conversion de plusieurs applis sur React 18, nous pensons que la migration sera pour la plupart des gens l'affaire d'une demi-journée.

Nous avons livré avec succès des fonctionnalités concurrentes sur des dizaines de milliers de composants chez Facebook, et dans notre expérience, nous avons pu constater que la majorité des composants React continuent de fonctionner sans modification. Nous mettons tout en œuvre pour que la migration soit lisse pour toute la communauté ; c'est pourquoi nous annonçons aujourd'hui le groupe de travail React 18.

## Travailler avec la communauté {/*working-with-the-community*/}

Nous essayons quelque chose de nouveau pour cette version : nous avons invité un panel d'experts, de développeurs, d'auteurs de bibliothèques et d'éducateurs issus de la communauté React pour participer à notre [groupe de travail React 18](https://github.com/reactwg/react-18) afin de nous faire des retours, poser des questions, et collaborer à cette version.  Nous n'avons pas pu inviter toutes les personnes qu'on aurait souhaitées avoir dans ce premier, petit groupe, mais si cette expérience porte ses fruits, nous espérons pouvoir avoir davantage de gens par la suite !

**Le groupe de travail React 18 a comme objectif de préparer l'écosystème à une adoption lisse et graduelle de React 18 par les applications et bibliothèques existantes.**  Le groupe de travail est hébergé par les [Discussions GitHub](https://github.com/reactwg/react-18/discussions), et il dispose d'un accès public en lecture.  Les membres du groupe de travail peuvent faire leurs retours, poser des questions et partager leurs idées.  L'équipe noyau se servira aussi du dépôt de discussions pour partager les résultats de leurs recherches.  En se rapprochant de la sortie finale, toute information importante sera également publiée sur ce blog.

Pour en apprendre davantage sur la migration sur React 18, ou pour des ressources complémentaires sur cette version, consultez [l'annonce de React 18](https://github.com/reactwg/react-18/discussions/4).

## Accéder au groupe de travail React 18 {/*accessing-the-react-18-working-group*/}

Tout le monde peut lire les discussions du [dépôt du groupe de travail React 18](https://github.com/reactwg/react-18).

Dans la mesure où nous nous attendons à un pic initial d'intérêt pour le groupe de travail, seuls les membres invités seront autorisés à créer des discussions ou à les commenter. Ceci dit, les fils de discussion sont pleinement accessibles en lecture au public, afin que tout le monde ait accès à la même information.  Nous pensons qu'il s'agit d'un bon compromis entre la création d'un environnement productif pour les membres du groupe de travail d'une part, et le maintien d'une transparence vis-à-vis de la communauté dans son ensemble d'autre part.

Comme toujours, vous pouvez soumettre des rapports de bug, des questions et des retours en général *via* notre [gestion de tickets](https://github.com/facebook/react/issues).

## Comment essayer React 18 Alpha dès aujourd'hui {/*how-to-try-react-18-alpha-today*/}

Nous [publions régulièrement des nouvelles Alphas sur npm avec l'étiquette `@alpha`](https://github.com/reactwg/react-18/discussions/9). Ces versions sont construites sur base du commit le plus récent de notre dépôt principal. Lorsqu'une fonctionnalité ou un correctif sont fusionnés, ils apparaissent dans une alpha le jour ouvré suivant.

D'une version alpha à l'autre, le comportement ou les API peuvent changer significativement. Gardez bien à l'esprit que **nous déconseillons les versions alpha pour toute application de production**.

## Planning prévisionnel de sortie pour React 18 {/*projected-react-18-release-timeline*/}

Nous n'avons pas encore de date de sortie spécifique prévue, mais nous pensons qu'il nous faudra plusieurs mois de retours et d'itérations avant que React 18 soit prêt pour la plupart des applications en production.

- Alpha : disponible dès aujourd'hui
- Beta : dans plusieurs mois
- Version candidate (RC) : au moins plusieurs semaines après la Beta
- Version stable publique : au moins plusieurs semaines après la RC

Vous pourrez trouver davantage de détails sur notre planning prévisionnel de sortie [dans le groupe de travail](https://github.com/reactwg/react-18/discussions/9). Nous publierons des mises à jour sur ce blog alors que nous approcherons d'une version stable publique.
