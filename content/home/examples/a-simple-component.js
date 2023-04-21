class HelloMessage extends React.Component {
  render() {
    return <div>Salut {this.props.name}</div>;
  }
}

root.render(<HelloMessage name="Thierry" />);
