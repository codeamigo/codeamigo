import { IConfig } from 'overmind';
import { namespaced } from 'overmind/config';
import { createHook } from 'overmind-react';

import * as modal from './modal';

export const config = namespaced({
  modal,
});

export const useApp = createHook<typeof config>();

declare module 'overmind' {
  interface Config extends IConfig<typeof config> {}
}

if (module.hot) {
  module.hot.accept();
}
