class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Sommes-nous en train d’ajouter de nouveaux éléments à la liste ?
    // Sauvegardons la position de défilement pour la recaler plus tard.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Si nous avons une valeur sauvegardée, c’est que nous venons d’ajouter des
    // éléments. Ajustons le défilement pour que ces nouveaux éléments ne
    // décalent pas les anciens hors du champ de vision. (ici `snapshot` est la
    // valeur renvoyée par getSnapshotBeforeUpdate.)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contenu... */}</div>
    );
  }
}
