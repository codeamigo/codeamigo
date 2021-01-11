import { ApolloClient } from '@apollo/client';
import { withApollo as createWithApollo } from 'next-apollo';

import cache from '👨‍💻apollo/cache';

export const client = new ApolloClient({
  cache,
  credentials: 'include',
  uri: `${process.env.NEXT_PUBLIC_API_URL}`,
});

export default createWithApollo(client);
