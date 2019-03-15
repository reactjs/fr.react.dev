// Après
class ExampleComponent extends React.Component {
  // Initialise l’état dans le constructeur, ou au moyen
  // d’un initialiseur de propriété.
  // highlight-range{1-4}
  state = {
    isScrollingDown: false,
    lastRow: null,
  };

  // highlight-range{1-11}
  static getDerivedStateFromProps(props, state) {
    if (props.currentRow !== state.lastRow) {
      return {
        isScrollingDown: props.currentRow > state.lastRow,
        lastRow: props.currentRow,
      };
    }

    // Renvoie `null` si aucune mise à jour de l’état n’est nécessaire.
    return null;
  }
}
