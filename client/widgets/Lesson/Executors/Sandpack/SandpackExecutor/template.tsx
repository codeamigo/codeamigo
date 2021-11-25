import {
  SandpackLayout,
  SandpackPreview,
  useActiveCode,
  useSandpack,
} from '@codesandbox/sandpack-react';
import React from 'react';

import { CheckpointTypeEnum } from '👨‍💻generated/graphql';
import CTA from '👨‍💻widgets/CTA';
import Console from '👨‍💻widgets/Lesson/Console';
import Editor from '👨‍💻widgets/Lesson/Editor';
import EditorFiles from '👨‍💻widgets/Lesson/EditorFiles';
import Separator from '👨‍💻widgets/Lesson/Separator';

import { Props as OwnProps } from '.';

const SandpackTemplate: React.FC<Props> = (props) => {
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
    session,
    step,
    updateWidths,
  } = props;
  const { updateCode } = useActiveCode();
  const { dispatch, sandpack } = useSandpack();
  const { activePath } = sandpack;

  const handleRunTests = () => {
    onTestStart();
    const checkpoint = step.checkpoints?.find(
      ({ id }) => id === step.currentCheckpointId
    );
    if (!checkpoint) return;

    switch (checkpoint.type) {
      case CheckpointTypeEnum.Spec:
        // @ts-ignore
        dispatch({ type: 'run-all-tests' });
        break;
      case CheckpointTypeEnum.Match:
        onRunMatchTest(checkpoint);
    }
  };

  return (
    <SandpackLayout>
      <div
        className="flex z-50 flex-col justify-between w-2/6 md:w-48 border-r sm:border-b-0 bg-bg-primary border-bg-nav-offset-faded"
        ref={filesRef}
        style={{ minHeight: '20rem' }}
      >
        <div className="h-full">
          <EditorFiles
            activePath={activePath}
            codeModules={step.codeModules}
            lessonId={props.lesson?.id}
            stepId={step.id}
            {...props}
            files={files!}
            selectFile={sandpack.openFile}
          />
        </div>
        <div className="p-2">
          <CTA
            {...props}
            bundlerReady={
              sandpack.status === 'running' && !!sandpack.bundlerState
            }
            handleRunTests={handleRunTests}
            loading={loading}
            nextStep={nextStep}
            step={step}
          />
        </div>
      </div>
      <div
        className="z-20 w-full md:w-3/6 h-96 lg:h-full border-b sm:border-b-0 border-bg-nav-offset"
        ref={editorRef}
        style={{ height: filesHeight, maxHeight: filesHeight }}
      >
        <Editor
          activePath={activePath}
          codeModules={step.codeModules}
          isTyped
          refreshPreview={() => dispatch({ type: 'refresh' })}
          runCode={() => dispatch({ type: 'start' })}
          sessionId={session?.id}
          stepId={step.id}
          updateCode={updateCode}
          {...props}
        />
        <Separator
          iframeName="sp-preview-iframe"
          maxDrag={maxDragWidth}
          onChangeX={updateWidths}
          onDragEnd={onDragEnd}
        />
      </div>
      <div
        className="flex flex-col flex-grow w-full md:w-3/6 md:h-full"
        ref={previewRef}
      >
        <SandpackPreview />
        <Console
          runTests={handleRunTests}
          stepId={step.id}
          tabs={['console', 'tests']}
        />
      </div>
    </SandpackLayout>
  );
};

type Props = OwnProps & {
  files?: { [key in string]: { code: string } };
};

export default SandpackTemplate;
