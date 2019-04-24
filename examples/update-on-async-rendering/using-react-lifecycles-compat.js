import React from 'react';
// highlight-next-line
import {polyfill} from 'react-lifecycles-compat';

class ExampleComponent extends React.Component {
  // highlight-next-line
  static getDerivedStateFromProps(props, state) {
    // Votre logique de mise à jour d’état ici...
  }
}

// Polyfillez votre composant pour qu’il fonctionne avec de vieilles versions de React :
// highlight-next-line
polyfill(ExampleComponent);

export default ExampleComponent;
