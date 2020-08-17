import App from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';
import { AuthProvider } from '../auth/context/authProvider';
import '../assets/index.css';
import client from '../gql';

export default class Root extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ApolloProvider client={client}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ApolloProvider>
    );
  }
}
