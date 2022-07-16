import { useReactiveVar } from '@apollo/client';
import React from 'react';

import { isFileExplorerOpenVar } from '👨‍💻apollo/cache/editor';
import {
  RegularCodeModuleFragment,
  useCreateCodeModuleMutation,
  useDeleteCodeModuleMutation,
  useUpdateCodeModuleEntryFileMutation,
} from '👨‍💻generated/graphql';

import { isDirectory } from '../Executors/utils';
import FilesList from './FilesList';

const EditorFiles: React.FC<Props> = (props) => {
  const [createCodeModule] = useCreateCodeModuleMutation();
  const [deleteCodeModule] = useDeleteCodeModuleMutation();
  const [updateCodeModuleEntryFile] = useUpdateCodeModuleEntryFileMutation();
  const isFileExplorerOpen = useReactiveVar(isFileExplorerOpenVar);

  const createFile = async (file: string) => {
    const value = ``;

    await createCodeModule({
      refetchQueries: ['Step'],
      variables: {
        lessonId: props.lessonId,
        name: `${file}`,
        stepId: props.stepId,
        value,
      },
    });

    if (isDirectory(file)) return;

    // For some reason the active file can not be set as soon as the file is created.
    setTimeout(() => {
      if (props.selectFile) {
        props.selectFile(file);
      }
    }, 75);
  };

  const deleteFile = async (file: string, isDirectory?: boolean) => {
    const confirm = window.confirm(
      isDirectory
        ? `Are you sure you want to delete the folder ${file} and its contents?`
        : `Are you sure you want to delete ${file}?`
    );

    if (!confirm) return;

    const modules = props.codeModules?.filter(
      (module) => module.name!.indexOf(file) > -1
    );

    if (!modules?.length) return;

    modules.map(async (val) => {
      if (val.isEntry) {
        window.alert('Cannot delete entry file.');
        return;
      }
      await deleteCodeModule({
        refetchQueries: ['Step'],
        variables: { uuid: val.uuid },
      });
    });
  };

  const updateEntryFile = async ({
    newId,
    oldId,
  }: {
    newId?: string;
    oldId?: string;
  }) => {
    await updateCodeModuleEntryFile({
      refetchQueries: ['Step'],
      variables: {
        newId,
        oldId,
      },
    });
  };

  if (!props.files) return null;

  return isFileExplorerOpen ? (
    <div className="flex-1 sm:flex-auto md:w-48">
      <FilesList
        closeExplorer={() => isFileExplorerOpenVar(false)}
        name={'Files'}
        onCreate={createFile}
        onDelete={deleteFile}
        onUpdateCodeModuleEntryFile={updateEntryFile}
        {...props}
      />
      {props.isEditing && (
        <FilesList name={'Tests'} onDelete={deleteFile} {...props} />
      )}
    </div>
  ) : (
    <div
      className="w-0.5 h-full bg-bg-nav-offset-faded hover:bg-bg-nav-offset opacity-50 hover:opacity-100 transition-all duration-200 cursor-e-resize"
      id="file-explorer-click-target"
      onMouseDown={() => {
        document.addEventListener('mouseup', (e) => {
          // @ts-ignore
          if (e?.target?.id === 'file-explorer-click-target') {
            isFileExplorerOpenVar(true);
          }
        });
      }}
    />
  );
};

type Props = {
  activeFile: string;
  codeModules?: RegularCodeModuleFragment[] | null;
  files: { [key in string]: { code: string } };
  isEditing?: boolean;
  lessonId?: number;
  selectFile?: (path: string) => void;
  stepId: number;
};

export default EditorFiles;
