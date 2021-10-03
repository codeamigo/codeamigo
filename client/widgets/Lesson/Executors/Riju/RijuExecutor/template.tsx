import React, { useRef, useState } from 'react';

import { isTestingVar, testFailureVar } from '👨‍💻apollo/cache/lesson';
import {
  CheckpointTypeEnum,
  RegularCheckpointFragment,
} from '👨‍💻generated/graphql';
import CTA from '👨‍💻widgets/CTA';
import Console from '👨‍💻widgets/Lesson/Console';
import Editor from '👨‍💻widgets/Lesson/Editor';
import EditorFiles from '👨‍💻widgets/Lesson/EditorFiles';
import RunButton from '👨‍💻widgets/Lesson/Executors/Riju/RijuExecutor/RunButton';
import Separator from '👨‍💻widgets/Lesson/Separator';

import { Props as OwnProps } from '.';

const RijuTemplate: React.FC<Props> = (props) => {
  const {
    editorRef,
    files,
    filesHeight,
    filesRef,
    loading,
    maxDragWidth,
    nextStep,
    onDragEnd,
    onRunMatchTest,
    onTestStart,
    previewRef,
    step,
    updateWidths,
  } = props;
  const entryFileValueRef = useRef<string | undefined>();
  const entryFile = step?.codeModules?.find(({ isEntry }) => !!isEntry);
  const [activePath, setActivePath] = useState<string | null>(null);
  entryFileValueRef.current = entryFile?.value as string;

  const postCodeToRiju = () => {
    // @ts-ignore
    previewRef.current
      ?.getElementsByTagName('iframe')[0]
      .contentWindow?.postMessage(
        {
          code: entryFileValueRef.current,
          event: 'runCode',
        },
        '*'
      );
  };

  const handleRunTests = () => {
    onTestStart();
    const checkpoint = step.checkpoints?.find(
      ({ id }) => id === step.currentCheckpointId
    );
    if (!checkpoint) return;

    switch (checkpoint.type) {
      case CheckpointTypeEnum.Output:
        // @ts-ignore
        previewRef.current?.contentWindow?.postMessage(
          {
            code: entryFileValueRef.current,
            event: 'testCode',
            expectedOutput: checkpoint.output,
          },
          '*'
        );
        break;
      case CheckpointTypeEnum.Match:
        onRunMatchTest(checkpoint);
    }
  };

  return (
    <div className="sp-wrapper">
      <div className="sp-layout">
        <div
          className="md:w-48 w-2/6 flex flex-col justify-between bg-bg-primary z-50 border-bg-nav-offset-faded border-r sm:border-b-0"
          ref={filesRef}
          style={{ minHeight: '20rem' }}
        >
          <div className="h-full">
            <EditorFiles
              activePath={activePath || (entryFile?.name as string)}
              codeModules={step.codeModules}
              stepId={step.id}
              {...props}
              files={files!}
              selectFile={setActivePath}
            />
          </div>
          <div className="p-2">
            <CTA
              {...props}
              // bundlerState true needed for sandpack
              bundlerState
              handleRunTests={handleRunTests}
              loading={loading}
              nextStep={nextStep}
              selectFile={setActivePath}
              step={step}
            />
          </div>
        </div>
        <div
          className="md:w-2/6 w-4/6 lg:h-full h-96 z-20 sm:border-b-0 border-b border-bg-nav-offset"
          ref={editorRef}
          style={{ height: filesHeight, maxHeight: filesHeight }}
        >
          <Editor
            activePath={activePath || (entryFile?.name as string)}
            codeModules={step.codeModules}
            runCode={postCodeToRiju}
            stepId={step.id}
            {...props}
          />
          <div className="absolute bottom-2 right-2 md:top-1/2 md:-right-6 md:-mt-6 z-30">
            <RunButton run={postCodeToRiju} />
          </div>
          <Separator
            iframeName="riju-frame"
            maxDrag={maxDragWidth}
            onChangeX={updateWidths}
            onDragEnd={onDragEnd}
          />
        </div>
        <div
          className="md:w-3/6 md:h-full w-full flex flex-col flex-grow"
          ref={previewRef}
        >
          <iframe
            className="bg-bg-primary riju-frame h-full"
            src={`https://riju.codeamigo.xyz/${step.lang}`}
          />
          <Console runTests={handleRunTests} tabs={['tests']} />
        </div>
      </div>
    </div>
  );
};

type Props = OwnProps & {
  files?: { [key in string]: { code: string } };
};

export default RijuTemplate;
