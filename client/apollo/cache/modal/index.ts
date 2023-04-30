import { makeVar } from '@apollo/client';

export type ModalNameType =
  | 'changePassword'
  | 'highDemand'
  | 'lessonHelp'
  | 'lessonPurchase'
  | 'login'
  | 'register'
  | 'registerAfterPreview'
  | 'resetPasswordSent'
  | 'mobileWarning'
  | 'steps'
  | 'testsPassed';
export type ModalType = {
  callback: Function;
  data?: any;
  name: null | ModalNameType;
  persistent?: boolean;
};
export const InitialModalState = {
  callback: () => null,
  data: null,
  name: null,
  persistent: false,
};

export const modalVar = makeVar(InitialModalState as ModalType);

export const fields = {
  modal: {
    read: () => {
      return modalVar();
    },
  },
};
