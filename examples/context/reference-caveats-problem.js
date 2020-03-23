class App extends React.Component {
  render() {
    // highlight-range{2}
    return (
<<<<<<< HEAD
      <Provider value={{something: 'quelque chose'}}>
=======
      <MyContext.Provider value={{something: 'something'}}>
>>>>>>> 7e4f503d86bee08b88eed77a6c9d06077863a27c
        <Toolbar />
      </MyContext.Provider>
    );
  }
}
