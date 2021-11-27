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
import RijuExecutor from '👨‍💻widgets/Lesson/Executors/Riju/RijuExecutor';
import SandpackExecutor from '👨‍💻widgets/Lesson/Executors/Sandpack/SandpackExecutor';
import Instructions from '👨‍💻widgets/Lesson/Instructions';

const Step: React.FC<Props> = (props) => {
  const { currentStepId: id, lesson, session, setCurrentStepId } = props;
  const previewRef = useRef<any>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [completeStep] = useCompleteStepMutation({ errorPolicy: 'ignore' });
  const [setNextStep] = useSetNextStepMutation({ errorPolicy: 'ignore' });

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data?.step?.id]);

  if (!data) return null;
  if (!data.step) return null;

  const nextStep = () => {
    if (!session?.steps && !lesson?.steps) return;
    if (!setCurrentStepId) return;
    if (!data.step) return;

    const steps = session?.steps || lesson!.steps!;

    const next = steps.find(
      (nextStep) =>
        data.step?.createdAt && nextStep.createdAt > data.step.createdAt
    );

    const q = {
      query: SessionDocument,
      variables: { lessonId: session?.lesson.id },
    };

    if (next && session) {
      // User is authenticated

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
      // User is not authenticated
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

    if (!next && session) {
      modalVar({
        callback: () => router.push('/'),
        data: {
          lessonId: session.lesson.id,
          lessonTitle: session.lesson.title,
        },
        name: 'lessonFinished',
      });

      return;
    }

    if (!next && !props.isEditing) {
      modalVar({
        callback: () => router.push('/'),
        name: 'registerAfterPreview',
      });
    }

    next && setCurrentStepId(next.id);
  };

  const prevStep = () => {
    if (!session?.steps && !lesson?.steps) return;
    if (!setCurrentStepId) return;
    if (!data.step) return;

    const steps = session?.steps || lesson!.steps!;

    const prev = steps
      .filter((step) => step.createdAt < data.step!.createdAt)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];

    const q = {
      query: SessionDocument,
      variables: { lessonId: session?.lesson.id },
    };

    if (prev && session) {
      // User is authenticated

      setNextStep({
        update: (store) => {
          const sessionData = store.readQuery<SessionQuery>(q);
          if (!sessionData?.session) return;

          store.writeQuery<SessionQuery>({
            ...q,
            data: {
              session: {
                ...sessionData.session,
                currentStep: prev.id,
              },
            },
          });
        },
        variables: { sessionId: session.id, stepId: prev.id },
      });
      // User is not authenticated
    }

    setCurrentStepId(prev?.id);
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
    window.postMessage({ checkpoint, event: 'runMatchTest' }, '*');
  };

  const steps = (session?.steps ||
    props.lesson?.steps) as RegularStepFragment[];
  const currentStepNum = steps.findIndex(({ id }) => id === data?.step?.id) + 1;
  const totalStepsNum = steps.length;

  return (
    <>
      {/* eslint-disable-next-line */}
      <div className="flex flex-col lg:flex-row md:h-full-minus">
        <Instructions nextStep={nextStep} step={data.step} {...props} />
        <div className="w-full h-full">
          {data.step.executionType === 'sandpack' ? (
            <SandpackExecutor
              currentStepNum={currentStepNum}
              editorRef={editorRef}
              filesHeight={filesHeight}
              filesRef={filesRef}
              loading={loading}
              maxDragWidth={maxDragWidth}
              nextStep={nextStep}
              onDragEnd={onDragEnd}
              onRunMatchTest={onRunMatchTest}
              onTestStart={onTestStart}
              prevStep={prevStep}
              previewRef={previewRef}
              step={data.step}
              totalStepsNum={totalStepsNum}
              updateWidths={updateWidths}
              {...props}
            />
          ) : (
            <RijuExecutor
              currentStepNum={currentStepNum}
              editorRef={editorRef}
              filesHeight={filesHeight}
              filesRef={filesRef}
              loading={loading}
              maxDragWidth={maxDragWidth}
              nextStep={nextStep}
              onDragEnd={onDragEnd}
              onRunMatchTest={onRunMatchTest}
              onTestStart={onTestStart}
              prevStep={prevStep}
              previewRef={previewRef}
              step={data.step}
              totalStepsNum={totalStepsNum}
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
  setCurrentStepId: (n: number) => void;
  setShowSteps: (val: boolean) => void;
  showSteps: boolean;
};

export default Step;
