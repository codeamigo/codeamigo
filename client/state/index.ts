import { createGlobalState } from 'react-hooks-global-state';

type ModalType = null | 'login' | 'register';

export const { useGlobalState } = createGlobalState({
  modal: null as ModalType,
});
