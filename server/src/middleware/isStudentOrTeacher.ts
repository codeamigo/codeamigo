import { MiddlewareFn } from 'type-graphql';

import { User } from '../entities/User';
import { MyContext } from '../types';
import { USER_IS_NOT_AUTHED, USER_IS_NOT_TEACHER } from '.';

export const isStudentOrTeacher: MiddlewareFn<MyContext> = async (
  { context },
  next
) => {
  const user = await User.findOneOrFail(context.req.session.userId, {
    relations: ['lessons', 'classes'],
  });
  const sessionId = context.req.body.variables.sessionId;
  const lessonId = context.req.body.variables.lessonId;
  const isUserTeacher = user.lessons.some((lesson) => lesson.id === lessonId);
  const isUserStudent = user.classes.some(
    (session) => session.id === sessionId
  );
  if (isUserTeacher || isUserStudent) return next();

  throw new Error(`${USER_IS_NOT_AUTHED}: ${USER_IS_NOT_TEACHER}`);
};
