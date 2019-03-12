---
id: faq-structure
title: Structure de fichiers
permalink: docs/faq-structure.html
layout: docs
category: FAQ
---

### Y-a-t-il une manière à privilégier pour structurer les projets React ? {#is-there-a-recommended-way-to-structure-react-projects}

React n'a pas d'opinion sur la manière dont vous ordonnez vos fichiers à l'intérieur de vos dossiers. Ceci dit, vous souhaiterez peut-être envisager l'une des approches populaires de l'écosystème.

#### Grouper par fonctionnalités ou par routes {#grouping-by-features-or-routes}

Une façon courante de structurer les projets consiste à placer le CSS, le JS et les tests ensemble dans des dossiers groupés par fonctionnalité ou par route.

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

La définition d'une « fonctionnalité » n'est pas universelle, et il vous appartient d'en définir la granularité. Si vous ne parvenez pas à créer une liste des dossiers racines, vous pouvez demander aux utilisateurs de votre produit quelles en sont les principales composantes et utiliser leur modèle mental comme base.

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

L'imbrication excessive de répertoires dans les projets JavaScript est source de nombreuses souffrances. Il devient plus difficile d'écrire des importations relatives entre eux ou de mettre à jour ces importations lorsque les fichiers sont déplacés. À moins d'avoir une excellente raison d’utiliser une structure de dossiers profonde, limitez-vous à un maximum de trois ou quatre imbrications de dossier dans un même projet. Bien entendu, il ne s’agit que d’une recommandation, qui n'est peut-être pas pertinente pour votre projet.

#### Ne vous prenez pas trop la tête {#dont-overthink-it}

Si vous démarrez tout juste un projet, [ne passez pas plus de cinq minutes](https://fr.wikipedia.org/wiki/Paralysie_d%27analyse) à choisir une structure de fichiers. Choisissez l'une des approches ci-dessus (ou prenez la vôtre) et commencez à écrire votre code ! Vous serez sûrement amené·e à la repenser de toutes façons une fois que vous aurez produit du vrai code.

Si vous vous sentez complètement bloqué·e, commencez par garder tous les fichiers dans un seul dossier. Si votre application se met à grossir, vous aurez envie de séparer certains fichiers du reste. À ce moment-là, vous aurez une bonne idée des fichiers que vous éditez ensemble régulièrement. En général, il est judicieux de conserver les uns à côté des autres des fichiers qui changent souvent ensemble. Ce principe s'appelle « colocation ».

À mesure que les projets prennent de l'ampleur, on utilise souvent un mélange des deux approches ci-dessus. Du coup, choisir la « bonne » au début n’est pas si important.
