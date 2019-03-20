// Contexte de thème, clair par défaut
const ThemeContext = React.createContext('light');

// Contexte d’utilisateur authentifié
const UserContext = React.createContext({
  name: 'Invité',
});

class App extends React.Component {
  render() {
    const {signedInUser, theme} = this.props;

    // Le composant App qui donne accès aux différentes valeurs des contextes
    // highlight-range{2-3,5-6}
    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Layout />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

function Layout() {
  return (
    <div>
      <Sidebar />
      <Content />
    </div>
  );
}

// Un composant peut consommer plusieurs contextes
function Content() {
  // highlight-range{2-10}
  return (
    <ThemeContext.Consumer>
      {theme => (
        <UserContext.Consumer>
          {user => (
            <ProfilePage user={user} theme={theme} />
          )}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}
