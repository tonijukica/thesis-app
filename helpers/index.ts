import * as dotenv from 'dotenv';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import capture from 'capture-website';
import { GET_PROJECTS_PROD, INSERT_PROD_PREVIEW } from '../gql/queries/projects';
dotenv.config();

const GRAPHQL_URL = process.env.GRAPHQL_URL;

const link = new HttpLink({
	fetch,
	uri: GRAPHQL_URL,
});

const client = new ApolloClient({
	link,
	cache: new InMemoryCache(),
});

async function takePreview() {
	const { data } = await client.query({ query: GET_PROJECTS_PROD });
  const { projects_prod } = data;
	Promise.all(
		projects_prod.map(async (project: any) => {
			const { id, prod_url } = project;
			if(prod_url){
				const imageBuffer = await capture.buffer(prod_url, {
					width: 1920,
					height: 1080,
				});
				const image = imageBuffer.toString('base64');
				return client
					.mutate({
						mutation: INSERT_PROD_PREVIEW,
						variables: {
							projectId: Number(id),
							image,
						},
					})
					.then(() => console.log(`Project ${id} @ ${Date.now()}`));
			}
		})
	);
}
export default takePreview;
