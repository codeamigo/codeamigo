import { makeVar } from '@apollo/client';

export const isAuthenticatedVar = makeVar(false);

export const fields = {
  isAuthenticated: {
    read: () => {
      return isAuthenticatedVar();
    },
  },
};
