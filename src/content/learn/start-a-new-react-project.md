---
title: Créer un nouveau projet React
---

<Intro>

Si vous voulez créer une nouvelle appli ou un nouveau site web avec React, nous recommandons de choisir un des frameworks React populaires auprès de la communauté.

</Intro>

Vous pouvez utiliser React sans framework, mais nous avons constaté que la plupart des applis et sites finissent par avoir besoin de solutions à des problématiques courantes telles que la découpe de code, la gestion des routes, le chargement de données et la génération du code HTML. Ces problématiques existent dans toutes les bibliothèques UI, pas seulement React.

En commençant avec un framework, vous pouvez démarrer plus vite avec React et vous épargner ce qui revient à construire votre propre framework par la suite.

<DeepDive>

#### Puis-je utiliser React sans framework ? {/*can-i-use-react-without-a-framework*/}

Vous pouvez tout à fait utiliser React sans framework ; c’est d'ailleurs ainsi qu'on [utilise React pour une partie de votre page](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page). **Cependant, si vous créez une nouvelle appli ou un site entièrement avec React, nous recommandons l’utilisation d’un framework.**

En voici les raisons.

Même si, au départ, vous n’avez pas besoin d’un gestionnaire de routes ou de charger des données, vous finirez sans doute par ajouter des bibliothèques pour ça. Au fur et à mesure que votre bundle JavaScript grandit avec chaque nouvelle fonctionnalité, vous devrez peut-être trouver un moyen de découper le code pour chaque route individuellement. Lorsque vos besoins en matière de chargement de données se complexifieront, vous risquez de rencontrer des cascades de chargements réseau client-serveur qui ralentiront considérablement votre appli. Lorsque votre public comprendra davantage d’utilisateurs avec de faibles bandes passantes et des appareils bas de gamme, vous aurez probablement besoin de générer du HTML à partir de vos composants pour afficher le contenu plus tôt (soit sur le serveur, soit en amont lors du *build*). Modifier votre configuration pour exécuter une partie de votre code sur le serveur ou au *build peut s'avérer très délicat.

**Ces problèmes ne sont pas spécifiques à React. C’est pourquoi Svelte a SvelteKit, Vue a Nuxt, etc**. Pour résoudre ces problèmes par vous-même, il vous faudrait intégrer votre *bundler* à votre gestionnaire de routes et à votre bibliothèque de chargement de données. Il n’est pas difficile d'obtenir un premier jet, mais la création d’une appli qui se charge rapidement même lorsqu'elle grandit fortement au fil du temps, c'est une affaire pleine de subtilités. Vous voudrez envoyer le minimum de code applicatif, mais en un seul aller-retour client-serveur, en parallèle avec toutes les données requises pour la page. Vous souhaiterez probablement que la page soit interactive avant même que votre code JavaScript ne soit exécuté, afin de prendre en charge l’amélioration progressive. Vous souhaiterez peut-être générer un dossier de fichiers HTML entièrement statiques pour vos pages de marketing, qui pourront être hébergés n’importe où et fonctionneront même avec JavaScript désactivé. La mise en place de ces possibilités demande énormément de travail.

**Les frameworks React présentés sur cette page résolvent les problèmes de ce type par défaut, sans travail supplémentaire de votre part.** Ils vous permettent de commencer de manière très légère et de faire évoluer votre appli en fonction de vos besoins. Chaque framework React dispose d’une communauté, ce qui facilite la recherche de réponses aux questions et la mise à jour des outils. Les frameworks donnent également une structure à votre code, ce qui vous aide, vous et les autres, à conserver le contexte et vos compétences d'un projet à l'autre. Inversement, avec votre propre système, il est plus facile de rester bloqués sur des dépendances obsolètes, et vous finirez essentiellement par créer votre propre framework--mais un framework sans communauté ni processus de mise à niveau (et s’il ressemble à ceux que nous avons construits par le passé, il est conçu de manière plus aléatoire).

Si vous n’êtes toujours pas convaincu·e, ou si votre appli a des contraintes inhabituelles qui ne sont pas bien traitées par ces frameworks et que vous souhaitez mettre en place votre propre configuration personnalisée, nous ne pouvons pas vous arrêter : allez-y ! Prenez `react` et `react-dom` sur npm, mettez en place votre processus de *build* sur-mesure avec un bundler comme [Vite](https://vitejs.dev/) ou [Parcel](https://parceljs.org/), et ajoutez d’autres outils lorsque vous en aurez besoin pour la gestion des routes, l’exportation statique ou le rendu côté serveur, et plus encore.
</DeepDive>

## Frameworks React de qualité reconnue {/*production-grade-react-frameworks*/}

Ces frameworks prennent en charge toutes les fonctionnalités dont vous aurez besoin pour déployer et faire monter à l’échelle votre application en production, tout en travaillant à s’aligner sur notre [vision d’une architecture full-stack](#which-features-make-up-the-react-teams-full-stack-architecture-vision). Tous les frameworks que nous recommandons sont open source, on des communautés actives pour vous aider, et peuvent être déployées sur votre propre serveur ou chez un hébergeur.  Si vous êtes l’auteur·e d’un framework qui voudrait faire partie de cette liste, [faites-nous signe](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+).

### Next.js {/*nextjs-pages-router*/}

**[Next.js (Pages Router)](https://nextjs.org/) est un framework React full-stack**. Il est flexible et vous permet de créer des applis React de toute taille—d’un blog essentiellement statique à une appli complexe et dynamique. Pour créer un nouveau projet avec Next.js, exécutez cette commande dans votre terminal :

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Si Next.js est nouveau pour vous, consultez le [cours officiel de Next.js](https://nextjs.org/learn).

Next.js est maintenu par [Vercel](https://vercel.com/). Vous pouvez  [déployer une appli Next.js](https://nextjs.org/docs/app/building-your-application/deploying) sur tout hébergement *serverless* ou Node.js, ou sur votre propre serveur. Next.js permet également un [export statique](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) qui ne nécessite pas de serveur.

### Remix {/*remix*/}

**[Remix](https://remix.run/) est un framework React full-stack avec une gestion de routes imbriquées**. Il vous permet de découper votre appli en plusieurs parties qui chargeront les données en parallèle et se rafraîchiront en réaction aux actions de l’utilisateur. Pour créer un nouveau projet avec Remix, exécutez :

<TerminalBlock>
npx create-remix
</TerminalBlock>

Si Remix est nouveau pour vous, consultez le [tutoriel de blog](https://remix.run/docs/en/main/tutorials/blog) (court) et le [tutoriel d’appli](https://remix.run/docs/en/main/tutorials/jokes) (long).

Remix est maintenu par [Shopify](https://www.shopify.com/). Lorsque vous créez un projet avec Remix, vous devez [choisir votre cible de déploiement](https://remix.run/docs/en/main/guides/deployment). Vous pouvez déployer une appli Remix sur tout hébergement Node.js ou *serverless* en utilisant ou en écrivant un [adaptateur](https://remix.run/docs/en/main/other-api/adapter).

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) est un framework React pour des sites webs rapides à base de CMS**. Son vaste écosystème d'extensions et sa couche de données GraphQL simplifient l’intégration de contenu, d'API et de services pour un site web. Pour créer un nouveau project avec Gatsby, exécutez :

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

Si Gatsby est nouveau pour vous, consultez le [tutoriel de Gatsby](https://www.gatsbyjs.com/docs/tutorial/).

Gatsby est maintenu par [Netlify](https://www.netlify.com/). Vous pouvez [déployer un site Gatsby entièrement statique](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) sur n'importe quel hébergement statique. Si vous choisissez d’utiliser des fonctionnalités réservées au serveur, assurez-vous que votre hébergeur les prend en charge pour Gatsby.

### Expo (pour les applis natives) {/*expo*/}

**[Expo](https://expo.dev/) est un framework React qui vous permet de créer des applis Android, iOS et web avec des interfaces utilisateur (UI) réellement natives.** Il fournit un SDK pour [React Native](https://reactnative.dev/) qui facilite l’utilisation des parties natives. Pour créer un nouveau projet avec Expo, exécutez :

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

Si Expo est nouveau pour vous, consultez le [tutoriel d’Expo](https://docs.expo.dev/tutorial/introduction/).

Expo est maintenu par [Expo (la société)](https://expo.dev/about). Construire des applis avec Expo est gratuit, et vous pouvez les publier sur les plateformes Google Play et Apple Store sans restrictions. Expo propose des services cloud optionnels payants.

## Frameworks React expérimentaux {/*bleeding-edge-react-frameworks*/}

Alors que nous cherchions comment continuer à améliorer React, nous avons réalisé que l’intégration plus étroite de React avec les frameworks (en particulier avec la gestion de routes, le *bundling* et les traitements côté serveur) constitue notre plus grande opportunité d’aider les utilisateurs de React à construire de meilleures applis. L’équipe Next.js a accepté de collaborer avec nous sur la recherche, le développement, l’intégration et les tests de fonctionnalités React de pointe, indépendantes toutefois d'un framework spécifique, comme les [Composants Serveur React](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).

Ces fonctionnalités se rapprochent chaque jour un peu plus de la production, et nous discutons avec d’autres équipes de *bundlers* et de frameworks pour les intégrer. Nous espérons que d’ici un an ou deux, tous les frameworks listés sur cette page auront une prise en charge complète de ces fonctionnalités. (Si vous êtes en charge d'un framework et intéressé·e par un partenariat avec nous pour expérimenter ces fonctionnalités, n’hésitez pas à nous le faire savoir !)

### Next.js (App Router) {/*nextjs-app-router*/}

**[L'*App Router* de Next.js](https://nextjs.org/docs) est une refonte intégrale des API de Next.js qui vise à concrétiser la vision d'architecture full-stack portée par l'équipe de React.** Il vous permet de charger des données dans des composants asynchrones qui s’exécutent sur le serveur ou pendant le *build*.

Next.js est maintenu par [Vercel](https://vercel.com/). Vous pouvez [déployer une appli Next.js](https://nextjs.org/docs/app/building-your-application/deploying) sur tout hébergement Node.js ou *serverless*, ou sur votre propre serveur. Next.js permet également un [export statique](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) qui ne requiert pas de serveur.

<DeepDive>

#### Quelles sont les fonctionnalités qui composent la vision d'architecture full-stack de l'équipe React ? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Le *bundler* dans l'App Router de Next.js implémente entièrement la [spécification officielle des Composants Serveurs React](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). Ça vous permet de mélanger des composants exécutés au *build*, côté serveur et interactivement côté client dans une seule et même arborescence React.

Par example, vous pouvez écrire un Composant Serveur React en tant que fonction `async` qui lit à partir d’une base de données ou d’un fichier. Vous pouvez alors transmettre ces données aux composants interactifs côté client :

```js
// Ce composant s’exécute *seulement* côté serveur (ou pendant le build).
async function Talks({ confId }) {
  // 1. Vous êtes sur le serveur, vous pouvez donc communiquer avec votre couche de données.
  // Un point d’accès API n’est pas nécessaire.
  const talks = await db.Talks.findAll({ confId });

  // 2. Ajoutez toute la logique de rendu que vous voulez.
  // Ça n’alourdira pas votre bundle JavaScript.
  const videos = talks.map(talk => talk.video);

  // 3. Transmettez les données aux composants qui s’exécuteront dans le navigateur.
  return <SearchableVideoList videos={videos} />;
}
```

L’App Router de Next.js intègre également [le chargement de données avec Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). Ça vous permet de spécifier un état de chargement (comme une interface de substitution) pour différentes parties de votre interface utilisateur directement dans votre arborescence React :

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Les Composants Serveur et Suspense sont des fonctionnalités de React plutôt que de Next.js. Cependant, leur adoption au niveau du framework nécessite une adhésionet un travail d’implémentation significatif. Pour l’instant, l’App Router de Next.js en propose l’implémentation la plus complète. L’équipe React travaille avec les équipes de *bundlers* pour faciliter l’implémentation de ces fonctionnalités dans la prochaine génération de frameworks.

</DeepDive>
