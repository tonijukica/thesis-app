import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';


const GRAPHQL_URL = process.env.GRAPHQL_URL;

const link = new HttpLink({
  fetch, 
  uri: GRAPHQL_URL
});

const client = new ApolloClient({
  link, 
  cache: new InMemoryCache()
})

export default client;