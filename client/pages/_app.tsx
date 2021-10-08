import '../styles/fonts/icomoon/style.css';
import '../styles/App.css';
import '../styles/hint/hint.min.css';
import 'github-markdown-css/github-markdown.css';

import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import React from 'react';

import { client } from '👨‍💻utils/withApollo';

import Layout from '../layouts';
import Modals from '../modals';
import AuthProvider from '../providers/AuthProvider';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Codeamigo</title>
        <meta
          content="Byte-sized interactive coding tutorials"
          name="description"
        />
        <meta
          content="Byte-sized interactive coding tutorials"
          property="og:description"
        ></meta>
        <meta content={`https://codeamigo.dev`} property="og:url"></meta>
        <meta
          content={'https://docs.codeamigo.dev/img/logo.png'}
          property="og:image"
        ></meta>
        <meta content={`Codeamigo`} property="og:title"></meta>
        <meta
          content={`Codeamigo - Learn by doing`}
          name="twitter:title"
        ></meta>
        <meta
          content="Byte-sized interactive coding tutorials"
          name="twitter:description"
        ></meta>
        <meta
          content={'https://docs.codeamigo.dev/img/logo.png'}
          name="twitter:image"
        ></meta>
        <script
          async
          data-domain="codeamigo.dev"
          data-exclude="/auth/**"
          defer
          src="https://plausible.io/js/plausible.exclusions.js"
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
        <Layout pathname={router.pathname}>
          <Component {...pageProps} />
        </Layout>
        <Modals />
      </AuthProvider>
    </ApolloProvider>
  );
}

export default MyApp;
