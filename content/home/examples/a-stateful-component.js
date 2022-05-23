class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }

  tick() {
    this.setState(state => ({
      seconds: state.seconds + 1
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        Secondes : {this.state.seconds}
      </div>
    );
  }
}

<<<<<<< HEAD
ReactDOM.render(
  <Timer />,
  document.getElementById('timer-example')
);
=======
root.render(<Timer />);
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c
