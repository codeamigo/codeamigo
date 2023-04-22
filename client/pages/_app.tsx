import '../styles/fonts/icomoon/style.css';
import '../styles/globals.css';
import '../styles/hint/hint.min.css';
import 'github-markdown-css/github-markdown.css';

import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';

import { client } from '👨‍💻utils/withApollo';

import Layout from '../layouts';
import Modals from '../modals';
import AuthProvider from '../providers/AuthProvider';

Router.events.on('routeChangeStart', () => {
  NProgress.start();
  // @ts-ignore
  window && window.Zigpoll && window?.Zigpoll?.hide();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== 'undefined') {
  if (process.env.NODE_ENV !== 'development') {
    // @ts-ignore
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    });
  }
}

function MyApp({ Component, pageProps, router }: AppProps) {
  useEffect(() => {
    // Track page views
    const handleRouteChange = () => posthog?.capture('$pageview');
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>AI-Powered Coding Tutorials | Codeamigo</title>
        <meta
          content="Learn to code with AI-powered tutorials from Codeamigo."
          name="description"
        />
        <meta
          content="ai assistant, coding tutorials, programming languages, learn to code"
          name="keywords"
        />
        <meta
          content="Learn to code with AI-powered tutorials from Codeamigo."
          name="og:description"
        />
        <meta content={`https://codeamigo.dev`} property="og:url"></meta>
        <meta
          content={'https://docs.codeamigo.dev/img/logo.png'}
          property="og:image"
        ></meta>
        <meta content={`codeamigo`} property="og:title"></meta>
        <meta
          content={`codeamigo - Learn by doing`}
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
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          name="viewport"
        ></meta>
      </Head>
      <PostHogProvider client={posthog}>
        <AuthProvider>
          <Layout pathname={router.pathname}>
            <Component {...pageProps} />
          </Layout>
          <Modals />
        </AuthProvider>
      </PostHogProvider>
    </ApolloProvider>
  );
}

export default MyApp;
