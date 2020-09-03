import * as dotenv from 'dotenv';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import fetch from 'isomorphic-unfetch';
import capture from 'capture-website';
import { GET_PROJECTS_PROD } from '../gql/queries/projects';
import { Project } from '../entities/Project';
import { ProductionPreview } from '../entities/ProductionPreview';

dotenv.config();

const port = process.env.PORT;
const GRAPHQL_URL = `http://localhost:${port}/graphql`;

const link = new HttpLink({
  fetch,
  uri: GRAPHQL_URL,
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

async function captureSnapshot(prodUrl: string) {
  const imageBuffer = await capture.buffer(prodUrl, {
    width: 1920,
    height: 1080,
  });
  const mobileImageBuffer = await capture.buffer(prodUrl, {
    emulateDevice: 'Nexus 5',
  });
  const image = imageBuffer.toString('base64');
  const mobileImage = mobileImageBuffer.toString('base64');

  return [image, mobileImage];
}
async function saveSnapshots(images: string[], id: number) {
  const project = await Project.findOne({ id });
  const previews = await Promise.all(
    images.map(async (image: string) => {
      const preview = ProductionPreview.create({ image }).save();
      return preview;
    })
  );
  const projectPreviews = (await project!.production_previews).concat(previews);
  const limit = process.env.PROD_PREVIEW_LIMIT;
  if (projectPreviews.length > Number(limit)) {
    projectPreviews.shift();
    projectPreviews.shift();
  }
  project!.production_previews = Promise.resolve(projectPreviews);
  return project!
    .save()
    .then(() => console.log(`Project ${id} @ ${Date.now()}`));
}

async function takePreview() {
  const { data } = await client.query({ query: GET_PROJECTS_PROD });
  const { projects_prod } = data;
  let offset = 0;
  Promise.all(
    projects_prod.map(async (project: any) => {
      setTimeout(() => {
        (async () => {
          const { id, prod_url, grade } = project;
          if (prod_url && !Number(grade)) {
            const images = await captureSnapshot(prod_url);
            return saveSnapshots(images, id);
          }
        })();
      }, 10000 + offset);
      offset += 10000;
    })
  );
}

export { takePreview, captureSnapshot };
