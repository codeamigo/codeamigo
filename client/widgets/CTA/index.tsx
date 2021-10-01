import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';

import { isTestingVar, testFailureVar } from '👨‍💻apollo/cache/lesson';
import { modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import { Spinner } from '👨‍💻components/Spinners';
import {
  CheckpointTypeEnum,
  LessonQuery,
  RegularStepFragment,
  StepDocument,
  StepQuery,
  useCompleteCheckpointMutation,
  useCreateCheckpointMutation,
  usePassCheckpointMutation,
} from '👨‍💻generated/graphql';
import CheckpointWizard from '👨‍💻widgets/CTA/CheckpointWizard';
import {
  CodeSandboxTestMsgType,
  TestDataType,
} from '👨‍💻widgets/Lesson/Console/Tests/types';

const CTA: React.FC<Props> = ({
  bundlerState,
  handleRunTests,
  isEditing,
  isPreviewing,
  lesson,
  loading,
  nextStep,
  step,
}) => {
  const router = useRouter();
  const [createCheckpointM] = useCreateCheckpointMutation();
  const [completeCheckpointM] = useCompleteCheckpointMutation();
  const [passCheckpoint] = usePassCheckpointMutation();
  const isTesting = useReactiveVar(isTestingVar);

  const testsRef = useRef<TestDataType[]>([]);

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
          testFailureVar(true);
          return;
        } else {
          //  prompt register if previewing
          if (isPreviewing) {
            modalVar({
              callback: () =>
                lesson?.id
                  ? router.push(`/lessons/start/${lesson.id}`)
                  : router.push('/'),
              name: 'registerAfterPreview',
            });
            return;
          }

          if (!step.currentCheckpointId) return;

          await passCheckpoint({
            variables: { id: step.currentCheckpointId },
          });

          const lastCheckpointForStep =
            step.checkpoints &&
            step.checkpoints.findIndex(
              ({ id }) => id === step.currentCheckpointId
            ) ===
              step.checkpoints.length - 1;

          modalVar({
            callback: () =>
              lastCheckpointForStep ? nextStep() : completeCheckpoint(),
            name: 'testsPassed',
          });
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
      variables: {
        checkpointId: len + 1,
        stepId: step.id,
        type: CheckpointTypeEnum.Spec,
      },
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
    isTestingVar(true);
    testFailureVar(false);
    testsRef.current = [];
    handleRunTests();

    setTimeout(() => {
      isTestingVar(false);
    }, 3000);
  };

  const promptRegistration = () => {
    //  prompt register if previewing
    modalVar({
      callback: () =>
        lesson?.id
          ? router.push(`/lessons/start/${lesson.id}`)
          : router.push('/'),
      name: 'registerAfterPreview',
    });
  };

  const currentCheck = step.checkpoints?.find(
    ({ id }) => id === step.currentCheckpointId
  );
  const isTested = currentCheck?.isTested || !currentCheck;
  const isStepComplete = !step.checkpoints?.find(
    (checkpoint) => checkpoint.isCompleted === false
  );
  const text = isEditing ? 'Add Checkpoint' : isTested ? 'Next' : 'Test';
  const spinner = isTesting || !bundlerState || loading;
  const f = isPreviewing
    ? promptRegistration
    : isEditing
    ? createCheckpoint
    : isTested
    ? isStepComplete
      ? nextStep
      : completeCheckpoint
    : runTests;

  return isEditing ? (
    <div className="relative group pt-2">
      <Button className="h-14 justify-center w-full text-lg">
        Add Checkpoint
      </Button>
      <CheckpointWizard step={step} />
    </div>
  ) : (
    <Button
      className="h-14 justify-center w-full text-lg"
      disabled={spinner}
      onClick={f}
      type="button"
    >
      {spinner ? <Spinner /> : text}
    </Button>
  );
};

type Props = {
  bundlerState: any;
  handleRunTests: () => void;
  isEditing?: boolean;
  isPreviewing?: boolean;
  lesson: LessonQuery['lesson'];
  loading: boolean;
  nextStep: () => void;
  step: RegularStepFragment;
};

export default CTA;
