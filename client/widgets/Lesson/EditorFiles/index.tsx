import { useSandpack } from '@codesandbox/sandpack-react';
import React, { useState } from 'react';

import {
  RegularCodeModuleFragment,
  RegularDependencyFragment,
} from '👨‍💻generated/graphql';

import { FilesType } from '../Editor/types';
import FilesList from './FilesList';

export type AlgoliaSearchResultType = {
  name: string;
  tags: { latest: string; next: string };
  version: string;
};

const EditorFiles: React.FC<Props> = ({
  createFile,
  deleteFile,
  files,
  ...rest
}) => {
  const { sandpack } = useSandpack();
  const { setActiveFile } = sandpack;

  if (!files) return null;
  const docs = Object.keys(files).filter((file) => !file.includes('spec'));
  const tests = Object.keys(files).filter((file) => file.includes('spec'));

  return (
    <>
      <FilesList
        files={docs}
        name={'Files'}
        onCreate={createFile}
        onDelete={deleteFile}
        {...rest}
      />
      {rest.isEditing && <FilesList files={tests} name={'Tests'} {...rest} />}
    </>
  );
};

type Props = {
  codeModules?: RegularCodeModuleFragment[] | null;
  createFile?: (path: string) => void;
  currentPath?: string;
  deleteFile?: (path: string) => void;
  files: FilesType;
  isEditing?: boolean;
  stepId: number;
};

export default EditorFiles;
