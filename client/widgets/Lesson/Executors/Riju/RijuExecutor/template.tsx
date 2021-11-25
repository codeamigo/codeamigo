import React, { useEffect, useRef, useState } from 'react';

import Button from '👨‍💻components/Button';
import { CheckpointTypeEnum } from '👨‍💻generated/graphql';
import CTA from '👨‍💻widgets/CTA';
import Console from '👨‍💻widgets/Lesson/Console';
import Editor from '👨‍💻widgets/Lesson/Editor';
import EditorFiles from '👨‍💻widgets/Lesson/EditorFiles';
import RunButton from '👨‍💻widgets/Lesson/Executors/Riju/RijuExecutor/RunButton';
import Separator from '👨‍💻widgets/Lesson/Separator';
import LessonBottomBarWrapper from '👨‍💻widgets/LessonBottomBarWrapper';

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
    prevStep,
    previewRef,
    session,
    step,
    updateWidths,
  } = props;
  const entryFileValueRef = useRef<string | undefined>();
  const [isExecuting, setIsExecuting] = React.useState(false);
  const entryFile = step?.codeModules?.find(({ isEntry }) => !!isEntry);
  const [activePath, setActivePath] = useState<string | null>(null);
  entryFileValueRef.current = entryFile?.value as string;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.event === 'execution_has_results') {
        setIsExecuting(false);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const updateCode = (code: string) => {
    entryFileValueRef.current = code;
  };

  const postCodeToRiju = () => {
    setIsExecuting(true);
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
        setIsExecuting(true);
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
          <div className="flex flex-col h-full">
            <EditorFiles
              activePath={activePath || (entryFile?.name as string)}
              codeModules={step.codeModules}
              lessonId={props.lesson?.id}
              stepId={step.id}
              {...props}
              files={files!}
              selectFile={setActivePath}
            />
            <LessonBottomBarWrapper />
          </div>
        </div>
        <div
          className="z-20 w-4/6 md:w-2/6 h-96 lg:h-full border-b sm:border-b-0 border-bg-nav-offset"
          ref={editorRef}
          style={{ height: filesHeight, maxHeight: filesHeight }}
        >
          <div className="flex flex-col h-full bg-bg-primary">
            <Editor
              activePath={activePath || (entryFile?.name as string)}
              codeModules={step.codeModules}
              runCode={postCodeToRiju}
              sessionId={session?.id}
              stepId={step.id}
              updateCode={updateCode}
              {...props}
            />
            <div className="absolute md:top-1/2 right-2 md:-right-6 bottom-2 z-30 md:-mt-6">
              <RunButton isExecuting={isExecuting} run={postCodeToRiju} />
            </div>
            <Separator
              iframeName="riju-frame"
              maxDrag={maxDragWidth}
              onChangeX={updateWidths}
              onDragEnd={onDragEnd}
            />
            <LessonBottomBarWrapper>
              <div>
                <Button
                  className="opacity-50 hover:opacity-100 transition-opacity"
                  nature="secondary"
                  onClick={prevStep}
                >
                  👈 Previous
                </Button>
              </div>
              <CTA
                {...props}
                bundlerReady
                handleRunTests={handleRunTests}
                loading={loading}
                nextStep={nextStep}
                step={step}
              />
            </LessonBottomBarWrapper>
          </div>
        </div>
        <div
          className="flex flex-col flex-grow w-full md:w-5/12 md:h-full"
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
