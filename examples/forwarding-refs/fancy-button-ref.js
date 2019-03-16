import FancyButton from './FancyButton';

// highlight-next-line
const ref = React.createRef();

// Le composant FancyButton que nous avons importé est le HOC LogProps.  Même si
// l’affichage sera le même, notre ref visera LogProps au lieu du composant
// FancyButton !  Ça signifie par exemple que nous ne pouvons pas appeler
// ref.current.focus() highlight-range{4}
<FancyButton
  label="Cliquez ici"
  handleClick={handleClick}
  ref={ref}
/>;
