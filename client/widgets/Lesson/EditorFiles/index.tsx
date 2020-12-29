import { RegularDependencyFragment } from '@generated/graphql';
import React, { useState } from 'react';

import { FilesType } from '../Editor/types';
import DependenciesList from './DependenciesList';
import FilesList from './FilesList';

export type AlgoliaSearchResultType = { name: string; version: string };

const EditorFiles: React.FC<Props> = ({
  createFile,
  deleteFile,
  files,
  setCurrentPath,
  ...rest
}) => {
  const docs = Object.keys(files).filter((file) => !file.includes('spec'));
  const tests = Object.keys(files).filter((file) => file.includes('spec'));

  return (
    <>
      <FilesList
        files={docs}
        name={'Files'}
        onCreate={createFile}
        onDelete={deleteFile}
        setCurrentPath={setCurrentPath}
        {...rest}
      />
      {rest.isEditting && (
        <FilesList
          files={tests}
          name={'Tests'}
          setCurrentPath={setCurrentPath}
          {...rest}
        />
      )}
      <DependenciesList name={'Dependencies'} {...rest} />
    </>
  );
};

type Props = {
  createFile: (path: string) => void;
  currentPath: string;
  deleteFile: (path: string) => void;
  dependencies?: RegularDependencyFragment[] | null;
  files: FilesType;
  isEditting?: boolean;
  setCurrentPath: (path: string) => void;
  stepId: number;
};

export default EditorFiles;
