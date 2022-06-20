import { MiddlewareFn } from 'type-graphql';

import { MyContext } from '../types';
import { USER_IS_NOT_AUTHED } from '.';

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error(`${USER_IS_NOT_AUTHED}.`);
  }

  return next();
};
