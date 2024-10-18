---
title: experimental_useEffectEvent
---

<Wip>

**Cette API est expérimentale : elle n’a donc pas encore été livrée dans une version stable de React.**

Vous pouvez l'essayer en mettant à jour vos modules React afin d'utiliser la version expérimentale la plus récente :

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Les versions expérimentales de React sont susceptibles de contenir des bugs. Veillez donc à ne pas les utiliser en production.

</Wip>


<Intro>

`useEffectEvent` est un Hook React qui vous permet d'extraire de la logique non réactive dans un [Événement d'Effet](/learn/separating-events-from-effects#declaring-an-effect-event).

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />
