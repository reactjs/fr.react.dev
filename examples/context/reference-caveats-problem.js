class App extends React.Component {
  render() {
    // highlight-range{2-3}
    return (
      <MyContext.Provider
        value={{something: 'quelque chose'}}>
        <Toolbar />
      </MyContext.Provider>
    );
  }
}
