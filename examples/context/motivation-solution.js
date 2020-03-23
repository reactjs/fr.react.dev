// highlight-range{1-4}
// Le Contexte nous permet de transmettre une prop profondément dans l’arbre des
// composants sans la faire passer explicitement à travers tous les composants.
// Crée un contexte pour le thème (avec “light” comme valeur par défaut).
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // highlight-range{1-3,5}
    // Utilise un Provider pour passer le thème plus bas dans l’arbre.
    // N’importe quel composant peut le lire, quelle que soit sa profondeur.
    // Dans cet exemple, nous passons “dark” comme valeur actuelle.
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

<<<<<<< HEAD
// highlight-range{1,1}
// Un composant au milieu n’a plus à transmettre explicitement le thème
function Toolbar(props) {
=======
// highlight-range{1,2}
// A component in the middle doesn't have to
// pass the theme down explicitly anymore.
function Toolbar() {
>>>>>>> 7e4f503d86bee08b88eed77a6c9d06077863a27c
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // highlight-range{1-3,6}
  // Définit un contextType pour lire le contexte de thème actuel.  React va
  // trouver le Provider de thème ancêtre le plus proche et utiliser sa valeur.
  // Dans cet exemple, le thème actuel est “dark”.
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
