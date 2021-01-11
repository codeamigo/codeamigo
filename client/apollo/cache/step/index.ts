import { makeVar } from '@apollo/client';

import { RegularCheckpointFragment } from '👨‍💻generated/graphql';

export const currentCheckpointVar = makeVar<RegularCheckpointFragment>(
  {} as RegularCheckpointFragment
);

export const fields = {
  currentCheckpoint: {
    read: () => {
      return currentCheckpointVar();
    },
  },
};
