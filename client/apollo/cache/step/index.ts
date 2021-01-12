import { makeVar } from '@apollo/client';

import { RegularCheckpointFragment } from '👨‍💻generated/graphql';

export const currentCheckpointIdVar = makeVar<number | null>(null);

export const fields = {
  currentCheckpointId: {
    read: () => {
      return currentCheckpointIdVar();
    },
  },
};
