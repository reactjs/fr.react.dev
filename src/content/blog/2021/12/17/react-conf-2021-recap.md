---
title: "La React Conf 2021 en bref"
author: Jesslyn Tannady et Rick Hanlon
date: 2021/12/17
description: La semaine dernière nous avons hébergé notre 6e React Conf. Les années précédentes, nous avions utilisé la React Conf pour faire des annonces retentissantes telles que React Native ou les Hooks. Cette année, nous avons partagé notre vision multi-plateforme pour React, en commençant par React 18 et l'adoption graduelle des fonctionnalités concurrentes…

---

Le 17 décembre 2021 par [Jesslyn Tannady](https://twitter.com/jtannady) et [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

La semaine dernière nous avons hébergé notre 6e React Conf. Les années précédentes, nous avions utilisé la React Conf pour faire des annonces retentissantes telles que [React Native](https://engineering.fb.com/2015/03/26/android/react-native-bringing-modern-web-techniques-to-mobile/) ou les [Hooks](https://fr.legacy.reactjs.org/docs/hooks-intro.html). Cette année, nous avons partagé notre vision multi-plateforme pour React, en commençant par React 18 et l'adoption graduelle des fonctionnalités concurrentes…

</Intro>

---

C'était la première édition en ligne de la React Conf, et nous l'avons streamée gratuitement, traduite dans 8 langues différentes. Des participants du monde entier ont rejoint le Discord de la conférence et la réédition en ligne qui permettait une accessibilité depuis tous les fuseaux horaires. Plus de 50 000 personnes se sont inscrites, avec plus de 60 000 vues pour les 19 présentations, et 5 000 personnes au total étaient sur Discord lors de la conférence d'origine et de sa réédition.

Toutes les présentations sont [disponibles en ligne](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa).

Voici un résumé de ce que nous avons partagé sur scène.

## *React 18 and concurrent features* {/*react-18-and-concurrent-features*/}

Dans cette plénière, nous partagions notre vision de l'avenir de React, à commencer par React 18.

React 18 ajoute le moteur de rendu concurrent attendu de longue date, ainsi que des évolutions de Suspense, sans introduire de rupture majeure de compatibilité ascendante *(breaking change, NdT)*.  Les applis peuvent migrer sur React 18 et commencer à adopter les fonctionnalités concurrentes de façon graduelle, avec un niveau d'effort similaire aux versions majeures précédentes.

**Ça signifie qu'il n'y a pas de mode concurrent, uniquement des fonctionnalités concurrentes.**

Dans cette plénière, nous avons aussi partagé notre vision pour Suspense, les Composants Serveur, les nouveaux groupes de travail React, ainsi que notre vision à long terme de prise en charge multi-plateforme pour React Native.

Regardez la session plénière intégrale présentée par [Andrew Clark](https://twitter.com/acdlite), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes) et [Rick Hanlon](https://twitter.com/rickhanlonii) :

<YouTubeIframe src="https://www.youtube.com/embed/FZ0cG47msEk" />

## *React 18 for Application Developers* {/*react-18-for-application-developers*/}

Nous avons aussi annoncé dans la plénière qu'une version candidate (RC) de React 18 était disponible pour essai dès maintenant. Sauf si de nouveaux retours l'imposent, il s'agira de la version exacte de React que nous publierons comme stable au début de l'année prochaine.

Pour essayer la RC de React 18, mettez à jour vos dépendances :

```bash
npm install react@rc react-dom@rc
```

et basculez vers la nouvelle API `createRoot` :

```js
// Avant
const container = document.getElementById('root');
ReactDOM.render(<App />, container);

// Après
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App/>);
```

Pour une démo de mise à jour sur React 18, regardez cette présentation de [Shruti Kapoor](https://twitter.com/shrutikapoor08) :

<YouTubeIframe src="https://www.youtube.com/embed/ytudH8je5ko" />

## *Streaming Server Rendering with Suspense* {/*streaming-server-rendering-with-suspense*/}

React 18 inclut également des améliorations de performance pour le rendu côté serveur grâce à Suspense.

Le rendu *streamé* côté serveur permet de générer du HTML à partir de composants React côté serveur, puis de streamer ce HTML à vos utilisateurs. Avec React 18, vous pouvez utiliser `Suspense` pour découper votre appli en petits blocs indépendants qui peuvent être streamés individuellement les uns des autres sans bloquer le reste de l'appli. Ça signifie que vos utilisateurs verront votre contenu plus tôt, et pourront interagir avec bien plus vite.

La présentation de [Shaundai Person](https://twitter.com/shaundai) ci-dessous explore ce sujet dans le détail :

<YouTubeIframe src="https://www.youtube.com/embed/pj5N-Khihgc" />

## *The first React working group* {/*the-first-react-working-group*/}

Nous avons créé pour React 18 notre premier groupe de travail afin de collaborer avec un panel d'experts, de développeurs, de mainteneurs de bibliothèques et d'éducateurs.  Nous avons travaillé ensemble pour créer une stratégie d'adoption progressive et affiner les nouvelles API telles que `useId`, `useSyncExternalStore` et `useInsertionEffect`.

Cette présentation d'[Aakansha Doshi](https://twitter.com/aakansha1216) fait un tour d'horizon de ce travail :

<YouTubeIframe src="https://www.youtube.com/embed/qn7gRClrC9U" />

## *React Developer Tooling* {/*react-developer-tooling*/}

Pour prendre en charge les nouvelles fonctionnalités de cette version, nous avons par ailleurs annoncé une nouvelle équipe dédiée aux outils de développement React, ainsi qu'un nouveau *Timeline Profiler* pour aider les développeurs à déboguer leurs applis React.

Pour plus d'informations et une démo des nouvelles fonctionnalités des outils de développement, regardez la présentation de [Brian Vaughn](https://twitter.com/brian_d_vaughn) :

<YouTubeIframe src="https://www.youtube.com/embed/oxDfrke8rZg" />

## *React without memo* {/*react-without-memo*/}

En regardant plus loin encore vers l'avenir, [Xuan Huang (黄玄)](https://twitter.com/Huxpro) nous partage la progression de la recherche des React Labs research autour d'un compilateur auto-mémoïsant. Regardez sa présentation pour plus d'informations et une démo d'un prototype du compilateur :

<YouTubeIframe src="https://www.youtube.com/embed/lGEMwh32soc" />

## *React docs keynote* {/*react-docs-keynote*/}

[Rachel Nabors](https://twitter.com/rachelnabors) a inauguré une séquence de présentations sur l'apprentissage et la conception avec React, au travers d'une plénière retraçant notre investissement dans les nouvelles docs de React ([react.dev](/blog/2023/03/16/introducing-react-dev)) :

<YouTubeIframe src="https://www.youtube.com/embed/mneDaMYOKP8" />

## Et plus encore… {/*and-more*/}

**On trouvait aussi des présentations sur l'apprentissage et la conception avec React :**

* Debbie O'Brien : [Things I learnt from the new React docs](https://youtu.be/-7odLW_hG7s).
* Sarah Rainsberger : [Learning in the Browser](https://youtu.be/5X-WEQflCL0).
* Linton Ye : [The ROI of Designing with React](https://youtu.be/7cPWmID5XAk).
* Delba de Oliveira : [Interactive playgrounds with React](https://youtu.be/zL8cz2W0z34).

**Des présentations par les équipes de Relay, React Native, et PyTorch :**

* Robert Balicki : [Re-introducing Relay](https://youtu.be/lhVGdErZuN4).
* Eric Rozell and Steven Moyes : [React Native Desktop](https://youtu.be/9L4FFrvwJwY).
* Roman Rädle : [On-device Machine Learning for React Native](https://youtu.be/NLj73vrc2I8)

**Et des présentations par la communauté sur l'accessibilité, l'outillage et les Composants Serveur :**

* Daishi Kato : [React 18 for External Store Libraries](https://youtu.be/oPfSC5bQPR8).
* Diego Haz : [Building Accessible Components in React 18](https://youtu.be/dcm8fjBfro8).
* Tafu Nakazaki : [Accessible Japanese Form Components with React](https://youtu.be/S4a0QlsH0pU).
* Lyle Troxell : [UI tools for artists](https://youtu.be/b3l4WxipFsE).
* Helen Lin : [Hydrogen + React 18](https://youtu.be/HS6vIYkSNks).*

## Merci {/*thank-you*/}

C'était la première fois que nous planifiions une conférence nous-mêmes, et nous avons énormément de monde à remercier.

Merci tout d'abord à nos orateurs et oratrices [Aakansha Doshi](https://twitter.com/aakansha1216), [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://twitter.com/brian_d_vaughn), [Daishi Kato](https://twitter.com/dai_shi), [Debbie O'Brien](https://twitter.com/debs_obrien), [Delba de Oliveira](https://twitter.com/delba_oliveira), [Diego Haz](https://twitter.com/diegohaz), [Eric Rozell](https://twitter.com/EricRozell), [Helen Lin](https://twitter.com/wizardlyhel), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes), [Linton Ye](https://twitter.com/lintonye), [Lyle Troxell](https://twitter.com/lyle), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Balicki](https://twitter.com/StatisticsFTW), [Roman Rädle](https://twitter.com/raedle), [Sarah Rainsberger](https://twitter.com/sarah11918), [Shaundai Person](https://twitter.com/shaundai), [Shruti Kapoor](https://twitter.com/shrutikapoor08), [Steven Moyes](https://twitter.com/moyessa), [Tafu Nakazaki](https://twitter.com/hawaiiman0) et  [Xuan Huang (黄玄)](https://twitter.com/Huxpro).

Merci à celles et ceux qui ont aidé en fournissant des retours sur les présentations, notamment [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Dave McCabe](https://twitter.com/mcc_abe), [Eli White](https://twitter.com/Eli_White), [Joe Savona](https://twitter.com/en_JS),  [Lauren Tan](https://twitter.com/potetotes), [Rachel Nabors](https://twitter.com/rachelnabors) et [Tim Yung](https://twitter.com/yungsters).

Merci [Lauren Tan](https://twitter.com/potetotes) pour avoir mis en place le Discord de la conférence et avoir joué le rôle de notre administrateur Discord.

Merci à [Seth Webster](https://twitter.com/sethwebster) pour ses retours sur la direction générale et pour s'être assuré que nous mettions l'accent sur la diversité et l'inclusion.

Merci à [Rachel Nabors](https://twitter.com/rachelnabors) pour avoir lancé nos efforts de modération, et à [Aisha Blake](https://twitter.com/AishaBlake) pour avoir créé notre guide de modération, avoir piloté notre équipe de modérateurs, avoir formé les traducteurs et modérateurs, et avoir aidé à modérer les deux événements.

Merci à nos modérateurs [Jesslyn Tannady](https://twitter.com/jtannady), [Suzie Grange](https://twitter.com/missuze), [Becca Bailey](https://twitter.com/beccaliz), [Luna Wei](https://twitter.com/lunaleaps), [Joe Previte](https://twitter.com/jsjoeio), [Nicola Corti](https://twitter.com/Cortinico), [Gijs Weterings](https://twitter.com/gweterings), [Claudio Procida](https://twitter.com/claudiopro), Julia Neumann, Mengdi Chen, Jean Zhang, Ricky Li et [Xuan Huang (黄玄)](https://twitter.com/Huxpro).

Merci à [Manjula Dube](https://twitter.com/manjula_dube), [Sahil Mhapsekar](https://twitter.com/apheri0) et Vihang Patel de [React India](https://www.reactindia.io/), ainsi qu'à [Jasmine Xie](https://twitter.com/jasmine_xby), [QiChang Li](https://twitter.com/QCL15) et [YanLun Li](https://twitter.com/anneincoding) de [React China](https://twitter.com/ReactChina), pour avoir aidé à modérer notre réédition et y avoir maintenu une atmosphère vivante et intéressante pour la communauté.

Merci à Vercel pour avoir publié leur [guide de démarrage pour un événement virtuel](https://vercel.com/virtual-event-starter-kit), qui a servi de base pour le site web de la conférence, et à [Lee Robinson](https://twitter.com/leeerob) et [Delba de Oliveira](https://twitter.com/delba_oliveira) pour avoir partagé leur expérience de la tenue de la Next.js Conf.

Merci à [Leah Silber](https://twitter.com/wifelette) pour avoir partagé son expérience de tenue de conférences, les leçons qu'elle a tirées de la tenue de la [RustConf](https://rustconf.com/), et pour son livre [*Event Driven*](https://leanpub.com/eventdriven/) et les conseils qu'il contient sur la tenue de conférences.

Merci à [Kevin Lewis](https://twitter.com/_phzn) et [Rachel Nabors](https://twitter.com/rachelnabors) pour avoir partagé leur expérience de la tenue de la Women of React Conf.

Merci à [Aakansha Doshi](https://twitter.com/aakansha1216), [Laurie Barth](https://twitter.com/laurieontech), [Michael Chan](https://twitter.com/chantastic) et [Shaundai Person](https://twitter.com/shaundai) pour leurs conseils et idées tout au long de la planification.

Merci à [Dan Lebowitz](https://twitter.com/lebo) pour avoir aidé à designer et construire le site web de la conférence et la billetterie.

Merci à Laura Podolak Waddell, Desmond Osei-Acheampong, Mark Rossi, Josh Toberman et les autres membres de l'équipe Facebook Video Productions pour avoir enregistré les vidéos de la plénière et des présentations des employé·e·s de Meta.

Merci à notre partenaire HitPlay pour avoir aidé à organiser la conférence, pour le montage de toutes les vidéos lors du streaming, pour la traduction de toutes les présentations, et pour la modération du Discord dans plusieurs langues.

Enfin, merci à tous·tes les participants·es pour avoir contribué à faire une super React Conf!
