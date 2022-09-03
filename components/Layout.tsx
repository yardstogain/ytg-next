import { Paper } from '@mantine/core';
import React, { ReactElement } from 'react';
import { Footer } from './Footer';
import { Navigation } from './Navigation';

type LayoutProps = {
  children: ReactElement;
};

export function Layout({ children }: LayoutProps) {
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
            {
              title: 'Games',
              links: [{ label: 'Fraud List', link: '/fraud-list/about' }],
            },
          ]}
        />
      </Paper>
    </>
  );
}
