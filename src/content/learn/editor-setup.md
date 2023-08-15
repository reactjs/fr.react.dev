---
title: Configuration de l’éditeur
---

<Intro>


Un éditeur correctement configuré peut faciliter la lecture du code et accélérer son écriture. Il peut même vous aider à corriger les bugs dès que vous les écrivez ! Si c'est la première fois que vous configurez un éditeur, ou si vous cherchez à améliorer votre éditeur actuel, nous avons quelques recommandations.
</Intro>

<YouWillLearn>

* Quels sont les éditeurs les plus populaires
* Comment formater votre code automatiquement

</YouWillLearn>

## Votre éditeur {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) est l'un des éditeurs les plus populaires aujourd'hui. Il propose un large choix d'extensions et s'intègre bien avec des services populaires tels que GitHub. La plupart des fonctionnalités listées ci-dessous peuvent être ajoutées à VS Code _via_ des extensions, ce qui le rend très configurable !

Voici d'autres éditeurs utilisés par la communauté React :

* [WebStorm](https://www.jetbrains.com/webstorm/) est un environnement de développement intégré (EDI) spécialement conçu pour JavaScript.
* [Sublime Text](https://www.sublimetext.com/) prend nativement en charge JSX et TypeScript, [la coloration syntaxique](https://stackoverflow.com/a/70960574/458193) et l'autocomplétion.
* [Vim](https://www.vim.org/) est un éditeur de texte extrêmement configurable créé pour optimiser la création et l'édition de tout type de texte. Il est inclus sous le nom de "vi" dans la plupart des systèmes UNIX et dans Apple OS X.

## Fonctionnalités d'éditeur de texte recommandées {/*recommended-text-editor-features*/}

Certains éditeurs incluent ces fonctionnalités d'entrée de jeu, mais d'autres pourraient nécessiter l'installation d'extensions. Vérifiez ce que propose votre éditeur préféré pour être sûr·e !

### Linting {/*linting*/}

Les *linters* (analyseurs statiques) de code trouvent les problèmes dans votre code au moment où vous l'écrivez, ce qui vous aide à les corriger au plus tôt. [ESLint](https://eslint.org/) est un *linter* populaire en logiciel libre pour JavaScript.

* [Installez ESLint avec la configuration recommandée pour React](https://www.npmjs.com/package/eslint-config-react-app) (assurez-vous d'avoir [installé Node](https://nodejs.org/fr/download/current/) !)
* [Intégrez ESLint dans VSCode avec l'extension officielle](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**Assurez-vous d'avoir activé toutes les règles [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) pour votre projet.** Elles sont essentielles et permettent de corriger tôt les bugs les plus graves . Le préréglage [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) les inclut déjà.

### Formatage {/*formatting*/}

La dernière chose que vous aimeriez faire lorsque vous partagez votre code avec d'autres contributeurs, ce serait d'entrer dans une discussion sur les [tabulations vs. espaces](https://www.google.com/search?q=tabs+vs+spaces) ! Heureusement, [Prettier](https://prettier.io/) va nettoyer votre code en le reformatant pour qu'il soit conforme à des règles configurables prédéfinies. Exécutez Prettier, et toutes vos tabulations seront remplacées par des espaces--et vos indentations, guillemets, etc. seront aussi modifiés pour devenir conformes à la configuration. Dans l'idéal, Prettier s'exécute quand vous enregistrez votre fichier, et fait ces ajustements pour vous en un clin d'œil.

Vous pouvez installer [l'extension Prettier pour VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) en suivant ces étapes :

1. Lancez VS Code
2. Utilisez Quick Open (pressez sur Ctrl/Cmd+P)
3. Collez dans le champ texte `ext install esbenp.prettier-vscode`
4. Appuyez sur Entrée

#### Formatage à la sauvegarde {/*formatting-on-save*/}

Dans l'idéal, vous devriez formater votre code à chaque sauvegarde. VS Code a un réglage pour ça !

1. Dans VS Code, appuyez sur `CTRL/CMD + SHIFT + P`.
2. Tapez *"settings"*
3. Appuyez sur Entrée
4. Dans la barre de recherche, entrez *"format on save"*
5. Assurez-vous que l'option "format on save" est cochée !

> Si votre préréglage ESLint contient des règles de formatage, elles peuvent être en conflit avec Prettier. Nous recommandons de désactiver toutes les règles de formatage dans votre préréglage ESLint en utilisant [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) ; ainsi ESLint est utilisé *seulement* pour corriger les erreurs de logique. Si vous voulez que les fichiers soient formatés avant de fusionner une _pull request_, utilisez [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) dans votre intégration continue.
