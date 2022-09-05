import { AppProps } from 'next/app';
import Head from 'next/head';
import { Layout, RouterTransition } from '../components';
import { MantineProvider } from '@mantine/core';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { UserProvider } from '@supabase/auth-helpers-react';
import { NotificationsProvider } from '@mantine/notifications';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="keywords"
          content="fantasy football, fraud list, the pool"
        />
        <meta name="author" content="The Pool Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <MantineProvider
        theme={{
          colorScheme: 'dark',
          fontFamily:
            '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        }}
        withNormalizeCSS
        withGlobalStyles
      >
        <NotificationsProvider>
          <RouterTransition />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NotificationsProvider>
      </MantineProvider>
    </UserProvider>
  );
}
