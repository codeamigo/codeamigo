import '@codesandbox/sandpack-react/dist/index.css';

import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from '@codesandbox/sandpack-react';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import {
  LessonQuery,
  RegularStepFragment,
  SessionDocument,
  SessionQuery,
  useCompleteStepMutation,
  useSetNextStepMutation,
  useStepQuery,
} from '👨‍💻generated/graphql';
import CTA from '👨‍💻widgets/CTA';
import Console from '👨‍💻widgets/Lesson/Console';
import EditorFiles from '👨‍💻widgets/Lesson/EditorFiles';
import EditorV2 from '👨‍💻widgets/Lesson/EditorV2';
import Instructions from '👨‍💻widgets/Lesson/Instructions';
import Separator from '👨‍💻widgets/Lesson/Separator';

const modToFile = (acc: { [key in string]: string }, curr: any) => ({
  ...acc,
  [curr.name as string]: curr.value,
});

const Step: React.FC<Props> = ({
  currentStepId: id,
  session,
  setCurrentStepId,
  showSteps,
  ...rest
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [completeStep] = useCompleteStepMutation();
  const [setNextStep] = useSetNextStepMutation();
  const [cachedFiles, setCachedFiles] = useState<
    null | { [key in string]: string }
  >(null);
  const [cachedMain, setCachedMain] = useState<string | undefined>(undefined);
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
    if (data?.step?.codeModules && data.step.checkpoints) {
      let mods = data.step.codeModules;
      // if theres a test only eval that test
      // to allow multiple checkpoints
      const test = data.step.checkpoints.find(
        ({ id }) => id === data.step?.currentCheckpointId
      )?.test;
      if (test) {
        mods = data.step.codeModules.filter((val) => {
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
  }, [
    data?.step?.id,
    data?.step?.codeModules?.length,
    data?.step?.currentCheckpointId,
  ]);

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
      setFilesHeight(filesRef.current!.offsetHeight);
    };
    if (filesRef.current) {
      setHeightCallback();
      window.addEventListener('resize', setHeightCallback);
    }
    return window.removeEventListener('resize', setHeightCallback);
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

  const files = data.step?.codeModules?.reduce(modToFile, {});

  if (!cachedFiles) return null;

  console.log(filesHeight);

  return (
    <>
      <div className="flex flex-col lg:flex-row md:h-full-minus">
        <Instructions
          nextStep={nextStep}
          showSteps={showSteps}
          step={data.step}
          steps={
            (session?.steps || rest.lesson?.steps) as RegularStepFragment[]
          }
          {...rest}
        />
        <div className="w-full h-full">
          <SandpackProvider
            customSetup={{
              files: cachedFiles,
              main: cachedMain,
            }}
          >
            <SandpackLayout>
              <div
                className="md:w-48 w-2/6 flex flex-col justify-between bg-bg-primary z-50 border-bg-nav-offset-faded border-r border-b sm:border-b-0"
                ref={filesRef}
                style={{ minHeight: '20rem' }}
              >
                <div className="h-full">
                  <EditorFiles
                    codeModules={data.step.codeModules}
                    files={files!}
                    stepId={data.step.id}
                    {...rest}
                  />
                </div>
                <div className="p-2">
                  <CTA
                    {...rest}
                    loading={loading}
                    nextStep={nextStep}
                    step={data.step}
                  />
                </div>
              </div>
              <div
                className="md:w-2/6 w-4/6 lg:h-full z-20 sm:border-b-0 border-b border-bg-nav-offset"
                ref={editorRef}
                style={{ height: filesHeight, maxHeight: filesHeight }}
              >
                <EditorV2
                  codeModules={data.step.codeModules}
                  stepId={data.step.id}
                  {...rest}
                />
                <Separator
                  maxDrag={maxDragWidth}
                  onChangeX={updateWidths}
                  onDragEnd={onDragEnd}
                />
              </div>
              <div
                className="md:w-3/6 md:h-full w-full flex flex-col flex-grow"
                ref={previewRef}
              >
                <SandpackPreview />
                <Console />
              </div>
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </div>
    </>
  );
};

type Props = {
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
