import "reflect-metadata";

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
import { Step } from "./entities/Step";
import { User } from "./entities/User";
import { CheckpointResolver } from "./resolvers/checkpoint";
import { CodeModuleResolver } from "./resolvers/codeModule";
import { DependencyResolver } from "./resolvers/dependency";
import { LessonResolver } from "./resolvers/lesson";
import { StepResolver } from "./resolvers/step";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  await createConnection({
    database: "codeamigo",
    entities: [Checkpoint, CodeModule, Dependency, Lesson, Step, User],
    logging: true,
    password: "postgres",
    synchronize: true,
    type: "postgres",
    username: "postgres",
  });

  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    session({
      cookie: {
        httpOnly: true,
        // 10 years
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        sameSite: "lax",
        secure: __prod__,
      },
      name: "amigoid",
      resave: false,
      saveUninitialized: false,
      secret: "secreto",
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
        StepResolver,
        UserResolver,
      ],
      validate: false,
    }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch(console.error);
