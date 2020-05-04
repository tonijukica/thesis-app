import App from 'next/app';
import { AuthProvider } from '../auth/context/authProvider';
import '../components/common/carousel/Carousel.css';
import client from '../gql';
import { ApolloProvider } from '@apollo/react-hooks';
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
