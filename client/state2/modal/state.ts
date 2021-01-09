type ModalType = null | 'login' | 'register';

export type ModalStateType = {
  callback: Function;
  name: ModalType;
};

export const InitialModalState = {
  callback: () => null,
  name: null,
};

export const state: ModalStateType = InitialModalState;
