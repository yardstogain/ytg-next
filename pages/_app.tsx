import { AppProps } from 'next/app';
import { Layout } from '../components';
import { MantineProvider } from '@mantine/core';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { UserProvider } from '@supabase/auth-helpers-react';
import { NotificationsProvider } from '@mantine/notifications';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
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
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NotificationsProvider>
      </MantineProvider>
    </UserProvider>
  );
}
