import { Action } from 'overmind';

import { InitialModalState, ModalStateType } from './state';

export const setModal: Action<ModalStateType> = ({ state }, value) => {
  // state.modal = value;
};

export const resetModal: Action = ({ state }) => {
  state.modal = InitialModalState;
};
