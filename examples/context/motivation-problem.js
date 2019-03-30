class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // highlight-range{1-4,7}
  // Le composant Toolbar doit prendre une prop supplémentaire `theme` et la
  // passer au ThemedButton. Ça peut devenir pénible si chaque bouton de l’appli
  // a besoin de connaître le thème parce qu’il faudra le faire passer à travers
  // tous les composants.
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

class ThemedButton extends React.Component {
  render() {
    return <Button theme={this.props.theme} />;
  }
}
