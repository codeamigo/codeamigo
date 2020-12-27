import Icon from '@components/Icon';
import {
  RegularStepFragment,
  useCreateStepMutation,
  useDeleteStepMutation,
  useLessonQuery,
} from '@generated/graphql';
import React from 'react';

import styles from './Steps.module.scss';

const Steps: React.FC<Props> = ({
  steps,
  lessonId,
  currentStepId,
  setCurrentStepId,
  toggleShowSteps,
}) => {
  const [createStepM] = useCreateStepMutation();
  const [deleteStepM] = useDeleteStepMutation();

  const createStep = async () => {
    const step = await createStepM({
      refetchQueries: ['Lesson'],
      variables: { lessonId },
    });

    if (!step.data?.createStep?.id) return;

    setCurrentStepId(step.data?.createStep?.id);
  };

  const deleteStep = async (id: number, idx: number) => {
    const sortedSteps = steps
      .slice()
      .sort((a, b) => (b.createdAt < a.createdAt ? 1 : -1));

    const res = await deleteStepM({
      refetchQueries: ['Lesson'],
      variables: { id },
    });

    setCurrentStepId(sortedSteps[idx - 1].id);
  };

  return (
    <>
      <Icon
        className="absolute left-4 text-xl text-black cursor-pointer"
        name="list"
        onClick={toggleShowSteps}
      />
      <ol>
        {steps
          .slice()
          .sort((a, b) => (b.createdAt < a.createdAt ? 1 : -1))
          .map((step, i) => {
            return (
              <li
                className={`${
                  currentStepId === step.id ? 'text-blue-600' : ''
                } list-none cursor-pointer w-full flex justify-between items-center ${
                  styles.STEP
                }`}
                key={step.id}
                onClick={() => setCurrentStepId(step.id)}
              >
                <span>Step {step.id}</span>
                <Icon
                  className="text-red-600 hidden"
                  name="minus-circled"
                  onClick={() => deleteStep(step.id, i)}
                />
              </li>
            );
          })}
      </ol>
      <button
        className="inline-flex justify-center py-2 px-4 mt-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 whitespace-nowrap"
        onClick={createStep}
        type="button"
      >
        Add Step
      </button>
    </>
  );
};

type Props = {
  lessonId: number;
  currentStepId: number;
  steps: RegularStepFragment[];
  setCurrentStepId: (n: number) => void;
  toggleShowSteps: () => void;
};

export default Steps;
