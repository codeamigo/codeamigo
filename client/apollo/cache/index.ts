import { makeVar } from '@apollo/client';

// User
export const isAuthenticatedVar = makeVar(false);

// Modal
export type ModalNameType = 'login' | 'register';
export type ModalType = { callback: Function; name: null | ModalNameType };
export const InitialModalState = { callback: () => null, name: null };

export const modalVar = makeVar(InitialModalState as ModalType);
