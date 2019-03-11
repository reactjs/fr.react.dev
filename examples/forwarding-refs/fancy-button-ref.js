import FancyButton from './FancyButton';

// highlight-next-line
const ref = React.createRef();

// Le composant FancyButton que nous avons importé est le HOC LogProps.
// Même si le rendu sera le même,
// Notre ref indiquera LogProps au lieu du composant FancyButton !
// Cela signifie par exemple que nous ne pouvons pas appeler ref.current.focus()
// highlight-range{4}
<FancyButton
  label="Cliquez moi"
  handleClick={handleClick}
  ref={ref}
/>;
