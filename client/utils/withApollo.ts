import { ApolloClient, InMemoryCache } from '@apollo/client';
import { withApollo as createWithApollo } from 'next-apollo';

import { isAuthenticatedVar, modalVar } from '../apollo/cache';

export const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          modal: {
            read: () => {
              return modalVar();
            },
          },
        },
      },
      User: {
        fields: {
          isAuthenticated: {
            read: () => {
              return isAuthenticatedVar();
            },
          },
        },
      },
    },
  }),
  credentials: 'include',
  uri: `${process.env.NEXT_PUBLIC_API_URL}`,
});

export default createWithApollo(client);
