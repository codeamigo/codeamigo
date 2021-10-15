import React, { useRef, useState } from 'react';

import { CheckpointTypeEnum } from '👨‍💻generated/graphql';
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
        previewRef.current
          ?.getElementsByTagName('iframe')[0]
          .contentWindow?.postMessage(
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
          className="flex z-50 flex-col justify-between w-2/6 md:w-48 border-r sm:border-b-0 bg-bg-primary border-bg-nav-offset-faded"
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
              bundlerReady
              handleRunTests={handleRunTests}
              loading={loading}
              nextStep={nextStep}
              selectFile={setActivePath}
              step={step}
            />
          </div>
        </div>
        <div
          className="z-20 w-4/6 md:w-2/6 h-96 lg:h-full border-b sm:border-b-0 border-bg-nav-offset"
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
          <div className="absolute md:top-1/2 right-2 md:-right-6 bottom-2 z-30 md:-mt-6">
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
          className="flex flex-col flex-grow w-full md:w-3/6 md:h-full"
          ref={previewRef}
        >
          {/* eslint-disable-next-line */}
          <iframe className="h-full bg-bg-primary riju-frame"
            src={`https://riju.codeamigo.xyz/${step.lang}`}
          />
          <Console
            runTests={handleRunTests}
            stepId={step.id}
            tabs={['tests']}
          />
        </div>
      </div>
    </div>
  );
};

type Props = OwnProps & {
  files?: { [key in string]: { code: string } };
};

export default RijuTemplate;
