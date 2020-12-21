import React, { useEffect, useRef, useState } from "react";

import Icon from "@components/Icon";
import { FilesType } from "../Editor/types";

import styles from "./EditorFiles.module.scss";

const EditorFiles: React.FC<Props> = ({
  createFile,
  deleteFile,
  currentPath,
  files,
  setCurrentPath,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAddingNewFile, setIsCreatingNewFile] = useState(false);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    if (value) {
      createFile(value);
    }

    setIsCreatingNewFile(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      createFile(event.currentTarget.value);
      setIsCreatingNewFile(false);
    }
  };

  useEffect(() => {
    if (isAddingNewFile) {
      setTimeout(() => {
        inputRef.current!.focus();
      }, 0);
    }
  }, [isAddingNewFile]);

  const docs = Object.keys(files).filter((file) => !file.includes("spec"));
  const tests = Object.keys(files).filter((file) => file.includes("spec"));

  return (
    <div className="border-r border-gray-200 w-4/12">
      <div className="border-b border-gray-200 p-1 flex justify-between content-center">
        <span className="text-sm font-semibold">Files</span>
        <Icon
          name="plus-circled"
          className="text-sm text-gray-500 hover:text-black cursor-pointer"
          onClick={() => setIsCreatingNewFile(true)}
        />
      </div>
      <div>
        {docs.map((path) => (
          <div
            key={path}
            className={`${
              currentPath === path ? "bg-gray-100" : ""
            } flex justify-between cursor-pointer w-full px-1 py-1 hover:bg-gray-100 ${
              styles.FILE
            }`}
            onClick={() => setCurrentPath(path)}
          >
            <div className="text-xs">{path}</div>
            <Icon
              name="minus-circled"
              className="text-red-600 text-sm hidden"
              onClick={() => deleteFile(path)}
            />
          </div>
        ))}
        {isAddingNewFile && (
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
      <div className="border-t border-b border-gray-200 p-1 mt-8 flex justify-between content-center">
        <span className="text-sm font-semibold">Tests</span>
      </div>
      <div>
        {tests.map((path) => (
          <div
            key={path}
            className={`${
              currentPath === path ? "bg-gray-100" : ""
            } flex justify-between cursor-pointer w-full px-1 py-1 hover:bg-gray-100 ${
              styles.FILE
            }`}
            onClick={() => setCurrentPath(path)}
          >
            <div className="text-xs">{path}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

type Props = {
  createFile: (path: string) => void;
  deleteFile: (path: string) => void;
  files: FilesType;
  currentPath: string;
  setCurrentPath: (path: string) => void;
};

export default EditorFiles;
