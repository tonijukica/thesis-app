import express from 'express';
import next from 'next';
import cron from 'node-cron';
import client from './gql';
import capture from 'capture-website';
import { GET_PROJECTS_PROD, INSERT_PROD_PREVIEW } from './gql/queries/projects';


const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();
    cron.schedule('* * * * *', () => {
      console.log('Cron job running evering minute'); 
      client.query({query: GET_PROJECTS_PROD})
      .then(({data}) => {
        const { projects } = data;
        projects.map(async (project: any) => {
          const { id, prod_url } = project;
          if(prod_url){
            const image = await capture.base64(prod_url, {
              width: 1920,
              height: 1080
            });
            client.mutate({
              mutation: INSERT_PROD_PREVIEW,
              variables: {
                projectId: id,
                image: image.toString()
              }
            })
            .then(() => console.log(`Project ${id} @ ${Date.now()}`));
          }
        })
      });
    });
    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if(err) throw err;
      console.log('> Ready on http://localhost:3000')
    });
  })
  .catch((ex) => {
    console.error(ex.stack)
  });
