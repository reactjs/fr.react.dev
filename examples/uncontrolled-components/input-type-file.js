class FileInput extends React.Component {
  constructor(props) {
    // highlight-range{3}
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }
  handleSubmit(event) {
    // highlight-range{4}
    event.preventDefault();
    alert(
<<<<<<< HEAD
      `Fichier sélectionné - ${
        this.fileInput.current.files[0].name
      }`
=======
      `Selected file - ${this.fileInput.current.files[0].name}`
>>>>>>> 7e4f503d86bee08b88eed77a6c9d06077863a27c
    );
  }

  render() {
    // highlight-range{5}
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Envoyer un fichier :
          <input type="file" ref={this.fileInput} />
        </label>
        <br />
        <button type="submit">Envoyer</button>
      </form>
    );
  }
}

ReactDOM.render(
  <FileInput />,
  document.getElementById('root')
);
