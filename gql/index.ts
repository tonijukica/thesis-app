import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  HttpLink,
} from '@apollo/client';
import fetch from 'isomorphic-unfetch';

const port = process.env.PORT;
const GRAPHQL_URL = `http://localhost:${port}/graphql`;
const { GITHUB_TOKEN } = process.env;
const link = new HttpLink({
  fetch,
  uri: GRAPHQL_URL,
});

const githubLink = new HttpLink({
  fetch,
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});

const client = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === 'github',
    githubLink,
    link
  ),
  cache: new InMemoryCache(),
});

export default client;
