import * as dotenv from 'dotenv';
import 'reflect-metadata';
import express from 'express';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import next from 'next';
import cron from 'node-cron';
import { randomBytes } from 'crypto';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { getSchema } from './resolvers';
import takePreview from './helpers';

dotenv.config();
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(async () => {
    await createConnection();
    const server = express();
    server.use(express.json({ limit: '10mb' }));

    cron.schedule('* 4 * * 1,5', () => {
      console.log('_________________________');
      console.log('Taking production previews');
      takePreview();
    });

    const schema = await getSchema();
    const apolloServer = new ApolloServer({
      schema,
      context: ({ req }: any) => ({ req }),
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
    });
    server.use(
      cookieSession({
        name: 'session',
        keys: [dev ? 'devsess' : randomBytes(16).toString('hex')],
        maxAge: 24 * 60 * 60 * 1000,
      })
    );
    server.use(cookieParser());
    apolloServer.applyMiddleware({ app: server });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    const port = Number(process.env.PORT);
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
  });
