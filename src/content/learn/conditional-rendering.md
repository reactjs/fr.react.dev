---
title: Affichage conditionnel
---

<Intro>

Vos composants devront souvent produire des affichages distincts en fonction de certaines conditions.  Dans React, vous pouvez produire du JSX conditionnellement en utilisant des syntaxes JavaScript telles que les instructions `if` et les opérateurs `&&` et `? :`.

</Intro>

<YouWillLearn>

* Comment renvoyer du JSX différent en fonction d'une condition
* Comment inclure ou exclure conditionnellement un bout de JSX
* Les raccourcis syntaxiques habituels que vous rencontrerez dans les bases de code utilisant React

</YouWillLearn>

## Renvoi conditionnel de JSX {/*conditionally-returning-jsx*/}

Disons que vous avez un composant `PackingList` qui affiche plusieurs `Item`s que vous pouvez marquer comme placés ou non dans les bagages :

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Liste d’affaires de Sally Ride</h1>
      <ul>
        <Item
          isPacked={true}
          name="Combinaison spatiale"
        />
        <Item
          isPacked={true}
          name="Casque à feuille d’or"
        />
        <Item
          isPacked={false}
          name="Photo de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Remarquez que certains composants `Item` ont leur prop `isPacked` à `true` plutôt qu'à `false`.  Vous souhaitez ajouter une coche (✅) aux objets pour lesquels `isPacked={true}`.

Vous pourriez écrire ça sous forme [d'instruction `if`/`else`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/if...else), comme ceci :

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

Si la prop `isPacked` vaut `true`, ce code **renverra un arbre JSX différent**.  Suite à cette modification, certains des éléments auront une coche à la fin :

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Liste d’affaires de Sally Ride</h1>
      <ul>
        <Item
          isPacked={true}
          name="Combinaison spatiale"
        />
        <Item
          isPacked={true}
          name="Casque à feuille d’or"
        />
        <Item
          isPacked={false}
          name="Photo de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Essayez de modifier le balisage renvoyé dans chaque cas, et voyez comme le résultat évolue !

Notez que vous avez créé des branches logiques en utilisant les instructions `if` et `else` de JavaScript. Dans React, le flux de contrôle (tel que les conditions) est géré par JavaScript.

### Conditionnellement ne rien renvoyer avec `null` {/*conditionally-returning-nothing-with-null*/}

Dans certains cas, vous ne voudrez rien renvoyer du tout. Disons par exemple que vous ne souhaitez pas afficher les objets déjà mis dans les bagages.  Un composant doit pourtant bien renvoyer quelque chose. Dans un tel cas, vous pouvez renvoyer `null` :

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

Si `isPacked` est à `true`, le composant ne renverra rien, donc `null`.  Autrement, il renverra le JSX à afficher.

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Liste d’affaires de Sally Ride</h1>
      <ul>
        <Item
          isPacked={true}
          name="Combinaison spatiale"
        />
        <Item
          isPacked={true}
          name="Casque à feuille d’or"
        />
        <Item
          isPacked={false}
          name="Photo de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

En pratique, les composants ne renvoient pas souvent `null` parce que ça peut surprendre le développeur qui essaierait de l'afficher. Vous préférerez généralement inclure ou exclure le composant dans le JSX du composant parent.  Voici comment faire ça !

## Inclure du JSX conditionnellement {/*conditionally-including-jsx*/}

Dans l'exemple précédent, vous contrôliez quel arbre JSX renvoyer (si tant est qu'il y en ait un !) depuis le composant.  Vous avez peut-être remarqué une légère duplication dans l'affichage produit. Ce JSX :

```js
<li className="item">{name} ✅</li>
```

est très similaire à

```js
<li className="item">{name}</li>
```

Les deux branches conditionnelles renvoient `<li className="item">...</li>` :

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

Même si cette duplication n'est pas dangereuse, elle complexifie la maintenance de votre code. Et si vous vouliez changer le `className` ? Vous devriez le mettre à jour à deux endroits de votre code ! Dans un tel cas, vous pourriez plutôt inclure un bout de JSX de façon conditionnelle pour rendre votre code plus [DRY](https://fr.wikipedia.org/wiki/Ne_vous_r%C3%A9p%C3%A9tez_pas).

### Opérateur (ternaire) conditionnel (`? :`) {/*conditional-ternary-operator--*/}

JavaScript dispose d'une syntaxe compacte pour écrire une expression conditionnelle : [l'opérateur conditionnel](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Conditional_Operator), également appelé « ternaire » :

Au lieu de ceci :

```js
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

Vous pouvez plutôt écrire ceci :

```js
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);
```

Vous pouvez le lire comme suit : *« si `isPacked` est vrai, alors (`?`) affiche `name + ' ✅'`, sinon (`:`) affiche `name` »*.

<DeepDive>

#### Ces deux exemples sont-ils vraiment équivalents ? {/*are-these-two-examples-fully-equivalent*/}

Si vous êtes habitué·e à la programmation orientée objet, vous vous dites peut-être que les deux exemples ci-dessus sont subtilement différents parce que l'un d'eux pourrait créer deux « instances » de `<li>`.  mais les éléments JSX ne sont pas des « instances » car ils ne contiennent aucun état interne et ne sont pas de véritables nœuds DOM.  Il s'agit de descriptifs légers, comme des plans de construction. De sorte que ces deux exemples sont *effectivement* parfaitement équivalents. La page [Préserver et réinitialiser l’état](/learn/preserving-and-resetting-state) explore en détail ces aspects.

</DeepDive>

Disons maintenant que vous souhaitez enrober le texte d'un objet mis en bagages par une autre balise HTML, telle que `<del>`, pour le biffer.  Vous pouvez ajouter des sauts de lignes et des parenthèses, pour qu'il soit plus facile d'imbriquer davantage de JSX dans chacun des cas :

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✅'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Liste d’affaires de Sally Ride</h1>
      <ul>
        <Item
          isPacked={true}
          name="Combinaison spatiale"
        />
        <Item
          isPacked={true}
          name="Casque à feuille d’or"
        />
        <Item
          isPacked={false}
          name="Photo de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Ce style fonctionne bien pour des conditions simples, mais utilisez-le avec modération.  Si vos composants deviennent difficiles à lire en raison de trop de balisages conditionnels imbriqués, envisagez d'extraire des composants enfants pour nettoyer tout ça.  Dans React, le balisage fait partie de votre code, vous pouvez donc recourir à des variables et des fonctions pour nettoyer les expressions complexes.

### L'opérateur logique ET (`&&`) {/*logical-and-operator-*/}

Un autre raccourci que vous rencontrerez souvent utilise [l'opérateur ET logique (`&&`) de JavaScript](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.). Dans les composants React, il apparaît souvent lorsque vous souhaitez afficher du JSX lorsqu'une condition est remplie, **ou ne rien afficher dans le cas contraire**.  Avec `&&`, vous pouvez afficher conditionnellement la coche seulement si `isPacked` vaut `true` :

```js
return (
  <li className="item">
    {name} {isPacked && '✅'}
  </li>
);
```

Vous pouvez le lire comme suit : *« si `isPacked` est vrai, alors (`&&`) affiche la coche, sinon n'affiche rien »*.

Le voici en action :

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Liste d’affaires de Sally Ride</h1>
      <ul>
        <Item
          isPacked={true}
          name="Combinaison spatiale"
        />
        <Item
          isPacked={true}
          name="Casque à feuille d’or"
        />
        <Item
          isPacked={false}
          name="Photo de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Une [expression `&&` JavaScript](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Logical_AND) renvoie la valeur de son opérande à droite (dans notre cas, la coche) si l'opérande à gauche (notre condition) vaut `true`.  Mais si la condition vaut `false`, React considèrera `false` comme un « trou » dans l'arbre JSX, tout comme `null` ou `undefined`, et n'affichera rien à cet endroit.


<Pitfall>

**Ne mettez pas des nombres à gauche de `&&`.**

Pour tester la condition, JavaScript convertit automatiquement l'opérande de gauche en booléen.  Seulement voilà, si l'opérande de gauche vaut `0`, alors l'expression entière vaudra `0`, et React sera ravi d'afficher `0` plutôt que rien.

Ainsi, une erreur commune consiste à écrire du code du genre `messageCount && <p>Nouveaux messages</p>`. On peut facilement supposer que ça n'affichera rien si `messageCount` vaut `0`, mais en fait ça affichera le `0` lui-même !

Pour éviter ça, assurez-vous que l'opérande de gauche est un booléen : `messageCount > 0 && <p>Nouveaux messages</p>`.

</Pitfall>

### Affecter conditionnellement du JSX à une variable {/*conditionally-assigning-jsx-to-a-variable*/}

Lorsque les raccourcis rendent votre code compliqué à lire, essayez d'utiliser plutôt une instruction `if` et une variable.  Vous pouvez réaffecter les variables déclarées avec [`let`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/let), alors commencez par le contenu que vous souhaiteriez afficher par défaut, comme le nom :

```js
let itemContent = name;
```

Utilisez une instruction `if` pour réaffecter une expression JSX à `itemContent` si `isPacked` vaut `true` :

```js
if (isPacked) {
  itemContent = name + " ✅";
}
```

[Les accolades « ouvrent une fenêtre » vers JavaScript](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world).  Incorporez la variable entre accolades dans l'arbre JSX renvoyé, ce qui y imbriquera l'expression précédemment calculée :

```js
<li className="item">
  {itemContent}
</li>
```

Ce style est certes le plus verbeux, mais au final le plus flexible.  Le voici en action :

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✅";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Liste d’affaires de Sally Ride</h1>
      <ul>
        <Item
          isPacked={true}
          name="Combinaison spatiale"
        />
        <Item
          isPacked={true}
          name="Casque à feuille d’or"
        />
        <Item
          isPacked={false}
          name="Photo de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Comme précédemment, ça ne marche pas seulement pour le texte, mais pour n'importe quel JSX aussi :

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✅"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Liste d’affaires de Sally Ride</h1>
      <ul>
        <Item
          isPacked={true}
          name="Combinaison spatiale"
        />
        <Item
          isPacked={true}
          name="Casque à feuille d’or"
        />
        <Item
          isPacked={false}
          name="Photo de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Si vous n'êtes pas à l'aise avec JavaScript, cette variété de styles peut vous sembler intimidante au premier abord.  Ceci dit, apprendre ces différents styles vous aidera à lire et écrire n'importe quel code JavaScript — pas seulement des composants React !  Choisissez le style que vous préférez pour commencer, puis revenez sur cette page si vous oubliez quels autres styles marchent aussi.

<Recap>

* Dans React, vous contrôlez les branches logiques avec JavaScript.
* Vous pouvez renvoyer une expression JavaScript conditionnellement avec une instruction `if`.
* Vous pouvez sauver conditionnellement du JSX dans une variable puis l'inclure dans un autre bout de JSX grâce aux accolades.
* En JSX, `{cond ? <A /> : <B />}` signifie *« si `cond`, affiche `<A />`, sinon `<B />` »*.
* En JSX, `{cond && <A />}` signifie *« si `cond`, affiche `<A />`, sinon rien »*.
* Les raccourcis sont fréquents, mais vous n'êtes pas obligé·e de les utiliser si vous préférez de simples `if`.

</Recap>

<Challenges>

#### Afficher un icône pour les objets non traités avec `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Utilisez l'opérateur conditionnel (`cond ? a : b`) pour afficher ❌ si `isPacked` ne vaut pas `true`.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Liste d’affaires de Sally Ride</h1>
      <ul>
        <Item
          isPacked={true}
          name="Combinaison spatiale"
        />
        <Item
          isPacked={true}
          name="Casque à feuille d’or"
        />
        <Item
          isPacked={false}
          name="Photo de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✅' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Liste d’affaires de Sally Ride</h1>
      <ul>
        <Item
          isPacked={true}
          name="Combinaison spatiale"
        />
        <Item
          isPacked={true}
          name="Casque à feuille d’or"
        />
        <Item
          isPacked={false}
          name="Photo de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### Afficher l'importance de l'objet avec `&&` {/*show-the-item-importance-with-*/}

Dans cet exemple, chaque `Item` reçoit une prop d'`importance` numérique.  Utilisez l'opérateur `&&` pour afficher « *(Importance : X)* » en italiques, mais seulement pour les objets dont l'importance n'est pas zéro.  Votre liste d'objets devrait à terme ressembler à ceci :

* Combinaison spatiale _(Importance : 9)_
* Casque à feuille d’or
* Photo de Tam _(Importance : 6)_

N'oubliez pas d'ajouter une espace entre les deux libellés !

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Liste d’affaires de Sally Ride</h1>
      <ul>
        <Item
          importance={9}
          name="Combinaison spatiale"
        />
        <Item
          importance={0}
          name="Casque à feuille d’or"
        />
        <Item
          importance={6}
          name="Photo de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

Voilà qui devrait marcher :

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance : {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Liste d’affaires de Sally Ride</h1>
      <ul>
        <Item
          importance={9}
          name="Combinaison spatiale"
        />
        <Item
          importance={0}
          name="Casque à feuille d’or"
        />
        <Item
          importance={6}
          name="Photo de Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Remarquez qu'il faut écrire `importance > 0 && ...` plutôt que juste `importance && ...` afin de nous assurer que si `importance` vaut `0`, `0` ne sera pas affiché comme résultat !

Dans cette solution, on utilise deux conditions distinctes pour insérer une espace entre le nom et le libellé d'importance.  On aurait aussi pu utiliser un Fragment avec une espace au début : `importance > 0 && <> <i>...</i></>` ou ajouter l'espace immédiatement au début du `<i>` :  `importance > 0 && <i> ...</i>`.

</Solution>

#### Remanier une série de `? :` en `if` sur variables {/*refactor-a-series-of---to-if-and-variables*/}

Le composant `Drink` utilise une série de conditions `? :` pour afficher diverses informations selon que la prop `name`vaut `"thé"` ou `"café"`. Le souci vient de ce que l'information pour chaque boisson est éparpillée à travers de multiples conditions.  Remaniez ce code pour utiliser une seule instruction `if` plutôt que trois conditions `? :`.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Partie de la plante</dt>
        <dd>{name === 'thé' ? 'feuille' : 'grain'}</dd>
        <dt>Dose de caféine</dt>
        <dd>{name === 'thé' ? '15–70 mg/tasse' : '80–185 mg/tasse'}</dd>
        <dt>Âge</dt>
        <dd>{name === 'thé' ? '4 000+ ans' : '1 000+ ans'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="thé" />
      <Drink name="café" />
    </div>
  );
}
```

</Sandpack>

Une fois que vous avez remanié le code pour utiliser `if`, avez-vous des idées pour le simplifier encore plus ?

<Solution>

Il y a de nombreuses façons de procéder, en voici une comme point de départ :

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'thé') {
    part = 'feuille';
    caffeine = '15–70 mg/tasse';
    age = '4 000+ ans';
  } else if (name === 'café') {
    part = 'grain';
    caffeine = '80–185 mg/tasse';
    age = '1 000+ ans';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Partie de la plante</dt>
        <dd>{part}</dd>
        <dt>Dose de caféine</dt>
        <dd>{caffeine}</dd>
        <dt>Âge</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="thé" />
      <Drink name="café" />
    </div>
  );
}
```

</Sandpack>

L'information pour chaque boisson est désormais regroupée au lieu d'être éparpillée à travers de multiples conditions.  Ça simplifie l'ajout ultérieur de nouvelles boissons.

Une autre solution consisterait à carrément retirer la condition en déplaçant l'information dans des objets :

<Sandpack>

```js
const drinks = {
  tea: {
    name: 'Thé',
    part: 'feuille',
    caffeine: '15–70 mg/tasse',
    age: '4 000+ ans'
  },
  coffee: {
    name: 'Café',
    part: 'grain',
    caffeine: '80–185 mg/tasse',
    age: '1 000+ ans'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{info.name}</h1>
      <dl>
        <dt>Partie de la plante</dt>
        <dd>{info.part}</dd>
        <dt>Dose de caféine</dt>
        <dd>{info.caffeine}</dd>
        <dt>Âge</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
