class FancyButton extends React.Component {
  focus() {
    // ...
  }

  // ...
}

// Plutôt que d'exporter FancyButton, nous exportons LogProps.
// Cependant, ça affichera tout de même un FancyButton.
// highlight-next-line
export default logProps(FancyButton);
