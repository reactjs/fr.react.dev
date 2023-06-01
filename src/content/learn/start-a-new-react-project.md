---
title: Créer un nouveau projet React
---

<Intro>

Si vous voulez créer une nouvelle appli ou un nouveau site web avec React, nous recommandons de choisir un des frameworks React populaire dans la communauté. Les frameworks offrent des fonctionnalités dont la pluplart des applis et sites ont en besoin, à savoir la gestion des routes, la collecte de données et la géneration du code HTML.

</Intro>

<Note>

**Vous devez installer [Node.js](https://nodejs.org/en/) pour le développement local.** Vous pouvez *aussi* choisir d'utiliser Node.js en production, mais rien ne vous oblige de le faire. Plusieurs frameworks React prennent en charge l’exportation vers un dossier HTML/CSS/JS statique.

</Note>

## Production-grade React frameworks {/*production-grade-react-frameworks*/}

### Next.js {/*nextjs*/}

**[Next.js](https://nextjs.org/) est un framework React complet**. Il est versatile et vous permet de créer des applis React de toute taille - d’un blog statique à une appli complexe et dynamique. Pour créer un nouveau projet avec Next.js, Exécutez dans votre terminal :

<TerminalBlock>
npx create-next-app
</TerminalBlock>

Si Next.js est nouveau pour vous, consultez le [tutoriel de Next.js](https://nextjs.org/learn/foundations/about-nextjs).

Next.js est maintenu par [Vercel](https://vercel.com/). Vous pouvez  [déployer une appli Next.js](https://nextjs.org/docs/deployment) sur tout hébergement sans serveur (serverless) Node.js, ou sur vôtre propre serveur. Les [applis Next.js](https://nextjs.org/docs/advanced-features/static-html-export) peuvent être déployées sur tout serveur d’hébergement.

### Remix {/*remix*/}

**[Remix](https://remix.run/) est un framework React complet avec une gestion de route interne**. Il vous permet de subdiviser votre appli en plusieurs parties qui chargeront les données en parallèle et rafraîchir en réponse aux actions de l’utilisateur. Pour créer un nouveau projet avec Remix, exécutez :

<TerminalBlock>
npx create-remix
</TerminalBlock>

Si Remix est nouveau pour vous, consultez le [tutoriel du blog](https://remix.run/docs/en/main/tutorials/blog) (court) et le [tutoriel de l’appli](https://remix.run/docs/en/main/tutorials/jokes) (long).

Remix est maintenu par [Shopify](https://www.shopify.com/). Lorsque vous créez un projet avec Remix, vous devez [choisir votre cible de déploiement](https://remix.run/docs/en/main/guides/deployment). Vous pouvez déployer une appli Remix sur tout hébergement Node.js ou serverless en utilisant ou écrivant un [adaptateur](https://remix.run/docs/en/main/other-api/adapter).

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) est un framework React pour des sites webs rapides à base de CMS**. Son écosytème riche en extension et sa couche de données GraphQL simplifie l’intégration de contenu, des API, et des services sur un site web. Pour créer un nouveau project avec Gatsby, exécutez :

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

Si Gatsby est nouveau pour vous, consultez le [tutoriel de Gatsby](https://www.gatsbyjs.com/docs/tutorial/).

Gatsby est maintenu par [Netlify](https://www.netlify.com/). Vous pouvez [déployer un site  entièrement statique avec Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) vers un hébergement statique. Si vous choisissez d’utiliser des fonctionnalités réservées au serveur, assurez-vous que votre hébergeur les prend en charge pour Gatsby.

### Expo (pour les applis natives) {/*expo*/}

**[Expo](https://expo.dev/) est un framework React qui vous permet de créer des applis Android, iOS et web avec des interfaces utilisateur (UIs) réellement natives**. Il founit un SDK pour [React Native](https://reactnative.dev/) qui facilite l’utilisation des parties natives.
Pour créer un nouveau projet avec Expo, exécutez :

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

Si Expo est nouveau pour vous, consultez le [tutoriel d’Expo](https://docs.expo.dev/tutorial/introduction/).

Expo est maintenu par [Expo (la Compagnie)](https://expo.dev/about). Créez des applis avec Expo est gratuit, et vous pouvez les publier sur les plateformes Google play et Apple store sans restrictions. Expo propose des services cloud payants.

<DeepDive>

#### Puis-je utiliser React sans un framework ? {/*can-i-use-react-without-a-framework*/}

Vous pouvez utiliser React sans un framework, c’est ainsi qu'on [utilise React pour une partie de votre page](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page). **Cependant, si vous créez une nouvelle appli ou un site entièrement statique avec React, nous recommandons l’utilisation d’un framework**.

En voici les raisons.

Même si vous n’avez pas besoin d’un gestionnaire de routes ou de récupération de données au départ, vous aimeriez ajouter des bibliothèques. Au fur et à mesure que votre bundle JavaScript devient énorme avec de nouvelles fonctionnalités, vous devrez peut-être trouver un moyen de diviser le code pour chaque route individuellement. Lorsque vos besoins en matière de collecte de données se complexifient, vous risquez de rencontrer des cascades de réseaux serveur-client qui rendront votre appli très lente. Comme votre public comprend plus d’utilisateurs avec de mauvaises conditions de réseau et des appareils bas de gamme, vous pourriez avoir besoin de générer du HTML à partir de vos composants pour afficher le contenu tôt - soit sur le serveur, soit pendant le temps de construction. Modifier votre configuration pour exécuter une partie de votre code sur le serveur ou pendant la construction peut s'avérer très délicat.

**Ces problèmes ne sont pas spécifiques à React. C’est pourquoi Svelte a SvelteKit, Vue a Nuxt, etc**. Pour résoudre ces problèmes par vous-même, vous devrez intégrer votre bundler à votre gestionnaire de routes et à votre bibliothèque de récupération de données. Il n’est pas difficile d’obtenir une configuration initiale qui fonctionne, mais il y a beaucoup de subtilités impliquées dans la création d’une appli qui se charge rapidement même si elle grandit au fil du temps. Vous voudrez envoyer le minimum de code de l’appli, mais en un seul aller-retour client-serveur, en parallèle avec toutes les données requises pour la page. Vous souhaiterez probablement que la page soit interactive avant même que votre code JavaScript ne soit exécuté, afin de prendre en charge l’amélioration progressive. Vous souhaiterez peut-être générer un dossier de fichiers HTML entièrement statiques pour vos pages de marketing, qui pourront être hébergés n’importe où et fonctionneront toujours avec JavaScript désactivé. La mise en place de ces fonctionnalités demande un réel travail.

**Les frameworks React présentés sur cette page résolvent les problèmes de ce type par défaut, sans travail supplémentaire de votre part**. Ils vous permettent de commencer de manière très légère et de faire évoluer votre appli en fonction de vos besoins. Chaque framework React dispose d’une communauté, ce qui facilite la recherche de réponses aux questions et la mise à jour des outils. Les frameworks donnent également une structure à votre code, ce qui vous aide, vous et les autres, à conserver le contexte et les compétences entre différents projets. Inversement, avec une configuration personnalisée, il est plus facile de rester bloqué sur des versions de dépendances non prises en charge, et vous finirez essentiellement par créer votre propre framework - bien qu’il n’y ait pas de communauté ou de chemin de mise à niveau (et s’il ressemble à ceux que nous avons faits dans le passé, il est conçu de manière plus aléatoire).

Si vous n’êtes toujours pas convaincu, ou si votre appli a des contraintes inhabituelles qui ne sont pas bien servies par ces frameworks et que vous souhaitez mettre en place votre propre configuration personnalisée, nous ne pouvons pas vous arrêter - allez-y ! Prenez `react` et `react-dom` sur npm, mettez en place votre processus de construction personnalisé avec un bundler comme [Vite](https://vitejs.dev/) ou [Parcel](https://parceljs.org/), et ajoutez d’autres outils lorsque vous en avez besoin pour la gestion des routes, l’exportation statique ou le rendu côté serveur, et plus encore.
</DeepDive>

## Bleeding-edge React frameworks {/*bleeding-edge-react-frameworks*/}

Alors que nous cherchions comment continuer à améliorer React, nous avons réalisé que l’intégration de React plus étroitement avec les frameworks (en particulier, avec la gestion de routes, de regroupement et de serveur) est notre plus grande opportunité d’aider les utilisateurs de React à construire de meilleures applis. L’équipe Next.js a accepté de collaborer avec nous dans la recherche, le développement, l’intégration et le test de fonctionnalités React de pointe agnostiques aux frameworks comme les [composants serveur React](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).

Ces fonctionnalités se rapprochent chaque jour un peu plus de la production, et nous avons discuté avec d’autres développeurs de bundlers et de frameworks pour les intégrer. Nous espérons que d’ici un an ou deux, tous les frameworks listés sur cette page auront un support complet de ces fonctionnalités. (Si vous êtes un auteur de framework intéressé par un partenariat avec nous pour expérimenter ces fonctionnalités, n’hésitez pas à nous le faire savoir).

### Next.js (l’appli routeur) {/*nextjs-app-router*/}

**[Next.js's App Router](https://beta.nextjs.org/docs/getting-started) is a redesign of the Next.js APIs aiming to fulfill the React team’s full-stack architecture vision.** Il vous permet de recevoir les données dans des composants asynchrone qui s’executent sur le serveur ou pendant la définition.

Next.js est maintenu par [Vercel](https://vercel.com/). Vous pouvez [déployer une appli Next.js](https://nextjs.org/docs/deployment) sur tout serveur d’hébergement Node.js ou serverless, ou sur vôtre propre serveur. Next.js prend en charge également [l’exportation statique](https://beta.nextjs.org/docs/configuring/static-export) qui ne requiert pas de serveur.
<Pitfall>

L’appli routeur de Next.js est **véritablement en mode béta et n’est pas recommandé en production** (à partir de Mars 2023). Pour l’expérimenter dans un projet Next.js existant, [suivez ce guide de migration](https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app).

</Pitfall>

<DeepDive>

#### Quelles sont les fonctionnalités qui composent la vision de l'architecture full-stack de l'équipe React ? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Le routeur d’appli de Next.js implémente entièrement de manière officielle la [spécification des composants serveurs React](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). Cela vous permet de mélanger des composants de type période d’exécution, serveur et interactifs dans une seule et même arborescence React.

Par example, vous pouvez écrire un composant serveur React comme une fonction `async` qui lit à partir d’une base de donnée ou d’un fichier. Vous pouvez transmettre des données aux composants interactifs :

```js
// Ce composant s’exécute *seulement* sur le serveur (ou pendant la création).
async function Talks({ confId }) {
  // 1. Vous êtes sur le serveur, vous pouvez communiquer avec votre couche de donné. L’API n'est pas necessaire.
  const talks = await db.Talks.findAll({ confId });

  // 2. Ajoute toute charge de logique de rendu. Il n’augmentera pas la taille de votre bundle JavaScript.
  const videos = talks.map(talk => talk.video);

  // 3. Transmettre la donnée aux composants qui s'executera dans le navigateur.
  return <SearchableVideoList videos={videos} />;
}
```

L’appli routeur de Next.js intègre également la [collecte de données avec Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). Ceci vous permet de spécifier un chargement d’état local (comme un squelette de chargement) pour différentes parties de votre interface utilisateur directement dans votre arborescence React : 

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Les composants serveur et suspense sont des fonctionnalités de React plutôt que de Next.js. Cependant, leur adoption au niveau du framework nécessite une adhésion et un travail d’implémentation non trivial. Pour l’instant, l’appli routeur de Next.js est l’implémentation la plus complète. L’équipe React travaille avec les développeurs de bundlers pour faciliter l’implémentation de ces fonctionnalités dans la prochaine génération de frameworks.

</DeepDive>
