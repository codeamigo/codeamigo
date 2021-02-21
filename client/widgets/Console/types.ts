export type TestResultType = {
  duration: number;
  errors: Array<string>;
  status: 'pass' | 'fail';
  testPath: Array<string>;
};

export type TestBundlerErrType = {
  diagnostics: any;
  type: 'failure';
};
