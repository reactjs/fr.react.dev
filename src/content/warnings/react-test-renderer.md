---
title: Avertissement de dépréciation de react-test-renderer
---

<<<<<<< HEAD
## Avertissement sur ReactTestRenderer.create() {/*reacttestrenderercreate-warning*/}
=======
TODO: Update this for 19?

## ReactTestRenderer.create() warning {/*reacttestrenderercreate-warning*/}
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

react-test-renderer est déprécié.  Un avertissement sera déclenché chaque fois que vous appellerez ReactTestRenderer.create() ou ReactShallowRender.render(). Le module react-test-renderer restera disponible sur NPM mais ne sera plus maintenu, ce qui pourrait poser problème avec les nouvelles fonctionnalités de React, ou suite à des changements internes à React.

L'équipe React vous conseille de migrer vos tests vers [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) ou [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started) pour une expérience de tests plus moderne et bien maintenue.

## Nouvel avertissements sur ShallowRenderer() {/*new-shallowrenderer-warning*/}

<<<<<<< HEAD
Le module react-test-renderer n'exporte plus de moteur de rendu superficiel *via* `react-test-renderer/shallow`. Il s'agissait d'un simple enrobage d'un module précédemment extrait : `react-shallow-renderer`. Vous pouvez donc continuer à utiliser le moteur de rendu superficiel en l'installant directement. Consultez [Github](https://github.com/enzymejs/react-shallow-renderer) / [NPM](https://www.npmjs.com/package/react-shallow-renderer).
=======
## new ShallowRenderer() warning {/*new-shallowrenderer-warning*/}

The react-test-renderer package no longer exports a shallow renderer at `react-test-renderer/shallow`. This was simply a repackaging of a previously extracted separate package: `react-shallow-renderer`. Therefore you can continue using the shallow renderer in the same way by installing it directly. See [Github](https://github.com/enzymejs/react-shallow-renderer) / [NPM](https://www.npmjs.com/package/react-shallow-renderer).
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3
