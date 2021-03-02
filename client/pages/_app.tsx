import '../styles/fonts/icomoon/style.css';
import '../styles/App.css';
import '../styles/hint/hint.min.css';
import 'github-markdown-css/github-markdown.css';

import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'next-auth/client';
import React from 'react';

import { client } from '👨‍💻utils/withApollo';

import Layout from '../layouts';
import Modals from '../modals';
import AuthProvider from '../providers/AuthProvider';

function MyApp({ Component, pageProps, router }: AppProps) {
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
        <link
          href="/favicon/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link
          href="/favicon/favicon-32x32.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/favicon/favicon-16x16.png"
          rel="icon"
          sizes="16x16"
          type="image/png"
        />
        <link href="/favicon/site.webmanifest" rel="manifest" />
        <link
          color="#5bbad5"
          href="/favicon/safari-pinned-tab.svg"
          rel="mask-icon"
        />
        <meta content="#da532c" name="msapplication-TileColor" />
        <meta content="#ffffff" name="theme-color"></meta>
      </Head>
      <AuthProvider>
        <Provider session={pageProps.session}>
          <Layout pathname={router.pathname}>
            <Component {...pageProps} />
          </Layout>
        </Provider>
        <Modals />
      </AuthProvider>
    </ApolloProvider>
  );
}

export default MyApp;
