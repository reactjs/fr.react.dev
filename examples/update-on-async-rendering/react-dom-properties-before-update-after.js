class ScrollingList extends React.Component {
  listRef = null;

  // highlight-range{1-10}
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Est-ce qu’on ajoute de nouveaux éléments à la liste ?
    // Capturons la position de défilement pour pouvoir l’ajuster plus tard.
    if (prevProps.list.length < this.props.list.length) {
      return (
        this.listRef.scrollHeight - this.listRef.scrollTop
      );
    }
    return null;
  }

  // highlight-range{1-10}
  componentDidUpdate(prevProps, prevState, snapshot) {
    // Si `snapshot` est défini, on vient d’ajouter des éléments.
    // Il faut alors ajuster la position de défilement pour que ces nouveaux
    // éléments ne poussent pas les anciens hors de la zone visible.
    // (`snapshot` est ici la valeur renvoyée par `getSnapshotBeforeUpdate`.)
    if (snapshot !== null) {
      this.listRef.scrollTop =
        this.listRef.scrollHeight - snapshot;
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
