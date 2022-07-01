import { SandpackBundlerFiles } from '@codesandbox/sandpack-client';
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
  const { files, isEditing, name, onCreate } = props;
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
    const isValid = isValidName(value, addFileState.type, Object.keys(files));

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

      const isValid = isValidName(value, addFileState.type, Object.keys(files));

      if (!isValid.valid) {
        setError(isValid.reason);
        return;
      }

      handleCreate(value);
      setAddFileState(FileSystemInitialState);
    }
  };

  const finalFiles = Object.keys(files)
    .filter((val) =>
      name === 'Tests' ? val.includes('spec') : !val.includes('spec')
    )
    .reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: {
          ...files[curr],
        },
      };
    }, {} as SandpackBundlerFiles);

  return (
    <>
      <div className="flex justify-between content-center p-1 mt-4 first:mt-0 border-t first:border-t-0 border-b border-bg-nav-offset-faded">
        <span className="text-sm font-semibold text-text-primary">{name}</span>
        <div className="flex gap-2 items-center">
          {onCreate && isEditing ? (
            <Icon
              className="text-xs cursor-pointer text-text-primary hover:text-accent"
              name="folder"
              onClick={() =>
                setAddFileState({
                  active: true,
                  path: '/',
                  type: FileSystemType.folder,
                })
              }
            />
          ) : null}
          {onCreate && isEditing ? (
            <Icon
              className="text-xs cursor-pointer text-text-primary hover:text-accent"
              name="file-empty"
              onClick={() =>
                setAddFileState({
                  active: true,
                  path: '/',
                  type: FileSystemType.file,
                })
              }
            />
          ) : null}
          {props.closeExplorer ? (
            <Icon
              className="text-xs cursor-pointer text-text-primary hover:text-accent"
              name="cancel-circled"
              onClick={() => props.closeExplorer!()}
            />
          ) : null}
        </div>
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
          addFileState={addFileState}
          error={error}
          handleBlur={handleBlur}
          handleKeyDown={handleKeyDown}
          inputRef={inputRef}
          prefixedPath="/"
          setAddFileState={setAddFileState}
          setError={setError}
          {...props}
          files={finalFiles}
        />
      </div>
    </>
  );
};

export type Props = {
  activeFile: string;
  closeExplorer?: () => void;
  codeModules?: RegularCodeModuleFragment[] | null;
  currentPath?: string;
  files: { [key in string]: { code: string } };
  isEditing?: boolean;
  isPreviewing?: boolean;
  name: 'Tests' | 'Files';
  onCreate?: (path: string) => void;
  onDelete: (path: string, isDirectory?: boolean) => void;
  onUpdateCodeModuleEntryFile?: (variables: {
    variables: { newId: any; oldId: any };
  }) => void;
  selectFile?: (path: string) => void;
  stepId: number;
};

export default FilesList;
