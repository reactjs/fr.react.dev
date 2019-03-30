// Avant
class ExampleComponent extends React.Component {
  // highlight-range{1-10}
  componentWillMount() {
    this.setState({
      subscribedValue: this.props.dataSource.value,
    });

    // Ce code est dangereux : fuites de mémoire en vue !
    this.props.dataSource.subscribe(
      this.handleSubscriptionChange
    );
  }

  componentWillUnmount() {
    this.props.dataSource.unsubscribe(
      this.handleSubscriptionChange
    );
  }

  handleSubscriptionChange = dataSource => {
    this.setState({
      subscribedValue: dataSource.value,
    });
  };
}
