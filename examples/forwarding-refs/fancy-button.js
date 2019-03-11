class FancyButton extends React.Component {
  focus() {
    // ...
  }

  // ...
}

// Plutôt que d'exporter FancyButton, nous exportons LogProps.
// Cependant, le render sera un FancyButton.
// highlight-next-line
export default logProps(FancyButton);
