---
title: Outils de développement React
---

<Intro>

Utilisez les outils de développement React _(React Developer Tools, NdT)_ pour inspecter les [composants](/learn/your-first-component), modifier les [props](/learn/passing-props-to-a-component) et les [états](/learn/state-a-components-memory), et identifier des problèmes de performance.

</Intro>

<YouWillLearn>

* Comment installer les outils de développement React

</YouWillLearn>

## Extension de navigateur {/*browser-extension*/}

Le moyen le plus simple pour déboguer des sites construit avec React consiste à installer l'extension de navigateur *React Developer Tools*. Elle est disponible pour plusieurs navigateurs populaires :

* [Installer dans **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [Installer dans **Firefox**](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [Installer dans **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

Désormais, si vous visitez un site web **construit avec React**, vous pouvez apercevoir au sein des outils de développement du navigateur les onglets _Components_ et _Profiler_.

![Extension React Developer Tools](/images/docs/react-devtools-extension.png)

### Safari et les autres navigateurs {/*safari-and-other-browsers*/}
Pour les autres navigateurs (par exemple Safari), installez le module npm [`react-devtools`](https://www.npmjs.com/package/react-devtools) :
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Ouvrez alors les outils de développement depuis le terminal :
```bash
react-devtools
```

Ensuite, connectez votre site aux outils de développement React en ajoutant la balise `<script>` suivante au début de la balise `<head>` de votre site :
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

Pour finir, rafraîchissez votre page dans le navigateur pour l'afficher dans les outils de développement.

![React Developer Tools en mode autonome](/images/docs/react-devtools-standalone.png)

## Mobile natif (React Native) {/*mobile-react-native*/}
Les outils de développement React peuvent également être utilisés pour inspecter les applis construites avec [React Native](https://reactnative.dev/).

La façon la plus simple d'utiliser les outils de développement React consiste à les installer au global :
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Ouvrez alors les outils de développement depuis le terminal :
```bash
react-devtools
```

Ça devrait se connecter à toute appli React Native locale en cours d'exécution.

> Essayez de relancer l'appli si les outils de développement ne se connectent toujours pas au bout de quelques secondes.

[En apprendre plus sur le débogage de React Native](https://reactnative.dev/docs/debugging).
