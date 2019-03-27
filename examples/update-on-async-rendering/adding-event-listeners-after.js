// Après
class ExampleComponent extends React.Component {
  // highlight-range{1-3}
  state = {
    subscribedValue: this.props.dataSource.value,
  };
  // highlight-line
  // highlight-range{1-19}
  componentDidMount() {
    // Les écouteurs d’événements ne devraient être ajoutés qu’après le montage,
    // afin qu’ils ne fassent pas fuiter la mémoire si le montage est interrompu
    // ou lève une erreur.
    this.props.dataSource.subscribe(
      this.handleSubscriptionChange
    );

    // Des valeurs externes pourraient parfois changer entre le rendu et le
    // montage, il est alors important de gérer ce cas de figure.
    if (
      this.state.subscribedValue !==
      this.props.dataSource.value
    ) {
      this.setState({
        subscribedValue: this.props.dataSource.value,
      });
    }
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
