---
title: Outils de développement React (React Developer Tools)
---

<Intro>

On utilise les outils de développement React pour inspecter les[composants](/learn/your-first-component), modifier les [props](/learn/passing-props-to-a-component) et les [states](/learn/state-a-components-memory), et identifier des problèmes de performance.

</Intro>

<YouWillLearn>

* Comment installer React Developer Tools

</YouWillLearn>

## Extension de navigateur {/*browser-extension*/}

Le moyen le plus simple pour déboguer un site construit avec React est d'installer l'extension de navigateur React Developer Tools. Il est disponible pour plusieurs navigateurs populaires: 

* [Installation pour **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [Installation pour **Firefox**](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [Installation pour **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

Maintenant, si vous visitez un site Web **construit avec React,** vous pouvez apercevoir les onglets _Components_ et _Profiler_.

![Extension React developer tools ](/images/docs/react-devtools-extension.png)

### Safari et autres navigateurs {/*safari-and-other-browsers*/}
Pour les autres navigateurs (ex: Safari), installez le npm package[`react-devtools`](https://www.npmjs.com/package/react-devtools):
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Puis, ouvrez les outils de développement depuis le terminal:
```bash
react-devtools
```

Ensuite, connectez votre site en ajoutant la balise `<script>` suivante au debut de la balise `<head>` de votre site : 
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

Maintenant, actualisez votre site dans le navigateur pour l'afficher dans les outils de développement. 

![React Developer Tools standalone](/images/docs/react-devtools-standalone.png)

## Mobile (React Native) {/*mobile-react-native*/}
Les outils de développement peuvent egalement être utilisés pour inspecter les Appli construites avec [React Native](https://reactnative.dev/).

La meilleure façon d'utiliser React Developer Tools est de l'installer au global:
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Puis, ouvrez les outils de développement depuis le terminal:
```bash
react-devtools
```

Cela devrait se connecter à toute Appli React Native locale en cours d'exécution.

> Essayez de relancer l'Appli si les outils de développement ne se connectent pas après quelques secondes. 

[En apprendre plus sur le débogage de React Native.](https://reactnative.dev/docs/debugging)