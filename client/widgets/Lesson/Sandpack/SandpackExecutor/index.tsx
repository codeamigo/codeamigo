import { SandpackProvider } from '@codesandbox/sandpack-react';
import React, { useEffect, useState } from 'react';

import { RegularStepFragment } from '👨‍💻generated/graphql';
import SandpackTemplate from '👨‍💻widgets/Lesson/Sandpack/SandpackExecutor/template';
import { Props as OwnProps } from '👨‍💻widgets/Lesson/Step';

const modToFile = (acc: { [key in string]: { code: string } }, curr: any) => ({
  ...acc,
  [curr.name as string]: { code: curr.value },
});

const SandpackExecutor: React.FC<Props> = (props) => {
  const { step } = props;
  const [cachedFiles, setCachedFiles] = useState<
    null | { [key in string]: { code: string } }
  >(null);
  const [cachedMain, setCachedMain] = useState<string | undefined>(undefined);

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
      setCachedMain(main);
    }
  }, [step?.id, step?.codeModules?.length, step?.currentCheckpointId]);

  const files = step?.codeModules?.reduce(modToFile, {});

  if (!cachedFiles) return null;

  return (
    <SandpackProvider
      customSetup={{
        files: cachedFiles,
        main: cachedMain,
      }}
    >
      <SandpackTemplate {...props} files={files} />
    </SandpackProvider>
  );
};

export type Props = OwnProps & {
  editorRef: React.RefObject<HTMLDivElement>;
  filesHeight?: number;
  filesRef: React.RefObject<HTMLDivElement>;
  loading: boolean;
  maxDragWidth: number | null;
  nextStep: () => void;
  onDragEnd: () => void;
  previewRef: React.RefObject<HTMLDivElement>;
  step: RegularStepFragment;
  updateWidths: (x: number) => void;
};

export default SandpackExecutor;
