import React, { useEffect, useState } from 'react';

import { Props } from '👨‍💻widgets/Lesson/Executors';
import StackblitzTemplate from '👨‍💻widgets/Lesson/Executors/Stackblitz/StackblitzExecutor/template';
import {
  modToFile,
  modToStackblitzFile,
} from '👨‍💻widgets/Lesson/Executors/utils';

const StackblitzExecutor: React.FC<Props> = (props) => {
  const { step } = props;
  const [cachedFiles, setCachedFiles] = useState<
    null | { [key in string]: string }
  >(null);
  const [cachedEditorFiles, setCachedEditorFiles] = useState<
    null | { [key in string]: { code: string } }
  >(null);

  const [cachedEntry, setCachedEntry] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (step?.codeModules && step.checkpoints) {
      let mods = step.codeModules;

      const files = mods.reduce(modToStackblitzFile, {});
      const editorFiles = mods.reduce(modToFile, {});
      const main = mods.find(({ isEntry }) => isEntry)?.name || undefined;

      setCachedFiles(files);
      setCachedEditorFiles(editorFiles);
      setCachedEntry(main);
    }
  }, [step?.id, step?.codeModules?.length, step?.currentCheckpointId]);

  if (!cachedFiles) return null;
  if (!cachedEditorFiles) return null;

  return (
    <StackblitzTemplate
      {...props}
      editorFiles={cachedEditorFiles}
      files={cachedFiles || {}}
    />
  );
};

export default StackblitzExecutor;
