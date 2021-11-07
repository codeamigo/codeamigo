import { MiddlewareFn } from "type-graphql";

import { User } from "../entities/User";
import { MyContext } from "../types";
import { USER_IS_NOT_AUTHED, USER_IS_NOT_TEACHER } from ".";

export const isTeacher: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const user = await User.findOneOrFail(context.req.session.userId, {
    relations: ["lessons"],
  });
  const lessonId =
    context.req.body.variables.lessonId || context.req.body.variables.id;

  const isUserTeacher = user.lessons.some((lesson) => lesson.id === lessonId);
  if (!isUserTeacher)
    throw new Error(`${USER_IS_NOT_AUTHED}: ${USER_IS_NOT_TEACHER}`);

  return next();
};
