import { ApolloClient, InMemoryCache } from '@apollo/client';
import { withApollo as createWithApollo } from 'next-apollo';

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  credentials: 'include',
  uri: 'http://localhost:4000/graphql',
});

export default createWithApollo(client);
