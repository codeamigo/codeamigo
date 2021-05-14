import { useSandpack } from '@codesandbox/sandpack-react';
import React, { useState } from 'react';

import {
  RegularCodeModuleFragment,
  RegularDependencyFragment,
  useCreateCodeModuleMutation,
  useDeleteCodeModuleMutation,
} from '👨‍💻generated/graphql';

import { FilesType } from '../EditorV2/types';
import FilesList from './FilesList';

export type AlgoliaSearchResultType = {
  name: string;
  tags: { latest: string; next: string };
  version: string;
};

const EditorFiles: React.FC<Props> = ({ files, ...rest }) => {
  const [createCodeModule] = useCreateCodeModuleMutation();
  const [deleteCodeModule] = useDeleteCodeModuleMutation();

  const createFile = async (file: string) => {
    const value = ``;

    await createCodeModule({
      refetchQueries: ['Step'],
      variables: { name: `/${file}`, stepId: rest.stepId, value },
    });
  };

  const deleteFile = async (file: string) => {
    const module = rest.codeModules?.find((module) => module.name === file);

    if (!module) return;
    if (!files) return;

    await deleteCodeModule({
      refetchQueries: ['Step'],
      variables: { id: module.id },
    });
  };

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
  files: FilesType;
  isEditing?: boolean;
  stepId: number;
};

export default EditorFiles;
