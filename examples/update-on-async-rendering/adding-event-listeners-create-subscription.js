import {createSubscription} from 'create-subscription';

const Subscription = createSubscription({
  getCurrentValue(sourceProp) {
    // Renvoie la valeur courante de l’abonnement (sourceProp).
    return sourceProp.value;
  },

  subscribe(sourceProp, callback) {
    function handleSubscriptionChange() {
      callback(sourceProp.value);
    }

    // S’abonne (ex. ajoute un écouteur d’événements) à la source (sourceProp).
    // Appelle `callback(newValue)` dès que l’abonnement notifie un changement.
    sourceProp.subscribe(handleSubscriptionChange);

    // Renvoie une fonction de désabonnement.
    return function unsubscribe() {
      sourceProp.unsubscribe(handleSubscriptionChange);
    };
  },
});

// Plutôt que de passer la source sur laquelle s'abonner à notre ExampleComponent,
// on pourrait juste lui passer la valeur suivie directement :
<Subscription source={dataSource}>
  {value => <ExampleComponent subscribedValue={value} />}
</Subscription>;
