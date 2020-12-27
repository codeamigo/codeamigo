import { RegularDependencyFragment } from '@generated/graphql';
import React, { useState } from 'react';

import { FilesType } from '../Editor/types';
import DependenciesList from './DependenciesList';
import FilesList from './FilesList';

export type AlgoliaSearchResultType = { name: string; version: string };

const EditorFiles: React.FC<Props> = ({
  createFile,
  currentPath,
  deleteFile,
  dependencies,
  files,
  setCurrentPath,
  stepId,
}) => {
  const docs = Object.keys(files).filter((file) => !file.includes('spec'));
  const tests = Object.keys(files).filter((file) => file.includes('spec'));

  return (
    <>
      <FilesList
        currentPath={currentPath}
        files={docs}
        name={'Files'}
        onCreate={createFile}
        onDelete={deleteFile}
        setCurrentPath={setCurrentPath}
      />
      <FilesList
        currentPath={currentPath}
        files={tests}
        name={'Tests'}
        setCurrentPath={setCurrentPath}
      />
      <DependenciesList
        dependencies={dependencies}
        name={'Dependencies'}
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
