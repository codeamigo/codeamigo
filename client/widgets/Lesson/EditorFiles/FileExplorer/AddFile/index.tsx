import React from 'react';

import Icon from '👨‍💻components/Icon';
import { FileSystemStateType } from '👨‍💻widgets/Lesson/EditorFiles/FilesList';

const AddFile: React.FC<Props> = (props) => {
  const {
    addFileState,
    error,
    handleBlur,
    handleKeyDown,
    inputRef,
    setError,
  } = props;

  return (
    <div className="px-2.5 mt-1 relative">
      <div className="flex items-center">
        <Icon
          className="text-xs mr-1 text-text-primary hover:text-accent cursor-pointer"
          name={addFileState.type === 'file' ? 'file-empty' : 'folder'}
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
      {addFileState.active && error && (
        <div className="text-red-600 mt-1 text-xs w-full">{error}</div>
      )}
    </div>
  );
};

type Props = {
  addFileState: FileSystemStateType;
  error?: string;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

export default AddFile;
