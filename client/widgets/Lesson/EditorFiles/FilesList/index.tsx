import React, { useEffect, useRef, useState } from "react";

import Icon from "@components/Icon";

import styles from "./FilesList.module.scss";

const FilesList: React.FC<Props> = ({
  name,
  onCreate,
  onDelete,
  currentPath,
  files,
  setCurrentPath,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    if (value && onCreate) {
      onCreate(value);
    }

    setIsAdding(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && onCreate) {
      onCreate(event.currentTarget.value);
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (isAdding) {
      setTimeout(() => {
        inputRef.current!.focus();
      }, 0);
    }
  }, [isAdding]);

  return (
    <>
      <div className="border-b border-t mt-4 first:border-t-0 first:mt-0 border-gray-200 p-1 flex justify-between content-center">
        <span className="text-sm font-semibold">{name}</span>
        {onCreate && (
          <Icon
            name="plus-circled"
            className="text-sm text-gray-500 hover:text-black cursor-pointer"
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
                key={path}
                className={`${
                  currentPath === path ? "bg-gray-100" : ""
                } flex justify-between w-full px-1 py-1 hover:bg-gray-100 ${
                  styles.FILE
                } ${setCurrentPath ? "cursor-pointer" : ""}`}
                onClick={() => setCurrentPath && setCurrentPath(path)}
              >
                <div className="text-xs">{path}</div>
                {onDelete && (
                  <Icon
                    name="minus-circled"
                    className="text-red-600 text-sm hidden"
                    onClick={() => onDelete(path)}
                  />
                )}
              </div>
            ))}
        {isAdding && (
          <div className="px-1 py-1">
            <input
              type="text"
              className="w-full text-xs px-2 py-1"
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
          </div>
        )}
      </div>
    </>
  );
};

type Props = {
  name: string;
  onCreate?: (path: string) => void;
  onDelete?: (path: string) => void;
  files?: Array<string>;
  currentPath?: string;
  setCurrentPath?: (path: string) => void;
};

export default FilesList;
