import React, { useEffect, useRef, useState } from 'react';

import Icon from '👨‍💻components/Icon';
import { getExtension } from '👨‍💻widgets/Lesson/Editor/utils';

import styles from './FilesList.module.scss';
import { isValidName } from './validation';

const FilesList: React.FC<Props> = ({
  currentPath,
  files,
  isEditting,
  name,
  onCreate,
  onDelete,
  setCurrentPath,
}) => {
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

  return (
    <>
      <div className="border-b border-t mt-4 first:border-t-0 first:mt-0 border-ternary p-1 flex justify-between content-center">
        <span className="text-sm font-semibold text-primary">{name}</span>
        {onCreate && isEditting && (
          <Icon
            className="text-sm text-primary hover:text-ternary cursor-pointer"
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
                  currentPath === path ? 'bg-ternary-bg' : ''
                } flex justify-between w-full px-1 py-1 text-primary hover:bg-ternary-bg ${
                  path === 'app.tsx' ? '' : styles.FILE
                } ${setCurrentPath ? 'cursor-pointer' : ''}`}
                key={path}
                onClick={() => setCurrentPath && setCurrentPath(path)}
              >
                <div className="text-xs flex items-center">
                  <img className="w-3.5 mr-1" src={getImageSrc(path)} />
                  <span>{path}</span>
                </div>
                {onDelete && isEditting && (
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
  currentPath?: string;
  files?: Array<string>;
  isEditting?: boolean;
  name: string;
  onCreate?: (path: string) => void;
  onDelete?: (path: string) => void;
  setCurrentPath?: (path: string) => void;
};

export default FilesList;
