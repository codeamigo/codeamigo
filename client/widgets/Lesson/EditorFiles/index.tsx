import React, { useState } from "react";

import { FilesType } from "../Editor/types";

import FilesList from "./FilesList";
import { RegularDependencyFragment } from "@generated/graphql";
import DependenciesList from "./DependenciesList";

export type AlgoliaSearchResultType = { name: string; version: string };

const EditorFiles: React.FC<Props> = ({
  currentPath,
  dependencies,
  files,
  stepId,
  createFile,
  deleteFile,
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
      <DependenciesList name={"Dependencies"} files={deps} stepId={stepId} />
    </div>
  );
};

type Props = {
  createFile: (path: string) => void;
  deleteFile: (path: string) => void;
  dependencies?: RegularDependencyFragment[] | null;
  files: FilesType;
  currentPath: string;
  stepId: number;
  setCurrentPath: (path: string) => void;
};

export default EditorFiles;
