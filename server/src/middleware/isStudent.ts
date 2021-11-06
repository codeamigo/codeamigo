import { MiddlewareFn } from "type-graphql";

import { User } from "../entities/User";
import { MyContext } from "../types";
import { USER_IS_NOT_AUTHED, USER_IS_NOT_STUDENT } from ".";

export const isStudent: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const user = await User.findOneOrFail(context.req.session.userId, {
    relations: ["classes"],
  });
  const sessionId =
    context.req.body.variables.sessionId || context.req.body.variables.id;
  const isStudent = user.classes.some((c) => c.id === sessionId);
  if (!isStudent)
    throw new Error(`${USER_IS_NOT_AUTHED}: ${USER_IS_NOT_STUDENT}`);

  return next();
};
