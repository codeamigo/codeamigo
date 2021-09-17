import { SandpackBundlerFiles } from '@codesandbox/sandpack-client';
import { useSandpack } from '@codesandbox/sandpack-react';
import React, { useEffect, useRef, useState } from 'react';

import Icon from '👨‍💻components/Icon';
import { RegularCodeModuleFragment } from '👨‍💻generated/graphql';
import AddFile from '👨‍💻widgets/Lesson/EditorFiles/FileExplorer/AddFile';
import { ModuleList } from '👨‍💻widgets/Lesson/EditorFiles/FileExplorer/ModuleList';

import { isValidName } from './validation';

export enum FileSystemType {
  file = 'file',
  folder = 'folder',
}

export type FileSystemStateType = {
  active: boolean;
  path: string;
  type: keyof typeof FileSystemType;
};

const FileSystemInitialState = {
  active: false,
  path: '/',
  type: FileSystemType.file,
};

const FilesList: React.FC<Props> = (props) => {
  const { isEditing, name, onCreate } = props;
  const { sandpack } = useSandpack();
  const inputRef = useRef<HTMLInputElement>(null);
  const [addFileState, setAddFileState] = useState<FileSystemStateType>(
    FileSystemInitialState
  );
  const [error, setError] = useState('');

  useEffect(() => {
    if (addFileState.active) {
      setTimeout(() => {
        inputRef.current!.focus();
      }, 0);
    }
  }, [addFileState.active]);

  const handleCreate = (value: string) => {
    onCreate!(
      `${addFileState.path}${value}${addFileState.type === 'folder' ? '/' : ''}`
    );
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const isValid = isValidName(
      value,
      addFileState.type,
      Object.keys(sandpack.files)
    );

    if (!value) {
      setAddFileState(FileSystemInitialState);
      return;
    }

    if (!isValid.valid) {
      setError(isValid.reason);
      return;
    }

    if (value && onCreate) {
      handleCreate(value);
    }

    setAddFileState(FileSystemInitialState);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onCreate) {
      const value = event.currentTarget.value;

      const isValid = isValidName(
        value,
        addFileState.type,
        Object.keys(sandpack.files)
      );

      if (!isValid.valid) {
        setError(isValid.reason);
        return;
      }

      handleCreate(value);
      setAddFileState(FileSystemInitialState);
    }
  };

  const finalFiles = Object.keys(sandpack.files)
    .filter((val) =>
      name === 'Tests' ? val.includes('spec') : !val.includes('spec')
    )
    .reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: {
          ...sandpack.files[curr],
        },
      };
    }, {} as SandpackBundlerFiles);

  return (
    <>
      <div className="border-b border-t mt-4 first:border-t-0 first:mt-0 border-bg-nav-offset-faded p-1 flex justify-between content-center">
        <span className="text-sm font-semibold text-text-primary">{name}</span>
        {onCreate && isEditing && (
          <div className="flex items-center gap-2">
            <Icon
              className="text-xs text-text-primary hover:text-accent cursor-pointer"
              name="folder"
              onClick={() =>
                setAddFileState({
                  active: true,
                  path: '/',
                  type: FileSystemType.folder,
                })
              }
            />
            <Icon
              className="text-xs text-text-primary hover:text-accent cursor-pointer"
              name="file-empty"
              onClick={() =>
                setAddFileState({
                  active: true,
                  path: '/',
                  type: FileSystemType.file,
                })
              }
            />
          </div>
        )}
      </div>
      <div>
        {addFileState.active && addFileState.path === '/' && (
          <AddFile
            addFileState={addFileState}
            error={error}
            handleBlur={handleBlur}
            handleKeyDown={handleKeyDown}
            inputRef={inputRef}
            setError={setError}
          />
        )}
        <ModuleList
          activePath={sandpack.activePath}
          addFileState={addFileState}
          error={error}
          files={finalFiles}
          handleBlur={handleBlur}
          handleKeyDown={handleKeyDown}
          inputRef={inputRef}
          prefixedPath="/"
          selectFile={sandpack.openFile}
          setAddFileState={setAddFileState}
          setError={setError}
          {...props}
        />
      </div>
    </>
  );
};

export type Props = {
  codeModules?: RegularCodeModuleFragment[] | null;
  currentPath?: string;
  isEditing?: boolean;
  isPreviewing?: boolean;
  name: 'Tests' | 'Files';
  onCreate?: (path: string) => void;
  onDelete: (path: string, isDirectory?: boolean) => void;
  onUpdateCodeModuleEntryFile?: (variables: {
    variables: { newId: any; oldId: any };
  }) => void;
  stepId: number;
};

export default FilesList;
