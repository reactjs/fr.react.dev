---
id: faq-structure
title: Structure de fichier
permalink: docs/faq-structure.html
layout: docs
category: FAQ
---

### Y-a-t-il une manière à privilégier pour structurer les projets React ? {#is-there-a-recommended-way-to-structure-react-projects}

React n'a pas d'opinion sur la manière dont vous ordonnez vos fichiers à l'intérieur de vos dossiers. Ceci dit, vous souhaiterez certainement envisager l'une des approches populaires de l'écosystème.

#### Grouper par fonctionnalités ou par routes {#grouping-by-features-or-routes}

Une façon courante de structurer les projets consiste à placer le CSS, le JS et les tests ensemble dans des dossiers groupés par fonction ou par route.

```
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

La définition d'une "fonctionnalité" n'est pas universelle, et c'est à vous d'en définir la granularité. Si vous ne parvenez pas à créer une liste des dossiers de niveau supérieur, vous pouvez demander aux utilisateurs du produit qu'elles en sont les parties principales, en quoi elles consistent, et utiliser leurs modèles mentaux comme base.

#### Grouper par type de fichier {#grouping-by-file-type}

Une autre manière répandue de structurer les projets est de grouper les fichiers similaires ensemble, par exemple :

```
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```

Certaines personnes préfèrent également aller plus loin et séparer les composants dans des dossiers différents en fonction de leur rôle dans l'application. Par exemple, la [conception atomique](http://bradfrost.com/blog/post/atomic-web-design/) est une méthode de conception reposant sur ce principe. N'oubliez pas qu'il est souvent plus productif de traiter de telles méthodologies comme des exemples utiles plutôt que comme des règles strictes à suivre.

#### Évitez trop d'imbrication {#avoid-too-much-nesting}

De nombreux points douloureux sont associés à l'imbrication profonde de répertoires dans des projets JavaScript. Il devient plus difficile d'écrire des importations relatives entre eux ou de mettre à jour ces importations lorsque les fichiers sont déplacés. À moins d'une raison très convaincante d’utiliser une structure de dossiers complexe, limitez-vous à un maximum de trois ou quatre imbrications de dossier dans un même projet. Bien entendu, il ne s’agit que d’une recommandation, qui n'est peut-être pas pertinente pour votre projet.

#### N'y réfléchissez pas trop {#dont-overthink-it}

Si vous démarrez tout juste un projet, [n'y passez pas plus de cinq minutes](https://en.wikipedia.org/wiki/Analysis_paralysis) pour choisir une structure de fichier. Choisissez l'une des approches ci-dessus (ou prenez la votre) et commencez à écrire votre code ! Vous serez sûrement amener à le repenser dans tous les cas une fois que vous aurez produit du vrai code.

Si vous vous sentez complètement bloqué, commencez par garder tous les fichiers dans un seul dossier. Si votre application devient suffisamment large, vous aurez envie de séparer certains fichiers du reste. À ce moment-là, vous aurez une meilleure idée de quels fichiers, vous éditez ensemble le plus souvent. En général, il est judicieux de conserver des fichiers qui changent souvent les uns à côté des autres. Ce principe s'appelle "colocation".

À mesure que les projets prennent de l'ampleur, on utilise souvent un mélange des deux approches ci-dessus. Donc, choisir le "bon" au début n’est pas très important.
