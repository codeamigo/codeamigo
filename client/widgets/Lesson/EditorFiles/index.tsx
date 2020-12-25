import React from "react";

import { FilesType } from "../Editor/types";

import styles from "./EditorFiles.module.scss";
import FilesList from "./FilesList";
import { RegularDependencyFragment } from "@generated/graphql";

const EditorFiles: React.FC<Props> = ({
  createFile,
  deleteFile,
  currentPath,
  dependencies,
  files,
  setCurrentPath,
}) => {
  const docs = Object.keys(files).filter((file) => !file.includes("spec"));
  const tests = Object.keys(files).filter((file) => file.includes("spec"));
  const deps = dependencies?.map((dep) => `${dep.package} v${dep.version}`);

  return (
    <div className="border-r border-gray-200 w-4/12">
      <FilesList
        name={"Files"}
        files={docs}
        onDelete={deleteFile}
        onCreate={createFile}
        currentPath={currentPath}
        setCurrentPath={setCurrentPath}
      />
      <FilesList
        name={"Tests"}
        files={tests}
        currentPath={currentPath}
        setCurrentPath={setCurrentPath}
      />
      <FilesList
        name={"Dependencies"}
        files={deps}
        onDelete={deleteFile}
        onCreate={createFile}
      />
    </div>
  );
};

type Props = {
  createFile: (path: string) => void;
  deleteFile: (path: string) => void;
  dependencies?: RegularDependencyFragment[] | null;
  files: FilesType;
  currentPath: string;
  setCurrentPath: (path: string) => void;
};

export default EditorFiles;
