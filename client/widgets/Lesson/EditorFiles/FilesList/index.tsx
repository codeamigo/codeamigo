import { SandpackBundlerFiles } from '@codesandbox/sandpack-client';
import { useSandpack } from '@codesandbox/sandpack-react';
import React, { useEffect, useRef, useState } from 'react';

import Icon from '👨‍💻components/Icon';
import { RegularCodeModuleFragment } from '👨‍💻generated/graphql';
import { ModuleList } from '👨‍💻widgets/Lesson/EditorFiles/FileExplorer/ModuleList';

import { isValidName } from './validation';

export enum FileSystemType {
  file = 'file',
  folder = 'folder',
}

const FileSystemInitialState = { active: false, type: FileSystemType.file };

const FilesList: React.FC<Props> = (props) => {
  const { isEditing, name, onCreate } = props;
  const { sandpack } = useSandpack();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState<{
    active: boolean;
    type: keyof typeof FileSystemType;
  }>(FileSystemInitialState);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdding.active) {
      setTimeout(() => {
        inputRef.current!.focus();
      }, 0);
    }
  }, [isAdding.active]);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const isValid = isValidName(
      value,
      isAdding.type,
      Object.keys(sandpack.files)
    );

    if (!value) {
      setIsAdding(FileSystemInitialState);
      return;
    }

    if (!isValid.valid) {
      setError(isValid.reason);
      return;
    }

    if (value && onCreate) {
      onCreate(value);
    }

    setIsAdding(FileSystemInitialState);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onCreate) {
      const value = event.currentTarget.value;

      const isValid = isValidName(
        value,
        isAdding.type,
        Object.keys(sandpack.files)
      );

      if (!isValid.valid) {
        setError(isValid.reason);
        return;
      }

      onCreate(value);
      setIsAdding(FileSystemInitialState);
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
                setIsAdding({ active: true, type: FileSystemType.folder })
              }
            />
            <Icon
              className="text-xs text-text-primary hover:text-accent cursor-pointer"
              name="list-add"
              onClick={() =>
                setIsAdding({ active: true, type: FileSystemType.file })
              }
            />
          </div>
        )}
      </div>
      <div>
        <ModuleList
          activePath={sandpack.activePath}
          files={finalFiles}
          prefixedPath="/"
          selectFile={sandpack.openFile}
          {...props}
        />
        <div className="px-2.5 mt-1 relative">
          {isAdding.active && (
            <div className="flex items-center">
              <Icon
                className="text-xs mr-1 text-text-primary hover:text-accent cursor-pointer"
                name={isAdding.type === 'file' ? 'list-add' : 'folder'}
              />
              <input
                className="w-full text-sm px-2 py-1"
                onBlur={handleBlur}
                onChange={() => setError('')}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                type="text"
              />
            </div>
          )}
          {isAdding.active && error && (
            <div className="text-red-600 mt-1 text-xs w-full">{error}</div>
          )}
        </div>
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
