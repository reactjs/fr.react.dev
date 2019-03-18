// Après
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  // highlight-range{1-13}
  static getDerivedStateFromProps(props, state) {
    // On stocke `prevId` dans l’état pour pouvoir la comparer quand les props changent.
    // On efface aussi les données chargées précédemment (pour ne pas afficher des vieux trucs).
    if (props.id !== state.prevId) {
      return {
        externalData: null,
        prevId: props.id,
      };
    }

    // Pas de mise à jour d’état nécessaire.
    return null;
  }

  componentDidMount() {
    this._loadAsyncData(this.props.id);
  }

  // highlight-range{1-5}
  componentDidUpdate(prevProps, prevState) {
    if (this.state.externalData === null) {
      this._loadAsyncData(this.props.id);
    }
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.externalData === null) {
      // Afficher un état de chargement...
    } else {
      // Afficher l’UI réelle...
    }
  }

  _loadAsyncData(id) {
    this._asyncRequest = loadMyAsyncData(id).then(
      externalData => {
        this._asyncRequest = null;
        this.setState({externalData});
      }
    );
  }
}
