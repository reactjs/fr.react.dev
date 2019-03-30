// Assurez-vous que la forme de la valeur par défaut passée à
// createContext correspond à la forme que les consommateurs attendent !
// highlight-range{2-3}
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});
