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
