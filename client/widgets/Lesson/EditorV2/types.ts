import {
  RegularCodeModuleFragment,
  RegularDependencyFragment,
} from '../../../generated/graphql';

export type FilesType = { [key in string]: string };

export type ModulesType = RegularCodeModuleFragment[];

export enum PreviewLogTypeEnum {
  log,
  info,
  error,
  test,
  warn,
}

export type ToPreviewMsgType = {
  assetBuffer: Buffer;
  dependencies: RegularDependencyFragment[];
  from: 'editor';
  isTest: boolean;
  runPath: string;
};

export type FromPreviewMsgType = {
  from: 'preview';
  result: string;
  type: keyof typeof PreviewLogTypeEnum;
};

export type FromTestRunnerMsgType = {
  from: 'testRunner';
  result: string;
  type: 'test';
};
