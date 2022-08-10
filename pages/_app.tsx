import { AppProps } from 'next/app';
import { Layout } from '../components';
import { MantineProvider } from '@mantine/core';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { UserProvider } from '@supabase/auth-helpers-react';

export default function App({ Component, pageProps }: AppProps) {
  // globalStyles();
  // title: string;
  // links: {
  //   label: string;
  //   link: string;
  // }

  return (
    <UserProvider supabaseClient={supabaseClient}>
      <MantineProvider
        theme={{ colorScheme: 'dark' }}
        withNormalizeCSS
        withGlobalStyles
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </UserProvider>
  );
}
