// highlight-range{1-4}
// Le Contexte nous permet de transmettre une prop profondément dans l'arborescence du composant
// sans la faire passer explicitement à travers tous les composants.
// Créez un contexte pour le thème (avec « clair » par défaut).
const ThemeContext = React.createContext('clair');

class App extends React.Component {
  render() {
    // highlight-range{1-3,5}
    // Utilisez un Provider (fournisseur, NdT) pour passer le thème à l'arborescence ci-dessous.
    // N'importe quel composant peut le lire, quel que soit sa profondeur.
    // Dans cet exemple, nous passons « foncé » comme valeur actuelle.
    return (
      <ThemeContext.Provider value="foncé">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// highlight-range{1,2}
// Un composant au milieu n'a plus à
// transmettre explicitement le thème
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // highlight-range{1-3,6}
  // Assignez un contextType pour lire le contexte du thème actuel.
  // React va trouver le Provider de thème le plus près et utiliser sa valeur.
  // Dans cet exemple, le thème actuel est « foncé ».
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
