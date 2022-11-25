import {
  SandpackLayout,
  SandpackPreview,
  useActiveCode,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { useWindowSize } from 'hooks/useWindowSize';
import React, { useRef } from 'react';

import Button from '👨‍💻components/Button';
import { CheckpointTypeEnum } from '👨‍💻generated/graphql';
import CTA from '👨‍💻widgets/CTA';
import Console from '👨‍💻widgets/Lesson/Console';
import Editor from '👨‍💻widgets/Lesson/Editor';
import EditorFiles from '👨‍💻widgets/Lesson/EditorFiles';
import { Props as OwnProps } from '👨‍💻widgets/Lesson/Executors';
import Separator from '👨‍💻widgets/Lesson/Separator';
import StepPosition from '👨‍💻widgets/Lesson/StepPosition';
import LessonBottomBarWrapper from '👨‍💻widgets/LessonBottomBarWrapper';

const SandpackTemplate: React.FC<Props> = (props) => {
  const {
    checkpoints,
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
    prevStep,
    previewRef,
    session,
    step,
    updateWidths,
  } = props;
  const { minWidth } = useWindowSize();
  const { updateCode } = useActiveCode();
  const { dispatch, sandpack } = useSandpack();
  const { activeFile } = sandpack;
  const checkpointRef = useRef<any | undefined>();
  checkpointRef.current = checkpoints?.find(
    ({ id }) => id === step.currentCheckpointId
  );

  const triggerCTA = () => {
    props.ctaRef.current?.click();
  };

  const handleRunTests = () => {
    onTestStart();
    const checkpoint = checkpointRef.current;

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
        className="sm:flex hidden z-20 flex-col justify-between border-r sm:border-b-0 bg-bg-primary border-bg-nav-offset-faded"
        ref={filesRef}
        style={{ minHeight: '20rem' }}
      >
        <div className="flex flex-col h-full">
          <div className="h-full">
            <EditorFiles
              activeFile={activeFile}
              codeModules={step.codeModules}
              lessonId={props.lesson?.id}
              stepId={step.id}
              {...props}
              deleteFile={(path) => sandpack.updateFile(path, '')}
              files={files!}
              selectFile={sandpack.setActiveFile}
            />
          </div>
          <LessonBottomBarWrapper padding={false} />
        </div>
      </div>
      <div
        className="z-20 flex-1 sm:flex-auto w-4/6 md:w-3/6 h-96 md:h-full border-b sm:border-b-0 border-bg-nav-offset"
        ref={editorRef}
        style={{
          height: filesHeight || 'auto',
          maxHeight: filesHeight || 'auto',
          minHeight: '20rem',
        }}
      >
        <div className="flex flex-col h-full bg-bg-primary">
          {minWidth('sm') ? (
            <>
              <Editor
                activeFile={activeFile}
                codeModules={step.codeModules}
                isTyped
                refreshPreview={() => dispatch({ type: 'refresh' })}
                runCode={() => dispatch({ type: 'start' })}
                sessionId={session?.id}
                stepId={step.id}
                testCode={triggerCTA}
                updateCode={updateCode}
                {...props}
              />
              <LessonBottomBarWrapper padding>
                <div>
                  <Button
                    className="opacity-50 hover:opacity-100 transition-opacity"
                    nature="secondary"
                    onClick={prevStep}
                  >
                    👈 Previous
                  </Button>
                </div>
                <StepPosition {...props} />
                <CTA
                  {...props}
                  bundlerReady={
                    sandpack.status === 'running' && !!sandpack.bundlerState
                  }
                  handleRunTests={handleRunTests}
                  loading={loading}
                  nextStep={nextStep}
                  ref={props.ctaRef}
                  step={step}
                />
              </LessonBottomBarWrapper>
            </>
          ) : (
            <>
              <LessonBottomBarWrapper padding>
                <div>
                  <Button
                    className="opacity-50 hover:opacity-100 transition-opacity"
                    nature="secondary"
                    onClick={prevStep}
                  >
                    👈 Previous
                  </Button>
                </div>
                <StepPosition {...props} />
                <CTA
                  {...props}
                  bundlerReady={
                    sandpack.status === 'running' && !!sandpack.bundlerState
                  }
                  handleRunTests={handleRunTests}
                  loading={loading}
                  nextStep={nextStep}
                  ref={props.ctaRef}
                  step={step}
                />
              </LessonBottomBarWrapper>
              <Editor
                activeFile={activeFile}
                codeModules={step.codeModules}
                isTyped
                refreshPreview={() => dispatch({ type: 'refresh' })}
                runCode={() => dispatch({ type: 'start' })}
                sessionId={session?.id}
                stepId={step.id}
                testCode={triggerCTA}
                updateCode={updateCode}
                {...props}
              />
            </>
          )}
        </div>
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
          tabs={checkpoints?.length ? ['console', 'tests'] : ['console']}
        />
      </div>
    </SandpackLayout>
  );
};

type Props = OwnProps & {
  files?: { [key in string]: { code: string } };
};

export default SandpackTemplate;
