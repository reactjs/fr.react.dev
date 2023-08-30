---
title: Avertissement de prop ARIA invalide
---

Cet avertissement est déclenché lorsque vous tentez d'afficher un élément DOM avec une prop `aria-*` qui n'existe pas dans la [spécification](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) *Web Accessibility Initiative* (WAI) *Accessible Rich Internet Application* (ARIA).

1. Si vous pensez utiliser une prop valide, vérifiez attentivement l'orthographe. `aria-labelledby` et `aria-activedescendant` sont souvent mal orthographiées.

2. Si vous avez écrit `aria-role`, vous pensiez probablement à `role`.

3. Pour les autres cas, si vous êtes sur la dernière version de React DOM et avez vérifié que vous utilisiez bien un nom de propriété valide listé dans la spécification ARIA, merci de nous [signaler le bug](https://github.com/facebook/react/issues/new/choose).
