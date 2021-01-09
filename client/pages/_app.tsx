import '../styles/fonts/icomoon/style.css';
import '../styles/globals.css';
import 'github-markdown-css/github-markdown.css';
import 'codeamigo-jest-lite/dist/prettify.css';

import { ApolloProvider } from '@apollo/client';
import { client } from '@utils/withApollo';
import { AppProps } from 'next/app';
import React from 'react';

import Layout from '../layouts';
import Modals from '../modals';
import AuthProvider from '../providers/AuthProvider';

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Layout pathname={router.pathname}>
          <Component {...pageProps} />
        </Layout>
        <Modals />
      </AuthProvider>
    </ApolloProvider>
  );
}

export default MyApp;
