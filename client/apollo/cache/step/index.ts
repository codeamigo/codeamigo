import { makeVar } from '@apollo/client';

export const currentCheckpointIdVar = makeVar<number | null>(null);

export const fields = {
  currentCheckpointId: {
    read: () => {
      return currentCheckpointIdVar();
    },
  },
};
