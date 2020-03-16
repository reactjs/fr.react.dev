class App extends React.Component {
  render() {
    // highlight-range{2}
    return (
<<<<<<< HEAD
      <Provider value={{something: 'quelque chose'}}>
=======
      <MyContext.Provider value={{something: 'something'}}>
>>>>>>> 2ef0ee1e4fc4ce620dce1f3e0530471195dc64d1
        <Toolbar />
      </MyContext.Provider>
    );
  }
}
