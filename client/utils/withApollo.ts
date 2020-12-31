import { ApolloClient, InMemoryCache } from '@apollo/client';
import { withApollo as createWithApollo } from 'next-apollo';

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  credentials: 'include',
  uri: `${process.env.NEXT_PUBLIC_API_URL}`,
});

export default createWithApollo(client);
