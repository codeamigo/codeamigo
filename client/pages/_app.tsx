import '../styles/fonts/icomoon/style.css';
import '../styles/App.css';
import '../styles/hint/hint.min.css';
import 'github-markdown-css/github-markdown.css';

import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { applyTheme } from 'styles/appThemes/utils';

import { client } from '👨‍💻utils/withApollo';

import Layout from '../layouts';
import Modals from '../modals';
import AuthProvider from '../providers/AuthProvider';

function MyApp({ Component, pageProps, router }: AppProps) {
  // TODO: save this to the user object
  const [theme, setTheme] = useState('COBALT');

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Codeamigo</title>
        <script
          async
          data-domain="codeamigo.dev"
          defer
          src="https://plausible.io/js/plausible.js"
        ></script>
      </Head>
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
