import "reflect-metadata";
import "dotenv-safe/config";

import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";

import { __prod__ } from "./constants";
import { Checkpoint } from "./entities/Checkpoint";
import { CodeModule } from "./entities/CodeModule";
import { Dependency } from "./entities/Dependency";
import { Lesson } from "./entities/Lesson";
import { Session } from "./entities/Session";
import { Step } from "./entities/Step";
import { User } from "./entities/User";
import { CheckpointResolver } from "./resolvers/checkpoint";
import { CodeModuleResolver } from "./resolvers/codeModule";
import { DependencyResolver } from "./resolvers/dependency";
import { LessonResolver } from "./resolvers/lesson";
import { SessionResolver } from "./resolvers/session";
import { StepResolver } from "./resolvers/step";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  const conn = await createConnection({
    entities: [Checkpoint, CodeModule, Dependency, Lesson, Session, Step, User],
    logging: true,
    synchronize: __prod__,
    type: "postgres",
    url: process.env.DATABASE_URL,
  });
  await conn.runMigrations();

  const app = express();
  app.set("proxy", 1);
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
        domain: __prod__ ? ".codeamigo.dev" : undefined,
        httpOnly: true,
        // 10 years
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        sameSite: "lax",
        secure: __prod__,
      },
      name: "amigoid",
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

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(parseInt(process.env.PORT), () => {
    console.log(`Server started on localhost:${process.env.PORT}`);
  });
};

main().catch(console.error);
