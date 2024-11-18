---
title: React Compiler
---

<Intro>

Cette page fournit une introduction à React Compiler et explique comment l'essayer avec succès.

</Intro>

<Wip>

Cette documentation est un travail en cours.  Davantage de documentation est disponible sur le [dépôt du groupe de travail React Compiler](https://github.com/reactwg/react-compiler/discussions) et sera reportée ici lorsqu'elle se stabilisera.

</Wip>

<YouWillLearn>

* Comment commencer à utiliser le compilateur
* Comment installer le compilateur et le plugin ESLint
* Comment vous dépanner

</YouWillLearn>

<Note>

React Compiler est un nouveau compilateur actuellement en beta, qui a été ouvert au public pour obtenir des retours rapides de la communauté. Même s'il est utilisé en production dans des sociétés comme Meta, déployer le compilateur en production pour votre appli dépendra de la santé de votre base de code et de la rigueur avec laquelle vous respectez les [Règles de React](/reference/rules).

La dernière version beta est disponible au travers de l'étiquette `@beta`, et les versions quotidiennes expérimentales utilisent l'étiquette `@experimental`.

</Note>

React Compiler est un nouveau compilateur actuellement en beta, qui a été ouvert au public pour obtenir des retours rapides de la communauté. Il s'agit d'un outil pour la phase de build qui optimise automatiquement votre appli React. Il fonctionne avec JavaScript et comprend les [Règles de React](/reference/rules), ce qui fait que vous n'avez pas besoin de réécrire quelque code que ce soit pour en bénéficier.

Le compilateur inclut par ailleurs un [plugin ESLint](#installing-eslint-plugin-react-compiler) qui donne accès aux diagnostics issus de l'analyse statique par le compilateur directement dans votre éditeur. **Nous vous conseillons fortement d'utiliser le *linter* dès aujourd'hui.** Le *linter* ne requiert pas l'installation du compilateur, vous pouvez donc vous en servir même si vous n'êtes pas encore prêt·e à essayer le compilateur.

Le compilateur est actuellement disponible *via* l'étiquette `beta`, et vous pouvez l'essayer sur les applis et bibliothèques utilisant React 17+.  Pour installer la beta :

<TerminalBlock>
npm install --save-dev babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

Ou si vous utilisez Yarn :

<TerminalBlock>
yarn add --dev babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

Si vous n'utilisez pas encore React 19, merci de consulter [cette section](#using-react-compiler-with-react-17-or-18) pour des instructions complémentaires.

### Que fait le compilateur ? {/*what-does-the-compiler-do*/}

Pour optimiser les applications, React Compiler mémoïse automatiquement votre code.  Vous avez peut-être déjà l'habitude de mémoïser au travers de fonctions telles que `useMemo`, `useCallback` et `React.memo`. Ces fonctions vous permettent d'indiquer à React que certaines parties de votre appli n'ont pas besoin d'être recalculées si leurs entrées n'ont pas changé, ce qui réduit la charge des mises à jour.  Même si elles sont puissantes, il reste trop facile d'oublier de mémoïser, ou de mal s'y prendre.  Ça peut entraîner des mises à jour inefficaces lorsque React doit examiner des parties de votre UI qui n'ont pas reçu de changements _signifiants_.

Le compilateur utilise sa connaissance de JavaScript et des règles de React pour mémoïser automatiquement des valeurs et groupes de valeurs au sein de vos composants et Hooks.  S'il détecte des infractions aux règles, il évitera automatiquement de compiler les composants et Hooks concernés, et continuera à compiler de façon fiable le reste du code.

<Note>

React Compiler peut détecter statiquement les infractions aux Règles de React, et éviter par sécurité d'optimiser les composants et Hooks concernés.  Il n'est pas nécessaire que le compilateur optimise 100% de votre base de code.

</Note>

Si votre base de code est déjà très bien mémoïsée, vous ne verrez sans doute pas d'amélioration significative des performances grâce au compilateur.  Ceci dit, en pratique mémoïser correctement les dépendances qui sont à l'origine des soucis de performances n'est pas chose aisée à réaliser manuellement.

<DeepDive>

#### Quels genres de mémoïsations effectue le compilateur ? {/*what-kind-of-memoization-does-react-compiler-add*/}

La version initiale de React Compiler se concentre principalement sur **l'amélioration des performances de mise à jour** (les nouveaux rendus de composants existants), elle cible donc les deux cas de figure suivants :

1. **Éviter le re-rendu en cascade de composants**
  * Refaire le rendu de `<Parent />` entraîne un nouveau rendu de nombreux composants dans son arbre de composants, même si seul `<Parent />` a changé.
2. **Éviter des calculs coûteux hors de React**
  * Par exemple, un appel à `expensivelyProcessAReallyLargeArrayOfObjects()` au sein de votre composant ou Hook nécessitant cette donnée.

#### Optimiser les re-rendus {/*optimizing-re-renders*/}

React vous permet d'exprimer votre UI sous forme d'une fonction de votre état courant (plus concrètement : les props, l'état et le Contexte).  Dans son implémentation actuelle, lorsque l'état local d'un composant change, React refait le rendu de ce composant _et de tous ses enfants_ — à moins que vous n'ayez appliqué une forme de mémoïsation manuelle avec `useMemo()`, `useCallback()` ou `React.memo()`. Dans l'exemple qui suit, `<MessageButton>` fera un nouveau rendu chaque fois que l'état local de `<FriendList>` changera :

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} en ligne</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```
[_Examiner cet exemple dans le bac à sable de React Compiler_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

React Compiler applique automatiquement l'équivalent des mémoïsations manuelles, pour garantir que seules les parties pertinentes de l'appli refont leur rendu à chaque changement d'état, ce qu'on appelle parfois de la « réactivité granulaire ».  Dans l'exemple qui précède, React Compiler détermine que la valeur renvoyée par `<FriendListCard />` peut être réutilisée même si `friends` change, et qu'on peut éviter de recréer ce JSX _et_ éviter de refaire le rendu de `<MessageButton>` quand le compteur change.

#### Les calculs coûteux sont aussi mémoïsés {/*expensive-calculations-also-get-memoized*/}

Le compilateur peut aussi automatiquement mémoïser les calculs coûteux utilisés lors du rendu :

```js
// **Pas** mémoïsé par React Compiler, puisque ce n’est ni un composant ni un Hook
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// Mémoïsé par React Compiler puisque c’est un composant
function TableContainer({ items }) {
  // Cet appel de fonction serait mémoïsé :
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[_Examiner cet exemple dans le bac à sable de React Compiler_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

Ceci étant dit, si `expensivelyProcessAReallyLargeArrayOfObjects` est véritablement une fonction coûteuse à l'appel, vous voudrez peut-être implémenter sa propre mémoïsation hors de React, car :

- React Compiler ne mémoïse que les composants et Hooks React, et non chaque fonction
- La mémoïsation de React Compiler n'est pas partagée par de multiples composants ou Hooks

Du coup, si `expensivelyProcessAReallyLargeArrayOfObjects` était utilisée par plusieurs composants distincts, même si exactement les mêmes éléments lui étaient passés, son calcul coûteux serait exécuté plusieurs fois.  Nous vous conseillons de [mesurer](/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) d'abord pour voir si le calcul est véritablement coûteux avant de complexifier votre code avec une mémoïsation manuelle.

</DeepDive>

### Devrais-je essayer le compilateur ? {/*should-i-try-out-the-compiler*/}

Veuillez noter que le compilateur est encore en beta et qu'il reste de nombreuses choses à affiner. Même s'il est déjà utilisé en production dans des sociétés telles que Meta, déployer le compilateur en production pour votre appli dépend de l'état de santé de votre base de code et de la rigueur avec laquelle vous respectez les [Règles de React](/reference/rules).

**Vous n'avez pas à vous précipiter pour utiliser le compilateur dès maintenant.  Vous pouvez parfaitement attendre qu'il atteigne sa version stable avant de l'adopter.**  Ceci dit, nous apprécions les essais à échelle réduite dans vos applis, qui vous permettent de nous [faire des retours](#reporting-issues) afin de nous aider à améliorer le compilateur.

## Démarrage {/*getting-started*/}

En complément de cette documentation, nous vous conseillons de garder un œil sur le [groupe de travail React Compiler](https://github.com/reactwg/react-compiler) pour y trouver davantage d'informations et des discussions autour du compilateur.

### Installer eslint-plugin-react-compiler {/*installing-eslint-plugin-react-compiler*/}

React Compiler alimente également un plugin ESLint.  Le plugin ESLint peut être utilisé **indépendamment** du compilateur, ce qui signifie que vous pouvez tirer parti du plugin ESLint même si vous n'utilisez pas le compilateur.

<TerminalBlock>
npm install --save-dev eslint-plugin-react-compiler@beta
</TerminalBlock>

Ajoutez ensuite ceci à votre configuration ESLint :

```js
import reactCompiler from 'eslint-plugin-react-compiler'

export default [
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
]
```

Ou si vous utilisez encore la forme dépréciée de son fichier de configuration :

```js
module.exports = {
  plugins: [
    'eslint-plugin-react-compiler',
  ],
  rules: {
    'react-compiler/react-compiler': 'error',
  },
}
```

Le plugin ESLint affichera toute violation des règles de React dans votre éditeur.  Lorsqu'il le fait, ça signifie que le compilateur a évité d'optimiser ce composant ou Hook.  Ça ne pose aucun problème, et le compilateur peut retomber sur ses pieds et continuer à optimiser d'autres composants dans votre base de code.


<Note>

**Vous n'avez pas besoin de corriger immédiatement toutes les violations signalées par ESLint.**  Vous pouvez les traiter à votre propre rythme pour augmenter le nombre de composants et Hooks aptes à être optimisés, mais il n'est pas nécessaire de tout corriger avant d'utiliser le compilateur.

</Note>

### Déployer le compilateur sur votre base de code {/*using-the-compiler-effectively*/}

#### Projets existants {/*existing-projects*/}

Le compilateur est conçu pour compiler les fonctions composants et Hooks qui respectent les [Règles de React](/reference/rules). Il peut aussi gérer du code qui enfreint ces règles en évitant d'optimiser ces composants ou Hooks.  Ceci dit, en raison de la nature flexible de JavaScript, le compilateur ne peut pas repérer toutes les violations imaginables et risque de compiler avec des faux négatifs ; c'est à dire qu'il pourrait accidentellement compiler un composant ou Hook qui enfreint les Règles de React, ce qui entraînera un comportement non défini.

Pour cette raison, afin d'adopter avec succès le compilateur sur des projets existants, nous vous conseillons de l'exécuter d'abord sur une petite partie de votre code produit.  Pour cela, vous pouvez configurer le compilateur afin qu'il ne s'exécute que sur un sous-ensemble de vos dossiers :

```js {3}
const ReactCompilerConfig = {
  sources: (filename) => {
    return filename.includes('src/path/to/dir');
  },
};
```

Lorsque vous gagnez en confiance sur votre déploiement du compilateur, vous pouvez étendre son champ d'action à d'autres dossiers, pour progressivement le déployer sur toute votre appli.

#### Nouveaux projets {/*new-projects*/}

Si vous démarrez un nouveau projet, vous pouvez activer le compilateur sur la base de code entière, ce qu'il fait par défaut.

### Utiliser React Compiler avec React 17 ou 18 {/*using-react-compiler-with-react-17-or-18*/}

React Compiler donne ses meilleurs résultats avec React 19 RC. Si vous ne pouvez pas migrer vers cette version, vous pouvez installer le paquet complémentaire `react-compiler-runtime` qui permet au code compilé de tourner sur des versions antérieures à la 19.  Gardez toutefois à l'esprit que la version minimale est la 17.

<TerminalBlock>
npm install react-compiler-runtime@beta
</TerminalBlock>

Vous aurez également besoin d'ajouter la `target` idoine à votre configuration du compilateur, en utilisant la version majeure de React que vous ciblez :

```js {3}
// babel.config.js
const ReactCompilerConfig = {
  target: '18' // '17' | '18' | '19'
};

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig],
    ],
  };
};
```

### Utiliser le compilateur sur des bibliothèques {/*using-the-compiler-on-libraries*/}

React Compiler peut aussi être utilisé pour compiler des bibliothèques. Dans la mesure où React Compiler doit être exécuté sur le code source original, avant toute transformation, il n'est généralement pas possible que la chaîne de construction d'une application compile les bibliothèques dont elle dépend.  C'est pourquoi nous conseillons aux mainteneur·euses de bibliothèques de compiler et tester indépendamment leurs bibliothèques avec le compilateur, et de livrer le code compilé dans npm.

Puisque votre code est pré-compilé, les utilisateur·rices de votre bibliothèque n'auront pas besoin d'activer le compilateur pour bénéficier de la mémoïsation automatique appliquée à votre bibliothèque.  Si celle-ci s'adresse à des applications pas forcément encore sur React 19, pensez à [préciser une `target` et à ajouter `react-compiler-runtime` comme dépendance explicite](#using-react-compiler-with-react-17-or-18) de production.  Ce module d'exécution utilisera une implémentation correcte des API selon la version de React de l'application, et émulera les API manquantes lorsque c'est nécessaire.

Le code de bibliothèque est souvent plus complexe et tend à exploiter certaines échappatoires.  Pour cette raison, nous vous conseillons de tester suffisamment votre code pour identifier tout problème qui pourrait résulter de l'utilisation du compilateur sur votre bibliothèque.  Si vous repérez quelque problème que ce soit, vous pouvez toujours retirer les composants ou Hooks concernés du processus grâce à la [directive `'use no memo'`](#something-is-not-working-after-compilation).

Comme pour les applis, il n'est pas nécessaire de compiler 100% de vos composants et Hooks pour que votre bibliothèque profite de la compilation.  Un bon point de départ consiste à identifier les parties de votre bibliothèque les plus critiques en termes de performances, et à vous assurer qu'elles n'enfreignent pas les [Règles de React](/reference/rules), ce que `eslint-plugin-react-compiler` peut vous aider à vérifier.

## Utilisation {/*installation*/}

### Babel {/*usage-with-babel*/}

<TerminalBlock>
npm install --save-dev babel-plugin-react-compiler@beta
</TerminalBlock>

Le compilateur inclut un plugin Babel que vous pouvez utiliser dans votre chaîne de build pour exécuter le compilateur.

Après installation, ajoutez-le à votre configuration Babel.  Veuillez noter qu'il est indispensable que le compilateur figure **en premier** dans la chaîne de traitement :

```js {7}
// babel.config.js
const ReactCompilerConfig = { /* ... */ };

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig], // doit être en premier !
      // ...
    ],
  };
};
```

`babel-plugin-react-compiler` doit être exécuté d'abord, avant tout autre plugin Babel, car le compilateur a besoin des informations du code source d'origine pour effectuer une analyse fiable.

### Vite {/*usage-with-vite*/}

Si vous utilisez Vite, vous pouvez ajouter le plugin à vite-plugin-react :

```js {10}
// vite.config.js
const ReactCompilerConfig = { /* ... */ };

export default defineConfig(() => {
  return {
    plugins: [
      react({
        babel: {
          plugins: [
            ["babel-plugin-react-compiler", ReactCompilerConfig],
          ],
        },
      }),
    ],
    // ...
  };
});
```

### Next.js {/*usage-with-nextjs*/}

Merci de consulter la [documentation de Next.js](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler) pour les détails de mise en œuvre.

### Remix {/*usage-with-remix*/}

Installez `vite-plugin-babel` et ajoutez-lui le plugin Babel du compilateur :

<TerminalBlock>
npm install --save-dev vite-plugin-babel
</TerminalBlock>

```js {2,14}
// vite.config.js
import babel from "vite-plugin-babel";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    remix({ /* ... */}),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // si vous utilisez TypeScript
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpack {/*usage-with-webpack*/}

Un chargeur Webpack maintenu par la communauté est [désormais disponible ici](https://github.com/SukkaW/react-compiler-webpack).

### Expo {/*usage-with-expo*/}

Veuillez consulter la [documentation d'Expo](https://docs.expo.dev/guides/react-compiler/) pour activer et utiliser React Compiler dans les applis Expo.

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native utilise Babel *via* Metro, consultez donc la section [Utilisation avec Babel](#usage-with-babel) pour les instructions d'installation.

### Rspack {/*usage-with-rspack*/}

Merci de consulter la [documentation de Rspack](https://rspack.dev/guide/tech/react#react-compiler) pour activer et utiliser React Compiler dans les applis Rspack.

### Rsbuild {/*usage-with-rsbuild*/}

Veuillez consulter la [documentation de Rsbuild](https://rsbuild.dev/guide/framework/react#react-compiler) pour activer et utiliser React Compiler dans les applis Rsbuild.

## Dépannage {/*troubleshooting*/}

Pour nous signaler tout problème, façonnez d'abord une reproduction minimaliste sur le [bac à sable React Compiler](https://playground.react.dev/) et ajoutez-la à votre ticket. Vous pouvez ouvrir des tickets sur le dépôt [facebook/react](https://github.com/facebook/react/issues).

Vous pouvez aussi faire des retours au groupe de travail React Compiler en demandant à en devenir membre.  Merci de [lire le README pour savoir comment devenir membre](https://github.com/reactwg/react-compiler).

### Que suppose le compilateur ? {/*what-does-the-compiler-assume*/}

React Compiler suppose que votre code :

1. …est du JavaScript valide et sémantique.
2. …teste que les valeurs et propriétés pouvant être nulles ou optionnelles sont bien définies avant d'y accéder (en activant par exemple [`strictNullChecks`](https://www.typescriptlang.org/tsconfig/#strictNullChecks) si vous utilisez TypeScript), avec par exemple un test du genre `if (object.nullableProperty) { object.nullableProperty.foo }` ou un chaînage optionnel `object.nullableProperty?.foo`.
3. …respecte les [Règles de React](/reference/rules).

React Compiler peut vérifier statiquement la plupart des Règles de React, et évitera par sécurité de compiler lorsqu'il détecte une infraction.  Pour voir celles-ci, nous vous conseillons d'installer [eslint-plugin-react-compiler](https://www.npmjs.com/package/eslint-plugin-react-compiler).

### Comment savoir si mes composants ont été optimisés ? {/*how-do-i-know-my-components-have-been-optimized*/}

[React Devtools](/learn/react-developer-tools) (v5.0+) prend nativement en charge React Compiler et affichera un badge « Memo ✨ » à côté des composants qui ont été optimisés par le compilateur.

### Quelque chose ne fonctionne plus après la compilation {/*something-is-not-working-after-compilation*/}

Si vous avez installé eslint-plugin-react-compiler, le compilateur devrait afficher toute infraction aux règles de React directement dans votre éditeur.  Lorsqu'il le fait, ça signifie que le compilateur a évité d'optimiser ce composant ou Hook.  Ça ne pose aucun problème, et le compilateur peut retomber sur ses pieds et continuer à optimiser les autres composants de votre base de code. **Vous n'avez pas besoin de corriger immédiatement toutes les violations signalées par ESLint.**  Vous pouvez les traiter à votre propre rythme pour augmenter le nombre de composants et Hooks optimisés.

Cependant, en raison de la nature flexible et dynamique de JavaScript, il n'est pas possible de détecter l'intégralité des cas de figure.  Des bugs et comportements non définis tels que des boucles infinies de rendu sont susceptibles de survenir dans de tels cas.

Si votre appli ne fonctionne pas correctement après compilation alors que vous ne constatez aucune erreur ESLint, le compilateur a peut-être compilé à tort votre code.  Pour le confirmer, essayez de faire disparaître le problème en désactivant agressivement tout composant ou Hook qui pourrait être concerné, en utilisant la [directive `"use no memo"`](#use-no-memo).

```js {2}
function SuspiciousComponent() {
  "use no memo"; // retire ce composant du champ d’action de React Compiler
  // ...
}
```

<Note>

#### `"use no memo"` {/*use-no-memo*/}

`"use no memo"` est une échappatoire _temporaire_ qui vous permet de sortir des composants et Hooks du champ d'action de React Compiler.  Cette directive n'a pas vocation à être pérennisée, contrairement par exemple à [`"use client"`](/reference/rsc/use-client).

Nous déconseillons de recourir à cette directive dans la mesure où elle n'est pas à strictement parler nécessaire.  Une fois que vous avez sorti un composant ou Hook du champ d'action, il en reste exclu tant que la directive n'est pas retirée.  Ça signifie que même si vous corrigez le code, le compilateur continuera à éviter de le compiler tant que vous n'aurez pas retiré la directive.

</Note>

Lorsque vous parvenez à éliminer l'erreur, confirmez que le retrait de la directive d'exclusion restaure le problème.  Vous pouvez alors créer un ticket de bug auprès de nous (essayez de produire une reproduction minimaliste, ou s'il s'agit de code libre copiez-collez simplement le code source) en utilisant le [bac à sable React Compiler](https://playground.react.dev) pour que nous puissions identifier et corriger la source du problème.

### Autres problèmes {/*other-issues*/}

Merci de vous référer à [cette discussion](https://github.com/reactwg/react-compiler/discussions/7) pour plus de détails.
