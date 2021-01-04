import { createGlobalState } from 'react-hooks-global-state';

import { MeQuery } from '../generated/graphql';

type ModalType = null | 'login' | 'register';
type ModalStateType = {
  callback: Function;
  name: ModalType;
};

export const { useGlobalState } = createGlobalState({
  modal: {
    callback: () => null,
    name: null,
  } as ModalStateType,
  user: {
    data: undefined as MeQuery | undefined,
    loading: true as boolean,
  },
});
