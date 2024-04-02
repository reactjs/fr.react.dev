---
title: Avertissement de dépréciation de react-test-renderer
---

## Avertissement sur ReactTestRenderer.create() {/*reacttestrenderercreate-warning*/}

react-test-renderer est déprécié.  Un avertissement sera déclenché chaque fois que vous appellerez ReactTestRenderer.create() ou ReactShallowRender.render(). Le module react-test-renderer restera disponible sur NPM mais ne sera plus maintenu, ce qui pourrait poser problème avec les nouvelles fonctionnalités de React, ou suite à des changements internes à React.

L'équipe React vous conseille de migrer vos tests vers [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) ou [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started) pour une expérience de tests plus moderne et bien maintenue.

## Nouvel avertissements sur ShallowRenderer() {/*new-shallowrenderer-warning*/}

Le module react-test-renderer n'exporte plus de moteur de rendu superficiel *via* `react-test-renderer/shallow`. Il s'agissait d'un simple enrobage d'un module précédemment extrait : `react-shallow-renderer`. Vous pouvez donc continuer à utiliser le moteur de rendu superficiel en l'installant directement. Consultez [Github](https://github.com/enzymejs/react-shallow-renderer) / [NPM](https://www.npmjs.com/package/react-shallow-renderer).
