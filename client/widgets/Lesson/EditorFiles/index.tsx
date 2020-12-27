import { RegularDependencyFragment } from '@generated/graphql';
import React, { useState } from 'react';

import { FilesType } from '../Editor/types';
import DependenciesList from './DependenciesList';
import FilesList from './FilesList';

export type AlgoliaSearchResultType = { name: string; version: string };

const EditorFiles: React.FC<Props> = ({
  currentPath,
  dependencies,
  files,
  stepId,
  createFile,
  deleteFile,
  setCurrentPath,
}) => {
  const docs = Object.keys(files).filter((file) => !file.includes('spec'));
  const tests = Object.keys(files).filter((file) => file.includes('spec'));

  return (
    <>
      <FilesList
        name={'Files'}
        files={docs}
        onDelete={deleteFile}
        onCreate={createFile}
        currentPath={currentPath}
        setCurrentPath={setCurrentPath}
      />
      <FilesList
        name={'Tests'}
        files={tests}
        currentPath={currentPath}
        setCurrentPath={setCurrentPath}
      />
      <DependenciesList
        name={'Dependencies'}
        dependencies={dependencies}
        stepId={stepId}
      />
    </>
  );
};

type Props = {
  createFile: (path: string) => void;
  deleteFile: (path: string) => void;
  dependencies?: RegularDependencyFragment[] | null;
  files: FilesType;
  currentPath: string;
  stepId: number;
  setCurrentPath: (path: string) => void;
};

export default EditorFiles;
