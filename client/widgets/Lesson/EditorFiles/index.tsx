import React from 'react';

import {
  RegularCodeModuleFragment,
  useCreateCodeModuleMutation,
  useDeleteCodeModuleMutation,
  useUpdateCodeModuleEntryFileMutation,
} from '👨‍💻generated/graphql';

import { FilesType } from '../EditorV2/types';
import FilesList from './FilesList';

export type AlgoliaSearchResultType = {
  name: string;
  tags: { latest: string; next: string };
  version: string;
};

const EditorFiles: React.FC<Props> = ({ files, ...rest }) => {
  const [createCodeModule] = useCreateCodeModuleMutation();
  const [deleteCodeModule] = useDeleteCodeModuleMutation();
  const [updateCodeModuleEntryFile] = useUpdateCodeModuleEntryFileMutation();

  const createFile = async (file: string) => {
    const value = ``;

    await createCodeModule({
      refetchQueries: ['Step'],
      variables: { name: `/${file}`, stepId: rest.stepId, value },
    });
  };

  const deleteFile = async (file: string, isDirectory?: boolean) => {
    const confirm = window.confirm(
      isDirectory
        ? `Are you sure you want to delete the folder ${file} and its contents?`
        : `Are you sure you want to delete ${file}?`
    );

    if (!confirm) return;

    const modules = rest.codeModules?.filter(
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
        variables: { id: val.id },
      });
    });
  };

  if (!files) return null;

  return (
    <>
      <FilesList
        name={'Files'}
        onCreate={createFile}
        onDelete={deleteFile}
        onUpdateCodeModuleEntryFile={updateCodeModuleEntryFile}
        {...rest}
      />
      {rest.isEditing && (
        <FilesList name={'Tests'} onDelete={deleteFile} {...rest} />
      )}
    </>
  );
};

type Props = {
  codeModules?: RegularCodeModuleFragment[] | null;
  files: FilesType;
  isEditing?: boolean;
  stepId: number;
};

export default EditorFiles;
