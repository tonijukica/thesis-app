import App from 'next/app';
import Router from 'next/router';
import { Auth0Provider } from 'use-auth0-hooks';

const onRedirectCallback = (appState: any) => {
  if (appState && appState.returnTo) {
    Router.push({
      pathname: appState.returnTo.pathname,
      query: appState.returnTo.query
    })
  }
};

/**
 * When it hasn't been possible to retrieve a new access token.
 * @param {Error} err 
 * @param {AccessTokenRequestOptions} options 
 */
const onAccessTokenError = (err: any) => {
  console.error('Failed to retrieve access token: ', err);
};

/**
 * When signing in fails for some reason, we want to show it here.
 * @param {Error} err 
 */
const onLoginError = (err: any) => {
  Router.push({
    pathname: '/oops',
    query: {
      message: err.error_description || err.message
    }
  })
};

export default class Root extends App {
  render () {
    const { Component, pageProps } = this.props;
		const domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const callbackUrl = process.env.AUTH0_CALLBACK_URL;
    return (
      <Auth0Provider
        domain={domain!}
        clientId={clientId!}
        redirectUri={callbackUrl!}
        onLoginError={onLoginError}
        onAccessTokenError={onAccessTokenError}
        
        onRedirectCallback={onRedirectCallback}>
          <Component {...pageProps} />
      </Auth0Provider>
    );
  }
}