import { InMemoryCache } from '@apollo/client';

import * as me from './me';
import * as modal from './modal';

export default new InMemoryCache({
  typePolicies: {
    Query: {
      fields: modal.fields,
    },
    User: {
      fields: me.fields,
    },
  },
});
