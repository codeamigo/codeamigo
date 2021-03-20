import { makeVar } from '@apollo/client';

export type ModalNameType =
  | 'createLesson'
  | 'login'
  | 'register'
  | 'registerAfterPreview';
export type ModalType = { callback: Function; name: null | ModalNameType };
export const InitialModalState = { callback: () => null, name: null };

export const modalVar = makeVar(InitialModalState as ModalType);

export const fields = {
  modal: {
    read: () => {
      return modalVar();
    },
  },
};
