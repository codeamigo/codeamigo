import { InMemoryCache } from '@apollo/client';

import * as me from './me';
import * as modal from './modal';
import * as step from './step';

export default new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        ...modal.fields,
      },
    },
    Step: {
      fields: step.fields,
    },
    User: {
      fields: me.fields,
    },
  },
});
