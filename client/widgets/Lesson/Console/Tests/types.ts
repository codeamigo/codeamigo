interface AddFileI {
  $id: number;
  codesandbox: boolean;
  event: 'add_file';
  path: string;
  test: never;
  type: 'test';
}

interface AddTestI {
  $id: number;
  codesandbox: boolean;
  event: 'add_test';
  path: string;
  test: never;
  testName: string;
  type: 'test';
}

interface TestStartI {
  $id: number;
  codesandbox: boolean;
  event: 'test_start';
  test: TestDataType;
  type: 'test';
}

interface TestEndI {
  $id: number;
  codesandbox: boolean;
  event: 'test_end';
  test: TestDataType;
  type: 'test';
}

interface TotalTestEndI {
  $id: number;
  codesandbox: boolean;
  event: 'total_test_end';
  test: never;
  type: 'test';
}

interface TotalTestStartI {
  $id: number;
  codesandbox: boolean;
  event: 'total_test_start';
  test: never;
  type: 'test';
}

export type TestDataType = {
  blocks: string[];
  duration: number;
  errors: TestErrorType[];
  name: string;
  path: string;
  status: 'pass' | 'fail' | 'running';
};

type TestErrorType = {
  matcherResult: boolean;
  message: string;
  name: string;
  stack: string;
};

export type CodeSandboxTestMsgType =
  | AddFileI
  | AddTestI
  | TotalTestEndI
  | TotalTestStartI
  | TestEndI
  | TestStartI;
