import { MiddlewareFn } from "type-graphql";

import { RoleEnum, User } from "../entities/User";
import { MyContext } from "../types";
import { USER_IS_NOT_AUTHED, USER_IS_NOT_TEACHER } from ".";

export const isTeacherOrAdmin: MiddlewareFn<MyContext> = async (
  { context },
  next
) => {
  const user = await User.findOneOrFail(context.req.session.userId, {
    relations: ["lessons"],
  });
  const isUserTeacher = user.lessons.some(
    (lesson) => lesson.id === context.req.body.variables.id
  );
  if (isUserTeacher || user.role === RoleEnum.ADMIN) {
    return next();
  }
  throw new Error(`${USER_IS_NOT_AUTHED}: ${USER_IS_NOT_TEACHER}`);
};
