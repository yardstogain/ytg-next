import { Paper } from '@mantine/core';
import React from 'react';
import { Footer } from './Footer';
import { Navigation } from './Navigation';

export function Layout({ children }) {
  return (
    <>
      <Navigation />
      <Paper
        sx={{
          position: 'absolute',
          top: 0,
          left: 300,
          right: 0,
        }}
      >
        {children}
        <Footer
          data={[
            { title: 'cats', links: [{ label: 'kittis', link: '/cats' }] },
          ]}
        />
      </Paper>
    </>
  );
}
