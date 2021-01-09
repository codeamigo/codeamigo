import { RegularCodeModuleFragment } from '../../../generated/graphql';

export type FilesType = { [key in string]: string };

export type ModulesType = RegularCodeModuleFragment[];

export enum PreviewLogTypeEnum {
  log,
  info,
  test,
  warn,
}

export type ToPreviewMsgType = {
  files: FilesType;
  from: 'editor';
  isTest: boolean;
  runPath: string;
};

export type FromPreviewMsgType = {
  from: 'preview';
  result: string;
  type: keyof typeof PreviewLogTypeEnum;
};
