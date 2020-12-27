export interface CodeSandboxV1ResponseI {
  files: {
    [key in string]: {
      module: {
        code: string;
      };
    };
  };
}

export interface CodeSandboxV2ResponseI {
  contents: {
    [key in string]: {
      content: string;
      isModule: boolean;
      requires: Array<string>;
    };
  };
  dependency: {
    name: string;
    version: string;
  };
  peerDependencies: {
    [key in string]: string;
  };
}
