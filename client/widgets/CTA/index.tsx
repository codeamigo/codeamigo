import { useSandpack } from '@codesandbox/sandpack-react';
import router from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';

import { isTestingVar } from '👨‍💻apollo/cache/lesson';
import { modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import {
  LessonQuery,
  RegularStepFragment,
  StepDocument,
  StepQuery,
  useCompleteCheckpointMutation,
  useCreateCheckpointMutation,
  usePassCheckpointMutation,
} from '👨‍💻generated/graphql';
import {
  CodeSandboxTestMsgType,
  TestDataType,
} from '👨‍💻widgets/Lesson/Console/Tests/types';

const CTA: React.FC<Props> = ({
  isEditing,
  isPreviewing,
  lesson,
  nextStep,
  step,
}) => {
  const sandpack = useSandpack();
  const [createCheckpointM] = useCreateCheckpointMutation();
  const [completeCheckpointM] = useCompleteCheckpointMutation();
  const [passCheckpoint] = usePassCheckpointMutation();

  const testsRef = useRef<TestDataType[]>([]);
  const { dispatch } = sandpack;

  const handlePassCheckpoint = async (
    message: MessageEvent<CodeSandboxTestMsgType>
  ) => {
    if (message.data.type !== 'test') return;
    // don't pass checkpoint if editting
    if (isEditing) {
      isTestingVar(false);
      return;
    }

    switch (message.data.event) {
      case 'test_end':
        testsRef.current = [...testsRef.current, message.data.test];
        break;
      case 'total_test_end':
        isTestingVar(false);
        if (testsRef.current.some(({ status }) => status === 'fail')) {
          alert('Tests failure.');
        } else {
          //  prompt register if previewing
          if (isPreviewing) {
            modalVar({
              callback: () =>
                lesson?.id
                  ? router.push(`/lessons/start/${lesson.id}`)
                  : router.push('/home'),
              name: 'registerAfterPreview',
            });
            return;
          }

          if (!step.currentCheckpointId) return;

          await passCheckpoint({
            variables: { id: step.currentCheckpointId },
          });

          // if it's the last checkpoint also complete it
          if (
            step.checkpoints &&
            step.checkpoints.findIndex(
              ({ id }) => id === step.currentCheckpointId
            ) ===
              step.checkpoints.length - 1
          ) {
            await completeCheckpoint();
          }
        }
    }
  };

  useEffect(() => {
    window.addEventListener('message', handlePassCheckpoint);

    return () => window.removeEventListener('message', handlePassCheckpoint);
  }, [step.currentCheckpointId]);

  const createCheckpoint = async () => {
    const len = step.checkpoints?.length || 0;

    await createCheckpointM({
      refetchQueries: ['Checkpoints', 'Step'],
      variables: { checkpointId: len + 1, stepId: step.id },
    });
  };

  const completeCheckpoint = async () => {
    // don't complete checkpoint if editting
    if (isEditing) return;
    if (!step.currentCheckpointId) return;

    const q = {
      query: StepDocument,
      variables: { id: step.id },
    };
    await completeCheckpointM({
      update: (store) => {
        const stepData = store.readQuery<StepQuery>(q);
        if (!stepData?.step) return;

        // TODO: refactor this
        const nextCheckpointId = stepData?.step?.checkpoints?.find(
          ({ isCompleted }) => !isCompleted
        )?.id;

        store.writeQuery<StepQuery>({
          ...q,
          data: {
            step: {
              ...stepData.step,
              currentCheckpointId:
                nextCheckpointId || stepData.step.currentCheckpointId,
            },
          },
        });
      },
      variables: { id: step.currentCheckpointId },
    });
  };

  const runTests = () => {
    testsRef.current = [];
    // @ts-ignore
    dispatch({ type: 'run-all-tests' });
  };

  const currentCheck = step.checkpoints?.find(
    ({ id }) => id === step.currentCheckpointId
  );
  const isTested = currentCheck?.isTested || !currentCheck;
  const isStepComplete = !step.checkpoints?.find(
    (checkpoint) => checkpoint.isCompleted === false
  );
  const text = isEditing ? 'Add Checkpoint' : isTested ? 'Next' : 'Test';
  const f = isEditing
    ? createCheckpoint
    : isTested
    ? isStepComplete
      ? nextStep
      : completeCheckpoint
    : runTests;

  return (
    <Button
      className="h-14 justify-center w-full text-lg"
      onClick={f}
      type="button"
    >
      {text}
    </Button>
  );
};

type Props = {
  isEditing?: boolean;
  isPreviewing?: boolean;
  lesson: LessonQuery['lesson'];
  nextStep: () => void;
  step: RegularStepFragment;
};

export default CTA;
