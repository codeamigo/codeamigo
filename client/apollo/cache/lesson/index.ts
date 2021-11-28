import { makeVar } from '@apollo/client';

export const isTestingVar = makeVar<boolean>(false);
export const testFailureVar = makeVar<boolean>(false);
export const isExecutingVar = makeVar<boolean>(false);
