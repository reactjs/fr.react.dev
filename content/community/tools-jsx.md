---
id: jsx-integrations
title: Intégrations JSX
layout: community
permalink: community/jsx-integrations.html
---

## Intégrations dans les éditeurs {#editor-integrations}

* **[Sublime Text : babel-sublime](https://github.com/babel/babel-sublime)** : des extraits de code, une coloration syntaxique et des thèmes optimisés pour Sublime Text.
* **[Atom : language-babel](https://atom.io/packages/language-babel)** : prise en charge d'ES2016, de JSX et de Flow.
* **[Visual Studio Code](https://code.visualstudio.com/updates/vFebruary#_languages-javascript)** : Visual Studio Code prend en charge JSX par défaut.
* **[JetBrains WebStorm](https://www.jetbrains.com/webstorm/)** : coloration syntaxique, complétion de code et détection d'erreurs pour JSX.
* **[JetBrains IDE Live Templates](https://github.com/Minwe/jetbrains-react)** : des modèles pour les éditeurs de JetBrains (comme WebStorm, PHPStorm, etc.)
* **[javascript-jsx.tmbundle](https://github.com/jjeising/javascript-jsx.tmbundle)** : gestion de la syntaxe pour TextMate.
* **[web-mode.el](http://web-mode.org)** : un mode autonome pour emacs pour l'indentation et la coloration du code JSX. Pas de prise en charge de l'insertion automatique des point-virgules *(Automatic Semicolon Insertion ou ASI, capacité de JS à ne pas exiger les points-virgules dans la plupart des cas, NdT)*.
* **[vim-jsx](https://github.com/mxw/vim-jsx)** : coloration syntaxique et indentation du JSX.

## Outils de construction {#build-tools}

* **[Create React App](https://github.com/facebookincubator/create-react-app)** : une façon **officielle** de créer des applications React sans configuration.
* **[nwb](https://github.com/insin/nwb)** : boîtes à outils pour les applications React, PReact & Inferno et d'autres modules npm pour le web, sans configuration (tant que vous n'en avez pas besoin).
* **[Neutrino](https://neutrino.js.org/)** : créez et construisez des applications JavaScript modernes sans configuration initiale. Neutrino combine la puissance de webpack avec la simplicité des préréglages.
* **[ESLint](https://eslint.org/)** : un linter JavaScript qui comprend la syntaxe JSX de façon native. Assurez-vous de télécharger l'extension [eslint-plugin-react](https://npmjs.com/package/eslint-plugin-react) pour les règles spécifiques à React.
* **[Structor](https://www.npmjs.com/package/structor)** : cet outil est un constructeur d'interfaces utilisateur pour les applications web React utilisant Node.js. Il remplace l'outil déprécié React UI Builder. Vous pouvez regarder [des tutoriels vidéos de Structor](https://youtu.be/z96xYa51EWI?list=PLAcaUOtEwjoR_U6eE2HQEXwkefeVESix1). *(Structor est lui-même déprécié et ses auteurs recommandent d'utiliser [Webcodesk](https://webcodesk.com/) désormais, NdT.)*
* **[react-jsx](https://github.com/bigpipe/react-jsx)** : compilez et utilisez du JSX comme modèles autonomes qui peuvent être exécutés côté serveur ou côté client !
* **[cjsx-codemod](https://github.com/jsdf/cjsx-codemod)** : écrivez du code JSX en Coffeescript !
* **[ReactScript](https://github.com/1j01/react-script)** : écrivez du code React avec Coffeescript sans JSX !
* **[jsxhint](https://npmjs.org/package/jsxhint)** : prise en charge de l'outil [JSHint](http://jshint.com/). À noter que la compilation JSX ne change pas les numéros de ligne, l'analyse *(linting)* peut donc également être faite directement sur le code JS compilé.
* **[reactify](https://npmjs.org/package/reactify)** : transformation pour [Browserify](http://browserify.org/).
* **[Babel](https://babeljs.io/)** : transformation autonome et adaptée à [Browserify](http://browserify.org/) (anciennement appelé **6to5**).
* **[node-jsx](https://npmjs.org/package/node-jsx)** : prise en charge de JSX dans [Node.js](https://nodejs.org/).
* **[react-hot-loader](https://gaearon.github.io/react-hot-loader/)** : chargeur pour [webpack](https://webpack.github.io/) qui vous permet d'éditer le JSX et d'en voir immédiatement les effets dans votre navigateur sans avoir à recharger la page.
* **[jsx-loader](https://npmjs.org/package/jsx-loader)** : chargeur pour [webpack](https://webpack.github.io/).
* **[express-jsxtransform](https://www.npmjs.org/package/express-jsxtransform)** : middleware pour [Express](https://www.npmjs.org/package/express).
* **[gradle-react-plugin](https://github.com/ehirsch/gradle-react-plugin)** : transforme les sources JSX au cours d'une construction faite avec Gradle.
* **[grunt-react](https://npmjs.org/package/grunt-react)** : tâche pour [GruntJS](https://gruntjs.com/).
* **[gulp-react](https://npmjs.org/package/gulp-react)** : extension pour [GulpJS](https://gulpjs.com/).
* **[brunch-react](https://www.npmjs.org/package/react-brunch)** : extension pour [Brunch](https://brunch.io/).
* **[jsx-requirejs-plugin](https://github.com/philix/jsx-requirejs-plugin)** : extension pour [RequireJS](https://requirejs.org/).
* **[react-meteor](https://github.com/benjamn/react-meteor)** : extension pour [Meteor](https://www.meteor.com/).
* **[pyReact](https://github.com/facebook/react-python)** : pont entre [Python](https://www.python.org/) et JSX.
* **[react-rails](https://github.com/facebook/react-rails)** : gem Ruby pour utiliser JSX avec [Ruby on Rails](https://rubyonrails.org/).
* **[react-laravel](https://github.com/talyssonoc/react-laravel)** : paquet PHP pour utiliser React avec [Laravel](https://laravel.com/).
* **[ReactJS.NET](https://reactjs.net/)** : bibliothèque .NET pour React et JSX.
* **[sbt-reactjs](https://github.com/ddispaltro/sbt-reactjs)** : extension JSX du compilateur SBT / Play / Scala.
* **[mimosa-react](https://github.com/dbashford/mimosa-react)** : extension pour [Mimosa](http://mimosa.io).
* **[react-grails-asset-pipeline](https://github.com/peh/react-grails-asset-pipeline)** : fichiers de React et gestion de la précompilation des fichiers JSX pour [Grails](https://grails.org/).
* **[gore-gulp](https://github.com/goreutils/gore-gulp)** : enrobage autour de [webpack](https://webpack.github.io/), [ESLint](https://eslint.org/) et [mocha](https://mochajs.org/) pour faciliter une utilisation sans configuration.
* **[webpack](https://github.com/webpack/webpack)** :  génère des modules CommonJS / AMD pour le navigateur. Il vous permet de découper votre base de code sur plusieurs *bundles* qui peuvent être chargés à la demande. Il se base sur des chargeurs pour traiter préalablement des fichiers tels que du JSON, Jade, Coffee, CSS, LESS, et bien sûr vos propres contenus.
* **[webpack-bbq](https://github.com/wenbing/webpack-bbq)** : transforme votre code présent dans `src/` vers un dossier `lib/`, permet un rendu côté serveur et un rendu statique.
* **[jsxtransformer](https://github.com/cronn-de/jsxtransformer)** : chaîne de compilation Java pour les fichiers JSX.
* **[babylon-jsx](https://github.com/marionebl/babylon-jsx)** : transforme le JSX en ES2015 avec babylon sans babel.
* **[CRA Universal CLI](https://github.com/antonybudianto/cra-universal)** : une interface en ligne de commande simple pour créer et construire des serveurs Express pour vos projets basés sur Create React App, intégrant le rendu côté serveur et le découpage dynamique de code.
