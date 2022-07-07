import 'reflect-metadata';
import 'dotenv-safe/config';

import { ApolloServer } from 'apollo-server-express';
import cloudinary from 'cloudinary';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { __prod__, SESSION_COOKIE } from './constants';
import { Checkpoint } from './entities/Checkpoint';
import { CodeModule } from './entities/CodeModule';
import { Dependency } from './entities/Dependency';
import { Lesson } from './entities/Lesson';
import { Session } from './entities/Session';
import { Step } from './entities/Step';
import { Tag } from './entities/Tag';
import { User } from './entities/User';
import { CheckpointResolver } from './resolvers/checkpoint';
import { CodeModuleResolver } from './resolvers/codeModule';
import { DependencyResolver } from './resolvers/dependency';
import { LessonResolver } from './resolvers/lesson';
import { SessionResolver } from './resolvers/session';
import { StepResolver } from './resolvers/step';
import { UserResolver } from './resolvers/user';

const main = async () => {
  const conn = await createConnection({
    entities: [
      Checkpoint,
      CodeModule,
      Dependency,
      Lesson,
      Session,
      Step,
      Tag,
      User,
    ],
    logging: true,
    migrations: ['dist/migrations/*.js'],
    type: 'postgres',
    url: process.env.DATABASE_URL,
  });

  await conn.runMigrations();

  const app = express();
  app.set('trust proxy', 1);
  app.use(
    cors({
      credentials: true,
      origin: process.env.CORS_ORIGIN,
    })
  );

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

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
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
    })
  );

  const apolloServer = new ApolloServer({
    context: ({ req, res }) => ({ redis, req, res }),
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
    // @ts-ignore
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

  app.listen(parseInt(process.env.PORT), () => {
    console.log(`Server started on localhost:${process.env.PORT}`);
  });
};

main().catch(console.error);
