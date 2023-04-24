import 'reflect-metadata';
import 'dotenv-safe/config';

import { ApolloServer } from 'apollo-server-express';
import cloudinary from 'cloudinary';
// import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
// import Redis from 'ioredis';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { __prod__, SESSION_COOKIE } from './constants';
import { Checkpoint } from './entities/v2/Checkpoint';
import { CodeModule } from './entities/v2/CodeModule';
import { Lesson } from './entities/v2/Lesson';
import { Step } from './entities/v2/Step';
import { User } from './entities/v2/User';
import { CheckpointResolver } from './resolvers/checkpoint';
import { CodeModuleResolver } from './resolvers/codeModule';
import { DependencyResolver } from './resolvers/dependency';
import { LessonResolver } from './resolvers/lesson';
import { SessionResolver } from './resolvers/session';
import { StepResolver } from './resolvers/step';
import { UserResolver } from './resolvers/user';
import { complete, explain } from './utils/openai';

const main = async () => {
  const conn = await createConnection({
    entities: [Checkpoint, CodeModule, Lesson, Step, User],
    logging: true,
    migrations: ['dist/migrations/v2/*.js'],
    type: 'postgres',
    url: process.env.DATABASE_URL,
  });

  await conn.runMigrations();

  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: process.env.CORS_ORIGIN,
    })
  );

  // const RedisStore = connectRedis(session);
  // const redis = new Redis(process.env.REDIS_URL);

  app.use(
    session({
      cookie: {
        domain: __prod__ ? '.codeamigo.dev' : undefined,
        httpOnly: true,
        // 10 years
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        sameSite: 'lax',
        secure: __prod__,
      },
      name: SESSION_COOKIE,
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      // store: new RedisStore({
      //   client: redis,
      //   disableTouch: true,
      // }),
    })
  );

  const apolloServer = new ApolloServer({
    context: ({ req, res }) => ({ req, res }),
    schema: await buildSchema({
      resolvers: [
        CheckpointResolver,
        CodeModuleResolver,
        DependencyResolver,
        LessonResolver,
        SessionResolver,
        StepResolver,
        UserResolver,
      ],
      validate: false,
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    bodyParserConfig: {
      limit: '10mb',
    },
    cors: false,
  });

  cloudinary.v2.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  app.get('/sign_img_upload', async (_, res) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await cloudinary.v2.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({ signature, timestamp });
  });

  app.post('/completions', async (req, res) => {
    try {
      const result = await complete(
        req.body.prompt as string,
        req.body.suffix,
        req.body.apiKey
      );

      // filter result.data.choices if choice.text is empty and if not unique
      const choices = result.data.choices.filter((choice: any) => choice.text);

      res.json(choices);
    } catch (e) {
      res.statusCode = 500;
      res.send([]);
    }
  });

  app.post('/explain', async (req, res) => {
    try {
      const result = await explain(req.body.prompt as string, req.body.apiKey);

      // filter result.data.choices if choice.text is empty and if not unique
      const choices = result.data.choices.filter((choice: any) => choice.text);

      res.json(choices);
    } catch (e) {
      res.statusCode = 500;
      res.send([]);
    }
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log(`Server started on localhost:${process.env.PORT}`);
  });
};

main().catch(console.error);
