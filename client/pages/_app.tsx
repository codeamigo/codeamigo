import '../styles/fonts/icomoon/style.css';
import '../styles/globals.css';
import 'github-markdown-css/github-markdown.css';

import { ApolloProvider } from '@apollo/client';
import { client } from '@utils/withApollo';

import Modals from '../modals';

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  return (
    <ApolloProvider client={client}>
      {' '}
      <Component {...pageProps} />
      <Modals />
    </ApolloProvider>
  );
}

export default MyApp;
