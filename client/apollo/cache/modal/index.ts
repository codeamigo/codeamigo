import { makeVar } from '@apollo/client';

export type ModalNameType =
  | 'changePassword'
  | 'createLesson'
  | 'lessonFinished'
  | 'login'
  | 'register'
  | 'registerAfterPreview'
  | 'resetPasswordSent'
  | 'testsPassed';
export type ModalType = {
  callback: Function;
  data?: any;
  name: null | ModalNameType;
};
export const InitialModalState = {
  callback: () => null,
  data: null,
  name: null,
};

export const modalVar = makeVar(InitialModalState as ModalType);

export const fields = {
  modal: {
    read: () => {
      return modalVar();
    },
  },
};
