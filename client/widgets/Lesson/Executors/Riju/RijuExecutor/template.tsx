import { useReactiveVar } from '@apollo/client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { isExecutingVar } from '👨‍💻apollo/cache/lesson';
import Button from '👨‍💻components/Button';
import { CheckpointTypeEnum, Maybe } from '👨‍💻generated/graphql';
import CTA from '👨‍💻widgets/CTA';
import Console from '👨‍💻widgets/Lesson/Console';
import Editor from '👨‍💻widgets/Lesson/Editor';
import EditorFiles from '👨‍💻widgets/Lesson/EditorFiles';
import { Props as OwnProps } from '👨‍💻widgets/Lesson/Executors';
import RunButton from '👨‍💻widgets/Lesson/Executors/Riju/RijuExecutor/RunButton';
import Separator from '👨‍💻widgets/Lesson/Separator';
import StepPosition from '👨‍💻widgets/Lesson/StepPosition';
import LessonBottomBarWrapper from '👨‍💻widgets/LessonBottomBarWrapper';

const RijuTemplate: React.FC<Props> = (props) => {
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
  const checkpointRef = useRef<any | undefined>();
  const entryFileValueRef = useRef<Maybe<string> | undefined>();
  const [activeFile, setActivePath] = useState<string | null>(null);

  const entryFile = step?.codeModules?.find(({ isEntry }) => !!isEntry);

  checkpointRef.current = checkpoints?.find(
    ({ id }) => id === step.currentCheckpointId
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.event === 'execution_has_results') {
        isExecutingVar(false);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    entryFileValueRef.current = entryFile?.value;
  }, [step.id]);

  const updateCode = (code: string) => {
    entryFileValueRef.current = code;
  };

  const handleRunCode = useCallback(() => {
    previewRef.current
      ?.getElementsByTagName('iframe')[0]
      .contentWindow?.postMessage(
        {
          code: entryFileValueRef.current,
          event: 'runCode',
        },
        '*'
      );
  }, [entryFileValueRef.current]);

  const handleRunTests = useCallback(() => {
    const checkpoint = checkpointRef.current;
    if (checkpoint?.isTested || !checkpoint) {
      props.ctaRef.current?.click();
      return;
    }

    isExecutingVar(true);
    const shouldRunTests = checkpoint?.type === CheckpointTypeEnum.Output;

    if (checkpoint) {
      switch (checkpoint.type) {
        case CheckpointTypeEnum.Output:
          isExecutingVar(true);
          break;
        case CheckpointTypeEnum.Match:
          onRunMatchTest(checkpoint);
      }
    }

    if (shouldRunTests) onTestStart();

    previewRef.current
      ?.getElementsByTagName('iframe')[0]
      .contentWindow?.postMessage(
        {
          code: entryFileValueRef.current,
          event: shouldRunTests ? 'testCode' : 'runCode',
          expectedOutput: shouldRunTests ? checkpoint.output : null,
        },
        '*'
      );

    setTimeout(() => {
      isExecutingVar(false);
    }, 3000);
  }, [entryFileValueRef.current]);

  return (
    <div className="sp-wrapper">
      <div className="sp-layout">
        <div
          className="flex z-50 flex-col justify-between border-r sm:border-b-0 bg-bg-primary border-bg-nav-offset-faded"
          ref={filesRef}
          style={{ minHeight: '20rem' }}
        >
          <div className="flex flex-col h-full">
            <div className="h-full">
              <EditorFiles
                activeFile={activeFile || (entryFile?.name as string)}
                codeModules={step.codeModules}
                lessonId={props.lesson?.id}
                stepId={step.id}
                {...props}
                files={files!}
                selectFile={setActivePath}
              />
            </div>
            <LessonBottomBarWrapper padding={false} />
          </div>
        </div>
        <div
          className="z-20 w-3/6 md:w-2/6 h-96 md:h-full border-bg-nav-offset"
          ref={editorRef}
          style={{ height: filesHeight, maxHeight: filesHeight }}
        >
          <div className="flex flex-col h-full bg-bg-primary">
            <Editor
              activeFile={activeFile || (entryFile?.name as string)}
              codeModules={step.codeModules}
              runCode={handleRunCode}
              sessionId={session?.id}
              stepId={step.id}
              testCode={handleRunTests}
              updateCode={updateCode}
              {...props}
            />
            <div className="absolute md:top-1/2 right-2 md:-right-6 bottom-16 md:bottom-2 z-30 md:-mt-6 mb-2 md:mb-0 h-fit-content">
              <RunButton
                isExecuting={useReactiveVar(isExecutingVar)}
                run={handleRunCode}
              />
            </div>
            <Separator
              iframeName="riju-frame"
              maxDrag={maxDragWidth}
              onChangeX={updateWidths}
              onDragEnd={onDragEnd}
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
                bundlerReady
                handleRunTests={handleRunTests}
                loading={loading}
                nextStep={nextStep}
                ref={props.ctaRef}
                step={step}
              />
            </LessonBottomBarWrapper>
          </div>
        </div>
        <div
          className="flex flex-col flex-grow w-full md:w-3/6 h-96 md:h-full"
          ref={previewRef}
        >
          {/* eslint-disable-next-line */}
          <iframe
            className="h-full bg-bg-primary riju-frame"
            src={`https://riju.codeamigo.xyz/${step.lang}`}
          />
          {checkpoints?.length ? (
            <Console
              runTests={handleRunTests}
              stepId={step.id}
              tabs={['tests']}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

type Props = OwnProps & {
  files?: { [key in string]: { code: string } };
};

export default RijuTemplate;
