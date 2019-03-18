class ScrollingList extends React.Component {
  listRef = null;
  previousScrollOffset = null;

  // highlight-range{1-8}
  componentWillUpdate(nextProps, nextState) {
    // Est-ce qu’on ajoute de nouveaux éléments à la liste ?
    // Capturons la position de défilement pour pouvoir l’ajuster plus tard.
    if (this.props.list.length < nextProps.list.length) {
      this.previousScrollOffset =
        this.listRef.scrollHeight - this.listRef.scrollTop;
    }
  }

  // highlight-range{1-11}
  componentDidUpdate(prevProps, prevState) {
    // Si `previousScrollOffset` est défini, on vient d’ajouter des éléments.
    // Il faut alors ajuster la position de défilement pour que ces nouveaux
    // éléments ne poussent pas les anciens hors de la zone visible.
    if (this.previousScrollOffset !== null) {
      this.listRef.scrollTop =
        this.listRef.scrollHeight -
        this.previousScrollOffset;
      this.previousScrollOffset = null;
    }
  }

  render() {
    return (
      <div ref={this.setListRef}>{/* ...contenu... */}</div>
    );
  }

  setListRef = ref => {
    this.listRef = ref;
  };
}
