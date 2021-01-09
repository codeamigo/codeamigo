export type TestResultType = {
  duration: number;
  errors: Array<string>;
  status: 'pass' | 'fail';
  testPath: Array<string>;
};
