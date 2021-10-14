import { ApolloClient, ApolloLink, from, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist';
import { withApollo as createWithApollo } from 'next-apollo';

import cache, { statusVar } from '👨‍💻apollo/cache';

const httpLink = new HttpLink({
  credentials: 'include',
  uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
});

const errorLink = onError(({ networkError }) => {
  statusVar({
    ...statusVar(),
    connected: false,
    error: networkError?.message || '',
  });
});

const activityLink = new ApolloLink((operation, forward) => {
  // add the recent-activity custom header to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
    },
  }));

  statusVar({
    connected: true,
    error: '',
    lastSaved: new Date().toISOString(),
  });

  return forward(operation);
});

export const client = new ApolloClient({
  cache,
  link: from([errorLink, activityLink, httpLink]),
});

export default createWithApollo(client);
