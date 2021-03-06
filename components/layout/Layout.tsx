import { FunctionComponent } from 'react';
import { ThemeProvider } from '@material-ui/core';
import { ApolloProvider } from '@apollo/client';
import Head from 'next/head';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import client from '../../gql';
import theme from './theme';

const Layout: FunctionComponent = ({ children }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'relative',
      backgroundColor: '#F5F5F5',
    }}
  >
    <Head>
      <title>App</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </ThemeProvider>
    </ApolloProvider>
  </div>
);

export default Layout;
