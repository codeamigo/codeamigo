import React from 'react';

import Icon from '👨‍💻components/Icon';
import { FileSystemStateType } from '👨‍💻widgets/Lesson/EditorFiles/FilesList';

const AddFile: React.FC<Props> = (props) => {
  const {
    addFileState,
    depth = 0,
    error,
    handleBlur,
    handleKeyDown,
    inputRef,
    setError,
  } = props;

  return (
    <div
      className="relative pr-4 mt-1"
      style={{ paddingLeft: 8 * (depth + 1) + 'px' }}
    >
      <div className="flex items-center">
        <Icon
          className="mr-1 text-xs text-text-primary hover:text-accent cursor-pointer"
          name={addFileState.type === 'file' ? 'file-empty' : 'folder'}
        />
        <input
          className="py-1 px-2 w-full text-sm"
          onBlur={handleBlur}
          onChange={() => setError('')}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          type="text"
        />
      </div>
      {addFileState.active && error && (
        <div className="mt-1 w-full text-xs text-red-600">{error}</div>
      )}
    </div>
  );
};

type Props = {
  addFileState: FileSystemStateType;
  depth?: number;
  error?: string;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

export default AddFile;
