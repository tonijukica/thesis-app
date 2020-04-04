import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';

const GRAPHQL_URL = process.env.GRAPHQL_URL;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const link = new HttpLink({
  fetch, 
  uri: GRAPHQL_URL
});

const githubLink = new HttpLink({
  fetch,
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`
  }
});

const client = new ApolloClient({
  link: ApolloLink.split(operation => operation.getContext().clientName === 'github',
    githubLink,
    link
  ),
  cache: new InMemoryCache()
})

export default client;