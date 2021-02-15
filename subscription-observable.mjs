/**
 ***  Setup a GraphQL subscription observable  *****************************
 */

// const { execute } = require('apollo-link');
// const { WebSocketLink } = require('apollo-link-ws');
// const { SubscriptionClient } = require('subscriptions-transport-ws');
// const ws = require('ws');

import apolloLink from 'apollo-link'; // SEE HERE FOR REALLY IMPORTANT STUFF: https://www.apollographql.com/docs/link/
// https://github.com/hasura/nodejs-graphql-subscriptions-boilerplate
import apolloLinkWS from 'apollo-link-ws';
// import apolloLinkHttp from 'apollo-link-http';
import subscriptionsTransportWS from 'subscriptions-transport-ws';
import ws from 'ws';
// import fetch from 'cross-fetch';

const { execute, makePromise } = apolloLink;
const { WebSocketLink } = apolloLinkWS;
// const { HttpLink } = apolloLinkHttp;
const { SubscriptionClient } = subscriptionsTransportWS;

const URL = 'ws://localhost:3085/graphql';

const getWsClient = wsURL => {
  const client = new SubscriptionClient(wsURL, { reconnect: true }, ws);
  return client;
};

const wsLink = new WebSocketLink(getWsClient(URL));
// const httpLink = new HttpLink({ uri: URL, fetch });

/**
 * @param {Operation} operation
 // EXAMPLE OPERATION:
 // const operation = {
 //   query: gql`query { hello }`,
 //   variables: {} //optional
 //   operationName: {} //optional
 //   context: {} //optional
 //   extensions: {} //optional
 // };
 * @param {Observer} observer https://github.com/tc39/proposal-observable
 * @returns {SubscriptionObserver} https://github.com/tc39/proposal-observable
 */
export const subscribe = (operation, observer) => {
  const subscription = execute(wsLink, operation).subscribe(observer);
  return subscription;
};

/**
 * @param {Operation} operation
 // EXAMPLE OPERATION:
 // const operation = {
 //   query: gql`query { hello }`,
 //   variables: {} //optional
 //   operationName: {} //optional
 //   context: {} //optional
 //   extensions: {} //optional
 // };
 * @param {Function} dataCallback
 * @param {Function} errorCallback
 * @returns {SubscriptionObserver}
 * See here: https://www.apollographql.com/docs/link/
 */
export const query = (operation, dataCallback, errorCallback) => {
  // prettier-ignore
  return makePromise(execute(wsLink, operation)) // http link?
    .then(dataCallback)
    .catch(errorCallback);
};

export const mutate = query;

// **************************************************

// EXAMPLE OPERATION:
// const operation = {
//   query: gql`query { hello }`,
//   variables: {} //optional
//   operationName: {} //optional
//   context: {} //optional
//   extensions: {} //optional
// };

// // execute returns an Observable so it can be subscribed to
// execute(link, operation).subscribe({
//   next: data => console.log(`received data: ${JSON.stringify(data, null, 2)}`),
//   error: error => console.log(`received error ${error}`),
//   complete: () => console.log(`complete`),
// })
//
// // For single execution operations, a Promise can be used
// makePromise(execute(link, operation))
//   .then(data => console.log(`received data ${JSON.stringify(data, null, 2)}`))
//   .catch(error => console.log(`received error ${error}`))
