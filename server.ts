import express from 'express';
import next from 'next';
import cron from 'node-cron';
import client from './gql';
import { GET_PROJECTS_PROD } from './gql/queries/projects';


const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();
    cron.schedule('* * * * *', () => {
      console.log('Cron job running evering minute'); 
      client.query({query: GET_PROJECTS_PROD})
      .then(data => console.log(data));
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
