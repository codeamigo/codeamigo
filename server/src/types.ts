import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";

type MySession = Session & { userId: null | number };

export type MyContext = {
  redis: Redis;
  req: Request & { session: MySession };
  res: Response;
};
