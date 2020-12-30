import { RegularCodeModuleFragment } from '../../../generated/graphql';

export type FilesType = { [key in string]: string };

export type ModulesType = RegularCodeModuleFragment[];

export type PreviewType = {
  files: FilesType;
  from: 'editor';
  isTest: boolean;
  runPath: string;
};
