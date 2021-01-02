import '../styles/fonts/icomoon/style.css';
import '../styles/globals.css';
import 'github-markdown-css/github-markdown.css';

import { ApolloProvider } from '@apollo/client';
import { client } from '@utils/withApollo';
import { AppProps } from 'next/app';
import React from 'react';

import Layout from '../layouts';
import Modals from '../modals';

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Layout pathname={router.pathname}>
        <Component {...pageProps} />
      </Layout>
      <Modals />
    </ApolloProvider>
  );
}

export default MyApp;
