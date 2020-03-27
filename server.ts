import express from 'express';
import next from 'next';
import cron from 'node-cron';
import takePreview from './helpers';

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();
    cron.schedule('* 4 * * 1,5', () => {
      console.log('_________________________');
      console.log('Taking production previews'); 
      takePreview();
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
