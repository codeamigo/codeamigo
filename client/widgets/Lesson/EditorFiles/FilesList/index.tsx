import { useSandpack } from '@codesandbox/sandpack-react';
import React, { useEffect, useRef, useState } from 'react';

import Icon from '👨‍💻components/Icon';
import {
  RegularCodeModuleFragment,
  useStepQuery,
  useUpdateCodeModuleEntryFileMutation,
} from '👨‍💻generated/graphql';
import { getFileName } from '👨‍💻utils/stringUtils';
import { getExtension } from '👨‍💻widgets/Lesson/EditorV2/utils';

import styles from './FilesList.module.scss';
import { isValidName } from './validation';

const FilesList: React.FC<Props> = ({
  codeModules,
  currentPath,
  files,
  isEditing,
  name,
  onCreate,
  onDelete,
  stepId,
}) => {
  const { sandpack } = useSandpack();
  const { setActiveFile } = sandpack;
  const [updateCodeModuleEntryFile] = useUpdateCodeModuleEntryFileMutation();
  const { loading } = useStepQuery({
    fetchPolicy: 'cache-only',
    variables: { id: stepId },
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdding) {
      setTimeout(() => {
        inputRef.current!.focus();
      }, 0);
    }
  }, [isAdding]);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const isValid = isValidName(value, files);

    if (!value) {
      setIsAdding(false);
      return;
    }

    if (!isValid.valid) {
      setError(isValid.reason);
      return;
    }

    if (value && onCreate) {
      onCreate(value);
    }

    setIsAdding(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onCreate) {
      const value = event.currentTarget.value;

      const isValid = isValidName(value, files);

      if (!isValid.valid) {
        setError(isValid.reason);
        return;
      }

      onCreate(value);
      setIsAdding(false);
    }
  };

  const getImageSrc = (path: string) => {
    const ext = getExtension(path);
    const base =
      'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons';
    return `${base}/${ext}.svg`;
  };

  const isEntry = (file: string) =>
    codeModules?.find(({ name }) => name === file)?.isEntry;

  return (
    <>
      <div className="border-b border-t mt-4 first:border-t-0 first:mt-0 border-bg-nav-offset p-1 flex justify-between content-center">
        <span className="text-sm font-semibold text-text-primary">{name}</span>
        {onCreate && isEditing && (
          <Icon
            className="text-sm text-text-primary hover:text-accent cursor-pointer"
            name="plus-circled"
            onClick={() => setIsAdding(true)}
          />
        )}
      </div>
      <div>
        {files &&
          files
            .sort((a, b) => (a < b ? -1 : 1))
            .map((path) => (
              <div
                className={`${
                  currentPath === path ? 'bg-bg-nav' : ''
                } flex justify-between w-full px-1 py-1 text-text-primary hover:bg-bg-nav cursor-pointer ${
                  styles.FILE
                }`}
                key={path}
                onClick={() => setActiveFile(path)}
              >
                <div
                  className={`text-xs flex items-center ${
                    loading ? 'opacity-30' : ''
                  }`}
                >
                  <img className="w-3.5 mr-1" src={getImageSrc(path)} />
                  <span>{getFileName(path)}</span>
                  {isEditing && isEntry(path) && (
                    <Icon className={`text-xs ml-1`} name="star" />
                  )}
                  {isEditing && !isEntry(path) && (
                    // update entry file
                    <Icon
                      className={`empty-star hidden text-xs ml-1 ${styles.emptyStar}`}
                      name="star-empty"
                      onClick={() =>
                        updateCodeModuleEntryFile({
                          variables: {
                            newId: codeModules?.find(
                              ({ name }) => name === path
                            )?.id,
                            oldId: codeModules?.find(({ isEntry }) => !!isEntry)
                              ?.id,
                          },
                        })
                      }
                    />
                  )}
                </div>
                {onDelete && isEditing && (
                  <Icon
                    className="text-red-600 text-sm hidden"
                    name="minus-circled"
                    onClick={() => {
                      const yes = window.confirm(
                        'Are you sure you want to delete this file?'
                      );

                      if (yes) {
                        onDelete(path);
                      }
                    }}
                  />
                )}
              </div>
            ))}
        {isAdding && (
          <div className="px-1 pb-2 relative">
            <input
              className="w-full text-xs px-2 py-1"
              onBlur={handleBlur}
              onChange={() => setError('')}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              type="text"
            />
            {error && (
              <div className="text-red-600 text-xs absolute -bottom-2.5">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

type Props = {
  codeModules?: RegularCodeModuleFragment[] | null;
  currentPath?: string;
  files?: Array<string>;
  isEditing?: boolean;
  name: string;
  onCreate?: (path: string) => void;
  onDelete?: (path: string) => void;
  stepId: number;
};

export default FilesList;
