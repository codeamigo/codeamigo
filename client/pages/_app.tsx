import '../styles/fonts/icomoon/style.css';
import '../styles/globals.css';
import 'github-markdown-css/github-markdown.css';

import { ApolloProvider } from '@apollo/client';
import { config } from '@state/app';
import { client } from '@utils/withApollo';
import { AppProps } from 'next/app';
import { createOvermind } from 'overmind';
import { Provider } from 'overmind-react';
import React from 'react';

import Layout from '../layouts';
import Modals from '../modals';
import AuthProvider from '../providers/AuthProvider';

export const overmind = createOvermind(config, { devtools: true });

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Provider value={overmind}>
        <AuthProvider>
          <Layout pathname={router.pathname}>
            <Component {...pageProps} />
          </Layout>
          <Modals />
        </AuthProvider>
      </Provider>
    </ApolloProvider>
  );
}

export default MyApp;
