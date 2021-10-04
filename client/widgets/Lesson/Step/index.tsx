import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import { isTestingVar, testFailureVar } from '👨‍💻apollo/cache/lesson';
import { modalVar } from '👨‍💻apollo/cache/modal';
import {
  LessonQuery,
  RegularCheckpointFragment,
  RegularStepFragment,
  SessionDocument,
  SessionQuery,
  useCompleteStepMutation,
  useSetNextStepMutation,
  useStepQuery,
} from '👨‍💻generated/graphql';
import { CodeSandboxTestMsgType } from '👨‍💻widgets/Lesson/Console/Tests/types';
import RijuExecutor from '👨‍💻widgets/Lesson/Executors/Riju/RijuExecutor';
import SandpackExecutor from '👨‍💻widgets/Lesson/Executors/Sandpack/SandpackExecutor';
import Instructions from '👨‍💻widgets/Lesson/Instructions';

const Step: React.FC<Props> = (props) => {
  const { currentStepId: id, session, setCurrentStepId, showSteps } = props;
  const previewRef = useRef<any>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [completeStep] = useCompleteStepMutation();
  const [setNextStep] = useSetNextStepMutation();

  const { data: newData, loading, previousData } = useStepQuery({
    fetchPolicy: 'cache-and-network',
    variables: { id },
  });
  const [initialPreviewWidth, setInitialPreviewWidth] = useState<null | number>(
    null
  );
  const [initialEditorWidth, setInitialEditorWidth] = useState<null | number>(
    null
  );
  const [maxDragWidth, setMaxDragWidth] = useState<null | number>(null);
  const [filesHeight, setFilesHeight] = useState<undefined | number>(undefined);

  const data = newData || previousData;

  useEffect(() => {
    if (previewRef.current) {
      setInitialPreviewWidth(previewRef.current.offsetWidth);
    }
  }, [previewRef.current]);

  useEffect(() => {
    if (editorRef.current) {
      setInitialEditorWidth(editorRef.current.offsetWidth);
    }
  }, [editorRef.current]);

  useEffect(() => {
    const setHeightCallback = () => {
      if (filesRef.current) {
        setFilesHeight(filesRef.current.offsetHeight);
      }
    };
    setHeightCallback();
    window.addEventListener('resize', setHeightCallback);
    return () => window.removeEventListener('resize', setHeightCallback);
  }, [filesRef.current]);

  if (!data) return null;
  if (!data.step) return null;

  const nextStep = () => {
    if (!session?.steps) return;
    if (!setCurrentStepId) return;
    if (!data.step) return;

    const next = session.steps.find(
      (nextStep) =>
        data.step?.createdAt && nextStep.createdAt > data.step.createdAt
    );

    const q = {
      query: SessionDocument,
      variables: { lessonId: session?.lesson.id },
    };

    if (next) {
      setNextStep({
        update: (store) => {
          const sessionData = store.readQuery<SessionQuery>(q);
          if (!sessionData?.session) return;

          store.writeQuery<SessionQuery>({
            ...q,
            data: {
              session: {
                ...sessionData.session,
                currentStep: next.id,
              },
            },
          });
        },
        variables: { sessionId: session.id, stepId: next.id },
      });
    }

    completeStep({
      update: (store, { data }) => {
        const sessionData = store.readQuery<SessionQuery>(q);
        if (!sessionData?.session) return;
        if (!sessionData?.session?.steps) return;

        store.writeQuery<SessionQuery>({
          ...q,
          data: {
            session: {
              ...sessionData.session,
              steps: sessionData.session.steps.map((step) => {
                if (step.id !== data?.completeStep?.id) return step;

                return {
                  ...step,
                  isCompleted: true,
                };
              }),
            },
          },
        });
      },
      variables: { id: data.step.id },
    });

    if (!next) {
      modalVar({
        callback: () => router.push('/'),
        data: {
          lessonTitle: session.lesson.title,
        },
        name: 'lessonFinished',
      });

      return;
    }

    // TODO: replace setCurrentStepId w/ session.currentStep
    // isEditing ? set lesson current step : set session
    setCurrentStepId(next?.id);
  };

  const updateWidths = (x: number) => {
    if (
      previewRef.current &&
      editorRef.current &&
      initialPreviewWidth &&
      initialEditorWidth
    ) {
      editorRef.current.style.width = initialEditorWidth - x + 'px';
      previewRef.current.style.width = initialPreviewWidth + x + 'px';
      setMaxDragWidth(initialEditorWidth + initialPreviewWidth);
    }
  };

  const onDragEnd = () => {
    if (previewRef.current && editorRef.current) {
      setInitialPreviewWidth(previewRef.current.offsetWidth);
      setInitialEditorWidth(editorRef.current.offsetWidth);
    }
  };

  const onTestStart = () => {
    isTestingVar(true);
    testFailureVar(false);

    // reinitialize CTA if something goes wrong during test run
    setTimeout(() => {
      isTestingVar(false);
    }, 3000);
  };

  const onRunMatchTest = (checkpoint: RegularCheckpointFragment) => {
    const file = data.step?.codeModules?.find(
      ({ name }) => checkpoint.fileToMatchRegex === name
    );
    const match = file?.value?.match(new RegExp(checkpoint.matchRegex!, 'g'));

    window.postMessage(
      {
        event: 'total_test_start',
        type: 'test',
      },
      '*'
    );

    window.postMessage(
      {
        $id: 0,
        codesandbox: true,
        event: 'test_end',
        test: {
          blocks: ['File', file?.name],
          duration: 1,
          errors: [],
          name: `should include ${checkpoint.matchRegex}.`,
          path: '',
          status: match ? 'pass' : 'fail',
        },
        type: 'test',
      } as CodeSandboxTestMsgType,
      '*'
    );

    window.postMessage(
      {
        event: 'total_test_end',
        type: 'test',
      },
      '*'
    );
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row md:h-full-minus">
        <Instructions
          nextStep={nextStep}
          step={data.step}
          steps={
            (session?.steps || props.lesson?.steps) as RegularStepFragment[]
          }
          {...props}
        />
        <div className="w-full h-full">
          {data.step.executionType === 'sandpack' ? (
            <SandpackExecutor
              editorRef={editorRef}
              filesHeight={filesHeight}
              filesRef={filesRef}
              loading={loading}
              maxDragWidth={maxDragWidth}
              nextStep={nextStep}
              onDragEnd={onDragEnd}
              onRunMatchTest={onRunMatchTest}
              onTestStart={onTestStart}
              previewRef={previewRef}
              step={data.step}
              updateWidths={updateWidths}
              {...props}
            />
          ) : (
            <RijuExecutor
              editorRef={editorRef}
              filesHeight={filesHeight}
              filesRef={filesRef}
              loading={loading}
              maxDragWidth={maxDragWidth}
              nextStep={nextStep}
              onDragEnd={onDragEnd}
              onRunMatchTest={onRunMatchTest}
              onTestStart={onTestStart}
              previewRef={previewRef}
              step={data.step}
              updateWidths={updateWidths}
              {...props}
            />
          )}
        </div>
      </div>
    </>
  );
};

export type Props = {
  currentStepId: number;
  isEditing?: boolean;
  isPreviewing?: boolean;
  lesson: LessonQuery['lesson'];
  session?: SessionQuery['session'];
  setCurrentStepId?: (n: number) => void;
  setShowSteps: (val: boolean) => void;
  showSteps: boolean;
};

export default Step;
