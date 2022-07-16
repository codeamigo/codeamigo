import StackblitzSdk, { FsDiff, VM } from '@stackblitz/sdk';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import Button from '👨‍💻components/Button';
import { CheckpointTypeEnum, Maybe } from '👨‍💻generated/graphql';
import CTA from '👨‍💻widgets/CTA';
import Console from '👨‍💻widgets/Lesson/Console';
import Editor from '👨‍💻widgets/Lesson/Editor';
import EditorFiles from '👨‍💻widgets/Lesson/EditorFiles';
import { Props as OwnProps } from '👨‍💻widgets/Lesson/Executors';
import Separator from '👨‍💻widgets/Lesson/Separator';
import StepPosition from '👨‍💻widgets/Lesson/StepPosition';
import LessonBottomBarWrapper from '👨‍💻widgets/LessonBottomBarWrapper';

import { isDirectory } from '../../utils';

const StackblitzTemplate: React.FC<Props> = (props) => {
  const {
    checkpoints,
    editorFiles,
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
  const [VM, setVM] = useState<VM | null>(null);
  const checkpointRef = useRef<any | undefined>();
  const entryFileValueRef = useRef<Maybe<string> | undefined>();
  const [activeFile, setActivePath] = useState<string | null>(null);

  const entryFile = step?.codeModules?.find(({ isEntry }) => !!isEntry);

  checkpointRef.current = checkpoints?.find(
    ({ id }) => id === step.currentCheckpointId
  );

  useEffect(() => {
    const setupVM = async () => {
      const stackblitzVM = await StackblitzSdk.embedProject(
        'stackblitz',
        {
          description: '',
          files,
          template: 'node',
          title: '',
        },
        { view: 'preview' }
      );
      setVM(stackblitzVM);
    };
    setupVM();
  }, []);

  useEffect(() => {
    entryFileValueRef.current = entryFile?.value;
  }, [step.id]);

  useEffect(() => {
    if (!VM) return;
    const getDiff = async () => {
      const snapshot = await VM.getFsSnapshot();
      const diff = { create: {}, destroy: [] } as FsDiff;
      if (!snapshot) return diff;

      Object.keys(snapshot).map((file) => {
        if (isDirectory(file)) return;

        if (files[file] === undefined) {
          diff.destroy.push(file);
        }
      });

      Object.keys(files).map((file) => {
        if (isDirectory(file)) return;

        if (snapshot[file] !== files[file]) {
          diff.create[file] = files[file];
        }
      });

      return diff;
    };

    const applyDiff = async () => {
      const diff = await getDiff();
      VM.applyFsDiff(diff);
    };

    applyDiff();
  }, [VM, step.id, files]);

  const updateCode = useCallback(
    (code: string) => {
      const file = activeFile?.substring(1);
      VM?.applyFsDiff({
        create: { [file as string]: code },
        destroy: [],
      });
    },
    [VM, activeFile]
  );

  const handleRunTests = useCallback(() => {
    onTestStart();
    const checkpoint = checkpointRef.current;

    if (!checkpoint) return;

    switch (checkpoint.type) {
      case CheckpointTypeEnum.Match:
        onRunMatchTest(checkpoint);
    }
  }, []);

  return (
    <div className="sp-wrapper">
      <div className="sp-layout">
        <div
          className="flex z-40 flex-col justify-between bg-bg-primary border-r sm:border-b-0 border-bg-nav-offset-faded"
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
                files={editorFiles!}
                selectFile={setActivePath}
              />
            </div>
            <LessonBottomBarWrapper padding={false} />
          </div>
        </div>
        <div
          className="z-20 flex-1 sm:flex-auto sm:w-3/6 h-96 md:h-full border-bg-nav-offset"
          ref={editorRef}
          style={{ height: filesHeight, maxHeight: filesHeight }}
        >
          <div className="flex flex-col h-full bg-bg-primary">
            <Editor
              activeFile={activeFile || (entryFile?.name as string)}
              codeModules={step.codeModules}
              isTyped
              runCode={() => void 0}
              sessionId={session?.id}
              stepId={step.id}
              testCode={handleRunTests}
              updateCode={updateCode}
              {...props}
            />
            <Separator
              iframeName="stackblitz"
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
          <div className="h-full" id="stackblitz" />
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
  editorFiles: { [key in string]: { code: string } };
  files: { [key in string]: string };
};

export default StackblitzTemplate;
