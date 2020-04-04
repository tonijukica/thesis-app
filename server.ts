import * as dotenv from "dotenv";
import 'reflect-metadata';
import express from "express";
import next from "next";
import cron from "node-cron";
import takePreview from "./helpers";
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { getSchema } from './resolvers';
import { json } from 'express';


dotenv.config();
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(async() => {
    await createConnection();
    const server = express();
    server.use(json({ limit: '2mb'}));

    cron.schedule("* 4 * * 1,5", () => {
      console.log("_________________________");
      console.log("Taking production previews");
      takePreview();
    });
    
    const schema = await getSchema();
    const apolloServer = new ApolloServer({
      schema
    });
    
    apolloServer.applyMiddleware({app: server});

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
  });
