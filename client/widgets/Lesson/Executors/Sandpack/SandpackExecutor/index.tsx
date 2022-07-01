import { SandpackProvider } from '@codesandbox/sandpack-react';
import React, { useEffect, useState } from 'react';

import { Props } from '👨‍💻widgets/Lesson/Executors';
import SandpackTemplate from '👨‍💻widgets/Lesson/Executors/Sandpack/SandpackExecutor/template';
import { modToFile } from '👨‍💻widgets/Lesson/Executors/utils';

const SandpackExecutor: React.FC<Props> = (props) => {
  const { step } = props;
  const [cachedFiles, setCachedFiles] = useState<
    null | { [key in string]: { code: string } }
  >(null);
  const [cachedEntry, setCachedEntry] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (step?.codeModules && step.checkpoints) {
      let mods = step.codeModules;
      // if theres a test only eval that test
      // to allow multiple checkpoints
      const test = step.checkpoints.find(
        ({ id }) => id === step?.currentCheckpointId
      )?.test;
      if (test) {
        mods = step.codeModules.filter((val) => {
          if (val.name?.includes('spec')) {
            if (val.name === test) return true;
            else return false;
          }

          return true;
        });
      }

      const files = mods.reduce(modToFile, {});
      const main = mods.find(({ isEntry }) => isEntry)?.name || undefined;

      setCachedFiles(files);
      setCachedEntry(main);
    }
  }, [step?.id, step?.codeModules?.length, step?.currentCheckpointId]);

  if (!cachedFiles) return null;

  return (
    <SandpackProvider
      customSetup={{
        entry: cachedEntry,
      }}
      files={cachedFiles}
    >
      <SandpackTemplate {...props} files={cachedFiles} />
    </SandpackProvider>
  );
};

export default SandpackExecutor;
