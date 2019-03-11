function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('anciennes props:', prevProps);
      console.log('nouvelles props:', this.props);
    }

    render() {
      // highlight-next-line
      const {forwardedRef, ...rest} = this.props;

      // Affecte la prop personnalisée "forwardedRef" en tant que ref
      // highlight-next-line
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // Notez le deuxième paramètre "ref" fourni par "React.forwardRef".
  // Nous pouvons le transmettre à LogProps comme une prop normale, par exemple "forwardedRef"
  // Et il peut ensuite être attaché au composant.
  // highlight-range{1-3}
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
