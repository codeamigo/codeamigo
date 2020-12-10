import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from 'ioredis'

type MySession = Session & { userId: null | number }

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  redis: Redis
  req: Request & { session: MySession };
  res: Response;
};
