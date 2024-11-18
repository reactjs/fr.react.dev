---
title: "React 19 RC : guide de migration"
author: Ricky Hanlon
date: 2024/04/25
description: Les améliorations apportées par React 19 RC nécessitent quelques ruptures de compatibilité, mais nous avons travaillé dur pour faciliter la mise à jour le plus possible, et nous ne nous attendons pas à ce que ces changements impactent la majorité des applications. Dans cet article, nous vous guidons étape par étape pour mettre à jour vos applis et bibliothèques vers React 19.
---

Le 25 avril 2024 par [Ricky Hanlon](https://twitter.com/rickhanlonii)

---


<Intro>

Les améliorations apportées par React 19 RC nécessitent quelques ruptures de compatibilité, mais nous avons travaillé dur pour faciliter la mise à jour le plus possible, et nous ne nous attendons pas à ce que ces changements impactent la majorité des applications.

</Intro>

<Note>

#### React 18.3 est également sorti {/*react-18-3*/}

Pour vous aider à migrer vers React 19, nous avons publié une version `react@18.3` identique à la 18.2 mais avec des avertissements sur les API dépréciées et d'autres changements nécessaires pour React 19. 

Nous vous conseillons de d'abord mettre à jour vers React 18.3 pour vous aider à identifier tout problème avant de passer à React 19.

Pour une liste détaillées des modifications de la 18.3, consultez ses [notes de publication](https://github.com/facebook/react/blob/main/CHANGELOG.md).

</Note>

Dans cet article, nous vous guidons à travers les étapes nécessaires à une migration vers React 19 :

- [Installation](#installing)
- [Codemods](#codemods)
- [Ruptures de compatibilité ascendante](#breaking-changes)
- [Nouvelles dépréciations](#new-deprecations)
- [Changements notables](#notable-changes)
- [Changements liés à TypeScript](#typescript-changes)
- [Changelog](#changelog)

Si vous aimeriez nous aider à tester React 19, suivez les étapes de ce guide de migration et [signalez-nous tout problème](https://github.com/facebook/react/issues/new?assignees=&labels=React+19&projects=&template=19.md&title=%5BReact+19%5D) que vous rencontreriez. Pour une liste des nouveautés de React 19, consultez [l’annonce de sortie de React 19](/blog/2024/04/25/react-19).

---

## Installation {/*installing*/}

<Note>

#### La transformation JSX moderne est désormais obligatoire {/*new-jsx-transform-is-now-required*/}

Nous avons publié la [nouvelle transformation JSX](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) en 2020 pour améliorer la taille des bundles et utiliser JSX sans avoir à importer React.  Avec React 19, nous y ajoutons diverses améliorations telles que le traitement des refs comme des props simples ou des améliorations à la performance de JSX, qui exigent le recours à cette nouvelle transformation.

Si la nouvelle transformation n'est pas activée, vous verrez l'avertissement suivant :

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform

</ConsoleLogLine>

</ConsoleBlockMulti>

*(« Votre appli (ou l'une de ses dépendances) utilise une version obsolète de la transformation JSX.  Passez à une transformation JSX moderne pour de meilleures performances »)*

Nous estimons que la plupart des applis ne seront pas affectées par ça, dans la mesure où la transformation moderne est déjà activée dans la plupart des environnements.  Pour des instructions sur une mise à jour manuelle, consultez son [article d'annonce](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).

</Note>

Pour installer la dernière version de React et React DOM :

```bash
npm install --save-exact react@rc react-dom@rc
```

Ou si vous utilisez Yarn :

```bash
yarn add --exact react@rc react-dom@rc
```

Si vous utilisez TypeScript, vous aurez aussi besoin de mettre à jour les types.  Une fois que React 19 sortira en version stable, vous pourrez installer les types au travers des paquets habituels `@types/react` et `@types/react-dom`.  D'ici là, ces types sont mis à disposition par des paquets distincts que vous devrez forcer dans votre `package.json` :

```json
{
  "dependencies": {
    "@types/react": "npm:types-react@rc",
    "@types/react-dom": "npm:types-react-dom@rc"
  },
  "overrides": {
    "@types/react": "npm:types-react@rc",
    "@types/react-dom": "npm:types-react-dom@rc"
  }
}
```

Nous fournissons par ailleurs un codemod pour les remplacements les plus courants.  Consultez par exemple la section [Changements liés à TypeScript](#typescript-changes) plus loin.

## Codemods {/*codemods*/}

Pour vous aider à migrer, nous avons travaillé avec l'équipe de [codemod.com](https://codemod.com) pour publier des codemods qui vont automatiquement mettre à jour votre code vers la plupart des nouvelles API et approches à jour de React 19.

Tous ces codemods sont disponibles au travers du [dépôt `react-codemod`](https://github.com/reactjs/react-codemod) et l'équipe de Codemod nous aide à les maintenir.  Pour les exécuter, nous vous conseillons la commande `codemod` plutôt que `react-codemod` parce qu'elle est plus rapide, permet des migrations plus complexes, et fournit une meilleure gestion de TypeScript.

<Note>

#### Lancer tous les codemods React 19 {/*run-all-react-19-codemods*/}

Pour lancer tous les codemods listés dans ce guide, vous disposez de la recette React 19 de `codemod` :

```bash
npx codemod@latest react/19/migration-recipe
```

Elle exploitera les codemods suivants du dépôt `react-codemod` :
- [`replace-reactdom-render`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-reactdom-render)
- [`replace-string-ref`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-string-ref)
- [`replace-act-import`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-act-import)
- [`replace-use-form-state`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-use-form-state)
- [`prop-types-typescript`](TODO)

Ça n'inclut toutefois pas les changements liés à TypeScript.  Consultez la section [Changements liés à TypeScript](#typescript-changes) plus loin.

</Note>

Dans le reste de cet article, les changements proposant un codemod indiquent la commande à employer.

Pour une liste complète des codemods disponibles, consultez le [dépôt `react-codemod`](https://github.com/reactjs/react-codemod).

## Ruptures de compatibilité ascendante {/*breaking-changes*/}

### Les erreurs lors du rendu ne sont pas propagées {/*errors-in-render-are-not-re-thrown*/}

Dans les versions précédentes de React, les erreurs survenant lors du rendu étaient interceptées puis relancées.  En mode développement, nous les affichions également avec `console.error`, ce qui pouvait entraîner des doublons dans les journaux d'erreurs.

Avec React 19, nous avons [amélioré la gestion des erreurs](/blog/2024/04/25/react-19#error-handling) pour réduire cette duplication en évitant de propager ces erreurs :

- **Erreurs non interceptées** : les erreurs non interceptées par un Périmètre d'Erreurs sont signalées par `window.reportError`.
- **Erreurs interceptées** : les erreurs interceptées par un Périmètre d'Erreurs sont signalées par `console.error`.

Ce changement ne devrait pas impacter la majorité des applis, mais si votre signalement d'erreur en production dépend de la propagation des erreurs, vous aurez peut-être besoin de le mettre à jour. Pour permettre ça, nous avons ajouté des méthodes à `createRoot` et `hydrateRoot` qui permettent de personnaliser la gestion des erreurs :

```js [[1, 2, "onUncaughtError"], [2, 5, "onCaughtError"]]
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    // ... faire un rapport d’erreur
  },
  onCaughtError: (error, errorInfo) => {
    // ... faire un rapport d’erreur
  }
});
```

Pour en savoir plus, consultez les documentations de [`createRoot`](/reference/react-dom/client/createRoot) et [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).

### Retrait d'API React dépréciées {/*removed-deprecated-react-apis*/}

#### Retirés : `propTypes` et `defaultProps` sur les fonctions {/*removed-proptypes-and-defaultprops*/}

Les `PropTypes` étaient dépréciées depuis [avril 2017 (v15.5.0)](https://fr.legacy.reactjs.org/blog/2017/04/07/react-v15.5.0.html#new-deprecation-warnings).

Avec React 19, nous retirons la vérification de `propTypes` du paquet React, et son utilisation sera silencieusement ignorée.  Si vous utilisez encore `propTypes`, nous vous conseillons de passer à TypeScript ou une autre solution de vérification de types.

Nous retirons également la gestion de `defaultProps` pour les fonctions composants, au profit des valeurs par défaut de paramètres fournies par ES6.  Les composants à base de classes continuent à prendre en charge `defaultProps`, puisqu'il n'y a pas de syntaxe ES6 équivalente.

```js
// Avant
import PropTypes from 'prop-types';

function Heading({text}) {
  return <h1>{text}</h1>;
}
Heading.propTypes = {
  text: PropTypes.string,
};
Heading.defaultProps = {
  text: 'Salut tout le monde !',
};
```
```ts
// Après
interface Props {
  text?: string;
}
function Heading({text = 'Salut tout le monde !'}: Props) {
  return <h1>{text}</h1>;
}
```

<Note>

Migrez de `propTypes` à TypeScript avec Codemod :

```bash
npx codemod@latest react/prop-types-typescript
```

</Note>

#### Retirés : les contextes historiques basés sur `contextTypes` et `getChildContext` {/*removed-removing-legacy-context*/}

La gestion historique des contextes était dépréciée depuis [octobre 2018 (v16.6.0)](https://fr.legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html).

La gestion historique des contextes n'était disponible que pour les composants à base de classes au travers des API `contextTypes` et `getChildContext`, et a été remplacée par `contextType` en raison de bugs subtils difficiles à repérer. Avec React 19, nous retirons la gestion historique des contextes pour rendre React un peu plus léger et rapide.

Si vous utilisiez encore les contextes historiques dans des composants à base de classes, vous devrez migrer vers l'API `contextType` qui les remplace :

```js {5-11,19-21}
// Avant
import PropTypes from 'prop-types';

class Parent extends React.Component {
  static childContextTypes = {
    foo: PropTypes.string.isRequired,
  };

  getChildContext() {
    return { foo: 'bar' };
  }

  render() {
    return <Child />;
  }
}

class Child extends React.Component {
  static contextTypes = {
    foo: PropTypes.string.isRequired,
  };

  render() {
    return <div>{this.context.foo}</div>;
  }
}
```

```js {2,7,9,15}
// Après
const FooContext = React.createContext();

class Parent extends React.Component {
  render() {
    return (
      <FooContext value='bar'>
        <Child />
      </FooContext>
    );
  }
}

class Child extends React.Component {
  static contextType = FooContext;

  render() {
    return <div>{this.context}</div>;
  }
}
```

#### Retirées: les refs textuelles {/*removed-string-refs*/}

Les refs textuelles (à base de `string`) étaient dépréciées depuis [mars 2018 (v16.3.0)](https://fr.legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html).

Les composants à base de classes permettaient des refs textuelles avant que celles-ci soient dépréciées au profit de refs par fonction de rappel, en raison de leurs [nombreux inconvénients](https://github.com/facebook/react/issues/1373). Avec React 19, nous retirons les refs textuelles pour rendre React plus simple et plus facile à comprendre.

Si vous utilisez encore des refs textuelles dans les composants à base de classes, vous devrez migrer vers des refs par fonction de rappel :

```js {4,8}
// Avant
class MyComponent extends React.Component {
  componentDidMount() {
    this.refs.input.focus();
  }

  render() {
    return <input ref='input' />;
  }
}
```

```js {4,8}
// Après
class MyComponent extends React.Component {
  componentDidMount() {
    this.input.focus();
  }

  render() {
    return <input ref={input => this.input = input} />;
  }
}
```

<Note>

Migrez des refs textuelles vers des refs par fonction de rappel avec Codemod :

```bash
npx codemod@latest react/19/replace-string-ref
```

</Note>

#### Retirées: les composants « Fabrique » {/*removed-module-pattern-factories*/}

Les composants « Fabrique » *(Module pattern factories — NdT)* étaient dépréciées depuis [août 2019 (v16.9.0)](https://fr.legacy.reactjs.org/blog/2019/08/08/react-v16.9.0.html#deprecating-module-pattern-factories).

Cette approche était rarement utilisée, et sa prise en charge alourdissait inutilement React.  Avec React 19, nous retirons la prise en charge des composants « Fabrique », qu'il vous faudrait migrer vers des fonctions classiques :

```js
// Acant
function FactoryComponent() {
  return { render() { return <div />; } }
}
```

```js
// Après
function FactoryComponent() {
  return <div />;
}
```

#### Retirée : `React.createFactory` {/*removed-createfactory*/}

`createFactory` était dépréciée depuis [février 2020 (v16.13.0)](https://fr.legacy.reactjs.org/blog/2020/02/26/react-v16.13.0.html#deprecating-createfactory).

Il était courant de recourir à `createFactory` avant que JSX devienne suffisamment répandu, mais elle est très rarement utilisée de nos jours, et peut être remplacée par JSX.  Avec React 19, nous retirons `createFactory` que vous devriez migrer vers JSX :

```js
// Avant
import { createFactory } from 'react';

const button = createFactory('button');
```

```js
// Après
const button = <button />;
```

#### Retiré : `react-test-renderer/shallow` {/*removed-react-test-renderer-shallow*/}

Dans React 18, nous avions mis à jour `react-test-renderer/shallow` pour re-exporter [react-shallow-renderer](https://github.com/enzymejs/react-shallow-renderer). Avec React 19, nous retirons `react-test-render/shallow` au profit d'une installation directe du bon paquet :

```bash
npm install react-shallow-renderer --save-dev
```

```diff
- import ShallowRenderer from 'react-test-renderer/shallow';
+ import ShallowRenderer from 'react-shallow-renderer';
```

<Note>

##### Le rendu superficiel, une fausse bonne idée {/*please-reconsider-shallow-rendering*/}

Le rendu superficiel dépend des détails d'implémentation de React et peut vous empêcher de faire de futures mises à jour.  Nous vous conseillons de migrer vos tests vers [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) ou [@testing-library/react-native](https://testing-library.com/docs/react-native-testing-library/intro). 

</Note>

### Retrait d'API React DOM dépréciées {/*removed-deprecated-react-dom-apis*/}

#### Retiré : `react-dom/test-utils` {/*removed-react-dom-test-utils*/}

Nous avons déplacé `act` de `react-dom/test-utils` vers le paquet `react` :

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

`ReactDOMTestUtils.act` is deprecated in favor of `React.act`. Import `act` from `react` instead of `react-dom/test-utils`. See https://react.dev/warnings/react-dom-test-utils for more info.

</ConsoleLogLine>

</ConsoleBlockMulti>

*(« `ReactDOMTestUtils.act` est dépréciée en faveur de `React.act`. Importez `act` depuis `react` plutôt que `react-dom/test-utils`. Consultez https://fr.react.dev/warnings/react-dom-test-utils pour davantage d’informations. » — NdT)*

Pour corriger cet avertissement, importez `act` depuis `react` :

```diff
- import {act} from 'react-dom/test-utils'
+ import {act} from 'react';
```

Toutes les autres fonctions de `test-utils` ont été retirées.  Ces utilitaires étaient rarement employés, et encourageaient à tort une dépendance à des détails d'implémentation de bas niveau de vos composants et de React.  Avec React 19, ces fonctions lèveront une erreur lors de l'appel, et leurs exports seront retirés lors d'une future version.

Consultez la [page d'avertissement](/warnings/react-dom-test-utils) pour les alternatives possibles.

<Note>

Migrez de `ReactDOMTestUtils.act` à `React.act` avec Codemod :

```bash
npx codemod@latest react/19/replace-act-import
```

</Note>

#### Retirée : `ReactDOM.render` {/*removed-reactdom-render*/}

`ReactDOM.render` était dépréciée depuis [mars 2022 (v18.0.0)](/blog/2022/03/08/react-18-upgrade-guide). Avec React 19, nous retirons `ReactDOM.render`, qu'il vous faudrait migrer vers [`ReactDOM.createRoot`](/reference/react-dom/client/createRoot) :

```js
// Avant
import {render} from 'react-dom';
render(<App />, document.getElementById('root'));

// Après
import {createRoot} from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

<Note>

Migrez de `ReactDOM.render` à `ReactDOMClient.createRoot` avec Codemod :

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### Retirée : `ReactDOM.hydrate` {/*removed-reactdom-hydrate*/}

`ReactDOM.hydrate` était dépréciée depuis [mars 2022 (v18.0.0)](/blog/2022/03/08/react-18-upgrade-guide). Avec React 19, nous retirons `ReactDOM.hydrate` qu'il vous faudrait migrer vers [`ReactDOM.hydrateRoot`](/reference/react-dom/client/hydrateRoot) :

```js
// Avcant
import {hydrate} from 'react-dom';
hydrate(<App />, document.getElementById('root'));

// Après
import {hydrateRoot} from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```

<Note>

Migrez de `ReactDOM.hydrate` à `ReactDOMClient.hydrateRoot` avec Codemod :

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### Retirée : `unmountComponentAtNode` {/*removed-unmountcomponentatnode*/}

`ReactDOM.unmountComponentAtNode` était dépréciée depuis [mars 2022 (v18.0.0)](/blog/2022/03/08/react-18-upgrade-guide). Avec React 19, vous devrez utiliser plutôt `root.unmount()`.


```js
// Avant
unmountComponentAtNode(document.getElementById('root'));

// Après
root.unmount();
```

Pour en apprendre davantage, allez voir les sections sur `root.unmount()` dans les documentations de [`createRoot`](/reference/react-dom/client/createRoot#root-unmount) et [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#root-unmount).

<Note>

Migrez de `unmountComponentAtNode` à `root.unmount` avec Codemod :

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### Retirée : `ReactDOM.findDOMNode` {/*removed-reactdom-finddomnode*/}

`ReactDOM.findDOMNode` était dépréciéee depuis [octobre 2018 (v16.6.0)](https://fr.legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html#deprecations-in-strictmode).

Nous retirons `findDOMNode` parce qu'il s'agit d'un échappatoire historique particulièrement lent à exécuter, fragile à refactorer, ne renvoyant que le premier enfant, et qui mélangeait les niveaux d'abstraction (apprenez-en davantage [ici](https://fr.legacy.reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)). Vous pouvez remplacer `ReactDOM.findDOMNode` par des [refs DOM](/learn/manipulating-the-dom-with-refs) :

```js
// Avant
import {findDOMNode} from 'react-dom';

function AutoselectingInput() {
  useEffect(() => {
    const input = findDOMNode(this);
    input.select()
  }, []);

  return <input defaultValue="Salut" />;
}
```

```js
// Après
function AutoselectingInput() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.select();
  }, []);

  return <input ref={ref} defaultValue="Salut" />
}
```

## Nouvelles dépréciations {/*new-deprecations*/}

### Déprécié : `element.ref` {/*deprecated-element-ref*/}

React 19 considère [`ref` comme une prop](/blog/2024/04/25/react-19#ref-as-a-prop), de sorte que nous déprécions `element.ref` au profit de `element.props.ref`.

Si vous accédez à `element.ref`, vous obtiendrez un avertissement :

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Accessing element.ref is no longer supported. ref is now a regular prop. It will be removed from the JSX Element type in a future release.

</ConsoleLogLine>

</ConsoleBlockMulti>

*(« L'accès à element.ref n'est plus pris en charge. Les refs sont désormais des props classiques. La ref sera retirée du type élément JSX dans une prochaine version. » — NdT)*

### Déprécié : `react-test-renderer` {/*deprecated-react-test-renderer*/}

Nous déprécions `react-test-renderer` parce qu'il implémente son propre environnement de rendu, qui ne correspond pas aux environnements des utilisateurs, encourage la dépendance à des détails d'implémentation, et s'appuie sur l'introspection de structures internes à React.

Ce moteur de rendu de test a été créé avant que des stratégies de test viables soient disponibles, telles que [React Testing Library](https://testing-library.com), et nous conseillons désormais d'utiliser plutôt une bibliothèque de test moderne.

Avec React 19, `react-test-renderer` affiche un avertissement de dépréciation, et recourt désormais à du rendu concurrent. Nous vous conseillons de migrer vos tests vers [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) ou [@testing-library/react-native](https://testing-library.com/docs/react-native-testing-library/intro) pour une expérience de test plus moderne et mieux maintenue.

## Changements notables {/*notable-changes*/}

### Modifications du mode strict {/*strict-mode-improvements*/}

React 19 apporte plusieurs correctifs et améliorations au mode strict.

Lors du double rendu du mode strict en développement, `useMemo` et `useCallback` réutiliseront le résultat mémoïsé du premier rendu lors du second rendu. Les composants qui étaient déjà compatibles avec le mode strict ne devraient constater aucun changement de comportement.

Comme pour tous les comportements du mode strict, il s'agit de faire proactivement émerger des bugs dans vos composants lors du développement, de façon à ce que vous puissiez les corriger avant qu'ils n'atteignent la production.  En développement, le mode strict fait par exemple deux appels aux fonctions de rappel des refs lors du montage initial, pour simuler ce qui se passe lorsqu'un composant monté est remplacé par un affichage Suspense de secours.

### Améliorations de Suspense {/*improvements-to-suspense*/}

Avec React 19, lorsqu'un composant suspend, React committera immédiatement le rendu de secours du périmètre Suspense le plus proche, sans attendre que l'arbre de composants concerné fasse un rendu intégral.  Une fois le commit du rendu de secours terminé, React planifie un nouveau rendu des composants suspendus pour « préchauffer » les requêtes paresseuses du reste de l'arbre :

<Diagram name="prerender" height={162} width={1270} alt="Diagramme de trois étapes, avec un composant parent constituant un périmètre Suspense, et un composant fils qui suspend.  La deuxième étape voit un deuxième composant fils faire son rendu, et la troisième étape remplace l’ensemble par le contenu de secours.">

Auparavant, lorsqu'un composant suspendait, ses adelphes suspendus faisaient leur rendu avant que le commit du contenu de secours.

</Diagram>

<Diagram name="prewarm" height={162} width={1270} alt="Diagramme avec les mêmes étapes que précédemment, sauf que le commit du contenu de secours survient en deuxième étape, et le rendu du deuxième composant dans le périmètre suspendu intervient en troisième étape.">

Avec React 19, lorsqu'un composant suspend, le contenu de secours est committé et seulement ensuite les adelphes suspendus font leur rendu.

</Diagram>

Grâce à ce changement, les contenus de secours Suspense sont affichés plus tôt, et les requêtes paresseuses sont préchauffées au sein de l'arbre suspendu.

### Builds UMD retirés {/*umd-builds-removed*/}

UMD était largement utilisé par le passé, en tant que moyen pratique d'utiliser React sans étape de build.  Il existe aujourd'hui des façons modernes de charger des modules en tant que scripts dans des documents HTML.  À partir de React 19, React ne fournira plus de builds UMD afin de réduire la complexité de ses processus de tests et de livraison.

Pour charger React 19 ay moyen d'une balise script, nous vous conseillons un CDN compatible ESM, tel qu'[esm.sh](https://esm.sh/).

```html
<script type="module">
  import React from "https://esm.sh/react@19/?dev"
  import ReactDOMClient from "https://esm.sh/react-dom@19/client?dev"
  ...
</script>
```

### Les bibliothèques basées sur des détails d'implémentation de React risquent d'être bloquantes {/*libraries-depending-on-react-internals-may-block-upgrades*/}

Cette version inclut des changements à la mécanique interne de React qui sont susceptibles d'impacter des bibliothèques qui auraient persisté à ignorer nos demandes implorantes de ne pas en dépendre, des éléments tels que `SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`. Ces modifications sont nécessaires pour permettre l'arrivée de certaines améliorations dans React 19, et ne casseront aucune bibliothèque qui suivrait nos recommandations.

Au regard de notre [politique de versions](/community/versioning-policy#what-counts-as-a-breaking-change), ces mises à jour ne sont pas listées comme des ruptures de compatibilité ascendante, et nous ne fournissons pas de documentation liée à leur migration.  Notre recommandation reste de retirer tout code basé sur ces détails internes.

Pour refléter l'impact du recours à ces détails internes, nous avons renommé le suffixe `SECRET_INTERNALS` vers `_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE`.

À l'avenir, nous bloquerons de façon plus agressive l'accès aux détails internes de React pour en décourager l'utilisation et nous assurer que les utilisateurs ne seront pas bloqués sur leurs chemins de migration.

## Changements liés à TypeScript {/*typescript-changes*/}

### Retrait de types TypeScript dépréciés {/*removed-deprecated-typescript-types*/}

Nous avons retiré les types TypeScript basés sur des API retirées de React 19. Certains des types retirés ont été déplacés vers des paquets plus appropriés, et d'autres ne sont tout simplement plus nécessaires pour décrire le comportement de React.

<Note>
Nous avons publié [`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/) qui permet de migrer l'essentiel des ruptures de compatibilité liés aux types :

```bash
npx types-react-codemod@latest preset-19 ./path-to-app
```

Si vous avez de nombreux accès fragiles à `element.props`, vous pouvez exécuter le codemod complémentaire suivant :

```bash
npx types-react-codemod@latest react-element-default-any-props ./path-to-your-react-ts-files
```

</Note>

Consultez [`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/) pour une liste des remplacements pris en charge. Si vous estimez qu'un codemod est manquant, vous pouvez suivre la [liste des codemods React 19 manquants](https://github.com/eps1lon/types-react-codemod/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22React+19%22+label%3Aenhancement).

### Les fonctions de nettoyage de `ref` deviennent vérifiées {/*ref-cleanup-required*/}

_Cette modification fait partie du codemod `react-19` sous le nom [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return)._

Suite à l'introduction des fonctions de nettoyage de ref, TypeScript refusera désormais que vous renvoyiez quoi que ce soit d'autres depuis une fonction de rappel de ref.  Le correctif consiste en général à éviter les renvois implicites :

```diff [[2, 1, "("], [2, 1, ")"], [4, 2, "{", 15], [4, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

Le code original renvoyait l'instance de `HTMLDivElement` et TypeScript ne pouvait savoir si vous visiez ou non une fonction de nettoyage.

### `useRef` nécessite un argument {/*useref-requires-argument*/}

_Cette modification fait partie du codemod `react-19` sous le nom [`refobject-defaults`](https://github.com/eps1lon/types-react-codemod/#refobject-defaults)._

Un des anciens reproches liés à TypeScript et React concernait `useRef`. Nous avons ajusté nos types de façon à ce que`useRef` exige désormais un argument. Ça simplifie considérablement sa signature de type. Elle se comporte désormais davantage comme `createContext`.

```ts
// @ts-expect-error: attendait un argument mais n’en a aucun
useRef();
// Ça type
useRef(undefined);
// @ts-expect-error: attendait un argument mais n’en a aucun
createContext();
// Ça type
createContext(undefined);
```

Ça signifie aussi que toutes les refs sont désormais mutables.  Vous ne rencontrerez plus le problème où vous ne pouviez pas muter une ref parce que vous l'aviez initialisée avec `null` :

```ts
const ref = useRef<number>(null);

// Impossible d’assigner à `current` parce qu’elle est perçue comme en lecture seule
ref.current = 1;
```

`MutableRef` est désormais déprécié au profit d'un unique type `RefObject` que `useRef` renverra toujours :

```ts
interface RefObject<T> {
  current: T
}

declare function useRef<T>: RefObject<T>
```

`useRef` a toujours une surcharge de confort pour `useRef<T>(null)` qui renvoie automatiquement `RefObject<T | null>`. Pour faciliter la migration liée à l'exigence d'un argument à `useRef`, une surcharge de confort pour `useRef(undefined)` a été ajoutée qui renvoie automatiquement `RefObject<T | undefined>`.

Consultez la [[RFC] Rendre toutes les refs mutables](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/64772) (en anglais) pour les discussions qui ont mené à ce changement.

### Changements au type TypeScript `ReactElement` {/*changes-to-the-reactelement-typescript-type*/}

_Cette modification fait partie du codemod [`react-element-default-any-props`](https://github.com/eps1lon/types-react-codemod#react-element-default-any-props)._

Les `props` des éléments React ont désormais comme type par défaut `unknown` plutôt que `any` si l'élément est typé comme `ReactElement`. Ça ne vous impacte pas si vous passiez un argument de type à `ReactElement` :

```ts
type Example2 = ReactElement<{ id: string }>["props"];
//   ^? { id: string }
```

Mais si vous vous basiez sur les types par défaut, il vous faut maintenant gérer `unknown` :

```ts
type Example = ReactElement["props"];
//   ^? Avant, c’était typé 'any', mais maintenant 'unknown'
```

Vous ne devriez en avoir besoin que si vous avez beaucoup de code historique basé sur un accès fragile aux props de l'élément.  L'introspection d'élément n'existe qu'au titre d'échappatoire et vous devriez toujours être explicite sur la fragilité de votre accès aux props en utilisant par exemple un `any` explicite.

### L'espace de noms JSX en TypeScript {/*the-jsx-namespace-in-typescript*/}

Cette modification fait partie du codemod `react-19` sous le nom [`scoped-jsx`](https://github.com/eps1lon/types-react-codemod#scoped-jsx).

On nous demandait de longue date de retirer l'espace de noms global `JSX` de nos types, au profit de `React.JSX`.  L'idée était d'éviter une pollution des types globaux, réduisant par là les conflits entre diverses bibliothèques d'UI utilisant JSX.

Vous aurez désormais besoin d'enrober vos augmentations de modules pour l'espace de noms JSX avec un `declare module "..."` :

```diff
// global.d.ts
+ declare module "react" {
    namespace JSX {
      interface IntrinsicElements {
        "my-element": {
          myElementProps: string;
        };
      }
    }
+ }
```

La spécification exacte du module dépendra du moteur JSX que vous avez indiqué dans les `compilerOptions` de votre  `tsconfig.json` :

- Pour `"jsx": "react-jsx"` ça sera `react/jsx-runtime`.
- Pour `"jsx": "react-jsxdev"` ça sera `react/jsx-dev-runtime`.
- Pour `"jsx": "react"` et `"jsx": "preserve"` ça sera `react`.

### Meilleur typage de `useReducer` {/*better-usereducer-typings*/}

`useReducer` améliore son inférence de type grâce à [@mfp22](https://github.com/mfp22).

Cependant, ça nécessitait une rupture de compatibilité ascendante car `useReducer` n'accepte pas le type complet du réducteur comme paramètre de type, mais plutôt soit n'en nécessite aucun (et repose sur l'inférence), soit nécessite les types de l'état et de l'action.

La nouvelle meilleure pratique consiste à _ne pas_ passer de paramètres de type à `useReducer`.

```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer(reducer)
```

Ça pourrait ne pas fonctionner pour des cas à la marge où il vous faudra passer explicitement les types de l'état et de l'action, en passant `Action` dans un tuple :

```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer<State, [Action]>(reducer)
```

Si vous définissez le réducteur à la volée, nous vous conseillons d'annoter plutôt les paramètres de la fonction :

```diff
- useReducer<React.Reducer<State, Action>>((state, action) => state)
+ useReducer((state: State, action: Action) => state)
```

C'est également ce que vous feriez si vous deviez extraire le réducteur de l'appel à `useReducer` :

```ts
const reducer = (state: State, action: Action) => state;
```

## Changelog {/*changelog*/}

### Autres ruptures de compatibilité ascendante {/*other-breaking-changes*/}

- **react-dom**: Erreur sur URL JavaScript dans src/href [#26507](https://github.com/facebook/react/pull/26507)
- **react-dom**: Retrait de `errorInfo.digest` dans `onRecoverableError` [#28222](https://github.com/facebook/react/pull/28222)
- **react-dom**: Retrait de `unstable_flushControlled` [#26397](https://github.com/facebook/react/pull/26397)
- **react-dom**: Retrait de `unstable_createEventHandle` [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: Retrait de `unstable_renderSubtreeIntoContainer` [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: Retrait de `unstable_runWithPriority` [#28271](https://github.com/facebook/react/pull/28271)
- **react-is**: Retrait de méthodes dépréciées dans `react-is` [28224](https://github.com/facebook/react/pull/28224)

### Autres changements notables {/*other-notable-changes*/}

- **react**: Traitement par lot des files sync, default et continuous [#25700](https://github.com/facebook/react/pull/25700)
- **react**: Pas de prérendu des adelphes d'un composant suspendu [#26380](https://github.com/facebook/react/pull/26380)
- **react**: Détecte les boucles infinies dues à des mises à jour en phase de rendu [#26625](https://github.com/facebook/react/pull/26625)
- **react-dom**: Les Transitions en popstate sont désormais synchrones [#26025](https://github.com/facebook/react/pull/26025)
- **react-dom**: Retire l'avertissement des Effets de layout lors du SSR [#26395](https://github.com/facebook/react/pull/26395)
- **react-dom**: Avertit et évite les chaînes vides pour src/href (sauf sur balises d'ancres) [#28124](https://github.com/facebook/react/pull/28124)

Nous publierons un changelog complet avec la version stable de React 19.

---

Merci à [Andrew Clark](https://twitter.com/acdlite), [Eli White](https://twitter.com/Eli_White), [Jack Pope](https://github.com/jackpope), [Jan Kassens](https://github.com/kassens), [Josh Story](https://twitter.com/joshcstory), [Matt Carroll](https://twitter.com/mattcarrollcode), [Noah Lemen](https://twitter.com/noahlemen), [Sophie Alpert](https://twitter.com/sophiebits) et [Sebastian Silbermann](https://twitter.com/sebsilbermann) pour avoir révisé et mis à jour cet article.
