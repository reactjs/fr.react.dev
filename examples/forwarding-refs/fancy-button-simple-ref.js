// highlight-range{1-2}
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// Vous pouvez maintenant obtenir une ref directement attachée au bouton DOM :
const ref = React.createRef();
<FancyButton ref={ref}>Cliquez ici</FancyButton>;
