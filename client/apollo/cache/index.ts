import { InMemoryCache, makeVar } from '@apollo/client';

import * as me from './me';
import * as modal from './modal';

export default new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        ...modal.fields,
      },
    },
    Step: {
      fields: {
        checkpoints: {
          merge(_, incoming) {
            console.log('incoming', incoming);
            return incoming;
          },
        },
        codeModules: {
          merge(_, incoming) {
            console.log('incoming codemod', incoming);
            return incoming;
          },
        },
      },
    },
    User: {
      fields: me.fields,
    },
  },
});

// status of saved lesson (edit/take lessons)
export const statusVar = makeVar({
  connected: true,
  error: '',
  lastSaved: new Date().toISOString(),
});
